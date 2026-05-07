---
layout: slides
title: "The Anatomy of Intelligence: Complete Masterclass"
category: "ai-tutoring"
module_number: 1
complexity: "Masterclass (100 Slides) - The Agentic Path"
use_math: true
---

layout: true
class: basic-layout
---

class: center, middle, inverse-slide
# The Anatomy of Intelligence
## Reverse Engineering of LLMs: From RNNs to Induction Heads
### _A Deep Immersion in 100 Slides_

<img src="/assets/article_images/transformer-symphony.jpg" width="150px" style="border-radius: 50%; border: 2px solid #FFD700;"/>

**Richardson Lima**
.footnote[Fontes: Vaswani et al. (2017), Anthropic (2021), 3Blue1Brown]

---

## The Journey Map

Let's dissect modern artificial intelligence into 6 acts:

1. **The Legacy (Slides 1-15):** The death of RNNs and the sequential problem.
2. **The Physics of Data (Slides 16-30):** Tokens and Vector Geometry.
3. **The Bus (Slides 31-45):** The Residual Stream as memory.
4. **The Mechanics (Slides 46-70):** The mathematics of Attention (Q, K, V).
5. **Reasoning (Slides 71-85):** Induction Heads and Algorithms.
6. **The Scale (Slides 86-100):** MLPs, Position and the Future.

---

class: middle, inverse-slide
# Module 1: Legacy and Rupture
### _Why did sequential processing fail?_

---

## 1. How did we read before 2017?

Before Transformer, AI processed text as we humans physically read it: **one word at a time**.

This was done with **RNNs (Recurrent Neural Networks)**. The machine read the word $t$, updated its memory, and went to $t+1$.



---

## 2. The Intuition of Recurrence

Imagine reading an infinite magnetic tape without being able to rewind easily.

You need to store all the information in the sentence in your "short-term memory". If the sentence is long, you start to forget the beginning.

---

## 3. The “Hidden State”

In RNNs, the "memory" is called the hidden state vector, denoted by $h$.

With each new word, this vector is overwritten and updated. It is a continuous compression of data.

---

## 4. The Compression Bottleneck

If the sentence has 100 words, the information from the 1st word needs to survive 99 memory updates to influence the 100th word.

This creates an **information bottleneck**. The context is diluted.

---

## 5. The Mathematics of Recurrence (Shielded)

In classical RNNs, memory updating follows this equation:

$$h\_t = \tanh(W\_{hh} h\_{t-1} + W\_{xh} x\_t)$$

* $h\_t$: New memory (current state).
* $h\_{t-1}$: Old memory (previous state).
* $x\_t$: Current word (input).
* $W$: Learned weight matrices.

---

## 6. The “Cordless Phone” Problem

In one long sentence:
*"The **cat**, which was on the roof... [100 words] ... **fell**."*

For the RNN to connect "fell" with "cat", the signal needs to travel through 100 successive matrix multiplications.

---

## 7. Vanishing Gradient

During training (Backpropagation), we need to calculate the error and go back in time.

If we multiply many small numbers (ex: $0.9 \times 0.9 \times \dots$), the result tends to zero. The computer "forgets" the subject of the sentence.

---

## 8. LSTMs: An Attempt at Salvation

**Long Short-Term Memory (LSTM)** was the evolution of RNNs.
It introduced "gates" to control memory flow.



---

## 9. The Gates of LSTM

* **Forget Gate:** "Should I erase this old memory?"
* **Input Gate:** "Does this new information matter?"
* **Output Gate:** "What should I pass on?"

This improved the forgetting problem, but maintained the sequence problem.

---

## 10. The Computational Problem: Sequentiality

GPUs (video cards) are made for **parallelism**. They love doing 1 million accounts at the same time.

RNNs/LSTMs force the GPU to wait: "Calculate step 1, then 2...". This is inefficient.

---

## 11. CNNs for Text?

They tried to use Convolutional Networks (CNNs), famous in computer vision.
* **Idea:** Sliding window that looks at 3 words at a time.
* **Advantage:** Parallelizable!

---

## 12. The Myopia of CNNs

