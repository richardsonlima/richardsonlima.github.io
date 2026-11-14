/* Lesson content, Etapas 12 e 13 (lições 71 a 83)
   Master large data e Python em produção.
   Schema em CONTRATO: id, title, etapa, etapaName, time, tags, tagline, intro,
   sections[{id,title,body}], whenToUse[], whenNot[], metrics[], refs[]
*/
window.LESSON_CONTENT = window.LESSON_CONTENT || {};

window.LESSON_CONTENT['pandas-performance'] = {
  id: 'pandas-performance',
  title: 'pandas em alta performance',
  etapa: 12, etapaName: 'Master large data',
  time: '90 min',
  tags: ['pandas', 'dtypes', 'arrow', 'performance'],
  tagline: 'pandas lento quase sempre é pandas usado como Python puro. O ganho real está nos <em>dtypes</em> e na vetorização.',
  intro: `
    <p>Em banco, o primeiro contato com dados grandes costuma ser um extrato de transações em CSV de alguns GB que alguém abriu com <code>pd.read_csv</code> sem argumento nenhum. O processo come 20 GB de RAM, o notebook morre, e a conclusão errada é "pandas não escala". Na maior parte das vezes o problema é outro: colunas de texto em <code>object</code>, inteiros em <code>int64</code> quando cabiam em <code>int32</code>, um <code>apply</code> linha a linha e cópias defensivas espalhadas pelo código.</p>
    <p>Esta lição trata pandas como ele é por dentro: colunas tipadas sobre buffers contíguos (NumPy ou Arrow), operações vetorizadas em C, e a semântica de Copy-on-Write, que virou o único modo a partir do pandas 3.0 (janeiro de 2026). Quem entende esse modelo consegue tirar uma ordem de grandeza de memória e duas ou três de tempo sem trocar de biblioteca.</p>
    <p>Também é a base para as próximas lições: Polars, Arrow, Parquet e DuckDB partem do mesmo princípio colunar. Se você domina dtypes e vetorização aqui, o resto vira questão de engine.</p>
  `,
  sections: [
    {
      id: 'modelo-de-memoria',
      title: 'Como um DataFrame ocupa memória',
      body: `
        <p>Um DataFrame é um conjunto de colunas, cada uma um array tipado. Numéricos são buffers contíguos de NumPy: 1 milhão de <code>float64</code> são exatamente 8 MB. O desastre histórico é o dtype <code>object</code>: o array guarda ponteiros de 8 bytes para objetos Python soltos no heap, cada <code>str</code> com cabeçalho próprio (cerca de 49 bytes mais o conteúdo para ASCII). Além de caro, ele mata a vetorização, porque toda operação vira um laço em Python chamando métodos de objeto.</p>
        <pre><code class="language-python">import numpy as np
import pandas as pd

rng = np.random.default_rng(42)
n = 1_000_000
canais = rng.choice(["pix", "ted", "boleto", "cartao"], n)

as_object = pd.Series(canais, dtype=object)
print(as_object.memory_usage(deep=True) / 1e6)                     # ~53 MB
print(as_object.astype("str").memory_usage(deep=True) / 1e6)       # ~12 MB (Arrow)
print(as_object.astype("category").memory_usage(deep=True) / 1e6)  # ~1 MB</code></pre>
        <p>Os números acima são de uma execução real com pandas 3.1 e pyarrow instalado. Repare no <code>deep=True</code>: sem ele, <code>memory_usage</code> conta só os ponteiros e mente para você. Em produção, a regra é medir antes de otimizar, e medir certo.</p>
        <div class="callout tip"><strong>DICA</strong> <code>df.info(memory_usage="deep")</code> dá o resumo por coluna. Para o processo inteiro, use <code>memray</code> ou o RSS do container: alocações feitas pelo Arrow não aparecem no <code>tracemalloc</code>, que só enxerga o alocador do Python e o que o NumPy reporta a ele.</div>
        <p>Internamente, o pandas ainda agrupa colunas do mesmo dtype NumPy em blocos 2D (o BlockManager). Isso explica por que adicionar colunas uma a uma num laço gera o aviso de DataFrame "altamente fragmentado": cada inserção cria um bloco novo, e operações por linha precisam consolidar tudo. Monte as colunas num <code>dict</code> e construa o DataFrame uma vez, ou use <code>pd.concat(..., axis=1)</code>.</p>
      `
    },
    {
      id: 'dtypes',
      title: 'Escolhendo dtypes: downcast, categorical, nullable e str',
      body: `
        <p>A escolha de dtype é a decisão de maior alavanca. Quatro ferramentas resolvem quase tudo:</p>
        <ul>
          <li><strong>Downcast numérico:</strong> código de agência cabe em <code>int16</code>, número de conta em <code>int32</code> (até cerca de 2,1 bilhões). <code>pd.to_numeric(s, downcast="integer")</code> escolhe o menor tipo seguro. Cuidado com valores monetários: <code>float32</code> tem cerca de 7 dígitos significativos, inaceitável para saldo. Dinheiro vai em inteiro de centavos ou <code>decimal128</code> do Arrow.</li>
          <li><strong>category:</strong> para baixa cardinalidade (canal, UF, tipo de produto). Guarda um dicionário de valores e códigos inteiros. Groupby e comparações viram operações sobre inteiros.</li>
          <li><strong>Nullable (<code>Int64</code>, <code>boolean</code>, <code>Float64</code>):</strong> inteiros com ausentes sem virar <code>float64</code>. Um CPF ou conta que vira <code>1.2345678e+10</code> por causa de um nulo é bug clássico de ETL.</li>
          <li><strong><code>str</code>:</strong> no pandas 3.0, colunas de texto são inferidas como o novo dtype <code>str</code>, apoiado em Arrow quando o pyarrow está instalado (senão cai para object por baixo). Ele só aceita strings ou ausentes, e o sentinela de ausente é <code>NaN</code>.</li>
        </ul>
        <pre><code class="language-python">import pandas as pd

schema = {
    "agencia": "int16",
    "conta": "int32",
    "canal": "category",
    "uf": "category",
    "cpf_cnpj": "str",         # nunca numérico: zeros à esquerda importam
    "valor_centavos": "int64",
    "estornada": "boolean",
}

df = pd.read_csv(
    "transacoes.csv",
    dtype=schema,
    usecols=list(schema) + ["data_hora"],
    parse_dates=["data_hora"],
    engine="pyarrow",          # parser multithread do Arrow
)
df.info(memory_usage="deep")</code></pre>
        <div class="callout warn"><strong>PEGADINHA</strong> <code>category</code> com alta cardinalidade (ID de transação, CPF) é pior que string: o dicionário fica do tamanho da coluna e você ainda paga os códigos. A heurística é cardinalidade bem menor que o número de linhas, algo como menos de 50% e idealmente na casa das dezenas ou milhares.</div>
        <p>Outra armadilha com categóricas é o groupby. Por muito tempo o padrão foi <code>observed=False</code>, que gera todas as combinações do produto cartesiano das categorias, inclusive as vazias. Com duas colunas de mil categorias são um milhão de grupos, quase todos vazios. Escreva <code>observed=True</code> explicitamente, que é o padrão atual e documenta a intenção.</p>
      `
    },
    {
      id: 'arrow-backend',
      title: 'O backend Arrow',
      body: `
        <p>Desde o pandas 2.0, qualquer coluna pode usar <code>ArrowDtype</code> (por exemplo <code>int64[pyarrow]</code>, <code>string[pyarrow]</code>, <code>timestamp[us][pyarrow]</code>). As vantagens concretas: nulos nativos via bitmap de validade para qualquer tipo, strings compactas em buffer contíguo de offsets e bytes, tipos que o NumPy não tem (<code>decimal128</code>, listas, structs) e conversão sem cópia para Parquet, Polars e DuckDB quando os buffers são compatíveis.</p>
        <pre><code class="language-python">import pandas as pd
import pyarrow as pa

# Leitura direto para Arrow, sem passar por NumPy
df = pd.read_parquet("transacoes.parquet", dtype_backend="pyarrow")

# Converter um DataFrame existente
df2 = df.convert_dtypes(dtype_backend="pyarrow")
print(df2.dtypes)
# conta       int64[pyarrow]
# canal      string[pyarrow]
# valor      double[pyarrow]

# Dinheiro com precisão exata
valor = pd.Series(["10.10", "0.20"], dtype=pd.ArrowDtype(pa.decimal128(18, 2)))
print(valor.sum())   # 10.30, sem erro de ponto flutuante</code></pre>
        <p>Não é bala de prata. Algumas operações ainda passam por NumPy e convertem ida e volta, e certas funções (alguns métodos de janela, interop com scikit-learn) esperam arrays NumPy. A abordagem que adoto: Arrow para strings, decimais e colunas com nulos, NumPy para matrizes numéricas densas que vão para modelos. E sempre validar com um benchmark do pipeline real, não com microbenchmark de uma operação.</p>
        <div class="callout"><strong>NA ENTREVISTA</strong> "Por que o pandas 3.0 mudou o tipo de string?" Resposta sênior: object não é um tipo, é um saco de ponteiros. O dtype <code>str</code> garante que a coluna só tem texto (contrato), usa memória contígua (cache e SIMD) e conversa sem cópia com o ecossistema Arrow.</div>
      `
    },
    {
      id: 'copy-on-write',
      title: 'Copy-on-Write: o fim do SettingWithCopyWarning',
      body: `
        <p>Antes do CoW, saber se <code>df[mask]</code> retornava view ou cópia dependia de detalhes internos. Daí o famoso <code>SettingWithCopyWarning</code> e o hábito de enfiar <code>.copy()</code> por todo lado, dobrando memória. No pandas 3.0 o Copy-on-Write é o padrão e o único modo: qualquer resultado de indexação ou método <em>se comporta como cópia</em>, mas a cópia física só acontece quando alguém escreve.</p>
        <pre><code class="language-python">import pandas as pd

df = pd.DataFrame({"conta": [1, 2, 3], "saldo": [100, 200, 300]})

col = df["saldo"]       # sem cópia: compartilha o buffer
col.iloc[0] = -1        # aqui o CoW copia, df não muda
print(df["saldo"].tolist())   # [100, 200, 300]

# Encadeado: NUNCA funciona sob CoW (emite ChainedAssignmentError)
df[df["saldo"] &gt; 150]["saldo"] = 0

# Correto: uma única operação de escrita
df.loc[df["saldo"] &gt; 150, "saldo"] = 0</code></pre>
        <p>Consequências práticas para quem migra de 2.x: remova os <code>.copy()</code> defensivos (eles agora só custam), o argumento <code>copy=</code> de vários métodos foi depreciado e não tem efeito, e a opção <code>mode.copy_on_write</code> não volta ao modelo antigo. O caminho oficial de migração é subir primeiro para pandas 2.3, zerar os avisos, e então ir para 3.0.</p>
        <div class="callout warn"><strong>PEGADINHA</strong> Métodos encadeados (<code>df.rename(...).fillna(...).astype(...)</code>) ficaram mais baratos com CoW, porque passos que não alteram dados compartilham buffers. Mas um <code>inplace=True</code> não é mais "otimização": em 3.0 ele retorna <code>self</code> e pode até forçar cópia se o buffer estiver compartilhado. Prefira o estilo funcional.</div>
      `
    },
    {
      id: 'vetorizacao',
      title: 'Vetorização: matando apply e iterrows',
      body: `
        <p><code>df.apply(f, axis=1)</code> chama uma função Python por linha e monta uma <code>Series</code> para cada uma. <code>iterrows</code> é ainda pior. A regra: expresse a lógica como operações sobre colunas inteiras, que rodam em C.</p>
        <p>Antes (tarifa por canal, lógica linha a linha):</p>
        <pre><code class="language-python">def tarifa(row):
    if row.canal == "pix":
        return 0.0
    elif row.canal == "ted" and row.valor &gt; 1000:
        return 8.5
    elif row.canal == "ted":
        return 4.0
    return row.valor * 0.02

df["tarifa"] = df.apply(tarifa, axis=1)</code></pre>
        <p>Depois (vetorizado com <code>np.select</code>):</p>
        <pre><code class="language-python">import numpy as np

condicoes = [
    df["canal"].eq("pix"),
    df["canal"].eq("ted") &amp; df["valor"].gt(1000),
    df["canal"].eq("ted"),
]
escolhas = [0.0, 8.5, 4.0]
df["tarifa"] = np.select(condicoes, escolhas, default=df["valor"] * 0.02)

# pandas 3.0: expressões com pd.col, sem lambda
df = df.assign(valor_liquido=pd.col("valor") - pd.col("tarifa"))</code></pre>
        <p>Num teste com 1 milhão de linhas, a versão vetorizada foi duas a três ordens de grandeza mais rápida que o <code>apply</code> (o número exato depende da CPU; meça com <code>%timeit</code> no seu hardware). Outros substitutos clássicos:</p>
        <table>
          <thead><tr><th>Padrão lento</th><th>Substituto</th></tr></thead>
          <tbody>
            <tr><td><code>apply</code> com if/else</td><td><code>np.where</code>, <code>np.select</code>, <code>Series.case_when</code></td></tr>
            <tr><td><code>apply</code> com dict lookup</td><td><code>Series.map(dict)</code> ou merge com tabela de referência</td></tr>
            <tr><td>laço que calcula média do grupo por linha</td><td><code>groupby(...).transform("mean")</code></td></tr>
            <tr><td>laço com estado (saldo acumulado)</td><td><code>groupby(...).cumsum()</code>, <code>shift</code>, <code>diff</code></td></tr>
            <tr><td>regex por linha</td><td><code>.str.contains</code>, <code>.str.extract</code> (vetorizados no Arrow)</td></tr>
            <tr><td>lógica numérica sem forma vetorial</td><td>Numba (<code>@njit</code>) ou <code>engine="numba"</code> em rolling/groupby</td></tr>
          </tbody>
        </table>
      `
    },
    {
      id: 'groupby-merge',
      title: 'Groupby, merge e índices sem surpresas',
      body: `
        <p>Groupby e merge são onde pipelines de banco passam mais tempo. Alguns ajustes de baixo custo:</p>
        <ul>
          <li><strong><code>sort=False</code> no groupby</strong> quando a ordem das chaves não importa: evita ordenar as chaves.</li>
          <li><strong>Agregações nomeadas</strong> com funções embutidas (<code>"sum"</code>, <code>"mean"</code>, <code>"nunique"</code>) usam caminhos em Cython. Uma <code>lambda</code> dentro de <code>agg</code> cai no caminho lento por grupo.</li>
          <li><strong>Merge com chaves do mesmo dtype:</strong> juntar <code>int64</code> com <code>object</code> força conversão ou retorna vazio. Valide com <code>validate="many_to_one"</code>, que falha se a tabela de referência tiver chave duplicada (e protege de explosão de linhas).</li>
          <li><strong><code>indicator=True</code></strong> no merge mostra o que não casou, essencial em reconciliação.</li>
        </ul>
        <pre><code class="language-python">resumo = (
    df.groupby(["agencia", "canal"], observed=True, sort=False)
      .agg(
          volume=("valor_centavos", "sum"),
          qtd=("valor_centavos", "size"),
          contas=("conta", "nunique"),
      )
      .reset_index()
)

# Reconciliação: extrato interno vs arquivo da câmara
rec = interno.merge(
    camara, on="id_transacao", how="outer",
    validate="one_to_one", indicator=True, suffixes=("_int", "_cam"),
)
divergentes = rec[rec["_merge"] != "both"]</code></pre>
        <div class="callout tip"><strong>DICA</strong> Para filtros repetidos sobre a mesma chave, um índice ordenado (<code>set_index("conta").sort_index()</code>) transforma buscas com <code>.loc</code> em busca binária. Para uso único, o custo de ordenar não compensa. Índice em pandas é estrutura de acesso, não decoração.</div>
      `
    },
    {
      id: 'limites',
      title: 'Os limites do pandas e quando sair dele',
      body: `
        <p>pandas é eager e majoritariamente single-thread. Cada passo materializa um resultado intermediário completo na memória, e a regra prática que Wes McKinney citava era precisar de 5 a 10 vezes o tamanho do dataset em RAM. O backend Arrow e o CoW melhoram isso, mas não mudam a natureza eager.</p>
        <pre><code class="language-python">import pandas as pd

# Leitura em pedaços para agregações que cabem em acumulador
total = {}
for chunk in pd.read_csv("transacoes.csv", chunksize=2_000_000,
                         dtype={"canal": "category"}, usecols=["canal", "valor_centavos"]):
    parcial = chunk.groupby("canal", observed=True)["valor_centavos"].sum()
    for k, v in parcial.items():
        total[k] = total.get(k, 0) + int(v)
print(total)</code></pre>
        <p>Sinais de que é hora de outra ferramenta: o dataset não cabe com folga na RAM mesmo com dtypes certos; você precisa de joins grandes entre arquivos; a consulta é naturalmente SQL; ou o tempo é dominado por um único núcleo enquanto os outros 15 dormem. Nesses casos, Polars (lazy e multithread) ou DuckDB (SQL vetorizado com spill para disco) resolvem na mesma máquina, e Spark ou Dask quando a máquina não basta. As próximas lições cobrem cada um.</p>
        <div class="callout"><strong>NA ENTREVISTA</strong> "Seu job pandas estourou memória em produção. O que você faz?" Ordem sênior: medir (<code>memory_usage(deep=True)</code>, perfil de pico), corrigir dtypes e ler só as colunas necessárias, eliminar cópias e intermediários, processar em chunks, e só então trocar de engine. Começar por "migrar para Spark" é sinal de quem não mediu.</div>
      `
    }
  ],
  whenToUse: [
    'Datasets que cabem com folga na RAM depois de ajustar dtypes (até alguns GB)',
    'Análise exploratória e prototipação com o ecossistema inteiro disponível (statsmodels, scikit-learn, plotting)',
    'Integração com bibliotecas que esperam DataFrame pandas ou arrays NumPy',
    'Reconciliações e relatórios com lógica rica de índice e séries temporais',
    'Times que já dominam a API e precisam entregar rápido'
  ],
  whenNot: [
    'Dados maiores que a RAM ou próximos dela: prefira Polars lazy, DuckDB ou chunking',
    'Lógica linha a linha que você não consegue vetorizar e que é crítica em latência',
    'Pipelines multi-core pesados onde pandas deixa 90% da CPU ociosa',
    'Valores monetários em float: use inteiro de centavos ou decimal128',
    'Código novo que depende de chained assignment ou de view vs cópia (quebra no pandas 3.0)'
  ],
  metrics: [
    'df.info(memory_usage="deep") e Series.memory_usage(deep=True)',
    '%timeit e perf_counter no pipeline real, não em microbenchmarks isolados',
    'memray ou RSS do processo para pico de memória (tracemalloc não vê o Arrow)',
    'Zero ChainedAssignmentError e zero avisos de deprecação no pandas 2.3 antes de migrar',
    'Proporção de colunas object restantes (meta: nenhuma)',
    'merge(..., validate=...) e indicator=True em toda junção crítica'
  ],
  refs: [
    { type: 'livro', title: 'Python for Data Analysis, 3rd Edition', author: 'Wes McKinney', url: 'https://wesmckinney.com/book/', note: 'O livro do criador do pandas, com a edição completa aberta no site.' },
    { type: 'doc', title: 'What is new in pandas 3.0.0', author: 'pandas development team', url: 'https://pandas.pydata.org/docs/whatsnew/v3.0.0.html', note: 'Fonte oficial sobre o dtype str, CoW como modo único e pd.col.' },
    { type: 'doc', title: 'Copy-on-Write (CoW)', author: 'pandas development team', url: 'https://pandas.pydata.org/docs/user_guide/copy_on_write.html', note: 'Explica a semântica e os padrões de migração.' },
    { type: 'doc', title: 'PyArrow Functionality', author: 'pandas development team', url: 'https://pandas.pydata.org/docs/user_guide/pyarrow.html', note: 'ArrowDtype, dtype_backend e leitores com engine pyarrow.' },
    { type: 'doc', title: 'Enhancing performance', author: 'pandas development team', url: 'https://pandas.pydata.org/docs/user_guide/enhancingperf.html', note: 'Cython, Numba e eval com medições oficiais.' },
    { type: 'livro', title: 'Effective Pandas 2', author: 'Matt Harrison', url: 'https://store.metasnake.com/effective-pandas-book', note: 'Estilo encadeado, dtypes corretos e por que evitar apply.' },
    { type: 'artigo', title: 'Apache Arrow and the 10 Things I Hate About pandas', author: 'Wes McKinney', url: 'https://wesmckinney.com/blog/apache-arrow-pandas-internals/', note: 'O diagnóstico do próprio autor sobre memória e object dtype, que motivou o Arrow.' }
  ]
};

window.LESSON_CONTENT['polars'] = {
  id: 'polars',
  title: 'Polars e lazy evaluation',
  etapa: 12, etapaName: 'Master large data',
  time: '90 min',
  tags: ['polars', 'lazy', 'query-optimizer', 'streaming'],
  tagline: 'Você descreve o resultado, o otimizador decide o caminho. Polars é um banco de dados <em>colunar</em> disfarçado de DataFrame.',
  intro: `
    <p>Polars é uma engine de DataFrame escrita em Rust sobre o formato de memória Arrow. A diferença para pandas não é só velocidade: é o modelo. Em vez de executar cada linha de código imediatamente, você constrói uma consulta (um <code>LazyFrame</code>), e um otimizador reescreve o plano antes de rodar: empurra filtros para a leitura, lê só as colunas usadas, elimina subexpressões repetidas e paraleliza em todos os núcleos.</p>
    <p>Em outubro de 2026 saiu o Polars 2.0, cuja mudança central é que <code>collect()</code> passou a usar a engine de streaming por padrão. Isso significa processar em lotes, com memória controlada, e também significa que operações como join e group_by deixaram de garantir ordem de linhas. Quem escrevia código contando com a ordem precisa revisar.</p>
    <p>Para quem opera dados de banco, Polars é muitas vezes o caminho mais curto entre "o pandas não aguenta" e "precisamos de um cluster": um único servidor com 32 núcleos e Polars lazy processa volumes que antes iam para Spark.</p>
  `,
  sections: [
    {
      id: 'expressoes',
      title: 'Expressões: a unidade de composição',
      body: `
        <p>Tudo em Polars é uma expressão (<code>pl.Expr</code>): uma descrição de computação sobre colunas que só é avaliada dentro de um contexto (<code>select</code>, <code>with_columns</code>, <code>filter</code>, <code>group_by().agg</code>). Expressões são puras e independentes, então o Polars roda as de um mesmo contexto em paralelo.</p>
        <pre><code class="language-python">import polars as pl

df = pl.read_parquet("transacoes.parquet")

resultado = df.with_columns(
    valor_reais=pl.col("valor_centavos") / 100,
    eh_pix=pl.col("canal") == "pix",
    # média e desvio por conta, sem groupby + merge
    z_conta=(pl.col("valor_centavos") - pl.col("valor_centavos").mean().over("conta"))
            / pl.col("valor_centavos").std().over("conta"),
).filter(
    pl.col("z_conta").abs() &gt; 4
)</code></pre>
        <p>Repare no <code>.over("conta")</code>: é uma window function, o equivalente a <code>groupby().transform()</code>, sem materializar tabela intermediária. Para quem vem de SQL, a tradução é direta: <code>AVG(valor) OVER (PARTITION BY conta)</code>.</p>
        <p>Antes e depois, para fixar a mudança de mentalidade:</p>
        <pre><code class="language-python"># Estilo pandas traduzido literalmente (ruim): sai do motor Rust
df.with_columns(
    pl.col("canal").map_elements(lambda c: c.upper(), return_dtype=pl.String)
)

# Estilo Polars: expressão nativa, vetorizada e paralela
df.with_columns(pl.col("canal").str.to_uppercase())</code></pre>
        <div class="callout warn"><strong>PEGADINHA</strong> <code>map_elements</code> executa uma função Python por valor, com GIL, e desliga as otimizações do plano. O Polars até avisa quando detecta que a lambda tem equivalente nativo. Trate todo <code>map_elements</code> em código de produção como dívida a justificar.</div>
      `
    },
    {
      id: 'lazy',
      title: 'LazyFrame e o otimizador de consultas',
      body: `
        <p>Trocar <code>read_parquet</code> por <code>scan_parquet</code> muda tudo: nada é lido até o <code>collect()</code>. O plano lógico passa por regras de otimização parecidas com as de um SGBD:</p>
        <ul>
          <li><strong>Predicate pushdown:</strong> filtros descem até o leitor, que pula row groups do Parquet cujas estatísticas excluem o predicado.</li>
          <li><strong>Projection pushdown:</strong> só as colunas referenciadas são lidas do disco.</li>
          <li><strong>Slice pushdown:</strong> um <code>head(100)</code> não lê o arquivo inteiro.</li>
          <li><strong>Common subplan/subexpression elimination:</strong> expressões repetidas são calculadas uma vez.</li>
          <li><strong>Simplificação de expressões e coerção de tipos</strong> antes da execução.</li>
        </ul>
        <pre><code class="language-python">import polars as pl

q = (
    pl.scan_parquet("data/transacoes/**/*.parquet")
      .filter(pl.col("canal") == "pix")
      .group_by("conta")
      .agg(total=pl.col("valor").sum(), n=pl.len())
      .filter(pl.col("total") &gt; 1000)
      .sort("total", descending=True)
)
print(q.explain())   # plano otimizado</code></pre>
        <p>Saída real (resumida) de <code>explain()</code> num arquivo com 4 colunas:</p>
        <pre><code class="language-text">SORT BY [descending: [true]] [col("total")]
  FILTER col("total") &gt; 1000.0
  FROM
    AGGREGATE[maintain_order: false]
      [col("valor").sum().alias("total"), len().alias("n")] BY [col("conta")]
      FROM
      simple π 2/2 ["conta", "valor"]
        Parquet SCAN [tx.parquet]
        PROJECT 3/4 COLUMNS
        SELECTION: col("canal") == "pix"</code></pre>
        <p>Leia de baixo para cima: o filtro virou <code>SELECTION</code> dentro do scan e só 3 de 4 colunas são lidas. É esse plano que você revisa em code review de pipeline pesado, do mesmo jeito que revisaria um <code>EXPLAIN</code> de SQL.</p>
      `
    },
    {
      id: 'streaming',
      title: 'Engine de streaming e Polars 2.0',
      body: `
        <p>A engine in-memory materializa cada operador por inteiro. A engine de streaming, reescrita ao longo de 2025 e padrão no Polars 2.0, processa o plano em morsels (lotes) que fluem entre operadores em paralelo. Resultado: pico de memória menor e, na maioria das consultas, mais velocidade. Para escrever resultados maiores que a RAM, use os <code>sink_*</code>, que gravam direto em disco sem materializar o DataFrame final.</p>
        <pre><code class="language-python">import polars as pl

lf = pl.scan_parquet("data/transacoes/**/*.parquet")

# Polars 2.x: streaming é o padrão de collect()
df = lf.filter(pl.col("valor") &gt; 0).collect()

# Explícito, útil em código que precisa rodar em 1.x e 2.x
df = lf.collect(engine="streaming")

# Resultado maior que a RAM: grava em disco em lotes
(lf.filter(pl.col("canal") == "pix")
   .with_columns(ano=pl.col("data").dt.year())
   .sink_parquet("saida/pix.parquet"))

# Voltar ao comportamento antigo, por consulta ou por processo
df = lf.collect(engine="in-memory")
pl.Config.set_engine_affinity("in-memory")</code></pre>
        <div class="callout warn"><strong>PEGADINHA</strong> Na engine de streaming, <code>join</code>, <code>group_by</code> e <code>unpivot</code> não garantem ordem de linhas. Teste de snapshot que compara DataFrames linha a linha começa a falhar de forma intermitente. Ordene explicitamente (<code>sort</code>) antes de comparar, ou use <code>maintain_order=True</code> onde a ordem é requisito (com custo).</div>
        <p>Outras mudanças do 2.0 que pegam quem migra: <code>melt</code> foi removido em favor de <code>unpivot</code>, <code>join_nulls</code> virou <code>nulls_equal</code>, e casts de string para data foram removidos (use <code>.str.to_date()</code>). A recomendação oficial é rodar a suíte de testes com o RC e ler o guia de upgrade antes de subir a versão em produção.</p>
      `
    },
    {
      id: 'joins-e-agregacoes',
      title: 'Joins, asof joins e agregações temporais',
      body: `
        <p>Em dados financeiros, dois tipos de join aparecem o tempo todo: o join exato por chave e o <em>asof join</em>, que casa cada evento com o registro mais recente anterior a ele (cotação vigente no momento da operação, limite de crédito vigente na hora da compra).</p>
        <pre><code class="language-python">import polars as pl

operacoes = pl.scan_parquet("ops.parquet").sort("ts")
cotacoes = pl.scan_parquet("cotacoes.parquet").sort("ts")

com_preco = operacoes.join_asof(
    cotacoes, on="ts", by="ativo", strategy="backward",
    tolerance="5m",          # cotação com mais de 5 min não vale
)

# Agregação em janelas de tempo (OHLC por minuto)
ohlc = (
    cotacoes.group_by_dynamic("ts", every="1m", group_by="ativo")
            .agg(
                abertura=pl.col("preco").first(),
                maxima=pl.col("preco").max(),
                minima=pl.col("preco").min(),
                fechamento=pl.col("preco").last(),
            )
)
print(ohlc.collect())</code></pre>
        <p>Asof join exige as duas tabelas ordenadas pela chave temporal. A tolerância é decisão de negócio: sem ela, uma cotação de ontem pode ser usada para precificar uma operação de hoje, e isso não gera erro, gera número errado.</p>
        <div class="callout tip"><strong>DICA</strong> Para checar join suspeito, use <code>validate="m:1"</code> no <code>join</code>, que falha se o lado direito tiver chave duplicada. É a mesma proteção do <code>validate</code> do pandas contra explosão de cardinalidade.</div>
      `
    },
    {
      id: 'tipos-e-interop',
      title: 'Tipos estritos e interoperabilidade',
      body: `
        <p>Polars é estrito: não existe dtype <code>object</code> genérico para colunas normais, nulos são nativos em qualquer tipo, e <code>Decimal</code>, <code>Enum</code> (categorias fixas conhecidas) e tipos aninhados (<code>List</code>, <code>Struct</code>) são de primeira classe. Erros de tipo aparecem cedo, na construção do plano, em vez de virar NaN silencioso no meio do pipeline.</p>
        <pre><code class="language-python">import polars as pl

Canal = pl.Enum(["pix", "ted", "boleto", "cartao"])

schema = {
    "conta": pl.Int32,
    "canal": Canal,                    # valor fora da lista falha
    "valor": pl.Decimal(18, 2),
    "ts": pl.Datetime("us", "America/Sao_Paulo"),
}
lf = pl.scan_csv("transacoes.csv", schema_overrides=schema)
print(lf.collect_schema())

# Interop: Arrow por baixo, conversão barata
df = lf.collect()
tabela_arrow = df.to_arrow()           # zero-copy na maioria dos tipos
df_pandas = df.to_pandas(use_pyarrow_extension_array=True)
de_volta = pl.from_pandas(df_pandas)</code></pre>
        <p>Polars também expõe SQL (<code>pl.SQLContext</code> e <code>df.sql(...)</code>) e lê de bancos via <code>pl.read_database_uri</code> (ConnectorX ou ADBC). Para integrar com DuckDB, o caminho é Arrow: o DuckDB consulta um DataFrame Polars direto pelo nome da variável.</p>
      `
    },
    {
      id: 'polars-vs-pandas',
      title: 'Polars vs pandas: decisão honesta',
      body: `
        <table>
          <thead><tr><th>Critério</th><th>pandas 3.x</th><th>Polars 2.x</th></tr></thead>
          <tbody>
            <tr><td>Execução</td><td>Eager, majoritariamente single-thread</td><td>Lazy com otimizador, multithread</td></tr>
            <tr><td>Maior que a RAM</td><td>Só com chunking manual</td><td>Streaming e <code>sink_*</code></td></tr>
            <tr><td>Índice</td><td>Rico (MultiIndex, alinhamento)</td><td>Não tem índice: tudo é coluna</td></tr>
            <tr><td>Ecossistema</td><td>Enorme (statsmodels, plotting, scikit-learn)</td><td>Crescente, interop via Arrow</td></tr>
            <tr><td>API</td><td>Grande, com muitas formas de fazer a mesma coisa</td><td>Pequena e composicional</td></tr>
            <tr><td>Ordem de linhas</td><td>Preservada</td><td>Não garantida em join/group_by no streaming</td></tr>
          </tbody>
        </table>
        <p>Benchmarks públicos (como o PDS-H, derivado do TPC-H, mantido pelo próprio projeto) mostram Polars bem à frente de pandas em consultas analíticas, mas números de terceiros variam com versão e hardware. A forma correta de decidir é portar o passo mais caro do seu pipeline e medir tempo e pico de memória lado a lado.</p>
        <div class="callout"><strong>NA ENTREVISTA</strong> "Por que lazy é mais rápido?" Porque o otimizador vê o plano inteiro: pode ler menos dados (pushdown), evitar intermediários e escolher a ordem das operações. Eager só vê uma operação por vez. É o mesmo argumento de SQL declarativo versus código imperativo.</div>
      `
    },
    {
      id: 'producao',
      title: 'Polars em produção',
      body: `
        <p>Checklist que uso ao colocar um pipeline Polars em produção:</p>
        <ul>
          <li>Começar sempre com <code>scan_*</code> e terminar com <code>sink_*</code> ou <code>collect</code> uma vez. Múltiplos <code>collect</code> no meio desfazem a otimização.</li>
          <li>Fixar a versão no lockfile. Polars evolui rápido e o 2.0 mudou semântica de ordem.</li>
          <li>Controlar threads com a variável <code>POLARS_MAX_THREADS</code> em containers: por padrão ele usa todos os núcleos que enxerga, o que pode brigar com o limite de CPU do cgroup.</li>
          <li>Em CPUs antigas sem AVX2, instalar <code>polars[rtcompat]</code>; o pacote padrão avisa e pode falhar com instrução ilegal.</li>
          <li>Validar schema na entrada com <code>collect_schema()</code> ou pandera, antes de rodar o plano caro.</li>
        </ul>
        <pre><code class="language-python">import os
import polars as pl

os.environ.setdefault("POLARS_MAX_THREADS", "8")   # antes de importar em produção

def pipeline(origem: str, destino: str) -&gt; None:
    esperado = {"conta": pl.Int32, "valor": pl.Float64, "canal": pl.String}
    lf = pl.scan_parquet(origem)
    schema = lf.collect_schema()
    faltando = {c for c in esperado if c not in schema}
    if faltando:
        raise ValueError(f"colunas ausentes: {sorted(faltando)}")
    (lf.filter(pl.col("valor") &gt; 0)
       .group_by("conta", "canal")
       .agg(pl.col("valor").sum().alias("total"))
       .sort("conta", "canal")              # ordem determinística no arquivo final
       .sink_parquet(destino))</code></pre>
      `
    }
  ],
  whenToUse: [
    'Dados de alguns GB a centenas de GB numa única máquina',
    'Pipelines de transformação com muitas etapas encadeadas que se beneficiam do otimizador',
    'Leitura seletiva de Parquet particionado (pushdown de filtro e projeção)',
    'Séries temporais financeiras com asof join e janelas dinâmicas',
    'Substituir jobs Spark pequenos que custam mais em cluster do que valem'
  ],
  whenNot: [
    'Quando o time e o ecossistema dependem pesadamente de índice e APIs do pandas',
    'Lógica que só existe como função Python por linha (map_elements anula o ganho)',
    'Dados que exigem cluster por volume ou por SLA de tempo (Spark, Dask, Ray)',
    'Código que depende de ordem de linhas após join ou group_by sem ordenar explicitamente',
    'CPUs sem AVX2 com o pacote padrão (use polars[rtcompat])'
  ],
  metrics: [
    'LazyFrame.explain() e show_graph() para revisar o plano',
    'LazyFrame.profile() para tempo por operador',
    'Pico de memória do processo comparando engine in-memory e streaming',
    'POLARS_MAX_THREADS alinhado ao limite de CPU do container',
    'Quantidade de map_elements no código (meta: zero no caminho quente)',
    'Testes de igualdade com polars.testing.assert_frame_equal após sort explícito'
  ],
  refs: [
    { type: 'doc', title: 'Polars User Guide', author: 'Polars', url: 'https://docs.pola.rs/', note: 'Guia oficial com expressões, lazy API e streaming.' },
    { type: 'artigo', title: 'Announcing Polars 2.0', author: 'Polars', url: 'https://pola.rs/posts/announcing-polars-2/', note: 'Streaming como padrão, ordem de linhas e mudanças de API.' },
    { type: 'doc', title: 'Upgrade guide: Polars 2', author: 'Polars', url: 'https://docs.pola.rs/releases/upgrade/2/', note: 'Lista completa de quebras e como migrar.' },
    { type: 'doc', title: 'Polars Python API reference: LazyFrame', author: 'Polars', url: 'https://docs.pola.rs/api/python/stable/reference/lazyframe/index.html', note: 'Referência de collect, sink_*, explain e profile.' },
    { type: 'artigo', title: 'Polars Decision Support (PDS) benchmarks', author: 'Polars', url: 'https://pola.rs/posts/benchmarks/', note: 'Benchmark derivado do TPC-H com metodologia publicada.' },
    { type: 'livro', title: 'Python Polars: The Definitive Guide', author: 'Jeroen Janssens e Thijs Nieuwdorp', url: 'https://www.oreilly.com/library/view/python-polars-the/9781098156077/', note: 'O livro de referência sobre Polars, escrito com acesso ao time do projeto.' },
    { type: 'livro', title: 'Python for Data Analysis, 3rd Edition', author: 'Wes McKinney', url: 'https://wesmckinney.com/book/', note: 'Base conceitual de DataFrames, útil para comparar os modelos.' }
  ]
};

