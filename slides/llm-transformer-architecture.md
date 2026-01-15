class: center, middle, inverse-slide
## Whispers of Focus: The .transformers-text[Transformer] Architecture
### _A Deep Dive into the Symphony of Machine Attention_
<img src="/assets/article_images/transformer-symphony.jpg" width="150px" style="border-radius: 50%;"/>

**Richardson Lima** .footnote[Inspired by Vaswani et al. (2017) | "Attention Is All You Need"]

---
## The Context: Why are we here?

Before 2017, machines "read" like humans read a physical book: **word-by-word**.

- **RNNs and LSTMs** were sequential chains.
- To understand the last word of a sentence, the model had to remember everything that came before.
- **The Problem:** Like a game of "telephone", the meaning often got distorted or lost over long distances.

.blue-text[**The Transformer changed the game: It doesn't read in a line; it looks at the whole page at once.**]

---
class: middle, inverse-slide
## Part 1: The RNN Bottleneck 🧱
### _Why the old ways had to die_
---
.left-column[
## The Struggle
]
.right-column-middle[
### 1. The Sequential Trap
You cannot compute word #10 until word #9 is finished. This makes training on modern GPUs incredibly slow.

### 2. Vanishing Context
Try to remember the first name mentioned in a 50-page chapter. RNNs struggle with this "Long-term Dependency" problem.

### 3. The "Information Bottleneck"
We tried to squeeze the meaning of an entire sentence into one single, fixed-size vector.
]

---
class: middle, inverse-slide
## Part 2: Enter the .transformers-text[Self-Attention] 🧠
### _The "Crowded Room" Analogy_
---
## How Attention Works

Imagine you are in a **crowded party**. 10 people are talking at once. 

1. Your ears hear all the sound (Input).
2. Your brain filters out 90% of the noise.
3. You **attend** only to the person talking to you.

**In Transformers, words do the same:**
Every word in a sentence "looks" at every other word to decide which one is most relevant to its own meaning.

---
.left-column[
## The Math of Focus
]
.right-column-middle[
### The Query, Key, and Value (Q, K, V)

- **Query ($Q$):** "What am I looking for?" (The current word).
- **Key ($K$):** "What do I offer?" (The label of other words).
- **Value ($V$):** "What information do I have?" (The content).



$$Attention(Q, K, V) = \text{softmax}\left(\frac{QK^T}{\sqrt{d_k}}\right)V$$

**Translation:** We multiply Query and Key to find the "score" (relevance), then use that score to weight the Values.
]

---
.left-column[
## Multi-Head Attention
]
.right-column-middle[
### Why "Multi-Head"?

If you look at the sentence *"The animal didn't cross the street because it was too tired"*, your brain does two things:
1. One "head" realizes **"it"** refers to the **animal**.
2. Another "head" realizes **"tired"** is the **reason**.

By having 8 or 16 heads working in parallel, the model captures **grammar, meaning, and context** all at the same time.


]

---
class: middle, inverse-slide
## Part 3: The Architecture 🏗️
### _Encoder, Decoder, and the Sine Waves_
---
.left-column[
## The Components
]
.right-column-middle[
### 1. Positional Encoding
Since Transformers process everything at once, they don't know the "order" of words. 
We add **Sine and Cosine waves** to the data to give each word a "GPS coordinate" in the sentence.

### 2. The Encoder (The Listener)
Reads the input and creates a high-dimensional "map" of how words relate to each other.

### 3. The Decoder (The Speaker)
Uses the Encoder's map to generate an output (like a translation), predicting the next word based on all previous words it has already spoken.
]

---
class: middle, inverse-slide
## Part 4: The Impact 🚀
### _From Translation to AGI_
---
## Why did this change the world?

1. **Parallelization:** We can now train on trillions of words because we don't wait for word-by-word processing.
2. **Global Reach:** A word at the end of a book can attend to a word at the very beginning instantly.
3. **The Foundation:** This architecture is the "engine" inside:
    - **BERT** (Understanding)
    - **GPT-3 / GPT-4** (Generation)
    - **Stable Diffusion** (Images)

---
.left-column[
## Summary
]
.right-column-middle[
### The Symphony
- **Attention** is the melody (Focus).
- **Multi-Head** is the harmony (Complexity).
- **Positional Encoding** is the rhythm (Order).

The Transformer proved that with enough data and the right mathematical "focus", machines can begin to mirror human understanding.
]

---
class: center, middle
# The Floor is Yours
### _Questions?_

[https://www.richardsonlima.com.br](https://www.richardsonlima.com.br)