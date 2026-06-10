/* Lesson content — Etapas 07, 08 (lições 29–36)
   Métricas — modelagem clássica + IA moderna
*/
window.LESSON_CONTENT = window.LESSON_CONTENT || {};

/* ═══════════════════════════════════════════════════════════════
   ETAPA 07 — MÉTRICAS · MODELAGEM CLÁSSICA
   ═══════════════════════════════════════════════════════════════ */

window.LESSON_CONTENT['metrics-regression'] = {
  id: 'metrics-regression',
  title: 'Métricas de Regressão',
  etapa: 7, etapaName: 'Métricas — modelagem clássica',
  time: '60 min',
  tags: ['métricas', 'regressão', 'avaliação'],
  tagline: 'RMSE não é a única métrica — e muitas vezes <em>não é</em> a certa. Catálogo honesto.',
  intro: `
    <p>Toda escolha em ML — qual modelo treinar, quando parar de tunar, qual versão fazer deploy — passa por uma métrica. Se a métrica está errada, você otimiza para a coisa errada. Esta lição cobre o catálogo de métricas de regressão e quando cada uma é honesta.</p>
  `,
  sections: [
    {
      id: 'mse-rmse',
      title: 'MSE / RMSE — o default',
      body: `
        <div class="math">MSE = (1/n) Σ (yᵢ − ŷᵢ)²</div>
        <div class="math">RMSE = √MSE</div>
        <p>RMSE é a métrica reportada mais comum. Vantagens:</p>
        <ul>
          <li>Está na <strong>mesma unidade do target</strong> (diferente de MSE).</li>
          <li>Diferenciável — usada como loss em treino.</li>
          <li>Penaliza erros grandes mais que pequenos (quadrático).</li>
        </ul>
        <p>Desvantagem crítica: <strong>dominada por outliers</strong>. Um erro de 100 vale o mesmo que 100 erros de 10. Se 1% dos seus dados são outliers, RMSE conta uma história que não é a real.</p>
        <div class="callout warn">
          <strong>NÃO COMPARE RMSEs ENTRE PROBLEMAS</strong>
          RMSE de R$ 1.000 num modelo de preço de casa é ótimo; RMSE de R$ 1.000 num modelo de preço de café é catastrófico. Sempre contextualize com a escala do target.
        </div>
      `
    },
    {
      id: 'mae',
      title: 'MAE — mediana, não média',
      body: `
        <div class="math">MAE = (1/n) Σ |yᵢ − ŷᵢ|</div>
        <p>MAE é a média do erro absoluto. Mais robusta a outliers. Pense: cada outlier contribui linearmente (não ao quadrado), então não domina.</p>
        <p>Estatisticamente, minimizar MAE faz o modelo prever a <em>mediana</em> condicional. Minimizar MSE faz prever a <em>média</em>. Em distribuições assimétricas, isso muda muito.</p>
        <p>Quando preferir MAE:</p>
        <ul>
          <li>Há outliers que você <em>não</em> quer que o modelo persiga.</li>
          <li>Você quer "erro médio realista" e não "erro com peso de outliers".</li>
          <li>Quer reportar para stakeholders não-técnicos — MAE é literalmente "erra X em média".</li>
        </ul>
      `
    },
    {
      id: 'mape-percentual',
      title: 'MAPE e variantes percentuais',
      body: `
        <div class="math">MAPE = (100/n) Σ |yᵢ − ŷᵢ| / |yᵢ|</div>
        <p>MAPE expressa erro como percentual do real. Útil quando a magnitude varia muito: prever preços de R$ 10 e R$ 10.000 com o mesmo MAE é uma coisa, com o mesmo MAPE é outra.</p>
        <p>Armadilhas:</p>
        <ul>
          <li><strong>Explode com y próximo de zero.</strong> Divisão por valores pequenos cria erros gigantes.</li>
          <li><strong>Assimétrica:</strong> superestimar em 50% (ŷ=15 vs y=10) gera erro maior que subestimar em 50% (ŷ=5 vs y=10) — 50% vs 50%, parece, mas o MAPE é 50% vs 50%; o problema fica claro em <strong>WAPE</strong> e <strong>SMAPE</strong>.</li>
        </ul>
        <p>Alternativas:</p>
        <ul>
          <li><strong>WAPE</strong> (Weighted APE): Σ|y-ŷ| / Σ|y|. Mais estável.</li>
          <li><strong>SMAPE</strong> (Symmetric MAPE): simétrico mas ainda problemático com zeros.</li>
        </ul>
      `
    },
    {
      id: 'r2',
      title: 'R² — variância explicada',
      body: `
        <div class="math">R² = 1 − Σ(yᵢ − ŷᵢ)² / Σ(yᵢ − ȳ)²</div>
        <p>R² mede quanto da variância do target o modelo explica. 1.0 = perfeito. 0 = tão bom quanto chutar a média. <strong>Pode ser negativo</strong> se o modelo for pior que prever a média (não é "ao quadrado" — é uma fração com numerador que pode exceder o denominador).</p>
        <p>Gotchas:</p>
        <ul>
          <li>R² alto NÃO significa modelo bom — pode estar overfittando. Sempre olhe em validação.</li>
          <li>R² <strong>sempre cresce</strong> com mais features (mesmo aleatórias). Use <strong>R² ajustado</strong> para penalizar.</li>
          <li>É sem unidade — bom para comparar modelos no <em>mesmo</em> problema, ruim para comparar entre problemas.</li>
        </ul>
        <div class="math">R²_adj = 1 − (1 − R²)·(n − 1)/(n − p − 1)</div>
        <p>Onde p é o número de features.</p>
      `
    },
    {
      id: 'huber-quantile',
      title: 'Huber e Quantile — robusto e direcional',
      body: `
        <p><strong>Huber loss</strong> é um meio-termo entre MSE e MAE: quadrática para erros pequenos, linear para grandes.</p>
        <div class="math">L_δ = ½(y − ŷ)²    se |y − ŷ| ≤ δ
        L_δ = δ·(|y − ŷ| − δ/2)   caso contrário</div>
        <p>Boa quando você quer suavidade próxima ao zero (estabilidade no treino) mas robustez a outliers extremos. δ controla o ponto de virada — tipicamente percentil 75 dos resíduos.</p>
        <p><strong>Quantile loss</strong>: você prevê um <em>percentil específico</em> da distribuição condicional, não a média.</p>
        <div class="math">L_q = max(q·(y − ŷ), (q − 1)·(y − ŷ))</div>
        <p>Quando usar:</p>
        <ul>
          <li>Forecasting com intervalos de confiança (treine para P10, P50, P90).</li>
          <li>Domínios assimétricos: subestimar demanda custa diferente de superestimar.</li>
          <li>Pricing onde quantis P90 são mais úteis que média.</li>
        </ul>
      `
    },
    {
      id: 'decision',
      title: 'Como escolher',
      body: `
        <p>Framework de decisão pragmático:</p>
        <ol>
          <li><strong>Tem outliers que você quer ignorar?</strong> → MAE ou Huber.</li>
          <li><strong>Target tem magnitude muito variável?</strong> → WAPE.</li>
          <li><strong>Quer reportar performance ao negócio?</strong> → MAE ou WAPE (mais intuitivos).</li>
          <li><strong>Custos assimétricos?</strong> → Quantile loss + tune o percentil.</li>
          <li><strong>Default geral?</strong> → RMSE + MAE juntos. Reportar os dois.</li>
        </ol>
        <div class="callout tip">
          <strong>SEMPRE REPORTE 2 MÉTRICAS</strong>
          Uma só esconde informação. RMSE alto + MAE baixo sugere outliers. R² alto + RMSE alto em escala absoluta sugere target com baixa variância. Triangule.
        </div>
      `
    }
  ],
  whenToUse: ['Sempre que treinar modelo de regressão', 'Para escolher entre versões', 'Para reportar performance', 'Em monitoramento de drift'],
  whenNot: ['Não confie em uma métrica única', 'Não compare métricas entre problemas diferentes'],
  metrics: ['RMSE + MAE como par mínimo', 'R² ajustado', 'WAPE para magnitudes variáveis']
};

