---
layout: slides
title: "Vectors, Matrices & Operations"
category: "ai-engineering-course-step-01"
module_number: 2
complexity: "Build"
lesson_type: "Build"
lang_stack: "Python, Julia"
use_math: true
---
layout: true
class: basic-layout
---
class: center, middle, inverse-slide
# Step 01 - Math Foundations
## Module 02: Vectors, Matrices & Operations
### _Type: Build · Lang: Python, Julia · Time: ~60 minutes_
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
## Why does this matter?
You want to build a neural network. You read the code and see this:
That `@` is matrix multiplication. The `weights` are a matrix. The `input` is a vector. If you do not know what those operations do, this line is magic. If you do know, it is the entire forward pass of a layer in three operations.
---
## Learning Objectives
- Build a Matrix class with element-wise operations, matrix multiplication, transpose, determinant, and inverse
- Distinguish element-wise multiplication from matrix multiplication and explain when each applies
- Implement a single dense neural network layer (`relu(W @ x + b)`) using only the from-scratch Matrix class
- Explain broadcasting rules and how bias addition works in neural network frameworks
---
## Vectors: ordered lists of numbers
A vector is a list of numbers with a direction and magnitude. In AI, vectors represent data points, features, or parameters.
A 2D vector `[3, 4]` points to coordinates (3, 4) on a plane. Its length (magnitude) is 5 (the 3-4-5 triangle).
---
## Matrices: grids of numbers
A matrix is a 2D grid. Rows and columns. An m x n matrix has m rows and n columns.
In neural networks, weight matrices transform input vectors into output vectors. A layer with 784 inputs and 128 outputs uses a 128x784 weight matrix.
---
## Why shapes matter
Matrix multiplication has a strict rule: `(m x n) @ (n x p) = (m x p)`. The inner dimensions must match.
If you get a shape mismatch error in PyTorch, this is why.
---
## The operations map
| Operation | What it does | Neural network use |
|---|---|---|
| Addition | Element-wise combine | Adding bias to output |
| Scalar multiply | Scale every element | Learning rate * gradients |
| Matrix multiply | Transform vectors | Layer forward pass |
| Transpose | Flip rows and columns | Backpropagation |
| Determinant | Single number summary | Checking invertibility |
| Inverse | Undo a transformation | Solving linear systems |
| Identity | Do-nothing matrix | Initialization, residual connections |
---
## Element-wise vs matrix multiplication
This distinction trips up beginners constantly.
Element-wise: multiply matching positions. Both matrices must be the same shape.
---
## Hands-on Build Path
1. Step 1: Vector class
2. Step 2: Matrix class with core operations
3. Step 3: See it work
4. Step 4: Connect to neural networks
Prerequisites: Phase 1, Lesson 01 (Linear Algebra Intuition)
---
## Mastery Checklist
- I can explain the concept without memorizing formulas.
- I can implement the minimal version in code.
- I can connect the topic to model training/inference.
- I can debug common errors in this topic.
---
## Wrap-up
This module connects mathematical intuition with practical execution.
Next step: move to the next module in the track and reinforce it with quiz exercises.
---

<!-- DEPTH_EXPANSION_START -->
---
class: middle, inverse-slide
# Depth Extension
### Full reference absorption plus beyond-reference advanced coverage

---
## Reference Absorption: The Problem
- You want to build a neural network.
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (you want to build a neural network).
- Operational risk check: define a metric and alert tied to this concept before deployment (you want to build a neural network).
- You read the code and see this:
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (you read the code and see this:).
- Operational risk check: define a metric and alert tied to this concept before deployment (you read the code and see this:).
- That @ is matrix multiplication.
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (that @ is matrix multiplication).
- Operational risk check: define a metric and alert tied to this concept before deployment (that @ is matrix multiplication).
- If you do not know what those operations do, this line is magic.
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (if you do not know what those operations do, this line is magic).
- Operational risk check: define a metric and alert tied to this concept before deployment (if you do not know what those operations do, this line is magic).

