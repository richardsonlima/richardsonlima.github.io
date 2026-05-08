---
layout: slides
title: "Time Series Fundamentals"
category: "ai-engineering-course-step-02"
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
# Step 02 - ML Fundamentals
## Module 15: Time Series Fundamentals
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
- You have data ordered by time.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (you have data ordered by time).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (you have data ordered by time).
- Daily sales, hourly temperature, per-minute CPU usage, weekly stock prices.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (daily sales, hourly temperature, per-minute cpu usage, weekly stock prices).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (daily sales, hourly temperature, per-minute cpu usage, weekly stock prices).
- You want to predict the next value, the next week, the next quarter.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (you want to predict the next value, the next week, the next quarter).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (you want to predict the next value, the next week, the next quarter).
- You reach for your standard ML toolkit: random train/test split, cross-validation, feature matrix in, prediction out.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (you reach for your standard ml toolkit: random train/test split, cross-validation, feature matrix in, prediction out).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (you reach for your standard ml toolkit: random train/test split, cross-validation, feature matrix in, prediction out).

---
## Reference Absorption: The Problem (cont.)
- Time series breaks the assumptions that standard ML relies on.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (time series breaks the assumptions that standard ml relies on).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (time series breaks the assumptions that standard ml relies on).
- Samples are not independent -- today's temperature depends on yesterday's.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (samples are not independent -- today's temperature depends on yesterday's).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (samples are not independent -- today's temperature depends on yesterday's).
- Random splits leak future information into the past.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (random splits leak future information into the past).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (random splits leak future information into the past).
- Features that look great in backtest fail in production because they rely on patterns that shift over time.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (features that look great in backtest fail in production because they rely on patterns that shift over time).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (features that look great in backtest fail in production because they rely on patterns that shift over time).

---
## Reference Absorption: The Problem Deep Continuation
- A model that gets 95% accuracy with random cross-validation might get 55% with proper time-based evaluation.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (a model that gets 95% accuracy with random cross-validation might get 55% with proper time-based evaluation).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (a model that gets 95% accuracy with random cross-validation might get 55% with proper time-based evaluation).
- The difference is not a technicality.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (the difference is not a technicality).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (the difference is not a technicality).
- It is the difference between a model that works on paper and one that works in production.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (it is the difference between a model that works on paper and one that works in production).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (it is the difference between a model that works on paper and one that works in production).
- This lesson covers the fundamentals: what makes time data different, how to evaluate models honestly, and how to turn a time series into features that standard ML models can consume.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (this lesson covers the fundamentals: what makes time data different, how to evaluate models honestly, and how to turn a time se...).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (this lesson covers the fundamentals: what makes time data different, how to evaluate models honestly, and how to turn...).

---
## Reference Absorption: Exercises
- Stationarity experiment. Generate a series with a linear trend.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (stationarity experiment. generate a series with a linear trend).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (stationarity experiment. generate a series with a linear trend).
- Check stationarity with rolling statistics.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (check stationarity with rolling statistics).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (check stationarity with rolling statistics).
- How many rounds of differencing does it take for a quadratic trend?
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (how many rounds of differencing does it take for a quadratic trend?).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (how many rounds of differencing does it take for a quadratic trend?).
- Lag selection. Compute ACF on a seasonal series (period=7).
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (lag selection. compute acf on a seasonal series (period=7)).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (lag selection. compute acf on a seasonal series (period=7)).

---
## Reference Absorption: Exercises (cont.)
- Which lags have the highest autocorrelation?
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (which lags have the highest autocorrelation?).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (which lags have the highest autocorrelation?).
- Create lag features using only those lags (not consecutive lags).
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (create lag features using only those lags (not consecutive lags)).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (create lag features using only those lags (not consecutive lags)).
- Does accuracy improve compared to using lags 1 through 7?
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (does accuracy improve compared to using lags 1 through 7?).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (does accuracy improve compared to using lags 1 through 7?).
- Walk-forward vs random split. Train a Ridge regression on lag features.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (walk-forward vs random split. train a ridge regression on lag features).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (walk-forward vs random split. train a ridge regression on lag features).

