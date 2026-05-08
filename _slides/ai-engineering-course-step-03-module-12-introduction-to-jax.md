---
layout: slides
title: "Introduction to JAX"
category: "ai-engineering-course-step-03"
module_number: 12
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
## Module 12: Introduction to JAX
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
- You know how to build neural networks in PyTorch.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (you know how to build neural networks in pytorch).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (you know how to build neural networks in pytorch).
- You define an nn.Module, call .backward(), step the optimizer.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (you define an nn.module, call .backward(), step the optimizer).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (you define an nn.module, call .backward(), step the optimizer).
- But PyTorch has a constraint baked into its DNA: it traces operations eagerly, one at a time, in Python.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (but pytorch has a constraint baked into its dna: it traces operations eagerly, one at a time, in python).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (but pytorch has a constraint baked into its dna: it traces operations eagerly, one at a time, in python).
- Every tensor + tensor is a separate kernel launch.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (every tensor + tensor is a separate kernel launch).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (every tensor + tensor is a separate kernel launch).

---
## Reference Absorption: The Problem (cont.)
- Every training step re-interprets the same Python code.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (every training step re-interprets the same python code).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (every training step re-interprets the same python code).
- This works fine until you need to train a 540-billion-parameter model across 2,048 TPUs.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (this works fine until you need to train a 540-billion-parameter model across 2,048 tpus).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (this works fine until you need to train a 540-billion-parameter model across 2,048 tpus).
- Then the overhead kills you.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (then the overhead kills you).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (then the overhead kills you).
- Google DeepMind trains Gemini on JAX.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (google deepmind trains gemini on jax).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (google deepmind trains gemini on jax).

---
## Reference Absorption: The Problem Deep Continuation
- Anthropic trained Claude on JAX.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (anthropic trained claude on jax).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (anthropic trained claude on jax).
- These are not small operations -- they are the largest neural network training runs on Earth.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (these are not small operations -- they are the largest neural network training runs on earth).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (these are not small operations -- they are the largest neural network training runs on earth).
- They chose JAX because it treats your training loop as a compilable program, not a sequence of Python calls.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (they chose jax because it treats your training loop as a compilable program, not a sequence of python calls).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (they chose jax because it treats your training loop as a compilable program, not a sequence of python calls).
- JAX is NumPy with three superpowers: automatic differentiation, JIT compilation to XLA, and automatic vectorization.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (jax is numpy with three superpowers: automatic differentiation, jit compilation to xla, and automatic vectorization).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (jax is numpy with three superpowers: automatic differentiation, jit compilation to xla, and automatic vectorization).

---
## Reference Absorption: The Problem Deep Continuation
- You write a function that processes one example.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (you write a function that processes one example).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (you write a function that processes one example).
- JAX gives you a function that processes a batch, computes gradients, compiles to machine code, and runs across multiple devices.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (jax gives you a function that processes a batch, computes gradients, compiles to machine code, and runs across multiple devices).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (jax gives you a function that processes a batch, computes gradients, compiles to machine code, and runs across multip...).
- All without changing the original function.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (all without changing the original function).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (all without changing the original function).

---
## Reference Absorption: Exercises
- In JAX, dropout requires a PRNG key -- thread a key through the forward pass and split it for each dropout layer.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (in jax, dropout requires a prng key -- thread a key through the forward pass and split it for each dropout layer).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (in jax, dropout requires a prng key -- thread a key through the forward pass and split it for each dropout layer).
- Compare test accuracy with and without.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (compare test accuracy with and without).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (compare test accuracy with and without).
- Use jax.vmap to compute per-example gradients for a batch of 32 MNIST images.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (use jax.vmap to compute per-example gradients for a batch of 32 mnist images).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (use jax.vmap to compute per-example gradients for a batch of 32 mnist images).
- Compute the gradient norm for each example.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (compute the gradient norm for each example).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (compute the gradient norm for each example).

