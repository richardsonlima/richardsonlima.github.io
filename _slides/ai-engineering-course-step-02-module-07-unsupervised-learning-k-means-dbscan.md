---
layout: slides
title: "Unsupervised Learning: K-Means, DBSCAN"
category: "ai-engineering-course-step-02"
module_number: 7
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
## Module 07: Unsupervised Learning: K-Means, DBSCAN
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
- Every ML lesson so far has assumed labeled data: "here is an input, here is the correct output." In the real world, labels are expensive.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (every ml lesson so far has assumed labeled data: "here is an input, here is the correct output." in the real world, labels are...).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (every ml lesson so far has assumed labeled data: "here is an input, here is the correct output." in the real world, l...).
- A hospital has millions of patient records but no one has manually tagged each one with a disease category.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (a hospital has millions of patient records but no one has manually tagged each one with a disease category).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (a hospital has millions of patient records but no one has manually tagged each one with a disease category).
- An e-commerce site has millions of user sessions but no one has hand-labeled customer segments.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (an e-commerce site has millions of user sessions but no one has hand-labeled customer segments).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (an e-commerce site has millions of user sessions but no one has hand-labeled customer segments).
- A security team has network logs but nobody has flagged every anomaly.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (a security team has network logs but nobody has flagged every anomaly).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (a security team has network logs but nobody has flagged every anomaly).

---
## Reference Absorption: The Problem (cont.)
- Unsupervised learning finds patterns without being told what to look for.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (unsupervised learning finds patterns without being told what to look for).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (unsupervised learning finds patterns without being told what to look for).
- It groups similar data points, discovers hidden structures, and surfaces anomalies.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (it groups similar data points, discovers hidden structures, and surfaces anomalies).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (it groups similar data points, discovers hidden structures, and surfaces anomalies).
- If supervised learning is learning from a textbook with an answer key, unsupervised learning is staring at raw data until the patterns reveal themselves.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (if supervised learning is learning from a textbook with an answer key, unsupervised learning is staring at raw data until the p...).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (if supervised learning is learning from a textbook with an answer key, unsupervised learning is staring at raw data u...).
- The catch: without labels, you cannot directly measure "right" or "wrong." You need different tools to evaluate whether the structure your algorithm found is meaningful.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (the catch: without labels, you cannot directly measure "right" or "wrong." you need different tools to evaluate whether the str...).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (the catch: without labels, you cannot directly measure "right" or "wrong." you need different tools to evaluate wheth...).

---
## Reference Absorption: Exercises
- Implement K-Means++ initialization: instead of picking random centroids, pick the first randomly and each subsequent centroid with probability proportional to its squared distance from the nearest existing c...
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (implement k-means++ initialization: instead of picking random centroids, pick the first randomly and each subsequent centroid w...).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (implement k-means++ initialization: instead of picking random centroids, pick the first randomly and each subsequent...).
- Compare convergence speed to random initialization.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (compare convergence speed to random initialization).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (compare convergence speed to random initialization).
- Add hierarchical agglomerative clustering to the code.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (add hierarchical agglomerative clustering to the code).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (add hierarchical agglomerative clustering to the code).
- Implement Ward's linkage and produce a dendrogram (as a nested list of merges).
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (implement ward's linkage and produce a dendrogram (as a nested list of merges)).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (implement ward's linkage and produce a dendrogram (as a nested list of merges)).

---
## Reference Absorption: Exercises (cont.)
- Cut it at different levels and compare to K-Means results.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (cut it at different levels and compare to k-means results).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (cut it at different levels and compare to k-means results).
- Build a simple anomaly detection pipeline: run DBSCAN and GMM on the same data, flag points that both methods agree are outliers (noise in DBSCAN, low probability in GMM).
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (build a simple anomaly detection pipeline: run dbscan and gmm on the same data, flag points that both methods agree are outlier...).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (build a simple anomaly detection pipeline: run dbscan and gmm on the same data, flag points that both methods agree a...).
- Measure the overlap and discuss when the methods disagree.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (measure the overlap and discuss when the methods disagree).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (measure the overlap and discuss when the methods disagree).

---
## Reference Absorption: DBSCAN: Density-Based Clustering
- K-Means assumes clusters are spherical and requires you to pick K upfront.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (k-means assumes clusters are spherical and requires you to pick k upfront).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (k-means assumes clusters are spherical and requires you to pick k upfront).
- DBSCAN makes neither assumption.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (dbscan makes neither assumption).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (dbscan makes neither assumption).
- It finds clusters as dense regions separated by sparse regions.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (it finds clusters as dense regions separated by sparse regions).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (it finds clusters as dense regions separated by sparse regions).
- eps: the radius of a neighborhood
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (eps: the radius of a neighborhood).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (eps: the radius of a neighborhood).

