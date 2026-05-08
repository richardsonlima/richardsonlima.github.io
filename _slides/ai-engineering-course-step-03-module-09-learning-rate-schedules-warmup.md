---
layout: slides
title: "Learning Rate Schedules & Warmup"
category: "ai-engineering-course-step-03"
module_number: 9
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
## Module 09: Learning Rate Schedules & Warmup
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
- Set the learning rate to 0.1.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (set the learning rate to 0.1).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (set the learning rate to 0.1).
- Training diverges -- loss jumps to infinity in 3 steps.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (training diverges -- loss jumps to infinity in 3 steps).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (training diverges -- loss jumps to infinity in 3 steps).
- Training crawls -- after 100 epochs, the model has barely moved from random.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (training crawls -- after 100 epochs, the model has barely moved from random).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (training crawls -- after 100 epochs, the model has barely moved from random).
- Training works for 50 epochs, then the loss oscillates around a minimum it can never reach because the steps are too large.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (training works for 50 epochs, then the loss oscillates around a minimum it can never reach because the steps are too large).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (training works for 50 epochs, then the loss oscillates around a minimum it can never reach because the steps are too...).

---
## Reference Absorption: The Problem (cont.)
- The optimal learning rate is not a constant.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (the optimal learning rate is not a constant).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (the optimal learning rate is not a constant).
- Early on, you want large steps to cover ground quickly.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (early on, you want large steps to cover ground quickly).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (early on, you want large steps to cover ground quickly).
- Late in training, you want tiny steps to settle into a sharp minimum.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (late in training, you want tiny steps to settle into a sharp minimum).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (late in training, you want tiny steps to settle into a sharp minimum).
- The difference between a 90% accurate model and a 95% accurate model is often just the schedule.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (the difference between a 90% accurate model and a 95% accurate model is often just the schedule).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (the difference between a 90% accurate model and a 95% accurate model is often just the schedule).

---
## Reference Absorption: The Problem Deep Continuation
- Every major model published in the last three years uses a learning rate schedule.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (every major model published in the last three years uses a learning rate schedule).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (every major model published in the last three years uses a learning rate schedule).
- Llama 3 used peak lr=3e-4 with 2000 warmup steps and cosine decay to 3e-5.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (llama 3 used peak lr=3e-4 with 2000 warmup steps and cosine decay to 3e-5).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (llama 3 used peak lr=3e-4 with 2000 warmup steps and cosine decay to 3e-5).
- GPT-3 used lr=6e-4 with warmup over 375 million tokens.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (gpt-3 used lr=6e-4 with warmup over 375 million tokens).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (gpt-3 used lr=6e-4 with warmup over 375 million tokens).
- These are not arbitrary choices.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (these are not arbitrary choices).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (these are not arbitrary choices).

---
## Reference Absorption: The Problem Deep Continuation
- They are the result of extensive hyperparameter sweeps that cost millions of dollars.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (they are the result of extensive hyperparameter sweeps that cost millions of dollars).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (they are the result of extensive hyperparameter sweeps that cost millions of dollars).
- You need to understand schedules because the defaults will not work for your problem.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (you need to understand schedules because the defaults will not work for your problem).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (you need to understand schedules because the defaults will not work for your problem).
- When you fine-tune a pretrained model, the right schedule is different than training from scratch.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (when you fine-tune a pretrained model, the right schedule is different than training from scratch).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (when you fine-tune a pretrained model, the right schedule is different than training from scratch).
- When you increase batch size, the warmup period needs to change.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (when you increase batch size, the warmup period needs to change).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (when you increase batch size, the warmup period needs to change).

