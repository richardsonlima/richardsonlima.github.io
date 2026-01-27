---
layout: slides
title: "A Anatomia da Inteligência: Engenharia Reversa de Transformers"
category: "ai-tutoring"
module_number: 1
complexity: "Masterclass (100 Slides) - The Agentic Path"
use_math: true
---

layout: true
class: basic-layout
---

class: center, middle, inverse-slide
# A Anatomia da Inteligência
## Engenharia Reversa de LLMs: De RNNs a Induction Heads
### _Uma Imersão Profunda em 100 Slides_

<img src="/assets/article_images/transformer-symphony.jpg" width="150px" style="border-radius: 50%; border: 2px solid #FFD700;"/>

**Richardson Lima**
.footnote[Fontes: Vaswani et al. (2017), Anthropic (2021), 3Blue1Brown]

---

## O Mapa da Jornada (Slides 1-100) 🗺️

1.  **Módulo 1: O Legado e a Ruptura (Slides 3-15)**
    * Por que RNNs falharam? O gargalo sequencial.
2.  **Módulo 2: A Física dos Dados (Slides 16-30)**
    * Tokens, Embeddings e o Espaço Latente.
3.  **Módulo 3: O Barramento da Consciência (Slides 31-45)**
    * O Residual Stream e a visão da Anthropic.
4.  **Módulo 4: A Mecânica da Atenção (Slides 46-70)**
    * Q, K, V, Circuitos QK/OV e Multi-Head.
5.  **Módulo 5: O Surgimento do Raciocínio (Slides 71-85)**
    * Engenharia reversa (0, 1, 2 camadas) e Induction Heads.
6.  **Módulo 6: Componentes Vitais & Futuro (Slides 86-100)**
    * MLPs, Positional Encoding e Scaling Laws.

---

class: middle, inverse-slide
# Módulo 1: O Legado e a Ruptura
### _A Morte da Sequência e o Nascimento do Paralelismo_

---

## 4. Como líamos antes de 2017? 📜

Antes do Transformer, a IA processava texto como nós: **uma palavra de cada vez**.
Isso era feito com **RNNs (Recurrent Neural Networks)**.

* **Processo:** Ler palavra $t$, atualizar memória $h_t$, ler palavra $t+1$...
* **A "Fita":** Imagine ler uma fita magnética infinita sem poder voltar atrás facilmente.

---

## 5. A Matemática da Recorrência 🔄

Nas RNNs, o "estado oculto" (memória) é atualizado assim:

$$h_t = \tanh(W_{hh} h_{t-1} + W_{xh} x_t)$$

* $h_t$: Nova memória.
* $h_{t-1}$: Memória antiga.
* $x_t$: Palavra atual.

**O problema:** Tudo depende do passo anterior. Não dá para calcular o passo 100 sem calcular o 99.

---

## 6. O Problema do "Telefone Sem Fio" 📞

Em uma frase longa, a informação do início se perde.
_"O **gato**, que estava no telhado da casa amarela construída em 1990... [100 palavras] ... **caiu**."_

Para a RNN conectar "caiu" com "gato", o sinal precisa viajar por 100 multiplicações de matrizes.
Isso causa o **Vanishing Gradient** (o sinal desaparece).

---

## 7. O Gargalo Computacional (Tempo) ⏳

Treinar RNNs em GPUs é ineficiente.
GPUs amam fazer tudo ao mesmo tempo (paralelismo).
RNNs exigem fazer uma coisa depois da outra (sequencial).

* **Resultado:** Era impossível treinar modelos com bilhões de parâmetros. Demoraria séculos.

---

## 8. A Tentativa das LSTMs 🧠

**Long Short-Term Memory (LSTM)** foi uma melhoria.
Ela introduziu "portões" (gates) para decidir o que esquecer e o que lembrar.

* *Forget Gate:* "Devo apagar essa memória?"
* *Input Gate:* "Essa nova informação importa?"

Melhorou o "telefone sem fio", mas continuava **lenta e sequencial**.

---

## 9. A Tentativa das CNNs (Convoluções) 🖼️

Tentaram usar redes de imagem (CNNs) em texto.
* **Ideia:** Usar uma "janela deslizante" que olha 3 palavras por vez.
* **Vantagem:** Paralelizável!
* **Desvantagem:** Visão limitada.

---

