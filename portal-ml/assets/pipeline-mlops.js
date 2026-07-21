/* Pipeline page, MLOps reference content
   Sources: user's AWS 9-step reference architecture, AWS Well-Architected
   ML Lens (6 pillars), 360DigitMG interview Q&A, DataTalksClub MLOps Zoomcamp,
   visenger/awesome-mlops. */

/* ---------- Reference AWS MLOps pipeline (9 steps) ---------- */
window.AWS_PIPELINE_9 = [
  {
    t: 'Ingestão de Dados',
    d: 'ETL das fontes brutas (bancos transacionais, data lake) para um formato catalogado e consultável, disparado sob orquestração, nada de cópia manual.',
    bullets: [
      '<b>AWS Glue</b> (Crawler + Jobs) faz o ETL das fontes, bancos transacionais, data lake em S3, e cataloga o schema no <b>Glue Data Catalog</b>, tornando os dados descobríveis.',
      'Orquestração por <b>Apache Airflow (Amazon MWAA)</b> ou <b>Step Functions</b>: dispara o job, mantém logs e versiona cada execução.',
      'É o equivalente produtivo do estágio 01 do pipeline de áudio, só que sobre dados tabulares, com descoberta de schema automática.'
    ],
    svc: ['Glue', 'Glue Data Catalog', 'S3', 'MWAA / Step Functions']
  },
  {
    t: 'Validação e Preparação de Dados',
    d: 'Fail-fast de qualidade + transformação em features versionadas, a ponte entre dados crus e o que o modelo consome, sem training-serving skew.',
    bullets: [
      'Validação de schema e detecção de dados corrompidos com <b>Glue DataBrew</b> ou scripts <b>Great Expectations</b> rodando em job Glue/Lambda, o análogo direto do estágio 02.',
      'Split treino/validação, normalização, encoding e feature engineering.',
      '<b>SageMaker Feature Store</b> versiona e serve as features nos dois lados: <em>offline store</em> (histórico, treino) e <em>online store</em> (baixa latência, inferência), garantindo consistência treino↔serving.'
    ],
    svc: ['Glue DataBrew', 'Great Expectations', 'SageMaker Feature Store', 'Lambda']
  },
  {
    t: 'Versionamento e Rastreabilidade',
    d: 'Todo experimento reproduzível: dataset + features + código, com hash, ligados à métrica que produziram.',
    bullets: [
      'Dataset, features e código com <b>hash logado no MLflow</b> (self-hosted em EC2/ECS ou <b>SageMaker managed MLflow</b>), reprodutibilidade e auditoria.',
      'Código versionado no <b>CodeCommit</b> ou <b>GitHub</b>, integrado ao pipeline via <b>CodePipeline</b>.',
      'Fecha o loop conceitual da Etapa 09 (Git & DVC) e da Etapa 10 (Model Registry): os três eixos, código, dados, modelo, todos rastreáveis.'
    ],
    svc: ['MLflow', 'CodeCommit / GitHub', 'CodePipeline']
  },
  {
    t: 'Treinamento do Modelo',
    d: 'Treino gerenciado e reprodutível: mesma imagem, mesmo seed, mesmos hiperparâmetros, sempre logados.',
    bullets: [
      '<b>SageMaker Training Jobs</b>: hiperparâmetros e artefato do modelo salvos automaticamente no <b>S3</b> e registrados no <b>MLflow</b>.',
      'Reprodutibilidade garantida pela tríade: mesma <b>imagem de container (ECR)</b>, mesmo <b>seed</b>, mesmos <b>hiperparâmetros</b> logados.',
      'Spot instances e distributed training entram aqui quando o custo/escala pede, sem mudar a história de tracking.'
    ],
    svc: ['SageMaker Training Jobs', 'ECR', 'S3', 'MLflow']
  },
  {
    t: 'Avaliação do Modelo',
    d: 'O gate de qualidade, só avança quem bate o threshold. E a métrica certa importa mais que a métrica bonita.',
    bullets: [
      '<b>SageMaker Processing Jobs</b> aplicam os dados de validação e calculam métricas (accuracy, precision, recall, F1).',
      '<b>O gap que discutimos:</b> em dataset desbalanceado, foco em <em>precision/recall/F1</em>, não em accuracy, 99% de accuracy é inútil se a classe rara (fraude) é o que importa.',
      'Gate de qualidade: só passa para o próximo passo se a métrica cruzar o threshold definido. Reprova → não promove.'
    ],
    svc: ['SageMaker Processing', 'CloudWatch']
  },
  {
    t: 'Registro do Modelo',
    d: 'Onde a governança acontece: versão aprovada + linhagem completa + aprovação antes de qualquer deploy.',
    bullets: [
      '<b>SageMaker Model Registry</b> versiona o modelo aprovado com metadata de <b>linhagem</b>: qual dataset, qual código, qual métrica o produziu.',
      'Governança explícita: aprovação <b>manual ou automática</b> como pré-condição para o deploy, o modelo não vaza para produção por acidente.',
      'Stages (staging → production → archived) permitem rollback instantâneo para a versão anterior.'
    ],
    svc: ['SageMaker Model Registry']
  },
  {
    t: 'Deploy (CI/CD)',
    d: 'Do merge aprovado ao endpoint no ar, automatizado, com estratégia de rollback seguro embutida.',
    bullets: [
      'Empacotamento em container <b>Docker</b>, imagem no <b>ECR</b>.',
      'Deploy via <b>SageMaker Endpoints</b> (inferência online) com <b>blue/green ou canary</b> nativo, rollback seguro se as métricas degradarem.',
      'Cache de features pré-calculadas em <b>ElastiCache (Redis)</b> para baixa latência.',
      'Fluxo inteiro automatizado por <b>CodePipeline + CodeBuild</b>, disparado por merge aprovado.'
    ],
    svc: ['ECR', 'SageMaker Endpoints', 'ElastiCache (Redis)', 'CodePipeline + CodeBuild']
  },
  {
    t: 'Monitoramento',
    d: 'O modelo apodrece em silêncio, monitorar entrada, infra e (quando os labels chegam) performance real.',
    bullets: [
      '<b>SageMaker Model Monitor</b> detecta <b>data drift</b> na distribuição de entrada via <b>PSI/KS test</b> automático.',
      '<b>CloudWatch</b> cobre logs de inferência, latência e saúde da infra.',
      'Quando os <b>labels reais chegam</b> (delay natural em fraude, por ex.), um job batch recalcula precision/recall reais → detecta <b>concept drift</b>, não só data drift.'
    ],
    svc: ['SageMaker Model Monitor', 'CloudWatch', 'Batch job']
  },
  {
    t: 'Feedback Loop / Retreino',
    d: 'O que separa ML de software tradicional: o sistema se reentrena sozinho quando o mundo muda.',
    bullets: [
      '<b>EventBridge</b> dispara o pipeline automaticamente quando o Model Monitor aciona um <b>alarme de drift</b>, ou em cadência agendada (ex: semanal).',
      'O retreino <b>reinicia o pipeline a partir do passo 1</b>, fechando o ciclo, sem intervenção manual constante.',
      'Antes de promover o modelo retreinado, ele passa de novo pelo gate de avaliação (passo 5): retreinar com dados ruins pode piorar.'
    ],
    svc: ['EventBridge', 'pipeline completo (passo 1→9)']
  }
];

