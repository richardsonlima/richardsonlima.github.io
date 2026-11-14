/* Lesson content, Etapas 10 e 11 (lições 58 a 70)
   Concorrência & async, High performance
   Schema em CONTRATO: id, title, etapa, etapaName, time, tags, tagline, intro,
   sections[{id,title,body}], whenToUse[], whenNot[], metrics[], refs[]
*/
window.LESSON_CONTENT = window.LESSON_CONTENT || {};

window.LESSON_CONTENT['gil-modelo'] = {
  id: 'gil-modelo',
  title: 'GIL e free-threading',
  etapa: 10, etapaName: 'Concorrência & async',
  time: '75 min',
  tags: ['GIL', 'free-threading', 'PEP 703', 'CPU vs I/O'],
  tagline: 'Antes de escolher threads, processos ou asyncio, descubra o que está <em>limitando</em> o seu programa.',
  intro: `
    <p>Toda conversa séria sobre concorrência em Python começa no GIL (Global Interpreter Lock): um mutex dentro do CPython que permite que apenas uma thread execute bytecode Python por vez, por interpretador. Ele simplifica a contagem de referências e a segurança de memória do interpretador e das extensões em C, mas tem um custo conhecido: threads Python não aceleram código CPU-bound em múltiplos núcleos.</p>
    <p>Desde o Python 3.13 isso deixou de ser um fato imutável. A PEP 703 (aceita em 2023) introduziu um build opcional sem GIL, o <em>free-threaded build</em> (executável <code>python3.13t</code>, experimental na 3.13). No Python 3.14, a PEP 779 definiu os critérios de suporte e o build free-threaded passou a ser oficialmente suportado, ainda como opção separada do build padrão. O ecossistema de extensões nativas ainda está migrando, então você precisa dominar os dois mundos.</p>
    <p>Esta lição dá o modelo mental: o que o GIL protege de fato, quando ele é liberado, como classificar a carga (CPU-bound, I/O-bound, mista) e como decidir entre threads, processos, subinterpretadores e asyncio. Em entrevista sênior, a resposta "o GIL impede paralelismo" sem nuance já é reprovação.</p>
  `,
  sections: [
    {
      id: 'o-que-o-gil-protege',
      title: 'O que o GIL protege (e o que ele não protege)',
      body: `
        <p>O GIL protege as <strong>estruturas internas do interpretador</strong>: principalmente os contadores de referência dos objetos e o estado do alocador de objetos. Sem ele, dois núcleos incrementando <code>ob_refcnt</code> do mesmo objeto sem sincronização corromperiam a memória. Ter um único lock global foi a solução mais barata e que mantinha rápido o código de uma thread só.</p>
        <p>Ele <strong>não</strong> protege a lógica do seu programa. Um erro comum é achar que "tem GIL, então meu contador é thread-safe". O GIL é liberado entre bytecodes (o interpretador oferece a troca a cada intervalo, 5 ms por padrão, consultável por <code>sys.getswitchinterval()</code>), e uma operação como <code>n += 1</code> compila para várias instruções (carregar, somar, armazenar). Se a troca acontecer no meio, você perde atualizações.</p>
        <pre><code class="language-python">import dis

def incrementa(estado):
    estado["n"] += 1

dis.dis(incrementa)
# Você verá LOAD_FAST, LOAD_CONST, COPY, BINARY_SUBSCR, BINARY_OP (+=), STORE_SUBSCR
# Entre BINARY_SUBSCR e STORE_SUBSCR outra thread pode rodar: lost update.</code></pre>
        <p>Operações isoladas em tipos builtin, como <code>list.append</code> ou <code>dict[k] = v</code>, são atômicas na prática por serem uma única chamada em C que não libera o GIL. Isso é um detalhe de implementação, não uma garantia de linguagem, e no build free-threaded o CPython usa locks por objeto para manter a segurança desses containers. Para lógica composta (ler, decidir, escrever), use sempre <code>threading.Lock</code> ou estruturas projetadas para isso, como <code>queue.Queue</code>.</p>
        <div class="callout warn"><strong>PEGADINHA</strong> Código que "funciona há anos com GIL" por sorte de timing costuma quebrar ao ir para o build free-threaded, onde a troca de contexto real acontece em paralelo. Trate o GIL como acidente de implementação, nunca como contrato.</div>
      `
    },
    {
      id: 'quando-o-gil-e-liberado',
      title: 'Quando o GIL é liberado: por que threads ajudam em I/O',
      body: `
        <p>O CPython libera o GIL em dois momentos: periodicamente, para dar chance a outras threads (a pedido de uma thread que espera), e <strong>durante chamadas bloqueantes de I/O e em extensões C que o liberam explicitamente</strong>. Chamadas como <code>socket.recv</code>, leitura de arquivo, <code>time.sleep</code> e <code>subprocess</code> soltam o GIL enquanto esperam o sistema operacional. É por isso que um pool de threads faz 50 requisições HTTP em tempo próximo ao da mais lenta, e não da soma.</p>
        <p>Bibliotecas numéricas (NumPy em muitas operações, hashlib para dados grandes, zlib, bibliotecas de compressão e parsers em C) também liberam o GIL no miolo do cálculo. Por isso é possível ter paralelismo real em threads com GIL quando o trabalho pesado está em código nativo. A pergunta certa nunca é "Python tem GIL?", e sim "onde o tempo está sendo gasto: em bytecode Python ou em código que libera o GIL?".</p>
        <table>
          <thead><tr><th>Tipo de carga</th><th>Onde o tempo vai</th><th>Threads (com GIL)</th><th>Ferramenta usual</th></tr></thead>
          <tbody>
            <tr><td>I/O-bound</td><td>Esperando rede, disco, banco</td><td>Ajudam bastante</td><td>threads ou asyncio</td></tr>
            <tr><td>CPU-bound em Python puro</td><td>Executando bytecode</td><td>Não ajudam (podem piorar)</td><td>multiprocessing, subinterpretadores, free-threading</td></tr>
            <tr><td>CPU-bound em extensão que libera o GIL</td><td>NumPy, zlib, hashlib, código nativo</td><td>Ajudam</td><td>threads, ou vetorizar</td></tr>
            <tr><td>Mista</td><td>Rede e cálculo alternados</td><td>Depende da fração</td><td>processos + async por processo</td></tr>
          </tbody>
        </table>
        <div class="callout tip"><strong>DICA</strong> Para decidir sem adivinhar, rode um profiler de amostragem (py-spy) com <code>--gil</code> para ver apenas as threads que seguram o GIL, e compare com o tempo de parede. Se o tempo de parede é muito maior que o tempo com o GIL, o programa é I/O-bound.</div>
      `
    },
    {
      id: 'experimento-cpu-bound',
      title: 'Experimento: medir em vez de acreditar',
      body: `
        <p>Este experimento compara execução sequencial, threads e processos para uma tarefa CPU-bound em Python puro. Não vou cravar números: eles dependem da máquina, da versão e do build. O que importa é o método (tempo de parede com <code>perf_counter</code>, mesma carga total, repetições).</p>
        <pre><code class="language-python">import time
from concurrent.futures import ThreadPoolExecutor, ProcessPoolExecutor

def conta(n: int) -&gt; int:
    # CPU-bound em Python puro: só bytecode, nunca libera o GIL
    s = 0
    for i in range(n):
        s += i * i
    return s

def mede(rotulo, fn, repeticoes=3):
    melhor = float("inf")
    for _ in range(repeticoes):
        t0 = time.perf_counter()
        fn()
        melhor = min(melhor, time.perf_counter() - t0)
    print(f"{rotulo:12s} {melhor:.3f}s")

N, TAREFAS = 5_000_000, 4

def sequencial():
    for _ in range(TAREFAS):
        conta(N)

def com_threads():
    with ThreadPoolExecutor(max_workers=TAREFAS) as ex:
        list(ex.map(conta, [N] * TAREFAS))

def com_processos():
    with ProcessPoolExecutor(max_workers=TAREFAS) as ex:
        list(ex.map(conta, [N] * TAREFAS))

if __name__ == "__main__":
    mede("sequencial", sequencial)
    mede("threads", com_threads)
    mede("processos", com_processos)</code></pre>
        <p>No build padrão (com GIL), espere threads próximas ou piores que o sequencial, e processos próximos de dividir o tempo pelo número de núcleos físicos disponíveis, descontado o custo de criar processos e serializar dados. No build free-threaded, as threads passam a escalar com os núcleos, mas o código de uma thread só pode ficar mais lento que no build padrão (o custo de engenharia da PEP 703, que a equipe do CPython vem reduzindo a cada versão). Meça no seu hardware.</p>
        <div class="callout warn"><strong>PEGADINHA</strong> Em máquinas com hyper-threading, "núcleos" lógicos não são núcleos físicos. Um speedup de 4x com 8 threads lógicas em 4 núcleos físicos é normal, não um bug.</div>
      `
    },
    {
      id: 'pep-703-free-threading',
      title: 'PEP 703: o build free-threaded',
      body: `
        <p>A PEP 703 ("Making the Global Interpreter Lock Optional in CPython") remove o GIL em um build separado, com um conjunto de mudanças de fundo: contagem de referências enviesada (biased reference counting, que separa o contador da thread dona do objeto do contador compartilhado), objetos imortais (PEP 683, já na 3.12), alocador mimalloc, locks de granularidade fina em dict, list e set, e uma coleta de lixo adaptada. O ganho é paralelismo real de threads em Python; o custo é complexidade e algum overhead em código de thread única.</p>
        <p>Estado por versão, o que dá para afirmar com segurança:</p>
        <ul>
          <li><strong>3.13:</strong> build free-threaded experimental (<code>python3.13t</code> nos instaladores oficiais, ou configure com <code>--disable-gil</code>). Sem garantia de estabilidade ou de desempenho.</li>
          <li><strong>3.14:</strong> a PEP 779 definiu os critérios de suporte e o build free-threaded passou a ser oficialmente suportado (fase II do plano), ainda não o padrão. Fases futuras decidem se e quando ele se torna o único build; isso não está decidido, não afirme datas.</li>
          <li>O build padrão continua com GIL. Os dois coexistem, com ABIs diferentes: wheels de extensões nativas têm tags próprias (<code>cp313t</code>, <code>cp314t</code>).</li>
        </ul>
        <pre><code class="language-python">import sys
import sysconfig

# True se este interpretador foi compilado sem GIL
compilado_sem_gil = bool(sysconfig.get_config_var("Py_GIL_DISABLED"))

# Em tempo de execução: o GIL pode ter sido reativado (ex.: extensão incompatível)
gil_ativo = sys._is_gil_enabled() if hasattr(sys, "_is_gil_enabled") else True

print("build free-threaded:", compilado_sem_gil)
print("GIL ativo agora:", gil_ativo)</code></pre>
        <p>Controle em execução: a variável de ambiente <code>PYTHON_GIL=0</code> ou a opção <code>-X gil=0</code> desliga o GIL no build free-threaded; <code>PYTHON_GIL=1</code> força ligá-lo. Se você importar uma extensão C que não declarou suporte (via o slot <code>Py_mod_gil</code>), o interpretador reativa o GIL e emite um aviso. Esse é o mecanismo de segurança que permite migração gradual das bibliotecas, e também a razão de um pipeline "sem GIL" voltar silenciosamente a ter GIL por causa de uma dependência.</p>
        <div class="callout"><strong>NA ENTREVISTA</strong> Pergunta típica: "o GIL vai acabar?". Resposta madura: existe um build opcional suportado a partir da 3.14, a migração do ecossistema é gradual, e hoje a decisão técnica é medir sua carga e suas dependências, não torcer por uma data.</div>
      `
    },
    {
      id: 'thread-safety-sem-gil',
      title: 'Thread safety sem GIL: o que muda no seu código',
      body: `
        <p>Com o GIL, muita corrida de dados ficava mascarada porque as trocas de thread eram raras e previsíveis. Sem ele, qualquer estado compartilhado mutável precisa de sincronização explícita. O interpretador garante que operações builtin não corrompem a memória (um <code>list.append</code> concorrente não derruba o processo), mas isso não torna a sua lógica correta.</p>
        <pre><code class="language-python">import threading

class ContadorInseguro:
    def __init__(self):
        self.n = 0

    def inc(self):
        self.n += 1          # ler, somar, escrever: três passos

class ContadorSeguro:
    def __init__(self):
        self.n = 0
        self._lock = threading.Lock()

    def inc(self):
        with self._lock:
            self.n += 1

def hammer(contador, vezes=200_000, threads=8):
    def trabalho():
        for _ in range(vezes):
            contador.inc()
    ts = [threading.Thread(target=trabalho) for _ in range(threads)]
    for t in ts: t.start()
    for t in ts: t.join()
    return contador.n

if __name__ == "__main__":
    esperado = 200_000 * 8
    print("inseguro:", hammer(ContadorInseguro()), "esperado:", esperado)
    print("seguro:  ", hammer(ContadorSeguro()), "esperado:", esperado)</code></pre>
        <p>O contador inseguro pode ou não perder contagens no build com GIL (depende da versão, que otimizou a troca de contexto em loops simples), mas no build free-threaded a perda é muito mais provável. O resultado do teste não prova segurança: ausência de falha em testes não é prova de ausência de corrida. Pense em invariantes e proteja-as.</p>
        <p>Boas práticas para código que precisa ser portável entre os dois builds:</p>
        <ul>
          <li>Prefira <strong>passagem de mensagens</strong> (<code>queue.Queue</code>) a estado compartilhado.</li>
          <li>Prefira <strong>imutabilidade</strong> (tuplas, <code>frozen</code> dataclasses) para dados lidos por várias threads.</li>
          <li>Se o estado é compartilhado, um lock por invariante, adquirido sempre na mesma ordem para evitar deadlock.</li>
          <li>Teste com carga e, quando possível, com ferramentas como ThreadSanitizer em extensões C (o CPython tem suporte a builds com TSan).</li>
        </ul>
      `
    },
    {
      id: 'alternativas-ao-gil',
      title: 'Subinterpretadores, processos e async: o mapa de decisão',
      body: `
        <p>Além de threads, Python oferece outros modelos de isolamento. Cada um troca custo de comunicação por isolamento.</p>
        <ul>
          <li><strong>multiprocessing / ProcessPoolExecutor:</strong> processos separados, cada um com seu GIL e sua memória. Isolamento total, comunicação por serialização (pickle) ou memória compartilhada explícita. Custo de criação e de memória mais alto. É a opção madura para CPU-bound com o build padrão.</li>
          <li><strong>Subinterpretadores:</strong> a PEP 684 (3.12) deu a cada subinterpretador seu próprio GIL (por enquanto acessível pela C API). A PEP 734 trouxe o módulo <code>concurrent.interpreters</code> e o <code>InterpreterPoolExecutor</code> à biblioteca padrão na 3.14. Isolamento de estado e dados trocados por mecanismos explícitos, sem criar processos do SO. Ainda novo: bibliotecas de terceiros precisam suportar múltiplos interpretadores.</li>
          <li><strong>asyncio:</strong> concorrência cooperativa em uma thread. Ótimo para milhares de conexões I/O-bound; não ajuda CPU-bound e bloqueia inteiro se uma corrotina bloquear.</li>
          <li><strong>Free-threading:</strong> threads com memória compartilhada e paralelismo real. Ideal para paralelismo de granularidade fina com dados grandes compartilhados, desde que as dependências suportem o build.</li>
        </ul>
        <pre><code class="language-python">from concurrent.futures import ThreadPoolExecutor, ProcessPoolExecutor

def escolhe_executor(tipo_carga: str, max_workers: int | None = None):
    """Fábrica didática. Em 3.14 também existe InterpreterPoolExecutor."""
    if tipo_carga == "io":
        return ThreadPoolExecutor(max_workers=max_workers)
    if tipo_carga == "cpu":
        return ProcessPoolExecutor(max_workers=max_workers)
    raise ValueError(f"carga desconhecida: {tipo_carga!r}")

# Em 3.14+ (módulo concurrent.futures), funções importáveis de um módulo:
# from concurrent.futures import InterpreterPoolExecutor
# with InterpreterPoolExecutor() as ex:
#     resultados = list(ex.map(minha_lib.tarefa_pesada, entradas))</code></pre>
        <div class="callout tip"><strong>DICA</strong> Regra de bolso para o mapa: I/O massivo, asyncio; I/O moderado com bibliotecas bloqueantes, threads; CPU-bound hoje em produção, processos; CPU-bound com dados compartilhados grandes e dependências compatíveis, avalie free-threading; sempre que possível, vetorize (NumPy) antes de paralelizar.</div>
      `
    },
    {
      id: 'armadilhas-e-migracao',
      title: 'Armadilhas, migração e como testar',
      body: `
        <p>Para adotar o build free-threaded sem surpresa:</p>
        <ul>
          <li><strong>Inventarie dependências nativas.</strong> Cada wheel precisa ter a tag <code>t</code> ou declarar suporte. Se uma única extensão não declara, o GIL volta com um aviso. Procure o aviso nos logs de inicialização.</li>
          <li><strong>Meça a perda em thread única.</strong> O build free-threaded costuma ser mais lento em código sequencial (o tamanho do custo caiu entre 3.13 e 3.14, mas varia por carga). Rode a sua suíte de benchmarks nos dois builds com <code>pyperf</code>.</li>
          <li><strong>Revise globais e caches de módulo.</strong> Dicionários usados como cache sem lock, singletons preguiçosos e <code>functools.cached_property</code> em objetos compartilhados merecem atenção.</li>
          <li><strong>Teste o que não aparece no caminho feliz.</strong> Corridas aparecem sob carga. Use stress tests com muitas threads e repetição.</li>
        </ul>
        <pre><code class="language-bash"># Instalar o build free-threaded com uv (ex.: 3.14t) e comparar
uv python install 3.14t
uv run --python 3.14t python -c "import sys; print(sys._is_gil_enabled())"

# Forçar GIL desligado e ver se alguma extensão o reativa
PYTHON_GIL=0 python3.14t -X importtime -c "import numpy, pandas"
# Procure RuntimeWarning dizendo que o GIL foi habilitado por um módulo</code></pre>
        <p>Do lado de quem escreve extensões C, o slot <code>Py_mod_gil</code> declara que o módulo é seguro sem GIL; a documentação oficial "C API Extension Support for Free Threading" descreve as regras, e a ferramenta de testes do ecossistema acompanha o suporte das bibliotecas populares (o site py-free-threading.github.io mantém um guia e um tracker de compatibilidade).</p>
        <div class="callout warn"><strong>PEGADINHA</strong> Não migre por modismo. Se o gargalo é um SELECT lento, o GIL nunca foi o seu problema. Primeiro meça (lição 63), depois escolha o modelo de concorrência.</div>
      `
    }
  ],
  whenToUse: [
    'Threads (mesmo com GIL) quando o tempo é dominado por espera de I/O ou por extensões que liberam o GIL',
    'Processos quando há CPU-bound em Python puro e o build padrão é obrigatório',
    'Build free-threaded quando há paralelismo CPU-bound com muito estado compartilhado e as dependências nativas suportam o build',
    'Subinterpretadores (3.14) para isolamento sem o custo de processos, em bibliotecas que o suportam',
    'asyncio quando o problema é concorrência massiva de I/O em uma thread'
  ],
  whenNot: [
    'Não paralelize antes de medir: o gargalo pode ser algoritmo, I/O de banco ou rede',
    'Não use threads para acelerar loops Python puros no build com GIL',
    'Não confie em "atomicidade por causa do GIL" para lógica composta',
    'Não adote free-threading em produção sem testar todas as extensões nativas e sem comparar o desempenho em thread única',
    'Não afirme datas para o fim do GIL: o plano é faseado e depende da maturidade do ecossistema'
  ],
  metrics: [
    'sys._is_gil_enabled(), sysconfig.get_config_var("Py_GIL_DISABLED"), PYTHON_GIL, -X gil',
    'py-spy dump/top com --gil para ver quem segura o GIL; time.perf_counter para tempo de parede',
    'pyperf para comparar builds (com e sem GIL) na mesma máquina',
    'Aviso de reativação do GIL ao importar extensões (procure no log)',
    'Utilização de CPU por núcleo (htop, psutil.cpu_percent(percpu=True)) durante a carga'
  ],
  refs: [
    { type: 'doc', title: 'PEP 703: Making the Global Interpreter Lock Optional in CPython', author: 'Sam Gross', url: 'https://peps.python.org/pep-0703/', note: 'A proposta original com motivação, design técnico e trade-offs.' },
    { type: 'doc', title: 'PEP 779: Criteria for supported status for free-threaded Python', author: 'Python Steering Council / autores da PEP', url: 'https://peps.python.org/pep-0779/', note: 'Os critérios que definem quando o build free-threaded é suportado.' },
    { type: 'doc', title: 'Python support for free threading (HOWTO)', author: 'Python Software Foundation', url: 'https://docs.python.org/3/howto/free-threading-python.html', note: 'Guia oficial de uso e migração do build free-threaded.' },
    { type: 'doc', title: 'PEP 734: Multiple Interpreters in the Stdlib', author: 'Eric Snow e outros', url: 'https://peps.python.org/pep-0734/', note: 'Módulo concurrent.interpreters e isolamento de estado.' },
    { type: 'doc', title: 'PEP 684: A Per-Interpreter GIL', author: 'Eric Snow', url: 'https://peps.python.org/pep-0684/', note: 'Como cada subinterpretador ganhou seu próprio GIL na 3.12.' },
    { type: 'video', title: 'Understanding the Python GIL', author: 'David Beazley', url: 'https://www.dabeaz.com/GIL/', note: 'A análise clássica do comportamento do GIL em multicore.' },
    { type: 'portal', title: 'Free-Threaded Python Compatibility Tracker', author: 'Quansight Labs / comunidade', url: 'https://py-free-threading.github.io/', note: 'Guia e tracker de compatibilidade das bibliotecas com o build sem GIL.' },
    { type: 'livro', title: 'Fluent Python, 2nd edition (capítulos de concorrência)', author: 'Luciano Ramalho', url: 'https://www.oreilly.com/library/view/fluent-python-2nd/9781492056348/', note: 'Visão prática de threads, processos e corrotinas; há tradução em português pela Novatec.' }
  ]
};

window.LESSON_CONTENT['threading'] = {
  id: 'threading',
  title: 'Threads e sincronização',
  etapa: 10, etapaName: 'Concorrência & async',
  time: '60 min',
  tags: ['threading', 'Lock', 'Queue', 'executors'],
  tagline: 'Threads são fáceis de criar e difíceis de acertar: domine as primitivas e prefira <em>filas</em> a estado compartilhado.',
  intro: `
    <p>Threads continuam sendo a ferramenta mais direta para sobrepor esperas de I/O em código síncrono: chamadas a APIs HTTP com <code>requests</code>, leitura de muitos arquivos, consultas a um banco com driver bloqueante, scraping. A biblioteca padrão oferece duas camadas: <code>threading</code> (primitivas) e <code>concurrent.futures</code> (executores de alto nível). Na maioria dos casos você deve começar pelo executor.</p>
    <p>O que separa um iniciante de um engenheiro sênior aqui é entender as classes de falha: race conditions, deadlocks, starvation, vazamento de threads, shutdown sujo e exceções engolidas. Essas falhas são não determinísticas: passam em testes, quebram em produção sob carga.</p>
    <p>Esta lição cobre o ciclo de vida de uma thread, as primitivas de sincronização (Lock, RLock, Event, Condition, Semaphore, Barrier), o padrão produtor-consumidor com <code>queue.Queue</code>, o <code>ThreadPoolExecutor</code> e as regras práticas de desenho. O que vale para o build com GIL vale em dobro para o free-threaded (lição 58).</p>
  `,
  sections: [
    {
      id: 'ciclo-de-vida',
      title: 'Criando, esperando e encerrando threads',
      body: `
        <p>Uma <code>threading.Thread</code> executa um callable. <code>start()</code> agenda a execução, <code>join()</code> espera o término. Threads <em>daemon</em> são encerradas abruptamente quando o programa principal termina, sem rodar <code>finally</code> nem fechar recursos: use-as só para tarefas descartáveis.</p>
        <pre><code class="language-python">import threading
import time

def worker(nome: str, segundos: float, parar: threading.Event) -&gt; None:
    print(f"[{nome}] iniciou")
    while not parar.is_set():
        # Event.wait funciona como sleep interrompível
        if parar.wait(timeout=segundos):
            break
        print(f"[{nome}] tick")
    print(f"[{nome}] encerrando com limpeza")

parar = threading.Event()
ts = [threading.Thread(target=worker, args=(f"w{i}", 0.2, parar), name=f"worker-{i}")
      for i in range(2)]
for t in ts:
    t.start()

time.sleep(0.7)
parar.set()              # sinaliza cancelamento cooperativo
for t in ts:
    t.join(timeout=2)
print("vivas:", [t.name for t in ts if t.is_alive()])</code></pre>
        <p>Pontos que importam:</p>
        <ul>
          <li><strong>Não existe</strong> forma segura de matar uma thread de fora. O cancelamento é cooperativo (Event, flag verificada em loops, sentinelas em filas).</li>
          <li>Exceção não tratada em uma thread imprime o traceback e a thread morre; o programa principal <strong>não é avisado</strong>. Use <code>threading.excepthook</code> ou executores (que capturam a exceção no Future).</li>
          <li>Dê nome às threads (<code>name=</code>). Em um dump do py-spy ou em logs, "Thread-7 (worker)" não ajuda ninguém.</li>
          <li>Em programas que usam <code>fork</code> com threads ativas, há risco de deadlock no filho; o Python 3.12 passou a emitir <code>DeprecationWarning</code> nesse caso.</li>
        </ul>
      `
    },
    {
      id: 'race-conditions-locks',
      title: 'Race conditions e Locks',
      body: `
        <p>Uma <strong>race condition</strong> acontece quando o resultado depende da ordem de intercalação de operações sobre estado compartilhado. O padrão clássico é <em>check-then-act</em>: verificar uma condição e agir sobre ela sem proteger o intervalo entre os dois passos.</p>
        <pre><code class="language-python">import threading

class Conta:
    def __init__(self, saldo: int):
        self.saldo = saldo
        self._lock = threading.Lock()

    def sacar_inseguro(self, valor: int) -&gt; bool:
        if self.saldo &gt;= valor:        # check
            # outra thread pode sacar aqui
            self.saldo -= valor        # act
            return True
        return False

    def sacar(self, valor: int) -&gt; bool:
        with self._lock:               # check e act viram uma unidade
            if self.saldo &gt;= valor:
                self.saldo -= valor
                return True
            return False</code></pre>
        <p><code>with lock:</code> é sempre preferível a <code>acquire()/release()</code> manual: garante a liberação mesmo com exceção. Mantenha a seção crítica <strong>curta</strong> e sem I/O dentro dela (segurar um lock durante uma chamada de rede serializa todas as threads).</p>
        <p><strong>RLock</strong> (reentrante) permite que a mesma thread adquira o lock várias vezes, útil quando métodos protegidos chamam outros métodos protegidos. Em geral é sinal de que a estrutura de locking merece revisão, mas é a ferramenta certa para classes que expõem uma API pública toda sincronizada.</p>
        <p><strong>Deadlock</strong> nasce da ordem inconsistente de aquisição: a thread A pega L1 e espera L2, a B pega L2 e espera L1. A prevenção é estrutural: defina uma ordem global de locks, ou use um lock só, ou use <code>acquire(timeout=...)</code> para detectar e recuperar.</p>
        <pre><code class="language-python">import threading

l1, l2 = threading.Lock(), threading.Lock()

def transferir(origem_lock, destino_lock):
    # Ordem global: sempre o lock de menor id() primeiro
    primeiro, segundo = sorted((origem_lock, destino_lock), key=id)
    with primeiro:
        with segundo:
            ...  # operação que envolve os dois recursos</code></pre>
        <div class="callout warn"><strong>PEGADINHA</strong> <code>threading.Lock</code> não é reentrante: a mesma thread adquirindo duas vezes entra em deadlock consigo mesma. Se você precisa disso, é RLock; se acha que precisa disso, refatore.</div>
      `
    },
    {
      id: 'primitivas',
      title: 'Event, Condition, Semaphore e Barrier',
      body: `
        <p>Locks resolvem exclusão mútua. Para <strong>coordenação</strong> (esperar um acontecimento) existem outras primitivas:</p>
        <table>
          <thead><tr><th>Primitiva</th><th>Uso</th><th>Observação</th></tr></thead>
          <tbody>
            <tr><td><code>Event</code></td><td>Sinal binário (parar, pronto)</td><td><code>wait(timeout)</code> evita bloqueios eternos</td></tr>
            <tr><td><code>Condition</code></td><td>Esperar um predicado sobre estado compartilhado</td><td>Sempre em loop <code>while not predicado: cond.wait()</code></td></tr>
            <tr><td><code>Semaphore</code> / <code>BoundedSemaphore</code></td><td>Limitar concorrência (N conexões)</td><td>BoundedSemaphore detecta release a mais</td></tr>
            <tr><td><code>Barrier</code></td><td>Sincronizar N threads em um ponto</td><td>Útil em testes e em fases de simulação</td></tr>
            <tr><td><code>Timer</code></td><td>Executar após um atraso</td><td>Thread por timer: não escala; prefira um scheduler</td></tr>
          </tbody>
        </table>
        <pre><code class="language-python">import threading
import time

# Semaphore limitando a 3 chamadas simultâneas a um recurso escasso
limite = threading.BoundedSemaphore(3)

def chama_api(i: int) -&gt; None:
    with limite:
        print(f"req {i} dentro")
        time.sleep(0.2)   # simula I/O

ts = [threading.Thread(target=chama_api, args=(i,)) for i in range(8)]
for t in ts: t.start()
for t in ts: t.join()</code></pre>
        <p>Com <code>Condition</code>, a regra de ouro é usar um <code>while</code> ao redor do <code>wait()</code>, porque despertares espúrios e condições alteradas por outras threads são possíveis. Na prática, <code>queue.Queue</code> encapsula esse padrão e deve ser usada antes de uma Condition escrita à mão.</p>
      `
    },
    {
      id: 'produtor-consumidor',
      title: 'Produtor-consumidor com queue.Queue',
      body: `
        <p><code>queue.Queue</code> é thread-safe, bloqueante, com limite opcional (<code>maxsize</code>) e fornece <strong>backpressure</strong> natural: se o consumidor é lento, o produtor bloqueia em <code>put</code> em vez de estourar memória. É o mecanismo preferido de comunicação entre threads: passar mensagens em vez de compartilhar estado.</p>
        <pre><code class="language-python">import queue
import threading

SENTINELA = object()

def produtor(q: queue.Queue, itens):
    for item in itens:
        q.put(item)              # bloqueia se a fila está cheia (backpressure)
    q.put(SENTINELA)

def consumidor(q: queue.Queue, resultados: list):
    while True:
        item = q.get()
        try:
            if item is SENTINELA:
                q.put(SENTINELA)  # repassa para outros consumidores
                return
            resultados.append(item * item)
        finally:
            q.task_done()

q = queue.Queue(maxsize=100)
resultados: list[int] = []
cons = [threading.Thread(target=consumidor, args=(q, resultados)) for _ in range(4)]
for c in cons: c.start()
produtor(q, range(1000))
for c in cons: c.join()
print(len(resultados))</code></pre>
        <p>O Python 3.13 adicionou <code>Queue.shutdown()</code>, que encerra a fila de forma limpa: <code>put</code> passa a falhar com <code>queue.ShutDown</code> e <code>get</code> levanta o erro quando a fila esvazia, o que dispensa a sentinela manual. Verifique a versão do seu runtime antes de usar.</p>
        <p>Variações úteis: <code>PriorityQueue</code> (itens ordenados por prioridade, atenção a empates com tipos não comparáveis), <code>LifoQueue</code> e <code>SimpleQueue</code> (sem <code>task_done</code>, reentrante em handlers de sinal e finalizadores, com implementação em C).</p>
        <div class="callout tip"><strong>DICA</strong> Fila ilimitada (<code>maxsize=0</code>) em produção é um vazamento de memória esperando carga. Defina sempre um limite que reflita a memória que você aceita gastar.</div>
      `
    },
    {
      id: 'thread-pool-executor',
      title: 'ThreadPoolExecutor e Futures',
      body: `
        <p><code>concurrent.futures.ThreadPoolExecutor</code> gerencia um pool reutilizável e devolve <code>Future</code>s que transportam resultado ou exceção. Evita criar uma thread por tarefa (custo e limite do SO) e padroniza o tratamento de erro.</p>
        <pre><code class="language-python">import time
from concurrent.futures import ThreadPoolExecutor, as_completed
import urllib.request

def baixa(url: str) -&gt; tuple[str, int]:
    with urllib.request.urlopen(url, timeout=5) as resp:
        return url, len(resp.read())

urls = ["https://example.com", "https://www.python.org", "https://peps.python.org"]

t0 = time.perf_counter()
with ThreadPoolExecutor(max_workers=8, thread_name_prefix="dl") as pool:
    futuros = {pool.submit(baixa, u): u for u in urls}
    for fut in as_completed(futuros):
        url = futuros[fut]
        try:
            _, tamanho = fut.result()
            print(url, tamanho)
        except Exception as exc:       # a exceção da thread aparece aqui
            print(url, "falhou:", exc)
print(f"total {time.perf_counter() - t0:.2f}s")</code></pre>
        <ul>
          <li><code>map</code> preserva a ordem de entrada e levanta a primeira exceção ao iterar; <code>as_completed</code> entrega por ordem de término, o que é melhor para barras de progresso e tratamento por item.</li>
          <li>O bloco <code>with</code> chama <code>shutdown(wait=True)</code>: espera as tarefas pendentes. Com <code>cancel_futures=True</code> (3.9+) cancela as que ainda não começaram.</li>
          <li>O tamanho padrão do pool é <code>min(32, os.cpu_count() + 4)</code> (3.8+), pensado para I/O. Para I/O de alta latência, dimensione pelo limite do serviço remoto, não pelo número de núcleos.</li>
          <li>Um <code>Future.result(timeout=...)</code> que estoura não cancela a tarefa em execução: apenas deixa de esperar.</li>
        </ul>
        <div class="callout warn"><strong>PEGADINHA</strong> Submeter tarefas que esperam o resultado de outras tarefas do <strong>mesmo</strong> pool pode causar deadlock quando todos os workers estão ocupados esperando. Use pools separados ou reestruture.</div>
      `
    },
    {
      id: 'thread-local-e-contexto',
      title: 'Dados por thread: threading.local e contextvars',
      body: `
        <p><code>threading.local()</code> cria um namespace em que cada thread enxerga seus próprios atributos: útil para conexões de banco, sessões HTTP e buffers que não são seguros de compartilhar. O padrão é lazy: cada thread cria seu recurso na primeira vez que o usa.</p>
        <pre><code class="language-python">import sqlite3
import threading

_local = threading.local()

def conexao() -&gt; sqlite3.Connection:
    if not hasattr(_local, "conn"):
        _local.conn = sqlite3.connect("app.db")   # uma conexão por thread
    return _local.conn

def total_usuarios() -&gt; int:
    return conexao().execute("SELECT count(*) FROM usuarios").fetchone()[0]</code></pre>
        <p>Para código que mistura threads e asyncio, <code>contextvars.ContextVar</code> é a ferramenta moderna: propaga valores (id de requisição, usuário, trace id) corretamente através de tasks e, com <code>copy_context().run</code>, para threads. <code>asyncio.to_thread</code> já copia o contexto da corrotina chamadora para a thread.</p>
        <p>Cuidado com <code>threading.local</code> e pools: as threads do pool sobrevivem entre tarefas, então o estado "por thread" vaza entre tarefas diferentes. Se precisa de estado por tarefa, limpe no início da tarefa ou use contexto explícito.</p>
      `
    },
    {
      id: 'checklist-de-design',
      title: 'Checklist de design e como testar código com threads',
      body: `
        <ol>
          <li><strong>Minimize estado compartilhado mutável.</strong> Entradas imutáveis, resultados devolvidos por Future ou fila.</li>
          <li><strong>Um dono por dado.</strong> Se uma thread é a única que escreve em uma estrutura, o resto só consome mensagens.</li>
          <li><strong>Locks:</strong> um por invariante, curtos, sem I/O dentro, ordem global documentada.</li>
          <li><strong>Timeouts em tudo que bloqueia:</strong> <code>queue.get(timeout=)</code>, <code>lock.acquire(timeout=)</code>, <code>join(timeout=)</code>, <code>socket.settimeout</code>. Programa sem timeout é programa que congela.</li>
          <li><strong>Shutdown limpo:</strong> sinal de parada, drenagem da fila, <code>join</code> com limite, depois log do que sobrou.</li>
          <li><strong>Exceções visíveis:</strong> Futures, <code>threading.excepthook</code> e logging com nome de thread (<code>%(threadName)s</code>).</li>
        </ol>
        <p>Para testar: aumente o estresse (muitas threads, loops longos), force trocas com <code>sys.setswitchinterval(1e-6)</code> em testes para expor corridas, use <code>Barrier</code> para alinhar threads no ponto de interesse e rode o teste centenas de vezes (<code>pytest --count</code> do plugin pytest-repeat). Ausência de falha não prova correção, mas falha reproduzível prova o bug.</p>
        <pre><code class="language-python">import sys
import threading

def stress(fn, threads=16, repeticoes=10_000):
    sys.setswitchinterval(1e-6)             # só em teste: força trocas frequentes
    barreira = threading.Barrier(threads)
    def corpo():
        barreira.wait()                      # todas largam juntas
        for _ in range(repeticoes):
            fn()
    ts = [threading.Thread(target=corpo) for _ in range(threads)]
    for t in ts: t.start()
    for t in ts: t.join()</code></pre>
        <div class="callout"><strong>NA ENTREVISTA</strong> "Como você depura um deadlock em produção?" Resposta forte: dump de pilhas de todas as threads sem parar o processo (py-spy dump --pid), identificar quem espera qual lock, e em 3.14 também o suporte a depuração externa segura; depois corrigir a ordem de aquisição ou o escopo do lock.</div>
      `
    }
  ],
  whenToUse: [
    'Sobrepor esperas de I/O com bibliotecas síncronas (HTTP, banco, arquivos)',
    'Integrar código bloqueante dentro de asyncio via asyncio.to_thread ou run_in_executor',
    'Tarefas em segundo plano simples e limitadas (flush de métricas, heartbeat) com shutdown limpo',
    'Paralelismo de CPU com extensões que liberam o GIL, ou no build free-threaded',
    'Pipelines produtor-consumidor com backpressure usando queue.Queue limitada'
  ],
  whenNot: [
    'Loops CPU-bound em Python puro no build com GIL: use processos ou vetorização',
    'Milhares de conexões simultâneas: o custo de uma thread por conexão não escala, use asyncio',
    'Estado compartilhado complexo sem donos claros: a complexidade de locks explode',
    'Matar tarefas à força: não existe forma segura, desenhe cancelamento cooperativo',
    'Misturar fork e threads ativas sem necessidade'
  ],
  metrics: [
    'py-spy dump --pid N para pilhas de todas as threads; py-spy top para ver onde o tempo vai',
    'threading.enumerate() e threading.active_count() para detectar vazamento de threads',
    'logging com %(threadName)s e tempos de espera por lock instrumentados',
    'queue.qsize() como sinal de saturação (aproximado, não confiável para decisões exatas)',
    'Testes de estresse repetidos, com Barrier e switchinterval baixo'
  ],
  refs: [
    { type: 'doc', title: 'threading: thread-based parallelism', author: 'Python Software Foundation', url: 'https://docs.python.org/3/library/threading.html', note: 'Referência oficial de todas as primitivas.' },
    { type: 'doc', title: 'concurrent.futures', author: 'Python Software Foundation', url: 'https://docs.python.org/3/library/concurrent.futures.html', note: 'ThreadPoolExecutor, Future, as_completed e shutdown.' },
    { type: 'doc', title: 'queue: a synchronized queue class', author: 'Python Software Foundation', url: 'https://docs.python.org/3/library/queue.html', note: 'Queue, PriorityQueue, SimpleQueue e shutdown (3.13).' },
    { type: 'video', title: 'Thinking about Concurrency', author: 'Raymond Hettinger (PyCon 2016)', url: 'https://www.youtube.com/watch?v=Bv25Dwe84g0', note: 'Como pensar em concorrência com filas e passagem de mensagens.' },
    { type: 'livro', title: 'Fluent Python, 2nd edition', author: 'Luciano Ramalho', url: 'https://www.oreilly.com/library/view/fluent-python-2nd/9781492056348/', note: 'Capítulo de concorrência com threads, processos e futures.' },
    { type: 'livro', title: 'High Performance Python, 2nd edition', author: 'Micha Gorelick e Ian Ozsvald', url: 'https://www.oreilly.com/library/view/high-performance-python/9781492055013/', note: 'Quando threads ajudam e como medir.' },
    { type: 'video', title: 'Palestras e cursos sobre coroutines e concorrência', author: 'David Beazley', url: 'https://www.dabeaz.com/talks.html', note: 'Material clássico sobre concorrência construída do zero.' }
  ]
};

