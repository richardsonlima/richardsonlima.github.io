---
layout: slides
title: "Numerical Stability"
category: "ai-engineering-course-step-01"
module_number: 13
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
## Module 13: Numerical Stability
### _Type: Build · Lang: Python · Time: ~120 minutes_

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

Your model trains for three hours, then the loss becomes NaN. You add a print statement. The logits are fine at step 9,000. At step 9,001 they are `inf`. By step 9,002 every gradient is `nan` and training is dead.

Or: your model trains to completion but accuracy is 2% worse than the paper claims. You check everything. Architecture matches. Hyperparameters match. Data matches. The problem is that the paper used float32 and you used float16 without the right scaling. Thirty-two bits of accumulated rounding error quietly ate your accuracy.

---

## Learning Objectives ✅

- Implement numerically stable softmax and log-sum-exp using the max-subtraction trick
- Identify overflow, underflow, and catastrophic cancellation in floating-point computations
- Verify analytical gradients against numerical gradients using centered finite differences
- Explain why bfloat16 is preferred over float16 for training and how loss scaling prevents gradient underflow

---

## 🧠 IEEE 754: How Computers Store Real Numbers

Computers store real numbers as floating point values following the IEEE 754 standard. A float has three parts: a sign bit, an exponent, and a mantissa (significand).

The mantissa determines precision (how many significant digits). The exponent determines range (how large or small a number can be).

---

## 📐 Why 0.1 + 0.2 != 0.3

The number 0.1 cannot be represented exactly in binary floating point. In base 2, it is a repeating fraction:

Float32 truncates this to 23 bits of mantissa. The stored value is approximately 0.100000001490116. Similarly, 0.2 is stored as approximately 0.200000002980232. Their sum is 0.300000004470348, not 0.3.

---

## 🔬 Catastrophic Cancellation

When you subtract two nearly equal floating point numbers, the significant digits cancel and you are left with rounding noise promoted to leading digits.

That is a 19% relative error from a single subtraction. In ML, this happens whenever you:

---

## ⚙️ Overflow and Underflow

Overflow happens when a result is too large to represent. Underflow happens when it is too small (closer to zero than the smallest representable positive number).

The `exp()` function is the primary source of overflow in ML:

$$
\exp(1000) \to \infty, \quad \exp(-1000) \to 0
$$

---

## 🧩 The Log-Sum-Exp Trick

Computing `log(sum(exp(x_i)))` directly is numerically dangerous. If any `x_i` is large, `exp(x_i)` overflows. If all `x_i` are very negative, every `exp(x_i)` underflows to zero and `log(0)` is `-inf`.

The trick: subtract the maximum value before exponentiating.

$$
\log\sum_i e^{x_i} = m + \log\sum_i e^{x_i-m},\quad m=\max_i x_i
$$

---

## 🚀 Why Softmax Needs the Max-Subtraction Trick

Softmax converts logits to probabilities:

Without the trick, logits of [100, 101, 102] cause overflow:

$$
	ext{softmax}(x_i)=\frac{e^{x_i-m}}{\sum_j e^{x_j-m}},\quad m=\max_j x_j
$$

---

## Hands-on Build Path 🛠️

1. Step 1: Demonstrate floating point precision limits
2. Step 2: Implement naive vs stable softmax
3. Step 3: Implement stable log-sum-exp
4. Step 4: Implement stable cross-entropy
5. Step 5: Gradient checking

Prerequisites: Phase 1, Lessons 01-04

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
