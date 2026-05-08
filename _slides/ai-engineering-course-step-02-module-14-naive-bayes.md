---
layout: slides
title: "Naive Bayes"
category: "ai-engineering-course-step-02"
module_number: 14
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
## Module 14: Naive Bayes
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
- Emails into spam or not-spam.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (emails into spam or not-spam).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (emails into spam or not-spam).
- Customer reviews into positive or negative.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (customer reviews into positive or negative).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (customer reviews into positive or negative).
- Support tickets into categories.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (support tickets into categories).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (support tickets into categories).
- You have thousands of features (one per word) and limited training data.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (you have thousands of features (one per word) and limited training data).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (you have thousands of features (one per word) and limited training data).

---
## Reference Absorption: The Problem (cont.)
- Most classifiers choke here.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (most classifiers choke here).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (most classifiers choke here).
- Logistic regression needs enough samples to estimate thousands of weights reliably.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (logistic regression needs enough samples to estimate thousands of weights reliably).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (logistic regression needs enough samples to estimate thousands of weights reliably).
- Decision trees split on one word at a time and overfit wildly.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (decision trees split on one word at a time and overfit wildly).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (decision trees split on one word at a time and overfit wildly).
- KNN in 10,000 dimensions is meaningless because every point is equally far from every other point.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (knn in 10,000 dimensions is meaningless because every point is equally far from every other point).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (knn in 10,000 dimensions is meaningless because every point is equally far from every other point).

---
## Reference Absorption: The Problem Deep Continuation
- It makes a mathematically wrong assumption (that every feature is independent of every other feature given the class), and it still outperforms "smarter" models on text classification, especially with small...
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (it makes a mathematically wrong assumption (that every feature is independent of every other feature given the class), and it s...).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (it makes a mathematically wrong assumption (that every feature is independent of every other feature given the class)...).
- It trains in a single pass through the data.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (it trains in a single pass through the data).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (it trains in a single pass through the data).
- It scales to millions of features.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (it scales to millions of features).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (it scales to millions of features).
- It produces probability estimates (though often poorly calibrated due to the independence assumption).
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (it produces probability estimates (though often poorly calibrated due to the independence assumption)).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (it produces probability estimates (though often poorly calibrated due to the independence assumption)).

---
## Reference Absorption: The Problem Deep Continuation
- Understanding why a wrong assumption leads to good predictions teaches you something fundamental about machine learning: the best model is not the most correct one, it is the one with the best bias-variance...
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (understanding why a wrong assumption leads to good predictions teaches you something fundamental about machine learning: the be...).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (understanding why a wrong assumption leads to good predictions teaches you something fundamental about machine learni...).

---
## Reference Absorption: Exercises
- Smoothing experiment. Train MultinomialNB on text data with alpha values of 0.01, 0.1, 1.0, 10.0, and 100.0.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (smoothing experiment. train multinomialnb on text data with alpha values of 0.01, 0.1, 1.0, 10.0, and 100.0).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (smoothing experiment. train multinomialnb on text data with alpha values of 0.01, 0.1, 1.0, 10.0, and 100.0).
- Where does performance peak?
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (where does performance peak?).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (where does performance peak?).
- Why does very high alpha hurt?
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (why does very high alpha hurt?).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (why does very high alpha hurt?).
- Feature independence test. Take a real text dataset.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (feature independence test. take a real text dataset).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (feature independence test. take a real text dataset).

---
## Reference Absorption: Exercises (cont.)
- Pick two words that are obviously correlated ("machine" and "learning").
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (pick two words that are obviously correlated ("machine" and "learning")).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (pick two words that are obviously correlated ("machine" and "learning")).
- How wrong is the independence assumption?
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (how wrong is the independence assumption?).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (how wrong is the independence assumption?).
- Does it affect classification accuracy?
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (does it affect classification accuracy?).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (does it affect classification accuracy?).
- Bernoulli implementation. Extend the code with a BernoulliNB class.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (bernoulli implementation. extend the code with a bernoullinb class).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (bernoulli implementation. extend the code with a bernoullinb class).

---
## Reference Absorption: Exercises Deep Continuation
- Convert bag-of-words to binary (present/absent) and compare accuracy against MultinomialNB on text data.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (convert bag-of-words to binary (present/absent) and compare accuracy against multinomialnb on text data).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (convert bag-of-words to binary (present/absent) and compare accuracy against multinomialnb on text data).
- NB vs Logistic Regression. Train both on text data.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (nb vs logistic regression. train both on text data).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (nb vs logistic regression. train both on text data).
- Start with 100 training samples and increase to 10,000.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (start with 100 training samples and increase to 10,000).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (start with 100 training samples and increase to 10,000).
- Plot accuracy vs training set size for both.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (plot accuracy vs training set size for both).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (plot accuracy vs training set size for both).