---
## Reference Absorption: The Problem (cont.)
- If you do know, it is the entire forward pass of a layer in three operations.
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (if you do know, it is the entire forward pass of a layer in three operations).
- Operational risk check: define a metric and alert tied to this concept before deployment (if you do know, it is the entire forward pass of a layer in three operations).
- Every image your model processes is a matrix of pixel values.
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (every image your model processes is a matrix of pixel values).
- Operational risk check: define a metric and alert tied to this concept before deployment (every image your model processes is a matrix of pixel values).
- Every word embedding is a vector.
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (every word embedding is a vector).
- Operational risk check: define a metric and alert tied to this concept before deployment (every word embedding is a vector).
- Every layer of every neural network is a matrix transformation.
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (every layer of every neural network is a matrix transformation).
- Operational risk check: define a metric and alert tied to this concept before deployment (every layer of every neural network is a matrix transformation).

---
## Reference Absorption: The Problem Deep Continuation
- You cannot build AI systems without being fluent in matrix operations the same way you cannot write code without understanding variables.
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (you cannot build ai systems without being fluent in matrix operations the same way you cannot write code without understanding...).
- Operational risk check: define a metric and alert tied to this concept before deployment (you cannot build ai systems without being fluent in matrix operations the same way you cannot write code without unde...).
- This lesson builds that fluency from scratch.
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (this lesson builds that fluency from scratch).
- Operational risk check: define a metric and alert tied to this concept before deployment (this lesson builds that fluency from scratch).

---
## Reference Absorption: Exercises
- Verify the inverse. Multiply A @ A.inverse_2x2() and confirm you get the identity matrix.
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (verify the inverse. multiply a @ a.inverse_2x2() and confirm you get the identity matrix).
- Operational risk check: define a metric and alert tied to this concept before deployment (verify the inverse. multiply a @ a.inverse_2x2() and confirm you get the identity matrix).
- Try it with three different 2x2 matrices.
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (try it with three different 2x2 matrices).
- Operational risk check: define a metric and alert tied to this concept before deployment (try it with three different 2x2 matrices).
- What happens when the determinant is zero?
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (what happens when the determinant is zero?).
- Operational risk check: define a metric and alert tied to this concept before deployment (what happens when the determinant is zero?).
- Implement 3x3 inverse. Extend the Matrix class to compute inverses for 3x3 matrices using the adjugate method.
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (implement 3x3 inverse. extend the matrix class to compute inverses for 3x3 matrices using the adjugate method).
- Operational risk check: define a metric and alert tied to this concept before deployment (implement 3x3 inverse. extend the matrix class to compute inverses for 3x3 matrices using the adjugate method).