---
## Reference Absorption: The Problem Deep Continuation
- When training breaks at step 10,000, you need to know whether it's a schedule problem or something else.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (when training breaks at step 10,000, you need to know whether it's a schedule problem or something else).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (when training breaks at step 10,000, you need to know whether it's a schedule problem or something else).

---
## Reference Absorption: Exercises
- Implement exponential decay: lr(t) = lr_0 * gamma^t where gamma = 0.999.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (implement exponential decay: lr(t) = lr_0 * gamma^t where gamma = 0.999).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (implement exponential decay: lr(t) = lr_0 * gamma^t where gamma = 0.999).
- Compare to cosine annealing on the circle dataset.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (compare to cosine annealing on the circle dataset).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (compare to cosine annealing on the circle dataset).
- Implement the learning rate range test (Leslie Smith): train for a few hundred steps while exponentially increasing the LR from 1e-7 to 1.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (implement the learning rate range test (leslie smith): train for a few hundred steps while exponentially increasing the lr from...).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (implement the learning rate range test (leslie smith): train for a few hundred steps while exponentially increasing t...).
- The optimal max LR is just before the loss starts increasing.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (the optimal max lr is just before the loss starts increasing).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (the optimal max lr is just before the loss starts increasing).

---
## Reference Absorption: Exercises (cont.)
- Train with warmup + cosine but vary the warmup length: 0%, 1%, 5%, 10%, 20% of total steps.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (train with warmup + cosine but vary the warmup length: 0%, 1%, 5%, 10%, 20% of total steps).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (train with warmup + cosine but vary the warmup length: 0%, 1%, 5%, 10%, 20% of total steps).
- Find the sweet spot where training is most stable.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (find the sweet spot where training is most stable).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (find the sweet spot where training is most stable).
- Implement cosine annealing with warm restarts (SGDR): reset the learning rate to lr_max every T steps and decay again.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (implement cosine annealing with warm restarts (sgdr): reset the learning rate to lr_max every t steps and decay again).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (implement cosine annealing with warm restarts (sgdr): reset the learning rate to lr_max every t steps and decay again).
- Compare to standard cosine on a longer training run.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (compare to standard cosine on a longer training run).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (compare to standard cosine on a longer training run).

---
## Reference Absorption: Exercises Deep Continuation
- Build a "schedule surgeon" that monitors training loss and automatically switches from warmup to cosine when the loss stabilizes, and reduces lr if the loss plateaus for too long.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (build a "schedule surgeon" that monitors training loss and automatically switches from warmup to cosine when the loss stabilize...).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (build a "schedule surgeon" that monitors training loss and automatically switches from warmup to cosine when the loss...).

---
## Reference Absorption: Step 3: Training Network
- A simple two-layer network on the circle dataset, same as previous lessons, but now we vary the schedule.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (a simple two-layer network on the circle dataset, same as previous lessons, but now we vary the schedule).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (a simple two-layer network on the circle dataset, same as previous lessons, but now we vary the schedule).

---
## Reference Absorption: Step 1: Schedule Functions
- Each function takes the current step and returns the learning rate at that step.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (each function takes the current step and returns the learning rate at that step).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (each function takes the current step and returns the learning rate at that step).

---
## Reference Absorption: Use It
- PyTorch provides schedulers in torch.optim.lr_scheduler:
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (pytorch provides schedulers in torch.optim.lr_scheduler:).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (pytorch provides schedulers in torch.optim.lr_scheduler:).
- For warmup + cosine, use a lambda scheduler or the get_cosine_schedule_with_warmup from HuggingFace:
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (for warmup + cosine, use a lambda scheduler or the get_cosine_schedule_with_warmup from huggingface:).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (for warmup + cosine, use a lambda scheduler or the get_cosine_schedule_with_warmup from huggingface:).
- The HuggingFace function is what most Llama and GPT fine-tuning scripts use.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (the huggingface function is what most llama and gpt fine-tuning scripts use).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (the huggingface function is what most llama and gpt fine-tuning scripts use).
- When in doubt, use warmup + cosine with warmup = 3-5% of total steps.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (when in doubt, use warmup + cosine with warmup = 3-5% of total steps).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (when in doubt, use warmup + cosine with warmup = 3-5% of total steps).

---
## Reference Absorption: Use It (cont.)
- It works for almost everything.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (it works for almost everything).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (it works for almost everything).

---
## Reference Absorption: Step 5: LR Too High vs Too Low
- Demonstrate the three failure modes: too high (divergence), too low (crawling), and just right.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (demonstrate the three failure modes: too high (divergence), too low (crawling), and just right).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (demonstrate the three failure modes: too high (divergence), too low (crawling), and just right).

---
## Reference Absorption: Step 4: Compare All Schedules
- Train the same network with each schedule and compare final loss and convergence behavior.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (train the same network with each schedule and compare final loss and convergence behavior).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (train the same network with each schedule and compare final loss and convergence behavior).

---
## Reference Absorption: 1cycle Policy
- Leslie Smith's discovery (2018): ramp the learning rate up from a low value to a high value in the first half of training, then ramp it back down in the second half.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (leslie smith's discovery (2018): ramp the learning rate up from a low value to a high value in the first half of training, then...).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (leslie smith's discovery (2018): ramp the learning rate up from a low value to a high value in the first half of trai...).
- Counterintuitive -- why would you *increase* the learning rate midway through?
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (counterintuitive -- why would you *increase* the learning rate midway through?).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (counterintuitive -- why would you *increase* the learning rate midway through?).
- The theory: a high learning rate acts as regularization by adding noise to the optimization trajectory.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (the theory: a high learning rate acts as regularization by adding noise to the optimization trajectory).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (the theory: a high learning rate acts as regularization by adding noise to the optimization trajectory).
- The model explores more of the loss landscape during the ramp-up phase, finding better basins.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (the model explores more of the loss landscape during the ramp-up phase, finding better basins).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (the model explores more of the loss landscape during the ramp-up phase, finding better basins).

---
## Reference Absorption: 1cycle Policy (cont.)
- The ramp-down phase then refines within the best basin found.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (the ramp-down phase then refines within the best basin found).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (the ramp-down phase then refines within the best basin found).
- 1cycle often trains faster than cosine annealing for a fixed compute budget.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (1cycle often trains faster than cosine annealing for a fixed compute budget).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (1cycle often trains faster than cosine annealing for a fixed compute budget).
- The tradeoff: you must know the total number of steps in advance.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (the tradeoff: you must know the total number of steps in advance).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (the tradeoff: you must know the total number of steps in advance).

---
## Reference Absorption: Warmup: Why You Start Small
- Adam and other adaptive optimizers maintain running estimates of gradient mean and variance.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (adam and other adaptive optimizers maintain running estimates of gradient mean and variance).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (adam and other adaptive optimizers maintain running estimates of gradient mean and variance).
- At step 0, these estimates are initialized to zero.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (at step 0, these estimates are initialized to zero).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (at step 0, these estimates are initialized to zero).
- The first few gradient updates are based on garbage statistics.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (the first few gradient updates are based on garbage statistics).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (the first few gradient updates are based on garbage statistics).
- If your learning rate is large during this period, the model takes huge, poorly-directed steps.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (if your learning rate is large during this period, the model takes huge, poorly-directed steps).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (if your learning rate is large during this period, the model takes huge, poorly-directed steps).

---
## Reference Absorption: Warmup: Why You Start Small (cont.)
- Start with a tiny learning rate (often lr_max / warmup_steps or even zero) and linearly ramp up to lr_max over the first N steps.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (start with a tiny learning rate (often lr_max / warmup_steps or even zero) and linearly ramp up to lr_max over the first n steps).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (start with a tiny learning rate (often lr_max / warmup_steps or even zero) and linearly ramp up to lr_max over the fi...).
- By the time you reach the full learning rate, Adam's statistics have stabilized.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (by the time you reach the full learning rate, adam's statistics have stabilized).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (by the time you reach the full learning rate, adam's statistics have stabilized).
- Typical warmup: 1-5% of total training steps.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (typical warmup: 1-5% of total training steps).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (typical warmup: 1-5% of total training steps).
- Llama 3 trained for ~1.8 trillion tokens and warmed up for 2000 steps.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (llama 3 trained for ~1.8 trillion tokens and warmed up for 2000 steps).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (llama 3 trained for ~1.8 trillion tokens and warmed up for 2000 steps).

---
## Reference Absorption: Warmup: Why You Start Small Deep Continuation
- GPT-3 warmed up over 375 million tokens.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (gpt-3 warmed up over 375 million tokens).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (gpt-3 warmed up over 375 million tokens).

---
## Reference Absorption: Cosine Annealing
- Smooth decay from the maximum learning rate to a minimum, following a cosine curve:
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (smooth decay from the maximum learning rate to a minimum, following a cosine curve:).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (smooth decay from the maximum learning rate to a minimum, following a cosine curve:).
- Where t is the current step and T is the total number of steps.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (where t is the current step and t is the total number of steps).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (where t is the current step and t is the total number of steps).
- At t=0, the cosine term is 1, so lr = lr_max.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (at t=0, the cosine term is 1, so lr = lr_max).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (at t=0, the cosine term is 1, so lr = lr_max).
- At t=T, the cosine term is -1, so lr = lr_min.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (at t=t, the cosine term is -1, so lr = lr_min).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (at t=t, the cosine term is -1, so lr = lr_min).

---
## Reference Absorption: Cosine Annealing (cont.)
- The decay is gentle at first, accelerates in the middle, and becomes gentle again near the end.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (the decay is gentle at first, accelerates in the middle, and becomes gentle again near the end).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (the decay is gentle at first, accelerates in the middle, and becomes gentle again near the end).
- This is the default for most modern training runs.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (this is the default for most modern training runs).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (this is the default for most modern training runs).
- No hyperparameters to tune beyond lr_max and lr_min.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (no hyperparameters to tune beyond lr_max and lr_min).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (no hyperparameters to tune beyond lr_max and lr_min).
- The cosine shape matches the empirical observation that most learning happens in the middle of training -- you want reasonable step sizes during that critical period.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (the cosine shape matches the empirical observation that most learning happens in the middle of training -- you want reasonable...).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (the cosine shape matches the empirical observation that most learning happens in the middle of training -- you want r...).

---
## Reference Absorption: Step 2: Visualize All Schedules
- Print a text-based plot showing how each schedule evolves over training.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (print a text-based plot showing how each schedule evolves over training).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (print a text-based plot showing how each schedule evolves over training).

---
## Reference Absorption: Further Reading
- Loshchilov & Hutter, "SGDR: Stochastic Gradient Descent with Warm Restarts" (2017) -- introduced cosine annealing and warm restarts
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (loshchilov & hutter, "sgdr: stochastic gradient descent with warm restarts" (2017) -- introduced cosine annealing and warm rest...).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (loshchilov & hutter, "sgdr: stochastic gradient descent with warm restarts" (2017) -- introduced cosine annealing and...).
- Smith, "Super-Convergence: Very Fast Training of Neural Networks Using Large Learning Rates" (2018) -- the 1cycle policy paper
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (smith, "super-convergence: very fast training of neural networks using large learning rates" (2018) -- the 1cycle policy paper).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (smith, "super-convergence: very fast training of neural networks using large learning rates" (2018) -- the 1cycle pol...).
- Touvron et al., "Llama 2: Open Foundation and Fine-Tuned Chat Models" (2023) -- documents the warmup + cosine schedule used at scale
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (touvron et al., "llama 2: open foundation and fine-tuned chat models" (2023) -- documents the warmup + cosine schedule used at...).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (touvron et al., "llama 2: open foundation and fine-tuned chat models" (2023) -- documents the warmup + cosine schedul...).
- Goyal et al., "Accurate, Large Minibatch SGD: Training ImageNet in 1 Hour" (2017) -- linear scaling rule and warmup for large batch training
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (goyal et al., "accurate, large minibatch sgd: training imagenet in 1 hour" (2017) -- linear scaling rule and warmup for large b...).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (goyal et al., "accurate, large minibatch sgd: training imagenet in 1 hour" (2017) -- linear scaling rule and warmup f...).

---
## Reference Absorption: Step Decay
- The old-school approach from the ResNet era.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (the old-school approach from the resnet era).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (the old-school approach from the resnet era).
- Cut the learning rate by a factor (usually 10x) at fixed epochs.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (cut the learning rate by a factor (usually 10x) at fixed epochs).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (cut the learning rate by a factor (usually 10x) at fixed epochs).
- Where gamma = 0.1 and step_size = 30 means: lr drops by 10x every 30 epochs.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (where gamma = 0.1 and step_size = 30 means: lr drops by 10x every 30 epochs).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (where gamma = 0.1 and step_size = 30 means: lr drops by 10x every 30 epochs).
- ResNet-50 used this -- lr=0.1, drop by 10x at epochs 30, 60, and 90.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (resnet-50 used this -- lr=0.1, drop by 10x at epochs 30, 60, and 90).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (resnet-50 used this -- lr=0.1, drop by 10x at epochs 30, 60, and 90).

---
## Reference Absorption: Step Decay (cont.)
- The problem: the optimal decay points depend on the dataset and architecture.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (the problem: the optimal decay points depend on the dataset and architecture).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (the problem: the optimal decay points depend on the dataset and architecture).
- Move to a different problem and you need to re-tune when to drop.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (move to a different problem and you need to re-tune when to drop).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (move to a different problem and you need to re-tune when to drop).
- The transitions are abrupt -- loss can spike when the rate suddenly changes.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (the transitions are abrupt -- loss can spike when the rate suddenly changes).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (the transitions are abrupt -- loss can spike when the rate suddenly changes).

---
## Reference Absorption: Learning Objectives
- Implement constant, step decay, cosine annealing, warmup + cosine, and 1cycle learning rate schedules from scratch
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (implement constant, step decay, cosine annealing, warmup + cosine, and 1cycle learning rate schedules from scratch).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (implement constant, step decay, cosine annealing, warmup + cosine, and 1cycle learning rate schedules from scratch).
- Demonstrate the three failure modes of learning rate selection: divergence (too high), stalling (too low), and oscillation (no decay)
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (demonstrate the three failure modes of learning rate selection: divergence (too high), stalling (too low), and oscillation (no...).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (demonstrate the three failure modes of learning rate selection: divergence (too high), stalling (too low), and oscill...).
- Explain why warmup is necessary for Adam-based optimizers and how it stabilizes early training
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (explain why warmup is necessary for adam-based optimizers and how it stabilizes early training).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (explain why warmup is necessary for adam-based optimizers and how it stabilizes early training).
- Compare convergence speed across all five schedules on the same task and select the appropriate one for a given training budget
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (compare convergence speed across all five schedules on the same task and select the appropriate one for a given training budget).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (compare convergence speed across all five schedules on the same task and select the appropriate one for a given train...).

---
## Reference Absorption: Linear Warmup + Cosine Decay
- Ramp up linearly, then decay with cosine:
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (ramp up linearly, then decay with cosine:).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (ramp up linearly, then decay with cosine:).
- This is what Llama, GPT, PaLM, and most modern transformers use.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (this is what llama, gpt, palm, and most modern transformers use).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (this is what llama, gpt, palm, and most modern transformers use).
- The warmup prevents early instability.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (the warmup prevents early instability).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (the warmup prevents early instability).
- The cosine decay settles the model into a good minimum.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (the cosine decay settles the model into a good minimum).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (the cosine decay settles the model into a good minimum).

---
## Beyond Reference: Engineering Translation
- Core anchors for this module: steps, warmup, step, schedule, cosine, learning, training, total.
- Convert each theoretical primitive into measurable training and inference behaviors.
- Define observability checkpoints for drift, calibration, and latency regressions.
- Tie assumptions to explicit data contracts and fallback policies.

---
## Beyond Reference: Advanced Layer 1
- Compare cosine, step, one-cycle, and warmup schedules on convergence speed and final quality.
- Risk and governance extension: convert this into acceptance tests and rollback criteria (compare cosine, step, one-cycle, and warmup schedules on convergence speed and final quality.).
- Use learning-rate range tests to identify stable training bands before expensive runs.
- Risk and governance extension: convert this into acceptance tests and rollback criteria (use learning-rate range tests to identify stable training bands before expensive runs.).
- Diagnose schedule-induced divergence with gradient norm and loss curvature traces.
- Risk and governance extension: convert this into acceptance tests and rollback criteria (diagnose schedule-induced divergence with gradient norm and loss curvature traces.).

<!-- DEPTH_EXPANSION_END -->
