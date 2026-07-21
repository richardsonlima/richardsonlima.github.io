/* Lesson content, Etapas 01, 02, 03 (lições 01–12)
   Schema:
   {
     id, title, etapa, etapaName, time, tagline, intro,
     tags: [],
     sections: [{ id, title, body }],
     whenToUse: [], whenNot: [], metrics: [],
     construction?: 'mensagem opcional'
   }
*/
window.LESSON_CONTENT = window.LESSON_CONTENT || {};

/* ═══════════════════════════════════════════════════════════════
   ETAPA 01, BASE MATEMÁTICA
   ═══════════════════════════════════════════════════════════════ */

window.LESSON_CONTENT['linear-reg'] = {
  id: 'linear-reg',
  title: 'Linear Regression',
  etapa: 1, etapaName: 'Base matemática',
  time: '90 min',
  tags: ['regressão', 'paramétrico', 'interpretável'],
  tagline: 'O modelo mais antigo e fundamental do machine learning. Tudo o que vem depois é, de algum jeito, uma <em>variação</em> dele.',
  intro: `
    <p>Antes de aprender XGBoost, Transformer ou qualquer arquitetura exótica, você precisa <strong>internalizar regressão linear</strong>. Não porque vai usar muito (vai usar pouco em produção), mas porque toda a gramática do ML mora aqui: variável dependente, função custo, gradient descent, overfitting, regularização, interpretabilidade.</p>
    <p>Se você entende cada peça desta lição, está pronto para 70% das perguntas técnicas de uma entrevista sênior.</p>
  `,
  sections: [
    {
      id: 'intuicao',
      title: 'Intuição geométrica',
      body: `
        <p>Imagine que você tem um <em>scatter plot</em> de horas estudadas vs nota da prova. Regressão linear busca a melhor reta, em 1D, ou o melhor hiperplano, em mais dimensões, que minimiza a distância vertical (no eixo do target) até os pontos.</p>
        <p>A função aprendida é:</p>
        <div class="math">f(x) = β₀ + β₁x₁ + β₂x₂ + … + βₙxₙ</div>
        <p>Os coeficientes <code>βᵢ</code> são o que o modelo aprende. <code>β₀</code> é o intercepto (onde a reta cruza o eixo y), e cada <code>βᵢ</code> diz <strong>quanto y muda quando xᵢ aumenta em uma unidade</strong>, mantendo o resto constante. Essa última frase é o motivo da regressão linear ser tão interpretável.</p>
      `
    },
    {
      id: 'funcao-custo',
      title: 'Função custo: por que MSE?',
      body: `
        <p>Para "aprender" os coeficientes, precisamos definir o que é "erro". O padrão é a soma dos quadrados dos resíduos:</p>
        <div class="math">MSE(β) = (1/n) Σ (yᵢ − ŷᵢ)²</div>
        <p>Por que <em>ao quadrado</em> e não valor absoluto?</p>
        <ul>
          <li><strong>Diferenciabilidade:</strong> a parábola tem derivada suave em todo ponto, o que torna a otimização (gradient descent ou solução fechada) viável.</li>
          <li><strong>Penalização de erros grandes:</strong> um erro de 10 vale 100, não 10. Isso força o modelo a focar em outliers, para o bem ou para o mal.</li>
          <li><strong>Conexão estatística:</strong> minimizar MSE equivale a maximizar a verossimilhança assumindo erros gaussianos. Não é coincidência, é teoria sólida.</li>
        </ul>
        <div class="callout warn">
          <strong>PEGADINHA</strong>
          O quadrado significa que <strong>outliers dominam o modelo</strong>. Se 1% dos seus dados são erros de digitação extremos, eles vão "puxar" a reta. Considere Huber loss ou remover outliers antes.
        </div>
      `
    },
    {
      id: 'solucao-fechada',
      title: 'Equação normal vs gradient descent',
      body: `
        <p>Existem duas formas de encontrar os coeficientes ótimos:</p>
        <p><strong>1. Solução fechada (equação normal):</strong> matemática pura, derivando o MSE e igualando a zero.</p>
        <div class="math">β = (XᵀX)⁻¹ Xᵀy</div>
        <p>Funciona quando o dataset é pequeno e a matriz <code>XᵀX</code> é invertível. Custo: O(n·d²) + O(d³) pela inversão.</p>
        <p><strong>2. Gradient descent:</strong> iterativo. Começa com β aleatório e atualiza na direção oposta ao gradiente do MSE.</p>
        <div class="math">β ← β − η · ∇MSE(β)</div>
        <p>Funciona em qualquer escala (basta usar mini-batches). É como o resto do deep learning treina. A escolha do <code>η</code> (learning rate) é crítica, alto demais diverge, baixo demais não converge.</p>
        <div class="callout tip">
          <strong>DICA</strong>
          Equação normal é didática. Em produção, use SGD ou solvers especializados (LBFGS, etc.), escalam melhor e suportam regularização.
        </div>
      `
    },
    {
      id: 'hipoteses',
      title: 'Hipóteses estatísticas',
      body: `
        <p>Para a inferência (p-valores, intervalos de confiança) ser válida, regressão linear assume:</p>
        <ol>
          <li><strong>Linearidade:</strong> a relação entre X e y é, de fato, linear nos parâmetros. Você pode transformar features (log, polinomial), mas o modelo é linear no espaço transformado.</li>
          <li><strong>Independência:</strong> as observações são independentes entre si. Time series violam isso de cara.</li>
          <li><strong>Homocedasticidade:</strong> a variância dos resíduos é constante. Se erra mais em valores altos do que baixos, você tem heterocedasticidade, use modelos robustos ou transformações.</li>
          <li><strong>Normalidade dos resíduos:</strong> necessária para intervalos de confiança, não para a estimativa pontual.</li>
          <li><strong>Sem multicolinearidade severa:</strong> features muito correlacionadas tornam <code>XᵀX</code> quase singular e desestabilizam os coeficientes.</li>
        </ol>
        <p>Para predição pura (você só quer prever, não explicar), só as duas primeiras importam de verdade. As outras viram problemas se você quiser fazer inferência estatística sobre o modelo.</p>
      `
    },
    {
      id: 'pratica',
      title: 'Na prática, sklearn',
      body: `
        <p>O código mais comum que você vai escrever:</p>
        <pre><code>from sklearn.linear_model import LinearRegression
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_squared_error, r2_score
import numpy as np

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

model = LinearRegression()
model.fit(X_train, y_train)

y_pred = model.predict(X_test)
print("RMSE:", np.sqrt(mean_squared_error(y_test, y_pred)))
print("R²:  ", r2_score(y_test, y_pred))
print("Coefs:", dict(zip(feature_names, model.coef_)))</code></pre>
        <p>Coisas que NÃO aparecem no código mas devem estar na sua cabeça:</p>
        <ul>
          <li>Sempre faça <strong>train/test split antes</strong> de qualquer pré-processamento que dependa dos dados (escala, imputação).</li>
          <li>R² isolado mente, sempre olhe RMSE/MAE também, em unidades do target.</li>
          <li>Se as features têm escalas diferentes (idade em anos vs renda em reais), a magnitude dos coeficientes não é comparável. Padronize antes se quiser comparar.</li>
        </ul>
      `
    }
  ],
  whenToUse: [
    'Relação aproximadamente linear entre features e target',
    'Necessidade de interpretar coeficientes (compliance, ciência)',
    'Baseline rápido para qualquer problema de regressão',
    'Dataset pequeno/médio'
  ],
  whenNot: [
    'Relações fortemente não-lineares (use árvores, GBM, redes)',
    'Multicolinearidade severa (use Ridge/Lasso)',
    'Muitos outliers extremos (use Huber regressor)',
    'Heterocedasticidade severa nos resíduos'
  ],
  metrics: ['RMSE', 'MAE', 'R²', 'MAPE', 'p-valores (inferência)']
};

