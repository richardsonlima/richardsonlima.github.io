---
layout: slides
title: "Ensemble Methods: Boosting, Bagging, Stacking"
category: "ai-engineering-course-step-02"
module_number: 11
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
## Module 11: Ensemble Methods: Boosting, Bagging, Stacking
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
- A single decision tree is fast to train and easy to interpret, but it overfits.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (a single decision tree is fast to train and easy to interpret, but it overfits).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (a single decision tree is fast to train and easy to interpret, but it overfits).
- A single linear model underfits on complex boundaries.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (a single linear model underfits on complex boundaries).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (a single linear model underfits on complex boundaries).
- You could spend days engineering the perfect model architecture.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (you could spend days engineering the perfect model architecture).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (you could spend days engineering the perfect model architecture).
- Or you could combine a bunch of imperfect models and get something better than any of them individually.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (or you could combine a bunch of imperfect models and get something better than any of them individually).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (or you could combine a bunch of imperfect models and get something better than any of them individually).

---
## Reference Absorption: The Problem (cont.)
- Ensemble methods do exactly this.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (ensemble methods do exactly this).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (ensemble methods do exactly this).
- They are the most reliable technique for winning Kaggle competitions on tabular data, they power most production ML systems, and they illustrate the bias-variance tradeoff in action.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (they are the most reliable technique for winning kaggle competitions on tabular data, they power most production ml systems, an...).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (they are the most reliable technique for winning kaggle competitions on tabular data, they power most production ml s...).
- Stacking learns which models to trust on which inputs.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (stacking learns which models to trust on which inputs).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (stacking learns which models to trust on which inputs).

---
## Reference Absorption: The Production Stack for Tabular Data
- For most tabular prediction problems, this is the order to try:
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (for most tabular prediction problems, this is the order to try:).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (for most tabular prediction problems, this is the order to try:).
- LightGBM or XGBoost with default parameters
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (lightgbm or xgboost with default parameters).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (lightgbm or xgboost with default parameters).
- Tune n_estimators, learning_rate, max_depth, min_child_weight
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (tune n_estimators, learning_rate, max_depth, min_child_weight).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (tune n_estimators, learning_rate, max_depth, min_child_weight).
- If you need the last 0.5%, build a stacking ensemble with 3-5 diverse models
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (if you need the last 0.5%, build a stacking ensemble with 3-5 diverse models).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (if you need the last 0.5%, build a stacking ensemble with 3-5 diverse models).

---
## Reference Absorption: The Production Stack for Tabular Data (cont.)
- Use cross-validation throughout
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (use cross-validation throughout).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (use cross-validation throughout).
- Neural networks on tabular data are almost always worse than gradient boosting, despite continued research attempts.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (neural networks on tabular data are almost always worse than gradient boosting, despite continued research attempts).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (neural networks on tabular data are almost always worse than gradient boosting, despite continued research attempts).
- TabNet, NODE, and similar architectures occasionally match but rarely beat a well-tuned XGBoost.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (tabnet, node, and similar architectures occasionally match but rarely beat a well-tuned xgboost).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (tabnet, node, and similar architectures occasionally match but rarely beat a well-tuned xgboost).

---
## Reference Absorption: Exercises
- Modify the AdaBoost implementation to track training accuracy after each round.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (modify the adaboost implementation to track training accuracy after each round).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (modify the adaboost implementation to track training accuracy after each round).
- Implement a random forest from scratch by adding random feature subsampling to the regression tree.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (implement a random forest from scratch by adding random feature subsampling to the regression tree).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (implement a random forest from scratch by adding random feature subsampling to the regression tree).
- Train 100 trees with max_features=sqrt(n_features) and average predictions.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (train 100 trees with max_features=sqrt(n_features) and average predictions).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (train 100 trees with max_features=sqrt(n_features) and average predictions).
- Compare variance reduction to a single tree.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (compare variance reduction to a single tree).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (compare variance reduction to a single tree).

---
## Reference Absorption: Exercises (cont.)
- In the gradient boosting implementation, add early stopping: track validation loss after each round and stop when it has not improved for 10 consecutive rounds.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (in the gradient boosting implementation, add early stopping: track validation loss after each round and stop when it has not im...).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (in the gradient boosting implementation, add early stopping: track validation loss after each round and stop when it...).
- How many trees does it actually need?
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (how many trees does it actually need?).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (how many trees does it actually need?).
- Build a stacking ensemble with three base models (logistic regression, decision tree, k-nearest neighbors) and a logistic regression meta-learner.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (build a stacking ensemble with three base models (logistic regression, decision tree, k-nearest neighbors) and a logistic regre...).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (build a stacking ensemble with three base models (logistic regression, decision tree, k-nearest neighbors) and a logi...).
- Use 5-fold cross-validation to generate meta-features.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (use 5-fold cross-validation to generate meta-features).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (use 5-fold cross-validation to generate meta-features).

