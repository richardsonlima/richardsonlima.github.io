/* Lesson content — Etapas 04, 05, 06 (lições 13–24)
   Mesma schema de content.js
*/
window.LESSON_CONTENT = window.LESSON_CONTENT || {};

/* ═══════════════════════════════════════════════════════════════
   ETAPA 04 — NÃO-SUPERVISIONADO
   ═══════════════════════════════════════════════════════════════ */

window.LESSON_CONTENT['clustering'] = {
  id: 'clustering',
  title: 'Clustering',
  etapa: 4, etapaName: 'Não-supervisionado',
  time: '75 min',
  tags: ['clustering', 'K-Means', 'DBSCAN'],
  tagline: 'Quando não há rótulo, agrupe por <em>similaridade</em>. K-Means, DBSCAN, Hierarchical — cada um para um tipo de cluster.',
  intro: `
    <p>Clustering é o paradigma não-supervisionado mais usado. Você tem dados sem rótulo e quer descobrir grupos naturais — segmentação de clientes, agrupamento de documentos, exploração inicial. Esta lição cobre os três algoritmos canônicos e quando usar cada um.</p>
  `,
  sections: [
    {
      id: 'kmeans',
      title: 'K-Means: o default rápido',
      body: `
        <p>O algoritmo (Lloyd):</p>
        <ol>
          <li>Escolha k centroides aleatoriamente.</li>
          <li>Atribua cada ponto ao centroide mais próximo (euclidiana).</li>
          <li>Recalcule cada centroide como a média dos pontos atribuídos.</li>
          <li>Repita até convergência.</li>
        </ol>
        <p>Minimiza:</p>
        <div class="math">Σₖ Σ_{x ∈ Cₖ} ‖x − μₖ‖²</div>
        <p>Limitações: assume clusters <strong>esféricos</strong> de tamanho aproximadamente igual. Sensível a outliers (eles puxam centroides). Precisa de k pré-definido.</p>
        <p>Como escolher k: <strong>elbow method</strong> (plot da inertia em função de k, procurar o "cotovelo") ou <strong>silhouette score</strong> (mais robusto).</p>
      `
    },
    {
      id: 'dbscan',
      title: 'DBSCAN: clusters de qualquer forma',
      body: `
        <p>DBSCAN agrupa por densidade. Dois hiperparâmetros:</p>
        <ul>
          <li><code>eps</code>: raio da vizinhança.</li>
          <li><code>min_samples</code>: número mínimo de pontos numa vizinhança para ser "core point".</li>
        </ul>
        <p>Comportamento:</p>
        <ul>
          <li>Encontra clusters de <strong>forma arbitrária</strong> (anéis, espirais).</li>
          <li>Identifica <strong>outliers naturalmente</strong> (pontos não pertencentes a nenhum cluster).</li>
          <li>Não precisa de k pré-definido.</li>
        </ul>
        <p>Falha quando: densidades muito diferentes entre clusters, ou alta dimensionalidade (distâncias colapsam).</p>
      `
    },
    {
      id: 'hierarchical',
      title: 'Hierarchical: a hierarquia completa',
      body: `
        <p>Clustering hierárquico (aglomerativo) constrói uma árvore de agrupamentos:</p>
        <ol>
          <li>Cada ponto é um cluster.</li>
          <li>Encontre os dois clusters mais "próximos" (segundo um critério de linkage).</li>
          <li>Funda-os. Repita até sobrar um.</li>
        </ol>
        <p>Critérios de linkage:</p>
        <ul>
          <li><strong>Single:</strong> menor distância entre pontos. Faz "chains".</li>
          <li><strong>Complete:</strong> maior distância. Clusters compactos.</li>
          <li><strong>Average:</strong> distância média.</li>
          <li><strong>Ward:</strong> minimiza variância intra-cluster. Mais robusto na prática.</li>
        </ul>
        <p>O resultado é um <strong>dendrograma</strong> que você "corta" em uma altura para obter os clusters finais. Excelente para análise exploratória, mas O(n²) — não escala.</p>
      `
    },
    {
      id: 'avaliacao',
      title: 'Avaliação sem ground truth',
      body: `
        <p>Sem rótulos, métricas internas:</p>
        <ul>
          <li><strong>Silhouette score:</strong> mede coesão (intra-cluster) vs separação (inter-cluster). Entre -1 e 1. Acima de 0.5 é bom.</li>
          <li><strong>Davies-Bouldin:</strong> menor é melhor.</li>
          <li><strong>Calinski-Harabasz:</strong> maior é melhor.</li>
        </ul>
        <p>Com rótulos parciais (avaliação semi-supervisionada): ARI (Adjusted Rand Index) ou NMI (Normalized Mutual Information).</p>
        <div class="callout tip">
          <strong>NÃO ESQUEÇA</strong>
          Métricas internas medem geometria, não utilidade. Um cluster geometricamente bom pode ser inútil para o negócio. Sempre valide semanticamente também.
        </div>
      `
    }
  ],
  whenToUse: [
    'Segmentação de clientes/usuários',
    'Agrupamento de documentos ou produtos',
    'Análise exploratória inicial',
    'Pré-processamento para outras tarefas'
  ],
  whenNot: [
    'Quando você tem rótulos (use classificação)',
    'Em alta dimensionalidade sem redução prévia',
    'Quando o domínio não tem estrutura de cluster real'
  ],
  metrics: ['Silhouette', 'Davies-Bouldin', 'Calinski-Harabasz', 'Validação semântica']
};

window.LESSON_CONTENT['anomaly'] = {
  id: 'anomaly',
  title: 'Anomaly Detection',
  etapa: 4, etapaName: 'Não-supervisionado',
  time: '60 min',
  tags: ['anomalia', 'fraude', 'monitoramento'],
  tagline: 'Encontre o <em>raro</em> num oceano de normal. Sem rótulo, sem precisão prometida — só sinal.',
  intro: `
    <p>Detecção de anomalia é onde você tem dados predominantemente normais e precisa flagar o estranho — fraude, intrusão, defeito industrial, transação suspeita. Geralmente sem rótulos, ou com rótulos extremamente desbalanceados. Esta lição cobre as três técnicas canônicas e os trade-offs.</p>
  `,
  sections: [
    {
      id: 'isolation-forest',
      title: 'Isolation Forest: o default',
      body: `
        <p>Insight: anomalias são <strong>fáceis de isolar</strong>. Se você construir árvores aleatórias particionando os dados, anomalias acabam isoladas em poucos splits.</p>
        <ol>
          <li>Construa muitas árvores, cada uma particionando aleatoriamente.</li>
          <li>Para cada ponto, calcule a profundidade média de isolamento entre todas as árvores.</li>
          <li>Profundidade curta → anomalia. Profundidade longa → normal.</li>
        </ol>
        <p>Vantagens: O(n·log n), escala bem, funciona em alta dimensão, não assume distribuição. Default para dados tabulares.</p>
        <pre><code>from sklearn.ensemble import IsolationForest

iso = IsolationForest(contamination=0.01, n_estimators=200, n_jobs=-1)
iso.fit(X)
scores = iso.score_samples(X)  # menor = mais anômalo
preds = iso.predict(X)         # -1 = anomalia, 1 = normal</code></pre>
      `
    },
    {
      id: 'one-class-svm',
      title: 'One-Class SVM',
      body: `
        <p>Variante do SVM que aprende uma <strong>fronteira em torno dos dados normais</strong>. Tudo fora é anomalia.</p>
        <p>Bom quando você tem uma noção clara do que é "normal" e quer isolar isso. Caro em datasets grandes (mesmos problemas de escalabilidade do SVM). Sensível à escolha de γ no RBF.</p>
        <p>Use quando: dataset pequeno/médio, classes normais bem definidas, dados de alta dimensão com kernel.</p>
      `
    },
    {
      id: 'autoencoder',
      title: 'Autoencoder: anomalia via reconstrução',
      body: `
        <p>Treina uma rede neural para reconstruir os dados normais. O <strong>erro de reconstrução</strong> vira o score de anomalia.</p>
        <ol>
          <li>Encoder comprime x → z (representação latente).</li>
          <li>Decoder reconstrói z → x̂.</li>
          <li>Loss = ‖x − x̂‖².</li>
          <li>Treine em dados normais. Anomalias terão erro alto.</li>
        </ol>
        <p>Indicado para: imagens, áudio, séries temporais, dados sequenciais. Mais flexível que Isolation Forest mas mais caro de treinar e tunar.</p>
        <p>Variantes: VAE (probabilístico), Sparse Autoencoder, Denoising Autoencoder.</p>
      `
    },
    {
      id: 'avaliacao',
      title: 'Avaliação com rótulos parciais',
      body: `
        <p>Se você tem alguns exemplos rotulados de anomalia (típico em fraude):</p>
        <ul>
          <li><strong>PR-AUC</strong> (Precision-Recall): muito mais informativa que ROC-AUC em datasets desbalanceados.</li>
          <li><strong>Precision@k:</strong> dos top-k alertas do modelo, quantos são verdadeiramente anômalos? Crítico quando há orçamento limitado de investigação.</li>
          <li><strong>Recall@FPR fixo:</strong> a que recall você chega aceitando, digamos, 1% de falsos alarmes?</li>
        </ul>
        <div class="callout warn">
          <strong>BASE RATE FALLACY</strong>
          Mesmo um modelo "preciso" (95% accuracy) em fraude (0.1% positivos) gera 99% de falsos alarmes. Sempre raciocine em termos absolutos de Precision e Recall — não accuracy.
        </div>
      `
    }
  ],
  whenToUse: [
    'Fraude, intrusão, ataque cibernético',
    'Monitoramento industrial (defeitos)',
    'Quality control',
    'Quando rótulos são raríssimos ou inexistentes'
  ],
  whenNot: [
    'Quando você tem rótulos suficientes (use classificação desbalanceada)',
    'Quando anomalias estão concentradas em clusters densos (paradoxo — anomalia precisa ser rara)'
  ],
  metrics: ['PR-AUC', 'Precision@k', 'Recall@FPR fixo']
};

