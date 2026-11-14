/* Lesson content, Etapas 7 e 8 (lições 36 a 48)
   Design patterns estruturais e comportamentais
   Schema em CONTRATO: id, title, etapa, etapaName, time, tags, tagline, intro,
   sections[{id,title,body}], whenToUse[], whenNot[], metrics[], refs[]
*/
window.LESSON_CONTENT = window.LESSON_CONTENT || {};

/* ===================== 36. ADAPTER ===================== */
window.LESSON_CONTENT['adapter'] = {
  id: 'adapter',
  title: 'Adapter',
  etapa: 7, etapaName: 'Design patterns estruturais',
  time: '45 min',
  tags: ['estrutural', 'integração', 'anti-corruption layer', 'Protocol'],
  tagline: 'O padrão que você já usou cem vezes sem nomear: traduzir uma interface que você <em>não controla</em> para a que o seu código espera.',
  intro: `
    <p>Todo sistema real integra código que você não escreveu: SDKs de pagamento, clientes de storage, drivers, APIs legadas. Cada um expõe sua própria forma de chamar as coisas, com nomes, tipos de erro e convenções diferentes. Se o seu domínio chama esse SDK diretamente em quarenta lugares, qualquer troca de fornecedor vira uma cirurgia no sistema inteiro.</p>
    <p>O Adapter resolve isso com uma camada fina de tradução: o cliente fala a interface que ele espera (o <em>target</em>), e o adapter converte cada chamada para a interface do componente existente (o <em>adaptee</em>). É o padrão estrutural mais comum no dia a dia, e a base de uma ideia maior: a <strong>anti-corruption layer</strong> do Domain-Driven Design, que impede o modelo do fornecedor de vazar para o seu domínio.</p>
    <p>Nesta lição: a forma clássica do GoF, as formas pythônicas (função, delegação por <code>__getattr__</code>, Protocol), adapters na stdlib, e quando ele é só cerimônia.</p>
  `,
  sections: [
    {
      id: 'intencao',
      title: 'Intenção e participantes (GoF)',
      body: `
        <p>Intenção do GoF: <em>converter a interface de uma classe em outra interface que os clientes esperam. O Adapter permite que classes com interfaces incompatíveis trabalhem juntas.</em></p>
        <table>
          <thead><tr><th>Participante</th><th>Papel</th><th>Exemplo</th></tr></thead>
          <tbody>
            <tr><td>Target</td><td>Interface que o cliente conhece</td><td><code>PaymentGateway.charge(amount, card)</code></td></tr>
            <tr><td>Client</td><td>Colabora com objetos via Target</td><td>Serviço de checkout</td></tr>
            <tr><td>Adaptee</td><td>Interface existente que precisa ser adaptada</td><td>SDK do fornecedor X</td></tr>
            <tr><td>Adapter</td><td>Implementa Target e traduz para o Adaptee</td><td><code>StripeGateway</code></td></tr>
          </tbody>
        </table>
        <p>O fluxo é linear: <code>Client -&gt; Target (interface) -&gt; Adapter -&gt; Adaptee</code>. O cliente nunca importa o Adaptee. Existem duas variantes no livro: <strong>object adapter</strong> (composição, o adapter guarda uma instância do adaptee) e <strong>class adapter</strong> (herança múltipla do Target e do Adaptee). Em Python, prefira a primeira: composição evita acoplar à hierarquia do adaptee e funciona com qualquer objeto, inclusive os que você recebe pronto.</p>
        <div class="callout"><strong>NA ENTREVISTA</strong> A pergunta típica é "Adapter, Decorator, Facade e Proxy, qual a diferença?". Resposta de uma linha para o Adapter: ele <strong>muda</strong> a interface, enquanto Decorator e Proxy a mantêm e Facade cria uma nova, mais simples, para um subsistema inteiro.</div>
      `
    },
    {
      id: 'classico',
      title: 'Implementação clássica',
      body: `
        <p>Cenário: o domínio define um contrato de pagamento. O fornecedor expõe uma API com nomes, unidades (centavos) e exceções diferentes.</p>
        <pre><code class="language-python">from abc import ABC, abstractmethod
from dataclasses import dataclass


@dataclass(frozen=True)
class Receipt:
    transaction_id: str
    amount_cents: int


class PaymentGateway(ABC):          # Target
    @abstractmethod
    def charge(self, amount_cents: int, token: str) -&gt; Receipt: ...


class AcmePayClient:                # Adaptee (código de terceiro, não editável)
    def create_payment(self, value: float, source: str, currency: str = "BRL") -&gt; dict:
        return {"id": "acme_123", "value": value, "status": "ok"}


class AcmePayAdapter(PaymentGateway):   # Adapter (object adapter)
    def __init__(self, client: AcmePayClient) -&gt; None:
        self._client = client

    def charge(self, amount_cents: int, token: str) -&gt; Receipt:
        raw = self._client.create_payment(amount_cents / 100, token)
        return Receipt(transaction_id=raw["id"], amount_cents=round(raw["value"] * 100))


def checkout(gateway: PaymentGateway, amount_cents: int) -&gt; Receipt:
    return gateway.charge(amount_cents, token="tok_visa")


print(checkout(AcmePayAdapter(AcmePayClient()), 1990))</code></pre>
        <p>Note o que o adapter traduz de verdade: nome do método, ordem dos argumentos, unidade (centavos para reais e de volta), e o formato de retorno (dict para dataclass). Esse é o trabalho real. Se o adapter só renomeia um método, provavelmente você não precisa dele.</p>
        <div class="callout warn"><strong>PEGADINHA</strong> Aritmética de dinheiro com float, como no exemplo acima, é só ilustrativa. Em produção use <code>Decimal</code> ou inteiros em centavos de ponta a ponta, e deixe o adapter converter apenas na borda onde o fornecedor exige float.</div>
      `
    },
    {
      id: 'pythonico',
      title: 'Formas pythônicas',
      body: `
        <p>Python oferece três atalhos que cobrem a maioria dos casos, sem hierarquia de classes.</p>
        <p><strong>1. Uma função é um adapter.</strong> Se o cliente precisa de um <em>callable</em> com certa assinatura, adaptar é escrever outro callable (ou usar <code>functools.partial</code> / <code>lambda</code>).</p>
        <pre><code class="language-python">from functools import partial
from typing import Callable

Notifier = Callable[[str], None]          # Target: recebe só a mensagem


def send_email(to: str, subject: str, body: str) -&gt; None:   # Adaptee
    print(f"mail to={to} subject={subject} body={body}")


def make_notifier(to: str, subject: str) -&gt; Notifier:
    return lambda message: send_email(to, subject, message)


alert: Notifier = make_notifier("ops@example.com", "Alerta")
alert("Disco a 95%")

# Equivalente com partial, quando só fixa argumentos:
audit: Notifier = partial(send_email, "audit@example.com", "Auditoria")
audit("login suspeito")</code></pre>
        <p><strong>2. Protocol como Target.</strong> Com tipagem estrutural, o Target é um <code>Protocol</code>. O adapter nem precisa herdar: basta ter os métodos. O type checker valida o encaixe.</p>
        <pre><code class="language-python">from typing import Protocol


class Clock(Protocol):
    def now_ts(self) -&gt; float: ...


class SystemClock:
    def now_ts(self) -&gt; float:
        import time
        return time.time()


class FrozenDatetimeAdapter:
    """Adapta um objeto datetime (adaptee) para o contrato Clock."""
    def __init__(self, dt) -&gt; None:
        self._dt = dt

    def now_ts(self) -&gt; float:
        return self._dt.timestamp()


def expired(deadline: float, clock: Clock) -&gt; bool:
    return clock.now_ts() &gt; deadline</code></pre>
        <p><strong>3. Delegação com <code>__getattr__</code>.</strong> Quando você quer adaptar só alguns métodos e deixar o resto passar direto, o adapter sobrescreve o que muda e delega o restante ao objeto interno.</p>
        <pre><code class="language-python">class LegacyRepo:
    def fetch_all(self): return [{"nm": "Ana"}, {"nm": "Bruno"}]
    def close(self): print("fechado")


class RepoAdapter:
    def __init__(self, inner: LegacyRepo) -&gt; None:
        self._inner = inner

    def list_users(self) -&gt; list[dict]:          # interface nova
        return [{"name": row["nm"]} for row in self._inner.fetch_all()]

    def __getattr__(self, name: str):            # o resto passa direto
        return getattr(self._inner, name)


repo = RepoAdapter(LegacyRepo())
print(repo.list_users())
repo.close()</code></pre>
        <div class="callout warn"><strong>PEGADINHA</strong> <code>__getattr__</code> só é chamado quando o atributo não é encontrado pelo caminho normal, então métodos dunder (<code>__len__</code>, <code>__iter__</code>) buscados pelo interpretador na classe não são delegados. Se o adaptee é um container, implemente esses métodos explicitamente. Também perde-se a checagem estática: o type checker não sabe o que passa pelo <code>__getattr__</code>.</div>
      `
    },
    {
      id: 'acl',
      title: 'Anti-corruption layer e wrappers de SDK',
      body: `
        <p>O Adapter deixa de ser um truque de interface e vira estratégia arquitetural quando você o aplica na <strong>fronteira do domínio</strong>. A ideia (Eric Evans, DDD) é: o modelo do sistema externo é feio, instável ou pensado para outro problema. Uma camada de tradução impede que esse modelo contamine o seu.</p>
        <p>Regras práticas de uma boa anti-corruption layer:</p>
        <ul>
          <li><strong>Só o adapter importa o SDK.</strong> Um lint de imports (por exemplo import-linter) pode impor isso: <code>domain</code> proibido de importar <code>boto3</code>, <code>stripe</code>, <code>requests</code>.</li>
          <li><strong>Traduza erros.</strong> O domínio captura <code>PaymentDeclined</code>, nunca <code>stripe.error.CardError</code>.</li>
          <li><strong>Traduza tipos.</strong> Entra e sai dataclass do domínio, nunca o dict cru ou o objeto do SDK.</li>
          <li><strong>Um adapter por fornecedor, um contrato por capacidade.</strong> Contrato pequeno (<code>put</code>, <code>get</code>), não a superfície inteira do S3.</li>
        </ul>
        <pre><code class="language-python">from typing import Protocol


class PaymentDeclined(Exception): ...
class PaymentUnavailable(Exception): ...


class Gateway(Protocol):
    def charge(self, amount_cents: int, token: str) -&gt; str: ...


class FakeVendorError(Exception):
    def __init__(self, code: str): self.code = code


class VendorGateway:
    def __init__(self, sdk) -&gt; None:
        self._sdk = sdk

    def charge(self, amount_cents: int, token: str) -&gt; str:
        try:
            return self._sdk.pay(amount=amount_cents, source=token)["id"]
        except FakeVendorError as exc:
            if exc.code == "card_declined":
                raise PaymentDeclined(exc.code) from exc
            raise PaymentUnavailable(exc.code) from exc</code></pre>
        <p>O <code>raise ... from exc</code> preserva a causa original para debugging sem forçar o domínio a conhecer o tipo do fornecedor. O benefício aparece no teste: o domínio é testado com um <code>FakeGateway</code> de três linhas, e só o adapter precisa de teste de contrato contra o sandbox real.</p>
        <div class="callout tip"><strong>DICA</strong> Escreva um teste de contrato reutilizável: uma função que recebe qualquer <code>Gateway</code> e verifica o comportamento esperado. Rode-a contra o fake (rápido, sempre) e contra o adapter real (CI noturno ou marcado). Assim o fake nunca diverge da realidade.</div>
      `
    },
    {
      id: 'stdlib',
      title: 'Adapters que você já usa',
      body: `
        <p>A biblioteca padrão e o ecossistema estão cheios deles. Reconhecer o padrão ajuda a ler código alheio mais rápido:</p>
        <ul>
          <li><strong><code>io.TextIOWrapper</code></strong>: adapta um stream de bytes (<code>BufferedReader</code>) para a interface de texto, com encoding e newline. É um adapter por excelência.</li>
          <li><strong><code>logging.LoggerAdapter</code></strong>: envolve um logger e injeta contexto (por exemplo <code>request_id</code>) em cada chamada, mantendo a interface de <code>Logger</code>.</li>
          <li><strong><code>socket.makefile()</code></strong>: expõe um socket como objeto arquivo.</li>
          <li><strong><code>sqlite3.Connection.row_factory</code></strong> e <strong>DB-API</strong>: a PEP 249 é um Target comum; cada driver (psycopg, sqlite3, mysqlclient) é um adapter para o banco real. SQLAlchemy dialects fazem o mesmo, um nível acima.</li>
          <li><strong>ASGI/WSGI</strong>: <code>asgiref.wsgi.WsgiToAsgi</code> adapta uma aplicação WSGI para a interface ASGI.</li>
          <li><strong><code>asyncio.to_thread</code> / <code>run_in_executor</code></strong>: adaptam função bloqueante para o mundo awaitable.</li>
          <li><strong>Django storages</strong>: <code>django-storages</code> implementa a interface <code>Storage</code> do Django para S3, GCS, Azure.</li>
        </ul>
        <pre><code class="language-python">import logging

logging.basicConfig(level=logging.INFO, format="%(request_id)s %(message)s")


class RequestLogger(logging.LoggerAdapter):
    def process(self, msg, kwargs):
        extra = kwargs.setdefault("extra", {})
        extra.setdefault("request_id", self.extra["request_id"])
        return msg, kwargs


log = RequestLogger(logging.getLogger("app"), {"request_id": "req-42"})
log.info("pedido criado")      # imprime: req-42 pedido criado</code></pre>
        <p>Em apps modernas, <code>contextvars</code> costuma substituir o <code>LoggerAdapter</code> para propagar contexto (funciona com async sem passar o adapter adiante), mas o princípio é o mesmo.</p>
      `
    },
    {
      id: 'antes-depois',
      title: 'Antes e depois: refatorando um acoplamento a SDK',
      body: `
        <p><strong>Antes:</strong> o serviço de relatórios chama o cliente de storage do fornecedor diretamente, com nomes e exceções dele.</p>
        <pre><code class="language-python"># ruim: o domínio conhece o SDK
import boto3
from botocore.exceptions import ClientError

s3 = boto3.client("s3")

def save_report(name: str, data: bytes) -&gt; None:
    try:
        s3.put_object(Bucket="reports", Key=f"2026/{name}", Body=data)
    except ClientError as exc:
        if exc.response["Error"]["Code"] == "NoSuchBucket":
            raise RuntimeError("bucket sumiu") from exc
        raise</code></pre>
        <p><strong>Depois:</strong> um contrato mínimo e dois adapters (real e em memória).</p>
        <pre><code class="language-python">from typing import Protocol


class BlobStore(Protocol):
    def put(self, key: str, data: bytes) -&gt; None: ...
    def get(self, key: str) -&gt; bytes: ...


class StoreUnavailable(Exception): ...


class InMemoryStore:
    def __init__(self) -&gt; None:
        self._d: dict[str, bytes] = {}
    def put(self, key: str, data: bytes) -&gt; None: self._d[key] = data
    def get(self, key: str) -&gt; bytes: return self._d[key]


class S3Store:
    def __init__(self, client, bucket: str) -&gt; None:
        self._c, self._bucket = client, bucket

    def put(self, key: str, data: bytes) -&gt; None:
        try:
            self._c.put_object(Bucket=self._bucket, Key=key, Body=data)
        except Exception as exc:        # em produção, capture ClientError
            raise StoreUnavailable(str(exc)) from exc

    def get(self, key: str) -&gt; bytes:
        return self._c.get_object(Bucket=self._bucket, Key=key)["Body"].read()


def save_report(store: BlobStore, name: str, data: bytes) -&gt; None:
    store.put(f"2026/{name}", data)</code></pre>
        <p>Ganhos mensuráveis: o teste de <code>save_report</code> roda sem rede e sem mock de <code>boto3</code>; trocar S3 por GCS é escrever uma classe; a regra "relatórios vão em 2026/" fica no domínio, não espalhada.</p>
      `
    },
    {
      id: 'desnecessario',
      title: 'Quando é desnecessário (e armadilhas)',
      body: `
        <p>Norvig mostrou que boa parte do GoF some em linguagens dinâmicas. O Adapter sobrevive porque o problema (interfaces incompatíveis) é real, mas encolhe:</p>
        <ul>
          <li><strong>Duck typing:</strong> se o cliente só chama <code>.read()</code>, qualquer objeto com <code>read()</code> serve, sem Target formal. Adapte só quando a assinatura difere de fato.</li>
          <li><strong>Funções de primeira classe:</strong> boa parte dos "adapters" é um <code>lambda</code> ou <code>partial</code>.</li>
          <li><strong>Monkeypatch e subclasse mínima</strong> resolvem casos pontuais, mas escondem o acoplamento. Use com moderação e nunca em código de biblioteca.</li>
        </ul>
        <p>Armadilhas comuns:</p>
        <ul>
          <li><strong>Adapter gordo:</strong> quando ele acumula regra de negócio, vira serviço disfarçado. Tradução, só tradução.</li>
          <li><strong>Vazamento:</strong> retornar o objeto do SDK "por conveniência" desfaz o isolamento. Retorne tipos do domínio.</li>
          <li><strong>Abstração prematura:</strong> um único fornecedor, sem plano de troca e sem necessidade de fake nos testes, talvez dispense o contrato. A regra prática: introduza o adapter quando houver dor (segundo fornecedor, teste lento, SDK instável), ou na borda de integrações críticas.</li>
          <li><strong>Denominador comum mínimo:</strong> ao unificar dois fornecedores, o contrato tende a expor só o que ambos fazem. Aceite isso ou exponha capacidades opcionais via Protocols separados.</li>
        </ul>
      `
    }
  ],
  whenToUse: [
    'Integrar SDK, API ou biblioteca de terceiro cuja interface não bate com a do seu domínio',
    'Isolar o domínio de um fornecedor (anti-corruption layer) para poder trocá-lo ou simulá-lo em testes',
    'Migrar gradualmente de um sistema legado, expondo a interface nova sobre o código velho',
    'Fazer dois componentes existentes conversarem sem modificar nenhum dos dois',
    'Padronizar vários backends (storage, filas, caches) atrás de um contrato pequeno'
  ],
  whenNot: [
    'Quando a diferença é só um nome de método: um lambda ou partial resolve',
    'Quando você controla o código dos dois lados: ajuste a interface na origem',
    'Quando o adapter começa a conter regra de negócio ou orquestração (isso é um serviço ou um Facade)',
    'Para um único fornecedor estável, sem testes sofrendo: custo de indireção sem retorno',
    'Quando o contrato vira o mínimo denominador comum e esconde recursos que você realmente usa'
  ],
  metrics: [
    'import-linter ou ruff com regras de import: garante que só o adapter importa o SDK',
    'typing.Protocol + mypy/pyright: valida o encaixe sem herança',
    'Teste de contrato parametrizado (pytest.mark.parametrize) rodando fake e adapter real',
    'Cobertura de tradução de erros: cada exceção do fornecedor mapeada para uma do domínio',
    'Número de imports do SDK fora da camada de adapters (deve ser zero)'
  ],
  refs: [
    { type: 'livro', title: 'Design Patterns: Elements of Reusable Object-Oriented Software', author: 'Gamma, Helm, Johnson, Vlissides (GoF)', url: 'https://www.informit.com/store/design-patterns-elements-of-reusable-object-oriented-9780201633610', note: 'A fonte do padrão: intenção, participantes e consequências do Adapter.' },
    { type: 'portal', title: 'Adapter, refactoring.guru', author: 'Alexander Shvets', url: 'https://refactoring.guru/design-patterns/adapter', note: 'Diagramas claros e exemplos de object e class adapter.' },
    { type: 'portal', title: 'Adapter em Python, refactoring.guru', author: 'Alexander Shvets', url: 'https://refactoring.guru/design-patterns/adapter/python/example', note: 'Implementação comentada do padrão em Python, passo a passo.' },
    { type: 'livro', title: 'Head First Design Patterns, 2nd ed.', author: 'Eric Freeman, Elisabeth Robson', url: 'https://www.oreilly.com/library/view/head-first-design/9781492077992/', note: 'Explicação didática de Adapter e Facade lado a lado.' },
    { type: 'artigo', title: 'Design Patterns in Dynamic Languages', author: 'Peter Norvig', url: 'https://norvig.com/design-patterns/', note: 'Por que 16 dos 23 padrões ficam invisíveis em linguagens dinâmicas.' },
    { type: 'doc', title: 'logging.LoggerAdapter', author: 'Python Software Foundation', url: 'https://docs.python.org/3/library/logging.html#loggeradapter-objects', note: 'Adapter na stdlib para injetar contexto.' },
    { type: 'livro', title: 'Domain-Driven Design', author: 'Eric Evans', url: 'https://www.domainlanguage.com/ddd/', note: 'Origem do conceito de anti-corruption layer.' },
    { type: 'livro', title: 'Fluent Python, 2nd ed.', author: 'Luciano Ramalho', url: 'https://www.oreilly.com/library/view/fluent-python-2nd/9781492056348/', note: 'Protocols, duck typing e composição, base das formas pythônicas.' }
  ]
};