window.LESSON_CONTENT['arrow-parquet'] = {
  id: 'arrow-parquet',
  title: 'Apache Arrow e Parquet',
  etapa: 12, etapaName: 'Master large data',
  time: '75 min',
  tags: ['arrow', 'parquet', 'colunar', 'data-lake'],
  tagline: 'Arrow é o formato da memória, Parquet é o formato do disco. Juntos, são a <em>língua franca</em> dos dados analíticos.',
  intro: `
    <p>Durante anos, cada ferramenta de dados tinha seu próprio formato em memória. Passar dados do Spark para o pandas, ou do banco para o Python, significava serializar e desserializar linha a linha, e esse custo muitas vezes dominava o pipeline. O Apache Arrow nasceu em 2016 para resolver isso: um layout colunar em memória padronizado, independente de linguagem, que permite a duas engines compartilharem dados sem cópia.</p>
    <p>O Parquet resolve o problema complementar, no disco. É um formato colunar de arquivo, derivado das ideias do Dremel (Google, 2010), com compressão por coluna, estatísticas por bloco e esquema embutido. Ler 3 de 200 colunas de um Parquet custa aproximadamente 3/200 do I/O, e filtros podem pular blocos inteiros sem descomprimir.</p>
    <p>Em banco, isso é a base do data lake: extratos, eventos de cartão, logs de autorização, tudo em Parquet particionado no object storage, consultado por Spark, DuckDB, Polars ou Trino. Entender row groups e particionamento é a diferença entre uma consulta de 2 segundos e uma de 20 minutos.</p>
  `,
  sections: [
    {
      id: 'layout-arrow',
      title: 'O layout de memória do Arrow',
      body: `
        <p>Um array Arrow é um conjunto de buffers contíguos e alinhados (a especificação recomenda alinhamento de 64 bytes, pensando em SIMD):</p>
        <ul>
          <li><strong>Bitmap de validade:</strong> 1 bit por valor indica se é nulo. Um array sem nulos pode omitir esse buffer.</li>
          <li><strong>Buffer de valores:</strong> para tipos de largura fixa (int64, double, timestamp), os valores lado a lado.</li>
          <li><strong>Offsets + dados:</strong> para tipos de largura variável (string, binary), um buffer de offsets inteiros e um buffer com todos os bytes concatenados. A string i é <code>dados[offsets[i]:offsets[i+1]]</code>.</li>
        </ul>
        <pre><code class="language-python">import pyarrow as pa

arr = pa.array([1, 2, None, 4], type=pa.int64())
print(arr.buffers())
# [Buffer size=1  (bitmap de validade),
#  Buffer size=32 (4 valores x 8 bytes)]

nomes = pa.array(["pix", "ted", "boleto"])
validade, offsets, dados = nomes.buffers()
import numpy as np
print(np.frombuffer(offsets, dtype=np.int32))   # [ 0  3  6 12]
print(dados.to_pybytes())                       # b"pixtedboleto"</code></pre>
        <p>Uma <code>RecordBatch</code> é um conjunto de arrays de mesmo comprimento com um schema; uma <code>Table</code> é uma sequência de record batches (colunas "chunked"). Esse desenho permite processamento em streaming: lote a lote, sem montar a tabela inteira.</p>
        <div class="callout tip"><strong>DICA</strong> Arrow também define <em>dictionary encoding</em> (equivalente ao category do pandas) e, mais recentemente, layouts como string view, que guarda prefixos inline para acelerar comparações. Engines como Polars e DuckDB usam variantes desses layouts internamente e convertem na fronteira.</div>
      `
    },
    {
      id: 'zero-copy',
      title: 'Zero-copy e a fronteira entre engines',
      body: `
        <p>Zero-copy significa que duas bibliotecas apontam para os mesmos buffers. Funciona quando o layout é compatível: inteiros e floats sem nulos viram arrays NumPy sem cópia; com nulos, não, porque NumPy não tem bitmap de validade.</p>
        <pre><code class="language-python">import pyarrow as pa

sem_nulos = pa.array([1, 2, 3, 4])
print(sem_nulos.to_numpy(zero_copy_only=True))     # ok, mesmo buffer

com_nulos = pa.array([1, 2, None, 4])
try:
    com_nulos.to_numpy(zero_copy_only=True)
except pa.ArrowInvalid as e:
    print("exige cópia:", e)
print(com_nulos.to_numpy(zero_copy_only=False))    # [ 1.  2. nan  4.] (cópia, vira float)</code></pre>
        <p>A interface padrão para trocar dados entre bibliotecas sem depender do pyarrow é a <strong>Arrow PyCapsule Interface</strong> (<code>__arrow_c_stream__</code>, <code>__arrow_c_array__</code>): o pandas 3.0 ganhou <code>DataFrame.from_arrow()</code>, e Polars e DuckDB aceitam qualquer objeto que exponha esses métodos. Por baixo está a Arrow C Data Interface, um par de structs C estáveis que qualquer linguagem consegue ler.</p>
        <p>Para mover dados pela rede, existe o <strong>Arrow Flight</strong>: um framework RPC sobre gRPC que envia record batches Arrow sem serializar linha a linha. O Flight SQL usa isso como protocolo de banco, e o ADBC (Arrow Database Connectivity) é a alternativa colunar ao ODBC/JDBC. Quando um driver de banco retorna Arrow direto, você elimina a conversão linha a linha para objetos Python, que costuma ser o gargalo em extrações grandes.</p>
        <div class="callout"><strong>NA ENTREVISTA</strong> "O que é zero-copy de verdade?" Não é mágica: é layout compatível mais ownership compartilhado (refcount nos buffers). Se o consumidor precisa de outro layout (nulos como NaN, strings como objetos Python), há cópia. Saber onde ela acontece é o que importa.</div>
      `
    },
    {
      id: 'parquet-por-dentro',
      title: 'Parquet por dentro: row groups, páginas e estatísticas',
      body: `
        <p>A anatomia de um arquivo Parquet:</p>
        <ul>
          <li><strong>Row groups:</strong> partições horizontais do arquivo (tipicamente de dezenas de MB a 1 GB, ou um número fixo de linhas). Unidade de paralelismo e de skipping.</li>
          <li><strong>Column chunks:</strong> dentro de cada row group, os dados de cada coluna ficam juntos.</li>
          <li><strong>Páginas:</strong> subdivisões do column chunk, unidade de compressão e codificação (dictionary, RLE, bit-packing, delta).</li>
          <li><strong>Footer:</strong> no fim do arquivo, o schema e os metadados de cada row group, incluindo estatísticas min/max/null_count por coluna. Leitores começam lendo o footer.</li>
        </ul>
        <pre><code class="language-python">import pyarrow.parquet as pq

pf = pq.ParquetFile("tx.parquet")
md = pf.metadata
print(md.num_row_groups, md.num_rows)
stats = md.row_group(0).column(2).statistics
print(stats.min, stats.max, stats.null_count)

# Leitura seletiva: projeção + filtro com skipping por estatística
tabela = pq.read_table(
    "tx.parquet",
    columns=["conta", "valor"],
    filters=[("valor", "&gt;", 400)],
)
print(tabela.num_rows)</code></pre>
        <p>O <em>predicate pushdown</em> funciona assim: para <code>valor &gt; 400</code>, todo row group cujo <code>max</code> de <code>valor</code> seja menor ou igual a 400 é pulado sem ler um byte de dados. Isso só ajuda se os dados estiverem <strong>organizados</strong>: se cada row group tem valores do mínimo ao máximo global, as estatísticas não excluem nada. Ordenar (ou clusterizar) pela coluna de filtro mais comum antes de gravar é o que faz o skipping funcionar.</p>
        <div class="callout warn"><strong>PEGADINHA</strong> Row groups pequenos demais (milhares de linhas) inflam o footer e criam overhead de I/O por requisição no S3. Grandes demais reduzem paralelismo e skipping. Comece com algo entre 128 MB e 512 MB descomprimidos, ou na casa de 1 milhão de linhas, e meça.</div>
      `
    },
    {
      id: 'compressao-encoding',
      title: 'Compressão e encoding',
      body: `
        <p>Parquet comprime bem por dois motivos: valores de uma coluna são parecidos entre si, e o encoding (dictionary, RLE, delta) atua antes do codec. A escolha do codec é um trade-off de CPU versus bytes:</p>
        <table>
          <thead><tr><th>Codec</th><th>Perfil</th><th>Uso típico</th></tr></thead>
          <tbody>
            <tr><td>Snappy</td><td>Muito rápido, taxa moderada</td><td>Padrão histórico do Spark, dados quentes</td></tr>
            <tr><td>ZSTD</td><td>Taxa bem melhor, velocidade boa, nível ajustável</td><td>Padrão moderno para lakes; bom equilíbrio</td></tr>
            <tr><td>LZ4</td><td>Descompressão muito rápida</td><td>Leitura intensiva e latência baixa</td></tr>
            <tr><td>GZIP</td><td>Lento, taxa boa</td><td>Legado; prefira ZSTD</td></tr>
          </tbody>
        </table>
        <pre><code class="language-python">import pyarrow.parquet as pq

pq.write_table(
    tabela,
    "tx_zstd.parquet",
    compression="zstd",
    compression_level=3,
    row_group_size=1_000_000,
    use_dictionary=["canal", "uf"],      # baixa cardinalidade
    write_statistics=True,
)</code></pre>
        <p>Números de taxa de compressão variam muito com os dados; não confie em tabela de blog. Grave uma amostra representativa com cada codec e compare tamanho e tempo de leitura da consulta típica. Em object storage, onde se paga por byte armazenado e por requisição, a diferença entre Snappy e ZSTD aparece na fatura.</p>
      `
    },
    {
      id: 'particionamento-hive',
      title: 'Particionamento Hive e datasets',
      body: `
        <p>Particionamento estilo Hive codifica valores de colunas no caminho: <code>lake/ano=2026/mes=3/part-0.parquet</code>. Consultas que filtram por <code>ano</code> e <code>mes</code> pulam diretórios inteiros (partition pruning), sem nem abrir footers.</p>
        <pre><code class="language-python">import pyarrow.dataset as ds
import pyarrow.compute as pc

ds.write_dataset(
    tabela, "lake", format="parquet",
    partitioning=["ano", "mes"], partitioning_flavor="hive",
    existing_data_behavior="overwrite_or_ignore",
)

lake = ds.dataset("lake", format="parquet", partitioning="hive")
resultado = lake.to_table(
    columns=["conta", "valor"],
    filter=(pc.field("mes") == 3) &amp; (pc.field("valor") &gt; 300),
)</code></pre>
        <p>Regras de bolso para escolher a chave de partição:</p>
        <ul>
          <li>Particione pela coluna mais usada em filtros de igualdade ou intervalo (quase sempre data de referência).</li>
          <li>Evite alta cardinalidade: particionar por <code>conta</code> gera milhões de diretórios com arquivos minúsculos (o "small files problem"), que destrói a performance de listagem no S3.</li>
          <li>Mire em arquivos de centenas de MB. Se cada partição diária tem 5 MB, particione por mês.</li>
          <li>Dentro da partição, ordene pela segunda coluna de filtro mais comum para as estatísticas de row group funcionarem.</li>
        </ul>
        <div class="callout tip"><strong>DICA</strong> Formatos de tabela como Delta Lake, Apache Iceberg e Apache Hudi adicionam uma camada de metadados sobre os Parquets: transações ACID, schema evolution, time travel e particionamento oculto (no Iceberg, você filtra por <code>data</code> e o planner deriva a partição). Em lake corporativo de banco, onde auditoria exige reproduzir o estado de uma tabela numa data, eles são praticamente obrigatórios.</div>
      `
    },
    {
      id: 'dremel-aninhados',
      title: 'Dados aninhados e a herança do Dremel',
      body: `
        <p>O Parquet implementa o algoritmo de <em>record shredding</em> do paper do Dremel (Melnik et al., 2010): estruturas aninhadas (listas, structs, mapas) são achatadas em colunas folha, com <em>repetition levels</em> e <em>definition levels</em> que permitem reconstruir o registro original. Na prática, isso deixa você guardar um evento de autorização com uma lista de regras antifraude disparadas sem desnormalizar em tabela auxiliar.</p>
        <pre><code class="language-python">import pyarrow as pa
import pyarrow.parquet as pq

eventos = pa.table({
    "id": [1, 2],
    "regras": [["velocidade", "geo"], []],
    "cartao": [{"bin": "123456", "pais": "BR"}, {"bin": "654321", "pais": "US"}],
})
pq.write_table(eventos, "eventos.parquet")

# Ler só um campo do struct: só essa coluna folha é lida
print(pq.read_table("eventos.parquet", columns=["cartao.pais"]))</code></pre>
        <p>É o mesmo princípio colunar aplicado à hierarquia: ler <code>cartao.pais</code> não toca no <code>bin</code>. O custo é complexidade de schema evolution: adicionar campo a struct é tranquilo; mudar tipo de campo aninhado costuma exigir reescrita.</p>
      `
    },
    {
      id: 'armadilhas',
      title: 'Armadilhas de produção',
      body: `
        <ul>
          <li><strong>Timestamps e timezone:</strong> grave sempre em UTC com unidade explícita (<code>timestamp[us, tz=UTC]</code>). Misturar <code>ns</code> e <code>us</code> entre engines gera erros de cast ou overflow em datas distantes (contratos de 30 anos ainda cabem, mas datas sentinela como 9999-12-31 estouram em <code>ns</code>).</li>
          <li><strong>Decimal:</strong> valores monetários em <code>decimal128(p, s)</code>; float em Parquet de contabilidade é um incidente de auditoria esperando para acontecer.</li>
          <li><strong>Schema drift:</strong> arquivos do mesmo dataset com tipos diferentes (<code>int32</code> num dia, <code>int64</code> no outro) quebram a leitura unificada. Defina o schema explicitamente na escrita.</li>
          <li><strong>Escrita não atômica:</strong> um job que falha no meio deixa arquivos parciais no diretório. Escreva em caminho temporário e renomeie, ou use Delta/Iceberg, que commitam de forma atômica.</li>
        </ul>
        <pre><code class="language-python">import pyarrow as pa

SCHEMA_TX = pa.schema([
    pa.field("id_transacao", pa.string(), nullable=False),
    pa.field("conta", pa.int32(), nullable=False),
    pa.field("valor", pa.decimal128(18, 2), nullable=False),
    pa.field("ts", pa.timestamp("us", tz="UTC"), nullable=False),
    pa.field("canal", pa.dictionary(pa.int8(), pa.string())),
])

def normalizar(tabela: pa.Table) -&gt; pa.Table:
    # cast falha alto se um valor não couber: melhor que corromper o lake
    return tabela.select(SCHEMA_TX.names).cast(SCHEMA_TX)</code></pre>
      `
    }
  ],
  whenToUse: [
    'Armazenamento analítico de qualquer volume que será lido por colunas',
    'Troca de dados entre engines (pandas, Polars, DuckDB, Spark) sem serialização',
    'Data lakes em object storage com particionamento por data',
    'Extrações de banco via ADBC ou Flight SQL para evitar conversão linha a linha',
    'Dados semi-estruturados (listas, structs) que precisam de leitura seletiva'
  ],
  whenNot: [
    'Workloads transacionais com updates pontuais por linha (use banco OLTP)',
    'Arquivos minúsculos e numerosos: consolide antes ou use uma tabela Delta/Iceberg com compaction',
    'Intercâmbio com sistemas legados que só aceitam CSV de layout fixo',
    'Streaming de baixa latência evento a evento (Kafka com Avro ou Protobuf é mais adequado)',
    'Particionar por coluna de alta cardinalidade como conta ou CPF'
  ],
  metrics: [
    'pq.ParquetFile(...).metadata: row groups, tamanho e estatísticas por coluna',
    'Tamanho médio de arquivo por partição (meta: centenas de MB)',
    'Bytes lidos por consulta (EXPLAIN ANALYZE no DuckDB, métricas de scan no Spark)',
    'Taxa de compressão e tempo de leitura por codec medidos na sua amostra',
    'Schema explícito na escrita e cast estrito antes de gravar',
    'parquet-tools ou duckdb "DESCRIBE" e parquet_metadata() para inspeção'
  ],
  refs: [
    { type: 'doc', title: 'Arrow Columnar Format', author: 'Apache Arrow', url: 'https://arrow.apache.org/docs/format/Columnar.html', note: 'Especificação oficial do layout de memória, buffers e alinhamento.' },
    { type: 'doc', title: 'Apache Parquet Documentation', author: 'Apache Parquet', url: 'https://parquet.apache.org/docs/', note: 'Formato de arquivo, row groups, páginas e encodings.' },
    { type: 'doc', title: 'PyArrow: Reading and Writing the Apache Parquet Format', author: 'Apache Arrow', url: 'https://arrow.apache.org/docs/python/parquet/', note: 'API prática de leitura seletiva, filtros e escrita.' },
    { type: 'doc', title: 'Arrow PyCapsule Interface', author: 'Apache Arrow', url: 'https://arrow.apache.org/docs/format/CDataInterface/PyCapsuleInterface.html', note: 'O protocolo que permite troca de dados entre bibliotecas sem depender do pyarrow.' },
    { type: 'paper', title: 'Dremel: Interactive Analysis of Web-Scale Datasets', author: 'Sergey Melnik et al. (VLDB 2010)', url: 'https://research.google/pubs/dremel-interactive-analysis-of-web-scale-datasets-2/', note: 'O paper que originou o record shredding usado pelo Parquet.' },
    { type: 'doc', title: 'Arrow Flight RPC', author: 'Apache Arrow', url: 'https://arrow.apache.org/docs/format/Flight.html', note: 'Transporte colunar de alto throughput sobre gRPC.' },
    { type: 'livro', title: 'Designing Data-Intensive Applications', author: 'Martin Kleppmann', url: 'https://dataintensive.net/', note: 'O capítulo sobre armazenamento colunar e codificação é a base teórica desta lição.' },
    { type: 'livro', title: 'Fundamentals of Data Engineering', author: 'Joe Reis e Matt Housley', url: 'https://www.oreilly.com/library/view/fundamentals-of-data/9781098108298/', note: 'Formatos, lakes e lakehouses do ponto de vista do ciclo de vida dos dados.' }
  ]
};

