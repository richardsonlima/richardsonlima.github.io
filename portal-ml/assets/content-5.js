/* Lesson content — Etapa 10 — MLOps & Produção (lições 43–50)
   Operar ML em produção: containers, CI/CD, stores, registry, serving, cloud
*/
window.LESSON_CONTENT = window.LESSON_CONTENT || {};

window.LESSON_CONTENT['docker'] = {
  id: 'docker',
  title: 'Docker & Containers',
  etapa: 10, etapaName: 'MLOps & Produção',
  time: '60 min',
  tags: ['docker', 'containers', 'deploy'],
  tagline: '"Na minha máquina funciona" morre com containers. <em>Empacote</em> modelo + ambiente + dependências juntos.',
  intro: `
    <p>O problema mais antigo do deploy: o modelo funciona no notebook mas quebra em produção por diferença de versão, OS ou dependência. Docker resolve empacotando aplicação + ambiente num container reproduzível que roda igual em qualquer lugar. É infraestrutura básica de MLOps.</p>
  `,
  sections: [
    {
      id: 'conceito',
      title: 'Containers vs VMs',
      body: `
        <p>Uma <strong>VM</strong> virtualiza hardware inteiro — pesada, minutos para subir. Um <strong>container</strong> compartilha o kernel do host e isola apenas o necessário — leve, segundos para subir.</p>
        <ul>
          <li><strong>Image:</strong> template imutável (receita). Construída a partir de um Dockerfile.</li>
          <li><strong>Container:</strong> instância em execução de uma image.</li>
          <li><strong>Registry:</strong> repositório de images (Docker Hub, ECR, GCR).</li>
        </ul>
        <p>Para ML: empacota o modelo, o código de inferência, as versões exatas de bibliotecas (numpy, torch) e o runtime. Roda idêntico no laptop, no CI e em produção.</p>
      `
    },
    {
      id: 'dockerfile',
      title: 'Dockerfile para ML',
      body: `
        <pre><code>FROM python:3.11-slim

WORKDIR /app

# Dependências primeiro (cache de layer)
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Código e modelo
COPY src/ ./src/
COPY models/model.pkl ./models/

EXPOSE 8000
CMD ["uvicorn", "src.api:app", "--host", "0.0.0.0", "--port", "8000"]</code></pre>
        <p>Princípios:</p>
        <ul>
          <li><strong>Ordem importa:</strong> copie requirements antes do código. Layers são cacheadas — mudar código não reinstala deps.</li>
          <li><strong>slim/alpine:</strong> imagens base menores = deploy mais rápido.</li>
          <li><strong>.dockerignore:</strong> exclua datasets, .git, __pycache__ do build.</li>
          <li><strong>Pin versions:</strong> <code>torch==2.1.0</code>, não <code>torch</code>.</li>
        </ul>
      `
    },
    {
      id: 'multistage',
      title: 'Multi-stage builds',
      body: `
        <p>Modelos ML têm dependências pesadas de build (compiladores, dev headers) que não são necessárias em runtime. Multi-stage separa:</p>
        <pre><code># Stage 1: build
FROM python:3.11 AS builder
WORKDIR /app
COPY requirements.txt .
RUN pip install --user --no-cache-dir -r requirements.txt

# Stage 2: runtime (só o necessário)
FROM python:3.11-slim
WORKDIR /app
COPY --from=builder /root/.local /root/.local
COPY src/ ./src/
ENV PATH=/root/.local/bin:$PATH
CMD ["python", "src/serve.py"]</code></pre>
        <p>Resultado: imagem final menor, sem ferramentas de build. Crítico quando a imagem vai para edge ou escala horizontalmente.</p>
      `
    },
    {
      id: 'compose-ecr',
      title: 'docker-compose e registries',
      body: `
        <p><strong>docker-compose</strong> orquestra múltiplos containers (API + banco + cache) num arquivo declarativo — ótimo para desenvolvimento local que espelha produção.</p>
        <pre><code>services:
  api:
    build: .
    ports: ["8000:8000"]
    environment:
      - MODEL_PATH=/app/models/model.pkl
  redis:
    image: redis:7-alpine</code></pre>
        <p><strong>Registries</strong> (ECR na AWS, GCR no Google) armazenam imagens versionadas. Fluxo de deploy: <code>docker build</code> → <code>docker tag</code> → <code>docker push</code> para o registry → orquestrador (Kubernetes, ECS) puxa e roda.</p>
      `
    }
  ],
  whenToUse: [
    'Empacotar modelos para deploy reproduzível',
    'Garantir paridade dev/prod',
    'Pré-requisito para Kubernetes, ECS, serving',
    'Isolamento de ambientes'
  ],
  whenNot: [
    'Exploração local descartável',
    'Quando serverless (Lambda) já abstrai o runtime'
  ],
  metrics: ['Tamanho da imagem', 'Tempo de build', 'Paridade dev/prod']
};

