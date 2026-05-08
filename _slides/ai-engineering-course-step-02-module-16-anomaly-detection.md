---
layout: slides
title: "Anomaly Detection"
category: "ai-engineering-course-step-02"
module_number: 16
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
## Module 16: Anomaly Detection
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
- A credit card is used in New York at 2pm, then in Tokyo at 2:05pm.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (a credit card is used in new york at 2pm, then in tokyo at 2:05pm).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (a credit card is used in new york at 2pm, then in tokyo at 2:05pm).
- A factory sensor reads 150 degrees when the normal range is 80-120.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (a factory sensor reads 150 degrees when the normal range is 80-120).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (a factory sensor reads 150 degrees when the normal range is 80-120).
- A server sends 50,000 requests per second when the daily average is 200.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (a server sends 50,000 requests per second when the daily average is 200).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (a server sends 50,000 requests per second when the daily average is 200).
- Equipment failures cost downtime.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (equipment failures cost downtime).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (equipment failures cost downtime).

---
## Reference Absorption: The Problem (cont.)
- Network intrusions cost data.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (network intrusions cost data).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (network intrusions cost data).
- The challenge: you rarely have labeled examples of anomalies.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (the challenge: you rarely have labeled examples of anomalies).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (the challenge: you rarely have labeled examples of anomalies).
- Fraud makes up 0.1% of transactions.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (fraud makes up 0.1% of transactions).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (fraud makes up 0.1% of transactions).
- Equipment failures happen a few times per year.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (equipment failures happen a few times per year).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (equipment failures happen a few times per year).

---
## Reference Absorption: The Problem Deep Continuation
- You cannot train a standard classifier because there is almost nothing in the "anomaly" class to learn from.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (you cannot train a standard classifier because there is almost nothing in the "anomaly" class to learn from).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (you cannot train a standard classifier because there is almost nothing in the "anomaly" class to learn from).
- Even if you have some labels, the anomalies you have seen are not the only types you will encounter.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (even if you have some labels, the anomalies you have seen are not the only types you will encounter).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (even if you have some labels, the anomalies you have seen are not the only types you will encounter).
- Tomorrow's fraud scheme looks different from today's.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (tomorrow's fraud scheme looks different from today's).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (tomorrow's fraud scheme looks different from today's).
- Anomaly detection flips the problem.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (anomaly detection flips the problem).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (anomaly detection flips the problem).

---
## Reference Absorption: The Problem Deep Continuation
- Instead of learning what is abnormal, learn what is normal.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (instead of learning what is abnormal, learn what is normal).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (instead of learning what is abnormal, learn what is normal).
- Anything that deviates from normal is suspicious.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (anything that deviates from normal is suspicious).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (anything that deviates from normal is suspicious).
- This works without labels, adapts to new types of anomalies, and scales to massive datasets.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (this works without labels, adapts to new types of anomalies, and scales to massive datasets).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (this works without labels, adapts to new types of anomalies, and scales to massive datasets).

---
## Reference Absorption: Production Considerations
- Threshold drift. As data distribution shifts, a fixed threshold becomes outdated.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (threshold drift. as data distribution shifts, a fixed threshold becomes outdated).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (threshold drift. as data distribution shifts, a fixed threshold becomes outdated).
- Monitor the distribution of anomaly scores and adjust periodically.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (monitor the distribution of anomaly scores and adjust periodically).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (monitor the distribution of anomaly scores and adjust periodically).
- Alert fatigue. Too many false alarms and operators stop paying attention.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (alert fatigue. too many false alarms and operators stop paying attention).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (alert fatigue. too many false alarms and operators stop paying attention).
- Start with a high threshold (fewer, more reliable alerts) and lower it as trust builds.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (start with a high threshold (fewer, more reliable alerts) and lower it as trust builds).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (start with a high threshold (fewer, more reliable alerts) and lower it as trust builds).

---
## Reference Absorption: Production Considerations (cont.)
- Ensemble approach. In production, combine multiple detectors.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (ensemble approach. in production, combine multiple detectors).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (ensemble approach. in production, combine multiple detectors).
- Flag a point only if multiple methods agree it is anomalous.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (flag a point only if multiple methods agree it is anomalous).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (flag a point only if multiple methods agree it is anomalous).
- This reduces false positives significantly.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (this reduces false positives significantly).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (this reduces false positives significantly).
- Feature engineering. Raw features are rarely enough.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (feature engineering. raw features are rarely enough).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (feature engineering. raw features are rarely enough).