CNN's problem is **locality**.
She sees neighboring words well, but to connect the first and last words in a book, you need to stack many layers ("magnifying glasses on magnifying glasses").

---

## 13. The Researchers’ Desire

We wanted an architecture with two properties:
1. **Total Parallelism:** Process the entire sentence at once.
2. **Global Connection:** The distance between any pair of words should be 1.

---

## 14. The Birth of the Transformer (2017)

The paper *"Attention Is All You Need"* proposed:
* Throw away the recurrence ($h\_{t-1}$).
* Throw away the convolution.
* Just keep **Attention**.

---

## 15. The Victory of Intelligent Brute Force

Transformer calculates the "all words versus all words" ratio.
This is expensive ($N^2$), but it allows you to understand the global context instantly.



---

class: middle, inverse-slide
# Module 2: The Physics of Data
### _Tokens, Embeddings e Geometria_

---

## 16. The Computer does not read "Apple"

Neural networks are mathematical circuits. They only accept numbers.
The first step is **Tokenization**.

---

## 17. What is a Token?

Text $\to$ Integers (IDs).
A token can be a word, part of a word, or a character.

* "Intelligence" $\to$ `[4521]`
* "Artificial" $\to$ `[982]`

---

## 18. Byte Pair Encoding (BPE)

Algorithm used by GPT. It finds the most statistically common syllables/chunks.
* Advantage: Fixed vocabulary (~50,000 tokens) can represent any text.

---

## 19. The Nuance of Spaces

The token for `"The"` (with space) is different from `"The"` (without space).
The model needs to learn that they are semantically almost identical, spending parameters to do so.

---

## 20. Incorporations: Giving Body to Numbers

An ID like `4521` has no mathematical meaning. We cannot add `4521 + 1`.

We transform this ID into a dense **Embedding Vector**.

---

## 21. The High-Dimensional Vector

In GPT-3, each token is converted to a **12,288-dimensional** vector.
$$x \in \mathbb{R}^{12288}$$
It's a list of 12,288 numbers that describes the "meaning" of that word.



---

## 22. Semantic Geometry

In this space, words with similar meanings are physically close.
The distance (cosine) between "Cat" and "Dog" is small.
The distance between "Cat" and "Blender" is large.

---

## 23. Vector Arithmetic

The famous property of embeddings:
$$V(\text{Rei}) - V(\text{Homem}) + V(\text{Mulher}) \approx V(\text{Rainha})$$

The model learns concepts like "gender" or "plural" as directions in space.

---

## 24. The Embedding Matrix ($W\_E$)

This conversion is done by a giant matrix learned during training.
$$x = t \cdot W\_E$$
Where $t$ is the one-hot vector of the token.

---

## 25. The Problem of Polysemy

In the initial embedding, the word "Bank" has only one vector.
It is an average between "Bank (seat)" and "Bank (money)".
It's static.

---

## 26. The Transformer Goal

The Transformer's entire job is to **disambiguate** this vector.
It must move the vector from "Bank" in the direction of "Money" if the phrase contains "withdrawal" or "investment".

---

## 27. Unembedding ($W\_U$)

At the end of the network, we need to return to words.
We take the final vector and multiply it by the inverse matrix ($W\_U$).
This generates scores for each word in the dictionary.

---

## 28. Logits: O Output Bruto

The result of this multiplication are the **Logits**.
Numbers that represent the "energy" of each possible word.
High logits = Likely word.

---

## 29. Softmax and Odds

We apply the Softmax function to convert logits to percentage (0 to 1).
$$P(x) = \frac{e^{x\_i}}{\sum e^{x\_j}}$$
The sum of all probabilities must be 1.

---

## 30. Sampling (The Choice)

The model does not just choose the highest probability (Greedy).
He draws based on probabilities.
**Temperature** controls how risky this draw is.

---

class: middle, inverse-slide
# Module 3: The Consciousness Bus
### _O Residual Stream_

---

## 31. Revisiting Architecture

Most diagrams show stacked layers. This is confusing.
The best visualization (Anthropic) is the **Residual Stream**.

---

## 32. The Bus Concept

Imagine a data highway that runs from the beginning to the end of the model.
The layers (Attention and MLP) are stations next to this highway.

