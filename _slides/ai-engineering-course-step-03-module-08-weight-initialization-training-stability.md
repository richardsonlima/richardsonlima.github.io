---
layout: slides
title: "Weight Initialization & Training Stability"
category: "ai-engineering-course-step-03"
module_number: 8
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
## Module 08: Weight Initialization & Training Stability
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
- Initialize all weights to zero.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (initialize all weights to zero).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (initialize all weights to zero).
- Every neuron computes the same function, receives the same gradient, and updates identically.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (every neuron computes the same function, receives the same gradient, and updates identically).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (every neuron computes the same function, receives the same gradient, and updates identically).
- After 10,000 epochs, your 512-neuron hidden layer is still 512 copies of the same neuron.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (after 10,000 epochs, your 512-neuron hidden layer is still 512 copies of the same neuron).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (after 10,000 epochs, your 512-neuron hidden layer is still 512 copies of the same neuron).
- You paid for 512 parameters and got 1.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (you paid for 512 parameters and got 1).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (you paid for 512 parameters and got 1).

---
## Reference Absorption: The Problem (cont.)
- Activations explode through the network.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (activations explode through the network).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (activations explode through the network).
- By layer 10, values hit 1e15.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (by layer 10, values hit 1e15).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (by layer 10, values hit 1e15).
- By layer 20, they overflow to infinity.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (by layer 20, they overflow to infinity).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (by layer 20, they overflow to infinity).
- Gradients follow the same trajectory in reverse.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (gradients follow the same trajectory in reverse).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (gradients follow the same trajectory in reverse).

---
## Reference Absorption: The Problem Deep Continuation
- Initialize them randomly from a standard normal distribution.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (initialize them randomly from a standard normal distribution).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (initialize them randomly from a standard normal distribution).
- At 50 layers, the signal collapses to zero or detonates to infinity depending on whether the random scale was slightly too small or slightly too large.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (at 50 layers, the signal collapses to zero or detonates to infinity depending on whether the random scale was slightly too smal...).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (at 50 layers, the signal collapses to zero or detonates to infinity depending on whether the random scale was slightl...).
- The boundary between "works" and "broken" is razor-thin.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (the boundary between "works" and "broken" is razor-thin).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (the boundary between "works" and "broken" is razor-thin).
- Weight initialization is the most underrated decision in deep learning.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (weight initialization is the most underrated decision in deep learning).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (weight initialization is the most underrated decision in deep learning).

---
## Reference Absorption: The Problem Deep Continuation
- Initialization gets a footnote.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (initialization gets a footnote).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (initialization gets a footnote).
- But get it wrong and nothing else matters -- your network is dead before training begins.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (but get it wrong and nothing else matters -- your network is dead before training begins).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (but get it wrong and nothing else matters -- your network is dead before training begins).

---
## Reference Absorption: Exercises
- Add LeCun initialization (Var = 1/fan_in, designed for SELU activation).
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (add lecun initialization (var = 1/fan_in, designed for selu activation)).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (add lecun initialization (var = 1/fan_in, designed for selu activation)).
- Run the 50-layer experiment with LeCun init + tanh and compare to Xavier + tanh.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (run the 50-layer experiment with lecun init + tanh and compare to xavier + tanh).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (run the 50-layer experiment with lecun init + tanh and compare to xavier + tanh).
- Implement the GPT-2 residual scaling: multiply the output of each layer by 1/sqrt(2*N) before adding to the residual stream.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (implement the gpt-2 residual scaling: multiply the output of each layer by 1/sqrt(2*n) before adding to the residual stream).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (implement the gpt-2 residual scaling: multiply the output of each layer by 1/sqrt(2*n) before adding to the residual...).
- Run 50 layers with and without scaling, measure how fast the residual magnitude grows.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (run 50 layers with and without scaling, measure how fast the residual magnitude grows).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (run 50 layers with and without scaling, measure how fast the residual magnitude grows).

