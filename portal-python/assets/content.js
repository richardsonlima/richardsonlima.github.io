/* Lesson content, Etapas 1 e 2 (lições 01 a 12)
   Schema em CONTRATO: id, title, etapa, etapaName, time, tags, tagline, intro,
   sections[{id,title,body}], whenToUse[], whenNot[], metrics[], refs[]
*/
window.LESSON_CONTENT = window.LESSON_CONTENT || {};

window.LESSON_CONTENT['python-ambiente'] = {
  id: 'python-ambiente',
  title: 'Ambiente moderno',
  etapa: 1, etapaName: 'Fundamentos da linguagem',
  time: '60 min',
  tags: ['uv', 'venv', 'pyproject.toml', 'reprodutibilidade'],
  tagline: 'Um projeto Python só é <em>reprodutível</em> quando versão do interpretador, dependências e layout estão declarados, travados e versionados.',
  intro: `<p>Metade dos incidentes "na minha máquina funciona" em Python nasce no ambiente, não no código: interpretador diferente, dependência transitiva que subiu de versão, pacote instalado no Python do sistema, import que só funciona porque o diretório atual está no <code>sys.path</code>. Antes de qualquer linha de lógica, vale ter um ambiente que qualquer pessoa (ou o CI) recria byte a byte.</p>
<p>O ecossistema mudou muito. Há poucos anos o fluxo era <code>pip</code> + <code>virtualenv</code> + <code>requirements.txt</code> + <code>setup.py</code>. Hoje a fonte de verdade é o <code>pyproject.toml</code> (PEPs 517, 518 e 621), e ferramentas como o <code>uv</code> (da Astral, escrito em Rust) unificam instalação de Python, criação de venv, resolução, lockfile e execução num único binário rápido.</p>
<p>Esta lição mostra o modelo mental (o que um venv realmente é), o fluxo moderno com <code>uv</code>, a anatomia do <code>pyproject.toml</code>, o layout <code>src/</code> e as armadilhas que aparecem em entrevista e em produção.</p>`,
  sections: [
    {
      id: 'versoes',
      title: 'Versões e ciclo de vida do Python',
      body: `<p>O CPython segue ciclo anual (PEP 602): uma versão nova por ano, em outubro, com suporte de correções por cerca de cinco anos (dois de bugfix completo, o resto só segurança). Isso dá uma regra prática: em produção, fique numa versão que ainda recebe patches de segurança, e teste o CI contra a versão mais nova para não ser pego de surpresa.</p>
<table><thead><tr><th>Versão</th><th>Marcos relevantes</th></tr></thead><tbody>
<tr><td>3.11</td><td>Interpretador adaptativo especializante (PEP 659), <code>ExceptionGroup</code> e <code>except*</code>, <code>tomllib</code> na stdlib</td></tr>
<tr><td>3.12</td><td>Sintaxe de generics <code>def f[T](x: T)</code> e <code>type X = ...</code> (PEP 695), f-strings formalizadas (PEP 701)</td></tr>
<tr><td>3.13</td><td>Build free-threaded experimental sem GIL (PEP 703), JIT experimental (PEP 744), REPL novo</td></tr>
<tr><td>3.14</td><td>Free-threaded com suporte oficial (PEP 779), anotações avaliadas de forma tardia (PEP 649), template strings (PEP 750), múltiplos interpretadores na stdlib (PEP 734)</td></tr>
</tbody></table>
<p>Free-threaded e JIT continuam opcionais e não são o padrão: o build normal ainda tem GIL. Trate-os como recursos para experimentar com benchmarks seus, não como ganho automático.</p>
<div class="callout warn"><strong>PEGADINHA</strong> Nunca use o Python do sistema operacional para projetos. Em distribuições Linux ele pertence ao gerenciador de pacotes e o PEP 668 (externally managed environment) faz o <code>pip install</code> global falhar de propósito. Instale um interpretador por projeto.</div>`
    },
    {
      id: 'venv-por-dentro',
      title: 'O que um venv realmente é',
      body: `<p>Um ambiente virtual não é uma máquina virtual nem um container. É um diretório com um <code>pyvenv.cfg</code>, um <code>bin/python</code> (um link ou cópia do interpretador base) e um <code>lib/python3.X/site-packages</code> vazio. Quando o interpretador inicia, ele procura o <code>pyvenv.cfg</code> ao lado do executável; se achar, ajusta <code>sys.prefix</code> para o venv e mantém <code>sys.base_prefix</code> apontando para a instalação original. O módulo <code>site</code> então adiciona o <code>site-packages</code> do venv ao <code>sys.path</code>.</p>
<p>"Ativar" o venv (<code>source .venv/bin/activate</code>) só prepende o <code>bin/</code> ao <code>PATH</code> e exporta <code>VIRTUAL_ENV</code>. É conveniência de shell. Chamar <code>.venv/bin/python</code> diretamente funciona igual, e é o que o CI e o <code>uv run</code> fazem.</p>
<pre><code class="language-python">import sys, sysconfig

def em_venv() -&gt; bool:
    # Dentro de um venv, prefix aponta para o venv e base_prefix para o Python original
    return sys.prefix != sys.base_prefix

print("executavel :", sys.executable)
print("prefix     :", sys.prefix)
print("base_prefix:", sys.base_prefix)
print("venv?      :", em_venv())
print("purelib    :", sysconfig.get_paths()["purelib"])
print("sys.path   :")
for p in sys.path:
    print("   ", p)</code></pre>
<p>Rode isso dentro e fora de um venv e compare. Esse é o diagnóstico de primeira linha para "instalei mas não importa": quase sempre o <code>pip</code> que instalou não é o do <code>python</code> que executa. Por isso a forma segura é <code>python -m pip</code> (garante o par interpretador e pip) ou, melhor, deixar o <code>uv</code> cuidar disso.</p>`
    },
    {
      id: 'uv-fluxo',
      title: 'Fluxo moderno com uv',
      body: `<p>O <code>uv</code> substitui <code>pip</code>, <code>pip-tools</code>, <code>virtualenv</code>, <code>pyenv</code>, <code>pipx</code> e parte do <code>poetry</code>. Ele resolve dependências com um resolvedor universal (a mesma resolução vale para Linux, macOS e Windows), grava um <code>uv.lock</code> e cria o <code>.venv</code> sob demanda. O ganho de velocidade vem de ser nativo, de cache global com hardlinks e de paralelismo, não de algum algoritmo mágico: a ordem de grandeza típica é segundos onde o pip levava dezenas de segundos, mas meça no seu projeto.</p>
<pre><code class="language-bash"># instalar o uv (uma vez por máquina)
curl -LsSf https://astral.sh/uv/install.sh | sh

# projeto novo: cria pyproject.toml, .python-version, README e estrutura
uv init meu-servico --package      # --package gera layout src/
cd meu-servico

# fixar/baixar o interpretador (gerenciado pelo uv, sem tocar no sistema)
uv python install 3.13
uv python pin 3.13                 # grava .python-version

# dependências: edita o pyproject.toml, resolve e atualiza uv.lock
uv add httpx pydantic
uv add --dev pytest ruff mypy      # vai para o grupo de desenvolvimento

# sincroniza o .venv exatamente com o lockfile
uv sync

# executa dentro do ambiente, sem ativar nada
uv run pytest -q
uv run python -m meu_servico

# CI: falha se o lockfile estiver desatualizado, não reresolve
uv sync --locked</code></pre>
<p>Para scripts avulsos existe o metadado inline do PEP 723: as dependências ficam num comentário no próprio arquivo e <code>uv run script.py</code> cria um ambiente efêmero.</p>
<pre><code class="language-python"># /// script
# requires-python = "&gt;=3.12"
# dependencies = ["httpx"]
# ///
import httpx

r = httpx.get("https://peps.python.org/pep-0723/")
print(r.status_code, len(r.text))</code></pre>
<div class="callout tip"><strong>DICA</strong> Ferramentas de linha de comando (ruff, httpie, cookiecutter) instale com <code>uv tool install</code>: cada uma ganha seu venv isolado e vai para o PATH, substituindo o <code>pipx</code>.</div>`
    },
    {
      id: 'pyproject',
      title: 'Anatomia do pyproject.toml',
      body: `<p>O <code>pyproject.toml</code> tem três tabelas padronizadas por PEPs e várias tabelas de ferramentas. <code>[build-system]</code> (PEP 518) diz qual backend constrói o pacote; <code>[project]</code> (PEP 621) guarda metadados e dependências de runtime; <code>[tool.*]</code> é o espaço de cada ferramenta (ruff, pytest, mypy). O PEP 735 acrescentou <code>[dependency-groups]</code> para dependências que não fazem parte do pacote publicado (testes, lint, docs).</p>
<pre><code class="language-toml">[build-system]
requires = ["hatchling"]
build-backend = "hatchling.build"

[project]
name = "meu-servico"
version = "0.1.0"
description = "Serviço de exemplo"
readme = "README.md"
requires-python = "&gt;=3.12"
dependencies = [
    "httpx&gt;=0.27,&lt;1",
    "pydantic&gt;=2.7,&lt;3",
]

[project.scripts]
meu-servico = "meu_servico.cli:main"

[dependency-groups]
dev = ["pytest&gt;=8", "ruff", "mypy"]

[tool.ruff]
line-length = 100
target-version = "py312"

[tool.ruff.lint]
select = ["E", "F", "I", "B", "UP", "SIM"]

[tool.pytest.ini_options]
addopts = "-q --strict-markers"
testpaths = ["tests"]

[tool.mypy]
strict = true</code></pre>
<p>Duas ideias para separar. <strong>Biblioteca</strong>: use faixas de versão amplas em <code>dependencies</code> (um teto de major é razoável) porque quem instala precisa resolver com outras libs. <strong>Aplicação</strong>: as faixas ainda ficam no <code>pyproject.toml</code>, mas a reprodutibilidade vem do lockfile, que fixa a versão exata de tudo, inclusive transitivas, com hashes.</p>
<div class="callout"><strong>NA ENTREVISTA</strong> "Qual a diferença entre requirements.txt, pyproject.toml e lockfile?" Resposta sênior: <code>pyproject.toml</code> declara intenção (o que o projeto aceita), o lockfile registra a resolução concreta (o que foi testado), e o <code>requirements.txt</code> é um formato de exportação de pip, útil para Docker e ferramentas legadas (<code>uv export</code> gera um).</div>`
    },
    {
      id: 'layout-src',
      title: 'Layout src/ e por que ele existe',
      body: `<p>No layout plano o pacote fica na raiz, ao lado de <code>tests/</code>. Rodando <code>pytest</code> da raiz, o diretório atual entra no <code>sys.path</code> e os testes importam o código-fonte direto, mesmo que o pacote esteja quebrado quando instalado (arquivo de dados esquecido, módulo fora do <code>packages</code>). No layout <code>src/</code> o pacote só é importável depois de instalado, então o teste exercita o artefato que o usuário receberá.</p>
<pre><code class="language-text">meu-servico/
  pyproject.toml
  uv.lock
  .python-version
  README.md
  src/
    meu_servico/
      __init__.py
      cli.py
      dominio.py
  tests/
    test_dominio.py</code></pre>
<pre><code class="language-python"># src/meu_servico/cli.py
from __future__ import annotations

import argparse
from importlib.metadata import version


def main(argv: list[str] | None = None) -&gt; int:
    parser = argparse.ArgumentParser(prog="meu-servico")
    parser.add_argument("--versao", action="store_true")
    args = parser.parse_args(argv)
    if args.versao:
        print(version("meu-servico"))   # lê o metadado instalado, fonte única da versão
    return 0


if __name__ == "__main__":
    raise SystemExit(main())</code></pre>
<p>Em vez de duplicar a versão em código, leia-a de <code>importlib.metadata</code>. O <code>uv sync</code> instala o projeto em modo editável por padrão, então mudanças em <code>src/</code> valem sem reinstalar.</p>
<div class="callout warn"><strong>PEGADINHA</strong> Nome do projeto no PyPI usa hífen (<code>meu-servico</code>), nome do pacote importável usa underscore (<code>meu_servico</code>). Confundir os dois é erro clássico no <code>importlib.metadata.version()</code>, que recebe o nome da distribuição, não do módulo.</div>`
    },
    {
      id: 'reprodutibilidade',
      title: 'Reprodutibilidade, lockfile e Docker',
      body: `<p>Reprodutível significa que o mesmo commit produz o mesmo conjunto de pacotes em qualquer máquina. O lockfile faz isso gravando versão exata, origem e hash de cada wheel. Sem ele, <code>pip install httpx</code> hoje e daqui a seis meses podem trazer árvores de dependências diferentes. Versione o <code>uv.lock</code> em aplicações e em repositórios de bibliotecas (ele serve ao CI, mesmo que não vá para os usuários).</p>
<p>No container, o padrão é separar a camada de dependências (que muda pouco) da camada de código (que muda sempre), para aproveitar o cache de camadas do Docker.</p>
<pre><code class="language-dockerfile">FROM python:3.13-slim AS base
COPY --from=ghcr.io/astral-sh/uv:latest /uv /usr/local/bin/uv
ENV UV_COMPILE_BYTECODE=1 UV_LINK_MODE=copy
WORKDIR /app

# camada de dependências: só invalida se pyproject ou lock mudarem
COPY pyproject.toml uv.lock ./
RUN uv sync --locked --no-install-project --no-dev

# camada de código
COPY src ./src
RUN uv sync --locked --no-dev

ENV PATH="/app/.venv/bin:$PATH"
CMD ["meu-servico"]</code></pre>
<p>Em produção, prefira fixar a imagem por digest ou tag de patch, e o <code>uv</code> por versão, para que o próprio build seja reprodutível. Rode <code>uv lock --upgrade</code> em PR dedicado, com testes, para atualizar dependências de forma controlada.</p>
<div class="callout tip"><strong>DICA</strong> Para auditar vulnerabilidades, rode <code>uv export --no-hashes | pip-audit -r /dev/stdin</code> (ou o equivalente no seu CI). Para ver por que uma dependência entrou, use <code>uv tree --invert --package nome</code>.</div>`
    },
    {
      id: 'armadilhas',
      title: 'Armadilhas e diagnóstico',
      body: `<ul>
<li><strong>pip global sujando o ambiente:</strong> instala no site-packages do sistema e causa conflitos entre projetos. Cure com um venv por projeto e <code>PIP_REQUIRE_VIRTUALENV=1</code>.</li>
<li><strong>Dependência instalada mas não declarada:</strong> funciona na sua máquina, quebra no CI. Só <code>uv add</code> (ou editar o pyproject) conta, e <code>uv sync --locked</code> no CI pega a divergência.</li>
<li><strong>Import que funciona só por causa do cwd:</strong> o layout <code>src/</code> expõe isso cedo.</li>
<li><strong>Dependências transitivas fixadas à mão:</strong> trava o resolvedor sem motivo. Declare só o que você importa diretamente.</li>
<li><strong>Mistura de gerenciadores:</strong> pip, poetry e uv no mesmo projeto geram lockfiles que brigam. Escolha um.</li>
<li><strong>Versão do Python implícita:</strong> sem <code>requires-python</code> e <code>.python-version</code>, cada pessoa roda uma versão e usa sintaxe que o CI não aceita.</li>
</ul>
<pre><code class="language-bash"># diagnóstico rápido quando algo não importa
uv run python -c "import sys; print(sys.executable); import httpx; print(httpx.__file__)"
uv pip list                       # o que está instalado no .venv
uv tree                           # árvore de dependências
python -X importtime -c "import meu_servico" 2&gt;&amp;1 | sort -t'|' -k2 -n | tail   # imports lentos</code></pre>
<div class="callout"><strong>NA ENTREVISTA</strong> "Por que o pip instalou o pacote e o import falhou?" Quase sempre: o <code>pip</code> do PATH pertence a outro interpretador. Mostre que você usa <code>python -m pip</code>, confere <code>sys.executable</code> e entende venv como diretório mais <code>sys.path</code>.</div>`
    }
  ],
  whenToUse: [
    'uv em projetos novos: um binário cobre Python, venv, lock e execução',
    'Layout src/ em qualquer pacote que será instalado ou publicado',
    'Lockfile versionado em aplicações, serviços e pipelines de dados',
    'PEP 723 para scripts avulsos com dependências',
    'Um venv por projeto, sempre, inclusive em notebooks e automações'
  ],
  whenNot: [
    'Não instale pacotes no Python do sistema nem com --break-system-packages',
    'Não use requirements.txt como fonte de verdade quando há pyproject.toml e lockfile',
    'Não fixe dependências transitivas à mão no pyproject',
    'Não misture dois gerenciadores de dependência no mesmo repositório',
    'Não dependa do diretório atual no sys.path para os testes passarem'
  ],
  metrics: [
    'uv sync --locked no CI: falha se o lockfile divergir do pyproject',
    'uv tree, uv pip list: inspeção da árvore e do que está instalado',
    'ruff check e ruff format, mypy, pytest: gate mínimo de qualidade',
    'pip-audit: vulnerabilidades conhecidas nas dependências',
    'python -X importtime: custo de import na inicialização',
    'sys.prefix versus sys.base_prefix: confirma se está em venv'
  ],
  refs: [
    { type: 'doc', title: 'uv documentation', author: 'Astral', url: 'https://docs.astral.sh/uv/', note: 'Referência oficial de projetos, lockfile, scripts e tools.' },
    { type: 'doc', title: 'Python Packaging User Guide', author: 'PyPA', url: 'https://packaging.python.org/', note: 'Fonte de verdade sobre pyproject.toml, build backends e publicação.' },
    { type: 'doc', title: 'venv: creation of virtual environments', author: 'Python Software Foundation', url: 'https://docs.python.org/3/library/venv.html', note: 'Explica pyvenv.cfg e como o interpretador detecta o ambiente.' },
    { type: 'doc', title: 'PEP 621: Storing project metadata in pyproject.toml', author: 'Brett Cannon et al.', url: 'https://peps.python.org/pep-0621/', note: 'Define a tabela [project].' },
    { type: 'doc', title: 'PEP 723: Inline script metadata', author: 'Ofek Lev', url: 'https://peps.python.org/pep-0723/', note: 'Dependências declaradas dentro do próprio script.' },
    { type: 'doc', title: 'PEP 735: Dependency Groups in pyproject.toml', author: 'Stephen Rosen', url: 'https://peps.python.org/pep-0735/', note: 'Grupos de dependências fora do pacote publicado.' },
    { type: 'doc', title: 'What is new in Python 3.14', author: 'Python Software Foundation', url: 'https://docs.python.org/3/whatsnew/3.14.html', note: 'Free-threaded, template strings e anotações tardias.' },
    { type: 'portal', title: 'Real Python: Python Virtual Environments, a primer', author: 'Real Python', url: 'https://realpython.com/python-virtual-environments-a-primer/', note: 'Visão prática do que o venv faz.' },
    { type: 'video', title: 'Live de Python (canal)', author: 'Eduardo Mendes', url: 'https://www.youtube.com/@Dunossauro', note: 'Lives em português sobre ambiente, empacotamento e boas práticas.' }
  ]
};

