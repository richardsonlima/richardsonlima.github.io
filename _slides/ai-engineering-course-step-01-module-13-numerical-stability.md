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

## O Mapa da Jornada 🗺️

1. Fundamentos e contexto do problema.
2. Intuição operacional do conceito.
3. Tradução matemática para engenharia.
4. Padrões de uso em sistemas de IA.
5. Construção prática com código.
6. Checkpoints para domínio técnico.

---

## Por que isso importa? 🎯

Your model trains for three hours, then the loss becomes NaN. You add a print statement. The logits are fine at step 9,000. At step 9,001 they are `inf`. By step 9,002 every gradient is `nan` and training is dead.

Or: your model trains to completion but accuracy is 2% worse than the paper claims. You check everything. Architecture matches. Hyperparameters match. Data matches. The problem is that the paper used float32 and you used float16 without the right scaling. Thirty-two bits of accumulated rounding error quietly ate your accuracy.

---

## Objetivos de Aprendizagem ✅

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

---

## 🧩 The Log-Sum-Exp Trick

Computing `log(sum(exp(x_i)))` directly is numerically dangerous. If any `x_i` is large, `exp(x_i)` overflows. If all `x_i` are very negative, every `exp(x_i)` underflows to zero and `log(0)` is `-inf`.

The trick: subtract the maximum value before exponentiating.

---

## 🚀 Why Softmax Needs the Max-Subtraction Trick

Softmax converts logits to probabilities:

Without the trick, logits of [100, 101, 102] cause overflow:

---

## Hands-on Build Path 🛠️

1. Step 1: Demonstrate floating point precision limits
2. Step 2: Implement naive vs stable softmax
3. Step 3: Implement stable log-sum-exp
4. Step 4: Implement stable cross-entropy
5. Step 5: Gradient checking

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
