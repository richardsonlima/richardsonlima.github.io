---
layout: slides
title: "Dimensionality Reduction: PCA, t-SNE, UMAP"
category: "ai-engineering-course-step-01"
module_number: 10
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
## Module 10: Dimensionality Reduction
### _Type: Build · Lang: Python · Time: ~90 minutes_
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
You have a dataset with 784 features per sample. Maybe it is pixel values of handwritten digits. Maybe it is gene expression levels. Maybe it is user behavior signals. You cannot visualize 784 dimensions. You cannot plot them. You cannot even think about them.
But most of those 784 features are redundant. The actual information lives on a much smaller surface. A handwritten "7" does not need 784 independent numbers to describe it. It needs a few: the angle of the stroke, the length of the crossbar, how much it leans. The rest is noise.
---
## Learning Objectives
- Implement PCA from scratch: center data, compute the covariance matrix, eigendecompose, and project
- Use explained variance ratio and the elbow method to choose the number of principal components
- Compare PCA, t-SNE, and UMAP for visualizing MNIST digits in 2D and explain their tradeoffs
- Apply kernel PCA with an RBF kernel to separate nonlinear data structures that standard PCA cannot handle
---
## The curse of dimensionality
High-dimensional spaces are unintuitive. Three things break as dimensions grow.
**Distance becomes meaningless.** In high dimensions, the distance between any two random points converges to the same value. If every point is roughly the same distance from every other point, nearest-neighbor search stops working.
---
## PCA: find the directions that matter
Principal Component Analysis (PCA) finds the axes along which your data varies the most. It rotates your coordinate system so the first axis captures the most variance, the second captures the next most, and so on.
The algorithm:
1. Center data: $X_c = X - \mu$
2. Covariance: $C = \frac{1}{n-1}X_c^T X_c$
3. Eigendecomposition: $C = V\Lambda V^T$
4. Keep top-$k$ eigenvectors $V_k$
5. Project: $Z = X_c V_k$
---
## Explained variance ratio
Each principal component captures a fraction of the total variance. The explained variance ratio tells you how much.
When the cumulative explained variance reaches 0.95, you know that many components capture 95% of the information. Everything after that is mostly noise.
---
## Choosing the number of components
Three strategies:
1. **Threshold.** Keep enough components to explain 90-95% of the variance.
2. **Elbow method.** Plot explained variance per component. Look for a sharp drop-off.
3. **Downstream performance.** Use PCA as preprocessing. Sweep k and measure your model's accuracy. The best k is wherever accuracy plateaus.
---
## t-SNE: preserve neighborhoods
t-Distributed Stochastic Neighbor Embedding (t-SNE) is designed for visualization. It maps high-dimensional data to 2D (or 3D) while preserving which points are near each other.
The intuition: in the original space, compute a probability distribution over pairs of points based on their distances. Near points get high probability. Far points get low probability. Then find a 2D arrangement where the same probability distribution holds. Points that were neighbors in 784 dimensions stay neighbors in 2D.
---
## UMAP: faster, better global structure
Uniform Manifold Approximation and Projection (UMAP) works similarly to t-SNE but with two advantages:
- Faster. It uses approximate nearest-neighbor graphs instead of computing all pairwise distances.
- Better global structure. The relative positions of clusters in the output tend to be more meaningful than in t-SNE.
UMAP builds a weighted graph in high-dimensional space (the "fuzzy topological representation") and then finds a low-dimensional layout that preserves this graph as well as possible.
---
## Hands-on Build Path
1. Step 1: PCA from scratch
2. Step 2: Test on synthetic data
3. Step 3: MNIST digits in 2D
4. Step 4: Compare with sklearn
5. Step 5: UMAP comparison
Prerequisites: Phase 1, Lessons 01 (Linear Algebra Intuition), 02 (Vectors, Matrices & Operations), 03 (Eigenvalues & Eigenvectors), 06 (Probability & Distributions)
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
- You have a dataset with 784 features per sample.
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (you have a dataset with 784 features per sample).
- Operational risk check: define a metric and alert tied to this concept before deployment (you have a dataset with 784 features per sample).
- Maybe it is pixel values of handwritten digits.
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (maybe it is pixel values of handwritten digits).
- Operational risk check: define a metric and alert tied to this concept before deployment (maybe it is pixel values of handwritten digits).
- Maybe it is gene expression levels.
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (maybe it is gene expression levels).
- Operational risk check: define a metric and alert tied to this concept before deployment (maybe it is gene expression levels).
- Maybe it is user behavior signals.
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (maybe it is user behavior signals).
- Operational risk check: define a metric and alert tied to this concept before deployment (maybe it is user behavior signals).

