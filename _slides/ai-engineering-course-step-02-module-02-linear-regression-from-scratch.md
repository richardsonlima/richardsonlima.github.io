---
layout: slides
title: "Linear Regression from Scratch"
category: "ai-engineering-course-step-02"
module_number: 2
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
## Module 02: Linear Regression from Scratch
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
- You have data: house sizes and their sale prices.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (you have data: house sizes and their sale prices).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (you have data: house sizes and their sale prices).
- You want to predict the price of a new house given its size.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (you want to predict the price of a new house given its size).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (you want to predict the price of a new house given its size).
- You could eyeball it on a scatter plot, but you need a formula.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (you could eyeball it on a scatter plot, but you need a formula).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (you could eyeball it on a scatter plot, but you need a formula).
- You need a line that best fits the data so you can plug in any size and get a price prediction.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (you need a line that best fits the data so you can plug in any size and get a price prediction).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (you need a line that best fits the data so you can plug in any size and get a price prediction).

---
## Reference Absorption: The Problem (cont.)
- Linear regression gives you that line.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (linear regression gives you that line).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (linear regression gives you that line).
- More importantly, it introduces the entire ML training loop: define a model, define a cost function, optimize the parameters.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (more importantly, it introduces the entire ml training loop: define a model, define a cost function, optimize the parameters).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (more importantly, it introduces the entire ml training loop: define a model, define a cost function, optimize the par...).
- Every ML algorithm follows this same pattern.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (every ml algorithm follows this same pattern).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (every ml algorithm follows this same pattern).
- Master it here with the simplest case, and you will recognize it everywhere.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (master it here with the simplest case, and you will recognize it everywhere).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (master it here with the simplest case, and you will recognize it everywhere).

---
## Reference Absorption: The Problem Deep Continuation
- This is not just for simple problems.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (this is not just for simple problems).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (this is not just for simple problems).
- Linear regression is used in production systems for demand forecasting, A/B test analysis, financial modeling, and as a baseline for every regression task.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (linear regression is used in production systems for demand forecasting, a/b test analysis, financial modeling, and as a baselin...).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (linear regression is used in production systems for demand forecasting, a/b test analysis, financial modeling, and as...).

---
## Reference Absorption: Exercises
- Implement batch gradient descent, stochastic gradient descent (SGD), and mini-batch gradient descent.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (implement batch gradient descent, stochastic gradient descent (sgd), and mini-batch gradient descent).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (implement batch gradient descent, stochastic gradient descent (sgd), and mini-batch gradient descent).
- Compare convergence speed on the same dataset.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (compare convergence speed on the same dataset).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (compare convergence speed on the same dataset).
- Which has the smoothest cost curve?
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (which has the smoothest cost curve?).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (which has the smoothest cost curve?).
- Generate data from a cubic function (y = ax^3 + bx^2 + cx + d + noise).
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (generate data from a cubic function (y = ax^3 + bx^2 + cx + d + noise)).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (generate data from a cubic function (y = ax^3 + bx^2 + cx + d + noise)).

---
## Reference Absorption: Exercises (cont.)
- Fit polynomials of degree 1, 3, and 10.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (fit polynomials of degree 1, 3, and 10).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (fit polynomials of degree 1, 3, and 10).
- Compare training R^2 and test R^2.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (compare training r^2 and test r^2).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (compare training r^2 and test r^2).
- At what degree does overfitting become obvious?
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (at what degree does overfitting become obvious?).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (at what degree does overfitting become obvious?).
- Train on the multi-feature housing data.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (train on the multi-feature housing data).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (train on the multi-feature housing data).

---
## Reference Absorption: Exercises Deep Continuation
- Compare which weights go to zero vs Ridge.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (compare which weights go to zero vs ridge).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (compare which weights go to zero vs ridge).
- Why does L1 produce sparse solutions while L2 does not?
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (why does l1 produce sparse solutions while l2 does not?).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (why does l1 produce sparse solutions while l2 does not?).

---
## Reference Absorption: Use It
- Now the same thing with scikit-learn, which is what you will actually use in production.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (now the same thing with scikit-learn, which is what you will actually use in production).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (now the same thing with scikit-learn, which is what you will actually use in production).
- Your from-scratch implementation and scikit-learn produce the same results.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (your from-scratch implementation and scikit-learn produce the same results).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (your from-scratch implementation and scikit-learn produce the same results).
- The difference: scikit-learn handles edge cases, numerical stability, and performance optimizations.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (the difference: scikit-learn handles edge cases, numerical stability, and performance optimizations).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (the difference: scikit-learn handles edge cases, numerical stability, and performance optimizations).
- Use the library for production.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (use the library for production).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (use the library for production).