---
## Reference Absorption: Exercises Deep Continuation
- Evaluate with random 80/20 split and with walk-forward validation.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (evaluate with random 80/20 split and with walk-forward validation).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (evaluate with random 80/20 split and with walk-forward validation).
- How much does the random split overestimate performance?
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (how much does the random split overestimate performance?).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (how much does the random split overestimate performance?).
- Feature engineering. Add rolling mean (window=7), rolling std (window=7), and day-of-week features to the lag features.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (feature engineering. add rolling mean (window=7), rolling std (window=7), and day-of-week features to the lag features).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (feature engineering. add rolling mean (window=7), rolling std (window=7), and day-of-week features to the lag features).
- Compare accuracy with and without these extras using walk-forward validation.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (compare accuracy with and without these extras using walk-forward validation).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (compare accuracy with and without these extras using walk-forward validation).

---
## Reference Absorption: Exercises Deep Continuation
- Multi-step forecasting. Modify the AR model to predict 5 steps ahead instead of 1.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (multi-step forecasting. modify the ar model to predict 5 steps ahead instead of 1).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (multi-step forecasting. modify the ar model to predict 5 steps ahead instead of 1).
- Compare two strategies: (a) predict one step, use the prediction as input for the next step (recursive), and (b) train separate models for each horizon (direct).
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (compare two strategies: (a) predict one step, use the prediction as input for the next step (recursive), and (b) train separate...).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (compare two strategies: (a) predict one step, use the prediction as input for the next step (recursive), and (b) trai...).

---
## Reference Absorption: Lag Features: Turning Time Series into Supervised Learning
- Standard ML models need a feature matrix X and a target y.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (standard ml models need a feature matrix x and a target y).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (standard ml models need a feature matrix x and a target y).
- Time series gives you a single column of values.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (time series gives you a single column of values).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (time series gives you a single column of values).
- Take the series [10, 12, 14, 13, 15] and create lag-1 and lag-2 features:
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (take the series [10, 12, 14, 13, 15] and create lag-1 and lag-2 features:).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (take the series [10, 12, 14, 13, 15] and create lag-1 and lag-2 features:).
- Now you have a standard regression problem.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (now you have a standard regression problem).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (now you have a standard regression problem).

---
## Reference Absorption: Lag Features: Turning Time Series into Supervised Learning (cont.)
- Any ML model (linear regression, random forest, gradient boosting) can predict the target from the lags.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (any ml model (linear regression, random forest, gradient boosting) can predict the target from the lags).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (any ml model (linear regression, random forest, gradient boosting) can predict the target from the lags).
- Additional features you can engineer:
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (additional features you can engineer:).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (additional features you can engineer:).
- Rolling statistics: mean, std, min, max over the last k values
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (rolling statistics: mean, std, min, max over the last k values).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (rolling statistics: mean, std, min, max over the last k values).
- Calendar features: day of week, month, is_holiday, is_weekend
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (calendar features: day of week, month, is_holiday, is_weekend).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (calendar features: day of week, month, is_holiday, is_weekend).

---
## Reference Absorption: Lag Features: Turning Time Series into Supervised Learning Deep Continuation
- Differenced values: change from previous step
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (differenced values: change from previous step).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (differenced values: change from previous step).
- Expanding statistics: cumulative mean, cumulative sum
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (expanding statistics: cumulative mean, cumulative sum).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (expanding statistics: cumulative mean, cumulative sum).
- Ratio features: current value / rolling mean (how far from recent average)
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (ratio features: current value / rolling mean (how far from recent average)).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (ratio features: current value / rolling mean (how far from recent average)).
- Interaction features: lag_1 * day_of_week (weekday effects on momentum)
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (interaction features: lag_1 * day_of_week (weekday effects on momentum)).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (interaction features: lag_1 * day_of_week (weekday effects on momentum)).

---
## Reference Absorption: Lag Features: Turning Time Series into Supervised Learning Deep Continuation
- How many lags? Use the autocorrelation function.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (how many lags? use the autocorrelation function).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (how many lags? use the autocorrelation function).
- If ACF is significant up to lag 10, use at least 10 lags.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (if acf is significant up to lag 10, use at least 10 lags).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (if acf is significant up to lag 10, use at least 10 lags).
- If there is weekly seasonality, include lag 7 (and possibly 14).
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (if there is weekly seasonality, include lag 7 (and possibly 14)).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (if there is weekly seasonality, include lag 7 (and possibly 14)).
- More lags give the model more history but also more features to fit, increasing the risk of overfitting.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (more lags give the model more history but also more features to fit, increasing the risk of overfitting).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (more lags give the model more history but also more features to fit, increasing the risk of overfitting).

