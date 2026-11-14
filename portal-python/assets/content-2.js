/* Lesson content, Etapas 3 e 4 (lições 13 a 24)
   Schema: id, title, etapa, etapaName, time, tags, tagline, intro,
   sections[{id,title,body}], whenToUse[], whenNot[], metrics[], refs[]
*/
window.LESSON_CONTENT = window.LESSON_CONTENT || {};

window.LESSON_CONTENT['classes-oop'] = {
  id: 'classes-oop',
  title: 'Classes, herança e MRO',
  etapa: 3, etapaName: 'OOP & tipagem',
  time: '75 min',
  tags: ['OOP', 'herança', 'MRO', 'super()'],
  tagline: 'Em Python, uma classe é um <em>objeto vivo</em> com namespace próprio, e a herança é uma busca ordenada, não uma árvore.',
  intro: `<p>Orientação a objetos em Python tem pouca cerimônia e muita mecânica visível. Uma classe é um objeto (instância de <code>type</code>), os atributos vivem em dicionários, e a resolução de métodos segue uma ordem calculada, o MRO. Quem entende essa mecânica escreve hierarquias previsíveis; quem não entende descobre em produção que <code>super()</code> não chama "a classe pai", chama "a próxima na linearização".</p>
<p>Isso aparece em todo lugar: Django (mixins em views), SQLAlchemy (declarative base), bibliotecas de teste, frameworks de plugins. Em entrevista sênior, a pergunta clássica é o diamante: dada a hierarquia, qual a ordem de chamada? Quem responde "depende da profundidade" errou. A resposta é C3.</p>
<p>Esta lição cobre o modelo de atributos, o que é de classe e o que é de instância, <code>super()</code> cooperativo, a linearização C3, mixins, composição vs herança e os atalhos modernos (<code>__init_subclass__</code>, <code>__slots__</code>). O contrato de interface (ABC e Protocol) fica na lição 15.</p>`,
  sections: [
    { id: 'modelo-atributos', title: 'Atributos de classe vs instância', body: `
<p>Todo objeto comum tem um <code>__dict__</code>. Ao ler <code>obj.x</code>, Python procura primeiro um descritor de dados na classe, depois <code>obj.__dict__</code>, depois a classe e suas bases (na ordem do MRO). Ao escrever <code>obj.x = v</code>, grava sempre na instância, nunca na classe. É essa assimetria que gera a armadilha mais comum.</p>
<pre><code class="language-python">class Contador:
    total = 0              # atributo de classe, compartilhado
    itens = []             # CUIDADO: mutável compartilhado

    def __init__(self, nome: str) -&gt; None:
        self.nome = nome   # atributo de instância
        Contador.total += 1

a, b = Contador("a"), Contador("b")
a.itens.append(1)
print(b.itens)             # [1]  (mesma lista)
a.total = 99               # cria atributo de instância que sombreia
print(a.total, b.total, Contador.total)  # 99 2 2</code></pre>
<div class="callout warn"><strong>PEGADINHA</strong> Atributo de classe mutável (lista, dict, set) é estado global disfarçado. A correção é criar o valor em <code>__init__</code>. Em dataclasses, o linter do próprio módulo recusa default mutável e exige <code>field(default_factory=list)</code>.</div>
<p>Métodos são funções armazenadas na classe que viram métodos ligados via protocolo de descritor: <code>obj.m</code> chama <code>type(obj).m.__get__(obj, type(obj))</code> e devolve um objeto que já carrega o <code>self</code>. Isso explica por que <code>Classe.m(obj)</code> funciona e por que <code>@staticmethod</code> e <code>@classmethod</code> são apenas descritores diferentes.</p>
<table><thead><tr><th>Decorador</th><th>Primeiro argumento</th><th>Uso típico</th></tr></thead><tbody>
<tr><td>(nenhum)</td><td><code>self</code></td><td>Comportamento que depende do estado da instância</td></tr>
<tr><td><code>@classmethod</code></td><td><code>cls</code></td><td>Construtores alternativos, fábricas, estado de classe</td></tr>
<tr><td><code>@staticmethod</code></td><td>nenhum</td><td>Função agrupada por afinidade; quase sempre melhor como função de módulo</td></tr>
<tr><td><code>@property</code></td><td><code>self</code></td><td>Atributo calculado ou validado, mantendo a sintaxe de atributo</td></tr>
</tbody></table>` },
    { id: 'init-new-repr', title: 'Ciclo de vida: __new__, __init__ e construtores alternativos', body: `
<p>Criar um objeto são dois passos: <code>__new__</code> aloca e devolve a instância, <code>__init__</code> a inicializa. Você raramente sobrescreve <code>__new__</code> (só para imutáveis como <code>tuple</code> e <code>str</code>, ou singletons). Para variações de construção, o idioma é o <code>@classmethod</code>, que respeita subclasses porque usa <code>cls</code>.</p>
<pre><code class="language-python">from datetime import date

class Pessoa:
    def __init__(self, nome: str, nascimento: date) -&gt; None:
        self.nome = nome
        self.nascimento = nascimento

    @classmethod
    def de_dict(cls, d: dict) -&gt; "Pessoa":
        return cls(d["nome"], date.fromisoformat(d["nascimento"]))

    @property
    def idade(self) -&gt; int:
        hoje = date.today()
        antes = (hoje.month, hoje.day) &lt; (self.nascimento.month, self.nascimento.day)
        return hoje.year - self.nascimento.year - antes

    def __repr__(self) -&gt; str:
        return f"Pessoa({self.nome!r}, {self.nascimento!r})"

class Aluno(Pessoa):
    pass

print(type(Aluno.de_dict({"nome": "Ana", "nascimento": "2000-05-01"})))  # Aluno</code></pre>
<p>Defina <code>__repr__</code> sempre (inequívoco, de preferência reconstruível) e <code>__str__</code> só se precisar de uma versão para humanos. A lição 12 aprofunda o data model.</p>` },
    { id: 'heranca-super', title: 'Herança e super() cooperativo', body: `
<p>Herança simples funciona como se espera: a subclasse reaproveita e especializa. O ponto delicado é <code>super()</code>. Ele não significa "a classe pai"; significa "o próximo na ordem de resolução a partir da classe atual, para a instância atual". Em herança simples os dois coincidem, em herança múltipla não.</p>
<pre><code class="language-python">class Base:
    def __init__(self, **kw) -&gt; None:
        print("Base")
        super().__init__(**kw)   # continua a cadeia (object ao final)

class A(Base):
    def __init__(self, a: int, **kw) -&gt; None:
        print("A")
        self.a = a
        super().__init__(**kw)

class B(Base):
    def __init__(self, b: int, **kw) -&gt; None:
        print("B")
        self.b = b
        super().__init__(**kw)

class C(A, B):
    pass

c = C(a=1, b=2)   # imprime A, B, Base
print(C.__mro__)</code></pre>
<p>Esse é o padrão <em>cooperativo</em>: cada classe consome os argumentos que conhece e repassa o resto com <code>**kw</code>. Raymond Hettinger resumiu a técnica no artigo "Python's super() considered super!". O custo é que todas as classes da hierarquia precisam seguir a mesma convenção; uma que chame <code>Base.__init__(self)</code> diretamente quebra a cadeia.</p>
<div class="callout"><strong>NA ENTREVISTA</strong> "Por que <code>super().__init__()</code> em <code>A</code> pode chamar <code>B</code>?" Porque <code>super()</code> consulta o MRO da classe do objeto (<code>C</code>), e o sucessor de <code>A</code> nessa lista é <code>B</code>. O argumento zero-arg <code>super()</code> usa a célula <code>__class__</code> e o primeiro argumento do método.</div>` },
    { id: 'mro-c3', title: 'MRO e a linearização C3', body: `
<p>O MRO é uma lista linear de todas as classes ancestrais, calculada uma vez na criação da classe pelo algoritmo C3 (o mesmo de Dylan, adotado no Python 2.3). Garantias do C3: a ordem local das bases declaradas é preservada (monotonicidade), e uma classe sempre aparece antes de suas bases. Se não existe ordem que satisfaça isso, a criação da classe falha.</p>
<pre><code class="language-python">class O: ...
class A(O): ...
class B(O): ...
class C(A, B): ...
class D(B, A): ...

print([k.__name__ for k in C.__mro__])  # ['C', 'A', 'B', 'O', 'object']

try:
    class E(C, D): ...
except TypeError as e:
    print(e)  # Cannot create a consistent method resolution order (MRO)...</code></pre>
<p>Como calcular à mão: <code>L[C] = C + merge(L[A], L[B], [A, B])</code>. O merge pega o cabeça da primeira lista que não apareça na cauda de nenhuma outra, remove-o de todas e repete. Treine isso no papel com o diamante clássico; é pergunta frequente.</p>
<pre><code class="language-python">class Animal:
    def falar(self): return ["Animal"]
class Cao(Animal):
    def falar(self): return ["Cao"] + super().falar()
class Robo(Animal):
    def falar(self): return ["Robo"] + super().falar()
class CaoRobo(Cao, Robo):
    def falar(self): return ["CaoRobo"] + super().falar()

print(CaoRobo().falar())  # ['CaoRobo', 'Cao', 'Robo', 'Animal']
# Animal aparece UMA vez: o diamante nao duplica a chamada.</code></pre>
<p>Inspecione sempre com <code>Classe.__mro__</code> ou <code>inspect.getmro</code>. Se você precisa consultar o MRO para entender um código, a hierarquia provavelmente está complexa demais.</p>` },
    { id: 'mixins', title: 'Mixins: reuso lateral com disciplina', body: `
<p>Mixin é uma classe pequena que adiciona um comportamento e não é pensada para ser instanciada sozinha. Em Python, é a forma idiomática de compor capacidades (Django usa muito: <code>LoginRequiredMixin</code>, <code>JSONResponseMixin</code>). Regras que mantêm mixins saudáveis: sem estado próprio relevante, um único propósito, nome terminado em <code>Mixin</code>, e vêm <em>antes</em> da base na lista de heranças para que seus métodos tenham precedência.</p>
<pre><code class="language-python">import json

class JsonMixin:
    def to_json(self) -&gt; str:
        return json.dumps(self.__dict__, default=str)

class ReprMixin:
    def __repr__(self) -&gt; str:
        campos = ", ".join(f"{k}={v!r}" for k, v in vars(self).items())
        return f"{type(self).__name__}({campos})"

class Produto(JsonMixin, ReprMixin):
    def __init__(self, nome: str, preco: float) -&gt; None:
        self.nome, self.preco = nome, preco

p = Produto("cafe", 18.5)
print(p, p.to_json())</code></pre>
<p>O risco é o acoplamento implícito: o mixin assume atributos que o host precisa ter. Documente ou, melhor, declare via <code>Protocol</code> (lição 15) para o type checker cobrar. Quando o mixin começa a ter estado e <code>__init__</code>, você quer composição.</p>` },
    { id: 'composicao', title: 'Composição vs herança', body: `
<p>"Prefira composição à herança" (Gang of Four) vale em Python com ênfase: herança acopla a subclasse à implementação da base, e herdar de tipos built-in é traiçoeiro porque os métodos em C não chamam os overrides. Um exemplo clássico é <code>dict</code>.</p>
<pre><code class="language-python">class DictRuim(dict):
    def __setitem__(self, k, v):
        super().__setitem__(k, v * 2)

d = DictRuim(a=1)        # __init__ do dict NAO passa por __setitem__
d.update(b=2)            # update tambem nao
print(d)                 # {'a': 1, 'b': 2}  (nao dobrou)

from collections import UserDict

class DictBom(UserDict):
    def __setitem__(self, k, v):
        super().__setitem__(k, v * 2)

print(DictBom(a=1))      # {'a': 2}</code></pre>
<p>Heurística: herde quando existe um "é um" real e você controla a base (ou ela foi desenhada para extensão); componha (guarde um objeto e delegue) quando quer reaproveitar comportamento. Em Python, composição com injeção de dependência é quase sempre mais testável.</p>
<pre><code class="language-python">class Relatorio:
    def __init__(self, fonte, formatador) -&gt; None:
        self._fonte = fonte
        self._fmt = formatador

    def gerar(self) -&gt; str:
        return self._fmt(self._fonte.ler())</code></pre>` },
    { id: 'hooks-slots', title: '__init_subclass__, __slots__ e propriedades', body: `
<p><code>__init_subclass__</code> (PEP 487) executa quando uma subclasse é definida e cobre a maior parte dos usos de metaclasse: registro automático de plugins e validação de contrato. Prefira-o a uma metaclasse sempre que possível.</p>
<pre><code class="language-python">class Plugin:
    registro: dict[str, type["Plugin"]] = {}

    def __init_subclass__(cls, *, nome: str, **kw) -&gt; None:
        super().__init_subclass__(**kw)
        Plugin.registro[nome] = cls

class Csv(Plugin, nome="csv"): ...
class Json(Plugin, nome="json"): ...

print(Plugin.registro)   # {'csv': &lt;class Csv&gt;, 'json': &lt;class Json&gt;}</code></pre>
<p><code>__slots__</code> troca o <code>__dict__</code> por um layout fixo: menos memória por instância (relevante com milhões de objetos) e acesso um pouco mais rápido, ao custo de não permitir atributos arbitrários e de complicar herança múltipla (dois pais com slots não vazios conflitam). Meça com <code>sys.getsizeof</code> e <code>tracemalloc</code> antes de adotar; em dataclasses use <code>@dataclass(slots=True)</code>.</p>
<pre><code class="language-python">class Ponto:
    __slots__ = ("x", "y")
    def __init__(self, x: float, y: float) -&gt; None:
        self.x, self.y = x, y

p = Ponto(1, 2)
try:
    p.z = 3
except AttributeError as e:
    print(e)</code></pre>
<p>Para encapsular, use <code>@property</code> em vez de getters e setters estilo Java. Comece com atributo público; se surgir validação, transforme em property sem quebrar quem chama. Esse é o argumento central do "unified access principle", e é por isso que getters triviais são smell em Python.</p>` },
    { id: 'entrevista-producao', title: 'Armadilhas de produção e perguntas de entrevista', body: `
<ul>
<li><strong>Default mutável</strong> em assinatura (<code>def f(x=[])</code>) e atributo de classe mutável: causa bugs entre requisições.</li>
<li><strong>Herdar para reuso de código</strong> sem relação "é um": a primeira mudança na base quebra metade das subclasses (fragile base class).</li>
<li><strong>Hierarquias profundas</strong> (mais de 2 ou 3 níveis) e herança múltipla fora de mixins: a leitura exige simular o MRO.</li>
<li><strong>Esquecer <code>super().__init__</code></strong> em mixins cooperativos: o pai seguinte nunca inicializa.</li>
<li><strong>Igualdade e hash</strong>: se define <code>__eq__</code>, o <code>__hash__</code> é anulado; defina os dois ou use dataclass frozen.</li>
</ul>
<div class="callout"><strong>NA ENTREVISTA</strong> Perguntas recorrentes: diferença entre <code>@classmethod</code> e <code>@staticmethod</code>; o que <code>super()</code> faz em herança múltipla; calcular um MRO no papel; por que não herdar de <code>list</code>/<code>dict</code>; quando usar <code>__slots__</code>; como evitar atributo de classe mutável compartilhado.</div>
<div class="callout tip"><strong>DICA</strong> Antes de criar uma classe, pergunte se não bastam uma função e um dicionário, ou uma dataclass. Python é multiparadigma; a classe deve ganhar o lugar por agrupar estado e comportamento que mudam juntos.</div>` },
  ],
  whenToUse: [
    'Quando estado e comportamento mudam juntos e você quer um tipo nomeado com invariantes.',
    'Herança simples para especializar uma base desenhada para extensão (frameworks, classes abstratas).',
    'Mixins pequenos e sem estado para capacidades ortogonais (serialização, logging, repr).',
    'Construtores alternativos com @classmethod para respeitar subclasses.',
    '__init_subclass__ para registro de plugins e validação de contrato na definição.',
  ],
  whenNot: [
    'Para reaproveitar código sem relação "é um": use composição.',
    'Herdando de list, dict ou str e sobrescrevendo métodos: use UserList, UserDict ou composição.',
    'Quando uma função resolve: classes com um único método e sem estado são funções disfarçadas.',
    'Hierarquias profundas ou herança múltipla com estado em vários pais.',
    'Metaclasse onde __init_subclass__ ou um decorador de classe bastam.',
  ],
  metrics: [
    'Classe.__mro__ e inspect.getmro para inspecionar a resolução',
    'python -m pyright / mypy para checar overrides incompatíveis (Liskov)',
    'sys.getsizeof e tracemalloc para medir o ganho real de __slots__',
    'ruff regras B006 (default mutável), PLR0904 (muitos métodos públicos)',
    'Profundidade de herança e número de métodos como sinais de classe inchada',
  ],
  refs: [
    { type: 'doc', title: 'Python Data Model', author: 'Python Software Foundation', url: 'https://docs.python.org/3/reference/datamodel.html', note: 'A fonte canônica de atributos, descritores e criação de classes.' },
    { type: 'doc', title: 'The Python 2.3 Method Resolution Order', author: 'Michele Simionato', url: 'https://docs.python.org/3/howto/mro.html', note: 'Explicação oficial do C3, com exemplos de linearização.' },
    { type: 'artigo', title: 'Python\'s super() considered super!', author: 'Raymond Hettinger', url: 'https://rhettinger.wordpress.com/2011/05/26/super-considered-super/', note: 'O texto de referência sobre herança cooperativa.' },
    { type: 'livro', title: 'Fluent Python, 2nd ed. (Python Fluente, Novatec)', author: 'Luciano Ramalho', url: 'https://www.oreilly.com/library/view/fluent-python-2nd/9781492056348/', note: 'Capítulos de herança e do modelo de objetos; há tradução brasileira pela Novatec.' },
    { type: 'doc', title: 'PEP 487: Simpler customisation of class creation', author: 'Martin Teichmann', url: 'https://peps.python.org/pep-0487/', note: '__init_subclass__ e __set_name__.' },
    { type: 'doc', title: 'Descriptor HowTo Guide', author: 'Raymond Hettinger', url: 'https://docs.python.org/3/howto/descriptor.html', note: 'Como property, classmethod e métodos ligados funcionam por baixo.' },
    { type: 'video', title: 'Live de Python (herança e MRO)', author: 'Eduardo Mendes', url: 'https://www.youtube.com/@Dunossauro', note: 'Canal brasileiro com aulas ao vivo de OOP e data model.' },
  ]
};

