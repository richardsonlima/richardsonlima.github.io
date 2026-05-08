---
layout: slides
title: "Handling Imbalanced Data"
category: "ai-engineering-course-step-02"
module_number: 17
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
## Module 17: Handling Imbalanced Data
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
- You build a fraud detection model.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (you build a fraud detection model).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (you build a fraud detection model).
- Then you realize it predicts "not fraud" for every single transaction.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (then you realize it predicts "not fraud" for every single transaction).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (then you realize it predicts "not fraud" for every single transaction).
- It is the rational thing to do when only 0.1% of transactions are fraudulent.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (it is the rational thing to do when only 0.1% of transactions are fraudulent).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (it is the rational thing to do when only 0.1% of transactions are fraudulent).
- The model learns that always guessing the majority class minimizes overall error.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (the model learns that always guessing the majority class minimizes overall error).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (the model learns that always guessing the majority class minimizes overall error).

---
## Reference Absorption: The Problem (cont.)
- It is technically correct and completely useless.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (it is technically correct and completely useless).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (it is technically correct and completely useless).
- This happens everywhere real classification matters.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (this happens everywhere real classification matters).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (this happens everywhere real classification matters).
- Disease diagnosis: 1% positive rate.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (disease diagnosis: 1% positive rate).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (disease diagnosis: 1% positive rate).
- Network intrusion: 0.01% attacks.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (network intrusion: 0.01% attacks).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (network intrusion: 0.01% attacks).

---
## Reference Absorption: The Problem Deep Continuation
- Manufacturing defects: 0.5% defective.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (manufacturing defects: 0.5% defective).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (manufacturing defects: 0.5% defective).
- Churn prediction: 5% churners.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (churn prediction: 5% churners).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (churn prediction: 5% churners).
- The more consequential the minority class, the rarer it tends to be.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (the more consequential the minority class, the rarer it tends to be).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (the more consequential the minority class, the rarer it tends to be).
- Accuracy fails because it treats all correct predictions equally.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (accuracy fails because it treats all correct predictions equally).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (accuracy fails because it treats all correct predictions equally).

---
## Reference Absorption: The Problem Deep Continuation
- Correctly labeling a legitimate transaction and correctly catching fraud both count as one point of accuracy.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (correctly labeling a legitimate transaction and correctly catching fraud both count as one point of accuracy).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (correctly labeling a legitimate transaction and correctly catching fraud both count as one point of accuracy).
- But catching fraud is the entire reason the model exists.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (but catching fraud is the entire reason the model exists).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (but catching fraud is the entire reason the model exists).
- We need metrics, techniques, and training strategies that force the model to pay attention to the rare but important class.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (we need metrics, techniques, and training strategies that force the model to pay attention to the rare but important class).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (we need metrics, techniques, and training strategies that force the model to pay attention to the rare but important...).

---
## Reference Absorption: Exercises
- Borderline-SMOTE: modify the SMOTE implementation to only generate synthetic samples for minority points that are near the decision boundary (those whose k-nearest neighbors include majority class samples).
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (borderline-smote: modify the smote implementation to only generate synthetic samples for minority points that are near the deci...).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (borderline-smote: modify the smote implementation to only generate synthetic samples for minority points that are nea...).
- Compare results with standard SMOTE on a dataset where classes overlap.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (compare results with standard smote on a dataset where classes overlap).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (compare results with standard smote on a dataset where classes overlap).
- Cost matrix optimization: implement cost-sensitive learning where the cost matrix is a parameter.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (cost matrix optimization: implement cost-sensitive learning where the cost matrix is a parameter).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (cost matrix optimization: implement cost-sensitive learning where the cost matrix is a parameter).
- Create a function that takes a cost matrix and returns optimal predictions that minimize expected cost.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (create a function that takes a cost matrix and returns optimal predictions that minimize expected cost).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (create a function that takes a cost matrix and returns optimal predictions that minimize expected cost).