window.LESSON_CONTENT['metrics-classification'] = {
  id: 'metrics-classification',
  title: 'Métricas de Classificação',
  etapa: 7, etapaName: 'Métricas — modelagem clássica',
  time: '75 min',
  tags: ['métricas', 'classificação', 'AUC'],
  tagline: 'Accuracy mente. <em>Custo do erro</em> manda na escolha — entender isso é a entrevista inteira.',
  intro: `
    <p>Em classificação, accuracy raramente é a métrica certa. O custo de um falso positivo vs falso negativo varia drasticamente por domínio: fraude, diagnóstico médico, spam, churn. Esta lição cobre o catálogo completo e — mais importante — como escolher.</p>
  `,
  sections: [
    {
      id: 'confusion',
      title: 'A matriz de confusão',
      body: `
        <p>Tudo deriva de quatro contagens:</p>
        <ul>
          <li><strong>TP</strong> — predito positivo, era positivo.</li>
          <li><strong>FP</strong> — predito positivo, era negativo (falso alarme).</li>
          <li><strong>TN</strong> — predito negativo, era negativo.</li>
          <li><strong>FN</strong> — predito negativo, era positivo (escapou).</li>
        </ul>
        <p>Métricas derivadas:</p>
        <div class="math">Precision = TP / (TP + FP)</div>
        <div class="math">Recall = TPR = TP / (TP + FN)</div>
        <div class="math">FPR = FP / (FP + TN)</div>
        <div class="math">Specificity = TN / (TN + FP)</div>
        <div class="math">F1 = 2·P·R / (P + R)</div>
        <p>F1 é a média harmônica de Precision e Recall — penaliza desbalanço (uma das duas baixa puxa F1 muito mais que a média aritmética).</p>
      `
    },
    {
      id: 'qual-priorizar',
      title: 'Custo do erro decide tudo',
      body: `
        <p>A pergunta crítica: <strong>"o que custa mais — FP ou FN?"</strong></p>
        <ul>
          <li><strong>Fraude bancária:</strong> FN é caro (perdeu fraude). Maximize Recall, aceite Precision menor.</li>
          <li><strong>Spam:</strong> FP é caro (email importante perdido). Maximize Precision.</li>
          <li><strong>Diagnóstico de doença grave:</strong> FN catastrófico. Recall altíssimo, depois confirma com exames.</li>
          <li><strong>Triagem de currículos:</strong> FP custa entrevista, FN custa perder talento. Tipicamente foco em Recall.</li>
        </ul>
        <p>Não existe "F1 alto é bom" sem contexto. Sempre traduza para "quanto FN/FP custa em R$ ou em dano".</p>
        <div class="callout warn">
          <strong>ACCURACY ENGANA</strong>
          Em fraude (1% positivos), modelo que sempre diz "não-fraude" tem 99% accuracy. E é totalmente inútil.
        </div>
      `
    },
    {
      id: 'auc-roc',
      title: 'AUC-ROC — independente de threshold',
      body: `
        <p>A curva ROC plota TPR vs FPR variando o threshold. A área sob a curva (AUC) tem interpretação probabilística:</p>
        <blockquote style="margin:14px 0;padding:0 16px;border-left:3px solid var(--accent1);color:var(--text)">
          AUC = probabilidade de o modelo ranquear um positivo aleatório acima de um negativo aleatório.
        </blockquote>
        <ul>
          <li>AUC = 0.5 → chute aleatório.</li>
          <li>AUC = 1.0 → perfeito.</li>
          <li>AUC > 0.7 → razoável; > 0.8 → bom; > 0.9 → ótimo (em geral).</li>
        </ul>
        <p>Vantagens:</p>
        <ul>
          <li>Independente do threshold — você ainda não decidiu onde cortar.</li>
          <li>Bom para comparar modelos antes de decidir operação.</li>
        </ul>
        <p>Limitação crucial: <strong>AUC-ROC engana em datasets muito desbalanceados</strong>. Com 0.1% de positivos, AUC de 0.95 ainda pode dar Precision miserável. Use PR-AUC para esse caso.</p>
      `
    },
    {
      id: 'pr-auc',
      title: 'PR-AUC e Average Precision',
      body: `
        <p>A curva Precision-Recall plota Precision vs Recall variando o threshold. Mais informativa que ROC quando positivos são raros.</p>
        <p>Resumo numérico: <strong>Average Precision (AP)</strong> — média ponderada de Precision em cada nível de Recall.</p>
        <p>Quando preferir PR-AUC sobre ROC-AUC:</p>
        <ul>
          <li>Datasets <strong>desbalanceados</strong> (positivos &lt; 5%).</li>
          <li>Você se importa muito mais com a <strong>classe positiva</strong> que a negativa.</li>
          <li>Detecção de fraude, anomalia, eventos raros.</li>
        </ul>
        <p>Diferença visual: em desbalanço extremo, ROC parece otimista, PR-AUC mostra o verdadeiro custo.</p>
      `
    },
    {
      id: 'mcc-kappa',
      title: 'MCC e Cohen\'s κ — métricas "honestas"',
      body: `
        <p><strong>Matthews Correlation Coefficient (MCC)</strong>:</p>
        <div class="math">MCC = (TP·TN − FP·FN) / √((TP+FP)(TP+FN)(TN+FP)(TN+FN))</div>
        <p>Entre -1 e 1. 0 = chute. Considerada por muitos a métrica mais "honesta" para classes desbalanceadas porque usa <em>todas</em> as células da matriz de confusão.</p>
        <p><strong>Cohen's κ (kappa)</strong>: corrige accuracy pela probabilidade de acerto por chance. Útil quando você quer reportar "quanto melhor que aleatório" em datasets com prior conhecido.</p>
        <p>Usadas em pesquisa médica e estudos sociais; subutilizadas em ML de produção mas valem conhecer.</p>
      `
    },
    {
      id: 'multiclasse',
      title: 'Multiclasse: macro vs micro vs weighted',
      body: `
        <p>Em multiclasse, F1 (e Precision/Recall) podem ser agregados de três formas:</p>
        <ul>
          <li><strong>Macro:</strong> média simples por classe. <em>Cada classe pesa igual</em>, independente do tamanho.</li>
          <li><strong>Weighted:</strong> média ponderada por frequência. Classes maiores dominam.</li>
          <li><strong>Micro:</strong> calcula TP/FP/FN globais e depois F1. Equivale a accuracy em multiclasse balanceada.</li>
        </ul>
        <p>Quando preferir cada:</p>
        <ul>
          <li><strong>Macro</strong>: você se importa igualmente com todas as classes (raras incluídas). Default em desbalanço.</li>
          <li><strong>Weighted</strong>: você se importa proporcionalmente.</li>
          <li><strong>Micro</strong>: classes equilibradas, ou multilabel.</li>
        </ul>
      `
    },
    {
      id: 'calibracao',
      title: 'Calibração — quando probabilidades importam',
      body: `
        <p>Modelo pode ter AUC alto e <em>ainda assim</em> dar probabilidades inúteis. Se você precisa que P(y=1)=0.7 signifique "tem 70% de chance", o modelo precisa estar <strong>calibrado</strong>.</p>
        <ul>
          <li><strong>Brier score</strong>: MSE entre p̂ e y. Menor é melhor.</li>
          <li><strong>Calibration plot (reliability diagram)</strong>: divida predições em bins e plote frequência real vs predita. Diagonal = perfeito.</li>
          <li><strong>Expected Calibration Error (ECE)</strong>: erro médio entre confiança predita e frequência real.</li>
        </ul>
        <p>Modelos calibrados nativamente: Logistic Regression, Naive Bayes (na prática).</p>
        <p>Mal-calibrados nativamente: Random Forest, SVM, redes neurais. Use <strong>Platt scaling</strong> (sigmoide pós-hoc) ou <strong>Isotonic Regression</strong> para corrigir.</p>
      `
    }
  ],
  whenToUse: [
    'Sempre — classificação sem métrica adequada é tiro no escuro',
    'AUC-ROC para comparar modelos antes de operação',
    'PR-AUC em datasets desbalanceados',
    'F1-macro em multiclasse desbalanceada',
    'Calibração quando probabilidades viram decisão'
  ],
  whenNot: [
    'Não use accuracy sozinha em classes desbalanceadas',
    'Não compare AUCs entre datasets diferentes'
  ],
  metrics: ['Precision/Recall/F1', 'AUC-ROC, AUC-PR', 'MCC', 'Brier, ECE (calibração)']
};

