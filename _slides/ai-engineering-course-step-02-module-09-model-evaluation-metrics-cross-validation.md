---
layout: slides
title: "Model Evaluation: Metrics, Cross-Validation"
category: "ai-engineering-course-step-02"
module_number: 9
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
## Module 09: Model Evaluation: Metrics, Cross-Validation
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
- It gets 95% accuracy on your data.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (it gets 95% accuracy on your data).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (it gets 95% accuracy on your data).
- If 95% of your data belongs to one class, a model that always predicts that class gets 95% accuracy while being completely useless.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (if 95% of your data belongs to one class, a model that always predicts that class gets 95% accuracy while being completely useless).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (if 95% of your data belongs to one class, a model that always predicts that class gets 95% accuracy while being compl...).
- If you evaluated on the same data you trained on, the 95% number is meaningless because the model just memorized the answers.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (if you evaluated on the same data you trained on, the 95% number is meaningless because the model just memorized the answers).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (if you evaluated on the same data you trained on, the 95% number is meaningless because the model just memorized the...).
- If your dataset has a time component and you randomly shuffled before splitting, your model might be using future data to predict the past.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (if your dataset has a time component and you randomly shuffled before splitting, your model might be using future data to predi...).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (if your dataset has a time component and you randomly shuffled before splitting, your model might be using future dat...).

---
## Reference Absorption: The Problem (cont.)
- Model evaluation is where most ML projects go wrong.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (model evaluation is where most ml projects go wrong).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (model evaluation is where most ml projects go wrong).
- The wrong metric makes a bad model look good.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (the wrong metric makes a bad model look good).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (the wrong metric makes a bad model look good).
- The wrong split lets a model cheat.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (the wrong split lets a model cheat).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (the wrong split lets a model cheat).
- The wrong comparison makes you pick the worse model.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (the wrong comparison makes you pick the worse model).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (the wrong comparison makes you pick the worse model).

---
## Reference Absorption: The Problem Deep Continuation
- Getting evaluation right is not optional.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (getting evaluation right is not optional).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (getting evaluation right is not optional).
- It is the difference between a model that works in production and one that fails the moment it sees real data.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (it is the difference between a model that works in production and one that fails the moment it sees real data).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (it is the difference between a model that works in production and one that fails the moment it sees real data).

---
## Reference Absorption: Exercises
- Implement precision-recall curves: plot precision vs recall at different thresholds.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (implement precision-recall curves: plot precision vs recall at different thresholds).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (implement precision-recall curves: plot precision vs recall at different thresholds).
- Compute the average precision (area under the PR curve).
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (compute the average precision (area under the pr curve)).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (compute the average precision (area under the pr curve)).
- Compare the PR curve to the ROC curve on an imbalanced dataset and explain when each is more informative.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (compare the pr curve to the roc curve on an imbalanced dataset and explain when each is more informative).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (compare the pr curve to the roc curve on an imbalanced dataset and explain when each is more informative).
- Build a nested cross-validation loop: the outer loop evaluates model performance, the inner loop tunes hyperparameters.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (build a nested cross-validation loop: the outer loop evaluates model performance, the inner loop tunes hyperparameters).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (build a nested cross-validation loop: the outer loop evaluates model performance, the inner loop tunes hyperparameters).

---
## Reference Absorption: Exercises (cont.)
- Use it to compare two models fairly without leaking validation data into the evaluation.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (use it to compare two models fairly without leaking validation data into the evaluation).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (use it to compare two models fairly without leaking validation data into the evaluation).
- Implement a permutation test for model comparison: shuffle the labels, retrain, and measure performance.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (implement a permutation test for model comparison: shuffle the labels, retrain, and measure performance).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (implement a permutation test for model comparison: shuffle the labels, retrain, and measure performance).
- Repeat 100 times to build a null distribution.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (repeat 100 times to build a null distribution).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (repeat 100 times to build a null distribution).
- Compute the p-value for the observed model performance against this distribution.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (compute the p-value for the observed model performance against this distribution).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (compute the p-value for the observed model performance against this distribution).