---
## Reference Absorption: Exercises Deep Continuation
- At what point does Logistic Regression overtake Naive Bayes?
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (at what point does logistic regression overtake naive bayes?).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (at what point does logistic regression overtake naive bayes?).
- Spam filter. Build a complete spam classifier: tokenize raw email text, build vocabulary, create bag-of-words features, train MultinomialNB, evaluate with precision and recall (not just accuracy -- why?).
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (spam filter. build a complete spam classifier: tokenize raw email text, build vocabulary, create bag-of-words features, train m...).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (spam filter. build a complete spam classifier: tokenize raw email text, build vocabulary, create bag-of-words feature...).

---
## Reference Absorption: The Math Step by Step
- Let us trace through a concrete example.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (let us trace through a concrete example).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (let us trace through a concrete example).
- Suppose we have two classes: spam and not-spam.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (suppose we have two classes: spam and not-spam).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (suppose we have two classes: spam and not-spam).
- Our vocabulary has three words: "free", "money", "meeting".
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (our vocabulary has three words: "free", "money", "meeting").
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (our vocabulary has three words: "free", "money", "meeting").
- Spam emails mention "free" 80 times, "money" 60 times, "meeting" 10 times (150 total words)
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (spam emails mention "free" 80 times, "money" 60 times, "meeting" 10 times (150 total words)).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (spam emails mention "free" 80 times, "money" 60 times, "meeting" 10 times (150 total words)).

---
## Reference Absorption: The Math Step by Step (cont.)
- Not-spam emails mention "free" 5 times, "money" 10 times, "meeting" 100 times (115 total words)
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (not-spam emails mention "free" 5 times, "money" 10 times, "meeting" 100 times (115 total words)).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (not-spam emails mention "free" 5 times, "money" 10 times, "meeting" 100 times (115 total words)).
- 40% of emails are spam, 60% are not-spam
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (40% of emails are spam, 60% are not-spam).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (40% of emails are spam, 60% are not-spam).
- With Laplace smoothing (alpha=1):
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (with laplace smoothing (alpha=1):).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (with laplace smoothing (alpha=1):).
- New email contains: "free" (2 times), "money" (1 time), "meeting" (0 times).
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (new email contains: "free" (2 times), "money" (1 time), "meeting" (0 times)).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (new email contains: "free" (2 times), "money" (1 time), "meeting" (0 times)).

---
## Reference Absorption: The Math Step by Step Deep Continuation
- Spam wins by a large margin.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (spam wins by a large margin).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (spam wins by a large margin).
- The word "free" appearing twice is strong evidence for spam.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (the word "free" appearing twice is strong evidence for spam).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (the word "free" appearing twice is strong evidence for spam).
- Note that "meeting" not appearing contributes zero to both log sums (0 * log(P)) -- in Multinomial NB, absent words have no effect.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (note that "meeting" not appearing contributes zero to both log sums (0 * log(p)) -- in multinomial nb, absent words have no effect).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (note that "meeting" not appearing contributes zero to both log sums (0 * log(p)) -- in multinomial nb, absent words h...).
- It is Bernoulli NB that explicitly models word absence.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (it is bernoulli nb that explicitly models word absence).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (it is bernoulli nb that explicitly models word absence).

---
## Reference Absorption: Laplace Smoothing
- What happens when a word appears in the test data but never appeared in the training data for a particular class?
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (what happens when a word appears in the test data but never appeared in the training data for a particular class?).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (what happens when a word appears in the test data but never appeared in the training data for a particular class?).
- Without smoothing: P(word | class) = 0/N = 0.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (without smoothing: p(word | class) = 0/n = 0).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (without smoothing: p(word | class) = 0/n = 0).
- One zero multiplied through the entire product makes P(class | features) = 0, regardless of all other evidence.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (one zero multiplied through the entire product makes p(class | features) = 0, regardless of all other evidence).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (one zero multiplied through the entire product makes p(class | features) = 0, regardless of all other evidence).
- A single unseen word destroys the entire prediction, no matter how much other evidence supports it.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (a single unseen word destroys the entire prediction, no matter how much other evidence supports it).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (a single unseen word destroys the entire prediction, no matter how much other evidence supports it).

