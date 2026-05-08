---
layout: slides
title: "Feature Selection"
category: "ai-engineering-course-step-02"
module_number: 18
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
## Module 18: Feature Selection
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
- Your model trains slowly, overfits constantly, and nobody can explain what it learned.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (your model trains slowly, overfits constantly, and nobody can explain what it learned).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (your model trains slowly, overfits constantly, and nobody can explain what it learned).
- You add more features hoping to improve performance.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (you add more features hoping to improve performance).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (you add more features hoping to improve performance).
- This is the curse of dimensionality in action.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (this is the curse of dimensionality in action).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (this is the curse of dimensionality in action).
- As the number of features grows, the volume of the feature space explodes.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (as the number of features grows, the volume of the feature space explodes).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (as the number of features grows, the volume of the feature space explodes).

---
## Reference Absorption: The Problem (cont.)
- Distances between points converge.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (distances between points converge).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (distances between points converge).
- The model needs exponentially more data to find real patterns.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (the model needs exponentially more data to find real patterns).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (the model needs exponentially more data to find real patterns).
- Noise features drown out signal features.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (noise features drown out signal features).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (noise features drown out signal features).
- Overfitting becomes the default.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (overfitting becomes the default).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (overfitting becomes the default).

---
## Reference Absorption: The Problem Deep Continuation
- Feature selection is the antidote.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (feature selection is the antidote).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (feature selection is the antidote).
- Keep the features that carry actual information about the target.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (keep the features that carry actual information about the target).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (keep the features that carry actual information about the target).
- The result: faster training, better generalization, and models you can actually explain.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (the result: faster training, better generalization, and models you can actually explain).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (the result: faster training, better generalization, and models you can actually explain).
- The goal is not to use all available information.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (the goal is not to use all available information).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (the goal is not to use all available information).

---
## Reference Absorption: The Problem Deep Continuation
- It is to use the right information.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (it is to use the right information).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (it is to use the right information).

---
## Reference Absorption: Exercises
- Forward selection: implement the opposite of RFE.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (forward selection: implement the opposite of rfe).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (forward selection: implement the opposite of rfe).
- At each step, add the feature that improves model performance the most.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (at each step, add the feature that improves model performance the most).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (at each step, add the feature that improves model performance the most).
- Stop when adding features no longer helps.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (stop when adding features no longer helps).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (stop when adding features no longer helps).
- Compare the selected features against RFE results.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (compare the selected features against rfe results).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (compare the selected features against rfe results).

---
## Reference Absorption: Exercises (cont.)
- Stability selection: run L1 feature selection 50 times, each time on a random 80% subsample of the data, with slightly different alpha values.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (stability selection: run l1 feature selection 50 times, each time on a random 80% subsample of the data, with slightly differen...).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (stability selection: run l1 feature selection 50 times, each time on a random 80% subsample of the data, with slightl...).
- Count how often each feature is selected.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (count how often each feature is selected).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (count how often each feature is selected).
- Features selected in > 80% of runs are "stable." Compare stable features against single-run L1 selection.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (features selected in > 80% of runs are "stable." compare stable features against single-run l1 selection).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (features selected in > 80% of runs are "stable." compare stable features against single-run l1 selection).
- Multicollinearity detection: compute the correlation matrix for all features.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (multicollinearity detection: compute the correlation matrix for all features).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (multicollinearity detection: compute the correlation matrix for all features).

