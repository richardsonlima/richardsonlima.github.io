---
layout: slides
title: "Attention Is All You Need"
category: "ai-tutoring"
module_number: 2
complexity: "Foundational / Technical"
---

layout: true
class: basic-layout
---

class: center, middle, inverse-slide
## Whispers of Focus: The .transformers-text[Transformer] Architecture
### _A Deep Dive into the Symphony of Machine Attention_
<img src="/assets/article_images/transformer-symphony.jpg" width="150px" style="border-radius: 50%; border: 2px solid #FFD700;"/>

**Richardson Lima** .footnote[Inspired by Vaswani et al. (2017) | "Attention Is All You Need"]

---

## The Context: Why are we here?

Before 2017, machines "read" sequences much like humans read a physical book: **word-by-word**.

- **RNNs and LSTMs** were sequential chains.
- To understand the last word, the model had to "carry" the weight of the entire journey.
- **The Problem:** Like a game of "telephone", the meaning often got distorted or lost over long sequences (The Vanishing Gradient Problem).

.blue-text[**The Transformer changed the game: It doesn't read in a line; it observes the entire landscape at once.**]

---

class: middle, inverse-slide
## Part 1: The RNN Bottleneck
### _Why the old paradigms had to fall_

---

.left-column[
## The Struggle
]
.right-column-middle[
### 1. The Sequential Trap ($O(n)$)
Computation is locked. You cannot compute step $t$ until $t-1$ is finished. This prevents full parallelization on modern GPUs.

### 2. Vanishing Context
Try remembering a character's name from page 1 after reading 100 pages. RNNs struggle to maintain "Long-term Dependencies".

### 3. Path Length
In RNNs, information must travel $n$ steps. In a Transformer, every word is exactly **one step away** from any other word.
]

---

class: middle, inverse-slide
## Part 2: The Engine of Attention
### _Queries, Keys, and the Mathematical Match_

---

## Scaled Dot-Product Attention
### _The Physics of Focus_

Imagine an orchestra where every musician must adjust their volume based on the structural relevance of every other performer.

$$\text{Attention}(Q, K, V) = \text{softmax}\left(\frac{QK^T}{\sqrt{d_k}}\right)V$$

- **Query (Q):** "What am I looking for?" (e.g., The subject of the action)
- **Key (K):** "What do I offer?" (e.g., I am a verb, I am an entity)
- **Value (V):** The actual information to be transmitted.

**Why scale by $\sqrt{d_k}$?** To prevent dot products from growing too large, pushing the Softmax function into regions with extremely small gradients.

---

## Multi-Head Attention
### _Eight Pairs of Eyes_

Instead of a single attention stream, the model projects $Q, K, V$ into **8 different subspaces** simultaneously.

- **Head 1:** Focuses on grammatical syntax.
- **Head 2:** Focuses on entities (Names, Places).
- **Head 3:** Focuses on temporal references.

**The Result:** A holistic representation where the model understands that "The law" (subject) and "its application" (reference) are tied together, regardless of distance.

---

class: middle, inverse-slide
## Part 3: The Architecture
### _Encoder, Decoder, and Stability_

---

## The Dance of Layers ($N=6$)

.left-column[
### The Encoder
]
.right-column-middle[
**The Attentive Listener:** Transforms tokens into a high-dimensional "map" (512-dimension Embeddings).
- Multi-Head Self-Attention.
- Position-wise Feed-Forward Networks.
]

--

.left-column[
### The Decoder
]
.right-column-middle[
**The Eloquent Speaker:** Generates output token-by-token (Autoregressive).
- Features an extra attention layer to "listen" to the Encoder's map.
- **Masked Attention:** Ensures the model doesn't "peek" at the future during training.
]

---

## Positional Encoding
### _Ordering the Chaos_

Since Transformers process everything at once, they are "blind" to word order. How does it know "Dog bites man" isn't "Man bites dog"?

**Sine and Cosine Waves:**
We inject sine and cosine functions of different frequencies into the data. Each position in the sentence receives a unique "temporal signature".

It is the **GPS of the sentence**: the model uses these waves to reconstruct logical order without needing sequential processing.

---

class: middle, inverse-slide
## Part 4: The Ontological Impact
### _From Translation to Generative Intelligence_

---

## Why did this change everything?

1. **Parallelization:** We now train on trillions of tokens because we no longer wait for the "word-by-word" bottleneck.
2. **Global Context:** A word at the end of a book can attend to a concept at the very beginning instantly.
3. **The Foundation:** This architecture is the "engine" inside **GPT-4, Claude, Gemini, and Sora**.

---

.left-column[
## Summary
]
.right-column-middle[
### The Symphony
- **Attention** is the melody (Focus).
- **Multi-Head** is the harmony (Complexity).
- **Positional Encoding** is the rhythm (Order).

The Transformer proved that with enough data and the right mathematical "focus", machines can begin to mirror the depth of human structural understanding.
]

---
class: center, middle
# The Geometry is Open
### _Questions?_
---