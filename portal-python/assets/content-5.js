/* Lesson content, Etapa 9 (lições 49 a 57: Architecture patterns)
   Schema: id, title, etapa, etapaName, time, tags, tagline, intro,
   sections[{id,title,body}], whenToUse[], whenNot[], metrics[], refs[]
*/
window.LESSON_CONTENT = window.LESSON_CONTENT || {};

window.LESSON_CONTENT['arquitetura-camadas'] = {
  id: 'arquitetura-camadas',
  title: 'Camadas e Clean Architecture',
  etapa: 9, etapaName: 'Architecture patterns',
  time: '75 min',
  tags: ['arquitetura', 'dependency rule', 'clean architecture', 'camadas'],
  tagline: 'Arquitetura é a <em>direção das dependências</em>: o que muda por motivos de negócio nunca pode importar o que muda por motivos de tecnologia.',
  intro: `<p>Todo sistema que sobrevive tempo suficiente vira um emaranhado. A causa raramente é falta de talento: é que a regra de negócio, o SQL, o JSON do framework web e o cliente HTTP do gateway foram escritos no mesmo arquivo, na mesma função, porque era o caminho mais curto no dia 1. No dia 400, trocar o ORM exige mexer em regra de negócio, e testar uma regra de limite de saldo exige subir banco e servidor.</p>
<p>Esta etapa trata de um único problema com nove ângulos: como manter o <strong>domínio</strong> (o que o negócio faz e por quê) isolado da <strong>infraestrutura</strong> (como persistimos, expomos e integramos). Camadas, hexagonal, repository, service layer, DDD, eventos, CQRS, DI e a decisão entre monólito e microsserviços são variações da mesma ideia: <em>dependências apontam para dentro, para o que é estável</em>.</p>
<p>Ao longo das nove lições usaremos um domínio contínuo, de pagamentos: uma <code>Account</code> com saldo, que aceita <strong>reservas</strong> (holds) de fundos para um pagamento, captura a reserva quando o pagamento liquida e a libera quando falha. É pequeno o bastante para caber em uma tela e rico o bastante para ter invariantes, concorrência, idempotência e integração externa. O código vem do livro-guia desta etapa, <em>Architecture Patterns with Python</em> (Harry Percival e Bob Gregory, cosmicpython.com), adaptado ao setor financeiro.</p>`,
  sections: [
    { id: 'problema', title: 'O problema: tudo no mesmo lugar', body: `<p>Este é o handler que quase todo mundo escreveu. Funciona, passa na demo, e carrega cinco responsabilidades.</p>
<pre><code class="language-python"># ANTES: views.py (FastAPI, SQL cru, regra de negócio e HTTP misturados)
from decimal import Decimal
import psycopg
from fastapi import FastAPI, HTTPException

app = FastAPI()
DSN = "postgresql://app@db/payments"


@app.post("/accounts/{account_id}/reservations")
def reserve(account_id: str, body: dict):
    with psycopg.connect(DSN) as conn:
        row = conn.execute(
            "SELECT balance, holds FROM accounts WHERE id = %s", (account_id,)
        ).fetchone()
        if row is None:
            raise HTTPException(404)
        balance, holds = Decimal(row[0]), row[1]
        if body["payment_id"] in holds:
            return {"ok": True}                      # idempotência no meio do HTTP
        available = balance - sum(Decimal(v) for v in holds.values())
        if available &lt; Decimal(body["amount"]):      # regra de negócio
            raise HTTPException(409, "saldo insuficiente")
        holds[body["payment_id"]] = body["amount"]
        conn.execute("UPDATE accounts SET holds = %s WHERE id = %s", (holds, account_id))
    return {"ok": True}</code></pre>
<p>Quantas razões existem para esse arquivo mudar? A regra de saldo disponível, o formato do JSON, o esquema da tabela, a estratégia de idempotência, a política de erro HTTP. Cinco. O princípio de responsabilidade única (SRP) de Martin diz que um módulo deve ter <em>um motivo para mudar</em>; aqui há cinco, e todos tocam a mesma função. Para testar "reserva acima do saldo é rejeitada" você precisa de Postgres e de um cliente HTTP. Esse teste leva centenas de milissegundos e quebra por motivos que não têm nada a ver com saldo.</p>
<div class="callout warn"><strong>PEGADINHA</strong> O problema não é "SQL no handler" em si. É que a regra de negócio não consegue existir sem a infraestrutura. Se você não consegue instanciar a regra numa linha de teste, ela está acoplada.</div>` },
    { id: 'regra', title: 'A regra de dependência', body: `<p>Robert Martin condensou o essencial em <em>The Clean Architecture</em> (2012, post e depois livro): <strong>dependências de código-fonte só podem apontar para dentro</strong>, em direção às políticas de mais alto nível. Nada em um círculo interno pode saber que algo de um círculo externo existe: nenhum nome, nenhuma classe, nenhuma função, nenhum <code>import</code>.</p>
<p>Em termos de Python isso é verificável, não filosofia: <strong>a regra é uma propriedade do grafo de imports</strong>. O pacote <code>domain</code> não pode importar <code>sqlalchemy</code>, <code>fastapi</code>, <code>pydantic</code>, <code>httpx</code> nem os seus próprios pacotes <code>adapters</code> e <code>entrypoints</code>.</p>
<table>
<thead><tr><th>Camada</th><th>Contém</th><th>Muda por</th><th>Pode importar</th></tr></thead>
<tbody>
<tr><td><code>domain</code></td><td>Entities, value objects, aggregates, domain events, erros de domínio</td><td>Regra de negócio</td><td>Só stdlib e a si mesma</td></tr>
<tr><td><code>application</code></td><td>Casos de uso, handlers, portas (Protocols), message bus</td><td>Fluxo do caso de uso</td><td><code>domain</code></td></tr>
<tr><td><code>adapters</code></td><td>SQLAlchemy, clientes HTTP, filas, e-mail, relógio real</td><td>Tecnologia e vendor</td><td><code>application</code>, <code>domain</code>, libs</td></tr>
<tr><td><code>entrypoints</code></td><td>FastAPI, Django views, CLI, consumers de fila</td><td>Protocolo de entrada</td><td>Tudo abaixo, mais frameworks</td></tr>
</tbody>
</table>
<p>Mas se o caso de uso precisa salvar no banco e o domínio não pode importar o banco, como o fluxo funciona em runtime? Pela <strong>inversão de dependência</strong> (o D de SOLID): o núcleo declara <em>o que precisa</em> (uma porta, um <code>Protocol</code>) e a borda fornece <em>como</em> (um adaptador que implementa essa porta). A seta de controle em runtime vai do caso de uso ao banco; a seta de dependência de código vai do banco ao caso de uso. Essa inversão é o truque inteiro.</p>
<pre><code class="language-text">runtime (fluxo de controle)         código (seta de import)

HTTP -&gt; handler -&gt; repo.add()  ---&gt;   entrypoints --&gt; application --&gt; domain
                       |                  ^               ^
                       v                  |               |
                  SqlRepo (SQL)        adapters ----------+
                                       (implementa a porta que application declara)</code></pre>` },
    { id: 'domain-puro', title: 'Domínio puro em Python', body: `<p>O domínio que usaremos nas nove lições é este. Repare no que <em>não</em> está lá: nenhum import de terceiros, nenhum <code>Session</code>, nenhum <code>BaseModel</code>. Dinheiro é inteiro em menor unidade (centavos), nunca <code>float</code>.</p>
<pre><code class="language-python">from dataclasses import dataclass

from payments.domain import events


class DomainError(Exception):
    pass


class InsufficientFunds(DomainError):
    pass


class CurrencyMismatch(DomainError):
    pass


class UnknownHold(DomainError):
    pass


@dataclass(frozen=True, slots=True)
class Money:
    minor: int  # menor unidade (centavos), nunca float
    currency: str = "BRL"

    def __post_init__(self) -&gt; None:
        if self.minor &lt; 0:
            raise ValueError("Money não pode ser negativo")

    def _same(self, other: "Money") -&gt; None:
        if other.currency != self.currency:
            raise CurrencyMismatch(f"{self.currency} != {other.currency}")

    def __add__(self, other: "Money") -&gt; "Money":
        self._same(other)
        return Money(self.minor + other.minor, self.currency)

    def __sub__(self, other: "Money") -&gt; "Money":
        self._same(other)
        return Money(self.minor - other.minor, self.currency)

    def __lt__(self, other: "Money") -&gt; bool:
        self._same(other)
        return self.minor &lt; other.minor</code></pre>
<p>E o agregado, com a invariante <em>soma das reservas nunca excede o saldo</em> protegida dentro dele:</p>
<pre><code class="language-python">class Account:
    """Aggregate root. Invariante: sum(holds) &lt;= balance."""

    def __init__(self, account_id: str, balance: Money, version: int = 0) -&gt; None:
        self.id = account_id
        self.balance = balance
        self.holds: dict[str, int] = {}
        self.version = version
        self.events: list[events.Event] = []

    @property
    def available(self) -&gt; Money:
        return Money(self.balance.minor - sum(self.holds.values()), self.balance.currency)

    def reserve(self, payment_id: str, amount: Money) -&gt; None:
        if payment_id in self.holds:  # idempotente: mesma chave, mesmo efeito
            return
        if amount.currency != self.balance.currency:
            raise CurrencyMismatch(f"{amount.currency} != {self.balance.currency}")
        if self.available &lt; amount:
            raise InsufficientFunds(f"{self.id}: disponível {self.available.minor}")
        self.holds[payment_id] = amount.minor
        self.events.append(
            events.FundsReserved(self.id, payment_id, amount.minor, amount.currency)
        )</code></pre>
<p>Agora o teste da regra que antes exigia Postgres e HTTP:</p>
<pre><code class="language-python"># tests/unit/test_model.py: roda em microssegundos, sem I/O
import pytest
from payments.domain.model import Account, InsufficientFunds, Money


def test_cannot_reserve_more_than_available():
    acc = Account("a1", Money(1_000))
    with pytest.raises(InsufficientFunds):
        acc.reserve("p1", Money(1_001))


def test_reserve_is_idempotent():
    acc = Account("a1", Money(10_000))
    acc.reserve("p1", Money(3_000))
    acc.reserve("p1", Money(3_000))
    assert acc.available == Money(7_000)</code></pre>
<div class="callout tip"><strong>DICA</strong> Python 3.14 adia a avaliação de anotações (PEP 649 e 749), então referências para tipos ainda não definidos funcionam sem aspas e sem <code>from __future__ import annotations</code>. Em 3.12 e 3.13 as aspas continuam necessárias, como em <code>"Money"</code> acima.</div>` },
    { id: 'depois', title: 'Depois: o handler fino e a estrutura', body: `<p>O mesmo endpoint, agora só traduzindo HTTP para uma chamada de caso de uso e exceções de domínio para status HTTP. (O caso de uso em si é o tema da lição 52, e o wiring, da lição 56.)</p>
<pre><code class="language-python">from collections.abc import Callable

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field

from payments.application.handlers import AccountNotFound
from payments.application.messagebus import MessageBus
from payments.domain import commands
from payments.domain.model import DomainError, InsufficientFunds


class ReserveIn(BaseModel):
    payment_id: str
    amount_minor: int = Field(gt=0)
    currency: str = "BRL"


def create_app(new_bus: Callable[[], MessageBus]) -&gt; FastAPI:
    app = FastAPI()

    @app.post("/accounts/{account_id}/reservations", status_code=201)
    def reserve(account_id: str, body: ReserveIn) -&gt; dict[str, str]:
        cmd = commands.ReserveFunds(
            account_id, body.payment_id, body.amount_minor, body.currency
        )
        try:
            new_bus().handle(cmd)
        except AccountNotFound:
            raise HTTPException(404, "conta inexistente")
        except InsufficientFunds as exc:
            raise HTTPException(409, str(exc))
        except DomainError as exc:
            raise HTTPException(422, str(exc))
        return {"payment_id": body.payment_id}

    return app</code></pre>
<p>A árvore de pastas que reflete as camadas:</p>
<pre><code class="language-text">payments/
  domain/          model.py  events.py  commands.py        # zero dependências externas
  application/     ports.py  handlers.py  messagebus.py    # casos de uso e portas
  adapters/        orm.py  repository.py  uow.py  outbox.py
  entrypoints/     api.py  cli.py
  bootstrap.py                                              # composition root (lição 56)
tests/
  unit/            # usa fakes em memória, milissegundos
  integration/     # SQLite/Postgres de verdade
  e2e/             # sobe a aplicação</code></pre>` },
    { id: 'variantes', title: 'Onion, Clean, Hexagonal: mesma ideia, vocabulários diferentes', body: `<p>Três autores chegaram ao mesmo lugar por caminhos diferentes, e vale conhecer os nomes porque entrevistas e livros misturam os termos.</p>
<table>
<thead><tr><th>Arquitetura</th><th>Autor e ano</th><th>Vocabulário</th><th>Ênfase</th></tr></thead>
<tbody>
<tr><td>Hexagonal (Ports and Adapters)</td><td>Alistair Cockburn, 2005</td><td>Portas, adaptadores, lado que dirige e lado que é dirigido</td><td>Simetria: a aplicação não tem "topo" nem "fundo"; testar sem UI e sem banco</td></tr>
<tr><td>Onion</td><td>Jeffrey Palermo, 2008</td><td>Domain Model no centro, Domain Services, Application Services, Infraestrutura na casca</td><td>Modelo de domínio como centro; inverte a camada de dados do modelo em três camadas clássico</td></tr>
<tr><td>Clean Architecture</td><td>Robert Martin, 2012</td><td>Entities, Use Cases, Interface Adapters, Frameworks and Drivers</td><td>A Dependency Rule explícita e os limites de fronteira</td></tr>
</tbody>
</table>
<p>A diferença para a <strong>arquitetura em três camadas tradicional</strong> (apresentação, negócio, dados) é a direção de uma seta: no modelo clássico a camada de negócio depende da camada de dados (importa o DAO, o ORM). Na versão invertida, os dados dependem do negócio. Martin Fowler descreve o modelo clássico em <em>Presentation Domain Data Layering</em> e é honesto sobre o custo e o benefício de cada formato. Richards e Ford, em <em>Fundamentals of Software Architecture</em>, também distinguem camadas <em>fechadas</em> (cada camada só fala com a imediatamente abaixo) de <em>abertas</em> (pode pular), e apontam o anti-pattern <strong>architecture sinkhole</strong>: requisições que apenas atravessam camadas sem lógica, um sinal de que a camada não paga o aluguel.</p>` },
    { id: 'screaming', title: 'Screaming architecture e organização por contexto', body: `<p>Martin propõe um teste: abra o repositório de um sistema e leia as pastas de nível mais alto. Elas gritam o <em>domínio</em> ("contas, pagamentos, antifraude") ou o <em>framework</em> ("controllers, models, views, serializers")? Um repositório Django típico grita "Django". Isso importa porque a estrutura de pastas é a primeira documentação, e porque ela decide o que muda junto.</p>
<pre><code class="language-text"># Organização por tipo técnico (grita o framework)
app/
  models/   account.py  payment.py  ledger.py
  views/    account.py  payment.py  ledger.py
  schemas/  account.py  payment.py  ledger.py

# Organização por contexto de negócio (grita o domínio)
payments/
  accounts/   domain.py  handlers.py  adapters.py  api.py
  ledger/     domain.py  handlers.py  adapters.py  api.py
  clearing/   domain.py  handlers.py  adapters.py  api.py</code></pre>
<p>Na segunda forma, cada contexto carrega suas próprias camadas, e as fronteiras entre contextos viram a base para a lição 57 (monólito modular e microsserviços). A <strong>lei de Conway</strong> entra aqui: a estrutura do software tende a copiar a estrutura de comunicação da organização que o produz. Se o time de contas e o time de liquidação são diferentes, o código acabará com uma costura ali, quer você a desenhe ou não. Desenhar a costura antes é arquitetura; descobri-la depois, em produção, é dívida.</p>` },
    { id: 'enforcar', title: 'Enforçar a regra, senão ela apodrece', body: `<p>Uma regra que depende de revisão de código humana é uma regra que será violada numa sexta-feira às 17h. Transforme-a em teste. A ferramenta padrão em Python é o <strong>import-linter</strong>, que lê o grafo de imports e falha o CI quando um contrato quebra.</p>
<pre><code class="language-toml"># pyproject.toml
[tool.importlinter]
root_package = "payments"
include_external_packages = true

[[tool.importlinter.contracts]]
name = "Dominio nao importa infraestrutura"
type = "forbidden"
source_modules = ["payments.domain"]
forbidden_modules = [
    "payments.application", "payments.adapters", "payments.entrypoints",
    "sqlalchemy", "fastapi", "pydantic",
]

[[tool.importlinter.contracts]]
name = "Regra de dependencia entre camadas"
type = "layers"
layers = [
    "payments.entrypoints",
    "payments.adapters",
    "payments.application",
    "payments.domain",
]</code></pre>
<p>Rodar <code>lint-imports</code> no CI dá a saída <code>Contracts: 2 kept, 0 broken</code> quando está tudo certo. Se alguém escrever <code>from sqlalchemy import select</code> dentro de <code>domain/</code>, o build quebra com o caminho exato do import ofensor. Alternativa sem dependência extra: um teste com <code>ast</code> que percorre <code>payments/domain/**/*.py</code> e falha se encontrar <code>Import</code> ou <code>ImportFrom</code> fora de uma lista permitida.</p>
<pre><code class="language-python"># tests/test_architecture.py: guarda-costas sem dependência extra
import ast
import pathlib
import sys


def _imports(path: pathlib.Path):
    for node in ast.walk(ast.parse(path.read_text())):
        if isinstance(node, ast.Import):
            yield from (a.name for a in node.names)
        elif isinstance(node, ast.ImportFrom) and node.module and node.level == 0:
            yield node.module


def _allowed(module: str) -&gt; bool:
    top = module.split(".")[0]
    return top in sys.stdlib_module_names or module.startswith("payments.domain")


def test_domain_imports_only_stdlib_and_itself():
    offenders = [
        (p.name, name)
        for p in pathlib.Path("payments/domain").rglob("*.py")
        for name in _imports(p)
        if not _allowed(name)
    ]
    assert offenders == []</code></pre>` },
    { id: 'tradeoffs', title: 'Trade-offs honestos: quanto de arquitetura vale a pena', body: `<p>Camadas custam. Cada fronteira é um mapeamento (domínio para linha de tabela, domínio para JSON), um arquivo a mais e um nível de indireção a seguir quando se depura. Na prática, o custo aparece em três lugares: mais código para uma mudança trivial (adicionar um campo toca modelo, tabela, schema HTTP e mapeamento), curva de entrada para quem chega e a tentação de criar camadas que só repassam chamadas (o sinkhole).</p>
<table>
<thead><tr><th>Situação</th><th>Recomendação</th><th>Por quê</th></tr></thead>
<tbody>
<tr><td>CRUD de cadastro, relatório, backoffice, admin</td><td>Django (ou FastAPI + SQLAlchemy) direto, sem camadas extras</td><td>Não há regra rica para proteger; o framework já é o domínio. Django admin e DRF entregam em dias o que a camada limpa entregaria em semanas</td></tr>
<tr><td>Regras com invariantes, dinheiro, estado, concorrência, múltiplas integrações</td><td>Domínio isolado, portas e adaptadores</td><td>Aqui o teste rápido de regras e a troca de infraestrutura pagam o custo</td></tr>
<tr><td>Protótipo ou validação de hipótese de produto</td><td>Comece simples e extraia o domínio quando a regra aparecer</td><td>Arquitetura prematura é palpite caro. Sinal para extrair: a mesma regra copiada em dois handlers</td></tr>
<tr><td>Sistema de longa vida e vários times</td><td>Camadas mais contratos de import verificados no CI</td><td>Sem enforcement a arquitetura decai em meses</td></tr>
</tbody>
</table>
<p>Uma heurística que uso: <strong>comece pelo domínio puro e pelo caso de uso, e adie o resto</strong>. Você ganha o benefício principal (regra testável sem I/O) com um custo pequeno, e só introduz repository, UoW, eventos e demais peças quando a dor aparecer. Percival e Gregory dizem o mesmo no livro: a complexidade de cada padrão é real e deve ser comprada quando necessária, e o capítulo final do livro trata justamente de "quando isso é demais".</p>
<div class="callout"><strong>NA ENTREVISTA</strong> A pergunta típica é "como você estrutura um serviço para que a regra de negócio seja testável?". A resposta sênior não recita Clean Architecture: nomeia a regra de dependência, mostra que ela é verificável (import-linter), cita a inversão de dependência como o mecanismo, e <em>diz quando não usaria</em> (CRUD, protótipo). Cuidado com o anti-pattern de "interface para tudo": uma porta por classe sem segundo adaptador é cerimônia.</div>` },
  ],
  whenToUse: [
    'Há regras de negócio com invariantes (saldo, limite, estado de pedido) que precisam ser testadas rápido e isoladas',
    'O sistema tem horizonte de anos e vai trocar banco, fila, gateway ou framework pelo menos uma vez',
    'Vários times ou módulos tocam o mesmo código e precisam de fronteiras explícitas',
    'Você quer que o teste de regra rode em milissegundos, sem Postgres nem servidor HTTP',
    'Há integrações externas instáveis (gateways, adquirentes) que precisam ser substituíveis em teste'
  ],
  whenNot: [
    'CRUD puro e backoffice: Django admin, DRF ou FastAPI direto entregam mais rápido e com menos código',
    'Protótipo de descoberta de produto, onde o domínio ainda não existe (extraia depois)',
    'Equipe pequena num serviço de poucas regras: camadas viram sinkhole e só aumentam o custo',
    'Criar interface para toda classe sem segundo adaptador: cerimônia sem benefício',
    'Usar a estrutura como fim: pastas bonitas sem enforcement no CI decaem em meses'
  ],
  metrics: [
    'import-linter (lint-imports): contratos forbidden e layers no CI, falha o build ao violar a regra',
    'pytest com marcadores unit, integration e e2e, e meta de tempo (suíte unit em segundos)',
    'Proporção de testes unit versus e2e (a pirâmide): muitos rápidos, poucos lentos',
    'Grafo de imports: pydeps ou grimp para visualizar ciclos e vazamentos',
    'Sinais de decadência: domínio importando ORM, handlers com SQL, mesma regra duplicada em dois entrypoints'
  ],
  refs: [
    { type: 'livro', title: 'Architecture Patterns with Python', author: 'Harry Percival e Bob Gregory (O\'Reilly)', url: 'https://www.cosmicpython.com/', note: 'O guia desta etapa: domínio, repository, UoW, eventos e CQRS em Python, com o livro inteiro online e gratuito' },
    { type: 'artigo', title: 'The Clean Architecture', author: 'Robert C. Martin', url: 'https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html', note: 'O texto original com a Dependency Rule e o diagrama dos círculos concêntricos' },
    { type: 'artigo', title: 'The Onion Architecture', author: 'Jeffrey Palermo', url: 'https://jeffreypalermo.com/2008/07/the-onion-architecture-part-1/', note: 'A formulação de 2008 que coloca o modelo de domínio no centro' },
    { type: 'artigo', title: 'Screaming Architecture', author: 'Robert C. Martin', url: 'https://blog.cleancoder.com/uncle-bob/2011/09/30/Screaming-Architecture.html', note: 'O teste de abrir o repositório e ler o que as pastas gritam' },
    { type: 'artigo', title: 'Presentation Domain Data Layering', author: 'Martin Fowler', url: 'https://martinfowler.com/bliki/PresentationDomainDataLayering.html', note: 'Camadas clássicas e o custo de cada formato, com a honestidade característica do Fowler' },
    { type: 'livro', title: 'Fundamentals of Software Architecture', author: 'Mark Richards e Neal Ford (O\'Reilly)', url: 'https://www.oreilly.com/library/view/fundamentals-of-software/9781492043447/', note: 'Estilos de arquitetura, camadas abertas e fechadas, o anti-pattern sinkhole e como decidir' },
    { type: 'doc', title: 'import-linter', author: 'David Seddon', url: 'https://import-linter.readthedocs.io/', note: 'Contratos de import verificáveis no CI para impor a regra de dependência' },
    { type: 'video', title: 'Live de Python (canal do Eduardo Mendes)', author: 'Eduardo Mendes (Dunossauro)', url: 'https://www.youtube.com/@Dunossauro', note: 'Lives em português sobre Python, incluindo arquitetura e testes' },
    { type: 'curso', title: 'Clean Code e Clean Architecture', author: 'Rodrigo Branas', url: 'https://branas.io/', note: 'Curso brasileiro que aplica Clean Architecture e TDD na prática' },
  ]
};