window.LESSON_CONTENT['linux-shell'] = {
  id: 'linux-shell',
  title: 'Linux & Shell',
  etapa: 10, etapaName: 'MLOps & Produção',
  time: '45 min',
  tags: ['linux', 'shell', 'deploy'],
  tagline: 'Produção roda em Linux. <em>Comandos, permissões, processos</em> — o terreno onde modelos vivem.',
  intro: `
    <p>Todo servidor de produção roda Linux. Saber navegar o sistema, gerenciar processos, debugar permissões e automatizar com shell scripts é essencial — o modelo mais bonito é inútil se você não consegue fazê-lo rodar no servidor.</p>
  `,
  sections: [
    {
      id: 'comandos',
      title: 'Comandos essenciais',
      body: `
        <ul>
          <li><strong>Navegação:</strong> <code>cd</code>, <code>ls -la</code>, <code>pwd</code>, <code>find</code>, <code>tree</code>.</li>
          <li><strong>Arquivos:</strong> <code>cat</code>, <code>head</code>/<code>tail -f</code> (logs!), <code>grep</code>, <code>less</code>, <code>wc -l</code>.</li>
          <li><strong>Texto:</strong> <code>sed</code>, <code>awk</code>, <code>cut</code>, <code>sort</code>, <code>uniq</code> — processar logs e CSVs.</li>
          <li><strong>Pipes:</strong> <code>cat log | grep ERROR | wc -l</code> — compor comandos é o superpoder do shell.</li>
          <li><strong>Rede:</strong> <code>curl</code>, <code>wget</code>, <code>netstat</code>, <code>ss</code>.</li>
        </ul>
        <pre><code># Quantos erros por hora no log?
grep ERROR app.log | awk '{print $1, $2}' | cut -d: -f1 | sort | uniq -c</code></pre>
      `
    },
    {
      id: 'permissoes',
      title: 'Permissões e usuários',
      body: `
        <p>Erros de permissão são a causa #1 de "funciona local, quebra no servidor":</p>
        <ul>
          <li><strong>rwx:</strong> read/write/execute para owner/group/others. <code>chmod 755 script.sh</code>.</li>
          <li><strong>Ownership:</strong> <code>chown user:group file</code>.</li>
          <li><strong>sudo:</strong> executar como root — com cuidado.</li>
          <li><strong>Executáveis:</strong> <code>chmod +x deploy.sh</code> antes de rodar.</li>
        </ul>
        <p>Em containers, rodar como non-root user é boa prática de segurança.</p>
      `
    },
    {
      id: 'processos',
      title: 'Processos e recursos',
      body: `
        <ul>
          <li><strong>Monitorar:</strong> <code>top</code>/<code>htop</code> (CPU/RAM), <code>ps aux</code>, <code>nvidia-smi</code> (GPU!).</li>
          <li><strong>Matar:</strong> <code>kill PID</code>, <code>kill -9</code> (force), <code>pkill nome</code>.</li>
          <li><strong>Background:</strong> <code>&</code>, <code>nohup</code>, <code>screen</code>/<code>tmux</code> para sessões persistentes.</li>
          <li><strong>Disco:</strong> <code>df -h</code> (espaço), <code>du -sh *</code> (tamanho de pastas).</li>
        </ul>
        <div class="callout tip">
          <strong>DEBUG DE OOM</strong>
          Modelo morreu sem erro claro? Provavelmente OOM (out of memory). Cheque <code>dmesg | grep -i kill</code> e monitore RAM com <code>htop</code> durante a inferência.
        </div>
      `
    },
    {
      id: 'scripting',
      title: 'Shell scripting e cron',
      body: `
        <p>Automatizar pipelines com shell scripts:</p>
        <pre><code>#!/bin/bash
set -euo pipefail   # falha cedo, erro em var indefinida

DATA_DIR="/data/$(date +%Y-%m-%d)"
mkdir -p "$DATA_DIR"

python extract.py --out "$DATA_DIR/raw.parquet"
python train.py --data "$DATA_DIR/raw.parquet" --model "$DATA_DIR/model.pkl"

echo "Pipeline concluído em $DATA_DIR"</code></pre>
        <p><strong>cron</strong> agenda execuções recorrentes:</p>
        <pre><code># Retreinar todo dia às 2h da manhã
0 2 * * * /opt/ml/retrain.sh >> /var/log/retrain.log 2>&1</code></pre>
        <p><code>set -euo pipefail</code> é essencial — sem isso, scripts continuam após erros silenciosos.</p>
      `
    }
  ],
  whenToUse: [
    'Deploy e operação em servidores',
    'Debug de problemas de produção',
    'Automação de pipelines',
    'Processar logs e dados via CLI'
  ],
  whenNot: [
    'Quando plataformas gerenciadas abstraem a infra',
    'Lógica complexa — use Python, não shell de 500 linhas'
  ],
  metrics: ['Tempo de debug', 'Automação de tarefas repetitivas']
};

