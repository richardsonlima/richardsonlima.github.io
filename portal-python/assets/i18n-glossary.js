/* Vektia Python, PT -> EN dictionary for the Python glossary (192 entries: tags, names, definitions, page copy). */
(function () {
  if (!window.I18N) return;

  window.I18N.register({
    'Linguagem':
      'Language',
    'Idioma':
      'Idiom',
    'Tipagem':
      'Typing',
    'Arquitetura':
      'Architecture',
    'Concorrência':
      'Concurrency',
    'Dados':
      'Data',
    'Produção':
      'Production',
    'Classe do módulo abc que declara métodos abstratos. Subclasses concretas precisam implementá-los, senão a instanciação falha.':
      'A class from the abc module that declares abstract methods. Concrete subclasses must implement them, or instantiation fails.',
    'Converte a interface de uma classe na que o cliente espera. Em Python, muitas vezes uma função ou um wrapper fino resolve.':
      'Converts one class interface into the one the client expects. In Python, a function or a thin wrapper is often enough.',
    'Cluster de entidades tratado como unidade de consistência no DDD. Só a raiz é acessada de fora e define as invariantes.':
      'A cluster of entities treated as a consistency unit in DDD. Only the root is accessed from outside, and it enforces the invariants.',
    'Metadado de tipo em parâmetros, retornos e variáveis. Não é imposto em runtime; ferramentas como mypy e pyright o leem.':
      'Type metadata on parameters, returns and variables. Not enforced at runtime; tools like mypy and pyright read it.',
    'Formato colunar em memória, independente de linguagem. Permite compartilhar dados entre Pandas, Polars e DuckDB sem cópia.':
      'A language-independent columnar in-memory format. It lets Pandas, Polars and DuckDB share data without copying.',
    'Declara uma condição que deve ser verdadeira. Removido com python -O, então não serve para validar entrada de usuário.':
      'Declares a condition that must hold. Stripped with python -O, so it is not for validating user input.',
    'Função com async def e yield. Produz valores de forma assíncrona e é consumida com async for.':
      'A function with async def and yield. It produces values asynchronously and is consumed with async for.',
    'Biblioteca padrão de I/O concorrente em uma thread, baseada em event loop, coroutines e tasks.':
      'The standard library for single-thread concurrent I/O, built on an event loop, coroutines and tasks.',
    'Mecanismo para o consumidor frear o produtor quando não dá conta. Em asyncio, filas com maxsize são a forma básica.':
      'A way for a consumer to slow a producer that it cannot keep up with. In asyncio, queues with maxsize are the basic tool.',
    'Notação do crescimento do custo com o tamanho da entrada. Ignora constantes, que em Python costumam pesar muito.':
      'Notation for how cost grows with input size. It ignores constants, which often matter a lot in Python.',
    'Fronteira dentro da qual um modelo de domínio e sua linguagem ubíqua têm significado único. Unidade natural de serviço.':
      'A boundary within which a domain model and its ubiquitous language have a single meaning. A natural unit for a service.',
    'Separa abstração e implementação para variarem de forma independente, via composição em vez de herança.':
      'Separates abstraction from implementation so they vary independently, using composition instead of inheritance.',
    'Regra do NumPy para operar arrays de shapes diferentes alinhando dimensões pela direita, sem copiar dados.':
      'NumPy rule for operating on arrays of different shapes by aligning dimensions from the right, without copying data.',
    'Constrói objetos complexos passo a passo. Em Python, argumentos nomeados e dataclasses cobrem a maioria dos casos.':
      'Builds complex objects step by step. In Python, keyword arguments and dataclasses cover most cases.',
    'Instruções intermediárias geradas pelo compilador do CPython e executadas pela VM. Inspecionável com o módulo dis.':
      'Intermediate instructions produced by the CPython compiler and run by the VM. Inspectable with the dis module.',
    'Algoritmo de linearização que define a Method Resolution Order com herança múltipla. Preserva a ordem local e a monotonicidade.':
      'The linearization algorithm behind the Method Resolution Order under multiple inheritance. It preserves local order and monotonicity.',
    'Armazena resultados para evitar recomputar. Em Python, functools.cache e lru_cache cobrem funções puras.':
      'Stores results to avoid recomputing. In Python, functools.cache and lru_cache cover pure functions.',
    'Encadeia handlers: cada um trata a requisição ou a passa adiante. Base de middlewares.':
      'Chains handlers: each one handles the request or passes it on. The basis of middleware.',
    'Dependências apontam para dentro: regras de negócio no centro, frameworks e I/O nas bordas.':
      'Dependencies point inward: business rules at the center, frameworks and I/O at the edges.',
    'Função que captura variáveis do escopo onde foi definida, mantendo-as vivas após o escopo terminar.':
      'A function that captures variables from the scope where it was defined, keeping them alive after that scope ends.',
    'Sintoma de projeto fraco, como função longa ou classe deus. Não é bug, é convite à refatoração.':
      'A symptom of weak design, such as a long function or god class. Not a bug, an invitation to refactor.',
    'Encapsula uma ação como objeto, permitindo fila, log e desfazer. Em Python, um callable costuma bastar.':
      'Encapsulates an action as an object, enabling queues, logs and undo. In Python, a callable is often enough.',
    'Sintaxe compacta para construir list, dict, set ou generator a partir de um iterável, com filtro opcional.':
      'Compact syntax to build a list, dict, set or generator from an iterable, with an optional filter.',
    'Trata objetos individuais e composições de forma uniforme numa estrutura de árvore.':
      'Treats individual objects and compositions uniformly in a tree structure.',
    'Preferir montar comportamento com objetos colaboradores a herdar. Reduz acoplamento e hierarquias frágeis.':
      'Prefer assembling behavior from collaborating objects over inheriting it. Reduces coupling and brittle hierarchies.',
    'Lidar com várias tarefas em progresso ao mesmo tempo, mesmo que não executem simultaneamente. Difere de paralelismo.':
      'Handling multiple tasks in progress at once, even if they do not run simultaneously. Different from parallelism.',
    'Objeto com __enter__ e __exit__ usado no with. Garante limpeza de recursos mesmo com exceção.':
      'An object with __enter__ and __exit__ used by with. It guarantees resource cleanup even on exceptions.',
    'Variáveis com valor por contexto de execução. Substituem thread-local em código assíncrono.':
      'Variables with a value per execution context. They replace thread-locals in async code.',
    'Função definida com async def que pode suspender em await e retomar depois. Só roda quando agendada.':
      'A function defined with async def that can suspend at await and resume later. It only runs when scheduled.',
    'Implementação de referência do Python, escrita em C. Compila para bytecode e o executa numa VM.':
      'The reference implementation of Python, written in C. It compiles to bytecode and runs it on a VM.',
    'Command Query Responsibility Segregation. Separa o modelo de escrita do de leitura, que podem ter formas e stores distintos.':
      'Command Query Responsibility Segregation. Splits the write model from the read model, which can have different shapes and stores.',
    'Superconjunto de Python que compila para C. Tipos estáticos opcionais removem overhead do interpretador.':
      'A Python superset that compiles to C. Optional static types remove interpreter overhead.',
    'Biblioteca de computação paralela e lazy que escala APIs tipo Pandas e NumPy para vários cores ou um cluster.':
      'A lazy parallel computing library that scales Pandas and NumPy-like APIs to many cores or a cluster.',
    'Classe gerada por @dataclass com __init__, __repr__ e __eq__ automáticos. Suporta frozen, slots e order.':
      'A class generated by @dataclass with automatic __init__, __repr__ and __eq__. Supports frozen, slots and order.',
    'Duas ou mais tarefas esperando umas pelas outras para sempre, por locks adquiridos em ordens diferentes.':
      'Two or more tasks waiting on each other forever, because locks are acquired in different orders.',
    'Callable que recebe uma função e devolve outra, aplicado com @. Base de logging, cache, auth e registro.':
      'A callable that takes a function and returns another, applied with @. The basis of logging, caching, auth and registration.',
    'Adiciona responsabilidades a um objeto envolvendo-o numa classe com a mesma interface. Não confundir com @decorator.':
      'Adds responsibilities to an object by wrapping it in a class with the same interface. Not the same as @decorator.',
    'Dict que cria o valor padrão na primeira leitura de uma chave ausente. Ideal para agrupar e contar.':
      'A dict that creates a default value on first access of a missing key. Ideal for grouping and counting.',
    'Entregar as dependências de fora em vez de criá-las dentro. Em Python, argumentos e funções bastam, sem container.':
      'Passing dependencies in from outside instead of creating them inside. In Python, arguments and functions are enough, no container needed.',
    'Objeto com __get__, __set__ ou __delete__ atribuído a um atributo de classe. Base de property, métodos e slots.':
      'An object with __get__, __set__ or __delete__ assigned as a class attribute. The basis of property, methods and slots.',
    'Mapa hash que preserva a ordem de inserção desde o Python 3.7. Busca, inserção e remoção em O(1) médio.':
      'A hash map that preserves insertion order since Python 3.7. Average O(1) lookup, insert and delete.',
    'Fato relevante que aconteceu no domínio, nomeado no passado (PedidoCriado). Permite desacoplar reações.':
      'A relevant fact that happened in the domain, named in the past tense (OrderCreated). Lets reactions be decoupled.',
    'Objetos que expressam regras de negócio, sem depender de banco, framework ou I/O.':
      'Objects that express business rules, with no dependency on database, framework or I/O.',
    'Don\'t Repeat Yourself. Cada conhecimento tem uma representação única. Duplicação acidental é diferente de duplicação de código idêntico.':
      'Don\'t Repeat Yourself. Each piece of knowledge has a single representation. Accidental duplication differs from identical code.',
    'Se anda e grasna como pato, é pato: importa o comportamento, não a classe. Base do polimorfismo em Python.':
      'If it walks and quacks like a duck, it is a duck: behavior matters, not the class. The basis of polymorphism in Python.',
    'Banco analítico embutido e colunar, com SQL. Consulta Parquet, CSV e DataFrames direto, sem servidor.':
      'An embedded columnar analytical database with SQL. Queries Parquet, CSV and DataFrames directly, with no server.',
    'Métodos com duplo underscore, como __len__ e __add__, que o interpretador chama para dar suporte a sintaxe e protocolos.':
      'Double-underscore methods such as __len__ and __add__ that the interpreter calls to support syntax and protocols.',
    'Easier to Ask Forgiveness than Permission. Tentar e tratar a exceção, em vez de checar antes (LBYL).':
      'Easier to Ask Forgiveness than Permission. Try and handle the exception instead of checking first (LBYL).',
    'Objeto do domínio definido por identidade, não por valor. Dois pedidos iguais em dados ainda são pedidos distintos.':
      'A domain object defined by identity, not value. Two orders with equal data are still different orders.',
    'Conjunto fechado de constantes nomeadas. Evita strings mágicas e permite checagem exaustiva em match.':
      'A closed set of named constants. Avoids magic strings and enables exhaustive checks in match.',
    'Laço que agenda coroutines e callbacks e espera eventos de I/O. Cada tarefa cede o controle em await.':
      'A loop that schedules coroutines and callbacks and waits on I/O events. Each task yields control at await.',
    'Persistir a sequência de eventos em vez do estado atual. O estado é reconstruído reaplicando os eventos.':
      'Persisting the sequence of events instead of the current state. State is rebuilt by replaying the events.',
    'ExceptionGroup agrupa várias exceções simultâneas (PEP 654). Tratado com except*. Usado em TaskGroup.':
      'ExceptionGroup bundles several simultaneous exceptions (PEP 654). Handled with except*. Used by TaskGroup.',
    'Interface simples para um subsistema complexo. Esconde detalhes sem impedir acesso direto.':
      'A simple interface to a complex subsystem. Hides details without blocking direct access.',
    'Delega a criação de objetos a um método, que subclasses ou funções podem variar. Em Python, uma função fábrica costuma bastar.':
      'Delegates object creation to a method that subclasses or functions can vary. In Python, a factory function usually suffices.',
    'Framework web assíncrono baseado em type hints e Pydantic. Gera validação e OpenAPI automaticamente.':
      'An async web framework built on type hints and Pydantic. Generates validation and OpenAPI automatically.',
    'typing.Final marca nome que não deve ser reatribuído, e @final impede herança ou override. Imposto só pelo type checker.':
      'typing.Final marks a name that must not be reassigned, and @final blocks subclassing or override. Enforced by the type checker only.',
    'Compartilha estado imutável entre muitos objetos para economizar memória. Em Python, interning e slots ajudam.':
      'Shares immutable state among many objects to save memory. In Python, interning and slots help.',
    'Build do CPython sem GIL (PEP 703), com threads em paralelo real. Suportado oficialmente a partir do 3.14, ainda opcional.':
      'A CPython build without the GIL (PEP 703) with true parallel threads. Officially supported from 3.14, still optional.',
    'Dataclass com frozen=True: imutável após criação e hashable. Útil para value objects.':
      'A dataclass with frozen=True: immutable after creation and hashable. Useful for value objects.',
    'String literal com prefixo f que avalia expressões entre chaves. Mais legível e rápida que format e %.':
      'A string literal with an f prefix that evaluates expressions in braces. More readable and faster than format and %.',
    'Coletor de ciclos do CPython. Complementa a contagem de referências recolhendo objetos que se referenciam entre si.':
      'CPython\'s cycle collector. It complements reference counting by reclaiming objects that reference each other.',
    'Função com yield que produz valores sob demanda, mantendo estado entre chamadas. Memória constante.':
      'A function with yield that produces values on demand, keeping state between calls. Constant memory.',
    'Tipo parametrizado por outros tipos, como list[int]. Desde o 3.12, classe Box[T] usa sintaxe nativa (PEP 695).':
      'A type parameterized by other types, like list[int]. Since 3.12, class Box[T] uses native syntax (PEP 695).',
    'Global Interpreter Lock. Faz uma só thread executar bytecode por vez no CPython tradicional. Protege contagem de referências.':
      'Global Interpreter Lock. Lets only one thread execute bytecode at a time in traditional CPython. Protects reference counts.',
    'Objeto com __hash__ estável e __eq__ consistente. Necessário para chaves de dict e elementos de set.':
      'An object with a stable __hash__ and consistent __eq__. Required for dict keys and set elements.',
    'Ports and Adapters. O núcleo fala com o mundo por portas (interfaces) e adaptadores concretos plugam banco, web e filas.':
      'Ports and Adapters. The core talks to the world through ports (interfaces) and concrete adapters plug in database, web and queues.',
    'Função que recebe ou devolve funções. map, filter, sorted(key=) e decorators são exemplos.':
      'A function that takes or returns functions. map, filter, sorted(key=) and decorators are examples.',
    'Idempotência':
      'Idempotence',
    'Repetir a operação tem o mesmo efeito de executá-la uma vez. Essencial para retries seguros.':
      'Repeating the operation has the same effect as running it once. Essential for safe retries.',
    'Objetos que não mudam depois de criados (tuple, frozenset, str). Simplifica raciocínio e concorrência.':
      'Objects that do not change after creation (tuple, frozenset, str). Simplifies reasoning and concurrency.',
    'Mecanismo que localiza, carrega e cacheia módulos em sys.modules, usando finders e loaders.':
      'The mechanism that locates, loads and caches modules in sys.modules, using finders and loaders.',
    'ISP. Clientes não devem depender de métodos que não usam. Prefira Protocols pequenos e focados.':
      'ISP. Clients should not depend on methods they do not use. Prefer small, focused Protocols.',
    'Quem chama o seu código é o framework, não o contrário. Generaliza a injeção de dependência.':
      'The framework calls your code, not the other way around. Generalizes dependency injection.',
    'Objeto que implementa __iter__ (ou __getitem__) e pode ser percorrido por for. Devolve um iterator.':
      'An object that implements __iter__ (or __getitem__) and can be looped over by for. Returns an iterator.',
    'Objeto com __next__ que entrega um item por vez e levanta StopIteration no fim. Consumível uma vez.':
      'An object with __next__ that yields one item at a time and raises StopIteration at the end. Single-use.',
    'Módulo de building blocks de iteradores lazy: chain, islice, groupby, batched, product, entre outros.':
      'A module of lazy iterator building blocks: chain, islice, groupby, batched, product, among others.',
    'Compilação em tempo de execução. O CPython 3.13 trouxe um JIT experimental (PEP 744), desligado por padrão.':
      'Compilation at run time. CPython 3.13 shipped an experimental JIT (PEP 744), off by default.',
    'Keep It Simple. Prefira a solução mais simples que resolve o problema atual.':
      'Keep It Simple. Prefer the simplest solution that solves the current problem.',
    'Função anônima de uma única expressão. Boa para key= curto; para o resto, prefira def.':
      'An anonymous function of a single expression. Good for short key=; otherwise prefer def.',
    'Fale só com amigos imediatos: evite cadeias a.b.c.d(). Reduz acoplamento a estruturas internas.':
      'Talk only to immediate friends: avoid chains like a.b.c.d(). Reduces coupling to internal structures.',
    'Adiar o cálculo até o valor ser necessário. Generators, iteradores e o modo lazy do Polars seguem essa ideia.':
      'Delaying computation until the value is needed. Generators, iterators and Polars lazy mode follow this idea.',
    'Look Before You Leap. Checar condições antes de agir, em oposição ao EAFP. Pode sofrer com race conditions.':
      'Look Before You Leap. Check conditions before acting, as opposed to EAFP. Can suffer from race conditions.',
    'LSP. Um subtipo deve poder substituir o tipo base sem quebrar quem o usa. Herdar não basta, o contrato precisa valer.':
      'LSP. A subtype must be usable wherever its base type is expected without breaking callers. Inheriting is not enough, the contract must hold.',
    'Sequência mutável e dinâmica. Acesso por índice em O(1), append amortizado O(1), inserção no início O(n).':
      'A mutable dynamic sequence. O(1) index access, amortized O(1) append, O(n) insert at the front.',
    'Primitiva de exclusão mútua. Só uma thread por vez entra na seção crítica. Use with lock para liberar sempre.':
      'A mutual exclusion primitive. Only one thread at a time enters the critical section. Use with lock to always release.',
    'Módulo padrão de registro com níveis, handlers e formatters. Prefira logging a print em qualquer serviço.':
      'The standard logging module with levels, handlers and formatters. Prefer logging over print in any service.',
    'Outro nome para dunder method. Define como o objeto reage a operadores, len(), with, iteração e mais.':
      'Another name for dunder method. Defines how the object reacts to operators, len(), with, iteration and more.',
    'Tipo de dado de coluna ou array (int32, float64, category). Escolher dtype menor reduz memória e acelera.':
      'The data type of a column or array (int32, float64, category). A smaller dtype cuts memory and speeds things up.',
    'Pattern matching estrutural (PEP 634, Python 3.10). Casa forma e conteúdo de dados, não só valores.':
      'Structural pattern matching (PEP 634, Python 3.10). Matches the shape and content of data, not just values.',
    'Guardar o resultado de uma função para as mesmas entradas. functools.cache faz isso para funções puras.':
      'Storing a function result for the same inputs. functools.cache does this for pure functions.',
    'Arquivo mapeado no espaço de endereços via mmap. Permite acessar dados grandes sem carregá-los inteiros.':
      'A file mapped into the address space via mmap. Lets you access large data without loading it all.',
    'Roteia comandos e eventos para seus handlers, desacoplando quem emite de quem reage.':
      'Routes commands and events to their handlers, decoupling who emits from who reacts.',
    'A classe de uma classe. type é a metaclasse padrão. Raro em código de aplicação, comum em frameworks.':
      'The class of a class. type is the default metaclass. Rare in application code, common in frameworks.',
    'Serviços pequenos, independentes e implantáveis separadamente. Trocam simplicidade local por complexidade distribuída.':
      'Small, independent, separately deployable services. They trade local simplicity for distributed complexity.',
    'Um único deploy com módulos de fronteiras claras. Frequentemente o melhor ponto de partida antes de microsserviços.':
      'A single deploy with clearly bounded modules. Often the best starting point before microservices.',
    'Alterar classes ou módulos em runtime. Poderoso para testes e hotfix, perigoso por esconder mudanças globais.':
      'Changing classes or modules at runtime. Powerful for tests and hotfixes, dangerous because it hides global changes.',
    'Method Resolution Order. Ordem em que as classes são consultadas para achar um atributo. Visível em Classe.__mro__.':
      'Method Resolution Order. The order in which classes are searched for an attribute. Visible in Class.__mro__.',
    'Módulo que roda processos separados, cada um com seu GIL. Paralelismo real para CPU, ao custo de serializar dados.':
      'A module that runs separate processes, each with its own GIL. True parallelism for CPU work, at the cost of serializing data.',
    'Armadilha clássica: def f(x=[]) reaproveita a mesma lista entre chamadas. Use None e crie dentro.':
      'A classic trap: def f(x=[]) reuses the same list across calls. Use None and create it inside.',
    'Type checker estático clássico do Python. Alternativas incluem pyright, pyrefly e ty.':
      'The classic static type checker for Python. Alternatives include pyright, pyrefly and ty.',
    'Mapeamento de nomes para objetos: local, enclosing, global e builtin (regra LEGB).':
      'A mapping of names to objects: local, enclosing, global and builtin (the LEGB rule).',
    'Type checker refina o tipo dentro de um ramo (isinstance, is None, match). TypeGuard e TypeIs estendem a ideia.':
      'The type checker refines a type inside a branch (isinstance, is None, match). TypeGuard and TypeIs extend the idea.',
    'Tipo bottom: nunca retorna ou nunca ocorre. Usado em assert_never para checar exaustividade.':
      'The bottom type: never returns or never occurs. Used by assert_never to check exhaustiveness.',
    'Compilador JIT baseado em LLVM que acelera funções numéricas com NumPy via @njit.':
      'An LLVM-based JIT compiler that speeds up numeric NumPy functions via @njit.',
    'Biblioteca de arrays n-dimensionais homogêneos com operações vetorizadas em C. Base de quase todo o ecossistema científico.':
      'A library of homogeneous n-dimensional arrays with vectorized C operations. The base of nearly the whole scientific ecosystem.',
    'Sujeito notifica assinantes quando muda. Em Python, listas de callbacks ou sinais fazem o papel.':
      'A subject notifies subscribers when it changes. In Python, callback lists or signals fill the role.',
    'Open/Closed Principle. Aberto para extensão, fechado para modificação: novo comportamento sem editar código estável.':
      'Open/Closed Principle. Open for extension, closed for modification: new behavior without editing stable code.',
    'Definir o que +, ==, [] e outros fazem para seus tipos via dunder methods. Use quando a semântica for óbvia.':
      'Defining what +, ==, [] and others do for your types via dunder methods. Use it when the semantics are obvious.',
    'Optional[X] equivale a X | None. Não significa argumento opcional, significa que o valor pode ser None.':
      'Optional[X] equals X | None. It does not mean an optional argument, it means the value may be None.',
    'Object-Relational Mapper, como SQLAlchemy. Mapeia tabelas para objetos. Conveniente, mas vaza abstração em queries complexas.':
      'Object-Relational Mapper, such as SQLAlchemy. Maps tables to objects. Convenient, but leaks the abstraction in complex queries.',
    'Processar dados maiores que a RAM lendo em blocos ou em streaming, sem carregar tudo de uma vez.':
      'Processing data larger than RAM by reading in chunks or streaming, without loading everything at once.',
    '@typing.overload declara assinaturas alternativas para o type checker. A implementação real é uma só.':
      '@typing.overload declares alternative signatures for the type checker. There is only one real implementation.',
    'Biblioteca de DataFrames em memória. Ótima ergonomia; atenção a dtypes, cópias e uso de memória.':
      'An in-memory DataFrame library. Great ergonomics; watch dtypes, copies and memory use.',
    'Formato de arquivo colunar comprimido. Lê só as colunas pedidas e usa statistics para pular blocos.':
      'A compressed columnar file format. Reads only the requested columns and uses statistics to skip blocks.',
    'Divisão dos dados em pedaços por chave ou intervalo. Habilita paralelismo e leitura seletiva (partition pruning).':
      'Splitting data into pieces by key or range. Enables parallelism and selective reads (partition pruning).',
    'Módulo com a classe Path para manipular caminhos de forma orientada a objetos e portátil.':
      'A module with the Path class for object-oriented, portable path handling.',
    'Python Enhancement Proposal. Documento que propõe e registra mudanças na linguagem. PEP 8 é o guia de estilo.':
      'Python Enhancement Proposal. A document that proposes and records changes to the language. PEP 8 is the style guide.',
    'Guia de estilo oficial: indentação, nomes, linhas, imports. Automatize com ruff ou black.':
      'The official style guide: indentation, names, lines, imports. Automate it with ruff or black.',
    'Instalador padrão de pacotes. Instala wheels do PyPI e resolve dependências.':
      'The standard package installer. Installs wheels from PyPI and resolves dependencies.',
    'Biblioteca de DataFrames em Rust, colunar, com API lazy e otimizador de queries. Paralela por padrão.':
      'A Rust DataFrame library, columnar, with a lazy API and query optimizer. Parallel by default.',
    'Mesma interface, comportamentos diferentes. Em Python, vem de herança, Protocols e duck typing.':
      'Same interface, different behaviors. In Python, it comes from inheritance, Protocols and duck typing.',
    'Interface que o núcleo define para falar com o exterior (ex.: RepositorioDePedidos). Adapters a implementam.':
      'An interface the core defines to talk to the outside (e.g. OrderRepository). Adapters implement it.',
    'Medir onde o tempo ou a memória vai. cProfile, py-spy e scalene mostram os gargalos reais antes de otimizar.':
      'Measuring where time or memory goes. cProfile, py-spy and scalene show real bottlenecks before you optimize.',
    'Atributo calculado com @property. Permite começar com atributo simples e adicionar validação depois sem quebrar a API.':
      'A computed attribute with @property. Lets you start with a plain attribute and add validation later without breaking the API.',
    'Tipagem estrutural (PEP 544): qualquer classe com os métodos certos satisfaz, sem herdar. Duck typing verificável.':
      'Structural typing (PEP 544): any class with the right methods satisfies it, without inheriting. Checkable duck typing.',
    'Cria objetos clonando uma instância existente. Em Python, copy.copy e copy.deepcopy resolvem.':
      'Creates objects by cloning an existing instance. In Python, copy.copy and copy.deepcopy do the job.',
    'Substituto que controla o acesso a outro objeto: lazy loading, cache, controle de acesso, remoto.':
      'A stand-in that controls access to another object: lazy loading, caching, access control, remote.',
    'Biblioteca de validação e parsing de dados guiada por type hints. Base do FastAPI e de configuração tipada.':
      'A data validation and parsing library driven by type hints. The base of FastAPI and typed configuration.',
    'Bindings Rust para Python. Permite escrever extensões nativas seguras em Rust, empacotadas com maturin.':
      'Rust bindings for Python. Lets you write safe native extensions in Rust, packaged with maturin.',
    'Arquivo central de configuração do projeto: metadados, dependências e ferramentas (PEP 621).':
      'The central project configuration file: metadata, dependencies and tools (PEP 621).',
    'Framework de testes com asserts simples, fixtures, parametrize e plugins. Padrão de fato.':
      'A testing framework with plain asserts, fixtures, parametrize and plugins. The de facto standard.',
    'Python Package Index, o repositório público de pacotes. Publicação com twine ou trusted publishing.':
      'The Python Package Index, the public package repository. Publish with twine or trusted publishing.',
    'Resultado que depende da ordem de execução de threads ou tasks. Corrija com locks, filas ou imutabilidade.':
      'A result that depends on the execution order of threads or tasks. Fix with locks, queues or immutability.',
    'Framework de computação distribuída para Python: tasks, actors e bibliotecas para dados e ML em cluster.':
      'A distributed computing framework for Python: tasks, actors and libraries for data and ML on a cluster.',
    'Cada objeto conta quantas referências tem e é liberado ao chegar a zero. É a base da gestão de memória do CPython.':
      'Each object counts its references and is freed when it reaches zero. The basis of CPython memory management.',
    'Mudar a estrutura do código sem mudar o comportamento, protegido por testes.':
      'Changing code structure without changing behavior, protected by tests.',
    'Abstração que faz a persistência parecer uma coleção de objetos de domínio. Isola o modelo do banco.':
      'An abstraction that makes persistence look like a collection of domain objects. Isolates the model from the database.',
    'Tentar de novo após falha transitória, com backoff exponencial e jitter. Só é seguro com operações idempotentes.':
      'Trying again after a transient failure, with exponential backoff and jitter. Only safe with idempotent operations.',
    'Linguagem de sistemas com segurança de memória. Cada vez mais usada para ferramentas e extensões Python (ruff, Polars, uv).':
      'A memory-safe systems language. Increasingly used for Python tools and extensions (ruff, Polars, uv).',
    'Linter e formatter extremamente rápido escrito em Rust. Substitui flake8, isort e black na maioria dos projetos.':
      'An extremely fast linter and formatter written in Rust. Replaces flake8, isort and black in most projects.',
    'Sequência de transações locais com compensações para manter consistência entre serviços sem transação distribuída.':
      'A sequence of local transactions with compensations that keeps services consistent without a distributed transaction.',
    'Região do código em que um nome é visível. Regra LEGB: local, enclosing, global, builtin.':
      'The region of code where a name is visible. LEGB rule: local, enclosing, global, builtin.',
    'Contador que limita quantas tarefas entram ao mesmo tempo num trecho. Útil para limitar concorrência de I/O.':
      'A counter that limits how many tasks enter a section at once. Useful to cap I/O concurrency.',
    'Camada que orquestra casos de uso: carrega agregados, chama o domínio e confirma a transação.':
      'A layer that orchestrates use cases: loads aggregates, calls the domain and commits the transaction.',
    'Coleção não ordenada de elementos hashable únicos. Teste de pertinência em O(1) médio e operações de conjunto.':
      'An unordered collection of unique hashable elements. Average O(1) membership test and set operations.',
    'Redistribuição de dados entre partições ou nós para agrupar por chave. Etapa cara em Spark, Dask e Ray.':
      'Redistributing data across partitions or nodes to group by key. An expensive step in Spark, Dask and Ray.',
    'SRP. Uma classe deve ter um único motivo para mudar. Responsabilidade é um eixo de mudança, não uma contagem de métodos.':
      'SRP. A class should have a single reason to change. Responsibility is an axis of change, not a method count.',
    'Garante uma única instância. Em Python, um módulo já é singleton; o padrão raramente é necessário.':
      'Ensures a single instance. In Python, a module is already a singleton; the pattern is rarely needed.',
    'Sintaxe seq[ini:fim:passo] que devolve uma nova sequência. Em NumPy, devolve uma view, não uma cópia.':
      'The seq[start:stop:step] syntax that returns a new sequence. In NumPy, it returns a view, not a copy.',
    '__slots__ troca o __dict__ por campos fixos. Reduz memória e acelera acesso, ao custo de flexibilidade.':
      '__slots__ replaces __dict__ with fixed fields. Cuts memory and speeds access, at the cost of flexibility.',
    'Cinco princípios de design OO: SRP, OCP, LSP, ISP e DIP. Servem como guia de trade-offs, não como lei.':
      'Five OO design principles: SRP, OCP, LSP, ISP and DIP. A guide to trade-offs, not a law.',
    'Engine distribuída de processamento de dados. O PySpark expõe DataFrames e SQL sobre um cluster.':
      'A distributed data processing engine. PySpark exposes DataFrames and SQL over a cluster.',
    'Toolkit SQL e ORM de referência em Python. Separa Core (SQL expressivo) de ORM (mapeamento de objetos).':
      'The reference SQL toolkit and ORM in Python. Separates Core (expressive SQL) from ORM (object mapping).',
    'Objeto muda de comportamento conforme seu estado interno. Em Python, enums, dicts de funções ou classes por estado.':
      'An object changes behavior with its internal state. In Python, enums, dicts of functions or one class per state.',
    'Família de algoritmos intercambiáveis atrás de uma interface. Em Python, passar uma função costuma ser suficiente.':
      'A family of interchangeable algorithms behind one interface. In Python, passing a function is usually enough.',
    'Compatibilidade de tipos pela forma (métodos e atributos) em vez da herança declarada. É o que Protocol expressa.':
      'Type compatibility by shape (methods and attributes) rather than declared inheritance. What Protocol expresses.',
    'Logs em pares chave-valor, normalmente JSON, fáceis de filtrar e agregar. Inclui correlation id.':
      'Logs as key-value pairs, usually JSON, easy to filter and aggregate. Include a correlation id.',
    'Devolve um proxy que delega ao próximo na MRO, não necessariamente ao pai direto. Essencial em herança múltipla cooperativa.':
      'Returns a proxy that delegates to the next class in the MRO, not necessarily the direct parent. Essential in cooperative multiple inheritance.',
    'Envolve uma coroutine para executá-la no event loop. Criada com asyncio.create_task ou TaskGroup.':
      'Wraps a coroutine to run it on the event loop. Created with asyncio.create_task or TaskGroup.',
    'Concorrência estruturada no asyncio (3.11): as tasks filhas terminam antes de sair do bloco e erros viram ExceptionGroup.':
      'Structured concurrency in asyncio (3.11): child tasks finish before the block exits and errors become an ExceptionGroup.',
    'Test-Driven Development. Escrever o teste que falha, fazer passar com o mínimo, refatorar. Ciclo vermelho, verde, refatorar.':
      'Test-Driven Development. Write the failing test, make it pass with the minimum, refactor. Red, green, refactor.',
    'Esqueleto de algoritmo na classe base com passos que subclasses preenchem. Alternativa pythônica: passar funções.':
      'An algorithm skeleton in the base class with steps subclasses fill in. A Pythonic alternative: pass functions.',
    'Substituto de dependência em teste: dummy, stub, spy, mock ou fake. Prefira fakes simples a mocks frágeis.':
      'A dependency stand-in in tests: dummy, stub, spy, mock or fake. Prefer simple fakes over brittle mocks.',
    'Fluxo de execução dentro de um processo, com memória compartilhada. Bom para I/O; para CPU, o GIL limita o ganho.':
      'A flow of execution inside a process with shared memory. Good for I/O; for CPU work the GIL limits the gain.',
    'Código que se comporta corretamente com várias threads. Exige sincronização ou estruturas imutáveis.':
      'Code that behaves correctly with multiple threads. Requires synchronization or immutable structures.',
    'Sequência imutável e hashable (se os itens forem). Usada para registros leves e retorno múltiplo.':
      'An immutable, hashable sequence (if its items are). Used for lightweight records and multiple returns.',
    'Descreve a forma de um dict com chaves conhecidas para o type checker. Em runtime continua sendo um dict.':
      'Describes the shape of a dict with known keys for the type checker. At runtime it is still a dict.',
    'Nome para um tipo complexo. Desde o 3.12, a instrução type X = ... define aliases (PEP 695).':
      'A name for a complex type. Since 3.12, the type X = ... statement defines aliases (PEP 695).',
    'Anotação de tipo (PEP 484). Não altera a execução, mas habilita checagem estática e melhor autocomplete.':
      'A type annotation (PEP 484). It does not change execution, but enables static checking and better autocomplete.',
    'Variável de tipo para funções e classes genéricas. Pode ter bound e constraints. Sintaxe nativa desde o 3.12.':
      'A type variable for generic functions and classes. Can have a bound and constraints. Native syntax since 3.12.',
    'Tipo que aceita um entre vários, escrito X | Y desde o 3.10.':
      'A type that accepts one of several, written X | Y since 3.10.',
    'Agrupa operações de persistência numa transação única, confirmada ou revertida em bloco. Costuma ser um context manager.':
      'Groups persistence operations into a single transaction, committed or rolled back as a whole. Often a context manager.',
    'Gerenciador de pacotes, ambientes e versões de Python escrito em Rust, muito mais rápido que o pip.':
      'A package, environment and Python version manager written in Rust, much faster than pip.',
    'Objeto do domínio definido apenas pelos valores e imutável (Dinheiro, Endereço). Dois com os mesmos dados são iguais.':
      'A domain object defined only by its values and immutable (Money, Address). Two with the same data are equal.',
    'Vectorização':
      'Vectorization',
    'Aplicar operações a arrays inteiros em código C, em vez de loops Python. Costuma dar ordens de grandeza de ganho.':
      'Applying operations to whole arrays in C code instead of Python loops. Often yields orders of magnitude gains.',
    'Ambiente isolado com seu próprio interpretador e pacotes (venv). Evita conflito de dependências entre projetos.':
      'An isolated environment with its own interpreter and packages (venv). Avoids dependency conflicts between projects.',
    'Separa algoritmos da estrutura de objetos sobre a qual operam. Em Python, functools.singledispatch e match costumam substituir.':
      'Separates algorithms from the object structure they operate on. In Python, functools.singledispatch and match often replace it.',
    'Formato binário de distribuição (.whl). Instala sem compilar, o que torna pip install rápido e reproduzível.':
      'A binary distribution format (.whl). Installs without compiling, making pip install fast and reproducible.',
    'Desde o 3.11, entrar num try não custa nada quando nenhuma exceção ocorre. Levantar e tratar continua caro.':
      'Since 3.11, entering a try costs nothing when no exception occurs. Raising and handling remains expensive.',
    'Desde o 3.11 (PEP 659), o interpretador adapta o bytecode a tipos observados em runtime, acelerando laços quentes.':
      'Since 3.11 (PEP 659), the interpreter adapts bytecode to types observed at runtime, speeding up hot loops.',
    'Interpretador isolado dentro do processo, com GIL próprio (PEP 684). Acessível via concurrent.interpreters no 3.14.':
      'An isolated interpreter inside the process with its own GIL (PEP 684). Available via concurrent.interpreters in 3.14.',
    'Capacidade de entender o sistema por logs, métricas e traces. OpenTelemetry é o padrão aberto.':
      'The ability to understand a system through logs, metrics and traces. OpenTelemetry is the open standard.',
    'Guarda cada coluna contígua. Acelera agregações e compressão, ideal para análise, pior para escritas por linha.':
      'Stores each column contiguously. Speeds up aggregations and compression, ideal for analytics, worse for row-wise writes.',
    'Aplicar filtros o mais perto possível da leitura, para não carregar dados descartados. Parquet, Polars e DuckDB fazem.':
      'Applying filters as close to the read as possible, so discarded data is never loaded. Parquet, Polars and DuckDB do it.',
    'Compartilhar dados até alguém alterá-los, só então copiando. O Pandas 3 adota CoW como comportamento padrão.':
      'Share data until someone modifies it, copying only then. Pandas 3 makes CoW the default behavior.',
    'Compartilhar buffers de memória sem copiá-los, como faz o Arrow entre bibliotecas. Memoryview e buffer protocol seguem a ideia.':
      'Sharing memory buffers without copying them, as Arrow does between libraries. memoryview and the buffer protocol follow the idea.',
    'Comprehension lazy entre parênteses. Produz itens sob demanda, sem montar a lista na memória.':
      'A lazy comprehension in parentheses. Produces items on demand, without building the list in memory.',
    'Testar propriedades gerais com entradas geradas automaticamente (Hypothesis), em vez de exemplos fixos.':
      'Testing general properties with automatically generated inputs (Hypothesis), instead of fixed examples.',
    'Método declarado com @abstractmethod que subclasses concretas devem implementar. Define o contrato da ABC.':
      'A method declared with @abstractmethod that concrete subclasses must implement. Defines the ABC contract.',
    'Classe pequena que adiciona comportamento por herança múltipla, sem ser um tipo completo por si.':
      'A small class that adds behavior via multiple inheritance, without being a full type on its own.',
    'DIP. Módulos de alto nível dependem de abstrações, não de detalhes. Protocols e injeção por argumento aplicam isso.':
      'DIP. High-level modules depend on abstractions, not details. Protocols and argument injection apply it.',
    'Camada que traduz entre um sistema legado ou externo e o seu modelo, protegendo o domínio de conceitos alheios.':
      'A layer that translates between a legacy or external system and your model, shielding the domain from foreign concepts.',
    'Glossário de Python, Vektia':
      'Python Glossary, Vektia',
    'Índice · 192 termos':
      'Index · 192 terms',
    'Glossário de Python':
      'Python Glossary',
    'Os termos que aparecem em entrevista, code review e na leitura de PEPs e documentação, cada um definido em uma linha. Uma dica que funciona: releia tudo uma vez por semana. Custa pouco tempo e fixa o vocabulário.':
      'The terms that come up in interviews, code reviews and when reading PEPs and documentation, each defined in one line. A tip that works: reread everything once a week. It costs little time and locks in the vocabulary.',
    'Buscar termo: \'GIL\', \'decorator\', \'Protocol\', \'asyncio\'...':
      'Search term: \'GIL\', \'decorator\', \'Protocol\', \'asyncio\'...',
    'Nenhum termo encontrado.':
      'No terms found.',
    'termo':
      'term',
    'termos':
      'terms',
  });
})();
