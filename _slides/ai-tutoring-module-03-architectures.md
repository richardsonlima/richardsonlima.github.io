---
layout: slides
title: "Encoder vs. Decoder: Choosing the Right Engine"
category: "ai-tutoring"
module_number: 3
complexity: "Technical / Architectural"
use_math: true
---

layout: true
class: basic-layout
---

class: center, middle, inverse-slide
# The Agentic Path: Module 03
## Encoder vs. Decoder
### _Choosing the Right Motor: The Geometry of Visibility_

<img src="/assets/article_images/transformer-symphony.jpg" width="150px" style="border-radius: 50%; border: 2px solid #FFD700;"/>

**Richardson Lima**
.footnote[A comparative analysis of BERT, GPT and T5]

---

## The Module Roadmap

The original paper proposed the Encoder-Decoder. But evolution divided the family.

1. **The Schism:** Why did the models split up?
2. **The Central Mechanism:** The Attention Mask.
3. **Encoders (BERT):** Bidirectional Understanding.
4. **Decoders (GPT):** Auto-regressive Generation.
5. **Hybrids (T5/BART):** The best of both worlds?
6. **Engineering Guide:** Which architecture to use for your Agent?

---

class: middle, inverse-slide
# Part 1: The Architectural Schism
### _It all comes down to "Who can see Who"_

---

## 1. O Transformer Original (2017)

The model by Vaswani et al. was made for **Translation** (English $\to$ German).
It had two halves:
1. **Encoder:** Read the sentence in English (Understood the context).
2. **Decoder:** Generated the sentence in German (Produced the future).



---

## 2. Divergent Evolution

Shortly after 2017, researchers realized they could only use half of the model for different tasks.

* **2018 (Google):** Created **BERT** using only the Encoder. "Let's focus on *understanding* text."
* **2018 (OpenAI):** Created **GPT** using only Decoder. "Let's focus on *generating* text."

---

## 3. The Technical Secret: Visibility

The only real difference between Encoder and Decoder (apart from Cross-Attention) is the **Attention Mask**.

It defines which tokens a given token can "look at" during the Self-Attention calculation.

---

class: middle, inverse-slide
# Part 2: Encoder-Only (The BERT Family)
### _The Comprehension Experts_

---

## 4. Bidirectional Architecture

Encoders have **Full Visibility**.
The token at the beginning of the sentence can see the token at the end and vice versa.
$$A\_{ij} \neq -\infty \quad \forall i,j$$

* **Analogy:** Word search or crossword puzzles. You look at the entire grid to discover the meaning.

---

## 5. Masked Language Modeling (MLM)

How do we train an Encoder if it sees everything? We can't ask him to "predict the next word" (he would already be seeing it).

We use **MLM**:
1. Sentence: "The cat climbed onto the roof."
2. Input: "The [MASK] went up to the roof."
3. Objective: Find out who [MASK] is using the context of the left ("O") and the right ("went up").

---

## 6. The Encoder Attention Matrix

The mask array is full of zeros (i.e. no locks).

$$
\text{Mask} =
\begin{bmatrix}
0 & 0 & 0 \\
0 & 0 & 0 \\
0 & 0 & 0
\end{bmatrix}
$$

Everyone serves everyone. $N^2$ active connections.

---

## 7. What are they for? (Use Cases)

Encoders do not generate text (they do not speak). They generate **Rich Embeddings**.
They are ideal for discriminative tasks:

* **Classification:** "Is this email spam?"
* **NER:** "Where are the company names on this contract?"
* **Search/RAG:** "Does this document talk about the same subject as the question?"
* **Sentiment Analysis:** "Is the customer angry?"

---

class: middle, inverse-slide
# Part 3: Decoder-Only (The GPT Family)
### _The Generation Specialists_

---

## 8. Auto-Regressive Architecture

Decoders have **Causal Visibility**.
Token 5 can only see tokens 1, 2, 3 and 4. It is "blind" to the future (6, 7...).

* **Analogy:** Writing a live speech. You only remember what you've already said, not what you're going to say.

---

