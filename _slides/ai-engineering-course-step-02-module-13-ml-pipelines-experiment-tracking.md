---
layout: slides
title: "ML Pipelines & Experiment Tracking"
category: "ai-engineering-course-step-02"
module_number: 13
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
## Module 13: ML Pipelines & Experiment Tracking
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
- You have a notebook that loads data, fills missing values with the median, scales features, trains a model, and prints accuracy.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (you have a notebook that loads data, fills missing values with the median, scales features, trains a model, and prints accuracy).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (you have a notebook that loads data, fills missing values with the median, scales features, trains a model, and print...).
- A month later, someone retrains the model and gets different results.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (a month later, someone retrains the model and gets different results).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (a month later, someone retrains the model and gets different results).
- The median was computed on the full dataset including test data (data leakage).
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (the median was computed on the full dataset including test data (data leakage)).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (the median was computed on the full dataset including test data (data leakage)).
- The scaling parameters were not saved, so inference uses different statistics.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (the scaling parameters were not saved, so inference uses different statistics).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (the scaling parameters were not saved, so inference uses different statistics).

---
## Reference Absorption: The Problem (cont.)
- The feature engineering code was copy-pasted between training and serving, and the copies diverged.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (the feature engineering code was copy-pasted between training and serving, and the copies diverged).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (the feature engineering code was copy-pasted between training and serving, and the copies diverged).
- A categorical column gained a new value in production that the encoder has never seen.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (a categorical column gained a new value in production that the encoder has never seen).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (a categorical column gained a new value in production that the encoder has never seen).
- They are the most common reasons ML systems fail in production.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (they are the most common reasons ml systems fail in production).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (they are the most common reasons ml systems fail in production).
- Pipelines solve all of them by packaging every transformation step into a single, ordered, reproducible object.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (pipelines solve all of them by packaging every transformation step into a single, ordered, reproducible object).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (pipelines solve all of them by packaging every transformation step into a single, ordered, reproducible object).

---
## Reference Absorption: From Notebook to Production Pipeline
- Notebook exploration: Quick experiments, visualizations, feature ideas
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (notebook exploration: quick experiments, visualizations, feature ideas).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (notebook exploration: quick experiments, visualizations, feature ideas).
- Extract functions: Move preprocessing, feature engineering, evaluation into modules
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (extract functions: move preprocessing, feature engineering, evaluation into modules).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (extract functions: move preprocessing, feature engineering, evaluation into modules).
- Build Pipeline: Chain transformations into a sklearn Pipeline or custom class
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (build pipeline: chain transformations into a sklearn pipeline or custom class).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (build pipeline: chain transformations into a sklearn pipeline or custom class).
- Config management: Move all hyperparameters into a YAML/JSON config
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (config management: move all hyperparameters into a yaml/json config).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (config management: move all hyperparameters into a yaml/json config).

---
## Reference Absorption: From Notebook to Production Pipeline (cont.)
- Experiment tracking: Add MLflow or wandb logging
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (experiment tracking: add mlflow or wandb logging).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (experiment tracking: add mlflow or wandb logging).
- Data validation: Check schema, distributions, and missing value patterns before training
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (data validation: check schema, distributions, and missing value patterns before training).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (data validation: check schema, distributions, and missing value patterns before training).
- Tests: Unit tests for transformers, integration tests for the full pipeline
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (tests: unit tests for transformers, integration tests for the full pipeline).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (tests: unit tests for transformers, integration tests for the full pipeline).
- Deployment: Serialize the pipeline, wrap in an API (FastAPI, Flask), containerize
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (deployment: serialize the pipeline, wrap in an api (fastapi, flask), containerize).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (deployment: serialize the pipeline, wrap in an api (fastapi, flask), containerize).

---
## Reference Absorption: Exercises
- Build a pipeline that handles a dataset with 3 numeric columns and 2 categorical columns.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (build a pipeline that handles a dataset with 3 numeric columns and 2 categorical columns).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (build a pipeline that handles a dataset with 3 numeric columns and 2 categorical columns).
- Use ColumnTransformer to apply median imputation + scaling to numerics and most-frequent imputation + one-hot encoding to categoricals.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (use columntransformer to apply median imputation + scaling to numerics and most-frequent imputation + one-hot encoding to categ...).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (use columntransformer to apply median imputation + scaling to numerics and most-frequent imputation + one-hot encodin...).
- Train with 5-fold cross-validation.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (train with 5-fold cross-validation).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (train with 5-fold cross-validation).
- Deliberately introduce data leakage: fit the scaler on the full dataset before splitting.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (deliberately introduce data leakage: fit the scaler on the full dataset before splitting).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (deliberately introduce data leakage: fit the scaler on the full dataset before splitting).