window.LESSON_CONTENT['tsne-umap'] = {
  id: 'tsne-umap',
  title: 't-SNE / UMAP',
  etapa: 4, etapaName: 'Não-supervisionado',
  time: '60 min',
  tags: ['redução de dim', 'visualização', 'manifold'],
  tagline: 'Visualizar embeddings de alta dimensão em 2D. <em>t-SNE</em> para apresentação, <em>UMAP</em> para produção.',
  intro: `
    <p>PCA é linear e perde estrutura curva. t-SNE e UMAP são técnicas modernas de redução de dimensionalidade <strong>não-linear</strong>, focadas em preservar a vizinhança local. São essenciais para visualizar embeddings de redes neurais, single-cell genomics, e qualquer dado de alta dimensão.</p>
  `,
  sections: [
    {
      id: 'tsne',
      title: 't-SNE: o clássico para visualizar',
      body: `
        <p>Ideia: defina uma distribuição de probabilidade no espaço original (vizinhos próximos têm alta probabilidade) e tente reproduzi-la no espaço de saída (2D ou 3D), minimizando a divergência KL.</p>
        <div class="math">min KL(P‖Q)</div>
        <p>Detalhe técnico: usa distribuição t-Student na saída para evitar "crowding" — daí o "t" no nome.</p>
        <ul>
          <li>Excelente para preservar estrutura <strong>local</strong>.</li>
          <li>Distâncias <strong>globais não são preservadas</strong> — clusters distantes no t-SNE não significam clusters distantes nos dados.</li>
          <li>Não é função — você não pode aplicar a novos pontos sem retreinar.</li>
          <li>Hiperparâmetro chave: <code>perplexity</code> (5-50). Diferentes perplexities dão visualizações diferentes.</li>
        </ul>
        <div class="callout warn">
          <strong>NUNCA EM PRODUÇÃO</strong>
          t-SNE é estritamente para visualização exploratória. Os eixos não têm significado, distâncias globais não são preservadas, e não é reutilizável.
        </div>
      `
    },
    {
      id: 'umap',
      title: 'UMAP: o sucessor moderno',
      body: `
        <p>UMAP (Uniform Manifold Approximation and Projection) usa topologia algébrica para construir uma representação que preserva estrutura <strong>local e parcialmente global</strong>.</p>
        <p>Vantagens sobre t-SNE:</p>
        <ul>
          <li><strong>Mais rápido</strong> — escala para milhões.</li>
          <li><strong>Preserva alguma estrutura global</strong> — clusters distantes no UMAP estão distantes nos dados (mais ou menos).</li>
          <li><strong>É uma função.</strong> Pode aplicar a novos dados (<code>umap.transform()</code>).</li>
          <li>Pode ser usado em <strong>pipelines de produção</strong>.</li>
        </ul>
        <p>Hiperparâmetros chave:</p>
        <ul>
          <li><code>n_neighbors</code>: tamanho da vizinhança considerada. Pequeno → estrutura local; grande → estrutura global.</li>
          <li><code>min_dist</code>: quão próximos pontos podem ficar no espaço de saída. Pequeno → clusters densos; grande → espalhados.</li>
        </ul>
      `
    },
    {
      id: 'pratica',
      title: 'Na prática',
      body: `
        <pre><code>import umap
from sklearn.preprocessing import StandardScaler

X_s = StandardScaler().fit_transform(X)  # sempre padronize

reducer = umap.UMAP(
    n_neighbors=15,
    min_dist=0.1,
    n_components=2,
    metric='cosine',  # para embeddings de redes neurais
    random_state=42
)
embedding = reducer.fit_transform(X_s)</code></pre>
        <p>Casos de uso comuns:</p>
        <ul>
          <li>Visualizar embeddings de palavra/frase (Word2Vec, BERT, sentence transformers).</li>
          <li>Single-cell RNA-seq.</li>
          <li>Espaço latente de LLMs.</li>
          <li>Pré-processamento antes de clustering.</li>
        </ul>
      `
    }
  ],
  whenToUse: [
    'Visualizar embeddings de alta dimensão',
    'UMAP em pipelines de produção (t-SNE não)',
    'Exploração inicial de dados complexos'
  ],
  whenNot: [
    't-SNE em produção',
    'Quando você precisa de uma redução interpretável (use PCA)',
    'Datasets enormes sem aproximação'
  ],
  metrics: ['Trustworthiness', 'Inspeção visual', 'Performance downstream (se usado em pipeline)']
};

/* ═══════════════════════════════════════════════════════════════
   ETAPA 05 — DEEP LEARNING
   ═══════════════════════════════════════════════════════════════ */

window.LESSON_CONTENT['mlp'] = {
  id: 'mlp',
  title: 'MLP — Multi-Layer Perceptron',
  etapa: 5, etapaName: 'Deep learning',
  time: '120 min',
  tags: ['deep', 'backprop', 'universal'],
  tagline: 'Regressão logística <em>empilhada</em>. O building block de todo deep learning.',
  intro: `
    <p>Um MLP nada mais é que múltiplas camadas de regressão logística empilhadas, com ativações não-lineares no meio. É um aproximador universal — pode representar qualquer função suave. Esta lição cobre os fundamentos: arquitetura, backprop, inicialização, regularização. Sem entender MLP, não há como entender CNN, RNN ou Transformer.</p>
  `,
  sections: [
    {
      id: 'arquitetura',
      title: 'Arquitetura básica',
      body: `
        <p>Cada camada de um MLP faz duas operações:</p>
        <ol>
          <li>Transformação linear: <code>z = Wx + b</code>.</li>
          <li>Ativação não-linear: <code>a = σ(z)</code>.</li>
        </ol>
        <p>Empilhe L dessas camadas. A saída da camada l vira entrada da camada l+1.</p>
        <p>Por que <strong>não-linearidades importam</strong>: sem elas, empilhar camadas é equivalente a uma única transformação linear. As ativações é o que dá ao MLP a expressividade que ele tem.</p>
        <p>Ativações comuns:</p>
        <ul>
          <li><strong>ReLU:</strong> max(0, x). Default. Rápida, sparse, não satura no positivo.</li>
          <li><strong>GELU/SiLU:</strong> versões suaves de ReLU. Padrão em transformers.</li>
          <li><strong>Tanh:</strong> em RNNs. Saturação simétrica.</li>
          <li><strong>Sigmoid:</strong> só na saída de classificação binária.</li>
          <li><strong>Softmax:</strong> saída de classificação multiclasse.</li>
        </ul>
      `
    },
    {
      id: 'backprop',
      title: 'Backpropagation',
      body: `
        <p>Como o MLP aprende? Backprop = aplicação da chain rule da cadeia para calcular ∂L/∂W em cada camada, propagando o gradiente da saída para a entrada.</p>
        <ol>
          <li><strong>Forward pass:</strong> compute as ativações camada por camada até a loss.</li>
          <li><strong>Backward pass:</strong> derive a loss em relação aos parâmetros usando chain rule.</li>
          <li><strong>Update:</strong> <code>W ← W − η · ∂L/∂W</code>.</li>
        </ol>
        <p>Frameworks (PyTorch, TensorFlow, JAX) fazem isso automaticamente via <strong>autograd</strong> — você só especifica o forward, eles calculam o backward.</p>
        <p>Problemas históricos:</p>
        <ul>
          <li><strong>Vanishing gradient:</strong> em redes muito profundas com sigmoid/tanh, gradientes encolhem a cada camada → camadas iniciais não aprendem. ReLU + skip connections resolveram em grande parte.</li>
          <li><strong>Exploding gradient:</strong> oposto. Mitigado por gradient clipping.</li>
        </ul>
      `
    },
    {
      id: 'otimizadores',
      title: 'Otimizadores',
      body: `
        <ul>
          <li><strong>SGD:</strong> vanilla. Funciona com momentum (nesterov).</li>
          <li><strong>Adam:</strong> default na maioria dos casos. Combina momentum + adaptive learning rate por parâmetro.</li>
          <li><strong>AdamW:</strong> Adam com weight decay correto. Padrão em transformers.</li>
        </ul>
        <p>Learning rate é o hiperparâmetro mais importante. Comece com 1e-3 (Adam) ou 1e-2 (SGD com momentum). Use schedulers (cosine, warmup) para melhorar.</p>
      `
    },
    {
      id: 'regularizacao',
      title: 'Regularização em deep learning',
      body: `
        <ul>
          <li><strong>Dropout:</strong> desliga neurônios aleatoriamente durante treino. Evita co-adaptação. Taxa típica: 0.1-0.5.</li>
          <li><strong>Weight decay (L2):</strong> regularização clássica.</li>
          <li><strong>Batch Normalization:</strong> normaliza ativações por mini-batch. Acelera e estabiliza treino, regulariza levemente.</li>
          <li><strong>Layer Normalization:</strong> normaliza por amostra. Padrão em transformers.</li>
          <li><strong>Early stopping:</strong> obrigatório. Monitorize val loss.</li>
          <li><strong>Data augmentation:</strong> se aplicável (imagens, áudio).</li>
        </ul>
      `
    },
    {
      id: 'inicializacao',
      title: 'Inicialização importa',
      body: `
        <p>Pesos iniciais aleatórios mas não <em>qualquer</em> aleatório. Inicialização ruim → vanishing/exploding gradients desde a primeira iteração.</p>
        <ul>
          <li><strong>Xavier/Glorot:</strong> bom para tanh/sigmoid.</li>
          <li><strong>He:</strong> bom para ReLU. Default no PyTorch.</li>
        </ul>
        <p>Frameworks modernos têm boas inicializações por padrão. Mas se você customizar layers, lembre.</p>
      `
    }
  ],
  whenToUse: [
    'Tabular complexo onde GBM dá plateau (raro)',
    'Base para arquiteturas customizadas (CNN, RNN, Transformer)',
    'Quando você tem dados em grande volume e capacidade computacional'
  ],
  whenNot: [
    'Tabular médio onde GBM já é ótimo',
    'Poucos dados (< 10k linhas)',
    'Quando interpretabilidade é prioridade'
  ],
  metrics: ['Padrão da tarefa', 'Train/val loss curves']
};

