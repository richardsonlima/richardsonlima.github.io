---
layout: slides
title: "Optimization: Gradient Descent Family"
category: "ai-engineering-course-step-01"
module_number: 8
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
## Module 08: Optimization
### _Type: Build · Lang: Python · Time: ~75 minutes_

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

You have a loss function. It tells you how wrong your model is. You have gradients. They tell you which direction makes the loss worse. Now you need a strategy for walking downhill.

The naive approach is simple: move opposite the gradient. Scale the step by some number called the learning rate. Repeat. This is gradient descent, and it works. But "works" has caveats. Too large a learning rate and you overshoot the valley entirely, bouncing between walls. Too small and you crawl toward the answer over thousands of unnecessary steps. Hit a saddle point and you stop moving even though you have not found a minimum.

---

## Objetivos de Aprendizagem ✅

- Implement vanilla gradient descent, SGD with momentum, and Adam from scratch
- Compare optimizer convergence on the Rosenbrock function and explain why Adam adapts per-weight learning rates
- Distinguish convex from non-convex loss landscapes and explain the role of saddle points in high dimensions
- Configure learning rate schedules (step decay, cosine annealing, warmup) for training stability

---

## 🧠 What optimization means

Optimization is finding the input values that minimize (or maximize) a function. In machine learning, the function is the loss. The inputs are the model's weights. Training is optimization.

---

## 📐 Gradient descent (vanilla)

The simplest optimizer. Compute the gradient of the loss with respect to every weight. Move each weight in the opposite direction of its gradient. Scale the step by the learning rate.

That is the entire algorithm. One line.

---

## 🔬 Learning rate: the most important hyperparameter

The learning rate controls step size. It determines everything about convergence.

There is no formula for the right learning rate. You find it by experiment. Common starting points: 0.001 for Adam, 0.01 for SGD with momentum.

---

## ⚙️ SGD vs batch vs mini-batch

Vanilla gradient descent computes the gradient over the entire dataset before taking one step. This is called batch gradient descent. It is stable but slow.

Stochastic gradient descent (SGD) computes the gradient on a single random sample and steps immediately. It is noisy but fast.

---

## 🧩 Momentum: the ball rolling downhill

Vanilla gradient descent only looks at the current gradient. If the gradient zigzags (common in narrow valleys), progress is slow. Momentum fixes this by accumulating past gradients into a velocity term.

The analogy: a ball rolling downhill. It does not stop and restart at every bump. It builds speed in consistent directions and dampens oscillations.

---

## 🚀 Adam: adaptive learning rates

Different weights need different learning rates. A weight that rarely gets large gradients should take bigger steps when it finally does. A weight that gets huge gradients constantly should take smaller steps.

Adam (Adaptive Moment Estimation) tracks two things per weight:

---

## Hands-on Build Path 🛠️

1. Step 1: Define a test function
2. Step 2: Vanilla gradient descent
3. Step 3: SGD with momentum
4. Step 4: Adam
5. Step 5: Run and compare

Prerequisites: Phase 1, Lessons 04-05 (Derivatives, Gradients)

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