window.LESSON_CONTENT['cicd-ml'] = {
  id: 'cicd-ml',
  title: 'CI/CD para ML (CD4ML)',
  etapa: 10, etapaName: 'MLOps & Produção',
  time: '90 min',
  tags: ['CI/CD', 'CD4ML', 'automação'],
  tagline: 'Continuous Delivery for ML. <em>Três eixos</em> versionados: código, dados e modelo — não só código.',
  intro: `
    <p>CI/CD tradicional versiona e testa código. ML adiciona duas dimensões: dados e modelos. CD4ML (Continuous Delivery for Machine Learning, de Martin Fowler) é o framework canônico que estende DevOps para esse mundo. Esta lição cobre os componentes e como implementá-los.</p>
  `,
  sections: [
    {
      id: 'tres-eixos',
      title: 'Os três eixos versionados',
      body: `
        <p>O insight central do CD4ML: reprodutibilidade exige versionar três coisas, não uma:</p>
        <ul>
          <li><strong>Código:</strong> Git (treino, features, serving).</li>
          <li><strong>Dados:</strong> DVC, lakeFS, snapshots versionados.</li>
          <li><strong>Modelo:</strong> Model Registry com versões e stages.</li>
        </ul>
        <p>Um deploy reproduzível = commit de código + versão de dados + versão de modelo, todos rastreáveis. Sem isso, "por que o modelo de ontem era melhor?" não tem resposta.</p>
      `
    },
    {
      id: 'componentes',
      title: 'Os componentes do CD4ML',
      body: `
        <p>Martin Fowler descreve um pipeline integrado. Os blocos principais:</p>
        <ol>
          <li><strong>Discoverable & accessible data:</strong> pipelines de dados reproduzíveis.</li>
          <li><strong>Reproducible model training:</strong> treino versionado e parametrizado.</li>
          <li><strong>Model serving:</strong> deploy do modelo como serviço ou embedded.</li>
          <li><strong>Testing & quality:</strong> testes de dados, features, modelo e integração.</li>
          <li><strong>Experiment tracking:</strong> registro de runs, métricas, artefatos (MLflow, W&B).</li>
          <li><strong>Monitoring & observability:</strong> performance e drift em produção.</li>
        </ol>
        <p>O objetivo: qualquer mudança (código, dados, hiperparâmetro) dispara o pipeline automaticamente, com testes e deploy controlado.</p>
      `
    },
    {
      id: 'github-actions',
      title: 'Pipeline com GitHub Actions',
      body: `
        <pre><code>name: ML Pipeline
on: [push]

jobs:
  test-and-train:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-python@v5
        with: { python-version: "3.11" }

      - run: pip install -r requirements.txt

      # 1. Testes de código
      - run: pytest tests/

      # 2. Validação de dados
      - run: python validate_data.py

      # 3. Treino
      - run: python train.py

      # 4. Teste de modelo (deve bater baseline)
      - run: python evaluate.py --min-f1 0.85

      # 5. Registrar no MLflow se passou
      - run: python register_model.py</code></pre>
        <p>O modelo só avança se passar em cada gate. Falha no F1 mínimo? O deploy não acontece.</p>
      `
    },
    {
      id: 'deploy-strategies',
      title: 'Estratégias de deploy',
      body: `
        <p>Colocar um modelo novo em produção sem risco:</p>
        <ul>
          <li><strong>Blue-Green:</strong> dois ambientes idênticos. Troca o tráfego de uma vez. Rollback instantâneo.</li>
          <li><strong>Canary:</strong> rota uma fração pequena (5%) do tráfego para o modelo novo. Monitora antes de escalar.</li>
          <li><strong>Shadow:</strong> modelo novo recebe tráfego real mas suas predições não afetam usuários — só são comparadas. Risco zero.</li>
          <li><strong>A/B testing:</strong> divide tráfego e compara métricas de negócio estatisticamente.</li>
        </ul>
        <div class="callout tip">
          <strong>SHADOW PRIMEIRO</strong>
          Para modelos críticos, comece com shadow deployment — você valida em tráfego real sem risco antes de canary/A-B.
        </div>
      `
    },
    {
      id: 'rollback',
      title: 'Rollback e governança',
      body: `
        <p>Quando algo dá errado (e vai), você precisa voltar rápido:</p>
        <ul>
          <li><strong>Rollback automático:</strong> se métricas degradam além de threshold, reverter para versão anterior.</li>
          <li><strong>Model Registry stages:</strong> production/staging/archived — promover e despromover.</li>
          <li><strong>Audit trail:</strong> quem deployou o quê, quando, com qual aprovação.</li>
          <li><strong>Feature flags:</strong> ligar/desligar modelo sem redeploy.</li>
        </ul>
      `
    }
  ],
  whenToUse: [
    'Qualquer ML em produção que muda com frequência',
    'Times que precisam de reprodutibilidade',
    'Quando deploys manuais viraram gargalo/risco',
    'Compliance e auditoria'
  ],
  whenNot: [
    'Protótipo único sem ciclo de atualização',
    'Antes de ter o básico (versionamento, testes)'
  ],
  metrics: ['Deploy frequency', 'Lead time to production', 'Change failure rate', 'MTTR (recovery)']
};

