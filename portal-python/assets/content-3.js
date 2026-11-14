/* Lesson content, Etapas 5 e 6 (lições 25 a 35)
   Schema em CONTRATO: id, title, etapa, etapaName, time, tags, tagline, intro,
   sections[{id,title,body}], whenToUse[], whenNot[], metrics[], refs[]
*/
window.LESSON_CONTENT = window.LESSON_CONTENT || {};

window.LESSON_CONTENT['srp'] = {
  id: 'srp',
  title: 'Single Responsibility',
  etapa: 5, etapaName: 'SOLID & princípios',
  time: '60 min',
  tags: ['SOLID', 'coesão', 'refatoração', 'design'],
  tagline: 'Uma classe, uma <em>razão para mudar</em>, e a razão tem nome: um ator.',
  intro: `<p>O Single Responsibility Principle (SRP) é o mais citado e o mais mal entendido dos cinco. A frase popular, "uma classe deve fazer uma coisa só", é uma má paráfrase. Robert C. Martin formulou em 2003 (<em>Agile Software Development: Principles, Patterns, and Practices</em>) que "um módulo deve ter uma, e somente uma, razão para mudar". Em <em>Clean Architecture</em> (2017) ele refinou: um módulo deve ser responsável perante <strong>um, e somente um, ator</strong>, onde ator é o grupo de pessoas (financeiro, RH, operação) cujas exigências fazem o código mudar.</p>
<p>Isso muda a pergunta de projeto. Não é "quantas coisas esta classe faz?", é "quem pode me pedir uma mudança aqui, e essa mudança vai quebrar o que outro grupo espera?". Uma classe de 400 linhas com uma única razão de mudança respeita o SRP. Uma classe de 30 linhas que serve ao financeiro e à operação ao mesmo tempo não respeita.</p>
<p>No dia a dia de Python o SRP aparece em três lugares: o "service" que faz validação, regra de negócio, SQL e e-mail na mesma função; o modelo Django gordo; e o script de dados que lê, limpa, treina e grava no mesmo corpo. Aqui você vai ver a violação realista, a refatoração, onde Protocols e funções entram, e quando dividir demais vira o problema.</p>`,
  sections: [
    { id: 'definicao', title: 'A definição original e a versão por ator', body: `<p>Três formulações, em ordem cronológica, que convém não misturar:</p>
<ul>
<li><strong>Tom DeMarco e Meilir Page-Jones (anos 1970 e 80):</strong> coesão. Um módulo coeso tem elementos que se relacionam entre si. É a raiz da ideia.</li>
<li><strong>Martin, 2003:</strong> "uma razão para mudar". Razão para mudar é uma força externa (requisito, regulação, formato de arquivo), não uma linha de código.</li>
<li><strong>Martin, 2017:</strong> "uma responsabilidade perante um ator". A formulação mais operacional, porque dá um critério verificável: liste quem pode pedir mudança.</li>
</ul>
<p>O exemplo canônico do livro é uma classe <code>Employee</code> com <code>calculate_pay()</code> (contabilidade), <code>report_hours()</code> (RH) e <code>save()</code> (DBAs). Se contabilidade e RH compartilham uma função auxiliar <code>regular_hours()</code> e alguém a ajusta para um dos dois, o outro quebra em silêncio. O dano do SRP violado não é feiura: é <strong>mudança que vaza entre atores</strong>.</p>
<div class="math">acoplamento acidental = duas razões de mudança, um mesmo trecho de código</div>
<div class="callout"><strong>NA ENTREVISTA</strong> Se o entrevistador pedir a definição, não diga "faz uma coisa só". Diga "uma razão para mudar, ou um ator", e dê um exemplo em que duas áreas de negócio dependem do mesmo método. Isso separa quem leu o texto de quem decorou o slide.</div>` },
    { id: 'violacao', title: 'Violação realista: a função que sabe demais', body: `<p>Código assim existe em todo repositório. Repare que cada linha é razoável isoladamente. O problema é a soma:</p>
<pre><code class="language-python">import smtplib
import sqlite3
from email.message import EmailMessage


class OrderService:
    def checkout(self, user_email: str, items: list[dict]) -&gt; float:
        # 1) regra de negócio (ator: produto)
        total = sum(i["price"] * i["qty"] for i in items)
        if total &gt; 1000:
            total *= 0.95          # desconto de volume

        # 2) persistência (ator: dados / DBA)
        conn = sqlite3.connect("shop.db")
        conn.execute("INSERT INTO orders(email, total) VALUES (?, ?)", (user_email, total))
        conn.commit()
        conn.close()

        # 3) notificação (ator: marketing / CRM)
        msg = EmailMessage()
        msg["To"] = user_email
        msg["Subject"] = "Pedido confirmado"
        msg.set_content(f"Total: R$ {total:.2f}")
        with smtplib.SMTP("localhost") as s:
            s.send_message(msg)
        return total</code></pre>
<p>Sintomas verificáveis: para testar o desconto você precisa de um SQLite e de um servidor SMTP (ou de dois <code>patch</code>); trocar o provedor de e-mail obriga a mexer em uma classe de "pedido"; e três times diferentes fazem pull request no mesmo arquivo, gerando conflitos e regressões cruzadas.</p>` },
    { id: 'refatoracao', title: 'Refatoração: política no centro, detalhes na borda', body: `<p>Separe por ator. A regra de negócio vira uma função pura (sem I/O), e persistência e notificação viram detalhes injetados. O orquestrador fica fino:</p>
<pre><code class="language-python">from dataclasses import dataclass
from typing import Protocol


@dataclass(frozen=True)
class Item:
    price: float
    qty: int


def compute_total(items: list[Item]) -&gt; float:
    """Regra de negócio pura: nenhum I/O, trivial de testar."""
    total = sum(i.price * i.qty for i in items)
    return total * 0.95 if total &gt; 1000 else total


class OrderRepository(Protocol):
    def save(self, email: str, total: float) -&gt; None: ...


class Notifier(Protocol):
    def order_confirmed(self, email: str, total: float) -&gt; None: ...


class CheckoutService:
    """Orquestra. Muda quando o FLUXO muda, não quando o SMTP muda."""

    def __init__(self, repo: OrderRepository, notifier: Notifier) -&gt; None:
        self._repo = repo
        self._notifier = notifier

    def checkout(self, email: str, items: list[Item]) -&gt; float:
        total = compute_total(items)
        self._repo.save(email, total)
        self._notifier.order_confirmed(email, total)
        return total</code></pre>
<p>As implementações concretas (<code>SqliteOrderRepository</code>, <code>SmtpNotifier</code>) vivem em módulos separados e nunca são importadas pela regra de negócio. O teste do desconto agora é uma linha, sem mock. O teste do fluxo usa fakes de três linhas:</p>
<pre><code class="language-python">class FakeRepo:
    def __init__(self): self.rows = []
    def save(self, email, total): self.rows.append((email, total))

class FakeNotifier:
    def __init__(self): self.sent = []
    def order_confirmed(self, email, total): self.sent.append(email)


def test_checkout_orquestra():
    repo, notifier = FakeRepo(), FakeNotifier()
    total = CheckoutService(repo, notifier).checkout("a@b.com", [Item(600, 2)])
    assert total == 1140.0
    assert repo.rows == [("a@b.com", 1140.0)]
    assert notifier.sent == ["a@b.com"]</code></pre>
<div class="callout tip"><strong>DICA</strong> A mesma ideia tem nome em arquitetura: "functional core, imperative shell" (Gary Bernhardt). O núcleo é função pura, a casca faz I/O. É SRP aplicado em escala de módulo.</div>` },
    { id: 'diagnostico', title: 'Como diagnosticar sem adivinhar', body: `<p>SRP é discutível quando se discute no abstrato. Use evidência:</p>
<ul>
<li><strong>Histórico git:</strong> <code>git log --format=%an --follow arquivo.py | sort | uniq -c</code> mostra quantas pessoas (e, por inferência, quantos times) mexem no arquivo. Arquivos que mudam por motivos não relacionados são os candidatos.</li>
<li><strong>Churn por arquivo:</strong> <code>git log --since=6.months --name-only --format= | sort | uniq -c | sort -rn | head</code>. Hotspot que mistura responsabilidades é onde o SRP paga mais.</li>
<li><strong>Imports:</strong> um módulo que importa <code>sqlite3</code>, <code>smtplib</code>, <code>requests</code> e <code>pandas</code> está servindo a vários atores. <code>python -X importtime</code> e <code>pydeps</code> ajudam a visualizar.</li>
<li><strong>Esforço de teste:</strong> se testar uma regra exige mais de um <code>patch</code>, há responsabilidade enrolada com I/O.</li>
<li><strong>Nome:</strong> <code>Manager</code>, <code>Helper</code>, <code>Utils</code>, <code>Processor</code> e nomes com "And" costumam esconder várias razões de mudança.</li>
<li><strong>Coesão LCOM:</strong> ferramentas como <code>radon</code> medem complexidade; para coesão, a heurística prática é: se metade dos métodos usa um subconjunto dos atributos e a outra metade usa outro, são duas classes.</li>
</ul>
<pre><code class="language-bash"># hotspots dos últimos 6 meses
git log --since=6.months --name-only --pretty=format: | grep -v '^$' | sort | uniq -c | sort -rn | head -10

# dependências do módulo (grafo de imports)
pip install pydeps &amp;&amp; pydeps src/shop --max-bacon 2</code></pre>` },
    { id: 'python-idiomatico', title: 'SRP no jeito Python: módulo, função, dataclass', body: `<p>Em Python a unidade de responsabilidade raramente precisa ser uma classe. O módulo é a primeira fronteira: <code>pricing.py</code> (regra), <code>repository.py</code> (dados), <code>notifications.py</code> (saída). Dentro deles, funções são suficientes quando não há estado:</p>
<ul>
<li><strong>Função pura</strong> para regra: entrada e saída, sem efeito colateral. É a forma mais barata de SRP.</li>
<li><strong>Dataclass</strong> para dado: <code>@dataclass(frozen=True, slots=True)</code> carrega valores, sem comportamento de infraestrutura.</li>
<li><strong>Protocol</strong> (PEP 544) na costura entre camadas, descrevendo só o que o cliente precisa. Tipagem estrutural: a implementação concreta não herda nada.</li>
<li><strong>ABC</strong> quando você quer forçar herança explícita e herdar comportamento comum (template method), ou registro virtual.</li>
<li><strong>Funções como dependência:</strong> se a interface tem um método só, <code>Callable[[str, float], None]</code> basta e dispensa a classe.</li>
</ul>
<pre><code class="language-python">from collections.abc import Callable

# Quando o Protocol tem UM método, uma função tipada resolve.
Notify = Callable[[str, float], None]

def make_checkout(save: Callable[[str, float], None], notify: Notify):
    def checkout(email: str, items: list[Item]) -&gt; float:
        total = compute_total(items)
        save(email, total)
        notify(email, total)
        return total
    return checkout</code></pre>
<p>Em Python 3.12 e 3.13, o tipo genérico e os aliases ganham a sintaxe do PEP 695 (<code>type Notify = Callable[[str, float], None]</code>), que deixa a assinatura mais limpa. Não muda o SRP, só a ergonomia.</p>` },
    { id: 'fat-models', title: 'Onde o SRP é violado de propósito: Django, ORMs e scripts de dados', body: `<p>O padrão Active Record (Django ORM, Rails) funde dado e persistência por projeto: <code>user.save()</code>. Isso é uma escolha consciente em troca de velocidade, e funciona bem até o modelo acumular regra de negócio, e-mail, cache e integração. A saída pragmática da comunidade Django é a camada de <em>services</em> ou <em>selectors</em> (Two Scoops, HackSoft Django Styleguide), ou, em arquitetura mais estrita, o repositório de <em>Architecture Patterns with Python</em> (Percival e Gregory).</p>
<p>Em ciência de dados o equivalente é o notebook ou script que lê, limpa, treina, avalia e grava. A refatoração por responsabilidade (<code>load()</code>, <code>clean()</code>, <code>train()</code>, <code>evaluate()</code>, <code>persist()</code>) é o que permite testar cada etapa, cachear e agendar em orquestrador.</p>
<table><thead><tr><th>Sinal</th><th>Responsabilidades misturadas</th><th>Corte natural</th></tr></thead><tbody>
<tr><td>Modelo Django com <code>send_mail</code> dentro de <code>save()</code></td><td>dado + notificação</td><td>signal ou service chamado pela view</td></tr>
<tr><td>Função com <code>requests.get</code> e regra de negócio</td><td>I/O de rede + política</td><td>cliente HTTP injetado, regra pura</td></tr>
<tr><td>Script que lê CSV, treina e grava modelo</td><td>ETL + ML + armazenamento</td><td>funções por etapa, orquestradas por fora</td></tr>
<tr><td>Classe <code>Config</code> que lê env, valida e abre conexão</td><td>configuração + infraestrutura</td><td>dataclass de config + factory de conexão</td></tr>
</tbody></table>` },
    { id: 'overengineering', title: 'O contraponto: quando o SRP vira burocracia', body: `<p>Aplicado sem juízo, o SRP gera o oposto do código legível: dezenas de classes de um método, cada uma em seu arquivo, e você precisa abrir oito arquivos para entender um fluxo de 20 linhas. Dois erros comuns:</p>
<ul>
<li><strong>Nanoclasses:</strong> <code>PriceCalculator</code>, <code>PriceValidator</code>, <code>PriceFormatter</code>, <code>PriceFactory</code> para uma conta que cabe em uma função. Uma classe com um único método e sem estado é uma função fantasiada (Jack Diederich, "Stop Writing Classes", PyCon 2012).</li>
<li><strong>Dividir antes de existir a segunda razão para mudar.</strong> Se só um ator existe e nada indica que vá surgir outro, separar é especulação. A regra do três (Don Roberts) vale: tolere a mistura, e separe quando a segunda força de mudança aparecer de fato.</li>
</ul>
<pre><code class="language-python"># Overengineering: seis classes para somar dois números com imposto.
class TaxRateProvider: ...
class TaxCalculator: ...
class AmountValidator: ...
class AmountFormatter: ...
class CalculationOrchestrator: ...

# Suficiente enquanto houver um só ator:
def total_with_tax(amount: float, rate: float = 0.12) -&gt; float:
    if amount &lt; 0:
        raise ValueError("amount must be &gt;= 0")
    return round(amount * (1 + rate), 2)</code></pre>
<div class="callout warn"><strong>PEGADINHA</strong> Granularidade é proporcional ao custo de mudança. Para um script descartável, um arquivo de 80 linhas que faz tudo é o design correto. SRP é uma ferramenta para código que vai viver e ser alterado por mais de uma pessoa.</div>
<p>Um teste de bolso: se você precisa explicar o fluxo mostrando um diagrama porque o código está espalhado demais, passou do ponto. Se precisa de comentários separando "blocos" dentro de uma função (como no exemplo da violação), ainda não chegou.</p>` },
    { id: 'entrevista', title: 'Como isso cai em entrevista sênior e em produção', body: `<p>Perguntas típicas e a resposta que demonstra senioridade:</p>
<ul>
<li><strong>"Essa classe viola o SRP?"</strong> Responda com a pergunta de volta: "quem pede mudança aqui, e as mudanças se afetam?". Cite ator, não contagem de métodos.</li>
<li><strong>"Como você testaria isso?"</strong> O desenho que isola regra de I/O é a resposta, e prova que você usa SRP como ferramenta de testabilidade.</li>
<li><strong>"SRP e coesão são a mesma coisa?"</strong> Estão em relação: SRP é a regra de divisão (separe o que muda por motivos diferentes), coesão é a propriedade resultante (junte o que muda junto). Martin resume: "reúna as coisas que mudam pelo mesmo motivo, separe as que mudam por motivos diferentes".</li>
<li><strong>"Quando você NÃO aplicaria?"</strong> Script curto, protótipo, domínio com um único ator. Mostrar o limite é o que convence.</li>
</ul>
<p>Em produção, o ganho do SRP aparece em incidentes: quando o provedor de e-mail cai, só o <code>Notifier</code> falha, e a regra de negócio continua testável. Para o aprofundamento da fronteira entre camadas, veja DIP (lição 29) e o capítulo sobre abstrações do <em>Architecture Patterns with Python</em>.</p>` }
  ],
  whenToUse: [
    'Um arquivo recebe pull requests de times ou domínios diferentes e vive em conflito',
    'Testar uma regra exige banco, rede ou SMTP por causa de I/O misturado',
    'Uma mudança pedida pelo financeiro quebra algo da operação (mudança vaza entre atores)',
    'O nome da classe pede "Manager", "Helper" ou "And", e os métodos usam atributos disjuntos',
    'Você precisa trocar um detalhe (provedor de e-mail, banco) sem tocar na regra de negócio'
  ],
  whenNot: [
    'Script descartável ou protótipo com um único autor e um único ator',
    'Quando a divisão vira nanoclasses de um método só e o fluxo se espalha em dez arquivos',
    'Antes de existir uma segunda razão de mudança real (separar por especulação)',
    'Para "cumprir SOLID" em revisão de código, sem apontar o ator ou a dor concreta',
    'Em Active Record deliberado e simples, onde o modelo gordo ainda é barato de mudar'
  ],
  metrics: [
    'git log --follow e churn por arquivo: quantas pessoas e quantas mudanças por motivo',
    'radon cc e radon mi: complexidade ciclomática e índice de manutenibilidade',
    'pydeps e import-linter: grafo de imports e contratos de dependência entre camadas',
    'Número de patch/mock por teste: mais de um sugere I/O enrolado com regra',
    'pytest --durations: testes lentos de regra costumam indicar I/O misturado',
    'ruff com regras C901 (complexidade) e PLR0915 (muitas instruções) como sinal inicial'
  ],
  refs: [
    { type: 'artigo', title: 'The Single Responsibility Principle', author: 'Robert C. Martin', url: 'https://blog.cleancoder.com/uncle-bob/2014/05/08/SingleReponsibilityPrinciple.html', note: 'A formulação por ator, com o exemplo do relatório que serve a dois gestores.' },
    { type: 'livro', title: 'Clean Architecture', author: 'Robert C. Martin', url: 'https://www.oreilly.com/library/view/clean-architecture-a/9780134494272/', note: 'Capítulo 7: o SRP revisado e o caso Employee com três atores.' },
    { type: 'livro', title: 'Architecture Patterns with Python', author: 'Harry Percival e Bob Gregory', url: 'https://www.cosmicpython.com/', note: 'Repositório, service layer e fronteiras, em Python, com o livro aberto online.' },
    { type: 'video', title: 'Stop Writing Classes', author: 'Jack Diederich, PyCon US 2012', url: 'https://www.youtube.com/watch?v=o9pEzgHorH0', note: 'O contraponto clássico: quando uma classe de um método é só uma função.' },
    { type: 'video', title: 'The Clean Architecture in Python', author: 'Brandon Rhodes, PyCon 2014', url: 'https://www.youtube.com/watch?v=DJtef410XaM', note: 'Núcleo puro e casca de I/O aplicados a código Python real.' },
    { type: 'doc', title: 'PEP 544: Protocols, structural subtyping', author: 'Python Steering Council / PEPs', url: 'https://peps.python.org/pep-0544/', note: 'Como descrever a costura entre camadas sem herança.' },
    { type: 'livro', title: 'Fluent Python, 2ª edição', author: 'Luciano Ramalho', url: 'https://www.oreilly.com/library/view/fluent-python-2nd/9781492056348/', note: 'Referência para modelar com funções, protocolos e dataclasses em Python moderno.' },
    { type: 'video', title: 'Canal Live de Python', author: 'Eduardo Mendes (Dunossauro)', url: 'https://www.youtube.com/@Dunossauro', note: 'Lives em português sobre design, tipagem e testes em Python.' }
  ]
};