## 10. O Problema da "Localidade" nas CNNs 🔍

Para conectar a primeira e a última palavra de um livro com CNNs, você precisa empilhar muitas camadas.
É como olhar o mundo através de um canudo.

A "distância de caminho" (path length) entre palavras distantes era $O(log N)$ ou $O(N)$.
Ainda não era ideal.

---

## 11. O Sonho do Acesso Instantâneo ✨

O que os pesquisadores queriam:
Uma arquitetura onde a distância entre **qualquer** par de palavras fosse **1** (acesso direto).

Não importa se as palavras estão lado a lado ou separadas por 100 páginas.
A conexão deveria ser instantânea.

---

## 12. "Attention Is All You Need" (2017) 📄

O paper de Vaswani et al. propôs o **Transformer**.
* Jogou fora a recorrência (RNN).
* Jogou fora a convolução (CNN).
* Ficou apenas com a **Atenção**.

---

## 13. O Que é Atenção? (Conceito Lúdico) 🔦

Imagine que você está em uma festa barulhenta.
* Seus ouvidos captam todo o som (entrada bruta).
* Seu cérebro **foca** apenas na voz do seu amigo (sinal).
* O resto vira ruído de fundo (supressão).

**Atenção é um filtro ponderado de informações.**

---

## 14. O Que é Atenção? (Conceito PhD) 📐

Atenção é uma **recuperação de conteúdo endereçável** (Content-Addressable Retrieval).
Em vez de buscar dados por um endereço de memória física (RAM 0x3F), buscamos por **similaridade vetorial**.

* Query: "Procuro algo sobre Reis."
* Memory: "Tenho dados sobre Rainhas."
* Match: Alta similaridade $\to$ Recupera dados.

---

## 15. A Vitória do Paralelismo 🚀

No Transformer, a frase inteira entra de uma vez.
Calculamos a relação de "todas as palavras com todas as palavras" simultaneamente.
Isso permitiu o uso massivo de GPUs e o nascimento dos LLMs modernos (GPT, BERT, Claude).

---

class: middle, inverse-slide
# Módulo 2: A Física dos Dados
### _Tokens, Embeddings e o Espaço Semântico_

---

## 16. O Computador não lê Texto 🔢

Para o modelo, "Maçã" não existe.
O primeiro passo é a **Tokenização**.
Texto $\to$ Números Inteiros (IDs).

---

## 17. O Que é um Token? 🧱

Um token pode ser uma palavra, uma sílaba ou até um espaço.
* "Smart" $\to$ 1452
* "phone" $\to$ 982
* " " (espaço) $\to$ 220

Modelos modernos usam **BPE (Byte Pair Encoding)** para comprimir texto eficientemente.

---

## 18. A Nuance da Tokenização 🐛

**Bug Clássico:** O modelo trata " The" (com espaço) e "The" (sem espaço) como tokens totalmente diferentes.
Isso exige que o modelo gaste "capacidade cerebral" para aprender que eles significam a mesma coisa.

---

## 19. Embeddings: Dando Corpo aos Números 👻

Um número isolado (ID 1452) não tem significado matemático.
Não podemos fazer contas com IDs ($Canela - Cachorro = ?$).

Transformamos cada ID em um **Vetor de Embedding**.
Uma lista de coordenadas flutuantes. Ex: `[0.1, -0.5, 0.8, ...]`.

---

## 20. O Espaço Latente de Alta Dimensão 🌌

No GPT-3, cada palavra é um ponto em um espaço de **12.288 dimensões**.
Isso é impossível de visualizar, mas matematicamente real.
Neste espaço, conceitos próximos ficam fisicamente próximos.

---

## 21. A Aritmética do Significado ➕

A propriedade mágica dos embeddings:
**Rei - Homem + Mulher $\approx$ Rainha**

As direções no espaço têm significado.
Existe um "vetor de gênero", um "vetor de plural", um "vetor de tempo verbal".

---

## 22. A Matriz de Embedding ($W_E$) 📉

O embedding é apenas uma tabela gigante (Matriz $V \times d_{model}$).
Onde $V$ é o tamanho do vocabulário (~50k) e $d_{model}$ é a dimensão do vetor.

Para o modelo, "ler" um token é apenas selecionar uma linha dessa matriz.

---

## 23. O Problema da Estática 🗿