window.LESSON_CONTENT['metrics-ranking'] = {
  id: 'metrics-ranking',
  title: 'Métricas de Ranking',
  etapa: 7, etapaName: 'Métricas — modelagem clássica',
  time: '60 min',
  tags: ['ranking', 'recomendação', 'IR'],
  tagline: 'Em recomendação e busca, <em>ordem</em> importa mais que predição binária.',
  intro: `
    <p>Sistemas de recomendação, busca e information retrieval (IR) raramente são bem avaliados por accuracy ou F1. O que importa é se os itens <strong>certos aparecem no topo</strong>. Esta lição cobre as métricas que medem isso — MAP, MRR, NDCG — e quando cada uma faz sentido.</p>
  `,
  sections: [
    {
      id: 'precision-recall-k',
      title: 'Precision@k e Recall@k',
      body: `
        <p>O ponto de partida: você só recomenda os top-k itens. Quantos desses k são realmente relevantes?</p>
        <div class="math">Precision@k = relevantes nos top-k / k</div>
        <div class="math">Recall@k = relevantes nos top-k / total relevantes</div>
        <p>Útil quando:</p>
        <ul>
          <li>UX restringe os top-k (ex: 10 resultados no Google, 5 produtos na home).</li>
          <li>Você quer dizer "dos 10 que mostrei, x foram bons".</li>
        </ul>
        <p>Limitação: não considera <strong>ordem</strong> dentro dos top-k. Recomendar [bom, ruim, ruim, ruim, ruim] tem mesmo P@5 que [ruim, ruim, ruim, ruim, bom]. As próximas métricas resolvem.</p>
      `
    },
    {
      id: 'mrr',
      title: 'MRR — Mean Reciprocal Rank',
      body: `
        <div class="math">MRR = (1/N) Σᵢ 1/rankᵢ</div>
        <p>Para cada query, o "rank" é a posição do <em>primeiro item relevante</em>. MRR é a média dos recíprocos.</p>
        <p>Interpretação: se o item relevante aparece em média na posição 2, MRR = 0.5. Se em média na posição 1, MRR = 1.0.</p>
        <p>Quando preferir MRR:</p>
        <ul>
          <li>O usuário só precisa de <strong>uma resposta certa</strong> (Q&A, navegação).</li>
          <li>Search engine onde primeiro click vale muito.</li>
          <li>Auto-complete, sugestões.</li>
        </ul>
        <p>Não captura cenários onde múltiplos itens relevantes são desejados.</p>
      `
    },
    {
      id: 'map',
      title: 'MAP — Mean Average Precision',
      body: `
        <p>Average Precision (AP) é a média de Precision@k em cada posição onde aparece um item relevante:</p>
        <div class="math">AP = Σₖ P@k · rel(k) / total_relevantes</div>
        <p>MAP é a média de AP entre queries. Combina precision com sensibilidade à ordem — itens relevantes mais cedo aumentam mais o AP.</p>
        <p>Quando preferir MAP:</p>
        <ul>
          <li>Múltiplos itens relevantes podem existir.</li>
          <li>Information retrieval clássico (Document search).</li>
          <li>Você se importa com todos os relevantes, não só o primeiro.</li>
        </ul>
      `
    },
    {
      id: 'ndcg',
      title: 'NDCG — relevância graduada',
      body: `
        <p>MAP trata relevância como binária (relevante ou não). NDCG (Normalized Discounted Cumulative Gain) lida com <strong>relevância graduada</strong> — "muito relevante" vale mais que "razoavelmente relevante".</p>
        <div class="math">DCG@k = Σᵢ (2^rel(i) − 1) / log₂(i + 1)</div>
        <div class="math">NDCG@k = DCG@k / IDCG@k</div>
        <p>Onde IDCG é o DCG do ranking ideal — normaliza para [0, 1]. O <em>discount</em> log₂(i+1) penaliza relevantes em posições baixas.</p>
        <p>Default moderno em search, news ranking, ads — qualquer cenário onde itens têm graus de relevância (1-5 estrelas, ctr, dwell time como proxy).</p>
      `
    },
    {
      id: 'beyond-accuracy',
      title: 'Para além da relevância: diversidade, serendipidade, coverage',
      body: `
        <p>Métricas tradicionais otimizam só relevância — mas recomenders bons fazem mais:</p>
        <ul>
          <li><strong>Coverage:</strong> que fração do catálogo é mostrada ao longo do tempo? Sistemas concentrados criam "filter bubble".</li>
          <li><strong>Diversity:</strong> os top-k são variados ou todos do mesmo gênero/marca?</li>
          <li><strong>Novelty:</strong> recomenda itens que o usuário não veria por conta própria?</li>
          <li><strong>Serendipity:</strong> surpresa positiva — relevante mas inesperado.</li>
          <li><strong>Fairness:</strong> diferentes grupos recebem qualidade similar de recomendações?</li>
        </ul>
        <p>Em produção, balance NDCG com pelo menos diversity e coverage — senão o sistema converge para "Justin Bieber para todos".</p>
      `
    },
    {
      id: 'metricas-negocio',
      title: 'Métricas de negócio: o que vale R$',
      body: `
        <p>Métricas técnicas (NDCG, MAP) são proxies. O que realmente importa é negócio:</p>
        <ul>
          <li><strong>CTR (Click-Through Rate)</strong>: cliques / impressões.</li>
          <li><strong>Conversion rate</strong>: compras / cliques (ou impressões).</li>
          <li><strong>GMV / Revenue per user</strong>.</li>
          <li><strong>Engagement</strong>: tempo, retenção, ações.</li>
          <li><strong>Long-term value</strong>: usuários ainda ativos em 30/90 dias?</li>
        </ul>
        <p>Métricas offline (NDCG) e online (CTR) frequentemente discordam. <strong>A/B testing</strong> é o juiz final — métricas técnicas só fazem sentido se correlacionam com negócio.</p>
        <div class="callout tip">
          <strong>FRAMEWORK</strong>
          NDCG offline para iterar rápido. A/B online para validar. Múltiplas métricas de negócio para evitar gaming.
        </div>
      `
    }
  ],
  whenToUse: [
    'Sistemas de recomendação',
    'Search engines, IR',
    'Q&A, auto-complete (MRR)',
    'News, feed ranking (NDCG)'
  ],
  whenNot: [
    'Quando classificação binária é suficiente',
    'Quando o usuário não vê os itens ranqueados (use métricas de classificação)'
  ],
  metrics: ['NDCG@k', 'MAP', 'MRR', 'P@k, R@k', 'Coverage, Diversity', 'CTR, Conversion (negócio)']
};