window.LESSON_CONTENT['multiprocessing'] = {
  id: 'multiprocessing',
  title: 'Multiprocessing',
  etapa: 10, etapaName: 'Concorrência & async',
  time: '60 min',
  tags: ['multiprocessing', 'ProcessPoolExecutor', 'pickle', 'shared_memory'],
  tagline: 'Processos dão paralelismo real e isolamento total. O preço é <em>serializar</em> tudo que atravessa a fronteira.',
  intro: `
    <p>Quando o gargalo é CPU em Python puro e você usa o build padrão, a resposta consolidada é: processos. Cada processo tem seu interpretador, seu GIL e sua memória, então N processos usam N núcleos. O módulo <code>multiprocessing</code> e o <code>concurrent.futures.ProcessPoolExecutor</code> escondem a mecânica, mas ela vaza nos lugares errados: startup, serialização, memória duplicada e tarefas pequenas demais.</p>
    <p>O modelo mental correto: processos são <em>máquinas pequenas e separadas</em> que se comunicam por mensagens serializadas (pickle) ou por regiões de memória compartilhada explícitas. Tudo que cruza a fronteira custa: serializar, copiar, desserializar. A regra de ouro é enviar pouco, computar muito, devolver pouco.</p>
    <p>Esta lição cobre start methods (fork, spawn, forkserver) e a mudança de padrão na 3.14, ProcessPoolExecutor, o que pode ser serializado, memória compartilhada sem cópia, e o dimensionamento de chunks. Também mostra o contexto atual: em 3.14, subinterpretadores e free-threading competem com processos em parte dos casos.</p>
  `,
  sections: [
    {
      id: 'start-methods',
      title: 'Start methods: fork, spawn e forkserver',
      body: `
        <p>Como o processo filho nasce define comportamento, custo e segurança:</p>
        <table>
          <thead><tr><th>Método</th><th>Como funciona</th><th>Riscos e custos</th></tr></thead>
          <tbody>
            <tr><td><code>fork</code></td><td>Clona o processo pai (copy-on-write)</td><td>Rápido, mas herda locks e threads em estado inconsistente; inseguro com threads; contagem de referências e GC "sujam" páginas e anulam o copy-on-write em parte</td></tr>
            <tr><td><code>spawn</code></td><td>Inicia um interpretador novo e reimporta o módulo principal</td><td>Mais lento para iniciar; exige <code>if __name__ == "__main__"</code>; seguro e portátil (padrão no Windows e macOS)</td></tr>
            <tr><td><code>forkserver</code></td><td>Um servidor limpo faz o fork sob demanda</td><td>Meio-termo seguro; padrão no Linux a partir do Python 3.14</td></tr>
          </tbody>
        </table>
        <p>Até a 3.13, o padrão no Linux era <code>fork</code>. A partir da 3.14, o padrão em POSIX (exceto macOS, que já usava spawn) passou a ser <code>forkserver</code>. Código que dependia implicitamente de fork (variáveis globais herdadas, funções locais, objetos não serializáveis) pode quebrar. Seja explícito: escolha o método com um contexto, sem alterar o global do processo.</p>
        <pre><code class="language-python">import multiprocessing as mp

def quadrado(x: int) -&gt; int:
    return x * x

if __name__ == "__main__":
    ctx = mp.get_context("spawn")          # explícito, sem mexer no padrão global
    with ctx.Pool(processes=4) as pool:
        print(pool.map(quadrado, range(10)))</code></pre>
        <div class="callout warn"><strong>PEGADINHA</strong> Em spawn e forkserver, o módulo principal é <strong>reimportado</strong> no filho. Sem o guard <code>if __name__ == "__main__"</code>, o filho tentaria criar mais processos, dando erro ou recursão de processos. Em notebooks e REPL, funções definidas interativamente costumam não ser serializáveis para o filho.</div>
      `
    },
    {
      id: 'process-pool-executor',
      title: 'ProcessPoolExecutor na prática',
      body: `
        <p>Prefira <code>ProcessPoolExecutor</code> ao <code>multiprocessing.Pool</code> em código novo: a mesma interface de Futures que o <code>ThreadPoolExecutor</code>, propagação de exceções, e troca de executor com mudança de uma linha.</p>
        <pre><code class="language-python">import math
import os
import time
from concurrent.futures import ProcessPoolExecutor

def eh_primo(n: int) -&gt; bool:
    if n &lt; 2:
        return False
    for d in range(2, math.isqrt(n) + 1):
        if n % d == 0:
            return False
    return True

def conta_primos(intervalo: tuple[int, int]) -&gt; int:
    ini, fim = intervalo
    return sum(1 for n in range(ini, fim) if eh_primo(n))

def particiona(total: int, partes: int):
    passo = total // partes
    return [(i * passo, total if i == partes - 1 else (i + 1) * passo) for i in range(partes)]

if __name__ == "__main__":
    total = 2_000_000
    nucleos = os.cpu_count() or 1
    t0 = time.perf_counter()
    with ProcessPoolExecutor(max_workers=nucleos) as ex:
        parciais = list(ex.map(conta_primos, particiona(total, nucleos * 4)))
    print(sum(parciais), f"{time.perf_counter() - t0:.2f}s")</code></pre>
        <p>Decisões de projeto:</p>
        <ul>
          <li><strong>Granularidade:</strong> particione em mais pedaços que workers (aqui 4x) para balancear carga quando as tarefas têm custo desigual, sem criar milhões de tarefas minúsculas.</li>
          <li><code>map(..., chunksize=N)</code> agrupa itens por tarefa e reduz o overhead de IPC em milhões de itens pequenos (no <code>ProcessPoolExecutor</code> o padrão é 1, o que é caro).</li>
          <li><code>max_tasks_per_child</code> (3.11+) recicla workers após N tarefas, útil para conter vazamentos de memória de bibliotecas nativas (incompatível com o start method fork).</li>
          <li>Um worker que morre (OOM killer, segfault) quebra o pool inteiro com <code>BrokenProcessPool</code>. Em produção, capture isso e reconstrua o pool.</li>
        </ul>
        <div class="callout tip"><strong>DICA</strong> Número de workers = núcleos físicos para CPU-bound puro. Mais que isso só adiciona troca de contexto e memória. Em contêineres, <code>os.cpu_count()</code> pode ver o host inteiro; use <code>len(os.sched_getaffinity(0))</code> (Linux) ou <code>os.process_cpu_count()</code> (3.13+) para respeitar a limitação de CPU do ambiente.</div>
      `
    },
    {
      id: 'pickling',
      title: 'Serialização: o que atravessa a fronteira',
      body: `
        <p>Argumentos e resultados de tarefas viajam por <code>pickle</code>. O que não é serializável, não cruza. Erros típicos:</p>
        <ul>
          <li><strong>Lambdas e funções aninhadas:</strong> pickle serializa funções por nome qualificado de módulo; funções locais e lambdas não têm um nome importável. Use funções de módulo, <code>functools.partial</code> sobre funções de módulo ou classes com <code>__call__</code>.</li>
          <li><strong>Objetos com recursos do SO:</strong> conexões de banco, sockets, arquivos abertos, locks. Crie-os dentro do worker, via <code>initializer</code>.</li>
          <li><strong>Objetos grandes:</strong> mandar um DataFrame de 2 GB por tarefa serializa 2 GB por tarefa. Passe caminhos ou identificadores e carregue no worker, ou use memória compartilhada.</li>
        </ul>
        <pre><code class="language-python">import sqlite3
from concurrent.futures import ProcessPoolExecutor

_conn: sqlite3.Connection | None = None

def inicia_worker(caminho: str) -&gt; None:
    # Roda uma vez em cada processo: cria o recurso não serializável aqui
    global _conn
    _conn = sqlite3.connect(caminho)

def consulta(user_id: int) -&gt; tuple:
    assert _conn is not None
    return _conn.execute("SELECT id, nome FROM usuarios WHERE id = ?", (user_id,)).fetchone()

if __name__ == "__main__":
    with ProcessPoolExecutor(max_workers=4, initializer=inicia_worker, initargs=("app.db",)) as ex:
        print(list(ex.map(consulta, range(1, 50))))</code></pre>
        <p>Segurança: <strong>nunca desserialize pickle de fonte não confiável</strong>, pois permite execução arbitrária de código. Entre processos do mesmo programa isso é aceitável; ao receber dados da rede, use JSON, MessagePack ou protocolos com esquema.</p>
        <p>Exceções também são serializadas. Uma exceção com construtor que exige argumentos que não estão em <code>self.args</code> pode falhar ao ser reconstruída no pai, mascarando o erro real. Para exceções customizadas usadas em workers, chame <code>super().__init__(...)</code> com todos os argumentos do construtor.</p>
      `
    },
    {
      id: 'memoria-compartilhada',
      title: 'Memória compartilhada sem cópia',
      body: `
        <p>Para dados grandes e numéricos, copiar por pickle anula o ganho. O módulo <code>multiprocessing.shared_memory</code> (3.8+) cria blocos nomeados que vários processos mapeiam, e o NumPy pode criar um <code>ndarray</code> como visão sobre o buffer, sem cópia.</p>
        <pre><code class="language-python">import numpy as np
from multiprocessing import shared_memory
from concurrent.futures import ProcessPoolExecutor

def soma_fatia(args):
    nome, forma, dtype, ini, fim = args
    shm = shared_memory.SharedMemory(name=nome)       # só anexa, não copia
    try:
        arr = np.ndarray(forma, dtype=dtype, buffer=shm.buf)
        return float(arr[ini:fim].sum())
    finally:
        shm.close()                                    # solta o mapeamento neste processo

if __name__ == "__main__":
    dados = np.arange(10_000_000, dtype=np.float64)
    shm = shared_memory.SharedMemory(create=True, size=dados.nbytes)
    try:
        view = np.ndarray(dados.shape, dtype=dados.dtype, buffer=shm.buf)
        view[:] = dados                                # uma cópia só, na criação
        passo = dados.size // 4
        tarefas = [(shm.name, dados.shape, dados.dtype, i * passo, (i + 1) * passo) for i in range(4)]
        with ProcessPoolExecutor(4) as ex:
            print(sum(ex.map(soma_fatia, tarefas)))
    finally:
        shm.close()
        shm.unlink()                                   # quem criou deve destruir</code></pre>
        <ul>
          <li><strong>Ciclo de vida:</strong> <code>close()</code> em todo processo que anexou, <code>unlink()</code> uma vez pelo dono. Esquecer o <code>unlink</code> deixa o bloco no sistema (em Linux, em /dev/shm) até o reboot.</li>
          <li>O módulo não sincroniza acesso. Se múltiplos processos escrevem na mesma região, use <code>multiprocessing.Lock</code> ou particione por faixas disjuntas (como acima, só leitura).</li>
          <li>Alternativas: <code>mmap</code> sobre arquivo (persistente), <code>multiprocessing.Value/Array</code> (tipos C simples), e memória compartilhada gerenciada por frameworks como Ray ou Dask.</li>
          <li>Com fork, páginas são copy-on-write: dados somente leitura carregados antes do fork são compartilhados de graça, mas a contagem de referências do CPython escreve nas páginas dos objetos Python e tende a duplicá-las. Arrays NumPy sofrem menos porque o dado bruto não tem refcount por elemento.</li>
        </ul>
        <div class="callout warn"><strong>PEGADINHA</strong> Em Linux, um processo morto abruptamente pode deixar blocos órfãos em /dev/shm. Em serviços longos, monitore e limpe.</div>
      `
    },
    {
      id: 'comunicacao-ipc',
      title: 'Comunicação entre processos: Queue, Pipe, Manager',
      body: `
        <p>Quando o modelo "submeter tarefa, receber resultado" não basta (pipelines contínuos, workers de longa vida), o módulo oferece primitivas de IPC:</p>
        <ul>
          <li><code>multiprocessing.Queue</code>: fila de mensagens serializadas por pickle, entre processos. Cuidado com o deadlock clássico: um processo que escreveu na fila não termina até que os dados sejam consumidos; fazer <code>join()</code> antes de drenar a fila trava.</li>
          <li><code>Pipe</code>: canal ponto a ponto, mais leve que a fila.</li>
          <li><code>Manager</code>: processo servidor que expõe objetos (dict, list, Namespace) por proxy. Conveniente, mas cada acesso é uma chamada IPC: lento para laços apertados.</li>
          <li><code>Event</code>, <code>Lock</code>, <code>Semaphore</code>: versões entre processos das primitivas de threading.</li>
        </ul>
        <pre><code class="language-python">import multiprocessing as mp

def worker(entrada: mp.Queue, saida: mp.Queue):
    for item in iter(entrada.get, None):          # None encerra o worker
        saida.put((item, item ** 2))

if __name__ == "__main__":
    entrada, saida = mp.Queue(), mp.Queue()
    procs = [mp.Process(target=worker, args=(entrada, saida)) for _ in range(3)]
    for p in procs: p.start()
    for i in range(10):
        entrada.put(i)
    for _ in procs:
        entrada.put(None)
    resultados = [saida.get() for _ in range(10)]   # drena ANTES do join
    for p in procs: p.join()
    print(sorted(resultados))</code></pre>
        <p>Para a maioria dos serviços, o desenho mais robusto é a <strong>fila externa</strong> (Redis, RabbitMQ, SQS) com workers independentes: sobrevive à morte de processos, escala em várias máquinas e dá observabilidade. O <code>multiprocessing</code> é a escolha para paralelismo dentro de uma máquina e de um programa.</p>
      `
    },
    {
      id: 'dimensionamento-e-alternativas',
      title: 'Overhead, dimensionamento e alternativas modernas',
      body: `
        <p>O ganho de processos segue a lei de Amdahl e é corroído por overhead: criação dos workers, serialização, cópias de memória e a parte sequencial. Uma tarefa que roda em 1 ms por item não compensa processos; uma que roda em 1 s, compensa de longe. A forma honesta de decidir é medir.</p>
        <pre><code class="language-python">import time
from concurrent.futures import ProcessPoolExecutor

def tarefa(x: int) -&gt; int:
    return x * x               # trivial: o IPC domina

def mede(chunksize: int, n: int = 200_000) -&gt; float:
    t0 = time.perf_counter()
    with ProcessPoolExecutor(4) as ex:
        sum(ex.map(tarefa, range(n), chunksize=chunksize))
    return time.perf_counter() - t0

if __name__ == "__main__":
    t0 = time.perf_counter()
    sum(map(tarefa, range(200_000)))
    print("sequencial", round(time.perf_counter() - t0, 4))
    for cs in (1, 100, 5_000):
        print("chunksize", cs, round(mede(cs), 4))</code></pre>
        <p>Rode e observe: para uma tarefa trivial, o sequencial vence, e o <code>chunksize</code> muda a conta do overhead. Esse tipo de experimento vale mais que qualquer regra de bolso.</p>
        <p>Alternativas a considerar no cenário atual:</p>
        <ul>
          <li><strong>Vetorizar antes de paralelizar</strong> (lição 67): NumPy costuma dar ordens de grandeza sem a complexidade de processos.</li>
          <li><strong>Threads com código que libera o GIL</strong> (NumPy, Numba com <code>nogil=True</code>, Cython com <code>nogil</code>): paralelismo com memória compartilhada, sem pickle.</li>
          <li><strong>InterpreterPoolExecutor</strong> (3.14): isolamento sem o custo de processo do SO, quando as bibliotecas suportam.</li>
          <li><strong>Free-threading</strong>: threads com paralelismo real quando o ecossistema permite.</li>
          <li><strong>Joblib, Dask, Ray</strong>: camadas de nível mais alto para paralelismo de dados e distribuição em cluster.</li>
        </ul>
        <div class="callout"><strong>NA ENTREVISTA</strong> "Por que meu código com ProcessPoolExecutor ficou mais lento?" Hipóteses: tarefas pequenas demais (IPC domina), argumentos grandes serializados a cada chamada, mais workers que núcleos físicos, contenção de memória/cache, e start method spawn recriando estado pesado em cada worker. Cada uma tem um experimento de medição.</div>
      `
    }
  ],
  whenToUse: [
    'CPU-bound em Python puro com o build padrão, com tarefas de custo suficiente para amortizar o IPC',
    'Isolamento de falhas: um worker que quebra não derruba o programa inteiro',
    'Paralelismo de dados com blocos grandes e independentes (processar arquivos, lotes, simulações)',
    'Bibliotecas nativas não thread-safe ou que seguram o GIL, mas que podem rodar isoladas por processo',
    'Uso com memória compartilhada (shared_memory, mmap) para dados numéricos grandes e somente leitura'
  ],
  whenNot: [
    'Tarefas minúsculas (microssegundos a poucos ms): o overhead de serialização e IPC supera o ganho',
    'Muito estado compartilhado mutável e complexo: a comunicação vira o gargalo',
    'Argumentos e resultados enormes enviados por tarefa sem memória compartilhada',
    'I/O-bound: threads ou asyncio são mais leves e simples',
    'Quando uma fila externa com workers independentes é mais adequada (resiliência, escala multi-máquina)'
  ],
  metrics: [
    'Speedup real versus sequencial com time.perf_counter, mesma carga, repetido várias vezes',
    'Utilização de CPU por núcleo e uso de memória por processo (psutil, htop)',
    'chunksize ajustado por experimento; tamanho médio do payload serializado (len(pickle.dumps(x)))',
    'ps / py-spy dump nos workers para ver onde cada um espera',
    'Contagem de BrokenProcessPool e reinícios de worker em produção'
  ],
  refs: [
    { type: 'doc', title: 'multiprocessing: process-based parallelism', author: 'Python Software Foundation', url: 'https://docs.python.org/3/library/multiprocessing.html', note: 'Start methods, Pool, Queue, Manager e as diretrizes de programação.' },
    { type: 'doc', title: 'multiprocessing.shared_memory', author: 'Python Software Foundation', url: 'https://docs.python.org/3/library/multiprocessing.shared_memory.html', note: 'SharedMemory, ShareableList e o ciclo de vida de blocos compartilhados.' },
    { type: 'doc', title: 'concurrent.futures: ProcessPoolExecutor', author: 'Python Software Foundation', url: 'https://docs.python.org/3/library/concurrent.futures.html#processpoolexecutor', note: 'Parâmetros como initializer, max_tasks_per_child e mp_context.' },
    { type: 'doc', title: 'pickle: Python object serialization', author: 'Python Software Foundation', url: 'https://docs.python.org/3/library/pickle.html', note: 'O que é serializável e o aviso de segurança sobre dados não confiáveis.' },
    { type: 'livro', title: 'High Performance Python, 2nd edition', author: 'Micha Gorelick e Ian Ozsvald', url: 'https://www.oreilly.com/library/view/high-performance-python/9781492055013/', note: 'Capítulo de multiprocessing com medições em problemas reais.' },
    { type: 'livro', title: 'Fluent Python, 2nd edition', author: 'Luciano Ramalho', url: 'https://www.oreilly.com/library/view/fluent-python-2nd/9781492056348/', note: 'Concorrência com executores, comparando threads e processos.' },
    { type: 'video', title: 'Live de Python', author: 'Eduardo Mendes', url: 'https://github.com/dunossauro/live-de-python', note: 'Repositório do projeto Live de Python (Eduardo Mendes), com material de lives sobre concorrência, paralelismo e asyncio.' }
  ]
};

