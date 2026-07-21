/* Lesson content, Etapa 09, Engenharia de ML & Dados (lições 37–42)
   O "gap de engenharia", feature engineering, SQL, modelagem, dados, código
*/
window.LESSON_CONTENT = window.LESSON_CONTENT || {};

window.LESSON_CONTENT['feature-engineering'] = {
  id: 'feature-engineering',
  title: 'Feature Engineering',
  etapa: 9, etapaName: 'Engenharia de ML & Dados',
  time: '90 min',
  tags: ['features', 'pré-processamento', 'leakage'],
  tagline: 'O trabalho que separa juniors de seniors. Modelo medíocre + features ótimas <em>vence</em> modelo ótimo + features ruins.',
  intro: `
    <p>Há um ditado no ML aplicado: "garbage in, garbage out". A qualidade das features determina o teto de performance, nenhum algoritmo recupera informação que não está nos dados. Feature engineering é onde o conhecimento de domínio entra, e é frequentemente o maior diferencial entre um modelo de produção e um protótipo.</p>
  `,
  sections: [
    {
      id: 'encoding',
      title: 'Encoding de variáveis categóricas',
      body: `
        <p>Modelos numéricos não entendem "São Paulo" ou "cartão de crédito". Estratégias de encoding:</p>
        <ul>
          <li><strong>One-Hot Encoding:</strong> uma coluna binária por categoria. Bom para baixa cardinalidade (&lt;15 valores). Explode em alta cardinalidade.</li>
          <li><strong>Label/Ordinal Encoding:</strong> inteiros. Só use quando há ordem natural (P/M/G), senão o modelo inventa ordem falsa.</li>
          <li><strong>Target Encoding:</strong> substitui categoria pela média do target naquela categoria. Poderoso em alta cardinalidade, mas <strong>vaza target</strong> se mal feito, use com cross-fold e smoothing.</li>
          <li><strong>Frequency Encoding:</strong> substitui pela frequência da categoria.</li>
          <li><strong>Embeddings:</strong> aprende representação densa (redes neurais, CatBoost). Melhor para altíssima cardinalidade (IDs de usuário, produtos).</li>
        </ul>
        <div class="callout warn">
          <strong>TARGET LEAKAGE</strong>
          Target encoding ingênuo (usando o dataset inteiro) vaza informação. Sempre calcule por fold de cross-validation ou com out-of-fold encoding.
        </div>
      `
    },
    {
      id: 'scaling',
      title: 'Scaling e transformações numéricas',
      body: `
        <p>Modelos baseados em distância e gradiente (KNN, SVM, redes) exigem features na mesma escala:</p>
        <ul>
          <li><strong>StandardScaler (z-score):</strong> média 0, desvio 1. Default. Assume distribuição aproximadamente normal.</li>
          <li><strong>MinMaxScaler:</strong> escala para [0, 1]. Bom quando há limites conhecidos.</li>
          <li><strong>RobustScaler:</strong> usa mediana e IQR. Resistente a outliers.</li>
          <li><strong>Log transform:</strong> para distribuições com cauda longa (renda, preços). Comprime a cauda.</li>
          <li><strong>Power transform (Box-Cox, Yeo-Johnson):</strong> aproxima de normal.</li>
        </ul>
        <p>Árvores e ensembles de árvores <strong>não precisam</strong> de scaling, são invariantes a transformações monotônicas.</p>
      `
    },
    {
      id: 'temporal',
      title: 'Features temporais',
      body: `
        <p>Datas e timestamps carregam muito sinal, mas precisam ser extraídos:</p>
        <ul>
          <li><strong>Componentes:</strong> hora, dia da semana, mês, trimestre, é feriado, é fim de semana.</li>
          <li><strong>Cíclicas:</strong> hora do dia e dia da semana são cíclicas, codifique com seno/cosseno para o modelo entender que 23h está perto de 0h.</li>
          <li><strong>Lags:</strong> valor de N períodos atrás (vendas da semana passada).</li>
          <li><strong>Rolling windows:</strong> média/desvio/máximo móvel dos últimos K períodos.</li>
          <li><strong>Time since:</strong> tempo desde último evento (última compra, último login).</li>
        </ul>
        <div class="callout warn">
          <strong>LEAKAGE TEMPORAL</strong>
          Ao criar features de janela, NUNCA inclua o futuro. Rolling windows devem usar apenas dados até o ponto de predição. Use validação temporal.
        </div>
      `
    },
    {
      id: 'missing',
      title: 'Missing values',
      body: `
        <p>Dados faltantes são regra, não exceção. Estratégias:</p>
        <ul>
          <li><strong>Imputação simples:</strong> média/mediana (numérica), moda (categórica). Mediana é mais robusta.</li>
          <li><strong>Imputação por modelo:</strong> KNN imputer, MICE. Mais sofisticado, risco de leakage.</li>
          <li><strong>Indicador de ausência:</strong> adicione uma coluna binária "estava faltando". O <em>fato</em> de faltar pode ser sinal.</li>
          <li><strong>Deixar faltar:</strong> XGBoost, LightGBM lidam nativamente com NaN, às vezes melhor que imputar.</li>
        </ul>
        <p>Sempre pergunte: o dado falta aleatoriamente (MCAR), por algo observável (MAR), ou pelo próprio valor (MNAR)? Isso muda a estratégia correta.</p>
      `
    },
    {
      id: 'leakage',
      title: 'Data leakage, o erro mais caro',
      body: `
        <p>Data leakage é quando informação que não estaria disponível em produção vaza para o treino. Infla métricas no desenvolvimento e o modelo falha em produção. Tipos comuns:</p>
        <ul>
          <li><strong>Target leakage:</strong> uma feature contém informação derivada do target (ex: "valor pago" num modelo de "vai pagar?").</li>
          <li><strong>Train-test contamination:</strong> normalizar/imputar usando estatísticas do dataset inteiro antes do split.</li>
          <li><strong>Temporal leakage:</strong> usar dados do futuro para prever o passado.</li>
          <li><strong>Group leakage:</strong> mesmo paciente/usuário em treino e teste.</li>
        </ul>
        <div class="callout tip">
          <strong>REGRA DE OURO</strong>
          Faça TODO o pré-processamento dentro de um Pipeline, fitado apenas no treino. Use sklearn Pipeline + ColumnTransformer para garantir que test/produção recebem exatamente a mesma transformação aprendida no treino.
        </div>
        <pre><code>from sklearn.pipeline import Pipeline
from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.impute import SimpleImputer

num_pipe = Pipeline([("impute", SimpleImputer(strategy="median")),
                     ("scale", StandardScaler())])
cat_pipe = Pipeline([("impute", SimpleImputer(strategy="most_frequent")),
                     ("ohe", OneHotEncoder(handle_unknown="ignore"))])

pre = ColumnTransformer([("num", num_pipe, num_cols),
                         ("cat", cat_pipe, cat_cols)])

full = Pipeline([("pre", pre), ("model", model)])
full.fit(X_train, y_train)  # tudo aprendido APENAS no treino</code></pre>
      `
    },
    {
      id: 'importance',
      title: 'Feature importance e seleção',
      body: `
        <p>Nem toda feature ajuda. Selecionar reduz overfitting, custo e latência:</p>
        <ul>
          <li><strong>Filter methods:</strong> correlação, mutual information, chi-quadrado. Rápido, independente de modelo.</li>
          <li><strong>Wrapper methods:</strong> Recursive Feature Elimination (RFE). Treina modelos iterativamente.</li>
          <li><strong>Embedded:</strong> Lasso (zera coeficientes), feature importance de árvores.</li>
          <li><strong>Permutation importance:</strong> embaralha uma feature, mede queda de performance. Confiável.</li>
          <li><strong>SHAP:</strong> contribuição de cada feature por predição. Estado da arte em interpretabilidade.</li>
        </ul>
      `
    }
  ],
  whenToUse: [
    'Sempre, é o trabalho de maior alavancagem em ML tabular',
    'Quando o modelo deu plateau (features novas > algoritmo novo)',
    'Quando há conhecimento de domínio a incorporar'
  ],
  whenNot: [
    'Em deep learning de imagem/texto (a rede aprende as features)',
    'Antes de ter um baseline funcionando'
  ],
  metrics: ['Lift de performance por feature', 'Permutation importance', 'SHAP values']
};