window.LESSON_CONTENT['metrics-unsupervised'] = {
  id: 'metrics-unsupervised',
  title: 'Métricas Não-Supervisionadas',
  etapa: 7, etapaName: 'Métricas — modelagem clássica',
  time: '60 min',
  tags: ['clustering', 'anomalia', 'validação'],
  tagline: 'Sem rótulo, sem ground truth. Avaliar clustering e anomaly detection exige <em>outro vocabulário</em>.',
  intro: `
    <p>Como você avalia um modelo quando não há resposta certa? Métricas não-supervisionadas medem propriedades intrínsecas dos resultados — coesão, separação, isolamento. Esta lição cobre as principais para clustering e anomaly detection.</p>
  `,
  sections: [
    {
      id: 'silhouette',
      title: 'Silhouette score — coesão vs separação',
      body: `
        <p>Para cada ponto, mede:</p>
        <ul>
          <li><strong>a(i):</strong> distância média aos outros pontos do mesmo cluster (coesão).</li>
          <li><strong>b(i):</strong> distância média ao cluster mais próximo (separação).</li>
        </ul>
        <div class="math">s(i) = (b(i) − a(i)) / max(a(i), b(i))</div>
        <p>Entre -1 e 1:</p>
        <ul>
          <li>Próximo de 1: ponto bem dentro de seu cluster.</li>
          <li>Próximo de 0: ponto na fronteira entre clusters.</li>
          <li>Negativo: ponto provavelmente está no cluster errado.</li>
        </ul>
        <p>Silhouette médio do dataset é a métrica reportada. Acima de 0.5 sugere estrutura clara; abaixo de 0.25 sugere clusters fracos.</p>
        <p>Uso clássico: escolher k em K-Means rodando para k = 2, 3, 4, ... e pegando o k que maximiza silhouette médio.</p>
      `
    },
    {
      id: 'davies-bouldin',
      title: 'Davies-Bouldin Index',
      body: `
        <p>Mede a razão entre dispersão intra-cluster e separação inter-cluster.</p>
        <div class="math">DB = (1/k) Σᵢ maxⱼ≠ᵢ (σᵢ + σⱼ) / d(cᵢ, cⱼ)</div>
        <p>Onde σ é o desvio padrão intra-cluster e d é distância entre centroides.</p>
        <p><strong>Menor é melhor.</strong> Próximo de zero = clusters bem separados e compactos.</p>
        <p>Vantagens sobre silhouette:</p>
        <ul>
          <li>Mais rápida (O(n) vs O(n²)).</li>
          <li>Funciona bem com clusters de densidades diferentes.</li>
        </ul>
        <p>Limitação: pressupõe clusters convexos. DBSCAN pode ter DB ruim mesmo com bons clusters de forma irregular.</p>
      `
    },
    {
      id: 'calinski-harabasz',
      title: 'Calinski-Harabasz — variance ratio',
      body: `
        <p>Razão entre dispersão entre clusters e dispersão dentro de clusters:</p>
        <div class="math">CH = (BSS / (k − 1)) / (WSS / (n − k))</div>
        <p>Onde BSS = soma de quadrados entre clusters, WSS = dentro de clusters.</p>
        <p><strong>Maior é melhor.</strong> Penaliza naturalmente número alto de clusters (similar a R² ajustado em regressão).</p>
        <p>Rápida, escalável, boa para datasets grandes. Como silhouette, pressupõe clusters esféricos — falha em DBSCAN.</p>
      `
    },
    {
      id: 'ari-nmi',
      title: 'Métricas com ground truth parcial',
      body: `
        <p>Quando você tem rótulos verdadeiros (ex: validação semi-supervisionada de clustering):</p>
        <ul>
          <li><strong>Adjusted Rand Index (ARI)</strong>: mede concordância entre clustering e ground truth, ajustado pela chance. Entre -1 e 1.</li>
          <li><strong>Normalized Mutual Information (NMI)</strong>: informação compartilhada entre os dois agrupamentos. Entre 0 e 1.</li>
          <li><strong>V-measure</strong>: média harmônica de homogeneidade (cada cluster contém uma única classe) e completeness (cada classe está num único cluster).</li>
          <li><strong>Fowlkes-Mallows</strong>: média geométrica de precision e recall em pares.</li>
        </ul>
        <p>Use estas quando avalia em datasets de benchmark com rótulos conhecidos. Em produção sem rótulos, recorra às métricas internas (silhouette, DB, CH).</p>
      `
    },
    {
      id: 'anomaly',
      title: 'Métricas de anomaly detection',
      body: `
        <p>Anomaly detection geralmente tem rótulos parciais (sabe que <em>algumas</em> amostras são anômalas). Métricas:</p>
        <ul>
          <li><strong>PR-AUC</strong>: muito mais informativa que ROC-AUC quando anomalias são raras (sempre são).</li>
          <li><strong>Precision@k</strong>: dos top-k flagged pelo modelo, quantos são realmente anômalos? Crítico quando há orçamento limitado de investigação humana.</li>
          <li><strong>Recall@FPR fixo</strong>: aceitando, digamos, 1% de falsos alarmes, qual recall você atinge?</li>
          <li><strong>Lift@k</strong>: razão entre taxa de anomalias nos top-k e taxa basal. "Top 100 do modelo tem 50× mais anomalias que aleatório."</li>
        </ul>
        <div class="callout warn">
          <strong>BASE RATE FALLACY</strong>
          Modelo "preciso" (95%) em fraude (0.1% positivos) gera 99% de falsos alarmes. Sempre raciocine em valores absolutos de FP/FN, não percentuais.
        </div>
      `
    },
    {
      id: 'validacao-semantica',
      title: 'Validação semântica — o que falta nas métricas',
      body: `
        <p>Todas as métricas internas (silhouette, DB, CH) medem <strong>geometria</strong>, não <strong>utilidade</strong>. Um cluster geometricamente perfeito pode ser inútil para o negócio.</p>
        <p>Validação semântica complementar:</p>
        <ul>
          <li><strong>Interpretação por especialista:</strong> "esses clusters fazem sentido para o domínio?"</li>
          <li><strong>Análise de centroides:</strong> qual é o "cliente típico" de cada cluster?</li>
          <li><strong>Downstream performance:</strong> usar clusters como feature em modelo supervisionado e medir lift.</li>
          <li><strong>Estabilidade:</strong> re-rodar com subsample e verificar se clusters são robustos.</li>
        </ul>
      `
    }
  ],
  whenToUse: [
    'Avaliação de clustering',
    'Escolha de k em K-Means',
    'Comparar diferentes algoritmos de clustering',
    'Anomaly detection com rótulos parciais'
  ],
  whenNot: [
    'Não use silhouette em DBSCAN com formas irregulares',
    'Não confie só em métricas internas — sempre valide semanticamente'
  ],
  metrics: ['Silhouette, DB, CH', 'ARI, NMI (com ground truth)', 'PR-AUC, Precision@k (anomaly)']
};