window.LESSON_CONTENT['asyncio'] = {
  id: 'asyncio',
  title: 'asyncio por dentro',
  etapa: 10, etapaName: 'Concorrência & async',
  time: '90 min',
  tags: ['asyncio', 'event loop', 'corrotinas', 'tasks'],
  tagline: 'Concorrência cooperativa em uma única thread: cada <em>await</em> é um ponto onde você devolve o controle ao loop.',
  intro: `
    <p>asyncio resolve um problema específico: manter milhares de operações de I/O em andamento ao mesmo tempo sem uma thread para cada uma. Em vez de o sistema operacional preemptar threads, o seu código <strong>cede o controle voluntariamente</strong> em cada <code>await</code>, e um laço de eventos (event loop) decide quem roda em seguida com base em quais descritores de arquivo estão prontos. É o modelo por trás de FastAPI, aiohttp, httpx assíncrono e da maioria dos clientes modernos de banco e fila.</p>
    <p>A maior fonte de bugs em asyncio é tratar <code>async def</code> como mágica de paralelismo. Não é: uma corrotina que faz cálculo pesado, ou chama <code>time.sleep</code> ou uma biblioteca bloqueante, trava o loop inteiro e, com ele, todas as outras tarefas. Entender o mecanismo (corrotina, task, future, selector) é o que permite depurar latências estranhas.</p>
    <p>Esta lição constrói o modelo mental do zero, mostra um mini event loop para desmistificar, cobre tasks, gather, TaskGroup, a ponte com código bloqueante (<code>to_thread</code>), o modo debug e os casos em que async simplesmente não ajuda. A lição 62 continua com padrões de produção (timeouts, cancelamento, backpressure, retries).</p>
  `,
  sections: [
    {
      id: 'corrotinas-e-loop',
      title: 'Corrotinas, event loop e o que await faz',
      body: `
        <p>Chamar uma função <code>async def</code> <strong>não executa nada</strong>: devolve um objeto corrotina. Ela só roda quando alguém a conduz (o event loop, via <code>await</code> ou via task). Dentro, cada <code>await</code> sobre algo que ainda não está pronto <em>suspende</em> a corrotina e devolve o controle ao loop, que escolhe outra tarefa pronta.</p>
        <pre><code class="language-python">import asyncio
import time

async def busca(nome: str, atraso: float) -&gt; str:
    print(f"{nome}: início")
    await asyncio.sleep(atraso)     # cede o controle ao loop (não bloqueia a thread)
    print(f"{nome}: fim")
    return nome.upper()

async def main():
    t0 = time.perf_counter()

    # Sequencial: soma dos atrasos
    await busca("a", 0.3)
    await busca("b", 0.3)
    print(f"sequencial: {time.perf_counter() - t0:.2f}s")

    # Concorrente: tempo do mais lento
    t0 = time.perf_counter()
    r = await asyncio.gather(busca("c", 0.3), busca("d", 0.3))
    print(r, f"concorrente: {time.perf_counter() - t0:.2f}s")

asyncio.run(main())</code></pre>
        <p>Por baixo, o loop usa um <em>selector</em> (epoll no Linux, kqueue no macOS, IOCP no Windows via o loop proactor) para esperar eventos de I/O prontos, mantém uma fila de callbacks prontos e uma heap de temporizadores. Uma iteração do loop faz: calcular o timeout até o próximo temporizador, chamar o selector, enfileirar callbacks dos descritores prontos e dos temporizadores vencidos, e executar tudo que está pronto. Cada "passo" de uma task executa a corrotina até o próximo ponto de suspensão.</p>
        <div class="callout warn"><strong>PEGADINHA</strong> Esquecer o <code>await</code> é o bug mais comum: <code>busca("x", 1)</code> sem await cria uma corrotina que nunca roda e o Python emite "RuntimeWarning: coroutine was never awaited". Habilite warnings como erro nos testes.</div>
      `
    },
    {
      id: 'mini-event-loop',
      title: 'Desmistificando: um event loop em 30 linhas',
      body: `
        <p>Corrotinas são, no fundo, geradores que o loop avança. Este mini scheduler (no espírito das palestras de David Beazley sobre concorrência do zero) mostra o essencial: uma fila de tarefas prontas e uma tarefa que cede o controle com <code>yield</code>.</p>
        <pre><code class="language-python">from collections import deque
import heapq
import time

class MiniLoop:
    def __init__(self):
        self.prontas = deque()      # geradores prontos para avançar
        self.dormindo = []          # heap de (acorda_em, contador, gerador)
        self._n = 0

    def cria(self, gen):
        self.prontas.append(gen)

    def roda(self):
        while self.prontas or self.dormindo:
            agora = time.monotonic()
            while self.dormindo and self.dormindo[0][0] &lt;= agora:
                _, _, g = heapq.heappop(self.dormindo)
                self.prontas.append(g)
            if not self.prontas:
                time.sleep(max(0, self.dormindo[0][0] - agora))
                continue
            gen = self.prontas.popleft()
            try:
                pedido = next(gen)               # roda até o próximo yield
            except StopIteration:
                continue
            if pedido[0] == "dorme":             # o gerador pede para dormir
                self._n += 1
                heapq.heappush(self.dormindo, (time.monotonic() + pedido[1], self._n, gen))
            else:
                self.prontas.append(gen)

def tarefa(nome, passos, intervalo):
    for i in range(passos):
        print(nome, "passo", i)
        yield ("dorme", intervalo)               # equivalente a: await asyncio.sleep(intervalo)

loop = MiniLoop()
loop.cria(tarefa("A", 3, 0.2))
loop.cria(tarefa("B", 3, 0.3))
loop.roda()</code></pre>
        <p>O asyncio real adiciona: <code>Future</code>s (promessas que o loop completa), integração com o selector para I/O, cancelamento, tratamento de exceções, contexto (<code>contextvars</code>) e a sintaxe <code>async/await</code>, que compila para o mesmo mecanismo de suspensão e retomada de geradores (<code>await</code> é um <code>yield from</code> especializado sobre objetos awaitable). A lição: nenhuma mágica, apenas troca cooperativa de contexto em pontos explícitos.</p>
        <p>Consequência importante: <strong>o loop só avança quando a corrotina corrente cede</strong>. Um laço de cálculo de 2 segundos sem <code>await</code> congela todas as conexões por 2 segundos.</p>
      `
    },
    {
      id: 'tasks-gather-taskgroup',
      title: 'Tasks, gather e TaskGroup',
      body: `
        <p>Uma <code>Task</code> envolve uma corrotina e a <strong>agenda</strong> no loop imediatamente, rodando concorrentemente com quem a criou. Duas formas de esperar várias:</p>
        <ul>
          <li><code>asyncio.gather(*aws)</code>: devolve resultados na ordem; com <code>return_exceptions=False</code> (padrão) a primeira exceção é propagada, mas as outras tarefas <strong>continuam rodando</strong> (não são canceladas), o que gera trabalho órfão.</li>
          <li><code>asyncio.TaskGroup</code> (3.11+): concorrência estruturada. Ao sair do bloco <code>async with</code>, todas as tasks terminaram; se uma falha, as irmãs são <strong>canceladas</strong> e as exceções saem agrupadas em um <code>ExceptionGroup</code>, tratado com <code>except*</code>.</li>
        </ul>
        <pre><code class="language-python">import asyncio

async def chama(i: int) -&gt; int:
    await asyncio.sleep(0.1 * i)
    if i == 2:
        raise ValueError(f"falha na chamada {i}")
    return i * 10

async def main():
    try:
        async with asyncio.TaskGroup() as tg:
            tarefas = [tg.create_task(chama(i), name=f"chama-{i}") for i in range(4)]
    except* ValueError as grupo:
        for exc in grupo.exceptions:
            print("erro tratado:", exc)
    else:
        print([t.result() for t in tarefas])

asyncio.run(main())</code></pre>
        <p>Prefira TaskGroup a <code>gather</code> em código novo: nenhuma task escapa do escopo, falhas cancelam o resto e o ciclo de vida fica explícito. Use <code>gather(..., return_exceptions=True)</code> quando quiser coletar todos os resultados e erros sem abortar nada.</p>
        <div class="callout warn"><strong>PEGADINHA</strong> O loop mantém apenas referência <em>fraca</em> às tasks. Um <code>asyncio.create_task(f())</code> cujo retorno você descarta pode ser coletado pelo GC no meio da execução. Guarde a referência (um <code>set</code> com <code>add_done_callback(set.discard)</code>) ou use um TaskGroup.</div>
        <pre><code class="language-python">import asyncio

_em_segundo_plano: set[asyncio.Task] = set()

def dispara(coro) -&gt; asyncio.Task:
    t = asyncio.create_task(coro)
    _em_segundo_plano.add(t)                    # mantém referência forte
    t.add_done_callback(_em_segundo_plano.discard)
    return t</code></pre>
      `
    },
    {
      id: 'bloqueio-e-ponte-com-threads',
      title: 'Código bloqueante: o assassino de latência',
      body: `
        <p>O pior erro em asyncio é chamar algo bloqueante dentro de uma corrotina: <code>requests.get</code>, <code>time.sleep</code>, <code>open().read()</code> de arquivo grande, um driver de banco síncrono, um parser pesado. Enquanto isso, <strong>nenhuma</strong> outra task roda. Os sintomas: latência p99 explode, timeouts em cascata, health checks falhando.</p>
        <pre><code class="language-python">import asyncio
import time

def trabalho_bloqueante(n: int) -&gt; int:
    time.sleep(0.5)                     # simula biblioteca síncrona
    return n * 2

async def ruim():
    return trabalho_bloqueante(1)       # trava o loop inteiro por 0.5s

async def bom():
    # Roda numa thread do executor padrão e libera o loop enquanto espera
    return await asyncio.to_thread(trabalho_bloqueante, 1)

async def main():
    t0 = time.perf_counter()
    await asyncio.gather(*(bom() for _ in range(5)))
    print(f"5 chamadas com to_thread: {time.perf_counter() - t0:.2f}s")

asyncio.run(main())</code></pre>
        <p><code>asyncio.to_thread</code> (3.9+) roda a função no pool de threads do loop e propaga o <code>contextvars</code>. Para CPU-bound, use <code>loop.run_in_executor(ProcessPoolExecutor(), ...)</code> (a thread não ajuda no build com GIL). Se a biblioteca tem versão assíncrona (httpx.AsyncClient, asyncpg, aiofiles), prefira-a: a ponte com threads limita a concorrência ao tamanho do pool.</p>
        <p>Detectar bloqueios: habilite o <strong>modo debug</strong>. O loop passa a logar callbacks e tasks que demoram mais de <code>loop.slow_callback_duration</code> (100 ms por padrão), a avisar de corrotinas nunca aguardadas e de chamadas de APIs não thread-safe fora da thread do loop.</p>
        <pre><code class="language-bash"># Três formas de ligar o debug
PYTHONASYNCIODEBUG=1 python app.py
python -X dev app.py
# ou no código: asyncio.run(main(), debug=True)

# Python 3.14: inspecionar tasks de um processo em execução
python -m asyncio ps  &lt;PID&gt;
python -m asyncio pstree &lt;PID&gt;</code></pre>
      `
    },
    {
      id: 'awaitables-async-iter',
      title: 'Awaitables, async with, async for e geradores assíncronos',
      body: `
        <p>Três tipos de objeto podem ser aguardados: corrotinas, tasks e futures (e qualquer objeto com <code>__await__</code>). O resto da sintaxe assíncrona espelha a síncrona:</p>
        <ul>
          <li><code>async with</code>: gerenciadores de contexto com <code>__aenter__/__aexit__</code> (ou <code>contextlib.asynccontextmanager</code>). Padrão para conexões, locks, sessões.</li>
          <li><code>async for</code>: iteração com <code>__aiter__/__anext__</code>. Padrão para streams, paginação, consumo de filas.</li>
          <li>Geradores assíncronos: <code>async def</code> com <code>yield</code>. Precisam de fechamento explícito (<code>aclose()</code>) se o consumidor sair antes do fim.</li>
        </ul>
        <pre><code class="language-python">import asyncio
from contextlib import asynccontextmanager

@asynccontextmanager
async def sessao(nome: str):
    print(f"abre {nome}")
    try:
        yield nome
    finally:
        await asyncio.sleep(0)       # pode aguardar na limpeza
        print(f"fecha {nome}")

async def paginas(total: int):
    for p in range(total):
        await asyncio.sleep(0.05)    # simula uma chamada paginada
        yield [p * 10 + i for i in range(3)]

async def main():
    async with sessao("db") as s:
        async for lote in paginas(3):
            print(s, lote)
        # compreensão assíncrona
        todos = [x async for lote in paginas(2) for x in lote]
        print(todos)

asyncio.run(main())</code></pre>
        <p>A primitiva de sincronização do asyncio (<code>asyncio.Lock</code>, <code>Event</code>, <code>Semaphore</code>, <code>Queue</code>, <code>Condition</code>) tem API parecida com a de threading, mas <strong>não é thread-safe</strong> e só pode ser usada dentro do loop. Para entregar um resultado de outra thread ao loop, use <code>asyncio.run_coroutine_threadsafe</code> ou <code>loop.call_soon_threadsafe</code>.</p>
        <div class="callout tip"><strong>DICA</strong> Não precisa de <code>asyncio.Lock</code> só porque há várias tasks: como a troca só acontece em <code>await</code>, um trecho sem await entre ler e escrever o estado já é atômico no loop. O lock é necessário quando há um await no meio da seção crítica.</div>
      `
    },
    {
      id: 'quando-async-nao-ajuda',
      title: 'Quando async não ajuda (e o custo de "async por toda parte")',
      body: `
        <p>Async compensa quando há <strong>muita espera de I/O</strong> concorrente. Não compensa, ou piora, quando:</p>
        <ul>
          <li><strong>CPU-bound:</strong> nenhuma concorrência cooperativa acelera cálculo. O loop fica ocupado e o resto espera.</li>
          <li><strong>Poucas operações concorrentes:</strong> para um script que faz três chamadas, threads ou até código síncrono são mais simples e igualmente rápidos.</li>
          <li><strong>Bibliotecas só síncronas:</strong> envolver tudo em <code>to_thread</code> recria um pool de threads com mais cerimônia.</li>
          <li><strong>Equipe sem prática:</strong> o custo cognitivo é real (cores de função: o "contágio" do async pelo call stack, cancelamento, debug de tasks).</li>
        </ul>
        <table>
          <thead><tr><th>Critério</th><th>threads</th><th>asyncio</th></tr></thead>
          <tbody>
            <tr><td>Memória por unidade de concorrência</td><td>Pilha de thread (megabytes reservados de endereço)</td><td>Objeto task e frame da corrotina (ordem de kilobytes)</td></tr>
            <tr><td>Troca de contexto</td><td>Preemptiva, pelo SO</td><td>Cooperativa, em await</td></tr>
            <tr><td>Corridas de dados</td><td>Possíveis em qualquer ponto</td><td>Só entre awaits</td></tr>
            <tr><td>Escala típica</td><td>Dezenas a poucas centenas</td><td>Dezenas de milhares de conexões</td></tr>
            <tr><td>Ecossistema</td><td>Qualquer biblioteca</td><td>Precisa de bibliotecas async</td></tr>
          </tbody>
        </table>
        <p>Os números da tabela são ordens de grandeza qualitativas; o limite real depende de memória, descritores de arquivo (<code>ulimit -n</code>) e do trabalho por conexão. Meça com a sua carga.</p>
        <p>Otimizações do loop: <code>uvloop</code> (implementação do loop em Cython sobre libuv, substituto para Linux e macOS, frequentemente mais rápida em servidores de rede), e, a partir da 3.12, <code>asyncio.eager_task_factory</code>, que executa a task de forma síncrona até o primeiro ponto de suspensão real, o que corta overhead quando muitas corrotinas terminam sem precisar aguardar.</p>
        <div class="callout"><strong>NA ENTREVISTA</strong> "Por que seu serviço async tem latência p99 alta com CPU baixa?" Quase sempre: algo bloqueante no loop (DNS síncrono, driver, JSON gigante), falta de limite de concorrência, ou uma task que nunca cede. Diagnóstico: modo debug, py-spy dump e métricas de atraso do loop (lag).</div>
      `
    }
  ],
  whenToUse: [
    'Milhares de conexões ou requisições concorrentes dominadas por espera de rede',
    'Servidores web, proxies, WebSockets, bots e clientes que fazem fan-out de chamadas',
    'Quando existem bibliotecas assíncronas maduras para todo o caminho de I/O',
    'Orquestração de várias chamadas independentes com timeout e cancelamento estruturado',
    'Pipelines de streaming com backpressure (async for sobre fontes assíncronas)'
  ],
  whenNot: [
    'Carga CPU-bound: o loop trava; use processos, vetorização ou código nativo',
    'Scripts simples com poucas chamadas, em que async só adiciona complexidade',
    'Chamar bibliotecas bloqueantes diretamente em corrotinas (use to_thread ou a versão async)',
    'Descartar tasks sem guardar referência ou sem tratar suas exceções',
    'Misturar loops e threads sem usar as APIs thread-safe (call_soon_threadsafe, run_coroutine_threadsafe)'
  ],
  metrics: [
    'Modo debug (PYTHONASYNCIODEBUG=1, -X dev) e loop.slow_callback_duration',
    'Lag do event loop: medir o atraso de um asyncio.sleep(0) periódico',
    'py-spy dump e, no 3.14, python -m asyncio ps / pstree para listar tasks',
    'Contagem de tasks vivas (len(asyncio.all_tasks())) e exceções nunca recuperadas nos logs',
    'Percentis p50/p95/p99 de latência sob carga (locust, k6, wrk) comparando com e sem uvloop'
  ],
  refs: [
    { type: 'doc', title: 'asyncio: Asynchronous I/O', author: 'Python Software Foundation', url: 'https://docs.python.org/3/library/asyncio.html', note: 'Documentação oficial: runner, tasks, streams, sincronização e subprocessos.' },
    { type: 'doc', title: 'Developing with asyncio (modo debug)', author: 'Python Software Foundation', url: 'https://docs.python.org/3/library/asyncio-dev.html', note: 'Debug mode, corrotinas nunca aguardadas e armadilhas comuns.' },
    { type: 'livro', title: 'Python Concurrency with asyncio', author: 'Matthew Fowler', url: 'https://www.manning.com/books/python-concurrency-with-asyncio', note: 'O livro mais completo sobre asyncio, do event loop a aplicações reais.' },
    { type: 'livro', title: 'Using Asyncio in Python', author: 'Caleb Hattingh (O\'Reilly)', url: 'https://www.oreilly.com/library/view/using-asyncio-in/9781492075325/', note: 'Visão concisa e crítica do modelo e das armadilhas do asyncio.' },
    { type: 'video', title: 'Python Concurrency From the Ground Up: LIVE!', author: 'David Beazley (PyCon 2015)', url: 'https://www.youtube.com/watch?v=MCs5OvhV9S4', note: 'Constrói um scheduler e um servidor do zero, base da intuição sobre event loops.' },
    { type: 'doc', title: 'PEP 3156: Asynchronous IO Support Rebooted (asyncio)', author: 'Guido van Rossum', url: 'https://peps.python.org/pep-3156/', note: 'A proposta original do módulo asyncio.' },
    { type: 'doc', title: 'PEP 492: Coroutines with async and await syntax', author: 'Yury Selivanov', url: 'https://peps.python.org/pep-0492/', note: 'Origem da sintaxe async/await e do protocolo awaitable.' },
    { type: 'livro', title: 'Fluent Python, 2nd edition (capítulo de asyncio)', author: 'Luciano Ramalho', url: 'https://www.oreilly.com/library/view/fluent-python-2nd/9781492056348/', note: 'Comparação entre threads, processos e corrotinas; há tradução pela Novatec.' }
  ]
};

window.LESSON_CONTENT['async-patterns'] = {
  id: 'async-patterns',
  title: 'Padrões de concorrência',
  etapa: 10, etapaName: 'Concorrência & async',
  time: '75 min',
  tags: ['TaskGroup', 'timeout', 'cancelamento', 'backpressure'],
  tagline: 'Em produção, o difícil não é iniciar tarefas: é <em>limitá-las, cancelá-las e encerrá-las</em> bem.',
  intro: `
    <p>Escrever <code>await gather(...)</code> funciona na demo. Em produção você enfrenta: o serviço remoto que demora 30 segundos, 10.000 itens para processar com um limite de 50 conexões, um deploy que manda SIGTERM no meio do trabalho, um retry que multiplica a carga sobre um serviço já degradado. Esta lição reúne os padrões que tornam concorrência assíncrona previsível.</p>
    <p>O fio condutor é a <strong>concorrência estruturada</strong>: toda task tem um escopo de vida bem definido, um dono, um limite de tempo e uma política de falha. TaskGroup e <code>asyncio.timeout</code> (ambos do Python 3.11) tornaram isso nativo, com ideias vindas do Trio e do trabalho de Nathaniel J. Smith sobre concorrência estruturada.</p>
    <p>Os padrões se aplicam igualmente a threads (com adaptações), mas os exemplos usam asyncio porque é onde o cancelamento cooperativo e os limites explícitos são mais naturais.</p>
  `,
  sections: [
    {
      id: 'concorrencia-estruturada',
      title: 'Concorrência estruturada com TaskGroup',
      body: `
        <p>Regra: <strong>nenhuma task sobrevive ao bloco que a criou</strong>. Com TaskGroup, se uma task levanta exceção, o grupo cancela as demais e propaga um <code>ExceptionGroup</code> com todas as falhas. Isso elimina tasks órfãs e erros silenciosos.</p>
        <pre><code class="language-python">import asyncio

async def pega_usuario(uid: int) -&gt; dict:
    await asyncio.sleep(0.1)
    return {"id": uid}

async def pega_pedidos(uid: int) -&gt; list:
    await asyncio.sleep(0.2)
    return [1, 2, 3]

async def perfil(uid: int) -&gt; dict:
    async with asyncio.TaskGroup() as tg:
        t_user = tg.create_task(pega_usuario(uid))
        t_ped = tg.create_task(pega_pedidos(uid))
    # aqui as duas terminaram com sucesso; se uma falhasse, o bloco levantaria
    return {"usuario": t_user.result(), "pedidos": t_ped.result()}

print(asyncio.run(perfil(7)))</code></pre>
        <p>O tratamento de erros usa <code>except*</code>, que filtra por tipo dentro do grupo e deixa passar o resto. Atenção: ao capturar com <code>except*</code>, o que você recebe é um <code>ExceptionGroup</code> (mesmo com uma única exceção), e <code>except*</code> não pode misturar com <code>except</code> comum no mesmo <code>try</code>.</p>
        <pre><code class="language-python">import asyncio

async def pode_falhar(i: int):
    await asyncio.sleep(0.01 * i)
    if i % 2:
        raise ConnectionError(f"rede {i}")
    if i == 4:
        raise ValueError("dados ruins")
    return i

async def main():
    try:
        async with asyncio.TaskGroup() as tg:
            for i in range(6):
                tg.create_task(pode_falhar(i))
    except* ConnectionError as eg:
        print("rede:", [str(e) for e in eg.exceptions])
    except* ValueError as eg:
        print("dados:", [str(e) for e in eg.exceptions])

asyncio.run(main())</code></pre>
        <div class="callout tip"><strong>DICA</strong> Quando você quer "melhor esforço" (todas as tarefas devem rodar mesmo que algumas falhem), capture a exceção <strong>dentro</strong> de cada task e devolva um resultado tipado (sucesso ou erro). O TaskGroup é para "tudo ou nada".</div>
      `
    },
    {
      id: 'timeouts-e-cancelamento',
      title: 'Timeouts e cancelamento',
      body: `
        <p>Toda chamada de rede precisa de timeout. Desde o 3.11, <code>async with asyncio.timeout(segundos)</code> cria um escopo com prazo: se estourar, a task corrente é cancelada e o bloco levanta <code>TimeoutError</code> (o builtin; <code>asyncio.TimeoutError</code> é alias). Existe também <code>asyncio.timeout_at</code> para prazos absolutos e <code>asyncio.wait_for</code> para uma única awaitable.</p>
        <pre><code class="language-python">import asyncio

async def chamada_lenta():
    await asyncio.sleep(10)

async def main():
    try:
        async with asyncio.timeout(0.5):
            await chamada_lenta()
    except TimeoutError:
        print("estourou o prazo, cancelado")

    # Prazo ajustável: útil para um orçamento de tempo compartilhado
    async with asyncio.timeout(None) as escopo:
        loop = asyncio.get_running_loop()
        escopo.reschedule(loop.time() + 2.0)
        await asyncio.sleep(0.1)

asyncio.run(main())</code></pre>
        <p>O cancelamento no asyncio é <strong>cooperativo e implementado por exceção</strong>: <code>task.cancel()</code> faz o próximo <code>await</code> da task levantar <code>asyncio.CancelledError</code>. Regras:</p>
        <ul>
          <li><strong>Nunca engula <code>CancelledError</code></strong> (<code>except Exception</code> não pega, pois ela deriva de <code>BaseException</code>, mas um <code>except BaseException</code> ou um <code>except:</code> pegaria). Se capturar para limpeza, relance com <code>raise</code>.</li>
          <li>Faça a limpeza em <code>finally</code> ou <code>async with</code>. Dentro de um finally você pode aguardar, mas proteja limpezas críticas com <code>asyncio.shield</code> ou limite-as com um timeout próprio.</li>
          <li><code>asyncio.shield(aw)</code> protege uma awaitable de cancelamento <em>pelo chamador</em>; a tarefa interna continua, e você precisa ser dono dela depois. É fácil usar mal.</li>
          <li>Se o <code>timeout</code> e o <code>TaskGroup</code> se aninham, o mecanismo de <code>task.uncancel()</code> (3.11) garante que o cancelamento correto seja atribuído ao escopo certo.</li>
        </ul>
        <pre><code class="language-python">import asyncio

async def worker(nome: str):
    try:
        while True:
            await asyncio.sleep(0.1)
    except asyncio.CancelledError:
        print(nome, "cancelado, fazendo limpeza")
        raise                          # sempre relançar
    finally:
        print(nome, "recursos liberados")

async def main():
    t = asyncio.create_task(worker("w"))
    await asyncio.sleep(0.35)
    t.cancel()
    try:
        await t
    except asyncio.CancelledError:
        print("task confirmou o cancelamento")

asyncio.run(main())</code></pre>
      `
    },
    {
      id: 'limitar-concorrencia',
      title: 'Limitar concorrência: Semaphore e workers fixos',
      body: `
        <p>Disparar 10.000 requisições de uma vez esgota descritores de arquivo, derruba o serviço remoto e leva a erros de limite de taxa. Dois padrões resolvem:</p>
        <p><strong>1) Semaphore:</strong> todas as tasks existem, mas só N executam a parte limitada ao mesmo tempo. Simples; porém cria 10.000 tasks na memória.</p>
        <pre><code class="language-python">import asyncio

async def chama(i: int, sem: asyncio.Semaphore) -&gt; int:
    async with sem:                     # no máximo 20 aqui dentro
        await asyncio.sleep(0.01)       # simula a chamada limitada
        return i

async def main():
    sem = asyncio.Semaphore(20)
    async with asyncio.TaskGroup() as tg:
        tarefas = [tg.create_task(chama(i, sem)) for i in range(1000)]
    print(len(tarefas), sum(t.result() for t in tarefas))

asyncio.run(main())</code></pre>
        <p><strong>2) Pool de workers com fila limitada:</strong> N workers consomem de uma <code>asyncio.Queue(maxsize=M)</code>. A fila cheia faz o produtor esperar em <code>put</code>: isso é <strong>backpressure</strong>, e a memória fica limitada por design, mesmo com milhões de itens.</p>
        <pre><code class="language-python">import asyncio

async def worker(fila: asyncio.Queue, resultados: list):
    while True:
        item = await fila.get()
        try:
            await asyncio.sleep(0.001)          # trabalho
            resultados.append(item * 2)
        finally:
            fila.task_done()

async def main(total=10_000, n_workers=50):
    fila: asyncio.Queue[int] = asyncio.Queue(maxsize=200)   # limite = backpressure
    resultados: list[int] = []
    workers = [asyncio.create_task(worker(fila, resultados)) for _ in range(n_workers)]
    for i in range(total):
        await fila.put(i)                       # bloqueia se a fila encheu
    await fila.join()                           # espera todos os itens serem processados
    for w in workers:
        w.cancel()
    await asyncio.gather(*workers, return_exceptions=True)
    print(len(resultados))

asyncio.run(main())</code></pre>
        <p>Em 3.13, <code>asyncio.Queue.shutdown()</code> permite encerrar a fila de forma limpa (os consumidores recebem <code>asyncio.QueueShutDown</code> quando esvazia), substituindo sentinelas e cancelamento manual de workers.</p>
        <div class="callout warn"><strong>PEGADINHA</strong> Limitar a concorrência no cliente não substitui respeitar limites de taxa do servidor. Combine com um limitador por tempo (token bucket) quando a API cobra por requisições por segundo.</div>
      `
    },
    {
      id: 'retries-e-resiliencia',
      title: 'Retries, backoff com jitter e idempotência',
      body: `
        <p>Retries sem cuidado transformam uma falha parcial em avalanche: todos os clientes reenviam ao mesmo tempo sobre um serviço já doente (<em>retry storm</em>). Receita: <strong>backoff exponencial com jitter</strong>, número máximo de tentativas, orçamento total de tempo, e retry <strong>apenas de erros transitórios e operações idempotentes</strong>.</p>
        <pre><code class="language-python">import asyncio
import random

class ErroTransitorio(Exception):
    pass

async def com_retry(fn, *, tentativas=5, base=0.1, teto=5.0, prazo_total=15.0):
    inicio = asyncio.get_running_loop().time()
    for n in range(tentativas):
        try:
            async with asyncio.timeout(prazo_total):      # protege o conjunto contra travas
                return await fn()
        except ErroTransitorio:
            if n == tentativas - 1:
                raise
            # "full jitter": sorteia entre 0 e o teto exponencial
            espera = random.uniform(0, min(teto, base * 2 ** n))
            gasto = asyncio.get_running_loop().time() - inicio
            if gasto + espera &gt; prazo_total:
                raise
            await asyncio.sleep(espera)

contador = 0
async def instavel():
    global contador
    contador += 1
    if contador &lt; 3:
        raise ErroTransitorio("tente de novo")
    return "ok"

print(asyncio.run(com_retry(instavel)))</code></pre>
        <ul>
          <li><strong>Idempotência:</strong> reenviar um pagamento sem chave de idempotência cobra duas vezes. Use idempotency keys e operações naturalmente idempotentes (PUT, upsert).</li>
          <li><strong>Circuit breaker:</strong> depois de N falhas seguidas, pare de chamar por um período (estado aberto), teste com uma chamada (meio-aberto) e volte ao normal. Bibliotecas: tenacity (retry) e aiobreaker; entenda o padrão antes de adotar a lib.</li>
          <li><strong>Deadline propagation:</strong> passe o prazo restante adiante, para que chamadas encadeadas não somem timeouts maiores que o do cliente original.</li>
          <li><strong>Hedging:</strong> enviar uma segunda requisição depois de um percentil de latência reduz a cauda, ao custo de carga extra. Só em operações idempotentes.</li>
        </ul>
      `
    },
    {
      id: 'shutdown-gracioso',
      title: 'Shutdown gracioso e sinais',
      body: `
        <p>Em contêineres e orquestradores, o encerramento começa com SIGTERM e você tem um período de graça (30 s por padrão no Kubernetes) antes do SIGKILL. O padrão: parar de aceitar trabalho novo, deixar o que está em voo terminar (com limite), liberar recursos, sair.</p>
        <pre><code class="language-python">import asyncio
import signal

async def servico(parar: asyncio.Event):
    while not parar.is_set():
        try:
            async with asyncio.timeout(1.0):
                await parar.wait()          # trabalha ou espera o sinal
        except TimeoutError:
            print("tick de trabalho")

async def main():
    parar = asyncio.Event()
    loop = asyncio.get_running_loop()
    for sig in (signal.SIGINT, signal.SIGTERM):
        loop.add_signal_handler(sig, parar.set)   # só Unix

    async with asyncio.TaskGroup() as tg:
        tg.create_task(servico(parar))
        await parar.wait()
        print("recebi sinal, encerrando")
    # ao sair do bloco, tudo terminou

if __name__ == "__main__":
    asyncio.run(main())</code></pre>
        <p>Além disso, <code>asyncio.run</code> (e <code>asyncio.Runner</code>, 3.11) cancela as tasks restantes e executa <code>shutdown_asyncgens()</code> ao final, o que ajuda, mas não substitui um desenho com ciclo de vida explícito. Para threads e processos, os análogos são <code>Event</code> + <code>join(timeout)</code> e <code>executor.shutdown(cancel_futures=True)</code>.</p>
        <div class="callout"><strong>NA ENTREVISTA</strong> Pergunta sênior: "como você garante que um deploy não perde mensagens em processamento?" Resposta: parar de consumir da fila (ou de dar ack), esperar tasks em voo com timeout menor que o grace period, nack/devolver o que não terminou, e garantir idempotência no consumidor, porque entrega pelo menos uma vez é o realista.</div>
      `
    },
    {
      id: 'observabilidade-async',
      title: 'Observabilidade e testes de código assíncrono',
      body: `
        <p>Concorrência sem observabilidade é caixa-preta. Instrumente: número de tasks vivas, profundidade das filas, tempo de espera por semáforo, latência por operação, contagem de timeouts e retries, e o <em>lag</em> do event loop. Use <code>contextvars</code> para propagar trace id por tasks.</p>
        <pre><code class="language-python">import asyncio
import time

async def monitor_lag(intervalo: float = 0.5, limite: float = 0.05):
    """Mede o atraso do loop: se alto, algo está bloqueando."""
    while True:
        esperado = time.perf_counter() + intervalo
        await asyncio.sleep(intervalo)
        atraso = time.perf_counter() - esperado
        if atraso &gt; limite:
            print(f"loop atrasado em {atraso * 1000:.0f} ms (algo bloqueou)")

async def main():
    monitor = asyncio.create_task(monitor_lag())
    await asyncio.sleep(0.2)
    time.sleep(0.4)                 # bloqueio proposital: o monitor vai acusar
    await asyncio.sleep(1.2)
    monitor.cancel()

asyncio.run(main())</code></pre>
        <p>Testes: use <code>pytest-asyncio</code> ou <code>anyio</code>, e <code>unittest.IsolatedAsyncioTestCase</code> da biblioteca padrão. Para tempo, evite <code>sleep</code> real: injete um relógio ou use <code>asyncio.timeout</code> com valores pequenos e determinísticos. Teste os caminhos infelizes: timeout, cancelamento no meio, falha de uma entre N tasks, fila cheia. Uma corrida que só aparece em produção costuma ser um caminho de cancelamento que ninguém testou.</p>
        <div class="callout tip"><strong>DICA</strong> Considere anyio ou Trio se você valoriza concorrência estruturada desde sempre e cancelamento mais disciplinado: o anyio roda sobre asyncio ou Trio com a mesma API, e inspirou parte do desenho do TaskGroup.</div>
      `
    }
  ],
  whenToUse: [
    'TaskGroup quando um conjunto de tarefas deve ter vida e falha em bloco (tudo ou nada)',
    'asyncio.timeout em toda chamada de rede, com prazo total propagado',
    'Semaphore para limitar concorrência; fila limitada com workers para volumes grandes (backpressure)',
    'Retry com backoff exponencial e jitter para erros transitórios em operações idempotentes',
    'Shutdown gracioso com sinais em qualquer serviço de longa duração'
  ],
  whenNot: [
    'Retry cego de operações não idempotentes ou de erros permanentes (400, validação)',
    'Criar uma task por item de uma lista enorme sem limite: memória e conexões explodem',
    'Capturar CancelledError sem relançar, impedindo timeouts e shutdown',
    'Usar gather sem return_exceptions e sem cancelamento, deixando tasks órfãs ao primeiro erro',
    'Usar shield como remendo para esconder falta de desenho de ciclo de vida'
  ],
  metrics: [
    'Lag do event loop, número de tasks vivas (asyncio.all_tasks), profundidade das filas',
    'Taxa de timeouts, retries e aberturas de circuit breaker por dependência',
    'Latência p50/p95/p99 por operação e tempo de espera por semáforo',
    'Tempo de drenagem no shutdown versus o período de graça do orquestrador',
    'Testes com falhas injetadas (timeout, cancelamento, queda parcial) em CI'
  ],
  refs: [
    { type: 'doc', title: 'Coroutines and Tasks (TaskGroup, timeout, shield)', author: 'Python Software Foundation', url: 'https://docs.python.org/3/library/asyncio-task.html', note: 'Referência oficial de TaskGroup, asyncio.timeout, cancelamento e wait_for.' },
    { type: 'doc', title: 'Synchronization Primitives e Queues', author: 'Python Software Foundation', url: 'https://docs.python.org/3/library/asyncio-queue.html', note: 'asyncio.Queue, maxsize, join e shutdown (3.13).' },
    { type: 'artigo', title: 'Notes on structured concurrency, or: Go statement considered harmful', author: 'Nathaniel J. Smith', url: 'https://vorpus.org/blog/notes-on-structured-concurrency-or-go-statement-considered-harmful/', note: 'O texto que popularizou a concorrência estruturada e inspirou Trio e TaskGroup.' },
    { type: 'artigo', title: 'Exponential Backoff And Jitter', author: 'Marc Brooker (AWS Architecture Blog)', url: 'https://aws.amazon.com/blogs/architecture/exponential-backoff-and-jitter/', note: 'Comparação quantitativa das estratégias de jitter.' },
    { type: 'livro', title: 'Python Concurrency with asyncio', author: 'Matthew Fowler', url: 'https://www.manning.com/books/python-concurrency-with-asyncio', note: 'Capítulos sobre cancelamento, timeouts, filas e testes de código assíncrono.' },
    { type: 'doc', title: 'PEP 654: Exception Groups and except*', author: 'Irit Katriel e outros', url: 'https://peps.python.org/pep-0654/', note: 'Base do tratamento de erros múltiplos em TaskGroup.' },
    { type: 'doc', title: 'AnyIO documentation', author: 'Alex Grönholm', url: 'https://anyio.readthedocs.io/', note: 'Concorrência estruturada portável entre asyncio e Trio.' }
  ]
};