window.LESSON_CONTENT['duckdb'] = {
  id: 'duckdb',
  title: 'DuckDB e SQL analítico',
  etapa: 12, etapaName: 'Master large data',
  time: '60 min',
  tags: ['duckdb', 'sql', 'olap', 'parquet'],
  tagline: 'O SQLite da análise: um banco <em>colunar e vetorizado</em> que roda dentro do seu processo Python.',
  intro: `
    <p>DuckDB é um banco de dados analítico (OLAP) embutido: não tem servidor, instala com <code>pip install duckdb</code> e roda no mesmo processo do seu código. Por dentro, é um motor colunar com execução vetorizada, paralelismo morsel-driven e operadores que fazem spill para disco quando a memória acaba. O paper de Raasveldt e Mühleisen no SIGMOD 2019 posicionou a ideia: um banco analítico com a ergonomia do SQLite.</p>
    <p>O motivo de ele ter dominado o dia a dia de engenharia de dados é prático: você aponta SQL para um diretório de Parquet no S3, para um DataFrame pandas ou Polars na memória, ou para um CSV sujo, e recebe o resultado em segundos, sem subir cluster, sem ETL de carga, sem cópia entre formatos (a fronteira é Arrow).</p>
    <p>Em outubro de 2026 saiu o DuckDB 2.0 (LTS), com novo parser, I/O assíncrono, tipo <code>VARIANT</code> e um modo cliente-servidor estável. Esta lição foca no núcleo que vale para qualquer versão: o modelo de execução, consultas sobre arquivos e a integração com Python.</p>
  `,
  sections: [
    {
      id: 'por-que-in-process',
      title: 'Por que um banco in-process',
      body: `
        <p>Bancos cliente-servidor pagam o custo de mover o resultado pelo socket, linha a linha, em protocolos desenhados para OLTP. O paper "Don't Hold My Data Hostage" (Raasveldt e Mühleisen, VLDB 2017) mediu isso: exportar uma tabela grande via protocolo cliente era ordens de grandeza mais lento que a própria consulta. Um banco embutido elimina esse custo: o resultado já está no espaço de endereçamento do processo, em formato colunar.</p>
        <pre><code class="language-python">import duckdb

# Banco em memória, zero configuração
print(duckdb.sql("SELECT 42 AS resposta").fetchall())

# Banco persistente em arquivo (um único arquivo, como SQLite)
con = duckdb.connect("analytics.duckdb")
con.sql("""
    CREATE TABLE IF NOT EXISTS tarifas AS
    SELECT * FROM (VALUES ('pix', 0.0), ('ted', 8.5), ('boleto', 3.2)) t(canal, tarifa)
""")
print(con.sql("SELECT * FROM tarifas ORDER BY tarifa DESC").df())
con.close()</code></pre>
        <div class="callout"><strong>NA ENTREVISTA</strong> "DuckDB substitui o Postgres?" Não. Postgres é OLTP: muitas transações pequenas concorrentes, índices B-tree, linhas. DuckDB é OLAP: poucas consultas grandes, varreduras colunares, agregações. É comum usar os dois, e o DuckDB inclusive lê tabelas do Postgres pela extensão <code>postgres</code>.</div>
      `
    },
    {
      id: 'execucao-vetorizada',
      title: 'Execução vetorizada e paralelismo',
      body: `
        <p>Bancos tradicionais usam o modelo Volcano: cada operador pede uma tupla por vez ao operador de baixo (<code>next()</code>), com uma chamada virtual por linha. DuckDB processa <strong>vetores</strong> de valores (tipicamente 2048 por vez) por operador, o que amortiza o custo de interpretação e mantém os dados no cache da CPU. É a mesma ideia do MonetDB/X100 (Boncz et al., CIDR 2005), de onde vieram vários conceitos.</p>
        <ul>
          <li><strong>Morsel-driven parallelism:</strong> a entrada é dividida em pedaços que threads pegam dinamicamente, balanceando carga entre núcleos.</li>
          <li><strong>Operadores out-of-core:</strong> hash join, agregação, ordenação e window functions fazem spill para disco quando passam do <code>memory_limit</code>.</li>
          <li><strong>Zonemaps e pushdown:</strong> no armazenamento nativo e no Parquet, estatísticas min/max permitem pular blocos.</li>
        </ul>
        <pre><code class="language-python">import duckdb

con = duckdb.connect()
con.sql("SET memory_limit = '8GB'")
con.sql("SET threads = 8")
con.sql("SET temp_directory = '/mnt/nvme/duckdb_tmp'")   # spill em disco rápido

plano = con.sql("""
    EXPLAIN ANALYZE
    SELECT canal, count(*) AS n, sum(valor) AS total
    FROM 'data/transacoes/*.parquet'
    WHERE data &gt;= DATE '2026-01-01'
    GROUP BY canal
""")
print(plano.fetchall()[0][1])   # árvore com tempo e linhas por operador</code></pre>
        <div class="callout tip"><strong>DICA</strong> <code>EXPLAIN ANALYZE</code> mostra quantas linhas cada operador processou e o tempo gasto. Se o <code>PARQUET_SCAN</code> lê o arquivo inteiro apesar do filtro, as estatísticas não estão ajudando: os dados provavelmente não estão ordenados pela coluna filtrada.</div>
      `
    },
    {
      id: 'consultando-arquivos',
      title: 'SQL direto sobre Parquet, CSV e S3',
      body: `
        <p>A característica mais usada do DuckDB: tratar arquivos como tabelas. Globs, particionamento Hive, schema union e leitura remota funcionam direto no <code>FROM</code>.</p>
        <pre><code class="language-sql">-- Parquet particionado estilo Hive, com pruning por diretório
SELECT conta, sum(valor) AS total
FROM read_parquet('lake/transacoes/**/*.parquet', hive_partitioning = true)
WHERE ano = 2026 AND mes = 3
GROUP BY conta
ORDER BY total DESC
LIMIT 20;

-- CSV sujo: detecção automática de dialeto e tipos, com overrides
SELECT *
FROM read_csv('extrato_*.csv',
              delim = ';', decimal_separator = ',',
              dateformat = '%d/%m/%Y',
              types = {'cpf_cnpj': 'VARCHAR'});

-- Inspecionar metadados do Parquet sem ler os dados
SELECT row_group_id, path_in_schema, stats_min, stats_max
FROM parquet_metadata('lake/transacoes/ano=2026/mes=3/part-0.parquet');</code></pre>
        <p>Para object storage, a extensão <code>httpfs</code> lê de S3, GCS e HTTP, com credenciais gerenciadas pelo <code>CREATE SECRET</code>. Ela faz requisições de intervalo de bytes: lê o footer, decide quais row groups precisa e baixa só eles.</p>
        <pre><code class="language-python">import duckdb

con = duckdb.connect()
con.sql("INSTALL httpfs")
con.sql("LOAD httpfs")
con.sql("""
    CREATE SECRET lake (
        TYPE s3,
        PROVIDER credential_chain     -- usa a cadeia padrão da AWS (IAM role, env)
    )
""")
df = con.sql("""
    SELECT canal, count(*) FROM 's3://meu-lake/tx/ano=2026/*/*.parquet'
    GROUP BY ALL
""").df()</code></pre>
        <div class="callout warn"><strong>PEGADINHA</strong> Nunca coloque chaves de acesso literais no SQL que vai para log ou notebook versionado. Use <code>credential_chain</code> (IAM role no ambiente) ou secrets persistentes fora do repositório.</div>
      `
    },
    {
      id: 'integracao-python',
      title: 'Integração com pandas, Polars e Arrow',
      body: `
        <p>DuckDB enxerga variáveis Python do escopo pelo nome (replacement scans): um DataFrame pandas, um DataFrame ou LazyFrame Polars, ou uma tabela Arrow viram tabelas no SQL. A leitura passa pelo Arrow, sem cópia para tipos compatíveis. Os resultados voltam com <code>.df()</code> (pandas), <code>.pl()</code> (Polars) e <code>.to_arrow_table()</code> (Arrow).</p>
        <pre><code class="language-python">import duckdb
import polars as pl
import pandas as pd

clientes = pd.read_parquet("clientes.parquet")             # pandas
transacoes = pl.scan_parquet("transacoes/*.parquet")       # Polars lazy

rel = duckdb.sql("""
    SELECT c.segmento, t.canal, sum(t.valor) AS volume
    FROM transacoes t
    JOIN clientes c USING (conta)
    GROUP BY ALL
""")

resultado_pl = rel.pl()              # Polars DataFrame
resultado_lazy = rel.pl(lazy=True)   # Polars LazyFrame
resultado_pd = rel.df()              # pandas
tabela = rel.to_arrow_table()        # pyarrow.Table

# Streaming de resultado grande em lotes Arrow
leitor = duckdb.sql("SELECT * FROM transacoes").to_arrow_reader(100_000)
for lote in leitor:
    ...  # processa cada RecordBatch</code></pre>
        <p>A API relacional permite compor consultas em Python sem concatenar strings, e cada passo é lazy até a materialização:</p>
        <pre><code class="language-python">rel = duckdb.read_parquet("transacoes/*.parquet")
grandes = rel.filter("valor &gt; 10000").aggregate("conta, count(*) AS n", "conta")
print(grandes.order("n DESC").limit(10).df())</code></pre>
        <div class="callout warn"><strong>PEGADINHA</strong> Nas versões atuais, os métodos antigos <code>fetch_arrow_table()</code> e <code>fetch_record_batch()</code> são aliases depreciados, e após <code>con.execute()</code> alguns deles não existem mais. Use <code>to_arrow_table()</code> e <code>to_arrow_reader()</code>.</div>
      `
    },
    {
      id: 'sql-analitico',
      title: 'SQL analítico que vale dominar',
      body: `
        <p>DuckDB tem um dialeto amigável (<code>GROUP BY ALL</code>, <code>SELECT * EXCLUDE</code>, <code>QUALIFY</code>, <code>ASOF JOIN</code>) que encurta muito as consultas de análise. Quatro padrões que uso direto em dados financeiros:</p>
        <pre><code class="language-sql">-- 1. Última transação de cada conta (QUALIFY filtra pelo resultado da janela)
SELECT *
FROM transacoes
QUALIFY row_number() OVER (PARTITION BY conta ORDER BY ts DESC) = 1;

-- 2. Saldo acumulado e média móvel de 7 dias
SELECT conta, data, valor,
       sum(valor) OVER (PARTITION BY conta ORDER BY data) AS saldo,
       avg(valor) OVER (PARTITION BY conta ORDER BY data
                        RANGE BETWEEN INTERVAL 6 DAYS PRECEDING AND CURRENT ROW) AS mm7
FROM movimentos;

-- 3. Câmbio vigente no momento da operação
SELECT o.*, c.taxa
FROM operacoes o
ASOF JOIN cambio c
  ON o.moeda = c.moeda AND o.ts &gt;= c.ts;

-- 4. Exportar resultado particionado para o lake
COPY (SELECT *, year(data) AS ano, month(data) AS mes FROM movimentos)
TO 'saida/movimentos' (FORMAT parquet, PARTITION_BY (ano, mes), COMPRESSION zstd);</code></pre>
        <p>O <code>ASOF JOIN</code> resolve em SQL o mesmo problema do <code>join_asof</code> do Polars: casar cada evento com o registro mais recente anterior. Sem ele, a versão em SQL padrão exige subconsulta correlacionada ou janela com <code>LEAD</code>, bem mais lenta.</p>
      `
    },
    {
      id: 'limites-concorrencia',
      title: 'Concorrência, limites e onde ele não encaixa',
      body: `
        <p>DuckDB foi desenhado para um processo dono do arquivo. O modelo de concorrência é MVCC com controle otimista: dentro de um processo, várias threads podem ler e escrever; entre processos, só um pode abrir o arquivo em modo escrita (outros podem abrir em <code>read_only=True</code>). Isso não é bug, é a escolha de ser embutido.</p>
        <pre><code class="language-python">import duckdb

# Vários leitores em processos diferentes: ok
con = duckdb.connect("analytics.duckdb", read_only=True)

# Em servidor web multithread: uma conexão por thread via cursor()
base = duckdb.connect("analytics.duckdb")
def handler(sql: str, params: list) -&gt; list:
    cur = base.cursor()                 # conexão filha, segura por thread
    return cur.execute(sql, params).fetchall()

# Parâmetros sempre via placeholder, nunca f-string (injeção de SQL)
handler("SELECT * FROM tarifas WHERE canal = ?", ["pix"])</code></pre>
        <p>Onde ele não encaixa: serviço transacional com muitos escritores concorrentes, dados que precisam de alta disponibilidade com réplica (o modo servidor do 2.0 muda parte disso, mas ainda é recente para afirmar maturidade em produção crítica), e volumes que exigem várias máquinas. Para o terceiro caso, o ecossistema tem MotherDuck (DuckDB gerenciado) e o formato DuckLake, mas a resposta clássica continua sendo Spark ou Trino sobre Iceberg.</p>
        <div class="callout tip"><strong>DICA</strong> Um padrão muito eficiente em banco: jobs noturnos em DuckDB leem o lake, produzem agregados em Parquet ou num arquivo <code>.duckdb</code>, e dashboards leem esse arquivo em modo somente leitura. Custo de infraestrutura perto de zero comparado a um warehouse ligado o tempo todo.</div>
      `
    }
  ],
  whenToUse: [
    'Análise ad hoc sobre Parquet ou CSV local ou em S3, sem carregar nada',
    'Joins e agregações que estouram a memória no pandas (DuckDB faz spill)',
    'Transformações em SQL dentro de pipelines Python (dbt-duckdb, scripts de ETL)',
    'Ponte entre pandas, Polars e Arrow com SQL como linguagem comum',
    'Testes locais de lógica que em produção roda em warehouse'
  ],
  whenNot: [
    'Banco transacional com muitos escritores concorrentes (use Postgres)',
    'Workloads que exigem várias máquinas por volume ou SLA',
    'Ambientes onde vários processos precisam escrever no mesmo arquivo',
    'Quando a lógica é naturalmente imperativa e não cabe em SQL',
    'Interpolar valores de usuário no SQL com f-string (use parâmetros)'
  ],
  metrics: [
    'EXPLAIN ANALYZE: linhas e tempo por operador, uso de filtros no scan',
    'parquet_metadata() e parquet_schema() para inspecionar arquivos',
    'memory_limit, threads e temp_directory ajustados ao container',
    'duckdb_settings() e duckdb_memory() para estado do motor',
    'Bytes lidos do S3 por consulta (pruning de partição funcionando)',
    'Tempo de consulta comparado ao mesmo SQL no warehouse'
  ],
  refs: [
    { type: 'doc', title: 'DuckDB Documentation', author: 'DuckDB Foundation', url: 'https://duckdb.org/docs/', note: 'Documentação oficial de SQL, cliente Python e extensões.' },
    { type: 'doc', title: 'DuckDB Python API: conversion', author: 'DuckDB Foundation', url: 'https://duckdb.org/docs/stable/clients/python/conversion', note: 'Métodos atuais de exportação para pandas, Polars e Arrow.' },
    { type: 'artigo', title: 'Announcing DuckDB 2.0.0 LTS', author: 'DuckDB Foundation', url: 'https://duckdb.org/2026/10/21/announcing-duckdb-200', note: 'Novidades e mudanças de compatibilidade da versão 2.0.' },
    { type: 'paper', title: 'DuckDB: an Embeddable Analytical Database', author: 'Mark Raasveldt e Hannes Mühleisen (SIGMOD 2019)', url: 'https://dl.acm.org/doi/10.1145/3299869.3320212', note: 'O paper de demonstração que apresenta o desenho do sistema.' },
    { type: 'paper', title: 'Don\'t Hold My Data Hostage: A Case For Client Protocol Redesign', author: 'Mark Raasveldt e Hannes Mühleisen (VLDB 2017)', url: 'https://www.vldb.org/pvldb/vol10/p1022-muehleisen.pdf', note: 'Mede o custo dos protocolos cliente-servidor e motiva o modelo in-process.' },
    { type: 'paper', title: 'MonetDB/X100: Hyper-Pipelining Query Execution', author: 'Peter Boncz, Marcin Zukowski e Niels Nes (CIDR 2005)', url: 'https://www.cidrdb.org/cidr2005/papers/P19.pdf', note: 'A origem da execução vetorizada usada por DuckDB e outros motores.' },
    { type: 'livro', title: 'DuckDB in Action', author: 'Mark Needham, Michael Hunger e Michael Simons', url: 'https://www.manning.com/books/duckdb-in-action', note: 'Livro prático cobrindo SQL, Python e casos de uso reais.' }
  ]
};

window.LESSON_CONTENT['out-of-core'] = {
  id: 'out-of-core',
  title: 'Streaming e out-of-core',
  etapa: 12, etapaName: 'Master large data',
  time: '60 min',
  tags: ['out-of-core', 'chunking', 'mmap', 'streaming'],
  tagline: '100 GB num notebook de 16 GB não é truque: é desenhar o processamento para nunca precisar de <em>tudo ao mesmo tempo</em>.',
  intro: `
    <p>Out-of-core é processar dados maiores que a memória disponível mantendo só uma fração deles em RAM a cada instante. A ideia é antiga (ordenação externa em fitas magnéticas é dos anos 1950), mas continua sendo a primeira linha de defesa antes de pedir um cluster. Um notebook com SSD NVMe lê vários GB por segundo: em muitos casos, 100 GB passam pelo disco em menos tempo do que leva para provisionar um cluster Spark.</p>
    <p>A pergunta central é sempre a mesma: <strong>qual é o estado mínimo que preciso manter?</strong> Uma soma precisa de um número; uma média, de soma e contagem; um group by, de um acumulador por chave; um join, de pelo menos um lado indexado; uma ordenação total, de runs ordenados em disco. Quem responde isso antes de escrever código escolhe a ferramenta certa.</p>
    <p>Esta lição vai do Python puro (geradores, chunking, mmap) às engines que fazem out-of-core por você (Polars streaming, DuckDB com spill, PyArrow datasets), sempre com o critério de quando cada abordagem compensa.</p>
  `,
  sections: [
    {
      id: 'estado-minimo',
      title: 'Pensar em estado: o que cabe em um acumulador',
      body: `
        <p>Classifique a operação antes de codar:</p>
        <table>
          <thead><tr><th>Operação</th><th>Estado necessário</th><th>Estratégia</th></tr></thead>
          <tbody>
            <tr><td>filter, map, projeção</td><td>Nenhum (por linha)</td><td>Streaming puro, lote a lote</td></tr>
            <tr><td>sum, count, min, max, média</td><td>O(1)</td><td>Acumulador</td></tr>
            <tr><td>group by agregado</td><td>O(número de chaves)</td><td>Dict de acumuladores, ou hash partitioning se as chaves não couberem</td></tr>
            <tr><td>distinct exato, mediana exata</td><td>O(n) no pior caso</td><td>Spill para disco ou aproximação (HyperLogLog, t-digest)</td></tr>
            <tr><td>join</td><td>Lado menor em memória</td><td>Hash join, ou partitioned hash join (Grace) com spill</td></tr>
            <tr><td>sort total</td><td>Runs em disco</td><td>Ordenação externa (sort-merge)</td></tr>
          </tbody>
        </table>
        <p>Agregações "algébricas" (decomponíveis em parciais combináveis) são as amigas do out-of-core: média vira (soma, contagem), variância vira (n, média, M2) pelo algoritmo de Welford/Chan. A mediana não é decomponível, por isso ela é cara em qualquer engine distribuída.</p>
        <pre><code class="language-python">from dataclasses import dataclass
import math

@dataclass(slots=True)
class Stats:
    n: int = 0
    media: float = 0.0
    m2: float = 0.0

    def add(self, x: float) -&gt; None:          # Welford, numericamente estável
        self.n += 1
        delta = x - self.media
        self.media += delta / self.n
        self.m2 += delta * (x - self.media)

    def merge(self, o: "Stats") -&gt; "Stats":    # Chan et al.: combina parciais
        n = self.n + o.n
        if n == 0:
            return Stats()
        delta = o.media - self.media
        media = self.media + delta * o.n / n
        m2 = self.m2 + o.m2 + delta**2 * self.n * o.n / n
        return Stats(n, media, m2)

    @property
    def desvio(self) -&gt; float:
        return math.sqrt(self.m2 / (self.n - 1)) if self.n &gt; 1 else 0.0</code></pre>
        <p>O <code>merge</code> é o que torna isso paralelizável: cada processo ou lote calcula seu <code>Stats</code> e você combina no final. É exatamente o padrão map-reduce, e é o que Spark faz por baixo num <code>agg(stddev(...))</code>.</p>
      `
    },
    {
      id: 'geradores-chunking',
      title: 'Geradores e chunking em Python puro',
      body: `
        <p>Geradores são a ferramenta nativa de streaming em Python: cada estágio consome um iterável e produz outro, e só um item (ou lote) existe em memória por vez. Para I/O e chamadas em C, processar em lotes amortiza o overhead por item.</p>
        <pre><code class="language-python">import csv
from collections import defaultdict
from collections.abc import Iterable, Iterator
from itertools import batched          # Python 3.12+

def linhas(caminho: str) -&gt; Iterator[dict[str, str]]:
    with open(caminho, newline="", encoding="utf-8") as f:
        yield from csv.DictReader(f, delimiter=";")

def validas(rows: Iterable[dict[str, str]]) -&gt; Iterator[dict[str, str]]:
    for r in rows:
        if r["valor"] and r["status"] != "ESTORNADA":
            yield r

def total_por_canal(caminho: str) -&gt; dict[str, int]:
    acc: dict[str, int] = defaultdict(int)
    for lote in batched(validas(linhas(caminho)), 50_000):
        for r in lote:
            acc[r["canal"]] += int(r["valor_centavos"])
    return dict(acc)</code></pre>
        <p>O pipeline usa memória constante independentemente do tamanho do arquivo. Mas Python puro processa da ordem de milhões de linhas por minuto por núcleo, não por segundo: serve para lógica complexa e volumes moderados. Para volume, delegue o laço para C, lendo em lotes colunares:</p>
        <pre><code class="language-python">import pyarrow.parquet as pq
import pyarrow.compute as pc

pf = pq.ParquetFile("transacoes.parquet")
total = 0.0
for lote in pf.iter_batches(batch_size=65_536, columns=["valor"]):
    total += pc.sum(lote.column("valor")).as_py()   # soma vetorizada no Arrow
print(total)

# pandas: chunksize devolve um iterador de DataFrames
import pandas as pd
for chunk in pd.read_csv("grande.csv", chunksize=1_000_000, usecols=["conta", "valor"]):
    ...</code></pre>
        <div class="callout warn"><strong>PEGADINHA</strong> Um único <code>list(...)</code> ou <code>sorted(...)</code> no meio do pipeline materializa tudo e anula o streaming. O mesmo vale para <code>pd.concat(chunks)</code> no fim: se você concatena os chunks, não fez out-of-core, só leu mais devagar.</div>
      `
    },
    {
      id: 'memory-mapping',
      title: 'Memory mapping',
      body: `
        <p><code>mmap</code> mapeia um arquivo no espaço de endereçamento virtual do processo. O kernel carrega páginas sob demanda (page faults) e as descarta sob pressão de memória, usando o page cache. Você acessa o arquivo como se fosse um array, e o sistema operacional faz o out-of-core.</p>
        <pre><code class="language-python">import numpy as np

# Matriz de features de 50 GB em disco, acessada como array
X = np.lib.format.open_memmap("features.npy", mode="w+",
                              dtype=np.float32, shape=(100_000_000, 128))
X[:1_000_000] = 0.0      # escreve só esse trecho
X.flush()
del X

X = np.load("features.npy", mmap_mode="r")    # abre sem ler
media_coluna_0 = X[:, 0].mean()               # lê só o necessário... mais ou menos</code></pre>
        <p>O "mais ou menos" é importante: <code>X[:, 0]</code> numa matriz row-major toca todas as linhas, e cada linha está numa página diferente, então o kernel lê praticamente o arquivo inteiro. mmap só é eficiente quando o padrão de acesso respeita o layout: fatias contíguas de linhas em row-major, ou formato colunar quando você quer colunas. É por isso que Arrow e Parquet são colunares.</p>
        <pre><code class="language-python">import mmap

# Contar linhas de um CSV gigante sem carregar o arquivo
def contar_linhas(caminho: str) -&gt; int:
    with open(caminho, "rb") as f, mmap.mmap(f.fileno(), 0, access=mmap.ACCESS_READ) as mm:
        n, pos = 0, mm.find(b"\\n")
        while pos != -1:
            n += 1
            pos = mm.find(b"\\n", pos + 1)
        return n</code></pre>
        <div class="callout tip"><strong>DICA</strong> Arquivos Arrow IPC (Feather v2) não comprimidos podem ser abertos com <code>pa.memory_map</code> e lidos sem cópia: a tabela aponta direto para as páginas do arquivo. É a forma mais rápida de compartilhar um dataset grande entre processos na mesma máquina.</div>
        <p>Em containers, lembre que page cache conta para o limite de memória do cgroup em algumas configurações, mas é reclamável. Monitorar RSS sem entender isso gera falso alarme.</p>
      `
    },
    {
      id: 'hash-partitioning',
      title: 'Particionamento por hash e ordenação externa',
      body: `
        <p>Quando nem o estado cabe (group by com centenas de milhões de chaves, join entre duas tabelas enormes), a técnica é dividir para conquistar: particionar os dados por hash da chave em N arquivos, de forma que todas as linhas de uma chave caiam no mesmo arquivo, e então processar cada partição em memória. É o Grace hash join, e é o que Spark faz no shuffle.</p>
        <pre><code class="language-python">import hashlib
from pathlib import Path
import pyarrow as pa
import pyarrow.compute as pc
import pyarrow.parquet as pq

N = 64

def particao(conta: int) -&gt; int:
    # hash estável entre execuções (hash() do Python é randomizado para str)
    h = hashlib.blake2b(str(conta).encode(), digest_size=8).digest()
    return int.from_bytes(h, "little") % N

def particionar(origem: str, destino: Path) -&gt; None:
    destino.mkdir(parents=True, exist_ok=True)
    writers: dict[int, pq.ParquetWriter] = {}
    try:
        for lote in pq.ParquetFile(origem).iter_batches(batch_size=200_000):
            t = pa.Table.from_batches([lote])
            parts = pa.array([particao(c) for c in t.column("conta").to_pylist()])
            for p in pc.unique(parts).to_pylist():
                sub = t.filter(pc.equal(parts, p))
                if p not in writers:
                    writers[p] = pq.ParquetWriter(destino / f"p{p:03d}.parquet", t.schema)
                writers[p].write_table(sub)
    finally:
        for w in writers.values():
            w.close()</code></pre>
        <p>Depois, cada <code>pNNN.parquet</code> é processado isoladamente, inclusive em paralelo. O código ilustra o mecanismo (o cálculo de partição em Python puro é o gargalo; em produção você usaria uma engine). Ordenação externa segue a mesma lógica: ordenar blocos que cabem em memória, gravar como runs, e fazer merge k-way com <code>heapq.merge</code>, que é um gerador e mantém só um item de cada run em memória.</p>
        <div class="math">custo de I/O da ordenação externa ≈ 2N · (1 + ⌈log_k(runs)⌉) páginas</div>
      `
    },
    {
      id: 'engines-out-of-core',
      title: 'Deixe a engine fazer: Polars, DuckDB, PyArrow',
      body: `
        <p>Escrever out-of-core à mão é ótimo para entender e péssimo para manter. As engines modernas já implementam spill, particionamento e streaming com operadores em código nativo:</p>
        <pre><code class="language-python">import duckdb
import polars as pl
import pyarrow.dataset as ds

# DuckDB: join e group by maiores que a RAM, com spill para disco
con = duckdb.connect()
con.sql("SET memory_limit = '6GB'; SET temp_directory = '/tmp/duck_spill'")
con.sql("""
    COPY (
        SELECT t.conta, c.segmento, sum(t.valor) AS volume
        FROM 'tx/*.parquet' t JOIN 'clientes/*.parquet' c USING (conta)
        GROUP BY ALL
    ) TO 'volume_por_conta.parquet' (FORMAT parquet)
""")

# Polars: streaming engine com sink, sem materializar o resultado
(pl.scan_parquet("tx/*.parquet")
   .join(pl.scan_parquet("clientes/*.parquet"), on="conta")
   .group_by("conta", "segmento")
   .agg(pl.col("valor").sum().alias("volume"))
   .sink_parquet("volume_por_conta_pl.parquet"))

# PyArrow datasets: scanner em lotes com filtro e projeção empurrados
dataset = ds.dataset("tx/", format="parquet", partitioning="hive")
for lote in dataset.to_batches(columns=["conta", "valor"],
                               filter=ds.field("valor") &gt; 1000):
    ...</code></pre>
        <p>Minha ordem de preferência para "não cabe na RAM" numa máquina: DuckDB quando a lógica é SQL, Polars lazy quando é transformação programática, PyArrow datasets quando preciso de controle de lotes para alimentar outro sistema (modelo, API, fila). Código manual só para o que nenhuma engine expressa.</p>
        <div class="callout warn"><strong>PEGADINHA</strong> Spill só funciona se o disco temporário existir, tiver espaço e for rápido. Em containers com sistema de arquivos efêmero pequeno, o job morre com "No space left on device" no meio do join. Monte um volume dedicado para o <code>temp_directory</code>.</div>
      `
    },
    {
      id: 'medir-e-decidir',
      title: 'Medindo: I/O, CPU ou memória?',
      body: `
        <p>Antes de otimizar, descubra o limitante. Um job out-of-core pode estar preso em disco, em CPU (descompressão, parsing de CSV) ou em memória (spill excessivo). Ferramentas e sinais:</p>
        <ul>
          <li><strong>Throughput de leitura:</strong> compare bytes lidos por segundo com a capacidade do disco (<code>fio</code> dá a referência; <code>iostat -x 1</code> mostra utilização). Se o disco está a 100%, mais CPU não ajuda.</li>
          <li><strong>CPU:</strong> <code>htop</code> mostrando um núcleo a 100% e o resto ocioso indica gargalo single-thread (parsing de CSV em Python, <code>apply</code>). <code>py-spy top</code> mostra onde.</li>
          <li><strong>Memória:</strong> pico de RSS com <code>/usr/bin/time -v</code> ("Maximum resident set size") ou <code>memray</code>.</li>
          <li><strong>Formato:</strong> CSV é parsing intensivo em CPU; converter uma vez para Parquet costuma pagar o custo já na segunda leitura.</li>
        </ul>
        <pre><code class="language-bash"># Pico de memória e tempo de um job
/usr/bin/time -v python job.py 2&gt;&amp;1 | grep -E "Maximum resident|Elapsed"

# Onde o tempo vai, sem modificar o código
py-spy record -o perfil.svg -- python job.py

# Perfil de alocação, incluindo extensões nativas
python -m memray run -o job.bin job.py &amp;&amp; python -m memray flamegraph job.bin</code></pre>
        <div class="callout"><strong>NA ENTREVISTA</strong> "Como você processaria 100 GB de CSV num laptop de 16 GB?" Resposta forte: converter uma vez para Parquet com um leitor em streaming (DuckDB <code>COPY</code> ou PyArrow), particionar pela chave de filtro, e consultar com DuckDB ou Polars lazy. Dizer o estado necessário de cada agregação e como medir o gargalo vale mais que citar ferramentas.</div>
      `
    }
  ],
  whenToUse: [
    'Dados de 1 a algumas centenas de GB numa única máquina com SSD',
    'Agregações decomponíveis (soma, contagem, média, variância) sobre arquivos grandes',
    'Conversão de CSVs legados para Parquet antes de qualquer análise',
    'Alimentar modelos ou APIs em lotes a partir de um dataset maior que a RAM',
    'Quando o custo e o tempo de provisionar cluster não se justificam'
  ],
  whenNot: [
    'Quando o dataset cabe confortavelmente na RAM: in-memory é mais simples e rápido',
    'Joins enormes com SLA apertado que exigem paralelismo de várias máquinas',
    'Acesso aleatório em arquivo row-major via mmap (vira leitura do arquivo inteiro)',
    'Medianas e distinct exatos em volume enorme sem disco para spill (considere aproximações)',
    'Código manual quando DuckDB ou Polars já expressam a operação'
  ],
  metrics: [
    '/usr/bin/time -v para pico de RSS e tempo total',
    'iostat -x e fio para saturação e capacidade do disco',
    'py-spy e memray para CPU e alocação, incluindo código nativo',
    'Throughput em MB/s comparado ao limite do disco',
    'Volume de spill (temp_directory) e espaço livre no volume temporário',
    'Memória constante ao dobrar o tamanho da entrada (teste de escalabilidade)'
  ],
  refs: [
    { type: 'doc', title: 'Scaling to large datasets', author: 'pandas development team', url: 'https://pandas.pydata.org/docs/user_guide/scale.html', note: 'Guia oficial de chunking, dtypes e quando sair do pandas.' },
    { type: 'doc', title: 'Polars: Streaming', author: 'Polars', url: 'https://docs.pola.rs/user-guide/concepts/streaming/', note: 'Como a engine de streaming processa dados maiores que a memória.' },
    { type: 'doc', title: 'DuckDB: Tuning workloads e out-of-core', author: 'DuckDB Foundation', url: 'https://duckdb.org/docs/stable/guides/performance/how_to_tune_workloads', note: 'memory_limit, spill e paralelismo na prática.' },
    { type: 'doc', title: 'PyArrow Tabular Datasets', author: 'Apache Arrow', url: 'https://arrow.apache.org/docs/python/dataset.html', note: 'Scanner em lotes com filtros e projeção.' },
    { type: 'doc', title: 'mmap: Memory-mapped file support', author: 'Python Software Foundation', url: 'https://docs.python.org/3/library/mmap.html', note: 'Referência da biblioteca padrão.' },
    { type: 'livro', title: 'High Performance Python, 3rd Edition', author: 'Micha Gorelick e Ian Ozsvald', url: 'https://www.oreilly.com/library/view/high-performance-python/9781098165956/', note: 'Profiling, memória e estruturas de dados para escala.' },
    { type: 'livro', title: 'Designing Data-Intensive Applications', author: 'Martin Kleppmann', url: 'https://dataintensive.net/', note: 'Capítulo de processamento em lote: sort-merge, hash joins e o legado do MapReduce.' },
    { type: 'portal', title: 'Bloomberg memray', author: 'Bloomberg', url: 'https://bloomberg.github.io/memray/', note: 'Profiler de memória que enxerga alocações nativas.' }
  ]
};