---
## Reference Absorption: Exercises Deep Continuation
- Compare to each base model alone.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (compare to each base model alone).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (compare to each base model alone).
- Run XGBoost on the same dataset with default parameters.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (run xgboost on the same dataset with default parameters).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (run xgboost on the same dataset with default parameters).
- Compare its accuracy to your from-scratch gradient boosting.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (compare its accuracy to your from-scratch gradient boosting).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (compare its accuracy to your from-scratch gradient boosting).
- How large is the speed difference?
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (how large is the speed difference?).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (how large is the speed difference?).

---
## Reference Absorption: Bagging (Bootstrap Aggregating)
- Bagging creates diversity by training each model on a different bootstrap sample of the training data.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (bagging creates diversity by training each model on a different bootstrap sample of the training data).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (bagging creates diversity by training each model on a different bootstrap sample of the training data).
- A bootstrap sample is drawn with replacement from the original data, same size as the original.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (a bootstrap sample is drawn with replacement from the original data, same size as the original).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (a bootstrap sample is drawn with replacement from the original data, same size as the original).
- About 63.2% of unique samples appear in each bootstrap.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (about 63.2% of unique samples appear in each bootstrap).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (about 63.2% of unique samples appear in each bootstrap).
- The remaining 36.8% (out-of-bag samples) provide a free validation set.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (the remaining 36.8% (out-of-bag samples) provide a free validation set).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (the remaining 36.8% (out-of-bag samples) provide a free validation set).

---
## Reference Absorption: Bagging (Bootstrap Aggregating) (cont.)
- Bagging reduces variance without increasing bias much.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (bagging reduces variance without increasing bias much).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (bagging reduces variance without increasing bias much).
- Each individual tree overfits to its bootstrap sample, but the overfitting is different for each tree, so averaging cancels out the noise.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (each individual tree overfits to its bootstrap sample, but the overfitting is different for each tree, so averaging cancels out...).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (each individual tree overfits to its bootstrap sample, but the overfitting is different for each tree, so averaging c...).
- Random Forests are bagging with an extra twist: at each split, only a random subset of features is considered.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (random forests are bagging with an extra twist: at each split, only a random subset of features is considered).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (random forests are bagging with an extra twist: at each split, only a random subset of features is considered).
- This forces even more diversity among trees.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (this forces even more diversity among trees).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (this forces even more diversity among trees).

---
## Reference Absorption: Bagging (Bootstrap Aggregating) Deep Continuation
- The typical number of candidate features is sqrt(n_features) for classification and n_features / 3 for regression.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (the typical number of candidate features is sqrt(n_features) for classification and n_features / 3 for regression).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (the typical number of candidate features is sqrt(n_features) for classification and n_features / 3 for regression).

---
## Reference Absorption: Step 1: Decision Stump (Base Learner)
- The code in code/ensembles.py implements everything from scratch.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (the code in code/ensembles.py implements everything from scratch).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (the code in code/ensembles.py implements everything from scratch).
- We start with a decision stump: a tree with a single split.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (we start with a decision stump: a tree with a single split).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (we start with a decision stump: a tree with a single split).

---
## Reference Absorption: XGBoost: Why It Dominates Tabular Data
- XGBoost (eXtreme Gradient Boosting) is gradient boosting with engineering optimizations that make it fast, accurate, and resistant to overfitting:
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (xgboost (extreme gradient boosting) is gradient boosting with engineering optimizations that make it fast, accurate, and resist...).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (xgboost (extreme gradient boosting) is gradient boosting with engineering optimizations that make it fast, accurate,...).
- Regularized objective: L1 and L2 penalties on leaf weights prevent individual trees from being too confident
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (regularized objective: l1 and l2 penalties on leaf weights prevent individual trees from being too confident).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (regularized objective: l1 and l2 penalties on leaf weights prevent individual trees from being too confident).
- Second-order approximation: Uses both first and second derivatives of the loss, giving better split decisions
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (second-order approximation: uses both first and second derivatives of the loss, giving better split decisions).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (second-order approximation: uses both first and second derivatives of the loss, giving better split decisions).
- Sparsity-aware splits: Handles missing values natively by learning the best direction for missing data at each split
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (sparsity-aware splits: handles missing values natively by learning the best direction for missing data at each split).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (sparsity-aware splits: handles missing values natively by learning the best direction for missing data at each split).

