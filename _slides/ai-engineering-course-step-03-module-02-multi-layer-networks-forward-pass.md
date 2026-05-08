---
layout: slides
title: "Multi-Layer Networks & Forward Pass"
category: "ai-engineering-course-step-03"
module_number: 2
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
## Module 02: Multi-Layer Networks & Forward Pass
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
- A single neuron is a line drawer.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (a single neuron is a line drawer).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (a single neuron is a line drawer).
- One straight line through your data.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (one straight line through your data).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (one straight line through your data).
- Every real problem in AI -- image recognition, language understanding, playing Go -- requires curves.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (every real problem in ai -- image recognition, language understanding, playing go -- requires curves).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (every real problem in ai -- image recognition, language understanding, playing go -- requires curves).
- Stacking neurons into layers is how you get curves.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (stacking neurons into layers is how you get curves).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (stacking neurons into layers is how you get curves).

---
## Reference Absorption: The Problem (cont.)
- In 1969, Minsky and Papert proved this limitation was fatal: a single-layer network cannot learn XOR.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (in 1969, minsky and papert proved this limitation was fatal: a single-layer network cannot learn xor).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (in 1969, minsky and papert proved this limitation was fatal: a single-layer network cannot learn xor).
- Not "struggles to learn" -- mathematically cannot.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (not "struggles to learn" -- mathematically cannot).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (not "struggles to learn" -- mathematically cannot).
- The XOR truth table places [0,1] and [1,0] on one side, [0,0] and [1,1] on the other.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (the xor truth table places [0,1] and [1,0] on one side, [0,0] and [1,1] on the other).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (the xor truth table places [0,1] and [1,0] on one side, [0,0] and [1,1] on the other).
- No single line separates them.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (no single line separates them).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (no single line separates them).

---
## Reference Absorption: The Problem Deep Continuation
- This killed neural network funding for over a decade.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (this killed neural network funding for over a decade).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (this killed neural network funding for over a decade).
- The fix was obvious in hindsight: stop using one layer.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (the fix was obvious in hindsight: stop using one layer).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (the fix was obvious in hindsight: stop using one layer).
- Let the first layer carve the input space into new features, and let the second layer combine those features into decisions no single line could make.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (let the first layer carve the input space into new features, and let the second layer combine those features into decisions no...).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (let the first layer carve the input space into new features, and let the second layer combine those features into dec...).
- That stack is the multi-layer network.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (that stack is the multi-layer network).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (that stack is the multi-layer network).

---
## Reference Absorption: The Problem Deep Continuation
- It is the foundation of every deep learning model in production today.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (it is the foundation of every deep learning model in production today).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (it is the foundation of every deep learning model in production today).
- The forward pass -- data flowing from input through hidden layers to output -- is the first thing you need to build before anything else works.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (the forward pass -- data flowing from input through hidden layers to output -- is the first thing you need to build before anyt...).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (the forward pass -- data flowing from input through hidden layers to output -- is the first thing you need to build b...).

---
## Reference Absorption: Exercises
- Build a 2-4-2-1 network (two hidden layers) and run the forward pass on XOR data with random weights.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (build a 2-4-2-1 network (two hidden layers) and run the forward pass on xor data with random weights).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (build a 2-4-2-1 network (two hidden layers) and run the forward pass on xor data with random weights).
- Print the intermediate hidden layer outputs to see how the representation transforms at each layer.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (print the intermediate hidden layer outputs to see how the representation transforms at each layer).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (print the intermediate hidden layer outputs to see how the representation transforms at each layer).
- Change the hidden layer size in the circle classifier from 8 to 2, then to 32.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (change the hidden layer size in the circle classifier from 8 to 2, then to 32).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (change the hidden layer size in the circle classifier from 8 to 2, then to 32).
- Run the forward pass with random weights each time.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (run the forward pass with random weights each time).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (run the forward pass with random weights each time).

---
## Reference Absorption: Exercises (cont.)
- Does the number of hidden neurons change the output range or distribution?
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (does the number of hidden neurons change the output range or distribution?).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (does the number of hidden neurons change the output range or distribution?).
- Implement a count_parameters method on the Network class that returns the total number of trainable weights and biases.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (implement a count_parameters method on the network class that returns the total number of trainable weights and biases).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (implement a count_parameters method on the network class that returns the total number of trainable weights and biases).
- Test it on a 784-256-128-10 network (the classic MNIST architecture).
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (test it on a 784-256-128-10 network (the classic mnist architecture)).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (test it on a 784-256-128-10 network (the classic mnist architecture)).
- How many parameters does it have?
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (how many parameters does it have?).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (how many parameters does it have?).

