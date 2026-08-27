/* Vektia, PT -> EN dictionary for the algorithm catalog (33 spec sheets).
   Covers card tags, one-line ideas, context lines, chips, "when to use" and
   "when NOT to use". Strings already in English are omitted. */
(function () {
  if (!window.I18N) return;

  window.I18N.register({

    /* ---------- card category tags ---------- */
    'Regressão · Linear': 'Regression · Linear',
    'Regressão · Regularizada': 'Regression · Regularized',
    'Regressão · Sparse': 'Regression · Sparse',
    'Regressão · L1+L2': 'Regression · L1+L2',
    'Regressão · Margem': 'Regression · Margin',
    'Classificação · Linear': 'Classification · Linear',
    'Classificação/Regressão · Não-paramétrico': 'Classification/Regression · Non-parametric',
    'Ensemble · Boosting otimizado': 'Ensemble · Optimized boosting',
    'Classificação · Margem máxima': 'Classification · Maximum margin',
    'Classificação/Regressão · Lazy': 'Classification/Regression · Lazy',
    'Classificação · Probabilístico': 'Classification · Probabilistic',
    'Clustering · Centroides': 'Clustering · Centroids',
    'Clustering · Densidade': 'Clustering · Density',
    'Clustering · Dendrograma': 'Clustering · Dendrogram',
    'Redução de Dim. · Linear': 'Dim. Reduction · Linear',
    'Redução de Dim. · Visualização': 'Dim. Reduction · Visualization',
    'Redução de Dim. · Moderno': 'Dim. Reduction · Modern',
    'Anomalia · Árvores': 'Anomaly · Trees',
    'Estratégia': 'Strategy',
    'Grafo': 'Graph',
    'Deep · Vanilla': 'Deep · Vanilla',
    'Deep · Visão': 'Deep · Vision',
    'Deep · Sequencial': 'Deep · Sequential',
    'Deep · Atenção': 'Deep · Attention',
    'RL · Tabular': 'RL · Tabular',
    'Alinhamento · LLMs': 'Alignment · LLMs',

    /* ---------- one-line ideas ---------- */
    'Aprende uma relação linear entre features e target minimizando o erro quadrático.':
      'Learns a linear relationship between features and target by minimizing squared error.',
    'Linear regression penalizando a soma dos quadrados dos pesos.': 'Linear regression penalizing the sum of squared weights.',
    'Linear regression com penalidade L1, zera coeficientes irrelevantes.': 'Linear regression with an L1 penalty, zeroing out irrelevant coefficients.',
    'Mistura Lasso e Ridge: seleção + shrinkage estável.': 'Blends Lasso and Ridge: selection plus stable shrinkage.',
    'Encontra a "tubulação" de largura ε ao redor da função que tolera erros pequenos.':
      'Finds a tube of width ε around the function that tolerates small errors.',
    'Modela P(y=1|x) com função sigmoide aplicada a uma combinação linear.': 'Models P(y=1|x) with a sigmoid applied to a linear combination.',
    'Particionamento hierárquico do espaço de features via splits que maximizam pureza.':
      'Hierarchical partitioning of the feature space through splits that maximize purity.',
    'Bagging de árvores com subsample de features em cada split.': 'Bagging of trees with feature subsampling at every split.',
    'Árvores fracas sequenciais, cada uma corrigindo o erro residual da anterior.':
      'Sequential weak trees, each one correcting the residual error of the last.',
    'Gradient boosting com regularização explícita, segunda derivada e implementação de produção.':
      'Gradient boosting with explicit regularization, second derivatives and a production-grade implementation.',
    'Encontra o hiperplano que maximiza a margem entre as classes (com kernel trick para não-linearidade).':
      'Finds the hyperplane that maximizes the margin between classes (with the kernel trick for non-linearity).',
    'Classifica pela maioria dos k vizinhos mais próximos no espaço de features.':
      'Classifies by majority vote among the k nearest neighbors in feature space.',
    'Aplica Bayes assumindo independência condicional entre features dada a classe.':
      'Applies Bayes while assuming conditional independence between features given the class.',
    'Agrupa n pontos em k clusters minimizando a soma das distâncias ao centróide.':
      'Groups n points into k clusters by minimizing the sum of distances to the centroid.',
    'Agrupa pontos que estão em regiões densas, marca pontos isolados como ruído.':
      'Groups points sitting in dense regions and marks isolated points as noise.',
    'Constrói árvore de clusters (aglomerativo ou divisivo) usando uma métrica de linkage.':
      'Builds a tree of clusters (agglomerative or divisive) using a linkage metric.',
    'Encontra direções de máxima variância (componentes principais) e projeta os dados nelas.':
      'Finds the directions of maximum variance (principal components) and projects the data onto them.',
    'Mapeia pontos para 2D/3D preservando vizinhanças locais via distribuições t-Student.':
      'Maps points to 2D/3D while preserving local neighborhoods via t-Student distributions.',
    'Preserva estrutura local e parcialmente global usando topologia algébrica.':
      'Preserves local and partially global structure using algebraic topology.',
    'Anomalias são fáceis de isolar, têm caminhos curtos em árvores de partição aleatória.':
      'Anomalies are easy to isolate: they sit at short paths in randomly partitioned trees.',
    'Treine no labeled, prediga no unlabeled, adicione as predições mais confiantes como labels.':
      'Train on the labeled set, predict on the unlabeled one, then add the most confident predictions as labels.',
    'Constrói grafo de similaridade, propaga rótulos dos pontos conhecidos para os vizinhos.':
      'Builds a similarity graph and propagates labels from known points to their neighbors.',
    'Esconde alguns tokens, treina o modelo para reconstrui-los a partir do contexto bidirecional.':
      'Masks some tokens and trains the model to reconstruct them from bidirectional context.',
    'Prediz o próximo token dado o histórico. A base de todo LLM moderno.':
      'Predicts the next token given the history. The basis of every modern LLM.',
    'Aproxima pares positivos (mesma imagem com augmentation) e afasta negativos no espaço de embedding.':
      'Pulls positive pairs (the same image augmented) together and pushes negatives apart in embedding space.',
    'Camadas densas com ativação não-linear empilhadas. A base de tudo em deep learning.':
      'Stacked dense layers with non-linear activations. The basis of everything in deep learning.',
    'Convoluções compartilham pesos espacialmente, capturando padrões locais (bordas → formas → objetos).':
      'Convolutions share weights spatially, capturing local patterns (edges → shapes → objects).',
    'Estado oculto recorrente captura dependências temporais. LSTM/GRU lidam com gradientes.':
      'A recurrent hidden state captures temporal dependencies. LSTM/GRU handle the gradients.',
    'Self-attention permite cada token olhar para todos os outros, capturando dependências arbitrárias.':
      'Self-attention lets every token look at every other one, capturing arbitrary dependencies.',
    'Aprende a função valor-ação Q(s,a) via Bellman update sem modelo do ambiente.':
      'Learns the action-value function Q(s,a) through Bellman updates, with no model of the environment.',
    'Q-Learning com rede neural aproximando Q(s,a), replay buffer e target network.':
      'Q-Learning with a neural network approximating Q(s,a), a replay buffer and a target network.',
    'Atualiza política diretamente com clipping para evitar passos grandes que desestabilizem.':
      'Updates the policy directly, with clipping to avoid large destabilizing steps.',
    'Fine-tune um LLM para maximizar preferência humana via reward model + PPO (ou direto via DPO).':
      'Fine-tunes an LLM to maximize human preference via a reward model plus PPO (or directly via DPO).',

    /* ---------- context lines ---------- */
    'O modelo mais antigo e fundamental. Tudo em ML é, de algum jeito, uma variação dele.':
      'The oldest and most fundamental model. Everything in ML is, in some way, a variation of it.',
    'Encolhe coeficientes em direção a zero, sem zerá-los. Estável com features correlacionadas.':
      'Shrinks coefficients toward zero without zeroing them. Stable with correlated features.',
    'Faz seleção de features automática. Geometria da bola L1 (losango) força coeficientes a zero.':
      'Does automatic feature selection. The geometry of the L1 ball (a diamond) forces coefficients to zero.',
    'O melhor dos dois mundos quando há features correlacionadas e você ainda quer esparsidade.':
      'The best of both worlds when you have correlated features and still want sparsity.',
    'Versão de regressão do SVM. Robusto a outliers via ε-insensitive loss.':
      'The regression version of SVM. Robust to outliers thanks to the ε-insensitive loss.',
    'O baseline obrigatório de toda classificação. Probabilidades calibradas, interpretável, rápido.':
      'The mandatory baseline for any classification task. Calibrated probabilities, interpretable, fast.',
    'Glass box absoluto. Base de Random Forest e Gradient Boosting.':
      'A complete glass box. The basis of Random Forest and Gradient Boosting.',
    'Default seguro para dados tabulares. Robusto, fácil de tunar, paralelizável.':
      'A safe default for tabular data. Robust, easy to tune, parallelizable.',
    'Princípio do XGBoost, LightGBM, CatBoost. Domina dados tabulares.':
      'The principle behind XGBoost, LightGBM and CatBoost. It dominates tabular data.',
    'Por que domina Kaggle: histogram-based splits, leaf-wise growth, regularização L1/L2 nas folhas, GPU.':
      'Why it dominates Kaggle: histogram-based splits, leaf-wise growth, L1/L2 regularization on the leaves, GPU.',
    'Geometria pura. Reigna em datasets pequenos/médios com fronteiras complexas.':
      'Pure geometry. It reigns on small and medium datasets with complex boundaries.',
    'Lazy learner: não treina, apenas memoriza. Simples mas custoso na inferência.':
      'A lazy learner: it does not train, it just memorizes. Simple but expensive at inference.',
    'Baseline imbatível em texto. Treina em uma passada nos dados.':
      'An unbeatable baseline on text. It trains in a single pass over the data.',
    'Default de clustering. Simples, rápido, mas pressupõe clusters esféricos.':
      'The clustering default. Simple and fast, but it assumes spherical clusters.',
    'Não precisa de k. Acha clusters de qualquer forma. Bom para detectar anomalias.':
      'No need to pick k. It finds clusters of any shape. Good for spotting anomalies.',
    'Excelente para análise exploratória. O dendrograma revela a estrutura natural.':
      'Excellent for exploratory analysis. The dendrogram reveals the natural structure.',
    'Linear, determinístico, interpretável. Substrato para visualização, compressão e descorrelação.':
      'Linear, deterministic, interpretable. The substrate for visualization, compression and decorrelation.',
    'O melhor para visualizar embeddings, mas só serve para visualização, não para produção.':
      'The best way to visualize embeddings, but it is only for visualization, never production.',
    'Mais escalável que t-SNE, melhor preservação de estrutura global. Pode ser usado em pipelines.':
      'More scalable than t-SNE and better at preserving global structure. It can be used in pipelines.',
    'Default para detecção de anomalia em dados tabulares de alta dimensão.':
      'The default for anomaly detection on high-dimensional tabular data.',
    'A estratégia mais simples de semi-supervised. Cuidado com cascata de erros.':
      'The simplest semi-supervised strategy. Watch out for cascading errors.',
    'Funciona bem quando a estrutura geométrica revela classes.':
      'Works well when the geometric structure reveals the classes.',
    'A receita do BERT. Cria representações ricas sem rótulos.':
      'The BERT recipe. It creates rich representations without labels.',
    'GPT, Llama, Claude. Simples na superfície, profundo nos efeitos emergentes.':
      'GPT, Llama, Claude. Simple on the surface, deep in its emergent effects.',
    'SimCLR, MoCo, CLIP. Aprende representações sem rótulos via pares.':
      'SimCLR, MoCo, CLIP. It learns representations without labels, through pairs.',
    'Regressão logística com várias camadas. Universal approximator.':
      'Logistic regression with several layers. A universal approximator.',
    'Inductive bias para imagens. ResNet, EfficientNet, ConvNeXt.':
      'An inductive bias for images. ResNet, EfficientNet, ConvNeXt.',
    'Substituído por Transformers para texto, ainda relevante para edge e séries temporais.':
      'Replaced by Transformers for text, still relevant for edge devices and time series.',
    'A arquitetura que mudou IA. Base de LLMs, ViT, multimodal.':
      'The architecture that changed AI. The basis of LLMs, ViT and multimodal models.',
    'Off-policy. Funciona em ambientes discretos. Base do DQN.':
      'Off-policy. It works in discrete environments. The basis of DQN.',
    'Atari, jogos. Truques de estabilidade são essenciais.':
      'Atari and games. Stability tricks are essential here.',
    'Default moderno de RL on-policy. Base do RLHF.':
      'The modern default for on-policy RL. The basis of RLHF.',
    'O que transformou modelos de linguagem em assistentes úteis.':
      'What turned language models into useful assistants.',

    /* ---------- "see also" ---------- */
    'Lasso (L1) faz seleção; ElasticNet combina ambos.': 'Lasso (L1) does selection; ElasticNet combines both.',
    'ElasticNet resolve a instabilidade com features correlacionadas.': 'ElasticNet solves the instability with correlated features.',
    'GLM, Naive Bayes, SVM linear.': 'GLM, Naive Bayes, linear SVM.',
    'CatBoost (especial para categóricas), HistGradientBoosting (sklearn).': 'CatBoost (great for categoricals), HistGradientBoosting (sklearn).',

    /* ---------- chips ---------- */
    'regressão': 'regression', 'interpretável': 'interpretable', 'seleção': 'selection',
    'híbrido': 'hybrid', 'margem': 'margin', 'classificação': 'classification',
    'probabilístico': 'probabilistic', 'árvore': 'tree', 'não-paramétrico': 'non-parametric',
    'robusto': 'robust', 'gradiente': 'gradient', 'geometria': 'geometry',
    'distância': 'distance', 'texto': 'text', 'rápido': 'fast',
    'centroides': 'centroids', 'esférico': 'spherical', 'densidade': 'density',
    'anomalia': 'anomaly', 'dendrograma': 'dendrogram', 'exploratório': 'exploratory',
    'redução de dim': 'dim reduction', 'variância': 'variance', 'visualização': 'visualization',
    'não-linear': 'non-linear', 'escalável': 'scalable', 'grafo': 'graph',
    'transdutivo': 'transductive', 'visão': 'vision', 'sequencial': 'sequential',
    'séries temporais': 'time series', 'alinhamento': 'alignment',

    /* ---------- when to use ---------- */
    'Relação aproximadamente linear': 'Roughly linear relationship',
    'Necessidade de interpretar coeficientes': 'You need to interpret the coefficients',
    'Baseline rápido': 'A fast baseline',
    'Dataset pequeno/médio': 'Small or medium dataset',
    'Multicolinearidade entre features': 'Multicollinearity between features',
    'Mais features que amostras': 'More features than samples',
    'Quer manter todas as features': 'You want to keep every feature',
    'Estabilizar coeficientes': 'Stabilizing coefficients',
    'Acreditar que muitas features são irrelevantes': 'You believe many features are irrelevant',
    'Interpretabilidade esparsa é prioridade': 'Sparse interpretability is the priority',
    'High-dimensional (d > n)': 'High-dimensional (d > n)',
    'High-dimensional com features correlacionadas': 'High-dimensional with correlated features',
    'Genômica, fMRI, dados químicos': 'Genomics, fMRI, chemical data',
    'Quer seleção + estabilidade': 'You want selection plus stability',
    'Relações não-lineares com kernel': 'Non-linear relationships via a kernel',
    'Sensibilidade a outliers reduzida': 'Reduced sensitivity to outliers',
    'Baseline de classificação': 'A classification baseline',
    'Probabilidades bem calibradas': 'Well-calibrated probabilities',
    'Necessidade de coeficientes interpretáveis': 'You need interpretable coefficients',
    'Risk scoring (crédito, fraude)': 'Risk scoring (credit, fraud)',
    'Necessidade absoluta de interpretabilidade': 'Interpretability is non-negotiable',
    'Mistura de features categóricas e numéricas': 'A mix of categorical and numeric features',
    'Regras de negócio': 'Business rules',
    'Default tabular sem muito tuning': 'A tabular default without much tuning',
    'Sinal de feature importance': 'Feature importance signal',
    'Quer robustez sem ajustar muitos hiperparâmetros': 'You want robustness without tuning many hyperparameters',
    'Dados tabulares com performance crítica': 'Tabular data where performance is critical',
    'Quando RF não é bom o suficiente': 'When RF is not good enough',
    'Competições, ranking, fraude': 'Competitions, ranking, fraud',
    'SOTA em dados tabulares': 'State of the art on tabular data',
    'Competições': 'Competitions',
    'Sistemas de ranking': 'Ranking systems',
    'Quando RF/GBM puro deu plateau': 'When plain RF/GBM has plateaued',
    'Datasets pequenos/médios (<50k)': 'Small or medium datasets (<50k)',
    'Espaço de alta dimensão (texto via TF-IDF)': 'High-dimensional space (text via TF-IDF)',
    'Fronteiras complexas com kernel': 'Complex boundaries with a kernel',
    'Datasets pequenos': 'Small datasets',
    'Fronteiras irregulares': 'Irregular boundaries',
    'Recomendação simples': 'Simple recommendation',
    'Classificação de texto (spam, sentimento)': 'Text classification (spam, sentiment)',
    'Baseline ultrarrápido': 'An ultra-fast baseline',
    'Poucos dados': 'Little data',
    'Segmentação de clientes': 'Customer segmentation',
    'Compressão de cores': 'Color compression',
    'Quantização': 'Quantization',
    'Quando k é conhecido': 'When k is known',
    'Clusters de forma arbitrária': 'Clusters of arbitrary shape',
    'Detecção de ruído/anomalia': 'Noise and anomaly detection',
    'Análise exploratória inicial': 'Early exploratory analysis',
    'Datasets pequenos/médios': 'Small or medium datasets',
    'Bioinformática (filogenia)': 'Bioinformatics (phylogeny)',
    'Compressão preservando variância': 'Compression that preserves variance',
    'Remover multicolinearidade': 'Removing multicollinearity',
    'Visualização 2D/3D inicial': 'Initial 2D/3D visualization',
    'Pré-processamento para KNN/SVM': 'Preprocessing for KNN/SVM',
    'Visualizar embeddings de alta dimensão': 'Visualizing high-dimensional embeddings',
    'Apresentações e exploração': 'Presentations and exploration',
    'Visualização e redução para downstream': 'Visualization and reduction for downstream tasks',
    'Bioinformática (single-cell)': 'Bioinformatics (single-cell)',
    'Detecção de fraude/intrusão em dados tabulares': 'Fraud and intrusion detection on tabular data',
    'Alta dimensionalidade': 'High dimensionality',
    'Sem rótulos de anomalia': 'No anomaly labels',
    'Muitos dados não rotulados + poucos rotulados': 'Lots of unlabeled data and few labels',
    'Tarefas onde modelo tem alta precisão em confiança alta': 'Tasks where the model is precise when confident',
    'Estrutura cluster clara entre classes': 'Clear cluster structure between classes',
    'Datasets onde KNN funcionaria': 'Datasets where KNN would work',
    'Pretrain de modelos de linguagem para fine-tuning': 'Pretraining language models for fine-tuning',
    'Representações para classificação/NER': 'Representations for classification and NER',
    'Pretrain de LLMs': 'Pretraining LLMs',
    'Geração de texto, código, áudio tokenizado': 'Generating text, code and tokenized audio',
    'Embeddings de imagem/áudio sem rótulos': 'Image and audio embeddings without labels',
    'Multimodal (CLIP, texto+imagem)': 'Multimodal (CLIP, text plus image)',
    'Tabular complexo onde GBM dá plateau': 'Complex tabular data where GBM plateaus',
    'Função desconhecida com dados suficientes': 'An unknown function with enough data',
    'Base para arquiteturas customizadas': 'A base for custom architectures',
    'Visão (classificação, detecção, segmentação)': 'Vision (classification, detection, segmentation)',
    'Sinais com estrutura local (áudio, séries)': 'Signals with local structure (audio, series)',
    'Streaming/online': 'Streaming and online',
    'Recursos limitados (edge)': 'Limited resources (edge)',
    'NLP, visão, áudio, multimodal': 'NLP, vision, audio, multimodal',
    'Sequências longas com dependências globais': 'Long sequences with global dependencies',
    'Ambientes discretos e pequenos': 'Small, discrete environments',
    'Quando você pode tabular tudo': 'When you can tabulate everything',
    'Estados contínuos com ações discretas': 'Continuous states with discrete actions',
    'Jogos, simulações': 'Games and simulations',
    'Ambientes contínuos': 'Continuous environments',
    'Quando estabilidade > sample efficiency': 'When stability matters more than sample efficiency',
    'Alinhar LLMs a preferências humanas': 'Aligning LLMs to human preferences',
    'Reduzir toxicidade': 'Reducing toxicity',
    'Customizar comportamento': 'Customizing behavior',

    /* ---------- when NOT to use ---------- */
    'Relações fortemente não-lineares': 'Strongly non-linear relationships',
    'Features muito correlacionadas (multicolinearidade)': 'Highly correlated features (multicollinearity)',
    'Muitos outliers extremos': 'Many extreme outliers',
    'Heterocedasticidade severa': 'Severe heteroscedasticity',
    'Quer seleção automática de features': 'You want automatic feature selection',
    'Interpretação esparsa é prioridade': 'Sparse interpretation is the priority',
    'Não há overfitting': 'There is no overfitting',
    'Features altamente correlacionadas (Lasso escolhe arbitrariamente uma)':
      'Highly correlated features (Lasso arbitrarily picks one)',
    'Não tem orçamento para tunar dois hiperparâmetros': 'You cannot afford to tune two hyperparameters',
    'Datasets muito grandes (>100k)': 'Very large datasets (>100k)',
    'Quer interpretabilidade': 'You want interpretability',
    'Quer probabilidades calibradas': 'You want calibrated probabilities',
    'Fronteira de decisão fortemente não-linear': 'A strongly non-linear decision boundary',
    'Classes não-linearmente separáveis sem features engineered':
      'Classes that are not linearly separable without engineered features',
    'Sozinha quase sempre, use Random Forest ou XGBoost': 'On its own, almost always; use Random Forest or XGBoost',
    'Relações suaves contínuas': 'Smooth continuous relationships',
    'Quer extrapolação': 'You need extrapolation',
    'Modelo final tem que ser pequeno (RF é pesado)': 'The final model has to be small (RF is heavy)',
    'Quer extrapolação fora da distribuição de treino': 'You need extrapolation outside the training distribution',
    'Latência crítica': 'Latency is critical',
    'Latência ultrabaixa': 'Ultra-low latency',
    'Necessidade de interpretabilidade total': 'You need total interpretability',
    'Datasets muito ruidosos sem tuning cuidadoso': 'Very noisy datasets without careful tuning',
    'Dados de imagem/áudio/texto (use deep learning)': 'Image, audio or text data (use deep learning)',
    'Quando você precisa explicar a um regulador linha-a-linha': 'When you must explain it to a regulator line by line',
    'Datasets enormes (treino O(n²−n³))': 'Huge datasets (training is O(n²−n³))',
    'Quer probabilidades nativas': 'You want native probabilities',
    'Datasets grandes (inferência O(n·d))': 'Large datasets (inference is O(n·d))',
    'Alta dimensionalidade (maldição da dimensionalidade)': 'High dimensionality (the curse of dimensionality)',
    'Features fortemente correlacionadas (a hipótese quebra)': 'Strongly correlated features (the assumption breaks)',
    'Probabilidades calibradas finas são necessárias': 'You need finely calibrated probabilities',
    'Densidades muito variáveis': 'Widely varying densities',
    'Não sabe quantos clusters': 'You do not know how many clusters there are',
    'Densidades muito variáveis entre clusters': 'Widely varying densities across clusters',
    'Alta dimensionalidade (a distância colapsa)': 'High dimensionality (distance collapses)',
    'Datasets grandes (O(n²))': 'Large datasets (O(n²))',
    'Tempo real': 'Real time',
    'Relações não-lineares (use kernel PCA, UMAP)': 'Non-linear relationships (use kernel PCA or UMAP)',
    'Quando interpretabilidade das features originais é crítica':
      'When interpretability of the original features is critical',
    'Produção (não é função, é mapeamento)': 'Production (it is not a function, it is a mapping)',
    'Preservar distâncias globais': 'Preserving global distances',
    'Datasets > 100k sem aproximação': 'Datasets over 100k without approximation',
    'Quando interpretabilidade linear é necessária': 'When linear interpretability is required',
    'Dados sequenciais sem feature engineering': 'Sequential data without feature engineering',
    'Quando densidade variável é o sinal-chave': 'When varying density is the key signal',
    'Quando o modelo é mal-calibrado': 'When the model is poorly calibrated',
    'Classes muito desbalanceadas no labeled': 'Heavily imbalanced classes in the labeled set',
    'Dados em alta dimensionalidade pura': 'Purely high-dimensional data',
    'Datasets gigantes (grafo O(n²))': 'Huge datasets (the graph is O(n²))',
    'Geração autoregressive (use NTP)': 'Autoregressive generation (use NTP)',
    'Tarefas que precisam só de saída sequencial': 'Tasks that only need sequential output',
    'Quando você precisa de representações bidirecionais para classificação fina (use MLM)':
      'When you need bidirectional representations for fine-grained classification (use MLM)',
    'Quando dados não permitem augmentation natural': 'When the data does not allow natural augmentation',
    'Tarefas com supervisão abundante já disponível': 'Tasks that already have abundant supervision',
    'Tabular médio onde GBM já é ótimo': 'Mid-size tabular data where GBM is already great',
    'Quando relações são globais sem hierarquia local (use Transformer)':
      'When relationships are global with no local hierarchy (use a Transformer)',
    'Sequências longas com dependências distantes (use Transformer)':
      'Long sequences with distant dependencies (use a Transformer)',
    'Edge sem otimização': 'Edge devices without optimization',
    'Sequências curtas onde CNN/RNN é mais barato': 'Short sequences where a CNN/RNN is cheaper',
    'Estados contínuos (use DQN/policy gradient)': 'Continuous states (use DQN or policy gradient)',
    'Action spaces grandes': 'Large action spaces',
    'Ações contínuas (use DDPG/SAC)': 'Continuous actions (use DDPG or SAC)',
    'Quando políticas estocásticas são necessárias': 'When stochastic policies are required',
    'Off-policy puro com replay (use SAC, DQN)': 'Pure off-policy with replay (use SAC or DQN)',
    'Quando SFT é suficiente; quando feedback humano é caro e raso':
      'When SFT is enough, or when human feedback is expensive and shallow'
  });
})();
