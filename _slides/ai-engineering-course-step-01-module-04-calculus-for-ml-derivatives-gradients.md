---
layout: slides
title: "Calculus for ML: Derivatives & Gradients"
category: "ai-engineering-course-step-01"
module_number: 4
complexity: "Learn"
lesson_type: "Learn"
lang_stack: "🐍"
use_math: true
---

layout: true
class: basic-layout

---

class: center, middle, inverse-slide
# Step 01 - Math Foundations
## Module 04: Calculus for Machine Learning
### _Type: Learn · Lang: Python · Time: ~60 minutes_

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

You have a neural network with millions of weights. Each weight is a knob. You need to figure out which direction to turn every single knob to make the model slightly less wrong. Calculus gives you that direction.

Without calculus, training a neural network would mean trying random changes and hoping for the best. With derivatives, you know exactly how each weight affects the error. You turn every knob the right way, every time.

---

## Objetivos de Aprendizagem ✅

- Compute numerical and analytical derivatives for common ML functions (x^2, sigmoid, cross-entropy)
- Implement gradient descent from scratch to minimize a loss function in 1D and 2D
- Derive the gradient of a linear regression model and train it via manual weight updates
- Explain the Hessian matrix, Taylor series approximations, and their connection to optimization methods

---

## 🧠 What is a derivative?

A derivative measures the rate of change. For a function y = f(x), the derivative f'(x) tells you: if you nudge x by a tiny amount, how much does y change?

Geometrically, the derivative is the slope of the tangent line at a point.

---

## 📐 Partial derivatives: one variable at a time

Real functions have many inputs. A neural network loss depends on thousands of weights. A partial derivative holds all variables constant except one, then takes the derivative with respect to that one.

Each partial derivative answers: if I nudge just this one weight, how does the loss change?

---

## 🔬 The gradient: vector of all partial derivatives

The gradient collects every partial derivative into one vector. For a function f(x, y, z), the gradient is:

The gradient points in the direction of steepest ascent. To minimize a function, go in the opposite direction.

---

## ⚙️ The connection to optimization

Training a neural network is optimization. You have a loss function L(w1, w2, ..., wn) that measures how wrong the model is. You want to minimize it.

The learning rate controls step size. Too big and you overshoot. Too small and you crawl.

---

## 🧩 Numerical vs analytical derivatives

There are two ways to compute a derivative.

Analytical: apply calculus rules by hand. For f(x) = x^2, the derivative is f'(x) = 2x. Exact. Fast.

---

## 🚀 Derivatives by hand for simple functions

These are the derivatives you will see over and over in ML.

For f(x) = x^2:

---

## Hands-on Build Path 🛠️

1. Step 1: Numerical derivative from scratch
2. Step 2: Partial derivatives and gradients
3. Step 3: Gradient descent to find the minimum of f(x) = x^2
4. Step 4: Gradient descent on a 2D function
5. Step 5: Comparing numerical and analytical derivatives
6. Step 6: Computing the Hessian numerically

Prerequisites: Phase 1, Lessons 01-03

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