window.LESSON_CONTENT['dataclasses-pydantic'] = {
  id: 'dataclasses-pydantic',
  title: 'Dataclasses, attrs e Pydantic',
  etapa: 3, etapaName: 'OOP & tipagem',
  time: '75 min',
  tags: ['dataclass', 'attrs', 'Pydantic', 'validação'],
  tagline: 'Três ferramentas para <em>dados com forma</em>: a stdlib para estrutura, attrs para flexibilidade, Pydantic para a borda do sistema.',
  intro: `<p>Metade do código de negócio é "um registro com campos". Escrever <code>__init__</code>, <code>__repr__</code> e <code>__eq__</code> à mão é ruído e fonte de bug (esquecer um campo no <code>__eq__</code>). Dataclasses (PEP 557, Python 3.7) geram esse boilerplate a partir de anotações; <code>attrs</code> é o ancestral mais rico; Pydantic acrescenta validação e parsing em runtime a partir das mesmas anotações.</p>
<p>A decisão correta não é "qual é o melhor", é "onde está a fronteira de confiança". Dentro do domínio, os dados já são válidos e você quer estrutura barata e imutável. Na borda (JSON de uma API, variável de ambiente, linha de CSV), os dados são hostis e você quer validação e coerção explícitas. Misturar os dois papéis é a origem de modelos confusos.</p>
<p>Em entrevista sênior, a pergunta é sempre de trade-off: por que não Pydantic em tudo? Por que não dict? O que muda com <code>frozen</code> e <code>slots</code>? Esta lição dá os critérios e o código.</p>`,
  sections: [
    { id: 'dataclass-basico', title: 'dataclass: o que é gerado', body: `
<p>O decorador lê as anotações da classe e gera <code>__init__</code>, <code>__repr__</code> e <code>__eq__</code>. Os campos entram na ordem declarada; campos com default vêm depois dos sem default.</p>
<pre><code class="language-python">from dataclasses import dataclass, field

@dataclass
class Pedido:
    id: int
    cliente: str
    itens: list[str] = field(default_factory=list)
    total: float = 0.0

p = Pedido(1, "Ana")
print(p)                       # Pedido(id=1, cliente='Ana', itens=[], total=0.0)
print(p == Pedido(1, "Ana"))   # True</code></pre>
<p>Opções que importam: <code>frozen=True</code> (imutável, gera <code>__hash__</code>), <code>slots=True</code> (3.10+, sem <code>__dict__</code>), <code>kw_only=True</code> (3.10+, força argumentos nomeados, ótimo para evitar troca de posição), <code>order=True</code> (comparações por tupla de campos), <code>__post_init__</code> para validar ou derivar campos.</p>
<pre><code class="language-python">from dataclasses import dataclass, field, replace

@dataclass(frozen=True, slots=True, kw_only=True)
class Dinheiro:
    centavos: int
    moeda: str = "BRL"

    def __post_init__(self) -&gt; None:
        if self.centavos &lt; 0:
            raise ValueError("centavos nao pode ser negativo")

    def somar(self, outro: "Dinheiro") -&gt; "Dinheiro":
        if outro.moeda != self.moeda:
            raise ValueError("moedas diferentes")
        return replace(self, centavos=self.centavos + outro.centavos)

d = Dinheiro(centavos=1050)
print(d.somar(Dinheiro(centavos=50)))</code></pre>
<div class="callout warn"><strong>PEGADINHA</strong> <code>frozen=True</code> impede reatribuir campos, mas não congela objetos mutáveis dentro: uma <code>list</code> num campo continua mutável, e então o <code>hash</code> falha em runtime. Use <code>tuple</code> e <code>frozenset</code> em dataclass frozen. Também: <code>field(default_factory=...)</code> é obrigatório para defaults mutáveis; <code>itens: list = []</code> levanta <code>ValueError</code>.</div>` },
    { id: 'value-objects', title: 'Value objects e modelagem de domínio', body: `
<p>Um value object é definido pelos seus valores, não por identidade: dois <code>Dinheiro(100, "BRL")</code> são o mesmo valor. Dataclass frozen com <code>__eq__</code> por campos é exatamente isso, e é hashável, então serve de chave em dict e membro de set. Entidades (com identidade e ciclo de vida) usam <code>eq=False</code> ou comparam só por <code>id</code>.</p>
<pre><code class="language-python">from dataclasses import dataclass, field

@dataclass(frozen=True)
class Endereco:
    rua: str
    cidade: str
    cep: str

@dataclass(eq=False)
class Cliente:
    id: int
    nome: str
    endereco: Endereco
    historico: list[str] = field(default_factory=list, repr=False, compare=False)

    def __eq__(self, o: object) -&gt; bool:
        return isinstance(o, Cliente) and o.id == self.id

    def __hash__(self) -&gt; int:
        return hash(self.id)</code></pre>
<p>Ganho de design: tipos pequenos e nomeados (<code>Cpf</code>, <code>Email</code>, <code>Dinheiro</code>) eliminam "primitive obsession" (um smell do catálogo de Fowler, lição 21) e centralizam a validação num lugar só. <code>typing.NewType</code> dá o mesmo na checagem estática sem custo de runtime.</p>` },
    { id: 'attrs', title: 'attrs: quando a stdlib não basta', body: `
<p><code>attrs</code> (Hynek Schlawack) veio antes e inspirou a dataclass. Continua relevante porque oferece validadores e conversores por campo, <code>slots</code> por padrão na API moderna (<code>attrs.define</code>), melhores mensagens e recursos como <code>attrs.evolve</code>, <code>Factory</code> e on-setattr hooks.</p>
<pre><code class="language-python">from attrs import define, field, validators

@define(frozen=True)
class Usuario:
    nome: str = field(validator=validators.min_len(1))
    idade: int = field(converter=int, validator=[validators.ge(0), validators.lt(150)])
    tags: tuple[str, ...] = field(factory=tuple, converter=tuple)

u = Usuario("Ana", "31", ["a", "b"])
print(u)   # Usuario(nome='Ana', idade=31, tags=('a', 'b'))</code></pre>
<p>Critério prático: se o projeto já é stdlib-only e precisa de estrutura simples, use dataclass. Se precisa de validação e conversão por campo sem puxar um framework de parsing, ou se o ecossistema (por exemplo Twisted, structlog, pytest) já depende de attrs, use attrs. A biblioteca <code>cattrs</code> adiciona (de)serialização estruturada sobre attrs e dataclasses sem acoplar o modelo ao formato.</p>` },
    { id: 'pydantic', title: 'Pydantic v2: validação e parsing na borda', body: `
<p>Pydantic valida e <em>converte</em> dados externos para tipos Python usando as anotações. A v2 (2023) tem o núcleo em Rust (<code>pydantic-core</code>), é de uma a algumas vezes mais rápida que a v1 conforme o cenário (meça no seu caso), e separa modos estrito e lax de coerção.</p>
<pre><code class="language-python">from datetime import datetime
from pydantic import BaseModel, Field, field_validator, ValidationError

class Evento(BaseModel):
    id: int
    nome: str = Field(min_length=1, max_length=80)
    quando: datetime
    tags: list[str] = []          # Pydantic copia o default, sem o bug do mutavel

    @field_validator("nome")
    @classmethod
    def sem_espacos_nas_pontas(cls, v: str) -&gt; str:
        return v.strip()

try:
    e = Evento.model_validate({"id": "7", "nome": "  deploy ", "quando": "2026-11-13T10:00:00"})
    print(e.id, repr(e.nome), e.quando.year)   # 7 'deploy' 2026
    Evento.model_validate({"id": "x", "nome": "", "quando": "ontem"})
except ValidationError as err:
    print(err.error_count(), "erros")</code></pre>
<p>Métodos centrais: <code>model_validate</code> (de dict), <code>model_validate_json</code> (direto de bytes, mais rápido que <code>json.loads</code> mais validate), <code>model_dump</code> e <code>model_dump_json</code>, <code>model_json_schema</code> (gera JSON Schema, usado pelo FastAPI para OpenAPI). Com <code>ConfigDict(strict=True)</code> ou <code>Strict*</code> types, "7" deixa de virar 7. Para configuração de aplicação, <code>pydantic-settings</code> lê variáveis de ambiente e arquivos <code>.env</code> tipados.</p>
<div class="callout"><strong>NA ENTREVISTA</strong> Pydantic coage por padrão (modo lax): <code>"1"</code> vira <code>1</code>, <code>1</code> vira <code>True</code> em alguns contextos. Em API financeira, avalie modo estrito, ou explique por que a coerção é aceitável. Tem também o custo: validar em todo construtor, em loops quentes, pesa; use <code>model_construct</code> só quando os dados já foram validados.</div>` },
    { id: 'validar-dataclass', title: 'Pydantic com dataclasses e TypeAdapter', body: `
<p>Nem todo dado precisa de <code>BaseModel</code>. <code>pydantic.dataclasses.dataclass</code> aplica validação a uma dataclass, e <code>TypeAdapter</code> valida qualquer tipo anotado (listas, uniões, TypedDict) sem declarar um modelo.</p>
<pre><code class="language-python">from dataclasses import dataclass
from pydantic import TypeAdapter

@dataclass
class Ponto:
    x: float
    y: float

ta = TypeAdapter(list[Ponto])
pontos = ta.validate_python([{"x": 1, "y": "2.5"}, {"x": 0, "y": 0}])
print(pontos[0])                       # Ponto(x=1.0, y=2.5)
print(ta.dump_json(pontos))            # b'[{"x":1.0,"y":2.5},{"x":0.0,"y":0.0}]'</code></pre>
<p>Padrão de arquitetura limpo: o domínio usa dataclasses frozen puras (sem dependência de framework) e a camada de entrada usa modelos Pydantic que convertem para o domínio. Isso mantém regras de negócio testáveis sem importar Pydantic e evita que o formato do JSON vaze para o núcleo.</p>
<pre><code class="language-python">class PedidoIn(BaseModel):          # borda: formato da API
    cliente_id: int
    itens: list[str]

    def para_dominio(self) -&gt; "Pedido":
        return Pedido(id=0, cliente=str(self.cliente_id), itens=tuple(self.itens))</code></pre>` },
    { id: 'comparativo', title: 'Comparativo e critério de decisão', body: `
<table><thead><tr><th>Critério</th><th>dict / TypedDict</th><th>dataclass</th><th>attrs</th><th>Pydantic</th></tr></thead><tbody>
<tr><td>Dependência</td><td>stdlib</td><td>stdlib</td><td>externa leve</td><td>externa (core em Rust)</td></tr>
<tr><td>Validação em runtime</td><td>não</td><td>manual</td><td>por campo</td><td>completa, com coerção</td></tr>
<tr><td>Custo de criação</td><td>mínimo</td><td>baixo</td><td>baixo</td><td>maior (valida)</td></tr>
<tr><td>Imutabilidade</td><td>não</td><td>frozen</td><td>frozen</td><td>frozen no config</td></tr>
<tr><td>JSON Schema e (de)serialização</td><td>manual</td><td>manual</td><td>cattrs</td><td>embutido</td></tr>
<tr><td>Uso ideal</td><td>JSON cru tipado</td><td>domínio interno</td><td>domínio com regras</td><td>fronteiras: API, config, LLM output</td></tr>
</tbody></table>
<p>Regra de bolso: <strong>valide uma vez, na borda; dentro, confie nos tipos</strong>. Pydantic na entrada, dataclass frozen no meio, e o type checker garantindo o resto. Para saída estruturada de LLM, Pydantic virou padrão: o <code>model_json_schema</code> alimenta o schema da chamada e o <code>model_validate_json</code> rejeita respostas fora do contrato.</p>
<div class="callout warn"><strong>PEGADINHA</strong> Herdar de <code>BaseModel</code> para entidades de domínio acopla o núcleo ao framework e à semântica de coerção. Outra: <code>copy</code> raso em dataclass com listas compartilha estado; use <code>copy.deepcopy</code> ou tipos imutáveis.</div>` },
    { id: 'perf-slots', title: 'Desempenho e memória: medindo, não chutando', body: `
<p>Para milhões de objetos pequenos, <code>slots=True</code> reduz memória e acelera o acesso a atributos. Não decore o número: meça.</p>
<pre><code class="language-python">import tracemalloc
from dataclasses import dataclass

@dataclass
class P1:
    x: float
    y: float

@dataclass(slots=True)
class P2:
    x: float
    y: float

def medir(cls, n=200_000):
    tracemalloc.start()
    xs = [cls(1.0, 2.0) for _ in range(n)]
    atual, _ = tracemalloc.get_traced_memory()
    tracemalloc.stop()
    return atual / n

print(round(medir(P1)), "bytes por objeto (com dict)")
print(round(medir(P2)), "bytes por objeto (slots)")</code></pre>
<p>Em geral a versão com slots ocupa bem menos, mas o valor depende da versão do Python e do número de campos. Para dados tabulares em grande volume, o próximo passo não são objetos melhores, é sair de objetos: <code>numpy</code>, <code>polars</code>, <code>pyarrow</code> ou <code>array</code>. Quanto ao Pydantic, meça <code>model_validate</code> no seu payload real antes de culpá-lo ou de removê-lo.</p>
<div class="callout tip"><strong>DICA</strong> <code>dataclasses.asdict</code> faz cópia profunda recursiva e é lento; para serializar em caminho quente, escreva um <code>to_dict</code> explícito ou use um serializador dedicado.</div>` },
  ],
  whenToUse: [
    'dataclass(frozen=True, slots=True) para value objects e eventos de domínio.',
    'kw_only=True quando a classe tem muitos campos do mesmo tipo (evita troca de posição).',
    'Pydantic para parsing de JSON de API, configuração e saída estruturada de LLM.',
    'attrs quando precisa de validadores e conversores por campo sem framework de parsing.',
    'TypedDict para anotar JSON que continuará sendo dict.',
  ],
  whenNot: [
    'Pydantic em loops quentes de domínio onde os dados já são confiáveis.',
    'Dataclass mutável com defaults mutáveis sem default_factory.',
    'Herdar BaseModel para entidades de domínio: acopla o núcleo ao framework.',
    'frozen=True com campos list ou dict: o hash falha e a imutabilidade é ilusória.',
    'Validação duplicada em toda camada: valide na borda e confie nos tipos dentro.',
  ],
  metrics: [
    'mypy --strict e pyright validam dataclass e Pydantic (plugin pydantic.mypy)',
    'tracemalloc para memória por objeto; timeit para custo de construção e validação',
    'model_json_schema e TypeAdapter para gerar contratos e testar compatibilidade',
    'ruff regras RUF008 e RUF012 (defaults mutáveis em dataclass e classe)',
    'Cobertura de testes nos casos inválidos: o valor está na rejeição, não na aceitação',
  ],
  refs: [
    { type: 'doc', title: 'dataclasses, Data Classes', author: 'Python Software Foundation', url: 'https://docs.python.org/3/library/dataclasses.html', note: 'Referência completa de campos, frozen, slots, kw_only e post_init.' },
    { type: 'doc', title: 'PEP 557: Data Classes', author: 'Eric V. Smith', url: 'https://peps.python.org/pep-0557/', note: 'A motivação e as decisões de design, incluindo por que não é attrs.' },
    { type: 'doc', title: 'attrs documentation', author: 'Hynek Schlawack', url: 'https://www.attrs.org/', note: 'Inclui a página "Why not..." que compara honestamente com dataclasses.' },
    { type: 'doc', title: 'Pydantic documentation (v2)', author: 'Pydantic', url: 'https://docs.pydantic.dev/latest/', note: 'Models, validators, strict mode, TypeAdapter e settings.' },
    { type: 'doc', title: 'cattrs', author: 'Tin Tvrtkovic', url: 'https://catt.rs/', note: 'Serialização estrutural sobre attrs e dataclasses, separada do modelo.' },
    { type: 'livro', title: 'Domain-Driven Design com Python (Architecture Patterns with Python)', author: 'Harry Percival e Bob Gregory', url: 'https://www.cosmicpython.com/', note: 'Value objects, entidades e fronteiras, grátis online.' },
    { type: 'livro', title: 'Fluent Python, 2nd ed.', author: 'Luciano Ramalho', url: 'https://www.oreilly.com/library/view/fluent-python-2nd/9781492056348/', note: 'Capítulo sobre construtores de classes de dados: namedtuple, TypedDict e dataclass.' },
  ]
};

window.LESSON_CONTENT['protocols-abc'] = {
  id: 'protocols-abc',
  title: 'ABCs e Protocols',
  etapa: 3, etapaName: 'OOP & tipagem',
  time: '60 min',
  tags: ['ABC', 'Protocol', 'duck typing', 'PEP 544'],
  tagline: 'Duck typing com <em>contrato verificável</em>: interface nominal quando você controla a hierarquia, estrutural quando não controla.',
  intro: `<p>Python nunca exigiu interfaces: "se anda como pato e grasna como pato, é pato". O problema aparece em escala. Quando um módulo recebe "algo que tenha <code>.read()</code>", o que isso significa exatamente? Quais métodos, com que assinatura, que retorno? Sem contrato, a documentação mente e o type checker é cego.</p>
<p>A linguagem oferece duas respostas. As ABCs (<code>abc.ABC</code>, PEP 3119) são interfaces <em>nominais</em>: a classe declara que herda ou se registra. Os Protocols (PEP 544, Python 3.8) são <em>estruturais</em>: qualquer classe com os métodos certos satisfaz o contrato, sem herdar de nada. Os Protocols trazem para a análise estática o duck typing que já existia em runtime.</p>
<p>Essa é a base para os princípios ISP e DIP da Etapa 5. Aqui você aprende o mecanismo e quando escolher cada um.</p>`,
  sections: [
    { id: 'duck-typing', title: 'Duck typing e o problema do contrato', body: `
<p>O código a seguir funciona em runtime com qualquer objeto que tenha <code>.write</code>, mas o editor não sabe disso e um erro de nome só estoura em produção.</p>
<pre><code class="language-python">def salvar(destino, linhas):
    for l in linhas:
        destino.write(l + "\\n")

import io, sys
salvar(sys.stdout, ["a", "b"])
salvar(io.StringIO(), ["c"])
salvar(open("/tmp/x.txt", "w"), ["d"])
salvar(42, ["e"])          # AttributeError so em runtime</code></pre>
<p>Para a biblioteca padrão ficar assim, a comunidade usou três mecanismos ao longo dos anos: documentação ("file-like object"), checagem defensiva (<code>hasattr</code>, LBYL) e ABCs. Os Protocols fecham o ciclo com checagem estática sem custo de herança.</p>` },
    { id: 'abc', title: 'ABC: interface nominal com @abstractmethod', body: `
<p>Uma classe que herda de <code>ABC</code> e declara métodos com <code>@abstractmethod</code> não pode ser instanciada até que uma subclasse implemente todos. Isso falha cedo (na construção) em vez de tarde (na chamada).</p>
<pre><code class="language-python">from abc import ABC, abstractmethod

class Repositorio(ABC):
    @abstractmethod
    def obter(self, id: int) -&gt; dict: ...

    @abstractmethod
    def salvar(self, obj: dict) -&gt; None: ...

    def obter_ou_none(self, id: int) -&gt; dict | None:   # metodo concreto (template)
        try:
            return self.obter(id)
        except KeyError:
            return None

class Memoria(Repositorio):
    def __init__(self) -&gt; None:
        self._d: dict[int, dict] = {}
    def obter(self, id: int) -&gt; dict:
        return self._d[id]
    def salvar(self, obj: dict) -&gt; None:
        self._d[obj["id"]] = obj

try:
    Repositorio()
except TypeError as e:
    print(e)    # Can't instantiate abstract class Repositorio ...</code></pre>
<p>ABCs também permitem <code>register</code> (herança virtual) e hooks <code>__subclasshook__</code>, que é como <code>collections.abc.Iterable</code> reconhece qualquer classe com <code>__iter__</code>. As ABCs de <code>collections.abc</code> (<code>Mapping</code>, <code>Sequence</code>, <code>Iterable</code>, <code>Callable</code>) são o catálogo que você deve usar nas anotações de parâmetros: aceite <code>Iterable[str]</code>, devolva <code>list[str]</code>.</p>
<div class="callout"><strong>NA ENTREVISTA</strong> "ABC não impede de sobrescrever tudo com <code>pass</code>": correto, o mecanismo garante apenas que o nome exista. O contrato semântico (pré e pós-condições) precisa de testes de contrato, discutidos na lição de LSP.</div>` },
    { id: 'protocol', title: 'Protocol: interface estrutural', body: `
<p>Um <code>Protocol</code> descreve a forma. O type checker verifica a compatibilidade estrutural, sem herança: quem implementa os métodos satisfaz, inclusive classes de terceiros que você não pode alterar.</p>
<pre><code class="language-python">from typing import Protocol

class SupportsWrite(Protocol):
    def write(self, s: str, /) -&gt; int: ...

def salvar(destino: SupportsWrite, linhas: list[str]) -&gt; None:
    for l in linhas:
        destino.write(l + "\\n")

import io, sys
salvar(sys.stdout, ["a"])      # ok
salvar(io.StringIO(), ["b"])   # ok
salvar(42, ["c"])              # erro do mypy/pyright: int nao tem write</code></pre>
<p>A tipagem de <code>typeshed</code> usa isso intensamente: <code>SupportsRead</code>, <code>SupportsIndex</code>, <code>Sized</code>, <code>Hashable</code>, <code>SupportsInt</code>. Protocols podem ter atributos, propriedades e métodos genéricos:</p>
<pre><code class="language-python">from typing import Protocol, Iterator, runtime_checkable

class Fechavel(Protocol):
    @property
    def fechado(self) -&gt; bool: ...
    def close(self) -&gt; None: ...

@runtime_checkable
class Nomeado(Protocol):
    nome: str

class Usuario:
    def __init__(self) -&gt; None:
        self.nome = "ana"

print(isinstance(Usuario(), Nomeado))   # True (so checa a presenca do atributo)</code></pre>
<div class="callout warn"><strong>PEGADINHA</strong> <code>@runtime_checkable</code> faz <code>isinstance</code> verificar apenas a <em>presença</em> dos membros, não assinaturas nem tipos, e é mais lento que isinstance comum. Use para guardas leves, não como validação de verdade. Para protocols com atributos de dados, <code>issubclass</code> não é suportado.</div>` },
    { id: 'quando-qual', title: 'ABC ou Protocol: critério de escolha', body: `
<table><thead><tr><th>Situação</th><th>Escolha</th><th>Motivo</th></tr></thead><tbody>
<tr><td>Você controla todas as implementações e quer código compartilhado (template method)</td><td>ABC</td><td>Herda comportamento e falha cedo ao instanciar incompleta</td></tr>
<tr><td>Implementações em bibliotecas de terceiros ou sem relação</td><td>Protocol</td><td>Não exige herança nem registro</td></tr>
<tr><td>Parâmetro de função que só usa um ou dois métodos</td><td>Protocol pequeno</td><td>Dependência mínima (ISP), testes com fakes triviais</td></tr>
<tr><td>Plugin que precisa de validação em tempo de definição</td><td>ABC (ou __init_subclass__)</td><td>Verificação nominal na carga</td></tr>
<tr><td>API pública de biblioteca</td><td>Protocol + docs</td><td>Usuário não precisa importar sua classe base para ser compatível</td></tr>
</tbody></table>
<p>Em código novo de aplicação, eu começo com Protocol no ponto de consumo e só uso ABC quando existe comportamento concreto a compartilhar. A regra de Hynek e de muitos mantenedores: "defina o Protocol onde ele é <em>usado</em>, não onde é implementado". Isso inverte a dependência naturalmente (DIP).</p>
<pre><code class="language-python">from typing import Protocol

class Notificador(Protocol):          # definido perto de quem consome
    def enviar(self, destino: str, texto: str) -&gt; None: ...

class Cadastro:
    def __init__(self, notificador: Notificador) -&gt; None:
        self._n = notificador
    def registrar(self, email: str) -&gt; None:
        self._n.enviar(email, "bem-vindo")

class FakeNotificador:                # nenhum import do Protocol necessario
    def __init__(self) -&gt; None:
        self.enviados: list[tuple[str, str]] = []
    def enviar(self, destino: str, texto: str) -&gt; None:
        self.enviados.append((destino, texto))

n = FakeNotificador()
Cadastro(n).registrar("a@b.com")
assert n.enviados == [("a@b.com", "bem-vindo")]</code></pre>` },
    { id: 'generic-protocol', title: 'Protocols genéricos, callbacks e membros', body: `
<p>Protocols aceitam genéricos e descrevem callables com <code>__call__</code>, o que permite tipar callbacks com argumentos nomeados, algo que <code>Callable[[int], str]</code> não expressa.</p>
<pre><code class="language-python">from typing import Protocol

class Repo[T](Protocol):                     # PEP 695 (3.12+)
    def obter(self, id: int) -&gt; T: ...
    def salvar(self, obj: T) -&gt; None: ...

class Formatador(Protocol):
    def __call__(self, valor: float, *, casas: int = 2) -&gt; str: ...

def brl(valor: float, *, casas: int = 2) -&gt; str:
    return f"R$ {valor:,.{casas}f}"

def mostrar(v: float, fmt: Formatador) -&gt; str:
    return fmt(v, casas=1)

print(mostrar(1234.5, brl))</code></pre>
<p>Em hierarquias com <code>@property</code>, lembre que um atributo mutável num Protocol exige atributo mutável na implementação; use <code>@property</code> somente leitura para aceitar também implementações imutáveis (por exemplo dataclass frozen).</p>
<pre><code class="language-python">class TemId(Protocol):
    @property
    def id(self) -&gt; int: ...       # aceita atributo comum, property e frozen</code></pre>` },
    { id: 'armadilhas', title: 'Armadilhas e boas práticas', body: `
<ul>
<li><strong>Protocol largo demais</strong>: um Protocol com 10 métodos é uma ABC disfarçada. Quebre por papel (leitor, escritor).</li>
<li><strong>Sobrescrever com assinatura incompatível</strong>: o type checker reclama (Liskov); não silencie com <code>type: ignore</code>, corrija o design.</li>
<li><strong>Herdar explicitamente de um Protocol</strong> é permitido e útil (dá métodos default e erro de checagem na própria classe), mas aí você voltou ao nominal, e o Protocol com <code>__init__</code> não é instanciável.</li>
<li><strong>Confundir tipagem com validação</strong>: Protocol não roda em produção; dados de fora precisam de validação (lição 14).</li>
<li><strong>ABC com muitos métodos abstratos triviais</strong> encoraja subclasses que fazem <code>raise NotImplementedError</code>: smell de herança forçada.</li>
</ul>
<div class="callout tip"><strong>DICA</strong> Prefira parâmetros com o tipo mais genérico que a função realmente usa (<code>Iterable</code>, <code>Mapping</code>, <code>SupportsRead</code>) e retornos concretos. É a "lei de Postel" aplicada a tipos, e deixa chamadores e testes livres.</div>` },
  ],
  whenToUse: [
    'Protocol quando consome objetos de terceiros ou quer depender só do que usa.',
    'ABC quando há comportamento concreto compartilhado e você controla a hierarquia.',
    'collections.abc nas anotações de parâmetro (Iterable, Mapping, Sequence).',
    'Protocol com __call__ para tipar callbacks com keyword-only.',
    'runtime_checkable apenas para guardas leves e plugins, sabendo as limitações.',
  ],
  whenNot: [
    'ABC apenas para "dar o formato" sem código compartilhado: um Protocol é mais leve.',
    'Protocol gigante com muitos métodos: viola ISP, divida por papel.',
    'isinstance com Protocol como se fosse validação de assinatura.',
    'Hierarquia de ABCs profunda: você está replicando Java.',
    'Usar Protocol para dados externos: valide com Pydantic, o Protocol não existe em runtime.',
  ],
  metrics: [
    'mypy --strict e pyright apontam implementações incompatíveis com o Protocol',
    'reveal_type(x) e reveal_locals() para inspecionar o tipo inferido',
    'typeshed como catálogo de Protocols da stdlib (SupportsRead, SupportsWrite)',
    'Testes de contrato parametrizados sobre todas as implementações',
    'ruff regras B027 e B024 (métodos abstratos vazios, ABC sem métodos abstratos)',
  ],
  refs: [
    { type: 'doc', title: 'PEP 544: Protocols, Structural subtyping (static duck typing)', author: 'Ivan Levkivskyi, Jukka Lehtosalo, Łukasz Langa', url: 'https://peps.python.org/pep-0544/', note: 'A especificação e as decisões de design.' },
    { type: 'doc', title: 'PEP 3119: Introducing Abstract Base Classes', author: 'Guido van Rossum, Talin', url: 'https://peps.python.org/pep-3119/', note: 'A origem das ABCs e do isinstance customizável.' },
    { type: 'doc', title: 'abc, Abstract Base Classes', author: 'Python Software Foundation', url: 'https://docs.python.org/3/library/abc.html', note: 'Referência de @abstractmethod, register e __subclasshook__.' },
    { type: 'doc', title: 'typing: Protocols in the typing spec', author: 'Python Typing Council', url: 'https://typing.python.org/en/latest/spec/protocol.html', note: 'A especificação viva, mantida independente do CPython.' },
    { type: 'livro', title: 'Fluent Python, 2nd ed.', author: 'Luciano Ramalho', url: 'https://www.oreilly.com/library/view/fluent-python-2nd/9781492056348/', note: 'Capítulo "Interfaces, Protocols and ABCs": a melhor discussão do tema, tradução brasileira pela Novatec.' },
    { type: 'doc', title: 'Protocols and structural subtyping (mypy)', author: 'mypy', url: 'https://mypy.readthedocs.io/en/stable/protocols.html', note: 'Exemplos práticos e limitações do checador.' },
    { type: 'livro', title: 'Architecture Patterns with Python', author: 'Harry Percival e Bob Gregory', url: 'https://www.cosmicpython.com/', note: 'Uso de abstrações e fakes em ports and adapters.' },
  ]
};

