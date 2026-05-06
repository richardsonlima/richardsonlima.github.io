---
layout: slides
title: "Chain Rule & Automatic Differentiation"
category: "ai-engineering-course-step-01"
module_number: 5
complexity: "Build"
lesson_type: "Build"
lang_stack: "🐍"
use_math: true
---

layout: true
class: basic-layout

---

class: center, middle, inverse-slide
# Step 01 - Math Foundations
## Module 05: Chain Rule & Automatic Differentiation
### _Type: Build · Lang: Python · Time: ~90 minutes_

**Richardson Lima**

---

## O Mapa da Jornada 🗺️

1. Fundamentos e contexto do problema.
2. Intuição operacional do conceito.
3. Tradução matemática para engenharia.
4. Padrões de uso em sistemas de IA.
5. Construção prática com código.
6. Checkpoints para domínio técnico.

---

## Por que isso importa? 🎯

You can compute derivatives of simple functions. But a neural network is not a simple function. It is hundreds of functions composed together: matrix multiply, add bias, apply activation, matrix multiply again, softmax, cross-entropy loss. The output is a function of a function of a function.

To train the network, you need the gradient of the loss with respect to every single weight. Doing this by hand is impossible for millions of parameters. Doing it numerically (finite differences) is too slow.

---

## Objetivos de Aprendizagem ✅

- Build a minimal autograd engine (Value class) that records operations and computes gradients via reverse-mode autodiff
- Implement forward and backward passes through a computation graph using topological sort
- Construct and train a multi-layer perceptron on XOR using only the from-scratch autograd engine
- Verify autodiff correctness using gradient checking against numerical finite differences

---

## 🧠 The Chain Rule

If `y = f(g(x))`, the derivative of `y` with respect to `x` is:

Multiply the derivatives along the chain. Each link contributes its local derivative.

---

## 📐 Computational Graphs

A computational graph makes the chain rule visual. Every operation becomes a node. Data flows forward through the graph. Gradients flow backward.

**Forward pass (compute values):**

---

## 🔬 Forward Mode vs Reverse Mode

There are two ways to apply the chain rule through a graph.

**Forward mode** starts at the inputs and pushes derivatives forward. It computes `dx/dx = 1` and propagates through each operation. Good when you have few inputs and many outputs.

---

## ⚙️ Dual Numbers for Forward Mode

Forward mode can be implemented elegantly with dual numbers. A dual number has the form `a + b*epsilon` where `epsilon^2 = 0`.

Seed the input variable with derivative 1. The derivative propagates automatically through every operation.

---

## 🧩 Building an Autograd Engine

An autograd engine needs three things:

1. **Value wrapping.** Wrap every number in an object that stores its value and gradient.
2. **Graph recording.** Every operation records its inputs and the local gradient function.
3. **Backward pass.** Topological sort the graph, then walk it in reverse, applying the chain rule at each node.

---

## Hands-on Build Path 🛠️

1. Step 1: The Value class
2. Step 2: Arithmetic operations with gradient tracking
3. Step 3: The backward pass
4. Step 4: More operations for a complete engine
5. Step 5: Mini MLP from scratch
6. Step 6: Gradient checking

Prerequisites: Phase 1, Lesson 04 (Derivatives & Gradients)

---

## Checklist de Domínio 📌

- Eu consigo explicar o conceito sem decorar fórmulas.
- Eu consigo implementar a versão mínima no código.
- Eu consigo conectar o tema com treino/inferência de modelos.
- Eu consigo depurar erros comuns desse tópico.

---

## Fechamento

Este módulo conecta intuição matemática com execução prática.

Próximo passo: avançar para o próximo módulo da trilha e consolidar com exercícios do quiz.

---