/* ---------- AWS Well-Architected ML Lens, 6 pillars ---------- */
window.WELL_ARCHITECTED = [
  {
    icon: '⚙',
    t: 'Operational Excellence',
    q: 'Executar e monitorar sistemas para entregar valor de negócio e melhorar continuamente.',
    body: [
      '<b>Automação end-to-end:</b> pipelines de dados, treino e deploy versionados e reprodutíveis (passos 1–9), não scripts manuais.',
      '<b>Observabilidade de ML:</b> vá além de logs de app, rastreie linhagem de modelo, versões de dataset e métricas de cada run.',
      '<b>Runbooks e rollback:</b> processos definidos para promover, despromover e reverter modelos. Um deploy sem plano de rollback é um risco.',
      '<b>Melhoria contínua:</b> post-mortems de incidentes de modelo alimentam de volta o design do pipeline.'
    ],
    tradeoff: 'Mais automação custa esforço inicial de engenharia, mas paga em confiabilidade e velocidade de iteração.'
  },
  {
    icon: '🔒',
    t: 'Security',
    q: 'Proteger dados, sistemas e ativos, e gerenciar acesso com o menor privilégio.',
    body: [
      '<b>Dados criptografados</b> em repouso (KMS) e em trânsito (TLS), crítico para dados sensíveis (áudio de call-center, PII, dados financeiros).',
      '<b>IAM least-privilege:</b> cada componente (training job, endpoint, pipeline) só acessa o que precisa.',
      '<b>Isolamento de rede:</b> VPC endpoints, sem exposição pública dos endpoints de inferência.',
      '<b>Segredos gerenciados:</b> tokens e credenciais no Secrets Manager, nunca em <code>.env</code> ou hard-coded.',
      '<b>Governança de modelo:</b> quem pode aprovar, deployar e acessar cada versão, trilha de auditoria completa.'
    ],
    tradeoff: 'Controles mais rígidos adicionam latência operacional (aprovações, perímetros), mas são inegociáveis com dados regulados.'
  },
  {
    icon: '🛡',
    t: 'Reliability',
    q: 'Garantir que a workload execute a função pretendida corretamente e se recupere de falhas.',
    body: [
      '<b>Recuperação de falhas:</b> retries idempotentes nos jobs, checkpoints de treino, dead-letter queues.',
      '<b>Retraining confiável:</b> o loop de feedback (passo 9) precisa ser tão robusto quanto o deploy inicial.',
      '<b>Degradação graciosa:</b> fallback de modelo (como a cadeia MossFormer3→2→SepFormer do estágio 03) e endpoints multi-AZ.',
      '<b>Testes de modelo:</b> validação contra baseline antes de cada promoção, o gate do passo 5.'
    ],
    tradeoff: 'Redundância (multi-region, multi-AZ) aumenta o custo, balanceie com o pilar de Cost Optimization conforme o SLA do negócio.'
  },
  {
    icon: '⚡',
    t: 'Performance Efficiency',
    q: 'Usar os recursos computacionais certos e mantê-los eficientes conforme a demanda muda.',
    body: [
      '<b>Recurso certo para a tarefa:</b> GPU (ml.g5.*) para treino/inferência pesada, CPU/serverless para pré-processamento leve, como o pipeline de áudio faz entre M1 e T4.',
      '<b>Escala elástica:</b> auto-scaling de endpoints, batch transform para cargas assíncronas.',
      '<b>Otimização de modelo:</b> quantização, distilação e chunked inference (estágio 03) para caber no hardware e reduzir latência.',
      '<b>Caching:</b> features pré-calculadas em ElastiCache para servir em <10ms.'
    ],
    tradeoff: 'Hardware mais potente resolve latência mas eleva custo, meça antes de superdimensionar (right-sizing).'
  },
  {
    icon: '💰',
    t: 'Cost Optimization',
    q: 'Entregar valor de negócio pelo menor preço, evitando custos desnecessários.',
    body: [
      '<b>Spot instances</b> para treino tolerante a interrupção, até 90% mais barato.',
      '<b>Right-sizing:</b> não use uma p4d.24xlarge para um modelo que cabe numa g5.xlarge.',
      '<b>Serverless e batch:</b> pague por uso; batch é muito mais barato quando a latência não é crítica.',
      '<b>Scale-to-zero</b> fora de pico e desligamento de recursos ociosos.',
      '<b>Gate de qualidade antes de compute caro</b> (o princípio fail-fast do estágio 02): validar barato antes de treinar caro.'
    ],
    tradeoff: 'Cortar custo agressivamente pode ferir reliability e performance, o equilíbrio depende da criticidade da workload.'
  },
  {
    icon: '🌱',
    t: 'Sustainability',
    q: 'Minimizar o impacto ambiental da execução de workloads de nuvem.',
    body: [
      '<b>Eficiência energética:</b> modelos menores e otimizados consomem menos compute por predição.',
      '<b>Regiões de baixo carbono</b> e utilização alta de recursos (menos desperdício ocioso).',
      '<b>Retreino sob demanda</b> (trigger por drift), não retreino cego e frequente que queima GPU à toa.',
      '<b>Managed services</b> tendem a operar em datacenters mais eficientes que infra própria subutilizada.'
    ],
    tradeoff: 'O pilar mais novo do framework, frequentemente alinhado com Cost Optimization (menos compute = menos custo e menos carbono).'
  }
];