window.LESSON_CONTENT['modelo-de-dados'] = {
  id: 'modelo-de-dados',
  title: 'Objetos, nomes e mutabilidade',
  etapa: 1, etapaName: 'Fundamentos da linguagem',
  time: '75 min',
  tags: ['objetos', 'referências', 'mutabilidade', 'cópia'],
  tagline: 'Em Python variáveis não guardam valores: são <em>nomes</em> presos a objetos. Quase todo bug de aliasing nasce de esquecer isso.',
  intro: `<p>Em C, <code>int x = 3</code> reserva uma caixa chamada x e coloca 3 nela. Em Python, <code>x = 3</code> cria (ou reaproveita) um objeto <code>int</code> com valor 3 e amarra o nome <code>x</code> a ele. Atribuir é <em>ligar um nome</em>, nunca copiar dados. Essa única ideia explica listas que mudam "sozinhas", defaults mutáveis, cópias que não copiam e a diferença entre <code>is</code> e <code>==</code>.</p>
<p>Todo objeto tem três coisas: identidade (nunca muda durante a vida do objeto), tipo (define o comportamento) e valor (que pode ou não mudar, o que separa mutáveis de imutáveis). Entender os três, mais a contagem de referências e o coletor de ciclos, é o que separa quem usa Python de quem prevê o que ele fará.</p>
<p>Em entrevista sênior este é o assunto onde mais se erra por intuição: "o que imprime este código?" com aliasing, <code>+=</code> em tupla com lista dentro, ou cópia rasa de estrutura aninhada. Aqui vai o mecanismo, para você deduzir a resposta em vez de decorar.</p>`,
  sections: [
    {
      id: 'tres-atributos',
      title: 'Identidade, tipo e valor',
      body: `<p>No CPython, a identidade devolvida por <code>id(obj)</code> é o endereço de memória do objeto (detalhe de implementação: em outras implementações é só um número único). O operador <code>is</code> compara identidades, <code>==</code> chama <code>__eq__</code> e compara valores. <code>type(obj)</code> devolve a classe, e o comportamento todo vem dela.</p>
<pre><code class="language-python">a = [1, 2, 3]
b = a               # b é outro NOME para o mesmo objeto
c = [1, 2, 3]       # objeto novo, valor igual

print(a is b, a == b)   # True True
print(a is c, a == c)   # False True
print(id(a) == id(b))   # True

b.append(4)
print(a)                # [1, 2, 3, 4]  (a "mudou" porque é o mesmo objeto)

# None, True e False são singletons: use is
x = None
print(x is None)        # idiomático
print(type(x), type(1), type(int))   # &lt;class 'NoneType'&gt; &lt;class 'int'&gt; &lt;class 'type'&gt;</code></pre>
<p>Tudo é objeto: inteiros, funções, módulos, classes. Classes são instâncias de <code>type</code> (a metaclasse padrão), e funções são objetos que você pode passar, guardar em dict e atribuir atributos. Por isso decorators e injeção de dependência funcionam sem cerimônia.</p>
<div class="callout warn"><strong>PEGADINHA</strong> Use <code>is</code> só para singletons (<code>None</code>, <code>True</code>, <code>False</code>, <code>...</code>, sentinelas). Comparar números ou strings com <code>is</code> "funciona" às vezes por causa de otimização, e quebra sem aviso. Desde o 3.8 o compilador emite <code>SyntaxWarning</code> para <code>x is 3</code>.</div>`
    },
    {
      id: 'nomes-referencias',
      title: 'Nomes, referências e contagem de referências',
      body: `<p>O namespace de um módulo ou função é, por baixo, um dicionário de nomes para objetos. O CPython mantém em cada objeto um contador de referências (<code>ob_refcnt</code>): atribuir, passar como argumento ou colocar em contêiner incrementa; sair de escopo ou <code>del</code> decrementa. Chegou a zero, o objeto é liberado imediatamente (por isso <code>__del__</code> e arquivos abertos costumam ser fechados cedo em CPython, comportamento que <em>não</em> é garantido pela linguagem).</p>
<pre><code class="language-python">import sys, gc, weakref

class No:
    def __init__(self, nome):
        self.nome = nome
        self.outro = None

x = No("x")
print(sys.getrefcount(x))   # 2: o nome x mais o argumento temporário do getrefcount

y = x
print(sys.getrefcount(x))   # 3
del y
print(sys.getrefcount(x))   # 2

# ciclo: refcount nunca chega a zero, quem limpa é o coletor de ciclos
a, b = No("a"), No("b")
a.outro, b.outro = b, a
ref = weakref.ref(a)        # referência fraca não conta
del a, b
print(ref() is not None)    # True: ainda vivo, preso pelo ciclo
gc.collect()
print(ref() is None)        # True: coletor de ciclos liberou</code></pre>
<p>Além do refcount há o coletor de lixo geracional (módulo <code>gc</code>) que detecta ciclos entre objetos contêiner. No 3.13 ele continuou geracional (uma tentativa de coletor incremental foi revertida antes do lançamento). Em builds free-threaded o refcount usa técnicas especiais (contagem enviesada e imortalização), detalhe que importa só se você mexe em extensões C.</p>
<p><code>weakref</code> serve para caches e observadores que não devem manter o objeto vivo. <code>WeakValueDictionary</code> é a forma clássica de cache de instâncias.</p>`
    },
    {
      id: 'mutaveis-imutaveis',
      title: 'Mutável versus imutável',
      body: `<p>Imutáveis (<code>int</code>, <code>float</code>, <code>str</code>, <code>bytes</code>, <code>tuple</code>, <code>frozenset</code>, <code>bool</code>, <code>None</code>) não mudam de valor depois de criados. Qualquer "modificação" cria objeto novo e religa o nome. Mutáveis (<code>list</code>, <code>dict</code>, <code>set</code>, <code>bytearray</code>, instâncias de classes comuns) mudam no lugar, e todo mundo que tem referência vê a mudança.</p>
<p>O ponto fino: imutabilidade da <code>tuple</code> é <em>superficial</em>. A tupla garante quais objetos ela referencia, não o estado deles.</p>
<pre><code class="language-python">t = (1, [10, 20])
t[1].append(30)         # ok: mutou a lista, a tupla continua apontando para a mesma lista
print(t)                # (1, [10, 20, 30])

# o clássico: += em item de tupla com lista
t = (1, [10, 20])
try:
    t[1] += [30]        # list.__iadd__ muda a lista, depois o setitem na tupla falha
except TypeError as e:
    print("erro:", e)
print(t)                # (1, [10, 20, 30])  (mudou mesmo com a exceção)

# hash: tupla com mutável não é hasheável
try:
    hash((1, [2]))
except TypeError as e:
    print(e)            # unhashable type: 'list'</code></pre>
<p>Esse caso do <code>+=</code> é pergunta recorrente: a operação executa <code>t[1].__iadd__([30])</code> (sucesso, muta a lista) e em seguida <code>t[1] = resultado</code> (falha, tupla não aceita atribuição). As duas coisas acontecem, e o estado fica alterado.</p>
<p>Para strings, <code>s += "x"</code> em loop cria uma string nova por iteração. O CPython tem uma otimização local que às vezes a torna linear, mas ela não é garantida; o idioma portável é acumular numa lista e usar <code>"".join(partes)</code>.</p>
<div class="callout"><strong>NA ENTREVISTA</strong> "Por que dict e set exigem chaves imutáveis?" Porque a posição na tabela hash depende de <code>hash(chave)</code>; se o valor mudar depois da inserção, o hash muda e o item fica inalcançável. Contrato: objetos iguais devem ter o mesmo hash, e o hash não pode mudar durante a vida do objeto.</div>`
    },
    {
      id: 'interning',
      title: 'Cache de inteiros, interning e por que is engana',
      body: `<p>O CPython pré-aloca os inteiros de -5 a 256 e reutiliza esses objetos. Strings que parecem identificadores (letras, dígitos e underscore) costumam ser internadas pelo compilador. O compilador também dobra constantes e pode compartilhar o mesmo objeto para literais iguais dentro de uma unidade de compilação. Nada disso é contrato da linguagem.</p>
<pre><code class="language-python">a = 256
b = 256
print(a is b)           # True no CPython (cache de pequenos inteiros)

a = int("1000")
b = int("1000")
print(a is b)           # False: objetos distintos
print(a == b)           # True

import sys
s1 = "python_rocks"
s2 = "python_rocks"
print(s1 is s2)         # True (literal de identificador, internado)

s3 = "".join(["pyt", "hon_rocks"])
print(s3 == "python_rocks", s3 is "python_rocks")   # True False (e SyntaxWarning)
print(sys.intern(s3) is sys.intern("python_rocks")) # True: intern explícito</code></pre>
<p><code>sys.intern</code> tem uso real: em parsers que geram milhões de strings repetidas (nomes de colunas, chaves JSON), internar economiza memória e acelera comparação, porque <code>is</code> vira checagem de ponteiro. Mas meça: só vale com muita repetição.</p>
<div class="callout warn"><strong>PEGADINHA</strong> No 3.12 os objetos imortais (PEP 683) fixam refcount de alguns objetos comuns, e no 3.13 e 3.14 o conjunto interno muda. Código que testa <code>is</code> em inteiros ou strings quebra entre versões. Se você escreveu um teste assim, ele estava errado.</div>`
    },
    {
      id: 'passagem-argumentos',
      title: 'Passagem de argumentos: por referência de objeto',
      body: `<p>Python não é "por valor" nem "por referência" no sentido de C++. É <em>passagem por atribuição</em> (às vezes chamada de call by object reference): o parâmetro é um novo nome ligado ao mesmo objeto que o chamador passou. Mutar o objeto é visível fora; religar o nome não é.</p>
<pre><code class="language-python">def muta(lst):
    lst.append(99)       # muta o objeto compartilhado: o chamador vê

def religa(lst):
    lst = [0]            # só religa o nome local: o chamador não vê
    return lst

dados = [1, 2]
muta(dados)
print(dados)             # [1, 2, 99]
religa(dados)
print(dados)             # [1, 2, 99]

def incrementa(n):
    n += 1               # int é imutável: cria objeto novo e religa o nome local
    return n

x = 10
incrementa(x)
print(x)                 # 10</code></pre>
<p>Regra de desenho que sai disso: uma função que recebe um mutável ou o muta e documenta isso (e idealmente retorna <code>None</code>, como <code>list.sort</code>), ou não o toca e devolve um novo (como <code>sorted</code>). Misturar os dois estilos é fonte de bugs. A mesma lógica aplica ao <code>self</code> em métodos e a atributos de classe mutáveis compartilhados entre instâncias.</p>
<pre><code class="language-python">class Carrinho:
    itens = []                       # atributo de CLASSE: compartilhado por todas as instâncias

    def adiciona(self, x):
        self.itens.append(x)

a, b = Carrinho(), Carrinho()
a.adiciona("pão")
print(b.itens)                       # ['pão']  surpresa

class CarrinhoOk:
    def __init__(self):
        self.itens = []              # atributo de INSTÂNCIA: um por objeto</code></pre>`
    },
    {
      id: 'copia',
      title: 'Cópia rasa, cópia profunda e aliasing em estruturas aninhadas',
      body: `<p>Copiar um contêiner pode significar duas coisas. A cópia <em>rasa</em> (<code>lst.copy()</code>, <code>lst[:]</code>, <code>list(lst)</code>, <code>copy.copy</code>) cria um contêiner novo cujos elementos são as mesmas referências. A cópia <em>profunda</em> (<code>copy.deepcopy</code>) copia recursivamente, usando um memo para tratar ciclos e referências compartilhadas.</p>
<pre><code class="language-python">import copy

original = [[1, 2], [3, 4]]
rasa = original.copy()
funda = copy.deepcopy(original)

original[0].append(99)
print(rasa)    # [[1, 2, 99], [3, 4]]   (as sublistas são as mesmas)
print(funda)   # [[1, 2], [3, 4]]       (independente)

# a armadilha clássica de matriz
matriz = [[0] * 3] * 3          # três referências para a MESMA linha
matriz[0][0] = 1
print(matriz)                   # [[1, 0, 0], [1, 0, 0], [1, 0, 0]]

certa = [[0] * 3 for _ in range(3)]   # uma linha nova por iteração
certa[0][0] = 1
print(certa)                    # [[1, 0, 0], [0, 0, 0], [0, 0, 0]]

# dict.fromkeys com valor mutável tem o mesmo problema
d = dict.fromkeys("ab", [])
d["a"].append(1)
print(d)                        # {'a': [1], 'b': [1]}</code></pre>
<p><code>deepcopy</code> respeita <code>__copy__</code>, <code>__deepcopy__</code> e <code>__reduce_ex__</code>, é lento (percorre tudo em Python puro) e pode copiar mais do que você quer (conexões, locks). Para dados de configuração simples, <code>dataclasses.replace</code> ou construir uma estrutura nova explicitamente costuma ser mais claro. Para dados imutáveis (<code>tuple</code> de imutáveis, <code>frozenset</code>, dataclasses <code>frozen=True</code>), não é preciso copiar nunca.</p>
<div class="callout tip"><strong>DICA</strong> Quando precisar de "valor" com semântica segura, prefira estruturas imutáveis e crie versões novas com <code>dataclasses.replace(obj, campo=novo)</code>. Aliasing deixa de ser problema porque ninguém muta.</div>`
    },
    {
      id: 'default-mutavel',
      title: 'Default mutável e a ligação em tempo de definição',
      body: `<p>O valor default de um parâmetro é avaliado <strong>uma vez</strong>, quando o <code>def</code> executa, e guardado em <code>func.__defaults__</code>. Se for um mutável, todas as chamadas que usam o default compartilham o mesmo objeto. É a consequência direta de "tudo é objeto e nomes são referências".</p>
<pre><code class="language-python">def acumula(x, destino=[]):          # BUG
    destino.append(x)
    return destino

print(acumula(1))    # [1]
print(acumula(2))    # [1, 2]   o default acumulou
print(acumula.__defaults__)      # ([1, 2],)

_SENTINELA = object()

def acumula_ok(x, destino=None):     # idioma padrão
    if destino is None:
        destino = []
    destino.append(x)
    return destino

def acumula_com_none_valido(x, destino=_SENTINELA):   # quando None é valor legítimo
    if destino is _SENTINELA:
        destino = []
    destino.append(x)
    return destino</code></pre>
<p>Dataclasses proíbem default mutável direto (levantam <code>ValueError</code>) e exigem <code>field(default_factory=list)</code>, justamente para evitar esse bug. O mesmo vale para o argumento default de <code>Pydantic</code> e similares, que copiam o default por segurança.</p>
<p>Uso legítimo do comportamento: memoização artesanal com default mutável. Funciona, mas é obscuro; <code>functools.cache</code> diz a mesma coisa de forma explícita.</p>`
    }
  ],
  whenToUse: [
    'is apenas para None, True, False e sentinelas; == para valores',
    'Cópia profunda quando a estrutura é aninhada e o chamador não pode ser afetado (e o custo é aceitável)',
    'Estruturas imutáveis (tuple, frozenset, dataclass frozen) para valores que circulam entre módulos',
    'default None ou default_factory para parâmetros e campos mutáveis',
    'weakref em caches e observadores que não devem manter objetos vivos'
  ],
  whenNot: [
    'Não compare inteiros ou strings com is: depende de otimização e quebra entre versões',
    'Não use [[0]*n]*m para criar matrizes: as linhas são o mesmo objeto',
    'Não use deepcopy por reflexo: é lento e copia recursos que não deveriam ser copiados',
    'Não coloque lista, dict ou set como default de parâmetro',
    'Não use atributo de classe mutável esperando semântica de instância'
  ],
  metrics: [
    'id(), is, sys.getrefcount(), sys.getsizeof(): inspeção de identidade e custo',
    'gc.get_stats(), gc.collect(), gc.get_referrers(): diagnóstico de ciclos e vazamentos',
    'tracemalloc: onde a memória está sendo alocada',
    'objgraph e pympler (terceiros): grafo de referências e tamanho profundo',
    'ruff B006 e B008: detecta default mutável e chamada em default',
    'pythontutor.com: visualiza nomes e objetos passo a passo'
  ],
  refs: [
    { type: 'livro', title: 'Fluent Python, 2ª edição (cap. 6: Object References, Mutability, and Recycling)', author: 'Luciano Ramalho', url: 'https://www.oreilly.com/library/view/fluent-python-2nd/9781492056348/', note: 'O melhor tratamento de identidade, aliasing e cópia. Em português: Python Fluente, Novatec.' },
    { type: 'doc', title: 'The Python Language Reference: Data model', author: 'Python Software Foundation', url: 'https://docs.python.org/3/reference/datamodel.html', note: 'Definição oficial de identidade, tipo e valor.' },
    { type: 'doc', title: 'copy: shallow and deep copy operations', author: 'Python Software Foundation', url: 'https://docs.python.org/3/library/copy.html', note: 'Semântica de copy e deepcopy, incluindo memo e hooks.' },
    { type: 'doc', title: 'gc: Garbage Collector interface', author: 'Python Software Foundation', url: 'https://docs.python.org/3/library/gc.html', note: 'Como o coletor de ciclos funciona e como inspecioná-lo.' },
    { type: 'doc', title: 'PEP 683: Immortal Objects', author: 'Eric Snow, Eddie Elizondo', url: 'https://peps.python.org/pep-0683/', note: 'Por que is em inteiros e strings é frágil.' },
    { type: 'artigo', title: 'Facts and Myths about Python names and values', author: 'Ned Batchelder', url: 'https://nedbatchelder.com/text/names.html', note: 'Explicação clássica de nomes ligados a valores.' },
    { type: 'portal', title: 'Python Tutor', author: 'Philip Guo', url: 'https://pythontutor.com/', note: 'Visualizador de nomes e objetos na memória.' },
    { type: 'video', title: 'Live de Python (canal)', author: 'Eduardo Mendes', url: 'https://www.youtube.com/@Dunossauro', note: 'Aulas em português sobre modelo de dados e armadilhas.' }
  ]
};

window.LESSON_CONTENT['tipos-builtin'] = {
  id: 'tipos-builtin',
  title: 'Números, strings e bytes',
  etapa: 1, etapaName: 'Fundamentos da linguagem',
  time: '60 min',
  tags: ['int', 'float', 'Decimal', 'Unicode'],
  tagline: 'Dinheiro não é <em>float</em>, texto não é bytes. Dois erros de tipo que viram incidente em produção.',
  intro: `<p>Os tipos básicos escondem decisões de projeto que mordem em produção: <code>int</code> sem limite (ótimo para criptografia, ruim para cálculo numérico em larga escala), <code>float</code> binário IEEE 754 que não representa 0.1, e strings Unicode que não são bytes. Misturar o que cada um modela produz cobrança errada, arquivo corrompido e <code>UnicodeDecodeError</code> às três da manhã.</p>
<p>Esta lição cobre a representação, os limites e as ferramentas certas: <code>Decimal</code> e <code>Fraction</code> para exatidão, <code>math.isclose</code> para comparar floats, <code>str</code> como sequência de code points, <code>bytes</code> e encodings, normalização Unicode e o mini-idioma de formatação das f-strings.</p>`,
  sections: [
    {
      id: 'int',
      title: 'int de precisão arbitrária',
      body: `<p>O <code>int</code> do Python 3 não tem teto: é uma estrutura variável com dígitos em base 2<sup>30</sup> (em plataformas de 64 bits). Somar, multiplicar e potenciar nunca estouram, o custo cresce com o número de dígitos (multiplicação é Karatsuba acima de certo tamanho). Por isso <code>2**1000</code> é trivial, e por isso loops numéricos em Python puro são lentos: cada soma é uma chamada sobre objeto alocado, não uma instrução de CPU.</p>
<pre><code class="language-python">import sys

print(2 ** 100)                      # 1267650600228229401496703205376
print(sys.getsizeof(0), sys.getsizeof(2 ** 30), sys.getsizeof(2 ** 100))   # cresce com os dígitos

# pow com módulo é eficiente (exponenciação modular), base de RSA
print(pow(7, 10**18, 1_000_000_007))

# divisão: / sempre devolve float, // piso, % tem o sinal do divisor
print(7 / 2, 7 // 2, -7 // 2, -7 % 3, divmod(-7, 3))   # 3.5 3 -4 2 (-3, 2)

# limite de conversão int &lt;-&gt; str (defesa contra DoS, desde o 3.11)
try:
    int("9" * 5000)
except ValueError as e:
    print(e)                         # excede o limite de 4300 dígitos
# sys.set_int_max_str_digits(0) remove, só faça com entrada confiável

print(int("ff", 16), bin(10), hex(255), (255).to_bytes(2, "big"), int.from_bytes(b"\\x01\\x00", "big"))</code></pre>
<div class="callout warn"><strong>PEGADINHA</strong> <code>//</code> é divisão de piso, não truncamento: <code>-7 // 2 == -4</code>. Para truncar em direção a zero use <code>int(-7 / 2)</code> (com cuidado com float) ou <code>math.trunc</code>. E <code>round()</code> usa arredondamento bancário (para o par): <code>round(0.5) == 0</code>, <code>round(2.5) == 2</code>.</div>`
    },
    {
      id: 'float',
      title: 'float e IEEE 754',
      body: `<p>O <code>float</code> é um double de 64 bits: 1 bit de sinal, 11 de expoente e 52 de mantissa, o que dá cerca de 15 a 17 dígitos decimais significativos. Frações como 0.1 não têm representação binária finita, então o valor armazenado é a aproximação mais próxima. Isso não é bug do Python, é a matemática do formato, igual em C, Java e JavaScript.</p>
<pre><code class="language-python">import math
from decimal import Decimal

print(0.1 + 0.2)                      # 0.30000000000000004
print(0.1 + 0.2 == 0.3)               # False
print(Decimal(0.1))                   # 0.1000000000000000055511151231257827...  (o valor real armazenado)
print(math.isclose(0.1 + 0.2, 0.3))   # True: comparar com tolerância relativa (rel_tol=1e-09)
print(math.isclose(1e-12, 0.0, abs_tol=1e-9))   # perto de zero, use abs_tol

# valores especiais
inf, nan = float("inf"), float("nan")
print(nan == nan, nan != nan, math.isnan(nan))   # False True True
print(inf + 1, -inf, 1e308 * 10)                 # inf -inf inf

# perda de precisão em somas longas
valores = [0.1] * 10
print(sum(valores), math.fsum(valores))          # 0.9999999999999999 1.0
print(float(2**53) + 1 == float(2**53))          # True: acima de 2**53 inteiros deixam de ser exatos</code></pre>
<p>Regras práticas: nunca compare floats com <code>==</code> (use <code>math.isclose</code>); use <code>math.fsum</code> para somas sensíveis (algoritmo de Shewchuk); cuidado com cancelamento catastrófico ao subtrair números próximos; em ML e computação científica a escolha de float32 versus float64 é decisão de memória e precisão (NumPy cobre isso na Etapa 6).</p>
<div class="callout"><strong>NA ENTREVISTA</strong> "Por que 0.1 + 0.2 != 0.3?" Mostre <code>Decimal(0.1)</code>, explique mantissa de 52 bits e base 2, e diga que a solução depende do domínio: tolerância (<code>isclose</code>) para ciência, <code>Decimal</code> ou inteiros em centavos para dinheiro.</div>`
    },
    {
      id: 'decimal-fraction',
      title: 'Decimal, Fraction e dinheiro',
      body: `<p>Para valores monetários há duas estratégias legítimas: <code>int</code> em menor unidade (centavos), simples e rápido, ou <code>Decimal</code>, que usa aritmética decimal com precisão e modo de arredondamento configuráveis (módulo <code>decimal</code>, implementação em C desde o 3.3). <code>Fraction</code> faz racionais exatos, útil para provas e geometria, raro em finanças.</p>
<pre><code class="language-python">from decimal import Decimal, ROUND_HALF_UP, getcontext, localcontext
from fractions import Fraction

# SEMPRE construa Decimal a partir de string (ou int), nunca de float
print(Decimal("0.1") + Decimal("0.2"))        # 0.3
print(Decimal(0.1) + Decimal(0.2))            # lixo binário herdado do float

preco = Decimal("19.99")
qtd = 3
total = preco * qtd                            # 59.97
imposto = (total * Decimal("0.0725")).quantize(Decimal("0.01"), rounding=ROUND_HALF_UP)
print(total, imposto)

print(getcontext().prec)                       # 28 dígitos significativos por padrão
with localcontext() as ctx:
    ctx.prec = 6
    print(Decimal(1) / Decimal(7))             # 0.142857

print(Fraction(1, 3) + Fraction(1, 6))         # 1/2
print(Fraction("0.1"))                         # 1/10  (exato)

# centavos como int: simples e sem surpresas
total_centavos = 1999 * 3
print(f"R$ {total_centavos // 100},{total_centavos % 100:02d}")</code></pre>
<p>O contexto do <code>decimal</code> é por thread (ou por task, via <code>contextvars</code>), o que importa em servidores assíncronos. Misturar <code>Decimal</code> e <code>float</code> em operação levanta <code>TypeError</code>, o que é bom: força a decisão. Em bancos de dados use <code>NUMERIC</code> e mapeie para <code>Decimal</code>.</p>
<div class="callout warn"><strong>PEGADINHA</strong> <code>Decimal("1.10") == Decimal("1.1")</code> é <code>True</code> mas as representações diferem em expoente, o que aparece em serialização. Normalize com <code>quantize</code> antes de gravar ou comparar strings.</div>`
    },
    {
      id: 'str-unicode',
      title: 'str é texto: code points, não bytes',
      body: `<p>Uma <code>str</code> é uma sequência imutável de <em>code points</em> Unicode. Internamente (PEP 393) o CPython escolhe 1, 2 ou 4 bytes por caractere conforme o maior code point da string, então uma string só ASCII ocupa 1 byte por caractere e uma com um emoji passa a ocupar 4 por caractere. O comprimento é o número de code points, não de "letras que o usuário vê".</p>
<pre><code class="language-python">import unicodedata

s = "café"
print(len(s), [hex(ord(c)) for c in s])        # 4 ['0x63', '0x61', '0x66', '0xe9']

# o mesmo "é" pode ser 1 code point (NFC) ou 2 (e + acento combinante, NFD)
nfc = "caf\\u00e9"
nfd = "cafe\\u0301"
print(nfc == nfd, len(nfc), len(nfd))          # False 4 5
print(unicodedata.normalize("NFC", nfd) == nfc)   # True

# comparação sem diferenciar maiúsculas: casefold, não lower
print("Straße".lower() == "STRASSE".lower())        # False
print("Straße".casefold() == "STRASSE".casefold())  # True

# o que o usuário vê como um caractere pode ser vários code points
bandeira = "\\U0001F1E7\\U0001F1F7"               # indicadores regionais B + R
print(len(bandeira))                              # 2 (um glifo, dois code points)

print(unicodedata.name("é"), unicodedata.category("é"))   # LATIN SMALL LETTER E WITH ACUTE Ll
print(s.upper(), s.title(), s.center(10, "*"), s.partition("f"))</code></pre>
<p>Para busca, deduplicação e comparação de nomes digitados por humanos, normalize (NFC ou NFKC conforme o caso) e use <code>casefold</code>. Para contar "caracteres percebidos" (grafemas) a stdlib não basta: use a biblioteca <code>regex</code> com <code>\\X</code> ou <code>grapheme</code>.</p>
<div class="callout tip"><strong>DICA</strong> Métodos úteis e subestimados: <code>str.removeprefix</code>/<code>removesuffix</code> (3.9), <code>str.isidentifier</code>, <code>str.translate</code> com <code>str.maketrans</code> para limpeza em lote, e <code>textwrap.dedent</code> para strings multilinha limpas.</div>`
    },
    {
      id: 'bytes-encoding',
      title: 'bytes, encodings e a fronteira do programa',
      body: `<p><code>bytes</code> é sequência imutável de inteiros de 0 a 255; <code>bytearray</code> é a versão mutável; <code>memoryview</code> dá fatias sem copiar. A conversão entre texto e bytes é sempre explícita: <code>str.encode(codec)</code> e <code>bytes.decode(codec)</code>. A regra de engenharia é o "sanduíche Unicode": decodifique na entrada, trabalhe só com <code>str</code> no miolo, codifique na saída.</p>
<pre><code class="language-python">texto = "ação"
utf8 = texto.encode("utf-8")
print(utf8, len(utf8))                    # b'a\\xc3\\xa7\\xc3\\xa3o' 6
print(texto.encode("latin-1"))            # b'a\\xe7\\xe3o'  (1 byte por letra, só 256 símbolos)

try:
    utf8.decode("ascii")
except UnicodeDecodeError as e:
    print("erro:", e.reason)

print(utf8.decode("latin-1"))             # 'aÃ§Ã£o'  (mojibake: decodificou com codec errado)
print(utf8.decode("utf-8", errors="replace"))
print("ação".encode("ascii", errors="ignore"))   # b'ao'  (perde dados em silêncio, evite)

# arquivos: SEMPRE declare o encoding
from pathlib import Path
p = Path("amostra.txt")
p.write_text("coração\\n", encoding="utf-8")
print(p.read_text(encoding="utf-8"))

ba = bytearray(b"abc")
ba[0] = 65
mv = memoryview(ba)[1:]
mv[0] = 66
print(ba)                                 # bytearray(b'ABc')  (memoryview compartilha o buffer)</code></pre>
<p>UTF-8 é o encoding padrão do código-fonte e, com o PEP 686, o UTF-8 Mode passa a ser o padrão a partir do Python 3.15, então <code>open()</code> sem <code>encoding</code> usa UTF-8 em todas as plataformas. Em versões anteriores, no Windows, esse padrão ainda depende do locale. Como código de produção costuma rodar em mais de uma versão, declare <code>encoding</code> sempre. Nas versões antigas, o modo UTF-8 (<code>python -X utf8</code> ou <code>PYTHONUTF8=1</code>) antecipa o comportamento novo.</p>
<div class="callout"><strong>NA ENTREVISTA</strong> "O que é mojibake e como evitar?" Decodificar bytes com o codec errado. Evite com encoding explícito em toda fronteira de I/O, e use <code>errors="strict"</code> como padrão para falhar cedo. Para detecção de encoding desconhecido, a biblioteca <code>charset-normalizer</code>.</div>`
    },
    {
      id: 'fstrings',
      title: 'f-strings, format spec e t-strings',
      body: `<p>As f-strings (PEP 498) avaliam expressões em tempo de execução dentro do literal e são a forma preferida de formatar. O mini-idioma depois dos dois pontos é o mesmo de <code>format()</code>: largura, alinhamento, sinal, separador de milhar, precisão e tipo. O PEP 701 (3.12) removeu restrições antigas: agora se pode reutilizar o mesmo tipo de aspas e aninhar f-strings.</p>
<pre><code class="language-python">nome, preco, taxa = "Ana", 1234567.891, 0.0725
n = 42

print(f"{nome:&gt;10}|{nome:&lt;10}|{nome:^10}|")        # alinhamento
print(f"{preco:,.2f}")                               # 1,234,567.89
print(f"{preco:_.1f}")                               # 1_234_567.9
print(f"{taxa:.2%}")                                 # 7.25%
print(f"{n:05d} {n:x} {n:#b} {n:e}")                 # 00042 2a 0b101010 4.200000e+01
print(f"{n = }  {nome!r}  {nome!s:&gt;6}")              # n = 42  'Ana'    Ana  (depuração)
print(f"{'a' + 'b'!r:&gt;8}")                           # expressão e conversão

largura, prec = 12, 3
print(f"{3.14159265:{largura}.{prec}f}")             # spec dinâmico

import datetime as dt
print(f"{dt.datetime(2026, 11, 13, 9, 30):%d/%m/%Y %H:%M}")   # 13/11/2026 09:30

# log: não use f-string em logging, deixe o logger formatar só se o nível estiver ativo
import logging
logging.getLogger(__name__).info("usuario %s comprou %d itens", nome, n)</code></pre>
<p>No 3.14, o PEP 750 introduz <em>template strings</em> (<code>t"..."</code>): em vez de produzir uma <code>str</code>, o literal gera um objeto <code>Template</code> com as partes estáticas e as interpolações separadas, para que uma biblioteca possa sanitizar (SQL, HTML, shell) antes de montar o resultado. É a resposta estrutural à injeção que f-strings facilitam. Afirmo só o essencial: a API de <code>string.templatelib</code> é nova, consulte a documentação antes de depender dela.</p>
<div class="callout warn"><strong>PEGADINHA</strong> Nunca monte SQL, HTML ou comandos de shell com f-string e entrada do usuário. Use parâmetros do driver (<code>cursor.execute(sql, params)</code>), escape de template engine ou <code>subprocess</code> com lista de argumentos.</div>`
    }
  ],
  whenToUse: [
    'Decimal ou inteiro em centavos para qualquer valor monetário',
    'math.isclose e math.fsum para comparação e soma de floats',
    'unicodedata.normalize e casefold para comparar texto humano',
    'Encoding explícito em todo open(), socket e subprocesso',
    'f-strings para formatação; logging com parâmetros para mensagens de log'
  ],
  whenNot: [
    'Não use float para dinheiro nem compare floats com ==',
    'Não crie Decimal a partir de float: use string',
    'Não confie em len(str) como contagem de caracteres visíveis',
    'Não use errors="ignore" para esconder problema de encoding',
    'Não monte SQL, HTML ou shell com f-string e entrada externa'
  ],
  metrics: [
    'math.isclose, math.fsum, decimal.getcontext(): controle numérico',
    'sys.getsizeof e tracemalloc: custo de memória de ints e strings',
    'python -X utf8 e PYTHONUTF8=1: força UTF-8 de forma portável',
    'ruff e mypy: pegam mistura de str e bytes cedo',
    'unicodedata.normalize: teste de equivalência canônica',
    'hypothesis: testes de propriedade com texto e números arbitrários'
  ],
  refs: [
    { type: 'livro', title: 'Fluent Python, 2ª edição (cap. 4: Unicode Text Versus Bytes)', author: 'Luciano Ramalho', url: 'https://www.oreilly.com/library/view/fluent-python-2nd/9781492056348/', note: 'Referência para o sanduíche Unicode e normalização.' },
    { type: 'doc', title: 'Floating Point Arithmetic: Issues and Limitations', author: 'Python Software Foundation', url: 'https://docs.python.org/3/tutorial/floatingpoint.html', note: 'Explicação oficial do 0.1 + 0.2.' },
    { type: 'doc', title: 'decimal: Decimal fixed-point and floating-point arithmetic', author: 'Python Software Foundation', url: 'https://docs.python.org/3/library/decimal.html', note: 'Contexto, arredondamento e quantize.' },
    { type: 'doc', title: 'Unicode HOWTO', author: 'Python Software Foundation', url: 'https://docs.python.org/3/howto/unicode.html', note: 'Guia oficial de str, bytes e codecs.' },
    { type: 'doc', title: 'Format Specification Mini-Language', author: 'Python Software Foundation', url: 'https://docs.python.org/3/library/string.html#format-specification-mini-language', note: 'Tabela completa do que cabe depois dos dois pontos.' },
    { type: 'doc', title: 'PEP 750: Template Strings', author: 'Jim Baker et al.', url: 'https://peps.python.org/pep-0750/', note: 'Motivação e semântica das t-strings (3.14).' },
    { type: 'doc', title: 'PEP 393: Flexible String Representation', author: 'Martin von Loewis', url: 'https://peps.python.org/pep-0393/', note: 'Como o CPython armazena str.' },
    { type: 'artigo', title: 'The Absolute Minimum Every Software Developer Must Know About Unicode', author: 'Joel Spolsky', url: 'https://www.joelonsoftware.com/2003/10/08/the-absolute-minimum-every-software-developer-absolutely-positively-must-know-about-unicode-and-character-sets-no-excuses/', note: 'Clássico para formar a intuição.' },
    { type: 'artigo', title: 'What Every Computer Scientist Should Know About Floating-Point Arithmetic', author: 'David Goldberg', url: 'https://docs.oracle.com/cd/E19957-01/806-3568/ncg_goldberg.html', note: 'Texto fundamental sobre IEEE 754.' }
  ]
};