window.LESSON_CONTENT['dask-ray'] = {
  id: 'dask-ray',
  title: 'Dask e Ray',
  etapa: 12, etapaName: 'Master large data',
  time: '75 min',
  tags: ['dask', 'ray', 'distribuido', 'paralelismo'],
  tagline: 'Dask distribui <em>coleções</em>, Ray distribui <em>tarefas e atores</em>. Escolher entre eles é escolher a abstração certa.',
  intro: `
    <p>Quando uma máquina não basta, ou quando o trabalho é paralelo por natureza mas Python insiste em usar um núcleo, entram as engines distribuídas nativas de Python. Dask (Rocklin, SciPy 2015) nasceu para escalar NumPy e pandas com a mesma API, construindo grafos de tarefas a partir de operações sobre coleções particionadas. Ray (Moritz et al., OSDI 2018) nasceu no RISELab para workloads de ML e reforço: tarefas e atores com estado, agendados com baixa latência num cluster.</p>
    <p>Os dois resolvem o mesmo problema de fundo (executar funções Python em muitos processos e máquinas, movendo dados entre eles) com filosofias diferentes. Dask pensa em coleções (DataFrame, Array, Bag) e otimização de grafo. Ray pensa em primitivas (tasks, actors, object store) sobre as quais se constroem bibliotecas: Ray Data, Ray Train, Ray Tune, Ray Serve.</p>
    <p>Para quem opera dados de banco, a pergunta prática é: preciso escalar um pipeline tabular estilo pandas (Dask, ou talvez Spark), ou orquestrar computação heterogênea como scoring de modelos, simulações de risco e inferência em GPU (Ray)?</p>
  `,
  sections: [
    {
      id: 'task-graphs',
      title: 'Grafos de tarefas: o modelo comum',
      body: `
        <p>Ambos representam o trabalho como um DAG: nós são chamadas de função, arestas são dependências de dados. Um scheduler decide onde executar cada nó, minimizando transferência de dados e respeitando memória. O <code>dask.delayed</code> mostra o modelo cru:</p>
        <pre><code class="language-python">import dask
from dask import delayed

@delayed
def carregar(dia: str) -&gt; list[float]:
    return ler_valores_do_dia(dia)        # função sua, I/O

@delayed
def resumo(valores: list[float]) -&gt; dict:
    return {"n": len(valores), "total": sum(valores)}

@delayed
def consolidar(resumos: list[dict]) -&gt; dict:
    return {"n": sum(r["n"] for r in resumos), "total": sum(r["total"] for r in resumos)}

dias = [f"2026-03-{d:02d}" for d in range(1, 32)]
grafo = consolidar([resumo(carregar(d)) for d in dias])   # nada executou ainda
resultado = grafo.compute()                                # agora sim, em paralelo</code></pre>
        <p>O mesmo em Ray, com tasks remotas e futuros (<code>ObjectRef</code>):</p>
        <pre><code class="language-python">import ray

ray.init()   # local; em cluster: ray.init(address="auto")

@ray.remote
def resumo_dia(dia: str) -&gt; dict:
    valores = ler_valores_do_dia(dia)
    return {"n": len(valores), "total": sum(valores)}

refs = [resumo_dia.remote(d) for d in dias]   # dispara já, retorna futuros
resumos = ray.get(refs)                        # bloqueia até todos terminarem
print(sum(r["total"] for r in resumos))</code></pre>
        <p>Diferença sutil e importante: Dask constrói o grafo inteiro e otimiza antes de executar (lazy); Ray executa assim que você chama <code>.remote()</code> e o grafo emerge dinamicamente. Ray é melhor para computação cujo formato depende de resultados intermediários; Dask é melhor quando o otimizador pode reescrever o plano.</p>
      `
    },
    {
      id: 'dask-dataframe',
      title: 'Dask DataFrame',
      body: `
        <p>Um Dask DataFrame é uma coleção de DataFrames pandas (partições) mais um grafo. Desde 2024, o Dask DataFrame usa o dask-expr por baixo: há um otimizador de expressões que faz projection e predicate pushdown e reordena operações, aproximando o comportamento do Polars lazy. Strings usam o tipo Arrow por padrão.</p>
        <pre><code class="language-python">import dask.dataframe as dd
from dask.distributed import Client

client = Client(n_workers=8, threads_per_worker=2, memory_limit="4GB")
print(client.dashboard_link)     # dashboard: tarefas, memória, transferência

df = dd.read_parquet("s3://lake/transacoes/", filesystem="arrow")
resultado = (
    df[df["canal"] == "pix"]
      .groupby("conta")["valor"]
      .agg(["sum", "count"])
)
print(resultado.explain())       # plano otimizado
pdf = resultado.compute()        # vira pandas no cliente: cuidado com o tamanho</code></pre>
        <ul>
          <li><strong>Partições:</strong> mire em partições de 100 MB a 1 GB em memória. Milhares de partições minúsculas sobrecarregam o scheduler (cada tarefa tem overhead da ordem de centenas de microssegundos a milissegundos); poucas e grandes estouram a memória dos workers.</li>
          <li><strong>Índice ordenado:</strong> se as divisões (divisions) forem conhecidas, joins e buscas pelo índice evitam shuffle completo.</li>
          <li><strong><code>persist()</code> vs <code>compute()</code>:</strong> <code>persist</code> mantém o resultado distribuído na memória do cluster para reuso; <code>compute</code> traz tudo para o processo cliente.</li>
        </ul>
        <div class="callout warn"><strong>PEGADINHA</strong> <code>df.compute()</code> num DataFrame de 200 GB tenta trazer 200 GB para o seu notebook. Reduza (agregue, filtre) no cluster e só então compute, ou grave direto com <code>to_parquet</code>.</div>
      `
    },
    {
      id: 'scheduler-memoria',
      title: 'Scheduler distribuído e gestão de memória',
      body: `
        <p>O scheduler distribuído do Dask decide onde rodar cada tarefa considerando localidade dos dados e ocupação dos workers. Cada worker monitora sua memória com limiares: começa a fazer spill para disco, depois pausa a execução, e no limite o nanny reinicia o worker. Ver workers "morrendo" no dashboard quase sempre é partição grande demais ou resultado intermediário que não cabe.</p>
        <pre><code class="language-python">import dask
from dask.distributed import Client, LocalCluster

dask.config.set({
    "distributed.worker.memory.target": 0.6,      # começa spill
    "distributed.worker.memory.spill": 0.7,
    "distributed.worker.memory.pause": 0.8,       # para de aceitar tarefas
    "distributed.worker.memory.terminate": 0.95,  # nanny reinicia
})

with LocalCluster(n_workers=4, memory_limit="8GB") as cluster, Client(cluster) as client:
    futuros = client.map(processar_arquivo, lista_de_arquivos)   # API de futures
    resultados = client.gather(futuros)</code></pre>
        <p>Para shuffle (groupby com muitas chaves, merge entre tabelas grandes, set_index), o Dask usa por padrão um shuffle P2P que transfere dados diretamente entre workers com uso de memória controlado, em vez de criar uma tarefa por par de partições (que gerava grafos de tamanho quadrático). Mesmo assim, shuffle é a operação mais cara em qualquer engine distribuída: a lição de PySpark aprofunda o porquê.</p>
      `
    },
    {
      id: 'ray-actors',
      title: 'Ray: tasks, actors e object store',
      body: `
        <p>As três primitivas do Ray:</p>
        <ul>
          <li><strong>Tasks:</strong> funções sem estado executadas remotamente (<code>@ray.remote</code> em função).</li>
          <li><strong>Actors:</strong> classes com estado vivendo num processo dedicado (<code>@ray.remote</code> em classe). Chamadas a métodos são enfileiradas e executadas em série naquele actor.</li>
          <li><strong>Object store:</strong> memória compartilhada por nó (Plasma) que guarda resultados imutáveis. Arrays NumPy e objetos Arrow são lidos sem cópia por processos do mesmo nó.</li>
        </ul>
        <pre><code class="language-python">import ray
import numpy as np

@ray.remote(num_gpus=0.25)          # 4 actors compartilham uma GPU
class Scorer:
    def __init__(self, caminho_modelo: str):
        self.modelo = carregar_modelo(caminho_modelo)   # carrega UMA vez

    def score(self, lote: np.ndarray) -&gt; np.ndarray:
        return self.modelo.predict_proba(lote)[:, 1]

scorers = [Scorer.remote("s3://modelos/fraude/v12") for _ in range(4)]

features = ray.put(np.load("features_grandes.npy"))     # vai para o object store uma vez

@ray.remote
def fatia(arr: np.ndarray, i: int, n: int) -&gt; np.ndarray:
    return arr[i::n]                                    # leitura zero-copy no mesmo nó

refs = [scorers[i].score.remote(fatia.remote(features, i, 4)) for i in range(4)]
scores = np.concatenate(ray.get(refs))</code></pre>
        <p>O actor resolve o problema clássico de carregar um modelo pesado por tarefa: o estado fica residente e as chamadas reutilizam. É o mesmo padrão que o Ray Serve usa para servir modelos, e que o Ray Data usa em <code>map_batches</code> com classes.</p>
        <div class="callout warn"><strong>PEGADINHA</strong> Passar um objeto grande como argumento direto de <code>.remote()</code> serializa e copia a cada chamada. Coloque-o no object store uma vez com <code>ray.put</code> e passe a referência. E nunca chame <code>ray.get</code> dentro de um laço que dispara tarefas: você serializa a execução.</div>
      `
    },
    {
      id: 'ray-data',
      title: 'Ray Data para pipelines de ML',
      body: `
        <p>Ray Data é a biblioteca de processamento de dados em streaming do Ray, desenhada para alimentar treino e inferência em lote, inclusive com estágios heterogêneos (CPU para pré-processamento, GPU para inferência) executando ao mesmo tempo. Ela não é um substituto de Spark para joins complexos; o forte é o map em lotes de alto throughput.</p>
        <pre><code class="language-python">import numpy as np
import ray

ds = ray.data.read_parquet("s3://lake/transacoes/ano=2026/")

def features(lote):                     # lote: dict de arrays NumPy ou DataFrame
    lote["log_valor"] = np.log1p(lote["valor"])
    return lote

class Modelo:
    def __init__(self):
        self.m = carregar_modelo("s3://modelos/fraude/v12")
    def __call__(self, lote):
        lote["score"] = self.m.predict_proba(lote[["log_valor", "hora"]])[:, 1]
        return lote

(ds.map_batches(features, batch_format="pandas")
   .map_batches(Modelo, batch_format="pandas", concurrency=4, num_gpus=1)
   .write_parquet("s3://lake/scores/ano=2026/"))</code></pre>
        <p>Os parâmetros de concorrência e recursos são os que mais mudaram entre versões do Ray; confira a documentação da versão que você fixou. O princípio estável: funções para transformações sem estado, classes (actors) para estágios com estado caro de inicializar.</p>
      `
    },
    {
      id: 'dask-vs-ray-vs-spark',
      title: 'Dask, Ray ou Spark: quadro de decisão',
      body: `
        <table>
          <thead><tr><th>Critério</th><th>Dask</th><th>Ray</th><th>Spark</th></tr></thead>
          <tbody>
            <tr><td>Abstração central</td><td>Coleções (DataFrame, Array) e grafo</td><td>Tasks, actors, object store</td><td>DataFrame/SQL com otimizador Catalyst</td></tr>
            <tr><td>Forte em</td><td>Escalar código NumPy/pandas existente, arrays científicos</td><td>ML, GPU, inferência em lote, serving, simulação</td><td>ETL tabular massivo, SQL, joins grandes</td></tr>
            <tr><td>Linguagem do runtime</td><td>Python</td><td>C++ core, API Python</td><td>JVM (Scala), API Python</td></tr>
            <tr><td>Overhead por tarefa</td><td>Baixo a moderado</td><td>Muito baixo</td><td>Alto (pensado para tarefas grandes)</td></tr>
            <tr><td>Ecossistema corporativo</td><td>Moderado</td><td>Forte em ML</td><td>Dominante (Databricks, EMR, Dataproc)</td></tr>
          </tbody>
        </table>
        <p>Antes de qualquer um deles: considere se uma máquina grande com DuckDB ou Polars resolve. Uma instância com 64 núcleos e 512 GB de RAM processa muita coisa, sem a complexidade operacional de cluster (rede, serialização, falhas parciais, versões de pacotes em todos os nós).</p>
        <div class="callout"><strong>NA ENTREVISTA</strong> "Por que não multiprocessing?" Ele resolve paralelismo numa máquina, mas não tem scheduler com localidade de dados, tolerância a falhas, spill, dashboard nem object store compartilhado. Para trabalho embaraçosamente paralelo de curta duração numa máquina, <code>concurrent.futures.ProcessPoolExecutor</code> é a resposta certa e mais simples.</div>
      `
    },
    {
      id: 'producao-distribuida',
      title: 'Operando em produção',
      body: `
        <ul>
          <li><strong>Ambiente idêntico em todos os nós:</strong> a versão de cada pacote no worker precisa bater com a do cliente. O Dask avisa sobre divergências com <code>client.get_versions(check=True)</code>; o Ray tem runtime environments (<code>runtime_env</code>), mas imagem de container fixa é o caminho mais robusto.</li>
          <li><strong>Serialização:</strong> funções e closures viajam via cloudpickle. Uma closure que captura um DataFrame enorme ou uma conexão de banco vira um problema silencioso de desempenho ou um erro de pickle.</li>
          <li><strong>Falhas parciais:</strong> tasks devem ser idempotentes, porque ambos reexecutam tarefas perdidas quando um worker morre. Ray permite <code>max_retries</code> em tasks e <code>max_restarts</code> em actors; estado de actor perdido não volta sozinho.</li>
          <li><strong>Deploy:</strong> Dask no Kubernetes via dask-kubernetes ou Dask Gateway; Ray via KubeRay. Autoscaling reduz custo, mas aumenta latência de início.</li>
        </ul>
        <pre><code class="language-python">import ray

@ray.remote(max_retries=3, retry_exceptions=[ConnectionError])
def baixar_e_processar(chave_s3: str) -&gt; str:
    destino = f"s3://lake/processado/{chave_s3.split('/')[-1]}"
    if ja_existe(destino):          # idempotência: reexecução não duplica
        return destino
    dados = baixar(chave_s3)
    gravar(transformar(dados), destino)
    return destino</code></pre>
      `
    }
  ],
  whenToUse: [
    'Dask: escalar pipelines pandas ou NumPy existentes com mudanças mínimas de API',
    'Dask: arrays científicos maiores que a memória (dask.array com Zarr ou HDF5)',
    'Ray: inferência em lote com GPU e estágios heterogêneos CPU e GPU',
    'Ray: actors com estado caro (modelos carregados, conexões) reaproveitado em muitas chamadas',
    'Ray: hyperparameter tuning, simulações de risco e Monte Carlo com milhares de tarefas curtas'
  ],
  whenNot: [
    'Quando uma única máquina com DuckDB ou Polars resolve o volume',
    'ETL tabular massivo com joins complexos em ambiente corporativo já padronizado em Spark',
    'Trabalho paralelo simples numa máquina (use concurrent.futures)',
    'Tarefas minúsculas aos milhões no Dask (o overhead do scheduler domina)',
    'Times sem capacidade de operar cluster, rede e versões em vários nós'
  ],
  metrics: [
    'Dashboard do Dask: task stream, memória por worker, transferências e progresso',
    'Ray Dashboard: uso de object store, actors vivos, tarefas pendentes e falhas',
    'Tamanho médio de partição e número de tarefas no grafo',
    'Volume de spill e reinícios de worker',
    'client.get_versions(check=True) e imagens de container idênticas em todos os nós',
    'Tempo de cluster ocioso versus ocupado (custo de autoscaling)'
  ],
  refs: [
    { type: 'doc', title: 'Dask Documentation', author: 'Dask', url: 'https://docs.dask.org/', note: 'Guia oficial de coleções, scheduler e boas práticas.' },
    { type: 'doc', title: 'Dask DataFrame Best Practices', author: 'Dask', url: 'https://docs.dask.org/en/stable/dataframe-best-practices.html', note: 'Tamanho de partição, índice e quando não usar Dask.' },
    { type: 'doc', title: 'Ray Documentation', author: 'Anyscale e comunidade Ray', url: 'https://docs.ray.io/', note: 'Core (tasks, actors, objects) e bibliotecas Data, Train, Tune e Serve.' },
    { type: 'paper', title: 'Dask: Parallel Computation with Blocked algorithms and Task Scheduling', author: 'Matthew Rocklin (SciPy 2015)', url: 'https://proceedings.scipy.org/articles/Majora-7b98e3ed-013', note: 'O paper original do Dask e do modelo de grafos de tarefas.' },
    { type: 'paper', title: 'Ray: A Distributed Framework for Emerging AI Applications', author: 'Philipp Moritz et al. (OSDI 2018)', url: 'https://www.usenix.org/conference/osdi18/presentation/moritz', note: 'Arquitetura de tasks, actors e scheduler bottom-up.' },
    { type: 'livro', title: 'Scaling Python with Dask', author: 'Holden Karau e Mika Kimmins', url: 'https://www.oreilly.com/library/view/scaling-python-with/9781098119867/', note: 'Dask na prática, de coleções a deploy em cluster.' },
    { type: 'livro', title: 'Scaling Python with Ray', author: 'Holden Karau e Boris Lublinsky', url: 'https://www.oreilly.com/library/view/scaling-python-with/9781098118792/', note: 'Primitivas do Ray e padrões de uso em produção.' }
  ]
};

window.LESSON_CONTENT['pyspark'] = {
  id: 'pyspark',
  title: 'PySpark',
  etapa: 12, etapaName: 'Master large data',
  time: '90 min',
  tags: ['spark', 'pyspark', 'shuffle', 'distribuido'],
  tagline: 'Spark não é rápido por mágica: é rápido quando você <em>evita o shuffle</em> e deixa o Catalyst trabalhar.',
  intro: `
    <p>Apache Spark é o padrão de fato para processamento distribuído de dados em empresas, e nos bancos brasileiros ele está em praticamente todo data lake sério, via Databricks, EMR, Dataproc ou cluster próprio. Ele nasceu do paper dos RDDs (Zaharia et al., NSDI 2012): coleções distribuídas imutáveis com linhagem, que permitem recomputar partições perdidas em vez de replicar dados, e que mantêm resultados em memória entre etapas, ao contrário do MapReduce.</p>
    <p>PySpark é a API Python. Aqui está o ponto que separa quem usa de quem domina: o seu código Python, na maior parte, <strong>não processa dados</strong>. Ele constrói um plano lógico que o otimizador Catalyst transforma em código JVM. Quando você escapa disso (UDF Python linha a linha, <code>collect</code> grande, <code>toPandas</code> sem Arrow), os dados atravessam a fronteira JVM/Python e o desempenho despenca.</p>
    <p>O Spark 4.0 (maio de 2025) mudou padrões importantes: modo ANSI SQL ligado por padrão e Spark Connect maduro, com um cliente Python leve. Hoje (novembro de 2026) a linha atual é a 4.x. Esta lição cobre o modelo de execução, shuffle, skew, AQE e UDFs vetorizadas com Arrow.</p>
  `,
  sections: [
    {
      id: 'modelo-execucao',
      title: 'Driver, executors, jobs, stages e tasks',
      body: `
        <p>Um aplicativo Spark tem um <strong>driver</strong> (onde roda seu código Python e o planejador) e vários <strong>executors</strong> (JVMs nos nós do cluster, cada uma com N cores). O fluxo:</p>
        <ul>
          <li><strong>Transformações</strong> (<code>filter</code>, <code>select</code>, <code>join</code>, <code>groupBy</code>) são lazy: só constroem o plano.</li>
          <li><strong>Ações</strong> (<code>count</code>, <code>write</code>, <code>collect</code>, <code>show</code>) disparam um <strong>job</strong>.</li>
          <li>O job é quebrado em <strong>stages</strong> nas fronteiras de shuffle (dependências largas).</li>
          <li>Cada stage tem uma <strong>task</strong> por partição; tasks rodam em paralelo nos cores dos executors.</li>
        </ul>
        <pre><code class="language-python">from pyspark.sql import SparkSession, functions as F

spark = (
    SparkSession.builder
    .appName("consolidacao-diaria")
    .config("spark.sql.shuffle.partitions", "400")
    .getOrCreate()
)

tx = spark.read.parquet("s3://lake/transacoes/")          # lazy
resumo = (
    tx.filter(F.col("data") == "2026-11-12")               # narrow: mesmo stage
      .withColumn("valor_reais", F.col("valor_centavos") / 100)
      .groupBy("agencia", "canal")                          # wide: fronteira de stage
      .agg(F.sum("valor_reais").alias("volume"), F.count("*").alias("qtd"))
)
resumo.explain(mode="formatted")       # plano físico, antes de executar
resumo.write.mode("overwrite").parquet("s3://lake/resumos/2026-11-12/")   # ação</code></pre>
        <p>Dependência estreita (narrow): cada partição de saída depende de uma partição de entrada (filter, map). Dependência larga (wide): cada partição de saída depende de várias de entrada (groupBy, join, distinct), o que exige redistribuir dados pela rede. A Spark UI mostra exatamente isso: stages, tasks, tempo, shuffle read/write e spill por task. É a primeira tela que abro quando um job está lento.</p>
      `
    },
    {
      id: 'catalyst-ansi',
      title: 'Catalyst, Tungsten e o modo ANSI',
      body: `
        <p>O Catalyst (Armbrust et al., SIGMOD 2015) é o otimizador do Spark SQL: análise, otimização lógica baseada em regras (pushdown de predicado e projeção, constant folding), planejamento físico com custo (escolha de estratégia de join) e geração de código (whole-stage codegen do projeto Tungsten, que funde operadores num único laço Java compilado).</p>
        <p>A consequência prática: DataFrame API e SQL compilam para o mesmo plano. Não há diferença de desempenho entre escrever <code>spark.sql("...")</code> e a API encadeada. Escolha pela legibilidade e testabilidade.</p>
        <pre><code class="language-python">tx.createOrReplaceTempView("tx")
via_sql = spark.sql("""
    SELECT agencia, canal, sum(valor_centavos) / 100 AS volume
    FROM tx WHERE data = DATE'2026-11-12'
    GROUP BY agencia, canal
""")
via_api = (tx.filter(F.col("data") == F.lit("2026-11-12").cast("date"))
             .groupBy("agencia", "canal")
             .agg((F.sum("valor_centavos") / 100).alias("volume")))
# via_sql.explain() e via_api.explain() mostram o mesmo plano físico</code></pre>
        <div class="callout warn"><strong>PEGADINHA</strong> No Spark 4, <code>spark.sql.ansi.enabled</code> é <code>true</code> por padrão. Cast inválido (<code>"abc"</code> para int), overflow aritmético e divisão por zero passam a lançar erro em vez de retornar <code>NULL</code> silenciosamente. É uma melhoria de corretude enorme para dado financeiro, mas jobs migrados do 3.x que "funcionavam" podem começar a falhar. Use <code>try_cast</code>, <code>try_divide</code> e afins onde o nulo é o comportamento desejado, em vez de desligar o ANSI globalmente.</div>
      `
    },
    {
      id: 'shuffle-particionamento',
      title: 'Shuffle e particionamento',
      body: `
        <p>O shuffle é a operação mais cara do Spark: cada task do stage anterior escreve sua saída particionada por hash da chave em disco local, e cada task do stage seguinte busca seus pedaços de todos os executors pela rede. Custa serialização, disco, rede e, se a memória não bastar, spill. Toda otimização séria de Spark é, no fundo, reduzir ou eliminar shuffle.</p>
        <ul>
          <li><strong><code>spark.sql.shuffle.partitions</code></strong> (padrão 200) define quantas partições saem de um shuffle. Com AQE, ele é ponto de partida e o Spark coalesce partições pequenas.</li>
          <li><strong><code>repartition(n, col)</code></strong> faz shuffle completo; <strong><code>coalesce(n)</code></strong> só junta partições sem shuffle (útil para reduzir arquivos na escrita, mas pode desbalancear).</li>
          <li><strong>Broadcast join:</strong> se um lado é pequeno, ele é enviado inteiro para cada executor e o lado grande não sofre shuffle.</li>
          <li><strong>Bucketing e particionamento na escrita:</strong> gravar dados já particionados pela chave de join evita shuffle em leituras futuras.</li>
        </ul>
        <pre><code class="language-python">from pyspark.sql import functions as F

agencias = spark.read.parquet("s3://lake/dim_agencia/")     # alguns MB
tx = spark.read.parquet("s3://lake/transacoes/")             # alguns TB

# Broadcast explícito: elimina o shuffle do lado grande
enriquecido = tx.join(F.broadcast(agencias), "agencia")

# Limite automático de broadcast (padrão 10 MB); ajuste com critério
spark.conf.set("spark.sql.autoBroadcastJoinThreshold", str(64 * 1024 * 1024))

# Escrita: controle número e tamanho de arquivos por partição
(enriquecido
    .repartition("data")                       # um grupo de tasks por data
    .write.partitionBy("data")
    .mode("overwrite")
    .parquet("s3://lake/tx_enriquecida/"))</code></pre>
        <div class="callout"><strong>NA ENTREVISTA</strong> "Seu job tem um stage que demora 40 minutos. Como investiga?" Abrir a Spark UI no stage, olhar a distribuição de duração das tasks (mediana vs máximo), shuffle read por task e spill. Se o máximo é 50 vezes a mediana, é skew. Se todas são lentas com muito spill, faltam partições ou memória. Se o plano mostra SortMergeJoin com uma tabela pequena, faltou broadcast.</div>
      `
    },
    {
      id: 'skew-aqe',
      title: 'Data skew e Adaptive Query Execution',
      body: `
        <p>Skew é quando poucas chaves concentram a maior parte das linhas. Em banco é a regra, não a exceção: uma conta de grande varejista com milhões de transações por dia, um CNPJ de adquirente, a chave nula que agrega tudo que veio sem cliente. No shuffle, todas as linhas da mesma chave vão para a mesma task, e um stage inteiro espera uma única task gigante.</p>
        <p>O <strong>AQE</strong> (ligado por padrão desde o Spark 3.2) reotimiza o plano em tempo de execução usando estatísticas reais dos shuffles já concluídos:</p>
        <ul>
          <li><strong>Coalescing de partições:</strong> junta partições pós-shuffle pequenas.</li>
          <li><strong>Troca de estratégia de join:</strong> converte sort-merge em broadcast se o lado filtrado ficou pequeno.</li>
          <li><strong>Skew join:</strong> divide partições muito maiores que a mediana em várias tasks, replicando o lado correspondente.</li>
        </ul>
        <pre><code class="language-python">spark.conf.set("spark.sql.adaptive.enabled", "true")               # padrão
spark.conf.set("spark.sql.adaptive.skewJoin.enabled", "true")
spark.conf.set("spark.sql.adaptive.advisoryPartitionSizeInBytes", "256m")

# Quando o AQE não basta (ex.: agregação com chave quente): salting manual
N_SAL = 32
parcial = (
    tx.withColumn("sal", (F.rand(seed=7) * N_SAL).cast("int"))
      .groupBy("conta", "sal")
      .agg(F.sum("valor_centavos").alias("parcial"))
)
total = parcial.groupBy("conta").agg(F.sum("parcial").alias("total"))

# Chave nula concentrando tudo: trate antes do join
tx_ok = tx.filter(F.col("id_cliente").isNotNull())
tx_sem_cliente = tx.filter(F.col("id_cliente").isNull())   # processa separado</code></pre>
        <p>O salting funciona porque soma é decomponível: agrega em duas fases, primeiro por (chave, sal) espalhando a chave quente por 32 tasks, depois por chave. Para join, o salting replica o lado menor N vezes, então só use quando o AQE realmente não resolver.</p>
      `
    },
    {
      id: 'udfs-arrow',
      title: 'UDFs: do pior ao melhor caso',
      body: `
        <p>Uma UDF Python comum serializa cada linha da JVM para um processo Python worker (via pickle), executa a função e devolve o resultado. Além do custo de serialização, ela é opaca para o Catalyst: nada de pushdown ou codegen através dela. A hierarquia de preferência:</p>
        <ol>
          <li><strong>Funções nativas</strong> (<code>pyspark.sql.functions</code>): rodam na JVM com codegen. Cobrem muito mais do que parece (<code>regexp_extract</code>, <code>transform</code> sobre arrays, <code>from_json</code>, janelas).</li>
          <li><strong>Pandas UDFs (vetorizadas)</strong>: dados vão em lotes Arrow para o Python, a função recebe <code>pd.Series</code> e opera vetorizada.</li>
          <li><strong>UDF Python com Arrow</strong> (<code>useArrow=True</code>, desde o Spark 3.5): mesma semântica de linha a linha, mas transporte em Arrow.</li>
          <li><strong>UDF Python clássica</strong>: último recurso.</li>
        </ol>
        <p>Antes (UDF linha a linha para mascarar CPF):</p>
        <pre><code class="language-python">from pyspark.sql.functions import udf

@udf("string")
def mascarar(cpf):
    return None if cpf is None else "***." + cpf[3:6] + "." + cpf[6:9] + "-**"

df = df.withColumn("cpf_mask", mascarar("cpf"))</code></pre>
        <p>Depois (nativo, sem sair da JVM) e, quando precisar de Python de verdade, pandas UDF:</p>
        <pre><code class="language-python">import pandas as pd
from pyspark.sql import functions as F
from pyspark.sql.functions import pandas_udf

df = df.withColumn(
    "cpf_mask",
    F.concat(F.lit("***."), F.substring("cpf", 4, 3), F.lit("."),
             F.substring("cpf", 7, 3), F.lit("-**")),
)

@pandas_udf("double")
def score_risco(valor: pd.Series, hora: pd.Series) -&gt; pd.Series:
    # lógica vetorizada que não existe em funções nativas
    return valor.clip(upper=50_000) / 50_000 + hora.between(0, 5).astype("float64") * 0.3

df = df.withColumn("risco", score_risco("valor", "hora"))

# Por grupo: cada conta inteira chega como DataFrame pandas
def normalizar(pdf: pd.DataFrame) -&gt; pd.DataFrame:
    pdf["z"] = (pdf["valor"] - pdf["valor"].mean()) / pdf["valor"].std(ddof=0)
    return pdf

df_z = df.groupBy("conta").applyInPandas(normalizar, schema=df.schema.add("z", "double"))</code></pre>
        <div class="callout warn"><strong>PEGADINHA</strong> <code>applyInPandas</code> carrega o grupo inteiro na memória de um worker Python. Com skew (a conta da grande varejista), o worker estoura. Para chaves quentes, prefira agregações nativas ou reduza o grupo antes.</div>
        <p>O mesmo vale para trazer dados ao driver: habilite <code>spark.sql.execution.arrow.pyspark.enabled</code> para que <code>toPandas()</code> e <code>createDataFrame(pandas_df)</code> usem Arrow, e nunca faça <code>toPandas()</code> de algo que não caberia na RAM do driver.</p>
      `
    },
    {
      id: 'cache-escrita',
      title: 'Cache, checkpoints e escrita confiável',
      body: `
        <ul>
          <li><strong><code>cache()</code>/<code>persist()</code></strong> só compensa quando o mesmo DataFrame é usado por mais de uma ação. Cache desnecessário rouba memória de execução. Libere com <code>unpersist()</code>.</li>
          <li><strong>Linhagem longa</strong> (laços iterativos que reaplicam transformações) faz o plano crescer até o driver gastar mais tempo planejando que executando. <code>checkpoint()</code> ou gravar e reler corta a linhagem.</li>
          <li><strong>Escrita idempotente:</strong> com <code>mode("overwrite")</code> e particionamento, configure <code>spark.sql.sources.partitionOverwriteMode=dynamic</code> para sobrescrever só as partições presentes no DataFrame. Sem isso, um reprocessamento de um dia apaga a tabela inteira.</li>
          <li><strong>Formato de tabela:</strong> em produção, prefira Delta Lake ou Iceberg: commits atômicos, <code>MERGE INTO</code> para upserts, time travel para auditoria e compaction de arquivos pequenos.</li>
        </ul>
        <pre><code class="language-python">spark.conf.set("spark.sql.sources.partitionOverwriteMode", "dynamic")

def reprocessar_dia(data: str) -&gt; None:
    (spark.read.parquet("s3://lake/raw/transacoes/")
          .filter(F.col("data") == data)
          .transform(limpar)                  # funções DataFrame -&gt; DataFrame, testáveis
          .transform(enriquecer)
          .write.mode("overwrite")
          .partitionBy("data")
          .parquet("s3://lake/silver/transacoes/"))   # só a partição do dia é trocada</code></pre>
        <p>O <code>.transform(func)</code> é o meu padrão para organizar jobs: cada etapa é uma função pura <code>DataFrame -&gt; DataFrame</code>, testável com um <code>SparkSession</code> local e meia dúzia de linhas (ou com <code>pyspark.testing.assertDataFrameEqual</code>).</p>
      `
    },
    {
      id: 'spark-connect',
      title: 'Spark Connect e o PySpark moderno',
      body: `
        <p>O Spark Connect separa o cliente do servidor: o cliente Python envia planos lógicos (em protobuf, via gRPC) para um servidor Spark remoto, e recebe resultados em Arrow. O cliente não precisa de JVM, é leve, pode ser atualizado independentemente e uma falha no cliente não derruba o driver compartilhado. No Spark 4, ele ganhou paridade ampla com a API clássica e um pacote cliente enxuto (<code>pyspark-client</code>).</p>
        <pre><code class="language-python">from pyspark.sql import SparkSession

spark = SparkSession.builder.remote("sc://spark-connect.interno:15002").getOrCreate()
df = spark.read.table("silver.transacoes").filter("data = '2026-11-12'")
print(df.groupBy("canal").count().toPandas())     # resultado chega em Arrow</code></pre>
        <p>Limitações a conhecer: APIs que dependem de acesso direto ao <code>SparkContext</code> ou a RDDs não estão disponíveis no modo Connect. Código novo deve ficar na API de DataFrame, que é o que funciona nos dois modos e o que o Catalyst otimiza.</p>
        <p>Outra adição relevante dos últimos anos é a API de Python Data Source, que permite escrever conectores de leitura e escrita em Python puro, e o profiler unificado de UDFs Python (<code>spark.sql.pyspark.udf.profiler</code>), útil para achar a UDF que está segurando o job.</p>
      `
    }
  ],
  whenToUse: [
    'Volumes que não cabem numa máquina ou com SLA que exige muitos cores (TBs por dia)',
    'Joins e agregações massivas sobre data lakes Parquet, Delta ou Iceberg',
    'Ambientes corporativos já padronizados em Databricks, EMR ou Dataproc',
    'Pipelines batch e streaming estruturado com a mesma API',
    'Quando governança, catálogo e controle de acesso do lakehouse já giram em torno de Spark'
  ],
  whenNot: [
    'Dados de poucos GB: overhead de cluster e JVM supera o ganho (DuckDB ou Polars)',
    'Lógica dominada por UDF Python linha a linha que não pode ser vetorizada',
    'Consultas interativas de baixa latência para usuários finais',
    'collect() ou toPandas() de resultados grandes para o driver',
    'Desligar o modo ANSI globalmente para esconder erros de dados'
  ],
  metrics: [
    'Spark UI: duração das tasks (mediana vs máxima), shuffle read/write e spill por stage',
    'explain(mode="formatted"): estratégia de join, pushdown e AdaptiveSparkPlan',
    'Tamanho médio de arquivo escrito (meta: centenas de MB)',
    'Número de stages e de shuffles por job',
    'Tempo de GC dos executors e falhas de task por OOM',
    'pyspark.testing.assertDataFrameEqual em testes de cada transform'
  ],
  refs: [
    { type: 'doc', title: 'PySpark Documentation', author: 'Apache Spark', url: 'https://spark.apache.org/docs/latest/api/python/index.html', note: 'Referência oficial da API Python, Spark Connect e pandas UDFs.' },
    { type: 'doc', title: 'Spark SQL Performance Tuning', author: 'Apache Spark', url: 'https://spark.apache.org/docs/latest/sql-performance-tuning.html', note: 'AQE, broadcast, coalesce e skew join na documentação oficial.' },
    { type: 'doc', title: 'Spark Release 4.0.0', author: 'Apache Spark', url: 'https://spark.apache.org/releases/spark-release-4-0-0.html', note: 'ANSI por padrão, Spark Connect e demais mudanças da versão 4.' },
    { type: 'livro', title: 'Learning Spark, 2nd Edition', author: 'Jules Damji, Brooke Wenig, Tathagata Das e Denny Lee', url: 'https://www.oreilly.com/library/view/learning-spark-2nd/9781492050032/', note: 'O livro introdutório canônico de Spark 3 com DataFrames e Spark SQL.' },
    { type: 'paper', title: 'Resilient Distributed Datasets: A Fault-Tolerant Abstraction for In-Memory Cluster Computing', author: 'Matei Zaharia et al. (NSDI 2012)', url: 'https://www.usenix.org/conference/nsdi12/technical-sessions/presentation/zaharia', note: 'O paper fundador: linhagem, tolerância a falhas e computação em memória.' },
    { type: 'paper', title: 'Spark SQL: Relational Data Processing in Spark', author: 'Michael Armbrust et al. (SIGMOD 2015)', url: 'https://dl.acm.org/doi/10.1145/2723372.2742797', note: 'Apresenta o Catalyst e a API de DataFrame.' },
    { type: 'livro', title: 'High Performance Spark, 2nd Edition', author: 'Holden Karau, Rachel Warren e coautores', url: 'https://www.oreilly.com/library/view/high-performance-spark/9781098145842/', note: 'Shuffle, skew, particionamento e tuning em profundidade.' },
    { type: 'livro', title: 'Designing Data-Intensive Applications', author: 'Martin Kleppmann', url: 'https://dataintensive.net/', note: 'Contexto de batch processing, joins distribuídos e tolerância a falhas.' }
  ]
};