---
## Reference Absorption: DBSCAN: Density-Based Clustering (cont.)
- min_samples: the minimum number of points needed to form a dense region
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (min_samples: the minimum number of points needed to form a dense region).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (min_samples: the minimum number of points needed to form a dense region).
- Core point: has at least min_samples points within eps distance
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (core point: has at least min_samples points within eps distance).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (core point: has at least min_samples points within eps distance).
- Border point: within eps of a core point but not itself a core point
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (border point: within eps of a core point but not itself a core point).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (border point: within eps of a core point but not itself a core point).
- Noise point: neither core nor border. These are outliers.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (noise point: neither core nor border. these are outliers).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (noise point: neither core nor border. these are outliers).

---
## Reference Absorption: DBSCAN: Density-Based Clustering Deep Continuation
- DBSCAN connects core points that are within eps of each other into the same cluster.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (dbscan connects core points that are within eps of each other into the same cluster).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (dbscan connects core points that are within eps of each other into the same cluster).
- Border points join the cluster of a nearby core point.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (border points join the cluster of a nearby core point).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (border points join the cluster of a nearby core point).
- Noise points belong to no cluster.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (noise points belong to no cluster).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (noise points belong to no cluster).
- Strengths: finds clusters of any shape, automatically determines the number of clusters, identifies outliers.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (strengths: finds clusters of any shape, automatically determines the number of clusters, identifies outliers).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (strengths: finds clusters of any shape, automatically determines the number of clusters, identifies outliers).

---
## Reference Absorption: DBSCAN: Density-Based Clustering Deep Continuation
- Weakness: struggles with clusters of varying densities.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (weakness: struggles with clusters of varying densities).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (weakness: struggles with clusters of varying densities).

---
## Reference Absorption: Use It
- With scikit-learn, the same algorithms are one-liners:
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (with scikit-learn, the same algorithms are one-liners:).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (with scikit-learn, the same algorithms are one-liners:).
- The from-scratch versions show you exactly what these libraries compute.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (the from-scratch versions show you exactly what these libraries compute).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (the from-scratch versions show you exactly what these libraries compute).
- K-Means iterates between assigning and recomputing.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (k-means iterates between assigning and recomputing).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (k-means iterates between assigning and recomputing).
- DBSCAN grows clusters from dense seeds.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (dbscan grows clusters from dense seeds).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (dbscan grows clusters from dense seeds).

---
## Reference Absorption: Use It (cont.)
- GMM alternates between expectation and maximization.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (gmm alternates between expectation and maximization).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (gmm alternates between expectation and maximization).
- The library versions add numerical stability, smarter initialization (K-Means++), and GPU acceleration, but the core logic is the same.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (the library versions add numerical stability, smarter initialization (k-means++), and gpu acceleration, but the core logic is t...).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (the library versions add numerical stability, smarter initialization (k-means++), and gpu acceleration, but the core...).

---
## Reference Absorption: Gaussian Mixture Models (GMM)
- K-Means gives hard assignments: each point belongs to exactly one cluster.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (k-means gives hard assignments: each point belongs to exactly one cluster).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (k-means gives hard assignments: each point belongs to exactly one cluster).
- GMM gives soft assignments: each point has a probability of belonging to each cluster.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (gmm gives soft assignments: each point has a probability of belonging to each cluster).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (gmm gives soft assignments: each point has a probability of belonging to each cluster).
- GMM assumes the data is generated from a mixture of K Gaussian distributions, each with its own mean and covariance.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (gmm assumes the data is generated from a mixture of k gaussian distributions, each with its own mean and covariance).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (gmm assumes the data is generated from a mixture of k gaussian distributions, each with its own mean and covariance).
- The Expectation-Maximization (EM) algorithm alternates between:
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (the expectation-maximization (em) algorithm alternates between:).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (the expectation-maximization (em) algorithm alternates between:).

---
## Reference Absorption: Gaussian Mixture Models (GMM) (cont.)
- E-step: compute the probability that each point belongs to each Gaussian
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (e-step: compute the probability that each point belongs to each gaussian).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (e-step: compute the probability that each point belongs to each gaussian).
- M-step: update the mean, covariance, and mixing weight of each Gaussian to maximize the likelihood of the data
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (m-step: update the mean, covariance, and mixing weight of each gaussian to maximize the likelihood of the data).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (m-step: update the mean, covariance, and mixing weight of each gaussian to maximize the likelihood of the data).
- GMM can model elliptical clusters (not just spherical like K-Means) and naturally handles overlapping clusters.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (gmm can model elliptical clusters (not just spherical like k-means) and naturally handles overlapping clusters).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (gmm can model elliptical clusters (not just spherical like k-means) and naturally handles overlapping clusters).