window.LESSON_CONTENT['colecoes'] = {
  id: 'colecoes',
  title: 'Coleções e complexidade',
  etapa: 1, etapaName: 'Fundamentos da linguagem',
  time: '75 min',
  tags: ['list', 'dict', 'set', 'Big-O'],
  tagline: 'Escolher a coleção certa é escolher a <em>complexidade</em> certa. A diferença entre O(1) e O(n) vira minutos num loop de um milhão de itens.',
  intro: `<p>Quase todo ganho de performance em Python de aplicação vem de trocar uma estrutura de dados, não de reescrever em C. Uma busca <code>x in lista</code> dentro de um loop é O(n) por iteração; trocar a lista por um <code>set</code> a torna O(1) em média e transforma uma tarde de profiling numa linha de código.</p>
<p>Para decidir com segurança é preciso saber como cada estrutura é construída por dentro: <code>list</code> é um array dinâmico de ponteiros, <code>dict</code> é uma tabela hash com endereçamento aberto e entradas compactas, <code>set</code> é uma tabela hash sem valores, <code>deque</code> é uma lista duplamente ligada de blocos. O custo de cada operação sai da estrutura, não é decoreba.</p>
<p>Em entrevistas sêniores a pergunta raramente é "qual o Big-O de append", e sim "por que <code>pop(0)</code> é lento, o que você usa no lugar, e como o dict garante ordem?". Esta lição responde com mecanismo e código para medir.</p>`,
  sections: [
    {
      id: 'list',
      title: 'list: array dinâmico de ponteiros',
      body: `<p>Uma <code>list</code> guarda um vetor contíguo de ponteiros para objetos, mais o tamanho e a capacidade alocada. Quando a capacidade esgota, o CPython realoca com sobre-alocação proporcional (cerca de 12,5% mais uma folga pequena), o que torna <code>append</code> O(1) <em>amortizado</em>: raramente caro, barato na média. Indexar é aritmética de ponteiro, O(1). Inserir ou remover no início desloca todos os elementos, O(n).</p>
<table><thead><tr><th>Operação</th><th>Custo</th><th>Observação</th></tr></thead><tbody>
<tr><td><code>lst[i]</code>, <code>lst[i] = x</code></td><td>O(1)</td><td>acesso por índice</td></tr>
<tr><td><code>append</code>, <code>pop()</code></td><td>O(1) amortizado</td><td>operações no fim</td></tr>
<tr><td><code>insert(0, x)</code>, <code>pop(0)</code>, <code>del lst[0]</code></td><td>O(n)</td><td>desloca tudo</td></tr>
<tr><td><code>x in lst</code>, <code>index</code>, <code>remove</code>, <code>count</code></td><td>O(n)</td><td>varredura linear com <code>==</code></td></tr>
<tr><td><code>lst[a:b]</code></td><td>O(b - a)</td><td>cópia rasa da fatia</td></tr>
<tr><td><code>sort()</code></td><td>O(n log n)</td><td>Timsort, estável, O(n) se já ordenada</td></tr>
<tr><td><code>extend(it)</code>, <code>+</code></td><td>O(k)</td><td>k é o tamanho do que entra</td></tr>
</tbody></table>
<pre><code class="language-python">import sys

lst, ultimo = [], -1
for i in range(40):
    lst.append(i)
    cap = sys.getsizeof(lst)          # bytes reservados (cresce em degraus, não a cada append)
    if cap != ultimo:
        print(f"len={len(lst):2d} bytes={cap}")
        ultimo = cap

# ordenação estável com chave: ordena por segundo critério depois pelo primeiro
pessoas = [("ana", 30), ("bia", 25), ("caio", 30)]
pessoas.sort(key=lambda p: p[0])
pessoas.sort(key=lambda p: p[1], reverse=True)
print(pessoas)    # [('ana', 30), ('caio', 30), ('bia', 25)]  (estabilidade preserva a ordem anterior)</code></pre>
<div class="callout warn"><strong>PEGADINHA</strong> Remover itens enquanto itera a mesma lista pula elementos, porque os índices se deslocam. Itere sobre uma cópia, construa uma lista nova com comprehension, ou itere de trás para frente.</div>`
    },
    {
      id: 'tuple-namedtuple',
      title: 'tuple, namedtuple e quando a posição é semântica',
      body: `<p>A <code>tuple</code> é um array imutável de tamanho fixo: ocupa menos memória que uma lista equivalente (sem capacidade extra), é hasheável quando todos os elementos são, e comunica "registro de tamanho fixo e heterogêneo" (uma coordenada, uma linha de CSV), enquanto a lista comunica "coleção homogênea de tamanho variável". Desempacotamento é o idioma natural.</p>
<pre><code class="language-python">from typing import NamedTuple
from collections import namedtuple

a, *meio, z = (1, 2, 3, 4, 5)
print(a, meio, z)                 # 1 [2, 3, 4] 5

x, y = 1, 2
x, y = y, x                       # troca sem temporário (empacota e desempacota uma tupla)

Ponto = namedtuple("Ponto", "x y")
class Ponto3D(NamedTuple):        # versão tipada, preferida
    x: float
    y: float
    z: float = 0.0

p = Ponto3D(1.0, 2.0)
print(p, p.x, p[1], p._replace(z=9.0), p._asdict())

# tuplas como chave composta de dict
grade = {(0, 0): "origem", (1, 2): "ponto"}
print(grade[(1, 2)])

import sys
print(sys.getsizeof((1, 2, 3)), sys.getsizeof([1, 2, 3]))   # tupla é menor</code></pre>
<p>Para registros com comportamento, validação ou mutabilidade controlada, use <code>dataclass</code> (Etapa 3). <code>NamedTuple</code> é ótimo para retornos leves de funções e para manter compatibilidade com código que desempacota por posição.</p>`
    },
    {
      id: 'dict',
      title: 'dict: tabela hash compacta e ordenada',
      body: `<p>Desde o 3.6 (garantido na linguagem a partir do 3.7) o <code>dict</code> preserva ordem de inserção. A implementação do CPython tem duas estruturas: um array esparso de <em>índices</em> (pequenos inteiros) indexado pelo hash, e um array denso de <em>entradas</em> (hash, chave, valor) em ordem de inserção. A busca calcula <code>hash(chave)</code>, usa os bits baixos para achar o slot no array de índices e, em caso de colisão, segue uma sequência de sondagem perturbada pelos bits altos do hash (endereçamento aberto). O fator de carga máximo é cerca de 2/3: ao passar disso, a tabela é realocada e reorganizada.</p>
<p>Consequências: busca, inserção e remoção são O(1) em média e O(n) no pior caso (muitas colisões, o que o hash aleatório de strings desde o 3.3 torna improvável contra ataques). Dicts de instâncias de classe compartilham as chaves entre objetos da mesma classe (PEP 412), o que economiza memória.</p>
<pre><code class="language-python">d = {"b": 2, "a": 1}
d["c"] = 3
print(list(d))                     # ['b', 'a', 'c']  ordem de inserção

# acesso seguro e padrões
print(d.get("z"), d.get("z", 0), d.setdefault("z", 26))
d |= {"a": 100}                    # merge in-place (3.9); o da direita vence
print({**d, "novo": 1})            # desempacotamento cria cópia

# remoção durante iteração: RuntimeError
try:
    for k in d:
        del d[k]
except RuntimeError as e:
    print(e)                       # dictionary changed size during iteration

# chave precisa ser hasheável
try:
    {[1, 2]: "x"}
except TypeError as e:
    print(e)

# views são dinâmicas e se comportam como conjuntos
a = {"x": 1, "y": 2}; b = {"y": 9, "z": 3}
print(a.keys() &amp; b.keys(), a.keys() - b.keys())   # {'y'} {'x'}

# ordenar por valor
print(dict(sorted(a.items(), key=lambda kv: kv[1], reverse=True)))</code></pre>
<p>O contrato do hash: se <code>a == b</code> então <code>hash(a) == hash(b)</code>, e o hash não pode mudar durante a vida do objeto. Ao definir <code>__eq__</code> numa classe, o Python zera <code>__hash__</code> (a instância deixa de ser hasheável) a menos que você defina ambos de forma consistente.</p>
<div class="callout"><strong>NA ENTREVISTA</strong> "Como o dict mantém a ordem e por que ficou mais barato em memória?" Array de índices esparso mais array de entradas denso e sequencial. Antes do 3.6 havia uma tabela só, esparsa, com entradas de 24 bytes em slots vazios, e a ordem era efeito colateral do hash.</div>`
    },
    {
      id: 'set',
      title: 'set e frozenset: pertinência e álgebra de conjuntos',
      body: `<p>O <code>set</code> é uma tabela hash que guarda só chaves, com a mesma sondagem do dict. Pertinência (<code>x in s</code>), adição e remoção são O(1) em média. Não tem ordem garantida. As operações de álgebra (<code>&amp;</code>, <code>|</code>, <code>-</code>, <code>^</code>) são O(len) do menor ou do maior conforme a operação, e substituem laços aninhados.</p>
<pre><code class="language-python">import timeit

dados_lista = list(range(100_000))
dados_set = set(dados_lista)
alvo = 99_999

t_lista = timeit.timeit(lambda: alvo in dados_lista, number=200)
t_set = timeit.timeit(lambda: alvo in dados_set, number=200)
print(f"lista {t_lista:.4f}s  set {t_set:.6f}s")   # diferença de várias ordens de grandeza

# álgebra de conjuntos no lugar de loops
a, b = {1, 2, 3, 4}, {3, 4, 5}
print(a &amp; b, a | b, a - b, a ^ b, a &lt;= b, a.isdisjoint({9}))

# deduplicar preservando ordem (set sozinho perde a ordem)
itens = ["b", "a", "b", "c", "a"]
print(list(dict.fromkeys(itens)))      # ['b', 'a', 'c']

# frozenset é hasheável: serve de chave e de elemento de set
grupos = {frozenset({"x", "y"}): "par"}
print(grupos[frozenset({"y", "x"})])</code></pre>
<div class="callout warn"><strong>PEGADINHA</strong> A ordem de iteração de um <code>set</code> de strings muda entre execuções, porque o hash de str é randomizado por processo (<code>PYTHONHASHSEED</code>). Nunca dependa dela, nem para serializar de forma determinística: ordene antes.</div>`
    },
    {
      id: 'collections',
      title: 'deque, Counter, defaultdict e companhia',
      body: `<p>O módulo <code>collections</code> cobre os casos em que as estruturas básicas têm o custo errado. A <code>deque</code> é uma lista duplamente ligada de blocos de 64 itens: <code>append</code>, <code>appendleft</code>, <code>pop</code> e <code>popleft</code> são O(1), e o <code>maxlen</code> descarta do lado oposto, ideal para janelas deslizantes. Indexar no meio é O(n). Não é thread-safe para sequências compostas, mas cada operação atômica individual é segura no CPython.</p>
<pre><code class="language-python">from collections import deque, Counter, defaultdict, ChainMap
import heapq, bisect

# fila FIFO: deque, não list.pop(0)
fila = deque()
fila.append("a"); fila.append("b")
print(fila.popleft())                  # 'a' em O(1)

janela = deque(maxlen=3)               # últimos 3 valores
for v in range(6):
    janela.append(v)
print(janela)                          # deque([3, 4, 5], maxlen=3)

# contagem
c = Counter("abracadabra")
print(c.most_common(2), c["z"])        # [('a', 5), ('b', 2)] 0

# agrupar sem testar chave
grupos = defaultdict(list)
for palavra in ["ana", "bia", "alice", "beto"]:
    grupos[palavra[0]].append(palavra)
print(dict(grupos))

# heap: menor elemento em O(1), push e pop em O(log n)
h = []
for x in [5, 1, 8, 3]:
    heapq.heappush(h, x)
print(heapq.heappop(h), heapq.nsmallest(2, h))

# bisect: busca binária em lista ordenada, O(log n)
notas = [60, 70, 80, 90]
print(bisect.bisect_right(notas, 85))  # 3
bisect.insort(notas, 75)               # insere mantendo ordem (a inserção ainda é O(n))

# ChainMap: camadas de configuração sem copiar
cfg = ChainMap({"debug": True}, {"debug": False, "porta": 80})
print(cfg["debug"], cfg["porta"])</code></pre>
<p>Outras úteis: <code>OrderedDict</code> (tem <code>move_to_end</code>, útil para LRU manual), <code>array.array</code> (números primitivos compactos), <code>queue.Queue</code> (thread-safe, com bloqueio) e <code>functools.lru_cache</code>. Para dados numéricos em massa, <code>list</code> de <code>float</code> gasta 8 bytes de ponteiro mais cerca de 24 bytes por objeto float: NumPy (Etapa 6) usa 8 bytes por valor, contíguos.</p>`
    },
    {
      id: 'escolha',
      title: 'Como escolher e como medir',
      body: `<p>Decida pela operação dominante, não pelo hábito.</p>
<ul>
<li><strong>Preciso de ordem e acesso por posição:</strong> <code>list</code>. Fila ou pilha nas duas pontas: <code>deque</code>.</li>
<li><strong>Preciso procurar por chave ou testar pertinência:</strong> <code>dict</code> ou <code>set</code>.</li>
<li><strong>Preciso do menor ou maior repetidamente:</strong> <code>heapq</code>. Lista ordenada com buscas: <code>bisect</code>.</li>
<li><strong>Registro pequeno e imutável:</strong> <code>tuple</code> ou <code>NamedTuple</code>.</li>
<li><strong>Muitos números homogêneos:</strong> <code>array</code> ou NumPy, não lista de objetos.</li>
</ul>
<p>Big-O é a primeira aproximação; constantes e localidade de cache importam. Para listas pequenas (dezenas de itens) a varredura linear pode vencer o hash. Por isso meça com <code>timeit</code> com dados realistas e rode mais de uma vez.</p>
<pre><code class="language-python">import timeit
from collections import deque

N = 50_000

def com_lista():
    q = list(range(N))
    while q:
        q.pop(0)            # O(n) cada: O(n^2) total

def com_deque():
    q = deque(range(N))
    while q:
        q.popleft()         # O(1) cada: O(n) total

for f in (com_lista, com_deque):
    print(f.__name__, min(timeit.repeat(f, number=1, repeat=3)))

# memória: tracemalloc mostra o custo real
import tracemalloc
tracemalloc.start()
cheio = {i: str(i) for i in range(100_000)}
atual, pico = tracemalloc.get_traced_memory()
print(f"{atual / 1e6:.1f} MB")
tracemalloc.stop()</code></pre>
<div class="callout"><strong>NA ENTREVISTA</strong> "Dado um log com 10 milhões de linhas, como contar IPs distintos e os 10 mais frequentes?" Streaming linha a linha com <code>Counter</code> e <code>most_common(10)</code> (que usa <code>heapq.nlargest</code>), e <code>set</code> para distintos. Se a memória não couber, discuta contagem aproximada (HyperLogLog, Count-Min Sketch) e particionamento por hash.</div>`
    }
  ],
  whenToUse: [
    'set ou dict para pertinência e busca por chave dentro de loops',
    'deque para filas FIFO e janelas deslizantes com maxlen',
    'defaultdict e Counter para agrupar e contar sem boilerplate',
    'heapq para top-k e filas de prioridade; bisect para busca em dados ordenados',
    'tuple e NamedTuple para registros pequenos, imutáveis e hasheáveis'
  ],
  whenNot: [
    'Não use list.pop(0) ou insert(0, x) em filas grandes',
    'Não use x in lista em loop: vira O(n^2)',
    'Não dependa da ordem de iteração de set',
    'Não use objetos mutáveis como chave de dict',
    'Não guarde milhões de floats em lista de objetos quando NumPy ou array cabem'
  ],
  metrics: [
    'timeit e pyperf: medição de microbenchmarks com repetição',
    'tracemalloc e sys.getsizeof: custo de memória',
    'cProfile e snakeviz: onde o tempo realmente vai',
    'ruff PERF: regras de performance (PERF401, PERF203)',
    'wiki.python.org TimeComplexity: tabela oficial de custos',
    'len(), contagem de colisões não é exposta: confie em hash bem distribuído'
  ],
  refs: [
    { type: 'livro', title: 'Fluent Python, 2ª edição (partes sobre sequences, dicts e sets)', author: 'Luciano Ramalho', url: 'https://www.oreilly.com/library/view/fluent-python-2nd/9781492056348/', note: 'Mecanismo interno do dict e do set, com medições.' },
    { type: 'doc', title: 'TimeComplexity (Python Wiki)', author: 'Python Wiki', url: 'https://wiki.python.org/moin/TimeComplexity', note: 'Tabela oficial de custos amortizados e de pior caso.' },
    { type: 'doc', title: 'collections: container datatypes', author: 'Python Software Foundation', url: 'https://docs.python.org/3/library/collections.html', note: 'deque, Counter, defaultdict, ChainMap.' },
    { type: 'doc', title: 'Data Structures (tutorial)', author: 'Python Software Foundation', url: 'https://docs.python.org/3/tutorial/datastructures.html', note: 'Visão geral das estruturas embutidas.' },
    { type: 'doc', title: 'PEP 412: Key-Sharing Dictionary', author: 'Mark Shannon', url: 'https://peps.python.org/pep-0412/', note: 'Por que instâncias gastam menos memória.' },
    { type: 'video', title: 'Modern Python Dictionaries: A confluence of a dozen great ideas', author: 'Raymond Hettinger', url: 'https://www.youtube.com/watch?v=npw4s1QTmPg', note: 'Palestra clássica sobre o dict compacto.' },
    { type: 'doc', title: 'heapq e bisect', author: 'Python Software Foundation', url: 'https://docs.python.org/3/library/heapq.html', note: 'Heaps e busca binária na stdlib.' },
    { type: 'portal', title: 'Real Python: Python Dictionaries', author: 'Real Python', url: 'https://realpython.com/python-dicts/', note: 'Guia prático com exemplos.' }
  ]
};

window.LESSON_CONTENT['controle-funcoes'] = {
  id: 'controle-funcoes',
  title: 'Controle de fluxo e funções',
  etapa: 1, etapaName: 'Fundamentos da linguagem',
  time: '60 min',
  tags: ['funções', 'argumentos', 'match', 'exceções'],
  tagline: 'Funções bem desenhadas têm uma <em>assinatura</em> que diz o contrato: o que é posicional, o que é nomeado, o que é opcional.',
  intro: `<p>A sintaxe de controle de fluxo do Python é pequena (<code>if</code>, <code>for</code>, <code>while</code>, <code>try</code>, <code>match</code>), mas tem recursos que surpreendem quem vem de outras linguagens: <code>else</code> em loops, <code>match</code> estrutural com padrões, exceções como fluxo normal (EAFP) e uma sintaxe de parâmetros rica, com argumentos só posicionais, só nomeados, variádicos e defaults.</p>
<p>A assinatura de uma função é sua API. Decidir o que é posicional e o que é keyword-only evita quebras de compatibilidade e torna chamadas legíveis. Esta lição percorre a mecânica (como o Python liga argumentos a parâmetros), os recursos de fluxo mais subestimados e as armadilhas de entrevista.</p>`,
  sections: [
    {
      id: 'fluxo',
      title: 'Fluxo: truthiness, else em loop e walrus',
      body: `<p>Qualquer objeto tem valor de verdade. São falsos: <code>None</code>, <code>False</code>, zero numérico, sequências e coleções vazias, e objetos cuja <code>__bool__</code> devolve <code>False</code> (ou cuja <code>__len__</code> devolve 0). Todo o resto é verdadeiro. Cuidado: <code>if x:</code> não distingue <code>0</code> de <code>None</code>; quando a diferença importa, use <code>is None</code>.</p>
<pre><code class="language-python">def primeiro_par(nums):
    for n in nums:
        if n % 2 == 0:
            print("achei", n)
            break
    else:                      # executa só se o loop terminou SEM break
        print("nenhum par")

primeiro_par([1, 3, 5])        # nenhum par
primeiro_par([1, 4, 5])        # achei 4

# operador walrus (3.8): atribui e testa numa expressão
import re
if (m := re.search(r"(\\d+)-(\\d+)", "tel 55-1234")):
    print(m.group(1), m.group(2))

import io
buf = io.StringIO("abcdefg")
while bloco := buf.read(3):    # padrão típico de leitura em blocos
    print(bloco)

# expressão condicional, encadeamento de comparação
idade = 20
rotulo = "adulto" if idade &gt;= 18 else "menor"
print(rotulo, 0 &lt; idade &lt; 130)

# any/all com generator: curto-circuito sem lista intermediária
print(any(n &gt; 3 for n in range(10)), all(c.isdigit() for c in "123"))

# enumerate e zip, nunca range(len(x))
for i, (a, b) in enumerate(zip("abc", [10, 20, 30]), start=1):
    print(i, a, b)
try:
    list(zip("ab", [1, 2, 3], strict=True))   # strict=True (3.10) levanta se os tamanhos diferem
except ValueError as e:
    print(e)</code></pre>
<div class="callout tip"><strong>DICA</strong> Prefira "guard clauses" (retornar cedo) a ifs aninhados. Um <code>if not valido: return</code> no topo reduz a indentação e deixa o caminho feliz linear.</div>`
    },
    {
      id: 'match',
      title: 'match estrutural (PEP 634)',
      body: `<p>O <code>match</code> (3.10) não é um <code>switch</code> de igualdade: é <em>desestruturação com padrões</em>. Ele testa a forma do valor (tipo, tamanho de sequência, chaves de mapeamento, atributos de classe) e já liga nomes aos pedaços. Um padrão sem guarda e sem captura de nome só compara; um nome solto no padrão <em>captura</em>, não compara com variável.</p>
<pre><code class="language-python">from dataclasses import dataclass

@dataclass
class Ponto:
    x: float
    y: float

def descreve(obj):
    match obj:
        case Ponto(x=0, y=0):
            return "origem"
        case Ponto(x=x, y=0):
            return f"no eixo x em {x}"
        case Ponto(x, y) if x == y:
            return "diagonal"
        case [primeiro, *resto]:
            return f"sequência com {len(resto) + 1} itens, começa em {primeiro}"
        case {"tipo": "erro", "codigo": int(c)}:
            return f"erro {c}"
        case str() | bytes():
            return "texto"
        case None:
            return "nada"
        case _:
            return "desconhecido"

print(descreve(Ponto(0, 0)), descreve(Ponto(3, 0)), descreve([1, 2, 3]))
print(descreve({"tipo": "erro", "codigo": 404}), descreve("oi"))

# armadilha: nome solto captura, não compara
COR = "vermelho"
match "azul":
    case COR:                   # captura "azul" em COR (e sempre casa!)
        print("casou, COR agora vale", COR)

class Cor:
    VERMELHO = "vermelho"
match "vermelho":
    case Cor.VERMELHO:          # nome com ponto é valor constante, compara de verdade
        print("é vermelho")</code></pre>
<p>O <code>match</code> brilha em ASTs, mensagens de protocolo e eventos com formatos variados. Para um dispatch simples por valor, um <code>dict</code> de funções é mais direto e extensível.</p>
<div class="callout warn"><strong>PEGADINHA</strong> Em <code>match</code>, <code>case x:</code> sempre casa e rouba o nome. Constantes precisam ser qualificadas (<code>Cor.VERMELHO</code>) ou literais. Um <code>case</code> irrefutável no meio impede os seguintes (o compilador avisa com <code>SyntaxError</code>).</div>`
    },
    {
      id: 'parametros',
      title: 'Anatomia dos parâmetros',
      body: `<p>A assinatura completa tem sete categorias, nesta ordem: posicionais-apenas, <code>/</code>, posicional-ou-nomeado, <code>*args</code> (ou <code>*</code> sozinho), nomeados-apenas, <code>**kwargs</code>. Cada marcador é um contrato de API.</p>
<pre><code class="language-python">def f(a, b, /, c, d=10, *args, e, f=5, **kwargs):
    return a, b, c, d, args, e, f, kwargs

# a, b: só posicionais (/); c, d: ambos; e, f: só nomeados (depois de *args)
print(f(1, 2, 3, e=7))                       # (1, 2, 3, 10, (), 7, 5, {})
print(f(1, 2, c=3, d=4, e=7, extra="x"))     # extra cai em kwargs
print(f(1, 2, 3, 4, 5, 6, e=0))              # 5 e 6 caem em args

# erros de contrato
try:
    f(a=1, b=2, c=3, e=0)
except TypeError as err:
    print(err)         # a e b são só posicionais

# somente nomeados via * sozinho: força legibilidade
def conecta(host, porta, *, timeout=5.0, tls=True):
    return host, porta, timeout, tls

print(conecta("db", 5432, timeout=1.5))
# conecta("db", 5432, 1.5)  -&gt; TypeError: só 2 posicionais

# desempacotar na chamada
args = (1, 2)
kw = {"c": 3, "e": 4}
print(f(*args, **kw))

# kwargs repassados (wrappers) e merge
def wrapper(*args, **kwargs):
    return f(*args, **kwargs)
print(wrapper(1, 2, 3, e=1))</code></pre>
<p>Ordem de ligação: o Python liga posicionais da esquerda para a direita, depois nomeados pelo nome, depois aplica defaults; excesso de posicionais vai para <code>*args</code> e nomes extras para <code>**kwargs</code>; um nome ligado duas vezes é <code>TypeError</code>. Use <code>/</code> para liberar o nome do parâmetro sem quebrar compatibilidade (muitas funções embutidas, como <code>len(obj, /)</code>, fazem isso) e <code>*</code> para obrigar flags e opções a serem nomeadas.</p>
<div class="callout"><strong>NA ENTREVISTA</strong> "Por que <code>def f(x, items=[])</code> é bug e como o <code>*</code> ajuda no design?" O default é avaliado uma vez (lição 02). E <code>*</code> força o chamador a escrever <code>f(x, retry=True)</code> em vez de <code>f(x, True)</code>, evitando erros de ordem e permitindo reordenar ou adicionar parâmetros depois.</div>`
    },
    {
      id: 'excecoes',
      title: 'Exceções: EAFP, finally e encadeamento',
      body: `<p>A cultura do Python é <strong>EAFP</strong> (mais fácil pedir perdão que permissão): tente e trate a exceção, em vez de checar antes (LBYL), o que evita condições de corrida entre checar e usar. Em CPython 3.11+ o <code>try</code> sem exceção tem custo praticamente zero ("zero-cost exceptions"); lançar e capturar custa mais que um <code>if</code>, então para caminhos muito quentes e falhas comuns um teste prévio pode valer.</p>
<pre><code class="language-python">import json

def carrega(caminho):
    try:
        with open(caminho, encoding="utf-8") as f:
            dados = json.load(f)
    except FileNotFoundError:
        return {}                              # caso esperado
    except json.JSONDecodeError as e:
        raise ValueError(f"JSON inválido em {caminho}") from e   # encadeia a causa
    else:
        return dados                           # só roda se não houve exceção
    finally:
        print("sempre executa (limpeza)")      # roda mesmo com return acima

# hierarquia: capture o mais específico, nunca "except:" nu
try:
    int("x")
except (ValueError, TypeError) as e:
    print(type(e).__name__, e)

# exceção própria
class ErroDeDominio(Exception):
    """Base das exceções do domínio."""

class SaldoInsuficiente(ErroDeDominio):
    def __init__(self, saldo, valor):
        super().__init__(f"saldo {saldo} &lt; {valor}")
        self.saldo, self.valor = saldo, valor

# 3.11: ExceptionGroup e except* (várias falhas concorrentes)
try:
    raise ExceptionGroup("lote", [ValueError("a"), TypeError("b")])
except* ValueError as eg:
    print("valores:", eg.exceptions)
except* TypeError as eg:
    print("tipos:", eg.exceptions)</code></pre>
<div class="callout warn"><strong>PEGADINHA</strong> <code>except Exception: pass</code> engole bugs. Capture o específico, registre e relance (<code>raise</code>) quando não souber tratar. Também: <code>return</code> dentro de <code>finally</code> descarta exceções em voo, e <code>raise ... from None</code> suprime o contexto, use com critério.</div>`
    },
    {
      id: 'funcoes-objetos',
      title: 'Funções são objetos: anotações, docstrings e introspecção',
      body: `<p>Uma função é um objeto da classe <code>function</code> com atributos que você pode ler: <code>__name__</code>, <code>__doc__</code>, <code>__defaults__</code>, <code>__kwdefaults__</code>, <code>__annotations__</code>, <code>__code__</code> (o bytecode e nomes locais) e <code>__closure__</code> (lição 09). O módulo <code>inspect</code> usa isso para expor a assinatura, base de frameworks como FastAPI e pytest, que leem seus parâmetros para injetar dependências.</p>
<pre><code class="language-python">import inspect, dis

def somar(a: int, b: int = 0, /, *, escala: float = 1.0) -&gt; float:
    """Soma e escala o resultado."""
    return (a + b) * escala

sig = inspect.signature(somar)
print(sig)
for nome, p in sig.parameters.items():
    print(nome, p.kind.name, p.default, p.annotation)

print(somar.__defaults__, somar.__kwdefaults__, somar.__doc__)
print(somar.__code__.co_varnames, somar.__code__.co_argcount)

dis.dis(somar)        # bytecode: a máquina de pilha por trás da função

# funções como valores: dispatch por dict em vez de if/elif longo
operacoes = {"soma": lambda x, y: x + y, "mult": lambda x, y: x * y}
print(operacoes["mult"](3, 4))

# atributo de função (raro, mas legal)
somar.chamadas = 0
somar.chamadas += 1
print(somar.chamadas)</code></pre>
<p>Anotações de tipo não são verificadas em runtime; são metadados guardados em <code>__annotations__</code> (a Etapa 3 cobre tipagem). No Python 3.14, o PEP 649 passa a avaliar anotações de forma tardia (<code>annotationlib</code>), o que elimina a necessidade de aspas e de <code>from __future__ import annotations</code> em referências a nomes definidos depois.</p>
<p>Docstrings: uma linha de resumo no imperativo, linha em branco, detalhes. Escolha um estilo (Google, NumPy ou reST) e use-o em todo o projeto.</p>`
    },
    {
      id: 'recursao-lambda',
      title: 'Recursão, lambda e o que o Python não otimiza',
      body: `<p>O CPython não faz otimização de chamada em cauda (decisão deliberada de Guido: preserva tracebacks legíveis). A recursão consome um frame por nível e o limite padrão é cerca de 1000 (<code>sys.getrecursionlimit()</code>). Estourar gera <code>RecursionError</code>. Aumentar o limite com <code>sys.setrecursionlimit</code> arrisca derrubar o processo por estouro da pilha de C; para profundidade grande, converta em iteração com pilha explícita.</p>
<pre><code class="language-python">import sys
from functools import lru_cache, reduce

print(sys.getrecursionlimit())

def soma_rec(n):
    return 0 if n == 0 else n + soma_rec(n - 1)

try:
    soma_rec(10_000)
except RecursionError as e:
    print("estourou:", type(e).__name__)

def soma_iter(n):
    total = 0
    while n:
        total += n
        n -= 1
    return total
print(soma_iter(10_000))

@lru_cache(maxsize=None)
def fib(n):
    return n if n &lt; 2 else fib(n - 1) + fib(n - 2)
print(fib(80))               # memoização transforma O(2^n) em O(n)

# lambda: só expressão, útil como key; para o resto use def (nome no traceback)
pares = sorted([("a", 3), ("b", 1)], key=lambda t: t[1])
print(pares, reduce(lambda acc, x: acc * x, range(1, 6), 1))</code></pre>
<div class="callout warn"><strong>PEGADINHA</strong> Atribuir uma lambda a um nome (<code>f = lambda x: ...</code>) perde o nome da função em tracebacks (<code>&lt;lambda&gt;</code>) e é desencorajado pela PEP 8 (E731). Se tem nome, use <code>def</code>.</div>`
    }
  ],
  whenToUse: [
    'Parâmetros keyword-only (*) para flags, timeouts e opções',
    'Parâmetros positional-only (/) quando o nome é detalhe de implementação',
    'EAFP com except específico e raise from para preservar a causa',
    'match para desestruturar formatos heterogêneos (AST, eventos, protocolos)',
    'Guard clauses e retorno cedo no lugar de ifs aninhados'
  ],
  whenNot: [
    'Não use except: nu nem except Exception: pass',
    'Não coloque default mutável nem chamada com efeito colateral como default',
    'Não use match como switch de igualdade quando um dict resolve',
    'Não use range(len(x)) quando enumerate ou zip servem',
    'Não use return dentro de finally'
  ],
  metrics: [
    'inspect.signature e dis.dis: introspecção e bytecode',
    'ruff B006, B008, E722, BLE001, SIM: regras de erro de fluxo e exceção',
    'mypy e pyright: validam assinaturas e chamadas',
    'pytest.raises e pytest.mark.parametrize: testam caminhos de exceção',
    'cProfile: confirma se exceções frequentes são gargalo',
    'sys.exc_info e traceback: diagnóstico de exceções encadeadas'
  ],
  refs: [
    { type: 'doc', title: 'More Control Flow Tools (tutorial)', author: 'Python Software Foundation', url: 'https://docs.python.org/3/tutorial/controlflow.html', note: 'if, for, match, parâmetros e funções.' },
    { type: 'doc', title: 'PEP 636: Structural Pattern Matching, Tutorial', author: 'Daniel F Moisset', url: 'https://peps.python.org/pep-0636/', note: 'O tutorial oficial do match.' },
    { type: 'doc', title: 'PEP 570: Python Positional-Only Parameters', author: 'Larry Hastings et al.', url: 'https://peps.python.org/pep-0570/', note: 'Motivação do marcador /.' },
    { type: 'doc', title: 'PEP 3102: Keyword-Only Arguments', author: 'Talin', url: 'https://peps.python.org/pep-3102/', note: 'Origem do marcador * sozinho.' },
    { type: 'doc', title: 'Errors and Exceptions (tutorial)', author: 'Python Software Foundation', url: 'https://docs.python.org/3/tutorial/errors.html', note: 'try, except, finally, ExceptionGroup.' },
    { type: 'livro', title: 'Fluent Python, 2ª edição (cap. 5 e cap. 7)', author: 'Luciano Ramalho', url: 'https://www.oreilly.com/library/view/fluent-python-2nd/9781492056348/', note: 'Funções como objetos e pattern matching.' },
    { type: 'portal', title: 'Real Python: Python args and kwargs', author: 'Real Python', url: 'https://realpython.com/python-kwargs-and-args/', note: 'Demystifying args e kwargs.' },
    { type: 'video', title: 'Live de Python (canal)', author: 'Eduardo Mendes', url: 'https://www.youtube.com/@Dunossauro', note: 'Há lives sobre match, funções e exceções.' }
  ]
};