---
## Reference Absorption: Exercises (cont.)
- Test it against NumPy's np.linalg.inv.
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (test it against numpy's np.linalg.inv).
- Operational risk check: define a metric and alert tied to this concept before deployment (test it against numpy's np.linalg.inv).
- Build a two-layer network. Using only your Matrix class (no NumPy), create a two-layer neural network: input (3) -> hidden (4) -> output (2).
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (build a two-layer network. using only your matrix class (no numpy), create a two-layer neural network: input (3) -> hidden (4)...).
- Operational risk check: define a metric and alert tied to this concept before deployment (build a two-layer network. using only your matrix class (no numpy), create a two-layer neural network: input (3) -> h...).
- Initialize random weights, run a forward pass, and verify all shapes are correct.
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (initialize random weights, run a forward pass, and verify all shapes are correct).
- Operational risk check: define a metric and alert tied to this concept before deployment (initialize random weights, run a forward pass, and verify all shapes are correct).

---
## Reference Absorption: Key Terms
- In AI: a point in high-dimensional space.
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (in ai: a point in high-dimensional space).
- Operational risk check: define a metric and alert tied to this concept before deployment (in ai: a point in high-dimensional space).
- It maps vectors from one space to another.
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (it maps vectors from one space to another).
- Operational risk check: define a metric and alert tied to this concept before deployment (it maps vectors from one space to another).
- Turns an m x n matrix into n x m.
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (turns an m x n matrix into n x m).
- Operational risk check: define a metric and alert tied to this concept before deployment (turns an m x n matrix into n x m).
- Critical in backpropagation.
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (critical in backpropagation).
- Operational risk check: define a metric and alert tied to this concept before deployment (critical in backpropagation).

---
## Reference Absorption: Key Terms (cont.)
- Zero means the transformation crushes a dimension.
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (zero means the transformation crushes a dimension).
- Operational risk check: define a metric and alert tied to this concept before deployment (zero means the transformation crushes a dimension).
- Only exists when the determinant is not zero.
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (only exists when the determinant is not zero).
- Operational risk check: define a metric and alert tied to this concept before deployment (only exists when the determinant is not zero).
- Used in residual connections (ResNets).
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (used in residual connections (resnets)).
- Operational risk check: define a metric and alert tied to this concept before deployment (used in residual connections (resnets)).
- Both arrays must have the same shape (or be broadcastable).
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (both arrays must have the same shape (or be broadcastable)).
- Operational risk check: define a metric and alert tied to this concept before deployment (both arrays must have the same shape (or be broadcastable)).

---
## Reference Absorption: Use It
- NumPy does everything above in fewer lines and orders of magnitude faster.
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (numpy does everything above in fewer lines and orders of magnitude faster).
- Operational risk check: define a metric and alert tied to this concept before deployment (numpy does everything above in fewer lines and orders of magnitude faster).
- The @ operator in Python calls __matmul__.
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (the @ operator in python calls __matmul__).
- Operational risk check: define a metric and alert tied to this concept before deployment (the @ operator in python calls __matmul__).
- NumPy implements it with optimized BLAS routines written in C and Fortran.
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (numpy implements it with optimized blas routines written in c and fortran).
- Operational risk check: define a metric and alert tied to this concept before deployment (numpy implements it with optimized blas routines written in c and fortran).
- NumPy automatically broadcasts the 1D bias across both rows.
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (numpy automatically broadcasts the 1d bias across both rows).
- Operational risk check: define a metric and alert tied to this concept before deployment (numpy automatically broadcasts the 1d bias across both rows).

---
## Reference Absorption: Use It (cont.)
- This is how bias addition works in every neural network framework.
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (this is how bias addition works in every neural network framework).
- Operational risk check: define a metric and alert tied to this concept before deployment (this is how bias addition works in every neural network framework).

---
## Reference Absorption: Step 4: Connect to neural networks
- This is a single dense layer: output = relu(W @ x + b).
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (this is a single dense layer: output = relu(w @ x + b)).
- Operational risk check: define a metric and alert tied to this concept before deployment (this is a single dense layer: output = relu(w @ x + b)).
- Every dense layer in every neural network does exactly this.
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (every dense layer in every neural network does exactly this).
- Operational risk check: define a metric and alert tied to this concept before deployment (every dense layer in every neural network does exactly this).

---
## Reference Absorption: Element-wise vs matrix multiplication
- This distinction trips up beginners constantly.
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (this distinction trips up beginners constantly).
- Operational risk check: define a metric and alert tied to this concept before deployment (this distinction trips up beginners constantly).
- Element-wise: multiply matching positions.
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (element-wise: multiply matching positions).
- Operational risk check: define a metric and alert tied to this concept before deployment (element-wise: multiply matching positions).
- Both matrices must be the same shape.
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (both matrices must be the same shape).
- Operational risk check: define a metric and alert tied to this concept before deployment (both matrices must be the same shape).
- Matrix multiplication: dot products of rows and columns.
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (matrix multiplication: dot products of rows and columns).
- Operational risk check: define a metric and alert tied to this concept before deployment (matrix multiplication: dot products of rows and columns).

---
## Reference Absorption: Element-wise vs matrix multiplication (cont.)
- Inner dimensions must match.
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (inner dimensions must match).
- Operational risk check: define a metric and alert tied to this concept before deployment (inner dimensions must match).
- Different operations, different results, different rules.
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (different operations, different results, different rules).
- Operational risk check: define a metric and alert tied to this concept before deployment (different operations, different results, different rules).

---
## Reference Absorption: Broadcasting
- When you add a bias vector to a matrix of outputs, the shapes do not match.
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (when you add a bias vector to a matrix of outputs, the shapes do not match).
- Operational risk check: define a metric and alert tied to this concept before deployment (when you add a bias vector to a matrix of outputs, the shapes do not match).
- Broadcasting stretches the smaller array to fit.
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (broadcasting stretches the smaller array to fit).
- Operational risk check: define a metric and alert tied to this concept before deployment (broadcasting stretches the smaller array to fit).
- Every modern framework does this automatically.
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (every modern framework does this automatically).
- Operational risk check: define a metric and alert tied to this concept before deployment (every modern framework does this automatically).
- Understanding it prevents confusion when shapes seem wrong but the code runs.
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (understanding it prevents confusion when shapes seem wrong but the code runs).
- Operational risk check: define a metric and alert tied to this concept before deployment (understanding it prevents confusion when shapes seem wrong but the code runs).

---
## Reference Absorption: Further Reading
- [3Blue1Brown: Essence of Linear Algebra](https://www.3blue1brown.com/topics/linear-algebra) - visual intuition for every operation covered here
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production ([3blue1brown: essence of linear algebra](https://www.3blue1brown.com/topics/linear-algebra) - visual intuition for every operat...).
- Operational risk check: define a metric and alert tied to this concept before deployment ([3blue1brown: essence of linear algebra](https://www.3blue1brown.com/topics/linear-algebra) - visual intuition for ev...).
- [NumPy documentation on broadcasting](https://numpy.org/doc/stable/user/basics.broadcasting.html) - the exact rules NumPy follows
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production ([numpy documentation on broadcasting](https://numpy.org/doc/stable/user/basics.broadcasting.html) - the exact rules numpy follows).
- Operational risk check: define a metric and alert tied to this concept before deployment ([numpy documentation on broadcasting](https://numpy.org/doc/stable/user/basics.broadcasting.html) - the exact rules n...).
- [Stanford CS229 Linear Algebra Review](http://cs229.stanford.edu/section/cs229-linalg.pdf) - concise reference for ML-specific linear algebra
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production ([stanford cs229 linear algebra review](http://cs229.stanford.edu/section/cs229-linalg.pdf) - concise reference for ml-specific...).
- Operational risk check: define a metric and alert tied to this concept before deployment ([stanford cs229 linear algebra review](http://cs229.stanford.edu/section/cs229-linalg.pdf) - concise reference for ml...).

---
## Beyond Reference: Engineering Translation
- Core anchors for this module: self, matrix, data, range, print, rows, return, shape.
- Convert each theoretical primitive into measurable behaviors in training and inference pipelines.
- Define observability checkpoints so regressions are detected before deployment impact.
- Tie mathematical assumptions to concrete data contracts and monitoring thresholds.

---
## Beyond Reference: Advanced Layer 1
- Analyze computational complexity of batched matrix ops and when kernel fusion outperforms naive broadcasting.
- Risk and governance extension: convert this advanced point into explicit acceptance tests and rollback criteria (analyze computational complexity of batched matrix ops and when kernel fusion outperforms naive broadcasting.).
- Explain numerical tradeoffs of float16, bfloat16, and float32 for matrix-heavy training loops.
- Risk and governance extension: convert this advanced point into explicit acceptance tests and rollback criteria (explain numerical tradeoffs of float16, bfloat16, and float32 for matrix-heavy training loops.).
- Design benchmarking protocols for BLAS backends and cache-aware tensor layouts.
- Risk and governance extension: convert this advanced point into explicit acceptance tests and rollback criteria (design benchmarking protocols for blas backends and cache-aware tensor layouts.).

---
## Beyond Reference: Research to Production Loop
- Start from a benchmarked baseline and publish ablations that isolate each mathematical choice.
- Stress-test with adversarial and out-of-distribution inputs aligned to the module's assumptions.
- Maintain a rollback-safe deployment strategy with guardrails for confidence, drift, and latency budgets.
- Document invariant checks that must remain true after every optimization or refactor.

<!-- DEPTH_EXPANSION_END -->
