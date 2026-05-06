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

## Journey Map 🗺️

1. Foundations and problem context.
2. Operational intuition of the concept.
3. Mathematical translation for engineering.
4. Usage patterns in AI systems.
5. Practical build with code.
6. Checkpoints for technical mastery.

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

---

## 🔬 Covariance Matrix

The covariance between two variables measures how they vary together:

For d features, the covariance matrix C is a d x d matrix where C[i][j] = Cov(feature_i, feature_j). The diagonal entries C[i][i] are the variances of each feature.

---

## ⚙️ Hypothesis Testing

Hypothesis testing is a framework for making decisions under uncertainty. You start with a claim, collect data, and determine if the data is consistent with the claim.

**The setup:**

---

## 🧩 The t-test

The t-test compares means. There are several flavors.

**One-sample t-test:** is the population mean different from a hypothesized value?

---

## 🚀 Chi-squared Test

The chi-squared test checks if observed frequencies match expected frequencies. Useful for categorical data.

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
