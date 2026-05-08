---
layout: slides
title: "Decision Trees & Random Forests"
category: "ai-engineering-course-step-02"
module_number: 4
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
## Module 04: Decision Trees & Random Forests
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
- Rows are samples, columns are features, and there is a target column you want to predict.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (rows are samples, columns are features, and there is a target column you want to predict).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (rows are samples, columns are features, and there is a target column you want to predict).
- You could throw a neural network at it.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (you could throw a neural network at it).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (you could throw a neural network at it).
- But for tabular data, tree-based models (decision trees, random forests, gradient boosted trees) consistently outperform deep learning.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (but for tabular data, tree-based models (decision trees, random forests, gradient boosted trees) consistently outperform deep l...).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (but for tabular data, tree-based models (decision trees, random forests, gradient boosted trees) consistently outperf...).
- Kaggle competitions on structured data are dominated by XGBoost and LightGBM, not transformers.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (kaggle competitions on structured data are dominated by xgboost and lightgbm, not transformers).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (kaggle competitions on structured data are dominated by xgboost and lightgbm, not transformers).

---
## Reference Absorption: The Problem (cont.)
- Trees handle mixed feature types (numeric and categorical) without preprocessing.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (trees handle mixed feature types (numeric and categorical) without preprocessing).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (trees handle mixed feature types (numeric and categorical) without preprocessing).
- They handle nonlinear relationships without feature engineering.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (they handle nonlinear relationships without feature engineering).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (they handle nonlinear relationships without feature engineering).
- They are interpretable: you can look at the tree and see exactly why a prediction was made.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (they are interpretable: you can look at the tree and see exactly why a prediction was made).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (they are interpretable: you can look at the tree and see exactly why a prediction was made).
- And random forests, which average many trees, are highly resistant to overfitting on moderate-sized datasets.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (and random forests, which average many trees, are highly resistant to overfitting on moderate-sized datasets).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (and random forests, which average many trees, are highly resistant to overfitting on moderate-sized datasets).

---
## Reference Absorption: The Problem Deep Continuation
- This lesson builds decision trees from scratch using recursive splitting, then builds a random forest on top.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (this lesson builds decision trees from scratch using recursive splitting, then builds a random forest on top).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (this lesson builds decision trees from scratch using recursive splitting, then builds a random forest on top).
- You will implement the math behind split criteria (Gini impurity, entropy, information gain) and understand why an ensemble of weak learners becomes a strong one.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (you will implement the math behind split criteria (gini impurity, entropy, information gain) and understand why an ensemble of...).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (you will implement the math behind split criteria (gini impurity, entropy, information gain) and understand why an en...).

---
## Reference Absorption: Exercises
- Train a single decision tree on a 2D dataset with 3 classes.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (train a single decision tree on a 2d dataset with 3 classes).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (train a single decision tree on a 2d dataset with 3 classes).
- Manually trace the splits and draw the rectangular decision boundaries.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (manually trace the splits and draw the rectangular decision boundaries).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (manually trace the splits and draw the rectangular decision boundaries).
- Compare the boundaries at max_depth=2 vs max_depth=10.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (compare the boundaries at max_depth=2 vs max_depth=10).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (compare the boundaries at max_depth=2 vs max_depth=10).
- Implement variance reduction splitting for regression trees.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (implement variance reduction splitting for regression trees).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (implement variance reduction splitting for regression trees).