---
## Reference Absorption: Exercises (cont.)
- Compare the cross-validation score (leaky) to the pipeline cross-validation score (clean).
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (compare the cross-validation score (leaky) to the pipeline cross-validation score (clean)).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (compare the cross-validation score (leaky) to the pipeline cross-validation score (clean)).
- How large is the difference?
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (how large is the difference?).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (how large is the difference?).
- Serialize your pipeline with joblib.dump.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (serialize your pipeline with joblib.dump).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (serialize your pipeline with joblib.dump).
- Load it in a separate script and run predictions.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (load it in a separate script and run predictions).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (load it in a separate script and run predictions).

---
## Reference Absorption: Exercises Deep Continuation
- Verify the predictions are identical.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (verify the predictions are identical).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (verify the predictions are identical).
- Add a custom transformer to the pipeline that creates polynomial features (degree 2) for the two most important numeric columns.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (add a custom transformer to the pipeline that creates polynomial features (degree 2) for the two most important numeric columns).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (add a custom transformer to the pipeline that creates polynomial features (degree 2) for the two most important numer...).
- Where should it go in the pipeline?
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (where should it go in the pipeline?).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (where should it go in the pipeline?).
- Set up MLflow tracking for the pipeline.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (set up mlflow tracking for the pipeline).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (set up mlflow tracking for the pipeline).

---
## Reference Absorption: Exercises Deep Continuation
- Run 5 experiments with different hyperparameters.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (run 5 experiments with different hyperparameters).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (run 5 experiments with different hyperparameters).
- Use the MLflow UI (mlflow ui) to compare runs and pick the best model.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (use the mlflow ui (mlflow ui) to compare runs and pick the best model).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (use the mlflow ui (mlflow ui) to compare runs and pick the best model).

---
## Reference Absorption: Step 4: Full Production Pipeline with sklearn
- A complete pipeline with ColumnTransformer, multiple preprocessing paths, and a model, trained with proper cross-validation and experiment logging.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (a complete pipeline with columntransformer, multiple preprocessing paths, and a model, trained with proper cross-validation and...).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (a complete pipeline with columntransformer, multiple preprocessing paths, and a model, trained with proper cross-vali...).

---
## Reference Absorption: Experiment Tracking
- A pipeline makes training reproducible, but you also need to track what happened across experiments: which hyperparameters were used, which dataset version, what the metrics were, which code was running.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (a pipeline makes training reproducible, but you also need to track what happened across experiments: which hyperparameters were...).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (a pipeline makes training reproducible, but you also need to track what happened across experiments: which hyperparam...).
- MLflow is the most common open-source solution:
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (mlflow is the most common open-source solution:).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (mlflow is the most common open-source solution:).
- Every run is recorded with parameters, metrics, artifacts, and the full model.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (every run is recorded with parameters, metrics, artifacts, and the full model).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (every run is recorded with parameters, metrics, artifacts, and the full model).
- You can compare runs, reproduce any experiment, and deploy any model version.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (you can compare runs, reproduce any experiment, and deploy any model version).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (you can compare runs, reproduce any experiment, and deploy any model version).

---
## Reference Absorption: Experiment Tracking (cont.)
- Weights & Biases (wandb) provides the same functionality with a hosted dashboard:
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (weights & biases (wandb) provides the same functionality with a hosted dashboard:).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (weights & biases (wandb) provides the same functionality with a hosted dashboard:).