window.LESSON_CONTENT['hexagonal'] = {
  id: 'hexagonal',
  title: 'Hexagonal (Ports & Adapters)',
  etapa: 9, etapaName: 'Architecture patterns',
  time: '75 min',
  tags: ['hexagonal', 'ports and adapters', 'Protocol', 'testabilidade'],
  tagline: 'O núcleo da aplicação declara <em>o que precisa</em> em portas; o mundo externo pluga adaptadores. Trocar banco, fila ou gateway vira uma troca de peça.',
  intro: `<p>Alistair Cockburn publicou a arquitetura hexagonal em 2005 com um diagnóstico: o maior problema recorrente do software orientado a objetos era a lógica de negócio vazando para a interface de usuário, e depois para o banco, o que tornava impossível rodar a aplicação com um teste automatizado quando nenhum usuário ou banco estava disponível. A proposta é simétrica: a aplicação fica no centro, e tudo que fala com ela, seja um usuário, um outro sistema, um teste ou um banco, fala através de uma <strong>porta</strong>, por meio de um <strong>adaptador</strong>.</p>
<p>O hexágono não tem significado geométrico. É só um desenho que dá espaço para várias portas nos lados, em vez de um "topo" (UI) e um "fundo" (banco). Essa simetria é a ideia: um teste de integração é só mais um adaptador, e o banco de dados é só mais um ator externo, no mesmo nível de um cliente HTTP.</p>
<p>Esta lição aplica o padrão ao domínio de pagamentos: uma porta para persistência, uma para o gateway de liquidação (o "clearing"), uma para o relógio, com adaptadores reais e fakes em memória. No fim, o mesmo teste de contrato valida os dois adaptadores contra a mesma porta.</p>`,
  sections: [
    { id: 'ideia', title: 'Portas e adaptadores: o vocabulário certo', body: `<p>Cockburn distingue dois lados, e essa distinção organiza todo o resto:</p>
<table>
<thead><tr><th></th><th>Lado que dirige (primary, driving)</th><th>Lado que é dirigido (secondary, driven)</th></tr></thead>
<tbody>
<tr><td>Quem inicia</td><td>O mundo externo chama a aplicação</td><td>A aplicação chama o mundo externo</td></tr>
<tr><td>Exemplos</td><td>FastAPI, CLI, consumer de fila, teste automatizado, cron</td><td>Banco, gateway de pagamento, e-mail, relógio, gerador de id, broker</td></tr>
<tr><td>A porta é...</td><td>A API do caso de uso (handlers, service layer)</td><td>Um <code>Protocol</code> declarado pelo núcleo</td></tr>
<tr><td>Quem define o contrato</td><td>A aplicação</td><td>A aplicação (o adaptador se adapta a ela, não o contrário)</td></tr>
<tr><td>Adaptador</td><td>Traduz protocolo de entrada para chamada de caso de uso</td><td>Traduz a porta para a tecnologia concreta</td></tr>
</tbody>
</table>
<p>O ponto sutil: <strong>a porta do lado dirigido pertence ao núcleo</strong>. É a aplicação que diz "preciso de algo que guarde e recupere contas", e não o ORM que impõe sua forma. É a inversão de dependência da lição anterior, com nome próprio. Em Domain-Driven Design, quando a porta traduz um modelo externo hostil para o seu, isso se chama <em>anti-corruption layer</em> (Evans): o adaptador do gateway é exatamente isso.</p>
<pre><code class="language-text">        entrypoints (adaptadores primários)              adaptadores secundários
   +-----------+  +-----------+  +-----------+          +----------------+
   |  FastAPI  |  |    CLI    |  | Kafka     |          | SQLAlchemy     |
   +-----+-----+  +-----+-----+  +-----+-----+          +--------^-------+
         |              |              |                         |
         v              v              v                implementa a porta
   +----------------------------------------------+     +----------------+
   |   portas de entrada (casos de uso)           |     | AccountRepo    |
   |          NÚCLEO: application + domain        +----&gt;| ClearingGateway|
   |   portas de saída (Protocols) declaradas aqui|     | Clock          |
   +----------------------------------------------+     +----------------+</code></pre>` },
    { id: 'protocol', title: 'Portas em Python: Protocol, não ABC', body: `<p>Em Python você tem duas formas de declarar uma porta. A forma nominal é <code>abc.ABC</code> com <code>@abstractmethod</code>: o adaptador precisa herdar explicitamente. A forma estrutural é <code>typing.Protocol</code>: qualquer classe que tenha os métodos certos satisfaz a porta, sem herdar nada, verificada por mypy ou pyright. Para portas, o Protocol quase sempre é a escolha melhor, porque o adaptador não precisa <em>importar</em> a porta para satisfazê-la, e isso mantém a seta de dependência limpa.</p>
<pre><code class="language-python">from collections.abc import Iterator
from typing import Protocol, Self

from payments.domain.events import Event
from payments.domain.model import Account


class AccountRepository(Protocol):
    seen: set[Account]

    def add(self, account: Account) -&gt; None: ...
    def get(self, account_id: str) -&gt; Account | None: ...


class UnitOfWork(Protocol):
    accounts: AccountRepository

    def __enter__(self) -&gt; Self: ...
    def __exit__(self, *exc_info: object) -&gt; None: ...
    def commit(self) -&gt; None: ...
    def rollback(self) -&gt; None: ...
    def collect_new_events(self) -&gt; Iterator[Event]: ...</code></pre>
<p>E a porta do gateway de liquidação, com os erros também pertencendo à porta (o núcleo não pode conhecer <code>httpx.HTTPStatusError</code> nem um código 422 do vendor):</p>
<pre><code class="language-python">class ClearingRejected(Exception):
    """Erro da porta: o núcleo não conhece códigos HTTP do vendor."""


class ClearingUnavailable(Exception):
    pass


class ClearingGateway(Protocol):
    def submit(self, transfer_id: str, amount_minor: int, currency: str) -&gt; str:
        """Envia a liquidação. Idempotente por transfer_id. Devolve o protocolo do vendor."""
        ...</code></pre>
<div class="callout warn"><strong>PEGADINHA</strong> <code>@runtime_checkable</code> só verifica que os <em>nomes</em> dos métodos existem, não assinaturas nem tipos. <code>isinstance(x, MyPort)</code> passando não garante conformidade. A verificação de verdade é estática: rode mypy ou pyright no CI. Use <code>runtime_checkable</code> apenas quando precisar de <code>isinstance</code> em runtime, e saiba que ele é mais lento que uma checagem nominal.</div>
<p>Quando ABC ainda faz sentido: você quer implementação compartilhada na base (como um template method), ou quer que esquecer de implementar um método falhe na <em>instanciação</em>, com <code>TypeError</code>, e não no checker. Para o resto, Protocol.</p>` },
    { id: 'adaptador', title: 'Adaptador real e adaptador fake', body: `<p>O adaptador real traduz a porta para HTTP. Note o que ele faz além de chamar o vendor: impõe a chave de idempotência (para reenvio seguro), converte falhas de transporte em <code>ClearingUnavailable</code> e o 422 em <code>ClearingRejected</code>. Isso é o trabalho do adaptador: proteger o núcleo da tecnologia e dos detalhes do vendor.</p>
<pre><code class="language-python">import httpx

from payments.application.ports import ClearingRejected, ClearingUnavailable


class HttpClearingGateway:
    def __init__(self, client: httpx.Client) -&gt; None:
        self._client = client

    def submit(self, transfer_id: str, amount_minor: int, currency: str) -&gt; str:
        try:
            resp = self._client.post(
                "/v1/settlements",
                json={"amount": amount_minor, "currency": currency},
                headers={"Idempotency-Key": transfer_id},  # reenvio seguro
                timeout=5.0,
            )
        except httpx.TransportError as exc:  # rede, timeout: tecnologia vira erro da porta
            raise ClearingUnavailable(str(exc)) from exc
        if resp.status_code == 422:
            raise ClearingRejected(resp.json().get("reason", "rejeitado"))
        if resp.status_code &gt;= 500:
            raise ClearingUnavailable(f"vendor {resp.status_code}")
        resp.raise_for_status()
        return resp.json()["protocol"]</code></pre>
<p>O fake é uma classe pequena em memória que respeita a mesma porta. Não é um <code>Mock</code> com expectativas de chamadas: é uma implementação funcional simplificada, com estado verificável.</p>
<pre><code class="language-python">from payments.application.ports import ClearingRejected


class FakeClearingGateway:
    def __init__(self, reject_above: int | None = None) -&gt; None:
        self.calls: dict[str, str] = {}
        self._reject_above = reject_above

    def submit(self, transfer_id: str, amount_minor: int, currency: str) -&gt; str:
        if self._reject_above is not None and amount_minor &gt; self._reject_above:
            raise ClearingRejected("limite")
        return self.calls.setdefault(transfer_id, f"proto-{len(self.calls) + 1}")</code></pre>
<div class="callout tip"><strong>DICA</strong> Prefira <strong>fakes a mocks</strong> (o argumento de Percival e Gregory, e de Fowler em <em>Mocks Aren't Stubs</em>). Um mock verifica <em>como</em> o código chama (acoplado à implementação); um fake verifica <em>o que</em> resultou (acoplado ao comportamento). Refatorar o handler quebra testes com mock e não quebra testes com fake.</div>` },
    { id: 'contrato', title: 'Teste de contrato: o fake não pode mentir', body: `<p>O risco de qualquer fake é divergir do adaptador real: o teste passa com o fake e o sistema falha em produção. A defesa é um <strong>teste de contrato</strong>: a mesma suíte executada contra todas as implementações da porta.</p>
<pre><code class="language-python">import httpx
import pytest

from payments.adapters.gateway import HttpClearingGateway
from payments.application.ports import ClearingRejected, ClearingUnavailable
from tests.fake_gateway import FakeClearingGateway


def _vendor(request: httpx.Request) -&gt; httpx.Response:
    body = request.read()
    if b'"amount":999999' in body.replace(b" ", b""):
        return httpx.Response(422, json={"reason": "limite"})
    key = request.headers["Idempotency-Key"]
    return httpx.Response(200, json={"protocol": f"proto-{key}"})


def _http():
    client = httpx.Client(base_url="http://vendor", transport=httpx.MockTransport(_vendor))
    return HttpClearingGateway(client)


@pytest.fixture(params=["fake", "http"])
def gateway(request):
    return FakeClearingGateway(reject_above=500_000) if request.param == "fake" else _http()


def test_same_transfer_returns_same_protocol(gateway):  # contrato comum
    assert gateway.submit("t1", 100, "BRL") == gateway.submit("t1", 100, "BRL")


def test_over_limit_is_rejected(gateway):
    with pytest.raises(ClearingRejected):
        gateway.submit("t2", 999_999, "BRL")


def test_transport_error_becomes_unavailable():
    def boom(request):
        raise httpx.ConnectError("down")
    gw = HttpClearingGateway(httpx.Client(base_url="http://x", transport=httpx.MockTransport(boom)))
    with pytest.raises(ClearingUnavailable):
        gw.submit("t3", 1, "BRL")</code></pre>
<p>O adaptador HTTP é exercitado com <code>httpx.MockTransport</code>, que intercepta no nível do transporte sem rede. Em um projeto real, você roda a mesma suíte contra o sandbox do vendor em um job noturno, para detectar mudanças de contrato do lado deles. Para contratos entre serviços seus, o padrão é <em>consumer-driven contract testing</em> (Pact), assunto da lição 57.</p>` },
    { id: 'relogio', title: 'Portas pequenas e determinismo: relógio e ids', body: `<p>Tempo e aleatoriedade são infraestrutura. Uma regra como "reserva expira em 15 minutos" chama <code>datetime.now()</code> e vira um teste não determinístico. A cura é uma porta de uma linha.</p>
<pre><code class="language-python">from datetime import datetime, timedelta, timezone
from typing import Protocol


class Clock(Protocol):
    def now(self) -&gt; datetime: ...


class SystemClock:
    def now(self) -&gt; datetime:
        return datetime.now(timezone.utc)


class FrozenClock:
    def __init__(self, at: datetime) -&gt; None:
        self._at = at

    def now(self) -&gt; datetime:
        return self._at

    def advance(self, **kwargs: float) -&gt; None:
        self._at += timedelta(**kwargs)


def is_expired(created_at: datetime, clock: Clock, ttl: timedelta = timedelta(minutes=15)) -&gt; bool:
    return clock.now() - created_at &gt;= ttl


def test_hold_expires_after_ttl():
    clock = FrozenClock(datetime(2026, 11, 13, 12, 0, tzinfo=timezone.utc))
    created = clock.now()
    assert not is_expired(created, clock)
    clock.advance(minutes=15)
    assert is_expired(created, clock)</code></pre>
<p>O mesmo vale para <code>uuid4()</code> e <code>random</code>: injete um <code>IdGenerator</code>. Dentro do domínio puro, prefira receber o tempo ou o id como <em>parâmetro</em> do método, e não chamar a porta de dentro do agregado. Isso mantém o domínio sem dependências, até de portas.</p>` },
    { id: 'drivers', title: 'O lado que dirige: o teste é só outro adaptador', body: `<p>Esta é a consequência mais valiosa. Como o caso de uso é uma porta, qualquer coisa pode chamá-lo, inclusive um teste. Compare duas formas de testar a mesma regra.</p>
<pre><code class="language-python"># Baixa marcha (low gear): fala direto com o domínio, microssegundos
def test_domain_rejects_overdraft():
    acc = Account("a1", Money(100))
    with pytest.raises(InsufficientFunds):
        acc.reserve("p1", Money(101))


# Marcha de cruzeiro: fala com a porta de entrada, usando fakes nas portas de saída
def test_handler_rejects_overdraft():
    uow = FakeUnitOfWork()
    bus = bootstrap(lambda: uow)()
    bus.handle(commands.OpenAccount("a1", 100))
    with pytest.raises(InsufficientFunds):
        bus.handle(commands.ReserveFunds("a1", "p1", 101))


# Alta marcha: HTTP real, poucos e lentos, só o caminho feliz e erros mapeados
def test_api_returns_409(client):
    r = client.post("/accounts/a1/reservations", json={"payment_id": "p1", "amount_minor": 101})
    assert r.status_code == 409</code></pre>
<p>Percival e Gregory chamam isso de escolher a marcha: <em>low gear</em> (domínio) para explorar casos de borda, <em>high gear</em> (service layer) como o grosso da cobertura, e e2e para poucos fluxos críticos. A regra prática que eles dão é testar cada <em>caso de uso</em> pela sua porta de entrada, e só descer ao domínio para as regras com muitas combinações.</p>` },
    { id: 'armadilhas', title: 'Armadilhas e trade-offs', body: `<ul>
<li><strong>Porta que vaza tecnologia.</strong> Se o método do repositório devolve <code>Row</code>, aceita um <code>Select</code> do SQLAlchemy ou expõe <code>Session</code>, a porta está escrita na língua do adaptador. Teste: dá para escrever um fake em 10 linhas sem importar a biblioteca? Se não, a porta vazou.</li>
<li><strong>Porta gorda.</strong> Uma interface <code>Storage</code> com 25 métodos que cada caso de uso usa 2. Separe por papel (Interface Segregation do SOLID): a porta nasce das necessidades do núcleo, não do catálogo do vendor.</li>
<li><strong>Uma porta por classe, sem segundo adaptador.</strong> Se só existe uma implementação e nunca existirá fake, a porta é cerimônia. A régua: o fake para teste já conta como segundo adaptador.</li>
<li><strong>Erros do vendor atravessando.</strong> <code>httpx.ReadTimeout</code> aparecendo num handler de domínio é acoplamento. Traduza no adaptador (como acima).</li>
<li><strong>Custo.</strong> Para um CRUD, ports and adapters é indireção sem retorno: o framework web com ORM já entrega o ciclo curto de desenvolvimento. O padrão compensa quando há regra e integrações que mudam.</li>
</ul>
<div class="callout"><strong>NA ENTREVISTA</strong> "Qual a diferença entre hexagonal e camadas?" Resposta forte: ambas isolam o domínio; camadas dão uma ordem (de cima para baixo) e hexagonal dá uma <em>simetria</em> (dirigido e dirigindo) e o conceito de porta como contrato declarado pelo núcleo. Na prática convivem: as camadas da lição 49 são a organização de pastas, e as portas são o mecanismo que faz a seta de dependência apontar para dentro.</div>` },
  ],
  whenToUse: [
    'O sistema fala com gateways, adquirentes, filas ou APIs de terceiros que precisam ser substituíveis ou simulados em teste',
    'Você quer rodar a suíte de regras em segundos, sem rede, sem banco e sem credenciais',
    'Há mais de uma interface de entrada para o mesmo caso de uso (API HTTP, CLI, consumer de fila, job agendado)',
    'A tecnologia de persistência ou mensageria pode mudar durante a vida do produto',
    'Equipes diferentes são donas do núcleo e dos adaptadores'
  ],
  whenNot: [
    'CRUD simples: a indireção de portas não paga o aluguel',
    'Uma única implementação e nenhuma necessidade de fake: comece com a função direta e extraia a porta quando precisar do segundo adaptador',
    'Criar uma porta por classe só por simetria (interface explosion)',
    'Portas que repetem a API do vendor: você só trocou o nome do acoplamento',
    'Domínio ainda desconhecido: as portas certas só aparecem depois de entender o uso real'
  ],
  metrics: [
    'mypy ou pyright em modo estrito no CI para verificar a conformidade estrutural dos Protocols',
    'Suíte de contrato parametrizada (pytest fixture com params) rodando fake e real',
    'httpx.MockTransport, respx ou pytest-httpserver para testar adaptadores HTTP sem rede',
    'Tempo da suíte unit (meta: segundos) e proporção entre unit, integration e e2e',
    'Sinais de vazamento: imports de sqlalchemy ou httpx em application/, exceções de vendor em handlers'
  ],
  refs: [
    { type: 'artigo', title: 'Hexagonal Architecture', author: 'Alistair Cockburn', url: 'https://alistair.cockburn.us/hexagonal-architecture/', note: 'O texto original de 2005 com a motivação, as portas e os adaptadores, pela mão do autor' },
    { type: 'livro', title: 'Architecture Patterns with Python, cap. 3 e 13', author: 'Harry Percival e Bob Gregory', url: 'https://www.cosmicpython.com/book/chapter_03_abstractions.html', note: 'Abstrações, fakes e injeção de dependência em Python, com testes de baixa e alta marcha' },
    { type: 'artigo', title: 'Mocks Aren\'t Stubs', author: 'Martin Fowler', url: 'https://martinfowler.com/articles/mocksArentStubs.html', note: 'A distinção entre mocks, stubs e fakes, e por que testar estado costuma envelhecer melhor que testar interação' },
    { type: 'doc', title: 'typing.Protocol', author: 'Python Software Foundation', url: 'https://docs.python.org/3/library/typing.html#typing.Protocol', note: 'Referência de subtipagem estrutural, runtime_checkable e as limitações da checagem em runtime' },
    { type: 'doc', title: 'PEP 544: Protocols, structural subtyping', author: 'Ivan Levkivskyi e outros', url: 'https://peps.python.org/pep-0544/', note: 'A especificação e a justificativa do duck typing estático' },
    { type: 'livro', title: 'Domain-Driven Design', author: 'Eric Evans', url: 'https://www.domainlanguage.com/ddd/', note: 'Origem do anti-corruption layer, o papel do adaptador que protege o modelo de um sistema externo' },
    { type: 'doc', title: 'httpx: MockTransport', author: 'Encode', url: 'https://www.python-httpx.org/advanced/transports/#mock-transports', note: 'Como testar clientes HTTP em nível de transporte, sem rede' },
    { type: 'video', title: 'Live de Python (canal do Eduardo Mendes)', author: 'Eduardo Mendes (Dunossauro)', url: 'https://www.youtube.com/@Dunossauro', note: 'Lives em português sobre Python, testes e estrutura de projetos' },
  ]
};

