---
layout: slides
title: "The Perceptron: Where It All Started"
category: "ai-engineering-course-step-03"
module_number: 1
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
## Module 01: The Perceptron: Where It All Started
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
- You know vectors and dot products.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (you know vectors and dot products).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (you know vectors and dot products).
- You know that a matrix transforms inputs into outputs.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (you know that a matrix transforms inputs into outputs).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (you know that a matrix transforms inputs into outputs).
- But how does a machine *learn* which transformation to use?
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (but how does a machine *learn* which transformation to use?).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (but how does a machine *learn* which transformation to use?).
- The perceptron answers this.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (the perceptron answers this).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (the perceptron answers this).

---
## Reference Absorption: The Problem (cont.)
- It's the simplest possible learning machine: take some inputs, multiply by weights, add a bias, and make a binary decision.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (it's the simplest possible learning machine: take some inputs, multiply by weights, add a bias, and make a binary decision).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (it's the simplest possible learning machine: take some inputs, multiply by weights, add a bias, and make a binary dec...).
- Every neural network ever built is layers of this idea stacked together.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (every neural network ever built is layers of this idea stacked together).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (every neural network ever built is layers of this idea stacked together).
- Understanding the perceptron means understanding what "learning" actually means in code: adjusting numbers until the output matches reality.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (understanding the perceptron means understanding what "learning" actually means in code: adjusting numbers until the output mat...).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (understanding the perceptron means understanding what "learning" actually means in code: adjusting numbers until the...).

---
## Reference Absorption: Exercises
- Train a perceptron on a NAND gate (the universal gate - any logic circuit can be built from NAND).
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (train a perceptron on a nand gate (the universal gate - any logic circuit can be built from nand)).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (train a perceptron on a nand gate (the universal gate - any logic circuit can be built from nand)).
- Verify its weights and bias form a valid decision boundary.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (verify its weights and bias form a valid decision boundary).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (verify its weights and bias form a valid decision boundary).
- Modify the Perceptron class to track the decision boundary (w1*x1 + w2*x2 + b = 0) at each epoch.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (modify the perceptron class to track the decision boundary (w1*x1 + w2*x2 + b = 0) at each epoch).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (modify the perceptron class to track the decision boundary (w1*x1 + w2*x2 + b = 0) at each epoch).
- Print how the line shifts during training on the AND gate.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (print how the line shifts during training on the and gate).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (print how the line shifts during training on the and gate).

---
## Reference Absorption: Exercises (cont.)
- Build a 3-input perceptron that outputs 1 only when at least 2 of the 3 inputs are 1 (a majority vote function).
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (build a 3-input perceptron that outputs 1 only when at least 2 of the 3 inputs are 1 (a majority vote function)).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (build a 3-input perceptron that outputs 1 only when at least 2 of the 3 inputs are 1 (a majority vote function)).

---
## Reference Absorption: Step 5: Train a Two-Layer Network
- Step 4 hand-wired the weights.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (step 4 hand-wired the weights).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (step 4 hand-wired the weights).
- That works for XOR, but not for real problems where you don't know the right weights in advance.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (that works for xor, but not for real problems where you don't know the right weights in advance).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (that works for xor, but not for real problems where you don't know the right weights in advance).
- The fix: replace the step function with sigmoid and learn the weights automatically through backpropagation.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (the fix: replace the step function with sigmoid and learn the weights automatically through backpropagation).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (the fix: replace the step function with sigmoid and learn the weights automatically through backpropagation).
- Two key differences from Step 4.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (two key differences from step 4).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (two key differences from step 4).

---
## Reference Absorption: Step 5: Train a Two-Layer Network (cont.)
- First, sigmoid replaces the step function -- it's smooth, so gradients exist.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (first, sigmoid replaces the step function -- it's smooth, so gradients exist).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (first, sigmoid replaces the step function -- it's smooth, so gradients exist).
- Second, the train method propagates error backward from output to hidden layer, adjusting every weight proportionally to its contribution to the error.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (second, the train method propagates error backward from output to hidden layer, adjusting every weight proportionally to its co...).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (second, the train method propagates error backward from output to hidden layer, adjusting every weight proportionally...).
- That's backpropagation in 20 lines.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (that's backpropagation in 20 lines).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (that's backpropagation in 20 lines).
- This is the bridge to Lesson 03.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (this is the bridge to lesson 03).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (this is the bridge to lesson 03).

---
## Reference Absorption: Step 5: Train a Two-Layer Network Deep Continuation
- The math behind d_output and hidden_deltas is the chain rule applied to the network graph.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (the math behind d_output and hidden_deltas is the chain rule applied to the network graph).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (the math behind d_output and hidden_deltas is the chain rule applied to the network graph).
- We'll derive it properly there.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (we'll derive it properly there).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (we'll derive it properly there).

---
## Reference Absorption: The XOR Problem
- AND and OR are linearly separable: you can draw a single line to separate the 0s from the 1s.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (and and or are linearly separable: you can draw a single line to separate the 0s from the 1s).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (and and or are linearly separable: you can draw a single line to separate the 0s from the 1s).
- No single line can separate [0,1] and [1,0] from [0,0] and [1,1].
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (no single line can separate [0,1] and [1,0] from [0,0] and [1,1]).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (no single line can separate [0,1] and [1,0] from [0,0] and [1,1]).
- This is a fundamental limit.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (this is a fundamental limit).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (this is a fundamental limit).
- A single perceptron can only solve linearly separable problems.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (a single perceptron can only solve linearly separable problems).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (a single perceptron can only solve linearly separable problems).

---
## Reference Absorption: The XOR Problem (cont.)
- Minsky and Papert proved this in 1969 and it nearly killed neural network research for a decade.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (minsky and papert proved this in 1969 and it nearly killed neural network research for a decade).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (minsky and papert proved this in 1969 and it nearly killed neural network research for a decade).
- The fix: stack perceptrons into layers.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (the fix: stack perceptrons into layers).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (the fix: stack perceptrons into layers).
- A multi-layer perceptron can solve XOR by combining two linear decisions into a nonlinear one.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (a multi-layer perceptron can solve xor by combining two linear decisions into a nonlinear one).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (a multi-layer perceptron can solve xor by combining two linear decisions into a nonlinear one).

---
## Reference Absorption: Step 4: Solve XOR with two layers
- The trick: XOR = (x1 OR x2) AND NOT (x1 AND x2).
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (the trick: xor = (x1 or x2) and not (x1 and x2)).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (the trick: xor = (x1 or x2) and not (x1 and x2)).
- Stacking perceptrons into layers creates decision boundaries that no single perceptron can produce.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (stacking perceptrons into layers creates decision boundaries that no single perceptron can produce).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (stacking perceptrons into layers creates decision boundaries that no single perceptron can produce).

---
## Reference Absorption: Use It
- Everything you just built from scratch exists in one import:
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (everything you just built from scratch exists in one import:).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (everything you just built from scratch exists in one import:).
- Your 30-line Perceptron class does the same thing.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (your 30-line perceptron class does the same thing).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (your 30-line perceptron class does the same thing).
- The sklearn version adds convergence checks, multiple loss functions, and sparse input support -- but the core loop is identical: weighted sum, step function, weight update on error.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (the sklearn version adds convergence checks, multiple loss functions, and sparse input support -- but the core loop is identica...).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (the sklearn version adds convergence checks, multiple loss functions, and sparse input support -- but the core loop i...).
- The real gap shows up at scale.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (the real gap shows up at scale).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (the real gap shows up at scale).

---
## Reference Absorption: Use It (cont.)
- What changes in production networks:
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (what changes in production networks:).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (what changes in production networks:).
- The step function becomes sigmoid, ReLU, or other smooth activations
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (the step function becomes sigmoid, relu, or other smooth activations).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (the step function becomes sigmoid, relu, or other smooth activations).
- Weights are learned automatically via backpropagation (Lesson 03)
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (weights are learned automatically via backpropagation (lesson 03)).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (weights are learned automatically via backpropagation (lesson 03)).
- Layers get deeper: 3, 10, 100+ layers
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (layers get deeper: 3, 10, 100+ layers).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (layers get deeper: 3, 10, 100+ layers).

---
## Reference Absorption: Use It Deep Continuation
- The same principle holds: each layer creates new features from the previous layer's outputs
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (the same principle holds: each layer creates new features from the previous layer's outputs).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (the same principle holds: each layer creates new features from the previous layer's outputs).
- A single perceptron can only draw straight lines.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (a single perceptron can only draw straight lines).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (a single perceptron can only draw straight lines).
- Stack them, and you can draw any shape.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (stack them, and you can draw any shape).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (stack them, and you can draw any shape).

---
## Reference Absorption: One Neuron, One Decision
- A perceptron takes n inputs, multiplies each by a weight, sums them up, adds a bias, and passes the result through an activation function.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (a perceptron takes n inputs, multiplies each by a weight, sums them up, adds a bias, and passes the result through an activatio...).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (a perceptron takes n inputs, multiplies each by a weight, sums them up, adds a bias, and passes the result through an...).
- The step function is brutal: if the weighted sum plus bias is >= 0, output 1.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (the step function is brutal: if the weighted sum plus bias is >= 0, output 1).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (the step function is brutal: if the weighted sum plus bias is >= 0, output 1).
- This is a linear classifier.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (this is a linear classifier).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (this is a linear classifier).
- The weights and bias define a line (or hyperplane in higher dimensions) that splits the input space into two regions.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (the weights and bias define a line (or hyperplane in higher dimensions) that splits the input space into two regions).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (the weights and bias define a line (or hyperplane in higher dimensions) that splits the input space into two regions).

---
## Reference Absorption: Further Reading
- Frank Rosenblatt, "The Perceptron: A Probabilistic Model for Information Storage and Organization in the Brain" (1958) -- the original paper that started it all
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (frank rosenblatt, "the perceptron: a probabilistic model for information storage and organization in the brain" (1958) -- the o...).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (frank rosenblatt, "the perceptron: a probabilistic model for information storage and organization in the brain" (1958...).
- Minsky & Papert, "Perceptrons" (1969) -- the book that proved XOR was unsolvable by single-layer networks and killed perceptron research for a decade
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (minsky & papert, "perceptrons" (1969) -- the book that proved xor was unsolvable by single-layer networks and killed perceptron...).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (minsky & papert, "perceptrons" (1969) -- the book that proved xor was unsolvable by single-layer networks and killed...).
- Michael Nielsen, "Neural Networks and Deep Learning", Chapter 1 (http://neuralnetworksanddeeplearning.com/) -- free online, best visual explanation of how perceptrons compose into networks
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (michael nielsen, "neural networks and deep learning", chapter 1 (http://neuralnetworksanddeeplearning.com/) -- free online, bes...).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (michael nielsen, "neural networks and deep learning", chapter 1 (http://neuralnetworksanddeeplearning.com/) -- free o...).

---
## Reference Absorption: Step 3: Watch XOR fail
- This is the hard proof that a single perceptron cannot learn XOR.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (this is the hard proof that a single perceptron cannot learn xor).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (this is the hard proof that a single perceptron cannot learn xor).

---
## Reference Absorption: The Learning Rule
- The perceptron learning rule is simple:
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (the perceptron learning rule is simple:).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (the perceptron learning rule is simple:).
- If the prediction is correct, error = 0, nothing changes.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (if the prediction is correct, error = 0, nothing changes).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (if the prediction is correct, error = 0, nothing changes).
- If it predicts 0 but should be 1, weights increase.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (if it predicts 0 but should be 1, weights increase).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (if it predicts 0 but should be 1, weights increase).
- If it predicts 1 but should be 0, weights decrease.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (if it predicts 1 but should be 0, weights decrease).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (if it predicts 1 but should be 0, weights decrease).

---
## Reference Absorption: The Learning Rule (cont.)
- The learning rate controls how big each adjustment is.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (the learning rate controls how big each adjustment is).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (the learning rate controls how big each adjustment is).

---
## Reference Absorption: The Decision Boundary
- For two inputs, the perceptron draws a line through 2D space:
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (for two inputs, the perceptron draws a line through 2d space:).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (for two inputs, the perceptron draws a line through 2d space:).
- Everything on one side of the line outputs 0.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (everything on one side of the line outputs 0).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (everything on one side of the line outputs 0).
- Everything on the other side outputs 1.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (everything on the other side outputs 1).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (everything on the other side outputs 1).
- Training moves this line until it correctly separates the classes.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (training moves this line until it correctly separates the classes).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (training moves this line until it correctly separates the classes).

---
## Reference Absorption: Learning Objectives
- Implement a perceptron from scratch in Python, including the weight update rule and step activation function
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (implement a perceptron from scratch in python, including the weight update rule and step activation function).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (implement a perceptron from scratch in python, including the weight update rule and step activation function).
- Explain why a single perceptron can only solve linearly separable problems and demonstrate the XOR failure case
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (explain why a single perceptron can only solve linearly separable problems and demonstrate the xor failure case).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (explain why a single perceptron can only solve linearly separable problems and demonstrate the xor failure case).
- Construct a multi-layer perceptron by composing OR, NAND, and AND gates to solve XOR
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (construct a multi-layer perceptron by composing or, nand, and and gates to solve xor).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (construct a multi-layer perceptron by composing or, nand, and and gates to solve xor).
- Train a two-layer network with sigmoid activation and backpropagation to learn XOR automatically
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (train a two-layer network with sigmoid activation and backpropagation to learn xor automatically).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (train a two-layer network with sigmoid activation and backpropagation to learn xor automatically).

---
## Beyond Reference: Engineering Translation
- Core anchors for this module: self, inputs, perceptron, output, hidden, step, data, weights.
- Convert each theoretical primitive into measurable training and inference behaviors.
- Define observability checkpoints for drift, calibration, and latency regressions.
- Tie assumptions to explicit data contracts and fallback policies.

---
## Beyond Reference: Advanced Layer 1
- Relate perceptron margin updates to convergence guarantees on linearly separable datasets.
- Risk and governance extension: convert this into acceptance tests and rollback criteria (relate perceptron margin updates to convergence guarantees on linearly separable datasets.).
- Show why XOR fails for a single linear separator and how compositional gates fix expressivity.
- Risk and governance extension: convert this into acceptance tests and rollback criteria (show why xor fails for a single linear separator and how compositional gates fix expressivity.).
- Analyze sensitivity of perceptron learning to feature scaling and update order.
- Risk and governance extension: convert this into acceptance tests and rollback criteria (analyze sensitivity of perceptron learning to feature scaling and update order.).

<!-- DEPTH_EXPANSION_END -->
