---
layout: slides
title: "The Geometry of Meaning: Tokenization & Vector Spaces"
category: "ai-tutoring"
module_number: 2
complexity: "Foundational / Technical"
use_math: true
---

layout: true
class: basic-layout
---

class: center, middle, inverse-slide
# The Agentic Path: Módulo 02
## The Geometry of Meaning
### _Tokenização, BPE e a Álgebra dos Espaços Latentes_

<img src="/assets/article_images/transformer-symphony.jpg" width="150px" style="border-radius: 50%; border: 2px solid #FFD700;"/>

**Richardson Lima**
.footnote[Uma análise da camada de entrada ($W\_E$) e do algoritmo BPE]

---

## O Roadmap do Módulo 🗺️

Para que o Transformer processe "pensamentos", ele primeiro precisa converter símbolos discretos em geometria contínua.

1.  **O Problema Discreto:** Por que computadores não entendem strings.
2.  **Engenharia de Tokenização:** Do caractere ao **Byte Pair Encoding (BPE)**.
3.  **A Matriz de Embedding ($W\_E$):** O Lookup Table fundamental.
4.  **Geometria Vetorial:** Cosseno, Distância e Álgebra Semântica.
5.  **O Paradoxo Estático:** A limitação que a Atenção resolve.

---

class: middle, inverse-slide
# Parte 1: O Abismo Discreto
### _Como transformar linguagem em números_

---

## 1. O Computador é Cego para Linguagem 🙈

Para uma CPU/GPU, a string `"Gato"` é apenas uma sequência de bytes: `0x47 0x61 0x74 0x6F`.
Não há significado inerente.

Se tentarmos alimentar esses bytes diretamente, perdemos a estrutura semântica.
Precisamos de uma unidade atômica de significado: o **Token**.

---

## 2. Estratégias de Tokenização: O Passado 🕰️

* **Nível de Caractere:**
    * Input: `['G', 'a', 't', 'o']`
    * *Pros:* Vocabulário minúsculo (~100 chars).
    * *Cons:* Sequências longas demais. O modelo gasta energia aprendendo a soletrar, não a pensar.

* **Nível de Palavra:**
    * Input: `['Gato']`
    * *Pros:* Alta densidade semântica.
    * *Cons:* Vocabulário infinito. O que fazer com "Gatíssimo"? Token `[UNK]` (Unknown)?

---

## 3. A Solução Moderna: Sub-word Tokenization 🧩

O padrão atual (GPT-4, Llama, Claude) é o **Byte Pair Encoding (BPE)**.
É o "meio-termo" perfeito.

* Palavras comuns viram 1 token: `"Apple"` $\to$ `[Apple]`
* Palavras raras são quebradas: `"Antidisestablishmentarianism"` $\to$ `[Anti, dis, establish, ment, arian, ism]`

**Vantagem:** Vocabulário fixo (~50k a 100k tokens) e **zero** tokens desconhecidos.

---

## 4. O Algoritmo BPE (Byte Pair Encoding) ⚙️

Como o algoritmo aprende o vocabulário? (Treinamento do Tokenizer):

1.  Comece com todos os caracteres individuais.
2.  Conte a frequência de todos os pares adjacentes no corpus.
3.  **Fusão (Merge):** Junte o par mais frequente (ex: 'e' + 's' $\to$ 'es').
4.  Adicione 'es' ao vocabulário.
5.  Repita até atingir o tamanho limite (ex: 50.000 merges).



---

## 5. Glitch Tokens: O Lado Sombrio do BPE 🐛

O BPE cria artefatos estranhos.
* Tokens de espaço: `_The` vs `The`.
* Tokens "Mortos": Tokens que existiam no treino do tokenizer mas nunca aparecem no treino do modelo (causam comportamento instável).
* **SolidGoldMagikarp:** Um caso famoso onde tokens de nomes de usuários do Reddit quebraram o GPT-3.

---

class: middle, inverse-slide
# Parte 2: O Espaço Latente
### _Embeddings e a Matriz $W\_E$_

---

## 6. De Inteiro para Vetor 🧱

Após a tokenização, temos uma lista de inteiros: `[452, 9912, 11]`.
Inteiros são **ordinais**, mas palavras são **nominais**.

* $9912 > 452$.
* Mas "Cachorro" não é "maior" que "Gato".

Não podemos usar os inteiros na matemática da rede. Precisamos projetá-los.

---

## 7. A Matriz de Embedding ($W\_E$) 📉

O componente central da camada de entrada é uma matriz gigante de parâmetros aprendidos.

