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
# The Agentic Path: Module 02
## The Geometry of Meaning
### _Tokenization, BPE and the Algebra of Latent Spaces_

<img src="/assets/article_images/transformer-symphony.jpg" width="150px" style="border-radius: 50%; border: 2px solid #FFD700;"/>

**Richardson Lima**
.footnote[An analysis of the input layer ($W\_E$) and the BPE algorithm]

---

## The Module Roadmap

In order for the Transformer to process "thoughts", it first needs to convert discrete symbols into continuous geometry.

1. **The Discreet Problem:** Why computers don't understand strings.
2. **Tokenization Engineering:** From character to **Byte Pair Encoding (BPE)**.
3. **The Embedding Matrix ($W\_E$):** The fundamental Lookup Table.
4. **Vector Geometry:** Cosine, Distance and Semantic Algebra.
5. **The Static Paradox:** The limitation that Attention solves.

---

class: middle, inverse-slide
# Part 1: The Discreet Abyss
### _How to transform language into numbers_

---

## 1. The Computer is Language Blind

For a CPU/GPU, the string `"Cat"` is just a sequence of bytes: `0x47 0x61 0x74 0x6F`.
There is no inherent meaning.

If we try to feed these bytes directly, we lose the semantic structure.
We need an atomic unit of meaning: the **Token**.

---

## 2. Tokenization Strategies: The Past

* **Character Level:**
* Input: `['G', 'a', 't', 'o']`
* *Pros:* Tiny vocabulary (~100 chars).
* *Cons:* Sequences too long. The model spends energy learning to spell, not thinking.

* **Word Level:**
* Input: `['Gato']`
* *Pros:* High semantic density.
* *Cons:* Infinite vocabulary. What to do with "supercat"? Token `[UNK]` (Unknown)?

---

## 3. The Modern Solution: Sub-word Tokenization

The current standard (GPT-4, Llama, Claude) is **Byte Pair Encoding (BPE)**.
It's the perfect "middle ground."

* Common words become 1 token: `"Apple"` $\to$ `[Apple]`
* Rare words are broken: `"Antidisestablishmentarianism"` $\to$ `[Anti, dis, establish, ment, arian, ism]`

**Advantage:** Fixed vocabulary (~50k to 100k tokens) and **zero** unknown tokens.

---

## 4. O Algoritmo BPE (Byte Pair Encoding)

How does the algorithm learn vocabulary? (Tokenizer Training):

1. Start with all the individual characters.
2. Count the frequency of all adjacent pairs in the corpus.
3. **Merge:** Join the most frequent pair (ex: 'e' + 's' $\to$ 'es').
4. Add 'es' to the vocabulary.
5. Repeat until reaching the limit size (e.g. 50,000 merges).



---

## 5. Glitch Tokens: The Dark Side of BPE

BPE creates strange artifacts.
* Space tokens: `_The` vs `The`.
* "Dead" tokens: Tokens that existed in the tokenizer training but never appear in the model training (cause unstable behavior).
* **SolidGoldMagikarp:** A famous case where Reddit username tokens broke GPT-3.

---

class: middle, inverse-slide
# Part 2: The Latent Space
### _Embeddings and the $W\_E$_ Matrix

---

## 6. From Integer to Vector

After tokenization, we have a list of integers: `[452, 9912, 11]`.
Integers are **ordinal**, but words are **nominal**.

* $9912 > 452$.
* But "Dog" is not "bigger" than "Cat".

We cannot use integers in network mathematics. We need to design them.

---

## 7. The Embedding Matrix ($W\_E$)

The central component of the input layer is a giant array of learned parameters.

$$W\_E \in \mathbb{R}^{V \times d\_{model}}$$

* $V$: Vocabulary Size (ex: 50,257 in GPT-2).
* $d\_{model}$: Vector Dimension (ex: 768, 4096, 12288).

This matrix is ​​essentially a **key-value database**.

---

## 8. The Lookup

Mathematically, getting the $t$ token embedding is matrix multiplication.
Let $x$ be a *one-hot* vector (all zeros except a 1 in the ID token position).

$$v = x \cdot W\_E$$

In practice (code), we do not multiply. We just make a *slice* (index) in the matrix. It is an $O(1)$ operation.

---

## 9. What does Embedding represent?

Each dimension of the vector (among the 4096) encodes an abstract semantic characteristic.

* Dimension 12: "Royalty" level.
* Dimension 500: Level of "Plurality".
* Dimension 1024: "Abstraction" level.

*Note: In reality, these features suffer from **Superposition** (Superposition), and one dimension can encode multiple concepts (Polysemanticity).*

---

## 10. The Geometry of Meaning

How do we measure whether two words are synonyms?
We use **Cosine Similarity**.

$$\text{Similarity}(A, B) = \frac{A \cdot B}{||A|| \cdot ||B||} = \cos(\theta)$$

* If they point to the same side ($\theta = 0^\circ$), Cos = 1.
* If they are orthogonal ($\theta = 90^\circ$), Cos = 0 (No relation).
* If they are opposite ($\theta = 180^\circ$), Cos = -1 (Antonyms).

---

## 11. Semantic Linear Arithmetic

The most famous property (Mikolov et al., 2013):

$$E(\text{Rei}) - E(\text{Homem}) + E(\text{Mulher}) \approx E(\text{Rainha})$$

This proves that latent space captures **analog relations** linearly.
The vector $v\_{gender} = E(\text{Woman}) - E(\text{Man})$ is constant across several pairs of words.



---

class: middle, inverse-slide
# Part 3: The Static Paradox
### _Embeddings vs. Contexto_

---

## 12. The Layer 0 Limit

The matrix $W\_E$ is **static**.
This means that the "Manga" token **always has the same initial vector**, no matter the phrase.

* Sentence A: "I ate a sweet **mango**." (Fruit)
* Sentence B: "The **sleeve** of the shirt tore." (Clothing)

At the output of the Embedding layer (before attention), these two tokens are **identical**.

---

## 13. The Transformer's Purpose (Revisited)

If the initial embedding is context-deaf, the job of the Transformer's 96 layers is:
**Contextualize the Vector.**

It must move the "Mango" point in vector space.
* In Sentence A, he pushes the vector in the direction of the concept "Food".
* In Sentence B, he pushes the vector in the direction of the concept "Fabric".

---

## 14. Unembedding Matrix ($W\_U$)

At the end of the network, we have a super-contextualized vector.
We need to turn it back into token probability.
We use matrix $W\_U$ (Unbending).

$$Logits = x\_{final} \cdot W\_U^T$$

Often, $W\_U$ and $W\_E$ share the same weights (**Tied Embeddings**), saving parameters.

---

## 15. Recapping the Data Flow

1. **Text:** "Hello World"
2. **Tokenizer (BPE):** `[15491, 2159]`
3. **One-Hot:** Giant sparse vectors.
4. **Lookup ($W\_E$):** Dense vectors (Embeddings).
5. **Positional Encoding:** Addition of order.
6. **Transformer Blocks:** Processing.

---

## 16. The Agentic Path

Understanding Embeddings is crucial to building modern Agents (RAG).
When we create a "Brain" for a company, we vectorize its documents (PDFs) and search for cosine similarity.
Semantic search technology is just the clever use of the $W\_E$ matrix.

**Next Module:** The Heart of the Machine - **Multi-Head Attention (MHA)**.

---
class: center, middle
# The Geometry is Open
### _Questions about Vector Spaces?_
---
