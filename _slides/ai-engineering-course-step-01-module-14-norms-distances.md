---
layout: slides
title: "Norms & Distances"
category: "ai-engineering-course-step-01"
module_number: 14
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
## Module 14: Norms and Distances
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

You have two vectors. Maybe they are word embeddings. Maybe they are user profiles. Maybe they are pixel arrays. You need to know: how close are they?

The answer depends entirely on which distance function you pick. Two data points can be nearest neighbors under one metric and far apart under another. Your KNN classifier, your recommendation engine, your vector database, your clustering algorithm, your loss function -- they all depend on this choice. Get it wrong and your model optimizes for the wrong thing.

---

## Objetivos de Aprendizagem ✅

- Implement L1, L2, cosine, Mahalanobis, Jaccard, and edit distance functions from scratch
- Select the appropriate distance metric for a given ML task and explain why alternatives fail
- Connect L1 and L2 norms to LASSO and Ridge regularization and their geometric constraint regions
- Demonstrate how the same dataset produces different nearest neighbors under different metrics

---

## 🧠 Norms: measuring vector magnitude

A norm measures the "size" of a vector. Every distance function between two vectors can be written as the norm of their difference: d(a, b) = ||a - b||. So understanding norms is understanding distances.

---

## 📐 L1 Norm (Manhattan distance)

The L1 norm sums the absolute values of all components.

It is called Manhattan distance because it measures how far you walk on a city grid where you can only move along axes. No diagonals.

---

## 🔬 L2 Norm (Euclidean distance)

The L2 norm is the straight-line distance. Square root of the sum of squared components.

This is the distance you learned in geometry class. Pythagoras in n dimensions.

---

## ⚙️ Lp Norms: the general family

L1 and L2 are special cases of the Lp norm:

Different values of p produce different shaped "unit balls" (the set of all points at distance 1 from the origin):

---

## 🧩 L-infinity Norm (Chebyshev distance)

As p approaches infinity, the Lp norm converges to the maximum absolute component.

The distance between two points is determined by the single dimension where they differ the most. All other dimensions are ignored.

---

## 🚀 Cosine Similarity and Cosine Distance

Cosine similarity measures the angle between two vectors, ignoring their magnitudes.

It ranges from -1 (opposite directions) to +1 (same direction). Perpendicular vectors have cosine similarity 0.

---

## Hands-on Build Path 🛠️

1. Step 1: All norm and distance functions
2. Step 2: Same data, different distances, different neighbors
3. Step 3: Embedding similarity search

Prerequisites: Phase 1, Lessons 01 (Linear Algebra Intuition), 02 (Vectors, Matrices & Operations)

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