window.LESSON_CONTENT['modulos-pacotes'] = {
  id: 'modulos-pacotes',
  title: 'Módulos, pacotes e imports',
  etapa: 1, etapaName: 'Fundamentos da linguagem',
  time: '60 min',
  tags: ['import', 'sys.path', 'pacotes', 'circular'],
  tagline: 'Um <code>import</code> não é uma diretiva: é <em>código que executa</em>, uma vez, e deixa o resultado em cache.',
  intro: `<p>Todo arquivo <code>.py</code> é um módulo, e todo diretório com módulos (com ou sem <code>__init__.py</code>) pode ser um pacote. O comando <code>import</code> parece declarativo, mas por baixo roda uma máquina: procura o módulo, cria um objeto, executa o código do arquivo no namespace dele e guarda o resultado em <code>sys.modules</code>. Entender esse pipeline explica imports circulares, efeitos colaterais na importação, módulos "importados duas vezes" e o famoso <code>ModuleNotFoundError</code> que só acontece em produção.</p>
<p>Em projetos grandes a estrutura de pacotes é arquitetura: define fronteiras, dependências permitidas e o que é API pública. Aqui estão o mecanismo do import system (finders, loaders, specs), a diferença entre imports absolutos e relativos, o papel do <code>__init__.py</code> e <code>__all__</code>, e como quebrar ciclos de dependência.</p>`,
  sections: [
    {
      id: 'pipeline-import',
      title: 'O pipeline do import',
      body: `<p>Ao executar <code>import pacote.modulo</code>, o Python faz, em ordem: (1) consulta <code>sys.modules</code>, se achar devolve o objeto cacheado sem reexecutar nada; (2) percorre <code>sys.meta_path</code>, uma lista de <em>finders</em>; cada um tenta devolver uma <code>ModuleSpec</code> (nome, loader, origem); (3) cria o objeto módulo a partir da spec; (4) <strong>registra em <code>sys.modules</code> antes de executar</strong>; (5) o <em>loader</em> executa o código do arquivo dentro do <code>__dict__</code> do módulo. Se a execução levantar exceção, a entrada é removida.</p>
<p>O finder padrão para arquivos (<code>PathFinder</code>) percorre <code>sys.path</code> (ou <code>pacote.__path__</code> para submódulos). O <code>sys.path</code> é montado na inicialização: diretório do script (ou string vazia no REPL), <code>PYTHONPATH</code>, diretórios da stdlib e <code>site-packages</code> (incluindo arquivos <code>.pth</code>).</p>
<pre><code class="language-python">import sys, importlib, importlib.util

print(sys.meta_path)                         # finders: built-in, frozen, PathFinder
print(sys.path[:3])

import json
spec = importlib.util.find_spec("json")
print(spec.name, spec.origin, type(spec.loader).__name__)

print("json" in sys.modules, sys.modules["json"] is json)   # True True

# o cache: o corpo do módulo roda uma única vez
import tempfile, pathlib, textwrap
d = pathlib.Path(tempfile.mkdtemp())
(d / "efeito.py").write_text("print('executando efeito.py')\\nVALOR = 1\\n")
sys.path.insert(0, str(d))
import efeito            # imprime
import efeito            # silencioso: veio de sys.modules
importlib.reload(efeito) # força reexecutar (útil em REPL, perigoso em produção)

# carregar módulo por caminho, sem tocar no sys.path
spec = importlib.util.spec_from_file_location("plugin", d / "efeito.py")
mod = importlib.util.module_from_spec(spec)
spec.loader.exec_module(mod)
print(mod.VALOR)

# import dinâmico por nome (plugins)
m = importlib.import_module("collections.abc")
print(m.Mapping)</code></pre>
<p>Compilação: ao importar, o Python grava bytecode em <code>__pycache__/*.pyc</code>, com invalidação por timestamp e tamanho do fonte (ou por hash, em builds reprodutíveis). Isso acelera o próximo import, não a execução. Em containers, defina <code>PYTHONDONTWRITEBYTECODE</code> se o filesystem for somente leitura, ou pré-compile com <code>python -m compileall</code>.</p>
<div class="callout"><strong>NA ENTREVISTA</strong> "Por que o módulo é registrado em <code>sys.modules</code> antes de ser executado?" Para permitir imports circulares sem recursão infinita: o segundo import encontra o módulo (parcialmente inicializado) no cache. É também a origem do <code>AttributeError: partially initialized module</code>.</div>`
    },
    {
      id: 'absolutos-relativos',
      title: 'Imports absolutos, relativos e a sintaxe',
      body: `<p>Prefira imports <strong>absolutos</strong> (<code>from meu_servico.dominio import Pedido</code>): são legíveis e não dependem de onde o arquivo está. Imports <strong>relativos</strong> (<code>from .dominio import Pedido</code>, <code>from ..util import x</code>) só funcionam dentro de um pacote, usam o <code>__package__</code> do módulo corrente e são úteis para mover um subpacote inteiro sem reescrever nomes. Rodar um módulo de pacote como script (<code>python src/meu/mod.py</code>) quebra os relativos: use <code>python -m meu.mod</code>.</p>
<pre><code class="language-python"># estrutura:  src/loja/__init__.py, src/loja/pedidos.py, src/loja/precos/__init__.py, src/loja/precos/tabela.py

# em loja/pedidos.py
from loja.precos.tabela import preco_de       # absoluto (preferido)
from .precos import tabela                    # relativo explícito
from . import precos                          # importa o pacote irmão

import os.path as osp                         # alias
from collections import abc as colabc         # alias de submódulo

# formas e seus efeitos
import loja.pedidos            # nome vinculado: "loja"; acesso loja.pedidos.X
from loja import pedidos       # nome vinculado: "pedidos"
from loja.pedidos import *     # respeita __all__; evite fora de __init__ e REPL

# em tempo de execução, dentro de função (import tardio, ver circulares)
def relatorio():
    import json                # custo só na primeira chamada (depois, cache)
    return json.dumps({})</code></pre>
<p>Dois alertas de nome: nunca crie arquivo com o nome de um módulo da stdlib (<code>random.py</code>, <code>json.py</code>, <code>email.py</code>) ao lado do seu script, porque o diretório do script vem primeiro no <code>sys.path</code> e você "sombreia" a biblioteca padrão. E <code>from modulo import nome</code> copia a <em>referência</em> naquele momento: se <code>modulo.nome</code> for religado depois, seu nome local continua com o objeto antigo.</p>
<div class="callout warn"><strong>PEGADINHA</strong> Rodar <code>python meu_pacote/arquivo.py</code> coloca <code>meu_pacote/</code> no <code>sys.path</code>, não a raiz do projeto, e o <code>__name__</code> vira <code>"__main__"</code>. Ao importar o mesmo arquivo por outro caminho, ele executa duas vezes (uma como <code>__main__</code>, outra como <code>pacote.arquivo</code>) e gera classes duplicadas que falham em <code>isinstance</code>.</div>`
    },
    {
      id: 'init-api',
      title: '__init__.py, namespace packages e API pública',
      body: `<p>O <code>__init__.py</code> executa quando o pacote é importado e define o namespace do pacote. Use-o para reexportar a API pública e esconder a estrutura interna. Mantenha-o leve: tudo nele roda no primeiro import de qualquer submódulo, então imports pesados ali pioram a inicialização (CLI lenta). Sem <code>__init__.py</code> o diretório vira <em>namespace package</em> (PEP 420), que pode ser dividido entre vários diretórios do <code>sys.path</code> (usado para distribuir plugins sob um prefixo comum). Para pacotes normais do seu projeto, mantenha o <code>__init__.py</code>: ferramentas e a leitura humana agradecem.</p>
<pre><code class="language-python"># src/loja/__init__.py
"""Pacote loja: API pública reexportada aqui."""
from loja.pedidos import Pedido, criar_pedido
from loja.precos.tabela import preco_de

__all__ = ["Pedido", "criar_pedido", "preco_de"]   # define o que 'import *' traz e documenta a API
__version__ = "1.0.0"

# carregamento preguiçoso de submódulo pesado (PEP 562, __getattr__ de módulo)
def __getattr__(nome):
    if nome == "relatorios":
        import importlib
        return importlib.import_module("loja.relatorios")
    raise AttributeError(f"module {__name__!r} has no attribute {nome!r}")</code></pre>
<p>Convenção: nomes com underscore (<code>_interno</code>) são privados por acordo, e módulos internos podem ser nomeados <code>_impl.py</code>. A Python não impõe nada, é cultura. Defina <code>__all__</code> nos módulos que fazem parte da API: serve também para o type checker saber o que reexportar.</p>
<p>O bloco <code>if __name__ == "__main__":</code> separa "uso como módulo" de "uso como script". Para pacotes executáveis, crie <code>__main__.py</code> e rode <code>python -m loja</code>.</p>
<div class="callout tip"><strong>DICA</strong> Para ver quanto cada import custa na inicialização, rode <code>python -X importtime -c "import loja" 2&gt;&amp;1 | sort -t'|' -k2 -n | tail -15</code>. Imports pesados (pandas, torch) dentro de funções tornam a CLI instantânea no caso comum.</div>`
    },
    {
      id: 'circulares',
      title: 'Imports circulares: sintoma, causa e saídas',
      body: `<p>Ciclo: <code>a.py</code> importa <code>b</code> no topo e <code>b.py</code> importa <code>a</code> no topo. Pelo pipeline, <code>a</code> começa a executar e é registrado em <code>sys.modules</code>; ao chegar no <code>import b</code>, <code>b</code> executa e tenta <code>from a import X</code>, mas <code>a</code> ainda não chegou na linha que define <code>X</code>, daí o <code>ImportError: cannot import name 'X' from partially initialized module</code>. Importar o módulo inteiro (<code>import a</code>) em vez de nomes às vezes passa, porque o atributo só é acessado depois.</p>
<pre><code class="language-python"># ANTES: ciclo clássico entre modelos
# pedidos.py
from clientes import Cliente              # topo
class Pedido:
    def __init__(self, cliente: Cliente): self.cliente = cliente

# clientes.py
from pedidos import Pedido                # topo: CICLO
class Cliente:
    def pedidos(self) -&gt; list[Pedido]: ...

# DEPOIS, opção 1: imports só para tipos, atrás de TYPE_CHECKING
# clientes.py
from __future__ import annotations
from typing import TYPE_CHECKING
if TYPE_CHECKING:
    from pedidos import Pedido            # só o type checker vê
class Cliente:
    def pedidos(self) -&gt; list[Pedido]: ...

# opção 2: import tardio dentro da função (quando precisa em runtime)
class Cliente2:
    def novo_pedido(self):
        from pedidos import Pedido        # resolvido na chamada, o ciclo já acabou
        return Pedido(self)

# opção 3 (a correta de verdade): extrair a dependência comum
# tipos.py com Protocol ou ids; pedidos e clientes dependem de tipos, não um do outro</code></pre>
<p>As duas primeiras opções são band-aids aceitáveis; a causa raiz é acoplamento bidirecional entre módulos, sintoma de fronteiras mal desenhadas. Em arquitetura limpa as dependências apontam numa só direção (infra depende de domínio, nunca o contrário). Ferramentas como <code>import-linter</code> e <code>pydeps</code> impõem e visualizam essas regras no CI.</p>
<div class="callout"><strong>NA ENTREVISTA</strong> "Como você resolve um import circular?" Diagnostique o ciclo (traceback mostra a cadeia), prefira refatorar para uma dependência unidirecional (extrair módulo comum, inverter com Protocol), e use <code>TYPE_CHECKING</code> ou import local só quando a refatoração não compensa.</div>`
    },
    {
      id: 'efeitos-colaterais',
      title: 'Efeitos colaterais na importação e boas práticas',
      body: `<p>Como o corpo do módulo executa no import, evite trabalho caro ou com efeito externo no nível do módulo: abrir conexões, ler variáveis de ambiente que falham, criar threads, chamar rede. Isso torna o import lento, não determinístico e impossível de testar. O padrão correto é definir funções e classes no topo, e construir recursos em uma função de fábrica ou no <code>main()</code>.</p>
<pre><code class="language-python"># RUIM: conecta ao importar
# db.py
import psycopg
conn = psycopg.connect("postgresql://...")     # roda em qualquer import, quebra testes

# BOM: fábrica explícita, com cache quando faz sentido
from functools import cache

@cache
def get_conn():
    import psycopg
    return psycopg.connect("postgresql://...")

# singleton "de graça": módulo é cacheado, então variável de módulo é única por processo
# config.py
from dataclasses import dataclass
import os

@dataclass(frozen=True)
class Config:
    ambiente: str
    debug: bool

def carregar() -&gt; Config:
    return Config(ambiente=os.environ.get("APP_ENV", "dev"), debug=os.environ.get("DEBUG") == "1")

# ponto de entrada limpo
def main() -&gt; int:
    cfg = carregar()
    print(cfg)
    return 0

if __name__ == "__main__":
    raise SystemExit(main())</code></pre>
<p>Outras práticas: ordene imports em três blocos (stdlib, terceiros, locais), o que o <code>ruff</code> faz com a regra <code>I</code>; evite <code>sys.path.append</code> para "fazer funcionar", instalando o pacote em modo editável (<code>uv sync</code>); e evite <code>import *</code> que polui o namespace e esconde origem de nomes. Para plugins, use entry points (<code>[project.entry-points]</code> no pyproject) e <code>importlib.metadata.entry_points()</code> em vez de varrer diretórios.</p>
<p>Cada subinterpretador tem seu próprio <code>sys.modules</code>, e o 3.14 expõe subinterpretadores na stdlib via <code>concurrent.interpreters</code> (PEP 734); extensões C precisam declarar suporte. É tema avançado, mas explica por que estado global de módulo é uma dívida.</p>`
    },
    {
      id: 'hooks-import',
      title: 'Customizando o import: finders e hooks',
      body: `<p>Como o import é um pipeline de objetos Python, você pode inserir o seu próprio finder em <code>sys.meta_path</code>. É assim que funcionam editable installs, importação de módulos de zip, de bancos e de plugins remotos, e ferramentas de teste que substituem módulos. Poucas vezes você escreverá um, mas ler um ajuda a entender o sistema.</p>
<pre><code class="language-python">import sys
import importlib.abc, importlib.util

CODIGO = {"virtual_hello": "def oi():\n    return 'oi de um modulo que nao existe em disco'\n"}

class FinderEmMemoria(importlib.abc.MetaPathFinder, importlib.abc.Loader):
    def find_spec(self, nome, caminho=None, alvo=None):
        if nome in CODIGO:
            return importlib.util.spec_from_loader(nome, self)   # esta classe também é o loader
        return None                                              # None = deixa o próximo finder tentar

    def create_module(self, spec):
        return None                                              # usa a criação padrão

    def exec_module(self, modulo):
        exec(CODIGO[modulo.__name__], modulo.__dict__)           # executa o código no namespace do módulo

sys.meta_path.insert(0, FinderEmMemoria())

import virtual_hello
print(virtual_hello.oi())
print(virtual_hello.__spec__.name, "virtual_hello" in sys.modules)</code></pre>
<p>Casos de uso reais: o <code>pytest</code> reescreve o AST dos asserts via um import hook para mostrar valores intermediários; ferramentas de cobertura e de tipagem em runtime (<code>beartype</code>, <code>typeguard</code>) instrumentam módulos no import. Recursos de dados empacotados devem ser lidos com <code>importlib.resources.files("pacote").joinpath("dados.json")</code>, nunca por caminho relativo a <code>__file__</code>, que quebra dentro de zip e wheels.</p>
<div class="callout warn"><strong>PEGADINHA</strong> Hooks de import têm efeito global e ordem importa. Um finder em <code>meta_path[0]</code> vê todo import do processo. Mantenha o <code>find_spec</code> barato e retorne <code>None</code> rápido para nomes que não são seus.</div>`
    }
  ],
  whenToUse: [
    'Imports absolutos como padrão; relativos só dentro do mesmo pacote',
    '__init__.py com API pública reexportada e __all__',
    'TYPE_CHECKING e imports locais para quebrar ciclos de tipo',
    'Import preguiçoso (função ou __getattr__ de módulo) para dependências pesadas',
    'python -m pacote e entry points para executáveis'
  ],
  whenNot: [
    'Não use import * fora do REPL ou de reexportações controladas',
    'Não coloque trabalho caro ou com efeito externo no nível do módulo',
    'Não manipule sys.path para o código funcionar: instale o pacote',
    'Não nomeie arquivos como módulos da stdlib (random.py, json.py)',
    'Não use reload em produção para recarregar código'
  ],
  metrics: [
    'python -X importtime: tempo de cada import na inicialização',
    'import-linter e pydeps: regras e grafo de dependências entre módulos',
    'ruff I (isort) e F401: ordem e imports não usados',
    'python -m compileall: pré-compila bytecode para containers',
    'importlib.util.find_spec e sys.modules: diagnóstico de qual módulo carregou',
    'python -v: mostra a busca de cada import'
  ],
  refs: [
    { type: 'doc', title: 'The import system', author: 'Python Software Foundation', url: 'https://docs.python.org/3/reference/import.html', note: 'Especificação oficial: finders, loaders, specs, namespace packages.' },
    { type: 'doc', title: 'importlib', author: 'Python Software Foundation', url: 'https://docs.python.org/3/library/importlib.html', note: 'API para import programático e customizado.' },
    { type: 'doc', title: 'Modules (tutorial)', author: 'Python Software Foundation', url: 'https://docs.python.org/3/tutorial/modules.html', note: 'Módulos e pacotes pelo caminho oficial.' },
    { type: 'doc', title: 'PEP 420: Implicit Namespace Packages', author: 'Eric V. Smith', url: 'https://peps.python.org/pep-0420/', note: 'Pacotes sem __init__.py.' },
    { type: 'doc', title: 'PEP 562: Module __getattr__ and __dir__', author: 'Ivan Levkivskyi', url: 'https://peps.python.org/pep-0562/', note: 'Base do carregamento preguiçoso.' },
    { type: 'portal', title: 'Real Python: Python Modules and Packages, an introduction', author: 'Real Python', url: 'https://realpython.com/python-modules-packages/', note: 'Guia prático com exemplos.' },
    { type: 'portal', title: 'Real Python: Python import, advanced techniques and tips', author: 'Real Python', url: 'https://realpython.com/python-import/', note: 'Aprofunda sys.modules, importlib e circulares.' },
    { type: 'doc', title: 'import-linter', author: 'David Seddon', url: 'https://import-linter.readthedocs.io/', note: 'Impõe contratos de arquitetura entre pacotes.' }
  ]
};