---
## Reference Absorption: Exercises (cont.)
- Generate y = sin(x) + noise for 200 points and fit your regression tree.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (generate y = sin(x) + noise for 200 points and fit your regression tree).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (generate y = sin(x) + noise for 200 points and fit your regression tree).
- Plot the tree's piecewise-constant predictions against the true curve.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (plot the tree's piecewise-constant predictions against the true curve).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (plot the tree's piecewise-constant predictions against the true curve).
- Build a random forest with 1, 5, 10, 50, and 200 trees.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (build a random forest with 1, 5, 10, 50, and 200 trees).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (build a random forest with 1, 5, 10, 50, and 200 trees).
- Plot training accuracy and test accuracy vs number of trees.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (plot training accuracy and test accuracy vs number of trees).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (plot training accuracy and test accuracy vs number of trees).

---
## Reference Absorption: Exercises Deep Continuation
- Observe that test accuracy plateaus but does not decrease (forests resist overfitting).
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (observe that test accuracy plateaus but does not decrease (forests resist overfitting)).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (observe that test accuracy plateaus but does not decrease (forests resist overfitting)).
- Compare Gini impurity vs entropy as split criteria on 5 different datasets.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (compare gini impurity vs entropy as split criteria on 5 different datasets).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (compare gini impurity vs entropy as split criteria on 5 different datasets).
- Measure accuracy and tree depth.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (measure accuracy and tree depth).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (measure accuracy and tree depth).
- In most cases, they produce nearly identical results.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (in most cases, they produce nearly identical results).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (in most cases, they produce nearly identical results).

---
## Reference Absorption: Exercises Deep Continuation
- Implement permutation importance.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (implement permutation importance).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (implement permutation importance).
- Compare it with MDI importance on a dataset where one feature is random noise but has high cardinality.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (compare it with mdi importance on a dataset where one feature is random noise but has high cardinality).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (compare it with mdi importance on a dataset where one feature is random noise but has high cardinality).
- MDI will rank the noise feature highly.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (mdi will rank the noise feature highly).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (mdi will rank the noise feature highly).
- Permutation importance will not.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (permutation importance will not).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (permutation importance will not).

---
## Reference Absorption: Key Terms
- 0 = pure, 0.5 = maximum impurity for binary |
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (0 = pure, 0.5 = maximum impurity for binary |).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (0 = pure, 0.5 = maximum impurity for binary |).
- 0 = pure, 1.0 = maximum uncertainty for binary.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (0 = pure, 1.0 = maximum uncertainty for binary).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (0 = pure, 1.0 = maximum uncertainty for binary).
- The greedy criterion for choosing splits |
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (the greedy criterion for choosing splits |).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (the greedy criterion for choosing splits |).
- Train each model on a different random sample with replacement |
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (train each model on a different random sample with replacement |).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (train each model on a different random sample with replacement |).

---
## Reference Absorption: Key Terms (cont.)
- More reliable than MDI for noisy features |
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (more reliable than mdi for noisy features |).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (more reliable than mdi for noisy features |).
- Picks the split that reduces target variance the most |
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (picks the split that reduces target variance the most |).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (picks the split that reduces target variance the most |).
- Same size, but with duplicates |
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (same size, but with duplicates |).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (same size, but with duplicates |).

---
## Reference Absorption: Step 4: Build the RandomForest class
- Bootstrap sampling, feature randomization, and majority voting.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (bootstrap sampling, feature randomization, and majority voting).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (bootstrap sampling, feature randomization, and majority voting).
- See code/trees.py for the complete implementation with all helper methods.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (see code/trees.py for the complete implementation with all helper methods).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (see code/trees.py for the complete implementation with all helper methods).

---
## Reference Absorption: Split criteria: measuring impurity
- At each node, we have a set of samples.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (at each node, we have a set of samples).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (at each node, we have a set of samples).
- We want to split them so that the resulting child nodes are as "pure" as possible, meaning each child contains mostly one class.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (we want to split them so that the resulting child nodes are as "pure" as possible, meaning each child contains mostly one class).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (we want to split them so that the resulting child nodes are as "pure" as possible, meaning each child contains mostly...).
- Gini impurity measures the probability that a randomly chosen sample would be misclassified if it were labeled according to the class distribution at that node.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (gini impurity measures the probability that a randomly chosen sample would be misclassified if it were labeled according to the...).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (gini impurity measures the probability that a randomly chosen sample would be misclassified if it were labeled accord...).
- For a pure node (all one class), Gini = 0.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (for a pure node (all one class), gini = 0).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (for a pure node (all one class), gini = 0).

---
## Reference Absorption: Split criteria: measuring impurity (cont.)
- For a binary split with 50/50 classes, Gini = 0.5.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (for a binary split with 50/50 classes, gini = 0.5).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (for a binary split with 50/50 classes, gini = 0.5).
- Entropy measures the information content (disorder) in a node.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (entropy measures the information content (disorder) in a node).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (entropy measures the information content (disorder) in a node).
- Covered in Phase 1 Lesson 09.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (covered in phase 1 lesson 09).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (covered in phase 1 lesson 09).
- For a pure node, entropy = 0.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (for a pure node, entropy = 0).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (for a pure node, entropy = 0).

---
## Reference Absorption: Split criteria: measuring impurity Deep Continuation
- For a 50/50 binary split, entropy = 1.0.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (for a 50/50 binary split, entropy = 1.0).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (for a 50/50 binary split, entropy = 1.0).
- Information gain is the reduction in impurity (entropy or Gini) after a split.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (information gain is the reduction in impurity (entropy or gini) after a split).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (information gain is the reduction in impurity (entropy or gini) after a split).
- The greedy algorithm at each node: try every feature and every possible threshold.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (the greedy algorithm at each node: try every feature and every possible threshold).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (the greedy algorithm at each node: try every feature and every possible threshold).
- Pick the (feature, threshold) pair that maximizes information gain.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (pick the (feature, threshold) pair that maximizes information gain).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (pick the (feature, threshold) pair that maximizes information gain).

---
## Reference Absorption: Random forests: the power of ensembles
- A single decision tree is high variance.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (a single decision tree is high variance).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (a single decision tree is high variance).
- Small changes in the data can produce completely different trees.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (small changes in the data can produce completely different trees).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (small changes in the data can produce completely different trees).
- Random forests fix this by averaging many trees.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (random forests fix this by averaging many trees).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (random forests fix this by averaging many trees).
- Two sources of randomness make the trees diverse:
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (two sources of randomness make the trees diverse:).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (two sources of randomness make the trees diverse:).

---
## Reference Absorption: Random forests: the power of ensembles (cont.)
- Bagging (bootstrap aggregating): Each tree is trained on a bootstrap sample, a random sample with replacement from the training data.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (bagging (bootstrap aggregating): each tree is trained on a bootstrap sample, a random sample with replacement from the training...).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (bagging (bootstrap aggregating): each tree is trained on a bootstrap sample, a random sample with replacement from th...).
- About 63% of the original samples appear in each bootstrap (the rest are out-of-bag samples that can be used for validation).
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (about 63% of the original samples appear in each bootstrap (the rest are out-of-bag samples that can be used for validation)).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (about 63% of the original samples appear in each bootstrap (the rest are out-of-bag samples that can be used for vali...).
- Feature randomization: At each split, only a random subset of features is considered.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (feature randomization: at each split, only a random subset of features is considered).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (feature randomization: at each split, only a random subset of features is considered).
- For classification, the default is sqrt(n_features).
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (for classification, the default is sqrt(n_features)).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (for classification, the default is sqrt(n_features)).

---
## Reference Absorption: Random forests: the power of ensembles Deep Continuation
- For regression, n_features/3.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (for regression, n_features/3).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (for regression, n_features/3).
- This prevents all trees from splitting on the same dominant feature.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (this prevents all trees from splitting on the same dominant feature).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (this prevents all trees from splitting on the same dominant feature).
- The key insight: averaging many decorrelated trees reduces variance without increasing bias.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (the key insight: averaging many decorrelated trees reduces variance without increasing bias).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (the key insight: averaging many decorrelated trees reduces variance without increasing bias).
- Each individual tree may be mediocre.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (each individual tree may be mediocre).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (each individual tree may be mediocre).

---
## Reference Absorption: Step 3: Build the DecisionTree class
- Recursive splitting, prediction, and feature importance tracking.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (recursive splitting, prediction, and feature importance tracking).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (recursive splitting, prediction, and feature importance tracking).

---
## Reference Absorption: Stopping conditions
- Without stopping conditions, the tree grows until every leaf is pure (one sample per leaf).
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (without stopping conditions, the tree grows until every leaf is pure (one sample per leaf)).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (without stopping conditions, the tree grows until every leaf is pure (one sample per leaf)).
- This perfectly memorizes the training data and generalizes terribly.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (this perfectly memorizes the training data and generalizes terribly).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (this perfectly memorizes the training data and generalizes terribly).
- Pre-pruning stops the tree before it fully grows:
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (pre-pruning stops the tree before it fully grows:).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (pre-pruning stops the tree before it fully grows:).
- Maximum depth: stop splitting when the tree reaches a set depth
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (maximum depth: stop splitting when the tree reaches a set depth).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (maximum depth: stop splitting when the tree reaches a set depth).

---
## Reference Absorption: Stopping conditions (cont.)
- Minimum samples per leaf: stop if a node has fewer than k samples
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (minimum samples per leaf: stop if a node has fewer than k samples).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (minimum samples per leaf: stop if a node has fewer than k samples).
- Minimum information gain: stop if the best split improves impurity by less than a threshold
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (minimum information gain: stop if the best split improves impurity by less than a threshold).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (minimum information gain: stop if the best split improves impurity by less than a threshold).
- Maximum leaf nodes: limit the total number of leaves
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (maximum leaf nodes: limit the total number of leaves).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (maximum leaf nodes: limit the total number of leaves).
- Post-pruning grows the full tree, then trims it back:
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (post-pruning grows the full tree, then trims it back:).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (post-pruning grows the full tree, then trims it back:).

---
## Reference Absorption: Stopping conditions Deep Continuation
- Cost-complexity pruning (used by scikit-learn): adds a penalty proportional to the number of leaves. Increase the penalty to get smaller trees
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (cost-complexity pruning (used by scikit-learn): adds a penalty proportional to the number of leaves. increase the penalty to ge...).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (cost-complexity pruning (used by scikit-learn): adds a penalty proportional to the number of leaves. increase the pen...).
- Reduced error pruning: remove a subtree if the validation error does not increase
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (reduced error pruning: remove a subtree if the validation error does not increase).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (reduced error pruning: remove a subtree if the validation error does not increase).
- Pre-pruning is simpler and faster.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (pre-pruning is simpler and faster).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (pre-pruning is simpler and faster).
- Post-pruning often produces better trees because it does not prematurely stop splits that might lead to useful further splits.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (post-pruning often produces better trees because it does not prematurely stop splits that might lead to useful further splits).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (post-pruning often produces better trees because it does not prematurely stop splits that might lead to useful furthe...).

---
## Reference Absorption: Use It
- With scikit-learn, training a random forest is three lines:
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (with scikit-learn, training a random forest is three lines:).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (with scikit-learn, training a random forest is three lines:).
- In practice, gradient boosted trees (XGBoost, LightGBM, CatBoost) are often stronger than random forests because they build trees sequentially, with each tree correcting the errors of the previous ones.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (in practice, gradient boosted trees (xgboost, lightgbm, catboost) are often stronger than random forests because they build tre...).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (in practice, gradient boosted trees (xgboost, lightgbm, catboost) are often stronger than random forests because they...).
- But random forests are harder to misconfigure and require almost no hyperparameter tuning.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (but random forests are harder to misconfigure and require almost no hyperparameter tuning).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (but random forests are harder to misconfigure and require almost no hyperparameter tuning).

---
## Reference Absorption: Feature importance
- Random forests naturally provide feature importance scores.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (random forests naturally provide feature importance scores).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (random forests naturally provide feature importance scores).
- Mean Decrease in Impurity (MDI): For each feature, sum the total reduction in impurity across all trees and all nodes where that feature is used.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (mean decrease in impurity (mdi): for each feature, sum the total reduction in impurity across all trees and all nodes where tha...).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (mean decrease in impurity (mdi): for each feature, sum the total reduction in impurity across all trees and all nodes...).
- Features that produce bigger impurity reductions at earlier splits are more important.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (features that produce bigger impurity reductions at earlier splits are more important).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (features that produce bigger impurity reductions at earlier splits are more important).
- This is fast (computed during training) but biased toward high-cardinality features and features with many possible split points.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (this is fast (computed during training) but biased toward high-cardinality features and features with many possible split points).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (this is fast (computed during training) but biased toward high-cardinality features and features with many possible s...).

---
## Reference Absorption: Feature importance (cont.)
- Permutation importance is the alternative: shuffle one feature's values and measure how much the model's accuracy drops.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (permutation importance is the alternative: shuffle one feature's values and measure how much the model's accuracy drops).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (permutation importance is the alternative: shuffle one feature's values and measure how much the model's accuracy drops).

---
## Reference Absorption: What a decision tree does
- A decision tree partitions the feature space into rectangular regions by asking a sequence of yes/no questions.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (a decision tree partitions the feature space into rectangular regions by asking a sequence of yes/no questions).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (a decision tree partitions the feature space into rectangular regions by asking a sequence of yes/no questions).
- Each internal node tests a feature against a threshold.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (each internal node tests a feature against a threshold).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (each internal node tests a feature against a threshold).
- Each leaf node makes a prediction.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (each leaf node makes a prediction).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (each leaf node makes a prediction).
- To classify a new data point, you start at the root and follow the branches until you reach a leaf.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (to classify a new data point, you start at the root and follow the branches until you reach a leaf).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (to classify a new data point, you start at the root and follow the branches until you reach a leaf).

---
## Reference Absorption: What a decision tree does (cont.)
- The tree is built top-down by choosing, at each node, the feature and threshold that best separate the data.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (the tree is built top-down by choosing, at each node, the feature and threshold that best separate the data).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (the tree is built top-down by choosing, at each node, the feature and threshold that best separate the data).
- "Best" is defined by a split criterion.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade ("best" is defined by a split criterion).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept ("best" is defined by a split criterion).

---
## Reference Absorption: When trees beat neural networks
- Trees and forests dominate neural networks on tabular data.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (trees and forests dominate neural networks on tabular data).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (trees and forests dominate neural networks on tabular data).
- Neural networks win when the data has spatial or sequential structure (images, text, audio).
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (neural networks win when the data has spatial or sequential structure (images, text, audio)).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (neural networks win when the data has spatial or sequential structure (images, text, audio)).
- For flat tables of features, trees are the default.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (for flat tables of features, trees are the default).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (for flat tables of features, trees are the default).

---
## Reference Absorption: Further Reading
- [Breiman: Random Forests (2001)](https://link.springer.com/article/10.1023/A:1010933404324) - the original random forest paper
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade ([breiman: random forests (2001)](https://link.springer.com/article/10.1023/a:1010933404324) - the original random forest paper).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept ([breiman: random forests (2001)](https://link.springer.com/article/10.1023/a:1010933404324) - the original random for...).
- [Grinsztajn et al.: Why do tree-based models still outperform deep learning on tabular data? (2022)](https://arxiv.org/abs/2207.08815) - rigorous comparison of trees vs neural networks on tabular tasks
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade ([grinsztajn et al.: why do tree-based models still outperform deep learning on tabular data? (2022)](https://arxiv.org/abs/2207...).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept ([grinsztajn et al.: why do tree-based models still outperform deep learning on tabular data? (2022)](https://arxiv.or...).
- [scikit-learn Decision Trees documentation](https://scikit-learn.org/stable/modules/tree.html) - practical guide with visualization tools
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade ([scikit-learn decision trees documentation](https://scikit-learn.org/stable/modules/tree.html) - practical guide with visualiza...).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept ([scikit-learn decision trees documentation](https://scikit-learn.org/stable/modules/tree.html) - practical guide with...).
- [XGBoost: A Scalable Tree Boosting System (Chen & Guestrin, 2016)](https://arxiv.org/abs/1603.02754) - the gradient boosting paper that dominates Kaggle
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade ([xgboost: a scalable tree boosting system (chen & guestrin, 2016)](https://arxiv.org/abs/1603.02754) - the gradient boosting pa...).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept ([xgboost: a scalable tree boosting system (chen & guestrin, 2016)](https://arxiv.org/abs/1603.02754) - the gradient b...).

---
## Reference Absorption: Step 1: Gini impurity and entropy
- Build both split criteria from scratch and verify they agree on which splits are good.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (build both split criteria from scratch and verify they agree on which splits are good).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (build both split criteria from scratch and verify they agree on which splits are good).

---
## Reference Absorption: Step 2: Find the best split
- Try every feature and every threshold.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (try every feature and every threshold).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (try every feature and every threshold).
- Return the one with the highest information gain.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (return the one with the highest information gain).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (return the one with the highest information gain).

---
## Reference Absorption: How splitting works
- For a dataset with n features and m samples at the current node:
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (for a dataset with n features and m samples at the current node:).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (for a dataset with n features and m samples at the current node:).
- For each feature j (j = 1 to n):
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (for each feature j (j = 1 to n):).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (for each feature j (j = 1 to n):).
- Sort the samples by feature j
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (sort the samples by feature j).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (sort the samples by feature j).
- Try every midpoint between consecutive distinct values as a threshold
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (try every midpoint between consecutive distinct values as a threshold).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (try every midpoint between consecutive distinct values as a threshold).

---
## Reference Absorption: How splitting works (cont.)
- Compute the information gain for each threshold
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (compute the information gain for each threshold).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (compute the information gain for each threshold).
- Select the feature and threshold with the highest information gain
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (select the feature and threshold with the highest information gain).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (select the feature and threshold with the highest information gain).
- Split the data into left (feature <= threshold) and right (feature > threshold)
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (split the data into left (feature <= threshold) and right (feature > threshold)).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (split the data into left (feature <= threshold) and right (feature > threshold)).
- This greedy approach does not guarantee the globally optimal tree.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (this greedy approach does not guarantee the globally optimal tree).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (this greedy approach does not guarantee the globally optimal tree).

---
## Reference Absorption: How splitting works Deep Continuation
- Finding the optimal tree is NP-hard.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (finding the optimal tree is np-hard).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (finding the optimal tree is np-hard).
- But greedy splitting works well in practice.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (but greedy splitting works well in practice).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (but greedy splitting works well in practice).

---
## Beyond Reference: Engineering Translation
- Core anchors for this module: tree, feature, trees, self, random, split, impurity, samples.
- Convert each theoretical primitive into measurable training and inference behaviors.
- Define observability checkpoints for drift, calibration, and latency regressions.
- Tie assumptions to explicit data contracts and fallback policies.

---
## Beyond Reference: Advanced Layer 1
- Contrast impurity criteria under class imbalance and noisy labels.
- Risk and governance extension: convert this into acceptance tests and rollback criteria (contrast impurity criteria under class imbalance and noisy labels.).
- Measure permutation importance stability across folds to avoid spurious feature narratives.
- Risk and governance extension: convert this into acceptance tests and rollback criteria (measure permutation importance stability across folds to avoid spurious feature narratives.).
- Use out-of-bag estimates for faster model selection before full CV.
- Risk and governance extension: convert this into acceptance tests and rollback criteria (use out-of-bag estimates for faster model selection before full cv.).

<!-- DEPTH_EXPANSION_END -->