window.LESSON_CONTENT['pipelines-dados'] = {
  id: 'pipelines-dados',
  title: 'Pipelines e orquestração',
  etapa: 12, etapaName: 'Master large data',
  time: '75 min',
  tags: ['orquestracao', 'airflow', 'qualidade', 'data-contracts'],
  tagline: 'Pipeline bom não é o que nunca falha: é o que pode rodar <em>de novo</em> sem estragar nada.',
  intro: `
    <p>Um pipeline de dados é código que roda sem ninguém olhando, todo dia, sobre dados que mudam sem aviso. Em banco, ele alimenta conciliação contábil, relatórios regulatórios, modelos de crédito e fraude. Quando ele falha, o problema raramente é a falha em si: é a reexecução que duplica lançamentos, o dado parcial que alguém já consumiu, a coluna que mudou de tipo na origem e passou silenciosa até o relatório do regulador.</p>
    <p>Esta lição junta três disciplinas: <strong>orquestração</strong> (Airflow, Dagster, Prefect: quem roda o quê, quando, com quais dependências e retries), <strong>idempotência</strong> (o princípio que torna retries seguros) e <strong>qualidade de dados</strong> (data contracts, validação com pandera e Great Expectations, testes que bloqueiam a publicação de dado ruim).</p>
    <p>O livro Fundamentals of Data Engineering (Reis e Housley) chama essas preocupações de "undercurrents": segurança, gestão de dados, DataOps, arquitetura e orquestração atravessam todas as etapas do ciclo de vida. É isso que diferencia um script que funciona de um pipeline que se pode operar.</p>
  `,
  sections: [
    {
      id: 'idempotencia',
      title: 'Idempotência: o princípio número um',
      body: `
        <p>Uma tarefa é idempotente quando executá-la uma ou várias vezes com a mesma entrada produz o mesmo estado final. Orquestradores fazem retry, operadores reexecutam manualmente, backfills reprocessam meses: sem idempotência, cada uma dessas ações é um risco de duplicação.</p>
        <p>Antes (append cego, duplica em cada retry):</p>
        <pre><code class="language-python">from uuid import uuid4

def carregar_dia(data: str) -&gt; None:
    df = extrair_transacoes(data)
    df.to_parquet(f"lake/transacoes/{data}-{uuid4()}.parquet")     # novo arquivo a cada execução
    db.execute("INSERT INTO fato_tx SELECT * FROM staging")       # duplica linhas</code></pre>
        <p>Depois (partição determinística, substituição atômica, upsert por chave natural):</p>
        <pre><code class="language-python">from pathlib import Path
import os
import polars as pl

def carregar_dia(data: str, raiz: Path = Path("lake/transacoes")) -&gt; Path:
    df = extrair_transacoes(data)                      # mesma data, mesma entrada
    destino = raiz / f"data={data}" / "part-0.parquet"
    destino.parent.mkdir(parents=True, exist_ok=True)
    tmp = destino.with_suffix(".tmp")
    df.write_parquet(tmp)
    os.replace(tmp, destino)                           # rename atômico no mesmo filesystem
    return destino

# No warehouse: MERGE pela chave natural, nunca INSERT cego
SQL_UPSERT = """
MERGE INTO fato_tx AS t
USING staging_tx AS s
ON t.id_transacao = s.id_transacao
WHEN MATCHED THEN UPDATE SET valor = s.valor, status = s.status
WHEN NOT MATCHED THEN INSERT (id_transacao, valor, status) VALUES (s.id_transacao, s.valor, s.status)
"""</code></pre>
        <p>Regras que sigo: toda tarefa é parametrizada pelo <strong>intervalo lógico</strong> que processa (não por <code>datetime.now()</code>); saídas são particionadas por esse intervalo e sobrescritas inteiras; cargas em tabelas usam <code>MERGE</code> por chave natural ou <code>DELETE</code> + <code>INSERT</code> na mesma transação; e efeitos colaterais externos (enviar arquivo ao Bacen, disparar e-mail) ficam isolados em tarefas próprias, com registro de que já foram feitos.</p>
        <div class="callout warn"><strong>PEGADINHA</strong> <code>os.replace</code> é atômico num filesystem POSIX local, mas S3 não tem rename atômico de diretório. Em object storage, a atomicidade vem do formato de tabela (Delta, Iceberg) ou de um manifesto/marcador <code>_SUCCESS</code> que os consumidores respeitam.</div>
      `
    },
    {
      id: 'orquestradores',
      title: 'Airflow, Dagster e Prefect',
      body: `
        <p>Os três resolvem agendamento, dependências, retries, backfill e observabilidade de execuções, com filosofias diferentes:</p>
        <table>
          <thead><tr><th></th><th>Airflow 3.x</th><th>Dagster</th><th>Prefect 3.x</th></tr></thead>
          <tbody>
            <tr><td>Unidade central</td><td>DAG de tasks (com assets desde a 3.0)</td><td>Software-defined assets</td><td>Flows e tasks Python</td></tr>
            <tr><td>Modelo mental</td><td>"Rode estas tarefas nesta ordem"</td><td>"Mantenha estes dados atualizados"</td><td>"Este código Python, observável e com retry"</td></tr>
            <tr><td>Forte em</td><td>Ecossistema de operadores, padrão de mercado</td><td>Linhagem, tipagem, testes, particionamento</td><td>Ergonomia, workflows dinâmicos</td></tr>
            <tr><td>Cuidado com</td><td>Lógica pesada no código de topo do DAG</td><td>Curva de conceitos</td><td>Menos padronizado em grandes corporações</td></tr>
          </tbody>
        </table>
        <pre><code class="language-python"># Airflow 3: TaskFlow API com o Task SDK
from datetime import datetime
from airflow.sdk import dag, task

@dag(schedule="@daily", start_date=datetime(2026, 1, 1), catchup=False,
     default_args={"retries": 3})
def consolidacao_diaria():

    @task
    def extrair(ds: str | None = None) -&gt; str:      # ds = data lógica injetada
        return str(carregar_dia(ds))

    @task
    def validar(caminho: str) -&gt; str:
        validar_transacoes(caminho)                   # falha bloqueia o resto
        return caminho

    @task
    def publicar(caminho: str) -&gt; None:
        upsert_warehouse(caminho)

    publicar(validar(extrair()))

consolidacao_diaria()</code></pre>
        <pre><code class="language-python"># Dagster: o mesmo pipeline pensado como assets particionados
import dagster as dg

diario = dg.DailyPartitionsDefinition(start_date="2026-01-01")

@dg.asset(partitions_def=diario)
def transacoes_raw(context: dg.AssetExecutionContext) -&gt; None:
    carregar_dia(context.partition_key)

@dg.asset(partitions_def=diario, deps=[transacoes_raw])
def transacoes_validadas(context: dg.AssetExecutionContext) -&gt; None:
    validar_transacoes(f"lake/transacoes/data={context.partition_key}")</code></pre>
        <div class="callout tip"><strong>DICA</strong> O orquestrador orquestra; ele não deve processar dados. Tasks pesadas disparam Spark, DuckDB ou um container, e o worker do Airflow só espera. Código no nível de módulo do arquivo de DAG roda a cada parse do scheduler: nada de consultas a banco ou leitura de arquivo ali.</div>
      `
    },
    {
      id: 'data-contracts',
      title: 'Data contracts',
      body: `
        <p>Um data contract é um acordo explícito e versionado entre quem produz e quem consome um dataset: schema, tipos, semântica dos campos, restrições, SLA de atualização, dono e política de mudanças. A motivação é organizacional antes de técnica: o time de sistemas que altera a coluna <code>valor</code> de centavos para reais não sabe que o modelo de fraude depende dela.</p>
        <p>O contrato precisa ser <strong>executável</strong>: um documento no Confluence não para um deploy. Formas práticas: schema Pydantic ou pandera versionado num pacote compartilhado, especificações como a Open Data Contract Standard (ODCS, mantida pelo projeto Bitol da Linux Foundation), schema registry para eventos (Avro ou Protobuf com regras de compatibilidade) e checagem no CI do produtor.</p>
        <pre><code class="language-yaml"># contrato versionado junto com o código do produtor
dataset: transacoes_pix
versao: 2.1.0
dono: time-pagamentos
sla_atualizacao: "D+0 até 06:00 BRT"
colunas:
  - nome: id_transacao     # end-to-end ID do Pix
    tipo: string
    obrigatorio: true
    unico: true
  - nome: valor_centavos
    tipo: int64
    obrigatorio: true
    regra: "&gt; 0"
  - nome: ts_liquidacao
    tipo: timestamp[us, UTC]
    obrigatorio: true
compatibilidade: "backward: só adição de colunas opcionais sem bump major"</code></pre>
        <p>Regra de versionamento que funciona: adicionar coluna opcional é minor; remover coluna, mudar tipo ou mudar semântica é major, exige nova versão do dataset publicada em paralelo e período de migração dos consumidores. É o mesmo raciocínio de API pública aplicado a dados.</p>
      `
    },
    {
      id: 'validacao-pandera',
      title: 'Validação com pandera',
      body: `
        <p>pandera valida DataFrames (pandas, Polars, PySpark) contra schemas declarativos em Python, com integração ao sistema de tipos. É leve, vive no próprio código do pipeline e é minha primeira escolha para o contrato executável.</p>
        <pre><code class="language-python">import pandas as pd
import pandera.pandas as pa
from pandera.typing import DataFrame, Series

class Transacoes(pa.DataFrameModel):
    id_transacao: Series[str] = pa.Field(unique=True)
    conta: Series[int] = pa.Field(ge=0)
    valor_centavos: Series[int] = pa.Field(gt=0)
    canal: Series[str] = pa.Field(isin=["pix", "ted", "boleto", "cartao"])

    class Config:
        strict = True        # coluna extra é erro: protege contra drift
        coerce = True

@pa.check_types               # valida entrada e saída a cada chamada
def enriquecer(df: DataFrame[Transacoes]) -&gt; DataFrame[Transacoes]:
    return df

try:
    Transacoes.validate(df_bruto, lazy=True)   # lazy: coleta todos os erros
except pa.errors.SchemaErrors as e:
    print(e.failure_cases[["column", "check", "failure_case"]])</code></pre>
        <p>Saída real para um DataFrame com problemas:</p>
        <pre><code class="language-text">           column                                     check failure_case
0    id_transacao                          field_uniqueness            b
1    id_transacao                          field_uniqueness            b
2           conta               greater_than_or_equal_to(0)           -3
3  valor_centavos                           greater_than(0)            0
4           canal  isin(['pix', 'ted', 'boleto', 'cartao'])          doc</code></pre>
        <p>O <code>lazy=True</code> é essencial em produção: você quer o relatório completo de falhas para o time produtor, não só a primeira. Para Polars, o módulo é <code>pandera.polars</code>, com a mesma sintaxe de modelo.</p>
      `
    },
    {
      id: 'great-expectations',
      title: 'Great Expectations e checagens de pipeline',
      body: `
        <p>Great Expectations (GX Core 1.x) é mais pesado e mais completo: suítes de expectativas, data docs navegáveis, checkpoints com ações (alertas, bloqueio), e conectores para warehouses. Cabe melhor quando a validação é um produto em si, com relatórios para times de negócio e governança.</p>
        <pre><code class="language-python">import great_expectations as gx

context = gx.get_context(mode="ephemeral")
fonte = context.data_sources.add_pandas("extratos")
asset = fonte.add_dataframe_asset("transacoes")
lote_def = asset.add_batch_definition_whole_dataframe("lote_diario")

suite = context.suites.add(gx.ExpectationSuite(name="transacoes"))
suite.add_expectation(gx.expectations.ExpectColumnValuesToNotBeNull(column="conta"))
suite.add_expectation(gx.expectations.ExpectColumnValuesToBeBetween(
    column="valor_centavos", min_value=1, max_value=100_000_000_00))
suite.add_expectation(gx.expectations.ExpectColumnValuesToBeUnique(column="id_transacao"))

resultado = lote_def.get_batch(batch_parameters={"dataframe": df}).validate(suite)
if not resultado.success:
    raise RuntimeError("lote reprovado na validação; publicação bloqueada")</code></pre>
        <p>Além de schema e valores, os checks que mais pegam incidente em dado financeiro:</p>
        <ul>
          <li><strong>Volume:</strong> contagem do dia dentro de uma faixa histórica (queda de 40% num dia útil é quase sempre falha de extração, não de negócio).</li>
          <li><strong>Freshness:</strong> o maior <code>ts</code> está dentro do SLA.</li>
          <li><strong>Reconciliação:</strong> soma de valores bate com o total de controle da origem (o "trailer" do arquivo CNAB, por exemplo).</li>
          <li><strong>Integridade referencial:</strong> toda conta existe na dimensão.</li>
          <li><strong>Distribuição:</strong> proporção de nulos e de cada categoria estável em relação à semana anterior.</li>
        </ul>
      `
    },
    {
      id: 'padroes-arquitetura',
      title: 'Padrões: medallion, write-audit-publish e backfill',
      body: `
        <p><strong>Medallion</strong> (bronze, silver, gold): bronze guarda o dado bruto como chegou, imutável e com metadados de ingestão (permite reprocessar qualquer coisa); silver é limpo, tipado e deduplicado; gold é agregado e modelado para consumo. A camada bronze imutável é o que torna backfill possível.</p>
        <p><strong>Write-Audit-Publish (WAP)</strong>: escreva o resultado num local isolado (branch do Iceberg/Nessie, tabela de staging, diretório temporário), audite com as validações, e só então publique atomicamente. Consumidores nunca veem dado não validado.</p>
        <pre><code class="language-python">def wap(data: str) -&gt; None:
    staging = f"lake/_staging/transacoes/data={data}"
    final = f"lake/silver/transacoes/data={data}"

    escrever(transformar(ler_bronze(data)), staging)       # WRITE
    relatorio = auditar(staging)                           # AUDIT
    if not relatorio.ok:
        alertar(relatorio)
        raise RuntimeError(f"auditoria reprovou {data}: {relatorio.resumo}")
    publicar_atomicamente(staging, final)                  # PUBLISH (swap / commit)

# Backfill: a mesma função, iterada sobre o intervalo, graças à idempotência
for dia in intervalo_de_datas("2026-01-01", "2026-03-31"):
    wap(dia)</code></pre>
        <div class="callout"><strong>NA ENTREVISTA</strong> "Um bug na transformação gerou valores errados por três meses. Como corrige?" Resposta sênior: corrigir a lógica com teste que reproduz o bug, reprocessar o intervalo a partir do bronze imutável com a mesma tarefa idempotente (backfill), validar com WAP antes de publicar, comunicar consumidores com o intervalo afetado, e usar time travel do formato de tabela para comparar antes e depois. Se a resposta envolve "rodar um UPDATE manual", é sinal de alerta.</div>
      `
    }
  ],
  whenToUse: [
    'Qualquer processamento recorrente cujo resultado alguém consome sem revisar',
    'Dependências entre várias etapas e sistemas com retries e alertas',
    'Datasets compartilhados entre times (data contracts e validação no produtor)',
    'Cargas que precisam de backfill confiável a partir de dado bruto imutável',
    'Dados regulatórios e contábeis em que dado errado publicado é incidente'
  ],
  whenNot: [
    'Script exploratório de uso único: orquestrador é sobrecarga',
    'Processar dados pesados dentro do worker do orquestrador',
    'Tasks dependentes de datetime.now() em vez do intervalo lógico',
    'INSERT cego em tabela final sem chave natural',
    'Validações que só registram em log e nunca bloqueiam a publicação'
  ],
  metrics: [
    'Taxa de sucesso das execuções e tempo médio de recuperação',
    'Freshness: atraso entre o fim do intervalo lógico e a publicação',
    'Número de checks de qualidade por dataset e taxa de reprovação',
    'Reexecução de um dia já processado produz exatamente o mesmo resultado (teste de idempotência)',
    'Linhagem rastreável do gold até o bronze (Dagster, OpenLineage)',
    'pandera, Great Expectations, dbt tests e Soda como ferramentas de validação'
  ],
  refs: [
    { type: 'livro', title: 'Fundamentals of Data Engineering', author: 'Joe Reis e Matt Housley', url: 'https://www.oreilly.com/library/view/fundamentals-of-data/9781098108298/', note: 'Ciclo de vida dos dados e os undercurrents de orquestração e DataOps.' },
    { type: 'doc', title: 'Apache Airflow Documentation', author: 'Apache Airflow', url: 'https://airflow.apache.org/docs/apache-airflow/stable/index.html', note: 'TaskFlow, assets, boas práticas de DAG e Airflow 3.' },
    { type: 'doc', title: 'Dagster Documentation', author: 'Dagster Labs', url: 'https://docs.dagster.io/', note: 'Software-defined assets, partições e testes.' },
    { type: 'doc', title: 'Prefect Documentation', author: 'Prefect', url: 'https://docs.prefect.io/', note: 'Flows e tasks Python com retries e observabilidade.' },
    { type: 'doc', title: 'pandera', author: 'Union.ai e comunidade', url: 'https://pandera.readthedocs.io/', note: 'Validação estatística e de schema para pandas, Polars e PySpark.' },
    { type: 'doc', title: 'GX Core Documentation', author: 'Great Expectations', url: 'https://docs.greatexpectations.io/docs/core/introduction/', note: 'Expectations, suítes e checkpoints na API 1.x.' },
    { type: 'portal', title: 'Open Data Contract Standard', author: 'Bitol (Linux Foundation AI and Data)', url: 'https://bitol-io.github.io/open-data-contract-standard/', note: 'Especificação aberta de data contracts.' },
    { type: 'artigo', title: 'Functional Data Engineering: a modern paradigm for batch data processing', author: 'Maxime Beauchemin', url: 'https://maximebeauchemin.medium.com/functional-data-engineering-a-modern-paradigm-for-batch-data-processing-2327ec32c42a', note: 'O texto clássico do criador do Airflow sobre idempotência e partições imutáveis.' }
  ]
};