window.LESSON_CONTENT['feature-store'] = {
  id: 'feature-store',
  title: 'Feature Store',
  etapa: 10, etapaName: 'MLOps & Produção',
  time: '60 min',
  tags: ['feature store', 'serving', 'consistência'],
  tagline: 'Onde as features moram. Resolve <em>training-serving skew</em> e reúso entre times.',
  intro: `
    <p>O maior problema operacional de ML: a feature computada no treino é diferente da computada no serving — training-serving skew. Feature stores centralizam a definição e o cálculo de features, garantindo que treino e produção usem exatamente a mesma lógica. Também permitem reúso entre modelos e times.</p>
  `,
  sections: [
    {
      id: 'problema',
      title: 'O problema que resolve',
      body: `
        <p>Sem feature store, o cenário típico:</p>
        <ul>
          <li>Time A computa "média de compras dos últimos 30 dias" em SQL para treino.</li>
          <li>Time B reimplementa a mesma feature em Python para serving em tempo real.</li>
          <li>As duas implementações divergem sutilmente → o modelo recebe inputs diferentes em produção → performance cai inexplicavelmente.</li>
        </ul>
        <p>Feature store define a feature <strong>uma vez</strong> e serve tanto para treino (batch, histórico) quanto serving (online, baixa latência), garantindo consistência.</p>
      `
    },
    {
      id: 'online-offline',
      title: 'Online vs Offline store',
      body: `
        <p>Feature stores têm dois "lados":</p>
        <ul>
          <li><strong>Offline store:</strong> histórico completo de features, otimizado para batch e training. Tipicamente data warehouse (BigQuery, Snowflake) ou data lake (Parquet).</li>
          <li><strong>Online store:</strong> valores mais recentes das features, otimizado para baixa latência (&lt;10ms) no serving. Tipicamente key-value store (Redis, DynamoDB).</li>
        </ul>
        <p>O mesmo cálculo popula os dois. No treino você lê do offline; em produção, do online. Mesma definição, mesma feature.</p>
      `
    },
    {
      id: 'point-in-time',
      title: 'Point-in-time correctness',
      body: `
        <p>O conceito mais sutil e crítico. Ao construir o dataset de treino histórico, cada exemplo deve usar o valor da feature <strong>como era naquele momento</strong> — não o valor atual.</p>
        <p>Exemplo: prever se um cliente vai cancelar em janeiro. A feature "número de tickets de suporte" deve refletir o estado em janeiro, não o estado de hoje (que inclui tickets posteriores ao cancelamento — leakage do futuro).</p>
        <p>Feature stores fazem <strong>point-in-time joins</strong> automaticamente: para cada evento, buscam o valor da feature válido naquele timestamp.</p>
        <div class="callout warn">
          <strong>SEM POINT-IN-TIME = LEAKAGE</strong>
          Joins ingênuos com o estado atual vazam o futuro. É um dos leakages mais comuns e difíceis de detectar — métricas ótimas no treino, fracasso em produção.
        </div>
      `
    },
    {
      id: 'ferramentas',
      title: 'Ferramentas',
      body: `
        <ul>
          <li><strong>Feast:</strong> open-source, mais popular. Define features em Python, integra com vários stores.</li>
          <li><strong>Tecton:</strong> comercial, completo, streaming nativo.</li>
          <li><strong>SageMaker Feature Store:</strong> gerenciado pela AWS.</li>
          <li><strong>Databricks Feature Store:</strong> integrado ao lakehouse.</li>
        </ul>
        <pre><code># Feast: definir uma feature view
from feast import FeatureView, Field
from feast.types import Float32

user_stats = FeatureView(
    name="user_purchase_stats",
    entities=[user],
    schema=[
        Field(name="avg_order_30d", dtype=Float32),
        Field(name="n_orders_30d", dtype=Float32),
    ],
    source=purchase_source,
)</code></pre>
      `
    }
  ],
  whenToUse: [
    'Múltiplos modelos compartilham features',
    'Serving em tempo real com baixa latência',
    'Quando training-serving skew é um problema',
    'Times grandes que precisam reusar features'
  ],
  whenNot: [
    'Um único modelo batch simples',
    'Protótipos — adiciona complexidade significativa',
    'Quando features são triviais de recalcular'
  ],
  metrics: ['Training-serving consistency', 'Latência do online store', 'Reúso de features entre modelos']
};