---
## Reference Absorption: The Problem (cont.)
- You cannot visualize 784 dimensions.
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (you cannot visualize 784 dimensions).
- Operational risk check: define a metric and alert tied to this concept before deployment (you cannot visualize 784 dimensions).
- You cannot even think about them.
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (you cannot even think about them).
- Operational risk check: define a metric and alert tied to this concept before deployment (you cannot even think about them).
- But most of those 784 features are redundant.
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (but most of those 784 features are redundant).
- Operational risk check: define a metric and alert tied to this concept before deployment (but most of those 784 features are redundant).
- The actual information lives on a much smaller surface.
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (the actual information lives on a much smaller surface).
- Operational risk check: define a metric and alert tied to this concept before deployment (the actual information lives on a much smaller surface).

---
## Reference Absorption: The Problem Deep Continuation
- A handwritten "7" does not need 784 independent numbers to describe it.
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (a handwritten "7" does not need 784 independent numbers to describe it).
- Operational risk check: define a metric and alert tied to this concept before deployment (a handwritten "7" does not need 784 independent numbers to describe it).
- It needs a few: the angle of the stroke, the length of the crossbar, how much it leans.
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (it needs a few: the angle of the stroke, the length of the crossbar, how much it leans).
- Operational risk check: define a metric and alert tied to this concept before deployment (it needs a few: the angle of the stroke, the length of the crossbar, how much it leans).
- Dimensionality reduction finds that smaller surface.
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (dimensionality reduction finds that smaller surface).
- Operational risk check: define a metric and alert tied to this concept before deployment (dimensionality reduction finds that smaller surface).
- It takes your 784-dimensional data and compresses it to 2, 10, or 50 dimensions while keeping the structure that matters.
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (it takes your 784-dimensional data and compresses it to 2, 10, or 50 dimensions while keeping the structure that matters).
- Operational risk check: define a metric and alert tied to this concept before deployment (it takes your 784-dimensional data and compresses it to 2, 10, or 50 dimensions while keeping the structure that matters).

---
## Reference Absorption: Exercises
- Modify the PCA class to support inverse_transform.
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (modify the pca class to support inverse_transform).
- Operational risk check: define a metric and alert tied to this concept before deployment (modify the pca class to support inverse_transform).
- Reconstruct MNIST digits from 10, 50, and 200 components.
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (reconstruct mnist digits from 10, 50, and 200 components).
- Operational risk check: define a metric and alert tied to this concept before deployment (reconstruct mnist digits from 10, 50, and 200 components).
- Print the reconstruction error (mean squared difference from the original) for each.
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (print the reconstruction error (mean squared difference from the original) for each).
- Operational risk check: define a metric and alert tied to this concept before deployment (print the reconstruction error (mean squared difference from the original) for each).
- Run t-SNE on the same MNIST subset with perplexity values of 5, 30, and 100.
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (run t-sne on the same mnist subset with perplexity values of 5, 30, and 100).
- Operational risk check: define a metric and alert tied to this concept before deployment (run t-sne on the same mnist subset with perplexity values of 5, 30, and 100).

---
## Reference Absorption: Exercises (cont.)
- Describe how the output changes.
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (describe how the output changes).
- Operational risk check: define a metric and alert tied to this concept before deployment (describe how the output changes).
- Why does perplexity affect cluster tightness?
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (why does perplexity affect cluster tightness?).
- Operational risk check: define a metric and alert tied to this concept before deployment (why does perplexity affect cluster tightness?).
- Take a dataset with 50 features where only 5 are informative (generate one with sklearn.datasets.make_classification).
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (take a dataset with 50 features where only 5 are informative (generate one with sklearn.datasets.make_classification)).
- Operational risk check: define a metric and alert tied to this concept before deployment (take a dataset with 50 features where only 5 are informative (generate one with sklearn.datasets.make_classification)).
- Apply PCA and check whether the explained variance curve correctly identifies that the data is effectively 5-dimensional.
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (apply pca and check whether the explained variance curve correctly identifies that the data is effectively 5-dimensional).
- Operational risk check: define a metric and alert tied to this concept before deployment (apply pca and check whether the explained variance curve correctly identifies that the data is effectively 5-dimensional).