window.LESSON_CONTENT['repository-uow'] = {
  id: 'repository-uow',
  title: 'Repository e Unit of Work',
  etapa: 9, etapaName: 'Architecture patterns',
  time: '90 min',
  tags: ['repository', 'unit of work', 'SQLAlchemy', 'transações'],
  tagline: 'O Repository faz o banco parecer uma <em>coleção de agregados em memória</em>; a Unit of Work decide o que é uma transação atômica.',
  intro: `<p>O domínio puro da lição 49 não sabe que o banco existe. Alguém precisa buscar a <code>Account</code>, entregá-la ao caso de uso e, no fim, persistir a mudança de forma atômica. Dois padrões do catálogo de Fowler (<em>Patterns of Enterprise Application Architecture</em>, 2002) fazem isso: o <strong>Repository</strong>, que dá a ilusão de uma coleção em memória, e a <strong>Unit of Work</strong>, que rastreia o que mudou e confirma tudo ou nada. Evans, no <em>Domain-Driven Design</em>, formalizou o Repository para agregados: um repositório por <em>aggregate root</em>, nunca por tabela.</p>
<p>Aqui está o ponto que separa uso consciente de uso por moda: em SQLAlchemy, a <code>Session</code> já é uma Unit of Work com identity map, e já se comporta como um repositório genérico. Embrulhá-la tem custo. O benefício é específico: <strong>o núcleo passa a depender de uma porta pequena que você consegue substituir por um fake em memória</strong>, e a fronteira transacional ganha um nome no vocabulário do domínio. Se você não precisa de nenhum dos dois, não pague.</p>
<p>Nesta lição: mapeamento imperativo do SQLAlchemy 2.x (domínio sem herdar de <code>DeclarativeBase</code>), repositório, UoW como context manager, o fake gêmeo, controle de concorrência otimista e pessimista, e uma armadilha real de <code>MutableDict</code> que custa horas se você não a conhece.</p>`,
  sections: [
    { id: 'repository', title: 'Repository: coleção de agregados, não DAO', body: `<p>Um DAO expõe operações de tabela (<code>insert</code>, <code>update_balance</code>, <code>find_by_x_and_y</code>). Um Repository expõe <em>uma coleção de agregados</em>: <code>add</code> e <code>get</code>, mais algumas consultas com nome de negócio quando necessárias. Não há <code>update</code>: você busca o agregado, chama um método de domínio e o rastreamento da UoW detecta a mudança. O contrato do núcleo é este, repetido da lição 50:</p>
<pre><code class="language-python">class AccountRepository(Protocol):
    seen: set[Account]

    def add(self, account: Account) -&gt; None: ...
    def get(self, account_id: str) -&gt; Account | None: ...


class UnitOfWork(Protocol):
    accounts: AccountRepository

    def __enter__(self) -&gt; Self: ...
    def __exit__(self, *exc_info: object) -&gt; None: ...
    def commit(self) -&gt; None: ...
    def rollback(self) -&gt; None: ...
    def collect_new_events(self) -&gt; Iterator[Event]: ...</code></pre>
<p>O adaptador SQLAlchemy. Note que <code>seen</code> guarda os agregados que passaram por aqui, e é por ele que a UoW descobrirá os eventos de domínio (lição 54):</p>
<pre><code class="language-python">from sqlalchemy import select
from sqlalchemy.orm import Session

from payments.domain.model import Account


class SqlAlchemyAccountRepository:
    def __init__(self, session: Session) -&gt; None:
        self.session = session
        self.seen: set[Account] = set()

    def add(self, account: Account) -&gt; None:
        self.session.add(account)
        self.seen.add(account)

    def get(self, account_id: str) -&gt; Account | None:
        stmt = select(Account).where(Account.id == account_id)
        account = self.session.scalars(stmt).first()
        if account is not None:
            self.seen.add(account)
        return account</code></pre>
<div class="callout warn"><strong>PEGADINHA</strong> O erro mais comum é criar um repositório por <em>tabela</em> ou por <em>entidade interna</em> do agregado, e deixar o código de aplicação montar o agregado juntando peças. O repositório devolve o <strong>agregado inteiro</strong>, consistente, pela sua raiz. Se você tem <code>HoldRepository</code> ao lado de <code>AccountRepository</code>, a invariante "soma das reservas não excede o saldo" deixou de ter um dono.</div>` },
    { id: 'mapeamento', title: 'Mapeamento imperativo: o ORM depende do domínio', body: `<p>O mapeamento declarativo clássico faz <code>class Account(Base)</code>: o domínio herda do ORM, ou seja, o domínio importa SQLAlchemy, quebrando a regra de dependência. A alternativa é o <strong>mapeamento imperativo</strong> (<code>registry.map_imperatively</code>): as tabelas e o mapeamento vivem em <code>adapters/orm.py</code>, e a classe de domínio continua uma classe Python comum. Dependência invertida: o ORM aponta para o modelo.</p>
<pre><code class="language-python">from sqlalchemy import JSON, Column, Integer, MetaData, String, Table, event
from sqlalchemy.ext.mutable import MutableDict
from sqlalchemy.orm import composite, registry

from payments.domain.model import Account, Money

metadata = MetaData()
mapper_registry = registry(metadata=metadata)

accounts = Table(
    "accounts",
    metadata,
    Column("id", String(36), primary_key=True),
    Column("balance_minor", Integer, nullable=False),
    Column("currency", String(3), nullable=False),
    Column("holds", MutableDict.as_mutable(JSON), nullable=False),
    Column("version", Integer, nullable=False),
)


_started = False


def start_mappers() -&gt; None:
    global _started
    if _started:  # o mapeamento é global ao processo: uma vez só
        return
    _started = True
    mapper_registry.map_imperatively(
        Account,
        accounts,
        properties={
            "balance": composite(Money, accounts.c.balance_minor, accounts.c.currency),
        },
        version_id_col=accounts.c.version,
    )


@event.listens_for(Account, "load")
def _init_events_on_load(account: Account, _context: object) -&gt; None:
    account.events = []  # __init__ não roda quando o ORM reidrata</code></pre>
<p>Quatro detalhes que o código acima resolve e que são fonte de bugs:</p>
<ul>
<li><strong><code>composite</code></strong> mapeia o value object <code>Money</code> para duas colunas (<code>balance_minor</code>, <code>currency</code>). Como <code>Money</code> é um dataclass imutável, a troca do valor é uma atribuição, e o SQLAlchemy detecta a mudança.</li>
<li><strong><code>version_id_col</code></strong> é o controle de concorrência otimista, abordado abaixo.</li>
<li><strong>O listener de <code>load</code></strong> existe porque, quando o ORM reidrata um objeto, <em>não chama <code>__init__</code></em>. Sem esse listener, <code>account.events</code> não existiria em objetos carregados do banco e <code>reserve()</code> falharia com <code>AttributeError</code>. É o mesmo truque do livro de Percival e Gregory.</li>
<li><strong><code>MutableDict.as_mutable(JSON)</code></strong> faz mutações no dicionário <code>holds</code> marcarem a linha como suja. Em produção com Postgres, use <code>JSONB</code>, ou modele as reservas como tabela filha se precisar consultá-las por SQL.</li>
</ul>
<div class="callout warn"><strong>PEGADINHA</strong> Descobri este em teste: <code>clear_mappers()</code> entre testes <em>desliga silenciosamente</em> o rastreamento do <code>MutableDict</code> no segundo mapeamento, e mutações em <code>holds</code> deixam de gerar <code>UPDATE</code>. O sintoma é um teste de concorrência otimista que "passa" sem levantar <code>StaleDataError</code>, e dados que não persistem. O mapeamento é global ao processo: chame <code>start_mappers()</code> uma vez (por isso a flag <code>_started</code>) e crie o engine por teste, nunca os mappers.</div>` },
    { id: 'uow', title: 'Unit of Work como context manager', body: `<p>A UoW define o <strong>limite da transação</strong>. O padrão idiomático em Python é o context manager: entrar abre a sessão, sair sem <code>commit()</code> explícito desfaz tudo. Isso inverte o default perigoso: esquecer o commit perde dados (visível em teste), em vez de persistir parcialmente.</p>
<pre><code class="language-python">from collections.abc import Callable, Iterator
from typing import Self

from sqlalchemy import insert
from sqlalchemy.orm import Session

from payments.adapters.outbox import outbox, to_integration_message

from payments.adapters.repository import SqlAlchemyAccountRepository
from payments.domain.events import Event


class SqlAlchemyUnitOfWork:
    def __init__(self, session_factory: Callable[[], Session]) -&gt; None:
        self._session_factory = session_factory

    def __enter__(self) -&gt; Self:
        self.session = self._session_factory()
        self.accounts = SqlAlchemyAccountRepository(self.session)
        return self

    def __exit__(self, *exc_info: object) -&gt; None:
        self.session.rollback()  # sem commit explícito, nada persiste
        self.session.close()

    def commit(self) -&gt; None:
        # outbox na MESMA transação do agregado: estado e mensagem, ou nada
        for account in self.accounts.seen:
            for event in account.events:  # espia sem consumir
                if (msg := to_integration_message(event)) is not None:
                    topic, payload = msg
                    self.session.execute(insert(outbox).values(topic=topic, payload=payload))
        self.session.commit()

    def rollback(self) -&gt; None:
        self.session.rollback()

    def collect_new_events(self) -&gt; Iterator[Event]:
        for account in self.accounts.seen:
            while account.events:
                yield account.events.pop(0)</code></pre>
<p>Três decisões de design a registrar:</p>
<ul>
<li><strong>Rollback por padrão no <code>__exit__</code></strong>: se <code>commit()</code> já foi chamado, o rollback é no-op; se houve exceção ou o commit foi esquecido, nada persiste.</li>
<li><strong>Um UoW por unidade de trabalho, não por processo.</strong> Esta classe guarda a <code>session</code> em <code>self</code>, então compartilhar a mesma instância entre threads ou tarefas concorrentes é um bug. A composition root da lição 56 entrega um UoW novo por mensagem.</li>
<li><strong><code>commit()</code> também escreve o outbox</strong> na mesma transação (lição 54): estado e mensagem confirmam juntos ou não confirmam.</li>
</ul>
<p>O caso de uso fica assim, e é aqui que o ganho aparece: nenhuma menção a SQL, sessão ou ORM.</p>
<pre><code class="language-python">def reserve_funds(cmd: commands.ReserveFunds, uow: UnitOfWork) -&gt; None:
    with uow:
        account = uow.accounts.get(cmd.account_id)
        if account is None:
            raise AccountNotFound(cmd.account_id)
        account.reserve(cmd.payment_id, Money(cmd.amount_minor, cmd.currency))
        uow.commit()</code></pre>` },
    { id: 'fake', title: 'O fake gêmeo e os testes', body: `<p>O mesmo contrato, implementado em memória. Esta é a peça que faz a suíte de casos de uso rodar em milissegundos:</p>
<pre><code class="language-python">from collections.abc import Iterator
from typing import Self

from payments.domain.events import Event
from payments.domain.model import Account


class FakeAccountRepository:
    def __init__(self, accounts: list[Account] | None = None) -&gt; None:
        self._accounts = {a.id: a for a in accounts or []}
        self.seen: set[Account] = set()

    def add(self, account: Account) -&gt; None:
        self._accounts[account.id] = account
        self.seen.add(account)

    def get(self, account_id: str) -&gt; Account | None:
        account = self._accounts.get(account_id)
        if account is not None:
            self.seen.add(account)
        return account


class FakeUnitOfWork:
    def __init__(self) -&gt; None:
        self.accounts = FakeAccountRepository()
        self.committed = False

    def __enter__(self) -&gt; Self:
        return self

    def __exit__(self, *exc_info: object) -&gt; None:
        self.rollback()

    def commit(self) -&gt; None:
        self.committed = True

    def rollback(self) -&gt; None:
        pass

    def collect_new_events(self) -&gt; Iterator[Event]:
        for account in self.accounts.seen:
            while account.events:
                yield account.events.pop(0)</code></pre>
<pre><code class="language-python"># tests/unit/test_handlers.py (trecho): nenhum I/O, nenhum SQLAlchemy
def test_reserve_commits_and_dispatches_event():
    bus, uow, notes = make_bus()
    bus.handle(commands.OpenAccount("a1", 10_000))
    bus.handle(commands.ReserveFunds("a1", "p1", 4_000))
    assert uow.committed
    assert uow.accounts.get("a1").available.minor == 6_000</code></pre>
<p>E o teste de integração contra um banco de verdade (SQLite aqui para portabilidade; em CI use Postgres via Docker ou <code>testcontainers</code>, porque dialetos diferem em isolamento, tipos JSON e <code>FOR UPDATE</code>):</p>
<pre><code class="language-python">import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.orm.exc import StaleDataError

from payments.adapters import orm
from payments.adapters.uow import SqlAlchemyUnitOfWork
from payments.domain.model import Account, Money


@pytest.fixture
def session_factory(tmp_path):
    orm.start_mappers()
    engine = create_engine(f"sqlite+pysqlite:///{tmp_path / 'test.db'}")
    orm.metadata.create_all(engine)
    return sessionmaker(engine)


def test_roundtrip(session_factory):
    uow = SqlAlchemyUnitOfWork(session_factory)
    with uow:
        acc = Account("a1", Money(10_000))
        acc.reserve("p1", Money(2_500))
        uow.accounts.add(acc)
        uow.commit()
    with uow:
        loaded = uow.accounts.get("a1")
        assert loaded.balance == Money(10_000)
        assert loaded.holds == {"p1": 2_500}
        assert loaded.available == Money(7_500)
        assert loaded.events == []


def test_rollback_by_default(session_factory):
    uow = SqlAlchemyUnitOfWork(session_factory)
    with uow:
        uow.accounts.add(Account("a1", Money(1)))
    with uow:
        assert uow.accounts.get("a1") is None


def test_optimistic_lock(session_factory):
    uow = SqlAlchemyUnitOfWork(session_factory)
    with uow:
        uow.accounts.add(Account("a1", Money(10_000)))
        uow.commit()
    s1, s2 = session_factory(), session_factory()
    a1 = s1.get(Account, "a1")
    a2 = s2.get(Account, "a1")
    a1.reserve("p1", Money(1))
    a2.reserve("p2", Money(1))
    s1.commit()
    with pytest.raises(StaleDataError):
        s2.commit()</code></pre>
<p>A pirâmide resultante: dezenas de testes de domínio e casos de uso com o fake (rápidos), um punhado de testes de integração do adaptador (verificam o mapeamento, o rollback e a concorrência), e poucos e2e.</p>` },
    { id: 'concorrencia', title: 'Concorrência: otimista versus pessimista', body: `<p>Duas requisições reservando fundos da mesma conta ao mesmo tempo: ambas leem o saldo disponível de 100, ambas aprovam uma reserva de 80. Sem controle, há descoberto. Há duas estratégias principais.</p>
<table>
<thead><tr><th></th><th>Otimista (versão)</th><th>Pessimista (SELECT FOR UPDATE)</th></tr></thead>
<tbody>
<tr><td>Mecanismo</td><td><code>UPDATE ... WHERE version = :lida</code>; zero linhas afetadas vira <code>StaleDataError</code></td><td>Trava a linha na leitura; a outra transação espera</td></tr>
<tr><td>Custo sem conflito</td><td>Praticamente zero, sem espera</td><td>Trava sempre, mesmo sem disputa</td></tr>
<tr><td>Sob alta disputa na mesma linha</td><td>Muitos retries e trabalho jogado fora</td><td>Fila ordenada, previsível</td></tr>
<tr><td>Quando</td><td>Conflito raro (a maioria das contas)</td><td>Conta quente (conta de liquidação, estoque de um item disputado)</td></tr>
<tr><td>Falha</td><td>Você precisa de retry</td><td>Risco de deadlock se a ordem de travas diferir</td></tr>
</tbody>
</table>
<p>O teste de integração acima já demonstra o otimista: duas sessões leem a versão 1, a primeira confirma, a segunda recebe <code>StaleDataError</code>. A aplicação deve tratar essa exceção com retry limitado, relendo o agregado e reavaliando a regra:</p>
<pre><code class="language-python">from sqlalchemy.orm.exc import StaleDataError


def handle_with_retry(bus_factory, command, attempts: int = 3) -&gt; None:
    for attempt in range(1, attempts + 1):
        try:
            bus_factory().handle(command)  # uma UoW nova a cada tentativa
            return
        except StaleDataError:
            if attempt == attempts:
                raise  # esgotou: devolve 409/503 e deixa o cliente decidir</code></pre>
<p>A variante pessimista é um método a mais na porta, nomeado pela intenção, implementado com <code>with_for_update()</code> (Postgres e MySQL; SQLite ignora a cláusula):</p>
<pre><code class="language-python">def get_for_update(self, account_id: str) -&gt; Account | None:
    stmt = select(Account).where(Account.id == account_id).with_for_update()
    account = self.session.scalars(stmt).first()
    if account is not None:
        self.seen.add(account)
    return account</code></pre>
<div class="callout tip"><strong>DICA</strong> O nível de isolamento importa. O padrão do Postgres é <em>READ COMMITTED</em>: o cenário do descoberto acima é possível sem versão ou lock. Em <em>SERIALIZABLE</em> o banco aborta uma das transações com erro de serialização, e o retry passa a ser obrigatório. Kleppmann, em <em>Designing Data-Intensive Applications</em> (cap. 7), é a referência para entender write skew e o que cada nível realmente garante.</div>` },
    { id: 'armadilhas', title: 'Armadilhas e quando não usar', body: `<ul>
<li><strong>Repositório que devolve ORM row ou query.</strong> O núcleo recebe agregados, não <code>Row</code>. Se o chamador precisa de <code>.filter()</code>, a abstração vazou.</li>
<li><strong>Repositório fazendo commit.</strong> Quem confirma é a UoW, no fim do caso de uso. Commit dentro do repositório destrói a atomicidade entre agregados e eventos.</li>
<li><strong>Consultas de leitura pesadas no repositório.</strong> Telas, listagens e relatórios não precisam reidratar agregados. Eles pertencem ao lado de leitura (CQRS, lição 55), com SQL direto.</li>
<li><strong>Autoflush e identity map.</strong> A Session agrupa e adia SQL; falhas de constraint aparecem no <code>flush</code>, não na linha que mudou o objeto. Em testes de integração, chame <code>commit()</code> para forçar o SQL.</li>
<li><strong>Async.</strong> Com <code>AsyncSession</code> a UoW vira <code>async with</code> e <code>__aenter__/__aexit__</code>; a porta e o fake mudam para <code>async def</code>. Decida cedo: migrar depois toca todo o núcleo.</li>
<li><strong>Quando NÃO usar.</strong> Se o serviço é um CRUD de uma tabela, <code>session.add()</code> direto num endpoint ou o ORM do Django são mais simples e igualmente testáveis com um banco SQLite em memória. O Django ORM, por ser Active Record, não combina bem com repositório sobre modelos de domínio puros: ali, prefira a abordagem Django idiomática.</li>
</ul>
<div class="callout"><strong>NA ENTREVISTA</strong> "Repository sobre SQLAlchemy não é redundante?" A resposta madura: parcialmente, sim. A Session já é UoW e identity map. O que você compra é inversão (o núcleo depende de uma porta) e substituibilidade (fake em memória). Se o time nunca escreve esses fakes e sempre testa contra banco real, o repositório é cerimônia. E sempre fale da transação: onde ela começa, quem confirma, e o que acontece sob concorrência.</div>` },
  ],
  whenToUse: [
    'O domínio tem agregados com invariantes e você quer testar casos de uso sem banco',
    'A fronteira transacional precisa ser explícita e obrigatoriamente atômica (agregado mais outbox)',
    'Há risco de concorrência no mesmo agregado e a estratégia (otimista ou pessimista) deve ser parte do design',
    'Você quer trocar ou migrar a persistência sem tocar nas regras',
    'Vários entrypoints compartilham os mesmos casos de uso e a mesma semântica transacional'
  ],
  whenNot: [
    'CRUD de uma tabela: use o ORM direto no endpoint',
    'Django com Active Record e modelos fortemente acoplados ao ORM: use a forma idiomática do framework',
    'Consultas de leitura, relatórios e listagens: SQL direto (lado de leitura), sem reidratar agregados',
    'Um repositório por tabela: o agregado perde o dono da invariante',
    'Repositório genérico com filter e query exposta: é o ORM com outro nome'
  ],
  metrics: [
    'pytest com fixtures de engine por teste e mappers iniciados uma vez por processo',
    'Postgres real em CI (Docker, testcontainers) para validar isolamento, JSONB e FOR UPDATE',
    'SQLAlchemy echo ou o evento before_cursor_execute para auditar SQL emitido por caso de uso',
    'Taxa de StaleDataError e de retries em produção como sinal de contenção',
    'alembic para migrações; revisar sempre o plano de execução de consultas quentes (EXPLAIN)'
  ],
  refs: [
    { type: 'livro', title: 'Architecture Patterns with Python, cap. 2 e 6', author: 'Harry Percival e Bob Gregory', url: 'https://www.cosmicpython.com/book/chapter_02_repository.html', note: 'Repository e Unit of Work em Python com SQLAlchemy, a base do código desta lição' },
    { type: 'livro', title: 'Patterns of Enterprise Application Architecture', author: 'Martin Fowler', url: 'https://martinfowler.com/books/eaa.html', note: 'O catálogo original: Repository, Unit of Work, Identity Map, Data Mapper' },
    { type: 'artigo', title: 'Repository', author: 'Martin Fowler', url: 'https://martinfowler.com/eaaCatalog/repository.html', note: 'A definição curta do padrão como coleção em memória' },
    { type: 'artigo', title: 'Unit of Work', author: 'Martin Fowler', url: 'https://martinfowler.com/eaaCatalog/unitOfWork.html', note: 'O padrão que rastreia mudanças e coordena a escrita' },
    { type: 'doc', title: 'SQLAlchemy: Imperative Mapping', author: 'SQLAlchemy', url: 'https://docs.sqlalchemy.org/en/20/orm/mapping_styles.html#imperative-mapping', note: 'Referência do map_imperatively e do estilo de mapeamento sem herança de Base' },
    { type: 'doc', title: 'SQLAlchemy: Configuring a Version Counter', author: 'SQLAlchemy', url: 'https://docs.sqlalchemy.org/en/20/orm/versioning.html', note: 'Controle de concorrência otimista com version_id_col' },
    { type: 'livro', title: 'Designing Data-Intensive Applications', author: 'Martin Kleppmann', url: 'https://dataintensive.net/', note: 'Capítulo 7 sobre transações, níveis de isolamento e anomalias de concorrência' },
    { type: 'livro', title: 'Domain-Driven Design', author: 'Eric Evans', url: 'https://www.domainlanguage.com/ddd/', note: 'Repository por aggregate root e o papel do agregado como fronteira de consistência' },
  ]
};