window.LESSON_CONTENT['type-hints'] = {
  id: 'type-hints',
  title: 'Type hints e checagem estática',
  etapa: 3, etapaName: 'OOP & tipagem',
  time: '75 min',
  tags: ['typing', 'mypy', 'pyright', 'PEP 484'],
  tagline: 'Anotações não rodam sozinhas: elas são <em>documentação executável</em> para um verificador que pega bugs antes do deploy.',
  intro: `<p>Python é dinamicamente tipado e continuará sendo. Type hints (PEP 484, Python 3.5) são metadados opcionais que o interpretador guarda e ignora; quem os usa é o type checker (mypy, pyright, pyrefly, ty), o editor e bibliotecas como Pydantic e FastAPI. O resultado é tipagem <em>gradual</em>: você tipa onde compensa e o resto segue como Any.</p>
<p>Em bases grandes, tipos pagam o investimento três vezes: pegam erros de integração (None onde não podia), tornam refactor seguro (o checker acha todos os usos) e substituem comentários que mentem. Em entrevista sênior, se espera que você tipe código real, entenda <code>Optional</code> vs default, variância, e saiba defender o nível de rigor de um projeto.</p>
<p>Esta lição cobre sintaxe moderna (3.10+ e 3.12+), mypy e pyright, estratégia de adoção gradual e os erros que mais confundem. Generics e recursos avançados ficam na lição 17.</p>`,
  sections: [
    { id: 'sintaxe-moderna', title: 'Sintaxe moderna: o que mudou desde o PEP 484', body: `
<p>O vocabulário de hoje é bem mais enxuto que o de 2016. Em Python 3.9+, tipos built-in são genéricos (<code>list[int]</code>); em 3.10+, uniões usam <code>|</code> (PEP 604); em 3.12+, parâmetros de tipo têm sintaxe própria (PEP 695, lição 17). Evite <code>typing.List</code>, <code>typing.Dict</code>, <code>typing.Optional</code> e <code>typing.Union</code> em código novo.</p>
<table><thead><tr><th>Antigo</th><th>Moderno</th></tr></thead><tbody>
<tr><td><code>List[int]</code>, <code>Dict[str, int]</code></td><td><code>list[int]</code>, <code>dict[str, int]</code></td></tr>
<tr><td><code>Optional[str]</code></td><td><code>str | None</code></td></tr>
<tr><td><code>Union[int, str]</code></td><td><code>int | str</code></td></tr>
<tr><td><code>Callable</code> de <code>typing</code></td><td><code>collections.abc.Callable</code></td></tr>
<tr><td><code>"Pessoa"</code> (string forward ref)</td><td><code>Pessoa</code> direto, com <code>from __future__ import annotations</code> ou 3.14</td></tr>
</tbody></table>
<pre><code class="language-python">from collections.abc import Callable, Iterable, Mapping, Sequence

def agrupar(itens: Iterable[str], chave: Callable[[str], int]) -&gt; dict[int, list[str]]:
    saida: dict[int, list[str]] = {}
    for i in itens:
        saida.setdefault(chave(i), []).append(i)
    return saida

def primeiro(xs: Sequence[int]) -&gt; int | None:
    return xs[0] if xs else None

def tem_chave(m: Mapping[str, int], k: str) -&gt; bool:
    return k in m</code></pre>
<p>Sobre avaliação de anotações: no 3.14 o PEP 649 (e o PEP 749) tornou a avaliação das anotações <em>adiada</em> por padrão, então referências a nomes definidos depois funcionam sem aspas e sem <code>from __future__ import annotations</code>. Para inspecionar em runtime, o módulo novo <code>annotationlib</code> é a API. Em bibliotecas que suportam versões antigas, o <code>__future__</code> continua válido.</p>` },
    { id: 'optional-none', title: 'None, Optional e narrowing', body: `
<p>O bug mais comum que o checker pega é o <code>None</code> inesperado. <code>str | None</code> significa "pode ser None", não "argumento opcional" (isso é ter default). O checker faz <em>narrowing</em>: depois de um teste, o tipo se estreita no ramo.</p>
<pre><code class="language-python">import re

def dominio(email: str | None) -&gt; str:
    if email is None:
        return ""
    # aqui email: str
    m = re.search(r"@(.+)$", email)
    return m.group(1) if m else ""    # m: re.Match[str] | None, estreitado pelo ternario

def tamanho(x: int | str | list[int]) -&gt; int:
    if isinstance(x, int):
        return x
    return len(x)                      # x: str | list[int]</code></pre>
<p>Ferramentas de narrowing: <code>is None</code>, <code>isinstance</code>, <code>in</code> (com Literal), <code>callable</code>, igualdade com <code>Literal</code>, e funções definidas pelo usuário com <code>TypeGuard</code>/<code>TypeIs</code> (PEP 742, 3.13). <code>TypeIs</code> é mais preciso que <code>TypeGuard</code>: estreita também o ramo negativo.</p>
<pre><code class="language-python">from typing import TypeIs

def e_lista_de_str(x: list[object]) -&gt; TypeIs[list[str]]:
    return all(isinstance(i, str) for i in x)

def f(x: list[object]) -&gt; None:
    if e_lista_de_str(x):
        print(", ".join(x))     # x: list[str]</code></pre>
<div class="callout warn"><strong>PEGADINHA</strong> <code>def f(x: int = None)</code> era aceito pelo mypy antigo (Optional implícito); hoje é erro por padrão. Escreva <code>x: int | None = None</code>. E <code>assert x is not None</code> estreita o tipo, mas some com <code>python -O</code>; para entrada externa, valide com <code>if</code> e exceção.</div>` },
    { id: 'mypy-pyright', title: 'mypy, pyright e companhia', body: `
<p>Os dois checadores mainstream têm filosofias próximas, mas diferem em detalhe: mypy é o pioneiro (nascido no Dropbox, hoje mantido pela comunidade), escrito em Python, com ecossistema de plugins (Pydantic, SQLAlchemy, Django-stubs). Pyright (Microsoft) é escrito em TypeScript, é bem mais rápido, tem inferência mais agressiva e é o motor do Pylance. Há também checadores novos em Rust (pyrefly da Meta e ty da Astral), em evolução rápida; confira o estado atual antes de adotá-los.</p>
<pre><code class="language-toml"># pyproject.toml
[tool.mypy]
python_version = "3.12"
strict = true
warn_unreachable = true
plugins = ["pydantic.mypy"]

[[tool.mypy.overrides]]
module = "legado.*"
ignore_errors = true          # adocao gradual por modulo

[tool.pyright]
typeCheckingMode = "strict"
pythonVersion = "3.12"
include = ["src"]
reportMissingTypeStubs = false</code></pre>
<p>O que <code>--strict</code> liga: proíbe funções sem anotação, Any implícito em genéricos, retorno Any de função tipada, <code>type: ignore</code> sem uso, entre outros. Comece não estrito no legado e <em>aperte por módulo</em>. Para terceiros sem tipos, instale <code>types-*</code> (stubs do typeshed) ou escreva <code>.pyi</code> mínimos.</p>
<pre><code class="language-bash">pip install mypy pyright
mypy src --strict
pyright src
mypy --install-types --non-interactive   # baixa stubs de terceiros ausentes
reveal_type() &amp;&amp; echo "use reveal_type(x) no codigo para ver o tipo inferido"</code></pre>
<div class="callout"><strong>NA ENTREVISTA</strong> "mypy ou pyright?" A resposta madura: rodo o que o time já usa no CI como fonte da verdade, e o editor mostra o outro. As divergências (inferência de literais, <code>list</code> invariante, narrowing de atributos) são conhecidas. Importante é que <em>uma</em> ferramenta seja bloqueante no CI.</div>` },
    { id: 'tipos-uteis', title: 'Literal, Final, TypedDict, NewType e Any vs object', body: `
<pre><code class="language-python">from typing import Literal, Final, NewType, TypedDict, NotRequired, Any, cast

Modo = Literal["r", "w", "a"]
MAX_TENTATIVAS: Final = 3                    # nao reatribuir

UserId = NewType("UserId", int)              # tipo distinto na checagem, int em runtime

class Config(TypedDict):
    host: str
    porta: int
    debug: NotRequired[bool]

def abrir(caminho: str, modo: Modo = "r") -&gt; None: ...

def buscar(uid: UserId) -&gt; Config:
    return {"host": "localhost", "porta": 5432}

buscar(UserId(7))        # ok
# buscar(7)              # erro: int nao eh UserId
# abrir("x", "z")        # erro: "z" nao esta em Modo

def processa(x: object) -&gt; None:   # object: aceita tudo, mas voce precisa estreitar
    if isinstance(x, str):
        print(x.upper())

def solta(x: Any) -&gt; None:         # Any: desliga a checagem, contamina o que toca
    x.qualquer.coisa()</code></pre>
<p><code>Any</code> é um escape que desliga a checagem e se propaga. <code>object</code> é o tipo seguro para "qualquer coisa": você é obrigado a estreitar antes de usar. Prefira <code>object</code> a <code>Any</code> e use <code>cast</code> só com justificativa. <code>TypedDict</code> descreve a forma de dicts vindos de JSON; para parsing validado, Pydantic (lição 14).</p>` },
    { id: 'adocao-gradual', title: 'Adoção gradual em base existente', body: `
<p>A estratégia que funciona em bases legadas, na ordem:</p>
<ol>
<li><strong>Rode sem estrito</strong> e registre a linha de base de erros. Não zere antes de começar.</li>
<li><strong>Bloqueie regressão</strong>: CI falha se aparecer erro novo (ou use <code>--strict</code> apenas em módulos novos e nos já limpos, via overrides).</li>
<li><strong>Tipe as fronteiras primeiro</strong>: assinaturas públicas, modelos de dados, funções muito chamadas. O retorno é maior que tipar variáveis locais (a inferência cobre).</li>
<li><strong>Elimine Any vindo de dentro</strong> (json.loads, funções sem retorno anotado); use <code>reportAny</code>/<code>disallow_any_explicit</code> onde fizer sentido.</li>
<li><strong>Aperte</strong> módulo a módulo até <code>strict</code>, e mantenha <code>warn_unused_ignores</code>.</li>
</ol>
<pre><code class="language-python">from typing import reveal_type

def carregar(raw: str) -&gt; dict[str, int]:
    import json
    dados = json.loads(raw)       # tipo: Any
    reveal_type(dados)            # mypy/pyright mostram Any
    return dados                  # passa, mas voce perdeu a garantia

# melhor: validar na borda
from pydantic import TypeAdapter
Contagens = TypeAdapter(dict[str, int])
def carregar_seguro(raw: str) -&gt; dict[str, int]:
    return Contagens.validate_json(raw)</code></pre>
<p>Dica de orçamento: anotações são documentação que o CI verifica. Se a equipe tem medo de "perder tempo", mostre o primeiro <code>NoneType has no attribute</code> que o checker pegar em revisão.</p>` },
    { id: 'erros-comuns', title: 'Erros que confundem e como resolver', body: `
<ul>
<li><strong>Invariância de list</strong>: <code>list[int]</code> não é <code>list[float]</code> nem <code>list[int | str]</code>, porque você poderia inserir um tipo errado. Aceite <code>Sequence[float]</code> (covariante, só leitura) como parâmetro.</li>
<li><strong>Default mutável em assinatura</strong>: mesmo tipado, continua sendo bug. Use <code>None</code> e crie dentro.</li>
<li><strong>Retorno Optional demais</strong>: funções que "às vezes" devolvem None espalham <code>if</code>. Prefira levantar exceção ou devolver um tipo vazio (lista vazia).</li>
<li><strong>Circular imports só de tipo</strong>: use <code>if TYPE_CHECKING:</code> para importar apenas na checagem.</li>
<li><strong><code>type: ignore</code> genérico</strong>: especifique o código (<code>type: ignore[arg-type]</code>) e comente por quê.</li>
</ul>
<pre><code class="language-python">from __future__ import annotations
from typing import TYPE_CHECKING
from collections.abc import Sequence

if TYPE_CHECKING:
    from pedidos import Pedido      # evita ciclo em runtime

def total(pedidos: Sequence[Pedido]) -&gt; float:
    return sum(p.valor for p in pedidos)

def media(xs: Sequence[float]) -&gt; float:
    return sum(xs) / len(xs)

inteiros: list[int] = [1, 2, 3]
print(media(inteiros))              # ok: int e compativel com float (promocao numerica)</code></pre>
<div class="callout tip"><strong>DICA</strong> Tipos documentam, mas não validam em runtime. Em Python, "int" na anotação não impede <code>"abc"</code> de chegar de uma API. Combine checagem estática (interior) com validação na borda (exterior).</div>` },
  ],
  whenToUse: [
    'Em todo código novo com vida útil maior que um script: assinaturas públicas sempre tipadas.',
    'Em bibliotecas, onde os tipos são parte da API (py.typed no pacote).',
    'Para refactors seguros em bases grandes: o checker lista todos os usos afetados.',
    'Com Protocol, Literal e TypedDict para descrever contratos antes de implementar.',
    'No CI como gate: um checador bloqueante, outro opcional no editor.',
  ],
  whenNot: [
    'Em notebooks exploratórios e scripts descartáveis: o custo supera o ganho.',
    'Anotar tudo com Any para calar o checker: pior que não anotar.',
    'type: ignore em massa para atingir "zero erros" sem corrigir causas.',
    'Confiar nos tipos para validar entrada externa: precisa de validação em runtime.',
    'Tipos tão complexos que o leitor não entende: simplifique o design em vez de fazer malabarismo.',
  ],
  metrics: [
    'mypy --strict src e pyright src no CI, com versão fixada',
    'reveal_type(expr) para depurar inferência',
    'mypy --html-report e --txt-report para medir cobertura de tipos',
    'pyright --verifytypes pacote para bibliotecas com py.typed',
    'warn_unused_ignores, warn_return_any, disallow_untyped_defs como degraus até strict',
  ],
  refs: [
    { type: 'doc', title: 'PEP 484: Type Hints', author: 'Guido van Rossum, Jukka Lehtosalo, Łukasz Langa', url: 'https://peps.python.org/pep-0484/', note: 'O documento fundador.' },
    { type: 'doc', title: 'Static Typing with Python (documentação e especificação)', author: 'Python Typing Council', url: 'https://typing.python.org/en/latest/', note: 'Guias, referência e a especificação viva do sistema de tipos.' },
    { type: 'doc', title: 'mypy documentation', author: 'mypy', url: 'https://mypy.readthedocs.io/en/stable/', note: 'Inclui "Type hints cheat sheet" e o guia de adoção em código existente.' },
    { type: 'doc', title: 'Pyright documentation', author: 'Microsoft', url: 'https://microsoft.github.io/pyright/', note: 'Modos basic, standard e strict; comparativo com mypy.' },
    { type: 'doc', title: 'PEP 649: Deferred Evaluation Of Annotations Using Descriptors', author: 'Larry Hastings', url: 'https://peps.python.org/pep-0649/', note: 'Por que anotações adiadas funcionam no Python 3.14.' },
    { type: 'doc', title: 'PEP 742: Narrowing types with TypeIs', author: 'Jelle Zijlstra', url: 'https://peps.python.org/pep-0742/', note: 'Guardas de tipo mais precisas, 3.13.' },
    { type: 'livro', title: 'Robust Python', author: 'Patrick Viafore', url: 'https://www.oreilly.com/library/view/robust-python/9781098100650/', note: 'Tipos como ferramenta de design e comunicação.' },
    { type: 'video', title: 'Live de Python sobre type hints', author: 'Eduardo Mendes', url: 'https://www.youtube.com/@Dunossauro', note: 'Aulas em português sobre tipagem e mypy.' },
  ]
};

window.LESSON_CONTENT['generics-avancado'] = {
  id: 'generics-avancado',
  title: 'Generics e tipagem avançada',
  etapa: 3, etapaName: 'OOP & tipagem',
  time: '75 min',
  tags: ['generics', 'TypeVar', 'ParamSpec', 'PEP 695'],
  tagline: 'Quando o tipo de saída <em>depende</em> do tipo de entrada, você precisa de generics, não de Any.',
  intro: `<p>Uma função <code>primeiro(xs)</code> devolve o primeiro elemento. Se você anota o retorno como <code>Any</code>, perde tudo. Generics resolvem isso: "devolve o mesmo tipo dos elementos de xs". É o mecanismo que faz <code>list[int].pop()</code> devolver <code>int</code> e que tipa decoradores, repositórios, caches e containers.</p>
<p>O sistema de tipos de Python evoluiu em PEPs sucessivos: TypeVar (484), Protocol (544), ParamSpec (612) para decoradores, TypeVarTuple (646) para formas de arrays, Self (673), override (698) e, em 3.12, a sintaxe nativa de parâmetros de tipo (695), que substitui boa parte da cerimônia antiga. Em 3.13, defaults de TypeVar (696), TypeIs (742) e ReadOnly (705).</p>
<p>Essa lição é onde bibliotecas como FastAPI, Pydantic e SQLAlchemy passam a fazer sentido por dentro. Em entrevista sênior, tipar um decorador com ParamSpec é pergunta clássica.</p>`,
  sections: [
    { id: 'typevar-pep695', title: 'TypeVar e a sintaxe PEP 695', body: `
<p>A forma antiga declara a variável de tipo fora da função. Desde o Python 3.12, a sintaxe <code>def f[T](...)</code> e <code>class C[T]</code> declara o escopo do parâmetro no próprio ponto de uso.</p>
<pre><code class="language-python"># forma antiga (PEP 484), ainda valida e necessaria para 3.11-
from typing import TypeVar, Sequence
T = TypeVar("T")
def primeiro_old(xs: Sequence[T]) -&gt; T:
    return xs[0]

# forma moderna (PEP 695, Python 3.12+)
def primeiro[T](xs: Sequence[T]) -&gt; T:
    return xs[0]

class Pilha[T]:
    def __init__(self) -&gt; None:
        self._itens: list[T] = []
    def push(self, x: T) -&gt; None:
        self._itens.append(x)
    def pop(self) -&gt; T:
        return self._itens.pop()

p = Pilha[int]()
p.push(1)
x = p.pop()                  # tipo: int

type Json = dict[str, Json] | list[Json] | str | int | float | bool | None   # alias recursivo (3.12)</code></pre>
<p>A palavra-chave <code>type</code> cria um <code>TypeAliasType</code> com avaliação preguiçosa, o que permite alias recursivo sem aspas. A variância é inferida automaticamente na sintaxe nova (você não precisa declarar <code>covariant=True</code>). Em 3.13, <code>def f[T = int]()</code> aceita um default (PEP 696).</p>
<div class="callout warn"><strong>PEGADINHA</strong> A sintaxe PEP 695 exige 3.12+. Bibliotecas que suportam versões anteriores precisam da forma com <code>TypeVar</code>. Se o <code>requires-python</code> do projeto é <code>&gt;=3.12</code>, migre e apague a cerimônia.</div>` },
    { id: 'bound-constraints', title: 'Bound, constraints e variância', body: `
<p>Um <code>TypeVar</code> sem restrição aceita qualquer coisa. Duas formas de limitar: <strong>bound</strong> (qualquer subtipo de X) e <strong>constraints</strong> (exatamente um entre vários tipos).</p>
<pre><code class="language-python">from typing import Protocol

class Comparavel(Protocol):
    def __lt__(self, outro, /) -&gt; bool: ...

def maximo[T: Comparavel](a: T, b: T) -&gt; T:     # bound
    return b if a &lt; b else a

def somar[N: (int, float)](a: N, b: N) -&gt; N:     # constraints
    return a + b

print(maximo(3, 5), maximo("a", "b"))
# maximo(1, "a")  -&gt; erro: T nao pode ser ambos</code></pre>
<p>Variância descreve como a relação de subtipo dos parâmetros afeta o contêiner. <strong>Covariante</strong>: <code>Sequence[Gato]</code> é subtipo de <code>Sequence[Animal]</code> (só leitura). <strong>Contravariante</strong>: <code>Callable[[Animal], None]</code> é subtipo de <code>Callable[[Gato], None]</code> (quem aceita animais aceita gatos). <strong>Invariante</strong>: <code>list[Gato]</code> não é <code>list[Animal]</code>, porque escrita quebraria. Regra de bolso: produtor é covariante (<code>out</code>), consumidor é contravariante (<code>in</code>), os dois é invariante.</p>
<pre><code class="language-python">from collections.abc import Sequence

class Animal: ...
class Gato(Animal): ...

def listar(animais: Sequence[Animal]) -&gt; None: ...
gatos: list[Gato] = [Gato()]
listar(gatos)           # ok, Sequence eh covariante

def adotar(animais: list[Animal]) -&gt; None:
    animais.append(Animal())
# adotar(gatos)         # erro: list eh invariante, poluiria a lista de gatos</code></pre>` },
    { id: 'paramspec', title: 'ParamSpec e decoradores tipados', body: `
<p>Sem <code>ParamSpec</code> (PEP 612, 3.10), um decorador genérico perde a assinatura da função decorada. Com ele, você captura os parâmetros e os repassa.</p>
<pre><code class="language-python">import functools, time
from collections.abc import Callable

def medido[**P, R](fn: Callable[P, R]) -&gt; Callable[P, R]:
    @functools.wraps(fn)
    def wrapper(*args: P.args, **kwargs: P.kwargs) -&gt; R:
        t0 = time.perf_counter()
        try:
            return fn(*args, **kwargs)
        finally:
            print(f"{fn.__name__}: {time.perf_counter() - t0:.4f}s")
    return wrapper

@medido
def somar(a: int, b: int = 0) -&gt; int:
    return a + b

somar(1, b=2)         # checker conhece (a: int, b: int = 0) -&gt; int
# somar("x")          # erro de tipo corretamente detectado</code></pre>
<p>Para decoradores que <em>adicionam</em> argumentos use <code>Concatenate</code>:</p>
<pre><code class="language-python">from typing import Concatenate

class Conn: ...

def com_conexao[**P, R](fn: Callable[Concatenate[Conn, P], R]) -&gt; Callable[P, R]:
    def wrapper(*args: P.args, **kwargs: P.kwargs) -&gt; R:
        return fn(Conn(), *args, **kwargs)
    return wrapper

@com_conexao
def consulta(c: Conn, sql: str) -&gt; list[tuple]:
    return []

consulta("select 1")      # c injetado, tipo da chamada: (sql: str) -&gt; ...</code></pre>
<p><code>TypeVarTuple</code> (PEP 646, 3.11) cobre o caso de número variável de tipos, como o <em>shape</em> de arrays: <code>class Array[*Shape]</code>. É nicho, mas explica por que libs de tensor tipam dimensões.</p>` },
    { id: 'self-override-overload', title: 'Self, override e overload', body: `
<p><code>Self</code> (PEP 673, 3.11) é o tipo "a própria classe, incluindo subclasses", ideal para builders e métodos fluentes e para <code>@classmethod</code> construtores. <code>@override</code> (PEP 698, 3.12) pede ao checker que verifique que o método realmente sobrescreve algo, pegando renomeações silenciosas.</p>
<pre><code class="language-python">from typing import Self, override

class Query:
    def __init__(self) -&gt; None:
        self.filtros: list[str] = []
    def onde(self, f: str) -&gt; Self:
        self.filtros.append(f)
        return self
    @classmethod
    def vazio(cls) -&gt; Self:
        return cls()

class QuerySql(Query):
    @override
    def onde(self, f: str) -&gt; Self:
        return super().onde(f.lower())

q = QuerySql.vazio().onde("A").onde("B")   # tipo: QuerySql, nao Query</code></pre>
<p><code>@overload</code> descreve funções cujo tipo de retorno depende dos argumentos. A implementação real vem depois das assinaturas e não é visível ao checker.</p>
<pre><code class="language-python">from typing import overload, Literal

@overload
def ler(caminho: str, *, binario: Literal[True]) -&gt; bytes: ...
@overload
def ler(caminho: str, *, binario: Literal[False] = False) -&gt; str: ...
def ler(caminho: str, *, binario: bool = False) -&gt; str | bytes:
    modo = "rb" if binario else "r"
    with open(caminho, modo) as f:
        return f.read()

a = ler("x.txt")                 # str
b = ler("x.bin", binario=True)   # bytes</code></pre>` },
    { id: 'typeddict-literal-newtype', title: 'TypedDict avançado, Unpack e ReadOnly', body: `
<p><code>TypedDict</code> pode ser genérico, ter chaves opcionais (<code>NotRequired</code>) e, a partir do 3.13, chaves somente leitura (<code>ReadOnly</code>, PEP 705). Com <code>Unpack</code> (PEP 692, 3.12), você tipa <code>**kwargs</code> pela forma do TypedDict, evitando repetir parâmetros.</p>
<pre><code class="language-python">from typing import TypedDict, Unpack, NotRequired

class Opcoes(TypedDict):
    timeout: float
    retries: NotRequired[int]

def requisitar(url: str, **kw: Unpack[Opcoes]) -&gt; None:
    print(url, kw["timeout"], kw.get("retries", 0))

requisitar("http://x", timeout=2.0)
# requisitar("http://x", retries=1)    # erro: falta timeout
# requisitar("http://x", timeout=1, foo=2)  # erro: chave desconhecida</code></pre>
<p>Outros recursos úteis: <code>Literal</code> e <code>LiteralString</code> (anti-injeção em APIs de SQL), <code>Annotated</code> (metadados que Pydantic e FastAPI leem), <code>Never</code> e <code>assert_never</code> (exaustividade, lição 18) e <code>Required</code>/<code>NotRequired</code>.</p>
<pre><code class="language-python">from typing import Annotated
from pydantic import BaseModel, Field

Percentual = Annotated[float, Field(ge=0, le=100)]

class Meta(BaseModel):
    cobertura: Percentual</code></pre>` },
    { id: 'quando-parar', title: 'Quando parar: legibilidade acima de malabarismo', body: `
<p>O sistema de tipos é Turing completo na prática, o que não significa que você deva usá-lo assim. Regras de maturidade:</p>
<ul>
<li>Se a anotação ocupa mais linhas que a função, o design provavelmente está errado; separe responsabilidades.</li>
<li>Prefira <code>Protocol</code> pequeno a uma pilha de <code>Union</code> e <code>overload</code>.</li>
<li>Em código de aplicação, genéricos aparecem pouco (repositórios, resultados, caches); em bibliotecas, muito.</li>
<li>Se precisa de <code>cast</code> ou <code>type: ignore</code> frequentes num módulo, o checker está dizendo que o design resiste à tipagem.</li>
<li>Teste os tipos: <code>typing.assert_type</code> e <code>reveal_type</code> em testes verificados pelo checker; projetos como <code>pytest-mypy-plugins</code> e <code>typing_extensions</code> ajudam.</li>
</ul>
<pre><code class="language-python">from typing import assert_type

def dobrar[T: (int, str)](x: T) -&gt; T:
    return x * 2

assert_type(dobrar(2), int)       # checado pelo mypy/pyright, no-op em runtime
assert_type(dobrar("a"), str)</code></pre>
<div class="callout"><strong>NA ENTREVISTA</strong> "Tipe um decorador que preserva a assinatura." Resposta: <code>ParamSpec</code> para os parâmetros, <code>TypeVar</code> para o retorno, <code>functools.wraps</code> para metadados runtime. Se perguntarem de variância, o exemplo de <code>list</code> invariante vs <code>Sequence</code> covariante basta.</div>` },
  ],
  whenToUse: [
    'Containers e utilitários onde o tipo de saída depende do de entrada (pilha, cache, resultado).',
    'Decoradores que precisam preservar a assinatura: ParamSpec.',
    'Métodos fluentes e construtores alternativos com Self.',
    'Funções cujo retorno varia por argumento Literal: overload.',
    'Uso de override para detectar renomeações silenciosas em hierarquias.',
  ],
  whenNot: [
    'Generics decorativos que o leitor não consegue explicar em uma frase.',
    'Overload quando uma união simples no retorno resolve.',
    'TypeVarTuple e ParamSpec em código de aplicação comum: são ferramentas de biblioteca.',
    'Silenciar o checker com Any ou cast em vez de corrigir o desenho.',
    'PEP 695 em bibliotecas que ainda suportam 3.11 ou anterior.',
  ],
  metrics: [
    'mypy --strict e pyright strict validam variância e ParamSpec',
    'reveal_type e assert_type em testes de tipo',
    'typing_extensions para backport de Self, override, TypeIs, ReadOnly',
    'pyright --verifytypes para medir completude de tipos de uma biblioteca',
    'pytest-mypy-plugins para testes de regressão de inferência',
  ],
  refs: [
    { type: 'doc', title: 'PEP 695: Type Parameter Syntax', author: 'Eric Traut', url: 'https://peps.python.org/pep-0695/', note: 'A sintaxe def f[T] e a palavra-chave type, Python 3.12.' },
    { type: 'doc', title: 'PEP 612: Parameter Specification Variables', author: 'Mark Mendoza', url: 'https://peps.python.org/pep-0612/', note: 'ParamSpec e Concatenate, a base de decoradores tipados.' },
    { type: 'doc', title: 'PEP 646: Variadic Generics', author: 'Mark Mendoza e outros', url: 'https://peps.python.org/pep-0646/', note: 'TypeVarTuple, usado para formas de arrays.' },
    { type: 'doc', title: 'PEP 673: Self Type', author: 'Pradeep Kumar Srinivasan, James Hilton-Balfe', url: 'https://peps.python.org/pep-0673/', note: 'Self para métodos fluentes e construtores.' },
    { type: 'doc', title: 'PEP 696: Type defaults for type parameters', author: 'James Hilton-Balfe', url: 'https://peps.python.org/pep-0696/', note: 'Defaults de TypeVar, Python 3.13.' },
    { type: 'doc', title: 'Generics (typing spec)', author: 'Python Typing Council', url: 'https://typing.python.org/en/latest/spec/generics.html', note: 'A referência normativa de variância, bound e constraints.' },
    { type: 'livro', title: 'Fluent Python, 2nd ed.', author: 'Luciano Ramalho', url: 'https://www.oreilly.com/library/view/fluent-python-2nd/9781492056348/', note: 'Capítulos de type hints e de generics clássicos, tradução brasileira pela Novatec.' },
    { type: 'doc', title: 'mypy: Generics', author: 'mypy', url: 'https://mypy.readthedocs.io/en/stable/generics.html', note: 'Exemplos com explicações de variância e self-types.' },
  ]
};

