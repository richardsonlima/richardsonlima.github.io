---
layout: slides
title: "Information Theory: Entropy, KL Divergence"
category: "ai-engineering-course-step-01"
module_number: 9
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
## Module 09: Information Theory
### _Type: Learn · Lang: Python · Time: ~60 minutes_

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

You call `CrossEntropyLoss()` in every classification model you train. You see "perplexity" in every language model paper. You read about KL divergence in VAEs, distillation, and RLHF. These are not disconnected concepts. They are all the same idea wearing different hats.

Information theory gives you the language to reason about uncertainty, compression, and prediction. Claude Shannon invented it in 1948 to solve communication problems. Turns out, training a neural network is a communication problem: the model is trying to transmit the correct label through a noisy channel of learned weights.

---

## Learning Objectives ✅

- Compute entropy, cross-entropy, and KL divergence from scratch and explain their relationship
- Derive why minimizing cross-entropy loss is equivalent to maximizing log-likelihood
- Calculate mutual information between features and a target to rank feature importance
- Explain perplexity as the effective vocabulary size a language model chooses from

---

## 🧠 Information Content (Surprise)

When something unlikely happens, it carries more information. A coin landing heads? Not surprising. A lottery win? Very surprising.

The information content of an event with probability p is:

$$
I(x)=-\log p(x)
$$

---

## 📐 Entropy (Average Surprise)

Entropy is the expected surprise across all possible outcomes of a distribution.

$$
H(P)=-\sum_x p(x)\log p(x)
$$

A fair coin has maximum entropy for a binary variable: 1 bit. A biased coin (99% heads) has low entropy: 0.08 bits. You already know what will happen, so each flip tells you almost nothing.

---

## 🔬 Cross-Entropy (The Loss Function You Use Every Day)

Cross-entropy measures the average surprise when you use distribution Q to encode events that actually come from distribution P.

$$
H(P,Q)=-\sum_x p(x)\log q(x)
$$

P is the true distribution (the labels). Q is your model's predictions. If Q matches P perfectly, cross-entropy equals entropy. Any mismatch makes it larger.

---

## ⚙️ KL Divergence (Distance Between Distributions)

KL divergence measures how much extra surprise you get from using Q instead of P.

$$
D_{KL}(P\|Q)=\sum_x p(x)\log\frac{p(x)}{q(x)}
$$

Cross-entropy is entropy plus KL divergence. Since entropy of the true distribution is constant during training, minimizing cross-entropy is the same as minimizing KL divergence. You are pushing your model's distribution toward the true distribution.

---

## 🧩 Mutual Information

Mutual information measures how much knowing one variable tells you about another.

If X and Y are independent, mutual information is zero. Knowing one tells you nothing about the other. If they are perfectly correlated, mutual information equals the entropy of either variable.

---

## 🚀 Conditional Entropy

H(Y|X) measures how much uncertainty remains about Y after you observe X.

Two extremes:
- If X completely determines Y, then H(Y|X) = 0. Knowing X eliminates all uncertainty about Y. Example: X = temperature in Celsius, Y = temperature in Fahrenheit.
- If X tells you nothing about Y, then H(Y|X) = H(Y). Knowing X does not reduce your uncertainty at all. Example: X = coin flip, Y = tomorrow's weather.

---

## Hands-on Build Path 🛠️

1. Step 1: Information content and entropy
2. Step 2: Cross-entropy and KL divergence
3. Step 3: Cross-entropy as classification loss
4. Step 4: Cross-entropy equals negative log-likelihood
5. Step 5: Mutual information

Prerequisites: Phase 1, Lesson 06 (Probability)

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