window.LESSON_CONTENT['sql-ml'] = {
  id: 'sql-ml',
  title: 'SQL para ML',
  etapa: 9, etapaName: 'Engenharia de ML & Dados',
  time: '75 min',
  tags: ['SQL', 'dados', 'window functions'],
  tagline: 'Antes do modelo, os dados. E os dados quase sempre estão num <em>banco relacional</em>.',
  intro: `
    <p>A maior parte das features de produção nasce de queries SQL. Dominar SQL avançado, window functions, CTEs, agregações, é o que permite construir features em escala diretamente na fonte, sem trazer terabytes para a memória. É uma habilidade subestimada por quem vem do "sklearn mindset".</p>
  `,
  sections: [
    {
      id: 'joins',
      title: 'Joins e a granularidade certa',
      body: `
        <p>O erro #1 em feature engineering com SQL é errar a granularidade. Antes de juntar tabelas, pergunte: "qual é uma linha do meu dataset final?"</p>
        <ul>
          <li><strong>INNER JOIN:</strong> só linhas com match nos dois lados.</li>
          <li><strong>LEFT JOIN:</strong> mantém todas as linhas da esquerda, essencial quando o lado direito pode não ter match (e você quer NULL, não perder a linha).</li>
          <li><strong>Fan-out trap:</strong> join com tabela de granularidade mais fina multiplica linhas. Agregue antes de juntar.</li>
        </ul>
        <div class="callout warn">
          <strong>DUPLICAÇÃO SILENCIOSA</strong>
          Um JOIN com chave não-única duplica linhas e infla agregações sem erro aparente. Sempre verifique COUNT(*) antes e depois de joins.
        </div>
      `
    },
    {
      id: 'window',
      title: 'Window functions, a ferramenta-chave',
      body: `
        <p>Window functions calculam agregações sem colapsar linhas, perfeitas para features. A estrutura:</p>
        <div class="math">FUNC() OVER (PARTITION BY ... ORDER BY ... ROWS BETWEEN ...)</div>
        <pre><code>SELECT
  user_id,
  order_date,
  amount,
  -- total acumulado do usuário
  SUM(amount) OVER (PARTITION BY user_id ORDER BY order_date) AS running_total,
  -- média móvel das últimas 3 compras
  AVG(amount) OVER (PARTITION BY user_id ORDER BY order_date
                    ROWS BETWEEN 2 PRECEDING AND CURRENT ROW) AS avg_last_3,
  -- valor da compra anterior (lag feature)
  LAG(amount, 1) OVER (PARTITION BY user_id ORDER BY order_date) AS prev_amount,
  -- ranking de compras do usuário
  ROW_NUMBER() OVER (PARTITION BY user_id ORDER BY amount DESC) AS purchase_rank
FROM orders;</code></pre>
        <p>Funções essenciais: <code>ROW_NUMBER</code>, <code>RANK</code>, <code>LAG</code>/<code>LEAD</code>, <code>SUM</code>/<code>AVG</code> com frame, <code>FIRST_VALUE</code>/<code>LAST_VALUE</code>.</p>
      `
    },
    {
      id: 'cte',
      title: 'CTEs, legibilidade e composição',
      body: `
        <p>Common Table Expressions (WITH) quebram queries complexas em passos nomeados. Essencial para feature pipelines legíveis:</p>
        <pre><code>WITH user_stats AS (
  SELECT user_id,
         COUNT(*) AS n_orders,
         AVG(amount) AS avg_order,
         MAX(order_date) AS last_order
  FROM orders
  GROUP BY user_id
),
recency AS (
  SELECT user_id,
         DATE_DIFF(CURRENT_DATE, last_order, DAY) AS days_since_last
  FROM user_stats
)
SELECT s.*, r.days_since_last
FROM user_stats s
JOIN recency r USING (user_id);</code></pre>
        <p>CTEs também permitem recursão (hierarquias, grafos), útil em features de árvore organizacional, categorias aninhadas.</p>
      `
    },
    {
      id: 'agregacao',
      title: 'Agregação para features em escala',
      body: `
        <p>O padrão RFM (Recency, Frequency, Monetary) e variações são features clássicas construídas por agregação:</p>
        <ul>
          <li><strong>Recency:</strong> dias desde último evento.</li>
          <li><strong>Frequency:</strong> contagem de eventos numa janela.</li>
          <li><strong>Monetary:</strong> soma/média de valor.</li>
          <li><strong>Conditional aggregation:</strong> <code>SUM(CASE WHEN status='paid' THEN amount ELSE 0 END)</code>, agrega condicionalmente.</li>
        </ul>
        <p>Para grandes volumes, agregue no banco (que é otimizado) em vez de trazer dados crus para Python. Bancos colunares (BigQuery, Redshift, Snowflake) são feitos para isso.</p>
      `
    },
    {
      id: 'otimizacao',
      title: 'Otimização de queries',
      body: `
        <p>Queries lentas matam pipelines. Princípios:</p>
        <ul>
          <li><strong>Filtre cedo:</strong> WHERE antes de JOIN reduz o volume processado.</li>
          <li><strong>Índices:</strong> em colunas de JOIN e WHERE. Entenda o EXPLAIN plan.</li>
          <li><strong>Evite SELECT *:</strong> traga só as colunas necessárias (crítico em colunares).</li>
          <li><strong>Particionamento:</strong> tabelas particionadas por data reduzem scan.</li>
          <li><strong>Materialização:</strong> features caras podem virar tabelas materializadas atualizadas em batch.</li>
        </ul>
      `
    }
  ],
  whenToUse: [
    'Construir features a partir de dados relacionais',
    'Quando os dados são grandes demais para a memória',
    'Pipelines de feature engineering em batch',
    'Feature stores offline'
  ],
  whenNot: [
    'Transformações que exigem bibliotecas ML específicas (faça em Python)',
    'Dados já em formato de matriz pequena'
  ],
  metrics: ['Tempo de query', 'Correção de granularidade', 'Cobertura de features']
};