/* ═══════════════════════════════════════════════════════════════
   ETAPA 08 — MÉTRICAS · IA MODERNA
   ═══════════════════════════════════════════════════════════════ */

window.LESSON_CONTENT['metrics-llm'] = {
  id: 'metrics-llm',
  title: 'Métricas de LLM',
  etapa: 8, etapaName: 'Métricas — IA moderna',
  time: '75 min',
  tags: ['LLM', 'benchmarks', 'avaliação'],
  tagline: 'Como medir "qualidade de geração"? <em>Perplexity, BLEU, BERTScore, e os benchmarks</em> que viraram moeda.',
  intro: `
    <p>Avaliar LLMs é um problema aberto. Métricas tradicionais (perplexity, BLEU) capturam aspectos diferentes da qualidade de geração. Benchmarks (MMLU, HumanEval) viraram a moeda do mercado para comparar modelos. Esta lição cobre todas — com os caveats de cada uma.</p>
  `,
  sections: [
    {
      id: 'perplexity',
      title: 'Perplexity — a métrica fundadora',
      body: `
        <p>Perplexity é a métrica fundamental do treino de LLM. Mede o quão "surpreso" o modelo está com um texto de teste.</p>
        <div class="math">PPL = exp(−(1/N) Σ log P(xᵢ | x₁...xᵢ₋₁))</div>
        <p>Equivalente à exponencial da cross-entropy. Menor é melhor.</p>
        <p>Interpretação intuitiva: "em média, o modelo tem perplexity tokens igualmente prováveis em mente para cada predição". PPL = 2 significa "como se houvesse 2 escolhas igualmente possíveis".</p>
        <p>Limitações graves para avaliação de qualidade:</p>
        <ul>
          <li><strong>Não correlaciona bem com utilidade</strong>. Modelo com PPL menor pode gerar respostas piores.</li>
          <li>Depende fortemente do tokenizer e do corpus de teste.</li>
          <li>Não considera coerência, factualidade, instrução seguida.</li>
        </ul>
        <p>Use perplexity para monitorar treino, não como métrica de produto.</p>
      `
    },
    {
      id: 'bleu-rouge',
      title: 'BLEU, ROUGE, METEOR — geração baseada em referência',
      body: `
        <p>Quando você tem respostas de referência (tradução, sumarização), métricas baseadas em sobreposição:</p>
        <ul>
          <li><strong>BLEU</strong> (Bilingual Evaluation Understudy): precision de n-gramas. Default em tradução automática.</li>
          <li><strong>ROUGE</strong> (Recall-Oriented Understudy for Gisting Evaluation): recall de n-gramas. Default em sumarização. Variantes: ROUGE-1, ROUGE-2, ROUGE-L (longest common subsequence).</li>
          <li><strong>METEOR</strong>: considera sinônimos via WordNet. Melhor correlação com julgamento humano que BLEU em algumas tarefas.</li>
        </ul>
        <p>Limitação fundamental: <strong>medem sobreposição léxica, não significado</strong>. "O carro é vermelho" e "O automóvel é rubro" têm BLEU baixo apesar de equivalentes.</p>
      `
    },
    {
      id: 'bertscore',
      title: 'BERTScore e métricas semânticas',
      body: `
        <p>Métricas modernas usam embeddings para medir similaridade semântica:</p>
        <ul>
          <li><strong>BERTScore</strong>: similaridade cosseno entre embeddings de BERT para cada token, com matching ótimo.</li>
          <li><strong>BLEURT</strong>: BERT fine-tunado para correlacionar com julgamento humano.</li>
          <li><strong>COMET</strong>: padrão atual em tradução automática.</li>
          <li><strong>MoverScore</strong>: usa Earth Mover's Distance entre embeddings.</li>
        </ul>
        <p>Vantagens: capturam sinônimos, paráfrases, equivalência semântica. Bem mais alinhadas com humanos que BLEU.</p>
        <p>Limitação: ainda exigem referência. Para geração aberta (chat, criatividade), você precisa de outras abordagens — LLM-as-judge (próxima lição).</p>
      `
    },
    {
      id: 'mmlu',
      title: 'Benchmarks de conhecimento: MMLU',
      body: `
        <p>MMLU (Massive Multitask Language Understanding) é o benchmark mais citado de "conhecimento geral" de LLMs. Composição:</p>
        <ul>
          <li>57 tarefas: matemática, história, lei, medicina, filosofia, etc.</li>
          <li>~14.000 perguntas de múltipla escolha (4 alternativas).</li>
          <li>Métrica: accuracy.</li>
        </ul>
        <p>Pontos de referência:</p>
        <ul>
          <li>Random: 25%.</li>
          <li>Não-especialista humano: ~35%.</li>
          <li>Especialista humano: ~90%.</li>
          <li>GPT-3 (2020): ~44%.</li>
          <li>GPT-4 (2023): ~86%.</li>
          <li>Modelos top em 2025: 90%+.</li>
        </ul>
        <div class="callout warn">
          <strong>SATURAÇÃO</strong>
          MMLU está saturando. Sucessores: MMLU-Pro (mais difícil), GPQA (PhD-level), Humanity's Last Exam.
        </div>
      `
    },
    {
      id: 'humaneval-gsm8k',
      title: 'Benchmarks específicos: HumanEval, GSM8K, MATH',
      body: `
        <p><strong>HumanEval</strong>: 164 problemas de programação Python. Modelo gera código, executa contra test cases. Métrica: pass@k (acerto em pelo menos k de N tentativas).</p>
        <p><strong>GSM8K</strong>: 8.500 problemas de matemática nível escolar. Testa raciocínio matemático multi-step.</p>
        <p><strong>MATH</strong>: 12.500 problemas de competição matemática. Muito mais difícil.</p>
        <p>Outros importantes:</p>
        <ul>
          <li><strong>BBH (BIG-Bench Hard)</strong>: 23 tarefas onde modelos eram historicamente fracos.</li>
          <li><strong>HellaSwag</strong>: commonsense reasoning.</li>
          <li><strong>TruthfulQA</strong>: factualidade vs misconceptions.</li>
          <li><strong>ARC-Challenge</strong>: ciência nível primário/médio.</li>
        </ul>
      `
    },
    {
      id: 'contaminacao',
      title: 'Contaminação — o problema atual dos benchmarks',
      body: `
        <p>Benchmarks são abertos. LLMs são treinados em web crawls que <em>incluem os benchmarks</em>. Resultado: modelos podem ter <strong>memorizado</strong> as respostas, não aprendido a tarefa.</p>
        <p>Como detectar:</p>
        <ul>
          <li>Métodos de membership inference.</li>
          <li>Variantes do benchmark com mesma estrutura mas exemplos diferentes.</li>
          <li>Performance dramática em benchmark vs degradação em variantes.</li>
        </ul>
        <p>Soluções modernas:</p>
        <ul>
          <li>Benchmarks <strong>contamination-resistant</strong> (gerados após cutoff de treino).</li>
          <li>Arena (LMSys): humanos comparam pares de respostas a prompts diversos em tempo real.</li>
          <li>Benchmarks dinâmicos: novas perguntas adicionadas continuamente.</li>
        </ul>
        <div class="callout warn">
          <strong>CONSEQUÊNCIA PRÁTICA</strong>
          Benchmarks são <em>pista</em>, não verdade. Sempre teste em suas próprias tarefas e dados antes de escolher modelo.
        </div>
      `
    }
  ],
  whenToUse: [
    'Perplexity para monitorar treino',
    'BLEU/ROUGE em tradução e sumarização com referência',
    'BERTScore/COMET para qualidade semântica',
    'MMLU/HumanEval para comparar modelos em capacidades gerais',
    'Sempre teste em seus próprios prompts'
  ],
  whenNot: [
    'Não use perplexity como métrica de produto',
    'Não confie só em benchmarks públicos (contaminação)',
    'Não use métricas baseadas em referência em geração aberta'
  ],
  metrics: ['Perplexity', 'BLEU, ROUGE, BERTScore', 'MMLU, HumanEval, GSM8K', 'Arena Elo']
};

