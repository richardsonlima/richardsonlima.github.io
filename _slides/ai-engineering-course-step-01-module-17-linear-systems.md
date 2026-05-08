---
layout: slides
title: "Linear Systems"
category: "ai-engineering-course-step-01"
module_number: 17
complexity: "Build"
lesson_type: "Build"
lang_stack: "Python"
use_math: true
---
layout: true
class: basic-layout
---
class: center, middle, inverse-slide
# Step 01 - Math Foundations
## Module 17: Linear Systems
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
## Why does this matter?
Every time you train a linear regression, you solve a linear system. Every time you compute a least-squares fit, you solve a linear system. Every time a neural network layer computes `y = Wx + b`, it is evaluating one side of a linear system. When you add regularization, you modify the system. When you use Gaussian processes, you factor a matrix. When you invert a covariance matrix for Mahalanobis distance, you solve a linear system.
The equation Ax = b appears everywhere. A is a matrix of known coefficients. b is a vector of known outputs. x is the vector of unknowns you want to find. In linear regression, A is your data matrix, b is your target vector, and x is the weight vector. The entire model reduces to: find x such that Ax is as close to b as possible.
---
## Learning Objectives
- Solve Ax = b using Gaussian elimination with partial pivoting and back substitution
- Factor matrices with LU, QR, and Cholesky decompositions and explain when each is appropriate
- Derive the normal equations for least squares and connect them to linear and ridge regression
- Diagnose ill-conditioned systems using the condition number and apply regularization to stabilize them
---
## What Ax = b means geometrically
A system of linear equations has a geometric interpretation. Each equation defines a hyperplane. The solution is the point (or set of points) where all hyperplanes intersect.
Three things can happen:
1. Unique solution: full-rank square system
2. Infinite solutions: underdetermined or rank-deficient system
3. No solution: inconsistent equations
Rank conditions:
$$
\mathrm{rank}(A)=\mathrm{rank}([A|b])=n \Rightarrow \text{unique solution}
$$
---
## Column picture vs row picture
There are two ways to read Ax = b.
**Row picture.** Each row of A defines one equation. Each equation is a hyperplane. The solution is where they all intersect.
---
## Gaussian elimination
Gaussian elimination transforms Ax = b into an upper triangular system Ux = c that you solve by back substitution. It is the most direct method.
The algorithm:
---
## Partial pivoting: why it matters
Without pivoting, Gaussian elimination can fail or produce garbage. If a pivot element is zero, you divide by zero. If it is small, you amplify rounding errors.
In floating-point arithmetic with limited precision, the unpivoted version can lose significant digits. Partial pivoting always selects the largest available pivot to minimize error amplification.
---
## LU decomposition
LU decomposition factors A into a lower triangular matrix L and an upper triangular matrix U: A = LU. The L matrix stores the multipliers from Gaussian elimination. The U matrix is the result of elimination.
Why factor instead of just eliminating? Because once you have L and U, solving Ax = b for any new b costs only O(n^2):
---
## QR decomposition
QR decomposition factors A into an orthogonal matrix Q and an upper triangular matrix R: A = QR.
An orthogonal matrix has the property Q^T Q = I. Its columns are orthonormal vectors. Multiplying by Q preserves lengths and angles.
---
## Hands-on Build Path
1. Step 1: Gaussian elimination with partial pivoting
2. Step 2: LU decomposition
3. Step 3: Cholesky decomposition
4. Step 4: Least squares via normal equations
5. Step 5: Condition number
Prerequisites: Phase 1, Lessons 01 (Linear Algebra Intuition), 02 (Vectors & Matrices), 03 (Matrix Transformations)
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
- Every time you train a linear regression, you solve a linear system.
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (every time you train a linear regression, you solve a linear system).
- Operational risk check: define a metric and alert tied to this concept before deployment (every time you train a linear regression, you solve a linear system).
- Every time you compute a least-squares fit, you solve a linear system.
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (every time you compute a least-squares fit, you solve a linear system).
- Operational risk check: define a metric and alert tied to this concept before deployment (every time you compute a least-squares fit, you solve a linear system).
- Every time a neural network layer computes y = Wx + b, it is evaluating one side of a linear system.
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (every time a neural network layer computes y = wx + b, it is evaluating one side of a linear system).
- Operational risk check: define a metric and alert tied to this concept before deployment (every time a neural network layer computes y = wx + b, it is evaluating one side of a linear system).
- When you add regularization, you modify the system.
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (when you add regularization, you modify the system).
- Operational risk check: define a metric and alert tied to this concept before deployment (when you add regularization, you modify the system).