window.LESSON_CONTENT['data-modeling'] = {
  id: 'data-modeling',
  title: 'Modelagem de Dados',
  etapa: 9, etapaName: 'Engenharia de ML & Dados',
  time: '60 min',
  tags: ['OLTP', 'OLAP', 'schema'],
  tagline: 'Como os dados são <em>organizados</em> determina o que você consegue extrair. OLTP, OLAP, e a ponte para ML.',
  intro: `
    <p>Entender modelagem de dados é entender de onde suas features vêm e por que algumas queries são rápidas e outras impossíveis. A distinção OLTP vs OLAP é fundamental: sistemas transacionais e analíticos têm objetivos opostos, e ML pipelines precisam navegar os dois.</p>
  `,
  sections: [
    {
      id: 'oltp-olap',
      title: 'OLTP vs OLAP',
      body: `
        <p><strong>OLTP (Online Transaction Processing):</strong> sistemas operacionais. Otimizados para escritas rápidas e consultas pontuais.</p>
        <ul>
          <li>Normalizado (3NF), sem redundância.</li>
          <li>Row-oriented.</li>
          <li>Exemplos: PostgreSQL, MySQL transacional.</li>
          <li>"Qual o saldo do cliente X agora?"</li>
        </ul>
        <p><strong>OLAP (Online Analytical Processing):</strong> sistemas analíticos. Otimizados para agregações sobre grandes volumes.</p>
        <ul>
          <li>Desnormalizado (star/snowflake schema), redundância proposital.</li>
          <li>Column-oriented.</li>
          <li>Exemplos: BigQuery, Redshift, Snowflake, ClickHouse.</li>
          <li>"Qual a média de vendas por região nos últimos 3 anos?"</li>
        </ul>
        <p>ML geralmente consome do OLAP (data warehouse) para training, e às vezes do OLTP para features em tempo real.</p>
      `
    },
    {
      id: 'normalizacao',
      title: 'Normalização',
      body: `
        <p>Normalização elimina redundância organizando dados em tabelas relacionadas:</p>
        <ul>
          <li><strong>1NF:</strong> valores atômicos, sem grupos repetidos.</li>
          <li><strong>2NF:</strong> sem dependências parciais da chave.</li>
          <li><strong>3NF:</strong> sem dependências transitivas.</li>
        </ul>
        <p>Trade-off: normalizado economiza espaço e evita anomalias de atualização, mas exige muitos JOINs (lento para análise). Por isso OLAP desnormaliza propositalmente.</p>
      `
    },
    {
      id: 'star-schema',
      title: 'Star schema e dimensional modeling',
      body: `
        <p>O padrão dominante em data warehouses:</p>
        <ul>
          <li><strong>Fact table:</strong> eventos mensuráveis (vendas, cliques). Numérica, grande, no centro.</li>
          <li><strong>Dimension tables:</strong> contexto (cliente, produto, tempo, loja). Descritiva, ao redor.</li>
        </ul>
        <p>Star schema = uma fact table cercada por dimensions, formando uma "estrela". Snowflake schema normaliza as dimensions adicionais.</p>
        <p>Para ML: a fact table costuma ser a base do dataset, e as dimensions fornecem features categóricas e atributos.</p>
      `
    },
    {
      id: 'ml-pipelines',
      title: 'Modelagem para pipelines de ML',
      body: `
        <p>Considerações específicas de ML:</p>
        <ul>
          <li><strong>Training-serving skew:</strong> as features no treino devem ser computadas exatamente como no serving. Feature stores resolvem isso.</li>
          <li><strong>Point-in-time correctness:</strong> ao construir o dataset histórico, use apenas dados disponíveis naquele momento, não o estado atual.</li>
          <li><strong>Snapshots vs eventos:</strong> guardar o estado a cada momento (snapshot) vs reconstruir de eventos (event sourcing).</li>
          <li><strong>Feature freshness:</strong> com que frequência as features são atualizadas? Batch diário? Streaming?</li>
        </ul>
        <div class="callout warn">
          <strong>O ERRO CLÁSSICO</strong>
          Treinar com features computadas com o estado ATUAL do banco, mas servir com o estado no momento da predição. O modelo aprende com informação do futuro. Point-in-time correctness é não-negociável.
        </div>
      `
    }
  ],
  whenToUse: [
    'Entender de onde vêm as features',
    'Projetar pipelines de feature engineering',
    'Decidir entre batch e streaming',
    'Garantir consistência treino/serving'
  ],
  whenNot: [
    'Datasets pequenos e estáticos (CSV)',
    'Protótipos exploratórios'
  ],
  metrics: ['Training-serving skew', 'Point-in-time correctness', 'Feature freshness']
};

