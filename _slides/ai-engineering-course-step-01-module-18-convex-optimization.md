---
layout: slides
title: "Convex Optimization"
category: "ai-engineering-course-step-01"
module_number: 18
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
## Module 18: Convex Optimization
### _Type: Build · Lang: Python · Time: ~90 minutes_

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

Lesson 08 taught you gradient descent, momentum, and Adam. Those optimizers walk downhill on any surface. But they come with no guarantees. Gradient descent on a non-convex landscape might land in a bad local minimum, get stuck on a saddle point, or oscillate forever. You used it anyway because neural networks are non-convex and there is no alternative.

But many problems in machine learning are convex. Linear regression, logistic regression, SVMs, LASSO, ridge regression. For these, something stronger exists: optimization with mathematical guarantees. A convex problem has exactly one valley. Any algorithm that walks downhill will reach the global minimum. No restarts needed. No learning rate schedules. No prayer.

---

## Learning Objectives ✅

- Test whether a function is convex using the definition, second derivative, and Hessian criteria
- Implement Newton's method and compare its quadratic convergence against gradient descent
- Solve constrained optimization problems using Lagrange multipliers and interpret KKT conditions
- Explain why neural network loss landscapes are non-convex yet SGD still finds good solutions

---

## 🧠 Convex sets

A set S is convex if for any two points in S, the line segment between them also lies entirely in S.

| Convex sets | Not convex |
---|
| **Rectangle**: any two points inside can be connected by a line segment that stays inside | **Star/crescent shape**: a line between two interior points can pass outside the set |
| **Triangle**: same property holds for all interior points | **Donut/annulus**: the hole means some line segments leave the set |
| The line segment between any two points stays within the set | The line segment between some pairs of points exits the set |

---

## 📐 Convex functions

A function f is convex if its domain is a convex set and for any two points x, y in its domain and any t in [0, 1]:

Geometrically: the line segment between any two points on the graph lies above or on the graph.

---

## 🔬 Testing for convexity

Three practical tests, from easiest to most rigorous.

**Test 1: Second derivative test (1D).** If f''(x) >= 0 for all x, then f is convex.

---

## ⚙️ Why convexity matters

The central theorem of convex optimization:

**For a convex function, every local minimum is a global minimum.**

---

## 🧩 Convex vs non-convex in ML

| Problem | Convex? | Why |
---------
| Linear regression (MSE) | Yes | Loss is quadratic in weights |
| Logistic regression | Yes | Log-loss is convex in weights |
| SVM (hinge loss) | Yes | Maximum of linear functions |
| LASSO (L1 regression) | Yes | Sum of convex functions is convex |
| Ridge regression (L2) | Yes | Quadratic + quadratic = convex |
| Neural network (any loss) | No | Nonlinear activations create non-convex landscape |
| k-means clustering | No | Discrete assignment step |
| Matrix factorization | No | Product of unknowns |

Linear models with convex losses are convex. The moment you add hidden layers with nonlinear activations, convexity breaks.

---

## Hands-on Build Path 🛠️

1. Step 1: Convexity checker
2. Step 2: Newton's method for 2D
3. Step 3: Lagrange multiplier solver
4. Step 4: Compare first-order vs second-order

Prerequisites: Phase 1, Lessons 04 (Calculus for ML), 08 (Optimization)

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