A matriz de embedding é fixa.
O vetor da palavra "Banco" é o mesmo, seja "Banco do Brasil" ou "sentar no banco".

Isso é um problema. Precisamos de contexto.

---

## 24. Contextualização Dinâmica 🌊

O objetivo de todas as camadas do Transformer é pegar esse vetor estático de "Banco" e movê-lo.
* Se houver "dinheiro" perto $\to$ Mova para o subespaço financeiro.
* Se houver "praça" perto $\to$ Mova para o subespaço de móveis.

---

## 25. O Unembedding ($W_U$) 🚪

No final de tudo, precisamos voltar para as palavras.
A matriz $W_U$ faz o inverso: pega o vetor final e calcula a probabilidade de cada palavra do dicionário ser a próxima.

---

## 26. Logits e Probabilidades 🎲

O output bruto do modelo são **Logits** (scores).
Aplicamos **Softmax** para transformar em % (0 a 100).
A palavra com maior % (ou uma amostra delas) é escolhida.

---

## 27. Temperatura 🌡️

No processo de escolha (sampling):
* **Temp 0:** Escolhe sempre a maior probabilidade (Determinístico).
* **Temp 1:** Dá chance para palavras menos prováveis (Criativo).

Isso acontece *depois* do Transformer, na etapa de geração.

---

## 28. O Tamanho do Contexto (Context Window) 🖼️

Quantos tokens o modelo vê de uma vez?
* GPT-2: 1024 tokens.
* GPT-4: 128k tokens.
* Gemini 1.5: 1M+ tokens.

Quanto maior a janela, mais memória RAM (VRAM) é necessária para armazenar as matrizes de atenção.

---

## 29. A Maldição Quadrática $O(N^2)$ 📈

Por que não temos contexto infinito?
A Atenção calcula a relação de "todos com todos".
* 10 tokens $\to$ 100 cálculos.
* 1000 tokens $\to$ 1.000.000 cálculos.

O custo cresce ao quadrado. Isso é o principal limitador hoje.

---

## 30. Resumo do Módulo 2

* Texto vira Token.
* Token vira Vetor (Embedding).
* Vetor tem significado geométrico.
* O modelo manipula essa geometria para adicionar contexto.

---

class: middle, inverse-slide
# Módulo 3: O Barramento da Consciência
### _Residual Stream e Pesos Virtuais (Anthropic View)_

---

## 31. Revisitando a Arquitetura 🏗️

Esqueça o diagrama clássico de "camadas empilhadas".
A visão mecanicista correta (Elhage et al., 2021) é o **Residual Stream**.

---

## 32. O que é o Residual Stream? 🚇

Imagine uma esteira rolante ou um barramento de dados.
É o vetor $x_i$ que viaja do início ao fim do modelo.
As camadas (Attention e MLP) não bloqueiam o caminho. Elas ficam "ao lado", lendo e escrevendo.

---

## 33. A Equação Fundamental: Adição ➕

$$x_{i+1} = x_i + \text{Layer}(x_i)$$

A saída da camada é **somada** ao fluxo original.
Isso significa que a informação original nunca é perdida ou substituída, apenas enriquecida.

---

## 34. Memória de Curto Prazo 🧠

O Residual Stream age como a "Memória de Trabalho" do modelo.
* Camada 1 descobre que "Rio" é uma cidade. Escreve isso no stream.
* Camada 20 pode ler essa nota e usar.

---

## 35. Comunicação entre Camadas 📡

As camadas "conversam" através do stream.
Uma camada de Atenção pode "pedir" informação (Lendo) e "responder" (Escrevendo).
Não há comunicação lateral direta, tudo passa pelo barramento central.

---

## 36. Subespaços Vetoriais 📦

O Stream é largo (ex: 4096 dimensões).
As cabeças de atenção são estreitas (ex: 64 dimensões).
Isso significa que cada cabeça trabalha em um pequeno **subespaço**.

---

## 37. Ortogonalidade 📐

Várias cabeças podem escrever no stream ao mesmo tempo sem se atrapalhar, desde que escrevam em direções **ortogonais** (perpendiculares).
Informação sobre "Gramática" viaja no eixo X.
Informação sobre "Tom de voz" viaja no eixo Y.

---

## 38. Largura de Banda (Bandwidth) 🛣️