window.LESSON_CONTENT['iteradores-geradores'] = {
  id: 'iteradores-geradores',
  title: 'Iteradores e geradores',
  etapa: 2, etapaName: 'Python idiomático',
  time: '75 min',
  tags: ['iterator', 'yield', 'lazy', 'itertools'],
  tagline: 'Um gerador é uma função que <em>pausa</em>: guarda o frame, devolve um valor e retoma exatamente de onde parou.',
  intro: `<p>O protocolo de iteração é o que faz <code>for</code>, comprehensions, <code>sum</code>, <code>zip</code>, desempacotamento e <code>list()</code> funcionarem com qualquer coisa: arquivos, linhas de banco, páginas de API, streams. Quem domina iteradores e geradores processa dados maiores que a memória com poucas linhas, e entende por que <code>asyncio</code> é, na origem, gerador que evoluiu.</p>
<p>O ponto central é a <em>avaliação preguiçosa</em>: o dado é produzido sob demanda, um item por vez, sem materializar a coleção. O custo de memória passa de O(n) para O(1), e o pipeline pode começar a entregar resultados antes de terminar de ler a entrada.</p>
<p>Esta lição cobre o protocolo (<code>__iter__</code> e <code>__next__</code>), a mecânica de suspensão do frame no <code>yield</code>, <code>send</code>, <code>yield from</code>, geradores como pipelines, <code>itertools</code> e as armadilhas de esgotamento que aparecem em entrevistas.</p>`,
  sections: [
    {
      id: 'protocolo',
      title: 'O protocolo de iteração',
      body: `<p>Dois conceitos distintos. Um <strong>iterável</strong> implementa <code>__iter__</code> e devolve um iterador (listas, dicts, arquivos, ranges). Um <strong>iterador</strong> implementa <code>__next__</code> (devolve o próximo item ou levanta <code>StopIteration</code>) e <code>__iter__</code> devolvendo a si mesmo. O <code>for</code> faz, em essência: <code>it = iter(obj)</code> e depois chama <code>next(it)</code> até a exceção.</p>
<pre><code class="language-python"># o que o for faz de verdade
def meu_for(iteravel, corpo):
    it = iter(iteravel)
    while True:
        try:
            item = next(it)
        except StopIteration:
            break
        corpo(item)

meu_for([1, 2, 3], print)

# iterador manual
class Contagem:
    def __init__(self, ate):
        self.ate, self.atual = ate, 0
    def __iter__(self):
        return self                      # iterador: devolve a si mesmo
    def __next__(self):
        if self.atual &gt;= self.ate:
            raise StopIteration
        self.atual += 1
        return self.atual

print(list(Contagem(3)))                 # [1, 2, 3]
c = Contagem(2)
print(list(c), list(c))                  # [1, 2] []  (iterador esgota, não reinicia)

# iterável reutilizável: __iter__ cria um iterador novo a cada chamada
class Intervalo:
    def __init__(self, ate): self.ate = ate
    def __iter__(self):
        yield from range(1, self.ate + 1)   # gerador novo por iteração

r = Intervalo(3)
print(list(r), list(r))                  # [1, 2, 3] [1, 2, 3]

# next com default evita exceção
print(next(iter([]), "vazio"))

# iter(callable, sentinela): chama até devolver o sentinela
import io
f = io.StringIO("ab\\ncd\\n")
print(list(iter(f.readline, "")))        # ['ab\\n', 'cd\\n']</code></pre>
<div class="callout warn"><strong>PEGADINHA</strong> Iteradores são de uso único. Passar um gerador para duas funções que o consomem faz a segunda ver vazio. Se precisar percorrer duas vezes, materialize com <code>list()</code>, recrie o gerador ou use <code>itertools.tee</code> (que armazena em buffer o que um consumidor leu à frente do outro).</div>`
    },
    {
      id: 'geradores-mecanismo',
      title: 'Como o gerador suspende o frame',
      body: `<p>Uma função com <code>yield</code> no corpo é compilada de modo diferente: chamá-la <em>não executa o corpo</em>, devolve um objeto gerador que guarda o frame (variáveis locais, ponteiro de instrução, pilha de valores) no heap. Cada <code>next()</code> retoma a execução desse frame até o próximo <code>yield</code>, que entrega o valor e <strong>suspende</strong> o frame no ponto exato. Quando a função termina, o gerador levanta <code>StopIteration</code> (com o valor do <code>return</code> no atributo <code>value</code>).</p>
<p>Uma função comum cria e destrói seu frame na pilha de chamadas; o gerador mantém o frame vivo entre as retomadas, daí a economia (estado de poucas variáveis, não de uma coleção) e a semelhança com corrotinas.</p>
<pre><code class="language-python">import inspect

def contador(n):
    print("início")
    for i in range(n):
        print(f"antes do yield {i}")
        yield i
        print(f"depois do yield {i}")
    return "fim"

g = contador(2)
print(inspect.getgeneratorstate(g))      # GEN_CREATED: nada executou ainda
print(next(g))                           # início, antes do yield 0, depois imprime 0
print(inspect.getgeneratorstate(g))      # GEN_SUSPENDED
print(next(g))                           # depois do yield 0, antes do yield 1, 1
try:
    next(g)
except StopIteration as e:
    print("return:", e.value)            # fim
print(inspect.getgeneratorstate(g))      # GEN_CLOSED

print(g.gi_frame)                        # None após terminar; vivo e com f_locals enquanto suspenso

# send: o yield é uma EXPRESSÃO, recebe valor de fora
def acumulador():
    total = 0
    while True:
        x = yield total          # entrega o total, espera um valor
        if x is None:
            break
        total += x

a = acumulador()
next(a)                          # "primar": avança até o primeiro yield
print(a.send(10), a.send(5))     # 10 15
a.close()                        # injeta GeneratorExit no ponto de suspensão</code></pre>
<p>Além de <code>send</code>, há <code>throw(exc)</code> (injeta uma exceção no ponto do <code>yield</code>) e <code>close()</code> (injeta <code>GeneratorExit</code> para rodar blocos <code>finally</code> de limpeza). Foi essa capacidade bidirecional que deu origem às corrotinas e, depois, ao <code>async/await</code> (Etapa 7): uma corrotina é um gerador especializado cujo "yield" cede o controle ao event loop.</p>
<div class="callout"><strong>NA ENTREVISTA</strong> "O que acontece quando você chama uma função geradora?" Nada do corpo roda: devolve um objeto gerador com o frame suspenso no início. O corpo só executa dentro de <code>next()</code>. Por isso erros de validação no topo do gerador só aparecem na primeira iteração (valide em função externa que depois devolve o gerador).</div>`
    },
    {
      id: 'yield-from',
      title: 'yield from e delegação',
      body: `<p><code>yield from sub</code> delega a um subiterador e é mais que um loop <code>for x in sub: yield x</code>: ele repassa <code>send</code> e <code>throw</code> ao subgerador e captura o <code>return</code> dele como valor da expressão. Isso permite compor geradores recursivamente, como percorrer uma árvore.</p>
<pre><code class="language-python">def achatar(estrutura):
    for item in estrutura:
        if isinstance(item, (list, tuple)):
            yield from achatar(item)      # delega recursivamente
        else:
            yield item

print(list(achatar([1, [2, [3, 4]], (5,)])))   # [1, 2, 3, 4, 5]

# valor de retorno do subgerador
def soma_parcial(xs):
    total = 0
    for x in xs:
        total += x
        yield x
    return total

def pipeline():
    total = yield from soma_parcial([1, 2, 3])   # captura o return
    print("total:", total)

print(list(pipeline()))                    # imprime total: 6, depois [1, 2, 3]

# percurso em ordem de árvore binária (cada nível delega ao filho)
class No:
    def __init__(self, valor, esq=None, dir=None):
        self.valor, self.esq, self.dir = valor, esq, dir
    def __iter__(self):
        if self.esq: yield from self.esq
        yield self.valor
        if self.dir: yield from self.dir

arvore = No(2, No(1), No(3))
print(list(arvore))                        # [1, 2, 3]</code></pre>
<p>A profundidade de recursão ainda conta para o limite de <code>RecursionError</code>, mas o custo por nível com <code>yield from</code> é pequeno. Para árvores muito profundas, use pilha explícita.</p>`
    },
    {
      id: 'pipelines',
      title: 'Pipelines preguiçosos e memória constante',
      body: `<p>Geradores se encadeiam: cada estágio puxa do anterior sob demanda. Processar um arquivo de 50 GB de log fica com memória constante, porque só uma linha existe por vez em cada estágio. O <code>sum</code>, <code>any</code>, <code>min</code>, <code>max</code>, <code>sorted</code> (que materializa) e <code>"".join</code> aceitam iteráveis diretamente.</p>
<pre><code class="language-python">import re, gzip
from collections import Counter

def linhas(caminho):
    with gzip.open(caminho, "rt", encoding="utf-8") as f:     # abre, lê e fecha no fim da iteração
        yield from f

def so_erros(ls):
    return (l for l in ls if " ERROR " in l)

def extrai_ip(ls):
    padrao = re.compile(r"(\\d{1,3}(?:\\.\\d{1,3}){3})")
    for l in ls:
        if m := padrao.search(l):
            yield m.group(1)

def top_ips(caminho, n=5):
    return Counter(extrai_ip(so_erros(linhas(caminho)))).most_common(n)

# em blocos para processamento em lote
from itertools import islice, batched   # batched: 3.12

def em_lotes(it, tamanho):
    it = iter(it)
    while lote := list(islice(it, tamanho)):
        yield lote

print(list(em_lotes(range(7), 3)))      # [[0, 1, 2], [3, 4, 5], [6]]
print(list(batched(range(7), 3)))       # [(0, 1, 2), (3, 4, 5), (6,)]

# memória: gerador versus lista
import sys
print(sys.getsizeof([i for i in range(1_000_000)]), sys.getsizeof(i for i in range(1_000_000)))</code></pre>
<p>Trade-off: geradores não têm <code>len</code>, nem indexação, nem segunda passada; depurar é menos direto (o estado está suspenso). Para dados pequenos que serão percorridos várias vezes, a lista é mais simples e, em geral, mais rápida. Meça antes de otimizar.</p>
<div class="callout tip"><strong>DICA</strong> Use <code>contextlib.closing</code> ou a própria estrutura <code>with</code> dentro do gerador para garantir fechamento de recursos mesmo se o consumidor parar no meio; ao descartar o gerador, o <code>close()</code> roda os <code>finally</code>.</div>`
    },
    {
      id: 'itertools',
      title: 'itertools e funções que operam sobre iteráveis',
      body: `<p>O módulo <code>itertools</code> é a "álgebra" dos iteradores: blocos implementados em C, preguiçosos e compostos. Conhecer o repertório evita reinventar loops.</p>
<pre><code class="language-python">from itertools import (chain, islice, count, cycle, repeat, accumulate, groupby,
                       product, permutations, combinations, pairwise, zip_longest, tee, takewhile, dropwhile)
import operator

print(list(chain([1, 2], "ab")))                       # concatena iteráveis sem copiar
print(list(islice(count(10, 5), 4)))                   # [10, 15, 20, 25]  (count é infinito)
print(list(accumulate([1, 2, 3, 4], operator.mul)))    # [1, 2, 6, 24]
print(list(pairwise("abcd")))                          # [('a','b'), ('b','c'), ('c','d')]  (3.10)
print(list(zip_longest("ab", [1, 2, 3], fillvalue="-")))
print(list(product("ab", repeat=2)))                   # produto cartesiano
print(list(combinations(range(4), 2)), len(list(permutations(range(4), 2))))
print(list(takewhile(lambda x: x &lt; 3, [1, 2, 5, 1])))  # [1, 2]

# groupby: agrupa APENAS itens consecutivos; ordene antes pela mesma chave
dados = sorted([("fruta", "maçã"), ("verdura", "alface"), ("fruta", "pera")], key=lambda t: t[0])
for chave, grupo in groupby(dados, key=lambda t: t[0]):
    print(chave, [v for _, v in grupo])

# tee: duas passadas sobre um iterador, com buffer
a, b = tee(iter([1, 2, 3]))
print(sum(a), list(b))

# funções embutidas preguiçosas: map, filter, zip, enumerate, reversed (precisa de __reversed__ ou sequência)
print(list(map(str.upper, "abc")), list(zip(*[(1, "a"), (2, "b")])))</code></pre>
<div class="callout warn"><strong>PEGADINHA</strong> No <code>groupby</code>, o iterador de grupo é invalidado ao avançar para a próxima chave: consuma (<code>list(grupo)</code>) antes de avançar. E sem ordenar, chaves repetidas viram grupos separados.</div>
<p>Desde o 3.13, o <code>itertools</code> segue sem ter <code>flatten</code> nativo: use <code>chain.from_iterable(listas)</code>. Desde o 3.13, <code>itertools.batched</code> aceita <code>strict=True</code> para falhar se o último lote vier incompleto. Geradores assíncronos (<code>async def</code> com <code>yield</code>) seguem o mesmo princípio com <code>async for</code> (Etapa 7).</p>`
    },
    {
      id: 'armadilhas-geradores',
      title: 'Armadilhas e tipagem de geradores',
      body: `<p>Armadilhas recorrentes: um gerador é sempre verdadeiro em <code>if gen:</code>, mesmo vazio (não há <code>__len__</code>); vazamento de variável de loop em geradores com closures (late binding, lição 09); e o <strong>PEP 479</strong> (padrão desde o 3.7): um <code>StopIteration</code> que escapa de dentro de um gerador é convertido em <code>RuntimeError</code>, para não terminar a iteração em silêncio por engano.</p>
<pre><code class="language-python">from collections.abc import Generator, Iterator, Iterable

def cresce():
    yield 1
    raise StopIteration          # PEP 479: vira RuntimeError

try:
    list(cresce())
except RuntimeError as e:
    print("RuntimeError:", e)

# tipagem: Generator[tipo_yield, tipo_send, tipo_return]
def contagem_regressiva(n: int) -&gt; Generator[int, None, str]:
    while n &gt; 0:
        yield n
        n -= 1
    return "decolou"

# na maioria dos casos basta Iterator[T] (ou Iterable[T] em parâmetros)
def dobra(xs: Iterable[int]) -&gt; Iterator[int]:
    for x in xs:
        yield x * 2

# limpeza com finally: roda no close() ou ao coletar o gerador
def le_com_limpeza():
    print("abre recurso")
    try:
        for i in range(3):
            yield i
    finally:
        print("fecha recurso")

g = le_com_limpeza()
print(next(g))
g.close()                        # imprime 'fecha recurso' sem terminar a iteração

# validar cedo: função comum valida e devolve o gerador interno
def le_linhas(caminho: str):
    if not caminho.endswith(".log"):
        raise ValueError("esperava .log")      # erro imediato, na chamada
    def _gen():
        with open(caminho, encoding="utf-8") as f:
            yield from f
    return _gen()</code></pre>
<p>Em testes, nunca consuma geradores infinitos com <code>list()</code>: use <code>itertools.islice</code>. E ao documentar, deixe explícito se o retorno é uma passada única.</p>
<div class="callout"><strong>NA ENTREVISTA</strong> "Qual a diferença entre <code>return [..]</code> e <code>yield</code> em termos de contrato?" Lista: o chamador pode iterar várias vezes e conhece o tamanho; gerador: uma passada, tamanho desconhecido, trabalho adiado e erros que aparecem durante o consumo, não na chamada.</div>`
    }
  ],
  whenToUse: [
    'Processar arquivos, streams e resultados paginados maiores que a memória',
    'Pipelines de transformação em estágios com memória constante',
    'Sequências infinitas ou longas (count, cycle, leitura de socket)',
    '__iter__ como gerador para tornar suas classes iteráveis de forma reutilizável',
    'itertools em vez de loops aninhados para produto, combinação e agrupamento'
  ],
  whenNot: [
    'Não use gerador quando precisa de len, indexação ou várias passadas sem materializar',
    'Não passe o mesmo iterador a dois consumidores: o segundo vê vazio',
    'Não use groupby sem ordenar pela chave',
    'Não valide argumentos dentro do gerador esperando erro imediato',
    'Não troque lista por gerador sem medir: para dados pequenos, a lista costuma ser mais simples e rápida'
  ],
  metrics: [
    'sys.getsizeof e tracemalloc: comparar memória de lista versus gerador',
    'inspect.getgeneratorstate e gi_frame: estado do gerador',
    'timeit e pyperf: custo de abstração em loops quentes',
    'ruff C4 e PERF: regras que sugerem comprehension e itertools',
    'mypy: tipos Iterator[T], Iterable[T] e Generator[Y, S, R]',
    'pytest com islice: testa geradores infinitos sem travar'
  ],
  refs: [
    { type: 'livro', title: 'Fluent Python, 2ª edição (cap. 17: Iterators, Generators, and Classic Coroutines)', author: 'Luciano Ramalho', url: 'https://www.oreilly.com/library/view/fluent-python-2nd/9781492056348/', note: 'Referência definitiva sobre o protocolo e yield from.' },
    { type: 'doc', title: 'Iterators and Generators (tutorial)', author: 'Python Software Foundation', url: 'https://docs.python.org/3/tutorial/classes.html#iterators', note: 'Introdução oficial ao protocolo.' },
    { type: 'doc', title: 'itertools: Functions creating iterators for efficient looping', author: 'Python Software Foundation', url: 'https://docs.python.org/3/library/itertools.html', note: 'Inclui a seção de receitas, leitura obrigatória.' },
    { type: 'doc', title: 'PEP 255: Simple Generators', author: 'Neil Schemenauer et al.', url: 'https://peps.python.org/pep-0255/', note: 'Origem dos geradores.' },
    { type: 'doc', title: 'PEP 380: Syntax for Delegating to a Subgenerator', author: 'Greg Ewing', url: 'https://peps.python.org/pep-0380/', note: 'Semântica completa do yield from.' },
    { type: 'video', title: 'Palestras e tutoriais de David Beazley (inclui Generator Tricks for Systems Programmers)', author: 'David Beazley', url: 'https://www.dabeaz.com/talks.html', note: 'Pipelines com geradores aplicados a logs, material clássico.' },
    { type: 'portal', title: 'Real Python: How to use generators and yield in Python', author: 'Real Python', url: 'https://realpython.com/introduction-to-python-generators/', note: 'Guia prático.' },
    { type: 'video', title: 'Live de Python (canal)', author: 'Eduardo Mendes', url: 'https://www.youtube.com/@Dunossauro', note: 'Lives sobre iteradores, geradores e itertools.' }
  ]
};

window.LESSON_CONTENT['comprehensions'] = {
  id: 'comprehensions',
  title: 'Comprehensions',
  etapa: 2, etapaName: 'Python idiomático',
  time: '45 min',
  tags: ['list comprehension', 'dict', 'set', 'generator expression'],
  tagline: 'Comprehensions descrevem <em>o que</em> a coleção contém. Quando exigem explicar <em>como</em> em três níveis, é hora de voltar ao loop.',
  intro: `<p>Comprehensions são a forma declarativa de construir listas, dicts e sets a partir de iteráveis: mapa, filtro e produto cartesiano numa expressão só. Elas são idiomáticas, geralmente mais rápidas que o loop com <code>append</code> equivalente (menos custo de despacho de método) e comunicam intenção: "esta coleção é uma transformação daquela".</p>
<p>O risco é o abuso. Uma comprehension com dois <code>for</code>, três <code>if</code> e uma expressão ternária é um código ilegível que o autor chama de elegante. A régua é a legibilidade, e a decisão entre lista, set, dict ou generator expression é a decisão sobre memória, unicidade e preguiça.</p>
<p>Aqui estão a sintaxe completa, o escopo próprio da comprehension (e a mudança do PEP 709 no 3.12), a escolha entre as quatro formas, o desempenho e os casos em que não usar.</p>`,
  sections: [
    {
      id: 'sintaxe',
      title: 'Sintaxe completa das quatro formas',
      body: `<p>A estrutura é <code>expressão for alvo in iterável [if condição] [for ... [if ...]]</code>. A ordem dos <code>for</code> é a mesma de loops aninhados escritos de cima para baixo. O <code>if</code> no fim filtra; um <code>if/else</code> <em>antes</em> do primeiro <code>for</code> é expressão condicional e transforma.</p>
<pre><code class="language-python">nums = range(10)

quadrados = [n * n for n in nums]                       # lista
pares = [n for n in nums if n % 2 == 0]                 # filtro
rotulos = ["par" if n % 2 == 0 else "impar" for n in nums]   # transforma (ternário na expressão)

unicos = {n % 3 for n in nums}                          # set
indice = {n: n * n for n in nums}                       # dict
invertido = {v: k for k, v in indice.items()}

soma = sum(n * n for n in nums)                         # generator expression (sem colchetes quando é o único argumento)
gen = (n * n for n in nums)                             # preguiçoso, uso único

# comprehension aninhada: ordem dos for = ordem do loop aninhado
matriz = [[1, 2], [3, 4], [5, 6]]
achatada = [x for linha in matriz for x in linha]       # for externo primeiro
transposta = [[linha[i] for linha in matriz] for i in range(2)]
print(achatada, transposta)

# produto cartesiano com filtro
pares_ordenados = [(a, b) for a in range(3) for b in range(3) if a &lt; b]
print(pares_ordenados)

# com walrus: calcula uma vez e reutiliza no filtro e na expressão
import math
raizes = [r for n in range(10) if (r := math.sqrt(n)) == int(r)]
print(raizes)</code></pre>
<div class="callout warn"><strong>PEGADINHA</strong> O <code>if</code> sem <code>else</code> vai no fim (filtra); com <code>else</code> vai no começo (transforma). Escrever <code>[x for x in xs if x else 0]</code> é <code>SyntaxError</code>, e é erro comum.</div>`
    },
    {
      id: 'escopo',
      title: 'Escopo próprio, PEP 709 e vazamento de variável',
      body: `<p>No Python 3, a variável de iteração de uma comprehension <em>não vaza</em> para o escopo externo (no Python 2, vazava). O Python 3.12 inlinou list, dict e set comprehensions (PEP 709): em vez de criar e chamar uma função aninhada a cada uso, o corpo é compilado no próprio frame, com isolamento de variável preservado. O ganho de velocidade documentado é de até cerca de duas vezes em comprehensions pequenas; o comportamento semântico não muda, exceto detalhes de tracebacks e <code>locals()</code>.</p>
<pre><code class="language-python">x = "externo"
lista = [x for x in range(3)]
print(x)                         # 'externo': o x da comprehension não vaza

# o escopo de classe é uma armadilha conhecida
class Teste:
    base = 10
    # a expressão do primeiro iterável é avaliada no escopo da classe, o resto não
    ok = [i for i in range(base)]            # funciona: range(base) é o primeiro iterável
    # erro = [base + i for i in range(3)]     # NameError: base não é visível dentro da comprehension

# armadilha de closure: lambdas capturam a variável, não o valor
funcs = [lambda: i for i in range(3)]
print([f() for f in funcs])                 # [2, 2, 2]
funcs_ok = [lambda i=i: i for i in range(3)]   # default captura o valor na criação
print([f() for f in funcs_ok])              # [0, 1, 2]

# o walrus dentro de comprehension vaza para o escopo ENCLOSING (PEP 572)
total = 0
[total := total + n for n in range(4)]
print(total)                                # 6</code></pre>
<p>A lição de closures (09) explica por que o caso das lambdas imprime <code>[2, 2, 2]</code>: a variável <code>i</code> é uma célula compartilhada, lida só quando a função roda.</p>`
    },
    {
      id: 'escolha-forma',
      title: 'Lista, set, dict ou generator: qual escolher',
      body: `<table><thead><tr><th>Forma</th><th>Memória</th><th>Use quando</th></tr></thead><tbody>
<tr><td><code>[ ... ]</code></td><td>O(n), materializa</td><td>precisa de índice, len, várias passadas</td></tr>
<tr><td><code>{ ... }</code> set</td><td>O(n), sem duplicatas</td><td>unicidade ou pertinência rápida depois</td></tr>
<tr><td><code>{k: v ...}</code></td><td>O(n)</td><td>indexar por chave, inverter mapeamentos</td></tr>
<tr><td><code>( ... )</code></td><td>O(1), preguiçoso</td><td>alimentar <code>sum</code>, <code>any</code>, <code>join</code>, pipelines, uma só passada</td></tr>
</tbody></table>
<pre><code class="language-python">palavras = ["ana", "bia", "ana", "caio", "bia"]

# se o consumidor é uma redução, não crie lista intermediária
total = sum(len(p) for p in palavras)                 # generator expression
tem_longa = any(len(p) &gt; 3 for p in palavras)         # curto-circuita
texto = ", ".join(p.upper() for p in palavras)        # join aceita iterável

# dict por agrupamento: comprehension não é boa; use defaultdict
from collections import defaultdict
grupos = defaultdict(list)
for p in palavras:
    grupos[len(p)].append(p)

# set comprehension para dedupe com normalização
normalizadas = {p.casefold() for p in palavras}

# dict a partir de dois iteráveis
chaves, valores = ["a", "b"], [1, 2]
print({k: v for k, v in zip(chaves, valores)}, dict(zip(chaves, valores)))

# generator expression guarda referência ao iterável, e avalia o PRIMEIRO iterável cedo
dados = [1, 2, 3]
g = (x * 2 for x in dados)
dados.append(4)                                       # o primeiro iterável foi capturado (mesmo objeto): vê o 4
print(list(g))                                        # [2, 4, 6, 8]</code></pre>
<div class="callout"><strong>NA ENTREVISTA</strong> "Qual a diferença entre <code>[x for ...]</code> e <code>(x for ...)</code> em memória e em tempo?" A lista aloca tudo de uma vez e é mais rápida para consumir várias vezes; o gerador tem memória constante e atrasa o trabalho até o consumo, com custo de retomada de frame por item. Para reduções de uma passada o gerador vence em memória, nem sempre em tempo.</div>`
    },
    {
      id: 'desempenho',
      title: 'Desempenho e como medir',
      body: `<p>Comprehensions tendem a ser mais rápidas que o loop com <code>append</code> porque evitam a busca do método <code>append</code> e a chamada Python por item. Não é regra de ouro: para corpos caros, o custo do corpo domina. Para operações numéricas em massa, NumPy (Etapa 6) vence qualquer comprehension por ordens de grandeza, porque o loop roda em C sobre memória contígua.</p>
<pre><code class="language-python">import timeit

N = 100_000

def com_loop():
    r = []
    for i in range(N):
        r.append(i * 2)
    return r

def com_comp():
    return [i * 2 for i in range(N)]

def com_map():
    return list(map(lambda i: i * 2, range(N)))

for f in (com_loop, com_comp, com_map):
    print(f.__name__, round(min(timeit.repeat(f, number=20, repeat=5)), 4))

# função nativa passada ao map costuma ganhar (sem lambda)
print(min(timeit.repeat(lambda: list(map(abs, range(-N, 0))), number=20, repeat=5)))
print(min(timeit.repeat(lambda: [abs(i) for i in range(-N, 0)], number=20, repeat=5)))</code></pre>
<p>Resultado típico: comprehension supera o loop com append; <code>map</code> com função nativa empata ou vence a comprehension; <code>map</code> com <code>lambda</code> perde. Isso varia por versão e máquina, por isso o código acima mede. Antes de otimizar, perfile (<code>cProfile</code>): comprehensions raramente são o gargalo real.</p>
<div class="callout tip"><strong>DICA</strong> Pré-compute fora o que não depende do item: <code>[f(x, K) for x in xs]</code> com <code>K = tabela[chave]</code> calculado antes do loop. Mover a busca de atributo ou chamada invariante para fora é a otimização mais barata.</div>`
    },
    {
      id: 'quando-nao',
      title: 'Quando não usar (antes e depois)',
      body: `<p>Sinais de que é hora do loop: mais de um <code>if</code> e um <code>for</code> aninhado, necessidade de tratar exceções, efeitos colaterais (print, escrita, mutação), necessidade de acumular estado entre itens, ou comentário explicando o que a linha faz.</p>
<pre><code class="language-python"># ANTES: comprehension ilegível
dados = [{"nome": "Ana", "notas": [7, 8, None]}, {"nome": "Bia", "notas": [9, 10]}]
resultado = [(d["nome"], sum(n for n in d["notas"] if n is not None) / len([n for n in d["notas"] if n is not None])) for d in dados if d["notas"] and any(n is not None for n in d["notas"])]

# DEPOIS: função nomeada, testável, legível
def media_valida(notas):
    validas = [n for n in notas if n is not None]
    return sum(validas) / len(validas) if validas else None

resultado = [(d["nome"], m) for d in dados if (m := media_valida(d["notas"])) is not None]
print(resultado)

# NUNCA comprehension por efeito colateral
# [print(x) for x in range(3)]     # cria lista de None só para imprimir
for x in range(3):
    print(x)                       # correto

# nem para o que já tem função pronta
copia = list(range(5))             # em vez de [x for x in range(5)]
nomes = dict(zip("ab", [1, 2]))    # em vez de comprehension trivial
from itertools import chain
flat = list(chain.from_iterable([[1], [2, 3]]))   # alternativa ao duplo for</code></pre>
<p>Regra de bolso: se não cabe em uma linha de até cerca de 80 a 100 caracteres, ou se você hesita ao ler, extraia uma função com nome que explique a intenção. O nome vale mais que o ganho de compactação.</p>`
    },
    {
      id: 'async-dados',
      title: 'Comprehensions assíncronas e padrões com dados reais',
      body: `<p>Dentro de <code>async def</code>, comprehensions podem usar <code>async for</code> e <code>await</code> (PEP 530). Elas consomem geradores assíncronos e esperam corrotinas na expressão. Note a diferença: um <code>await</code> numa list comprehension executa os itens em sequência, não em paralelo. Para concorrência real use <code>asyncio.gather</code> ou <code>TaskGroup</code> (Etapa 7).</p>
<pre><code class="language-python">import asyncio

async def numeros(n):
    for i in range(n):
        await asyncio.sleep(0)
        yield i

async def dobro(x):
    await asyncio.sleep(0)
    return x * 2

async def main():
    a = [i async for i in numeros(3)]                 # async comprehension
    b = [await dobro(i) for i in range(3)]            # sequencial
    c = await asyncio.gather(*(dobro(i) for i in range(3)))   # concorrente
    print(a, b, c)

asyncio.run(main())

# padrões comuns com dados
import csv, io
bruto = "nome,idade\nAna,30\nBia,\nCaio,25\n"
linhas = csv.DictReader(io.StringIO(bruto))
adultos = {l["nome"]: int(l["idade"]) for l in linhas if l["idade"] and int(l["idade"]) &gt;= 18}
print(adultos)

# inversão com colisão: dict comprehension sobrescreve (última vence); detecte antes
original = {"a": 1, "b": 1}
invertido = {v: k for k, v in original.items()}
print(invertido, len(invertido) != len(original))     # True: perdeu uma chave</code></pre>
<div class="callout tip"><strong>DICA</strong> Em pipelines de dados tabulares (pandas, polars) evite comprehension linha a linha: operações vetorizadas rodam em código nativo e costumam ser ordens de grandeza mais rápidas (Etapa 6).</div>`
    }
  ],
  whenToUse: [
    'Mapa e filtro simples de um iterável em lista, set ou dict',
    'Generator expression como argumento de sum, any, all, join, min, max',
    'Set comprehension para unicidade com normalização',
    'Dict comprehension para inverter ou indexar uma coleção',
    'Walrus quando a mesma computação serve ao filtro e à expressão'
  ],
  whenNot: [
    'Não use quando há efeitos colaterais: use for',
    'Não aninhe mais de dois níveis nem acumule vários ifs',
    'Não crie lista intermediária só para somar ou testar: use gerador',
    'Não use comprehension para agrupamento: defaultdict ou groupby',
    'Não esconda lambdas em closures de loop esperando o valor atual'
  ],
  metrics: [
    'timeit e pyperf: comparar loop, comprehension e map com dados reais',
    'cProfile: confirmar se a comprehension é mesmo o gargalo',
    'ruff C4, PERF401, SIM: sugere comprehension, avisa efeito colateral e redundância',
    'sys.getsizeof e tracemalloc: custo de memória da forma materializada',
    'dis.dis: ver o bytecode da comprehension (inlinada desde o 3.12)',
    'complexidade ciclomática (radon, ruff C901): legibilidade'
  ],
  refs: [
    { type: 'doc', title: 'List Comprehensions (tutorial)', author: 'Python Software Foundation', url: 'https://docs.python.org/3/tutorial/datastructures.html#list-comprehensions', note: 'Introdução oficial.' },
    { type: 'doc', title: 'PEP 202: List Comprehensions', author: 'Barry Warsaw', url: 'https://peps.python.org/pep-0202/', note: 'Origem da sintaxe.' },
    { type: 'doc', title: 'PEP 709: Inlined comprehensions', author: 'Carl Meyer', url: 'https://peps.python.org/pep-0709/', note: 'Mudança do 3.12 em escopo e desempenho.' },
    { type: 'doc', title: 'PEP 572: Assignment Expressions', author: 'Chris Angelico, Tim Peters, Guido van Rossum', url: 'https://peps.python.org/pep-0572/', note: 'Walrus e vazamento de escopo em comprehensions.' },
    { type: 'livro', title: 'Fluent Python, 2ª edição (cap. 2: An Array of Sequences)', author: 'Luciano Ramalho', url: 'https://www.oreilly.com/library/view/fluent-python-2nd/9781492056348/', note: 'Listcomps versus map e filter, com medições.' },
    { type: 'portal', title: 'Real Python: When to use a list comprehension in Python', author: 'Real Python', url: 'https://realpython.com/list-comprehension-python/', note: 'Critérios práticos de uso.' },
    { type: 'video', title: 'Live de Python (canal)', author: 'Eduardo Mendes', url: 'https://www.youtube.com/@Dunossauro', note: 'Aulas em português sobre comprehensions e geradores.' }
  ]
};