window.LESSON_CONTENT['logistic-reg'] = {
  id: 'logistic-reg',
  title: 'Logistic Regression',
  etapa: 1, etapaName: 'Base matemática',
  time: '75 min',
  tags: ['classificação', 'paramétrico', 'probabilístico'],
  tagline: 'O baseline obrigatório de toda classificação. <em>Não</em> é regressão, apesar do nome. Modela probabilidade.',
  intro: `
    <p>Logistic regression é classificação disfarçada de regressão. O nome confunde até gente experiente. A ideia: pegar uma combinação linear (igual à regressão linear) e passar por uma função que comprime para o intervalo (0, 1), interpretando o resultado como probabilidade.</p>
    <p>É o modelo de classificação mais usado em <strong>risk scoring</strong> (crédito, fraude, churn) e em situações regulatórias onde você precisa explicar cada coeficiente, o que árvores e redes neurais não permitem trivialmente.</p>
  `,
  sections: [
    {
      id: 'sigmoide',
      title: 'A função sigmoide',
      body: `
        <p>O coração do modelo é a função sigmoide (logística):</p>
        <div class="math">σ(z) = 1 / (1 + e^−z)</div>
        <p>Ela mapeia qualquer número real para o intervalo (0, 1). Para z muito negativo, σ → 0. Para z muito positivo, σ → 1. No meio, em z = 0, σ = 0.5, a fronteira de decisão.</p>
        <p>A combinação completa é:</p>
        <div class="math">P(y = 1 | x) = σ(βᵀx + β₀) = 1 / (1 + e^−(βᵀx + β₀))</div>
        <p>Os coeficientes β agora ficam no espaço do logit (log-odds), não em unidades do target diretamente. Isso muda como você interpreta, voltamos a isso adiante.</p>
      `
    },
    {
      id: 'log-loss',
      title: 'Log-loss: por que não MSE?',
      body: `
        <p>MSE em classificação dá péssimos gradientes e tem múltiplos mínimos locais. Para classificação binária, o custo correto é a <strong>log-loss</strong> (também chamada de cross-entropy binária):</p>
        <div class="math">L = −(1/n) Σ [yᵢ log(p̂ᵢ) + (1 − yᵢ) log(1 − p̂ᵢ)]</div>
        <p>Lendo isso devagar: para cada exemplo, se o rótulo verdadeiro é 1, penalizamos por <code>−log(p̂)</code>, bem alto quando p̂ é próximo de 0 (o modelo errou feio com confiança). Se o rótulo é 0, penalizamos por <code>−log(1 − p̂)</code>.</p>
        <div class="callout">
          <strong>POR QUÊ?</strong>
          Log-loss é convexa (um único mínimo global), derivada simples, e equivale à máxima verossimilhança sob Bernoulli. É a escolha matematicamente "natural" para classificação binária.
        </div>
      `
    },
    {
      id: 'odds-ratio',
      title: 'Interpretação: odds ratio',
      body: `
        <p>Cada coeficiente βᵢ tem uma interpretação precisa: <code>exp(βᵢ)</code> é o <strong>odds ratio</strong> associado a aumentar xᵢ em uma unidade.</p>
        <p>Exemplo: se você modela "probabilidade de inadimplência" e o coeficiente de "tem cartão de crédito ativo" é <code>0.7</code>, então <code>exp(0.7) ≈ 2.01</code>, ter cartão ativo dobra as chances (odds) de inadimplir, holding tudo constante.</p>
        <ul>
          <li><code>exp(β) > 1</code>: feature aumenta as chances do evento.</li>
          <li><code>exp(β) = 1</code>: feature não afeta.</li>
          <li><code>exp(β) < 1</code>: feature diminui as chances.</li>
        </ul>
        <p>Esse é o motivo pelo qual reguladores brasileiros e europeus <em>amam</em> logistic regression: cada decisão pode ser auditada coeficiente por coeficiente.</p>
      `
    },
    {
      id: 'multiclasse',
      title: 'Além do binário: multiclasse',
      body: `
        <p>Para mais de duas classes, há dois caminhos:</p>
        <ul>
          <li><strong>One-vs-Rest:</strong> treina K modelos binários, um por classe. Cada um pergunta "é esta classe ou não?". Na inferência, escolhe a classe com maior P. Simples, funciona, mas as probabilidades não somam 1 sem normalização.</li>
          <li><strong>Softmax (multinomial logistic regression):</strong> generaliza a sigmoide. Cada classe tem seu próprio vetor de pesos. As probabilidades somam 1 nativamente.</li>
        </ul>
        <div class="math">P(y = k | x) = e^(βₖᵀx) / Σⱼ e^(βⱼᵀx)</div>
        <p>É exatamente o que sai da última camada de uma rede neural para classificação. Logistic regression é literalmente uma rede neural sem camadas escondidas.</p>
      `
    },
    {
      id: 'regularizacao',
      title: 'Regularização: L1 e L2',
      body: `
        <p>Logistic regression aceita os mesmos regularizadores que linear: penalização L1 (Lasso, induz esparsidade) e L2 (Ridge, encolhe). Em sklearn:</p>
        <pre><code>from sklearn.linear_model import LogisticRegression
from sklearn.preprocessing import StandardScaler

# Sempre padronize quando usar regularização!
scaler = StandardScaler()
X_train_s = scaler.fit_transform(X_train)

model = LogisticRegression(
    penalty='l2',       # ou 'l1', 'elasticnet'
    C=1.0,              # inverso de λ, menor C = mais regularização
    solver='lbfgs',     # 'saga' suporta L1 e ElasticNet
    max_iter=1000,
    class_weight='balanced'  # útil em classes desbalanceadas
)
model.fit(X_train_s, y_train)</code></pre>
        <div class="callout warn">
          <strong>CUIDADO</strong>
          Em sklearn, <code>C</code> é o <em>inverso</em> de λ. C=0.01 é regularização forte, C=100 é fraca. Lembre-se disso na hora de fazer grid search.
        </div>
      `
    }
  ],
  whenToUse: [
    'Baseline de qualquer classificação',
    'Quando probabilidades calibradas são necessárias',
    'Risk scoring (crédito, fraude) e contextos regulados',
    'Quando interpretabilidade dos coeficientes é prioridade',
    'Datasets de qualquer tamanho, escala muito bem'
  ],
  whenNot: [
    'Fronteira de decisão fortemente não-linear sem feature engineering',
    'Quando classes são perfeitamente separáveis (coeficientes vão para ∞)',
    'Muitas interações entre features (use árvores)'
  ],
  metrics: ['AUC-ROC', 'Precision', 'Recall', 'F1', 'log-loss', 'Brier score']
};

window.LESSON_CONTENT['metrics'] = {
  id: 'metrics',
  title: 'Métricas',
  etapa: 1, etapaName: 'Base matemática',
  time: '60 min',
  tags: ['avaliação', 'regressão', 'classificação'],
  tagline: 'Modelo bom é modelo medido <em>corretamente</em>. Escolher a métrica errada é o erro mais caro do ML.',
  intro: `
    <p>Toda decisão técnica em ML, qual modelo usar, qual feature manter, quando parar de tunar, passa por métricas. Se você usa a métrica errada, otimiza para a coisa errada. Esta lição te dá o catálogo das métricas que importam, quando usar cada uma, e os erros mais comuns.</p>
  `,
  sections: [
    {
      id: 'regressao',
      title: 'Métricas de regressão',
      body: `
        <ul>
          <li><strong>MSE (Mean Squared Error):</strong> média dos erros ao quadrado. Penaliza outliers muito. Não está na unidade do target.</li>
          <li><strong>RMSE (Root MSE):</strong> raiz quadrada do MSE. <em>Está</em> na unidade do target. Default para report.</li>
          <li><strong>MAE (Mean Absolute Error):</strong> média do erro absoluto. Robusta a outliers. Mais "humana", diz literalmente quanto erra em média.</li>
          <li><strong>MAPE (Mean Absolute Percentage Error):</strong> erro percentual. Útil quando a magnitude varia muito (preços de R$ 10 e R$ 10.000). Mas explode com valores próximos de zero.</li>
          <li><strong>R²:</strong> proporção de variância explicada. 1.0 é perfeito, 0 é "tão bom quanto chutar a média". <strong>Pode ser negativo</strong> se o modelo for pior que a média, não é "ao quadrado".</li>
        </ul>
        <div class="callout warn">
          <strong>ARMADILHA</strong>
          R² alto não significa modelo bom. Pode estar overfittando ou prevendo média com baixa variância. Sempre veja RMSE/MAE em unidades reais.
        </div>
      `
    },
    {
      id: 'matriz-confusao',
      title: 'A matriz de confusão é o ponto de partida',
      body: `
        <p>Toda métrica de classificação binária deriva de quatro números:</p>
        <ul>
          <li><strong>TP (True Positive):</strong> previu positivo, era positivo.</li>
          <li><strong>FP (False Positive):</strong> previu positivo, era negativo. ("alarme falso")</li>
          <li><strong>TN (True Negative):</strong> previu negativo, era negativo.</li>
          <li><strong>FN (False Negative):</strong> previu negativo, era positivo. ("deixou passar")</li>
        </ul>
        <p>A partir daí:</p>
        <div class="math">Accuracy = (TP + TN) / total</div>
        <div class="math">Precision = TP / (TP + FP), dos que previ positivo, quantos são?</div>
        <div class="math">Recall    = TP / (TP + FN), dos positivos reais, quantos peguei?</div>
        <div class="math">F1 = 2 · (P · R) / (P + R), média harmônica de P e R</div>
      `
    },
    {
      id: 'qual-usar',
      title: 'Qual usar quando',
      body: `
        <p>A resposta sempre depende do <em>custo do erro</em> no seu domínio:</p>
        <ul>
          <li><strong>Fraude:</strong> FN custa muito (perdeu fraude). Priorize Recall.</li>
          <li><strong>Spam:</strong> FP custa muito (email importante na lixeira). Priorize Precision.</li>
          <li><strong>Diagnóstico médico de doença rara:</strong> Recall altíssimo, depois investiga.</li>
          <li><strong>Classes desbalanceadas (1% positivos):</strong> Accuracy mente, modelo que sempre diz "negativo" tem 99% accuracy. Use F1, PR-AUC ou Recall com Precision fixo.</li>
          <li><strong>Quando você não sabe o threshold:</strong> AUC-ROC mede a capacidade de ranquear positivos acima de negativos, independente do threshold.</li>
        </ul>
        <div class="callout tip">
          <strong>FRAMEWORK</strong>
          Pergunte-se: "se o modelo errar do jeito X, o que acontece com o negócio?" A métrica que captura esse custo é a sua.
        </div>
      `
    },
    {
      id: 'roc-pr',
      title: 'ROC vs Precision-Recall curve',
      body: `
        <p>Ambas curvas variam o threshold e plotam dois trade-offs:</p>
        <ul>
          <li><strong>ROC:</strong> TPR (Recall) vs FPR. AUC mede probabilidade de ranquear um positivo acima de um negativo aleatórios.</li>
          <li><strong>PR-curve:</strong> Precision vs Recall. AUC-PR é mais informativa em datasets desbalanceados, onde ROC pode parecer otimista.</li>
        </ul>
        <p>Em datasets com 1% de positivos, AUC-ROC de 0.9 pode esconder Precision de 5%. Sempre olhe a PR-curve quando classes são desbalanceadas.</p>
      `
    },
    {
      id: 'calibracao',
      title: 'Calibração, a métrica esquecida',
      body: `
        <p>Um modelo pode ter AUC alto e <em>ainda assim</em> dar probabilidades inúteis. Se você precisa que P(y=1) = 0.7 signifique "tem 70% de chance", você precisa de um modelo <strong>calibrado</strong>.</p>
        <ul>
          <li><strong>Brier score:</strong> MSE entre p̂ e y. Quanto menor, melhor.</li>
          <li><strong>Calibration plot:</strong> divide as predições em bins e plota P̄ predita vs frequência real. Diagonal = perfeito.</li>
          <li><strong>Como calibrar:</strong> Platt scaling (sigmoide pós-hoc) ou Isotonic regression (mais flexível).</li>
        </ul>
        <p>Random Forest e SVMs são notórios por serem mal-calibrados. Logistic regression e Naive Bayes (apesar do "Naive") tendem a ser melhor.</p>
      `
    }
  ],
  whenToUse: [
    'Sempre, métricas são parte do design de qualquer modelo',
    'Para escolher entre algoritmos comparáveis',
    'Para tunar threshold de decisão em classificação',
    'Para detectar overfitting (gap train vs val)'
  ],
  whenNot: [
    'N/A, métricas não são opcionais',
    'Não confie em uma métrica única, sempre olhe 2-3'
  ],
  metrics: ['Depende da tarefa, esta lição cobre o catálogo']
};