---
## Reference Absorption: Exercises Deep Continuation
- Build a forward pass for a 3-4-4-2 network.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (build a forward pass for a 3-4-4-2 network).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (build a forward pass for a 3-4-4-2 network).
- Feed it RGB color values (normalized to 0-1) and observe the two outputs.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (feed it rgb color values (normalized to 0-1) and observe the two outputs).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (feed it rgb color values (normalized to 0-1) and observe the two outputs).
- This is the architecture for a simple color classifier with two classes.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (this is the architecture for a simple color classifier with two classes).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (this is the architecture for a simple color classifier with two classes).
- Replace sigmoid with a "leaky step" function: return 0.01 * z if z < 0, else 1.0.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (replace sigmoid with a "leaky step" function: return 0.01 * z if z < 0, else 1.0).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (replace sigmoid with a "leaky step" function: return 0.01 * z if z < 0, else 1.0).

---
## Reference Absorption: Exercises Deep Continuation
- Run the forward pass on XOR with the same hand-tuned weights from Step 4.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (run the forward pass on xor with the same hand-tuned weights from step 4).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (run the forward pass on xor with the same hand-tuned weights from step 4).
- Why is the smooth sigmoid preferred over hard cutoffs?
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (why is the smooth sigmoid preferred over hard cutoffs?).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (why is the smooth sigmoid preferred over hard cutoffs?).

