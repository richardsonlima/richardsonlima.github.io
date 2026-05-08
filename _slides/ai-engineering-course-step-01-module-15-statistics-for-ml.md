---
layout: slides
title: "Statistics for ML"
category: "ai-engineering-course-step-01"
module_number: 15
complexity: "Build"
lesson_type: "Build"
lang_stack: "Python"
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
## Why does this matter?
You trained two models. Model A scores 0.87 on your test set. Model B scores 0.89. You deploy Model B. Three weeks later, production metrics are worse than before. What happened?
Model B did not actually outperform Model A. The 0.02 difference was noise. Your test set was too small, or the variance too high, or both. You shipped randomness dressed up as improvement.
---
## Learning Objectives
- Compute descriptive statistics, Pearson/Spearman correlation, and covariance matrices from scratch
- Perform hypothesis tests (t-test, chi-squared) and interpret p-values and confidence intervals correctly
- Use bootstrap resampling to construct confidence intervals for any metric without distributional assumptions
- Distinguish statistical significance from practical significance using effect size measures
---
## Descriptive Statistics: Summarizing Your Data
Before you model anything, you need to know what your data looks like. Descriptive statistics compress a dataset into a few numbers that capture its shape.
**Measures of central tendency** answer "where is the middle?"
---
## Correlation: How Variables Move Together
Correlation measures the strength and direction of a linear relationship between two variables.
**Pearson correlation coefficient** measures linear association:
$$
r = \frac{\sum_i (x_i-\bar{x})(y_i-\bar{y})}{\sqrt{\sum_i (x_i-\bar{x})^2}\sqrt{\sum_i (y_i-\bar{y})^2}}
$$
---
## Covariance Matrix
The covariance between two variables measures how they vary together:
$$
\mathrm{Cov}(X,Y)=\mathbb{E}[(X-\mu_X)(Y-\mu_Y)]
$$
For d features, the covariance matrix C is a d x d matrix where C[i][j] = Cov(feature_i, feature_j). The diagonal entries C[i][i] are the variances of each feature.
---
## Hypothesis Testing
Hypothesis testing is a framework for making decisions under uncertainty. You start with a claim, collect data, and determine if the data is consistent with the claim.
**The setup:**
- Null hypothesis: $H_0$
- Alternative hypothesis: $H_1$
- Significance level: $\alpha$
- Test statistic and p-value for decision
---
## The t-test
The t-test compares means. There are several flavors.
**One-sample t-test:** is the population mean different from a hypothesized value?
$$
t = \frac{\bar{x}-\mu_0}{s/\sqrt{n}}
$$
---
## Chi-squared Test
The chi-squared test checks if observed frequencies match expected frequencies. Useful for categorical data.
$$
\chi^2 = \sum_i \frac{(O_i-E_i)^2}{E_i}
$$
---
## Hands-on Build Path
1. Read the full module
2. Implement the examples from the code directory
3. Validate your understanding with the quiz and outputs
Prerequisites: Phase 1, Lessons 06 (Probability and Distributions), 07 (Bayes' Theorem)
---
## Mastery Checklist
- I can explain the concept without memorizing formulas.
- I can implement the minimal version in code.
- I can connect the topic to model training/inference.
- I can debug common errors in this topic.
---
## Wrap-up
This module connects mathematical intuition with practical execution.
Next step: move to the next module in the track and reinforce it with quiz exercises.
---

<!-- DEPTH_EXPANSION_START -->
---
class: middle, inverse-slide
# Depth Extension
### Full reference absorption plus beyond-reference advanced coverage

---
## Reference Absorption: The Problem
- Model A scores 0.87 on your test set.
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (model a scores 0.87 on your test set).
- Operational risk check: define a metric and alert tied to this concept before deployment (model a scores 0.87 on your test set).
- Three weeks later, production metrics are worse than before.
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (three weeks later, production metrics are worse than before).
- Operational risk check: define a metric and alert tied to this concept before deployment (three weeks later, production metrics are worse than before).
- Model B did not actually outperform Model A.
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (model b did not actually outperform model a).
- Operational risk check: define a metric and alert tied to this concept before deployment (model b did not actually outperform model a).
- The 0.02 difference was noise.
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (the 0.02 difference was noise).
- Operational risk check: define a metric and alert tied to this concept before deployment (the 0.02 difference was noise).

---
## Reference Absorption: The Problem (cont.)
- Your test set was too small, or the variance too high, or both.
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (your test set was too small, or the variance too high, or both).
- Operational risk check: define a metric and alert tied to this concept before deployment (your test set was too small, or the variance too high, or both).
- You shipped randomness dressed up as improvement.
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (you shipped randomness dressed up as improvement).
- Operational risk check: define a metric and alert tied to this concept before deployment (you shipped randomness dressed up as improvement).
- Kaggle leaderboard shakeups.
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (kaggle leaderboard shakeups).
- Operational risk check: define a metric and alert tied to this concept before deployment (kaggle leaderboard shakeups).
- Papers that fail to reproduce.
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (papers that fail to reproduce).
- Operational risk check: define a metric and alert tied to this concept before deployment (papers that fail to reproduce).

---
## Reference Absorption: The Problem Deep Continuation
- A/B tests that declare winners based on a few hundred samples.
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (a/b tests that declare winners based on a few hundred samples).
- Operational risk check: define a metric and alert tied to this concept before deployment (a/b tests that declare winners based on a few hundred samples).
- The root cause is always the same: someone skipped the statistics.
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (the root cause is always the same: someone skipped the statistics).
- Operational risk check: define a metric and alert tied to this concept before deployment (the root cause is always the same: someone skipped the statistics).
- Statistics gives you the tools to distinguish signal from noise.
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (statistics gives you the tools to distinguish signal from noise).
- Operational risk check: define a metric and alert tied to this concept before deployment (statistics gives you the tools to distinguish signal from noise).
- It tells you when a difference is real, how confident you should be, and how much data you need before you can trust a result.
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (it tells you when a difference is real, how confident you should be, and how much data you need before you can trust a result).
- Operational risk check: define a metric and alert tied to this concept before deployment (it tells you when a difference is real, how confident you should be, and how much data you need before you can trust...).

---
## Reference Absorption: The Problem Deep Continuation
- Every ML pipeline, every model comparison, every experiment needs statistics.
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (every ml pipeline, every model comparison, every experiment needs statistics).
- Operational risk check: define a metric and alert tied to this concept before deployment (every ml pipeline, every model comparison, every experiment needs statistics).
- Without it, you are guessing.
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (without it, you are guessing).
- Operational risk check: define a metric and alert tied to this concept before deployment (without it, you are guessing).

---
## Reference Absorption: Descriptive Statistics: Summarizing Your Data
- Before you model anything, you need to know what your data looks like.
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (before you model anything, you need to know what your data looks like).
- Operational risk check: define a metric and alert tied to this concept before deployment (before you model anything, you need to know what your data looks like).
- Descriptive statistics compress a dataset into a few numbers that capture its shape.
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (descriptive statistics compress a dataset into a few numbers that capture its shape).
- Operational risk check: define a metric and alert tied to this concept before deployment (descriptive statistics compress a dataset into a few numbers that capture its shape).
- Measures of central tendency answer "where is the middle?"
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (measures of central tendency answer "where is the middle?").
- Operational risk check: define a metric and alert tied to this concept before deployment (measures of central tendency answer "where is the middle?").
- The mean is the balance point.
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (the mean is the balance point).
- Operational risk check: define a metric and alert tied to this concept before deployment (the mean is the balance point).

---
## Reference Absorption: Descriptive Statistics: Summarizing Your Data (cont.)
- The median is the halfway mark.
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (the median is the halfway mark).
- Operational risk check: define a metric and alert tied to this concept before deployment (the median is the halfway mark).
- When they diverge, your distribution is skewed.
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (when they diverge, your distribution is skewed).
- Operational risk check: define a metric and alert tied to this concept before deployment (when they diverge, your distribution is skewed).
- Income distributions have mean >> median (right skew from billionaires).
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (income distributions have mean >> median (right skew from billionaires)).
- Operational risk check: define a metric and alert tied to this concept before deployment (income distributions have mean >> median (right skew from billionaires)).
- Loss distributions during training often have mean << median (left skew from easy samples).
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (loss distributions during training often have mean << median (left skew from easy samples)).
- Operational risk check: define a metric and alert tied to this concept before deployment (loss distributions during training often have mean << median (left skew from easy samples)).

---
## Reference Absorption: Descriptive Statistics: Summarizing Your Data Deep Continuation
- Measures of spread answer "how dispersed is the data?"
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (measures of spread answer "how dispersed is the data?").
- Operational risk check: define a metric and alert tied to this concept before deployment (measures of spread answer "how dispersed is the data?").
- Percentiles divide sorted data into 100 equal parts.
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (percentiles divide sorted data into 100 equal parts).
- Operational risk check: define a metric and alert tied to this concept before deployment (percentiles divide sorted data into 100 equal parts).
- The 25th percentile (Q1) means 25% of values fall below this point.
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (the 25th percentile (q1) means 25% of values fall below this point).
- Operational risk check: define a metric and alert tied to this concept before deployment (the 25th percentile (q1) means 25% of values fall below this point).
- The 50th percentile is the median.
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (the 50th percentile is the median).
- Operational risk check: define a metric and alert tied to this concept before deployment (the 50th percentile is the median).

---
## Reference Absorption: Descriptive Statistics: Summarizing Your Data Deep Continuation
- In ML, you care about percentiles for inference latency, prediction confidence distributions, and understanding error distributions.
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (in ml, you care about percentiles for inference latency, prediction confidence distributions, and understanding error distribut...).
- Operational risk check: define a metric and alert tied to this concept before deployment (in ml, you care about percentiles for inference latency, prediction confidence distributions, and understanding error...).
- A model with low average error but terrible P99 error might be useless for safety-critical applications.
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (a model with low average error but terrible p99 error might be useless for safety-critical applications).
- Operational risk check: define a metric and alert tied to this concept before deployment (a model with low average error but terrible p99 error might be useless for safety-critical applications).
- Sample vs population statistics. When computing variance from a sample, divide by (n-1) instead of n.
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (sample vs population statistics. when computing variance from a sample, divide by (n-1) instead of n).
- Operational risk check: define a metric and alert tied to this concept before deployment (sample vs population statistics. when computing variance from a sample, divide by (n-1) instead of n).
- This is Bessel's correction.
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (this is bessel's correction).
- Operational risk check: define a metric and alert tied to this concept before deployment (this is bessel's correction).

---
## Reference Absorption: Descriptive Statistics: Summarizing Your Data Deep Continuation
- It compensates for the fact that your sample mean is not the true population mean.
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (it compensates for the fact that your sample mean is not the true population mean).
- Operational risk check: define a metric and alert tied to this concept before deployment (it compensates for the fact that your sample mean is not the true population mean).
- With n in the denominator, you systematically underestimate the true variance.
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (with n in the denominator, you systematically underestimate the true variance).
- Operational risk check: define a metric and alert tied to this concept before deployment (with n in the denominator, you systematically underestimate the true variance).
- With (n-1), the estimate is unbiased.
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (with (n-1), the estimate is unbiased).
- Operational risk check: define a metric and alert tied to this concept before deployment (with (n-1), the estimate is unbiased).
- In practice: if n is large (thousands of samples), the difference is negligible.
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (in practice: if n is large (thousands of samples), the difference is negligible).
- Operational risk check: define a metric and alert tied to this concept before deployment (in practice: if n is large (thousands of samples), the difference is negligible).

---
## Reference Absorption: Descriptive Statistics: Summarizing Your Data Deep Continuation
- If n is small (dozens of samples), it matters.
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (if n is small (dozens of samples), it matters).
- Operational risk check: define a metric and alert tied to this concept before deployment (if n is small (dozens of samples), it matters).

---
## Reference Absorption: Key Terms
- Measures spread in original units.
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (measures spread in original units).
- Operational risk check: define a metric and alert tied to this concept before deployment (measures spread in original units).
- The spread of the middle 50%.
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (the spread of the middle 50%).
- Operational risk check: define a metric and alert tied to this concept before deployment (the spread of the middle 50%).
- Rejecting H0 when it is true.
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (rejecting h0 when it is true).
- Operational risk check: define a metric and alert tied to this concept before deployment (rejecting h0 when it is true).
- Failing to reject H0 when it is false.
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (failing to reject h0 when it is false).
- Operational risk check: define a metric and alert tied to this concept before deployment (failing to reject h0 when it is false).

---
## Reference Absorption: Key Terms (cont.)
- Power = 1 minus Type II error rate.
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (power = 1 minus type ii error rate).
- Operational risk check: define a metric and alert tied to this concept before deployment (power = 1 minus type ii error rate).

---
## Reference Absorption: Correlation: How Variables Move Together
- Correlation measures the strength and direction of a linear relationship between two variables.
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (correlation measures the strength and direction of a linear relationship between two variables).
- Operational risk check: define a metric and alert tied to this concept before deployment (correlation measures the strength and direction of a linear relationship between two variables).
- Pearson correlation coefficient measures linear association:
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (pearson correlation coefficient measures linear association:).
- Operational risk check: define a metric and alert tied to this concept before deployment (pearson correlation coefficient measures linear association:).
- Pearson assumes the relationship is linear and both variables are roughly normally distributed.
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (pearson assumes the relationship is linear and both variables are roughly normally distributed).
- Operational risk check: define a metric and alert tied to this concept before deployment (pearson assumes the relationship is linear and both variables are roughly normally distributed).
- It is sensitive to outliers.
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (it is sensitive to outliers).
- Operational risk check: define a metric and alert tied to this concept before deployment (it is sensitive to outliers).

---
## Reference Absorption: Correlation: How Variables Move Together (cont.)
- A single extreme point can drag r from 0.1 to 0.9.
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (a single extreme point can drag r from 0.1 to 0.9).
- Operational risk check: define a metric and alert tied to this concept before deployment (a single extreme point can drag r from 0.1 to 0.9).
- Spearman rank correlation measures monotonic association:
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (spearman rank correlation measures monotonic association:).
- Operational risk check: define a metric and alert tied to this concept before deployment (spearman rank correlation measures monotonic association:).
- The golden rule: correlation does not imply causation.
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (the golden rule: correlation does not imply causation).
- Operational risk check: define a metric and alert tied to this concept before deployment (the golden rule: correlation does not imply causation).
- Ice cream sales and drowning deaths are correlated because both increase in summer.
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (ice cream sales and drowning deaths are correlated because both increase in summer).
- Operational risk check: define a metric and alert tied to this concept before deployment (ice cream sales and drowning deaths are correlated because both increase in summer).

---
## Reference Absorption: Correlation: How Variables Move Together Deep Continuation
- Your model's accuracy and the number of parameters are correlated, but adding parameters does not automatically improve accuracy (see: overfitting).
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (your model's accuracy and the number of parameters are correlated, but adding parameters does not automatically improve accurac...).
- Operational risk check: define a metric and alert tied to this concept before deployment (your model's accuracy and the number of parameters are correlated, but adding parameters does not automatically impro...).

---
## Reference Absorption: Bootstrap Methods
- Bootstrapping estimates the sampling distribution of a statistic by resampling your data with replacement.
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (bootstrapping estimates the sampling distribution of a statistic by resampling your data with replacement).
- Operational risk check: define a metric and alert tied to this concept before deployment (bootstrapping estimates the sampling distribution of a statistic by resampling your data with replacement).
- No assumptions about the underlying distribution required.
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (no assumptions about the underlying distribution required).
- Operational risk check: define a metric and alert tied to this concept before deployment (no assumptions about the underlying distribution required).
- Bootstrap confidence interval (percentile method):
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (bootstrap confidence interval (percentile method):).
- Operational risk check: define a metric and alert tied to this concept before deployment (bootstrap confidence interval (percentile method):).
- Why bootstrap matters for ML:
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (why bootstrap matters for ml:).
- Operational risk check: define a metric and alert tied to this concept before deployment (why bootstrap matters for ml:).

---
## Reference Absorption: Bootstrap Methods (cont.)
- Bootstrap for model comparison:
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (bootstrap for model comparison:).
- Operational risk check: define a metric and alert tied to this concept before deployment (bootstrap for model comparison:).
- This is more robust than the paired t-test because it makes no distributional assumptions.
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (this is more robust than the paired t-test because it makes no distributional assumptions).
- Operational risk check: define a metric and alert tied to this concept before deployment (this is more robust than the paired t-test because it makes no distributional assumptions).

---
## Reference Absorption: Hypothesis Testing
- Hypothesis testing is a framework for making decisions under uncertainty.
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (hypothesis testing is a framework for making decisions under uncertainty).
- Operational risk check: define a metric and alert tied to this concept before deployment (hypothesis testing is a framework for making decisions under uncertainty).
- You start with a claim, collect data, and determine if the data is consistent with the claim.
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (you start with a claim, collect data, and determine if the data is consistent with the claim).
- Operational risk check: define a metric and alert tied to this concept before deployment (you start with a claim, collect data, and determine if the data is consistent with the claim).
- The p-value is the probability of seeing data as extreme as what you observed, assuming H0 is true.
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (the p-value is the probability of seeing data as extreme as what you observed, assuming h0 is true).
- Operational risk check: define a metric and alert tied to this concept before deployment (the p-value is the probability of seeing data as extreme as what you observed, assuming h0 is true).
- It is NOT the probability that H0 is true.
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (it is not the probability that h0 is true).
- Operational risk check: define a metric and alert tied to this concept before deployment (it is not the probability that h0 is true).

---
## Reference Absorption: Hypothesis Testing (cont.)
- This is the single most common misunderstanding in statistics.
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (this is the single most common misunderstanding in statistics).
- Operational risk check: define a metric and alert tied to this concept before deployment (this is the single most common misunderstanding in statistics).
- Confidence intervals give a range of plausible values for a parameter:
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (confidence intervals give a range of plausible values for a parameter:).
- Operational risk check: define a metric and alert tied to this concept before deployment (confidence intervals give a range of plausible values for a parameter:).
- The width of the confidence interval tells you about precision.
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (the width of the confidence interval tells you about precision).
- Operational risk check: define a metric and alert tied to this concept before deployment (the width of the confidence interval tells you about precision).
- Wide intervals mean high uncertainty.
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (wide intervals mean high uncertainty).
- Operational risk check: define a metric and alert tied to this concept before deployment (wide intervals mean high uncertainty).

---
## Reference Absorption: Hypothesis Testing Deep Continuation
- Narrow intervals mean your estimate is precise (but not necessarily accurate, if your data is biased).
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (narrow intervals mean your estimate is precise (but not necessarily accurate, if your data is biased)).
- Operational risk check: define a metric and alert tied to this concept before deployment (narrow intervals mean your estimate is precise (but not necessarily accurate, if your data is biased)).

---
## Reference Absorption: Common Statistical Mistakes in ML Papers
- Testing on the training set. Guarantees overfitting.
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (testing on the training set. guarantees overfitting).
- Operational risk check: define a metric and alert tied to this concept before deployment (testing on the training set. guarantees overfitting).
- Always hold out data the model never sees during training.
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (always hold out data the model never sees during training).
- Operational risk check: define a metric and alert tied to this concept before deployment (always hold out data the model never sees during training).
- No confidence intervals. Reporting a single accuracy number without uncertainty makes results unreproducible and unverifiable.
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (no confidence intervals. reporting a single accuracy number without uncertainty makes results unreproducible and unverifiable).
- Operational risk check: define a metric and alert tied to this concept before deployment (no confidence intervals. reporting a single accuracy number without uncertainty makes results unreproducible and unve...).
- Ignoring multiple comparisons. Testing 50 configurations and reporting the best one without correction inflates false positive rates.
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (ignoring multiple comparisons. testing 50 configurations and reporting the best one without correction inflates false positive...).
- Operational risk check: define a metric and alert tied to this concept before deployment (ignoring multiple comparisons. testing 50 configurations and reporting the best one without correction inflates false...).

---
## Reference Absorption: Common Statistical Mistakes in ML Papers (cont.)
- Confusing statistical and practical significance. A p-value of 0.001 on a 0.01% accuracy improvement is not meaningful.
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (confusing statistical and practical significance. a p-value of 0.001 on a 0.01% accuracy improvement is not meaningful).
- Operational risk check: define a metric and alert tied to this concept before deployment (confusing statistical and practical significance. a p-value of 0.001 on a 0.01% accuracy improvement is not meaningful).
- Using accuracy on imbalanced data. 99% accuracy on a dataset with 99% negative class means the model learned nothing.
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (using accuracy on imbalanced data. 99% accuracy on a dataset with 99% negative class means the model learned nothing).
- Operational risk check: define a metric and alert tied to this concept before deployment (using accuracy on imbalanced data. 99% accuracy on a dataset with 99% negative class means the model learned nothing).
- Use precision, recall, F1, or AUC.
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (use precision, recall, f1, or auc).
- Operational risk check: define a metric and alert tied to this concept before deployment (use precision, recall, f1, or auc).
- Cherry-picking metrics. Reporting only the metric where your model wins.
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (cherry-picking metrics. reporting only the metric where your model wins).
- Operational risk check: define a metric and alert tied to this concept before deployment (cherry-picking metrics. reporting only the metric where your model wins).

---
## Reference Absorption: Common Statistical Mistakes in ML Papers Deep Continuation
- Honest evaluation reports all relevant metrics.
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (honest evaluation reports all relevant metrics).
- Operational risk check: define a metric and alert tied to this concept before deployment (honest evaluation reports all relevant metrics).
- Leaking information across train/test splits. Normalizing before splitting, or using future data to predict the past.
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (leaking information across train/test splits. normalizing before splitting, or using future data to predict the past).
- Operational risk check: define a metric and alert tied to this concept before deployment (leaking information across train/test splits. normalizing before splitting, or using future data to predict the past).
- Small test sets with no variance estimates. Evaluating on 100 samples and claiming 2% improvement is noise, not signal.
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (small test sets with no variance estimates. evaluating on 100 samples and claiming 2% improvement is noise, not signal).
- Operational risk check: define a metric and alert tied to this concept before deployment (small test sets with no variance estimates. evaluating on 100 samples and claiming 2% improvement is noise, not signal).
- Assuming independence when data is not independent. Medical images from the same patient, multiple sentences from the same document.
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (assuming independence when data is not independent. medical images from the same patient, multiple sentences from the same docu...).
- Operational risk check: define a metric and alert tied to this concept before deployment (assuming independence when data is not independent. medical images from the same patient, multiple sentences from the...).

---
## Reference Absorption: Common Statistical Mistakes in ML Papers Deep Continuation
- Observations within a group are correlated.
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (observations within a group are correlated).
- Operational risk check: define a metric and alert tied to this concept before deployment (observations within a group are correlated).
- P-hacking. Trying different tests, subsets, or exclusion criteria until you get p < 0.05.
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (p-hacking. trying different tests, subsets, or exclusion criteria until you get p < 0.05).
- Operational risk check: define a metric and alert tied to this concept before deployment (p-hacking. trying different tests, subsets, or exclusion criteria until you get p < 0.05).
- The result is an artifact of the search.
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (the result is an artifact of the search).
- Operational risk check: define a metric and alert tied to this concept before deployment (the result is an artifact of the search).

---
## Reference Absorption: Covariance Matrix
- The covariance between two variables measures how they vary together:
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (the covariance between two variables measures how they vary together:).
- Operational risk check: define a metric and alert tied to this concept before deployment (the covariance between two variables measures how they vary together:).
- For d features, the covariance matrix C is a d x d matrix where C[i][j] = Cov(feature_i, feature_j).
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (for d features, the covariance matrix c is a d x d matrix where c[i][j] = cov(feature_i, feature_j)).
- Operational risk check: define a metric and alert tied to this concept before deployment (for d features, the covariance matrix c is a d x d matrix where c[i][j] = cov(feature_i, feature_j)).
- The diagonal entries C[i][i] are the variances of each feature.
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (the diagonal entries c[i][i] are the variances of each feature).
- Operational risk check: define a metric and alert tied to this concept before deployment (the diagonal entries c[i][i] are the variances of each feature).
- Connection to PCA. PCA eigendecomposes the covariance matrix.
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (connection to pca. pca eigendecomposes the covariance matrix).
- Operational risk check: define a metric and alert tied to this concept before deployment (connection to pca. pca eigendecomposes the covariance matrix).

---
## Reference Absorption: Covariance Matrix (cont.)
- The eigenvectors are the principal components (directions of maximum variance).
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (the eigenvectors are the principal components (directions of maximum variance)).
- Operational risk check: define a metric and alert tied to this concept before deployment (the eigenvectors are the principal components (directions of maximum variance)).
- The eigenvalues tell you how much variance each component captures.
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (the eigenvalues tell you how much variance each component captures).
- Operational risk check: define a metric and alert tied to this concept before deployment (the eigenvalues tell you how much variance each component captures).
- This is exactly what Lesson 10 covered, but now you see why the covariance matrix is the right thing to decompose: it encodes all pairwise linear relationships in your data.
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (this is exactly what lesson 10 covered, but now you see why the covariance matrix is the right thing to decompose: it encodes a...).
- Operational risk check: define a metric and alert tied to this concept before deployment (this is exactly what lesson 10 covered, but now you see why the covariance matrix is the right thing to decompose: it...).
- Connection to correlation. The correlation matrix is the covariance matrix of standardized variables (each divided by its standard deviation).
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (connection to correlation. the correlation matrix is the covariance matrix of standardized variables (each divided by its stand...).
- Operational risk check: define a metric and alert tied to this concept before deployment (connection to correlation. the correlation matrix is the covariance matrix of standardized variables (each divided by...).

---
## Reference Absorption: Covariance Matrix Deep Continuation
- Correlation normalizes covariance so all values fall in [-1, 1].
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (correlation normalizes covariance so all values fall in [-1, 1]).
- Operational risk check: define a metric and alert tied to this concept before deployment (correlation normalizes covariance so all values fall in [-1, 1]).

---
## Reference Absorption: Parametric vs Non-parametric Tests
- Parametric tests assume a specific distribution (usually normal):
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (parametric tests assume a specific distribution (usually normal):).
- Operational risk check: define a metric and alert tied to this concept before deployment (parametric tests assume a specific distribution (usually normal):).
- Non-parametric tests make no distributional assumptions:
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (non-parametric tests make no distributional assumptions:).
- Operational risk check: define a metric and alert tied to this concept before deployment (non-parametric tests make no distributional assumptions:).
- In ML experiments, you typically have small n (5 or 10 cross-validation folds), so non-parametric tests like Wilcoxon signed-rank are often more appropriate than t-tests.
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (in ml experiments, you typically have small n (5 or 10 cross-validation folds), so non-parametric tests like wilcoxon signed-ra...).
- Operational risk check: define a metric and alert tied to this concept before deployment (in ml experiments, you typically have small n (5 or 10 cross-validation folds), so non-parametric tests like wilcoxon...).

---
## Reference Absorption: A/B Testing for ML Models
- A/B testing in ML is not the same as web A/B testing.
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (a/b testing in ml is not the same as web a/b testing).
- Operational risk check: define a metric and alert tied to this concept before deployment (a/b testing in ml is not the same as web a/b testing).
- Model comparison has specific challenges:
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (model comparison has specific challenges:).
- Operational risk check: define a metric and alert tied to this concept before deployment (model comparison has specific challenges:).

---
## Beyond Reference: Engineering Translation
- Core anchors for this module: test, data, model, mean, sample, tests, value, confidence.
- Convert each theoretical primitive into measurable behaviors in training and inference pipelines.
- Define observability checkpoints so regressions are detected before deployment impact.
- Tie mathematical assumptions to concrete data contracts and monitoring thresholds.

---
## Beyond Reference: Advanced Layer 1
- Use confidence intervals and bootstrap methods for uncertainty-aware model comparisons.
- Risk and governance extension: convert this advanced point into explicit acceptance tests and rollback criteria (use confidence intervals and bootstrap methods for uncertainty-aware model comparisons.).
- Differentiate statistical significance from practical significance in A/B experiments.
- Risk and governance extension: convert this advanced point into explicit acceptance tests and rollback criteria (differentiate statistical significance from practical significance in a/b experiments.).
- Handle multiple testing with FDR control in large feature-screening pipelines.
- Risk and governance extension: convert this advanced point into explicit acceptance tests and rollback criteria (handle multiple testing with fdr control in large feature-screening pipelines.).

---
## Beyond Reference: Research to Production Loop
- Start from a benchmarked baseline and publish ablations that isolate each mathematical choice.
- Stress-test with adversarial and out-of-distribution inputs aligned to the module's assumptions.
- Maintain a rollback-safe deployment strategy with guardrails for confidence, drift, and latency budgets.
- Document invariant checks that must remain true after every optimization or refactor.

<!-- DEPTH_EXPANSION_END -->