window.LESSON_CONTENT['overfitting'] = {
  id: 'overfitting',
  title: 'Overfitting & Bias-Variance',
  etapa: 1, etapaName: 'Base matemática',
  time: '60 min',
  tags: ['fundamento', 'diagnóstico', 'generalização'],
  tagline: 'O problema central do ML não é treinar, é <em>generalizar</em>. Tudo gira em torno de bias vs variance.',
  intro: `
    <p>Treinar um modelo é fácil: aumenta a capacidade até o erro no treino chegar a zero. O problema é que esse modelo provavelmente é inútil em dados novos. Esta lição te dá o vocabulário e os diagnósticos para falar sobre <strong>generalização</strong>, a única coisa que importa em produção.</p>
  `,
  sections: [
    {
      id: 'definicao',
      title: 'O que é overfitting',
      body: `
        <p>Overfitting é quando o modelo <strong>decora</strong> o ruído do conjunto de treino em vez de aprender o padrão. Sintoma:</p>
        <ul>
          <li>Erro baixo no treino.</li>
          <li>Erro alto na validação.</li>
          <li>Gap grande entre os dois.</li>
        </ul>
        <p>Underfitting é o oposto, modelo simples demais, erra muito em ambos.</p>
        <p>O ponto ótimo está no meio: erro de treino e validação próximos, ambos razoáveis. A jornada de ajuste do modelo é essencialmente <em>navegar</em> entre esses dois extremos.</p>
      `
    },
    {
      id: 'bias-variance',
      title: 'A decomposição bias-variance',
      body: `
        <p>O erro esperado de um modelo pode ser decomposto matematicamente em três componentes:</p>
        <div class="math">E[(y − ŷ)²] = Bias² + Variance + Noise irredutível</div>
        <ul>
          <li><strong>Bias:</strong> erro por assumir uma forma funcional errada. Modelos simples (regressão linear num problema curvo) têm bias alto. Cresce com a restrição do modelo.</li>
          <li><strong>Variance:</strong> sensibilidade do modelo a variações no dataset de treino. Modelos muito flexíveis (árvore profunda, KNN com k=1) têm variance alta. Cresce com a flexibilidade.</li>
          <li><strong>Noise:</strong> aleatoriedade intrínseca ao problema. Não dá pra reduzir, só estimar.</li>
        </ul>
        <p>Bias e variance trocam: reduzir um aumenta o outro. <strong>Encontrar o equilíbrio é o jogo.</strong> Ensembles (como Random Forest) reduzem variance sem aumentar muito bias, por isso funcionam.</p>
      `
    },
    {
      id: 'diagnostico',
      title: 'Diagnóstico: learning curves',
      body: `
        <p>A ferramenta mais útil para diagnosticar bias vs variance é a <strong>learning curve</strong>: plot do erro de treino e validação em função do tamanho do dataset.</p>
        <ul>
          <li><strong>Ambas as curvas planas em erro alto:</strong> bias alto (underfitting). Modelo simples demais. Solução: aumentar capacidade, mais features, modelo mais complexo, menos regularização.</li>
          <li><strong>Treino com erro baixo, validação com erro alto, gap grande:</strong> variance alta (overfitting). Solução: mais dados, mais regularização, menos features, modelo mais simples.</li>
          <li><strong>Ambas convergem com erro razoável:</strong> good fit. Mantenha.</li>
          <li><strong>Ambas ainda caindo:</strong> mais dados ajudariam.</li>
        </ul>
        <pre><code>from sklearn.model_selection import learning_curve

train_sizes, train_scores, val_scores = learning_curve(
    model, X, y, cv=5,
    train_sizes=np.linspace(0.1, 1.0, 10),
    scoring='neg_mean_squared_error'
)</code></pre>
      `
    },
    {
      id: 'cross-validation',
      title: 'Validação cruzada, por que é não-negociável',
      body: `
        <p>Um único split train/test te dá uma estimativa <em>ruidosa</em> da performance. Pode ter dado bom por sorte. Cross-validation reduz essa variância dividindo os dados em k folds:</p>
        <ol>
          <li>Divida os dados em k partes iguais.</li>
          <li>Para cada fold i: treine em k−1 partes, valide na i-ésima.</li>
          <li>Métrica final = média das k validações.</li>
        </ol>
        <p>Padrão: <strong>k = 5</strong>. Variantes:</p>
        <ul>
          <li><strong>Stratified k-fold:</strong> mantém a proporção das classes em cada fold. Obrigatório em classificação desbalanceada.</li>
          <li><strong>Group k-fold:</strong> garante que amostras do mesmo grupo (mesmo paciente, mesma loja) ficam todas no mesmo fold. Crítico para evitar leakage.</li>
          <li><strong>TimeSeriesSplit:</strong> respeita ordem temporal, só treina em passado, valida em futuro.</li>
        </ul>
        <div class="callout warn">
          <strong>NUNCA</strong>
          Use k-fold simples em séries temporais. Você estará treinando no futuro e validando no passado, leakage perfeito.
        </div>
      `
    },
    {
      id: 'combate',
      title: 'Como combater overfitting',
      body: `
        <p>O arsenal disponível, do mais barato para o mais caro:</p>
        <ul>
          <li><strong>Mais dados.</strong> A solução que sempre funciona, se você tiver acesso. Aumentação de dados (data augmentation) em imagens é uma versão barata.</li>
          <li><strong>Regularização.</strong> L1, L2, ElasticNet, dropout (em redes), pruning (em árvores). Penaliza complexidade explicitamente.</li>
          <li><strong>Early stopping.</strong> Em modelos iterativos (gradient boosting, redes neurais), pare o treino quando a métrica de validação para de melhorar.</li>
          <li><strong>Menos capacidade.</strong> max_depth menor em árvores, menos features, menos camadas em redes.</li>
          <li><strong>Ensembles.</strong> Bagging (Random Forest) reduz variance dramaticamente.</li>
          <li><strong>Feature engineering melhor.</strong> Features mais informativas → menos capacidade necessária.</li>
        </ul>
      `
    }
  ],
  whenToUse: ['Sempre, todo modelo precisa ser validado', 'Em qualquer escolha de hiperparâmetros', 'Antes de qualquer "está pronto para produção"'],
  whenNot: ['Quando você está validando em dados que vazaram do treino, corrija o pipeline primeiro'],
  metrics: ['Train vs Val gap', 'Learning curves', 'CV stddev (estabilidade)']
};