---
## Reference Absorption: Laplace Smoothing (cont.)
- Laplace smoothing adds a small count alpha (usually 1) to every feature count:
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (laplace smoothing adds a small count alpha (usually 1) to every feature count:).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (laplace smoothing adds a small count alpha (usually 1) to every feature count:).
- With alpha=1, every word gets at least a tiny probability.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (with alpha=1, every word gets at least a tiny probability).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (with alpha=1, every word gets at least a tiny probability).
- The word "discombobulate" appearing in a test email no longer kills the spam probability.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (the word "discombobulate" appearing in a test email no longer kills the spam probability).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (the word "discombobulate" appearing in a test email no longer kills the spam probability).
- The smoothing has a Bayesian interpretation: it is equivalent to placing a uniform Dirichlet prior on the word distributions.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (the smoothing has a bayesian interpretation: it is equivalent to placing a uniform dirichlet prior on the word distributions).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (the smoothing has a bayesian interpretation: it is equivalent to placing a uniform dirichlet prior on the word distri...).

---
## Reference Absorption: Laplace Smoothing Deep Continuation
- Higher alpha means stronger smoothing (more uniform distributions).
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (higher alpha means stronger smoothing (more uniform distributions)).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (higher alpha means stronger smoothing (more uniform distributions)).
- Lower alpha means the model trusts the data more.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (lower alpha means the model trusts the data more).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (lower alpha means the model trusts the data more).
- Alpha is a hyperparameter you tune.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (alpha is a hyperparameter you tune).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (alpha is a hyperparameter you tune).

---
## Reference Absorption: Why It Still Works
- Ranking over calibration. Classification only needs the top-ranked class to be correct.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (ranking over calibration. classification only needs the top-ranked class to be correct).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (ranking over calibration. classification only needs the top-ranked class to be correct).
- Even if P(spam) = 0.99999 when the true probability is 0.7, the classifier still picks spam correctly.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (even if p(spam) = 0.99999 when the true probability is 0.7, the classifier still picks spam correctly).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (even if p(spam) = 0.99999 when the true probability is 0.7, the classifier still picks spam correctly).
- We do not need correct probabilities.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (we do not need correct probabilities).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (we do not need correct probabilities).
- High bias, low variance. The independence assumption is a strong prior.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (high bias, low variance. the independence assumption is a strong prior).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (high bias, low variance. the independence assumption is a strong prior).

---
## Reference Absorption: Why It Still Works (cont.)
- It constrains the model heavily, which prevents overfitting.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (it constrains the model heavily, which prevents overfitting).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (it constrains the model heavily, which prevents overfitting).
- With limited training data, a model that is slightly wrong but stable beats a model that is theoretically right but wildly unstable.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (with limited training data, a model that is slightly wrong but stable beats a model that is theoretically right but wildly unst...).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (with limited training data, a model that is slightly wrong but stable beats a model that is theoretically right but w...).
- This is the bias-variance tradeoff in action.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (this is the bias-variance tradeoff in action).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (this is the bias-variance tradeoff in action).
- Feature redundancy cancels out. Correlated features provide redundant evidence.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (feature redundancy cancels out. correlated features provide redundant evidence).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (feature redundancy cancels out. correlated features provide redundant evidence).

---
## Reference Absorption: Why It Still Works Deep Continuation
- The classifier double-counts this evidence, but it double-counts it for the correct class too.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (the classifier double-counts this evidence, but it double-counts it for the correct class too).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (the classifier double-counts this evidence, but it double-counts it for the correct class too).
- If "machine" and "learning" always appear together, both provide evidence for the "tech" class.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (if "machine" and "learning" always appear together, both provide evidence for the "tech" class).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (if "machine" and "learning" always appear together, both provide evidence for the "tech" class).
- NB counts them twice, but it counts them twice for the right class.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (nb counts them twice, but it counts them twice for the right class).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (nb counts them twice, but it counts them twice for the right class).
- A fourth, practical reason: Naive Bayes is extremely fast.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (a fourth, practical reason: naive bayes is extremely fast).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (a fourth, practical reason: naive bayes is extremely fast).

---
## Reference Absorption: Why It Still Works Deep Continuation
- Training is a single pass through the data counting frequencies.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (training is a single pass through the data counting frequencies).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (training is a single pass through the data counting frequencies).
- Prediction is a matrix multiplication.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (prediction is a matrix multiplication).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (prediction is a matrix multiplication).
- You can train on a million documents in seconds.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (you can train on a million documents in seconds).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (you can train on a million documents in seconds).
- This speed means you can iterate faster, try more feature sets, and run more experiments than with slower models.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (this speed means you can iterate faster, try more feature sets, and run more experiments than with slower models).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (this speed means you can iterate faster, try more feature sets, and run more experiments than with slower models).