---
## Reference Absorption: Hierarchical Clustering
- Builds a tree (dendrogram) of nested clusters.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (builds a tree (dendrogram) of nested clusters).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (builds a tree (dendrogram) of nested clusters).
- Start with each point as its own cluster
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (start with each point as its own cluster).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (start with each point as its own cluster).
- Merge the two closest clusters
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (merge the two closest clusters).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (merge the two closest clusters).
- Repeat until only one cluster remains
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (repeat until only one cluster remains).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (repeat until only one cluster remains).

---
## Reference Absorption: Hierarchical Clustering (cont.)
- Cut the dendrogram at the desired level to get K clusters
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (cut the dendrogram at the desired level to get k clusters).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (cut the dendrogram at the desired level to get k clusters).
- The "closeness" between clusters can be measured as:
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (the "closeness" between clusters can be measured as:).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (the "closeness" between clusters can be measured as:).
- Single linkage: minimum distance between any two points in the two clusters
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (single linkage: minimum distance between any two points in the two clusters).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (single linkage: minimum distance between any two points in the two clusters).
- Complete linkage: maximum distance between any two points
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (complete linkage: maximum distance between any two points).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (complete linkage: maximum distance between any two points).

---
## Reference Absorption: Hierarchical Clustering Deep Continuation
- Average linkage: average distance between all pairs
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (average linkage: average distance between all pairs).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (average linkage: average distance between all pairs).
- Ward's method: the merge that causes the smallest increase in total within-cluster variance
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (ward's method: the merge that causes the smallest increase in total within-cluster variance).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (ward's method: the merge that causes the smallest increase in total within-cluster variance).

---
## Reference Absorption: K-Means: The Workhorse
- K-Means partitions data into exactly K clusters.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (k-means partitions data into exactly k clusters).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (k-means partitions data into exactly k clusters).
- Each cluster has a centroid (its center of mass), and every point belongs to the nearest centroid.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (each cluster has a centroid (its center of mass), and every point belongs to the nearest centroid).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (each cluster has a centroid (its center of mass), and every point belongs to the nearest centroid).
- Pick K random points as initial centroids
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (pick k random points as initial centroids).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (pick k random points as initial centroids).
- Assign each data point to the nearest centroid
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (assign each data point to the nearest centroid).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (assign each data point to the nearest centroid).

---
## Reference Absorption: K-Means: The Workhorse (cont.)
- Recompute each centroid as the mean of its assigned points
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (recompute each centroid as the mean of its assigned points).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (recompute each centroid as the mean of its assigned points).
- Repeat steps 2-3 until assignments stop changing
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (repeat steps 2-3 until assignments stop changing).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (repeat steps 2-3 until assignments stop changing).
- The objective function (inertia) measures the total squared distance from each point to its assigned centroid.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (the objective function (inertia) measures the total squared distance from each point to its assigned centroid).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (the objective function (inertia) measures the total squared distance from each point to its assigned centroid).
- K-Means minimizes this, but only finds a local minimum.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (k-means minimizes this, but only finds a local minimum).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (k-means minimizes this, but only finds a local minimum).

---
## Reference Absorption: K-Means: The Workhorse Deep Continuation
- Different initializations can give different results.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (different initializations can give different results).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (different initializations can give different results).

---
## Reference Absorption: Clustering: Grouping Similar Things Together
- Clustering assigns each data point to a group (cluster) so that points within the same group are more similar to each other than to points in other groups.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (clustering assigns each data point to a group (cluster) so that points within the same group are more similar to each other tha...).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (clustering assigns each data point to a group (cluster) so that points within the same group are more similar to each...).
- The question is always: what does "similar" mean?
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (the question is always: what does "similar" mean?).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (the question is always: what does "similar" mean?).