window.LESSON_CONTENT['regularization'] = {
  id: 'regularization',
  title: 'Regularização L1/L2',
  etapa: 1, etapaName: 'Base matemática',
  time: '60 min',
  tags: ['regularização', 'L1', 'L2', 'geometria'],
  tagline: 'Penalizar complexidade é a forma mais barata de generalizar. <em>Geometria</em> explica por que L1 zera e L2 não.',
  intro: `
    <p>Regularização é o ato de adicionar uma penalidade à função custo para desencorajar coeficientes grandes. Duas formas dominam: L1 (Lasso) e L2 (Ridge). Apesar de matematicamente parecidas, diferem só num expoente, seus efeitos práticos são radicalmente diferentes. Esta lição é sobre por quê.</p>
  `,
  sections: [
    {
      id: 'l2-ridge',
      title: 'L2 (Ridge): encolhimento suave',
      body: `
        <p>A penalização L2 adiciona à função custo a soma dos quadrados dos coeficientes:</p>
        <div class="math">L = MSE + λ · Σ βᵢ²</div>
        <p>O efeito: coeficientes grandes são <em>muito</em> penalizados (devido ao quadrado). O modelo encolhe todos os coeficientes em direção a zero, proporcionalmente. Mas <strong>nenhum chega exatamente a zero</strong>.</p>
        <p>Solução fechada (mesma do MSE, com um termo extra):</p>
        <div class="math">β = (XᵀX + λI)⁻¹ Xᵀy</div>
        <p>O <code>λI</code> resolve o problema de multicolinearidade, torna <code>XᵀX</code> sempre invertível. Por isso Ridge é a primeira escolha quando você tem features correlacionadas.</p>
      `
    },
    {
      id: 'l1-lasso',
      title: 'L1 (Lasso): seleção automática',
      body: `
        <p>L1 usa o valor absoluto:</p>
        <div class="math">L = MSE + λ · Σ |βᵢ|</div>
        <p>Não há solução fechada, coordinate descent ou LARS resolvem iterativamente. Mas o efeito prático é mágico: <strong>coeficientes irrelevantes vão a zero</strong>. Lasso faz seleção de features automaticamente.</p>
        <p>Trade-off: com features fortemente correlacionadas, Lasso escolhe <em>uma arbitrariamente</em> e zera as outras. É instável nesse cenário.</p>
      `
    },
    {
      id: 'geometria',
      title: 'A geometria explica tudo',
      body: `
        <p>A pergunta clássica de entrevista: <em>"por que L1 zera coeficientes e L2 não?"</em></p>
        <p>Imagine que você está procurando o ponto que minimiza o MSE (contornos elípticos no espaço dos coeficientes) sujeito a uma restrição de "tamanho" dos coeficientes:</p>
        <ul>
          <li>L2 restringe a um <strong>círculo</strong> (em 2D) ou esfera. Bordas suaves. O ponto de tangência entre a elipse do MSE e o círculo da restrição quase nunca cai nos eixos.</li>
          <li>L1 restringe a um <strong>losango</strong>. Tem cantos exatamente nos eixos. O ponto de tangência tem altíssima probabilidade de cair num canto, ou seja, num eixo, o que significa que a outra coordenada é zero.</li>
        </ul>
        <p>É essa geometria, cantos vs sem cantos, que produz a esparsidade do Lasso.</p>
      `
    },
    {
      id: 'elasticnet',
      title: 'ElasticNet: o melhor dos dois mundos',
      body: `
        <p>ElasticNet combina L1 e L2:</p>
        <div class="math">L = MSE + λ₁ · Σ |βᵢ| + λ₂ · Σ βᵢ²</div>
        <p>O componente L1 induz esparsidade; o L2 estabiliza com features correlacionadas. É o que você quer quando tem high-dimensional data (genômica, fMRI, dados químicos).</p>
        <p>Em sklearn, <code>ElasticNet(l1_ratio=0.5, alpha=1.0)</code>, <code>l1_ratio</code> é o peso de L1 vs L2 (0 = Ridge puro, 1 = Lasso puro).</p>
      `
    },
    {
      id: 'pratica',
      title: 'Na prática: tuning de λ',
      body: `
        <p>A escolha de λ é o único hiperparâmetro real. <code>GridSearchCV</code> ou <code>LassoCV</code>/<code>RidgeCV</code> resolvem:</p>
        <pre><code>from sklearn.linear_model import RidgeCV, LassoCV, ElasticNetCV
from sklearn.preprocessing import StandardScaler
import numpy as np

# Padronização é OBRIGATÓRIA, sem ela, λ pune features de escalas diferentes desigualmente
X_s = StandardScaler().fit_transform(X)

# Ridge: testa 100 valores de alpha em escala log
ridge = RidgeCV(alphas=np.logspace(-3, 3, 100), cv=5)
ridge.fit(X_s, y)
print("λ ótimo:", ridge.alpha_)
print("R² CV:", ridge.score(X_s, y))</code></pre>
        <div class="callout warn">
          <strong>SEM SCALING, SEM REGULARIZAÇÃO</strong>
          Se idade está em [0, 100] e renda em [0, 1.000.000], λ penaliza o coeficiente da renda muito mais. <strong>Sempre</strong> padronize antes.
        </div>
      `
    }
  ],
  whenToUse: [
    'Sempre que houver risco de overfitting (basicamente sempre)',
    'Ridge: features correlacionadas, quer manter todas',
    'Lasso: muitas features, suspeita que muitas são irrelevantes',
    'ElasticNet: high-dimensional com correlações'
  ],
  whenNot: [
    'Em árvores e ensembles de árvores, eles têm seus próprios mecanismos (pruning, max_depth)',
    'Quando há poucos dados e poucas features (regularização é desnecessária)'
  ],
  metrics: ['CV score em função de λ', 'Número de coeficientes não-zero (Lasso)']
};

/* ═══════════════════════════════════════════════════════════════
   ETAPA 02, ÁRVORES & ENSEMBLES
   ═══════════════════════════════════════════════════════════════ */