window.LESSON_CONTENT['profiling'] = {
  id: 'profiling',
  title: 'Profiling e benchmarking',
  etapa: 11, etapaName: 'High performance',
  time: '75 min',
  tags: ['cProfile', 'py-spy', 'pyperf', 'timeit'],
  tagline: 'Otimização sem medição é palpite. <em>Meça</em>, ache o gargalo real, mude uma coisa, meça de novo.',
  intro: `
    <p>Donald Knuth escreveu que a otimização prematura é a raiz de muito mal, mas a frase completa fala em ser disciplinado sobre os 3% que importam. Profiling é essa disciplina: descobrir <em>onde</em> o tempo (ou a memória) realmente vai, porque a intuição humana sobre gargalos é sistematicamente ruim. O trecho "óbvio" quase nunca é o lento.</p>
    <p>Existem duas perguntas distintas e duas famílias de ferramentas. <strong>Profiling</strong> responde "onde o programa gasta recursos?" (cProfile, py-spy, Scalene, line_profiler). <strong>Benchmarking</strong> responde "esta versão é mais rápida que aquela, com que confiança estatística?" (timeit, pyperf, pytest-benchmark). Confundir as duas leva a conclusões erradas, como otimizar uma função que representa 2% do tempo ou declarar vitória em cima de ruído.</p>
    <p>Esta lição dá o fluxo de trabalho (medir, localizar, hipótese, mudar, remedir), cada ferramenta com seu trade-off, as fontes de erro em benchmarks e a política de comunicar resultados sem inventar números. Toda otimização das lições seguintes pressupõe que você sabe fazer isso.</p>
  `,
  sections: [
    {
      id: 'fluxo-de-trabalho',
      title: 'O fluxo: defina, meça, localize, mude, remeça',
      body: `
        <ol>
          <li><strong>Defina o objetivo mensurável:</strong> "p99 da rota X abaixo de 200 ms com 50 req/s", não "mais rápido".</li>
          <li><strong>Tenha um benchmark reprodutível</strong> com dados representativos e ambiente estável. Sem isso, nada do resto vale.</li>
          <li><strong>Localize o gargalo</strong> com um profiler, do geral para o específico (processo, função, linha).</li>
          <li><strong>Formule uma hipótese</strong> (a chamada ao banco em laço é o custo) e <strong>mude uma coisa</strong> por vez.</li>
          <li><strong>Remeça</strong> no mesmo benchmark e compare com variância. Mantenha ou descarte.</li>
          <li><strong>Pare</strong> quando atingir a meta. Cada otimização custa legibilidade e manutenção.</li>
        </ol>
        <p>A lei de Amdahl é o seu freio: se um trecho é 10% do tempo, mesmo torná-lo infinitamente rápido dá no máximo cerca de 1,11x no total.</p>
        <div class="math">speedup_total = 1 / ((1 - p) + p / s)</div>
        <p>Aqui p é a fração do tempo gasta no trecho otimizado e s o ganho local. Por isso o profiling precede qualquer mudança: ele diz o p.</p>
        <div class="callout warn"><strong>PEGADINHA</strong> Medir em produção real costuma ser mais verdadeiro que em laptop: cache frio, concorrência, dados reais, latência de rede. Use profilers de amostragem de baixo overhead (py-spy) para isso e confirme localmente com benchmark controlado.</div>
      `
    },
    {
      id: 'cprofile',
      title: 'cProfile: o profiler determinístico da biblioteca padrão',
      body: `
        <p>O <code>cProfile</code> instrumenta cada chamada e retorno de função, registrando número de chamadas, tempo próprio (<em>tottime</em>) e acumulado (<em>cumtime</em>). É exato em contagens, mas tem overhead que distorce programas com muitas chamadas pequenas. Use-o para achar <strong>quais funções</strong> dominam.</p>
        <pre><code class="language-bash"># Perfila um script inteiro e salva o resultado
python -m cProfile -o saida.prof meu_script.py

# Lê, ordenando por tempo acumulado
python -c "import pstats; p = pstats.Stats('saida.prof'); p.sort_stats('cumulative').print_stats(15)"

# Visualização interativa (instale snakeviz)
snakeviz saida.prof</code></pre>
        <pre><code class="language-python">import cProfile
import pstats
import io

def mais_lenta():
    return sum(i * i for i in range(300_000))

def menos_lenta():
    return sum(range(300_000))

def principal():
    for _ in range(5):
        mais_lenta()
        menos_lenta()

pr = cProfile.Profile()
pr.enable()
principal()
pr.disable()

buf = io.StringIO()
pstats.Stats(pr, stream=buf).sort_stats("tottime").print_stats(5)
print(buf.getvalue())</code></pre>
        <ul>
          <li><strong>tottime:</strong> tempo gasto na função, excluindo subchamadas. Aponta onde o trabalho acontece.</li>
          <li><strong>cumtime:</strong> inclui subchamadas. Aponta quais ramos da árvore dominam.</li>
          <li>Funções C aparecem como <code>{built-in method ...}</code>: o custo está em código nativo.</li>
          <li>Desde o 3.12, o <code>sys.monitoring</code> (PEP 669) oferece uma base de baixo overhead para novas ferramentas de profiling e cobertura; vale acompanhar o ecossistema.</li>
        </ul>
        <div class="callout tip"><strong>DICA</strong> Para perfilar apenas um trecho em uma aplicação grande, use <code>cProfile.Profile()</code> como context manager (3.8+): <code>with cProfile.Profile() as pr: ...</code>.</div>
      `
    },
    {
      id: 'py-spy-scalene',
      title: 'Amostragem: py-spy e Scalene',
      body: `
        <p>Profilers de <strong>amostragem</strong> olham a pilha de chamadas periodicamente (ex.: 100 vezes por segundo), em vez de instrumentar cada chamada. Overhead baixo e quase nenhuma distorção; perdem eventos muito curtos, mas mostram bem onde o tempo se acumula.</p>
        <p><strong>py-spy</strong> (Ben Frederickson) é escrito em Rust e anexa a um processo Python <em>em execução</em>, sem alterar código nem reiniciar: ideal para produção.</p>
        <pre><code class="language-bash"># Visão ao vivo, estilo top
py-spy top --pid 12345

# Gera um flame graph SVG por 30 segundos
py-spy record -o perfil.svg --duration 30 --pid 12345

# Perfila um comando novo, incluindo frames nativos (C/Rust) e subprocessos
py-spy record --native --subprocesses -o perfil.svg -- python app.py

# Pilhas de todas as threads agora (diagnóstico de travas e deadlocks)
py-spy dump --pid 12345</code></pre>
        <p>Em Linux, anexar a outro processo pode exigir privilégios (ptrace); em contêineres, é preciso a capability apropriada. Flame graphs: a largura de cada bloco é o tempo; procure plateaus largos, que são os candidatos.</p>
        <p><strong>Scalene</strong> (Emery Berger e equipe, UMass) é um profiler de CPU, memória e GPU em nível de linha. Diferencial: separa o tempo gasto em <em>Python</em>, em <em>código nativo</em> e em <em>sistema</em>, e atribui alocações de memória e cópias (inclusive de e para a GPU) às linhas responsáveis.</p>
        <pre><code class="language-bash">pip install scalene
scalene meu_script.py                 # relatório no terminal/navegador
scalene --cli --html --outfile rel.html meu_script.py
# Linhas com muito tempo "Python" são candidatas a vetorização/código nativo.
# Linhas com muito tempo "native" já estão em C e pedem otimização algorítmica.</code></pre>
        <p>Essa separação responde uma pergunta decisiva: vale a pena compilar ou vetorizar esta linha? Se o tempo já é nativo (NumPy chamando BLAS), reescrever em Cython não ajuda.</p>
      `
    },
    {
      id: 'line-profiler-timeit',
      title: 'line_profiler e timeit: microscópio e cronômetro',
      body: `
        <p><strong>line_profiler</strong> mede o tempo <em>por linha</em> das funções que você marcar com <code>@profile</code>. Use depois que cProfile ou py-spy apontaram a função suspeita.</p>
        <pre><code class="language-bash">pip install line_profiler
kernprof -l -v meu_script.py    # -l: line profiling, -v: mostra o resultado</code></pre>
        <pre><code class="language-python"># meu_script.py: o decorador @profile é injetado pelo kernprof
@profile
def processa(linhas):
    saida = []
    for l in linhas:
        partes = l.split(",")        # quanto custa cada linha?
        saida.append(int(partes[1]) * 2)
    return saida

if __name__ == "__main__":
    processa([f"a,{i}" for i in range(200_000)])</code></pre>
        <p><strong>timeit</strong> mede trechos pequenos com repetição e desabilita o GC por padrão durante a medição. Para comparar alternativas:</p>
        <pre><code class="language-python">import timeit

setup = "dados = list(range(10_000)); alvo = 9_999; conj = set(dados)"
t_lista = timeit.repeat("alvo in dados", setup=setup, number=2_000, repeat=5)
t_set = timeit.repeat("alvo in conj", setup=setup, number=2_000, repeat=5)

# Use o MENOR tempo: ruído só ADICIONA tempo, nunca subtrai
print("lista:", min(t_lista))
print("set:  ", min(t_set))</code></pre>
        <pre><code class="language-bash">python -m timeit -s "d = list(range(1000))" "sorted(d)"
python -m timeit -n 1000 -r 7 -s "x = 'a' * 100" "x.upper()"</code></pre>
        <div class="callout warn"><strong>PEGADINHA</strong> Micro-benchmarks mentem fácil: o dado do <code>setup</code> pode já estar em cache, a operação pode ficar rápida só por causa do cache da CPU, e em Python o resultado muda entre versões por causa do interpretador adaptativo (lição 66). Um micro-benchmark sozinho nunca justifica reescrever código; confirme no benchmark de ponta a ponta.</div>
      `
    },
    {
      id: 'pyperf-estatistica',
      title: 'pyperf: benchmarks com rigor estatístico',
      body: `
        <p><strong>pyperf</strong> (Victor Stinner, usado pelo projeto pyperformance do CPython) executa o benchmark em <strong>vários processos</strong>, com aquecimento, calibra o número de laços, e relata média e desvio padrão. Comparar dois resultados diz se a diferença é estatisticamente significativa.</p>
        <pre><code class="language-bash">pip install pyperf

# Microbenchmark rápido, com média e desvio
python -m pyperf timeit -s "d = list(range(1000))" "sorted(d)"

# Salvar duas versões e comparar
python -m pyperf timeit -s "..." "versao_a" -o a.json
python -m pyperf timeit -s "..." "versao_b" -o b.json
python -m pyperf compare_to a.json b.json   # diz "significativamente mais rápido" ou "não significativo"

# Reduz ruído do sistema (Linux, requer root): fixa frequência, isola CPUs
sudo python -m pyperf system tune</code></pre>
        <pre><code class="language-python">import pyperf

def versao_a(n):
    return sum([i * i for i in range(n)])

def versao_b(n):
    return sum(i * i for i in range(n))

runner = pyperf.Runner()
runner.bench_func("lista_completa", versao_a, 10_000)
runner.bench_func("gerador", versao_b, 10_000)</code></pre>
        <p>Fontes de ruído a controlar em qualquer benchmark:</p>
        <ul>
          <li><strong>Frequência e energia da CPU</strong> (turbo, governors), <strong>vizinhos ruidosos</strong> em VMs e CI compartilhado.</li>
          <li><strong>Aquecimento</strong>: caches, imports, e o interpretador adaptativo (que se especializa após algumas execuções) mudam o tempo das primeiras iterações.</li>
          <li><strong>GC</strong>: pode disparar no meio da medição; decida se faz parte do que você quer medir.</li>
          <li><strong>Dados</strong>: tamanho e distribuição realistas; dados minúsculos cabem no cache e escondem o custo de memória.</li>
          <li><strong>Tamanho da amostra:</strong> repita o suficiente para obter intervalos de confiança estreitos, e relate variância junto com a média.</li>
        </ul>
        <p>Política de relato: diga a máquina, a versão do Python e do SO, o build (com ou sem GIL, com ou sem JIT experimental), o número de repetições e a variância. Um "ficou 3x mais rápido" sem essas condições não é um resultado.</p>
      `
    },
    {
      id: 'memoria-e-io',
      title: 'Profiling de memória, I/O e produção contínua',
      body: `
        <p>Nem todo gargalo é CPU. Para memória, as ferramentas principais são <strong>tracemalloc</strong> (stdlib, rastreia alocações Python), <strong>memray</strong> (Bloomberg, rastreia também alocações nativas, gera flame graphs de alocação e funciona com NumPy) e o Scalene. A lição 65 aprofunda. Para I/O, observe o tempo de parede versus CPU: se <code>user+sys</code> é muito menor que o tempo real, o programa passa tempo esperando.</p>
        <pre><code class="language-bash"># memray: grava alocações e gera um flame graph
pip install memray
memray run -o saida.bin meu_script.py
memray flamegraph saida.bin          # gera um HTML interativo
memray summary saida.bin             # maiores alocadores em tabela

# Tempo real versus CPU de um comando
/usr/bin/time -v python meu_script.py   # observe "Elapsed" vs "User time"</code></pre>
        <pre><code class="language-python">import cProfile
import functools

def perfila(fn):
    """Decorador de profiling para usar em desenvolvimento, nunca em produção."""
    @functools.wraps(fn)
    def interno(*a, **kw):
        with cProfile.Profile() as pr:
            r = fn(*a, **kw)
        pr.print_stats(sort="cumulative")
        return r
    return interno</code></pre>
        <p>Em produção, o ideal é <strong>profiling contínuo</strong> com amostragem de baixo overhead (plataformas como Pyroscope ou Parca, e o py-spy sob demanda), para comparar perfis antes e depois de um deploy. No Linux, o Python 3.12 adicionou suporte ao profiler <code>perf</code> via <code>-X perf</code> (os frames Python aparecem nos relatórios), o que permite ver Python e código nativo na mesma visão.</p>
        <div class="callout"><strong>NA ENTREVISTA</strong> "A API ficou lenta, o que você faz?" Resposta sênior: reproduzir com carga, olhar métricas (CPU, memória, I/O, banco), perfilar por amostragem em produção ou staging, localizar a função e a linha, formular uma hipótese, mudar uma coisa e medir com variância. Menciono Amdahl para justificar parar quando o ganho marginal acaba.</div>
      `
    }
  ],
  whenToUse: [
    'Antes de qualquer otimização, para saber onde está o tempo e a memória',
    'cProfile para ranking de funções em desenvolvimento; py-spy em produção e em processos já rodando',
    'Scalene quando precisa separar tempo Python de nativo e achar cópias de memória',
    'pyperf e timeit para comparar alternativas com rigor e variância conhecida',
    'Profiling contínuo para detectar regressões de desempenho entre deploys'
  ],
  whenNot: [
    'Não otimize trechos que o profiler não apontou: ganho real tende a ser mínimo',
    'Não conclua nada de um único run ou sem variância: ruído parece ganho',
    'Não rode cProfile com overhead alto em produção; prefira amostragem',
    'Não use micro-benchmarks isolados para decidir arquitetura',
    'Não compare benchmarks de máquinas, versões ou builds diferentes como se fossem equivalentes'
  ],
  metrics: [
    'cProfile/pstats: ncalls, tottime, cumtime; snakeviz para visualizar',
    'py-spy top/record/dump (flame graph por amostragem, pilhas de threads)',
    'Scalene: percentuais de tempo Python vs nativo vs sistema, memória por linha',
    'pyperf: média, desvio padrão e compare_to com significância; pyperf system tune',
    'tracemalloc e memray para memória; /usr/bin/time -v para tempo real versus CPU'
  ],
  refs: [
    { type: 'doc', title: 'The Python Profilers (cProfile e profile)', author: 'Python Software Foundation', url: 'https://docs.python.org/3/library/profile.html', note: 'Referência oficial do cProfile e do pstats.' },
    { type: 'doc', title: 'pyperf documentation', author: 'Victor Stinner', url: 'https://pyperf.readthedocs.io/', note: 'Benchmarks estatisticamente rigorosos e dicas para reduzir ruído.' },
    { type: 'doc', title: 'py-spy: sampling profiler for Python programs', author: 'Ben Frederickson', url: 'https://github.com/benfred/py-spy', note: 'Profiler de amostragem para processos em execução.' },
    { type: 'doc', title: 'Scalene: a high-performance CPU, GPU and memory profiler', author: 'Emery Berger et al. (UMass Amherst)', url: 'https://github.com/plasma-umass/scalene', note: 'Perfilamento de CPU, memória e GPU em nível de linha.' },
    { type: 'doc', title: 'memray: memory profiler for Python', author: 'Bloomberg', url: 'https://bloomberg.github.io/memray/', note: 'Rastreia alocações Python e nativas com flame graphs.' },
    { type: 'doc', title: 'line_profiler', author: 'Robert Kern e mantenedores', url: 'https://github.com/pyutils/line_profiler', note: 'Tempo por linha com kernprof.' },
    { type: 'livro', title: 'High Performance Python, 2nd edition', author: 'Micha Gorelick e Ian Ozsvald', url: 'https://www.oreilly.com/library/view/high-performance-python/9781492055013/', note: 'Referência central: profiling, medição e otimização com estudos de caso.' },
    { type: 'doc', title: 'timeit: measure execution time of small code snippets', author: 'Python Software Foundation', url: 'https://docs.python.org/3/library/timeit.html', note: 'Uso correto e armadilhas de medição de trechos pequenos.' }
  ]
};

window.LESSON_CONTENT['estruturas-eficientes'] = {
  id: 'estruturas-eficientes',
  title: 'Algoritmos e estruturas eficientes',
  etapa: 11, etapaName: 'High performance',
  time: '75 min',
  tags: ['Big-O', 'heapq', 'bisect', 'deque'],
  tagline: 'A otimização mais barata é trocar <em>O(n²)</em> por O(n log n) ou O(n) com a estrutura certa.',
  intro: `
    <p>Antes de código nativo, antes de paralelismo, olhe para o algoritmo e as estruturas de dados. Um <code>x in lista</code> dentro de um laço é O(n²) escondido; trocar a lista por um set costuma dar ganhos de ordens de grandeza que nenhuma micro-otimização alcança. A biblioteca padrão já traz estruturas excelentes: dict e set (tabelas hash), <code>deque</code>, <code>heapq</code>, <code>bisect</code>, <code>collections.Counter</code>, <code>itertools</code>.</p>
    <p>Esta lição foca no que importa na prática: o custo real das operações dos tipos builtin (a página "TimeComplexity" do wiki do Python é a referência), os erros de complexidade escondida, e as ferramentas da biblioteca padrão que resolvem classes inteiras de problemas. Complexidade assintótica não é tudo (constantes e cache importam), mas é o primeiro filtro.</p>
    <p>Em entrevista sênior, a pergunta nunca é "qual a complexidade do sort?", e sim "por que este laço está lento e como você prova?". A resposta combina Big-O com medição (lição 63).</p>
  `,
  sections: [
    {
      id: 'custos-dos-builtins',
      title: 'O custo real dos tipos builtin',
      body: `
        <table>
          <thead><tr><th>Operação</th><th>list</th><th>dict / set</th><th>deque</th></tr></thead>
          <tbody>
            <tr><td>Acesso por índice</td><td>O(1)</td><td>O(1) por chave (média)</td><td>O(n) no meio, O(1) nas pontas</td></tr>
            <tr><td>Inserir no fim</td><td>O(1) amortizado</td><td>O(1) médio</td><td>O(1)</td></tr>
            <tr><td>Inserir/remover no início</td><td>O(n)</td><td>n/a</td><td>O(1)</td></tr>
            <tr><td>x in container</td><td>O(n)</td><td>O(1) médio</td><td>O(n)</td></tr>
            <tr><td>Remover por valor</td><td>O(n)</td><td>O(1) médio</td><td>O(n)</td></tr>
            <tr><td>Ordenar</td><td>O(n log n) (Timsort)</td><td>n/a</td><td>n/a</td></tr>
          </tbody>
        </table>
        <p>"Médio" significa que, no pior caso, colisões de hash degradam para O(n); chaves com <code>__hash__</code> ruim ou ataques de colisão deliberados (por isso o Python randomiza o hash de strings) podem causar isso. Os custos constantes também importam: uma lista pequena (dezenas de itens) com <code>in</code> pode ser tão rápida quanto um set.</p>
        <pre><code class="language-python">import timeit

# Armadilha clássica: membership em lista dentro de laço
n = 20_000
usuarios = list(range(n))
alvos = list(range(0, n, 2))

def ruim():
    return [a for a in alvos if a in usuarios]        # O(n * m)

def bom():
    conj = set(usuarios)                               # constrói uma vez, O(n)
    return [a for a in alvos if a in conj]             # O(m)

assert ruim() == bom()
print("lista:", min(timeit.repeat(ruim, number=1, repeat=3)))
print("set:  ", min(timeit.repeat(bom, number=1, repeat=3)))</code></pre>
        <div class="callout warn"><strong>PEGADINHA</strong> Complexidades escondidas em operações que parecem baratas: <code>lista.insert(0, x)</code> e <code>lista.pop(0)</code> (O(n)), fatiamento <code>a[i:j]</code> (copia), <code>str += ...</code> em laço (pode ser quadrático; o CPython tem uma otimização local que não é garantia, e outras implementações não a têm), <code>lista.remove(x)</code>, <code>x in lista</code>, <code>list(dict)</code> repetido, <code>copy.deepcopy</code> em laço.</div>
      `
    },
    {
      id: 'deque-heapq-bisect',
      title: 'deque, heapq e bisect',
      body: `
        <p><strong>deque</strong>: lista duplamente encadeada em blocos, O(1) nas duas pontas. Use como fila (FIFO), janela deslizante e pilha. O parâmetro <code>maxlen</code> cria um buffer circular que descarta os mais antigos.</p>
        <pre><code class="language-python">from collections import deque

# BFS: a fila certa evita pop(0) O(n)
def bfs(grafo: dict[str, list[str]], inicio: str) -&gt; list[str]:
    visto, ordem = {inicio}, []
    fila = deque([inicio])
    while fila:
        no = fila.popleft()               # O(1)
        ordem.append(no)
        for viz in grafo[no]:
            if viz not in visto:
                visto.add(viz)
                fila.append(viz)
    return ordem

ultimos = deque(maxlen=3)                 # buffer circular
for x in range(10):
    ultimos.append(x)
print(list(ultimos))                      # [7, 8, 9]</code></pre>
        <p><strong>heapq</strong>: min-heap sobre lista. <code>heappush</code> e <code>heappop</code> em O(log n), <code>heapify</code> em O(n), <code>nsmallest/nlargest(k, ...)</code> em aproximadamente O(n log k), melhor que ordenar tudo quando k é pequeno. Para max-heap, negue as chaves (ou use tuplas com prioridade negativa).</p>
        <pre><code class="language-python">import heapq
from itertools import count

# Top-k sem ordenar tudo
vendas = [("a", 10), ("b", 99), ("c", 45), ("d", 70), ("e", 5)]
print(heapq.nlargest(3, vendas, key=lambda t: t[1]))

# Fila de prioridade com desempate estável (evita comparar objetos não comparáveis)
cont = count()
fila: list[tuple[int, int, str]] = []
heapq.heappush(fila, (2, next(cont), "tarefa média"))
heapq.heappush(fila, (1, next(cont), "tarefa urgente"))
print(heapq.heappop(fila))                # (1, 1, 'tarefa urgente')

# Mesclar fluxos já ordenados com memória constante
print(list(heapq.merge([1, 4, 9], [2, 3, 10], [5, 6])))</code></pre>
        <p><strong>bisect</strong>: busca binária em sequência ordenada, O(log n). <code>insort</code> insere mantendo a ordem, mas a inserção em lista é O(n) pelo deslocamento: bom para busca frequente e poucas inserções. Desde o 3.10, aceita <code>key=</code>.</p>
        <pre><code class="language-python">import bisect

faixas = [0, 600, 700, 800, 900]
conceitos = ["F", "D", "C", "B", "A"]

def conceito(nota: int) -&gt; str:
    i = bisect.bisect_right(faixas, nota) - 1     # O(log n)
    return conceitos[i]

print(conceito(750), conceito(900), conceito(100))   # C A F

ordenada = [10, 20, 30, 40]
bisect.insort(ordenada, 25)                       # mantém ordenada, mas é O(n)
print(ordenada)</code></pre>
      `
    },
    {
      id: 'colecoes-e-idiomas',
      title: 'collections, itertools e idiomas rápidos',
      body: `
        <p>Muitos laços manuais já existem prontos, escritos em C e testados:</p>
        <ul>
          <li><code>Counter</code>: contagem de frequência em O(n); <code>most_common(k)</code> usa heap internamente.</li>
          <li><code>defaultdict</code>: agrupamento sem verificar a chave a cada iteração.</li>
          <li><code>itertools</code>: <code>chain</code>, <code>islice</code>, <code>groupby</code> (exige entrada ordenada pela chave), <code>accumulate</code>, <code>pairwise</code> (3.10), <code>batched</code> (3.12).</li>
          <li><code>sum</code>, <code>min</code>, <code>max</code>, <code>any</code>, <code>all</code>, <code>sorted(key=...)</code>: laços internos em C.</li>
          <li><code>"".join(partes)</code> em vez de concatenar strings em laço: O(n) garantido.</li>
          <li><code>functools.cache</code> / <code>lru_cache</code>: memoização de funções puras (lição 70).</li>
        </ul>
        <pre><code class="language-python">from collections import Counter, defaultdict
from itertools import batched   # Python 3.12+

palavras = "a b a c b a d".split()
print(Counter(palavras).most_common(2))            # [('a', 3), ('b', 2)]

por_inicial: defaultdict[str, list[str]] = defaultdict(list)
for p in ["banana", "abacaxi", "bolo", "amora"]:
    por_inicial[p[0]].append(p)
print(dict(por_inicial))

# Processa em lotes sem materializar tudo
for lote in batched(range(10), 4):
    print(lote)                                    # (0,1,2,3) (4,5,6,7) (8,9)

# Ordenação com chave: calcula a chave uma vez por elemento
nomes = ["Ana", "bruno", "Carla", "daniel"]
print(sorted(nomes, key=str.casefold))</code></pre>
        <p><strong>Geradores e compreensões:</strong> um gerador processa em fluxo com memória O(1) e evita materializar listas intermediárias. Uma compreensão de lista é geralmente mais rápida que o laço equivalente com <code>append</code> (menos overhead de bytecode), mas não materialize quando só vai iterar uma vez: <code>sum(x*x for x in dados)</code> não precisa da lista.</p>
        <div class="callout tip"><strong>DICA</strong> Ordenação é estável: ordene por chave secundária primeiro e depois pela primária, ou use uma tupla como chave. Para ordenar por "campo decrescente, outro crescente", use <code>key</code> com sinal negativo em números, ou duas passagens, nunca <code>cmp_to_key</code> sem necessidade (é lento).</div>
      `
    },
    {
      id: 'algoritmos-classicos',
      title: 'Trocar o algoritmo: exemplos de ganho assintótico',
      body: `
        <p>Três transformações de algoritmo que aparecem o tempo todo:</p>
        <p><strong>1) Dois ponteiros / janela deslizante em vez de laços aninhados.</strong> Soma máxima de janela de tamanho k: O(n·k) ingênuo versus O(n) mantendo a soma incremental.</p>
        <pre><code class="language-python">def max_janela_ingenua(xs: list[int], k: int) -&gt; int:
    return max(sum(xs[i:i + k]) for i in range(len(xs) - k + 1))     # O(n * k)

def max_janela(xs: list[int], k: int) -&gt; int:
    soma = sum(xs[:k])
    melhor = soma
    for i in range(k, len(xs)):
        soma += xs[i] - xs[i - k]                                    # O(1) por passo
        melhor = max(melhor, soma)
    return melhor                                                    # O(n)

dados = list(range(1, 50_001))
assert max_janela_ingenua(dados[:2000], 50) == max_janela(dados[:2000], 50)</code></pre>
        <p><strong>2) Pré-computar com um índice (hash map) em vez de buscar repetidamente.</strong> Achar pares que somam um alvo: O(n²) versus O(n) com um set de complementos.</p>
        <pre><code class="language-python">def tem_par(xs: list[int], alvo: int) -&gt; bool:
    vistos: set[int] = set()
    for x in xs:
        if alvo - x in vistos:        # O(1) médio
            return True
        vistos.add(x)
    return False</code></pre>
        <p><strong>3) Memoização / programação dinâmica</strong> para sobreposição de subproblemas: Fibonacci recursivo ingênuo é exponencial; com <code>functools.cache</code> vira linear.</p>
        <pre><code class="language-python">from functools import cache

@cache
def fib(n: int) -&gt; int:
    return n if n &lt; 2 else fib(n - 1) + fib(n - 2)

print(fib(80))     # instantâneo; sem cache, inviável
# Atenção: a recursão profunda tem limite (sys.getrecursionlimit()); prefira um laço para n grande.</code></pre>
        <div class="callout"><strong>NA ENTREVISTA</strong> Ao propor uma solução, enuncie a complexidade de tempo e espaço, mencione a constante e os dados esperados ("com n pequeno, a lista basta"), e diga como mediria. Isso diferencia quem decorou Big-O de quem otimiza de verdade.</div>
      `
    },
    {
      id: 'strings-e-representacoes',
      title: 'Strings, bytes e representações compactas',
      body: `
        <p>Strings Python são imutáveis: cada <code>+</code> cria um novo objeto. Para montar texto, acumule partes e junte uma vez; para ler grandes volumes, itere em fluxo; para dados binários, use <code>bytes</code>, <code>bytearray</code> e <code>memoryview</code> (fatias sem cópia).</p>
        <pre><code class="language-python">import array
import sys
import timeit

def concat_ingenua(n):
    s = ""
    for i in range(n):
        s += str(i)          # pode ser quadrático fora do CPython e em alguns padrões
    return s

def concat_join(n):
    return "".join(str(i) for i in range(n))     # O(n) garantido

print(min(timeit.repeat(lambda: concat_ingenua(50_000), number=1, repeat=3)))
print(min(timeit.repeat(lambda: concat_join(50_000), number=1, repeat=3)))

# memoryview: fatiar bytes sem copiar
dados = bytearray(b"x" * 1_000_000)
visao = memoryview(dados)[100:200]       # sem cópia do bloco
print(len(visao))

# Representação compacta de números: array guarda valores C, não objetos Python
lista = list(range(1_000_000))
compacto = array.array("q", range(1_000_000))
print(sys.getsizeof(lista), sys.getsizeof(compacto))   # compare (getsizeof é raso para a lista)</code></pre>
        <p><code>sys.getsizeof</code> é raso: para a lista conta só o vetor de ponteiros, não os objetos int apontados. Para contagem profunda use <code>tracemalloc</code> ou <code>pympler.asizeof</code>. Para dados em larga escala, <code>numpy</code>, <code>pyarrow</code> e <code>polars</code> guardam colunas contíguas e tipadas, com impacto grande em memória e velocidade (lições 67 e 70).</p>
        <p>Outras decisões de representação com efeito mensurável: <code>__slots__</code> e <code>dataclass(slots=True)</code> reduzem memória por instância (lição 65); tuplas são mais leves que listas para dados fixos; <code>enum</code> e <code>intern</code> de strings repetidas economizam memória em volumes grandes; <code>str.startswith</code> com tupla evita laços de comparação.</p>
      `
    },
    {
      id: 'armadilhas-de-performance',
      title: 'Armadilhas de performance e o limite do Big-O',
      body: `
        <ul>
          <li><strong>Localidade de cache e overhead de objetos:</strong> em Python cada int, float e str é um objeto com cabeçalho, e uma lista guarda ponteiros. Uma lista de 1 milhão de floats ocupa muito mais memória e é bem mais lenta de percorrer que um <code>array.array('d')</code> ou um <code>ndarray</code>. Para dados numéricos densos, mude de representação (lição 67).</li>
          <li><strong>Atributos e globais em laços quentes:</strong> acessar globais e atributos custa mais que variáveis locais; o interpretador adaptativo (3.11+) reduziu muito essa diferença, mas o ganho de "ligar em local" ainda aparece em laços muito quentes. Meça antes de aplicar.</li>
          <li><strong>Exceções como fluxo de controle:</strong> <code>try/except</code> é barato quando não dispara (zero custo em 3.11+), mas caro quando dispara com frequência.</li>
          <li><strong>Conversões repetidas:</strong> parsear a mesma string, compilar a mesma regex (<code>re.compile</code> fora do laço; o módulo <code>re</code> tem cache interno, mas não dependa dele), serializar o mesmo objeto.</li>
          <li><strong>Estruturas de terceiros:</strong> <code>sortedcontainers</code> (SortedList com inserção em tempo sublinear prático), <code>pandas</code>/<code>polars</code> para dados tabulares; considere antes de implementar à mão.</li>
        </ul>
        <pre><code class="language-python">import re
import timeit

linhas = [f"id={i};valor={i * 3}" for i in range(50_000)]

def com_compile_no_laco():
    return [re.match(r"id=(\\d+);valor=(\\d+)", l) for l in linhas]

PADRAO = re.compile(r"id=(\\d+);valor=(\\d+)")
def com_compile_fora():
    return [PADRAO.match(l) for l in linhas]

for f in (com_compile_no_laco, com_compile_fora):
    print(f.__name__, min(timeit.repeat(f, number=1, repeat=3)))</code></pre>
        <p>O Big-O descreve crescimento, não tempo absoluto. Para n pequeno, a constante manda; para n grande, o termo dominante manda. A prática correta é: escolha a estrutura com a complexidade certa por padrão (set para membership, deque para filas, heap para top-k), e só afine constantes depois que o profiler apontar o ponto.</p>
      `
    }
  ],
  whenToUse: [
    'set ou dict para membership e junções por chave em vez de buscas lineares em listas',
    'deque para filas FIFO e janelas; heapq para top-k e filas de prioridade; bisect para buscas em dados ordenados',
    'Counter, defaultdict, itertools e funções builtin no lugar de laços manuais',
    'Geradores para processar fluxos grandes com memória constante',
    'functools.cache para memoizar funções puras com subproblemas repetidos'
  ],
  whenNot: [
    'Não troque estruturas por Big-O quando n é minúsculo: a clareza vale mais que o ganho',
    'Não use list.pop(0) ou insert(0, x) como fila em dados grandes',
    'Não use cmp_to_key ou ordenações repetidas dentro de laços sem necessidade',
    'Não mantenha lista ordenada com insort em volume alto de inserções: use heap ou sortedcontainers',
    'Não otimize constantes antes de acertar o algoritmo, nem antes de medir'
  ],
  metrics: [
    'Página TimeComplexity do wiki do Python como referência das complexidades dos builtins',
    'timeit.repeat com min() para comparar estruturas; variar n para observar o crescimento',
    'cProfile para achar o laço dominante antes de trocar a estrutura',
    'tracemalloc / sys.getsizeof para comparar o custo de memória de representações',
    'Testes de propriedade (hypothesis) comparando a versão rápida com a ingênua'
  ],
  refs: [
    { type: 'doc', title: 'TimeComplexity', author: 'Python Wiki', url: 'https://wiki.python.org/moin/TimeComplexity', note: 'Complexidade das operações de list, dict, set, deque no CPython.' },
    { type: 'doc', title: 'heapq: Heap queue algorithm', author: 'Python Software Foundation', url: 'https://docs.python.org/3/library/heapq.html', note: 'Inclui notas de implementação e o padrão de fila de prioridade.' },
    { type: 'doc', title: 'bisect: Array bisection algorithm', author: 'Python Software Foundation', url: 'https://docs.python.org/3/library/bisect.html', note: 'Busca binária, insort e a receita de tabelas de faixas.' },
    { type: 'doc', title: 'collections: Container datatypes', author: 'Python Software Foundation', url: 'https://docs.python.org/3/library/collections.html', note: 'deque, Counter, defaultdict, ChainMap.' },
    { type: 'doc', title: 'Sorting Techniques (HOWTO)', author: 'Raymond Hettinger / Python Software Foundation', url: 'https://docs.python.org/3/howto/sorting.html', note: 'Chaves, estabilidade e decorate-sort-undecorate.' },
    { type: 'livro', title: 'High Performance Python, 2nd edition', author: 'Micha Gorelick e Ian Ozsvald', url: 'https://www.oreilly.com/library/view/high-performance-python/9781492055013/', note: 'Capítulos sobre listas, tuplas, dicionários, sets e iteradores.' },
    { type: 'livro', title: 'Fluent Python, 2nd edition', author: 'Luciano Ramalho', url: 'https://www.oreilly.com/library/view/fluent-python-2nd/9781492056348/', note: 'Estruturas builtin, hashing, sets e dicionários em profundidade.' }
  ]
};

