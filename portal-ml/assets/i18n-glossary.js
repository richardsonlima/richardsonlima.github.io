/* Vektia, PT -> EN dictionary for the glossary (122 entries: names, tags, definitions). */
(function () {
  if (!window.I18N) return;

  window.I18N.register({

    /* ---------- category tags ---------- */
    'Métrica': 'Metric', 'Estudo': 'Study', 'Probabilidade': 'Probability',
    'Fundamento': 'Fundamental', 'Regularização': 'Regularization', 'Validação': 'Validation',
    'Geometria': 'Geometry', 'Tarefa': 'Task', 'Família': 'Family',
    'Teoria Inf.': 'Info Theory', 'Treino': 'Training', 'Engenharia': 'Engineering',
    'Interpretab.': 'Interpretab.', 'Pré-process.': 'Preprocessing', 'Árvore': 'Tree',
    'Otimização': 'Optimization', 'Modelo': 'Model', 'Regressão': 'Regression',
    'Redução Dim.': 'Dim. Reduction', 'Ativação': 'Activation', 'Paradigma': 'Paradigm',
    'Domínio': 'Domain', 'IA Moderna': 'Modern AI', 'Anomalia': 'Anomaly',

    /* ---------- term names in Portuguese ---------- */
    'Calibração': 'Calibration', 'Centroide': 'Centroid', 'Classificação': 'Classification',
    'Hiperparâmetro': 'Hyperparameter', 'Multicolinearidade': 'Multicollinearity',
    'Supervisionado': 'Supervised',

    /* ---------- definitions ---------- */
    'Fração de predições corretas. Engana com classes desbalanceadas, use F1 ou AUC.':
      'The fraction of correct predictions. Misleading with imbalanced classes, so use F1 or AUC.',
    'Modelo escolhe ativamente quais amostras o humano deve rotular para maximizar ganho de informação.':
      'The model actively picks which samples a human should label to maximize information gain.',
    'Área sob a curva ROC. Probabilidade de o modelo ranquear um positivo aleatório acima de um negativo aleatório.':
      'The area under the ROC curve. The probability the model ranks a random positive above a random negative.',
    'Rede que comprime input em representação latente e tenta reconstruí-lo. Usado em redução, denoising e anomalia.':
      'A network that compresses input into a latent representation and tries to rebuild it. Used for reduction, denoising and anomaly detection.',
    'Mecanismo que pondera dinamicamente partes do input. Base do Transformer.':
      'A mechanism that dynamically weights parts of the input. The basis of the Transformer.',
    'Estratégia de estudo: forçar o cérebro a recuperar a informação ao invés de reler. Flashcards são a forma canônica.':
      'A study strategy: force your brain to retrieve the information instead of rereading it. Flashcards are the canonical form.',
    'Algoritmo que calcula gradientes da loss em relação aos pesos via chain rule, da saída para a entrada.':
      'The algorithm that computes gradients of the loss with respect to the weights via the chain rule, from output back to input.',
    'Bootstrap Aggregating. Treinar N modelos em amostras com reposição e agregar predições. Reduz variância.':
      'Bootstrap Aggregating. Train N models on samples drawn with replacement and aggregate their predictions. Reduces variance.',
    'Normaliza ativações dentro de um mini-batch para acelerar convergência e estabilizar treino.':
      'Normalizes activations within a mini-batch to speed up convergence and stabilize training.',
    'P(A|B) = P(B|A) · P(A) / P(B). Fundamento dos métodos probabilísticos.':
      'P(A|B) = P(B|A) · P(A) / P(B). The foundation of probabilistic methods.',
    'Bias = erro sistemático; Variance = sensibilidade ao dataset. Total error = Bias² + Variance + Noise. O ponto ótimo balanceia ambos.':
      'Bias is systematic error; variance is sensitivity to the dataset. Total error = Bias² + Variance + Noise. The sweet spot balances both.',
    'Treinar modelos sequencialmente, cada um corrigindo os erros do anterior. Reduz bias.':
      'Train models sequentially, each one correcting the errors of the last. Reduces bias.',
    'MSE entre probabilidades preditas e rótulos. Mede calibração probabilística.':
      'The MSE between predicted probabilities and labels. It measures probabilistic calibration.',
    'O quanto a probabilidade predita corresponde à frequência real. Platt scaling e isotonic calibration corrigem.':
      'How closely the predicted probability matches the real frequency. Platt scaling and isotonic calibration fix it.',
    'Gradient boosting otimizado para features categóricas via ordered target encoding.':
      'Gradient boosting optimized for categorical features through ordered target encoding.',
    'Ponto médio de um cluster. K-Means atualiza centróides iterativamente.':
      'The mean point of a cluster. K-Means updates centroids iteratively.',
    'Predição de saída categórica: binária, multiclasse ou multilabel.':
      'Predicting a categorical output: binary, multiclass or multilabel.',
    'Contrastive Language-Image Pretraining. Aprende embeddings conjuntos de texto e imagem.':
      'Contrastive Language-Image Pretraining. It learns joint text and image embeddings.',
    'Agrupar pontos por similaridade sem rótulos. K-Means, DBSCAN, Hierarchical.':
      'Grouping points by similarity without labels. K-Means, DBSCAN, hierarchical.',
    'Convolutional Neural Network. Convoluções compartilham pesos espacialmente. Default para imagens.':
      'Convolutional Neural Network. Convolutions share weights spatially. The default for images.',
    'A relação P(y|x) muda ao longo do tempo. Diferente de data drift, onde P(x) muda.':
      'The relationship P(y|x) changes over time. Different from data drift, where P(x) changes.',
    'Aprende aproximando pares positivos e afastando negativos no espaço de embedding.':
      'Learns by pulling positive pairs together and pushing negatives apart in embedding space.',
    'k-fold: dividir dados em k partes, treinar em k−1 e validar na restante, rotacionando.':
      'k-fold: split the data into k parts, train on k−1 and validate on the remaining one, rotating through.',
    'Em alta dimensão, distâncias entre pontos colapsam, volume se concentra na casca, e amostras tornam-se esparsas.':
      'In high dimensions distances between points collapse, volume concentrates in the shell, and samples become sparse.',
    'A distribuição P(x) muda. Detectado via testes de distribuição (KS, PSI).':
      'The distribution P(x) changes. Detected through distribution tests (KS, PSI).',
    'Informação do futuro/target vaza para o treino. Inflar métricas em treino, falhar em produção.':
      'Information from the future or the target leaks into training. Metrics look inflated in training and the model fails in production.',
    'Density-Based Spatial Clustering. Acha clusters de forma arbitrária e marca outliers.':
      'Density-Based Spatial Clustering. It finds clusters of arbitrary shape and flags outliers.',
    'Particionamento hierárquico por splits que maximizam pureza (Gini/entropia).':
      'Hierarchical partitioning through splits that maximize purity (Gini or entropy).',
    'Redes neurais com múltiplas camadas que aprendem representações hierárquicas.':
      'Neural networks with multiple layers that learn hierarchical representations.',
    'Direct Preference Optimization. Alinha LLMs com preferências sem treinar reward model separado.':
      'Direct Preference Optimization. It aligns LLMs to preferences without training a separate reward model.',
    'Desliga neurônios aleatoriamente durante treino. Evita co-adaptação.':
      'Randomly switches neurons off during training. Prevents co-adaptation.',
    'Para o treino quando a métrica de validação para de melhorar. Forma barata e eficaz de regularização.':
      'Stops training when the validation metric stops improving. A cheap and effective form of regularization.',
    'Combina penalização L1 + L2. Bom com features correlacionadas.':
      'Combines L1 and L2 penalties. Good with correlated features.',
    'Vetor denso de baixa dimensão que captura semântica de um objeto (palavra, imagem, usuário).':
      'A dense low-dimensional vector that captures the semantics of an object (a word, an image, a user).',
    'Combinação de múltiplos modelos. Bagging, boosting, stacking.':
      'A combination of several models. Bagging, boosting, stacking.',
    'H(X) = −Σ p log p. Mede incerteza/desordem. Critério de split em árvores.':
      'H(X) = −Σ p log p. It measures uncertainty and disorder. A split criterion in trees.',
    'Uma passagem completa pelos dados de treino.': 'One complete pass over the training data.',
    'Criar features informativas a partir dos dados brutos. O gap que separa juniors de seniors.':
      'Building informative features out of raw data. The gap that separates juniors from seniors.',
    'Medida de quanto cada feature contribui para predições. Gain em árvores, SHAP em qualquer modelo.':
      'A measure of how much each feature contributes to predictions. Gain in trees, SHAP in any model.',
    'Normalizar features para magnitudes comparáveis. Min-max, z-score, robust scaler.':
      'Normalizing features to comparable magnitudes. Min-max, z-score, robust scaler.',
    'Média harmônica de precisão e recall. Útil em classes desbalanceadas.':
      'The harmonic mean of precision and recall. Useful with imbalanced classes.',
    'Aprender com pouquíssimos exemplos por classe. LLMs fazem in-context.':
      'Learning from very few examples per class. LLMs do it in context.',
    'Modelo pré-treinado em escala que serve de base para múltiplas tarefas downstream.':
      'A model pre-trained at scale that serves as the basis for many downstream tasks.',
    '1 − Σ pₖ². Critério de impureza em árvores. Próximo de zero = puro.':
      '1 − Σ pₖ². An impurity criterion in trees. Close to zero means pure.',
    'Gaussian Mixture Model. Clusters como misturas de gaussianas, com soft assignment.':
      'Gaussian Mixture Model. Clusters as mixtures of Gaussians, with soft assignment.',
    'Árvores fracas sequenciais cada uma corrigindo o resíduo (gradiente) da anterior.':
      'Sequential weak trees, each correcting the residual (the gradient) of the last.',
    'Iterativamente atualizar parâmetros na direção oposta ao gradiente da loss.':
      'Iteratively updating parameters in the direction opposite the gradient of the loss.',
    'Gated Recurrent Unit. Versão simplificada do LSTM com menos gates.':
      'Gated Recurrent Unit. A simplified LSTM with fewer gates.',
    'Parâmetro que controla o treino mas não é aprendido dos dados. λ, learning rate, max_depth.':
      'A parameter that controls training but is not learned from the data. λ, learning rate, max_depth.',
    'Loss híbrida quadrática para erros pequenos e linear para grandes. Robusta a outliers.':
      'A hybrid loss: quadratic for small errors, linear for large ones. Robust to outliers.',
    'Quando uma classe é muito mais frequente. Use SMOTE, class weights, ou métricas adequadas.':
      'When one class is far more frequent. Use SMOTE, class weights, or suitable metrics.',
    'LLM aprende uma tarefa apenas vendo exemplos no prompt, sem atualizar pesos.':
      'An LLM learns a task just by seeing examples in the prompt, without updating any weights.',
    'Anomalias são fáceis de isolar, caminhos curtos em árvores aleatórias.':
      'Anomalies are easy to isolate: they sit at short paths in random trees.',
    'Particiona em k clusters minimizando distância aos centróides. Pressupõe clusters esféricos.':
      'Partitions into k clusters by minimizing distance to the centroids. It assumes spherical clusters.',
    'Substituir produtos internos por kernel K(x,y) para operar em espaço de alta dim sem mapeá-lo explicitamente.':
      'Replacing inner products with a kernel K(x,y) to operate in a high-dimensional space without mapping into it explicitly.',
    'Mede divergência entre duas distribuições. Não simétrica. Base de muitas losses.':
      'Measures the divergence between two distributions. Not symmetric. The basis of many losses.',
    'Classifica pela maioria dos k vizinhos mais próximos no espaço de features.':
      'Classifies by majority vote among the k nearest neighbors in feature space.',
    'Penaliza |β|. Induz esparsidade, zera coeficientes.': 'Penalizes |β|. It induces sparsity and zeroes out coefficients.',
    'Penaliza β². Encolhe coeficientes uniformemente.': 'Penalizes β². It shrinks coefficients uniformly.',
    'Propaga rótulos por similaridade em grafo dos pontos rotulados aos não rotulados.':
      'Propagates labels by similarity across a graph, from labeled points to unlabeled ones.',
    'Regressão linear com L1. Faz seleção automática de features.':
      'Linear regression with L1. It does automatic feature selection.',
    'Gradient boosting otimizado por histogramas e leaf-wise growth. Muito rápido.':
      'Gradient boosting optimized with histograms and leaf-wise growth. Very fast.',
    'f(x) = βᵀx + b. Minimiza MSE.': 'f(x) = βᵀx + b. It minimizes MSE.',
    'Classificação binária via função sigmoide sobre combinação linear. Probabilidades calibradas.':
      'Binary classification through a sigmoid over a linear combination. Calibrated probabilities.',
    '−Σ y log p + (1-y) log(1-p). Penaliza confiança errada exponencialmente.':
      '−Σ y log p + (1-y) log(1-p). It penalizes confident mistakes exponentially.',
    'Long Short-Term Memory. RNN com gates que lida com dependências longas.':
      'Long Short-Term Memory. An RNN with gates that handles long dependencies.',
    'Mean Absolute Error. Robusto a outliers. Mesma unidade do target.':
      'Mean Absolute Error. Robust to outliers. Same unit as the target.',
    'Subespaço curvo de baixa dimensão onde dados de alta dim "vivem". Base de UMAP, autoencoders.':
      'The curved low-dimensional subspace where high-dimensional data actually lives. The basis of UMAP and autoencoders.',
    'Métricas de ranking, quão bem o modelo ordena os resultados relevantes no topo.':
      'Ranking metrics: how well the model puts the relevant results at the top.',
    'Esconde tokens e treina para reconstruí-los. Receita do BERT.':
      'Masks tokens and trains the model to reconstruct them. The BERT recipe.',
    'Markov Decision Process. Estado, ação, recompensa, transição. A formalização do RL.':
      'Markov Decision Process. State, action, reward, transition. The formalization of RL.',
    'Pipelines, CI/CD, monitoramento, drift detection, serving, operar ML em produção.':
      'Pipelines, CI/CD, monitoring, drift detection, serving. Running ML in production.',
    'Features fortemente correlacionadas. Desestabiliza coeficientes em regressão linear.':
      'Strongly correlated features. It destabilizes coefficients in linear regression.',
    'Aplica Bayes assumindo independência condicional entre features. Imbatível em texto.':
      'Applies Bayes assuming conditional independence between features. Unbeatable on text.',
    'Next Token Prediction. P(xₜ | x_<t). Base do GPT.': 'Next Token Prediction. P(xₜ | x_<t). The basis of GPT.',
    'Natural Language Processing. Texto como dado.': 'Natural Language Processing. Text as data.',
    'Aprende a política ótima a partir de dados gerados por outra política. Q-Learning, DQN.':
      'Learns the optimal policy from data generated by a different policy. Q-Learning, DQN.',
    'Aprende uma fronteira que envolve a região "normal" dos dados.':
      'Learns a boundary that wraps around the "normal" region of the data.',
    'Modelo decora o treino e generaliza mal. Variância alta. Gap grande train vs val.':
      'The model memorizes the training set and generalizes badly. High variance. A large train vs validation gap.',
    'Projeta dados nas direções de máxima variância (autovetores da covariância).':
      'Projects the data onto the directions of maximum variance (the eigenvectors of the covariance).',
    'exp(cross-entropy). Mede o quão "surpreso" o modelo está com o texto. Menor = melhor.':
      'exp(cross-entropy). It measures how surprised the model is by the text. Lower is better.',
    'Proximal Policy Optimization. Policy gradient com clipping. Default moderno.':
      'Proximal Policy Optimization. Policy gradient with clipping. The modern default.',
    'TP / (TP + FP). Dos que predisse positivo, quantos são positivos de fato.':
      'TP / (TP + FP). Of everything it called positive, how much really is positive.',
    'Cortar ramos da árvore que não contribuem para a generalização.':
      'Cutting branches off the tree that do not help generalization.',
    'Modelo treinado em labeled prediz no unlabeled; predições confiantes viram rótulos.':
      'A model trained on the labeled set predicts on the unlabeled one; the confident predictions become labels.',
    'Aprende Q(s,a) via Bellman update. Off-policy, tabular.':
      'Learns Q(s,a) through Bellman updates. Off-policy and tabular.',
    'Retrieval-Augmented Generation. LLM consulta uma base externa antes de responder.':
      'Retrieval-Augmented Generation. The LLM queries an external base before answering.',
    'Bagging de árvores com subsample de features. Default robusto para tabular.':
      'Bagging of trees with feature subsampling. A robust default for tabular data.',
    'TP / (TP + FN). Dos positivos reais, quantos o modelo capturou.':
      'TP / (TP + FN). Of the real positives, how many the model caught.',
    'Predição de saída contínua: preço, score, temperatura.':
      'Predicting a continuous output: a price, a score, a temperature.',
    'Penalizar complexidade para reduzir overfitting. L1, L2, dropout, early stopping.':
      'Penalizing complexity to reduce overfitting. L1, L2, dropout, early stopping.',
    'Agente explora falhas do reward function para maximizar reward sem cumprir o objetivo real.':
      'The agent exploits flaws in the reward function to maximize reward without meeting the real objective.',
    'Regressão linear com penalização L2. Reduz variância em multicolinearidade.':
      'Linear regression with an L2 penalty. It reduces variance under multicollinearity.',
    'RL from Human Feedback. Treina reward model com preferências humanas e otimiza LLM via PPO.':
      'RL from Human Feedback. It trains a reward model on human preferences and optimizes the LLM via PPO.',
    'Raiz do MSE. Mesma unidade do target. Sensível a outliers.':
      'The square root of MSE. Same unit as the target. Sensitive to outliers.',
    'Recurrent Neural Network. Estado oculto recorrente para dados sequenciais.':
      'Recurrent Neural Network. A recurrent hidden state for sequential data.',
    'TPR vs FPR variando o threshold. AUC = área sob a curva.':
      'TPR vs FPR as you vary the threshold. AUC is the area under the curve.',
    'Cada token atende a todos os outros. Pilar do Transformer.':
      'Every token attends to every other one. The pillar of the Transformer.',
    'Modelo gera o próprio rótulo a partir dos dados brutos. Base dos LLMs.':
      'The model generates its own label from the raw data. The basis of LLMs.',
    'Aprende com poucos rótulos + muitos dados não rotulados.':
      'Learns from few labels plus a lot of unlabeled data.',
    'Shapley values aplicados a ML. Atribui contribuição de cada feature por predição.':
      'Shapley values applied to ML. It assigns each feature a contribution per prediction.',
    'Mede coesão (distância intra-cluster) vs separação (distância inter-cluster). [-1, 1].':
      'Measures cohesion (intra-cluster distance) against separation (inter-cluster distance). [-1, 1].',
    'σ(x) = 1/(1+e^−x). Squashes para (0, 1). Base da logistic regression.':
      'σ(x) = 1/(1+e^−x). It squashes into (0, 1). The basis of logistic regression.',
    'Synthetic Minority Oversampling. Cria amostras sintéticas interpolando vizinhos da classe minoritária.':
      'Synthetic Minority Oversampling. It creates synthetic samples by interpolating neighbors of the minority class.',
    'Generaliza sigmoide para multiclasse. σ(zᵢ) = e^zᵢ / Σ e^zⱼ.':
      'Generalizes the sigmoid to the multiclass case. σ(zᵢ) = e^zᵢ / Σ e^zⱼ.',
    'SGD. Atualiza usando um (ou mini-batch) exemplo por vez. Escalável para datasets grandes.':
      'SGD. It updates using one example (or a mini-batch) at a time. Scalable to large datasets.',
    'Aprende f(X)→y a partir de pares entrada/rótulo.': 'Learns f(X)→y from input/label pairs.',
    'Pontos mais próximos da margem. São os únicos que definem o hiperplano.':
      'The points closest to the margin. They are the only ones that define the hyperplane.',
    'Encontra hiperplano de máxima margem entre classes. Kernel trick para não-linearidade.':
      'Finds the maximum-margin hyperplane between classes. The kernel trick handles non-linearity.',
    'Mapeia dados em 2D/3D preservando vizinhança local. Só para visualização.':
      'Maps data into 2D/3D while preserving local neighborhoods. For visualization only.',
    'Divide texto em tokens (BPE, WordPiece). Subword é o default moderno.':
      'Splits text into tokens (BPE, WordPiece). Subword is the modern default.',
    'Reaproveita um modelo pré-treinado em uma tarefa para outra. Fine-tuning é a forma comum.':
      'Reuses a model pre-trained on one task for another. Fine-tuning is the common form.',
    'Arquitetura baseada em self-attention. Base de LLMs, ViT, multimodal.':
      'An architecture built on self-attention. The basis of LLMs, ViT and multimodal models.',
    'Preserva estrutura local e parcialmente global. Escalável, vai para pipelines.':
      'Preserves local and partially global structure. Scalable enough for pipelines.',
    'Modelo simples demais para o sinal. Bias alto. Erro alto em treino e validação.':
      'The model is too simple for the signal. High bias. High error on both training and validation.',
    'Subconjunto separado do treino para tunar hiperparâmetros sem contaminar o test set.':
      'A subset held out from training to tune hyperparameters without contaminating the test set.',
    'Gradientes diminuem nas camadas iniciais, impedindo aprendizado. Mitigado por ReLU, residual connections, LSTM gates.':
      'Gradients shrink in the early layers, blocking learning. Mitigated by ReLU, residual connections and LSTM gates.',
    'Sensibilidade do modelo a variações no dataset de treino. Alta variância = overfitting.':
      'How sensitive the model is to variation in the training set. High variance means overfitting.',
    'Combina múltiplas fontes ruidosas de rótulos (heurísticas, regras) para treinar.':
      'Combines several noisy label sources (heuristics, rules) to train on.',
    'Equivalente a L2, encolhe pesos a cada passo. Padrão em deep learning.':
      'Equivalent to L2: it shrinks weights at every step. Standard in deep learning.',
    'Gradient boosting com regularização explícita, segunda derivada, histogramas. Domina Kaggle tabular.':
      'Gradient boosting with explicit regularization, second derivatives and histograms. It dominates tabular Kaggle.',
    'Aplicar um modelo a uma classe/tarefa nunca vista. CLIP, GPT fazem zero-shot via prompt.':
      'Applying a model to a class or task it has never seen. CLIP and GPT do zero-shot via the prompt.'
  });
})();