window.LESSON_CONTENT['decision-tree'] = {
  id: 'decision-tree',
  title: 'Decision Trees',
  etapa: 2, etapaName: 'Árvores & ensembles',
  time: '60 min',
  tags: ['árvore', 'não-paramétrico', 'interpretável'],
  tagline: 'Glass box absoluto. Sozinha rara funciona bem, em <em>ensembles</em>, domina o mundo tabular.',
  intro: `
    <p>Decision Trees são o building block de Random Forest, Gradient Boosting, XGBoost, toda a família que domina ML tabular. Entender uma árvore single tree é pré-requisito para entender qualquer ensemble.</p>
    <p>São também as únicas estruturas verdadeiramente interpretáveis em ML moderno: você lê a árvore como regras "se feature X > t, então...".</p>
  `,
  sections: [
    {
      id: 'como-funciona',
      title: 'Como uma árvore aprende',
      body: `
        <p>O algoritmo, simplificado:</p>
        <ol>
          <li>Em cada nó, considere todas as features e todos os possíveis pontos de split.</li>
          <li>Escolha o split que <strong>maximiza a redução de impureza</strong> (filhos mais "puros" que o pai).</li>
          <li>Particione os dados pelo split escolhido.</li>
          <li>Repita recursivamente em cada filho, até critério de parada.</li>
        </ol>
        <p>Critérios de parada: profundidade máxima, mínimo de amostras por folha, ganho mínimo. Sem nenhum critério, a árvore cresce até cada folha ter uma amostra única, overfitting absoluto.</p>
      `
    },
    {
      id: 'impureza',
      title: 'Impureza: Gini vs Entropia',
      body: `
        <p>Duas medidas dominam (para classificação):</p>
        <div class="math">Gini = 1 − Σ pₖ²</div>
        <div class="math">Entropia = −Σ pₖ · log(pₖ)</div>
        <p>Onde <code>pₖ</code> é a fração da classe k no nó.</p>
        <ul>
          <li>Ambas são zero quando o nó é puro (uma única classe).</li>
          <li>Ambas são máximas quando as classes estão igualmente distribuídas.</li>
          <li>Na prática, dão árvores quase idênticas. Gini é ligeiramente mais rápido.</li>
        </ul>
        <p>Para regressão, usamos <strong>MSE</strong> (ou MAE) como critério de impureza, o split que minimiza a variância dos filhos.</p>
      `
    },
    {
      id: 'overfitting-tree',
      title: 'Por que árvores overfittam',
      body: `
        <p>Uma árvore sem restrições vai construir um caminho específico para cada amostra de treino, accuracy 100% no treino, péssima generalização. Para controlar:</p>
        <ul>
          <li><strong>max_depth:</strong> limita profundidade. 3-10 costuma ser razoável.</li>
          <li><strong>min_samples_leaf:</strong> mínimo de amostras numa folha. Evita folhas com 1-2 amostras.</li>
          <li><strong>min_samples_split:</strong> mínimo para considerar split.</li>
          <li><strong>max_features:</strong> quantas features considerar em cada split (default é todas).</li>
          <li><strong>ccp_alpha:</strong> cost-complexity pruning, poda a árvore após construir.</li>
        </ul>
        <p>Outra fragilidade: árvores são <strong>instáveis</strong>. Pequenas mudanças nos dados podem produzir árvores muito diferentes. Bagging (Random Forest) resolve isso.</p>
      `
    },
    {
      id: 'interpretacao',
      title: 'Interpretabilidade',
      body: `
        <p>Você pode literalmente imprimir uma árvore e ler as regras:</p>
        <pre><code>from sklearn.tree import DecisionTreeClassifier, export_text

tree = DecisionTreeClassifier(max_depth=4)
tree.fit(X, y)
print(export_text(tree, feature_names=feature_names))</code></pre>
        <p>Saída:</p>
        <pre><code>|--- idade <= 30
|   |--- renda <= 5000
|   |   |--- class: NEGADO
|   |--- renda > 5000
|   |   |--- class: APROVADO
|--- idade > 30
|   |--- ...</code></pre>
        <p>Esse nível de transparência é raro em ML moderno e justifica usar árvores únicas em contextos regulatórios, mesmo que ensembles fossem mais acurados.</p>
      `
    },
    {
      id: 'features-categoricas',
      title: 'Sobre features categóricas e scaling',
      body: `
        <p>Duas propriedades importantes das árvores:</p>
        <ul>
          <li><strong>Não precisam de feature scaling.</strong> Splits são "feature > threshold", invariantes a escala. Já que você não precisa, nem padronize.</li>
          <li><strong>Lidam nativamente com features categóricas</strong> em algumas implementações (CatBoost, LightGBM). Sklearn ainda exige one-hot ou target encoding.</li>
          <li><strong>Não extrapolam.</strong> Uma árvore prevê apenas valores observados durante o treino. Para extrapolação em séries temporais, prefira modelos com base linear.</li>
        </ul>
      `
    }
  ],
  whenToUse: [
    'Necessidade absoluta de interpretabilidade',
    'Mix de features categóricas e numéricas',
    'Baseline rápido',
    'Quando o domínio tem regras "naturais" (decisões hierárquicas)'
  ],
  whenNot: [
    'Sozinha, quase sempre RF ou XGBoost será melhor',
    'Relações suaves e contínuas (use regressão)',
    'Quando precisa extrapolar fora da distribuição de treino'
  ],
  metrics: ['Padrão da tarefa (F1/AUC para classificação, RMSE para regressão)']
};

window.LESSON_CONTENT['random-forest'] = {
  id: 'random-forest',
  title: 'Random Forest',
  etapa: 2, etapaName: 'Árvores & ensembles',
  time: '60 min',
  tags: ['ensemble', 'bagging', 'tabular'],
  tagline: 'O default seguro para qualquer problema tabular. <em>Bagging</em> + subsample de features = mágica.',
  intro: `
    <p>Random Forest é o que você tenta antes de tentar qualquer outra coisa em dados tabulares. Robusto, fácil de tunar, paralelizável, fornece feature importance de graça. Não é o mais preciso (XGBoost geralmente vence), mas é o default mais seguro do ML clássico.</p>
  `,
  sections: [
    {
      id: 'bagging',
      title: 'Bagging: a ideia central',
      body: `
        <p><strong>Bagging</strong> = Bootstrap Aggregating. Receita:</p>
        <ol>
          <li>Tire B amostras com reposição do dataset original (bootstrap samples). Cada uma tem ~63% das amostras únicas.</li>
          <li>Treine uma árvore <em>profunda e sem regularização</em> em cada amostra.</li>
          <li>Para prever: classificação → maioria de votos; regressão → média.</li>
        </ol>
        <p>Por que funciona? Árvores individuais têm <strong>baixo bias mas variance alta</strong>. Ao agregar muitas, a variance da média cai (lei dos grandes números) sem aumentar o bias. Resultado: modelo de baixo bias <em>e</em> baixa variance.</p>
      `
    },
    {
      id: 'random-features',
      title: 'O "random" do Random Forest',
      body: `
        <p>Bagging puro de árvores tem um problema: todas as árvores acabam parecidas, porque a primeira feature mais informativa domina o primeiro split em quase todas. Árvores correlacionadas → bagging perde eficácia.</p>
        <p>Random Forest adiciona uma camada de aleatoriedade: <strong>em cada split, considera apenas um subset aleatório das features</strong> (parâmetro <code>max_features</code>). Defaults:</p>
        <ul>
          <li>Classificação: <code>sqrt(d)</code> features por split.</li>
          <li>Regressão: <code>d/3</code> features por split.</li>
        </ul>
        <p>Isso força a diversidade das árvores e melhora dramaticamente o ensemble.</p>
      `
    },
    {
      id: 'oob',
      title: 'OOB error: validação de graça',
      body: `
        <p>Como cada árvore foi treinada em ~63% das amostras, os outros ~37% são <strong>out-of-bag</strong> (OOB) para aquela árvore. Você pode usar essas amostras para avaliar a árvore, e agregando para todo o forest, ter uma estimativa de generalização <em>sem cross-validation</em>.</p>
        <pre><code>from sklearn.ensemble import RandomForestClassifier

rf = RandomForestClassifier(n_estimators=500, oob_score=True, n_jobs=-1)
rf.fit(X_train, y_train)
print("OOB score:", rf.oob_score_)</code></pre>
        <p>Útil quando você quer feedback rápido sem precisar gastar tempo em CV.</p>
      `
    },
    {
      id: 'feature-importance',
      title: 'Feature importance, com asterisco',
      body: `
        <p>Random Forest expõe duas medidas de importância:</p>
        <ul>
          <li><strong>Mean Decrease in Impurity (MDI):</strong> default em sklearn. Soma a redução de impureza causada por cada feature, normalizada. Rápido mas <em>enviesado</em> para features com muitos valores únicos.</li>
          <li><strong>Permutation Importance:</strong> embaralha uma feature, mede a queda de performance. Mais confiável, mais caro.</li>
        </ul>
        <pre><code>from sklearn.inspection import permutation_importance

result = permutation_importance(rf, X_val, y_val, n_repeats=10, n_jobs=-1)</code></pre>
        <div class="callout warn">
          <strong>NÃO CONFIE CEGAMENTE</strong>
          MDI superestima a importância de features contínuas e categóricas com muitos níveis. Prefira permutation importance para decisões.
        </div>
      `
    },
    {
      id: 'tuning',
      title: 'Tuning prático',
      body: `
        <p>Os hiperparâmetros que mais movem a agulha:</p>
        <ul>
          <li><code>n_estimators</code>: número de árvores. Mais nunca piora, pare quando OOB plateau.</li>
          <li><code>max_depth</code>: deixe <code>None</code> (default) na maioria dos casos.</li>
          <li><code>min_samples_leaf</code>: aumentar (5, 10, 20) regulariza.</li>
          <li><code>max_features</code>: pode mexer mas o default costuma ser bom.</li>
          <li><code>n_jobs=-1</code>: paraleliza em todos os cores. Sempre use.</li>
        </ul>
        <p>RF é notoriamente <em>robusto</em> ao tuning, costuma performar bem com defaults. Por isso é o default seguro.</p>
      `
    }
  ],
  whenToUse: [
    'Default para qualquer problema tabular',
    'Quando você quer feature importance',
    'Quando não tem tempo para tunar muitos hiperparâmetros',
    'Datasets até alguns milhões de linhas'
  ],
  whenNot: [
    'Latência crítica (RF é pesado na inferência)',
    'Modelo precisa ser pequeno para deploy em edge',
    'XGBoost/LightGBM provavelmente serão mais precisos com tuning'
  ],
  metrics: ['OOB score', 'Padrão da tarefa']
};