window.LESSON_CONTENT['ocp'] = {
  id: 'ocp',
  title: 'Open/Closed',
  etapa: 5, etapaName: 'SOLID & princípios',
  time: '60 min',
  tags: ['SOLID', 'extensibilidade', 'plugins', 'strategy'],
  tagline: 'Aberto para <em>extensão</em>, fechado para modificação: adicione comportamento sem reabrir código que já funciona.',
  intro: `<p>A frase "software entities should be open for extension, but closed for modification" é de Bertrand Meyer, em <em>Object-Oriented Software Construction</em> (1988). A leitura de Meyer era sobre herança: uma classe fechada é estável e usada por outros, e você a estende criando subclasses. Nos anos 1990 Robert C. Martin reinterpretou o princípio em termos de <strong>abstrações polimórficas</strong>: o código cliente depende de uma interface, e novos comportamentos entram por novas implementações, sem editar o cliente. Essa é a versão que ficou no SOLID.</p>
<p>O custo da violação é concreto: um <code>if/elif</code> que cresce a cada novo tipo de desconto, formato de exportação ou provedor de pagamento. Cada ramo novo mexe numa função testada, com risco de regressão nos ramos antigos, e todo mundo edita o mesmo trecho.</p>
<p>Em Python o princípio é quase gratuito, porque funções são objetos e dicionários de callables substituem hierarquias inteiras. O difícil é saber <em>quando</em> abrir o ponto de extensão, porque abrir antes da hora é overengineering clássico.</p>`,
  sections: [
    { id: 'definicao', title: 'Meyer, Martin e o que "fechado" quer dizer', body: `<p>Duas leituras coexistem:</p>
<ul>
<li><strong>Meyer (1988):</strong> uma classe, uma vez publicada e testada, não é alterada (exceto correção de bugs). Novos comportamentos vêm por herança. Problema: a herança acopla subclasse a detalhes de implementação.</li>
<li><strong>Martin (1996, "The Open-Closed Principle", C++ Report) e os anos seguintes:</strong> o módulo cliente depende de uma abstração. Estende-se criando novas implementações da abstração. O cliente fica "fechado" porque não precisa mudar.</li>
</ul>
<p>"Fechado" é sempre relativo a <em>um tipo específico de mudança</em>. Não existe código fechado para tudo. Você escolhe quais variações esperar (novos tipos de desconto, não uma mudança no modelo de dados inteiro) e fecha contra essas. Martin diz isso de forma direta: é preciso adivinhar o eixo de mudança, e o mais seguro é esperar a primeira mudança acontecer, depois proteger contra a segunda.</p>
<div class="callout"><strong>NA ENTREVISTA</strong> Mostre que "fechado" é por eixo de mudança. Uma resposta madura: "fecho contra a variação que já vi duas vezes, e deixo o resto simples até a pressão aparecer".</div>` },
    { id: 'violacao', title: 'Violação realista: o if/elif que cresce', body: `<pre><code class="language-python">def apply_discount(order_total: float, customer_kind: str) -&gt; float:
    if customer_kind == "regular":
        return order_total
    elif customer_kind == "vip":
        return order_total * 0.90
    elif customer_kind == "employee":
        return order_total * 0.70
    elif customer_kind == "black_friday":      # entrou ontem
        return order_total * 0.50
    else:
        raise ValueError(f"unknown kind {customer_kind!r}")</code></pre>
<p>Cada novo tipo exige editar <code>apply_discount</code>, reexecutar todos os testes dele e, pior, replicar o mesmo <code>if/elif</code> em outros lugares (relatório, nota fiscal, e-mail). Quando a mesma cadeia de condicionais aparece em três lugares, o sinal clássico é "shotgun surgery": uma mudança de negócio vira quatro edições.</p>
<p>Nem todo <code>if</code> é violação. Uma cadeia de dois ou três ramos estáveis, em um único lugar, é legível e honesta. A violação real é a cadeia que (1) cresce, (2) se repete em vários módulos e (3) é editada por pessoas diferentes.</p>` },
    { id: 'strategy', title: 'Refatoração 1: Strategy com Protocol', body: `<p>A forma orientada a objetos: cada variação é uma implementação de uma interface, e o cliente recebe a estratégia.</p>
<pre><code class="language-python">from typing import Protocol


class DiscountPolicy(Protocol):
    def apply(self, total: float) -&gt; float: ...


class NoDiscount:
    def apply(self, total: float) -&gt; float:
        return total


class Percentage:
    def __init__(self, pct: float) -&gt; None:
        self.pct = pct

    def apply(self, total: float) -&gt; float:
        return total * (1 - self.pct)


def checkout(total: float, policy: DiscountPolicy) -&gt; float:
    return policy.apply(total)


print(checkout(200.0, Percentage(0.10)))   # 180.0</code></pre>
<p>Para adicionar "Black Friday" você cria uma classe nova (<code>Percentage(0.50)</code> já resolve) e não edita <code>checkout</code>. O <code>Protocol</code> faz a checagem estática (mypy, pyright) sem exigir herança, então bibliotecas de terceiros podem fornecer políticas compatíveis sem importar o seu módulo.</p>` },
    { id: 'pythonico', title: 'Refatoração 2: dict de callables e registro por decorator', body: `<p>Quando a estratégia não tem estado, a classe é cerimônia. Uma função e um dicionário resolvem, e o registro por decorator deixa a extensão acontecer em qualquer módulo:</p>
<pre><code class="language-python">from collections.abc import Callable

DISCOUNTS: dict[str, Callable[[float], float]] = {}


def discount(kind: str):
    def register(fn: Callable[[float], float]):
        if kind in DISCOUNTS:
            raise ValueError(f"duplicate discount {kind!r}")
        DISCOUNTS[kind] = fn
        return fn
    return register


@discount("regular")
def _regular(total: float) -&gt; float:
    return total


@discount("vip")
def _vip(total: float) -&gt; float:
    return total * 0.90


def apply_discount(total: float, kind: str) -&gt; float:
    try:
        return DISCOUNTS[kind](total)
    except KeyError:
        raise ValueError(f"unknown kind {kind!r}") from None</code></pre>
<p>Para um novo tipo, qualquer módulo importado define <code>@discount("employee")</code>. Esse é o desenho por trás de frameworks inteiros: <code>@app.route</code> no Flask, <code>@pytest.fixture</code>, <code>@click.command</code>, <code>functools.singledispatch</code>. O ponto de extensão é o registro, não o código que consulta.</p>
<div class="callout warn"><strong>PEGADINHA</strong> Registro global por import tem efeito colateral: o decorator só roda se o módulo for importado. Se a extensão fica em um módulo que ninguém importa, o desconto "some" em produção e funciona nos testes. Documente onde os plugins são carregados, ou use entry points (próxima seção).</div>` },
    { id: 'singledispatch', title: 'functools.singledispatch e match: abrindo por tipo', body: `<p>Quando a variação é pelo <em>tipo do dado</em>, <code>functools.singledispatch</code> permite abrir a função para novos tipos sem editá-la, inclusive de fora do módulo:</p>
<pre><code class="language-python">from dataclasses import dataclass
from functools import singledispatch


@dataclass
class Circle:
    r: float

@dataclass
class Rect:
    w: float
    h: float


@singledispatch
def area(shape) -&gt; float:
    raise NotImplementedError(type(shape).__name__)


@area.register
def _(shape: Circle) -&gt; float:
    return 3.141592653589793 * shape.r ** 2


@area.register
def _(shape: Rect) -&gt; float:
    return shape.w * shape.h

print(area(Rect(2, 3)))   # 6</code></pre>
<p>Outro módulo pode registrar <code>Triangle</code> sem tocar nas definições existentes. É extensão pura. O <code>match</code> estrutural (PEP 634, Python 3.10+) é o oposto filosófico: um único lugar onde todos os casos estão visíveis. Ele é <em>fechado</em> por construção, e isso é uma virtude quando o conjunto de variantes é pequeno e estável (um tipo soma, um AST). Escolha conforme o eixo de mudança: <strong>novos tipos com operações estáveis</strong> favorecem polimorfismo e registro; <strong>novas operações com tipos estáveis</strong> favorecem <code>match</code> e funções. Esse é o "expression problem" de Philip Wadler, e é um bom assunto para entrevista.</p>` },
    { id: 'plugins', title: 'Plugins reais: entry points e importlib', body: `<p>O OCP em escala de ecossistema é o sistema de plugins. Em Python o mecanismo padrão é o <em>entry point</em>, declarado no <code>pyproject.toml</code> do pacote de extensão e descoberto por <code>importlib.metadata</code>:</p>
<pre><code class="language-toml"># pyproject.toml do pacote do plugin
[project.entry-points."meuapp.exporters"]
parquet = "meu_plugin.parquet:export"
excel   = "meu_plugin.excel:export"</code></pre>
<pre><code class="language-python">from importlib.metadata import entry_points


def load_exporters():
    eps = entry_points(group="meuapp.exporters")   # API estável desde 3.10
    return {ep.name: ep.load() for ep in eps}


EXPORTERS = load_exporters()
EXPORTERS["parquet"](dataframe, "saida.parquet")</code></pre>
<p>O núcleo do app nunca importa o plugin: instalar o pacote basta. É assim que o pytest descobre plugins (<code>pytest11</code>), que o Flask carrega comandos de CLI e que o pluggy (base do pytest, tox e devpi) estrutura hooks. O custo: ordem de carga não é óbvia, versões de plugin precisam ser compatíveis com a API do núcleo, e debugar "por que meu plugin não carregou" exige ferramentas (<code>importlib.metadata.entry_points()</code> listado no REPL).</p>` },
    { id: 'overengineering', title: 'O contraponto: abstração prematura', body: `<p>OCP mal aplicado produz hierarquias para variações que nunca vêm. O custo de uma abstração é permanente (indireção, nomes, arquivos), e o benefício é hipotético. Sandi Metz resume: "duplicação é muito mais barata que a abstração errada". Três práticas honestas:</p>
<ul>
<li><strong>Regra do três:</strong> escreva a primeira versão direta, tolere a segunda com um <code>if</code>, e extraia a abstração na terceira, quando o eixo de variação já se mostrou de verdade.</li>
<li><strong>Abstraia pelo que muda, não pelo que parece categoria.</strong> Dois exportadores com 90% de código diferente não são "o mesmo conceito" só porque os dois "exportam".</li>
<li><strong>Prefira o ponto de extensão mais barato:</strong> um argumento <code>Callable</code> antes de um Protocol, um Protocol antes de uma ABC, uma ABC antes de um framework de plugins.</li>
</ul>
<pre><code class="language-python"># Overengineering típico: ABC + factory + registry para dois casos fixos.
class ExporterBase(ABC): ...
class CsvExporter(ExporterBase): ...
class JsonExporter(ExporterBase): ...
class ExporterFactory: ...

# Basta, enquanto o conjunto é fechado e pequeno:
def export(rows: list[dict], fmt: str) -&gt; str:
    if fmt == "json":
        import json
        return json.dumps(rows)
    if fmt == "csv":
        ...
    raise ValueError(fmt)</code></pre>
<div class="callout tip"><strong>DICA</strong> Teste de custo: "quantas linhas eu edito para adicionar a variação número 4?". Se a resposta já é uma linha (um novo ramo, uma nova entrada no dict), a abstração talvez não pague a si mesma.</div>` },
    { id: 'entrevista', title: 'Entrevista e produção', body: `<ul>
<li><strong>"Dê um exemplo de OCP em Python."</strong> Registro por decorator, <code>singledispatch</code>, entry points, ou o parâmetro <code>key=</code> do <code>sorted</code>: a função de ordenação está fechada e aberta via callback.</li>
<li><strong>"OCP e herança?"</strong> Meyer defendia herança, Martin defende abstração. Em Python moderno, composição com Protocol e callables supera hierarquias profundas (veja a lição 30).</li>
<li><strong>"Como OCP se relaciona com LSP?"</strong> OCP só funciona se as novas implementações são substituíveis. Uma extensão que quebra o contrato força o cliente a abrir um <code>if isinstance</code>, que é a própria violação do OCP. Por isso LSP vem em seguida.</li>
</ul>
<p>Em produção, feature flags, regras de preço, validações de pipeline e conectores são os candidatos mais comuns. Sinal de que o OCP está funcionando: a PR de "adicionar o provedor X" só <em>adiciona</em> arquivos e linhas, sem deletar nem editar código antigo.</p>` }
  ],
  whenToUse: [
    'A mesma cadeia de if/elif cresce a cada novo tipo e se repete em vários módulos',
    'Terceiros ou outros times precisam estender o comportamento sem editar o núcleo',
    'Você já viu a mesma variação duas vezes e sabe qual é o eixo de mudança',
    'O núcleo é estável e bem testado, e o risco de regressão ao editá-lo é alto',
    'Há um conjunto aberto de conectores, exportadores, validadores ou políticas'
  ],
  whenNot: [
    'O conjunto de variantes é pequeno e fechado (use match ou um if simples)',
    'Você está adivinhando uma variação que ninguém pediu (abstração prematura)',
    'A "abstração" teria 90% de código diferente entre as implementações',
    'Registro global por import esconde onde o plugin é carregado e quebra em produção',
    'A hierarquia profunda vira acoplamento por herança; prefira composição'
  ],
  metrics: [
    'Linhas editadas (não adicionadas) por PR ao adicionar uma variação',
    'ruff: PLR0912 (muitos ramos) e C901 como indicador de cadeias que crescem',
    'grep por isinstance e por cadeias de == "tipo" repetidas em vários módulos',
    'mypy --strict e pyright para validar Protocols e assinaturas dos plugins',
    'importlib.metadata.entry_points(group=...) para listar plugins efetivamente carregados',
    'pytest parametrize sobre o registro: todo item do dict passa no mesmo teste de contrato'
  ],
  refs: [
    { type: 'artigo', title: 'The Open Closed Principle', author: 'Robert C. Martin', url: 'https://blog.cleancoder.com/uncle-bob/2014/05/12/TheOpenClosedPrinciple.html', note: 'A releitura do princípio em termos de abstração, com o histórico de Meyer.' },
    { type: 'livro', title: 'Object-Oriented Software Construction, 2ª ed.', author: 'Bertrand Meyer', url: 'https://en.wikipedia.org/wiki/Object-Oriented_Software_Construction', note: 'A origem da formulação, em contexto de herança.' },
    { type: 'artigo', title: 'The Wrong Abstraction', author: 'Sandi Metz', url: 'https://sandimetz.com/blog/2016/1/20/the-wrong-abstraction', note: 'O contraponto: duplicação custa menos que a abstração errada.' },
    { type: 'doc', title: 'functools.singledispatch', author: 'Python Docs', url: 'https://docs.python.org/3/library/functools.html#functools.singledispatch', note: 'Despacho por tipo extensível de fora do módulo.' },
    { type: 'doc', title: 'Entry points specification', author: 'Python Packaging User Guide', url: 'https://packaging.python.org/en/latest/specifications/entry-points/', note: 'O mecanismo oficial de plugins em Python.' },
    { type: 'doc', title: 'pluggy', author: 'pytest-dev', url: 'https://pluggy.readthedocs.io/', note: 'Sistema de hooks usado por pytest, tox e devpi.' },
    { type: 'portal', title: 'Strategy', author: 'Refactoring.Guru', url: 'https://refactoring.guru/design-patterns/strategy', note: 'Estrutura clássica do padrão que concretiza o OCP.' },
    { type: 'livro', title: 'Fluent Python, 2ª edição', author: 'Luciano Ramalho', url: 'https://www.oreilly.com/library/view/fluent-python-2nd/9781492056348/', note: 'Capítulos sobre padrões com funções de primeira classe e singledispatch.' }
  ]
};

window.LESSON_CONTENT['lsp'] = {
  id: 'lsp',
  title: 'Liskov Substitution',
  etapa: 5, etapaName: 'SOLID & princípios',
  time: '60 min',
  tags: ['SOLID', 'contratos', 'subtipos', 'herança'],
  tagline: 'Um subtipo só é honesto se puder <em>entrar no lugar</em> do tipo base sem o cliente perceber.',
  intro: `<p>Barbara Liskov apresentou a ideia em 1987 (keynote da OOPSLA, "Data Abstraction and Hierarchy") e formalizou com Jeannette Wing em 1994, em "A Behavioral Notion of Subtyping" (ACM TOPLAS): se <code>q(x)</code> é uma propriedade demonstrável sobre objetos <code>x</code> do tipo <code>T</code>, então <code>q(y)</code> deve valer para objetos <code>y</code> do tipo <code>S</code>, onde <code>S</code> é subtipo de <code>T</code>. Em português de engenharia: onde o código espera um <code>T</code>, qualquer <code>S</code> deve funcionar sem surpresa.</p>
<p>O ponto central, e a razão de o LSP ser o princípio mais sutil do SOLID, é que subtipo não é questão de sintaxe. Herdar de uma classe e implementar todos os métodos <em>não</em> garante substituibilidade. O que importa é o <strong>comportamento prometido</strong>: pré-condições, pós-condições, invariantes. Um subtipo que exige mais do chamador, entrega menos, ou quebra uma invariante é um impostor, mesmo que o type checker aprove.</p>
<p>Em Python isso é ainda mais relevante porque a linguagem não impõe nada em tempo de execução: duck typing deixa você violar o contrato em silêncio, e o erro aparece na produção, longe da causa.</p>`,
  sections: [
    { id: 'definicao', title: 'A definição comportamental: contrato, não herança', body: `<p>Liskov e Wing derivam regras a partir do design por contrato de Bertrand Meyer. Para um subtipo <code>S</code> de <code>T</code>:</p>
<ul>
<li><strong>Pré-condições não podem ser reforçadas.</strong> O subtipo aceita pelo menos o que o tipo base aceitava. Se <code>T.save(x)</code> aceita qualquer string, <code>S.save(x)</code> não pode recusar strings vazias.</li>
<li><strong>Pós-condições não podem ser enfraquecidas.</strong> O subtipo entrega pelo menos o que o tipo base prometia. Se <code>T.find()</code> nunca retorna <code>None</code>, <code>S.find()</code> também não.</li>
<li><strong>Invariantes devem ser preservadas.</strong> Se o tipo base garante "saldo nunca negativo", o subtipo mantém.</li>
<li><strong>Regra do histórico (history constraint):</strong> o subtipo não pode permitir mudanças de estado que o tipo base proibia. Um tipo imutável não ganha um subtipo mutável que o cliente trate como imutável.</li>
<li><strong>Exceções:</strong> o subtipo não lança exceções novas que o cliente do tipo base não espera (variância de exceções).</li>
</ul>
<table><thead><tr><th>Posição</th><th>Variância correta no subtipo</th><th>Mnemônico</th></tr></thead><tbody>
<tr><td>Parâmetros de entrada (pré-condição)</td><td>Contravariante: aceita igual ou mais</td><td>"exija menos"</td></tr>
<tr><td>Retorno (pós-condição)</td><td>Covariante: devolve igual ou mais específico</td><td>"prometa mais"</td></tr>
<tr><td>Exceções</td><td>Mesmas ou subclasses das declaradas</td><td>"surpreenda menos"</td></tr>
</tbody></table>
<p>Os checkers de tipo (mypy, pyright) verificam parte disso: parâmetros e retornos de métodos sobrescritos (override incompatível). O resto, os contratos semânticos, é com você e com os testes.</p>` },
    { id: 'quadrado', title: 'O clássico: Quadrado vs Retângulo', body: `<p>Em geometria um quadrado é um retângulo. Em código mutável, não é:</p>
<pre><code class="language-python">class Rectangle:
    def __init__(self, w: float, h: float) -&gt; None:
        self._w, self._h = w, h

    @property
    def width(self) -&gt; float: return self._w
    @width.setter
    def width(self, v: float) -&gt; None: self._w = v

    @property
    def height(self) -&gt; float: return self._h
    @height.setter
    def height(self, v: float) -&gt; None: self._h = v

    def area(self) -&gt; float:
        return self._w * self._h


class Square(Rectangle):
    def __init__(self, side: float) -&gt; None:
        super().__init__(side, side)

    @Rectangle.width.setter
    def width(self, v: float) -&gt; None:
        self._w = self._h = v      # mantém a invariante do quadrado

    @Rectangle.height.setter
    def height(self, v: float) -&gt; None:
        self._w = self._h = v


def stretch_to_double_width(r: Rectangle) -&gt; None:
    h = r.height
    r.width = r.width * 2
    # contrato implícito de Rectangle: mudar width NÃO muda height
    assert r.height == h, "a altura não deveria mudar"


stretch_to_double_width(Rectangle(2, 3))   # ok
stretch_to_double_width(Square(2))         # AssertionError: o Square quebrou o contrato</code></pre>
<p>Com <code>Square</code>, mudar a largura muda também a altura. O cliente do <code>Rectangle</code> tinha uma pós-condição implícita ("<code>height</code> não muda quando eu altero <code>width</code>"), e o <code>Square</code> a quebra. O problema não está em <code>Square</code> ou em <code>Rectangle</code>, está na relação "é-um" aplicada a objetos <em>mutáveis</em> com setters independentes. Opções de correção: tornar ambos imutáveis (cada "alteração" devolve um novo objeto), ou não herdar (duas classes com um Protocol <code>Shape</code> com <code>area()</code>).</p>
<pre><code class="language-python">from dataclasses import dataclass
from typing import Protocol


class Shape(Protocol):
    def area(self) -&gt; float: ...


@dataclass(frozen=True)
class Rect:
    w: float
    h: float
    def area(self) -&gt; float: return self.w * self.h
    def with_width(self, w: float) -&gt; "Rect": return Rect(w, self.h)


@dataclass(frozen=True)
class Square:
    side: float
    def area(self) -&gt; float: return self.side ** 2</code></pre>
<p>Sem herança e sem estado compartilhado, não há o que violar. O cliente que precisa só de área recebe um <code>Shape</code>. Quem precisa de largura e altura independentes pede <code>Rect</code> e ponto.</p>` },
    { id: 'violacao-contrato', title: 'Violações realistas: as que você vai encontrar em revisão', body: `<p>Poucos escrevem Quadrado vs Retângulo no trabalho. As violações reais são estas:</p>
<pre><code class="language-python">from abc import ABC, abstractmethod


class Storage(ABC):
    @abstractmethod
    def save(self, key: str, data: bytes) -&gt; None:
        """Grava. Sobrescreve se existir. Qualquer chave não vazia é válida."""

    @abstractmethod
    def load(self, key: str) -&gt; bytes:
        """Devolve os bytes. Levanta KeyError se a chave não existe."""


class S3Storage(Storage):
    def save(self, key, data):
        if not key.startswith("prod/"):                 # reforça a pré-condição
            raise ValueError("key must start with prod/")
        ...

    def load(self, key):
        obj = self._client.get(key)
        return obj.body if obj else None               # enfraquece a pós-condição


class ReadOnlyStorage(Storage):
    def save(self, key, data):
        raise NotImplementedError("read-only")          # recusa o contrato inteiro</code></pre>
<p>Cada subclasse quebra uma regra diferente: <code>S3Storage.save</code> reforça a pré-condição; <code>load</code> devolve <code>None</code> onde o contrato prometia bytes ou <code>KeyError</code>; <code>ReadOnlyStorage</code> existe como subtipo mas lança <code>NotImplementedError</code> em um método que o cliente tem direito de chamar. Esta última é a violação mais comum e o seu sinal é inconfundível: método que levanta <code>NotImplementedError</code>, ou que faz <code>pass</code> silencioso, em uma subclasse concreta.</p>
<div class="callout warn"><strong>PEGADINHA</strong> Cliente com <code>isinstance(x, ReadOnlyStorage)</code> para pular o <code>save</code> é a assinatura do LSP violado e, de brinde, do OCP violado. Cada subtipo novo obriga a editar o cliente.</div>
<p>Correção: dividir a interface (<code>Readable</code>, <code>Writable</code>, veja ISP na próxima lição), de modo que o <code>ReadOnlyStorage</code> implemente só <code>Readable</code> e ninguém espere dele um <code>save</code>.</p>` },
    { id: 'python-ferramentas', title: 'O que Python verifica, e o que não', body: `<p>Os checkers estáticos pegam a parte sintática do LSP:</p>
<pre><code class="language-python">from typing import override   # Python 3.12+ (PEP 698)


class Base:
    def process(self, items: list[int]) -&gt; int:
        return sum(items)


class Child(Base):
    @override
    def process(self, items: list[int], strict: bool) -&gt; int:   # mypy/pyright: assinatura incompatível
        return sum(items)</code></pre>
<p>O <code>@override</code> (PEP 698) faz o checker acusar métodos que "sobrescrevem" algo que não existe, e a verificação padrão de override aponta parâmetros obrigatórios a mais (pré-condição reforçada) e retornos menos específicos. Em mypy: <code>--strict</code>; em pyright: modo <code>strict</code> ou a regra <code>reportIncompatibleMethodOverride</code>.</p>
<p>O que nenhum checker pega: pré e pós-condições <em>semânticas</em> (a chave precisa começar com <code>prod/</code>, o retorno é nunca <code>None</code> em casos documentados). Para isso:</p>
<ul>
<li><strong>Teste de contrato:</strong> uma suíte parametrizada que roda contra <em>todas</em> as implementações. Se a nova implementação falha, ela não é substituível.</li>
<li><strong>Hypothesis</strong> (property-based testing) para gerar entradas e verificar invariantes entre subtipos.</li>
<li><strong>Docstrings que enunciam o contrato</strong> (o que o método exige e promete), já que o LSP é sobre isso.</li>
</ul>
<pre><code class="language-python">import pytest

IMPLEMENTATIONS = [InMemoryStorage, S3Storage, FileStorage]


@pytest.fixture(params=IMPLEMENTATIONS)
def storage(request):
    return request.param()


def test_roundtrip(storage):
    storage.save("k", b"abc")
    assert storage.load("k") == b"abc"


def test_load_missing_raises_keyerror(storage):
    with pytest.raises(KeyError):
        storage.load("nao-existe")</code></pre>
<p>Esse é o teste de contrato. Cada novo <code>Storage</code> entra na lista e herda a bateria. É o jeito prático de manter o LSP vivo em uma base de código.</p>` },
    { id: 'composicao', title: 'Herança vs composição e o princípio de Hynek', body: `<p>O LSP é, na prática, um argumento contra herança usada por reaproveitamento de código. Quando você herda só para não reescrever três métodos, e depois precisa desabilitar dois, você tem um subtipo falso. A alternativa em Python é composição com delegação:</p>
<pre><code class="language-python">class FileStorage:
    def save(self, key: str, data: bytes) -&gt; None: ...
    def load(self, key: str) -&gt; bytes: ...


class CachedStorage:
    """Não herda: compõe. O contrato de Storage é cumprido por delegação."""

    def __init__(self, inner: Storage, cache: dict[str, bytes] | None = None) -&gt; None:
        self._inner = inner
        self._cache = {} if cache is None else cache

    def save(self, key: str, data: bytes) -&gt; None:
        self._inner.save(key, data)
        self._cache[key] = data

    def load(self, key: str) -&gt; bytes:
        if key not in self._cache:
            self._cache[key] = self._inner.load(key)
        return self._cache[key]</code></pre>
<p>Hynek Schlawack resume em "Subclassing in Python Redux": herança é para customizar <em>o que a própria biblioteca documentou como ponto de extensão</em> (métodos abstratos, hooks). Fora disso, componha. Em Python a coleção padrão <code>dict</code> mostra a armadilha: herdar de <code>dict</code> e sobrescrever <code>__setitem__</code> não afeta <code>update()</code> nem <code>setdefault()</code> (implementados em C sem chamar o seu método). A subclasse "parece" um <code>dict</code> mas não se comporta como um para todos os clientes. Para isso existem <code>collections.UserDict</code> e <code>collections.abc.MutableMapping</code>, desenhados para herança segura.</p>
<div class="callout tip"><strong>DICA</strong> Pergunta de revisão: "se eu trocar o objeto base por este subtipo em todos os lugares, o sistema ainda funciona?" Se a resposta exige um "depende de qual cliente", não é subtipo.</div>` },
    { id: 'overengineering', title: 'O contraponto: LSP não pede hierarquias perfeitas', body: `<p>Duas formas de levar o LSP longe demais:</p>
<ul>
<li><strong>Taxonomias intermináveis:</strong> criar <code>AbstractReadWriteSeekableStorage</code>, <code>ReadOnlySeekableStorage</code> etc. para satisfazer todas as combinações. A solução é Protocols pequenos por capacidade (lição 28), não uma árvore.</li>
<li><strong>Tratar duck typing como se exigisse prova formal.</strong> Python é uma linguagem de contratos informais e testes. Escrever pré e pós-condições para código interno de uma pessoa só é custo sem retorno. O LSP compensa nas <em>fronteiras</em>: APIs públicas, plugins, interfaces entre times.</li>
</ul>
<p>Também há o argumento de que o LSP é incompleto: ele diz o que é um subtipo válido, mas não diz quando <em>criar</em> um subtipo. A resposta madura é "raramente": prefira funções, Protocols e composição, e reserve a herança concreta para hierarquias estáveis e pequenas (exceções customizadas, hierarquias de <code>enum</code>, <code>ABC</code> com template method).</p>
<pre><code class="language-python"># Herança legítima e pequena: exceções do domínio.
class DomainError(Exception): ...
class InsufficientFunds(DomainError): ...
class AccountClosed(DomainError): ...

def handle(op):
    try:
        op()
    except DomainError as e:     # qualquer subtipo é substituível aqui
        log_and_report(e)</code></pre>
<p>Aqui o LSP trabalha a favor: o <code>except DomainError</code> é um cliente que aceita qualquer subtipo, e adicionar uma nova exceção não exige mudar nada. É o caso ideal de subtipagem: contrato mínimo (ser uma exceção) e variação só na semântica do nome.</p>` },
    { id: 'entrevista', title: 'Entrevista e produção', body: `<ul>
<li><strong>"Explique LSP sem usar a palavra herança."</strong> "Qualquer implementação de uma interface precisa cumprir o contrato que o cliente assume: exigir no máximo o que a base exigia e entregar no mínimo o que ela prometia."</li>
<li><strong>"Um quadrado é um retângulo?"</strong> Depende de mutabilidade. Imutável, sim. Com setters independentes, não. Cite a pós-condição de <code>set_width</code>.</li>
<li><strong>"Como você detecta violações?"</strong> <code>NotImplementedError</code> em subclasse concreta, <code>isinstance</code> no cliente, checker com <code>@override</code>, e testes de contrato parametrizados sobre todas as implementações.</li>
<li><strong>"Qual a relação com o type checker?"</strong> Cobre variância de assinatura; não cobre semântica. Variância: parâmetros contravariantes, retornos covariantes.</li>
</ul>
<p>Em produção, as violações de LSP viram incidentes de "funciona com o provedor A mas quebra com o B", ou "o mock passa e a implementação real falha". Um fake que não cumpre o mesmo contrato do real é um subtipo desonesto, e o teste que passa com ele mente. Por isso o teste de contrato roda contra o real e contra o fake.</p>` }
  ],
  whenToUse: [
    'Você define uma interface que terceiros ou outros times vão implementar (plugins, adapters)',
    'Há uma hierarquia onde clientes usam isinstance para tratar subtipos de forma especial',
    'Subclasses levantam NotImplementedError em métodos herdados',
    'Você precisa garantir que fakes e implementações reais são intercambiáveis nos testes',
    'Revisão de PR com herança: a subclasse realmente cumpre o contrato do tipo base?'
  ],
  whenNot: [
    'Código interno e descartável, onde um contrato formal custa mais do que protege',
    'Herdar só para reaproveitar código (prefira composição e delegação)',
    'Criar taxonomias de ABCs para cobrir todas as combinações de capacidade',
    'Pensar que o type checker verde basta: ele não vê pré e pós-condições semânticas',
    'Herdar de dict, list ou str esperando que métodos internos chamem seus overrides'
  ],
  metrics: [
    'mypy --strict e pyright (reportIncompatibleMethodOverride) para variância de assinatura',
    '@override (PEP 698, Python 3.12+) para pegar overrides quebrados em refatorações',
    'Testes de contrato parametrizados com pytest rodando sobre todas as implementações',
    'Hypothesis para verificar invariantes entre tipo base e subtipo',
    'grep por NotImplementedError em classes concretas e por isinstance em clientes',
    'collections.UserDict e MutableMapping em vez de herdar de dict'
  ],
  refs: [
    { type: 'paper', title: 'A Behavioral Notion of Subtyping', author: 'Barbara Liskov e Jeannette Wing (ACM TOPLAS, 1994)', url: 'https://www.cs.cmu.edu/~wing/publications/LiskovWing94.pdf', note: 'A definição formal: pré, pós, invariantes e a regra do histórico.' },
    { type: 'video', title: 'Data Abstraction and Hierarchy (keynote OOPSLA 1987)', author: 'Barbara Liskov', url: 'https://en.wikipedia.org/wiki/Liskov_substitution_principle', note: 'Origem histórica do princípio, com referências ao texto original.' },
    { type: 'artigo', title: 'Subclassing in Python Redux', author: 'Hynek Schlawack', url: 'https://hynek.me/articles/python-subclassing-redux/', note: 'Quando herdar em Python é seguro e quando prefira composição.' },
    { type: 'doc', title: 'PEP 698: Override Decorator for Static Typing', author: 'Python PEPs', url: 'https://peps.python.org/pep-0698/', note: 'typing.override, Python 3.12.' },
    { type: 'doc', title: 'Protocols and structural subtyping', author: 'mypy docs', url: 'https://mypy.readthedocs.io/en/stable/protocols.html', note: 'Como descrever contratos sem herança.' },
    { type: 'livro', title: 'Clean Architecture', author: 'Robert C. Martin', url: 'https://www.oreilly.com/library/view/clean-architecture-a/9780134494272/', note: 'Capítulo 9: o LSP como princípio de arquitetura, não só de classes.' },
    { type: 'portal', title: 'Composition Over Inheritance', author: 'Brandon Rhodes (python-patterns.guide)', url: 'https://python-patterns.guide/gang-of-four/composition-over-inheritance/', note: 'Os problemas de herança com exemplos em Python.' },
    { type: 'doc', title: 'collections.abc', author: 'Python Docs', url: 'https://docs.python.org/3/library/collections.abc.html', note: 'ABCs desenhadas para herança segura (MutableMapping etc.).' }
  ]
};