---
## Reference Absorption: Kernel PCA
- Standard PCA finds linear subspaces.
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (standard pca finds linear subspaces).
- Operational risk check: define a metric and alert tied to this concept before deployment (standard pca finds linear subspaces).
- It rotates your coordinate system and drops axes.
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (it rotates your coordinate system and drops axes).
- Operational risk check: define a metric and alert tied to this concept before deployment (it rotates your coordinate system and drops axes).
- But what if the data lies on a nonlinear manifold?
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (but what if the data lies on a nonlinear manifold?).
- Operational risk check: define a metric and alert tied to this concept before deployment (but what if the data lies on a nonlinear manifold?).
- A circle in 2D cannot be separated by any line.
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (a circle in 2d cannot be separated by any line).
- Operational risk check: define a metric and alert tied to this concept before deployment (a circle in 2d cannot be separated by any line).

---
## Reference Absorption: Kernel PCA (cont.)
- Kernel PCA applies PCA in a high-dimensional feature space induced by a kernel function, without explicitly computing the coordinates in that space.
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (kernel pca applies pca in a high-dimensional feature space induced by a kernel function, without explicitly computing the coord...).
- Operational risk check: define a metric and alert tied to this concept before deployment (kernel pca applies pca in a high-dimensional feature space induced by a kernel function, without explicitly computing...).
- This is the kernel trick -- the same idea behind SVMs.
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (this is the kernel trick -- the same idea behind svms).
- Operational risk check: define a metric and alert tied to this concept before deployment (this is the kernel trick -- the same idea behind svms).
- Compute the kernel matrix K where K_ij = k(x_i, x_j)
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (compute the kernel matrix k where k_ij = k(x_i, x_j)).
- Operational risk check: define a metric and alert tied to this concept before deployment (compute the kernel matrix k where k_ij = k(x_i, x_j)).
- Center the kernel matrix in feature space
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (center the kernel matrix in feature space).
- Operational risk check: define a metric and alert tied to this concept before deployment (center the kernel matrix in feature space).

---
## Reference Absorption: Kernel PCA Deep Continuation
- Eigendecompose the centered kernel matrix
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (eigendecompose the centered kernel matrix).
- Operational risk check: define a metric and alert tied to this concept before deployment (eigendecompose the centered kernel matrix).
- The top eigenvectors (scaled by 1/sqrt(eigenvalue)) are the projections
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (the top eigenvectors (scaled by 1/sqrt(eigenvalue)) are the projections).
- Operational risk check: define a metric and alert tied to this concept before deployment (the top eigenvectors (scaled by 1/sqrt(eigenvalue)) are the projections).
- When to use kernel PCA vs standard PCA:
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (when to use kernel pca vs standard pca:).
- Operational risk check: define a metric and alert tied to this concept before deployment (when to use kernel pca vs standard pca:).
- The classic example: concentric circles in 2D.
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (the classic example: concentric circles in 2d).
- Operational risk check: define a metric and alert tied to this concept before deployment (the classic example: concentric circles in 2d).

---
## Reference Absorption: Kernel PCA Deep Continuation
- Two rings of points, one inside the other.
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (two rings of points, one inside the other).
- Operational risk check: define a metric and alert tied to this concept before deployment (two rings of points, one inside the other).
- Standard PCA projects both onto the same line -- useless for classification.
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (standard pca projects both onto the same line -- useless for classification).
- Operational risk check: define a metric and alert tied to this concept before deployment (standard pca projects both onto the same line -- useless for classification).
- Kernel PCA with an RBF kernel maps the inner circle and outer circle to different regions, making them linearly separable.
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (kernel pca with an rbf kernel maps the inner circle and outer circle to different regions, making them linearly separable).
- Operational risk check: define a metric and alert tied to this concept before deployment (kernel pca with an rbf kernel maps the inner circle and outer circle to different regions, making them linearly separ...).

