/* Vektia Python, PT -> EN for the architecture case study page (pipeline.html).
   - I18N.register: static labels, headings, flow text and tweak-panel strings.
   - window.PIPE_COPY: paragraphs that carry inline markup, in both languages, applied by the page.
   Data-driven content (stages, layers, steps, pillars, Q&A) carries its own *_en fields. */
(function () {
  window.PIPE_COPY = {
    h1: { pt: 'Arquitetura <em>de referência</em>', en: 'Reference <em>architecture</em>' },
    sub: {
      pt: 'Um sistema Python de produção aberto estágio a estágio: ingestão assíncrona, domínio e validação, processamento em larga escala, armazenamento analítico e serviço. É onde Clean Code, SOLID, patterns, performance e large data deixam de ser lições isoladas e viram um desenho único.',
      en: 'A production Python system opened up stage by stage: asynchronous ingestion, domain and validation, large-scale processing, analytical storage and serving. This is where Clean Code, SOLID, patterns, performance and large data stop being isolated lessons and become one design.'
    },
    intro: {
      pt: '<strong>Por que este estudo de caso?</strong> A <a href="curriculum.html#etapa-9">Etapa 9</a> apresenta os architecture patterns um a um. Aqui eles aparecem juntos, em uma <b>plataforma de ingestão e análise de transações financeiras</b>: 5 estágios, cada um com o padrão que resolve o seu problema, o código que o mostra e as armadilhas que custam caro. Os estágios seguem o gargalo real: espera de rede na borda (<a href="curriculum.html#etapa-10">Etapa 10</a>), CPU e memória no núcleo (<a href="curriculum.html#etapa-11">Etapa 11</a>), volume e formato nos dados (<a href="curriculum.html#etapa-12">Etapa 12</a>) e operação em produção (<a href="curriculum.html#etapa-13">Etapa 13</a>).<br><br>É um <strong>desenho de referência didático</strong>, não a descrição de um sistema específico. Os números das métricas são alvos para discutir trade-offs; meça no seu dado antes de adotá-los.',
      en: '<strong>Why this case study?</strong> <a href="curriculum.html#etapa-9">Stage 9</a> presents the architecture patterns one by one. Here they show up together, in a <b>financial transaction ingestion and analysis platform</b>: 5 stages, each with the pattern that solves its problem, the code that shows it and the pitfalls that cost dearly. The stages follow the real bottleneck: network waiting at the edge (<a href="curriculum.html#etapa-10">Stage 10</a>), CPU and memory in the core (<a href="curriculum.html#etapa-11">Stage 11</a>), volume and format in the data (<a href="curriculum.html#etapa-12">Stage 12</a>) and operation in production (<a href="curriculum.html#etapa-13">Stage 13</a>).<br><br>This is a <strong>didactic reference design</strong>, not the description of a specific system. The metric figures are targets for discussing trade-offs; measure on your own data before adopting them.'
    },
    bottleneck: {
      pt: 'Os estágios 01 e 02 esperam rede e rodam bem em <code>asyncio</code>, numa thread só. O estágio 03 é CPU-bound e pede processos ou um motor vetorizado. Misturar os dois no mesmo event loop é o erro clássico: um cálculo pesado dentro de <code>async def</code> congela a ingestão inteira.',
      en: 'Stages 01 and 02 wait on the network and run well on <code>asyncio</code>, in a single thread. Stage 03 is CPU-bound and calls for processes or a vectorized engine. Mixing the two on the same event loop is the classic mistake: a heavy computation inside <code>async def</code> freezes the whole ingestion.'
    },
    prod: {
      pt: 'O desenho acima roda em um repositório e uma máquina. Para virar um serviço operado por um time, cada papel precisa de um equivalente de produção: buffer durável, execução escalável, orquestração com reprocesso, lake catalogado, segredos, telemetria e entrega contínua. As duas abas mostram a <em>mesma forma</em> em uma nuvem pública e em infraestrutura aberta.',
      en: 'The design above runs in one repository and one machine. To become a service operated by a team, each role needs a production equivalent: durable buffer, scalable execution, orchestration with reprocessing, cataloged lake, secrets, telemetry and continuous delivery. The two tabs show the <em>same shape</em> on a public cloud and on open infrastructure.'
    },
    cycle: {
      pt: 'Como um sistema como este nasce e evolui: do vocabulário do domínio até a observabilidade em produção. Cada passo aponta para as lições da trilha. Clique para abrir o detalhe.',
      en: 'How a system like this is born and evolves: from the domain vocabulary to observability in production. Each step points to lessons in the course. Click to open the detail.'
    },
    loop: {
      pt: 'O passo 9 realimenta o passo 1. O que a produção revela (um incidente, uma consulta lenta, uma regra que faltava) volta como modelo de domínio melhor, teste novo ou contrato mais estrito. Arquitetura não é um desenho feito uma vez.',
      en: 'Step 9 feeds step 1. What production reveals (an incident, a slow query, a missing rule) comes back as a better domain model, a new test or a stricter contract. Architecture is not a drawing made once.'
    },
    pillars: {
      pt: 'Os seis pilares do AWS Well-Architected, aplicados a um serviço Python. Numa entrevista sênior, o que realmente cobram são os <em>trade-offs entre eles</em>. Clique em cada pilar para ver as práticas concretas.',
      en: 'The six pillars of the AWS Well-Architected Framework, applied to a Python service. In a senior interview, what they really probe is the <em>trade-offs between them</em>. Click each pillar to see the concrete practices.'
    },
    chartsub: {
      pt: 'Do script ao sistema com SLOs. A barra é uma régua ilustrativa da parcela das práticas garantida por automação, não por disciplina individual.',
      en: 'From script to a system with SLOs. The bar is an illustrative gauge of the share of practices guaranteed by automation rather than individual discipline.'
    },
    qa: {
      pt: 'Um banco de perguntas no estilo das entrevistas sênior, sobre arquitetura, design, performance e dados. Escolha um tema e clique para revelar a resposta, no melhor formato de active recall: tente responder de cabeça antes de abrir.',
      en: 'A question bank in the style of senior interviews, covering architecture, design, performance and data. Pick a topic and click to reveal the answer, in the best active-recall format: try to answer from memory before opening it.'
    },
    tools: {
      pt: 'O ecossistema Python usado neste desenho, organizado por tipo de problema. Logo abaixo, o mapa que liga cada tema deste estudo de caso às lições da trilha.',
      en: 'The Python ecosystem used in this design, organized by type of problem. Right below, the map that links each theme of this case study to the lessons in the course.'
    }
  };

  if (!window.I18N) return;
  window.I18N.register({
    'Arquitetura de referência, Vektia Python': 'Reference architecture, Vektia Python',
    'Case study · plataforma de transações financeiras': 'Case study · financial transactions platform',

    /* ---------- section titles ---------- */
    'Visão end-to-end': 'End-to-end view',
    'Os 5 estágios, por dentro': 'The 5 stages, inside out',
    'Do código à produção': 'From code to production',
    'Ciclo de engenharia em 9 passos': 'Engineering cycle in 9 steps',
    'Atributos de qualidade e maturidade': 'Quality attributes and maturity',
    'Perguntas de entrevista de arquitetura Python': 'Python architecture interview questions',
    'Ferramentas & trilha do curso': 'Tools & course path',
    'Trilha do curso, tema a tema': 'Course path, theme by theme',
    'Lições transferíveis de arquitetura': 'Transferable architecture lessons',
    'expandir tudo ↓': 'expand all ↓',
    'recolher tudo ↑': 'collapse all ↑',

    /* ---------- end-to-end flow ---------- */
    'BORDA · I/O-BOUND · asyncio': 'EDGE · I/O-BOUND · asyncio',
    'NÚCLEO · CPU-BOUND · Polars + processos': 'CORE · CPU-BOUND · Polars + processes',
    'DADOS E CONSUMO · leitura': 'DATA AND CONSUMPTION · reads',
    'DOMÍNIO': 'DOMAIN', 'DADOS': 'DATA',
    'Ingestão assíncrona': 'Asynchronous ingestion',
    'Domínio e validação': 'Domain and validation',
    'Processamento em larga escala': 'Large-scale processing',
    'Armazenamento analítico': 'Analytical storage',
    'Serviço e consumo': 'Serving and consumption',
    'asyncio · fila limitada · backpressure': 'asyncio · bounded queue · backpressure',
    'hexagonal · Pydantic na borda · value objects': 'hexagonal · Pydantic at the edge · value objects',
    'Polars lazy · Arrow · multiprocessing': 'lazy Polars · Arrow · multiprocessing',
    'Parquet por data · DuckDB': 'date-partitioned Parquet · DuckDB',
    'FastAPI · CQRS · cache': 'FastAPI · CQRS · cache',
    'eventos validados em lotes Arrow': 'validated events in Arrow batches',
    'Parquet particionado por data': 'date-partitioned Parquet',
    'ONDE ESTÁ O GARGALO': 'WHERE THE BOTTLENECK IS',
    'O CICLO SE FECHA': 'THE CYCLE CLOSES',

    /* ---------- stage tags and miniflows ---------- */
    'ARQUITETURA': 'ARCHITECTURE', 'CPU LEVE': 'LIGHT CPU', 'COLUNAR': 'COLUMNAR',
    'fonte (HTTP/stream)': 'source (HTTP/stream)', 'fila limitada': 'bounded queue',
    'N workers': 'N workers', 'validação': 'validation', 'lote em disco': 'batch on disk',
    'bytes': 'bytes', 'Pydantic (borda)': 'Pydantic (edge)', 'value objects': 'value objects',
    'entidade Transação': 'Transaction entity', 'porta Repositório': 'Repository port',
    'Parquet de saída': 'output Parquet',
    'lote processado': 'processed batch', 'escrita Parquet': 'Parquet write',
    'partição ano/mês': 'year/month partition', 'catálogo': 'catalog', 'consulta DuckDB': 'DuckDB query',
    'camada de serviço': 'service layer',

    /* ---------- architecture tabs and tables ---------- */
    'Mapeamento de componentes': 'Component mapping',
    'Cada preocupação do sistema → o serviço AWS que a resolve em produção.': 'Each system concern → the AWS service that solves it in production.',
    'A mesma forma, 100% open source, para quem prefere self-host e portabilidade.': 'The same shape, 100% open source, for those who prefer self-hosting and portability.',
    'Preocupação': 'Concern', 'Neste projeto': 'In this project', 'Serviço AWS': 'AWS service',
    'Por quê': 'Why', 'Equivalente open source': 'Open source equivalent',

    /* ---------- pattern names in stage details ---------- */
    'DDD tático': 'Tactical DDD', 'Polars lazy + expressões': 'Lazy Polars + expressions',
    'Event loop + corrotinas': 'Event loop + coroutines',
    'Produtor/consumidor com backpressure': 'Producer/consumer with backpressure',
    'Mensageria e eventos': 'Messaging and events',
    'Erros como parte do design': 'Errors as part of the design',
    'Dataclasses e Pydantic': 'Dataclasses and Pydantic', 'Protocols como portas': 'Protocols as ports',
    'Arrow como formato de troca': 'Arrow as the exchange format',
    'Profiling antes de otimizar': 'Profiling before optimizing',
    'Parquet e Arrow': 'Parquet and Arrow', 'DuckDB embutido': 'Embedded DuckDB',
    'Pipelines de dados': 'Data pipelines', 'FastAPI e contratos': 'FastAPI and contracts',
    'CQRS e read models': 'CQRS and read models', 'Service layer': 'Service layer',
    'Decorator para cache': 'Decorator for caching', 'Injeção de dependência': 'Dependency injection',

    /* ---------- maturity ---------- */
    'Níveis de maturidade de engenharia': 'Engineering maturity levels',
    'Depende de revisão manual': 'Depends on manual review',
    'Garantido por automação': 'Guaranteed by automation',
    'Nível': 'Level', 'Como é': 'What it looks like', 'Sinal de que chegou': 'Sign you have arrived',

    /* ---------- tweaks panel ---------- */
    'Ajustes': 'Settings', 'Abrir ajustes': 'Open settings', 'Ajustes da página': 'Page settings',
    'Personalize a apresentação, salvo neste navegador.': 'Customize the presentation, saved in this browser.',
    'Cor de destaque': 'Accent color', 'Azul': 'Blue', 'Violeta': 'Violet', 'Esmeralda': 'Emerald', 'Âmbar': 'Amber',
    'Densidade': 'Density', 'Confortável': 'Comfortable', 'Compacto': 'Compact',
    'Estágios ao abrir': 'Stages on open', 'Recolhidos': 'Collapsed', 'Expandidos': 'Expanded',
    'Arquitetura inicial': 'Initial architecture',
    'Diagramas de fluxo': 'Flow diagrams', 'Mostrar': 'Show', 'Ocultar': 'Hide',
    'restaurar padrões': 'restore defaults'
  });
})();