window.LESSON_CONTENT['memoria'] = {
  id: 'memoria',
  title: 'Memória e garbage collection',
  etapa: 11, etapaName: 'High performance',
  time: '75 min',
  tags: ['refcount', 'gc', '__slots__', 'tracemalloc'],
  tagline: 'Python gerencia memória por <em>contagem de referências</em>, com um coletor de ciclos por trás. Saber isso explica vazamentos e picos.',
  intro: `
    <p>Memória é o segundo grande eixo de performance, e em Python ela custa mais do que parece: cada objeto carrega cabeçalho, ponteiro de tipo e contador de referências, e containers guardam ponteiros para objetos espalhados no heap. Um inteiro pequeno ocupa tipicamente 28 bytes em um CPython de 64 bits (confira com <code>sys.getsizeof(1)</code>), contra 4 ou 8 bytes em C. Em escala, isso decide se um job cabe na máquina.</p>
    <p>A gestão é feita por dois mecanismos complementares: <strong>contagem de referências</strong>, que libera o objeto no instante em que o contador chega a zero (determinístico), e um <strong>coletor de lixo geracional</strong> para ciclos de referência, que a contagem sozinha nunca liberaria. Os vazamentos reais em Python quase nunca são "bug do coletor": são referências esquecidas (caches sem limite, listas globais, closures, tracebacks retidos).</p>
    <p>A lição cobre o modelo de memória, o ciclo de vida de objetos, o coletor, as ferramentas de diagnóstico (tracemalloc, memray, gc), técnicas de redução (<code>__slots__</code>, geradores, tipos compactos) e os padrões clássicos de vazamento. Detalhes finos do coletor mudam entre versões: confira o What's New da sua versão e consulte <code>gc.get_threshold()</code> em vez de assumir números.</p>
  `,
  sections: [
    {
      id: 'contagem-de-referencias',
      title: 'Contagem de referências e ciclos',
      body: `
        <p>Todo objeto tem um contador. Atribuir, passar como argumento ou guardar em um container incrementa; sair de escopo, <code>del</code> ou sobrescrever decrementa. Chegou a zero, o objeto é destruído imediatamente e a memória volta ao alocador. Por isso <code>with open(...)</code> ou o fim de um escopo fecha recursos de forma previsível no CPython (outras implementações não garantem isso: use <code>with</code> sempre).</p>
        <pre><code class="language-python">import sys
import weakref

class Recurso:
    def __del__(self):
        print("liberado")

r = Recurso()
print(sys.getrefcount(r))      # 2: a variável r + o argumento temporário de getrefcount
alias = r
print(sys.getrefcount(r))      # 3
del alias
del r                          # contador chega a zero: imprime "liberado" imediatamente

# Referência fraca: observa o objeto sem mantê-lo vivo
class Dado: ...
d = Dado()
w = weakref.ref(d)
print(w() is d)                # True
del d
print(w())                     # None: o objeto foi liberado</code></pre>
        <p>O ponto fraco: <strong>ciclos</strong>. Dois objetos que se referenciam nunca chegam a zero. É para isso que existe o coletor de ciclos do módulo <code>gc</code>.</p>
        <pre><code class="language-python">import gc

class No:
    def __init__(self):
        self.outro = None

gc.collect()
a, b = No(), No()
a.outro, b.outro = b, a        # ciclo
del a, b                       # contadores não chegam a zero
print("objetos inalcançáveis coletados:", gc.collect())   # o coletor acha e libera o ciclo</code></pre>
        <p>Desde o Python 3.4 (PEP 442), objetos com <code>__del__</code> em ciclos também são coletados. Em 3.12, os <em>objetos imortais</em> (PEP 683) passaram a ter contador que nunca muda (None, True, False, ints pequenos, strings internadas e outros), o que evita escrita em páginas compartilhadas e é base para o build free-threaded.</p>
        <div class="callout warn"><strong>PEGADINHA</strong> Não confie em <code>__del__</code> para liberar recursos importantes: a ordem e o momento de finalização no encerramento do interpretador não são garantidos. Use context managers ou <code>weakref.finalize</code>.</div>
      `
    },
    {
      id: 'coletor-geracional',
      title: 'O coletor de ciclos: gerações e ajuste',
      body: `
        <p>O coletor do CPython é <strong>geracional</strong>, baseado na hipótese de que a maioria dos objetos morre jovem. Containers recém-criados vão para a geração 0; os que sobrevivem a uma coleta sobem para a 1 e depois para a 2. Coletas das gerações novas são frequentes e baratas; a da geração velha é rara e cara. O disparo depende da diferença entre alocações e desalocações de containers, controlada por limiares.</p>
        <pre><code class="language-python">import gc

print(gc.get_threshold())      # os limiares dependem da versão: leia, não assuma
print(gc.get_count())          # contadores atuais por geração
print(gc.get_stats())          # estatísticas acumuladas por geração

# Depurar vazamentos: guarda objetos inalcançáveis em gc.garbage
gc.set_debug(gc.DEBUG_SAVEALL)
gc.collect()
print(len(gc.garbage))
gc.set_debug(0)</code></pre>
        <ul>
          <li><strong>gc.freeze()</strong> (3.7+): move todos os objetos atuais para uma geração permanente, ignorada pelas coletas. Chame antes de dar fork em servidores pré-carregados (gunicorn com preload): evita que o coletor "toque" as páginas e quebre o copy-on-write.</li>
          <li><strong>gc.disable()</strong>: pode acelerar jobs curtos que alocam muitos containers de longa vida (carregar grandes estruturas), desde que não haja ciclos relevantes. Reabilite ou chame <code>gc.collect()</code> em pontos controlados.</li>
          <li><strong>gc.callbacks</strong>: permite medir duração e frequência das coletas, para saber se o coletor é de fato um gargalo.</li>
          <li>O build free-threaded (lição 58) usa um coletor adaptado, e o design do coletor continua evoluindo entre versões. Leia as notas de versão antes de ajustar limiares.</li>
        </ul>
        <pre><code class="language-python">import gc
import time

inicio = [0.0]
duracoes: list[float] = []

def cb(fase, info):
    if fase == "start":
        inicio[0] = time.perf_counter()
    else:
        duracoes.append(time.perf_counter() - inicio[0])

gc.callbacks.append(cb)
dados = [[i] for i in range(500_000)]       # muita alocação de containers
gc.callbacks.remove(cb)
print(len(duracoes), "coletas;", f"máx {max(duracoes) * 1000:.1f} ms" if duracoes else "")</code></pre>
        <div class="callout tip"><strong>DICA</strong> Pausas longas do coletor (p99 de latência) em serviços com milhões de objetos vivos são o caso em que mexer no GC compensa. Meça com callbacks antes de desabilitar qualquer coisa.</div>
      `
    },
    {
      id: 'tamanho-de-objetos-e-slots',
      title: 'Tamanho de objetos, __slots__ e dataclasses compactas',
      body: `
        <p>Uma instância comum guarda seus atributos num <code>__dict__</code>. O CPython otimiza com dicionários de chaves compartilhadas e, nas versões recentes, armazena valores inline na própria instância, mas o custo ainda é maior que o de uma estrutura fixa. <code>__slots__</code> troca o dict por campos fixos: menos memória por instância e acesso um pouco mais rápido, ao custo de flexibilidade (sem atributos novos, cuidado com herança e com <code>weakref</code>).</p>
        <pre><code class="language-python">import sys
from dataclasses import dataclass

class Ponto:
    def __init__(self, x, y):
        self.x, self.y = x, y

class PontoSlots:
    __slots__ = ("x", "y")
    def __init__(self, x, y):
        self.x, self.y = x, y

@dataclass(slots=True)          # 3.10+: gera __slots__ automaticamente
class PontoDC:
    x: float
    y: float

def tamanho_total(obj):
    # getsizeof é raso: some o __dict__ quando existir
    base = sys.getsizeof(obj)
    return base + (sys.getsizeof(obj.__dict__) if hasattr(obj, "__dict__") else 0)

for cls in (Ponto, PontoSlots, PontoDC):
    print(cls.__name__, tamanho_total(cls(1.0, 2.0)))</code></pre>
        <p>O ganho aparece em milhões de instâncias pequenas (registros, nós de árvore, eventos). Para poucos objetos, não vale a perda de flexibilidade. Alternativas ainda mais compactas: <code>tuple</code>/<code>namedtuple</code> para registros imutáveis; <code>array.array</code>, NumPy ou colunas Arrow para dados numéricos homogêneos (a diferença pode ser de ordem de grandeza, e você mede com <code>tracemalloc</code>).</p>
        <p>Strings repetidas em grande volume (nomes de categoria, chaves) economizam memória se internadas: <code>sys.intern(s)</code> garante uma só cópia e acelera comparações por identidade. Em pandas, o tipo <code>category</code> faz isso em colunas.</p>
        <div class="callout warn"><strong>PEGADINHA</strong> <code>sys.getsizeof</code> não segue referências. Uma lista de 1 milhão de strings parece ocupar 8 MB, mas as strings ocupam muito mais. Para o total real, use <code>tracemalloc</code> (diferença antes e depois) ou o <code>pympler</code>.</div>
      `
    },
    {
      id: 'tracemalloc-memray',
      title: 'Achando quem aloca: tracemalloc e memray',
      body: `
        <p>O <strong>tracemalloc</strong> da biblioteca padrão registra o traceback de cada alocação e permite comparar instantâneos. É o primeiro passo para achar onde a memória cresce.</p>
        <pre><code class="language-python">import tracemalloc

tracemalloc.start(10)                       # guarda 10 frames por alocação
antes = tracemalloc.take_snapshot()

cache: dict[int, str] = {}
for i in range(200_000):
    cache[i] = "valor-" + str(i)            # suspeito: cresce sem limite

depois = tracemalloc.take_snapshot()
for stat in depois.compare_to(antes, "lineno")[:5]:
    print(stat)                              # linhas que mais alocaram desde o snapshot

atual, pico = tracemalloc.get_traced_memory()
print(f"atual {atual / 1e6:.1f} MB, pico {pico / 1e6:.1f} MB")
tracemalloc.stop()</code></pre>
        <p>O tracemalloc só vê alocações feitas pelo alocador do Python; memória alocada por extensões em C (NumPy, bibliotecas nativas) fora desse alocador não aparece como você esperaria (NumPy registra suas alocações de dados no tracemalloc, mas outras bibliotecas não). Para o quadro completo use <strong>memray</strong>, que intercepta alocações nativas também e gera flame graphs de alocação, tabela de maiores alocadores e modo live.</p>
        <pre><code class="language-bash">memray run -o saida.bin app.py
memray flamegraph saida.bin
memray stats saida.bin               # contagem de alocações, tamanho, pico
memray run --live app.py             # visão ao vivo no terminal
# Em testes: pytest --memray --limit-memory=50MB (plugin pytest-memray)</code></pre>
        <p>Diferencie <strong>pico de memória</strong> (determina se o job estoura o limite) de <strong>crescimento contínuo</strong> (vazamento). E lembre que o alocador do Python (pymalloc, para objetos pequenos, em arenas) nem sempre devolve memória ao SO após liberar objetos: o RSS do processo pode ficar alto mesmo com a memória Python livre por fragmentação. Para processos de longa vida, reciclar workers periodicamente é uma defesa prática e legítima.</p>
      `
    },
    {
      id: 'dados-maiores-que-ram',
      title: 'Dados maiores que a RAM: fluxo, chunks e mmap',
      body: `
        <p>A estratégia mais eficaz de memória é não carregar tudo. Três alavancas, da mais simples à mais especializada: <strong>processar em fluxo</strong> (geradores), <strong>processar em blocos</strong> (chunks) e <strong>mapear arquivos em memória</strong> (<code>mmap</code>), deixando o sistema operacional paginar sob demanda.</p>
        <pre><code class="language-python">import mmap
import itertools

# 1) Fluxo: memória O(1) independente do tamanho do arquivo
def conta_linhas(caminho: str) -&gt; int:
    with open(caminho, "rb") as f:
        return sum(1 for _ in f)

# 2) Blocos: lê N registros por vez (itertools.batched, 3.12+)
def soma_em_lotes(numeros, tamanho=100_000):
    total = 0
    for lote in itertools.batched(numeros, tamanho):
        total += sum(lote)
    return total

# 3) mmap: o arquivo vira um buffer endereçável, paginado pelo SO
def busca_bytes(caminho: str, alvo: bytes) -&gt; int:
    with open(caminho, "rb") as f, mmap.mmap(f.fileno(), 0, access=mmap.ACCESS_READ) as mm:
        return mm.find(alvo)            # sem carregar o arquivo inteiro em objetos Python

# 4) Leitura em blocos com pandas (quando precisa de tabelas)
# import pandas as pd
# for pedaco in pd.read_csv("grande.csv", chunksize=500_000, dtype_backend="pyarrow"):
#     processa(pedaco)</code></pre>
        <p>Combine com formatos colunares (Parquet) e leitura seletiva de colunas, que reduzem I/O e memória de uma vez. Para NumPy, <code>np.memmap</code> e <code>np.load(..., mmap_mode="r")</code> dão arrays sobre arquivo sem carregar tudo. Tipos menores (<code>float32</code>, <code>int32</code>, <code>category</code>) cortam memória pela metade ou mais quando a precisão permite, e isso você valida comparando resultados e medindo.</p>
        <p>Cuidado com os dois erros comuns: materializar o fluxo sem querer (<code>list(gerador)</code>, <code>.readlines()</code>) e manter referências ao lote anterior (uma variável que acumula pedaços "só para depois"). Um fluxo só é O(1) em memória se nada o segura.</p>
      `
    },
    {
      id: 'vazamentos-classicos',
      title: 'Vazamentos clássicos e como evitá-los',
      body: `
        <p>Em Python, "vazamento" quase sempre significa <strong>referência que sobrevive mais do que deveria</strong>. Os suspeitos de sempre:</p>
        <ul>
          <li><strong>Caches sem limite:</strong> dict global usado como cache; <code>functools.lru_cache(maxsize=None)</code> sobre argumentos de alta cardinalidade.</li>
          <li><strong>lru_cache em métodos:</strong> a chave inclui <code>self</code>, o que mantém as instâncias vivas enquanto o cache existir.</li>
          <li><strong>Registros e listeners globais</strong> (callbacks, sinais) que nunca são removidos: use <code>weakref.WeakSet</code>, <code>WeakValueDictionary</code> ou desregistre explicitamente.</li>
          <li><strong>Tracebacks retidos:</strong> guardar uma exceção (<code>self.erro = exc</code>) mantém todos os frames e suas variáveis locais vivos. Armazene só a mensagem ou chame <code>exc.__traceback__ = None</code> / <code>traceback.clear_frames</code>.</li>
          <li><strong>Tasks e filas sem fim</strong> em asyncio: tasks nunca concluídas, filas ilimitadas.</li>
          <li><strong>Acumular em listas durante um processamento em fluxo:</strong> quando o gerador bastava.</li>
        </ul>
        <pre><code class="language-python">import functools
import weakref

# 1) Cache com limite: o tamanho máximo é parte do contrato
@functools.lru_cache(maxsize=1024)
def consulta(chave: str) -&gt; str:
    return chave.upper()

# 2) Evitar lru_cache em método: cache por instância ou na função pura
class Servico:
    def __init__(self):
        self._cache: dict[str, str] = {}      # morre junto com a instância

    def busca(self, chave: str) -&gt; str:
        if chave not in self._cache:
            self._cache[chave] = chave.upper()
        return self._cache[chave]

# 3) Observadores sem manter o objeto vivo
class Barramento:
    def __init__(self):
        self._ouvintes = weakref.WeakSet()

    def inscreve(self, obj):
        self._ouvintes.add(obj)

# 4) Processar em fluxo em vez de acumular
def linhas_validas(caminho):
    with open(caminho, encoding="utf-8") as f:
        for linha in f:                       # uma linha por vez, memória O(1)
            if linha.strip():
                yield linha

# 5) Não segure o traceback
def executa(fn):
    try:
        return fn(), None
    except Exception as exc:
        return None, f"{type(exc).__name__}: {exc}"   # guarda texto, não a exceção</code></pre>
        <p>Receita de diagnóstico: observe o RSS ao longo do tempo (psutil ou métricas do contêiner), reproduza o crescimento, compare snapshots do tracemalloc em momentos distintos, use <code>gc.get_objects()</code> com contagem por tipo (ou <code>objgraph.show_growth()</code>) e siga as referências de volta à raiz com <code>gc.get_referrers</code> ou <code>objgraph.show_backrefs</code>.</p>
        <div class="callout"><strong>NA ENTREVISTA</strong> "Seu serviço Python cresce 50 MB por hora. E agora?" Resposta: confirmar que é crescimento e não fragmentação (RSS vs memória Python), tirar snapshots comparativos (tracemalloc ou memray), procurar caches, listeners e tracebacks retidos, e como mitigação reciclar workers (max_requests no gunicorn, max_tasks_per_child no pool).</div>
      `
    }
  ],
  whenToUse: [
    'Reduzir memória de milhões de objetos pequenos com __slots__, dataclass(slots=True) ou tipos compactos',
    'tracemalloc e memray para achar quem aloca e comparar instantâneos ao longo do tempo',
    'gc.freeze antes de fork para preservar copy-on-write em servidores pré-carregados',
    'Geradores e processamento em fluxo para dados maiores que a RAM',
    'Referências fracas para caches e observadores que não devem manter objetos vivos'
  ],
  whenNot: [
    'Não use __slots__ por reflexo: para poucos objetos, a perda de flexibilidade não compensa',
    'Não desabilite o GC sem medir e sem entender se há ciclos relevantes',
    'Não dependa de __del__ ou do momento da coleta para liberar recursos importantes',
    'Não use lru_cache(maxsize=None) com argumentos de alta cardinalidade',
    'Não conclua vazamento só pelo RSS: pode ser fragmentação ou arenas não devolvidas ao SO'
  ],
  metrics: [
    'RSS ao longo do tempo (psutil, métricas do contêiner) e pico de memória do job',
    'tracemalloc.take_snapshot().compare_to e get_traced_memory',
    'memray run/flamegraph/stats, incluindo alocações nativas',
    'gc.get_stats, gc.callbacks (duração e frequência das coletas), gc.get_count',
    'objgraph.show_growth e show_backrefs para achar a raiz de retenção'
  ],
  refs: [
    { type: 'doc', title: 'gc: Garbage Collector interface', author: 'Python Software Foundation', url: 'https://docs.python.org/3/library/gc.html', note: 'API do coletor: thresholds, freeze, callbacks e depuração.' },
    { type: 'doc', title: 'Garbage collector design (Developer Guide)', author: 'Python Software Foundation', url: 'https://github.com/python/cpython/blob/main/InternalDocs/garbage_collector.md', note: 'Como o coletor geracional funciona por dentro, escrito pelos desenvolvedores do CPython.' },
    { type: 'doc', title: 'tracemalloc: Trace memory allocations', author: 'Python Software Foundation', url: 'https://docs.python.org/3/library/tracemalloc.html', note: 'Snapshots, comparação e filtros.' },
    { type: 'doc', title: 'memray documentation', author: 'Bloomberg', url: 'https://bloomberg.github.io/memray/', note: 'Profiler de memória com suporte a código nativo e flame graphs.' },
    { type: 'doc', title: 'PEP 683: Immortal Objects', author: 'Eric Snow e Eddie Elizondo', url: 'https://peps.python.org/pep-0683/', note: 'Objetos imortais e o impacto na contagem de referências.' },
    { type: 'doc', title: 'PEP 442: Safe object finalization', author: 'Antoine Pitrou', url: 'https://peps.python.org/pep-0442/', note: 'Por que objetos com __del__ em ciclos passaram a ser coletáveis.' },
    { type: 'livro', title: 'CPython Internals', author: 'Anthony Shaw', url: 'https://realpython.com/products/cpython-internals-book/', note: 'Capítulo sobre gerenciamento de memória e o coletor.' },
    { type: 'livro', title: 'High Performance Python, 2nd edition', author: 'Micha Gorelick e Ian Ozsvald', url: 'https://www.oreilly.com/library/view/high-performance-python/9781492055013/', note: 'Memória, estruturas compactas e perfilamento de uso de RAM.' }
  ]
};