window.LESSON_CONTENT['closures-escopo'] = {
  id: 'closures-escopo',
  title: 'Escopo, closures e funções',
  etapa: 2, etapaName: 'Python idiomático',
  time: '60 min',
  tags: ['LEGB', 'closure', 'nonlocal', 'functools'],
  tagline: 'Uma closure é uma função que <em>carrega</em> as variáveis do escopo onde nasceu, mesmo depois que esse escopo acabou.',
  intro: `<p>Funções de primeira classe e closures sustentam decorators, callbacks, fábricas de funções, injeção de dependência leve e boa parte do estilo funcional do Python. Para usá-las sem surpresa é preciso saber como o Python resolve nomes (a regra LEGB) e como ele guarda variáveis capturadas (células).</p>
<p>O bug mais famoso desta área é o das lambdas em loop que retornam todas o mesmo valor. Ele não é um capricho: é consequência direta de closures capturarem <em>variáveis</em>, não <em>valores</em>. Quem entende o mecanismo de células resolve esse e outros casos em segundos.</p>
<p>Esta lição cobre resolução de nomes, <code>global</code> e <code>nonlocal</code>, o objeto célula, late binding, o módulo <code>functools</code> (<code>partial</code>, <code>singledispatch</code>, <code>cache</code>) e quando uma closure é melhor ou pior que uma classe.</p>`,
  sections: [
    {
      id: 'legb',
      title: 'LEGB e como o compilador decide o escopo',
      body: `<p>A resolução de um nome segue quatro escopos, nesta ordem: <strong>L</strong>ocal (a função atual), <strong>E</strong>nclosing (funções externas), <strong>G</strong>lobal (o módulo) e <strong>B</strong>uilt-in (<code>len</code>, <code>print</code>). O ponto sutil: o escopo de cada nome é decidido <em>em tempo de compilação</em>, olhando o corpo da função. Se há atribuição ao nome em qualquer ponto da função, ele é local na função inteira.</p>
<pre><code class="language-python">x = "global"

def le_global():
    print(x)              # não há atribuição a x aqui: resolve em G

def quebra():
    try:
        print(x)          # UnboundLocalError: x é local (há atribuição abaixo), mas ainda sem valor
    except UnboundLocalError as e:
        print(type(e).__name__, e)
    x = "local"

le_global()
quebra()

def externa():
    y = "enclosing"
    def interna():
        print(y)          # E: encontra y na função externa
    interna()
externa()

# built-ins podem ser sombreados (cuidado)
def sombreia():
    list = [1, 2]          # sombreia o built-in dentro da função
    return list
# nunca nomeie variáveis como list, dict, id, type, input, sum, max

import builtins
print(builtins.len is len)

# o que o compilador decidiu
def f(a):
    b = a
    return b + g_global
g_global = 1
print(f.__code__.co_varnames, f.__code__.co_names)   # ('a','b')  ('g_global',)</code></pre>
<p>Dois efeitos do "decidido na compilação": o <code>UnboundLocalError</code> acima e o fato de que <code>locals()</code> e <code>globals()</code> são só visões. Em módulos, o escopo global é o <code>__dict__</code> do módulo; em classes, o corpo da classe tem escopo próprio que <em>não</em> é visível para funções aninhadas nela (por isso métodos acessam atributos de classe via <code>self</code> ou <code>Classe.attr</code>).</p>
<div class="callout"><strong>NA ENTREVISTA</strong> "Por que <code>x += 1</code> dentro de função levanta UnboundLocalError mesmo havendo um x global?" Porque <code>+=</code> é atribuição: torna <code>x</code> local na função toda, e a leitura do lado direito acontece antes de existir valor local.</div>`
    },
    {
      id: 'global-nonlocal',
      title: 'global e nonlocal',
      body: `<p><code>global nome</code> declara que atribuições na função vão para o módulo. <code>nonlocal nome</code> declara que atribuições vão para o escopo envolvente mais próximo que tenha o nome (nunca o global). Ler não precisa de declaração; só <em>religar</em> o nome precisa. Mutar um objeto (<code>lista.append</code>) também não precisa, porque não há atribuição ao nome.</p>
<pre><code class="language-python">contador_global = 0

def incrementa_global():
    global contador_global
    contador_global += 1

def faz_contador():
    total = 0
    def incrementa():
        nonlocal total
        total += 1
        return total
    return incrementa

c1, c2 = faz_contador(), faz_contador()
print(c1(), c1(), c2())           # 1 2 1  (cada closure tem sua própria célula)

# sem nonlocal, mutar um objeto contornava a regra
def faz_acumulador():
    itens = []
    def add(x):
        itens.append(x)           # muta, não religa: não precisa de nonlocal
        return list(itens)
    return add

a = faz_acumulador()
print(a(1), a(2))

# nonlocal não alcança o global
def tenta():
    def interna():
        # nonlocal contador_global   # SyntaxError: no binding for nonlocal found
        pass
    return interna</code></pre>
<p>Estado global mutável é fonte de testes frágeis e de problemas de concorrência. Prefira passar dependências por parâmetro, encapsular estado em objetos ou usar <code>contextvars</code> para estado por task/thread. Uso legítimo de <code>global</code>: caches de módulo e inicialização preguiçosa, sempre com pouco alcance e documentação.</p>`
    },
    {
      id: 'celulas',
      title: 'Closures por dentro: células e late binding',
      body: `<p>Quando uma função interna referencia uma variável da externa, o compilador marca essa variável como <em>free variable</em> da interna e <em>cell variable</em> da externa. A variável deixa de morar no frame e passa a viver numa <strong>célula</strong> (objeto <code>cell</code>) compartilhada. A função interna guarda as células em <code>__closure__</code>, e os nomes em <code>__code__.co_freevars</code>. A closure captura a <em>célula</em> (a variável), não o valor do momento.</p>
<pre><code class="language-python">def externa():
    msg = "oi"
    def interna():
        return msg
    return interna

f = externa()
print(f.__code__.co_freevars)               # ('msg',)
print(f.__closure__)                        # (&lt;cell at 0x...: str object at 0x...&gt;,)
print(f.__closure__[0].cell_contents)       # 'oi'
print(externa.__code__.co_cellvars)         # ('msg',)  na externa, é cell variable

# late binding: a célula é lida quando a função RODA, não quando é criada
funcs = []
for i in range(3):
    funcs.append(lambda: i)                 # todas capturam a MESMA célula de i
print([f() for f in funcs])                 # [2, 2, 2]

# correção 1: valor padrão captura no momento da definição
funcs = [lambda i=i: i for i in range(3)]
print([f() for f in funcs])                 # [0, 1, 2]

# correção 2: fábrica (cada chamada cria nova célula)
def fabrica(i):
    return lambda: i
funcs = [fabrica(i) for i in range(3)]
print([f() for f in funcs])                 # [0, 1, 2]

# correção 3: functools.partial liga o valor
from functools import partial
def mostra(i): return i
funcs = [partial(mostra, i) for i in range(3)]
print([f() for f in funcs])                 # [0, 1, 2]</code></pre>
<div class="callout warn"><strong>PEGADINHA</strong> Closures mantêm vivos os objetos capturados. Uma closure que referencia um objeto grande (um DataFrame, uma conexão) o impede de ser coletado enquanto a closure existir. Em callbacks de longa vida, capture só o necessário (ou use <code>weakref</code>).</div>`
    },
    {
      id: 'primeira-classe',
      title: 'Funções de primeira classe e fábricas',
      body: `<p>Funções são valores: podem ser passadas, retornadas, guardadas em estruturas. Isso dá três padrões que substituem hierarquias de classes: <strong>fábricas de funções</strong> (closure configurada), <strong>tabelas de despacho</strong> (dict de callables) e <strong>callbacks</strong>. O Strategy do GoF, por exemplo, em Python costuma ser simplesmente "passe uma função".</p>
<pre><code class="language-python">from collections.abc import Callable

# fábrica: configura uma função com parâmetros fixos
def multiplicador(fator: float) -&gt; Callable[[float], float]:
    def aplica(x: float) -&gt; float:
        return x * fator
    return aplica

dobra, triplica = multiplicador(2), multiplicador(3)
print(dobra(10), triplica(10))

# tabela de despacho: sem if/elif encadeados
def soma(a, b): return a + b
def sub(a, b): return a - b
OPS: dict[str, Callable[[float, float], float]] = {"+": soma, "-": sub}
print(OPS["-"](10, 4))

# função de ordem superior: recebe a estratégia
def aplica_todos(xs, fn):
    return [fn(x) for x in xs]
print(aplica_todos([1, 2, 3], dobra))

# objetos chamáveis: __call__ transforma instância em função com estado
class Contador:
    def __init__(self): self.n = 0
    def __call__(self):
        self.n += 1
        return self.n
c = Contador()
print(c(), c(), callable(c))

# módulo operator: evita lambdas triviais
from operator import itemgetter, attrgetter, methodcaller
dados = [("a", 3), ("b", 1)]
print(sorted(dados, key=itemgetter(1)), methodcaller("upper")("x"))</code></pre>
<p>Closure versus classe: use closure quando há <em>uma</em> operação e pouco estado; use classe quando há várias operações sobre o mesmo estado, necessidade de herdar, inspecionar ou serializar. A closure não é introspectável de forma limpa e não é serializável por <code>pickle</code> (funções aninhadas e lambdas não têm nome qualificado importável), o que importa em <code>multiprocessing</code>.</p>`
    },
    {
      id: 'functools',
      title: 'functools: partial, singledispatch, cache e reduce',
      body: `<p>O <code>functools</code> reúne as ferramentas padrão para trabalhar com funções. <code>partial</code> fixa argumentos e devolve um novo chamável (introspectável, com <code>.func</code>, <code>.args</code>, <code>.keywords</code>). <code>singledispatch</code> faz sobrecarga por tipo do primeiro argumento. <code>cache</code> e <code>lru_cache</code> memoizam.</p>
<pre><code class="language-python">from functools import partial, singledispatch, cache, lru_cache, cached_property, reduce, wraps

# partial: especialização de funções existentes
def eleva(base, exp): return base ** exp
quadrado = partial(eleva, exp=2)
int_base2 = partial(int, base=2)
print(quadrado(5), int_base2("1010"), int_base2.keywords)

# singledispatch: comportamento por tipo, extensível sem editar a função
@singledispatch
def serializa(obj):
    raise TypeError(f"sem serializador para {type(obj).__name__}")

@serializa.register
def _(obj: int): return str(obj)

@serializa.register(list)
def _(obj): return "[" + ",".join(serializa(x) for x in obj) + "]"

print(serializa([1, 2, [3]]))

# memoização
@cache                                # ilimitado (3.9)
def fib(n): return n if n &lt; 2 else fib(n - 1) + fib(n - 2)
print(fib(90), fib.cache_info())

@lru_cache(maxsize=128)               # descarta o menos recente
def caro(x): return x * x
caro(2); caro(2)
print(caro.cache_info())              # hits=1 misses=1
caro.cache_clear()

class Relatorio:
    @cached_property                  # calcula uma vez por instância
    def total(self):
        print("calculando")
        return 42
r = Relatorio(); r.total; r.total

print(reduce(lambda a, b: a * b, [1, 2, 3, 4]))</code></pre>
<div class="callout warn"><strong>PEGADINHA</strong> <code>lru_cache</code> exige argumentos hasheáveis e <em>mantém referências</em> aos argumentos e resultados. Em métodos, o <code>self</code> vira parte da chave e o cache impede a coleta da instância (vazamento de memória). Para métodos, prefira <code>cached_property</code> ou um cache por instância. Não use cache em funções com efeito colateral ou que dependam de estado externo.</div>`
    },
    {
      id: 'armadilhas-closure',
      title: 'Armadilhas e perguntas de entrevista',
      body: `<ul>
<li><strong>Lambdas em loop (late binding):</strong> resolva com default, fábrica ou <code>partial</code>.</li>
<li><strong>Nome sombreado:</strong> um parâmetro ou variável local com o nome de um built-in esconde o built-in sem aviso.</li>
<li><strong>Estado em closure e concorrência:</strong> <code>nonlocal total += 1</code> não é atômico entre threads. Use lock, ou estrutura thread-safe.</li>
<li><strong>Cache em método:</strong> vazamento de instâncias.</li>
<li><strong>Pickle:</strong> closures e lambdas não serializam; use funções de módulo (<code>def</code> no topo) com <code>partial</code> quando precisar passar para outro processo.</li>
<li><strong>Escopo de classe:</strong> comprehension dentro do corpo da classe não enxerga atributos da classe (exceto o primeiro iterável).</li>
</ul>
<pre><code class="language-python">import pickle
from functools import partial

def soma(a, b): return a + b
ok = partial(soma, 1)
print(pickle.loads(pickle.dumps(ok))(2))      # 3: partial de função de módulo serializa

try:
    pickle.dumps(lambda x: x)
except (pickle.PicklingError, AttributeError) as e:
    print("lambda não serializa:", type(e).__name__)

# depuração de closure: ver o que foi capturado
def monta():
    a, b = 1, 2
    def f(): return a + b
    return f
f = monta()
print(dict(zip(f.__code__.co_freevars, (c.cell_contents for c in f.__closure__))))   # {'a': 1, 'b': 2}

# contextvars: estado "global" seguro por task/thread
import contextvars
usuario = contextvars.ContextVar("usuario", default="anon")
token = usuario.set("ana")
print(usuario.get())
usuario.reset(token)
print(usuario.get())</code></pre>
<div class="callout"><strong>NA ENTREVISTA</strong> "O que é uma closure e dê um uso real." Função que captura variáveis do escopo envolvente via células. Uso real: decorators com estado (contador de chamadas, cache), fábricas de validadores configurados, callbacks que lembram contexto. Mostre o <code>__closure__</code> e explique late binding.</div>`
    }
  ],
  whenToUse: [
    'Fábricas de funções configuradas (validadores, formatadores, handlers)',
    'Tabelas de despacho em vez de cadeias de if/elif',
    'partial para especializar funções e passar callbacks com contexto',
    'nonlocal para estado pequeno e local a uma closure (contadores, acumuladores)',
    'singledispatch para comportamento por tipo extensível'
  ],
  whenNot: [
    'Não use closure com estado quando há várias operações sobre o mesmo estado: use classe',
    'Não use global para estado de aplicação: injete dependências',
    'Não use lru_cache em métodos de instâncias de vida longa',
    'Não envie lambdas ou closures a multiprocessing (não serializam)',
    'Não confie em lambdas criadas em loop sem fixar o valor'
  ],
  metrics: [
    'f.__closure__, __code__.co_freevars, co_cellvars: inspecionar capturas',
    'cache_info() do lru_cache: hits, misses, tamanho',
    'ruff B023 (função em loop captura variável), A001 e A002 (sombreia built-in)',
    'mypy: Callable, ParamSpec e anotação de funções de ordem superior',
    'dis.dis: diferença entre LOAD_FAST, LOAD_DEREF e LOAD_GLOBAL',
    'tracemalloc: detectar vazamentos por caches e closures'
  ],
  refs: [
    { type: 'livro', title: 'Fluent Python, 2ª edição (cap. 9: Decorators and Closures)', author: 'Luciano Ramalho', url: 'https://www.oreilly.com/library/view/fluent-python-2nd/9781492056348/', note: 'Variable lookup, nonlocal e a mecânica das closures.' },
    { type: 'doc', title: 'Python Scopes and Namespaces (tutorial)', author: 'Python Software Foundation', url: 'https://docs.python.org/3/tutorial/classes.html#python-scopes-and-namespaces', note: 'A regra LEGB descrita oficialmente.' },
    { type: 'doc', title: 'Execution model: naming and binding', author: 'Python Software Foundation', url: 'https://docs.python.org/3/reference/executionmodel.html#naming-and-binding', note: 'Como o compilador resolve escopos.' },
    { type: 'doc', title: 'functools: Higher-order functions and operations on callable objects', author: 'Python Software Foundation', url: 'https://docs.python.org/3/library/functools.html', note: 'partial, singledispatch, cache, wraps.' },
    { type: 'doc', title: 'PEP 3104: Access to Names in Outer Scopes', author: 'Ka-Ping Yee', url: 'https://peps.python.org/pep-3104/', note: 'Origem do nonlocal.' },
    { type: 'portal', title: 'Real Python: Python Inner Functions, what are they good for?', author: 'Real Python', url: 'https://realpython.com/inner-functions-what-are-they-good-for/', note: 'Closures e fábricas com exemplos.' },
    { type: 'video', title: 'Live de Python (canal)', author: 'Eduardo Mendes', url: 'https://www.youtube.com/@Dunossauro', note: 'Conteúdo em português sobre escopo, closures e funções.' }
  ]
};