O "tamanho" do residual stream (d_model) é a largura de banda da inteligência do modelo.
Se for muito estreito, o modelo não consegue manter muitas ideias complexas simultaneamente na memória.

---

## 39. Pesos Virtuais (Virtual Weights) 🔗

Como o stream é linear (só somas), podemos calcular a interação direta entre a Camada 1 e a Camada 10.
Multiplicamos as matrizes de saída da Camada 1 com as de entrada da Camada 10.
Isso cria um "atalho virtual" para análise.

---

## 40. O Papel da Layer Norm aqui ⚖️

A cada passo, o modelo aplica **Layer Norm**.
Ela normaliza a variância dos dados.
No Residual Stream, isso evita que os valores explodam (fiquem infinitos) após tantas somas sucessivas.

---

## 41. MLP como Processador ⚙️

Enquanto a Atenção move dados (comunicação), a MLP (Multi-Layer Perceptron) processa dados.
Ela lê do stream, "pensa" sobre o vetor, e escreve uma conclusão.
66% dos parâmetros do modelo estão nas MLPs.

---

## 42. Bottleneck Activations 🍾

O Residual Stream é um "gargalo".
As MLPs expandem o dado para uma dimensão muito maior (4x) para processar, e depois comprimem de volta para caber no stream.
O "pensamento" é rico, mas a "comunicação" é comprimida.

---

## 43. Decomposição de Caminhos 🌿

Podemos escrever a saída do modelo como uma soma de todos os caminhos possíveis.
Caminho Direto + Caminho via Cabeça 1 + Caminho via MLP 5...
Isso permite **Engenharia Reversa**: qual caminho contribuiu para a palavra "gato"?

---

## 44. A Visão de "Programação Diferenciável" 💻

Pense no Transformer não como uma Rede Neural, mas como um programa de computador onde:
* Variáveis = Residual Stream.
* Funções = Camadas.
* Ponteiros = Atenção.

---

## 45. Resumo do Módulo 3

* Residual Stream é a espinha dorsal.
* A operação principal é a **Soma** (Residual).
* Informação persiste e flui livremente.
* Camadas leem e escrevem em subespaços.

---

class: middle, inverse-slide
# Módulo 4: A Mecânica da Atenção
### _Query, Key, Value e os Circuitos da Mente_

---

## 46. A Cabeça de Atenção (Attention Head) 🐙

É a unidade fundamental de processamento.
O GPT-3 tem 96 cabeças por camada.
Cada uma é independente e se especializa em algo diferente.

---

## 47. A Tríade Q, K, V 🔑

Para cada token, a cabeça gera 3 vetores novos:
1.  **Query ($Q$):** O que eu quero?
2.  **Key ($K$):** Quem sou eu? (Para ser encontrado)
3.  **Value ($V$):** O que eu tenho a entregar?

---

## 48. Calculando Q, K, V 🧮

Eles são criados multiplicando o vetor do token ($x$) por matrizes aprendidas:
$$Q = x \cdot W_Q$$
$$K = x \cdot W_K$$
$$V = x \cdot W_V$$

Essas matrizes ($W$) são os "cérebros" que aprendemos no treino.

---

## 49. Analogia do Sistema de Arquivos 🗄️

* **Query:** O termo que você digita no Google ("Receita de Bolo").
* **Key:** O título das páginas web indexadas ("Receita de Bolo de Cenoura").
* **Value:** O conteúdo da página (O texto da receita).

---

## 50. O Score de Afinidade (Dot Product) 🤝

Como sabemos se $Q$ combina com $K$?
Usamos o **Produto Escalar** (Dot Product).
$$Score = Q \cdot K^T$$

Se os vetores apontam para a mesma direção, o score é alto (positivo).
Se são opostos, é negativo.
Se são perpendiculares (nada a ver), é zero.

---

## 51. O Scaling ($\sqrt{d_k}$) 📏

Dividimos o score pela raiz quadrada da dimensão da cabeça.
$$\frac{Q \cdot K^T}{\sqrt{d_k}}$$
**Por que?** Para evitar que os números fiquem grandes demais.
Números grandes matam o gradiente no Softmax (platôs de aprendizado).

---

## 52. O Mascaramento (Masking) 🎭

O modelo não pode "colar" do futuro.
Ao prever a palavra 5, ele não pode ver a palavra 6.
Preenchemos a matriz de scores futuros com $-\infty$ (infinito negativo).