---
## Reference Absorption: Lag Features: Turning Time Series into Supervised Learning Deep Continuation
- The target alignment trap. When creating lag features, the target must be the value at time t, and all features must use values at time t-1 or earlier.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (the target alignment trap. when creating lag features, the target must be the value at time t, and all features must use values...).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (the target alignment trap. when creating lag features, the target must be the value at time t, and all features must...).
- If you accidentally include the value at time t as a feature, you have a perfect predictor -- and a completely useless model.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (if you accidentally include the value at time t as a feature, you have a perfect predictor -- and a completely useless model).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (if you accidentally include the value at time t as a feature, you have a perfect predictor -- and a completely useles...).
- This is the most common bug in time series feature engineering.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (this is the most common bug in time series feature engineering).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (this is the most common bug in time series feature engineering).

---
## Reference Absorption: Stationarity
- A time series is stationary if its statistical properties (mean, variance, autocorrelation) do not change over time.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (a time series is stationary if its statistical properties (mean, variance, autocorrelation) do not change over time).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (a time series is stationary if its statistical properties (mean, variance, autocorrelation) do not change over time).
- Most forecasting methods assume stationarity.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (most forecasting methods assume stationarity).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (most forecasting methods assume stationarity).
- Why it matters: A non-stationary series has a mean that drifts.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (why it matters: a non-stationary series has a mean that drifts).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (why it matters: a non-stationary series has a mean that drifts).
- A model trained on data from January has learned a different mean than what February will show.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (a model trained on data from january has learned a different mean than what february will show).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (a model trained on data from january has learned a different mean than what february will show).

---
## Reference Absorption: Stationarity (cont.)
- It will be systematically wrong.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (it will be systematically wrong).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (it will be systematically wrong).
- How to check: Compute rolling mean and rolling standard deviation over windows.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (how to check: compute rolling mean and rolling standard deviation over windows).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (how to check: compute rolling mean and rolling standard deviation over windows).
- If they drift, the series is non-stationary.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (if they drift, the series is non-stationary).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (if they drift, the series is non-stationary).
- Instead of modeling the raw values, model the change between consecutive values:
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (instead of modeling the raw values, model the change between consecutive values:).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (instead of modeling the raw values, model the change between consecutive values:).

---
## Reference Absorption: Stationarity Deep Continuation
- If one round of differencing does not make the series stationary, apply it again (second-order differencing).
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (if one round of differencing does not make the series stationary, apply it again (second-order differencing)).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (if one round of differencing does not make the series stationary, apply it again (second-order differencing)).
- Most real-world series need at most two rounds.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (most real-world series need at most two rounds).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (most real-world series need at most two rounds).
- Original series: [100, 102, 106, 112, 120]
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (original series: [100, 102, 106, 112, 120]).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (original series: [100, 102, 106, 112, 120]).
- First difference: [2, 4, 6, 8] (still trending upward)
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (first difference: [2, 4, 6, 8] (still trending upward)).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (first difference: [2, 4, 6, 8] (still trending upward)).

---
## Reference Absorption: Stationarity Deep Continuation
- Second difference: [2, 2, 2] (constant -- stationary)
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (second difference: [2, 2, 2] (constant -- stationary)).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (second difference: [2, 2, 2] (constant -- stationary)).
- The original series had a quadratic trend.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (the original series had a quadratic trend).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (the original series had a quadratic trend).
- First differencing turned it into a linear trend.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (first differencing turned it into a linear trend).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (first differencing turned it into a linear trend).
- Second differencing made it flat.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (second differencing made it flat).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (second differencing made it flat).

---
## Reference Absorption: Stationarity Deep Continuation
- In practice, you rarely need more than two rounds.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (in practice, you rarely need more than two rounds).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (in practice, you rarely need more than two rounds).
- Formal test: The Augmented Dickey-Fuller (ADF) test is the standard statistical test for stationarity.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (formal test: the augmented dickey-fuller (adf) test is the standard statistical test for stationarity).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (formal test: the augmented dickey-fuller (adf) test is the standard statistical test for stationarity).
- The null hypothesis is "the series is non-stationary." A p-value below 0.05 means you can reject the null and conclude stationarity.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (the null hypothesis is "the series is non-stationary." a p-value below 0.05 means you can reject the null and conclude stationa...).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (the null hypothesis is "the series is non-stationary." a p-value below 0.05 means you can reject the null and conclud...).
- We do not implement ADF from scratch (it requires asymptotic distribution tables), but the rolling statistics approach in our code gives a practical visual check.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (we do not implement adf from scratch (it requires asymptotic distribution tables), but the rolling statistics approach in our c...).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (we do not implement adf from scratch (it requires asymptotic distribution tables), but the rolling statistics approac...).

