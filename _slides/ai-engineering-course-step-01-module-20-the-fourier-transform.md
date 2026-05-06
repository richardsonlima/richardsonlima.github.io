---
layout: slides
title: "The Fourier Transform"
category: "ai-engineering-course-step-01"
module_number: 20
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
## Module 20: The Fourier Transform
### _Type: Build · Lang: Python · Time: ~90 minutes_

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

An audio recording is a sequence of pressure measurements over time. A stock price is a sequence of values over days. An image is a grid of pixel intensities over space. All of these are data in the time domain (or space domain). You see values changing over some index.

But many patterns are invisible in the time domain. Is this audio signal a pure tone or a chord? Does this stock price have a weekly cycle? Does this image have a repeating texture? These questions are about frequency content, and the time domain hides it.

---

## Objetivos de Aprendizagem ✅

- Implement the DFT from scratch and verify it against the O(N log N) Cooley-Tukey FFT
- Interpret frequency coefficients: extract amplitude, phase, and power spectrum from a signal
- Apply the convolution theorem to perform convolution via FFT multiplication
- Connect Fourier frequency decomposition to transformer positional encodings and CNN convolution layers

---

## 🧠 The DFT definition

Given N samples x[0], x[1], ..., x[N-1], the Discrete Fourier Transform produces N frequency coefficients X[0], X[1], ..., X[N-1]:

Each X[k] is a complex number. Its magnitude |X[k]| tells you the amplitude of frequency k. Its phase angle(X[k]) tells you the phase offset of that frequency.

---

## 📐 What each coefficient means

**X[0]: the DC component.** This is the sum of all samples -- proportional to the mean. It represents the constant (zero-frequency) offset of the signal.

**X[k] for 1 <= k <= N/2: positive frequencies.** X[k] represents frequency k cycles per N samples. Higher k means higher frequency (faster oscillation).

---

## 🔬 Inverse DFT

The inverse DFT reconstructs the original signal from its frequency coefficients:

The only differences from the forward DFT: the sign in the exponent is positive (not negative), and there is a 1/N normalization factor.

---

## ⚙️ The FFT: making it fast

The DFT as defined above is O(N^2): for each of N output coefficients, you sum over N input samples. For N = 1 million, that is 10^12 operations.

The Fast Fourier Transform (FFT) computes the same result in O(N log N). For N = 1 million, that is about 20 million operations instead of a trillion. This is what makes frequency analysis practical.

---

## 🧩 Spectral analysis

The **power spectrum** is |X[k]|^2 -- the squared magnitude of each frequency coefficient. It shows how much energy is at each frequency.

The **phase spectrum** is angle(X[k]) -- the phase offset of each frequency. For most analysis tasks, you care about the power spectrum and ignore the phase.

---

## 🚀 Frequency resolution

The frequency resolution of the DFT depends on the number of samples N and the sampling rate fs.

To resolve two frequencies that are close together, you need more samples. To capture high frequencies, you need a higher sampling rate.

---

## Hands-on Build Path 🛠️

1. Step 1: DFT from scratch
2. Step 2: Inverse DFT
3. Step 3: FFT (Cooley-Tukey)
4. Step 4: Spectral analysis helpers

Prerequisites: Phase 1, Lessons 01-04, 19 (complex numbers)

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