window.LESSON_CONTENT['gradient-boosting'] = {
  id: 'gradient-boosting',
  title: 'Gradient Boosting',
  etapa: 2, etapaName: 'Árvores & ensembles',
  time: '75 min',
  tags: ['ensemble', 'boosting', 'gradiente'],
  tagline: 'Aprende em sequência, cada nova árvore corrigindo o <em>resíduo</em> da anterior. Princípio do XGBoost.',
  intro: `
    <p>Se Random Forest é "muitas árvores paralelas", Gradient Boosting é "muitas árvores em sequência, cada uma aprendendo o erro da anterior". Mais lento de treinar, mais preciso, mais difícil de tunar. Esta lição é sobre a ideia central, XGBoost/LightGBM são a próxima.</p>
  `,
  sections: [
    {
      id: 'ideia',
      title: 'A receita: aprender resíduos',
      body: `
        <p>O algoritmo, simplificado para regressão com MSE:</p>
        <ol>
          <li>Inicialize a predição como a média do target: <code>F₀(x) = ȳ</code>.</li>
          <li>Para m = 1 até M:
            <ul>
              <li>Calcule os resíduos: <code>rₘ = y − F_{m-1}(x)</code>.</li>
              <li>Treine uma árvore rasa <code>hₘ</code> para prever <code>rₘ</code>.</li>
              <li>Atualize: <code>Fₘ(x) = F_{m-1}(x) + η · hₘ(x)</code>.</li>
            </ul>
          </li>
        </ol>
        <p>Onde <code>η</code> (learning rate) é entre 0 e 1, tipicamente 0.01 a 0.3. Quanto menor, mais árvores você precisa, mas mais robusto.</p>
        <p>O "gradient" no nome vem do fato de que, para MSE, os resíduos <em>são</em> o gradiente negativo da loss. Para outras losses (log-loss em classificação, MAE, Huber), você ajusta cada árvore ao gradiente negativo, mesma receita, generalizada.</p>
      `
    },
    {
      id: 'arvores-fracas',
      title: 'Por que árvores fracas?',
      body: `
        <p>Em Random Forest, as árvores são <em>profundas e fortes</em> (alta variance), e o bagging reduz variance.</p>
        <p>Em Gradient Boosting, as árvores são <em>rasas e fracas</em> (alto bias, profundidade 3-8), e o boosting reduz bias progressivamente. Cada árvore só precisa contribuir um pouco, daí "weak learners".</p>
        <p>Se você usar árvores profundas em GB, vai overfittar muito rápido. A combinação certa é: muitas árvores rasas + learning rate pequeno.</p>
      `
    },
    {
      id: 'tuning',
      title: 'Tuning é o jogo',
      body: `
        <p>Gradient Boosting é muito mais sensível a tuning que RF. Os parâmetros críticos:</p>
        <ul>
          <li><code>n_estimators</code> (número de árvores): <strong>mais não é sempre melhor</strong>, overfitting é real. Use early stopping.</li>
          <li><code>learning_rate</code>: 0.01 - 0.3. Menor + mais árvores costuma generalizar melhor.</li>
          <li><code>max_depth</code>: 3 - 8. Manter raso.</li>
          <li><code>subsample</code>: < 1.0 ativa stochastic gradient boosting, pega só uma fração dos dados em cada árvore. Reduz variance.</li>
        </ul>
        <pre><code>from sklearn.ensemble import GradientBoostingClassifier

gbm = GradientBoostingClassifier(
    n_estimators=500,
    learning_rate=0.05,
    max_depth=4,
    subsample=0.8,
    validation_fraction=0.2,
    n_iter_no_change=20  # early stopping
)
gbm.fit(X_train, y_train)</code></pre>
      `
    },
    {
      id: 'outliers',
      title: 'O calcanhar: outliers',
      body: `
        <p>Boosting é uma máquina de perseguir erros. Se um outlier tem resíduo enorme, as árvores subsequentes vão tentar reduzi-lo, e o modelo aprende padrões irreais.</p>
        <p>Mitigações:</p>
        <ul>
          <li><strong>Loss robusta:</strong> Huber loss em regressão, em vez de MSE puro.</li>
          <li><strong>Quantile regression:</strong> se você quer prever percentis em vez de média.</li>
          <li><strong>Remover outliers</strong> no pré-processamento.</li>
          <li><strong>Subsample < 1:</strong> reduz a chance de cada árvore ver os outliers.</li>
        </ul>
      `
    },
    {
      id: 'sklearn-vs-xgboost',
      title: 'Sklearn GBM vs XGBoost: o que muda',
      body: `
        <p><code>GradientBoostingClassifier</code> do sklearn é didático mas lento. Para produção, use XGBoost, LightGBM ou CatBoost, eles trazem:</p>
        <ul>
          <li>Histogram-based splits (50-100x mais rápido).</li>
          <li>Regularização L1/L2 explícita nos pesos das folhas.</li>
          <li>Tratamento nativo de missing values.</li>
          <li>GPU support.</li>
          <li>Early stopping built-in.</li>
          <li>Leaf-wise growth (LightGBM) vs level-wise.</li>
        </ul>
        <p>Vamos detalhar na próxima lição.</p>
      `
    }
  ],
  whenToUse: [
    'Performance crítica em dados tabulares',
    'Quando RF deu plateau',
    'Competições, ranking, fraude'
  ],
  whenNot: [
    'Quando latência é crítica',
    'Quando você precisa de interpretabilidade total',
    'Sem orçamento para tuning cuidadoso'
  ],
  metrics: ['Padrão da tarefa', 'Curva de validação (early stopping)']
};

window.LESSON_CONTENT['xgboost'] = {
  id: 'xgboost',
  title: 'XGBoost / LightGBM',
  etapa: 2, etapaName: 'Árvores & ensembles',
  time: '90 min',
  tags: ['ensemble', 'boosting', 'kaggle', 'GPU'],
  tagline: 'Por que <em>domina</em> Kaggle: regularização explícita, segunda derivada, histogramas, GPU.',
  intro: `
    <p>XGBoost e LightGBM (e CatBoost) são as três implementações de produção de gradient boosting que dominam ML tabular. As três fazem essencialmente o mesmo, com nuances: XGBoost foi pioneiro, LightGBM é geralmente mais rápido, CatBoost lida nativamente com categóricas. Esta lição é sobre o que faz essas bibliotecas serem dramaticamente melhores que o gradient boosting "vanilla".</p>
  `,
  sections: [
    {
      id: 'regularizacao',
      title: 'Regularização explícita',
      body: `
        <p>XGBoost reescreve a função objetivo com regularização explícita sobre as folhas das árvores:</p>
        <div class="math">L = Σ l(yᵢ, ŷᵢ) + Σₖ [γ·Tₖ + ½λ·‖wₖ‖²]</div>
        <p>Onde Tₖ é o número de folhas da árvore k e wₖ são os pesos das folhas. Os termos γ (cost-complexity) e λ (L2 nas folhas) penalizam árvores grandes e pesos extremos.</p>
        <p>É como ter Ridge e pruning embutidos no boosting. Resultado: árvores naturalmente menores e mais regularizadas.</p>
      `
    },
    {
      id: 'segunda-derivada',
      title: 'Newton em vez de gradient descent',
      body: `
        <p>Gradient boosting clássico usa apenas o gradiente (primeira derivada). XGBoost usa também a Hessiana (segunda derivada), fazendo updates tipo Newton.</p>
        <p>Cada folha recebe peso ótimo via fórmula fechada:</p>
        <div class="math">wⱼ* = − Σᵢ gᵢ / (Σᵢ hᵢ + λ)</div>
        <p>Mais informação por passo → convergência mais rápida e estável. É um detalhe matemático com impacto prático grande.</p>
      `
    },
    {
      id: 'histogram',
      title: 'Histogram-based splits',
      body: `
        <p>Encontrar o melhor split testando cada valor de cada feature é O(n·d) por split, proibitivo em datasets grandes. A solução:</p>
        <ol>
          <li>Discretize cada feature em ~255 bins de histograma.</li>
          <li>Para encontrar o split, só precisa olhar os 255 candidatos.</li>
        </ol>
        <p>Velocidade aumenta 50-100x com queda mínima de qualidade. LightGBM nasceu com isso; XGBoost adicionou como modo. Hoje é o default.</p>
      `
    },
    {
      id: 'leaf-wise',
      title: 'Leaf-wise vs level-wise (LightGBM)',
      body: `
        <p>XGBoost cresce árvores <strong>level-wise</strong> (todas as folhas do mesmo nível antes de descer). LightGBM cresce <strong>leaf-wise</strong> (sempre divide a folha de maior redução de loss).</p>
        <p>Trade-off:</p>
        <ul>
          <li><strong>Leaf-wise:</strong> converge mais rápido, mas pode overfittar em datasets pequenos. Use <code>num_leaves</code> e <code>max_depth</code> para controlar.</li>
          <li><strong>Level-wise:</strong> mais conservador.</li>
        </ul>
      `
    },
    {
      id: 'pratica',
      title: 'Cheat sheet de tuning',
      body: `
        <pre><code>import xgboost as xgb
from sklearn.metrics import roc_auc_score

model = xgb.XGBClassifier(
    n_estimators=2000,
    learning_rate=0.03,
    max_depth=6,
    min_child_weight=5,        # como min_samples_leaf
    subsample=0.8,
    colsample_bytree=0.8,
    reg_alpha=0.1,              # L1
    reg_lambda=1.0,             # L2
    early_stopping_rounds=50,
    eval_metric='auc',
    tree_method='hist',         # histogram-based
    device='cuda',              # GPU
)

model.fit(X_train, y_train, eval_set=[(X_val, y_val)], verbose=100)</code></pre>
        <p>Ordem de tuning sugerida (Bayesian search ou Optuna):</p>
        <ol>
          <li>Fixe learning_rate baixo (0.03-0.05) e n_estimators alto (2000-5000) com early stopping.</li>
          <li>Tune max_depth (3-10) e min_child_weight (1-10).</li>
          <li>Tune subsample e colsample_bytree (0.6-1.0).</li>
          <li>Tune reg_alpha e reg_lambda em escala log.</li>
          <li>Se ainda houver margem, reduza learning_rate e dobre n_estimators.</li>
        </ol>
        <div class="callout tip">
          <strong>CATBOOST</strong>
          Se você tem MUITAS features categóricas (com cardinalidade alta), CatBoost frequentemente vence, ele usa ordered target encoding sem leakage. Vale o teste.
        </div>
      `
    },
    {
      id: 'shap',
      title: 'Interpretabilidade via SHAP',
      body: `
        <p>XGBoost (e qualquer modelo de árvore) tem suporte nativo a SHAP, Shapley values calculam quanto cada feature contribuiu para cada predição individual:</p>
        <pre><code>import shap

explainer = shap.TreeExplainer(model)
shap_values = explainer.shap_values(X_val)

# Importância global
shap.summary_plot(shap_values, X_val)

# Explicação de uma predição
shap.force_plot(explainer.expected_value, shap_values[0], X_val.iloc[0])</code></pre>
        <p>SHAP resolve o problema da "black box" de boosting de forma rigorosa, é o que você apresenta para stakeholders e reguladores.</p>
      `
    }
  ],
  whenToUse: [
    'SOTA em dados tabulares',
    'Competições',
    'Sistemas de ranking, scoring, recomendação',
    'Quando RF/sklearn GBM deu plateau'
  ],
  whenNot: [
    'Dados não-tabulares (imagem, áudio, texto longo)',
    'Quando precisa de explicação linear coeficiente-por-coeficiente'
  ],
  metrics: ['AUC, logloss, RMSE, NDCG (ranking)', 'Curva de validação com early stopping']
};