---
## Reference Absorption: Walk-Forward Validation
- This is the most important concept in this lesson.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (this is the most important concept in this lesson).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (this is the most important concept in this lesson).
- Standard k-fold cross-validation randomly assigns samples to train and test.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (standard k-fold cross-validation randomly assigns samples to train and test).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (standard k-fold cross-validation randomly assigns samples to train and test).
- For time series, this leaks future information.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (for time series, this leaks future information).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (for time series, this leaks future information).
- Predict at time t+1 (or t+1 to t+k for multi-step)
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (predict at time t+1 (or t+1 to t+k for multi-step)).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (predict at time t+1 (or t+1 to t+k for multi-step)).

---
## Reference Absorption: Walk-Forward Validation (cont.)
- Each test fold only contains data that comes after all training data.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (each test fold only contains data that comes after all training data).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (each test fold only contains data that comes after all training data).
- This gives you an honest estimate of how the model will perform when deployed.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (this gives you an honest estimate of how the model will perform when deployed).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (this gives you an honest estimate of how the model will perform when deployed).
- Expanding window uses all historical data for training (window grows).
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (expanding window uses all historical data for training (window grows)).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (expanding window uses all historical data for training (window grows)).
- Sliding window uses a fixed-size training window (window slides).
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (sliding window uses a fixed-size training window (window slides)).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (sliding window uses a fixed-size training window (window slides)).

---
## Reference Absorption: Walk-Forward Validation Deep Continuation
- Use expanding when you believe older data is still relevant.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (use expanding when you believe older data is still relevant).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (use expanding when you believe older data is still relevant).
- Use sliding when the world changes and old data hurts.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (use sliding when the world changes and old data hurts).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (use sliding when the world changes and old data hurts).

---
## Reference Absorption: Practical Tips
- Start with plotting. Before any modeling, plot the raw series.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (start with plotting. before any modeling, plot the raw series).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (start with plotting. before any modeling, plot the raw series).
- Look for trends, seasonality, outliers, structural breaks (sudden changes in behavior).
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (look for trends, seasonality, outliers, structural breaks (sudden changes in behavior)).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (look for trends, seasonality, outliers, structural breaks (sudden changes in behavior)).
- A 30-second visual inspection often tells you more than an hour of automated analysis.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (a 30-second visual inspection often tells you more than an hour of automated analysis).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (a 30-second visual inspection often tells you more than an hour of automated analysis).
- Difference first, model second. If the series has a clear trend, difference it before creating lag features.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (difference first, model second. if the series has a clear trend, difference it before creating lag features).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (difference first, model second. if the series has a clear trend, difference it before creating lag features).

---
## Reference Absorption: Practical Tips (cont.)
- Tree-based models can handle trends, but linear models cannot, and differencing never hurts.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (tree-based models can handle trends, but linear models cannot, and differencing never hurts).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (tree-based models can handle trends, but linear models cannot, and differencing never hurts).
- Hold out at least one full seasonal cycle. If you have weekly seasonality, your test set needs at least one full week.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (hold out at least one full seasonal cycle. if you have weekly seasonality, your test set needs at least one full week).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (hold out at least one full seasonal cycle. if you have weekly seasonality, your test set needs at least one full week).
- If monthly, at least one full month.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (if monthly, at least one full month).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (if monthly, at least one full month).
- Otherwise you cannot evaluate whether the model captured the seasonal pattern.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (otherwise you cannot evaluate whether the model captured the seasonal pattern).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (otherwise you cannot evaluate whether the model captured the seasonal pattern).

---
## Reference Absorption: Practical Tips Deep Continuation
- Monitor in production. Time series models degrade over time as the world changes.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (monitor in production. time series models degrade over time as the world changes).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (monitor in production. time series models degrade over time as the world changes).
- Track prediction errors on a rolling basis.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (track prediction errors on a rolling basis).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (track prediction errors on a rolling basis).
- When errors start increasing, retrain the model on recent data.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (when errors start increasing, retrain the model on recent data).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (when errors start increasing, retrain the model on recent data).
- Beware of regime changes. A model trained on pre-pandemic data will not predict post-pandemic behavior.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (beware of regime changes. a model trained on pre-pandemic data will not predict post-pandemic behavior).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (beware of regime changes. a model trained on pre-pandemic data will not predict post-pandemic behavior).