window.LESSON_CONTENT['cpython-internals'] = {
  id: 'cpython-internals',
  title: 'CPython por dentro',
  etapa: 11, etapaName: 'High performance',
  time: '75 min',
  tags: ['bytecode', 'dis', 'PEP 659', 'JIT'],
  tagline: 'Python é compilado para <em>bytecode</em> e interpretado por uma máquina de pilha que aprende com a execução.',
  intro: `
    <p>Quando você roda um script, o CPython não "interpreta o texto": ele analisa o código-fonte, constrói uma árvore sintática, compila para <strong>bytecode</strong> (instruções de uma máquina virtual baseada em pilha) e executa esse bytecode em um laço de avaliação escrito em C. Entender esse pipeline explica por que certas construções são mais lentas, o que mudou nas versões 3.11 a 3.14 e o que o JIT experimental pretende fazer.</p>
    <p>A grande virada recente foi o <strong>interpretador adaptativo especializado</strong> (PEP 659, Python 3.11): instruções "quentes" observam os tipos que veem e se reescrevem em versões especializadas mais rápidas. As notas da versão 3.11 reportam uma melhora média de 1,25x na suíte de benchmarks do projeto, com variação de 10% a 60% conforme a carga. Em 3.13, a PEP 744 introduziu um compilador JIT experimental. Em 3.14 há novas otimizações no interpretador.</p>
    <p>Não é preciso escrever C para se beneficiar disso. Saber ler <code>dis</code>, entender o modelo de objetos (tudo é <code>PyObject</code>), o custo de chamadas e como o interpretador especializa o ajuda a escrever código que o interpretador consegue acelerar, e a desconfiar de micro-otimizações que não importam mais.</p>
  `,
  sections: [
    {
      id: 'pipeline-de-compilacao',
      title: 'Do código-fonte ao bytecode',
      body: `
        <p>O pipeline: <strong>tokenização, parsing, AST, tabela de símbolos, geração de bytecode, execução</strong>. Desde o 3.9 o parser é um PEG (PEP 617). O bytecode de módulos importados é cacheado em arquivos <code>.pyc</code> na pasta <code>__pycache__</code>, evitando recompilar a cada import. O que é cacheado é a compilação, não a execução: um <code>.pyc</code> não deixa o programa mais rápido depois de iniciado, só o startup.</p>
        <pre><code class="language-python">import ast
import dis

fonte = "def soma_quadrados(xs):\\n    return sum(x * x for x in xs)\\n"

arvore = ast.parse(fonte)
print(ast.dump(arvore, indent=2)[:300])     # a AST do código

codigo = compile(fonte, "&lt;exemplo&gt;", "exec")
print(codigo.co_names, codigo.co_consts)    # nomes e constantes do módulo

ns: dict = {}
exec(codigo, ns)
dis.dis(ns["soma_quadrados"])               # o bytecode da função</code></pre>
        <p>Um objeto de código (<code>types.CodeType</code>) contém o bytecode (<code>co_code</code>), constantes (<code>co_consts</code>), nomes, variáveis locais, tabela de exceções (zero-cost desde o 3.11) e informação de linhas. Funções referenciam um objeto de código; a execução cria um <strong>frame</strong> com a pilha de valores e as variáveis locais. Desde o 3.11, frames vivem em uma pilha de dados contígua e o objeto Python do frame só é criado se algo precisar dele (depuração, <code>sys._getframe</code>, tracebacks).</p>
        <p>O compilador faz otimizações simples: dobra constantes (<code>2 * 3</code> vira <code>6</code>), remove código morto óbvio e interna strings de constantes. Ele <strong>não</strong> faz inlining nem otimizações entre funções, porque Python é dinâmico: qualquer nome pode ser redefinido a qualquer momento.</p>
      `
    },
    {
      id: 'lendo-bytecode',
      title: 'Lendo bytecode com dis',
      body: `
        <p>O módulo <code>dis</code> mostra as instruções. Os nomes exatos variam entre versões (isso é um detalhe de implementação, sem garantia de estabilidade), mas a ideia é estável: carregar valores para a pilha, operar, armazenar.</p>
        <pre><code class="language-python">import dis

def a(x, y):
    return x + y * 2

dis.dis(a)
# Saída típica (3.12), simplificada:
#   LOAD_FAST x
#   LOAD_FAST y
#   LOAD_CONST 2
#   BINARY_OP *
#   BINARY_OP +
#   RETURN_VALUE

# Comparar construções pelo bytecode (e depois medir, nunca só olhar)
def loop_append(n):
    r = []
    for i in range(n):
        r.append(i * 2)
    return r

def compreensao(n):
    return [i * 2 for i in range(n)]

dis.dis(loop_append)
dis.dis(compreensao)</code></pre>
        <p>Por que a compreensão tende a ser mais rápida: o laço fica em um único objeto de código com a operação de append embutida (<code>LIST_APPEND</code>), sem recarregar o método <code>r.append</code> e sem uma chamada de método a cada iteração. Mesmo assim, o ganho muda com a versão do interpretador: meça sempre (lição 63).</p>
        <p>Outras observações que o bytecode revela:</p>
        <ul>
          <li><strong>Variáveis locais</strong> usam <code>LOAD_FAST</code> (acesso por índice em array). Globais e builtins exigem busca em dicionário, que o interpretador adaptativo cacheia com versões especializadas.</li>
          <li><strong>Atributos e métodos</strong> exigem busca no tipo e na instância; também são especializados quando o tipo é estável.</li>
          <li>Cada instrução de bytecode tem um custo de despacho, por isso menos instruções por iteração tende a ser mais rápido, mas instruções diferentes têm custos muito diferentes.</li>
        </ul>
        <div class="callout tip"><strong>DICA</strong> Use <code>dis.dis(fn, adaptive=True)</code> (3.11+) depois de executar a função algumas vezes para ver as instruções já especializadas, como as variantes de <code>LOAD_ATTR</code>, <code>BINARY_OP</code> ou <code>LOAD_GLOBAL</code>. Os nomes variam por versão, então trate como observação, não como API.</div>
      `
    },
    {
      id: 'interpretador-adaptativo',
      title: 'PEP 659: o interpretador adaptativo especializado',
      body: `
        <p>A ideia central da PEP 659 é <strong>quickening</strong> com <strong>inline caches</strong>. Depois de uma instrução ser executada algumas vezes, o interpretador a considera "quente" e tenta <em>especializá-la</em> para os tipos observados: por exemplo, uma soma que sempre vê inteiros vira uma variante que soma inteiros sem despacho genérico pelo protocolo de números. A versão especializada guarda uma verificação barata (um "guard", como o tipo ou a versão do dicionário) e, se a suposição falhar, a instrução volta à forma genérica e pode tentar especializar de novo (<em>deopt</em>).</p>
        <pre><code class="language-python">import dis

def soma_loop(n):
    t = 0
    for i in range(n):
        t += i          # BINARY_OP vai ser especializada para ints
    return t

soma_loop(10_000)       # aquece: executa o suficiente para especializar
dis.dis(soma_loop, adaptive=True)   # mostra variantes especializadas, se houver

class P:
    def __init__(self):
        self.x = 1

def le(p):
    return p.x          # LOAD_ATTR vira uma variante para atributo de instância

p = P()
for _ in range(1000):
    le(p)
dis.dis(le, adaptive=True)</code></pre>
        <p>Consequências práticas, todas verificáveis com benchmark:</p>
        <ul>
          <li><strong>Tipos estáveis ajudam.</strong> Funções que sempre recebem os mesmos tipos se especializam; "polimorfismo" extremo no mesmo ponto do código força deopt e instruções genéricas.</li>
          <li><strong>Classes com a mesma forma</strong> (os mesmos atributos, criados na mesma ordem em <code>__init__</code>) permitem caches de atributo eficientes. Adicionar atributos soltos fora do construtor desfaz parte do ganho.</li>
          <li><strong>Funções Python puras ficaram mais baratas de chamar:</strong> desde o 3.11, chamadas Python-para-Python não consomem a pilha do C, e os frames são mais leves. O conselho antigo de "evite funções pequenas a todo custo" perdeu força, mas o custo de uma chamada continua maior que uma operação inline.</li>
          <li><strong>Micro-otimizações antigas</strong> (ligar métodos a variáveis locais, evitar atributos) rendem menos do que rendiam antes de 3.11, e às vezes nada. Meça.</li>
        </ul>
        <div class="callout"><strong>NA ENTREVISTA</strong> "Por que o Python 3.11 ficou mais rápido?" Resposta: interpretador adaptativo especializado (PEP 659) com inline caches, frames mais baratos e chamadas Python-para-Python sem recursão na pilha do C, exceções com custo zero quando não disparam, e startup mais rápido com módulos centrais congelados. Cite o relato oficial de 1,25x na média como orientação, com a ressalva de que depende da carga.</div>
      `
    },
    {
      id: 'jit-e-tail-calls',
      title: 'JIT experimental (PEP 744) e a trilha de otimização',
      body: `
        <p>O <strong>JIT experimental</strong> descrito na PEP 744 usa a técnica <em>copy-and-patch</em>: modelos de código de máquina para cada micro-operação são gerados em tempo de build (com LLVM) e, em tempo de execução, o JIT copia esses modelos e "remenda" os operandos, sem precisar de um compilador completo embarcado. Ele opera sobre uma representação intermediária de micro-operações (a "tier 2") produzida a partir de trechos quentes do bytecode especializado.</p>
        <ul>
          <li><strong>3.13:</strong> JIT disponível como opção de compilação experimental (<code>--enable-experimental-jit</code>), desligado por padrão, sem promessa de ganho de desempenho.</li>
          <li><strong>3.14:</strong> os binários oficiais para macOS e Windows passaram a incluir o JIT experimental, ainda desabilitado por padrão e habilitável por variável de ambiente (<code>PYTHON_JIT=1</code>). Continua experimental: o ganho depende muito da carga e pode ser nulo ou negativo.</li>
          <li>O build free-threaded e o JIT eram combinações com restrições nas primeiras versões: confira a documentação da sua versão antes de assumir que funcionam juntos.</li>
        </ul>
        <pre><code class="language-bash"># Verificar se o seu Python foi construído com JIT e se está ativo
python -c "import sysconfig; print(sysconfig.get_config_var('CONFIG_ARGS'))"
PYTHON_JIT=1 python meu_benchmark.py     # liga o JIT se o build o suporta
PYTHON_JIT=0 python meu_benchmark.py     # desliga: compare com pyperf, mesma máquina</code></pre>
        <p>Outras frentes de otimização do interpretador que você deve conhecer pelo nome: <strong>laço de avaliação com tail calls</strong> (opção de build da 3.14 para compiladores que a suportam, com ganho dependente do compilador e da plataforma), <strong>objetos imortais</strong> (3.12), <strong>subinterpretadores com GIL próprio</strong> (3.12) e <strong>free-threading</strong> (lição 58). A direção geral é: tornar o interpretador mais rápido sem mudar a semântica do Python, o que preserva todo o ecossistema.</p>
        <div class="callout warn"><strong>PEGADINHA</strong> Não prometa speedup de JIT em produção. Ele é experimental, a carga típica de aplicações (muita chamada de extensão, I/O, estruturas pequenas) pode não se beneficiar, e a única resposta honesta é medir o seu workload com e sem JIT, com pyperf.</div>
      `
    },
    {
      id: 'modelo-de-objetos',
      title: 'O modelo de objetos: tudo é PyObject',
      body: `
        <p>Em C, todo valor Python é um <code>PyObject</code>: um cabeçalho com contador de referências e ponteiro para o tipo (<code>PyTypeObject</code>), seguido dos dados do objeto. Um <code>float</code> tem o cabeçalho mais um <code>double</code>; um <code>int</code> de precisão arbitrária guarda uma sequência de "dígitos" de 30 bits; uma <code>list</code> guarda um vetor de ponteiros para objetos. Tipos definem comportamento por tabelas de função (slots): <code>tp_hash</code>, <code>tp_richcompare</code>, <code>tp_call</code>, <code>nb_add</code> e assim por diante, que é o que o interpretador chama quando você escreve <code>a + b</code>.</p>
        <pre><code class="language-python">import sys

print(sys.getsizeof(0), sys.getsizeof(2 ** 100), sys.getsizeof(1.0))   # int pequeno, int grande, float
print(sys.getsizeof([]), sys.getsizeof([1, 2, 3]))                      # lista vazia e com 3 itens

# O protocolo de dados: a + b chama type(a).__add__(a, b) (ou nb_add em C)
class Dinheiro:
    def __init__(self, c): self.c = c
    def __add__(self, o): return Dinheiro(self.c + o.c)
    def __repr__(self): return f"Dinheiro({self.c})"

print(Dinheiro(100) + Dinheiro(250))

# id() e is: identidade de objeto
a = 256; b = 256
print(a is b)       # True no CPython (ints pequenos são cacheados/imortais), detalhe de implementação</code></pre>
        <p>Pontos importantes:</p>
        <ul>
          <li><strong>Boxing:</strong> cada número é um objeto no heap. Um laço numérico em Python aloca e libera objetos o tempo todo; por isso NumPy, Numba e código nativo (lições 67 a 69) ganham tanto: operam em memória contígua e tipada, sem objetos por elemento.</li>
          <li><strong>Despacho dinâmico:</strong> <code>a + b</code> consulta o tipo em tempo de execução. O interpretador adaptativo corta parte desse custo quando os tipos são estáveis.</li>
          <li><strong>Resolução de atributos:</strong> a ordem (MRO), descritores de dados, <code>__dict__</code> da instância, <code>__getattr__</code> como último recurso. Entender isso explica <code>property</code>, <code>__slots__</code> e métodos ligados.</li>
          <li><strong>A API C do CPython</strong> (<code>Python.h</code>) expõe esses objetos; extensões nativas manipulam <code>PyObject*</code> e precisam respeitar a contagem de referências e, no build free-threaded, regras adicionais.</li>
        </ul>
        <div class="callout tip"><strong>DICA</strong> Para ler o CPython de verdade, comece por <code>Python/ceval.c</code> (laço de avaliação), <code>Include/object.h</code>, <code>Objects/</code> (tipos) e a pasta <code>InternalDocs</code> do repositório, e acompanhe o livro CPython Internals de Anthony Shaw e o Developer Guide.</div>
      `
    },
    {
      id: 'extensoes-e-limites',
      title: 'Consequências práticas e limites',
      body: `
        <p>O que levar para o dia a dia:</p>
        <ol>
          <li><strong>Atualize o Python.</strong> Cada versão recente ganhou desempenho sem mudar seu código. Medir a mesma carga em versões diferentes com pyperf é o experimento mais barato que existe.</li>
          <li><strong>Escreva código idiomático e com tipos estáveis.</strong> É o que o interpretador sabe acelerar.</li>
          <li><strong>Não faça micro-otimizações de memória muscular</strong> sem medir: parte do folclore (variáveis locais por todo lado, evitar chamadas de função) envelheceu.</li>
          <li><strong>Para ganhos de ordem de grandeza</strong>, mude o nível: algoritmo, vetorização, compilação ou extensão nativa. O interpretador melhora por dezenas de por cento; NumPy, Numba e código nativo podem ganhar muito mais em laços numéricos.</li>
        </ol>
        <pre><code class="language-python">import sys

# Inspeção em tempo de execução do que seu interpretador suporta
print(sys.version)
print(sys.implementation.name, sys.implementation.cache_tag)   # ex.: cpython cpython-314
print(hasattr(sys, "_is_gil_enabled") and sys._is_gil_enabled())

# Hook de baixo overhead de monitoramento (3.12+, PEP 669) para ferramentas
print(hasattr(sys, "monitoring"))</code></pre>
        <p>E o limite honesto: o CPython continua sendo um interpretador de linguagem dinâmica. Para laços numéricos densos, a diferença para C pode ser de ordens de grandeza, e nenhuma especialização muda isso por completo. O que o interpretador adaptativo e o JIT fazem é diminuir a distância e ampliar o que dá para fazer em Python puro. As próximas lições mostram como cruzar essa distância quando necessário.</p>
        <div class="callout"><strong>NA ENTREVISTA</strong> Ao ser perguntado "como o Python executa meu código?", percorra o pipeline (parser PEG, AST, bytecode, laço de avaliação), cite o cache de .pyc, o interpretador adaptativo (PEP 659), e conclua com onde estão os limites e quando migrar de nível. Isso mostra visão de sistema, não decoreba.</div>
      `
    }
  ],
  whenToUse: [
    'dis e ast para entender por que uma construção custa o que custa e para verificar hipóteses',
    'dis.dis(adaptive=True) após aquecer funções para observar as especializações',
    'Atualizar a versão do Python como primeira otimização barata, medindo com pyperf',
    'PYTHON_JIT em experimentos controlados, nunca como suposição de ganho',
    'Conhecer o modelo de objetos antes de escrever extensões em C, Cython ou Rust'
  ],
  whenNot: [
    'Não reescreva código legível por causa de diferenças de bytecode sem medir',
    'Não trate nomes de opcodes como API estável: mudam entre versões',
    'Não prometa ganhos do JIT experimental em produção sem benchmark do seu workload',
    'Não copie micro-otimizações antigas (pré 3.11) sem validar na versão que você usa',
    'Não confunda o cache .pyc (acelera startup) com aceleração de execução'
  ],
  metrics: [
    'dis.dis e dis.dis(adaptive=True) para inspecionar bytecode e especializações',
    'pyperf compare_to entre versões do Python (3.11, 3.12, 3.13, 3.14) na mesma máquina',
    'python -X importtime para custo de import; python -X perf (Linux) com perf para frames Python',
    'sys.monitoring (PEP 669) como base de ferramentas de baixo overhead',
    'pyperformance como suíte de referência de benchmarks do projeto CPython'
  ],
  refs: [
    { type: 'doc', title: 'PEP 659: Specializing Adaptive Interpreter', author: 'Mark Shannon', url: 'https://peps.python.org/pep-0659/', note: 'A especificação do interpretador adaptativo da 3.11.' },
    { type: 'doc', title: 'PEP 744: JIT Compilation', author: 'Brandt Bucher e Savannah Ostrowski', url: 'https://peps.python.org/pep-0744/', note: 'O JIT experimental copy-and-patch: design, estado e critérios.' },
    { type: 'doc', title: 'dis: Disassembler for Python bytecode', author: 'Python Software Foundation', url: 'https://docs.python.org/3/library/dis.html', note: 'Referência de instruções e da opção adaptive.' },
    { type: 'doc', title: 'What\'s New in Python 3.11 (Faster CPython)', author: 'Python Software Foundation', url: 'https://docs.python.org/3/whatsnew/3.11.html', note: 'Fonte oficial dos números de speedup e das técnicas usadas.' },
    { type: 'doc', title: 'CPython Developer Guide: Internals', author: 'Python Core Developers', url: 'https://devguide.python.org/internals/', note: 'Parser, compilador, interpretador e coletor explicados pelos desenvolvedores.' },
    { type: 'livro', title: 'CPython Internals: Your Guide to the Python 3 Interpreter', author: 'Anthony Shaw', url: 'https://realpython.com/products/cpython-internals-book/', note: 'Passeio guiado pelo código-fonte do CPython.' },
    { type: 'doc', title: 'PEP 669: Low Impact Monitoring for CPython', author: 'Mark Shannon', url: 'https://peps.python.org/pep-0669/', note: 'A API sys.monitoring da 3.12 para profilers e depuradores.' },
    { type: 'video', title: 'Live de Python', author: 'Eduardo Mendes', url: 'https://github.com/dunossauro/live-de-python', note: 'Lives em português que passam por internals, bytecode e desempenho.' }
  ]
};

window.LESSON_CONTENT['numpy-vetorizacao'] = {
  id: 'numpy-vetorizacao',
  title: 'NumPy e vetorização',
  etapa: 11, etapaName: 'High performance',
  time: '90 min',
  tags: ['NumPy', 'broadcasting', 'strides', 'ufuncs'],
  tagline: 'Vetorizar é empurrar o laço para dentro de C: um array <em>contíguo e tipado</em> no lugar de milhões de objetos Python.',
  intro: `
    <p>NumPy é a base do ecossistema científico e de dados em Python (pandas, SciPy, scikit-learn, PyTorch e muitos outros se apoiam em seus conceitos ou em seu buffer). Seu ganho vem de uma troca de representação: em vez de uma lista de objetos Python espalhados no heap, um <code>ndarray</code> é um bloco contíguo de memória com um tipo fixo (dtype). Operações sobre o array rodam em laços compilados em C (e, em muitos casos, com instruções SIMD), sem criar um objeto Python por elemento.</p>
    <p>Dois artigos fundamentais descrevem essa arquitetura: van der Walt, Colbert e Varoquaux (2011), "The NumPy array: a structure for efficient numerical computation", e Harris et al. (2020), "Array programming with NumPy", na revista Nature. Vale ler ambos: o primeiro explica o modelo de memória (buffer, dtype, strides), o segundo a posição do NumPy no ecossistema e a evolução da API.</p>
    <p>Esta lição ensina a pensar em arrays: o modelo de memória (shape, strides, views), as regras de broadcasting, ufuncs e reduções, indexação (e quando ela copia), os erros que reintroduzem laços Python, e como medir o ganho sem inventar números. A regra de ouro: <strong>cada laço Python sobre os elementos de um array é um cheiro de código</strong>, mas nem todo laço pode ou deve ser vetorizado.</p>
  `,
  sections: [
    {
      id: 'modelo-de-memoria',
      title: 'O modelo: buffer, dtype, shape e strides',
      body: `
        <p>Um ndarray é um <em>buffer</em> de bytes mais metadados: <code>dtype</code> (como interpretar os bytes), <code>shape</code> (dimensões) e <code>strides</code> (quantos bytes saltar para avançar uma posição em cada eixo). Esse trio permite que vários arrays compartilhem o mesmo buffer: uma <strong>view</strong> (visão) é só outro conjunto de metadados sobre os mesmos bytes, sem cópia.</p>
        <pre><code class="language-python">import numpy as np

a = np.arange(12, dtype=np.int64).reshape(3, 4)
print(a.shape, a.strides, a.dtype, a.nbytes)      # (3, 4) (32, 8) int64 96

t = a.T                                           # transposta: só troca strides, zero cópia
print(t.shape, t.strides, t.base is a)            # (4, 3) (8, 32) True

fatia = a[:, ::2]                                 # fatiamento básico: view
fatia[0, 0] = 99
print(a[0, 0])                                    # 99: alterou o original

copia = a[[0, 2]]                                 # indexação por lista (fancy): CÓPIA
copia[0, 0] = -1
print(a[0, 0])                                    # continua 99

print(np.shares_memory(a, fatia), np.shares_memory(a, copia))   # True False
print(a.flags["C_CONTIGUOUS"], t.flags["C_CONTIGUOUS"], t.flags["F_CONTIGUOUS"])</code></pre>
        <ul>
          <li><strong>Views:</strong> fatiamento básico (<code>a[1:5]</code>, <code>a[:, ::2]</code>), <code>reshape</code> quando possível, <code>.T</code>, <code>ravel()</code> quando contíguo. Alterar a view altera o original.</li>
          <li><strong>Cópias:</strong> indexação booleana e por listas/arrays de índices (fancy indexing), <code>flatten()</code>, <code>copy()</code>, <code>astype</code> (por padrão copia).</li>
          <li><strong>Ordem de memória:</strong> por padrão C-order (linha por linha). Percorrer na ordem de memória é muito mais rápido por causa do cache e do prefetch; somar ao longo do eixo contíguo costuma ser mais rápido que ao longo do eixo com stride grande.</li>
          <li><strong>dtype importa:</strong> <code>float32</code> usa metade da memória e da largura de banda de <code>float64</code>; <code>int8</code> e <code>uint8</code> para dados pequenos. Verifique se a precisão aceita.</li>
        </ul>
        <div class="callout warn"><strong>PEGADINHA</strong> Em NumPy 2.x as regras de promoção de tipos mudaram (NEP 50): escalares Python passam a respeitar o dtype do array (<code>np.uint8(200) + 100</code> comporta-se diferente do 1.x). Código numérico migrado deve ser testado, e a cópia no construtor <code>np.array(..., copy=...)</code> também teve a semântica ajustada.</div>
      `
    },
    {
      id: 'ufuncs-e-reducoes',
      title: 'ufuncs, reduções e o laço escondido',
      body: `
        <p>Uma <strong>ufunc</strong> (universal function) aplica uma operação elemento a elemento em um laço C otimizado: <code>np.add</code>, <code>np.multiply</code>, <code>np.exp</code>, <code>np.sqrt</code>, comparações, lógicas. Os operadores (<code>+</code>, <code>*</code>, <code>&lt;</code>) chamam ufuncs. Ufuncs têm métodos úteis: <code>reduce</code>, <code>accumulate</code>, <code>outer</code>, <code>at</code>.</p>
        <pre><code class="language-python">import numpy as np
import timeit

x = np.random.default_rng(0).random(1_000_000)

def laco_python():
    out = []
    for v in x:                         # um objeto float Python por elemento
        out.append(v * 2.0 + 1.0)
    return out

def vetorizado():
    return x * 2.0 + 1.0                # dois laços em C, sem objetos por elemento

def vetorizado_sem_temporario():
    out = np.empty_like(x)
    np.multiply(x, 2.0, out=out)        # escreve direto no buffer de saída
    np.add(out, 1.0, out=out)           # in-place: evita alocar outro array
    return out

for f in (laco_python, vetorizado, vetorizado_sem_temporario):
    print(f.__name__, min(timeit.repeat(f, number=1, repeat=3)))   # meça na sua máquina</code></pre>
        <p>Reduções (<code>sum</code>, <code>mean</code>, <code>max</code>, <code>std</code>, <code>argmax</code>) colapsam eixos: <code>a.sum(axis=0)</code> soma por coluna, <code>a.sum(axis=1)</code> por linha, <code>keepdims=True</code> preserva a dimensão para facilitar broadcasting. Cumulativas (<code>cumsum</code>, <code>np.maximum.accumulate</code>) substituem laços com estado simples.</p>
        <p>Detalhes de desempenho que importam:</p>
        <ul>
          <li><strong>Temporários:</strong> uma expressão como <code>a * b + c * d</code> aloca arrays intermediários. Para arrays grandes, a largura de banda de memória vira o limite; use <code>out=</code>, operações in-place (<code>+=</code>), <code>numexpr</code> ou Numba para fusão de laços.</li>
          <li><strong>Liberação do GIL:</strong> muitas operações do NumPy liberam o GIL em arrays grandes, então threads podem paralelizar blocos de cálculo (lição 58); o ganho depende do tamanho do array e da operação.</li>
          <li><strong>np.vectorize não é vetorização:</strong> é um laço Python disfarçado, conveniente mas sem ganho de velocidade. Para funções escalares customizadas, use ufuncs de verdade, <code>np.where</code>, ou <code>numba.vectorize</code>.</li>
          <li><strong>BLAS/LAPACK:</strong> <code>@</code> (matmul), <code>np.dot</code>, <code>np.linalg</code> delegam a bibliotecas otimizadas (OpenBLAS, MKL), em geral multithread por conta própria.</li>
        </ul>
      `
    },
    {
      id: 'broadcasting',
      title: 'Broadcasting: operar formas diferentes sem copiar',
      body: `
        <p>Broadcasting define como operar arrays de formas diferentes sem materializar cópias. Regra: alinhe as formas pela <strong>direita</strong>; duas dimensões são compatíveis se são iguais ou se uma delas é 1 (essa é "esticada" virtualmente, com stride 0). Dimensões faltando à esquerda contam como 1.</p>
        <pre><code class="language-text">A     (3, 4)
b       (4,)      -&gt; (1, 4) -&gt; broadcast para (3, 4)   OK

A     (3, 1)
B     (1, 4)      -&gt; resultado (3, 4)                    OK (produto externo)

A     (3, 4)
c     (3,)        -&gt; (1, 3) vs (3, 4)                    ERRO (3 != 4)</code></pre>
        <pre><code class="language-python">import numpy as np

rng = np.random.default_rng(1)
X = rng.random((5, 3))

# Normalizar cada coluna (z-score): média e desvio por coluna, sem laço
Z = (X - X.mean(axis=0)) / X.std(axis=0)

# Distâncias euclidianas entre todos os pares de linhas, sem laço duplo
# X[:, None, :] tem shape (5, 1, 3); X[None, :, :] tem shape (1, 5, 3)
diff = X[:, None, :] - X[None, :, :]             # (5, 5, 3): cuidado com memória em n grande
D = np.sqrt((diff ** 2).sum(axis=-1))            # (5, 5)

# Alternativa que não materializa (n, n, d): usa a identidade |a-b|^2 = |a|^2 + |b|^2 - 2ab
sq = (X ** 2).sum(axis=1)
D2 = np.sqrt(np.maximum(sq[:, None] + sq[None, :] - 2 * X @ X.T, 0.0))
print(np.allclose(D, D2))</code></pre>
        <p>O custo escondido do broadcasting: a forma resultante pode ser muito maior que as entradas. O exemplo de distâncias com <code>diff</code> aloca <code>n * n * d</code> valores; com n grande isso estoura a memória. A versão com produto de matrizes usa <code>n * n</code> e aproveita BLAS, mas tem sutilezas numéricas (cancelamento catastrófico, daí o <code>np.maximum(..., 0)</code>). Em produção, <code>scipy.spatial.distance.cdist</code> ou bibliotecas especializadas resolvem em blocos.</p>
        <div class="callout tip"><strong>DICA</strong> Para depurar broadcasting, imprima <code>.shape</code> de cada operando e escreva na margem o shape esperado do resultado. <code>np.newaxis</code> (ou <code>None</code>) insere eixos de tamanho 1; <code>keepdims=True</code> em reduções evita muitos reshapes.</div>
      `
    },
    {
      id: 'indexacao-e-mascaras',
      title: 'Indexação, máscaras e substituição de condicionais',
      body: `
        <p>Condicionais por elemento viram máscaras booleanas e <code>np.where</code>, que são vetorizadas. Isso elimina <code>if</code> dentro de laços Python.</p>
        <pre><code class="language-python">import numpy as np

rng = np.random.default_rng(2)
preco = rng.uniform(1, 100, size=1_000_000)
qtd = rng.integers(0, 10, size=1_000_000)

# Laço com if (lento): for p, q in zip(preco, qtd): ...
# Vetorizado: máscara + where
receita = preco * qtd
desconto = np.where(receita &gt; 500, 0.9, 1.0)       # escolhe por elemento
final = receita * desconto

# Várias faixas: np.select
condicoes = [receita &lt; 100, receita &lt; 500]
valores = [1.0, 0.95]
fator = np.select(condicoes, valores, default=0.9)

# Máscara booleana: filtra (retorna cópia) e agrega por condição
caros = preco[preco &gt; 90]
print(caros.size, receita[qtd == 0].sum())

# Agrupar e somar: bincount costuma vencer np.add.at para índices inteiros
grupo = rng.integers(0, 100, size=1_000_000)
soma_por_grupo = np.bincount(grupo, weights=receita, minlength=100)</code></pre>
        <p>Observações:</p>
        <ul>
          <li><strong>Máscara e fancy indexing copiam</strong>; fatiamento básico não. Atribuir por máscara (<code>a[mask] = 0</code>) escreve no original.</li>
          <li><code>np.add.at</code> é correto para índices repetidos, mas historicamente lento; <code>np.bincount</code> resolve a maioria dos casos de soma por grupo. Meça na sua versão do NumPy, pois as ufuncs <code>at</code> foram otimizadas em versões recentes.</li>
          <li><code>np.sort</code>, <code>np.argsort</code>, <code>np.unique</code>, <code>np.searchsorted</code> e <code>np.partition</code> (top-k em tempo linear) cobrem boa parte dos algoritmos que se faria à mão.</li>
          <li><code>np.einsum</code> expressa contrações tensoriais de forma declarativa; com <code>optimize=True</code> escolhe uma ordem de contração eficiente.</li>
        </ul>
        <div class="callout warn"><strong>PEGADINHA</strong> Aritmética de ponto flutuante vetorizada não é associativa: somar em ordem diferente (ou com SIMD, ou em paralelo) muda os últimos bits. Teste resultados com <code>np.allclose</code> com tolerância, nunca com <code>==</code>.</div>
      `
    },
    {
      id: 'strides-avancado',
      title: 'Strides, janelas deslizantes e o perigo de as_strided',
      body: `
        <p>Como strides descrevem o acesso, dá para construir visões inteligentes sem cópia. O caso mais útil é a <strong>janela deslizante</strong>: a função <code>numpy.lib.stride_tricks.sliding_window_view</code> (1.20+) devolve uma view somente leitura em que cada linha é uma janela.</p>
        <pre><code class="language-python">import numpy as np
from numpy.lib.stride_tricks import sliding_window_view

serie = np.arange(10, dtype=np.float64)
janelas = sliding_window_view(serie, window_shape=3)       # shape (8, 3), sem cópia
print(janelas.shape, janelas.base is not None)
media_movel = janelas.mean(axis=1)
print(media_movel[:3])                                     # [1. 2. 3.]

# Alternativa clássica para média móvel em O(n): soma cumulativa
def media_movel_cumsum(x, k):
    c = np.cumsum(np.insert(x, 0, 0.0))
    return (c[k:] - c[:-k]) / k

print(np.allclose(media_movel, media_movel_cumsum(serie, 3)))</code></pre>
        <p><code>as_strided</code> permite criar qualquer combinação de shape e strides sobre um buffer, e <strong>não verifica limites</strong>: strides errados leem memória fora do array, causando lixo ou falha do processo. A documentação do NumPy o trata como uma ferramenta perigosa. Prefira <code>sliding_window_view</code> e outras funções seguras; se usar <code>as_strided</code>, escreva testes extensivos e mantenha o resultado somente leitura.</p>
        <p>Outra consequência de strides: <code>reshape</code> devolve view quando os strides permitem, senão copia silenciosamente. Se a cópia importa (grandes arrays ou semântica de escrita), verifique com <code>np.shares_memory</code> ou atribua a <code>a.shape = ...</code>, que levanta erro em vez de copiar.</p>
        <div class="callout"><strong>NA ENTREVISTA</strong> "Por que NumPy é rápido?" Resposta forte: memória contígua e tipada (sem objetos por elemento), laços em C compilado com SIMD, ausência de despacho dinâmico por elemento, delegação a BLAS/LAPACK, e views via strides que evitam cópias. Ressalte os limites: temporários, largura de banda de memória e cópias escondidas.</div>
      `
    },
    {
      id: 'quando-nao-vetorizar',
      title: 'Quando não vetorizar e como medir',
      body: `
        <p>Vetorizar nem sempre é possível nem desejável:</p>
        <ul>
          <li><strong>Dependência sequencial entre iterações</strong> (a iteração i usa o resultado de i-1 de forma não redutível a cumsum/accumulate): recorrências, autômatos, algoritmos de grafos. Aqui entram Numba ou Cython (lição 68).</li>
          <li><strong>Memória:</strong> a forma vetorizada pode criar temporários enormes (broadcasting <code>n x n</code>). Processe em blocos.</li>
          <li><strong>Arrays minúsculos:</strong> o overhead de chamada do NumPy (alocação do array, despacho da ufunc) domina; para dezenas de elementos, Python puro pode ganhar. Meça com o tamanho real.</li>
          <li><strong>Legibilidade:</strong> uma expressão com cinco níveis de broadcasting que ninguém decifra tem custo de manutenção maior que o laço.</li>
        </ul>
        <pre><code class="language-python">import numpy as np
import timeit

def compara(tamanhos=(10, 1_000, 100_000)):
    rng = np.random.default_rng(3)
    for n in tamanhos:
        a = rng.random(n)
        lista = a.tolist()
        t_py = min(timeit.repeat(lambda: sum(v * v for v in lista), number=20, repeat=5))
        t_np = min(timeit.repeat(lambda: float(np.dot(a, a)), number=20, repeat=5))
        print(f"n={n:&gt;8}  python={t_py:.6f}s  numpy={t_np:.6f}s")

compara()
# Observe: o ponto de virada depende da máquina e da versão. Não decore números, meça.</code></pre>
        <p>Procedimento de otimização com NumPy: (1) escreva a versão correta e clara; (2) perfile (Scalene mostra o tempo "Python" versus "nativo" por linha, lição 63); (3) elimine laços Python sobre elementos; (4) reduza temporários (<code>out=</code>, in-place, blocos); (5) ajuste dtypes; (6) se a lógica é sequencial ou há fusão de laços a fazer, Numba. Valide sempre contra a versão ingênua com <code>np.allclose</code> (e testes de propriedade com hypothesis).</p>
        <p>O ecossistema em volta: <strong>pandas</strong> e <strong>Polars</strong> (tabelas colunares), <strong>SciPy</strong> (álgebra, otimização, esparsas), <strong>numexpr</strong> (expressões fundidas em blocos), <strong>JAX</strong> e <strong>PyTorch</strong> (arrays em GPU/TPU com diferenciação automática), <strong>CuPy</strong> (API NumPy na GPU). NumPy publica wheels do build free-threaded a partir da série 2.1, em fase de maturação: confira as notas de versão ao combinar NumPy com threads sem GIL.</p>
      `
    }
  ],
  whenToUse: [
    'Operações numéricas elemento a elemento ou em blocos sobre grandes volumes de dados homogêneos',
    'Normalizações, distâncias, convoluções, médias móveis e agregações que se expressam por broadcasting e reduções',
    'Qualquer laço Python sobre elementos de arrays: primeiro tente vetorizar',
    'Quando a memória e a velocidade dependem de uma representação contígua e tipada (dtype menor, views)',
    'Como base para o resto do ecossistema (pandas, SciPy, scikit-learn, PyTorch)'
  ],
  whenNot: [
    'Lógica com dependência sequencial entre iterações que não se reduz a cumsum ou accumulate: use Numba ou Cython',
    'Arrays muito pequenos, em que o overhead da chamada domina',
    'Expressões que materializam temporários gigantes (broadcasting n x n): processe em blocos',
    'np.vectorize esperando ganho de velocidade (é só um laço Python)',
    'Dados heterogêneos ou de tamanho variável por elemento (use estruturas Python, Arrow ou Polars)'
  ],
  metrics: [
    'timeit/pyperf variando o tamanho do array para achar o ponto de virada',
    'Scalene: tempo Python vs nativo por linha, e memória/cópias; memray para picos de alocação',
    'a.flags, a.strides, np.shares_memory para saber se é view ou cópia',
    'np.allclose contra a implementação de referência para validar a correção numérica',
    'Utilização de CPU (BLAS multithread) e largura de banda de memória em operações grandes'
  ],
  refs: [
    { type: 'paper', title: 'The NumPy array: a structure for efficient numerical computation', author: 'S. van der Walt, S. C. Colbert, G. Varoquaux (2011)', url: 'https://doi.org/10.1109/MCSE.2011.37', note: 'O artigo fundacional sobre o modelo de memória, views e vetorização do NumPy.' },
    { type: 'paper', title: 'Array programming with NumPy', author: 'C. R. Harris et al., Nature 585 (2020)', url: 'https://doi.org/10.1038/s41586-020-2649-2', note: 'Visão atual da arquitetura, da API e do papel do NumPy no ecossistema científico.' },
    { type: 'doc', title: 'NumPy documentation: Broadcasting', author: 'NumPy Developers', url: 'https://numpy.org/doc/stable/user/basics.broadcasting.html', note: 'As regras oficiais com exemplos.' },
    { type: 'doc', title: 'NumPy documentation: The N-dimensional array (ndarray)', author: 'NumPy Developers', url: 'https://numpy.org/doc/stable/reference/arrays.ndarray.html', note: 'Memory layout, strides, views versus cópias.' },
    { type: 'doc', title: 'NumPy 2.0 migration guide (NEP 50)', author: 'NumPy Developers', url: 'https://numpy.org/doc/stable/numpy_2_0_migration_guide.html', note: 'O que mudou em promoção de tipos e na API na série 2.x.' },
    { type: 'livro', title: 'High Performance Python, 2nd edition', author: 'Micha Gorelick e Ian Ozsvald', url: 'https://www.oreilly.com/library/view/high-performance-python/9781492055013/', note: 'Capítulo de NumPy com análise de cache, temporários e uso de memória.' },
    { type: 'livro', title: 'Python Data Science Handbook', author: 'Jake VanderPlas', url: 'https://jakevdp.github.io/PythonDataScienceHandbook/', note: 'Capítulo sobre computação com arrays, broadcasting e ufuncs; disponível online.' },
    { type: 'doc', title: 'NumPy: the absolute basics for beginners / user guide', author: 'NumPy Developers', url: 'https://numpy.org/doc/stable/user/index.html', note: 'Trilha oficial do básico ao avançado.' }
  ]
};

