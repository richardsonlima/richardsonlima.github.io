---
layout: slides
title: "Linear Algebra Intuition"
category: "ai-engineering-course-step-01"
module_number: 1
complexity: "Learn"
lesson_type: "Learn"
lang_stack: "🐍 🟣"
use_math: true
---

layout: true
class: basic-layout

---

class: center, middle, inverse-slide
# Step 01 - Math Foundations
## Module 01: Linear Algebra Intuition
### _Type: Learn · Lang: Python, Julia · Time: ~60 minutes_

**Richardson Lima**

---

## Journey Map 🗺️

1. Foundations and problem context.
2. Operational intuition of the concept.
3. Mathematical translation for engineering.
4. Usage patterns in AI systems.
5. Practical build with code.
6. Checkpoints for technical mastery.

---

## Why does this matter? 🎯

Open any ML paper. Within the first page, you'll see vectors, matrices, dot products, and transformations. Without linear algebra intuition, these are just symbols. With it, you can see what a neural network is actually doing -- moving points around in space.

You don't need to be a mathematician. You need to see what these operations mean geometrically, then code them yourself.

---

## Learning Objectives ✅

- Implement vector and matrix operations (addition, dot product, matrix multiply) from scratch in Python
- Explain geometrically what the dot product, projection, and Gram-Schmidt process do
- Determine linear independence, rank, and basis of a set of vectors using row reduction
- Connect linear algebra concepts to their AI applications: embeddings, attention scores, and LoRA

---

## 🧠 Vectors Are Points (and Directions)

A vector is just a list of numbers. But those numbers mean something -- they're coordinates in space.

**2D vector [3, 2]:**

---

## 📐 Matrices Are Transformations

A matrix transforms one vector into another. It can rotate, scale, stretch, or project.

In AI, matrices ARE the model:
- Neural network weights → matrices that transform input into output
- Attention scores → matrices that decide what to focus on
- Embeddings → matrices that map words to vectors

---

## 🔬 The Dot Product Measures Similarity

The dot product of two vectors tells you how similar they are.

This is literally how search engines, recommendation systems, and RAG work -- find vectors with high dot products.

---

## ⚙️ Linear Independence

Vectors are linearly independent if no vector in the set can be written as a combination of the others. If v1, v2, v3 are independent, they span a 3D space. If one is a combination of the others, they only span a plane.

Why it matters for AI: your feature matrix should have linearly independent columns. If two features are perfectly correlated (linearly dependent), the model cannot distinguish their effects. This causes multicollinearity in regression -- the weight matrix becomes unstable, and small input changes produce wild output swings.

---

## 🧩 Basis and Rank

A basis is a minimal set of linearly independent vectors that span the entire space. The number of basis vectors is the dimension of the space.

The standard basis for 3D space is {[1,0,0], [0,1,0], [0,0,1]}. But any three independent vectors in 3D form a valid basis. The choice of basis is a choice of coordinate system.

---

## 🚀 Projection

Projecting vector **a** onto vector **b** gives the component of **a** in the direction of **b**:

The residual (a - proj_b(a)) is perpendicular to b. This orthogonal decomposition is the foundation of least-squares fitting.

---

## Hands-on Build Path 🛠️

1. Step 1: Vectors from scratch (Python)
2. Step 2: Matrices from scratch (Python)
3. Step 3: Why this matters for AI
4. Step 4: Julia version
5. Step 5: Linear independence and projection from scratch (Python)

Prerequisites: Phase 0

---

## Mastery Checklist 📌

- I can explain the concept without memorizing formulas.
- I can implement the minimal version in code.
- I can connect the topic to model training/inference.
- I can debug common errors in this topic.

---

## Wrap-up

This module connects mathematical intuition with practical execution.

Next step: move to the next module in the track and reinforce it with quiz exercises.

---
