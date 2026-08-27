/* ML Portal, PT -> EN dictionary for the lesson catalog (stages + 50 lessons).
   Titles already in English are omitted; only what needs translating is listed. */
(function () {
  if (!window.I18N) return;

  window.I18N.register({

    /* ---------- stage titles ---------- */
    'Árvores & ensembles': 'Trees & ensembles',
    'Geometria & distância': 'Geometry & distance',
    'Não-supervisionado': 'Unsupervised',
    'Deep learning': 'Deep learning',
    'AI moderna': 'Modern AI',
    'Métricas, modelagem clássica': 'Metrics, classical modeling',
    'Métricas, IA moderna': 'Metrics, modern AI',
    'Engenharia de ML & Dados': 'ML & Data Engineering',
    'MLOps & Produção': 'MLOps & Production',

    /* ---------- stage subtitles ---------- */
    'A gramática do ML: função custo, gradient descent, overfitting, regularização. Tudo o que vem depois é variação.':
      'The grammar of ML: cost function, gradient descent, overfitting, regularization. Everything after this is a variation.',
    'O motor que ganha 70% dos problemas tabulares no mundo real. Bagging, boosting, regularização em árvores.':
      'The engine that wins 70% of real-world tabular problems. Bagging, boosting, regularization in trees.',
    'Pense em ML como espaço vetorial: distâncias, fronteiras, projeções. A base para deep learning e embeddings.':
      'Think of ML as a vector space: distances, boundaries, projections. The foundation for deep learning and embeddings.',
    'Quando não há rótulo: descobrir estrutura, agrupar, projetar, isolar o estranho.':
      'When there are no labels: find structure, group, project, isolate the odd one out.',
    'MLP é regressão logística empilhada. CNN é convolução + MLP. Transformer é atenção + MLP. Não é mágica.':
      'An MLP is stacked logistic regression. A CNN is convolution plus an MLP. A Transformer is attention plus an MLP. It is not magic.',
    'O stack atual: foundation models, alinhamento, retrieval, ferramentas, multimodalidade.':
      'The current stack: foundation models, alignment, retrieval, tools, multimodality.',
    'Avaliar é mais difícil que treinar. Regressão, classificação, ranking, clustering, métrica errada custa caro.':
      'Evaluating is harder than training. Regression, classification, ranking, clustering, and the wrong metric is expensive.',
    'LLMs, RAG, agentes, como avaliar quando "a saída certa" é fuzzy? LLM-as-judge, benchmarks, faithfulness.':
      'LLMs, RAG, agents. How do you evaluate when "the right output" is fuzzy? LLM-as-judge, benchmarks, faithfulness.',
    'O gap que destrói teóricos: feature engineering, SQL, modelagem, dados não-estruturados, código e versionamento.':
      'The gap that breaks theorists: feature engineering, SQL, modeling, unstructured data, code and versioning.',
    'Operar ML em produção: containers, CI/CD, feature store, registry, serving, monitoramento, cloud e system design.':
      'Running ML in production: containers, CI/CD, feature store, registry, serving, monitoring, cloud and system design.',

    /* ---------- lesson titles that need translating ---------- */
    'Regularização L1/L2': 'L1/L2 Regularization',
    'Métricas de Regressão': 'Regression Metrics',
    'Métricas de Classificação': 'Classification Metrics',
    'Métricas de Ranking': 'Ranking Metrics',
    'Métricas Não-Supervisionadas': 'Unsupervised Metrics',
    'Métricas de LLM': 'LLM Metrics',
    'Métricas de RAG': 'RAG Metrics',
    'Métricas de Agentes & Segurança': 'Agent & Safety Metrics',
    'SQL para ML': 'SQL for ML',
    'Modelagem de Dados': 'Data Modeling',
    'Dados Não-Estruturados': 'Unstructured Data',
    'Git & Testes para ML': 'Git & Testing for ML',
    'Monitoramento & Drift': 'Monitoring & Drift',

    /* ---------- lesson descriptions ---------- */
    'Relação linear, MSE, equação normal, gradient descent': 'Linear relationship, MSE, normal equation, gradient descent',
    'Sigmoide, log-loss, fronteira de decisão linear': 'Sigmoid, log-loss, linear decision boundary',
    'Curva de aprendizado, validação cruzada, train/val/test': 'Learning curve, cross-validation, train/val/test',
    'Ridge, Lasso, ElasticNet, geometria e seleção de features': 'Ridge, Lasso, ElasticNet, geometry and feature selection',
    'Gini, entropia, split, profundidade, pruning': 'Gini, entropy, splits, depth, pruning',
    'Bagging, feature subsampling, OOB, importância': 'Bagging, feature subsampling, OOB, importance',
    'Resíduos, learning rate, árvores fracas em sequência': 'Residuals, learning rate, weak trees in sequence',
    'Histogram, leaf-wise, regularização, GPU, por que domina Kaggle': 'Histogram, leaf-wise, regularization, GPU, why it dominates Kaggle',
    'Distância euclidiana, K, custo O(n) na inferência, KD-tree': 'Euclidean distance, K, O(n) inference cost, KD-tree',
    'Margem máxima, vetores de suporte, kernels RBF/poly': 'Maximum margin, support vectors, RBF/poly kernels',
    'Variância máxima, autovetores, projeção, scree plot': 'Maximum variance, eigenvectors, projection, scree plot',
    'K-Means, DBSCAN, Hierarchical, escolha de K, silhouette': 'K-Means, DBSCAN, hierarchical, choosing K, silhouette',
    'Isolation Forest, One-Class SVM, Autoencoder': 'Isolation Forest, One-Class SVM, autoencoder',
    'Visualização de embeddings, local vs global, produção': 'Visualizing embeddings, local vs global, production',
    'Backprop, ativações, inicialização, batch norm': 'Backprop, activations, initialization, batch norm',
    'Convolução, pooling, receptive field, transfer learning': 'Convolution, pooling, receptive field, transfer learning',
    'Memória, vanishing gradient, GRU vs LSTM': 'Memory, vanishing gradient, GRU vs LSTM',
    'Self-attention, positional encoding, encoder/decoder': 'Self-attention, positional encoding, encoder/decoder',
    'MLM, NTP, contrastive, embeddings': 'MLM, NTP, contrastive, embeddings',
    'Reward model, PPO, alinhamento, DPO': 'Reward model, PPO, alignment, DPO',
    'Embeddings, retrieval, chunking, re-ranking': 'Embeddings, retrieval, chunking, re-ranking',
    'Tool use, planning, ReAct, multi-step reasoning': 'Tool use, planning, ReAct, multi-step reasoning',
    'CLIP, vision-language, audio, fusion strategies': 'CLIP, vision-language, audio, fusion strategies',
    'BERT para classificação, instruction tuning, LoRA/QLoRA, PEFT': 'BERT for classification, instruction tuning, LoRA/QLoRA, PEFT',
    'Coordenação, comunicação, especialização, emergência': 'Coordination, communication, specialization, emergence',
    'Router, SubAgent, Handoff, Reflexion, Plan-and-Execute': 'Router, SubAgent, Handoff, Reflexion, Plan-and-Execute',
    'LangChain, LangGraph, AutoGen, CrewAI, quando usar cada': 'LangChain, LangGraph, AutoGen, CrewAI, when to use each',
    'RMSE, MAE, MAPE, R², Huber, Quantile loss, quando cada uma é honesta': 'RMSE, MAE, MAPE, R², Huber, quantile loss, and when each one is honest',
    'Precision/Recall, F1, ROC-AUC, PR-AUC, MCC, calibração, Cohen\'s κ': 'Precision/Recall, F1, ROC-AUC, PR-AUC, MCC, calibration, Cohen\'s κ',
    'MAP, MRR, NDCG, Hit@k, recomendação e search': 'MAP, MRR, NDCG, Hit@k, recommendation and search',
    'Silhouette, DB, CH, ARI, NMI, clustering e anomaly detection': 'Silhouette, DB, CH, ARI, NMI, clustering and anomaly detection',
    'Perplexity, BLEU, ROUGE, BERTScore, MMLU, HumanEval, GSM8K': 'Perplexity, BLEU, ROUGE, BERTScore, MMLU, HumanEval, GSM8K',
    'Avaliação automatizada, MT-Bench, AlpacaEval, Arena, viéses': 'Automated evaluation, MT-Bench, AlpacaEval, Arena, biases',
    'Ragas, faithfulness, context precision/recall, answer relevance': 'Ragas, faithfulness, context precision/recall, answer relevance',
    'Task success, tool accuracy, AgentBench, jailbreak, toxicity': 'Task success, tool accuracy, AgentBench, jailbreak, toxicity',
    'Encoding, scaling, temporal, leakage, importância': 'Encoding, scaling, temporal features, leakage, importance',
    'Window functions, CTEs, joins, agregações em escala': 'Window functions, CTEs, joins, aggregations at scale',
    'OLTP vs OLAP, normalização, schemas para pipelines ML': 'OLTP vs OLAP, normalization, schemas for ML pipelines',
    'Texto, imagens, embeddings, armazenamento em escala': 'Text, images, embeddings, storage at scale',
    'Estruturas de dados, two pointers, sliding window, XOR': 'Data structures, two pointers, sliding window, XOR',
    'Branching, DVC, unit tests, data validation, Great Expectations': 'Branching, DVC, unit tests, data validation, Great Expectations',
    'Dockerfile para ML, multi-stage, ECR, docker-compose': 'Dockerfile for ML, multi-stage, ECR, docker-compose',
    'Comandos críticos, permissões, processos, cron, scripting': 'Critical commands, permissions, processes, cron, scripting',
    '9 componentes do CD4ML, GitHub Actions, testes, rollback': 'The 9 CD4ML components, GitHub Actions, testing, rollback',
    'Online vs offline, point-in-time, Feast, consistência': 'Online vs offline, point-in-time, Feast, consistency',
    'Versionamento, stages, MLflow, lineage tracking': 'Versioning, stages, MLflow, lineage tracking',
    'System design end-to-end, retraining loop, maturidade 0/1/2': 'End-to-end system design, retraining loop, maturity 0/1/2',
    'S3, SageMaker, Lambda, Step Functions, ML Lens (6 pilares)': 'S3, SageMaker, Lambda, Step Functions, ML Lens (6 pillars)',
    'Data drift, concept drift, observabilidade, alertas, retraining': 'Data drift, concept drift, observability, alerts, retraining'
  });
})();