---
## Reference Absorption: The Problem (cont.)
- When you use Gaussian processes, you factor a matrix.
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (when you use gaussian processes, you factor a matrix).
- Operational risk check: define a metric and alert tied to this concept before deployment (when you use gaussian processes, you factor a matrix).
- When you invert a covariance matrix for Mahalanobis distance, you solve a linear system.
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (when you invert a covariance matrix for mahalanobis distance, you solve a linear system).
- Operational risk check: define a metric and alert tied to this concept before deployment (when you invert a covariance matrix for mahalanobis distance, you solve a linear system).
- The equation Ax = b appears everywhere.
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (the equation ax = b appears everywhere).
- Operational risk check: define a metric and alert tied to this concept before deployment (the equation ax = b appears everywhere).
- A is a matrix of known coefficients.
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (a is a matrix of known coefficients).
- Operational risk check: define a metric and alert tied to this concept before deployment (a is a matrix of known coefficients).

---
## Reference Absorption: The Problem Deep Continuation
- b is a vector of known outputs.
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (b is a vector of known outputs).
- Operational risk check: define a metric and alert tied to this concept before deployment (b is a vector of known outputs).
- x is the vector of unknowns you want to find.
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (x is the vector of unknowns you want to find).
- Operational risk check: define a metric and alert tied to this concept before deployment (x is the vector of unknowns you want to find).
- In linear regression, A is your data matrix, b is your target vector, and x is the weight vector.
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (in linear regression, a is your data matrix, b is your target vector, and x is the weight vector).
- Operational risk check: define a metric and alert tied to this concept before deployment (in linear regression, a is your data matrix, b is your target vector, and x is the weight vector).
- The entire model reduces to: find x such that Ax is as close to b as possible.
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (the entire model reduces to: find x such that ax is as close to b as possible).
- Operational risk check: define a metric and alert tied to this concept before deployment (the entire model reduces to: find x such that ax is as close to b as possible).

---
## Reference Absorption: The Problem Deep Continuation
- This lesson builds every major method for solving that equation from scratch.
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (this lesson builds every major method for solving that equation from scratch).
- Operational risk check: define a metric and alert tied to this concept before deployment (this lesson builds every major method for solving that equation from scratch).
- You will understand why some methods are fast and others are stable, why some work only for square systems and others handle overdetermined ones, and why the condition number of your matrix determines whethe...
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (you will understand why some methods are fast and others are stable, why some work only for square systems and others handle ov...).
- Operational risk check: define a metric and alert tied to this concept before deployment (you will understand why some methods are fast and others are stable, why some work only for square systems and others...).

---
## Reference Absorption: Exercises
- Solve the system [[1,2,3],[4,5,6],[7,8,10]] x = [6, 15, 27] using your Gaussian elimination, your LU solver, and np.linalg.solve.
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (solve the system [[1,2,3],[4,5,6],[7,8,10]] x = [6, 15, 27] using your gaussian elimination, your lu solver, and np.linalg.solve).
- Operational risk check: define a metric and alert tied to this concept before deployment (solve the system [[1,2,3],[4,5,6],[7,8,10]] x = [6, 15, 27] using your gaussian elimination, your lu solver, and np.l...).
- Verify all three give the same answer within floating-point tolerance.
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (verify all three give the same answer within floating-point tolerance).
- Operational risk check: define a metric and alert tied to this concept before deployment (verify all three give the same answer within floating-point tolerance).
- Generate a 50x5 random matrix X and target y = X @ w_true + noise.
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (generate a 50x5 random matrix x and target y = x @ w_true + noise).
- Operational risk check: define a metric and alert tied to this concept before deployment (generate a 50x5 random matrix x and target y = x @ w_true + noise).
- Solve for w using normal equations, QR (via np.linalg.qr), SVD (via np.linalg.svd), and np.linalg.lstsq.
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (solve for w using normal equations, qr (via np.linalg.qr), svd (via np.linalg.svd), and np.linalg.lstsq).
- Operational risk check: define a metric and alert tied to this concept before deployment (solve for w using normal equations, qr (via np.linalg.qr), svd (via np.linalg.svd), and np.linalg.lstsq).

---
## Reference Absorption: Exercises (cont.)
- Measure the condition number of X^T X and explain how it affects which method you trust.
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (measure the condition number of x^t x and explain how it affects which method you trust).
- Operational risk check: define a metric and alert tied to this concept before deployment (measure the condition number of x^t x and explain how it affects which method you trust).
- Create a nearly singular matrix by making two columns almost identical (e.g., column 2 = column 1 + 1e-10 * noise).
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (create a nearly singular matrix by making two columns almost identical (e.g., column 2 = column 1 + 1e-10 * noise)).
- Operational risk check: define a metric and alert tied to this concept before deployment (create a nearly singular matrix by making two columns almost identical (e.g., column 2 = column 1 + 1e-10 * noise)).
- Compute its condition number.
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (compute its condition number).
- Operational risk check: define a metric and alert tied to this concept before deployment (compute its condition number).
- Solve Ax = b with and without regularization (add 0.01 * I).
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (solve ax = b with and without regularization (add 0.01 * i)).
- Operational risk check: define a metric and alert tied to this concept before deployment (solve ax = b with and without regularization (add 0.01 * i)).