---
## Reference Absorption: XGBoost: Why It Dominates Tabular Data (cont.)
- Column subsampling: Like random forests, samples features at each split for diversity
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (column subsampling: like random forests, samples features at each split for diversity).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (column subsampling: like random forests, samples features at each split for diversity).
- Weighted quantile sketch: Efficiently finds split points for continuous features on distributed data
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (weighted quantile sketch: efficiently finds split points for continuous features on distributed data).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (weighted quantile sketch: efficiently finds split points for continuous features on distributed data).
- Cache-aware block structure: Memory layout optimized for CPU cache lines
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (cache-aware block structure: memory layout optimized for cpu cache lines).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (cache-aware block structure: memory layout optimized for cpu cache lines).
- For tabular data, XGBoost (and its successor LightGBM) consistently outperforms neural networks.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (for tabular data, xgboost (and its successor lightgbm) consistently outperforms neural networks).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (for tabular data, xgboost (and its successor lightgbm) consistently outperforms neural networks).

---
## Reference Absorption: XGBoost: Why It Dominates Tabular Data Deep Continuation
- This is not changing anytime soon.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (this is not changing anytime soon).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (this is not changing anytime soon).
- If your data fits in a table with rows and columns, start with gradient boosting.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (if your data fits in a table with rows and columns, start with gradient boosting).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (if your data fits in a table with rows and columns, start with gradient boosting).

---
## Reference Absorption: Gradient Boosting
- Gradient boosting generalizes boosting to arbitrary loss functions.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (gradient boosting generalizes boosting to arbitrary loss functions).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (gradient boosting generalizes boosting to arbitrary loss functions).
- Instead of reweighting samples, it fits each new model to the residuals (negative gradient of the loss) of the current ensemble.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (instead of reweighting samples, it fits each new model to the residuals (negative gradient of the loss) of the current ensemble).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (instead of reweighting samples, it fits each new model to the residuals (negative gradient of the loss) of the curren...).
- For squared error loss, the pseudo-residuals are just the actual residuals: r_i = y_i - F_{t-1}(x_i).
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (for squared error loss, the pseudo-residuals are just the actual residuals: r_i = y_i - f_{t-1}(x_i)).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (for squared error loss, the pseudo-residuals are just the actual residuals: r_i = y_i - f_{t-1}(x_i)).
- Each tree literally fits the errors of the previous ensemble.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (each tree literally fits the errors of the previous ensemble).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (each tree literally fits the errors of the previous ensemble).

---
## Reference Absorption: Gradient Boosting (cont.)
- The learning rate (shrinkage) controls how much each tree contributes.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (the learning rate (shrinkage) controls how much each tree contributes).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (the learning rate (shrinkage) controls how much each tree contributes).
- Smaller learning rates require more trees but generalize better.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (smaller learning rates require more trees but generalize better).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (smaller learning rates require more trees but generalize better).
- Typical values: 0.01 to 0.3.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (typical values: 0.01 to 0.3).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (typical values: 0.01 to 0.3).

---
## Reference Absorption: Stacking (Meta-Learning)
- Stacking uses the predictions of multiple base models as features for a meta-learner.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (stacking uses the predictions of multiple base models as features for a meta-learner).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (stacking uses the predictions of multiple base models as features for a meta-learner).
- The meta-learner learns which base model to trust for which inputs.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (the meta-learner learns which base model to trust for which inputs).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (the meta-learner learns which base model to trust for which inputs).
- If the random forest is better at certain regions and the SVM at others, the meta-learner will learn to route accordingly.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (if the random forest is better at certain regions and the svm at others, the meta-learner will learn to route accordingly).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (if the random forest is better at certain regions and the svm at others, the meta-learner will learn to route accordi...).
- To avoid data leakage, base model predictions must be generated via cross-validation on the training set.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (to avoid data leakage, base model predictions must be generated via cross-validation on the training set).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (to avoid data leakage, base model predictions must be generated via cross-validation on the training set).

---
## Reference Absorption: Stacking (Meta-Learning) (cont.)
- You never train base models and generate meta-features on the same data.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (you never train base models and generate meta-features on the same data).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (you never train base models and generate meta-features on the same data).

