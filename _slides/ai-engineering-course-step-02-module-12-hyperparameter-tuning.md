---
layout: slides
title: "Hyperparameter Tuning"
category: "ai-engineering-course-step-02"
module_number: 12
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
## Module 12: Hyperparameter Tuning
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
- Your gradient boosting model has a learning rate, number of trees, max depth, min samples per leaf, subsample ratio, and column sample ratio.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (your gradient boosting model has a learning rate, number of trees, max depth, min samples per leaf, subsample ratio, and column...).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (your gradient boosting model has a learning rate, number of trees, max depth, min samples per leaf, subsample ratio,...).
- That is six hyperparameters.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (that is six hyperparameters).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (that is six hyperparameters).
- If each has 5 reasonable values, the grid has 5^6 = 15,625 combinations.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (if each has 5 reasonable values, the grid has 5^6 = 15,625 combinations).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (if each has 5 reasonable values, the grid has 5^6 = 15,625 combinations).
- Training each takes 10 seconds.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (training each takes 10 seconds).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (training each takes 10 seconds).

---
## Reference Absorption: The Problem (cont.)
- That is 43 hours of compute to try them all.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (that is 43 hours of compute to try them all).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (that is 43 hours of compute to try them all).
- Grid search is the obvious approach and the worst one at scale.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (grid search is the obvious approach and the worst one at scale).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (grid search is the obvious approach and the worst one at scale).
- Random search does better with less compute.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (random search does better with less compute).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (random search does better with less compute).
- Bayesian optimization does even better by learning from past evaluations.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (bayesian optimization does even better by learning from past evaluations).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (bayesian optimization does even better by learning from past evaluations).

---
## Reference Absorption: The Problem Deep Continuation
- Knowing which strategy to use, and which hyperparameters actually matter, saves days of wasted GPU time.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (knowing which strategy to use, and which hyperparameters actually matter, saves days of wasted gpu time).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (knowing which strategy to use, and which hyperparameters actually matter, saves days of wasted gpu time).

---
## Reference Absorption: Common Mistakes in Hyperparameter Tuning
- Data leakage through preprocessing. If you fit a scaler on the full dataset before cross-validation, information from the validation fold leaks into training.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (data leakage through preprocessing. if you fit a scaler on the full dataset before cross-validation, information from the valid...).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (data leakage through preprocessing. if you fit a scaler on the full dataset before cross-validation, information from...).
- Always put preprocessing inside a Pipeline so it is fit only on the training fold.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (always put preprocessing inside a pipeline so it is fit only on the training fold).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (always put preprocessing inside a pipeline so it is fit only on the training fold).
- Overfitting to the validation set. Running thousands of trials effectively trains on the validation set.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (overfitting to the validation set. running thousands of trials effectively trains on the validation set).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (overfitting to the validation set. running thousands of trials effectively trains on the validation set).
- Use nested cross-validation for final performance estimates, or hold out a separate test set that you never touch during tuning.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (use nested cross-validation for final performance estimates, or hold out a separate test set that you never touch during tuning).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (use nested cross-validation for final performance estimates, or hold out a separate test set that you never touch dur...).

---
## Reference Absorption: Common Mistakes in Hyperparameter Tuning (cont.)
- Searching too narrow a range. If your best value is at the boundary of your search space, you have not searched widely enough.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (searching too narrow a range. if your best value is at the boundary of your search space, you have not searched widely enough).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (searching too narrow a range. if your best value is at the boundary of your search space, you have not searched widel...).
- The optimal value might be outside your range.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (the optimal value might be outside your range).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (the optimal value might be outside your range).
- Always check if the best parameters are at the edges.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (always check if the best parameters are at the edges).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (always check if the best parameters are at the edges).
- Ignoring interaction effects. Learning rate and number of estimators interact strongly in boosting.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (ignoring interaction effects. learning rate and number of estimators interact strongly in boosting).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (ignoring interaction effects. learning rate and number of estimators interact strongly in boosting).