---
## Reference Absorption: Key Terms
- Models need exponentially more data to compensate.
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (models need exponentially more data to compensate).
- Operational risk check: define a metric and alert tied to this concept before deployment (models need exponentially more data to compensate).
- The direction in feature space along which the data varies most.
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (the direction in feature space along which the data varies most).
- Operational risk check: define a metric and alert tied to this concept before deployment (the direction in feature space along which the data varies most).
- Sum the top k ratios to see how much k components preserve.
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (sum the top k ratios to see how much k components preserve).
- Operational risk check: define a metric and alert tied to this concept before deployment (sum the top k ratios to see how much k components preserve).
- Diagonal entries are individual variances.
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (diagonal entries are individual variances).
- Operational risk check: define a metric and alert tied to this concept before deployment (diagonal entries are individual variances).

---
## Reference Absorption: Key Terms (cont.)
- Good for visualization, not for preprocessing.
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (good for visualization, not for preprocessing).
- Operational risk check: define a metric and alert tied to this concept before deployment (good for visualization, not for preprocessing).
- Preserves both local and some global structure.
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (preserves both local and some global structure).
- Operational risk check: define a metric and alert tied to this concept before deployment (preserves both local and some global structure).
- Low perplexity focuses on very local structure.
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (low perplexity focuses on very local structure).
- Operational risk check: define a metric and alert tied to this concept before deployment (low perplexity focuses on very local structure).
- High perplexity captures broader patterns.
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (high perplexity captures broader patterns).
- Operational risk check: define a metric and alert tied to this concept before deployment (high perplexity captures broader patterns).

---
## Reference Absorption: Key Terms Deep Continuation
- A sheet of paper crumpled in 3D is a 2D manifold.
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (a sheet of paper crumpled in 3d is a 2d manifold).
- Operational risk check: define a metric and alert tied to this concept before deployment (a sheet of paper crumpled in 3d is a 2d manifold).

---
## Reference Absorption: PCA: find the directions that matter
- Principal Component Analysis (PCA) finds the axes along which your data varies the most.
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (principal component analysis (pca) finds the axes along which your data varies the most).
- Operational risk check: define a metric and alert tied to this concept before deployment (principal component analysis (pca) finds the axes along which your data varies the most).
- It rotates your coordinate system so the first axis captures the most variance, the second captures the next most, and so on.
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (it rotates your coordinate system so the first axis captures the most variance, the second captures the next most, and so on).
- Operational risk check: define a metric and alert tied to this concept before deployment (it rotates your coordinate system so the first axis captures the most variance, the second captures the next most, an...).
- The covariance matrix is symmetric and positive semi-definite.
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (the covariance matrix is symmetric and positive semi-definite).
- Operational risk check: define a metric and alert tied to this concept before deployment (the covariance matrix is symmetric and positive semi-definite).
- Its eigenvectors are orthogonal directions in feature space.
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (its eigenvectors are orthogonal directions in feature space).
- Operational risk check: define a metric and alert tied to this concept before deployment (its eigenvectors are orthogonal directions in feature space).

---
## Reference Absorption: PCA: find the directions that matter (cont.)
- The eigenvalues tell you how much variance each direction captures.
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (the eigenvalues tell you how much variance each direction captures).
- Operational risk check: define a metric and alert tied to this concept before deployment (the eigenvalues tell you how much variance each direction captures).
- The eigenvector with the largest eigenvalue points along the direction of maximum variance.
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (the eigenvector with the largest eigenvalue points along the direction of maximum variance).
- Operational risk check: define a metric and alert tied to this concept before deployment (the eigenvector with the largest eigenvalue points along the direction of maximum variance).
- Before PCA: Data cloud is spread diagonally across both x and y axes
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (before pca: data cloud is spread diagonally across both x and y axes).
- Operational risk check: define a metric and alert tied to this concept before deployment (before pca: data cloud is spread diagonally across both x and y axes).
- After PCA: Coordinate system is rotated so PC1 aligns with the direction of maximum variance (elongated spread) and PC2 aligns with the direction of minimum variance (narrow spread)
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (after pca: coordinate system is rotated so pc1 aligns with the direction of maximum variance (elongated spread) and pc2 aligns...).
- Operational risk check: define a metric and alert tied to this concept before deployment (after pca: coordinate system is rotated so pc1 aligns with the direction of maximum variance (elongated spread) and p...).