---
## Reference Absorption: ColumnTransformer: Different Pipelines for Different Columns
- Real datasets have numeric and categorical columns that need different preprocessing.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (real datasets have numeric and categorical columns that need different preprocessing).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (real datasets have numeric and categorical columns that need different preprocessing).
- ColumnTransformer handles this.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (columntransformer handles this).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (columntransformer handles this).
- The handle_unknown="ignore" in OneHotEncoder is critical for production.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (the handle_unknown="ignore" in onehotencoder is critical for production).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (the handle_unknown="ignore" in onehotencoder is critical for production).
- When a new category appears (a city the model has never seen), it produces a zero vector instead of crashing.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (when a new category appears (a city the model has never seen), it produces a zero vector instead of crashing).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (when a new category appears (a city the model has never seen), it produces a zero vector instead of crashing).

---
## Reference Absorption: sklearn Pipeline
- sklearn's Pipeline chains transformers and an estimator.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (sklearn's pipeline chains transformers and an estimator).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (sklearn's pipeline chains transformers and an estimator).
- It exposes .fit(), .predict(), and .score() that apply all steps in order.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (it exposes .fit(), .predict(), and .score() that apply all steps in order).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (it exposes .fit(), .predict(), and .score() that apply all steps in order).
- When you call pipe.fit(X_train, y_train):
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (when you call pipe.fit(x_train, y_train):).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (when you call pipe.fit(x_train, y_train):).
- Scaler calls fit_transform on X_train
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (scaler calls fit_transform on x_train).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (scaler calls fit_transform on x_train).

---
## Reference Absorption: sklearn Pipeline (cont.)
- Model calls fit on the scaled X_train
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (model calls fit on the scaled x_train).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (model calls fit on the scaled x_train).
- When you call pipe.predict(X_test):
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (when you call pipe.predict(x_test):).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (when you call pipe.predict(x_test):).
- Scaler calls transform (not fit_transform) on X_test
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (scaler calls transform (not fit_transform) on x_test).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (scaler calls transform (not fit_transform) on x_test).
- Model calls predict on the scaled X_test
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (model calls predict on the scaled x_test).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (model calls predict on the scaled x_test).

---
## Reference Absorption: sklearn Pipeline Deep Continuation
- The scaler never sees test data during fitting.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (the scaler never sees test data during fitting).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (the scaler never sees test data during fitting).

---
## Reference Absorption: What a Pipeline Is
- A pipeline is an ordered sequence of data transformations followed by a model.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (a pipeline is an ordered sequence of data transformations followed by a model).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (a pipeline is an ordered sequence of data transformations followed by a model).
- Each step takes the output of the previous step as input.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (each step takes the output of the previous step as input).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (each step takes the output of the previous step as input).
- The entire pipeline is fitted once on training data.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (the entire pipeline is fitted once on training data).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (the entire pipeline is fitted once on training data).
- At inference time, the same fitted pipeline transforms new data and produces predictions.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (at inference time, the same fitted pipeline transforms new data and produces predictions).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (at inference time, the same fitted pipeline transforms new data and produces predictions).

---
## Reference Absorption: What a Pipeline Is (cont.)
- Transformations are fitted only on training data (no leakage)
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (transformations are fitted only on training data (no leakage)).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (transformations are fitted only on training data (no leakage)).
- The same transformations are applied at inference time
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (the same transformations are applied at inference time).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (the same transformations are applied at inference time).
- The entire object can be serialized and deployed as one artifact
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (the entire object can be serialized and deployed as one artifact).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (the entire object can be serialized and deployed as one artifact).
- Cross-validation applies the pipeline per fold, preventing subtle leakage
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (cross-validation applies the pipeline per fold, preventing subtle leakage).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (cross-validation applies the pipeline per fold, preventing subtle leakage).

---
## Reference Absorption: Data Leakage: The Silent Killer
- Data leakage happens when information from the test set or future data contaminates training.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (data leakage happens when information from the test set or future data contaminates training).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (data leakage happens when information from the test set or future data contaminates training).
- Pipelines prevent the most common forms.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (pipelines prevent the most common forms).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (pipelines prevent the most common forms).
- The mean and standard deviation include test samples.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (the mean and standard deviation include test samples).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (the mean and standard deviation include test samples).
- This inflates accuracy estimates.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (this inflates accuracy estimates).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (this inflates accuracy estimates).

---
## Reference Absorption: Data Leakage: The Silent Killer (cont.)
- With a pipeline, you do not need to think about this.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (with a pipeline, you do not need to think about this).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (with a pipeline, you do not need to think about this).
- The pipeline handles it automatically.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (the pipeline handles it automatically).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (the pipeline handles it automatically).

---
## Reference Absorption: Further Reading
- [scikit-learn Pipeline docs](https://scikit-learn.org/stable/modules/compose.html) -- the official pipeline reference
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade ([scikit-learn pipeline docs](https://scikit-learn.org/stable/modules/compose.html) -- the official pipeline reference).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept ([scikit-learn pipeline docs](https://scikit-learn.org/stable/modules/compose.html) -- the official pipeline reference).
- [MLflow documentation](https://mlflow.org/docs/latest/index.html) -- experiment tracking and model registry
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade ([mlflow documentation](https://mlflow.org/docs/latest/index.html) -- experiment tracking and model registry).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept ([mlflow documentation](https://mlflow.org/docs/latest/index.html) -- experiment tracking and model registry).
- [DVC documentation](https://dvc.org/doc) -- data versioning
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade ([dvc documentation](https://dvc.org/doc) -- data versioning).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept ([dvc documentation](https://dvc.org/doc) -- data versioning).
- [Sculley et al., Hidden Technical Debt in Machine Learning Systems (2015)](https://papers.nips.cc/paper/2015/hash/86df7dcfd896fcaf2674f757a2463eba-Abstract.html) -- the seminal paper on ML systems complexity
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade ([sculley et al., hidden technical debt in machine learning systems (2015)](https://papers.nips.cc/paper/2015/hash/86df7dcfd896f...).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept ([sculley et al., hidden technical debt in machine learning systems (2015)](https://papers.nips.cc/paper/2015/hash/86d...).

---
## Reference Absorption: Further Reading (cont.)
- [Google ML Best Practices: Rules of ML](https://developers.google.com/machine-learning/guides/rules-of-ml) -- practical production ML advice
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade ([google ml best practices: rules of ml](https://developers.google.com/machine-learning/guides/rules-of-ml) -- practical product...).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept ([google ml best practices: rules of ml](https://developers.google.com/machine-learning/guides/rules-of-ml) -- practic...).

---
## Reference Absorption: Reproducible Experiments
- A reproducible experiment requires four things:
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (a reproducible experiment requires four things:).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (a reproducible experiment requires four things:).
- Fixed random seeds: Set seeds for numpy, random, and the framework (torch, sklearn)
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (fixed random seeds: set seeds for numpy, random, and the framework (torch, sklearn)).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (fixed random seeds: set seeds for numpy, random, and the framework (torch, sklearn)).
- Pinned dependencies: requirements.txt or poetry.lock with exact versions
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (pinned dependencies: requirements.txt or poetry.lock with exact versions).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (pinned dependencies: requirements.txt or poetry.lock with exact versions).
- Versioned data: DVC or similar
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (versioned data: dvc or similar).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (versioned data: dvc or similar).

---
## Reference Absorption: Reproducible Experiments (cont.)
- Config files: All hyperparameters in a config, not hardcoded
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (config files: all hyperparameters in a config, not hardcoded).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (config files: all hyperparameters in a config, not hardcoded).

---
## Reference Absorption: Data Versioning with DVC
- Data should be versioned too, but git cannot handle large files.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (data should be versioned too, but git cannot handle large files).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (data should be versioned too, but git cannot handle large files).
- DVC (Data Version Control) solves this.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (dvc (data version control) solves this).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (dvc (data version control) solves this).
- DVC stores the actual data in remote storage (S3, GCS, Azure) and keeps a small .dvc file in git that records the hash.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (dvc stores the actual data in remote storage (s3, gcs, azure) and keeps a small .dvc file in git that records the hash).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (dvc stores the actual data in remote storage (s3, gcs, azure) and keeps a small .dvc file in git that records the hash).
- When you checkout a git commit, dvc checkout restores the exact data that was used.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (when you checkout a git commit, dvc checkout restores the exact data that was used).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (when you checkout a git commit, dvc checkout restores the exact data that was used).

---
## Reference Absorption: Data Versioning with DVC (cont.)
- This means every git commit pins both the code and the data.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (this means every git commit pins both the code and the data).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (this means every git commit pins both the code and the data).
<!-- DEPTH_EXPANSION_END -->