window.LESSON_CONTENT['cnn'] = {
  id: 'cnn',
  title: 'CNN — Convolutional Neural Networks',
  etapa: 5, etapaName: 'Deep learning',
  time: '90 min',
  tags: ['deep', 'visão', 'convolução'],
  tagline: 'O inductive bias da visão computacional: <em>locality</em> + translation equivariance.',
  intro: `
    <p>CNNs dominaram visão computacional por uma década (e ainda são competitivas vs Vision Transformers em muitos cenários). A ideia central: convolução compartilha pesos espacialmente, capturando padrões locais que se repetem (bordas → formas → objetos).</p>
  `,
  sections: [
    {
      id: 'convolucao',
      title: 'A operação de convolução',
      body: `
        <p>Convolução = filtro deslizante. Um pequeno kernel (ex: 3x3) "varre" a imagem, computando produtos internos em cada posição.</p>
        <div class="math">(f * k)(x,y) = ΣΣ f(x+i, y+j) · k(i,j)</div>
        <p>Propriedades:</p>
        <ul>
          <li><strong>Compartilhamento de pesos:</strong> o mesmo kernel se aplica em toda a imagem. Drasticamente menos parâmetros que MLP.</li>
          <li><strong>Translation equivariance:</strong> mover o input move a saída da mesma forma. Bom para objetos que podem estar em qualquer lugar.</li>
          <li><strong>Local receptive field:</strong> cada neurônio "vê" só uma região. Camadas mais profundas têm receptive field maior — aprendem padrões mais abstratos.</li>
        </ul>
      `
    },
    {
      id: 'arquitetura',
      title: 'Arquitetura típica',
      body: `
        <p>O padrão histórico (LeNet, AlexNet, VGG):</p>
        <ol>
          <li>Várias camadas de [Conv + ReLU + Pool].</li>
          <li>Camadas densas no final.</li>
          <li>Softmax para classificação.</li>
        </ol>
        <p><strong>Pooling</strong> (max ou average) reduz resolução espacial, dando invariância a pequenas translações e diminuindo computação.</p>
        <p>Inovações modernas:</p>
        <ul>
          <li><strong>ResNet:</strong> skip connections permitem redes muito profundas (50, 100, 1000+ camadas).</li>
          <li><strong>EfficientNet:</strong> escala balanceada de profundidade, largura e resolução.</li>
          <li><strong>ConvNeXt:</strong> "moderniza" CNNs com truques de transformers — competitiva com ViT.</li>
        </ul>
      `
    },
    {
      id: 'transfer',
      title: 'Transfer learning é não-negociável',
      body: `
        <p>Treinar uma CNN do zero requer milhões de imagens e dias/semanas de GPU. Em 99% dos casos, você usa <strong>transfer learning</strong>: pegue um modelo pré-treinado em ImageNet (ResNet, EfficientNet) e faça fine-tuning na sua task.</p>
        <pre><code>import torch
import torchvision.models as models

# Pré-treinada em ImageNet
model = models.resnet50(weights='IMAGENET1K_V2')

# Trocar a última camada para sua task
model.fc = torch.nn.Linear(2048, num_classes)

# Fine-tune com lr baixo
optimizer = torch.optim.AdamW(model.parameters(), lr=1e-4)</code></pre>
      `
    },
    {
      id: 'data-aug',
      title: 'Data augmentation é regularização gratuita',
      body: `
        <p>Aplicação aleatória de transformações nas imagens de treino: rotation, flip, crop, color jitter, mixup, cutmix. Aumenta efetivamente o tamanho do dataset sem precisar de mais dados.</p>
        <p>É a forma mais eficaz de regularização em visão. Sempre use.</p>
      `
    }
  ],
  whenToUse: [
    'Visão (classificação, detecção, segmentação)',
    'Sinais com estrutura local (áudio, séries temporais 1D)',
    'Transferir conhecimento de modelos pré-treinados em ImageNet'
  ],
  whenNot: [
    'Quando o contexto é fundamentalmente global (use Transformer)',
    'Sem GPU disponível',
    'Datasets muito pequenos sem transfer learning'
  ],
  metrics: ['Accuracy, top-5', 'mAP (detecção)', 'IoU/Dice (segmentação)']
};

window.LESSON_CONTENT['rnn'] = {
  id: 'rnn',
  title: 'RNN / LSTM',
  etapa: 5, etapaName: 'Deep learning',
  time: '75 min',
  tags: ['deep', 'sequencial', 'séries temporais'],
  tagline: 'Estado oculto recorrente. <em>Largamente substituído</em> por Transformers, mas ainda útil em séries temporais e edge.',
  intro: `
    <p>RNNs foram o paradigma dominante para dados sequenciais até Transformers chegarem em 2017. Hoje continuam relevantes em nichos: séries temporais, streaming/online learning, edge devices. Esta lição cobre RNN vanilla, o problema do vanishing gradient, e como LSTM/GRU resolvem.</p>
  `,
  sections: [
    {
      id: 'vanilla',
      title: 'RNN vanilla',
      body: `
        <p>A cada passo, uma RNN mantém um estado oculto h que captura "memória" do passado:</p>
        <div class="math">hₜ = tanh(W_h · h_{t-1} + W_x · xₜ + b)</div>
        <div class="math">yₜ = W_y · hₜ + b_y</div>
        <p>Os mesmos pesos W são aplicados em todos os passos — uma forma de weight sharing temporal análoga ao spatial sharing da CNN.</p>
        <p>Treino: <strong>Backprop Through Time (BPTT)</strong> — desenrola a rede no tempo e aplica backprop normal.</p>
      `
    },
    {
      id: 'vanishing',
      title: 'O problema do vanishing gradient',
      body: `
        <p>Em sequências longas, o gradiente precisa fluir através de muitos passos. A cada passo, multiplica-se por W e pela derivada da tanh. Se W tem norma < 1, o produto encolhe exponencialmente → as camadas/passos iniciais não recebem sinal.</p>
        <p>Sintoma: RNN vanilla raramente aprende dependências de mais de ~20 passos.</p>
        <p>É <em>o</em> problema que LSTM e GRU foram criados para resolver.</p>
      `
    },
    {
      id: 'lstm',
      title: 'LSTM: a solução por gates',
      body: `
        <p>LSTM (Long Short-Term Memory) introduz uma <strong>cell state</strong> que flui pela sequência relativamente preservada, controlada por três gates:</p>
        <ul>
          <li><strong>Forget gate:</strong> quanto do passado descartar.</li>
          <li><strong>Input gate:</strong> quanto da nova entrada incorporar.</li>
          <li><strong>Output gate:</strong> quanto da cell state expor como h.</li>
        </ul>
        <p>Cada gate é uma sigmoide aprendida — entre 0 (bloquear) e 1 (deixar passar). O gradiente flui através da cell state quase intacto, evitando vanishing.</p>
        <p>LSTMs lidam confortavelmente com sequências de 100-1000 passos.</p>
      `
    },
    {
      id: 'gru',
      title: 'GRU: o LSTM simplificado',
      body: `
        <p>GRU (Gated Recurrent Unit) tem dois gates em vez de três e funde cell state com hidden state. Resultado: menos parâmetros, treinamento mais rápido, performance similar ao LSTM na maioria dos benchmarks.</p>
        <p>Regra prática: comece com GRU. Se precisar de mais capacidade, troque por LSTM.</p>
      `
    },
    {
      id: 'limitacoes',
      title: 'Por que Transformer venceu',
      body: `
        <p>Apesar das melhorias, RNNs têm limitações fundamentais:</p>
        <ul>
          <li><strong>Sequencialidade:</strong> não paraleliza no tempo — cada passo depende do anterior.</li>
          <li><strong>Memória limitada:</strong> mesmo LSTM tem dificuldade com sequências muito longas.</li>
          <li><strong>Bottleneck:</strong> toda a informação tem que passar por um único vetor h.</li>
        </ul>
        <p>Transformers resolvem todos os três via self-attention — voltamos lá na próxima lição.</p>
      `
    }
  ],
  whenToUse: [
    'Séries temporais',
    'Streaming/online learning',
    'Edge devices com recursos limitados',
    'Sequências curtas a médias onde Transformer é overkill'
  ],
  whenNot: [
    'NLP geral (use Transformer)',
    'Sequências muito longas com dependências distantes',
    'Quando você precisa paralelizar treino'
  ],
  metrics: ['Padrão da tarefa', 'Perplexity (language modeling)', 'RMSE (forecast)']
};

window.LESSON_CONTENT['transformers'] = {
  id: 'transformers',
  title: 'Transformers',
  etapa: 5, etapaName: 'Deep learning',
  time: '120 min',
  tags: ['deep', 'attention', 'LLM'],
  tagline: 'A arquitetura que mudou IA. <em>Self-attention</em> + posicionamento + escala = foundation models.',
  intro: `
    <p>Transformers (Vaswani et al, 2017 — "Attention Is All You Need") são a arquitetura dominante de IA moderna. Base de LLMs (GPT, Claude, Llama), modelos de visão (ViT), multimodal (CLIP), código (Codex), e praticamente tudo que escalou nos últimos 5 anos.</p>
    <p>Esta lição cobre os componentes essenciais: self-attention, multi-head, positional encoding, e por que a arquitetura escala tão bem.</p>
  `,
  sections: [
    {
      id: 'attention',
      title: 'Self-attention: a operação central',
      body: `
        <p>Para cada token na sequência, attention permite olhar para todos os outros tokens e decidir, <em>dinamicamente</em>, quais são relevantes.</p>
        <p>Cada token gera três vetores: <strong>Q</strong> (query), <strong>K</strong> (key), <strong>V</strong> (value) — projeções lineares de sua representação.</p>
        <div class="math">Attention(Q, K, V) = softmax(QKᵀ / √dₖ) · V</div>
        <p>Lendo: para cada query, calcule similaridade com todas as keys (produto interno). Normalize com softmax. Use como peso para combinar as values.</p>
        <p>A divisão por √dₖ é uma normalização para evitar que produtos internos grandes saturarem o softmax — detalhe técnico crítico.</p>
        <p>Custo: O(n²·d), onde n é o tamanho da sequência. Esse é o gargalo das sequências longas — atacado por variantes lineares (Linformer, Performer, Mamba).</p>
      `
    },
    {
      id: 'multi-head',
      title: 'Multi-head attention',
      body: `
        <p>Uma única attention captura uma "relação". Multi-head aplica attention em paralelo, com diferentes projeções de Q, K, V — cada "head" pode aprender uma relação diferente (sintática, semântica, posicional).</p>
        <p>Tipicamente 8 ou 16 heads, depois concatenados e projetados de volta.</p>
      `
    },
    {
      id: 'positional',
      title: 'Positional encoding',
      body: `
        <p>Attention não tem noção nativa de ordem — para o algoritmo, a sequência "the cat sat" e "sat cat the" parecem iguais. Precisamos injetar informação de posição.</p>
        <p>Duas abordagens:</p>
        <ul>
          <li><strong>Absolute positional encoding:</strong> adiciona um vetor único por posição. Sinusoidal (original) ou aprendido.</li>
          <li><strong>Relative / RoPE (Rotary):</strong> codifica diferença entre posições. RoPE é o padrão em LLMs modernos (LLaMA, GPT-NeoX).</li>
        </ul>
      `
    },
    {
      id: 'arquitetura',
      title: 'A arquitetura completa',
      body: `
        <p>Um <strong>bloco de transformer</strong> tem:</p>
        <ol>
          <li>Multi-head self-attention.</li>
          <li>Residual + LayerNorm.</li>
          <li>Feed-forward (MLP de 2 camadas).</li>
          <li>Residual + LayerNorm.</li>
        </ol>
        <p>Empilhe N desses blocos (12 em BERT-base, 96 em GPT-3). Variantes:</p>
        <ul>
          <li><strong>Encoder-only</strong> (BERT): atende a toda a sequência. Para representações/classificação.</li>
          <li><strong>Decoder-only</strong> (GPT): atende apenas ao passado (causal mask). Para geração.</li>
          <li><strong>Encoder-decoder</strong> (T5, BART): para tarefas seq2seq.</li>
        </ul>
      `
    },
    {
      id: 'escala',
      title: 'Por que escala tão bem',
      body: `
        <p>Transformers têm propriedades únicas:</p>
        <ul>
          <li><strong>Paralelizáveis:</strong> ao contrário de RNNs, todos os tokens são processados em paralelo durante o treino.</li>
          <li><strong>Dependências arbitrárias:</strong> cada token pode atender a qualquer outro em O(1) passos.</li>
          <li><strong>Scaling laws empíricas:</strong> performance melhora previsivelmente com mais parâmetros, mais dados, mais compute. Sem plateau evidente em escalas modernas.</li>
        </ul>
        <p>Isso é o que permitiu a era dos foundation models.</p>
      `
    },
    {
      id: 'limitacoes',
      title: 'Limitações e frontiers',
      body: `
        <ul>
          <li><strong>Custo quadrático O(n²):</strong> sequências de 100k+ tokens são proibitivamente caras. Soluções: Flash Attention (memória), SSMs (Mamba), atenção esparsa.</li>
          <li><strong>Memória estática:</strong> tudo precisa caber no contexto. RAG e tool use endereçam isso externamente.</li>
          <li><strong>Pouca interpretabilidade nativa.</strong> Mechanistic interpretability (circuits, SAEs) avança nessa frente.</li>
        </ul>
      `
    }
  ],
  whenToUse: [
    'Praticamente tudo em NLP, visão, multimodal',
    'Sequências longas com dependências globais',
    'Foundation models',
    'Quando você tem compute'
  ],
  whenNot: [
    'Edge devices sem otimização',
    'Sequências muito curtas (CNN/RNN podem ser mais eficientes)',
    'Quando dados são escassos e específicos (overfitting fácil)'
  ],
  metrics: ['Padrão da tarefa', 'Perplexity', 'Benchmarks (MMLU, GSM8K, HumanEval, etc.)']
};