window.LESSON_CONTENT['isp'] = {
  id: 'isp',
  title: 'Interface Segregation',
  etapa: 5, etapaName: 'SOLID & princípios',
  time: '45 min',
  tags: ['SOLID', 'Protocol', 'interfaces', 'duck typing'],
  tagline: 'Nenhum cliente deve ser forçado a depender de métodos que <em>não usa</em>.',
  intro: `<p>O Interface Segregation Principle nasceu de um problema prático na Xerox, no começo dos anos 1990: uma classe de job de impressora tinha dezenas de métodos (imprimir, grampear, escanear, enviar fax) e cada tarefa nova obrigava a recompilar e reimplantar todo cliente, mesmo os que só imprimiam. Robert C. Martin consultou a equipe e formulou: "clientes não devem ser forçados a depender de interfaces que não usam". A solução foi dividir a interface gorda em interfaces menores, uma por papel de cliente.</p>
<p>O princípio fala de <em>dependência</em>, não de contagem de métodos. Em C++ e Java o custo era recompilação e acoplamento de implantação. Em Python o custo é diferente, e mais sutil: acoplamento semântico (o cliente passa a exigir mais do que precisa, o que torna fakes pesados) e implementações obrigadas a fingir métodos que não fazem sentido (o gatilho do LSP violado da lição anterior).</p>
<p>Python tem uma vantagem histórica aqui: duck typing é segregação de interface por padrão. Uma função que chama só <code>.read()</code> aceita qualquer objeto com <code>read()</code>. O <code>typing.Protocol</code> (PEP 544) trouxe isso para o mundo estático, e é a ferramenta natural do ISP em Python moderno.</p>`,
  sections: [
    { id: 'definicao', title: 'A definição e o caso Xerox', body: `<p>Em <em>Agile Software Development</em> Martin descreve o problema da classe <code>Job</code>: todos os clientes (impressão, grampeador, fax) dependiam da mesma classe com todos os métodos. Qualquer mudança em um método de grampear forçava recompilar quem só imprimia. A solução foi uma interface por cliente, e <code>Job</code> passou a implementar várias delas.</p>
<p>A formulação contemporânea: <strong>defina interfaces pelo ponto de vista do cliente</strong>, não do implementador. Quem consome decide o que precisa. O nome técnico é "role interface" (Martin Fowler): uma interface por papel que o objeto desempenha para determinado cliente.</p>
<ul>
<li><strong>Interface gorda (fat interface):</strong> um único contrato com muitos métodos, usado por clientes com necessidades distintas.</li>
<li><strong>Interface de papel (role interface):</strong> contrato mínimo para um cliente. A mesma classe concreta cumpre várias.</li>
<li><strong>Sinal de violação:</strong> implementações com métodos vazios, <code>pass</code>, ou <code>raise NotImplementedError</code>; fakes de teste com 20 métodos para exercitar 1.</li>
</ul>
<div class="callout"><strong>NA ENTREVISTA</strong> Relacione: ISP é o antídoto estrutural do LSP violado. Se a interface é pequena e coesa, ninguém precisa fingir método. E o ISP protege o DIP: abstração gorda é abstração que vaza.</div>` },
    { id: 'violacao', title: 'Violação realista: a ABC gorda', body: `<pre><code class="language-python">from abc import ABC, abstractmethod


class DataStore(ABC):
    @abstractmethod
    def read(self, key: str) -&gt; bytes: ...
    @abstractmethod
    def write(self, key: str, data: bytes) -&gt; None: ...
    @abstractmethod
    def delete(self, key: str) -&gt; None: ...
    @abstractmethod
    def list_keys(self, prefix: str) -&gt; list[str]: ...
    @abstractmethod
    def begin_transaction(self) -&gt; None: ...
    @abstractmethod
    def commit(self) -&gt; None: ...


class HttpCacheStore(DataStore):          # só consegue ler e escrever
    def read(self, key): ...
    def write(self, key, data): ...
    def delete(self, key): raise NotImplementedError
    def list_keys(self, prefix): raise NotImplementedError
    def begin_transaction(self): pass           # silêncio perigoso
    def commit(self): pass


def export_report(store: DataStore, key: str) -&gt; str:
    return store.read(key).decode()      # só precisa de read, mas depende de tudo</code></pre>
<p>Três problemas ao mesmo tempo: <code>HttpCacheStore</code> é forçada a implementar o que não faz sentido (e <code>begin_transaction</code> como <code>pass</code> mente: o cliente acha que há transação); <code>export_report</code> depende de uma interface com seis métodos para usar um; e testar <code>export_report</code> exige um fake com seis métodos.</p>` },
    { id: 'refatoracao', title: 'Refatoração: Protocols por papel', body: `<pre><code class="language-python">from typing import Protocol


class Reader(Protocol):
    def read(self, key: str) -&gt; bytes: ...


class Writer(Protocol):
    def write(self, key: str, data: bytes) -&gt; None: ...


class Lister(Protocol):
    def list_keys(self, prefix: str) -&gt; list[str]: ...


class ReadWriter(Reader, Writer, Protocol):     # composição de papéis
    ...


def export_report(store: Reader, key: str) -&gt; str:
    return store.read(key).decode()</code></pre>
<p>Para exigir dois papéis ao mesmo tempo, não existe intersecção de tipos em Python (<code>Reader &amp; Lister</code> não é sintaxe válida de tipos). A forma correta é declarar um Protocol que herda dos dois:</p>
<pre><code class="language-python">class ReadableCatalog(Reader, Lister, Protocol):
    ...


def backup(src: ReadableCatalog, dst: Writer) -&gt; None:
    for k in src.list_keys(""):
        dst.write(k, src.read(k))</code></pre>
<p>Agora <code>HttpCacheStore</code> cumpre <code>Reader</code> e <code>Writer</code> sem herdar nada e sem métodos mentirosos. O <code>export_report</code> aceita qualquer coisa com <code>read</code>, e seu teste usa um fake de uma linha. Os Protocols seguem tipagem estrutural: o checker confere, em tempo de verificação, que o objeto passado tem os métodos certos.</p>` },
    { id: 'stdlib', title: 'ISP já existe na stdlib: file-like e collections.abc', body: `<p>A biblioteca padrão é um bom exemplo de interfaces estreitas. Compare:</p>
<ul>
<li><strong>Objetos file-like:</strong> <code>json.load(fp)</code> exige só <code>fp.read()</code>. <code>json.dump(obj, fp)</code> exige só <code>fp.write()</code>. Por isso funcionam com <code>StringIO</code>, socket wrapper, arquivo, resposta HTTP.</li>
<li><strong><code>collections.abc</code>:</strong> <code>Iterable</code> (só <code>__iter__</code>), <code>Sized</code> (<code>__len__</code>), <code>Container</code> (<code>__contains__</code>), <code>Collection</code> (as três), <code>Sequence</code>, <code>MutableSequence</code>. Uma hierarquia graduada: você pede o <em>mínimo</em> necessário.</li>
<li><strong><code>typing.SupportsInt</code>, <code>SupportsFloat</code>, <code>SupportsIndex</code>, <code>SupportsAbs</code>:</strong> Protocols de uma operação.</li>
</ul>
<pre><code class="language-python">from collections.abc import Iterable, Sequence


# Pede o mínimo: serve para lista, tupla, gerador, set, arquivo...
def total(xs: Iterable[float]) -&gt; float:
    return sum(xs)


# Pede mais porque PRECISA: indexação e len.
def median(xs: Sequence[float]) -&gt; float:
    s = sorted(xs)
    n = len(s)
    return s[n // 2] if n % 2 else (s[n // 2 - 1] + s[n // 2]) / 2</code></pre>
<p>A regra prática, resumida no princípio de Postel adaptado a tipos: <strong>aceite o tipo mais genérico possível, devolva o mais específico</strong>. Parâmetros como <code>Iterable</code>, <code>Mapping</code>, <code>Sequence</code>; retornos como <code>list</code> ou <code>dict</code> concretos.</p>` },
    { id: 'runtime', title: 'runtime_checkable, ABCs e quando usar cada um', body: `<table><thead><tr><th>Ferramenta</th><th>Quando</th><th>Custo</th></tr></thead><tbody>
<tr><td>Duck typing sem anotação</td><td>Scripts, código interno</td><td>Nenhum, mas sem checagem</td></tr>
<tr><td><code>Protocol</code></td><td>Fronteira entre módulos, bibliotecas, fakes de teste</td><td>Só verificação estática</td></tr>
<tr><td><code>@runtime_checkable</code> Protocol</td><td>Precisa de <code>isinstance</code> em tempo de execução</td><td>Checa só presença de métodos, não assinatura</td></tr>
<tr><td><code>ABC</code></td><td>Template method, estado/comportamento comum, registro explícito</td><td>Acoplamento por herança</td></tr>
<tr><td><code>Callable[...]</code></td><td>Interface de um método só</td><td>Perde o nome do papel</td></tr>
</tbody></table>
<pre><code class="language-python">from typing import Protocol, runtime_checkable


@runtime_checkable
class Closeable(Protocol):
    def close(self) -&gt; None: ...


def shutdown(resources: list[object]) -&gt; None:
    for r in resources:
        if isinstance(r, Closeable):      # só verifica que 'close' existe
            r.close()</code></pre>
<div class="callout warn"><strong>PEGADINHA</strong> <code>isinstance</code> com Protocol runtime-checkable confere apenas se os atributos existem, não suas assinaturas nem tipos. Além disso é mais lento que <code>isinstance</code> comum. Use com parcimônia, de preferência só em fronteiras, não em laços quentes. Protocols de dados (com atributos não-método) não suportam <code>issubclass</code>.</div>
<p>ABC ganha de Protocol quando você quer <em>compartilhar implementação</em> ou impor que as subclasses declarem o contrato de forma explícita (ex.: <code>collections.abc.MutableMapping</code> fornece <code>update</code>, <code>pop</code>, <code>setdefault</code> de graça se você implementar cinco métodos básicos). Protocol ganha quando você não controla as implementações (código de terceiros, <code>file</code>, <code>socket</code>).</p>` },
    { id: 'overengineering', title: 'O contraponto: interface para tudo', body: `<p>O ISP levado ao extremo gera "interfaces de um método para cada função", e você acaba com <code>Readable</code>, <code>Writable</code>, <code>Seekable</code>, <code>Closeable</code>, <code>Flushable</code> quando o cliente precisa mesmo é de um objeto de arquivo. A razão da segregação é proteger o cliente de acoplamento que dói. Se a interface gorda <em>nunca</em> teve uma implementação que não suportasse tudo, nem um cliente que usasse só parte, a segregação é cerimônia.</p>
<ul>
<li><strong>Segregue quando houver dor:</strong> implementações que mentem, fakes inchados, clientes com necessidades claramente distintas.</li>
<li><strong>Não crie Protocol para classe que só você implementa e só um cliente usa.</strong> Passe a classe concreta. Extraia o Protocol quando surgir a segunda implementação ou a necessidade de isolar em teste.</li>
<li><strong>Em Python a função é a menor interface.</strong> Um <code>Callable</code> tipado evita criar um Protocol de um método.</li>
</ul>
<pre><code class="language-python"># Exagero: um Protocol por função, para um único cliente interno.
class PriceCalculator(Protocol):
    def calc(self, qty: int) -&gt; float: ...

# Basta:
def checkout(qty: int, price_of: Callable[[int], float]) -&gt; float:
    return price_of(qty)</code></pre>
<p>Há ainda um custo de descoberta: dez Protocols minúsculos em dez arquivos tornam difícil saber "o que posso fazer com isso". Agrupe Protocols relacionados no mesmo módulo, e nomeie por papel (<code>Reader</code>, <code>Clock</code>, <code>Notifier</code>), não por classe concreta.</p>` },
    { id: 'entrevista', title: 'Entrevista e produção', body: `<ul>
<li><strong>"ISP em Python, onde?"</strong> <code>collections.abc</code>, file-like, <code>Protocol</code> pequeno por papel, <code>Callable</code> para interface de um método.</li>
<li><strong>"Por que Protocol e não ABC?"</strong> Tipagem estrutural: a implementação não precisa conhecer a interface, o que desacopla bibliotecas. ABC quando há implementação compartilhada.</li>
<li><strong>"Como o ISP ajuda os testes?"</strong> Fakes mínimos. Se o seu fake tem mais de três métodos, a interface provavelmente é gorda demais.</li>
<li><strong>"Qual a diferença entre ISP e SRP?"</strong> SRP olha para <em>quem implementa</em> (uma razão de mudança). ISP olha para <em>quem consome</em> (o cliente não paga por métodos que não usa).</li>
</ul>
<p>Em produção, o ISP aparece nos limites de pacote: o serviço de domínio declara <code>class Clock(Protocol): def now(self) -&gt; datetime</code> e <code>class Mailer(Protocol)</code>, e a infraestrutura os implementa. Mudar o provedor de e-mail nunca atinge o domínio. É o miolo da arquitetura hexagonal e a base da próxima lição.</p>` }
  ],
  whenToUse: [
    'Implementações precisam levantar NotImplementedError ou usar pass em métodos herdados',
    'Fakes de teste têm muitos métodos para exercitar um só',
    'Clientes diferentes usam subconjuntos disjuntos de uma mesma interface',
    'Você expõe uma API a terceiros e quer um contrato mínimo e estável',
    'Parâmetros podem ser mais genéricos (Iterable, Mapping) do que o tipo concreto atual'
  ],
  whenNot: [
    'Há uma implementação só e um cliente só: passe a classe concreta',
    'A interface gorda nunca teve cliente que usasse só parte dela',
    'Criar um Protocol de um método quando um Callable tipado serve',
    'Espalhar dezenas de Protocols minúsculos sem agrupamento e sem nome de papel',
    'Usar isinstance com Protocol runtime-checkable em laços quentes de desempenho'
  ],
  metrics: [
    'Número de métodos por Protocol e por fake de teste (alvo: poucos)',
    'Contagem de NotImplementedError e pass em classes concretas (grep)',
    'mypy --strict e pyright validando a compatibilidade estrutural dos Protocols',
    'typing.get_protocol_members (3.13) para inspecionar membros de um Protocol',
    'pytest: verificar que as implementações reais satisfazem o mesmo teste de contrato dos fakes',
    'Parâmetros anotados com Iterable, Mapping e Sequence em vez de list e dict quando possível'
  ],
  refs: [
    { type: 'doc', title: 'PEP 544: Protocols, structural subtyping (static duck typing)', author: 'Ivan Levkivskyi, Jukka Lehtosalo e Łukasz Langa', url: 'https://peps.python.org/pep-0544/', note: 'O mecanismo oficial para ISP em Python, com motivação e exemplos.' },
    { type: 'doc', title: 'Protocols and structural subtyping', author: 'mypy docs', url: 'https://mypy.readthedocs.io/en/stable/protocols.html', note: 'Guia prático, inclusive runtime_checkable e limitações.' },
    { type: 'doc', title: 'collections.abc: Abstract Base Classes for Containers', author: 'Python Docs', url: 'https://docs.python.org/3/library/collections.abc.html', note: 'A hierarquia graduada de interfaces da stdlib.' },
    { type: 'artigo', title: 'Solid Relevance', author: 'Robert C. Martin', url: 'https://blog.cleancoder.com/uncle-bob/2020/10/18/Solid-Relevance.html', note: 'Martin revisita os cinco princípios e explica a intenção do ISP.' },
    { type: 'artigo', title: 'RoleInterface', author: 'Martin Fowler', url: 'https://martinfowler.com/bliki/RoleInterface.html', note: 'Interfaces definidas pelo papel do cliente, o conceito por trás do ISP.' },
    { type: 'doc', title: 'typing: Protocols e runtime_checkable', author: 'Python Docs', url: 'https://docs.python.org/3/library/typing.html#typing.Protocol', note: 'Referência oficial, incluindo limitações do isinstance.' },
    { type: 'livro', title: 'Architecture Patterns with Python', author: 'Harry Percival e Bob Gregory', url: 'https://www.cosmicpython.com/book/chapter_03_abstractions.html', note: 'Abstrações mínimas para isolar I/O; capítulo 3, aberto online.' },
    { type: 'livro', title: 'Fluent Python, 2ª edição', author: 'Luciano Ramalho', url: 'https://www.oreilly.com/library/view/fluent-python-2nd/9781492056348/', note: 'Parte sobre Protocols, duck typing e ABCs em profundidade.' }
  ]
};