window.LESSON_CONTENT['service-layer'] = {
  id: 'service-layer',
  title: 'Service Layer',
  etapa: 9, etapaName: 'Architecture patterns',
  time: '60 min',
  tags: ['service layer', 'casos de uso', 'comandos', 'orquestração'],
  tagline: 'O caso de uso <em>orquestra</em> e o domínio <em>decide</em>. Quem confunde os dois acaba com controladores gordos ou com um modelo anêmico.',
  intro: `<p>Depois de isolar o domínio (lição 49), declarar portas (50) e persistir com repository e UoW (51), falta uma peça: quem coordena? Alguém precisa buscar o agregado, chamar o método de domínio, confirmar a transação e despachar efeitos. Se essa coordenação ficar no handler HTTP, você terá que duplicá-la quando surgir a CLI, o consumer de fila ou o job agendado. Se ficar no modelo de domínio, ele passa a conhecer repositórios e transações, e a regra de dependência quebra.</p>
<p>A <strong>Service Layer</strong> (Fowler, PoEAA) é essa fronteira: define o conjunto de operações que a aplicação oferece, e coordena a resposta de cada uma. No vocabulário hexagonal da lição 50, é a <em>porta de entrada</em>. Percival e Gregory a tratam como o local onde vive o grosso dos testes, usando fakes nas portas de saída.</p>
<p>Esta lição separa três coisas que costumam se misturar: <strong>lógica de domínio</strong> (regras), <strong>orquestração</strong> (fluxo, transação, I/O) e <strong>tradução de protocolo</strong> (HTTP, CLI). E é honesta sobre quando a camada é supérflua.</p>`,
  sections: [
    { id: 'responsabilidade', title: 'O que vive onde', body: `<table>
<thead><tr><th>Responsabilidade</th><th>Onde</th><th>Exemplo em pagamentos</th></tr></thead>
<tbody>
<tr><td>Validar formato de entrada</td><td>Entrypoint (Pydantic, form)</td><td>amount_minor é inteiro positivo</td></tr>
<tr><td>Buscar agregado, abrir e confirmar transação</td><td>Service layer (handler)</td><td>get, reserve, commit</td></tr>
<tr><td>Decidir se a operação é permitida</td><td>Domínio</td><td>Saldo disponível cobre a reserva</td></tr>
<tr><td>Traduzir exceção de domínio para protocolo</td><td>Entrypoint</td><td>InsufficientFunds vira HTTP 409</td></tr>
<tr><td>Efeitos secundários (notificar, publicar)</td><td>Handlers de evento</td><td>FundsReserved enfileira mensagem</td></tr>
</tbody>
</table>
<p>Um teste de bolso: se o handler tem um <code>if</code> que compara valores de negócio (saldo, limite, estado), a regra vazou do domínio para a orquestração. Se o handler tem mais de uma dúzia de linhas e várias chamadas a infraestrutura, a orquestração ficou gorda e talvez deva ser quebrada em eventos.</p>` },
    { id: 'handlers', title: 'Handlers: um caso de uso, uma função', body: `<p>Cada caso de uso recebe um <strong>comando</strong> (um dataclass imutável com a intenção do chamador) e as portas de que precisa. Comandos nomeados no imperativo (<code>ReserveFunds</code>) deixam claro que podem ser rejeitados, ao contrário de eventos (passado, fato consumado), tema da lição 54.</p>
<pre><code class="language-python">from dataclasses import dataclass


class Command:
    """Marca uma intenção: pode ser rejeitada."""


@dataclass(frozen=True, slots=True)
class OpenAccount(Command):
    account_id: str
    balance_minor: int
    currency: str = "BRL"


@dataclass(frozen=True, slots=True)
class ReserveFunds(Command):
    account_id: str
    payment_id: str
    amount_minor: int
    currency: str = "BRL"


@dataclass(frozen=True, slots=True)
class CapturePayment(Command):
    account_id: str
    payment_id: str</code></pre>
<pre><code class="language-python">from payments.application.ports import UnitOfWork
from payments.domain import commands, events
from payments.domain.model import Account, Money


class AccountNotFound(Exception):
    pass


def open_account(cmd: commands.OpenAccount, uow: UnitOfWork) -&gt; None:
    with uow:
        uow.accounts.add(Account(cmd.account_id, Money(cmd.balance_minor, cmd.currency)))
        uow.commit()


def reserve_funds(cmd: commands.ReserveFunds, uow: UnitOfWork) -&gt; None:
    with uow:
        account = uow.accounts.get(cmd.account_id)
        if account is None:
            raise AccountNotFound(cmd.account_id)
        account.reserve(cmd.payment_id, Money(cmd.amount_minor, cmd.currency))
        uow.commit()


def capture_payment(cmd: commands.CapturePayment, uow: UnitOfWork) -&gt; None:
    with uow:
        account = uow.accounts.get(cmd.account_id)
        if account is None:
            raise AccountNotFound(cmd.account_id)
        account.capture(cmd.payment_id)
        uow.commit()</code></pre>
<p>Em Python, a forma natural é <strong>uma função por caso de uso</strong>, com dependências como parâmetros. Não há necessidade de uma classe <code>PaymentService</code> com 15 métodos e construtor de 8 dependências: isso é um Java-ismo que vira acoplamento (cada método carrega todas as dependências, e a classe cresce sem limite). Uma classe só se justifica quando o caso de uso tem estado de colaboração real ou precisa de muitas funções auxiliares privadas.</p>
<pre><code class="language-python"># ANTES: serviço-deus
class PaymentService:
    def __init__(self, repo, gateway, mailer, clock, ledger, fraud, audit): ...
    def reserve(self, ...): ...
    def capture(self, ...): ...
    def refund(self, ...): ...
    def export_statement(self, ...): ...   # nada a ver com o resto


# DEPOIS: funções coesas, cada uma com as portas que realmente usa
def reserve_funds(cmd: ReserveFunds, uow: UnitOfWork) -&gt; None: ...
def capture_payment(cmd: CapturePayment, uow: UnitOfWork) -&gt; None: ...
def refund_payment(cmd: RefundPayment, uow: UnitOfWork, gateway: ClearingGateway) -&gt; None: ...</code></pre>` },
    { id: 'controlador', title: 'Controladores finos: várias portas de entrada, um caso de uso', body: `<p>O entrypoint faz três coisas: valida o formato, monta o comando e traduz o resultado. Mesmo caso de uso, em HTTP e em CLI:</p>
<pre><code class="language-python">def create_app(new_bus: Callable[[], MessageBus]) -&gt; FastAPI:
    app = FastAPI()

    @app.post("/accounts/{account_id}/reservations", status_code=201)
    def reserve(account_id: str, body: ReserveIn) -&gt; dict[str, str]:
        cmd = commands.ReserveFunds(
            account_id, body.payment_id, body.amount_minor, body.currency
        )
        try:
            new_bus().handle(cmd)
        except AccountNotFound:
            raise HTTPException(404, "conta inexistente")
        except InsufficientFunds as exc:
            raise HTTPException(409, str(exc))
        except DomainError as exc:
            raise HTTPException(422, str(exc))
        return {"payment_id": body.payment_id}

    return app</code></pre>
<pre><code class="language-python"># entrypoints/cli.py: segunda porta de entrada, zero lógica duplicada
import argparse

from payments.application.handlers import AccountNotFound
from payments.bootstrap import bootstrap
from payments.domain import commands
from payments.domain.model import InsufficientFunds


def main(argv: list[str] | None = None) -&gt; int:
    parser = argparse.ArgumentParser(prog="payments")
    parser.add_argument("account_id")
    parser.add_argument("payment_id")
    parser.add_argument("amount_minor", type=int)
    args = parser.parse_args(argv)
    new_bus = bootstrap()
    try:
        new_bus().handle(commands.ReserveFunds(args.account_id, args.payment_id, args.amount_minor))
    except AccountNotFound:
        print("conta inexistente")
        return 2
    except InsufficientFunds as exc:
        print(f"recusado: {exc}")
        return 3
    print("reservado")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())</code></pre>
<p>Teste do entrypoint: poucos, só para provar o mapeamento de erros (como o <code>test_api_maps_errors_to_http</code>), já que a regra é testada na camada abaixo. Com FastAPI, <code>fastapi.testclient.TestClient</code> roda a aplicação em processo.</p>` },
    { id: 'modelo-anemico', title: 'Modelo anêmico versus domínio rico', body: `<p>Fowler chama de <em>Anemic Domain Model</em> o anti-pattern em que as entidades são sacos de atributos e toda a lógica mora em "services". O sintoma visível é um handler que lê campos do objeto, calcula e escreve de volta. O problema é que as invariantes ficam espalhadas: qualquer outro handler pode violá-las.</p>
<pre><code class="language-python"># ANTES: regra no serviço, entidade burra
def reserve_funds(cmd, uow):
    with uow:
        acc = uow.accounts.get(cmd.account_id)
        available = acc.balance - sum(acc.holds.values())
        if available &lt; cmd.amount_minor:
            raise InsufficientFunds()
        acc.holds[cmd.payment_id] = cmd.amount_minor   # quem garante a invariante?
        uow.commit()


# DEPOIS: a regra mora no agregado, o serviço só orquestra
def reserve_funds(cmd, uow):
    with uow:
        acc = uow.accounts.get(cmd.account_id)
        acc.reserve(cmd.payment_id, Money(cmd.amount_minor, cmd.currency))
        uow.commit()</code></pre>
<p>Nem toda lógica pertence a um agregado. Quando a regra envolve dois ou mais agregados e não tem dono natural (por exemplo, calcular tarifa entre duas contas), nasce um <strong>domain service</strong>: uma função pura no pacote <code>domain</code>, sem I/O. Não confunda com o <em>application service</em> (o handler), que faz I/O e coordena.</p>` },
    { id: 'erros', title: 'Erros, transações e idempotência no caso de uso', body: `<ul>
<li><strong>Exceções de domínio por tipo.</strong> <code>InsufficientFunds</code>, <code>UnknownHold</code>, <code>CurrencyMismatch</code> herdam de <code>DomainError</code>. O entrypoint mapeia por tipo; o handler não sabe o que é HTTP.</li>
<li><strong>Transação por caso de uso.</strong> O <code>with uow:</code> envolve toda a unidade. Uma exceção desfaz tudo, sem tratamento extra.</li>
<li><strong>Idempotência.</strong> O <code>payment_id</code> funciona como chave de idempotência: <code>reserve</code> repetido com o mesmo id é no-op. No mundo real, clientes reenviam a requisição após timeout, e o sistema precisa produzir o mesmo efeito. Padrão do cabeçalho <code>Idempotency-Key</code>: o cliente gera, o servidor deduplica.</li>
<li><strong>Retorno.</strong> Comandos tendem a não devolver dados de leitura (o lado de leitura é separado, lição 55). Devolver o identificador criado, gerado pelo cliente, é o suficiente e evita o par "escrevo e leio de volta".</li>
</ul>
<div class="callout warn"><strong>PEGADINHA</strong> Não passe entidades de domínio ou modelos Pydantic de API para dentro do handler. O comando é um tipo de aplicação próprio. Quando o schema HTTP muda (versão da API), o comando não deve mudar junto.</div>` },
    { id: 'tradeoffs', title: 'Quando a service layer é demais', body: `<p>Honestamente: para um CRUD sobre Django ou FastAPI com SQLAlchemy, o handler que apenas faz <code>obj = Model(**data); session.add(obj)</code> não precisa de camada de serviço. Uma função intermediária que só repassa é o <em>sinkhole</em> da lição 49. A régua que uso:</p>
<ul>
<li>Se existe <strong>regra de domínio</strong> ou <strong>mais de uma porta de entrada</strong>, a camada compensa.</li>
<li>Se o caso de uso é uma única leitura ou escrita sem regra, vá direto ao ORM no entrypoint.</li>
<li>No Django, o equivalente informal é o módulo <code>services.py</code> (ou <code>selectors.py</code> para leitura) da comunidade, usado para tirar lógica de views e de models gordos. Funciona bem e não exige repositório.</li>
</ul>
<div class="callout"><strong>NA ENTREVISTA</strong> "Onde fica a regra de negócio, no service ou na entidade?" A resposta sênior: invariantes na entidade ou no agregado (modelo rico); o service orquestra I/O e transação; o controlador traduz protocolo. E prove com o teste: a regra roda sem I/O. Mencione o anti-pattern anêmico e o custo oposto, o <em>god aggregate</em>.</div>` },
  ],
  whenToUse: [
    'O mesmo caso de uso é acessado por mais de um entrypoint (API, CLI, fila, job)',
    'Há regras de domínio e você quer testar o fluxo inteiro com fakes, em milissegundos',
    'A transação precisa envolver um caso de uso inteiro, de forma explícita',
    'Controladores estão engordando com lógica e dificultam testes',
    'Você precisa de um ponto único para auditoria, métricas e idempotência por caso de uso'
  ],
  whenNot: [
    'CRUD sem regra: o ORM direto no endpoint é mais simples',
    'Funções que só repassam a chamada ao repositório (sinkhole)',
    'Classe de serviço com muitas dependências e dezenas de métodos (serviço-deus)',
    'Passar objetos de transporte (Pydantic, request) para dentro do núcleo',
    'Colocar regra de negócio em handlers e deixar as entidades anêmicas'
  ],
  metrics: [
    'pytest: a maioria da cobertura nos handlers com fakes; tempo da suíte em segundos',
    'Complexidade ciclomática por handler (radon ou ruff C901): sinal de que a regra vazou do domínio',
    'Linhas por handler e número de portas usadas: sinal de serviço-deus',
    'Cobertura de erros mapeados no entrypoint (um teste por tipo de DomainError)',
    'Cabeçalho Idempotency-Key e testes de repetição de comando'
  ],
  refs: [
    { type: 'livro', title: 'Architecture Patterns with Python, cap. 4 e 5', author: 'Harry Percival e Bob Gregory', url: 'https://www.cosmicpython.com/book/chapter_04_service_layer.html', note: 'Service layer e testes em alta marcha, base do código desta lição' },
    { type: 'artigo', title: 'Service Layer', author: 'Martin Fowler', url: 'https://martinfowler.com/eaaCatalog/serviceLayer.html', note: 'Definição original do padrão no catálogo PoEAA' },
    { type: 'artigo', title: 'Anemic Domain Model', author: 'Martin Fowler', url: 'https://martinfowler.com/bliki/AnemicDomainModel.html', note: 'Por que serviços com toda a lógica e entidades vazias são um anti-pattern' },
    { type: 'livro', title: 'Clean Architecture', author: 'Robert C. Martin', url: 'https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html', note: 'Casos de uso como a camada de regras específicas da aplicação' },
    { type: 'doc', title: 'The Twelve-Factor App', author: 'Adam Wiggins', url: 'https://12factor.net/', note: 'Processos sem estado e configuração no ambiente, pano de fundo para casos de uso stateless' },
    { type: 'artigo', title: 'Idempotency-Key HTTP Header', author: 'IETF httpapi', url: 'https://datatracker.ietf.org/doc/draft-ietf-httpapi-idempotency-key-header/', note: 'Rascunho do padrão do cabeçalho para operações POST idempotentes' },
    { type: 'video', title: 'Live de Python (canal do Eduardo Mendes)', author: 'Eduardo Mendes (Dunossauro)', url: 'https://www.youtube.com/@Dunossauro', note: 'Lives em português sobre FastAPI, Django e estrutura de projetos' },
  ]
};