window.LESSON_CONTENT['pattern-matching'] = {
  id: 'pattern-matching',
  title: 'Enums e pattern matching',
  etapa: 3, etapaName: 'OOP & tipagem',
  time: '60 min',
  tags: ['Enum', 'match', 'PEP 634', 'exaustividade'],
  tagline: 'Valores fechados merecem <em>tipos fechados</em>, e o match estrutural faz o checker cobrar todos os casos.',
  intro: `<p>Strings mágicas ("pending", "PAID", "ok") são o inimigo silencioso de qualquer base. Um erro de digitação passa em revisão, passa em teste que não cobre o ramo, e quebra em produção. <code>Enum</code> dá nome e identidade a um conjunto fechado de valores, e o <code>match/case</code> (PEP 634, Python 3.10) deixa o código de decisão declarativo.</p>
<p>O <code>match</code> não é um <code>switch</code> de C. É <em>pattern matching estrutural</em>: casa a forma do dado (tupla, dicionário, objeto), extrai partes em variáveis e aceita guards. Combinado com <code>assert_never</code>, o type checker garante que você tratou todos os casos, e adicionar um membro novo ao Enum passa a quebrar o CI exatamente onde falta tratamento.</p>
<p>Isso é "parse, don't validate" e tipos algébricos de soma em versão pythônica. Aparece em máquinas de estado, protocolos, interpretadores e roteamento de eventos.</p>`,
  sections: [
    { id: 'enum', title: 'Enum, StrEnum, IntEnum e Flag', body: `
<p>Membros de Enum são singletons, comparam por identidade, são iteráveis e hashable. <code>StrEnum</code> (3.11) é um Enum cujos membros também são <code>str</code>, ideal para serialização; <code>IntEnum</code> para códigos numéricos; <code>Flag</code> para bitmasks combináveis.</p>
<pre><code class="language-python">from enum import Enum, StrEnum, IntEnum, Flag, auto

class Status(StrEnum):
    PENDENTE = auto()      # valor: "pendente" (minusculo do nome em StrEnum)
    PAGO = "pago"
    CANCELADO = "cancelado"

class Prioridade(IntEnum):
    BAIXA = 1
    ALTA = 3

class Perm(Flag):
    LER = auto()
    ESCREVER = auto()
    ADMIN = LER | ESCREVER

print(Status("pago"), Status.PAGO == "pago", Prioridade.ALTA &gt; Prioridade.BAIXA)
print(Perm.LER in Perm.ADMIN)          # True
print([s.name for s in Status])
try:
    Status("inexistente")
except ValueError as e:
    print(e)                           # 'inexistente' is not a valid Status</code></pre>
<p>Enums podem ter métodos e propriedades, o que concentra a regra junto ao valor (em vez de <code>if status == ...</code> espalhado):</p>
<pre><code class="language-python">class Estado(Enum):
    ABERTO = "aberto"
    FECHADO = "fechado"

    @property
    def terminal(self) -&gt; bool:
        return self is Estado.FECHADO

    def pode_ir_para(self, outro: "Estado") -&gt; bool:
        permitidas = {Estado.ABERTO: {Estado.FECHADO}, Estado.FECHADO: set()}
        return outro in permitidas[self]</code></pre>
<div class="callout warn"><strong>PEGADINHA</strong> <code>IntEnum</code> compara igual a inteiros (<code>Prioridade.ALTA == 3</code>), o que enfraquece o tipo e permite misturar códigos de domínios diferentes. Prefira <code>Enum</code> puro e converta na borda. Comparar enum com <code>is</code> é o idioma correto.</div>` },
    { id: 'match-basico', title: 'match: literais, OR, captura e wildcard', body: `
<p>Cada <code>case</code> é um <em>padrão</em>. Nomes soltos <strong>capturam</strong> (ligam o valor a uma variável), não comparam. Para comparar com constante, use literais ou nomes pontuados (<code>Status.PAGO</code>). O <code>_</code> é o curinga.</p>
<pre><code class="language-python">def comando(linha: str) -&gt; str:
    match linha.split():
        case ["sair"]:
            return "tchau"
        case ["ir", direcao]:
            return f"indo para {direcao}"
        case ["pegar", *itens] if itens:
            return f"pegou {', '.join(itens)}"
        case ["pegar"]:
            return "pegar o que?"
        case []:
            return "vazio"
        case [verbo, *_]:
            return f"nao sei {verbo}"

print(comando("ir norte"), "|", comando("pegar faca corda"))</code></pre>
<div class="callout warn"><strong>PEGADINHA</strong> A armadilha clássica: <code>case ERRO:</code> com <code>ERRO = 404</code> <em>captura</em> e sempre casa, não compara. Use <code>case HTTPStatus.NOT_FOUND:</code> (nome pontuado) ou <code>case 404:</code>. O Python avisa com SyntaxError quando um catch-all irrefutável aparece antes de outros cases, mas a captura silenciosa ainda engana quem vem de C.</div>
<p>Combine alternativas com <code>|</code> e capture a parte casada com <code>as</code>:</p>
<pre><code class="language-python">def tipo(codigo: int) -&gt; str:
    match codigo:
        case 200 | 201 | 204 as ok:
            return f"sucesso {ok}"
        case c if 400 &lt;= c &lt; 500:
            return "erro do cliente"
        case _:
            return "outro"</code></pre>` },
    { id: 'match-estrutural', title: 'Padrões estruturais: mapeamentos, sequências e classes', body: `
<p>O poder real está em casar estruturas. Padrões de mapping ignoram chaves extras; padrões de sequência casam por posição; padrões de classe casam por atributo (e por posição, se a classe define <code>__match_args__</code>, o que dataclasses fazem automaticamente).</p>
<pre><code class="language-python">from dataclasses import dataclass

@dataclass(frozen=True)
class Circulo:
    raio: float

@dataclass(frozen=True)
class Retangulo:
    largura: float
    altura: float

type Forma = Circulo | Retangulo

def area(f: Forma) -&gt; float:
    match f:
        case Circulo(raio=r):
            return 3.14159 * r * r
        case Retangulo(largura=l, altura=a):
            return l * a

def evento(e: dict) -&gt; str:
    match e:
        case {"tipo": "login", "usuario": {"nome": nome}}:
            return f"login de {nome}"
        case {"tipo": "erro", "codigo": int(c)} if c &gt;= 500:
            return f"erro grave {c}"
        case {"tipo": t}:
            return f"evento {t}"
        case _:
            return "desconhecido"

print(area(Circulo(2)), evento({"tipo": "login", "usuario": {"nome": "ana"}, "x": 1}))</code></pre>
<p>Padrões de classe fazem checagem de tipo (<code>isinstance</code>) e extraem atributos numa expressão só. Isso substitui cadeias de <code>if isinstance(...)</code> com acessos, e é a forma pythônica de trabalhar com árvores sintáticas e mensagens de protocolo.</p>` },
    { id: 'exaustividade', title: 'Exaustividade com assert_never', body: `
<p>O type checker conhece os membros de um Enum, de um Literal e de uma união. Se o <code>match</code> cobre todos, o ramo final tem tipo <code>Never</code>. Colocar <code>assert_never</code> no <code>case _</code> faz o checker acusar erro assim que surgir um caso não tratado, e protege também em runtime.</p>
<pre><code class="language-python">from enum import Enum
from typing import assert_never

class Metodo(Enum):
    PIX = "pix"
    BOLETO = "boleto"
    CARTAO = "cartao"

def taxa(m: Metodo) -&gt; float:
    match m:
        case Metodo.PIX:
            return 0.0
        case Metodo.BOLETO:
            return 3.5
        case Metodo.CARTAO:
            return 0.029
        case _ as nunca:
            assert_never(nunca)   # se adicionar Metodo.DEBITO, o mypy/pyright quebra aqui</code></pre>
<p>O mesmo vale para uniões de dataclasses (a <code>Forma</code> acima), que é a versão pythônica de um sum type. Isso é um dos maiores ganhos de segurança em refactors: o checker lista cada lugar a ajustar quando o domínio ganha uma variante.</p>
<div class="callout"><strong>NA ENTREVISTA</strong> "Como garantir que todos os casos de um enum são tratados?" <code>match</code> com <code>assert_never</code> no curinga e checagem estática no CI. Alternativa sem checker: um dict mapeando cada membro e um teste que verifica que as chaves igualam <code>set(Metodo)</code>.</div>` },
    { id: 'alternativas', title: 'Alternativas pythônicas e quando match é demais', body: `
<p>Nem todo despacho precisa de <code>match</code>. Um dicionário de callables é mais curto, mais fácil de estender e de testar quando cada ramo é só "chame isto".</p>
<pre><code class="language-python">from collections.abc import Callable

def _pix(v: float) -&gt; float: return 0.0
def _boleto(v: float) -&gt; float: return 3.5
def _cartao(v: float) -&gt; float: return v * 0.029

TAXAS: dict[Metodo, Callable[[float], float]] = {
    Metodo.PIX: _pix,
    Metodo.BOLETO: _boleto,
    Metodo.CARTAO: _cartao,
}
assert set(TAXAS) == set(Metodo)         # garante exaustividade em teste

def calcula(m: Metodo, v: float) -&gt; float:
    return TAXAS[m](v)</code></pre>
<p>Guia: use <code>match</code> quando o ramo depende da <em>estrutura</em> do dado ou extrai partes; use dict de funções quando é apenas chave para ação; use polimorfismo (método na classe) quando o conjunto de variantes é aberto e o comportamento pertence ao tipo. Em execução, <code>match</code> compila para comparações sequenciais, sem tabela de salto garantida: não o escolha por desempenho, e meça se for caminho quente.</p>
<p>Em Python 3.14, o <code>match</code> segue com a mesma semântica; o que mudou ao redor foi o suporte do checker a exaustividade e as anotações adiadas (PEP 649).</p>` },
    { id: 'enum-producao', title: 'Enums em produção: serialização e evolução', body: `
<p>Enums atravessam fronteiras: banco, JSON, filas, logs. Duas decisões evitam dor. Primeira: o <em>valor</em> persistido é contrato, o <em>nome</em> do membro pode mudar. Nunca persista <code>auto()</code> em inteiros (reordenar os membros muda os valores); use valores explícitos. Segunda: decida o que acontece com um valor desconhecido (versão nova do produtor, dado antigo). Levantar erro é o padrão correto; <code>_missing_</code> permite um fallback explícito quando o negócio aceita.</p>
<pre><code class="language-python">from enum import StrEnum
from pydantic import BaseModel

class Canal(StrEnum):
    EMAIL = "email"
    SMS = "sms"
    DESCONHECIDO = "desconhecido"

    @classmethod
    def _missing_(cls, value: object):
        return cls.DESCONHECIDO        # fallback explicito para valores novos

class Mensagem(BaseModel):
    canal: Canal

print(Mensagem.model_validate({"canal": "push"}).canal)   # Canal.DESCONHECIDO
print(Mensagem(canal=Canal.SMS).model_dump_json())        # {"canal":"sms"}</code></pre>
<p>Para mudanças de domínio, adicionar membro é compatível para quem produz e arriscado para quem consome (por isso a exaustividade checada). Remover ou renomear valor persistido exige migração de dados. Em Postgres, um <code>ENUM</code> nativo é difícil de alterar; muitos times preferem <code>TEXT</code> com <code>CHECK</code> e o Enum só no código.</p>
<div class="callout tip"><strong>DICA</strong> Teste a ida e a volta: <code>assert all(Canal(c.value) is c for c in Canal)</code>, e um teste que congela o conjunto de valores persistidos para que mudanças acidentais apareçam em revisão.</div>` },
  ],
  whenToUse: [
    'Conjuntos fechados de valores (estado, método de pagamento, nível de log): Enum.',
    'Despacho que depende da forma do dado: tuplas, dicts aninhados, mensagens de protocolo.',
    'Uniões de dataclasses (sum types) tratadas com match e assert_never.',
    'StrEnum para valores que atravessam fronteiras (JSON, banco, headers).',
    'Parsers e interpretadores pequenos, onde padrões substituem cadeias de if.',
  ],
  whenNot: [
    'match como switch de constantes simples: dict ou if/elif é mais claro.',
    'case com nome solto esperando comparação: ele captura e sempre casa.',
    'IntEnum para domínio que não é numérico: mistura códigos e enfraquece o tipo.',
    'match para escolher implementação em conjunto aberto: use polimorfismo ou registro.',
    'Escolher match por desempenho sem medir.',
  ],
  metrics: [
    'mypy --strict e pyright reportMatchNotExhaustive para exaustividade',
    'assert_never no ramo final e teste que compara chaves com set(Enum)',
    'ruff regras SIM (simplificações) e RUF para enums e padrões duplicados',
    'cobertura por ramo (pytest-cov --cov-branch) nos cases',
    'timeit para comparar match vs dict de funções em caminhos quentes',
  ],
  refs: [
    { type: 'doc', title: 'PEP 636: Structural Pattern Matching, Tutorial', author: 'Daniel F Moisset', url: 'https://peps.python.org/pep-0636/', note: 'O tutorial oficial, o melhor ponto de entrada.' },
    { type: 'doc', title: 'PEP 634: Structural Pattern Matching, Specification', author: 'Brandt Bucher, Guido van Rossum', url: 'https://peps.python.org/pep-0634/', note: 'A especificação completa dos padrões.' },
    { type: 'doc', title: 'PEP 635: Structural Pattern Matching, Motivation and Rationale', author: 'Tobias Kohn, Guido van Rossum', url: 'https://peps.python.org/pep-0635/', note: 'Por que a captura é por nome solto e o que foi rejeitado.' },
    { type: 'doc', title: 'enum, Support for enumerations', author: 'Python Software Foundation', url: 'https://docs.python.org/3/library/enum.html', note: 'Enum, StrEnum, Flag, auto e HOWTO.' },
    { type: 'doc', title: 'Exhaustiveness checking (typing docs)', author: 'Python Typing Council', url: 'https://typing.python.org/en/latest/guides/unreachable.html', note: 'assert_never e Never, com exemplos.' },
    { type: 'livro', title: 'Fluent Python, 2nd ed.', author: 'Luciano Ramalho', url: 'https://www.oreilly.com/library/view/fluent-python-2nd/9781492056348/', note: 'Capítulo sobre pattern matching, tradução brasileira pela Novatec.' },
    { type: 'doc', title: 'Parse, don\'t validate', author: 'Alexis King', url: 'https://lexi-lambda.github.io/blog/2019/11/05/parse-don-t-validate/', note: 'A ideia por trás de tipos que tornam estados inválidos irrepresentáveis.' },
  ]
};