window.LESSON_CONTENT['dip'] = {
  id: 'dip',
  title: 'Dependency Inversion',
  etapa: 5, etapaName: 'SOLID & princípios',
  time: '60 min',
  tags: ['SOLID', 'injeção de dependência', 'arquitetura', 'testes'],
  tagline: 'A regra de negócio não importa o banco: o banco é que <em>implementa o que a regra declarou</em>.',
  intro: `<p>O Dependency Inversion Principle (DIP) tem duas partes, na formulação de Robert C. Martin (1996, "The Dependency Inversion Principle", C++ Report): "módulos de alto nível não devem depender de módulos de baixo nível, ambos devem depender de abstrações" e "abstrações não devem depender de detalhes, detalhes devem depender de abstrações". A palavra "inversão" é sobre o <em>sentido da seta de dependência no código-fonte</em>: o fluxo de execução continua indo da regra de negócio para o banco, mas a dependência de import aponta do banco para a regra.</p>
<p>É o princípio que sustenta arquitetura hexagonal, Clean Architecture e o "ports and adapters". Ele também é frequentemente confundido com <strong>injeção de dependência</strong> (DI) e com <strong>frameworks de IoC</strong>. São coisas diferentes: DIP é um princípio de design (quem depende de quem), DI é uma técnica (passar a dependência de fora), um container de IoC é uma ferramenta (automatiza a montagem). Em Python, você pode ter DIP e DI sem container nenhum, e na maioria dos projetos deve.</p>
<p>O ganho prático é testabilidade e trocabilidade: a regra de negócio roda em milissegundos com fakes em memória, e trocar PostgreSQL por outra coisa, ou o provedor de e-mail, é uma mudança confinada à borda.</p>`,
  sections: [
    { id: 'definicao', title: 'O que está sendo invertido', body: `<p>Sem DIP, a seta de dependência segue o fluxo de controle:</p>
<div class="math">PedidoService  -&gt;  PostgresRepo  -&gt;  psycopg</div>
<p>O serviço de pedido (alto nível, política) importa o repositório Postgres (baixo nível, detalhe). Para testar o serviço você precisa de Postgres; para trocar o banco, você edita o serviço. Com DIP, o alto nível declara <em>o que precisa</em> (uma abstração, que ele possui) e o baixo nível implementa:</p>
<div class="math">PedidoService  -&gt;  OrderRepository (abstração)  &lt;-  PostgresRepo</div>
<p>Dois pontos finos que quase todo mundo erra:</p>
<ul>
<li><strong>A abstração pertence ao alto nível.</strong> O <code>OrderRepository</code> vive no módulo do domínio, escrito em termos do domínio (<code>add(order)</code>, <code>get(order_id)</code>), não em termos do banco (<code>execute(sql)</code>). Se a interface reflete a API do driver, você apenas colocou uma etiqueta no detalhe.</li>
<li><strong>Abstração não é o mesmo que ABC.</strong> Em Python a abstração pode ser um <code>Protocol</code>, uma <code>ABC</code>, ou simplesmente uma função tipada. O que importa é o sentido do import.</li>
</ul>
<div class="callout"><strong>NA ENTREVISTA</strong> Distinga os três: DIP (princípio), DI (técnica de passar a dependência de fora) e IoC container (ferramenta). E diga que em Python DI por construtor ou por parâmetro de função cobre 90% dos casos, sem container.</div>` },
    { id: 'violacao', title: 'Violação realista: o serviço que constrói seus colaboradores', body: `<pre><code class="language-python">import requests
import psycopg


class SignupService:
    def register(self, email: str) -&gt; None:
        # dependência concreta criada dentro do método
        conn = psycopg.connect("dbname=app user=app")
        conn.execute("INSERT INTO users(email) VALUES (%s)", (email,))
        conn.commit()

        requests.post(
            "https://api.mailprovider.com/send",
            json={"to": email, "template": "welcome"},
            timeout=5,
        )</code></pre>
<p>Para testar <code>register</code> sem rede e sem banco o caminho é <code>unittest.mock.patch("mod.psycopg.connect")</code> e <code>patch("mod.requests.post")</code>: o teste fica acoplado ao <em>nome do import</em> e quebra a cada refatoração, mesmo com o comportamento intacto. Trocar o provedor de e-mail exige editar a regra de cadastro. Esses são os dois sintomas de um DIP violado: teste que depende de <code>patch</code> de módulo, e mudança de infraestrutura que atinge a política.</p>` },
    { id: 'refatoracao', title: 'Refatoração: abstração no domínio, injeção por construtor', body: `<pre><code class="language-python"># domain/signup.py   (não importa psycopg nem requests)
from typing import Protocol


class UserRepository(Protocol):
    def add(self, email: str) -&gt; None: ...
    def exists(self, email: str) -&gt; bool: ...


class WelcomeMailer(Protocol):
    def send_welcome(self, email: str) -&gt; None: ...


class EmailAlreadyRegistered(Exception): ...


class SignupService:
    def __init__(self, users: UserRepository, mailer: WelcomeMailer) -&gt; None:
        self._users = users
        self._mailer = mailer

    def register(self, email: str) -&gt; None:
        if self._users.exists(email):
            raise EmailAlreadyRegistered(email)
        self._users.add(email)
        self._mailer.send_welcome(email)</code></pre>
<pre><code class="language-python"># infra/postgres.py e infra/mail.py  (os detalhes importam o domínio, nunca o contrário)
class PostgresUserRepository:
    def __init__(self, conn) -&gt; None:
        self._conn = conn

    def add(self, email: str) -&gt; None:
        self._conn.execute("INSERT INTO users(email) VALUES (%s)", (email,))
        self._conn.commit()

    def exists(self, email: str) -&gt; bool:
        row = self._conn.execute("SELECT 1 FROM users WHERE email=%s", (email,)).fetchone()
        return row is not None


class HttpWelcomeMailer:
    def __init__(self, session, base_url: str) -&gt; None:
        self._session, self._base_url = session, base_url

    def send_welcome(self, email: str) -&gt; None:
        self._session.post(f"{self._base_url}/send", json={"to": email, "template": "welcome"}, timeout=5)</code></pre>
<pre><code class="language-python"># tests/test_signup.py: sem patch, sem rede, sem banco
class InMemoryUsers:
    def __init__(self): self.emails = set()
    def add(self, email): self.emails.add(email)
    def exists(self, email): return email in self.emails

class SpyMailer:
    def __init__(self): self.sent = []
    def send_welcome(self, email): self.sent.append(email)


def test_register_envia_boas_vindas():
    users, mailer = InMemoryUsers(), SpyMailer()
    SignupService(users, mailer).register("a@b.com")
    assert "a@b.com" in users.emails and mailer.sent == ["a@b.com"]</code></pre>` },
    { id: 'composicao-root', title: 'Composition root: onde as dependências são montadas', body: `<p>Alguém precisa instanciar as implementações concretas. Esse lugar é a <strong>composition root</strong>, o ponto de entrada da aplicação (<code>main()</code>, factory do app, <code>lifespan</code> do FastAPI). Só ele conhece os detalhes. Todo o resto recebe abstrações.</p>
<pre><code class="language-python"># app/main.py: o único lugar que sabe quem implementa o quê
import psycopg
import requests

from domain.signup import SignupService
from infra.postgres import PostgresUserRepository
from infra.mail import HttpWelcomeMailer


def build_signup_service() -&gt; SignupService:
    conn = psycopg.connect("dbname=app user=app")
    users = PostgresUserRepository(conn)
    mailer = HttpWelcomeMailer(requests.Session(), "https://api.mailprovider.com")
    return SignupService(users, mailer)</code></pre>
<p>Em frameworks, o mecanismo de DI é nativo e não exige biblioteca extra. No FastAPI, <code>Depends</code> compõe dependências por requisição e permite sobrescrevê-las em teste (<code>app.dependency_overrides</code>). No pytest, fixtures fazem o papel de composition root dos testes. Containers dedicados (<code>dependency-injector</code>, <code>punq</code>, <code>lagom</code>) ajudam quando o grafo de objetos é grande e cheio de escopos, mas costumam ser exagero em um serviço com 10 classes. Percival e Gregory dedicam o capítulo 13 de <em>Architecture Patterns with Python</em> a esse tema e fazem a injeção "à mão" em um bootstrap.</p>
<div class="callout tip"><strong>DICA</strong> Teste de pureza: o módulo de domínio não deve ter <code>import</code> de driver, framework web ou SDK. Automatize com <code>import-linter</code>, que quebra o CI quando alguém importa a infra a partir do domínio.</div>
<pre><code class="language-toml"># .importlinter
[importlinter]
root_package = shop

[importlinter:contract:domain-independente]
name = O domínio não importa infraestrutura
type = forbidden
source_modules = shop.domain
forbidden_modules = shop.infra</code></pre>` },
    { id: 'funcoes', title: 'A forma pythônica: funções como dependência e defaults', body: `<p>Em Python nem toda dependência precisa de classe. Quando a dependência é uma capacidade simples (relógio, gerador de id, função de envio), passe uma função:</p>
<pre><code class="language-python">from collections.abc import Callable
from datetime import datetime, UTC


def issue_invoice(
    amount: float,
    *,
    now: Callable[[], datetime] = lambda: datetime.now(UTC),
    new_id: Callable[[], str],
) -&gt; dict:
    return {"id": new_id(), "amount": amount, "issued_at": now()}


# produção
import uuid
inv = issue_invoice(10.0, new_id=lambda: str(uuid.uuid4()))

# teste: determinístico, sem patch
fixed = datetime(2026, 1, 1, tzinfo=UTC)
inv = issue_invoice(10.0, now=lambda: fixed, new_id=lambda: "inv-1")
assert inv == {"id": "inv-1", "amount": 10.0, "issued_at": fixed}</code></pre>
<p>Esse é o caminho mais barato para DIP e merece ser o primeiro: relógio, aleatoriedade, UUID e I/O de borda como parâmetros. Duas armadilhas conhecidas de default:</p>
<ul>
<li><strong>Default avaliado na definição:</strong> <code>def f(clock=datetime.now())</code> congela o instante do import. Use <code>None</code> e resolva dentro, ou um <code>lambda</code> como acima.</li>
<li><strong>Estado compartilhado no default:</strong> <code>def f(repo=InMemoryRepo())</code> cria uma instância única compartilhada entre todas as chamadas.</li>
</ul>
<p>Quando existem vários colaboradores relacionados, agrupe em um <code>@dataclass(frozen=True)</code> de "ports" (ou passe pelo construtor). Evite a antipadrão <em>service locator</em> (<code>Registry.get("mailer")</code> dentro da regra): esconde as dependências e reintroduz o acoplamento por um caminho lateral.</p>` },
    { id: 'overengineering', title: 'O contraponto: interface para tudo e containers desnecessários', body: `<p>O DIP mecânico gera o infame <code>IUserRepository</code> com uma única implementação, uma fábrica, um container e um arquivo de configuração XML (o "enterprise Java" que veio parar no Python). O princípio vale nas <strong>fronteiras que realmente variam ou que doem em teste</strong>: banco, rede, relógio, sistema de arquivos, serviços externos. Não vale para tudo.</p>
<ul>
<li><strong>Não abstraia o que é estável e barato de testar.</strong> <code>math</code>, <code>json</code>, <code>dataclasses</code>, listas e dicts de domínio não precisam de inversão.</li>
<li><strong>Uma implementação só e nenhuma dor de teste:</strong> use a classe concreta. Extraia a abstração quando surgir a segunda implementação ou quando o teste exigir (Beck: "faça funcionar, faça certo, faça rápido").</li>
<li><strong>Containers de IoC:</strong> em Python raramente compensam. A DI manual no <code>main()</code> é legível, depurável e sem mágica de reflexão. Containers entram em apps grandes com ciclo de vida complexo (escopos por requisição, singletons, recursos que precisam fechar).</li>
<li><strong>Cuidado com a abstração vazada:</strong> um <code>Repository</code> com <code>find_by_sql(query)</code> expõe o detalhe e invalida o princípio.</li>
</ul>
<div class="callout warn"><strong>PEGADINHA</strong> Mockar tudo não é DIP. Se o seu teste faz <code>patch</code> de cinco módulos, o código ainda está acoplado a nomes concretos. DIP bem aplicado reduz os <code>patch</code> a quase zero, trocando por fakes simples passados pelo construtor.</div>` },
    { id: 'entrevista', title: 'Entrevista e produção', body: `<ul>
<li><strong>"DIP, DI e IoC: qual a diferença?"</strong> Princípio, técnica, ferramenta. Dê o exemplo da seta de import invertida.</li>
<li><strong>"Como testar uma função que chama a API externa?"</strong> Dependência injetada (função ou Protocol) com um fake. Mock de módulo é plano B.</li>
<li><strong>"Onde fica a interface, no domínio ou na infra?"</strong> No domínio. Quem consome define o contrato. A infra importa o domínio para implementá-lo.</li>
<li><strong>"Como evitar que a infra vaze para o domínio?"</strong> <code>import-linter</code> no CI e revisão de PR. A convenção sem verificação automática erode em meses.</li>
</ul>
<p>Em produção, o DIP rende em três momentos: migração de fornecedor (troca de SDK sem tocar regra), testes rápidos (suíte do domínio em segundos) e leitura (o domínio descreve o negócio, sem ruído de driver). O custo é indireção e um pouco mais de código de montagem, e só vale onde há fronteira real.</p>` }
  ],
  whenToUse: [
    'A regra de negócio precisa rodar em teste sem banco, rede ou relógio real',
    'Há (ou haverá) mais de uma implementação de um colaborador: provedores, backends, fakes',
    'Você quer isolar o domínio de frameworks e SDKs (hexagonal, Clean Architecture)',
    'Testes dependem de muitos patch de módulo, frágeis a refatoração',
    'A fronteira externa (pagamento, e-mail, armazenamento) muda por razões fora do seu controle'
  ],
  whenNot: [
    'Colaborador estável e barato de testar (math, json, estruturas de domínio)',
    'Uma única implementação e nenhuma dor de teste: use a classe concreta',
    'Quando o container de IoC é mais complexo que o grafo de 10 objetos que ele monta',
    'Abstrações que espelham a API do driver (find_by_sql): a inversão é só de fachada',
    'Service locator escondendo dependências dentro da regra de negócio'
  ],
  metrics: [
    'import-linter: contrato forbidden entre domain e infra, executado no CI',
    'Número de patch por teste de domínio (alvo: perto de zero)',
    'Tempo da suíte de testes do domínio (deve ser de segundos, sem I/O)',
    'pydeps / pyreverse para visualizar a direção das dependências entre pacotes',
    'mypy --strict: os Protocols do domínio satisfeitos pelas classes de infra',
    'FastAPI app.dependency_overrides e fixtures do pytest como composition root dos testes'
  ],
  refs: [
    { type: 'artigo', title: 'Dependency inversion principle', author: 'Wikipedia', url: 'https://en.wikipedia.org/wiki/Dependency_inversion_principle', note: 'Resumo das duas partes do princípio, com o histórico do artigo de Martin de 1996.' },
    { type: 'livro', title: 'Architecture Patterns with Python, cap. 13: Dependency Injection (and Bootstrapping)', author: 'Harry Percival e Bob Gregory', url: 'https://www.cosmicpython.com/book/chapter_13_dependency_injection.html', note: 'DI à mão e composition root em Python, com testes.' },
    { type: 'livro', title: 'Clean Architecture', author: 'Robert C. Martin', url: 'https://www.oreilly.com/library/view/clean-architecture-a/9780134494272/', note: 'A regra da dependência e a inversão nas fronteiras.' },
    { type: 'artigo', title: 'Inversion of Control Containers and the Dependency Injection pattern', author: 'Martin Fowler', url: 'https://martinfowler.com/articles/injection.html', note: 'A distinção clássica entre DI, service locator e containers.' },
    { type: 'doc', title: 'FastAPI: Dependencies', author: 'Sebastián Ramírez', url: 'https://fastapi.tiangolo.com/tutorial/dependencies/', note: 'DI nativa em um framework Python, com override para testes.' },
    { type: 'doc', title: 'import-linter', author: 'David Seddon', url: 'https://import-linter.readthedocs.io/', note: 'Verifica no CI a direção das dependências entre pacotes.' },
    { type: 'video', title: 'The Clean Architecture in Python', author: 'Brandon Rhodes, PyCon 2014', url: 'https://www.youtube.com/watch?v=DJtef410XaM', note: 'Separação entre núcleo e I/O em Python.' },
    { type: 'doc', title: 'python-dependency-injector', author: 'ETS Labs', url: 'https://python-dependency-injector.ets-labs.org/', note: 'Um container de DI para Python, para quando o grafo realmente cresce.' }
  ]
};

window.LESSON_CONTENT['principios-design'] = {
  id: 'principios-design',
  title: 'DRY, KISS, YAGNI e composição',
  etapa: 5, etapaName: 'SOLID & princípios',
  time: '60 min',
  tags: ['DRY', 'KISS', 'YAGNI', 'composição'],
  tagline: 'Os princípios que <em>freiam</em> o SOLID: simplicidade, composição e o custo da abstração.',
  intro: `<p>SOLID diz como organizar abstrações. DRY, KISS e YAGNI dizem <em>quando</em> não criá-las. Sem esse contrapeso, o SOLID vira um gerador de camadas e interfaces. Esta lição fecha a Etapa 5 com os princípios de design que equilibram o conjunto, e com a regra mais importante de projeto orientado a objetos em Python moderno: <strong>favoreça composição sobre herança</strong> (GoF, 1994).</p>
<p>As siglas têm origens diferentes. DRY (Don't Repeat Yourself) é de Andrew Hunt e David Thomas, <em>The Pragmatic Programmer</em> (1999), e fala de duplicação de <em>conhecimento</em>, não de linhas de código. KISS (Keep It Simple, Stupid) é atribuído ao engenheiro Kelly Johnson, da Lockheed. YAGNI (You Aren't Gonna Need It) vem do Extreme Programming, de Ron Jeffries e Kent Beck: não implemente o que você só <em>acha</em> que vai precisar.</p>
<p>A Lei de Demeter (Ian Holland, projeto Demeter, 1987) e o par acoplamento e coesão completam o kit. Juntos, eles respondem à pergunta de revisão mais difícil: "isso está bem desenhado ou só parece?".</p>`,
  sections: [
    { id: 'dry', title: 'DRY: duplicação de conhecimento, não de texto', body: `<p>Hunt e Thomas formularam: "todo conhecimento deve ter uma representação única, não ambígua e autoritativa dentro do sistema". O erro comum é tratar DRY como "nunca repita três linhas". Dois trechos que <em>parecem</em> iguais mas mudam por razões diferentes são <strong>duplicação acidental</strong>, e unificá-los cria acoplamento artificial. Já duas fontes de verdade para a mesma regra (uma validação no front e outra no back, uma alíquota hardcoded em três módulos) são duplicação de conhecimento.</p>
<pre><code class="language-python"># Duplicação de CONHECIMENTO: a alíquota mora em três lugares.
def invoice_total(subtotal): return subtotal * 1.12
def refund_amount(subtotal):  return subtotal * 1.12
def tax_report(subtotal):     return subtotal * 0.12

# Uma fonte autoritativa:
TAX_RATE = 0.12

def with_tax(subtotal: float) -&gt; float: return subtotal * (1 + TAX_RATE)
def tax_of(subtotal: float) -&gt; float:   return subtotal * TAX_RATE</code></pre>
<p>O contraponto vem de Sandi Metz: <strong>"duplicação é muito mais barata que a abstração errada"</strong>. Quando você unifica dois trechos parecidos com parâmetros e flags (<code>def process(kind, strict=False, legacy=False)</code>) e a cada novo caso acrescenta mais um <code>if</code> na função compartilhada, a "abstração" virou uma função com muitos modos, e cada mudança arrisca quebrar os outros chamadores. A regra do três ajuda: duas ocorrências, tolere; três, extraia, porque aí você já viu a forma real da variação. Em caso de dúvida, <em>desfaça a abstração</em> (inline) e reabra a duplicação, antes de acrescentar um sexto parâmetro.</p>` },
    { id: 'kiss', title: 'KISS: a solução mais simples que resolve o problema real', body: `<p>Simples não é fácil nem curto: é <em>sem complexidade acidental</em>. Rich Hickey, em "Simple Made Easy" (Strange Loop 2011), separa simples (poucas peças entrelaçadas) de fácil (à mão, familiar). O Zen of Python diz o mesmo: "Simple is better than complex. Complex is better than complicated."</p>
<pre><code class="language-python"># Esperto demais
result = functools.reduce(
    lambda acc, x: {**acc, x["k"]: acc.get(x["k"], []) + [x["v"]]}, data, {}
)

# Simples
from collections import defaultdict

grouped: dict[str, list] = defaultdict(list)
for item in data:
    grouped[item["k"]].append(item["v"])</code></pre>
<p>O custo do "esperto" é pago na leitura (e o código é lido muito mais do que escrito) e na performance: o <code>reduce</code> acima é quadrático, porque cria um dicionário novo a cada passo. Sinais práticos de KISS violado: metaclasses ou decorators para um problema de dois casos, herança múltipla sem necessidade, camadas que só repassam chamadas (pass-through), configuração por YAML de algo que cabe em uma constante.</p>
<div class="callout tip"><strong>DICA</strong> Pergunta de revisão: "se um colega júnior ler isto em seis meses, ele consegue modificar sem medo?" Se não, ou simplifique, ou documente o <em>porquê</em>, não o <em>como</em>.</div>` },
    { id: 'yagni', title: 'YAGNI: o custo de construir para um futuro que não veio', body: `<p>Toda funcionalidade especulativa tem quatro custos: construir, carregar (mais código para ler e manter), atrasar o que é necessário agora e, o pior, errar a forma, porque o futuro raramente vem do jeito previsto. Martin Fowler detalha em "Yagni" (martinfowler.com): ele não proíbe projeto, proíbe <em>implementar</em> a necessidade presumida. É compatível com refatoração: o código simples de hoje é adaptado quando a necessidade real aparecer.</p>
<ul>
<li><strong>Não é permissão para código bagunçado.</strong> YAGNI depende de código limpo e testado, que é barato de mudar. Sem testes, YAGNI vira dívida.</li>
<li><strong>Exceção honesta:</strong> decisões irreversíveis ou caras de mudar depois (contrato de API pública, formato de dado persistido, chave de partição). Aí vale pensar à frente.</li>
<li><strong>Sinais de violação:</strong> parâmetros que ninguém passa, classes base com uma subclasse, "hooks" sem usuário, configuração para variações que nunca existiram, módulo <code>plugins/</code> sem plugin.</li>
</ul>
<pre><code class="language-python"># Especulativo: sistema de plugins, cache, retry e strategy para ler um CSV.
class ReaderFactory: ...
class AbstractReader(ABC): ...
class CsvReader(AbstractReader):
    def __init__(self, cache=None, retries=3, strategy="eager", hooks=()): ...

# Presente:
import csv

def read_rows(path: str) -&gt; list[dict]:
    with open(path, newline="", encoding="utf-8") as f:
        return list(csv.DictReader(f))</code></pre>
<p>Quando o segundo formato (Parquet, JSON) <em>de fato</em> chegar, você extrai a abstração com dois exemplos reais na mão, que é o momento em que o desenho sai certo.</p>` },
    { id: 'composicao', title: 'Composição sobre herança', body: `<p>O GoF (1994) estabeleceu: "favoreça a composição de objetos sobre a herança de classes". Herança de classe é <em>white-box reuse</em> (a subclasse enxerga a implementação da base e se acopla a ela); composição é <em>black-box reuse</em> (só a interface pública). Em Python o argumento reforça: herança múltipla com <code>super()</code> e MRO é poderosa e traiçoeira (Hettinger: "Super considered super").</p>
<pre><code class="language-python"># Herança por reaproveitamento: Stack "é-um" list? Expõe insert, sort, pop(0)...
class Stack(list):
    def push(self, x): self.append(x)

s = Stack(); s.push(1); s.insert(0, 99)    # quebra a disciplina LIFO

# Composição: expõe só o que o contrato permite.
class Stack:
    def __init__(self) -&gt; None:
        self._items: list = []

    def push(self, x) -&gt; None: self._items.append(x)
    def pop(self): return self._items.pop()
    def __len__(self) -&gt; int: return len(self._items)</code></pre>
<p>Composição também troca comportamento em tempo de execução, o que herança não faz:</p>
<pre><code class="language-python">from dataclasses import dataclass
from typing import Protocol


class Compressor(Protocol):
    def compress(self, data: bytes) -&gt; bytes: ...


@dataclass
class Archiver:
    compressor: Compressor          # compõe: troca em runtime, sem subclasse

    def pack(self, files: dict[str, bytes]) -&gt; bytes:
        blob = b"".join(files.values())
        return self.compressor.compress(blob)</code></pre>
<p>Herança continua legítima em três casos: (1) hierarquia de exceções; (2) pontos de extensão que a própria biblioteca documenta (<code>unittest.TestCase</code>, <code>json.JSONEncoder.default</code>, <code>ABC</code> com template method); (3) um subtipo verdadeiro, que respeita o LSP. Mixins são herança usada por composição de comportamento e funcionam quando ortogonais e sem estado (veja a documentação do Django sobre Class-Based Views para o lado ruim, com o MRO de oito níveis).</p>` },
    { id: 'demeter', title: 'Lei de Demeter e "tell, don\'t ask"', body: `<p>A Lei de Demeter diz: um método só deve falar com amigos imediatos (si mesmo, parâmetros, objetos que ele cria, atributos diretos). Informalmente: "não fale com estranhos", ou "um ponto só".</p>
<pre><code class="language-python"># Viola Demeter: o cliente conhece a estrutura interna da cadeia inteira.
city = order.customer.address.city.name
order.customer.account.balance -= total

# Respeita: o objeto expõe o que o cliente precisa.
city = order.shipping_city()
order.charge(total)</code></pre>
<p>Dois motivos: acoplamento (mudar <code>address</code> quebra todos os clientes de <code>order</code>) e encapsulamento (o cliente decide por quem tem o dado, violando "tell, don't ask": peça a ação ao objeto em vez de perguntar o estado e decidir fora). Mas há um contraponto prático: <strong>Demeter não se aplica a estruturas de dados</strong>. <code>df.groupby("a").agg(...)</code>, <code>pathlib.Path(p).parent.name</code> e APIs fluentes não violam o espírito da lei, porque falam de um mesmo tipo ou de um dado, não de comportamento de objetos diferentes. Aplicar Demeter cegamente cria métodos delegadores em cascata (<code>get_customer_address_city_name()</code>), que são só ruído.</p>` },
    { id: 'acoplamento-coesao', title: 'Acoplamento e coesão: o par que mede o design', body: `<p>Larry Constantine (1974, structured design) deu o vocabulário que ainda é o mais útil: <strong>baixo acoplamento</strong> (módulos dependem pouco uns dos outros) e <strong>alta coesão</strong> (o que está dentro do módulo pertence junto). Todos os princípios SOLID são formas de buscar esse equilíbrio.</p>
<table><thead><tr><th>Tipo de acoplamento (do pior ao melhor)</th><th>Exemplo em Python</th></tr></thead><tbody>
<tr><td>Por conteúdo</td><td>Acessar <code>_privado</code> de outro módulo ou alterar o <code>__dict__</code> alheio</td></tr>
<tr><td>Por estado global</td><td>Módulo que lê e escreve um dict global compartilhado</td></tr>
<tr><td>Por controle</td><td>Passar um flag que altera o fluxo interno do chamado (<code>run(mode="x")</code>)</td></tr>
<tr><td>Por dados (estrutura)</td><td>Passar um dict esperando chaves específicas</td></tr>
<tr><td>Por dados (parâmetros simples)</td><td>Passar só os valores necessários, com tipos claros</td></tr>
<tr><td>Por mensagem / evento</td><td>Publicar evento sem saber quem consome</td></tr>
</tbody></table>
<p>Medir sem pedantismo: ferramentas como <code>import-linter</code>, <code>pydeps</code> e <code>radon</code> dão a visão estrutural; <code>git log --name-only</code> mostra <strong>acoplamento lógico</strong> (arquivos que sempre mudam juntos, método de Adam Tornhill, <em>Your Code as a Crime Scene</em>). Se o módulo <code>A</code> e o <code>B</code> mudam juntos em 80% dos commits, eles são um só, mal dividido em dois.</p>
<div class="callout"><strong>NA ENTREVISTA</strong> Quando perguntarem "o que é um bom design?", responda com custo de mudança: baixo acoplamento e alta coesão significam que a mudança típica toca poucos módulos, e é isso que se mede com histórico de git.</div>` },
    { id: 'equilibrio', title: 'Quando os princípios brigam entre si', body: `<p>Princípios se contradizem, e a senioridade está em arbitrar:</p>
<table><thead><tr><th>Tensão</th><th>Como resolver</th></tr></thead><tbody>
<tr><td>DRY vs YAGNI e KISS</td><td>Abstrair cedo reduz duplicação mas adiciona complexidade especulativa. Espere a terceira ocorrência.</td></tr>
<tr><td>OCP vs YAGNI</td><td>Abra o ponto de extensão depois da primeira mudança real, não antes.</td></tr>
<tr><td>DIP vs KISS</td><td>Inverta só nas fronteiras de I/O. Dentro do domínio, chame direto.</td></tr>
<tr><td>SRP vs coesão</td><td>Separar demais espalha o que muda junto. Pense em ator, não em contagem de métodos.</td></tr>
<tr><td>Demeter vs legibilidade</td><td>Não crie delegadores para cadeias de dados. Aplique a objetos com comportamento.</td></tr>
</tbody></table>
<p>O guia prático em ordem de prioridade: (1) faça funcionar com testes; (2) mantenha simples; (3) elimine duplicação de conhecimento; (4) extraia abstrações quando a variação real aparecer; (5) aplique SOLID onde a dor justifica. É a ordem inversa da maioria dos cursos, e a que sobrevive em produção. Kent Beck resume em "as quatro regras do design simples": passa nos testes, revela a intenção, sem duplicação, menor número de elementos.</p>` }
  ],
  whenToUse: [
    'DRY: a mesma regra de negócio (alíquota, validação, formato) mora em mais de um lugar',
    'KISS: ao revisar código "esperto" que só o autor entende',
    'YAGNI: antes de acrescentar parâmetro, hook ou camada para uma necessidade hipotética',
    'Composição: quando você herda só para reaproveitar código ou precisa trocar comportamento em runtime',
    'Demeter e tell-don\'t-ask: em objetos de domínio com comportamento e invariantes'
  ],
  whenNot: [
    'DRY: unificar trechos que parecem iguais mas mudam por motivos diferentes (duplicação acidental)',
    'KISS: confundir simples com curto; simples é ausência de complexidade acidental',
    'YAGNI: como desculpa para código sem testes ou para ignorar decisões irreversíveis (API pública, schema)',
    'Composição: criar delegadores em cascata onde uma herança pequena e honesta resolveria',
    'Demeter: aplicar a estruturas de dados e APIs fluentes, gerando métodos de repasse inúteis'
  ],
  metrics: [
    'git log --name-only: acoplamento lógico (arquivos que mudam juntos) e hotspots por churn',
    'radon cc / mi e ruff (C901, PLR) como alarme de código complicado',
    'pylint R0801 (duplicate-code) e jscpd para duplicação textual, lendo com cuidado',
    'import-linter e pydeps para acoplamento estrutural e ciclos de importação',
    'Quantidade de parâmetros opcionais e flags por função: sinal de abstração com muitos modos',
    'Cobertura de testes antes de refatorar, porque YAGNI e KISS exigem poder mudar sem medo'
  ],
  refs: [
    { type: 'livro', title: 'The Pragmatic Programmer, 20th Anniversary Edition', author: 'David Thomas e Andrew Hunt', url: 'https://pragprog.com/titles/tpp20/the-pragmatic-programmer-20th-anniversary-edition/', note: 'Origem do DRY, e a correção do mal-entendido sobre linhas repetidas.' },
    { type: 'artigo', title: 'The Wrong Abstraction', author: 'Sandi Metz', url: 'https://sandimetz.com/blog/2016/1/20/the-wrong-abstraction', note: 'O texto de referência sobre os limites do DRY.' },
    { type: 'artigo', title: 'Yagni', author: 'Martin Fowler', url: 'https://martinfowler.com/bliki/Yagni.html', note: 'Os custos da funcionalidade especulativa e o que YAGNI não é.' },
    { type: 'video', title: 'Simple Made Easy', author: 'Rich Hickey, Strange Loop 2011', url: 'https://www.youtube.com/watch?v=SxdOUGdseq4', note: 'A distinção entre simples e fácil, base filosófica do KISS.' },
    { type: 'portal', title: 'Composition Over Inheritance', author: 'Brandon Rhodes (python-patterns.guide)', url: 'https://python-patterns.guide/gang-of-four/composition-over-inheritance/', note: 'O princípio do GoF com exemplos em Python.' },
    { type: 'artigo', title: 'Super considered super!', author: 'Raymond Hettinger', url: 'https://rhettinger.wordpress.com/2011/05/26/super-considered-super/', note: 'Herança múltipla e MRO em Python, e por que exige cuidado.' },
    { type: 'artigo', title: 'Subclassing in Python Redux', author: 'Hynek Schlawack', url: 'https://hynek.me/articles/python-subclassing-redux/', note: 'Quando subclassificar é a ferramenta certa em Python.' },
    { type: 'livro', title: 'Fluent Python, 2ª edição', author: 'Luciano Ramalho', url: 'https://www.oreilly.com/library/view/fluent-python-2nd/9781492056348/', note: 'Herança, mixins e composição em Python moderno, com cuidado de linguagem.' },
    { type: 'doc', title: 'PEP 20: The Zen of Python', author: 'Tim Peters', url: 'https://peps.python.org/pep-0020/', note: 'Os aforismos que resumem KISS no idioma.' }
  ]
};