window.LESSON_CONTENT['ddd-tatico'] = {
  id: 'ddd-tatico',
  title: 'Domain-Driven Design tático',
  etapa: 9, etapaName: 'Architecture patterns',
  time: '90 min',
  tags: ['DDD', 'aggregates', 'value objects', 'invariantes'],
  tagline: 'DDD tático é o ofício de modelar <em>invariantes</em>: o agregado é a fronteira dentro da qual a consistência é imediata e fora da qual ela é eventual.',
  intro: `<p>Eric Evans publicou <em>Domain-Driven Design</em> em 2003 com uma tese: em software complexo, o coração do problema é o domínio, e o código deve falar a língua dos especialistas do negócio. O livro tem duas metades. A <strong>estratégica</strong> (linguagem ubíqua, bounded contexts, context maps) decide onde estão as fronteiras entre modelos. A <strong>tática</strong> (entities, value objects, aggregates, repositories, domain services, domain events) são os blocos de construção para escrever um modelo dentro de uma fronteira.</p>
<p>Vaughn Vernon, em <em>Implementing Domain-Driven Design</em>, traduziu os blocos para a prática, e o ensaio <em>Effective Aggregate Design</em> virou leitura obrigatória: aggregates pequenos, referências por identidade, consistência eventual entre agregados. No Brasil, o tema é amplamente trabalhado por Elemar Júnior (Eximia) e por Rodrigo Branas, com cursos e conteúdo em português.</p>
<p>Em finanças o DDD tático tem valor concreto: dinheiro, saldo, limite, estado de pagamento são invariantes que não podem ser violadas, e o modelo é onde elas moram. O domínio de contas e reservas das lições anteriores é DDD tático em pequena escala. Aqui vamos nomeá-lo e discutir as decisões de projeto.</p>`,
  sections: [
    { id: 'linguagem', title: 'Linguagem ubíqua: o código é o glossário', body: `<p>Se o time de negócio diz "reserva de fundos" e o código diz <code>BalanceLock</code>, <code>HoldRecord</code> ou <code>row.status = 2</code>, cada conversa precisa de tradução e cada tradução é uma fonte de bug. A linguagem ubíqua é o vocabulário único usado em conversa, documentos e código. Na prática: nomes de classes, métodos, comandos e eventos vêm do negócio (<code>reserve</code>, <code>capture</code>, <code>release</code>, <code>FundsReserved</code>), e quando o negócio muda o termo, o código muda o nome.</p>
<table>
<thead><tr><th>Bloco</th><th>Pergunta que responde</th><th>No domínio de pagamentos</th></tr></thead>
<tbody>
<tr><td>Value Object</td><td>O que é, por seus atributos?</td><td>Money, Currency, Iban</td></tr>
<tr><td>Entity</td><td>Quem é, ao longo do tempo?</td><td>Payment (id estável, estado muda)</td></tr>
<tr><td>Aggregate</td><td>O que precisa ser consistente junto?</td><td>Account com suas reservas</td></tr>
<tr><td>Domain Event</td><td>O que aconteceu que o negócio se importa?</td><td>FundsReserved, FundsCaptured</td></tr>
<tr><td>Domain Service</td><td>Regra que não cabe em um agregado</td><td>Cálculo de tarifa entre duas contas</td></tr>
<tr><td>Repository</td><td>Como recupero um agregado?</td><td>AccountRepository (lição 51)</td></tr>
<tr><td>Factory</td><td>Como crio um agregado válido?</td><td>Account.open, construtor</td></tr>
</tbody>
</table>` },
    { id: 'value-objects', title: 'Value objects: imutáveis, comparados por valor', body: `<p>Um value object não tem identidade: duas notas de R$ 10,00 são intercambiáveis. É imutável, valida a si mesmo na construção (nunca existe em estado inválido) e concentra as operações do conceito. O <code>Money</code> do nosso domínio previne dois erros clássicos: somar moedas diferentes e usar <code>float</code>.</p>
<pre><code class="language-python">@dataclass(frozen=True, slots=True)
class Money:
    minor: int  # menor unidade (centavos), nunca float
    currency: str = "BRL"

    def __post_init__(self) -&gt; None:
        if self.minor &lt; 0:
            raise ValueError("Money não pode ser negativo")

    def _same(self, other: "Money") -&gt; None:
        if other.currency != self.currency:
            raise CurrencyMismatch(f"{self.currency} != {other.currency}")

    def __add__(self, other: "Money") -&gt; "Money":
        self._same(other)
        return Money(self.minor + other.minor, self.currency)

    def __sub__(self, other: "Money") -&gt; "Money":
        self._same(other)
        return Money(self.minor - other.minor, self.currency)

    def __lt__(self, other: "Money") -&gt; bool:
        self._same(other)
        return self.minor &lt; other.minor</code></pre>
<p>Em Python, <code>@dataclass(frozen=True, slots=True)</code> dá igualdade por valor, hash consistente, imutabilidade e menos memória. Como <code>frozen</code> usa <code>object.__setattr__</code> por baixo, é ligeiramente mais lento na construção; para value objects, é um custo irrelevante diante da segurança. Para centenas de milhares de instâncias em hot path, meça antes de decidir.</p>
<pre><code class="language-python">import pytest
from payments.domain.model import CurrencyMismatch, Money


def test_money_equality_is_by_value():
    assert Money(100, "BRL") == Money(100, "BRL")
    assert Money(100, "BRL") != Money(100, "USD")


def test_cannot_add_different_currencies():
    with pytest.raises(CurrencyMismatch):
        Money(100, "BRL") + Money(100, "USD")


def test_money_is_immutable():
    m = Money(100)
    with pytest.raises(Exception):   # FrozenInstanceError
        m.minor = 1</code></pre>
<div class="callout warn"><strong>PEGADINHA</strong> A obsessão por tipos primitivos (primitive obsession): <code>amount: float, currency: str</code> espalhados por todo lado. É nela que nascem bugs de arredondamento e de moeda. Value objects nomeiam o conceito e centralizam a regra.</div>` },
    { id: 'entities', title: 'Entities: identidade, não valor', body: `<p>Uma entity é definida por sua identidade, que persiste enquanto os atributos mudam. Dois pagamentos com o mesmo valor e a mesma conta são pagamentos diferentes. A igualdade e o hash devem seguir a identidade, nunca os campos mutáveis (um objeto mutável com hash por campos quebra <code>set</code> e <code>dict</code> quando muda).</p>
<pre><code class="language-python">from enum import StrEnum


class PaymentStatus(StrEnum):
    PENDING = "pending"
    CAPTURED = "captured"
    FAILED = "failed"


class Payment:
    def __init__(self, payment_id: str, account_id: str, amount: Money) -&gt; None:
        self.id = payment_id          # identidade: imutável por convenção
        self.account_id = account_id  # referência a outro agregado: por ID, não por objeto
        self.amount = amount
        self.status = PaymentStatus.PENDING

    def mark_captured(self) -&gt; None:
        if self.status is not PaymentStatus.PENDING:
            raise ValueError(f"transição inválida: {self.status} para captured")
        self.status = PaymentStatus.CAPTURED

    def __eq__(self, other: object) -&gt; bool:
        return isinstance(other, Payment) and other.id == self.id

    def __hash__(self) -&gt; int:
        return hash(self.id)</code></pre>
<p>Máquinas de estado são o uso mais comum: o próprio método de domínio impõe as transições válidas, e o estado não pode ser atribuído de fora para qualquer valor. Se você sente falta de um <code>if status == ...</code> espalhado pela aplicação, a máquina de estado está no lugar errado.</p>` },
    { id: 'aggregates', title: 'Aggregates: a fronteira de consistência', body: `<p>Um aggregate é um grupo de objetos tratado como unidade para mudanças de dados, com uma <strong>raiz</strong> (aggregate root) que é o único ponto de entrada. As regras de Vernon:</p>
<ul>
<li><strong>Proteja invariantes verdadeiras dentro da fronteira.</strong> Em <code>Account</code>, a invariante "soma das reservas não excede o saldo" exige ler o saldo e todas as reservas juntos: elas pertencem ao mesmo agregado.</li>
<li><strong>Projete agregados pequenos.</strong> Um agregado grande significa lock grande e contenção. Contas com milhões de lançamentos não carregam os lançamentos na lista; o histórico é outro agregado ou um read model.</li>
<li><strong>Referencie outros agregados por identidade.</strong> <code>Payment.account_id</code>, e não <code>Payment.account</code>. Isso evita grafos de objetos gigantes e delimita o que a transação toca.</li>
<li><strong>Uma transação, um agregado.</strong> Atualizar dois agregados na mesma transação é sinal de fronteira errada, ou de que a consistência entre eles deveria ser eventual, via evento (lição 54).</li>
</ul>
<pre><code class="language-python">class Account:
    """Aggregate root. Invariante: sum(holds) &lt;= balance."""

    def __init__(self, account_id: str, balance: Money, version: int = 0) -&gt; None:
        self.id = account_id
        self.balance = balance
        self.holds: dict[str, int] = {}
        self.version = version
        self.events: list[events.Event] = []

    @property
    def available(self) -&gt; Money:
        return Money(self.balance.minor - sum(self.holds.values()), self.balance.currency)

    def reserve(self, payment_id: str, amount: Money) -&gt; None:
        if payment_id in self.holds:  # idempotente: mesma chave, mesmo efeito
            return
        if amount.currency != self.balance.currency:
            raise CurrencyMismatch(f"{amount.currency} != {self.balance.currency}")
        if self.available &lt; amount:
            raise InsufficientFunds(f"{self.id}: disponível {self.available.minor}")
        self.holds[payment_id] = amount.minor
        self.events.append(
            events.FundsReserved(self.id, payment_id, amount.minor, amount.currency)
        )

    def capture(self, payment_id: str) -&gt; None:
        if payment_id not in self.holds:
            raise UnknownHold(payment_id)
        minor = self.holds.pop(payment_id)
        self.balance = Money(self.balance.minor - minor, self.balance.currency)
        self.events.append(
            events.FundsCaptured(self.id, payment_id, minor, self.balance.currency)
        )

    def release(self, payment_id: str) -&gt; None:
        minor = self.holds.pop(payment_id, None)  # idempotente: liberar duas vezes é no-op
        if minor is not None:
            self.events.append(
                events.FundsReleased(self.id, payment_id, minor, self.balance.currency)
            )</code></pre>
<p>Observe o que o agregado impõe: a raiz é a única que muta <code>holds</code>; <code>reserve</code> é <strong>idempotente</strong> por <code>payment_id</code>; <code>release</code> também; e toda mudança relevante registra um evento. A concorrência entre duas reservas simultâneas é resolvida no banco pela coluna de versão (lição 51), porque a fronteira do agregado coincide com a fronteira do lock.</p>
<div class="callout tip"><strong>DICA</strong> Como descobrir a fronteira certa? Pergunte "se esses dois dados ficarem inconsistentes por 2 segundos, o negócio quebra?". Se sim, mesmo agregado. Se não, agregados separados com consistência eventual. Saldo e reservas: quebra (descoberto). Saldo e extrato exibido: não.</div>` },
    { id: 'servicos-fabricas', title: 'Domain services, factories e specifications', body: `<p>Quando a regra envolve vários agregados sem dono natural, use um <strong>domain service</strong>: função pura, sem I/O, recebendo os agregados como parâmetro. Exemplo: tarifa de transferência cruzando duas moedas.</p>
<pre><code class="language-python">from dataclasses import dataclass


@dataclass(frozen=True, slots=True)
class FeeSchedule:
    basis_points: int          # 25 = 0,25%
    minimum_minor: int


def transfer_fee(amount: Money, schedule: FeeSchedule) -&gt; Money:
    """Domain service: regra pura, sem repositório, sem relógio, sem rede."""
    fee = max(amount.minor * schedule.basis_points // 10_000, schedule.minimum_minor)
    return Money(fee, amount.currency)


def test_fee_has_a_minimum():
    s = FeeSchedule(basis_points=25, minimum_minor=100)
    assert transfer_fee(Money(10_000), s) == Money(100)      # 0,25% = 25, vira o mínimo
    assert transfer_fee(Money(1_000_000), s) == Money(2_500)</code></pre>
<p>Uma <strong>factory</strong> encapsula a criação quando ela é complexa ou precisa garantir invariantes de nascimento (um classmethod <code>Account.open(...)</code>). Uma <strong>specification</strong> encapsula uma regra booleana composável (por exemplo, elegibilidade para limite); em Python, um <code>Callable[[Account], bool]</code> com <code>all()</code> geralmente basta.</p>` },
    { id: 'estrategico', title: 'Do tático ao estratégico, e o custo do DDD', body: `<p>O tático sem o estratégico é só um estilo de classes. O estratégico define <strong>bounded contexts</strong>: dentro de cada um, um termo tem um significado único. "Conta" em Contas (saldo e reservas) não é "conta" em Antifraude (perfil de risco) nem em Contabilidade (plano de contas). Um <em>context map</em> declara como os contextos se relacionam: customer/supplier, conformist, anti-corruption layer, shared kernel. Isso conecta direto com a lei de Conway e com a lição 57: um bounded context é o candidato natural a módulo ou serviço.</p>
<p>Custos e quando evitar:</p>
<ul>
<li>DDD exige acesso a especialistas do domínio e conversa contínua. Sem isso, você modela suposições.</li>
<li>Em domínio simples (CRUD), as entities viram sacos de campos e o ritual não paga. Evans afirma isso: DDD é para domínios complexos e centrais ao negócio, e o <em>core domain</em> é onde se investe; subdomínios genéricos (autenticação, e-mail) compre ou use pronto.</li>
<li>Agregados mal dimensionados são pior que nenhum: grandes demais geram contenção, pequenos demais perdem invariantes.</li>
<li>Mapeamento e boilerplate: o modelo rico precisa de um ORM com mapeamento imperativo (lição 51) ou um adaptador de tradução.</li>
</ul>
<div class="callout"><strong>NA ENTREVISTA</strong> "O que é um aggregate e como você escolhe o tamanho?" Resposta: unidade de consistência transacional com uma raiz; tamanho guiado pelas invariantes que precisam ser imediatas, não pelo modelo relacional; referências por ID; uma transação por agregado; consistência eventual entre eles. Cite Vernon e o cenário de contenção de um agregado grande.</div>` },
  ],
  whenToUse: [
    'O domínio tem regras e invariantes complexas, e é central ao negócio (core domain), como limites, saldo, estados de pagamento',
    'Há especialistas de domínio acessíveis para construir a linguagem ubíqua',
    'Bugs recorrentes por violação de invariantes e por regras duplicadas em vários lugares',
    'Vários times precisam de fronteiras de modelo explícitas (bounded contexts)',
    'O sistema vai viver e evoluir por anos com requisitos que mudam'
  ],
  whenNot: [
    'CRUD e subdomínios genéricos: compre ou use pronto, sem ritual de entities e agregados',
    'Sem acesso ao negócio: você vai modelar adivinhação',
    'Agregados grandes por conveniência de navegação (contenção, locks longos)',
    'Atualizar vários agregados na mesma transação como regra: sinal de fronteira errada',
    'Aplicar o vocabulário tático sem o estratégico: estilo de classes sem fronteira de contexto'
  ],
  metrics: [
    'Tamanho dos agregados: contagem de entidades e linhas carregadas por caso de uso (EXPLAIN e logs de SQL)',
    'Taxa de conflitos de versão por agregado, como sinal de agregado quente ou grande demais',
    'Cobertura de testes de domínio puro (sem I/O), com property-based testing via Hypothesis para invariantes',
    'Glossário da linguagem ubíqua versionado junto do código e revisado com o negócio',
    'Event Storming como workshop para descobrir eventos, agregados e bounded contexts'
  ],
  refs: [
    { type: 'livro', title: 'Domain-Driven Design', author: 'Eric Evans', url: 'https://www.domainlanguage.com/ddd/', note: 'O livro original (2003): linguagem ubíqua, blocos táticos e design estratégico' },
    { type: 'livro', title: 'Implementing Domain-Driven Design', author: 'Vaughn Vernon', url: 'https://www.informit.com/store/implementing-domain-driven-design-9780321834577', note: 'Tradução do DDD para a prática, com agregados, eventos e arquitetura' },
    { type: 'artigo', title: 'Effective Aggregate Design', author: 'Vaughn Vernon', url: 'https://www.dddcommunity.org/library/vernon_2011/', note: 'Os três ensaios com as regras de agregados pequenos e consistência eventual' },
    { type: 'livro', title: 'Architecture Patterns with Python, cap. 7', author: 'Harry Percival e Bob Gregory', url: 'https://www.cosmicpython.com/book/chapter_07_aggregate.html', note: 'Aggregates e fronteiras de consistência com código Python' },
    { type: 'artigo', title: 'DDD_Aggregate', author: 'Martin Fowler', url: 'https://martinfowler.com/bliki/DDD_Aggregate.html', note: 'A definição concisa de aggregate e sua relação com transações' },
    { type: 'artigo', title: 'Anemic Domain Model', author: 'Martin Fowler', url: 'https://martinfowler.com/bliki/AnemicDomainModel.html', note: 'O anti-pattern oposto ao modelo rico' },
    { type: 'doc', title: 'dataclasses', author: 'Python Software Foundation', url: 'https://docs.python.org/3/library/dataclasses.html', note: 'frozen, slots e eq para value objects e entities' },
    { type: 'curso', title: 'Clean Code e Clean Architecture', author: 'Rodrigo Branas', url: 'https://branas.io/', note: 'Conteúdo brasileiro que aplica DDD tático e arquitetura limpa em código' },
  ]
};

window.LESSON_CONTENT['eventos-message-bus'] = {
  id: 'eventos-message-bus',
  title: 'Domain events e message bus',
  etapa: 9, etapaName: 'Architecture patterns',
  time: '75 min',
  tags: ['domain events', 'message bus', 'outbox', 'consistência eventual'],
  tagline: 'Eventos de domínio desacoplam <em>o que aconteceu</em> de <em>quem reage</em>; o outbox transacional garante que nenhum fato se perca entre o banco e o broker.',
  intro: `<p>Reservar fundos tem consequências: notificar o cliente, registrar no razão (ledger), avisar o antifraude, publicar para outros serviços. Se <code>reserve_funds</code> chamar tudo isso, ele vira um nó de acoplamento: cada novo interessado exige mexer no caso de uso, e uma falha do e-mail derruba a reserva. A alternativa é o agregado registrar o <strong>fato</strong> (<code>FundsReserved</code>) e deixar quem se interessa reagir.</p>
<p>Esta lição cobre os três níveis. Primeiro, <strong>eventos de domínio</strong> dentro do processo, despachados por um message bus simples (Percival e Gregory, caps. 8 e 9). Segundo, a ponte para fora do processo: <strong>integration events</strong> e o <strong>transactional outbox</strong>, que resolve o problema do dual write. Terceiro, a consequência de tudo isso: <strong>consistência eventual</strong>, entrega pelo menos uma vez e a necessidade de consumidores idempotentes.</p>
<p>É também o ponto em que a complexidade de verdade aparece. Eventos dão flexibilidade ao custo de fluxo de controle implícito: para entender o que acontece ao reservar, você precisa achar os handlers inscritos. Vamos medir esse custo no final.</p>`,
  sections: [
    { id: 'comando-evento', title: 'Comando versus evento', body: `<table>
<thead><tr><th></th><th>Comando</th><th>Evento</th></tr></thead>
<tbody>
<tr><td>Significado</td><td>Intenção: "faça isto"</td><td>Fato: "isto aconteceu"</td></tr>
<tr><td>Nome</td><td>Imperativo: ReserveFunds</td><td>Passado: FundsReserved</td></tr>
<tr><td>Destinatário</td><td>Exatamente um handler</td><td>Zero, um ou vários handlers</td></tr>
<tr><td>Pode falhar?</td><td>Sim, e o remetente fica sabendo</td><td>Já aconteceu; handlers falham isoladamente</td></tr>
<tr><td>Acoplamento</td><td>Remetente conhece o destinatário</td><td>Emissor não conhece ninguém</td></tr>
</tbody>
</table>
<p>O agregado é quem levanta os eventos, no momento em que a regra de negócio aceita a mudança. Eles ficam numa lista no agregado e só viram mensagens depois que a transação confirma:</p>
<pre><code class="language-python">from dataclasses import dataclass


class Event:
    """Marca um fato que já aconteceu no domínio."""


@dataclass(frozen=True, slots=True)
class FundsReserved(Event):
    account_id: str
    payment_id: str
    amount_minor: int
    currency: str


@dataclass(frozen=True, slots=True)
class FundsCaptured(Event):
    account_id: str
    payment_id: str
    amount_minor: int
    currency: str


@dataclass(frozen=True, slots=True)
class FundsReleased(Event):
    account_id: str
    payment_id: str
    amount_minor: int
    currency: str</code></pre>` },
    { id: 'bus', title: 'O message bus', body: `<p>O bus recebe uma mensagem e faz o despacho em uma fila interna: o handler de um comando pode produzir eventos, que entram na fila e disparam outros handlers, até esvaziar. Quem coleta os eventos é a UoW, olhando os agregados que passaram pelo repositório (<code>seen</code>).</p>
<pre><code class="language-python">import logging
from collections.abc import Callable
from typing import Any

from payments.application.ports import UnitOfWork
from payments.domain.commands import Command
from payments.domain.events import Event

log = logging.getLogger(__name__)
Message = Command | Event


class MessageBus:
    def __init__(
        self,
        uow: UnitOfWork,
        command_handlers: dict[type[Command], Callable[..., Any]],
        event_handlers: dict[type[Event], list[Callable[..., Any]]],
    ) -&gt; None:
        self.uow = uow
        self.command_handlers = command_handlers
        self.event_handlers = event_handlers

    def handle(self, message: Message) -&gt; None:
        queue: list[Message] = [message]
        while queue:
            current = queue.pop(0)
            if isinstance(current, Command):
                self._handle_command(current, queue)
            elif isinstance(current, Event):
                self._handle_event(current, queue)
            else:
                raise TypeError(f"{current!r} não é Command nem Event")

    def _handle_command(self, command: Command, queue: list[Message]) -&gt; None:
        handler = self.command_handlers[type(command)]  # exatamente um
        handler(command)  # falha de comando sobe para o chamador
        queue.extend(self.uow.collect_new_events())

    def _handle_event(self, event: Event, queue: list[Message]) -&gt; None:
        for handler in self.event_handlers.get(type(event), []):
            try:
                handler(event)
                queue.extend(self.uow.collect_new_events())
            except Exception:  # evento: isolar falha de um handler
                log.exception("handler %s falhou para %r", handler, event)</code></pre>
<p>Duas políticas distintas, deliberadas. Falha em <strong>comando</strong> sobe para o chamador: ele pediu algo e precisa saber que falhou. Falha em <strong>handler de evento</strong> é registrada e isolada: o fato já aconteceu e a falha do e-mail não pode desfazer a reserva. (Em produção, o handler que falha deve ir para retry com backoff e, esgotado, para uma dead-letter queue.)</p>
<p>A UoW expõe os eventos pendentes. Os eventos são consumidos da lista do agregado, para não serem despachados duas vezes:</p>
<pre><code class="language-python">def collect_new_events(self) -&gt; Iterator[Event]:
    for account in self.accounts.seen:
        while account.events:
            yield account.events.pop(0)</code></pre>
<p>E o teste: a regra e a reação, sem nenhum I/O.</p>
<pre><code class="language-python">import pytest
from payments.application.handlers import AccountNotFound
from payments.bootstrap import bootstrap
from payments.domain import commands
from payments.domain.model import InsufficientFunds
from tests.fakes import FakeUnitOfWork


def make_bus():
    notes: list = []
    uow = FakeUnitOfWork()
    new_bus = bootstrap(lambda: uow, notifications=notes)
    return new_bus(), uow, notes


def test_reserve_commits_and_dispatches_event():
    bus, uow, notes = make_bus()
    bus.handle(commands.OpenAccount("a1", 10_000))
    bus.handle(commands.ReserveFunds("a1", "p1", 4_000))
    assert uow.committed
    assert uow.accounts.get("a1").available.minor == 6_000
    assert notes == [("reserved", "p1")]</code></pre>
<div class="callout warn"><strong>PEGADINHA</strong> Neste desenho, os handlers de evento rodam <em>depois</em> do commit do agregado, cada um em sua transação. Se o processo morrer entre o commit e o handler, o efeito colateral se perde: o estado mudou e ninguém foi avisado. Para efeitos em memória e best effort (cache, métrica), tudo bem. Para qualquer coisa que precise sair do processo de forma confiável, use o outbox abaixo.</div>` },
    { id: 'dual-write', title: 'O dual write e o transactional outbox', body: `<p>O problema clássico: salvar no banco <em>e</em> publicar no broker são duas operações em dois sistemas, sem transação distribuída. Qualquer ordem falha em algum cenário.</p>
<pre><code class="language-python"># ERRADO: dual write
def reserve_and_publish(cmd, uow, broker):
    with uow:
        account.reserve(...)
        uow.commit()                 # 1) banco confirma
    broker.publish("funds-reserved", ...)   # 2) processo cai aqui: fato perdido
# Invertendo a ordem: publica e o commit falha: mensagem sobre algo que nunca aconteceu.</code></pre>
<p>A solução é o <strong>transactional outbox</strong> (documentado em microservices.io por Chris Richardson): gravar a mensagem a publicar numa tabela <code>outbox</code> <em>na mesma transação</em> do agregado. Um processo separado, o <em>relay</em>, lê a tabela e publica no broker. Estado e mensagem confirmam juntos ou não confirmam.</p>
<pre><code class="language-python">import dataclasses
from typing import Protocol

from sqlalchemy import (
    JSON, Column, DateTime, Integer, String, Table, func, insert, select, update,
)
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session, sessionmaker

from payments.adapters.orm import metadata
from payments.domain import events

outbox = Table(
    "outbox",
    metadata,
    Column("id", Integer, primary_key=True, autoincrement=True),
    Column("topic", String(100), nullable=False),
    Column("payload", JSON, nullable=False),
    Column("published_at", DateTime(timezone=True), nullable=True),
)

processed_messages = Table(
    "processed_messages",
    metadata,
    Column("consumer", String(100), primary_key=True),
    Column("message_id", String(100), primary_key=True),
)


def to_integration_message(event: events.Event) -&gt; tuple[str, dict] | None:
    """Contrato externo versionado, separado do evento interno."""
    match event:
        case events.FundsReserved():
            return "payments.funds-reserved.v1", dataclasses.asdict(event)
        case events.FundsCaptured():
            return "payments.funds-captured.v1", dataclasses.asdict(event)
        case _:
            return None


class Broker(Protocol):
    def publish(self, topic: str, payload: dict, message_id: str) -&gt; None: ...</code></pre>
<p>Repare no <code>commit()</code> da UoW (lição 51): antes de confirmar, ele percorre os eventos pendentes do agregado (sem consumi-los), converte os que são públicos em linhas de outbox e confirma tudo junto. O evento <strong>interno</strong> (<code>FundsReserved</code>) e a mensagem <strong>de integração</strong> (<code>payments.funds-reserved.v1</code>) são tipos separados de propósito: o contrato externo é versionado e estável, o interno pode ser refatorado.</p>
<p>O relay:</p>
<pre><code class="language-python">def relay_once(sessions: sessionmaker[Session], broker: Broker, batch: int = 100) -&gt; int:
    with sessions() as session:
        stmt = (
            select(outbox)
            .where(outbox.c.published_at.is_(None))
            .order_by(outbox.c.id)
            .limit(batch)
            .with_for_update(skip_locked=True)  # vários relays sem se pisar
        )
        rows = session.execute(stmt).all()
        for row in rows:
            broker.publish(row.topic, row.payload, message_id=str(row.id))
            session.execute(
                update(outbox).where(outbox.c.id == row.id).values(published_at=func.now())
            )
        session.commit()  # crash antes daqui: reenvia (at-least-once)
        return len(rows)</code></pre>
<ul>
<li><code>FOR UPDATE SKIP LOCKED</code> (Postgres, MySQL 8) permite vários relays em paralelo sem pegar a mesma linha.</li>
<li>Se o relay cair depois de publicar e antes do commit, a mensagem sai de novo: entrega <strong>pelo menos uma vez</strong> (at-least-once). Esse é o contrato honesto de quase todo broker. Exatamente uma vez, de ponta a ponta, não existe sem a cooperação do consumidor.</li>
<li>Alternativa ao polling: <strong>CDC</strong> (change data capture, como Debezium lendo o WAL do Postgres) publica a tabela de outbox sem consulta periódica, com menor latência.</li>
</ul>` },
    { id: 'idempotencia', title: 'Consumidores idempotentes', body: `<p>Se a entrega é at-least-once, o consumidor receberá duplicatas. A defesa é a <strong>idempotência</strong>: processar duas vezes tem o mesmo efeito que uma. Duas técnicas: operações naturalmente idempotentes (<code>release</code> do agregado já é no-op na segunda vez) e <strong>deduplicação por id de mensagem</strong>, gravada na mesma transação do efeito:</p>
<pre><code class="language-python">def handle_once(session: Session, consumer: str, message_id: str, work) -&gt; bool:
    """Consumidor idempotente: dedupe e efeito na mesma transação."""
    try:
        session.execute(
            insert(processed_messages).values(consumer=consumer, message_id=message_id)
        )
        session.flush()
    except IntegrityError:
        session.rollback()
        return False
    work()
    session.commit()
    return True</code></pre>
<pre><code class="language-python"># tests/integration/test_outbox.py (trecho): o contrato dos três comportamentos
def test_consumer_is_idempotent(tmp_path):
    sessions = make(tmp_path)
    effects = []
    with sessions() as s:
        assert handle_once(s, "ledger", "42", lambda: effects.append(1))
        assert not handle_once(s, "ledger", "42", lambda: effects.append(1))
    assert effects == [1]</code></pre>
<div class="callout tip"><strong>DICA</strong> A chave primária composta <code>(consumer, message_id)</code> faz o banco ser o árbitro. Verificar com <code>SELECT</code> e depois inserir tem condição de corrida entre duas instâncias; o <code>INSERT</code> com violação de unicidade não tem. Para efeitos em sistemas externos (cobrar um cartão), repasse a chave de idempotência ao vendor, como fizemos no gateway da lição 50.</div>` },
    { id: 'eventual', title: 'Consistência eventual e o que ela exige do design', body: `<p>Com eventos, o sistema como um todo deixa de ser consistente a cada instante: o saldo da conta já refletiu a reserva, mas o razão, o extrato e a notificação alcançam o estado alguns milissegundos ou segundos depois. Kleppmann (<em>Designing Data-Intensive Applications</em>, caps. 11 e 12) trata em profundidade os problemas decorrentes: ordenação, duplicação, leitura de dados defasados e o que significa "exatamente uma vez".</p>
<ul>
<li><strong>Leitura do próprio write.</strong> O usuário reserva e recarrega a tela; o read model ainda não foi atualizado. Soluções: devolver o estado novo na resposta, ou ler da fonte primária em fluxos críticos.</li>
<li><strong>Ordem.</strong> Eventos de um mesmo agregado precisam ser consumidos na ordem; use a chave do agregado como chave de partição (Kafka) ou fila por agregado. Entre agregados diferentes, assuma que não há ordem.</li>
<li><strong>Versionamento de eventos.</strong> O sufixo <code>.v1</code> não é enfeite. Mudar o schema de um evento publicado quebra consumidores. Adicione campos opcionais (compatível), ou publique <code>.v2</code> em paralelo e migre.</li>
<li><strong>Compensação.</strong> Se um passo posterior falha, você não faz rollback: publica um evento ou comando compensatório (liberar a reserva). Sagas, na lição 57.</li>
<li><strong>Observabilidade.</strong> Propague um <code>correlation_id</code> do comando original por todos os eventos derivados; sem ele, depurar um fluxo é arqueologia.</li>
</ul>` },
    { id: 'armadilhas', title: 'Armadilhas, custo e quando não usar', body: `<ul>
<li><strong>Fluxo de controle implícito.</strong> "Quem reage a FundsReserved?" exige busca. Mitigue com um registro central de handlers (o dict do bootstrap, lição 56) e testes que listam as assinaturas.</li>
<li><strong>Eventos como comandos disfarçados.</strong> <code>SendEmailRequested</code> não é um fato de domínio; é um comando mal nomeado. Eventos descrevem o que o negócio viu acontecer.</li>
<li><strong>Eventos anêmicos ou gordos demais.</strong> O evento deve carregar o suficiente para o consumidor agir sem chamar de volta o emissor (event-carried state transfer), mas não o agregado inteiro, porque isso congela a estrutura interna num contrato público.</li>
<li><strong>Cascatas.</strong> Eventos que geram eventos que geram eventos. Limite a profundidade e desenhe o fluxo no papel antes.</li>
<li><strong>Fila no processo não é durável.</strong> O bus em memória é para desacoplar código, não para garantir entrega. Entrega confiável é outbox mais broker.</li>
<li><strong>Quando não usar.</strong> Se há um único interessado e a operação precisa ser atômica e síncrona, chame a função direto, na mesma transação. Eventos entre serviços ou módulos distintos é onde pagam; dentro de uma função pequena, é cerimônia.</li>
</ul>
<div class="callout"><strong>NA ENTREVISTA</strong> "Como garante que um evento é publicado se o banco confirmou?" Resposta esperada: o dual write não é atômico; uso transactional outbox (ou CDC); entrega at-least-once; consumidores idempotentes por message id; e explico a diferença de "exatamente uma vez" de entrega para "exatamente uma vez" de efeito.</div>` },
  ],
  whenToUse: [
    'Várias reações independentes a um mesmo fato (notificar, auditar, atualizar read model, publicar)',
    'É preciso publicar mensagens de forma confiável a partir de uma mudança de estado no banco (outbox)',
    'Você quer desacoplar módulos ou serviços sem que o emissor conheça os consumidores',
    'O fluxo é naturalmente assíncrono e tolera consistência eventual',
    'Há necessidade de trilha de auditoria dos fatos do negócio'
  ],
  whenNot: [
    'Um único consumidor e a operação deve ser atômica e síncrona: chame a função direto',
    'Dual write (banco e broker em operações separadas) quando a perda da mensagem é inaceitável',
    'Eventos usados como chamada remota disfarçada, esperando resposta',
    'Consumidores sem idempotência em canais at-least-once',
    'Quando o time não tem como operar o broker, o relay e o monitoramento de fila de erro'
  ],
  metrics: [
    'Lag do outbox: idade da linha não publicada mais antiga (alerta em segundos ou minutos)',
    'Taxa de reenvio e de mensagens duplicadas detectadas pelo consumidor',
    'Dead-letter queue: profundidade e idade, com runbook de reprocessamento',
    'Correlation id e traces distribuídos (OpenTelemetry) atravessando comando, evento e mensagem',
    'Testes de contrato de schema (JSON Schema, Avro com schema registry) para eventos publicados'
  ],
  refs: [
    { type: 'livro', title: 'Architecture Patterns with Python, cap. 8, 9 e 10', author: 'Harry Percival e Bob Gregory', url: 'https://www.cosmicpython.com/book/chapter_08_events_and_message_bus.html', note: 'Eventos de domínio, message bus e comandos, base do código desta lição' },
    { type: 'artigo', title: 'Pattern: Transactional outbox', author: 'Chris Richardson', url: 'https://microservices.io/patterns/data/transactional-outbox.html', note: 'O padrão do outbox, o problema do dual write e as variantes de relay e CDC' },
    { type: 'livro', title: 'Designing Data-Intensive Applications', author: 'Martin Kleppmann', url: 'https://dataintensive.net/', note: 'Capítulos 11 e 12 sobre stream processing, entrega e exatamente uma vez' },
    { type: 'artigo', title: 'What do you mean by Event-Driven?', author: 'Martin Fowler', url: 'https://martinfowler.com/articles/201701-event-driven.html', note: 'Distingue notificação de evento, event-carried state transfer, event sourcing e CQRS' },
    { type: 'livro', title: 'Enterprise Integration Patterns', author: 'Gregor Hohpe e Bobby Woolf', url: 'https://www.enterpriseintegrationpatterns.com/', note: 'O catálogo de padrões de mensageria, incluindo Idempotent Receiver e Dead Letter Channel' },
    { type: 'doc', title: 'Debezium Documentation', author: 'Debezium', url: 'https://debezium.io/documentation/', note: 'CDC para implementar o outbox lendo o log de transações do banco' },
    { type: 'doc', title: 'PostgreSQL: SELECT, locking clause', author: 'PostgreSQL', url: 'https://www.postgresql.org/docs/current/sql-select.html#SQL-FOR-UPDATE-SHARE', note: 'Semântica de FOR UPDATE e SKIP LOCKED usados pelo relay' },
  ]
};