---

## 53. O Softmax: A Ditadura do Foco ⚖️

Aplicamos Softmax nos scores.
Transforma números quaisquer em uma distribuição de probabilidade (Soma = 1).
O $-\infty$ do mascaramento vira **0**.
Scores altos viram **1**.

---

## 54. A Fórmula Completa da Atenção ⭐

$$Attention(Q, K, V) = \text{softmax}\left(\frac{QK^T}{\sqrt{d_k}}\right)V$$

Esta é a equação mais importante da IA moderna.

---

## 55. O Resultado: Média Ponderada 🍹

O output da atenção é uma mistura (blend) dos vetores de **Value**.
90% do vetor da palavra "Maçã" + 10% do vetor da palavra "Fruta".
Isso cria um novo vetor contextualizado.

---

## 56. Multi-Head Attention: Por que muitas? hydra

Uma cabeça só não basta.
Uma frase tem muitas relações: sintáticas, semânticas, de gênero, de tempo.
Precisamos de "óculos" diferentes para ver cada uma.
Cada cabeça foca em um aspecto.

---

## 57. A Matriz de Saída ($W_O$) 🚪

Depois que todas as cabeças terminam, concatenamos os resultados.
Multiplicamos pela matriz $W_O$ (Output Matrix).
Ela mistura tudo e projeta de volta para o tamanho do Residual Stream.

---

## 58. Decomposição em Circuitos (Anthropic) 🔬

Podemos dividir a cabeça em dois circuitos independentes.
Isso ajuda na interpretação.

---

## 59. O Circuito QK (Query-Key) 💓

Controla o **Padrão de Atenção** (Attention Pattern).
Define **quem olha para quem**.
Matriz $A = Q \cdot K$.
Independente do conteúdo que está sendo movido.

---

## 60. O Circuito OV (Output-Value) 📦

Controla o **Efeito no Output**.
Define **o que acontece** quando atendemos alguém.
"Se eu olhar para o token X, devo aumentar a probabilidade do token Y".
Matriz $M = W_V \cdot W_O$.

---

## 61. Independência dos Circuitos 🔓

Podemos analisar o Circuito OV sem saber para onde o modelo olhou.
Ele nos diz: "Se esta cabeça prestar atenção na palavra 'Gato', ela vai gritar 'Animal'".
Isso é determinístico e linear.

---

## 62. Visualizando Heatmaps 🔥

Ferramentas de visualização mostram o Padrão de Atenção.
Linhas grossas ligando palavras.
Isso é visualização do **Circuito QK**.

---

## 63. Cross-Attention (Atenção Cruzada) ❌

Usada em traduções (Encoder-Decoder).
* **Query** vem da frase em Português (destino).
* **Key/Value** vem da frase em Inglês (origem).
"Como se diz 'Dog'?" -> Busca no texto original.

---

## 64. Self-Attention (Auto-Atenção) 🤳

O padrão no GPT.
Olhamos para nós mesmos (o próprio texto gerado até agora).
Tudo vem do mesmo lugar.

---

## 65. Custo Computacional e KV Cache 💾

Na inferência (chat), não precisamos recalcular K e V passados.
Eles são fixos.
Guardamos no **KV Cache** (memória RAM).
Isso acelera a resposta, mas consome muita memória em textos longos.

---

## 66. Grouped Query Attention (GQA) 📉

Técnica moderna (Llama 2/3).
Várias cabeças compartilham as mesmas Keys e Values, mas têm Queries diferentes.
Economiza memória e velocidade sem perder muita qualidade.

---

## 67. Sparse Attention (Atenção Esparsa) 🕸️

Em vez de olhar para todos, olhamos só para alguns (janela local + alguns aleatórios).
Tenta resolver o custo $O(N^2)$.
Ex: Longformer, BigBird.

---

## 68. Linear Attention 📏

Tentativas de fazer a atenção ser $O(N)$.
RWKV, Mamba, S4.
Eliminam o Softmax quadrático. São o futuro?

---

## 69. Resumo do Módulo 4

* Atenção mistura valores baseada em afinidade.
* Q, K, V são projeções aprendidas.
* Circuitos QK e OV explicam "Onde" e "O Que".
* Multi-Head permite nuances paralelas.

---

## 70. Pausa para Respiração 🧘