window.LESSON_CONTENT['factory-method'] = {
  id: 'factory-method',
  title: 'Factory Method',
  etapa: 6, etapaName: 'Design patterns criacionais',
  time: '60 min',
  tags: ['GoF', 'criacional', 'classmethod', 'registro'],
  tagline: 'Delegar <em>qual classe instanciar</em> para quem sabe, e esconder o <code>if</code> atrás de um nome.',
  intro: `<p>O Factory Method está no catálogo do GoF (Gamma, Helm, Johnson e Vlissides, <em>Design Patterns</em>, 1994) com esta intenção: "definir uma interface para criar um objeto, mas deixar as subclasses decidirem qual classe instanciar". A estrutura clássica é uma classe <code>Creator</code> com um método de fábrica (abstrato ou com default) que as subclasses sobrescrevem, e um <code>Product</code> que o método devolve. O <code>Creator</code> usa o produto sem saber sua classe concreta.</p>
<p>Em Python o padrão aparece o tempo todo, quase sempre sem a hierarquia de <code>Creator</code>. Isso acontece por três características da linguagem: classes são objetos (podem ser passadas, guardadas em dicionários e chamadas), <code>@classmethod</code> dá construtores alternativos nomeados, e funções são cidadãs de primeira classe. Brandon Rhodes, em python-patterns.guide, observa que muitos padrões do GoF existem para contornar limitações de C++ e Java que o Python não tem.</p>
<p>O que você precisa saber: a forma clássica (para reconhecer em código legado e responder em entrevista), as três formas pythônicas (classmethod, função fábrica, registro) e o critério para decidir se o padrão se justifica ou é cerimônia.</p>`,
  sections: [
    { id: 'classico', title: 'A forma clássica do GoF', body: `<p>Participantes: <strong>Product</strong> (interface do objeto), <strong>ConcreteProduct</strong>, <strong>Creator</strong> (declara o factory method e usa o produto em operações) e <strong>ConcreteCreator</strong> (sobrescreve o factory method). A motivação do GoF é um framework de documentos: a classe <code>Application</code> sabe <em>quando</em> criar um documento, mas não sabe <em>qual tipo</em>. As subclasses do app decidem.</p>
<pre><code class="language-python">from abc import ABC, abstractmethod


class Exporter(ABC):                       # Product
    @abstractmethod
    def export(self, rows: list[dict]) -&gt; str: ...


class CsvExporter(Exporter):               # ConcreteProduct
    def export(self, rows):
        if not rows:
            return ""
        header = ",".join(rows[0])
        lines = [",".join(str(v) for v in r.values()) for r in rows]
        return "\\n".join([header, *lines])


class JsonExporter(Exporter):              # ConcreteProduct
    def export(self, rows):
        import json
        return json.dumps(rows)


class Report(ABC):                         # Creator
    @abstractmethod
    def create_exporter(self) -&gt; Exporter:      # o factory method
        ...

    def render(self, rows: list[dict]) -&gt; str:  # usa o produto sem conhecer a classe
        return self.create_exporter().export(rows)


class CsvReport(Report):                   # ConcreteCreator
    def create_exporter(self) -&gt; Exporter:
        return CsvExporter()


class JsonReport(Report):
    def create_exporter(self) -&gt; Exporter:
        return JsonExporter()


print(JsonReport().render([{"a": 1}]))      # [{"a": 1}]</code></pre>
<p>Funciona, mas repare no custo: duas hierarquias paralelas (<code>Exporter</code> e <code>Report</code>) para escolher uma classe. É isso que Python deixa de exigir.</p>` },
    { id: 'classmethod', title: 'Pythônico 1: construtores alternativos com @classmethod', body: `<p>A forma mais comum e mais importante em Python. Como a classe só tem um <code>__init__</code>, os construtores alternativos nomeados entram como <code>@classmethod</code>. O <code>cls</code> recebido faz o método funcionar com subclasses (é o "factory method" polimórfico, sem hierarquia de criadores).</p>
<pre><code class="language-python">from dataclasses import dataclass
from datetime import datetime
import json


@dataclass
class Event:
    name: str
    at: datetime

    @classmethod
    def from_json(cls, text: str):
        d = json.loads(text)
        return cls(d["name"], datetime.fromisoformat(d["at"]))

    @classmethod
    def from_row(cls, row: tuple):
        return cls(row[0], row[1])

    @classmethod
    def now(cls, name: str):
        return cls(name, datetime.now())


class AuditEvent(Event):
    pass


e = AuditEvent.from_json('{"name": "login", "at": "2026-01-01T10:00:00"}')
print(type(e).__name__)      # AuditEvent: cls respeitou a subclasse</code></pre>
<p>A stdlib é cheia deles: <code>dict.fromkeys</code>, <code>int.from_bytes</code>, <code>bytes.fromhex</code>, <code>datetime.fromtimestamp</code>, <code>datetime.fromisoformat</code>, <code>pathlib.Path.home()</code>, <code>Decimal.from_float</code>, <code>itertools.chain.from_iterable</code>. A convenção é o prefixo <code>from_</code> para conversão de um formato e verbos ou substantivos para os demais (<code>Path.cwd()</code>, <code>date.today()</code>).</p>
<div class="callout warn"><strong>PEGADINHA</strong> Escreva <code>return cls(...)</code>, nunca <code>return Event(...)</code>. Com o nome fixo, <code>AuditEvent.from_json</code> devolve um <code>Event</code> e a subclasse deixa de funcionar. Em tipos, use <code>typing.Self</code> (Python 3.11+): <code>def from_json(cls, text: str) -&gt; Self</code>.</div>` },
    { id: 'registro', title: 'Pythônico 2: dict de classes e registro por decorator', body: `<p>Quando a escolha depende de um valor em tempo de execução (extensão do arquivo, campo de configuração, tipo em mensagem), o <code>if/elif</code> vira uma tabela. Como classes são objetos, o dicionário guarda a própria classe e a chama:</p>
<pre><code class="language-python">from typing import ClassVar


class Parser:
    registry: ClassVar[dict[str, type["Parser"]]] = {}
    ext: ClassVar[str]

    def __init_subclass__(cls, **kwargs):
        super().__init_subclass__(**kwargs)
        if hasattr(cls, "ext"):                   # só classes concretas se registram
            Parser.registry[cls.ext] = cls

    @classmethod
    def for_path(cls, path: str) -&gt; "Parser":
        ext = path.rsplit(".", 1)[-1].lower()
        try:
            return cls.registry[ext]()
        except KeyError:
            raise ValueError(f"sem parser para .{ext}") from None

    def parse(self, text: str) -&gt; dict:
        raise NotImplementedError


class JsonParser(Parser):
    ext = "json"
    def parse(self, text):
        import json
        return json.loads(text)


class TomlParser(Parser):
    ext = "toml"
    def parse(self, text):
        import tomllib                            # stdlib desde 3.11
        return tomllib.loads(text)


print(Parser.for_path("cfg.toml").parse('a = 1'))   # {'a': 1}</code></pre>
<p><code>__init_subclass__</code> (PEP 487, Python 3.6) substitui a metaclasse que se usava antes para auto-registro. Adicionar um formato é escrever uma subclasse, e nenhum código existente muda: é o OCP da lição 26 aplicado ao Factory Method. A alternativa sem herança é um decorator <code>@register("json")</code> sobre funções ou classes.</p>
<pre><code class="language-python">PARSERS = {}

def register(ext):
    def deco(fn):
        PARSERS[ext] = fn
        return fn
    return deco

@register("json")
def parse_json(text): ...</code></pre>` },
    { id: 'funcao', title: 'Pythônico 3: a função fábrica e a classe como fábrica', body: `<p>Se a criação é só "decidir e construir", uma função basta. Muitas bibliotecas oferecem uma função fábrica como API pública e mantêm as classes concretas privadas, o que permite mudar a implementação sem quebrar clientes:</p>
<pre><code class="language-python">import sqlite3


def connect(url: str):
    """Escolhe o driver pelo esquema da URL (estilo SQLAlchemy create_engine)."""
    scheme, _, rest = url.partition("://")
    if scheme == "sqlite":
        return sqlite3.connect(rest or ":memory:")
    if scheme == "postgresql":
        import psycopg
        return psycopg.connect(f"postgresql://{rest}")
    raise ValueError(f"esquema não suportado: {scheme!r}")</code></pre>
<p>Exemplos reais: <code>open()</code> devolve <code>TextIOWrapper</code>, <code>BufferedReader</code> ou <code>FileIO</code> conforme o modo; <code>logging.getLogger(name)</code> devolve (e cacheia) o logger; <code>sqlalchemy.create_engine(url)</code> escolhe o dialeto pela URL; <code>pandas.read_csv</code>, <code>read_parquet</code> são fábricas de <code>DataFrame</code> por formato; <code>collections.namedtuple</code> e <code>dataclasses.make_dataclass</code> são fábricas de <em>classes</em>; <code>argparse</code> aceita <code>type=</code> como função fábrica de valores.</p>
<p>E o ponto mais sutil: <strong>a própria classe já é uma fábrica</strong>. Passar <code>CsvExporter</code> (sem parênteses) como parâmetro é passar o factory method. Não é preciso uma classe intermediária:</p>
<pre><code class="language-python">from collections.abc import Callable


def run_report(rows: list[dict], make_exporter: Callable[[], Exporter]) -&gt; str:
    return make_exporter().export(rows)

run_report([{"a": 1}], CsvExporter)             # a classe é a fábrica
run_report([{"a": 1}], lambda: JsonExporter())  # ou uma lambda, se precisar de argumentos</code></pre>
<p><code>functools.partial(Classe, arg)</code> cobre o caso em que a fábrica precisa de argumentos pré-fixados. É a Injeção de Dependência da lição 29 sem nenhum framework.</p>` },
    { id: 'quando-usar', title: 'Quando o padrão se justifica (e como testar)', body: `<p>Use fábrica quando a criação tem lógica que não deve vazar para o cliente:</p>
<ul>
<li><strong>Escolha da classe depende de dado externo:</strong> URL, extensão, flag de configuração, tipo em mensagem.</li>
<li><strong>Construção complexa:</strong> validação, leitura de recurso, objetos que dependem de outros. O <code>__init__</code> deve só atribuir; a lógica vive no classmethod.</li>
<li><strong>Vários formatos de entrada para o mesmo tipo:</strong> <code>from_json</code>, <code>from_row</code>, <code>from_env</code>.</li>
<li><strong>Isolamento para teste:</strong> o código do cliente recebe a fábrica e pode receber um fake.</li>
<li><strong>Evolução de API pública:</strong> a função fábrica permite trocar a classe concreta sem quebrar usuários.</li>
</ul>
<pre><code class="language-python">import pytest


def test_registry_cobre_formatos_conhecidos():
    for ext in ("json", "toml"):
        assert Parser.for_path(f"x.{ext}").parse is not None


def test_formato_desconhecido_falha_claro():
    with pytest.raises(ValueError, match="sem parser"):
        Parser.for_path("x.xyz")


def test_classmethod_respeita_subclasse():
    e = AuditEvent.from_json('{"name": "x", "at": "2026-01-01T00:00:00"}')
    assert isinstance(e, AuditEvent)</code></pre>
<p>Em entrevista sênior vem a pergunta "Factory Method ou Abstract Factory?". Factory Method cria <strong>um produto</strong>, e a variação está em uma subclasse (ou função). Abstract Factory cria <strong>uma família de produtos</strong> que precisam ser compatíveis entre si, tema da próxima lição. Em muitos sistemas, os Factory Methods são o <em>mecanismo</em> usado por dentro de uma Abstract Factory.</p>` },
    { id: 'overengineering', title: 'O contraponto: quando NÃO usar', body: `<p>O erro mais comum é criar a hierarquia clássica para o que seria um <code>dict</code>, ou uma fábrica para uma classe com um só caso. Sinais de exagero:</p>
<ul>
<li><strong>Uma fábrica por classe:</strong> <code>UserFactory.create_user()</code> que só chama <code>User(...)</code>. Chame o construtor.</li>
<li><strong>Hierarquia paralela:</strong> para cada <code>Product</code> há um <code>ProductCreator</code> sem lógica própria. É herança de Java no Python.</li>
<li><strong>Fábrica que recebe um flag e devolve tipos diferentes sem contrato comum:</strong> o chamador acaba fazendo <code>isinstance</code>, o que invalida a abstração (viola o LSP, lição 27).</li>
<li><strong>Fábricas de fábricas.</strong> Se você escreveu <code>FactoryFactory</code>, pare.</li>
<li><strong>Lógica de criação em <code>__new__</code> quando um classmethod bastaria:</strong> sobrescrever <code>__new__</code> para devolver subclasses é esperto e surpreende leitores; prefira um classmethod ou função.</li>
</ul>
<pre><code class="language-python"># Cerimônia: nada aqui justifica uma fábrica.
class UserFactory:
    @staticmethod
    def create(name: str) -&gt; User:
        return User(name)

# Honesto: User(name). Fábrica só quando houver lógica ou escolha.</code></pre>
<div class="callout tip"><strong>DICA</strong> Regra de decisão: se você consegue nomear <em>o que a fábrica decide</em> (qual classe, de qual formato, com qual configuração), ela justifica existir. Se o nome é só "criar X", é construtor com roupa nova. Veja também a seção de Factory Method em refactoring.guru e o capítulo equivalente em python-patterns.guide para os contra-argumentos.</div>` }
  ],
  whenToUse: [
    'A classe concreta depende de dado em runtime: extensão de arquivo, URL, config, tipo de mensagem',
    'Você precisa de vários construtores nomeados para o mesmo tipo (from_json, from_row, from_env)',
    'A construção tem validação ou leitura de recurso que não cabe no __init__',
    'Quer poder trocar a classe concreta sem quebrar o código que a usa (API pública estável)',
    'O cliente recebe a fábrica por parâmetro e os testes injetam um fake'
  ],
  whenNot: [
    'Uma fábrica que só chama o construtor de uma única classe: use a classe',
    'Hierarquia paralela de Creators sem lógica, onde um dict ou uma função basta',
    'Retorno de tipos sem contrato comum, forçando isinstance no chamador',
    'Fábrica de fábrica, ou camada de indireção sem decisão real dentro',
    'Lógica de criação escondida em __new__ quando um classmethod seria mais claro'
  ],
  metrics: [
    'typing.Self (3.11+) em classmethods para preservar o tipo da subclasse',
    'mypy --strict e pyright para validar Protocols e retornos de fábricas',
    'Testes parametrizados sobre o registro: cada chave devolve um produto que cumpre o contrato',
    'grep por isinstance após chamada a fábrica: sinal de abstração vazada',
    'ruff com regras de design (PLR) e revisão de classes com apenas um método estático',
    'python -X importtime para detectar custo de imports tardios em fábricas'
  ],
  refs: [
    { type: 'portal', title: 'The Factory Method Pattern', author: 'Brandon Rhodes (python-patterns.guide)', url: 'https://python-patterns.guide/gang-of-four/factory-method/', note: 'O padrão do GoF avaliado contra Python real, com as formas que sobram.' },
    { type: 'portal', title: 'Factory Method', author: 'Refactoring.Guru', url: 'https://refactoring.guru/design-patterns/factory-method', note: 'Estrutura, aplicabilidade, prós e contras com diagramas.' },
    { type: 'livro', title: 'Design Patterns: Elements of Reusable Object-Oriented Software', author: 'Gamma, Helm, Johnson e Vlissides', url: 'https://en.wikipedia.org/wiki/Design_Patterns', note: 'A fonte original (1994); o padrão está no catálogo criacional.' },
    { type: 'livro', title: 'Head First Design Patterns, 2ª ed.', author: 'Eric Freeman e Elisabeth Robson', url: 'https://www.oreilly.com/library/view/head-first-design/9781492077992/', note: 'Explicação didática do Factory Method com a pizzaria (em Java).' },
    { type: 'doc', title: 'PEP 487: Simpler customisation of class creation', author: 'Martin Teichmann', url: 'https://peps.python.org/pep-0487/', note: '__init_subclass__, o gancho para auto-registro de fábricas.' },
    { type: 'doc', title: 'typing.Self', author: 'Python Docs', url: 'https://docs.python.org/3/library/typing.html#typing.Self', note: 'Tipagem correta para construtores alternativos (PEP 673, Python 3.11).' },
    { type: 'doc', title: 'Engine Configuration (create_engine)', author: 'SQLAlchemy', url: 'https://docs.sqlalchemy.org/en/20/core/engines.html', note: 'Exemplo de função fábrica que escolhe o dialeto pela URL.' },
    { type: 'video', title: 'Canal Live de Python', author: 'Eduardo Mendes (Dunossauro)', url: 'https://www.youtube.com/@Dunossauro', note: 'Conteúdo em português sobre classmethod, dataclasses e padrões em Python.' }
  ]
};