window.LESSON_CONTENT['model-registry'] = {
  id: 'model-registry',
  title: 'Model Registry',
  etapa: 10, etapaName: 'MLOps & Produção',
  time: '60 min',
  tags: ['registry', 'versionamento', 'MLflow'],
  tagline: 'O "Git dos modelos". Versões, <em>stages</em>, lineage — governança do ciclo de vida.',
  intro: `
    <p>Você treinou 50 versões do modelo este mês. Qual está em produção? Qual foi treinada com quais dados? Pode voltar para a de duas semanas atrás? Model Registry responde tudo isso — é o sistema central de governança do ciclo de vida de modelos.</p>
  `,
  sections: [
    {
      id: 'o-que-e',
      title: 'O que um registry guarda',
      body: `
        <p>Para cada modelo versionado:</p>
        <ul>
          <li><strong>Artefato:</strong> os pesos/parâmetros serializados.</li>
          <li><strong>Metadata:</strong> hiperparâmetros, métricas de validação, autor, data.</li>
          <li><strong>Lineage:</strong> qual código (commit), quais dados (versão), qual experimento gerou.</li>
          <li><strong>Signature:</strong> schema de input/output esperado.</li>
          <li><strong>Stage:</strong> em que fase do ciclo de vida está.</li>
        </ul>
      `
    },
    {
      id: 'stages',
      title: 'Stages: o ciclo de vida',
      body: `
        <p>Um modelo passa por fases controladas:</p>
        <ul>
          <li><strong>None/Development:</strong> recém-treinado, em experimentação.</li>
          <li><strong>Staging:</strong> candidato a produção, em validação/shadow.</li>
          <li><strong>Production:</strong> servindo tráfego real.</li>
          <li><strong>Archived:</strong> aposentado, mas preservado para rollback/auditoria.</li>
        </ul>
        <p>Transições entre stages são <strong>governadas</strong> — exigem aprovação, testes passados, às vezes assinatura. Isso evita que um modelo não-validado vá para produção por acidente.</p>
      `
    },
    {
      id: 'mlflow',
      title: 'MLflow Model Registry',
      body: `
        <pre><code>import mlflow

# Registrar durante o treino
with mlflow.start_run():
    mlflow.log_params(params)
    mlflow.log_metrics({"f1": 0.89, "auc": 0.94})
    mlflow.sklearn.log_model(model, "model",
                             registered_model_name="churn_predictor")

# Promover para produção
client = mlflow.MlflowClient()
client.transition_model_version_stage(
    name="churn_predictor",
    version=3,
    stage="Production",
    archive_existing_versions=True  # arquiva a antiga
)

# Carregar a versão de produção em serving
model = mlflow.pyfunc.load_model("models:/churn_predictor/Production")</code></pre>
        <p>Alternativas: SageMaker Model Registry, Vertex AI Model Registry, Weights & Biases.</p>
      `
    },
    {
      id: 'lineage',
      title: 'Lineage e reprodutibilidade',
      body: `
        <p>Lineage rastreia a "árvore genealógica" de um modelo: de quais dados, código e configuração ele nasceu. Permite responder:</p>
        <ul>
          <li>"Este modelo foi treinado com os dados pós-correção do bug?"</li>
          <li>"Reproduza exatamente o modelo v12."</li>
          <li>"Quais modelos usam esta feature que vamos descontinuar?"</li>
          <li>"Auditoria: prove como esta decisão de crédito foi tomada."</li>
        </ul>
        <p>Em domínios regulados (crédito, saúde), lineage não é opcional — é requisito legal.</p>
      `
    }
  ],
  whenToUse: [
    'Múltiplas versões de modelo em circulação',
    'Necessidade de rollback rápido',
    'Governança e compliance',
    'Times colaborando em modelos'
  ],
  whenNot: [
    'Um único modelo estático',
    'Protótipos descartáveis'
  ],
  metrics: ['Tempo de rollback', 'Rastreabilidade (lineage completo)', 'Modelos versionados']
};

