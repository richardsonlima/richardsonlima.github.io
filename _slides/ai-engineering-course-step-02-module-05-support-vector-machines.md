---
layout: slides
title: "Support Vector Machines"
category: "ai-engineering-course-step-02"
module_number: 5
complexity: "Build"
lesson_type: "Build"
lang_stack: "🐍"
use_math: true
---

layout: true
class: basic-layout
---

class: center, middle, inverse-slide
# Step 02 - ML Fundamentals
## Module 05: Support Vector Machines
### _Type: {{ page.lesson_type }} · Lang: {{ page.lang_stack }}_

**Richardson Lima**

---

## Summary

This module is part of Step 02 - ML Fundamentals.

---

<!-- DEPTH_EXPANSION_START -->
---
class: middle, inverse-slide
# Depth Extension
### Full reference absorption plus beyond-reference advanced coverage

---
## Reference Absorption: The Problem
- You have two classes of data points and need to draw a line (or hyperplane) separating them.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (you have two classes of data points and need to draw a line (or hyperplane) separating them).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (you have two classes of data points and need to draw a line (or hyperplane) separating them).
- Infinitely many lines could work.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (infinitely many lines could work).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (infinitely many lines could work).
- The one with the biggest margin.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (the one with the biggest margin).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (the one with the biggest margin).
- The margin is the distance between the decision boundary and the nearest data points on each side.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (the margin is the distance between the decision boundary and the nearest data points on each side).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (the margin is the distance between the decision boundary and the nearest data points on each side).