window.LESSON_CONTENT['clean-naming'] = {
  id: 'clean-naming',
  title: 'Nomes e funções limpas',
  etapa: 4, etapaName: 'Clean Code',
  time: '60 min',
  tags: ['Clean Code', 'PEP 8', 'PEP 20', 'funções'],
  tagline: 'Código é lido dez vezes mais do que escrito, então <em>nomes e forma</em> são o principal recurso de manutenção.',
  intro: `<p>Clean Code (Robert C. Martin, 2008) popularizou a ideia de que legibilidade é uma propriedade de engenharia, não de estilo. O livro está cheio de heurísticas boas (nomes que revelam intenção, funções que fazem uma coisa, sem comentário que repete o código) e de algumas discutíveis (funções de três linhas a qualquer custo, exemplos em Java com mutação). Esta lição pega o que sobrevive em Python e diz honestamente onde a comunidade discorda.</p>
<p>Python tem vantagens: indentação obriga estrutura, o PEP 8 padroniza forma e o PEP 20 (Zen of Python) dá os valores: "Readability counts", "Explicit is better than implicit", "Flat is better than nested", "Simple is better than complex". O que falta é disciplina de nomes e de tamanho de funções, que nenhuma ferramenta substitui por completo.</p>
<p>Em entrevista sênior você será julgado por exatamente isto: o código que escreve no quadro e como você critica o código dos outros em revisão. O padrão aqui é sempre antes e depois.</p>`,
  sections: [
    { id: 'nomes-revelam', title: 'Nomes que revelam intenção', body: `
<p>Regra central de Clean Code: o nome responde por que existe, o que faz e como é usado. Se precisa de comentário para explicar o nome, o nome falhou. Em Python, soma-se a convenção do PEP 8: <code>snake_case</code> para funções, variáveis e módulos; <code>PascalCase</code> para classes; <code>UPPER_SNAKE</code> para constantes; prefixo <code>_</code> para uso interno.</p>
<p><strong>Antes:</strong></p>
<pre><code class="language-python">def calc(d, t):
    r = []
    for x in d:
        if x[2] &gt; t and x[3] != 0:
            r.append(x[0] * x[1])
    return sum(r)</code></pre>
<p><strong>Depois:</strong></p>
<pre><code class="language-python">from dataclasses import dataclass

@dataclass(frozen=True)
class ItemPedido:
    preco_unitario: float
    quantidade: int
    estoque_minimo: int
    ativo: bool

def total_dos_itens_elegiveis(itens: list[ItemPedido], estoque_limite: int) -&gt; float:
    return sum(
        i.preco_unitario * i.quantidade
        for i in itens
        if i.estoque_minimo &gt; estoque_limite and i.ativo
    )</code></pre>
<p>Ganhos: o tipo substitui os índices mágicos (<code>x[2]</code>), o nome da função diz o que retorna, e a expressão geradora tira a lista temporária. Note que o ganho veio de <em>modelar</em> o dado, não só de renomear.</p>
<ul>
<li><strong>Evite desinformação</strong>: <code>lista_de_contas</code> que é um dict mente. <code>contas_por_id</code> diz a forma.</li>
<li><strong>Distinções significativas</strong>: <code>dados</code>, <code>info</code>, <code>obj</code>, <code>manager</code>, <code>util</code> não distinguem nada.</li>
<li><strong>Nomes pronunciáveis e pesquisáveis</strong>: <code>MAX_TENTATIVAS</code> em vez de <code>3</code> espalhado; <code>i</code> só em laços de três linhas.</li>
<li><strong>Booleanos como pergunta</strong>: <code>is_valid</code>, <code>has_permission</code>, <code>pode_cancelar</code>.</li>
<li><strong>Verbos para funções, substantivos para classes</strong>; um verbo por conceito (não misture <code>fetch</code>, <code>get</code>, <code>retrieve</code> sem diferença real).</li>
</ul>
<div class="callout warn"><strong>PEGADINHA</strong> Não sombreie built-ins (<code>list</code>, <code>id</code>, <code>type</code>, <code>input</code>, <code>filter</code>). Use <code>lista_ids</code> ou <code>tipo_</code>. O ruff acusa com a regra A001/A002.</div>` },
    { id: 'pep8-pep20', title: 'PEP 8 e PEP 20: forma e valores', body: `
<p>O PEP 8 é o guia de estilo; o PEP 20 são aforismos de design. Ferramentas (ruff, black) resolvem a forma, então sua atenção vai para o que elas não resolvem: nome e estrutura. Pontos que mais importam no PEP 8:</p>
<ul>
<li><strong>Comprimento de linha</strong>: 79 no PEP 8 (72 para comentários); a maioria dos projetos moderna usa 88 (black) ou 100. O importante é um número só, imposto pela ferramenta.</li>
<li><strong>Imports</strong> no topo, agrupados (stdlib, terceiros, locais), um por linha; evite <code>import *</code>.</li>
<li><strong>Comparações</strong>: <code>is None</code>, não <code>== None</code>; <code>if lista:</code>, não <code>if len(lista) &gt; 0:</code>.</li>
<li><strong>Exceções</strong>: <code>except</code> específico; nunca <code>except:</code> pelado.</li>
<li><strong>Docstrings</strong> (PEP 257) para módulos, classes e funções públicas.</li>
<li>O próprio PEP 8 diz: "A foolish consistency is the hobgoblin of little minds". Quebre a regra quando ela prejudicar a leitura, mas sabendo por quê.</li>
</ul>
<p>Os aforismos do Zen mais úteis em revisão de código:</p>
<table><thead><tr><th>Aforismo (PEP 20)</th><th>Na prática</th></tr></thead><tbody>
<tr><td>Explicit is better than implicit</td><td>Parâmetro nomeado a <code>True</code> posicional; sem magia de import</td></tr>
<tr><td>Flat is better than nested</td><td>Guard clauses e retorno antecipado em vez de ifs aninhados</td></tr>
<tr><td>Readability counts</td><td>Prefira o código óbvio ao esperto</td></tr>
<tr><td>Errors should never pass silently</td><td>Sem <code>except: pass</code>; logue ou propague</td></tr>
<tr><td>In the face of ambiguity, refuse the temptation to guess</td><td>Valide entradas, não adivinhe formatos</td></tr>
<tr><td>If the implementation is hard to explain, it's a bad idea</td><td>Sinal para simplificar o desenho</td></tr>
</tbody></table>
<pre><code class="language-python">import this   # imprime o Zen of Python (PEP 20)</code></pre>` },
    { id: 'funcoes-pequenas', title: 'Funções: uma coisa, um nível de abstração', body: `
<p>Martin pede funções que "fazem uma coisa, fazem bem e só isso", com um único nível de abstração e poucos argumentos (zero ideal, até três razoável). A leitura deve ser de cima para baixo, como uma narrativa: a função de alto nível chama funções de nível imediatamente abaixo.</p>
<p><strong>Antes:</strong></p>
<pre><code class="language-python">def processar_pedido(pedido):
    if pedido is not None:
        if pedido["itens"]:
            total = 0
            for item in pedido["itens"]:
                if item["qtd"] &gt; 0:
                    total += item["preco"] * item["qtd"]
            if pedido["cliente"]["vip"]:
                total = total * 0.9
            if total &gt; 1000:
                print("enviando email de aviso a", pedido["cliente"]["email"])
            salvar_no_banco(pedido, total)
            return total
    return 0</code></pre>
<p><strong>Depois</strong> (guard clauses, funções por nível de abstração, efeito colateral isolado):</p>
<pre><code class="language-python">LIMITE_AVISO = 1000
DESCONTO_VIP = 0.9

def subtotal(itens: list[dict]) -&gt; float:
    return sum(i["preco"] * i["qtd"] for i in itens if i["qtd"] &gt; 0)

def aplicar_desconto(valor: float, cliente: dict) -&gt; float:
    return valor * DESCONTO_VIP if cliente["vip"] else valor

def processar_pedido(pedido: dict | None, notificar, repositorio) -&gt; float:
    if not pedido or not pedido["itens"]:
        return 0.0
    total = aplicar_desconto(subtotal(pedido["itens"]), pedido["cliente"])
    if total &gt; LIMITE_AVISO:
        notificar(pedido["cliente"]["email"], total)
    repositorio.salvar(pedido, total)
    return total</code></pre>
<p>O que mudou: 4 níveis de aninhamento viraram 1; os números mágicos têm nome; o <code>print</code> (efeito colateral) virou uma dependência injetada, o que torna a função testável sem capturar stdout; as regras de cálculo viraram funções puras.</p>
<div class="callout"><strong>NA ENTREVISTA</strong> Peça para refatorar uma função grande: o roteiro é (1) escrever testes de caracterização, (2) guard clauses, (3) extrair funções puras de cálculo, (4) isolar efeitos colaterais na borda, (5) rodar os testes a cada passo.</div>` },
    { id: 'argumentos-efeitos', title: 'Argumentos, efeitos colaterais e command-query', body: `
<p>Muitos argumentos são um smell. Em Python você tem alternativas melhores que "agrupar em lista": parâmetros apenas nomeados (<code>*</code>), dataclass de parâmetros, e defaults.</p>
<p><strong>Antes:</strong></p>
<pre><code class="language-python">def criar_usuario(nome, email, idade, ativo, admin, notificar, tema, idioma):
    ...

criar_usuario("ana", "a@b.com", 30, True, False, True, "dark", "pt")</code></pre>
<p><strong>Depois:</strong></p>
<pre><code class="language-python">from dataclasses import dataclass

@dataclass(frozen=True, kw_only=True)
class Preferencias:
    tema: str = "light"
    idioma: str = "pt"
    notificar: bool = True

def criar_usuario(nome: str, email: str, *, idade: int, admin: bool = False,
                  preferencias: Preferencias = Preferencias()) -&gt; "Usuario":
    ...

criar_usuario("ana", "a@b.com", idade=30, preferencias=Preferencias(tema="dark"))</code></pre>
<p>Dois princípios que Martin ensina e que valem integralmente em Python:</p>
<ul>
<li><strong>Command-Query Separation</strong> (Bertrand Meyer): ou a função muda estado e devolve nada, ou devolve um valor sem alterar nada. <code>list.pop()</code> viola e é aceito pela conveniência, mas em código de domínio a separação evita surpresa.</li>
<li><strong>Sem efeitos colaterais ocultos</strong>: uma função chamada <code>validar_senha</code> que também inicia a sessão mente. Efeitos ficam visíveis no nome ou ficam na borda.</li>
</ul>
<pre><code class="language-python"># mutacao oculta do argumento: o chamador nao espera
def normalizar(nomes: list[str]) -&gt; None:
    nomes[:] = [n.strip().title() for n in nomes]

# melhor: devolve novo valor, sem mutar o de fora
def normalizados(nomes: list[str]) -&gt; list[str]:
    return [n.strip().title() for n in nomes]</code></pre>
<div class="callout warn"><strong>PEGADINHA</strong> Flag booleano em argumento (<code>salvar(obj, True)</code>) quase sempre indica que a função faz duas coisas. Divida em duas funções, ou use um <code>Enum</code> nomeado. E <code>def f(x=[])</code> é bug clássico: o default é avaliado uma vez.</div>` },
    { id: 'comentarios', title: 'Comentários, docstrings e o que Python muda', body: `
<p>Para Martin, comentário é, em geral, um pedido de desculpas por código ruim. A versão equilibrada: comente o <em>porquê</em> (decisão não óbvia, restrição externa, link para o ticket ou o RFC), não o <em>o quê</em>. Docstring de API pública é outro assunto, é documentação, e ferramentas a consomem (help, Sphinx, IDEs).</p>
<p><strong>Antes:</strong></p>
<pre><code class="language-python"># incrementa i
i += 1

# verifica se o usuario eh maior de idade
if u.i &gt;= 18:  # 18 anos
    ...</code></pre>
<p><strong>Depois:</strong></p>
<pre><code class="language-python">MAIORIDADE_CIVIL = 18

def e_maior_de_idade(usuario: "Usuario") -&gt; bool:
    return usuario.idade &gt;= MAIORIDADE_CIVIL

# Dedup antes do join: o endpoint de cobranca eh idempotente apenas por
# (cliente, competencia); duplicatas geram cobranca em dobro (ver INC-2041).
cobrancas = list(dict.fromkeys(cobrancas))</code></pre>
<p>Tipos e docstrings: com type hints, o formato da assinatura já está na assinatura; a docstring descreve contrato, efeitos, exceções e exemplos.</p>
<pre><code class="language-python">def dividir(a: float, b: float) -&gt; float:
    """Divide a por b.

    Raises:
        ZeroDivisionError: se b for zero.

    Examples:
        &gt;&gt;&gt; dividir(6, 3)
        2.0
    """
    return a / b</code></pre>
<p>Doctests como o acima rodam com <code>python -m doctest</code> ou <code>pytest --doctest-modules</code>, então documentação e código não divergem. Comentários de TODO precisam de dono e ticket; código comentado (desligado) é lixo: o git guarda o histórico.</p>` },
    { id: 'discordancias', title: 'O que a comunidade Python discorda do Clean Code', body: `
<p>Clean Code é de 2008, escrito para Java, e algumas receitas envelheceram ou não traduzem para Python. Vale conhecer as críticas para opinar com embasamento em vez de repetir dogma.</p>
<ul>
<li><strong>Funções minúsculas demais</strong>: a recomendação de funções de 2 a 5 linhas fragmenta a lógica em dezenas de funções que o leitor precisa saltar. John Ousterhout, em <em>A Philosophy of Software Design</em>, defende módulos <em>profundos</em> (interface simples, implementação rica) e critica a fragmentação excessiva. O critério útil é coesão e nível de abstração, não contagem de linhas.</li>
<li><strong>Estilo de comentários</strong>: "comentário é fracasso" é radical; Ousterhout, e a prática de bibliotecas Python maduras, valorizam docstrings e comentários de intenção.</li>
<li><strong>Classes para tudo</strong>: o livro vem de um mundo de objetos. Em Python, módulos e funções são cidadãos de primeira classe; uma classe com um método e sem estado é uma função (Jack Diederich, "Stop Writing Classes").</li>
<li><strong>Exemplos questionáveis</strong>: críticas conhecidas, como o post "It's probably time to stop recommending Clean Code" (qntm, 2020), mostram refatorações do livro que pioram clareza ou desempenho. Leia como coleção de heurísticas, não como lei.</li>
<li><strong>Tratamento de erros</strong>: o livro prefere exceções a códigos de retorno (concorda com Python), mas o idioma EAFP (lição 20) é mais pythônico que as verificações prévias que o livro ilustra.</li>
</ul>
<p>Fowler (<em>Refactoring</em>, 2ª ed., 2018) é mais pragmático: extrair função quando o <em>propósito</em> do trecho é diferente do <em>como</em>, e inline function quando o corpo é tão claro quanto o nome. Ele também escreve explicitamente que o tamanho não é critério.</p>
<div class="callout tip"><strong>DICA</strong> Teste prático de nome e tamanho: leia só as assinaturas e os nomes das funções do módulo; se contarem a história sem abrir o corpo, está bom. Se o leitor precisa abrir cinco funções de uma linha para entender uma regra, você fragmentou demais.</div>` },
  ],
  whenToUse: [
    'Em toda revisão de código: nome, tamanho, aninhamento e efeitos colaterais.',
    'Guard clauses e retorno antecipado para achatar condicionais aninhadas.',
    'Parâmetros nomeados e dataclasses quando a assinatura passa de três argumentos.',
    'Funções puras para regra de negócio e efeitos isolados na borda.',
    'Comentários de porquê e docstrings de API; ferramentas (ruff, black) para a forma.',
  ],
  whenNot: [
    'Extrair função só para atingir "5 linhas": isso fragmenta e piora a leitura.',
    'Renomear em massa sem testes ou sem ferramenta de refactor (rope, IDE).',
    'Impor Clean Code como dogma ao time: use como heurística, discuta em revisão.',
    'Criar classes para o que é função e dicionário.',
    'Comentar o que o código diz ou deixar código morto comentado.',
  ],
  metrics: [
    'ruff check (E, F, N de pep8-naming, A de builtins, D de docstrings)',
    'black ou ruff format para a forma; pre-commit para impor',
    'radon cc e flake8 --max-complexity para complexidade ciclomática',
    'pytest --doctest-modules para manter exemplos de docstring verdadeiros',
    'Tamanho de função e profundidade de aninhamento como sinais, não metas',
  ],
  refs: [
    { type: 'livro', title: 'Clean Code (Código Limpo, Alta Books)', author: 'Robert C. Martin', url: 'https://www.oreilly.com/library/view/clean-code-a/9780136083238/', note: 'O texto que popularizou o tema; leia com o senso crítico desta lição.' },
    { type: 'livro', title: 'Refactoring, 2nd ed.', author: 'Martin Fowler', url: 'https://martinfowler.com/books/refactoring.html', note: 'Catálogo de refactorings e smells, mais pragmático sobre tamanho.' },
    { type: 'doc', title: 'PEP 8: Style Guide for Python Code', author: 'Guido van Rossum, Barry Warsaw, Alyssa Coghlan', url: 'https://peps.python.org/pep-0008/', note: 'Estilo oficial, incluindo a seção de consistência tola.' },
    { type: 'doc', title: 'PEP 20: The Zen of Python', author: 'Tim Peters', url: 'https://peps.python.org/pep-0020/', note: 'Os 19 aforismos que guiam decisões de design.' },
    { type: 'doc', title: 'PEP 257: Docstring Conventions', author: 'David Goodger, Guido van Rossum', url: 'https://peps.python.org/pep-0257/', note: 'Convenções de docstring.' },
    { type: 'livro', title: 'A Philosophy of Software Design', author: 'John Ousterhout', url: 'https://web.stanford.edu/~ouster/cgi-bin/book.php', note: 'O contraponto sobre módulos profundos e funções minúsculas.' },
    { type: 'livro', title: 'Effective Python, 3rd ed.', author: 'Brett Slatkin', url: 'https://effectivepython.com/', note: 'Itens práticos de estilo e design em Python moderno.' },
    { type: 'artigo', title: 'It\'s probably time to stop recommending Clean Code', author: 'qntm', url: 'https://qntm.org/clean', note: 'A crítica mais citada às receitas do livro.' },
    { type: 'video', title: 'Stop Writing Classes', author: 'Jack Diederich (PyCon 2012)', url: 'https://www.youtube.com/watch?v=o9pEzgHorH0', note: 'Quando uma classe é só uma função com cerimônia.' },
  ]
};

window.LESSON_CONTENT['clean-errors'] = {
  id: 'clean-errors',
  title: 'Erros e exceções',
  etapa: 4, etapaName: 'Clean Code',
  time: '60 min',
  tags: ['exceções', 'EAFP', 'ExceptionGroup', 'fail fast'],
  tagline: 'Erro tratado com clareza é <em>parte do contrato</em>, não um desvio escondido no meio do fluxo.',
  intro: `<p>Em sistemas reais, o caminho infeliz é metade do código. Um bom tratamento de erro faz três coisas: falha cedo (perto da causa), carrega contexto suficiente para diagnosticar, e não engole nada em silêncio. O mau tratamento é o <code>except Exception: pass</code>, a mensagem "erro" sem contexto, e a exceção de domínio que vaza detalhes do banco.</p>
<p>Clean Code dedica um capítulo a isso: use exceções em vez de códigos de retorno, escreva o <code>try</code> primeiro, forneça contexto, não retorne <code>None</code> e não passe <code>None</code>. Python concorda no essencial e diverge num ponto cultural: o idioma EAFP ("easier to ask forgiveness than permission") prefere tentar e tratar a verificar antes (LBYL).</p>
<p>Aqui você vê hierarquias de exceção, <code>raise from</code>, <code>ExceptionGroup</code> e <code>except*</code> (PEP 654, 3.11), notas de exceção (3.11) e os erros de produção mais comuns. Em entrevista sênior, perguntas sobre isso medem maturidade melhor do que quase qualquer outra.</p>`,
  sections: [
    { id: 'eafp-lbyl', title: 'EAFP vs LBYL', body: `
<p>LBYL (look before you leap) verifica pré-condições; EAFP tenta e trata. Em Python, EAFP costuma ser mais correto porque evita condições de corrida (entre a verificação e o uso o estado muda) e mais rápido no caminho feliz.</p>
<p><strong>Antes</strong> (LBYL, com corrida de TOCTOU):</p>
<pre><code class="language-python">import os

def ler_config(caminho: str) -&gt; str | None:
    if os.path.exists(caminho) and os.access(caminho, os.R_OK):
        with open(caminho) as f:         # o arquivo pode sumir entre o if e o open
            return f.read()
    return None</code></pre>
<p><strong>Depois</strong> (EAFP, com exceção específica):</p>
<pre><code class="language-python">def ler_config(caminho: str) -&gt; str:
    try:
        with open(caminho, encoding="utf-8") as f:
            return f.read()
    except FileNotFoundError as e:
        raise ConfigAusente(caminho) from e

class ConfigAusente(Exception):
    def __init__(self, caminho: str) -&gt; None:
        super().__init__(f"config nao encontrada: {caminho}")
        self.caminho = caminho</code></pre>
<p>Quando LBYL é adequado: a verificação é barata e sem corrida (<code>if x is None</code>), ou o erro é esperado e frequente (um dict com chave ausente em loop: <code>d.get(k)</code> ou <code>collections.defaultdict</code> são mais claros). Regra: se a falha é <em>excepcional</em>, use exceção; se é um ramo normal do negócio, modele como valor (None explícito, <code>Result</code> próprio, ou enum).</p>
<div class="callout warn"><strong>PEGADINHA</strong> Mantenha o bloco <code>try</code> mínimo. Colocar dez linhas no <code>try</code> faz o <code>except</code> capturar um <code>KeyError</code> que veio de outro lugar e esconder um bug. Use o <code>else</code> do try para o código que só roda se não houve exceção.</div>` },
    { id: 'hierarquia', title: 'Hierarquia de exceções de domínio', body: `
<p>Defina uma exceção base por pacote ou biblioteca, e derive exceções específicas. Quem chama pode capturar tudo da sua biblioteca com um <code>except</code> só, ou ser seletivo. Herde de <code>Exception</code>, nunca de <code>BaseException</code> (que inclui <code>KeyboardInterrupt</code> e <code>SystemExit</code>).</p>
<pre><code class="language-python">class PagamentoError(Exception):
    """Base de todos os erros do modulo de pagamento."""

class SaldoInsuficiente(PagamentoError):
    def __init__(self, saldo: int, pedido: int) -&gt; None:
        super().__init__(f"saldo {saldo} menor que o pedido {pedido}")
        self.saldo, self.pedido = saldo, pedido

class GatewayIndisponivel(PagamentoError):
    """Falha transitoria: o chamador pode tentar de novo."""

def cobrar(saldo: int, valor: int) -&gt; int:
    if valor &gt; saldo:
        raise SaldoInsuficiente(saldo, valor)
    return saldo - valor

try:
    cobrar(10, 50)
except SaldoInsuficiente as e:
    print("faltam", e.pedido - e.saldo)
except PagamentoError:
    print("outro erro de pagamento")</code></pre>
<p>Princípios: a exceção carrega <em>dados</em> (atributos), não só texto; o nome descreve o problema (<code>SaldoInsuficiente</code>), não a camada (<code>DatabaseError</code> vazando para a API); e o tipo permite decidir a política (retry para transitório, falha imediata para permanente). Reaproveite as built-in quando o sentido bate (<code>ValueError</code>, <code>TypeError</code>, <code>KeyError</code>, <code>PermissionError</code>, <code>TimeoutError</code>).</p>` },
    { id: 'encadeamento', title: 'raise from, contexto e notas', body: `
<p>Ao traduzir uma exceção de baixo nível em uma de domínio, use <code>raise ... from e</code>: o <code>__cause__</code> preserva a causa e o traceback mostra "The above exception was the direct cause...". Sem o <code>from</code>, o Python ainda encadeia implicitamente (<code>__context__</code>) com a frase "During handling of the above exception, another exception occurred", que sugere um bug no handler. Use <code>raise ... from None</code> só quando a causa é ruído e você quer escondê-la de propósito.</p>
<pre><code class="language-python">import json

class PayloadInvalido(ValueError): ...

def parse(raw: str) -&gt; dict:
    try:
        return json.loads(raw)
    except json.JSONDecodeError as e:
        raise PayloadInvalido("JSON invalido na linha de entrada") from e

try:
    parse("{x")
except PayloadInvalido as e:
    print(type(e.__cause__).__name__)   # JSONDecodeError</code></pre>
<p>Desde o 3.11, <code>add_note</code> anexa contexto a uma exceção sem trocar seu tipo, útil em loops e camadas intermediárias:</p>
<pre><code class="language-python">def processar_todos(linhas: list[str]) -&gt; None:
    for n, linha in enumerate(linhas, start=1):
        try:
            int(linha)
        except ValueError as e:
            e.add_note(f"linha {n}: {linha!r}")
            raise</code></pre>
<p>Para re-lançar, use <code>raise</code> sem argumento (preserva o traceback original); <code>raise e</code> acrescenta uma entrada de traceback desnecessária. Em logging, <code>logger.exception("msg")</code> dentro do <code>except</code> inclui o traceback; <code>logger.error(str(e))</code> perde.</p>` },
    { id: 'exception-group', title: 'ExceptionGroup e except* (PEP 654)', body: `
<p>Com concorrência (<code>asyncio.TaskGroup</code>, 3.11), várias tarefas podem falhar ao mesmo tempo. <code>ExceptionGroup</code> agrupa exceções, e <code>except*</code> trata subconjuntos por tipo. Cada cláusula <code>except*</code> recebe um grupo com as exceções que casam; o que sobra é re-lançado.</p>
<pre><code class="language-python">import asyncio

async def a() -&gt; None:
    raise ValueError("a falhou")

async def b() -&gt; None:
    raise TimeoutError("b demorou")

async def main() -&gt; None:
    try:
        async with asyncio.TaskGroup() as tg:
            tg.create_task(a())
            tg.create_task(b())
    except* ValueError as eg:
        print("valores:", [str(e) for e in eg.exceptions])
    except* TimeoutError as eg:
        print("timeouts:", len(eg.exceptions))

asyncio.run(main())</code></pre>
<p>Também serve para validação que acumula vários erros em vez de parar no primeiro (formulários, importação de arquivos):</p>
<pre><code class="language-python">def validar(reg: dict) -&gt; None:
    erros: list[Exception] = []
    if not reg.get("nome"):
        erros.append(ValueError("nome obrigatorio"))
    if reg.get("idade", 0) &lt; 0:
        erros.append(ValueError("idade negativa"))
    if erros:
        raise ExceptionGroup("registro invalido", erros)</code></pre>
<div class="callout warn"><strong>PEGADINHA</strong> Não misture <code>except</code> e <code>except*</code> no mesmo <code>try</code>, e <code>except*</code> não aceita <code>return</code>, <code>break</code> nem <code>continue</code>. Uma tarefa cancelada gera <code>CancelledError</code>, que não deve ser engolido (ele é <code>BaseException</code> desde o 3.8).</div>` },
    { id: 'falhar-cedo', title: 'Falhar cedo, não engolir e não retornar None', body: `
<p>Falhar cedo (fail fast) significa validar na entrada e lançar perto da causa; assim o stack trace aponta o culpado, não o sintoma a dez chamadas de distância. As três más práticas que Clean Code condena, e o que fazer em Python:</p>
<p><strong>Antes:</strong></p>
<pre><code class="language-python">def buscar_usuario(id):
    try:
        r = db.query(f"select * from usuarios where id = {id}")   # tambem: SQL injection
        return r[0]
    except Exception:
        return None                                              # engole tudo

u = buscar_usuario(7)
print(u["nome"])    # TypeError distante da causa real</code></pre>
<p><strong>Depois:</strong></p>
<pre><code class="language-python">class UsuarioNaoEncontrado(LookupError):
    def __init__(self, id: int) -&gt; None:
        super().__init__(f"usuario {id} nao existe")
        self.id = id

def buscar_usuario(db, id: int) -&gt; dict:
    linhas = db.execute("select * from usuarios where id = %s", (id,)).fetchall()
    if not linhas:
        raise UsuarioNaoEncontrado(id)
    return linhas[0]</code></pre>
<ul>
<li><strong>Nunca <code>except Exception: pass</code></strong>. Se precisa mesmo ignorar, seja específico e use <code>contextlib.suppress(FileNotFoundError)</code>, que documenta a intenção.</li>
<li><strong>Não retorne None para sinalizar erro</strong> quando a ausência não é um valor legítimo; devolva um objeto vazio (lista vazia) ou levante. Se ausência é normal, tipe <code>X | None</code> e deixe o checker forçar o tratamento.</li>
<li><strong>Valide invariantes com <code>raise</code>, não <code>assert</code></strong> em código de produção: <code>assert</code> some com <code>python -O</code>. Use assert para o que "não pode acontecer" por bug do programador.</li>
<li><strong>Capture na fronteira</strong>: um handler global (middleware, <code>main()</code>) loga e traduz; camadas internas só propagam ou traduzem para tipo de domínio.</li>
</ul>` },
    { id: 'retry-producao', title: 'Erros em produção: transitórios, retry e idempotência', body: `
<p>Erros transitórios (timeout, 503, deadlock) merecem retry com <em>backoff exponencial e jitter</em>; erros permanentes (validação, 4xx) não. O retry só é seguro se a operação for idempotente, ou protegida por uma chave de idempotência. A biblioteca <code>tenacity</code> cobre o caso de uso; abaixo, a mecânica explícita.</p>
<pre><code class="language-python">import random, time

class Transitorio(Exception): ...

def com_retry(fn, *, tentativas: int = 4, base: float = 0.2):
    for n in range(1, tentativas + 1):
        try:
            return fn()
        except Transitorio:
            if n == tentativas:
                raise
            espera = base * (2 ** (n - 1)) * random.uniform(0.5, 1.5)   # jitter
            time.sleep(espera)</code></pre>
<p>Pontos de maturidade: o limite de tentativas e um orçamento total de tempo (deadline) evitam amplificar uma falha (retry storm); o circuit breaker protege dependências doentes; logs estruturados com o <em>id de correlação</em> permitem seguir uma requisição entre serviços; e métricas de taxa de erro por tipo guiam o alarme, não o log cru.</p>
<div class="callout"><strong>NA ENTREVISTA</strong> "Como você trata falha parcial em chamadas a serviços externos?" Resposta sólida: timeouts explícitos em toda chamada, retry só em erro transitório e operação idempotente, backoff com jitter, deadline total, circuit breaker, e degradação controlada. Cite que <code>requests</code> sem <code>timeout=</code> espera para sempre.</div>` },
  ],
  whenToUse: [
    'Exceções de domínio com atributos para decisões programáticas do chamador.',
    'EAFP onde há risco de corrida ou a verificação é tão cara quanto a operação.',
    'raise from para traduzir erros de baixo nível mantendo a causa.',
    'ExceptionGroup e except* ao lidar com várias falhas concorrentes ou validação acumulada.',
    'Handler de fronteira (main, middleware) para logar e traduzir erros uma vez.',
  ],
  whenNot: [
    'except: pelado ou except Exception: pass; sempre específico e com ação.',
    'Exceção para controle de fluxo normal quando um valor explícito comunica melhor.',
    'Retornar None ou códigos mágicos para sinalizar falha quando ausência não é legítima.',
    'assert para validar entrada de usuário (some com python -O).',
    'Retry em operação não idempotente ou sem limite e backoff.',
  ],
  metrics: [
    'ruff regras E722 (except pelado), BLE001 (blind except), TRY (tryceratops), B904 (raise from)',
    'logger.exception com traceback e correlation id; sentry ou similar para agregação',
    'pytest.raises(match=...) e pytest.RaisesGroup para testar caminhos de erro',
    'Taxa de erro por tipo de exceção e latência de retry como sinais em produção',
    'python -W error e -X dev para transformar avisos em falhas em teste',
  ],
  refs: [
    { type: 'doc', title: 'Errors and Exceptions (Python Tutorial)', author: 'Python Software Foundation', url: 'https://docs.python.org/3/tutorial/errors.html', note: 'Inclui exceções definidas pelo usuário, encadeamento, groups e notes.' },
    { type: 'doc', title: 'PEP 654: Exception Groups and except*', author: 'Irit Katriel, Yury Selivanov, Guido van Rossum', url: 'https://peps.python.org/pep-0654/', note: 'A motivação com TaskGroup e as regras de semântica.' },
    { type: 'doc', title: 'PEP 678: Enriching Exceptions with Notes', author: 'Zac Hatfield-Dodds', url: 'https://peps.python.org/pep-0678/', note: 'add_note e __notes__.' },
    { type: 'doc', title: 'Built-in Exceptions', author: 'Python Software Foundation', url: 'https://docs.python.org/3/library/exceptions.html', note: 'A hierarquia completa; reaproveite antes de criar.' },
    { type: 'livro', title: 'Clean Code, cap. 7: Error Handling', author: 'Robert C. Martin', url: 'https://www.oreilly.com/library/view/clean-code-a/9780136083238/', note: 'As regras de contexto, sem null e fail fast.' },
    { type: 'livro', title: 'Effective Python, 3rd ed.', author: 'Brett Slatkin', url: 'https://effectivepython.com/', note: 'Itens sobre exceções, try/finally e padrões de erro.' },
    { type: 'doc', title: 'tenacity', author: 'Julien Danjou e contribuidores', url: 'https://tenacity.readthedocs.io/', note: 'Biblioteca de retry com backoff e jitter.' },
    { type: 'artigo', title: 'Timeouts, retries and backoff with jitter', author: 'Amazon Builders\' Library', url: 'https://aws.amazon.com/builders-library/timeouts-retries-and-backoff-with-jitter/', note: 'A referência industrial sobre retries seguros.' },
  ]
};

