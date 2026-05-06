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

## O Mapa da Jornada 🗺️

1. Fundamentos e contexto do problema.
2. Intuição operacional do conceito.
3. Tradução matemática para engenharia.
4. Padrões de uso em sistemas de IA.
5. Construção prática com código.
6. Checkpoints para domínio técnico.

---

## Por que isso importa? 🎯

You trained two models. Model A scores 0.87 on your test set. Model B scores 0.89. You deploy Model B. Three weeks later, production metrics are worse than before. What happened?

Model B did not actually outperform Model A. The 0.02 difference was noise. Your test set was too small, or the variance too high, or both. You shipped randomness dressed up as improvement.

---

## Objetivos de Aprendizagem ✅

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

1. Ler o módulo completo
2. Implementar os exemplos do diretório code
3. Validar entendimento com quiz e outputs

Prerequisites: Phase 1, Lessons 06 (Probability and Distributions), 07 (Bayes' Theorem)

---

## Checklist de Domínio 📌

- Eu consigo explicar o conceito sem decorar fórmulas.
- Eu consigo implementar a versão mínima no código.
- Eu consigo conectar o tema com treino/inferência de modelos.
- Eu consigo depurar erros comuns desse tópico.

---

## Fechamento

Este módulo conecta intuição matemática com execução prática.

Próximo passo: avançar para o próximo módulo da trilha e consolidar com exercícios do quiz.

---