$$W\_E \in \mathbb{R}^{V \times d\_{model}}$$

* $V$: Tamanho do Vocabulário (ex: 50.257 no GPT-2).
* $d\_{model}$: Dimensão do Vetor (ex: 768, 4096, 12288).

Essa matriz é, essencialmente, um **banco de dados chave-valor**.

---

## 8. O Lookup (Busca) 🔍

Matematicamente, pegar o embedding do token $t$ é uma multiplicação de matriz.
Seja $x$ um vetor *one-hot* (tudo zero, exceto um 1 na posição do token ID).

$$v = x \cdot W\_E$$

Na prática (código), não multiplicamos. Apenas fazemos um *slice* (índice) na matriz. É uma operação $O(1)$.

---

## 9. O Que o Embedding Representa? 🌌

Cada dimensão do vetor (dentre as 4096) codifica uma característica semântica abstrata.

* Dimensão 12: Nível de "Realeza".
* Dimensão 500: Nível de "Pluralidade".
* Dimensão 1024: Nível de "Abstração".

*Nota: Na realidade, essas features sofrem **Superposição** (Superposition), e uma dimensão pode codificar múltiplos conceitos (Polysemanticity).*

---

## 10. A Geometria do Significado 📐

Como medimos se duas palavras são sinônimos?
Usamos a **Similaridade de Cosseno**.

$$\text{Similarity}(A, B) = \frac{A \cdot B}{||A|| \cdot ||B||} = \cos(\theta)$$

* Se apontam para o mesmo lado ($\theta = 0^\circ$), Cos = 1.
* Se são ortogonais ($\theta = 90^\circ$), Cos = 0 (Sem relação).
* Se são opostos ($\theta = 180^\circ$), Cos = -1 (Antônimos).

---

## 11. Aritmética Linear Semântica ➕

A propriedade mais famosa (Mikolov et al., 2013):

$$E(\text{Rei}) - E(\text{Homem}) + E(\text{Mulher}) \approx E(\text{Rainha})$$

Isso prova que o espaço latente captura **relações analógicas** linearmente.
O vetor $v\_{genero} = E(\text{Mulher}) - E(\text{Homem})$ é constante através de vários pares de palavras.



---

class: middle, inverse-slide
# Parte 3: O Paradoxo Estático
### _Embeddings vs. Contexto_

---

## 12. O Limite da Camada 0 🛑

A matriz $W\_E$ é **estática**.
Isso significa que o token "Manga" tem **sempre o mesmo vetor inicial**, não importa a frase.

* Frase A: "Comi uma **manga** doce." (Fruta)
* Frase B: "A **manga** da camisa rasgou." (Roupa)

Na saída da camada de Embedding (antes da atenção), esses dois tokens são **idênticos**.

---

## 13. O Objetivo do Transformer (Revisitado) 🎯

Se o embedding inicial é surdo para o contexto, o trabalho das 96 camadas do Transformer é:
**Contextualizar o Vetor.**

Ele deve mover o ponto "Manga" no espaço vetorial.
* Na Frase A, ele empurra o vetor na direção do conceito "Alimento".
* Na Frase B, ele empurra o vetor na direção do conceito "Tecido".

---

## 14. Unembedding Matrix ($W\_U$) 🚪

No final da rede, temos um vetor super-contextualizado.
Precisamos transformá-lo de volta em probabilidade de tokens.
Usamos a matriz $W\_U$ (Unembedding).

$$Logits = x\_{final} \cdot W\_U^T$$

Frequentemente, $W\_U$ e $W\_E$ compartilham os mesmos pesos (**Tied Embeddings**), economizando parâmetros.

---

## 15. Recapitulando o Fluxo de Dados 🌊

1.  **Texto:** "Olá Mundo"
2.  **Tokenizer (BPE):** `[15491, 2159]`
3.  **One-Hot:** Vetores esparsos gigantes.
4.  **Lookup ($W\_E$):** Vetores densos (Embeddings).
5.  **Positional Encoding:** Adição de ordem.
6.  **Transformer Blocks:** Processamento.

---

## 16. The Agentic Path 🏁

Entender Embeddings é crucial para construir Agentes modernos (RAG).
Quando criamos um "Cérebro" para uma empresa, vetorizamos seus documentos (PDFs) e buscamos por similaridade de cosseno.
A tecnologia de busca semântica é apenas o uso inteligente da matriz $W\_E$.

**Próximo Módulo:** O Coração da Máquina - **Atenção Multi-Cabeça (MHA)**.

---
class: center, middle
# The Geometry is Open
### _Perguntas sobre Espaços Vetoriais?_
---