---
## Reference Absorption: Exercises Deep Continuation
- Compare the solutions and residuals.
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (compare the solutions and residuals).
- Operational risk check: define a metric and alert tied to this concept before deployment (compare the solutions and residuals).
- Explain why regularization helps.
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (explain why regularization helps).
- Operational risk check: define a metric and alert tied to this concept before deployment (explain why regularization helps).
- Implement the conjugate gradient algorithm for a 100x100 random symmetric positive definite matrix.
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (implement the conjugate gradient algorithm for a 100x100 random symmetric positive definite matrix).
- Operational risk check: define a metric and alert tied to this concept before deployment (implement the conjugate gradient algorithm for a 100x100 random symmetric positive definite matrix).
- Count how many iterations it takes to converge to tolerance 1e-8.
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (count how many iterations it takes to converge to tolerance 1e-8).
- Operational risk check: define a metric and alert tied to this concept before deployment (count how many iterations it takes to converge to tolerance 1e-8).

---
## Reference Absorption: Exercises Deep Continuation
- Compare with the theoretical maximum of n iterations.
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (compare with the theoretical maximum of n iterations).
- Operational risk check: define a metric and alert tied to this concept before deployment (compare with the theoretical maximum of n iterations).
- Time your Cholesky solver vs your LU solver vs np.linalg.solve on symmetric positive definite matrices of size 10, 50, 200, 500.
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (time your cholesky solver vs your lu solver vs np.linalg.solve on symmetric positive definite matrices of size 10, 50, 200, 500).
- Operational risk check: define a metric and alert tied to this concept before deployment (time your cholesky solver vs your lu solver vs np.linalg.solve on symmetric positive definite matrices of size 10, 50...).
- Verify Cholesky is roughly 2x faster than LU.
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (verify cholesky is roughly 2x faster than lu).
- Operational risk check: define a metric and alert tied to this concept before deployment (verify cholesky is roughly 2x faster than lu).

---
## Reference Absorption: Key Terms
- Finding x means finding the input that produces output b under transformation A.
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (finding x means finding the input that produces output b under transformation a).
- Operational risk check: define a metric and alert tied to this concept before deployment (finding x means finding the input that produces output b under transformation a).
- Prevents division by small numbers.
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (prevents division by small numbers).
- Operational risk check: define a metric and alert tied to this concept before deployment (prevents division by small numbers).
- Amortizes the O(n^3) cost over multiple solves.
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (amortizes the o(n^3) cost over multiple solves).
- Operational risk check: define a metric and alert tied to this concept before deployment (amortizes the o(n^3) cost over multiple solves).
- More stable than LU for least squares.
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (more stable than lu for least squares).
- Operational risk check: define a metric and alert tied to this concept before deployment (more stable than lu for least squares).

---
## Reference Absorption: Key Terms (cont.)
- Used for covariance matrices, kernel matrices, and ridge regression.
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (used for covariance matrices, kernel matrices, and ridge regression).
- Operational risk check: define a metric and alert tied to this concept before deployment (used for covariance matrices, kernel matrices, and ridge regression).
- This IS the closed-form solution to linear regression.
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (this is the closed-form solution to linear regression).
- Operational risk check: define a metric and alert tied to this concept before deployment (this is the closed-form solution to linear regression).
- Gives the minimum-norm least-squares solution for any matrix, square or rectangular, singular or not.
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (gives the minimum-norm least-squares solution for any matrix, square or rectangular, singular or not).
- Operational risk check: define a metric and alert tied to this concept before deployment (gives the minimum-norm least-squares solution for any matrix, square or rectangular, singular or not).
- Measures sensitivity to input perturbations.
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (measures sensitivity to input perturbations).
- Operational risk check: define a metric and alert tied to this concept before deployment (measures sensitivity to input perturbations).

---
## Reference Absorption: Key Terms Deep Continuation
- Lose about log10(kappa) digits of precision.
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (lose about log10(kappa) digits of precision).
- Operational risk check: define a metric and alert tied to this concept before deployment (lose about log10(kappa) digits of precision).
- Adding lambda I improves conditioning and shrinks weights toward zero.
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (adding lambda i improves conditioning and shrinks weights toward zero).
- Operational risk check: define a metric and alert tied to this concept before deployment (adding lambda i improves conditioning and shrinks weights toward zero).
- Converges in at most n steps.
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (converges in at most n steps).
- Operational risk check: define a metric and alert tied to this concept before deployment (converges in at most n steps).
- Practical for large sparse systems where factorization is too expensive.
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (practical for large sparse systems where factorization is too expensive).
- Operational risk check: define a metric and alert tied to this concept before deployment (practical for large sparse systems where factorization is too expensive).

---
## Reference Absorption: Key Terms Deep Continuation
- Least squares finds the best approximation.
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (least squares finds the best approximation).
- Operational risk check: define a metric and alert tied to this concept before deployment (least squares finds the best approximation).
- This is every regression problem.
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (this is every regression problem).
- Operational risk check: define a metric and alert tied to this concept before deployment (this is every regression problem).
- Used in the L step of LU solves.
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (used in the l step of lu solves).
- Operational risk check: define a metric and alert tied to this concept before deployment (used in the l step of lu solves).