window.LESSON_CONTENT['unstructured-data'] = {
  id: 'unstructured-data',
  title: 'Dados Não-Estruturados',
  etapa: 9, etapaName: 'Engenharia de ML & Dados',
  time: '60 min',
  tags: ['texto', 'imagens', 'embeddings'],
  tagline: 'Texto, imagens, áudio, 80% dos dados do mundo. Transformá-los em <em>vetores</em> é a ponte para ML.',
  intro: `
    <p>A maior parte dos dados não cabe numa tabela: e-mails, documentos, fotos, áudio, logs. Trabalhar com dados não-estruturados exige técnicas de pré-processamento e, crucialmente, transformá-los em representações vetoriais (embeddings) que modelos conseguem consumir.</p>
  `,
  sections: [
    {
      id: 'texto',
      title: 'Processamento de texto',
      body: `
        <p>Do texto cru à representação numérica:</p>
        <ul>
          <li><strong>Tokenização:</strong> dividir em unidades (palavras, subwords). BPE/WordPiece são o padrão moderno.</li>
          <li><strong>Normalização:</strong> lowercase, remoção de acentos, stemming/lemmatization (clássico).</li>
          <li><strong>Bag-of-Words / TF-IDF:</strong> representação esparsa clássica. Ainda forte como baseline e em SVM.</li>
          <li><strong>Embeddings:</strong> Word2Vec, GloVe (palavra); Sentence-BERT, OpenAI embeddings (frase/documento). Densos, capturam semântica.</li>
        </ul>
        <p>Para ML clássico em texto: TF-IDF + Logistic Regression/SVM é um baseline imbatível. Para tarefas complexas: embeddings de transformers.</p>
      `
    },
    {
      id: 'imagens',
      title: 'Processamento de imagens',
      body: `
        <ul>
          <li><strong>Representação:</strong> imagens são tensores (altura × largura × canais). Normalização por canal é padrão.</li>
          <li><strong>Augmentation:</strong> rotation, flip, crop, color jitter, aumenta dados e regulariza.</li>
          <li><strong>Embeddings:</strong> use CNNs/ViTs pré-treinados (ResNet, CLIP) para extrair vetores de features sem treinar do zero.</li>
          <li><strong>Resolução:</strong> trade-off entre detalhe e custo computacional.</li>
        </ul>
      `
    },
    {
      id: 'embeddings',
      title: 'Embeddings, a representação universal',
      body: `
        <p>Embeddings são vetores densos que capturam semântica. A ideia central: objetos similares ficam próximos no espaço vetorial.</p>
        <ul>
          <li>Texto, imagem, áudio, grafos, tudo vira embedding.</li>
          <li>Permitem busca por similaridade (cosine, dot product).</li>
          <li>Base de retrieval, RAG, recomendação, clustering, deduplicação.</li>
        </ul>
        <p>Operações comuns: similaridade cosseno, nearest neighbors (FAISS, HNSW), clustering no espaço de embedding.</p>
        <pre><code>from sentence_transformers import SentenceTransformer
import numpy as np

model = SentenceTransformer('all-MiniLM-L6-v2')
embeddings = model.encode(documents)  # (n_docs, 384)

# similaridade entre query e documentos
query_emb = model.encode([query])
sims = np.dot(embeddings, query_emb.T).flatten()
top_k = np.argsort(sims)[-5:][::-1]</code></pre>
      `
    },
    {
      id: 'armazenamento',
      title: 'Armazenamento em escala',
      body: `
        <p>Dados não-estruturados são volumosos e exigem infraestrutura adequada:</p>
        <ul>
          <li><strong>Object storage:</strong> S3, GCS, Azure Blob, para arquivos brutos (imagens, áudio, documentos).</li>
          <li><strong>Vector databases:</strong> Pinecone, Weaviate, Qdrant, pgvector, para embeddings com busca por similaridade.</li>
          <li><strong>Data lakes:</strong> formato aberto (Parquet, Delta Lake) para volume + flexibilidade de schema.</li>
          <li><strong>Lakehouse:</strong> combina flexibilidade de lake com performance de warehouse (Databricks, Iceberg).</li>
        </ul>
      `
    }
  ],
  whenToUse: [
    'NLP, visão computacional, áudio',
    'Sistemas de busca e recomendação',
    'RAG e retrieval',
    'Quando 80% dos dados não cabem numa tabela'
  ],
  whenNot: [
    'Dados puramente tabulares',
    'Quando TF-IDF simples resolve (não complique)'
  ],
  metrics: ['Qualidade de embedding (retrieval recall)', 'Custo de armazenamento', 'Latência de busca']
};