window.LESSON_CONTENT['decorators'] = {
  id: 'decorators',
  title: 'Decorators',
  etapa: 2, etapaName: 'Python idiomático',
  time: '75 min',
  tags: ['decorator', 'wraps', 'ParamSpec', 'metaprogramação'],
  tagline: 'Um decorator é só <em>uma função que recebe uma função e devolve outra</em>. O <code>@</code> é açúcar para <code>f = deco(f)</code>.',
  intro: `<p>Decorators aparecem em todo framework Python: <code>@app.get</code> no FastAPI, <code>@pytest.fixture</code>, <code>@dataclass</code>, <code>@property</code>, <code>@lru_cache</code>, <code>@contextmanager</code>, <code>@retry</code>. São o mecanismo para adicionar comportamento transversal (log, métricas, cache, autorização, retry, registro) sem tocar no corpo da função.</p>
<p>Por dentro, eles dependem de duas ideias das lições anteriores: funções são objetos e closures capturam estado. Se isso está sólido, decorators são só uma convenção de três níveis de aninhamento. Mal escritos, porém, destroem metadados, quebram assinaturas, tipagem e funções assíncronas.</p>
<p>Aqui estão a forma básica, <code>functools.wraps</code>, decorators com argumentos, decorators baseados em classe, decorators de classe, empilhamento, tipagem com <code>ParamSpec</code> e os casos de produção (retry, timing, registro, validação).</p>`,
  sections: [
    {
      id: 'basico',
      title: 'A forma básica e o que o @ faz',
      body: `<p>Escrever <code>@deco</code> acima de <code>def f</code> equivale a executar <code>f = deco(f)</code> logo após a definição. O decorator roda <em>uma vez, no momento da definição</em> (no import do módulo), e o nome <code>f</code> passa a apontar para o que ele devolveu, quase sempre uma função <em>wrapper</em> que chama a original.</p>
<pre><code class="language-python">import time

def cronometra(func):
    def wrapper(*args, **kwargs):
        inicio = time.perf_counter()
        try:
            return func(*args, **kwargs)
        finally:
            dur = time.perf_counter() - inicio
            print(f"{func.__name__} levou {dur:.4f}s")
    return wrapper

@cronometra                 # equivale a: processa = cronometra(processa)
def processa(n):
    """Soma de 0 a n."""
    return sum(range(n))

print(processa(1_000_000))
print(processa.__name__, processa.__doc__)     # wrapper None  (metadados perdidos!)

# o decorator executa na definição, o wrapper na chamada
def anuncia(func):
    print(f"decorando {func.__name__}")        # roda no import
    return func                                 # decorator que devolve a própria função (registro)

@anuncia
def x(): ...</code></pre>
<p>Um decorator que devolve a própria função, sem embrulhar, é o padrão de <strong>registro</strong>: guarda a função num dict (rotas, comandos, plugins, handlers) e a devolve intacta. É o mecanismo por trás de <code>@app.route</code>.</p>
<pre><code class="language-python">HANDLERS = {}

def handler(evento):
    def registra(func):
        HANDLERS[evento] = func
        return func
    return registra

@handler("criado")
def ao_criar(payload): return f"criou {payload}"

print(HANDLERS["criado"]("x"))</code></pre>`
    },
    {
      id: 'wraps',
      title: 'functools.wraps e preservação de metadados',
      body: `<p>O wrapper substitui a função original, então <code>__name__</code>, <code>__doc__</code>, <code>__module__</code>, <code>__annotations__</code> e <code>__dict__</code> viram os do wrapper. Isso quebra documentação, logs, introspecção e <code>inspect.signature</code> (usado por frameworks de injeção). <code>functools.wraps</code> copia esses atributos e adiciona <code>__wrapped__</code>, que aponta para a função original (e que <code>inspect.signature</code> segue).</p>
<pre><code class="language-python">import functools, inspect

def log_chamada(func):
    @functools.wraps(func)                  # SEMPRE
    def wrapper(*args, **kwargs):
        print(f"chamando {func.__name__}{args}")
        return func(*args, **kwargs)
    return wrapper

@log_chamada
def soma(a: int, b: int = 0) -&gt; int:
    """Soma dois inteiros."""
    return a + b

print(soma.__name__, soma.__doc__)          # soma  Soma dois inteiros.
print(inspect.signature(soma))              # (a: int, b: int = 0) -&gt; int  (segue __wrapped__)
print(soma.__wrapped__(1, 2))               # acessa a original, útil em testes
print(soma(1, 2))</code></pre>
<div class="callout warn"><strong>PEGADINHA</strong> Esquecer o <code>@wraps</code> faz todas as funções decoradas se chamarem "wrapper": o log perde sentido, o <code>pytest</code> mostra nomes errados, e frameworks que registram por nome (Flask: <code>endpoint</code> duplicado) falham com "View function mapping is overwriting an existing endpoint function".</div>`
    },
    {
      id: 'com-argumentos',
      title: 'Decorators com argumentos: três níveis',
      body: `<p>Quando o decorator recebe argumentos (<code>@retry(tentativas=3)</code>), a expressão <code>retry(tentativas=3)</code> é avaliada primeiro e <em>deve devolver o decorator de verdade</em>. Daí as três camadas: fábrica (recebe a configuração), decorator (recebe a função) e wrapper (recebe a chamada). Para suportar uso com e sem parênteses (<code>@deco</code> e <code>@deco(x=1)</code>), o truque é testar se o primeiro argumento é callable.</p>
<pre><code class="language-python">import functools, time, random

def retry(tentativas=3, espera=0.1, excecoes=(Exception,)):
    def decorator(func):
        @functools.wraps(func)
        def wrapper(*args, **kwargs):
            for n in range(1, tentativas + 1):
                try:
                    return func(*args, **kwargs)
                except excecoes as e:
                    if n == tentativas:
                        raise                          # esgotou: propaga a última exceção
                    time.sleep(espera * 2 ** (n - 1))   # backoff exponencial
        return wrapper
    return decorator

@retry(tentativas=4, espera=0.01, excecoes=(ConnectionError,))
def chama_servico():
    if random.random() &lt; 0.7:
        raise ConnectionError("falhou")
    return "ok"

# aceita @cronometra e @cronometra(prefixo="x")
def cronometra(func=None, *, prefixo=""):
    def decorator(f):
        @functools.wraps(f)
        def wrapper(*a, **kw):
            t0 = time.perf_counter()
            try:
                return f(*a, **kw)
            finally:
                print(f"{prefixo}{f.__name__}: {time.perf_counter() - t0:.4f}s")
        return wrapper
    if func is not None:            # usado sem parênteses
        return decorator(func)
    return decorator                # usado com parênteses

@cronometra
def a(): ...

@cronometra(prefixo="[perf] ")
def b(): ...
a(); b()</code></pre>
<p>Retry de verdade em produção deve usar jitter, limite de tempo total e só repetir erros transitórios e operações idempotentes. Para isso há a biblioteca <code>tenacity</code>; escrever o seu serve para entender o mecanismo.</p>
<div class="callout"><strong>NA ENTREVISTA</strong> "Escreva um decorator <code>@retry(n)</code> ao vivo." Os três níveis, <code>wraps</code>, <code>raise</code> sem argumento para preservar traceback, e a pergunta de volta: "o que acontece com funções async?" (lição abaixo).</div>`
    },
    {
      id: 'classes',
      title: 'Decorators baseados em classe e de classe',
      body: `<p>Dois conceitos diferentes. (1) Um <strong>decorator implementado como classe</strong> (instância chamável, <code>__call__</code>) é útil quando precisa guardar estado inspecionável. (2) Um <strong>decorator aplicado a uma classe</strong> recebe a classe e devolve a mesma (modificada) ou outra, alternativa leve a metaclasses e herança, como o <code>@dataclass</code>.</p>
<pre><code class="language-python">import functools

# (1) decorator como classe: estado exposto como atributo
class conta_chamadas:
    def __init__(self, func):
        functools.update_wrapper(self, func)      # equivalente ao wraps para instâncias
        self.func = func
        self.chamadas = 0
    def __call__(self, *args, **kwargs):
        self.chamadas += 1
        return self.func(*args, **kwargs)

@conta_chamadas
def oi(): return "oi"
oi(); oi()
print(oi.chamadas)                                # 2

# (2) decorator DE classe: adiciona comportamento à classe
def registra_em(registro):
    def decorator(cls):
        registro[cls.__name__] = cls
        return cls
    return decorator

PLUGINS = {}

@registra_em(PLUGINS)
class PluginCsv: ...

def com_repr_auto(cls):
    def __repr__(self):
        campos = ", ".join(f"{k}={v!r}" for k, v in vars(self).items())
        return f"{cls.__name__}({campos})"
    cls.__repr__ = __repr__
    return cls

@com_repr_auto
class Pessoa:
    def __init__(self, nome, idade): self.nome, self.idade = nome, idade

print(Pessoa("Ana", 30), list(PLUGINS))

# os decorators de classe da stdlib que você já usa
from dataclasses import dataclass
@dataclass(frozen=True, slots=True)
class Ponto: x: int; y: int</code></pre>
<p>Decorator-classe tem uma limitação com métodos: a instância não é um <em>descritor</em> por padrão, então <code>self</code> não é vinculado automaticamente quando o objeto decorado é um método da classe. Para decorar métodos com uma classe, implemente <code>__get__</code> (lição 12). Para a maioria dos casos, a forma função é mais simples e funciona em métodos sem trabalho extra.</p>`
    },
    {
      id: 'empilhamento-metodos',
      title: 'Empilhamento, métodos, async e tipagem',
      body: `<p><strong>Ordem:</strong> decorators empilhados aplicam de baixo para cima na definição (o mais próximo da função é o primeiro a embrulhar) e executam de cima para baixo na chamada. <code>@a @b def f</code> é <code>f = a(b(f))</code>.</p>
<pre><code class="language-python">import functools, asyncio, inspect
from collections.abc import Callable, Awaitable
from typing import ParamSpec, TypeVar

def tag(nome):
    def deco(f):
        @functools.wraps(f)
        def w(*a, **k):
            print("entra", nome)
            r = f(*a, **k)
            print("sai", nome)
            return r
        return w
    return deco

@tag("A")
@tag("B")
def f(): print("corpo")
f()      # entra A, entra B, corpo, sai B, sai A

# async: um wrapper síncrono devolveria a corrotina SEM aguardar. Trate os dois casos.
def log(func):
    if inspect.iscoroutinefunction(func):
        @functools.wraps(func)
        async def wrapper(*a, **k):
            print("async antes")
            return await func(*a, **k)
    else:
        @functools.wraps(func)
        def wrapper(*a, **k):
            print("sync antes")
            return func(*a, **k)
    return wrapper

@log
async def busca(): return 42
print(asyncio.run(busca()))

# tipagem correta que preserva a assinatura (PEP 612, ParamSpec)
P = ParamSpec("P")
R = TypeVar("R")

def tipado(func: Callable[P, R]) -&gt; Callable[P, R]:
    @functools.wraps(func)
    def wrapper(*args: P.args, **kwargs: P.kwargs) -&gt; R:
        return func(*args, **kwargs)
    return wrapper

# sintaxe do 3.12 (PEP 695), sem declarar TypeVar e ParamSpec
def tipado312[**Q, T](func: Callable[Q, T]) -&gt; Callable[Q, T]:
    @functools.wraps(func)
    def wrapper(*args: Q.args, **kwargs: Q.kwargs) -&gt; T:
        return func(*args, **kwargs)
    return wrapper

# em métodos, o wrapper recebe self como primeiro item de *args: funciona sem nada especial
class Servico:
    @tipado
    def calcula(self, x: int) -&gt; int: return x * 2
print(Servico().calcula(4))</code></pre>
<div class="callout warn"><strong>PEGADINHA</strong> Aplicar um decorator síncrono em <code>async def</code> faz o wrapper devolver a corrotina sem aguardar, e o <code>await</code> do chamador funciona por acaso, mas o tempo medido e as exceções capturadas ficam errados. Trate async explicitamente ou escreva decorators separados.</div>`
    },
    {
      id: 'producao',
      title: 'Decorators em produção: o que usar e o que evitar',
      body: `<p>Bons usos: comportamento transversal e ortogonal à lógica (observabilidade, cache, retry, autorização, registro, deprecation). Maus usos: decorators que mudam a assinatura ou a semântica de forma não óbvia, que escondem I/O caro, ou empilhados em excesso (três ou quatro camadas dificultam depurar a ordem).</p>
<pre><code class="language-python">import functools, warnings, logging
log = logging.getLogger(__name__)

def deprecated(motivo):
    def deco(func):
        @functools.wraps(func)
        def w(*a, **k):
            warnings.warn(f"{func.__name__} está obsoleta: {motivo}", DeprecationWarning, stacklevel=2)
            return func(*a, **k)
        return w
    return deco

def requer_papel(papel):
    def deco(func):
        @functools.wraps(func)
        def w(usuario, *a, **k):
            if papel not in usuario.get("papeis", ()):
                raise PermissionError(f"requer {papel}")
            return func(usuario, *a, **k)
        return w
    return deco

@requer_papel("admin")
def apaga(usuario, recurso): return f"{recurso} apagado"
print(apaga({"papeis": ["admin"]}, "r1"))

def com_log_de_erro(func):
    @functools.wraps(func)
    def w(*a, **k):
        try:
            return func(*a, **k)
        except Exception:
            log.exception("falha em %s", func.__qualname__)   # registra traceback e relança
            raise
    return w</code></pre>
<p>Dicas de teste: use <code>__wrapped__</code> para testar a função sem o decorator; teste o decorator com uma função falsa simples; e verifique <code>@wraps</code> com <code>assert f.__name__ == "f"</code>. A biblioteca <code>wrapt</code> resolve casos difíceis (decorators que funcionam em funções, métodos, classmethods e descritores de forma uniforme).</p>
<div class="callout tip"><strong>DICA</strong> Ao decorar métodos de classe com <code>@classmethod</code> ou <code>@staticmethod</code>, coloque seu decorator <em>abaixo</em> deles (mais perto da função): <code>@classmethod</code> deve ser o mais externo.</div>`
    }
  ],
  whenToUse: [
    'Comportamento transversal: log, métricas, retry, cache, autorização, deprecation',
    'Registro de funções ou classes (rotas, comandos, plugins, handlers)',
    'Decorator de classe como alternativa leve a metaclasse ou herança para adicionar métodos',
    'functools.wraps em todo decorator que embrulha função',
    'ParamSpec para preservar a assinatura para o type checker'
  ],
  whenNot: [
    'Não use decorator para lógica de negócio central: fica invisível',
    'Não empilhe quatro ou mais decorators sem necessidade',
    'Não esqueça @wraps: quebra nome, docstring, assinatura e frameworks',
    'Não use decorator síncrono em função async sem tratar o caso',
    'Não esconda I/O caro ou efeitos colaterais surpreendentes dentro do wrapper'
  ],
  metrics: [
    'inspect.signature e __wrapped__: confirmar que a assinatura foi preservada',
    'mypy e pyright: verificam decorators tipados com ParamSpec',
    'pytest: testar a função sem decorator via __wrapped__',
    'ruff e pylint: avisos de decorators mal formados',
    'tenacity, wrapt, functools: bibliotecas maduras para os casos difíceis',
    'cProfile: custo adicionado por camadas de wrapper em caminhos quentes'
  ],
  refs: [
    { type: 'livro', title: 'Fluent Python, 2ª edição (cap. 9: Decorators and Closures)', author: 'Luciano Ramalho', url: 'https://www.oreilly.com/library/view/fluent-python-2nd/9781492056348/', note: 'Tratamento completo, inclusive decorators parametrizados.' },
    { type: 'doc', title: 'PEP 318: Decorators for Functions and Methods', author: 'Kevin D. Smith et al.', url: 'https://peps.python.org/pep-0318/', note: 'Origem da sintaxe @.' },
    { type: 'doc', title: 'PEP 3129: Class Decorators', author: 'Collin Winter', url: 'https://peps.python.org/pep-3129/', note: 'Decoradores aplicados a classes.' },
    { type: 'doc', title: 'PEP 612: Parameter Specification Variables', author: 'Mark Mendoza', url: 'https://peps.python.org/pep-0612/', note: 'Tipagem de decorators que preservam a assinatura.' },
    { type: 'doc', title: 'functools.wraps', author: 'Python Software Foundation', url: 'https://docs.python.org/3/library/functools.html#functools.wraps', note: 'Referência de wraps e update_wrapper.' },
    { type: 'portal', title: 'Real Python: Primer on Python Decorators', author: 'Real Python', url: 'https://realpython.com/primer-on-python-decorators/', note: 'Guia completo e prático.' },
    { type: 'doc', title: 'wrapt', author: 'Graham Dumpleton', url: 'https://wrapt.readthedocs.io/', note: 'Biblioteca e artigos sobre decorators corretos.' },
    { type: 'doc', title: 'tenacity', author: 'Julien Danjou et al.', url: 'https://tenacity.readthedocs.io/', note: 'Retry de produção, referência de design.' },
    { type: 'video', title: 'Live de Python (canal)', author: 'Eduardo Mendes', url: 'https://www.youtube.com/@Dunossauro', note: 'Aulas em português sobre decorators.' }
  ]
};

window.LESSON_CONTENT['context-managers'] = {
  id: 'context-managers',
  title: 'Context managers',
  etapa: 2, etapaName: 'Python idiomático',
  time: '60 min',
  tags: ['with', 'contextlib', 'ExitStack', 'recursos'],
  tagline: 'O <code>with</code> garante que a limpeza roda, aconteça o que acontecer: é o <em>try/finally</em> promovido a protocolo.',
  intro: `<p>Todo recurso adquirido precisa ser liberado: arquivo, conexão, lock, transação, diretório temporário, span de tracing. O erro clássico é liberar só no caminho feliz e vazar no caminho de exceção. O <code>with</code> resolve isso de forma declarativa: adquirir na entrada, liberar na saída, sempre.</p>
<p>O protocolo é pequeno (<code>__enter__</code> e <code>__exit__</code>) e o módulo <code>contextlib</code> o torna quase gratuito de implementar. Dominar isso inclui saber o que o <code>with</code> expande, como suprimir exceções de forma consciente, como compor um número dinâmico de recursos com <code>ExitStack</code> e como fazer o equivalente assíncrono.</p>
<p>Em revisões de código sênior, a presença (ou ausência) de <code>with</code> em torno de recursos e a correção da limpeza são indicadores diretos de maturidade.</p>`,
  sections: [
    {
      id: 'expansao',
      title: 'O que o with expande (PEP 343)',
      body: `<p>Dado <code>with EXPR as VAR: BLOCO</code>, o Python avalia <code>EXPR</code> para obter o gerenciador, chama <code>type(mgr).__enter__(mgr)</code> (o valor devolvido vai para <code>VAR</code>) e executa <code>BLOCO</code> dentro de um <code>try</code>. Na saída, normal ou por exceção, chama <code>__exit__(exc_type, exc, tb)</code>. Se houve exceção e o <code>__exit__</code> devolver um valor verdadeiro, a exceção é <strong>suprimida</strong>; senão, ela é relançada.</p>
<pre><code class="language-python"># equivalência simplificada do with
class Gerenciador:
    def __enter__(self):
        print("entrou")
        return self
    def __exit__(self, exc_type, exc, tb):
        print("saiu", exc_type.__name__ if exc_type else None)
        return False                    # False/None: não suprime

mgr = Gerenciador()
valor = mgr.__enter__()
try:
    print("corpo")
    raise ValueError("boom")
except BaseException as e:
    if not mgr.__exit__(type(e), e, e.__traceback__):
        pass                            # relançaria aqui
else:
    mgr.__exit__(None, None, None)

# o mesmo, com with
try:
    with Gerenciador():
        raise ValueError("boom")
except ValueError:
    print("a exceção atravessou o with")

# vários recursos: ordem LIFO na saída
with open(__file__, encoding="utf-8") as a, open(__file__, encoding="utf-8") as b:
    pass

# parênteses (oficial desde o 3.10) para quebrar linhas
with (
    open(__file__, encoding="utf-8") as f1,
    open(__file__, encoding="utf-8") as f2,
):
    pass</code></pre>
<p>Detalhes: <code>__exit__</code> é chamado mesmo em <code>return</code>, <code>break</code> e <code>continue</code> dentro do bloco, e em <code>KeyboardInterrupt</code>. A busca de <code>__enter__</code> e <code>__exit__</code> é feita no <em>tipo</em>, não na instância. Se <code>__enter__</code> falhar, <code>__exit__</code> não é chamado.</p>
<div class="callout warn"><strong>PEGADINHA</strong> Um <code>__exit__</code> que devolve <code>True</code> por descuido (por exemplo, a última expressão do método é verdadeira) engole todas as exceções. Devolva <code>None</code> ou <code>False</code> explicitamente quando não quiser suprimir.</div>`
    },
    {
      id: 'classe',
      title: 'Implementando com classe: casos reais',
      body: `<p>Implemente como classe quando o gerenciador tem estado, precisa ser reutilizável ou inspecionável, ou deve ser também um objeto de domínio (conexão, transação, lock). O exemplo clássico: transação com commit na saída normal e rollback na exceção.</p>
<pre><code class="language-python">import sqlite3, time

class Transacao:
    def __init__(self, conn):
        self.conn = conn
    def __enter__(self):
        self.cursor = self.conn.cursor()
        return self.cursor
    def __exit__(self, exc_type, exc, tb):
        if exc_type is None:
            self.conn.commit()
        else:
            self.conn.rollback()        # exceção: desfaz e propaga (retorno None)
        self.cursor.close()

conn = sqlite3.connect(":memory:")
conn.execute("create table t (x int)")
with Transacao(conn) as cur:
    cur.execute("insert into t values (1)")
try:
    with Transacao(conn) as cur:
        cur.execute("insert into t values (2)")
        raise RuntimeError("falha no meio")
except RuntimeError:
    pass
print(conn.execute("select count(*) from t").fetchone())   # (1,) o segundo insert foi desfeito

class Cronometro:
    def __enter__(self):
        self.t0 = time.perf_counter()
        return self
    def __exit__(self, *exc):
        self.duracao = time.perf_counter() - self.t0

with Cronometro() as c:
    sum(range(100_000))
print(f"{c.duracao:.5f}s")              # o objeto continua válido depois do with

# suprimir apenas o que se espera
class Ignora:
    def __init__(self, *tipos): self.tipos = tipos
    def __exit__(self, exc_type, exc, tb):
        return exc_type is not None and issubclass(exc_type, self.tipos)
    def __enter__(self): return self

with Ignora(FileNotFoundError):
    open("nao-existe.txt")             # silenciado, de propósito</code></pre>
<p>Nota: o <code>sqlite3.Connection</code> usado como gerenciador (<code>with conn:</code>) faz commit ou rollback, mas <em>não fecha</em> a conexão. É um dos pontos em que a stdlib não segue a intuição de "with fecha": leia a documentação de cada gerenciador.</p>`
    },
    {
      id: 'contextlib',
      title: 'contextlib: contextmanager, closing, suppress e companhia',
      body: `<p>O decorator <code>@contextmanager</code> transforma um gerador de um único <code>yield</code> em gerenciador: o que vem antes do <code>yield</code> é o <code>__enter__</code>, o valor do <code>yield</code> é o que o <code>as</code> recebe, e o que vem depois é o <code>__exit__</code>. Exceções do bloco são <em>relançadas dentro do gerador, no ponto do yield</em>, então a limpeza deve ir em <code>try/finally</code>.</p>
<pre><code class="language-python">from contextlib import (contextmanager, closing, suppress, redirect_stdout, nullcontext,
                        chdir, ExitStack)
import io, os, tempfile, pathlib

@contextmanager
def diretorio_temporario():
    import shutil
    caminho = pathlib.Path(tempfile.mkdtemp())
    try:
        yield caminho                  # o corpo do with roda aqui
    finally:
        shutil.rmtree(caminho)         # limpeza mesmo com exceção

with diretorio_temporario() as d:
    (d / "a.txt").write_text("x", encoding="utf-8")
    print(d.exists())
print(d.exists())                      # False

@contextmanager
def muda_env(**novos):
    antigos = {k: os.environ.get(k) for k in novos}
    os.environ.update(novos)
    try:
        yield
    finally:
        for k, v in antigos.items():
            if v is None: os.environ.pop(k, None)
            else: os.environ[k] = v

with muda_env(MODO="teste"):
    print(os.environ["MODO"])

# utilitários prontos
with suppress(FileNotFoundError):
    os.remove("nao-existe.tmp")        # mais claro que try/except: pass

buf = io.StringIO()
with redirect_stdout(buf):
    print("capturado")
print(repr(buf.getvalue()))

with chdir(tempfile.gettempdir()):     # 3.11
    print(os.getcwd() == os.path.realpath(tempfile.gettempdir()))

class Fonte:
    def close(self): print("fechou")
with closing(Fonte()) as f:            # chama .close() na saída, para objetos sem __exit__
    pass

with nullcontext():                    # no-op: unifica ramos opcionais
    pass</code></pre>
<div class="callout warn"><strong>PEGADINHA</strong> No <code>@contextmanager</code>, sem <code>try/finally</code> em volta do <code>yield</code>, uma exceção no bloco impede a limpeza (o código depois do yield não roda). E o gerador deve ter exatamente um <code>yield</code>; senão, <code>RuntimeError: generator didn't stop</code>. Gerenciadores criados com <code>@contextmanager</code> são de uso único; para reusar, chame a função de novo.</div>`
    },
    {
      id: 'exitstack',
      title: 'ExitStack: quantidade dinâmica de recursos',
      body: `<p>Quando o número de recursos só é conhecido em tempo de execução (abrir N arquivos, uma conexão por shard, recursos condicionais), um <code>with</code> estático não serve. O <code>ExitStack</code> mantém uma pilha de callbacks de saída e os executa em ordem inversa, mesmo que a abertura de algum recurso no meio falhe (os já abertos são fechados).</p>
<pre><code class="language-python">from contextlib import ExitStack, contextmanager
import tempfile, pathlib

def abre_todos(caminhos):
    with ExitStack() as stack:
        arquivos = [stack.enter_context(open(p, encoding="utf-8")) for p in caminhos]
        # se o 3º open falhar, o 1º e o 2º serão fechados automaticamente
        return [a.readline().strip() for a in arquivos]

d = pathlib.Path(tempfile.mkdtemp())
for i in range(3):
    (d / f"{i}.txt").write_text(f"linha {i}\\n", encoding="utf-8")
print(abre_todos([d / f"{i}.txt" for i in range(3)]))

# registrar limpeza arbitrária
with ExitStack() as stack:
    stack.callback(print, "limpeza 1")
    stack.callback(print, "limpeza 2")          # roda primeiro (LIFO)
    print("trabalho")

# recurso opcional
def processa(usar_lock, lock):
    with ExitStack() as stack:
        if usar_lock:
            stack.enter_context(lock)
        return "ok"

# transferir a posse: pop_all() evita fechar se tudo deu certo (padrão de construtor)
class Pool:
    def __init__(self, caminhos):
        with ExitStack() as stack:
            self.arquivos = [stack.enter_context(open(p, encoding="utf-8")) for p in caminhos]
            self._stack = stack.pop_all()       # sucesso: o ExitStack local não fecha mais
    def close(self):
        self._stack.close()
    def __enter__(self): return self
    def __exit__(self, *exc): self.close()

with Pool([d / "0.txt", d / "1.txt"]) as pool:
    print(len(pool.arquivos))</code></pre>
<p>O <code>AsyncExitStack</code> faz o mesmo para <code>async with</code>. O padrão <code>pop_all</code> resolve um problema real: um construtor que abre vários recursos precisa limpar os já abertos se um falhar, e entregar a posse ao objeto se tudo deu certo.</p>`
    },
    {
      id: 'async-with',
      title: 'async with e gerenciadores assíncronos',
      body: `<p>Quando adquirir ou liberar o recurso exige I/O assíncrono (abrir conexão, adquirir um lock do asyncio, abrir sessão HTTP), o protocolo é <code>__aenter__</code> e <code>__aexit__</code>, usados com <code>async with</code>. O equivalente de <code>@contextmanager</code> é <code>@asynccontextmanager</code>, em cima de um gerador assíncrono.</p>
<pre><code class="language-python">import asyncio
from contextlib import asynccontextmanager

class Conexao:
    async def __aenter__(self):
        await asyncio.sleep(0)          # simula handshake
        print("conectou")
        return self
    async def __aexit__(self, exc_type, exc, tb):
        await asyncio.sleep(0)
        print("desconectou")
        return False

@asynccontextmanager
async def timeout_logado(segundos):
    print("início")
    try:
        async with asyncio.timeout(segundos):     # 3.11
            yield
    finally:
        print("fim")

async def main():
    async with Conexao() as c, timeout_logado(1):
        await asyncio.sleep(0.01)
        print("trabalhando")

    lock = asyncio.Lock()
    async with lock:                    # asyncio.Lock é gerenciador assíncrono
        print("seção crítica")

asyncio.run(main())</code></pre>
<p>Regra: o protocolo síncrono em código <code>async</code> bloqueia o event loop se o <code>__enter__</code> ou <code>__exit__</code> fizer I/O. Para recursos que só têm API bloqueante, rode em thread (<code>asyncio.to_thread</code>) e embrulhe. Bibliotecas como <code>aiohttp</code>, <code>httpx</code> e drivers de banco assíncronos expõem seus recursos assim.</p>
<div class="callout"><strong>NA ENTREVISTA</strong> "Por que não usar try/finally direto?" Dá no mesmo comportamento, mas o <code>with</code> garante o par entrada/saída em um lugar só (quem escreve o gerenciador acerta uma vez, todos que usam acertam sempre), compõe com vários recursos e torna o escopo do recurso visível na indentação.</div>`
    },
    {
      id: 'armadilhas-cm',
      title: 'Armadilhas, testes e padrões em produção',
      body: `<ul>
<li><strong>Exceção dentro do __exit__:</strong> substitui a exceção original (que fica em <code>__context__</code>). Faça a limpeza defensiva, registre falhas e não deixe o erro de limpeza esconder o erro real.</li>
<li><strong>Reentrância:</strong> muitos gerenciadores (de <code>@contextmanager</code>) não são reutilizáveis nem reentrantes. A documentação distingue "reusable" e "reentrant" (<code>threading.RLock</code> é reentrante, <code>Lock</code> não).</li>
<li><strong>Escopo do valor de <code>as</code>:</strong> a variável continua existindo após o <code>with</code> (é só um nome), mas o recurso já foi liberado.</li>
<li><strong>Gerador de arquivo fora do with:</strong> devolver <code>open(...)</code> sem <code>with</code> deixa o fechamento para o coletor, não confiável fora do CPython.</li>
<li><strong>ResourceWarning:</strong> rode testes com <code>-W error::ResourceWarning</code> para pegar arquivos não fechados.</li>
</ul>
<pre><code class="language-python">import warnings, gc, contextlib

# o erro de limpeza esconde o original
class Ruim:
    def __enter__(self): return self
    def __exit__(self, *exc): raise RuntimeError("falha ao fechar")

try:
    with Ruim():
        raise ValueError("erro real")
except RuntimeError as e:
    print("viu:", e, "| causa original em __context__:", repr(e.__context__))

# padrão de produção: timer + log como gerenciador reaproveitável
import logging, time
log = logging.getLogger("perf")

@contextlib.contextmanager
def medido(nome):
    t0 = time.perf_counter()
    try:
        yield
    finally:
        log.info("%s levou %.3fs", nome, time.perf_counter() - t0)

# testar gerenciador: pytest com a exceção atravessando
import pytest
def test_rollback():
    with pytest.raises(ValueError):
        with Transacao_falsa():
            raise ValueError
class Transacao_falsa:
    def __enter__(self): return self
    def __exit__(self, t, e, tb): return False</code></pre>
<p>Padrões de produção: <code>with</code> para locks (<code>threading.Lock</code>), sessões de banco por requisição, spans de tracing (OpenTelemetry), mocks temporários (<code>unittest.mock.patch</code> é gerenciador e decorator), <code>tempfile.TemporaryDirectory</code> e <code>warnings.catch_warnings</code>. Em FastAPI, o ciclo de vida da aplicação (<code>lifespan</code>) é um <code>asynccontextmanager</code>.</p>`
    }
  ],
  whenToUse: [
    'Todo recurso com aquisição e liberação: arquivo, conexão, lock, transação, tmpdir',
    '@contextmanager para gerenciadores simples sem estado complexo',
    'Classe com __enter__ e __exit__ quando há estado, reuso ou integração com domínio',
    'ExitStack para número dinâmico ou condicional de recursos',
    'async with e asynccontextmanager em código assíncrono'
  ],
  whenNot: [
    'Não devolva True em __exit__ sem querer: engole exceções',
    'Não esqueça try/finally em volta do yield no @contextmanager',
    'Não use o protocolo síncrono com I/O dentro de código async',
    'Não deixe a limpeza lançar exceção que esconde a original',
    'Não use suppress(Exception): suprima só o tipo específico esperado'
  ],
  metrics: [
    'python -W error::ResourceWarning: pega arquivos e sockets não fechados',
    'ruff SIM115 (open sem with), SIM117 (with aninhado), B017: padrões de with',
    'tracemalloc e lsof: vazamento de descritores e memória',
    'pytest.raises e pytest-asyncio: testar caminhos de exceção e async with',
    'contextlib.ExitStack e AsyncExitStack: composição verificável',
    'threading e asyncio: distinção entre gerenciador reusável e reentrante'
  ],
  refs: [
    { type: 'doc', title: 'contextlib: Utilities for with-statement contexts', author: 'Python Software Foundation', url: 'https://docs.python.org/3/library/contextlib.html', note: 'contextmanager, ExitStack, suppress, closing, chdir.' },
    { type: 'doc', title: 'PEP 343: The with statement', author: 'Guido van Rossum, Alyssa Coghlan', url: 'https://peps.python.org/pep-0343/', note: 'A expansão exata do with.' },
    { type: 'doc', title: 'With Statement Context Managers (data model)', author: 'Python Software Foundation', url: 'https://docs.python.org/3/reference/datamodel.html#with-statement-context-managers', note: 'Contrato de __enter__ e __exit__.' },
    { type: 'doc', title: 'PEP 492: Coroutines with async and await syntax', author: 'Yury Selivanov', url: 'https://peps.python.org/pep-0492/', note: 'Introduz async with.' },
    { type: 'livro', title: 'Fluent Python, 2ª edição (cap. 18: with, match, and else Blocks)', author: 'Luciano Ramalho', url: 'https://www.oreilly.com/library/view/fluent-python-2nd/9781492056348/', note: 'Context managers e contextlib em profundidade.' },
    { type: 'portal', title: 'Real Python: Context Managers and the with statement', author: 'Real Python', url: 'https://realpython.com/python-with-statement/', note: 'Guia prático com exemplos.' },
    { type: 'video', title: 'Live de Python (canal)', author: 'Eduardo Mendes', url: 'https://www.youtube.com/@Dunossauro', note: 'Aulas em português sobre context managers e contextlib.' }
  ]
};