---
## Reference Absorption: Production Considerations Deep Continuation
- Add rolling statistics, ratios, time-since-last-event, and domain-specific features.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (add rolling statistics, ratios, time-since-last-event, and domain-specific features).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (add rolling statistics, ratios, time-since-last-event, and domain-specific features).
- A good feature set matters more than the choice of detector.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (a good feature set matters more than the choice of detector).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (a good feature set matters more than the choice of detector).
- Feedback loop. When operators investigate flagged items and confirm or dismiss them, feed this back into the system.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (feedback loop. when operators investigate flagged items and confirm or dismiss them, feed this back into the system).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (feedback loop. when operators investigate flagged items and confirm or dismiss them, feed this back into the system).
- Accumulate labeled data over time to evaluate and improve the detector.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (accumulate labeled data over time to evaluate and improve the detector).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (accumulate labeled data over time to evaluate and improve the detector).

---
## Reference Absorption: Scaling to Production
- For real-time anomaly detection in production:
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (for real-time anomaly detection in production:).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (for real-time anomaly detection in production:).
- Batch training, online scoring. Train the model periodically (daily, weekly) on recent normal data.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (batch training, online scoring. train the model periodically (daily, weekly) on recent normal data).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (batch training, online scoring. train the model periodically (daily, weekly) on recent normal data).
- Score each new observation as it arrives.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (score each new observation as it arrives).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (score each new observation as it arrives).
- Feature computation must match. If you trained with rolling statistics over 30 days, you need 30 days of history to compute features for a new observation.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (feature computation must match. if you trained with rolling statistics over 30 days, you need 30 days of history to compute fea...).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (feature computation must match. if you trained with rolling statistics over 30 days, you need 30 days of history to c...).

---
## Reference Absorption: Scaling to Production (cont.)
- Buffer the required history.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (buffer the required history).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (buffer the required history).
- Score distribution monitoring. Track the distribution of anomaly scores over time.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (score distribution monitoring. track the distribution of anomaly scores over time).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (score distribution monitoring. track the distribution of anomaly scores over time).
- If the median score drifts upward, either the data is changing or the model is stale.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (if the median score drifts upward, either the data is changing or the model is stale).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (if the median score drifts upward, either the data is changing or the model is stale).
- Explainability. When you flag an anomaly, say why.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (explainability. when you flag an anomaly, say why).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (explainability. when you flag an anomaly, say why).

---
## Reference Absorption: Scaling to Production Deep Continuation
- Z-score: "Feature X is 4.2 standard deviations above normal." Isolation Forest: "This point was isolated in 3.1 splits on average (normal points take 8.5)."
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (z-score: "feature x is 4.2 standard deviations above normal." isolation forest: "this point was isolated in 3.1 splits on avera...).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (z-score: "feature x is 4.2 standard deviations above normal." isolation forest: "this point was isolated in 3.1 split...).