---
## Reference Absorption: Gaussian elimination
- Gaussian elimination transforms Ax = b into an upper triangular system Ux = c that you solve by back substitution.
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (gaussian elimination transforms ax = b into an upper triangular system ux = c that you solve by back substitution).
- Operational risk check: define a metric and alert tied to this concept before deployment (gaussian elimination transforms ax = b into an upper triangular system ux = c that you solve by back substitution).
- It is the most direct method.
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (it is the most direct method).
- Operational risk check: define a metric and alert tied to this concept before deployment (it is the most direct method).
- Gaussian elimination costs O(n^3) operations.
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (gaussian elimination costs o(n^3) operations).
- Operational risk check: define a metric and alert tied to this concept before deployment (gaussian elimination costs o(n^3) operations).
- For a 1000x1000 system, that is about a billion floating-point operations.
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (for a 1000x1000 system, that is about a billion floating-point operations).
- Operational risk check: define a metric and alert tied to this concept before deployment (for a 1000x1000 system, that is about a billion floating-point operations).

---
## Reference Absorption: Gaussian elimination (cont.)
- Fast, but you can do better if you need to solve multiple systems with the same A.
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (fast, but you can do better if you need to solve multiple systems with the same a).
- Operational risk check: define a metric and alert tied to this concept before deployment (fast, but you can do better if you need to solve multiple systems with the same a).