window.LESSON_CONTENT['numba-cython'] = {
  id: 'numba-cython',
  title: 'Numba e Cython',
  etapa: 11, etapaName: 'High performance',
  time: '75 min',
  tags: ['Numba', 'Cython', 'JIT', 'nogil'],
  tagline: 'Quando o laço não vetoriza, compile-o: <em>Numba</em> em tempo de execução, <em>Cython</em> antes.',
  intro: `
    <p>Há problemas numéricos que o NumPy não resolve bem: recorrências, simulações passo a passo, algoritmos com ramificações pesadas por elemento, laços que dependem do resultado anterior. Escrever em C seria rápido, mas quebra a produtividade. Numba e Cython oferecem um meio-termo: você continua escrevendo (quase) Python e obtém código de máquina com tipos estáticos.</p>
    <p><strong>Numba</strong> (Lam, Pitrou e Seibert, 2015, "Numba: a LLVM-based Python JIT compiler") compila funções Python decoradas, em tempo de execução, para código de máquina via LLVM, inferindo tipos a partir dos argumentos da primeira chamada. <strong>Cython</strong> (Behnel et al., 2011) é uma linguagem superconjunto de Python que é traduzida para C e compilada ahead-of-time para um módulo de extensão, com declarações de tipo opcionais que removem o overhead do interpretador.</p>
    <p>Esta lição mostra como cada um funciona, o subconjunto de Python que cada um aceita, como paralelizar liberando o GIL (<code>nogil</code>), os custos (tempo de compilação, empacotamento, depuração) e os critérios para escolher entre eles, NumPy puro, Rust/C (lição 69) ou apenas melhorar o algoritmo.</p>
  `,
  sections: [
    {
      id: 'numba-basico',
      title: 'Numba: @njit em laços numéricos',
      body: `
        <p>O decorador <code>@njit</code> (atalho para <code>@jit(nopython=True)</code>) compila a função para código nativo sem usar o interpretador. A primeira chamada paga a compilação (para aquela combinação de tipos); as seguintes rodam o código compilado. Use <code>cache=True</code> para persistir o código compilado em disco entre execuções.</p>
        <pre><code class="language-python">import time
import numpy as np
from numba import njit

def media_movel_py(x, k):
    n = x.shape[0]
    out = np.empty(n - k + 1)
    for i in range(n - k + 1):
        s = 0.0
        for j in range(k):
            s += x[i + j]
        out[i] = s / k
    return out

media_movel_nb = njit(cache=True)(media_movel_py)       # mesma função, compilada

x = np.random.default_rng(0).random(200_000)

t0 = time.perf_counter(); media_movel_nb(x, 50); t_compila = time.perf_counter() - t0   # inclui compilação
t0 = time.perf_counter(); r_nb = media_movel_nb(x, 50); t_nb = time.perf_counter() - t0  # já compilada
t0 = time.perf_counter(); r_py = media_movel_py(x, 50); t_py = time.perf_counter() - t0

print("primeira chamada (com compilação):", t_compila)
print("compilada:", t_nb, " python puro:", t_py)
print(np.allclose(r_nb, r_py))</code></pre>
        <ul>
          <li><strong>Benchmark correto:</strong> sempre separe (ou descarte) a primeira chamada; ela inclui compilação. Compare apenas execuções já compiladas.</li>
          <li><strong>Subconjunto suportado:</strong> tipos numéricos, arrays NumPy, tuplas, listas e dicionários tipados (<code>numba.typed</code>), muitas funções do <code>math</code> e do NumPy, e jitclasses (experimental). Strings e objetos Python arbitrários têm suporte limitado; DataFrames do pandas não são suportados dentro de funções nopython.</li>
          <li><strong>Tipagem estável:</strong> a função é especializada por tipos de entrada; variáveis que mudam de tipo ao longo do código causam erro de tipagem ou de unificação. Escreva o laço numérico como se fosse C: tipos fixos, arrays pré-alocados.</li>
          <li>Em versões antigas do Numba, <code>@jit</code> sem argumentos caía silenciosamente em modo objeto (lento). Use sempre <code>@njit</code> para falhar alto em vez de ficar lento sem aviso.</li>
        </ul>
        <div class="callout warn"><strong>PEGADINHA</strong> Um benchmark que inclui a compilação na medição conclui que Numba é lento. Outra armadilha comum: medir uma função que ficou "rápida demais" porque o resultado não é usado. Retorne e verifique o resultado.</div>
      `
    },
    {
      id: 'numba-paralelo',
      title: 'Numba: paralelismo, nogil e ufuncs',
      body: `
        <p>Três formas de paralelizar com Numba:</p>
        <ol>
          <li><strong>parallel=True com prange:</strong> paraleliza laços independentes em múltiplas threads (backend de threading do Numba).</li>
          <li><strong>nogil=True:</strong> libera o GIL durante a execução da função compilada, para que você use <code>ThreadPoolExecutor</code> com paralelismo real (lição 58) sobre blocos de dados.</li>
          <li><strong>@vectorize / @guvectorize:</strong> cria ufuncs do NumPy a partir de funções escalares, com opção de target paralelo.</li>
        </ol>
        <pre><code class="language-python">import numpy as np
from numba import njit, prange, vectorize
from concurrent.futures import ThreadPoolExecutor

@njit(parallel=True, fastmath=False, cache=True)
def soma_quadrados_par(x):
    total = 0.0
    for i in prange(x.shape[0]):        # prange: iterações independentes; a redução é reconhecida
        total += x[i] * x[i]
    return total

@njit(nogil=True, cache=True)
def soma_bloco(x):                      # sem GIL: pode rodar em várias threads de verdade
    s = 0.0
    for i in range(x.shape[0]):
        s += x[i]
    return s

@vectorize(["float64(float64, float64)"], nopython=True)
def hipotenusa(a, b):
    return np.sqrt(a * a + b * b)

x = np.random.default_rng(1).random(10_000_000)
print(soma_quadrados_par(x))

blocos = np.array_split(x, 8)
with ThreadPoolExecutor(8) as ex:
    print(sum(ex.map(soma_bloco, blocos)))
print(hipotenusa(x[:5], x[5:10]))</code></pre>
        <ul>
          <li><code>fastmath=True</code> permite reordenar operações de ponto flutuante (e ignorar NaN/infinito), habilitando SIMD mais agressivo, mas muda resultados e pode quebrar tratamento de NaN. Ligue só com testes numéricos.</li>
          <li><strong>Condições de corrida em prange:</strong> escrever em posições compartilhadas sem estar numa redução reconhecida é erro seu. O Numba detecta reduções simples (<code>+=</code>, <code>*=</code>) mas não protege contra todos os casos.</li>
          <li>O resultado de uma redução paralela pode diferir nos últimos bits do sequencial (a ordem de soma muda).</li>
          <li>Diagnóstico: <code>numba --sysinfo</code>, <code>func.inspect_types()</code>, e <code>parallel_diagnostics()</code> para ver o que foi paralelizado.</li>
        </ul>
      `
    },
    {
      id: 'cython-basico',
      title: 'Cython: tipos estáticos e memoryviews',
      body: `
        <p>Cython traduz seu código para C e o compila como um módulo de extensão. Mesmo sem declarar tipos, já remove parte do overhead do interpretador; com declarações (<code>cdef</code>), os laços numéricos viram laços C reais. Para arrays, os <strong>typed memoryviews</strong> dão acesso por índice sem passar pelo protocolo de objetos Python.</p>
        <p>Arquivo <code>soma.pyx</code> (sintaxe clássica do Cython):</p>
        <pre><code class="language-text"># cython: language_level=3
# cython: boundscheck=False, wraparound=False

def soma_quadrados(double[:] x):
    cdef Py_ssize_t i, n = x.shape[0]
    cdef double total = 0.0
    for i in range(n):
        total += x[i] * x[i]
    return total</code></pre>
        <p>Modo <strong>Python puro</strong> (Cython 3): o mesmo código fica em um arquivo <code>.py</code> com anotações de tipo, e continua executável como Python se não for compilado, o que facilita testes e depuração.</p>
        <pre><code class="language-python">import cython

@cython.boundscheck(False)
@cython.wraparound(False)
def soma_quadrados(x: cython.double[:]) -&gt; cython.double:
    total: cython.double = 0.0
    i: cython.Py_ssize_t
    for i in range(x.shape[0]):
        total += x[i] * x[i]
    return total</code></pre>
        <p>Build moderno, com <code>pyproject.toml</code> e um <code>setup.py</code> mínimo (ou o backend de build de sua preferência):</p>
        <pre><code class="language-toml"># pyproject.toml
[build-system]
requires = ["setuptools&gt;=68", "cython&gt;=3.0", "numpy"]
build-backend = "setuptools.build_meta"</code></pre>
        <pre><code class="language-python"># setup.py
from setuptools import setup
from Cython.Build import cythonize

setup(ext_modules=cythonize("soma.pyx", annotate=True, language_level=3))
# python -m pip install -e .   ou   python setup.py build_ext --inplace</code></pre>
        <ul>
          <li><strong>cython -a</strong> (ou <code>annotate=True</code>) gera um HTML em que as linhas "amarelas" mostram interação com o interpretador Python. O objetivo é deixar os laços quentes brancos (C puro). É a ferramenta de diagnóstico mais valiosa do Cython.</li>
          <li><code>boundscheck(False)</code> e <code>wraparound(False)</code> removem verificações de índice e índices negativos: ganho real, mas um bug de índice passa a ser comportamento indefinido (leitura de memória fora do array). Habilite depois de testar com as verificações ligadas.</li>
          <li><code>with nogil:</code> libera o GIL em blocos que só usam tipos C e memoryviews, permitindo paralelismo com threads (inclusive <code>prange</code> do <code>cython.parallel</code> com OpenMP).</li>
          <li>Empacotamento: gera wheels por plataforma e versão do Python (ou ABI estável quando possível); exige compilador C no build, ao contrário do Numba, que exige LLVM embutido via llvmlite no runtime.</li>
        </ul>
      `
    },
    {
      id: 'numba-tipos-e-depuracao',
      title: 'Numba: tipos, erros de tipagem e depuração',
      body: `
        <p>O Numba infere tipos por função e por assinatura de chamada. Quando falha, a mensagem de erro costuma ser longa; o que importa é achar a primeira linha "No implementation of function" ou "Cannot unify". Padrões que evitam dor de cabeça: variáveis com tipo único (não alterne int e float na mesma variável), arrays pré-alocados com dtype explícito, e listas e dicionários tipados em vez de coleções heterogêneas.</p>
        <pre><code class="language-python">import numpy as np
from numba import njit, types
from numba.typed import List

@njit
def ruim(n):
    x = 0              # int
    for i in range(n):
        x = x + 0.5    # float: o Numba unifica para float64, mas código misto atrapalha SIMD
    return x

@njit
def boa(n):
    x = 0.0            # tipo fixo desde o início
    for i in range(n):
        x += 0.5
    return x

@njit
def acumula(valores):
    saida = List.empty_list(types.float64)     # lista tipada (reflected list está obsoleta)
    for v in valores:
        if v &gt; 0.5:
            saida.append(v)
    return saida

print(boa(10), len(acumula(np.random.default_rng(0).random(100))))
print(boa.signatures)          # tipos para os quais já foi compilada</code></pre>
        <ul>
          <li><strong>Depurar:</strong> rode a função sem decorador (ela continua sendo Python) para validar a lógica; variável de ambiente <code>NUMBA_DISABLE_JIT=1</code> desliga o JIT inteiro e permite usar pdb.</li>
          <li><strong>Inspecionar:</strong> <code>f.inspect_types()</code> mostra os tipos inferidos linha a linha; <code>f.inspect_asm()</code> mostra o assembly, útil para ver se houve vetorização SIMD.</li>
          <li><strong>Assinaturas explícitas:</strong> <code>@njit("float64(float64[:])")</code> compila de forma antecipada (eager) e fixa os tipos, evitando recompilar para variações de tipo e travando erros cedo.</li>
          <li><strong>Exceções:</strong> o suporte é parcial; levantar exceções simples com mensagens constantes funciona, mensagens formatadas dinamicamente têm limitações.</li>
        </ul>
        <div class="callout tip"><strong>DICA</strong> Mantenha o núcleo numérico em funções pequenas e puras, decoradas, e a orquestração (I/O, pandas, logging) em Python comum. Isso reduz o que o Numba precisa entender e facilita testar cada lado.</div>
      `
    },
    {
      id: 'escolha-da-ferramenta',
      title: 'Numba, Cython, NumPy, Rust: como escolher',
      body: `
        <table>
          <thead><tr><th>Critério</th><th>NumPy puro</th><th>Numba</th><th>Cython</th><th>Rust/C (lição 69)</th></tr></thead>
          <tbody>
            <tr><td>Esforço</td><td>Baixo</td><td>Baixo (decorador)</td><td>Médio (tipos, build)</td><td>Alto</td></tr>
            <tr><td>Laços sequenciais</td><td>Não resolve</td><td>Ótimo</td><td>Ótimo</td><td>Ótimo</td></tr>
            <tr><td>Distribuição</td><td>Trivial</td><td>Dependência (llvmlite), JIT em runtime</td><td>Wheels por plataforma, compilador no build</td><td>Wheels por plataforma (maturin)</td></tr>
            <tr><td>Startup</td><td>Rápido</td><td>Compilação na 1ª chamada (cache=True ajuda)</td><td>Sem custo em runtime</td><td>Sem custo em runtime</td></tr>
            <tr><td>Chamar Python arbitrário</td><td>Sim</td><td>Limitado (nopython)</td><td>Sim (com custo)</td><td>Via PyO3 (com custo)</td></tr>
            <tr><td>Depuração</td><td>Fácil</td><td>Mensagens de tipagem difíceis</td><td>Média (C gerado)</td><td>Boas ferramentas nativas</td></tr>
          </tbody>
        </table>
        <p>Árvore de decisão prática:</p>
        <ol>
          <li>O algoritmo é adequado? Complexidade primeiro (lição 64).</li>
          <li>Dá para vetorizar com NumPy (broadcasting, ufuncs, reduções)? Faça isso.</li>
          <li>Há dependência sequencial ou fusão de laços? <strong>Numba</strong> é o primeiro candidato: o menor esforço para código numérico sobre arrays.</li>
          <li>Precisa de uma biblioteca distribuída, estruturas próprias, chamadas a bibliotecas C existentes, ou controle fino de build? <strong>Cython</strong> (ou Rust/C se a equipe domina).</li>
          <li>É um componente central e estável, com requisitos de segurança e desempenho, usado por vários serviços? Considere <strong>Rust com PyO3</strong>.</li>
        </ol>
        <p>Também existem <strong>mypyc</strong> (compila módulos com anotações de tipo para extensões C; o projeto Black o usa), <strong>PyPy</strong> (outra implementação com JIT, com compatibilidade parcial de extensões C), <strong>JAX</strong> (compilação via XLA para CPU/GPU/TPU com funções puras) e <strong>Pythran</strong> (compila subconjunto numérico para C++). Cada um tem nicho; o critério é o mesmo: medir com o seu workload.</p>
      `
    },
    {
      id: 'armadilhas-e-medicao',
      title: 'Armadilhas de medição e de manutenção',
      body: `
        <ul>
          <li><strong>Compilação na medição:</strong> descarte a primeira chamada do Numba e a importação do Cython ao medir.</li>
          <li><strong>Fronteira Python/nativo:</strong> chamar uma função compilada milhões de vezes com argumentos pequenos paga o custo da chamada a cada vez. Mova o laço externo para dentro da função compilada.</li>
          <li><strong>Cópias de dados:</strong> converter listas Python em arrays dentro do laço quente anula o ganho. Trabalhe com arrays NumPy contíguos e tipados de ponta a ponta.</li>
          <li><strong>Correção numérica:</strong> compare sempre com a versão Python de referência (<code>np.allclose</code>); desabilitar verificações (boundscheck, fastmath) sem testes é receita de bugs sutis.</li>
          <li><strong>Reprodutibilidade de ambiente:</strong> versão do Numba presa à do NumPy e do Python; o Cython exige compilador. Documente e fixe versões no CI.</li>
          <li><strong>Suporte a versões novas:</strong> o suporte do Numba e de extensões Cython a versões recém-lançadas do Python e ao build free-threaded costuma chegar depois do lançamento. Cheque a matriz de compatibilidade antes de migrar.</li>
        </ul>
        <pre><code class="language-python">import time
import numpy as np
from numba import njit

@njit(cache=True)
def passo(estado, n):
    # laço externo DENTRO da função compilada: uma única travessia da fronteira
    for _ in range(n):
        estado = (estado * 1103515245 + 12345) % 2147483648
    return estado

def mede(fn, *args, repeticoes=5):
    fn(*args)                                   # aquecimento: força a compilação
    melhor = float("inf")
    for _ in range(repeticoes):
        t0 = time.perf_counter()
        fn(*args)
        melhor = min(melhor, time.perf_counter() - t0)
    return melhor

print("tempo (compilada, sem compilação):", mede(passo, 1, 10_000_000))</code></pre>
        <div class="callout"><strong>NA ENTREVISTA</strong> "Seu laço Python está lento; o que faz?" Sequência sênior: perfilar, checar algoritmo e vetorização, e só então compilar (Numba primeiro pela baixa fricção). Mencionar custos: compilação inicial, empacotamento, debug e a necessidade de testes numéricos contra a versão de referência.</div>
      `
    }
  ],
  whenToUse: [
    'Numba para laços numéricos sobre arrays NumPy com dependência sequencial ou muita lógica por elemento',
    'Numba com nogil + threads, ou prange, para paralelizar código numérico sem pagar pickle',
    'Cython quando você distribui uma biblioteca, integra C existente ou precisa de controle fino do build',
    'Cython em modo Python puro quando quer manter o código executável como Python em testes',
    '@vectorize para criar ufuncs a partir de funções escalares com desempenho de C'
  ],
  whenNot: [
    'Antes de revisar o algoritmo e de tentar vetorizar com NumPy',
    'Código dominado por I/O, rede ou chamadas a bibliotecas Python arbitrárias (Numba não ajuda)',
    'Quando o custo de compilação e de empacotamento supera o ganho (scripts curtos, execuções únicas)',
    'Em código que depende de pandas, strings e objetos complexos dentro do laço quente (nopython não suporta bem)',
    'Desabilitar boundscheck ou fastmath sem uma suíte de testes numéricos'
  ],
  metrics: [
    'Tempo de execução já compilada (descartando a primeira chamada) versus a referência em Python/NumPy, com pyperf',
    'cython -a: linhas amarelas (interação com Python) nos laços quentes',
    'Numba: parallel_diagnostics(), inspect_types(), NUMBA_NUM_THREADS e utilização de cada núcleo',
    'np.allclose contra a implementação de referência; testes de propriedade com hypothesis',
    'Tempo de compilação, tamanho do artefato e tempo de cold start em produção'
  ],
  refs: [
    { type: 'paper', title: 'Numba: A LLVM-based Python JIT Compiler', author: 'S. K. Lam, A. Pitrou, S. Seibert (LLVM-HPC 2015)', url: 'https://doi.org/10.1145/2833157.2833162', note: 'O artigo que descreve o design do Numba e sua inferência de tipos sobre LLVM.' },
    { type: 'paper', title: 'Cython: The Best of Both Worlds', author: 'S. Behnel, R. Bradshaw, C. Citro, L. Dalcin, D. S. Seljebotn, K. Smith (2011)', url: 'https://doi.org/10.1109/MCSE.2010.118', note: 'Artigo de referência sobre a linguagem Cython, publicado em Computing in Science and Engineering.' },
    { type: 'doc', title: 'Numba documentation', author: 'Anaconda e comunidade Numba', url: 'https://numba.readthedocs.io/', note: 'Guia do usuário: jit, parallel, vectorize, cuda e referência de recursos suportados.' },
    { type: 'doc', title: 'Cython documentation', author: 'Cython developers', url: 'https://cython.readthedocs.io/', note: 'Tutorial, memoryviews, paralelismo e modo Python puro.' },
    { type: 'livro', title: 'High Performance Python, 2nd edition', author: 'Micha Gorelick e Ian Ozsvald', url: 'https://www.oreilly.com/library/view/high-performance-python/9781492055013/', note: 'Capítulos de compilação com Cython e Numba, com estudos de caso medidos.' },
    { type: 'livro', title: 'Cython: A Guide for Python Programmers', author: 'Kurt W. Smith (O\'Reilly)', url: 'https://www.oreilly.com/library/view/cython/9781491901749/', note: 'Livro de referência sobre Cython, útil mesmo com o Cython 3 por cobrir os conceitos centrais.' },
    { type: 'doc', title: 'mypyc: compiling type-annotated Python to C extensions', author: 'mypy project', url: 'https://mypyc.readthedocs.io/', note: 'Alternativa de compilação ahead-of-time baseada em anotações de tipo.' }
  ]
};

window.LESSON_CONTENT['rust-pyo3'] = {
  id: 'rust-pyo3',
  title: 'Extensões nativas com Rust',
  etapa: 11, etapaName: 'High performance',
  time: '75 min',
  tags: ['Rust', 'PyO3', 'maturin', 'FFI'],
  tagline: 'Quando o gargalo é um núcleo estável e crítico, escreva-o em <em>Rust</em> e exponha como módulo Python.',
  intro: `
    <p>Parte do ecossistema que você usa todo dia já é código nativo escondido atrás de uma API Python: pydantic-core, orjson, cryptography, Polars, ruff, uv, tokenizers. Muitas dessas bibliotecas modernas escolheram Rust, pela combinação de desempenho próximo ao de C, segurança de memória verificada em tempo de compilação e um bom ferramental de build e distribuição. A ponte padrão é o <strong>PyO3</strong>, com o <strong>maturin</strong> para construir e publicar wheels.</p>
    <p>Esta lição cobre o espectro de opções de FFI (ctypes, cffi, C API, Cython, PyO3), constrói um módulo PyO3 do zero, discute o custo da fronteira Python/Rust, a liberação do GIL, o zero-copy com NumPy, o empacotamento (wheels, abi3, CI) e quando <em>não</em> vale a pena: a maior parte do código lento em Python se resolve sem sair do Python.</p>
    <p>Pré-requisito de bom senso: perfile primeiro (lição 63), melhore o algoritmo (64) e tente vetorizar ou compilar com Numba (67 e 68). Escrever extensão nativa é a opção de maior custo de manutenção, justificada para componentes centrais, estáveis e reutilizados.</p>
  `,
  sections: [
    {
      id: 'espectro-de-ffi',
      title: 'O espectro: ctypes, cffi, C API, Cython e PyO3',
      body: `
        <table>
          <thead><tr><th>Opção</th><th>Ideia</th><th>Quando faz sentido</th></tr></thead>
          <tbody>
            <tr><td><code>ctypes</code></td><td>Carrega uma biblioteca compartilhada existente e chama funções C, na biblioteca padrão</td><td>Chamar uma lib C pronta sem build; protótipos</td></tr>
            <tr><td><code>cffi</code></td><td>Declara a interface C e gera ligação (modo ABI ou API)</td><td>Bindings para libs C, mais robusto que ctypes; usado também no PyPy</td></tr>
            <tr><td>C API do CPython</td><td>Escrever o módulo em C com <code>Python.h</code></td><td>Máximo controle; verboso; contagem de referências manual</td></tr>
            <tr><td>Cython</td><td>Python tipado traduzido para C</td><td>Lição 68</td></tr>
            <tr><td>PyO3 (Rust)</td><td>Macros que geram a ligação a partir de funções Rust</td><td>Núcleo novo e crítico; segurança de memória; ecossistema de crates</td></tr>
            <tr><td>pybind11, nanobind</td><td>Equivalentes em C++</td><td>Bases de código C++ existentes</td></tr>
          </tbody>
        </table>
        <p>Exemplo mínimo com <code>ctypes</code>, sem nenhum build, chamando a libm do sistema:</p>
        <pre><code class="language-python">import ctypes
import ctypes.util

nome = ctypes.util.find_library("m")           # libm no Linux e macOS
libm = ctypes.CDLL(nome)

libm.cos.argtypes = [ctypes.c_double]          # SEMPRE declare tipos: sem isso, o padrão é int
libm.cos.restype = ctypes.c_double

print(libm.cos(0.0))                           # 1.0

# Chamadas via CDLL liberam o GIL durante a função C, então threads paralelizam de verdade
# (PyDLL não libera: use apenas quando a função C chama a API do Python)</code></pre>
        <div class="callout warn"><strong>PEGADINHA</strong> Em ctypes, esquecer <code>argtypes</code> e <code>restype</code> faz o Python tratar tudo como <code>int</code> de C: ponteiros truncados e doubles lidos como lixo, com falha de segmentação intermitente. É o bug clássico de FFI.</div>
      `
    },
    {
      id: 'primeiro-modulo-pyo3',
      title: 'Seu primeiro módulo com PyO3 e maturin',
      body: `
        <p>Fluxo: o <code>maturin</code> cria o projeto, compila o crate Rust como biblioteca dinâmica com o nome do módulo Python e instala no ambiente (ou gera wheels).</p>
        <pre><code class="language-bash">pip install maturin
maturin new rapido --bindings pyo3         # cria o esqueleto (Cargo.toml, pyproject.toml, src/lib.rs)
cd rapido
python -m venv .venv &amp;&amp; source .venv/bin/activate
maturin develop --release                  # compila em modo release e instala no venv
python -c "import rapido; print(rapido.soma_quadrados([1.0, 2.0, 3.0]))"</code></pre>
        <p><code>Cargo.toml</code> (use a versão atual do PyO3; os nomes de API mudam entre versões, então siga o guia da versão que instalou):</p>
        <pre><code class="language-toml">[package]
name = "rapido"
version = "0.1.0"
edition = "2021"

[lib]
name = "rapido"
crate-type = ["cdylib"]

[dependencies]
pyo3 = { version = "0.26", features = ["abi3-py39"] }</code></pre>
        <p><code>src/lib.rs</code>:</p>
        <pre><code class="language-rust">use pyo3::exceptions::PyValueError;
use pyo3::prelude::*;

/// Soma dos quadrados de uma lista de floats.
#[pyfunction]
fn soma_quadrados(xs: Vec&lt;f64&gt;) -&gt; f64 {
    xs.iter().map(|x| x * x).sum()
}

/// Divide com erro Python (ValueError) em vez de pânico.
#[pyfunction]
#[pyo3(signature = (a, b, arredonda=false))]
fn divide(a: f64, b: f64, arredonda: bool) -&gt; PyResult&lt;f64&gt; {
    if b == 0.0 {
        return Err(PyValueError::new_err("divisão por zero"));
    }
    let r = a / b;
    Ok(if arredonda { r.round() } else { r })
}

#[pymodule]
fn rapido(m: &amp;Bound&lt;'_, PyModule&gt;) -&gt; PyResult&lt;()&gt; {
    m.add_function(wrap_pyfunction!(soma_quadrados, m)?)?;
    m.add_function(wrap_pyfunction!(divide, m)?)?;
    Ok(())
}</code></pre>
        <ul>
          <li><strong>Conversões automáticas:</strong> <code>Vec&lt;f64&gt;</code> a partir de uma lista Python <em>copia</em> os dados (um objeto Python por elemento vira um f64). Para volumes grandes, evite: use buffers ou o crate <code>numpy</code> (próxima seção).</li>
          <li><strong>Erros:</strong> retorne <code>PyResult</code>. Um <code>panic!</code> do Rust vira <code>PanicException</code> no Python, não um crash, mas trate como bug.</li>
          <li><strong>Tipos:</strong> <code>#[pyclass]</code> expõe structs como classes, com <code>#[pymethods]</code> para métodos; <code>#[pyo3(signature = ...)]</code> controla argumentos nomeados e padrões.</li>
          <li><strong>abi3:</strong> a feature <code>abi3-py39</code> compila contra a ABI estável do CPython, gerando uma wheel que serve para várias versões (3.9 em diante) em vez de uma por versão. Verifique as limitações (algumas APIs de desempenho não existem na ABI estável).</li>
        </ul>
      `
    },
    {
      id: 'custo-da-fronteira',
      title: 'O custo da fronteira e a liberação do GIL',
      body: `
        <p>Cruzar a fronteira Python/Rust custa: converter argumentos, adquirir referências, tratar erros. Uma função Rust que faz 20 nanossegundos de trabalho chamada um milhão de vezes de um laço Python será dominada pela fronteira, e o ganho some. A regra é a mesma do Numba: <strong>mova o laço para dentro do código nativo</strong> e cruze a fronteira poucas vezes, com dados grandes.</p>
        <p>Para trabalho pesado, solte o GIL enquanto roda código Rust puro, que não toca objetos Python. Assim, outras threads Python (e o próprio paralelismo via <code>ThreadPoolExecutor</code>) continuam. Na API do PyO3, isso é feito com o token <code>Python</code>: nas versões mais antigas o método se chama <code>allow_threads</code>; nas mais recentes, <code>detach</code>. Confira o guia da versão que você usa.</p>
        <pre><code class="language-rust">use pyo3::prelude::*;

fn trabalho_pesado(n: u64) -&gt; u64 {
    // código Rust puro: não usa nenhum objeto Python
    (0..n).fold(0u64, |acc, i| acc.wrapping_add(i.wrapping_mul(i)))
}

#[pyfunction]
fn calcula(py: Python&lt;'_&gt;, n: u64) -&gt; u64 {
    // libera o GIL durante o cálculo (nome do método depende da versão do PyO3)
    py.detach(|| trabalho_pesado(n))
}</code></pre>
        <pre><code class="language-python">import time
from concurrent.futures import ThreadPoolExecutor

import rapido   # o módulo compilado acima, com a função calcula

def medir(threads: int, tarefas: int = 8, n: int = 200_000_000) -&gt; float:
    t0 = time.perf_counter()
    with ThreadPoolExecutor(threads) as ex:
        list(ex.map(rapido.calcula, [n] * tarefas))
    return time.perf_counter() - t0

# Com o GIL liberado dentro de Rust, mais threads reduzem o tempo total (até o número de núcleos)
for t in (1, 2, 4, 8):
    print(t, "threads:", round(medir(t), 3), "s")</code></pre>
        <p>Dentro do bloco liberado você <strong>não pode</strong> tocar em objetos Python: o sistema de tipos do PyO3 impede isso em compilação, o que é uma grande vantagem sobre C. Para voltar a usar objetos Python, reaquira o GIL (nas versões recentes <code>Python::attach</code>, nas antigas <code>Python::with_gil</code>).</p>
        <p>No build free-threaded (lição 58), módulos PyO3 declaram suporte sem GIL com a opção <code>gil_used = false</code> no atributo <code>#[pymodule]</code>, em versões do PyO3 que a suportam; só marque depois de garantir que seu código Rust é thread-safe, o que em Rust o compilador ajuda a verificar (traits <code>Send</code> e <code>Sync</code>).</p>
      `
    },
    {
      id: 'zero-copy-numpy',
      title: 'Zero-copy com NumPy e o protocolo de buffer',
      body: `
        <p>Para dados numéricos grandes, converter para <code>Vec</code> copia tudo. O crate <code>numpy</code> (rust-numpy) permite receber um <code>ndarray</code> e ler seu buffer direto, sem cópia, e devolver arrays novos alocados pelo Rust. A versão do crate precisa casar com a do PyO3.</p>
        <pre><code class="language-rust">use numpy::{PyArray1, PyReadonlyArray1};
use pyo3::prelude::*;

#[pyfunction]
fn norma_l2(x: PyReadonlyArray1&lt;f64&gt;) -&gt; PyResult&lt;f64&gt; {
    let fatia = x.as_slice()?;                 // erro se não for contíguo
    Ok(fatia.iter().map(|v| v * v).sum::&lt;f64&gt;().sqrt())
}

#[pyfunction]
fn dobra&lt;'py&gt;(py: Python&lt;'py&gt;, x: PyReadonlyArray1&lt;f64&gt;) -&gt; PyResult&lt;Bound&lt;'py, PyArray1&lt;f64&gt;&gt;&gt; {
    let saida: Vec&lt;f64&gt; = x.as_slice()?.iter().map(|v| v * 2.0).collect();
    Ok(PyArray1::from_vec(py, saida))          // um array NumPy novo, dono de um buffer Rust
}</code></pre>
        <pre><code class="language-python">import numpy as np
import rapido

x = np.random.default_rng(0).random(5_000_000)     # contíguo, float64
print(rapido.norma_l2(x), np.linalg.norm(x))        # confirme que os resultados batem
# x[::2] não é contíguo: as_slice() falha; use np.ascontiguousarray(x[::2]) antes de chamar</code></pre>
        <p>Alternativas que não exigem o crate <code>numpy</code>: aceitar qualquer objeto que implemente o <strong>protocolo de buffer</strong> (<code>bytes</code>, <code>bytearray</code>, <code>memoryview</code>, <code>array.array</code>, ndarray) e ler a memória diretamente; e a troca via <strong>Apache Arrow</strong> (a C Data Interface permite passar colunas entre Python, Rust e C++ sem cópia, base da integração do Polars com PyArrow).</p>
        <div class="callout tip"><strong>DICA</strong> Teste a correção numérica contra a implementação NumPy ou Python de referência com <code>np.allclose</code>, e rode seus testes Python contra o módulo instalado por <code>maturin develop</code>. Testes unitários em Rust (<code>cargo test</code>) cobrem a lógica pura, e um conjunto fino de testes em Python cobre a fronteira.</div>
      `
    },
    {
      id: 'empacotamento-e-ci',
      title: 'Empacotamento, wheels e CI',
      body: `
        <p>O empacotamento é metade do trabalho de uma extensão nativa. Usuários esperam <code>pip install pacote</code> e receber uma wheel pronta, sem compilador. O maturin produz wheels no formato correto, e a ação oficial do GitHub (<code>PyO3/maturin-action</code>) automatiza builds para Linux (manylinux e musllinux), macOS e Windows.</p>
        <pre><code class="language-toml"># pyproject.toml
[build-system]
requires = ["maturin&gt;=1.5,&lt;2"]
build-backend = "maturin"

[project]
name = "rapido"
requires-python = "&gt;=3.9"
dynamic = ["version"]

[tool.maturin]
features = ["pyo3/extension-module"]
python-source = "python"        # opcional: código Python junto com o módulo nativo
module-name = "rapido._rapido"  # módulo nativo dentro de um pacote Python</code></pre>
        <pre><code class="language-bash">maturin build --release                    # gera wheel para o Python atual em target/wheels
maturin build --release --zig              # builds manylinux sem Docker (usa zig como linker)
maturin sdist                              # distribuição-fonte, para quem compila localmente
maturin publish                            # publica no PyPI (use trusted publishing no CI)</code></pre>
        <ul>
          <li><strong>abi3 versus wheels por versão:</strong> abi3 reduz a matriz de builds; wheels específicas por versão permitem APIs mais rápidas e são necessárias para builds free-threaded (tags <code>cp313t</code> e <code>cp314t</code>).</li>
          <li><strong>Matriz de CI:</strong> sistemas operacionais, arquiteturas (x86_64 e aarch64) e versões do Python que você suporta; teste instalando a wheel gerada, não o código-fonte.</li>
          <li><strong>Tipagem:</strong> publique um arquivo <code>.pyi</code> e o marcador <code>py.typed</code> para que mypy e IDEs entendam o módulo nativo.</li>
          <li><strong>Segurança da cadeia:</strong> fixe o <code>Cargo.lock</code>, rode <code>cargo audit</code> e <code>cargo deny</code>, e publique com identidade confiável (trusted publishing) em vez de tokens de longa duração.</li>
          <li><strong>Perfil de release:</strong> em <code>[profile.release]</code> considere <code>lto = "thin"</code> e <code>codegen-units = 1</code> para desempenho, ao custo de tempo de compilação. Meça o efeito.</li>
        </ul>
        <div class="callout"><strong>NA ENTREVISTA</strong> "Quando você escreveria uma extensão em Rust?" Resposta madura: depois de perfilar, melhorar o algoritmo e esgotar vetorização e Numba; para um núcleo estável, crítico em desempenho e reutilizado, em que a segurança de memória e a distribuição por wheels compensam o custo de manter dois ecossistemas. E cite o custo da fronteira e a necessidade de uma matriz de CI.</div>
      `
    },
    {
      id: 'quando-compensa',
      title: 'Quando compensa (e o custo real)',
      body: `
        <p>Antes de abrir um projeto Rust, responda com dados:</p>
        <ol>
          <li><strong>O gargalo está medido e localizado?</strong> Um profiler mostrou que uma função pura, bem delimitada, concentra o tempo?</li>
          <li><strong>Alternativas mais baratas esgotadas?</strong> Algoritmo, estrutura de dados, NumPy, Numba, uma biblioteca existente (Polars, orjson, pydantic v2 já são Rust).</li>
          <li><strong>A fronteira é fina?</strong> Poucas chamadas, dados grandes ou por buffer, não milhões de chamadas pequenas.</li>
          <li><strong>A equipe sustenta Rust?</strong> Revisão de código, atualização de crates, CI multiplataforma, resposta a CVEs.</li>
          <li><strong>O ganho justifica?</strong> Meça a versão Rust contra a melhor versão Python, não contra a ingênua.</li>
        </ol>
        <pre><code class="language-python">import time
from statistics import median

def benchmark(nome, fn, *args, repeticoes=7):
    fn(*args)                                    # aquecimento
    tempos = []
    for _ in range(repeticoes):
        t0 = time.perf_counter()
        fn(*args)
        tempos.append(time.perf_counter() - t0)
    print(f"{nome:20s} mediana {median(tempos):.5f}s  min {min(tempos):.5f}s")

# Compare SEMPRE contra a melhor alternativa Python disponível:
# benchmark("python puro", soma_py, dados)
# benchmark("numpy", soma_np, arr)
# benchmark("numba", soma_nb, arr)
# benchmark("rust (pyo3)", rapido.soma, arr)</code></pre>
        <p>Custos permanentes: dois toolchains, ambiente de desenvolvimento mais pesado, builds mais lentos, depuração em dois mundos (<code>gdb</code>/<code>lldb</code> e <code>py-spy --native</code> ajudam), onboarding mais difícil. Em compensação: segurança de memória sem coletor, concorrência com garantias do compilador, desempenho previsível e um ecossistema de crates para parsing, criptografia, compressão e processamento paralelo (Rayon).</p>
        <p>Casos em que o investimento costuma se pagar: parsers e validadores de alto volume, compressão e serialização, estruturas de dados especializadas, simulações com muitos passos, processamento de texto e bibliotecas distribuídas para muitos usuários. Casos em que não paga: scripts, código dominado por I/O ou rede, regras de negócio, e qualquer lugar onde um índice no banco resolve.</p>
      `
    }
  ],
  whenToUse: [
    'Núcleo crítico e estável, bem delimitado, em que o profiler mostra concentração de tempo',
    'Biblioteca distribuída para muitos usuários, que se beneficia de wheels pré-compiladas e desempenho previsível',
    'Parsers, validação, serialização, compressão e processamento com paralelismo seguro (Rayon)',
    'Trabalho pesado fora do GIL via detach, com threads Python em volta',
    'Quando segurança de memória importa em código nativo exposto a entradas não confiáveis'
  ],
  whenNot: [
    'Antes de otimizar algoritmo, vetorizar com NumPy ou tentar Numba',
    'Fronteira fina e chamada milhões de vezes com pouco trabalho por chamada',
    'Código dominado por I/O, rede ou banco: o gargalo não é CPU de Python',
    'Equipe sem capacidade de manter Rust, CI multiplataforma e atualizações de dependências',
    'Protótipos e scripts de vida curta, em que o custo de build e manutenção supera o ganho'
  ],
  metrics: [
    'Benchmark do módulo contra a melhor alternativa Python (NumPy, Numba), com pyperf e variância',
    'py-spy record --native para ver Python e Rust no mesmo flame graph',
    'Escala com threads quando o GIL é liberado (speedup versus número de núcleos)',
    'Tempo de build, tamanho das wheels e tempo da matriz de CI',
    'cargo test, cargo clippy, cargo audit e testes Python de fronteira com np.allclose'
  ],
  refs: [
    { type: 'doc', title: 'PyO3 user guide', author: 'PyO3 project', url: 'https://pyo3.rs/', note: 'Guia oficial: funções, classes, erros, GIL, ABI estável e free-threading.' },
    { type: 'doc', title: 'maturin user guide', author: 'PyO3 project', url: 'https://www.maturin.rs/', note: 'Build, develop, wheels, publicação e integração com CI.' },
    { type: 'doc', title: 'rust-numpy (crate numpy)', author: 'PyO3 project', url: 'https://github.com/PyO3/rust-numpy', note: 'Acesso zero-copy a arrays NumPy a partir de Rust.' },
    { type: 'doc', title: 'ctypes: A foreign function library for Python', author: 'Python Software Foundation', url: 'https://docs.python.org/3/library/ctypes.html', note: 'FFI da biblioteca padrão, com os cuidados de tipos e GIL.' },
    { type: 'doc', title: 'CFFI documentation', author: 'Armin Rigo e Maciej Fijalkowski', url: 'https://cffi.readthedocs.io/', note: 'Bindings C em modos ABI e API.' },
    { type: 'doc', title: 'Extending and Embedding the Python Interpreter (C API)', author: 'Python Software Foundation', url: 'https://docs.python.org/3/extending/index.html', note: 'A base: como módulos em C funcionam, contagem de referências e GIL.' },
    { type: 'livro', title: 'The Rust Programming Language', author: 'Steve Klabnik e Carol Nichols', url: 'https://doc.rust-lang.org/book/', note: 'O livro oficial e gratuito de Rust, com ownership, traits e concorrência.' },
    { type: 'doc', title: 'C API Extension Support for Free Threading', author: 'Python Software Foundation', url: 'https://docs.python.org/3/howto/free-threading-extensions.html', note: 'Regras para extensões nativas no build sem GIL.' }
  ]
};

