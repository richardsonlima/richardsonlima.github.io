---
layout: slides
title: "Linear Algebra Intuition"
category: "ai-engineering-course-step-01"
module_number: 1
complexity: "Learn"
lesson_type: "Learn"
lang_stack: "🐍 🟣"
use_math: true
---

layout: true
class: basic-layout

---

class: center, middle, inverse-slide
# Step 01 - Math Foundations
## Module 01: Linear Algebra Intuition
### _Type: Learn · Lang: Python, Julia · Time: ~60 minutes_

**Richardson Lima**

---

## The Journey Map

We will break linear algebra into 6 engineering acts:

1. **The Problem:** Why linear algebra appears in every ML paper.
2. **The Geometry:** Vectors, matrices, dot products, projection.
3. **The Structure:** Independence, basis, rank, and numerical stability.
4. **The Build:** Implement core operations from scratch in Python.
5. **The Production Layer:** NumPy and PyTorch mapping.
6. **The AI Connection:** Attention, RAG, LoRA, and model internals.

---

## Why This Matters

Open any ML paper. Within the first page, you will see vectors, matrices, dot products, and transformations.

Without intuition, they are symbols.
With intuition, you can see what a model is doing: moving points in space.

---

## Learning Objectives

- Implement vector and matrix operations from scratch in Python
- Explain dot product, projection, and Gram-Schmidt geometrically
- Determine independence, basis, and rank through row reduction
- Connect each concept to embeddings, attention scores, and LoRA

---

class: middle, inverse-slide
# Module 1: The Geometry of Representation
### _From numbers to meaning in space_

---

## Vectors Are Points and Directions

A vector is a list of numbers, but those numbers are coordinates.

Example: vector $[3, 2]$ is a point from origin to $(3,2)$.

Magnitude:
$$
\|v\| = \sqrt{3^2 + 2^2} = \sqrt{13}
$$

---

## Why Vectors Dominate AI

In modern systems, everything is a vector:

- A word -> embedding vector (semantic coordinates)
- An image -> high-dimensional pixel/features vector
- A user -> preference vector in recommendation space

---

## Matrices Are Transformations

A matrix transforms vectors: rotate, scale, stretch, or project.

In AI, matrices are the model parameters:

- Neural layer weights
- Attention projection matrices
- Embedding lookup transformations

---

## Dot Product Measures Alignment

The dot product is similarity in geometric form:

$$
a \cdot b = \sum_i a_i b_i
$$

- $a \cdot b > 0$: similar direction
- $a \cdot b = 0$: orthogonal
- $a \cdot b < 0$: opposite direction

---

## Dot Product in Real Systems

This operation powers:

- Retrieval (RAG similarity)
- Recommendation ranking
- Transformer attention scores

Search quality is largely geometry quality.

---

## Projection as Controlled Information

Projection of $a$ onto $b$:

$$
\text{proj}_b(a) = \frac{a \cdot b}{b \cdot b} b
$$

Residual:
$$
r = a - \text{proj}_b(a)
$$

and $r$ is perpendicular to $b$.

---

## Projection in ML

Projection appears in:

- Linear regression (least squares)
- PCA (project onto principal directions)
- Attention (query-key directional matching)

---

class: middle, inverse-slide
# Module 2: Structural Algebra
### _Independence, basis, rank and conditioning_

---

## Linear Independence

Vectors are independent if none can be written as a combination of the others.

If one is redundant, your feature space collapses.

---

## Why Independence Matters for Models

If two features are linearly dependent:

- The model cannot separate their effects
- Regression becomes unstable
- Small input noise can cause large output changes

---

## Basis and Coordinate Systems

A basis is a minimal independent set that spans the space.

In $\mathbb{R}^3$, standard basis:

$$
[1,0,0], [0,1,0], [0,0,1]
$$

Any independent triplet also defines a valid coordinate system.

---

## Rank as Information Capacity

Rank = number of independent columns (or rows).

- Full rank: maximal independent information
- Rank deficient: redundant information
- Near deficient: numerical instability

---

## Rank and Solvability

When rank drops:

- Inverse may not exist
- Solutions can be infinite or undefined
- Regularization or decomposition is required

This is exactly why numerical linear algebra matters in production.

---

## Gram-Schmidt and Orthonormalization

Goal: transform independent vectors into orthonormal basis.

Properties:

- Unit norm vectors
- Pairwise orthogonality

Core for QR decomposition and stable solvers.

---

## QR Intuition

For matrix $A$:

$$
A = QR
$$

- $Q$: orthonormal directions
- $R$: projection coefficients

Widely used for least squares and eigenvalue routines.

---

class: middle, inverse-slide
# Module 3: Build From Scratch
### _Python implementation path_

---

## Build Path

1. Vector class
2. Matrix class
3. Matrix-vector and matrix-matrix multiplication
4. Projection and Gram-Schmidt
5. Independence and rank checks

---

## Step 1 - Vector Core (Python)