/* ═══════════════════════════════════════════════════════════════
   ETAPA 03, GEOMETRIA & DISTÂNCIA
   ═══════════════════════════════════════════════════════════════ */

window.LESSON_CONTENT['knn'] = {
  id: 'knn',
  title: 'K-Nearest Neighbors',
  etapa: 3, etapaName: 'Geometria & distância',
  time: '45 min',
  tags: ['lazy', 'distância', 'não-paramétrico'],
  tagline: 'O modelo que não treina, só memoriza. Simples até demais, mas ensina <em>distância</em>.',
  intro: `
    <p>KNN é o "modelo zero" do ML baseado em distância. Não há fit propriamente dito, o modelo memoriza todo o dataset e, na hora de prever, busca os k vizinhos mais próximos e retorna a maioria (classificação) ou a média (regressão). É o cara que você implementa em 5 linhas para sentir o problema antes de chamar algo mais sofisticado.</p>
  `,
  sections: [
    {
      id: 'algoritmo',
      title: 'O algoritmo em 4 linhas',
      body: `
        <ol>
          <li>Para cada amostra de teste x:
            <ul>
              <li>Calcule a distância de x para todas as amostras de treino.</li>
              <li>Pegue as k amostras com menor distância.</li>
              <li>Retorne a maioria das classes (ou média dos targets).</li>
            </ul>
          </li>
        </ol>
        <p>Treino: O(1), só armazena. Inferência: O(n·d) ingênuo, O(log n) com KD-tree ou Ball-tree em dimensões baixas/médias.</p>
        <p>É <strong>lazy learner</strong>, adia toda a computação para a inferência. Oposto de modelos paramétricos que treinam pesado e preveem rápido.</p>
      `
    },
    {
      id: 'distancia',
      title: 'Escolha da distância',
      body: `
        <p>A distância padrão é <strong>euclidiana</strong>:</p>
        <div class="math">d(x, x') = √(Σᵢ (xᵢ − x'ᵢ)²)</div>
        <p>Outras opções:</p>
        <ul>
          <li><strong>Manhattan (L1):</strong> Σ|xᵢ − x'ᵢ|. Mais robusta a outliers.</li>
          <li><strong>Cosseno:</strong> útil para vetores esparsos como TF-IDF.</li>
          <li><strong>Mahalanobis:</strong> leva em conta correlações entre features.</li>
          <li><strong>Hamming:</strong> para features binárias/categóricas.</li>
        </ul>
        <div class="callout warn">
          <strong>SCALING É NÃO-NEGOCIÁVEL</strong>
          KNN é totalmente dominado pelas features de maior magnitude. Se "idade" é 0-100 e "renda" é 0-1.000.000, a distância só leva em conta a renda. <strong>Sempre</strong> padronize.
        </div>
      `
    },
    {
      id: 'k',
      title: 'Escolhendo k',
      body: `
        <p>Trade-off clássico:</p>
        <ul>
          <li><strong>k pequeno (k=1):</strong> alta variance, baixa bias. Decora ruído.</li>
          <li><strong>k grande:</strong> baixa variance, alta bias. Pode classificar como a classe majoritária.</li>
        </ul>
        <p>Regras de bolso: comece com <code>k = √n</code> e tune via CV. Use k <em>ímpar</em> em classificação binária para evitar empates.</p>
        <p>Variante útil: <strong>distance-weighted KNN</strong>, vizinhos mais próximos votam com peso maior.</p>
      `
    },
    {
      id: 'curse',
      title: 'A maldição da dimensionalidade',
      body: `
        <p>Em alta dimensionalidade, KNN deteriora dramaticamente porque <strong>todas as distâncias colapsam</strong>. Em 1000D, o ponto mais próximo está quase à mesma distância do mais distante, a noção de "vizinho" perde significado.</p>
        <p>Mitigação: reduza dimensionalidade antes (PCA, UMAP) ou use feature selection. Em domínios genuinamente de alta dimensão (texto, embeddings), use modelos especializados.</p>
      `
    }
  ],
  whenToUse: [
    'Datasets pequenos',
    'Baseline rápido',
    'Fronteiras de decisão irregulares',
    'Recomendação simples (item-based collaborative filtering)'
  ],
  whenNot: [
    'Datasets grandes (inferência custosa)',
    'Alta dimensionalidade pura',
    'Latência crítica',
    'Quando você não pode armazenar o dataset todo'
  ],
  metrics: ['Padrão da tarefa']
};