window.LESSON_CONTENT['abstract-factory'] = {
  id: 'abstract-factory',
  title: 'Abstract Factory',
  etapa: 6, etapaName: 'Design patterns criacionais',
  time: '45 min',
  tags: ['GoF', 'criacional', 'famílias de objetos', 'backends'],
  tagline: 'Criar <em>famílias</em> de objetos que precisam combinar entre si, sem nomear as classes concretas.',
  intro: `<p>A intenção do Abstract Factory no GoF é "fornecer uma interface para criar famílias de objetos relacionados ou dependentes sem especificar suas classes concretas". O exemplo canônico do livro é um toolkit de interface gráfica com temas: um <code>WidgetFactory</code> cria <code>Button</code>, <code>ScrollBar</code> e <code>Menu</code>, e cada tema (Motif, Windows, Mac) tem uma fábrica concreta que cria os widgets <em>consistentes entre si</em>. O ponto central é a <strong>compatibilidade entre produtos</strong>: você nunca mistura um botão do tema A com uma barra de rolagem do tema B.</p>
<p>Em sistemas de dados e ML a mesma forma aparece com outros nomes: um <em>backend</em> inteiro que se troca por configuração (SQL vs. in-memory, S3 vs. disco local, produção vs. teste), onde o repositório, o armazenamento de blobs e a fila precisam vir do mesmo "mundo". Em Python, o padrão é raramente implementado com a hierarquia do GoF, porque módulos, dataclasses e dicionários de callables já resolvem o problema com muito menos cerimônia.</p>
<p>Esta lição mostra a forma clássica, a forma pythônica, um exemplo real (backend de produção versus de teste) e um aviso honesto: é o padrão criacional mais fácil de exagerar.</p>`,
  sections: [
    { id: 'classico', title: 'A estrutura do GoF', body: `<p>Participantes: <strong>AbstractFactory</strong> (declara um método de criação por tipo de produto), <strong>ConcreteFactory</strong> (uma por família), <strong>AbstractProduct</strong> (uma interface por tipo de produto) e <strong>ConcreteProduct</strong> (a implementação por família). O cliente conhece só as abstrações.</p>
<pre><code class="language-python">from abc import ABC, abstractmethod


class Button(ABC):
    @abstractmethod
    def render(self) -&gt; str: ...


class Checkbox(ABC):
    @abstractmethod
    def render(self) -&gt; str: ...


class LightButton(Button):
    def render(self): return "[ Light Button ]"

class LightCheckbox(Checkbox):
    def render(self): return "[ ] light"

class DarkButton(Button):
    def render(self): return "[[ Dark Button ]]"

class DarkCheckbox(Checkbox):
    def render(self): return "[x] dark"


class ThemeFactory(ABC):
    @abstractmethod
    def button(self) -&gt; Button: ...
    @abstractmethod
    def checkbox(self) -&gt; Checkbox: ...


class LightTheme(ThemeFactory):
    def button(self): return LightButton()
    def checkbox(self): return LightCheckbox()

class DarkTheme(ThemeFactory):
    def button(self): return DarkButton()
    def checkbox(self): return DarkCheckbox()


def build_form(theme: ThemeFactory) -&gt; str:
    return "\\n".join([theme.button().render(), theme.checkbox().render()])


print(build_form(DarkTheme()))</code></pre>
<p>Observe que <code>build_form</code> não importa <code>DarkButton</code>. Trocar de tema é trocar a fábrica passada. A garantia de consistência vem da estrutura: o <code>DarkTheme</code> só sabe criar produtos escuros.</p>` },
    { id: 'quando', title: 'Quando o padrão realmente se aplica', body: `<p>A pergunta que decide: <strong>existem produtos de tipos diferentes que só funcionam juntos?</strong> Se a resposta é não, você tem um Factory Method (lição 31), não um Abstract Factory. O padrão se justifica quando:</p>
<ul>
<li>Há <em>duas ou mais famílias</em> concretas (ao menos duas, senão não há o que variar) e <em>dois ou mais tipos de produto</em> por família.</li>
<li>A <strong>consistência</strong> entre produtos da mesma família é um requisito, não uma conveniência.</li>
<li>A família é escolhida <em>uma vez</em> (por configuração, ambiente, plataforma) e propagada.</li>
</ul>
<p>Exemplos reais: drivers de banco que implementam conexão, cursor e transação para um dialeto (a DB-API 2.0, PEP 249, é na prática um contrato de família); toolkits gráficos (Qt, Tk, GTK com temas); backends de teste vs. produção em arquitetura hexagonal; bibliotecas de ML com backends intercambiáveis (por exemplo, Keras 3 com TensorFlow, JAX ou PyTorch, em que operações, tensores e dispositivos devem ser do mesmo backend); clientes de nuvem (storage, fila, secrets) por provedor.</p>
<div class="callout"><strong>NA ENTREVISTA</strong> Diferencie: Factory Method cria um produto e varia por subclasse/função; Abstract Factory cria uma família coerente e varia pela fábrica inteira. E pergunte de volta: "há restrição de compatibilidade entre os produtos?". Sem restrição, é Factory Method.</div>` },
    { id: 'pythonico', title: 'A forma pythônica: dataclass de callables, módulo e Protocol', body: `<p>A fábrica abstrata clássica é, no fundo, um <em>registro de construtores agrupados</em>. Em Python, uma dataclass de callables expressa a mesma ideia sem hierarquia:</p>
<pre><code class="language-python">from collections.abc import Callable
from dataclasses import dataclass


@dataclass(frozen=True)
class Backend:
    """Uma família de objetos: tudo vem do mesmo 'mundo'."""
    make_repo: Callable[[], "UserRepo"]
    make_blobs: Callable[[], "BlobStore"]
    make_queue: Callable[[], "JobQueue"]


MEMORY = Backend(InMemoryUserRepo, InMemoryBlobStore, InMemoryQueue)
PROD   = Backend(PostgresUserRepo, S3BlobStore, SqsQueue)

BACKENDS = {"memory": MEMORY, "prod": PROD}


def make_app(env: str) -&gt; "App":
    b = BACKENDS[env]
    return App(repo=b.make_repo(), blobs=b.make_blobs(), queue=b.make_queue())</code></pre>
<p>Uma alternativa mais enxuta ainda é usar <strong>um módulo por família</strong> com a mesma interface de nível de módulo, selecionado por <code>importlib</code>. É o que a stdlib faz com <code>os.path</code>: <code>posixpath</code> e <code>ntpath</code> expõem as mesmas funções (<code>join</code>, <code>split</code>, <code>exists</code>), e <code>os.path</code> aponta para o certo conforme a plataforma. É um Abstract Factory em que a "fábrica" é o próprio módulo.</p>
<pre><code class="language-python">import importlib


def load_backend(name: str):
    return importlib.import_module(f"meuapp.backends.{name}")   # memory.py, prod.py

backend = load_backend("memory")
repo = backend.make_repo()          # mesma API de módulo em todas as famílias</code></pre>
<p>Com <code>Protocol</code>, você declara o contrato da fábrica e dos produtos para o type checker verificar que cada família está completa (nenhum produto faltando), o que preserva a principal garantia do padrão, a consistência.</p>
<pre><code class="language-python">from typing import Protocol


class StorageFactory(Protocol):
    def repo(self) -&gt; "UserRepo": ...
    def blobs(self) -&gt; "BlobStore": ...</code></pre>` },
    { id: 'exemplo-real', title: 'Exemplo real: trocar o backend inteiro entre produção e teste', body: `<p>O uso mais valioso do padrão em aplicações Python é montar a aplicação com um conjunto coerente de adaptadores. Em teste, tudo em memória (rápido, determinístico); em produção, tudo real. O ponto é que ninguém mistura um repositório real com uma fila falsa por engano.</p>
<pre><code class="language-python">import os


class InMemoryUserRepo:
    def __init__(self): self._d = {}
    def add(self, u): self._d[u["id"]] = u
    def get(self, i): return self._d[i]

class InMemoryQueue:
    def __init__(self): self.jobs = []
    def push(self, job): self.jobs.append(job)


@dataclass(frozen=True)
class Backend:
    make_repo: Callable[[], object]
    make_queue: Callable[[], object]


def backend_from_env() -&gt; Backend:
    env = os.environ.get("APP_ENV", "test")
    if env == "test":
        return Backend(InMemoryUserRepo, InMemoryQueue)
    if env == "prod":
        from infra.postgres import PostgresUserRepo
        from infra.sqs import SqsQueue
        return Backend(PostgresUserRepo, SqsQueue)
    raise RuntimeError(f"APP_ENV inválido: {env!r}")


class Signup:
    def __init__(self, backend: Backend) -&gt; None:
        self.repo = backend.make_repo()
        self.queue = backend.make_queue()

    def run(self, user: dict) -&gt; None:
        self.repo.add(user)
        self.queue.push({"welcome": user["id"]})


def test_signup_enfileira():
    s = Signup(Backend(InMemoryUserRepo, InMemoryQueue))
    s.run({"id": 1})
    assert s.queue.jobs == [{"welcome": 1}]</code></pre>
<p>Dois cuidados: (1) os <em>imports pesados da família de produção</em> ficam dentro do ramo, para o teste não carregar <code>psycopg</code> nem <code>boto3</code>; (2) um teste de contrato por tipo de produto (rodando contra toda família) garante que os adaptadores em memória e reais se comportam igual, senão o teste rápido mente.</p>
<div class="callout tip"><strong>DICA</strong> Esse é o núcleo do capítulo de <em>Architecture Patterns with Python</em> (Percival e Gregory) sobre bootstrap e injeção: uma "unit of work" fake e uma real, montadas juntas. Veja a lição 29 (DIP).</div>` },
    { id: 'overengineering', title: 'O contraponto: o padrão mais exagerado do catálogo', body: `<p>Abstract Factory tem custo alto: cada novo <em>tipo de produto</em> obriga a alterar a interface da fábrica e <strong>todas</strong> as fábricas concretas (o contrário do OCP para esse eixo). Adicionar uma nova <em>família</em> é fácil; adicionar um novo <em>produto</em> é doloroso. Isso é a inversão do "expression problem" de que falamos no OCP.</p>
<ul>
<li><strong>Uma família só.</strong> Se só existe o backend de produção, não há fábrica a abstrair. YAGNI: espere o segundo backend (que muitas vezes é o de teste, e aí o padrão se paga).</li>
<li><strong>Produtos sem restrição de compatibilidade.</strong> Se dá para misturar à vontade, você tem N Factory Methods independentes, e agrupá-los só cria acoplamento.</li>
<li><strong>Em Python, módulos e dicts bastam.</strong> A hierarquia de ABCs paralelas (<code>AbstractFactory</code> + <code>AbstractProductA</code> + <code>AbstractProductB</code> + versões concretas) é a forma mais pesada. Prefira a dataclass de callables ou o módulo por família.</li>
<li><strong>Configuração que vira linguagem.</strong> Quando o "backend" tem 15 produtos e vários flags, o <code>Backend</code> vira um service locator disfarçado. Divida em contextos menores.</li>
</ul>
<pre><code class="language-python"># Cerimônia: uma família só, um produto só, sem restrição entre eles.
class AbstractReportFactory(ABC):
    @abstractmethod
    def make_report(self): ...

class ConcreteReportFactory(AbstractReportFactory):
    def make_report(self): return Report()

# Basta:
report = Report()</code></pre>
<p>O teste de aplicabilidade em três perguntas: Há 2+ famílias? Há 2+ tipos de produto por família? Misturar famílias é um bug? Três sins, use o padrão. Qualquer não, simplifique.</p>` },
    { id: 'entrevista', title: 'Entrevista e produção', body: `<ul>
<li><strong>"Abstract Factory ou Factory Method?"</strong> Famílias coerentes versus produto único. O primeiro costuma ser <em>composto</em> de factory methods.</li>
<li><strong>"Como você faria em Python?"</strong> Dataclass de callables, módulo por família ou um dict de factories. Mostre que a hierarquia do GoF é desnecessária.</li>
<li><strong>"Qual o ponto fraco?"</strong> Adicionar um tipo de produto novo quebra todas as fábricas concretas. Mitigação: <code>Protocol</code> com checagem estática para apontar quais fábricas faltam atualizar.</li>
<li><strong>"Onde você já viu isso na stdlib?"</strong> <code>os.path</code> (posixpath/ntpath) e a DB-API 2.0 (cada driver é uma família: connect, cursor, exceções).</li>
</ul>
<p>Em produção, o sinal de que o padrão está sendo bem usado é a troca de ambiente por <em>uma</em> variável de configuração, sem condicionais espalhadas (<code>if env == "test"</code> em dez lugares é o sintoma oposto). O local certo para o <code>if</code> é um só: a composition root.</p>` }
  ],
  whenToUse: [
    'Há duas ou mais famílias de objetos que só funcionam combinadas (backend memória vs. produção)',
    'Misturar produtos de famílias diferentes seria um bug de consistência',
    'A família é escolhida uma vez, por configuração, ambiente ou plataforma',
    'Você quer testes rápidos com adaptadores em memória e produção com adaptadores reais',
    'Portar o sistema para outra plataforma, banco ou provedor de nuvem inteiro'
  ],
  whenNot: [
    'Existe uma família só ou um tipo de produto só (basta um Factory Method ou o construtor)',
    'Os produtos não têm restrição de compatibilidade entre si',
    'Você precisará acrescentar tipos de produto com frequência (cada um quebra todas as fábricas)',
    'A hierarquia de ABCs paralelas é mais pesada que uma dataclass de callables ou um módulo',
    'O Backend acumulou dezenas de produtos e virou um service locator'
  ],
  metrics: [
    'Número de ramos if/elif sobre ambiente fora da composition root (alvo: zero)',
    'Testes de contrato rodando contra todas as famílias, com pytest.fixture(params=...)',
    'mypy --strict e Protocol para garantir que cada família implementa todos os produtos',
    'Tempo da suíte de testes com a família em memória versus real',
    'python -X importtime para verificar que imports da família de produção não vazam para o teste',
    'import-linter para proibir que o domínio importe módulos de uma família concreta'
  ],
  refs: [
    { type: 'portal', title: 'The Abstract Factory Pattern', author: 'Brandon Rhodes (python-patterns.guide)', url: 'https://python-patterns.guide/gang-of-four/abstract-factory/', note: 'Por que o padrão quase não aparece em Python e as alternativas que o substituem.' },
    { type: 'portal', title: 'Abstract Factory', author: 'Refactoring.Guru', url: 'https://refactoring.guru/design-patterns/abstract-factory', note: 'Estrutura, exemplo de GUI e a relação com Factory Method.' },
    { type: 'livro', title: 'Design Patterns: Elements of Reusable Object-Oriented Software', author: 'Gamma, Helm, Johnson e Vlissides', url: 'https://en.wikipedia.org/wiki/Design_Patterns', note: 'A fonte original: o exemplo do toolkit de widgets com temas.' },
    { type: 'livro', title: 'Head First Design Patterns, 2ª ed.', author: 'Eric Freeman e Elisabeth Robson', url: 'https://www.oreilly.com/library/view/head-first-design/9781492077992/', note: 'A pizzaria com ingredientes por região, a melhor intuição do padrão.' },
    { type: 'livro', title: 'Architecture Patterns with Python', author: 'Harry Percival e Bob Gregory', url: 'https://www.cosmicpython.com/', note: 'Bootstrap e injeção com adaptadores reais e fakes em família.' },
    { type: 'doc', title: 'PEP 249: Python Database API Specification v2.0', author: 'Marc-André Lemburg', url: 'https://peps.python.org/pep-0249/', note: 'Um contrato de família: connect, cursor e exceções por driver.' },
    { type: 'doc', title: 'os.path (posixpath e ntpath)', author: 'Python Docs', url: 'https://docs.python.org/3/library/os.path.html', note: 'Exemplo na stdlib de família selecionada por plataforma.' },
    { type: 'video', title: 'Canal ArjanCodes: design patterns em Python', author: 'Arjan Egges', url: 'https://www.youtube.com/@ArjanCodes', note: 'Vídeos sobre design patterns e design de software em Python.' }
  ]
};