---
## Reference Absorption: Step 2: Layer Class
- The most important operation in all of deep learning is matrix multiplication.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (the most important operation in all of deep learning is matrix multiplication).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (the most important operation in all of deep learning is matrix multiplication).
- Every layer, every attention head, every forward pass -- it's matmuls all the way down.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (every layer, every attention head, every forward pass -- it's matmuls all the way down).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (every layer, every attention head, every forward pass -- it's matmuls all the way down).
- A linear layer takes an input vector, multiplies it by a weight matrix, and adds a bias vector: y = Wx + b.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (a linear layer takes an input vector, multiplies it by a weight matrix, and adds a bias vector: y = wx + b).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (a linear layer takes an input vector, multiplies it by a weight matrix, and adds a bias vector: y = wx + b).
- That single equation is 90% of the compute in a neural network.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (that single equation is 90% of the compute in a neural network).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (that single equation is 90% of the compute in a neural network).

---
## Reference Absorption: Step 2: Layer Class (cont.)
- A layer holds a weight matrix and a bias vector.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (a layer holds a weight matrix and a bias vector).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (a layer holds a weight matrix and a bias vector).
- Its forward method takes an input vector and returns the activated output.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (its forward method takes an input vector and returns the activated output).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (its forward method takes an input vector and returns the activated output).
- The weight matrix has shape (n_neurons, n_inputs).
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (the weight matrix has shape (n_neurons, n_inputs)).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (the weight matrix has shape (n_neurons, n_inputs)).
- Each row is one neuron's weights across all inputs.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (each row is one neuron's weights across all inputs).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (each row is one neuron's weights across all inputs).

---
## Reference Absorption: Step 2: Layer Class Deep Continuation
- The forward method loops through neurons, computes the weighted sum plus bias, applies sigmoid, and collects the results.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (the forward method loops through neurons, computes the weighted sum plus bias, applies sigmoid, and collects the results).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (the forward method loops through neurons, computes the weighted sum plus bias, applies sigmoid, and collects the results).

---
## Reference Absorption: Layers: Input, Hidden, Output
- A multi-layer network has three types of layers:
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (a multi-layer network has three types of layers:).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (a multi-layer network has three types of layers:).
- Input layer -- not really a layer.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (input layer -- not really a layer).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (input layer -- not really a layer).
- Two features means two input nodes.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (two features means two input nodes).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (two features means two input nodes).
- No computation happens here.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (no computation happens here).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (no computation happens here).

---
## Reference Absorption: Layers: Input, Hidden, Output (cont.)
- Hidden layers -- where the work happens.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (hidden layers -- where the work happens).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (hidden layers -- where the work happens).
- Each neuron takes every output from the previous layer, applies weights and a bias, then passes the result through an activation function.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (each neuron takes every output from the previous layer, applies weights and a bias, then passes the result through an activatio...).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (each neuron takes every output from the previous layer, applies weights and a bias, then passes the result through an...).
- "Hidden" because you never see these values directly in the training data.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade ("hidden" because you never see these values directly in the training data).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept ("hidden" because you never see these values directly in the training data).
- Output layer -- the final answer.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (output layer -- the final answer).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (output layer -- the final answer).

---
## Reference Absorption: Layers: Input, Hidden, Output Deep Continuation
- For binary classification, one neuron with sigmoid.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (for binary classification, one neuron with sigmoid).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (for binary classification, one neuron with sigmoid).
- For multi-class, one neuron per class.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (for multi-class, one neuron per class).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (for multi-class, one neuron per class).
- Two inputs, three hidden neurons, one output.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (two inputs, three hidden neurons, one output).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (two inputs, three hidden neurons, one output).
- Every connection carries a weight.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (every connection carries a weight).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (every connection carries a weight).

---
## Reference Absorption: Layers: Input, Hidden, Output Deep Continuation
- Every neuron (except input) carries a bias.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (every neuron (except input) carries a bias).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (every neuron (except input) carries a bias).
- Each layer produces a vector of numbers called a hidden state.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (each layer produces a vector of numbers called a hidden state).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (each layer produces a vector of numbers called a hidden state).
- For text, hidden states increase dimensionality -- encoding a word as 768 numbers to capture semantic meaning.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (for text, hidden states increase dimensionality -- encoding a word as 768 numbers to capture semantic meaning).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (for text, hidden states increase dimensionality -- encoding a word as 768 numbers to capture semantic meaning).
- For images, they reduce dimensionality -- compressing millions of pixels into a manageable representation.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (for images, they reduce dimensionality -- compressing millions of pixels into a manageable representation).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (for images, they reduce dimensionality -- compressing millions of pixels into a manageable representation).

---
## Reference Absorption: Layers: Input, Hidden, Output Deep Continuation
- The hidden state is where the learning lives.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (the hidden state is where the learning lives).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (the hidden state is where the learning lives).

---
## Reference Absorption: Step 5: Circle Classification
- A harder problem: classify 2D points as inside or outside a circle of radius 0.5 centered at the origin.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (a harder problem: classify 2d points as inside or outside a circle of radius 0.5 centered at the origin).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (a harder problem: classify 2d points as inside or outside a circle of radius 0.5 centered at the origin).
- This requires a curved decision boundary -- impossible for a single perceptron.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (this requires a curved decision boundary -- impossible for a single perceptron).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (this requires a curved decision boundary -- impossible for a single perceptron).
- With random weights, the network will not classify well.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (with random weights, the network will not classify well).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (with random weights, the network will not classify well).
- But the forward pass still runs.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (but the forward pass still runs).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (but the forward pass still runs).

---
## Reference Absorption: Step 5: Circle Classification (cont.)
- This is the point -- the forward pass is just computation.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (this is the point -- the forward pass is just computation).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (this is the point -- the forward pass is just computation).
- Learning the right weights is backpropagation, coming in Lesson 03.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (learning the right weights is backpropagation, coming in lesson 03).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (learning the right weights is backpropagation, coming in lesson 03).
- Random weights give poor accuracy -- often worse than guessing the majority class.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (random weights give poor accuracy -- often worse than guessing the majority class).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (random weights give poor accuracy -- often worse than guessing the majority class).
- After training (Lesson 03), this same architecture with 8 hidden neurons will draw a curved boundary that separates inside from outside.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (after training (lesson 03), this same architecture with 8 hidden neurons will draw a curved boundary that separates inside from...).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (after training (lesson 03), this same architecture with 8 hidden neurons will draw a curved boundary that separates i...).

---
## Reference Absorption: Universal Approximation Theorem
- In 1989, George Cybenko proved something remarkable: a neural network with a single hidden layer and enough neurons can approximate any continuous function to any desired accuracy.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (in 1989, george cybenko proved something remarkable: a neural network with a single hidden layer and enough neurons can approxi...).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (in 1989, george cybenko proved something remarkable: a neural network with a single hidden layer and enough neurons c...).
- This does not mean one hidden layer is always best.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (this does not mean one hidden layer is always best).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (this does not mean one hidden layer is always best).
- It means the architecture is theoretically capable.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (it means the architecture is theoretically capable).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (it means the architecture is theoretically capable).
- In practice, deeper networks (more layers, fewer neurons per layer) learn the same functions with far fewer total parameters than shallow-wide networks.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (in practice, deeper networks (more layers, fewer neurons per layer) learn the same functions with far fewer total parameters th...).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (in practice, deeper networks (more layers, fewer neurons per layer) learn the same functions with far fewer total par...).

---
## Reference Absorption: Universal Approximation Theorem (cont.)
- That is why deep learning works.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (that is why deep learning works).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (that is why deep learning works).
- The intuition: each neuron in the hidden layer learns one "bump" or feature.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (the intuition: each neuron in the hidden layer learns one "bump" or feature).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (the intuition: each neuron in the hidden layer learns one "bump" or feature).
- Enough bumps placed in the right locations can approximate any smooth curve.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (enough bumps placed in the right locations can approximate any smooth curve).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (enough bumps placed in the right locations can approximate any smooth curve).
- More neurons, more bumps, better approximation.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (more neurons, more bumps, better approximation).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (more neurons, more bumps, better approximation).

---
## Reference Absorption: Step 4: XOR with Hand-Tuned Weights
- In Lesson 01, we solved XOR by combining OR, NAND, and AND perceptrons.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (in lesson 01, we solved xor by combining or, nand, and and perceptrons).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (in lesson 01, we solved xor by combining or, nand, and and perceptrons).
- Now do the same thing with our Layer and Network classes.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (now do the same thing with our layer and network classes).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (now do the same thing with our layer and network classes).
- The 2-2-1 architecture: two inputs, two hidden neurons, one output.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (the 2-2-1 architecture: two inputs, two hidden neurons, one output).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (the 2-2-1 architecture: two inputs, two hidden neurons, one output).
- The large weights (20, -20) make sigmoid act like a step function.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (the large weights (20, -20) make sigmoid act like a step function).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (the large weights (20, -20) make sigmoid act like a step function).

---
## Reference Absorption: Step 4: XOR with Hand-Tuned Weights (cont.)
- The first hidden neuron approximates OR.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (the first hidden neuron approximates or).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (the first hidden neuron approximates or).
- The second approximates NAND.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (the second approximates nand).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (the second approximates nand).
- The output neuron combines them into AND, which is XOR.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (the output neuron combines them into and, which is xor).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (the output neuron combines them into and, which is xor).

---
## Reference Absorption: Forward Pass: How Data Flows
- The forward pass pushes input data through the network, layer by layer, until it reaches the output.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (the forward pass pushes input data through the network, layer by layer, until it reaches the output).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (the forward pass pushes input data through the network, layer by layer, until it reaches the output).
- No learning happens during the forward pass.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (no learning happens during the forward pass).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (no learning happens during the forward pass).
- It is pure computation: multiply, add, activate, repeat.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (it is pure computation: multiply, add, activate, repeat).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (it is pure computation: multiply, add, activate, repeat).
- At each layer, three operations happen in sequence:
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (at each layer, three operations happen in sequence:).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (at each layer, three operations happen in sequence:).

---
## Reference Absorption: Forward Pass: How Data Flows (cont.)
- The output of one layer becomes the input to the next.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (the output of one layer becomes the input to the next).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (the output of one layer becomes the input to the next).
- That is the entire forward pass.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (that is the entire forward pass).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (that is the entire forward pass).

---
## Reference Absorption: Use It
- PyTorch does everything above in four lines:
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (pytorch does everything above in four lines:).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (pytorch does everything above in four lines:).
- nn.Linear(2, 8) is your Layer class: weight matrix of shape (8, 2), bias vector of shape (8,).
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (nn.linear(2, 8) is your layer class: weight matrix of shape (8, 2), bias vector of shape (8,)).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (nn.linear(2, 8) is your layer class: weight matrix of shape (8, 2), bias vector of shape (8,)).
- nn.Sigmoid() is your sigmoid function applied element-wise.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (nn.sigmoid() is your sigmoid function applied element-wise).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (nn.sigmoid() is your sigmoid function applied element-wise).
- nn.Sequential is your Network class: chain layers in order.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (nn.sequential is your network class: chain layers in order).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (nn.sequential is your network class: chain layers in order).

---
## Reference Absorption: Use It (cont.)
- The difference is speed and scale.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (the difference is speed and scale).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (the difference is speed and scale).
- PyTorch runs on GPUs, handles batches of millions of samples, and automatically computes gradients for backpropagation.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (pytorch runs on gpus, handles batches of millions of samples, and automatically computes gradients for backpropagation).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (pytorch runs on gpus, handles batches of millions of samples, and automatically computes gradients for backpropagation).
- But the forward pass logic is identical to what you just built from scratch.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (but the forward pass logic is identical to what you just built from scratch).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (but the forward pass logic is identical to what you just built from scratch).

---
## Reference Absorption: Further Reading
- Michael Nielsen, "Neural Networks and Deep Learning", Chapter 1-2 (http://neuralnetworksanddeeplearning.com/) -- the clearest free explanation of forward passes and network structure, with interactive visual...
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (michael nielsen, "neural networks and deep learning", chapter 1-2 (http://neuralnetworksanddeeplearning.com/) -- the clearest f...).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (michael nielsen, "neural networks and deep learning", chapter 1-2 (http://neuralnetworksanddeeplearning.com/) -- the...).
- Cybenko, "Approximation by Superpositions of a Sigmoidal Function" (1989) -- the original universal approximation theorem paper, surprisingly readable
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (cybenko, "approximation by superpositions of a sigmoidal function" (1989) -- the original universal approximation theorem paper...).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (cybenko, "approximation by superpositions of a sigmoidal function" (1989) -- the original universal approximation the...).
- 3Blue1Brown, "But what is a neural network?" (https://www.youtube.com/watch?v=aircAruvnKk) -- 20-minute visual walkthrough of layers, weights, and forward passes that builds the right mental model
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (3blue1brown, "but what is a neural network?" (https://www.youtube.com/watch?v=aircaruvnkk) -- 20-minute visual walkthrough of l...).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (3blue1brown, "but what is a neural network?" (https://www.youtube.com/watch?v=aircaruvnkk) -- 20-minute visual walkth...).
- Goodfellow, Bengio, Courville, "Deep Learning", Chapter 6 (https://www.deeplearningbook.org/) -- the standard reference for multi-layer networks, free online
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (goodfellow, bengio, courville, "deep learning", chapter 6 (https://www.deeplearningbook.org/) -- the standard reference for mul...).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (goodfellow, bengio, courville, "deep learning", chapter 6 (https://www.deeplearningbook.org/) -- the standard referen...).

---
## Reference Absorption: Matrix Dimensions
- Tracking dimensions is the single most important debugging skill in deep learning.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (tracking dimensions is the single most important debugging skill in deep learning).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (tracking dimensions is the single most important debugging skill in deep learning).
- The rule: weight matrix W at layer k has shape (neurons_in_layer_k, neurons_in_layer_k_minus_1).
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (the rule: weight matrix w at layer k has shape (neurons_in_layer_k, neurons_in_layer_k_minus_1)).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (the rule: weight matrix w at layer k has shape (neurons_in_layer_k, neurons_in_layer_k_minus_1)).
- Rows match the current layer.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (rows match the current layer).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (rows match the current layer).
- Columns match the previous layer.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (columns match the previous layer).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (columns match the previous layer).

---
## Reference Absorption: Matrix Dimensions (cont.)
- If the shapes do not line up, you have a bug.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (if the shapes do not line up, you have a bug).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (if the shapes do not line up, you have a bug).

---
## Reference Absorption: Neurons and Activations
- Each neuron does three things:
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (each neuron does three things:).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (each neuron does three things:).
- Multiply every input by its corresponding weight
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (multiply every input by its corresponding weight).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (multiply every input by its corresponding weight).
- Sum all the products and add a bias
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (sum all the products and add a bias).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (sum all the products and add a bias).
- Pass the sum through an activation function
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (pass the sum through an activation function).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (pass the sum through an activation function).

---
## Reference Absorption: Neurons and Activations (cont.)
- For now, the activation is sigmoid:
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (for now, the activation is sigmoid:).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (for now, the activation is sigmoid:).
- Sigmoid squashes any number into the range (0, 1).
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (sigmoid squashes any number into the range (0, 1)).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (sigmoid squashes any number into the range (0, 1)).
- Large positive inputs push toward 1.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (large positive inputs push toward 1).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (large positive inputs push toward 1).
- Large negative inputs push toward 0.
- Engineering implication: if this assumption fails, calibration, robustness, or operational cost can degrade (large negative inputs push toward 0).
- Operational risk check: define an alert, threshold, and rollback action tied to this concept (large negative inputs push toward 0).

---
## Beyond Reference: Engineering Translation
- Core anchors for this module: layer, network, neurons, hidden, output, forward, weights, inputs.
- Convert each theoretical primitive into measurable training and inference behaviors.
- Define observability checkpoints for drift, calibration, and latency regressions.
- Tie assumptions to explicit data contracts and fallback policies.

---
## Beyond Reference: Advanced Layer 1
- Track tensor shapes across layers and build automated guards for forward-pass dimensional consistency.
- Risk and governance extension: convert this into acceptance tests and rollback criteria (track tensor shapes across layers and build automated guards for forward-pass dimensional consistency.).
- Compare representational power gains from depth versus width under fixed parameter budgets.
- Risk and governance extension: convert this into acceptance tests and rollback criteria (compare representational power gains from depth versus width under fixed parameter budgets.).
- Diagnose saturation and information bottlenecks through hidden-activation statistics.
- Risk and governance extension: convert this into acceptance tests and rollback criteria (diagnose saturation and information bottlenecks through hidden-activation statistics.).

<!-- DEPTH_EXPANSION_END -->