window.LESSON_CONTENT['svm'] = {
  id: 'svm',
  title: 'SVM + Kernel Trick',
  etapa: 3, etapaName: 'Geometria & distância',
  time: '90 min',
  tags: ['margem', 'kernel', 'geometria'],
  tagline: 'Maximize a margem. Use o <em>kernel trick</em> para entrar em dimensões impossíveis sem materializá-las.',
  intro: `
    <p>SVM é uma das ideias mais elegantes do ML clássico. Geometricamente: encontre o hiperplano que separa as classes com a maior margem possível. Matematicamente: um problema de otimização convexa com solução única. Praticamente: o kernel trick permite trabalhar em espaços infinitos sem nunca computá-los explicitamente.</p>
  `,
  sections: [
    {
      id: 'margem',
      title: 'A ideia da margem máxima',
      body: `
        <p>Para classes linearmente separáveis, existem infinitos hiperplanos que separam. Qual escolher? O que tem a <strong>maior margem</strong>, maior distância dos pontos mais próximos de cada classe.</p>
        <p>Esses pontos mais próximos são os <strong>support vectors</strong>, os únicos que realmente importam para o modelo. Mover ou remover qualquer outro ponto não muda o hiperplano.</p>
        <p>Otimização:</p>
        <div class="math">min ½‖w‖² sujeito a yᵢ(wᵀxᵢ + b) ≥ 1 para todo i</div>
        <p>É convexo, tem solução única, e é resolvido via Lagrangianos.</p>
      `
    },
    {
      id: 'soft-margin',
      title: 'Soft margin: o mundo real',
      body: `
        <p>Dados reais raramente são linearmente separáveis. Soft margin permite violações da margem, penalizadas no custo:</p>
        <div class="math">min ½‖w‖² + C · Σ ξᵢ</div>
        <p>Onde <code>ξᵢ ≥ 0</code> é o quanto cada ponto viola a margem. O hiperparâmetro <code>C</code> controla o trade-off:</p>
        <ul>
          <li><strong>C alto:</strong> pune violações duramente → margem pequena, baixo bias, alta variance.</li>
          <li><strong>C baixo:</strong> tolera violações → margem maior, alto bias, baixa variance.</li>
        </ul>
      `
    },
    {
      id: 'kernel',
      title: 'O kernel trick, o pulo geométrico',
      body: `
        <p>Para dados não-linearmente separáveis, mapeie para uma dimensão maior onde sejam:</p>
        <div class="math">φ : ℝᵈ → ℝᴰ, com D >> d</div>
        <p>Problema: D pode ser gigante (até infinito). Insight do kernel trick:</p>
        <p>O algoritmo só usa produtos internos <code>φ(x)·φ(x')</code>. Em vez de computar φ e depois o produto, <strong>defina uma função kernel</strong> <code>K(x, x') = φ(x)·φ(x')</code> que dá o produto direto, sem nunca calcular φ.</p>
        <p>Kernels comuns:</p>
        <ul>
          <li><strong>Linear:</strong> K(x, x') = x·x'. Equivale a SVM sem kernel.</li>
          <li><strong>Polinomial:</strong> K(x, x') = (x·x' + 1)^d.</li>
          <li><strong>RBF (Gaussian):</strong> K(x, x') = exp(−γ·‖x−x'‖²). Default. Equivale a um φ em dimensão infinita.</li>
          <li><strong>Sigmoid:</strong> tanh(αx·x' + c). Raramente usado hoje.</li>
        </ul>
        <p>RBF + bom tuning é frequentemente o ponto de partida.</p>
      `
    },
    {
      id: 'tuning',
      title: 'Tuning: C e γ',
      body: `
        <p>Os dois hiperparâmetros que importam:</p>
        <ul>
          <li><code>C</code>: regularização do soft margin (já discutido).</li>
          <li><code>γ</code> (gamma) no RBF: largura do "raio de influência" de cada exemplo. γ alto → cada ponto influencia pouco → modelo complexo, alta variance.</li>
        </ul>
        <pre><code>from sklearn.svm import SVC
from sklearn.preprocessing import StandardScaler
from sklearn.model_selection import GridSearchCV

scaler = StandardScaler()
X_s = scaler.fit_transform(X_train)

grid = GridSearchCV(
    SVC(kernel='rbf', class_weight='balanced'),
    param_grid={
        'C': [0.1, 1, 10, 100],
        'gamma': [0.001, 0.01, 0.1, 1]
    },
    cv=5, n_jobs=-1
)
grid.fit(X_s, y_train)</code></pre>
        <div class="callout warn">
          <strong>NÃO ESCALA</strong>
          SVM com kernel não-linear treina em O(n²) a O(n³). Acima de ~50-100k amostras, fica inviável. Para datasets grandes, use <code>LinearSVC</code> ou parta para outro algoritmo.
        </div>
      `
    }
  ],
  whenToUse: [
    'Datasets pequenos a médios (< 50k)',
    'Espaço de alta dimensão (texto via TF-IDF)',
    'Fronteiras complexas com kernel',
    'Quando você precisa de margem grande (robustez)'
  ],
  whenNot: [
    'Datasets enormes',
    'Quando você precisa de probabilidades nativas (use Platt scaling)',
    'Quando interpretabilidade é prioridade'
  ],
  metrics: ['Padrão da tarefa', 'AUC (com Platt scaling)']
};

window.LESSON_CONTENT['pca'] = {
  id: 'pca',
  title: 'PCA',
  etapa: 3, etapaName: 'Geometria & distância',
  time: '60 min',
  tags: ['redução de dim', 'linear', 'variância'],
  tagline: 'Encontre as direções de máxima variância e <em>projete</em>. A redução de dimensão mais usada de todas.',
  intro: `
    <p>PCA é a navalha de Occam da redução de dimensionalidade. Linear, determinístico, interpretável, rápido. Usado para compressão, visualização, descorrelação e como pré-processamento para algoritmos sensíveis a dimensionalidade (KNN, SVM).</p>
  `,
  sections: [
    {
      id: 'ideia',
      title: 'A ideia: rotacionar para ver melhor',
      body: `
        <p>Imagine pontos espalhados num plano. Há uma direção em que a "nuvem" se estende mais, direção de <strong>máxima variância</strong>. PCA encontra essa direção (e a próxima ortogonal, e a próxima, e assim por diante).</p>
        <p>Essas direções são os <strong>componentes principais</strong>. Você projeta os dados nessas direções e mantém apenas as primeiras k, onde está a maior parte da variância, descartando o resto.</p>
        <p>Resultado: dados compactados em k dimensões com mínima perda de informação (no sentido de variância).</p>
      `
    },
    {
      id: 'matematica',
      title: 'A matemática: autovetores da covariância',
      body: `
        <p>Receita:</p>
        <ol>
          <li>Centralize os dados (subtraia a média de cada feature).</li>
          <li>Calcule a matriz de covariância <code>C = (1/n) XᵀX</code>.</li>
          <li>Encontre seus autovetores e autovalores.</li>
          <li>Os autovetores com maiores autovalores são os componentes principais.</li>
          <li>Projete os dados nos primeiros k autovetores.</li>
        </ol>
        <p>O autovalor associado a cada componente é a variância dos dados naquela direção. A soma de todos é a variância total.</p>
        <p>Em prática, usa-se SVD (Singular Value Decomposition) em vez de calcular a covariância, é mais estável numericamente.</p>
      `
    },
    {
      id: 'quanto-componentes',
      title: 'Quantos componentes manter?',
      body: `
        <p>Duas heurísticas:</p>
        <ul>
          <li><strong>Variância explicada cumulativa:</strong> mantenha o suficiente para atingir 90-95% da variância total.</li>
          <li><strong>Scree plot:</strong> plote os autovalores ordenados. Mantenha até o "cotovelo".</li>
        </ul>
        <pre><code>from sklearn.decomposition import PCA
from sklearn.preprocessing import StandardScaler
import numpy as np

X_s = StandardScaler().fit_transform(X)

# Modo 1: especificar número de componentes
pca = PCA(n_components=10)

# Modo 2: especificar variância mínima
pca = PCA(n_components=0.95)  # mantém componentes até 95% da variância

X_reduced = pca.fit_transform(X_s)
print("Variância explicada:", np.cumsum(pca.explained_variance_ratio_))</code></pre>
      `
    },
    {
      id: 'limitacoes',
      title: 'Limitações: PCA é linear',
      body: `
        <p>PCA só captura estrutura linear. Se os dados vivem num "manifold" curvo (anel, espiral, sela), PCA achata isso e perde informação.</p>
        <p>Alternativas para estrutura não-linear:</p>
        <ul>
          <li><strong>Kernel PCA:</strong> PCA no espaço de um kernel.</li>
          <li><strong>t-SNE:</strong> só para visualização (próxima lição).</li>
          <li><strong>UMAP:</strong> moderno, escalável, vai para pipelines.</li>
          <li><strong>Autoencoders:</strong> aprende uma redução não-linear via rede neural.</li>
        </ul>
        <div class="callout warn">
          <strong>SCALING ANTES</strong>
          PCA é dominado pelas features de maior variância. Se uma feature tem escala muito maior, PCA "acha" estrutura aí mesmo que não exista. Sempre padronize.
        </div>
      `
    },
    {
      id: 'usos',
      title: 'Quando faz sentido',
      body: `
        <ul>
          <li><strong>Compressão:</strong> guardar embeddings em metade do espaço.</li>
          <li><strong>Visualização inicial:</strong> projetar para 2D ou 3D para entender o dataset.</li>
          <li><strong>Remover multicolinearidade:</strong> componentes são ortogonais por construção.</li>
          <li><strong>Pré-processamento para KNN/SVM:</strong> reduz a maldição da dimensionalidade.</li>
          <li><strong>Denoising:</strong> as últimas componentes carregam mais ruído que sinal.</li>
        </ul>
        <p>NÃO use PCA quando interpretabilidade das features originais é crítica, os componentes são misturas opacas das features.</p>
      `
    }
  ],
  whenToUse: [
    'Compressão preservando variância',
    'Remover multicolinearidade',
    'Visualização exploratória 2D/3D',
    'Pré-processamento para KNN/SVM',
    'Denoising'
  ],
  whenNot: [
    'Estrutura não-linear forte (use UMAP, kernel PCA)',
    'Interpretabilidade das features originais é crítica',
    'Dataset categórico puro (use MCA, Multiple Correspondence Analysis)'
  ],
  metrics: ['Variância explicada cumulativa', 'Scree plot']
};