window.LESSON_CONTENT['metrics-llm-judge'] = {
  id: 'metrics-llm-judge',
  title: 'LLM-as-Judge',
  etapa: 8, etapaName: 'Métricas — IA moderna',
  time: '60 min',
  tags: ['LLM-as-judge', 'evaluation', 'MT-Bench'],
  tagline: 'Usar um LLM forte para <em>julgar</em> outros LLMs. Escalável, barato — mas com vieses conhecidos.',
  intro: `
    <p>Geração aberta (chat, escrita criativa, raciocínio) não tem "resposta correta" — métricas baseadas em referência falham. A solução prática que dominou desde 2023: usar um LLM forte (GPT-4, Claude) para julgar saídas. Esta lição cobre como funciona, frameworks padrão e como evitar os erros.</p>
  `,
  sections: [
    {
      id: 'protocolo',
      title: 'Protocolos de judging',
      body: `
        <p>Três protocolos principais:</p>
        <ul>
          <li><strong>Pointwise scoring:</strong> juiz dá nota de 1-10 (ou Likert) a cada resposta. Simples, escalável.</li>
          <li><strong>Pairwise comparison:</strong> juiz compara duas respostas A vs B e decide qual é melhor. Mais robusto que pointwise.</li>
          <li><strong>Reference-based:</strong> juiz compara resposta com referência ideal escrita por humano.</li>
        </ul>
        <p>Pairwise tem se mostrado o mais confiável — correlaciona melhor com julgamento humano. Pointwise sofre de "everything gets a 7" — juízes tendem ao meio da escala.</p>
      `
    },
    {
      id: 'mt-bench',
      title: 'MT-Bench e AlpacaEval',
      body: `
        <p><strong>MT-Bench</strong> (LMSys): 80 perguntas multi-turno em 8 categorias (escrita, raciocínio, matemática, código, extração, STEM, humanidades, roleplay). GPT-4 julga em escala 1-10.</p>
        <p><strong>AlpacaEval</strong>: 805 prompts, pairwise contra GPT-4 turbo. Reporta win-rate.</p>
        <p>Ambos são padrões de facto para comparar LLMs em "qualidade de chat". Limitações:</p>
        <ul>
          <li>GPT-4 como juiz tem vieses (próxima seção).</li>
          <li>Conjunto fixo de prompts pode não refletir seu caso de uso.</li>
          <li>Saturação em modelos top.</li>
        </ul>
      `
    },
    {
      id: 'arena',
      title: 'Chatbot Arena — humanos no loop',
      body: `
        <p>Arena (LMSys) é a alternativa: humanos comparam pares de respostas de LLMs anônimos em prompts diversos. Resultado: ranking ELO global.</p>
        <p>Vantagens:</p>
        <ul>
          <li>Julgamento humano real, não LLM.</li>
          <li>Prompts diversos da população real.</li>
          <li>Resistente a contaminação.</li>
        </ul>
        <p>Limitações:</p>
        <ul>
          <li>Lento — leva semanas para um modelo subir no ranking.</li>
          <li>Vieses dos avaliadores (técnicos, ocidentais, etc.).</li>
          <li>Não é reproduzível offline.</li>
        </ul>
        <p>Arena Elo é frequentemente o mais citado em comunicação de novo modelo, com razão.</p>
      `
    },
    {
      id: 'vieses',
      title: 'Vieses conhecidos do LLM-as-judge',
      body: `
        <p>LLMs julgando LLMs têm vieses sistemáticos:</p>
        <ul>
          <li><strong>Position bias:</strong> em pairwise, juiz tende a preferir o primeiro (ou segundo). Mitigação: rode 2× com ordem invertida e tome a média.</li>
          <li><strong>Verbosity bias:</strong> respostas mais longas costumam vencer, mesmo sem agregar valor.</li>
          <li><strong>Self-preference:</strong> GPT-4 tende a preferir respostas de GPT-4. Claude tende a preferir Claude. Não use o mesmo família para gerar e julgar quando possível.</li>
          <li><strong>Confirmation bias:</strong> se o prompt sugere uma opinião, juiz tende a confirmá-la.</li>
          <li><strong>Sycophancy:</strong> respostas educadas vencem respostas diretas, mesmo quando diretas são mais úteis.</li>
        </ul>
        <p>Frameworks como AlpacaEval 2.0 (Length-Controlled) tentam corrigir verbosity bias estatisticamente.</p>
      `
    },
    {
      id: 'frameworks',
      title: 'Frameworks de avaliação automatizada',
      body: `
        <p>Bibliotecas que abstraem judging:</p>
        <ul>
          <li><strong>Promptfoo:</strong> open-source, focado em CI/CD de prompts.</li>
          <li><strong>DeepEval:</strong> testes pytest-like para LLMs.</li>
          <li><strong>Helicone, LangSmith, Langfuse:</strong> tracing + eval combinados.</li>
          <li><strong>Ragas:</strong> especializado em RAG (próxima lição).</li>
          <li><strong>Inspect AI:</strong> framework do UK AI Safety Institute, robusto.</li>
        </ul>
        <p>Padrão típico: defina um dataset de avaliação (prompts + critérios), rode o LLM testado, peça ao juiz nota/comparação, agregue.</p>
      `
    },
    {
      id: 'praticas',
      title: 'Práticas para evaluation confiável',
      body: `
        <ul>
          <li><strong>Defina critérios explícitos.</strong> "Resposta boa" é vago. "Resposta completa, factualmente correta, no tom certo" é melhor. Inclua critérios no prompt do juiz.</li>
          <li><strong>Use chain-of-thought no juiz.</strong> Peça ao juiz que justifique antes de dar nota. Reduz noise.</li>
          <li><strong>Calibre com humano.</strong> Em N exemplos, verifique se o juiz concorda com humanos. Se concordância &lt; 70%, refine prompt do juiz.</li>
          <li><strong>Use múltiplos juízes</strong> quando possível e tome a maioria.</li>
          <li><strong>Inclua adversariais</strong>: prompts edge case, jailbreak, ambíguos.</li>
          <li><strong>Atualize o dataset</strong> regularmente para refletir uso real.</li>
        </ul>
      `
    }
  ],
  whenToUse: [
    'Avaliação automatizada de geração aberta',
    'CI/CD de prompts e modelos',
    'Comparação rápida entre versões',
    'Quando humanos são caros/lentos demais'
  ],
  whenNot: [
    'Decisões críticas — sempre tenha humano no loop',
    'Quando os critérios são subjetivos demais',
    'Sem calibração prévia contra humano'
  ],
  metrics: ['Win rate (pairwise)', 'Likert score (pointwise)', 'Arena Elo', 'MT-Bench, AlpacaEval']
};