/* ===================== 37. DECORATOR (GoF) ===================== */
window.LESSON_CONTENT['decorator-pattern'] = {
  id: 'decorator-pattern',
  title: 'Decorator (GoF)',
  etapa: 7, etapaName: 'Design patterns estruturais',
  time: '45 min',
  tags: ['estrutural', 'composição', 'wrapper', 'functools'],
  tagline: 'Acrescentar comportamento <em>em camadas</em>, em tempo de execução, sem herança. E por que o @decorator do Python é um primo, não o mesmo padrão.',
  intro: `
    <p>Você precisa de logging, cache, retry, compressão, autenticação, métricas. Resolver cada combinação por herança leva à explosão de subclasses: <code>CompressedEncryptedLoggedStore</code>. O Decorator do GoF troca herança por composição: cada comportamento é um wrapper que implementa a mesma interface do objeto envolvido e delega a ele, adicionando algo antes ou depois.</p>
    <p>Existe uma confusão clássica em Python: a sintaxe <code>@decorator</code> aplica uma função a outra função na definição. É um mecanismo da linguagem, que <em>pode</em> implementar o padrão, mas o padrão GoF é mais geral: trata de <strong>objetos</strong> que se empilham e são montados em tempo de execução. Esta lição separa os dois conceitos e mostra quando usar cada um.</p>
    <p>Você verá o padrão em streams (<code>gzip.GzipFile</code> sobre um arquivo), em middlewares ASGI, em <code>functools.lru_cache</code>, em handlers e em clientes HTTP com retry e cache empilhados.</p>
  `,
  sections: [
    {
      id: 'intencao',
      title: 'Intenção e estrutura (GoF)',
      body: `
        <p>Intenção do GoF: <em>atribuir responsabilidades adicionais a um objeto dinamicamente. Decorators oferecem uma alternativa flexível à herança para estender funcionalidade.</em></p>
        <table>
          <thead><tr><th>Participante</th><th>Papel</th></tr></thead>
          <tbody>
            <tr><td>Component</td><td>Interface comum (<code>Notifier.send</code>)</td></tr>
            <tr><td>ConcreteComponent</td><td>Objeto base que faz o trabalho (<code>EmailNotifier</code>)</td></tr>
            <tr><td>Decorator</td><td>Guarda uma referência a um Component e implementa a mesma interface</td></tr>
            <tr><td>ConcreteDecorator</td><td>Acrescenta comportamento (<code>RetryNotifier</code>, <code>LoggedNotifier</code>)</td></tr>
          </tbody>
        </table>
        <p>A chave é que o decorator <strong>é um</strong> Component e <strong>tem um</strong> Component. Como a interface é idêntica, o cliente não sabe quantas camadas existem, e as camadas podem ser empilhadas em qualquer ordem: <code>Logged(Retry(Email()))</code>. A ordem importa semanticamente: logar fora do retry registra uma chamada; logar dentro registra cada tentativa.</p>
        <div class="callout"><strong>NA ENTREVISTA</strong> Diferença para Proxy: o Decorator existe para <strong>acrescentar</strong> responsabilidade e costuma ser empilhado pelo cliente; o Proxy <strong>controla acesso</strong> ao objeto (lazy, proteção, remoto) e normalmente gerencia o ciclo de vida do alvo. A estrutura é quase idêntica, a intenção difere.</div>
      `
    },
    {
      id: 'classico',
      title: 'Implementação clássica com classes',
      body: `
        <pre><code class="language-python">from abc import ABC, abstractmethod
import time


class Notifier(ABC):                       # Component
    @abstractmethod
    def send(self, message: str) -&gt; bool: ...


class EmailNotifier(Notifier):             # ConcreteComponent
    def send(self, message: str) -&gt; bool:
        print(f"email: {message}")
        return True


class NotifierDecorator(Notifier):         # Decorator base
    def __init__(self, inner: Notifier) -&gt; None:
        self._inner = inner

    def send(self, message: str) -&gt; bool:
        return self._inner.send(message)


class RetryNotifier(NotifierDecorator):    # ConcreteDecorator
    def __init__(self, inner: Notifier, attempts: int = 3, delay: float = 0.1) -&gt; None:
        super().__init__(inner)
        self._attempts, self._delay = attempts, delay

    def send(self, message: str) -&gt; bool:
        for i in range(self._attempts):
            if self._inner.send(message):
                return True
            time.sleep(self._delay * (2 ** i))
        return False


class TimedNotifier(NotifierDecorator):
    def send(self, message: str) -&gt; bool:
        t0 = time.perf_counter()
        try:
            return self._inner.send(message)
        finally:
            print(f"send levou {(time.perf_counter() - t0) * 1000:.2f} ms")


notifier: Notifier = TimedNotifier(RetryNotifier(EmailNotifier()))
notifier.send("deploy concluido")</code></pre>
        <p>Observe a montagem em tempo de execução: a pilha é decidida por configuração, não por uma classe fixa. Cada decorator tem uma responsabilidade única (SRP) e pode ser testado isolado com um <code>inner</code> falso.</p>
      `
    },
    {
      id: 'funcional',
      title: 'Forma pythônica: @decorator e funções',
      body: `
        <p>Quando o componente é uma função (ou um método), o decorator de função da linguagem é a implementação idiomática do mesmo conceito: recebe um callable, devolve outro com a mesma assinatura lógica.</p>
        <pre><code class="language-python">import functools
import time
from typing import Callable, ParamSpec, TypeVar

P = ParamSpec("P")
R = TypeVar("R")


def retry(attempts: int = 3, delay: float = 0.1, on: type[Exception] = Exception):
    def deco(fn: Callable[P, R]) -&gt; Callable[P, R]:
        @functools.wraps(fn)                       # preserva __name__, __doc__, __wrapped__
        def wrapper(*args: P.args, **kwargs: P.kwargs) -&gt; R:
            for i in range(attempts):
                try:
                    return fn(*args, **kwargs)
                except on:
                    if i == attempts - 1:
                        raise
                    time.sleep(delay * (2 ** i))
            raise AssertionError("inalcancavel")
        return wrapper
    return deco


def timed(fn: Callable[P, R]) -&gt; Callable[P, R]:
    @functools.wraps(fn)
    def wrapper(*args: P.args, **kwargs: P.kwargs) -&gt; R:
        t0 = time.perf_counter()
        try:
            return fn(*args, **kwargs)
        finally:
            print(f"{fn.__name__}: {(time.perf_counter() - t0) * 1000:.2f} ms")
    return wrapper


@timed
@retry(attempts=4, on=ConnectionError)
def fetch(url: str) -&gt; str:
    return "ok"</code></pre>
        <p>Com Python 3.12+ (PEP 695), a sintaxe de generics dispensa <code>TypeVar</code> manual: <code>def timed[**P, R](fn: Callable[P, R]) -&gt; Callable[P, R]</code>. Funciona do mesmo jeito e fica mais curta.</p>
        <div class="callout warn"><strong>PEGADINHA</strong> Sem <code>functools.wraps</code> o wrapper "rouba" o nome e a docstring da função, quebrando introspecção, logs e frameworks (FastAPI e pytest dependem disso). A ordem dos decorators empilhados é de baixo para cima na aplicação: no exemplo, <code>retry</code> envolve <code>fetch</code> primeiro, depois <code>timed</code> envolve o resultado, então o tempo medido inclui todas as tentativas.</div>
        <p>A distinção: <code>@decorator</code> decora na <strong>definição</strong>, de forma estática, e a camada vale para todos os chamadores. O Decorator GoF decora <strong>instâncias</strong> na composição, então dois objetos da mesma classe podem ter pilhas diferentes. Em Python você também pode aplicar a função manualmente, <code>fetch2 = timed(fetch)</code>, e ganhar essa flexibilidade em nível de função.</p>
      `
    },
    {
      id: 'objetos',
      title: 'Decorando objetos: delegação e __getattr__',
      body: `
        <p>Escrever um decorator de classe por interface exige repetir todos os métodos delegados. Para interfaces grandes, delegue dinamicamente e sobrescreva só o que muda.</p>
        <pre><code class="language-python">class CountingFile:
    """Decora qualquer objeto arquivo contando bytes lidos."""
    def __init__(self, f) -&gt; None:
        self._f = f
        self.bytes_read = 0

    def read(self, n: int = -1) -&gt; bytes:
        data = self._f.read(n)
        self.bytes_read += len(data)
        return data

    def __getattr__(self, name: str):      # close, seek, tell... passam direto
        return getattr(self._f, name)

    def __enter__(self):
        self._f.__enter__()
        return self

    def __exit__(self, *exc):
        return self._f.__exit__(*exc)


import io
src = CountingFile(io.BytesIO(b"abcdef" * 100))
with src as f:
    f.read(50)
    f.read(50)
print(src.bytes_read)    # 100</code></pre>
        <p>Exemplos reais do mesmo desenho:</p>
        <ul>
          <li><strong><code>gzip.GzipFile(fileobj=...)</code>, <code>io.BufferedReader</code>, <code>io.TextIOWrapper</code></strong>: camadas empilhadas sobre um stream, cada uma com a mesma interface de arquivo. É o exemplo canônico de Decorator em Java (<code>java.io</code>) e vale igual em Python.</li>
          <li><strong>Middlewares ASGI</strong>: cada middleware recebe a aplicação, devolve outra aplicação com a mesma assinatura <code>(scope, receive, send)</code> e delega a ela. Starlette, FastAPI e Django (middleware de função) funcionam assim.</li>
          <li><strong><code>functools.lru_cache</code>, <code>cache</code>, <code>singledispatch</code>, <code>cached_property</code></strong>: decorators de função da stdlib.</li>
          <li><strong>Clientes HTTP</strong> (httpx transports, requests adapters, urllib3 Retry) permitem empilhar retry, cache e autenticação.</li>
        </ul>
        <pre><code class="language-python"># Middleware ASGI mínimo: o mesmo conceito, em forma de callable
class TimingMiddleware:
    def __init__(self, app) -&gt; None:
        self.app = app

    async def __call__(self, scope, receive, send):
        import time
        t0 = time.perf_counter()
        try:
            await self.app(scope, receive, send)
        finally:
            print(f"{scope.get('path')}: {(time.perf_counter() - t0) * 1000:.1f} ms")</code></pre>
      `
    },
    {
      id: 'antes-depois',
      title: 'Antes e depois: fim da explosão de subclasses',
      body: `
        <p><strong>Antes:</strong> flags e subclasses para cada combinação.</p>
        <pre><code class="language-python"># ruim: uma classe por combinação, ou flags demais
class Store:
    def __init__(self, compress=False, log=False, cache=False): ...
    def put(self, key, data):
        if self.compress: data = zlib.compress(data)
        if self.log: print("put", key)
        if self.cache: self._cache[key] = data
        ...  # cada flag nova mexe neste método</code></pre>
        <p><strong>Depois:</strong> um núcleo simples e decorators combináveis.</p>
        <pre><code class="language-python">import zlib
from typing import Protocol


class Store(Protocol):
    def put(self, key: str, data: bytes) -&gt; None: ...
    def get(self, key: str) -&gt; bytes: ...


class MemoryStore:
    def __init__(self) -&gt; None: self._d: dict[str, bytes] = {}
    def put(self, key, data): self._d[key] = data
    def get(self, key): return self._d[key]


class Compressed:
    def __init__(self, inner: Store) -&gt; None: self._inner = inner
    def put(self, key, data): self._inner.put(key, zlib.compress(data))
    def get(self, key): return zlib.decompress(self._inner.get(key))


class Logged:
    def __init__(self, inner: Store) -&gt; None: self._inner = inner
    def put(self, key, data):
        print("put", key, len(data))
        self._inner.put(key, data)
    def get(self, key):
        print("get", key)
        return self._inner.get(key)


store: Store = Logged(Compressed(MemoryStore()))
store.put("a", b"x" * 1000)
print(store.get("a")[:3])</code></pre>
        <p>Adicionar criptografia é uma classe nova, sem tocar nas existentes (Open/Closed). A ordem é semântica: <code>Logged(Compressed(...))</code> loga o tamanho original; invertendo, logaria o comprimido.</p>
      `
    },
    {
      id: 'armadilhas',
      title: 'Armadilhas, custos e quando dispensar',
      body: `
        <ul>
          <li><strong>Identidade quebrada:</strong> <code>decorated is original</code> é falso, e <code>isinstance</code> contra a classe concreta falha. Dependa da interface (Protocol), nunca do tipo concreto.</li>
          <li><strong>Pilha opaca:</strong> com muitas camadas, o traceback fica longo e o debug difícil. Nomeie bem, e exponha <code>__wrapped__</code> ou um método <code>unwrap()</code> quando útil.</li>
          <li><strong>Ordem sutil:</strong> retry dentro de timeout, cache fora de auth, métricas fora de tudo. Documente a ordem canônica da pilha e monte-a em um único lugar (uma factory).</li>
          <li><strong>Estado compartilhado:</strong> decorator de função com estado (contador, cache) é global à função. Para estado por instância, use decorator de objeto.</li>
          <li><strong>Custo:</strong> cada camada adiciona uma chamada extra de Python, na ordem de dezenas de nanossegundos por camada em hot paths. Meça com <code>timeit</code> antes de se preocupar; em I/O o custo some.</li>
          <li><strong>Async:</strong> um decorator de função precisa distinguir <code>async def</code>. Aplicar um wrapper síncrono a uma corrotina devolve a corrotina sem aguardar e quebra silenciosamente o retry/timing. Use <code>inspect.iscoroutinefunction</code> e escreva wrapper <code>async</code> equivalente.</li>
        </ul>
        <p>Quando é desnecessário: se você tem um único comportamento extra e é fixo, uma simples função auxiliar ou herança rasa basta. Em Python, boa parte do que Java faz com classes decorator vira um <code>@decorator</code> de função de três linhas, ou um context manager (<code>with timed(): ...</code>) quando o escopo é um bloco e não uma função inteira.</p>
        <div class="callout tip"><strong>DICA</strong> Para decorators que aceitam argumentos opcionais (<code>@retry</code> e <code>@retry(attempts=5)</code>), a biblioteca <code>wrapt</code> ou um padrão com <code>functools.partial</code> resolve o duplo uso corretamente, inclusive com métodos e classmethods.</div>
      `
    }
  ],
  whenToUse: [
    'Empilhar responsabilidades transversais (log, cache, retry, métricas, auth) sem inflar a classe base',
    'Combinar comportamentos em tempo de execução, por configuração ou por instância',
    'Estender código que você não pode modificar, mantendo a mesma interface',
    'Montar pipelines de middleware (ASGI, clientes HTTP, streams de I/O)',
    'Evitar explosão combinatória de subclasses'
  ],
  whenNot: [
    'Quando o comportamento extra é único e fixo: uma função ou subclasse simples basta',
    'Quando o código depende de isinstance ou de identidade do objeto concreto',
    'Quando a ordem das camadas é frágil e ninguém documenta (prefira um pipeline explícito)',
    'Em hot paths em que cada chamada extra importa e o ganho de flexibilidade é nulo',
    'Quando o escopo é um bloco de código e não uma função: use um context manager'
  ],
  metrics: [
    'functools.wraps e inspect.signature: confirmam que a assinatura e o nome são preservados',
    'inspect.iscoroutinefunction: separa wrappers síncronos de assíncronos',
    'timeit / pytest-benchmark: custo por camada em hot paths',
    'mypy/pyright com ParamSpec: garante que o decorator não perde a tipagem',
    'Teste unitário por camada com inner falso, mais um teste de integração da pilha montada'
  ],
  refs: [
    { type: 'portal', title: 'Decorator, refactoring.guru', author: 'Alexander Shvets', url: 'https://refactoring.guru/design-patterns/decorator', note: 'Estrutura e exemplos do padrão GoF, com analogias práticas.' },
    { type: 'portal', title: 'The Decorator Pattern, Python Patterns Guide', author: 'Brandon Rhodes', url: 'https://python-patterns.guide/gang-of-four/decorator-pattern/', note: 'Separa o padrão GoF do @decorator da linguagem, com a visão pythônica.' },
    { type: 'doc', title: 'functools.wraps', author: 'Python Software Foundation', url: 'https://docs.python.org/3/library/functools.html#functools.wraps', note: 'Como preservar metadados ao decorar.' },
    { type: 'doc', title: 'PEP 318, Decorators for Functions and Methods', author: 'Kevin D. Smith, Jim Jewett, Skip Montanaro, Anthony Baxter', url: 'https://peps.python.org/pep-0318/', note: 'A origem da sintaxe @ na linguagem.' },
    { type: 'doc', title: 'PEP 695, Type Parameter Syntax', author: 'Eric Traut', url: 'https://peps.python.org/pep-0695/', note: 'Sintaxe moderna de generics usada em decorators tipados no 3.12+.' },
    { type: 'livro', title: 'Fluent Python, 2nd ed.', author: 'Luciano Ramalho', url: 'https://www.oreilly.com/library/view/fluent-python-2nd/9781492056348/', note: 'O capítulo sobre decorators e closures é a melhor explicação em livro.' },
    { type: 'livro', title: 'Head First Design Patterns, 2nd ed.', author: 'Eric Freeman, Elisabeth Robson', url: 'https://www.oreilly.com/library/view/head-first-design/9781492077992/', note: 'O exemplo das bebidas com cobertura é a introdução clássica ao padrão.' },
    { type: 'artigo', title: 'Design Patterns in Dynamic Languages', author: 'Peter Norvig', url: 'https://norvig.com/design-patterns/', note: 'Funções de primeira classe e o desaparecimento de padrões.' }
  ]
};

/* ===================== 38. FACADE ===================== */
window.LESSON_CONTENT['facade'] = {
  id: 'facade',
  title: 'Facade',
  etapa: 7, etapaName: 'Design patterns estruturais',
  time: '40 min',
  tags: ['estrutural', 'subsistema', 'API', 'acoplamento'],
  tagline: 'Uma porta simples para um subsistema complexo: reduzir o número de coisas que o cliente precisa <em>saber</em>.',
  intro: `
    <p>Subsistemas crescem. Para gerar um relatório você precisa abrir conexão, montar query, executar, converter linhas, formatar, escolher o encoder e gravar. Se cada chamador repete essa coreografia, cada um acopla-se a seis classes e qualquer mudança interna quebra todos eles.</p>
    <p>O Facade oferece uma interface unificada e <strong>simplificada</strong> sobre um conjunto de interfaces do subsistema. Não impede o acesso direto às peças (quem precisa de controle fino continua tendo), mas dá ao caso comum um caminho curto. É o padrão por trás de bibliotecas bem desenhadas: <code>requests.get()</code> esconde sessões, adapters, pool de conexões e decodificação; <code>shutil.copytree()</code> esconde varredura, permissões e erros; <code>pathlib.Path.read_text()</code> esconde abrir, ler, decodificar e fechar.</p>
    <p>Em Python, um módulo inteiro já é um facade natural. Esta lição cobre a forma clássica, a modular, o limite entre Facade e "God object", e a relação com camada de serviço e <code>__init__.py</code> como API pública.</p>
  `,
  sections: [
    {
      id: 'intencao',
      title: 'Intenção e participantes (GoF)',
      body: `
        <p>Intenção do GoF: <em>fornecer uma interface unificada para um conjunto de interfaces em um subsistema. Facade define uma interface de nível mais alto que torna o subsistema mais fácil de usar.</em></p>
        <table>
          <thead><tr><th>Participante</th><th>Papel</th></tr></thead>
          <tbody>
            <tr><td>Facade</td><td>Conhece quais classes do subsistema atendem cada pedido e delega a elas</td></tr>
            <tr><td>Classes do subsistema</td><td>Implementam a funcionalidade real, sem saber da existência do Facade</td></tr>
            <tr><td>Client</td><td>Conversa com o Facade em vez de com dezenas de classes</td></tr>
          </tbody>
        </table>
        <p>O fluxo: <code>Client -&gt; Facade -&gt; (Parser, Validator, Repository, Mailer...)</code>. A dependência é unidirecional: o subsistema não referencia o Facade. Isso é essencial: se as peças internas importam o Facade, você criou um ciclo e perdeu o benefício.</p>
        <p>Comparação rápida com vizinhos: o <strong>Adapter</strong> altera a interface de <em>um</em> objeto para encaixá-lo; o Facade cria uma interface <em>nova e mais simples</em> para <em>vários</em> objetos. O <strong>Mediator</strong> centraliza a comunicação entre colegas que se conhecem; o Facade é unidirecional, só o cliente chama.</p>
        <div class="callout"><strong>NA ENTREVISTA</strong> "Facade não esconde o subsistema, simplifica." Se perguntarem o que acontece quando alguém precisa de um caso não coberto: ele usa as classes do subsistema diretamente. Um Facade que proíbe isso vira gargalo e é antipadrão.</div>
      `
    },
    {
      id: 'classico',
      title: 'Implementação clássica',
      body: `
        <p>Cenário: um pipeline de importação de pedidos exige quatro componentes. O facade expõe uma única operação.</p>
        <pre><code class="language-python">import csv
import io
from dataclasses import dataclass


@dataclass
class Order:
    id: str
    total_cents: int


class CsvParser:
    def parse(self, text: str) -&gt; list[dict]:
        return list(csv.DictReader(io.StringIO(text)))


class OrderValidator:
    def validate(self, row: dict) -&gt; Order:
        if not row.get("id"):
            raise ValueError("id vazio")
        return Order(row["id"], int(row["total"]))


class OrderRepository:
    def __init__(self) -&gt; None:
        self.rows: dict[str, Order] = {}
    def save_many(self, orders: list[Order]) -&gt; None:
        self.rows.update({o.id: o for o in orders})


class Mailer:
    def notify(self, text: str) -&gt; None:
        print("notify:", text)


class OrderImportFacade:
    """Interface única para o caso comum: importar um CSV."""
    def __init__(self, repo: OrderRepository | None = None, mailer: Mailer | None = None) -&gt; None:
        self._parser = CsvParser()
        self._validator = OrderValidator()
        self._repo = repo or OrderRepository()
        self._mailer = mailer or Mailer()

    def import_csv(self, text: str) -&gt; int:
        rows = self._parser.parse(text)
        orders = [self._validator.validate(r) for r in rows]
        self._repo.save_many(orders)
        self._mailer.notify(f"{len(orders)} pedidos importados")
        return len(orders)


facade = OrderImportFacade()
print(facade.import_csv("id,total\\na1,1000\\na2,2500\\n"))</code></pre>
        <p>O cliente chama <code>import_csv</code>, e só. Os colaboradores são injetáveis (parâmetros opcionais), o que mantém o facade testável: nos testes você passa um repositório em memória e um mailer falso.</p>
      `
    },
    {
      id: 'pythonico',
      title: 'Forma pythônica: módulos, funções e __init__.py',
      body: `
        <p>Em Python o facade mais comum nem é uma classe: é uma <strong>função de módulo</strong> ou o próprio <code>__init__.py</code> do pacote, que reexporta a API pública e esconde a estrutura interna.</p>
        <pre><code class="language-text">pagamentos/
  __init__.py        # API pública: charge, refund, PaymentError
  _gateway.py        # detalhes do fornecedor (prefixo _ = privado)
  _retry.py
  _models.py</code></pre>
        <pre><code class="language-python"># pagamentos/__init__.py
from ._models import Receipt, PaymentError
from ._gateway import _charge_impl, _refund_impl

__all__ = ["charge", "refund", "Receipt", "PaymentError"]


def charge(amount_cents: int, token: str) -&gt; Receipt:
    """Caso comum: cobra com retry e idempotência já configurados."""
    return _charge_impl(amount_cents, token, retries=3, idempotent=True)


def refund(receipt: Receipt) -&gt; None:
    _refund_impl(receipt)</code></pre>
        <p>Quem importa <code>from pagamentos import charge</code> não sabe nem se importa com o que existe em <code>_gateway</code>. Você pode reorganizar os módulos internos sem quebrar nenhum chamador. É assim que bibliotecas públicas sustentam compatibilidade por anos: <code>__all__</code> e o prefixo <code>_</code> são o contrato.</p>
        <p>Exemplos de facade na stdlib e no ecossistema:</p>
        <ul>
          <li><strong><code>shutil.copytree</code>, <code>shutil.make_archive</code></strong>: uma chamada, dezenas de operações de <code>os</code> e <code>tarfile</code>.</li>
          <li><strong><code>pathlib.Path</code></strong>: <code>read_text</code>, <code>write_text</code>, <code>glob</code> escondem <code>open</code>, <code>os.scandir</code>, <code>fnmatch</code>.</li>
          <li><strong><code>subprocess.run</code></strong>: facade sobre <code>Popen</code>, <code>communicate</code>, timeout e checagem de retorno.</li>
          <li><strong><code>requests.get</code></strong>: facade sobre <code>Session</code>, <code>HTTPAdapter</code>, <code>urllib3</code>.</li>
          <li><strong><code>logging.basicConfig</code></strong>: configura handler, formatter e root logger em uma linha.</li>
          <li><strong>Camada de serviço</strong> em apps Django/FastAPI: <code>OrderService.place_order()</code> orquestra repositórios, pagamento e notificação para as views.</li>
        </ul>
        <pre><code class="language-python">import subprocess

# facade: uma chamada no lugar de Popen + communicate + wait + check
result = subprocess.run(
    ["git", "--version"], capture_output=True, text=True, check=True, timeout=5,
)
print(result.stdout.strip())</code></pre>
      `
    },
    {
      id: 'antes-depois',
      title: 'Antes e depois: um subsistema vazando para todo lado',
      body: `
        <p><strong>Antes:</strong> cada endpoint repete a mesma coreografia de transcodificação de mídia.</p>
        <pre><code class="language-python"># ruim: acoplado a quatro classes em cada view
def upload_view(request):
    probe = Prober(request.file)
    if probe.codec not in ALLOWED:
        raise Reject()
    enc = Encoder(preset="web", bitrate=probe.suggest_bitrate())
    out = enc.run(request.file)
    Storage(bucket="media").put(out.name, out.data)
    ThumbnailJob(out.name).enqueue()
    return {"name": out.name}</code></pre>
        <p><strong>Depois:</strong> um facade com o caso comum, e as peças continuam acessíveis.</p>
        <pre><code class="language-python">class MediaPipeline:
    def __init__(self, prober_cls=Prober, encoder_cls=Encoder, storage=None) -&gt; None:
        self._prober_cls = prober_cls
        self._encoder_cls = encoder_cls
        self._storage = storage or Storage(bucket="media")

    def publish(self, file) -&gt; str:
        probe = self._prober_cls(file)
        if probe.codec not in ALLOWED:
            raise Reject(probe.codec)
        out = self._encoder_cls(preset="web", bitrate=probe.suggest_bitrate()).run(file)
        self._storage.put(out.name, out.data)
        ThumbnailJob(out.name).enqueue()
        return out.name


def upload_view(request):
    return {"name": MediaPipeline().publish(request.file)}</code></pre>
        <p>A view caiu de cinco responsabilidades para uma chamada. Uma mudança no preset ou no storage acontece em um lugar. E para um caso especial (vídeo sem thumbnail) o código ainda pode usar <code>Encoder</code> diretamente.</p>
      `
    },
    {
      id: 'limites',
      title: 'Limites: Facade versus God object',
      body: `
        <p>O risco do Facade é crescer até se tornar a classe que faz tudo. Sinais de alerta e como tratar:</p>
        <ul>
          <li><strong>Lógica de negócio dentro do facade:</strong> o facade orquestra, não decide. Regras pertencem às classes do subsistema (ou ao domínio). Se há <code>if</code> de regra de negócio demais, extraia.</li>
          <li><strong>Dezenas de métodos públicos:</strong> divida em vários facades por <em>caso de uso</em> ou por contexto (<code>BillingFacade</code>, <code>CatalogFacade</code>), em vez de um único <code>AppFacade</code>.</li>
          <li><strong>Subsistema não alcançável:</strong> se tudo precisa passar pelo facade e ele não cobre seu caso, as pessoas contornam com hacks. Deixe as peças públicas.</li>
          <li><strong>Estado oculto:</strong> um facade que mantém conexões, caches e sessões internas precisa de ciclo de vida claro (context manager, <code>close()</code>). Implemente <code>__enter__</code> e <code>__exit__</code>.</li>
          <li><strong>Teste:</strong> teste o facade com colaboradores falsos injetados. Se você não consegue injetar, o facade está instanciando tudo internamente e ficou rígido.</li>
        </ul>
        <pre><code class="language-python">from contextlib import AbstractContextManager


class ReportFacade(AbstractContextManager):
    def __init__(self, dsn: str) -&gt; None:
        self._conn = open_connection(dsn)          # recurso interno

    def monthly(self, year: int, month: int) -&gt; bytes:
        rows = self._conn.query("select ...", (year, month))
        return render_pdf(rows)

    def close(self) -&gt; None:
        self._conn.close()

    def __exit__(self, *exc) -&gt; None:
        self.close()</code></pre>
        <div class="callout warn"><strong>PEGADINHA</strong> Facade para "esconder" um subsistema ruim sem arrumá-lo vira verniz: a dívida continua lá, só ficou menos visível. Use o facade como passo de uma estratégia (isolar para depois refatorar por baixo, como no padrão Strangler), não como substituto da refatoração.</div>
      `
    },
    {
      id: 'desnecessario',
      title: 'Quando é desnecessário em Python',
      body: `
        <p>O Facade é um dos padrões que o Python torna quase invisível, porque a linguagem já tem o ingrediente principal: <strong>módulos são objetos de primeira classe</strong>. Uma função de módulo bem nomeada faz o papel de um facade sem classe, sem estado e sem cerimônia. Não escreva <code>class ImportFacade</code> com um método quando <code>def import_csv(...)</code> basta.</p>
        <p>Vale uma classe quando há <strong>estado e ciclo de vida</strong> (conexões, caches, configuração injetada) ou quando você quer injetar colaboradores para teste. Do contrário, função.</p>
        <p>Também não use Facade quando o subsistema já é simples (você estaria adicionando uma camada de nomes), quando existe uma única chamada ao subsistema (o facade seria um alias), ou quando o objetivo real é trocar implementações (isso é Adapter ou Strategy).</p>
        <p>Perguntas para decidir:</p>
        <ol>
          <li>Mais de um chamador repete a mesma sequência de 3 ou mais chamadas ao subsistema? Então há um facade esperando para existir.</li>
          <li>A sequência muda por razões internas ao subsistema? Então vale esconder a sequência.</li>
          <li>Os chamadores precisam variar a sequência? Então não force: exponha as peças e ofereça o facade apenas para o caminho comum.</li>
        </ol>
      `
    }
  ],
  whenToUse: [
    'Vários chamadores repetem a mesma coreografia de 3 ou mais objetos do subsistema',
    'Você quer uma API pública estável que permita reorganizar o interior livremente',
    'Precisa dar um ponto de entrada simples a uma biblioteca ou serviço legado complexo',
    'Está construindo camadas (serviço, domínio, infraestrutura) e quer limitar o que cada uma conhece',
    'Quer isolar o subsistema antes de refatorá-lo ou substituí-lo (strangler)'
  ],
  whenNot: [
    'Quando uma função de módulo resolve: não crie classe sem estado nem ciclo de vida',
    'Quando o facade acumularia regra de negócio ou dezenas de métodos (God object)',
    'Quando os chamadores precisam variar a sequência e o facade os engessaria',
    'Quando o subsistema já tem uma interface simples e direta',
    'Como verniz para esconder dívida técnica em vez de pagá-la'
  ],
  metrics: [
    'import-linter: contratos de camadas, só o facade é importado de fora do pacote',
    '__all__ e prefixo _ nos módulos internos: definem a API pública verificável',
    'pytest com colaboradores falsos injetados no facade',
    'Contagem de imports de classes internas fora do pacote (deve tender a zero)',
    'Número de métodos públicos por facade: acima de uma dezena, avalie dividir'
  ],
  refs: [
    { type: 'portal', title: 'Facade, refactoring.guru', author: 'Alexander Shvets', url: 'https://refactoring.guru/design-patterns/facade', note: 'Estrutura, aplicabilidade e comparação com Adapter e Mediator.' },
    { type: 'portal', title: 'Design Patterns in Python', author: 'Brandon Rhodes', url: 'https://python-patterns.guide/', note: 'Guia que reavalia o catálogo do GoF sob a ótica do Python.' },
    { type: 'livro', title: 'Design Patterns: Elements of Reusable Object-Oriented Software', author: 'Gamma, Helm, Johnson, Vlissides (GoF)', url: 'https://www.informit.com/store/design-patterns-elements-of-reusable-object-oriented-9780201633610', note: 'Definição original do Facade e discussão de consequências.' },
    { type: 'livro', title: 'Head First Design Patterns, 2nd ed.', author: 'Eric Freeman, Elisabeth Robson', url: 'https://www.oreilly.com/library/view/head-first-design/9781492077992/', note: 'O exemplo do home theater explica o padrão e o princípio do menor conhecimento.' },
    { type: 'doc', title: 'subprocess.run', author: 'Python Software Foundation', url: 'https://docs.python.org/3/library/subprocess.html#subprocess.run', note: 'Facade da stdlib sobre Popen, vale ler como estudo de API.' },
    { type: 'doc', title: 'shutil, operações de arquivo de alto nível', author: 'Python Software Foundation', url: 'https://docs.python.org/3/library/shutil.html', note: 'Módulo inteiro desenhado como facade.' },
    { type: 'artigo', title: 'Design Patterns in Dynamic Languages', author: 'Peter Norvig', url: 'https://norvig.com/design-patterns/', note: 'Contexto sobre padrões que a linguagem já absorve.' },
    { type: 'livro', title: 'Architecture Patterns with Python', author: 'Harry Percival, Bob Gregory', url: 'https://www.cosmicpython.com/', note: 'Camada de serviço como facade da aplicação, com testes.' }
  ]
};

