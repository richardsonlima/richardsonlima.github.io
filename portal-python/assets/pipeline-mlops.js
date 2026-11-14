/* Pipeline page, conteudo de referencia de engenharia Python:
   ciclo de 9 passos, pilares de qualidade (Well-Architected aplicado a um servico Python),
   niveis de maturidade, perguntas de entrevista senior, ferramentas e mapa para a trilha.
   Campos com sufixo _en sao lidos por I18N.pick. */

(function () {
  var I = function (p) { return '<svg class="vi" viewBox="0 0 24 24" width="1em" height="1em" aria-hidden="true" ><g fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round">' + p + '</g></svg>'; };
  var L = function (id, label) { return '<a href="lesson.html?id=' + id + '">' + label + '</a>'; };

  /* ---------- Ciclo de engenharia, 9 passos ---------- */
  window.ENG_STEPS = [
    {
      t: 'Modelagem do domínio', t_en: 'Domain modeling',
      d: 'Antes de código, o vocabulário: entidades, value objects e as regras que nunca podem ser violadas.',
      d_en: 'Before code, the vocabulary: entities, value objects and the rules that must never be broken.',
      bullets: [
        'Converse com quem conhece o negócio e escreva a <b>linguagem ubíqua</b>: o nome no código é o nome que o time usa. Aprofunde em ' + L('ddd-tatico', 'DDD tático') + '.',
        'Separe <b>entidade</b> (identidade) de <b>value object</b> (valor): <code>Dinheiro</code> é imutável e comparado por valor.',
        'Escreva as <b>invariantes</b> como código que falha cedo, não como comentário. A forma da arquitetura vem em ' + L('hexagonal', 'Hexagonal') + '.'
      ],
      bullets_en: [
        'Talk to whoever knows the business and write the <b>ubiquitous language</b>: the name in code is the name the team uses. Go deeper in ' + L('ddd-tatico', 'Tactical DDD') + '.',
        'Separate <b>entity</b> (identity) from <b>value object</b> (value): <code>Dinheiro</code> is immutable and compared by value.',
        'Write <b>invariants</b> as code that fails early, not as comments. The shape of the architecture comes in ' + L('hexagonal', 'Hexagonal') + '.'
      ],
      svc: ['DDD tático', 'value objects', 'linguagem ubíqua', 'dataclasses'], svc_en: ['tactical DDD', 'value objects', 'ubiquitous language', 'dataclasses']
    },
    {
      t: 'Contratos', t_en: 'Contracts',
      d: 'Interfaces explícitas entre as partes: o que cada fronteira promete e o que exige.',
      d_en: 'Explicit interfaces between the parts: what each boundary promises and what it requires.',
      bullets: [
        '<b>Protocol</b> para portas internas e <b>Pydantic</b> para contratos externos (HTTP, eventos). Veja ' + L('protocols-abc', 'ABCs e Protocols') + ' e ' + L('dataclasses-pydantic', 'Dataclasses e Pydantic') + '.',
        'Type hints completos, checados em CI com <b>mypy</b> ou <b>pyright</b>, viram documentação que não apodrece. Base em ' + L('type-hints', 'Type hints') + '.',
        'Versione o contrato: mudança incompatível de esquema é um deploy coordenado, não uma surpresa.'
      ],
      bullets_en: [
        '<b>Protocol</b> for internal ports and <b>Pydantic</b> for external contracts (HTTP, events). See ' + L('protocols-abc', 'ABCs and Protocols') + ' and ' + L('dataclasses-pydantic', 'Dataclasses and Pydantic') + '.',
        'Complete type hints, checked in CI with <b>mypy</b> or <b>pyright</b>, become documentation that does not rot. Basics in ' + L('type-hints', 'Type hints') + '.',
        'Version the contract: an incompatible schema change is a coordinated deploy, not a surprise.'
      ],
      svc: ['Protocol', 'Pydantic', 'mypy / pyright', 'OpenAPI'], svc_en: ['Protocol', 'Pydantic', 'mypy / pyright', 'OpenAPI']
    },
    {
      t: 'Testes', t_en: 'Tests',
      d: 'Rede de segurança montada antes de mexer: o domínio testado sem I/O e as bordas testadas com dependências reais.',
      d_en: 'A safety net built before changing anything: the domain tested without I/O and the edges tested against real dependencies.',
      bullets: [
        '<b>Pirâmide</b>: muitos testes rápidos no núcleo, poucos de integração nos adapters, um punhado ponta a ponta. Comece por ' + L('pytest-testes', 'pytest') + '.',
        'Prefira <b>fakes</b> a mocks que verificam chamadas; teste comportamento, não implementação. Ver ' + L('tdd-test-doubles', 'TDD e test doubles') + '.',
        '<b>Property-based testing</b> (Hypothesis) acha casos de borda que ninguém lembrou de escrever, ótimo para parsers e dinheiro.'
      ],
      bullets_en: [
        '<b>Pyramid</b>: many fast tests in the core, few integration tests at adapters, a handful end to end. Start with ' + L('pytest-testes', 'pytest') + '.',
        'Prefer <b>fakes</b> over mocks that verify calls; test behavior, not implementation. See ' + L('tdd-test-doubles', 'TDD and test doubles') + '.',
        '<b>Property-based testing</b> (Hypothesis) finds edge cases nobody remembered to write, great for parsers and money.'
      ],
      svc: ['pytest', 'Hypothesis', 'fakes', 'testcontainers'], svc_en: ['pytest', 'Hypothesis', 'fakes', 'testcontainers']
    },
    {
      t: 'Implementação', t_en: 'Implementation',
      d: 'O caminho mais simples que passa nos testes, com nomes honestos e funções pequenas.',
      d_en: 'The simplest path that passes the tests, with honest names and small functions.',
      bullets: [
        'Nomes que revelam intenção, funções com uma razão para mudar. Veja ' + L('clean-naming', 'Nomes e Clean Code') + ' e ' + L('srp', 'SRP') + '.',
        'Reconheça <b>cheiros de código</b> cedo (função longa, flag como argumento, <code>if</code> em cadeia) e refatore com os testes verdes. Ver ' + L('code-smells', 'Code smells') + '.',
        '<b>ruff</b> e o formatador rodam no pre-commit; a discussão de estilo sai do code review. Ver ' + L('tooling-qualidade', 'Tooling de qualidade') + '.'
      ],
      bullets_en: [
        'Names that reveal intent, functions with one reason to change. See ' + L('clean-naming', 'Naming and Clean Code') + ' and ' + L('srp', 'SRP') + '.',
        'Spot <b>code smells</b> early (long function, flag argument, chained <code>if</code>) and refactor with green tests. See ' + L('code-smells', 'Code smells') + '.',
        '<b>ruff</b> and the formatter run on pre-commit; style debates leave code review. See ' + L('tooling-qualidade', 'Quality tooling') + '.'
      ],
      svc: ['ruff', 'SOLID', 'Clean Code', 'pre-commit'], svc_en: ['ruff', 'SOLID', 'Clean Code', 'pre-commit']
    },
    {
      t: 'Profiling', t_en: 'Profiling',
      d: 'Medir onde o tempo e a memória realmente vão, com dado representativo, antes de qualquer otimização.',
      d_en: 'Measure where time and memory actually go, with representative data, before any optimization.',
      bullets: [
        '<b>cProfile</b> mostra funções, <b>py-spy</b> amostra um processo vivo sem alterá-lo, <b>memray</b> e <b>tracemalloc</b> cobrem memória. Guia em ' + L('profiling', 'Profiling') + '.',
        'Meça com <b>dado realista</b> e repita: uma execução única mede o ruído, não o programa. Vale também para ' + L('memoria', 'memória') + '.',
        'Defina o orçamento antes (latência p95, memória máxima) para saber quando parar de otimizar.'
      ],
      bullets_en: [
        '<b>cProfile</b> shows functions, <b>py-spy</b> samples a live process without altering it, <b>memray</b> and <b>tracemalloc</b> cover memory. Guide in ' + L('profiling', 'Profiling') + '.',
        'Measure with <b>realistic data</b> and repeat: a single run measures noise, not the program. This applies to ' + L('memoria', 'memory') + ' too.',
        'Set the budget first (p95 latency, peak memory) so you know when to stop optimizing.'
      ],
      svc: ['cProfile', 'py-spy', 'memray', 'Scalene', 'timeit'], svc_en: ['cProfile', 'py-spy', 'memray', 'Scalene', 'timeit']
    },
    {
      t: 'Otimização', t_en: 'Optimization',
      d: 'Atacar o gargalo medido, na ordem do mais barato para o mais caro: algoritmo, estrutura, vetorização, paralelismo, código nativo.',
      d_en: 'Attack the measured bottleneck, from cheapest to most expensive: algorithm, data structure, vectorization, parallelism, native code.',
      bullets: [
        'Primeiro a <b>estrutura de dados e o algoritmo</b> (de <code>list</code> para <code>set</code>/<code>dict</code>): ' + L('estruturas-eficientes', 'Estruturas eficientes') + '.',
        'Depois <b>vetorize</b> com ' + L('polars', 'Polars') + ' ou ' + L('numpy-vetorizacao', 'NumPy') + ', e só então paralelize: ' + L('asyncio', 'asyncio') + ' para I/O, ' + L('multiprocessing', 'multiprocessing') + ' para CPU.',
        'Código nativo (' + L('numba-cython', 'Numba e Cython') + ', ' + L('rust-pyo3', 'Rust com PyO3') + ') é o último recurso e fica atrás de uma função Python com o mesmo contrato.'
      ],
      bullets_en: [
        'First <b>data structure and algorithm</b> (from <code>list</code> to <code>set</code>/<code>dict</code>): ' + L('estruturas-eficientes', 'Efficient structures') + '.',
        'Then <b>vectorize</b> with ' + L('polars', 'Polars') + ' or ' + L('numpy-vetorizacao', 'NumPy') + ', and only then parallelize: ' + L('asyncio', 'asyncio') + ' for I/O, ' + L('multiprocessing', 'multiprocessing') + ' for CPU.',
        'Native code (' + L('numba-cython', 'Numba and Cython') + ', ' + L('rust-pyo3', 'Rust with PyO3') + ') is the last resort and sits behind a Python function with the same contract.'
      ],
      svc: ['Polars', 'NumPy', 'multiprocessing', 'Numba', 'PyO3'], svc_en: ['Polars', 'NumPy', 'multiprocessing', 'Numba', 'PyO3']
    },
    {
      t: 'Empacotamento', t_en: 'Packaging',
      d: 'Transformar o código em um artefato reprodutível: o mesmo que rodou em CI roda em produção.',
      d_en: 'Turn the code into a reproducible artifact: what ran in CI is what runs in production.',
      bullets: [
        '<code>pyproject.toml</code>, layout <code>src/</code> e um <b>lockfile</b> gerado com <b>uv</b> garantem o mesmo conjunto de versões em toda máquina. Ver ' + L('packaging', 'Empacotamento') + ' e ' + L('python-ambiente', 'Ambiente moderno') + '.',
        'Imagem <b>Docker multi-stage</b>: build com compiladores, runtime enxuto, usuário sem privilégio.',
        'Versione por <b>SemVer</b> e publique o artefato imutável; nunca reconstrua para promover entre ambientes.'
      ],
      bullets_en: [
        '<code>pyproject.toml</code>, the <code>src/</code> layout and a <b>lockfile</b> generated with <b>uv</b> guarantee the same set of versions on every machine. See ' + L('packaging', 'Packaging') + ' and ' + L('python-ambiente', 'Modern environment') + '.',
        '<b>Multi-stage Docker</b> image: build with compilers, lean runtime, unprivileged user.',
        'Version with <b>SemVer</b> and publish the immutable artifact; never rebuild to promote between environments.'
      ],
      svc: ['uv', 'pyproject.toml', 'wheel', 'Docker multi-stage'], svc_en: ['uv', 'pyproject.toml', 'wheel', 'multi-stage Docker']
    },
    {
      t: 'Deploy', t_en: 'Deploy',
      d: 'Colocar no ar de forma gradual e reversível, com a configuração separada do código.',
      d_en: 'Ship gradually and reversibly, with configuration kept apart from code.',
      bullets: [
        'Estratégias <b>blue-green</b> ou <b>canary</b> com rollback automático por métrica. Detalhes em ' + L('deploy-python', 'Deploy de Python') + '.',
        'Configuração por <b>variáveis de ambiente</b> e segredos num cofre; a mesma imagem sobe em todos os ambientes. Segurança em ' + L('seguranca-python', 'Segurança em Python') + '.',
        'Health checks de <b>liveness</b> e <b>readiness</b> distintos, e desligamento gracioso que termina as requisições em voo. Serviço em ' + L('fastapi-servicos', 'FastAPI') + '.'
      ],
      bullets_en: [
        '<b>Blue-green</b> or <b>canary</b> strategies with automatic rollback on a metric. Details in ' + L('deploy-python', 'Deploying Python') + '.',
        'Configuration through <b>environment variables</b> and secrets in a vault; the same image goes up in every environment. Security in ' + L('seguranca-python', 'Python security') + '.',
        'Separate <b>liveness</b> and <b>readiness</b> health checks, and graceful shutdown that finishes in-flight requests. Service in ' + L('fastapi-servicos', 'FastAPI') + '.'
      ],
      svc: ['Docker', 'ECS / Kubernetes', 'canary', 'feature flags'], svc_en: ['Docker', 'ECS / Kubernetes', 'canary', 'feature flags']
    },
    {
      t: 'Observabilidade', t_en: 'Observability',
      d: 'Saber o que o sistema está fazendo em produção sem precisar abrir um debugger: logs, métricas e traces ligados a SLOs.',
      d_en: 'Know what the system is doing in production without opening a debugger: logs, metrics and traces tied to SLOs.',
      bullets: [
        '<b>Logs estruturados</b> (JSON) com id de correlação, <b>métricas</b> RED (taxa, erros, duração) e <b>traces</b> distribuídos com OpenTelemetry. Ver ' + L('observabilidade', 'Observabilidade') + '.',
        'Defina <b>SLIs e SLOs</b> por serviço e alerte no consumo do <em>orçamento de erro</em>, não em cada pico.',
        'O que a produção ensina volta para o passo 1: um incidente vira regra de domínio, teste novo ou contrato mais estrito.'
      ],
      bullets_en: [
        '<b>Structured logs</b> (JSON) with a correlation id, RED <b>metrics</b> (rate, errors, duration) and distributed <b>traces</b> with OpenTelemetry. See ' + L('observabilidade', 'Observability') + '.',
        'Define <b>SLIs and SLOs</b> per service and alert on <em>error budget</em> burn, not on every spike.',
        'What production teaches flows back to step 1: an incident becomes a domain rule, a new test or a stricter contract.'
      ],
      svc: ['OpenTelemetry', 'structlog', 'Prometheus', 'SLO'], svc_en: ['OpenTelemetry', 'structlog', 'Prometheus', 'SLO']
    }
  ];

  /* ---------- Pilares de qualidade (Well-Architected aplicado a um servico Python) ---------- */
  window.QUALITY_PILLARS = [
    {
      icon: I('<circle cx="12" cy="12" r="3.2"/><path d="M12 2.6v2.6M12 18.8v2.6M4.6 12H2M22 12h-2.6M6.4 6.4 4.6 4.6M19.4 19.4l-1.8-1.8M17.6 6.4l1.8-1.8M4.6 19.4l1.8-1.8"/>'),
      t: 'Excelência operacional', t_en: 'Operational excellence',
      q: 'Operar, observar e melhorar o serviço continuamente.',
      q_en: 'Operate, observe and continuously improve the service.',
      body: [
        '<b>Tudo como código:</b> lockfile, imagem, infraestrutura e pipeline versionados; ninguém sobe nada à mão.',
        '<b>Observabilidade nativa:</b> logs JSON com id de correlação, métricas RED e traces com OpenTelemetry desde o primeiro endpoint.',
        '<b>Runbooks e rollback:</b> cada alerta aponta para um passo a passo; deploy sem caminho de volta é risco.',
        '<b>Post-mortem sem culpa:</b> o incidente vira teste, alerta ou regra de domínio.'
      ],
      body_en: [
        '<b>Everything as code:</b> lockfile, image, infrastructure and pipeline versioned; nobody ships anything by hand.',
        '<b>Native observability:</b> JSON logs with a correlation id, RED metrics and OpenTelemetry traces from the first endpoint.',
        '<b>Runbooks and rollback:</b> every alert points to a step-by-step; a deploy with no way back is a risk.',
        '<b>Blameless post-mortems:</b> the incident becomes a test, an alert or a domain rule.'
      ],
      tradeoff: 'Automação e telemetria custam esforço no começo e armazenamento depois; pagam em tempo de recuperação.',
      tradeoff_en: 'Automation and telemetry cost effort up front and storage later; they pay back in recovery time.'
    },
    {
      icon: I('<path d="M12 3l7 3v5c0 4.6-3 8-7 10-4-2-7-5.4-7-10V6z"/><path d="M9.2 12l2 2 3.8-4"/>'),
      t: 'Segurança', t_en: 'Security',
      q: 'Proteger dados, identidades e a cadeia de suprimentos.',
      q_en: 'Protect data, identities and the supply chain.',
      body: [
        '<b>Validação na borda:</b> Pydantic com <code>extra="forbid"</code>; nada de <code>eval</code>, <code>pickle</code> de fonte não confiável ou SQL concatenado.',
        '<b>Dependências:</b> lockfile com hashes, <b>pip-audit</b> em CI, atualização contínua. Ver ' + L('seguranca-python', 'Segurança em Python') + '.',
        '<b>Segredos fora do código:</b> cofre ou gerenciador de segredos, nunca em imagem ou repositório.',
        '<b>Privilégio mínimo:</b> cada serviço com a própria identidade e só as permissões de que precisa.'
      ],
      body_en: [
        '<b>Validation at the edge:</b> Pydantic with <code>extra="forbid"</code>; no <code>eval</code>, no <code>pickle</code> from untrusted sources, no concatenated SQL.',
        '<b>Dependencies:</b> lockfile with hashes, <b>pip-audit</b> in CI, continuous updates. See ' + L('seguranca-python', 'Python security') + '.',
        '<b>Secrets out of code:</b> a vault or secrets manager, never in an image or repository.',
        '<b>Least privilege:</b> each service with its own identity and only the permissions it needs.'
      ],
      tradeoff: 'Controles mais rígidos reduzem a velocidade de iteração; automatize-os na pipeline para não virarem atrito.',
      tradeoff_en: 'Stricter controls slow iteration; automate them in the pipeline so they do not become friction.'
    },
    {
      icon: I('<circle cx="12" cy="12" r="8.4"/><circle cx="12" cy="12" r="4.4"/><circle cx="12" cy="12" r="1"/>'),
      t: 'Confiabilidade', t_en: 'Reliability',
      q: 'Continuar correto sob falha, carga e reprocesso.',
      q_en: 'Stay correct under failure, load and reprocessing.',
      body: [
        '<b>Idempotência:</b> processar o mesmo evento duas vezes produz o mesmo estado; a entrega at-least-once deixa de ser problema.',
        '<b>Timeouts, retry com backoff e jitter</b> em toda chamada externa, e circuit breaker onde a falha é correlacionada.',
        '<b>Backpressure:</b> filas limitadas e <code>Semaphore</code> impedem que a sobrecarga derrube o processo. Ver ' + L('async-patterns', 'Async patterns') + '.',
        '<b>Degradação graciosa:</b> se o cache cai, a API responde mais devagar, não para.'
      ],
      body_en: [
        '<b>Idempotency:</b> processing the same event twice yields the same state; at-least-once delivery stops being a problem.',
        '<b>Timeouts, retry with backoff and jitter</b> on every external call, and a circuit breaker where failure is correlated.',
        '<b>Backpressure:</b> bounded queues and <code>Semaphore</code> keep overload from taking the process down. See ' + L('async-patterns', 'Async patterns') + '.',
        '<b>Graceful degradation:</b> if the cache goes down, the API answers slower, it does not stop.'
      ],
      tradeoff: 'Redundância e retries aumentam custo e podem amplificar falhas (retry storm); limite-os e meça.',
      tradeoff_en: 'Redundancy and retries raise cost and can amplify failures (retry storms); limit them and measure.'
    },
    {
      icon: I('<path d="M13 3L5 13.500h6L10 21l8-10.500h-6z"/>'),
      t: 'Eficiência de performance', t_en: 'Performance efficiency',
      q: 'Usar o recurso certo, do jeito certo, e medir.',
      q_en: 'Use the right resource, the right way, and measure.',
      body: [
        '<b>Perfil antes de otimizar:</b> cProfile, py-spy e memray apontam o gargalo; a intuição costuma errar. Ver ' + L('profiling', 'Profiling') + '.',
        '<b>Modelo de concorrência pelo gargalo:</b> asyncio para I/O, processos ou Polars para CPU, threads quando o código C solta o GIL.',
        '<b>Formato de dados:</b> Parquet colunar e particionado reduz o que é lido antes de qualquer cálculo.',
        '<b>Estruturas certas:</b> <code>set</code> para pertencimento, <code>deque</code> para filas, <code>__slots__</code> para milhões de objetos.'
      ],
      body_en: [
        '<b>Profile before optimizing:</b> cProfile, py-spy and memray point to the bottleneck; intuition usually errs. See ' + L('profiling', 'Profiling') + '.',
        '<b>Concurrency model by bottleneck:</b> asyncio for I/O, processes or Polars for CPU, threads when C code releases the GIL.',
        '<b>Data format:</b> columnar, partitioned Parquet reduces what is read before any computation.',
        '<b>Right structures:</b> <code>set</code> for membership, <code>deque</code> for queues, <code>__slots__</code> for millions of objects.'
      ],
      tradeoff: 'Otimizar custa legibilidade e manutenção; faça só até o orçamento de latência e memória ser atendido.',
      tradeoff_en: 'Optimizing costs readability and maintainability; do it only until the latency and memory budget is met.'
    },
    {
      icon: I('<circle cx="12" cy="12" r="8.4"/><path d="M14.6 9.200c-.5-.8-1.5-1.2-2.6-1.2-1.5 0-2.5.8-2.5 1.9 0 2.6 5.3 1.2 5.3 3.9 0 1.1-1.1 1.9-2.8 1.9-1.2 0-2.2-.5-2.8-1.300M12 6.500V8M12 16v1.5"/>'),
      t: 'Otimização de custo', t_en: 'Cost optimization',
      q: 'Pagar só pelo que se usa e saber quanto cada coisa custa.',
      q_en: 'Pay only for what you use and know what each thing costs.',
      body: [
        '<b>Computação sob demanda:</b> jobs de lote em instâncias que sobem e descem, em vez de um cluster ocioso.',
        '<b>Menos dado lido, menos custo:</b> particionamento e projeção de colunas reduzem leitura em consultas de pagamento por byte.',
        '<b>Tamanho certo:</b> memória e vCPUs ajustados pelo perfil real, não por chute generoso.',
        '<b>Tags e métricas de custo</b> por serviço: o que não é medido não é otimizado.'
      ],
      body_en: [
        '<b>On-demand compute:</b> batch jobs on instances that start and stop, instead of an idle cluster.',
        '<b>Less data read, lower cost:</b> partitioning and column projection reduce reads in pay-per-byte queries.',
        '<b>Right-sizing:</b> memory and vCPUs tuned from the real profile, not a generous guess.',
        '<b>Cost tags and metrics</b> per service: what is not measured is not optimized.'
      ],
      tradeoff: 'Cortar custo demais ameaça confiabilidade e desempenho; trate custo como requisito com limite, não como meta única.',
      tradeoff_en: 'Cutting cost too far threatens reliability and performance; treat cost as a requirement with a bound, not the only goal.'
    },
    {
      icon: I('<path d="M12 20v-7"/><path d="M12 13c-4 0-6.4-2.4-6.4-6.400C10 6.6 12 9 12 13z"/><path d="M12 15c0-3 2-5 5.4-5.400C17.4 13 15.4 15 12 15z"/>'),
      t: 'Sustentabilidade', t_en: 'Sustainability',
      q: 'Fazer o mesmo trabalho com menos energia e menos desperdício.',
      q_en: 'Do the same work with less energy and less waste.',
      body: [
        '<b>Menos CPU por resultado:</b> vetorizar e evitar trabalho repetido reduz energia, além de tempo.',
        '<b>Cache e leitura incremental:</b> reprocessar só a partição que mudou, não o histórico inteiro.',
        '<b>Imagens enxutas:</b> menos bytes para construir, transferir e armazenar.',
        '<b>Ciclo de vida do dado:</b> expirar o que não tem mais uso e usar compressão adequada (zstd).'
      ],
      body_en: [
        '<b>Less CPU per result:</b> vectorizing and avoiding repeated work reduces energy as well as time.',
        '<b>Caching and incremental reads:</b> reprocess only the partition that changed, not the whole history.',
        '<b>Lean images:</b> fewer bytes to build, transfer and store.',
        '<b>Data lifecycle:</b> expire what is no longer used and apply suitable compression (zstd).'
      ],
      tradeoff: 'Reaproveitar cache e dado incremental exige mais cuidado com invalidação e correção.',
      tradeoff_en: 'Reusing cache and incremental data demands more care with invalidation and correctness.'
    }
  ];

  /* ---------- Niveis de maturidade de engenharia ---------- */
  window.MATURITY = [
    { lvl: 'Nível 0', lvl_en: 'Level 0', name: 'Script', name_en: 'Script', auto: 10,
      d: 'Um arquivo que roda na máquina de quem escreveu. Dependências implícitas, sem testes, estado global.',
      d_en: 'One file that runs on the author\'s machine. Implicit dependencies, no tests, global state.',
      sinal: 'Só uma pessoa sabe rodar.', sinal_en: 'Only one person knows how to run it.' },
    { lvl: 'Nível 1', lvl_en: 'Level 1', name: 'Pacote reprodutível', name_en: 'Reproducible package', auto: 30,
      d: 'pyproject.toml, lockfile, layout src/, ambiente isolado. Qualquer pessoa instala e roda do zero.',
      d_en: 'pyproject.toml, lockfile, src/ layout, isolated environment. Anyone can install and run from scratch.',
      sinal: 'Um clone novo roda em minutos.', sinal_en: 'A fresh clone runs in minutes.' },
    { lvl: 'Nível 2', lvl_en: 'Level 2', name: 'Testado e tipado', name_en: 'Tested and typed', auto: 55,
      d: 'Testes automatizados, type hints checados, formatador e linter. Refatorar deixa de dar medo.',
      d_en: 'Automated tests, checked type hints, formatter and linter. Refactoring stops being scary.',
      sinal: 'CI vermelho bloqueia o merge.', sinal_en: 'A red CI blocks the merge.' },
    { lvl: 'Nível 3', lvl_en: 'Level 3', name: 'Arquitetura explícita', name_en: 'Explicit architecture', auto: 80,
      d: 'Fronteiras de domínio, portas e adapters, regras de dependência checadas por ferramenta, contratos versionados.',
      d_en: 'Domain boundaries, ports and adapters, dependency rules enforced by tooling, versioned contracts.',
      sinal: 'Trocar o banco ou a fila não toca no domínio.', sinal_en: 'Swapping the database or the queue does not touch the domain.' },
    { lvl: 'Nível 4', lvl_en: 'Level 4', name: 'Sistema com SLOs', name_en: 'System with SLOs', auto: 95,
      d: 'Entrega contínua com rollback, observabilidade completa, SLOs com orçamento de erro, reprocesso e runbooks.',
      d_en: 'Continuous delivery with rollback, full observability, SLOs with error budgets, reprocessing and runbooks.',
      sinal: 'A decisão de release vem do orçamento de erro.', sinal_en: 'The release decision comes from the error budget.' }
  ];

  /* ---------- Perguntas de entrevista (senior) ---------- */
  window.INTERVIEW_QA = [
    /* ===== Arquitetura ===== */
    { cat: 'Arquitetura', cat_en: 'Architecture',
      q: 'Quando hexagonal compensa em vez de camadas simples?',
      q_en: 'When does hexagonal pay off over plain layers?',
      a: 'Compensa quando há <b>mais de um adapter</b> para a mesma necessidade (API e fila, banco e arquivo) ou quando testes de regra de negócio ficam lentos por causa de I/O. O ganho é inverter a dependência: o núcleo declara <code>Protocol</code>s e os adapters os implementam. Em um serviço pequeno com um banco e uma API, camadas simples bastam; portas e adapters viram cerimônia.',
      a_en: 'It pays off when there is <b>more than one adapter</b> for the same need (API and queue, database and file) or when business-rule tests get slow because of I/O. The gain is inverting the dependency: the core declares <code>Protocol</code>s and adapters implement them. In a small service with one database and one API, plain layers are enough; ports and adapters become ceremony.' },
    { cat: 'Arquitetura', cat_en: 'Architecture',
      q: 'Monolito modular ou microsserviços para esta plataforma?',
      q_en: 'Modular monolith or microservices for this platform?',
      a: 'Começo por um <b>monolito modular</b>: módulos com fronteiras explícitas, um deploy, uma transação local. Microsserviços trazem rede, consistência eventual, observabilidade distribuída e custo operacional. Só extraio um módulo quando há razão concreta: escala independente, time dono separado ou ciclo de release diferente. Fronteiras bem desenhadas no monolito tornam a extração posterior barata.',
      a_en: 'I start with a <b>modular monolith</b>: modules with explicit boundaries, one deploy, local transactions. Microservices bring network, eventual consistency, distributed observability and operational cost. I only extract a module for a concrete reason: independent scaling, a separate owning team or a different release cycle. Well-drawn boundaries inside the monolith make later extraction cheap.' },
    { cat: 'Arquitetura', cat_en: 'Architecture',
      q: 'Como impedir que Pydantic e FastAPI vazem para o domínio?',
      q_en: 'How do you keep Pydantic and FastAPI from leaking into the domain?',
      a: 'Separando <b>DTOs de borda</b> (Pydantic) de <b>entidades e value objects</b> (dataclasses simples). A conversão acontece em um só ponto, no adapter. A regra de dependência é verificada em CI com <b>import-linter</b>: o pacote de domínio não pode importar <code>fastapi</code> nem <code>pydantic</code>. Sem a checagem automática, a regra erode no primeiro prazo apertado.',
      a_en: 'By separating <b>edge DTOs</b> (Pydantic) from <b>entities and value objects</b> (plain dataclasses). Conversion happens at a single point, in the adapter. The dependency rule is enforced in CI with <b>import-linter</b>: the domain package may not import <code>fastapi</code> or <code>pydantic</code>. Without the automated check, the rule erodes at the first tight deadline.' },
    { cat: 'Arquitetura', cat_en: 'Architecture',
      q: 'O que é CQRS e quando é exagero?',
      q_en: 'What is CQRS and when is it overkill?',
      a: 'CQRS separa o modelo de <b>escrita</b> (comandos, invariantes) do de <b>leitura</b> (consultas, projeções prontas). Vale quando leitura e escrita têm formas ou cargas muito diferentes, como um resumo agregado servido a muitos clientes. É exagero em CRUD simples: você ganha consistência eventual entre os lados e mais código para manter. Dá para aplicar só a parte leve, com uma view ou tabela de leitura, sem event sourcing.',
      a_en: 'CQRS separates the <b>write</b> model (commands, invariants) from the <b>read</b> model (queries, ready-made projections). It fits when reads and writes have very different shapes or loads, like an aggregated summary served to many clients. It is overkill for plain CRUD: you gain eventual consistency between the sides and more code to maintain. You can apply just the light version, with a view or read table, without event sourcing.' },
    { cat: 'Arquitetura', cat_en: 'Architecture',
      q: 'Event sourcing é o mesmo que ter um log de auditoria?',
      q_en: 'Is event sourcing the same as having an audit log?',
      a: 'Não. No event sourcing os <b>eventos são a fonte da verdade</b> e o estado atual é derivado deles por reprodução. Um log de auditoria é um registro paralelo, o estado vive em outro lugar. Event sourcing dá histórico completo e reconstrução de estado, mas cobra versionamento de eventos, projeções e snapshots. Para a maioria dos casos, auditoria mais um bom esquema relacional resolve.',
      a_en: 'No. In event sourcing the <b>events are the source of truth</b> and current state is derived from them by replay. An audit log is a parallel record; state lives elsewhere. Event sourcing gives full history and state reconstruction, but charges you event versioning, projections and snapshots. For most cases, an audit trail plus a solid relational schema is enough.' },
    { cat: 'Arquitetura', cat_en: 'Architecture',
      q: 'Como lidar com entrega at-least-once sem processar duas vezes?',
      q_en: 'How do you handle at-least-once delivery without processing twice?',
      a: 'Tornando o consumidor <b>idempotente</b>. Cada evento carrega uma chave estável; o consumidor registra as chaves já aplicadas (ou usa um <code>INSERT ... ON CONFLICT DO NOTHING</code>) na mesma transação do efeito. Assim, o reenvio é inofensivo. Exactly-once de ponta a ponta é raro; o prático é at-least-once mais idempotência.',
      a_en: 'By making the consumer <b>idempotent</b>. Each event carries a stable key; the consumer records the keys already applied (or uses <code>INSERT ... ON CONFLICT DO NOTHING</code>) in the same transaction as the effect. A redelivery then becomes harmless. End-to-end exactly-once is rare; the practical answer is at-least-once plus idempotency.' },
    { cat: 'Arquitetura', cat_en: 'Architecture',
      q: 'Como montar injeção de dependência em Python sem framework?',
      q_en: 'How do you wire dependency injection in Python without a framework?',
      a: 'Com <b>injeção por construtor</b> e uma <b>raiz de composição</b>: uma função na entrada da aplicação que instancia os adapters e os passa para os casos de uso. Funções e <code>functools.partial</code> cobrem muitos casos. Frameworks de DI só compensam em grafos grandes; no FastAPI, o <code>Depends</code> já faz esse papel na camada web.',
      a_en: 'With <b>constructor injection</b> and a <b>composition root</b>: a function at the application entry that instantiates the adapters and hands them to the use cases. Functions and <code>functools.partial</code> cover many cases. DI frameworks only pay off on large graphs; in FastAPI, <code>Depends</code> already plays that role at the web layer.' },
    { cat: 'Arquitetura', cat_en: 'Architecture',
      q: 'Como impor regras de arquitetura automaticamente?',
      q_en: 'How do you enforce architecture rules automatically?',
      a: 'Transformando a regra em <b>teste ou checagem de CI</b>. O <b>import-linter</b> declara contratos entre pacotes (camadas, independência, proibições) e falha o build ao violá-los. Complementa com ruff para convenções e testes de arquitetura que inspecionam imports. Regra que só existe em wiki é opinião.',
      a_en: 'By turning the rule into a <b>test or CI check</b>. <b>import-linter</b> declares contracts between packages (layers, independence, prohibitions) and fails the build when violated. Complement it with ruff for conventions and architecture tests that inspect imports. A rule that only lives on a wiki is an opinion.' },

    /* ===== Design ===== */
    { cat: 'Design', cat_en: 'Design',
      q: 'Strategy em Python precisa de uma hierarquia de classes?',
      q_en: 'Does Strategy in Python need a class hierarchy?',
      a: 'Em geral não. Funções são objetos de primeira classe, então a estratégia costuma ser <b>uma função</b> ou um <code>dict</code> de callables. Uso classes quando a estratégia carrega estado ou várias operações coesas, e então um <code>Protocol</code> descreve o contrato. A forma clássica do GoF é útil para entender o padrão, raramente para escrevê-lo em Python.',
      a_en: 'Usually not. Functions are first-class objects, so a strategy is often <b>a function</b> or a <code>dict</code> of callables. I use classes when the strategy carries state or several cohesive operations, and then a <code>Protocol</code> describes the contract. The classic GoF form helps to understand the pattern, rarely to write it in Python.' },
    { cat: 'Design', cat_en: 'Design',
      q: 'Protocol ou ABC: como escolher?',
      q_en: 'Protocol or ABC: how do you choose?',
      a: '<b>Protocol</b> é tipagem estrutural: qualquer classe com os métodos certos satisfaz, sem herdar. Ideal para portas e para tipar código de terceiros. <b>ABC</b> é nominal: força a herança, permite métodos concretos compartilhados e falha na instanciação se faltar método abstrato. Uso Protocol por padrão nas fronteiras e ABC quando há comportamento comum a herdar.',
      a_en: '<b>Protocol</b> is structural typing: any class with the right methods satisfies it, with no inheritance. Ideal for ports and for typing third-party code. <b>ABC</b> is nominal: it forces inheritance, allows shared concrete methods and fails at instantiation if an abstract method is missing. I default to Protocol at boundaries and use ABC when there is common behavior to inherit.' },
    { cat: 'Design', cat_en: 'Design',
      q: 'Dataclass imutável ou modelo Pydantic: quando cada um?',
      q_en: 'Frozen dataclass or Pydantic model: when each?',
      a: '<b>Pydantic</b> na borda, onde o dado é externo e precisa de validação, coerção e serialização. <b>Dataclass</b> (<code>frozen=True, slots=True</code>) no núcleo, onde os tipos já são confiáveis e o custo de validar a cada criação é desperdício. A conversão entre os dois acontece num ponto único.',
      a_en: '<b>Pydantic</b> at the edge, where data is external and needs validation, coercion and serialization. <b>Dataclass</b> (<code>frozen=True, slots=True</code>) in the core, where types are already trusted and validating on every creation is waste. Conversion between the two happens at a single point.' },
    { cat: 'Design', cat_en: 'Design',
      q: 'Como você modela dinheiro?',
      q_en: 'How do you model money?',
      a: 'Nunca com <code>float</code>. No domínio, um <b>value object</b> imutável com <code>Decimal</code> ou inteiro em menor unidade (centavos) mais a moeda, e operações que recusam somar moedas diferentes. Em armazenamento colunar, inteiro em centavos é exato e rápido. Arredondamento é decisão de negócio: explicite o modo (por exemplo, <code>ROUND_HALF_EVEN</code>) e onde ele ocorre.',
      a_en: 'Never with <code>float</code>. In the domain, an immutable <b>value object</b> holding a <code>Decimal</code> or an integer in the smallest unit (cents) plus the currency, with operations that refuse to add different currencies. In columnar storage, integer cents are exact and fast. Rounding is a business decision: make the mode explicit (for example, <code>ROUND_HALF_EVEN</code>) and where it happens.' },
    { cat: 'Design', cat_en: 'Design',
      q: 'Repository e Unit of Work valem a pena com um ORM?',
      q_en: 'Are Repository and Unit of Work worth it with an ORM?',
      a: 'Depende de quem precisa saber do ORM. O repositório protege o <b>núcleo</b> de detalhes de persistência e permite um fake em memória nos testes; a Unit of Work define a fronteira transacional do caso de uso. Se o domínio é fino e o ORM já é a sua fronteira, a abstração extra é custo. Em domínio rico e testes lentos, o ganho é claro.',
      a_en: 'It depends on who needs to know about the ORM. The repository shields the <b>core</b> from persistence details and allows an in-memory fake in tests; the Unit of Work defines the use case\'s transaction boundary. If the domain is thin and the ORM already is your boundary, the extra abstraction is cost. With a rich domain and slow tests, the gain is clear.' },
    { cat: 'Design', cat_en: 'Design',
      q: 'Composição ou herança?',
      q_en: 'Composition or inheritance?',
      a: 'Composição por padrão. Herança acopla a subclasse aos detalhes da base e quebra facilmente o <b>princípio de Liskov</b>. Herdo para modelar uma relação "é um" estável, ou para reaproveitar comportamento com um <i>template method</i> bem definido. Para variar comportamento, injeto um colaborador (função ou <code>Protocol</code>) em vez de criar mais uma subclasse.',
      a_en: 'Composition by default. Inheritance couples the subclass to the base\'s details and easily breaks the <b>Liskov principle</b>. I inherit to model a stable "is a" relation, or to reuse behavior through a well-defined <i>template method</i>. To vary behavior, I inject a collaborator (a function or <code>Protocol</code>) instead of adding another subclass.' },
    { cat: 'Design', cat_en: 'Design',
      q: 'Como projetar o tratamento de erros: exceções ou Result?',
      q_en: 'How do you design error handling: exceptions or Result?',
      a: 'Em Python, <b>exceções</b> são o idioma. Crio uma hierarquia de exceções de domínio com nomes que dizem o que houve, capturo só o que sei tratar e deixo o resto subir até uma borda que traduz para HTTP ou para dead-letter. Um tipo <code>Result</code> faz sentido em fluxos onde a falha é um resultado esperado e frequente, mas luta contra a linguagem se usado em tudo.',
      a_en: 'In Python, <b>exceptions</b> are the idiom. I build a hierarchy of domain exceptions with names that say what happened, catch only what I know how to handle and let the rest bubble up to an edge that translates to HTTP or to a dead-letter. A <code>Result</code> type makes sense in flows where failure is an expected, frequent outcome, but fights the language if used everywhere.' },

    /* ===== Performance ===== */
    { cat: 'Performance', cat_en: 'Performance',
      q: 'O que é o GIL e o que muda com o free-threading do 3.13 e 3.14?',
      q_en: 'What is the GIL and what changes with free-threading in 3.13 and 3.14?',
      a: 'O GIL é um mutex que deixa apenas uma thread executar bytecode Python por vez no CPython, o que limita o paralelismo de CPU em threads. A <b>PEP 703</b> torna o GIL opcional: no 3.13 há um build free-threaded experimental e o 3.14 o trata como suportado, ainda como build separado e opcional. Extensões em C precisam ser adaptadas. Para I/O o GIL já é liberado, então o impacto é no trabalho CPU-bound em threads.',
      a_en: 'The GIL is a mutex that lets only one thread run Python bytecode at a time in CPython, limiting CPU parallelism across threads. <b>PEP 703</b> makes the GIL optional: 3.13 ships an experimental free-threaded build and 3.14 treats it as supported, still as a separate, opt-in build. C extensions need adapting. For I/O the GIL is already released, so the impact is on CPU-bound work in threads.' },
    { cat: 'Performance', cat_en: 'Performance',
      q: 'asyncio, threads ou processos: como decidir?',
      q_en: 'asyncio, threads or processes: how do you decide?',
      a: 'Pelo gargalo. <b>I/O-bound</b> com muitas conexões: <code>asyncio</code>. I/O-bound com bibliotecas bloqueantes: threads (ou <code>asyncio.to_thread</code>). <b>CPU-bound</b> em Python puro: processos, ou um motor vetorizado como Polars e NumPy. Misturo com cuidado: bloquear o event loop com trabalho de CPU é o erro clássico.',
      a_en: 'By the bottleneck. <b>I/O-bound</b> with many connections: <code>asyncio</code>. I/O-bound with blocking libraries: threads (or <code>asyncio.to_thread</code>). <b>CPU-bound</b> in pure Python: processes, or a vectorized engine like Polars and NumPy. I mix them carefully: blocking the event loop with CPU work is the classic mistake.' },
    { cat: 'Performance', cat_en: 'Performance',
      q: 'Como você encontra o gargalo de um serviço lento?',
      q_en: 'How do you find the bottleneck of a slow service?',
      a: 'Meço antes de mexer. Começo pelas <b>métricas</b> (latência por rota, saturação), depois um <b>perfil amostral</b> com <code>py-spy</code> no processo vivo, e <code>cProfile</code> ou <code>memray</code> em ambiente controlado para detalhes. Traces distribuídos mostram se o tempo está no Python ou numa chamada externa. Só depois formulo a hipótese e mudo uma coisa por vez.',
      a_en: 'I measure before touching anything. I start with <b>metrics</b> (per-route latency, saturation), then a <b>sampling profile</b> with <code>py-spy</code> on the live process, and <code>cProfile</code> or <code>memray</code> in a controlled environment for detail. Distributed traces show whether time is in Python or in an external call. Only then do I form a hypothesis and change one thing at a time.' },
    { cat: 'Performance', cat_en: 'Performance',
      q: 'Por que Polars costuma ser mais rápido que um laço em Python?',
      q_en: 'Why is Polars usually faster than a Python loop?',
      a: 'Por quatro razões: execução <b>vetorizada</b> em Rust sobre memória <b>colunar</b> (Arrow), <b>paralelismo</b> entre núcleos sem o GIL, avaliação <b>lazy</b> com otimizador (pushdown de filtro e projeção) e menos alocação de objetos Python. O ganho some se você volta a chamar Python por linha com <code>map_elements</code>.',
      a_en: 'For four reasons: <b>vectorized</b> execution in Rust over <b>columnar</b> memory (Arrow), <b>parallelism</b> across cores without the GIL, <b>lazy</b> evaluation with an optimizer (filter and projection pushdown) and fewer Python object allocations. The gain disappears if you call back into Python per row with <code>map_elements</code>.' },
    { cat: 'Performance', cat_en: 'Performance',
      q: 'O que é backpressure e como implementar em asyncio?',
      q_en: 'What is backpressure and how do you implement it in asyncio?',
      a: 'É o mecanismo pelo qual um consumidor lento <b>desacelera o produtor</b> em vez de deixar a fila crescer sem limite. Em asyncio: <code>asyncio.Queue(maxsize=N)</code>, onde <code>put</code> suspende quando a fila enche, e <code>Semaphore</code> para limitar concorrência. A pressão deve chegar até a fonte (TCP, broker), que então reduz o ritmo.',
      a_en: 'It is the mechanism by which a slow consumer <b>slows down the producer</b> instead of letting the queue grow without bound. In asyncio: <code>asyncio.Queue(maxsize=N)</code>, where <code>put</code> suspends when the queue fills, and <code>Semaphore</code> to limit concurrency. The pressure must reach the source (TCP, broker), which then slows down.' },
    { cat: 'Performance', cat_en: 'Performance',
      q: 'Como detectar que o event loop está bloqueado?',
      q_en: 'How do you detect that the event loop is blocked?',
      a: 'Com o <b>modo debug</b> do asyncio (<code>PYTHONASYNCIODEBUG=1</code> ou <code>loop.set_debug(True)</code>), que loga callbacks acima de <code>slow_callback_duration</code>, e com uma métrica de <b>lag do loop</b> em produção (uma tarefa que dorme e mede o atraso real). <code>py-spy dump</code> mostra onde a thread está presa. A cura é mover o trabalho para <code>to_thread</code> ou processos.',
      a_en: 'With asyncio\'s <b>debug mode</b> (<code>PYTHONASYNCIODEBUG=1</code> or <code>loop.set_debug(True)</code>), which logs callbacks above <code>slow_callback_duration</code>, and with a <b>loop lag</b> metric in production (a task that sleeps and measures the real delay). <code>py-spy dump</code> shows where the thread is stuck. The cure is moving the work to <code>to_thread</code> or processes.' },
    { cat: 'Performance', cat_en: 'Performance',
      q: 'Quando recorrer a Numba, Cython ou Rust com PyO3?',
      q_en: 'When do you reach for Numba, Cython or Rust with PyO3?',
      a: 'Só depois do perfil apontar um <b>laço quente numérico</b> que não cabe em expressões vetorizadas. Numba compila funções numéricas com um decorator e dá o menor esforço; Cython e Rust (PyO3, maturin) cobrem casos mais gerais e dão controle de memória, ao custo de build e manutenção. Mantenha o código nativo atrás de uma função Python com o mesmo contrato e testes que comparam as duas versões.',
      a_en: 'Only after the profile points to a <b>hot numeric loop</b> that does not fit vectorized expressions. Numba compiles numeric functions with a decorator and takes the least effort; Cython and Rust (PyO3, maturin) cover more general cases and give memory control, at the cost of build and maintenance. Keep native code behind a Python function with the same contract and tests that compare both versions.' },
    { cat: 'Performance', cat_en: 'Performance',
      q: 'Como reduzir o uso de memória de milhões de objetos Python?',
      q_en: 'How do you cut memory use for millions of Python objects?',
      a: 'Cada instância comum carrega um <code>__dict__</code>. Com <code>__slots__</code> (ou <code>dataclass(slots=True)</code>) o custo cai bastante. Melhor ainda: não criar o objeto, e guardar os dados em estruturas <b>colunares</b> (arrays do Arrow, NumPy ou Polars). Geradores evitam materializar listas, e tipos numéricos menores (<code>int32</code>, <code>float32</code>, <code>Categorical</code>) reduzem o resto. Meça com <code>tracemalloc</code> ou memray.',
      a_en: 'Each regular instance carries a <code>__dict__</code>. With <code>__slots__</code> (or <code>dataclass(slots=True)</code>) the cost drops considerably. Better still: do not create the object, and keep the data in <b>columnar</b> structures (Arrow, NumPy or Polars arrays). Generators avoid materializing lists, and smaller numeric types (<code>int32</code>, <code>float32</code>, <code>Categorical</code>) shrink the rest. Measure with <code>tracemalloc</code> or memray.' },

    /* ===== Dados ===== */
    { cat: 'Dados', cat_en: 'Data',
      q: 'Por que Parquet em vez de CSV?',
      q_en: 'Why Parquet instead of CSV?',
      a: 'Parquet é <b>colunar, tipado e comprimido</b>, com esquema embutido e estatísticas por bloco. A consulta lê só as colunas e os blocos necessários (pushdown), e o formato guarda tipos sem ambiguidade de parsing. CSV é texto linear: precisa ler tudo, inferir tipos e não comprime bem. CSV continua útil como formato de troca simples e legível.',
      a_en: 'Parquet is <b>columnar, typed and compressed</b>, with an embedded schema and per-block statistics. A query reads only the columns and blocks it needs (pushdown), and the format stores types with no parsing ambiguity. CSV is linear text: it must read everything, infer types and does not compress well. CSV remains useful as a simple, human-readable exchange format.' },
    { cat: 'Dados', cat_en: 'Data',
      q: 'Como você escolhe a chave de partição de um lake?',
      q_en: 'How do you choose the partition key of a lake?',
      a: 'Pelo <b>filtro mais comum</b> das consultas e por cardinalidade moderada. Data (ano/mês ou dia) é o caso típico: poda partições e se alinha ao reprocesso. Chave de alta cardinalidade (conta, usuário) gera um oceano de arquivos pequenos. Dentro do arquivo, ordeno pela coluna filtrada para que as estatísticas por bloco pulem dados. Reavalio quando o padrão de consulta muda.',
      a_en: 'By the queries\' <b>most common filter</b> and by moderate cardinality. Date (year/month or day) is the typical case: it prunes partitions and aligns with reprocessing. A high-cardinality key (account, user) creates an ocean of small files. Within the file, I sort by the filtered column so per-block statistics skip data. I reassess when the query pattern changes.' },
    { cat: 'Dados', cat_en: 'Data',
      q: 'O dado é maior que a RAM. Quais são as opções?',
      q_en: 'The data is larger than RAM. What are the options?',
      a: 'Em ordem de esforço: ler só as <b>colunas e partições</b> necessárias; usar o modo <b>lazy/streaming</b> do Polars ou o DuckDB, que processam em lotes e podem usar disco; processar em <b>chunks</b> com agregação incremental; e, se uma máquina não basta, distribuir com Dask, Ray ou Spark. Antes de distribuir, confirme que o formato e as consultas já estão otimizados, porque distribuir amplifica ineficiência.',
      a_en: 'In order of effort: read only the needed <b>columns and partitions</b>; use Polars\' <b>lazy/streaming</b> mode or DuckDB, which process in batches and can spill to disk; process in <b>chunks</b> with incremental aggregation; and, if one machine is not enough, distribute with Dask, Ray or Spark. Before distributing, confirm the format and queries are already optimized, because distribution amplifies inefficiency.' },
    { cat: 'Dados', cat_en: 'Data',
      q: 'DuckDB, Polars ou Spark: como escolher?',
      q_en: 'DuckDB, Polars or Spark: how do you choose?',
      a: '<b>DuckDB</b> quando o time pensa em SQL e o dado cabe numa máquina (inclusive maior que a RAM). <b>Polars</b> quando a transformação é programática e você quer expressões tipadas em Python. <b>Spark</b> quando o volume exige um cluster ou o ecossistema já está lá. Uma máquina moderna aguenta mais do que se costuma supor; comece pelo mais simples e migre se medir que não basta.',
      a_en: '<b>DuckDB</b> when the team thinks in SQL and the data fits on one machine (including larger than RAM). <b>Polars</b> when the transformation is programmatic and you want typed expressions in Python. <b>Spark</b> when volume demands a cluster or the ecosystem is already there. A modern machine handles more than people assume; start with the simplest and migrate if you measure that it is not enough.' },
    { cat: 'Dados', cat_en: 'Data',
      q: 'Como tornar um job de dados idempotente e reprocessável?',
      q_en: 'How do you make a data job idempotent and reprocessable?',
      a: 'Cada execução opera sobre uma <b>partição determinística</b> (por exemplo, um dia) e a escreve de forma <b>atômica e sobrescrevendo</b>: grava num caminho temporário e renomeia, ou substitui a partição inteira. A entrada é imutável e identificada por versão. Reprocessar o mesmo dia produz o mesmo resultado, sem duplicatas, e uma falha no meio não deixa estado parcial visível.',
      a_en: 'Each run operates on a <b>deterministic partition</b> (for example, one day) and writes it <b>atomically and by overwriting</b>: write to a temporary path and rename, or replace the whole partition. Input is immutable and identified by version. Reprocessing the same day produces the same result, with no duplicates, and a mid-run failure leaves no visible partial state.' },
    { cat: 'Dados', cat_en: 'Data',
      q: 'Como evoluir o esquema sem quebrar consumidores?',
      q_en: 'How do you evolve a schema without breaking consumers?',
      a: 'Mudanças <b>aditivas e opcionais</b> primeiro: coluna nova com valor padrão não quebra leitores antigos. Renomear ou mudar tipo vira duas fases: adicionar a nova, migrar consumidores, remover a antiga depois. Versione o contrato, valide-o em CI com testes de esquema e use um formato de tabela (como Iceberg) quando precisar de evolução controlada e transacional.',
      a_en: '<b>Additive, optional</b> changes first: a new column with a default does not break old readers. Renaming or changing a type becomes two phases: add the new one, migrate consumers, remove the old one later. Version the contract, validate it in CI with schema tests and use a table format (such as Iceberg) when you need controlled, transactional evolution.' },
    { cat: 'Dados', cat_en: 'Data',
      q: 'Como testar um pipeline de dados?',
      q_en: 'How do you test a data pipeline?',
      a: 'Em camadas. <b>Funções puras</b> de transformação com amostras pequenas e esperadas explícitas; <b>property-based testing</b> (Hypothesis) para invariantes como "o total não muda após o agrupamento"; <b>testes de contrato de esquema</b> na entrada e na saída; e um teste ponta a ponta com um mini lote realista. Em produção, checagens de qualidade (contagens, nulos, faixas) viram alarmes.',
      a_en: 'In layers. <b>Pure transformation functions</b> with small samples and explicit expected values; <b>property-based testing</b> (Hypothesis) for invariants like "the total does not change after grouping"; <b>schema contract tests</b> on input and output; and an end-to-end test with a realistic mini batch. In production, quality checks (counts, nulls, ranges) become alarms.' },
    { cat: 'Dados', cat_en: 'Data',
      q: 'Dinheiro em dado colunar: Int64 em centavos ou Decimal?',
      q_en: 'Money in columnar data: Int64 cents or Decimal?',
      a: '<b>Inteiro em centavos</b> (ou na menor unidade da moeda) é exato, compacto e rápido em qualquer motor, e é meu padrão para agregações em larga escala. <code>Decimal</code> mantém a escala natural, mas o suporte em motores colunares é menos uniforme e mais lento. Guarde a moeda em coluna própria, converta na borda e nunca use <code>float</code>.',
      a_en: '<b>Integer cents</b> (or the currency\'s smallest unit) are exact, compact and fast in any engine, and are my default for large-scale aggregations. <code>Decimal</code> keeps the natural scale, but support in columnar engines is less uniform and slower. Keep the currency in its own column, convert at the edge and never use <code>float</code>.' }
  ];

  /* ---------- Ferramentas do ecossistema, por tipo de problema ---------- */
  window.PY_TOOLKIT = [
    { cat: 'Concorrência e I/O', cat_en: 'Concurrency and I/O',
      tools: [
        { n: 'asyncio', n_en: 'asyncio', d: 'Event loop, corrotinas, <code>TaskGroup</code> e filas na biblioteca padrão.', d_en: 'Event loop, coroutines, <code>TaskGroup</code> and queues in the standard library.' },
        { n: 'httpx', n_en: 'httpx', d: 'Cliente HTTP síncrono e assíncrono, com timeouts e pool de conexões.', d_en: 'Synchronous and asynchronous HTTP client, with timeouts and connection pooling.' },
        { n: 'aiokafka', n_en: 'aiokafka', d: 'Produtor e consumidor Kafka para asyncio.', d_en: 'Kafka producer and consumer for asyncio.' },
        { n: 'concurrent.futures', n_en: 'concurrent.futures', d: '<code>ThreadPoolExecutor</code> e <code>ProcessPoolExecutor</code> com a mesma interface.', d_en: '<code>ThreadPoolExecutor</code> and <code>ProcessPoolExecutor</code> with the same interface.' }
      ] },
    { cat: 'Dados e formatos', cat_en: 'Data and formats',
      tools: [
        { n: 'Polars', n_en: 'Polars', d: 'DataFrames colunares com avaliação lazy e paralelismo.', d_en: 'Columnar DataFrames with lazy evaluation and parallelism.' },
        { n: 'PyArrow', n_en: 'PyArrow', d: 'Memória colunar Arrow e leitura e escrita de Parquet.', d_en: 'Arrow columnar memory and Parquet reading and writing.' },
        { n: 'DuckDB', n_en: 'DuckDB', d: 'Banco analítico embutido que consulta Parquet e CSV com SQL.', d_en: 'Embedded analytical database that queries Parquet and CSV with SQL.' },
        { n: 'Dask, Ray e PySpark', n_en: 'Dask, Ray and PySpark', d: 'Distribuição quando uma máquina não basta.', d_en: 'Distribution when one machine is not enough.' }
      ] },
    { cat: 'Qualidade e tipos', cat_en: 'Quality and types',
      tools: [
        { n: 'pytest e Hypothesis', n_en: 'pytest and Hypothesis', d: 'Testes com fixtures e testes baseados em propriedades.', d_en: 'Tests with fixtures and property-based tests.' },
        { n: 'mypy e pyright', n_en: 'mypy and pyright', d: 'Checagem estática de tipos, rodada em CI.', d_en: 'Static type checking, run in CI.' },
        { n: 'ruff', n_en: 'ruff', d: 'Linter e formatador rápidos, um só binário.', d_en: 'A fast linter and formatter in a single binary.' },
        { n: 'import-linter', n_en: 'import-linter', d: 'Contratos de dependência entre pacotes, checados no build.', d_en: 'Dependency contracts between packages, enforced in the build.' }
      ] },
    { cat: 'Serviço e contratos', cat_en: 'Services and contracts',
      tools: [
        { n: 'FastAPI', n_en: 'FastAPI', d: 'API assíncrona com injeção por <code>Depends</code> e OpenAPI gerado do código.', d_en: 'Async API with <code>Depends</code> injection and OpenAPI generated from code.' },
        { n: 'Pydantic', n_en: 'Pydantic', d: 'Validação e serialização de dados na borda a partir de type hints.', d_en: 'Edge validation and serialization of data from type hints.' },
        { n: 'SQLAlchemy e Alembic', n_en: 'SQLAlchemy and Alembic', d: 'ORM e migrações para os read models relacionais.', d_en: 'ORM and migrations for relational read models.' },
        { n: 'Redis', n_en: 'Redis', d: 'Cache compartilhado e estruturas simples de coordenação.', d_en: 'Shared cache and simple coordination structures.' }
      ] },
    { cat: 'Profiling e performance', cat_en: 'Profiling and performance',
      tools: [
        { n: 'cProfile e py-spy', n_en: 'cProfile and py-spy', d: 'Perfil determinístico e perfil amostral de processo vivo.', d_en: 'Deterministic profile and sampling profile of a live process.' },
        { n: 'memray e tracemalloc', n_en: 'memray and tracemalloc', d: 'Onde a memória foi alocada, linha a linha.', d_en: 'Where memory was allocated, line by line.' },
        { n: 'Numba, Cython e PyO3', n_en: 'Numba, Cython and PyO3', d: 'Código nativo para laços numéricos quentes.', d_en: 'Native code for hot numeric loops.' },
        { n: 'timeit e pytest-benchmark', n_en: 'timeit and pytest-benchmark', d: 'Micro e macrobenchmarks repetíveis.', d_en: 'Repeatable micro and macro benchmarks.' }
      ] },
    { cat: 'Empacotamento e observabilidade', cat_en: 'Packaging and observability',
      tools: [
        { n: 'uv', n_en: 'uv', d: 'Gerenciador de ambientes, dependências e lockfile.', d_en: 'Environment, dependency and lockfile manager.' },
        { n: 'Docker', n_en: 'Docker', d: 'Imagem multi-stage, enxuta e sem privilégio.', d_en: 'Multi-stage image, lean and unprivileged.' },
        { n: 'OpenTelemetry', n_en: 'OpenTelemetry', d: 'Traces, métricas e logs com um padrão aberto.', d_en: 'Traces, metrics and logs with an open standard.' },
        { n: 'structlog', n_en: 'structlog', d: 'Logs estruturados com contexto ligado a cada requisição.', d_en: 'Structured logs with context bound to each request.' }
      ] }
  ];

  /* ---------- Mapa para a trilha ---------- */
  window.COURSE_MAP = [
    { n: '01', t: 'Ingestão e concorrência', t_en: 'Ingestion and concurrency',
      d: L('asyncio', 'asyncio') + ', ' + L('async-patterns', 'async patterns') + ', ' + L('threading', 'threading') + ', ' + L('multiprocessing', 'multiprocessing') + '. Etapa 10.',
      d_en: L('asyncio', 'asyncio') + ', ' + L('async-patterns', 'async patterns') + ', ' + L('threading', 'threading') + ', ' + L('multiprocessing', 'multiprocessing') + '. Stage 10.' },
    { n: '02', t: 'Domínio e contratos', t_en: 'Domain and contracts',
      d: L('hexagonal', 'Hexagonal') + ', ' + L('ddd-tatico', 'DDD tático') + ', ' + L('dataclasses-pydantic', 'Pydantic') + ', ' + L('protocols-abc', 'Protocols') + '. Etapas 3 e 9.',
      d_en: L('hexagonal', 'Hexagonal') + ', ' + L('ddd-tatico', 'tactical DDD') + ', ' + L('dataclasses-pydantic', 'Pydantic') + ', ' + L('protocols-abc', 'Protocols') + '. Stages 3 and 9.' },
    { n: '03', t: 'Princípios e padrões', t_en: 'Principles and patterns',
      d: L('srp', 'SRP') + ', ' + L('dip', 'DIP') + ', ' + L('strategy', 'Strategy') + ', ' + L('decorator-pattern', 'Decorator') + ', ' + L('adapter', 'Adapter') + '. Etapas 5 a 8.',
      d_en: L('srp', 'SRP') + ', ' + L('dip', 'DIP') + ', ' + L('strategy', 'Strategy') + ', ' + L('decorator-pattern', 'Decorator') + ', ' + L('adapter', 'Adapter') + '. Stages 5 to 8.' },
    { n: '04', t: 'Performance', t_en: 'Performance',
      d: L('profiling', 'Profiling') + ', ' + L('estruturas-eficientes', 'estruturas') + ', ' + L('numpy-vetorizacao', 'NumPy') + ', ' + L('gil-modelo', 'GIL') + '. Etapa 11.',
      d_en: L('profiling', 'Profiling') + ', ' + L('estruturas-eficientes', 'structures') + ', ' + L('numpy-vetorizacao', 'NumPy') + ', ' + L('gil-modelo', 'GIL') + '. Stage 11.' },
    { n: '05', t: 'Large data', t_en: 'Large data',
      d: L('polars', 'Polars') + ', ' + L('arrow-parquet', 'Arrow e Parquet') + ', ' + L('duckdb', 'DuckDB') + ', ' + L('out-of-core', 'out-of-core') + ', ' + L('pipelines-dados', 'pipelines') + '. Etapa 12.',
      d_en: L('polars', 'Polars') + ', ' + L('arrow-parquet', 'Arrow and Parquet') + ', ' + L('duckdb', 'DuckDB') + ', ' + L('out-of-core', 'out-of-core') + ', ' + L('pipelines-dados', 'pipelines') + '. Stage 12.' },
    { n: '06', t: 'Produção', t_en: 'Production',
      d: L('fastapi-servicos', 'FastAPI') + ', ' + L('observabilidade', 'observabilidade') + ', ' + L('packaging', 'empacotamento') + ', ' + L('deploy-python', 'deploy') + '. Etapa 13.',
      d_en: L('fastapi-servicos', 'FastAPI') + ', ' + L('observabilidade', 'observability') + ', ' + L('packaging', 'packaging') + ', ' + L('deploy-python', 'deploy') + '. Stage 13.' }
  ];
})();