window.LESSON_CONTENT['cqrs-event-sourcing'] = {
  id: 'cqrs-event-sourcing',
  title: 'CQRS e Event Sourcing',
  etapa: 9, etapaName: 'Architecture patterns',
  time: '75 min',
  tags: ['CQRS', 'event sourcing', 'projeções', 'read model'],
  tagline: 'CQRS separa <em>quem muda</em> de <em>quem consulta</em>. Event Sourcing guarda os fatos e deriva o estado. São ideias independentes, e a segunda custa muito mais caro que a primeira.',
  intro: `<p>Em quase todo sistema, leitura e escrita têm necessidades opostas. A escrita quer um modelo rico e normalizado que proteja invariantes dentro de um agregado. A leitura quer joins prontos, desnormalização e telas rápidas. Forçar o mesmo modelo a servir os dois produz repositórios com dezenas de métodos <code>find_by_...</code>, agregados carregados só para exibir um campo e consultas lentas.</p>
<p><strong>CQRS</strong> (Command Query Responsibility Segregation, termo de Greg Young a partir do princípio CQS de Bertrand Meyer) separa os dois modelos: comandos mudam estado e não devolvem dados; queries devolvem dados e não mudam estado. <strong>Event Sourcing</strong> (ES) é um padrão distinto, que muda a fonte da verdade: em vez de guardar o estado atual, guarda-se a sequência imutável de eventos, e o estado é derivado reaplicando-os. Fowler e Percival e Gregory (cap. 12) insistem: CQRS sem ES é perfeitamente comum e útil; ES quase sempre vem acompanhado de CQRS, porque consultar um log de eventos exige projeções.</p>
<p>Esta lição mostra os dois com o domínio de contas e é franca sobre o custo. Event Sourcing é uma das técnicas mais poderosas e mais mal aplicadas do repertório.</p>`,
  sections: [
    { id: 'cqrs', title: 'CQRS: o lado de leitura com SQL direto', body: `<p>O passo mais barato, e o de maior retorno: manter o modelo de escrita como está (agregado, repository, UoW) e criar para a leitura uma tabela desnormalizada e consultas SQL diretas. Não há agregado, UoW nem domínio no caminho de leitura.</p>
<pre><code class="language-python">from sqlalchemy import Column, Integer, String, Table, text
from sqlalchemy.orm import Session

from payments.adapters.orm import metadata
from payments.domain import events

account_balances = Table(
    "account_balances",
    metadata,
    Column("account_id", String(36), primary_key=True),
    Column("available_minor", Integer, nullable=False),
)


def on_funds_reserved(event: events.FundsReserved, session: Session) -&gt; None:
    """Handler de evento: atualiza a projeção (a conta já existe na projeção)."""
    session.execute(
        text(
            "INSERT INTO account_balances (account_id, available_minor) VALUES (:a, :v) "
            "ON CONFLICT(account_id) DO UPDATE SET available_minor = available_minor - :d"
        ),
        {"a": event.account_id, "v": -event.amount_minor, "d": event.amount_minor},
    )
    session.commit()


def available_balance(session: Session, account_id: str) -&gt; int | None:
    """Query: SQL direto, sem agregado, sem UoW, sem domínio."""
    row = session.execute(
        text("SELECT available_minor FROM account_balances WHERE account_id = :a"),
        {"a": account_id},
    ).first()
    return None if row is None else row.available_minor</code></pre>
<p>Um endpoint de leitura usa só a função de query, sem passar pelo bus:</p>
<pre><code class="language-python">@app.get("/accounts/{account_id}/balance")
def balance(account_id: str, session: Annotated[Session, Depends(get_session)]):
    value = available_balance(session, account_id)
    if value is None:
        raise HTTPException(404)
    return {"account_id": account_id, "available_minor": value}</code></pre>
<p>E o teste da projeção:</p>
<pre><code class="language-python">from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from payments.adapters import orm
from payments.read_model import available_balance, on_funds_reserved
from payments.domain import events


def test_projection(tmp_path):
    engine = create_engine(f"sqlite+pysqlite:///{tmp_path/'r.db'}")
    orm.metadata.create_all(engine)
    with sessionmaker(engine)() as s:
        with s.begin():
            s.execute(__import__("sqlalchemy").text("INSERT INTO account_balances VALUES ('a1', 1000)"))
        on_funds_reserved(events.FundsReserved("a1", "p1", 250, "BRL"), s)
        assert available_balance(s, "a1") == 750</code></pre>
<p>O preço: a projeção é atualizada por um handler de evento (lição 54), então a leitura é <strong>eventualmente consistente</strong>. Se o usuário reserva e recarrega a tela, pode ver o saldo antigo por alguns instantes. Estratégias: devolver o novo estado na resposta do comando, ler do lado de escrita em fluxos críticos, ou aceitar e comunicar. Em cada projeção, escolha conscientemente o que acontece quando o handler falha (retry, reconstrução).</p>
<table>
<thead><tr><th>Nível</th><th>O que muda</th><th>Custo</th></tr></thead>
<tbody>
<tr><td>1. Queries separadas, mesmo banco, mesmo esquema</td><td>Funções de leitura com SQL direto, fora do repositório</td><td>Muito baixo; consistência imediata</td></tr>
<tr><td>2. Tabelas de leitura desnormalizadas, atualizadas em handlers</td><td>Projeção no mesmo banco</td><td>Médio; consistência eventual</td></tr>
<tr><td>3. Banco de leitura separado (Elasticsearch, Redis, réplica)</td><td>Infra extra e pipeline de sincronização</td><td>Alto; só quando a carga de leitura exige</td></tr>
<tr><td>4. Event Sourcing</td><td>O log de eventos vira a fonte da verdade</td><td>O mais alto; veja abaixo</td></tr>
</tbody>
</table>` },
    { id: 'es', title: 'Event Sourcing: o estado é uma dobra sobre os eventos', body: `<p>Em vez de uma linha <code>accounts</code> com o saldo corrente, guardamos <code>AccountOpened</code>, <code>FundsReserved</code>, <code>FundsCaptured</code>, em ordem, para sempre. O agregado é reconstruído aplicando os eventos (um <em>fold</em>: <code>estado = reduce(apply, eventos, vazio)</code>). Os métodos de comando tomam a decisão e levantam um novo evento; o estado muda ao aplicar o evento, na mesma função que será usada na reconstrução.</p>
<pre><code class="language-python">@dataclass(frozen=True, slots=True)
class AccountOpened(events.Event):
    account_id: str
    balance_minor: int
    currency: str


REGISTRY = {c.__name__: c for c in (AccountOpened, events.FundsReserved, events.FundsCaptured)}


class EsAccount:
    """Estado derivado: nunca gravado, sempre reconstruído do histórico."""

    def __init__(self, history: Iterable[events.Event] = ()) -&gt; None:
        self.id = ""
        self.balance = 0
        self.currency = "BRL"
        self.holds: dict[str, int] = {}
        self.version = 0
        self.pending: list[events.Event] = []
        for event in history:
            self._apply(event)
            self.version += 1

    @classmethod
    def open(cls, account_id: str, balance_minor: int, currency: str = "BRL") -&gt; "EsAccount":
        account = cls()
        account._raise(AccountOpened(account_id, balance_minor, currency))
        return account

    def reserve(self, payment_id: str, amount_minor: int) -&gt; None:
        if payment_id in self.holds:
            return
        if self.balance - sum(self.holds.values()) &lt; amount_minor:
            raise InsufficientFunds(self.id)
        self._raise(events.FundsReserved(self.id, payment_id, amount_minor, self.currency))

    def _raise(self, event: events.Event) -&gt; None:
        self._apply(event)
        self.pending.append(event)

    def _apply(self, event: events.Event) -&gt; None:
        match event:
            case AccountOpened(account_id, balance_minor, currency):
                self.id, self.balance, self.currency = account_id, balance_minor, currency
            case events.FundsReserved(_, payment_id, amount_minor, _):
                self.holds[payment_id] = amount_minor
            case events.FundsCaptured(_, payment_id, amount_minor, _):
                self.holds.pop(payment_id, None)
                self.balance -= amount_minor</code></pre>
<p>Pontos de atenção do código: a validação acontece em <code>reserve</code>, contra o estado reconstruído; <code>_apply</code> <strong>nunca valida nem falha</strong>, porque eventos já aconteceram e precisam ser reaplicáveis para sempre; o uso de <code>match</code> com dataclasses (Python 3.10+) deixa o dispatch legível.</p>
<pre><code class="language-python">    pass


metadata = MetaData()
event_log = Table(
    "event_log",
    metadata,
    Column("stream_id", String(36), primary_key=True),
    Column("version", Integer, primary_key=True),  # PK = trava otimista
    Column("type", String(60), nullable=False),
    Column("data", JSON, nullable=False),
)


class EventStore:
    def __init__(self, engine: Engine) -&gt; None:
        self.engine = engine
        metadata.create_all(engine)

    def load(self, stream_id: str) -&gt; list[events.Event]:
        stmt = select(event_log).where(event_log.c.stream_id == stream_id).order_by(event_log.c.version)
        with self.engine.connect() as conn:
            return [REGISTRY[r.type](**r.data) for r in conn.execute(stmt)]

    def append(self, stream_id: str, expected_version: int, new: list[events.Event]) -&gt; None:
        rows = [
            {"stream_id": stream_id, "version": expected_version + i + 1,
             "type": type(e).__name__, "data": asdict(e)}
            for i, e in enumerate(new)
        ]
        try:
            with self.engine.begin() as conn:
                conn.execute(event_log.insert(), rows)
        except IntegrityError as exc:
            raise ConcurrencyError(stream_id) from exc</code></pre>
<p>A chave primária <code>(stream_id, version)</code> é o controle de concorrência otimista: dois escritores que leram a versão 1 tentam inserir a versão 2; o segundo viola a PK e recebe <code>ConcurrencyError</code>. O comportamento é o mesmo do <code>version_id_col</code> da lição 51, aqui por construção. Teste:</p>
<pre><code class="language-python">import pytest
from sqlalchemy import create_engine

from payments.es import AvailableBalanceView, ConcurrencyError, EsAccount, EventStore
from payments.domain.model import InsufficientFunds


def test_replay_and_conflict(tmp_path):
    store = EventStore(create_engine(f"sqlite+pysqlite:///{tmp_path / 'es.db'}"))
    acc = EsAccount.open("a1", 1000)
    store.append("a1", 0, acc.pending)
    first, second = EsAccount(store.load("a1")), EsAccount(store.load("a1"))
    first.reserve("p1", 600)
    second.reserve("p2", 600)
    store.append("a1", first.version, first.pending)
    with pytest.raises(ConcurrencyError):
        store.append("a1", second.version, second.pending)
    rebuilt = EsAccount(store.load("a1"))
    assert rebuilt.holds == {"p1": 600} and rebuilt.version == 2
    with pytest.raises(InsufficientFunds):
        rebuilt.reserve("p3", 500)


def test_projection_rebuild():
    acc = EsAccount.open("a1", 1000)
    acc.reserve("p1", 250)
    view = AvailableBalanceView()
    for e in acc.pending:
        view.apply(e)
    assert view.rows == {"a1": 750}</code></pre>
<p>A projeção é descartável: se mudar o formato de uma view, apague-a e reconstrua reaplicando todos os eventos:</p>
<pre><code class="language-python">from collections.abc import Iterable
from dataclasses import asdict, dataclass

from sqlalchemy import JSON, Column, Integer, MetaData, String, Table, select
from sqlalchemy.engine import Engine
from sqlalchemy.exc import IntegrityError

from payments.domain import events
from payments.domain.model import InsufficientFunds


@dataclass(frozen=True, slots=True)
class AccountOpened(events.Event):
    account_id: str
    balance_minor: int
    currency: str


REGISTRY = {c.__name__: c for c in (AccountOpened, events.FundsReserved, events.FundsCaptured)}


class EsAccount:
    """Estado derivado: nunca gravado, sempre reconstruído do histórico."""

    def __init__(self, history: Iterable[events.Event] = ()) -&gt; None:
        self.id = ""
        self.balance = 0
        self.currency = "BRL"
        self.holds: dict[str, int] = {}
        self.version = 0
        self.pending: list[events.Event] = []
        for event in history:
            self._apply(event)
            self.version += 1

    @classmethod
    def open(cls, account_id: str, balance_minor: int, currency: str = "BRL") -&gt; "EsAccount":
        account = cls()
        account._raise(AccountOpened(account_id, balance_minor, currency))
        return account

    def reserve(self, payment_id: str, amount_minor: int) -&gt; None:
        if payment_id in self.holds:
            return
        if self.balance - sum(self.holds.values()) &lt; amount_minor:
            raise InsufficientFunds(self.id)
        self._raise(events.FundsReserved(self.id, payment_id, amount_minor, self.currency))

    def _raise(self, event: events.Event) -&gt; None:
        self._apply(event)
        self.pending.append(event)

    def _apply(self, event: events.Event) -&gt; None:
        match event:
            case AccountOpened(account_id, balance_minor, currency):
                self.id, self.balance, self.currency = account_id, balance_minor, currency
            case events.FundsReserved(_, payment_id, amount_minor, _):
                self.holds[payment_id] = amount_minor
            case events.FundsCaptured(_, payment_id, amount_minor, _):
                self.holds.pop(payment_id, None)
                self.balance -= amount_minor


class ConcurrencyError(Exception):
    pass


metadata = MetaData()
event_log = Table(
    "event_log",
    metadata,
    Column("stream_id", String(36), primary_key=True),
    Column("version", Integer, primary_key=True),  # PK = trava otimista
    Column("type", String(60), nullable=False),
    Column("data", JSON, nullable=False),
)


class EventStore:
    def __init__(self, engine: Engine) -&gt; None:
        self.engine = engine
        metadata.create_all(engine)

    def load(self, stream_id: str) -&gt; list[events.Event]:
        stmt = select(event_log).where(event_log.c.stream_id == stream_id).order_by(event_log.c.version)
        with self.engine.connect() as conn:
            return [REGISTRY[r.type](**r.data) for r in conn.execute(stmt)]

    def append(self, stream_id: str, expected_version: int, new: list[events.Event]) -&gt; None:
        rows = [
            {"stream_id": stream_id, "version": expected_version + i + 1,
             "type": type(e).__name__, "data": asdict(e)}
            for i, e in enumerate(new)
        ]
        try:
            with self.engine.begin() as conn:
                conn.execute(event_log.insert(), rows)
        except IntegrityError as exc:
            raise ConcurrencyError(stream_id) from exc


class AvailableBalanceView:
    """Projeção: read model derivado, descartável e reconstruível."""

    def __init__(self) -&gt; None:
        self.rows: dict[str, int] = {}

    def apply(self, event: events.Event) -&gt; None:
        match event:
            case AccountOpened(account_id, balance_minor, _):
                self.rows[account_id] = balance_minor
            case events.FundsReserved(account_id, _, amount_minor, _):
                self.rows[account_id] -= amount_minor
            case events.FundsCaptured():
                pass  # saldo disponível já foi reduzido na reserva</code></pre> 103:
<div class="callout tip"><strong>DICA</strong> Para streams longos, reconstruir a partir do primeiro evento fica caro. A solução é o <strong>snapshot</strong>: gravar periodicamente o estado derivado com a versão correspondente (a cada N eventos) e reconstruir a partir dele. É uma otimização, nunca a fonte da verdade, e só deve ser introduzida quando você medir o problema.</div>` },
    { id: 'projecoes', title: 'Projeções confiáveis: idempotência e ordem', body: `<p>Uma projeção consome eventos at-least-once (lição 54) e precisa produzir o mesmo resultado se receber um evento duas vezes ou fora de ordem. A técnica padrão é guardar, junto do read model, a <strong>última versão aplicada por stream</strong> e aplicar apenas o evento seguinte esperado.</p>
<pre><code class="language-python">from sqlalchemy import text
from sqlalchemy.orm import Session


def apply_once(session: Session, stream_id: str, version: int, apply) -&gt; str:
    """Retorna 'applied', 'duplicate' ou 'gap' (evento futuro: reenfileirar)."""
    row = session.execute(
        text("SELECT last_version FROM projection_cursor WHERE stream_id = :s"),
        {"s": stream_id},
    ).first()
    last = 0 if row is None else row.last_version
    if version &lt;= last:
        return "duplicate"          # já aplicado: idempotente
    if version != last + 1:
        return "gap"                # perdeu um evento anterior: não aplicar fora de ordem
    apply()
    session.execute(
        text("INSERT INTO projection_cursor (stream_id, last_version) VALUES (:s, :v) "
             "ON CONFLICT(stream_id) DO UPDATE SET last_version = :v"),
        {"s": stream_id, "v": version},
    )
    session.commit()                # efeito e cursor na mesma transação
    return "applied"</code></pre>
<p>O efeito e o avanço do cursor confirmam na mesma transação: ou os dois, ou nenhum. É a mesma ideia do consumidor idempotente da lição 54, com a ordem verificada. Isso também torna a reconstrução trivial: zere a tabela e o cursor, e reproduza o log.</p>` },
    { id: 'ganhos', title: 'O que ES realmente oferece', body: `<ul>
<li><strong>Auditoria completa por construção.</strong> Não é um log paralelo que pode divergir do estado: é o próprio estado. Em finanças, responder "por que o saldo era X em 3 de março?" é reaplicar até aquela versão.</li>
<li><strong>Viagem no tempo e debugging.</strong> Reproduzir um bug em produção é carregar o stream e reaplicar localmente.</li>
<li><strong>Novas projeções retroativas.</strong> Um novo relatório pode ser construído sobre todo o histórico, sem backfill ad hoc.</li>
<li><strong>Modelo natural para domínios de razão.</strong> Contabilidade já é append-only (partidas dobradas); o ES se alinha com esse modo de pensar.</li>
</ul>
<p>Mas atenção: <strong>um ledger de partidas dobradas não exige Event Sourcing</strong>. Muitos sistemas financeiros excelentes mantêm uma tabela de lançamentos imutáveis e saldos como colunas, sem ES. Você pode ter auditoria sem pagar o preço do ES inteiro.</p>` },
    { id: 'custos', title: 'Os custos reais do Event Sourcing', body: `<table>
<thead><tr><th>Problema</th><th>Por que dói</th><th>Mitigação</th></tr></thead>
<tbody>
<tr><td>Evolução de schema de eventos</td><td>Eventos antigos são imutáveis e precisam continuar legíveis; mudar um campo é um projeto</td><td>Upcasting (transformar eventos antigos ao ler), campos opcionais, versionamento</td></tr>
<tr><td>Consultas</td><td>Não há <code>SELECT ... WHERE</code> sobre o estado atual</td><td>Projeções obrigatórias; consistência eventual</td></tr>
<tr><td>Privacidade e LGPD</td><td>Dados pessoais num log imutável: como apagar?</td><td>Não colocar PII nos eventos (referência por id), ou criptografar por titular e apagar a chave (crypto-shredding)</td></tr>
<tr><td>Correção de erro</td><td>Não se edita o passado</td><td>Eventos compensatórios (estorno), nunca UPDATE</td></tr>
<tr><td>Curva de aprendizado e ferramental</td><td>Menos ORM, menos tutoriais; o time precisa pensar diferente</td><td>Começar por um único agregado ou contexto, bibliotecas maduras (como o pacote eventsourcing do John Bywater) ou um event store dedicado</td></tr>
<tr><td>Reprocessamento</td><td>Reconstruir projeções com bilhões de eventos leva horas</td><td>Snapshots, projeções paralelas por stream, planejamento de capacidade</td></tr>
</tbody>
</table>
<div class="callout warn"><strong>PEGADINHA</strong> Event Sourcing não é "publicar eventos". Aplicações com outbox e eventos de domínio (lição 54) <em>não</em> usam ES: o estado continua numa tabela, e os eventos são notificações. No ES, os eventos <em>são</em> o estado. A confusão entre os dois é a fonte da maioria das adoções equivocadas.</div>` },
    { id: 'decisao', title: 'Quando adotar, quando não', body: `<p>Uma sequência de perguntas que uso:</p>
<ol>
<li>As consultas já estão lentas ou o modelo de leitura é totalmente diferente do de escrita? Faça CQRS nível 1 ou 2.</li>
<li>Precisa de auditoria? Uma tabela de lançamentos imutáveis, mais o estado derivado transacionalmente, resolve a maioria dos casos.</li>
<li>O histórico completo e a capacidade de reprocessar são <em>requisitos de negócio</em> centrais (razão, trading, jogos, reconciliação), e o time domina o custo? Aí considere ES, em um agregado, e não no sistema todo.</li>
</ol>
<p>Fowler alerta no artigo sobre CQRS que, para a maioria dos sistemas, ele adiciona risco e complexidade significativos. O mesmo vale em dobro para ES. A regra é adotar por contexto delimitado, nunca por padrão corporativo.</p>
<div class="callout"><strong>NA ENTREVISTA</strong> "CQRS exige Event Sourcing?" Não. São independentes. Dê o nível 1 (queries separadas) como ponto de partida e cite o custo do ES: evolução de schema, projeções, privacidade. Se citar um caso real, diga qual requisito de negócio justificou. E mostre que auditoria não implica ES.</div>` },
  ],
  whenToUse: [
    'A carga de leitura é muito maior ou diferente da de escrita, e os agregados atrapalham as consultas',
    'Telas e relatórios exigem joins e desnormalização que o modelo de domínio não deve carregar',
    'Há requisito forte de auditoria total e reconstrução de estado em qualquer ponto (razão, reconciliação)',
    'É preciso construir novas visões retroativas sobre todo o histórico',
    'O time domina projeções, versionamento de eventos e consistência eventual'
  ],
  whenNot: [
    'CRUD com leituras simples: um único modelo basta',
    'Event Sourcing por moda, sem requisito de histórico completo',
    'Dados pessoais em eventos imutáveis sem plano de privacidade (LGPD)',
    'Quando a consistência imediata de leitura é obrigatória e não há como contornar',
    'Sistema inteiro em ES: adote em um contexto delimitado, onde compensa'
  ],
  metrics: [
    'Lag das projeções: diferença entre a versão do evento mais recente e a aplicada pelo read model',
    'Tempo de reconstrução de uma projeção e de um agregado (decide quando criar snapshots)',
    'Taxa de ConcurrencyError por stream, sinal de agregado quente',
    'Testes de replay: reaplicar o histórico de fixtures e comparar com o estado esperado',
    'Event store dedicado (EventStoreDB) ou Postgres com PK (stream_id, version) e índices por tipo'
  ],
  refs: [
    { type: 'artigo', title: 'CQRS', author: 'Martin Fowler', url: 'https://martinfowler.com/bliki/CQRS.html', note: 'Definição concisa e o aviso honesto sobre o risco de complexidade' },
    { type: 'artigo', title: 'Event Sourcing', author: 'Martin Fowler', url: 'https://martinfowler.com/eaaDev/EventSourcing.html', note: 'O padrão, o replay, snapshots e o impacto no design' },
    { type: 'livro', title: 'Architecture Patterns with Python, cap. 12', author: 'Harry Percival e Bob Gregory', url: 'https://www.cosmicpython.com/book/chapter_12_cqrs.html', note: 'CQRS com read models em SQL direto, o nível 1 e 2 desta lição' },
    { type: 'artigo', title: 'CQRS Documents', author: 'Greg Young', url: 'https://cqrs.files.wordpress.com/2010/11/cqrs_documents.pdf', note: 'O texto do criador do termo, com a motivação e o desenho' },
    { type: 'doc', title: 'CQRS pattern', author: 'Microsoft Azure Architecture Center', url: 'https://learn.microsoft.com/en-us/azure/architecture/patterns/cqrs', note: 'Guia de decisão com cuidados de consistência e variações do padrão' },
    { type: 'doc', title: 'Event Sourcing pattern', author: 'Microsoft Azure Architecture Center', url: 'https://learn.microsoft.com/en-us/azure/architecture/patterns/event-sourcing', note: 'Prós, contras e questões como snapshots e idempotência' },
    { type: 'livro', title: 'Designing Data-Intensive Applications', author: 'Martin Kleppmann', url: 'https://dataintensive.net/', note: 'Cap. 11 sobre event sourcing, change data capture e log como fonte da verdade' },
    { type: 'doc', title: 'eventsourcing (biblioteca Python)', author: 'John Bywater', url: 'https://eventsourcing.readthedocs.io/', note: 'Biblioteca madura de event sourcing em Python, com snapshots e projeções' },
  ]
};

