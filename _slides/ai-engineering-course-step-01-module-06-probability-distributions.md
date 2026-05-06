---
layout: slides
title: "Probability & Distributions"
category: "ai-engineering-course-step-01"
module_number: 6
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
## Module 06: Probability and Distributions
### _Type: Learn · Lang: Python · Time: ~75 minutes_

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

A classifier outputs `[0.03, 0.91, 0.06]`. A language model picks the next word from 50,000 candidates. A diffusion model generates images by sampling from learned distributions. All of these are probability in action.

Every prediction a model makes is a probability distribution. Every loss function measures how far the predicted distribution is from the true one. Every training step adjusts parameters to make one distribution look more like another. Without probability, you cannot read a single ML paper, debug a single model, or understand why your training loss is NaN.

---

## Objetivos de Aprendizagem ✅

- Implement PMFs and PDFs from scratch for Bernoulli, categorical, Poisson, uniform, and normal distributions
- Compute expected value, variance, and use the Central Limit Theorem to explain why Gaussians dominate
- Build softmax and log-softmax functions with the numerical stability trick (subtract max logit)
- Calculate cross-entropy loss from logits and connect it to negative log-likelihood

---

## 🧠 Events, Sample Spaces, and Probability

The sample space S is the set of all possible outcomes. An event is a subset of the sample space. Probability maps events to numbers between 0 and 1.

Three axioms define all of probability:
1. P(A) >= 0 for any event A
2. P(S) = 1 (something always happens)
3. P(A or B) = P(A) + P(B) when A and B cannot both occur

---

## 📐 Conditional Probability and Independence

P(A|B) is the probability of A given that B happened.

Two events are independent when knowing one tells you nothing about the other:

---

## 🔬 Probability Mass Functions vs Probability Density Functions

Discrete random variables have a probability mass function (PMF). Each outcome has a specific probability that you can read off directly.

Continuous random variables have a probability density function (PDF). The density at a single point is not a probability. Probability comes from integrating the density over an interval.

---

## ⚙️ Common Distributions

**Bernoulli:** one trial, two outcomes. Models binary classification.

**Categorical:** one trial, k outcomes. Models multi-class classification (softmax output).

---

## 🧩 Expected Value and Variance

Expected value is the weighted average outcome.

Variance measures spread around the mean.

---

## 🚀 Joint and Marginal Distributions

A joint distribution P(X, Y) describes two random variables together.

Joint PMF example (X = weather, Y = umbrella):

---

## Hands-on Build Path 🛠️

1. Step 1: Probability basics
2. Step 2: PMF and PDF from scratch
3. Step 3: Expected value and variance
4. Step 4: Sampling from distributions
5. Step 5: Softmax and log probabilities
6. Step 6: Central Limit Theorem demonstration

Prerequisites: Phase 1, Lessons 01-04

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