---
## Reference Absorption: K-Fold Cross-Validation
- With small datasets, a single train/validation split wastes data and gives noisy estimates.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (with small datasets, a single train/validation split wastes data and gives noisy estimates).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (with small datasets, a single train/validation split wastes data and gives noisy estimates).
- K-fold cross-validation uses all the data for both training and validation:
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (k-fold cross-validation uses all the data for both training and validation:).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (k-fold cross-validation uses all the data for both training and validation:).
- Split data into K equal-sized folds
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (split data into k equal-sized folds).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (split data into k equal-sized folds).
- For each fold, train on K-1 folds and validate on the remaining fold
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (for each fold, train on k-1 folds and validate on the remaining fold).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (for each fold, train on k-1 folds and validate on the remaining fold).

---
## Reference Absorption: K-Fold Cross-Validation (cont.)
- Average the K validation scores
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (average the k validation scores).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (average the k validation scores).
- K=5 or K=10 are standard choices.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (k=5 or k=10 are standard choices).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (k=5 or k=10 are standard choices).
- Every data point gets used for validation exactly once.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (every data point gets used for validation exactly once).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (every data point gets used for validation exactly once).
- The average score is a more stable estimate than any single split.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (the average score is a more stable estimate than any single split).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (the average score is a more stable estimate than any single split).

---
## Reference Absorption: K-Fold Cross-Validation Deep Continuation
- Stratified K-fold: preserves the class distribution in each fold.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (stratified k-fold: preserves the class distribution in each fold).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (stratified k-fold: preserves the class distribution in each fold).
- If your dataset is 70% class A and 30% class B, each fold will have roughly the same ratio.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (if your dataset is 70% class a and 30% class b, each fold will have roughly the same ratio).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (if your dataset is 70% class a and 30% class b, each fold will have roughly the same ratio).
- This is important for imbalanced datasets where a random split might put all minority samples in one fold.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (this is important for imbalanced datasets where a random split might put all minority samples in one fold).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (this is important for imbalanced datasets where a random split might put all minority samples in one fold).