---
## Reference Absorption: MultinomialNB
- The from-scratch implementation:
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (the from-scratch implementation:).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (the from-scratch implementation:).
- fit(X, y): For each class, count the frequency of each feature.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (fit(x, y): for each class, count the frequency of each feature).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (fit(x, y): for each class, count the frequency of each feature).
- Store class priors (log of class frequencies).
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (store class priors (log of class frequencies)).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (store class priors (log of class frequencies)).
- predict_log_proba(X): For each sample, compute log P(class) + sum of log P(feature_i | class) for all classes.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (predict_log_proba(x): for each sample, compute log p(class) + sum of log p(feature_i | class) for all classes).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (predict_log_proba(x): for each sample, compute log p(class) + sum of log p(feature_i | class) for all classes).

---
## Reference Absorption: MultinomialNB (cont.)
- This is a matrix multiplication: X @ log_probs.T + log_priors.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (this is a matrix multiplication: x @ log_probs.t + log_priors).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (this is a matrix multiplication: x @ log_probs.t + log_priors).
- predict(X): Return the class with highest log probability.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (predict(x): return the class with highest log probability).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (predict(x): return the class with highest log probability).
- The key insight: after fitting, prediction is just matrix multiplication plus a bias.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (the key insight: after fitting, prediction is just matrix multiplication plus a bias).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (the key insight: after fitting, prediction is just matrix multiplication plus a bias).
- This is why Naive Bayes is so fast.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (this is why naive bayes is so fast).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (this is why naive bayes is so fast).

---
## Reference Absorption: Three Variants
- Naive Bayes comes in three flavors.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (naive bayes comes in three flavors).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (naive bayes comes in three flavors).
- Each models P(feature | class) differently.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (each models p(feature | class) differently).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (each models p(feature | class) differently).
- Models each feature as a count.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (models each feature as a count).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (models each feature as a count).
- Best for text data where features are word frequencies or TF-IDF values.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (best for text data where features are word frequencies or tf-idf values).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (best for text data where features are word frequencies or tf-idf values).

---
## Reference Absorption: Three Variants (cont.)
- The alpha is Laplace smoothing (explained below).
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (the alpha is laplace smoothing (explained below)).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (the alpha is laplace smoothing (explained below)).
- This variant is the workhorse for text classification.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (this variant is the workhorse for text classification).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (this variant is the workhorse for text classification).
- Models each feature as a normal distribution.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (models each feature as a normal distribution).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (models each feature as a normal distribution).
- Best for continuous features.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (best for continuous features).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (best for continuous features).

---
## Reference Absorption: Three Variants Deep Continuation
- Each class gets its own mean and variance per feature.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (each class gets its own mean and variance per feature).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (each class gets its own mean and variance per feature).
- This works well when features genuinely follow a bell curve within each class.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (this works well when features genuinely follow a bell curve within each class).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (this works well when features genuinely follow a bell curve within each class).
- Models each feature as binary (present or absent).
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (models each feature as binary (present or absent)).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (models each feature as binary (present or absent)).
- Best for short text or binary feature vectors.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (best for short text or binary feature vectors).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (best for short text or binary feature vectors).

---
## Reference Absorption: Three Variants Deep Continuation
- Unlike Multinomial, Bernoulli explicitly penalizes the absence of a word.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (unlike multinomial, bernoulli explicitly penalizes the absence of a word).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (unlike multinomial, bernoulli explicitly penalizes the absence of a word).
- If "free" typically appears in spam but is absent from this email, Bernoulli counts that as evidence against spam.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (if "free" typically appears in spam but is absent from this email, bernoulli counts that as evidence against spam).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (if "free" typically appears in spam but is absent from this email, bernoulli counts that as evidence against spam).