window.LESSON_CONTENT['builder'] = {
  id: 'builder',
  title: 'Builder',
  etapa: 6, etapaName: 'Design patterns criacionais',
  time: '45 min',
  tags: ['GoF', 'criacional', 'fluent interface', 'kwargs'],
  tagline: 'Construir objetos complexos <em>passo a passo</em>, e saber quando <code>**kwargs</code> já resolve.',
  intro: `<p>O Builder do GoF "separa a construção de um objeto complexo da sua representação, de modo que o mesmo processo de construção possa criar representações diferentes". A estrutura clássica tem um <code>Director</code> que conduz a sequência de passos e um <code>Builder</code> abstrato com <code>ConcreteBuilder</code>s que montam produtos distintos (o exemplo do livro: um conversor de RTF que gera texto ASCII, TeX ou widget a partir do mesmo parser).</p>
<p>No uso moderno, o Builder se tornou outra coisa, quase sempre: a <em>fluent interface</em> para montar objetos com muitas opções (<code>QueryBuilder</code>, <code>RequestBuilder</code>), popularizada por Java onde não há argumentos nomeados nem valores default. Python tem os dois, e por isso a primeira pergunta é honesta: <strong>um construtor com argumentos nomeados, <code>dataclass</code> e defaults resolve?</strong> Na maioria dos casos, sim.</p>
<p>O Builder continua valioso em Python em três situações: construção em <em>etapas dependentes</em> com validação ao final, objetos <em>imutáveis</em> montados incrementalmente, e DSLs de consulta (SQLAlchemy, Pandas, Polars, Django ORM, são todos "builders fluentes").</p>`,
  sections: [
    { id: 'problema', title: 'O problema que o padrão resolve: o construtor telescópico', body: `<p>Em linguagens sem argumentos nomeados, uma classe com muitas opções gera construtores telescópicos: <code>Pizza(size, cheese, pepperoni, bacon, olives, ...)</code>, com ordem arbitrária e valores booleanos incompreensíveis na chamada: <code>Pizza(12, True, False, True, False)</code>. O Builder (na versão do <em>Effective Java</em>, de Joshua Bloch) substitui isso por chamadas encadeadas legíveis.</p>
<p>Em Python o problema já tem solução embutida:</p>
<pre><code class="language-python">from dataclasses import dataclass, field


@dataclass(frozen=True, kw_only=True)
class Pizza:
    size: int = 30
    cheese: bool = True
    toppings: tuple[str, ...] = ()
    crust: str = "thin"

    def __post_init__(self):
        if self.size not in (20, 30, 40):
            raise ValueError("size deve ser 20, 30 ou 40")
        if len(self.toppings) &gt; 5:
            raise ValueError("máximo 5 coberturas")


p = Pizza(size=40, toppings=("bacon", "olives"), crust="thick")</code></pre>
<p><code>kw_only=True</code> (Python 3.10+) obriga argumentos nomeados, os defaults cobrem os opcionais e <code>__post_init__</code> valida. A chamada é autoexplicativa e o objeto é imutável. Para a esmagadora maioria das classes, é o fim da conversa: <strong>você não precisa de Builder</strong>.</p>` },
    { id: 'classico', title: 'A forma clássica: Director e ConcreteBuilders', body: `<p>O padrão do GoF ganha sentido quando o <em>mesmo processo</em> gera <em>representações diferentes</em>. Exemplo: um relatório montado em HTML ou em texto puro, a partir da mesma sequência de passos.</p>
<pre><code class="language-python">from abc import ABC, abstractmethod


class ReportBuilder(ABC):
    @abstractmethod
    def title(self, text: str) -&gt; None: ...
    @abstractmethod
    def paragraph(self, text: str) -&gt; None: ...
    @abstractmethod
    def result(self) -&gt; str: ...


class HtmlBuilder(ReportBuilder):
    def __init__(self): self._parts: list[str] = []
    def title(self, text): self._parts.append(f"&lt;h1&gt;{text}&lt;/h1&gt;")
    def paragraph(self, text): self._parts.append(f"&lt;p&gt;{text}&lt;/p&gt;")
    def result(self): return "\\n".join(self._parts)


class TextBuilder(ReportBuilder):
    def __init__(self): self._parts: list[str] = []
    def title(self, text): self._parts.append(text.upper() + "\\n" + "=" * len(text))
    def paragraph(self, text): self._parts.append(text)
    def result(self): return "\\n\\n".join(self._parts)


def build_sales_report(b: ReportBuilder, total: float) -&gt; str:   # o Director
    b.title("Vendas")
    b.paragraph(f"Total do mês: R$ {total:,.2f}")
    return b.result()


print(build_sales_report(HtmlBuilder(), 1234.5))
print(build_sales_report(TextBuilder(), 1234.5))</code></pre>
<p>Aqui o Director é uma simples função, o que é comum em Python: o Director como classe é raro. A separação é real: o <strong>algoritmo de construção</strong> (quais passos, em que ordem) fica em um lugar, e a <strong>representação</strong> em outro. Se você não tem duas representações, o padrão provavelmente é desnecessário.</p>` },
    { id: 'fluent', title: 'Fluent builder: encadeamento, imutabilidade e validação no final', body: `<p>A variante mais usada é o builder com métodos que devolvem <code>self</code> (ou uma cópia, se imutável) e um <code>build()</code> final que valida e cria o objeto. Vale quando há <em>dependências entre etapas</em> ou validações que só fazem sentido no conjunto:</p>
<pre><code class="language-python">from dataclasses import dataclass, replace
from typing import Self


@dataclass(frozen=True)
class Query:
    table: str
    columns: tuple[str, ...] = ("*",)
    where: tuple[str, ...] = ()
    order_by: str | None = None
    limit: int | None = None

    def to_sql(self) -&gt; str:
        sql = f"SELECT {', '.join(self.columns)} FROM {self.table}"
        if self.where:
            sql += " WHERE " + " AND ".join(self.where)
        if self.order_by:
            sql += f" ORDER BY {self.order_by}"
        if self.limit is not None:
            sql += f" LIMIT {self.limit}"
        return sql


class QueryBuilder:
    def __init__(self, table: str) -&gt; None:
        self._q = Query(table)

    def select(self, *cols: str) -&gt; Self:
        self._q = replace(self._q, columns=cols)
        return self

    def filter(self, cond: str) -&gt; Self:
        self._q = replace(self._q, where=(*self._q.where, cond))
        return self

    def order(self, col: str) -&gt; Self:
        self._q = replace(self._q, order_by=col)
        return self

    def take(self, n: int) -&gt; Self:
        if n &lt;= 0:
            raise ValueError("limit deve ser positivo")
        self._q = replace(self._q, limit=n)
        return self

    def build(self) -&gt; Query:
        return self._q


sql = (QueryBuilder("users").select("id", "name")
       .filter("active = 1").filter("age &gt;= 18").order("name").take(10)
       .build().to_sql())
print(sql)</code></pre>
<p>Dois detalhes: <code>typing.Self</code> (3.11+) mantém o tipo correto em subclasses; <code>dataclasses.replace</code> cria cópias, então cada etapa devolve estado novo e o resultado final é imutável. Note que esse exemplo é <em>didático</em>: em produção, concatenar SQL com strings abre porta para injeção. Use parâmetros ligados (<code>?</code>, <code>%s</code>) ou SQLAlchemy.</p>
<div class="callout warn"><strong>PEGADINHA</strong> Builder mutável compartilhado: se dois trechos reusam a mesma instância e cada um chama <code>.filter()</code>, um contamina o outro. Por isso os builders das bibliotecas maduras (SQLAlchemy 2.0, Polars, Django <code>QuerySet</code>) <strong>devolvem novas instâncias</strong> a cada chamada.</div>` },
    { id: 'real', title: 'Builders que você já usa: SQLAlchemy, Pandas, Polars, Django, pathlib', body: `<p>Várias APIs de Python que parecem "só fluentes" são Builders de verdade, com avaliação adiada:</p>
<pre><code class="language-python"># SQLAlchemy 2.0: o statement é construído; nada executa até session.execute()
from sqlalchemy import select
stmt = (select(User.id, User.name)
        .where(User.active.is_(True))
        .order_by(User.name)
        .limit(10))

# Django ORM: QuerySet é preguiçoso; cada método devolve um novo QuerySet
users = User.objects.filter(active=True).order_by("name")[:10]

# Polars (modo lazy): o plano é construído e otimizado antes de executar
# import polars as pl
# plan = pl.scan_parquet("vendas.parquet").filter(pl.col("valor") &gt; 0).group_by("loja").agg(pl.col("valor").sum())
# df = plan.collect()

# pathlib e urllib também 'constroem' por encadeamento
from pathlib import Path
p = Path.home() / "dados" / "2026" / "vendas.csv"</code></pre>
<p>O valor desses builders não é só legibilidade: é que a <strong>construção é separada da execução</strong>. O Polars lazy e o SQLAlchemy conseguem reordenar, combinar e otimizar o plano antes de rodar. Isso é Builder com compilação, uma versão muito mais poderosa do que "atribuir campos por métodos".</p>
<p>Outro uso real: <code>argparse</code> (adicionar argumentos passo a passo ao parser), <code>logging.config</code>, <code>email.message.EmailMessage</code> (montar cabeçalhos e partes), <code>unittest.mock</code> e <code>pytest-factoryboy</code>/<code>factory_boy</code> para construir objetos de teste (o <em>Test Data Builder</em>, de Nat Pryce).</p>` },
    { id: 'quando-kwargs', title: 'Quando kwargs bastam: a árvore de decisão', body: `<table><thead><tr><th>Situação</th><th>Ferramenta</th></tr></thead><tbody>
<tr><td>Muitos parâmetros opcionais, sem dependência entre eles</td><td><code>dataclass(kw_only=True)</code> com defaults</td></tr>
<tr><td>Validação cruzada no momento da criação</td><td><code>__post_init__</code> ou validação no construtor</td></tr>
<tr><td>Várias formas de criar o mesmo tipo</td><td><code>@classmethod</code> (Factory Method)</td></tr>
<tr><td>Variações de um objeto existente</td><td><code>dataclasses.replace</code> ou <code>copy.replace</code> (Python 3.13)</td></tr>
<tr><td>Montagem incremental com etapas dependentes e validação ao final</td><td>Builder fluente</td></tr>
<tr><td>Mesmo processo, representações diferentes</td><td>Builder clássico (Director + ConcreteBuilders)</td></tr>
<tr><td>Construção separada da execução (plano lazy)</td><td>Builder que compila (SQLAlchemy, Polars)</td></tr>
<tr><td>Objetos de teste com defaults sensatos</td><td>factory_boy ou uma função <code>make_user(**overrides)</code></td></tr>
</tbody></table>
<pre><code class="language-python"># Para testes, uma função com overrides vence qualquer builder.
def make_user(**overrides) -&gt; User:
    base = {"name": "Ana", "email": "ana@exemplo.com", "active": True}
    return User(**{**base, **overrides})

inativo = make_user(active=False)</code></pre>
<p>O <code>copy.replace()</code> chegou na stdlib no Python 3.13 (funciona com dataclasses, namedtuples e objetos que implementam <code>__replace__</code>) e cobre o padrão "copie com alterações" sem builder nenhum.</p>` },
    { id: 'overengineering', title: 'O contraponto: Builder em Python costuma ser Java trazido de fora', body: `<ul>
<li><strong>Builder para dataclass simples.</strong> <code>PizzaBuilder().size(40).cheese(True).build()</code> quando <code>Pizza(size=40, cheese=True)</code> existe é três vezes mais código para a mesma coisa, e perde a checagem de tipos no ponto de chamada.</li>
<li><strong>Builder mutável que vaza estado.</strong> Reusar a instância entre chamadas é bug esperando acontecer.</li>
<li><strong>Esquecer o <code>build()</code>.</strong> O objeto retornado é o builder, não o produto, e o erro aparece longe, quando alguém chama um método que só o produto tem. Mitigue com tipos precisos.</li>
<li><strong>Validação espalhada.</strong> Validar a cada passo e de novo no <code>build()</code> duplica regras. Concentre no <code>build()</code> ou no <code>__post_init__</code> do produto.</li>
<li><strong>Director como classe sem estado.</strong> É uma função.</li>
</ul>
<div class="callout"><strong>NA ENTREVISTA</strong> Resposta de nível sênior: "Em Python eu começo com dataclass e kwargs. Só escrevo Builder quando há etapas dependentes, validação no fim, ou separação entre construir e executar, como num query builder." Isso mostra que você conhece o padrão e também o idioma da linguagem.</div>
<p>E vale lembrar a regra geral dos criacionais: se a criação é simples, <strong>não esconda</strong>. A chamada direta do construtor é a documentação mais clara que existe.</p>` }
  ],
  whenToUse: [
    'Montagem em etapas dependentes, com validação só possível ao final',
    'O mesmo processo de construção precisa gerar representações diferentes (HTML e texto, por exemplo)',
    'Você constrói um plano ou consulta para executar depois (query builder, pipeline lazy)',
    'Há muitas combinações opcionais e o resultado final deve ser imutável',
    'Objetos de teste com defaults sensatos (Test Data Builder ou make_x(**overrides))'
  ],
  whenNot: [
    'Uma dataclass com kw_only e defaults já resolve (o caso comum em Python)',
    'Você só quer variações de um objeto existente: use dataclasses.replace ou copy.replace',
    'O builder mutável seria reaproveitado entre chamadas e vazaria estado',
    'Há um só tipo de produto e poucos parâmetros: o construtor é a documentação mais clara',
    'O Director seria uma classe sem estado (é uma função)'
  ],
  metrics: [
    'kw_only=True e frozen=True em dataclasses para evitar a necessidade de Builder',
    'typing.Self (3.11+) para encadeamento correto em subclasses',
    'mypy --strict e pyright: o retorno do build() é o produto, não o builder',
    'Testes de que o builder devolve novas instâncias e que o estado não vaza entre usos',
    'Testes de validação cruzada concentrados no build() ou no __post_init__',
    'EXPLAIN e inspeção do plano (SQLAlchemy compile, Polars explain) quando o builder gera consulta'
  ],
  refs: [
    { type: 'portal', title: 'The Builder Pattern', author: 'Brandon Rhodes (python-patterns.guide)', url: 'https://python-patterns.guide/gang-of-four/builder/', note: 'O Builder avaliado contra Python: o que sobrevive e o que vira kwargs.' },
    { type: 'portal', title: 'Builder', author: 'Refactoring.Guru', url: 'https://refactoring.guru/design-patterns/builder', note: 'Estrutura clássica, Director e o problema do construtor telescópico.' },
    { type: 'livro', title: 'Design Patterns: Elements of Reusable Object-Oriented Software', author: 'Gamma, Helm, Johnson e Vlissides', url: 'https://en.wikipedia.org/wiki/Design_Patterns', note: 'A fonte original, com o exemplo do conversor de RTF.' },
    { type: 'doc', title: 'dataclasses (kw_only, frozen, replace)', author: 'Python Docs', url: 'https://docs.python.org/3/library/dataclasses.html', note: 'As ferramentas que substituem o Builder na maioria dos casos.' },
    { type: 'doc', title: 'copy.replace (Python 3.13)', author: 'Python Docs', url: 'https://docs.python.org/3/library/copy.html', note: 'Cópia com alterações na stdlib, sem builder.' },
    { type: 'doc', title: 'SQL Expression Language Tutorial', author: 'SQLAlchemy 2.0', url: 'https://docs.sqlalchemy.org/en/20/tutorial/', note: 'O query builder mais usado em Python, com statements imutáveis.' },
    { type: 'doc', title: 'Polars: Lazy API', author: 'Polars', url: 'https://docs.pola.rs/user-guide/lazy/', note: 'Builder de plano com otimização antes de executar.' },
    { type: 'livro', title: 'Effective Java, 3rd ed.', author: 'Joshua Bloch', url: 'https://www.oreilly.com/library/view/effective-java/9780134686097/', note: 'O Builder moderno nasceu aqui (Item 2), para compensar a falta de argumentos nomeados.' }
  ]
};

window.LESSON_CONTENT['singleton-borg'] = {
  id: 'singleton-borg',
  title: 'Singleton, Borg e módulos',
  etapa: 6, etapaName: 'Design patterns criacionais',
  time: '45 min',
  tags: ['GoF', 'criacional', 'estado global', 'módulos'],
  tagline: 'Singleton é o padrão mais famoso e o mais <em>mal usado</em>: em Python, o módulo já é um.',
  intro: `<p>O Singleton do GoF "garante que uma classe tenha uma única instância e fornece um ponto global de acesso a ela". São duas propriedades distintas, e a segunda, o <em>acesso global</em>, é a que causa dano: estado global escondido, acoplamento invisível entre módulos e testes que se contaminam. Há uma geração de engenheiros que aprendeu Singleton como "boa prática" e o espalhou por <code>Config</code>, <code>Database</code>, <code>Logger</code> e <code>Cache</code>, só para descobrir depois que não conseguia testar nada isoladamente.</p>
<p>Em Python o assunto é mais curto do que em Java: <strong>todo módulo é um singleton</strong>. Na primeira importação o interpretador executa o módulo e guarda o resultado em <code>sys.modules</code>; as demais importações devolvem o mesmo objeto. Se o que você quer é "uma instância compartilhada", basta criá-la no nível do módulo. Brandon Rhodes, em python-patterns.guide, recomenda exatamente isso, e observa que a variável global de módulo cumpre o papel que o Singleton cumpre em linguagens sem esse recurso.</p>
<p>Nesta lição você vê as quatro formas de implementar o Singleton em Python (para saber ler código legado), a variante Borg de Alex Martelli, os problemas reais (testes, threads, processos, free-threading do 3.13), e o que usar no lugar na maioria dos casos.</p>`,
  sections: [
    { id: 'modulo', title: 'A solução idiomática: o módulo', body: `<p>Para um objeto compartilhado sem estado complexo, o jeito mais simples e correto é uma instância no nível do módulo:</p>
<pre><code class="language-python"># settings.py
from dataclasses import dataclass
import os


@dataclass(frozen=True)
class Settings:
    database_url: str
    debug: bool = False


settings = Settings(
    database_url=os.environ.get("DATABASE_URL", "sqlite:///dev.db"),
    debug=os.environ.get("DEBUG") == "1",
)

# em qualquer outro módulo:
# from settings import settings</code></pre>
<p>Vantagens: não há código de controle de instância, a importação é thread-safe (o <em>import lock</em> do interpretador garante que o módulo é executado uma vez), é trivial de ler e as ferramentas entendem. É assim que muito código real funciona: <code>logging.root</code>, <code>sys.stdout</code>, <code>os.environ</code>, o gerador de números aleatórios por trás de <code>random.random()</code> (uma instância de <code>random.Random</code> no módulo), <code>django.conf.settings</code> (um objeto preguiçoso por módulo).</p>
<div class="callout warn"><strong>PEGADINHA</strong> "Módulo é singleton" vale por <em>nome de módulo importado</em>. Se o mesmo arquivo é importado por dois nomes (como <code>python meuapp/x.py</code> e <code>import meuapp.x</code>, ou por <code>sys.path</code> mal configurado), você tem duas cópias. E em <code>multiprocessing</code> com spawn, cada processo recria o módulo: o "singleton" é por processo, não global.</div>
<p>Se a criação precisa ser <em>adiada</em> (custo alto, depende de configuração disponível só depois), use uma função com cache em vez de uma classe especial:</p>
<pre><code class="language-python">from functools import cache


@cache
def get_engine():
    from sqlalchemy import create_engine
    return create_engine("postgresql+psycopg://app@localhost/app")</code></pre>
<p>Atenção: sob concorrência, <code>functools.cache</code> mantém a estrutura de dados coerente, mas a função envolvida <em>pode ser chamada mais de uma vez</em> se duas threads chegarem antes do primeiro resultado ser armazenado (a documentação diz isso explicitamente). Para um recurso que realmente não pode ser criado duas vezes, use um lock.</p>` },
    { id: 'classico', title: 'As formas de implementar um Singleton de classe', body: `<p>Quando alguém pede "o padrão" explicitamente, as quatro formas conhecidas:</p>
<pre><code class="language-python"># 1) __new__ (a mais comum em tutoriais)
class Config:
    _instance = None

    def __new__(cls, *args, **kwargs):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
        return cls._instance

    def __init__(self, path="app.toml"):
        self.path = path        # CUIDADO: __init__ roda a cada Config(...)!


assert Config() is Config()</code></pre>
<pre><code class="language-python"># 2) Decorator
def singleton(cls):
    instances = {}
    def get(*args, **kwargs):
        if cls not in instances:
            instances[cls] = cls(*args, **kwargs)
        return instances[cls]
    return get

@singleton
class Cache:
    def __init__(self):
        self.data = {}

# efeito colateral: Cache deixa de ser uma classe (virou função), isinstance(x, Cache) quebra.</code></pre>
<pre><code class="language-python"># 3) Metaclasse (a mais "correta", a mais obscura)
class SingletonMeta(type):
    _instances = {}
    def __call__(cls, *args, **kwargs):
        if cls not in cls._instances:
            cls._instances[cls] = super().__call__(*args, **kwargs)
        return cls._instances[cls]


class Registry(metaclass=SingletonMeta):
    def __init__(self):
        self.items = {}</code></pre>
<pre><code class="language-python"># 4) A versão thread-safe da metaclasse
import threading

class SafeSingletonMeta(type):
    _instances = {}
    _lock = threading.Lock()

    def __call__(cls, *args, **kwargs):
        if cls not in cls._instances:               # checagem barata
            with cls._lock:
                if cls not in cls._instances:        # double-checked locking
                    cls._instances[cls] = super().__call__(*args, **kwargs)
        return cls._instances[cls]</code></pre>
<p>Repare nos problemas embutidos: na forma 1, o <code>__init__</code> reexecuta e <em>reinicializa</em> o estado a cada chamada; na forma 2, a classe some; nas formas 1 a 3 há condição de corrida sob threads. No Python 3.13 com free-threading (PEP 703, build opcional sem GIL) essas corridas deixam de ser teóricas, então a versão com lock é o mínimo. Toda essa maquinaria existe para fazer o que <code>settings = Settings()</code> faz em uma linha.</p>` },
    { id: 'borg', title: 'Borg (Monostate): compartilhar estado, não identidade', body: `<p>Alex Martelli observou que o que normalmente importa não é ter <em>uma instância</em>, mas que todas as instâncias <em>compartilhem estado</em>. O Borg (também chamado Monostate) faz isso fazendo todas as instâncias apontarem para o mesmo <code>__dict__</code>:</p>
<pre><code class="language-python">class Borg:
    _shared_state: dict = {}

    def __init__(self) -&gt; None:
        self.__dict__ = self._shared_state


class AppState(Borg):
    def __init__(self) -&gt; None:
        super().__init__()
        self.__dict__.setdefault("user", None)


a, b = AppState(), AppState()
a.user = "ana"
print(b.user)          # ana: instâncias diferentes, mesmo estado
print(a is b)          # False</code></pre>
<p>Diferença conceitual: Singleton garante <strong>identidade única</strong> (<code>a is b</code>); Borg garante <strong>estado único</strong> com instâncias distintas, e por isso aceita subclasses com tipos diferentes (embora cada subclasse precise do seu próprio <code>_shared_state</code> se não quiser compartilhar com as irmãs). Vantagem: não interfere em <code>__new__</code> nem em <code>isinstance</code>. Desvantagem: tem os mesmos problemas de estado global, só que mais difíceis de enxergar, e a tentativa de sobrescrever <code>__dict__</code> quebra com <code>__slots__</code> e com dataclasses frozen.</p>
<p>Na prática o Borg é mais curiosidade histórica e item de entrevista do que ferramenta recomendada. Se você sentiu necessidade dele, é provável que o que queira é um <strong>objeto de configuração injetado</strong> (veja o final).</p>` },
    { id: 'problemas', title: 'Por que Singleton é quase sempre um erro', body: `<p>Os problemas não são estéticos:</p>
<ul>
<li><strong>Estado global escondido.</strong> A função <code>process(order)</code> parece pura, mas lê <code>Config()</code> por dentro. A assinatura mente sobre as dependências, o que viola o espírito do DIP (lição 29).</li>
<li><strong>Testes que se contaminam.</strong> O estado de um teste vaza para o seguinte. Resetar o singleton entre testes exige hacks (<code>Config._instance = None</code>), e a ordem dos testes passa a importar.</li>
<li><strong>Acoplamento forte.</strong> Todo mundo importa a classe concreta. Não dá para trocar por fake sem <code>patch</code>.</li>
<li><strong>Viola o SRP.</strong> A classe mistura sua lógica com o controle do ciclo de vida.</li>
<li><strong>Concorrência.</strong> Corridas na criação; e estado mutável compartilhado entre threads exige locks em toda operação.</li>
<li><strong>Multiprocessamento.</strong> Singleton é por processo. Com <code>fork</code>, a cópia herdada pode conter conexões e locks que ficaram em estado inconsistente; com <code>spawn</code>, cada worker cria o seu.</li>
<li><strong>Sub-interpretadores.</strong> No Python 3.12+ com GIL por interpretador (PEP 684), cada sub-interpretador tem seus próprios módulos e logo o seu "singleton".</li>
</ul>
<pre><code class="language-python"># Teste frágil por causa de singleton
def test_a():
    Config().debug = True
    assert run() == "debug"

def test_b():
    assert run() == "normal"       # falha se test_a rodar antes

# Com injeção: sem estado compartilhado, sem ordem
def run(config: Settings) -&gt; str:
    return "debug" if config.debug else "normal"

def test_a(): assert run(Settings("x", debug=True)) == "debug"
def test_b(): assert run(Settings("x")) == "normal"</code></pre>
<div class="callout"><strong>NA ENTREVISTA</strong> Se perguntarem sobre Singleton, mostre maturidade: "Em Python o módulo é um singleton. Quando preciso de uma instância compartilhada, crio no nível do módulo. Quando preciso testar, injeto a dependência. A classe Singleton eu uso quase nunca, e quando uso é para um recurso de processo genuíno, com lock."</div>` },
    { id: 'legitimo', title: 'Os usos legítimos', body: `<p>Existem recursos que são únicos por natureza, e o padrão (ou uma instância de módulo) faz sentido:</p>
<ul>
<li><strong>Logging.</strong> <code>logging.getLogger("meuapp")</code> devolve sempre o mesmo logger por nome: é um registro (um multiton), não um Singleton de classe, e a stdlib o implementou com dicionário e lock.</li>
<li><strong>Valores sentinela e singletons da linguagem:</strong> <code>None</code>, <code>True</code>, <code>False</code>, <code>Ellipsis</code>, <code>NotImplemented</code>. Compare com <code>is</code>.</li>
<li><strong>Pools e caches de processo:</strong> um pool de conexões por aplicação (é o objeto compartilhado, não a conexão).</li>
<li><strong>Hardware e recursos exclusivos:</strong> acesso a uma GPU, a uma porta serial, a um arquivo de lock.</li>
<li><strong>Registro de plugins</strong> (lição 31): um dict de módulo.</li>
</ul>
<p>Mesmo nesses casos o caminho preferível é: (1) instância criada na <em>composition root</em> e passada para quem precisa, ou (2) instância de módulo para o que é de fato global. O Singleton de classe aparece como terceira opção.</p>
<pre><code class="language-python">import logging

# multiton: um logger por nome, sempre o mesmo objeto
a = logging.getLogger("meuapp.db")
b = logging.getLogger("meuapp.db")
assert a is b

# sentinela pessoal: um singleton legítimo e barato
class _Missing:
    def __repr__(self): return "MISSING"

MISSING = _Missing()

def get(d: dict, k, default=MISSING):
    v = d.get(k, MISSING)
    if v is MISSING:
        if default is MISSING:
            raise KeyError(k)
        return default
    return v</code></pre>` },
    { id: 'alternativas', title: 'O que usar no lugar: injeção, contexto e fábrica com cache', body: `<table><thead><tr><th>Necessidade</th><th>Em vez de Singleton</th></tr></thead><tbody>
<tr><td>Configuração global</td><td>Dataclass imutável criada no <code>main()</code> e passada, ou instância de módulo</td></tr>
<tr><td>Conexão ou pool de banco</td><td>Objeto criado na composition root, injetado nos repositórios</td></tr>
<tr><td>Cache de processo</td><td><code>functools.cache</code> / <code>lru_cache</code> em função, ou objeto injetado</td></tr>
<tr><td>Estado por requisição (usuário, trace id)</td><td><code>contextvars.ContextVar</code> (seguro com threads e asyncio)</td></tr>
<tr><td>Registro de plugins</td><td>Dict no módulo com decorator</td></tr>
<tr><td>Teste que precisa substituir o recurso</td><td>Parâmetro com default, fixture do pytest, <code>monkeypatch</code> como último recurso</td></tr>
</tbody></table>
<pre><code class="language-python">from contextvars import ContextVar

current_user: ContextVar[str | None] = ContextVar("current_user", default=None)


def handle_request(user: str) -&gt; None:
    token = current_user.set(user)       # isolado por task asyncio / thread de contexto
    try:
        do_work()
    finally:
        current_user.reset(token)

def do_work():
    print("atendendo", current_user.get())</code></pre>
<p><code>ContextVar</code> resolve o caso em que o Singleton era usado como "variável global por requisição", sem vazar entre tarefas concorrentes. É o mecanismo usado pelo contexto do módulo <code>decimal</code> e por bibliotecas de logging e tracing assíncronos. Em geral, a ordem de preferência é: <strong>parâmetro, instância de módulo, ContextVar, e só então Singleton de classe</strong>.</p>` },
    { id: 'entrevista', title: 'Entrevista e produção', body: `<ul>
<li><strong>"Implemente um Singleton em Python."</strong> Mostre a versão com metaclasse e lock, e <em>antes</em> diga que um módulo resolve. Mencione que <code>__init__</code> reexecuta na versão com <code>__new__</code>.</li>
<li><strong>"Singleton versus Borg?"</strong> Identidade única versus estado único. Ambos têm os problemas de estado global.</li>
<li><strong>"Thread-safe?"</strong> Double-checked locking. Em CPython com GIL a corrida era rara; com free-threading (3.13+) ela é real.</li>
<li><strong>"Por que é um anti-padrão?"</strong> Dependência escondida, estado global, teste frágil, SRP violado.</li>
</ul>
<p>Em produção, o sintoma mais comum é o teste que passa sozinho e falha na suíte inteira, ou a conexão herdada por <code>fork</code> (gunicorn com <code>preload_app</code>) que estoura no worker. A correção quase sempre é a mesma: o recurso nasce na composition root, depois do fork, e é injetado.</p>` }
  ],
  whenToUse: [
    'Você precisa de uma instância compartilhada e imutável: crie no nível do módulo',
    'O recurso é único por natureza no processo (logger por nome, pool, sentinela)',
    'Leitura legada de código com __new__, decorator ou metaclasse de Singleton',
    'Cache ou estado que deve ser criado preguiçosamente: função com functools.cache (com lock se a criação não pode repetir)',
    'Entrevista: mostrar que você conhece as formas e os problemas, não só a receita'
  ],
  whenNot: [
    'Para configuração, banco ou cache "por conveniência": injete a dependência',
    'Estado mutável compartilhado entre threads sem lock em cada operação',
    'Quando os testes precisam de isolamento (o singleton vaza estado entre eles)',
    'Em processos com fork ou multiprocessing, esperando um singleton "global"',
    'Quando um ContextVar resolveria o estado por requisição ou por tarefa'
  ],
  metrics: [
    'pytest -p no:randomly versus com pytest-randomly: falhas por ordem denunciam estado global',
    'grep por _instance, __new__ e metaclasses de Singleton no repositório',
    'threading e stress test na criação concorrente (rode também no build free-threaded 3.13t)',
    'Verificação de os.getpid() após fork em recursos de processo',
    'import-linter para impedir que o domínio importe o módulo com a instância global',
    'ruff PLW0603 (uso de global) como sinal de estado global mutável'
  ],
  refs: [
    { type: 'portal', title: 'The Singleton Pattern', author: 'Brandon Rhodes (python-patterns.guide)', url: 'https://python-patterns.guide/gang-of-four/singleton/', note: 'Singleton em Python: o módulo, os objetos globais e o que realmente interessa.' },
    { type: 'portal', title: 'Singleton', author: 'Refactoring.Guru', url: 'https://refactoring.guru/design-patterns/singleton', note: 'Estrutura clássica e a lista honesta dos problemas.' },
    { type: 'livro', title: 'Design Patterns: Elements of Reusable Object-Oriented Software', author: 'Gamma, Helm, Johnson e Vlissides', url: 'https://en.wikipedia.org/wiki/Design_Patterns', note: 'A fonte original do padrão (1994).' },
    { type: 'doc', title: 'The import system: sys.modules', author: 'Python Docs', url: 'https://docs.python.org/3/reference/import.html', note: 'Por que módulo já é singleton: cache em sys.modules e import lock.' },
    { type: 'doc', title: 'contextvars', author: 'Python Docs', url: 'https://docs.python.org/3/library/contextvars.html', note: 'Estado por contexto, a alternativa para o "global por requisição".' },
    { type: 'doc', title: 'functools.cache', author: 'Python Docs', url: 'https://docs.python.org/3/library/functools.html#functools.cache', note: 'Atenção à nota sobre chamadas concorrentes antes do primeiro resultado.' },
    { type: 'doc', title: 'PEP 703: Making the Global Interpreter Lock Optional', author: 'Sam Gross', url: 'https://peps.python.org/pep-0703/', note: 'Por que corridas de criação deixam de ser teóricas com free-threading.' },
    { type: 'artigo', title: 'Singleton? We don\'t need no stinkin\' singleton: the Borg design pattern', author: 'Alex Martelli (ActiveState Recipe 66531, cópia do Internet Archive)', url: 'https://web.archive.org/web/20260325075452/https://code.activestate.com/recipes/66531-singleton-we-dont-need-no-stinkin-singleton-the-bo/', note: 'A receita original do Borg e o argumento de que o estado compartilhado é o que importa.' }
  ]
};