window.LESSON_CONTENT['injecao-dependencia'] = {
  id: 'injecao-dependencia',
  title: 'Injeção de dependência',
  etapa: 9, etapaName: 'Architecture patterns',
  time: '60 min',
  tags: ['injeção de dependência', 'composition root', 'bootstrap', 'testabilidade'],
  tagline: 'Injeção de dependência é <em>passar o que você usa</em> em vez de buscá-lo. O único lugar autorizado a conhecer as peças concretas é a composition root.',
  intro: `<p>Todas as lições anteriores dependem de uma promessa: o núcleo recebe suas portas, não as cria. Alguém então precisa montar o grafo: escolher o <code>SqlAlchemyUnitOfWork</code> em produção e o <code>FakeUnitOfWork</code> em teste, instanciar o gateway com a URL certa e ligar os handlers ao bus. Esse alguém é a <strong>composition root</strong>, conceito que Mark Seemann consolidou em <em>Dependency Injection Principles, Practices, and Patterns</em>: um único lugar, o mais perto possível do ponto de entrada da aplicação, onde o grafo de objetos é composto.</p>
<p>Em Python, a conversa sobre DI costuma gerar duas reações opostas: a de quem vem de Java e quer um container Spring, e a de quem acha que DI "não é pythônico". Ambas erram. DI é um <em>princípio</em> (receber dependências), não um framework. Em Python ele se resolve na maior parte dos casos com argumentos de função e uma função <code>bootstrap()</code> de 40 linhas.</p>
<p>Nesta lição: o antes e depois de uma dependência escondida, o bootstrap do projeto, DI por parâmetro, <code>partial</code> e introspecção, o <code>Depends</code> do FastAPI, quando um container vale a pena, ciclo de vida e thread safety.</p>`,
  sections: [
    { id: 'problema', title: 'Dependência escondida versus dependência recebida', body: `<pre><code class="language-python"># ANTES: o handler cria e busca o que usa (dependências ocultas)
import httpx
from payments.adapters.uow import SqlAlchemyUnitOfWork
from payments.config import SESSION_FACTORY, CLEARING_URL     # globais


def submit_transfer(cmd):
    uow = SqlAlchemyUnitOfWork(SESSION_FACTORY)                # acoplado ao ORM
    gateway = httpx.Client(base_url=CLEARING_URL)              # acoplado à rede
    with uow:
        ...


# Teste: precisa de monkeypatch em módulos, e quebra se alguém renomear o import
def test_submit(monkeypatch):
    monkeypatch.setattr("payments.handlers.SqlAlchemyUnitOfWork", FakeUnitOfWork)
    monkeypatch.setattr("payments.handlers.httpx.Client", lambda **kw: FakeGateway())
    ...</code></pre>
<p>As dependências estão escondidas na implementação: a assinatura <code>submit_transfer(cmd)</code> mente. Para testar, você faz <em>monkeypatch</em> pelo nome do módulo, que é frágil e acopla o teste à forma como o import foi escrito. Agora a versão com DI:</p>
<pre><code class="language-python"># DEPOIS: a assinatura declara o que precisa
def submit_transfer(cmd: SubmitTransfer, uow: UnitOfWork, gateway: ClearingGateway) -&gt; None:
    with uow:
        ...


def test_submit():
    submit_transfer(SubmitTransfer("t1", "a1", 500), FakeUnitOfWork(), FakeClearingGateway())</code></pre>
<p>Sem monkeypatch, sem nome de módulo, sem estado global. O custo de uma linha na assinatura compra um teste legível e um grafo explícito.</p>
<div class="callout warn"><strong>PEGADINHA</strong> <strong>Service Locator</strong> é DI disfarçada e inversa: o código chama <code>container.get(ClearingGateway)</code> lá dentro. As dependências voltam a ser ocultas (o contrato do handler não as menciona), e o teste precisa configurar um registro global. Seemann o chama de anti-pattern pelos mesmos motivos. Receber é diferente de buscar.</div>` },
    { id: 'root', title: 'A composition root: bootstrap do projeto', body: `<p>Este é o bootstrap completo do nosso domínio. É o <strong>único módulo</strong> que importa adaptadores concretos e o ORM, além do núcleo. Nenhum handler, nenhum domínio e nenhuma porta importa este arquivo.</p>
<pre><code class="language-python">import inspect
from collections.abc import Callable
from typing import Any

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from payments.adapters import orm
from payments.adapters.uow import SqlAlchemyUnitOfWork
from payments.application import handlers
from payments.application.messagebus import MessageBus
from payments.application.ports import UnitOfWork
from payments.domain import commands, events

UowFactory = Callable[[], UnitOfWork]


def _inject(handler: Callable[..., Any], deps: dict[str, Any]) -&gt; Callable[[Any], Any]:
    """Resolve por nome de parâmetro; o primeiro parâmetro é a mensagem."""
    params = list(inspect.signature(handler).parameters)[1:]
    wanted = {name: deps[name] for name in params}  # KeyError cedo = erro de wiring
    return lambda message: handler(message, **wanted)


def bootstrap(
    uow_factory: UowFactory | None = None,
    *,
    database_url: str = "sqlite+pysqlite:///payments.db",
    notifications: list | None = None,
) -&gt; Callable[[], MessageBus]:
    """Composition root: o único lugar que conhece adaptadores concretos."""
    if uow_factory is None:
        orm.start_mappers()
        engine = create_engine(database_url)
        orm.metadata.create_all(engine)
        sessions = sessionmaker(engine)
        uow_factory = lambda: SqlAlchemyUnitOfWork(sessions)  # noqa: E731
    sink = notifications if notifications is not None else []

    def new_bus() -&gt; MessageBus:
        uow = uow_factory()  # um UoW por mensagem raiz: seguro com threads
        deps = {"uow": uow, "notifications": sink}
        return MessageBus(
            uow,
            command_handlers={
                commands.OpenAccount: _inject(handlers.open_account, deps),
                commands.ReserveFunds: _inject(handlers.reserve_funds, deps),
                commands.CapturePayment: _inject(handlers.capture_payment, deps),
            },
            event_handlers={
                events.FundsReserved: [_inject(handlers.log_funds_reserved, deps)],
            },
        )

    return new_bus</code></pre>
<p>Observe as decisões:</p>
<ul>
<li><strong>Injeção por nome de parâmetro.</strong> <code>_inject</code> lê a assinatura do handler (<code>inspect.signature</code>) e resolve cada parâmetro pelo nome em um dicionário de dependências. Um parâmetro desconhecido gera <code>KeyError</code> no momento da composição, não no meio de uma requisição: o erro de wiring aparece no start-up.</li>
<li><strong>Os dicionários de handlers</strong> são o registro central: lê-se ali, em um único lugar, quem responde a cada comando e quem reage a cada evento (a mitigação do "fluxo implícito" da lição 54).</li>
<li><strong>Uma UoW por mensagem raiz.</strong> <code>new_bus()</code> cria uma UoW e um bus novos por chamada, o que torna o grafo seguro para servidores com threads. Compartilhar um único UoW entre requisições seria um bug de concorrência, porque ele guarda a sessão em atributo.</li>
<li><strong>Configuração entra por parâmetro</strong> (<code>database_url</code>), vinda do ambiente pelo entrypoint (12-factor), nunca lida por baixo dos panos nos adaptadores.</li>
</ul>
<p>Em produção, o bootstrap é chamado uma vez em <code>main.py</code> ou no <em>lifespan</em> da aplicação; em testes, passa-se um <code>uow_factory</code> de fake:</p>
<pre><code class="language-python">def test_reserve_with_fake_wiring():
    uow = FakeUnitOfWork()
    notes: list = []
    new_bus = bootstrap(lambda: uow, notifications=notes)   # mesma composição, outros adaptadores
    bus = new_bus()
    bus.handle(commands.OpenAccount("a1", 10_000))
    bus.handle(commands.ReserveFunds("a1", "p1", 4_000))
    assert uow.accounts.get("a1").available.minor == 6_000
    assert notes == [("reserved", "p1")]</code></pre>` },
    { id: 'formas', title: 'As formas de DI em Python', body: `<table>
<thead><tr><th>Forma</th><th>Quando</th><th>Exemplo</th></tr></thead>
<tbody>
<tr><td>Parâmetro de função</td><td>O padrão. Casos de uso são funções</td><td>def handler(cmd, uow)</td></tr>
<tr><td>Parâmetro de construtor</td><td>Classes com colaboradores de longa vida</td><td>class MessageBus: def __init__(self, uow, ...)</td></tr>
<tr><td>functools.partial</td><td>Fixar dependências e entregar um callable de um argumento</td><td>partial(handler, uow=uow)</td></tr>
<tr><td>Introspecção da assinatura</td><td>Muitos handlers, wiring por nome ou por tipo</td><td>_inject do bootstrap</td></tr>
<tr><td>Depends do FastAPI</td><td>Resolver dependências por requisição no framework web</td><td>Depends(get_bus)</td></tr>
<tr><td>Container (dependency-injector)</td><td>Grafos grandes, ciclos de vida variados</td><td>providers.Factory, Singleton</td></tr>
</tbody>
</table>
<p>A mais simples e mais robusta é o parâmetro de função com <code>partial</code>:</p>
<pre><code class="language-python">from functools import partial

handler = partial(reserve_funds, uow=uow)     # callable de um argumento: handler(cmd)
handler(commands.ReserveFunds("a1", "p1", 100))</code></pre>
<div class="callout warn"><strong>PEGADINHA</strong> Nunca crie dependências em valores default de parâmetros: <code>def handler(cmd, uow=SqlAlchemyUnitOfWork(...))</code>. O default é avaliado <em>uma vez, na definição da função</em>, e vira um singleton oculto compartilhado por todas as chamadas, além de importar o adaptador dentro do núcleo. Use <code>None</code> e resolva fora, ou melhor, exija o parâmetro.</div>` },
    { id: 'fastapi', title: 'FastAPI: Depends como container de requisição', body: `<p>O FastAPI já traz um injetor de dependências por requisição, e ele se encaixa bem como a borda do bootstrap: o grafo da aplicação é montado uma vez e o <code>Depends</code> entrega um bus novo por requisição.</p>
<pre><code class="language-python">from functools import lru_cache
from typing import Annotated

from fastapi import Depends, FastAPI

from payments.application.messagebus import MessageBus
from payments.bootstrap import bootstrap
from payments.domain import commands


@lru_cache
def get_new_bus():
    """Composition root da app web: executa uma vez por processo."""
    return bootstrap(database_url="sqlite+pysqlite:///payments.db")


def get_bus(new_bus=Depends(get_new_bus)) -&gt; MessageBus:
    return new_bus()   # um bus (e uma UoW) por requisição


app = FastAPI()


@app.post("/accounts/{account_id}/capture/{payment_id}")
def capture(account_id: str, payment_id: str, bus: Annotated[MessageBus, Depends(get_bus)]):
    bus.handle(commands.CapturePayment(account_id, payment_id))
    return {"ok": True}


# Teste: troca a raiz inteira, sem monkeypatch
def test_capture_with_override():
    uow = FakeUnitOfWork()
    new_bus = bootstrap(lambda: uow)
    new_bus().handle(commands.OpenAccount("a1", 100))
    new_bus().handle(commands.ReserveFunds("a1", "p1", 10))
    app.dependency_overrides[get_new_bus] = lambda: new_bus
    assert TestClient(app).post("/accounts/a1/capture/p1").status_code == 200
    assert uow.accounts.get("a1").balance.minor == 90
    app.dependency_overrides.clear()</code></pre>
<p>Cuidado com o acoplamento: <code>Depends</code> pertence à borda web. Os handlers do núcleo não devem importá-lo; eles continuam recebendo parâmetros comuns. O Django não tem injetor próprio, e o mesmo desenho se faz criando o bus em <code>AppConfig.ready()</code> ou em um módulo <code>container.py</code> importado pelas views.</p>` },
    { id: 'containers', title: 'Quando um container compensa', body: `<p>O pacote <code>dependency-injector</code> (Roman Mogylatov) oferece providers declarativos: <code>Factory</code> (instância nova a cada pedido), <code>Singleton</code>, <code>Configuration</code> e override para testes. Vale a pena quando o grafo é grande, há muitos ciclos de vida e várias equipes.</p>
<pre><code class="language-python">from dependency_injector import containers, providers
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker


class Container(containers.DeclarativeContainer):
    config = providers.Configuration()

    engine = providers.Singleton(create_engine, config.database_url)       # um por processo
    sessions = providers.Singleton(sessionmaker, engine)
    uow = providers.Factory(SqlAlchemyUnitOfWork, sessions)                # um por pedido


container = Container()
container.config.database_url.from_value("postgresql+psycopg://app@db/payments")

uow = container.uow()                                  # produção
with container.uow.override(providers.Object(FakeUnitOfWork())):
    uow = container.uow()                              # teste</code></pre>
<p>Mas o custo é real: uma dependência externa, uma segunda forma de ler o wiring e a tentação de usar o container como service locator (injetando o container inteiro). Minha regra: comece com o bootstrap explícito. Adote um container quando a função de composição passar de algumas centenas de linhas ou quando o ciclo de vida (por requisição, por tarefa, por tenant) ficar difícil de acompanhar à mão.</p>` },
    { id: 'ciclo', title: 'Ciclo de vida, threads e armadilhas', body: `<ul>
<li><strong>Escopos.</strong> Singleton por processo: engine, pool de conexões, cliente HTTP, configuração (todos thread-safe por contrato). Por requisição ou mensagem: UoW, session, bus. Por teste: tudo novo. Misturar escopos (um singleton guardando uma sessão) é a fonte clássica de dados vazados entre requisições.</li>
<li><strong>Thread safety.</strong> O Python 3.13 trouxe o build experimental sem GIL, e o 3.14 o torna oficialmente suportado (PEP 779). Isso torna ainda mais importante não compartilhar estado mutável: um objeto que "funcionava" sob o GIL por acidente pode corromper dados com threads de verdade. Dependências compartilhadas devem ser imutáveis ou explicitamente thread-safe.</li>
<li><strong>Async.</strong> Em <code>asyncio</code>, o escopo "por requisição" se implementa com <code>contextvars</code> ou, no FastAPI, com dependências <code>async def</code> e <code>yield</code> (que garantem o fechamento da sessão).</li>
<li><strong>Dependências circulares.</strong> Se A precisa de B e B precisa de A, o desenho está errado: extraia uma terceira peça ou use um evento. Containers que "resolvem" o ciclo com injeção tardia escondem o problema.</li>
<li><strong>Construtor com 8 parâmetros.</strong> Cheiro de classe com responsabilidades demais, não motivo para um container mágico.</li>
<li><strong>Validação no start-up.</strong> Construa o grafo inteiro no boot e falhe rápido. Um teste que chama <code>bootstrap()</code> e instancia os handlers pega erro de wiring antes do deploy.</li>
</ul>
<div class="callout"><strong>NA ENTREVISTA</strong> "Como faz DI em Python sem framework?" Resposta: parâmetros de função e construtor, uma composition root que monta tudo, partial ou introspecção para o wiring dos handlers, e overrides explícitos em teste. Diferencie DI (receber) de service locator (buscar), e cite o risco de singletons com estado entre requisições.</div>` },
  ],
  whenToUse: [
    'O núcleo tem portas e você precisa trocar adaptadores entre produção, teste e desenvolvimento',
    'Há dependências com ciclos de vida distintos (por processo, por requisição, por mensagem)',
    'Você quer falhar no start-up por erro de configuração ou wiring, e não no meio de uma requisição',
    'Vários entrypoints (API, CLI, worker) compartilham o mesmo núcleo com wiring diferente',
    'O grafo cresceu a ponto de justificar um container declarativo'
  ],
  whenNot: [
    'Script ou utilitário de um arquivo: importe e chame direto',
    'Container para um grafo de 3 objetos: o bootstrap explícito é mais legível',
    'Service locator disfarçado, injetando o container inteiro nas classes',
    'Dependências criadas em valores default de parâmetro',
    'Monkeypatch pelo nome do módulo como estratégia principal de teste'
  ],
  metrics: [
    'Teste de composição: bootstrap() com adaptadores reais em modo de teste e verificação dos handlers registrados',
    'mypy ou pyright para checar que os adaptadores satisfazem os Protocols injetados',
    'app.dependency_overrides no FastAPI, e container.provider.override no dependency-injector',
    'Tempo de start-up e falhas de configuração detectadas no boot',
    'Auditoria de singletons: nenhuma sessão, UoW ou objeto mutável de requisição em escopo de processo'
  ],
  refs: [
    { type: 'livro', title: 'Dependency Injection Principles, Practices, and Patterns', author: 'Mark Seemann e Steven van Deursen (Manning)', url: 'https://www.manning.com/books/dependency-injection-principles-practices-patterns', note: 'A referência sobre DI, composition root, service locator como anti-pattern e ciclos de vida' },
    { type: 'artigo', title: 'Composition Root', author: 'Mark Seemann', url: 'https://blog.ploeh.dk/2011/07/28/CompositionRoot/', note: 'O texto curto e original sobre o conceito' },
    { type: 'livro', title: 'Architecture Patterns with Python, cap. 13', author: 'Harry Percival e Bob Gregory', url: 'https://www.cosmicpython.com/book/chapter_13_dependency_injection.html', note: 'Bootstrap script e DI manual em Python, base do código desta lição' },
    { type: 'artigo', title: 'Inversion of Control Containers and the Dependency Injection pattern', author: 'Martin Fowler', url: 'https://martinfowler.com/articles/injection.html', note: 'O artigo clássico que nomeou DI e comparou com service locator' },
    { type: 'doc', title: 'FastAPI: Dependencies', author: 'Sebastián Ramírez', url: 'https://fastapi.tiangolo.com/tutorial/dependencies/', note: 'Depends, dependências com yield e dependency_overrides para testes' },
    { type: 'doc', title: 'dependency-injector', author: 'Roman Mogylatov', url: 'https://python-dependency-injector.ets-labs.org/', note: 'Containers, providers e overrides em Python' },
    { type: 'doc', title: 'PEP 779: Criteria for supported status for free-threaded Python', author: 'Python Steering Council', url: 'https://peps.python.org/pep-0779/', note: 'Contexto sobre o suporte oficial ao free-threading e o que isso exige do código compartilhado' },
    { type: 'video', title: 'Live de Python (canal do Eduardo Mendes)', author: 'Eduardo Mendes (Dunossauro)', url: 'https://www.youtube.com/@Dunossauro', note: 'Lives em português sobre FastAPI, injeção de dependência e testes' },
  ]
};

