---
layout: slides
title: "KNN & Distance Metrics"
category: "ai-engineering-course-step-02"
module_number: 6
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
## Module 06: KNN & Distance Metrics
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
- You need to classify it or predict its value.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (you need to classify it or predict its value).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (you need to classify it or predict its value).
- Instead of learning parameters from the data (like linear regression or SVMs), you just find the K training points closest to the new point and let them vote.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (instead of learning parameters from the data (like linear regression or svms), you just find the k training points closest to t...).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (instead of learning parameters from the data (like linear regression or svms), you just find the k training points cl...).
- This is K-nearest neighbors.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (this is k-nearest neighbors).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (this is k-nearest neighbors).
- No loss function to minimize.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (no loss function to minimize).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (no loss function to minimize).

---
## Reference Absorption: The Problem (cont.)
- You store the entire training set and compute distances at prediction time.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (you store the entire training set and compute distances at prediction time).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (you store the entire training set and compute distances at prediction time).
- It sounds too simple to work.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (it sounds too simple to work).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (it sounds too simple to work).
- But KNN is surprisingly competitive for many problems, especially with small to medium datasets, and understanding it deeply reveals fundamental concepts: the choice of distance metric (connecting to Phase 1...
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (but knn is surprisingly competitive for many problems, especially with small to medium datasets, and understanding it deeply re...).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (but knn is surprisingly competitive for many problems, especially with small to medium datasets, and understanding it...).
- KNN also shows up everywhere in modern AI, just under different names.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (knn also shows up everywhere in modern ai, just under different names).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (knn also shows up everywhere in modern ai, just under different names).

---
## Reference Absorption: The Problem Deep Continuation
- Vector databases do KNN search over embeddings.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (vector databases do knn search over embeddings).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (vector databases do knn search over embeddings).
- Retrieval-augmented generation (RAG) finds the K nearest document chunks.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (retrieval-augmented generation (rag) finds the k nearest document chunks).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (retrieval-augmented generation (rag) finds the k nearest document chunks).
- Recommendation systems find similar users or items.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (recommendation systems find similar users or items).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (recommendation systems find similar users or items).
- The scale and the data structures are different.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (the scale and the data structures are different).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (the scale and the data structures are different).

---
## Reference Absorption: Exercises
- Implement KNN classification on a 2D dataset with 3 classes.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (implement knn classification on a 2d dataset with 3 classes).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (implement knn classification on a 2d dataset with 3 classes).
- Plot the decision boundary for K=1, K=5, K=15, and K=N.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (plot the decision boundary for k=1, k=5, k=15, and k=n).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (plot the decision boundary for k=1, k=5, k=15, and k=n).
- Observe the transition from overfitting to underfitting.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (observe the transition from overfitting to underfitting).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (observe the transition from overfitting to underfitting).
- Generate 1000 random points in 2, 5, 10, 50, 100, and 500 dimensions.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (generate 1000 random points in 2, 5, 10, 50, 100, and 500 dimensions).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (generate 1000 random points in 2, 5, 10, 50, 100, and 500 dimensions).

---
## Reference Absorption: Exercises (cont.)
- For each dimensionality, compute the ratio of the maximum pairwise distance to the minimum pairwise distance.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (for each dimensionality, compute the ratio of the maximum pairwise distance to the minimum pairwise distance).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (for each dimensionality, compute the ratio of the maximum pairwise distance to the minimum pairwise distance).
- Plot the ratio vs dimensionality to visualize the curse of dimensionality.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (plot the ratio vs dimensionality to visualize the curse of dimensionality).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (plot the ratio vs dimensionality to visualize the curse of dimensionality).
- Compare L1, L2, and cosine distance for KNN on a text classification problem (use TF-IDF vectors).
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (compare l1, l2, and cosine distance for knn on a text classification problem (use tf-idf vectors)).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (compare l1, l2, and cosine distance for knn on a text classification problem (use tf-idf vectors)).
- Which metric gives the best accuracy?
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (which metric gives the best accuracy?).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (which metric gives the best accuracy?).

---
## Reference Absorption: Exercises Deep Continuation
- Why does cosine tend to win for text?
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (why does cosine tend to win for text?).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (why does cosine tend to win for text?).
- Implement a KD-tree and measure query time vs brute force for datasets of 1k, 10k, and 100k points in 2D, 10D, and 50D.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (implement a kd-tree and measure query time vs brute force for datasets of 1k, 10k, and 100k points in 2d, 10d, and 50d).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (implement a kd-tree and measure query time vs brute force for datasets of 1k, 10k, and 100k points in 2d, 10d, and 50d).
- At what dimensionality does the KD-tree stop being faster than brute force?
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (at what dimensionality does the kd-tree stop being faster than brute force?).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (at what dimensionality does the kd-tree stop being faster than brute force?).
- Build a weighted KNN regressor for y = sin(x) + noise.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (build a weighted knn regressor for y = sin(x) + noise).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (build a weighted knn regressor for y = sin(x) + noise).

---
## Reference Absorption: Exercises Deep Continuation
- Compare it with unweighted KNN for K=3, 10, 30.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (compare it with unweighted knn for k=3, 10, 30).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (compare it with unweighted knn for k=3, 10, 30).
- Show that weighting produces smoother predictions, especially for large K.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (show that weighting produces smoother predictions, especially for large k).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (show that weighting produces smoother predictions, especially for large k).

---
## Reference Absorption: Key Terms
- All work happens at prediction time.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (all work happens at prediction time).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (all work happens at prediction time).
- KNN is the canonical example |
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (knn is the canonical example |).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (knn is the canonical example |).
- Most ML algorithms are eager |
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (most ml algorithms are eager |).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (most ml algorithms are eager |).
- O(log n) queries in low dimensions |
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (o(log n) queries in low dimensions |).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (o(log n) queries in low dimensions |).

---
## Reference Absorption: Key Terms (cont.)
- Works better than KD-trees in moderate dimensions (up to ~50) |
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (works better than kd-trees in moderate dimensions (up to ~50) |).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (works better than kd-trees in moderate dimensions (up to ~50) |).
- Closer neighbors have more influence on the prediction |
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (closer neighbors have more influence on the prediction |).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (closer neighbors have more influence on the prediction |).
- Required for distance-based methods like KNN |
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (required for distance-based methods like knn |).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (required for distance-based methods like knn |).
- Exact but slow for large n |
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (exact but slow for large n |).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (exact but slow for large n |).

---
## Reference Absorption: Key Terms Deep Continuation
- K=1 KNN produces Voronoi boundaries |
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (k=1 knn produces voronoi boundaries |).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (k=1 knn produces voronoi boundaries |).

---
## Reference Absorption: Distance metrics
- The distance function defines what "near" means.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (the distance function defines what "near" means).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (the distance function defines what "near" means).
- Different metrics produce different neighbors, different predictions.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (different metrics produce different neighbors, different predictions).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (different metrics produce different neighbors, different predictions).
- L2 (Euclidean) is the default.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (l2 (euclidean) is the default).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (l2 (euclidean) is the default).
- Always standardize features before using L2 with KNN.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (always standardize features before using l2 with knn).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (always standardize features before using l2 with knn).

---
## Reference Absorption: Distance metrics (cont.)
- L1 (Manhattan) sums absolute differences.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (l1 (manhattan) sums absolute differences).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (l1 (manhattan) sums absolute differences).
- More robust to outliers than L2 because it does not square the differences.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (more robust to outliers than l2 because it does not square the differences).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (more robust to outliers than l2 because it does not square the differences).
- Cosine distance measures the angle between vectors, ignoring magnitude.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (cosine distance measures the angle between vectors, ignoring magnitude).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (cosine distance measures the angle between vectors, ignoring magnitude).
- Essential for text and embedding data.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (essential for text and embedding data).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (essential for text and embedding data).

---
## Reference Absorption: Distance metrics Deep Continuation
- Minkowski generalizes L1 and L2 with parameter p.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (minkowski generalizes l1 and l2 with parameter p).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (minkowski generalizes l1 and l2 with parameter p).
- Which metric to use depends on the data:
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (which metric to use depends on the data:).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (which metric to use depends on the data:).

---
## Reference Absorption: The curse of dimensionality
- KNN performance degrades in high dimensions.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (knn performance degrades in high dimensions).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (knn performance degrades in high dimensions).
- This is not a vague concern.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (this is not a vague concern).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (this is not a vague concern).
- Problem 1: distances converge. As dimensionality increases, the ratio of the maximum distance to the minimum distance approaches 1.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (problem 1: distances converge. as dimensionality increases, the ratio of the maximum distance to the minimum distance approaches 1).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (problem 1: distances converge. as dimensionality increases, the ratio of the maximum distance to the minimum distance...).
- All points become equally "far" from the query.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (all points become equally "far" from the query).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (all points become equally "far" from the query).

---
## Reference Absorption: The curse of dimensionality (cont.)
- Problem 2: volume explodes. To capture K neighbors within a fixed fraction of the data, you need to extend your search radius to cover a much larger fraction of the feature space.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (problem 2: volume explodes. to capture k neighbors within a fixed fraction of the data, you need to extend your search radius t...).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (problem 2: volume explodes. to capture k neighbors within a fixed fraction of the data, you need to extend your searc...).
- The "neighborhood" in high dimensions encompasses most of the space.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (the "neighborhood" in high dimensions encompasses most of the space).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (the "neighborhood" in high dimensions encompasses most of the space).
- Problem 3: corners dominate. In a unit hypercube in d dimensions, most of the volume is concentrated near the corners, not the center.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (problem 3: corners dominate. in a unit hypercube in d dimensions, most of the volume is concentrated near the corners, not the...).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (problem 3: corners dominate. in a unit hypercube in d dimensions, most of the volume is concentrated near the corners...).
- A sphere inscribed in the cube contains a vanishing fraction of the volume as d grows.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (a sphere inscribed in the cube contains a vanishing fraction of the volume as d grows).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (a sphere inscribed in the cube contains a vanishing fraction of the volume as d grows).

---
## Reference Absorption: The curse of dimensionality Deep Continuation
- Practical consequence: KNN works well up to about 20-50 features.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (practical consequence: knn works well up to about 20-50 features).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (practical consequence: knn works well up to about 20-50 features).
- Beyond that, you need dimensionality reduction (PCA, UMAP, t-SNE) before applying KNN, or you need to use tree-based search structures that exploit the data's intrinsic lower dimensionality.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (beyond that, you need dimensionality reduction (pca, umap, t-sne) before applying knn, or you need to use tree-based search str...).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (beyond that, you need dimensionality reduction (pca, umap, t-sne) before applying knn, or you need to use tree-based...).

---
## Reference Absorption: Lazy learning vs eager learning
- KNN is a lazy learner: it does no work at training time and all work at prediction time.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (knn is a lazy learner: it does no work at training time and all work at prediction time).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (knn is a lazy learner: it does no work at training time and all work at prediction time).
- Most other algorithms (linear regression, SVMs, neural networks) are eager learners: they do heavy computation at training time to build a compact model, then predictions are fast.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (most other algorithms (linear regression, svms, neural networks) are eager learners: they do heavy computation at training time...).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (most other algorithms (linear regression, svms, neural networks) are eager learners: they do heavy computation at tra...).
- Lazy learning is ideal when:
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (lazy learning is ideal when:).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (lazy learning is ideal when:).
- The dataset changes frequently (add/remove points without retraining)
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (the dataset changes frequently (add/remove points without retraining)).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (the dataset changes frequently (add/remove points without retraining)).

---
## Reference Absorption: Lazy learning vs eager learning (cont.)
- You need predictions for very few queries
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (you need predictions for very few queries).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (you need predictions for very few queries).
- The dataset is small enough that brute-force search is fast
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (the dataset is small enough that brute-force search is fast).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (the dataset is small enough that brute-force search is fast).

---
## Reference Absorption: KD-trees: fast nearest neighbor search
- Brute-force KNN computes the distance from the query to every training point.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (brute-force knn computes the distance from the query to every training point).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (brute-force knn computes the distance from the query to every training point).
- For large datasets, this is too slow.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (for large datasets, this is too slow).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (for large datasets, this is too slow).
- A KD-tree recursively partitions the space along feature axes.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (a kd-tree recursively partitions the space along feature axes).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (a kd-tree recursively partitions the space along feature axes).
- At each level, it splits along one dimension at the median value.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (at each level, it splits along one dimension at the median value).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (at each level, it splits along one dimension at the median value).

---
## Reference Absorption: KD-trees: fast nearest neighbor search (cont.)
- To find the nearest neighbor, traverse the tree to the leaf containing the query, then backtrack and check neighboring partitions only if they could contain closer points.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (to find the nearest neighbor, traverse the tree to the leaf containing the query, then backtrack and check neighboring partitio...).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (to find the nearest neighbor, traverse the tree to the leaf containing the query, then backtrack and check neighborin...).
- Average query time: O(log n) for low dimensions.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (average query time: o(log n) for low dimensions).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (average query time: o(log n) for low dimensions).
- But KD-trees degrade to O(n) in high dimensions (d > 20) because the backtracking eliminates fewer and fewer branches.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (but kd-trees degrade to o(n) in high dimensions (d > 20) because the backtracking eliminates fewer and fewer branches).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (but kd-trees degrade to o(n) in high dimensions (d > 20) because the backtracking eliminates fewer and fewer branches).

---
## Reference Absorption: Choosing K
- K is the single hyperparameter.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (k is the single hyperparameter).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (k is the single hyperparameter).
- It controls the bias-variance trade-off:
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (it controls the bias-variance trade-off:).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (it controls the bias-variance trade-off:).
- Can capture complex boundaries |
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (can capture complex boundaries |).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (can capture complex boundaries |).
- A common starting point is K = sqrt(N) for a dataset of N points.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (a common starting point is k = sqrt(n) for a dataset of n points).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (a common starting point is k = sqrt(n) for a dataset of n points).

---
## Reference Absorption: Choosing K (cont.)
- Use odd K for binary classification to avoid ties.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (use odd k for binary classification to avoid ties).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (use odd k for binary classification to avoid ties).

---
## Reference Absorption: Further Reading
- [Cover & Hart: Nearest Neighbor Pattern Classification (1967)](https://ieeexplore.ieee.org/document/1053964) - the foundational KNN paper proving it has error rate at most twice the Bayes optimal
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade ([cover & hart: nearest neighbor pattern classification (1967)](https://ieeexplore.ieee.org/document/1053964) - the foundational...).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept ([cover & hart: nearest neighbor pattern classification (1967)](https://ieeexplore.ieee.org/document/1053964) - the fo...).
- [Friedman, Bentley, Finkel: An Algorithm for Finding Best Matches in Logarithmic Expected Time (1977)](https://dl.acm.org/doi/10.1145/355744.355745) - the original KD-tree paper
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade ([friedman, bentley, finkel: an algorithm for finding best matches in logarithmic expected time (1977)](https://dl.acm.org/doi/1...).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept ([friedman, bentley, finkel: an algorithm for finding best matches in logarithmic expected time (1977)](https://dl.acm...).
- [Beyer et al.: When Is "Nearest Neighbor" Meaningful? (1999)](https://link.springer.com/chapter/10.1007/3-540-49257-7_15) - formal analysis of the curse of dimensionality for nearest neighbor
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade ([beyer et al.: when is "nearest neighbor" meaningful? (1999)](https://link.springer.com/chapter/10.1007/3-540-49257-7_15) - for...).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept ([beyer et al.: when is "nearest neighbor" meaningful? (1999)](https://link.springer.com/chapter/10.1007/3-540-49257-7...).
- [scikit-learn Nearest Neighbors documentation](https://scikit-learn.org/stable/modules/neighbors.html) - practical guide with algorithm selection
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade ([scikit-learn nearest neighbors documentation](https://scikit-learn.org/stable/modules/neighbors.html) - practical guide with a...).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept ([scikit-learn nearest neighbors documentation](https://scikit-learn.org/stable/modules/neighbors.html) - practical gu...).

---
## Reference Absorption: Further Reading (cont.)
- [FAISS: A Library for Efficient Similarity Search](https://github.com/facebookresearch/faiss) - Meta's library for billion-scale approximate nearest neighbor search
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade ([faiss: a library for efficient similarity search](https://github.com/facebookresearch/faiss) - meta's library for billion-scal...).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept ([faiss: a library for efficient similarity search](https://github.com/facebookresearch/faiss) - meta's library for bi...).

---
## Reference Absorption: Use It
- Scikit-learn automatically uses KD-trees or ball trees when the dataset is large enough and the dimensionality is low enough.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (scikit-learn automatically uses kd-trees or ball trees when the dataset is large enough and the dimensionality is low enough).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (scikit-learn automatically uses kd-trees or ball trees when the dataset is large enough and the dimensionality is low...).
- For high-dimensional data, it falls back to brute force.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (for high-dimensional data, it falls back to brute force).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (for high-dimensional data, it falls back to brute force).
- You can control this with the algorithm parameter.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (you can control this with the algorithm parameter).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (you can control this with the algorithm parameter).
- For large-scale nearest neighbor search (millions of vectors), use FAISS, Annoy, or a vector database:
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (for large-scale nearest neighbor search (millions of vectors), use faiss, annoy, or a vector database:).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (for large-scale nearest neighbor search (millions of vectors), use faiss, annoy, or a vector database:).

---
## Reference Absorption: Step 1: Distance functions
- Implement L1, L2, cosine, and Minkowski distances.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (implement l1, l2, cosine, and minkowski distances).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (implement l1, l2, cosine, and minkowski distances).
- These connect directly to Phase 1 Lesson 14.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (these connect directly to phase 1 lesson 14).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (these connect directly to phase 1 lesson 14).

---
## Reference Absorption: How KNN works
- Given a dataset of labeled points and a new query point:
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (given a dataset of labeled points and a new query point:).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (given a dataset of labeled points and a new query point:).
- Compute the distance from the query to every point in the dataset
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (compute the distance from the query to every point in the dataset).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (compute the distance from the query to every point in the dataset).
- For classification: majority vote among the K neighbors
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (for classification: majority vote among the k neighbors).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (for classification: majority vote among the k neighbors).
- For regression: average (or weighted average) of the K neighbors' values
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (for regression: average (or weighted average) of the k neighbors' values).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (for regression: average (or weighted average) of the k neighbors' values).

---
## Reference Absorption: How KNN works (cont.)
- That is the entire algorithm.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (that is the entire algorithm).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (that is the entire algorithm).

---
## Reference Absorption: Ball trees: better for moderate dimensions
- Ball trees partition data into nested hyperspheres instead of axis-aligned boxes.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (ball trees partition data into nested hyperspheres instead of axis-aligned boxes).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (ball trees partition data into nested hyperspheres instead of axis-aligned boxes).
- Each node defines a ball (center + radius) that contains all points in that subtree.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (each node defines a ball (center + radius) that contains all points in that subtree).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (each node defines a ball (center + radius) that contains all points in that subtree).
- Work better in moderate dimensions (up to ~50)
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (work better in moderate dimensions (up to ~50)).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (work better in moderate dimensions (up to ~50)).
- Handle non-axis-aligned structure
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (handle non-axis-aligned structure).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (handle non-axis-aligned structure).

---
## Reference Absorption: Ball trees: better for moderate dimensions (cont.)
- Tighter bounding volumes mean more branches are pruned during search
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (tighter bounding volumes mean more branches are pruned during search).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (tighter bounding volumes mean more branches are pruned during search).
- Both KD-trees and ball trees are exact algorithms.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (both kd-trees and ball trees are exact algorithms).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (both kd-trees and ball trees are exact algorithms).
- For truly large-scale search (millions of points, hundreds of dimensions), approximate nearest neighbor methods (HNSW, IVF, product quantization) are used instead.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (for truly large-scale search (millions of points, hundreds of dimensions), approximate nearest neighbor methods (hnsw, ivf, pro...).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (for truly large-scale search (millions of points, hundreds of dimensions), approximate nearest neighbor methods (hnsw...).
- These are covered in Phase 1 Lesson 14.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (these are covered in phase 1 lesson 14).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (these are covered in phase 1 lesson 14).

---
## Reference Absorption: Weighted KNN
- Standard KNN gives equal weight to all K neighbors.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (standard knn gives equal weight to all k neighbors).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (standard knn gives equal weight to all k neighbors).
- But a neighbor at distance 0.1 should matter more than one at distance 5.0.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (but a neighbor at distance 0.1 should matter more than one at distance 5.0).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (but a neighbor at distance 0.1 should matter more than one at distance 5.0).
- Distance-weighted KNN weights each neighbor inversely by distance:
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (distance-weighted knn weights each neighbor inversely by distance:).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (distance-weighted knn weights each neighbor inversely by distance:).
- The epsilon prevents division by zero when a query point exactly matches a training point.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (the epsilon prevents division by zero when a query point exactly matches a training point).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (the epsilon prevents division by zero when a query point exactly matches a training point).

---
## Reference Absorption: Weighted KNN (cont.)
- Weighted KNN is less sensitive to the choice of K because distant neighbors contribute very little regardless.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (weighted knn is less sensitive to the choice of k because distant neighbors contribute very little regardless).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (weighted knn is less sensitive to the choice of k because distant neighbors contribute very little regardless).

---
## Reference Absorption: Step 2: KNN classifier and regressor
- Build the full KNN with configurable K, distance metric, and optional distance weighting.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (build the full knn with configurable k, distance metric, and optional distance weighting).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (build the full knn with configurable k, distance metric, and optional distance weighting).

---
## Reference Absorption: Step 4: Feature scaling
- KNN requires feature scaling because distances are sensitive to feature magnitudes.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (knn requires feature scaling because distances are sensitive to feature magnitudes).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (knn requires feature scaling because distances are sensitive to feature magnitudes).
- A feature ranging from 0 to 1000 will dominate a feature ranging from 0 to 1.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (a feature ranging from 0 to 1000 will dominate a feature ranging from 0 to 1).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (a feature ranging from 0 to 1000 will dominate a feature ranging from 0 to 1).

---
## Reference Absorption: KNN for regression
- Instead of majority voting, KNN for regression averages the target values of the K neighbors.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (instead of majority voting, knn for regression averages the target values of the k neighbors).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (instead of majority voting, knn for regression averages the target values of the k neighbors).
- KNN regression produces piecewise-constant (or piecewise-smooth with weighting) predictions.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (knn regression produces piecewise-constant (or piecewise-smooth with weighting) predictions).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (knn regression produces piecewise-constant (or piecewise-smooth with weighting) predictions).
- It cannot extrapolate beyond the range of the training data.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (it cannot extrapolate beyond the range of the training data).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (it cannot extrapolate beyond the range of the training data).
- If the training targets are all between 0 and 100, KNN will never predict 200.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (if the training targets are all between 0 and 100, knn will never predict 200).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (if the training targets are all between 0 and 100, knn will never predict 200).

---
## Beyond Reference: Engineering Translation
- Core anchors for this module: distance, points, training, nearest, neighbors, data, search, point.
- Convert each theoretical primitive into measurable training and inference behaviors.
- Define observability checkpoints for drift, calibration, and latency regressions.
- Tie assumptions to explicit data contracts and fallback policies.

---
## Beyond Reference: Advanced Layer 1
- Quantify KNN inference latency at scale and choose ANN indices when brute-force breaks SLOs.
- Risk and governance extension: convert this into acceptance tests and rollback criteria (quantify knn inference latency at scale and choose ann indices when brute-force breaks slos.).
- Benchmark distance metrics under standardized versus raw feature spaces.
- Risk and governance extension: convert this into acceptance tests and rollback criteria (benchmark distance metrics under standardized versus raw feature spaces.).
- Diagnose curse-of-dimensionality onset with neighbor-distance concentration metrics.
- Risk and governance extension: convert this into acceptance tests and rollback criteria (diagnose curse-of-dimensionality onset with neighbor-distance concentration metrics.).

<!-- DEPTH_EXPANSION_END -->