window.LESSON_CONTENT['mlops-design'] = {
  id: 'mlops-design',
  title: 'Desenho de Solução MLOps',
  etapa: 10, etapaName: 'MLOps & Produção',
  time: '90 min',
  tags: ['system design', 'arquitetura', 'maturidade'],
  tagline: 'A pergunta de entrevista sênior: <em>desenhe o sistema end-to-end</em>. Da ingestão ao retraining loop.',
  intro: `
    <p>System design de ML é onde teoria encontra realidade. Entrevistas de nível sênior/especialista quase sempre incluem "desenhe um sistema de recomendação/fraude/etc end-to-end". Esta lição cobre a arquitetura de referência e os níveis de maturidade MLOps que servem de régua.</p>
  `,
  sections: [
    {
      id: 'arquitetura',
      title: 'Arquitetura de referência end-to-end',
      body: `
        <p>O fluxo completo de um sistema de ML em produção:</p>
        <ol>
          <li><strong>Data ingestion:</strong> coleta de fontes (DBs, streams, APIs, logs).</li>
          <li><strong>Data validation:</strong> schema, qualidade, drift de entrada.</li>
          <li><strong>Feature engineering / Feature Store:</strong> transformação e armazenamento.</li>
          <li><strong>Training:</strong> treino reproduzível, parametrizado, versionado.</li>
          <li><strong>Evaluation:</strong> métricas, slices, comparação com baseline.</li>
          <li><strong>Model Registry:</strong> versionamento e promoção.</li>
          <li><strong>Serving:</strong> batch, online (REST/gRPC) ou streaming.</li>
          <li><strong>Monitoring:</strong> performance, drift, latência, custo.</li>
          <li><strong>Retraining loop:</strong> trigger automático ou agendado de volta ao treino.</li>
        </ol>
        <p>O "loop" é a parte que diferencia ML de software tradicional: o sistema precisa se reentrenar conforme o mundo muda.</p>
      `
    },
    {
      id: 'serving-patterns',
      title: 'Padrões de serving',
      body: `
        <ul>
          <li><strong>Batch prediction:</strong> prediz periodicamente para todos (ex: scores de churn diários). Simples, sem latência crítica.</li>
          <li><strong>Online (real-time):</strong> API que prediz sob demanda (&lt;100ms). Recomendação, fraude, ranking.</li>
          <li><strong>Streaming:</strong> prediz sobre eventos contínuos (Kafka, Kinesis).</li>
          <li><strong>Embedded/Edge:</strong> modelo roda no dispositivo (mobile, IoT). Latência mínima, sem rede.</li>
        </ul>
        <p>A escolha define toda a arquitetura. Pergunta-chave de design: "qual é o requisito de latência e volume?"</p>
      `
    },
    {
      id: 'maturidade',
      title: 'Níveis de maturidade MLOps (Google)',
      body: `
        <p>A régua do mercado para medir sofisticação, do Google Cloud:</p>
        <ul>
          <li><strong>Level 0 — Manual:</strong> processo manual, script-driven, notebooks. Deploy raro e manual. Sem CI/CD. A maioria começa aqui.</li>
          <li><strong>Level 1 — ML pipeline automation:</strong> pipeline de treino automatizado, retraining contínuo com dados novos. Validação automática de dados e modelo. Feature store, metadata management.</li>
          <li><strong>Level 2 — CI/CD pipeline automation:</strong> CI/CD completo do pipeline em si. Mudanças no código do pipeline são testadas e deployadas automaticamente. Múltiplos experimentos, deploy contínuo de pipelines.</li>
        </ul>
        <div class="callout tip">
          <strong>EM ENTREVISTA</strong>
          Saber em que nível uma organização está e o que falta para subir é pergunta clássica. Memorize as diferenças. Quase ninguém precisa de Level 2 — saiba justificar o nível adequado ao contexto.
        </div>
      `
    },
    {
      id: 'design-framework',
      title: 'Framework para responder system design',
      body: `
        <p>Estrutura para qualquer pergunta de design de sistema ML:</p>
        <ol>
          <li><strong>Requisitos:</strong> qual o problema de negócio? Latência? Volume? Frequência de retraining? Métricas?</li>
          <li><strong>Dados:</strong> de onde vêm? Quanto? Rotulados? Como atualizam?</li>
          <li><strong>Features:</strong> batch ou real-time? Feature store?</li>
          <li><strong>Modelo:</strong> que tipo? Baseline primeiro. Trade-off complexidade vs latência.</li>
          <li><strong>Serving:</strong> batch/online/edge? Como escala?</li>
          <li><strong>Monitoramento:</strong> que métricas? Como detectar drift? Quando retreinar?</li>
          <li><strong>Trade-offs:</strong> sempre verbalize as escolhas e alternativas.</li>
        </ol>
        <p>O entrevistador quer ver pensamento estruturado e consciência de trade-offs — não a "resposta certa".</p>
      `
    },
    {
      id: 'design-patterns',
      title: 'ML Design Patterns úteis',
      body: `
        <p>Padrões recorrentes (Lakshmanan et al.) que aparecem em design:</p>
        <ul>
          <li><strong>Reframing:</strong> transformar regressão em classificação (ou vice-versa) quando facilita.</li>
          <li><strong>Cascade:</strong> encadear modelos onde a saída de um alimenta outro.</li>
          <li><strong>Two-Phase Predictions:</strong> modelo leve no edge + modelo pesado na nuvem.</li>
          <li><strong>Windowed Inference:</strong> agregar predições sobre janelas de tempo.</li>
          <li><strong>Checkpoints / Keyed Predictions:</strong> rastrear predições com chaves para batch grande.</li>
        </ul>
      `
    }
  ],
  whenToUse: [
    'Entrevistas de system design ML',
    'Projetar um sistema de ML do zero',
    'Avaliar maturidade de uma organização',
    'Decidir arquitetura de serving'
  ],
  whenNot: [
    'Antes de validar que ML é necessário (às vezes regra simples basta)',
    'Over-engineering — comece no Level 0/1 e evolua'
  ],
  metrics: ['Nível de maturidade MLOps', 'Latência de serving', 'Frequência de retraining', 'Cobertura de monitoramento']
};

