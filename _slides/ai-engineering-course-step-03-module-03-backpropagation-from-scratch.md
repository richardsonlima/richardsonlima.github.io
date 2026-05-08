---
layout: slides
title: "Backpropagation from Scratch"
category: "ai-engineering-course-step-03"
module_number: 3
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
## Module 03: Backpropagation from Scratch
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
- Your network has a single hidden layer with 768 inputs and 3072 outputs.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (your network has a single hidden layer with 768 inputs and 3072 outputs).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (your network has a single hidden layer with 768 inputs and 3072 outputs).
- Which weights caused the error?
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (which weights caused the error?).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (which weights caused the error?).
- Testing each weight individually means 2.3 million forward passes.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (testing each weight individually means 2.3 million forward passes).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (testing each weight individually means 2.3 million forward passes).
- Backpropagation computes all 2.3 million gradients in a single backward pass.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (backpropagation computes all 2.3 million gradients in a single backward pass).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (backpropagation computes all 2.3 million gradients in a single backward pass).

---
## Reference Absorption: The Problem (cont.)
- That's the difference between trainable and impossible.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (that's the difference between trainable and impossible).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (that's the difference between trainable and impossible).
- The naive approach: take one weight, nudge it by a tiny amount, run the forward pass again, measure whether the loss went up or down.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (the naive approach: take one weight, nudge it by a tiny amount, run the forward pass again, measure whether the loss went up or...).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (the naive approach: take one weight, nudge it by a tiny amount, run the forward pass again, measure whether the loss...).
- That gives you the gradient for that weight.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (that gives you the gradient for that weight).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (that gives you the gradient for that weight).
- Now do it for every weight in the network.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (now do it for every weight in the network).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (now do it for every weight in the network).

---
## Reference Absorption: The Problem Deep Continuation
- Multiply by thousands of training steps and millions of data points.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (multiply by thousands of training steps and millions of data points).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (multiply by thousands of training steps and millions of data points).
- You'd need geological time to train anything useful.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (you'd need geological time to train anything useful).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (you'd need geological time to train anything useful).
- Backpropagation solves this.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (backpropagation solves this).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (backpropagation solves this).
- One forward pass, one backward pass, all gradients computed.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (one forward pass, one backward pass, all gradients computed).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (one forward pass, one backward pass, all gradients computed).

---
## Reference Absorption: The Problem Deep Continuation
- The trick is the chain rule from calculus, applied systematically to a computational graph.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (the trick is the chain rule from calculus, applied systematically to a computational graph).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (the trick is the chain rule from calculus, applied systematically to a computational graph).
- This is the algorithm that made deep learning practical.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (this is the algorithm that made deep learning practical).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (this is the algorithm that made deep learning practical).
- Without it, we'd still be stuck on toy problems.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (without it, we'd still be stuck on toy problems).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (without it, we'd still be stuck on toy problems).

---
## Reference Absorption: Exercises
- Add a __sub__ method to the Value class (a - b = a + (-1 * b)).
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (add a __sub__ method to the value class (a - b = a + (-1 * b))).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (add a __sub__ method to the value class (a - b = a + (-1 * b))).
- Then implement a __neg__ method.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (then implement a __neg__ method).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (then implement a __neg__ method).
- Verify that the gradients are correct by comparing with manual calculation for a simple expression like (a - b)^2.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (verify that the gradients are correct by comparing with manual calculation for a simple expression like (a - b)^2).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (verify that the gradients are correct by comparing with manual calculation for a simple expression like (a - b)^2).
- Add a relu method to Value (output max(0, x), derivative is 1 if x > 0, else 0).
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (add a relu method to value (output max(0, x), derivative is 1 if x > 0, else 0)).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (add a relu method to value (output max(0, x), derivative is 1 if x > 0, else 0)).

---
## Reference Absorption: Exercises (cont.)
- Replace sigmoid with relu in the hidden layers and train on XOR again.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (replace sigmoid with relu in the hidden layers and train on xor again).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (replace sigmoid with relu in the hidden layers and train on xor again).
- You should see faster training -- this previews Lesson 04.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (you should see faster training -- this previews lesson 04).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (you should see faster training -- this previews lesson 04).
- Implement a __pow__ method on Value for integer powers.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (implement a __pow__ method on value for integer powers).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (implement a __pow__ method on value for integer powers).
- Use it to replace mse_loss with a proper (predicted - target) 2 expression.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (use it to replace mse_loss with a proper (predicted - target) 2 expression).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (use it to replace mse_loss with a proper (predicted - target) 2 expression).

---
## Reference Absorption: Exercises Deep Continuation
- Verify gradients match the original implementation.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (verify gradients match the original implementation).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (verify gradients match the original implementation).
- Add gradient clipping to the training loop: after calling backward(), clip all gradients to [-1, 1].
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (add gradient clipping to the training loop: after calling backward(), clip all gradients to [-1, 1]).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (add gradient clipping to the training loop: after calling backward(), clip all gradients to [-1, 1]).
- Train a deeper network (4+ layers with sigmoid) and compare loss curves with and without clipping.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (train a deeper network (4+ layers with sigmoid) and compare loss curves with and without clipping).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (train a deeper network (4+ layers with sigmoid) and compare loss curves with and without clipping).
- This is your first defense against exploding gradients.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (this is your first defense against exploding gradients).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (this is your first defense against exploding gradients).

---
## Reference Absorption: Exercises Deep Continuation
- Build a visualization: after training on XOR, print the gradient of every parameter in the network.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (build a visualization: after training on xor, print the gradient of every parameter in the network).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (build a visualization: after training on xor, print the gradient of every parameter in the network).
- Identify which layer has the smallest gradients.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (identify which layer has the smallest gradients).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (identify which layer has the smallest gradients).
- This demonstrates the vanishing gradient problem you read about in the Concept section.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (this demonstrates the vanishing gradient problem you read about in the concept section).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (this demonstrates the vanishing gradient problem you read about in the concept section).

---
## Reference Absorption: Step 7: Circle Classification
- In Lesson 02, you hand-tuned weights for circle classification.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (in lesson 02, you hand-tuned weights for circle classification).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (in lesson 02, you hand-tuned weights for circle classification).
- Now let the network learn them.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (now let the network learn them).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (now let the network learn them).
- We use online SGD here -- update weights after each sample instead of accumulating the full batch.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (we use online sgd here -- update weights after each sample instead of accumulating the full batch).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (we use online sgd here -- update weights after each sample instead of accumulating the full batch).
- This breaks symmetry faster and avoids sigmoid saturation on the full loss landscape.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (this breaks symmetry faster and avoids sigmoid saturation on the full loss landscape).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (this breaks symmetry faster and avoids sigmoid saturation on the full loss landscape).

---
## Reference Absorption: Step 7: Circle Classification (cont.)
- Shuffling the data each epoch prevents the network from memorizing the order.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (shuffling the data each epoch prevents the network from memorizing the order).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (shuffling the data each epoch prevents the network from memorizing the order).
- The network discovers the circular decision boundary on its own.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (the network discovers the circular decision boundary on its own).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (the network discovers the circular decision boundary on its own).
- That's the power of backpropagation: you define the architecture, the loss function, and the data.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (that's the power of backpropagation: you define the architecture, the loss function, and the data).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (that's the power of backpropagation: you define the architecture, the loss function, and the data).
- The algorithm figures out the weights.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (the algorithm figures out the weights).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (the algorithm figures out the weights).

---
## Reference Absorption: Step 5: Layer and Network
- A Neuron takes inputs, computes weighted sum + bias, and applies sigmoid.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (a neuron takes inputs, computes weighted sum + bias, and applies sigmoid).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (a neuron takes inputs, computes weighted sum + bias, and applies sigmoid).
- Weight initialization scales by sqrt(2/n_inputs) to prevent sigmoid saturation in deeper networks.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (weight initialization scales by sqrt(2/n_inputs) to prevent sigmoid saturation in deeper networks).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (weight initialization scales by sqrt(2/n_inputs) to prevent sigmoid saturation in deeper networks).
- A Layer is a list of Neurons.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (a layer is a list of neurons).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (a layer is a list of neurons).
- A Network is a list of Layers.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (a network is a list of layers).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (a network is a list of layers).

---
## Reference Absorption: Step 5: Layer and Network (cont.)
- The parameters() method collects all learnable Values so we can update them.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (the parameters() method collects all learnable values so we can update them).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (the parameters() method collects all learnable values so we can update them).

---
## Reference Absorption: Use It
- PyTorch does everything above in a few lines.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (pytorch does everything above in a few lines).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (pytorch does everything above in a few lines).
- The core idea is identical -- autograd builds a computational graph during the forward pass and traces it backward to compute gradients.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (the core idea is identical -- autograd builds a computational graph during the forward pass and traces it backward to compute g...).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (the core idea is identical -- autograd builds a computational graph during the forward pass and traces it backward to...).
- loss.backward() is your total_loss.backward().
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (loss.backward() is your total_loss.backward()).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (loss.backward() is your total_loss.backward()).
- optimizer.step() is your manual p.data -= lr * p.grad.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (optimizer.step() is your manual p.data -= lr * p.grad).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (optimizer.step() is your manual p.data -= lr * p.grad).

---
## Reference Absorption: Use It (cont.)
- optimizer.zero_grad() is your net.zero_grad().
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (optimizer.zero_grad() is your net.zero_grad()).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (optimizer.zero_grad() is your net.zero_grad()).
- Same algorithm, industrial-strength implementation.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (same algorithm, industrial-strength implementation).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (same algorithm, industrial-strength implementation).
- PyTorch handles GPU acceleration, mixed precision, gradient checkpointing, and hundreds of layer types.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (pytorch handles gpu acceleration, mixed precision, gradient checkpointing, and hundreds of layer types).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (pytorch handles gpu acceleration, mixed precision, gradient checkpointing, and hundreds of layer types).
- But the backward pass is the same chain rule applied to the same computational graph.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (but the backward pass is the same chain rule applied to the same computational graph).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (but the backward pass is the same chain rule applied to the same computational graph).

---
## Reference Absorption: Use It Deep Continuation
- Training runs the forward pass, then the backward pass, then updates weights.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (training runs the forward pass, then the backward pass, then updates weights).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (training runs the forward pass, then the backward pass, then updates weights).
- Inference runs only the forward pass.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (inference runs only the forward pass).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (inference runs only the forward pass).
- This distinction matters because inference is what happens in production.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (this distinction matters because inference is what happens in production).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (this distinction matters because inference is what happens in production).
- When you call an API like Claude or GPT, you're running inference -- your prompt flows forward through the network, and tokens come out the other end.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (when you call an api like claude or gpt, you're running inference -- your prompt flows forward through the network, and tokens...).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (when you call an api like claude or gpt, you're running inference -- your prompt flows forward through the network, a...).

---
## Reference Absorption: Use It Deep Continuation
- Understanding backprop matters because it shaped every weight in that network.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (understanding backprop matters because it shaped every weight in that network).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (understanding backprop matters because it shaped every weight in that network).

---
## Reference Absorption: Step 2: Operations with Backward Functions
- Each operation creates a new Value and defines how gradients flow backward through it.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (each operation creates a new value and defines how gradients flow backward through it).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (each operation creates a new value and defines how gradients flow backward through it).
- For addition: d(a+b)/da = 1, d(a+b)/db = 1.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (for addition: d(a+b)/da = 1, d(a+b)/db = 1).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (for addition: d(a+b)/da = 1, d(a+b)/db = 1).
- So both inputs get the output's gradient directly.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (so both inputs get the output's gradient directly).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (so both inputs get the output's gradient directly).
- For multiplication: d(a*b)/da = b, d(a*b)/db = a.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (for multiplication: d(a*b)/da = b, d(a*b)/db = a).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (for multiplication: d(a*b)/da = b, d(a*b)/db = a).

---
## Reference Absorption: Step 2: Operations with Backward Functions (cont.)
- Each input gets the other's value times the output gradient.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (each input gets the other's value times the output gradient).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (each input gets the other's value times the output gradient).
- A Value might be used in multiple operations.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (a value might be used in multiple operations).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (a value might be used in multiple operations).
- Its gradient is the sum of gradients from all paths.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (its gradient is the sum of gradients from all paths).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (its gradient is the sum of gradients from all paths).

---
## Reference Absorption: Computational Graphs
- Every forward pass builds a graph.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (every forward pass builds a graph).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (every forward pass builds a graph).
- Each node is an operation (multiply, add, sigmoid).
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (each node is an operation (multiply, add, sigmoid)).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (each node is an operation (multiply, add, sigmoid)).
- Each edge carries a value forward and a gradient backward.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (each edge carries a value forward and a gradient backward).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (each edge carries a value forward and a gradient backward).
- Forward pass: values flow left to right.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (forward pass: values flow left to right).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (forward pass: values flow left to right).

---
## Reference Absorption: Computational Graphs (cont.)
- Compare a to target y using the loss function.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (compare a to target y using the loss function).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (compare a to target y using the loss function).
- Backward pass: gradients flow right to left.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (backward pass: gradients flow right to left).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (backward pass: gradients flow right to left).
- Start with dL/da (how loss changes with the activation).
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (start with dl/da (how loss changes with the activation)).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (start with dl/da (how loss changes with the activation)).
- Multiply by da/dz2 (sigmoid derivative).
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (multiply by da/dz2 (sigmoid derivative)).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (multiply by da/dz2 (sigmoid derivative)).

---
## Reference Absorption: Computational Graphs Deep Continuation
- Split into dL/db (which equals dL/dz2, since z2 = z1 + b) and dL/dz1.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (split into dl/db (which equals dl/dz2, since z2 = z1 + b) and dl/dz1).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (split into dl/db (which equals dl/dz2, since z2 = z1 + b) and dl/dz1).
- Then dL/dw = dL/dz1 * x and dL/dx = dL/dz1 * w.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (then dl/dw = dl/dz1 * x and dl/dx = dl/dz1 * w).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (then dl/dw = dl/dz1 * x and dl/dx = dl/dz1 * w).
- Every node in the graph has one job during the backward pass: take the gradient coming from above, multiply by its local derivative, and pass it down.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (every node in the graph has one job during the backward pass: take the gradient coming from above, multiply by its local deriva...).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (every node in the graph has one job during the backward pass: take the gradient coming from above, multiply by its lo...).

---
## Reference Absorption: Step 6: Train on XOR
- From random predictions to correct XOR outputs, driven entirely by backpropagation computing gradients and nudging weights in the right direction.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (from random predictions to correct xor outputs, driven entirely by backpropagation computing gradients and nudging weights in t...).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (from random predictions to correct xor outputs, driven entirely by backpropagation computing gradients and nudging we...).

---
## Reference Absorption: Forward vs Backward
- The forward pass stores every intermediate value: z, a, the inputs to each layer.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (the forward pass stores every intermediate value: z, a, the inputs to each layer).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (the forward pass stores every intermediate value: z, a, the inputs to each layer).
- The backward pass needs these stored values to compute gradients.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (the backward pass needs these stored values to compute gradients).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (the backward pass needs these stored values to compute gradients).
- This is the memory-computation tradeoff at the heart of backprop.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (this is the memory-computation tradeoff at the heart of backprop).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (this is the memory-computation tradeoff at the heart of backprop).
- You trade memory (storing activations) for speed (one pass instead of millions).
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (you trade memory (storing activations) for speed (one pass instead of millions)).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (you trade memory (storing activations) for speed (one pass instead of millions)).

---
## Reference Absorption: Vanishing Gradients
- This is the vanishing gradient problem.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (this is the vanishing gradient problem).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (this is the vanishing gradient problem).
- Sigmoid squashes its output between 0 and 1.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (sigmoid squashes its output between 0 and 1).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (sigmoid squashes its output between 0 and 1).
- Its derivative is always less than 0.25.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (its derivative is always less than 0.25).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (its derivative is always less than 0.25).
- Stack enough sigmoid layers and gradients shrink to nothing.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (stack enough sigmoid layers and gradients shrink to nothing).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (stack enough sigmoid layers and gradients shrink to nothing).

---
## Reference Absorption: Vanishing Gradients (cont.)
- Early layers barely learn because they receive near-zero gradients.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (early layers barely learn because they receive near-zero gradients).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (early layers barely learn because they receive near-zero gradients).
- This is why deep sigmoid networks are nearly impossible to train.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (this is why deep sigmoid networks are nearly impossible to train).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (this is why deep sigmoid networks are nearly impossible to train).
- The fix -- ReLU and its variants -- is the subject of Lesson 04.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (the fix -- relu and its variants -- is the subject of lesson 04).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (the fix -- relu and its variants -- is the subject of lesson 04).
- For now, understand that backprop works perfectly.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (for now, understand that backprop works perfectly).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (for now, understand that backprop works perfectly).

---
## Reference Absorption: Vanishing Gradients Deep Continuation
- The problem is what it's working through.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (the problem is what it's working through).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (the problem is what it's working through).

---
## Reference Absorption: Step 1: The Value Node
- Every number in our computation becomes a Value.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (every number in our computation becomes a value).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (every number in our computation becomes a value).
- It stores its data, its gradient, and how it was created (so it knows how to compute gradients backward).
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (it stores its data, its gradient, and how it was created (so it knows how to compute gradients backward)).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (it stores its data, its gradient, and how it was created (so it knows how to compute gradients backward)).
- No backward function yet (no-op).
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (no backward function yet (no-op)).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (no backward function yet (no-op)).
- The _children track which Values produced this one, so we can topologically sort the graph later.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (the _children track which values produced this one, so we can topologically sort the graph later).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (the _children track which values produced this one, so we can topologically sort the graph later).

---
## Reference Absorption: Gradient Flow Through a Network
- For a 3-layer network, gradients chain through every layer:
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (for a 3-layer network, gradients chain through every layer:).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (for a 3-layer network, gradients chain through every layer:).
- At each layer, the gradient gets multiplied by the sigmoid derivative.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (at each layer, the gradient gets multiplied by the sigmoid derivative).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (at each layer, the gradient gets multiplied by the sigmoid derivative).
- The sigmoid derivative is a * (1 - a), which maxes out at 0.25 (when a = 0.5).
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (the sigmoid derivative is a * (1 - a), which maxes out at 0.25 (when a = 0.5)).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (the sigmoid derivative is a * (1 - a), which maxes out at 0.25 (when a = 0.5)).
- Three layers deep, the gradient has been multiplied by at most 0.25^3 = 0.0156.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (three layers deep, the gradient has been multiplied by at most 0.25^3 = 0.0156).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (three layers deep, the gradient has been multiplied by at most 0.25^3 = 0.0156).

---
## Reference Absorption: Gradient Flow Through a Network (cont.)
- Ten layers deep: 0.25^10 = 0.000001.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (ten layers deep: 0.25^10 = 0.000001).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (ten layers deep: 0.25^10 = 0.000001).

---
## Reference Absorption: Deriving Gradients for a 2-Layer Network
- Concrete math for a network with input x, hidden layer with sigmoid, output layer with sigmoid, and MSE loss.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (concrete math for a network with input x, hidden layer with sigmoid, output layer with sigmoid, and mse loss).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (concrete math for a network with input x, hidden layer with sigmoid, output layer with sigmoid, and mse loss).
- Backward pass (applying chain rule step by step):
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (backward pass (applying chain rule step by step):).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (backward pass (applying chain rule step by step):).
- Every gradient is a product of local derivatives traced back from the loss.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (every gradient is a product of local derivatives traced back from the loss).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (every gradient is a product of local derivatives traced back from the loss).
- That's all backpropagation is.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (that's all backpropagation is).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (that's all backpropagation is).

---
## Reference Absorption: Step 3: Sigmoid and Loss
- Sigmoid derivative: sigmoid(x) * (1 - sigmoid(x)).
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (sigmoid derivative: sigmoid(x) * (1 - sigmoid(x))).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (sigmoid derivative: sigmoid(x) * (1 - sigmoid(x))).
- We computed sigmoid(x) = s during the forward pass.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (we computed sigmoid(x) = s during the forward pass).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (we computed sigmoid(x) = s during the forward pass).
- MSE for a single output: (predicted - target)^2.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (mse for a single output: (predicted - target)^2).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (mse for a single output: (predicted - target)^2).
- We express subtraction as addition with a negated Value.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (we express subtraction as addition with a negated value).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (we express subtraction as addition with a negated value).

---
## Beyond Reference: Engineering Translation
- Core anchors for this module: self, backward, loss, sigmoid, data, value, gradients, gradient.
- Convert each theoretical primitive into measurable training and inference behaviors.
- Define observability checkpoints for drift, calibration, and latency regressions.
- Tie assumptions to explicit data contracts and fallback policies.

---
## Beyond Reference: Advanced Layer 1
- Implement gradient checking to validate each backward rule before full-network training.
- Risk and governance extension: convert this into acceptance tests and rollback criteria (implement gradient checking to validate each backward rule before full-network training.).
- Use topological ordering and accumulation semantics to prevent silent autograd bugs.
- Risk and governance extension: convert this into acceptance tests and rollback criteria (use topological ordering and accumulation semantics to prevent silent autograd bugs.).
- Compare analytical and numerical gradients under finite precision and clipping regimes.
- Risk and governance extension: convert this into acceptance tests and rollback criteria (compare analytical and numerical gradients under finite precision and clipping regimes.).

<!-- DEPTH_EXPANSION_END -->