---
## Reference Absorption: Further Reading
- [Stanford CS229 - Unsupervised Learning](https://cs229.stanford.edu/notes2022fall/main_notes.pdf) - Andrew Ng's lecture notes on clustering and EM
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade ([stanford cs229 - unsupervised learning](https://cs229.stanford.edu/notes2022fall/main_notes.pdf) - andrew ng's lecture notes o...).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept ([stanford cs229 - unsupervised learning](https://cs229.stanford.edu/notes2022fall/main_notes.pdf) - andrew ng's lectu...).
- [scikit-learn Clustering Guide](https://scikit-learn.org/stable/modules/clustering.html) - practical comparison of all clustering algorithms with visual examples
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade ([scikit-learn clustering guide](https://scikit-learn.org/stable/modules/clustering.html) - practical comparison of all clusteri...).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept ([scikit-learn clustering guide](https://scikit-learn.org/stable/modules/clustering.html) - practical comparison of al...).
- [DBSCAN original paper (Ester et al., 1996)](https://www.aaai.org/Papers/KDD/1996/KDD96-037.pdf) - the paper that introduced density-based clustering
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade ([dbscan original paper (ester et al., 1996)](https://www.aaai.org/papers/kdd/1996/kdd96-037.pdf) - the paper that introduced de...).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept ([dbscan original paper (ester et al., 1996)](https://www.aaai.org/papers/kdd/1996/kdd96-037.pdf) - the paper that int...).

---
## Reference Absorption: Choosing K
- Elbow method: Run K-Means for K = 1, 2, 3, ..., n.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (elbow method: run k-means for k = 1, 2, 3, ..., n).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (elbow method: run k-means for k = 1, 2, 3, ..., n).
- Look for the "elbow" where adding more clusters stops reducing inertia significantly.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (look for the "elbow" where adding more clusters stops reducing inertia significantly).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (look for the "elbow" where adding more clusters stops reducing inertia significantly).
- Silhouette score: For each point, measure how similar it is to its own cluster (a) versus the nearest other cluster (b).
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (silhouette score: for each point, measure how similar it is to its own cluster (a) versus the nearest other cluster (b)).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (silhouette score: for each point, measure how similar it is to its own cluster (a) versus the nearest other cluster (b)).
- The silhouette coefficient is (b - a) / max(a, b), ranging from -1 (wrong cluster) to +1 (well-clustered).
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (the silhouette coefficient is (b - a) / max(a, b), ranging from -1 (wrong cluster) to +1 (well-clustered)).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (the silhouette coefficient is (b - a) / max(a, b), ranging from -1 (wrong cluster) to +1 (well-clustered)).

---
## Reference Absorption: Choosing K (cont.)
- Average across all points for a global score.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (average across all points for a global score).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (average across all points for a global score).

---
## Reference Absorption: Learning Objectives
- Implement K-Means, DBSCAN, and Gaussian Mixture Models from scratch and compare their clustering behavior
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (implement k-means, dbscan, and gaussian mixture models from scratch and compare their clustering behavior).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (implement k-means, dbscan, and gaussian mixture models from scratch and compare their clustering behavior).
- Evaluate cluster quality using the silhouette score and the elbow method to select the optimal K
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (evaluate cluster quality using the silhouette score and the elbow method to select the optimal k).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (evaluate cluster quality using the silhouette score and the elbow method to select the optimal k).
- Explain when DBSCAN outperforms K-Means and identify which algorithm handles non-spherical clusters and outliers
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (explain when dbscan outperforms k-means and identify which algorithm handles non-spherical clusters and outliers).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (explain when dbscan outperforms k-means and identify which algorithm handles non-spherical clusters and outliers).
- Build an anomaly detection pipeline using clustering methods to flag points that deviate from normal patterns
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (build an anomaly detection pipeline using clustering methods to flag points that deviate from normal patterns).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (build an anomaly detection pipeline using clustering methods to flag points that deviate from normal patterns).

---
## Reference Absorption: Overview
- The algorithm finds structure on its own.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (the algorithm finds structure on its own).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (the algorithm finds structure on its own).

---
## Reference Absorption: Anomaly Detection with Clustering
- Clustering naturally supports anomaly detection:
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (clustering naturally supports anomaly detection:).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (clustering naturally supports anomaly detection:).
- K-Means: points far from any centroid are anomalies
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (k-means: points far from any centroid are anomalies).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (k-means: points far from any centroid are anomalies).
- DBSCAN: noise points are anomalies by definition
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (dbscan: noise points are anomalies by definition).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (dbscan: noise points are anomalies by definition).
- GMM: points with low probability under all Gaussians are anomalies
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (gmm: points with low probability under all gaussians are anomalies).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (gmm: points with low probability under all gaussians are anomalies).

---
## Beyond Reference: Engineering Translation
- Core anchors for this module: data, clusters, cluster, means, point, dbscan, labels, assignments.
- Convert each theoretical primitive into measurable training and inference behaviors.
- Define observability checkpoints for drift, calibration, and latency regressions.
- Tie assumptions to explicit data contracts and fallback policies.

---
## Beyond Reference: Advanced Layer 1
- Compare K-Means, DBSCAN, and GMM under non-spherical clusters and outlier contamination.
- Risk and governance extension: convert this into acceptance tests and rollback criteria (compare k-means, dbscan, and gmm under non-spherical clusters and outlier contamination.).
- Use stability analysis across seeds and subsamples before trusting cluster narratives.
- Risk and governance extension: convert this into acceptance tests and rollback criteria (use stability analysis across seeds and subsamples before trusting cluster narratives.).
- Build anomaly flags from low-density assignments with calibrated alert thresholds.
- Risk and governance extension: convert this into acceptance tests and rollback criteria (build anomaly flags from low-density assignments with calibrated alert thresholds.).

<!-- DEPTH_EXPANSION_END -->