---
## Reference Absorption: Exercises Deep Continuation
- Implement a function that, given a correlation threshold (e.g., 0.9), removes one feature from each highly-correlated pair (keeping the one with higher mutual information with the target).
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (implement a function that, given a correlation threshold (e.g., 0.9), removes one feature from each highly-correlated pair (kee...).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (implement a function that, given a correlation threshold (e.g., 0.9), removes one feature from each highly-correlated...).
- Test on the synthetic dataset and verify it removes the redundant correlated features.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (test on the synthetic dataset and verify it removes the redundant correlated features).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (test on the synthetic dataset and verify it removes the redundant correlated features).
- Feature selection pipeline: chain variance threshold, mutual information filter, and RFE into a single pipeline.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (feature selection pipeline: chain variance threshold, mutual information filter, and rfe into a single pipeline).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (feature selection pipeline: chain variance threshold, mutual information filter, and rfe into a single pipeline).
- First remove near-zero-variance features, then keep the top 50% by mutual information, then run RFE on the survivors.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (first remove near-zero-variance features, then keep the top 50% by mutual information, then run rfe on the survivors).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (first remove near-zero-variance features, then keep the top 50% by mutual information, then run rfe on the survivors).

---
## Reference Absorption: Exercises Deep Continuation
- Compare this pipeline against running RFE alone on all features.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (compare this pipeline against running rfe alone on all features).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (compare this pipeline against running rfe alone on all features).
- Permutation importance from scratch: implement permutation importance.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (permutation importance from scratch: implement permutation importance).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (permutation importance from scratch: implement permutation importance).
- For each feature, shuffle its values 10 times, measure the average drop in F1 score.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (for each feature, shuffle its values 10 times, measure the average drop in f1 score).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (for each feature, shuffle its values 10 times, measure the average drop in f1 score).
- Compare the ranking against tree-based importance.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (compare the ranking against tree-based importance).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (compare the ranking against tree-based importance).

---
## Reference Absorption: Exercises Deep Continuation
- Find cases where they disagree and explain why (hint: correlated features).
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (find cases where they disagree and explain why (hint: correlated features)).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (find cases where they disagree and explain why (hint: correlated features)).

---
## Reference Absorption: Use It
- With scikit-learn, feature selection is built into the pipeline:
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (with scikit-learn, feature selection is built into the pipeline:).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (with scikit-learn, feature selection is built into the pipeline:).
- The from-scratch implementations show exactly what happens inside each method.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (the from-scratch implementations show exactly what happens inside each method).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (the from-scratch implementations show exactly what happens inside each method).
- Variance threshold is just computing var(X, axis=0) and applying a mask.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (variance threshold is just computing var(x, axis=0) and applying a mask).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (variance threshold is just computing var(x, axis=0) and applying a mask).
- Mutual information is counting joint and marginal frequencies in a contingency table.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (mutual information is counting joint and marginal frequencies in a contingency table).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (mutual information is counting joint and marginal frequencies in a contingency table).

---
## Reference Absorption: Use It (cont.)
- RFE is a loop that trains, ranks, and prunes.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (rfe is a loop that trains, ranks, and prunes).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (rfe is a loop that trains, ranks, and prunes).
- L1 is gradient descent with a soft-thresholding step.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (l1 is gradient descent with a soft-thresholding step).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (l1 is gradient descent with a soft-thresholding step).
- Tree importance accumulates impurity reductions across splits.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (tree importance accumulates impurity reductions across splits).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (tree importance accumulates impurity reductions across splits).
- No magic -- just statistics and loops.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (no magic -- just statistics and loops).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (no magic -- just statistics and loops).

---
## Reference Absorption: Use It Deep Continuation
- The sklearn versions add robustness (e.g., mutual_info_classif uses k-NN density estimation instead of binning), speed (C implementations), and pipeline integration.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (the sklearn versions add robustness (e.g., mutual_info_classif uses k-nn density estimation instead of binning), speed (c imple...).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (the sklearn versions add robustness (e.g., mutual_info_classif uses k-nn density estimation instead of binning), spee...).

---
## Reference Absorption: Step 1: Generate synthetic data with known feature structure
- We know the ground truth: features 0-4 are informative (plus 3 and 4 are correlated copies of 0 and 1), features 5-9 are correlated with informative features, features 10-19 are pure noise.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (we know the ground truth: features 0-4 are informative (plus 3 and 4 are correlated copies of 0 and 1), features 5-9 are correl...).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (we know the ground truth: features 0-4 are informative (plus 3 and 4 are correlated copies of 0 and 1), features 5-9...).
- A good selection method should rank 0-4 highest and 10-19 lowest.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (a good selection method should rank 0-4 highest and 10-19 lowest).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (a good selection method should rank 0-4 highest and 10-19 lowest).

---
## Reference Absorption: Three Categories of Feature Selection
- Every feature selection method falls into one of three categories:
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (every feature selection method falls into one of three categories:).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (every feature selection method falls into one of three categories:).
- Filter methods score each feature independently using a statistical measure.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (filter methods score each feature independently using a statistical measure).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (filter methods score each feature independently using a statistical measure).
- Fast, but they miss feature interactions.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (fast, but they miss feature interactions).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (fast, but they miss feature interactions).
- Wrapper methods train a model to evaluate feature subsets.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (wrapper methods train a model to evaluate feature subsets).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (wrapper methods train a model to evaluate feature subsets).

---
## Reference Absorption: Three Categories of Feature Selection (cont.)
- They use model performance as the score.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (they use model performance as the score).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (they use model performance as the score).
- Better results, but expensive because they retrain the model many times.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (better results, but expensive because they retrain the model many times).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (better results, but expensive because they retrain the model many times).
- Embedded methods select features as part of model training.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (embedded methods select features as part of model training).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (embedded methods select features as part of model training).
- L1 regularization drives weights to zero.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (l1 regularization drives weights to zero).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (l1 regularization drives weights to zero).

---
## Reference Absorption: Three Categories of Feature Selection Deep Continuation
- Decision trees split on the most useful features.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (decision trees split on the most useful features).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (decision trees split on the most useful features).
- Selection happens during fitting, not as a separate step.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (selection happens during fitting, not as a separate step).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (selection happens during fitting, not as a separate step).

---
## Reference Absorption: Mutual Information
- Mutual information measures how much knowing the value of feature X reduces uncertainty about target Y.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (mutual information measures how much knowing the value of feature x reduces uncertainty about target y).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (mutual information measures how much knowing the value of feature x reduces uncertainty about target y).
- If X and Y are independent, p(x, y) = p(x) * p(y), so the log term is zero and I(X; Y) = 0.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (if x and y are independent, p(x, y) = p(x) * p(y), so the log term is zero and i(x; y) = 0).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (if x and y are independent, p(x, y) = p(x) * p(y), so the log term is zero and i(x; y) = 0).
- The more X tells you about Y, the higher the mutual information.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (the more x tells you about y, the higher the mutual information).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (the more x tells you about y, the higher the mutual information).
- Key advantage over correlation: mutual information captures nonlinear relationships.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (key advantage over correlation: mutual information captures nonlinear relationships).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (key advantage over correlation: mutual information captures nonlinear relationships).

---
## Reference Absorption: Mutual Information (cont.)
- A feature might have zero correlation with the target but high mutual information because the relationship is quadratic or periodic.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (a feature might have zero correlation with the target but high mutual information because the relationship is quadratic or peri...).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (a feature might have zero correlation with the target but high mutual information because the relationship is quadrat...).
- For continuous features, discretize into bins first (histogram-based estimation).
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (for continuous features, discretize into bins first (histogram-based estimation)).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (for continuous features, discretize into bins first (histogram-based estimation)).
- The number of bins affects the estimate -- too few bins lose information, too many bins add noise.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (the number of bins affects the estimate -- too few bins lose information, too many bins add noise).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (the number of bins affects the estimate -- too few bins lose information, too many bins add noise).
- A common choice: sqrt(n) bins or Sturges' rule (1 + log2(n)).
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (a common choice: sqrt(n) bins or sturges' rule (1 + log2(n))).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (a common choice: sqrt(n) bins or sturges' rule (1 + log2(n))).

---
## Reference Absorption: Recursive Feature Elimination (RFE)
- It uses a model's own feature importance to iteratively prune:
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (it uses a model's own feature importance to iteratively prune:).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (it uses a model's own feature importance to iteratively prune:).
- Train the model with all features
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (train the model with all features).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (train the model with all features).
- Rank features by importance (coefficients for linear models, impurity reduction for trees)
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (rank features by importance (coefficients for linear models, impurity reduction for trees)).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (rank features by importance (coefficients for linear models, impurity reduction for trees)).
- Remove the least important feature(s)
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (remove the least important feature(s)).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (remove the least important feature(s)).

---
## Reference Absorption: Recursive Feature Elimination (RFE) (cont.)
- Repeat until the desired number of features remains
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (repeat until the desired number of features remains).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (repeat until the desired number of features remains).
- RFE considers feature interactions because the model sees all remaining features together.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (rfe considers feature interactions because the model sees all remaining features together).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (rfe considers feature interactions because the model sees all remaining features together).
- Removing one feature changes the importance of others.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (removing one feature changes the importance of others).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (removing one feature changes the importance of others).
- This makes it more thorough than filter methods.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (this makes it more thorough than filter methods).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (this makes it more thorough than filter methods).

---
## Reference Absorption: Recursive Feature Elimination (RFE) Deep Continuation
- The cost: you train the model N - target times.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (the cost: you train the model n - target times).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (the cost: you train the model n - target times).
- With 500 features and a target of 10, that is 490 training runs.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (with 500 features and a target of 10, that is 490 training runs).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (with 500 features and a target of 10, that is 490 training runs).
- For expensive models, this is slow.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (for expensive models, this is slow).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (for expensive models, this is slow).
- You can speed it up by removing multiple features per step (e.g., remove the bottom 10% each round).
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (you can speed it up by removing multiple features per step (e.g., remove the bottom 10% each round)).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (you can speed it up by removing multiple features per step (e.g., remove the bottom 10% each round)).

---
## Reference Absorption: L1 (Lasso) Regularization
- L1 regularization adds the absolute value of weights to the loss function:
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (l1 regularization adds the absolute value of weights to the loss function:).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (l1 regularization adds the absolute value of weights to the loss function:).
- The alpha parameter controls how aggressively features are pruned.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (the alpha parameter controls how aggressively features are pruned).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (the alpha parameter controls how aggressively features are pruned).
- Higher alpha means more weights go to exactly zero.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (higher alpha means more weights go to exactly zero).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (higher alpha means more weights go to exactly zero).
- The L1 penalty creates a diamond-shaped constraint region in weight space.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (the l1 penalty creates a diamond-shaped constraint region in weight space).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (the l1 penalty creates a diamond-shaped constraint region in weight space).

---
## Reference Absorption: L1 (Lasso) Regularization (cont.)
- The optimal solution tends to land at a corner of this diamond, where one or more weights are zero.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (the optimal solution tends to land at a corner of this diamond, where one or more weights are zero).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (the optimal solution tends to land at a corner of this diamond, where one or more weights are zero).
- L2 regularization (ridge) creates a circular constraint where weights shrink but rarely hit zero.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (l2 regularization (ridge) creates a circular constraint where weights shrink but rarely hit zero).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (l2 regularization (ridge) creates a circular constraint where weights shrink but rarely hit zero).
- This is embedded feature selection: the model learns during training which features to ignore.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (this is embedded feature selection: the model learns during training which features to ignore).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (this is embedded feature selection: the model learns during training which features to ignore).
- Features with zero weight are effectively removed.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (features with zero weight are effectively removed).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (features with zero weight are effectively removed).

---
## Reference Absorption: L1 (Lasso) Regularization Deep Continuation
- Advantages: single training run, handles correlated features (picks one and zeros the others), built into most linear model implementations.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (advantages: single training run, handles correlated features (picks one and zeros the others), built into most linear model imp...).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (advantages: single training run, handles correlated features (picks one and zeros the others), built into most linear...).
- Limitation: only works for linear models.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (limitation: only works for linear models).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (limitation: only works for linear models).
- Cannot capture nonlinear feature importance.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (cannot capture nonlinear feature importance).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (cannot capture nonlinear feature importance).

---
## Reference Absorption: Further Reading
- [An Introduction to Variable and Feature Selection (Guyon & Elisseeff, 2003)](https://jmlr.org/papers/v3/guyon03a.html) -- the foundational survey on feature selection methods, still widely referenced
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade ([an introduction to variable and feature selection (guyon & elisseeff, 2003)](https://jmlr.org/papers/v3/guyon03a.html) -- the...).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept ([an introduction to variable and feature selection (guyon & elisseeff, 2003)](https://jmlr.org/papers/v3/guyon03a.htm...).
- [scikit-learn Feature Selection Guide](https://scikit-learn.org/stable/modules/feature_selection.html) -- practical reference for filter, wrapper, and embedded methods with code examples
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade ([scikit-learn feature selection guide](https://scikit-learn.org/stable/modules/feature_selection.html) -- practical reference f...).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept ([scikit-learn feature selection guide](https://scikit-learn.org/stable/modules/feature_selection.html) -- practical r...).
- [Stability Selection (Meinshausen & Buhlmann, 2010)](https://arxiv.org/abs/0809.2932) -- combines subsampling with feature selection for robust, reproducible results
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade ([stability selection (meinshausen & buhlmann, 2010)](https://arxiv.org/abs/0809.2932) -- combines subsampling with feature sele...).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept ([stability selection (meinshausen & buhlmann, 2010)](https://arxiv.org/abs/0809.2932) -- combines subsampling with fe...).
- [Beware Default Random Forest Importances (Strobl et al., 2007)](https://bmcbioinformatics.biomedcentral.com/articles/10.1186/1471-2105-8-25) -- demonstrates the cardinality bias in tree-based importance and...
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade ([beware default random forest importances (strobl et al., 2007)](https://bmcbioinformatics.biomedcentral.com/articles/10.1186/1...).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept ([beware default random forest importances (strobl et al., 2007)](https://bmcbioinformatics.biomedcentral.com/articles...).

---
## Reference Absorption: Tree-Based Feature Importance
- Decision trees and their ensembles (random forests, gradient boosting) naturally rank features.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (decision trees and their ensembles (random forests, gradient boosting) naturally rank features).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (decision trees and their ensembles (random forests, gradient boosting) naturally rank features).
- Every split reduces impurity (Gini or entropy for classification, variance for regression).
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (every split reduces impurity (gini or entropy for classification, variance for regression)).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (every split reduces impurity (gini or entropy for classification, variance for regression)).
- Features that produce larger impurity reductions are more important.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (features that produce larger impurity reductions are more important).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (features that produce larger impurity reductions are more important).
- For a random forest with T trees:
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (for a random forest with t trees:).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (for a random forest with t trees:).

---
## Reference Absorption: Tree-Based Feature Importance (cont.)
- This gives a normalized importance score for each feature.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (this gives a normalized importance score for each feature).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (this gives a normalized importance score for each feature).
- It handles nonlinear relationships and feature interactions automatically.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (it handles nonlinear relationships and feature interactions automatically).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (it handles nonlinear relationships and feature interactions automatically).
- Caution: tree-based importance is biased toward features with many unique values (high cardinality).
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (caution: tree-based importance is biased toward features with many unique values (high cardinality)).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (caution: tree-based importance is biased toward features with many unique values (high cardinality)).
- A random ID column will appear important because it perfectly splits every sample.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (a random id column will appear important because it perfectly splits every sample).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (a random id column will appear important because it perfectly splits every sample).

---
## Reference Absorption: Tree-Based Feature Importance Deep Continuation
- Use permutation importance as a sanity check.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (use permutation importance as a sanity check).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (use permutation importance as a sanity check).

---
## Reference Absorption: Variance Threshold
- If a feature barely varies across samples, it carries almost no information.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (if a feature barely varies across samples, it carries almost no information).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (if a feature barely varies across samples, it carries almost no information).
- Consider a feature that is 0.0 for 999 out of 1000 samples.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (consider a feature that is 0.0 for 999 out of 1000 samples).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (consider a feature that is 0.0 for 999 out of 1000 samples).
- No model can use it to distinguish between classes.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (no model can use it to distinguish between classes).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (no model can use it to distinguish between classes).
- Set a threshold (e.g., 0.01).
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (set a threshold (e.g., 0.01)).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (set a threshold (e.g., 0.01)).

---
## Reference Absorption: Variance Threshold (cont.)
- Drop every feature with variance below it.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (drop every feature with variance below it).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (drop every feature with variance below it).
- This removes constant or near-constant features without looking at the target variable at all.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (this removes constant or near-constant features without looking at the target variable at all).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (this removes constant or near-constant features without looking at the target variable at all).
- When to use it: as a preprocessing step before other methods.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (when to use it: as a preprocessing step before other methods).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (when to use it: as a preprocessing step before other methods).
- It catches obviously useless features at near-zero cost.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (it catches obviously useless features at near-zero cost).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (it catches obviously useless features at near-zero cost).

---
## Reference Absorption: Variance Threshold Deep Continuation
- Limitation: a feature can have high variance and still be pure noise.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (limitation: a feature can have high variance and still be pure noise).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (limitation: a feature can have high variance and still be pure noise).
- Variance threshold is necessary but not sufficient.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (variance threshold is necessary but not sufficient).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (variance threshold is necessary but not sufficient).

---
## Reference Absorption: Permutation Importance
- Train the model and record baseline performance on validation data
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (train the model and record baseline performance on validation data).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (train the model and record baseline performance on validation data).
- For each feature: shuffle its values randomly, measure the drop in performance
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (for each feature: shuffle its values randomly, measure the drop in performance).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (for each feature: shuffle its values randomly, measure the drop in performance).
- The bigger the drop, the more important the feature
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (the bigger the drop, the more important the feature).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (the bigger the drop, the more important the feature).
- If shuffling a feature does not hurt performance, the model does not depend on it.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (if shuffling a feature does not hurt performance, the model does not depend on it).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (if shuffling a feature does not hurt performance, the model does not depend on it).

---
## Reference Absorption: Permutation Importance (cont.)
- If performance collapses, that feature is critical.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (if performance collapses, that feature is critical).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (if performance collapses, that feature is critical).
- Permutation importance avoids the cardinality bias of tree-based importance.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (permutation importance avoids the cardinality bias of tree-based importance).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (permutation importance avoids the cardinality bias of tree-based importance).
- But it is slow: one full evaluation per feature, repeated multiple times for stability.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (but it is slow: one full evaluation per feature, repeated multiple times for stability).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (but it is slow: one full evaluation per feature, repeated multiple times for stability).

---
## Beyond Reference: Engineering Translation
- Core anchors for this module: feature, features, selection, importance, threshold, model, samples, information.
- Convert each theoretical primitive into measurable training and inference behaviors.
- Define observability checkpoints for drift, calibration, and latency regressions.
- Tie assumptions to explicit data contracts and fallback policies.

---
## Beyond Reference: Advanced Layer 1
- Integrate filter, wrapper, and embedded selection in one leakage-safe pipeline.
- Risk and governance extension: convert this into acceptance tests and rollback criteria (integrate filter, wrapper, and embedded selection in one leakage-safe pipeline.).
- Estimate feature-selection stability across folds and seeds.
- Risk and governance extension: convert this into acceptance tests and rollback criteria (estimate feature-selection stability across folds and seeds.).
- Quantify computational cost versus accuracy gains for each selection strategy.
- Risk and governance extension: convert this into acceptance tests and rollback criteria (quantify computational cost versus accuracy gains for each selection strategy.).

<!-- DEPTH_EXPANSION_END -->