window.LESSON_CONTENT['python-dsa'] = {
  id: 'python-dsa',
  title: 'Python & DSA',
  etapa: 9, etapaName: 'Engenharia de ML & Dados',
  time: '90 min',
  tags: ['python', 'algoritmos', 'estruturas de dados'],
  tagline: 'Entrevistas técnicas ainda cobram código. Estruturas de dados e <em>padrões</em> de algoritmo, sem pacotes.',
  intro: `
    <p>Mesmo em posições de ML, a entrevista técnica frequentemente inclui problemas estilo LeetCode, implementar algoritmos com estruturas de dados puras, sem numpy ou pandas. Esta lição cobre as estruturas e os padrões que mais aparecem, com foco no que importa para ML eng (não DP avançada ou grafos complexos).</p>
  `,
  sections: [
    {
      id: 'estruturas',
      title: 'Estruturas de dados fundamentais',
      body: `
        <ul>
          <li><strong>Array/List:</strong> acesso O(1), inserção no fim O(1), no meio O(n).</li>
          <li><strong>Hash Map (dict):</strong> lookup/insert O(1) médio. A estrutura mais usada em entrevistas, memoização, contagem, deduplicação.</li>
          <li><strong>Set:</strong> pertencimento O(1), deduplicação.</li>
          <li><strong>Stack (LIFO):</strong> use list ou deque. Parsing, backtracking, undo.</li>
          <li><strong>Queue (FIFO):</strong> use <code>collections.deque</code>, list.pop(0) é O(n)!</li>
          <li><strong>Heap:</strong> <code>heapq</code>, min-heap. Top-k, priority queue, streaming median.</li>
        </ul>
        <div class="callout tip">
          <strong>DICA PYTHON</strong>
          <code>collections.Counter</code>, <code>defaultdict</code> e <code>deque</code> resolvem 80% dos problemas de entrevista com elegância. Domine-os.
        </div>
      `
    },
    {
      id: 'two-pointers',
      title: 'Padrão: Two Pointers',
      body: `
        <p>Dois índices percorrem a estrutura, frente/trás ou rápido/lento. Resolve problemas de array ordenado em O(n) em vez de O(n²).</p>
        <pre><code># Two Sum em array ordenado
def two_sum_sorted(arr, target):
    left, right = 0, len(arr) - 1
    while left < right:
        s = arr[left] + arr[right]
        if s == target:
            return [left, right]
        elif s < target:
            left += 1
        else:
            right -= 1
    return []</code></pre>
        <p>Casos clássicos: par com soma alvo, remover duplicatas, palindromo, container with most water.</p>
      `
    },
    {
      id: 'sliding-window',
      title: 'Padrão: Sliding Window',
      body: `
        <p>Janela que expande e contrai sobre uma sequência. Resolve subarrays/substrings contíguos em O(n).</p>
        <pre><code># Maior subarray com soma <= k (todos positivos)
def longest_subarray(arr, k):
    left = 0
    cur_sum = 0
    best = 0
    for right in range(len(arr)):
        cur_sum += arr[right]
        while cur_sum > k:
            cur_sum -= arr[left]
            left += 1
        best = max(best, right - left + 1)
    return best</code></pre>
        <p>Casos clássicos: maior substring sem repetição, soma máxima de janela fixa, anagramas em string.</p>
      `
    },
    {
      id: 'bitwise',
      title: 'Padrão: Bit Manipulation / XOR',
      body: `
        <p>Operações bit a bit resolvem problemas com elegância e O(1) de espaço:</p>
        <pre><code># Encontrar o número que aparece uma vez (resto em pares)
# XOR: a^a=0, a^0=a
def single_number(nums):
    result = 0
    for n in nums:
        result ^= n
    return result

# Verificar se é potência de 2
def is_power_of_two(n):
    return n > 0 and (n & (n - 1)) == 0

# Contar bits 1
def count_bits(n):
    count = 0
    while n:
        n &= (n - 1)  # remove o bit 1 menos significativo
        count += 1
    return count</code></pre>
        <p>XOR é favorito de entrevista: encontrar único, trocar sem variável temp, detectar diferenças.</p>
      `
    },
    {
      id: 'complexidade',
      title: 'Análise de complexidade',
      body: `
        <p>Sempre saiba dizer a complexidade de tempo e espaço da sua solução:</p>
        <ul>
          <li><strong>O(1):</strong> tempo constante, hash lookup, operação aritmética.</li>
          <li><strong>O(log n):</strong> busca binária, heap operations.</li>
          <li><strong>O(n):</strong> percorrer uma vez, two pointers, sliding window.</li>
          <li><strong>O(n log n):</strong> sorting, divide-and-conquer.</li>
          <li><strong>O(n²):</strong> nested loops, evite quando possível.</li>
        </ul>
        <p>Em entrevista, sempre proponha a solução brute-force primeiro, depois otimize. Comunique o trade-off tempo vs espaço.</p>
      `
    }
  ],
  whenToUse: [
    'Entrevistas técnicas de ML eng',
    'Otimizar código de pré-processamento',
    'Entender complexidade de algoritmos ML'
  ],
  whenNot: [
    'Produção real, use bibliotecas otimizadas (numpy, pandas)',
    'Não reinvente a roda fora de contexto de entrevista'
  ],
  metrics: ['Complexidade de tempo/espaço', 'Casos de borda cobertos', 'Clareza da solução']
};