window.LESSON_CONTENT['cloud-aws'] = {
  id: 'cloud-aws',
  title: 'Cloud & AWS Well-Architected',
  etapa: 10, etapaName: 'MLOps & Produção',
  time: '75 min',
  tags: ['AWS', 'cloud', 'well-architected'],
  tagline: 'ML em escala mora na nuvem. Serviços core da AWS + os <em>6 pilares</em> do Well-Architected ML Lens.',
  intro: `
    <p>A grande maioria dos sistemas de ML em produção roda em nuvem — AWS, GCP ou Azure. Conhecer os serviços core e os princípios de arquitetura (Well-Architected Framework) é esperado em qualquer posição sênior. Esta lição foca em AWS (o mais cobrado), mas os conceitos transferem.</p>
  `,
  sections: [
    {
      id: 'servicos-core',
      title: 'Serviços core para ML na AWS',
      body: `
        <ul>
          <li><strong>S3:</strong> object storage. Onde os dados e artefatos moram. Base de tudo.</li>
          <li><strong>SageMaker:</strong> plataforma ML gerenciada — training, hosting, pipelines, feature store, registry, monitoring. O canivete suíço.</li>
          <li><strong>Lambda:</strong> serverless compute. Inferência leve sem gerenciar servidor.</li>
          <li><strong>ECR:</strong> registry de containers Docker.</li>
          <li><strong>Step Functions:</strong> orquestração de workflows (pipelines ML como state machine).</li>
          <li><strong>EC2:</strong> máquinas virtuais (incl. instâncias GPU p3/p4/g5 para treino).</li>
          <li><strong>CloudWatch:</strong> logs, métricas, alarmes.</li>
        </ul>
        <p>Equivalentes GCP: GCS, Vertex AI, Cloud Functions, Artifact Registry, Cloud Workflows.</p>
      `
    },
    {
      id: 'sagemaker',
      title: 'SageMaker em profundidade',
      body: `
        <p>SageMaker cobre o ciclo inteiro:</p>
        <ul>
          <li><strong>Training Jobs:</strong> treino gerenciado, spot instances para economia, distributed training.</li>
          <li><strong>Endpoints:</strong> serving real-time auto-scaling, ou serverless, ou batch transform.</li>
          <li><strong>Pipelines:</strong> CI/CD de ML nativo.</li>
          <li><strong>Feature Store, Model Registry:</strong> integrados.</li>
          <li><strong>Model Monitor:</strong> detecção de drift automática.</li>
          <li><strong>Clarify:</strong> bias detection e explicabilidade.</li>
        </ul>
        <p>O trade-off: SageMaker abstrai muito (rápido para subir) mas tem lock-in e custo. Alternativa: montar com EC2 + ECS + MLflow self-hosted (mais controle, mais trabalho).</p>
      `
    },
    {
      id: 'well-architected',
      title: 'Os 6 pilares do Well-Architected',
      body: `
        <p>O AWS Well-Architected Framework (e seu ML Lens) define 6 pilares para avaliar arquiteturas:</p>
        <ol>
          <li><strong>Operational Excellence:</strong> automação, monitoramento, melhoria contínua.</li>
          <li><strong>Security:</strong> dados criptografados, IAM, privacidade, controle de acesso a modelos.</li>
          <li><strong>Reliability:</strong> recuperação de falhas, redundância, retraining confiável.</li>
          <li><strong>Performance Efficiency:</strong> recursos certos (GPU vs CPU), escala adequada.</li>
          <li><strong>Cost Optimization:</strong> spot instances, right-sizing, serverless onde faz sentido.</li>
          <li><strong>Sustainability:</strong> eficiência energética, otimização de recursos.</li>
        </ol>
        <div class="callout tip">
          <strong>O QUE COBRAM</strong>
          Entrevistas de especialista cobram os <em>trade-offs entre pilares</em>. Ex: mais reliability (multi-region) custa mais (conflito com cost optimization). Saiba argumentar o balanço para o contexto.
        </div>
      `
    },
    {
      id: 'custo',
      title: 'Otimização de custo em ML',
      body: `
        <p>ML na nuvem fica caro rápido. Estratégias:</p>
        <ul>
          <li><strong>Spot instances:</strong> até 90% mais barato para treino (tolerante a interrupção).</li>
          <li><strong>Right-sizing:</strong> não use p4d.24xlarge para um modelo que cabe num g5.xlarge.</li>
          <li><strong>Serverless inference:</strong> paga por uso, bom para tráfego intermitente.</li>
          <li><strong>Batch vs real-time:</strong> batch é muito mais barato quando latência não é crítica.</li>
          <li><strong>Auto-scaling:</strong> escala para zero ou mínimo fora de pico.</li>
          <li><strong>Quantização/distilação:</strong> modelos menores = inferência mais barata.</li>
        </ul>
      `
    }
  ],
  whenToUse: [
    'ML em escala de produção',
    'Quando infra própria não compensa',
    'Necessidade de elasticidade (treino sob demanda)',
    'Entrevistas que cobram cloud/arquitetura'
  ],
  whenNot: [
    'Protótipos locais',
    'Quando compliance exige on-premises',
    'Cargas pequenas e estáveis (pode ser mais caro que dedicado)'
  ],
  metrics: ['Custo por predição', 'Utilização de recursos', 'Aderência aos 6 pilares', 'Uptime/SLA']
};