---
## Reference Absorption: Exercises (cont.)
- Which examples have the largest gradients, and why?
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (which examples have the largest gradients, and why?).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (which examples have the largest gradients, and why?).
- Replace the manual forward function with a generic mlp_forward(params, x) that works for any number of layers.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (replace the manual forward function with a generic mlp_forward(params, x) that works for any number of layers).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (replace the manual forward function with a generic mlp_forward(params, x) that works for any number of layers).
- Use jax.tree.leaves to determine the depth automatically.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (use jax.tree.leaves to determine the depth automatically).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (use jax.tree.leaves to determine the depth automatically).
- Benchmark the training step with and without @jax.jit.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (benchmark the training step with and without @jax.jit).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (benchmark the training step with and without @jax.jit).

---
## Reference Absorption: Exercises Deep Continuation
- How large is the speedup on your hardware?
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (how large is the speedup on your hardware?).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (how large is the speedup on your hardware?).
- What is the compilation overhead on the first call?
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (what is the compilation overhead on the first call?).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (what is the compilation overhead on the first call?).
- Implement gradient clipping by composing optax.chain(optax.clip_by_global_norm(1.0), optax.adam(1e-3)).
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (implement gradient clipping by composing optax.chain(optax.clip_by_global_norm(1.0), optax.adam(1e-3))).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (implement gradient clipping by composing optax.chain(optax.clip_by_global_norm(1.0), optax.adam(1e-3))).
- Train with and without clipping.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (train with and without clipping).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (train with and without clipping).

---
## Reference Absorption: Exercises Deep Continuation
- Plot the gradient norm over training to see the effect.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (plot the gradient norm over training to see the effect).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (plot the gradient norm over training to see the effect).

---
## Reference Absorption: Step 5: Training Loop
- The first epoch is slow (JIT compilation).
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (the first epoch is slow (jit compilation)).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (the first epoch is slow (jit compilation)).
- Notice what is missing: no .zero_grad(), no .backward(), no .step().
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (notice what is missing: no .zero_grad(), no .backward(), no .step()).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (notice what is missing: no .zero_grad(), no .backward(), no .step()).
- The entire update is one composed function call.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (the entire update is one composed function call).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (the entire update is one composed function call).
- Gradients are computed, transformed by Adam, and applied to parameters -- all inside train_step.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (gradients are computed, transformed by adam, and applied to parameters -- all inside train_step).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (gradients are computed, transformed by adam, and applied to parameters -- all inside train_step).