window.LESSON_CONTENT['monolito-microsservicos'] = {
  id: 'monolito-microsservicos',
  title: 'Monólito modular e microsserviços',
  etapa: 9, etapaName: 'Architecture patterns',
  time: '75 min',
  tags: ['monólito modular', 'microsserviços', 'sagas', 'Conway'],
  tagline: 'Microsserviços são uma solução de <em>organização de times e de escala</em> que você paga em consistência e operação. Fronteiras boas vêm antes de qualquer rede.',
  intro: `<p>A pergunta "monólito ou microsserviços?" é mal formulada. As perguntas reais são: onde estão as fronteiras do domínio, quem é dono de cada uma, e qual o custo de atravessá-las. Com as fronteiras certas, um monólito modular e um conjunto de serviços são o mesmo desenho em implantações diferentes. Com as fronteiras erradas, microsserviços produzem um <em>monólito distribuído</em>: todo o acoplamento do monólito, mais latência, falhas parciais e deploys coordenados.</p>
<p>Newman, em <em>Building Microservices</em>, abre com a mesma ressalva: microsserviços não são um ponto de partida obrigatório, e migrar sem dor real é erro comum. Chris Richardson (microservices.io) trata o assunto como um conjunto de padrões que você aplica conforme o problema. Martin Fowler popularizou a recomendação <em>MonolithFirst</em>: comece monólito, aprenda o domínio, divida onde a dor justificar.</p>
<p>Esta lição fecha a etapa conectando tudo: bounded contexts (lição 53) como módulos, eventos (54) e outbox como contratos entre eles, sagas para processos que atravessam fronteiras, e a lei de Conway como força que decide o que de fato será implantado separadamente.</p>`,
  sections: [
    { id: 'modular', title: 'Monólito modular: fronteiras verificadas no CI', body: `<p>Um monólito modular é uma única unidade de implantação com módulos que se comportam como serviços: cada um tem dados, domínio e uma API pública explícita, e ninguém acessa os internos do outro. Em Python, a fronteira é uma convenção que você <strong>transforma em teste</strong>.</p>
<pre><code class="language-text">shop/
  accounts/        # bounded context: saldo, reservas
    api.py         # ÚNICA superfície pública (funções e DTOs)
    domain.py  handlers.py  adapters.py  schema.sql
  ledger/          # bounded context: lançamentos contábeis
    api.py
    domain.py  handlers.py  adapters.py
  clearing/        # integração com adquirente
    api.py</code></pre>
<pre><code class="language-toml"># pyproject.toml: módulos independentes, exceto pela API pública declarada
[tool.importlinter]
root_package = "shop"

[[tool.importlinter.contracts]]
name = "Modulos so se falam pela API publica"
type = "independence"
modules = ["shop.accounts", "shop.ledger", "shop.clearing"]
ignore_imports = [
    "shop.ledger.handlers -&gt; shop.accounts.api",
    "shop.clearing.handlers -&gt; shop.accounts.api",
]</code></pre>
<p>Se alguém em <code>ledger</code> importar <code>shop.accounts.domain</code>, o contrato quebra com o import exato (verificado com <code>lint-imports</code>). Regras que sustentam a modularidade:</p>
<ul>
<li><strong>Dados por módulo.</strong> Cada módulo é dono de suas tabelas; ninguém faz <code>JOIN</code> através da fronteira. Se o ledger precisa do nome da conta, ele guarda uma cópia ou consulta a API. É a regra que torna a futura extração possível.</li>
<li><strong>Comunicação por API pública ou por eventos.</strong> Chamada síncrona dentro do processo (função) quando precisa de resposta imediata; evento (via outbox, mesmo no monólito) quando é reação.</li>
<li><strong>Referências por ID</strong> entre módulos, nunca por objeto, o mesmo princípio do agregado.</li>
</ul>
<div class="callout tip"><strong>DICA</strong> A API pública deve falar em DTOs (dataclasses imutáveis) ou comandos, e nunca devolver entidades de domínio. Isso permite trocar a implementação interna, e depois a chamada em processo por uma chamada HTTP, sem mudar os clientes.</div>` },
    { id: 'conway', title: 'Lei de Conway e tamanho de time', body: `<p>Melvin Conway observou em 1968 que organizações que desenham sistemas produzem desenhos que copiam suas estruturas de comunicação. A consequência prática: a arquitetura que você vai ter é a que seus times conseguem sustentar. O <em>inverse Conway maneuver</em> usa isso a favor: desenhe a estrutura de times que produz a arquitetura desejada.</p>
<ul>
<li>Microsserviços valem principalmente como <strong>ferramenta de autonomia organizacional</strong>: times que implantam em ritmos independentes, sem coordenar releases. Se você tem um único time de 8 pessoas, a autonomia que os microsserviços compram já existe.</li>
<li>A fronteira de serviço deve coincidir com a de bounded context e a de time. Um serviço com dois times donos sofre; um time com sete serviços sofre mais.</li>
<li>Skelton e Pais, em <em>Team Topologies</em>, formalizam isso com a carga cognitiva como limite: o tamanho do módulo é o que um time consegue manter na cabeça.</li>
</ul>` },
    { id: 'custos', title: 'O imposto dos microsserviços', body: `<table>
<thead><tr><th>Dimensão</th><th>Monólito modular</th><th>Microsserviços</th></tr></thead>
<tbody>
<tr><td>Chamada entre módulos</td><td>Chamada de função (nanossegundos), transacional</td><td>Rede: latência, timeout, falha parcial, retry, versão</td></tr>
<tr><td>Consistência</td><td>Uma transação ACID pode cobrir vários módulos</td><td>Consistência eventual, sagas, idempotência obrigatória</td></tr>
<tr><td>Deploy</td><td>Um artefato; rollback simples</td><td>N pipelines; compatibilidade entre versões</td></tr>
<tr><td>Observabilidade</td><td>Stack trace e log único</td><td>Tracing distribuído, correlation id, métricas por serviço</td></tr>
<tr><td>Dados e relatórios</td><td>JOIN direto</td><td>Dados espalhados; replicação, data lake, APIs</td></tr>
<tr><td>Escala</td><td>Escala o todo junto</td><td>Escala só o gargalo</td></tr>
<tr><td>Autonomia de times</td><td>Acoplada pelo deploy único</td><td>Alta, se as fronteiras forem boas</td></tr>
<tr><td>Tecnologia</td><td>Uma stack</td><td>Poliglota, ao custo de operação</td></tr>
</tbody>
</table>
<p>Sinais legítimos para extrair um serviço: um módulo com requisito de escala ou de isolamento de falha muito diferente (o processamento do adquirente com picos), requisito regulatório de segregação (dados de cartão em PCI scope reduzido), ou um time independente que precisa de cadência de deploy própria. Sinais ruins: "está na moda", "o monólito está bagunçado" (estruturar o monólito é mais barato que distribuir a bagunça), "para usar outra linguagem" sem necessidade real.</p>
<div class="callout warn"><strong>PEGADINHA</strong> Os sinais de <strong>monólito distribuído</strong>: serviços que precisam ser implantados juntos; um banco compartilhado entre serviços; chamadas síncronas em cadeia (A chama B chama C); mudanças de negócio que tocam cinco repositórios. Se você reconhece dois destes, você pagou o imposto sem receber o benefício.</div>` },
    { id: 'contratos', title: 'Contratos entre serviços', body: `<p>Ao atravessar a rede, o contrato é a API. Princípios: compatibilidade retroativa por padrão (adicionar campos opcionais, nunca remover nem mudar semântica); <strong>tolerant reader</strong> no consumidor (ignorar campos desconhecidos); versionar quando a quebra é inevitável (<code>.v2</code> em paralelo, migrar, desligar o <code>.v1</code>).</p>
<pre><code class="language-python">from pydantic import BaseModel, ConfigDict


class FundsReservedV1(BaseModel):
    """Contrato de integração publicado: estável, versionado, separado do evento interno."""
    model_config = ConfigDict(extra="ignore", frozen=True)   # tolerant reader

    account_id: str
    payment_id: str
    amount_minor: int
    currency: str


def parse(payload: dict) -&gt; FundsReservedV1:
    return FundsReservedV1.model_validate(payload)


def test_consumer_ignores_new_fields():
    payload = {"account_id": "a1", "payment_id": "p1", "amount_minor": 10,
               "currency": "BRL", "channel": "pix"}      # campo novo do produtor
    assert parse(payload).payment_id == "p1"</code></pre>
<p>Para detectar quebras antes da produção, use <strong>consumer-driven contract testing</strong> (Pact): cada consumidor declara o que espera, o produtor roda esses contratos no CI e falha se quebrar algum. Para APIs síncronas, OpenAPI com checagem de compatibilidade (por exemplo, com <code>oasdiff</code>) cumpre papel parecido.</p>` },
    { id: 'sagas', title: 'Sagas: consistência sem transação distribuída', body: `<p>Num monólito, "reservar fundos, enviar à liquidação e capturar" cabe em uma transação. Com serviços separados, não há transação ACID entre eles (e o two-phase commit é frágil e raro). O padrão <strong>saga</strong> (Garcia-Molina e Salem, 1987; popularizado por Richardson) quebra o processo em transações locais, cada uma com uma <strong>compensação</strong> para desfazer o efeito semântico se um passo posterior falhar.</p>
<table>
<thead><tr><th></th><th>Coreografia</th><th>Orquestração</th></tr></thead>
<tbody>
<tr><td>Controle</td><td>Cada serviço reage a eventos e emite o seguinte</td><td>Um orquestrador diz a cada participante o que fazer</td></tr>
<tr><td>Acoplamento</td><td>Baixo entre serviços; o fluxo fica implícito</td><td>Participantes conhecem só o orquestrador; o fluxo é explícito</td></tr>
<tr><td>Visibilidade do processo</td><td>Difícil (espalhada)</td><td>Um lugar mostra o estado da saga</td></tr>
<tr><td>Quando</td><td>Poucos passos, processos simples</td><td>Muitos passos, ramificações, compensações complexas</td></tr>
</tbody>
</table>
<p>Uma saga orquestrada como máquina de estados explícita e testável, sem I/O, no domínio de transferência (reserva, liquidação externa, captura ou liberação):</p>
<pre><code class="language-python">from dataclasses import dataclass
from enum import StrEnum

from payments.domain import commands


class State(StrEnum):
    STARTED = "started"
    RESERVED = "reserved"
    COMPLETED = "completed"
    COMPENSATED = "compensated"


@dataclass(frozen=True, slots=True)
class SubmitToClearing(commands.Command):
    transfer_id: str
    amount_minor: int


@dataclass(frozen=True, slots=True)
class ReleaseFunds(commands.Command):
    account_id: str
    payment_id: str


class TransferSaga:
    """Orquestrador: cada passo é uma transação local; falha vira compensação."""

    def __init__(self, transfer_id: str, account_id: str, amount_minor: int) -&gt; None:
        self.transfer_id = transfer_id
        self.account_id = account_id
        self.amount_minor = amount_minor
        self.state = State.STARTED

    def start(self) -&gt; list[commands.Command]:
        return [commands.ReserveFunds(self.account_id, self.transfer_id, self.amount_minor)]

    def on_funds_reserved(self) -&gt; list[commands.Command]:
        self.state = State.RESERVED
        return [SubmitToClearing(self.transfer_id, self.amount_minor)]

    def on_clearing_accepted(self) -&gt; list[commands.Command]:
        self.state = State.COMPLETED
        return [commands.CapturePayment(self.account_id, self.transfer_id)]

    def on_clearing_rejected(self) -&gt; list[commands.Command]:
        self.state = State.COMPENSATED
        return [ReleaseFunds(self.account_id, self.transfer_id)]</code></pre>
<p>Como o orquestrador é lógica pura, o teste cobre o caminho feliz e a compensação sem infraestrutura:</p>
<pre><code class="language-python">from payments.application.saga import State, TransferSaga
from payments.domain import commands


def test_happy_path():
    s = TransferSaga("t1", "a1", 500)
    assert s.start() == [commands.ReserveFunds("a1", "t1", 500)]
    s.on_funds_reserved()
    assert s.on_clearing_accepted() == [commands.CapturePayment("a1", "t1")]
    assert s.state is State.COMPLETED


def test_compensation():
    s = TransferSaga("t1", "a1", 500)
    s.start(); s.on_funds_reserved()
    cmds = s.on_clearing_rejected()
    assert s.state is State.COMPENSATED and cmds[0].payment_id == "t1"</code></pre>
<p>Requisitos para a saga funcionar em produção:</p>
<ul>
<li><strong>Estado persistido</strong> da saga na mesma transação em que emite os comandos (outbox, lição 54). Se o orquestrador cair, ele retoma de onde estava.</li>
<li><strong>Participantes idempotentes</strong>: comandos podem chegar duas vezes. Note que <code>reserve</code> e <code>release</code> do agregado são idempotentes por <code>payment_id</code>, e a chave de idempotência acompanha a chamada ao adquirente.</li>
<li><strong>Compensação é semântica, não rollback.</strong> Liberar a reserva não apaga o fato de que ela existiu: o histórico mostra reserva e liberação. Algumas ações não têm compensação perfeita (e-mail enviado), e devem ser deixadas para o final da saga.</li>
<li><strong>Timeouts e passos pendentes.</strong> Uma saga que espera uma resposta que nunca vem precisa de um timeout que dispare a compensação.</li>
<li><strong>Isolamento ausente.</strong> Entre os passos, outros veem estados intermediários (fundos reservados mas não capturados). O desenho usa o estado de domínio (reserva) como "lock semântico", o que é o motivo de a reserva existir como conceito.</li>
</ul>` },
    { id: 'migracao', title: 'Evoluir sem big bang: strangler fig e a ordem das decisões', body: `<p>Para extrair um serviço de um monólito já modular, o <strong>strangler fig</strong> (Fowler) é o padrão: coloque uma fachada na frente, redirecione o tráfego de um caso de uso por vez para o novo serviço e deixe o código antigo definhar. Passos práticos na ordem que funciona:</p>
<ol>
<li><strong>Modularize primeiro</strong>, com import-linter, dados por módulo e API pública. Isso já entrega 70% do benefício a custo baixo.</li>
<li><strong>Troque chamadas síncronas por eventos</strong> entre módulos onde a consistência eventual é aceitável, usando outbox mesmo dentro do monólito.</li>
<li><strong>Separe o esquema de dados</strong>: cada módulo com seu schema (ou banco) e sem JOIN cruzado.</li>
<li><strong>Extraia o módulo com maior pressão</strong> (escala, isolamento, time), trocando a chamada em processo por HTTP ou mensageria, com o mesmo contrato já testado.</li>
<li><strong>Meça</strong> antes e depois: latência p99, taxa de erro, frequência de deploy, tempo de lead.</li>
</ol>
<div class="callout"><strong>NA ENTREVISTA</strong> "Monólito ou microsserviços para este sistema?" A resposta sênior começa pelas fronteiras e pelos times, não pela tecnologia: "monólito modular até que escala, isolamento de falha ou autonomia de time justifiquem pagar consistência eventual e operação distribuída". Cite sagas e idempotência como o preço, e o monólito distribuído como o risco. Bônus: Conway e carga cognitiva.</div>` },
  ],
  whenToUse: [
    'Monólito modular: o padrão inicial para a maioria dos sistemas, com fronteiras verificadas no CI',
    'Microsserviços: times que precisam implantar de forma independente e fronteiras de contexto já estáveis',
    'Extração de um serviço quando há requisito claro de escala, isolamento de falha ou segregação regulatória',
    'Sagas e outbox quando um processo de negócio atravessa fronteiras sem transação ACID comum',
    'Contract testing quando serviços de times diferentes se integram por eventos ou APIs'
  ],
  whenNot: [
    'Microsserviços por moda, sem dor organizacional ou de escala concreta',
    'Dividir antes de entender o domínio: as fronteiras erradas custam caro para mover depois',
    'Banco compartilhado entre serviços ou chamadas síncronas em cadeia (monólito distribuído)',
    'Time pequeno com muitos serviços: a carga operacional supera o ganho de autonomia',
    'Saga sem idempotência, sem estado persistido e sem timeouts'
  ],
  metrics: [
    'import-linter (independence e layers): contratos entre módulos do monólito no CI',
    'Métricas DORA: frequência de deploy, lead time, taxa de falha de mudança e tempo de recuperação',
    'Tracing distribuído (OpenTelemetry) com correlation id propagado por comandos, eventos e HTTP',
    'Pact ou testes de contrato de schema (OpenAPI, JSON Schema) executados no CI do produtor',
    'Saúde das sagas: contagem por estado, idade da mais antiga em andamento, taxa de compensação'
  ],
  refs: [
    { type: 'livro', title: 'Building Microservices (2ª ed.)', author: 'Sam Newman (O\'Reilly)', url: 'https://samnewman.io/books/building_microservices_2nd_edition/', note: 'Referência sobre quando e como dividir, com a ressalva de que microsserviços não são ponto de partida obrigatório' },
    { type: 'portal', title: 'microservices.io', author: 'Chris Richardson', url: 'https://microservices.io/patterns/index.html', note: 'Catálogo de padrões: saga, outbox, API composition, strangler, database per service' },
    { type: 'artigo', title: 'MonolithFirst', author: 'Martin Fowler', url: 'https://martinfowler.com/bliki/MonolithFirst.html', note: 'O argumento para começar monólito e dividir quando o domínio estiver entendido' },
    { type: 'artigo', title: 'Strangler Fig', author: 'Martin Fowler', url: 'https://martinfowler.com/bliki/StranglerFigApplication.html', note: 'Migração incremental atrás de uma fachada' },
    { type: 'artigo', title: 'How Do Committees Invent?', author: 'Melvin Conway', url: 'https://www.melconway.com/Home/Committees_Paper.html', note: 'O artigo original de 1968 que deu origem à lei de Conway' },
    { type: 'livro', title: 'Fundamentals of Software Architecture', author: 'Mark Richards e Neal Ford (O\'Reilly)', url: 'https://www.oreilly.com/library/view/fundamentals-of-software/9781492043447/', note: 'Estilos de arquitetura e trade-offs entre monólito modular, microkernel e serviços' },
    { type: 'livro', title: 'Designing Data-Intensive Applications', author: 'Martin Kleppmann', url: 'https://dataintensive.net/', note: 'Sistemas distribuídos, consistência, replicação e o que muda ao atravessar a rede' },
    { type: 'livro', title: 'Team Topologies', author: 'Matthew Skelton e Manuel Pais', url: 'https://teamtopologies.com/book', note: 'Fronteiras de times, carga cognitiva e a lei de Conway aplicadas à arquitetura' },
    { type: 'doc', title: 'Pact Documentation', author: 'Pact Foundation', url: 'https://docs.pact.io/', note: 'Consumer-driven contract testing para integrações entre serviços' },
  ]
};
