---
layout: slides
title: "Introduction to PyTorch"
category: "ai-engineering-course-step-03"
module_number: 11
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
## Module 11: Introduction to PyTorch
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
- You have a working mini framework.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (you have a working mini framework).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (you have a working mini framework).
- Linear layers, ReLU, dropout, batch norm, Adam, a DataLoader, a training loop.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (linear layers, relu, dropout, batch norm, adam, a dataloader, a training loop).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (linear layers, relu, dropout, batch norm, adam, a dataloader, a training loop).
- It trains a 4-layer network on a circle classification problem in pure Python.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (it trains a 4-layer network on a circle classification problem in pure python).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (it trains a 4-layer network on a circle classification problem in pure python).
- It is also 500x slower than PyTorch on the same problem.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (it is also 500x slower than pytorch on the same problem).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (it is also 500x slower than pytorch on the same problem).

---
## Reference Absorption: The Problem (cont.)
- Your mini framework processes one sample at a time with nested Python loops.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (your mini framework processes one sample at a time with nested python loops).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (your mini framework processes one sample at a time with nested python loops).
- PyTorch dispatches the same operations to optimized C++/CUDA kernels that run on GPU.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (pytorch dispatches the same operations to optimized c++/cuda kernels that run on gpu).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (pytorch dispatches the same operations to optimized c++/cuda kernels that run on gpu).
- On a single NVIDIA A100, PyTorch trains a ResNet-50 (25.6M parameters) on ImageNet (1.28M images) in about 6 hours.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (on a single nvidia a100, pytorch trains a resnet-50 (25.6m parameters) on imagenet (1.28m images) in about 6 hours).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (on a single nvidia a100, pytorch trains a resnet-50 (25.6m parameters) on imagenet (1.28m images) in about 6 hours).
- Your framework would take roughly 3,000 hours on the same task -- if it didn't run out of memory first.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (your framework would take roughly 3,000 hours on the same task -- if it didn't run out of memory first).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (your framework would take roughly 3,000 hours on the same task -- if it didn't run out of memory first).

---
## Reference Absorption: The Problem Deep Continuation
- Your framework has no GPU support.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (your framework has no gpu support).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (your framework has no gpu support).
- No automatic differentiation -- you hand-wrote backward() for every module.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (no automatic differentiation -- you hand-wrote backward() for every module).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (no automatic differentiation -- you hand-wrote backward() for every module).
- No way to debug gradient flow without print statements.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (no way to debug gradient flow without print statements).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (no way to debug gradient flow without print statements).
- PyTorch fills every one of these gaps.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (pytorch fills every one of these gaps).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (pytorch fills every one of these gaps).

---
## Reference Absorption: The Problem Deep Continuation
- And it does so while keeping the exact same mental model you already built: Module, forward(), parameters(), backward(), optimizer.step().
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (and it does so while keeping the exact same mental model you already built: module, forward(), parameters(), backward(), optimi...).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (and it does so while keeping the exact same mental model you already built: module, forward(), parameters(), backward...).
- The concepts transfer one-to-one.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (the concepts transfer one-to-one).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (the concepts transfer one-to-one).
- The syntax is nearly identical.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (the syntax is nearly identical).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (the syntax is nearly identical).
- The difference is that PyTorch wraps a decade of systems engineering behind the same interface you designed from scratch.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (the difference is that pytorch wraps a decade of systems engineering behind the same interface you designed from scratch).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (the difference is that pytorch wraps a decade of systems engineering behind the same interface you designed from scratch).

---
## Reference Absorption: Exercises
- Add batch normalization. Insert nn.BatchNorm1d after each linear layer (before the activation).
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (add batch normalization. insert nn.batchnorm1d after each linear layer (before the activation)).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (add batch normalization. insert nn.batchnorm1d after each linear layer (before the activation)).
- Compare test accuracy and training speed vs the dropout-only version.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (compare test accuracy and training speed vs the dropout-only version).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (compare test accuracy and training speed vs the dropout-only version).
- Batch norm should reach 98%+ in fewer epochs.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (batch norm should reach 98%+ in fewer epochs).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (batch norm should reach 98%+ in fewer epochs).
- Implement a learning rate finder. Train for one epoch with exponentially increasing learning rate (from 1e-7 to 1.0).
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (implement a learning rate finder. train for one epoch with exponentially increasing learning rate (from 1e-7 to 1.0)).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (implement a learning rate finder. train for one epoch with exponentially increasing learning rate (from 1e-7 to 1.0)).

---
## Reference Absorption: Exercises (cont.)
- The optimal LR is just before the loss starts climbing.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (the optimal lr is just before the loss starts climbing).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (the optimal lr is just before the loss starts climbing).
- Use this to pick a better LR for the MNIST model.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (use this to pick a better lr for the mnist model).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (use this to pick a better lr for the mnist model).
- Port to GPU with mixed precision. Add torch.amp.autocast and GradScaler to the training loop.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (port to gpu with mixed precision. add torch.amp.autocast and gradscaler to the training loop).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (port to gpu with mixed precision. add torch.amp.autocast and gradscaler to the training loop).
- Measure throughput (samples/second) with and without mixed precision on GPU.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (measure throughput (samples/second) with and without mixed precision on gpu).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (measure throughput (samples/second) with and without mixed precision on gpu).

---
## Reference Absorption: Exercises Deep Continuation
- On an A100, expect ~2x speedup.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (on an a100, expect ~2x speedup).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (on an a100, expect ~2x speedup).
- Build a custom Dataset. Download Fashion-MNIST (same format as MNIST but with clothing items).
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (build a custom dataset. download fashion-mnist (same format as mnist but with clothing items)).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (build a custom dataset. download fashion-mnist (same format as mnist but with clothing items)).
- Implement a FashionMNISTDataset(Dataset) class with __getitem__ and __len__.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (implement a fashionmnistdataset(dataset) class with __getitem__ and __len__).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (implement a fashionmnistdataset(dataset) class with __getitem__ and __len__).
- Train the same MLP and compare accuracy.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (train the same mlp and compare accuracy).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (train the same mlp and compare accuracy).

---
## Reference Absorption: Exercises Deep Continuation
- Fashion-MNIST is harder -- expect ~88% vs ~98%.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (fashion-mnist is harder -- expect ~88% vs ~98%).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (fashion-mnist is harder -- expect ~88% vs ~98%).
- Replace Adam with SGD + momentum. Train with SGD(params, lr=0.01, momentum=0.9).
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (replace adam with sgd + momentum. train with sgd(params, lr=0.01, momentum=0.9)).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (replace adam with sgd + momentum. train with sgd(params, lr=0.01, momentum=0.9)).
- Then add a CosineAnnealingLR scheduler and see if SGD catches up to Adam by epoch 10.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (then add a cosineannealinglr scheduler and see if sgd catches up to adam by epoch 10).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (then add a cosineannealinglr scheduler and see if sgd catches up to adam by epoch 10).

---
## Reference Absorption: Step 4: Wire Everything Together
- Expected output after 10 epochs: ~97.8% test accuracy.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (expected output after 10 epochs: ~97.8% test accuracy).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (expected output after 10 epochs: ~97.8% test accuracy).
- Training time on CPU: ~30 seconds.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (training time on cpu: ~30 seconds).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (training time on cpu: ~30 seconds).
- On your mini framework with the same architecture: ~45 minutes.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (on your mini framework with the same architecture: ~45 minutes).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (on your mini framework with the same architecture: ~45 minutes).

---
## Reference Absorption: Tensors
- A tensor is a multi-dimensional array with three critical properties: shape, dtype, and device.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (a tensor is a multi-dimensional array with three critical properties: shape, dtype, and device).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (a tensor is a multi-dimensional array with three critical properties: shape, dtype, and device).
- Shape is the dimensionality.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (shape is the dimensionality).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (shape is the dimensionality).
- A scalar is shape (), a vector is (n,), a matrix is (m, n), a batch of images is (batch, channels, height, width).
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (a scalar is shape (), a vector is (n,), a matrix is (m, n), a batch of images is (batch, channels, height, width)).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (a scalar is shape (), a vector is (n,), a matrix is (m, n), a batch of images is (batch, channels, height, width)).
- Dtype controls precision and memory.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (dtype controls precision and memory).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (dtype controls precision and memory).

---
## Reference Absorption: Tensors (cont.)
- Device determines where computation happens.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (device determines where computation happens).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (device determines where computation happens).
- Every operation requires all tensors on the same device.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (every operation requires all tensors on the same device).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (every operation requires all tensors on the same device).
- This is the #1 PyTorch error beginners hit: RuntimeError: Expected all tensors to be on the same device.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (this is the #1 pytorch error beginners hit: runtimeerror: expected all tensors to be on the same device).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (this is the #1 pytorch error beginners hit: runtimeerror: expected all tensors to be on the same device).
- Fix it by moving everything to the same device before computation.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (fix it by moving everything to the same device before computation).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (fix it by moving everything to the same device before computation).

---
## Reference Absorption: Tensors Deep Continuation
- Reshaping is constant-time -- it changes the metadata, not the data.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (reshaping is constant-time -- it changes the metadata, not the data).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (reshaping is constant-time -- it changes the metadata, not the data).

---
## Reference Absorption: nn.Module
- nn.Module is the base class for every neural network component in PyTorch.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (nn.module is the base class for every neural network component in pytorch).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (nn.module is the base class for every neural network component in pytorch).
- You already built this abstraction in Lesson 10.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (you already built this abstraction in lesson 10).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (you already built this abstraction in lesson 10).
- PyTorch's version adds automatic parameter registration, recursive module discovery, device management, and state dict serialization.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (pytorch's version adds automatic parameter registration, recursive module discovery, device management, and state dict serializ...).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (pytorch's version adds automatic parameter registration, recursive module discovery, device management, and state dic...).
- When you assign an nn.Module or nn.Parameter as an attribute in __init__, PyTorch automatically registers it.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (when you assign an nn.module or nn.parameter as an attribute in __init__, pytorch automatically registers it).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (when you assign an nn.module or nn.parameter as an attribute in __init__, pytorch automatically registers it).

---
## Reference Absorption: nn.Module (cont.)
- model.parameters() recursively collects every registered parameter.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (model.parameters() recursively collects every registered parameter).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (model.parameters() recursively collects every registered parameter).
- This is why you never have to manually gather weights like you did in the mini framework.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (this is why you never have to manually gather weights like you did in the mini framework).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (this is why you never have to manually gather weights like you did in the mini framework).

---
## Reference Absorption: Step 3: Training Loop
- The canonical forward-loss-backward-step pattern.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (the canonical forward-loss-backward-step pattern).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (the canonical forward-loss-backward-step pattern).
- Note torch.no_grad() during evaluation.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (note torch.no_grad() during evaluation).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (note torch.no_grad() during evaluation).
- This disables autograd, reducing memory usage and speeding up inference.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (this disables autograd, reducing memory usage and speeding up inference).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (this disables autograd, reducing memory usage and speeding up inference).
- Without it, PyTorch builds a computational graph you never use.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (without it, pytorch builds a computational graph you never use).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (without it, pytorch builds a computational graph you never use).

---
## Reference Absorption: Step 1: Load MNIST From Raw Files
- MNIST ships as 4 gzipped files: training images (60,000 x 28 x 28), training labels, test images (10,000 x 28 x 28), test labels.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (mnist ships as 4 gzipped files: training images (60,000 x 28 x 28), training labels, test images (10,000 x 28 x 28), test labels).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (mnist ships as 4 gzipped files: training images (60,000 x 28 x 28), training labels, test images (10,000 x 28 x 28),...).
- We download them and parse the binary format.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (we download them and parse the binary format).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (we download them and parse the binary format).

---
## Reference Absorption: Autograd
- Your mini framework required you to implement backward() for every module.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (your mini framework required you to implement backward() for every module).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (your mini framework required you to implement backward() for every module).
- It records every operation on tensors into a directed acyclic graph (the computational graph) and then traverses that graph in reverse to compute gradients automatically.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (it records every operation on tensors into a directed acyclic graph (the computational graph) and then traverses that graph in...).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (it records every operation on tensors into a directed acyclic graph (the computational graph) and then traverses that...).
- The key difference from your framework: PyTorch uses tape-based autodiff.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (the key difference from your framework: pytorch uses tape-based autodiff).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (the key difference from your framework: pytorch uses tape-based autodiff).
- Every operation appends to a "tape" during the forward pass.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (every operation appends to a "tape" during the forward pass).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (every operation appends to a "tape" during the forward pass).

---
## Reference Absorption: Autograd (cont.)
- Calling .backward() replays the tape in reverse.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (calling .backward() replays the tape in reverse).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (calling .backward() replays the tape in reverse).
- Only leaf tensors with requires_grad=True accumulate gradients
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (only leaf tensors with requires_grad=true accumulate gradients).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (only leaf tensors with requires_grad=true accumulate gradients).
- Gradients accumulate by default -- call optimizer.zero_grad() before each backward pass
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (gradients accumulate by default -- call optimizer.zero_grad() before each backward pass).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (gradients accumulate by default -- call optimizer.zero_grad() before each backward pass).
- torch.no_grad() disables gradient tracking (use during evaluation)
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (torch.no_grad() disables gradient tracking (use during evaluation)).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (torch.no_grad() disables gradient tracking (use during evaluation)).

---
## Reference Absorption: Why PyTorch Won
- In 2015, TensorFlow required you to define a static computation graph before running anything.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (in 2015, tensorflow required you to define a static computation graph before running anything).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (in 2015, tensorflow required you to define a static computation graph before running anything).
- You built the graph, compiled it, then fed data through it.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (you built the graph, compiled it, then fed data through it).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (you built the graph, compiled it, then fed data through it).
- Debugging meant staring at graph visualizations.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (debugging meant staring at graph visualizations).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (debugging meant staring at graph visualizations).
- Changing the architecture meant rebuilding the graph from scratch.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (changing the architecture meant rebuilding the graph from scratch).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (changing the architecture meant rebuilding the graph from scratch).

---
## Reference Absorption: Why PyTorch Won (cont.)
- PyTorch launched in 2017 with a different philosophy: eager execution.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (pytorch launched in 2017 with a different philosophy: eager execution).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (pytorch launched in 2017 with a different philosophy: eager execution).
- y = model(x) actually computes y right now, not "add a node to a graph that will compute y later." This meant standard Python debugging tools worked.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (y = model(x) actually computes y right now, not "add a node to a graph that will compute y later." this meant standard python d...).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (y = model(x) actually computes y right now, not "add a node to a graph that will compute y later." this meant standar...).
- if/else in your forward pass worked.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (if/else in your forward pass worked).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (if/else in your forward pass worked).
- By 2020, the market had spoken.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (by 2020, the market had spoken).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (by 2020, the market had spoken).

---
## Reference Absorption: Why PyTorch Won Deep Continuation
- PyTorch's share in ML research papers went from 7% (2017) to over 75% (2022).
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (pytorch's share in ml research papers went from 7% (2017) to over 75% (2022)).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (pytorch's share in ml research papers went from 7% (2017) to over 75% (2022)).
- Meta, Google DeepMind, OpenAI, Anthropic, and Hugging Face all use PyTorch as their primary framework.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (meta, google deepmind, openai, anthropic, and hugging face all use pytorch as their primary framework).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (meta, google deepmind, openai, anthropic, and hugging face all use pytorch as their primary framework).
- TensorFlow 2.x adopted eager execution in response -- tacit admission that PyTorch's design was correct.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (tensorflow 2.x adopted eager execution in response -- tacit admission that pytorch's design was correct).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (tensorflow 2.x adopted eager execution in response -- tacit admission that pytorch's design was correct).
- The lesson: developer experience compounds.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (the lesson: developer experience compounds).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (the lesson: developer experience compounds).

---
## Reference Absorption: Why PyTorch Won Deep Continuation
- A framework that is 10% slower but 50% faster to debug wins every time.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (a framework that is 10% slower but 50% faster to debug wins every time).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (a framework that is 10% slower but 50% faster to debug wins every time).

---
## Reference Absorption: The Training Loop
- Every PyTorch training loop follows the same 5-step pattern.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (every pytorch training loop follows the same 5-step pattern).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (every pytorch training loop follows the same 5-step pattern).
- You already know this from Lesson 10.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (you already know this from lesson 10).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (you already know this from lesson 10).
- Five lines inside the batch loop.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (five lines inside the batch loop).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (five lines inside the batch loop).
- Five lines that trained GPT-4, Stable Diffusion, and LLaMA.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (five lines that trained gpt-4, stable diffusion, and llama).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (five lines that trained gpt-4, stable diffusion, and llama).

---
## Reference Absorption: Loss Functions and Optimizers
- PyTorch ships production-ready versions of everything you built.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (pytorch ships production-ready versions of everything you built).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (pytorch ships production-ready versions of everything you built).
- Loss functions (from torch.nn):
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (loss functions (from torch.nn):).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (loss functions (from torch.nn):).
- Note: CrossEntropyLoss combines LogSoftmax + NLLLoss internally.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (note: crossentropyloss combines logsoftmax + nllloss internally).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (note: crossentropyloss combines logsoftmax + nllloss internally).
- Pass raw logits, not softmax outputs.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (pass raw logits, not softmax outputs).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (pass raw logits, not softmax outputs).

---
## Reference Absorption: Loss Functions and Optimizers (cont.)
- This is a common mistake that produces wrong gradients silently.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (this is a common mistake that produces wrong gradients silently).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (this is a common mistake that produces wrong gradients silently).
- Optimizers (from torch.optim):
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (optimizers (from torch.optim):).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (optimizers (from torch.optim):).

---
## Reference Absorption: GPU Training
- This recursively moves every parameter and buffer to the GPU.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (this recursively moves every parameter and buffer to the gpu).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (this recursively moves every parameter and buffer to the gpu).
- Then move each batch during training:
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (then move each batch during training:).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (then move each batch during training:).
- Mixed precision halves memory usage and doubles throughput on modern GPUs (A100, H100, RTX 4090) by running forward/backward in float16 while keeping the master weights in float32:
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (mixed precision halves memory usage and doubles throughput on modern gpus (a100, h100, rtx 4090) by running forward/backward in...).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (mixed precision halves memory usage and doubles throughput on modern gpus (a100, h100, rtx 4090) by running forward/b...).

---
## Reference Absorption: Step 2: Define the Model
- A 3-layer MLP: 784 -> 256 -> 128 -> 10.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (a 3-layer mlp: 784 -> 256 -> 128 -> 10).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (a 3-layer mlp: 784 -> 256 -> 128 -> 10).
- No batch norm to keep it simple.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (no batch norm to keep it simple).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (no batch norm to keep it simple).
- The output layer produces 10 raw logits (one per digit).
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (the output layer produces 10 raw logits (one per digit)).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (the output layer produces 10 raw logits (one per digit)).
- No softmax -- CrossEntropyLoss handles that internally.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (no softmax -- crossentropyloss handles that internally).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (no softmax -- crossentropyloss handles that internally).

---
## Reference Absorption: Step 2: Define the Model (cont.)
- Parameter count: 784*256 + 256 + 256*128 + 128 + 128*10 + 10 = 235,146.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (parameter count: 784*256 + 256 + 256*128 + 128 + 128*10 + 10 = 235,146).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (parameter count: 784*256 + 256 + 256*128 + 128 + 128*10 + 10 = 235,146).

---
## Reference Absorption: Dataset and DataLoader
- PyTorch's Dataset is an abstract class with two methods: __len__ and __getitem__.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (pytorch's dataset is an abstract class with two methods: __len__ and __getitem__).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (pytorch's dataset is an abstract class with two methods: __len__ and __getitem__).
- DataLoader wraps it with batching, shuffling, and multi-process data loading.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (dataloader wraps it with batching, shuffling, and multi-process data loading).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (dataloader wraps it with batching, shuffling, and multi-process data loading).
- num_workers=4 spawns 4 processes to load data in parallel while the GPU trains on the current batch.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (num_workers=4 spawns 4 processes to load data in parallel while the gpu trains on the current batch).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (num_workers=4 spawns 4 processes to load data in parallel while the gpu trains on the current batch).
- On disk-bound workloads (large images, audio), this alone can double training speed.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (on disk-bound workloads (large images, audio), this alone can double training speed).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (on disk-bound workloads (large images, audio), this alone can double training speed).

---
## Reference Absorption: Further Reading
- Paszke et al., "PyTorch: An Imperative Style, High-Performance Deep Learning Library" (2019) -- the original paper explaining PyTorch's design tradeoffs
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (paszke et al., "pytorch: an imperative style, high-performance deep learning library" (2019) -- the original paper explaining p...).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (paszke et al., "pytorch: an imperative style, high-performance deep learning library" (2019) -- the original paper ex...).
- PyTorch Tutorials: "Learning PyTorch with Examples" (https://pytorch.org/tutorials/beginner/pytorch_with_examples.html) -- the official path from tensors to nn.Module
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (pytorch tutorials: "learning pytorch with examples" (https://pytorch.org/tutorials/beginner/pytorch_with_examples.html) -- the...).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (pytorch tutorials: "learning pytorch with examples" (https://pytorch.org/tutorials/beginner/pytorch_with_examples.htm...).
- PyTorch Performance Tuning Guide (https://pytorch.org/tutorials/recipes/recipes/tuning_guide.html) -- mixed precision, DataLoader workers, pinned memory, and other production optimizations
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (pytorch performance tuning guide (https://pytorch.org/tutorials/recipes/recipes/tuning_guide.html) -- mixed precision, dataload...).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (pytorch performance tuning guide (https://pytorch.org/tutorials/recipes/recipes/tuning_guide.html) -- mixed precision...).
- Horace He, "Making Deep Learning Go Brrrr" (https://horace.io/brrr_intro.html) -- why GPU training is fast, with PyTorch-specific optimization strategies
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (horace he, "making deep learning go brrrr" (https://horace.io/brrr_intro.html) -- why gpu training is fast, with pytorch-specif...).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (horace he, "making deep learning go brrrr" (https://horace.io/brrr_intro.html) -- why gpu training is fast, with pyto...).

---
## Reference Absorption: Quick Comparison: Mini Framework vs PyTorch
- The interface is nearly identical.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (the interface is nearly identical).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (the interface is nearly identical).
- The difference is everything under the hood.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (the difference is everything under the hood).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (the difference is everything under the hood).

---
## Reference Absorption: Learning Objectives
- Build and train neural networks using PyTorch's nn.Module, nn.Sequential, and autograd
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (build and train neural networks using pytorch's nn.module, nn.sequential, and autograd).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (build and train neural networks using pytorch's nn.module, nn.sequential, and autograd).
- Use PyTorch tensors, GPU acceleration, and the standard training loop (zero_grad, forward, loss, backward, step)
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (use pytorch tensors, gpu acceleration, and the standard training loop (zero_grad, forward, loss, backward, step)).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (use pytorch tensors, gpu acceleration, and the standard training loop (zero_grad, forward, loss, backward, step)).
- Convert your from-scratch mini framework components to their PyTorch equivalents
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (convert your from-scratch mini framework components to their pytorch equivalents).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (convert your from-scratch mini framework components to their pytorch equivalents).
- Profile and compare training speed between your pure-Python framework and PyTorch on the same task
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (profile and compare training speed between your pure-python framework and pytorch on the same task).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (profile and compare training speed between your pure-python framework and pytorch on the same task).

---
## Reference Absorption: Learning Rate Scheduling
- PyTorch ships 15+ schedulers: StepLR, ExponentialLR, CosineAnnealingLR, OneCycleLR, ReduceLROnPlateau.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (pytorch ships 15+ schedulers: steplr, exponentiallr, cosineannealinglr, onecyclelr, reducelronplateau).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (pytorch ships 15+ schedulers: steplr, exponentiallr, cosineannealinglr, onecyclelr, reducelronplateau).
- All plug into the same optimizer interface.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (all plug into the same optimizer interface).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (all plug into the same optimizer interface).

---
## Reference Absorption: Saving and Loading Models
- Always save state_dict() (the parameter dictionary), not the model object.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (always save state_dict() (the parameter dictionary), not the model object).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (always save state_dict() (the parameter dictionary), not the model object).
- Saving the model object uses pickle, which breaks when you refactor code.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (saving the model object uses pickle, which breaks when you refactor code).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (saving the model object uses pickle, which breaks when you refactor code).

---
## Reference Absorption: Overview
- > You built the engine from pistons and crankshafts.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (> you built the engine from pistons and crankshafts).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (> you built the engine from pistons and crankshafts).
- Now learn the one everyone actually drives.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (now learn the one everyone actually drives).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (now learn the one everyone actually drives).

---
## Beyond Reference: Engineering Translation
- Core anchors for this module: pytorch, model, torch, loss, device, images, train, labels.
- Convert each theoretical primitive into measurable training and inference behaviors.
- Define observability checkpoints for drift, calibration, and latency regressions.
- Tie assumptions to explicit data contracts and fallback policies.

---
## Beyond Reference: Advanced Layer 1
- Map custom framework components to nn.Module patterns and autograd semantics.
- Risk and governance extension: convert this into acceptance tests and rollback criteria (map custom framework components to nn.module patterns and autograd semantics.).
- Profile CPU versus GPU pipelines and remove host-device synchronization bottlenecks.
- Risk and governance extension: convert this into acceptance tests and rollback criteria (profile cpu versus gpu pipelines and remove host-device synchronization bottlenecks.).
- Debug PyTorch training loops with gradient hooks and anomaly detection mode.
- Risk and governance extension: convert this into acceptance tests and rollback criteria (debug pytorch training loops with gradient hooks and anomaly detection mode.).

<!-- DEPTH_EXPANSION_END -->