---
## Reference Absorption: jit: Compile to XLA
- On the first call, JAX traces the function -- it records which operations happen, without executing them.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (on the first call, jax traces the function -- it records which operations happen, without executing them).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (on the first call, jax traces the function -- it records which operations happen, without executing them).
- Then it hands that trace to XLA (Accelerated Linear Algebra), Google's compiler for TPUs and GPUs.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (then it hands that trace to xla (accelerated linear algebra), google's compiler for tpus and gpus).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (then it hands that trace to xla (accelerated linear algebra), google's compiler for tpus and gpus).
- XLA fuses operations, eliminates redundant memory copies, and generates optimized machine code.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (xla fuses operations, eliminates redundant memory copies, and generates optimized machine code).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (xla fuses operations, eliminates redundant memory copies, and generates optimized machine code).
- Subsequent calls skip Python entirely.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (subsequent calls skip python entirely).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (subsequent calls skip python entirely).

---
## Reference Absorption: jit: Compile to XLA (cont.)
- The compiled code runs on the accelerator at C++ speed.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (the compiled code runs on the accelerator at c++ speed).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (the compiled code runs on the accelerator at c++ speed).
- Training steps (same computation repeated thousands of times)
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (training steps (same computation repeated thousands of times)).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (training steps (same computation repeated thousands of times)).
- Inference (same model, different inputs)
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (inference (same model, different inputs)).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (inference (same model, different inputs)).
- Any function called more than once with similar-shaped inputs
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (any function called more than once with similar-shaped inputs).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (any function called more than once with similar-shaped inputs).

---
## Reference Absorption: jit: Compile to XLA Deep Continuation
- Functions with Python control flow that depends on values (if x > 0 where x is a traced array)
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (functions with python control flow that depends on values (if x > 0 where x is a traced array)).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (functions with python control flow that depends on values (if x > 0 where x is a traced array)).
- One-shot computations (compilation overhead exceeds runtime)
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (one-shot computations (compilation overhead exceeds runtime)).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (one-shot computations (compilation overhead exceeds runtime)).
- Debugging (tracing hides the actual execution)
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (debugging (tracing hides the actual execution)).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (debugging (tracing hides the actual execution)).
- The control flow restriction is real.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (the control flow restriction is real).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (the control flow restriction is real).

---
## Reference Absorption: jit: Compile to XLA Deep Continuation
- jax.lax.cond replaces if/else.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (jax.lax.cond replaces if/else).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (jax.lax.cond replaces if/else).
- jax.lax.scan replaces for loops.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (jax.lax.scan replaces for loops).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (jax.lax.scan replaces for loops).
- These are not optional -- they are the price of compilation.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (these are not optional -- they are the price of compilation).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (these are not optional -- they are the price of compilation).

---
## Reference Absorption: Ship It
- First JIT call is slow (compilation). Warm up before benchmarking.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (first jit call is slow (compilation). warm up before benchmarking).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (first jit call is slow (compilation). warm up before benchmarking).
- Avoid Python loops over JAX arrays inside JIT. Use jax.lax.scan or jax.lax.fori_loop.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (avoid python loops over jax arrays inside jit. use jax.lax.scan or jax.lax.fori_loop).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (avoid python loops over jax arrays inside jit. use jax.lax.scan or jax.lax.fori_loop).
- jax.debug.print() works inside JIT. Regular print() does not.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (jax.debug.print() works inside jit. regular print() does not).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (jax.debug.print() works inside jit. regular print() does not).
- Profile with jax.profiler or TensorBoard. XLA compilation can hide bottlenecks.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (profile with jax.profiler or tensorboard. xla compilation can hide bottlenecks).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (profile with jax.profiler or tensorboard. xla compilation can hide bottlenecks).

---
## Reference Absorption: Ship It (cont.)
- JAX pre-allocates 75% of GPU memory by default. Set XLA_PYTHON_CLIENT_PREALLOCATE=false to disable.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (jax pre-allocates 75% of gpu memory by default. set xla_python_client_preallocate=false to disable).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (jax pre-allocates 75% of gpu memory by default. set xla_python_client_preallocate=false to disable).
- outputs/prompt-jax-optimizer.md -- a prompt for choosing the right JAX optimizer configuration
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (outputs/prompt-jax-optimizer.md -- a prompt for choosing the right jax optimizer configuration).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (outputs/prompt-jax-optimizer.md -- a prompt for choosing the right jax optimizer configuration).
- outputs/skill-jax-patterns.md -- a skill covering functional patterns in JAX
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (outputs/skill-jax-patterns.md -- a skill covering functional patterns in jax).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (outputs/skill-jax-patterns.md -- a skill covering functional patterns in jax).

---
## Reference Absorption: When to Use JAX vs PyTorch
- The honest answer: use PyTorch unless you have a specific reason to use JAX.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (the honest answer: use pytorch unless you have a specific reason to use jax).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (the honest answer: use pytorch unless you have a specific reason to use jax).
- Those reasons are -- TPU access, need for per-example gradients, multi-device training at massive scale, or working at Google/DeepMind/Anthropic.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (those reasons are -- tpu access, need for per-example gradients, multi-device training at massive scale, or working at google/d...).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (those reasons are -- tpu access, need for per-example gradients, multi-device training at massive scale, or working a...).

---
## Reference Absorption: jax.grad: Functional Autodiff
- PyTorch attaches gradients to tensors (.grad).
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (pytorch attaches gradients to tensors (.grad)).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (pytorch attaches gradients to tensors (.grad)).
- JAX attaches gradients to functions.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (jax attaches gradients to functions).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (jax attaches gradients to functions).
- jax.grad takes a function and returns a new function that computes the gradient.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (jax.grad takes a function and returns a new function that computes the gradient).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (jax.grad takes a function and returns a new function that computes the gradient).
- No computation graph stored on tensors.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (no computation graph stored on tensors).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (no computation graph stored on tensors).

---
## Reference Absorption: jax.grad: Functional Autodiff (cont.)
- The gradient is just another function you can call, compose, or JIT-compile.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (the gradient is just another function you can call, compose, or jit-compile).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (the gradient is just another function you can call, compose, or jit-compile).
- PyTorch can do this too (torch.autograd.functional.hessian), but it is bolted on.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (pytorch can do this too (torch.autograd.functional.hessian), but it is bolted on).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (pytorch can do this too (torch.autograd.functional.hessian), but it is bolted on).
- In JAX, it is the foundation.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (in jax, it is the foundation).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (in jax, it is the foundation).
- The constraint: grad only works on pure functions.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (the constraint: grad only works on pure functions).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (the constraint: grad only works on pure functions).

---
## Reference Absorption: jax.grad: Functional Autodiff Deep Continuation
- No print statements inside (they run during tracing, not execution).
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (no print statements inside (they run during tracing, not execution)).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (no print statements inside (they run during tracing, not execution)).
- No mutation of external state.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (no mutation of external state).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (no mutation of external state).
- No random number generation without explicit key management.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (no random number generation without explicit key management).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (no random number generation without explicit key management).

---
## Reference Absorption: vmap: Automatic Vectorization
- You write a function that processes one example:
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (you write a function that processes one example:).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (you write a function that processes one example:).
- vmap lifts it to process a batch:
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (vmap lifts it to process a batch:).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (vmap lifts it to process a batch:).
- in_axes=(None, 0) means: do not batch over params (shared), batch over axis 0 of x.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (in_axes=(none, 0) means: do not batch over params (shared), batch over axis 0 of x).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (in_axes=(none, 0) means: do not batch over params (shared), batch over axis 0 of x).
- No batch dimension threading.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (no batch dimension threading).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (no batch dimension threading).

---
## Reference Absorption: vmap: Automatic Vectorization (cont.)
- JAX figures out the batch dimension and vectorizes the entire computation.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (jax figures out the batch dimension and vectorizes the entire computation).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (jax figures out the batch dimension and vectorizes the entire computation).
- This is not syntactic sugar.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (this is not syntactic sugar).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (this is not syntactic sugar).
- vmap generates fused vectorized code that runs 10-100x faster than a Python loop.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (vmap generates fused vectorized code that runs 10-100x faster than a python loop).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (vmap generates fused vectorized code that runs 10-100x faster than a python loop).
- And it composes with jit and grad:
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (and it composes with jit and grad:).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (and it composes with jit and grad:).

---
## Reference Absorption: vmap: Automatic Vectorization Deep Continuation
- This is nearly impossible in PyTorch without hacks.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (this is nearly impossible in pytorch without hacks).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (this is nearly impossible in pytorch without hacks).

---
## Reference Absorption: The JAX Ecosystem
- Libraries give you ergonomics:
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (libraries give you ergonomics:).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (libraries give you ergonomics:).
- Optax is the standard optimizer library.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (optax is the standard optimizer library).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (optax is the standard optimizer library).
- It separates the gradient transformation (Adam, SGD, clipping) from the parameter update, making it trivial to compose:
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (it separates the gradient transformation (adam, sgd, clipping) from the parameter update, making it trivial to compose:).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (it separates the gradient transformation (adam, sgd, clipping) from the parameter update, making it trivial to compose:).

---
## Reference Absorption: Step 2: Initialize Parameters
- Just a function that returns a pytree:
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (just a function that returns a pytree:).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (just a function that returns a pytree:).
- He-initialization, done manually.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (he-initialization, done manually).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (he-initialization, done manually).
- Three PRNG keys split from one seed.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (three prng keys split from one seed).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (three prng keys split from one seed).
- Every weight is an immutable array in a nested dict.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (every weight is an immutable array in a nested dict).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (every weight is an immutable array in a nested dict).

---
## Reference Absorption: Further Reading
- JAX documentation: https://jax.readthedocs.io/ -- the official docs, with excellent tutorials on grad, jit, and vmap
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (jax documentation: https://jax.readthedocs.io/ -- the official docs, with excellent tutorials on grad, jit, and vmap).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (jax documentation: https://jax.readthedocs.io/ -- the official docs, with excellent tutorials on grad, jit, and vmap).
- "JAX: composable transformations of Python+NumPy programs" (Bradbury et al., 2018) -- the original paper explaining the design philosophy
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade ("jax: composable transformations of python+numpy programs" (bradbury et al., 2018) -- the original paper explaining the design...).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept ("jax: composable transformations of python+numpy programs" (bradbury et al., 2018) -- the original paper explaining t...).
- Flax documentation: https://flax.readthedocs.io/ -- Google's neural network library for JAX
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (flax documentation: https://flax.readthedocs.io/ -- google's neural network library for jax).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (flax documentation: https://flax.readthedocs.io/ -- google's neural network library for jax).
- Patrick Kidger, "Equinox: neural networks in JAX via callable PyTrees and filtered transformations" (2021) -- the Pythonic alternative to Flax
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (patrick kidger, "equinox: neural networks in jax via callable pytrees and filtered transformations" (2021) -- the pythonic alte...).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (patrick kidger, "equinox: neural networks in jax via callable pytrees and filtered transformations" (2021) -- the pyt...).

---
## Reference Absorption: Further Reading (cont.)
- DeepMind, "Optax: composable gradient transformation and optimisation" -- the standard optimizer library
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (deepmind, "optax: composable gradient transformation and optimisation" -- the standard optimizer library).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (deepmind, "optax: composable gradient transformation and optimisation" -- the standard optimizer library).
- "You Don't Know JAX" (Colin Raffel, 2020) -- a practical guide to JAX gotchas and patterns, from one of the T5 authors
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade ("you don't know jax" (colin raffel, 2020) -- a practical guide to jax gotchas and patterns, from one of the t5 authors).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept ("you don't know jax" (colin raffel, 2020) -- a practical guide to jax gotchas and patterns, from one of the t5 authors).

---
## Reference Absorption: The JAX Philosophy
- JAX is a functional framework.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (jax is a functional framework).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (jax is a functional framework).
- No classes, no mutable state, no .backward() method.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (no classes, no mutable state, no .backward() method).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (no classes, no mutable state, no .backward() method).
- This is not a style preference.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (this is not a style preference).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (this is not a style preference).
- It is a compiler constraint.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (it is a compiler constraint).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (it is a compiler constraint).

---
## Reference Absorption: The JAX Philosophy (cont.)
- JIT compilation requires pure functions -- same inputs always produce same outputs, no side effects.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (jit compilation requires pure functions -- same inputs always produce same outputs, no side effects).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (jit compilation requires pure functions -- same inputs always produce same outputs, no side effects).
- That restriction is what makes 100x speedups possible.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (that restriction is what makes 100x speedups possible).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (that restriction is what makes 100x speedups possible).

---
## Reference Absorption: Pytrees: The Universal Data Structure
- JAX operates on "pytrees" -- nested combinations of lists, tuples, dicts, and arrays.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (jax operates on "pytrees" -- nested combinations of lists, tuples, dicts, and arrays).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (jax operates on "pytrees" -- nested combinations of lists, tuples, dicts, and arrays).
- Your model parameters are a pytree:
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (your model parameters are a pytree:).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (your model parameters are a pytree:).
- Every JAX transformation -- grad, jit, vmap -- knows how to traverse pytrees.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (every jax transformation -- grad, jit, vmap -- knows how to traverse pytrees).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (every jax transformation -- grad, jit, vmap -- knows how to traverse pytrees).
- jax.tree.map(f, tree) applies f to every leaf.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (jax.tree.map(f, tree) applies f to every leaf).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (jax.tree.map(f, tree) applies f to every leaf).

---
## Reference Absorption: Pytrees: The Universal Data Structure (cont.)
- This is how optimizers update all parameters at once:
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (this is how optimizers update all parameters at once:).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (this is how optimizers update all parameters at once:).
- The tree structure is the model.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (the tree structure is the model).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (the tree structure is the model).

---
## Reference Absorption: Flax: The Google Standard
- Flax is the most common JAX neural network library.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (flax is the most common jax neural network library).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (flax is the most common jax neural network library).
- It adds nn.Module back, but with explicit state management:
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (it adds nn.module back, but with explicit state management:).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (it adds nn.module back, but with explicit state management:).
- Same structure as PyTorch, but params is separate from the model.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (same structure as pytorch, but params is separate from the model).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (same structure as pytorch, but params is separate from the model).
- model.init() creates params.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (model.init() creates params).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (model.init() creates params).

---
## Reference Absorption: Flax: The Google Standard (cont.)
- model.apply(params, x) runs the forward pass.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (model.apply(params, x) runs the forward pass).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (model.apply(params, x) runs the forward pass).
- The model object has no state.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (the model object has no state).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (the model object has no state).

---
## Reference Absorption: Step 4: JIT-Compiled Training Step
- jax.value_and_grad returns both the loss value and the gradients in one pass.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (jax.value_and_grad returns both the loss value and the gradients in one pass).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (jax.value_and_grad returns both the loss value and the gradients in one pass).
- The @jax.jit decorator compiles both functions to XLA.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (the @jax.jit decorator compiles both functions to xla).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (the @jax.jit decorator compiles both functions to xla).
- After the first call, each training step runs without touching Python.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (after the first call, each training step runs without touching python).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (after the first call, each training step runs without touching python).

---
## Reference Absorption: Step 3: Forward Pass
- loss_fn computes cross-entropy from scratch -- softmax, log, negative mean.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (loss_fn computes cross-entropy from scratch -- softmax, log, negative mean).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (loss_fn computes cross-entropy from scratch -- softmax, log, negative mean).

---
## Reference Absorption: Step 1: Setup and Data
- We will train a 3-layer MLP on MNIST using JAX and Optax.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (we will train a 3-layer mlp on mnist using jax and optax).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (we will train a 3-layer mlp on mnist using jax and optax).
- 784 inputs, two hidden layers of 256 and 128 neurons, 10 output classes.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (784 inputs, two hidden layers of 256 and 128 neurons, 10 output classes).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (784 inputs, two hidden layers of 256 and 128 neurons, 10 output classes).

---
## Reference Absorption: jax.numpy: The Familiar Surface
- JAX reimplements the NumPy API on accelerators:
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (jax reimplements the numpy api on accelerators:).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (jax reimplements the numpy api on accelerators:).
- But the arrays live on GPU/TPU, and every operation is traceable by the compiler.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (but the arrays live on gpu/tpu, and every operation is traceable by the compiler).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (but the arrays live on gpu/tpu, and every operation is traceable by the compiler).
- One critical difference: JAX arrays are immutable.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (one critical difference: jax arrays are immutable).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (one critical difference: jax arrays are immutable).
- Instead: a = a.at[0].set(5).
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (instead: a = a.at[0].set(5)).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (instead: a = a.at[0].set(5)).

---
## Reference Absorption: jax.numpy: The Familiar Surface (cont.)
- This feels awkward for a week, then it clicks -- immutability is what makes transformations like grad, jit, and vmap composable.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (this feels awkward for a week, then it clicks -- immutability is what makes transformations like grad, jit, and vmap composable).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (this feels awkward for a week, then it clicks -- immutability is what makes transformations like grad, jit, and vmap...).

---
## Reference Absorption: Functional vs Object-Oriented
- PyTorch stores state inside objects:
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (pytorch stores state inside objects:).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (pytorch stores state inside objects:).
- JAX uses pure functions with explicit state:
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (jax uses pure functions with explicit state:).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (jax uses pure functions with explicit state:).
- This makes every function testable, composable, and compilable.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (this makes every function testable, composable, and compilable).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (this makes every function testable, composable, and compilable).
- It also means you manage the params yourself -- or use a library like Flax or Equinox.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (it also means you manage the params yourself -- or use a library like flax or equinox).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (it also means you manage the params yourself -- or use a library like flax or equinox).

---
## Beyond Reference: Engineering Translation
- Core anchors for this module: params, python, train, function, model, optax, state, grad.
- Convert each theoretical primitive into measurable training and inference behaviors.
- Define observability checkpoints for drift, calibration, and latency regressions.
- Tie assumptions to explicit data contracts and fallback policies.

---
## Beyond Reference: Advanced Layer 1
- Leverage JAX jit and vmap to transform naive Python loops into compiled vectorized pipelines.
- Risk and governance extension: convert this into acceptance tests and rollback criteria (leverage jax jit and vmap to transform naive python loops into compiled vectorized pipelines.).
- Design pure-function training states that avoid side effects and improve reproducibility.
- Risk and governance extension: convert this into acceptance tests and rollback criteria (design pure-function training states that avoid side effects and improve reproducibility.).
- Benchmark JAX and PyTorch under matched kernels and precision modes.
- Risk and governance extension: convert this into acceptance tests and rollback criteria (benchmark jax and pytorch under matched kernels and precision modes.).

<!-- DEPTH_EXPANSION_END -->
