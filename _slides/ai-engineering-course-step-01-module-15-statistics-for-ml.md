---
layout: slides
title: "Statistics for ML"
category: "ai-engineering-course-step-01"
module_number: 15
complexity: "Build"
lesson_type: "Build"
lang_stack: "🐍"
use_math: true
---

layout: true
class: basic-layout

---

class: center, middle, inverse-slide
# Step 01 - Math Foundations
## Module 15: Statistics for Machine Learning
### _Type: Build · Lang: Python · Time: ~120 minutes_

**Richardson Lima**

---

## The Journey Map

1. The problem framing and motivation.
2. Core mathematical intuition and geometry.
3. Formal equations and engineering interpretation.
4. AI system connections and production relevance.
5. Build path with practical implementation.
6. Mastery checkpoints and transfer to the next module.

---

## Why does this matter? 🎯

You trained two models. Model A scores 0.87 on your test set. Model B scores 0.89. You deploy Model B. Three weeks later, production metrics are worse than before. What happened?

Model B did not actually outperform Model A. The 0.02 difference was noise. Your test set was too small, or the variance too high, or both. You shipped randomness dressed up as improvement.

---

## Learning Objectives ✅

- Compute descriptive statistics, Pearson/Spearman correlation, and covariance matrices from scratch
- Perform hypothesis tests (t-test, chi-squared) and interpret p-values and confidence intervals correctly
- Use bootstrap resampling to construct confidence intervals for any metric without distributional assumptions
- Distinguish statistical significance from practical significance using effect size measures

---

## 🧠 Descriptive Statistics: Summarizing Your Data

Before you model anything, you need to know what your data looks like. Descriptive statistics compress a dataset into a few numbers that capture its shape.

**Measures of central tendency** answer "where is the middle?"

---

## 📐 Correlation: How Variables Move Together

Correlation measures the strength and direction of a linear relationship between two variables.

**Pearson correlation coefficient** measures linear association:

$$
r = \frac{\sum_i (x_i-\bar{x})(y_i-\bar{y})}{\sqrt{\sum_i (x_i-\bar{x})^2}\sqrt{\sum_i (y_i-\bar{y})^2}}
$$

---

## 🔬 Covariance Matrix

The covariance between two variables measures how they vary together:

$$
\mathrm{Cov}(X,Y)=\mathbb{E}[(X-\mu_X)(Y-\mu_Y)]
$$

For d features, the covariance matrix C is a d x d matrix where C[i][j] = Cov(feature_i, feature_j). The diagonal entries C[i][i] are the variances of each feature.

---

## ⚙️ Hypothesis Testing

Hypothesis testing is a framework for making decisions under uncertainty. You start with a claim, collect data, and determine if the data is consistent with the claim.

**The setup:**

- Null hypothesis: $H_0$
- Alternative hypothesis: $H_1$
- Significance level: $\alpha$
- Test statistic and p-value for decision

---

## 🧩 The t-test

The t-test compares means. There are several flavors.

**One-sample t-test:** is the population mean different from a hypothesized value?

$$
t = \frac{\bar{x}-\mu_0}{s/\sqrt{n}}
$$

---

## 🚀 Chi-squared Test

The chi-squared test checks if observed frequencies match expected frequencies. Useful for categorical data.

$$
\chi^2 = \sum_i \frac{(O_i-E_i)^2}{E_i}
$$

---

## Hands-on Build Path 🛠️

1. Read the full module
2. Implement the examples from the code directory
3. Validate your understanding with the quiz and outputs

Prerequisites: Phase 1, Lessons 06 (Probability and Distributions), 07 (Bayes' Theorem)

---

## Mastery Checklist 📌

- I can explain the concept without memorizing formulas.
- I can implement the minimal version in code.
- I can connect the topic to model training/inference.
- I can debug common errors in this topic.

---

## Wrap-up

This module connects mathematical intuition with practical execution.

Next step: move to the next module in the track and reinforce it with quiz exercises.

---