---
## Reference Absorption: PCA: find the directions that matter Deep Continuation
- Dimensionality reduction: Dropping PC2 projects the data onto PC1, losing very little information
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (dimensionality reduction: dropping pc2 projects the data onto pc1, losing very little information).
- Operational risk check: define a metric and alert tied to this concept before deployment (dimensionality reduction: dropping pc2 projects the data onto pc1, losing very little information).

---
## Reference Absorption: Reconstruction Error
- How good is your dimensionality reduction?
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (how good is your dimensionality reduction?).
- Operational risk check: define a metric and alert tied to this concept before deployment (how good is your dimensionality reduction?).
- You compressed 784 dimensions to 50.
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (you compressed 784 dimensions to 50).
- Operational risk check: define a metric and alert tied to this concept before deployment (you compressed 784 dimensions to 50).
- Measure reconstruction error:
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (measure reconstruction error:).
- Operational risk check: define a metric and alert tied to this concept before deployment (measure reconstruction error:).
- Project data to k dimensions: X_reduced = X @ W_k
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (project data to k dimensions: x_reduced = x @ w_k).
- Operational risk check: define a metric and alert tied to this concept before deployment (project data to k dimensions: x_reduced = x @ w_k).

---
## Reference Absorption: Reconstruction Error (cont.)
- Reconstruct: X_hat = X_reduced @ W_k^T
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (reconstruct: x_hat = x_reduced @ w_k^t).
- Operational risk check: define a metric and alert tied to this concept before deployment (reconstruct: x_hat = x_reduced @ w_k^t).
- Compute MSE: mean((X - X_hat)^2)
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (compute mse: mean((x - x_hat)^2)).
- Operational risk check: define a metric and alert tied to this concept before deployment (compute mse: mean((x - x_hat)^2)).
- For PCA, reconstruction error has a clean relationship to explained variance:
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (for pca, reconstruction error has a clean relationship to explained variance:).
- Operational risk check: define a metric and alert tied to this concept before deployment (for pca, reconstruction error has a clean relationship to explained variance:).
- The explained variance ratio for each component is:
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (the explained variance ratio for each component is:).
- Operational risk check: define a metric and alert tied to this concept before deployment (the explained variance ratio for each component is:).

---
## Reference Absorption: Reconstruction Error Deep Continuation
- Plotting cumulative explained variance against number of components gives you the "elbow" curve.
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (plotting cumulative explained variance against number of components gives you the "elbow" curve).
- Operational risk check: define a metric and alert tied to this concept before deployment (plotting cumulative explained variance against number of components gives you the "elbow" curve).
- The right number of components is where:
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (the right number of components is where:).
- Operational risk check: define a metric and alert tied to this concept before deployment (the right number of components is where:).
- The curve flattens out (diminishing returns)
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (the curve flattens out (diminishing returns)).
- Operational risk check: define a metric and alert tied to this concept before deployment (the curve flattens out (diminishing returns)).
- Cumulative variance crosses your threshold (usually 0.90 or 0.95)
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (cumulative variance crosses your threshold (usually 0.90 or 0.95)).
- Operational risk check: define a metric and alert tied to this concept before deployment (cumulative variance crosses your threshold (usually 0.90 or 0.95)).

---
## Reference Absorption: Reconstruction Error Deep Continuation
- Downstream task performance plateaus
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (downstream task performance plateaus).
- Operational risk check: define a metric and alert tied to this concept before deployment (downstream task performance plateaus).
- Reconstruction error is useful beyond choosing k.
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (reconstruction error is useful beyond choosing k).
- Operational risk check: define a metric and alert tied to this concept before deployment (reconstruction error is useful beyond choosing k).
- You can use it for anomaly detection: samples with high reconstruction error are outliers that do not fit the learned subspace.
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (you can use it for anomaly detection: samples with high reconstruction error are outliers that do not fit the learned subspace).
- Operational risk check: define a metric and alert tied to this concept before deployment (you can use it for anomaly detection: samples with high reconstruction error are outliers that do not fit the learned...).
- This is the basis of PCA-based anomaly detection in production systems.
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (this is the basis of pca-based anomaly detection in production systems).
- Operational risk check: define a metric and alert tied to this concept before deployment (this is the basis of pca-based anomaly detection in production systems).