---
## Reference Absorption: Use It (cont.)
- Use the from-scratch version to understand what is happening.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (use the from-scratch version to understand what is happening).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (use the from-scratch version to understand what is happening).

---
## Reference Absorption: Gradient Descent
- Gradient descent finds the bottom of the bowl by taking steps downhill.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (gradient descent finds the bottom of the bowl by taking steps downhill).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (gradient descent finds the bottom of the bowl by taking steps downhill).
- The gradients tell you two things: which direction to move each parameter, and how much to move.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (the gradients tell you two things: which direction to move each parameter, and how much to move).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (the gradients tell you two things: which direction to move each parameter, and how much to move).
- For MSE with y_hat = wx + b:
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (for mse with y_hat = wx + b:).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (for mse with y_hat = wx + b:).
- The learning rate controls step size.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (the learning rate controls step size).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (the learning rate controls step size).

---
## Reference Absorption: Gradient Descent (cont.)
- Too large: you overshoot the minimum and diverge.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (too large: you overshoot the minimum and diverge).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (too large: you overshoot the minimum and diverge).
- Too small: training takes forever.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (too small: training takes forever).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (too small: training takes forever).
- Typical starting values: 0.01, 0.001, or 0.0001.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (typical starting values: 0.01, 0.001, or 0.0001).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (typical starting values: 0.01, 0.001, or 0.0001).