window.LESSON_CONTENT['metrics-rag'] = {
  id: 'metrics-rag',
  title: 'Métricas de RAG',
  etapa: 8, etapaName: 'Métricas — IA moderna',
  time: '60 min',
  tags: ['RAG', 'Ragas', 'faithfulness'],
  tagline: '<em>Retrieval</em> + <em>generation</em> = duas fases para medir. Faithfulness, context precision, answer relevance.',
  intro: `
    <p>RAG combina retrieval com generation. Cada etapa pode falhar de jeitos diferentes — e cada uma exige métricas próprias. Esta lição cobre o framework Ragas (padrão de fato) e as métricas que importam.</p>
  `,
  sections: [
    {
      id: 'fases',
      title: 'Onde RAG pode falhar',
      body: `
        <p>Três modos de falha distintos:</p>
        <ol>
          <li><strong>Retrieval ruim:</strong> não encontrou os documentos relevantes. Métricas de IR clássicas (Recall@k, MRR, NDCG).</li>
          <li><strong>Generation ruim:</strong> encontrou o contexto certo, mas gerou resposta errada ou desconectada.</li>
          <li><strong>Faithfulness ruim:</strong> gerou resposta que <em>não está no contexto</em> — alucinou ou contradiz os documentos.</li>
        </ol>
        <p>Sistemas RAG mal-medidos confundem essas falhas. Você troca o modelo de embedding e melhora geração — mas o problema era retrieval, e você quebrou a faithfulness por acidente.</p>
      `
    },
    {
      id: 'retrieval-metrics',
      title: 'Métricas de retrieval',
      body: `
        <p>Requer ground truth: para cada query, quais documentos são relevantes?</p>
        <ul>
          <li><strong>Recall@k:</strong> dos documentos relevantes, quantos estão nos top-k retornados? Métrica mais importante — se o doc não foi retrieve, não importa o LLM.</li>
          <li><strong>MRR:</strong> posição do primeiro relevante. Bom para Q&A onde uma fonte basta.</li>
          <li><strong>NDCG@k:</strong> ranking ponderado por posição.</li>
          <li><strong>Context Precision (Ragas):</strong> dos chunks no contexto enviado ao LLM, quais são realmente relevantes? Avaliado por LLM-as-judge.</li>
        </ul>
        <p>Recall@k é geralmente o gargalo. Foque aqui primeiro.</p>
      `
    },
    {
      id: 'faithfulness',
      title: 'Faithfulness — a métrica mais importante',
      body: `
        <p><strong>Faithfulness</strong>: a resposta gerada é <em>suportada</em> pelo contexto recuperado? Mede alucinação.</p>
        <p>Avaliação típica (Ragas):</p>
        <ol>
          <li>Decomponha a resposta em afirmações individuais.</li>
          <li>Para cada afirmação, pergunte ao LLM-judge: "isso está no contexto?"</li>
          <li>Faithfulness = fração de afirmações suportadas.</li>
        </ol>
        <p>Faithfulness baixo + answer correct = você teve sorte (próxima vez aluciona errado). Faithfulness alto + answer wrong = retrieval ruim.</p>
        <p>É a métrica que mais correlaciona com confiança em produção. Otimizar faithfulness é otimizar para "o usuário pode confiar".</p>
      `
    },
    {
      id: 'answer-relevance',
      title: 'Answer Relevance e Context Relevance',
      body: `
        <p><strong>Answer Relevance</strong>: a resposta efetivamente endereça a pergunta? Mede "respondeu" vs "ficou no genérico".</p>
        <p>Cálculo Ragas: pede ao LLM que gere N perguntas a partir da resposta dada e mede similaridade com a query original. Alta similaridade = resposta on-topic.</p>
        <p><strong>Context Relevance</strong>: o contexto recuperado é relevante à query? Mede ruído no retrieval. Contexto cheio de chunks irrelevantes confunde o LLM e cobra tokens.</p>
        <p>Ambas avaliadas por LLM-judge.</p>
      `
    },
    {
      id: 'ragas-framework',
      title: 'Ragas — framework padrão',
      body: `
        <pre><code>from ragas import evaluate
from ragas.metrics import (
    faithfulness,
    answer_relevancy,
    context_precision,
    context_recall
)

dataset = Dataset.from_dict({
    "question":      ["Qual a capital da França?"],
    "answer":        ["Paris é a capital."],
    "contexts":      [["Paris é a capital e maior cidade da França."]],
    "ground_truth":  ["Paris"]
})

result = evaluate(
    dataset,
    metrics=[faithfulness, answer_relevancy, context_precision, context_recall]
)
print(result)
# {'faithfulness': 0.95, 'answer_relevancy': 0.92, ...}</code></pre>
        <p>Variações: TruLens (parecido), Phoenix (Arize), DeepEval. Ragas tem maior adoção e biblioteca de métricas.</p>
      `
    },
    {
      id: 'business',
      title: 'Métricas de negócio em RAG',
      body: `
        <p>Métricas técnicas (faithfulness) são proxies. Em produção, monitore:</p>
        <ul>
          <li><strong>Citation rate:</strong> fração de respostas com fontes citadas.</li>
          <li><strong>Thumbs up/down ratio</strong> dos usuários.</li>
          <li><strong>Follow-up question rate:</strong> usuário precisou perguntar de novo? Sinal de resposta incompleta.</li>
          <li><strong>Time to answer satisfaction:</strong> número de turnos até resolução.</li>
          <li><strong>Escalation rate:</strong> para suporte humano em chatbots.</li>
          <li><strong>Latência p95</strong> do retrieval + generation.</li>
        </ul>
        <div class="callout tip">
          <strong>PIPELINE</strong>
          Ragas para iterar offline. Métricas de negócio para validar online. Sample manual de respostas semanalmente para sanity check.
        </div>
      `
    }
  ],
  whenToUse: [
    'Qualquer sistema RAG em produção',
    'Otimização de chunking, retrieval, prompts',
    'Comparação entre versões do pipeline',
    'Detecção de drift quando documentos mudam'
  ],
  whenNot: [
    'Sistemas sem retrieval (use métricas de LLM normais)',
    'Sem ground truth e sem orçamento de avaliação'
  ],
  metrics: ['Faithfulness', 'Answer/Context Relevance', 'Recall@k', 'Citation rate']
};

