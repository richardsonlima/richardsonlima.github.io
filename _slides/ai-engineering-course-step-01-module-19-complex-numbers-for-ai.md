---
layout: slides
title: "Complex Numbers for AI"
category: "ai-engineering-course-step-01"
module_number: 19
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
## Module 19: Complex Numbers for AI
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

You open a paper on Fourier transforms and there is `i` everywhere. You look at transformer positional encodings and see `sin` and `cos` at different frequencies -- the real and imaginary parts of complex exponentials. You read about quantum computing and find everything expressed in complex vector spaces.

Complex numbers seem abstract. A number system built on the square root of -1 feels like a mathematical trick. But it is not a trick. It is the natural language of rotations and oscillations. Every time something spins, vibrates, or oscillates, complex numbers are the right tool.

---

## Learning Objectives ✅

- Perform complex arithmetic (add, multiply, divide, conjugate) in both rectangular and polar form
- Apply Euler's formula to convert between complex exponentials and trigonometric functions
- Implement the Discrete Fourier Transform using complex roots of unity
- Explain how complex rotations underlie RoPE and sinusoidal positional encodings in transformers

---

## 🧠 What is a complex number?

A complex number has two parts: a real part and an imaginary part.

That is it. You extend the number line into a plane. The real numbers sit on one axis. The imaginary numbers sit on the other. Every complex number is a point in this plane.

---

## 📐 Complex arithmetic

**Addition.** Add the real parts together, add the imaginary parts together.

**Multiplication.** Use the distributive law and remember that i^2 = -1.

---

## 🔬 The complex plane

The complex plane maps every complex number to a 2D point. The horizontal axis is the real axis, the vertical axis is the imaginary axis.

A complex number is simultaneously a point and a vector from the origin. This dual interpretation is what makes complex numbers useful for geometry.

---

## ⚙️ Polar form

Any point in the plane can be described by its distance from the origin and its angle from the positive real axis.

Rectangular form (a + bi) is good for addition. Polar form (r, theta) is good for multiplication.

---

## 🧩 Euler's formula

The bridge between complex exponentials and trigonometry:

This is the most important formula in this lesson. When theta = pi:

---

## 🚀 Why Euler's formula matters for ML

Euler's formula says that `e^(i*theta)` traces the unit circle as theta varies. At theta = 0, you are at (1, 0). At theta = pi/2, you are at (0, 1). At theta = pi, you are at (-1, 0). At theta = 3*pi/2, you are at (0, -1). A full rotation is theta = 2*pi.

This means complex exponentials ARE rotations. And rotations are everywhere in signal processing and ML.

---

## Hands-on Build Path 🛠️

1. Step 1: Complex class
2. Step 2: Polar conversion and Euler's formula
3. Step 3: Rotation
4. Step 4: DFT from complex arithmetic
5. Step 5: Inverse DFT
6. Step 6: Roots of unity

Prerequisites: Phase 1, Lessons 01-04 (linear algebra, calculus)

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