---
## Reference Absorption: Classification Metrics
- Confusion matrix: the foundation.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (confusion matrix: the foundation).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (confusion matrix: the foundation).
- From this matrix, all other metrics follow:
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (from this matrix, all other metrics follow:).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (from this matrix, all other metrics follow:).
- Accuracy = (TP + TN) / (TP + TN + FP + FN). Fraction of correct predictions. Misleading when classes are imbalanced.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (accuracy = (tp + tn) / (tp + tn + fp + fn). fraction of correct predictions. misleading when classes are imbalanced).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (accuracy = (tp + tn) / (tp + tn + fp + fn). fraction of correct predictions. misleading when classes are imbalanced).
- Precision = TP / (TP + FP). Of all things predicted positive, how many actually were? Use when false positives are costly (e.g., spam filter marking real email as spam).
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (precision = tp / (tp + fp). of all things predicted positive, how many actually were? use when false positives are costly (e.g....).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (precision = tp / (tp + fp). of all things predicted positive, how many actually were? use when false positives are co...).

---
## Reference Absorption: Classification Metrics (cont.)
- Recall (sensitivity) = TP / (TP + FN). Of all actual positives, how many did we catch? Use when false negatives are costly (e.g., cancer screening missing a tumor).
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (recall (sensitivity) = tp / (tp + fn). of all actual positives, how many did we catch? use when false negatives are costly (e.g...).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (recall (sensitivity) = tp / (tp + fn). of all actual positives, how many did we catch? use when false negatives are c...).
- F1 score = 2 * precision * recall / (precision + recall). Harmonic mean of precision and recall. Balances both when neither clearly dominates.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (f1 score = 2 * precision * recall / (precision + recall). harmonic mean of precision and recall. balances both when neither cle...).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (f1 score = 2 * precision * recall / (precision + recall). harmonic mean of precision and recall. balances both when n...).
- AUC-ROC: Area Under the Receiver Operating Characteristic curve. Plots true positive rate vs false positive rate at various classification thresholds. AUC = 0.5 means random guessing, AUC = 1.0 means perfect...
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (auc-roc: area under the receiver operating characteristic curve. plots true positive rate vs false positive rate at various cla...).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (auc-roc: area under the receiver operating characteristic curve. plots true positive rate vs false positive rate at v...).

---
## Reference Absorption: Train, Validation, Test
- Three splits, three purposes:
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (three splits, three purposes:).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (three splits, three purposes:).
- Training set: the model learns from this data. It sees these examples during training.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (training set: the model learns from this data. it sees these examples during training).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (training set: the model learns from this data. it sees these examples during training).
- Validation set: used to tune hyperparameters and select between models. The model never trains on this data, but your decisions are influenced by it.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (validation set: used to tune hyperparameters and select between models. the model never trains on this data, but your decisions...).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (validation set: used to tune hyperparameters and select between models. the model never trains on this data, but your...).
- Test set: touched exactly once, at the very end, to report final performance. If you look at test performance and then go back to change your model, it is no longer a test set. It has become a second validat...
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (test set: touched exactly once, at the very end, to report final performance. if you look at test performance and then go back...).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (test set: touched exactly once, at the very end, to report final performance. if you look at test performance and the...).

---
## Reference Absorption: Train, Validation, Test (cont.)
- The test set is your hold-out guarantee that the reported performance reflects how the model will do on truly unseen data.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (the test set is your hold-out guarantee that the reported performance reflects how the model will do on truly unseen data).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (the test set is your hold-out guarantee that the reported performance reflects how the model will do on truly unseen...).

---
## Reference Absorption: Common Evaluation Mistakes
- Data leakage: information from the test set leaks into training.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (data leakage: information from the test set leaks into training).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (data leakage: information from the test set leaks into training).
- Examples: fitting a scaler on the full dataset before splitting, including future data in time series prediction, using a feature that is derived from the target.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (examples: fitting a scaler on the full dataset before splitting, including future data in time series prediction, using a featu...).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (examples: fitting a scaler on the full dataset before splitting, including future data in time series prediction, usi...).
- Always split first, then preprocess.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (always split first, then preprocess).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (always split first, then preprocess).
- Class imbalance: 99% of transactions are legitimate, 1% are fraud.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (class imbalance: 99% of transactions are legitimate, 1% are fraud).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (class imbalance: 99% of transactions are legitimate, 1% are fraud).

---
## Reference Absorption: Common Evaluation Mistakes (cont.)
- A model that always predicts "legitimate" gets 99% accuracy.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (a model that always predicts "legitimate" gets 99% accuracy).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (a model that always predicts "legitimate" gets 99% accuracy).
- Use precision, recall, F1, or AUC-ROC instead.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (use precision, recall, f1, or auc-roc instead).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (use precision, recall, f1, or auc-roc instead).
- Wrong metric: optimizing accuracy when you should optimize recall (medical diagnosis), or optimizing RMSE when your data has heavy outliers (use MAE instead).
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (wrong metric: optimizing accuracy when you should optimize recall (medical diagnosis), or optimizing rmse when your data has he...).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (wrong metric: optimizing accuracy when you should optimize recall (medical diagnosis), or optimizing rmse when your d...).
- Not using stratified splits: with imbalanced data, a random split might put very few minority samples in the validation fold, giving unstable estimates.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (not using stratified splits: with imbalanced data, a random split might put very few minority samples in the validation fold, g...).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (not using stratified splits: with imbalanced data, a random split might put very few minority samples in the validati...).

---
## Reference Absorption: Common Evaluation Mistakes Deep Continuation
- Testing too often: every time you look at test performance and adjust, you overfit to the test set.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (testing too often: every time you look at test performance and adjust, you overfit to the test set).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (testing too often: every time you look at test performance and adjust, you overfit to the test set).

---
## Reference Absorption: Use It
- With scikit-learn, evaluation is built into the workflow:
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (with scikit-learn, evaluation is built into the workflow:).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (with scikit-learn, evaluation is built into the workflow:).
- The from-scratch versions show exactly what cross-validation does (no magic, just for-loops and index tracking), how each metric is computed (just counting TP/FP/TN/FN), and why stratification matters (prese...
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (the from-scratch versions show exactly what cross-validation does (no magic, just for-loops and index tracking), how each metri...).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (the from-scratch versions show exactly what cross-validation does (no magic, just for-loops and index tracking), how...).
- The library versions add parallelism, more scoring options, and integration with pipelines.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (the library versions add parallelism, more scoring options, and integration with pipelines).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (the library versions add parallelism, more scoring options, and integration with pipelines).

---
## Reference Absorption: Further Reading
- [scikit-learn Model Selection Guide](https://scikit-learn.org/stable/model_selection.html) - comprehensive reference on cross-validation, metrics, and hyperparameter tuning
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade ([scikit-learn model selection guide](https://scikit-learn.org/stable/model_selection.html) - comprehensive reference on cross-v...).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept ([scikit-learn model selection guide](https://scikit-learn.org/stable/model_selection.html) - comprehensive reference...).
- [Beyond Accuracy: Precision and Recall (Google ML Crash Course)](https://developers.google.com/machine-learning/crash-course/classification/precision-and-recall) - clear explanation with interactive examples
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade ([beyond accuracy: precision and recall (google ml crash course)](https://developers.google.com/machine-learning/crash-course/cl...).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept ([beyond accuracy: precision and recall (google ml crash course)](https://developers.google.com/machine-learning/crash...).
- [A Survey of Cross-Validation Procedures (Arlot & Celisse, 2010)](https://projecteuclid.org/journals/statistics-surveys/volume-4/issue-none/A-survey-of-cross-validation-procedures-for-model-selection/10.1214...
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade ([a survey of cross-validation procedures (arlot & celisse, 2010)](https://projecteuclid.org/journals/statistics-surveys/volume-...).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept ([a survey of cross-validation procedures (arlot & celisse, 2010)](https://projecteuclid.org/journals/statistics-surve...).

---
## Reference Absorption: Regression Metrics
- MSE (Mean Squared Error) = mean((y_true - y_pred)^2). Penalizes large errors quadratically. Sensitive to outliers.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (mse (mean squared error) = mean((y_true - y_pred)^2). penalizes large errors quadratically. sensitive to outliers).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (mse (mean squared error) = mean((y_true - y_pred)^2). penalizes large errors quadratically. sensitive to outliers).
- RMSE (Root Mean Squared Error) = sqrt(MSE). Same units as the target variable. Easier to interpret than MSE.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (rmse (root mean squared error) = sqrt(mse). same units as the target variable. easier to interpret than mse).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (rmse (root mean squared error) = sqrt(mse). same units as the target variable. easier to interpret than mse).
- R-squared = 1 - SS_res / SS_tot, where SS_res = sum((y_true - y_pred)^2) and SS_tot = sum((y_true - y_mean)^2). Fraction of variance explained by the model. R^2 = 1.0 is perfect. R^2 = 0.0 means the model is...
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (r-squared = 1 - ss_res / ss_tot, where ss_res = sum((y_true - y_pred)^2) and ss_tot = sum((y_true - y_mean)^2). fraction of var...).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (r-squared = 1 - ss_res / ss_tot, where ss_res = sum((y_true - y_pred)^2) and ss_tot = sum((y_true - y_mean)^2). fract...).

---
## Reference Absorption: Learning Objectives
- Implement K-fold and stratified K-fold cross-validation from scratch and explain why stratification matters for imbalanced data
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (implement k-fold and stratified k-fold cross-validation from scratch and explain why stratification matters for imbalanced data).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (implement k-fold and stratified k-fold cross-validation from scratch and explain why stratification matters for imbal...).
- Compute precision, recall, F1, AUC-ROC, and regression metrics (MSE, RMSE, MAE, R-squared) from scratch
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (compute precision, recall, f1, auc-roc, and regression metrics (mse, rmse, mae, r-squared) from scratch).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (compute precision, recall, f1, auc-roc, and regression metrics (mse, rmse, mae, r-squared) from scratch).
- Interpret learning curves to diagnose whether a model suffers from high bias or high variance
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (interpret learning curves to diagnose whether a model suffers from high bias or high variance).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (interpret learning curves to diagnose whether a model suffers from high bias or high variance).
- Identify common evaluation mistakes including data leakage, wrong metric selection, and test set contamination
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (identify common evaluation mistakes including data leakage, wrong metric selection, and test set contamination).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (identify common evaluation mistakes including data leakage, wrong metric selection, and test set contamination).

---
## Reference Absorption: Learning Curves
- Plot training and validation scores as a function of training set size:
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (plot training and validation scores as a function of training set size:).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (plot training and validation scores as a function of training set size:).
- High bias (underfitting): both curves converge to a low score. Adding more data will not help. You need a more complex model.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (high bias (underfitting): both curves converge to a low score. adding more data will not help. you need a more complex model).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (high bias (underfitting): both curves converge to a low score. adding more data will not help. you need a more comple...).
- High variance (overfitting): training score is high but validation score is much lower. The gap between them is large. Adding more data should help.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (high variance (overfitting): training score is high but validation score is much lower. the gap between them is large. adding m...).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (high variance (overfitting): training score is high but validation score is much lower. the gap between them is large...).

---
## Reference Absorption: Validation Curves
- Plot training and validation scores as a function of a hyperparameter:
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (plot training and validation scores as a function of a hyperparameter:).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (plot training and validation scores as a function of a hyperparameter:).
- At low complexity: both scores are low (underfitting)
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (at low complexity: both scores are low (underfitting)).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (at low complexity: both scores are low (underfitting)).
- At the right complexity: both scores are high and close together
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (at the right complexity: both scores are high and close together).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (at the right complexity: both scores are high and close together).
- At high complexity: training score stays high but validation score drops (overfitting)
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (at high complexity: training score stays high but validation score drops (overfitting)).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (at high complexity: training score stays high but validation score drops (overfitting)).

---
## Reference Absorption: Validation Curves (cont.)
- The optimal hyperparameter value is where the validation score peaks.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (the optimal hyperparameter value is where the validation score peaks).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (the optimal hyperparameter value is where the validation score peaks).

---
## Reference Absorption: Overview
- > A model is only as good as the way you measure it.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (> a model is only as good as the way you measure it).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (> a model is only as good as the way you measure it).

---
## Reference Absorption: Ship It
- outputs/skill-evaluation.md - a skill covering evaluation strategy for classification and regression models
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (outputs/skill-evaluation.md - a skill covering evaluation strategy for classification and regression models).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (outputs/skill-evaluation.md - a skill covering evaluation strategy for classification and regression models).

---
## Beyond Reference: Engineering Translation
- Core anchors for this module: train, model, pred, scores, print, true, self, fold.
- Convert each theoretical primitive into measurable training and inference behaviors.
- Define observability checkpoints for drift, calibration, and latency regressions.
- Tie assumptions to explicit data contracts and fallback policies.

---
## Beyond Reference: Advanced Layer 1
- Align metric choice with business utility curves and decision policies.
- Risk and governance extension: convert this into acceptance tests and rollback criteria (align metric choice with business utility curves and decision policies.).
- Design nested CV to avoid optimistic bias from hyperparameter feedback loops.
- Risk and governance extension: convert this into acceptance tests and rollback criteria (design nested cv to avoid optimistic bias from hyperparameter feedback loops.).
- Use confidence intervals for metric comparisons instead of single-point leaderboard gains.
- Risk and governance extension: convert this into acceptance tests and rollback criteria (use confidence intervals for metric comparisons instead of single-point leaderboard gains.).

---
## Beyond Reference: Detailed Deepening 1
- Derivation drill: formalize train from first principles, list assumptions, and prove where approximations hold.
- Failure analysis: document two production scenarios where model breaks and define quantitative mitigations.
- Experimental protocol: isolate pred via ablations, confidence intervals, and compute-normalized comparisons.
- Productionization pattern: expose scores through metrics, dashboards, and incident-response playbooks.
- Data-contract alignment: specify how upstream schema and quality constraints affect print.

---
## Beyond Reference: Detailed Deepening 2
- Optimization interaction: analyze how regularization, scaling, and search strategy alter true.
- Generalization lens: connect self to bias-variance behavior and OOD robustness.
- Validation checklist: define correctness, stability, and reproducibility checks for fold.
- Research bridge: compare classical treatment of test with modern practical adaptations.
- Scalability plan: benchmark data under larger datasets, tighter latency, and stricter memory limits.

---
## Beyond Reference: Detailed Deepening 3
- Derivation drill: formalize mean from first principles, list assumptions, and prove where approximations hold.
- Failure analysis: document two production scenarios where validation breaks and define quantitative mitigations.
- Experimental protocol: isolate random via ablations, confidence intervals, and compute-normalized comparisons.

<!-- DEPTH_EXPANSION_END -->