/* ===================== 39. PROXY ===================== */
window.LESSON_CONTENT['proxy'] = {
  id: 'proxy',
  title: 'Proxy',
  etapa: 7, etapaName: 'Design patterns estruturais',
  time: '45 min',
  tags: ['estrutural', 'lazy loading', 'controle de acesso', 'cache'],
  tagline: 'Um substituto que <em>controla o acesso</em> ao objeto real: adiar, proteger, cachear, medir ou atravessar a rede.',
  intro: `
    <p>Às vezes o objeto real é caro de criar (conexão, modelo de ML, imagem enorme), fica em outra máquina, ou não deve ser acessado por qualquer um. O Proxy coloca na frente dele um representante com a <strong>mesma interface</strong>. O cliente não percebe a diferença, e o proxy decide quando, como e se a chamada chega ao objeto real.</p>
    <p>O padrão está por toda parte: o ORM que só consulta o banco quando você acessa o atributo (lazy loading), <code>unittest.mock.Mock</code>, <code>weakref.proxy</code>, stubs gRPC, <code>Flask</code>'s <code>request</code> (um proxy de contexto via <code>werkzeug.local.LocalProxy</code>), <code>multiprocessing.managers</code>, e <code>functools.cached_property</code> como forma degenerada do mesmo conceito.</p>
    <p>Aqui: os quatro tipos clássicos (virtual, de proteção, remoto, de cache/smart reference), a implementação com classes, <code>__getattr__</code> e descritores, e a fronteira com Decorator.</p>
  `,
  sections: [
    {
      id: 'intencao',
      title: 'Intenção, tipos e participantes (GoF)',
      body: `
        <p>Intenção do GoF: <em>fornecer um substituto ou ponto de acesso a outro objeto para controlar o acesso a ele.</em></p>
        <table>
          <thead><tr><th>Tipo</th><th>O que controla</th><th>Exemplo em Python</th></tr></thead>
          <tbody>
            <tr><td>Virtual (lazy)</td><td>Quando o objeto caro é criado</td><td>Relação lazy do SQLAlchemy/Django ORM, <code>cached_property</code></td></tr>
            <tr><td>Proteção</td><td>Quem pode chamar o quê</td><td>Wrapper que checa permissão antes de delegar</td></tr>
            <tr><td>Remoto</td><td>Onde o objeto vive</td><td>Stubs gRPC, <code>xmlrpc.client.ServerProxy</code>, Pyro</td></tr>
            <tr><td>Cache</td><td>Se o resultado já existe</td><td>Cliente HTTP com cache, repositório com cache</td></tr>
            <tr><td>Smart reference</td><td>Contagem, bloqueio, referência fraca</td><td><code>weakref.proxy</code>, <code>LocalProxy</code></td></tr>
          </tbody>
        </table>
        <p>Participantes: <strong>Subject</strong> (interface comum), <strong>RealSubject</strong> (objeto real) e <strong>Proxy</strong> (implementa Subject, guarda referência ao RealSubject ou sabe criá-lo). A diferença para o Decorator é de intenção e de ciclo de vida: o Proxy tipicamente <strong>cria ou gerencia</strong> o alvo e decide se a chamada acontece; o Decorator recebe um alvo já pronto e <strong>acrescenta</strong> comportamento sempre.</p>
        <div class="callout"><strong>NA ENTREVISTA</strong> Se pedirem "um exemplo de Proxy que você usa todo dia": lazy loading de ORM. <code>order.customer</code> devolve um objeto que só dispara o SELECT no primeiro acesso a um campo. E o risco que vem junto: o N+1 e o erro de sessão fechada (<code>DetachedInstanceError</code>).</div>
      `
    },
    {
      id: 'virtual',
      title: 'Proxy virtual: lazy loading',
      body: `
        <pre><code class="language-python">from abc import ABC, abstractmethod


class Image(ABC):                           # Subject
    @abstractmethod
    def render(self) -&gt; str: ...


class DiskImage(Image):                     # RealSubject (caro de construir)
    def __init__(self, path: str) -&gt; None:
        print(f"carregando {path} do disco...")
        self._pixels = f"pixels({path})"
    def render(self) -&gt; str:
        return self._pixels


class LazyImage(Image):                     # Proxy virtual
    def __init__(self, path: str) -&gt; None:
        self._path = path
        self._real: DiskImage | None = None

    def render(self) -&gt; str:
        if self._real is None:
            self._real = DiskImage(self._path)
        return self._real.render()


gallery = [LazyImage(f"foto{i}.png") for i in range(1000)]   # instantâneo
print(gallery[3].render())     # só aqui carrega foto3
print(gallery[3].render())     # reutiliza</code></pre>
        <p>O custo de criar 1000 proxies é desprezível frente a 1000 imagens. O padrão paga quando a maioria dos objetos nunca é usada.</p>
        <p>Em Python o lazy puro costuma ser um <strong>descritor</strong> ou <code>cached_property</code>, sem classe proxy separada:</p>
        <pre><code class="language-python">from functools import cached_property


class Report:
    def __init__(self, path: str) -&gt; None:
        self.path = path

    @cached_property
    def rows(self) -&gt; list[str]:          # calculado no primeiro acesso, guardado em __dict__
        print("lendo arquivo...")
        with open(self.path, encoding="utf-8") as f:
            return f.read().splitlines()</code></pre>
        <div class="callout warn"><strong>PEGADINHA</strong> <code>cached_property</code> escreve no <code>__dict__</code> da instância: não funciona com <code>__slots__</code> sem <code>__dict__</code>. Em versões anteriores ao 3.12 usava um lock por propriedade, o que serializava threads; o lock foi removido no 3.12, então sob threads a função pode rodar mais de uma vez. Se isso importa, proteja explicitamente.</div>
      `
    },
    {
      id: 'protecao',
      title: 'Proxy de proteção e proxy dinâmico com __getattr__',
      body: `
        <p>Para controlar acesso a uma interface grande sem reescrever cada método, o proxy delega dinamicamente e intercepta o que interessa.</p>
        <pre><code class="language-python">class PermissionDenied(Exception): ...


class ProtectedAccount:
    """Proxy de proteção: só delega métodos permitidos ao papel do usuário."""
    _ALLOWED = {
        "viewer": {"balance"},
        "teller": {"balance", "deposit"},
        "admin":  {"balance", "deposit", "withdraw", "close"},
    }

    def __init__(self, account, role: str) -&gt; None:
        object.__setattr__(self, "_account", account)
        object.__setattr__(self, "_allowed", self._ALLOWED[role])

    def __getattr__(self, name: str):
        if name not in self._allowed:
            raise PermissionDenied(f"{name} proibido")
        return getattr(self._account, name)


class Account:
    def __init__(self) -&gt; None: self._b = 100
    def balance(self): return self._b
    def deposit(self, v): self._b += v
    def withdraw(self, v): self._b -= v
    def close(self): print("encerrada")


acc = ProtectedAccount(Account(), "teller")
acc.deposit(50)
print(acc.balance())
try:
    acc.withdraw(10)
except PermissionDenied as e:
    print("negado:", e)</code></pre>
        <p>Dois cuidados. Primeiro, <code>__getattr__</code> não intercepta métodos especiais chamados pelo interpretador (<code>len(proxy)</code>, <code>proxy[0]</code>, <code>with proxy</code>), então implemente os que precisar. Segundo, dentro do proxy use <code>object.__setattr__</code> para não disparar o próprio mecanismo de interceptação ao guardar estado interno.</p>
        <p>Proteção por proxy não é segurança de verdade em Python: o atributo <code>_account</code> continua acessível. Para fronteiras de confiança use processos, permissões do SO ou serviços separados. O proxy de proteção organiza regra de acesso, não impede um atacante com acesso ao interpretador.</p>
      `
    },
    {
      id: 'cache-remoto',
      title: 'Proxy de cache e proxy remoto',
      body: `
        <p>O proxy de cache esconde se o valor veio da memória ou da origem. Ele implementa a mesma interface do repositório real, então o cliente não muda.</p>
        <pre><code class="language-python">import time
from typing import Protocol


class UserRepo(Protocol):
    def get(self, user_id: int) -&gt; dict: ...


class SqlUserRepo:
    def get(self, user_id: int) -&gt; dict:
        print(f"SELECT user {user_id}")
        return {"id": user_id, "name": f"user{user_id}"}


class CachedUserRepo:
    def __init__(self, inner: UserRepo, ttl: float = 30.0) -&gt; None:
        self._inner, self._ttl = inner, ttl
        self._cache: dict[int, tuple[float, dict]] = {}

    def get(self, user_id: int) -&gt; dict:
        hit = self._cache.get(user_id)
        now = time.monotonic()
        if hit and now - hit[0] &lt; self._ttl:
            return hit[1]
        value = self._inner.get(user_id)
        self._cache[user_id] = (now, value)
        return value


repo: UserRepo = CachedUserRepo(SqlUserRepo())
repo.get(1); repo.get(1)      # um SELECT só</code></pre>
        <p>Invalidação é o problema difícil: TTL é simples mas serve dado velho; invalidar na escrita exige que o proxy veja as escritas (ou receba eventos). Decida conscientemente e documente a consistência oferecida.</p>
        <p><strong>Proxy remoto:</strong> o cliente chama um método local, o proxy serializa, envia pela rede e desserializa a resposta. A stdlib traz um exemplo mínimo:</p>
        <pre><code class="language-python"># servidor (um processo)
# from xmlrpc.server import SimpleXMLRPCServer
# srv = SimpleXMLRPCServer(("127.0.0.1", 8000))
# srv.register_function(pow)
# srv.serve_forever()

# cliente (outro processo): proxy remoto
from xmlrpc.client import ServerProxy

with ServerProxy("http://127.0.0.1:8000/") as remote:
    print(remote.pow(2, 10))          # parece chamada local, atravessa a rede</code></pre>
        <p>Stubs gRPC e clientes OpenAPI gerados fazem o mesmo em escala. O perigo é a ilusão de local: chamadas de rede falham, têm latência e timeouts. Um bom proxy remoto <strong>não esconde</strong> essas falhas (exceções distintas, timeouts explícitos), apenas a mecânica.</p>
      `
    },
    {
      id: 'weakref',
      title: 'Smart references: weakref.proxy e LocalProxy',
      body: `
        <p><code>weakref.proxy(obj)</code> devolve um proxy transparente que não mantém o objeto vivo. Quando o alvo é coletado, usar o proxy lança <code>ReferenceError</code>. Útil para evitar ciclos em caches e em ligações pai-filho.</p>
        <pre><code class="language-python">import weakref


class Node:
    def __init__(self, name: str) -&gt; None:
        self.name = name
        self.parent: weakref.ProxyType | None = None
        self.children: list["Node"] = []

    def add(self, child: "Node") -&gt; None:
        child.parent = weakref.proxy(self)     # sem ciclo forte
        self.children.append(child)


root = Node("raiz")
leaf = Node("folha")
root.add(leaf)
print(leaf.parent.name)      # raiz
del root
import gc; gc.collect()
try:
    print(leaf.parent.name)
except ReferenceError:
    print("o pai foi coletado")</code></pre>
        <p>Outro exemplo importante: <code>werkzeug.local.LocalProxy</code> (usado por <code>flask.request</code> e <code>flask.g</code>) é um proxy que, a cada acesso, resolve o objeto real a partir de um <code>ContextVar</code>. Por isso <code>request</code> é "global" mas diferente em cada requisição e thread. O mesmo mecanismo existe de forma mínima assim:</p>
        <pre><code class="language-python">from contextvars import ContextVar

_current_user: ContextVar[dict] = ContextVar("current_user")


class CurrentUser:
    def __getattr__(self, name: str):
        return _current_user.get()[name]


current_user = CurrentUser()           # importável em qualquer módulo

_current_user.set({"name": "Ana", "role": "admin"})
print(current_user.name)</code></pre>
        <div class="callout warn"><strong>PEGADINHA</strong> Proxies transparentes enganam <code>isinstance</code>, <code>type()</code> e serialização (pickle, JSON). Código que usa <code>type(x) is Foo</code> quebra; <code>isinstance</code> pode funcionar se o proxy expõe <code>__class__</code>. E o <code>LocalProxy</code> fora de um contexto ativo lança erro apenas no uso, longe de onde foi importado.</div>
      `
    },
    {
      id: 'orm-mock',
      title: 'Proxies no ecossistema: ORM, mocks e testes',
      body: `
        <ul>
          <li><strong>SQLAlchemy:</strong> relationships com <code>lazy="select"</code> (padrão) são carregadas no primeiro acesso via instrumentação de atributos (um proxy/descritor); <code>lazy="selectin"</code> ou <code>joinedload</code> trocam lazy por eager para evitar N+1. Em <code>asyncio</code>, lazy loading implícito não funciona e falha, o que força a escolha eager explícita.</li>
          <li><strong>Django ORM:</strong> <code>QuerySet</code> é um proxy lazy: nada vai ao banco até iterar, fatiar com passo, ou chamar <code>len/list/bool</code>. <code>select_related</code> e <code>prefetch_related</code> controlam o carregamento.</li>
          <li><strong>unittest.mock:</strong> <code>Mock</code> e <code>MagicMock</code> são proxies programáveis que registram chamadas; <code>create_autospec</code> copia a assinatura do alvo real e evita proxies que aceitam qualquer coisa.</li>
          <li><strong>multiprocessing.managers:</strong> <code>manager.dict()</code> devolve um proxy remoto para um objeto que vive no processo gerenciador.</li>
          <li><strong>pytest:</strong> <code>monkeypatch</code> e fixtures de rede substituem dependências por proxies de teste.</li>
        </ul>
        <pre><code class="language-python">from unittest.mock import create_autospec


class Payments:
    def charge(self, amount_cents: int, token: str) -&gt; str: ...


fake = create_autospec(Payments, instance=True)
fake.charge.return_value = "tx-1"

assert fake.charge(1000, "tok") == "tx-1"
fake.charge.assert_called_once_with(1000, "tok")
# fake.charge(1000)  -&gt; TypeError: assinatura nao bate (autospec protege)</code></pre>
        <p>Medição: para saber se um proxy de cache vale, meça taxa de acerto e latência com e sem ele. Uma taxa de acerto abaixo de uns 30% costuma não compensar a complexidade de invalidação, mas isso depende do custo da origem; meça no seu caso.</p>
      `
    },
    {
      id: 'decisao',
      title: 'Proxy versus Decorator, e quando dispensar',
      body: `
        <p>Em código Python as duas estruturas são quase indistinguíveis. Critério prático:</p>
        <table>
          <thead><tr><th></th><th>Decorator</th><th>Proxy</th></tr></thead>
          <tbody>
            <tr><td>Quem cria o alvo</td><td>O cliente passa um alvo pronto</td><td>O proxy pode criar ou localizar o alvo</td></tr>
            <tr><td>Objetivo</td><td>Acrescentar comportamento, empilhável</td><td>Controlar acesso (se, quando, onde)</td></tr>
            <tr><td>Empilhamento</td><td>Esperado</td><td>Raro</td></tr>
            <tr><td>Alvo pode nunca ser chamado</td><td>Não, sempre delega</td><td>Sim (negado, cache hit, lazy)</td></tr>
          </tbody>
        </table>
        <p>Dispense o Proxy quando:</p>
        <ul>
          <li><code>cached_property</code> ou <code>functools.cache</code> resolvem o lazy ou o cache sem uma classe extra.</li>
          <li>Um simples <code>if</code> de permissão no início da função é mais claro que um proxy de proteção.</li>
          <li>O cliente precisa saber que a chamada é remota (timeouts, retries, falhas parciais). Esconder isso gera bugs de produção; prefira um cliente explícito.</li>
          <li>A transparência perfeita é impossível: serialização, <code>isinstance</code> e identidade sempre vazam. Se muita coisa depende disso, o proxy é frágil.</li>
        </ul>
        <div class="callout tip"><strong>DICA</strong> Todo proxy "mágico" via <code>__getattr__</code> deve ter um teste que garanta que o <em>proxy e o alvo expõem a mesma interface</em>. Sem isso, uma renomeação no alvo quebra o cliente apenas em tempo de execução, e só quando aquele caminho for exercitado.</div>
      `
    }
  ],
  whenToUse: [
    'Objeto caro de criar usado raramente (conexões, modelos, arquivos grandes): proxy virtual',
    'Controle de acesso por papel sobre uma interface existente: proxy de proteção',
    'Cliente de serviço remoto que deve parecer local (com falhas explícitas): proxy remoto',
    'Cache transparente na frente de um repositório ou API lenta',
    'Referência indireta ao contexto atual (requisição, usuário, tenant) via ContextVar'
  ],
  whenNot: [
    'Quando cached_property, functools.cache ou um if simples resolvem',
    'Quando esconder a rede gera falsa sensação de localidade (latência e falha precisam ser visíveis)',
    'Quando código depende de type() ou identidade do objeto real',
    'Quando o proxy vira uma segunda implementação divergente do objeto real',
    'Como mecanismo de segurança: em Python o objeto interno continua acessível'
  ],
  metrics: [
    'Taxa de acerto e latência p50/p95 do proxy de cache (com e sem)',
    'Contagem de queries por requisição (django-debug-toolbar, SQLAlchemy echo) para pegar N+1',
    'create_autospec: garante que mocks respeitam a assinatura do alvo',
    'tracemalloc / sys.getsizeof: custo de memória do lazy versus eager',
    'Teste de equivalência de interface entre proxy e alvo'
  ],
  refs: [
    { type: 'portal', title: 'Proxy, refactoring.guru', author: 'Alexander Shvets', url: 'https://refactoring.guru/design-patterns/proxy', note: 'Os tipos de proxy com diagramas e pseudocódigo.' },
    { type: 'portal', title: 'Design Patterns in Python', author: 'Brandon Rhodes', url: 'https://python-patterns.guide/', note: 'Contexto pythônico dos padrões estruturais do GoF.' },
    { type: 'doc', title: 'weakref, referências fracas', author: 'Python Software Foundation', url: 'https://docs.python.org/3/library/weakref.html', note: 'weakref.proxy e ref, com as ressalvas de coleta.' },
    { type: 'doc', title: 'Context Locals (Werkzeug)', author: 'Pallets', url: 'https://werkzeug.palletsprojects.com/en/stable/local/', note: 'Como LocalProxy funciona por trás de flask.request.' },
    { type: 'doc', title: 'unittest.mock.create_autospec', author: 'Python Software Foundation', url: 'https://docs.python.org/3/library/unittest.mock.html#unittest.mock.create_autospec', note: 'Proxy de teste que respeita a assinatura real.' },
    { type: 'doc', title: 'SQLAlchemy, Relationship Loading Techniques', author: 'SQLAlchemy', url: 'https://docs.sqlalchemy.org/en/20/orm/queryguide/relationships.html', note: 'Lazy versus eager loading na prática.' },
    { type: 'livro', title: 'Design Patterns: Elements of Reusable Object-Oriented Software', author: 'Gamma, Helm, Johnson, Vlissides (GoF)', url: 'https://www.informit.com/store/design-patterns-elements-of-reusable-object-oriented-9780201633610', note: 'Definição dos quatro tipos de proxy.' },
    { type: 'artigo', title: 'Design Patterns in Dynamic Languages', author: 'Peter Norvig', url: 'https://norvig.com/design-patterns/', note: 'Proxy e outros padrões simplificados por recursos dinâmicos.' }
  ]
};

/* ===================== 40. COMPOSITE ===================== */
window.LESSON_CONTENT['composite'] = {
  id: 'composite',
  title: 'Composite',
  etapa: 7, etapaName: 'Design patterns estruturais',
  time: '40 min',
  tags: ['estrutural', 'árvores', 'recursão', 'parte-todo'],
  tagline: 'Tratar um objeto e um <em>grupo de objetos</em> pela mesma interface: árvores sem <code>isinstance</code> em todo lugar.',
  intro: `
    <p>Sistemas de arquivos, menus, árvores de AST, componentes de UI, estruturas organizacionais, regras compostas de validação, planilhas de preços com kits e itens: tudo é parte-todo. O Composite define uma interface comum para itens individuais (folhas) e para contêineres (compostos) que guardam outros itens, de modo que o cliente trata os dois uniformemente. Pedir o tamanho de um arquivo ou de um diretório inteiro é a mesma chamada.</p>
    <p>Sem o padrão, o código cliente espalha <code>if isinstance(x, Folder)</code> e recursão manual em cada operação. Com ele, a recursão fica encapsulada no composto, e adicionar uma operação ou um novo tipo de nó não força o cliente a mudar.</p>
    <p>Em Python o padrão combina com <code>Protocol</code>, <code>__iter__</code>, geradores recursivos (<code>yield from</code>) e <code>functools.singledispatch</code>. Também vale conhecer o limite: árvores profundas esbarram no limite de recursão do interpretador.</p>
  `,
  sections: [
    {
      id: 'intencao',
      title: 'Intenção e participantes (GoF)',
      body: `
        <p>Intenção do GoF: <em>compor objetos em estruturas de árvore para representar hierarquias parte-todo. Composite permite que os clientes tratem objetos individuais e composições de objetos de maneira uniforme.</em></p>
        <table>
          <thead><tr><th>Participante</th><th>Papel</th><th>Exemplo (arquivos)</th></tr></thead>
          <tbody>
            <tr><td>Component</td><td>Interface comum, define operações compartilhadas</td><td><code>FsNode.size()</code></td></tr>
            <tr><td>Leaf</td><td>Nó sem filhos, faz o trabalho</td><td><code>File</code></td></tr>
            <tr><td>Composite</td><td>Guarda filhos e delega a eles</td><td><code>Directory</code></td></tr>
            <tr><td>Client</td><td>Usa Component, sem saber se é folha ou composto</td><td>Quem pede o tamanho total</td></tr>
          </tbody>
        </table>
        <p>Existe um dilema de projeto conhecido: onde ficam <code>add</code> e <code>remove</code>? Em <strong>transparência</strong>, tudo no Component (folha lança erro ao adicionar); em <strong>segurança</strong>, só no Composite (cliente precisa saber o tipo para adicionar). Em Python a segunda costuma ser a melhor: o Component define as operações de leitura/travessia, e só o composto expõe mutação.</p>
        <div class="callout"><strong>NA ENTREVISTA</strong> Composite aparece como "modele um sistema de arquivos" ou "calcule o preço de um combo que contém combos". O que o entrevistador quer ver: uma interface única, recursão no composto, e você apontando o risco de ciclos e de profundidade.</div>
      `
    },
    {
      id: 'classico',
      title: 'Implementação clássica',
      body: `
        <pre><code class="language-python">from __future__ import annotations
from abc import ABC, abstractmethod


class FsNode(ABC):                              # Component
    def __init__(self, name: str) -&gt; None:
        self.name = name

    @abstractmethod
    def size(self) -&gt; int: ...

    @abstractmethod
    def render(self, indent: int = 0) -&gt; str: ...


class File(FsNode):                             # Leaf
    def __init__(self, name: str, nbytes: int) -&gt; None:
        super().__init__(name)
        self._nbytes = nbytes

    def size(self) -&gt; int:
        return self._nbytes

    def render(self, indent: int = 0) -&gt; str:
        return " " * indent + f"{self.name} ({self._nbytes} B)"


class Directory(FsNode):                        # Composite
    def __init__(self, name: str) -&gt; None:
        super().__init__(name)
        self._children: list[FsNode] = []

    def add(self, node: FsNode) -&gt; Directory:
        self._children.append(node)
        return self

    def size(self) -&gt; int:
        return sum(c.size() for c in self._children)

    def render(self, indent: int = 0) -&gt; str:
        lines = [" " * indent + f"{self.name}/ ({self.size()} B)"]
        lines += [c.render(indent + 2) for c in self._children]
        return "\\n".join(lines)


root = (Directory("src")
        .add(File("main.py", 1200))
        .add(Directory("utils").add(File("io.py", 800)).add(File("log.py", 300))))
print(root.size())      # 2300, mesma chamada para arquivo ou diretório
print(root.render())</code></pre>
        <p>A recursão mora em <code>Directory.size</code>. O cliente nunca pergunta o tipo. Observe o <em>fluent interface</em> em <code>add</code> para montar a árvore de forma declarativa.</p>
      `
    },
    {
      id: 'pythonico',
      title: 'Forma pythônica: iteração, yield from e dataclasses',
      body: `
        <p>Uma operação de travessia genérica em geradores evita duplicar recursão para cada operação nova.</p>
        <pre><code class="language-python">from __future__ import annotations
from dataclasses import dataclass, field
from typing import Iterator


@dataclass
class Node:
    name: str
    size: int = 0
    children: list[Node] = field(default_factory=list)

    def walk(self, depth: int = 0) -&gt; Iterator[tuple[int, Node]]:
        yield depth, self
        for child in self.children:
            yield from child.walk(depth + 1)

    @property
    def total(self) -&gt; int:
        return self.size + sum(c.total for c in self.children)

    def __iter__(self) -&gt; Iterator[Node]:
        return (n for _, n in self.walk())


tree = Node("src", children=[Node("main.py", 1200), Node("utils", children=[Node("io.py", 800)])])

for depth, node in tree.walk():
    print("  " * depth + node.name)

big = [n.name for n in tree if n.size &gt; 1000]
print(big, tree.total)</code></pre>
        <p>Aqui folha e composto são a mesma classe (lista de filhos vazia vale como folha). Em Python isso costuma ser mais simples que duas classes, e funciona bem para dados. Use classes separadas quando folhas e compostos têm <em>comportamento</em> realmente diferente.</p>
        <p>Árvores muito profundas estouram a recursão (limite padrão perto de mil frames, ajustável com <code>sys.setrecursionlimit</code> mas com risco). Para profundidade arbitrária, faça a travessia iterativa com pilha explícita:</p>
        <pre><code class="language-python">def walk_iter(root: Node):
    stack = [(0, root)]
    while stack:
        depth, node = stack.pop()
        yield depth, node
        stack.extend((depth + 1, c) for c in reversed(node.children))</code></pre>
        <p><code>pathlib</code> é um bom exemplo prático: <code>Path.rglob("*.py")</code> percorre a hierarquia, e <code>Path.walk()</code> (3.12+) devolve a travessia em estilo <code>os.walk</code>.</p>
      `
    },
    {
      id: 'exemplos',
      title: 'Exemplos reais: regras compostas, AST, UI',
      body: `
        <p><strong>Regras de validação compostas.</strong> Um dos usos mais úteis: regras que se combinam com <code>and</code>, <code>or</code> e <code>not</code> mantendo a interface de uma regra simples.</p>
        <pre><code class="language-python">from typing import Callable, Protocol


class Rule(Protocol):
    def __call__(self, value: str) -&gt; bool: ...


def min_len(n: int) -&gt; Rule:
    return lambda v: len(v) &gt;= n


def has_digit(v: str) -&gt; bool:
    return any(ch.isdigit() for ch in v)


def all_of(*rules: Rule) -&gt; Rule:          # Composite: uma regra feita de regras
    return lambda v: all(r(v) for r in rules)


def any_of(*rules: Rule) -&gt; Rule:
    return lambda v: any(r(v) for r in rules)


password_ok = all_of(min_len(8), any_of(has_digit, lambda v: "!" in v))
print(password_ok("abcdefg1"), password_ok("abcdefg"))   # True False</code></pre>
        <p>Como as regras são funções, o Composite virou um combinador. É o mesmo princípio de <code>re</code> compondo padrões, de <code>pytest</code> compondo marcadores e de <code>django.db.models.Q</code> compondo filtros com <code>|</code> e <code>&amp;</code>.</p>
        <p>Outros Composites que você usa:</p>
        <ul>
          <li><strong>AST do módulo <code>ast</code></strong>: cada nó tem filhos, e <code>ast.walk</code> e <code>ast.NodeVisitor</code> percorrem a árvore.</li>
          <li><strong>Django forms, admin e templates</strong>: formulários contêm campos e formsets contêm formulários; templates são árvores de nós renderizados recursivamente.</li>
          <li><strong>Interfaces gráficas</strong>: widgets em Tk e Qt contêm widgets; <code>render()</code> desce pela árvore.</li>
          <li><strong>JSON/YAML</strong>: dict e list aninhados são uma árvore, e a travessia genérica é um Composite implícito.</li>
          <li><strong>Pedidos com kits</strong>: um item pode ser um produto ou um kit de produtos; o preço total é recursivo.</li>
        </ul>
        <div class="callout tip"><strong>DICA</strong> Para operações novas sobre a árvore sem editar as classes de nó, use Visitor ou <code>functools.singledispatch</code> (veja a lição de Iterator, Visitor e Mediator). Composite resolve a estrutura, Visitor resolve operações novas.</div>
      `
    },
    {
      id: 'armadilhas',
      title: 'Armadilhas: ciclos, pai, mutação e profundidade',
      body: `
        <ul>
          <li><strong>Ciclos:</strong> adicionar um nó como descendente de si mesmo causa recursão infinita. Valide em <code>add</code> (checando ancestrais) ou garanta imutabilidade.</li>
          <li><strong>Referência ao pai:</strong> navegar para cima é útil (caminho completo, herança de configuração), mas cria ciclo de referências. Use <code>weakref.ref</code> para o pai se a árvore precisa ser coletada de forma previsível, ou calcule o caminho na travessia.</li>
          <li><strong>Mutação durante travessia:</strong> alterar <code>children</code> enquanto itera dá resultados inconsistentes. Itere sobre cópia (<code>list(children)</code>) ou trabalhe com estruturas imutáveis (tuplas e <code>frozen=True</code>).</li>
          <li><strong>Custo de recomputar:</strong> <code>size</code> recursivo em cada chamada é O(n). Se é pedido com frequência, cacheie e invalide na mutação, ou mantenha o agregado atualizado ao adicionar.</li>
          <li><strong>Interface inchada:</strong> forçar toda operação no Component faz folhas implementarem métodos que não fazem sentido. Mantenha o Component enxuto.</li>
          <li><strong>Profundidade:</strong> recursão do Python tem limite. Em árvores profundas (ex.: parser de input não confiável), use pilha explícita ou imponha limite de profundidade (também uma defesa contra input malicioso).</li>
        </ul>
        <pre><code class="language-python">def safe_add(parent: "Node", child: "Node") -&gt; None:
    # evita ciclo: child não pode conter parent entre seus descendentes
    if any(n is parent for _, n in child.walk()):
        raise ValueError("ciclo detectado")
    parent.children.append(child)</code></pre>
        <p>Complexidade típica: travessia completa em <code>O(n)</code> nós, memória <code>O(h)</code> na recursão (altura) ou <code>O(n)</code> no pior caso com pilha explícita em árvore larga.</p>
      `
    },
    {
      id: 'desnecessario',
      title: 'Quando é desnecessário em Python',
      body: `
        <p>Duas razões fazem o Composite encolher em Python:</p>
        <ul>
          <li><strong>Duck typing:</strong> não é preciso declarar um Component. Basta que folhas e compostos tenham o mesmo método. Muitas árvores viram uma única classe com lista de filhos, como no exemplo com <code>dataclass</code>.</li>
          <li><strong>Funções e dicts:</strong> para dados hierárquicos simples, <code>dict</code>/<code>list</code> aninhados com uma função recursiva (ou <code>match</code>/<code>case</code>) resolvem sem classes.</li>
        </ul>
        <pre><code class="language-python">def total(node) -&gt; int:
    match node:
        case int(n):
            return n
        case list(items):
            return sum(total(i) for i in items)
        case dict(d):
            return sum(total(v) for v in d.values())
        case _:
            return 0


print(total({"a": 1, "b": [2, 3, {"c": 4}]}))   # 10</code></pre>
        <p>Use o Composite completo (classes, interface, operações polimórficas) quando há <strong>comportamento</strong> distinto por tipo de nó e vários clientes que se beneficiam da uniformidade. Para uma árvore de dados com uma ou duas travessias, a função recursiva é mais direta e mais legível.</p>
      `
    }
  ],
  whenToUse: [
    'Hierarquias parte-todo: arquivos, menus, organogramas, componentes de UI, kits de produtos',
    'Clientes devem tratar nós individuais e grupos de forma idêntica',
    'Regras ou filtros que se combinam recursivamente (and/or/not)',
    'Operações recursivas (total, render, validar) repetidas em muitos lugares',
    'Estruturas em que novos tipos de nó surgem e o cliente não deve mudar'
  ],
  whenNot: [
    'Dados aninhados simples: dict/list com função recursiva ou match/case bastam',
    'Quando folhas e compostos têm interfaces muito diferentes (forçar uniformidade piora o design)',
    'Quando a estrutura é plana e não há hierarquia real',
    'Quando a profundidade pode ser grande ou controlada por input externo sem limites',
    'Quando você precisa de muitas operações novas sobre a árvore: prefira Visitor/singledispatch'
  ],
  metrics: [
    'Teste com árvore de profundidade 1, 2 e 1000 (recursão) e com árvore vazia',
    'Teste de ciclo: adicionar um nó como filho de seu descendente deve falhar',
    'sys.getrecursionlimit() e testes de estresse para profundidade',
    'tracemalloc para custo de memória da árvore e de referências ao pai',
    'Propriedade (hypothesis): total do composto igual à soma das folhas'
  ],
  refs: [
    { type: 'portal', title: 'Composite, refactoring.guru', author: 'Alexander Shvets', url: 'https://refactoring.guru/design-patterns/composite', note: 'Estrutura, aplicabilidade e o dilema transparência versus segurança.' },
    { type: 'portal', title: 'The Composite Pattern, Python Patterns Guide', author: 'Brandon Rhodes', url: 'https://python-patterns.guide/gang-of-four/composite/', note: 'Visão pythônica do padrão e quando a linguagem o torna trivial.' },
    { type: 'livro', title: 'Design Patterns: Elements of Reusable Object-Oriented Software', author: 'Gamma, Helm, Johnson, Vlissides (GoF)', url: 'https://www.informit.com/store/design-patterns-elements-of-reusable-object-oriented-9780201633610', note: 'Fonte original, com a discussão de onde declarar add e remove.' },
    { type: 'livro', title: 'Head First Design Patterns, 2nd ed.', author: 'Eric Freeman, Elisabeth Robson', url: 'https://www.oreilly.com/library/view/head-first-design/9781492077992/', note: 'O exemplo de menus compostos é uma introdução ao padrão.' },
    { type: 'doc', title: 'ast, Abstract Syntax Trees', author: 'Python Software Foundation', url: 'https://docs.python.org/3/library/ast.html', note: 'Um Composite real, com NodeVisitor e ast.walk.' },
    { type: 'doc', title: 'pathlib, Path.walk e rglob', author: 'Python Software Foundation', url: 'https://docs.python.org/3/library/pathlib.html', note: 'Travessia hierárquica na stdlib.' },
    { type: 'doc', title: 'PEP 634, Structural Pattern Matching', author: 'Brandt Bucher, Guido van Rossum', url: 'https://peps.python.org/pep-0634/', note: 'A base do match/case para dados em árvore.' },
    { type: 'artigo', title: 'Design Patterns in Dynamic Languages', author: 'Peter Norvig', url: 'https://norvig.com/design-patterns/', note: 'Como tipagem dinâmica reduz a cerimônia de vários padrões.' }
  ]
};