---
## Reference Absorption: Exercises (cont.)
- Create an "init health check" function that takes a network's layer dimensions and activation type, then recommends the correct initialization and warns if the current init will cause problems.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (create an "init health check" function that takes a network's layer dimensions and activation type, then recommends the correct...).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (create an "init health check" function that takes a network's layer dimensions and activation type, then recommends t...).
- Run the experiment with fan_in = 16 vs fan_in = 1024.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (run the experiment with fan_in = 16 vs fan_in = 1024).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (run the experiment with fan_in = 16 vs fan_in = 1024).
- Xavier and Kaiming adapt to fan_in, but random init doesn't.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (xavier and kaiming adapt to fan_in, but random init doesn't).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (xavier and kaiming adapt to fan_in, but random init doesn't).
- Show how the gap between "works" and "breaks" widens with larger layers.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (show how the gap between "works" and "breaks" widens with larger layers).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (show how the gap between "works" and "breaks" widens with larger layers).

---
## Reference Absorption: Exercises Deep Continuation
- Implement orthogonal initialization (generate a random matrix, compute its SVD, use the orthogonal matrix U).
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (implement orthogonal initialization (generate a random matrix, compute its svd, use the orthogonal matrix u)).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (implement orthogonal initialization (generate a random matrix, compute its svd, use the orthogonal matrix u)).
- Compare to Kaiming for ReLU networks at 50 layers.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (compare to kaiming for relu networks at 50 layers).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (compare to kaiming for relu networks at 50 layers).

---
## Reference Absorption: Transformer Initialization
- GPT-2 introduced a different pattern.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (gpt-2 introduced a different pattern).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (gpt-2 introduced a different pattern).
- Residual connections add the output of each sub-layer to its input:
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (residual connections add the output of each sub-layer to its input:).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (residual connections add the output of each sub-layer to its input:).
- Each addition increases variance.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (each addition increases variance).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (each addition increases variance).
- With N residual layers, variance grows proportionally to N.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (with n residual layers, variance grows proportionally to n).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (with n residual layers, variance grows proportionally to n).

---
## Reference Absorption: Transformer Initialization (cont.)
- GPT-2 scales the weights of residual layers by 1/sqrt(2N), where N is the number of layers.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (gpt-2 scales the weights of residual layers by 1/sqrt(2n), where n is the number of layers).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (gpt-2 scales the weights of residual layers by 1/sqrt(2n), where n is the number of layers).
- This keeps the accumulated signal magnitude stable.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (this keeps the accumulated signal magnitude stable).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (this keeps the accumulated signal magnitude stable).
- Llama 3 (405B parameters, 126 layers) uses a similar scheme.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (llama 3 (405b parameters, 126 layers) uses a similar scheme).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (llama 3 (405b parameters, 126 layers) uses a similar scheme).
- Without this scaling, the residual stream would grow unbounded through 126 layers of attention and feedforward blocks.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (without this scaling, the residual stream would grow unbounded through 126 layers of attention and feedforward blocks).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (without this scaling, the residual stream would grow unbounded through 126 layers of attention and feedforward blocks).

---
## Reference Absorption: Step 4: The Experiment
- Run all combinations: zero init, random N(0,1), random N(0,0.01), Xavier with sigmoid, Xavier with tanh, Kaiming with ReLU.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (run all combinations: zero init, random n(0,1), random n(0,0.01), xavier with sigmoid, xavier with tanh, kaiming with relu).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (run all combinations: zero init, random n(0,1), random n(0,0.01), xavier with sigmoid, xavier with tanh, kaiming with...).
- Print the magnitude at key layers.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (print the magnitude at key layers).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (print the magnitude at key layers).

---
## Reference Absorption: Step 3: Forward Pass Through 50 Layers
- Pass random data through a deep network and measure mean activation magnitude at each layer.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (pass random data through a deep network and measure mean activation magnitude at each layer).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (pass random data through a deep network and measure mean activation magnitude at each layer).

---
## Reference Absorption: Use It
- PyTorch provides these as built-in functions:
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (pytorch provides these as built-in functions:).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (pytorch provides these as built-in functions:).
- When you call nn.Linear(512, 256), PyTorch defaults to Kaiming uniform initialization.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (when you call nn.linear(512, 256), pytorch defaults to kaiming uniform initialization).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (when you call nn.linear(512, 256), pytorch defaults to kaiming uniform initialization).
- That's why most simple networks "just work" -- PyTorch already made the right choice.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (that's why most simple networks "just work" -- pytorch already made the right choice).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (that's why most simple networks "just work" -- pytorch already made the right choice).
- But when you build custom architectures or go deeper than 20 layers, you need to understand what's happening and potentially override the default.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (but when you build custom architectures or go deeper than 20 layers, you need to understand what's happening and potentially ov...).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (but when you build custom architectures or go deeper than 20 layers, you need to understand what's happening and pote...).

---
## Reference Absorption: Use It (cont.)
- For transformers, HuggingFace models typically handle initialization in their _init_weights method.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (for transformers, huggingface models typically handle initialization in their _init_weights method).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (for transformers, huggingface models typically handle initialization in their _init_weights method).
- GPT-2's implementation scales residual projections by 1/sqrt(N).
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (gpt-2's implementation scales residual projections by 1/sqrt(n)).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (gpt-2's implementation scales residual projections by 1/sqrt(n)).
- If you're building a transformer from scratch, you need to add this yourself.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (if you're building a transformer from scratch, you need to add this yourself).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (if you're building a transformer from scratch, you need to add this yourself).

---
## Reference Absorption: Step 1: Initialization Strategies
- Four ways to initialize a weight matrix.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (four ways to initialize a weight matrix).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (four ways to initialize a weight matrix).
- Each returns a list of lists (a 2D matrix) with fan_in columns and fan_out rows.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (each returns a list of lists (a 2d matrix) with fan_in columns and fan_out rows).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (each returns a list of lists (a 2d matrix) with fan_in columns and fan_out rows).

---
## Reference Absorption: Step 5: Symmetry Demonstration
- Show that zero init produces identical neurons.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (show that zero init produces identical neurons).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (show that zero init produces identical neurons).

---
## Reference Absorption: The Symmetry Problem
- Every neuron in a layer has the same structure: multiply inputs by weights, add bias, apply activation.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (every neuron in a layer has the same structure: multiply inputs by weights, add bias, apply activation).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (every neuron in a layer has the same structure: multiply inputs by weights, add bias, apply activation).
- If all weights start at the same value (zero is the extreme case), every neuron computes the same output.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (if all weights start at the same value (zero is the extreme case), every neuron computes the same output).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (if all weights start at the same value (zero is the extreme case), every neuron computes the same output).
- During backpropagation, every neuron receives the same gradient.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (during backpropagation, every neuron receives the same gradient).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (during backpropagation, every neuron receives the same gradient).
- During the update step, every neuron changes by the same amount.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (during the update step, every neuron changes by the same amount).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (during the update step, every neuron changes by the same amount).

---
## Reference Absorption: The Symmetry Problem (cont.)
- The network has hundreds of parameters, but they all move in lockstep.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (the network has hundreds of parameters, but they all move in lockstep).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (the network has hundreds of parameters, but they all move in lockstep).
- This is called symmetry, and random initialization is the brute-force way to break it.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (this is called symmetry, and random initialization is the brute-force way to break it).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (this is called symmetry, and random initialization is the brute-force way to break it).
- Each neuron starts at a different point in weight space, so each learns a different feature.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (each neuron starts at a different point in weight space, so each learns a different feature).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (each neuron starts at a different point in weight space, so each learns a different feature).
- The *scale* of the randomness determines whether the network trains.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (the *scale* of the randomness determines whether the network trains).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (the *scale* of the randomness determines whether the network trains).

---
## Reference Absorption: Variance Propagation Through Layers
- Consider a single layer with fan_in inputs:
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (consider a single layer with fan_in inputs:).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (consider a single layer with fan_in inputs:).
- If each weight wi is drawn from a distribution with variance Var(w) and each input xi has variance Var(x), the output variance is:
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (if each weight wi is drawn from a distribution with variance var(w) and each input xi has variance var(x), the output variance is:).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (if each weight wi is drawn from a distribution with variance var(w) and each input xi has variance var(x), the output...).
- If Var(w) = 1 and fan_in = 512, the output variance is 512x the input variance.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (if var(w) = 1 and fan_in = 512, the output variance is 512x the input variance).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (if var(w) = 1 and fan_in = 512, the output variance is 512x the input variance).
- After 10 layers: 512^10 = 1.2e27.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (after 10 layers: 512^10 = 1.2e27).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (after 10 layers: 512^10 = 1.2e27).

---
## Reference Absorption: Variance Propagation Through Layers (cont.)
- If Var(w) = 0.001, the output variance shrinks by 0.001 * 512 = 0.512 per layer.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (if var(w) = 0.001, the output variance shrinks by 0.001 * 512 = 0.512 per layer).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (if var(w) = 0.001, the output variance shrinks by 0.001 * 512 = 0.512 per layer).
- After 10 layers: 0.512^10 = 0.00013.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (after 10 layers: 0.512^10 = 0.00013).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (after 10 layers: 0.512^10 = 0.00013).
- The goal: choose Var(w) so that Var(z) = Var(x).
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (the goal: choose var(w) so that var(z) = var(x)).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (the goal: choose var(w) so that var(z) = var(x)).
- Signal magnitude stays constant across layers.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (signal magnitude stays constant across layers).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (signal magnitude stays constant across layers).

---
## Reference Absorption: Further Reading
- Glorot & Bengio, "Understanding the difficulty of training deep feedforward neural networks" (2010) -- the original Xavier initialization paper with variance analysis
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (glorot & bengio, "understanding the difficulty of training deep feedforward neural networks" (2010) -- the original xavier init...).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (glorot & bengio, "understanding the difficulty of training deep feedforward neural networks" (2010) -- the original x...).
- He et al., "Delving Deep into Rectifiers" (2015) -- introduced Kaiming initialization for ReLU networks
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (he et al., "delving deep into rectifiers" (2015) -- introduced kaiming initialization for relu networks).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (he et al., "delving deep into rectifiers" (2015) -- introduced kaiming initialization for relu networks).
- Radford et al., "Language Models are Unsupervised Multitask Learners" (2019) -- GPT-2 paper with residual scaling initialization
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (radford et al., "language models are unsupervised multitask learners" (2019) -- gpt-2 paper with residual scaling initialization).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (radford et al., "language models are unsupervised multitask learners" (2019) -- gpt-2 paper with residual scaling ini...).
- Mishkin & Matas, "All You Need is a Good Init" (2016) -- layer-sequential unit-variance initialization, an empirical alternative to analytical formulas
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (mishkin & matas, "all you need is a good init" (2016) -- layer-sequential unit-variance initialization, an empirical alternativ...).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (mishkin & matas, "all you need is a good init" (2016) -- layer-sequential unit-variance initialization, an empirical...).

---
## Reference Absorption: Step 6: Layer-by-Layer Magnitude Report
- Print a visual bar chart of activation magnitudes through 50 layers.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (print a visual bar chart of activation magnitudes through 50 layers).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (print a visual bar chart of activation magnitudes through 50 layers).

---
## Reference Absorption: Kaiming/He Initialization
- ReLU kills half the outputs (everything negative becomes zero).
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (relu kills half the outputs (everything negative becomes zero)).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (relu kills half the outputs (everything negative becomes zero)).
- The effective fan_in is halved because on average half the inputs are zeroed.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (the effective fan_in is halved because on average half the inputs are zeroed).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (the effective fan_in is halved because on average half the inputs are zeroed).
- Xavier init doesn't account for this -- it underestimates the variance needed.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (xavier init doesn't account for this -- it underestimates the variance needed).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (xavier init doesn't account for this -- it underestimates the variance needed).
- (2015) adjusted the formula:
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade ((2015) adjusted the formula:).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept ((2015) adjusted the formula:).

---
## Reference Absorption: Kaiming/He Initialization (cont.)
- The factor of 2 compensates for ReLU zeroing half the activations.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (the factor of 2 compensates for relu zeroing half the activations).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (the factor of 2 compensates for relu zeroing half the activations).
- Without it, the signal shrinks by ~0.5x per layer.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (without it, the signal shrinks by ~0.5x per layer).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (without it, the signal shrinks by ~0.5x per layer).
- With 50 layers: 0.5^50 = 8.8e-16.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (with 50 layers: 0.5^50 = 8.8e-16).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (with 50 layers: 0.5^50 = 8.8e-16).

---
## Reference Absorption: Xavier/Glorot Initialization
- Glorot and Bengio (2010) derived the solution for sigmoid and tanh activations.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (glorot and bengio (2010) derived the solution for sigmoid and tanh activations).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (glorot and bengio (2010) derived the solution for sigmoid and tanh activations).
- To keep variance constant in both the forward and backward pass:
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (to keep variance constant in both the forward and backward pass:).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (to keep variance constant in both the forward and backward pass:).
- In practice, weights are drawn from:
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (in practice, weights are drawn from:).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (in practice, weights are drawn from:).
- This works because sigmoid and tanh are roughly linear near zero, where properly initialized activations live.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (this works because sigmoid and tanh are roughly linear near zero, where properly initialized activations live).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (this works because sigmoid and tanh are roughly linear near zero, where properly initialized activations live).

---
## Reference Absorption: Xavier/Glorot Initialization (cont.)
- The variance stays stable through dozens of layers.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (the variance stays stable through dozens of layers).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (the variance stays stable through dozens of layers).
<!-- DEPTH_EXPANSION_END -->