---
## Reference Absorption: Common Mistakes in Hyperparameter Tuning Deep Continuation
- A low learning rate needs more estimators.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (a low learning rate needs more estimators).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (a low learning rate needs more estimators).
- Tuning them independently gives worse results than tuning them together.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (tuning them independently gives worse results than tuning them together).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (tuning them independently gives worse results than tuning them together).
- Not using early stopping for iterative models. For gradient boosting and neural networks, set n_estimators or epochs to a high value and use early stopping.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (not using early stopping for iterative models. for gradient boosting and neural networks, set n_estimators or epochs to a high...).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (not using early stopping for iterative models. for gradient boosting and neural networks, set n_estimators or epochs...).
- This is strictly better than tuning the number of iterations as a hyperparameter.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (this is strictly better than tuning the number of iterations as a hyperparameter).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (this is strictly better than tuning the number of iterations as a hyperparameter).

---
## Reference Absorption: Exercises
- Run grid search and random search with the same total budget (e.g., 50 evaluations).
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (run grid search and random search with the same total budget (e.g., 50 evaluations)).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (run grid search and random search with the same total budget (e.g., 50 evaluations)).
- Compare the best scores found.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (compare the best scores found).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (compare the best scores found).
- Run the experiment 10 times with different seeds.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (run the experiment 10 times with different seeds).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (run the experiment 10 times with different seeds).
- How often does random search win?
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (how often does random search win?).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (how often does random search win?).

---
## Reference Absorption: Exercises (cont.)
- Implement Hyperband from scratch.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (implement hyperband from scratch).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (implement hyperband from scratch).
- Start with 81 configurations, each trained for 1 epoch.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (start with 81 configurations, each trained for 1 epoch).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (start with 81 configurations, each trained for 1 epoch).
- Keep the top 1/3 at each round and triple their budget.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (keep the top 1/3 at each round and triple their budget).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (keep the top 1/3 at each round and triple their budget).
- Compare total compute (sum of all epochs across all configs) to running 81 configs for the full budget.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (compare total compute (sum of all epochs across all configs) to running 81 configs for the full budget).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (compare total compute (sum of all epochs across all configs) to running 81 configs for the full budget).