/* ═══════════════════════════════════════════════════════════════
   ETAPA 06 — AI MODERNA
   ═══════════════════════════════════════════════════════════════ */

window.LESSON_CONTENT['ssl'] = {
  id: 'ssl',
  title: 'Self-Supervised Learning',
  etapa: 6, etapaName: 'AI moderna',
  time: '60 min',
  tags: ['SSL', 'foundation', 'pretraining'],
  tagline: 'O modelo gera o próprio rótulo. <em>Fundação</em> de LLMs e foundation models.',
  intro: `
    <p>SSL é o paradigma que destravou a IA moderna. Em vez de depender de rótulos caros, o modelo cria sua própria tarefa de supervisão a partir dos dados brutos. Esta abordagem permite pretreinar em escalas inimagináveis antes (terabytes de texto, bilhões de imagens) e produzir representações ricas que transferem para qualquer task downstream.</p>
  `,
  sections: [
    {
      id: 'mlm',
      title: 'Masked Language Modeling (BERT)',
      body: `
        <p>Receita do BERT:</p>
        <ol>
          <li>Pegue um texto.</li>
          <li>Esconda 15% dos tokens aleatoriamente.</li>
          <li>Treine o modelo para reconstruí-los a partir do contexto bidirecional.</li>
        </ol>
        <div class="math">L = − Σ log P(x_masked | x_context)</div>
        <p>O resultado é um modelo que entende bem texto — útil para classificação, NER, similaridade. Mas <em>não gera</em> bem.</p>
      `
    },
    {
      id: 'ntp',
      title: 'Next Token Prediction (GPT)',
      body: `
        <p>Receita do GPT:</p>
        <ol>
          <li>Pegue um texto.</li>
          <li>Treine para prever o próximo token dado apenas o passado.</li>
        </ol>
        <div class="math">L = − Σₜ log P(xₜ | x_&lt;t)</div>
        <p>Simples na superfície. Profundo nos efeitos: em escala, emergem capacidades de raciocínio, código, tradução, sumarização — sem nunca terem sido treinadas explicitamente. É o que está por trás de toda LLM moderna.</p>
      `
    },
    {
      id: 'contrastive',
      title: 'Contrastive Learning (CLIP, SimCLR)',
      body: `
        <p>Para imagens e multimodal, contrastive aprende representações empurrando pares similares para perto e dissimilares para longe no espaço de embedding.</p>
        <div class="math">L = −log [exp(sim(zᵢ, zⱼ⁺)/τ) / Σ exp(sim(zᵢ, zₖ)/τ)]</div>
        <ul>
          <li><strong>SimCLR:</strong> pares positivos = duas augmentations da mesma imagem.</li>
          <li><strong>CLIP:</strong> pares positivos = imagem + sua legenda.</li>
        </ul>
        <p>CLIP destravou multimodal: imagens e texto no mesmo espaço de embedding, permitindo zero-shot classification, retrieval, e foi a base para Stable Diffusion.</p>
      `
    },
    {
      id: 'downstream',
      title: 'Como usar: transfer + fine-tuning',
      body: `
        <p>O ciclo padrão da IA moderna:</p>
        <ol>
          <li><strong>Pretrain:</strong> SSL em escala em dados não rotulados (caro, feito uma vez).</li>
          <li><strong>Fine-tune:</strong> em sua task específica com dados rotulados pequenos (barato).</li>
          <li><strong>Inferência:</strong> deploy do modelo fine-tuned.</li>
        </ol>
        <p>Alternativas a fine-tuning: prompt engineering, few-shot in-context learning, LoRA (adaptadores de baixo rank), RAG.</p>
      `
    }
  ],
  whenToUse: [
    'Quando há muitos dados não-rotulados disponíveis',
    'Como pretrain de modelos para fine-tuning',
    'Para criar embeddings reutilizáveis'
  ],
  whenNot: [
    'Quando você tem rótulos abundantes e tarefa específica',
    'Quando não tem recursos para pretrain (use modelos pré-treinados em vez)'
  ],
  metrics: ['Perplexity (NLP)', 'Linear probing accuracy', 'Performance em downstream tasks']
};

window.LESSON_CONTENT['rlhf'] = {
  id: 'rlhf',
  title: 'RLHF',
  etapa: 6, etapaName: 'AI moderna',
  time: '75 min',
  tags: ['RL', 'LLM', 'alinhamento'],
  tagline: 'Alinhar LLMs a preferências humanas. O que transformou GPT em <em>ChatGPT</em>.',
  intro: `
    <p>Um LLM pretreinado em NTP é tecnicamente impressionante mas raramente útil — completa frases sem necessariamente responder, gera conteúdo tóxico, alucina com confiança. RLHF (Reinforcement Learning from Human Feedback) é o processo que transforma esses modelos em assistentes utilizáveis. É a "última milha" da maioria dos LLMs modernos.</p>
  `,
  sections: [
    {
      id: 'tres-etapas',
      title: 'O pipeline em três etapas',
      body: `
        <ol>
          <li><strong>SFT (Supervised Fine-Tuning):</strong> fine-tune o LLM em demonstrações humanas de "boas respostas". Ensina o formato e o tom esperados.</li>
          <li><strong>Reward Modeling:</strong> humanos comparam pares de respostas. Treine um modelo para prever qual resposta humanos prefeririam.</li>
          <li><strong>RL via PPO:</strong> use o reward model como recompensa. O LLM (policy) é otimizado para maximizar recompensa esperada, com KL penalty contra o modelo SFT para não derivar muito.</li>
        </ol>
      `
    },
    {
      id: 'reward-model',
      title: 'Reward Model: o aprendiz de preferências',
      body: `
        <p>O RM é uma rede neural que recebe (prompt, resposta) e retorna um scalar reward. Treinada em milhares a milhões de pares comparativos rotulados por humanos.</p>
        <p>Loss típica (Bradley-Terry):</p>
        <div class="math">L = −log σ(r(x, y_w) − r(x, y_l))</div>
        <p>Onde y_w é a resposta preferida e y_l a rejeitada.</p>
        <p>Qualidade do RM é o gargalo — se os labelers discordam ou são mal-instruídos, o RM aprende ruído, e o LLM final otimiza para a coisa errada.</p>
      `
    },
    {
      id: 'ppo',
      title: 'PPO: o otimizador',
      body: `
        <p>PPO (Proximal Policy Optimization) é o algoritmo de policy gradient escolhido. Por quê:</p>
        <ul>
          <li><strong>Estável:</strong> o clipping evita que cada passo desestabilize a política.</li>
          <li><strong>On-policy:</strong> usa dados gerados pelo próprio modelo atual.</li>
        </ul>
        <p>A função objetivo combina:</p>
        <ul>
          <li>Recompensa do RM.</li>
          <li>Penalidade KL contra o modelo SFT (evita "reward hacking" e degeneração).</li>
        </ul>
      `
    },
    {
      id: 'dpo',
      title: 'DPO: o atalho moderno',
      body: `
        <p>DPO (Direct Preference Optimization) é uma alternativa que dispensa o reward model explícito. Reformulando matematicamente, é possível otimizar diretamente sobre os pares de preferência:</p>
        <p>Vantagens: muito mais simples, mais estável, menos hiperparâmetros. Tem se tornado o default em muitos labs.</p>
      `
    },
    {
      id: 'limitacoes',
      title: 'Reward hacking e limitações',
      body: `
        <p>RLHF tem problemas conhecidos:</p>
        <ul>
          <li><strong>Reward hacking:</strong> o LLM aprende a maximizar o RM, não a preferência humana real. Ex: respostas mais longas costumam pontuar mais alto, mesmo sem agregar valor.</li>
          <li><strong>Sycophancy:</strong> tendência a concordar com o usuário (humanos prefeririam isso no curto prazo).</li>
          <li><strong>Distributional shift:</strong> o LLM treinado deriva da distribuição do SFT.</li>
          <li><strong>Custo de feedback humano:</strong> milhares de horas de anotação. RLAIF (RL from AI Feedback) tenta substituir parcialmente.</li>
        </ul>
      `
    }
  ],
  whenToUse: [
    'Após pretrain de LLM para alinhar a preferências humanas',
    'Reduzir toxicidade e melhorar utilidade',
    'Customizar comportamento (tom, foco, recusas)'
  ],
  whenNot: [
    'Quando SFT puro é suficiente',
    'Sem orçamento para feedback humano de qualidade',
    'Quando a tarefa não tem componente subjetivo/de preferência'
  ],
  metrics: ['Win rate em side-by-side', 'MT-Bench, AlpacaEval', 'Human eval']
};