---
## Reference Absorption: AdaBoost
- AdaBoost (Adaptive Boosting) was the first practical boosting algorithm.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (adaboost (adaptive boosting) was the first practical boosting algorithm).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (adaboost (adaptive boosting) was the first practical boosting algorithm).
- It works with any base learner, typically decision stumps (depth-1 trees).
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (it works with any base learner, typically decision stumps (depth-1 trees)).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (it works with any base learner, typically decision stumps (depth-1 trees)).
- Models with lower error get higher alpha.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (models with lower error get higher alpha).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (models with lower error get higher alpha).
- Misclassified samples get higher weights so the next model focuses on them.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (misclassified samples get higher weights so the next model focuses on them).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (misclassified samples get higher weights so the next model focuses on them).

---
## Reference Absorption: Boosting (Sequential Error Correction)
- Boosting trains models sequentially.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (boosting trains models sequentially).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (boosting trains models sequentially).
- Each new model focuses on the examples that previous models got wrong.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (each new model focuses on the examples that previous models got wrong).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (each new model focuses on the examples that previous models got wrong).
- Each new model corrects the systematic errors of the ensemble so far.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (each new model corrects the systematic errors of the ensemble so far).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (each new model corrects the systematic errors of the ensemble so far).
- The final prediction is a weighted sum of all models, where better models get higher weights.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (the final prediction is a weighted sum of all models, where better models get higher weights).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (the final prediction is a weighted sum of all models, where better models get higher weights).

---
## Reference Absorption: Boosting (Sequential Error Correction) (cont.)
- The tradeoff: boosting can overfit if you run too many rounds, because it keeps fitting harder examples, some of which may be noise.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (the tradeoff: boosting can overfit if you run too many rounds, because it keeps fitting harder examples, some of which may be n...).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (the tradeoff: boosting can overfit if you run too many rounds, because it keeps fitting harder examples, some of whic...).

---
## Reference Absorption: Why Ensembles Work
- Suppose you have N independent classifiers, each with accuracy p > 0.5.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (suppose you have n independent classifiers, each with accuracy p > 0.5).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (suppose you have n independent classifiers, each with accuracy p > 0.5).
- The majority vote has accuracy:
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (the majority vote has accuracy:).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (the majority vote has accuracy:).
- For 21 classifiers each with 60% accuracy, majority vote accuracy is about 74%.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (for 21 classifiers each with 60% accuracy, majority vote accuracy is about 74%).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (for 21 classifiers each with 60% accuracy, majority vote accuracy is about 74%).
- With 101 classifiers, it rises to 84%.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (with 101 classifiers, it rises to 84%).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (with 101 classifiers, it rises to 84%).

---
## Reference Absorption: Why Ensembles Work (cont.)
- The errors cancel out when the models make different mistakes.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (the errors cancel out when the models make different mistakes).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (the errors cancel out when the models make different mistakes).
- The key requirement is diversity.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (the key requirement is diversity).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (the key requirement is diversity).
- If all models make the same errors, combining them helps nothing.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (if all models make the same errors, combining them helps nothing).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (if all models make the same errors, combining them helps nothing).
- Ensembles work because they produce diverse models through:
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (ensembles work because they produce diverse models through:).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (ensembles work because they produce diverse models through:).

---
## Reference Absorption: Why Ensembles Work Deep Continuation
- Different training subsets (bagging)
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (different training subsets (bagging)).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (different training subsets (bagging)).
- Different feature subsets (random forests)
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (different feature subsets (random forests)).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (different feature subsets (random forests)).
- Sequential error correction (boosting)
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (sequential error correction (boosting)).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (sequential error correction (boosting)).
- Different model families (stacking)
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (different model families (stacking)).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (different model families (stacking)).