window.LESSON_CONTENT['git-testing'] = {
  id: 'git-testing',
  title: 'Git & Testes para ML',
  etapa: 9, etapaName: 'Engenharia de ML & Dados',
  time: '60 min',
  tags: ['git', 'testes', 'DVC', 'versionamento'],
  tagline: 'Código não versionado não existe. Modelo não testado não vai para produção. <em>Disciplina</em> de engenharia em ML.',
  intro: `
    <p>ML não é só notebooks. Para chegar a produção, código, dados e modelos precisam ser versionados, e o pipeline precisa de testes, não só do código, mas dos dados e do próprio modelo. Esta lição cobre as práticas de engenharia que separam um experimento de um sistema.</p>
  `,
  sections: [
    {
      id: 'branching',
      title: 'Git: branching strategies',
      body: `
        <ul>
          <li><strong>GitFlow:</strong> branches main, develop, feature, release, hotfix. Estruturado, bom para releases planejados.</li>
          <li><strong>Trunk-based:</strong> commits frequentes na main, feature flags. Favorece CI/CD contínuo. Tendência moderna.</li>
          <li><strong>PR workflow:</strong> branch por feature → pull request → review → merge. Padrão em times.</li>
        </ul>
        <p>Para ML: cada experimento pode ser um branch; o modelo aprovado é mergeado com tag de versão. Commits atômicos e mensagens descritivas são disciplina básica.</p>
      `
    },
    {
      id: 'dvc',
      title: 'Versionar dados e modelos: DVC',
      body: `
        <p>Git é feito para código, não para arquivos de GB. <strong>DVC (Data Version Control)</strong> versiona dados e modelos:</p>
        <ul>
          <li>Guarda os dados em storage (S3, GCS) e só ponteiros no Git.</li>
          <li><code>dvc add data/train.csv</code> → cria um .dvc file versionável.</li>
          <li>Reprodutibilidade: cada commit aponta para a versão exata dos dados.</li>
          <li>Pipelines: <code>dvc repro</code> reexecuta etapas cujas dependências mudaram.</li>
        </ul>
        <p>Alternativas: Git LFS (mais simples, menos features), MLflow artifacts, lakeFS.</p>
        <div class="callout tip">
          <strong>REPRODUTIBILIDADE</strong>
          Um experimento de ML reproduzível precisa de: código (Git) + dados (DVC) + ambiente (Docker/requirements) + seed fixo + hiperparâmetros (config versionado).
        </div>
      `
    },
    {
      id: 'testes-codigo',
      title: 'Testes de código',
      body: `
        <p>Funções de transformação de dados e features precisam de unit tests como qualquer software:</p>
        <pre><code>import pytest
import pandas as pd
from features import add_recency_feature

def test_recency_feature():
    df = pd.DataFrame({
        "user_id": [1, 1],
        "order_date": pd.to_datetime(["2024-01-01", "2024-01-10"]),
    })
    result = add_recency_feature(df, ref_date="2024-01-15")
    assert result["days_since_last"].iloc[0] == 5
    assert "days_since_last" in result.columns

def test_handles_empty():
    df = pd.DataFrame(columns=["user_id", "order_date"])
    result = add_recency_feature(df, ref_date="2024-01-15")
    assert len(result) == 0</code></pre>
        <p>Cubra: caso normal, casos de borda (vazio, NaN, valores extremos), e invariantes (output shape, colunas esperadas).</p>
      `
    },
    {
      id: 'testes-dados',
      title: 'Testes de dados: data validation',
      body: `
        <p>Dados mudam silenciosamente. <strong>Data validation</strong> testa propriedades dos dados em si:</p>
        <ul>
          <li><strong>Schema:</strong> colunas esperadas, tipos corretos.</li>
          <li><strong>Ranges:</strong> idade entre 0-120, probabilidade entre 0-1.</li>
          <li><strong>Distribuições:</strong> a distribuição mudou em relação ao treino? (drift)</li>
          <li><strong>Completude:</strong> taxa de nulos dentro do esperado.</li>
          <li><strong>Unicidade:</strong> chaves únicas, sem duplicatas.</li>
        </ul>
        <p>Ferramentas: <strong>Great Expectations</strong>, <strong>Pandera</strong>, <strong>pydantic</strong>. Rodam no pipeline e falham cedo se os dados estão errados.</p>
      `
    },
    {
      id: 'testes-modelo',
      title: 'Testes de modelo',
      body: `
        <p>Além de métricas agregadas, teste comportamentos específicos:</p>
        <ul>
          <li><strong>Performance mínima:</strong> modelo novo deve bater baseline.</li>
          <li><strong>Behavioral tests:</strong> invariância (mudar nome não muda predição de spam), direcional (aumentar renda aumenta score de crédito).</li>
          <li><strong>Slices:</strong> performance aceitável em subgrupos (não só global).</li>
          <li><strong>Bias/fairness:</strong> métricas equilibradas entre grupos demográficos.</li>
          <li><strong>Regressão:</strong> modelo novo não piora casos que o antigo acertava.</li>
        </ul>
        <p>Inspirado no paper "Beyond Accuracy: Behavioral Testing of NLP Models" (CheckList).</p>
      `
    }
  ],
  whenToUse: [
    'Qualquer projeto ML que vá além de notebook',
    'Times colaborando em código',
    'Pipelines de produção',
    'Quando reprodutibilidade importa'
  ],
  whenNot: [
    'Exploração descartável de uma vez',
    'Não over-engineer um protótipo de 1 dia'
  ],
  metrics: ['Cobertura de testes', 'Reprodutibilidade', 'Data validation pass rate']
};