---
## Reference Absorption: Connection to ML
- Every method in this lesson appears in production ML:
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (every method in this lesson appears in production ml:).
- Operational risk check: define a metric and alert tied to this concept before deployment (every method in this lesson appears in production ml:).
- Linear regression. The closed-form solution solves the normal equations X^T X w = X^T y.
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (linear regression. the closed-form solution solves the normal equations x^t x w = x^t y).
- Operational risk check: define a metric and alert tied to this concept before deployment (linear regression. the closed-form solution solves the normal equations x^t x w = x^t y).
- This is done via Cholesky (if n is small) or QR (if numerical stability matters) or SVD (if the matrix might be rank-deficient).
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (this is done via cholesky (if n is small) or qr (if numerical stability matters) or svd (if the matrix might be rank-deficient)).
- Operational risk check: define a metric and alert tied to this concept before deployment (this is done via cholesky (if n is small) or qr (if numerical stability matters) or svd (if the matrix might be rank-...).
- Ridge regression. Adds lambda * I to X^T X.
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (ridge regression. adds lambda * i to x^t x).
- Operational risk check: define a metric and alert tied to this concept before deployment (ridge regression. adds lambda * i to x^t x).

---
## Reference Absorption: Connection to ML (cont.)
- The regularized system (X^T X + lambda * I) w = X^T y is always solvable via Cholesky because X^T X + lambda * I is symmetric positive definite for lambda > 0.
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (the regularized system (x^t x + lambda * i) w = x^t y is always solvable via cholesky because x^t x + lambda * i is symmetric p...).
- Operational risk check: define a metric and alert tied to this concept before deployment (the regularized system (x^t x + lambda * i) w = x^t y is always solvable via cholesky because x^t x + lambda * i is s...).
- Gaussian processes. The predictive mean requires solving K alpha = y where K is the kernel matrix.
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (gaussian processes. the predictive mean requires solving k alpha = y where k is the kernel matrix).
- Operational risk check: define a metric and alert tied to this concept before deployment (gaussian processes. the predictive mean requires solving k alpha = y where k is the kernel matrix).
- Cholesky factorization of K is the standard approach.
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (cholesky factorization of k is the standard approach).
- Operational risk check: define a metric and alert tied to this concept before deployment (cholesky factorization of k is the standard approach).
- The log marginal likelihood uses log det(K) = 2 sum(log(diag(L))).
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (the log marginal likelihood uses log det(k) = 2 sum(log(diag(l)))).
- Operational risk check: define a metric and alert tied to this concept before deployment (the log marginal likelihood uses log det(k) = 2 sum(log(diag(l)))).

---
## Reference Absorption: Connection to ML Deep Continuation
- Neural network initialization. Orthogonal initialization uses QR decomposition to create weight matrices whose columns are orthonormal.
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (neural network initialization. orthogonal initialization uses qr decomposition to create weight matrices whose columns are orth...).
- Operational risk check: define a metric and alert tied to this concept before deployment (neural network initialization. orthogonal initialization uses qr decomposition to create weight matrices whose column...).
- This prevents signal collapse in deep networks.
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (this prevents signal collapse in deep networks).
- Operational risk check: define a metric and alert tied to this concept before deployment (this prevents signal collapse in deep networks).
- Preconditioning. Large-scale optimizers use incomplete Cholesky or incomplete LU as preconditioners for conjugate gradient solvers.
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (preconditioning. large-scale optimizers use incomplete cholesky or incomplete lu as preconditioners for conjugate gradient solvers).
- Operational risk check: define a metric and alert tied to this concept before deployment (preconditioning. large-scale optimizers use incomplete cholesky or incomplete lu as preconditioners for conjugate gra...).
- Feature engineering. The condition number of X^T X tells you if your features are collinear.
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (feature engineering. the condition number of x^t x tells you if your features are collinear).
- Operational risk check: define a metric and alert tied to this concept before deployment (feature engineering. the condition number of x^t x tells you if your features are collinear).

---
## Reference Absorption: Connection to ML Deep Continuation
- If kappa is large, drop features or add regularization.
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (if kappa is large, drop features or add regularization).
- Operational risk check: define a metric and alert tied to this concept before deployment (if kappa is large, drop features or add regularization).

---
## Reference Absorption: Iterative methods: conjugate gradient
- For very large sparse systems (millions of unknowns), direct methods like LU or Cholesky are too expensive.
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (for very large sparse systems (millions of unknowns), direct methods like lu or cholesky are too expensive).
- Operational risk check: define a metric and alert tied to this concept before deployment (for very large sparse systems (millions of unknowns), direct methods like lu or cholesky are too expensive).
- Iterative methods approximate the solution by improving a guess over many iterations.
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (iterative methods approximate the solution by improving a guess over many iterations).
- Operational risk check: define a metric and alert tied to this concept before deployment (iterative methods approximate the solution by improving a guess over many iterations).
- Conjugate gradient (CG) solves Ax = b when A is symmetric positive definite.
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (conjugate gradient (cg) solves ax = b when a is symmetric positive definite).
- Operational risk check: define a metric and alert tied to this concept before deployment (conjugate gradient (cg) solves ax = b when a is symmetric positive definite).
- It finds the exact solution in at most n iterations (in exact arithmetic), but typically converges much faster if the eigenvalues of A are clustered.
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (it finds the exact solution in at most n iterations (in exact arithmetic), but typically converges much faster if the eigenvalu...).
- Operational risk check: define a metric and alert tied to this concept before deployment (it finds the exact solution in at most n iterations (in exact arithmetic), but typically converges much faster if the...).

---
## Reference Absorption: Iterative methods: conjugate gradient (cont.)
- Large-scale optimization (Newton-CG method)
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (large-scale optimization (newton-cg method)).
- Operational risk check: define a metric and alert tied to this concept before deployment (large-scale optimization (newton-cg method)).
- Kernel methods where the kernel matrix is too large to factor
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (kernel methods where the kernel matrix is too large to factor).
- Operational risk check: define a metric and alert tied to this concept before deployment (kernel methods where the kernel matrix is too large to factor).
- Preconditioning for other iterative solvers
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (preconditioning for other iterative solvers).
- Operational risk check: define a metric and alert tied to this concept before deployment (preconditioning for other iterative solvers).
- The convergence rate depends on the condition number.
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (the convergence rate depends on the condition number).
- Operational risk check: define a metric and alert tied to this concept before deployment (the convergence rate depends on the condition number).

---
## Reference Absorption: Iterative methods: conjugate gradient Deep Continuation
- Better conditioned systems converge faster, which is another reason regularization helps.
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (better conditioned systems converge faster, which is another reason regularization helps).
- Operational risk check: define a metric and alert tied to this concept before deployment (better conditioned systems converge faster, which is another reason regularization helps).

---
## Reference Absorption: Cholesky decomposition
- When A is symmetric (A = A^T) and positive definite (all eigenvalues positive), you can factor it as A = L L^T where L is lower triangular.
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (when a is symmetric (a = a^t) and positive definite (all eigenvalues positive), you can factor it as a = l l^t where l is lower...).
- Operational risk check: define a metric and alert tied to this concept before deployment (when a is symmetric (a = a^t) and positive definite (all eigenvalues positive), you can factor it as a = l l^t where...).
- This is the Cholesky decomposition.
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (this is the cholesky decomposition).
- Operational risk check: define a metric and alert tied to this concept before deployment (this is the cholesky decomposition).
- Cholesky is twice as fast as LU and requires half the storage.
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (cholesky is twice as fast as lu and requires half the storage).
- Operational risk check: define a metric and alert tied to this concept before deployment (cholesky is twice as fast as lu and requires half the storage).
- It only works for symmetric positive definite matrices, but those show up constantly:
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (it only works for symmetric positive definite matrices, but those show up constantly:).
- Operational risk check: define a metric and alert tied to this concept before deployment (it only works for symmetric positive definite matrices, but those show up constantly:).

---
## Reference Absorption: Cholesky decomposition (cont.)
- Covariance matrices are symmetric positive semi-definite (positive definite with regularization).
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (covariance matrices are symmetric positive semi-definite (positive definite with regularization)).
- Operational risk check: define a metric and alert tied to this concept before deployment (covariance matrices are symmetric positive semi-definite (positive definite with regularization)).
- The kernel matrix in Gaussian processes is symmetric positive definite.
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (the kernel matrix in gaussian processes is symmetric positive definite).
- Operational risk check: define a metric and alert tied to this concept before deployment (the kernel matrix in gaussian processes is symmetric positive definite).
- The Hessian of a convex function at a minimum is symmetric positive definite.
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (the hessian of a convex function at a minimum is symmetric positive definite).
- Operational risk check: define a metric and alert tied to this concept before deployment (the hessian of a convex function at a minimum is symmetric positive definite).
- A^T A is always symmetric positive semi-definite.
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (a^t a is always symmetric positive semi-definite).
- Operational risk check: define a metric and alert tied to this concept before deployment (a^t a is always symmetric positive semi-definite).

---
## Reference Absorption: Cholesky decomposition Deep Continuation
- In Gaussian processes, you factor the kernel matrix K with Cholesky, then solve K alpha = y to get the predictive mean.
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (in gaussian processes, you factor the kernel matrix k with cholesky, then solve k alpha = y to get the predictive mean).
- Operational risk check: define a metric and alert tied to this concept before deployment (in gaussian processes, you factor the kernel matrix k with cholesky, then solve k alpha = y to get the predictive mean).
- The Cholesky factor also gives you the log-determinant for the marginal likelihood: log det(K) = 2 * sum(log(diag(L))).
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (the cholesky factor also gives you the log-determinant for the marginal likelihood: log det(k) = 2 * sum(log(diag(l)))).
- Operational risk check: define a metric and alert tied to this concept before deployment (the cholesky factor also gives you the log-determinant for the marginal likelihood: log det(k) = 2 * sum(log(diag(l)))).

---
## Reference Absorption: Condition number
- The condition number measures how sensitive the solution is to small changes in the input.
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (the condition number measures how sensitive the solution is to small changes in the input).
- Operational risk check: define a metric and alert tied to this concept before deployment (the condition number measures how sensitive the solution is to small changes in the input).
- For a matrix A, the condition number is:
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (for a matrix a, the condition number is:).
- Operational risk check: define a metric and alert tied to this concept before deployment (for a matrix a, the condition number is:).
- where sigma_max and sigma_min are the largest and smallest singular values.
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (where sigma_max and sigma_min are the largest and smallest singular values).
- Operational risk check: define a metric and alert tied to this concept before deployment (where sigma_max and sigma_min are the largest and smallest singular values).
- kappa < 100: safe, solution is accurate.
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (kappa < 100: safe, solution is accurate).
- Operational risk check: define a metric and alert tied to this concept before deployment (kappa < 100: safe, solution is accurate).

---
## Reference Absorption: Condition number (cont.)
- kappa ~ 10^k: you lose about k digits of precision from your floating-point arithmetic.
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (kappa ~ 10^k: you lose about k digits of precision from your floating-point arithmetic).
- Operational risk check: define a metric and alert tied to this concept before deployment (kappa ~ 10^k: you lose about k digits of precision from your floating-point arithmetic).
- kappa ~ 10^16 (for float64): the solution is meaningless. The matrix is effectively singular.
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (kappa ~ 10^16 (for float64): the solution is meaningless. the matrix is effectively singular).
- Operational risk check: define a metric and alert tied to this concept before deployment (kappa ~ 10^16 (for float64): the solution is meaningless. the matrix is effectively singular).
- In ML, ill-conditioning happens when features are nearly collinear.
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (in ml, ill-conditioning happens when features are nearly collinear).
- Operational risk check: define a metric and alert tied to this concept before deployment (in ml, ill-conditioning happens when features are nearly collinear).
- Regularization (adding lambda * I) improves the condition number from sigma_max / sigma_min to (sigma_max + lambda) / (sigma_min + lambda).
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (regularization (adding lambda * i) improves the condition number from sigma_max / sigma_min to (sigma_max + lambda) / (sigma_mi...).
- Operational risk check: define a metric and alert tied to this concept before deployment (regularization (adding lambda * i) improves the condition number from sigma_max / sigma_min to (sigma_max + lambda) /...).

---
## Reference Absorption: What Ax = b means geometrically
- A system of linear equations has a geometric interpretation.
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (a system of linear equations has a geometric interpretation).
- Operational risk check: define a metric and alert tied to this concept before deployment (a system of linear equations has a geometric interpretation).
- Each equation defines a hyperplane.
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (each equation defines a hyperplane).
- Operational risk check: define a metric and alert tied to this concept before deployment (each equation defines a hyperplane).
- The solution is the point (or set of points) where all hyperplanes intersect.
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (the solution is the point (or set of points) where all hyperplanes intersect).
- Operational risk check: define a metric and alert tied to this concept before deployment (the solution is the point (or set of points) where all hyperplanes intersect).
- In matrix form, "one solution" means A is invertible.
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (in matrix form, "one solution" means a is invertible).
- Operational risk check: define a metric and alert tied to this concept before deployment (in matrix form, "one solution" means a is invertible).

---
## Reference Absorption: What Ax = b means geometrically (cont.)
- "No solution" means the system is inconsistent.
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production ("no solution" means the system is inconsistent).
- Operational risk check: define a metric and alert tied to this concept before deployment ("no solution" means the system is inconsistent).
- "Infinite solutions" means A has a null space.
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production ("infinite solutions" means a has a null space).
- Operational risk check: define a metric and alert tied to this concept before deployment ("infinite solutions" means a has a null space).
- Most ML problems fall in the "no exact solution" category because you have more equations (data points) than unknowns (parameters).
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (most ml problems fall in the "no exact solution" category because you have more equations (data points) than unknowns (parameters)).
- Operational risk check: define a metric and alert tied to this concept before deployment (most ml problems fall in the "no exact solution" category because you have more equations (data points) than unknowns...).
- That is where least squares comes in.
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (that is where least squares comes in).
- Operational risk check: define a metric and alert tied to this concept before deployment (that is where least squares comes in).

---
## Reference Absorption: Partial pivoting: why it matters
- Without pivoting, Gaussian elimination can fail or produce garbage.
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (without pivoting, gaussian elimination can fail or produce garbage).
- Operational risk check: define a metric and alert tied to this concept before deployment (without pivoting, gaussian elimination can fail or produce garbage).
- If a pivot element is zero, you divide by zero.
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (if a pivot element is zero, you divide by zero).
- Operational risk check: define a metric and alert tied to this concept before deployment (if a pivot element is zero, you divide by zero).
- If it is small, you amplify rounding errors.
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (if it is small, you amplify rounding errors).
- Operational risk check: define a metric and alert tied to this concept before deployment (if it is small, you amplify rounding errors).
- In floating-point arithmetic with limited precision, the unpivoted version can lose significant digits.
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (in floating-point arithmetic with limited precision, the unpivoted version can lose significant digits).
- Operational risk check: define a metric and alert tied to this concept before deployment (in floating-point arithmetic with limited precision, the unpivoted version can lose significant digits).

---
## Reference Absorption: Partial pivoting: why it matters (cont.)
- Partial pivoting always selects the largest available pivot to minimize error amplification.
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (partial pivoting always selects the largest available pivot to minimize error amplification).
- Operational risk check: define a metric and alert tied to this concept before deployment (partial pivoting always selects the largest available pivot to minimize error amplification).

---
## Reference Absorption: QR decomposition
- QR decomposition factors A into an orthogonal matrix Q and an upper triangular matrix R: A = QR.
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (qr decomposition factors a into an orthogonal matrix q and an upper triangular matrix r: a = qr).
- Operational risk check: define a metric and alert tied to this concept before deployment (qr decomposition factors a into an orthogonal matrix q and an upper triangular matrix r: a = qr).
- An orthogonal matrix has the property Q^T Q = I.
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (an orthogonal matrix has the property q^t q = i).
- Operational risk check: define a metric and alert tied to this concept before deployment (an orthogonal matrix has the property q^t q = i).
- Its columns are orthonormal vectors.
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (its columns are orthonormal vectors).
- Operational risk check: define a metric and alert tied to this concept before deployment (its columns are orthonormal vectors).
- Multiplying by Q preserves lengths and angles.
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (multiplying by q preserves lengths and angles).
- Operational risk check: define a metric and alert tied to this concept before deployment (multiplying by q preserves lengths and angles).

---
## Reference Absorption: QR decomposition (cont.)
- QR is numerically more stable than LU for solving least-squares problems.
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (qr is numerically more stable than lu for solving least-squares problems).
- Operational risk check: define a metric and alert tied to this concept before deployment (qr is numerically more stable than lu for solving least-squares problems).
- The Gram-Schmidt process builds Q column by column:
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (the gram-schmidt process builds q column by column:).
- Operational risk check: define a metric and alert tied to this concept before deployment (the gram-schmidt process builds q column by column:).
- Each step removes the component along all previous q vectors, leaving only the new orthogonal direction.
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (each step removes the component along all previous q vectors, leaving only the new orthogonal direction).
- Operational risk check: define a metric and alert tied to this concept before deployment (each step removes the component along all previous q vectors, leaving only the new orthogonal direction).

---
## Reference Absorption: Least squares: when Ax = b has no exact solution
- If A is m x n with m > n (more equations than unknowns), the system is overdetermined.
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (if a is m x n with m > n (more equations than unknowns), the system is overdetermined).
- Operational risk check: define a metric and alert tied to this concept before deployment (if a is m x n with m > n (more equations than unknowns), the system is overdetermined).
- Instead, you minimize the squared error:
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (instead, you minimize the squared error:).
- Operational risk check: define a metric and alert tied to this concept before deployment (instead, you minimize the squared error:).
- The minimizer satisfies the normal equations:
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (the minimizer satisfies the normal equations:).
- Operational risk check: define a metric and alert tied to this concept before deployment (the minimizer satisfies the normal equations:).
- Take the gradient with respect to x, set it to zero: 2 A^T A x - 2 A^T b = 0.
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (take the gradient with respect to x, set it to zero: 2 a^t a x - 2 a^t b = 0).
- Operational risk check: define a metric and alert tied to this concept before deployment (take the gradient with respect to x, set it to zero: 2 a^t a x - 2 a^t b = 0).

---
## Reference Absorption: LU decomposition
- LU decomposition factors A into a lower triangular matrix L and an upper triangular matrix U: A = LU.
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (lu decomposition factors a into a lower triangular matrix l and an upper triangular matrix u: a = lu).
- Operational risk check: define a metric and alert tied to this concept before deployment (lu decomposition factors a into a lower triangular matrix l and an upper triangular matrix u: a = lu).
- The L matrix stores the multipliers from Gaussian elimination.
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (the l matrix stores the multipliers from gaussian elimination).
- Operational risk check: define a metric and alert tied to this concept before deployment (the l matrix stores the multipliers from gaussian elimination).
- The U matrix is the result of elimination.
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (the u matrix is the result of elimination).
- Operational risk check: define a metric and alert tied to this concept before deployment (the u matrix is the result of elimination).
- Why factor instead of just eliminating?
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (why factor instead of just eliminating?).
- Operational risk check: define a metric and alert tied to this concept before deployment (why factor instead of just eliminating?).

---
## Reference Absorption: LU decomposition (cont.)
- Because once you have L and U, solving Ax = b for any new b costs only O(n^2):
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (because once you have l and u, solving ax = b for any new b costs only o(n^2):).
- Operational risk check: define a metric and alert tied to this concept before deployment (because once you have l and u, solving ax = b for any new b costs only o(n^2):).
- The O(n^3) cost is paid once during factorization.
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (the o(n^3) cost is paid once during factorization).
- Operational risk check: define a metric and alert tied to this concept before deployment (the o(n^3) cost is paid once during factorization).
- Every subsequent solve is O(n^2).
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (every subsequent solve is o(n^2)).
- Operational risk check: define a metric and alert tied to this concept before deployment (every subsequent solve is o(n^2)).
- If you need to solve 1000 systems with the same A but different b vectors, LU saves a factor of 1000/3 in total work.
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (if you need to solve 1000 systems with the same a but different b vectors, lu saves a factor of 1000/3 in total work).
- Operational risk check: define a metric and alert tied to this concept before deployment (if you need to solve 1000 systems with the same a but different b vectors, lu saves a factor of 1000/3 in total work).

---
## Reference Absorption: LU decomposition Deep Continuation
- With partial pivoting, you get PA = LU where P is a permutation matrix recording the row swaps.
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (with partial pivoting, you get pa = lu where p is a permutation matrix recording the row swaps).
- Operational risk check: define a metric and alert tied to this concept before deployment (with partial pivoting, you get pa = lu where p is a permutation matrix recording the row swaps).

---
## Reference Absorption: Normal equations = linear regression
- In linear regression, your data matrix X has one row per sample and one column per feature.
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (in linear regression, your data matrix x has one row per sample and one column per feature).
- Operational risk check: define a metric and alert tied to this concept before deployment (in linear regression, your data matrix x has one row per sample and one column per feature).
- Your target vector y has one entry per sample.
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (your target vector y has one entry per sample).
- Operational risk check: define a metric and alert tied to this concept before deployment (your target vector y has one entry per sample).
- The weight vector w satisfies:
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (the weight vector w satisfies:).
- Operational risk check: define a metric and alert tied to this concept before deployment (the weight vector w satisfies:).
- This is the closed-form solution to linear regression.
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (this is the closed-form solution to linear regression).
- Operational risk check: define a metric and alert tied to this concept before deployment (this is the closed-form solution to linear regression).

---
## Beyond Reference: Engineering Translation
- Core anchors for this module: matrix, solve, linear, solution, system, regression, cholesky, ridge.
- Convert each theoretical primitive into measurable behaviors in training and inference pipelines.
- Define observability checkpoints so regressions are detected before deployment impact.
- Tie mathematical assumptions to concrete data contracts and monitoring thresholds.

---
## Beyond Reference: Advanced Layer 1
- Analyze iterative solver convergence using spectral radius and preconditioning quality.
- Risk and governance extension: convert this advanced point into explicit acceptance tests and rollback criteria (analyze iterative solver convergence using spectral radius and preconditioning quality.).
- Contrast direct and iterative linear solvers under sparse and structured systems.
- Risk and governance extension: convert this advanced point into explicit acceptance tests and rollback criteria (contrast direct and iterative linear solvers under sparse and structured systems.).
- Map linear-system conditioning to uncertainty in estimated model parameters.
- Risk and governance extension: convert this advanced point into explicit acceptance tests and rollback criteria (map linear-system conditioning to uncertainty in estimated model parameters.).

---
## Beyond Reference: Research to Production Loop
- Start from a benchmarked baseline and publish ablations that isolate each mathematical choice.
- Stress-test with adversarial and out-of-distribution inputs aligned to the module's assumptions.
- Maintain a rollback-safe deployment strategy with guardrails for confidence, drift, and latency budgets.
- Document invariant checks that must remain true after every optimization or refactor.

<!-- DEPTH_EXPANSION_END -->