---
## Reference Absorption: Further Reading
- [Schapire & Freund: Boosting: Foundations and Algorithms](https://mitpress.mit.edu/9780262526036/) -- the book by AdaBoost's creators
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade ([schapire & freund: boosting: foundations and algorithms](https://mitpress.mit.edu/9780262526036/) -- the book by adaboost's cr...).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept ([schapire & freund: boosting: foundations and algorithms](https://mitpress.mit.edu/9780262526036/) -- the book by ada...).
- [Friedman: Greedy Function Approximation: A Gradient Boosting Machine (2001)](https://statweb.stanford.edu/~jhf/ftp/trebst.pdf) -- the original gradient boosting paper
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade ([friedman: greedy function approximation: a gradient boosting machine (2001)](https://statweb.stanford.edu/~jhf/ftp/trebst.pdf)...).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept ([friedman: greedy function approximation: a gradient boosting machine (2001)](https://statweb.stanford.edu/~jhf/ftp/t...).
- [Chen & Guestrin: XGBoost (2016)](https://arxiv.org/abs/1603.02754) -- the XGBoost paper
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade ([chen & guestrin: xgboost (2016)](https://arxiv.org/abs/1603.02754) -- the xgboost paper).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept ([chen & guestrin: xgboost (2016)](https://arxiv.org/abs/1603.02754) -- the xgboost paper).
- [Wolpert: Stacked Generalization (1992)](https://www.sciencedirect.com/science/article/abs/pii/S0893608005800231) -- the original stacking paper
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade ([wolpert: stacked generalization (1992)](https://www.sciencedirect.com/science/article/abs/pii/s0893608005800231) -- the origin...).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept ([wolpert: stacked generalization (1992)](https://www.sciencedirect.com/science/article/abs/pii/s0893608005800231) --...).

---
## Reference Absorption: Further Reading (cont.)
- [scikit-learn Ensemble Methods](https://scikit-learn.org/stable/modules/ensemble.html) -- practical reference
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade ([scikit-learn ensemble methods](https://scikit-learn.org/stable/modules/ensemble.html) -- practical reference).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept ([scikit-learn ensemble methods](https://scikit-learn.org/stable/modules/ensemble.html) -- practical reference).

---
## Reference Absorption: Ship It
- This lesson produces outputs/prompt-ensemble-selector.md -- a prompt that helps you pick the right ensemble method for a given dataset.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (this lesson produces outputs/prompt-ensemble-selector.md -- a prompt that helps you pick the right ensemble method for a given...).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (this lesson produces outputs/prompt-ensemble-selector.md -- a prompt that helps you pick the right ensemble method fo...).
- Describe your data (size, feature types, noise level, class balance) and the problem you are solving.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (describe your data (size, feature types, noise level, class balance) and the problem you are solving).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (describe your data (size, feature types, noise level, class balance) and the problem you are solving).
- The prompt walks through a decision checklist, recommends a method, suggests starting hyperparameters, and warns about common mistakes for that method.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (the prompt walks through a decision checklist, recommends a method, suggests starting hyperparameters, and warns about common m...).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (the prompt walks through a decision checklist, recommends a method, suggests starting hyperparameters, and warns abou...).
- Also produces outputs/skill-ensemble-builder.md with the full selection guide.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (also produces outputs/skill-ensemble-builder.md with the full selection guide).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (also produces outputs/skill-ensemble-builder.md with the full selection guide).

---
## Reference Absorption: Learning Objectives
- Implement AdaBoost and gradient boosting from scratch and explain how boosting sequentially reduces bias
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (implement adaboost and gradient boosting from scratch and explain how boosting sequentially reduces bias).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (implement adaboost and gradient boosting from scratch and explain how boosting sequentially reduces bias).
- Build a bagging ensemble and demonstrate how averaging decorrelated models reduces variance without increasing bias
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (build a bagging ensemble and demonstrate how averaging decorrelated models reduces variance without increasing bias).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (build a bagging ensemble and demonstrate how averaging decorrelated models reduces variance without increasing bias).
- Compare bagging, boosting, and stacking in terms of what error component each method targets
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (compare bagging, boosting, and stacking in terms of what error component each method targets).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (compare bagging, boosting, and stacking in terms of what error component each method targets).
- Evaluate ensemble diversity and explain why majority voting accuracy improves with more independent weak learners
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (evaluate ensemble diversity and explain why majority voting accuracy improves with more independent weak learners).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (evaluate ensemble diversity and explain why majority voting accuracy improves with more independent weak learners).

---
## Beyond Reference: Engineering Translation
- Core anchors for this module: self, boosting, models, model, data, pred, ensemble, gradient.
- Convert each theoretical primitive into measurable training and inference behaviors.
- Define observability checkpoints for drift, calibration, and latency regressions.
- Tie assumptions to explicit data contracts and fallback policies.

---
## Beyond Reference: Advanced Layer 1
- Measure ensemble diversity explicitly (error correlation, Q-statistics) before adding models.
- Risk and governance extension: convert this into acceptance tests and rollback criteria (measure ensemble diversity explicitly (error correlation, q-statistics) before adding models.).
- Compare bagging versus boosting under label noise and class imbalance.
- Risk and governance extension: convert this into acceptance tests and rollback criteria (compare bagging versus boosting under label noise and class imbalance.).
- Use stacking without leakage via cross-validated out-of-fold meta-features.
- Risk and governance extension: convert this into acceptance tests and rollback criteria (use stacking without leakage via cross-validated out-of-fold meta-features.).

<!-- DEPTH_EXPANSION_END -->