/* ===================== 41. BRIDGE E FLYWEIGHT ===================== */
window.LESSON_CONTENT['bridge-flyweight'] = {
  id: 'bridge-flyweight',
  title: 'Bridge e Flyweight',
  etapa: 7, etapaName: 'Design patterns estruturais',
  time: '60 min',
  tags: ['estrutural', 'composição', 'memória', 'interning'],
  tagline: 'Duas ideias de escala: <em>separar</em> abstração de implementação (Bridge) e <em>compartilhar</em> estado repetido (Flyweight).',
  intro: `
    <p>Bridge e Flyweight raramente são ensinados juntos, mas atacam problemas de crescimento. O Bridge ataca a explosão de classes em duas dimensões (formas x renderizadores, notificações x canais) separando a hierarquia de abstração da hierarquia de implementação e ligando-as por composição. O Flyweight ataca a explosão de memória: quando milhões de objetos repetem a mesma informação, compartilha-se a parte repetida (estado intrínseco) e passa-se a parte variável (extrínseca) por parâmetro.</p>
    <p>Em Python, o Bridge é o princípio "composição em vez de herança" com um Protocol; o Flyweight já está embutido na linguagem em várias formas: interning de strings, inteiros pequenos cacheados, <code>__slots__</code>, <code>sys.intern</code> e <code>functools.lru_cache</code> como fábrica de objetos compartilhados.</p>
    <p>Esta lição traz as duas formas clássicas, as pythônicas, e como medir de verdade o ganho do Flyweight com <code>tracemalloc</code>, em vez de supor.</p>
  `,
  sections: [
    {
      id: 'bridge-intencao',
      title: 'Bridge: intenção e participantes',
      body: `
        <p>Intenção do GoF: <em>desacoplar uma abstração de sua implementação, para que as duas possam variar independentemente.</em></p>
        <p>O problema típico: você tem 3 tipos de notificação (alerta, aviso, relatório) e 4 canais (email, SMS, Slack, push). Por herança são 12 classes, e cada canal novo multiplica por 3. Com Bridge, são 3 + 4 classes, combinadas por composição.</p>
        <table>
          <thead><tr><th>Participante</th><th>Papel</th><th>Exemplo</th></tr></thead>
          <tbody>
            <tr><td>Abstraction</td><td>Interface de alto nível, guarda referência ao Implementor</td><td><code>Notification</code></td></tr>
            <tr><td>RefinedAbstraction</td><td>Variações da abstração</td><td><code>Alert</code>, <code>Digest</code></td></tr>
            <tr><td>Implementor</td><td>Interface das operações primitivas</td><td><code>Channel.deliver</code></td></tr>
            <tr><td>ConcreteImplementor</td><td>Implementações concretas</td><td><code>EmailChannel</code>, <code>SlackChannel</code></td></tr>
          </tbody>
        </table>
        <p>A "ponte" é a referência da abstração ao implementor. A diferença para o <strong>Adapter</strong>: o Adapter é aplicado depois, para encaixar interfaces que já existem e não casam; o Bridge é decisão de <em>projeto inicial</em>, para que as duas hierarquias evoluam separadas. Para o <strong>Strategy</strong>, a estrutura é quase igual, mas o Strategy troca um <em>algoritmo</em> dentro de um contexto; o Bridge separa duas dimensões estruturais de variação.</p>
        <div class="callout"><strong>NA ENTREVISTA</strong> "Qual a diferença entre Bridge e Strategy?" é pergunta recorrente. Resposta honesta: o diagrama é praticamente o mesmo, e a diferença é de intenção. Strategy: variar <em>como</em> uma tarefa é feita. Bridge: evitar produto cartesiano de subclasses entre duas dimensões de variação.</div>
      `
    },
    {
      id: 'bridge-codigo',
      title: 'Bridge: clássico e pythônico',
      body: `
        <pre><code class="language-python">from abc import ABC, abstractmethod


class Channel(ABC):                       # Implementor
    @abstractmethod
    def deliver(self, title: str, body: str) -&gt; None: ...


class EmailChannel(Channel):
    def deliver(self, title: str, body: str) -&gt; None:
        print(f"[email] {title}: {body}")


class SlackChannel(Channel):
    def deliver(self, title: str, body: str) -&gt; None:
        print(f"[slack] *{title}* {body}")


class Notification:                       # Abstraction
    def __init__(self, channel: Channel) -&gt; None:
        self._channel = channel           # a ponte

    def send(self, body: str) -&gt; None:
        self._channel.deliver(self.title(), body)

    def title(self) -&gt; str:
        return "Aviso"


class Alert(Notification):                # RefinedAbstraction
    def title(self) -&gt; str:
        return "ALERTA"

    def send(self, body: str) -&gt; None:
        super().send(body.upper())


Alert(SlackChannel()).send("disco cheio")
Notification(EmailChannel()).send("deploy concluido")</code></pre>
        <p>Em Python o Implementor quase sempre é um <code>Protocol</code> (ou até só um callable), e a hierarquia de abstração frequentemente nem precisa de subclasses: um parâmetro de configuração dá a variação.</p>
        <pre><code class="language-python">from dataclasses import dataclass
from typing import Callable, Protocol


class Channel(Protocol):
    def deliver(self, title: str, body: str) -&gt; None: ...


@dataclass(frozen=True)
class Notification:
    title: str
    channel: Channel
    transform: Callable[[str], str] = str      # variação por função

    def send(self, body: str) -&gt; None:
        self.channel.deliver(self.title, self.transform(body))


class PrintChannel:
    def deliver(self, title: str, body: str) -&gt; None:
        print(f"{title}: {body}")


alert = Notification("ALERTA", PrintChannel(), str.upper)
alert.send("disco cheio")</code></pre>
        <p>Exemplos reais de Bridge: drivers de banco do SQLAlchemy (a abstração <code>Engine</code>/<code>Session</code> separada do dialeto), backends do Matplotlib (a API de plotagem separada do renderizador Agg, SVG, PDF), backends de cache e e-mail do Django (<code>django.core.mail</code> troca o backend por configuração), e o módulo <code>logging</code> (Logger como abstração, Handler como implementação).</p>
      `
    },
    {
      id: 'flyweight-intencao',
      title: 'Flyweight: intenção e estado intrínseco versus extrínseco',
      body: `
        <p>Intenção do GoF: <em>usar compartilhamento para suportar eficientemente grandes quantidades de objetos de granularidade fina.</em></p>
        <p>A decomposição central: o <strong>estado intrínseco</strong> é invariável e independente do contexto (compartilhável: fonte, cor, textura, tipo de árvore); o <strong>estado extrínseco</strong> depende do contexto e é passado pelo cliente (posição x, y). Uma <strong>FlyweightFactory</strong> garante que um mesmo estado intrínseco gere um único objeto.</p>
        <pre><code class="language-python">from dataclasses import dataclass


@dataclass(frozen=True, slots=True)
class TreeType:                         # Flyweight: estado intrínseco, imutável
    name: str
    color: str
    texture: bytes                      # supomos pesado


class TreeFactory:                      # FlyweightFactory
    _cache: dict[tuple[str, str], TreeType] = {}

    @classmethod
    def get(cls, name: str, color: str) -&gt; TreeType:
        key = (name, color)
        if key not in cls._cache:
            cls._cache[key] = TreeType(name, color, texture=bytes(10_000))
        return cls._cache[key]


@dataclass(slots=True)
class Tree:                             # contexto: só estado extrínseco + referência
    x: int
    y: int
    kind: TreeType


forest = [Tree(i, i * 2, TreeFactory.get("carvalho", "verde")) for i in range(100_000)]
print(len({id(t.kind) for t in forest}))    # 1 só TreeType compartilhado</code></pre>
        <p>Sem o Flyweight, cada <code>Tree</code> carregaria sua cópia de 10 KB de textura: cerca de 1 GB para cem mil árvores. Com ele, o custo por árvore cai para os campos próprios mais um ponteiro. A condição de segurança é a <strong>imutabilidade</strong> do estado compartilhado: se alguém altera um flyweight, altera todos.</p>
      `
    },
    {
      id: 'flyweight-python',
      title: 'Flyweight embutido em Python e como medir',
      body: `
        <p>O Python já usa o conceito em vários lugares:</p>
        <ul>
          <li><strong>Interning de strings:</strong> identificadores e literais curtos são internados; <code>sys.intern(s)</code> força o compartilhamento (útil em milhões de chaves repetidas, como nomes de colunas ou categorias).</li>
          <li><strong>Inteiros pequenos e singletons:</strong> a implementação CPython mantém um cache de inteiros pequenos (de -5 a 256), e <code>None</code>, <code>True</code>, <code>False</code> são singletons. É detalhe de implementação, não contrato da linguagem.</li>
          <li><strong><code>__slots__</code> / <code>slots=True</code>:</strong> elimina o <code>__dict__</code> por instância e reduz muito a memória por objeto pequeno.</li>
          <li><strong><code>functools.lru_cache</code> / <code>cache</code>:</strong> uma fábrica de objetos compartilhados por argumentos hashable.</li>
          <li><strong><code>enum</code></strong>: membros são singletons, flyweights naturais.</li>
        </ul>
        <pre><code class="language-python">from functools import cache
import sys


@cache
def make_style(font: str, size: int, bold: bool) -&gt; tuple[str, int, bool]:
    return (font, size, bold)            # mesma tupla devolvida para os mesmos argumentos


a = make_style("Inter", 12, False)
b = make_style("Inter", 12, False)
print(a is b)                            # True

labels = [sys.intern("pendente") for _ in range(5)]
print(len({id(x) for x in labels}))      # 1</code></pre>
        <p><strong>Meça, não suponha.</strong> O ganho do Flyweight depende do tamanho do estado compartilhável e da taxa de repetição.</p>
        <pre><code class="language-python">import tracemalloc
from dataclasses import dataclass


@dataclass
class Plain:                    # sem slots, com dict por instância
    x: int
    y: int
    color: str


@dataclass(slots=True)
class Slotted:                  # com slots
    x: int
    y: int
    color: str


def measure(factory) -&gt; int:
    tracemalloc.start()
    data = [factory(i, i, "azul") for i in range(200_000)]
    current, _peak = tracemalloc.get_traced_memory()
    tracemalloc.stop()
    return current


print("plain  :", measure(Plain) // 1024, "KiB")
print("slotted:", measure(Slotted) // 1024, "KiB")</code></pre>
        <p>Em CPython moderno, <code>slots=True</code> tipicamente reduz a memória de objetos pequenos de forma significativa (frequentemente na faixa de 30% a mais da metade, dependendo dos campos), mas o número exato muda com a versão e o conteúdo: rode o experimento no seu interpretador. Para dados numéricos em massa, o salto real vem de sair dos objetos Python: arrays NumPy, <code>array.array</code>, colunas Arrow ou Polars guardam o estado de forma densa, o que é o Flyweight levado ao limite.</p>
        <div class="callout warn"><strong>PEGADINHA</strong> Um cache de flyweights sem limite vira vazamento de memória. Use <code>weakref.WeakValueDictionary</code> para a fábrica (os flyweights somem quando ninguém os usa) ou <code>lru_cache(maxsize=...)</code>. E se o flyweight é mutável, o compartilhamento causa bugs de aliasing: congele com <code>frozen=True</code> ou use tuplas.</div>
        <pre><code class="language-python">import weakref


class Glyph:
    __slots__ = ("char", "font", "__weakref__")
    _pool: "weakref.WeakValueDictionary[tuple[str, str], Glyph]" = weakref.WeakValueDictionary()

    def __new__(cls, char: str, font: str):
        key = (char, font)
        obj = cls._pool.get(key)
        if obj is None:
            obj = super().__new__(cls)
            obj.char, obj.font = char, font
            cls._pool[key] = obj
        return obj


assert Glyph("a", "Inter") is Glyph("a", "Inter")</code></pre>
      `
    },
    {
      id: 'bridge-decisao',
      title: 'Bridge: quando usar e quando dispensar',
      body: `
        <p>Resumo de decisão para o Bridge:</p>
        <ul>
          <li>Use quando há duas (ou mais) dimensões independentes de variação e você começaria a ver nomes como <code>PdfEmailReport</code>, <code>PdfSlackReport</code>.</li>
          <li>Dispense quando só há uma dimensão de variação. Um Protocol e uma injeção resolvem, e chamar isso de Bridge é rótulo, não decisão.</li>
          <li>Em Python o equivalente costuma ser composição com Protocol ou um dict de callables, sem classes de abstração refinada.</li>
        </ul>
      `
    },
    {
      id: 'flyweight-decisao',
      title: 'Flyweight: quando usar e quando dispensar',
      body: `
        <p>Resumo de decisão para o Flyweight:</p>
        <ul>
          <li>Use quando há muitos objetos (centenas de milhares ou mais), com grande parte do estado repetido e imutável, e <strong>medição</strong> mostrando que a memória é o gargalo.</li>
          <li>Dispense quando o número de objetos é pequeno, quando o estado compartilhável é minúsculo, ou quando <code>slots=True</code>, <code>sys.intern</code> ou uma estrutura colunar já resolvem. É uma otimização, e otimização prematura aqui custa legibilidade: a separação intrínseco/extrínseco complica a API.</li>
          <li>Cuidado com threads: a fábrica compartilhada precisa de lock ou de construção idempotente. Com free-threading experimental no 3.13 e suportado a partir do 3.14 como opção de build, estruturas compartilhadas mutáveis merecem atenção redobrada. Se for criar flyweights concorrentemente, proteja a fábrica.</li>
        </ul>
        <p>A conexão com Norvig: para Bridge e Flyweight, a dinâmica da linguagem muda pouco o <em>problema</em>, mas muda a <em>forma</em>. Funções de primeira classe substituem as classes de implementação, e <code>lru_cache</code> substitui a fábrica manual.</p>
        <div class="callout tip"><strong>DICA</strong> Antes de implementar um Flyweight, rode <code>tracemalloc</code> ou <code>objgraph</code> no cenário real e veja onde a memória está. Muitas vezes o problema é uma lista de dicts de 1 milhão de linhas que um DataFrame, um <code>array.array</code> ou <code>slots=True</code> resolve com uma linha.</div>
      `
    }
  ],
  whenToUse: [
    'Bridge: duas dimensões independentes de variação ameaçando criar produto cartesiano de classes',
    'Bridge: trocar a implementação (driver, canal, renderizador) por configuração ou em runtime',
    'Flyweight: milhões de objetos com estado repetido e imutável e memória medida como gargalo',
    'Flyweight: fábrica de objetos de valor compartilháveis (estilos, glifos, tipos, símbolos)',
    'Sempre: medir antes de otimizar memória e documentar a imutabilidade do estado compartilhado'
  ],
  whenNot: [
    'Bridge com uma única dimensão de variação: um Protocol e injeção bastam',
    'Flyweight sem medição de memória: slots, intern ou estruturas colunares resolvem mais simples',
    'Flyweight com estado mutável compartilhado (bugs de aliasing)',
    'Fábrica de flyweights sem limite ou sem referência fraca (vazamento de memória)',
    'Quando a separação intrínseco/extrínseco torna a API do domínio confusa para ganho pequeno'
  ],
  metrics: [
    'tracemalloc e sys.getsizeof (com ressalvas: não segue referências) para medir memória',
    'objgraph / pympler para contar instâncias e ver quem as retém',
    'timeit para custo de criação com e sem cache de fábrica',
    'dataclass(slots=True, frozen=True): reduz memória e garante imutabilidade',
    'weakref.WeakValueDictionary ou lru_cache(maxsize) para limitar o pool'
  ],
  refs: [
    { type: 'portal', title: 'Bridge, refactoring.guru', author: 'Alexander Shvets', url: 'https://refactoring.guru/design-patterns/bridge', note: 'Explica o Bridge com o exemplo clássico de formas e cores.' },
    { type: 'portal', title: 'Flyweight, refactoring.guru', author: 'Alexander Shvets', url: 'https://refactoring.guru/design-patterns/flyweight', note: 'Estado intrínseco e extrínseco com o exemplo da floresta.' },
    { type: 'portal', title: 'The Flyweight Pattern, Python Patterns Guide', author: 'Brandon Rhodes', url: 'https://python-patterns.guide/gang-of-four/flyweight/', note: 'Mostra o Flyweight embutido em Python (interning, singletons).' },
    { type: 'doc', title: 'tracemalloc, trace memory allocations', author: 'Python Software Foundation', url: 'https://docs.python.org/3/library/tracemalloc.html', note: 'A ferramenta para medir o ganho real de memória.' },
    { type: 'doc', title: 'dataclasses, slots e frozen', author: 'Python Software Foundation', url: 'https://docs.python.org/3/library/dataclasses.html', note: 'Parâmetros slots=True e frozen=True usados no Flyweight.' },
    { type: 'doc', title: 'weakref.WeakValueDictionary', author: 'Python Software Foundation', url: 'https://docs.python.org/3/library/weakref.html#weakref.WeakValueDictionary', note: 'Pool de flyweights que não vaza memória.' },
    { type: 'livro', title: 'Design Patterns: Elements of Reusable Object-Oriented Software', author: 'Gamma, Helm, Johnson, Vlissides (GoF)', url: 'https://www.informit.com/store/design-patterns-elements-of-reusable-object-oriented-9780201633610', note: 'Fonte original de Bridge e Flyweight.' },
    { type: 'livro', title: 'High Performance Python, 2nd ed.', author: 'Micha Gorelick, Ian Ozsvald', url: 'https://www.oreilly.com/library/view/high-performance-python/9781492055013/', note: 'Medição de memória e estruturas compactas em Python.' }
  ]
};