---
## Reference Absorption: Exercises
- Threshold tuning. Run the Z-score detector with thresholds from 1.0 to 5.0 in steps of 0.5.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (threshold tuning. run the z-score detector with thresholds from 1.0 to 5.0 in steps of 0.5).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (threshold tuning. run the z-score detector with thresholds from 1.0 to 5.0 in steps of 0.5).
- Plot precision and recall at each threshold.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (plot precision and recall at each threshold).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (plot precision and recall at each threshold).
- Where is the sweet spot for your data?
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (where is the sweet spot for your data?).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (where is the sweet spot for your data?).
- Multivariate anomalies. Create 2D data where each feature individually looks normal, but the combination is anomalous (e.g., points far from the main cluster diagonal).
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (multivariate anomalies. create 2d data where each feature individually looks normal, but the combination is anomalous (e.g., po...).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (multivariate anomalies. create 2d data where each feature individually looks normal, but the combination is anomalous...).

---
## Reference Absorption: Exercises (cont.)
- Show that Z-score per feature misses these but Isolation Forest catches them.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (show that z-score per feature misses these but isolation forest catches them).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (show that z-score per feature misses these but isolation forest catches them).
- LOF from scratch. Implement Local Outlier Factor using k-nearest neighbors.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (lof from scratch. implement local outlier factor using k-nearest neighbors).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (lof from scratch. implement local outlier factor using k-nearest neighbors).
- Compare against sklearn's LocalOutlierFactor on the same data.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (compare against sklearn's localoutlierfactor on the same data).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (compare against sklearn's localoutlierfactor on the same data).
- Use k=10 and k=50 -- how does the choice of k affect results?
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (use k=10 and k=50 -- how does the choice of k affect results?).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (use k=10 and k=50 -- how does the choice of k affect results?).

---
## Reference Absorption: Exercises Deep Continuation
- Streaming anomaly detection. Modify the Z-score detector to work in a streaming setting: update the running mean and variance as new points arrive (Welford's online algorithm).
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (streaming anomaly detection. modify the z-score detector to work in a streaming setting: update the running mean and variance a...).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (streaming anomaly detection. modify the z-score detector to work in a streaming setting: update the running mean and...).
- Compare to batch Z-score on the same data.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (compare to batch z-score on the same data).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (compare to batch z-score on the same data).
- Real-world evaluation. Take a dataset with known anomalies (credit card fraud from Kaggle, for example).
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (real-world evaluation. take a dataset with known anomalies (credit card fraud from kaggle, for example)).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (real-world evaluation. take a dataset with known anomalies (credit card fraud from kaggle, for example)).
- Evaluate all four methods using precision@100, precision@500, and AUPRC.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (evaluate all four methods using precision@100, precision@500, and auprc).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (evaluate all four methods using precision@100, precision@500, and auprc).

---
## Reference Absorption: Isolation Forest
- The key insight: anomalies are few and different.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (the key insight: anomalies are few and different).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (the key insight: anomalies are few and different).
- In a random partitioning of the data, anomalies are easier to isolate -- they need fewer random splits to be separated from the rest.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (in a random partitioning of the data, anomalies are easier to isolate -- they need fewer random splits to be separated from the...).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (in a random partitioning of the data, anomalies are easier to isolate -- they need fewer random splits to be separate...).
- Build many random trees (an isolation forest)
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (build many random trees (an isolation forest)).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (build many random trees (an isolation forest)).
- At each node, pick a random feature and a random split value between the feature's min and max
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (at each node, pick a random feature and a random split value between the feature's min and max).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (at each node, pick a random feature and a random split value between the feature's min and max).

---
## Reference Absorption: Isolation Forest (cont.)
- Keep splitting until every point is isolated (in its own leaf)
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (keep splitting until every point is isolated (in its own leaf)).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (keep splitting until every point is isolated (in its own leaf)).
- Anomalies have shorter average path lengths across all trees
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (anomalies have shorter average path lengths across all trees).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (anomalies have shorter average path lengths across all trees).
- Why it works: Normal points live in dense regions.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (why it works: normal points live in dense regions).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (why it works: normal points live in dense regions).
- Many random splits are needed to isolate one from its neighbors.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (many random splits are needed to isolate one from its neighbors).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (many random splits are needed to isolate one from its neighbors).

---
## Reference Absorption: Isolation Forest Deep Continuation
- Anomalies live in sparse regions.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (anomalies live in sparse regions).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (anomalies live in sparse regions).
- One or two random splits are enough to isolate them.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (one or two random splits are enough to isolate them).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (one or two random splits are enough to isolate them).
- The anomaly score is based on the average path length across all trees, normalized by the expected path length of a random binary search tree:
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (the anomaly score is based on the average path length across all trees, normalized by the expected path length of a random bina...).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (the anomaly score is based on the average path length across all trees, normalized by the expected path length of a r...).
- Where c(n) is the expected path length for n samples.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (where c(n) is the expected path length for n samples).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (where c(n) is the expected path length for n samples).

---
## Reference Absorption: Isolation Forest Deep Continuation
- Score near 0.5 means normal.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (score near 0.5 means normal).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (score near 0.5 means normal).
- Score near 0 means very normal (deep in dense clusters).
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (score near 0 means very normal (deep in dense clusters)).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (score near 0 means very normal (deep in dense clusters)).
- Strengths: No distribution assumptions.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (strengths: no distribution assumptions).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (strengths: no distribution assumptions).
- Scales well (sublinear in sample size because each tree uses a subsample).
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (scales well (sublinear in sample size because each tree uses a subsample)).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (scales well (sublinear in sample size because each tree uses a subsample)).

---
## Reference Absorption: Isolation Forest Deep Continuation
- Handles mixed feature types.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (handles mixed feature types).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (handles mixed feature types).
- Weaknesses: Struggles with anomalies in dense regions (masking effect).
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (weaknesses: struggles with anomalies in dense regions (masking effect)).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (weaknesses: struggles with anomalies in dense regions (masking effect)).
- Random splitting is less effective when many features are irrelevant.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (random splitting is less effective when many features are irrelevant).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (random splitting is less effective when many features are irrelevant).
- n_estimators: Number of trees. 100 is usually enough. More trees give more stable scores but slower computation.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (n_estimators: number of trees. 100 is usually enough. more trees give more stable scores but slower computation).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (n_estimators: number of trees. 100 is usually enough. more trees give more stable scores but slower computation).

---
## Reference Absorption: Isolation Forest Deep Continuation
- max_samples: Number of samples per tree. 256 is the default in the original paper. Smaller values make individual trees less accurate but increase diversity. The subsampling is what makes Isolation Forest fa...
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (max_samples: number of samples per tree. 256 is the default in the original paper. smaller values make individual trees less ac...).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (max_samples: number of samples per tree. 256 is the default in the original paper. smaller values make individual tre...).
- contamination: Expected fraction of anomalies. Used only for setting the threshold. Does not affect the scores themselves.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (contamination: expected fraction of anomalies. used only for setting the threshold. does not affect the scores themselves).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (contamination: expected fraction of anomalies. used only for setting the threshold. does not affect the scores themse...).

---
## Reference Absorption: Isolation Forest from Scratch
- The from-scratch implementation builds isolation trees that randomly partition the feature space:
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (the from-scratch implementation builds isolation trees that randomly partition the feature space:).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (the from-scratch implementation builds isolation trees that randomly partition the feature space:).
- The path length to isolate a point determines its anomaly score.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (the path length to isolate a point determines its anomaly score).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (the path length to isolate a point determines its anomaly score).
- Shorter paths mean more anomalous.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (shorter paths mean more anomalous).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (shorter paths mean more anomalous).
- The IsolationForest class wraps multiple trees:
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (the isolationforest class wraps multiple trees:).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (the isolationforest class wraps multiple trees:).

---
## Reference Absorption: Isolation Forest from Scratch (cont.)
- The normalization factor c(n) is the expected path length of an unsuccessful search in a binary search tree with n elements.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (the normalization factor c(n) is the expected path length of an unsuccessful search in a binary search tree with n elements).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (the normalization factor c(n) is the expected path length of an unsuccessful search in a binary search tree with n el...).
- It equals 2 * H(n-1) - 2*(n-1)/n where H is the harmonic number.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (it equals 2 * h(n-1) - 2*(n-1)/n where h is the harmonic number).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (it equals 2 * h(n-1) - 2*(n-1)/n where h is the harmonic number).
- This normalization ensures scores are comparable across datasets of different sizes.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (this normalization ensures scores are comparable across datasets of different sizes).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (this normalization ensures scores are comparable across datasets of different sizes).

---
## Reference Absorption: Local Outlier Factor (LOF)
- LOF compares the local density around a point to the density around its neighbors.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (lof compares the local density around a point to the density around its neighbors).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (lof compares the local density around a point to the density around its neighbors).
- A point in a sparse region surrounded by dense regions is anomalous.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (a point in a sparse region surrounded by dense regions is anomalous).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (a point in a sparse region surrounded by dense regions is anomalous).
- For each point, find its k nearest neighbors
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (for each point, find its k nearest neighbors).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (for each point, find its k nearest neighbors).
- Compute the local reachability density (how dense is the neighborhood)
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (compute the local reachability density (how dense is the neighborhood)).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (compute the local reachability density (how dense is the neighborhood)).

---
## Beyond Reference: Engineering Translation
- Core anchors for this module: anomaly, anomalies, data, normal, score, self, detection, point.
- Convert each theoretical primitive into measurable training and inference behaviors.
- Define observability checkpoints for drift, calibration, and latency regressions.
- Tie assumptions to explicit data contracts and fallback policies.

---
## Beyond Reference: Advanced Layer 1
- Tune anomaly thresholds by expected alert load and analyst capacity.
- Risk and governance extension: convert this into acceptance tests and rollback criteria (tune anomaly thresholds by expected alert load and analyst capacity.).
- Differentiate point, contextual, and collective anomalies in evaluation protocols.
- Risk and governance extension: convert this into acceptance tests and rollback criteria (differentiate point, contextual, and collective anomalies in evaluation protocols.).
- Benchmark unsupervised detectors against weak supervision where labels are sparse.
- Risk and governance extension: convert this into acceptance tests and rollback criteria (benchmark unsupervised detectors against weak supervision where labels are sparse.).

<!-- DEPTH_EXPANSION_END -->