```python
class Vector:
	def __init__(self, components):
		self.components = list(components)

	def __add__(self, other):
		return Vector([a + b for a, b in zip(self.components, other.components)])

	def __sub__(self, other):
		return Vector([a - b for a, b in zip(self.components, other.components)])

	def dot(self, other):
		return sum(a * b for a, b in zip(self.components, other.components))

	def magnitude(self):
		return sum(x**2 for x in self.components) ** 0.5
```

---

## Step 2 - Matrix Core (Python)

```python
class Matrix:
	def __init__(self, rows):
		self.rows = [list(row) for row in rows]
		self.shape = (len(self.rows), len(self.rows[0]))

	def __matmul__(self, other):
		rows = []
		for i in range(self.shape[0]):
			row = []
			for j in range(other.shape[1]):
				row.append(sum(self.rows[i][k] * other.rows[k][j] for k in range(self.shape[1])))
			rows.append(row)
		return Matrix(rows)
```

---

## Step 3 - Projection Function

```python
def project(a, b):
	scale = a.dot(b) / b.dot(b)
	return Vector([scale * x for x in b.components])
```

This function is the basis for regression geometry and orthogonal decomposition.

---

## Step 4 - Gram-Schmidt

```python
def gram_schmidt(vectors):
	orthonormal = []
	for v in vectors:
		w = v
		for u in orthonormal:
			w = w - project(w, u)
		if w.magnitude() > 1e-10:
			mag = w.magnitude()
			orthonormal.append(Vector([x / mag for x in w.components]))
	return orthonormal
```

---

## Step 5 - Independence via Rank

Use row reduction and pivot counting.

Engineering takeaway:

- rank = number of pivots
- independent set requires full pivot count for its span

---

class: middle, inverse-slide
# Module 4: Production Mapping
### _NumPy and PyTorch equivalence_

---

## NumPy Layer View

```python
import numpy as np

W = np.random.randn(2, 3) * 0.1
x = np.array([1.0, 0.5, -0.3])
y = W @ x
```

This is a neural layer: linear transformation of input into feature space.

---

## Rank and Projection in NumPy

```python
A = np.array([[1, 2], [2, 4]])
print(np.linalg.matrix_rank(A))

a = np.array([3, 4])
b = np.array([1, 0])
proj = (np.dot(a, b) / np.dot(b, b)) * b
```

---

## PyTorch and Autodiff

```python
import torch

x = torch.randn(3, requires_grad=True)
y = torch.tensor([1.0, 0.0, 0.0])
s = torch.dot(x, y)
s.backward()
```

Gradient of dot product w.r.t. $x$ recovers $y$.

---

## Why This Matters in Training

Neural training is matrix operations + gradients.

If linear algebra intuition is weak:

- debugging is slow
- instability diagnosis is poor
- model behavior feels like magic

---

class: middle, inverse-slide
# Module 5: AI Connections
### _From math primitives to model behavior_

---

## Concept to System Mapping

| Concept | Where it appears |
|---|---|
| Dot product | Attention, cosine retrieval |
| Matrix multiply | Every dense layer |
| Rank | LoRA, compression, solvability |
| Projection | Regression, PCA, alignment |
| Orthonormal basis | Stable numerical computation |

---

## LoRA as Rank Engineering

LoRA constrains updates to low-rank structure:

$$
\Delta W \approx AB
$$

with small rank $r$.

Result:

- fewer trainable parameters
- lower memory footprint
- faster adaptation

---

## Retrieval and Geometry

RAG quality depends on embedding geometry:

- good vector neighborhoods -> good retrieval
- poor neighborhoods -> irrelevant context

Linear algebra is retrieval quality control.

---

## Attention Is Dot Product at Scale

Transformer core:

$$
\text{Attention}(Q, K, V) = \text{softmax}\left(\frac{QK^T}{\sqrt{d_k}}\right)V
$$

Again: directional similarity drives information flow.

---

class: middle, inverse-slide
# Module 6: Practice and Mastery
### _Operational checkpoints_

---

## Exercise Set

1. Implement `angle_between` for vectors.
2. Build a 2D scaling matrix and apply to $[1,1]$.
3. Generate 50D vectors and find top cosine pair.
4. Verify orthonormality after Gram-Schmidt.
5. Create rank-2 matrix in 3D and explain geometry.
6. Project $[1,2,3]$ onto $[1,1,1]$ and interpret.

---

## Mastery Checklist

- I can explain each concept with geometry, not memorization.
- I can implement minimal versions in code.
- I can connect each operation to AI system behavior.
- I can diagnose instability from rank and conditioning signs.

---

## Key Terms

- **Vector:** coordinate/feature point in space
- **Matrix:** learned transformation
- **Dot product:** directional alignment
- **Rank:** independent information count
- **Projection:** component in a direction
- **Basis:** coordinate foundation of a space
- **Orthonormal:** perpendicular unit directions

---

## Wrap-up

Linear algebra is not prerequisite overhead.
It is the operating system of modern AI.

Next step: move to Module 02 and continue the stack with the same implementation-first mindset.

---
