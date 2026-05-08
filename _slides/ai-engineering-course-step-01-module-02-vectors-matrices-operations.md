---
layout: slides
title: "Vectors, Matrices & Operations"
category: "ai-engineering-course-step-01"
module_number: 2
complexity: "Build"
lesson_type: "Build"
lang_stack: "🐍 🟣"
use_math: true
---

layout: true
class: basic-layout

---

class: center, middle, inverse-slide
# Step 01 - Math Foundations
## Module 02: Vectors, Matrices & Operations
### _Type: Build · Lang: Python, Julia · Time: ~60 minutes_

**Richardson Lima**

---

## The Journey Map

1. The problem framing and motivation.
2. Core mathematical intuition and geometry.
3. Formal equations and engineering interpretation.
4. AI system connections and production relevance.
5. Build path with practical implementation.
6. Mastery checkpoints and transfer to the next module.

---

## Why does this matter? 🎯

You want to build a neural network. You read the code and see this:

That `@` is matrix multiplication. The `weights` are a matrix. The `input` is a vector. If you do not know what those operations do, this line is magic. If you do know, it is the entire forward pass of a layer in three operations.

---

## Learning Objectives ✅

- Build a Matrix class with element-wise operations, matrix multiplication, transpose, determinant, and inverse
- Distinguish element-wise multiplication from matrix multiplication and explain when each applies
- Implement a single dense neural network layer (`relu(W @ x + b)`) using only the from-scratch Matrix class
- Explain broadcasting rules and how bias addition works in neural network frameworks

---

## 🧠 Vectors: ordered lists of numbers

A vector is a list of numbers with a direction and magnitude. In AI, vectors represent data points, features, or parameters.

A 2D vector `[3, 4]` points to coordinates (3, 4) on a plane. Its length (magnitude) is 5 (the 3-4-5 triangle).

---

## 📐 Matrices: grids of numbers

A matrix is a 2D grid. Rows and columns. An m x n matrix has m rows and n columns.

In neural networks, weight matrices transform input vectors into output vectors. A layer with 784 inputs and 128 outputs uses a 128x784 weight matrix.

---

## 🔬 Why shapes matter

Matrix multiplication has a strict rule: `(m x n) @ (n x p) = (m x p)`. The inner dimensions must match.

If you get a shape mismatch error in PyTorch, this is why.

---

## ⚙️ The operations map

| Operation | What it does | Neural network use |
-------------
| Addition | Element-wise combine | Adding bias to output |
| Scalar multiply | Scale every element | Learning rate * gradients |
| Matrix multiply | Transform vectors | Layer forward pass |
| Transpose | Flip rows and columns | Backpropagation |
| Determinant | Single number summary | Checking invertibility |
| Inverse | Undo a transformation | Solving linear systems |
| Identity | Do-nothing matrix | Initialization, residual connections |

---

## 🧩 Element-wise vs matrix multiplication

This distinction trips up beginners constantly.

Element-wise: multiply matching positions. Both matrices must be the same shape.

---

## Hands-on Build Path 🛠️

1. Step 1: Vector class
2. Step 2: Matrix class with core operations
3. Step 3: See it work
4. Step 4: Connect to neural networks

Prerequisites: Phase 1, Lesson 01 (Linear Algebra Intuition)

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