---
## Reference Absorption: Practical Tips Deep Continuation
- Include indicators of known regime changes as features, or use a sliding window that forgets old data.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (include indicators of known regime changes as features, or use a sliding window that forgets old data).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (include indicators of known regime changes as features, or use a sliding window that forgets old data).
- Log-transform skewed series. Revenue, prices, and counts are often right-skewed.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (log-transform skewed series. revenue, prices, and counts are often right-skewed).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (log-transform skewed series. revenue, prices, and counts are often right-skewed).
- Taking the log stabilizes variance and makes multiplicative patterns additive, which linear models can handle.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (taking the log stabilizes variance and makes multiplicative patterns additive, which linear models can handle).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (taking the log stabilizes variance and makes multiplicative patterns additive, which linear models can handle).
- Forecast in log space, then exponentiate to get back to original units.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (forecast in log space, then exponentiate to get back to original units).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (forecast in log space, then exponentiate to get back to original units).

---
## Reference Absorption: What Makes Time Series Different
- independent and identically distributed.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (independent and identically distributed).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (independent and identically distributed).
- Each sample is drawn from the same distribution, independently of other samples.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (each sample is drawn from the same distribution, independently of other samples).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (each sample is drawn from the same distribution, independently of other samples).
- Not independent. Today's stock price depends on yesterday's. This week's sales correlate with last week's.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (not independent. today's stock price depends on yesterday's. this week's sales correlate with last week's).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (not independent. today's stock price depends on yesterday's. this week's sales correlate with last week's).
- Not identically distributed. The distribution shifts over time. Sales in December look different from sales in March.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (not identically distributed. the distribution shifts over time. sales in december look different from sales in march).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (not identically distributed. the distribution shifts over time. sales in december look different from sales in march).

---
## Reference Absorption: What Makes Time Series Different (cont.)
- These violations are not minor.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (these violations are not minor).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (these violations are not minor).
- They change how you build features, how you evaluate models, and which algorithms work.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (they change how you build features, how you evaluate models, and which algorithms work).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (they change how you build features, how you evaluate models, and which algorithms work).
- In standard ML, samples are interchangeable.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (in standard ml, samples are interchangeable).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (in standard ml, samples are interchangeable).
- Shuffling them changes nothing.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (shuffling them changes nothing).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (shuffling them changes nothing).

---
## Reference Absorption: What Makes Time Series Different Deep Continuation
- In time series, order is everything.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (in time series, order is everything).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (in time series, order is everything).
- Shuffling destroys the signal.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (shuffling destroys the signal).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (shuffling destroys the signal).

---
## Reference Absorption: Forecasting Horizons and Strategies
- Single-step forecasting predicts one time step ahead.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (single-step forecasting predicts one time step ahead).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (single-step forecasting predicts one time step ahead).
- Multi-step forecasting predicts multiple steps.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (multi-step forecasting predicts multiple steps).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (multi-step forecasting predicts multiple steps).
- Recursive (iterated): Predict one step ahead, use the prediction as input for the next step.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (recursive (iterated): predict one step ahead, use the prediction as input for the next step).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (recursive (iterated): predict one step ahead, use the prediction as input for the next step).
- Simple but errors accumulate -- each prediction uses the previous prediction, so mistakes compound.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (simple but errors accumulate -- each prediction uses the previous prediction, so mistakes compound).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (simple but errors accumulate -- each prediction uses the previous prediction, so mistakes compound).

---
## Reference Absorption: Forecasting Horizons and Strategies (cont.)
- Direct: Train a separate model for each horizon.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (direct: train a separate model for each horizon).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (direct: train a separate model for each horizon).
- Model-1 predicts t+1, Model-5 predicts t+5.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (model-1 predicts t+1, model-5 predicts t+5).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (model-1 predicts t+1, model-5 predicts t+5).
- No error accumulation, but each model has fewer training samples and they do not share information.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (no error accumulation, but each model has fewer training samples and they do not share information).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (no error accumulation, but each model has fewer training samples and they do not share information).
- Multi-output: Train one model that outputs all horizons simultaneously.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (multi-output: train one model that outputs all horizons simultaneously).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (multi-output: train one model that outputs all horizons simultaneously).

---
## Reference Absorption: Forecasting Horizons and Strategies Deep Continuation
- Shares information across horizons but requires a model that supports multiple outputs (or a custom loss function).
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (shares information across horizons but requires a model that supports multiple outputs (or a custom loss function)).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (shares information across horizons but requires a model that supports multiple outputs (or a custom loss function)).
- For most practical problems, start with recursive for short horizons (1-5 steps) and direct for longer horizons.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (for most practical problems, start with recursive for short horizons (1-5 steps) and direct for longer horizons).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (for most practical problems, start with recursive for short horizons (1-5 steps) and direct for longer horizons).

