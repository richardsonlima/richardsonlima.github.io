/* Lesson catalog, single source of truth for trilha + export
   Used by: curriculum.html (render trilha), lesson.html (prev/next), portal.js (export markdown)
*/
window.LESSON_CATALOG = [
  {
    n: 1, slug: 'etapa-1', title: 'Fundamentos da linguagem',
    sub: 'O modelo de execução e de objetos do Python. Quem entende nomes, referências e mutabilidade não tropeça no resto.',
    lessons: [
      { id: 'python-ambiente',  idx: '01', title: 'Ambiente moderno',             desc: 'Versões, uv, venv, pyproject.toml, lockfiles, layout src/', time: '60 min' },
      { id: 'modelo-de-dados',  idx: '02', title: 'Objetos, nomes e mutabilidade', desc: 'Tudo é objeto, identidade vs igualdade, referências, cópia rasa e profunda', time: '75 min' },
      { id: 'tipos-builtin',    idx: '03', title: 'Números, strings e bytes',     desc: 'int arbitrário, float IEEE 754, Decimal, Unicode, encodings, f-strings', time: '60 min' },
      { id: 'colecoes',         idx: '04', title: 'Coleções e complexidade',      desc: 'list, tuple, dict, set, deque, custo Big-O de cada operação', time: '75 min' },
      { id: 'controle-funcoes', idx: '05', title: 'Controle de fluxo e funções',  desc: 'Argumentos posicionais, nomeados, *args, **kwargs, defaults mutáveis', time: '60 min' },
      { id: 'modulos-pacotes',  idx: '06', title: 'Módulos, pacotes e imports',   desc: 'Sistema de import, sys.path, pacotes, __init__, imports circulares', time: '60 min' },
    ]
  },
  {
    n: 2, slug: 'etapa-2', title: 'Python idiomático',
    sub: 'Escrever Python como Python, não como Java com outra sintaxe. Protocolos, geradores, decorators e context managers.',
    lessons: [
      { id: 'iteradores-geradores', idx: '07', title: 'Iteradores e geradores',      desc: 'Protocolo de iteração, yield, yield from, avaliação preguiçosa, itertools', time: '75 min' },
      { id: 'comprehensions',       idx: '08', title: 'Comprehensions',              desc: 'List, dict, set comprehensions e generator expressions, quando não usar', time: '45 min' },
      { id: 'closures-escopo',      idx: '09', title: 'Escopo, closures e funções',  desc: 'LEGB, nonlocal, funções de primeira classe, functools.partial', time: '60 min' },
      { id: 'decorators',           idx: '10', title: 'Decorators',                  desc: 'Decorators com e sem argumentos, functools.wraps, decorators de classe', time: '75 min' },
      { id: 'context-managers',     idx: '11', title: 'Context managers',            desc: 'with, __enter__/__exit__, contextlib, ExitStack, gestão de recursos', time: '60 min' },
      { id: 'dunder-methods',       idx: '12', title: 'Data model e métodos especiais', desc: '__repr__, __eq__, __hash__, operadores, descritores, __getattr__', time: '90 min' },
    ]
  },
  {
    n: 3, slug: 'etapa-3', title: 'OOP & tipagem',
    sub: 'Objetos bem desenhados e contratos explícitos. Tipagem gradual que vira documentação executável e pega bug antes do deploy.',
    lessons: [
      { id: 'classes-oop',       idx: '13', title: 'Classes, herança e MRO',        desc: 'Atributos de classe e instância, super(), C3 linearization, mixins', time: '75 min' },
      { id: 'dataclasses-pydantic', idx: '14', title: 'Dataclasses, attrs e Pydantic', desc: 'Value objects, frozen, slots, validação na borda, quando usar cada um', time: '75 min' },
      { id: 'protocols-abc',     idx: '15', title: 'ABCs e Protocols',              desc: 'Interfaces nominais vs estruturais, duck typing com contrato', time: '60 min' },
      { id: 'type-hints',        idx: '16', title: 'Type hints e checagem estática', desc: 'Anotações, Optional, Union, mypy, pyright, tipagem gradual', time: '75 min' },
      { id: 'generics-avancado', idx: '17', title: 'Generics e tipagem avançada',   desc: 'TypeVar, ParamSpec, overload, Self, TypedDict, sintaxe PEP 695', time: '75 min' },
      { id: 'pattern-matching',  idx: '18', title: 'Enums e pattern matching',      desc: 'Enum, match/case estrutural, guards, exaustividade com assert_never', time: '60 min' },
    ]
  },
  {
    n: 4, slug: 'etapa-4', title: 'Clean Code',
    sub: 'Código é lido dez vezes mais do que é escrito. Nomes, funções, erros, testes e ferramentas que mantêm a base saudável.',
    lessons: [
      { id: 'clean-naming',     idx: '19', title: 'Nomes e funções limpas',        desc: 'Nomes reveladores, funções pequenas, um nível de abstração, PEP 8 e PEP 20', time: '60 min' },
      { id: 'clean-errors',     idx: '20', title: 'Erros e exceções',              desc: 'EAFP vs LBYL, hierarquia de exceções, ExceptionGroup, falhar cedo', time: '60 min' },
      { id: 'code-smells',      idx: '21', title: 'Code smells e refactoring',     desc: 'Catálogo de smells, refactorings seguros, dívida técnica', time: '75 min' },
      { id: 'pytest-testes',    idx: '22', title: 'Testes com pytest',             desc: 'Fixtures, parametrize, pirâmide de testes, cobertura, property-based', time: '90 min' },
      { id: 'tdd-test-doubles', idx: '23', title: 'TDD e test doubles',            desc: 'Red-green-refactor, mocks, stubs, fakes, quando mock vira problema', time: '75 min' },
      { id: 'tooling-qualidade', idx: '24', title: 'Ferramentas de qualidade',     desc: 'Ruff, mypy, pre-commit, CI de qualidade, métricas de complexidade', time: '60 min' },
    ]
  },
  {
    n: 5, slug: 'etapa-5', title: 'SOLID & princípios',
    sub: 'Os cinco princípios de Robert C. Martin traduzidos para Python, mais os princípios que impedem o overengineering.',
    lessons: [
      { id: 'srp',               idx: '25', title: 'Single Responsibility',        desc: 'Uma razão para mudar, coesão, separar política de detalhe', time: '60 min' },
      { id: 'ocp',               idx: '26', title: 'Open/Closed',                  desc: 'Extensão sem modificação, plugins, registro de estratégias', time: '60 min' },
      { id: 'lsp',               idx: '27', title: 'Liskov Substitution',          desc: 'Subtipos honestos, contratos, pré e pós-condições, quadrado vs retângulo', time: '60 min' },
      { id: 'isp',               idx: '28', title: 'Interface Segregation',        desc: 'Protocols pequenos, clientes não dependem do que não usam', time: '45 min' },
      { id: 'dip',               idx: '29', title: 'Dependency Inversion',         desc: 'Depender de abstrações, injeção por construtor, inversão do fluxo', time: '60 min' },
      { id: 'principios-design', idx: '30', title: 'DRY, KISS, YAGNI e composição', desc: 'Composição sobre herança, Lei de Demeter, acoplamento e coesão', time: '60 min' },
    ]
  },
  {
    n: 6, slug: 'etapa-6', title: 'Design patterns criacionais',
    sub: 'Como os objetos nascem. Os padrões do GoF vistos com olhos de Python: muitos viram uma função, alguns continuam valiosos.',
    lessons: [
      { id: 'factory-method',   idx: '31', title: 'Factory Method',               desc: 'Construtores alternativos, classmethod, registro de fábricas', time: '60 min' },
      { id: 'abstract-factory', idx: '32', title: 'Abstract Factory',             desc: 'Famílias de objetos compatíveis, troca de backend inteiro', time: '45 min' },
      { id: 'builder',          idx: '33', title: 'Builder',                      desc: 'Construção passo a passo, fluent interface, quando kwargs bastam', time: '45 min' },
      { id: 'singleton-borg',   idx: '34', title: 'Singleton, Borg e módulos',    desc: 'Por que Singleton é quase sempre um erro, e o que usar no lugar', time: '45 min' },
      { id: 'prototype-pool',   idx: '35', title: 'Prototype e Object Pool',      desc: 'copy, deepcopy, pools de conexão, reaproveitamento de recursos caros', time: '45 min' },
    ]
  },
  {
    n: 7, slug: 'etapa-7', title: 'Design patterns estruturais',
    sub: 'Como os objetos se combinam. Envolver, adaptar, simplificar e compor sem criar hierarquias frágeis.',
    lessons: [
      { id: 'adapter',           idx: '36', title: 'Adapter',                      desc: 'Compatibilizar interfaces, anti-corruption layer, wrappers de SDK', time: '45 min' },
      { id: 'decorator-pattern', idx: '37', title: 'Decorator (GoF)',              desc: 'Comportamento em camadas, diferença para o @decorator do Python', time: '45 min' },
      { id: 'facade',            idx: '38', title: 'Facade',                       desc: 'Uma porta simples para um subsistema complexo', time: '40 min' },
      { id: 'proxy',             idx: '39', title: 'Proxy',                        desc: 'Lazy loading, controle de acesso, cache, proxies remotos', time: '45 min' },
      { id: 'composite',         idx: '40', title: 'Composite',                    desc: 'Árvores parte-todo tratadas de forma uniforme', time: '40 min' },
      { id: 'bridge-flyweight',  idx: '41', title: 'Bridge e Flyweight',           desc: 'Separar abstração de implementação, compartilhar estado intrínseco', time: '60 min' },
    ]
  },
  {
    n: 8, slug: 'etapa-8', title: 'Design patterns comportamentais',
    sub: 'Como os objetos conversam e dividem responsabilidades. Em Python, funções de primeira classe simplificam metade do catálogo.',
    lessons: [
      { id: 'strategy',             idx: '42', title: 'Strategy',                  desc: 'Algoritmos intercambiáveis, funções como estratégia', time: '45 min' },
      { id: 'observer',             idx: '43', title: 'Observer e pub/sub',        desc: 'Eventos, callbacks, sinais, weakref, acoplamento temporal', time: '60 min' },
      { id: 'command',              idx: '44', title: 'Command',                   desc: 'Ações como objetos, undo/redo, filas de comandos', time: '45 min' },
      { id: 'state',                idx: '45', title: 'State e máquinas de estado', desc: 'Comportamento que muda com o estado, transições explícitas', time: '60 min' },
      { id: 'template-method',      idx: '46', title: 'Template Method',           desc: 'Esqueleto do algoritmo com passos sobrescrevíveis, hooks', time: '40 min' },
      { id: 'chain-responsibility', idx: '47', title: 'Chain of Responsibility',   desc: 'Pipelines de handlers, middlewares, validações encadeadas', time: '45 min' },
      { id: 'iterator-visitor',     idx: '48', title: 'Iterator, Visitor e Mediator', desc: 'Percorrer, operar sobre estruturas e centralizar a comunicação', time: '60 min' },
    ]
  },
  {
    n: 9, slug: 'etapa-9', title: 'Architecture patterns',
    sub: 'Do objeto ao sistema. Domínio no centro, infraestrutura na borda, eventos como cola. A parte que separa sênior de pleno.',
    lessons: [
      { id: 'arquitetura-camadas', idx: '49', title: 'Camadas e Clean Architecture', desc: 'Regra de dependência, camadas, onion, screaming architecture', time: '75 min' },
      { id: 'hexagonal',           idx: '50', title: 'Hexagonal (Ports & Adapters)', desc: 'Portas, adaptadores, núcleo testável sem infraestrutura', time: '75 min' },
      { id: 'repository-uow',      idx: '51', title: 'Repository e Unit of Work',   desc: 'Abstrair persistência, transações atômicas, SQLAlchemy', time: '90 min' },
      { id: 'service-layer',       idx: '52', title: 'Service Layer',              desc: 'Casos de uso, orquestração, controladores finos', time: '60 min' },
      { id: 'ddd-tatico',          idx: '53', title: 'Domain-Driven Design tático', desc: 'Entities, value objects, aggregates, invariantes, linguagem ubíqua', time: '90 min' },
      { id: 'eventos-message-bus', idx: '54', title: 'Domain events e message bus', desc: 'Eventos de domínio, handlers, outbox, consistência eventual', time: '75 min' },
      { id: 'cqrs-event-sourcing', idx: '55', title: 'CQRS e Event Sourcing',      desc: 'Separar escrita de leitura, log de eventos como fonte da verdade', time: '75 min' },
      { id: 'injecao-dependencia', idx: '56', title: 'Injeção de dependência',     desc: 'Composition root, bootstrap, containers, DI sem framework', time: '60 min' },
      { id: 'monolito-microsservicos', idx: '57', title: 'Monólito modular e microsserviços', desc: 'Fronteiras, contratos, sagas, quando dividir e quando não', time: '75 min' },
    ]
  },
  {
    n: 10, slug: 'etapa-10', title: 'Concorrência & async',
    sub: 'CPU-bound ou I/O-bound? A pergunta que decide entre threads, processos e asyncio. E o que muda com o Python sem GIL.',
    lessons: [
      { id: 'gil-modelo',      idx: '58', title: 'GIL e free-threading',        desc: 'O que o GIL protege, PEP 703, Python 3.13t/3.14t, CPU vs I/O bound', time: '75 min' },
      { id: 'threading',       idx: '59', title: 'Threads e sincronização',     desc: 'threading, Lock, Queue, race conditions, ThreadPoolExecutor', time: '60 min' },
      { id: 'multiprocessing', idx: '60', title: 'Multiprocessing',             desc: 'Processos, ProcessPoolExecutor, memória compartilhada, pickling', time: '60 min' },
      { id: 'asyncio',         idx: '61', title: 'asyncio por dentro',          desc: 'Event loop, corrotinas, tasks, await, quando async não ajuda', time: '90 min' },
      { id: 'async-patterns',  idx: '62', title: 'Padrões de concorrência',     desc: 'TaskGroup, semáforos, backpressure, timeouts, cancelamento, retries', time: '75 min' },
    ]
  },
  {
    n: 11, slug: 'etapa-11', title: 'High performance',
    sub: 'Medir antes de otimizar. Depois: algoritmo certo, memória sob controle, vetorização e, quando precisa, código nativo.',
    lessons: [
      { id: 'profiling',          idx: '63', title: 'Profiling e benchmarking',     desc: 'cProfile, py-spy, Scalene, line_profiler, timeit, pyperf', time: '75 min' },
      { id: 'estruturas-eficientes', idx: '64', title: 'Algoritmos e estruturas eficientes', desc: 'Big-O na prática, heapq, bisect, deque, sets, armadilhas de performance', time: '75 min' },
      { id: 'memoria',            idx: '65', title: 'Memória e garbage collection', desc: 'Contagem de referências, gc geracional, __slots__, tracemalloc, vazamentos', time: '75 min' },
      { id: 'cpython-internals',  idx: '66', title: 'CPython por dentro',           desc: 'Bytecode, dis, interpretador adaptativo (PEP 659), JIT experimental', time: '75 min' },
      { id: 'numpy-vetorizacao',  idx: '67', title: 'NumPy e vetorização',          desc: 'ndarray, broadcasting, strides, ufuncs, evitar loops Python', time: '90 min' },
      { id: 'numba-cython',       idx: '68', title: 'Numba e Cython',               desc: 'Compilação JIT e AOT, nogil, quando cada um compensa', time: '75 min' },
      { id: 'rust-pyo3',          idx: '69', title: 'Extensões nativas com Rust',   desc: 'PyO3, maturin, C API, ctypes, cffi, liberar o GIL', time: '75 min' },
      { id: 'caching-io',         idx: '70', title: 'Caching, I/O e serialização',  desc: 'lru_cache, cache distribuído, mmap, orjson, msgpack, buffers', time: '60 min' },
    ]
  },
  {
    n: 12, slug: 'etapa-12', title: 'Master large data',
    sub: 'Quando os dados não cabem na memória, nem na máquina. Formatos colunares, engines vetorizadas e computação distribuída.',
    lessons: [
      { id: 'pandas-performance', idx: '71', title: 'pandas em alta performance',  desc: 'dtypes, categorical, Arrow backend, copy-on-write, evitar apply', time: '90 min' },
      { id: 'polars',             idx: '72', title: 'Polars e lazy evaluation',    desc: 'Expressions, LazyFrame, query optimizer, streaming engine', time: '90 min' },
      { id: 'arrow-parquet',      idx: '73', title: 'Apache Arrow e Parquet',      desc: 'Formato colunar, zero-copy, row groups, particionamento, compressão', time: '75 min' },
      { id: 'duckdb',             idx: '74', title: 'DuckDB e SQL analítico',      desc: 'OLAP in-process, consultas sobre Parquet, integração com Arrow', time: '60 min' },
      { id: 'out-of-core',        idx: '75', title: 'Streaming e out-of-core',     desc: 'Chunking, geradores, memory mapping, processar 100 GB num notebook', time: '60 min' },
      { id: 'dask-ray',           idx: '76', title: 'Dask e Ray',                  desc: 'Paralelismo distribuído em Python, task graphs, actors', time: '75 min' },
      { id: 'pyspark',            idx: '77', title: 'PySpark',                     desc: 'DataFrames distribuídos, particionamento, shuffle, UDFs vetorizadas', time: '90 min' },
      { id: 'pipelines-dados',    idx: '78', title: 'Pipelines e orquestração',    desc: 'Airflow, Dagster, Prefect, idempotência, data contracts, qualidade', time: '75 min' },
    ]
  },
  {
    n: 13, slug: 'etapa-13', title: 'Python em produção',
    sub: 'Do repositório ao serviço no ar: empacotar, expor, observar, proteger e entregar com confiança.',
    lessons: [
      { id: 'packaging',          idx: '79', title: 'Packaging e distribuição',    desc: 'pyproject, wheels, build backends, versionamento, publicar no PyPI', time: '60 min' },
      { id: 'fastapi-servicos',   idx: '80', title: 'Serviços com FastAPI',        desc: 'ASGI, dependências, validação, async correto, contratos OpenAPI', time: '75 min' },
      { id: 'observabilidade',    idx: '81', title: 'Logging e observabilidade',   desc: 'logging estruturado, OpenTelemetry, métricas, tracing, SLOs', time: '60 min' },
      { id: 'seguranca-python',   idx: '82', title: 'Segurança em Python',         desc: 'Supply chain, pickle, injeção, segredos, bandit, pip-audit', time: '60 min' },
      { id: 'deploy-python',      idx: '83', title: 'Containers e deploy',         desc: 'Imagens enxutas, multi-stage, gunicorn/uvicorn, CI/CD, 12-factor', time: '60 min' },
    ]
  },
];
