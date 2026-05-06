---
layout: slides
title: "Matrix Transformations & Eigenvalues"
category: "ai-engineering-course-step-01"
module_number: 3
complexity: "Build"
lesson_type: "Build"
lang_stack: "🐍 🟣"
use_math: true
---

layout: true
class: basic-layout

---

class: center, middle, inverse-slide
# Step 01 - Math Foundations
## Module 03: Matrix Transformations
### _Type: Build · Lang: Python, Julia · Time: ~75 minutes_

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

You read about PCA and see "find the eigenvectors of the covariance matrix." You read about model stability and see "check if all eigenvalues have magnitude less than 1." You read about data augmentation and see "apply a random rotation." None of this makes sense until you understand what matrices do to space geometrically.

Matrices are not just grids of numbers. They are spatial machines. A rotation matrix spins points. A scaling matrix stretches them. A shearing matrix tilts them. Every transformation a neural network applies to data is one of these operations or a composition of them. This lesson makes those operations concrete.

---

## Objetivos de Aprendizagem ✅

- Construct rotation, scaling, shearing, and reflection matrices and apply them to 2D and 3D points
- Compose multiple transformations by matrix multiplication and verify that order matters
- Compute eigenvalues and eigenvectors of 2x2 matrices from the characteristic equation
- Explain why eigenvalues determine PCA directions, RNN stability, and spectral clustering behavior

---

## 🧠 Transformations as matrices

Every linear transformation in 2D can be written as a 2x2 matrix. The matrix tells you exactly where the basis vectors [1, 0] and [0, 1] end up. Everything else follows.

---

## 📐 Rotation

A 2D rotation by angle theta keeps distances and angles intact. It moves every point along a circular arc.

In 3D, you rotate around an axis. Each axis has its own rotation matrix:

---

## 🔬 Scaling

Scaling stretches or compresses along each axis independently.

---

## ⚙️ Shearing

Shearing tilts one axis while keeping the other fixed. It turns rectangles into parallelograms.

Shear matrices:
- `Shx = [[1, k], [0, 1]]` shifts x by k * y
- `Shy = [[1, 0], [k, 1]]` shifts y by k * x

---

## 🧩 Reflection

Reflection mirrors points across an axis or line.

Reflection matrices:
- Reflect across y-axis: `[[-1, 0], [0, 1]]`
- Reflect across x-axis: `[[1, 0], [0, -1]]`

---

## 🚀 Composition: chaining transformations

Applying transformation A then B is the same as multiplying their matrices: `result = B @ A @ point`. Order matters. Rotate then scale gives different results than scale then rotate.

Composed: `S @ R = [[0, -2], [0.5, 0]]`

---

## Hands-on Build Path 🛠️

1. Step 1: Transformation matrices from scratch (Python)
2. Step 2: Composition of transformations
3. Step 3: Eigenvalues from scratch (2x2)
4. Step 4: Determinant as volume scaling factor

Prerequisites: Phase 1, Lessons 01-02 (Linear Algebra Intuition, Vectors & Matrices Operations)

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