---
## Reference Absorption: Evaluation Metrics
- Time series forecasting uses regression metrics, but with time-aware context:
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (time series forecasting uses regression metrics, but with time-aware context:).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (time series forecasting uses regression metrics, but with time-aware context:).
- RMSE (Root Mean Squared Error): Square root of mean squared error. Penalizes large errors more than MAE. Use when big errors are worse than many small errors.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (rmse (root mean squared error): square root of mean squared error. penalizes large errors more than mae. use when big errors ar...).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (rmse (root mean squared error): square root of mean squared error. penalizes large errors more than mae. use when big...).
- Naive baseline comparison: Always compare against simple baselines. The seasonal naive baseline predicts the value from one period ago (yesterday, last week). If your model cannot beat naive, something is wr...
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (naive baseline comparison: always compare against simple baselines. the seasonal naive baseline predicts the value from one per...).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (naive baseline comparison: always compare against simple baselines. the seasonal naive baseline predicts the value fr...).

---
## Reference Absorption: Stationarity Check
- The code computes rolling statistics to visually and numerically assess stationarity:
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (the code computes rolling statistics to visually and numerically assess stationarity:).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (the code computes rolling statistics to visually and numerically assess stationarity:).
- If the rolling mean drifts or the rolling std changes, the series is non-stationary.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (if the rolling mean drifts or the rolling std changes, the series is non-stationary).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (if the rolling mean drifts or the rolling std changes, the series is non-stationary).
- Apply differencing and check again.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (apply differencing and check again).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (apply differencing and check again).
- The code also checks stationarity by comparing the first half and second half of the series.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (the code also checks stationarity by comparing the first half and second half of the series).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (the code also checks stationarity by comparing the first half and second half of the series).

---
## Reference Absorption: Stationarity Check (cont.)
- If the means differ by more than half a standard deviation or the variance ratio exceeds 2x, the series is flagged as non-stationary.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (if the means differ by more than half a standard deviation or the variance ratio exceeds 2x, the series is flagged as non-stati...).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (if the means differ by more than half a standard deviation or the variance ratio exceeds 2x, the series is flagged as...).