/* ===================== 42. STRATEGY ===================== */
window.LESSON_CONTENT['strategy'] = {
  id: 'strategy',
  title: 'Strategy',
  etapa: 8, etapaName: 'Design patterns comportamentais',
  time: '45 min',
  tags: ['comportamental', 'funções de primeira classe', 'Protocol', 'dict dispatch'],
  tagline: 'Algoritmos intercambiáveis. Em Python, muitas vezes a estratégia é <em>só uma função</em> e o padrão some.',
  intro: `
    <p>O Strategy é o exemplo favorito de Norvig e dos livros de Python para mostrar como funções de primeira classe simplificam o GoF. A ideia: você tem uma família de algoritmos (calcular frete, ordenar, comprimir, precificar, autenticar), encapsula cada um e os torna intercambiáveis, de modo que o cliente escolhe qual usar sem mudar o código que os executa.</p>
    <p>Em Java isso exige uma interface, N classes e uma classe de contexto. Em Python, <code>sorted(items, key=...)</code> já é Strategy: o <code>key</code> é a estratégia. Esta lição mostra a forma clássica (para você reconhecê-la em código legado e em entrevistas), a forma de funções, o uso de <code>Protocol</code> quando a estratégia tem estado, e o dict de callables como registro de estratégias. Também trata o ponto sutil: quando uma estratégia precisa de estado ou de múltiplos métodos, volta-se a usar classe.</p>
  `,
  sections: [
    {
      id: 'intencao',
      title: 'Intenção e participantes (GoF)',
      body: `
        <p>Intenção do GoF: <em>definir uma família de algoritmos, encapsular cada um e torná-los intercambiáveis. Strategy permite que o algoritmo varie independentemente dos clientes que o utilizam.</em></p>
        <table>
          <thead><tr><th>Participante</th><th>Papel</th><th>Exemplo (frete)</th></tr></thead>
          <tbody>
            <tr><td>Strategy</td><td>Interface comum dos algoritmos</td><td><code>ShippingStrategy.cost(order)</code></td></tr>
            <tr><td>ConcreteStrategy</td><td>Cada algoritmo</td><td><code>Sedex</code>, <code>PAC</code>, <code>FreteGratis</code></td></tr>
            <tr><td>Context</td><td>Configurado com uma Strategy, delega a ela</td><td><code>Checkout</code></td></tr>
          </tbody>
        </table>
        <p>O benefício central é eliminar cadeias de <code>if/elif</code> sobre o "tipo" do algoritmo, espalhadas por vários lugares, e respeitar Open/Closed: nova estratégia é novo código, sem editar o contexto. O contexto não conhece os algoritmos concretos, só o contrato.</p>
        <div class="callout"><strong>NA ENTREVISTA</strong> Pergunta-chave: "como você implementaria isso em Python?". A resposta de sênior: "uma função (ou callable), e um dict para o registro. Uso classe só se a estratégia tem estado ou mais de um método". Cite <code>sorted(key=...)</code>, <code>max(key=...)</code> e <code>logging.Formatter</code>.</div>
      `
    },
    {
      id: 'classico',
      title: 'Antes e depois: do if/elif para Strategy',
      body: `
        <p><strong>Antes:</strong> o frete é decidido por uma cadeia condicional que cresce a cada transportadora.</p>
        <pre><code class="language-python"># ruim: cada nova regra mexe neste método
class Checkout:
    def __init__(self, shipping: str) -&gt; None:
        self.shipping = shipping

    def shipping_cost(self, weight_kg: float, distance_km: float) -&gt; float:
        if self.shipping == "sedex":
            return 20 + weight_kg * 3 + distance_km * 0.05
        elif self.shipping == "pac":
            return 10 + weight_kg * 1.5 + distance_km * 0.02
        elif self.shipping == "free":
            return 0.0
        raise ValueError(self.shipping)</code></pre>
        <p><strong>Depois, forma clássica:</strong> interface e uma classe por algoritmo.</p>
        <pre><code class="language-python">from abc import ABC, abstractmethod


class ShippingStrategy(ABC):
    @abstractmethod
    def cost(self, weight_kg: float, distance_km: float) -&gt; float: ...


class Sedex(ShippingStrategy):
    def cost(self, weight_kg, distance_km):
        return 20 + weight_kg * 3 + distance_km * 0.05


class Pac(ShippingStrategy):
    def cost(self, weight_kg, distance_km):
        return 10 + weight_kg * 1.5 + distance_km * 0.02


class FreeShipping(ShippingStrategy):
    def cost(self, weight_kg, distance_km):
        return 0.0


class Checkout:                                  # Context
    def __init__(self, strategy: ShippingStrategy) -&gt; None:
        self._strategy = strategy

    def shipping_cost(self, weight_kg: float, distance_km: float) -&gt; float:
        return self._strategy.cost(weight_kg, distance_km)


print(Checkout(Sedex()).shipping_cost(2, 300))   # 41.0</code></pre>
        <p>Funciona, mas olhe o custo cerimonial: três classes sem estado, cada uma com um único método. É exatamente o cenário em que Python dispensa as classes.</p>
      `
    },
    {
      id: 'pythonico',
      title: 'Forma pythônica: funções e dict de callables',
      body: `
        <p>Como funções são objetos, a estratégia é um callable com a assinatura combinada. O "registro" é um dict.</p>
        <pre><code class="language-python">from typing import Callable

ShippingStrategy = Callable[[float, float], float]


def sedex(weight_kg: float, distance_km: float) -&gt; float:
    return 20 + weight_kg * 3 + distance_km * 0.05


def pac(weight_kg: float, distance_km: float) -&gt; float:
    return 10 + weight_kg * 1.5 + distance_km * 0.02


def free(weight_kg: float, distance_km: float) -&gt; float:
    return 0.0


STRATEGIES: dict[str, ShippingStrategy] = {"sedex": sedex, "pac": pac, "free": free}


class Checkout:
    def __init__(self, strategy: ShippingStrategy) -&gt; None:
        self._strategy = strategy

    def shipping_cost(self, weight_kg: float, distance_km: float) -&gt; float:
        return self._strategy(weight_kg, distance_km)


print(Checkout(STRATEGIES["pac"]).shipping_cost(2, 300))   # 19.0</code></pre>
        <p>Para registrar estratégias automaticamente, um decorator de registro é um idioma comum (e é o padrão de plugins de muitos frameworks):</p>
        <pre><code class="language-python">REGISTRY: dict[str, ShippingStrategy] = {}


def strategy(name: str):
    def deco(fn: ShippingStrategy) -&gt; ShippingStrategy:
        REGISTRY[name] = fn
        return fn
    return deco


@strategy("expresso")
def expresso(weight_kg: float, distance_km: float) -&gt; float:
    return 35 + weight_kg * 4


def best(weight_kg: float, distance_km: float) -&gt; str:
    return min(REGISTRY, key=lambda n: REGISTRY[n](weight_kg, distance_km))</code></pre>
        <p>Observe que <code>best</code> usa duas vezes o conceito: o <code>key</code> de <code>min</code> é outra estratégia. Estratégias parametrizadas viram closures ou <code>functools.partial</code>:</p>
        <pre><code class="language-python">from functools import partial

def with_discount(pct: float, base: ShippingStrategy) -&gt; ShippingStrategy:
    return lambda w, d: base(w, d) * (1 - pct / 100)

promo = with_discount(10, sedex)           # estratégia derivada de outra
per_kg = partial(lambda rate, w, d: rate * w, 4.5)   # parâmetro fixado</code></pre>
      `
    },
    {
      id: 'protocol',
      title: 'Quando a estratégia tem estado: Protocol e callable objects',
      body: `
        <p>Funções puras servem enquanto a estratégia é stateless e de um só método. Se ela precisa de configuração, estado (contadores, caches), ou vários métodos coesos, use uma classe que satisfaça um <code>Protocol</code>, ou um objeto com <code>__call__</code>.</p>
        <pre><code class="language-python">from typing import Protocol, Sequence


class Compressor(Protocol):
    name: str
    def compress(self, data: bytes) -&gt; bytes: ...
    def decompress(self, blob: bytes) -&gt; bytes: ...


class ZlibCompressor:
    name = "zlib"
    def __init__(self, level: int = 6) -&gt; None:
        self.level = level
    def compress(self, data: bytes) -&gt; bytes:
        import zlib
        return zlib.compress(data, self.level)
    def decompress(self, blob: bytes) -&gt; bytes:
        import zlib
        return zlib.decompress(blob)


class NoCompression:
    name = "none"
    def compress(self, data: bytes) -&gt; bytes: return data
    def decompress(self, blob: bytes) -&gt; bytes: return blob


def archive(chunks: Sequence[bytes], codec: Compressor) -&gt; list[bytes]:
    return [codec.compress(c) for c in chunks]


print(len(archive([b"x" * 1000], ZlibCompressor(9))[0]))</code></pre>
        <p>Aqui as duas operações (compress e decompress) precisam andar juntas, então uma classe com Protocol é mais honesta que duas funções soltas. Use o Protocol para checagem estática: <code>mypy</code>/<code>pyright</code> verifica que qualquer objeto com esses membros serve, sem herança.</p>
        <p>Outro recurso: <code>functools.singledispatch</code> escolhe a estratégia pelo <strong>tipo</strong> do primeiro argumento, útil quando a variação é por tipo de dado e não por escolha do chamador.</p>
        <pre><code class="language-python">from functools import singledispatch
from decimal import Decimal


@singledispatch
def to_json(value) -&gt; str:
    raise TypeError(f"sem serializador para {type(value).__name__}")


@to_json.register
def _(value: int) -&gt; str:
    return str(value)


@to_json.register
def _(value: Decimal) -&gt; str:
    return f'"{value}"'


@to_json.register
def _(value: list) -&gt; str:
    return "[" + ",".join(to_json(v) for v in value) + "]"


print(to_json([1, Decimal("2.50")]))</code></pre>
      `
    },
    {
      id: 'stdlib',
      title: 'Strategy na stdlib e nos frameworks',
      body: `
        <ul>
          <li><strong><code>sorted(..., key=)</code>, <code>min</code>, <code>max</code>, <code>heapq.nlargest(key=)</code></strong>: o algoritmo de ordenação é fixo, a estratégia de comparação é injetada.</li>
          <li><strong><code>logging.Formatter</code> e <code>Handler</code></strong>: o logger delega o formato e o destino a objetos intercambiáveis.</li>
          <li><strong><code>json.dumps(default=...)</code>, <code>JSONEncoder</code></strong>: estratégia para tipos desconhecidos.</li>
          <li><strong>Django:</strong> <code>PASSWORD_HASHERS</code>, backends de autenticação, de cache e de sessão, e <code>storage</code> são estratégias por configuração.</li>
          <li><strong>scikit-learn:</strong> estimadores intercambiáveis atrás de <code>fit/predict</code>, <code>Pipeline</code> trocando etapas; <code>scoring=</code> aceita estratégia de avaliação.</li>
          <li><strong>Retry/backoff:</strong> bibliotecas como <code>tenacity</code> recebem <code>wait=</code> e <code>stop=</code> como estratégias.</li>
          <li><strong>pytest:</strong> fixtures parametrizadas e <code>parametrize</code> aplicam o mesmo caso de teste a várias estratégias.</li>
        </ul>
        <pre><code class="language-python">import logging

handler = logging.StreamHandler()
handler.setFormatter(logging.Formatter("%(levelname)s | %(message)s"))   # estratégia de formato
log = logging.getLogger("demo")
log.addHandler(handler)
log.setLevel(logging.INFO)
log.info("estrategia injetada")

people = [("Ana", 31), ("Bruno", 25)]
print(sorted(people, key=lambda p: p[1]))     # estratégia de comparação</code></pre>
        <p>Para testes, a vantagem é direta: você passa uma estratégia determinística (relógio fixo, gerador de ids previsível, fornecedor falso) em vez de fazer monkeypatch em globais. A injeção da estratégia é a forma mais simples de <em>dependency injection</em> em Python.</p>
      `
    },
    {
      id: 'armadilhas',
      title: 'Armadilhas e critérios de decisão',
      body: `
        <ul>
          <li><strong>Assinaturas divergentes:</strong> estratégias que precisam de dados diferentes forçam o contexto a passar tudo ou a quebrar o contrato. Passe um objeto de contexto (dataclass) como argumento único e deixe cada estratégia ler o que precisa.</li>
          <li><strong>Strategy versus State:</strong> no State o <em>próprio objeto</em> troca de estratégia conforme transições internas; no Strategy o <em>cliente</em> escolhe. Estruturalmente iguais, intenções opostas.</li>
          <li><strong>Strategy versus Template Method:</strong> Strategy varia por composição (injetar função); Template Method varia por herança (sobrescrever passo). Em Python prefira a composição.</li>
          <li><strong>Explosão de estratégias triviais:</strong> se há duas variantes e nunca vão crescer, um <code>if</code> bem escrito é mais legível. O padrão paga quando as variantes crescem ou precisam ser testadas e configuradas separadamente.</li>
          <li><strong>Registro global mutável:</strong> um dict de módulo é estado global; em testes, isole com fixtures ou injete o registro.</li>
          <li><strong>Escolha em runtime:</strong> a seleção por string vinda de configuração deve falhar rápido e com mensagem clara (<code>KeyError</code> traduzido para uma lista de opções válidas).</li>
        </ul>
        <pre><code class="language-python">def resolve(name: str) -&gt; ShippingStrategy:
    try:
        return REGISTRY[name]
    except KeyError:
        raise ValueError(f"estrategia {name!r} invalida; opcoes: {sorted(REGISTRY)}") from None</code></pre>
        <div class="callout tip"><strong>DICA</strong> Teste cada estratégia isoladamente (função pura é trivial de testar) e teste o contexto com uma estratégia falsa que registra as chamadas. Dois níveis de teste, ambos baratos.</div>
      `
    },
    {
      id: 'desnecessario',
      title: 'Quando é desnecessário (a lição de Norvig)',
      body: `
        <p>Norvig, em "Design Patterns in Dynamic Languages", mostra que Strategy vira "uma função" quando a linguagem tem funções de primeira classe e closures. Na prática:</p>
        <ul>
          <li>Sem estado e um método: <strong>função</strong>, e o "padrão" desaparece (fica só a ideia).</li>
          <li>Registro de variantes: <strong>dict de funções</strong>.</li>
          <li>Variação por tipo de dado: <strong><code>singledispatch</code></strong>.</li>
          <li>Com estado e vários métodos: classe com <strong>Protocol</strong>.</li>
          <li>Um <code>match/case</code> local resolve bem quando o conjunto de variantes é pequeno, fechado e conhecido em um único lugar.</li>
        </ul>
        <pre><code class="language-python">def shipping_cost(kind: str, weight_kg: float) -&gt; float:
    match kind:
        case "sedex":
            return 20 + weight_kg * 3
        case "pac":
            return 10 + weight_kg * 1.5
        case "free":
            return 0.0
        case _:
            raise ValueError(kind)</code></pre>
        <p>Esse <code>match</code> é aceitável quando o conjunto é fechado e só existe uma decisão desse tipo. Quando a mesma ramificação aparece em vários pontos ou o conjunto precisa ser extensível por plugins, volte ao dict de funções ou ao Protocol. Regra de bolso: se você nunca vai adicionar estratégias sem editar o arquivo, o <code>match</code> é suficiente; se terceiros ou configuração adicionam, use registro.</p>
      `
    }
  ],
  whenToUse: [
    'Há várias formas de fazer a mesma coisa e a escolha vem do cliente, de configuração ou de dados',
    'Quer eliminar if/elif repetidos sobre o "tipo" de algoritmo',
    'Precisa trocar algoritmos em testes por versões determinísticas ou falsas',
    'Variantes crescem com o tempo e devem ser testadas e implantadas separadamente',
    'Quer extensão por plugins: novas estratégias sem editar o contexto'
  ],
  whenNot: [
    'Só duas variantes estáveis: um if ou match local é mais legível',
    'A estratégia é stateless e de um método e você ainda cria classes (use função)',
    'As estratégias exigem dados muito diferentes: o contrato fica artificial',
    'Quando o objeto deve trocar de comportamento sozinho por transições: é State',
    'Registro global mutável sem isolamento em testes'
  ],
  metrics: [
    'Protocol + mypy/pyright: valida que a estratégia satisfaz o contrato',
    'pytest.mark.parametrize rodando o mesmo teste sobre todas as estratégias do registro',
    'Cobertura de ramos: cada estratégia exercitada isoladamente',
    'Teste do contexto com estratégia falsa que registra chamadas',
    'timeit quando a estratégia está em hot path (chamada de função tem custo, mas é pequeno)'
  ],
  refs: [
    { type: 'portal', title: 'Strategy, refactoring.guru', author: 'Alexander Shvets', url: 'https://refactoring.guru/design-patterns/strategy', note: 'Diagrama e exemplos do padrão, com comparação a State e Template Method.' },
    { type: 'portal', title: 'Strategy em Python, refactoring.guru', author: 'Alexander Shvets', url: 'https://refactoring.guru/design-patterns/strategy/python/example', note: 'Implementação comentada do padrão em Python, passo a passo.' },
    { type: 'artigo', title: 'Design Patterns in Dynamic Languages', author: 'Peter Norvig', url: 'https://norvig.com/design-patterns/', note: 'A origem do argumento: padrões invisíveis com funções de primeira classe.' },
    { type: 'livro', title: 'Fluent Python, 2nd ed.', author: 'Luciano Ramalho', url: 'https://www.oreilly.com/library/view/fluent-python-2nd/9781492056348/', note: 'O capítulo sobre padrões com funções de primeira classe reimplementa Strategy.' },
    { type: 'livro', title: 'Head First Design Patterns, 2nd ed.', author: 'Eric Freeman, Elisabeth Robson', url: 'https://www.oreilly.com/library/view/head-first-design/9781492077992/', note: 'O exemplo dos patos explica Strategy e favorece composição.' },
    { type: 'doc', title: 'functools.singledispatch', author: 'Python Software Foundation', url: 'https://docs.python.org/3/library/functools.html#functools.singledispatch', note: 'Despacho por tipo como variante de Strategy.' },
    { type: 'doc', title: 'typing.Protocol', author: 'Python Software Foundation', url: 'https://docs.python.org/3/library/typing.html#typing.Protocol', note: 'Contratos estruturais para estratégias com estado.' },
    { type: 'livro', title: 'Design Patterns: Elements of Reusable Object-Oriented Software', author: 'Gamma, Helm, Johnson, Vlissides (GoF)', url: 'https://www.informit.com/store/design-patterns-elements-of-reusable-object-oriented-9780201633610', note: 'Definição original do Strategy.' }
  ]
};

/* ===================== 43. OBSERVER ===================== */
window.LESSON_CONTENT['observer'] = {
  id: 'observer',
  title: 'Observer e pub/sub',
  etapa: 8, etapaName: 'Design patterns comportamentais',
  time: '60 min',
  tags: ['comportamental', 'eventos', 'weakref', 'desacoplamento'],
  tagline: 'Notificar quem se interessa sem saber quem são: o motor de eventos, sinais e UIs reativas, e um campo minado de <em>vazamentos e ordem</em>.',
  intro: `
    <p>Quando uma coisa acontece (um pedido é criado, um arquivo muda, um preço atualiza), vários outros pontos do sistema querem reagir: enviar e-mail, invalidar cache, atualizar métrica, indexar. Se o produtor chama cada um diretamente, ele passa a conhecer todos. O Observer inverte a dependência: o produtor (subject) mantém uma lista de interessados (observers) e os notifica, sem saber o que eles fazem.</p>
    <p>É a base de GUIs (callbacks de botão), do <code>signals</code> do Django, de <code>blinker</code> e Flask, de event emitters, de <code>asyncio</code> (<code>add_done_callback</code>), de <code>logging</code> (handlers) e de barramentos de eventos em arquiteturas orientadas a eventos. A versão distribuída, com broker no meio, é o pub/sub (Kafka, Redis, RabbitMQ), com garantias e falhas muito diferentes.</p>
    <p>A lição cobre a forma clássica, a pythônica (lista de callables), o problema de memória (<code>weakref</code>), erros e ordem de notificação, o acoplamento temporal escondido, e a diferença entre Observer em processo e pub/sub com broker.</p>
  `,
  sections: [
    {
      id: 'intencao',
      title: 'Intenção e participantes (GoF)',
      body: `
        <p>Intenção do GoF: <em>definir uma dependência um-para-muitos entre objetos, de modo que, quando um objeto muda de estado, todos os seus dependentes são notificados e atualizados automaticamente.</em></p>
        <table>
          <thead><tr><th>Participante</th><th>Papel</th></tr></thead>
          <tbody>
            <tr><td>Subject (Observable)</td><td>Guarda observers, oferece attach/detach e notify</td></tr>
            <tr><td>Observer</td><td>Interface de atualização (<code>update</code>)</td></tr>
            <tr><td>ConcreteSubject</td><td>Tem o estado de interesse; dispara notify quando muda</td></tr>
            <tr><td>ConcreteObserver</td><td>Reage à notificação (pode consultar o subject)</td></tr>
          </tbody>
        </table>
        <p>Dois modelos de notificação: <strong>push</strong> (o subject envia os dados do evento) e <strong>pull</strong> (o subject avisa e o observer consulta o estado). Push é mais simples e evita corridas; pull evita enviar dados que ninguém usa. Em Python, push com um objeto de evento imutável (dataclass) é o padrão mais robusto.</p>
        <div class="callout"><strong>NA ENTREVISTA</strong> Pergunte-se e responda: quem retém quem? O subject guarda referências fortes aos observers, então um observer esquecido nunca é coletado (o clássico "lapsed listener"). Falar de <code>weakref</code> e de unsubscribe explícito marca um candidato sênior.</div>
      `
    },
    {
      id: 'classico',
      title: 'Implementação clássica e a versão pythônica',
      body: `
        <pre><code class="language-python">from abc import ABC, abstractmethod


class Observer(ABC):
    @abstractmethod
    def update(self, event: str, payload: dict) -&gt; None: ...


class Subject:
    def __init__(self) -&gt; None:
        self._observers: list[Observer] = []

    def attach(self, o: Observer) -&gt; None:
        self._observers.append(o)

    def detach(self, o: Observer) -&gt; None:
        self._observers.remove(o)

    def notify(self, event: str, payload: dict) -&gt; None:
        for o in list(self._observers):        # cópia: observers podem se remover
            o.update(event, payload)


class EmailOnOrder(Observer):
    def update(self, event, payload):
        if event == "order_created":
            print("email para", payload["customer"])</code></pre>
        <p>Em Python, a interface <code>Observer</code> raramente vale a pena: o observer é um <strong>callable</strong>. O subject vira uma lista de funções.</p>
        <pre><code class="language-python">from collections import defaultdict
from dataclasses import dataclass
from typing import Callable


@dataclass(frozen=True)
class OrderCreated:
    order_id: int
    customer: str


Handler = Callable[[object], None]


class EventBus:
    def __init__(self) -&gt; None:
        self._handlers: defaultdict[type, list[Handler]] = defaultdict(list)

    def subscribe(self, event_type: type, handler: Handler) -&gt; Callable[[], None]:
        self._handlers[event_type].append(handler)
        return lambda: self._handlers[event_type].remove(handler)   # unsubscribe

    def publish(self, event: object) -&gt; None:
        for h in list(self._handlers[type(event)]):
            h(event)


bus = EventBus()
unsub = bus.subscribe(OrderCreated, lambda e: print("email para", e.customer))
bus.subscribe(OrderCreated, lambda e: print("metrica order", e.order_id))
bus.publish(OrderCreated(1, "Ana"))
unsub()
bus.publish(OrderCreated(2, "Bruno"))      # só a métrica responde</code></pre>
        <p>O retorno da função <code>unsubscribe</code> evita o erro mais comum (esquecer de remover) e dispensa guardar referências ao handler.</p>
      `
    },
    {
      id: 'weakref',
      title: 'Vazamentos: weakref e o lapsed listener',
      body: `
        <p>Um subject de vida longa (um barramento global, um widget) mantém referência forte a cada observer. Se o observer é um método de um objeto que deveria morrer, o subject o mantém vivo para sempre. Duas soluções: unsubscribe disciplinado (context manager) ou referência fraca.</p>
        <p>Cuidado: <code>weakref.ref(obj.metodo)</code> não funciona, pois um método ligado (<em>bound method</em>) é um objeto temporário que é coletado imediatamente. Use <code>weakref.WeakMethod</code>.</p>
        <pre><code class="language-python">import weakref
from typing import Callable


class WeakSignal:
    def __init__(self) -&gt; None:
        self._refs: list = []

    def connect(self, fn: Callable) -&gt; None:
        if hasattr(fn, "__self__"):                    # método ligado
            self._refs.append(weakref.WeakMethod(fn))
        else:
            self._refs.append(weakref.ref(fn))

    def emit(self, *args, **kwargs) -&gt; None:
        alive = []
        for r in self._refs:
            fn = r()
            if fn is not None:
                fn(*args, **kwargs)
                alive.append(r)
        self._refs = alive                              # descarta mortos


class Widget:
    def on_change(self, value: int) -&gt; None:
        print("widget viu", value)


sig = WeakSignal()
w = Widget()
sig.connect(w.on_change)
sig.emit(1)          # widget viu 1
del w
import gc; gc.collect()
sig.emit(2)          # ninguém responde, sem vazamento</code></pre>
        <p>Funções lambda e closures anônimas passadas a <code>WeakSignal</code> seriam coletadas imediatamente (ninguém mais as referencia). Por isso bibliotecas como <code>blinker</code> usam referência fraca por padrão (<code>weak=True</code>) e oferecem <code>weak=False</code> para handlers anônimos. O <code>signals</code> do Django segue a mesma ideia: <code>Signal.connect(..., weak=True)</code> por padrão, e é por isso que um <code>lambda</code> conectado sem <code>weak=False</code> "não dispara".</p>
        <div class="callout warn"><strong>PEGADINHA</strong> Handler anônimo com referência fraca sumindo "do nada" é um dos bugs mais confusos de sinais em Django e Flask. Se o handler é lambda, closure ou <code>partial</code>, guarde-o em variável de longa vida ou conecte com <code>weak=False</code>.</div>
      `
    },
    {
      id: 'reais',
      title: 'Observer no mundo real',
      body: `
        <ul>
          <li><strong>Django signals:</strong> <code>post_save</code>, <code>pre_delete</code>, <code>request_finished</code>. Úteis para desacoplar apps, mas escondem fluxo; em muitos times a regra é "signals só para reagir a eventos de outras apps, nunca para lógica de negócio central".</li>
          <li><strong>blinker (Flask):</strong> sinais nomeados com <code>connect</code>/<code>send</code>, <code>weak</code> por padrão.</li>
          <li><strong>asyncio:</strong> <code>Future.add_done_callback</code> é um Observer de uma notificação; <code>asyncio.Event</code> e <code>Condition</code> coordenam espera.</li>
          <li><strong>logging:</strong> o logger notifica uma lista de handlers, e cada um decide o que fazer.</li>
          <li><strong>watchdog:</strong> observadores de eventos de sistema de arquivos.</li>
          <li><strong>SQLAlchemy:</strong> <code>event.listen(Model, "after_insert", fn)</code> registra observers em eventos do ORM.</li>
          <li><strong>Reativos:</strong> RxPY e propriedades reativas em frameworks de UI são Observer com operadores funcionais.</li>
        </ul>
        <pre><code class="language-python"># asyncio: Observer de um evento único
import asyncio

async def main() -&gt; None:
    fut: asyncio.Future[str] = asyncio.get_running_loop().create_future()
    fut.add_done_callback(lambda f: print("pronto:", f.result()))
    fut.set_result("ok")
    await asyncio.sleep(0)       # dá ao loop a chance de rodar o callback

asyncio.run(main())</code></pre>
        <pre><code class="language-python"># Django: conectando um receiver
# from django.db.models.signals import post_save
# from django.dispatch import receiver
#
# @receiver(post_save, sender=Order)
# def send_confirmation(sender, instance, created, **kwargs):
#     if created:
#         enqueue_email(instance.id)       # enfileire, não envie inline</code></pre>
      `
    },
    {
      id: 'armadilhas',
      title: 'Armadilhas: ordem, erros, reentrância e acoplamento temporal',
      body: `
        <ul>
          <li><strong>Erro em um observer:</strong> se o handler lança exceção, os seguintes não rodam e o produtor falha. Decida a política: propagar (falha rápida), isolar (capturar, logar e seguir) ou coletar. Django oferece <code>send_robust</code> exatamente para isolar.</li>
          <li><strong>Ordem de notificação:</strong> não é contrato, a menos que você a documente. Código que depende da ordem entre observers é acoplamento escondido.</li>
          <li><strong>Reentrância:</strong> um observer que altera o subject dispara novas notificações durante uma notificação em curso. Pode gerar recursão infinita. Use flags de reentrada ou enfileire os eventos.</li>
          <li><strong>Mutação da lista durante notify:</strong> itere sobre uma cópia (<code>list(...)</code>), como acima.</li>
          <li><strong>Síncrono versus assíncrono:</strong> handler lento bloqueia o produtor. Para trabalho pesado, o handler só enfileira (fila, tarefa em background).</li>
          <li><strong>Acoplamento temporal:</strong> o produtor não sabe quando ou se o efeito acontece. Depurar "por que o e-mail saiu?" vira arqueologia. Registre eventos com logs estruturados e mantenha poucos assinantes por evento.</li>
          <li><strong>Transações:</strong> um observer que reage a <code>post_save</code> dentro de uma transação pode agir sobre dados que ainda podem sofrer rollback. Em Django, use <code>transaction.on_commit</code> para disparar efeitos externos.</li>
        </ul>
        <pre><code class="language-python">def publish_isolated(handlers, event) -&gt; list[Exception]:
    errors: list[Exception] = []
    for h in list(handlers):
        try:
            h(event)
        except Exception as exc:          # isola falha de um handler
            errors.append(exc)
    return errors</code></pre>
        <p><strong>Observer em processo versus pub/sub com broker.</strong> No primeiro, produtor e consumidor estão no mesmo processo, a entrega é síncrona, ordenada e sem persistência. No segundo (Kafka, RabbitMQ, Redis Streams, SNS/SQS), há desacoplamento no tempo e no espaço, mas você ganha preocupações novas: entrega pelo-menos-uma-vez, idempotência dos consumidores, ordenação por partição, reprocessamento e esquema de eventos versionado. Não trate um barramento em processo como se tivesse as garantias de um broker, nem o contrário.</p>
      `
    },
    {
      id: 'desnecessario',
      title: 'Quando é desnecessário',
      body: `
        <p>O Observer é simples de escrever e fácil de abusar. Em Python:</p>
        <ul>
          <li>Se há <strong>um</strong> interessado conhecido, passe um callback como argumento. Uma lista de observers para um assinante é cerimônia.</li>
          <li>Se o consumidor precisa do resultado, é uma chamada de função, não um evento.</li>
          <li>Para fluxos de dados, <strong>generators</strong> e <code>async for</code> invertem o controle de forma mais explícita que callbacks (o consumidor puxa).</li>
          <li>Para coordenação entre corrotinas, <code>asyncio.Queue</code> e <code>asyncio.Event</code> são mais seguros que callbacks encadeados.</li>
          <li>Se a lógica é central do negócio, chamada explícita mantém o fluxo legível. Eventos servem para efeitos colaterais periféricos (auditoria, métricas, notificações).</li>
        </ul>
        <pre><code class="language-python"># Em vez de callbacks, um stream que o consumidor puxa
import asyncio

async def prices(q: asyncio.Queue):
    for p in (10, 11, 9):
        await q.put(p)
    await q.put(None)

async def consumer(q: asyncio.Queue):
    while (p := await q.get()) is not None:
        print("preco", p)

async def main():
    q: asyncio.Queue = asyncio.Queue()
    await asyncio.gather(prices(q), consumer(q))

asyncio.run(main())</code></pre>
      `
    }
  ],
  whenToUse: [
    'Vários componentes reagem a mudanças de um objeto sem que ele os conheça',
    'Efeitos periféricos: auditoria, métricas, invalidação de cache, notificações',
    'Desacoplar apps/módulos (signals, event bus) mantendo dependência em uma direção',
    'GUIs e frameworks reativos: callbacks de eventos',
    'Arquiteturas orientadas a eventos, com broker quando precisar de persistência e escala'
  ],
  whenNot: [
    'Há um único interessado e conhecido: passe um callback',
    'O fluxo é regra central do negócio e precisa ser legível: use chamada explícita',
    'Quando ordem e atomicidade entre os efeitos importam e você não as controla',
    'Para fluxo de dados contínuo: generators, async for ou filas dão controle melhor',
    'Handlers anônimos com referência fraca (somem sem aviso)'
  ],
  metrics: [
    'tracemalloc / objgraph: detecta observers retidos (lapsed listener)',
    'weakref.WeakMethod e blinker/Django weak=True: ciclo de vida seguro',
    'Logs estruturados do evento (tipo, id, quantidade de handlers, falhas)',
    'Teste com handler que lança exceção: o comportamento escolhido está coberto',
    'transaction.on_commit (Django): evita efeitos antes do commit'
  ],
  refs: [
    { type: 'portal', title: 'Observer, refactoring.guru', author: 'Alexander Shvets', url: 'https://refactoring.guru/design-patterns/observer', note: 'Estrutura, push versus pull e comparação com Mediator.' },
    { type: 'portal', title: 'Observer em Python, refactoring.guru', author: 'Alexander Shvets', url: 'https://refactoring.guru/design-patterns/observer/python/example', note: 'Implementação comentada do padrão em Python, passo a passo.' },
    { type: 'doc', title: 'Django signals', author: 'Django Software Foundation', url: 'https://docs.djangoproject.com/en/stable/topics/signals/', note: 'weak por padrão, send_robust e advertências oficiais.' },
    { type: 'doc', title: 'blinker', author: 'Pallets', url: 'https://blinker.readthedocs.io/en/stable/', note: 'Biblioteca de sinais usada pelo Flask.' },
    { type: 'doc', title: 'weakref.WeakMethod', author: 'Python Software Foundation', url: 'https://docs.python.org/3/library/weakref.html#weakref.WeakMethod', note: 'Referência fraca correta para métodos ligados.' },
    { type: 'livro', title: 'Architecture Patterns with Python', author: 'Harry Percival, Bob Gregory', url: 'https://www.cosmicpython.com/', note: 'Eventos de domínio e barramento de mensagens em Python.' },
    { type: 'livro', title: 'Design Patterns: Elements of Reusable Object-Oriented Software', author: 'Gamma, Helm, Johnson, Vlissides (GoF)', url: 'https://www.informit.com/store/design-patterns-elements-of-reusable-object-oriented-9780201633610', note: 'Definição original, com modelos push e pull.' },
    { type: 'livro', title: 'Head First Design Patterns, 2nd ed.', author: 'Eric Freeman, Elisabeth Robson', url: 'https://www.oreilly.com/library/view/head-first-design/9781492077992/', note: 'A estação meteorológica é a introdução clássica ao Observer.' }
  ]
};