---
## Reference Absorption: Exercises (cont.)
- Test with different cost ratios (1:10, 1:100, 1:1000) and plot how the precision-recall tradeoff changes.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (test with different cost ratios (1:10, 1:100, 1:1000) and plot how the precision-recall tradeoff changes).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (test with different cost ratios (1:10, 1:100, 1:1000) and plot how the precision-recall tradeoff changes).
- Threshold calibration: implement Platt scaling (fit a logistic regression on the model's raw outputs to produce calibrated probabilities).
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (threshold calibration: implement platt scaling (fit a logistic regression on the model's raw outputs to produce calibrated prob...).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (threshold calibration: implement platt scaling (fit a logistic regression on the model's raw outputs to produce calib...).
- Compare the precision-recall curve before and after calibration.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (compare the precision-recall curve before and after calibration).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (compare the precision-recall curve before and after calibration).
- Show that calibration does not change the ranking (AUC stays the same) but makes the probabilities more meaningful.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (show that calibration does not change the ranking (auc stays the same) but makes the probabilities more meaningful).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (show that calibration does not change the ranking (auc stays the same) but makes the probabilities more meaningful).

---
## Reference Absorption: Exercises Deep Continuation
- Ensemble with balanced bagging: train multiple models, each on a balanced bootstrap sample (all minority + random subset of majority).
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (ensemble with balanced bagging: train multiple models, each on a balanced bootstrap sample (all minority + random subset of maj...).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (ensemble with balanced bagging: train multiple models, each on a balanced bootstrap sample (all minority + random sub...).
- Compare this approach against a single model with SMOTE.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (compare this approach against a single model with smote).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (compare this approach against a single model with smote).
- Measure both performance and variance across runs.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (measure both performance and variance across runs).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (measure both performance and variance across runs).
- Imbalance ratio experiment: take a balanced dataset and progressively increase the imbalance ratio (50/50, 70/30, 90/10, 95/5, 99/1).
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (imbalance ratio experiment: take a balanced dataset and progressively increase the imbalance ratio (50/50, 70/30, 90/10, 95/5,...).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (imbalance ratio experiment: take a balanced dataset and progressively increase the imbalance ratio (50/50, 70/30, 90/...).

---
## Reference Absorption: Exercises Deep Continuation
- For each ratio, train with and without SMOTE.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (for each ratio, train with and without smote).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (for each ratio, train with and without smote).
- Plot F1 vs imbalance ratio for both approaches.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (plot f1 vs imbalance ratio for both approaches).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (plot f1 vs imbalance ratio for both approaches).
- At what ratio does SMOTE start making a meaningful difference?
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (at what ratio does smote start making a meaningful difference?).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (at what ratio does smote start making a meaningful difference?).

---
## Reference Absorption: Step 7: Compare all approaches
- The code file runs all of this in a single script and prints results.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (the code file runs all of this in a single script and prints results).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (the code file runs all of this in a single script and prints results).

---
## Reference Absorption: Better Metrics
- Of everything flagged as positive, how many actually are?
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (of everything flagged as positive, how many actually are?).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (of everything flagged as positive, how many actually are?).
- High precision means few false alarms.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (high precision means few false alarms).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (high precision means few false alarms).
- Of everything actually positive, how many did we catch?
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (of everything actually positive, how many did we catch?).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (of everything actually positive, how many did we catch?).
- High recall means few missed positives.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (high recall means few missed positives).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (high recall means few missed positives).

---
## Reference Absorption: Better Metrics (cont.)
- F1 Score = 2 * precision * recall / (precision + recall).
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (f1 score = 2 * precision * recall / (precision + recall)).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (f1 score = 2 * precision * recall / (precision + recall)).
- Penalizes extreme imbalance between precision and recall more than the arithmetic mean would.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (penalizes extreme imbalance between precision and recall more than the arithmetic mean would).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (penalizes extreme imbalance between precision and recall more than the arithmetic mean would).
- F-beta Score = (1 + beta^2) * precision * recall / (beta^2 * precision + recall).
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (f-beta score = (1 + beta^2) * precision * recall / (beta^2 * precision + recall)).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (f-beta score = (1 + beta^2) * precision * recall / (beta^2 * precision + recall)).
- When beta > 1, recall matters more.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (when beta > 1, recall matters more).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (when beta > 1, recall matters more).

---
## Reference Absorption: Better Metrics Deep Continuation
- When beta < 1, precision matters more.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (when beta < 1, precision matters more).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (when beta < 1, precision matters more).
- F2 is common in fraud detection (missing fraud is worse than a false alarm).
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (f2 is common in fraud detection (missing fraud is worse than a false alarm)).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (f2 is common in fraud detection (missing fraud is worse than a false alarm)).
- AUPRC (Area Under Precision-Recall Curve).
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (auprc (area under precision-recall curve)).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (auprc (area under precision-recall curve)).
- Like AUC-ROC but more informative for imbalanced data.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (like auc-roc but more informative for imbalanced data).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (like auc-roc but more informative for imbalanced data).

---
## Reference Absorption: Better Metrics Deep Continuation
- A random classifier has AUPRC equal to the positive class rate (not 0.5 like ROC).
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (a random classifier has auprc equal to the positive class rate (not 0.5 like roc)).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (a random classifier has auprc equal to the positive class rate (not 0.5 like roc)).
- This makes improvements easier to see.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (this makes improvements easier to see).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (this makes improvements easier to see).
- Matthews Correlation Coefficient = (TP * TN - FP * FN) / sqrt((TP+FP)(TP+FN)(TN+FP)(TN+FN)).
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (matthews correlation coefficient = (tp * tn - fp * fn) / sqrt((tp+fp)(tp+fn)(tn+fp)(tn+fn))).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (matthews correlation coefficient = (tp * tn - fp * fn) / sqrt((tp+fp)(tp+fn)(tn+fp)(tn+fn))).
- Only gives a high score when the model does well on both classes.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (only gives a high score when the model does well on both classes).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (only gives a high score when the model does well on both classes).

---
## Reference Absorption: Better Metrics Deep Continuation
- Balanced even when classes are very different sizes.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (balanced even when classes are very different sizes).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (balanced even when classes are very different sizes).
- For the "always predict negative" model above: precision = 0/0 (undefined, often set to 0), recall = 0/10 = 0, F1 = 0, MCC = 0.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (for the "always predict negative" model above: precision = 0/0 (undefined, often set to 0), recall = 0/10 = 0, f1 = 0, mcc = 0).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (for the "always predict negative" model above: precision = 0/0 (undefined, often set to 0), recall = 0/10 = 0, f1 = 0...).
- These metrics correctly identify the model as worthless.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (these metrics correctly identify the model as worthless).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (these metrics correctly identify the model as worthless).

---
## Reference Absorption: Use It
- With scikit-learn and imbalanced-learn, these techniques are one-liners:
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (with scikit-learn and imbalanced-learn, these techniques are one-liners:).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (with scikit-learn and imbalanced-learn, these techniques are one-liners:).
- The from-scratch implementations show exactly what each technique does.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (the from-scratch implementations show exactly what each technique does).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (the from-scratch implementations show exactly what each technique does).
- SMOTE is just k-NN interpolation on the minority class.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (smote is just k-nn interpolation on the minority class).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (smote is just k-nn interpolation on the minority class).
- Class weights multiply the loss.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (class weights multiply the loss).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (class weights multiply the loss).

---
## Reference Absorption: Use It (cont.)
- Threshold tuning is a for-loop over cutoffs.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (threshold tuning is a for-loop over cutoffs).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (threshold tuning is a for-loop over cutoffs).

---
## Reference Absorption: SMOTE: Synthetic Minority Oversampling Technique
- Random oversampling duplicates existing minority samples.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (random oversampling duplicates existing minority samples).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (random oversampling duplicates existing minority samples).
- This works but risks overfitting because the model sees identical points repeatedly.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (this works but risks overfitting because the model sees identical points repeatedly).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (this works but risks overfitting because the model sees identical points repeatedly).
- SMOTE creates new synthetic minority samples that are plausible but not copies.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (smote creates new synthetic minority samples that are plausible but not copies).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (smote creates new synthetic minority samples that are plausible but not copies).
- For each minority sample x, find its k nearest neighbors among other minority samples
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (for each minority sample x, find its k nearest neighbors among other minority samples).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (for each minority sample x, find its k nearest neighbors among other minority samples).

---
## Reference Absorption: SMOTE: Synthetic Minority Oversampling Technique (cont.)
- Create a new sample on the line segment between x and that neighbor
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (create a new sample on the line segment between x and that neighbor).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (create a new sample on the line segment between x and that neighbor).
- The formula: new_sample = x + random(0, 1) * (neighbor - x)
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (the formula: new_sample = x + random(0, 1) * (neighbor - x)).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (the formula: new_sample = x + random(0, 1) * (neighbor - x)).
- This interpolates between real minority points, creating samples in the same region of feature space without just copying existing data.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (this interpolates between real minority points, creating samples in the same region of feature space without just copying exist...).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (this interpolates between real minority points, creating samples in the same region of feature space without just cop...).

---
## Reference Absorption: Sampling Strategies Compared
- Random Oversampling: duplicate minority samples to match majority count.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (random oversampling: duplicate minority samples to match majority count).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (random oversampling: duplicate minority samples to match majority count).
- Pros: simple, no information loss
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (pros: simple, no information loss).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (pros: simple, no information loss).
- Cons: exact duplicates cause overfitting, increases training time
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (cons: exact duplicates cause overfitting, increases training time).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (cons: exact duplicates cause overfitting, increases training time).
- Random Undersampling: remove majority samples to match minority count.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (random undersampling: remove majority samples to match minority count).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (random undersampling: remove majority samples to match minority count).

---
## Reference Absorption: Sampling Strategies Compared (cont.)
- Cons: throws away potentially useful majority data, higher variance
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (cons: throws away potentially useful majority data, higher variance).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (cons: throws away potentially useful majority data, higher variance).
- SMOTE: create synthetic minority samples via interpolation.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (smote: create synthetic minority samples via interpolation).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (smote: create synthetic minority samples via interpolation).
- Pros: generates new data points, reduces overfitting compared to random oversampling
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (pros: generates new data points, reduces overfitting compared to random oversampling).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (pros: generates new data points, reduces overfitting compared to random oversampling).
- Cons: can create noisy samples near the decision boundary, does not account for majority class distribution
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (cons: can create noisy samples near the decision boundary, does not account for majority class distribution).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (cons: can create noisy samples near the decision boundary, does not account for majority class distribution).

---
## Reference Absorption: Threshold Tuning
- Most classifiers output a probability.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (most classifiers output a probability).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (most classifiers output a probability).
- The default threshold is 0.5: if P(positive) >= 0.5, predict positive.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (the default threshold is 0.5: if p(positive) >= 0.5, predict positive).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (the default threshold is 0.5: if p(positive) >= 0.5, predict positive).
- When classes are imbalanced, the optimal threshold is usually much lower.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (when classes are imbalanced, the optimal threshold is usually much lower).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (when classes are imbalanced, the optimal threshold is usually much lower).
- Get predicted probabilities on the validation set
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (get predicted probabilities on the validation set).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (get predicted probabilities on the validation set).

---
## Reference Absorption: Threshold Tuning (cont.)
- Sweep thresholds from 0.0 to 1.0
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (sweep thresholds from 0.0 to 1.0).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (sweep thresholds from 0.0 to 1.0).
- Compute F1 (or your chosen metric) at each threshold
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (compute f1 (or your chosen metric) at each threshold).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (compute f1 (or your chosen metric) at each threshold).
- Pick the threshold that maximizes your metric
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (pick the threshold that maximizes your metric).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (pick the threshold that maximizes your metric).
- A model might output P(fraud) = 0.15 for a fraudulent transaction.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (a model might output p(fraud) = 0.15 for a fraudulent transaction).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (a model might output p(fraud) = 0.15 for a fraudulent transaction).

---
## Reference Absorption: Threshold Tuning Deep Continuation
- At threshold 0.5, this is classified as not fraud.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (at threshold 0.5, this is classified as not fraud).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (at threshold 0.5, this is classified as not fraud).
- At threshold 0.10, it is correctly caught.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (at threshold 0.10, it is correctly caught).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (at threshold 0.10, it is correctly caught).
- The probability calibration matters less than the ranking -- as long as fraud gets higher probabilities than non-fraud, there exists a threshold that separates them.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (the probability calibration matters less than the ranking -- as long as fraud gets higher probabilities than non-fraud, there e...).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (the probability calibration matters less than the ranking -- as long as fraud gets higher probabilities than non-frau...).

---
## Reference Absorption: Class Weights
- Instead of changing the data, change how the model treats errors.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (instead of changing the data, change how the model treats errors).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (instead of changing the data, change how the model treats errors).
- Assign higher weight to misclassifying the minority class.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (assign higher weight to misclassifying the minority class).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (assign higher weight to misclassifying the minority class).
- For a binary problem with 950 negative and 50 positive samples:
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (for a binary problem with 950 negative and 50 positive samples:).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (for a binary problem with 950 negative and 50 positive samples:).
- Weight for negative class = n_samples / (2 * n_negative) = 1000 / (2 * 950) = 0.526
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (weight for negative class = n_samples / (2 * n_negative) = 1000 / (2 * 950) = 0.526).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (weight for negative class = n_samples / (2 * n_negative) = 1000 / (2 * 950) = 0.526).

---
## Reference Absorption: Class Weights (cont.)
- Weight for positive class = n_samples / (2 * n_positive) = 1000 / (2 * 50) = 10.0
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (weight for positive class = n_samples / (2 * n_positive) = 1000 / (2 * 50) = 10.0).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (weight for positive class = n_samples / (2 * n_positive) = 1000 / (2 * 50) = 10.0).
- The positive class gets 19x the weight.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (the positive class gets 19x the weight).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (the positive class gets 19x the weight).
- Misclassifying one positive sample costs as much as misclassifying 19 negative samples.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (misclassifying one positive sample costs as much as misclassifying 19 negative samples).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (misclassifying one positive sample costs as much as misclassifying 19 negative samples).
- The model is forced to pay attention to the minority class.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (the model is forced to pay attention to the minority class).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (the model is forced to pay attention to the minority class).

---
## Reference Absorption: Class Weights Deep Continuation
- In logistic regression, this modifies the loss function:
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (in logistic regression, this modifies the loss function:).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (in logistic regression, this modifies the loss function:).
- where w_i depends on the class of sample i.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (where w_i depends on the class of sample i).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (where w_i depends on the class of sample i).
- Class weights are mathematically equivalent to oversampling in expectation, but without creating new data points.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (class weights are mathematically equivalent to oversampling in expectation, but without creating new data points).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (class weights are mathematically equivalent to oversampling in expectation, but without creating new data points).
- This makes them faster and avoids the overfitting risk of duplicated samples.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (this makes them faster and avoids the overfitting risk of duplicated samples).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (this makes them faster and avoids the overfitting risk of duplicated samples).

---
## Reference Absorption: Further Reading
- [SMOTE: Synthetic Minority Over-sampling Technique (Chawla et al., 2002)](https://arxiv.org/abs/1106.1813) -- the original SMOTE paper, still the most cited work on imbalanced learning
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade ([smote: synthetic minority over-sampling technique (chawla et al., 2002)](https://arxiv.org/abs/1106.1813) -- the original smot...).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept ([smote: synthetic minority over-sampling technique (chawla et al., 2002)](https://arxiv.org/abs/1106.1813) -- the ori...).
- [Learning from Imbalanced Data (He & Garcia, 2009)](https://ieeexplore.ieee.org/document/5128907) -- comprehensive survey covering sampling, cost-sensitive, and algorithmic approaches
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade ([learning from imbalanced data (he & garcia, 2009)](https://ieeexplore.ieee.org/document/5128907) -- comprehensive survey cover...).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept ([learning from imbalanced data (he & garcia, 2009)](https://ieeexplore.ieee.org/document/5128907) -- comprehensive su...).
- [imbalanced-learn documentation](https://imbalanced-learn.org/stable/) -- Python library with SMOTE variants, undersampling strategies, and pipeline integration
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade ([imbalanced-learn documentation](https://imbalanced-learn.org/stable/) -- python library with smote variants, undersampling str...).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept ([imbalanced-learn documentation](https://imbalanced-learn.org/stable/) -- python library with smote variants, undersa...).
- [The Precision-Recall Plot Is More Informative than the ROC Plot (Saito & Rehmsmeier, 2015)](https://journals.plos.org/plosone/article?id=10.1371/journal.pone.0118432) -- when and why to prefer PR curves ove...
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade ([the precision-recall plot is more informative than the roc plot (saito & rehmsmeier, 2015)](https://journals.plos.org/plosone/...).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept ([the precision-recall plot is more informative than the roc plot (saito & rehmsmeier, 2015)](https://journals.plos.or...).

---
## Reference Absorption: Cost-Sensitive Learning
- Generalization of class weights.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (generalization of class weights).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (generalization of class weights).
- Instead of uniform costs, assign specific misclassification costs:
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (instead of uniform costs, assign specific misclassification costs:).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (instead of uniform costs, assign specific misclassification costs:).
- Missing a fraudulent transaction (FN) costs 100x more than a false alarm (FP).
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (missing a fraudulent transaction (fn) costs 100x more than a false alarm (fp)).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (missing a fraudulent transaction (fn) costs 100x more than a false alarm (fp)).
- The model optimizes for total cost, not total error count.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (the model optimizes for total cost, not total error count).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (the model optimizes for total cost, not total error count).

---
## Reference Absorption: Cost-Sensitive Learning (cont.)
- This is the most principled approach when you can estimate real-world costs.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (this is the most principled approach when you can estimate real-world costs).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (this is the most principled approach when you can estimate real-world costs).
- A missed cancer diagnosis has a very different cost than a false alarm that leads to an extra biopsy.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (a missed cancer diagnosis has a very different cost than a false alarm that leads to an extra biopsy).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (a missed cancer diagnosis has a very different cost than a false alarm that leads to an extra biopsy).
- Making these costs explicit forces the right tradeoffs.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (making these costs explicit forces the right tradeoffs).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (making these costs explicit forces the right tradeoffs).

---
## Beyond Reference: Engineering Translation
- Core anchors for this module: smote, minority, class, model, threshold, train, samples, precision.
- Convert each theoretical primitive into measurable training and inference behaviors.
- Define observability checkpoints for drift, calibration, and latency regressions.
- Tie assumptions to explicit data contracts and fallback policies.

---
## Beyond Reference: Advanced Layer 1
- Optimize precision-recall tradeoff with threshold curves, not static defaults.
- Risk and governance extension: convert this into acceptance tests and rollback criteria (optimize precision-recall tradeoff with threshold curves, not static defaults.).
- Combine class weighting, SMOTE variants, and calibration under strict CV boundaries.
- Risk and governance extension: convert this into acceptance tests and rollback criteria (combine class weighting, smote variants, and calibration under strict cv boundaries.).
- Use MCC and AUPRC as primary metrics for extreme imbalance scenarios.
- Risk and governance extension: convert this into acceptance tests and rollback criteria (use mcc and auprc as primary metrics for extreme imbalance scenarios.).

<!-- DEPTH_EXPANSION_END -->