---

## 33. Reading and Writing

The layers **read** information from the road, process it, and **write** the result back.
They don't block the highway.

---

## 34. The Fundamental Equation: Addition

$$x\_{i+1} = x\_i + \text{Layer}(x\_i)$$

The key is the **plus** sign. The output of the layer is *added* to the original vector.
Original information is never lost.

---

## 35. Working Memory

The Residual Stream acts like short-term memory.
If Layer 1 discovers that "Rio" is a city, it writes that "note" to the stream.
Layer 20 can read this note up front.

---

## 36. Vector Subspaces

The Stream has many dimensions (ex: 4096).
Attention heads work in smaller subspaces (e.g. 64).
Several different pieces of information travel together without mixing.

---

## 37. Orthogonality

Different concepts (Syntax vs. Feeling) can travel in **orthogonal** (perpendicular) directions on the same vector.
They do not collide mathematically.

---

## 38. Bandwidth

The size of the vector ($d\_{model}$) is the "bandwidth" of the intelligence.
If it is too narrow, the model cannot keep many concepts active simultaneously.

---

## 39. Virtual Weights

Since the system is linear (sums), we can mathematically calculate the direct connection between Layer 1 and Layer 12, ignoring the middle.
This helps with reverse engineering.

---

## 40. The Role of Normalization (LayerNorm)

With so many sums, the numbers could explode to infinity.
**LayerNorm** (or RMSNorm) rescales the vector at each step to keep mean and variance stable.

---

## 41. MLP: The Processor

Transformer has two types of blocks: Attention and MLP.
* **Attention:** Moves information (Communication).
* **MLP:** Processes information (Calculation).

---

## 42. Bottleneck Activations

MLPs project the vector to a much larger dimension (4x) to "think", and then compress it back into the stream.
This is where factual knowledge is accessed.

---

## 43. Path Decomposition (Shielded)

$$x\_{final} = x\_{emb} + \sum \text{Heads} + \sum \text{MLPs}$$

The end result is the sum of thousands of small, independent contributions.

---

## 44. Differentiable Programming

We can see the Transformer as a computer program compiled into matrices.
It runs real-time data search and retrieval algorithms.

---

## 45. Bus Summary

* Structure: Linear Highway.
* Operation: Addition ($+$).
* Function: Persistent shared memory.

---

class: middle, inverse-slide
# Module 4: The Mechanics of Attention
### _Q, K, V and the Circuits of the Mind_

---

## 46. The Attention Mechanism

If the Residual Stream is memory, Attention is the ability to **search** that memory.
It is a "Content-Addressable Memory" mechanism.



---

## 47. The Q, K, V Triad

For each token, the attention head generates 3 vectors:
1. **Query ($Q$):** What am I looking for?
2. **Key ($K$):** Who am I (as a tag)?
3. **Value ($V$):** What content do I upload?

---

## 48. Calculating Vectors

They are born from linear projections of the current token ($x$):
$$Q = x W\_Q$$
$$K = x W\_K$$
$$V = x W\_V$$
$W\_Q, W\_K, W\_V$ are the matrices that the model learns during training.

---

## 49. Hash Map Analogy

* **Query:** The search key.
* **Key:** The database index.
* **Value:** The stored data.
Difference: The search is "fuzzy" (approximate), not exact.

---

## 50. The Dot Product

How do we know if the Query matches the Key?
We multiply the vectors!
$$\text{Score} = Q \cdot K^T$$

If the vectors point in the same direction, the score is high.

---

## 51. Scaling Factor

We divide the score by $\sqrt{d\_k}$.
$$\frac{Q \cdot K^T}{\sqrt{d\_k}}$$
This prevents the values ​​from becoming extreme, which would "kill" the gradient during training.

---

## 52. Attention Matrix

We do this for all word pairs.
This generates a $N \times N$ square matrix that shows how much each word cares about the others.

---

## 53. Masking

In GPT (Decoder-only), we cannot see the future.
We apply a triangular mask with $-\infty$ to future positions.
This prevents "gluing".

---

## 54. Softmax: The Focus