window.LESSON_CONTENT['code-smells'] = {
  id: 'code-smells',
  title: 'Code smells e refactoring',
  etapa: 4, etapaName: 'Clean Code',
  time: '75 min',
  tags: ['smells', 'refactoring', 'Fowler', 'dívida técnica'],
  tagline: 'Refatorar é <em>mudar a estrutura sem mudar o comportamento</em>, em passos pequenos e protegidos por testes.',
  intro: `<p>"Code smell" é o termo de Kent Beck, popularizado por Martin Fowler em <em>Refactoring</em> (1ª ed. 1999, 2ª ed. 2018). Um smell não é bug: é um sintoma superficial que costuma indicar um problema de desenho mais profundo. O catálogo dá vocabulário comum à equipe ("isso é Feature Envy", "aqui tem Shotgun Surgery") e aponta qual refactoring aplicar.</p>
<p>Refatorar tem uma definição estrita: alterar a estrutura interna sem alterar o comportamento observável. Isso exige duas coisas. Primeira, testes que provem que o comportamento não mudou (se não existem, o primeiro passo é escrever <em>testes de caracterização</em>). Segunda, passos pequenos e reversíveis, com o teste verde entre cada um. Misturar refatoração com mudança de comportamento no mesmo commit é a receita para revisões ruins e bugs.</p>
<p>A 2ª edição usa JavaScript nos exemplos, mas os refactorings são independentes de linguagem; em Python, boa parte da mecânica vem de ferramentas (rope, PyCharm, ruff) e de recursos da linguagem (dataclasses, geradores, Protocols). Esta lição mostra os smells mais frequentes em código Python real, com antes e depois.</p>`,
  sections: [
    { id: 'catalogo', title: 'O catálogo de smells (visão de mapa)', body: `
<p>Os 24 smells da 2ª edição, agrupados pelo tipo de problema que sinalizam. Você não precisa decorar; precisa reconhecer os grupos.</p>
<table><thead><tr><th>Grupo</th><th>Smells</th><th>Em Python</th></tr></thead><tbody>
<tr><td>Inchaço</td><td>Long Function, Large Class, Long Parameter List, Primitive Obsession, Data Clumps</td><td>funções de 200 linhas, <code>**kwargs</code> infinito, strings e dicts no lugar de tipos</td></tr>
<tr><td>Mudança</td><td>Divergent Change, Shotgun Surgery</td><td>uma mudança toca 12 arquivos, ou um módulo muda por 5 motivos</td></tr>
<tr><td>Acoplamento</td><td>Feature Envy, Message Chains, Middle Man, Insider Trading</td><td><code>a.b.c.d.valor</code>, métodos que só manipulam dados de outro objeto</td></tr>
<tr><td>Dados</td><td>Mutable Data, Global Data, Temporary Field, Data Class</td><td>estado global de módulo, atributos que só existem às vezes</td></tr>
<tr><td>Duplicação e ruído</td><td>Duplicated Code, Lazy Element, Speculative Generality, Mysterious Name, Comments</td><td>copy-paste, abstrações sem uso, nomes <code>data</code>, <code>tmp</code></td></tr>
<tr><td>Condicionais</td><td>Repeated Switches, Loops, Alternative Classes with Different Interfaces</td><td>cadeias de if/elif repetidas em vários lugares</td></tr>
<tr><td>Herança</td><td>Refused Bequest</td><td>subclasse que levanta <code>NotImplementedError</code> em métodos herdados</td></tr>
</tbody></table>
<div class="callout"><strong>NA ENTREVISTA</strong> Dado um trecho de código, nomeie dois ou três smells e proponha o refactoring correspondente, <em>mencionando os testes que garantem que nada muda</em>. Dizer "eu reescreveria" sem proteção é sinal de júnior.</div>` },
    { id: 'long-function', title: 'Long Function e Extract Function', body: `
<p>O refactoring mais usado do catálogo. Procure blocos que você comentaria ("# calcula o desconto") e transforme-os em função com esse nome. A regra de Fowler é separar <em>intenção</em> (o que) de <em>implementação</em> (como).</p>
<p><strong>Antes:</strong></p>
<pre><code class="language-python">def relatorio(vendas):
    total = 0
    for v in vendas:
        total += v["valor"]
    # media por vendedor
    por_vend = {}
    for v in vendas:
        por_vend.setdefault(v["vendedor"], []).append(v["valor"])
    medias = {k: sum(x) / len(x) for k, x in por_vend.items()}
    # formata
    linhas = [f"Total: {total:.2f}"]
    for k, m in sorted(medias.items()):
        linhas.append(f"{k}: {m:.2f}")
    return "\\n".join(linhas)</code></pre>
<p><strong>Depois:</strong></p>
<pre><code class="language-python">from collections import defaultdict
from statistics import fmean

def total_vendido(vendas: list[dict]) -&gt; float:
    return sum(v["valor"] for v in vendas)

def media_por_vendedor(vendas: list[dict]) -&gt; dict[str, float]:
    valores = defaultdict(list)
    for v in vendas:
        valores[v["vendedor"]].append(v["valor"])
    return {nome: fmean(vs) for nome, vs in valores.items()}

def formatar_relatorio(total: float, medias: dict[str, float]) -&gt; str:
    linhas = [f"Total: {total:.2f}"]
    linhas += [f"{nome}: {m:.2f}" for nome, m in sorted(medias.items())]
    return "\\n".join(linhas)

def relatorio(vendas: list[dict]) -&gt; str:
    return formatar_relatorio(total_vendido(vendas), media_por_vendedor(vendas))</code></pre>
<p>Cada função agora é testável isolada, e <code>relatorio</code> lê como a especificação. Perceba que não foi preciso chegar a "funções de três linhas": a medida é o propósito de cada bloco. O oposto, <em>Inline Function</em>, também faz parte do catálogo quando o corpo é tão claro quanto o nome.</p>` },
    { id: 'primitive-obsession', title: 'Primitive Obsession, Data Clumps e Replace Conditional', body: `
<p>Strings e dicts carregando regras de domínio são o smell mais comum em Python. Se todo lugar valida o mesmo CPF ou compara a mesma string de estado, a regra está duplicada.</p>
<p><strong>Antes:</strong></p>
<pre><code class="language-python">def frete(tipo, peso, cep):
    if tipo == "expresso":
        base = 30
    elif tipo == "economico":
        base = 12
    elif tipo == "retirada":
        base = 0
    else:
        raise ValueError(tipo)
    if cep.startswith("0") or cep.startswith("1"):
        base *= 1.2
    return base + peso * 0.5

def prazo(tipo):
    if tipo == "expresso": return 1
    elif tipo == "economico": return 7
    elif tipo == "retirada": return 0</code></pre>
<p>O mesmo <code>tipo</code> é testado em dois lugares (Repeated Switches). Adicionar "sedex10" exige achar todos. <strong>Depois</strong>, com Enum e dados na própria definição:</p>
<pre><code class="language-python">from dataclasses import dataclass
from enum import Enum

@dataclass(frozen=True)
class Servico:
    base: float
    prazo_dias: int

class Entrega(Enum):
    EXPRESSO = Servico(30, 1)
    ECONOMICO = Servico(12, 7)
    RETIRADA = Servico(0, 0)

    @property
    def base(self) -&gt; float:
        return self.value.base

    @property
    def prazo_dias(self) -&gt; int:
        return self.value.prazo_dias

REGIOES_CARAS = ("0", "1")

def frete(entrega: Entrega, peso: float, cep: str) -&gt; float:
    base = entrega.base * (1.2 if cep.startswith(REGIOES_CARAS) else 1.0)
    return base + peso * 0.5</code></pre>
<p>Para comportamento (não apenas dados) diferente por variante, use polimorfismo (<em>Replace Conditional with Polymorphism</em>), uma estratégia como função, ou um dict de callables (lição 18). O match estrutural também é uma resposta quando a forma do dado dita o ramo. O ganho comum: a variação passa a ter <em>um</em> lugar.</p>` },
    { id: 'feature-envy', title: 'Feature Envy, Message Chains e Move Method', body: `
<p>Um método que usa mais dados de outro objeto do que do seu próprio sofre de inveja. A cura é mover o método para onde os dados vivem. Cadeias longas (<code>pedido.cliente.endereco.cidade.nome</code>) acoplam quem chama à estrutura inteira (a "Lei de Deméter").</p>
<p><strong>Antes:</strong></p>
<pre><code class="language-python">class Relatorio:
    def linha_cliente(self, pedido):
        c = pedido.cliente
        e = c.endereco
        return f"{c.nome} - {e.rua}, {e.numero} - {e.cidade.nome}/{e.cidade.uf}"</code></pre>
<p><strong>Depois:</strong></p>
<pre><code class="language-python">from dataclasses import dataclass

@dataclass(frozen=True)
class Cidade:
    nome: str
    uf: str

@dataclass(frozen=True)
class Endereco:
    rua: str
    numero: str
    cidade: Cidade

    def resumo(self) -&gt; str:
        return f"{self.rua}, {self.numero} - {self.cidade.nome}/{self.cidade.uf}"

@dataclass(frozen=True)
class Cliente:
    nome: str
    endereco: Endereco

    def rotulo(self) -&gt; str:
        return f"{self.nome} - {self.endereco.resumo()}"

class Relatorio:
    def linha_cliente(self, pedido) -&gt; str:
        return pedido.cliente.rotulo()</code></pre>
<div class="callout warn"><strong>PEGADINHA</strong> Excesso de delegação cria o smell oposto, <em>Middle Man</em> (classes que só repassam chamadas). E em Python, acessar atributos encadeados de um <code>dataclass</code> imutável é muitas vezes aceitável (dado puro, sem comportamento). O smell é acoplamento a estruturas que mudam, não a toda cadeia de pontos.</div>` },
    { id: 'mutable-global', title: 'Mutable Data, Global Data e Temporary Field', body: `
<p>Estado mutável compartilhado é a maior fonte de bugs difíceis de reproduzir. Em Python aparece como variável global de módulo, singleton improvisado, atributo de classe mutável, argumento mutado, e default mutável.</p>
<p><strong>Antes:</strong></p>
<pre><code class="language-python">_cache = {}            # global mutavel
contador = 0

def preco(sku, desconto=[]):          # default mutavel
    global contador
    contador += 1
    desconto.append(sku)
    if sku not in _cache:
        _cache[sku] = consultar(sku)
    return _cache[sku]</code></pre>
<p><strong>Depois</strong> (estado encapsulado e injetável; cache com ferramenta apropriada):</p>
<pre><code class="language-python">from functools import lru_cache

class Catalogo:
    def __init__(self, consultar) -&gt; None:
        self._consultar = consultar
        self.consultas = 0

    @lru_cache(maxsize=1024)       # cuidado: cache por instancia exige outra estrategia
    def _preco(self, sku: str) -&gt; float:
        self.consultas += 1
        return self._consultar(sku)

    def preco(self, sku: str) -&gt; float:
        return self._preco(sku)</code></pre>
<p>Cuidado com <code>lru_cache</code> em métodos: ele guarda referência a <code>self</code> e pode vazar memória (a instância nunca é coletada enquanto está no cache). Alternativas: <code>functools.cached_property</code> para valores por instância, ou um cache explícito no objeto.</p>
<ul>
<li><strong>Encapsule</strong> o estado em um objeto com interface; injete-o.</li>
<li><strong>Prefira imutabilidade</strong>: dataclass frozen, tuplas, <code>dataclasses.replace</code>.</li>
<li><strong>Temporary Field</strong> (atributo só válido em certos momentos): extraia para uma classe ou passe como argumento.</li>
</ul>` },
    { id: 'refactoring-seguro', title: 'Refatorar com segurança: testes de caracterização e passos pequenos', body: `
<p>O processo importa mais que o catálogo. Roteiro seguro para legado sem testes:</p>
<ol>
<li><strong>Congele o comportamento</strong> com testes de caracterização: rode o código atual com entradas representativas e assine as saídas (golden master). A biblioteca <code>approvaltests</code> e o <code>syrupy</code> (snapshots do pytest) automatizam isso.</li>
<li><strong>Passos mínimos</strong>: um refactoring por commit, teste verde entre eles.</li>
<li><strong>Use ferramentas de refactor</strong> (rename, extract, move da IDE ou <code>rope</code>) em vez de busca e troca textual.</li>
<li><strong>Separe</strong> commits de refatoração dos de comportamento.</li>
<li><strong>Apoie-se no checker</strong>: mypy e pyright acusam o que quebrou numa mudança de assinatura.</li>
</ol>
<pre><code class="language-python"># teste de caracterizacao (golden master) com pytest
import pytest

CASOS = [
    ({"itens": [], "vip": False}, 0.0),
    ({"itens": [(10.0, 2)], "vip": False}, 20.0),
    ({"itens": [(10.0, 2)], "vip": True}, 18.0),
]

@pytest.mark.parametrize("entrada, esperado", CASOS)
def test_total_legado_nao_mudou(entrada, esperado):
    assert total_legado(**entrada) == pytest.approx(esperado)</code></pre>
<p>Padrão <em>Strangler</em> em escala maior: crie a nova implementação ao lado, direcione uma fatia do tráfego e remova a antiga quando a nova provar equivalência. Em escala de linha, o equivalente é o <em>Parallel Change</em>: adicionar a nova forma, migrar os chamadores, remover a antiga.</p>
<div class="callout tip"><strong>DICA</strong> Regra do escoteiro (Martin): deixe o código um pouco melhor do que encontrou, mas dentro do escopo da tarefa. Refactor oportunista e pequeno vence o "grande refactor" que nunca é aprovado.</div>` },
    { id: 'divida-tecnica', title: 'Dívida técnica: medir, priorizar e negociar', body: `
<p>A metáfora é de Ward Cunningham: atalhos rendem velocidade agora e cobram juros depois. Fowler refina com o <em>quadrante da dívida</em> (deliberada ou inadvertida, prudente ou imprudente): nem toda dívida é erro, e a prudente e deliberada ("entregamos assim e pagamos depois") é decisão de negócio legítima, desde que registrada.</p>
<p>Como tornar a dívida visível e priorizável:</p>
<ul>
<li><strong>Registre</strong> itens de dívida como tickets com impacto, risco e custo estimado; "TODO" sem dono é ruído.</li>
<li><strong>Meça hotspots</strong>: arquivos que mudam com frequência <em>e</em> são complexos concentram o custo (Adam Tornhill, <em>Your Code as a Crime Scene</em>, usa o histórico do git para isso). Em Python, <code>radon cc</code> e <code>wily</code> mostram complexidade e sua evolução; <code>git log --format=format: --name-only | sort | uniq -c | sort -rn | head</code> dá a frequência de mudança.</li>
<li><strong>Priorize pelo juro</strong>, não pela feiura: código feio que ninguém toca não custa nada.</li>
<li><strong>Negocie</strong> com termos de negócio (tempo de entrega, incidentes, onboarding), e reserve fatia fixa de capacidade em vez de "sprint de refactor".</li>
<li><strong>Remova código morto</strong> com <code>vulture</code> e cobertura de produção; o código mais barato de manter é o que não existe.</li>
</ul>
<pre><code class="language-bash">radon cc src -s -a -nc          # complexidade ciclomatica, so grau C ou pior
vulture src --min-confidence 80 # codigo morto provavel
git log --since=6.months --name-only --pretty=format: | sort | uniq -c | sort -rn | head -20</code></pre>` },
  ],
  whenToUse: [
    'Antes de adicionar uma funcionalidade a código difícil de entender: refatore o terreno primeiro (preparatory refactoring).',
    'Quando o mesmo smell aparece em revisões repetidas: vire regra do linter ou convenção.',
    'Com testes verdes e passos pequenos, em commits separados de mudanças de comportamento.',
    'Em hotspots (alta complexidade e alta frequência de mudança), onde o retorno é maior.',
    'Para dar vocabulário comum à equipe e acelerar a revisão de código.',
  ],
  whenNot: [
    'Sem testes: escreva os de caracterização primeiro.',
    'Refatoração "grande bang" paralela à entrega de features: risco alto e difícil de revisar.',
    'Em código estável que ninguém altera: o custo de mexer supera o ganho.',
    'Misturando refactor com mudança de comportamento no mesmo commit.',
    'Perfeccionismo: eliminar todo smell sem considerar o contexto vira burocracia.',
  ],
  metrics: [
    'radon cc / mi e wily para complexidade ciclomática e índice de manutenibilidade ao longo do tempo',
    'ruff regras C901 (mccabe), PLR (refactor), SIM, RUF e PERF',
    'vulture para código morto; coverage para achar código nunca executado',
    'rope e IDE para rename, extract e move automatizados',
    'git log por arquivo (churn) combinado com complexidade para achar hotspots',
  ],
  refs: [
    { type: 'livro', title: 'Refactoring: Improving the Design of Existing Code, 2nd ed.', author: 'Martin Fowler', url: 'https://martinfowler.com/books/refactoring.html', note: 'O catálogo de smells e refactorings; a referência definitiva.' },
    { type: 'portal', title: 'Refactoring Catalog', author: 'Martin Fowler', url: 'https://refactoring.com/catalog/', note: 'Catálogo online com os refactorings nomeados e a mecânica passo a passo.' },
    { type: 'livro', title: 'Working Effectively with Legacy Code', author: 'Michael Feathers', url: 'https://www.oreilly.com/library/view/working-effectively-with/0131177052/', note: 'Como pôr testes em código sem testes: seams e caracterização.' },
    { type: 'livro', title: 'Your Code as a Crime Scene', author: 'Adam Tornhill', url: 'https://pragprog.com/titles/atcrime2/your-code-as-a-crime-scene-second-edition/', note: 'Hotspots a partir do histórico do git.' },
    { type: 'artigo', title: 'Technical Debt Quadrant', author: 'Martin Fowler', url: 'https://martinfowler.com/bliki/TechnicalDebtQuadrant.html', note: 'Dívida prudente e imprudente, deliberada e inadvertida.' },
    { type: 'doc', title: 'radon', author: 'Michele Lacchia', url: 'https://radon.readthedocs.io/', note: 'Métricas de complexidade para Python.' },
    { type: 'doc', title: 'rope', author: 'Ali Gholami Rudi e colaboradores', url: 'https://github.com/python-rope/rope', note: 'Biblioteca de refactoring para Python usada por várias IDEs.' },
    { type: 'livro', title: 'Clean Code, cap. 17: Smells and Heuristics', author: 'Robert C. Martin', url: 'https://www.oreilly.com/library/view/clean-code-a/9780136083238/', note: 'A lista de heurísticas do livro, comparável ao catálogo de Fowler.' },
  ]
};