window.LESSON_CONTENT['prototype-pool'] = {
  id: 'prototype-pool',
  title: 'Prototype e Object Pool',
  etapa: 6, etapaName: 'Design patterns criacionais',
  time: '45 min',
  tags: ['GoF', 'criacional', 'copy', 'pool de conexões'],
  tagline: 'Clonar o que já existe e <em>reaproveitar</em> o que custa caro para criar.',
  intro: `<p>Dois padrões que atacam o mesmo problema por ângulos diferentes: criar um objeto é caro ou inconveniente. O <strong>Prototype</strong> (GoF) cria novos objetos <em>copiando uma instância existente</em>, em vez de instanciar uma classe. O <strong>Object Pool</strong> (que não está no GoF, mas é um padrão consagrado em catálogos posteriores e em livros de concorrência) <em>mantém um conjunto de objetos já criados</em> e os empresta, devolvendo-os para reuso.</p>
<p>Em Python o Prototype é praticamente embutido: o módulo <code>copy</code> oferece <code>copy.copy</code> e <code>copy.deepcopy</code>, e o protocolo <code>__copy__</code> e <code>__deepcopy__</code> permite customizar. O Pool, por outro lado, é de uso diário e crítico em produção: pool de conexões de banco (SQLAlchemy, psycopg_pool), de threads (<code>ThreadPoolExecutor</code>), de processos (<code>multiprocessing.Pool</code>), de sessões HTTP.</p>
<p>A lição cobre a semântica de cópia rasa e profunda (a fonte de bugs clássica), como escrever <code>__deepcopy__</code> corretamente, as variações do Prototype em Python moderno (<code>dataclasses.replace</code>, <code>copy.replace</code> do 3.13), e como construir e usar um pool com segurança: devolução garantida, reset de estado, timeout, tamanho e health check.</p>`,
  sections: [
    { id: 'prototype', title: 'Prototype: copy, deepcopy e o protocolo de cópia', body: `<p>O GoF define o Prototype assim: "especificar os tipos de objetos a criar usando uma instância prototípica, e criar novos objetos copiando esse protótipo". A motivação é evitar a explosão de subclasses ou o custo de uma construção complexa: você monta um objeto uma vez e o clona.</p>
<pre><code class="language-python">import copy
from dataclasses import dataclass, field


@dataclass
class Character:
    name: str
    hp: int
    inventory: list[str] = field(default_factory=list)


template = Character("Goblin", 30, ["clava"])

g1 = copy.copy(template)         # cópia RASA: inventory é o MESMO list
g2 = copy.deepcopy(template)     # cópia PROFUNDA: inventory é uma nova lista

g1.inventory.append("moeda")
print(template.inventory)        # ['clava', 'moeda']  &lt;- vazou na cópia rasa!
g2.inventory.append("gema")
print(template.inventory)        # ['clava', 'moeda']  &lt;- deepcopy não vaza</code></pre>
<p>Cópia rasa duplica o objeto e <em>compartilha as referências</em> dos atributos; cópia profunda duplica recursivamente. A regra de bolso: atributos imutáveis (<code>int</code>, <code>str</code>, <code>tuple</code> de imutáveis, <code>frozenset</code>) são seguros na rasa; listas, dicts, sets e objetos mutáveis exigem deep.</p>
<div class="callout warn"><strong>PEGADINHA</strong> Os "construtores de cópia" embutidos (<code>list(x)</code>, <code>x[:]</code>, <code>dict(d)</code>, <code>d.copy()</code>, <code>list.copy()</code>) são todos <strong>rasos</strong>. <code>[[0] * 3] * 3</code> e <code>[[0]] * 3</code> criam três referências ao mesmo sublista, um bug clássico de matriz. Para matriz use <code>[[0] * 3 for _ in range(3)]</code>.</div>
<p><code>deepcopy</code> trata ciclos (usa um dicionário <code>memo</code> de ids já copiados) e preserva o compartilhamento interno: se dois atributos apontam para o mesmo objeto, na cópia continuam apontando para <em>uma</em> cópia compartilhada. Custo: é lento (percorre o grafo em Python puro), e falha com objetos que não são copiáveis (conexões, locks, arquivos abertos, geradores).</p>` },
    { id: 'custom-copy', title: 'Customizando: __copy__, __deepcopy__ e o memo', body: `<p>Quando o objeto tem recursos que não devem ser copiados (conexão, lock, cache) ou campos caros que podem ser compartilhados com segurança, implemente o protocolo:</p>
<pre><code class="language-python">import copy
import threading


class Document:
    def __init__(self, title: str, blocks: list[str]) -&gt; None:
        self.title = title
        self.blocks = blocks
        self._lock = threading.Lock()          # não é copiável
        self._render_cache: dict = {}           # caro, derivado: não copiar

    def __copy__(self):
        new = self.__class__.__new__(self.__class__)
        new.__dict__.update(self.__dict__)      # rasa: compartilha tudo...
        new._lock = threading.Lock()            # ...menos o lock, que é novo
        return new

    def __deepcopy__(self, memo):
        new = self.__class__.__new__(self.__class__)
        memo[id(self)] = new                    # registre ANTES de recursar (ciclos)
        new.title = self.title
        new.blocks = copy.deepcopy(self.blocks, memo)   # passe o memo adiante
        new._lock = threading.Lock()
        new._render_cache = {}                  # cache começa vazio na cópia
        return new


d = Document("Relatório", ["a", "b"])
d2 = copy.deepcopy(d)
assert d2.blocks == d.blocks and d2.blocks is not d.blocks</code></pre>
<p>Três regras: (1) registre <code>memo[id(self)] = new</code> antes de copiar os filhos, senão ciclos recursam para sempre; (2) passe <code>memo</code> adiante em cada <code>deepcopy</code> interno; (3) crie recursos únicos (locks, conexões) novos em vez de tentar copiá-los.</p>
<p>Para objetos de dado, Python moderno tem alternativas mais baratas e explícitas ao Prototype genérico:</p>
<pre><code class="language-python">from dataclasses import dataclass, replace
import copy


@dataclass(frozen=True)
class Config:
    host: str
    port: int
    timeout: float = 5.0


base = Config("localhost", 5432)
staging = replace(base, host="staging.db")        # dataclasses.replace: copia com mudanças
prod = copy.replace(base, host="prod.db")         # copy.replace: Python 3.13+, protocolo __replace__</code></pre>
<p>Com dataclasses imutáveis o Prototype quase some: você deriva variações de um objeto base com <code>replace</code>, e o compartilhamento dos campos é seguro porque nada muta. Isso responde à pergunta "quando devo clonar?": quando há mutabilidade e identidade independente. Se tudo é imutável, não precisa clonar.</p>` },
    { id: 'quando-prototype', title: 'Quando o Prototype se justifica em Python', body: `<ul>
<li><strong>Configuração base com variações:</strong> um template de job, de request ou de modelo que cada chamada ajusta.</li>
<li><strong>Estado inicial de simulação, jogo ou teste:</strong> um mundo montado uma vez e clonado a cada cenário (cuidado com custo do <code>deepcopy</code>).</li>
<li><strong>Estruturas de dados de bibliotecas científicas:</strong> <code>DataFrame.copy(deep=True)</code>, <code>ndarray.copy()</code>, <code>torch.clone()</code>, <code>model.state_dict()</code> clonado em checkpoint. Em NumPy e Pandas, a diferença entre vista e cópia é causa recorrente de bugs (<code>SettingWithCopyWarning</code>; o copy-on-write passa a ser o comportamento padrão a partir do Pandas 3.0).</li>
<li><strong>Snapshots e "desfazer":</strong> guardar o estado anterior (Memento, parente do Prototype).</li>
<li><strong>Evitar reconstrução cara:</strong> o objeto foi montado a partir de arquivo ou rede e variações devem partir dele.</li>
</ul>
<p>Quando <em>não</em> usar: se a construção é barata (um <code>Config(...)</code> simples), instancie direto. Se o objeto é imutável, compartilhe. Se há recursos não copiáveis, deepcopy vai falhar ou, pior, duplicar algo que devia ser único. E <code>deepcopy</code> de grafos grandes é lento: uma alternativa é serializar e desserializar (<code>pickle.loads(pickle.dumps(x))</code>, normalmente mais rápido em estruturas simples, mas com as ressalvas de segurança do pickle e de objetos não serializáveis). Meça com <code>timeit</code> no seu caso, porque a diferença depende muito da forma dos dados.</p>
<pre><code class="language-python">import timeit, copy, pickle

data = {"items": [{"id": i, "tags": ["a", "b", "c"]} for i in range(1000)]}

print(timeit.timeit(lambda: copy.deepcopy(data), number=50))
print(timeit.timeit(lambda: pickle.loads(pickle.dumps(data)), number=50))</code></pre>` },
    { id: 'pool-conceito', title: 'Object Pool: reaproveitar o que custa caro', body: `<p>O Object Pool mantém objetos prontos e os empresta. Compensa quando <strong>criar é caro</strong> (conexão TCP e TLS com autenticação, handshake, carga de modelo, alocação de buffer grande) e <strong>o uso é curto e repetido</strong>. Os exemplos que você usa sem perceber:</p>
<ul>
<li><strong>Pool de conexões de banco:</strong> SQLAlchemy (<code>QueuePool</code> por padrão na maioria dos bancos), <code>psycopg_pool.ConnectionPool</code>, PgBouncer fora do processo.</li>
<li><strong>Pool de threads e processos:</strong> <code>concurrent.futures.ThreadPoolExecutor</code>, <code>ProcessPoolExecutor</code>, <code>multiprocessing.Pool</code>.</li>
<li><strong>Pool de conexões HTTP:</strong> <code>requests.Session</code> com <code>HTTPAdapter(pool_connections, pool_maxsize)</code>, <code>httpx.Client</code> com <code>Limits</code>, <code>urllib3.PoolManager</code>.</li>
<li><strong>Pool de recursos de ML:</strong> instâncias do modelo carregadas na GPU, buffers pré-alocados.</li>
</ul>
<p>Os parâmetros que definem a qualidade de um pool:</p>
<table><thead><tr><th>Parâmetro</th><th>O que controla</th><th>Risco se mal configurado</th></tr></thead><tbody>
<tr><td>Tamanho mínimo e máximo</td><td>Quantos recursos existem</td><td>Muito grande esgota o servidor (o limite de conexões do Postgres); muito pequeno gera fila</td></tr>
<tr><td>Timeout de espera</td><td>Quanto o chamador espera por um recurso</td><td>Sem timeout, a aplicação trava em vez de falhar</td></tr>
<tr><td>Reset ao devolver</td><td>Limpa o estado do recurso (rollback, <code>RESET</code>)</td><td>Estado sujo vaza para o próximo usuário</td></tr>
<tr><td>Health check (pre-ping)</td><td>Valida o recurso antes de entregar</td><td>Entrega conexão morta após queda de rede</td></tr>
<tr><td>Reciclagem por idade</td><td>Descarta recursos velhos</td><td>Conexões penduradas por firewalls ou balanceadores</td></tr>
</tbody></table>` },
    { id: 'pool-impl', title: 'Implementando um pool seguro com queue e context manager', body: `<p>A implementação mínima e correta usa <code>queue.Queue</code> (thread-safe, com timeout) e um context manager que <strong>garante a devolução</strong> mesmo com exceção:</p>
<pre><code class="language-python">import queue
from contextlib import contextmanager
from collections.abc import Callable, Iterator
from typing import Generic, TypeVar

T = TypeVar("T")


class Pool(Generic[T]):
    def __init__(self, factory: Callable[[], T], size: int,
                 reset: Callable[[T], None] | None = None) -&gt; None:
        self._q: queue.Queue[T] = queue.Queue(maxsize=size)
        self._reset = reset
        for _ in range(size):
            self._q.put(factory())

    @contextmanager
    def acquire(self, timeout: float = 5.0) -&gt; Iterator[T]:
        try:
            item = self._q.get(timeout=timeout)
        except queue.Empty:
            raise TimeoutError("pool esgotado") from None
        try:
            yield item
        finally:
            if self._reset is not None:
                self._reset(item)          # limpa o estado antes de devolver
            self._q.put(item)              # SEMPRE devolve, mesmo com exceção</code></pre>
<pre><code class="language-python">import sqlite3
import threading

pool = Pool(
    factory=lambda: sqlite3.connect(":memory:", check_same_thread=False),
    size=3,
    reset=lambda c: c.rollback(),
)

def worker(n: int) -&gt; None:
    with pool.acquire() as conn:
        conn.execute("SELECT ?", (n,)).fetchone()

threads = [threading.Thread(target=worker, args=(i,)) for i in range(10)]
for t in threads: t.start()
for t in threads: t.join()</code></pre>
<p>Pontos que um pool de produção acrescenta: criação preguiçosa (não abrir <code>size</code> conexões na partida), substituição de recursos que falharam no health check, <code>max_overflow</code> temporário (SQLAlchemy), métricas (em uso, ociosos, esperando), e comportamento em <code>fork</code> (descarte as conexões herdadas: o SQLAlchemy exige <code>engine.dispose()</code> no filho). Não reinvente isso para banco: use o pool do driver ou do ORM e configure bem.</p>
<pre><code class="language-python">from sqlalchemy import create_engine

engine = create_engine(
    "postgresql+psycopg://app@db/app",
    pool_size=5,          # conexões mantidas
    max_overflow=5,       # extras temporários sob pico
    pool_timeout=10,      # espera máxima por uma conexão
    pool_pre_ping=True,   # valida antes de entregar
    pool_recycle=1800,    # recicla conexões com 30 min
)</code></pre>` },
    { id: 'armadilhas', title: 'Armadilhas reais de pool: vazamento, estado sujo e deadlock', body: `<ul>
<li><strong>Vazamento:</strong> adquirir sem devolver (exceção entre <code>get</code> e <code>put</code>, <code>return</code> antecipado). Resultado: o pool esvazia aos poucos e a aplicação trava com "pool esgotado" horas depois. Sempre use context manager, nunca <code>get()</code> e <code>put()</code> manuais.</li>
<li><strong>Estado sujo:</strong> a conexão devolvida com transação aberta, <code>SET search_path</code> ou variável de sessão alterada. O próximo usuário herda o problema. Faça reset (rollback) na devolução.</li>
<li><strong>Deadlock por aninhamento:</strong> uma função segura uma conexão e chama outra que pede mais uma. Com pool de tamanho N e N threads fazendo isso, todas esperam por todas. Regra: uma conexão por unidade de trabalho, passe-a adiante.</li>
<li><strong>Tamanho errado:</strong> pool grande por processo vezes N processos de servidor pode estourar o <code>max_connections</code> do banco. Calcule: <code>workers × (pool_size + max_overflow)</code> deve ficar abaixo do limite do servidor.</li>
<li><strong>Pool de objetos baratos:</strong> reaproveitar objetos Python pequenos (listas, dicts) quase nunca compensa: a alocação do CPython é muito barata, e o pool adiciona locks e risco de estado sujo. Meça antes.</li>
<li><strong>Pool de threads com tarefas que bloqueiam umas às outras:</strong> uma tarefa que espera o resultado de outra na mesma pool pode causar deadlock quando o pool enche.</li>
</ul>
<div class="callout tip"><strong>DICA</strong> Para diagnosticar: exponha métricas do pool (tamanho, em uso, tempo de espera) e logue o stack trace de quem segura recursos por mais de X segundos. O SQLAlchemy permite eventos de <code>checkout</code> e <code>checkin</code>; o <code>psycopg_pool</code> expõe <code>get_stats()</code>.</div>
<p>Com free-threading (Python 3.13+, build opcional), um pool de threads passa a aproveitar vários núcleos para trabalho de CPU, mas as mesmas regras de sincronização valem, e bibliotecas de extensão precisam declarar compatibilidade. O Python 3.14 tornou o suporte oficial, ainda opcional. Verifique a compatibilidade de cada dependência antes de apostar nele em produção.</p>` },
    { id: 'overengineering', title: 'O contraponto: quando não usar nenhum dos dois', body: `<p><strong>Prototype</strong> é supérfluo quando:</p>
<ul>
<li>os dados são imutáveis (dataclass <code>frozen</code>, tuplas): compartilhe a referência, ou use <code>replace</code> para variações;</li>
<li>construir é barato: um <code>Config(...)</code> simples ou uma função fábrica resolve;</li>
<li>você escreveria um <code>clone()</code> manual que repete a lógica de <code>copy</code>: use <code>copy.copy</code> ou <code>deepcopy</code> e customize só o necessário;</li>
<li>um "registro de protótipos" substitui o que uma função fábrica faria com mais clareza.</li>
</ul>
<p><strong>Object Pool</strong> é supérfluo (ou prejudicial) quando:</p>
<ul>
<li>o objeto é barato de criar (a maioria dos objetos Python): o custo do lock e do reset supera o ganho;</li>
<li>você não mediu: sem profile, o pool é otimização prematura, com complexidade permanente;</li>
<li>o recurso já é pooled por baixo (o driver, o ORM ou o cliente HTTP): um pool sobre outro pool piora, gerando esperas em dois níveis;</li>
<li>a aplicação é um script curto: abra, use, feche.</li>
</ul>
<div class="callout"><strong>NA ENTREVISTA</strong> Perguntas típicas: "diferença entre cópia rasa e profunda", "o que acontece com ciclos no deepcopy" (memo), "como garantir que o recurso volta ao pool" (context manager com finally), "por que o pool de conexões do banco tem um timeout" (evitar travar em vez de falhar). E a resposta sênior para "quando você <em>não</em> usaria pool": "quando criar o objeto é barato ou o recurso já tem pool embutido".</div>
<p>Fechando a Etapa 6: os criacionais tratam <em>como e quando criar</em>. Em Python, a maior parte deles vira funções, classmethods, dataclasses, módulos e o módulo <code>copy</code>. O valor está em reconhecer a intenção por trás de cada padrão para saber que ferramenta da linguagem a entrega com menos cerimônia, e em saber o custo escondido (estado global, cópia rasa, conexão vazada) de cada escolha.</p>` }
  ],
  whenToUse: [
    'Prototype: há um objeto base (template de job, config, cenário) com variações por cópia',
    'Prototype: o objeto é mutável e cada variação precisa de identidade independente (deepcopy)',
    'Pool: criar o recurso é caro (conexão TCP e TLS, carga de modelo, buffer grande) e o uso é curto e repetido',
    'Pool: o recurso externo tem limite (max_connections do banco) e a aplicação precisa de fila e timeout',
    'Snapshots e "desfazer" de estado em memória'
  ],
  whenNot: [
    'Dados imutáveis: compartilhe a referência, ou derive com dataclasses.replace e copy.replace',
    'Objetos baratos de criar (listas, dicts, instâncias simples): o pool custa mais do que economiza',
    'Recursos não copiáveis (locks, conexões, arquivos): deepcopy falha ou duplica o que devia ser único',
    'Pool sobre pool (o driver ou o ORM já mantém um): gera esperas em dois níveis',
    'Sem medição: pool é otimização prematura com complexidade permanente'
  ],
  metrics: [
    'timeit e cProfile para decidir entre deepcopy, pickle roundtrip e replace',
    'Métricas do pool: em uso, ociosos, esperando e tempo de espera (get_stats do psycopg_pool, eventos do SQLAlchemy)',
    'Conta de conexões: workers × (pool_size + max_overflow) abaixo do max_connections do banco',
    'pg_stat_activity (PostgreSQL) para ver conexões abertas, ociosas e em transação',
    'Teste de vazamento: executar N vezes com exceção forçada e verificar que o pool volta ao tamanho original',
    'pool_pre_ping, pool_recycle e engine.dispose() após fork em ambientes com gunicorn e multiprocessing'
  ],
  refs: [
    { type: 'portal', title: 'The Prototype Pattern', author: 'Brandon Rhodes (python-patterns.guide)', url: 'https://python-patterns.guide/gang-of-four/prototype/', note: 'O Prototype em Python: o que é realmente necessário diante de copy e de classes como objetos.' },
    { type: 'portal', title: 'Prototype', author: 'Refactoring.Guru', url: 'https://refactoring.guru/design-patterns/prototype', note: 'Estrutura clássica e o registro de protótipos.' },
    { type: 'doc', title: 'copy: Shallow and deep copy operations', author: 'Python Docs', url: 'https://docs.python.org/3/library/copy.html', note: 'Semântica de copy, deepcopy, __copy__, __deepcopy__ e copy.replace (3.13).' },
    { type: 'doc', title: 'Connection Pooling', author: 'SQLAlchemy 2.0', url: 'https://docs.sqlalchemy.org/en/20/core/pooling.html', note: 'QueuePool, pre_ping, recycle, fork safety: um pool de produção documentado em detalhe.' },
    { type: 'doc', title: 'psycopg_pool: Connection pools', author: 'Psycopg', url: 'https://www.psycopg.org/psycopg3/docs/advanced/pool.html', note: 'Pool de conexões para PostgreSQL com tamanho, timeout e estatísticas.' },
    { type: 'doc', title: 'concurrent.futures', author: 'Python Docs', url: 'https://docs.python.org/3/library/concurrent.futures.html', note: 'ThreadPoolExecutor e ProcessPoolExecutor: pools prontos de threads e processos.' },
    { type: 'livro', title: 'Design Patterns: Elements of Reusable Object-Oriented Software', author: 'Gamma, Helm, Johnson e Vlissides', url: 'https://en.wikipedia.org/wiki/Design_Patterns', note: 'Fonte original do Prototype (o Object Pool não está no GoF).' },
    { type: 'livro', title: 'Architecture Patterns with Python', author: 'Harry Percival e Bob Gregory', url: 'https://www.cosmicpython.com/', note: 'Unit of Work e sessão de banco com ciclo de vida controlado, em Python.' },
    { type: 'video', title: 'Canal Live de Python', author: 'Eduardo Mendes (Dunossauro)', url: 'https://www.youtube.com/@Dunossauro', note: 'Lives em português sobre mutabilidade, copy e concorrência em Python.' }
  ]
};
