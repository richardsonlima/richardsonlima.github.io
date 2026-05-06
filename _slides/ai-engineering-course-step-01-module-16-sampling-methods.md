---
layout: slides
title: "Sampling Methods"
category: "ai-engineering-course-step-01"
module_number: 16
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
## Module 16: Sampling Methods
### _Type: Build · Lang: Python · Time: ~120 minutes_

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

A language model finishes processing your prompt and produces a vector of 50,000 logits. One for every token in its vocabulary. Now it has to pick one. How?

If it always picks the highest-probability token, every response is identical. Deterministic. Boring. If it picks uniformly at random, the output is gibberish. The answer lives somewhere between these extremes, and that somewhere is controlled by sampling.

---

## Objetivos de Aprendizagem ✅

- Implement inverse CDF, rejection, and importance sampling from scratch using only uniform random numbers
- Build temperature, top-k, and top-p (nucleus) sampling for language model token generation
- Explain the reparameterization trick and why it enables backpropagation through sampling in VAEs
- Run Metropolis-Hastings MCMC to sample from an unnormalized target distribution

---

## 🧠 Why Sampling Matters

Sampling appears in four fundamental roles across AI and machine learning:

**Generation.** Language models, diffusion models, and GANs all produce output by sampling. The sampling algorithm directly controls creativity, coherence, and diversity. Temperature, top-k, and nucleus sampling are the knobs that engineers turn daily.

---

## 📐 Uniform Random Sampling

Every sampling method starts here. A uniform random number generator produces values in [0, 1) where every sub-interval of equal length has equal probability.

To sample uniformly from a discrete set of n items, generate U and return floor(n * U). To sample from a continuous range [a, b], compute a + (b - a) * U.

---

## 🔬 Inverse CDF Method (Inverse Transform Sampling)

The cumulative distribution function (CDF) maps values to probabilities:

The inverse CDF maps probabilities back to values. If U ~ Uniform(0, 1), then X = F_inverse(U) follows the target distribution.

---

## ⚙️ Rejection Sampling

When you cannot invert the CDF but can evaluate the target PDF up to a constant, rejection sampling works.

The tighter the bound M, the higher the acceptance rate. In low dimensions (1-3), rejection sampling works well. In high dimensions, the acceptance rate drops exponentially because most of the proposal volume gets rejected. This is the curse of dimensionality for rejection sampling.

---

## 🧩 Importance Sampling

Sometimes you do not need samples from the target distribution p(x). You need to estimate an expectation under p(x), and you have samples from a different distribution q(x).

This is critical in reinforcement learning. In PPO (Proximal Policy Optimization), you collect trajectories under an old policy pi_old but want to optimize a new policy pi_new. The importance weight is pi_new(a|s) / pi_old(a|s). PPO clips these weights to prevent the new policy from diverging too far from the old one.

---

## 🚀 Monte Carlo Estimation

Monte Carlo estimation approximates integrals by averaging random samples. The law of large numbers guarantees convergence.

The error rate is dimension-independent. This is why Monte Carlo methods dominate in high dimensions where grid-based integration is impossible.

---

## Hands-on Build Path 🛠️

1. Step 1: Uniform and inverse CDF sampling
2. Step 2: Rejection sampling
3. Step 3: Importance sampling
4. Step 4: Monte Carlo estimation of pi
5. Step 5: Metropolis-Hastings MCMC
6. Step 6: Gibbs sampling

Prerequisites: Phase 1, Lessons 06-07 (Probability, Bayes' Theorem)

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
