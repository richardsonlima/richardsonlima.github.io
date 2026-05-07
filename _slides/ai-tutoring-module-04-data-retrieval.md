---
layout: slides
title: "Data Retrieval Systems: Building External Memory for AI"
category: "ai-tutoring"
module_number: 4
complexity: "Intermediate / Systems"
use_math: true
---

layout: true
class: basic-layout
---

class: center, middle, inverse-slide
# The Agentic Path: Module 04
## Data Retrieval Systems
### _Building External Memory for AI (RAG & Vector DBs)_

<img src="/assets/article_images/transformer-symphony.jpg" width="150px" style="border-radius: 50%; border: 2px solid #FFD700;"/>

**Richardson Lima**
.footnote[The systems architecture behind RAG and Semantic Search]

---

## The Module Roadmap

The Transformer is a genius, but he has amnesia (he doesn't remember the past conversation) and is frozen in time (Knowledge Cutoff).
We need to give him access to fresh data.

1. **The Context Problem:** Parametric vs. Parametric Memory Non-Parametric.
2. **RAG (Retrieval-Augmented Generation):** The architectural pattern.
3. **Intake Engineering:** Chunking and Overlap.
4. **Vector Databases:** The semantic search engine.
5. **Indexing Algorithms:** KNN vs. ANN (HNSW).
6. **Advanced Retrieval:** Hybrid Search and Re-ranking.

---

class: middle, inverse-slide
# Part 1: The Paradox of Memory
### _Why doesn't GPT know who you are?_

---

## 1. Parametric Memory (The Weight)

LLM knowledge is "baked" in pesos ($W$).
* **Advantage:** Immediate access, integrated reasoning.
* **Disadvantage:** Immutable. To teach something new, you need to train (expensive) or do *Fine-Tuning* (slow).
* **Analogy:** A printed book. It does not change after it is published.

---

## 2. Non-Parametric Memory (The Context)

We can inject knowledge at the time of inference, via **Prompt**.
* **Advantage:** Updateable in real time.
* **Disadvantage:** Limited by the Context Window.

The challenge of modern engineering is: **How ​​to select the most relevant 10kb of text from a 1TB database to put in the prompt?**

---

class: middle, inverse-slide
# Part 2: RAG Architecture
### _Retrieval-Augmented Generation_

---

## 3. The RAG Flow

Lewis et al. (2020) defined this standard. Instead of asking the model directly:

1. **Query:** User asks a question.
2. **Retrieve:** The system searches for relevant documents in the DB.
3. **Augment:** The system pastes these documents into the prompt.
4. **Generate:** LLM responds based *only* on the context provided.



---

## 4. The Ingestion Pipeline (ETL)

Before searching, we need to index.
Unstructured data (PDFs, HTML, Markdown) needs to be cleaned and broken down.

**Garbage In, Garbage Out:** If you index footers, site menus, or strange characters, the search will fail.

---

## 5. The Art of Chunking

How do we divide the text?
* **Fixed Size:** Every 512 tokens. (Gross, cuts sentences in the middle).
* **Recursive:** Respects paragraphs and punctuation. (Better).
* **Semantic Chunking:** Breaks when the topic changes (using embeddings to detect topic transition).

**Overlap:** We always maintain an overlap (e.g. 50 tokens) between chunks so as not to lose context at the edges.

---

class: middle, inverse-slide
# Part 3: The Search Engine
### _Vector Databases and Algorithms_

---

## 6. The Vector Bank (Vector DB)

Unlike SQL (rows/columns) or NoSQL (JSON), Vector DB stores **Float Arrays**.
* Pinecone, Weaviate, Kite, Qdrant, pgvector.

The main operation is not `WHERE id = 1`, but rather `ORDER BY similarity LIMIT k`.

---

## 7. The Scale Problem: KNN

To find the nearest neighbor (**K-Nearest Neighbors**), we need to compare the Query with **all** of the vectors in the bank.
Complexity: $O(N \cdot d\_{model})$.

If $N = 1,000,000$ and $d = 1536$, this is too slow for real time (milliseconds).

---

## 8. The Solution: ANN (HNSW)

We use **Approximate Nearest Neighbors**. We accept 99% accuracy for 100x speed.

The default algorithm is **HNSW (Hierarchical Navigable Small World)**.
* Creates a multi-layer graph (such as express highways and local streets).
* Search complexity: $O(\log N)$.
* Allows you to search billions of vectors in milliseconds.



---

class: middle, inverse-slide
# Part 4: Advanced Retrieval Strategies
### _Beyond the search for similarity_

---

## 9. The Limit of Semantic Search

Embeddings capture *concepts* but fail on *exact keywords*.
* Query: "Error in module SKU-992".
* Semantic Search: Returns documents about "Errors in inventory modules" (Concept), but may miss the specific ID "SKU-992".

---

## 10. Hybrid Search (The Best of Both Worlds)

We combine two algorithms:
1. **Dense Retrieval:** Embeddings (Cosine) $\to$ Understands the intent.
2. **Sparse Retrieval:** BM25 (modern TF-IDF) $\to$ Understands exact keywords.

We combine the results using a fusion algorithm (Reciprocal Rank Fusion - RRF).

---

## 11. The Re-Ranking Process

The vector search is fast (Bi-Encoder), but not very accurate for fine nuances.
**Re-Ranking** adds a refinement step:

1. **Retrieve:** Vector DB fetches 100 candidate documents (Fast).
2. **Re-Rank:** A Cross-Encoder model reads the Query + Document and gives a relevance score (Slow but accurate).
3. **Select:** We take the Top 5 for the LLM.

---

## 12. Lost in the Middle Phenomenon

Research shows that LLMs pay more attention to the beginning and end of context.
Information in between is often forgotten.

**Strategy:** Order the retrieved chunks so that the most relevant ones are at the ends of the prompt, not in the middle.

---

## 13. Agents and Tools

In an agentic architecture, "Retrieval" is just another **Tool**.
The Agent decides:
* "Do I need to look in the technical manual?" (Retrieval Tool).
* "Or do I already know the answer?" (Parametric Memory).

This decouples knowledge from logic.

---

## 14. Conclusion: Context Engineering

Building a chat with your PDF is easy (Hello World).
Building an enterprise search system requires:
* Smart chunking.
* Hybrid Search.
* Re-ranking.
* Assessment (RAGAS framework).

**Next Module:** Linking arms with the brain - **Function Calling & Tool Use**.

---
class: center, middle
# The Geometry is Open
### _Questions about RAG and Vector DBs?_
---