/* ===================== 44. COMMAND ===================== */
window.LESSON_CONTENT['command'] = {
  id: 'command',
  title: 'Command',
  etapa: 8, etapaName: 'Design patterns comportamentais',
  time: '45 min',
  tags: ['comportamental', 'undo/redo', 'filas', 'ações como dados'],
  tagline: 'Transformar uma ação em <em>objeto</em>: dá para enfileirar, registrar, repetir e desfazer.',
  intro: `
    <p>Chamar um método executa a ação agora e esquece. O Command empacota "o que fazer, com quais argumentos, em quem" em um objeto. Esse objeto pode ser guardado, enviado por uma fila, serializado, logado, executado depois, repetido e, se tiver a operação inversa, desfeito. Daí saem editores com undo/redo, filas de tarefas (Celery, RQ), CLIs com subcomandos, macros, transações compensatórias (sagas) e CQRS.</p>
    <p>O padrão separa quem pede (invoker) de quem sabe fazer (receiver), com o comando no meio. Em Python, a forma mínima é um callable (<code>functools.partial</code>); a forma completa é uma classe com <code>execute</code> e <code>undo</code>, com estado suficiente para reverter.</p>
    <p>A lição cobre as duas formas, o histórico de undo/redo com duas pilhas, comandos como dados (serializáveis), idempotência, e como o padrão aparece em CLIs e filas.</p>
  `,
  sections: [
    {
      id: 'intencao',
      title: 'Intenção e participantes (GoF)',
      body: `
        <p>Intenção do GoF: <em>encapsular uma requisição como um objeto, permitindo parametrizar clientes com diferentes requisições, enfileirar ou registrar requisições e suportar operações que podem ser desfeitas.</em></p>
        <table>
          <thead><tr><th>Participante</th><th>Papel</th><th>Exemplo (editor)</th></tr></thead>
          <tbody>
            <tr><td>Command</td><td>Interface <code>execute()</code> (e <code>undo()</code>)</td><td><code>Command</code></td></tr>
            <tr><td>ConcreteCommand</td><td>Liga um receiver a uma ação, guarda parâmetros</td><td><code>InsertText</code>, <code>DeleteRange</code></td></tr>
            <tr><td>Receiver</td><td>Sabe executar o trabalho real</td><td><code>Document</code></td></tr>
            <tr><td>Invoker</td><td>Dispara comandos, mantém histórico</td><td><code>Editor</code> (barra de menu, atalhos)</td></tr>
            <tr><td>Client</td><td>Cria os comandos e os associa a receivers</td><td>Código de composição</td></tr>
          </tbody>
        </table>
        <p>Pontos de decisão: o comando é <strong>burro</strong> (só delega ao receiver) ou <strong>inteligente</strong> (contém a lógica)? Para undo, guarda-se o necessário para reverter: um <strong>memento</strong> do estado anterior ou a operação inversa.</p>
        <div class="callout"><strong>NA ENTREVISTA</strong> "Implemente undo/redo." Resposta direta: duas pilhas (undo e redo), comandos com <code>execute</code> e <code>undo</code>, e limpar a pilha de redo ao executar um comando novo. Fale também de comandos que não são reversíveis (enviar e-mail) e de compensação.</div>
      `
    },
    {
      id: 'classico',
      title: 'Implementação clássica com undo/redo',
      body: `
        <pre><code class="language-python">from abc import ABC, abstractmethod


class Document:                                  # Receiver
    def __init__(self) -&gt; None:
        self.text = ""


class Command(ABC):
    @abstractmethod
    def execute(self) -&gt; None: ...
    @abstractmethod
    def undo(self) -&gt; None: ...


class InsertText(Command):
    def __init__(self, doc: Document, pos: int, s: str) -&gt; None:
        self.doc, self.pos, self.s = doc, pos, s

    def execute(self) -&gt; None:
        self.doc.text = self.doc.text[: self.pos] + self.s + self.doc.text[self.pos :]

    def undo(self) -&gt; None:
        self.doc.text = self.doc.text[: self.pos] + self.doc.text[self.pos + len(self.s) :]


class DeleteRange(Command):
    def __init__(self, doc: Document, start: int, end: int) -&gt; None:
        self.doc, self.start, self.end = doc, start, end
        self._removed = ""                       # memento do que foi apagado

    def execute(self) -&gt; None:
        self._removed = self.doc.text[self.start : self.end]
        self.doc.text = self.doc.text[: self.start] + self.doc.text[self.end :]

    def undo(self) -&gt; None:
        self.doc.text = self.doc.text[: self.start] + self._removed + self.doc.text[self.start :]


class Editor:                                    # Invoker
    def __init__(self) -&gt; None:
        self._undo: list[Command] = []
        self._redo: list[Command] = []

    def run(self, cmd: Command) -&gt; None:
        cmd.execute()
        self._undo.append(cmd)
        self._redo.clear()                       # nova ação invalida o redo

    def undo(self) -&gt; None:
        if self._undo:
            cmd = self._undo.pop()
            cmd.undo()
            self._redo.append(cmd)

    def redo(self) -&gt; None:
        if self._redo:
            cmd = self._redo.pop()
            cmd.execute()
            self._undo.append(cmd)


doc, ed = Document(), Editor()
ed.run(InsertText(doc, 0, "ola mundo"))
ed.run(DeleteRange(doc, 3, 9))
print(repr(doc.text))     # 'ola'
ed.undo(); print(repr(doc.text))   # 'ola mundo'
ed.redo(); print(repr(doc.text))   # 'ola'</code></pre>
        <p>Detalhe importante: o <code>DeleteRange</code> guarda no <code>execute</code> o texto removido, porque só nesse momento ele sabe o que apagou. Undo depende de capturar o estado anterior no ponto certo.</p>
      `
    },
    {
      id: 'pythonico',
      title: 'Forma pythônica: callables, partial e comandos como dados',
      body: `
        <p>Se você não precisa de undo, um comando é um callable com argumentos fixados. <code>functools.partial</code> e closures fazem o papel.</p>
        <pre><code class="language-python">from functools import partial
from queue import Queue

jobs: Queue = Queue()


def send_email(to: str, subject: str) -&gt; None:
    print(f"email {to}: {subject}")


def resize(path: str, width: int) -&gt; None:
    print(f"resize {path} -&gt; {width}px")


jobs.put(partial(send_email, "ana@example.com", "bem-vinda"))
jobs.put(partial(resize, "a.png", 800))

while not jobs.empty():
    job = jobs.get()
    job()                      # o invoker não sabe o que executa</code></pre>
        <p>Para undo sem classe por comando, um par de funções (do, undo) em um <code>dataclass</code> funciona:</p>
        <pre><code class="language-python">from dataclasses import dataclass
from typing import Callable


@dataclass
class Action:
    do: Callable[[], None]
    undo: Callable[[], None]


state = {"n": 0}

def inc() -&gt; Action:
    return Action(
        do=lambda: state.__setitem__("n", state["n"] + 1),
        undo=lambda: state.__setitem__("n", state["n"] - 1),
    )

a = inc(); a.do(); a.do(); a.undo()
print(state["n"])   # 1</code></pre>
        <p><strong>Comandos como dados.</strong> Para enviar por fila ou persistir (event sourcing, jobs), o comando deve ser serializável: um dataclass imutável com campos simples, mais um registro que mapeia tipo para handler. Esse é o núcleo de CQRS.</p>
        <pre><code class="language-python">from dataclasses import dataclass, asdict
from typing import Callable
import json


@dataclass(frozen=True)
class CreateOrder:
    customer: str
    items: tuple[str, ...]


@dataclass(frozen=True)
class CancelOrder:
    order_id: int


HANDLERS: dict[type, Callable] = {}


def handles(cmd_type: type):
    def deco(fn):
        HANDLERS[cmd_type] = fn
        return fn
    return deco


@handles(CreateOrder)
def create_order(cmd: CreateOrder) -&gt; int:
    print("criando pedido de", cmd.customer)
    return 1


def dispatch(cmd):
    return HANDLERS[type(cmd)](cmd)


cmd = CreateOrder("Ana", ("livro",))
print(json.dumps({"type": type(cmd).__name__, **asdict(cmd)}))   # vai para a fila
dispatch(cmd)</code></pre>
      `
    },
    {
      id: 'reais',
      title: 'Command no mundo real: CLIs, filas e sagas',
      body: `
        <ul>
          <li><strong>CLIs:</strong> <code>argparse</code> com subparsers (<code>set_defaults(func=...)</code>), <code>click</code>, <code>typer</code>: cada subcomando é um comando despachado pelo parser.</li>
          <li><strong>Filas de tarefas:</strong> Celery, RQ, Dramatiq e Arq serializam "chamar esta função com estes argumentos" para executar em outro processo. É Command distribuído. Os argumentos devem ser serializáveis, e a tarefa <strong>idempotente</strong>, porque a entrega costuma ser "pelo menos uma vez".</li>
          <li><strong>Migrações:</strong> Alembic e Django migrations são comandos com <code>upgrade</code> e <code>downgrade</code>.</li>
          <li><strong>Sagas:</strong> em transações distribuídas, cada passo tem uma ação compensatória (undo semântico), pois rollback real não existe entre serviços.</li>
          <li><strong>Editores e UIs:</strong> histórico de undo/redo, macros gravadas e replay.</li>
          <li><strong>Terminais e REPL:</strong> <code>cmd.Cmd</code> da stdlib despacha <code>do_&lt;nome&gt;</code>.</li>
        </ul>
        <pre><code class="language-python">import argparse


def cmd_add(args) -&gt; None:
    print(args.a + args.b)


def cmd_hello(args) -&gt; None:
    print(f"ola {args.name}")


parser = argparse.ArgumentParser()
sub = parser.add_subparsers(required=True)

p_add = sub.add_parser("add")
p_add.add_argument("a", type=int)
p_add.add_argument("b", type=int)
p_add.set_defaults(func=cmd_add)

p_hello = sub.add_parser("hello")
p_hello.add_argument("name")
p_hello.set_defaults(func=cmd_hello)

args = parser.parse_args(["add", "2", "3"])
args.func(args)       # 5</code></pre>
        <div class="callout tip"><strong>DICA</strong> Para tarefas em fila, inclua um <em>idempotency key</em> no comando (por exemplo um UUID gerado no cliente) e grave-o ao processar. Reentregas duplicadas viram no-ops, e você ganha resiliência sem exigir exatamente-uma-vez do broker.</div>
      `
    },
    {
      id: 'armadilhas',
      title: 'Armadilhas e limites',
      body: `
        <ul>
          <li><strong>Undo que não reverte de verdade:</strong> comandos com efeitos externos (e-mail, pagamento, escrita em API) não têm undo. Modele como ação compensatória (estorno) e deixe claro na interface.</li>
          <li><strong>Memento incompleto:</strong> guardar só parte do estado quebra o undo em cadeias de comandos. Teste: execute N comandos, desfaça N, e o estado deve igualar o original (propriedade perfeita para <code>hypothesis</code>).</li>
          <li><strong>Referências, não valores:</strong> um comando que guarda uma referência mutável a um objeto, e não um snapshot, executa no estado errado quando é reexecutado depois.</li>
          <li><strong>Memória do histórico:</strong> pilha de undo ilimitada cresce sem fim. Limite por quantidade (<code>collections.deque(maxlen=...)</code>) ou por tamanho.</li>
          <li><strong>Mutabilidade:</strong> comandos devem ser imutáveis (<code>frozen=True</code>) quando serializados ou reenviados; mutá-los depois de enfileirar gera bugs de difícil rastreio.</li>
          <li><strong>Serialização de closures:</strong> lambdas e closures não são picklable. Para filas, use funções de módulo (referenciáveis por nome) e argumentos simples.</li>
          <li><strong>Composição:</strong> um macro (Composite de comandos) deve desfazer na ordem inversa.</li>
        </ul>
        <pre><code class="language-python">class Macro:
    def __init__(self, *cmds) -&gt; None:
        self.cmds = cmds

    def execute(self) -&gt; None:
        for c in self.cmds:
            c.execute()

    def undo(self) -&gt; None:
        for c in reversed(self.cmds):     # ordem inversa
            c.undo()</code></pre>
      `
    },
    {
      id: 'desnecessario',
      title: 'Quando é desnecessário',
      body: `
        <p>Norvig observa que, com funções de primeira classe, Command é só "uma função" (ou closure). Se você precisa apenas adiar ou passar uma ação adiante, <code>partial</code> ou <code>lambda</code> bastam, e <code>threading.Thread(target=fn, args=...)</code>, <code>loop.call_soon</code> e <code>executor.submit(fn, *args)</code> já recebem comandos no formato de função mais argumentos.</p>
        <p>A classe completa se justifica quando você precisa de pelo menos uma destas capacidades: <strong>undo/redo</strong>, <strong>serialização</strong> (fila, log, event sourcing), <strong>inspeção</strong> (mostrar o que está na fila, auditar), ou <strong>composição</strong> (macros). Sem isso, é cerimônia.</p>
        <pre><code class="language-python">from concurrent.futures import ThreadPoolExecutor

def work(n: int) -&gt; int:
    return n * n

with ThreadPoolExecutor(max_workers=4) as pool:
    futures = [pool.submit(work, i) for i in range(5)]      # comando = função + args
    print([f.result() for f in futures])</code></pre>
        <p>E distinga de Strategy: Strategy escolhe <em>como</em> fazer uma tarefa; Command encapsula <em>uma requisição específica</em>, com seus dados, para executar depois, em outro lugar ou reverter.</p>
      `
    }
  ],
  whenToUse: [
    'Undo/redo, histórico, macros e replay de ações',
    'Enfileirar, agendar ou distribuir ações para execução posterior ou em outro processo',
    'Registrar ações como dados (auditoria, event sourcing, CQRS)',
    'Parametrizar um invoker (menu, atalho, botão) com ações intercambiáveis',
    'Sagas e compensações em fluxos distribuídos'
  ],
  whenNot: [
    'Basta adiar ou passar uma ação: use partial, lambda ou função',
    'Sem necessidade de undo, serialização ou inspeção: a classe é cerimônia',
    'Efeitos externos irreversíveis modelados como se tivessem undo',
    'Fila com closures não serializáveis ou tarefas não idempotentes',
    'Pilha de histórico ilimitada em sessões longas'
  ],
  metrics: [
    'Teste de propriedade (hypothesis): executar N comandos e desfazer N retorna ao estado inicial',
    'collections.deque(maxlen=...) para limitar o histórico',
    'Idempotency keys e métricas de reentrega em filas (Celery, RQ)',
    'dataclass(frozen=True) para comandos imutáveis e serializáveis',
    'Logs estruturados de cada comando (tipo, id, resultado, duração)'
  ],
  refs: [
    { type: 'portal', title: 'Command, refactoring.guru', author: 'Alexander Shvets', url: 'https://refactoring.guru/design-patterns/command', note: 'Estrutura, undo e comparação com Strategy e Memento.' },
    { type: 'portal', title: 'Design Patterns in Python', author: 'Brandon Rhodes', url: 'https://python-patterns.guide/', note: 'Visão pythônica do catálogo, com callables no lugar de classes.' },
    { type: 'artigo', title: 'Design Patterns in Dynamic Languages', author: 'Peter Norvig', url: 'https://norvig.com/design-patterns/', note: 'Command como função de primeira classe.' },
    { type: 'doc', title: 'functools.partial', author: 'Python Software Foundation', url: 'https://docs.python.org/3/library/functools.html#functools.partial', note: 'Fixar argumentos e criar comandos leves.' },
    { type: 'doc', title: 'argparse, subcomandos', author: 'Python Software Foundation', url: 'https://docs.python.org/3/library/argparse.html#sub-commands', note: 'Despacho de comandos com set_defaults(func=...).' },
    { type: 'doc', title: 'Celery, Tasks', author: 'Celery Project', url: 'https://docs.celeryq.dev/en/stable/userguide/tasks.html', note: 'Command distribuído: tarefas, retries e idempotência.' },
    { type: 'livro', title: 'Architecture Patterns with Python', author: 'Harry Percival, Bob Gregory', url: 'https://www.cosmicpython.com/', note: 'Comandos, handlers e barramento de mensagens em Python.' },
    { type: 'livro', title: 'Design Patterns: Elements of Reusable Object-Oriented Software', author: 'Gamma, Helm, Johnson, Vlissides (GoF)', url: 'https://www.informit.com/store/design-patterns-elements-of-reusable-object-oriented-9780201633610', note: 'Fonte original do padrão Command.' }
  ]
};

/* ===================== 45. STATE ===================== */
window.LESSON_CONTENT['state'] = {
  id: 'state',
  title: 'State e máquinas de estado',
  etapa: 8, etapaName: 'Design patterns comportamentais',
  time: '60 min',
  tags: ['comportamental', 'máquina de estados', 'Enum', 'transições'],
  tagline: 'O comportamento muda com o estado, e as transições <em>viram dados explícitos</em> em vez de um emaranhado de flags booleanas.',
  intro: `
    <p>Um pedido pode estar criado, pago, enviado, entregue, cancelado. Uma conexão: fechada, conectando, aberta, em erro. Um documento: rascunho, em revisão, publicado. Em cada estado, as mesmas operações têm significados diferentes, e só algumas transições são válidas. A implementação ingênua usa vários booleanos (<code>is_paid</code>, <code>is_shipped</code>, <code>is_cancelled</code>) e condicionais aninhadas, e rapidamente permite estados impossíveis, como um pedido enviado e cancelado ao mesmo tempo.</p>
    <p>O padrão State faz o objeto delegar seu comportamento a um objeto de estado atual, que pode trocar. Na prática em Python existem três níveis: um <code>Enum</code> com tabela de transições (suficiente em 80% dos casos), classes de estado do GoF (quando cada estado tem comportamento rico), e bibliotecas de máquinas de estado (<code>transitions</code>, <code>python-statemachine</code>) quando o fluxo é complexo.</p>
    <p>Aqui: a forma clássica, a forma de tabela, validação de transições, testes exaustivos, e a fronteira com Strategy.</p>
  `,
  sections: [
    {
      id: 'intencao',
      title: 'Intenção e participantes (GoF)',
      body: `
        <p>Intenção do GoF: <em>permitir que um objeto altere seu comportamento quando seu estado interno muda. O objeto parecerá ter mudado de classe.</em></p>
        <table>
          <thead><tr><th>Participante</th><th>Papel</th><th>Exemplo (pedido)</th></tr></thead>
          <tbody>
            <tr><td>Context</td><td>Mantém o estado atual e delega a ele</td><td><code>Order</code></td></tr>
            <tr><td>State</td><td>Interface comum dos comportamentos</td><td><code>OrderState</code></td></tr>
            <tr><td>ConcreteState</td><td>Comportamento de um estado e as transições que ele permite</td><td><code>Created</code>, <code>Paid</code>, <code>Shipped</code></td></tr>
          </tbody>
        </table>
        <p>Quem decide a transição? Duas opções: o <strong>contexto</strong> (tabela central, mais fácil de visualizar) ou os <strong>próprios estados</strong> (cada estado sabe qual é o próximo, mais extensível mas espalha a topologia). A decisão de design importante é manter a topologia do fluxo legível em um lugar, porque é o que o time precisa revisar e que o negócio costuma querer ver como diagrama.</p>
        <div class="callout"><strong>NA ENTREVISTA</strong> State versus Strategy: a estrutura é a mesma (contexto delega a um objeto trocável). No Strategy o cliente escolhe a estratégia de fora, e as estratégias não se conhecem. No State o objeto troca o estado sozinho conforme as transições, e os estados costumam se referenciar.</div>
      `
    },
    {
      id: 'antes',
      title: 'Antes: flags e condicionais',
      body: `
        <pre><code class="language-python"># ruim: estados implícitos em booleanos, transições dispersas
class Order:
    def __init__(self) -&gt; None:
        self.paid = False
        self.shipped = False
        self.cancelled = False

    def pay(self) -&gt; None:
        if self.cancelled:
            raise ValueError("pedido cancelado")
        if self.paid:
            raise ValueError("ja pago")
        self.paid = True

    def ship(self) -&gt; None:
        if not self.paid or self.cancelled or self.shipped:
            raise ValueError("nao pode enviar")
        self.shipped = True

    def cancel(self) -&gt; None:
        if self.shipped:
            raise ValueError("ja enviado")
        self.cancelled = True</code></pre>
        <p>Problemas: com 3 booleanos existem 8 combinações, mas só 4 ou 5 são válidas. Cada método revalida todas as flags. Adicionar o estado "devolvido" exige tocar todos os métodos, e nada impede <code>paid=True</code> com <code>cancelled=True</code> em outra parte do código. O número de estados impossíveis cresce exponencialmente com o número de flags.</p>
        <div class="callout warn"><strong>PEGADINHA</strong> A regra de ouro de modelagem: <em>torne os estados ilegais irrepresentáveis</em>. Uma única variável de estado (enum) garante que o objeto está em exatamente um estado válido por vez.</div>
      `
    },
    {
      id: 'enum-tabela',
      title: 'Depois (pythônico): Enum e tabela de transições',
      body: `
        <p>A forma mais pragmática: um <code>Enum</code> para o estado e um dict com as transições permitidas por evento. A topologia fica visível em um bloco de dados que serve até como documentação.</p>
        <pre><code class="language-python">from enum import Enum, auto


class Status(Enum):
    CREATED = auto()
    PAID = auto()
    SHIPPED = auto()
    DELIVERED = auto()
    CANCELLED = auto()


class InvalidTransition(Exception): ...


TRANSITIONS: dict[tuple[Status, str], Status] = {
    (Status.CREATED, "pay"): Status.PAID,
    (Status.CREATED, "cancel"): Status.CANCELLED,
    (Status.PAID, "ship"): Status.SHIPPED,
    (Status.PAID, "cancel"): Status.CANCELLED,
    (Status.SHIPPED, "deliver"): Status.DELIVERED,
}


class Order:
    def __init__(self) -&gt; None:
        self.status = Status.CREATED
        self.history: list[Status] = [self.status]

    def fire(self, event: str) -&gt; None:
        try:
            nxt = TRANSITIONS[(self.status, event)]
        except KeyError:
            raise InvalidTransition(f"{event!r} invalido em {self.status.name}") from None
        self.status = nxt
        self.history.append(nxt)


o = Order()
o.fire("pay"); o.fire("ship")
try:
    o.fire("cancel")
except InvalidTransition as e:
    print(e)           # 'cancel' invalido em SHIPPED</code></pre>
        <p>Vantagens: um único ponto de verdade; a tabela é testável de forma exaustiva (itere sobre <code>Status x eventos</code> e verifique que todo par fora da tabela falha); e dá para gerar o diagrama automaticamente a partir dos dados. Acrescentar ações em cada transição (efeitos colaterais) é um dict de callbacks ou o uso de Observer.</p>
        <pre><code class="language-python">import pytest


@pytest.mark.parametrize("status", list(Status))
@pytest.mark.parametrize("event", ["pay", "ship", "deliver", "cancel"])
def test_transicoes_so_as_declaradas(status, event):
    o = Order()
    o.status = status
    if (status, event) in TRANSITIONS:
        o.fire(event)
        assert o.status == TRANSITIONS[(status, event)]
    else:
        with pytest.raises(InvalidTransition):
            o.fire(event)</code></pre>
      `
    },
    {
      id: 'classico',
      title: 'Forma clássica: classes de estado e match/case',
      body: `
        <p>Quando cada estado tem <strong>comportamento</strong> real e distinto (não só "pode ou não pode"), as classes de estado do GoF organizam melhor que um dicionário.</p>
        <pre><code class="language-python">from __future__ import annotations
from abc import ABC


class ConnectionState(ABC):
    def connect(self, conn: Connection) -&gt; None:
        raise RuntimeError(f"connect invalido em {type(self).__name__}")

    def send(self, conn: Connection, data: bytes) -&gt; None:
        raise RuntimeError(f"send invalido em {type(self).__name__}")

    def close(self, conn: Connection) -&gt; None:
        raise RuntimeError(f"close invalido em {type(self).__name__}")


class Closed(ConnectionState):
    def connect(self, conn):
        print("abrindo socket")
        conn.state = Open()


class Open(ConnectionState):
    def send(self, conn, data):
        print(f"enviando {len(data)} bytes")

    def close(self, conn):
        print("fechando")
        conn.state = Closed()


class Connection:                       # Context
    def __init__(self) -&gt; None:
        self.state: ConnectionState = Closed()

    def connect(self) -&gt; None: self.state.connect(self)
    def send(self, data: bytes) -&gt; None: self.state.send(self, data)
    def close(self) -&gt; None: self.state.close(self)


c = Connection()
c.connect(); c.send(b"ola"); c.close()</code></pre>
        <p>A classe base lança erro por padrão, e cada estado sobrescreve só o que é válido nele: sem condicionais, e novos estados são classes novas (Open/Closed). Com <code>match/case</code> (3.10+), uma função de transição pura sobre uma união de dataclasses também é muito expressiva:</p>
        <pre><code class="language-python">from dataclasses import dataclass


@dataclass(frozen=True)
class Idle: ...

@dataclass(frozen=True)
class Running:
    pid: int

@dataclass(frozen=True)
class Failed:
    reason: str


type State = Idle | Running | Failed        # PEP 695 (3.12+)


def step(state: State, event: str) -&gt; State:
    match state, event:
        case Idle(), "start":
            return Running(pid=1234)
        case Running(pid), "crash":
            return Failed(f"processo {pid} caiu")
        case (Running(), "stop") | (Failed(), "reset"):
            return Idle()
        case _:
            raise ValueError(f"{event!r} invalido em {state}")


print(step(step(Idle(), "start"), "crash"))</code></pre>
        <p>Essa forma funcional trata o estado como dado imutável e a transição como função pura: trivial de testar, de registrar (event sourcing) e de reproduzir.</p>
      `
    },
    {
      id: 'bibliotecas',
      title: 'Bibliotecas, geradores como máquinas e persistência',
      body: `
        <ul>
          <li><strong><code>transitions</code></strong>: definição declarativa de estados, gatilhos, condições e callbacks, com geração de diagramas (graphviz). Boa para fluxos de 5 a 30 estados.</li>
          <li><strong><code>python-statemachine</code></strong>: classes com estados e transições declarados como atributos, com validação em tempo de definição.</li>
          <li><strong><code>django-fsm</code></strong>: transições como decorators em métodos de model, com proteção do campo de estado (verifique a manutenção atual do projeto antes de adotar).</li>
          <li><strong>Geradores e corrotinas:</strong> uma função geradora é uma máquina de estados implícita: o ponto de suspensão é o estado. <code>asyncio</code> usa isso internamente.</li>
          <li><strong>Protocolos de rede, parsers e lexers:</strong> máquinas de estados clássicas (por exemplo handshakes, parsing de HTTP).</li>
        </ul>
        <pre><code class="language-python">def handshake():
    """Máquina de estados via gerador: cada yield é um estado de espera."""
    hello = yield "aguardando hello"
    if hello != "HELLO":
        return "protocolo invalido"
    auth = yield "aguardando credencial"
    return "ok" if auth == "secret" else "negado"


g = handshake()
print(next(g))                 # aguardando hello
print(g.send("HELLO"))         # aguardando credencial
try:
    g.send("secret")
except StopIteration as done:
    print(done.value)          # ok</code></pre>
        <p><strong>Persistência.</strong> Guarde o estado como string/enum no banco (com <code>CHECK</code> para valores válidos) e garanta transições <em>atômicas</em>: <code>UPDATE orders SET status='PAID' WHERE id=? AND status='CREATED'</code> e verifique que uma linha foi afetada. Isso evita corridas entre dois processos que tentam transitar ao mesmo tempo (optimistic locking). Registre cada transição em uma tabela de histórico (quem, quando, de, para), que ajuda na auditoria e no debug.</p>
        <pre><code class="language-sql">UPDATE orders
   SET status = 'PAID', updated_at = now()
 WHERE id = 42 AND status = 'CREATED';
-- rowcount = 0 significa que outro processo já mudou o estado</code></pre>
      `
    },
    {
      id: 'decisao',
      title: 'Quando é desnecessário e armadilhas',
      body: `
        <ul>
          <li><strong>Dois estados e uma flag:</strong> um booleano bem nomeado é melhor que o padrão. O padrão paga quando há 3 ou mais estados com regras de transição.</li>
          <li><strong>Estado sem comportamento:</strong> se os estados só diferem por "pode ou não pode", Enum com tabela supera classes de estado.</li>
          <li><strong>Explosão de estados:</strong> combinar dimensões independentes (pagamento x entrega) em uma máquina única gera produto cartesiano. Modele duas máquinas independentes (ou estados hierárquicos/paralelos).</li>
          <li><strong>Transições com efeitos externos:</strong> ao enviar e-mail na transição, decida o que acontece se o efeito falha. Prefira gravar a transição e disparar o efeito por evento confirmado (outbox).</li>
          <li><strong>Estados implícitos nos dados:</strong> às vezes o estado deriva de campos (<code>shipped_at is not None</code>). Derivar evita inconsistência, mas dificulta consultas e auditoria. Escolha conscientemente.</li>
          <li><strong>Versionamento:</strong> adicionar um estado em produção exige migrar registros existentes e tratar consumidores que não o conhecem.</li>
        </ul>
        <p>A conexão com Norvig: State em Python frequentemente colapsa em "atribuir <code>self.__class__</code>" (possível, mas pouco recomendado), em uma tabela de funções por estado, ou em um gerador. Cuidado: trocar <code>self.__class__</code> em runtime funciona mas confunde ferramentas e leitores. Prefira composição explícita.</p>
        <pre><code class="language-python"># tabela de funções por estado: forma enxuta
def on_idle(ev): ...
def on_running(ev): ...

HANDLERS = {"idle": on_idle, "running": on_running}

def dispatch(state: str, ev):
    return HANDLERS[state](ev)</code></pre>
        <div class="callout tip"><strong>DICA</strong> Gere o diagrama de estados a partir da tabela de transições (graphviz, mermaid) e versione-o junto com o código. Quando o negócio muda uma regra, a discussão acontece no diagrama, e o diff do código fica pequeno.</div>
      `
    }
  ],
  whenToUse: [
    'Objeto com 3 ou mais estados e regras de transição que mudam o comportamento',
    'Existem flags booleanas que se combinam e geram estados impossíveis',
    'Fluxos de negócio (pedido, pagamento, aprovação, documento) que precisam de auditoria',
    'Protocolos, parsers e conexões com handshakes e fases',
    'Quando as transições devem ser testadas de forma exaustiva e visualizadas'
  ],
  whenNot: [
    'Apenas dois estados: um booleano claro basta',
    'Estados sem comportamento distinto: Enum com tabela é mais simples que classes',
    'Dimensões independentes empacotadas em uma máquina só (produto cartesiano)',
    'Trocar self.__class__ em runtime: confunde ferramentas e leitores',
    'Efeitos externos nas transições sem estratégia de falha (use outbox)'
  ],
  metrics: [
    'Teste parametrizado exaustivo sobre estado x evento',
    'Diagrama de estados gerado dos dados (graphviz, mermaid) versionado',
    'UPDATE condicional com rowcount para transições atômicas e sem corrida',
    'Tabela de histórico de transições (quem, quando, de, para)',
    'mypy/pyright com Enum e Literal: exaustividade em match com assert_never'
  ],
  refs: [
    { type: 'portal', title: 'State, refactoring.guru', author: 'Alexander Shvets', url: 'https://refactoring.guru/design-patterns/state', note: 'Estrutura do padrão e comparação com Strategy.' },
    { type: 'portal', title: 'Design Patterns in Python', author: 'Brandon Rhodes', url: 'https://python-patterns.guide/', note: 'Contexto dos padrões do GoF em Python.' },
    { type: 'doc', title: 'transitions, a lightweight state machine library', author: 'Tal Yarkoni et al.', url: 'https://github.com/pytransitions/transitions', note: 'Biblioteca declarativa de máquinas de estados, com diagramas.' },
    { type: 'doc', title: 'python-statemachine', author: 'Fernando Macedo', url: 'https://python-statemachine.readthedocs.io/', note: 'Máquinas de estado declaradas como classes Python.' },
    { type: 'doc', title: 'enum, support for enumerations', author: 'Python Software Foundation', url: 'https://docs.python.org/3/library/enum.html', note: 'A base da forma pythônica de estados.' },
    { type: 'doc', title: 'PEP 636, Structural Pattern Matching: Tutorial', author: 'Daniel F Moisset', url: 'https://peps.python.org/pep-0636/', note: 'Tutorial do match/case, ideal para funções de transição.' },
    { type: 'livro', title: 'Head First Design Patterns, 2nd ed.', author: 'Eric Freeman, Elisabeth Robson', url: 'https://www.oreilly.com/library/view/head-first-design/9781492077992/', note: 'O exemplo da máquina de chicletes é a introdução clássica ao State.' },
    { type: 'livro', title: 'Design Patterns: Elements of Reusable Object-Oriented Software', author: 'Gamma, Helm, Johnson, Vlissides (GoF)', url: 'https://www.informit.com/store/design-patterns-elements-of-reusable-object-oriented-9780201633610', note: 'Fonte original do State.' }
  ]
};

