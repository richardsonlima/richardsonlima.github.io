---
layout: slides
title: "The Big Picture: From Logic to Generative Agents"
category: "ai-tutoring"
module_number: 0
complexity: "Strategic Overview"
use_math: true
---

layout: true
class: basic-layout
---

class: center, middle, inverse-slide
# The Agentic Path: Strategic View
## From the Logic Paradigm to Generative Agents
### _The evolution of Software Engineering from 1.0 to 2.0_

<img src="/assets/article_images/transformer-symphony.jpg" width="150px" style="border-radius: 50%; border: 2px solid #FFD700;"/>

**Richardson Lima**
.footnote[A technical analysis of the transition from symbolic to connectionist systems]

---

## The Technological Context

Before diving into Transformer architecture, it is crucial to align on the current **paradigm shift**.

**Technical View:** Understand the transition from explicit rule-based systems to learned probabilistic systems.
**Strategic View:** Analyze why "Software 2.0" (Karpathy) fundamentally changes how we approach NP-hard problems and complex automation.

**Session Agenda:**
1.  Limits of Symbolic Logic (Software 1.0).
2.  Polanyi's Paradox and Complexity.
3.  The Deep Learning Era (Software 2.0).
4.  The Generative Leap: From Classifiers to Creators.
5.  The Frontier: Autonomous Agents.

---

class: middle, inverse-slide
# Part 1: The Logic Era
### _Limits of Determinism in Software 1.0_

---

## 1. The Legacy: Aristotelian and Boolean Logic

Historically (1950-2010), computing operated under **explicit rules**.
The engineer acted as the system's legislator, defining axioms.

* **If** (temperature > 30) **Then** (turn_on_air_conditioning).
* **If** (user == "admin") **Then** (grant_access).

This model is **Symbolic Logic**. It is deterministic, auditable, and ideal for transactional systems and basic physics.



[Image of boolean logic gates diagram AND OR NOT]


---

## 2. The Explicit Rule Barrier

The model breaks when we try to encode unstructured perception, such as distinguishing a **cat** from a **dog**.

* `if (has_pointy_ears)`? (False positive with huskies).
* `if (has_whiskers)`? (Generic false positive).
* `if (meows)`? (Visual data has no audio).

The combinatorial explosion of rules makes maintenance infeasible in real-world scenarios.

---

## 3. Polanyi's Paradox

Philosopher Michael Polanyi defined the fundamental bottleneck:
> *"We know more than we can tell."*

We recognize faces instantly, yet cannot fully formalize the cognitive algorithm step by step.

If we cannot explain the rule, we cannot program it in the Software 1.0 paradigm. This contributed to the "AI Winter" in the 1980s.

---

class: middle, inverse-slide
# Part 2: The Learning Era
### _Software 2.0 and Rule Inference_

---

## 4. Inversion of Control: Machine Learning

The fundamental shift: instead of programming **rules**, we provide **data** and **expected outputs**.
The system infers the rules.

* **Traditional:** Input + Rules $\to$ Output.
* **Machine Learning:** Input + Output $\to$ **Rules**.

Andrej Karpathy defines this as **Software 2.0**. The source code is no longer C++; it becomes the dataset. The compiler becomes the optimizer (SGD).

---

## 5. Architectural Inspiration: The Artificial Neuron

Biological mimicry for parallel processing.
* Replacing `if/else` with continuous activations.
* The **Perceptron**: a function that aggregates weighted signals.

$$y = f(\sum (w\_i \cdot x\_i) + b)$$

The "decision" emerges from the sum of thousands of weighted micro-decisions, not from a single logical branch.



---

## 6. Deep Learning: Hierarchy of Abstraction

Generalization ability emerges from depth (**Deep** Learning).

* **Layer 1:** Edge/frequency detection.
* **Layer 2:** Primitive geometric shapes.
* **Layer 3:** Object components.
* **Final Layer:** Semantic classification.

The system builds internal representations of the world without explicit human intervention.

---

class: middle, inverse-slide
# Part 3: The Generative Leap
### _Distribution Modeling and Creation_

---

## 7. Discriminative AI vs. Generative AI

Until around 2020, the state of the art was **discriminative** (analysis).
* Fraud detection (Yes/No).
* Image diagnosis.
* Churn prediction.

The limit: the system could not **synthesize** new data.

---

## 8. The Generative Revolution

GenAI focuses on learning the underlying **probability distribution** of data ($P(x)$).

* By processing millions of images, the model learns the mathematical manifold of what constitutes an "object".
* Inference becomes sampling from that distribution to generate novel instances.

---

## 9. Large Language Models (LLMs)

The same concept applied to language.
The training objective is simple: **next-token prediction**.

To predict the next word with high accuracy across contexts, the model is forced to internalize:
* Syntax and semantics.
* Formal logic.
* World knowledge.
* Reasoning patterns.

**Thesis:** Efficient data compression is a proxy for general intelligence.

---

class: middle, inverse-slide
# Part 4: Agentic Architecture
### _The Path to Autonomy_

---

## 10. The Limitation of the Passive Model

Models like base ChatGPT operate in passive mode.
Input $\to$ Processing $\to$ Output.
There is no persistence, no interaction with the external environment, and no autonomous feedback loop.

---

## 11. Definition of an Autonomous Agent

An agent is a composite architecture where the LLM is the processing core.

1.  **Perception:** Multimodal input (logs, docs, web).
2.  **Brain (LLM):** Planning and task decomposition.
3.  **Tools:** Code execution, APIs, SQL.
4.  **Action:** Applying changes in the environment.

**Control Loop:** Perceive $\to$ Reason $\to$ Act $\to$ Evaluate.



---

## 12. The "Agentic Path" Framework

This technical track targets robust systems building, split into layers of competence:

* **Layer 1 (Core):** Transformer architecture and attention mechanisms.
* **Layer 2 (Memory):** Embeddings and vector databases.
* **Layer 3 (Reason):** Chain of Thought and planning.
* **Layer 4 (Interface):** Function calling and tool use.

---

## 13. Conclusion: Prompt as a High-Level Language

We are observing a rise in the level of abstraction.
In Software 1.0, syntax was rigid (Python/Java).
In Software 2.0, syntax is natural (human language), but engineering logic remains.

The prompt is the code. The Transformer is the CPU.
The engineering challenge shifts from syntax to semantics and context architecture.

---

## 14. Next Steps: Deep Dive into Architecture

With the concept of agents established, we need to understand the engine that enables this technology.

Up next: **"Attention Is All You Need"**.
We will reverse-engineer the Transformer and analyze the mathematics of attention.

---
class: center, middle
# The Geometry is Open
### _Discussion and Questions_
---
