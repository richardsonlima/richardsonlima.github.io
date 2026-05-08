---
layout: slides
title: "Optimizers: SGD, Momentum, Adam, AdamW"
category: "ai-engineering-course-step-03"
module_number: 6
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
## Module 06: Optimizers: SGD, Momentum, Adam, AdamW
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
- You know that weight #4,721 should decrease by 0.003 to reduce the loss.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (you know that weight #4,721 should decrease by 0.003 to reduce the loss).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (you know that weight #4,721 should decrease by 0.003 to reduce the loss).
- And should you move the same amount on step 1 as on step 1,000?
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (and should you move the same amount on step 1 as on step 1,000?).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (and should you move the same amount on step 1 as on step 1,000?).
- Vanilla gradient descent applies the same learning rate to every parameter on every step: w = w - lr * gradient.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (vanilla gradient descent applies the same learning rate to every parameter on every step: w = w - lr * gradient).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (vanilla gradient descent applies the same learning rate to every parameter on every step: w = w - lr * gradient).
- This creates three problems that make training neural networks painful in practice.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (this creates three problems that make training neural networks painful in practice).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (this creates three problems that make training neural networks painful in practice).

---
## Reference Absorption: The Problem (cont.)
- The loss landscape is rarely shaped like a smooth bowl.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (the loss landscape is rarely shaped like a smooth bowl).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (the loss landscape is rarely shaped like a smooth bowl).
- It's more like a long, narrow valley.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (it's more like a long, narrow valley).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (it's more like a long, narrow valley).
- The gradient points across the valley (steep direction), not along it (shallow direction).
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (the gradient points across the valley (steep direction), not along it (shallow direction)).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (the gradient points across the valley (steep direction), not along it (shallow direction)).
- Gradient descent bounces back and forth across the narrow dimension while making tiny progress along the useful one.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (gradient descent bounces back and forth across the narrow dimension while making tiny progress along the useful one).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (gradient descent bounces back and forth across the narrow dimension while making tiny progress along the useful one).

---
## Reference Absorption: The Problem Deep Continuation
- You've seen this: loss drops fast then plateaus, not because the model converged but because it's oscillating.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (you've seen this: loss drops fast then plateaus, not because the model converged but because it's oscillating).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (you've seen this: loss drops fast then plateaus, not because the model converged but because it's oscillating).
- Second, one learning rate for all parameters is wrong.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (second, one learning rate for all parameters is wrong).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (second, one learning rate for all parameters is wrong).
- Some weights need large updates (they're in the early, underfitting stage).
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (some weights need large updates (they're in the early, underfitting stage)).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (some weights need large updates (they're in the early, underfitting stage)).
- Others need tiny updates (they're near their optimal value).
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (others need tiny updates (they're near their optimal value)).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (others need tiny updates (they're near their optimal value)).

---
## Reference Absorption: The Problem Deep Continuation
- A learning rate that works for the former destroys the latter, and vice versa.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (a learning rate that works for the former destroys the latter, and vice versa).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (a learning rate that works for the former destroys the latter, and vice versa).
- In high dimensions, the loss landscape has vast flat regions where the gradient is near zero.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (in high dimensions, the loss landscape has vast flat regions where the gradient is near zero).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (in high dimensions, the loss landscape has vast flat regions where the gradient is near zero).
- Vanilla SGD crawls through these at the speed of the gradient, which is effectively zero.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (vanilla sgd crawls through these at the speed of the gradient, which is effectively zero).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (vanilla sgd crawls through these at the speed of the gradient, which is effectively zero).
- It isn't stuck -- it's in a flat region with useful descent on the other side.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (it isn't stuck -- it's in a flat region with useful descent on the other side).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (it isn't stuck -- it's in a flat region with useful descent on the other side).

---
## Reference Absorption: The Problem Deep Continuation
- But SGD has no mechanism to push through.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (but sgd has no mechanism to push through).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (but sgd has no mechanism to push through).
- It maintains two running averages per parameter -- the mean gradient (momentum, handles oscillation) and the mean squared gradient (adaptive rate, handles different scales).
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (it maintains two running averages per parameter -- the mean gradient (momentum, handles oscillation) and the mean squared gradi...).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (it maintains two running averages per parameter -- the mean gradient (momentum, handles oscillation) and the mean squ...).
- Combined with bias correction for the first few steps, it gives you a single optimizer that works on 80% of problems with default hyperparameters.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (combined with bias correction for the first few steps, it gives you a single optimizer that works on 80% of problems with defau...).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (combined with bias correction for the first few steps, it gives you a single optimizer that works on 80% of problems...).
- This lesson builds it from scratch so you understand exactly when and why it fails on the other 20%.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (this lesson builds it from scratch so you understand exactly when and why it fails on the other 20%).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (this lesson builds it from scratch so you understand exactly when and why it fails on the other 20%).

---
## Reference Absorption: Exercises
- Implement Nesterov momentum, where you compute the gradient at the "lookahead" position (w - lr * beta * v) instead of the current position.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (implement nesterov momentum, where you compute the gradient at the "lookahead" position (w - lr * beta * v) instead of the curr...).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (implement nesterov momentum, where you compute the gradient at the "lookahead" position (w - lr * beta * v) instead o...).
- Compare convergence to standard momentum on the circle dataset.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (compare convergence to standard momentum on the circle dataset).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (compare convergence to standard momentum on the circle dataset).
- Implement a learning rate warmup schedule: linear ramp from 0 to max_lr over the first 10% of training steps, then cosine decay to 0.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (implement a learning rate warmup schedule: linear ramp from 0 to max_lr over the first 10% of training steps, then cosine decay...).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (implement a learning rate warmup schedule: linear ramp from 0 to max_lr over the first 10% of training steps, then co...).
- Train with Adam + warmup vs Adam without warmup.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (train with adam + warmup vs adam without warmup).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (train with adam + warmup vs adam without warmup).

---
## Reference Absorption: Exercises (cont.)
- Measure how many epochs it takes to reach 90% accuracy on the circle dataset.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (measure how many epochs it takes to reach 90% accuracy on the circle dataset).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (measure how many epochs it takes to reach 90% accuracy on the circle dataset).
- Track the effective learning rate for each parameter during Adam training.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (track the effective learning rate for each parameter during adam training).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (track the effective learning rate for each parameter during adam training).
- The effective rate is lr * m_hat / (sqrt(v_hat) + eps).
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (the effective rate is lr * m_hat / (sqrt(v_hat) + eps)).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (the effective rate is lr * m_hat / (sqrt(v_hat) + eps)).
- Plot the distribution of effective rates after 10, 50, and 200 steps.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (plot the distribution of effective rates after 10, 50, and 200 steps).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (plot the distribution of effective rates after 10, 50, and 200 steps).

---
## Reference Absorption: Exercises Deep Continuation
- Are all parameters being updated at the same speed?
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (are all parameters being updated at the same speed?).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (are all parameters being updated at the same speed?).
- Implement gradient clipping (clip by global norm).
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (implement gradient clipping (clip by global norm)).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (implement gradient clipping (clip by global norm)).
- Set the max gradient norm to 1.0.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (set the max gradient norm to 1.0).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (set the max gradient norm to 1.0).
- Train with and without clipping using a high learning rate (lr=0.01 for Adam).
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (train with and without clipping using a high learning rate (lr=0.01 for adam)).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (train with and without clipping using a high learning rate (lr=0.01 for adam)).

---
## Reference Absorption: Exercises Deep Continuation
- Count how many runs diverge (loss goes to NaN) with and without clipping over 10 random seeds.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (count how many runs diverge (loss goes to nan) with and without clipping over 10 random seeds).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (count how many runs diverge (loss goes to nan) with and without clipping over 10 random seeds).
- Compare Adam vs AdamW on a network with large weights.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (compare adam vs adamw on a network with large weights).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (compare adam vs adamw on a network with large weights).
- Initialize all weights to random values in [-5, 5] (much larger than normal).
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (initialize all weights to random values in [-5, 5] (much larger than normal)).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (initialize all weights to random values in [-5, 5] (much larger than normal)).
- Train for 200 epochs with weight_decay=0.1.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (train for 200 epochs with weight_decay=0.1).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (train for 200 epochs with weight_decay=0.1).

---
## Reference Absorption: Exercises Deep Continuation
- Plot the L2 norm of weights over training for both optimizers.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (plot the l2 norm of weights over training for both optimizers).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (plot the l2 norm of weights over training for both optimizers).
- AdamW should show faster weight shrinkage.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (adamw should show faster weight shrinkage).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (adamw should show faster weight shrinkage).

---
## Reference Absorption: Step 5: Training Comparison
- Train the same two-layer network on the circle dataset from lesson 05 with all four optimizers.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (train the same two-layer network on the circle dataset from lesson 05 with all four optimizers).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (train the same two-layer network on the circle dataset from lesson 05 with all four optimizers).

---
## Reference Absorption: Use It
- PyTorch optimizers handle parameter groups, gradient clipping, and learning rate scheduling:
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (pytorch optimizers handle parameter groups, gradient clipping, and learning rate scheduling:).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (pytorch optimizers handle parameter groups, gradient clipping, and learning rate scheduling:).
- The pattern is always: zero_grad, forward, loss, backward, (clip), step, (schedule).
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (the pattern is always: zero_grad, forward, loss, backward, (clip), step, (schedule)).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (the pattern is always: zero_grad, forward, loss, backward, (clip), step, (schedule)).
- Getting it wrong (e.g., calling scheduler.step() before optimizer.step()) is a common source of subtle bugs.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (getting it wrong (e.g., calling scheduler.step() before optimizer.step()) is a common source of subtle bugs).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (getting it wrong (e.g., calling scheduler.step() before optimizer.step()) is a common source of subtle bugs).
- For CNNs, many practitioners still prefer SGD + momentum (lr=0.1, momentum=0.9, weight_decay=1e-4) with a step or cosine schedule.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (for cnns, many practitioners still prefer sgd + momentum (lr=0.1, momentum=0.9, weight_decay=1e-4) with a step or cosine schedule).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (for cnns, many practitioners still prefer sgd + momentum (lr=0.1, momentum=0.9, weight_decay=1e-4) with a step or cos...).

---
## Reference Absorption: Use It (cont.)
- SGD finds flatter minima, which often generalize better.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (sgd finds flatter minima, which often generalize better).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (sgd finds flatter minima, which often generalize better).
- For transformers and LLMs, AdamW with warmup + cosine decay is the universal default.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (for transformers and llms, adamw with warmup + cosine decay is the universal default).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (for transformers and llms, adamw with warmup + cosine decay is the universal default).
- Don't fight the consensus without a measured reason.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (don't fight the consensus without a measured reason).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (don't fight the consensus without a measured reason).

---
## Reference Absorption: AdamW: Weight Decay Done Right
- L2 regularization adds lambda * w^2 to the loss.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (l2 regularization adds lambda * w^2 to the loss).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (l2 regularization adds lambda * w^2 to the loss).
- In vanilla SGD, this is equivalent to weight decay (subtracting lambda * w from the weight at each step).
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (in vanilla sgd, this is equivalent to weight decay (subtracting lambda * w from the weight at each step)).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (in vanilla sgd, this is equivalent to weight decay (subtracting lambda * w from the weight at each step)).
- In Adam, this equivalence breaks.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (in adam, this equivalence breaks).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (in adam, this equivalence breaks).
- The Loshchilov & Hutter insight: when you add L2 to the loss and then Adam processes the gradient, the adaptive learning rate scales the regularization term too.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (the loshchilov & hutter insight: when you add l2 to the loss and then adam processes the gradient, the adaptive learning rate s...).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (the loshchilov & hutter insight: when you add l2 to the loss and then adam processes the gradient, the adaptive learn...).

---
## Reference Absorption: AdamW: Weight Decay Done Right (cont.)
- Parameters with large gradient variance get less regularization.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (parameters with large gradient variance get less regularization).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (parameters with large gradient variance get less regularization).
- Parameters with small variance get more.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (parameters with small variance get more).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (parameters with small variance get more).
- This is not what you want -- you want uniform regularization regardless of the gradient statistics.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (this is not what you want -- you want uniform regularization regardless of the gradient statistics).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (this is not what you want -- you want uniform regularization regardless of the gradient statistics).
- AdamW fixes this by applying weight decay directly to the weights, after the Adam update:
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (adamw fixes this by applying weight decay directly to the weights, after the adam update:).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (adamw fixes this by applying weight decay directly to the weights, after the adam update:).

---
## Reference Absorption: AdamW: Weight Decay Done Right Deep Continuation
- The weight decay term (lr * lambda * w) is not scaled by Adam's adaptive factor.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (the weight decay term (lr * lambda * w) is not scaled by adam's adaptive factor).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (the weight decay term (lr * lambda * w) is not scaled by adam's adaptive factor).
- Every parameter gets the same proportional shrinkage.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (every parameter gets the same proportional shrinkage).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (every parameter gets the same proportional shrinkage).
- This seems like a minor detail.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (this seems like a minor detail).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (this seems like a minor detail).
- AdamW converges to better solutions than Adam + L2 regularization on virtually every task.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (adamw converges to better solutions than adam + l2 regularization on virtually every task).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (adamw converges to better solutions than adam + l2 regularization on virtually every task).

---
## Reference Absorption: AdamW: Weight Decay Done Right Deep Continuation
- It's the default optimizer in PyTorch for training transformers, diffusion models, and most modern architectures.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (it's the default optimizer in pytorch for training transformers, diffusion models, and most modern architectures).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (it's the default optimizer in pytorch for training transformers, diffusion models, and most modern architectures).
- BERT, GPT, LLaMA, Stable Diffusion -- all trained with AdamW.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (bert, gpt, llama, stable diffusion -- all trained with adamw).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (bert, gpt, llama, stable diffusion -- all trained with adamw).

---
## Reference Absorption: Adam: Momentum + RMSProp
- It maintains two exponential moving averages per parameter:
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (it maintains two exponential moving averages per parameter:).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (it maintains two exponential moving averages per parameter:).
- Bias correction is the key detail most explanations skip.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (bias correction is the key detail most explanations skip).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (bias correction is the key detail most explanations skip).
- At step 1, m_1 = (1 - beta1) * gradient.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (at step 1, m_1 = (1 - beta1) * gradient).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (at step 1, m_1 = (1 - beta1) * gradient).
- With beta1 = 0.9, that's 0.1 * gradient -- ten times too small.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (with beta1 = 0.9, that's 0.1 * gradient -- ten times too small).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (with beta1 = 0.9, that's 0.1 * gradient -- ten times too small).

---
## Reference Absorption: Adam: Momentum + RMSProp (cont.)
- The moving average hasn't warmed up yet.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (the moving average hasn't warmed up yet).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (the moving average hasn't warmed up yet).
- Bias correction compensates:
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (bias correction compensates:).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (bias correction compensates:).
- At step 1 with beta1 = 0.9: m_hat = m_1 / (1 - 0.9) = m_1 / 0.1 = the actual gradient.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (at step 1 with beta1 = 0.9: m_hat = m_1 / (1 - 0.9) = m_1 / 0.1 = the actual gradient).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (at step 1 with beta1 = 0.9: m_hat = m_1 / (1 - 0.9) = m_1 / 0.1 = the actual gradient).
- At step 100: (1 - 0.9^100) is approximately 1.0, so the correction vanishes.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (at step 100: (1 - 0.9^100) is approximately 1.0, so the correction vanishes).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (at step 100: (1 - 0.9^100) is approximately 1.0, so the correction vanishes).

---
## Reference Absorption: Adam: Momentum + RMSProp Deep Continuation
- Bias correction matters for the first ~10 steps and is irrelevant after ~50.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (bias correction matters for the first ~10 steps and is irrelevant after ~50).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (bias correction matters for the first ~10 steps and is irrelevant after ~50).
- Adam defaults: lr = 0.001, beta1 = 0.9, beta2 = 0.999, epsilon = 1e-8.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (adam defaults: lr = 0.001, beta1 = 0.9, beta2 = 0.999, epsilon = 1e-8).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (adam defaults: lr = 0.001, beta1 = 0.9, beta2 = 0.999, epsilon = 1e-8).
- These defaults work for 80% of problems.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (these defaults work for 80% of problems).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (these defaults work for 80% of problems).
- When they don't, change lr first.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (when they don't, change lr first).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (when they don't, change lr first).

---
## Reference Absorption: Adam: Momentum + RMSProp Deep Continuation
- Almost never change beta1 or epsilon.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (almost never change beta1 or epsilon).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (almost never change beta1 or epsilon).

---
## Reference Absorption: Learning Rate: The Most Important Hyperparameter
- If you tune one hyperparameter, tune the learning rate.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (if you tune one hyperparameter, tune the learning rate).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (if you tune one hyperparameter, tune the learning rate).
- A 10x change in learning rate matters more than any architectural decision you'll make.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (a 10x change in learning rate matters more than any architectural decision you'll make).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (a 10x change in learning rate matters more than any architectural decision you'll make).
- Adam/AdamW: lr = 1e-4 to 3e-4
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (adam/adamw: lr = 1e-4 to 3e-4).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (adam/adamw: lr = 1e-4 to 3e-4).
- Fine-tuning pretrained models: lr = 1e-5 to 5e-5
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (fine-tuning pretrained models: lr = 1e-5 to 5e-5).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (fine-tuning pretrained models: lr = 1e-5 to 5e-5).

---
## Reference Absorption: Learning Rate: The Most Important Hyperparameter (cont.)
- Learning rate warmup: linear ramp over first 1-10% of steps
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (learning rate warmup: linear ramp over first 1-10% of steps).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (learning rate warmup: linear ramp over first 1-10% of steps).

---
## Reference Absorption: Momentum
- The ball-rolling-downhill analogy is overused but accurate.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (the ball-rolling-downhill analogy is overused but accurate).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (the ball-rolling-downhill analogy is overused but accurate).
- Instead of stepping by the gradient alone, you maintain a velocity that accumulates past gradients.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (instead of stepping by the gradient alone, you maintain a velocity that accumulates past gradients).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (instead of stepping by the gradient alone, you maintain a velocity that accumulates past gradients).
- Beta (typically 0.9) controls how much history to keep.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (beta (typically 0.9) controls how much history to keep).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (beta (typically 0.9) controls how much history to keep).
- With beta = 0.9, the momentum is roughly the average of the last 10 gradients (1 / (1 - 0.9) = 10).
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (with beta = 0.9, the momentum is roughly the average of the last 10 gradients (1 / (1 - 0.9) = 10)).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (with beta = 0.9, the momentum is roughly the average of the last 10 gradients (1 / (1 - 0.9) = 10)).

---
## Reference Absorption: Momentum (cont.)
- Why this fixes oscillation: gradients that point in the same direction accumulate.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (why this fixes oscillation: gradients that point in the same direction accumulate).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (why this fixes oscillation: gradients that point in the same direction accumulate).
- Gradients that flip direction cancel out.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (gradients that flip direction cancel out).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (gradients that flip direction cancel out).
- In that narrow valley, the "across" component flips sign each step and gets dampened.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (in that narrow valley, the "across" component flips sign each step and gets dampened).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (in that narrow valley, the "across" component flips sign each step and gets dampened).
- The "along" component stays consistent and gets amplified.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (the "along" component stays consistent and gets amplified).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (the "along" component stays consistent and gets amplified).

---
## Reference Absorption: Momentum Deep Continuation
- The result is smooth acceleration in the useful direction.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (the result is smooth acceleration in the useful direction).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (the result is smooth acceleration in the useful direction).
- Real numbers: SGD alone on a badly conditioned loss landscape might take 10,000 steps.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (real numbers: sgd alone on a badly conditioned loss landscape might take 10,000 steps).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (real numbers: sgd alone on a badly conditioned loss landscape might take 10,000 steps).
- SGD with momentum (beta=0.9) typically takes 3,000-5,000 steps on the same problem.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (sgd with momentum (beta=0.9) typically takes 3,000-5,000 steps on the same problem).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (sgd with momentum (beta=0.9) typically takes 3,000-5,000 steps on the same problem).
- The speedup is not marginal.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (the speedup is not marginal).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (the speedup is not marginal).

---
## Reference Absorption: RMSProp
- The first per-parameter adaptive learning rate method that actually worked.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (the first per-parameter adaptive learning rate method that actually worked).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (the first per-parameter adaptive learning rate method that actually worked).
- Proposed by Hinton in a Coursera lecture (never formally published).
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (proposed by hinton in a coursera lecture (never formally published)).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (proposed by hinton in a coursera lecture (never formally published)).
- s_t tracks the running average of squared gradients.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (s_t tracks the running average of squared gradients).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (s_t tracks the running average of squared gradients).
- Parameters with consistently large gradients get divided by a large number (smaller effective learning rate).
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (parameters with consistently large gradients get divided by a large number (smaller effective learning rate)).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (parameters with consistently large gradients get divided by a large number (smaller effective learning rate)).

---
## Reference Absorption: RMSProp (cont.)
- Parameters with small gradients get divided by a small number (larger effective learning rate).
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (parameters with small gradients get divided by a small number (larger effective learning rate)).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (parameters with small gradients get divided by a small number (larger effective learning rate)).
- This solves the "one learning rate for all parameters" problem.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (this solves the "one learning rate for all parameters" problem).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (this solves the "one learning rate for all parameters" problem).
- A weight that's already been getting large updates is probably near its target -- slow it down.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (a weight that's already been getting large updates is probably near its target -- slow it down).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (a weight that's already been getting large updates is probably near its target -- slow it down).
- A weight that's been getting tiny updates might be undertrained -- speed it up.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (a weight that's been getting tiny updates might be undertrained -- speed it up).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (a weight that's been getting tiny updates might be undertrained -- speed it up).

---
## Reference Absorption: RMSProp Deep Continuation
- Epsilon (typically 1e-8) prevents division by zero when a parameter hasn't been updated.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (epsilon (typically 1e-8) prevents division by zero when a parameter hasn't been updated).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (epsilon (typically 1e-8) prevents division by zero when a parameter hasn't been updated).

---
## Reference Absorption: Stochastic Gradient Descent (SGD)
- Compute the gradient on a mini-batch and step in the opposite direction.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (compute the gradient on a mini-batch and step in the opposite direction).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (compute the gradient on a mini-batch and step in the opposite direction).
- The "stochastic" means you use a random subset (mini-batch) of data to estimate the gradient, rather than the full dataset.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (the "stochastic" means you use a random subset (mini-batch) of data to estimate the gradient, rather than the full dataset).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (the "stochastic" means you use a random subset (mini-batch) of data to estimate the gradient, rather than the full da...).
- This noise is actually useful -- it helps escape sharp local minima.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (this noise is actually useful -- it helps escape sharp local minima).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (this noise is actually useful -- it helps escape sharp local minima).
- But the noise also causes oscillation.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (but the noise also causes oscillation).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (but the noise also causes oscillation).

---
## Beyond Reference: Engineering Translation
- Core anchors for this module: self, beta, gradient, params, adam, learning, step, rate.
- Convert each theoretical primitive into measurable training and inference behaviors.
- Define observability checkpoints for drift, calibration, and latency regressions.
- Tie assumptions to explicit data contracts and fallback policies.

---
## Beyond Reference: Advanced Layer 1
- Contrast SGD, momentum, Adam, and AdamW under matched learning-rate and weight-decay protocols.
- Risk and governance extension: convert this into acceptance tests and rollback criteria (contrast sgd, momentum, adam, and adamw under matched learning-rate and weight-decay protocols.).
- Diagnose optimizer pathologies through update norms, cosine alignment, and loss-surface traversal.
- Risk and governance extension: convert this into acceptance tests and rollback criteria (diagnose optimizer pathologies through update norms, cosine alignment, and loss-surface traversal.).
- Measure generalization differences caused by decoupled weight decay in AdamW.
- Risk and governance extension: convert this into acceptance tests and rollback criteria (measure generalization differences caused by decoupled weight decay in adamw.).

<!-- DEPTH_EXPANSION_END -->