/* ===================== 46. TEMPLATE METHOD ===================== */
window.LESSON_CONTENT['template-method'] = {
  id: 'template-method',
  title: 'Template Method',
  etapa: 8, etapaName: 'Design patterns comportamentais',
  time: '40 min',
  tags: ['comportamental', 'herança', 'hooks', 'frameworks'],
  tagline: 'O esqueleto do algoritmo na superclasse, os passos variáveis nas subclasses: o <em>princípio de Hollywood</em>, e por que hoje se prefere composição.',
  intro: `
    <p>Muitos algoritmos têm a mesma estrutura e variam em alguns passos: ler dados, processar, gravar; abrir conexão, executar, fechar; configurar, rodar, limpar. O Template Method define o esqueleto em um método da superclasse e deixa passos específicos (métodos abstratos ou <em>hooks</em>) para as subclasses. A superclasse chama as subclasses, e não o contrário: é o "princípio de Hollywood" (não nos ligue, nós ligamos para você).</p>
    <p>Está em toda parte em frameworks: <code>unittest.TestCase</code> (<code>setUp</code>, o teste, <code>tearDown</code>), views baseadas em classe do Django (<code>dispatch</code>, <code>get_queryset</code>, <code>get_context_data</code>), <code>socketserver.BaseRequestHandler</code>, <code>json.JSONEncoder.default</code>, <code>abc</code>, <code>logging.Handler.emit</code>, ETLs de equipes.</p>
    <p>É também o padrão em que a crítica moderna mais pesa: herança é o acoplamento mais forte que existe, e em Python funções de primeira classe e composição entregam o mesmo com menos fragilidade. A lição ensina a forma clássica, as armadilhas, e a alternativa por injeção de funções.</p>
  `,
  sections: [
    {
      id: 'intencao',
      title: 'Intenção e participantes (GoF)',
      body: `
        <p>Intenção do GoF: <em>definir o esqueleto de um algoritmo em uma operação, postergando alguns passos para as subclasses. Template Method permite que subclasses redefinam certos passos de um algoritmo sem mudar sua estrutura.</em></p>
        <table>
          <thead><tr><th>Participante</th><th>Papel</th></tr></thead>
          <tbody>
            <tr><td>AbstractClass</td><td>Define o template method (<code>run</code>) e os passos primitivos (abstratos ou com padrão)</td></tr>
            <tr><td>ConcreteClass</td><td>Implementa os passos primitivos</td></tr>
          </tbody>
        </table>
        <p>Tipos de passo: <strong>abstratos</strong> (obrigatórios, a subclasse tem de implementar), <strong>hooks</strong> (opcionais, têm implementação padrão vazia ou razoável) e passos <strong>fixos</strong> (que a subclasse não deve alterar). Em Java marca-se o template como <code>final</code>; Python não tem <code>final</code> imposto em tempo de execução, mas existe <code>typing.final</code> para checadores estáticos.</p>
        <div class="callout"><strong>NA ENTREVISTA</strong> Descreva a inversão de controle: o framework tem o fluxo e chama seu código. Contraste com a biblioteca (você chama o código dela). E cite a alternativa: Strategy injeta o passo variável por composição, sem herança.</div>
      `
    },
    {
      id: 'classico',
      title: 'Implementação clássica: um pipeline de importação',
      body: `
        <pre><code class="language-python">from abc import ABC, abstractmethod
from typing import Any, final


class Importer(ABC):
    @final
    def run(self, source: str) -&gt; int:        # template method
        self.before()
        raw = self.read(source)                # passo abstrato
        rows = [self.transform(r) for r in raw]
        rows = [r for r in rows if self.is_valid(r)]
        count = self.write(rows)               # passo abstrato
        self.after(count)
        return count

    @abstractmethod
    def read(self, source: str) -&gt; list[Any]: ...

    @abstractmethod
    def write(self, rows: list[Any]) -&gt; int: ...

    def transform(self, row: Any) -&gt; Any:       # hook com padrão
        return row

    def is_valid(self, row: Any) -&gt; bool:       # hook com padrão
        return True

    def before(self) -&gt; None: ...               # hooks vazios
    def after(self, count: int) -&gt; None: ...


class CsvToList(Importer):
    def __init__(self) -&gt; None:
        self.out: list[dict] = []

    def read(self, source: str) -&gt; list[Any]:
        import csv, io
        return list(csv.DictReader(io.StringIO(source)))

    def transform(self, row):
        return {k.lower(): v.strip() for k, v in row.items()}

    def is_valid(self, row) -&gt; bool:
        return bool(row.get("email"))

    def write(self, rows):
        self.out.extend(rows)
        return len(rows)


imp = CsvToList()
print(imp.run("Email,Nome\\nana@x.com, Ana\\n,sem email\\n"), imp.out)</code></pre>
        <p>O fluxo (<code>run</code>) é garantido e único; as subclasses só preenchem lacunas. O decorator <code>@final</code> (3.11+) documenta e permite que mypy/pyright reclamem se alguém sobrescrever o template.</p>
      `
    },
    {
      id: 'frameworks',
      title: 'Templates que você já usa',
      body: `
        <ul>
          <li><strong><code>unittest.TestCase</code>:</strong> o runner chama <code>setUp</code>, o método de teste e <code>tearDown</code>. Você preenche os passos.</li>
          <li><strong>Django class-based views:</strong> <code>View.dispatch</code> escolhe o método HTTP; <code>ListView</code> chama <code>get_queryset</code>, <code>get_context_data</code> e <code>render_to_response</code>. Sobrescreva o passo, não o fluxo.</li>
          <li><strong><code>socketserver</code>:</strong> <code>BaseRequestHandler</code> chama <code>setup</code>, <code>handle</code> e <code>finish</code>.</li>
          <li><strong><code>json.JSONEncoder</code>:</strong> o fluxo de codificação é fixo; você implementa <code>default(self, o)</code> para tipos desconhecidos.</li>
          <li><strong><code>logging.Handler</code>:</strong> o fluxo de <code>handle</code> (filtros, lock) é fixo; você implementa <code>emit</code>.</li>
          <li><strong><code>collections.abc</code> (mixins):</strong> implemente <code>__getitem__</code> e <code>__len__</code> e ganhe <code>__iter__</code>, <code>__contains__</code>, <code>index</code> de <code>Sequence</code>. É Template Method como mixin.</li>
          <li><strong>scikit-learn:</strong> <code>BaseEstimator</code> e mixins definem o contrato; <code>fit</code>/<code>transform</code> são passos que você preenche.</li>
        </ul>
        <pre><code class="language-python">from collections.abc import Sequence


class Playlist(Sequence):                 # você escreve 2 métodos
    def __init__(self, *tracks: str) -&gt; None:
        self._t = list(tracks)

    def __getitem__(self, i):
        return self._t[i]

    def __len__(self) -&gt; int:
        return len(self._t)


p = Playlist("a", "b", "c")
print("b" in p, p.index("c"), list(reversed(p)))   # métodos prontos do mixin</code></pre>
        <pre><code class="language-python">import json
from datetime import date


class DateEncoder(json.JSONEncoder):
    def default(self, o):                  # hook do template de encode
        if isinstance(o, date):
            return o.isoformat()
        return super().default(o)


print(json.dumps({"d": date(2026, 11, 13)}, cls=DateEncoder))</code></pre>
      `
    },
    {
      id: 'composicao',
      title: 'A alternativa pythônica: injetar os passos',
      body: `
        <p>Herança acopla a subclasse ao fluxo interno da superclasse: mudar a ordem dos passos quebra todas as subclasses, e a "fragile base class" é um problema real. A alternativa é a função de ordem superior: o esqueleto recebe os passos como argumentos (Strategy por função).</p>
        <pre><code class="language-python">from typing import Callable, Iterable, TypeVar

T = TypeVar("T")
U = TypeVar("U")


def run_import(
    source: str,
    read: Callable[[str], Iterable[T]],
    write: Callable[[list[U]], int],
    transform: Callable[[T], U] = lambda r: r,        # hook opcional
    is_valid: Callable[[U], bool] = lambda r: True,   # hook opcional
) -&gt; int:
    rows = [transform(r) for r in read(source)]
    return write([r for r in rows if is_valid(r)])


import csv, io

out: list[dict] = []

n = run_import(
    "Email,Nome\\nana@x.com,Ana\\n,sem\\n",
    read=lambda s: csv.DictReader(io.StringIO(s)),
    write=lambda rows: (out.extend(rows), len(rows))[1],
    transform=lambda r: {k.lower(): v for k, v in r.items()},
    is_valid=lambda r: bool(r["email"]),
)
print(n, out)</code></pre>
        <p>Vantagens: sem hierarquia, cada passo é testável sozinho, passos são reutilizáveis entre fluxos, e não há risco de a subclasse esquecer de chamar <code>super()</code>. Quando há muitos passos, um <code>dataclass</code> de passos (ou <code>Protocol</code> com vários métodos) agrupa.</p>
        <p>Para o problema "setup e teardown em volta de um bloco", Python tem uma ferramenta própria: <strong>context manager</strong>. Em vez de template com <code>before</code>/<code>after</code>, use <code>contextlib.contextmanager</code>:</p>
        <pre><code class="language-python">from contextlib import contextmanager


@contextmanager
def transaction(conn):
    conn.begin()
    try:
        yield conn
        conn.commit()
    except Exception:
        conn.rollback()
        raise</code></pre>
        <p>pytest é o exemplo: substituiu o <code>setUp</code>/<code>tearDown</code> herdados do unittest por <strong>fixtures</strong> (injeção por nome, com <code>yield</code> para teardown). Mesma função, sem herança.</p>
      `
    },
    {
      id: 'armadilhas',
      title: 'Armadilhas e decisão',
      body: `
        <ul>
          <li><strong>Esquecer <code>super()</code>:</strong> ao sobrescrever um hook que tem implementação útil na base, esquecer de chamá-lo quebra silenciosamente. Documente quais hooks exigem <code>super()</code>, ou deixe a base com hooks vazios.</li>
          <li><strong>Ordem dos passos como contrato implícito:</strong> a subclasse depende de a base chamar <code>read</code> antes de <code>transform</code>. Mudar a base é uma quebra de API.</li>
          <li><strong>Hierarquias profundas:</strong> três níveis de template sobrescrevendo uns aos outros são ilegíveis. Mantenha rasa (um nível), ou troque por composição.</li>
          <li><strong>Subclasse que precisa de dados que a base não passa:</strong> leva a atributos de instância usados como canal escondido entre passos. Prefira passar dados por parâmetro e retorno.</li>
          <li><strong>Testabilidade:</strong> testar o template exige instanciar uma subclasse. Teste a base com uma subclasse mínima de teste que registra a ordem das chamadas.</li>
          <li><strong>Herança múltipla:</strong> misturar dois templates (cooperative inheritance) depende da MRO; use <code>super()</code> consistentemente.</li>
        </ul>
        <pre><code class="language-python">def test_ordem_dos_passos():
    calls: list[str] = []

    class Spy(Importer):
        def before(self): calls.append("before")
        def read(self, source): calls.append("read"); return [1]
        def transform(self, row): calls.append("transform"); return row
        def write(self, rows): calls.append("write"); return len(rows)
        def after(self, count): calls.append("after")

    Spy().run("x")
    assert calls == ["before", "read", "transform", "write", "after"]</code></pre>
      `
    },
    {
      id: 'desnecessario',
      title: 'Quando é desnecessário (Norvig e a crítica moderna)',
      body: `
        <p>Norvig lista o Template Method entre os padrões que linguagens com funções de primeira classe e closures simplificam: em vez de herdar para variar um passo, você passa a função. Para o Python moderno, o consenso prático é:</p>
        <ul>
          <li><strong>Prefira composição quando você controla o design:</strong> função de ordem superior ou Protocol com os passos injetados.</li>
          <li><strong>Use Template Method quando o framework o impõe</strong> (Django CBVs, unittest, <code>JSONEncoder</code>) ou quando a hierarquia é rasa e estável e o esqueleto tem forte invariante a proteger.</li>
          <li><strong>Use context manager</strong> para setup e teardown em volta de um bloco.</li>
          <li><strong>Use decorator ou middleware</strong> quando a variação é um comportamento transversal antes ou depois.</li>
        </ul>
        <p>Regra de bolso: se você está escrevendo a classe base e os usuários são <em>outros times ou terceiros</em>, hooks bem documentados com herança rasa são aceitáveis (é a forma como muitos frameworks oferecem extensão). Se você é o dono dos dois lados, composição geralmente vence.</p>
        <div class="callout tip"><strong>DICA</strong> Para classes abstratas com contrato, uma alternativa moderna é <code>Protocol</code> para os passos e uma função para o fluxo. A "classe base" deixa de ser acoplamento por herança e vira só um tipo estrutural.</div>
      `
    }
  ],
  whenToUse: [
    'Vários algoritmos compartilham a mesma estrutura e variam em passos específicos',
    'Você escreve um framework ou biblioteca e quer pontos de extensão controlados (hooks)',
    'Há um invariante de fluxo que as extensões não podem violar (ordem, validação, limpeza)',
    'A hierarquia é rasa e estável, e os usuários são outros times',
    'Reaproveitar o esqueleto e deixar o código específico em poucos métodos pequenos'
  ],
  whenNot: [
    'Você é dono dos dois lados e pode injetar funções: composição é menos frágil',
    'Setup e teardown em volta de um bloco: use context manager ou fixture',
    'Hierarquias com mais de dois níveis de templates sobrescrevendo uns aos outros',
    'Quando a ordem dos passos é instável (a base vai mudar e quebrar as subclasses)',
    'Quando subclasses precisam de dados que a base não fornece: o design está errado'
  ],
  metrics: [
    'typing.final no template e checagem com mypy/pyright',
    'abc.abstractmethod: falha na instanciação se faltar um passo obrigatório',
    'Teste com subclasse Spy que registra a ordem das chamadas',
    'Profundidade de herança (radon, pylint too-many-ancestors) como sinal de alerta',
    'Docstring dos hooks: obrigatório chamar super() ou não'
  ],
  refs: [
    { type: 'portal', title: 'Template Method, refactoring.guru', author: 'Alexander Shvets', url: 'https://refactoring.guru/design-patterns/template-method', note: 'Estrutura, tipos de passo e comparação com Strategy.' },
    { type: 'portal', title: 'Template Method em Python, refactoring.guru', author: 'Alexander Shvets', url: 'https://refactoring.guru/design-patterns/template-method/python/example', note: 'Implementação comentada do padrão em Python, passo a passo.' },
    { type: 'artigo', title: 'Design Patterns in Dynamic Languages', author: 'Peter Norvig', url: 'https://norvig.com/design-patterns/', note: 'Como funções de primeira classe substituem o Template Method.' },
    { type: 'doc', title: 'typing.final', author: 'Python Software Foundation', url: 'https://docs.python.org/3/library/typing.html#typing.final', note: 'Marca o template como não sobrescrevível para checadores estáticos.' },
    { type: 'doc', title: 'Django, Class-based views', author: 'Django Software Foundation', url: 'https://docs.djangoproject.com/en/stable/topics/class-based-views/', note: 'Template Method em escala de framework.' },
    { type: 'doc', title: 'collections.abc, mixins abstratos', author: 'Python Software Foundation', url: 'https://docs.python.org/3/library/collections.abc.html', note: 'Métodos mixin derivados de poucos métodos abstratos.' },
    { type: 'doc', title: 'pytest, fixtures', author: 'pytest-dev', url: 'https://docs.pytest.org/en/stable/how-to/fixtures.html', note: 'A alternativa por injeção ao setUp/tearDown herdado.' },
    { type: 'livro', title: 'Design Patterns: Elements of Reusable Object-Oriented Software', author: 'Gamma, Helm, Johnson, Vlissides (GoF)', url: 'https://www.informit.com/store/design-patterns-elements-of-reusable-object-oriented-9780201633610', note: 'Fonte original, incluindo o princípio de Hollywood.' }
  ]
};

/* ===================== 47. CHAIN OF RESPONSIBILITY ===================== */
window.LESSON_CONTENT['chain-responsibility'] = {
  id: 'chain-responsibility',
  title: 'Chain of Responsibility',
  etapa: 8, etapaName: 'Design patterns comportamentais',
  time: '45 min',
  tags: ['comportamental', 'middleware', 'pipeline', 'validação'],
  tagline: 'Uma requisição passa por uma cadeia de handlers, e cada um <em>trata, modifica ou repassa</em>: a espinha dorsal dos middlewares.',
  intro: `
    <p>Uma requisição HTTP atravessa autenticação, rate limit, CORS, compressão, logging e só então chega à view. Um evento de log passa por filtros e vários handlers. Uma validação percorre dezenas de regras. Um pedido de desconto sobe de gerente em gerente até alguém ter alçada. Todos têm a mesma forma: uma sequência de elos, cada um decide se trata, se transforma, se interrompe ou se passa adiante.</p>
    <p>O Chain of Responsibility desacopla o remetente do receptor: o remetente entrega à cabeça da cadeia e não sabe quem vai tratar. Em Python, a cadeia é uma lista de funções, uma composição de closures (o modelo de middleware do Django e do ASGI) ou um loop sobre handlers. Raramente se escreve a lista ligada de objetos do GoF.</p>
    <p>A lição cobre a forma clássica, a de lista e a de middleware (onion model), o <em>short-circuit</em>, o uso em validação e em <code>logging</code>, e as armadilhas de ordem e de requisições sem tratador.</p>
  `,
  sections: [
    {
      id: 'intencao',
      title: 'Intenção e participantes (GoF)',
      body: `
        <p>Intenção do GoF: <em>evitar acoplar o remetente de uma requisição ao seu receptor, dando a mais de um objeto a chance de tratá-la. Encadeie os objetos receptores e passe a requisição ao longo da cadeia até que um objeto a trate.</em></p>
        <table>
          <thead><tr><th>Participante</th><th>Papel</th></tr></thead>
          <tbody>
            <tr><td>Handler</td><td>Interface para tratar a requisição; guarda o próximo elo</td></tr>
            <tr><td>ConcreteHandler</td><td>Trata o que é dele; senão repassa ao sucessor</td></tr>
            <tr><td>Client</td><td>Inicia a requisição no primeiro handler</td></tr>
          </tbody>
        </table>
        <p>Existem duas variantes e é útil distingui-las: na <strong>forma estrita do GoF</strong>, exatamente um handler trata e a cadeia para (aprovação de desconto por alçada). Na <strong>forma pipeline</strong>, todos os handlers participam em sequência e cada um pode transformar a requisição ou interromper (middlewares, filtros). A maioria dos usos reais em Python é a segunda.</p>
        <div class="callout"><strong>NA ENTREVISTA</strong> Pergunta-chave: "o que acontece se ninguém tratar?". A cadeia precisa de uma política explícita: erro, resposta padrão ou handler final garantido. Cadeias que descartam silenciosamente são fonte de bugs.</div>
      `
    },
    {
      id: 'classico',
      title: 'Implementação clássica: aprovação por alçada',
      body: `
        <pre><code class="language-python">from __future__ import annotations
from abc import ABC, abstractmethod


class Approver(ABC):
    def __init__(self) -&gt; None:
        self._next: Approver | None = None

    def then(self, nxt: Approver) -&gt; Approver:       # permite encadear fluente
        self._next = nxt
        return nxt

    def handle(self, amount: float) -&gt; str:
        if self.can_approve(amount):
            return self.approve(amount)
        if self._next is None:
            raise ValueError(f"ninguem aprova {amount:.2f}")   # política: falhar alto
        return self._next.handle(amount)

    @abstractmethod
    def can_approve(self, amount: float) -&gt; bool: ...

    @abstractmethod
    def approve(self, amount: float) -&gt; str: ...


class Manager(Approver):
    def can_approve(self, amount): return amount &lt;= 1_000
    def approve(self, amount): return f"gerente aprovou {amount:.2f}"


class Director(Approver):
    def can_approve(self, amount): return amount &lt;= 10_000
    def approve(self, amount): return f"diretor aprovou {amount:.2f}"


class Ceo(Approver):
    def can_approve(self, amount): return amount &lt;= 100_000
    def approve(self, amount): return f"ceo aprovou {amount:.2f}"


chain = Manager()
chain.then(Director()).then(Ceo())

print(chain.handle(800))
print(chain.handle(7_500))
try:
    chain.handle(500_000)
except ValueError as e:
    print(e)</code></pre>
        <p>O cliente só conhece a cabeça. Reordenar, inserir ou remover um elo não afeta quem faz a chamada. A política para "ninguém trata" é explícita: lançar erro.</p>
      `
    },
    {
      id: 'pythonico',
      title: 'Forma pythônica: lista de funções e pipeline',
      body: `
        <p>Quando os handlers são funções e a cadeia é só uma sequência, uma lista e um loop bastam.</p>
        <pre><code class="language-python">from typing import Callable, Optional

Handler = Callable[[float], Optional[str]]      # devolve resposta ou None (passa adiante)


def manager(amount: float) -&gt; Optional[str]:
    return "gerente" if amount &lt;= 1_000 else None


def director(amount: float) -&gt; Optional[str]:
    return "diretor" if amount &lt;= 10_000 else None


def ceo(amount: float) -&gt; Optional[str]:
    return "ceo" if amount &lt;= 100_000 else None


def run_chain(handlers: list[Handler], amount: float) -&gt; str:
    for h in handlers:
        if (result := h(amount)) is not None:
            return result
    raise ValueError("ninguem aprova")


print(run_chain([manager, director, ceo], 7_500))     # diretor</code></pre>
        <p>Para a forma pipeline (todos participam), o padrão é compor transformações. O <em>short-circuit</em> aparece como exceção ou retorno antecipado.</p>
        <pre><code class="language-python">from dataclasses import dataclass, field


@dataclass
class Request:
    path: str
    headers: dict[str, str] = field(default_factory=dict)
    user: str | None = None


class Rejected(Exception):
    def __init__(self, status: int, reason: str) -&gt; None:
        super().__init__(reason)
        self.status = status


def authenticate(req: Request) -&gt; Request:
    token = req.headers.get("authorization")
    if token != "Bearer ok":
        raise Rejected(401, "nao autenticado")
    req.user = "ana"
    return req


def rate_limit(req: Request) -&gt; Request:
    if req.path == "/spam":
        raise Rejected(429, "muitas requisicoes")
    return req


def run_pipeline(steps, req: Request) -&gt; Request:
    for step in steps:
        req = step(req)
    return req


try:
    run_pipeline([authenticate, rate_limit], Request("/home", {"authorization": "Bearer ok"}))
    print("passou")
    run_pipeline([authenticate, rate_limit], Request("/home"))
except Rejected as e:
    print(e.status, e)</code></pre>
      `
    },
    {
      id: 'middleware',
      title: 'Middleware: o modelo cebola (Django, ASGI, Starlette)',
      body: `
        <p>Middlewares são Chain of Responsibility com um detalhe: cada elo envolve o próximo, podendo agir <strong>antes</strong> e <strong>depois</strong> (a resposta volta pela mesma cadeia, como camadas de cebola). Isso combina o padrão com o Decorator: cada middleware é um decorator da cadeia que vem depois.</p>
        <pre><code class="language-python">from typing import Callable

App = Callable[[dict], dict]


def logging_mw(next_app: App) -&gt; App:
    def app(req: dict) -&gt; dict:
        print("-&gt;", req["path"])
        resp = next_app(req)
        print("&lt;-", resp["status"])
        return resp
    return app


def auth_mw(next_app: App) -&gt; App:
    def app(req: dict) -&gt; dict:
        if not req.get("user"):
            return {"status": 401}            # short-circuit: não chama o próximo
        return next_app(req)
    return app


def view(req: dict) -&gt; dict:
    return {"status": 200, "body": f"ola {req['user']}"}


def build(app: App, *middlewares: Callable[[App], App]) -&gt; App:
    for mw in reversed(middlewares):          # o primeiro da lista fica por fora
        app = mw(app)
    return app


handler = build(view, logging_mw, auth_mw)
print(handler({"path": "/", "user": "ana"}))
print(handler({"path": "/"}))</code></pre>
        <p>No Django, <code>MIDDLEWARE</code> em <code>settings.py</code> é exatamente isso: cada entrada é uma factory que recebe <code>get_response</code> e devolve um callable. Em ASGI (Starlette, FastAPI), o middleware recebe <code>(scope, receive, send)</code> e pode curto-circuitar enviando a própria resposta. Em WSGI, as camadas envolvem o <code>app</code> do mesmo jeito.</p>
        <p>Outros exemplos reais:</p>
        <ul>
          <li><strong><code>logging</code>:</strong> o record passa por <code>Logger.filter</code>, depois por cada <code>Handler</code> (com seus filtros e níveis), e pela hierarquia de loggers com propagação (<code>propagate</code>), que é uma cadeia ascendente até o root.</li>
          <li><strong><code>ChainMap</code>:</strong> <code>collections.ChainMap</code> consulta dicts em sequência, devolvendo o primeiro que tem a chave. É uma cadeia de busca (escopos).</li>
          <li><strong>Resolução de MRO:</strong> a busca de método na hierarquia de herança é uma cadeia.</li>
          <li><strong>Eventos de DOM / GUI:</strong> propagação (bubbling) até um widget tratar.</li>
          <li><strong>Pipelines de validação:</strong> Pydantic validators, regras de negócio encadeadas.</li>
        </ul>
        <pre><code class="language-python">from collections import ChainMap

defaults = {"theme": "claro", "lang": "pt"}
env = {"lang": "en"}
cli = {"theme": "escuro"}

config = ChainMap(cli, env, defaults)        # a cabeça tem prioridade
print(config["theme"], config["lang"])       # escuro en</code></pre>
      `
    },
    {
      id: 'validacao',
      title: 'Aplicação típica: validação encadeada',
      body: `
        <p>Validar com uma cadeia permite acumular erros (ou parar no primeiro) sem um método gigante cheio de <code>if</code>.</p>
        <pre><code class="language-python">from dataclasses import dataclass
from typing import Callable

Rule = Callable[[dict], str | None]       # None = ok; str = mensagem de erro


def required(*fields: str) -&gt; Rule:
    def rule(data: dict) -&gt; str | None:
        missing = [f for f in fields if not data.get(f)]
        return f"campos ausentes: {missing}" if missing else None
    return rule


def adult(data: dict) -&gt; str | None:
    return None if data.get("age", 0) &gt;= 18 else "menor de idade"


def valid_email(data: dict) -&gt; str | None:
    return None if "@" in data.get("email", "") else "email invalido"


@dataclass
class Report:
    errors: list[str]
    @property
    def ok(self) -&gt; bool:
        return not self.errors


def validate(data: dict, rules: list[Rule], fail_fast: bool = False) -&gt; Report:
    errors: list[str] = []
    for rule in rules:
        if (msg := rule(data)) is not None:
            errors.append(msg)
            if fail_fast:
                break
    return Report(errors)


rules = [required("email", "age"), adult, valid_email]
print(validate({"email": "x", "age": 16}, rules).errors)
print(validate({"email": "x", "age": 16}, rules, fail_fast=True).errors)</code></pre>
        <p>Dois modos importantes: <strong>fail-fast</strong> (primeiro erro, barato, bom para guardas de segurança) e <strong>acumular</strong> (todos os erros, melhor para UX de formulário). Deixe a escolha com o chamador. Para regras que dependem de outras (só valide o e-mail se ele existir), a ordem da cadeia expressa a dependência: ponha <code>required</code> primeiro e faça as seguintes tolerarem ausência, ou use fail-fast na primeira camada.</p>
      `
    },
    {
      id: 'armadilhas',
      title: 'Armadilhas e critérios',
      body: `
        <ul>
          <li><strong>Ninguém trata:</strong> defina o comportamento (erro, padrão, handler final). Um <code>None</code> silencioso que se propaga é pior que uma exceção.</li>
          <li><strong>Ordem como parte do contrato:</strong> autenticação antes de autorização, compressão por fora, métricas mais externas. Documente a ordem canônica e monte a cadeia em um único lugar.</li>
          <li><strong>Estado mutável na requisição:</strong> handlers que alteram o mesmo objeto criam dependências ocultas de ordem. Prefira requisições imutáveis (nova instância por elo) ou documente quais campos cada elo escreve.</li>
          <li><strong>Debug difícil:</strong> é difícil saber qual elo tratou ou barrou. Registre (log estruturado) o nome do handler que decidiu, e em testes exponha um modo "trace".</li>
          <li><strong>Custo:</strong> cada elo é uma chamada de função extra. Com dezenas de middlewares por requisição o custo existe, mas costuma ser dominado por I/O. Meça antes de otimizar.</li>
          <li><strong>Async:</strong> misturar middlewares síncronos e assíncronos no Django força adaptação (<code>sync_to_async</code>) e custo extra. Prefira uma cadeia homogênea.</li>
          <li><strong>Exceções como controle de fluxo:</strong> aceitável para short-circuit de rejeição (como acima), mas capture na borda e converta em resposta, nunca deixe vazar.</li>
        </ul>
        <div class="callout warn"><strong>PEGADINHA</strong> Em middleware no estilo cebola, esquecer de chamar o próximo elo (ou de devolver o resultado dele) interrompe a requisição sem erro algum. E num middleware que faz <code>try/finally</code>, a lógica de "depois" roda mesmo quando o elo seguinte curto-circuita, o que pode ser o desejado (métricas) ou um bug (comitar transação). Teste os dois caminhos.</div>
      `
    },
    {
      id: 'desnecessario',
      title: 'Quando é desnecessário',
      body: `
        <p>Chain of Responsibility é um dos padrões mais reconhecíveis em Python, mas costuma aparecer sem classes:</p>
        <ul>
          <li>Uma <strong>lista de funções</strong> e um loop cobrem a forma estrita e a forma pipeline.</li>
          <li><code>any(rule(x) for rule in rules)</code> e <code>all(...)</code> já são "primeiro que trata" e "todos devem passar".</li>
          <li>Para poucos casos fixos, um <code>if/elif</code> ou <code>match/case</code> é mais claro que montar uma cadeia.</li>
          <li>Para composição de transformações puras, <code>functools.reduce</code> sobre uma lista de funções, ou um simples <code>for</code>, é suficiente.</li>
        </ul>
        <pre><code class="language-python">from functools import reduce

def compose(*fns):
    return lambda x: reduce(lambda acc, f: f(acc), fns, x)

clean = compose(str.strip, str.lower, lambda s: s.replace("  ", " "))
print(clean("  OLA   Mundo "))</code></pre>
        <p>Use classes de handler quando cada elo tem estado, configuração ou ciclo de vida próprio, ou quando a cadeia é montada dinamicamente por configuração com muitos tipos. Se o único benefício é "não ter um if grande", considere antes uma tabela de despacho (dict) ou <code>singledispatch</code> quando a escolha é por tipo.</p>
      `
    }
  ],
  whenToUse: [
    'Vários candidatos podem tratar uma requisição e quem decide é determinado em runtime',
    'Pipelines de middleware: autenticação, rate limit, logging, compressão, CORS',
    'Validações e regras de negócio encadeadas e reordenáveis',
    'Escalonamento por alçada ou prioridade (aprovações, suporte em níveis)',
    'Remetente não deve conhecer o receptor, e a cadeia precisa ser configurável'
  ],
  whenNot: [
    'Poucos casos fixos: if/elif ou match/case é mais claro',
    'A ordem importa muito e é frágil sem ninguém documentar',
    'Quando você precisa saber com certeza qual elo tratou e não há trace',
    'Seleção por tipo de dado: singledispatch é mais direto',
    'Handlers que mutam um estado compartilhado em ordem implícita'
  ],
  metrics: [
    'Log estruturado com o nome do handler que decidiu e o tempo de cada elo',
    'Teste do caminho de short-circuit e do caminho completo de cada elo',
    'Teste de "ninguém trata": a política (erro/padrão) está coberta',
    'Perfil da cadeia (cProfile, py-spy) para achar o elo caro',
    'Documentação e teste da ordem canônica da cadeia'
  ],
  refs: [
    { type: 'portal', title: 'Chain of Responsibility, refactoring.guru', author: 'Alexander Shvets', url: 'https://refactoring.guru/design-patterns/chain-of-responsibility', note: 'Estrutura, variantes e comparação com Decorator.' },
    { type: 'portal', title: 'Design Patterns in Python', author: 'Brandon Rhodes', url: 'https://python-patterns.guide/', note: 'Contexto dos padrões do GoF em Python.' },
    { type: 'doc', title: 'Django, Middleware', author: 'Django Software Foundation', url: 'https://docs.djangoproject.com/en/stable/topics/http/middleware/', note: 'O modelo cebola explicado na documentação oficial.' },
    { type: 'doc', title: 'Starlette, Middleware', author: 'Encode', url: 'https://starlette.dev/middleware/', note: 'Middlewares ASGI puros e baseados em classe.' },
    { type: 'doc', title: 'collections.ChainMap', author: 'Python Software Foundation', url: 'https://docs.python.org/3/library/collections.html#collections.ChainMap', note: 'Cadeia de busca de escopos na stdlib.' },
    { type: 'doc', title: 'logging, fluxo de eventos', author: 'Python Software Foundation', url: 'https://docs.python.org/3/howto/logging.html#logging-flow', note: 'Diagrama oficial de como o record atravessa filtros e handlers.' },
    { type: 'livro', title: 'Design Patterns: Elements of Reusable Object-Oriented Software', author: 'Gamma, Helm, Johnson, Vlissides (GoF)', url: 'https://www.informit.com/store/design-patterns-elements-of-reusable-object-oriented-9780201633610', note: 'Fonte original do padrão.' },
    { type: 'artigo', title: 'Design Patterns in Dynamic Languages', author: 'Peter Norvig', url: 'https://norvig.com/design-patterns/', note: 'Padrões que viram funções e composição.' }
  ]
};