---
## Reference Absorption: The curse of dimensionality
- High-dimensional spaces are unintuitive.
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (high-dimensional spaces are unintuitive).
- Operational risk check: define a metric and alert tied to this concept before deployment (high-dimensional spaces are unintuitive).
- Three things break as dimensions grow.
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (three things break as dimensions grow).
- Operational risk check: define a metric and alert tied to this concept before deployment (three things break as dimensions grow).
- Distance becomes meaningless. In high dimensions, the distance between any two random points converges to the same value.
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (distance becomes meaningless. in high dimensions, the distance between any two random points converges to the same value).
- Operational risk check: define a metric and alert tied to this concept before deployment (distance becomes meaningless. in high dimensions, the distance between any two random points converges to the same value).
- If every point is roughly the same distance from every other point, nearest-neighbor search stops working.
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (if every point is roughly the same distance from every other point, nearest-neighbor search stops working).
- Operational risk check: define a metric and alert tied to this concept before deployment (if every point is roughly the same distance from every other point, nearest-neighbor search stops working).

---
## Reference Absorption: The curse of dimensionality (cont.)
- Volume concentrates in corners. A unit hypercube in d dimensions has 2^d corners.
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (volume concentrates in corners. a unit hypercube in d dimensions has 2^d corners).
- Operational risk check: define a metric and alert tied to this concept before deployment (volume concentrates in corners. a unit hypercube in d dimensions has 2^d corners).
- In 100 dimensions, nearly all the volume is in the corners, far from the center.
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (in 100 dimensions, nearly all the volume is in the corners, far from the center).
- Operational risk check: define a metric and alert tied to this concept before deployment (in 100 dimensions, nearly all the volume is in the corners, far from the center).
- Data points spread to the edges and your models starve for data in the interior.
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (data points spread to the edges and your models starve for data in the interior).
- Operational risk check: define a metric and alert tied to this concept before deployment (data points spread to the edges and your models starve for data in the interior).
- You need exponentially more data. To maintain the same density of samples in a space, going from 2D to 20D means you need 10^18 times more data.
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (you need exponentially more data. to maintain the same density of samples in a space, going from 2d to 20d means you need 10^18...).
- Operational risk check: define a metric and alert tied to this concept before deployment (you need exponentially more data. to maintain the same density of samples in a space, going from 2d to 20d means you...).

---
## Reference Absorption: The curse of dimensionality Deep Continuation
- Reducing dimensions brings the data density back to something workable.
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (reducing dimensions brings the data density back to something workable).
- Operational risk check: define a metric and alert tied to this concept before deployment (reducing dimensions brings the data density back to something workable).

---
## Reference Absorption: Use It
- PCA as preprocessing before a classifier:
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (pca as preprocessing before a classifier:).
- Operational risk check: define a metric and alert tied to this concept before deployment (pca as preprocessing before a classifier:).
- Performance plateaus well before 784 dimensions.
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (performance plateaus well before 784 dimensions).
- Operational risk check: define a metric and alert tied to this concept before deployment (performance plateaus well before 784 dimensions).
- That plateau is your operating point.
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (that plateau is your operating point).
- Operational risk check: define a metric and alert tied to this concept before deployment (that plateau is your operating point).

---
## Reference Absorption: t-SNE: preserve neighborhoods
- t-Distributed Stochastic Neighbor Embedding (t-SNE) is designed for visualization.
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (t-distributed stochastic neighbor embedding (t-sne) is designed for visualization).
- Operational risk check: define a metric and alert tied to this concept before deployment (t-distributed stochastic neighbor embedding (t-sne) is designed for visualization).
- It maps high-dimensional data to 2D (or 3D) while preserving which points are near each other.
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (it maps high-dimensional data to 2d (or 3d) while preserving which points are near each other).
- Operational risk check: define a metric and alert tied to this concept before deployment (it maps high-dimensional data to 2d (or 3d) while preserving which points are near each other).
- The intuition: in the original space, compute a probability distribution over pairs of points based on their distances.
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (the intuition: in the original space, compute a probability distribution over pairs of points based on their distances).
- Operational risk check: define a metric and alert tied to this concept before deployment (the intuition: in the original space, compute a probability distribution over pairs of points based on their distances).
- Near points get high probability.
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (near points get high probability).
- Operational risk check: define a metric and alert tied to this concept before deployment (near points get high probability).