window.LESSON_CONTENT['packaging'] = {
  id: 'packaging',
  title: 'Packaging e distribuição',
  etapa: 13, etapaName: 'Python em produção',
  time: '60 min',
  tags: ['pyproject', 'wheels', 'pypi', 'versionamento'],
  tagline: 'Um pacote bem feito é um <em>contrato</em>: metadados declarativos, artefatos reproduzíveis e publicação verificável.',
  intro: `
    <p>Durante muito tempo, empacotar Python significava um <code>setup.py</code> executável, cheio de lógica imperativa, que rodava no momento da instalação. A virada veio com uma sequência de PEPs: a 517 e a 518 separaram frontend (pip, uv, build) de backend (setuptools, hatchling, flit-core, uv_build, maturin), a 621 trouxe metadados declarativos no <code>pyproject.toml</code>, e PEPs mais recentes padronizaram licenças (639), grupos de dependências de desenvolvimento (735), lockfiles (751) e atestados de procedência no índice (740).</p>
    <p>Para quem trabalha em banco, packaging não é só "publicar no PyPI". É distribuir bibliotecas internas (o SDK do data lake, o pacote de schemas compartilhados, o cliente da API de crédito) num índice privado, com versões semânticas que outros times confiam, wheels que instalam em segundos no CI e uma cadeia de procedência que a segurança consegue auditar.</p>
    <p>Esta lição é sobre o artefato. A gestão de ambiente (uv, venv, lockfiles para aplicações) foi tratada na lição de ambiente moderno; aqui o foco é transformar código em algo instalável, versionado e publicável.</p>
  `,
  sections: [
    {
      id: 'sdist-wheel',
      title: 'sdist, wheel e o que acontece no pip install',
      body: `
        <p>Existem dois formatos de distribuição:</p>
        <ul>
          <li><strong>sdist</strong> (<code>.tar.gz</code>): código-fonte mais metadados. Instalar exige rodar o backend de build na máquina de destino, inclusive compilar extensões C/Rust.</li>
          <li><strong>wheel</strong> (<code>.whl</code>): um zip já "construído", pronto para descompactar no <code>site-packages</code>. Nenhum código do pacote roda na instalação.</li>
        </ul>
        <p>O nome do wheel codifica a compatibilidade: <code>polars-2.1.0-cp39-abi3-manylinux_2_17_x86_64.whl</code> diz versão, tag de Python (<code>cp39-abi3</code>: ABI estável, serve do 3.9 em diante), e plataforma (glibc 2.17 ou mais nova, x86_64). Um pacote Python puro gera <code>py3-none-any</code>, que serve em qualquer lugar.</p>
        <pre><code class="language-bash"># Construir sdist e wheel com o frontend padrão
python -m build              # ou: uv build
ls dist/
# meu_pacote-1.4.0.tar.gz
# meu_pacote-1.4.0-py3-none-any.whl

# Inspecionar o conteúdo e os metadados
unzip -l dist/meu_pacote-1.4.0-py3-none-any.whl
unzip -p dist/meu_pacote-1.4.0-py3-none-any.whl 'meu_pacote-1.4.0.dist-info/METADATA'

# Validar metadados antes de publicar
python -m twine check dist/*</code></pre>
        <div class="callout"><strong>NA ENTREVISTA</strong> "Por que publicar wheels se o sdist funciona?" Porque instalar sdist executa código de build arbitrário na máquina do usuário (risco de segurança), exige compiladores e headers (falha em imagem slim), e é lento. Wheel é determinístico e seguro de instalar. Em ambientes restritos, é comum configurar <code>pip install --only-binary=:all:</code>.</div>
      `
    },
    {
      id: 'pyproject',
      title: 'pyproject.toml completo e moderno',
      body: `
        <pre><code class="language-toml">[build-system]
requires = ["hatchling&gt;=1.27"]
build-backend = "hatchling.build"

[project]
name = "banco-lake-sdk"
dynamic = ["version"]                      # versão vem do git (ver abaixo)
description = "Cliente do data lake corporativo"
readme = "README.md"
requires-python = "&gt;=3.12"
license = "Apache-2.0"                     # PEP 639: expressão SPDX
license-files = ["LICENSE"]
authors = [{ name = "Time de Dados" }]
classifiers = [
    "Programming Language :: Python :: 3.12",
    "Programming Language :: Python :: 3.13",
    "Programming Language :: Python :: 3.14",
    "Typing :: Typed",
]
dependencies = [
    "pyarrow&gt;=18",                       # biblioteca: limites inferiores, não pins
    "httpx&gt;=0.27,&lt;1",
]

[project.optional-dependencies]
polars = ["polars&gt;=1.20"]               # extras: pip install banco-lake-sdk[polars]

[project.scripts]
lake = "banco_lake_sdk.cli:main"          # gera o executável "lake"

[project.urls]
Repository = "https://git.interno/dados/banco-lake-sdk"

[dependency-groups]                       # PEP 735: só para desenvolvimento, não vai para o wheel
dev = ["pytest&gt;=8", "mypy&gt;=1.13", "ruff"]

[tool.hatch.version]
source = "vcs"                            # requer o plugin hatch-vcs em build-system.requires</code></pre>
        <p>Pontos que mais vejo errados em code review:</p>
        <ul>
          <li><strong>Biblioteca com pins exatos</strong> (<code>pyarrow==18.0.0</code>): impede quem instala de resolver junto com outras dependências. Biblioteca declara faixas compatíveis; <strong>aplicação</strong> é que trava tudo num lockfile.</li>
          <li><strong>Teto de versão automático</strong> (<code>&lt;2</code> em tudo): parece prudente, mas gera conflitos insolúveis no futuro. Use teto só quando você sabe que a próxima major quebra.</li>
          <li><strong>Dependências de teste em <code>dependencies</code></strong>: vão para produção de todo mundo que instalar. Use <code>[dependency-groups]</code>.</li>
          <li><strong>Sem <code>requires-python</code></strong>: resolvers não conseguem escolher versões compatíveis.</li>
        </ul>
        <div class="callout tip"><strong>DICA</strong> Para versão a partir de tags git, use <code>hatch-vcs</code> (Hatchling) ou <code>setuptools-scm</code> (setuptools). A tag <code>v1.4.0</code> vira a versão do wheel, e commits após a tag geram versões de desenvolvimento, sem ninguém editar número à mão.</div>
      `
    },
    {
      id: 'layout-src',
      title: 'Layout src, py.typed e dados do pacote',
      body: `
        <pre><code class="language-text">banco-lake-sdk/
├── pyproject.toml
├── README.md
├── LICENSE
├── src/
│   └── banco_lake_sdk/
│       ├── __init__.py
│       ├── py.typed            # marcador PEP 561: o pacote exporta tipos
│       ├── cliente.py
│       ├── cli.py
│       └── schemas/
│           └── transacao.json  # dado do pacote
└── tests/
    └── test_cliente.py</code></pre>
        <p>O layout <code>src/</code> força os testes a rodarem contra o pacote <strong>instalado</strong>, não contra a pasta do repositório. Sem ele, um arquivo esquecido fora do wheel passa nos testes locais e quebra em produção. É barato e pega uma classe inteira de bugs.</p>
        <pre><code class="language-python"># Ler um arquivo de dados que vai dentro do wheel (funciona até em zip)
from importlib.resources import files
import json

def schema_transacao() -&gt; dict:
    texto = files("banco_lake_sdk.schemas").joinpath("transacao.json").read_text("utf-8")
    return json.loads(texto)

# Versão instalada em runtime, sem duplicar o número no código
from importlib.metadata import version, PackageNotFoundError

try:
    __version__ = version("banco-lake-sdk")
except PackageNotFoundError:          # rodando sem instalar
    __version__ = "0+desconhecida"</code></pre>
        <div class="callout warn"><strong>PEGADINHA</strong> <code>open(os.path.join(os.path.dirname(__file__), "schemas/x.json"))</code> funciona no seu laptop e falha quando o pacote é importado de um zip ou de um layout diferente. <code>importlib.resources</code> é a API correta e portável.</div>
      `
    },
    {
      id: 'backends-extensoes',
      title: 'Build backends e extensões nativas',
      body: `
        <table>
          <thead><tr><th>Backend</th><th>Quando usar</th></tr></thead>
          <tbody>
            <tr><td>hatchling</td><td>Python puro, configuração enxuta, plugins (vcs, build hooks)</td></tr>
            <tr><td>setuptools</td><td>Legado, extensões C tradicionais, máxima compatibilidade</td></tr>
            <tr><td>flit-core</td><td>Pacotes Python puros e simples, mínimo de configuração</td></tr>
            <tr><td>uv_build</td><td>Python puro em projetos já padronizados em uv, build muito rápido</td></tr>
            <tr><td>maturin</td><td>Extensões em Rust com PyO3 (é o que Polars, pydantic-core e ruff usam)</td></tr>
            <tr><td>scikit-build-core / meson-python</td><td>Extensões C/C++ com CMake ou Meson (NumPy e SciPy usam meson-python)</td></tr>
          </tbody>
        </table>
        <p>Para extensões nativas, o trabalho pesado é gerar wheels para cada combinação de Python e plataforma. O <code>cibuildwheel</code> automatiza isso no CI, construindo em containers manylinux e musllinux, e em runners macOS e Windows.</p>
        <pre><code class="language-yaml"># .github/workflows/wheels.yml (trecho)
jobs:
  wheels:
    strategy:
      matrix:
        os: [ubuntu-latest, macos-latest, windows-latest]
    runs-on: $\{{ matrix.os }}
    steps:
      - uses: actions/checkout@v4
      - uses: pypa/cibuildwheel@v3.4.1
        env:
          CIBW_SKIP: "pp*"
          CIBW_TEST_COMMAND: "pytest {project}/tests -q"
      - uses: actions/upload-artifact@v4
        with:
          name: wheels-$\{{ matrix.os }}
          path: wheelhouse/*.whl</code></pre>
        <p>Com o Python free-threaded (PEP 703, build experimental no 3.13 e suportado oficialmente no 3.14 pela PEP 779), surge uma tag de ABI nova (<code>cp314t</code>). Extensões precisam declarar suporte explicitamente; se você mantém uma, inclua essa variante na matriz quando o código for thread-safe sem o GIL.</p>
      `
    },
    {
      id: 'versionamento',
      title: 'Versionamento semântico e política de quebra',
      body: `
        <p>Versões em Python seguem a especificação de versionamento do PyPA (derivada da PEP 440): <code>1.4.0</code>, <code>1.5.0rc1</code>, <code>2.0.0.dev3</code>, <code>1.4.0.post1</code>. Para bibliotecas internas consumidas por vários times, SemVer é o contrato:</p>
        <ul>
          <li><strong>MAJOR:</strong> remove ou muda comportamento público. Exige nota de migração.</li>
          <li><strong>MINOR:</strong> adiciona funcionalidade compatível.</li>
          <li><strong>PATCH:</strong> corrige bug sem mudar API.</li>
        </ul>
        <p>O que é "API pública" precisa ser explícito: nomes sem underscore exportados no <code>__init__</code>, listados em <code>__all__</code>. Tudo o mais é interno e pode mudar. Deprecie antes de remover:</p>
        <pre><code class="language-python">import warnings
from warnings import deprecated     # Python 3.13+ (PEP 702); antes: typing_extensions

@deprecated("use ler_particao(); será removido na 3.0")
def ler_dia(data: str):
    return ler_particao(data)

def ler_tabela(nome: str, *, formato: str | None = None):
    if formato is not None:
        warnings.warn(
            "o argumento 'formato' é ignorado desde a 2.3 e será removido na 3.0",
            DeprecationWarning,
            stacklevel=2,          # aponta para quem chamou, não para esta linha
        )
    ...</code></pre>
        <p><code>warnings.deprecated</code> tem efeito duplo: emite <code>DeprecationWarning</code> em runtime e é reconhecido por mypy e pyright, que marcam o uso no editor. No CI dos consumidores, rode os testes com <code>-W error::DeprecationWarning</code> para descobrir o que vai quebrar na próxima major antes dela sair.</p>
      `
    },
    {
      id: 'publicacao',
      title: 'Publicação com trusted publishing e atestados',
      body: `
        <p>A forma antiga de publicar era guardar um token do PyPI como segredo no CI. Token de longa duração vaza (log, fork, máquina comprometida) e dá poder de publicar qualquer versão. O <strong>trusted publishing</strong> substitui isso por OIDC: o PyPI confia em um workflow específico de um repositório específico, e o CI troca um token OIDC efêmero por uma credencial de upload válida por minutos.</p>
        <pre><code class="language-yaml"># .github/workflows/release.yml
name: release
on:
  push:
    tags: ["v*"]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with: { fetch-depth: 0 }          # tags para a versão via vcs
      - run: pipx run build
      - uses: actions/upload-artifact@v4
        with: { name: dist, path: dist/ }

  publish:
    needs: build
    runs-on: ubuntu-latest
    environment: pypi                      # aprovação manual configurável
    permissions:
      id-token: write                      # obrigatório para OIDC
    steps:
      - uses: actions/download-artifact@v4
        with: { name: dist, path: dist/ }
      - uses: pypa/gh-action-pypi-publish@release/v1</code></pre>
        <p>Com trusted publishing, a action do PyPA também gera e envia <strong>atestados</strong> (PEP 740) assinados via Sigstore, ligando cada arquivo publicado ao workflow e ao commit que o produziram. Quem consome pode verificar a procedência. Separar build e publish em jobs diferentes garante que o job com permissão de publicar não executa código do projeto.</p>
        <div class="callout tip"><strong>DICA</strong> Para índices privados (Artifactory, Nexus, AWS CodeArtifact, GitLab), a lógica é a mesma: credencial efêmera via OIDC do CI quando o índice suportar, e nunca token pessoal. E configure os clientes para buscar pacotes internos <em>só</em> no índice interno, evitando dependency confusion (a lição de segurança detalha).</div>
      `
    },
    {
      id: 'lockfiles-aplicacoes',
      title: 'Biblioteca vs aplicação: lockfiles e reprodutibilidade',
      body: `
        <p>A distinção mais importante de packaging: <strong>biblioteca</strong> declara faixas e deixa o resolvedor do consumidor decidir; <strong>aplicação</strong> (serviço, job, DAG) trava versões exatas com hashes, para que o build de hoje e o de daqui a seis meses instalem os mesmos bytes.</p>
        <pre><code class="language-bash"># Aplicação com uv: lockfile multiplataforma com hashes
uv lock
uv sync --locked                  # falha se o lock estiver desatualizado (CI)

# Exportar no formato padronizado pela PEP 751 (pylock.toml)
uv export --format pylock.toml -o pylock.toml

# Com pip puro: requirements com hashes e instalação estrita
pip-compile --generate-hashes -o requirements.txt pyproject.toml
pip install --require-hashes --no-deps -r requirements.txt</code></pre>
        <p>O <code>pylock.toml</code> (PEP 751) é o primeiro formato de lockfile padronizado do ecossistema, pensado para ser lido por qualquer instalador. Até a adoção ficar universal, o <code>uv.lock</code> e os requirements com hashes continuam comuns; o importante é que exista um lock, versionado, usado no CI e na imagem de produção.</p>
        <div class="callout warn"><strong>PEGADINHA</strong> Commitar um lock gerado em macOS e instalar em Linux pode faltar wheels de plataforma se a ferramenta não resolver para múltiplas plataformas. <code>uv lock</code> é universal por padrão; com <code>pip-compile</code>, gere o lock na mesma plataforma e versão de Python da produção (dentro do container de build).</div>
      `
    }
  ],
  whenToUse: [
    'Código reutilizado por mais de um projeto ou time (SDKs, schemas, clientes de API)',
    'Ferramentas de linha de comando distribuídas internamente via entry points',
    'Qualquer projeto que precisa de instalação reproduzível em CI e produção',
    'Extensões nativas que exigem wheels por plataforma (cibuildwheel, maturin)',
    'Publicação em PyPI ou índice privado com procedência verificável'
  ],
  whenNot: [
    'Pins exatos em dependências de biblioteca (deixe isso para o lockfile da aplicação)',
    'setup.py com lógica imperativa em projeto novo',
    'Tokens de longa duração do PyPI guardados em segredos de CI quando trusted publishing é possível',
    'Dependências de teste e lint em [project.dependencies]',
    'Publicar só sdist de pacote com extensão nativa'
  ],
  metrics: [
    'twine check dist/* sem erros antes de publicar',
    'check-wheel-contents e unzip -l para conferir o que entrou no wheel',
    'Testes rodando contra o wheel instalado (layout src, tox ou nox)',
    'uv sync --locked ou pip install --require-hashes no CI',
    'Atestados PEP 740 presentes nas versões publicadas',
    'validate-pyproject no pre-commit'
  ],
  refs: [
    { type: 'doc', title: 'Python Packaging User Guide', author: 'Python Packaging Authority', url: 'https://packaging.python.org/', note: 'Guia oficial, incluindo o tutorial de pyproject.toml e as especificações.' },
    { type: 'doc', title: 'Writing your pyproject.toml', author: 'Python Packaging Authority', url: 'https://packaging.python.org/en/latest/guides/writing-pyproject-toml/', note: 'Referência campo a campo dos metadados modernos.' },
    { type: 'doc', title: 'PyPI Docs: Trusted Publishers', author: 'Python Software Foundation', url: 'https://docs.pypi.org/trusted-publishers/', note: 'Configuração de publicação via OIDC sem tokens.' },
    { type: 'doc', title: 'PEP 751: A file format to record Python dependencies for installation', author: 'Brett Cannon', url: 'https://peps.python.org/pep-0751/', note: 'O lockfile padronizado pylock.toml.' },
    { type: 'doc', title: 'PEP 740: Index support for digital attestations', author: 'William Woodruff e Facundo Tuesca', url: 'https://peps.python.org/pep-0740/', note: 'Como atestados de procedência chegam ao PyPI.' },
    { type: 'doc', title: 'PEP 639: Improving License Clarity with Better Package Metadata', author: 'Philippe Ombredanne e C.A.M. Gerlach', url: 'https://peps.python.org/pep-0639/', note: 'Licenças como expressões SPDX e license-files.' },
    { type: 'doc', title: 'cibuildwheel', author: 'PyPA', url: 'https://cibuildwheel.pypa.io/', note: 'Construção de wheels para todas as plataformas no CI.' },
    { type: 'artigo', title: 'Python Packaging Best Practices', author: 'pyOpenSci', url: 'https://www.pyopensci.org/python-package-guide/', note: 'Guia comunitário revisado, ótimo para padronizar pacotes internos.' }
  ]
};

window.LESSON_CONTENT['fastapi-servicos'] = {
  id: 'fastapi-servicos',
  title: 'Serviços com FastAPI',
  etapa: 13, etapaName: 'Python em produção',
  time: '75 min',
  tags: ['fastapi', 'asgi', 'async', 'openapi'],
  tagline: 'FastAPI facilita escrever APIs. Escrever APIs que não <em>travam o event loop</em> continua sendo responsabilidade sua.',
  intro: `
    <p>FastAPI combinou três ideias que pegaram: type hints como fonte única de verdade (validação, serialização e documentação a partir da mesma anotação), Pydantic v2 com núcleo em Rust para validação rápida, e Starlette como base ASGI assíncrona. O resultado é que um endpoint tipado gera automaticamente schema OpenAPI, documentação interativa e respostas 422 detalhadas para entrada inválida.</p>
    <p>O risco está no mesmo lugar da facilidade. Um <code>async def</code> com uma chamada bloqueante dentro (driver de banco síncrono, <code>requests</code>, <code>time.sleep</code>, um <code>model.predict</code> pesado) congela o event loop e derruba a latência de todas as requisições do worker. É o bug de produção mais comum em serviços FastAPI que já revisei, e ele não aparece em teste local com uma requisição por vez.</p>
    <p>Esta lição cobre o modelo ASGI, quando usar <code>def</code> versus <code>async def</code>, injeção de dependências, validação na borda, ciclo de vida de recursos, contratos OpenAPI e testes, com o olhar de quem opera APIs de pagamento.</p>
  `,
  sections: [
    {
      id: 'asgi',
      title: 'ASGI, event loop e o modelo de concorrência',
      body: `
        <p>ASGI é a interface entre servidor (Uvicorn, Hypercorn, Granian) e aplicação, sucessora assíncrona do WSGI. Um worker Uvicorn roda <strong>um event loop numa thread</strong>: enquanto uma requisição espera I/O (<code>await</code>), o loop atende outras. Isso dá concorrência alta para workloads de I/O com pouca memória, desde que ninguém bloqueie o loop.</p>
        <p>O FastAPI trata os dois tipos de função de forma diferente:</p>
        <ul>
          <li><strong><code>async def</code></strong>: roda direto no event loop. Tudo dentro precisa ser não bloqueante (<code>await</code> em cliente assíncrono).</li>
          <li><strong><code>def</code></strong>: o FastAPI executa num threadpool (via AnyIO, com limite padrão de 40 threads), então código bloqueante não trava o loop, mas compete por threads.</li>
        </ul>
        <pre><code class="language-python">import time
import asyncio
import httpx
from fastapi import FastAPI

app = FastAPI()

@app.get("/ruim")
async def ruim():
    time.sleep(1)                 # BLOQUEIA o loop: todas as requisições do worker param
    return {"ok": True}

@app.get("/ok-sync")
def ok_sync():
    time.sleep(1)                 # roda no threadpool: não trava o loop
    return {"ok": True}

@app.get("/ok-async")
async def ok_async():
    await asyncio.sleep(1)        # cede o loop enquanto espera
    async with httpx.AsyncClient() as client:
        r = await client.get("https://api.interna/limite")
    return r.json()</code></pre>
        <div class="callout warn"><strong>PEGADINHA</strong> A regra prática: se a biblioteca que você chama não é assíncrona, declare o endpoint com <code>def</code>. Se precisar misturar dentro de um <code>async def</code>, use <code>await anyio.to_thread.run_sync(func)</code> ou <code>asyncio.to_thread(func)</code>. CPU pesada (inferência, criptografia em lote) não deve ficar nem no loop nem no threadpool do mesmo processo: vai para um pool de processos ou outro serviço.</div>
      `
    },
    {
      id: 'validacao-modelos',
      title: 'Validação na borda com Pydantic',
      body: `
        <p>O corpo da requisição é validado por um modelo Pydantic antes de chegar à sua função. Isso é a "validação na borda": o domínio só recebe dados já tipados e com invariantes garantidas. Para APIs financeiras, <code>Decimal</code> com casas fixas é obrigatório.</p>
        <pre><code class="language-python">from decimal import Decimal
from typing import Annotated
from pydantic import BaseModel, Field, ConfigDict

class PixIn(BaseModel):
    model_config = ConfigDict(extra="forbid", str_strip_whitespace=True)

    chave: str = Field(min_length=1, max_length=77)
    valor: Decimal = Field(gt=0, max_digits=12, decimal_places=2)
    descricao: str | None = Field(default=None, max_length=140)
    id_idempotencia: Annotated[str, Field(pattern=r"^[A-Za-z0-9-]{8,64}$")]

class PixOut(BaseModel):
    id: str
    status: str
    # campos internos (conta de origem completa, score de fraude) não estão aqui:
    # o response_model filtra o que sai, mesmo que o objeto tenha mais atributos</code></pre>
        <p>Uma requisição com <code>"valor": "10.505"</code> recebe 422 com <code>type: decimal_max_places</code> sem uma linha de código seu. O <code>extra="forbid"</code> rejeita campos desconhecidos, o que pega erro de integração cedo (cliente mandando <code>valr</code> em vez de <code>valor</code> e recebendo default silencioso).</p>
        <div class="callout tip"><strong>DICA</strong> Separe modelos de entrada, de saída e de domínio. Reaproveitar o mesmo modelo para tudo vaza campos (um <code>senha_hash</code> no response) e acopla o contrato público ao seu banco. O <code>response_model</code> é uma barreira de segurança, não só documentação.</div>
      `
    },
    {
      id: 'dependencias',
      title: 'Injeção de dependências',
      body: `
        <p><code>Depends</code> é o mecanismo de composição do FastAPI: autenticação, sessão de banco, paginação, feature flags. Dependências podem depender de outras, são resolvidas por requisição (com cache dentro da mesma requisição) e podem ser substituídas em testes.</p>
        <pre><code class="language-python">from typing import Annotated
from collections.abc import AsyncIterator
from fastapi import Depends, Header, HTTPException, status

async def conta_atual(authorization: Annotated[str, Header()]) -&gt; str:
    token = authorization.removeprefix("Bearer ")
    claims = await validar_jwt(token)              # verifica assinatura, exp, aud
    if "pix:write" not in claims.get("scope", "").split():
        raise HTTPException(status.HTTP_403_FORBIDDEN, "escopo insuficiente")
    return claims["sub"]

async def sessao_db() -&gt; AsyncIterator[AsyncSession]:
    async with SessionLocal() as sessao:           # yield: setup e teardown
        yield sessao

Conta = Annotated[str, Depends(conta_atual)]
Sessao = Annotated[AsyncSession, Depends(sessao_db)]

@app.post("/pix", response_model=PixOut, status_code=201)
async def criar_pix(body: PixIn, conta: Conta, db: Sessao) -&gt; PixOut:
    existente = await buscar_por_idempotencia(db, conta, body.id_idempotencia)
    if existente:
        return existente                           # retry do cliente não duplica
    return await registrar_pix(db, conta, body)</code></pre>
        <p>O alias <code>Annotated[T, Depends(...)]</code> é o estilo recomendado: reutilizável, legível e compatível com type checkers. Repare na chave de idempotência: em API de pagamento, o cliente vai reenviar a mesma requisição após timeout, e o servidor precisa reconhecer a repetição. É o mesmo princípio dos pipelines idempotentes, aplicado a HTTP.</p>
      `
    },
    {
      id: 'lifespan-recursos',
      title: 'Ciclo de vida: lifespan, pools e timeouts',
      body: `
        <p>Recursos caros (pool de conexões, cliente HTTP, modelo carregado) devem ser criados uma vez por processo, no startup, e fechados no shutdown. O <code>lifespan</code> é o mecanismo atual (os eventos <code>on_event</code> estão depreciados).</p>
        <pre><code class="language-python">from contextlib import asynccontextmanager
import httpx
from fastapi import FastAPI, Request

@asynccontextmanager
async def lifespan(app: FastAPI):
    app.state.http = httpx.AsyncClient(
        timeout=httpx.Timeout(2.0, connect=0.5),         # sempre com timeout
        limits=httpx.Limits(max_connections=100, max_keepalive_connections=20),
    )
    app.state.engine = criar_engine_async(pool_size=10, max_overflow=5)
    yield                                                 # app atende requisições aqui
    await app.state.http.aclose()
    await app.state.engine.dispose()

app = FastAPI(title="Pagamentos", version="1.4.0", lifespan=lifespan)

@app.get("/limite/{conta}")
async def limite(conta: str, request: Request):
    r = await request.app.state.http.get(f"https://credito.interno/limite/{conta}")
    r.raise_for_status()
    return r.json()</code></pre>
        <p>Criar um <code>httpx.AsyncClient</code> por requisição desperdiça handshake TLS e conexões. Cliente sem timeout é pior: uma dependência lenta prende requisições indefinidamente até esgotar o pool, e a falha se propaga em cascata. Timeouts, limites de conexão e circuit breaker são parte do contrato de confiabilidade, não detalhe.</p>
        <div class="callout"><strong>NA ENTREVISTA</strong> "Seu serviço FastAPI tem p99 de 8 s mas a CPU está em 10%. Hipóteses?" Event loop bloqueado por chamada síncrona em <code>async def</code>; threadpool esgotado por endpoints <code>def</code> lentos; pool de conexões do banco pequeno com requisições esperando; dependência externa sem timeout. Como confirmar: tracing por span, métricas de pool, e <code>py-spy dump</code> no processo para ver onde as threads estão paradas.</div>
      `
    },
    {
      id: 'erros-contratos',
      title: 'Erros, versionamento e contrato OpenAPI',
      body: `
        <p>O schema OpenAPI gerado (<code>/openapi.json</code>) é o contrato da API. Trate-o como artefato: versione, compare no CI e gere clientes a partir dele. Erros devem ter formato consistente; o padrão RFC 9457 (Problem Details) é uma boa base.</p>
        <pre><code class="language-python">from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse

class SaldoInsuficiente(Exception):
    def __init__(self, conta: str):
        self.conta = conta

@app.exception_handler(SaldoInsuficiente)
async def saldo_handler(request: Request, exc: SaldoInsuficiente):
    return JSONResponse(
        status_code=422,
        media_type="application/problem+json",
        content={
            "type": "https://api.banco/erros/saldo-insuficiente",
            "title": "Saldo insuficiente",
            "status": 422,
            "instance": str(request.url.path),
        },
    )

# Versionamento por prefixo de rota
from fastapi import APIRouter
v1 = APIRouter(prefix="/v1", tags=["pix"])
app.include_router(v1)</code></pre>
        <pre><code class="language-bash"># Exportar o contrato e detectar quebra em relação à versão publicada
python -c "import json; from app.main import app; print(json.dumps(app.openapi()))" &gt; openapi.json
oasdiff breaking openapi-publicado.json openapi.json --fail-on ERR</code></pre>
        <p>Nunca devolva stack trace ou mensagem de exceção crua ao cliente: vaza detalhes internos. Logue o erro com o ID de correlação e devolva uma mensagem genérica com esse mesmo ID.</p>
      `
    },
    {
      id: 'testes',
      title: 'Testando serviços FastAPI',
      body: `
        <p>O <code>TestClient</code> roda a aplicação em processo, incluindo o lifespan quando usado como context manager. O <code>dependency_overrides</code> troca dependências reais (autenticação, banco) por fakes, sem monkeypatch.</p>
        <pre><code class="language-python">import pytest
from fastapi.testclient import TestClient
from app.main import app, conta_atual

@pytest.fixture
def client():
    app.dependency_overrides[conta_atual] = lambda: "12345"
    with TestClient(app) as c:              # executa o lifespan
        yield c
    app.dependency_overrides.clear()

def test_cria_pix(client):
    r = client.post("/pix", json={"chave": "a@b.com", "valor": "10.50",
                                  "id_idempotencia": "abc12345"})
    assert r.status_code == 201
    assert r.json()["status"] == "ACEITO"

def test_rejeita_tres_casas(client):
    r = client.post("/pix", json={"chave": "a@b.com", "valor": "10.505",
                                  "id_idempotencia": "abc12345"})
    assert r.status_code == 422
    assert r.json()["detail"][0]["type"] == "decimal_max_places"</code></pre>
        <p>Para testes assíncronos de ponta a ponta (com o event loop real), use <code>httpx.AsyncClient</code> com <code>ASGITransport(app=app)</code> e pytest com o plugin do AnyIO. Complemente com testes de contrato baseados em propriedade (Schemathesis gera requisições a partir do OpenAPI e encontra 500s que nenhum teste manual pegaria) e com teste de carga (Locust, k6) para detectar bloqueio do loop sob concorrência.</p>
      `
    },
    {
      id: 'producao-servidor',
      title: 'Rodando em produção',
      body: `
        <ul>
          <li><strong>Processos:</strong> um processo Python usa um núcleo para código Python (com GIL). Rode N workers, tipicamente próximo ao número de núcleos alocados: <code>uvicorn app.main:app --workers 4</code> ou <code>fastapi run --workers 4</code>. Em Kubernetes, muitos times preferem 1 worker por pod e escalam por réplicas, deixando o orquestrador gerenciar processos.</li>
          <li><strong>Atrás de proxy:</strong> configure <code>--proxy-headers</code> e <code>--forwarded-allow-ips</code> para o IP real do cliente aparecer corretamente, e limite tamanho de corpo no proxy.</li>
          <li><strong>Health checks:</strong> separe liveness (o processo está vivo) de readiness (dependências prontas). Readiness que consulta o banco a cada segundo vira carga; faça leve.</li>
          <li><strong>Graceful shutdown:</strong> no SIGTERM, Uvicorn para de aceitar conexões e espera as em andamento; o <code>terminationGracePeriodSeconds</code> do pod precisa ser maior que o timeout mais longo.</li>
        </ul>
        <pre><code class="language-python">from fastapi import FastAPI, Response, status

@app.get("/healthz", include_in_schema=False)
async def liveness():
    return {"status": "ok"}

@app.get("/readyz", include_in_schema=False)
async def readiness(response: Response):
    ok = await banco_responde(timeout=0.3)
    if not ok:
        response.status_code = status.HTTP_503_SERVICE_UNAVAILABLE
    return {"banco": ok}</code></pre>
        <div class="callout tip"><strong>DICA</strong> Desabilite ou proteja <code>/docs</code> e <code>/redoc</code> em produção pública (<code>FastAPI(docs_url=None, redoc_url=None)</code>): o schema completo facilita reconhecimento para atacantes. Em APIs internas, mantê-los é ótimo para quem integra.</div>
      `
    }
  ],
  whenToUse: [
    'APIs HTTP e JSON com contrato tipado e documentação OpenAPI automática',
    'Serviços dominados por I/O (banco, outras APIs, filas) que se beneficiam de async',
    'Servir modelos de ML com pré e pós-processamento leves',
    'BFFs e gateways internos que agregam chamadas a vários serviços',
    'Times que já usam type hints e Pydantic no restante do código'
  ],
  whenNot: [
    'Chamadas bloqueantes dentro de async def (declare def ou use to_thread)',
    'Processamento pesado de CPU no mesmo processo da API (use workers, filas ou outro serviço)',
    'Aplicações server-side rendering com admin e ORM integrados, onde Django entrega mais pronto',
    'Comunicação interna de altíssimo throughput e baixa latência, onde gRPC é mais adequado',
    'Modelo único servindo como entrada, saída e entidade de banco'
  ],
  metrics: [
    'Latência p50, p95 e p99 por rota e taxa de erros 5xx',
    'Lag do event loop e ocupação do threadpool',
    'Uso do pool de conexões (em uso, ociosas, esperando)',
    'oasdiff no CI para detectar quebra de contrato OpenAPI',
    'Schemathesis e testes de carga (Locust, k6) antes de releases',
    'py-spy dump em processos travados para achar chamadas bloqueantes'
  ],
  refs: [
    { type: 'doc', title: 'FastAPI Documentation', author: 'Sebastián Ramírez e comunidade', url: 'https://fastapi.tiangolo.com/', note: 'Tutorial e guia avançado oficiais, com tradução parcial para português.' },
    { type: 'doc', title: 'FastAPI: Concurrency and async / await', author: 'FastAPI', url: 'https://fastapi.tiangolo.com/async/', note: 'Quando usar def ou async def, explicado pelo autor.' },
    { type: 'doc', title: 'Pydantic Documentation', author: 'Pydantic', url: 'https://docs.pydantic.dev/latest/', note: 'Modelos, validadores e configuração na v2.' },
    { type: 'doc', title: 'Uvicorn: Deployment', author: 'Encode', url: 'https://uvicorn.dev/deployment/', note: 'Workers, proxy headers e execução atrás de proxy.' },
    { type: 'doc', title: 'RFC 9457: Problem Details for HTTP APIs', author: 'IETF', url: 'https://www.rfc-editor.org/rfc/rfc9457', note: 'Formato padronizado de erros em APIs HTTP.' },
    { type: 'doc', title: 'Schemathesis', author: 'Schemathesis', url: 'https://schemathesis.readthedocs.io/', note: 'Testes baseados em propriedade gerados a partir do OpenAPI.' },
    { type: 'livro', title: 'Architecture Patterns with Python', author: 'Harry Percival e Bob Gregory', url: 'https://www.cosmicpython.com/', note: 'Separação entre camada web, serviço e domínio, com o livro aberto no site.' },
    { type: 'video', title: 'Live de Python', author: 'Eduardo Mendes', url: 'https://www.youtube.com/@Dunossauro', note: 'Lives em português com várias edições sobre FastAPI, async e testes.' }
  ]
};

