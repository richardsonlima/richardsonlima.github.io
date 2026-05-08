---
layout: slides
title: "Debugging Neural Networks"
category: "ai-engineering-course-step-03"
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
# Step 03 - Deep Learning Core
## Module 13: Debugging Neural Networks
### _Type: {{ page.lesson_type }} · Lang: {{ page.lang_stack }}_

**Richardson Lima**

---

## Summary

This module is part of Step 03 - Deep Learning Core.

---

<!-- DEPTH_EXPANSION_START -->
---
class: middle, inverse-slide
# Depth Extension
### Full reference absorption plus beyond-reference advanced coverage

---
## Reference Absorption: The Problem
- Traditional software crashes when it is broken.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (traditional software crashes when it is broken).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (traditional software crashes when it is broken).
- A null pointer throws an exception.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (a null pointer throws an exception).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (a null pointer throws an exception).
- A type mismatch fails at compile time.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (a type mismatch fails at compile time).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (a type mismatch fails at compile time).
- An off-by-one error produces a clearly wrong output.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (an off-by-one error produces a clearly wrong output).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (an off-by-one error produces a clearly wrong output).

---
## Reference Absorption: The Problem (cont.)
- Neural networks do not give you that luxury.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (neural networks do not give you that luxury).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (neural networks do not give you that luxury).
- A broken neural network runs to completion, prints a loss value, and outputs predictions.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (a broken neural network runs to completion, prints a loss value, and outputs predictions).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (a broken neural network runs to completion, prints a loss value, and outputs predictions).
- The predictions might look plausible.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (the predictions might look plausible).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (the predictions might look plausible).
- But the model is silently wrong -- learning shortcuts, memorizing noise, or converging to a useless local minimum.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (but the model is silently wrong -- learning shortcuts, memorizing noise, or converging to a useless local minimum).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (but the model is silently wrong -- learning shortcuts, memorizing noise, or converging to a useless local minimum).

---
## Reference Absorption: The Problem Deep Continuation
- Google researchers estimated that 60-70% of ML debugging time is spent on "silent" bugs that produce no errors but degrade model quality.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (google researchers estimated that 60-70% of ml debugging time is spent on "silent" bugs that produce no errors but degrade mode...).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (google researchers estimated that 60-70% of ml debugging time is spent on "silent" bugs that produce no errors but de...).
- The difference between a working model and a broken one is often a single misplaced line: a missing zero_grad(), a transposed dimension, a learning rate off by 10x.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (the difference between a working model and a broken one is often a single misplaced line: a missing zero_grad(), a transposed d...).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (the difference between a working model and a broken one is often a single misplaced line: a missing zero_grad(), a tr...).
- the canonical "Recipe for Training Neural Networks" (2019) opens with this: "The most common neural net mistakes are bugs that don't crash."
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (the canonical "recipe for training neural networks" (2019) opens with this: "the most common neural net mistakes are bugs that...).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (the canonical "recipe for training neural networks" (2019) opens with this: "the most common neural net mistakes are...).
- This lesson teaches you to find those bugs.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (this lesson teaches you to find those bugs).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (this lesson teaches you to find those bugs).

---
## Reference Absorption: Exercises
- Add an exploding gradient detector. Modify the NetworkDebugger to detect when gradients exceed a threshold and automatically suggest a gradient clipping value.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (add an exploding gradient detector. modify the networkdebugger to detect when gradients exceed a threshold and automatically su...).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (add an exploding gradient detector. modify the networkdebugger to detect when gradients exceed a threshold and automa...).
- Test it on a 20-layer network with no normalization.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (test it on a 20-layer network with no normalization).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (test it on a 20-layer network with no normalization).
- Build a dead neuron resurrector. Write a function that identifies dead ReLU neurons (always outputting 0) and reinitializes their incoming weights with Kaiming initialization.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (build a dead neuron resurrector. write a function that identifies dead relu neurons (always outputting 0) and reinitializes the...).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (build a dead neuron resurrector. write a function that identifies dead relu neurons (always outputting 0) and reiniti...).
- Show that this recovers a network where >70% of neurons are dead.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (show that this recovers a network where >70% of neurons are dead).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (show that this recovers a network where >70% of neurons are dead).