## 9. Causal Language Modeling (CLM)

The training is simple: **Next Token Prediction**.
Given `[A, B, C]`, predict `D`.

This forces the model to learn statistical probability and cause-and-effect reasoning.

---

## 10. The Decoder Attention Matrix

We use a **Superior Triangular Mask** (Causal Mask).
Future positions are filled with $-\infty$ (which becomes 0 in Softmax).

$$
\text{Mask} =
\begin{bmatrix}
0 & -\infty & -\infty \\
0 & 0 & -\infty \\
0 & 0 & 0
\end{bmatrix}
$$



---

## 11. What are they for? (Use Cases)

Decoders are creators.
* **Text Generation:** Write emails, stories.
* **Chatbots:** Fluid conversation.
* **Code Completion:** GitHub Copilot.
* **Reasoning:** Chain of Thought.

*Note: Today, giant LLMs (GPT-4) are so good that they do the job of Encoders too, but they are more expensive.*

---

class: middle, inverse-slide
# Part 4: Encoder-Decoder (Hybrids)
### _T5, BART and the Original Legacy_

---

## 12. The Best of Both Worlds?

Models like **T5 (Text-to-Text Transfer Transformer)** and **BART** maintain both parts.

1. **Encoder:** Processes the input (Bidirectional) $\to$ Generates a memory.
2. **Decoder:** Generates the output (Auto-regressive) $\to$ Looking at the Encoder memory.

---

## 13. Cross-Attention

Here **Cross-Attention** shines.
The Decoder has attention heads that:
* $Q$ (Query): Comes from Decoder ("What do I need to write now?").
* $K, V$ (Key, Value): Come from the Encoder ("What did it say in the original text?").

---

## 14. Use Ideal Cases

They are perfect for sequence-to-sequence transformation (Seq2Seq):
* **Translation:** English $\to$ French.
* **Summary:** Long Text $\to$ Short Text.

They "read" the entire text first (Encoder) and then "write" the summary (Decoder). GPT, being purely Decoder, sometimes starts summarizing before understanding the end of the text.

---

class: middle, inverse-slide
# Part 5: Engineering Guide
### _Which engine to choose for your Agent?_

---

## 15. The Great Convergence

Currently, the industry is converging on **Decoder-Only** (Llama 3, GPT-4).
Because?
* Scaling Laws favorecem Decoders.
* It is simpler to train an architecture only on massive data.
* With *Instruction Tuning*, Decoders learned to do classification tasks.

---

## 16. When to use Encoder (BERT/RoBERTa) today?

Don't dismiss BERT. He is still king in:
1. **Embeddings for Vector DB:** Modern embedding models (OpenAI text-embedding-3) internally work as Encoders.
2. **Fast Classification:** If you need to classify 1 million tweets per minute, a DistilBERT is 100x cheaper and faster than calling GPT-4.
3. **Entities (NER):** Extract names from legal contracts.

---

## 17. When to use Decoder (GPT/Llama)?

For the Agent’s cognitive core:
1. **Orchestration:** Decide which tool to use.
2. **Response Generation:** Talk to the user.
3. **Complex Reasoning:** Solve logic problems.

---

## 18. Technical Summary

| Feature | Encoder (BERT) | Decoder (GPT) | Enc-Dec (T5) |
| :--- | :--- | :--- | :--- |
| **Visibility** | Bidirectional ($N^2$) | Causal (Triangular) | Hybrid |
| **Training** | Guess the Gap | Predict next | Seq2Seq |
| **Strong in** | Understand, Classify | Create, Reason | Translate, Summarize |
| **Inf. Cost** | Low (Parallel) | High (Serial) | Medium |

---

## 19. The Agentic Path: Decision

For our Agents, we will use:
* **Decoder (LLM):** For the brain (Reasoning).
* **Encoder (Embedding Model):** For memory (RAG).

This combination is the standard 2024/2025 architecture.

**Next Module:** How does the model "act"? **Function Calling & Tool Use**.

---
class: center, middle
# The Geometry is Open
### _Questions about Architecture?_
---