---
## Reference Absorption: When Naive Bayes Fails
- NB fails when the independence assumption causes incorrect rankings (not just incorrect probabilities).
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (nb fails when the independence assumption causes incorrect rankings (not just incorrect probabilities)).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (nb fails when the independence assumption causes incorrect rankings (not just incorrect probabilities)).
- Strong feature interactions. If the class depends on the combination of two features but not either alone (XOR-like patterns), NB will miss it entirely.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (strong feature interactions. if the class depends on the combination of two features but not either alone (xor-like patterns),...).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (strong feature interactions. if the class depends on the combination of two features but not either alone (xor-like p...).
- Each feature alone provides no evidence, and NB cannot combine them nonlinearly.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (each feature alone provides no evidence, and nb cannot combine them nonlinearly).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (each feature alone provides no evidence, and nb cannot combine them nonlinearly).
- Highly correlated features with opposing evidence. If feature A says "spam" and feature B says "not-spam", but A and B are perfectly correlated (they always agree in reality), NB will see conflicting evidenc...
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (highly correlated features with opposing evidence. if feature a says "spam" and feature b says "not-spam", but a and b are perf...).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (highly correlated features with opposing evidence. if feature a says "spam" and feature b says "not-spam", but a and...).

---
## Reference Absorption: When Naive Bayes Fails (cont.)
- Very large training sets. With enough data, discriminative models like logistic regression learn the true decision boundary and outperform NB.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (very large training sets. with enough data, discriminative models like logistic regression learn the true decision boundary and...).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (very large training sets. with enough data, discriminative models like logistic regression learn the true decision bo...).
- The independence assumption that helped with small data now holds the model back.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (the independence assumption that helped with small data now holds the model back).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (the independence assumption that helped with small data now holds the model back).
- In practice, these failure modes are rare for text classification.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (in practice, these failure modes are rare for text classification).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (in practice, these failure modes are rare for text classification).
- Text features are numerous, individually weak, and the independence assumption's errors tend to cancel out.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (text features are numerous, individually weak, and the independence assumption's errors tend to cancel out).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (text features are numerous, individually weak, and the independence assumption's errors tend to cancel out).

---
## Reference Absorption: When Naive Bayes Fails Deep Continuation
- For tabular data with few strongly correlated features, consider logistic regression or tree-based models first.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (for tabular data with few strongly correlated features, consider logistic regression or tree-based models first).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (for tabular data with few strongly correlated features, consider logistic regression or tree-based models first).

---
## Reference Absorption: Common Gotchas
- Negative feature values. MultinomialNB requires non-negative features.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (negative feature values. multinomialnb requires non-negative features).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (negative feature values. multinomialnb requires non-negative features).
- If you have negative values (like TF-IDF with certain settings or standardized features), use GaussianNB instead, or shift the features to be positive.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (if you have negative values (like tf-idf with certain settings or standardized features), use gaussiannb instead, or shift the...).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (if you have negative values (like tf-idf with certain settings or standardized features), use gaussiannb instead, or...).
- Zero variance features. GaussianNB divides by variance.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (zero variance features. gaussiannb divides by variance).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (zero variance features. gaussiannb divides by variance).
- If a feature has zero variance for a class (all values identical), the probability computation breaks.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (if a feature has zero variance for a class (all values identical), the probability computation breaks).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (if a feature has zero variance for a class (all values identical), the probability computation breaks).

---
## Reference Absorption: Common Gotchas (cont.)
- The code adds a small smoothing term (1e-9) to all variances to prevent this.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (the code adds a small smoothing term (1e-9) to all variances to prevent this).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (the code adds a small smoothing term (1e-9) to all variances to prevent this).
- Class imbalance. If 99% of emails are not-spam, the prior P(not-spam) = 0.99 is so strong that it overwhelms the likelihood evidence.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (class imbalance. if 99% of emails are not-spam, the prior p(not-spam) = 0.99 is so strong that it overwhelms the likelihood evi...).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (class imbalance. if 99% of emails are not-spam, the prior p(not-spam) = 0.99 is so strong that it overwhelms the like...).
- You can set class priors manually or use class_prior parameter in sklearn.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (you can set class priors manually or use class_prior parameter in sklearn).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (you can set class priors manually or use class_prior parameter in sklearn).
- Feature scaling. MultinomialNB does not need scaling (it works on counts).
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (feature scaling. multinomialnb does not need scaling (it works on counts)).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (feature scaling. multinomialnb does not need scaling (it works on counts)).

---
## Reference Absorption: Common Gotchas Deep Continuation
- GaussianNB does not need scaling either (it estimates per-feature statistics).
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (gaussiannb does not need scaling either (it estimates per-feature statistics)).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (gaussiannb does not need scaling either (it estimates per-feature statistics)).
- This is an advantage over logistic regression and SVM, which are sensitive to feature scales.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (this is an advantage over logistic regression and svm, which are sensitive to feature scales).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (this is an advantage over logistic regression and svm, which are sensitive to feature scales).

---
## Reference Absorption: The Naive Independence Assumption
- Computing P(features | class) exactly requires estimating the joint probability of all features together.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (computing p(features | class) exactly requires estimating the joint probability of all features together).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (computing p(features | class) exactly requires estimating the joint probability of all features together).
- With a vocabulary of 10,000 words, you would need to estimate a distribution over 2^10,000 possible combinations.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (with a vocabulary of 10,000 words, you would need to estimate a distribution over 2^10,000 possible combinations).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (with a vocabulary of 10,000 words, you would need to estimate a distribution over 2^10,000 possible combinations).
- The naive assumption: every feature is conditionally independent given the class.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (the naive assumption: every feature is conditionally independent given the class).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (the naive assumption: every feature is conditionally independent given the class).
- Instead of one impossible joint distribution, you estimate n simple per-feature distributions.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (instead of one impossible joint distribution, you estimate n simple per-feature distributions).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (instead of one impossible joint distribution, you estimate n simple per-feature distributions).

---
## Reference Absorption: The Naive Independence Assumption (cont.)
- Each one needs only a count.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (each one needs only a count).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (each one needs only a count).
- This assumption is obviously wrong.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (this assumption is obviously wrong).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (this assumption is obviously wrong).
- The words "machine" and "learning" are not independent in any document.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (the words "machine" and "learning" are not independent in any document).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (the words "machine" and "learning" are not independent in any document).
- But the classifier does not need correct probability estimates.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (but the classifier does not need correct probability estimates).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (but the classifier does not need correct probability estimates).

---
## Reference Absorption: The Naive Independence Assumption Deep Continuation
- It needs correct rankings -- which class has the highest probability.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (it needs correct rankings -- which class has the highest probability).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (it needs correct rankings -- which class has the highest probability).
- The independence assumption introduces systematic errors, but those errors affect all classes similarly, so the ranking stays correct.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (the independence assumption introduces systematic errors, but those errors affect all classes similarly, so the ranking stays c...).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (the independence assumption introduces systematic errors, but those errors affect all classes similarly, so the ranki...).

---
## Reference Absorption: Use It
- With sklearn, both variants are one-liners:
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (with sklearn, both variants are one-liners:).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (with sklearn, both variants are one-liners:).
- For text classification with sklearn:
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (for text classification with sklearn:).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (for text classification with sklearn:).
- The code in naive_bayes.py compares from-scratch implementations against sklearn on the same data to verify correctness.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (the code in naive_bayes.py compares from-scratch implementations against sklearn on the same data to verify correctness).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (the code in naive_bayes.py compares from-scratch implementations against sklearn on the same data to verify correctness).

---
## Reference Absorption: TF-IDF with Naive Bayes
- Raw word counts give every word equal weight per occurrence.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (raw word counts give every word equal weight per occurrence).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (raw word counts give every word equal weight per occurrence).
- But common words like "the" and "is" appear frequently in every class -- they carry no information.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (but common words like "the" and "is" appear frequently in every class -- they carry no information).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (but common words like "the" and "is" appear frequently in every class -- they carry no information).
- TF-IDF (Term Frequency - Inverse Document Frequency) downweights common words and upweights rare, discriminative words.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (tf-idf (term frequency - inverse document frequency) downweights common words and upweights rare, discriminative words).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (tf-idf (term frequency - inverse document frequency) downweights common words and upweights rare, discriminative words).
- TF-IDF values are non-negative, so they work with MultinomialNB.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (tf-idf values are non-negative, so they work with multinomialnb).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (tf-idf values are non-negative, so they work with multinomialnb).

---
## Reference Absorption: TF-IDF with Naive Bayes (cont.)
- The combination of TF-IDF + MultinomialNB is one of the strongest baselines for text classification.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (the combination of tf-idf + multinomialnb is one of the strongest baselines for text classification).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (the combination of tf-idf + multinomialnb is one of the strongest baselines for text classification).
- It frequently beats more complex models on datasets with fewer than 10,000 training samples.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (it frequently beats more complex models on datasets with fewer than 10,000 training samples).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (it frequently beats more complex models on datasets with fewer than 10,000 training samples).

---
## Reference Absorption: Demo: Continuous Features
- The code generates Iris-like data (3 classes, 4 features, Gaussian clusters).
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (the code generates iris-like data (3 classes, 4 features, gaussian clusters)).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (the code generates iris-like data (3 classes, 4 features, gaussian clusters)).
- GaussianNB classifies using per-class mean and variance.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (gaussiannb classifies using per-class mean and variance).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (gaussiannb classifies using per-class mean and variance).
- Each class has a different center (mean vector) and different spread (variance), mimicking real-world data where measurements differ systematically between categories.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (each class has a different center (mean vector) and different spread (variance), mimicking real-world data where measurements d...).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (each class has a different center (mean vector) and different spread (variance), mimicking real-world data where meas...).
- Smoothing comparison: Training MultinomialNB with different alpha values to show the effect of smoothing strength on accuracy.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (smoothing comparison: training multinomialnb with different alpha values to show the effect of smoothing strength on accuracy).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (smoothing comparison: training multinomialnb with different alpha values to show the effect of smoothing strength on...).

---
## Reference Absorption: Demo: Continuous Features (cont.)
- Training size experiment: How NB accuracy improves as training data grows from 20 to 1600 samples. NB reaches decent accuracy even with very few samples -- this is its main advantage.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (training size experiment: how nb accuracy improves as training data grows from 20 to 1600 samples. nb reaches decent accuracy e...).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (training size experiment: how nb accuracy improves as training data grows from 20 to 1600 samples. nb reaches decent...).
- Confusion matrix: Per-class precision, recall, and F1 score to show where NB makes mistakes.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (confusion matrix: per-class precision, recall, and f1 score to show where nb makes mistakes).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (confusion matrix: per-class precision, recall, and f1 score to show where nb makes mistakes).

---
## Reference Absorption: Naive Bayes vs Logistic Regression
- Both are linear classifiers for text.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (both are linear classifiers for text).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (both are linear classifiers for text).
- The difference is in what they model.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (the difference is in what they model).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (the difference is in what they model).
- Rule of thumb: start with Naive Bayes.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (rule of thumb: start with naive bayes).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (rule of thumb: start with naive bayes).
- If you have enough data and NB plateaus, switch to logistic regression.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (if you have enough data and nb plateaus, switch to logistic regression).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (if you have enough data and nb plateaus, switch to logistic regression).

---
## Reference Absorption: GaussianNB
- For continuous features, we estimate mean and variance per class per feature:
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (for continuous features, we estimate mean and variance per class per feature:).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (for continuous features, we estimate mean and variance per class per feature:).
- Prediction uses the Gaussian PDF per feature, multiplied across features (added in log space).
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (prediction uses the gaussian pdf per feature, multiplied across features (added in log space)).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (prediction uses the gaussian pdf per feature, multiplied across features (added in log space)).

---
## Reference Absorption: Further Reading
- [scikit-learn Naive Bayes docs](https://scikit-learn.org/stable/modules/naive_bayes.html) -- all three variants with mathematical details
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade ([scikit-learn naive bayes docs](https://scikit-learn.org/stable/modules/naive_bayes.html) -- all three variants with mathematic...).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept ([scikit-learn naive bayes docs](https://scikit-learn.org/stable/modules/naive_bayes.html) -- all three variants with...).
- [McCallum and Nigam, A Comparison of Event Models for Naive Bayes Text Classification (1998)](https://www.cs.cmu.edu/~knigam/papers/multinomial-aaaiws98.pdf) -- the classic comparison of Multinomial vs Berno...
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade ([mccallum and nigam, a comparison of event models for naive bayes text classification (1998)](https://www.cs.cmu.edu/~knigam/pa...).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept ([mccallum and nigam, a comparison of event models for naive bayes text classification (1998)](https://www.cs.cmu.edu/...).
- [Rennie et al., Tackling the Poor Assumptions of Naive Bayes Text Classifiers (2003)](https://people.csail.mit.edu/jrennie/papers/icml03-nb.pdf) -- improvements to NB for text
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade ([rennie et al., tackling the poor assumptions of naive bayes text classifiers (2003)](https://people.csail.mit.edu/jrennie/pape...).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept ([rennie et al., tackling the poor assumptions of naive bayes text classifiers (2003)](https://people.csail.mit.edu/jr...).
- [Ng and Jordan, On Discriminative vs. Generative Classifiers (2001)](https://ai.stanford.edu/~ang/papers/nips01-discriminativegenerative.pdf) -- proves NB converges faster than LR with less data
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade ([ng and jordan, on discriminative vs. generative classifiers (2001)](https://ai.stanford.edu/~ang/papers/nips01-discriminativeg...).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept ([ng and jordan, on discriminative vs. generative classifiers (2001)](https://ai.stanford.edu/~ang/papers/nips01-discr...).

---
## Reference Absorption: BernoulliNB for Short Text
- For short text (tweets, SMS, chat messages), BernoulliNB can outperform MultinomialNB.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (for short text (tweets, sms, chat messages), bernoullinb can outperform multinomialnb).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (for short text (tweets, sms, chat messages), bernoullinb can outperform multinomialnb).
- Short texts have low word counts, so the frequency information that MultinomialNB relies on is noisy.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (short texts have low word counts, so the frequency information that multinomialnb relies on is noisy).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (short texts have low word counts, so the frequency information that multinomialnb relies on is noisy).
- BernoulliNB only cares about presence or absence, which is more reliable with short text.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (bernoullinb only cares about presence or absence, which is more reliable with short text).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (bernoullinb only cares about presence or absence, which is more reliable with short text).
- The binary=True flag in CountVectorizer converts all counts to 0/1.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (the binary=true flag in countvectorizer converts all counts to 0/1).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (the binary=true flag in countvectorizer converts all counts to 0/1).

---
## Reference Absorption: BernoulliNB for Short Text (cont.)
- Without it, BernoulliNB still works but is seeing counts that it was not designed for.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (without it, bernoullinb still works but is seeing counts that it was not designed for).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (without it, bernoullinb still works but is seeing counts that it was not designed for).

---
## Reference Absorption: Log-Space Computation
- Multiplying hundreds of probabilities (each less than 1) causes floating-point underflow.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (multiplying hundreds of probabilities (each less than 1) causes floating-point underflow).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (multiplying hundreds of probabilities (each less than 1) causes floating-point underflow).
- The product becomes zero in floating point even though the true value is a very small positive number.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (the product becomes zero in floating point even though the true value is a very small positive number).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (the product becomes zero in floating point even though the true value is a very small positive number).
- The solution: work in log space.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (the solution: work in log space).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (the solution: work in log space).
- Instead of multiplying probabilities, add their logarithms:
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (instead of multiplying probabilities, add their logarithms:).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (instead of multiplying probabilities, add their logarithms:).

---
## Reference Absorption: Log-Space Computation (cont.)
- This turns the prediction into a dot product:
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (this turns the prediction into a dot product:).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (this turns the prediction into a dot product:).
- That is why Naive Bayes prediction is so fast -- it is the same operation as a single-layer linear model.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (that is why naive bayes prediction is so fast -- it is the same operation as a single-layer linear model).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (that is why naive bayes prediction is so fast -- it is the same operation as a single-layer linear model).

---
## Reference Absorption: Calibrating NB Probabilities
- NB probabilities are poorly calibrated.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (nb probabilities are poorly calibrated).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (nb probabilities are poorly calibrated).
- When NB says P(spam) = 0.95, the true probability might be 0.7.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (when nb says p(spam) = 0.95, the true probability might be 0.7).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (when nb says p(spam) = 0.95, the true probability might be 0.7).
- If you need reliable probability estimates (for example, to set a threshold or to combine with other models), use sklearn's CalibratedClassifierCV:
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (if you need reliable probability estimates (for example, to set a threshold or to combine with other models), use sklearn's cal...).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (if you need reliable probability estimates (for example, to set a threshold or to combine with other models), use skl...).
- This fits a logistic regression on top of NB's raw scores using cross-validation.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (this fits a logistic regression on top of nb's raw scores using cross-validation).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (this fits a logistic regression on top of nb's raw scores using cross-validation).

---
## Reference Absorption: Calibrating NB Probabilities (cont.)
- The resulting probabilities are much closer to the true class frequencies.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (the resulting probabilities are much closer to the true class frequencies).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (the resulting probabilities are much closer to the true class frequencies).

---
## Reference Absorption: Bayes' Theorem (Quick Review)
- Bayes' theorem flips conditional probabilities:
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (bayes' theorem flips conditional probabilities:).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (bayes' theorem flips conditional probabilities:).
- We want P(class | features) -- the probability that a document belongs to a class given the words in it.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (we want p(class | features) -- the probability that a document belongs to a class given the words in it).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (we want p(class | features) -- the probability that a document belongs to a class given the words in it).
- P(features | class) -- the likelihood of seeing these words in documents of this class
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (p(features | class) -- the likelihood of seeing these words in documents of this class).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (p(features | class) -- the likelihood of seeing these words in documents of this class).
- P(class) -- the prior probability of the class (how common is spam in general?)
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (p(class) -- the prior probability of the class (how common is spam in general?)).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (p(class) -- the prior probability of the class (how common is spam in general?)).

---
## Beyond Reference: Engineering Translation
- Core anchors for this module: class, features, feature, bayes, naive, text, data, spam.
- Convert each theoretical primitive into measurable training and inference behaviors.
- Define observability checkpoints for drift, calibration, and latency regressions.
- Tie assumptions to explicit data contracts and fallback policies.

---
## Beyond Reference: Advanced Layer 1
- Compare Multinomial, Bernoulli, and Gaussian NB by feature distribution assumptions.
- Risk and governance extension: convert this into acceptance tests and rollback criteria (compare multinomial, bernoulli, and gaussian nb by feature distribution assumptions.).
- Use log-space computations to avoid underflow in high-dimensional vocabularies.
- Risk and governance extension: convert this into acceptance tests and rollback criteria (use log-space computations to avoid underflow in high-dimensional vocabularies.).
- Explain when NB beats logistic regression due to bias-variance dynamics.
- Risk and governance extension: convert this into acceptance tests and rollback criteria (explain when nb beats logistic regression due to bias-variance dynamics.).

<!-- DEPTH_EXPANSION_END -->