---
## Reference Absorption: sklearn TimeSeriesSplit
- sklearn provides TimeSeriesSplit which implements walk-forward validation:
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (sklearn provides timeseriessplit which implements walk-forward validation:).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (sklearn provides timeseriessplit which implements walk-forward validation:).
- This is equivalent to our from-scratch walk_forward_split but integrated into sklearn's cross-validation framework.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (this is equivalent to our from-scratch walk_forward_split but integrated into sklearn's cross-validation framework).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (this is equivalent to our from-scratch walk_forward_split but integrated into sklearn's cross-validation framework).
- You can use it with cross_val_score:
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (you can use it with cross_val_score:).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (you can use it with cross_val_score:).

---
## Reference Absorption: When to Use What
- For most practical problems, lag features + gradient boosting is the strongest starting point.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (for most practical problems, lag features + gradient boosting is the strongest starting point).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (for most practical problems, lag features + gradient boosting is the strongest starting point).
- It handles external features naturally, does not require stationarity, and is easy to debug.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (it handles external features naturally, does not require stationarity, and is easy to debug).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (it handles external features naturally, does not require stationarity, and is easy to debug).

---
## Reference Absorption: Autocorrelation
- Autocorrelation measures how much a value at time t correlates with the value at time t-k (k steps in the past).
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (autocorrelation measures how much a value at time t correlates with the value at time t-k (k steps in the past)).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (autocorrelation measures how much a value at time t correlates with the value at time t-k (k steps in the past)).
- The autocorrelation function (ACF) plots this correlation for each lag k.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (the autocorrelation function (acf) plots this correlation for each lag k).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (the autocorrelation function (acf) plots this correlation for each lag k).
- How far back the series remembers. If ACF drops to zero after lag 5, values more than 5 steps ago are irrelevant.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (how far back the series remembers. if acf drops to zero after lag 5, values more than 5 steps ago are irrelevant).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (how far back the series remembers. if acf drops to zero after lag 5, values more than 5 steps ago are irrelevant).
- Whether seasonality exists. If ACF spikes at lag 12 (monthly data), there is yearly seasonality.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (whether seasonality exists. if acf spikes at lag 12 (monthly data), there is yearly seasonality).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (whether seasonality exists. if acf spikes at lag 12 (monthly data), there is yearly seasonality).

---
## Reference Absorption: Autocorrelation (cont.)
- How many lag features to create. Use lags up to where ACF becomes negligible.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (how many lag features to create. use lags up to where acf becomes negligible).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (how many lag features to create. use lags up to where acf becomes negligible).
- PACF (Partial Autocorrelation Function) removes indirect correlations.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (pacf (partial autocorrelation function) removes indirect correlations).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (pacf (partial autocorrelation function) removes indirect correlations).
- If today correlates with 3 days ago only because both correlate with yesterday, PACF at lag 3 will be zero while ACF at lag 3 will not.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (if today correlates with 3 days ago only because both correlate with yesterday, pacf at lag 3 will be zero while acf at lag 3 w...).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (if today correlates with 3 days ago only because both correlate with yesterday, pacf at lag 3 will be zero while acf...).

---
## Reference Absorption: Components of a Time Series
- Every time series is a combination of:
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (every time series is a combination of:).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (every time series is a combination of:).
- Trend: The long-term direction. Revenue growing 10% per year. Global temperature rising.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (trend: the long-term direction. revenue growing 10% per year. global temperature rising).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (trend: the long-term direction. revenue growing 10% per year. global temperature rising).
- Seasonality: Repeating patterns at fixed intervals. Retail sales spike in December. Air conditioning usage peaks in July.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (seasonality: repeating patterns at fixed intervals. retail sales spike in december. air conditioning usage peaks in july).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (seasonality: repeating patterns at fixed intervals. retail sales spike in december. air conditioning usage peaks in july).
- Residual: Whatever is left after removing trend and seasonality. If the residual looks like white noise, the decomposition captured the signal.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (residual: whatever is left after removing trend and seasonality. if the residual looks like white noise, the decomposition capt...).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (residual: whatever is left after removing trend and seasonality. if the residual looks like white noise, the decompos...).

---
## Reference Absorption: ARIMA Intuition
- ARIMA is the classical time series model.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (arima is the classical time series model).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (arima is the classical time series model).
- AR (Autoregressive): Predict from past values. AR(p) uses the last p values.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (ar (autoregressive): predict from past values. ar(p) uses the last p values).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (ar (autoregressive): predict from past values. ar(p) uses the last p values).
- I (Integrated): Differencing to achieve stationarity. I(d) applies d rounds of differencing.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (i (integrated): differencing to achieve stationarity. i(d) applies d rounds of differencing).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (i (integrated): differencing to achieve stationarity. i(d) applies d rounds of differencing).
- MA (Moving Average): Predict from past forecast errors. MA(q) uses the last q errors.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (ma (moving average): predict from past forecast errors. ma(q) uses the last q errors).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (ma (moving average): predict from past forecast errors. ma(q) uses the last q errors).

---
## Reference Absorption: ARIMA Intuition (cont.)
- ARIMA(p, d, q) combines all three.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (arima(p, d, q) combines all three).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (arima(p, d, q) combines all three).
- You choose p, d, q based on ACF/PACF analysis or automated search (auto-ARIMA).
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (you choose p, d, q based on acf/pacf analysis or automated search (auto-arima)).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (you choose p, d, q based on acf/pacf analysis or automated search (auto-arima)).
- We will not implement ARIMA from scratch -- it requires numerical optimization that is beyond the scope of this lesson.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (we will not implement arima from scratch -- it requires numerical optimization that is beyond the scope of this lesson).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (we will not implement arima from scratch -- it requires numerical optimization that is beyond the scope of this lesson).
- The key insight is understanding what each component does so you can interpret ARIMA results and know when to use it.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (the key insight is understanding what each component does so you can interpret arima results and know when to use it).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (the key insight is understanding what each component does so you can interpret arima results and know when to use it).

---
## Reference Absorption: Use It
- With sklearn, you use lag features directly with any regressor:
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (with sklearn, you use lag features directly with any regressor:).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (with sklearn, you use lag features directly with any regressor:).
- The code in time_series.py demonstrates both approaches and compares them using walk-forward validation.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (the code in time_series.py demonstrates both approaches and compares them using walk-forward validation).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (the code in time_series.py demonstrates both approaches and compares them using walk-forward validation).

---
## Reference Absorption: Baselines You Must Beat
- Before building any model, establish baselines:
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (before building any model, establish baselines:).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (before building any model, establish baselines:).
- Last value (persistence). Predict that tomorrow will be the same as today.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (last value (persistence). predict that tomorrow will be the same as today).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (last value (persistence). predict that tomorrow will be the same as today).
- For many series, this is surprisingly hard to beat.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (for many series, this is surprisingly hard to beat).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (for many series, this is surprisingly hard to beat).
- Seasonal naive. Predict that today will be the same as the same day last week (or last year).
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (seasonal naive. predict that today will be the same as the same day last week (or last year)).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (seasonal naive. predict that today will be the same as the same day last week (or last year)).

---
## Reference Absorption: Baselines You Must Beat (cont.)
- If your model cannot beat this, it has not learned any useful pattern beyond seasonality.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (if your model cannot beat this, it has not learned any useful pattern beyond seasonality).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (if your model cannot beat this, it has not learned any useful pattern beyond seasonality).
- Moving average. Predict the average of the last k values.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (moving average. predict the average of the last k values).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (moving average. predict the average of the last k values).
- Smooths noise but cannot capture sudden changes.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (smooths noise but cannot capture sudden changes).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (smooths noise but cannot capture sudden changes).
- If your fancy ML model loses to the seasonal naive baseline, you have a bug.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (if your fancy ml model loses to the seasonal naive baseline, you have a bug).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (if your fancy ml model loses to the seasonal naive baseline, you have a bug).

---
## Reference Absorption: Baselines You Must Beat Deep Continuation
- Most commonly: future leakage in features, wrong evaluation method, or the series is truly random and unpredictable.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (most commonly: future leakage in features, wrong evaluation method, or the series is truly random and unpredictable).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (most commonly: future leakage in features, wrong evaluation method, or the series is truly random and unpredictable).

---
## Reference Absorption: Further Reading
- [Hyndman and Athanasopoulos, Forecasting: Principles and Practice (3rd ed.)](https://otexts.com/fpp3/) -- the best free textbook on time series forecasting
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade ([hyndman and athanasopoulos, forecasting: principles and practice (3rd ed.)](https://otexts.com/fpp3/) -- the best free textboo...).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept ([hyndman and athanasopoulos, forecasting: principles and practice (3rd ed.)](https://otexts.com/fpp3/) -- the best fr...).
- [scikit-learn Time Series Split](https://scikit-learn.org/stable/modules/generated/sklearn.model_selection.TimeSeriesSplit.html) -- sklearn's walk-forward splitter
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade ([scikit-learn time series split](https://scikit-learn.org/stable/modules/generated/sklearn.model_selection.timeseriessplit.html...).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept ([scikit-learn time series split](https://scikit-learn.org/stable/modules/generated/sklearn.model_selection.timeseries...).
- [statsmodels ARIMA docs](https://www.statsmodels.org/stable/generated/statsmodels.tsa.arima.model.ARIMA.html) -- ARIMA implementation with diagnostics
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade ([statsmodels arima docs](https://www.statsmodels.org/stable/generated/statsmodels.tsa.arima.model.arima.html) -- arima implemen...).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept ([statsmodels arima docs](https://www.statsmodels.org/stable/generated/statsmodels.tsa.arima.model.arima.html) -- arim...).
- [Makridakis et al., The M5 Competition (2022)](https://www.sciencedirect.com/science/article/pii/S0169207021001874) -- large-scale forecasting competition showing ML methods vs statistical methods
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade ([makridakis et al., the m5 competition (2022)](https://www.sciencedirect.com/science/article/pii/s0169207021001874) -- large-sc...).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept ([makridakis et al., the m5 competition (2022)](https://www.sciencedirect.com/science/article/pii/s0169207021001874) -...).

---
## Beyond Reference: Engineering Translation
- Core anchors for this module: series, time, model, features, train, test, mean, rolling.
- Convert each theoretical primitive into measurable training and inference behaviors.
- Define observability checkpoints for drift, calibration, and latency regressions.
- Tie assumptions to explicit data contracts and fallback policies.

---
## Beyond Reference: Advanced Layer 1
- Build walk-forward backtesting with realistic retraining cadence and horizon definitions.
- Risk and governance extension: convert this into acceptance tests and rollback criteria (build walk-forward backtesting with realistic retraining cadence and horizon definitions.).
- Handle seasonality shifts and regime changes with adaptive windows.
- Risk and governance extension: convert this into acceptance tests and rollback criteria (handle seasonality shifts and regime changes with adaptive windows.).
- Compare random splits versus temporal splits to quantify leakage inflation.
- Risk and governance extension: convert this into acceptance tests and rollback criteria (compare random splits versus temporal splits to quantify leakage inflation.).

<!-- DEPTH_EXPANSION_END -->
