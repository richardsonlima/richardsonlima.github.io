---
layout: slides
title: "What Is Machine Learning"
category: "ai-engineering-course-step-02"
module_number: 1
complexity: "Learn"
lesson_type: "Learn"
lang_stack: "🐍"
use_math: true
---

layout: true
class: basic-layout
---

class: center, middle, inverse-slide
# Step 02 - ML Fundamentals
## Module 01: What Is Machine Learning
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
- You want to build a spam filter.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (you want to build a spam filter).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (you want to build a spam filter).
- The traditional approach: sit down and write hundreds of rules.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (the traditional approach: sit down and write hundreds of rules).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (the traditional approach: sit down and write hundreds of rules).
- "If the email contains 'FREE MONEY', mark it spam.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade ("if the email contains 'free money', mark it spam).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept ("if the email contains 'free money', mark it spam).
- If it has more than 3 exclamation marks, mark it spam." You spend weeks writing rules.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (if it has more than 3 exclamation marks, mark it spam." you spend weeks writing rules).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (if it has more than 3 exclamation marks, mark it spam." you spend weeks writing rules).

---
## Reference Absorption: The Problem (cont.)
- Then spammers change their wording.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (then spammers change their wording).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (then spammers change their wording).
- Machine learning flips this.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (machine learning flips this).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (machine learning flips this).
- Instead of writing rules, you give the computer thousands of labeled emails ("spam" or "not spam") and let it figure out the rules on its own.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (instead of writing rules, you give the computer thousands of labeled emails ("spam" or "not spam") and let it figure out the ru...).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (instead of writing rules, you give the computer thousands of labeled emails ("spam" or "not spam") and let it figure...).
- The computer finds patterns you never would have thought of.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (the computer finds patterns you never would have thought of).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (the computer finds patterns you never would have thought of).

---
## Reference Absorption: The Problem Deep Continuation
- When spammers change tactics, you retrain on new data instead of rewriting code.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (when spammers change tactics, you retrain on new data instead of rewriting code).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (when spammers change tactics, you retrain on new data instead of rewriting code).
- This shift from "programming rules" to "learning from data" is the core of machine learning.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (this shift from "programming rules" to "learning from data" is the core of machine learning).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (this shift from "programming rules" to "learning from data" is the core of machine learning).
- Every recommendation engine, voice assistant, self-driving car, and language model works this way.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (every recommendation engine, voice assistant, self-driving car, and language model works this way).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (every recommendation engine, voice assistant, self-driving car, and language model works this way).

---
## Reference Absorption: Exercises
- Take any dataset (e.g., Iris, Titanic).
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (take any dataset (e.g., iris, titanic)).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (take any dataset (e.g., iris, titanic)).
- Split it 70/15/15 into train/validation/test.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (split it 70/15/15 into train/validation/test).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (split it 70/15/15 into train/validation/test).
- Explain why you should not tune hyperparameters on the test set.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (explain why you should not tune hyperparameters on the test set).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (explain why you should not tune hyperparameters on the test set).
- List three real-world problems.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (list three real-world problems).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (list three real-world problems).

---
## Reference Absorption: Exercises (cont.)
- For each one, identify whether it is classification, regression, or clustering, and whether it is supervised or unsupervised.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (for each one, identify whether it is classification, regression, or clustering, and whether it is supervised or unsupervised).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (for each one, identify whether it is classification, regression, or clustering, and whether it is supervised or unsup...).
- A model gets 99% accuracy on training data but 60% on test data.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (a model gets 99% accuracy on training data but 60% on test data).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (a model gets 99% accuracy on training data but 60% on test data).
- Diagnose the problem and list three things you would try to fix it.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (diagnose the problem and list three things you would try to fix it).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (diagnose the problem and list three things you would try to fix it).

---
## Reference Absorption: When NOT to Use Machine Learning
- ML is powerful but not always the right tool.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (ml is powerful but not always the right tool).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (ml is powerful but not always the right tool).
- Before reaching for a model, ask whether you actually need one.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (before reaching for a model, ask whether you actually need one).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (before reaching for a model, ask whether you actually need one).
- Rules are simple and well-defined. Tax calculation, sorting algorithms, unit conversions. If you can write the logic in a few if-statements, a model adds complexity for no benefit.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (rules are simple and well-defined. tax calculation, sorting algorithms, unit conversions. if you can write the logic in a few i...).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (rules are simple and well-defined. tax calculation, sorting algorithms, unit conversions. if you can write the logic...).
- You have no data or very little data. ML needs examples to learn from. With 10 data points, you cannot train anything meaningful. Collect data first.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (you have no data or very little data. ml needs examples to learn from. with 10 data points, you cannot train anything meaningfu...).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (you have no data or very little data. ml needs examples to learn from. with 10 data points, you cannot train anything...).

---
## Reference Absorption: When NOT to Use Machine Learning (cont.)
- The cost of being wrong is catastrophic and you need guaranteed correctness. Medical dosage calculation, nuclear reactor control, cryptographic verification. ML models are probabilistic. They will sometimes...
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (the cost of being wrong is catastrophic and you need guaranteed correctness. medical dosage calculation, nuclear reactor contro...).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (the cost of being wrong is catastrophic and you need guaranteed correctness. medical dosage calculation, nuclear reac...).
- A lookup table or heuristic solves the problem. If a simple threshold or table covers 99% of cases, adding ML increases maintenance cost without meaningful improvement.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (a lookup table or heuristic solves the problem. if a simple threshold or table covers 99% of cases, adding ml increases mainten...).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (a lookup table or heuristic solves the problem. if a simple threshold or table covers 99% of cases, adding ml increas...).
- You cannot explain the decision and explainability is required. Regulated industries (lending, insurance, criminal justice) sometimes require that every decision be fully explainable. Some ML models are inte...
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (you cannot explain the decision and explainability is required. regulated industries (lending, insurance, criminal justice) som...).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (you cannot explain the decision and explainability is required. regulated industries (lending, insurance, criminal ju...).
- The problem changes faster than you can retrain. If the rules change daily and retraining takes a week, the model is always stale.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (the problem changes faster than you can retrain. if the rules change daily and retraining takes a week, the model is always stale).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (the problem changes faster than you can retrain. if the rules change daily and retraining takes a week, the model is...).

---
## Reference Absorption: When NOT to Use Machine Learning Deep Continuation
- Use this decision flowchart:
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (use this decision flowchart:).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (use this decision flowchart:).

---
## Reference Absorption: Beyond the Big Three
- The three categories above are clean, but real-world ML often blurs the lines.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (the three categories above are clean, but real-world ml often blurs the lines).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (the three categories above are clean, but real-world ml often blurs the lines).
- Semi-supervised learning uses a small set of labeled data and a large set of unlabeled data.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (semi-supervised learning uses a small set of labeled data and a large set of unlabeled data).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (semi-supervised learning uses a small set of labeled data and a large set of unlabeled data).
- You might have 100 labeled medical images and 100,000 unlabeled ones.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (you might have 100 labeled medical images and 100,000 unlabeled ones).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (you might have 100 labeled medical images and 100,000 unlabeled ones).
- Label propagation: Build a graph connecting similar data points. Labels spread from labeled nodes to unlabeled neighbors through the graph.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (label propagation: build a graph connecting similar data points. labels spread from labeled nodes to unlabeled neighbors throug...).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (label propagation: build a graph connecting similar data points. labels spread from labeled nodes to unlabeled neighb...).

---
## Reference Absorption: Beyond the Big Three (cont.)
- Pseudo-labeling: Train a model on the labeled data, use it to predict labels for unlabeled data, then retrain on everything. The model bootstraps its own training set.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (pseudo-labeling: train a model on the labeled data, use it to predict labels for unlabeled data, then retrain on everything. th...).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (pseudo-labeling: train a model on the labeled data, use it to predict labels for unlabeled data, then retrain on ever...).
- Consistency regularization: The model should give the same prediction for an input and a slightly perturbed version of that input. This works even without labels.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (consistency regularization: the model should give the same prediction for an input and a slightly perturbed version of that inp...).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (consistency regularization: the model should give the same prediction for an input and a slightly perturbed version o...).
- Self-supervised learning creates supervision from the data itself.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (self-supervised learning creates supervision from the data itself).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (self-supervised learning creates supervision from the data itself).
- No human labels needed at all.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (no human labels needed at all).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (no human labels needed at all).

---
## Reference Absorption: Beyond the Big Three Deep Continuation
- The model creates its own prediction task from the structure of the data.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (the model creates its own prediction task from the structure of the data).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (the model creates its own prediction task from the structure of the data).
- Masked language modeling (BERT): Hide 15% of words in a sentence, train the model to predict the missing words. The "labels" come from the original text.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (masked language modeling (bert): hide 15% of words in a sentence, train the model to predict the missing words. the "labels" co...).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (masked language modeling (bert): hide 15% of words in a sentence, train the model to predict the missing words. the "...).
- Contrastive learning (SimCLR): Take an image, create two augmented versions. Train the model to recognize they came from the same image while distinguishing them from augmented versions of other images.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (contrastive learning (simclr): take an image, create two augmented versions. train the model to recognize they came from the sa...).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (contrastive learning (simclr): take an image, create two augmented versions. train the model to recognize they came f...).
- Next-token prediction (GPT): Predict the next word given all previous words. Every text document becomes a training example.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (next-token prediction (gpt): predict the next word given all previous words. every text document becomes a training example).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (next-token prediction (gpt): predict the next word given all previous words. every text document becomes a training e...).

---
## Reference Absorption: Beyond the Big Three Deep Continuation
- These are not separate categories from the big three.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (these are not separate categories from the big three).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (these are not separate categories from the big three).
- They are strategies that combine supervised and unsupervised ideas.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (they are strategies that combine supervised and unsupervised ideas).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (they are strategies that combine supervised and unsupervised ideas).
- Self-supervised learning is technically supervised (the model predicts something), but the labels are generated automatically, not by humans.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (self-supervised learning is technically supervised (the model predicts something), but the labels are generated automatically,...).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (self-supervised learning is technically supervised (the model predicts something), but the labels are generated autom...).

---
## Reference Absorption: Overfitting vs Underfitting
- Underfitting: The model is too simple to capture the patterns in the data.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (underfitting: the model is too simple to capture the patterns in the data).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (underfitting: the model is too simple to capture the patterns in the data).
- A straight line trying to fit a curved relationship.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (a straight line trying to fit a curved relationship).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (a straight line trying to fit a curved relationship).
- Overfitting: The model is too complex and memorizes the training data, including its noise.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (overfitting: the model is too complex and memorizes the training data, including its noise).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (overfitting: the model is too complex and memorizes the training data, including its noise).
- A wiggly curve that passes through every training point but fails on new data.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (a wiggly curve that passes through every training point but fails on new data).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (a wiggly curve that passes through every training point but fails on new data).

---
## Reference Absorption: Overfitting vs Underfitting (cont.)
- Good fit: The model captures real patterns without memorizing noise.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (good fit: the model captures real patterns without memorizing noise).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (good fit: the model captures real patterns without memorizing noise).
- Training error and test error are both reasonably low.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (training error and test error are both reasonably low).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (training error and test error are both reasonably low).
- Training accuracy is much higher than validation accuracy
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (training accuracy is much higher than validation accuracy).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (training accuracy is much higher than validation accuracy).
- The model performs well on training data but poorly on new data
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (the model performs well on training data but poorly on new data).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (the model performs well on training data but poorly on new data).

---
## Reference Absorption: Overfitting vs Underfitting Deep Continuation
- Adding more training data improves performance (the model was memorizing, not learning)
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (adding more training data improves performance (the model was memorizing, not learning)).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (adding more training data improves performance (the model was memorizing, not learning)).
- Reduce model complexity (fewer parameters, simpler architecture)
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (reduce model complexity (fewer parameters, simpler architecture)).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (reduce model complexity (fewer parameters, simpler architecture)).
- Regularization (add a penalty for large weights)
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (regularization (add a penalty for large weights)).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (regularization (add a penalty for large weights)).
- Dropout (randomly zero out neurons during training)
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (dropout (randomly zero out neurons during training)).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (dropout (randomly zero out neurons during training)).

---
## Reference Absorption: Overfitting vs Underfitting Deep Continuation
- Early stopping (stop training when validation error starts increasing)
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (early stopping (stop training when validation error starts increasing)).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (early stopping (stop training when validation error starts increasing)).

---
## Reference Absorption: The ML Workflow
- Every machine learning project follows the same pipeline, regardless of the algorithm.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (every machine learning project follows the same pipeline, regardless of the algorithm).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (every machine learning project follows the same pipeline, regardless of the algorithm).
- Collect Data: Gather raw data.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (collect data: gather raw data).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (collect data: gather raw data).
- More data is almost always better, but quality matters more than quantity.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (more data is almost always better, but quality matters more than quantity).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (more data is almost always better, but quality matters more than quantity).
- Clean & Explore: Handle missing values, remove duplicates, visualize distributions, spot anomalies.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (clean & explore: handle missing values, remove duplicates, visualize distributions, spot anomalies).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (clean & explore: handle missing values, remove duplicates, visualize distributions, spot anomalies).

---
## Reference Absorption: The ML Workflow (cont.)
- This step often takes 60-80% of total project time.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (this step often takes 60-80% of total project time).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (this step often takes 60-80% of total project time).
- Feature Engineering: Transform raw data into features the model can use.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (feature engineering: transform raw data into features the model can use).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (feature engineering: transform raw data into features the model can use).
- Turn dates into day-of-week.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (turn dates into day-of-week).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (turn dates into day-of-week).
- Normalize numerical columns.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (normalize numerical columns).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (normalize numerical columns).

---
## Reference Absorption: The ML Workflow Deep Continuation
- Encode categorical variables.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (encode categorical variables).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (encode categorical variables).
- Good features matter more than fancy algorithms.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (good features matter more than fancy algorithms).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (good features matter more than fancy algorithms).
- Split Data: Divide into training, validation, and test sets.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (split data: divide into training, validation, and test sets).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (split data: divide into training, validation, and test sets).
- The model trains on training data, you tune hyperparameters on validation data, and you report final performance on test data.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (the model trains on training data, you tune hyperparameters on validation data, and you report final performance on test data).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (the model trains on training data, you tune hyperparameters on validation data, and you report final performance on t...).

---
## Reference Absorption: The ML Workflow Deep Continuation
- Train Model: Feed training data into an algorithm.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (train model: feed training data into an algorithm).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (train model: feed training data into an algorithm).
- The algorithm adjusts internal parameters to minimize a loss function.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (the algorithm adjusts internal parameters to minimize a loss function).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (the algorithm adjusts internal parameters to minimize a loss function).
- Evaluate: Measure performance on validation/test data.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (evaluate: measure performance on validation/test data).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (evaluate: measure performance on validation/test data).
- If performance is not acceptable, go back and try different features, algorithms, or hyperparameters.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (if performance is not acceptable, go back and try different features, algorithms, or hyperparameters).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (if performance is not acceptable, go back and try different features, algorithms, or hyperparameters).

---
## Reference Absorption: The ML Workflow Deep Continuation
- Deploy: Put the model into production where it makes predictions on new data.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (deploy: put the model into production where it makes predictions on new data).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (deploy: put the model into production where it makes predictions on new data).
- Monitor: Track performance over time.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (monitor: track performance over time).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (monitor: track performance over time).
- Data distributions change (data drift), and models degrade.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (data distributions change (data drift), and models degrade).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (data distributions change (data drift), and models degrade).
- When performance drops, retrain.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (when performance drops, retrain).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (when performance drops, retrain).

---
## Reference Absorption: The Three Types of Machine Learning
- Supervised Learning: You have input-output pairs.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (supervised learning: you have input-output pairs).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (supervised learning: you have input-output pairs).
- The model learns to map inputs to outputs.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (the model learns to map inputs to outputs).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (the model learns to map inputs to outputs).
- "Here are 10,000 photos labeled cat or dog. Learn to tell them apart."
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade ("here are 10,000 photos labeled cat or dog. learn to tell them apart.").
- Operational risk check: define an alert, threshold, and rollback action tied to this concept ("here are 10,000 photos labeled cat or dog. learn to tell them apart.").
- "Here are house features and prices. Learn to predict the price."
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade ("here are house features and prices. learn to predict the price.").
- Operational risk check: define an alert, threshold, and rollback action tied to this concept ("here are house features and prices. learn to predict the price.").

---
## Reference Absorption: The Three Types of Machine Learning (cont.)
- Unsupervised Learning: You have inputs only.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (unsupervised learning: you have inputs only).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (unsupervised learning: you have inputs only).
- The model finds structure on its own.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (the model finds structure on its own).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (the model finds structure on its own).
- "Here are 10,000 customer purchase histories. Find natural groupings."
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade ("here are 10,000 customer purchase histories. find natural groupings.").
- Operational risk check: define an alert, threshold, and rollback action tied to this concept ("here are 10,000 customer purchase histories. find natural groupings.").
- "Here are 1,000 dimensional data points. Reduce to 2 dimensions while keeping structure."
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade ("here are 1,000 dimensional data points. reduce to 2 dimensions while keeping structure.").
- Operational risk check: define an alert, threshold, and rollback action tied to this concept ("here are 1,000 dimensional data points. reduce to 2 dimensions while keeping structure.").

---
## Reference Absorption: The Three Types of Machine Learning Deep Continuation
- Reinforcement Learning: An agent takes actions in an environment and receives rewards or penalties.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (reinforcement learning: an agent takes actions in an environment and receives rewards or penalties).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (reinforcement learning: an agent takes actions in an environment and receives rewards or penalties).
- It learns a strategy (policy) to maximize total reward.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (it learns a strategy (policy) to maximize total reward).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (it learns a strategy (policy) to maximize total reward).
- "Play this game. +1 for winning, -1 for losing. Figure out a strategy."
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade ("play this game. +1 for winning, -1 for losing. figure out a strategy.").
- Operational risk check: define an alert, threshold, and rollback action tied to this concept ("play this game. +1 for winning, -1 for losing. figure out a strategy.").
- "Control this robot arm. +1 for picking up the object, -0.01 for each second wasted."
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade ("control this robot arm. +1 for picking up the object, -0.01 for each second wasted.").
- Operational risk check: define an alert, threshold, and rollback action tied to this concept ("control this robot arm. +1 for picking up the object, -0.01 for each second wasted.").

---
## Reference Absorption: The Three Types of Machine Learning Deep Continuation
- Most of what you will build in practice uses supervised learning.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (most of what you will build in practice uses supervised learning).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (most of what you will build in practice uses supervised learning).
- Unsupervised learning is common for preprocessing and exploration.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (unsupervised learning is common for preprocessing and exploration).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (unsupervised learning is common for preprocessing and exploration).
- Reinforcement learning powers game AI, robotics, and RLHF for language models.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (reinforcement learning powers game ai, robotics, and rlhf for language models).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (reinforcement learning powers game ai, robotics, and rlhf for language models).

---
## Reference Absorption: Training, Validation, and Test Splits
- This is the most important concept beginners get wrong.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (this is the most important concept beginners get wrong).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (this is the most important concept beginners get wrong).
- You must evaluate your model on data it has never seen during training.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (you must evaluate your model on data it has never seen during training).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (you must evaluate your model on data it has never seen during training).
- Otherwise you are measuring memorization, not learning.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (otherwise you are measuring memorization, not learning).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (otherwise you are measuring memorization, not learning).
- You look at it exactly once.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (you look at it exactly once).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (you look at it exactly once).

---
## Reference Absorption: Training, Validation, and Test Splits (cont.)
- If you keep adjusting your model based on test performance, you are effectively training on the test set and your reported numbers are meaningless.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (if you keep adjusting your model based on test performance, you are effectively training on the test set and your reported numb...).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (if you keep adjusting your model based on test performance, you are effectively training on the test set and your rep...).
- For small datasets, use k-fold cross-validation: split data into k parts, train on k-1 parts, validate on the remaining part, rotate, and average results.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (for small datasets, use k-fold cross-validation: split data into k parts, train on k-1 parts, validate on the remaining part, r...).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (for small datasets, use k-fold cross-validation: split data into k parts, train on k-1 parts, validate on the remaini...).

---
## Reference Absorption: The Bias-Variance Tradeoff
- This is the mathematical framework behind overfitting and underfitting.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (this is the mathematical framework behind overfitting and underfitting).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (this is the mathematical framework behind overfitting and underfitting).
- Bias: Error from wrong assumptions in the model.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (bias: error from wrong assumptions in the model).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (bias: error from wrong assumptions in the model).
- A linear model has high bias when the true relationship is nonlinear.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (a linear model has high bias when the true relationship is nonlinear).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (a linear model has high bias when the true relationship is nonlinear).
- High bias leads to underfitting.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (high bias leads to underfitting).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (high bias leads to underfitting).

---
## Reference Absorption: The Bias-Variance Tradeoff (cont.)
- Variance: Error from sensitivity to small fluctuations in the training data.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (variance: error from sensitivity to small fluctuations in the training data).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (variance: error from sensitivity to small fluctuations in the training data).
- A model with high variance gives very different predictions when trained on different subsets of data.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (a model with high variance gives very different predictions when trained on different subsets of data).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (a model with high variance gives very different predictions when trained on different subsets of data).
- High variance leads to overfitting.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (high variance leads to overfitting).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (high variance leads to overfitting).
- Total error = Bias^2 + Variance + Irreducible noise
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (total error = bias^2 + variance + irreducible noise).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (total error = bias^2 + variance + irreducible noise).

---
## Reference Absorption: The Bias-Variance Tradeoff Deep Continuation
- You cannot reduce irreducible noise (it is randomness in the data itself).
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (you cannot reduce irreducible noise (it is randomness in the data itself)).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (you cannot reduce irreducible noise (it is randomness in the data itself)).
- You want to find the sweet spot where bias^2 + variance is minimized.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (you want to find the sweet spot where bias^2 + variance is minimized).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (you want to find the sweet spot where bias^2 + variance is minimized).

---
## Reference Absorption: Learning From Data, Not Rules
- Traditional programming and machine learning solve problems in opposite directions.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (traditional programming and machine learning solve problems in opposite directions).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (traditional programming and machine learning solve problems in opposite directions).
- Traditional programming: you write the rules.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (traditional programming: you write the rules).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (traditional programming: you write the rules).
- The program applies them to data to produce output.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (the program applies them to data to produce output).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (the program applies them to data to produce output).
- Machine learning: you provide data and expected outputs.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (machine learning: you provide data and expected outputs).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (machine learning: you provide data and expected outputs).

---
## Reference Absorption: Learning From Data, Not Rules (cont.)
- The algorithm discovers the rules.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (the algorithm discovers the rules).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (the algorithm discovers the rules).
- The "model" that comes out of training IS the rules, encoded as numbers (weights, parameters).
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (the "model" that comes out of training is the rules, encoded as numbers (weights, parameters)).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (the "model" that comes out of training is the rules, encoded as numbers (weights, parameters)).
- It generalizes from examples it has seen to make predictions on data it has never seen.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (it generalizes from examples it has seen to make predictions on data it has never seen).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (it generalizes from examples it has seen to make predictions on data it has never seen).

---
## Reference Absorption: Step 1: Nearest Centroid Classifier from Scratch
- The nearest centroid classifier computes the center (mean) of each class in the training data.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (the nearest centroid classifier computes the center (mean) of each class in the training data).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (the nearest centroid classifier computes the center (mean) of each class in the training data).
- To predict, it assigns each new point to the class whose center is closest.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (to predict, it assigns each new point to the class whose center is closest).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (to predict, it assigns each new point to the class whose center is closest).
- That is the entire algorithm.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (that is the entire algorithm).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (that is the entire algorithm).
- No gradient descent, no iteration, no hyperparameters.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (no gradient descent, no iteration, no hyperparameters).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (no gradient descent, no iteration, no hyperparameters).

---
## Reference Absorption: Classification vs Regression
- These are the two main supervised learning tasks.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (these are the two main supervised learning tasks).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (these are the two main supervised learning tasks).
- Classification answers "which category?" Regression answers "how much?"
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (classification answers "which category?" regression answers "how much?").
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (classification answers "which category?" regression answers "how much?").
- Some problems can be framed either way.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (some problems can be framed either way).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (some problems can be framed either way).
- Predicting if a stock goes up or down is classification.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (predicting if a stock goes up or down is classification).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (predicting if a stock goes up or down is classification).

---
## Reference Absorption: Classification vs Regression (cont.)
- Predicting the exact price is regression.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (predicting the exact price is regression).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (predicting the exact price is regression).

---
## Reference Absorption: Step 4: What the Centroid Classifier Cannot Do
- The nearest centroid classifier assumes each class forms a single blob.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (the nearest centroid classifier assumes each class forms a single blob).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (the nearest centroid classifier assumes each class forms a single blob).
- It draws linear decision boundaries.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (it draws linear decision boundaries).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (it draws linear decision boundaries).
- Classes have multiple clusters (e.g., the digit "1" can be written in several different ways)
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (classes have multiple clusters (e.g., the digit "1" can be written in several different ways)).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (classes have multiple clusters (e.g., the digit "1" can be written in several different ways)).
- The decision boundary is nonlinear (e.g., one class wraps around another)
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (the decision boundary is nonlinear (e.g., one class wraps around another)).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (the decision boundary is nonlinear (e.g., one class wraps around another)).

---
## Reference Absorption: Step 4: What the Centroid Classifier Cannot Do (cont.)
- Features have very different scales (distance is dominated by the largest-scale feature)
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (features have very different scales (distance is dominated by the largest-scale feature)).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (features have very different scales (distance is dominated by the largest-scale feature)).
- These limitations motivate every other algorithm you will learn.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (these limitations motivate every other algorithm you will learn).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (these limitations motivate every other algorithm you will learn).
- K-nearest neighbors handles multiple clusters.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (k-nearest neighbors handles multiple clusters).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (k-nearest neighbors handles multiple clusters).
- Decision trees handle nonlinear boundaries.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (decision trees handle nonlinear boundaries).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (decision trees handle nonlinear boundaries).

---
## Reference Absorption: Step 4: What the Centroid Classifier Cannot Do Deep Continuation
- Feature scaling fixes the scale problem.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (feature scaling fixes the scale problem).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (feature scaling fixes the scale problem).
- Each lesson builds on the limitations of the previous one.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (each lesson builds on the limitations of the previous one).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (each lesson builds on the limitations of the previous one).

---
## Reference Absorption: Use It
- sklearn provides NearestCentroid and synthetic data generators:
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (sklearn provides nearestcentroid and synthetic data generators:).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (sklearn provides nearestcentroid and synthetic data generators:).

---
## Reference Absorption: Why This Matters
- The nearest centroid classifier is trivially simple.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (the nearest centroid classifier is trivially simple).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (the nearest centroid classifier is trivially simple).
- It has no hyperparameters, no iteration, no gradient descent.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (it has no hyperparameters, no iteration, no gradient descent).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (it has no hyperparameters, no iteration, no gradient descent).
- Yet it captures the fundamental ML pattern:
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (yet it captures the fundamental ml pattern:).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (yet it captures the fundamental ml pattern:).
- Learn a representation from training data (the centroids)
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (learn a representation from training data (the centroids)).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (learn a representation from training data (the centroids)).

---
## Reference Absorption: Why This Matters (cont.)
- Predict on new data using that representation (nearest distance)
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (predict on new data using that representation (nearest distance)).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (predict on new data using that representation (nearest distance)).
- Evaluate against a baseline (random guessing)
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (evaluate against a baseline (random guessing)).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (evaluate against a baseline (random guessing)).
- Every ML algorithm, from logistic regression to transformers, follows this same three-step pattern.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (every ml algorithm, from logistic regression to transformers, follows this same three-step pattern).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (every ml algorithm, from logistic regression to transformers, follows this same three-step pattern).
- The representation gets more complex, but the workflow stays the same.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (the representation gets more complex, but the workflow stays the same).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (the representation gets more complex, but the workflow stays the same).

---
## Reference Absorption: Ship It
- This lesson produces outputs/prompt-ml-problem-framer.md -- a prompt that turns vague business problems into concrete ML tasks.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (this lesson produces outputs/prompt-ml-problem-framer.md -- a prompt that turns vague business problems into concrete ml tasks).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (this lesson produces outputs/prompt-ml-problem-framer.md -- a prompt that turns vague business problems into concrete...).
- Give it a problem description ("we want to reduce churn" or "predict demand for next quarter") and it identifies the learning type, defines the prediction target, lists candidate features, picks a success me...
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (give it a problem description ("we want to reduce churn" or "predict demand for next quarter") and it identifies the learning t...).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (give it a problem description ("we want to reduce churn" or "predict demand for next quarter") and it identifies the...).
- Use it at the start of any ML project to avoid building the wrong thing.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (use it at the start of any ml project to avoid building the wrong thing).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (use it at the start of any ml project to avoid building the wrong thing).

---
## Reference Absorption: Learning Objectives
- Explain the difference between supervised, unsupervised, and reinforcement learning and identify which type applies to a given problem
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (explain the difference between supervised, unsupervised, and reinforcement learning and identify which type applies to a given...).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (explain the difference between supervised, unsupervised, and reinforcement learning and identify which type applies t...).
- Implement a nearest centroid classifier from scratch and evaluate it against a random baseline
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (implement a nearest centroid classifier from scratch and evaluate it against a random baseline).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (implement a nearest centroid classifier from scratch and evaluate it against a random baseline).
- Distinguish between classification and regression tasks and select the appropriate loss function for each
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (distinguish between classification and regression tasks and select the appropriate loss function for each).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (distinguish between classification and regression tasks and select the appropriate loss function for each).
- Evaluate whether a given business problem is suitable for ML or better solved with deterministic rules
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (evaluate whether a given business problem is suitable for ml or better solved with deterministic rules).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (evaluate whether a given business problem is suitable for ml or better solved with deterministic rules).

---
## Beyond Reference: Engineering Translation
- Core anchors for this module: data, model, learning, training, test, rules, train, supervised.
- Convert each theoretical primitive into measurable training and inference behaviors.
- Define observability checkpoints for drift, calibration, and latency regressions.
- Tie assumptions to explicit data contracts and fallback policies.

---
## Beyond Reference: Advanced Layer 1
- Frame ML feasibility with explicit target, feedback loop, and data-collection latency assumptions.
- Risk and governance extension: convert this into acceptance tests and rollback criteria (frame ml feasibility with explicit target, feedback loop, and data-collection latency assumptions.).
- Compare rule-based systems versus learned models by maintenance cost under concept drift.
- Risk and governance extension: convert this into acceptance tests and rollback criteria (compare rule-based systems versus learned models by maintenance cost under concept drift.).
- Define business-safe baseline policies before any model deployment.
- Risk and governance extension: convert this into acceptance tests and rollback criteria (define business-safe baseline policies before any model deployment.).

<!-- DEPTH_EXPANSION_END -->