We apply the Softmax function to the scores.
$$P = \text{softmax}(\text{Score})$$
Transforms raw scores into probabilities that add up to 1.
Low scores become almost 0 (ignored).

---

## 55. Adding Values

The final step is to multiply this probability by the **Value** vectors ($V$).
$$Output = P \cdot V$$
It is a weighted average. We take 90% of the content from word A and 10% from word B.

---

## 56. The Complete Formula

The most famous equation in modern AI:

$$\text{Attention}(Q, K, V) = \text{softmax}\left(\frac{QK^T}{\sqrt{d\_k}}\right)V$$

---

## 57. Multi-Head Attention

A single attention is not enough. We need multiple perspectives.
* Head 1: Focuses on grammar.
* Head 2: Focuses on rhymes.
* Head 3: Focuses on translation.

---

## 58. Parallelism of Heads

All heads rotate at the same time.
GPT-3 has 96 heads per layer.
They operate in independent subspaces.

---

## 59. Output Matrix ($W\_O$)

The results from all heads are concatenated.
We multiply by the $W\_O$ matrix to mix everything and project back into the Residual Stream dimension.

---

## 60. QK and OV Circuits (Anthropic)

We can decompose the head into two functional circuits:
* **QK Circuit:** Where to look? (Attention Pattern).
* **OV Circuit:** What to move? (Information Transfer).

---

## 61. QK Circuit (Query-Key)

Determines the attention matrix $A$.
$$A = \text{softmax}(x^T W\_Q^T W\_K x)$$
Controls the "affinity" between tokens.

---

## 62. Circuito OV (Output-Value)

Determines the effect on the output.
$$Output = x W\_V W\_O$$
It says: "If I serve this token, I must add vector Y to the stream."

---

## 63. Cross-Attention

Used in Encoder-Decoder (Translation) models.
* **Queries:** Come from the Decoder (text being generated).
* **Keys/Values:** Come from the Encoder (original text).

---

## 64. Self-Attention

Usada no GPT.
Everything comes from the same sequence. The text looks at itself to understand itself.

---

## 65. KV Cache

In inference (chat), so as not to recalculate everything with each new word, we store the Keys and Values ​​passed in RAM memory.
This is **KV Cache**.

---

## 66. Grouped Query Attention (GQA)

Modern technique (Flame 2/3).
Multiple heads share the same Keys and Values ​​to save memory and speed.

---

## 67. Sparse Attention

It tries to reduce the quadratic cost ($N^2$) by only looking at some tokens, not all.
Useful for very long contexts.

---

## 68. Linear Attention

New architectures (Mamba, RWKV) try to eliminate Softmax to have linear cost $O(N)$.

---

## 69. Attention Visualization

Heatmaps show which words "light up" when the model processes a token.
We usually see a focus on the previous word, or on associated nouns.



---

## 70. Attention Summary

* Fuzzy vector search.
* Q searches for K to recover V.
* Multiple heads = Multiple interpretations.

---

class: middle, inverse-slide
# Module 5: The Emergence of Reasoning
### _Reverse Engineering and Induction Heads_

---

## 71. Mechanistic Interpretability

The science of opening the black box.
We try to read the model weights as if they were source code.

---

## 72. Zero Layer Templates 0⃣

Transformer without attention.
Only has Embedding and Unembedding.
It behaves like a **Bigram** model (pure next word statistics).

---

## 73. One Layer Templates 1⃣

With 1 attention layer, the model learns **Skip-Trigrams**.
Patterns of type: `[A] ... [B] -> [C]`.
Ex: "Keep ... at -> bay".

---

## 74. Single Layer Limitation

A layer can only do simple copying and direct associations.
Cannot do complex reasoning or multi-step algorithms.

---

## 75. The Magic of the Second Layer

With 2 layers, the **Composition** appears.
The Layer 2 Head can read the result from the Layer 1 Head.

---

## 76. Induction Heads

The most important circuit discovered to date.
It implements the logic: **"If it happened before, it will happen again"**.
It is the basis of learning in context.



---

## 77. The Induction Algorithm

To predict `[B]` after `[A]`:
1. **Head 1 (Layer 1):** Marks the current occurrence of `[A]`.
2. **Head 2 (Layer 2):** Searches in the past where `[A]` appeared.
3. **Action:** Look at the token next to the old `[A]` (which was `[B]`) and copy it.

