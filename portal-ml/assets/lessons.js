/* Lesson catalog, single source of truth for trilha + export
   Used by: curriculum.html (render trilha), portal.js (export markdown)
*/
window.LESSON_CATALOG = [
  {
    n: 1, slug: 'etapa-1', title: 'Base matemática',
    sub: 'A gramática do ML: função custo, gradient descent, overfitting, regularização. Tudo o que vem depois é variação.',
    lessons: [
      { id: 'linear-reg',     idx: '01', title: 'Linear Regression',     desc: 'Relação linear, MSE, equação normal, gradient descent', time: '90 min' },
      { id: 'logistic-reg',   idx: '02', title: 'Logistic Regression',   desc: 'Sigmoide, log-loss, fronteira de decisão linear',       time: '75 min' },
      { id: 'metrics',        idx: '03', title: 'Métricas',              desc: 'MSE · RMSE · MAE · Accuracy · Precision · Recall · F1 · ROC-AUC', time: '60 min' },
      { id: 'overfitting',    idx: '04', title: 'Overfitting & Bias-Variance', desc: 'Curva de aprendizado, validação cruzada, train/val/test', time: '60 min' },
      { id: 'regularization', idx: '05', title: 'Regularização L1/L2',   desc: 'Ridge, Lasso, ElasticNet, geometria e seleção de features', time: '60 min' },
    ]
  },
  {
    n: 2, slug: 'etapa-2', title: 'Árvores & ensembles',
    sub: 'O motor que ganha 70% dos problemas tabulares no mundo real. Bagging, boosting, regularização em árvores.',
    lessons: [
      { id: 'decision-tree',     idx: '06', title: 'Decision Trees',       desc: 'Gini, entropia, split, profundidade, pruning',          time: '60 min' },
      { id: 'random-forest',     idx: '07', title: 'Random Forest',        desc: 'Bagging, feature subsampling, OOB, importância',         time: '60 min' },
      { id: 'gradient-boosting', idx: '08', title: 'Gradient Boosting',    desc: 'Resíduos, learning rate, árvores fracas em sequência',  time: '75 min' },
      { id: 'xgboost',           idx: '09', title: 'XGBoost / LightGBM',   desc: 'Histogram, leaf-wise, regularização, GPU, por que domina Kaggle', time: '90 min' },
    ]
  },
  {
    n: 3, slug: 'etapa-3', title: 'Geometria & distância',
    sub: 'Pense em ML como espaço vetorial: distâncias, fronteiras, projeções. A base para deep learning e embeddings.',
    lessons: [
      { id: 'knn', idx: '10', title: 'K-Nearest Neighbors', desc: 'Distância euclidiana, K, custo O(n) na inferência, KD-tree',  time: '45 min' },
      { id: 'svm', idx: '11', title: 'SVM + Kernel Trick',  desc: 'Margem máxima, vetores de suporte, kernels RBF/poly',          time: '90 min' },
      { id: 'pca', idx: '12', title: 'PCA',                 desc: 'Variância máxima, autovetores, projeção, scree plot',         time: '60 min' },
    ]
  },
  {
    n: 4, slug: 'etapa-4', title: 'Não-supervisionado',
    sub: 'Quando não há rótulo: descobrir estrutura, agrupar, projetar, isolar o estranho.',
    lessons: [
      { id: 'clustering', idx: '13', title: 'Clustering',           desc: 'K-Means, DBSCAN, Hierarchical, escolha de K, silhouette', time: '75 min' },
      { id: 'anomaly',    idx: '14', title: 'Anomaly Detection',    desc: 'Isolation Forest, One-Class SVM, Autoencoder',           time: '60 min' },
      { id: 'tsne-umap',  idx: '15', title: 't-SNE / UMAP',         desc: 'Visualização de embeddings, local vs global, produção',  time: '60 min' },
    ]
  },
  {
    n: 5, slug: 'etapa-5', title: 'Deep learning',
    sub: 'MLP é regressão logística empilhada. CNN é convolução + MLP. Transformer é atenção + MLP. Não é mágica.',
    lessons: [
      { id: 'mlp',          idx: '16', title: 'MLP',          desc: 'Backprop, ativações, inicialização, batch norm',          time: '120 min' },
      { id: 'cnn',          idx: '17', title: 'CNN',          desc: 'Convolução, pooling, receptive field, transfer learning',  time: '90 min' },
      { id: 'rnn',          idx: '18', title: 'RNN / LSTM',   desc: 'Memória, vanishing gradient, GRU vs LSTM',                 time: '75 min' },
      { id: 'transformers', idx: '19', title: 'Transformers', desc: 'Self-attention, positional encoding, encoder/decoder',     time: '120 min' },
    ]
  },
  {
    n: 6, slug: 'etapa-6', title: 'AI moderna',
    sub: 'O stack atual: foundation models, alinhamento, retrieval, ferramentas, multimodalidade.',
    lessons: [
      { id: 'ssl',        idx: '20', title: 'Self-Supervised Learning', desc: 'MLM, NTP, contrastive, embeddings',                time: '60 min' },
      { id: 'rlhf',       idx: '21', title: 'RLHF',                     desc: 'Reward model, PPO, alinhamento, DPO',              time: '75 min' },
      { id: 'rag',        idx: '22', title: 'RAG',                      desc: 'Embeddings, retrieval, chunking, re-ranking',      time: '60 min' },
      { id: 'agents',     idx: '23', title: 'Agents',                   desc: 'Tool use, planning, ReAct, multi-step reasoning',  time: '60 min' },
      { id: 'multimodal', idx: '24', title: 'Multimodal',               desc: 'CLIP, vision-language, audio, fusion strategies',  time: '75 min' },
      { id: 'fine-tuning',      idx: '25', title: 'Fine Tuning',          desc: 'BERT para classificação, instruction tuning, LoRA/QLoRA, PEFT', time: '90 min' },
      { id: 'mas',              idx: '26', title: 'Multi-Agent Systems', desc: 'Coordenação, comunicação, especialização, emergência', time: '75 min' },
      { id: 'agent-patterns',   idx: '27', title: 'Agent Patterns',       desc: 'Router, SubAgent, Handoff, Reflexion, Plan-and-Execute', time: '75 min' },
      { id: 'agent-frameworks', idx: '28', title: 'Agent Frameworks',     desc: 'LangChain, LangGraph, AutoGen, CrewAI, quando usar cada', time: '60 min' },
    ]
  },
  {
    n: 7, slug: 'etapa-7', title: 'Métricas, modelagem clássica',
    sub: 'Avaliar é mais difícil que treinar. Regressão, classificação, ranking, clustering, métrica errada custa caro.',
    lessons: [
      { id: 'metrics-regression',     idx: '29', title: 'Métricas de Regressão',       desc: 'RMSE, MAE, MAPE, R², Huber, Quantile loss, quando cada uma é honesta', time: '60 min' },
      { id: 'metrics-classification', idx: '30', title: 'Métricas de Classificação',   desc: 'Precision/Recall, F1, ROC-AUC, PR-AUC, MCC, calibração, Cohen\'s κ',   time: '75 min' },
      { id: 'metrics-ranking',        idx: '31', title: 'Métricas de Ranking',         desc: 'MAP, MRR, NDCG, Hit@k, recomendação e search',                          time: '60 min' },
      { id: 'metrics-unsupervised',   idx: '32', title: 'Métricas Não-Supervisionadas', desc: 'Silhouette, DB, CH, ARI, NMI, clustering e anomaly detection',         time: '60 min' },
    ]
  },
  {
    n: 8, slug: 'etapa-8', title: 'Métricas, IA moderna',
    sub: 'LLMs, RAG, agentes, como avaliar quando "a saída certa" é fuzzy? LLM-as-judge, benchmarks, faithfulness.',
    lessons: [
      { id: 'metrics-llm',           idx: '33', title: 'Métricas de LLM',          desc: 'Perplexity, BLEU, ROUGE, BERTScore, MMLU, HumanEval, GSM8K',    time: '75 min' },
      { id: 'metrics-llm-judge',     idx: '34', title: 'LLM-as-Judge',             desc: 'Avaliação automatizada, MT-Bench, AlpacaEval, Arena, viéses',    time: '60 min' },
      { id: 'metrics-rag',           idx: '35', title: 'Métricas de RAG',          desc: 'Ragas, faithfulness, context precision/recall, answer relevance', time: '60 min' },
      { id: 'metrics-agents-safety', idx: '36', title: 'Métricas de Agentes & Segurança', desc: 'Task success, tool accuracy, AgentBench, jailbreak, toxicity',    time: '75 min' },
    ]
  },
  {
    n: 9, slug: 'etapa-9', title: 'Engenharia de ML & Dados',
    sub: 'O gap que destrói teóricos: feature engineering, SQL, modelagem, dados não-estruturados, código e versionamento.',
    lessons: [
      { id: 'feature-engineering', idx: '37', title: 'Feature Engineering',     desc: 'Encoding, scaling, temporal, leakage, importância',           time: '90 min' },
      { id: 'sql-ml',              idx: '38', title: 'SQL para ML',             desc: 'Window functions, CTEs, joins, agregações em escala',         time: '75 min' },
      { id: 'data-modeling',       idx: '39', title: 'Modelagem de Dados',      desc: 'OLTP vs OLAP, normalização, schemas para pipelines ML',       time: '60 min' },
      { id: 'unstructured-data',   idx: '40', title: 'Dados Não-Estruturados',  desc: 'Texto, imagens, embeddings, armazenamento em escala',         time: '60 min' },
      { id: 'python-dsa',          idx: '41', title: 'Python & DSA',            desc: 'Estruturas de dados, two pointers, sliding window, XOR',      time: '90 min' },
      { id: 'git-testing',         idx: '42', title: 'Git & Testes para ML',    desc: 'Branching, DVC, unit tests, data validation, Great Expectations', time: '60 min' },
    ]
  },
  {
    n: 10, slug: 'etapa-10', title: 'MLOps & Produção',
    sub: 'Operar ML em produção: containers, CI/CD, feature store, registry, serving, monitoramento, cloud e system design.',
    lessons: [
      { id: 'docker',          idx: '43', title: 'Docker & Containers',      desc: 'Dockerfile para ML, multi-stage, ECR, docker-compose',        time: '60 min' },
      { id: 'linux-shell',     idx: '44', title: 'Linux & Shell',            desc: 'Comandos críticos, permissões, processos, cron, scripting',   time: '45 min' },
      { id: 'cicd-ml',         idx: '45', title: 'CI/CD para ML (CD4ML)',    desc: '9 componentes do CD4ML, GitHub Actions, testes, rollback',    time: '90 min' },
      { id: 'feature-store',   idx: '46', title: 'Feature Store',            desc: 'Online vs offline, point-in-time, Feast, consistência',       time: '60 min' },
      { id: 'model-registry',  idx: '47', title: 'Model Registry',          desc: 'Versionamento, stages, MLflow, lineage tracking',             time: '60 min' },
      { id: 'mlops-design',    idx: '48', title: 'Desenho de Solução MLOps', desc: 'System design end-to-end, retraining loop, maturidade 0/1/2', time: '90 min' },
      { id: 'cloud-aws',       idx: '49', title: 'Cloud & AWS Well-Architected', desc: 'S3, SageMaker, Lambda, Step Functions, ML Lens (6 pilares)', time: '75 min' },
      { id: 'monitoring-drift', idx: '50', title: 'Monitoramento & Drift',   desc: 'Data drift, concept drift, observabilidade, alertas, retraining', time: '60 min' },
    ]
  },
];