---
## Reference Absorption: Exercises Deep Continuation
- Add a learning rate scheduler (cosine annealing) to the gradient boosting implementation from Lesson 11.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (add a learning rate scheduler (cosine annealing) to the gradient boosting implementation from lesson 11).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (add a learning rate scheduler (cosine annealing) to the gradient boosting implementation from lesson 11).
- Does it help compared to a fixed learning rate?
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (does it help compared to a fixed learning rate?).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (does it help compared to a fixed learning rate?).
- Use Optuna to tune a RandomForestClassifier on a real dataset (e.g., sklearn's breast cancer dataset).
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (use optuna to tune a randomforestclassifier on a real dataset (e.g., sklearn's breast cancer dataset)).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (use optuna to tune a randomforestclassifier on a real dataset (e.g., sklearn's breast cancer dataset)).
- Use optuna.visualization.plot_param_importances(study) to see which hyperparameters matter most.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (use optuna.visualization.plot_param_importances(study) to see which hyperparameters matter most).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (use optuna.visualization.plot_param_importances(study) to see which hyperparameters matter most).

---
## Reference Absorption: Exercises Deep Continuation
- Does it match the importance ranking from this lesson?
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (does it match the importance ranking from this lesson?).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (does it match the importance ranking from this lesson?).
- Implement a simple acquisition function (Expected Improvement) and demonstrate exploration vs exploitation.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (implement a simple acquisition function (expected improvement) and demonstrate exploration vs exploitation).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (implement a simple acquisition function (expected improvement) and demonstrate exploration vs exploitation).
- Plot the surrogate model's mean and uncertainty, and show where EI chooses to evaluate next.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (plot the surrogate model's mean and uncertainty, and show where ei chooses to evaluate next).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (plot the surrogate model's mean and uncertainty, and show where ei chooses to evaluate next).

---
## Reference Absorption: Step 3: Bayesian Optimization (Simplified)
- The core idea: fit a Gaussian process to observed (hyperparameter, score) pairs, then use an acquisition function to decide where to look next.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (the core idea: fit a gaussian process to observed (hyperparameter, score) pairs, then use an acquisition function to decide whe...).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (the core idea: fit a gaussian process to observed (hyperparameter, score) pairs, then use an acquisition function to...).
- The GP surrogate gives two things at each candidate point: a predicted score (mu) and an uncertainty (var).
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (the gp surrogate gives two things at each candidate point: a predicted score (mu) and an uncertainty (var)).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (the gp surrogate gives two things at each candidate point: a predicted score (mu) and an uncertainty (var)).
- Expected Improvement balances these: it favors points where the model predicts high scores OR where uncertainty is high.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (expected improvement balances these: it favors points where the model predicts high scores or where uncertainty is high).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (expected improvement balances these: it favors points where the model predicts high scores or where uncertainty is high).
- Early on, most points have high uncertainty so the optimizer explores.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (early on, most points have high uncertainty so the optimizer explores).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (early on, most points have high uncertainty so the optimizer explores).

---
## Reference Absorption: Step 3: Bayesian Optimization (Simplified) (cont.)
- Later, it focuses on the most promising region.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (later, it focuses on the most promising region).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (later, it focuses on the most promising region).

---
## Reference Absorption: Step 4: Compare All Methods
- Run all three methods on the same synthetic objective and compare.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (run all three methods on the same synthetic objective and compare).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (run all three methods on the same synthetic objective and compare).
- This comparison uses a simplified wrapper that calls each optimizer with a direct objective function (no model training), so the API differs from the model-based implementations above:
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (this comparison uses a simplified wrapper that calls each optimizer with a direct objective function (no model training), so th...).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (this comparison uses a simplified wrapper that calls each optimizer with a direct objective function (no model traini...).
- With the same budget, Bayesian optimization usually finds the best score fastest because it does not waste evaluations in clearly bad regions.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (with the same budget, bayesian optimization usually finds the best score fastest because it does not waste evaluations in clear...).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (with the same budget, bayesian optimization usually finds the best score fastest because it does not waste evaluation...).
- Random search covers more ground than grid search.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (random search covers more ground than grid search).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (random search covers more ground than grid search).

---
## Reference Absorption: Step 4: Compare All Methods (cont.)
- Grid search only wins when you have very few hyperparameters and can afford to be exhaustive.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (grid search only wins when you have very few hyperparameters and can afford to be exhaustive).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (grid search only wins when you have very few hyperparameters and can afford to be exhaustive).

---
## Reference Absorption: Practical Tips
- Start with the learning rate. It is always the most important hyperparameter for gradient-based methods.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (start with the learning rate. it is always the most important hyperparameter for gradient-based methods).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (start with the learning rate. it is always the most important hyperparameter for gradient-based methods).
- A bad learning rate makes everything else irrelevant.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (a bad learning rate makes everything else irrelevant).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (a bad learning rate makes everything else irrelevant).
- Fix other hyperparameters at defaults and sweep learning rate first.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (fix other hyperparameters at defaults and sweep learning rate first).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (fix other hyperparameters at defaults and sweep learning rate first).
- Use log-uniform distributions for learning rate and regularization. The difference between 0.001 and 0.01 matters as much as the difference between 0.1 and 1.0.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (use log-uniform distributions for learning rate and regularization. the difference between 0.001 and 0.01 matters as much as th...).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (use log-uniform distributions for learning rate and regularization. the difference between 0.001 and 0.01 matters as...).

---
## Reference Absorption: Practical Tips (cont.)
- Searching linearly wastes budget on the large end.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (searching linearly wastes budget on the large end).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (searching linearly wastes budget on the large end).
- Use early stopping instead of tuning n_estimators. For boosting and neural networks, set n_estimators or epochs high and let early stopping decide when to stop.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (use early stopping instead of tuning n_estimators. for boosting and neural networks, set n_estimators or epochs high and let ea...).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (use early stopping instead of tuning n_estimators. for boosting and neural networks, set n_estimators or epochs high...).
- This removes one hyperparameter from the search.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (this removes one hyperparameter from the search).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (this removes one hyperparameter from the search).
- Budget allocation. Spend 60% of your tuning budget on the top 2 most important hyperparameters.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (budget allocation. spend 60% of your tuning budget on the top 2 most important hyperparameters).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (budget allocation. spend 60% of your tuning budget on the top 2 most important hyperparameters).

---
## Reference Absorption: Practical Tips Deep Continuation
- Spend the remaining 40% on everything else.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (spend the remaining 40% on everything else).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (spend the remaining 40% on everything else).
- The top 2 account for most of the performance variation.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (the top 2 account for most of the performance variation).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (the top 2 account for most of the performance variation).
- Scale matters. Never search batch size on a log scale (16, 32, 64 are fine).
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (scale matters. never search batch size on a log scale (16, 32, 64 are fine)).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (scale matters. never search batch size on a log scale (16, 32, 64 are fine)).
- Always search learning rate on a log scale.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (always search learning rate on a log scale).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (always search learning rate on a log scale).

---
## Reference Absorption: Practical Tips Deep Continuation
- Match the search distribution to how the hyperparameter affects the model.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (match the search distribution to how the hyperparameter affects the model).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (match the search distribution to how the hyperparameter affects the model).
- When in doubt: random search with 2x the number of hyperparameters as trials (e.g., 6 hyperparameters = 12+ trials minimum).
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (when in doubt: random search with 2x the number of hyperparameters as trials (e.g., 6 hyperparameters = 12+ trials minimum)).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (when in doubt: random search with 2x the number of hyperparameters as trials (e.g., 6 hyperparameters = 12+ trials mi...).
- You will be surprised how often random search with 50 trials beats carefully designed grid search.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (you will be surprised how often random search with 50 trials beats carefully designed grid search).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (you will be surprised how often random search with 50 trials beats carefully designed grid search).

---
## Reference Absorption: Cross-Validation Integration
- Tuning hyperparameters on a single validation split is risky.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (tuning hyperparameters on a single validation split is risky).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (tuning hyperparameters on a single validation split is risky).
- The best hyperparameters might overfit to the specific validation fold.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (the best hyperparameters might overfit to the specific validation fold).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (the best hyperparameters might overfit to the specific validation fold).
- Nested cross-validation solves this by using two loops:
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (nested cross-validation solves this by using two loops:).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (nested cross-validation solves this by using two loops:).
- Outer loop (evaluation): splits data into train+val and test. Reports unbiased performance.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (outer loop (evaluation): splits data into train+val and test. reports unbiased performance).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (outer loop (evaluation): splits data into train+val and test. reports unbiased performance).

---
## Reference Absorption: Cross-Validation Integration (cont.)
- Inner loop (tuning): splits train+val into train and val. Finds best hyperparameters.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (inner loop (tuning): splits train+val into train and val. finds best hyperparameters).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (inner loop (tuning): splits train+val into train and val. finds best hyperparameters).
- Each outer fold finds its own best hyperparameters independently.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (each outer fold finds its own best hyperparameters independently).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (each outer fold finds its own best hyperparameters independently).
- The outer scores are an unbiased estimate of generalization performance.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (the outer scores are an unbiased estimate of generalization performance).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (the outer scores are an unbiased estimate of generalization performance).
- This is expensive (5 outer folds x 5 inner folds x 27 grid points = 675 model fits), but it gives you a trustworthy performance estimate.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (this is expensive (5 outer folds x 5 inner folds x 27 grid points = 675 model fits), but it gives you a trustworthy performance...).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (this is expensive (5 outer folds x 5 inner folds x 27 grid points = 675 model fits), but it gives you a trustworthy p...).

---
## Reference Absorption: Cross-Validation Integration Deep Continuation
- Use it when reporting final results in papers or when the stake of the decision is high.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (use it when reporting final results in papers or when the stake of the decision is high).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (use it when reporting final results in papers or when the stake of the decision is high).

---
## Reference Absorption: Bayesian Optimization
- Random search ignores results.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (random search ignores results).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (random search ignores results).
- It does not learn that high learning rates cause divergence or that depth 3 consistently outperforms depth 10.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (it does not learn that high learning rates cause divergence or that depth 3 consistently outperforms depth 10).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (it does not learn that high learning rates cause divergence or that depth 3 consistently outperforms depth 10).
- Bayesian optimization uses past evaluations to decide where to search next.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (bayesian optimization uses past evaluations to decide where to search next).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (bayesian optimization uses past evaluations to decide where to search next).
- Surrogate model: A cheap-to-evaluate model (usually a Gaussian process) that approximates the expensive objective function.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (surrogate model: a cheap-to-evaluate model (usually a gaussian process) that approximates the expensive objective function).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (surrogate model: a cheap-to-evaluate model (usually a gaussian process) that approximates the expensive objective fun...).

---
## Reference Absorption: Bayesian Optimization (cont.)
- It gives both a prediction and an uncertainty estimate at any point in the search space.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (it gives both a prediction and an uncertainty estimate at any point in the search space).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (it gives both a prediction and an uncertainty estimate at any point in the search space).
- Acquisition function: Decides where to evaluate next by balancing exploitation (search near known good points) and exploration (search where uncertainty is high).
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (acquisition function: decides where to evaluate next by balancing exploitation (search near known good points) and exploration...).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (acquisition function: decides where to evaluate next by balancing exploitation (search near known good points) and ex...).
- Expected Improvement (EI): How much improvement over the current best do we expect at this point?
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (expected improvement (ei): how much improvement over the current best do we expect at this point?).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (expected improvement (ei): how much improvement over the current best do we expect at this point?).
- Upper Confidence Bound (UCB): Prediction plus a multiple of uncertainty. Higher UCB means either promising or unexplored.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (upper confidence bound (ucb): prediction plus a multiple of uncertainty. higher ucb means either promising or unexplored).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (upper confidence bound (ucb): prediction plus a multiple of uncertainty. higher ucb means either promising or unexplored).

---
## Reference Absorption: Bayesian Optimization Deep Continuation
- Probability of Improvement (PI): What is the probability this point beats the current best?
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (probability of improvement (pi): what is the probability this point beats the current best?).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (probability of improvement (pi): what is the probability this point beats the current best?).
- Bayesian optimization typically finds better hyperparameters than random search with 2-5x fewer evaluations.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (bayesian optimization typically finds better hyperparameters than random search with 2-5x fewer evaluations).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (bayesian optimization typically finds better hyperparameters than random search with 2-5x fewer evaluations).
- The overhead of fitting the surrogate model is negligible compared to training the actual model.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (the overhead of fitting the surrogate model is negligible compared to training the actual model).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (the overhead of fitting the surrogate model is negligible compared to training the actual model).

---
## Reference Absorption: Optuna with Pruning
- Pruning stops unpromising trials early, saving massive compute.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (pruning stops unpromising trials early, saving massive compute).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (pruning stops unpromising trials early, saving massive compute).
- The MedianPruner stops a trial if its intermediate value is worse than the median of all completed trials at the same step.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (the medianpruner stops a trial if its intermediate value is worse than the median of all completed trials at the same step).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (the medianpruner stops a trial if its intermediate value is worse than the median of all completed trials at the same...).
- Pruning requires calling trial.report() to report intermediate metrics and trial.should_prune() to check whether the trial should be stopped.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (pruning requires calling trial.report() to report intermediate metrics and trial.should_prune() to check whether the trial shou...).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (pruning requires calling trial.report() to report intermediate metrics and trial.should_prune() to check whether the...).
- The n_startup_trials=10 ensures at least 10 trials complete fully before pruning kicks in.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (the n_startup_trials=10 ensures at least 10 trials complete fully before pruning kicks in).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (the n_startup_trials=10 ensures at least 10 trials complete fully before pruning kicks in).

---
## Reference Absorption: Optuna with Pruning (cont.)
- This typically saves 40-60% of total compute.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (this typically saves 40-60% of total compute).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (this typically saves 40-60% of total compute).

---
## Reference Absorption: Key Terms
- Covers important dimensions better than grid search.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (covers important dimensions better than grid search).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (covers important dimensions better than grid search).
- EI and UCB are common choices.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (ei and ucb are common choices).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (ei and ucb are common choices).

---
## Reference Absorption: Optuna in Practice
- Optuna is the recommended library for serious hyperparameter tuning.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (optuna is the recommended library for serious hyperparameter tuning).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (optuna is the recommended library for serious hyperparameter tuning).
- It supports pruning, distributed search, and visualization out of the box.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (it supports pruning, distributed search, and visualization out of the box).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (it supports pruning, distributed search, and visualization out of the box).
- suggest_float(..., log=True) for parameters best searched on log scale (learning rate, regularization)
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (suggest_float(..., log=true) for parameters best searched on log scale (learning rate, regularization)).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (suggest_float(..., log=true) for parameters best searched on log scale (learning rate, regularization)).
- suggest_int for integer parameters
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (suggest_int for integer parameters).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (suggest_int for integer parameters).

---
## Reference Absorption: Optuna in Practice (cont.)
- suggest_categorical for discrete choices
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (suggest_categorical for discrete choices).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (suggest_categorical for discrete choices).
- Built-in MedianPruner for early stopping of bad trials
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (built-in medianpruner for early stopping of bad trials).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (built-in medianpruner for early stopping of bad trials).
- study.trials_dataframe() for analysis
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (study.trials_dataframe() for analysis).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (study.trials_dataframe() for analysis).

---
## Reference Absorption: Random Search
- Random search samples hyperparameters from distributions instead of a grid.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (random search samples hyperparameters from distributions instead of a grid).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (random search samples hyperparameters from distributions instead of a grid).
- With the same budget of 9 evaluations, you get 9 unique values of each hyperparameter.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (with the same budget of 9 evaluations, you get 9 unique values of each hyperparameter).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (with the same budget of 9 evaluations, you get 9 unique values of each hyperparameter).
- Why random beats grid (Bergstra & Bengio, 2012):
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (why random beats grid (bergstra & bengio, 2012):).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (why random beats grid (bergstra & bengio, 2012):).
- Most hyperparameters have low effective dimensionality. Only 1-2 of 6 hyperparameters usually matter for a given problem.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (most hyperparameters have low effective dimensionality. only 1-2 of 6 hyperparameters usually matter for a given problem).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (most hyperparameters have low effective dimensionality. only 1-2 of 6 hyperparameters usually matter for a given problem).

---
## Reference Absorption: Random Search (cont.)
- Grid search wastes evaluations on unimportant dimensions.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (grid search wastes evaluations on unimportant dimensions).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (grid search wastes evaluations on unimportant dimensions).
- Random search covers the important dimensions more densely for the same budget.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (random search covers the important dimensions more densely for the same budget).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (random search covers the important dimensions more densely for the same budget).
- At 60 random trials, you have a 95% chance of finding a point within 5% of the optimum (if one exists in the search space).
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (at 60 random trials, you have a 95% chance of finding a point within 5% of the optimum (if one exists in the search space)).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (at 60 random trials, you have a 95% chance of finding a point within 5% of the optimum (if one exists in the search s...).

---
## Reference Absorption: Practical Strategy
- Start with library defaults. They are chosen by experienced practitioners and are often 80% of the way there.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (start with library defaults. they are chosen by experienced practitioners and are often 80% of the way there).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (start with library defaults. they are chosen by experienced practitioners and are often 80% of the way there).
- Coarse random search. Wide ranges, 20-50 trials.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (coarse random search. wide ranges, 20-50 trials).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (coarse random search. wide ranges, 20-50 trials).
- Use early stopping to kill bad runs fast.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (use early stopping to kill bad runs fast).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (use early stopping to kill bad runs fast).
- Analyze results. Which hyperparameters correlate with performance?
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (analyze results. which hyperparameters correlate with performance?).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (analyze results. which hyperparameters correlate with performance?).

---
## Reference Absorption: Practical Strategy (cont.)
- Fine search. Bayesian optimization or focused random search in the narrowed space.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (fine search. bayesian optimization or focused random search in the narrowed space).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (fine search. bayesian optimization or focused random search in the narrowed space).
- Retrain on all training data with the best hyperparameters found.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (retrain on all training data with the best hyperparameters found).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (retrain on all training data with the best hyperparameters found).

---
## Reference Absorption: sklearn's Built-in Tuners
- For quick experiments, sklearn provides GridSearchCV, RandomizedSearchCV, and HalvingRandomSearchCV:
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (for quick experiments, sklearn provides gridsearchcv, randomizedsearchcv, and halvingrandomsearchcv:).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (for quick experiments, sklearn provides gridsearchcv, randomizedsearchcv, and halvingrandomsearchcv:).
- Use loguniform from scipy for learning rate and regularization.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (use loguniform from scipy for learning rate and regularization).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (use loguniform from scipy for learning rate and regularization).
- Use randint for integer hyperparameters.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (use randint for integer hyperparameters).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (use randint for integer hyperparameters).
- The n_jobs=-1 flag parallelizes across all CPU cores.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (the n_jobs=-1 flag parallelizes across all cpu cores).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (the n_jobs=-1 flag parallelizes across all cpu cores).

---
## Reference Absorption: Early Stopping
- Not every training run needs to finish.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (not every training run needs to finish).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (not every training run needs to finish).
- If a configuration is clearly bad after 10 epochs, stop it and move on.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (if a configuration is clearly bad after 10 epochs, stop it and move on).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (if a configuration is clearly bad after 10 epochs, stop it and move on).
- This is early stopping in the context of hyperparameter search.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (this is early stopping in the context of hyperparameter search).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (this is early stopping in the context of hyperparameter search).
- Patience-based: Stop if validation loss has not improved for N consecutive epochs
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (patience-based: stop if validation loss has not improved for n consecutive epochs).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (patience-based: stop if validation loss has not improved for n consecutive epochs).

---
## Reference Absorption: Early Stopping (cont.)
- Median pruning: Stop if the trial's intermediate result is worse than the median of completed trials at the same step
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (median pruning: stop if the trial's intermediate result is worse than the median of completed trials at the same step).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (median pruning: stop if the trial's intermediate result is worse than the median of completed trials at the same step).
- Hyperband: Allocate small budgets to many configurations, then progressively increase budget for the best ones
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (hyperband: allocate small budgets to many configurations, then progressively increase budget for the best ones).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (hyperband: allocate small budgets to many configurations, then progressively increase budget for the best ones).
- Hyperband is particularly effective.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (hyperband is particularly effective).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (hyperband is particularly effective).
- It starts 81 configurations with 1 epoch each, keeps the top third, gives them 3 epochs, keeps the top third, and so on.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (it starts 81 configurations with 1 epoch each, keeps the top third, gives them 3 epochs, keeps the top third, and so on).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (it starts 81 configurations with 1 epoch each, keeps the top third, gives them 3 epochs, keeps the top third, and so on).

---
## Reference Absorption: Early Stopping Deep Continuation
- This finds good configurations 10-50x faster than evaluating all configs for the full budget.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (this finds good configurations 10-50x faster than evaluating all configs for the full budget).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (this finds good configurations 10-50x faster than evaluating all configs for the full budget).

---
## Reference Absorption: Step 1: Grid Search from Scratch
- The code in code/tuning.py implements grid search, random search, and a simple Bayesian optimizer from scratch.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (the code in code/tuning.py implements grid search, random search, and a simple bayesian optimizer from scratch).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (the code in code/tuning.py implements grid search, random search, and a simple bayesian optimizer from scratch).

---
## Reference Absorption: Further Reading
- [Bergstra & Bengio: Random Search for Hyper-Parameter Optimization (2012)](https://jmlr.org/papers/v13/bergstra12a.html) -- the paper that showed random beats grid
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade ([bergstra & bengio: random search for hyper-parameter optimization (2012)](https://jmlr.org/papers/v13/bergstra12a.html) -- the...).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept ([bergstra & bengio: random search for hyper-parameter optimization (2012)](https://jmlr.org/papers/v13/bergstra12a.ht...).
- [Snoek et al., Practical Bayesian Optimization of Machine Learning Algorithms (2012)](https://arxiv.org/abs/1206.2944) -- Bayesian optimization for ML
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade ([snoek et al., practical bayesian optimization of machine learning algorithms (2012)](https://arxiv.org/abs/1206.2944) -- bayes...).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept ([snoek et al., practical bayesian optimization of machine learning algorithms (2012)](https://arxiv.org/abs/1206.2944...).
- [Li et al., Hyperband: A Novel Bandit-Based Approach (2018)](https://jmlr.org/papers/v18/16-558.html) -- the Hyperband paper
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade ([li et al., hyperband: a novel bandit-based approach (2018)](https://jmlr.org/papers/v18/16-558.html) -- the hyperband paper).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept ([li et al., hyperband: a novel bandit-based approach (2018)](https://jmlr.org/papers/v18/16-558.html) -- the hyperban...).
- [Optuna: A Next-generation Hyperparameter Optimization Framework](https://arxiv.org/abs/1907.10902) -- the Optuna paper
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade ([optuna: a next-generation hyperparameter optimization framework](https://arxiv.org/abs/1907.10902) -- the optuna paper).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept ([optuna: a next-generation hyperparameter optimization framework](https://arxiv.org/abs/1907.10902) -- the optuna paper).

---
## Reference Absorption: Further Reading (cont.)
- [Probst et al., Tunability: Importance of Hyperparameters (2019)](https://jmlr.org/papers/v20/18-444.html) -- which hyperparameters matter
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade ([probst et al., tunability: importance of hyperparameters (2019)](https://jmlr.org/papers/v20/18-444.html) -- which hyperparame...).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept ([probst et al., tunability: importance of hyperparameters (2019)](https://jmlr.org/papers/v20/18-444.html) -- which h...).

---
## Reference Absorption: Parameters vs Hyperparameters
- Parameters are learned during training (weights, biases, split thresholds).
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (parameters are learned during training (weights, biases, split thresholds)).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (parameters are learned during training (weights, biases, split thresholds)).
- Hyperparameters are set before training starts and control how learning happens.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (hyperparameters are set before training starts and control how learning happens).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (hyperparameters are set before training starts and control how learning happens).

---
## Beyond Reference: Engineering Translation
- Core anchors for this module: search, score, best, grid, model, learning, random, params.
- Convert each theoretical primitive into measurable training and inference behaviors.
- Define observability checkpoints for drift, calibration, and latency regressions.
- Tie assumptions to explicit data contracts and fallback policies.

---
## Beyond Reference: Advanced Layer 1
- Choose search spaces with log-scale priors for sensitive hyperparameters.
- Risk and governance extension: convert this into acceptance tests and rollback criteria (choose search spaces with log-scale priors for sensitive hyperparameters.).
- Allocate tuning budget with early stopping and asynchronous scheduling.
- Risk and governance extension: convert this into acceptance tests and rollback criteria (allocate tuning budget with early stopping and asynchronous scheduling.).
- Guard against validation overfitting with repeated CV and holdout sanity checks.
- Risk and governance extension: convert this into acceptance tests and rollback criteria (guard against validation overfitting with repeated cv and holdout sanity checks.).

<!-- DEPTH_EXPANSION_END -->