window.LESSON_CONTENT['rag'] = {
  id: 'rag',
  title: 'RAG',
  etapa: 6, etapaName: 'AI moderna',
  time: '60 min',
  tags: ['retrieval', 'embeddings', 'LLM'],
  tagline: 'Recuperar antes de gerar. A receita para LLMs <em>com conhecimento atualizado</em>.',
  intro: `
    <p>RAG (Retrieval-Augmented Generation) endereça a maior limitação de LLMs: conhecimento congelado no momento do treino, e ausência de informações privadas (sua documentação, seus dados). A ideia é simples: antes de responder, busque informação relevante numa base externa e injete no contexto.</p>
  `,
  sections: [
    {
      id: 'pipeline',
      title: 'O pipeline básico',
      body: `
        <ol>
          <li><strong>Indexação (offline):</strong> divida seus documentos em chunks. Para cada chunk, gere um embedding com um modelo (e.g. sentence-transformers, text-embedding-3). Armazene em vector database.</li>
          <li><strong>Query:</strong> usuário envia pergunta. Gere embedding da pergunta.</li>
          <li><strong>Retrieval:</strong> busque os top-k chunks mais similares ao embedding da query.</li>
          <li><strong>Augmentation:</strong> injete os chunks no prompt do LLM.</li>
          <li><strong>Generation:</strong> LLM responde usando o contexto.</li>
        </ol>
      `
    },
    {
      id: 'chunking',
      title: 'Chunking: onde a maior parte dos sistemas falha',
      body: `
        <p>A qualidade do RAG depende dramaticamente de como você divide os documentos:</p>
        <ul>
          <li><strong>Tamanho:</strong> tipicamente 200-1000 tokens. Pequeno demais perde contexto, grande demais dilui.</li>
          <li><strong>Overlap:</strong> 10-20% para preservar continuidade.</li>
          <li><strong>Semântico:</strong> dividir por seções/parágrafos é melhor que dividir por número fixo de tokens.</li>
          <li><strong>Metadata:</strong> guarde título do documento, seção, data — para filtros e contexto.</li>
        </ul>
      `
    },
    {
      id: 'reranking',
      title: 'Re-ranking: refinando o retrieval',
      body: `
        <p>Similaridade de embeddings é rápida mas grosseira. Um <strong>re-ranker</strong> (cross-encoder, mais caro) reordena os top-100 do retrieval para os top-5 que realmente vão para o LLM.</p>
        <p>Modelos populares: Cohere Rerank, BGE Reranker, ColBERT.</p>
        <p>Re-ranking costuma ser o maior boost de qualidade depois de chunking decente.</p>
      `
    },
    {
      id: 'avaliacao',
      title: 'Como avaliar um sistema RAG',
      body: `
        <ul>
          <li><strong>Retrieval:</strong> Recall@k (o documento relevante está nos top-k?), MRR, NDCG.</li>
          <li><strong>Generation:</strong> faithfulness (a resposta usa o contexto?), answer relevance, context relevance.</li>
          <li><strong>End-to-end:</strong> human eval, LLM-as-judge.</li>
        </ul>
        <p>Frameworks: Ragas, TruLens, LangSmith.</p>
      `
    }
  ],
  whenToUse: [
    'LLM precisa responder sobre conhecimento privado/recente',
    'Reduzir alucinações com fontes citáveis',
    'Sistemas de Q&A sobre documentação',
    'Suporte ao cliente, chatbots empresariais'
  ],
  whenNot: [
    'Quando o conhecimento já está no modelo (tarefas gerais)',
    'Quando latência ultra-baixa é crítica',
    'Quando o contexto cabe inteiro no prompt (use long context direto)'
  ],
  metrics: ['Recall@k', 'Faithfulness', 'Answer relevance', 'Human eval']
};

window.LESSON_CONTENT['agents'] = {
  id: 'agents',
  title: 'Agents',
  etapa: 6, etapaName: 'AI moderna',
  time: '60 min',
  tags: ['agentes', 'tools', 'planning'],
  tagline: 'LLM + ferramentas + loop. <em>Raciocínio</em> em múltiplos passos.',
  intro: `
    <p>Um agente LLM é um sistema que combina o modelo de linguagem com ferramentas externas (busca, código, APIs, bancos de dados) num loop de raciocínio. Em vez de uma única resposta, o agente <em>planeja</em>, <em>age</em>, <em>observa</em> e <em>itera</em> até completar a tarefa. É o paradigma que está dominando a aplicação prática de LLMs em 2024-2025.</p>
  `,
  sections: [
    {
      id: 'react',
      title: 'ReAct: Reasoning + Acting',
      body: `
        <p>O padrão original (Yao et al, 2022). A cada passo, o agente gera:</p>
        <ol>
          <li><strong>Thought:</strong> raciocínio sobre o estado atual.</li>
          <li><strong>Action:</strong> uma ação (chamar ferramenta, gerar resposta).</li>
          <li><strong>Observation:</strong> o resultado da ação.</li>
        </ol>
        <p>O loop continua até o agente decidir que terminou. É como um cientista: hipotetiza, experimenta, observa, ajusta.</p>
      `
    },
    {
      id: 'tools',
      title: 'Tools: o vocabulário do agente',
      body: `
        <p>Ferramentas comuns:</p>
        <ul>
          <li><strong>Code interpreter:</strong> executa Python, faz contas, plota gráficos.</li>
          <li><strong>Web search:</strong> Google, Bing, ou search APIs.</li>
          <li><strong>Database queries:</strong> SQL, vector search.</li>
          <li><strong>APIs externas:</strong> calendário, e-mail, CRM, ferramentas internas.</li>
          <li><strong>Computer use:</strong> controlar mouse e teclado (Claude Computer Use, etc.).</li>
        </ul>
        <p>Cada ferramenta é definida por um schema (descrição + parâmetros). O LLM aprende a invocá-las via function calling — formato padronizado em modelos modernos.</p>
      `
    },
    {
      id: 'planning',
      title: 'Planning: além do reativo',
      body: `
        <p>ReAct é puramente reativo — decide o próximo passo sem plano. Para tarefas complexas, agentes mais sofisticados:</p>
        <ul>
          <li><strong>Planner-Executor:</strong> primeiro gera plano completo, depois executa passo a passo.</li>
          <li><strong>Tree of Thoughts:</strong> explora múltiplas trajetórias em paralelo, escolhe a melhor.</li>
          <li><strong>Reflexion:</strong> após erro, reflete sobre o que deu errado e ajusta estratégia.</li>
        </ul>
      `
    },
    {
      id: 'multi-agent',
      title: 'Multi-agent: orquestração',
      body: `
        <p>Sistemas mais complexos têm múltiplos agentes especializados que colaboram:</p>
        <ul>
          <li><strong>Researcher</strong> coleta informação.</li>
          <li><strong>Writer</strong> sintetiza.</li>
          <li><strong>Reviewer</strong> verifica qualidade.</li>
          <li><strong>Orchestrator</strong> decide quem age quando.</li>
        </ul>
        <p>Frameworks: AutoGen, CrewAI, LangGraph. Pode aumentar qualidade mas multiplica custo de tokens — sempre justifique.</p>
      `
    },
    {
      id: 'riscos',
      title: 'Riscos e armadilhas',
      body: `
        <ul>
          <li><strong>Loops infinitos</strong> ou ações repetidas. Sempre tenha max_steps.</li>
          <li><strong>Custos explodem</strong> rapidamente — agentes complexos podem usar dezenas de chamadas por tarefa.</li>
          <li><strong>Erros se acumulam</strong> entre passos. Cada passo precisa ter qualidade alta.</li>
          <li><strong>Prompt injection</strong> via ferramentas (input externo) é vetor real de ataque.</li>
        </ul>
      `
    }
  ],
  whenToUse: [
    'Tarefas que requerem múltiplos passos de raciocínio',
    'Quando você precisa de acesso a dados/sistemas externos',
    'Análise complexa, debugging, code generation',
    'Automação de workflows'
  ],
  whenNot: [
    'Tarefas que cabem em um único prompt',
    'Quando latência é crítica',
    'Quando custo de tokens é uma restrição forte'
  ],
  metrics: ['Task success rate', 'Steps per task', 'Cost per task', 'Human eval']
};

window.LESSON_CONTENT['multimodal'] = {
  id: 'multimodal',
  title: 'Multimodal',
  etapa: 6, etapaName: 'AI moderna',
  time: '75 min',
  tags: ['multimodal', 'CLIP', 'visão+texto'],
  tagline: 'Texto + imagem + áudio no mesmo espaço de embedding. <em>Foundation models</em> universais.',
  intro: `
    <p>Multimodal é a fronteira atual de IA: modelos que processam e geram em múltiplas modalidades (texto, imagem, áudio, vídeo) num único espaço unificado. CLIP foi o catalisador; Gemini, GPT-4V e Claude 3.5 Sonnet são os herdeiros. Esta lição cobre os fundamentos.</p>
  `,
  sections: [
    {
      id: 'clip',
      title: 'CLIP: o ponto de virada',
      body: `
        <p>CLIP (OpenAI, 2021) aprende a alinhar imagens e suas legendas no mesmo espaço de embedding via contrastive learning:</p>
        <ol>
          <li>Encoder de imagem (ViT) projeta imagens em vetores.</li>
          <li>Encoder de texto (Transformer) projeta legendas em vetores.</li>
          <li>Treine para que (imagem, legenda) verdadeiros tenham similaridade alta, e impostores baixa.</li>
        </ol>
        <p>Resultado: zero-shot classification (descreva as classes em texto, classifique imagens), retrieval (busque imagens por texto), e base para geração de imagens (Stable Diffusion usa CLIP).</p>
      `
    },
    {
      id: 'fusion',
      title: 'Fusion: como combinar modalidades',
      body: `
        <p>Três estratégias para fundir informação multimodal:</p>
        <ul>
          <li><strong>Early fusion:</strong> combina features cedo, antes de processar. Permite interação rica mas pode ser difícil de treinar.</li>
          <li><strong>Late fusion:</strong> processa cada modalidade separadamente, combina apenas no final. Mais simples mas perde interação.</li>
          <li><strong>Cross-attention:</strong> uma modalidade atende à outra. Padrão atual em modelos como BLIP-2, LLaVA, Flamingo.</li>
        </ul>
      `
    },
    {
      id: 'vlm',
      title: 'Vision-Language Models modernos',
      body: `
        <p>Arquitetura típica de VLM (Vision-Language Model):</p>
        <ol>
          <li>Vision encoder (ViT pré-treinado) processa imagem em tokens visuais.</li>
          <li>Projection layer adapta esses tokens para o espaço do LLM.</li>
          <li>LLM (texto + tokens visuais) gera saída em texto.</li>
        </ol>
        <p>Exemplos: LLaVA, BLIP-2, MiniGPT-4. Closed-source: GPT-4V, Claude 3.5 Sonnet vision, Gemini.</p>
      `
    },
    {
      id: 'aplicacoes',
      title: 'Aplicações práticas',
      body: `
        <ul>
          <li><strong>OCR e document understanding:</strong> extrair informação de PDFs, tabelas, recibos.</li>
          <li><strong>Visual QA:</strong> perguntas sobre imagens.</li>
          <li><strong>Image captioning e descrição:</strong> acessibilidade, indexação.</li>
          <li><strong>Geração de imagem a partir de texto:</strong> Stable Diffusion, DALL-E.</li>
          <li><strong>Vídeo understanding:</strong> sumarização, transcrição com contexto visual.</li>
          <li><strong>Audio + texto:</strong> Whisper para transcrição, em breve modelos áudio-nativos.</li>
        </ul>
      `
    },
    {
      id: 'desafios',
      title: 'Desafios atuais',
      body: `
        <ul>
          <li><strong>Resolução:</strong> ViTs limitam imagens a tamanhos fixos. Soluções: tiling, dynamic resolution.</li>
          <li><strong>Hallucination visual:</strong> modelos descrevem coisas que não estão na imagem.</li>
          <li><strong>Spatial reasoning:</strong> ainda fraco. "À esquerda do" / "atrás de" são difíceis.</li>
          <li><strong>Vídeo longo:</strong> compressão temporal é problema aberto.</li>
        </ul>
      `
    }
  ],
  whenToUse: [
    'OCR/document understanding',
    'Acessibilidade',
    'Análise de imagens e vídeos',
    'Geração criativa de imagens',
    'Robótica e computer use'
  ],
  whenNot: [
    'Quando a tarefa é puramente textual',
    'Quando custo é crítica e VLMs são caros',
    'Quando precisão pixel-perfect é necessária (use modelos especializados)'
  ],
  metrics: ['VQA accuracy', 'CIDEr (captioning)', 'CLIPScore', 'Human eval']
};