/* ---------- MLOps interview questions (curated, 360DigitMG-style) ---------- */
window.INTERVIEW_QA = [
  {
    cat: 'Fundamentos',
    q: 'O que é MLOps e como difere de DevOps?',
    a: 'MLOps estende as práticas de DevOps para sistemas de ML. A diferença central: DevOps versiona <b>código</b>; MLOps versiona <b>três eixos</b>, código, dados e modelo. Além disso, modelos <em>degradam</em> em produção (drift) mesmo sem mudança de código, exigindo monitoramento de dados/performance e um loop de retreino, algo que software tradicional não precisa.'
  },
  {
    cat: 'Fundamentos',
    q: 'Explique os três níveis de maturidade MLOps.',
    a: '<b>Level 0 (manual):</b> processo script-driven, notebooks, deploy manual e raro, sem CI/CD. <b>Level 1 (ML pipeline automation):</b> pipeline de treino automatizado, retraining contínuo, validação automática de dados/modelo, feature store. <b>Level 2 (CI/CD pipeline automation):</b> CI/CD do próprio pipeline, mudanças no código do pipeline são testadas e deployadas automaticamente. A maioria das organizações vive entre 0 e 1; poucas realmente precisam de 2.'
  },
  {
    cat: 'Dados & Features',
    q: 'O que é training-serving skew e como um Feature Store resolve?',
    a: 'É quando a feature computada no treino difere da computada no serving (ex: uma reimplementada em SQL para treino e em Python para produção divergem sutilmente). O modelo recebe inputs inconsistentes e a performance cai inexplicavelmente. Um <b>Feature Store</b> define a feature <em>uma vez</em> e serve tanto o offline store (treino) quanto o online store (serving) a partir do mesmo cálculo, eliminando o skew.'
  },
  {
    cat: 'Dados & Features',
    q: 'O que é point-in-time correctness e por que importa?',
    a: 'Ao montar o dataset histórico de treino, cada exemplo deve usar o valor da feature <b>como era naquele momento</b>, não o valor atual. Usar o estado de hoje vaza informação do futuro (leakage), métricas ótimas no treino, fracasso em produção. Feature stores fazem <em>point-in-time joins</em> automaticamente.'
  },
  {
    cat: 'Métricas',
    q: 'Por que accuracy pode enganar em dataset desbalanceado?',
    a: 'Num dataset 99% negativo (ex: fraude), um modelo que prevê "sempre negativo" tem 99% de accuracy e é <b>inútil</b>, nunca detecta a classe rara que importa. Nesses casos foque em <b>precision</b> (dos alarmes, quantos reais), <b>recall</b> (das fraudes reais, quantas peguei), <b>F1</b> (equilíbrio) e <b>PR-AUC</b>. A métrica certa depende do custo de falso-positivo vs falso-negativo.'
  },
  {
    cat: 'Métricas',
    q: 'Diferencie data drift de concept drift.',
    a: '<b>Data drift (covariate shift):</b> a distribuição das entradas P(X) muda (novos perfis, sazonalidade), o modelo opera fora da distribuição que viu. <b>Concept drift:</b> a relação P(y|X) muda, a mesma entrada agora tem outro resultado (fraude evolui, comportamento muda). Concept drift é mais grave: o modelo está genuinamente errado. Detecção: PSI/KS para data drift; queda de performance quando os labels chegam para concept drift.'
  },
  {
    cat: 'Deploy',
    q: 'Compare blue/green, canary e shadow deployment.',
    a: '<b>Blue/green:</b> dois ambientes idênticos, troca de tráfego de uma vez, rollback instantâneo. <b>Canary:</b> roteia uma fração pequena (5%) para o modelo novo, monitora antes de escalar. <b>Shadow:</b> o modelo novo recebe tráfego real mas suas predições não afetam usuários, só são comparadas (risco zero). Para modelos críticos: shadow → canary → full.'
  },
  {
    cat: 'Deploy',
    q: 'Como você garante reprodutibilidade de um experimento de ML?',
    a: 'Quatro elementos versionados juntos: <b>código</b> (Git commit), <b>dados</b> (DVC/snapshot com hash), <b>ambiente</b> (imagem Docker/ECR + requirements pinados) e <b>configuração</b> (seed fixo + hiperparâmetros logados no MLflow). Com os quatro, qualquer run é reconstruível bit a bit.'
  },
  {
    cat: 'Monitoramento',
    q: 'O que você monitora num modelo em produção?',
    a: 'Em camadas: <b>operacional</b> (latência p50/p95/p99, throughput, erro, recursos); <b>dados</b> (drift de features, nulos, valores fora de range, schema); <b>predições</b> (distribuição das saídas, confiança); <b>performance</b> (accuracy/F1/AUC reais quando o ground truth chega); <b>negócio</b> (conversão, receita, o que realmente importa). Alerta que ninguém age é ruído: cada alarme deve ser acionável.'
  },
  {
    cat: 'Arquitetura',
    q: 'Desenhe um sistema de detecção de fraude end-to-end.',
    a: 'Framework: <b>1. Requisitos</b> (latência real-time <100ms, alto recall, classe rara). <b>2. Dados</b> (transações streaming + histórico rotulado com delay). <b>3. Features</b> (Feature Store online para real-time + offline para treino; features de velocidade/agregação). <b>4. Modelo</b> (baseline gradient boosting; foco precision/recall). <b>5. Serving</b> (endpoint online + cache Redis). <b>6. Monitoramento</b> (drift PSI/KS; recall real quando chargebacks chegam). <b>7. Retreino</b> (trigger por drift). Verbalize os trade-offs, o entrevistador quer pensamento estruturado, não a "resposta certa".'
  }
];

