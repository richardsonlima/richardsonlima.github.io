---
layout: slides
title: "Matrix Transformations & Eigenvalues"
category: "ai-engineering-course-step-01"
module_number: 3
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
## Module 03: Matrix Transformations
### _Type: Build · Lang: Python, Julia · Time: ~75 minutes_
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
You read about PCA and see "find the eigenvectors of the covariance matrix." You read about model stability and see "check if all eigenvalues have magnitude less than 1." You read about data augmentation and see "apply a random rotation." None of this makes sense until you understand what matrices do to space geometrically.
Matrices are not just grids of numbers. They are spatial machines. A rotation matrix spins points. A scaling matrix stretches them. A shearing matrix tilts them. Every transformation a neural network applies to data is one of these operations or a composition of them. This lesson makes those operations concrete.
---
## Learning Objectives
- Construct rotation, scaling, shearing, and reflection matrices and apply them to 2D and 3D points
- Compose multiple transformations by matrix multiplication and verify that order matters
- Compute eigenvalues and eigenvectors of 2x2 matrices from the characteristic equation
- Explain why eigenvalues determine PCA directions, RNN stability, and spectral clustering behavior
---
## Transformations as matrices
Every linear transformation in 2D can be written as a 2x2 matrix. The matrix tells you exactly where the basis vectors [1, 0] and [0, 1] end up. Everything else follows.
---
## Rotation
A 2D rotation by angle theta keeps distances and angles intact. It moves every point along a circular arc.
In 3D, you rotate around an axis. Each axis has its own rotation matrix:
---
## Scaling
Scaling stretches or compresses along each axis independently.
---
## Shearing
Shearing tilts one axis while keeping the other fixed. It turns rectangles into parallelograms.
Shear matrices:
- `Shx = [[1, k], [0, 1]]` shifts x by k * y
- `Shy = [[1, 0], [k, 1]]` shifts y by k * x
---
## Reflection
Reflection mirrors points across an axis or line.
Reflection matrices:
- Reflect across y-axis: `[[-1, 0], [0, 1]]`
- Reflect across x-axis: `[[1, 0], [0, -1]]`
---
## Composition: chaining transformations
Applying transformation A then B is the same as multiplying their matrices: `result = B @ A @ point`. Order matters. Rotate then scale gives different results than scale then rotate.
Composed: `S @ R = [[0, -2], [0.5, 0]]`
---
## Hands-on Build Path
1. Step 1: Transformation matrices from scratch (Python)
2. Step 2: Composition of transformations
3. Step 3: Eigenvalues from scratch (2x2)
4. Step 4: Determinant as volume scaling factor
Prerequisites: Phase 1, Lessons 01-02 (Linear Algebra Intuition, Vectors & Matrices Operations)
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
- You read about PCA and see "find the eigenvectors of the covariance matrix." You read about model stability and see "check if all eigenvalues have magnitude less than 1." You read about data augmentation and...
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (you read about pca and see "find the eigenvectors of the covariance matrix." you read about model stability and see "check if a...).
- Operational risk check: define a metric and alert tied to this concept before deployment (you read about pca and see "find the eigenvectors of the covariance matrix." you read about model stability and see "...).
- Matrices are not just grids of numbers.
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (matrices are not just grids of numbers).
- Operational risk check: define a metric and alert tied to this concept before deployment (matrices are not just grids of numbers).
- A rotation matrix spins points.
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (a rotation matrix spins points).
- Operational risk check: define a metric and alert tied to this concept before deployment (a rotation matrix spins points).
- A scaling matrix stretches them.
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (a scaling matrix stretches them).
- Operational risk check: define a metric and alert tied to this concept before deployment (a scaling matrix stretches them).

---
## Reference Absorption: The Problem (cont.)
- A shearing matrix tilts them.
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (a shearing matrix tilts them).
- Operational risk check: define a metric and alert tied to this concept before deployment (a shearing matrix tilts them).
- Every transformation a neural network applies to data is one of these operations or a composition of them.
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (every transformation a neural network applies to data is one of these operations or a composition of them).
- Operational risk check: define a metric and alert tied to this concept before deployment (every transformation a neural network applies to data is one of these operations or a composition of them).
- This lesson makes those operations concrete.
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (this lesson makes those operations concrete).
- Operational risk check: define a metric and alert tied to this concept before deployment (this lesson makes those operations concrete).

---
## Reference Absorption: Exercises
- Apply rotation, scaling, and shearing to a unit square (corners at [0,0], [1,0], [1,1], [0,1]).
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (apply rotation, scaling, and shearing to a unit square (corners at [0,0], [1,0], [1,1], [0,1])).
- Operational risk check: define a metric and alert tied to this concept before deployment (apply rotation, scaling, and shearing to a unit square (corners at [0,0], [1,0], [1,1], [0,1])).
- Print the transformed corners for each.
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (print the transformed corners for each).
- Operational risk check: define a metric and alert tied to this concept before deployment (print the transformed corners for each).
- Verify that rotation preserves distances between corners.
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (verify that rotation preserves distances between corners).
- Operational risk check: define a metric and alert tied to this concept before deployment (verify that rotation preserves distances between corners).
- Find the eigenvalues of the matrix [[4, 2], [1, 3]] by hand using the characteristic equation.
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (find the eigenvalues of the matrix [[4, 2], [1, 3]] by hand using the characteristic equation).
- Operational risk check: define a metric and alert tied to this concept before deployment (find the eigenvalues of the matrix [[4, 2], [1, 3]] by hand using the characteristic equation).

---
## Reference Absorption: Exercises (cont.)
- Then verify with your from-scratch function and with NumPy.
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (then verify with your from-scratch function and with numpy).
- Operational risk check: define a metric and alert tied to this concept before deployment (then verify with your from-scratch function and with numpy).
- Create a composition of three transformations (rotate 30 degrees, scale by [1.5, 0.8], shear with kx=0.3) and apply it to 8 points arranged in a circle.
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (create a composition of three transformations (rotate 30 degrees, scale by [1.5, 0.8], shear with kx=0.3) and apply it to 8 poi...).
- Operational risk check: define a metric and alert tied to this concept before deployment (create a composition of three transformations (rotate 30 degrees, scale by [1.5, 0.8], shear with kx=0.3) and apply i...).
- Print before and after coordinates.
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (print before and after coordinates).
- Operational risk check: define a metric and alert tied to this concept before deployment (print before and after coordinates).
- Compute the determinant of the composed matrix and verify it equals the product of the individual determinants.
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (compute the determinant of the composed matrix and verify it equals the product of the individual determinants).
- Operational risk check: define a metric and alert tied to this concept before deployment (compute the determinant of the composed matrix and verify it equals the product of the individual determinants).

---
## Reference Absorption: Key Terms
- Determinant is the product of scale factors.
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (determinant is the product of scale factors).
- Operational risk check: define a metric and alert tied to this concept before deployment (determinant is the product of scale factors).
- Order matters: B @ A means apply A first, then B.
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (order matters: b @ a means apply a first, then b).
- Operational risk check: define a metric and alert tied to this concept before deployment (order matters: b @ a means apply a first, then b).
- The transformation's fingerprint.
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (the transformation's fingerprint).
- Operational risk check: define a metric and alert tied to this concept before deployment (the transformation's fingerprint).
- Can be negative (flip) or complex (rotation).
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (can be negative (flip) or complex (rotation)).
- Operational risk check: define a metric and alert tied to this concept before deployment (can be negative (flip) or complex (rotation)).

---
## Reference Absorption: Key Terms (cont.)
- Zero means the transformation is irreversible.
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (zero means the transformation is irreversible).
- Operational risk check: define a metric and alert tied to this concept before deployment (zero means the transformation is irreversible).
- The polynomial whose roots are the eigenvalues.
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (the polynomial whose roots are the eigenvalues).
- Operational risk check: define a metric and alert tied to this concept before deployment (the polynomial whose roots are the eigenvalues).

---
## Reference Absorption: Step 3: Eigenvalues from scratch (2x2)
- For a 2x2 matrix [[a, b], [c, d]], eigenvalues solve the characteristic equation: lambda^2 - (a+d)*lambda + (ad - bc) = 0.
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (for a 2x2 matrix [[a, b], [c, d]], eigenvalues solve the characteristic equation: lambda^2 - (a+d)*lambda + (ad - bc) = 0).
- Operational risk check: define a metric and alert tied to this concept before deployment (for a 2x2 matrix [[a, b], [c, d]], eigenvalues solve the characteristic equation: lambda^2 - (a+d)*lambda + (ad - bc)...).

---
## Reference Absorption: Use It
- NumPy handles all of this with optimized routines.
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (numpy handles all of this with optimized routines).
- Operational risk check: define a metric and alert tied to this concept before deployment (numpy handles all of this with optimized routines).

---
## Reference Absorption: Rotation
- A 2D rotation by angle theta keeps distances and angles intact.
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (a 2d rotation by angle theta keeps distances and angles intact).
- Operational risk check: define a metric and alert tied to this concept before deployment (a 2d rotation by angle theta keeps distances and angles intact).
- It moves every point along a circular arc.
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (it moves every point along a circular arc).
- Operational risk check: define a metric and alert tied to this concept before deployment (it moves every point along a circular arc).
- In 3D, you rotate around an axis.
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (in 3d, you rotate around an axis).
- Operational risk check: define a metric and alert tied to this concept before deployment (in 3d, you rotate around an axis).
- Each axis has its own rotation matrix:
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (each axis has its own rotation matrix:).
- Operational risk check: define a metric and alert tied to this concept before deployment (each axis has its own rotation matrix:).

---
## Reference Absorption: Eigenvalues and eigenvectors
- Most vectors change direction when a matrix hits them.
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (most vectors change direction when a matrix hits them).
- Operational risk check: define a metric and alert tied to this concept before deployment (most vectors change direction when a matrix hits them).
- Eigenvectors are special: the matrix only scales them, never rotates them.
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (eigenvectors are special: the matrix only scales them, never rotates them).
- Operational risk check: define a metric and alert tied to this concept before deployment (eigenvectors are special: the matrix only scales them, never rotates them).
- The scaling factor is the eigenvalue.
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (the scaling factor is the eigenvalue).
- Operational risk check: define a metric and alert tied to this concept before deployment (the scaling factor is the eigenvalue).
- The matrix stretches space by 3x along [1, 1] and keeps [1, -1] unchanged.
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (the matrix stretches space by 3x along [1, 1] and keeps [1, -1] unchanged).
- Operational risk check: define a metric and alert tied to this concept before deployment (the matrix stretches space by 3x along [1, 1] and keeps [1, -1] unchanged).

---
## Reference Absorption: Eigenvalues and eigenvectors (cont.)
- Every other direction is a mix of these two.
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (every other direction is a mix of these two).
- Operational risk check: define a metric and alert tied to this concept before deployment (every other direction is a mix of these two).

---
## Reference Absorption: Composition: chaining transformations
- Applying transformation A then B is the same as multiplying their matrices: result = B @ A @ point.
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (applying transformation a then b is the same as multiplying their matrices: result = b @ a @ point).
- Operational risk check: define a metric and alert tied to this concept before deployment (applying transformation a then b is the same as multiplying their matrices: result = b @ a @ point).
- Rotate then scale gives different results than scale then rotate.
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (rotate then scale gives different results than scale then rotate).
- Operational risk check: define a metric and alert tied to this concept before deployment (rotate then scale gives different results than scale then rotate).
- Composed: S @ R = [[0, -2], [0.5, 0]]
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (composed: s @ r = [[0, -2], [0.5, 0]]).
- Operational risk check: define a metric and alert tied to this concept before deployment (composed: s @ r = [[0, -2], [0.5, 0]]).
- Composed: R @ S = [[0, -0.5], [2, 0]]
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (composed: r @ s = [[0, -0.5], [2, 0]]).
- Operational risk check: define a metric and alert tied to this concept before deployment (composed: r @ s = [[0, -0.5], [2, 0]]).

---
## Reference Absorption: Composition: chaining transformations (cont.)
- Matrix multiplication is not commutative.
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (matrix multiplication is not commutative).
- Operational risk check: define a metric and alert tied to this concept before deployment (matrix multiplication is not commutative).

---
## Reference Absorption: Why eigenvalues matter
- PCA. The eigenvectors of the covariance matrix are the principal components.
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (pca. the eigenvectors of the covariance matrix are the principal components).
- Operational risk check: define a metric and alert tied to this concept before deployment (pca. the eigenvectors of the covariance matrix are the principal components).
- The eigenvalues tell you how much variance each component captures.
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (the eigenvalues tell you how much variance each component captures).
- Operational risk check: define a metric and alert tied to this concept before deployment (the eigenvalues tell you how much variance each component captures).
- Sort by eigenvalue, keep the top k, and you have dimensionality reduction.
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (sort by eigenvalue, keep the top k, and you have dimensionality reduction).
- Operational risk check: define a metric and alert tied to this concept before deployment (sort by eigenvalue, keep the top k, and you have dimensionality reduction).
- Stability. In recurrent networks and dynamical systems, eigenvalues with magnitude > 1 cause outputs to explode.
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (stability. in recurrent networks and dynamical systems, eigenvalues with magnitude > 1 cause outputs to explode).
- Operational risk check: define a metric and alert tied to this concept before deployment (stability. in recurrent networks and dynamical systems, eigenvalues with magnitude > 1 cause outputs to explode).

---
## Reference Absorption: Why eigenvalues matter (cont.)
- Magnitude < 1 causes them to vanish.
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (magnitude < 1 causes them to vanish).
- Operational risk check: define a metric and alert tied to this concept before deployment (magnitude < 1 causes them to vanish).
- This is the vanishing/exploding gradient problem stated in one sentence.
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (this is the vanishing/exploding gradient problem stated in one sentence).
- Operational risk check: define a metric and alert tied to this concept before deployment (this is the vanishing/exploding gradient problem stated in one sentence).
- Spectral methods. Graph neural networks use eigenvalues of the adjacency matrix.
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (spectral methods. graph neural networks use eigenvalues of the adjacency matrix).
- Operational risk check: define a metric and alert tied to this concept before deployment (spectral methods. graph neural networks use eigenvalues of the adjacency matrix).
- Spectral clustering uses eigenvalues of the Laplacian.
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (spectral clustering uses eigenvalues of the laplacian).
- Operational risk check: define a metric and alert tied to this concept before deployment (spectral clustering uses eigenvalues of the laplacian).

---
## Reference Absorption: Why eigenvalues matter Deep Continuation
- The eigenvectors reveal the structure of the graph.
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (the eigenvectors reveal the structure of the graph).
- Operational risk check: define a metric and alert tied to this concept before deployment (the eigenvectors reveal the structure of the graph).

---
## Reference Absorption: Transformations as matrices
- Every linear transformation in 2D can be written as a 2x2 matrix.
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (every linear transformation in 2d can be written as a 2x2 matrix).
- Operational risk check: define a metric and alert tied to this concept before deployment (every linear transformation in 2d can be written as a 2x2 matrix).
- The matrix tells you exactly where the basis vectors [1, 0] and [0, 1] end up.
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (the matrix tells you exactly where the basis vectors [1, 0] and [0, 1] end up).
- Operational risk check: define a metric and alert tied to this concept before deployment (the matrix tells you exactly where the basis vectors [1, 0] and [0, 1] end up).

---
## Reference Absorption: Shearing
- Shearing tilts one axis while keeping the other fixed.
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (shearing tilts one axis while keeping the other fixed).
- Operational risk check: define a metric and alert tied to this concept before deployment (shearing tilts one axis while keeping the other fixed).
- It turns rectangles into parallelograms.
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (it turns rectangles into parallelograms).
- Operational risk check: define a metric and alert tied to this concept before deployment (it turns rectangles into parallelograms).
- Shx = [[1, k], [0, 1]] shifts x by k * y
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (shx = [[1, k], [0, 1]] shifts x by k * y).
- Operational risk check: define a metric and alert tied to this concept before deployment (shx = [[1, k], [0, 1]] shifts x by k * y).
- Shy = [[1, 0], [k, 1]] shifts y by k * x
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (shy = [[1, 0], [k, 1]] shifts y by k * x).
- Operational risk check: define a metric and alert tied to this concept before deployment (shy = [[1, 0], [k, 1]] shifts y by k * x).

---
## Reference Absorption: Further Reading
- [3Blue1Brown: Linear Transformations](https://www.3blue1brown.com/lessons/linear-transformations) -- visual intuition for how matrices reshape space
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production ([3blue1brown: linear transformations](https://www.3blue1brown.com/lessons/linear-transformations) -- visual intuition for how m...).
- Operational risk check: define a metric and alert tied to this concept before deployment ([3blue1brown: linear transformations](https://www.3blue1brown.com/lessons/linear-transformations) -- visual intuition...).
- [3Blue1Brown: Eigenvectors and Eigenvalues](https://www.3blue1brown.com/lessons/eigenvalues) -- the best visual explanation of what eigenvectors mean geometrically
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production ([3blue1brown: eigenvectors and eigenvalues](https://www.3blue1brown.com/lessons/eigenvalues) -- the best visual explanation of...).
- Operational risk check: define a metric and alert tied to this concept before deployment ([3blue1brown: eigenvectors and eigenvalues](https://www.3blue1brown.com/lessons/eigenvalues) -- the best visual expla...).
- [MIT 18.06 Lecture 21: Eigenvalues and Eigenvectors](https://ocw.mit.edu/courses/18-06-linear-algebra-spring-2010/) -- Gilbert Strang's classic treatment
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production ([mit 18.06 lecture 21: eigenvalues and eigenvectors](https://ocw.mit.edu/courses/18-06-linear-algebra-spring-2010/) -- gilbert...).
- Operational risk check: define a metric and alert tied to this concept before deployment ([mit 18.06 lecture 21: eigenvalues and eigenvectors](https://ocw.mit.edu/courses/18-06-linear-algebra-spring-2010/) -...).

---
## Beyond Reference: Engineering Translation
- Core anchors for this module: matrix, print, eigenvalues, rotate, rotation, scale, theta, subgraph.
- Convert each theoretical primitive into measurable behaviors in training and inference pipelines.
- Define observability checkpoints so regressions are detected before deployment impact.
- Tie mathematical assumptions to concrete data contracts and monitoring thresholds.

---
## Beyond Reference: Advanced Layer 1
- Relate eigenvalue spectra to system dynamics, stability, and iterative convergence rates.
- Risk and governance extension: convert this advanced point into explicit acceptance tests and rollback criteria (relate eigenvalue spectra to system dynamics, stability, and iterative convergence rates.).
- Contrast PCA, randomized SVD, and power iteration in high-dimensional sparse pipelines.
- Risk and governance extension: convert this advanced point into explicit acceptance tests and rollback criteria (contrast pca, randomized svd, and power iteration in high-dimensional sparse pipelines.).
- Explain diagonalization limits for defective matrices and practical fallback decompositions.
- Risk and governance extension: convert this advanced point into explicit acceptance tests and rollback criteria (explain diagonalization limits for defective matrices and practical fallback decompositions.).

---
## Beyond Reference: Research to Production Loop
- Start from a benchmarked baseline and publish ablations that isolate each mathematical choice.
- Stress-test with adversarial and out-of-distribution inputs aligned to the module's assumptions.
- Maintain a rollback-safe deployment strategy with guardrails for confidence, drift, and latency budgets.
- Document invariant checks that must remain true after every optimization or refactor.

<!-- DEPTH_EXPANSION_END -->