window.LESSON_CONTENT['fine-tuning'] = {
  id: 'fine-tuning',
  title: 'Fine Tuning',
  etapa: 6, etapaName: 'AI moderna',
  time: '90 min',
  tags: ['fine-tuning', 'BERT', 'LoRA', 'PEFT'],
  tagline: 'Pegue um modelo pré-treinado e <em>adapte</em> à sua tarefa. Da classificação com BERT à instruction tuning com LoRA.',
  intro: `
    <p>Fine-tuning é o trabalho braçal mais valioso da IA aplicada: pegar um foundation model e adaptá-lo a um problema específico. Pode ir do tradicional (BERT para classificação de texto) ao moderno (LoRA fine-tune de um LLM de 70B). Esta lição cobre o espectro inteiro — quando vale a pena, qual técnica usar, como evitar os erros comuns.</p>
  `,
  sections: [
    {
      id: 'quando',
      title: 'Quando fazer fine-tuning (e quando não)',
      body: `
        <p>Antes de fine-tunar, descarte alternativas mais baratas:</p>
        <ul>
          <li><strong>Prompt engineering:</strong> resolve mais do que você pensa. Tente primeiro.</li>
          <li><strong>Few-shot in-context:</strong> coloque exemplos no prompt. Funciona surpreendentemente bem em LLMs grandes.</li>
          <li><strong>RAG:</strong> se a falta é de <em>conhecimento</em> (não de comportamento), recupere em vez de retreinar.</li>
        </ul>
        <p>Fine-tuning brilha quando você precisa de:</p>
        <ul>
          <li><strong>Formato / estilo específico</strong> consistente em milhares de inferências.</li>
          <li><strong>Domínio especializado</strong> com jargão (jurídico, médico, financeiro).</li>
          <li><strong>Latência baixa:</strong> modelo menor fine-tunado pode bater modelo grande zero-shot.</li>
          <li><strong>Classificação clássica:</strong> BERT/RoBERTa fine-tunados ainda são SOTA em muitas tarefas tabulares de texto.</li>
        </ul>
        <div class="callout warn">
          <strong>HEURÍSTICA</strong>
          Se você consegue resolver com prompt em 10 horas vs fine-tune em 100 horas, comece com prompt. Fine-tuning compensa quando o problema é repetitivo e a economia de tokens (ou latência) justifica o investimento.
        </div>
      `
    },
    {
      id: 'bert',
      title: 'Fine-tuning de BERT para classificação',
      body: `
        <p>O caso clássico que ainda paga as contas: BERT pré-treinado + cabeça de classificação. Funciona muito bem para sentiment analysis, classificação de tickets, detecção de intenção, NER.</p>
        <pre><code>from transformers import AutoTokenizer, AutoModelForSequenceClassification, Trainer, TrainingArguments
from datasets import Dataset

model_name = "neuralmind/bert-base-portuguese-cased"  # ou bert-base-multilingual
tokenizer = AutoTokenizer.from_pretrained(model_name)
model = AutoModelForSequenceClassification.from_pretrained(
    model_name, num_labels=3  # ex: positivo / neutro / negativo
)

def tokenize(examples):
    return tokenizer(examples["text"], truncation=True, padding="max_length", max_length=256)

train_ds = Dataset.from_pandas(train_df).map(tokenize, batched=True)
val_ds   = Dataset.from_pandas(val_df).map(tokenize, batched=True)

args = TrainingArguments(
    output_dir="./out",
    num_train_epochs=3,
    per_device_train_batch_size=16,
    learning_rate=2e-5,            # crítico — BERT diverge com lr alto
    weight_decay=0.01,
    eval_strategy="epoch",
    save_strategy="epoch",
    load_best_model_at_end=True,
    metric_for_best_model="f1_macro"
)

trainer = Trainer(model=model, args=args, train_dataset=train_ds, eval_dataset=val_ds)
trainer.train()</code></pre>
        <p>Dicas práticas:</p>
        <ul>
          <li><strong>Learning rate baixo</strong> (1e-5 a 5e-5). Lr alto destrói os pesos pré-treinados.</li>
          <li><strong>Poucas epochs</strong> (2-4). Mais que isso overfitta com facilidade em datasets pequenos.</li>
          <li><strong>Sempre use modelo na língua certa.</strong> Para português: <code>neuralmind/bert-base-portuguese-cased</code> (BERTimbau) ou modelos multilingual.</li>
          <li><strong>Stratified split</strong> em datasets desbalanceados.</li>
        </ul>
      `
    },
    {
      id: 'sft-llms',
      title: 'SFT — Supervised Fine-Tuning de LLMs',
      body: `
        <p>Para LLMs generativos (Llama, Mistral, Phi), o paradigma é diferente. Você fornece pares (prompt, resposta_ideal) e treina o modelo para reproduzir a resposta.</p>
        <p>Estrutura típica do dataset (formato OpenAI/instruct):</p>
        <pre><code>{
  "messages": [
    {"role": "system", "content": "Você é um assistente jurídico..."},
    {"role": "user", "content": "Resuma o seguinte contrato: ..."},
    {"role": "assistant", "content": "Resumo: ..."}
  ]
}</code></pre>
        <p>Tamanho mínimo: 500-1000 exemplos de alta qualidade. <strong>Qualidade vence quantidade.</strong> 100 exemplos curados batem 10.000 ruidosos em muitos cenários.</p>
        <p>O treino aplica next-token-prediction nas respostas (não no prompt — geralmente mascarado da loss).</p>
      `
    },
    {
      id: 'lora',
      title: 'LoRA & QLoRA: fine-tuning eficiente',
      body: `
        <p>Fine-tunar um LLM de 7B de parâmetros completo precisa de ~28GB de VRAM só para os pesos, mais o triplo durante treino (gradients + optimizer states). Inviável para a maioria.</p>
        <p><strong>LoRA</strong> (Low-Rank Adaptation) resolve: congela os pesos originais e treina apenas matrizes de baixo rank que são <em>adicionadas</em> em pontos estratégicos.</p>
        <div class="math">W' = W + B·A,   onde rank(B·A) ≪ rank(W)</div>
        <p>Tipicamente reduz parâmetros treináveis em 100-1000x sem perda significativa de qualidade.</p>
        <p><strong>QLoRA</strong> vai além: quantiza o modelo base para 4-bit durante o fine-tune. Permite fine-tunar Llama-70B em uma única GPU consumer.</p>
        <pre><code>from peft import LoraConfig, get_peft_model
from transformers import AutoModelForCausalLM

model = AutoModelForCausalLM.from_pretrained("meta-llama/Llama-3.1-8B-Instruct",
                                              load_in_4bit=True)  # quantização

config = LoraConfig(
    r=16,                          # rank — 8, 16, 32, 64
    lora_alpha=32,                 # scaling
    target_modules=["q_proj", "v_proj"],  # quais camadas adaptar
    lora_dropout=0.05,
    bias="none",
    task_type="CAUSAL_LM"
)

model = get_peft_model(model, config)
model.print_trainable_parameters()
# "trainable params: 4M  ||  all params: 8B  ||  0.05%"</code></pre>
        <p>O adapter LoRA gerado tem dezenas de MB (vs dezenas de GB do modelo base). Você pode carregá-lo sob demanda — múltiplos adapters para múltiplas tarefas, todos compartilhando o mesmo modelo base.</p>
      `
    },
    {
      id: 'peft-family',
      title: 'A família PEFT',
      body: `
        <p>LoRA é o membro mais conhecido da família <strong>PEFT</strong> (Parameter-Efficient Fine-Tuning). Outros métodos:</p>
        <ul>
          <li><strong>Prefix tuning:</strong> treina prefixos virtuais ("soft prompts") em vez de modificar pesos.</li>
          <li><strong>Prompt tuning:</strong> versão simples — só treina o embedding dos tokens iniciais.</li>
          <li><strong>Adapter layers:</strong> insere pequenas camadas entre os blocos do transformer. LoRA é uma variante mais eficiente disso.</li>
          <li><strong>DoRA, VeRA:</strong> refinamentos de LoRA com melhor convergência.</li>
        </ul>
        <p>Na prática, LoRA/QLoRA são o default. Comece com r=16 e ajuste.</p>
      `
    },
    {
      id: 'pitfalls',
      title: 'Erros comuns',
      body: `
        <ul>
          <li><strong>Catastrophic forgetting:</strong> fine-tune intenso pode degradar capacidades gerais do modelo. LoRA mitiga (pesos originais preservados). Para SFT completo, monitore benchmarks gerais.</li>
          <li><strong>Overfitting em dataset pequeno:</strong> early stopping é obrigatório. Use validation set separado.</li>
          <li><strong>Distribuição shift treino→produção:</strong> se o usuário fala diferente dos dados de treino, performance cai. Curadoria do dataset >>> arquitetura.</li>
          <li><strong>Ignorar contaminação:</strong> verifique se seu dataset de avaliação não vazou do pretrain.</li>
          <li><strong>Tokenização diferente:</strong> sempre use o tokenizer do modelo, não invente.</li>
        </ul>
      `
    }
  ],
  whenToUse: [
    'Classificação de texto especializada (BERT)',
    'Adaptar LLM ao tom/formato/jargão do domínio',
    'Quando latência ou custo de inferência justificam',
    'Quando você tem dados curados de alta qualidade'
  ],
  whenNot: [
    'Antes de tentar prompt engineering e RAG',
    'Com menos de algumas centenas de exemplos de qualidade',
    'Para incorporar conhecimento factual mutável (use RAG)'
  ],
  metrics: ['F1, accuracy (classificação)', 'Perplexity em validation', 'Win-rate vs base model (LLMs)', 'Custo de inferência']
};