window.LESSON_CONTENT['observabilidade'] = {
  id: 'observabilidade',
  title: 'Logging e observabilidade',
  etapa: 13, etapaName: 'Python em produção',
  time: '60 min',
  tags: ['logging', 'opentelemetry', 'tracing', 'slo'],
  tagline: 'Monitoramento responde se está quebrado. Observabilidade responde <em>por quê</em>, inclusive para falhas que ninguém previu.',
  intro: `
    <p>Em produção, o seu código é uma caixa preta rodando em dezenas de réplicas, recebendo tráfego que você não controla. Quando a latência do Pix sobe às 23h de uma sexta, a pergunta não é "o serviço está de pé?", é "qual dependência, qual rota, qual tipo de requisição, desde quando?". Observabilidade é a propriedade de conseguir responder perguntas novas sobre o sistema a partir dos sinais que ele emite, sem precisar fazer deploy de código novo para investigar.</p>
    <p>Os três sinais clássicos são <strong>logs</strong> (eventos discretos com contexto), <strong>métricas</strong> (agregados numéricos baratos no tempo) e <strong>traces</strong> (o caminho de uma requisição entre serviços, com tempo por etapa). O OpenTelemetry virou o padrão aberto para gerar e transportar os três, independente de fornecedor, e é o que adoto em qualquer serviço Python novo.</p>
    <p>Para quem vem de SRE, a lição fecha com SLOs: a ponte entre os sinais técnicos e o que o negócio realmente precisa, e a forma de decidir objetivamente quando parar de lançar features para cuidar de confiabilidade.</p>
  `,
  sections: [
    {
      id: 'logging-stdlib',
      title: 'O módulo logging do jeito certo',
      body: `
        <p>O <code>logging</code> da biblioteca padrão tem uma arquitetura boa que quase ninguém usa direito: <strong>loggers</strong> hierárquicos por nome (<code>pagamentos.pix.repositorio</code>), <strong>handlers</strong> que decidem destino, <strong>formatters</strong> que decidem formato e <strong>filters</strong> que enriquecem ou descartam registros. A regra de ouro: bibliotecas só criam loggers; quem configura handlers é a aplicação, uma vez, no ponto de entrada.</p>
        <pre><code class="language-python"># Antes: print, f-string eager, exceção engolida
def processar(tx):
    print(f"processando {tx}")                 # vai para stdout sem nível nem contexto
    try:
        liquidar(tx)
    except Exception as e:
        print("erro", e)                        # perde o traceback

# Depois: logger por módulo, args lazy, traceback preservado
import logging

logger = logging.getLogger(__name__)

def processar(tx):
    logger.debug("processando transação %s", tx.id)     # formatação só se DEBUG ativo
    try:
        liquidar(tx)
    except LiquidacaoError:
        logger.exception("falha ao liquidar %s", tx.id)  # nível ERROR + traceback
        raise</code></pre>
        <pre><code class="language-python"># Configuração única no entrypoint da aplicação
import logging.config

logging.config.dictConfig({
    "version": 1,
    "disable_existing_loggers": False,
    "formatters": {"padrao": {"format": "%(asctime)s %(levelname)s %(name)s %(message)s"}},
    "handlers": {"stdout": {"class": "logging.StreamHandler", "formatter": "padrao",
                            "stream": "ext://sys.stdout"}},
    "root": {"level": "INFO", "handlers": ["stdout"]},
    "loggers": {"httpx": {"level": "WARNING"}},      # silencia biblioteca ruidosa
})</code></pre>
        <div class="callout warn"><strong>PEGADINHA</strong> Em containers, logue para stdout e deixe a plataforma coletar (12-factor). Handler de arquivo com rotação dentro do container enche disco efêmero e some quando o pod reinicia. E nunca use <code>logger.error(e)</code> sem <code>exc_info</code>: você perde exatamente a informação que vai precisar às 3 da manhã.</div>
      `
    },
    {
      id: 'logs-estruturados',
      title: 'Logs estruturados e contexto de requisição',
      body: `
        <p>Log em texto livre é para humanos lerem um por um. Em produção, você filtra e agrega milhões: <code>canal=pix AND status=recusado AND agencia=0345</code>. Isso exige logs estruturados em JSON, com campos consistentes, e contexto propagado automaticamente (ID de requisição, ID de trace, conta) sem passar parâmetro por toda a pilha.</p>
        <pre><code class="language-python">import structlog

structlog.configure(
    processors=[
        structlog.contextvars.merge_contextvars,          # contexto por requisição
        structlog.processors.add_log_level,
        structlog.processors.TimeStamper(fmt="iso", utc=True),
        structlog.processors.dict_tracebacks,             # traceback como JSON
        structlog.processors.JSONRenderer(),
    ],
)
log = structlog.get_logger()

# Middleware: liga o contexto no início da requisição
structlog.contextvars.clear_contextvars()
structlog.contextvars.bind_contextvars(request_id="req-123")

log.info("pix_registrado", valor_centavos=1050, canal="pix")</code></pre>
        <p>Saída real:</p>
        <pre><code class="language-json">{"valor_centavos": 1050, "canal": "pix", "event": "pix_registrado", "request_id": "req-123", "level": "info", "timestamp": "2026-11-13T18:33:42.892103Z"}</code></pre>
        <p>O <code>contextvars</code> funciona tanto com threads quanto com asyncio: cada task assíncrona enxerga seu próprio contexto, então duas requisições concorrentes no mesmo event loop não misturam IDs. Usar uma variável global ou <code>threading.local</code> num serviço async é um bug sutil clássico.</p>
        <div class="callout warn"><strong>PEGADINHA</strong> Dados pessoais e segredos não vão para log: CPF completo, número de cartão (PCI DSS proíbe), token, senha, corpo inteiro da requisição. Em banco, log com PAN é incidente de compliance. Implemente um processor que mascara campos sensíveis por nome e teste que ele funciona.</div>
      `
    },
    {
      id: 'opentelemetry',
      title: 'OpenTelemetry: traces, métricas e contexto distribuído',
      body: `
        <p>OpenTelemetry (OTel) define APIs, SDKs e um protocolo (OTLP) para os três sinais. A separação importa: bibliotecas dependem só da <strong>API</strong> (que é no-op sem SDK configurado), e a aplicação configura o <strong>SDK</strong> com exporters. Um <strong>Collector</strong> recebe OTLP, processa (amostragem, remoção de dados sensíveis) e envia para qualquer backend (Jaeger, Tempo, Prometheus, Datadog, Grafana Cloud).</p>
        <pre><code class="language-python">from opentelemetry import trace, metrics
from opentelemetry.sdk.resources import Resource
from opentelemetry.sdk.trace import TracerProvider
from opentelemetry.sdk.trace.export import BatchSpanProcessor
from opentelemetry.exporter.otlp.proto.grpc.trace_exporter import OTLPSpanExporter

recurso = Resource.create({
    "service.name": "pagamentos-api",
    "service.version": "1.4.0",
    "deployment.environment.name": "prod",
})
provider = TracerProvider(resource=recurso)
provider.add_span_processor(BatchSpanProcessor(OTLPSpanExporter()))   # endpoint via env
trace.set_tracer_provider(provider)

tracer = trace.get_tracer("pagamentos")
meter = metrics.get_meter("pagamentos")
duracao = meter.create_histogram("pix.registro.duracao", unit="s")

def registrar_pix(pedido):
    with tracer.start_as_current_span("registrar_pix") as span:
        span.set_attribute("pix.tipo_chave", pedido.tipo_chave)    # nunca a chave em si
        try:
            with tracer.start_as_current_span("consultar_dict"):
                destino = consultar_dict(pedido.chave)
            return liquidar(pedido, destino)
        except Exception as exc:
            span.record_exception(exc)
            span.set_status(trace.Status(trace.StatusCode.ERROR))
            raise</code></pre>
        <p>A mágica do tracing distribuído é a propagação de contexto: o header <code>traceparent</code> (W3C Trace Context) leva o trace ID de serviço em serviço, e as instrumentações automáticas de httpx, requests, FastAPI, SQLAlchemy, psycopg, Kafka e afins fazem isso sozinhas.</p>
        <pre><code class="language-bash"># Instrumentação sem alterar código (zero-code)
pip install opentelemetry-distro opentelemetry-exporter-otlp
opentelemetry-bootstrap -a install          # instala instrumentações das libs presentes

OTEL_SERVICE_NAME=pagamentos-api \
OTEL_EXPORTER_OTLP_ENDPOINT=http://otel-collector:4317 \
OTEL_TRACES_SAMPLER=parentbased_traceidratio OTEL_TRACES_SAMPLER_ARG=0.1 \
opentelemetry-instrument uvicorn app.main:app --workers 4</code></pre>
        <div class="callout tip"><strong>DICA</strong> Coloque o <code>trace_id</code> em todo log (a instrumentação de logging do OTel faz isso). Assim, do log de erro você pula direto para o trace completo da requisição, e do trace lento você acha os logs dela. Essa correlação é o que transforma três sinais soltos em observabilidade.</div>
      `
    },
    {
      id: 'metricas',
      title: 'Métricas: RED, USE e cardinalidade',
      body: `
        <p>Métricas são baratas porque são agregadas: um contador de requisições custa o mesmo com 10 ou 10 milhões de requisições. Esse é também o limite: cada combinação de valores de atributos (labels) gera uma série temporal separada.</p>
        <ul>
          <li><strong>RED</strong> (para serviços): Rate, Errors, Duration por rota.</li>
          <li><strong>USE</strong> (para recursos): Utilization, Saturation, Errors de CPU, memória, pools, filas.</li>
          <li><strong>Golden signals</strong> do livro de SRE do Google: latência, tráfego, erros e saturação.</li>
        </ul>
        <pre><code class="language-python">from prometheus_client import Counter, Histogram, Gauge, start_http_server

REQS = Counter("pix_requisicoes_total", "Requisições Pix", ["rota", "status"])
LAT = Histogram("pix_latencia_segundos", "Latência", ["rota"],
                buckets=(0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1, 2.5, 5))
POOL = Gauge("db_pool_em_uso", "Conexões em uso")

def handler(rota: str):
    with LAT.labels(rota=rota).time():
        status = executar()
    REQS.labels(rota=rota, status=status).inc()

start_http_server(9000)        # expõe /metrics para o Prometheus</code></pre>
        <div class="callout warn"><strong>PEGADINHA</strong> Label com alta cardinalidade (<code>conta</code>, <code>user_id</code>, URL com ID embutido) explode o número de séries e derruba o Prometheus ou a fatura do fornecedor. Use a rota template (<code>/contas/{id}</code>), não a URL concreta. Detalhe por entidade vai para traces e logs, não métricas.</div>
        <p>Para latência, use histogramas, não médias: a média esconde a cauda, e é a cauda que o cliente sente. Percentis calculados a partir de buckets são aproximados; escolha buckets em torno do seu objetivo de latência para ter precisão onde importa.</p>
      `
    },
    {
      id: 'slos',
      title: 'SLIs, SLOs e error budget',
      body: `
        <p>Um <strong>SLI</strong> é uma medida da experiência do usuário (proporção de requisições bem-sucedidas abaixo de 300 ms). Um <strong>SLO</strong> é o alvo para esse SLI numa janela (99,9% em 28 dias). O <strong>error budget</strong> é o complemento: 0,1% de 28 dias são cerca de 40 minutos de "ruim" permitidos.</p>
        <div class="math">error budget = (1 − SLO) × janela   →   (1 − 0,999) × 28 d × 24 h × 60 min ≈ 40,3 min</div>
        <p>O budget transforma confiabilidade numa decisão objetiva: com budget sobrando, o time pode lançar mais rápido e arriscar; com budget estourado, prioridade vai para estabilidade. Alertas devem ser sobre <strong>taxa de consumo do budget</strong> (burn rate), não sobre CPU alta.</p>
        <pre><code class="language-yaml"># Alerta multi-janela por burn rate (abordagem do SRE Workbook do Google)
groups:
  - name: slo-pix
    rules:
      - alert: PixErrorBudgetBurnRapido
        expr: |
          (
            sum(rate(pix_requisicoes_total{status=~"5.."}[1h]))
            / sum(rate(pix_requisicoes_total[1h]))
          ) &gt; (14.4 * 0.001)
          and
          (
            sum(rate(pix_requisicoes_total{status=~"5.."}[5m]))
            / sum(rate(pix_requisicoes_total[5m]))
          ) &gt; (14.4 * 0.001)
        labels: { severity: page }
        annotations:
          summary: "Consumindo 2% do budget mensal por hora"</code></pre>
        <p>O fator 14,4 vem de consumir 2% do budget de 30 dias em 1 hora (0,02 × 720 h / 1 h). A janela curta (5 min) evita que o alerta continue disparando depois que o problema já passou. É o padrão que recomendo para qualquer serviço crítico.</p>
        <div class="callout"><strong>NA ENTREVISTA</strong> "Por que não alertar em CPU acima de 80%?" Porque CPU alta sem impacto no usuário não exige acordar ninguém, e impacto no usuário com CPU baixa (dependência lenta, event loop travado) passaria batido. Alerte em sintomas que o usuário sente (SLO), investigue causas com dashboards e traces.</div>
      `
    },
    {
      id: 'profiling-producao',
      title: 'Profiling contínuo e investigação em produção',
      body: `
        <p>Quando métricas e traces apontam "este endpoint ficou lento" mas não dizem qual linha, entra o profiling. Em produção, ferramentas de amostragem com overhead baixo, que não exigem mudar código:</p>
        <pre><code class="language-bash"># Snapshot das pilhas de todas as threads de um processo vivo
py-spy dump --pid 4242

# Top ao vivo das funções que mais consomem CPU
py-spy top --pid 4242

# Flamegraph de 60 s, incluindo extensões nativas
py-spy record --pid 4242 --duration 60 --native -o perfil.svg

# Python 3.14: anexar um debugger a um processo em execução (PEP 768)
python -m pdb -p 4242</code></pre>
        <p>O Python 3.14 trouxe a interface segura de depuração externa (PEP 768), que permite anexar ferramentas a um processo rodando sem reiniciar, e o módulo <code>asyncio</code> ganhou introspecção de tasks via linha de comando (<code>python -m asyncio ps PID</code> e <code>pstree</code>), muito útil para achar a coroutine que está segurando o loop. Para profiling contínuo em toda a frota, OTel tem um sinal de profiles em evolução, e ferramentas como Pyroscope já coletam perfis de Python em produção.</p>
        <div class="callout tip"><strong>DICA</strong> Em Kubernetes, <code>py-spy</code> precisa da capability <code>SYS_PTRACE</code> no container (ou rodar num container efêmero de debug com <code>kubectl debug</code>). Deixe isso preparado no runbook antes do incidente, não durante.</div>
      `
    }
  ],
  whenToUse: [
    'Todo serviço ou job que roda em produção sem supervisão humana',
    'Arquiteturas com vários serviços em que uma requisição atravessa fronteiras',
    'Definição de metas de confiabilidade acordadas com o negócio (SLOs)',
    'Investigação de latência de cauda e falhas intermitentes',
    'Ambientes regulados que exigem trilha de auditoria de operações'
  ],
  whenNot: [
    'print como estratégia de log em código de produção',
    'Labels de métrica com IDs de usuário, conta ou URLs concretas',
    'Dados pessoais, PAN, tokens e senhas em logs ou atributos de span',
    'Alertas em causas (CPU, memória) sem impacto em sintoma de usuário',
    'Configurar handlers de logging dentro de bibliotecas'
  ],
  metrics: [
    'Proporção de logs estruturados com request_id e trace_id',
    'Cobertura de tracing nas dependências críticas (banco, filas, APIs)',
    'Cardinalidade de séries por métrica',
    'SLOs definidos por serviço crítico e alertas por burn rate',
    'MTTD e MTTR de incidentes',
    'py-spy, memray e asyncio ps prontos no runbook'
  ],
  refs: [
    { type: 'doc', title: 'Logging HOWTO', author: 'Python Software Foundation', url: 'https://docs.python.org/3/howto/logging.html', note: 'Guia oficial da arquitetura de loggers, handlers e formatters.' },
    { type: 'doc', title: 'OpenTelemetry Python', author: 'OpenTelemetry', url: 'https://opentelemetry.io/docs/languages/python/', note: 'Instrumentação manual e zero-code, exporters e configuração.' },
    { type: 'doc', title: 'structlog', author: 'Hynek Schlawack', url: 'https://www.structlog.org/', note: 'Logging estruturado com contextvars e processors.' },
    { type: 'livro', title: 'Site Reliability Engineering', author: 'Betsy Beyer et al. (Google)', url: 'https://sre.google/sre-book/table-of-contents/', note: 'Golden signals, SLOs e monitoramento, com o livro aberto no site.' },
    { type: 'livro', title: 'The Site Reliability Workbook', author: 'Betsy Beyer et al. (Google)', url: 'https://sre.google/workbook/alerting-on-slos/', note: 'Capítulo de alertas por burn rate multi-janela.' },
    { type: 'livro', title: 'Observability Engineering', author: 'Charity Majors, Liz Fong-Jones e George Miranda', url: 'https://www.oreilly.com/library/view/observability-engineering/9781492076438/', note: 'Eventos de alta cardinalidade e a diferença entre monitorar e observar.' },
    { type: 'doc', title: 'W3C Trace Context', author: 'W3C', url: 'https://www.w3.org/TR/trace-context/', note: 'Especificação do header traceparent usado na propagação.' },
    { type: 'doc', title: 'py-spy', author: 'Ben Frederickson', url: 'https://github.com/benfred/py-spy', note: 'Profiler por amostragem que se anexa a processos em produção.' }
  ]
};