window.LESSON_CONTENT['pytest-testes'] = {
  id: 'pytest-testes',
  title: 'Testes com pytest',
  etapa: 4, etapaName: 'Clean Code',
  time: '90 min',
  tags: ['pytest', 'fixtures', 'hypothesis', 'cobertura'],
  tagline: 'Teste bom é <em>especificação executável</em>: rápido, determinístico, independente e que quebra pelo motivo certo.',
  intro: `<p>Testes automatizados são o que torna refatoração, upgrade de dependência e deploy frequente possíveis sem medo. O pytest virou o padrão de fato em Python porque tira cerimônia: funções simples com <code>assert</code>, introspecção de falhas, fixtures por injeção e um ecossistema de plugins enorme (pytest-cov, pytest-xdist, pytest-asyncio, hypothesis, pytest-mock).</p>
<p>Escrever muitos testes não é o objetivo; confiança barata é. Isso exige estratégia: a <em>pirâmide de testes</em> (muitos unitários rápidos, alguns de integração, poucos ponta a ponta), testes que verificam comportamento e não implementação, e métricas honestas (cobertura mede o que executou, não o que foi verificado).</p>
<p>Esta lição cobre o pytest a fundo: asserts, fixtures e escopos, parametrize, marcadores, tmp_path, monkeypatch, cobertura, execução em paralelo, e testes baseados em propriedades com Hypothesis. O TDD e os test doubles ficam na próxima lição.</p>`,
  sections: [
    { id: 'basico-assert', title: 'O básico: descoberta, assert e exceções', body: `
<p>O pytest descobre arquivos <code>test_*.py</code> e funções <code>test_*</code>. Usa o <code>assert</code> nativo e reescreve o bytecode para mostrar os valores em caso de falha, sem <code>assertEqual</code>.</p>
<pre><code class="language-python"># test_precos.py
import pytest
from precos import calcular_total, PrecoInvalido

def test_total_soma_itens():
    assert calcular_total([10.0, 5.5]) == 15.5

def test_total_vazio_eh_zero():
    assert calcular_total([]) == 0

def test_preco_negativo_levanta():
    with pytest.raises(PrecoInvalido, match="negativo"):
        calcular_total([-1.0])

def test_float_com_tolerancia():
    assert 0.1 + 0.2 == pytest.approx(0.3)</code></pre>
<p>Convenções que mantêm testes legíveis: nome descreve o comportamento (<code>test_pedido_vip_recebe_desconto</code>), estrutura Arrange-Act-Assert, <em>um</em> motivo para falhar por teste, e dados do teste visíveis no próprio teste (evite "mystery guest", dados escondidos num arquivo distante).</p>
<pre><code class="language-bash">pytest -q                        # saida enxuta
pytest -x --lf                   # para na primeira falha, reexecuta as que falharam
pytest -k "vip and not boleto"   # filtra por expressao de nome
pytest tests/unit -m "not slow"  # filtra por marcador
pytest --durations=10            # os 10 testes mais lentos
pytest -p no:randomly -vv        # desliga ordem aleatoria e mostra detalhe</code></pre>
<div class="callout warn"><strong>PEGADINHA</strong> Comparar floats com <code>==</code> é bug latente: use <code>pytest.approx</code> ou <code>math.isclose</code>. E <code>assert</code> em tupla (<code>assert (x, "msg")</code>) é sempre verdadeiro (a tupla não é vazia); o Python avisa com SyntaxWarning, mas o pytest também reclama.</div>` },
    { id: 'fixtures', title: 'Fixtures: injeção de dependência para testes', body: `
<p>Fixture é uma função que prepara (e opcionalmente limpa) algo; o teste a pede pelo <em>nome do parâmetro</em>. O escopo controla quanto vive: <code>function</code> (padrão), <code>class</code>, <code>module</code>, <code>package</code>, <code>session</code>. Fixtures com <code>yield</code> fazem teardown depois do teste, mesmo se ele falhar.</p>
<pre><code class="language-python"># conftest.py (compartilhado por todo o diretorio)
import sqlite3
import pytest

@pytest.fixture(scope="session")
def schema_sql() -&gt; str:
    return "create table usuarios (id integer primary key, nome text not null)"

@pytest.fixture
def db(schema_sql):
    conn = sqlite3.connect(":memory:")
    conn.execute(schema_sql)
    yield conn            # o teste roda aqui
    conn.close()          # teardown

@pytest.fixture
def usuario_ana(db):
    db.execute("insert into usuarios (nome) values ('ana')")
    db.commit()
    return "ana"

# test_usuarios.py
def test_lista_usuarios(db, usuario_ana):
    nomes = [r[0] for r in db.execute("select nome from usuarios")]
    assert nomes == [usuario_ana]</code></pre>
<p>Fixtures embutidas que você deve conhecer: <code>tmp_path</code> (diretório temporário por teste), <code>monkeypatch</code> (altera env, atributos e dicts com restauração automática), <code>capsys</code>/<code>caplog</code> (captura saída e logs), <code>request</code> (introspecção), e <code>tmp_path_factory</code> para escopos maiores.</p>
<pre><code class="language-python">import os

def test_config_le_variavel(monkeypatch, tmp_path):
    monkeypatch.setenv("APP_ENV", "teste")
    arquivo = tmp_path / "saida.txt"
    arquivo.write_text("ok", encoding="utf-8")
    assert os.environ["APP_ENV"] == "teste"
    assert arquivo.read_text(encoding="utf-8") == "ok"</code></pre>
<div class="callout tip"><strong>DICA</strong> Escopo largo economiza tempo (um container de banco por sessão), mas compartilha estado e gera dependência de ordem. A regra: escopo largo para recursos caros e imutáveis; fixture de função que <em>reinicia</em> o estado (truncate ou transação com rollback) por cima.</div>` },
    { id: 'parametrize', title: 'parametrize, marcadores e organização', body: `
<p><code>@pytest.mark.parametrize</code> executa o mesmo teste com várias entradas, cada uma como caso separado no relatório. Use <code>ids</code> para legibilidade e <code>pytest.param</code> para marcar casos individuais (xfail, skip).</p>
<pre><code class="language-python">import pytest
from validadores import e_cpf_valido

@pytest.mark.parametrize(
    "cpf, esperado",
    [
        pytest.param("529.982.247-25", True, id="valido-formatado"),
        pytest.param("52998224725", True, id="valido-sem-mascara"),
        pytest.param("111.111.111-11", False, id="digitos-repetidos"),
        pytest.param("123", False, id="curto"),
        pytest.param("", False, id="vazio"),
        pytest.param("529.982.247-26", False, id="digito-errado"),
    ],
)
def test_cpf(cpf, esperado):
    assert e_cpf_valido(cpf) is esperado</code></pre>
<p>Marcadores (<code>skip</code>, <code>skipif</code>, <code>xfail</code>, e os seus) são registrados no <code>pyproject.toml</code> para evitar typos:</p>
<pre><code class="language-toml">[tool.pytest.ini_options]
minversion = "8.0"
addopts = "-ra --strict-markers --strict-config"
testpaths = ["tests"]
markers = [
    "slow: testes lentos (deselecione com -m 'not slow')",
    "integration: usam banco ou rede local",
]</code></pre>
<p>Organização: <code>tests/unit</code>, <code>tests/integration</code>, <code>tests/e2e</code>, com <code>conftest.py</code> por nível. Prefira o layout <code>src/</code> no projeto para que os testes importem o pacote <em>instalado</em> (editable), não o diretório corrente por acidente.</p>` },
    { id: 'piramide', title: 'Pirâmide de testes e o que testar em cada nível', body: `
<table><thead><tr><th>Nível</th><th>Escopo</th><th>Velocidade</th><th>Quantidade</th></tr></thead><tbody>
<tr><td>Unitário</td><td>Função ou classe isolada, dependências externas substituídas</td><td>milissegundos</td><td>Muitos</td></tr>
<tr><td>Integração</td><td>Componentes reais juntos: repositório com banco, cliente HTTP com servidor local</td><td>dezenas de ms a segundos</td><td>Alguns, nas fronteiras</td></tr>
<tr><td>Ponta a ponta</td><td>Sistema inteiro via interface pública</td><td>segundos a minutos</td><td>Poucos, nos fluxos críticos</td></tr>
</tbody></table>
<p>Variações: o "troféu" de Kent C. Dodds enfatiza integração, e a "ampulheta" é o anti-padrão (muito E2E, muito unitário, nada no meio). O princípio é o mesmo: <em>teste o comportamento no nível mais baixo que ainda dá confiança</em>. Teste de banco com banco real (SQLite em memória ou Postgres em container via <code>testcontainers</code>) pega erros de SQL que um mock jamais pegaria.</p>
<ul>
<li><strong>Contrato</strong>: teste que toda implementação de um Protocol obedece ao mesmo comportamento, parametrizando sobre as implementações.</li>
<li><strong>Flaky</strong>: teste instável é pior que nenhum. Causas comuns: relógio, aleatoriedade sem semente, ordem, rede, concorrência. Congele o tempo (<code>freezegun</code>, <code>time-machine</code>), fixe sementes e isole.</li>
<li><strong>Velocidade</strong>: <code>pytest-xdist</code> (<code>-n auto</code>) paraleliza; <code>--durations</code> acha os culpados.</li>
</ul>
<pre><code class="language-python">import pytest
from repositorios import RepoMemoria, RepoSqlite

@pytest.fixture(params=[RepoMemoria, RepoSqlite], ids=["memoria", "sqlite"])
def repo(request):
    return request.param()

def test_contrato_salvar_e_obter(repo):
    repo.salvar({"id": 1, "nome": "ana"})
    assert repo.obter(1)["nome"] == "ana"</code></pre>` },
    { id: 'hypothesis', title: 'Testes baseados em propriedades com Hypothesis', body: `
<p>Em vez de escolher exemplos, você descreve uma <em>propriedade</em> que vale para toda entrada de um tipo, e o Hypothesis gera centenas de casos, incluindo os de borda (vazio, Unicode estranho, inteiros enormes), e <em>encolhe</em> a falha para o exemplo mínimo. Propriedades típicas: ida e volta (<code>decode(encode(x)) == x</code>), idempotência, invariantes (ordenar mantém o tamanho), e oráculo (implementação rápida igual à lenta).</p>
<pre><code class="language-python">from hypothesis import given, strategies as st, settings, example

def ordenar(xs: list[int]) -&gt; list[int]:
    return sorted(xs)

@given(st.lists(st.integers()))
def test_ordenar_preserva_elementos_e_ordena(xs):
    saida = ordenar(xs)
    assert sorted(saida) == sorted(xs)
    assert all(a &lt;= b for a, b in zip(saida, saida[1:]))
    assert ordenar(saida) == saida            # idempotente

import json

@given(st.dictionaries(st.text(), st.integers() | st.text() | st.none()))
@example({})
def test_json_ida_e_volta(d):
    assert json.loads(json.dumps(d)) == d</code></pre>
<p>Hypothesis guarda falhas encontradas num banco local e as reexecuta nas próximas rodadas. Para CI determinístico, configure perfis (<code>settings.register_profile("ci", derandomize=True, max_examples=200)</code>). Há estratégias para dataclasses (<code>st.builds</code>), datas, decimais, e máquina de estados (<code>RuleBasedStateMachine</code>) para testar sequências de operações num sistema com estado.</p>
<div class="callout"><strong>NA ENTREVISTA</strong> "Como testar uma função de parsing ou serialização?" Teste de ida e volta com Hypothesis, mais um punhado de exemplos de regressão. Hypothesis não substitui exemplos escolhidos; complementa, achando o que você não imaginou.</div>` },
    { id: 'cobertura', title: 'Cobertura: o que mede e o que não mede', body: `
<p>Cobertura de código (<code>coverage.py</code> via <code>pytest-cov</code>) mede o que foi <em>executado</em>, não o que foi <em>verificado</em>. Um teste sem <code>assert</code> dá 100% de cobertura de linha. Use como detector de código não testado, não como meta de qualidade. Ative cobertura de <em>ramos</em> (<code>--cov-branch</code>), que pega o <code>else</code> não exercitado.</p>
<pre><code class="language-bash">pytest --cov=src --cov-branch --cov-report=term-missing --cov-fail-under=85
coverage html &amp;&amp; echo "abra htmlcov/index.html"</code></pre>
<pre><code class="language-toml">[tool.coverage.run]
branch = true
source = ["src"]

[tool.coverage.report]
fail_under = 85
exclude_also = [
    "if TYPE_CHECKING:",
    "raise NotImplementedError",
    "@overload",
]</code></pre>
<p>Para medir se os testes <em>realmente</em> detectam bugs, existe o <strong>mutation testing</strong>: a ferramenta altera o código (troca <code>&lt;</code> por <code>&lt;=</code>, remove uma linha) e verifica se algum teste falha; mutante que sobrevive indica verificação fraca. Em Python, <code>mutmut</code> e <code>cosmic-ray</code> fazem isso; é caro, então rode em módulos críticos.</p>
<p>Um piso de cobertura no CI (por exemplo 80 a 90%) evita regressão, mas o número alvo não deve virar fim em si: o efeito Goodhart faz o time escrever testes que só passam por linhas. Prefira cobrir <em>diferenças</em> (diff-cover em PR) e olhar o relatório de linhas faltantes.</p>` },
    { id: 'async-ecossistema', title: 'Async, plugins e boas práticas de suíte', body: `
<p>Para código <code>asyncio</code>, use <code>pytest-asyncio</code> (ou <code>anyio</code>): funções de teste <code>async def</code> e fixtures assíncronas. O modo <code>auto</code> evita decorar cada teste.</p>
<pre><code class="language-python">import asyncio
import pytest

async def buscar(n: int) -&gt; int:
    await asyncio.sleep(0)
    return n * 2

@pytest.mark.asyncio
async def test_buscar_em_paralelo():
    resultados = await asyncio.gather(buscar(1), buscar(2))
    assert resultados == [2, 4]</code></pre>
<p>Plugins que valem a pena: <code>pytest-xdist</code> (paralelismo), <code>pytest-randomly</code> (ordem aleatória, expõe dependência entre testes), <code>pytest-mock</code> (wrapper do unittest.mock com limpeza), <code>pytest-cov</code>, <code>pytest-timeout</code> (testes que travam), <code>pytest-httpx</code> ou <code>responses</code> (simula HTTP), <code>syrupy</code> (snapshots).</p>
<p>Higiene da suíte: testes independentes (qualquer ordem), sem rede real e sem relógio real em unitários, falha com mensagem útil, e refatoração dos testes com o mesmo cuidado do código (fixtures e builders em vez de copiar e colar). Para a abordagem de Harry Percival, <em>Test-Driven Development with Python</em> (O'Reilly, com edição online gratuita), os testes funcionais com Selenium e os unitários guiam o design, tema da próxima lição.</p>` },
  ],
  whenToUse: [
    'Em todo projeto além de script descartável: testes rápidos como rede de segurança de refactor.',
    'parametrize para tabelas de casos; fixtures para preparar e limpar recursos.',
    'Hypothesis para parsers, serialização, algoritmos e validadores com propriedades claras.',
    'Cobertura de ramos e de diff como detector de lacunas, não como meta.',
    'Banco real em integração (SQLite memória ou container) para pegar erros que mocks escondem.',
  ],
  whenNot: [
    'Testar implementação (chamadas internas) em vez de comportamento: o teste quebra a cada refactor.',
    'Perseguir 100% de cobertura com testes sem asserts.',
    'Fixture de session mutável compartilhada: cria dependência de ordem.',
    'Testes ponta a ponta para tudo: lentos, frágeis e caros.',
    'Mockar tudo: o teste passa e o sistema quebra na integração.',
  ],
  metrics: [
    'pytest -q --durations=10 --strict-markers; pytest-xdist com -n auto',
    'pytest --cov --cov-branch --cov-report=term-missing e diff-cover em PR',
    'mutmut ou cosmic-ray para taxa de mutantes mortos nos módulos críticos',
    'pytest-randomly e --lf para expor ordem e reexecutar falhas',
    'Taxa de testes instáveis (flaky) e tempo total da suíte como indicadores de saúde',
  ],
  refs: [
    { type: 'doc', title: 'pytest documentation', author: 'pytest-dev', url: 'https://docs.pytest.org/', note: 'Referência completa: fixtures, parametrize, marcadores e plugins.' },
    { type: 'livro', title: 'Python Testing with pytest, 2nd ed.', author: 'Brian Okken', url: 'https://pragprog.com/titles/bopytest2/python-testing-with-pytest-second-edition/', note: 'O guia prático do pytest, de fixtures a plugins.' },
    { type: 'livro', title: 'Test-Driven Development with Python, 3rd ed.', author: 'Harry Percival', url: 'https://www.obeythetestinggoat.com/', note: 'TDD de ponta a ponta com Django e Selenium; edição online gratuita.' },
    { type: 'doc', title: 'Hypothesis documentation', author: 'David R. MacIver, Zac Hatfield-Dodds e colaboradores', url: 'https://hypothesis.readthedocs.io/', note: 'Property-based testing para Python: estratégias, stateful e perfis.' },
    { type: 'doc', title: 'Coverage.py', author: 'Ned Batchelder', url: 'https://coverage.readthedocs.io/', note: 'Documentação da cobertura de linha e de ramo.' },
    { type: 'artigo', title: 'Test Pyramid', author: 'Martin Fowler', url: 'https://martinfowler.com/bliki/TestPyramid.html', note: 'A origem e a leitura moderna da pirâmide.' },
    { type: 'doc', title: 'pytest-asyncio', author: 'pytest-dev', url: 'https://pytest-asyncio.readthedocs.io/', note: 'Testes de código assíncrono.' },
    { type: 'video', title: 'Live de Python: pytest', author: 'Eduardo Mendes', url: 'https://www.youtube.com/@Dunossauro', note: 'Aulas em português sobre testes e fixtures.' },
  ]
};