---
## Reference Absorption: The Problem (cont.)
- A wider margin means the classifier is more confident and generalizes better to unseen data.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (a wider margin means the classifier is more confident and generalizes better to unseen data).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (a wider margin means the classifier is more confident and generalizes better to unseen data).
- This intuition leads to Support Vector Machines, one of the most mathematically elegant algorithms in ML.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (this intuition leads to support vector machines, one of the most mathematically elegant algorithms in ml).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (this intuition leads to support vector machines, one of the most mathematically elegant algorithms in ml).
- SVMs were the dominant classification method before deep learning and remain the best choice for small datasets, high-dimensional data, and problems where you need a principled, well-understood model with th...
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (svms were the dominant classification method before deep learning and remain the best choice for small datasets, high-dimension...).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (svms were the dominant classification method before deep learning and remain the best choice for small datasets, high...).
- SVMs connect directly to Phase 1: the optimization is convex (Lesson 18), the margin is measured with norms (Lesson 14), and the kernel trick exploits dot products to handle nonlinear boundaries without ever...
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (svms connect directly to phase 1: the optimization is convex (lesson 18), the margin is measured with norms (lesson 14), and th...).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (svms connect directly to phase 1: the optimization is convex (lesson 18), the margin is measured with norms (lesson 1...).

---
## Reference Absorption: Exercises
- Generate a 2D linearly separable dataset.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (generate a 2d linearly separable dataset).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (generate a 2d linearly separable dataset).
- Train your LinearSVM and identify the support vectors.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (train your linearsvm and identify the support vectors).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (train your linearsvm and identify the support vectors).
- Verify that the support vectors are the points closest to the decision boundary.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (verify that the support vectors are the points closest to the decision boundary).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (verify that the support vectors are the points closest to the decision boundary).
- Vary C from 0.001 to 1000 on a noisy dataset.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (vary c from 0.001 to 1000 on a noisy dataset).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (vary c from 0.001 to 1000 on a noisy dataset).

---
## Reference Absorption: Exercises (cont.)
- Plot the decision boundary for each C value.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (plot the decision boundary for each c value).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (plot the decision boundary for each c value).
- Observe the transition from wide margin (underfitting) to narrow margin (overfitting).
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (observe the transition from wide margin (underfitting) to narrow margin (overfitting)).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (observe the transition from wide margin (underfitting) to narrow margin (overfitting)).
- Create a dataset where class boundaries are circular (not linear).
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (create a dataset where class boundaries are circular (not linear)).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (create a dataset where class boundaries are circular (not linear)).
- Show that a linear SVM fails.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (show that a linear svm fails).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (show that a linear svm fails).

---
## Reference Absorption: Exercises Deep Continuation
- Compute the RBF kernel matrix and show that the classes become separable in the kernel-induced feature space.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (compute the rbf kernel matrix and show that the classes become separable in the kernel-induced feature space).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (compute the rbf kernel matrix and show that the classes become separable in the kernel-induced feature space).
- Compare hinge loss vs logistic loss on the same dataset.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (compare hinge loss vs logistic loss on the same dataset).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (compare hinge loss vs logistic loss on the same dataset).
- Train a linear SVM and logistic regression.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (train a linear svm and logistic regression).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (train a linear svm and logistic regression).
- Count how many training points contribute to each model's decision boundary (support vectors vs all points).
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (count how many training points contribute to each model's decision boundary (support vectors vs all points)).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (count how many training points contribute to each model's decision boundary (support vectors vs all points)).

---
## Reference Absorption: Exercises Deep Continuation
- Implement SVR (epsilon-insensitive loss).
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (implement svr (epsilon-insensitive loss)).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (implement svr (epsilon-insensitive loss)).
- Fit it to y = sin(x) + noise.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (fit it to y = sin(x) + noise).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (fit it to y = sin(x) + noise).
- Plot the epsilon tube around the predictions and highlight the support vectors (points outside the tube).
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (plot the epsilon tube around the predictions and highlight the support vectors (points outside the tube)).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (plot the epsilon tube around the predictions and highlight the support vectors (points outside the tube)).

---
## Reference Absorption: Key Terms
- The only points that determine the hyperplane |
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (the only points that determine the hyperplane |).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (the only points that determine the hyperplane |).
- Zero when correctly classified and outside the margin.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (zero when correctly classified and outside the margin).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (zero when correctly classified and outside the margin).
- Large C = narrow margin, small C = wide margin |
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (large c = narrow margin, small c = wide margin |).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (large c = narrow margin, small c = wide margin |).
- Handles non-separable data |
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (handles non-separable data |).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (handles non-separable data |).

---
## Reference Absorption: Key Terms (cont.)
- Equivalent to standard dot product.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (equivalent to standard dot product).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (equivalent to standard dot product).
- For linearly separable data |
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (for linearly separable data |).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (for linearly separable data |).
- Maps to infinite dimensions.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (maps to infinite dimensions).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (maps to infinite dimensions).
- Learns any smooth boundary |
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (learns any smooth boundary |).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (learns any smooth boundary |).

---
## Reference Absorption: Key Terms Deep Continuation
- Maps to a feature space of polynomial combinations |
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (maps to a feature space of polynomial combinations |).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (maps to a feature space of polynomial combinations |).
- Fits an epsilon-tube around the data.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (fits an epsilon-tube around the data).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (fits an epsilon-tube around the data).
- Points inside the tube have zero loss |
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (points inside the tube have zero loss |).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (points inside the tube have zero loss |).
- Zero for correctly classified points outside margin |
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (zero for correctly classified points outside margin |).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (zero for correctly classified points outside margin |).

---
## Reference Absorption: The dual formulation and the kernel trick
- The Lagrangian dual of the SVM problem (from Phase 1 Lesson 18, KKT conditions) is:
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (the lagrangian dual of the svm problem (from phase 1 lesson 18, kkt conditions) is:).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (the lagrangian dual of the svm problem (from phase 1 lesson 18, kkt conditions) is:).
- The dual only involves dot products x_i .
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (the dual only involves dot products x_i ).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (the dual only involves dot products x_i ).
- Replace every dot product with a kernel function K(x_i, x_j) and the SVM can learn nonlinear boundaries without ever computing the transformation explicitly.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (replace every dot product with a kernel function k(x_i, x_j) and the svm can learn nonlinear boundaries without ever computing...).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (replace every dot product with a kernel function k(x_i, x_j) and the svm can learn nonlinear boundaries without ever...).
- The RBF kernel maps data into an infinite-dimensional space.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (the rbf kernel maps data into an infinite-dimensional space).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (the rbf kernel maps data into an infinite-dimensional space).

---
## Reference Absorption: The dual formulation and the kernel trick (cont.)
- Points that are close in input space have kernel value near 1.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (points that are close in input space have kernel value near 1).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (points that are close in input space have kernel value near 1).
- Points that are far apart have kernel value near 0.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (points that are far apart have kernel value near 0).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (points that are far apart have kernel value near 0).
- It can learn any smooth decision boundary.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (it can learn any smooth decision boundary).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (it can learn any smooth decision boundary).
- The kernel trick computes the dot product in the high-dimensional space without ever going there.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (the kernel trick computes the dot product in the high-dimensional space without ever going there).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (the kernel trick computes the dot product in the high-dimensional space without ever going there).

---
## Reference Absorption: The dual formulation and the kernel trick Deep Continuation
- For the polynomial kernel of degree d in D dimensions, the explicit feature space has O(D^d) dimensions.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (for the polynomial kernel of degree d in d dimensions, the explicit feature space has o(d^d) dimensions).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (for the polynomial kernel of degree d in d dimensions, the explicit feature space has o(d^d) dimensions).
- But K(x, z) is computed in O(D) time.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (but k(x, z) is computed in o(d) time).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (but k(x, z) is computed in o(d) time).

---
## Reference Absorption: The maximum margin classifier
- Given linearly separable data with labels y_i in {-1, +1} and feature vectors x_i, we want a hyperplane w^T x + b = 0 that separates the classes.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (given linearly separable data with labels y_i in {-1, +1} and feature vectors x_i, we want a hyperplane w^t x + b = 0 that sepa...).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (given linearly separable data with labels y_i in {-1, +1} and feature vectors x_i, we want a hyperplane w^t x + b = 0...).
- The distance from a point x_i to the hyperplane is:
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (the distance from a point x_i to the hyperplane is:).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (the distance from a point x_i to the hyperplane is:).
- For a correctly classified point: y_i * (w^T x_i + b) > 0.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (for a correctly classified point: y_i * (w^t x_i + b) > 0).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (for a correctly classified point: y_i * (w^t x_i + b) > 0).
- The margin is twice the distance from the hyperplane to the nearest point on either side.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (the margin is twice the distance from the hyperplane to the nearest point on either side).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (the margin is twice the distance from the hyperplane to the nearest point on either side).

---
## Reference Absorption: The maximum margin classifier (cont.)
- This is a convex quadratic program.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (this is a convex quadratic program).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (this is a convex quadratic program).
- It has a unique global solution.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (it has a unique global solution).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (it has a unique global solution).
- The data points that sit exactly on the margin boundaries (where y_i * (w^T x_i + b) = 1) are the support vectors.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (the data points that sit exactly on the margin boundaries (where y_i * (w^t x_i + b) = 1) are the support vectors).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (the data points that sit exactly on the margin boundaries (where y_i * (w^t x_i + b) = 1) are the support vectors).
- They are the only points that determine the decision boundary.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (they are the only points that determine the decision boundary).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (they are the only points that determine the decision boundary).

---
## Reference Absorption: The maximum margin classifier Deep Continuation
- Move or remove any non-support-vector point, and the boundary does not change.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (move or remove any non-support-vector point, and the boundary does not change).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (move or remove any non-support-vector point, and the boundary does not change).

---
## Reference Absorption: Step 2: Linear SVM via gradient descent
- Train by minimizing regularized hinge loss.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (train by minimizing regularized hinge loss).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (train by minimizing regularized hinge loss).

---
## Reference Absorption: Hinge loss: the SVM loss function
- The soft margin SVM can be rewritten as an unconstrained optimization:
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (the soft margin svm can be rewritten as an unconstrained optimization:).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (the soft margin svm can be rewritten as an unconstrained optimization:).
- The term max(0, 1 - y_i * f(x_i)) is the hinge loss.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (the term max(0, 1 - y_i * f(x_i)) is the hinge loss).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (the term max(0, 1 - y_i * f(x_i)) is the hinge loss).
- It is zero when the point is correctly classified and beyond the margin.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (it is zero when the point is correctly classified and beyond the margin).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (it is zero when the point is correctly classified and beyond the margin).
- It is linear when the point is inside the margin or misclassified.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (it is linear when the point is inside the margin or misclassified).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (it is linear when the point is inside the margin or misclassified).

---
## Reference Absorption: Hinge loss: the SVM loss function (cont.)
- Compare with logistic loss (logistic regression):
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (compare with logistic loss (logistic regression):).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (compare with logistic loss (logistic regression):).
- Hinge loss produces sparse solutions (only support vectors have nonzero contribution).
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (hinge loss produces sparse solutions (only support vectors have nonzero contribution)).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (hinge loss produces sparse solutions (only support vectors have nonzero contribution)).
- Logistic loss uses all data points.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (logistic loss uses all data points).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (logistic loss uses all data points).
- This makes SVMs more memory-efficient at prediction time.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (this makes svms more memory-efficient at prediction time).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (this makes svms more memory-efficient at prediction time).

---
## Reference Absorption: Use It
- Important: always scale your features before training an SVM.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (important: always scale your features before training an svm).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (important: always scale your features before training an svm).
- For large datasets, use LinearSVC (primal formulation, O(n) per epoch) instead of SVC (dual formulation, O(n^2) to O(n^3)):
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (for large datasets, use linearsvc (primal formulation, o(n) per epoch) instead of svc (dual formulation, o(n^2) to o(n^3)):).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (for large datasets, use linearsvc (primal formulation, o(n) per epoch) instead of svc (dual formulation, o(n^2) to o(...).

---
## Reference Absorption: Why SVMs lost to deep learning (and when they still win)
- SVMs dominated ML from the late 1990s through the early 2010s.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (svms dominated ml from the late 1990s through the early 2010s).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (svms dominated ml from the late 1990s through the early 2010s).
- Deep learning surpassed them for several reasons:
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (deep learning surpassed them for several reasons:).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (deep learning surpassed them for several reasons:).
- SVMs still win in these situations:
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (svms still win in these situations:).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (svms still win in these situations:).
- Small datasets (hundreds to low thousands of samples)
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (small datasets (hundreds to low thousands of samples)).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (small datasets (hundreds to low thousands of samples)).

---
## Reference Absorption: Why SVMs lost to deep learning (and when they still win) (cont.)
- High-dimensional sparse data (text with TF-IDF features)
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (high-dimensional sparse data (text with tf-idf features)).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (high-dimensional sparse data (text with tf-idf features)).
- When you need mathematical guarantees (margin bounds)
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (when you need mathematical guarantees (margin bounds)).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (when you need mathematical guarantees (margin bounds)).
- When training time must be minimal (linear SVM is very fast)
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (when training time must be minimal (linear svm is very fast)).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (when training time must be minimal (linear svm is very fast)).
- Binary classification with clear margin structure
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (binary classification with clear margin structure).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (binary classification with clear margin structure).

---
## Reference Absorption: Why SVMs lost to deep learning (and when they still win) Deep Continuation
- Anomaly detection (one-class SVM)
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (anomaly detection (one-class svm)).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (anomaly detection (one-class svm)).

---
## Reference Absorption: Further Reading
- [Vapnik: The Nature of Statistical Learning Theory (1995)](https://link.springer.com/book/10.1007/978-1-4757-3264-1) - the foundational text on SVMs and statistical learning
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade ([vapnik: the nature of statistical learning theory (1995)](https://link.springer.com/book/10.1007/978-1-4757-3264-1) - the foun...).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept ([vapnik: the nature of statistical learning theory (1995)](https://link.springer.com/book/10.1007/978-1-4757-3264-1)...).
- [Cortes & Vapnik: Support-vector networks (1995)](https://link.springer.com/article/10.1007/BF00994018) - the original SVM paper
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade ([cortes & vapnik: support-vector networks (1995)](https://link.springer.com/article/10.1007/bf00994018) - the original svm paper).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept ([cortes & vapnik: support-vector networks (1995)](https://link.springer.com/article/10.1007/bf00994018) - the origina...).
- [Platt: Sequential Minimal Optimization (1998)](https://www.microsoft.com/en-us/research/publication/sequential-minimal-optimization-a-fast-algorithm-for-training-support-vector-machines/) - the SMO algorith...
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade ([platt: sequential minimal optimization (1998)](https://www.microsoft.com/en-us/research/publication/sequential-minimal-optimiz...).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept ([platt: sequential minimal optimization (1998)](https://www.microsoft.com/en-us/research/publication/sequential-minim...).
- [scikit-learn SVM documentation](https://scikit-learn.org/stable/modules/svm.html) - practical guide with implementation details
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade ([scikit-learn svm documentation](https://scikit-learn.org/stable/modules/svm.html) - practical guide with implementation details).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept ([scikit-learn svm documentation](https://scikit-learn.org/stable/modules/svm.html) - practical guide with implementat...).

---
## Reference Absorption: Further Reading (cont.)
- [LIBSVM: A Library for Support Vector Machines](https://www.csie.ntu.edu.tw/~cjlin/libsvm/) - the C++ library behind most SVM implementations
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade ([libsvm: a library for support vector machines](https://www.csie.ntu.edu.tw/~cjlin/libsvm/) - the c++ library behind most svm i...).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept ([libsvm: a library for support vector machines](https://www.csie.ntu.edu.tw/~cjlin/libsvm/) - the c++ library behind...).

---
## Reference Absorption: Soft margin: handling noise with the C parameter
- Real data is rarely perfectly separable.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (real data is rarely perfectly separable).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (real data is rarely perfectly separable).
- Some points may be on the wrong side of the boundary, or inside the margin.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (some points may be on the wrong side of the boundary, or inside the margin).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (some points may be on the wrong side of the boundary, or inside the margin).
- The soft margin formulation allows violations by introducing slack variables.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (the soft margin formulation allows violations by introducing slack variables).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (the soft margin formulation allows violations by introducing slack variables).
- The slack variable xi_i measures how much point i violates the margin.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (the slack variable xi_i measures how much point i violates the margin).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (the slack variable xi_i measures how much point i violates the margin).

---
## Reference Absorption: Soft margin: handling noise with the C parameter (cont.)
- Narrow margin, fewer misclassifications.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (narrow margin, fewer misclassifications).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (narrow margin, fewer misclassifications).
- Wide margin, more misclassifications.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (wide margin, more misclassifications).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (wide margin, more misclassifications).
- C is the regularization strength, inverted.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (c is the regularization strength, inverted).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (c is the regularization strength, inverted).
- Large C = less regularization.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (large c = less regularization).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (large c = less regularization).

---
## Reference Absorption: Soft margin: handling noise with the C parameter Deep Continuation
- Small C = more regularization.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (small c = more regularization).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (small c = more regularization).

---
## Reference Absorption: Support vectors: the critical few
- Most training points are irrelevant.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (most training points are irrelevant).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (most training points are irrelevant).
- Only the support vectors matter.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (only the support vectors matter).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (only the support vectors matter).
- This is why SVMs are memory-efficient at prediction time: you only need to store the support vectors, not the entire training set.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (this is why svms are memory-efficient at prediction time: you only need to store the support vectors, not the entire training set).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (this is why svms are memory-efficient at prediction time: you only need to store the support vectors, not the entire...).
- The number of support vectors also gives a bound on generalization error.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (the number of support vectors also gives a bound on generalization error).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (the number of support vectors also gives a bound on generalization error).

---
## Reference Absorption: Support vectors: the critical few (cont.)
- Fewer support vectors relative to the dataset size means better generalization.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (fewer support vectors relative to the dataset size means better generalization).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (fewer support vectors relative to the dataset size means better generalization).

---
## Reference Absorption: Training a linear SVM with gradient descent
- You can train a linear SVM using gradient descent on the hinge loss plus L2 regularization, without solving the constrained QP:
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (you can train a linear svm using gradient descent on the hinge loss plus l2 regularization, without solving the constrained qp:).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (you can train a linear svm using gradient descent on the hinge loss plus l2 regularization, without solving the const...).
- This is called the primal formulation.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (this is called the primal formulation).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (this is called the primal formulation).
- It runs in O(n * d) per epoch, where n is the number of samples and d is the number of features.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (it runs in o(n * d) per epoch, where n is the number of samples and d is the number of features).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (it runs in o(n * d) per epoch, where n is the number of samples and d is the number of features).
- For large, sparse, high-dimensional data (text classification), this is fast.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (for large, sparse, high-dimensional data (text classification), this is fast).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (for large, sparse, high-dimensional data (text classification), this is fast).

---
## Reference Absorption: SVM for regression (SVR)
- Support Vector Regression fits a tube of width epsilon around the data.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (support vector regression fits a tube of width epsilon around the data).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (support vector regression fits a tube of width epsilon around the data).
- Points inside the tube have zero loss.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (points inside the tube have zero loss).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (points inside the tube have zero loss).
- Points outside the tube are penalized linearly.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (points outside the tube are penalized linearly).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (points outside the tube are penalized linearly).
- The epsilon parameter controls the tube width.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (the epsilon parameter controls the tube width).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (the epsilon parameter controls the tube width).

---
## Beyond Reference: Engineering Translation
- Core anchors for this module: margin, support, points, self, loss, kernel, vectors, data.
- Convert each theoretical primitive into measurable training and inference behaviors.
- Define observability checkpoints for drift, calibration, and latency regressions.
- Tie assumptions to explicit data contracts and fallback policies.

---
## Beyond Reference: Advanced Layer 1
- Analyze support-vector counts as a complexity proxy and monitor margin collapse.
- Risk and governance extension: convert this into acceptance tests and rollback criteria (analyze support-vector counts as a complexity proxy and monitor margin collapse.).
- Choose kernel/hyperparameter grids with scaling-aware priors.
- Risk and governance extension: convert this into acceptance tests and rollback criteria (choose kernel/hyperparameter grids with scaling-aware priors.).
- Map C and gamma regimes to underfit/overfit signatures.
- Risk and governance extension: convert this into acceptance tests and rollback criteria (map c and gamma regimes to underfit/overfit signatures.).

<!-- DEPTH_EXPANSION_END -->