---

## 78. In-Context Learning

This is why Few-Shot Prompting works.
When we give examples, the Induction Heads recognize the repeating pattern and complete the task.
The model "learns" without updating its weights.

---

## 79. Few-Shot Learning

* **Zero-shot:** No examples.
* **Few-shot:** With examples.
Induction Heads are the mechanical engine behind the improvement in Few-shot.

---

## 80. Phase Change in Training

During training, the model goes through an abrupt transition.
Suddenly, he learns to form Induction Heads.
At that moment, the "Loss" drops drastically.

---

## 81. Reasoning vs Copying

Induction Heads explain smart copy.
For complex reasoning (math, logic), it is believed that there are much deeper compositions of heads and MLPs.

---

## 82. Model Debugging

We can identify when the model hallucinates because an Induction Head "pasted" the wrong information from a previous context.

---

## 83. Scientific Prompt Engineering

Understanding Induction Heads helps us write better prompts.
We know that clear examples activate these specific circuits.

---

## 84. Universal Circuits

Induction Heads appear on all large LLMs, regardless of architecture.
It appears to be a fundamental structure of sequence intelligence.

---

## 85. Summary of Reasoning

* 1 Layer = Statistics.
* 2+ Layers = Algorithms.
* Induction Heads = Engine of learning in context.

---

class: middle, inverse-slide
# Module 6: Vital Components & The Future
### _MLPs, Position and Scale_

---

## 86. O Papel das MLPs (Feed Forward)

MLPs contain 2/3 of the model parameters.
They function as **Associative Key-Value Memories**.

---

## 87. Factual Memory

Research suggests that MLPs store facts.
* First layer neurons detect patterns ("Harry Potter Pattern").
* Second layer neurons write facts ("Suggest: Hogwarts").

---

## 88. Positional Encoding

Since the Transformer is parallel, it doesn't know the word order.
"The dog bit the man" = "The man bit the dog" for him, without encoding.
We need to inject position.

---

## 89. Senoidal (Original)

Vaswani used wave frequencies (Sine/Cosine) added to the embedding.
Each position has a unique signature.

---

## 90. Rotary Embeddings (RoPE)

A modern technique (Flame).
Instead of adding, we **rotate** the vector in the complex plane.
Rotation encodes the relative distance between tokens very efficiently.

---

## 91. Scaling Laws

There is a precise mathematical relationship (Power Law) between:
1. Quantity of Data.
2. Number of Parameters.
3. Computing Power.
4. Performance (Loss).

---

## 92. Compute-Optimal (Chinchilla)

For a given computing budget, there is an optimal model size.
Many older models were too big and undertrained.
Today we train smaller models for much longer (Llama 3).

---

## 93. Infinite Context?

Techniques like Ring Attention attempt to increase the context window to millions of tokens.
The challenge is the quadratic cost of attention.

---

## 94. RAG (Retrieval-Augmented Generation)

A way to give "infinite memory" without increasing the window.
We search for relevant documents in a vector database and insert them into the prompt.

---

## 95. Chain of Thought (CoT)

Force the model to "think step by step".
This gives more computing time (more tokens) for the model to solve difficult problems before giving the final answer.

---

## 96. Hallucination

The model predicts the *probable*, not the truth.
If the internet tells a lot of lies about a subject, the model will reproduce it.
It's a statistical feature, not a simple bug.

---

## 97. The Future: Multimodality

Transformers now process images, audio and video (Sora, Gemini).
Everything is tokenized and processed by the same Attention architecture.

---

## 98. System 1 vs System 2

Current LLMs are "System 1" (Quick Thinking, Intuitive).
The future seeks "System 2" (Slow, deliberative thinking, with tree search and verification).

---

## 99. The Convergence

The Transformer became the universal architecture.
From biology (AlphaFold) to code, the same attention equation solves different problems.

---

## 100. The Agentic Path

You now understand the machine from the inside.
It's not magic. It's linear algebra, statistics and scaling.
The next step is to build agents that use this intelligence.

**End of Masterclass.**

---