---
## Reference Absorption: t-SNE: preserve neighborhoods (cont.)
- Far points get low probability.
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (far points get low probability).
- Operational risk check: define a metric and alert tied to this concept before deployment (far points get low probability).
- Then find a 2D arrangement where the same probability distribution holds.
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (then find a 2d arrangement where the same probability distribution holds).
- Operational risk check: define a metric and alert tied to this concept before deployment (then find a 2d arrangement where the same probability distribution holds).
- Points that were neighbors in 784 dimensions stay neighbors in 2D.
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (points that were neighbors in 784 dimensions stay neighbors in 2d).
- Operational risk check: define a metric and alert tied to this concept before deployment (points that were neighbors in 784 dimensions stay neighbors in 2d).
- Non-linear. It can unfold complex manifolds that PCA cannot.
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (non-linear. it can unfold complex manifolds that pca cannot).
- Operational risk check: define a metric and alert tied to this concept before deployment (non-linear. it can unfold complex manifolds that pca cannot).

---
## Reference Absorption: t-SNE: preserve neighborhoods Deep Continuation
- Stochastic. Different runs produce different layouts.
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (stochastic. different runs produce different layouts).
- Operational risk check: define a metric and alert tied to this concept before deployment (stochastic. different runs produce different layouts).
- Perplexity parameter controls how many neighbors to consider (typical range: 5-50).
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (perplexity parameter controls how many neighbors to consider (typical range: 5-50)).
- Operational risk check: define a metric and alert tied to this concept before deployment (perplexity parameter controls how many neighbors to consider (typical range: 5-50)).
- Distances between clusters in the output are not meaningful. Only the clusters themselves are.
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (distances between clusters in the output are not meaningful. only the clusters themselves are).
- Operational risk check: define a metric and alert tied to this concept before deployment (distances between clusters in the output are not meaningful. only the clusters themselves are).
- Slow on large datasets. O(n^2) by default.
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (slow on large datasets. o(n^2) by default).
- Operational risk check: define a metric and alert tied to this concept before deployment (slow on large datasets. o(n^2) by default).

---
## Beyond Reference: Engineering Translation
- Core anchors for this module: variance, data, components, explained, self, umap, mnist, ratio.
- Convert each theoretical primitive into measurable behaviors in training and inference pipelines.
- Define observability checkpoints so regressions are detected before deployment impact.
- Tie mathematical assumptions to concrete data contracts and monitoring thresholds.

---
## Beyond Reference: Advanced Layer 1
- Compare trustworthiness and continuity metrics for nonlinear manifold embeddings.
- Risk and governance extension: convert this advanced point into explicit acceptance tests and rollback criteria (compare trustworthiness and continuity metrics for nonlinear manifold embeddings.).
- Discuss pitfalls of t-SNE cluster interpretation and reproducibility across random seeds.
- Risk and governance extension: convert this advanced point into explicit acceptance tests and rollback criteria (discuss pitfalls of t-sne cluster interpretation and reproducibility across random seeds.).
- Integrate PCA preconditioning before UMAP for faster and more stable embeddings.
- Risk and governance extension: convert this advanced point into explicit acceptance tests and rollback criteria (integrate pca preconditioning before umap for faster and more stable embeddings.).

---
## Beyond Reference: Research to Production Loop
- Start from a benchmarked baseline and publish ablations that isolate each mathematical choice.
- Stress-test with adversarial and out-of-distribution inputs aligned to the module's assumptions.
- Maintain a rollback-safe deployment strategy with guardrails for confidence, drift, and latency budgets.
- Document invariant checks that must remain true after every optimization or refactor.

<!-- DEPTH_EXPANSION_END -->