window.LESSON_CONTENT['caching-io'] = {
  id: 'caching-io',
  title: 'Caching, I/O e serialização',
  etapa: 11, etapaName: 'High performance',
  time: '60 min',
  tags: ['lru_cache', 'Redis', 'mmap', 'serialização'],
  tagline: 'O trabalho mais barato é o que você <em>não refaz</em>, e o byte mais barato é o que você não copia.',
  intro: `
    <p>Em sistemas reais, a maior parte da latência não está em cálculo, e sim em esperar dados: disco, rede, banco, serialização. As alavancas para isso são três. <strong>Cache</strong>: não recalcular nem rebuscar o que não mudou. <strong>I/O eficiente</strong>: ler e escrever em blocos, mapear arquivos em memória, evitar cópias. <strong>Serialização</strong>: escolher formatos e bibliotecas adequados ao volume e ao contrato de dados.</p>
    <p>Cada uma tem armadilhas clássicas: cache que nunca invalida e serve dado velho, cache que vira vazamento de memória, <em>cache stampede</em> quando uma chave popular expira, serialização com pickle sobre dados não confiáveis, JSON gigante carregado inteiro em memória. A lição trata dos padrões e dos riscos com a mesma ênfase.</p>
    <p>Como sempre: meça antes (lição 63). Troque a biblioteca de JSON só se a serialização aparece no profiler; ponha cache só onde a taxa de acerto esperada justifica a complexidade de invalidação.</p>
  `,
  sections: [
    {
      id: 'cache-em-processo',
      title: 'Cache em processo: functools e TTL',
      body: `
        <p><code>functools.cache</code> (3.9+) e <code>functools.lru_cache</code> memoizam funções <em>puras</em> com argumentos hasheáveis. <code>lru_cache(maxsize=N)</code> descarta o menos recentemente usado quando cheio; <code>cache</code> é equivalente a <code>lru_cache(maxsize=None)</code>, sem limite. Ambos expõem <code>cache_info()</code> (acertos, erros, tamanho) e <code>cache_clear()</code>, e são seguros para uso com threads (a estrutura interna é protegida), embora duas threads possam calcular a mesma chave ao mesmo tempo na primeira vez.</p>
        <pre><code class="language-python">import functools
import time

@functools.lru_cache(maxsize=512)
def cotacao(moeda: str) -&gt; float:
    time.sleep(0.2)                     # simula chamada lenta
    return {"USD": 5.1, "EUR": 5.5}.get(moeda, 1.0)

t0 = time.perf_counter(); cotacao("USD"); t1 = time.perf_counter() - t0
t0 = time.perf_counter(); cotacao("USD"); t2 = time.perf_counter() - t0
print(f"1a chamada {t1:.3f}s, 2a chamada {t2:.6f}s")
print(cotacao.cache_info())              # CacheInfo(hits=1, misses=1, maxsize=512, currsize=1)

class Relatorio:
    def __init__(self, dados):
        self.dados = dados

    @functools.cached_property          # calcula uma vez por instância e guarda no __dict__
    def total(self):
        return sum(self.dados)</code></pre>
        <ul>
          <li><strong>Funções puras apenas:</strong> se o resultado depende de estado externo (hora, banco, arquivo), o cache serve dado velho.</li>
          <li><strong>Argumentos mutáveis não são hasheáveis</strong> e a chave inclui <code>self</code> em métodos, o que mantém instâncias vivas: evite <code>lru_cache</code> em métodos (lição 65).</li>
          <li><strong>Retorno mutável:</strong> o cache devolve o <em>mesmo</em> objeto; se o chamador o modifica, corrompe o cache para os demais.</li>
          <li><code>cached_property</code> não usa mais um lock interno desde o 3.12, então em código com threads a propriedade pode ser calculada mais de uma vez; garanta idempotência.</li>
          <li><strong>TTL:</strong> a biblioteca padrão não tem expiração por tempo. Use <code>cachetools.TTLCache</code>, ou implemente uma versão simples com carimbo de tempo.</li>
        </ul>
        <pre><code class="language-python">import threading
import time
from typing import Callable, Generic, Hashable, TypeVar

V = TypeVar("V")

class CacheTTL(Generic[V]):
    """Cache em processo com expiração e limite de tamanho (FIFO simples)."""

    def __init__(self, ttl: float, maxsize: int = 1024, relogio: Callable[[], float] = time.monotonic):
        self._ttl, self._max, self._rel = ttl, maxsize, relogio
        self._dados: dict[Hashable, tuple[float, V]] = {}
        self._lock = threading.Lock()

    def obtem(self, chave: Hashable, fabrica: Callable[[], V]) -&gt; V:
        agora = self._rel()
        with self._lock:
            item = self._dados.get(chave)
            if item and item[0] &gt; agora:
                return item[1]
        valor = fabrica()                            # fora do lock: não serializa chamadas lentas
        with self._lock:
            if len(self._dados) &gt;= self._max:
                self._dados.pop(next(iter(self._dados)))   # remove o mais antigo inserido
            self._dados[chave] = (agora + self._ttl, valor)
        return valor</code></pre>
      `
    },
    {
      id: 'cache-distribuido',
      title: 'Cache distribuído: cache-aside, invalidação e stampede',
      body: `
        <p>Quando há várias instâncias do serviço, um cache em processo dá visões divergentes e é perdido a cada reinício. Um cache compartilhado (Redis, Memcached) resolve ao custo de uma ida à rede (da ordem de sub-milissegundos a milissegundos na mesma região, a medir no seu ambiente). O padrão mais comum é o <strong>cache-aside</strong>: a aplicação consulta o cache; no erro, busca na fonte, grava no cache com TTL e devolve.</p>
        <pre><code class="language-python">import json
import redis   # pip install redis

r = redis.Redis(host="localhost", port=6379, decode_responses=True)

def busca_usuario_db(uid: int) -&gt; dict:
    return {"id": uid, "nome": f"user{uid}"}       # no real: SELECT ao banco

def usuario(uid: int, ttl: int = 300) -&gt; dict:
    chave = f"usuario:v1:{uid}"                     # versione o esquema da chave
    bruto = r.get(chave)
    if bruto is not None:
        return json.loads(bruto)
    valor = busca_usuario_db(uid)
    r.set(chave, json.dumps(valor), ex=ttl)         # TTL sempre: nunca guarde para sempre
    return valor

def atualiza_usuario(uid: int, dados: dict) -&gt; None:
    # escreve na fonte e INVALIDA o cache (mais seguro que tentar atualizar os dois)
    ...
    r.delete(f"usuario:v1:{uid}")</code></pre>
        <p>Os problemas clássicos:</p>
        <ul>
          <li><strong>Invalidação:</strong> "há apenas duas coisas difíceis em ciência da computação: invalidação de cache e dar nomes às coisas" (frase atribuída a Phil Karlton). Estratégias: TTL curto, invalidação por evento ao escrever, chaves versionadas.</li>
          <li><strong>Cache stampede (thundering herd):</strong> uma chave popular expira e centenas de requisições batem juntas no banco. Mitigações: um lock por chave (só um recalcula), TTL com jitter para evitar expiração sincronizada, e servir o valor antigo enquanto um worker atualiza (stale-while-revalidate).</li>
          <li><strong>Cache negativo:</strong> guardar também "não existe" (com TTL curto) para evitar consultas repetidas a chaves inexistentes.</li>
          <li><strong>Consistência:</strong> cache-aside é eventualmente consistente. Se o requisito é leitura forte após escrita, leia da fonte ou use write-through com cuidado.</li>
          <li><strong>Segurança:</strong> nunca serialize com pickle dados que passam por um cache que outros processos (ou atacantes) podem escrever.</li>
        </ul>
        <pre><code class="language-python">import random
import time

def ttl_com_jitter(base: int, fracao: float = 0.1) -&gt; int:
    """Espalha as expirações para evitar stampede sincronizado."""
    return int(base * (1 + random.uniform(-fracao, fracao)))

def com_lock_por_chave(r, chave, fabrica, ttl=300, espera_max=2.0):
    bruto = r.get(chave)
    if bruto is not None:
        return bruto
    lock = r.lock(f"lock:{chave}", timeout=10)       # lock distribuído do redis-py
    if lock.acquire(blocking=True, blocking_timeout=espera_max):
        try:
            bruto = r.get(chave)                     # outro processo pode ter preenchido
            if bruto is None:
                bruto = fabrica()
                r.set(chave, bruto, ex=ttl_com_jitter(ttl))
            return bruto
        finally:
            lock.release()
    return fabrica()                                  # degradação: não travar o usuário</code></pre>
      `
    },
    {
      id: 'io-eficiente',
      title: 'I/O eficiente: buffers, blocos e mmap',
      body: `
        <p>O I/O em Python passa por camadas (<code>io.FileIO</code>, <code>BufferedReader</code>, <code>TextIOWrapper</code>). Pontos que importam:</p>
        <ul>
          <li><strong>Modo binário</strong> evita decodificação quando você não precisa de texto; decodifique em blocos grandes, não linha a linha, se a taxa for crítica.</li>
          <li><strong>Leitura em blocos</strong> com tamanhos de várias dezenas de KB a MB reduzem chamadas de sistema; <code>readinto</code> preenche um buffer pré-alocado, sem criar objetos <code>bytes</code> novos a cada leitura.</li>
          <li><strong>memoryview</strong> fatia sem copiar; <code>bytearray</code> é mutável e cresce amortizado.</li>
          <li><strong>mmap</strong> delega ao SO a paginação sob demanda: bom para acesso aleatório em arquivos grandes e para compartilhar memória entre processos.</li>
          <li><strong>Não bloqueie o loop</strong> em código assíncrono: arquivos regulares não têm I/O verdadeiramente assíncrono no Linux via epoll; use <code>asyncio.to_thread</code> ou bibliotecas que o fazem.</li>
        </ul>
        <pre><code class="language-python">import io
import mmap
import os
import struct
import tempfile

# 1) readinto com buffer reutilizado: zero alocações por bloco
def checksum_arquivo(caminho: str, bloco: int = 1 &lt;&lt; 20) -&gt; int:
    buf = bytearray(bloco)
    visao = memoryview(buf)
    total = 0
    with open(caminho, "rb", buffering=0) as f:        # sem buffer extra: já lemos em blocos grandes
        while (n := f.readinto(buf)):
            total = (total + sum(visao[:n])) &amp; 0xFFFFFFFF   # visão: sem cópia
    return total

# 2) mmap: acesso aleatório sem carregar o arquivo
with tempfile.NamedTemporaryFile(delete=False) as tmp:
    tmp.write(struct.pack("&lt;1000q", *range(1000)))     # 1000 inteiros de 64 bits
    caminho = tmp.name

with open(caminho, "rb") as f, mmap.mmap(f.fileno(), 0, access=mmap.ACCESS_READ) as mm:
    (valor,) = struct.unpack_from("&lt;q", mm, 500 * 8)    # lê o registro 500 direto da página
    print(valor)                                          # 500

print(checksum_arquivo(caminho))
os.unlink(caminho)

# 3) BytesIO.getbuffer: visão mutável sem copiar o conteúdo
b = io.BytesIO(b"abcdef")
vis = b.getbuffer()
vis[0:3] = b"XYZ"
vis.release()                                              # libere antes de redimensionar
print(b.getvalue())                                        # b'XYZdef'</code></pre>
        <div class="callout warn"><strong>PEGADINHA</strong> mmap em arquivos que outro processo trunca pode gerar <code>SIGBUS</code> (crash) ao acessar páginas que deixaram de existir. Em arquivos compartilhados e mutáveis, combine com locks de arquivo e trate o ciclo de vida com cuidado. Em Windows, o arquivo mapeado não pode ser removido enquanto estiver mapeado.</div>
      `
    },
    {
      id: 'serializacao',
      title: 'Serialização: JSON, orjson, MessagePack, pickle e colunar',
      body: `
        <p>Escolher o formato é decidir entre legibilidade, tamanho, velocidade, esquema e segurança.</p>
        <table>
          <thead><tr><th>Formato</th><th>Ponto forte</th><th>Cuidado</th></tr></thead>
          <tbody>
            <tr><td><code>json</code> (stdlib)</td><td>Universal, legível, sem dependências</td><td>Mais lento que alternativas; sem bytes, datetime, etc. nativos</td></tr>
            <tr><td><code>orjson</code></td><td>JSON rápido (escrito em Rust); serializa dataclass, datetime, UUID e, com opção, arrays NumPy</td><td><code>dumps</code> devolve <code>bytes</code>; chaves não-string exigem opção; API menor que a do json</td></tr>
            <tr><td><code>msgpack</code></td><td>Binário compacto, tipos básicos, bytes nativos</td><td>Sem esquema; datetime exige extensão</td></tr>
            <tr><td><code>pickle</code></td><td>Qualquer objeto Python, protocolo 5 com buffers fora da banda</td><td><strong>Inseguro</strong> com dados não confiáveis; acopla à versão do código</td></tr>
            <tr><td>Parquet / Arrow</td><td>Colunar, tipado, compressão; ideal para dados tabulares grandes</td><td>Não é para mensagens pequenas</td></tr>
            <tr><td>Protobuf, Avro</td><td>Esquema explícito e evolução controlada entre serviços</td><td>Geração de código e governança de esquema</td></tr>
          </tbody>
        </table>
        <pre><code class="language-python">import json
import timeit
from dataclasses import dataclass
from datetime import datetime, timezone

import msgpack     # pip install msgpack
import orjson      # pip install orjson

@dataclass
class Evento:
    id: int
    nome: str
    quando: datetime
    valores: list[float]

evento = Evento(1, "pagamento", datetime(2026, 1, 2, 3, 4, 5, tzinfo=timezone.utc), [1.5, 2.5, 3.5])

print(orjson.dumps(evento))                                     # dataclass e datetime nativos, retorna bytes
print(orjson.dumps(evento, option=orjson.OPT_INDENT_2).decode())

dados = {"id": 1, "nome": "x", "valores": [float(i) for i in range(1000)]}
empacotado = msgpack.packb(dados, use_bin_type=True)
assert msgpack.unpackb(empacotado, raw=False) == dados
print(len(json.dumps(dados)), len(orjson.dumps(dados)), len(empacotado))   # compare os tamanhos

# Meça com o SEU payload: o ganho varia com a forma dos dados
for nome, fn in [("json", lambda: json.dumps(dados)), ("orjson", lambda: orjson.dumps(dados)),
                 ("msgpack", lambda: msgpack.packb(dados))]:
    print(nome, min(timeit.repeat(fn, number=2_000, repeat=5)))</code></pre>
        <ul>
          <li><strong>pickle é código:</strong> desserializar pickle de fonte não confiável permite execução arbitrária de código. Entre processos seus, ok; vindo da rede ou de um cache compartilhado, não. Para ML, atenção também a modelos em pickle baixados de terceiros.</li>
          <li><strong>Esquema e validação:</strong> JSON sem esquema empurra erros para longe da origem. Valide a entrada na borda com pydantic ou msgspec (que combina decodificação e validação por tipos com bom desempenho).</li>
          <li><strong>Grandes volumes:</strong> não faça <code>json.load</code> de arquivos de gigabytes. Use JSON Lines (um objeto por linha, processado em fluxo), ijson para streaming, ou formatos colunares.</li>
          <li><strong>Compressão:</strong> <code>gzip</code>, <code>bz2</code> e <code>lzma</code> estão na biblioteca padrão; o Python 3.14 adicionou o pacote <code>compression</code>, com <code>compression.zstd</code> (PEP 784) para Zstandard, em geral um bom equilíbrio entre taxa e velocidade. Meça com seus dados.</li>
        </ul>
        <div class="callout tip"><strong>DICA</strong> Para passar arrays grandes entre processos sem cópia extra, o protocolo 5 do pickle (PEP 574) permite buffers fora da banda: <code>pickle.dumps(obj, protocol=5, buffer_callback=lista.append)</code>. Bibliotecas como NumPy e Arrow se beneficiam, e o multiprocessing e o Dask usam essa capacidade.</div>
      `
    },
    {
      id: 'streaming-e-assincrono',
      title: 'Streaming, JSON Lines e I/O em código assíncrono',
      body: `
        <p>Para volumes que não cabem em memória, o desenho é de fluxo: ler uma unidade, processar, escrever, descartar. JSON Lines (um JSON por linha) é o formato mais simples para isso: dá para dividir o arquivo, processar em paralelo por faixa de bytes e anexar registros sem reescrever tudo.</p>
        <pre><code class="language-python">import asyncio
import json
from collections.abc import Iterator

def le_jsonl(caminho: str) -&gt; Iterator[dict]:
    with open(caminho, "r", encoding="utf-8") as f:
        for linha in f:                       # uma linha por vez: memória O(1)
            if linha.strip():
                yield json.loads(linha)

def escreve_jsonl(caminho: str, registros) -&gt; int:
    n = 0
    with open(caminho, "w", encoding="utf-8") as f:
        for r in registros:
            f.write(json.dumps(r, ensure_ascii=False) + "\\n")
            n += 1
    return n

# Pipeline em fluxo: lê, filtra, transforma, grava, sem materializar a lista
def pipeline(origem: str, destino: str) -&gt; int:
    ativos = (r for r in le_jsonl(origem) if r.get("ativo"))
    enriquecidos = ({**r, "nome_upper": r["nome"].upper()} for r in ativos)
    return escreve_jsonl(destino, enriquecidos)

# Em código assíncrono, arquivo comum é bloqueante: delegue a uma thread
async def conta_registros(caminho: str) -&gt; int:
    return await asyncio.to_thread(lambda: sum(1 for _ in le_jsonl(caminho)))</code></pre>
        <p>Pontos de atenção em fluxo: <strong>feche</strong> o gerador se parar antes do fim (use <code>with</code> ou <code>contextlib.closing</code>); trate <strong>linhas corrompidas</strong> (um registro ruim não deve derrubar um job de horas: registre e siga, com contador de erros); escreva em arquivo temporário e <strong>renomeie atomicamente</strong> (<code>os.replace</code>) para que leitores nunca vejam um arquivo pela metade; e use <strong>fsync</strong> quando a durabilidade importar mais que a velocidade.</p>
        <pre><code class="language-python">import os
import tempfile

def grava_atomico(caminho: str, conteudo: bytes) -&gt; None:
    pasta = os.path.dirname(os.path.abspath(caminho))
    fd, tmp = tempfile.mkstemp(dir=pasta)            # mesmo sistema de arquivos: rename é atômico
    try:
        with os.fdopen(fd, "wb") as f:
            f.write(conteudo)
            f.flush()
            os.fsync(f.fileno())                     # só se precisar de durabilidade
        os.replace(tmp, caminho)                     # troca atômica
    except BaseException:
        os.unlink(tmp)
        raise</code></pre>
      `
    },
    {
      id: 'decisoes-e-observabilidade',
      title: 'Decisões, métricas e armadilhas de produção',
      body: `
        <p>Um cache só é bom se você sabe a sua <strong>taxa de acerto</strong> e o custo de erro. Instrumente: acertos, erros, evicções, tamanho, latência do cache versus da fonte, e a idade dos dados servidos. Sem isso, o cache é uma crença.</p>
        <pre><code class="language-python">import functools
import time

def com_metricas(fn):
    """Envolve uma função com lru_cache e expõe métricas simples."""
    cached = functools.lru_cache(maxsize=1024)(fn)

    @functools.wraps(fn)
    def interno(*a, **kw):
        t0 = time.perf_counter()
        r = cached(*a, **kw)
        interno.ultima_latencia = time.perf_counter() - t0
        return r

    interno.cache_info = cached.cache_info
    interno.cache_clear = cached.cache_clear
    interno.ultima_latencia = 0.0
    return interno

@com_metricas
def caro(x: int) -&gt; int:
    time.sleep(0.01)
    return x * x

for i in [1, 2, 1, 1, 3, 2]:
    caro(i)
info = caro.cache_info()
print(info, f"taxa de acerto {info.hits / (info.hits + info.misses):.0%}")</code></pre>
        <ul>
          <li><strong>Dimensione pela memória, não pelo número de itens:</strong> um <code>maxsize</code> de 10.000 com valores de 1 MB são 10 GB.</li>
          <li><strong>Cuidado com a "otimização" que muda a semântica:</strong> um cache em dados que mudam (preços, permissões, saldo) é um bug de negócio, e de segurança no caso de autorização.</li>
          <li><strong>Cache frio:</strong> após deploy ou falha, todos os pedidos vão à fonte. Planeje aquecimento (warm-up) e proteja o banco (limite de concorrência, lição 62).</li>
          <li><strong>Serialização no caminho quente:</strong> perfile; se a codificação JSON aparece alta, troque de biblioteca ou de formato. Se aparece o parse de entradas gigantes, processe em fluxo.</li>
          <li><strong>Teste a invalidação:</strong> escreva testes que modifiquem a fonte e verifiquem que o cache não serve dado obsoleto além do contrato acordado.</li>
        </ul>
        <div class="callout"><strong>NA ENTREVISTA</strong> "Como você projetaria o cache desta API?" Percorra: o que cachear (leituras caras e estáveis), onde (processo, Redis, CDN), chave versionada, TTL com jitter, invalidação na escrita, proteção contra stampede, cache negativo, métricas de taxa de acerto, e o que acontece quando o cache cai (degradar para a fonte com limite de concorrência).</div>
      `
    }
  ],
  whenToUse: [
    'lru_cache/cache para funções puras e caras com argumentos hasheáveis e domínio limitado',
    'Cache distribuído com TTL quando há várias instâncias e leituras caras e repetidas',
    'Leitura em blocos, readinto e mmap para arquivos grandes e acesso aleatório',
    'orjson ou msgpack quando a serialização aparece no profiler; formatos colunares para dados tabulares',
    'JSON Lines e streaming para volumes que não cabem em memória'
  ],
  whenNot: [
    'Cache de dados que mudam com frequência ou que envolvem autorização e saldo, sem invalidação clara',
    'lru_cache sem limite em argumentos de alta cardinalidade, ou em métodos (retém self)',
    'pickle com dados de fonte não confiável, inclusive caches compartilhados graváveis por terceiros',
    'Trocar de biblioteca de serialização sem ter visto o custo no profiler',
    'mmap em arquivos que outros processos truncam, sem tratamento de SIGBUS e locks'
  ],
  metrics: [
    'Taxa de acerto, evicções, tamanho e idade média dos itens (cache_info, métricas do Redis: INFO stats)',
    'Latência de acerto versus erro; p99 durante expiração em massa (stampede)',
    'Tempo de serialização/desserialização e tamanho do payload por formato, com o seu dado real',
    'Throughput de leitura (MB/s) versus tamanho de bloco; uso de memória residente com mmap',
    'cProfile/py-spy mostrando a fração do tempo gasta em json, I/O e rede'
  ],
  refs: [
    { type: 'doc', title: 'functools: lru_cache, cache e cached_property', author: 'Python Software Foundation', url: 'https://docs.python.org/3/library/functools.html', note: 'Semântica, limitações e cache_info.' },
    { type: 'doc', title: 'mmap: Memory-mapped file support', author: 'Python Software Foundation', url: 'https://docs.python.org/3/library/mmap.html', note: 'Modos de acesso e cuidados por plataforma.' },
    { type: 'doc', title: 'io: Core tools for working with streams', author: 'Python Software Foundation', url: 'https://docs.python.org/3/library/io.html', note: 'Camadas de I/O, buffering, BytesIO e getbuffer.' },
    { type: 'doc', title: 'PEP 574: Pickle protocol 5 with out-of-band data', author: 'Antoine Pitrou', url: 'https://peps.python.org/pep-0574/', note: 'Buffers fora da banda e serialização sem cópia.' },
    { type: 'doc', title: 'orjson', author: 'Contribuidores do projeto orjson', url: 'https://github.com/ijl/orjson', note: 'JSON rápido em Rust, opções e comparações de desempenho.' },
    { type: 'doc', title: 'MessagePack for Python', author: 'MessagePack project', url: 'https://msgpack.org/', note: 'Especificação e implementações do formato.' },
    { type: 'doc', title: 'Redis documentation: caching and client-side patterns', author: 'Redis', url: 'https://redis.io/docs/', note: 'Padrões de cache, expiração e estruturas de dados.' },
    { type: 'livro', title: 'High Performance Python, 2nd edition', author: 'Micha Gorelick e Ian Ozsvald', url: 'https://www.oreilly.com/library/view/high-performance-python/9781492055013/', note: 'I/O, memória e estratégias de cache em casos reais.' }
  ]
};