window.LESSON_CONTENT['mas'] = {
  id: 'mas',
  title: 'Multi-Agent Systems',
  etapa: 6, etapaName: 'AI moderna',
  time: '75 min',
  tags: ['multi-agent', 'orquestração', 'coordenação'],
  tagline: 'Múltiplos agentes especializados <em>colaborando</em>. Quando um único LLM não dá conta.',
  intro: `
    <p>Multi-Agent Systems (MAS) são sistemas onde múltiplos agentes autônomos cooperam (ou competem) para resolver problemas. No contexto de LLMs, MAS surge quando uma única chain-of-thought não basta — você precisa de divisão de trabalho, especialização e revisão. Esta lição cobre os princípios de design e as armadilhas.</p>
  `,
  sections: [
    {
      id: 'por-que',
      title: 'Por que múltiplos agentes',
      body: `
        <p>Um agente único sofre de três problemas em tarefas complexas:</p>
        <ul>
          <li><strong>Cognitive overload:</strong> manter contexto, plano, ferramentas e raciocínio simultaneamente degrada qualidade.</li>
          <li><strong>Falta de especialização:</strong> generalista raramente bate especialista. Um agente "researcher" otimizado para busca vai ser melhor que um agente generalista fazendo busca.</li>
          <li><strong>Ausência de revisão:</strong> não há "segundo olhar". Erros se propagam.</li>
        </ul>
        <p>MAS endereça isso atribuindo papéis distintos a agentes diferentes, cada um com seu prompt do sistema, suas ferramentas e seu contexto. Reduz cognitive load por agente e introduz checkpoints naturais.</p>
        <div class="callout warn">
          <strong>NEM SEMPRE COMPENSA</strong>
          MAS multiplica custos (tokens, latência) e introduz pontos de falha. Para tarefas simples, um único agente é melhor. Justifique a complexidade.
        </div>
      `
    },
    {
      id: 'arquiteturas',
      title: 'Arquiteturas de coordenação',
      body: `
        <p>Três paradigmas dominantes:</p>
        <ul>
          <li><strong>Centralizada (orquestrador):</strong> um agente "maestro" decide quem age quando. Subagentes não falam entre si diretamente. Simples, debugável, mas vira gargalo.</li>
          <li><strong>Descentralizada (mensagens):</strong> agentes trocam mensagens em um barramento comum. Mais flexível, mais difícil de debugar e controlar.</li>
          <li><strong>Hierárquica:</strong> manager → workers → subworkers. Combina escalabilidade com estrutura. Padrão em sistemas grandes.</li>
        </ul>
        <p>Escolha baseada em complexidade: comece centralizado, evolua para hierárquico se necessário, evite descentralizado puro a menos que tenha motivo claro.</p>
      `
    },
    {
      id: 'especializacao',
      title: 'Padrões de especialização',
      body: `
        <p>Papéis comuns em sistemas multi-agente:</p>
        <ul>
          <li><strong>Researcher / Retriever:</strong> coleta informação externa (web, banco, documentos).</li>
          <li><strong>Analyst:</strong> processa informação, identifica padrões, gera insights.</li>
          <li><strong>Writer:</strong> sintetiza em formato final (relatório, código, e-mail).</li>
          <li><strong>Reviewer / Critic:</strong> avalia qualidade, sugere melhorias. Aplica regras de negócio ou compliance.</li>
          <li><strong>Planner:</strong> decompõe tarefa em subtarefas e atribui aos outros.</li>
          <li><strong>Executor:</strong> executa ações via ferramentas (código, APIs).</li>
        </ul>
        <p>Cada papel tem prompt do sistema customizado, conjunto de ferramentas restrito e regras de quando passar o trabalho adiante.</p>
      `
    },
    {
      id: 'comunicacao',
      title: 'Comunicação entre agentes',
      body: `
        <p>Como os agentes trocam informação importa muito:</p>
        <ul>
          <li><strong>Mensagens estruturadas:</strong> JSON com campos definidos (resultado, próximo_passo, erros). Mais robusto que texto livre.</li>
          <li><strong>Shared memory / blackboard:</strong> um estado comum que todos leem e escrevem. Útil para tarefas longas com estado complexo.</li>
          <li><strong>Handoff explícito:</strong> o agente A invoca o agente B passando contexto resumido (não a conversa inteira — explode o token budget).</li>
        </ul>
        <p>Truque essencial: <strong>sumarize contexto entre agentes</strong>. Passar 50k tokens de histórico de um agente para outro é desperdício. Um agente "summarizer" pode comprimir antes do handoff.</p>
      `
    },
    {
      id: 'debate',
      title: 'Padrões avançados: debate e consenso',
      body: `
        <p>Quando a tarefa exige robustez, dois padrões interessantes:</p>
        <ul>
          <li><strong>Multi-agent debate:</strong> dois (ou mais) agentes argumentam posições diferentes. Um terceiro julga. Melhora confiabilidade em tarefas de raciocínio.</li>
          <li><strong>Sampling + voting:</strong> rode o mesmo agente N vezes com temperatura > 0 e tome a resposta majoritária. Boa para classificação e tarefas com respostas verificáveis.</li>
          <li><strong>Self-consistency:</strong> variante de sampling onde você gera múltiplos raciocínios (não só respostas) e escolhe a resposta que mais raciocínios distintos chegaram.</li>
        </ul>
      `
    },
    {
      id: 'desafios',
      title: 'Desafios operacionais',
      body: `
        <ul>
          <li><strong>Custo explode rapidamente.</strong> Cada agente é uma chamada de LLM. Cinco agentes em loop = facilmente 50+ chamadas por tarefa.</li>
          <li><strong>Debug é difícil.</strong> Falhas podem estar em qualquer agente. Logging estruturado + tracing (LangSmith, Helicone) são obrigatórios.</li>
          <li><strong>Latência soma:</strong> agentes em série multiplicam latência. Paralelize quando possível.</li>
          <li><strong>Ciclos infinitos:</strong> sempre tenha max_iterations e detecção de loop.</li>
          <li><strong>Drift:</strong> entre agentes, o objetivo original pode se perder. Reafirme periodicamente.</li>
        </ul>
      `
    }
  ],
  whenToUse: [
    'Tarefas que se beneficiam de divisão de trabalho clara',
    'Quando revisão / segundo olhar é valioso (jurídico, médico)',
    'Workflows com múltiplas competências (research + escrita + revisão)',
    'Sistemas que combinam múltiplas ferramentas heterogêneas'
  ],
  whenNot: [
    'Tarefas simples — um agente basta',
    'Quando latência é crítica',
    'Quando custo de tokens é restrição forte',
    'Sem infraestrutura de observabilidade'
  ],
  metrics: ['Task success rate', 'Custo médio por tarefa', 'Latência p95', 'Steps por tarefa']
};

window.LESSON_CONTENT['agent-patterns'] = {
  id: 'agent-patterns',
  title: 'Agent Patterns',
  etapa: 6, etapaName: 'AI moderna',
  time: '75 min',
  tags: ['agentes', 'design patterns', 'arquitetura'],
  tagline: 'Os <em>padrões de projeto</em> de agentes: Router, Handoff, SubAgent, Reflexion, Plan-and-Execute.',
  intro: `
    <p>Assim como software tem GoF design patterns, sistemas de agentes têm padrões que se repetem. Conhecê-los economiza meses de tentativa e erro. Esta lição cataloga os principais padrões com quando usar cada um.</p>
  `,
  sections: [
    {
      id: 'router',
      title: 'Router (Dispatcher)',
      body: `
        <p>Um agente especializado em <strong>classificar a query e despachar</strong> para o agente certo. Análogo a um middleware HTTP que roteia requisições.</p>
        <p>Fluxo:</p>
        <ol>
          <li>Query chega no Router.</li>
          <li>Router analisa intenção e categoria.</li>
          <li>Despacha para um SubAgent especializado (ou para uma ferramenta).</li>
          <li>Retorna resposta do SubAgent ao usuário.</li>
        </ol>
        <p>Casos de uso:</p>
        <ul>
          <li>Chatbot multi-domínio: rotear "qual meu saldo?" para o agente de contas, "como cancelar?" para o agente de support.</li>
          <li>Sistemas com múltiplas bases de conhecimento: rotear para a RAG correta.</li>
        </ul>
        <p>Implementação típica: prompt com lista das categorias + few-shot examples + saída estruturada (JSON com <code>{ "route": "billing" }</code>).</p>
      `
    },
    {
      id: 'subagent',
      title: 'SubAgent (Especialista)',
      body: `
        <p>Um agente focado em <strong>uma única responsabilidade</strong>. Prompt do sistema enxuto, conjunto de ferramentas restrito, contexto limitado ao necessário.</p>
        <p>SubAgents são chamados por um Router ou Orchestrator e devolvem resultados estruturados. Não conversam com o usuário diretamente em geral.</p>
        <p>Princípio importante: <strong>cada SubAgent é um "função pura" idealmente</strong>. Recebe input, retorna output, sem side-effects além do esperado.</p>
        <p>Exemplos:</p>
        <ul>
          <li>SQL SubAgent: traduz pergunta natural em SQL, executa, retorna resultado.</li>
          <li>Document SubAgent: busca em uma base específica, retorna chunks relevantes.</li>
          <li>Code SubAgent: gera código a partir de specs, executa, retorna saída.</li>
        </ul>
      `
    },
    {
      id: 'handoff',
      title: 'Handoff (Transferência)',
      body: `
        <p>Padrão onde um agente <strong>transfere o controle da conversa</strong> para outro — em vez de chamar como subrotina e retornar.</p>
        <p>Diferença crucial vs SubAgent:</p>
        <ul>
          <li>SubAgent: A invoca B, B retorna para A, A continua.</li>
          <li>Handoff: A passa a conversa para B, B agora é quem fala com o usuário. A sai de cena.</li>
        </ul>
        <p>Usado em escalation flows: um agente generalista detecta complexidade alta e faz handoff para um agente especializado (ou humano). É o padrão do OpenAI Swarm e similar a "transfer" em call centers.</p>
        <p>Implementação típica:</p>
        <ol>
          <li>Agente atual decide fazer handoff via tool call <code>transfer_to_billing()</code>.</li>
          <li>Sistema troca o agente ativo.</li>
          <li>Novo agente recebe resumo do contexto + assume a conversa.</li>
        </ol>
      `
    },
    {
      id: 'reflexion',
      title: 'Reflexion (Autocrítica)',
      body: `
        <p>Padrão onde o próprio agente <strong>critica sua saída</strong> e itera para melhorar. Inspirado no paper "Reflexion" (Shinn et al, 2023).</p>
        <p>Ciclo:</p>
        <ol>
          <li>Agente produz uma resposta inicial.</li>
          <li>Agente "critic" (pode ser o mesmo modelo com prompt diferente) avalia: está completo? correto? bem estruturado?</li>
          <li>Se houver problemas, agente produz nova versão considerando o feedback.</li>
          <li>Repete até passar no critic (com max iterations).</li>
        </ol>
        <p>Eficaz para: geração de código, escrita longa, planejamento. Cuidado para não cair em loops de autocrítica infinita.</p>
        <p>Variante: <strong>Self-Refine</strong> — mesmo modelo refina iterativamente sem critic explícito.</p>
      `
    },
    {
      id: 'plan-execute',
      title: 'Plan-and-Execute',
      body: `
        <p>Separa explicitamente <strong>planejar</strong> e <strong>executar</strong>:</p>
        <ol>
          <li><strong>Planner</strong> gera um plano completo de N passos. Não executa nada.</li>
          <li><strong>Executor</strong> percorre os passos em ordem (ou em árvore), invocando ferramentas.</li>
          <li>Se um passo falhar, o Planner replaneja a partir dali.</li>
        </ol>
        <p>Vs ReAct (que decide o próximo passo a cada iteração): Plan-and-Execute tem visão global, é mais eficiente em tokens, mas menos flexível se a tarefa requer adaptação dinâmica.</p>
        <p>Variantes:</p>
        <ul>
          <li><strong>ReWOO</strong>: planeja todas as chamadas de ferramentas antecipadamente, executa em paralelo.</li>
          <li><strong>Tree of Thoughts</strong>: explora múltiplos planos em paralelo, escolhe o melhor.</li>
        </ul>
      `
    },
    {
      id: 'outros',
      title: 'Padrões adicionais úteis',
      body: `
        <ul>
          <li><strong>Map-Reduce:</strong> divide trabalho em chunks, processa cada um em paralelo (Map), agrega (Reduce). Bom para sumarização de documentos longos.</li>
          <li><strong>Critic-Refine:</strong> agente A gera, agente B critica, agente A refina. Pipeline simples mas eficaz.</li>
          <li><strong>Human-in-the-Loop:</strong> em pontos críticos, pausa para aprovação humana. Essencial em produção quando ações têm impacto real.</li>
          <li><strong>Memory Store:</strong> agente mantém memória persistente (long-term) para usuários recorrentes. Vector DB ou DB tradicional.</li>
          <li><strong>Tool Choice:</strong> agente decide entre várias ferramentas similares baseado em contexto (search rápida vs profunda, modelo barato vs caro).</li>
        </ul>
        <div class="callout tip">
          <strong>REGRA</strong>
          Comece simples (Router + SubAgent). Adicione padrões só quando o problema explicitamente os exige. Cada padrão adiciona complexidade — pague esse custo conscientemente.
        </div>
      `
    }
  ],
  whenToUse: [
    'Router: chatbots multi-domínio, triagem',
    'SubAgent: workflows com especialização clara',
    'Handoff: escalation, multi-skill conversations',
    'Reflexion: tarefas onde qualidade > velocidade',
    'Plan-and-Execute: tarefas longas com passos previsíveis'
  ],
  whenNot: [
    'Quando a tarefa é simples — direto melhor que indireto',
    'Sem observabilidade — padrões complexos viram caixa-preta'
  ],
  metrics: ['Task success rate por padrão', 'Custo médio', 'Latência p95', 'Falhas de roteamento']
};