window.LESSON_CONTENT['dunder-methods'] = {
  id: 'dunder-methods',
  title: 'Data model e métodos especiais',
  etapa: 2, etapaName: 'Python idiomático',
  time: '90 min',
  tags: ['dunder', 'descritores', 'operadores', 'protocolos'],
  tagline: 'Os métodos especiais são o <em>idioma</em> pelo qual seus objetos se encaixam na linguagem: <code>len</code>, <code>+</code>, <code>in</code>, <code>for</code> e <code>print</code> chamam dunders.',
  intro: `<p>O Python Data Model é a especificação de como a linguagem interage com os objetos: <code>len(x)</code> chama <code>type(x).__len__(x)</code>, <code>a + b</code> chama <code>__add__</code>, <code>x[i]</code> chama <code>__getitem__</code>, <code>with</code> chama <code>__enter__</code>. Implementar esses métodos (os "dunders", de double underscore) faz um objeto seu se comportar como um tipo nativo e funcionar com toda a stdlib e o ecossistema.</p>
<p>É também a base do que se chama "duck typing" e "protocolos": não importa a herança, importa quais métodos o objeto responde. Isso explica como <code>sorted</code> funciona com qualquer coisa que implemente <code>__lt__</code>, e como bibliotecas como NumPy, pandas e SQLAlchemy criam uma sintaxe natural em cima do Python.</p>
<p>Esta é a lição de síntese da Etapa 2: representação, igualdade e hash, ordenação, operadores aritméticos, contêineres, acesso a atributos (<code>__getattr__</code>), e descritores, o mecanismo que está por trás de <code>property</code>, métodos, <code>classmethod</code> e dos ORMs.</p>`,
  sections: [
    {
      id: 'repr-str',
      title: 'Representação: __repr__, __str__, __format__',
      body: `<p><code>__repr__</code> é para desenvolvedores: sem ambiguidade, idealmente algo que parece o código para recriar o objeto. <code>__str__</code> é para o usuário final. Se só um for definido, defina <code>__repr__</code>: <code>str()</code> cai nele quando não há <code>__str__</code>, mas o contrário não vale. O <code>__repr__</code> aparece em logs, no REPL, em tracebacks e dentro de contêineres, então é o mais importante.</p>
<pre><code class="language-python">class Dinheiro:
    def __init__(self, centavos: int, moeda: str = "BRL"):
        self.centavos, self.moeda = centavos, moeda

    def __repr__(self):
        return f"Dinheiro({self.centavos!r}, {self.moeda!r})"      # repr dos campos, recriável

    def __str__(self):
        return f"{self.moeda} {self.centavos / 100:,.2f}"

    def __format__(self, spec):
        if spec == "curto":
            return f"{self.centavos / 100:.0f}"
        return format(str(self), spec)

d = Dinheiro(123456)
print(repr(d), str(d), [d])             # lista usa repr
print(f"{d}", f"{d:curto}", f"{d!r}")
print(f"{d:&gt;15}")                       # delega ao spec de str

# __repr__ seguro contra ciclos: reprlib limita o tamanho
import reprlib
print(reprlib.repr(list(range(1000))))

# dataclass gera __repr__, __eq__ e mais, a partir dos campos
from dataclasses import dataclass
@dataclass
class Pessoa:
    nome: str
    idade: int
print(Pessoa("Ana", 30))</code></pre>
<div class="callout tip"><strong>DICA</strong> Escreva o <code>__repr__</code> primeiro e nunca o deixe levantar exceção: um <code>__repr__</code> quebrado esconde o erro real, porque o traceback tenta imprimir o objeto.</div>`
    },
    {
      id: 'eq-hash',
      title: 'Igualdade, hash e ordenação',
      body: `<p><code>__eq__</code> define <code>==</code>. Se você define <code>__eq__</code> numa classe sem definir <code>__hash__</code>, o Python põe <code>__hash__ = None</code>: a instância passa a ser <em>não hasheável</em>, para evitar violar o contrato (iguais devem ter hash igual). Para usar como chave de dict ou elemento de set, defina os dois, com base nos mesmos campos imutáveis. Retorne <code>NotImplemented</code> (não <code>False</code>) para tipos que você não conhece, dando chance ao outro operando.</p>
<pre><code class="language-python">from functools import total_ordering

@total_ordering                     # gera &lt;=, &gt;, &gt;= a partir de __eq__ e __lt__
class Versao:
    def __init__(self, texto):
        self.partes = tuple(int(p) for p in texto.split("."))

    def __eq__(self, outro):
        if not isinstance(outro, Versao):
            return NotImplemented   # devolve o controle ao outro operando
        return self.partes == outro.partes

    def __lt__(self, outro):
        if not isinstance(outro, Versao):
            return NotImplemented
        return self.partes &lt; outro.partes

    def __hash__(self):
        return hash(self.partes)    # coerente com __eq__: mesmos campos

    def __repr__(self): return f"Versao({'.'.join(map(str, self.partes))!r})"

print(Versao("1.2.0") &lt; Versao("1.10.0"))               # True (compara números, não strings)
print(sorted([Versao("2.0"), Versao("1.5"), Versao("1.10")]))
print({Versao("1.0"): "a"}[Versao("1.0")])
print(Versao("1.0") == "1.0")                            # False: ambos devolvem NotImplemented, cai na identidade

# armadilha: mutar um campo usado no hash depois de inserir em set
class P:
    def __init__(self, x): self.x = x
    def __eq__(self, o): return isinstance(o, P) and self.x == o.x
    def __hash__(self): return hash(self.x)
p = P(1); s = {p}
p.x = 2
print(p in s)                      # False: o hash mudou, o item ficou "perdido" na tabela</code></pre>
<p>Para a maioria dos casos, <code>@dataclass(frozen=True)</code> ou <code>@dataclass(order=True)</code> gera tudo isso de forma correta. Para comparações assimétricas entre tipos diferentes (um <code>Dinheiro</code> contra um <code>int</code>), devolva <code>NotImplemented</code> e deixe o Python tentar o método refletido do outro lado.</p>
<div class="callout"><strong>NA ENTREVISTA</strong> "Por que objetos iguais precisam ter o mesmo hash, e o que acontece se você mutar um objeto dentro de um set?" Porque o set localiza o item pelo hash; objetos iguais com hashes diferentes cairiam em slots diferentes e o set aceitaria duplicatas. Mutar o campo do hash deixa o item no slot antigo, inalcançável.</div>`
    },
    {
      id: 'operadores',
      title: 'Operadores, refletidos e NotImplemented',
      body: `<p>Para <code>a + b</code>, o Python tenta <code>type(a).__add__(a, b)</code>. Se devolver <code>NotImplemented</code> (ou não existir), tenta o <em>refletido</em> <code>type(b).__radd__(b, a)</code>. Se a classe de <code>b</code> é subclasse da de <code>a</code>, o refletido de <code>b</code> tem prioridade. Há também as formas in-place (<code>__iadd__</code>, usada por <code>+=</code>; se ausente, cai em <code>__add__</code> e religa o nome).</p>
<pre><code class="language-python">import math

class Vetor:
    __slots__ = ("x", "y")
    def __init__(self, x=0.0, y=0.0): self.x, self.y = x, y

    def __repr__(self): return f"Vetor({self.x!r}, {self.y!r})"
    def __eq__(self, o): return isinstance(o, Vetor) and (self.x, self.y) == (o.x, o.y)
    def __hash__(self): return hash((self.x, self.y))
    def __bool__(self): return bool(self.x or self.y)         # Vetor nulo é falso
    def __abs__(self): return math.hypot(self.x, self.y)
    def __neg__(self): return Vetor(-self.x, -self.y)

    def __add__(self, o):
        if not isinstance(o, Vetor): return NotImplemented
        return Vetor(self.x + o.x, self.y + o.y)

    def __mul__(self, k):
        if not isinstance(k, (int, float)): return NotImplemented
        return Vetor(self.x * k, self.y * k)
    __rmul__ = __mul__                  # 3 * v funciona: int.__mul__ devolve NotImplemented, cai aqui

    def __matmul__(self, o):            # @ como produto escalar
        return self.x * o.x + self.y * o.y

v, w = Vetor(1, 2), Vetor(3, 4)
print(v + w, 2 * v, v * 2, -v, abs(w), v @ w, bool(Vetor()))
try:
    v + 1
except TypeError as e:
    print(e)                            # unsupported operand type(s) for +: 'Vetor' and 'int'

print(sum([v, w], Vetor()))             # sum precisa de início do tipo certo (0 + Vetor falharia)</code></pre>
<p>Cada operador tem seu dunder: aritméticos (<code>__sub__</code>, <code>__truediv__</code>, <code>__floordiv__</code>, <code>__mod__</code>, <code>__pow__</code>), bit a bit (<code>__and__</code>, <code>__or__</code>, <code>__xor__</code>, <code>__lshift__</code>), comparação (<code>__lt__</code> e família), conversão (<code>__int__</code>, <code>__float__</code>, <code>__index__</code>), e unários. Respeite a convenção: operadores devolvem objetos novos e não mutam os operandos (exceto os in-place).</p>
<div class="callout warn"><strong>PEGADINHA</strong> Devolver <code>NotImplemented</code> é diferente de <code>raise NotImplementedError</code>. O primeiro é um valor sentinela que sinaliza "não sei lidar com esse tipo, tente o outro lado"; o segundo é uma exceção para métodos abstratos. Trocar um pelo outro quebra o despacho dos operadores.</div>`
    },
    {
      id: 'conteineres',
      title: 'Contêineres e protocolos de sequência',
      body: `<p>Para parecer uma sequência basta implementar <code>__len__</code> e <code>__getitem__</code>: o Python fornece, por herança do protocolo, iteração via <code>__getitem__</code> com índices crescentes (fallback), <code>in</code> por varredura, <code>reversed</code> e fatiamento (se você tratar <code>slice</code>). Para ser um mapeamento, <code>__getitem__</code>, <code>__len__</code>, <code>__iter__</code>. Em vez de implementar tudo na mão, herde de <code>collections.abc</code> (<code>Sequence</code>, <code>MutableMapping</code>), que preenche os métodos derivados a partir dos abstratos.</p>
<pre><code class="language-python">from collections.abc import Sequence, MutableMapping

class Baralho:
    naipes = "copas ouros paus espadas".split()
    valores = [str(n) for n in range(2, 11)] + list("JQKA")

    def __init__(self):
        self._cartas = [(v, n) for n in self.naipes for v in self.valores]

    def __len__(self): return len(self._cartas)

    def __getitem__(self, idx):                 # trata índice e fatia
        if isinstance(idx, slice):
            return self._cartas[idx]
        return self._cartas[idx]

b = Baralho()
print(len(b), b[0], b[-1], b[:2])
print(("A", "copas") in b)                       # in via __iter__ ou __getitem__
print(list(reversed(b))[:1])
import random
print(random.choice(b) in b)                     # choice usa __len__ e __getitem__

# herdar de Sequence: ganha index, count, __contains__, __iter__, __reversed__
class Faixa(Sequence):
    def __init__(self, n): self.n = n
    def __len__(self): return self.n
    def __getitem__(self, i):
        if isinstance(i, slice): return [self[j] for j in range(*i.indices(self.n))]
        if not 0 &lt;= i &lt; self.n: raise IndexError(i)
        return i * i
f = Faixa(5)
print(list(f), f.index(9), 16 in f, f[1:4])

# mapeamento com normalização de chave
class DictInsensivel(MutableMapping):
    def __init__(self): self._d = {}
    def __getitem__(self, k): return self._d[k.lower()]
    def __setitem__(self, k, v): self._d[k.lower()] = v
    def __delitem__(self, k): del self._d[k.lower()]
    def __iter__(self): return iter(self._d)
    def __len__(self): return len(self._d)
h = DictInsensivel(); h["Content-Type"] = "json"
print(h["content-type"], dict(h), "CONTENT-TYPE" in h)</code></pre>
<p>Outros: <code>__contains__</code> (otimiza o <code>in</code>), <code>__iter__</code>, <code>__reversed__</code>, <code>__missing__</code> (chamado por <code>dict</code> subclasses em chave ausente), <code>__call__</code> (instância chamável), <code>__len__</code> alimenta a truthiness. Subclassear <code>dict</code> e <code>list</code> diretamente tem armadilhas (métodos nativos em C ignoram seus overrides, por exemplo, <code>dict.update</code> não chama seu <code>__setitem__</code>): prefira <code>UserDict</code>, <code>UserList</code> ou as ABCs.</p>`
    },
    {
      id: 'atributos',
      title: 'Acesso a atributos: __getattr__, __getattribute__, __setattr__, __slots__',
      body: `<p><code>obj.nome</code> chama <code>type(obj).__getattribute__(obj, "nome")</code>, que implementa a busca padrão (descritores de dados, depois <code>obj.__dict__</code>, depois descritores não-dados e atributos da classe, seguindo o MRO). <strong>Só se essa busca falhar com <code>AttributeError</code></strong>, o Python chama <code>__getattr__</code>. Por isso <code>__getattr__</code> é o gancho seguro para atributos "dinâmicos" (proxies, delegação, APIs fluentes). <code>__getattribute__</code> intercepta <em>todo</em> acesso e é fácil de errar (recursão infinita).</p>
<pre><code class="language-python">class Delegador:
    """Encaminha atributos desconhecidos para um objeto interno."""
    def __init__(self, alvo):
        self._alvo = alvo
    def __getattr__(self, nome):                 # só chamado quando o normal falhou
        if nome.startswith("_"):                 # evita recursão em _alvo, __deepcopy__, etc.
            raise AttributeError(nome)
        return getattr(self._alvo, nome)

d = Delegador([3, 1, 2])
d.sort()
print(d._alvo, d.count(2))

class Frozen:
    def __setattr__(self, nome, valor):
        if hasattr(self, "_pronto"):
            raise AttributeError("imutável")
        super().__setattr__(nome, valor)         # use super, nunca self.__dict__ direto sem cuidado
    def __init__(self, x):
        self.x = x
        super().__setattr__("_pronto", True)

f = Frozen(1)
try:
    f.x = 2
except AttributeError as e:
    print(e)

# __slots__: sem __dict__ por instância, menos memória e atributos fixos
class ComSlots:
    __slots__ = ("a", "b")
    def __init__(self, a, b): self.a, self.b = a, b
s = ComSlots(1, 2)
try:
    s.c = 3
except AttributeError as e:
    print("sem __dict__:", e)

import sys
class SemSlots:
    def __init__(self, a, b): self.a, self.b = a, b
print(sys.getsizeof(SemSlots(1, 2).__dict__) + sys.getsizeof(SemSlots(1, 2)), sys.getsizeof(s))</code></pre>
<div class="callout warn"><strong>PEGADINHA</strong> Em <code>__getattr__</code>, acessar <code>self.algo</code> que não existe ainda (por exemplo, antes do <code>__init__</code> rodar, durante <code>copy</code> ou <code>pickle</code>) dispara <code>__getattr__</code> de novo e cai em recursão infinita. Trate os nomes que começam com underscore e levante <code>AttributeError</code>.</div>`
    },
    {
      id: 'descritores',
      title: 'Descritores: o mecanismo por trás de property, métodos e ORMs',
      body: `<p>Um <strong>descritor</strong> é um objeto atribuído a um atributo de <em>classe</em> que define <code>__get__</code>, <code>__set__</code> ou <code>__delete__</code>. Quando o atributo é acessado na instância, o Python chama esses métodos em vez de devolver o objeto bruto. Há duas categorias: <em>descritor de dados</em> (define <code>__set__</code> ou <code>__delete__</code>) tem prioridade sobre o <code>__dict__</code> da instância; <em>descritor não-dados</em> (só <code>__get__</code>) perde para o <code>__dict__</code>. Funções são descritores não-dados: é o <code>__get__</code> da função que cria o <em>método vinculado</em>, injetando <code>self</code>. <code>property</code>, <code>classmethod</code>, <code>staticmethod</code>, <code>__slots__</code> e os campos de ORMs e dataclasses usam esse mecanismo.</p>
<pre><code class="language-python">class Positivo:
    """Descritor de dados reutilizável: valida e guarda por instância."""
    def __set_name__(self, dono, nome):          # chamado na criação da classe
        self.nome = "_" + nome
    def __get__(self, obj, tipo=None):
        if obj is None:
            return self                          # acesso pela classe devolve o descritor
        return getattr(obj, self.nome)
    def __set__(self, obj, valor):
        if valor &lt;= 0:
            raise ValueError(f"{self.nome[1:]} deve ser positivo")
        setattr(obj, self.nome, valor)

class Item:
    preco = Positivo()
    quantidade = Positivo()
    def __init__(self, preco, quantidade):
        self.preco, self.quantidade = preco, quantidade   # passa pelo __set__

i = Item(10, 2)
print(i.preco, i.quantidade)
try:
    i.preco = -1
except ValueError as e:
    print(e)

# method binding: função é descritor
class A:
    def m(self): return "m"
a = A()
print(A.m, a.m)                       # função vs método vinculado
print(A.m.__get__(a, A)())            # o que o ponto faz por baixo
print(a.m.__self__ is a, a.m.__func__ is A.m)

# property é um descritor de dados escrito em Python/C
class Circulo:
    def __init__(self, r): self._r = r
    @property
    def area(self): return 3.14159 * self._r ** 2
    @property
    def raio(self): return self._r
    @raio.setter
    def raio(self, v):
        if v &lt; 0: raise ValueError
        self._r = v

# cached_property é descritor NÃO-dados: grava no __dict__ e some da frente na segunda leitura
from functools import cached_property
class Pesado:
    @cached_property
    def valor(self):
        print("calcula"); return 42
p = Pesado(); p.valor; p.valor
print("valor" in p.__dict__)</code></pre>
<p>Ordem completa da busca de atributo em instância: (1) descritor de dados na classe (e bases, via MRO); (2) <code>obj.__dict__</code>; (3) descritor não-dados ou atributo simples na classe; (4) <code>__getattr__</code>. Entender essa ordem resolve a maioria dos "por que meu atributo não muda": quase sempre há um descritor de dados na frente.</p>
<div class="callout"><strong>NA ENTREVISTA</strong> "Como a <code>property</code> funciona e por que métodos recebem self automaticamente?" Ambos são descritores. Função tem <code>__get__</code> que devolve um método vinculado; <code>property</code> tem <code>__get__</code> e <code>__set__</code> que chamam o getter e o setter. Dá para reimplementar <code>property</code> em dez linhas.</div>`
    },
    {
      id: 'ganchos-classe',
      title: 'Ganchos de classe e como usar sem exagero',
      body: `<p>Alguns dunders atuam sobre o <em>ciclo de vida da classe</em>. <code>__init_subclass__</code> é chamado quando uma subclasse é criada (substitui muitos usos de metaclasse, por exemplo registro automático de plugins). <code>__class_getitem__</code> faz <code>MinhaClasse[int]</code> funcionar (generics em runtime). <code>__call__</code> torna a instância chamável. <code>__new__</code> cria a instância (útil para imutáveis e singletons) antes do <code>__init__</code> inicializar. <code>__del__</code> é o finalizador (evite: ordem imprevisível; use context managers).</p>
<pre><code class="language-python">class Plugin:
    registro: dict[str, type] = {}
    def __init_subclass__(cls, /, nome=None, **kw):
        super().__init_subclass__(**kw)
        Plugin.registro[nome or cls.__name__.lower()] = cls

class Csv(Plugin, nome="csv"): ...
class Json(Plugin): ...
print(Plugin.registro)                    # {'csv': Csv, 'json': Json}

class Caixa:
    def __class_getitem__(cls, item):
        return f"{cls.__name__}[{item.__name__}]"
print(Caixa[int])

class Maiusculo(str):
    def __new__(cls, valor):              # imutáveis customizam em __new__
        return super().__new__(cls, valor.upper())
print(Maiusculo("oi"))

# protocolos de runtime e duck typing: iterável, sized, contextmanager por comportamento
from collections.abc import Iterable, Sized
print(isinstance([], Iterable), isinstance(range(3), Sized))

# introspecção do data model
print(dir(Caixa)[:3], [n for n in dir(int) if n.startswith("__r")][:4])
import operator
print(operator.add(1, 2) == (1).__add__(2))</code></pre>
<p>Princípio de uso: dunder é para <em>integrar o objeto à linguagem</em>, não para esperteza. Operadores devem ter significado óbvio (a regra da menor surpresa: <code>+</code> concatena ou soma; <code>|</code> combina; <code>@</code> é produto matricial); sobrecarga sem semântica clara prejudica a leitura (bibliotecas como <code>pathlib</code> usam <code>/</code> com sucesso porque é intuitivo para caminhos). Nunca invente dunders próprios (<code>__meu__</code>): esse espaço de nomes é reservado à linguagem.</p>
<p>Etapa 3 retoma isso em OOP, protocolos tipados (<code>typing.Protocol</code>) e dataclasses, que geram os dunders por você a partir da declaração dos campos.</p>`
    }
  ],
  whenToUse: [
    '__repr__ em toda classe de domínio; __str__ só quando há representação para o usuário',
    '__eq__ junto com __hash__ (ou dataclass frozen) para valores',
    'Herdar de collections.abc para criar sequências e mapeamentos completos',
    'Descritores para validação e comportamento reutilizável entre vários campos',
    '__init_subclass__ para registro de plugins no lugar de metaclasse'
  ],
  whenNot: [
    'Não defina __eq__ sem pensar em __hash__ e na mutabilidade dos campos',
    'Não devolva False de __eq__ para tipos desconhecidos: devolva NotImplemented',
    'Não use __getattribute__ quando __getattr__ basta',
    'Não herde de dict ou list sem saber que o C ignora seus overrides: use UserDict ou ABCs',
    'Não sobrecarregue operadores com semântica não óbvia nem crie dunders próprios'
  ],
  metrics: [
    'dir(), vars() e inspect.getmembers(): inspeção do data model de um objeto',
    'sys.getsizeof e tracemalloc: custo de __slots__ versus __dict__',
    'mypy e pyright: checam assinatura de dunders e Protocols',
    'ruff PLW (pylint-warnings) e PLR: regras de dunders e comparações',
    'pytest com hypothesis: propriedades de __eq__, __hash__ e ordenação',
    'collections.abc e typing.Protocol: contratos explícitos de comportamento'
  ],
  refs: [
    { type: 'livro', title: 'Fluent Python, 2ª edição (cap. 1: The Python Data Model; cap. 11 e 23: descritores)', author: 'Luciano Ramalho', url: 'https://www.oreilly.com/library/view/fluent-python-2nd/9781492056348/', note: 'A melhor referência sobre o tema; edição brasileira Python Fluente, Novatec.' },
    { type: 'doc', title: 'Data model (Language Reference)', author: 'Python Software Foundation', url: 'https://docs.python.org/3/reference/datamodel.html', note: 'Especificação oficial de todos os métodos especiais.' },
    { type: 'doc', title: 'Descriptor HowTo Guide', author: 'Raymond Hettinger', url: 'https://docs.python.org/3/howto/descriptor.html', note: 'O guia definitivo, com property e métodos reimplementados em Python.' },
    { type: 'doc', title: 'Special method names', author: 'Python Software Foundation', url: 'https://docs.python.org/3/reference/datamodel.html#special-method-names', note: 'Índice de todos os dunders.' },
    { type: 'doc', title: 'PEP 487: Simpler customisation of class creation', author: 'Martin Teichmann', url: 'https://peps.python.org/pep-0487/', note: '__init_subclass__ e __set_name__.' },
    { type: 'portal', title: 'Real Python: Python Descriptors', author: 'Real Python', url: 'https://realpython.com/python-descriptors/', note: 'Guia prático de descritores.' },
    { type: 'video', title: 'Live de Python (canal)', author: 'Eduardo Mendes', url: 'https://www.youtube.com/@Dunossauro', note: 'Aulas em português sobre data model, dunders e descritores.' }
  ]
};