window.LESSON_CONTENT['metrics-agents-safety'] = {
  id: 'metrics-agents-safety',
  title: 'Métricas de Agentes & Segurança',
  etapa: 8, etapaName: 'Métricas — IA moderna',
  time: '75 min',
  tags: ['agents', 'safety', 'jailbreak', 'red-teaming'],
  tagline: 'Agentes têm múltiplos passos, cada um pode falhar. <em>Segurança</em> é métrica obrigatória em produção.',
  intro: `
    <p>Avaliar agentes é um desafio multi-dimensional: cada passo pode falhar, ferramentas podem ser usadas erradamente, o objetivo final pode não ser atingido. Some segurança (toxicidade, jailbreak, viés) e você tem o cenário completo de eval moderno. Esta lição cobre métricas práticas para agentes e o pilar de avaliação de segurança.</p>
  `,
  sections: [
    {
      id: 'task-success',
      title: 'Task Success Rate',
      body: `
        <p>A métrica que mais importa: o agente <strong>completou a tarefa</strong>?</p>
        <p>Variantes:</p>
        <ul>
          <li><strong>Hard success:</strong> binária — completou exatamente como esperado.</li>
          <li><strong>Soft success:</strong> gradual — completou parcialmente, satisfez objetivo principal mesmo se desviou.</li>
          <li><strong>Partial credit:</strong> N subtarefas, fração concluída.</li>
        </ul>
        <p>Como medir:</p>
        <ul>
          <li>Tarefas com saída verificável (código, queries SQL): testes automatizados.</li>
          <li>Tarefas com saída ambígua: LLM-as-judge ou humano.</li>
          <li>Benchmarks: WebArena, AgentBench, SWE-bench.</li>
        </ul>
      `
    },
    {
      id: 'tool-use',
      title: 'Tool Use Accuracy',
      body: `
        <p>Avalia se o agente:</p>
        <ul>
          <li><strong>Escolhe a ferramenta certa</strong> para cada situação.</li>
          <li><strong>Passa parâmetros corretos</strong>.</li>
          <li><strong>Lida com erros</strong> de ferramenta (retry, fallback).</li>
          <li><strong>Não invoca desnecessariamente</strong> (overcall).</li>
        </ul>
        <p>Métricas específicas:</p>
        <ul>
          <li><strong>Tool selection F1</strong>: comparar chamadas reais com chamadas esperadas.</li>
          <li><strong>Argument accuracy</strong>: dos parâmetros, quais foram corretos?</li>
          <li><strong>Recovery rate</strong>: quando tool falha, o agente recupera?</li>
        </ul>
      `
    },
    {
      id: 'efficiency',
      title: 'Eficiência: passos, tempo, custo',
      body: `
        <p>Um agente que completa em 50 passos quando 5 bastariam é ruim mesmo com success rate alto. Métricas de eficiência:</p>
        <ul>
          <li><strong>Steps per task:</strong> número médio de iterações ReAct.</li>
          <li><strong>Tool calls per task:</strong> chamadas externas.</li>
          <li><strong>Total tokens:</strong> input + output ao longo do task.</li>
          <li><strong>Wall-clock time</strong>: latência total.</li>
          <li><strong>Cost per task</strong>: traduzido em $.</li>
        </ul>
        <p>Trade-off: aumentar passos pode melhorar success rate. Otimize a fronteira de Pareto entre os dois.</p>
      `
    },
    {
      id: 'benchmarks-agentes',
      title: 'Benchmarks de agentes',
      body: `
        <ul>
          <li><strong>SWE-bench</strong>: agentes resolvem bugs reais de GitHub. Métrica: % de patches que passam nos testes.</li>
          <li><strong>WebArena</strong>: agentes navegam sites reais (shopping, fórum, GitLab) para tarefas humanas.</li>
          <li><strong>AgentBench</strong>: 8 ambientes, multi-domínio.</li>
          <li><strong>τ-bench (Tau-bench):</strong> simula interações com usuários reais (Anthropic).</li>
          <li><strong>OSWorld</strong>: agentes operam computadores (mouse, teclado, screen).</li>
        </ul>
        <p>Como em LLMs, contaminação e overfitting a benchmarks são problemas reais. Use múltiplos + seus próprios cenários.</p>
      `
    },
    {
      id: 'toxicity-bias',
      title: 'Toxicidade e viés',
      body: `
        <p>Avaliação de segurança em geração:</p>
        <ul>
          <li><strong>Toxicity score:</strong> Perspective API (Google) ou Detoxify (HuggingFace). Output tóxico, ofensivo, ameaçador.</li>
          <li><strong>Bias benchmarks:</strong> BBQ, BOLD, StereoSet — medem viés contra grupos demográficos.</li>
          <li><strong>Sentiment skew</strong>: tom geral consistente entre grupos?</li>
          <li><strong>Demographic parity</strong> em sistemas de classificação que afetam pessoas.</li>
        </ul>
        <p>Padrão moderno: pacotes como <strong>HELM</strong> (Stanford), <strong>Inspect</strong> (UK AISI), <strong>Pyrit</strong> (Microsoft) cobrem múltiplas dimensões.</p>
      `
    },
    {
      id: 'jailbreak',
      title: 'Jailbreak resistance e red-teaming',
      body: `
        <p>Modelos modernos têm guardrails para recusar pedidos perigosos. Avaliação de robustez:</p>
        <ul>
          <li><strong>Jailbreak success rate:</strong> em prompts adversariais (DAN, role-play, indireção), quantos quebram o modelo?</li>
          <li><strong>Refusal accuracy:</strong> dos pedidos legítimos, quantos foram incorretamente recusados ("over-refusal")?</li>
          <li><strong>Harmful output rate</strong> em red-team manual.</li>
        </ul>
        <p>Benchmarks: <strong>HarmBench</strong>, <strong>AdvBench</strong>, <strong>JailbreakBench</strong>. Red-teaming combina prompts conhecidos + criatividade humana.</p>
        <p>Trade-off central: mais robusto a jailbreak = mais over-refusal. Não há free lunch.</p>
      `
    },
    {
      id: 'observability',
      title: 'Observabilidade em produção',
      body: `
        <p>Agentes em produção precisam de:</p>
        <ul>
          <li><strong>Tracing por execução</strong>: cada chamada de LLM, tool, decisão. Tools: LangSmith, Helicone, Langfuse, Phoenix.</li>
          <li><strong>Dashboards de health</strong>: success rate, latência, custo agregados por hora/dia.</li>
          <li><strong>Sampling para review humano</strong>: 1-5% das execuções inspecionadas semanalmente.</li>
          <li><strong>User feedback loops</strong>: thumbs up/down, comentários, escalation rate.</li>
          <li><strong>Regressões automáticas</strong>: CI rodando suite de eval a cada deploy.</li>
        </ul>
        <div class="callout warn">
          <strong>SEM OBSERVABILIDADE = SEM PRODUÇÃO</strong>
          Sistemas de agentes em produção sem tracing são bombas-relógio. Você nunca saberá o que quebrou, quando, ou por quê.
        </div>
      `
    }
  ],
  whenToUse: [
    'Avaliação de agents em CI/CD',
    'Comparação entre frameworks/arquiteturas de agente',
    'Monitoramento de produção',
    'Avaliação de segurança e compliance'
  ],
  whenNot: [
    'Sem orçamento para benchmark consistente',
    'Sem ground truth nem proxies confiáveis'
  ],
  metrics: ['Task Success Rate', 'Tool Accuracy', 'Steps/tokens per task', 'Toxicity, Jailbreak rate', 'Refusal accuracy']
};
