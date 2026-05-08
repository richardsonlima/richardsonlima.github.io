---
layout: slides
title: "Stochastic Processes"
category: "ai-engineering-course-step-01"
module_number: 22
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
## Module 22: Stochastic Processes
### _Type: Learn · Lang: Python · Time: ~75 minutes_

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

Many AI systems involve randomness that evolves over time. Not static randomness -- structured, sequential randomness where each step depends on what came before.

Language models generate tokens one at a time. Each token depends on the previous context. The model outputs a probability distribution, samples from it, and moves on. That is a stochastic process.

---

## Learning Objectives ✅

- Simulate 1D and 2D random walks and verify the sqrt(n) scaling of displacement
- Build a Markov chain simulator and compute its stationary distribution via eigendecomposition
- Implement Metropolis-Hastings MCMC and Langevin dynamics for sampling from target distributions
- Connect the forward diffusion process to Brownian motion and explain how the reverse process generates data

---

## 🧠 Random Walks

Start at position 0. At each step, flip a fair coin. Heads: move right (+1). Tails: move left (-1).

After n steps, your position is the sum of n random +/-1 values. The expected position is 0 (the walk is unbiased). But the expected distance from the origin grows as sqrt(n).

---

## 📐 Markov Chains

A Markov chain is a system that transitions between states according to fixed probabilities. The key property: the next state depends only on the current state, not on the history.

This is the Markov property. It means you can describe the entire dynamics with a transition matrix P:

---

## 🔬 Connection to Language Models

Token generation in a language model is approximately a Markov process. Given the current context, the model outputs a distribution over the next token. Temperature controls the sharpness:

- Temperature = 1.0: standard distribution
- Temperature < 1.0: sharper (more deterministic)
- Temperature > 1.0: flatter (more random)
- Temperature -> 0: argmax (greedy)

---

## ⚙️ Brownian Motion

The continuous-time limit of the random walk. Position B(t) has three properties:
1. B(0) = 0
2. B(t) - B(s) is normally distributed with mean 0 and variance t - s (for t > s)
3. Increments on non-overlapping intervals are independent

Brownian motion is continuous but nowhere differentiable -- it jiggles at every scale. The path has fractal dimension 2 in the plane.

---

## 🧩 Langevin Dynamics

Gradient descent finds the minimum of a function. Langevin dynamics finds the probability distribution proportional to exp(-U(x)/T), where U is an energy function and T is temperature.

Two forces act on the particle:
1. **Gradient force** (-dt * gradient(U)): pushes toward low energy (like gradient descent)
2. **Random force** (sqrt(2*T*dt) * z): pushes in random directions (exploration)

---

## 🚀 MCMC: Markov Chain Monte Carlo

Sometimes you need to sample from a distribution p(x) that you can evaluate (up to a constant) but cannot sample from directly. Bayesian posteriors are the classic example -- you know the likelihood times the prior, but the normalizing constant is intractable.

**Metropolis-Hastings** constructs a Markov chain whose stationary distribution is p(x):

---

## Hands-on Build Path 🛠️

1. Step 1: Random walk simulator
2. Step 2: Markov chain
3. Step 3: Langevin dynamics
4. Step 4: Metropolis-Hastings

Prerequisites: Phase 1, Lessons 06-07 (probability, Bayes)

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