---
## Reference Absorption: Exercises (cont.)
- Implement the learning rate finder with plotting. Extend find_learning_rate to save results as a CSV and write a separate script that reads the CSV and displays the LR vs loss curve using matplotlib.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (implement the learning rate finder with plotting. extend find_learning_rate to save results as a csv and write a separate scrip...).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (implement the learning rate finder with plotting. extend find_learning_rate to save results as a csv and write a sepa...).
- Identify the optimal LR for ResNet-18 on CIFAR-10.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (identify the optimal lr for resnet-18 on cifar-10).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (identify the optimal lr for resnet-18 on cifar-10).
- Create a data pipeline validator. Write a function that checks for: duplicate samples across train/test splits, label distribution imbalance (>10:1 ratio), input normalization (mean near 0, std near 1), and...
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (create a data pipeline validator. write a function that checks for: duplicate samples across train/test splits, label distribut...).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (create a data pipeline validator. write a function that checks for: duplicate samples across train/test splits, label...).
- Run it on a deliberately corrupted dataset.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (run it on a deliberately corrupted dataset).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (run it on a deliberately corrupted dataset).

---
## Reference Absorption: Exercises Deep Continuation
- Debug a real failure. Take the mini-framework from Lesson 10, introduce a subtle bug (e.g., transpose the weight matrix in backward), and use gradient checking to locate exactly which parameter has incorrect...
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (debug a real failure. take the mini-framework from lesson 10, introduce a subtle bug (e.g., transpose the weight matrix in back...).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (debug a real failure. take the mini-framework from lesson 10, introduce a subtle bug (e.g., transpose the weight matr...).
- Document the debugging process.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (document the debugging process).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (document the debugging process).

---
## Reference Absorption: Step 1: The NetworkDebugger Class
- Hooks into a PyTorch model to record activation and gradient statistics per layer.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (hooks into a pytorch model to record activation and gradient statistics per layer).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (hooks into a pytorch model to record activation and gradient statistics per layer).

---
## Reference Absorption: Step 5: Deliberately Broken Networks
- Now apply the toolkit to broken networks and diagnose each one.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (now apply the toolkit to broken networks and diagnose each one).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (now apply the toolkit to broken networks and diagnose each one).

---
## Reference Absorption: Symptom 1: Loss Not Decreasing
- This is the most common complaint.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (this is the most common complaint).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (this is the most common complaint).
- The training loop runs, epochs tick by, and the loss stays flat or oscillates wildly.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (the training loop runs, epochs tick by, and the loss stays flat or oscillates wildly).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (the training loop runs, epochs tick by, and the loss stays flat or oscillates wildly).
- Wrong learning rate. Too high: loss oscillates or jumps to NaN.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (wrong learning rate. too high: loss oscillates or jumps to nan).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (wrong learning rate. too high: loss oscillates or jumps to nan).
- Too low: loss decreases so slowly it looks flat.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (too low: loss decreases so slowly it looks flat).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (too low: loss decreases so slowly it looks flat).

---
## Reference Absorption: Symptom 1: Loss Not Decreasing (cont.)
- For SGD, start at 1e-1 or 1e-2.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (for sgd, start at 1e-1 or 1e-2).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (for sgd, start at 1e-1 or 1e-2).
- Always try 3 learning rates spanning 10x each (e.g., 1e-2, 1e-3, 1e-4) before concluding something else is wrong.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (always try 3 learning rates spanning 10x each (e.g., 1e-2, 1e-3, 1e-4) before concluding something else is wrong).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (always try 3 learning rates spanning 10x each (e.g., 1e-2, 1e-3, 1e-4) before concluding something else is wrong).
- Dead ReLUs. If a ReLU neuron receives a large negative input, it outputs 0 and its gradient is 0.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (dead relus. if a relu neuron receives a large negative input, it outputs 0 and its gradient is 0).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (dead relus. if a relu neuron receives a large negative input, it outputs 0 and its gradient is 0).
- If enough neurons die, the network cannot learn.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (if enough neurons die, the network cannot learn).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (if enough neurons die, the network cannot learn).

---
## Reference Absorption: Symptom 1: Loss Not Decreasing Deep Continuation
- Check: print the fraction of activations that are exactly 0 after each ReLU layer.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (check: print the fraction of activations that are exactly 0 after each relu layer).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (check: print the fraction of activations that are exactly 0 after each relu layer).
- If >50% are dead, switch to LeakyReLU or reduce the learning rate.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (if >50% are dead, switch to leakyrelu or reduce the learning rate).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (if >50% are dead, switch to leakyrelu or reduce the learning rate).
- Vanishing gradients. In deep networks with sigmoid or tanh activations, gradients shrink exponentially as they propagate backward.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (vanishing gradients. in deep networks with sigmoid or tanh activations, gradients shrink exponentially as they propagate backward).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (vanishing gradients. in deep networks with sigmoid or tanh activations, gradients shrink exponentially as they propag...).
- By the time they reach the first layer, they are ~0.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (by the time they reach the first layer, they are ~0).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (by the time they reach the first layer, they are ~0).

---
## Reference Absorption: Symptom 1: Loss Not Decreasing Deep Continuation
- The first layers stop learning.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (the first layers stop learning).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (the first layers stop learning).
- Fix: use ReLU/GELU, add residual connections, or use batch normalization.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (fix: use relu/gelu, add residual connections, or use batch normalization).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (fix: use relu/gelu, add residual connections, or use batch normalization).
- Exploding gradients. The opposite problem -- gradients grow exponentially.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (exploding gradients. the opposite problem -- gradients grow exponentially).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (exploding gradients. the opposite problem -- gradients grow exponentially).
- Common in RNNs and very deep networks.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (common in rnns and very deep networks).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (common in rnns and very deep networks).

---
## Reference Absorption: Symptom 1: Loss Not Decreasing Deep Continuation
- Fix: gradient clipping (torch.nn.utils.clip_grad_norm_), lower learning rate, or add normalization.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (fix: gradient clipping (torch.nn.utils.clip_grad_norm_), lower learning rate, or add normalization).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (fix: gradient clipping (torch.nn.utils.clip_grad_norm_), lower learning rate, or add normalization).

---
## Reference Absorption: Common PyTorch Bugs
- These are the bugs that waste the most collective hours in the PyTorch community:
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (these are the bugs that waste the most collective hours in the pytorch community:).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (these are the bugs that waste the most collective hours in the pytorch community:).

---
## Reference Absorption: The Debugging Mindset
- Forget print-and-pray debugging.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (forget print-and-pray debugging).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (forget print-and-pray debugging).
- Neural network debugging requires a systematic approach because the feedback loop is slow (minutes to hours per training run) and the symptoms are ambiguous (bad loss could mean 20 different things).
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (neural network debugging requires a systematic approach because the feedback loop is slow (minutes to hours per training run) a...).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (neural network debugging requires a systematic approach because the feedback loop is slow (minutes to hours per train...).
- The golden rule: start simple, add complexity one piece at a time, and verify each piece independently.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (the golden rule: start simple, add complexity one piece at a time, and verify each piece independently).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (the golden rule: start simple, add complexity one piece at a time, and verify each piece independently).

---
## Reference Absorption: Symptom 2: Loss Decreasing But Model is Bad
- Or the model produces nonsensical outputs on real data.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (or the model produces nonsensical outputs on real data).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (or the model produces nonsensical outputs on real data).
- Overfitting. The model memorizes training data instead of learning patterns.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (overfitting. the model memorizes training data instead of learning patterns).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (overfitting. the model memorizes training data instead of learning patterns).
- Gap between training and validation loss grows over time.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (gap between training and validation loss grows over time).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (gap between training and validation loss grows over time).
- Fix: more data, dropout, weight decay, early stopping, data augmentation.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (fix: more data, dropout, weight decay, early stopping, data augmentation).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (fix: more data, dropout, weight decay, early stopping, data augmentation).

---
## Reference Absorption: Symptom 2: Loss Decreasing But Model is Bad (cont.)
- Data leakage. Test data leaked into training.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (data leakage. test data leaked into training).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (data leakage. test data leaked into training).
- Accuracy is suspiciously high.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (accuracy is suspiciously high).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (accuracy is suspiciously high).
- Common causes: shuffling before splitting, preprocessing with statistics from the full dataset, duplicate samples across splits.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (common causes: shuffling before splitting, preprocessing with statistics from the full dataset, duplicate samples across splits).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (common causes: shuffling before splitting, preprocessing with statistics from the full dataset, duplicate samples acr...).
- Fix: split first, preprocess second, check for duplicates.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (fix: split first, preprocess second, check for duplicates).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (fix: split first, preprocess second, check for duplicates).

---
## Reference Absorption: Symptom 2: Loss Decreasing But Model is Bad Deep Continuation
- Label errors. 5-10% of labels in most real datasets are wrong (Northcutt et al., 2021 -- "Pervasive Label Errors in Test Sets").
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (label errors. 5-10% of labels in most real datasets are wrong (northcutt et al., 2021 -- "pervasive label errors in test sets")).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (label errors. 5-10% of labels in most real datasets are wrong (northcutt et al., 2021 -- "pervasive label errors in t...).
- Fix: use confident learning to find and fix mislabeled examples, or use loss truncation to ignore high-loss samples.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (fix: use confident learning to find and fix mislabeled examples, or use loss truncation to ignore high-loss samples).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (fix: use confident learning to find and fix mislabeled examples, or use loss truncation to ignore high-loss samples).

---
## Reference Absorption: Technique 1: Gradient Checking
- Compare your analytical gradients (from backprop) to numerical gradients (from finite differences).
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (compare your analytical gradients (from backprop) to numerical gradients (from finite differences)).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (compare your analytical gradients (from backprop) to numerical gradients (from finite differences)).
- If they disagree, your backward pass has a bug.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (if they disagree, your backward pass has a bug).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (if they disagree, your backward pass has a bug).
- Numerical gradient for parameter w:
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (numerical gradient for parameter w:).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (numerical gradient for parameter w:).
- Agreement metric (relative difference):
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (agreement metric (relative difference):).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (agreement metric (relative difference):).

---
## Reference Absorption: Technique 1: Gradient Checking (cont.)
- If rel_diff < 1e-5: correct.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (if rel_diff < 1e-5: correct).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (if rel_diff < 1e-5: correct).
- If rel_diff > 1e-3: almost certainly a bug.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (if rel_diff > 1e-3: almost certainly a bug).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (if rel_diff > 1e-3: almost certainly a bug).

---
## Reference Absorption: Symptom 3: NaN or Inf in Loss
- The loss value becomes nan or inf.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (the loss value becomes nan or inf).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (the loss value becomes nan or inf).
- Learning rate too high. Gradient updates overshoot so far that weights explode.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (learning rate too high. gradient updates overshoot so far that weights explode).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (learning rate too high. gradient updates overshoot so far that weights explode).
- log(0) or log(negative). Cross-entropy loss computes log(p).
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (log(0) or log(negative). cross-entropy loss computes log(p)).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (log(0) or log(negative). cross-entropy loss computes log(p)).
- If your model outputs exactly 0 or a negative probability, the log explodes.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (if your model outputs exactly 0 or a negative probability, the log explodes).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (if your model outputs exactly 0 or a negative probability, the log explodes).

---
## Reference Absorption: Symptom 3: NaN or Inf in Loss (cont.)
- Fix: clamp predictions to [eps, 1-eps] where eps=1e-7.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (fix: clamp predictions to [eps, 1-eps] where eps=1e-7).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (fix: clamp predictions to [eps, 1-eps] where eps=1e-7).
- Division by zero. Batch normalization divides by standard deviation.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (division by zero. batch normalization divides by standard deviation).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (division by zero. batch normalization divides by standard deviation).
- A batch with constant values has std=0.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (a batch with constant values has std=0).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (a batch with constant values has std=0).
- Fix: add epsilon to the denominator (PyTorch does this by default, but custom implementations might not).
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (fix: add epsilon to the denominator (pytorch does this by default, but custom implementations might not)).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (fix: add epsilon to the denominator (pytorch does this by default, but custom implementations might not)).

---
## Reference Absorption: Symptom 3: NaN or Inf in Loss Deep Continuation
- Numerical overflow. Large activations fed into exp() produce Inf.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (numerical overflow. large activations fed into exp() produce inf).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (numerical overflow. large activations fed into exp() produce inf).
- Softmax is especially prone.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (softmax is especially prone).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (softmax is especially prone).
- Fix: subtract the max before exponentiating (the log-sum-exp trick).
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (fix: subtract the max before exponentiating (the log-sum-exp trick)).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (fix: subtract the max before exponentiating (the log-sum-exp trick)).

---
## Reference Absorption: Further Reading
- Smith, "Cyclical Learning Rates for Training Neural Networks" (2017) -- the paper introducing the learning rate range test (LR finder)
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (smith, "cyclical learning rates for training neural networks" (2017) -- the paper introducing the learning rate range test (lr...).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (smith, "cyclical learning rates for training neural networks" (2017) -- the paper introducing the learning rate range...).
- Northcutt et al., "Pervasive Label Errors in Test Sets Destabilize Machine Learning Benchmarks" (2021) -- demonstrates that 3-6% of labels in ImageNet, CIFAR-10, and other major benchmarks are wrong
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (northcutt et al., "pervasive label errors in test sets destabilize machine learning benchmarks" (2021) -- demonstrates that 3-6...).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (northcutt et al., "pervasive label errors in test sets destabilize machine learning benchmarks" (2021) -- demonstrate...).
- Zhang et al., "Understanding Deep Learning Requires Rethinking Generalization" (2017) -- the paper showing neural networks can memorize random labels, which is why the overfit-one-batch test works
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (zhang et al., "understanding deep learning requires rethinking generalization" (2017) -- the paper showing neural networks can...).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (zhang et al., "understanding deep learning requires rethinking generalization" (2017) -- the paper showing neural net...).
- PyTorch documentation on torch.autograd.detect_anomaly and torch.autograd.set_detect_anomaly for built-in NaN/Inf detection
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (pytorch documentation on torch.autograd.detect_anomaly and torch.autograd.set_detect_anomaly for built-in nan/inf detection).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (pytorch documentation on torch.autograd.detect_anomaly and torch.autograd.set_detect_anomaly for built-in nan/inf det...).

---
## Reference Absorption: Technique 5: Learning Rate Finder
- Leslie Smith (2017) proposed sweeping the learning rate from very small (1e-7) to very large (10) over one epoch while recording the loss.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (leslie smith (2017) proposed sweeping the learning rate from very small (1e-7) to very large (10) over one epoch while recordin...).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (leslie smith (2017) proposed sweeping the learning rate from very small (1e-7) to very large (10) over one epoch whil...).
- The optimal learning rate is roughly 10x smaller than the rate where loss starts decreasing fastest.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (the optimal learning rate is roughly 10x smaller than the rate where loss starts decreasing fastest).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (the optimal learning rate is roughly 10x smaller than the rate where loss starts decreasing fastest).
- Best LR in this example: ~1e-3 (one order of magnitude before the steepest point).
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (best lr in this example: ~1e-3 (one order of magnitude before the steepest point)).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (best lr in this example: ~1e-3 (one order of magnitude before the steepest point)).

---
## Reference Absorption: Technique 3: Gradient Flow Visualization
- Plot the average gradient magnitude for each layer.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (plot the average gradient magnitude for each layer).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (plot the average gradient magnitude for each layer).
- In a healthy network, gradient magnitudes should be roughly similar across layers.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (in a healthy network, gradient magnitudes should be roughly similar across layers).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (in a healthy network, gradient magnitudes should be roughly similar across layers).
- If early layers have gradients 1000x smaller than later layers, you have vanishing gradients.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (if early layers have gradients 1000x smaller than later layers, you have vanishing gradients).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (if early layers have gradients 1000x smaller than later layers, you have vanishing gradients).

---
## Reference Absorption: Technique 4: The Overfit-One-Batch Test
- The single most important debugging technique in deep learning.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (the single most important debugging technique in deep learning).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (the single most important debugging technique in deep learning).
- Take one small batch (8-32 samples).
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (take one small batch (8-32 samples)).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (take one small batch (8-32 samples)).
- Train on it for 100+ iterations.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (train on it for 100+ iterations).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (train on it for 100+ iterations).
- The loss should go to nearly zero and training accuracy should hit 100%.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (the loss should go to nearly zero and training accuracy should hit 100%).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (the loss should go to nearly zero and training accuracy should hit 100%).

---
## Reference Absorption: Technique 4: The Overfit-One-Batch Test (cont.)
- If it does not, your model or training loop has a fundamental bug -- do not proceed to full training.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (if it does not, your model or training loop has a fundamental bug -- do not proceed to full training).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (if it does not, your model or training loop has a fundamental bug -- do not proceed to full training).
- Architecture too small to represent the data
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (architecture too small to represent the data).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (architecture too small to represent the data).
- Optimizer not connected to model parameters
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (optimizer not connected to model parameters).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (optimizer not connected to model parameters).
- This takes 30 seconds to run and saves hours of debugging full training runs.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (this takes 30 seconds to run and saves hours of debugging full training runs).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (this takes 30 seconds to run and saves hours of debugging full training runs).

---
## Reference Absorption: Ship It
- outputs/prompt-nn-debugger.md -- a prompt for diagnosing neural network training failures
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (outputs/prompt-nn-debugger.md -- a prompt for diagnosing neural network training failures).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (outputs/prompt-nn-debugger.md -- a prompt for diagnosing neural network training failures).
- outputs/skill-debug-checklist.md -- a decision-tree checklist for debugging training issues
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (outputs/skill-debug-checklist.md -- a decision-tree checklist for debugging training issues).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (outputs/skill-debug-checklist.md -- a decision-tree checklist for debugging training issues).
- Key deployment patterns for debugging:
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (key deployment patterns for debugging:).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (key deployment patterns for debugging:).
- Add monitoring hooks to production training scripts
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (add monitoring hooks to production training scripts).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (add monitoring hooks to production training scripts).

---
## Reference Absorption: Ship It (cont.)
- Log activation and gradient statistics to W&B or TensorBoard every N steps
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (log activation and gradient statistics to w&b or tensorboard every n steps).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (log activation and gradient statistics to w&b or tensorboard every n steps).
- Implement automatic alerts for NaN loss, dead neurons (>80% zero), or gradient explosion
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (implement automatic alerts for nan loss, dead neurons (>80% zero), or gradient explosion).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (implement automatic alerts for nan loss, dead neurons (>80% zero), or gradient explosion).
- Always run the overfit-one-batch test when changing architectures or data pipelines
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (always run the overfit-one-batch test when changing architectures or data pipelines).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (always run the overfit-one-batch test when changing architectures or data pipelines).

---
## Reference Absorption: Technique 2: Activation Statistics
- Monitor the mean and standard deviation of activations after each layer during training.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (monitor the mean and standard deviation of activations after each layer during training).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (monitor the mean and standard deviation of activations after each layer during training).
- Healthy networks maintain activations with mean near 0 and std near 1 (after normalization) or at least bounded.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (healthy networks maintain activations with mean near 0 and std near 1 (after normalization) or at least bounded).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (healthy networks maintain activations with mean near 0 and std near 1 (after normalization) or at least bounded).

---
## Reference Absorption: Learning Objectives
- Diagnose common neural network failures (NaN loss, flat loss curve, overfitting, oscillation) using systematic debugging strategies
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (diagnose common neural network failures (nan loss, flat loss curve, overfitting, oscillation) using systematic debugging strate...).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (diagnose common neural network failures (nan loss, flat loss curve, overfitting, oscillation) using systematic debugg...).
- Apply the "overfit one batch" technique to verify that your model architecture and training loop are correct
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (apply the "overfit one batch" technique to verify that your model architecture and training loop are correct).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (apply the "overfit one batch" technique to verify that your model architecture and training loop are correct).
- Inspect gradient magnitudes, activation distributions, and weight norms to identify vanishing/exploding gradient problems
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (inspect gradient magnitudes, activation distributions, and weight norms to identify vanishing/exploding gradient problems).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (inspect gradient magnitudes, activation distributions, and weight norms to identify vanishing/exploding gradient prob...).
- Build a debugging checklist that covers data pipeline, model architecture, loss function, optimizer, and learning rate issues
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (build a debugging checklist that covers data pipeline, model architecture, loss function, optimizer, and learning rate issues).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (build a debugging checklist that covers data pipeline, model architecture, loss function, optimizer, and learning rat...).

---
## Reference Absorption: The Debug Checklist (Before Full Training)
- Print model summary -- verify parameter count is reasonable.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (print model summary -- verify parameter count is reasonable).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (print model summary -- verify parameter count is reasonable).
- Run a single forward pass with random data -- check output shape.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (run a single forward pass with random data -- check output shape).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (run a single forward pass with random data -- check output shape).
- Train for 5 epochs -- verify loss decreases.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (train for 5 epochs -- verify loss decreases).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (train for 5 epochs -- verify loss decreases).
- Check activation statistics -- no dead layers, no explosions.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (check activation statistics -- no dead layers, no explosions).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (check activation statistics -- no dead layers, no explosions).

---
## Reference Absorption: The Debug Checklist (Before Full Training) (cont.)
- Check gradient flow -- no vanishing, no exploding.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (check gradient flow -- no vanishing, no exploding).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (check gradient flow -- no vanishing, no exploding).
- Verify data pipeline -- print 5 random samples with labels.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (verify data pipeline -- print 5 random samples with labels).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (verify data pipeline -- print 5 random samples with labels).

---
## Reference Absorption: Overview
- The number is wrong and nothing crashed.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (the number is wrong and nothing crashed).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (the number is wrong and nothing crashed).
- Welcome to the hardest kind of debugging -- the kind where there is no error message.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (welcome to the hardest kind of debugging -- the kind where there is no error message).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (welcome to the hardest kind of debugging -- the kind where there is no error message).

---
## Reference Absorption: Build It
- A diagnostic toolkit that monitors activations, gradients, and loss curves.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (a diagnostic toolkit that monitors activations, gradients, and loss curves).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (a diagnostic toolkit that monitors activations, gradients, and loss curves).
- You will deliberately break a network and use the toolkit to diagnose each problem.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (you will deliberately break a network and use the toolkit to diagnose each problem).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (you will deliberately break a network and use the toolkit to diagnose each problem).

---
## Beyond Reference: Engineering Translation
- Core anchors for this module: loss, model, grad, print, gradient, self, learning, batch.
- Convert each theoretical primitive into measurable training and inference behaviors.
- Define observability checkpoints for drift, calibration, and latency regressions.
- Tie assumptions to explicit data contracts and fallback policies.

---
## Beyond Reference: Advanced Layer 1
- Apply systematic debugging ladders: data, forward pass, gradients, optimizer state, and schedule.
- Risk and governance extension: convert this into acceptance tests and rollback criteria (apply systematic debugging ladders: data, forward pass, gradients, optimizer state, and schedule.).
- Use overfit-one-batch and gradient-norm tracing as first-line diagnostics for silent failures.
- Risk and governance extension: convert this into acceptance tests and rollback criteria (use overfit-one-batch and gradient-norm tracing as first-line diagnostics for silent failures.).
- Create failure playbooks for NaNs, flat loss, oscillation, and catastrophic overfitting.
- Risk and governance extension: convert this into acceptance tests and rollback criteria (create failure playbooks for nans, flat loss, oscillation, and catastrophic overfitting.).

---
## Beyond Reference: Detailed Deepening 1
- Derivation drill: formalize loss from first principles, list assumptions, and prove where approximations hold.
- Failure analysis: document two production scenarios where model breaks and define quantitative mitigations.
- Experimental protocol: isolate grad via ablations, confidence intervals, and compute-normalized comparisons.
- Productionization pattern: expose print through metrics, dashboards, and incident-response playbooks.
- Data-contract alignment: specify how upstream schema and quality constraints affect gradient.

---
## Beyond Reference: Detailed Deepening 2
- Optimization interaction: analyze how regularization, scaling, and search strategy alter self.
- Generalization lens: connect learning to bias-variance behavior and OOD robustness.
- Validation checklist: define correctness, stability, and reproducibility checks for batch.
- Research bridge: compare classical treatment of data with modern practical adaptations.
- Scalability plan: benchmark mean under larger datasets, tighter latency, and stricter memory limits.

---
## Beyond Reference: Detailed Deepening 3
- Derivation drill: formalize stats from first principles, list assumptions, and prove where approximations hold.
- Failure analysis: document two production scenarios where training breaks and define quantitative mitigations.
- Experimental protocol: isolate gradients via ablations, confidence intervals, and compute-normalized comparisons.
- Productionization pattern: expose name through metrics, dashboards, and incident-response playbooks.
- Data-contract alignment: specify how upstream schema and quality constraints affect item.

---
## Beyond Reference: Detailed Deepening 4
- Optimization interaction: analyze how regularization, scaling, and search strategy alter torch.

<!-- DEPTH_EXPANSION_END -->