Até aqui cobrimos a estrutura estática.
Agora vamos ver a dinâmica: como o modelo **aprende** algoritmos.

---

class: middle, inverse-slide
# Módulo 5: O Surgimento do Raciocínio
### _Engenharia Reversa Mecanicista & Induction Heads_

---

## 71. O Sonho da Interpretabilidade 🔍

Podemos ler o "cérebro" da IA?
A **Interpretabilidade Mecanicista** tenta fazer engenharia reversa dos pesos.
Não olhar apenas o output, mas o circuito interno.

---

## 72. Modelos de Zero Camadas (Zero-Layer) 0️⃣

Um Transformer sem atenção.
Caminho: Token $\to$ Embed $\to$ Unembed.
Ele só aprende estatística de Bigrama (Frequência pura).
"Eu" $\to$ "sou".

---

## 73. Modelos de Uma Camada (One-Layer) 1️⃣

Adiciona 1 camada de atenção.
Agora ele pode olhar para trás.
Ele aprende **Skip-Trigrams** (Trigramas com pulo).
"A ... B $\to$ C".

---

## 74. Exemplo de Skip-Trigram 📝

Se o contexto tem "Keep" lá atrás...
E a palavra atual é "at"...
A cabeça de atenção copia a informação de "Keep" para "at".
O resultado favorece "bay". (Keep ... at ... bay).

---

## 75. A Limitação de 1 Camada 🚧

Modelos de 1 camada são "burros".
Eles não conseguem raciocinar "Se X então Y, mas se Z então W".
Eles são apenas tabelas de correlação glorificadas.

---

## 76. A Mágica da Camada 2 (Two-Layer) ✨

Aqui surge a **Composição**.
A Camada 2 lê o que a Camada 1 escreveu.
Isso permite criar algoritmos lógicos sequenciais.

---

## 77. Induction Heads: O Santo Graal 🏆

Descoberta pela Anthropic.
São circuitos que implementam a regra:
**"Se isso aconteceu antes, vai acontecer de novo."**

---

## 78. O Algoritmo da Indução (Passo a Passo) 👣

Imagine a sequência: `[A] [B] ... [A] -> ?`
O modelo precisa prever `[B]`.

1.  **Head de Camada 1 (Previous Token):** Atende ao token anterior. Quando estamos no segundo `[A]`, ela olha para trás e vê o contexto.
2.  **Head de Camada 2 (Induction):** Procura no passado onde `[A]` apareceu. Encontra o primeiro `[A]`.
3.  **Cópia:** Olha o que veio depois dele (`[B]`) e copia para o presente.

---

## 79. Por que isso é importante? 💡

Isso é **In-Context Learning**.
É assim que o modelo aprende a completar padrões que você inventou agora no prompt.
Ele não "sabia" o padrão, ele "deduziu" usando esse circuito de cópia.

---

## 80. Visualizando Induction Heads 📉

Em gráficos de atenção, elas parecem linhas diagonais deslocadas.
Elas olham consistentemente para $n-1$ posições atrás de ocorrências prévias.

---

## 81. Few-Shot Prompting 💉

Quando damos 3 exemplos para o ChatGPT, estamos "ativando" as Induction Heads.
Elas reconhecem a estrutura repetitiva e entram em "modo de cópia inteligente".

---

## 82. Evolução durante o Treinamento 👶

No começo do treino, Induction Heads não existem.
De repente, em um ponto específico ("Phase Change"), elas aparecem.
Nesse momento, a Loss do modelo cai drasticamente. Ele "aprendeu a aprender".

---

## 83. Circuitos de Cópia vs. Raciocínio Abstrato 🧠

Copiar é o básico.
Modelos maiores (GPT-4) compõem milhares de cabeças.
"Induction Head" + "Translation Head" = Aprender a traduzir um idioma novo só com exemplos no prompt.

---

## 84. "Bugs" Interpretáveis 🐛

Às vezes o modelo erra porque uma Induction Head falhou.
Ela copiou o padrão errado.
Podemos ver isso nos pesos! A interpretabilidade nos permite depurar a IA.

---

## 85. Resumo do Módulo 5

* 0 Camadas = Estatística.
* 1 Camada = Correlação simples.
* 2+ Camadas = Algoritmos e Indução.
* Induction Heads são a base do aprendizado em contexto.

---