/* ===================== 48. ITERATOR, VISITOR E MEDIATOR ===================== */
window.LESSON_CONTENT['iterator-visitor'] = {
  id: 'iterator-visitor',
  title: 'Iterator, Visitor e Mediator',
  etapa: 8, etapaName: 'Design patterns comportamentais',
  time: '60 min',
  tags: ['comportamental', 'generators', 'singledispatch', 'mediator'],
  tagline: 'Três padrões, três destinos em Python: o Iterator <em>é a linguagem</em>, o Visitor vira <code>singledispatch</code> e o Mediator continua útil.',
  intro: `
    <p>Esta lição reúne três padrões comportamentais que o Python trata de maneiras muito diferentes. O <strong>Iterator</strong> está embutido na linguagem: o protocolo <code>__iter__</code>/<code>__next__</code>, o <code>for</code> e os geradores são a implementação definitiva do padrão, e escrever o GoF à mão é raro. O <strong>Visitor</strong> resolve "adicionar operações novas a uma hierarquia de tipos sem alterá-la", e em Python ganha uma versão idiomática com <code>functools.singledispatch</code> e <code>match/case</code>. O <strong>Mediator</strong> centraliza a comunicação entre objetos que, sem ele, se conheceriam entre si, e continua atual em chats, formulários e orquestração de componentes.</p>
    <p>Para cada um: intenção do GoF, forma clássica, forma pythônica, exemplos reais (<code>ast.NodeVisitor</code>, <code>itertools</code>, Django forms, event buses) e a resposta honesta sobre quando dispensar. Norvig contava o Iterator e o Visitor entre os padrões invisíveis ou simplificados em linguagens dinâmicas.</p>
  `,
  sections: [
    {
      id: 'iterator',
      title: 'Iterator: o padrão que virou a linguagem',
      body: `
        <p>Intenção do GoF: <em>fornecer uma maneira de acessar sequencialmente os elementos de um agregado sem expor sua representação interna.</em></p>
        <p>Em Python isso é o <strong>protocolo de iteração</strong>: um <em>iterável</em> implementa <code>__iter__</code> e devolve um <em>iterador</em>, que implementa <code>__next__</code> (e <code>__iter__</code> devolvendo a si mesmo) e lança <code>StopIteration</code> ao acabar. O <code>for</code>, as compreensões, <code>list()</code>, <code>sum()</code>, o desempacotamento e <code>yield from</code> consomem esse protocolo.</p>
        <pre><code class="language-python">class Countdown:                        # forma manual (rara hoje)
    def __init__(self, start: int) -&gt; None:
        self.start = start

    def __iter__(self):
        return CountdownIterator(self.start)


class CountdownIterator:
    def __init__(self, n: int) -&gt; None:
        self.n = n

    def __iter__(self):
        return self

    def __next__(self) -&gt; int:
        if self.n &lt;= 0:
            raise StopIteration
        self.n -= 1
        return self.n + 1


print(list(Countdown(3)))               # [3, 2, 1]</code></pre>
        <p>A forma idiomática é um <strong>gerador</strong>: a função é a máquina de estados do iterador, e o Python gera <code>__iter__</code> e <code>__next__</code> para você, preguiçosamente.</p>
        <pre><code class="language-python">from typing import Iterator


class Countdown:
    def __init__(self, start: int) -&gt; None:
        self.start = start

    def __iter__(self) -&gt; Iterator[int]:   # __iter__ como gerador: cada for ganha um iterador novo
        n = self.start
        while n &gt; 0:
            yield n
            n -= 1


c = Countdown(3)
print(list(c), list(c))                   # reiterável, ao contrário de um iterador puro</code></pre>
        <div class="callout warn"><strong>PEGADINHA</strong> Iterável não é iterador. Um iterador esgota-se: <code>it = iter(xs); list(it); list(it)</code> dá lista vazia na segunda vez. Um iterável (lista, sua classe com <code>__iter__</code> gerador) devolve iteradores novos a cada <code>iter()</code>. Funções que consomem a entrada duas vezes devem aceitar iterável e não iterador, ou materializar com <code>list()</code>.</div>
        <pre><code class="language-python">import itertools

def read_batches(items, size: int):
    it = iter(items)
    while batch := list(itertools.islice(it, size)):
        yield batch

print(list(read_batches(range(7), 3)))    # [[0,1,2],[3,4,5],[6]]

# 3.12+: itertools.batched
print(list(itertools.batched(range(7), 3)))   # [(0,1,2),(3,4,5),(6,)]</code></pre>
        <p>Iteradores preguiçosos são a base para processar dados maiores que a memória (arquivos linha a linha, paginação de API, streams): memória <code>O(1)</code> em vez de <code>O(n)</code>. <code>itertools</code> (<code>chain</code>, <code>islice</code>, <code>groupby</code>, <code>tee</code>, <code>pairwise</code>) são combinadores sobre o padrão.</p>
        <p><strong>Quando é desnecessário escrever:</strong> quase sempre. Se a classe guarda uma lista, devolva <code>iter(self._items)</code>. Se calcula, use <code>yield</code>. Iterador manual só se precisar de estado extra exposto (como um método <code>peek</code>) ou de compatibilidade com código antigo.</p>
      `
    },
    {
      id: 'visitor',
      title: 'Visitor: operações novas sem tocar nas classes',
      body: `
        <p>Intenção do GoF: <em>representar uma operação a ser executada sobre os elementos de uma estrutura de objetos. Visitor permite definir uma nova operação sem mudar as classes dos elementos sobre os quais opera.</em></p>
        <p>O mecanismo clássico é o <strong>double dispatch</strong>: cada elemento tem <code>accept(visitor)</code> que chama <code>visitor.visit_Tipo(self)</code>, de modo que a operação executada depende dos <em>dois</em> tipos (elemento e visitor). Linguagens como Java precisam disso porque só têm dispatch simples por tipo do receptor.</p>
        <pre><code class="language-python">from __future__ import annotations
from abc import ABC, abstractmethod
from dataclasses import dataclass


class Expr(ABC):
    @abstractmethod
    def accept(self, v: Visitor): ...


@dataclass
class Num(Expr):
    value: float
    def accept(self, v): return v.visit_num(self)


@dataclass
class Add(Expr):
    left: Expr
    right: Expr
    def accept(self, v): return v.visit_add(self)


@dataclass
class Mul(Expr):
    left: Expr
    right: Expr
    def accept(self, v): return v.visit_mul(self)


class Visitor(ABC):
    @abstractmethod
    def visit_num(self, n: Num): ...
    @abstractmethod
    def visit_add(self, n: Add): ...
    @abstractmethod
    def visit_mul(self, n: Mul): ...


class Evaluate(Visitor):
    def visit_num(self, n): return n.value
    def visit_add(self, n): return n.left.accept(self) + n.right.accept(self)
    def visit_mul(self, n): return n.left.accept(self) * n.right.accept(self)


class Show(Visitor):
    def visit_num(self, n): return str(n.value)
    def visit_add(self, n): return f"({n.left.accept(self)} + {n.right.accept(self)})"
    def visit_mul(self, n): return f"({n.left.accept(self)} * {n.right.accept(self)})"


tree = Add(Num(2), Mul(Num(3), Num(4)))
print(tree.accept(Show()), "=", tree.accept(Evaluate()))   # (2.0 + (3.0 * 4.0)) = 14.0</code></pre>
        <p>O custo clássico: adicionar uma <em>operação</em> é fácil (um visitor novo), mas adicionar um <em>tipo</em> de nó obriga a mexer em todos os visitors. É o trade-off do "expression problem": ou você facilita novas operações (Visitor) ou novos tipos (polimorfismo comum), não ambos de graça.</p>
      `
    },
    {
      id: 'visitor-pythonico',
      title: 'Visitor pythônico: singledispatch, match e ast',
      body: `
        <p>Como Python despacha por tipo em tempo de execução, o <code>accept</code> é desnecessário. <code>functools.singledispatch</code> faz o despacho pelo tipo do primeiro argumento, e cada operação é uma função com variantes registradas por tipo. As classes de nó ficam limpas (só dados).</p>
        <pre><code class="language-python">from dataclasses import dataclass
from functools import singledispatch


@dataclass
class Num:
    value: float

@dataclass
class Add:
    left: object
    right: object

@dataclass
class Mul:
    left: object
    right: object


@singledispatch
def evaluate(node) -&gt; float:
    raise TypeError(f"no desconhecido: {type(node).__name__}")

@evaluate.register
def _(node: Num) -&gt; float:
    return node.value

@evaluate.register
def _(node: Add) -&gt; float:
    return evaluate(node.left) + evaluate(node.right)

@evaluate.register
def _(node: Mul) -&gt; float:
    return evaluate(node.left) * evaluate(node.right)


@singledispatch
def show(node) -&gt; str:
    raise TypeError(type(node).__name__)

@show.register
def _(node: Num) -&gt; str: return str(node.value)
@show.register
def _(node: Add) -&gt; str: return f"({show(node.left)} + {show(node.right)})"
@show.register
def _(node: Mul) -&gt; str: return f"({show(node.left)} * {show(node.right)})"


tree = Add(Num(2), Mul(Num(3), Num(4)))
print(show(tree), "=", evaluate(tree))</code></pre>
        <p>Com <code>match/case</code> (3.10+), uma única função com padrões estruturais é ainda mais direta e permite exaustividade verificável por type checkers quando os nós formam uma união fechada:</p>
        <pre><code class="language-python">type Expr = Num | Add | Mul          # PEP 695 (3.12+)


def evaluate_m(e: Expr) -&gt; float:
    match e:
        case Num(v):
            return v
        case Add(l, r):
            return evaluate_m(l) + evaluate_m(r)
        case Mul(l, r):
            return evaluate_m(l) * evaluate_m(r)</code></pre>
        <p>Exemplos reais de Visitor na stdlib e no ecossistema:</p>
        <ul>
          <li><strong><code>ast.NodeVisitor</code> e <code>ast.NodeTransformer</code>:</strong> despacham para <code>visit_Nome</code> pelo nome da classe do nó. É o Visitor clássico por nome de método, usado por linters e ferramentas de análise.</li>
          <li><strong><code>pathlib</code>/<code>os.walk</code>:</strong> a travessia é separada da operação (você escreve o corpo do loop).</li>
          <li><strong><code>json.JSONEncoder.default</code> e <code>singledispatch</code></strong> para serializar tipos.</li>
          <li><strong>Compiladores e transformações de AST</strong> (libcst, ruff internamente em Rust): operações sobre árvore sem mudar os nós.</li>
        </ul>
        <pre><code class="language-python">import ast


class FunctionCounter(ast.NodeVisitor):
    def __init__(self) -&gt; None:
        self.count = 0

    def visit_FunctionDef(self, node: ast.FunctionDef) -&gt; None:
        self.count += 1
        self.generic_visit(node)       # continua descendo nos filhos


tree = ast.parse("def a(): pass\\ndef b():\\n    def c(): pass")
v = FunctionCounter()
v.visit(tree)
print(v.count)    # 3</code></pre>
        <div class="callout tip"><strong>DICA</strong> Escolha a forma pelo eixo de mudança: tipos de nó estáveis e muitas operações novas, use singledispatch/Visitor/match. Muitos tipos novos e poucas operações, prefira métodos nos próprios nós (polimorfismo comum). Em Python dá para misturar: dispatch externo para operações raras, métodos para as centrais.</div>
      `
    },
    {
      id: 'mediator',
      title: 'Mediator: centralizar a comunicação',
      body: `
        <p>Intenção do GoF: <em>definir um objeto que encapsula como um conjunto de objetos interage. Mediator promove acoplamento fraco evitando que os objetos se refiram uns aos outros explicitamente.</em></p>
        <p>Sem mediador, N componentes que precisam conversar acabam com até N x (N-1) referências cruzadas. Com ele, cada componente conhece só o mediador (N referências), e as regras de interação ficam em um único lugar. O exemplo clássico é uma tela de formulário: ao marcar uma caixa, outro campo habilita; ao escolher um país, o seletor de estados recarrega.</p>
        <pre><code class="language-python">from __future__ import annotations


class Mediator:
    def __init__(self) -&gt; None:
        self.components: dict[str, Component] = {}

    def register(self, comp: Component) -&gt; None:
        self.components[comp.name] = comp
        comp.mediator = self

    def notify(self, sender: Component, event: str) -&gt; None:
        # toda a lógica de interação mora aqui
        if sender.name == "country" and event == "changed":
            states = {"BR": ["SP", "RJ"], "US": ["NY", "CA"]}[sender.value]
            self.components["state"].set_options(states)
        if sender.name == "accept_terms" and event == "changed":
            self.components["submit"].enabled = bool(sender.value)


class Component:
    def __init__(self, name: str, value=None) -&gt; None:
        self.name, self.value = name, value
        self.mediator: Mediator | None = None
        self.enabled = True
        self.options: list[str] = []

    def set_options(self, options: list[str]) -&gt; None:
        self.options = options

    def change(self, value) -&gt; None:
        self.value = value
        if self.mediator:
            self.mediator.notify(self, "changed")


m = Mediator()
country, state = Component("country"), Component("state")
terms, submit = Component("accept_terms", False), Component("submit")
for c in (country, state, terms, submit):
    m.register(c)

country.change("BR")
print(state.options)           # ['SP', 'RJ']
terms.change(True)
print(submit.enabled)          # True</code></pre>
        <p>Mediator versus Observer: no Observer o produtor não sabe quem escuta e a comunicação é um-para-muitos, sem lógica central. No Mediator, a lógica de coordenação <strong>está</strong> no mediador, que conhece os colegas e decide o que fazer. Um event bus é mais Observer; um orquestrador de formulário ou um <em>chat room</em> é mais Mediator. Versus Facade: o Facade é unidirecional (cliente para subsistema) e o subsistema não o conhece; no Mediator os colegas falam com o mediador e vice-versa.</p>
        <p>Exemplos reais: o <code>ModelAdmin</code> e os <code>forms</code> do Django coordenam widgets e validações; controladores de UI (Tkinter, Qt) com um controller central; <code>asyncio</code> event loop como mediador entre tarefas e I/O; barramentos de mensagens e <em>saga orchestrators</em> em microsserviços; salas de chat (<code>Room</code> que distribui mensagens).</p>
      `
    },
    {
      id: 'armadilhas',
      title: 'Armadilhas dos três padrões',
      body: `
        <p><strong>Iterator:</strong></p>
        <ul>
          <li>Iteradores esgotam: reutilizar o mesmo objeto numa segunda passada devolve vazio, sem erro.</li>
          <li>Modificar uma coleção enquanto itera (adicionar a um <code>dict</code>) lança <code>RuntimeError</code>; em listas, produz saltos silenciosos. Itere sobre cópia.</li>
          <li>Geradores guardam frame e recursos: se o consumidor abandona o gerador no meio, feche-o (<code>gen.close()</code> ou <code>contextlib.closing</code>) para disparar o <code>finally</code>.</li>
          <li>Exceções dentro de geradores aparecem no ponto de consumo, longe de onde nasceram. Registre contexto.</li>
        </ul>
        <p><strong>Visitor:</strong></p>
        <ul>
          <li><code>singledispatch</code> despacha só pelo <strong>primeiro</strong> argumento, e pela classe (respeitando herança via MRO). Para despacho em dois argumentos use <code>match</code> em tupla ou uma tabela <code>(TipoA, TipoB)</code>.</li>
          <li>Esquecer de tratar um tipo novo falha só em runtime (caindo no caso padrão). Use <code>assert_never</code> no <code>match</code> e um teste que percorre todos os tipos.</li>
          <li>Recursão profunda em árvores grandes: avalie travessia iterativa com pilha explícita.</li>
          <li><code>ast.NodeVisitor</code> não desce nos filhos se você sobrescreve <code>visit_X</code> e não chama <code>generic_visit</code>.</li>
        </ul>
        <p><strong>Mediator:</strong></p>
        <ul>
          <li><strong>God object:</strong> a lógica centralizada tende a inchar. Divida em mediadores por contexto (formulário de endereço, formulário de pagamento).</li>
          <li>Colegas que conhecem detalhes demais do mediador voltam ao acoplamento. Mantenha a interface <code>notify(sender, event)</code> pequena e estável.</li>
          <li>Depuração: o fluxo "ao mudar A, B muda" vive em um <code>if</code> longo. Cubra com testes de cenário.</li>
        </ul>
        <pre><code class="language-python">from typing import assert_never

def describe(e: "Expr") -&gt; str:
    match e:
        case Num():
            return "numero"
        case Add() | Mul():
            return "operacao"
        case _ as unreachable:
            assert_never(unreachable)       # o type checker acusa se faltar um caso</code></pre>
      `
    },
    {
      id: 'decisao',
      title: 'Resumo de decisão e a visão de Norvig',
      body: `
        <table>
          <thead><tr><th>Padrão</th><th>Em Python vira</th><th>Escreva a versão GoF quando</th></tr></thead>
          <tbody>
            <tr><td>Iterator</td><td>Protocolo da linguagem e <code>yield</code></td><td>Quase nunca; só para iterador com estado exposto (peek, rewind)</td></tr>
            <tr><td>Visitor</td><td><code>singledispatch</code> ou <code>match/case</code></td><td>Quando precisa de API de visitor pública e extensível por terceiros (como <code>ast.NodeVisitor</code>)</td></tr>
            <tr><td>Mediator</td><td>Objeto coordenador simples ou event bus</td><td>Quando há muitos colegas com interações complexas e você quer a regra em um lugar</td></tr>
          </tbody>
        </table>
        <p>Norvig, em "Design Patterns in Dynamic Languages", classifica Iterator como "invisível" (embutido na linguagem) e Visitor como simplificado pelo despacho dinâmico por tipo e por funções de primeira classe. Mediator, por outro lado, é essencialmente sobre estrutura de colaboração e sobrevive em qualquer linguagem.</p>
        <p>Perguntas para o dia a dia:</p>
        <ol>
          <li>Preciso percorrer algo sob demanda? Escreva um gerador.</li>
          <li>Preciso de uma operação nova sobre uma hierarquia fechada de tipos? <code>match/case</code> primeiro; <code>singledispatch</code> se quero extensão por registro; Visitor GoF só se uma API pública o exige.</li>
          <li>Os componentes estão se referenciando em teia? Introduza um mediador, mas mantenha-o pequeno e por contexto.</li>
        </ol>
        <div class="callout"><strong>NA ENTREVISTA</strong> "Implemente um iterador sobre uma árvore" é clássica. Mostre a versão recursiva com <code>yield from</code> e, se pedirem, a iterativa com pilha. E tenha pronta a explicação do expression problem para justificar Visitor versus polimorfismo comum.</div>
        <pre><code class="language-python"># iterador de árvore (in-order) com yield from
from dataclasses import dataclass
from typing import Iterator, Optional


@dataclass
class Bst:
    value: int
    left: Optional["Bst"] = None
    right: Optional["Bst"] = None

    def __iter__(self) -&gt; Iterator[int]:
        if self.left:
            yield from self.left
        yield self.value
        if self.right:
            yield from self.right


t = Bst(5, Bst(3, Bst(1)), Bst(8))
print(list(t))     # [1, 3, 5, 8]</code></pre>
      `
    }
  ],
  whenToUse: [
    'Iterator: sempre que um agregado deve ser percorrido sem expor a estrutura (use __iter__ e yield)',
    'Visitor: muitas operações novas sobre uma hierarquia estável de tipos (ASTs, documentos, árvores de regras)',
    'Visitor via singledispatch ou match/case: despacho por tipo sem accept e sem alterar as classes',
    'Mediator: vários componentes interdependentes (formulários, UIs, salas) cujas regras devem ficar em um lugar',
    'Streams e dados maiores que a memória: iteradores preguiçosos com itertools'
  ],
  whenNot: [
    'Iterator escrito à mão quando um gerador ou iter(lista) resolve',
    'Visitor GoF completo (accept) em Python, quando singledispatch ou match bastam',
    'Visitor quando os tipos de nó mudam com frequência: polimorfismo comum é melhor',
    'Mediator que acumula toda a regra de negócio da aplicação (God object)',
    'Mediator para dois colegas apenas: uma chamada direta é mais clara'
  ],
  metrics: [
    'itertools (islice, batched, chain, groupby, tee) e yield from para pipelines preguiçosos',
    'tracemalloc: confirma memória O(1) de iteradores versus O(n) de listas',
    'typing.assert_never com match/case: exaustividade verificada por mypy/pyright',
    'Teste que percorre todos os tipos de nó contra todas as operações registradas',
    'ast.NodeVisitor e ast.NodeTransformer como referência de API de visitor pública'
  ],
  refs: [
    { type: 'portal', title: 'Iterator, refactoring.guru', author: 'Alexander Shvets', url: 'https://refactoring.guru/design-patterns/iterator', note: 'O padrão clássico, útil para comparar com o protocolo do Python.' },
    { type: 'portal', title: 'Visitor, refactoring.guru', author: 'Alexander Shvets', url: 'https://refactoring.guru/design-patterns/visitor', note: 'Double dispatch explicado com diagramas.' },
    { type: 'portal', title: 'Mediator, refactoring.guru', author: 'Alexander Shvets', url: 'https://refactoring.guru/design-patterns/mediator', note: 'Mediator versus Observer e Facade.' },
    { type: 'portal', title: 'The Iterator Pattern, Python Patterns Guide', author: 'Brandon Rhodes', url: 'https://python-patterns.guide/gang-of-four/iterator/', note: 'Como o padrão foi absorvido pela linguagem.' },
    { type: 'portal', title: 'Visitor em Python, refactoring.guru', author: 'Alexander Shvets', url: 'https://refactoring.guru/design-patterns/visitor/python/example', note: 'Implementação comentada do padrão em Python, passo a passo.' },
    { type: 'doc', title: 'ast.NodeVisitor', author: 'Python Software Foundation', url: 'https://docs.python.org/3/library/ast.html#ast.NodeVisitor', note: 'Visitor clássico na stdlib, base de linters e ferramentas.' },
    { type: 'doc', title: 'functools.singledispatch', author: 'Python Software Foundation', url: 'https://docs.python.org/3/library/functools.html#functools.singledispatch', note: 'Despacho por tipo, a forma pythônica do Visitor.' },
    { type: 'doc', title: 'itertools, funções para iteradores eficientes', author: 'Python Software Foundation', url: 'https://docs.python.org/3/library/itertools.html', note: 'Combinadores sobre o padrão Iterator, incluindo batched.' },
    { type: 'artigo', title: 'Design Patterns in Dynamic Languages', author: 'Peter Norvig', url: 'https://norvig.com/design-patterns/', note: 'Iterator invisível e Visitor simplificado em linguagens dinâmicas.' },
    { type: 'livro', title: 'Fluent Python, 2nd ed.', author: 'Luciano Ramalho', url: 'https://www.oreilly.com/library/view/fluent-python-2nd/9781492056348/', note: 'Iteráveis, geradores e o protocolo de iteração, com profundidade.' }
  ]
};