/* ---------- Curated toolkit (awesome-mlops) + Zoomcamp modules ---------- */
window.MLOPS_TOOLKIT = [
  { cat: 'Orquestração de Pipeline', tools: [
    { n: 'Airflow', d: 'DAGs de workflow batch, agendamento e retries. Padrão de mercado.' },
    { n: 'Kubeflow Pipelines', d: 'Pipelines ML nativos em Kubernetes.' },
    { n: 'Prefect / Dagster', d: 'Orquestração moderna, data-aware, dev-friendly.' },
    { n: 'Metaflow', d: 'Da Netflix; foco em produtividade do cientista de dados.' }
  ]},
  { cat: 'Experiment Tracking & Registry', tools: [
    { n: 'MLflow', d: 'Tracking + Model Registry open-source. O mais adotado.' },
    { n: 'Weights & Biases', d: 'Tracking, dashboards e colaboração ricos.' },
    { n: 'Neptune.ai', d: 'Metadata store para experimentos e modelos.' },
    { n: 'DVC', d: 'Versionamento de dados e modelos sobre Git.' }
  ]},
  { cat: 'Feature Store', tools: [
    { n: 'Feast', d: 'Open-source, mais popular; online + offline store.' },
    { n: 'Tecton', d: 'Comercial, streaming nativo, completo.' },
    { n: 'SageMaker / Databricks FS', d: 'Feature stores gerenciados integrados à plataforma.' }
  ]},
  { cat: 'Serving & Deploy', tools: [
    { n: 'KServe', d: 'Serving serverless de modelos em Kubernetes.' },
    { n: 'BentoML', d: 'Empacota modelos como serviços prontos para produção.' },
    { n: 'Ray Serve', d: 'Serving escalável e programável em Python.' },
    { n: 'NVIDIA Triton', d: 'Serving de alta performance multi-framework (GPU).' }
  ]},
  { cat: 'Monitoramento & Drift', tools: [
    { n: 'Evidently AI', d: 'Relatórios open-source de drift e qualidade de dados/modelo.' },
    { n: 'whylogs / WhyLabs', d: 'Data logging e observabilidade de ML.' },
    { n: 'Arize / Fiddler', d: 'Plataformas comerciais de ML observability.' },
    { n: 'Prometheus + Grafana', d: 'Métricas operacionais e dashboards.' }
  ]},
  { cat: 'Validação de Dados', tools: [
    { n: 'Great Expectations', d: 'Expectations declarativas e versionadas + relatório HTML.' },
    { n: 'Pandera', d: 'Validação de schema de DataFrames em Python.' },
    { n: 'TFDV', d: 'TensorFlow Data Validation; skew e drift de schema.' }
  ]}
];

window.ZOOMCAMP_MODULES = [
  { n: '01', t: 'Introdução & Ambiente', d: 'Maturidade MLOps, setup, o problema que MLOps resolve.' },
  { n: '02', t: 'Experiment Tracking', d: 'MLflow: tracking de runs, model registry, comparação de experimentos.' },
  { n: '03', t: 'Orchestration', d: 'Pipelines de treino automatizados e agendados (workflow orchestration).' },
  { n: '04', t: 'Deployment', d: 'Serving web/streaming/batch; empacotamento e CI/CD do modelo.' },
  { n: '05', t: 'Monitoring', d: 'Evidently + dashboards: drift, qualidade e alertas em produção.' },
  { n: '06', t: 'Best Practices', d: 'Testes, IaC, CI/CD, pre-commit, engenharia de verdade.' }
];