window.LESSON_CONTENT['monitoring-drift'] = {
  id: 'monitoring-drift',
  title: 'Monitoramento & Drift',
  etapa: 10, etapaName: 'MLOps & Produção',
  time: '60 min',
  tags: ['monitoramento', 'drift', 'observabilidade'],
  tagline: 'O modelo nasce ótimo e <em>apodrece</em> em produção. O mundo muda — e seu modelo precisa saber.',
  intro: `
    <p>Software tradicional, uma vez correto, continua correto. Modelos de ML degradam silenciosamente conforme o mundo muda — comportamento de usuários, sazonalidade, novos padrões de fraude. Monitoramento é o que detecta essa degradação antes que ela custe caro. Esta lição fecha o loop de MLOps.</p>
  `,
  sections: [
    {
      id: 'tipos-drift',
      title: 'Tipos de drift',
      body: `
        <p>Duas formas distintas de degradação:</p>
        <ul>
          <li><strong>Data drift (covariate shift):</strong> a distribuição das features de entrada P(X) muda. Ex: novos perfis de usuário, mudança sazonal. O modelo ainda pode estar certo, mas opera fora da distribuição que viu no treino.</li>
          <li><strong>Concept drift:</strong> a relação P(y|X) muda. A mesma entrada agora tem outro resultado. Ex: pandemia muda comportamento de compra, fraude evolui para escapar do modelo. Mais grave — o modelo está genuinamente errado.</li>
          <li><strong>Label drift:</strong> a distribuição do target P(y) muda.</li>
        </ul>
        <div class="callout warn">
          <strong>O PERIGO SILENCIOSO</strong>
          Drift não gera erro nem exceção. O sistema continua respondendo — só que cada vez mais errado. Sem monitoramento, você só descobre quando o negócio reclama.
        </div>
      `
    },
    {
      id: 'deteccao',
      title: 'Como detectar drift',
      body: `
        <p>Testes estatísticos comparando produção vs treino/baseline:</p>
        <ul>
          <li><strong>PSI (Population Stability Index):</strong> mede shift de distribuição. PSI &gt; 0.2 sugere drift significativo. Padrão em crédito.</li>
          <li><strong>KS test (Kolmogorov-Smirnov):</strong> compara distribuições contínuas.</li>
          <li><strong>Chi-quadrado:</strong> para features categóricas.</li>
          <li><strong>KL/JS divergence:</strong> divergência entre distribuições.</li>
          <li><strong>Wasserstein distance:</strong> Earth Mover's distance.</li>
        </ul>
        <p>Para concept drift: monitore a métrica de performance diretamente quando os rótulos chegam (mesmo que atrasados).</p>
      `
    },
    {
      id: 'o-que-monitorar',
      title: 'O que monitorar',
      body: `
        <p>Monitoramento de ML opera em camadas:</p>
        <ul>
          <li><strong>Operacional:</strong> latência (p50/p95/p99), throughput, taxa de erro, uso de recursos. Igual a qualquer serviço.</li>
          <li><strong>Dados:</strong> drift de features, taxa de nulos, valores fora de range, schema.</li>
          <li><strong>Predições:</strong> distribuição das saídas, confiança média, taxa de cada classe.</li>
          <li><strong>Performance:</strong> métricas de modelo quando ground truth chega (accuracy, F1, AUC reais).</li>
          <li><strong>Negócio:</strong> conversão, receita, satisfação — o que realmente importa.</li>
        </ul>
      `
    },
    {
      id: 'ferramentas',
      title: 'Ferramentas e alertas',
      body: `
        <ul>
          <li><strong>Evidently AI:</strong> open-source, relatórios de drift e performance.</li>
          <li><strong>WhyLabs, Arize, Fiddler:</strong> plataformas comerciais de ML observability.</li>
          <li><strong>SageMaker Model Monitor:</strong> nativo AWS.</li>
          <li><strong>Prometheus + Grafana:</strong> métricas operacionais e dashboards.</li>
        </ul>
        <p>Alertas devem ser <strong>acionáveis</strong>: drift detectado → notifica → trigger de investigação ou retraining automático. Alerta que ninguém age é ruído.</p>
      `
    },
    {
      id: 'retraining',
      title: 'Fechando o loop: retraining',
      body: `
        <p>Detectar drift é metade — a outra é reagir. Estratégias de retraining:</p>
        <ul>
          <li><strong>Agendado:</strong> retreina periodicamente (diário, semanal). Simples, previsível.</li>
          <li><strong>Trigger por drift:</strong> retreina quando drift ou queda de performance cruza threshold. Eficiente.</li>
          <li><strong>Trigger por volume:</strong> retreina a cada N novos exemplos rotulados.</li>
          <li><strong>Online learning:</strong> atualização contínua incremental (raro, complexo).</li>
        </ul>
        <p>Sempre valide o modelo retreinado contra o atual antes de promover — retreinar com dados ruins (drift de qualidade) pode piorar. O loop completo: monitorar → detectar → retreinar → validar → deployar → monitorar.</p>
      `
    }
  ],
  whenToUse: [
    'Todo modelo em produção, sem exceção',
    'Especialmente em domínios que mudam rápido (fraude, recomendação)',
    'Quando rótulos chegam com atraso',
    'Para justificar e disparar retraining'
  ],
  whenNot: [
    'Nunca pule monitoramento em produção',
    'Modelo verdadeiramente estático e offline (raro)'
  ],
  metrics: ['PSI, KS, divergências (drift)', 'Métricas de performance ao longo do tempo', 'Latência p95/p99', 'Tempo até detecção de degradação']
};