window.LESSON_CONTENT['agent-frameworks'] = {
  id: 'agent-frameworks',
  title: 'Agent Frameworks',
  etapa: 6, etapaName: 'AI moderna',
  time: '60 min',
  tags: ['frameworks', 'LangChain', 'LangGraph', 'AutoGen', 'CrewAI'],
  tagline: 'Os frameworks que tornam agentes <em>operáveis</em>: LangChain, LangGraph, AutoGen, CrewAI — quando usar cada.',
  intro: `
    <p>Construir agentes do zero é viável (e útil para entender), mas em produção você quer alavancar frameworks que resolvem os problemas comuns: memory, tracing, retries, parallelism, deployment. Esta lição compara os principais frameworks e dá um veredito honesto de quando usar cada um.</p>
  `,
  sections: [
    {
      id: 'panorama',
      title: 'Panorama do ecossistema',
      body: `
        <p>O cenário em 2025 é dinâmico. Os frameworks mais relevantes:</p>
        <ul>
          <li><strong>LangChain:</strong> o pioneiro. Vasto, opinativo, em constante mudança. Abstrações para LLMs, ferramentas, chains, agents, memory.</li>
          <li><strong>LangGraph:</strong> da mesma equipe. Modela agentes como grafos de estado — controle explícito do fluxo. Cresceu muito como sucessor "production-ready" do LangChain.</li>
          <li><strong>AutoGen (Microsoft):</strong> foco em multi-agent. Conversas estruturadas entre agentes especializados.</li>
          <li><strong>CrewAI:</strong> abstração de "crew" e "tasks". Mais opinativo, foco em workflows tipo time de pessoas.</li>
          <li><strong>OpenAI Agents SDK / Swarm:</strong> minimalista. Handoffs como abstração central.</li>
          <li><strong>LlamaIndex:</strong> originalmente RAG-focused, expandiu para agents. Especialmente forte em indexação e retrieval.</li>
          <li><strong>Pydantic AI:</strong> mais novo. Type-safe, foco em produção, abstração mínima.</li>
        </ul>
        <p>Importante: o "vencedor" muda a cada 6 meses. Escolha pelo problema, não pelo hype.</p>
      `
    },
    {
      id: 'langchain',
      title: 'LangChain — o canivete suíço',
      body: `
        <p>O framework mais amplo. Suporta tudo: LLMs, embeddings, vector stores, retrievers, chains, agents, callbacks.</p>
        <p><strong>Forças:</strong></p>
        <ul>
          <li>Ecossistema gigante de integrações — qualquer LLM, qualquer vector store.</li>
          <li>Comunidade grande, muitos tutoriais.</li>
          <li>Bom para prototipagem rápida.</li>
        </ul>
        <p><strong>Fraquezas:</strong></p>
        <ul>
          <li>API instável historicamente — breaking changes frequentes.</li>
          <li>Abstrações pesadas que escondem o que o LLM realmente vê.</li>
          <li>Muitos preferiram migrar para LangGraph em produção.</li>
        </ul>
        <pre><code>from langchain_openai import ChatOpenAI
from langchain.agents import create_react_agent, AgentExecutor
from langchain_core.tools import tool

@tool
def search(query: str) -> str:
    """Busca informações na web."""
    return run_search(query)

llm = ChatOpenAI(model="gpt-4o")
agent = create_react_agent(llm, [search], prompt=react_prompt)
executor = AgentExecutor(agent=agent, tools=[search], verbose=True)
result = executor.invoke({"input": "Qual o PIB do Brasil em 2024?"})</code></pre>
      `
    },
    {
      id: 'langgraph',
      title: 'LangGraph — controle de fluxo explícito',
      body: `
        <p>LangGraph modela agentes como <strong>grafos de estado</strong>: nós são funções, edges são transições, state é compartilhado. Você decide o fluxo, o framework garante execução, persistência e recovery.</p>
        <p>Mental model: state machine + agents. Cada nó é "uma rodada de pensamento" do agente; edges são "para onde ir baseado no resultado".</p>
        <pre><code>from langgraph.graph import StateGraph, END
from typing import TypedDict

class State(TypedDict):
    query: str
    research: str
    answer: str

def research_node(state):
    state["research"] = web_search(state["query"])
    return state

def answer_node(state):
    state["answer"] = llm.invoke(f"Q: {state['query']}\\nContexto: {state['research']}")
    return state

graph = StateGraph(State)
graph.add_node("research", research_node)
graph.add_node("answer", answer_node)
graph.set_entry_point("research")
graph.add_edge("research", "answer")
graph.add_edge("answer", END)
app = graph.compile()</code></pre>
        <p>Mais verboso que LangChain, mas <em>muito</em> mais debugável. Default de muitas equipes em produção hoje. Suporta checkpointing, time-travel debugging e human-in-the-loop nativamente.</p>
      `
    },
    {
      id: 'autogen-crewai',
      title: 'AutoGen e CrewAI — multi-agent em primeiro plano',
      body: `
        <p><strong>AutoGen</strong> modela conversas entre agentes. Você define agentes (cada um um LLM com prompt customizado) e organiza como eles trocam mensagens. Bom para padrões de debate, código com revisão, planning.</p>
        <p><strong>CrewAI</strong> usa a metáfora de "crew" (time): você define agentes com papéis, tarefas atomicas, e o framework orquestra. Mais opinativo. Bom para quem quer estrutura clara sem montar tudo do zero.</p>
        <p>Quando preferir um deles a LangGraph:</p>
        <ul>
          <li>Você quer multi-agent natural ("um agente que escreve, outro que revisa") sem montar o grafo na mão.</li>
          <li>Você gosta da abstração de "time" / "conversa" e não precisa de controle de fluxo fino.</li>
        </ul>
      `
    },
    {
      id: 'comparacao',
      title: 'Veredito honesto: qual escolher',
      body: `
        <p>Sem viés de hype:</p>
        <ul>
          <li><strong>Protótipo rápido / aprendizado:</strong> LangChain ou Pydantic AI. Curva mais suave.</li>
          <li><strong>Produção single-agent com tools:</strong> LangGraph. Controle explícito, observabilidade nativa via LangSmith.</li>
          <li><strong>Multi-agent estruturado:</strong> AutoGen ou CrewAI. Abstração ajuda mais do que atrapalha.</li>
          <li><strong>Multi-agent customizado complexo:</strong> LangGraph. Mais flexível.</li>
          <li><strong>Foco em RAG + alguns agentes:</strong> LlamaIndex.</li>
          <li><strong>Type-safety + produção:</strong> Pydantic AI.</li>
          <li><strong>Handoffs como padrão central:</strong> OpenAI Agents SDK.</li>
        </ul>
        <div class="callout warn">
          <strong>EVITE OVER-ENGINEERING</strong>
          Muitos sistemas que usam frameworks complexos poderiam ser ~50 linhas de Python chamando a API do LLM diretamente. Pergunte sempre: o framework está resolvendo um problema real ou adicionando complexidade?
        </div>
      `
    },
    {
      id: 'observabilidade',
      title: 'Observabilidade é o que separa demo de produção',
      body: `
        <p>Independente do framework, você precisa de:</p>
        <ul>
          <li><strong>Tracing:</strong> ver cada chamada de LLM, cada tool call, cada decisão. LangSmith, Helicone, Langfuse, Phoenix (Arize).</li>
          <li><strong>Evaluation:</strong> rodar bateria de testes contra dataset de referência. Ragas, Promptfoo, DeepEval.</li>
          <li><strong>Cost tracking:</strong> tokens por usuário, por feature, por dia.</li>
          <li><strong>Versionamento de prompts:</strong> mudou o prompt = mudou o modelo. Trate como código.</li>
          <li><strong>Latency monitoring:</strong> p50, p95, p99. Alertas para degradação.</li>
        </ul>
        <p>Construir um agente: 1 semana. Operar um agente em produção: meses de tuning. Quem ignora observabilidade paga em incidents.</p>
      `
    }
  ],
  whenToUse: [
    'LangGraph: produção, controle de fluxo, debugging',
    'LangChain: protótipos, exploração, ecossistema',
    'AutoGen/CrewAI: multi-agent estruturado',
    'LlamaIndex: RAG-heavy',
    'Pydantic AI: type-safety e simplicidade'
  ],
  whenNot: [
    'Use vanilla Python + SDK direto quando a tarefa for simples',
    'Não use framework por hype — entenda o trade-off de abstração'
  ],
  metrics: ['Tempo de desenvolvimento', 'Custo de manutenção', 'Observabilidade nativa', 'Maturidade da comunidade']
};