window.LESSON_CONTENT['seguranca-python'] = {
  id: 'seguranca-python',
  title: 'Segurança em Python',
  etapa: 13, etapaName: 'Python em produção',
  time: '60 min',
  tags: ['seguranca', 'supply-chain', 'pickle', 'appsec'],
  tagline: 'O código que mais ameaça seu sistema muitas vezes não foi você que escreveu: veio num <em>pip install</em>.',
  intro: `
    <p>Segurança em Python tem duas frentes. A primeira é a de sempre em qualquer linguagem: injeção (SQL, shell, template), desserialização insegura, segredos mal guardados, validação de entrada. A segunda cresceu muito nos últimos anos: a cadeia de suprimentos. Um projeto médio puxa centenas de dependências transitivas, e o PyPI já viu typosquatting, contas comprometidas, pacotes maliciosos que roubam variáveis de ambiente no <code>setup.py</code> e ataques de dependency confusion contra índices corporativos.</p>
    <p>Venho de segurança ofensiva antes de engenharia de dados, e o padrão que mais vejo em código Python de banco não é sofisticado: é <code>pickle.load</code> de arquivo que veio de fora, f-string montando SQL, <code>subprocess</code> com <code>shell=True</code> e token no repositório. Corrigir esses quatro já elimina boa parte do risco real.</p>
    <p>Esta lição cobre as classes de vulnerabilidade mais comuns em Python, as ferramentas de análise (Bandit, pip-audit, Semgrep), as defesas de supply chain (hashes, índices privados, atestados) e gestão de segredos.</p>
  `,
  sections: [
    {
      id: 'pickle',
      title: 'Desserialização insegura: pickle não é formato de dados',
      body: `
        <p><code>pickle</code> é um formato de serialização que reconstrói objetos executando instruções de uma pequena máquina virtual, incluindo chamar qualquer função importável. Desserializar um pickle é executar código. A documentação oficial avisa no topo da página: nunca faça unpickle de dados de fonte não confiável.</p>
        <pre><code class="language-python">import pickle

class Payload:
    def __reduce__(self):
        import os
        return (os.system, ("echo comprometido; id",))   # roda no pickle.loads

dados = pickle.dumps(Payload())
# pickle.loads(dados)   # executaria o comando na máquina de quem carrega</code></pre>
        <p>O mesmo vale para tudo que usa pickle por baixo: <code>joblib.load</code>, <code>pd.read_pickle</code>, <code>torch.load</code> com <code>weights_only=False</code>, <code>numpy.load</code> com <code>allow_pickle=True</code>, objetos de cache em Redis, mensagens de fila serializadas com pickle. Em ML isso é crítico: baixar um modelo de um hub público e carregar com pickle é executar código de um desconhecido.</p>
        <pre><code class="language-python"># Alternativas seguras por tipo de dado
import json
import numpy as np
from safetensors.numpy import save_file, load_file   # pesos de modelos

json.loads(texto)                               # dados estruturados simples
np.load("features.npy", allow_pickle=False)     # padrão seguro, mantenha assim
pesos = load_file("modelo.safetensors")         # só tensores, sem código

# PyTorch: weights_only=True é o padrão desde a 2.6, não desligue
# import torch; estado = torch.load("ckpt.pt", weights_only=True)

# Se precisar mesmo de pickle entre serviços seus: assine com HMAC
import hmac, hashlib

def carregar_assinado(blob: bytes, assinatura: bytes, chave: bytes):
    esperado = hmac.new(chave, blob, hashlib.sha256).digest()
    if not hmac.compare_digest(esperado, assinatura):     # comparação em tempo constante
        raise ValueError("assinatura inválida")
    return pickle.loads(blob)</code></pre>
        <div class="callout warn"><strong>PEGADINHA</strong> O mesmo problema aparece em <code>yaml.load</code> com o Loader completo (use <code>yaml.safe_load</code>), em <code>eval</code> e <code>exec</code> sobre entrada externa (para literais, <code>ast.literal_eval</code>), e em <code>shelve</code>, que é pickle num arquivo.</div>
      `
    },
    {
      id: 'injecao',
      title: 'Injeção: SQL, shell e caminhos',
      body: `
        <p>A regra é uma só: dados nunca viram código. Toda vez que você monta uma string que outro interpretador vai executar (SQL, shell, template HTML, expressão regular, caminho de arquivo), use a API que separa estrutura de dados.</p>
        <pre><code class="language-python"># SQL: antes (injetável) e depois (parametrizado)
conta = request.query_params["conta"]               # "1 OR 1=1"
cur.execute(f"SELECT * FROM tx WHERE conta = {conta}")          # VULNERÁVEL
cur.execute("SELECT * FROM tx WHERE conta = %s", (conta,))      # driver escapa

# Shell: antes e depois
import subprocess
subprocess.run(f"gpg --decrypt {arquivo}", shell=True)          # arquivo = "x; rm -rf /"
subprocess.run(["gpg", "--decrypt", arquivo], check=True,       # lista: sem shell
               timeout=60)

# Path traversal: o usuário manda "../../etc/passwd"
from pathlib import Path
BASE = Path("/srv/extratos").resolve()

def abrir_extrato(nome: str) -&gt; bytes:
    alvo = (BASE / nome).resolve()
    if not alvo.is_relative_to(BASE):
        raise PermissionError("caminho fora do diretório permitido")
    return alvo.read_bytes()</code></pre>
        <p>O Python 3.14 trouxe as template strings (PEP 750): <code>t"..."</code> produz um objeto <code>Template</code> com as partes literais e os valores interpolados separados, em vez de uma <code>str</code> pronta. Isso permite que bibliotecas recebam algo com sintaxe de f-string e ainda assim parametrizem com segurança:</p>
        <pre><code class="language-python">from string.templatelib import Template, Interpolation

def sql(t: Template) -&gt; tuple[str, list]:
    partes, params = [], []
    for item in t:
        if isinstance(item, Interpolation):
            partes.append("?")
            params.append(item.value)
        else:
            partes.append(item)
    return "".join(partes), params

conta = "1 OR 1=1"
print(sql(t"SELECT * FROM tx WHERE conta = {conta} AND valor &gt; {100}"))
# ('SELECT * FROM tx WHERE conta = ? AND valor &gt; ?', ['1 OR 1=1', 100])</code></pre>
        <div class="callout tip"><strong>DICA</strong> Ainda no 3.14: a extração de arquivos <code>tarfile</code> passou a usar o filtro <code>"data"</code> por padrão, que bloqueia links simbólicos para fora do destino, caminhos absolutos e arquivos de dispositivo. Em versões anteriores, passe <code>filter="data"</code> explicitamente ao extrair qualquer tar de origem externa.</div>
      `
    },
    {
      id: 'supply-chain',
      title: 'Supply chain: dependências como superfície de ataque',
      body: `
        <p>Os vetores mais comuns contra projetos Python:</p>
        <ul>
          <li><strong>Typosquatting:</strong> <code>reqeusts</code>, <code>python-dateutils</code>. Um erro de digitação instala malware.</li>
          <li><strong>Dependency confusion:</strong> seu pacote interno <code>banco-lake-sdk</code> só existe no índice privado; alguém publica o mesmo nome no PyPI com versão maior, e um <code>--extra-index-url</code> mal configurado instala o do atacante.</li>
          <li><strong>Conta comprometida:</strong> mantenedor legítimo tem a credencial roubada e uma versão maliciosa é publicada.</li>
          <li><strong>Código no build:</strong> sdist executa código arbitrário na instalação.</li>
        </ul>
        <pre><code class="language-bash"># Auditar vulnerabilidades conhecidas (base PyPA Advisory e OSV)
pip-audit                                  # ambiente atual
pip-audit -r requirements.txt --strict     # arquivo de requirements, falha em qualquer achado

# Instalar exatamente os bytes revisados
pip install --require-hashes --no-deps -r requirements.txt
uv sync --locked                           # uv.lock já tem hashes

# Só wheels: nenhum código de build roda na instalação
pip install --only-binary=:all: -r requirements.txt</code></pre>
        <p>Contra dependency confusion, a defesa estrutural é usar <strong>um único índice</strong> (o proxy corporativo, Artifactory ou Nexus) com regras de qual nome pode vir de onde, em vez de <code>--extra-index-url</code>, que faz o pip escolher a maior versão entre os índices. No uv, a configuração de índices com <code>explicit = true</code> e o mapeamento por pacote em <code>[tool.uv.sources]</code> resolvem o mesmo problema.</p>
        <pre><code class="language-toml"># pyproject.toml (uv): pacote interno só pode vir do índice interno
[[tool.uv.index]]
name = "interno"
url = "https://pypi.interno.banco/simple"
explicit = true            # só usado por pacotes mapeados abaixo

[tool.uv.sources]
banco-lake-sdk = { index = "interno" }</code></pre>
        <p>Do lado do produtor, publique com trusted publishing e atestados (PEP 740), habilite 2FA em todas as contas e gere SBOM (CycloneDX ou SPDX) dos artefatos; a PEP 770 padronizou o lugar do SBOM dentro dos wheels.</p>
      `
    },
    {
      id: 'segredos',
      title: 'Segredos e criptografia',
      body: `
        <p>Segredo no repositório é segredo vazado: o histórico do git guarda para sempre, forks copiam, e scanners automatizados varrem repositórios públicos atrás de chaves em minutos. Segredos vêm do ambiente em runtime, injetados por um cofre (HashiCorp Vault, AWS Secrets Manager, GCP Secret Manager, Kubernetes Secrets com criptografia em repouso).</p>
        <pre><code class="language-python">from pydantic import SecretStr
from pydantic_settings import BaseSettings, SettingsConfigDict

class Config(BaseSettings):
    model_config = SettingsConfigDict(env_prefix="PAG_")

    database_url: SecretStr            # PAG_DATABASE_URL
    jwt_public_key: SecretStr
    ambiente: str = "dev"

cfg = Config()
print(cfg.database_url)                # **********  (não vaza em log ou repr)
conectar(cfg.database_url.get_secret_value())

# Tokens e comparações
import secrets, hmac
token = secrets.token_urlsafe(32)      # NUNCA random.random() para segurança
hmac.compare_digest(token_recebido, token_esperado)   # evita timing attack</code></pre>
        <ul>
          <li><strong>Aleatoriedade:</strong> <code>random</code> é Mersenne Twister, previsível. Para tokens, IDs de sessão e chaves, use <code>secrets</code>.</li>
          <li><strong>Senhas:</strong> nunca <code>hashlib.sha256(senha)</code>. Use um KDF lento e com sal: Argon2id (<code>argon2-cffi</code>), scrypt (<code>hashlib.scrypt</code>) ou bcrypt.</li>
          <li><strong>Criptografia:</strong> use a biblioteca <code>cryptography</code> com primitivas de alto nível (Fernet, AESGCM). Não implemente criptografia própria.</li>
          <li><strong>TLS:</strong> nunca <code>verify=False</code> em requests ou httpx em produção. Se o certificado é corporativo, aponte o bundle da CA interna.</li>
        </ul>
        <div class="callout warn"><strong>PEGADINHA</strong> Quando um segredo vaza no git, apagar o commit não basta: ele já pode ter sido copiado. O procedimento é revogar e rotacionar a credencial imediatamente, depois limpar o histórico. Instale <code>gitleaks</code> ou <code>detect-secrets</code> como hook de pre-commit para impedir o vazamento antes.</div>
      `
    },
    {
      id: 'ferramentas-sast',
      title: 'Análise estática e o pipeline de segurança',
      body: `
        <p>Ferramentas automatizadas pegam o óbvio de forma barata, liberando revisão humana para lógica de negócio e autorização, onde estão as falhas que ferramenta nenhuma vê.</p>
        <table>
          <thead><tr><th>Ferramenta</th><th>O que pega</th></tr></thead>
          <tbody>
            <tr><td>Bandit (ou regras <code>S</code> do Ruff)</td><td>Padrões inseguros: pickle, shell=True, yaml.load, asserts como controle, senhas hardcoded, verify=False</td></tr>
            <tr><td>Semgrep</td><td>Regras customizáveis por padrão de código, inclusive fluxo de dados entre fonte e sink</td></tr>
            <tr><td>pip-audit / OSV-Scanner</td><td>Dependências com CVEs conhecidas</td></tr>
            <tr><td>gitleaks / detect-secrets</td><td>Segredos commitados</td></tr>
            <tr><td>Trivy / Grype</td><td>Vulnerabilidades na imagem de container (pacotes do SO e Python)</td></tr>
          </tbody>
        </table>
        <pre><code class="language-yaml"># .pre-commit-config.yaml (trecho)
repos:
  - repo: https://github.com/astral-sh/ruff-pre-commit
    rev: v0.17.5
    hooks:
      - id: ruff
        args: [--select, "E,F,S,B", --fix]     # S = regras do Bandit
  - repo: https://github.com/gitleaks/gitleaks
    rev: v8.30.1
    hooks:
      - id: gitleaks</code></pre>
        <pre><code class="language-bash"># No CI, como gates que falham o build
bandit -r src/ -ll                       # severidade média ou maior
pip-audit --strict
semgrep scan --config p/python --error</code></pre>
        <div class="callout"><strong>NA ENTREVISTA</strong> "assert é controle de acesso?" Não: <code>assert</code> é removido quando o Python roda com <code>-O</code>. Um <code>assert usuario.is_admin</code> vira nada em produção otimizada. Checagem de segurança usa <code>if</code> e exceção explícita. Bandit sinaliza isso (B101).</div>
      `
    },
    {
      id: 'validacao-autorizacao',
      title: 'Validação de entrada, autorização e o que ferramenta não vê',
      body: `
        <p>As vulnerabilidades mais caras em sistemas financeiros raramente são técnicas no sentido estreito: são falhas de autorização (IDOR, quando o usuário troca o ID da conta na URL e vê o extrato de outro), lógica de negócio (valor negativo numa transferência, condição de corrida em saque) e excesso de dados na resposta.</p>
        <pre><code class="language-python"># IDOR: antes (confia no ID vindo do cliente)
@app.get("/contas/{conta_id}/extrato")
async def extrato(conta_id: str, usuario: Usuario):
    return await repo.extrato(conta_id)                  # qualquer conta!

# Depois: autorização explícita contra o principal autenticado
@app.get("/contas/{conta_id}/extrato")
async def extrato(conta_id: str, usuario: Usuario):
    if not await repo.usuario_tem_acesso(usuario.id, conta_id):
        raise HTTPException(404)                         # 404, não 403: não confirma existência
    return await repo.extrato(conta_id)

# Condição de corrida em débito: trave no banco, não no Python
SQL_DEBITO = """
UPDATE contas SET saldo = saldo - %(valor)s
WHERE id = %(conta)s AND saldo &gt;= %(valor)s
RETURNING saldo
"""   # atômico: duas requisições simultâneas não gastam o mesmo saldo</code></pre>
        <p>Checklist de borda que aplico em toda API: validar tipo, faixa e tamanho de tudo que entra (Pydantic com limites); limitar tamanho de corpo e de upload; rate limiting por cliente; autorização por recurso em cada endpoint (não só autenticação); respostas com só os campos necessários; e logs de auditoria das operações sensíveis com quem, o quê e quando. O OWASP API Security Top 10 é o mapa dessas falhas.</p>
      `
    }
  ],
  whenToUse: [
    'Sempre: segurança é requisito de todo código que vai para produção',
    'Revisões de código que tocam desserialização, subprocess, SQL ou arquivos',
    'Pipelines de CI com gates de SAST, dependências e segredos',
    'Carregamento de modelos de ML de fontes externas (safetensors, weights_only)',
    'Configuração de índices privados e políticas de dependências'
  ],
  whenNot: [
    'pickle, joblib ou torch.load sem weights_only para dados de fonte não confiável',
    'f-string ou concatenação para montar SQL ou comandos de shell',
    'random para tokens e segredos (use secrets)',
    'verify=False em clientes HTTP de produção',
    'assert como verificação de segurança',
    '--extra-index-url misturando índice público e privado'
  ],
  metrics: [
    'pip-audit --strict sem achados abertos acima da política',
    'Bandit ou Ruff S sem findings de severidade média ou maior',
    'gitleaks no pre-commit e no CI',
    'Trivy ou Grype na imagem final',
    'Lockfile com hashes e instalação estrita no build',
    'Tempo médio para corrigir CVE crítica em dependência'
  ],
  refs: [
    { type: 'doc', title: 'pickle: Python object serialization (aviso de segurança)', author: 'Python Software Foundation', url: 'https://docs.python.org/3/library/pickle.html', note: 'O aviso oficial sobre desserialização de fontes não confiáveis.' },
    { type: 'doc', title: 'PEP 750: Template Strings', author: 'Jim Baker, Guido van Rossum, Paul Everitt e outros', url: 'https://peps.python.org/pep-0750/', note: 'As t-strings do Python 3.14 e o caso de uso de SQL e HTML seguros.' },
    { type: 'doc', title: 'pip-audit', author: 'PyPA e Trail of Bits', url: 'https://github.com/pypa/pip-audit', note: 'Auditoria de dependências contra bases de vulnerabilidades.' },
    { type: 'doc', title: 'Bandit', author: 'PyCQA', url: 'https://bandit.readthedocs.io/', note: 'Análise estática de padrões inseguros em Python.' },
    { type: 'portal', title: 'OWASP API Security Top 10', author: 'OWASP Foundation', url: 'https://owasp.org/API-Security/', note: 'O mapa das falhas mais comuns em APIs, com IDOR no topo.' },
    { type: 'portal', title: 'OWASP Cheat Sheet Series: Deserialization', author: 'OWASP Foundation', url: 'https://cheatsheetseries.owasp.org/cheatsheets/Deserialization_Cheat_Sheet.html', note: 'Defesas contra desserialização insegura, incluindo Python.' },
    { type: 'doc', title: 'uv: Package indexes', author: 'Astral', url: 'https://docs.astral.sh/uv/concepts/indexes/', note: 'Índices explícitos e mitigação de dependency confusion.' },
    { type: 'doc', title: 'Safetensors', author: 'Hugging Face', url: 'https://huggingface.co/docs/safetensors/', note: 'Formato seguro para pesos de modelos, sem execução de código.' }
  ]
};

window.LESSON_CONTENT['deploy-python'] = {
  id: 'deploy-python',
  title: 'Containers e deploy',
  etapa: 13, etapaName: 'Python em produção',
  time: '60 min',
  tags: ['docker', 'deploy', 'ci-cd', '12-factor'],
  tagline: 'A imagem é o artefato. Se ela não é <em>reproduzível, enxuta e sem root</em>, o resto do pipeline está construído na areia.',
  intro: `
    <p>O último passo de um serviço Python é virar uma imagem de container que roda igual no laptop, no CI e em produção. Parece trivial (um <code>FROM python</code>, um <code>pip install</code>, um <code>CMD</code>), e é exatamente por isso que tantas imagens em produção têm 1,5 GB, rodam como root, carregam compiladores e chaves SSH em camadas antigas, e reinstalam todas as dependências a cada mudança de uma linha de código.</p>
    <p>Esta lição trata a imagem como artefato de engenharia: build multi-stage com uv, cache de camadas, usuário sem privilégio, servidor de aplicação configurado para containers (workers, sinais, graceful shutdown), configuração por ambiente segundo o 12-factor, e o pipeline de CI/CD que constrói, testa, escaneia, assina e promove a mesma imagem entre ambientes.</p>
    <p>O critério que uso: a imagem que foi testada em homologação é byte a byte a mesma que vai para produção, identificada por digest, e muda só a configuração injetada. Qualquer coisa diferente disso é "funciona em homologação".</p>
  `,
  sections: [
    {
      id: 'dockerfile-ingenuo',
      title: 'O Dockerfile ingênuo e o que há de errado com ele',
      body: `
        <pre><code class="language-dockerfile"># Antes: funciona, e é problema em quase toda linha
FROM python:3.14
COPY . /app
WORKDIR /app
RUN pip install -r requirements.txt
CMD python main.py</code></pre>
        <ul>
          <li><strong><code>python:3.14</code> completo:</strong> imagem base com compiladores e centenas de pacotes do SO que você não usa, cada um uma superfície de CVE.</li>
          <li><strong><code>COPY . /app</code> antes do install:</strong> qualquer mudança no código invalida o cache e reinstala todas as dependências.</li>
          <li><strong>Sem lockfile nem hashes:</strong> dois builds no mesmo dia podem instalar versões diferentes.</li>
          <li><strong>Roda como root:</strong> uma falha de RCE na aplicação vira root no container, e muito mais perto do host.</li>
          <li><strong>Forma shell do <code>CMD</code>:</strong> o processo principal é <code>/bin/sh</code>, que não repassa SIGTERM para o Python; o container é morto à força após o grace period, cortando requisições.</li>
          <li><strong>Sem <code>.dockerignore</code>:</strong> <code>.git</code>, <code>.env</code> com segredos, datasets e <code>__pycache__</code> vão para a imagem.</li>
        </ul>
        <div class="callout warn"><strong>PEGADINHA</strong> Apagar um arquivo numa camada posterior (<code>RUN rm .env</code>) não o remove da imagem: ele continua na camada anterior, recuperável com <code>docker save</code>. Segredos de build usam <code>RUN --mount=type=secret</code>, que nunca grava o conteúdo em camada.</div>
      `
    },
    {
      id: 'multi-stage-uv',
      title: 'Multi-stage com uv: a imagem de referência',
      body: `
        <pre><code class="language-dockerfile"># syntax=docker/dockerfile:1
FROM python:3.14-slim AS builder
COPY --from=ghcr.io/astral-sh/uv:0.13.8 /uv /uvx /bin/

ENV UV_COMPILE_BYTECODE=1 \
    UV_LINK_MODE=copy \
    UV_PYTHON_DOWNLOADS=never

WORKDIR /app

# 1. Só dependências: camada cacheada enquanto o lock não muda
RUN --mount=type=cache,target=/root/.cache/uv \
    --mount=type=bind,source=uv.lock,target=uv.lock \
    --mount=type=bind,source=pyproject.toml,target=pyproject.toml \
    uv sync --locked --no-install-project --no-dev

# 2. Código do projeto
COPY . /app
RUN --mount=type=cache,target=/root/.cache/uv \
    uv sync --locked --no-dev --no-editable

# ---- runtime: sem uv, sem compiladores, sem cache ----
FROM python:3.14-slim AS runtime

RUN groupadd --system app &amp;&amp; useradd --system --gid app --no-create-home app

COPY --from=builder --chown=app:app /app/.venv /app/.venv
ENV PATH="/app/.venv/bin:$PATH" \
    PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

USER app
WORKDIR /app
EXPOSE 8000

# Forma exec: o Python é PID 1 e recebe SIGTERM diretamente
CMD ["uvicorn", "pagamentos.main:app", "--host", "0.0.0.0", "--port", "8000", \
     "--proxy-headers", "--forwarded-allow-ips", "*"]</code></pre>
        <p>Por que cada detalhe existe: a separação em dois <code>uv sync</code> faz o cache de dependências sobreviver a mudanças de código; <code>--mount=type=cache</code> mantém o cache do uv entre builds sem gravá-lo na imagem; <code>--no-editable</code> instala o projeto como pacote dentro do venv, então o estágio final só precisa do <code>.venv</code>; <code>UV_COMPILE_BYTECODE</code> pré-compila <code>.pyc</code> para reduzir o tempo de startup; e o estágio de runtime não tem uv, cache nem ferramentas de build.</p>
        <pre><code class="language-text"># .dockerignore
.git
.venv
__pycache__/
*.pyc
.env*
tests/
data/
notebooks/
.mypy_cache/
.ruff_cache/</code></pre>
        <div class="callout tip"><strong>DICA</strong> Fixe a imagem base por digest em produção (<code>python:3.14-slim@sha256:...</code>) e deixe um bot (Renovate, Dependabot) abrir PR quando houver atualização. Tag mutável como <code>3.14-slim</code> muda por baixo de você, e com ela o resultado do build.</div>
      `
    },
    {
      id: 'imagens-base',
      title: 'Escolhendo a imagem base',
      body: `
        <table>
          <thead><tr><th>Base</th><th>Prós</th><th>Contras</th></tr></thead>
          <tbody>
            <tr><td><code>python:3.x-slim</code> (Debian)</td><td>glibc, wheels manylinux funcionam, equilíbrio tamanho e compatibilidade</td><td>Ainda traz shell e pacotes do SO</td></tr>
            <tr><td><code>python:3.x-alpine</code></td><td>Muito pequena</td><td>musl: muitos wheels não existem ou se comportam diferente, builds lentos de extensões, diferenças sutis de DNS e alocador</td></tr>
            <tr><td>Distroless / Chainguard / imagens hardened</td><td>Sem shell nem gerenciador de pacotes, poucas CVEs</td><td>Depuração exige container efêmero; versão do Python acoplada à da imagem</td></tr>
            <tr><td><code>python:3.x</code> completa</td><td>Tudo disponível para compilar</td><td>Use só como estágio de build, nunca de runtime</td></tr>
          </tbody>
        </table>
        <p>Minha recomendação padrão para serviços Python é <code>slim</code> no runtime, com escaneamento de vulnerabilidades no CI, e evolução para imagens minimalistas quando o time já tem o fluxo de depuração resolvido. Alpine para Python costuma ser economia falsa: o ecossistema científico (NumPy, pandas, Polars, PyArrow) publica wheels para glibc primeiro, e compilar do fonte no build custa minutos e risco.</p>
        <pre><code class="language-bash"># Inspecionar tamanho e camadas
docker image ls pagamentos
docker history --no-trunc pagamentos:1.4.0
dive pagamentos:1.4.0                 # explora o conteúdo de cada camada

# Escanear vulnerabilidades do SO e dos pacotes Python
trivy image --severity HIGH,CRITICAL --exit-code 1 pagamentos:1.4.0</code></pre>
      `
    },
    {
      id: 'servidor-processos',
      title: 'Servidor de aplicação, workers e sinais',
      body: `
        <p>Em container, o processo principal é PID 1, e PID 1 tem semântica especial no Linux: não recebe o tratamento padrão de sinais e precisa recolher processos filhos órfãos (zumbis). Dois cuidados resolvem: usar a forma exec do <code>CMD</code> (lista JSON), e, se a aplicação cria subprocessos, rodar com um init mínimo (<code>docker run --init</code> ou <code>tini</code> como <code>ENTRYPOINT</code>).</p>
        <p>Quanto ao número de workers, há duas escolas:</p>
        <ul>
          <li><strong>Um processo por container</strong>, escalando por réplicas no Kubernetes. Simples, métricas por pod mais claras, o orquestrador cuida de reinício. É o que prefiro em Kubernetes.</li>
          <li><strong>Vários workers por container</strong> (<code>uvicorn --workers N</code>, ou Gunicorn como gerenciador de processos com workers Uvicorn), útil em VMs ou plataformas onde cada container custa caro.</li>
        </ul>
        <pre><code class="language-bash"># Uvicorn com seu próprio gerenciador de processos
uvicorn pagamentos.main:app --host 0.0.0.0 --port 8000 --workers 4 \
    --timeout-graceful-shutdown 25

# Gunicorn gerenciando workers Uvicorn (pacote uvicorn-worker)
gunicorn pagamentos.main:app -k uvicorn_worker.UvicornWorker \
    --workers 4 --bind 0.0.0.0:8000 --graceful-timeout 25 \
    --max-requests 10000 --max-requests-jitter 1000    # recicla workers (vazamentos)</code></pre>
        <div class="callout warn"><strong>PEGADINHA</strong> <code>os.cpu_count()</code> dentro de um container retorna os núcleos do <em>host</em>, não o limite do cgroup. Uma heurística de "2 x núcleos + 1 workers" num nó de 64 núcleos com limite de 2 CPUs cria 129 processos disputando 2 núcleos. Python 3.13 adicionou <code>os.process_cpu_count()</code>, que respeita a afinidade de CPU, mas a forma mais segura continua sendo configurar o número de workers explicitamente por variável de ambiente.</div>
        <p>Graceful shutdown completo em Kubernetes: o pod recebe SIGTERM, o readiness passa a falhar, o servidor para de aceitar conexões novas e termina as em andamento dentro do timeout, e o <code>terminationGracePeriodSeconds</code> tem que ser maior que esse timeout. Um <code>preStop</code> com alguns segundos de espera cobre o atraso de propagação da remoção do endpoint nos balanceadores.</p>
      `
    },
    {
      id: 'twelve-factor',
      title: '12-factor na prática',
      body: `
        <p>O 12-factor app (Heroku, 2011) envelheceu bem. Os fatores que mais importam para serviços Python em container:</p>
        <ul>
          <li><strong>III. Config:</strong> tudo que muda entre ambientes vem de variáveis de ambiente, nunca do código ou da imagem.</li>
          <li><strong>V. Build, release, run:</strong> build gera a imagem imutável; release combina imagem e configuração; run executa. Nada de editar arquivo dentro do container em execução.</li>
          <li><strong>VI. Processos sem estado:</strong> sessão, upload e cache em serviços de apoio (Redis, S3, banco), não no disco local do pod.</li>
          <li><strong>IX. Descartabilidade:</strong> startup rápido e shutdown gracioso.</li>
          <li><strong>XI. Logs:</strong> fluxo de eventos para stdout.</li>
        </ul>
        <pre><code class="language-python">from functools import lru_cache
from pydantic import Field, SecretStr
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_prefix="PAG_", env_file=None)

    ambiente: str = Field(pattern="^(dev|hml|prd)$")
    database_url: SecretStr
    workers: int = Field(default=1, ge=1, le=32)
    timeout_dependencias_s: float = 2.0
    log_level: str = "INFO"

@lru_cache
def settings() -&gt; Settings:
    return Settings()        # falha no startup se faltar variável obrigatória</code></pre>
        <p>Falhar no startup quando a configuração está incompleta é uma feature: o deploy quebra no rollout, com o pod antigo ainda servindo, em vez de quebrar na primeira requisição que precisar do valor ausente.</p>
      `
    },
    {
      id: 'ci-cd',
      title: 'CI/CD: construir uma vez, promover sempre',
      body: `
        <p>O pipeline que recomendo para serviços Python:</p>
        <ol>
          <li><strong>Verificação rápida:</strong> lint e tipos (ruff, mypy ou pyright), testes unitários com o lockfile.</li>
          <li><strong>Build da imagem</strong> com cache de camadas do registry, tag pelo SHA do commit.</li>
          <li><strong>Testes contra a imagem</strong> (integração com serviços reais em containers, smoke test).</li>
          <li><strong>Segurança:</strong> scan de vulnerabilidades e SBOM; assinatura da imagem (cosign/Sigstore) com atestado de procedência.</li>
          <li><strong>Promoção por digest:</strong> a mesma imagem vai para homologação e depois produção, mudando só a configuração.</li>
          <li><strong>Rollout progressivo:</strong> canary ou blue-green, com rollback automático se o SLO degradar.</li>
        </ol>
        <pre><code class="language-yaml"># .github/workflows/ci.yml (trecho essencial)
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: astral-sh/setup-uv@v6
      - run: uv sync --locked
      - run: uv run ruff check . &amp;&amp; uv run mypy src
      - run: uv run pytest -q

  image:
    needs: test
    runs-on: ubuntu-latest
    permissions: { contents: read, packages: write, id-token: write }
    steps:
      - uses: actions/checkout@v4
      - uses: docker/setup-buildx-action@v3
      - uses: docker/login-action@v3
        with: { registry: ghcr.io, username: $\{{ github.actor }}, password: $\{{ secrets.GITHUB_TOKEN }} }
      - uses: docker/build-push-action@v6
        with:
          push: true
          tags: ghcr.io/banco/pagamentos:$\{{ github.sha }}
          cache-from: type=gha
          cache-to: type=gha,mode=max
          provenance: true
          sbom: true</code></pre>
        <div class="callout"><strong>NA ENTREVISTA</strong> "Por que não reconstruir a imagem para cada ambiente?" Porque cada build é uma chance de resultado diferente (base atualizada, dependência resolvida de outro jeito, rede instável). Promover o mesmo digest garante que o que foi testado é o que roda. Configuração é a única coisa que muda.</div>
      `
    },
    {
      id: 'runtime-kubernetes',
      title: 'Runtime: recursos, probes e hardening',
      body: `
        <pre><code class="language-yaml"># Trecho de Deployment Kubernetes para um serviço FastAPI
spec:
  template:
    spec:
      terminationGracePeriodSeconds: 40
      securityContext:
        runAsNonRoot: true
        seccompProfile: { type: RuntimeDefault }
      containers:
        - name: api
          image: ghcr.io/banco/pagamentos@sha256:3f1c...    # digest, não tag
          env:
            - { name: PAG_AMBIENTE, value: prd }
            - name: PAG_DATABASE_URL
              valueFrom: { secretKeyRef: { name: pagamentos-db, key: url } }
          resources:
            requests: { cpu: "500m", memory: "512Mi" }
            limits:   { memory: "512Mi" }     # limite de memória sim; CPU é decisão do time
          readinessProbe:
            httpGet: { path: /readyz, port: 8000 }
            periodSeconds: 5
          livenessProbe:
            httpGet: { path: /healthz, port: 8000 }
            periodSeconds: 10
            failureThreshold: 3
          lifecycle:
            preStop: { exec: { command: ["sleep", "5"] } }
          securityContext:
            allowPrivilegeEscalation: false
            readOnlyRootFilesystem: true
            capabilities: { drop: ["ALL"] }</code></pre>
        <ul>
          <li><strong>Memória:</strong> processo Python acima do limite é morto com OOMKilled, sem traceback. Dimensione pelo pico medido (memray, métricas do container) mais folga, não pela média.</li>
          <li><strong>readOnlyRootFilesystem:</strong> exige que a aplicação não escreva fora de volumes montados. Com <code>PYTHONDONTWRITEBYTECODE=1</code> e bytecode pré-compilado no build, Python funciona bem assim; monte um <code>emptyDir</code> em <code>/tmp</code> se alguma biblioteca precisar.</li>
          <li><strong>Liveness não deve checar dependências:</strong> se o banco cair e a liveness depender dele, o Kubernetes reinicia todos os pods em loop e transforma uma falha parcial em indisponibilidade total.</li>
        </ul>
        <div class="callout tip"><strong>DICA</strong> Para jobs de dados (Spark, DuckDB, Polars em batch), o mesmo padrão de imagem vale, mas o runtime é <code>Job</code> ou <code>CronJob</code> com <code>backoffLimit</code> e <code>activeDeadlineSeconds</code>, e a idempotência da lição de pipelines é o que torna seguro o retry automático.</div>
      `
    }
  ],
  whenToUse: [
    'Qualquer serviço ou job Python que roda fora da máquina do desenvolvedor',
    'Paridade entre desenvolvimento, CI, homologação e produção',
    'Deploy em Kubernetes, ECS, Cloud Run ou plataformas equivalentes',
    'Promoção de artefatos imutáveis com rastreabilidade por digest e SBOM',
    'Ambientes regulados que exigem reprodutibilidade e trilha de auditoria do que roda'
  ],
  whenNot: [
    'Imagem de runtime com compiladores, cache de pacotes ou ferramentas de build',
    'Rodar como root ou com privilégios desnecessários',
    'Segredos em camadas da imagem ou em ARG e ENV de build',
    'Reconstruir a imagem por ambiente em vez de promover o mesmo digest',
    'Alpine para workloads científicos dependentes de wheels manylinux',
    'Liveness probe que depende de banco ou outros serviços'
  ],
  metrics: [
    'Tamanho da imagem final e número de camadas (dive, docker history)',
    'Tempo de build com e sem cache',
    'Trivy ou Grype sem CVEs HIGH e CRITICAL abertas',
    'Imagem assinada (cosign) com SBOM e atestado de procedência',
    'Tempo de startup e de graceful shutdown dentro do grace period',
    'Taxa de OOMKilled e reinícios por pod'
  ],
  refs: [
    { type: 'doc', title: 'Using uv in Docker', author: 'Astral', url: 'https://docs.astral.sh/uv/guides/integration/docker/', note: 'Padrões oficiais de cache, multi-stage e instalação não editável.' },
    { type: 'doc', title: 'Docker: Multi-stage builds', author: 'Docker', url: 'https://docs.docker.com/build/building/multi-stage/', note: 'Referência de estágios, cache e build secrets.' },
    { type: 'doc', title: 'Dockerfile best practices', author: 'Docker', url: 'https://docs.docker.com/build/building/best-practices/', note: 'Ordem de camadas, .dockerignore e imagens base.' },
    { type: 'portal', title: 'The Twelve-Factor App', author: 'Adam Wiggins', url: 'https://12factor.net/pt_br/', note: 'Os doze fatores, com tradução para português.' },
    { type: 'doc', title: 'Kubernetes: Configure Liveness, Readiness and Startup Probes', author: 'The Kubernetes Authors', url: 'https://kubernetes.io/docs/tasks/configure-pod-container/configure-liveness-readiness-startup-probes/', note: 'Semântica correta de cada probe.' },
    { type: 'artigo', title: 'Production-ready Docker packaging for Python', author: 'Itamar Turner-Trauring (Python Speed)', url: 'https://pythonspeed.com/docker/', note: 'Série prática e detalhada sobre imagens Python em produção.' },
    { type: 'doc', title: 'Sigstore cosign', author: 'Sigstore (OpenSSF)', url: 'https://docs.sigstore.dev/cosign/signing/overview/', note: 'Assinatura e verificação de imagens de container.' },
    { type: 'livro', title: 'Continuous Delivery', author: 'Jez Humble e David Farley', url: 'https://continuousdelivery.com/', note: 'A base de "construir uma vez, promover sempre" e pipelines de deploy.' }
  ]
};