---
## Reference Absorption: Further Reading
- [An Introduction to Statistical Learning (ISLR)](https://www.statlearning.com/) -- free PDF, chapters 3 and 6 cover linear regression and regularization with practical R examples
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade ([an introduction to statistical learning (islr)](https://www.statlearning.com/) -- free pdf, chapters 3 and 6 cover linear regr...).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept ([an introduction to statistical learning (islr)](https://www.statlearning.com/) -- free pdf, chapters 3 and 6 cover l...).
- [The Elements of Statistical Learning (ESL)](https://hastie.su.domains/ElemStatLearn/) -- free PDF, the more mathematical companion to ISLR with deeper treatment of ridge and lasso
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade ([the elements of statistical learning (esl)](https://hastie.su.domains/elemstatlearn/) -- free pdf, the more mathematical compa...).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept ([the elements of statistical learning (esl)](https://hastie.su.domains/elemstatlearn/) -- free pdf, the more mathemat...).
- [Stanford CS229 Lecture Notes on Linear Regression](https://cs229.stanford.edu/main_notes.pdf) -- Andrew Ng's notes deriving the normal equation and gradient descent from first principles
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade ([stanford cs229 lecture notes on linear regression](https://cs229.stanford.edu/main_notes.pdf) -- andrew ng's notes deriving th...).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept ([stanford cs229 lecture notes on linear regression](https://cs229.stanford.edu/main_notes.pdf) -- andrew ng's notes d...).
- [scikit-learn LinearRegression documentation](https://scikit-learn.org/stable/modules/linear_model.html) -- practical reference for LinearRegression, Ridge, Lasso, and ElasticNet with code examples
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade ([scikit-learn linearregression documentation](https://scikit-learn.org/stable/modules/linear_model.html) -- practical reference...).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept ([scikit-learn linearregression documentation](https://scikit-learn.org/stable/modules/linear_model.html) -- practical...).

---
## Reference Absorption: The Cost Function (Mean Squared Error)
- How do you measure "as close as possible"?
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (how do you measure "as close as possible"?).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (how do you measure "as close as possible"?).
- You need a single number that captures how wrong your predictions are.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (you need a single number that captures how wrong your predictions are).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (you need a single number that captures how wrong your predictions are).
- The most common choice is Mean Squared Error (MSE):
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (the most common choice is mean squared error (mse):).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (the most common choice is mean squared error (mse):).
- First, it penalizes large errors more than small errors (an error of 10 is 100x worse than an error of 1, not 10x).
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (first, it penalizes large errors more than small errors (an error of 10 is 100x worse than an error of 1, not 10x)).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (first, it penalizes large errors more than small errors (an error of 10 is 100x worse than an error of 1, not 10x)).

---
## Reference Absorption: The Cost Function (Mean Squared Error) (cont.)
- Second, the squared function is smooth and differentiable everywhere, which makes optimization straightforward.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (second, the squared function is smooth and differentiable everywhere, which makes optimization straightforward).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (second, the squared function is smooth and differentiable everywhere, which makes optimization straightforward).
- The cost function creates a surface.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (the cost function creates a surface).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (the cost function creates a surface).
- For a single weight w and bias b, the MSE surface looks like a bowl (a convex paraboloid).
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (for a single weight w and bias b, the mse surface looks like a bowl (a convex paraboloid)).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (for a single weight w and bias b, the mse surface looks like a bowl (a convex paraboloid)).
- The bottom of the bowl is where MSE is minimized.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (the bottom of the bowl is where mse is minimized).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (the bottom of the bowl is where mse is minimized).

---
## Reference Absorption: The Cost Function (Mean Squared Error) Deep Continuation
- Training means finding that bottom.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (training means finding that bottom).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (training means finding that bottom).

---
## Reference Absorption: Multiple Linear Regression
- With multiple features, the model becomes:
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (with multiple features, the model becomes:).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (with multiple features, the model becomes:).
- Everything works the same: MSE is the cost function, gradient descent updates all weights simultaneously.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (everything works the same: mse is the cost function, gradient descent updates all weights simultaneously).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (everything works the same: mse is the cost function, gradient descent updates all weights simultaneously).
- The only difference is that you are fitting a hyperplane instead of a line.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (the only difference is that you are fitting a hyperplane instead of a line).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (the only difference is that you are fitting a hyperplane instead of a line).
- Feature scaling matters here.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (feature scaling matters here).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (feature scaling matters here).

---
## Reference Absorption: Multiple Linear Regression (cont.)
- If one feature ranges from 0 to 1 and another ranges from 0 to 1,000,000, gradient descent will struggle because the cost surface becomes elongated.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (if one feature ranges from 0 to 1 and another ranges from 0 to 1,000,000, gradient descent will struggle because the cost surfa...).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (if one feature ranges from 0 to 1 and another ranges from 0 to 1,000,000, gradient descent will struggle because the...).
- Standardize features (subtract mean, divide by standard deviation) before training.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (standardize features (subtract mean, divide by standard deviation) before training).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (standardize features (subtract mean, divide by standard deviation) before training).

---
## Reference Absorption: The Model
- Linear regression assumes a linear relationship between input (x) and output (y):
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (linear regression assumes a linear relationship between input (x) and output (y):).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (linear regression assumes a linear relationship between input (x) and output (y):).
- w (weight/slope): how much y changes when x increases by 1
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (w (weight/slope): how much y changes when x increases by 1).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (w (weight/slope): how much y changes when x increases by 1).
- b (bias/intercept): the value of y when x = 0
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (b (bias/intercept): the value of y when x = 0).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (b (bias/intercept): the value of y when x = 0).
- For multiple inputs (features), this extends to:
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (for multiple inputs (features), this extends to:).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (for multiple inputs (features), this extends to:).

---
## Reference Absorption: The Model (cont.)
- Or in vector form: y = w^T * x + b
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (or in vector form: y = w^t * x + b).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (or in vector form: y = w^t * x + b).
- The goal: find the values of w and b that make the predicted y as close as possible to the actual y across all training examples.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (the goal: find the values of w and b that make the predicted y as close as possible to the actual y across all training examples).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (the goal: find the values of w and b that make the predicted y as close as possible to the actual y across all traini...).

---
## Reference Absorption: Polynomial Regression
- What if the relationship is not linear?
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (what if the relationship is not linear?).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (what if the relationship is not linear?).
- You can still use linear regression by creating polynomial features:
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (you can still use linear regression by creating polynomial features:).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (you can still use linear regression by creating polynomial features:).
- This is still "linear" regression because the model is linear in the weights (w1, w2, w3).
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (this is still "linear" regression because the model is linear in the weights (w1, w2, w3)).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (this is still "linear" regression because the model is linear in the weights (w1, w2, w3)).
- You are just using nonlinear features of x.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (you are just using nonlinear features of x).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (you are just using nonlinear features of x).

---
## Reference Absorption: Polynomial Regression (cont.)
- Higher-degree polynomials can fit more complex curves but risk overfitting.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (higher-degree polynomials can fit more complex curves but risk overfitting).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (higher-degree polynomials can fit more complex curves but risk overfitting).
- A degree-10 polynomial will pass through every point in a 10-point dataset but predict poorly on new data.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (a degree-10 polynomial will pass through every point in a 10-point dataset but predict poorly on new data).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (a degree-10 polynomial will pass through every point in a 10-point dataset but predict poorly on new data).

---
## Reference Absorption: Learning Objectives
- Derive the gradient descent update rules for mean squared error and implement linear regression from scratch
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (derive the gradient descent update rules for mean squared error and implement linear regression from scratch).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (derive the gradient descent update rules for mean squared error and implement linear regression from scratch).
- Compare gradient descent and the normal equation in terms of computational complexity and when to use each
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (compare gradient descent and the normal equation in terms of computational complexity and when to use each).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (compare gradient descent and the normal equation in terms of computational complexity and when to use each).
- Build a multiple linear regression model with feature standardization and interpret the learned weights
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (build a multiple linear regression model with feature standardization and interpret the learned weights).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (build a multiple linear regression model with feature standardization and interpret the learned weights).
- Explain how Ridge regression (L2 regularization) prevents overfitting by penalizing large weights
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (explain how ridge regression (l2 regularization) prevents overfitting by penalizing large weights).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (explain how ridge regression (l2 regularization) prevents overfitting by penalizing large weights).

---
## Reference Absorption: Regularization Preview (Ridge Regression)
- When you have many features, the model can overfit by assigning large weights.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (when you have many features, the model can overfit by assigning large weights).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (when you have many features, the model can overfit by assigning large weights).
- Ridge regression (L2 regularization) adds a penalty:
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (ridge regression (l2 regularization) adds a penalty:).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (ridge regression (l2 regularization) adds a penalty:).
- The penalty term discourages large weights.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (the penalty term discourages large weights).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (the penalty term discourages large weights).
- The hyperparameter lambda controls the tradeoff: higher lambda means smaller weights and more regularization.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (the hyperparameter lambda controls the tradeoff: higher lambda means smaller weights and more regularization).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (the hyperparameter lambda controls the tradeoff: higher lambda means smaller weights and more regularization).

---
## Reference Absorption: Regularization Preview (Ridge Regression) (cont.)
- This is covered in depth in a later lesson.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (this is covered in depth in a later lesson).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (this is covered in depth in a later lesson).
- For now, know that it exists and why it helps.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (for now, know that it exists and why it helps).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (for now, know that it exists and why it helps).

---
## Reference Absorption: R-Squared Score
- MSE tells you how wrong you are, but the number depends on the scale of y.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (mse tells you how wrong you are, but the number depends on the scale of y).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (mse tells you how wrong you are, but the number depends on the scale of y).
- R-squared (R^2) gives a scale-independent measure:
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (r-squared (r^2) gives a scale-independent measure:).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (r-squared (r^2) gives a scale-independent measure:).
- R^2 = 1.0: perfect predictions
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (r^2 = 1.0: perfect predictions).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (r^2 = 1.0: perfect predictions).
- R^2 = 0.0: the model is no better than predicting the mean every time
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (r^2 = 0.0: the model is no better than predicting the mean every time).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (r^2 = 0.0: the model is no better than predicting the mean every time).

---
## Reference Absorption: R-Squared Score (cont.)
- R^2 < 0.0: the model is worse than predicting the mean
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (r^2 < 0.0: the model is worse than predicting the mean).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (r^2 < 0.0: the model is worse than predicting the mean).

---
## Beyond Reference: Engineering Translation
- Core anchors for this module: self, print, poly, regression, cost, features, actual, mean.
- Convert each theoretical primitive into measurable training and inference behaviors.
- Define observability checkpoints for drift, calibration, and latency regressions.
- Tie assumptions to explicit data contracts and fallback policies.

---
## Beyond Reference: Advanced Layer 1
- Derive normal equation conditioning limits and choose numerically stable solvers for ill-conditioned X^T X.
- Risk and governance extension: convert this into acceptance tests and rollback criteria (derive normal equation conditioning limits and choose numerically stable solvers for ill-conditioned x^t x.).
- Quantify bias introduced by regularization and when it reduces total generalization error.
- Risk and governance extension: convert this into acceptance tests and rollback criteria (quantify bias introduced by regularization and when it reduces total generalization error.).
- Design residual diagnostics to detect heteroscedasticity and model misspecification.
- Risk and governance extension: convert this into acceptance tests and rollback criteria (design residual diagnostics to detect heteroscedasticity and model misspecification.).

<!-- DEPTH_EXPANSION_END -->