window.LESSON_CONTENT['tdd-test-doubles'] = {
  id: 'tdd-test-doubles',
  title: 'TDD e test doubles',
  etapa: 4, etapaName: 'Clean Code',
  time: '75 min',
  tags: ['TDD', 'mock', 'fake', 'unittest.mock'],
  tagline: 'TDD é um ciclo de <em>design guiado por feedback</em>, e test doubles são o bisturi: usados no lugar certo, não em todo lugar.',
  intro: `<p>Test-Driven Development (Kent Beck, <em>Test-Driven Development: By Example</em>, 2002) inverte a ordem: escreva um teste que falha (red), faça passar com o mínimo de código (green), e só então melhore o desenho (refactor). O valor não é "ter testes"; é o feedback curto sobre o <em>design</em>. Código difícil de testar costuma ser acoplado demais, e o teste escrito antes expõe isso enquanto ainda é barato mudar.</p>
<p>Test doubles são objetos que substituem dependências reais em testes (banco, rede, relógio, serviço externo). A taxonomia de Gerard Meszaros (<em>xUnit Test Patterns</em>) distingue dummy, stub, spy, mock e fake, e a confusão entre eles gera testes frágeis. Martin Fowler resumiu a divisão em "Mocks Aren't Stubs": verificar <em>estado</em> versus verificar <em>interação</em>.</p>
<p>Harry Percival, em <em>Test-Driven Development with Python</em>, mostra o ciclo em Django com testes funcionais e unitários, e em <em>Architecture Patterns with Python</em> defende fakes em vez de mocks para as portas do sistema. Esta lição junta as duas linhas: o ciclo, os cinco tipos de double, <code>unittest.mock</code> usado com cuidado e o ponto em que mock vira problema.</p>`,
  sections: [
    { id: 'ciclo', title: 'Red, green, refactor na prática', body: `
<p>Um ciclo curto (minutos). Exemplo: uma função que calcula o preço com desconto progressivo. Começamos pelo menor caso.</p>
<pre><code class="language-python"># 1) RED: o teste primeiro (test_desconto.py)
import pytest
from desconto import preco_final

def test_sem_desconto_abaixo_de_100():
    assert preco_final(50.0) == 50.0

# rodar: ImportError / falha. Isso eh o vermelho esperado.

# 2) GREEN: o minimo que passa
def preco_final(valor: float) -&gt; float:
    return valor

# 3) proximo teste vermelho
def test_dez_por_cento_a_partir_de_100():
    assert preco_final(200.0) == pytest.approx(180.0)

# GREEN: generaliza so o necessario
def preco_final(valor: float) -&gt; float:
    return valor * 0.9 if valor &gt;= 100 else valor

# 4) REFACTOR: tira numero magico, testes continuam verdes
LIMITE_DESCONTO = 100.0
TAXA_DESCONTO = 0.10

def preco_final(valor: float) -&gt; float:
    if valor &gt;= LIMITE_DESCONTO:
        return valor * (1 - TAXA_DESCONTO)
    return valor</code></pre>
<p>Regras do jogo: só escreva código de produção para fazer um teste falhando passar; só escreva o teste suficiente para falhar; em verde, refatore sem mudar comportamento. Duas técnicas de avanço: <em>fake it</em> (retornar constante e generalizar com o segundo teste) e <em>triangulação</em> (dois exemplos forçam a regra geral). Teste que passa de primeira merece suspeita: rode-o vermelho de propósito (quebre o código) para ter certeza de que ele detecta algo.</p>
<div class="callout"><strong>NA ENTREVISTA</strong> Esperam que você diferencie TDD de "escrever testes depois". Argumente: o ganho principal é design (acoplamento exposto cedo) e granularidade de commits; o custo é disciplina e aprendizado. Reconheça que o TDD pleno nem sempre é apropriado (exploração, UI, spikes), e que a discussão "TDD is dead" (DHH, Beck, Fowler, 2014) existe e vale ler.</div>` },
    { id: 'taxonomia', title: 'Taxonomia dos test doubles', body: `
<table><thead><tr><th>Tipo</th><th>O que faz</th><th>O que você verifica</th></tr></thead><tbody>
<tr><td><strong>Dummy</strong></td><td>Preenche um parâmetro obrigatório, nunca usado</td><td>nada</td></tr>
<tr><td><strong>Stub</strong></td><td>Devolve respostas enlatadas</td><td>estado do resultado do sujeito</td></tr>
<tr><td><strong>Spy</strong></td><td>Stub que também registra as chamadas</td><td>chamadas, depois, com asserts</td></tr>
<tr><td><strong>Mock</strong></td><td>Tem expectativas pré-programadas sobre chamadas</td><td>interação (falha se não casar)</td></tr>
<tr><td><strong>Fake</strong></td><td>Implementação funcional simplificada (banco em memória)</td><td>comportamento, via estado</td></tr>
</tbody></table>
<p>Em Python, a distinção fina entre spy e mock é menos rígida que no Java, porque o <code>unittest.mock.Mock</code> serve de ambos (registra chamadas e você assere depois). O que importa é a pergunta: estou verificando o <em>resultado</em> do sujeito (preferível) ou <em>como</em> ele conversou com suas dependências (frágil)?</p>
<pre><code class="language-python"># Stub: resposta enlatada para isolar a regra
class RelogioFixo:
    def __init__(self, agora): self._agora = agora
    def agora(self): return self._agora

# Fake: implementacao real, simples e rapida
class RepoMemoria:
    def __init__(self): self._d = {}
    def salvar(self, u): self._d[u["id"]] = u
    def obter(self, id): return self._d[id]
    def listar(self): return list(self._d.values())

# Spy: grava o que recebeu
class NotificadorSpy:
    def __init__(self): self.enviados = []
    def enviar(self, destino, texto): self.enviados.append((destino, texto))</code></pre>
<p>Regra do Percival e do Fowler: <em>prefira fakes para portas de persistência e stubs para consultas; reserve mocks de interação para efeitos colaterais "saída" (enviar e-mail, publicar evento) que não têm estado a consultar</em>.</p>` },
    { id: 'unittest-mock', title: 'unittest.mock com disciplina', body: `
<p><code>unittest.mock</code> (stdlib) cria <code>Mock</code>, <code>MagicMock</code> e <code>patch</code>. O perigo é o mock permissivo: ele aceita qualquer atributo e qualquer chamada, então um erro de digitação passa em silêncio. Use <code>autospec</code>/<code>spec</code> para que o mock imite a assinatura real e falhe com chamadas inválidas.</p>
<pre><code class="language-python">from unittest.mock import Mock, create_autospec, patch

class Gateway:
    def cobrar(self, cliente_id: int, centavos: int) -&gt; str: ...

def fechar_pedido(gw: Gateway, cliente_id: int, centavos: int) -&gt; str:
    return gw.cobrar(cliente_id, centavos)

def test_fechar_pedido_chama_gateway():
    gw = create_autospec(Gateway, instance=True)
    gw.cobrar.return_value = "ok-123"

    assert fechar_pedido(gw, 7, 1500) == "ok-123"
    gw.cobrar.assert_called_once_with(7, 1500)

def test_autospec_pega_assinatura_errada():
    gw = create_autospec(Gateway, instance=True)
    try:
        gw.cobrar(1)          # falta argumento: o mock real avisa
    except TypeError as e:
        print("pegou:", e)</code></pre>
<p><strong>Onde aplicar o patch</strong> é a pegadinha número um: faça patch no nome <em>onde ele é usado</em>, não onde é definido.</p>
<pre><code class="language-python"># pagamentos.py
from clientes import buscar_cliente      # nome importado vive em pagamentos

def cobrar(id):
    return buscar_cliente(id)["nome"]

# test_pagamentos.py
from unittest.mock import patch
import pagamentos

def test_cobrar():
    with patch("pagamentos.buscar_cliente") as m:      # certo: onde eh USADO
        m.return_value = {"nome": "ana"}
        assert pagamentos.cobrar(1) == "ana"
    # patch("clientes.buscar_cliente") NAO afeta pagamentos.cobrar</code></pre>
<p>Outras ferramentas úteis: <code>side_effect</code> (levantar exceção ou sequência de retornos), <code>patch.object</code>, <code>patch.dict</code> (para <code>os.environ</code>), <code>AsyncMock</code> para corrotinas, e o <code>mocker</code> do <code>pytest-mock</code>, que desfaz os patches automaticamente.</p>
<div class="callout warn"><strong>PEGADINHA</strong> Um teste que escreve <code>mock.called_once_with(1)</code> (sem o prefixo <code>assert_</code>) não verifica nada: o atributo inexistente de um Mock sem spec devolve outro Mock, que é verdadeiro. Use autospec, confira que o teste <em>falha</em> quando deveria (quebre o código de propósito) e prefira asserts sobre o resultado.</div>` },
    { id: 'injecao', title: 'Design testável: injeção de dependência e portas', body: `
<p>O que mais facilita testes não é um framework de mock, é o design: passe as dependências em vez de importá-las dentro da função. Os relógios, o aleatório e a rede são as dependências ocultas clássicas.</p>
<p><strong>Antes</strong> (difícil de testar, exige patch de <code>datetime</code> e de <code>requests</code>):</p>
<pre><code class="language-python">import datetime, requests

def bom_dia():
    hora = datetime.datetime.now().hour
    saudacao = "bom dia" if hora &lt; 12 else "boa tarde"
    requests.post("https://api.exemplo/log", json={"msg": saudacao})
    return saudacao</code></pre>
<p><strong>Depois</strong> (dependências injetadas, funções testáveis sem patch):</p>
<pre><code class="language-python">from collections.abc import Callable
from datetime import datetime
from typing import Protocol

class Logger(Protocol):
    def registrar(self, msg: str) -&gt; None: ...

def bom_dia(agora: Callable[[], datetime], log: Logger) -&gt; str:
    saudacao = "bom dia" if agora().hour &lt; 12 else "boa tarde"
    log.registrar(saudacao)
    return saudacao

class LogFake:
    def __init__(self) -&gt; None:
        self.msgs: list[str] = []
    def registrar(self, msg: str) -&gt; None:
        self.msgs.append(msg)

def test_bom_dia_de_manha():
    log = LogFake()
    assert bom_dia(lambda: datetime(2026, 11, 13, 9), log) == "bom dia"
    assert log.msgs == ["bom dia"]</code></pre>
<p>É a arquitetura hexagonal em miniatura: o núcleo depende de <em>portas</em> (Protocols), a borda fornece <em>adaptadores</em> reais, e os testes fornecem fakes. O ganho é que os testes unitários rodam em milissegundos, sem patch, e os adaptadores reais ganham poucos testes de integração. É o argumento central de <em>Architecture Patterns with Python</em> (Percival e Gregory).</p>` },
    { id: 'mock-vira-problema', title: 'Quando mock vira problema', body: `
<p>Sintomas de uso excessivo e o que fazer:</p>
<ul>
<li><strong>Teste espelha a implementação</strong>: cada chamada interna é um <code>assert_called_with</code>; qualquer refactor quebra o teste sem quebrar o comportamento. Troque por asserção de resultado e de estado, e use fake.</li>
<li><strong>Mock de tipos que você não possui</strong> (cliente de terceiros): o mock diverge da realidade. Envolva a biblioteca num adaptador seu, mocke o adaptador e teste o adaptador com integração (ou VCR/<code>responses</code>/<code>pytest-httpx</code> gravados).</li>
<li><strong>Mocks encadeados</strong> (<code>m.a.b.c.return_value</code>): smell de Message Chain no código; o design pede uma interface menor.</li>
<li><strong>Mocking do que dá para usar de verdade</strong>: SQLite em memória, <code>tmp_path</code>, e container de Postgres geralmente custam pouco e pegam bugs reais de SQL.</li>
<li><strong>Patch em tudo</strong>: sinal de que o design não injeta dependências.</li>
</ul>
<p><strong>Antes</strong> (acoplado à implementação):</p>
<pre><code class="language-python">def test_registrar_usuario_mock_demais():
    repo = Mock()
    hasher = Mock()
    hasher.hash.return_value = "h"
    registrar(repo, hasher, "ana", "senha")
    hasher.hash.assert_called_once_with("senha")
    repo.add.assert_called_once()
    repo.commit.assert_called_once()</code></pre>
<p><strong>Depois</strong> (comportamento observável, com fake):</p>
<pre><code class="language-python">def test_registrar_usuario_persiste_senha_com_hash():
    repo = RepoMemoria()
    registrar(repo, HasherFake(), "ana", "senha")
    u = repo.obter_por_nome("ana")
    assert u.senha_hash != "senha"
    assert u.nome == "ana"</code></pre>
<div class="callout"><strong>NA ENTREVISTA</strong> "London school vs Chicago (Detroit) school": a escola de Londres (mockist, outside-in, GOOS de Freeman e Pryce) isola cada unidade com mocks e verifica interações; a de Chicago (clássica, Beck) usa objetos reais e verifica estado. Em Python, a prática dominante é a clássica, com fakes nas fronteiras. Saiba defender a escolha com o custo de manutenção de cada uma.</div>` },
    { id: 'tdd-limites', title: 'Limites do TDD e como começar', body: `
<p>TDD brilha em lógica de domínio, parsers, algoritmos e bug fixes (escreva o teste que reproduz o bug antes de corrigir; é o melhor uso isolado da técnica). Rende menos em exploração de API desconhecida (faça um spike descartável e depois reescreva com TDD), em UI visual e em código que é só cola entre sistemas (use integração).</p>
<ul>
<li><strong>Comece pelo bug fix</strong>: reproduza com um teste vermelho, corrija, deixe o teste como regressão.</li>
<li><strong>Outside-in</strong> para features: um teste de aceitação grande e vermelho no nível alto guia a criação das unidades (o "duplo laço" de Percival: teste funcional fora, ciclo unitário dentro).</li>
<li><strong>Testes rápidos</strong>: um ciclo TDD só funciona se a suíte unitária roda em segundos; senão, o time para de rodar.</li>
<li><strong>Refactor de teste também</strong>: builders, fixtures e nomes claros; teste é código de primeira classe.</li>
<li><strong>Não dogmatize</strong>: Beck já escreveu que "I get paid for code that works, not for tests"; a disciplina é meio, não fim.</li>
</ul>
<pre><code class="language-bash"># fluxo de bug fix com TDD
git switch -c fix/desconto-negativo
# 1. escreva o teste que reproduz o bug e veja VERMELHO
pytest tests/test_desconto.py::test_valor_negativo -x
# 2. corrija o minimo
# 3. VERDE, e rode a suite inteira
pytest -q
# 4. commit do teste + correcao juntos, mensagem explica o porque</code></pre>` },
  ],
  whenToUse: [
    'TDD em lógica de domínio e em bug fixes: o teste vermelho é a reprodução do bug.',
    'Fakes para portas de persistência e de serviços, stubs para consultas e relógio fixo.',
    'Mocks de interação apenas para efeitos de saída sem estado consultável (enviar e-mail, publicar evento).',
    'create_autospec e patch no ponto de uso, quando precisar de mock de verdade.',
    'Injeção de dependências por construtor ou parâmetro para eliminar patches.',
  ],
  whenNot: [
    'Verificar chamadas internas que o usuário do sistema não enxerga.',
    'Mockar bibliotecas de terceiros diretamente: envolva num adaptador.',
    'TDD dogmático em spikes, UI exploratória e código de pura cola.',
    'Mocks permissivos sem spec: erros de digitação passam calados.',
    'Patch no módulo errado (onde é definido em vez de onde é usado).',
  ],
  metrics: [
    'Ciclo red-green-refactor em minutos; suíte unitária em segundos',
    'create_autospec e spec_set para mocks estritos; pytest-mock para limpeza automática',
    'Taxa de testes que quebram em refactors sem mudança de comportamento (fragilidade)',
    'mutmut para checar se os testes pegam mutantes (verificação real)',
    'Contagem de patch por teste como sinal de acoplamento oculto',
  ],
  refs: [
    { type: 'livro', title: 'Test-Driven Development with Python, 3rd ed.', author: 'Harry Percival', url: 'https://www.obeythetestinggoat.com/', note: 'O duplo laço teste funcional e teste unitário, com Django; edição online gratuita.' },
    { type: 'livro', title: 'Test Driven Development: By Example', author: 'Kent Beck', url: 'https://www.oreilly.com/library/view/test-driven-development/0321146530/', note: 'O livro fundador do TDD.' },
    { type: 'livro', title: 'Architecture Patterns with Python', author: 'Harry Percival e Bob Gregory', url: 'https://www.cosmicpython.com/', note: 'Fakes, portas e adaptadores, e por que preferir fakes a mocks.' },
    { type: 'artigo', title: 'TestDouble', author: 'Martin Fowler', url: 'https://martinfowler.com/bliki/TestDouble.html', note: 'Resumo da taxonomia de Gerard Meszaros (xUnit Test Patterns): dummy, stub, spy, mock e fake.' },
    { type: 'artigo', title: 'Mocks Aren\'t Stubs', author: 'Martin Fowler', url: 'https://martinfowler.com/articles/mocksArentStubs.html', note: 'Verificação de estado versus interação, escola clássica versus mockista.' },
    { type: 'doc', title: 'unittest.mock, mock object library', author: 'Python Software Foundation', url: 'https://docs.python.org/3/library/unittest.mock.html', note: 'Inclui "where to patch" e autospec.' },
    { type: 'livro', title: 'Test-Driven Development: Teste e Design no Mundo Real', author: 'Mauricio Aniche', url: 'https://www.casadocodigo.com.br/products/livro-tdd', note: 'Referência brasileira (Casa do Código) sobre TDD e design.' },
    { type: 'livro', title: 'Growing Object-Oriented Software, Guided by Tests', author: 'Steve Freeman e Nat Pryce', url: 'https://www.oreilly.com/library/view/growing-object-oriented-software/9780321574442/', note: 'A escola de Londres, outside-in com mocks.' },
  ]
};

window.LESSON_CONTENT['tooling-qualidade'] = {
  id: 'tooling-qualidade',
  title: 'Ferramentas de qualidade',
  etapa: 4, etapaName: 'Clean Code',
  time: '60 min',
  tags: ['ruff', 'mypy', 'pre-commit', 'CI'],
  tagline: 'Qualidade que depende de memória e boa vontade <em>erode</em>; qualidade imposta por ferramenta e CI permanece.',
  intro: `<p>Revisão de código humana é cara e deve gastar atenção em design, não em vírgulas e imports fora de ordem. Ferramentas automáticas absorvem o resto: formatação, lint, tipos, segurança, dependências e complexidade. O ponto não é ter todas; é ter um conjunto pequeno, rápido, configurado em um lugar só (<code>pyproject.toml</code>) e <em>bloqueante</em> no CI, com o mesmo comportamento no laptop e na pipeline.</p>
<p>O cenário de ferramentas mudou muito. O Ruff (Astral, escrito em Rust) substituiu, na prática, flake8, isort, pyupgrade, pydocstyle e boa parte dos plugins, e também formata (compatível com Black). O uv (Astral) gerencia ambientes e dependências com lockfile e velocidade muito acima do pip. Os checadores de tipo ganharam concorrentes em Rust. O princípio permanece: automatizar o que é mecânico.</p>
<p>Aqui você monta o conjunto: Ruff (lint e format), checagem de tipos, pre-commit, CI, métricas de complexidade e verificações de segurança e de dependências.</p>`,
  sections: [
    { id: 'ruff', title: 'Ruff: lint e formatação em um binário', body: `
<p>Ruff implementa centenas de regras de dezenas de plugins do ecossistema, organizadas por prefixo de código (E e W do pycodestyle, F do pyflakes, I do isort, B do bugbear, UP do pyupgrade, SIM do simplify, C90 do mccabe). Roda em milissegundos mesmo em bases enormes, tem autofix (<code>--fix</code>) e substitui o Black com <code>ruff format</code>.</p>
<pre><code class="language-toml"># pyproject.toml
[tool.ruff]
line-length = 100
target-version = "py312"
src = ["src", "tests"]

[tool.ruff.lint]
select = [
    "E", "W",   # pycodestyle
    "F",        # pyflakes
    "I",        # isort
    "B",        # bugbear (bugs provaveis)
    "UP",       # pyupgrade (sintaxe moderna)
    "SIM",      # simplificacoes
    "C90",      # complexidade ciclomatica
    "N",        # pep8-naming
    "RUF",      # regras proprias do Ruff
    "S",        # bandit (seguranca)
    "PL",       # pylint (subconjunto)
]
ignore = ["E501"]            # o formatador cuida do comprimento

[tool.ruff.lint.mccabe]
max-complexity = 10

[tool.ruff.lint.per-file-ignores]
"tests/**" = ["S101", "PLR2004"]   # assert e numeros magicos sao ok em teste</code></pre>
<pre><code class="language-bash">ruff check .            # lint
ruff check . --fix      # aplica autofix seguro
ruff format .           # formata (substitui black)
ruff format --check .   # no CI: falha se algo mudaria</code></pre>
<p>Estratégia de adoção: comece com um conjunto pequeno (<code>E,F,I,B,UP</code>), adicione regras aos poucos, e use <code>per-file-ignores</code> e <code>--add-noqa</code> para baselinar o legado. Em vez de <code>select = ["ALL"]</code> (que muda a cada versão do Ruff e gera ruído), escolha explicitamente e fixe a versão da ferramenta.</p>
<div class="callout warn"><strong>PEGADINHA</strong> Duas ferramentas de formatação brigando (Black e Ruff, ou o formatador da IDE) geram diffs ruidosos. Escolha uma e imponha no pre-commit. Também: <code># noqa</code> sem código (<code>noqa: B008</code>) silencia tudo na linha e esconde problemas futuros.</div>` },
    { id: 'tipos-ci', title: 'Checagem de tipos como gate', body: `
<p>A checagem estática (lição 16) entra no mesmo pipeline. Fixe a versão do checador (<code>mypy==1.x</code>), porque atualizações podem acusar erros novos. Aperte o rigor por módulo, e mantenha a execução separada em um job se for lenta (o mypy tem cache incremental; o pyright é mais rápido).</p>
<pre><code class="language-toml">[tool.mypy]
python_version = "3.12"
strict = true
warn_unreachable = true
enable_error_code = ["truthy-bool", "ignore-without-code"]
files = ["src"]

[[tool.mypy.overrides]]
module = ["tests.*"]
disallow_untyped_defs = false</code></pre>
<pre><code class="language-bash">mypy                      # usa 'files' do pyproject
pyright                   # alternativa/complemento, mais rapido
mypy --install-types --non-interactive</code></pre>
<p>Combinação comum em times maduros: Ruff para estilo e bugs, mypy ou pyright para tipos, pytest com cobertura e uma verificação de segurança. Quatro comandos, todos no <code>pre-commit</code> (os rápidos) e no CI (todos).</p>` },
    { id: 'pre-commit', title: 'pre-commit: barrar antes do commit', body: `
<p>O <code>pre-commit</code> roda ferramentas em hooks do git sobre os arquivos staged. Pega o problema em segundos, antes de virar uma execução vermelha de CI de cinco minutos. Mantenha só os hooks <em>rápidos</em> (format, lint, arquivos grandes, merge conflict); tipos e testes completos ficam no CI (ou no <code>pre-push</code>).</p>
<pre><code class="language-yaml"># .pre-commit-config.yaml
repos:
  - repo: https://github.com/astral-sh/ruff-pre-commit
    rev: v0.14.0          # fixe a versao e atualize com: pre-commit autoupdate
    hooks:
      - id: ruff-check
        args: [--fix]
      - id: ruff-format
  - repo: https://github.com/pre-commit/pre-commit-hooks
    rev: v5.0.0
    hooks:
      - id: check-merge-conflict
      - id: check-added-large-files
      - id: end-of-file-fixer
      - id: trailing-whitespace
      - id: check-toml
      - id: check-yaml</code></pre>
<pre><code class="language-bash">pip install pre-commit          # ou: uv tool install pre-commit
pre-commit install              # instala o hook no .git
pre-commit run --all-files      # roda em tudo (uso em CI e na adocao)
pre-commit autoupdate           # atualiza as versoes dos hooks</code></pre>
<p>Hooks locais são o gancho para ferramentas do projeto (<code>repo: local</code>, <code>language: system</code>). Lembre-se de que o hook local roda no laptop de cada pessoa e pode ser pulado com <code>git commit --no-verify</code>, então ele <em>complementa</em> o CI, nunca o substitui: o CI é a fonte da verdade. As versões das ferramentas no hook devem bater com as do ambiente de desenvolvimento, para não haver "passa aqui, falha lá".</p>` },
    { id: 'ci', title: 'CI de qualidade: um pipeline pequeno e determinístico', body: `
<p>O pipeline mínimo bloqueante: instalar com lockfile, lint, formatação, tipos, testes com cobertura. Cache do gerenciador de pacotes, matriz de versões do Python para bibliotecas, e jobs em paralelo para tempo total curto.</p>
<pre><code class="language-yaml"># .github/workflows/ci.yml
name: ci
on:
  push:
    branches: [main]
  pull_request:

jobs:
  qualidade:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        python: ["3.12", "3.13", "3.14"]
    steps:
      - uses: actions/checkout@v4
      - uses: astral-sh/setup-uv@v5
        with:
          enable-cache: true
      - run: uv python install $\{{ matrix.python }}
      - run: uv sync --all-extras --frozen
      - run: uv run ruff check .
      - run: uv run ruff format --check .
      - run: uv run mypy
      - run: uv run pytest --cov --cov-branch --cov-fail-under=85</code></pre>
<p>Boas práticas: <code>--frozen</code> (ou <code>pip install --require-hashes</code>) para builds reprodutíveis; ações fixadas por versão (ou por SHA, em ambientes sensíveis); permissões mínimas do token; segredos nunca em log; e o mesmo comando local e no CI (um <code>Makefile</code>, <code>justfile</code> ou <code>nox</code>/<code>tox</code> com os alvos <code>lint</code>, <code>types</code>, <code>test</code>). Execute a matriz de versões só onde importa (biblioteca pública); para aplicação, uma versão basta.</p>
<div class="callout tip"><strong>DICA</strong> Proteja a branch principal: merge só com CI verde e uma aprovação. O pipeline é o contrato da equipe; um check vermelho "ignorado" educa todo mundo a ignorar o próximo.</div>` },
    { id: 'complexidade', title: 'Métricas de complexidade: usar como sinal', body: `
<p>Complexidade ciclomática (McCabe) conta caminhos independentes: cada <code>if</code>, <code>for</code>, <code>while</code>, <code>except</code>, <code>and</code>/<code>or</code> soma um. Valores acima de 10 sugerem função difícil de testar (precisa de ao menos tantos testes quanto caminhos). A complexidade <em>cognitiva</em> (SonarSource) tenta medir esforço de leitura, penalizando aninhamento; no Ruff aparece em regras do pylint (PLR) e há <code>flake8-cognitive-complexity</code>.</p>
<pre><code class="language-bash">radon cc src -s -a        # complexidade por funcao, com nota A a F e media
radon mi src -s           # indice de manutenibilidade
wily build src &amp;&amp; wily report src/modulo.py cyclomatic.complexity   # evolucao no historico git
ruff check --select C901 --config 'lint.mccabe.max-complexity=8'</code></pre>
<pre><code class="language-python"># complexidade 6 (um caminho base + cinco decisoes): candidato a refatorar
def classificar(p):
    if p.idade &lt; 0 or p.idade &gt; 150:
        return "invalido"
    if p.idade &lt; 18:
        return "menor"
    elif p.idade &lt; 60:
        return "adulto" if p.ativo else "inativo"
    return "idoso"</code></pre>
<p>Use as métricas como <em>sinal</em>, não como meta (lei de Goodhart): números altos pedem investigação, não necessariamente mudança. Cruze com a frequência de alteração (hotspots, lição 21) para decidir onde refatorar primeiro. Limites rígidos no CI (por exemplo, complexidade máxima 10 para código novo) funcionam bem como freio para piorar, com <em>baseline</em> do legado.</p>` },
    { id: 'seguranca-deps', title: 'Segurança e dependências', body: `
<p>Qualidade inclui não entregar vulnerabilidades conhecidas. Camadas baratas e automatizáveis:</p>
<ul>
<li><strong>SAST</strong>: <code>bandit</code> (ou as regras <code>S</code> do Ruff) pega <code>eval</code>, <code>subprocess</code> com shell, SQL por f-string, <code>yaml.load</code> inseguro, senhas hardcoded.</li>
<li><strong>Dependências</strong>: <code>pip-audit</code> (PyPA) consulta bases de vulnerabilidade; Dependabot ou Renovate abrem PRs de atualização.</li>
<li><strong>Segredos</strong>: <code>gitleaks</code> ou <code>detect-secrets</code> no pre-commit e no CI.</li>
<li><strong>Cadeia de suprimentos</strong>: lockfile com hashes, publicação com <em>trusted publishing</em> (OIDC) no PyPI, SBOM quando exigido.</li>
</ul>
<pre><code class="language-bash">uv run pip-audit                         # vulnerabilidades nas dependencias instaladas
bandit -r src -ll                        # so severidade media ou alta
gitleaks detect --source . --no-banner   # segredos no historico
uv lock --upgrade-package requests       # atualiza uma dependencia de forma controlada</code></pre>
<pre><code class="language-python"># o que o bandit/Ruff S acusam
import subprocess, yaml

def ruim(cmd: str, cfg: str):
    subprocess.run(cmd, shell=True)       # S602: injecao de comando
    return yaml.load(cfg)                 # S506: carga insegura

def melhor(args: list[str], cfg: str):
    subprocess.run(args, check=True)      # lista, sem shell
    return yaml.safe_load(cfg)</code></pre>
<div class="callout"><strong>NA ENTREVISTA</strong> "Como você garante qualidade num time de 20 pessoas?" Resposta: padrões automáticos (format, lint, tipos) no pre-commit e no CI bloqueante, branch protegida, testes com piso de cobertura e mutação em módulos críticos, métricas de complexidade como alerta, dependências auditadas e atualizadas continuamente, e revisão humana focada em design. Cite que ferramenta não substitui julgamento.</div>` },
  ],
  whenToUse: [
    'Em todo repositório: Ruff (lint e format) e um checador de tipos configurados no pyproject.toml.',
    'pre-commit com hooks rápidos, e CI com a verificação completa e bloqueante.',
    'Baseline do legado com per-file-ignores e adoção gradual de regras.',
    'Métricas de complexidade e churn para escolher onde refatorar.',
    'pip-audit, bandit e detecção de segredos como camadas baratas de segurança.',
  ],
  whenNot: [
    'select = ["ALL"] sem curadoria: gera ruído e muda a cada versão da ferramenta.',
    'Duas ferramentas de formatação no mesmo projeto.',
    'Tratar métrica de complexidade ou cobertura como meta numérica.',
    'Depender só do pre-commit local: ele pode ser pulado; o CI é a fonte da verdade.',
    '# noqa e type: ignore genéricos para esconder problemas em vez de corrigi-los.',
  ],
  metrics: [
    'ruff check . e ruff format --check . (versão fixada) no CI',
    'mypy --strict ou pyright, com cache e versão fixada',
    'radon cc/mi, wily e C901 para tendência de complexidade',
    'pytest --cov --cov-branch --cov-fail-under e diff-cover em PR',
    'pip-audit, bandit, gitleaks; tempo total do pipeline como métrica de saúde',
  ],
  refs: [
    { type: 'doc', title: 'Ruff documentation', author: 'Astral', url: 'https://docs.astral.sh/ruff/', note: 'Regras por prefixo, configuração, formatador e integração.' },
    { type: 'doc', title: 'uv documentation', author: 'Astral', url: 'https://docs.astral.sh/uv/', note: 'Gerenciador de ambientes e dependências com lockfile.' },
    { type: 'doc', title: 'pre-commit', author: 'Anthony Sottile e colaboradores', url: 'https://pre-commit.com/', note: 'Framework de hooks, catálogo e configuração.' },
    { type: 'doc', title: 'mypy documentation', author: 'mypy', url: 'https://mypy.readthedocs.io/en/stable/', note: 'Configuração estrita e adoção gradual.' },
    { type: 'doc', title: 'Python Packaging User Guide', author: 'Python Packaging Authority', url: 'https://packaging.python.org/', note: 'pyproject.toml, lockfiles e publicação.' },
    { type: 'doc', title: 'pip-audit', author: 'Python Packaging Authority', url: 'https://github.com/pypa/pip-audit', note: 'Auditoria de vulnerabilidades em dependências.' },
    { type: 'doc', title: 'Bandit', author: 'PyCQA', url: 'https://bandit.readthedocs.io/', note: 'Análise estática de segurança para Python.' },
    { type: 'doc', title: 'radon', author: 'Michele Lacchia', url: 'https://radon.readthedocs.io/', note: 'Complexidade ciclomática e índice de manutenibilidade.' },
    { type: 'livro', title: 'Effective Python, 3rd ed.', author: 'Brett Slatkin', url: 'https://effectivepython.com/', note: 'Itens de boas práticas que as ferramentas ajudam a impor.' },
  ]
};