class: middle, inverse-slide
# Módulo 6: Componentes Vitais & Futuro
### _MLPs, Posição e Scaling Laws_

---

## 86. Feed Forward Networks (MLPs) 🏗️

Até agora falamos só de atenção.
Mas 2/3 dos parâmetros estão nas MLPs.
O que elas fazem?

---

## 87. Memórias Chave-Valor (Key-Value Memories) 🗝️

Pesquisas indicam que MLPs funcionam como **bancos de dados associativos**.
* Camada 1 (Key): Detecta um padrão ("França").
* Camada 2 (Value): Entrega um fato ("Capital: Paris").

Enquanto a Atenção contextualiza, a MLP recupera fatos estáticos.

---

## 88. Positional Encoding: O GPS da Sentença 📍

Como o Transformer é paralelo, ele não sabe a ordem das palavras.
"O cão mordeu o homem" = "O homem mordeu o cão".
Precisamos injetar informação de posição.

---

## 89. Senos e Cossenos (Original) 〰️

Vaswani usou frequências de ondas.
Posição 1 tem uma assinatura de onda. Posição 100 tem outra.
Somamos isso ao embedding inicial.

---

## 90. Rotary Embeddings (RoPE) 🌀

A revolução moderna (usada no Llama).
Em vez de somar, **rotacionamos** o vetor no plano complexo.
A rotação depende da posição.
Isso permite que a atenção entenda **distância relativa** muito melhor.

---

## 91. Normalização (LayerNorm / RMSNorm) ⚖️

Matematicamente vital.
Garante que os números fiquem estáveis (média 0, variância 1).
Sem isso, treinar redes profundas (100 camadas) seria impossível devido a explosão de gradientes.

---

## 92. O Processo de Treinamento 🏋️

**Self-Supervised Learning.**
Não precisamos de humanos rotulando dados.
Pegamos a internet inteira.
Escondemos a próxima palavra.
O modelo tenta adivinhar. Se errar, atualizamos os pesos (Backpropagation).

---

## 93. Scaling Laws (Leis de Escala) 📈

Kaplan et al. (2020) descobriram uma lei física da IA.
O desempenho (Loss) melhora previsivelmente com:
1.  Mais Dados.
2.  Mais Parâmetros.
3.  Mais Computação (GPU hours).

É uma Power Law. Não há sinal de saturação ainda.

---

## 94. Compute-Optimal (Chinchilla) 🐭

DeepMind descobriu o equilíbrio ideal.
Muitos modelos eram grandes demais para poucos dados.
Para treinar um modelo ótimo, devemos aumentar dados e parâmetros na mesma proporção.

---

## 95. O Futuro: Contexto Infinito? ♾️

Arquiteturas como Ring Attention e RAG tentam quebrar o limite da janela de contexto.
O objetivo é ler livros inteiros ou bases de código completas na memória de trabalho.

---

## 96. O Futuro: Raciocínio (Chain of Thought) ⛓️

Transformers padrões são "pensadores rápidos" (Sistema 1).
Técnicas novas tentam forçar "pensamento lento" (Sistema 2), gerando tokens de raciocínio antes da resposta final.

---

## 97. Críticas e Limitações ⚠️

* **Alucinação:** O modelo tenta prever o *provável*, não o *verdadeiro*.
* **Viés:** Aprende os preconceitos da internet.
* **Caixa Preta:** Apesar da engenharia reversa, modelos gigantes ainda são misteriosos.

---

## 98. Recapitulando a Anatomia 💀

1.  **Tokenização:** Texto vira número.
2.  **Embedding:** Número vira conceito geométrico.
3.  **Atenção:** Conceitos buscam contexto (Q,K,V).
4.  **MLP:** Conceitos buscam fatos.
5.  **Residual Stream:** O rio onde tudo flui.
6.  **Unembedding:** Conceito volta a ser palavra.

---

## 99. Conclusão Filosófica 🦉

O Transformer provou que **Atenção** e **Escala** podem emular compreensão.
Não sabemos se é "consciência", mas é certamente uma simulação funcional de alta fidelidade da inteligência humana baseada em texto.

---

## 100. The Agentic Path 🏁

Você agora possui a visão de raio-X da arquitetura mais importante do século XXI.
O próximo passo não é apenas entender, é **construir**.

**Fim da Masterclass.**

---