---
layout: slides
title: "Tensor Operations"
category: "ai-engineering-course-step-01"
module_number: 12
complexity: "Build"
lesson_type: "Build"
lang_stack: "Python"
use_math: true
---
layout: true
class: basic-layout
---
class: center, middle, inverse-slide
# Step 01 - Math Foundations
## Module 12: Tensor Operations
### _Type: Build · Lang: Python · Time: ~90 minutes_
**Richardson Lima**
---
## The Journey Map
1. The problem framing and motivation.
2. Core mathematical intuition and geometry.
3. Formal equations and engineering interpretation.
4. AI system connections and production relevance.
5. Build path with practical implementation.
6. Mastery checkpoints and transfer to the next module.
---
## Why does this matter?
You build a transformer. The forward pass looks clean. You run it and get: `RuntimeError: mat1 and mat2 shapes cannot be multiplied (32x768 and 512x768)`. You stare at the shapes. You try a transpose. Now it says `Expected 4D input (got 3D input)`. You add an unsqueeze. Something else breaks.
Shape errors are the most common bug in deep learning code. They are not hard conceptually -- each operation has a shape contract -- but they multiply fast. A transformer has dozens of reshapes, transposes, and broadcasts chained together. One wrong axis and the error cascades. Worse, some shape mistakes do not throw errors at all. They silently produce garbage by broadcasting along the wrong dimension or summing over the wrong axis.
---
## Learning Objectives
- Implement a tensor class with shape, strides, reshape, transpose, and element-wise operations from scratch
- Apply broadcasting rules to operate on tensors of different shapes without copying data
- Write einsum expressions for dot products, matrix multiplications, outer products, and batched operations
- Trace the exact tensor shapes through every step of multi-head attention
---
## What a tensor is
A tensor is a multi-dimensional array of numbers with a uniform data type. The number of dimensions is the **rank** (or **order**). Each dimension is an **axis**. The **shape** is a tuple listing the size along each axis.
Total elements = product of all sizes. A shape `(2, 3, 4)` holds `2 * 3 * 4 = 24` elements.
---
## Tensor shapes in deep learning
Different data types map to specific tensor shapes by convention.
PyTorch uses NCHW (channels-first). TensorFlow defaults to NHWC (channels-last). Mismatched layouts cause silent slowdowns or errors.
---
## How memory layout works
A 2D array in memory is a 1D sequence of bytes. **Strides** tell you how many elements to skip to move one step along each axis.
Transpose does not move data. It swaps the strides, making the tensor **non-contiguous** -- the elements for a row are no longer adjacent in memory.
---
## Broadcasting rules
Broadcasting lets you operate on tensors of different shapes without copying data. Align shapes from the right. Two dimensions are compatible when they are equal or one is 1. Fewer dimensions get padded with 1s on the left.
---
## Hands-on Build Path
1. Step 1: Tensor storage and strides
2. Step 2: Reshape, squeeze, unsqueeze
3. Step 3: Transpose and permute
4. Step 4: Element-wise operations and reductions
5. Step 5: Broadcasting with NumPy
6. Step 6: Einsum operations
Prerequisites: Phase 1, Lessons 01 (Linear Algebra Intuition), 02 (Vectors, Matrices & Operations)
---
## Mastery Checklist
- I can explain the concept without memorizing formulas.
- I can implement the minimal version in code.
- I can connect the topic to model training/inference.
- I can debug common errors in this topic.
---
## Wrap-up
This module connects mathematical intuition with practical execution.
Next step: move to the next module in the track and reinforce it with quiz exercises.
---

<!-- DEPTH_EXPANSION_START -->
---
class: middle, inverse-slide
# Depth Extension
### Full reference absorption plus beyond-reference advanced coverage

---
## Reference Absorption: The Problem
- The forward pass looks clean.
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (the forward pass looks clean).
- Operational risk check: define a metric and alert tied to this concept before deployment (the forward pass looks clean).
- You run it and get: RuntimeError: mat1 and mat2 shapes cannot be multiplied (32x768 and 512x768).
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (you run it and get: runtimeerror: mat1 and mat2 shapes cannot be multiplied (32x768 and 512x768)).
- Operational risk check: define a metric and alert tied to this concept before deployment (you run it and get: runtimeerror: mat1 and mat2 shapes cannot be multiplied (32x768 and 512x768)).
- Now it says Expected 4D input (got 3D input).
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (now it says expected 4d input (got 3d input)).
- Operational risk check: define a metric and alert tied to this concept before deployment (now it says expected 4d input (got 3d input)).
- Shape errors are the most common bug in deep learning code.
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (shape errors are the most common bug in deep learning code).
- Operational risk check: define a metric and alert tied to this concept before deployment (shape errors are the most common bug in deep learning code).

---
## Reference Absorption: The Problem (cont.)
- They are not hard conceptually -- each operation has a shape contract -- but they multiply fast.
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (they are not hard conceptually -- each operation has a shape contract -- but they multiply fast).
- Operational risk check: define a metric and alert tied to this concept before deployment (they are not hard conceptually -- each operation has a shape contract -- but they multiply fast).
- A transformer has dozens of reshapes, transposes, and broadcasts chained together.
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (a transformer has dozens of reshapes, transposes, and broadcasts chained together).
- Operational risk check: define a metric and alert tied to this concept before deployment (a transformer has dozens of reshapes, transposes, and broadcasts chained together).
- One wrong axis and the error cascades.
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (one wrong axis and the error cascades).
- Operational risk check: define a metric and alert tied to this concept before deployment (one wrong axis and the error cascades).
- Worse, some shape mistakes do not throw errors at all.
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (worse, some shape mistakes do not throw errors at all).
- Operational risk check: define a metric and alert tied to this concept before deployment (worse, some shape mistakes do not throw errors at all).

---
## Reference Absorption: The Problem Deep Continuation
- They silently produce garbage by broadcasting along the wrong dimension or summing over the wrong axis.
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (they silently produce garbage by broadcasting along the wrong dimension or summing over the wrong axis).
- Operational risk check: define a metric and alert tied to this concept before deployment (they silently produce garbage by broadcasting along the wrong dimension or summing over the wrong axis).
- Matrices handle pairwise relationships between two sets of things.
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (matrices handle pairwise relationships between two sets of things).
- Operational risk check: define a metric and alert tied to this concept before deployment (matrices handle pairwise relationships between two sets of things).
- Real data does not fit into two dimensions.
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (real data does not fit into two dimensions).
- Operational risk check: define a metric and alert tied to this concept before deployment (real data does not fit into two dimensions).
- A batch of 32 RGB images at 224x224 is a 4D tensor: (32, 3, 224, 224).
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (a batch of 32 rgb images at 224x224 is a 4d tensor: (32, 3, 224, 224)).
- Operational risk check: define a metric and alert tied to this concept before deployment (a batch of 32 rgb images at 224x224 is a 4d tensor: (32, 3, 224, 224)).

---
## Reference Absorption: The Problem Deep Continuation
- Self-attention with 12 heads is also 4D: (batch, heads, seq_len, head_dim).
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (self-attention with 12 heads is also 4d: (batch, heads, seq_len, head_dim)).
- Operational risk check: define a metric and alert tied to this concept before deployment (self-attention with 12 heads is also 4d: (batch, heads, seq_len, head_dim)).
- You need a data structure that generalizes to any number of dimensions, with operations that compose cleanly across all of them.
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (you need a data structure that generalizes to any number of dimensions, with operations that compose cleanly across all of them).
- Operational risk check: define a metric and alert tied to this concept before deployment (you need a data structure that generalizes to any number of dimensions, with operations that compose cleanly across a...).
- That structure is the tensor.
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (that structure is the tensor).
- Operational risk check: define a metric and alert tied to this concept before deployment (that structure is the tensor).
- Master its operations and shape errors become trivially debuggable.
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (master its operations and shape errors become trivially debuggable).
- Operational risk check: define a metric and alert tied to this concept before deployment (master its operations and shape errors become trivially debuggable).

---
## Reference Absorption: Exercises
- Easy -- Reshape round-trip. Take a tensor of shape (2, 3, 4).
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (easy -- reshape round-trip. take a tensor of shape (2, 3, 4)).
- Operational risk check: define a metric and alert tied to this concept before deployment (easy -- reshape round-trip. take a tensor of shape (2, 3, 4)).
- Reshape it to (6, 4), then to (24,), then back to (2, 3, 4).
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (reshape it to (6, 4), then to (24,), then back to (2, 3, 4)).
- Operational risk check: define a metric and alert tied to this concept before deployment (reshape it to (6, 4), then to (24,), then back to (2, 3, 4)).
- Verify element order is preserved at each step by printing the flat data.
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (verify element order is preserved at each step by printing the flat data).
- Operational risk check: define a metric and alert tied to this concept before deployment (verify element order is preserved at each step by printing the flat data).
- Medium -- Implement broadcasting. Extend the Tensor class with a broadcast_to(shape) method that expands dimensions of size 1 to match a target shape.
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (medium -- implement broadcasting. extend the tensor class with a broadcast_to(shape) method that expands dimensions of size 1 t...).
- Operational risk check: define a metric and alert tied to this concept before deployment (medium -- implement broadcasting. extend the tensor class with a broadcast_to(shape) method that expands dimensions o...).

---
## Reference Absorption: Exercises (cont.)
- Then modify _elementwise_op to automatically broadcast before operating.
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (then modify _elementwise_op to automatically broadcast before operating).
- Operational risk check: define a metric and alert tied to this concept before deployment (then modify _elementwise_op to automatically broadcast before operating).
- Test with shapes (3, 1) and (1, 4) producing (3, 4).
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (test with shapes (3, 1) and (1, 4) producing (3, 4)).
- Operational risk check: define a metric and alert tied to this concept before deployment (test with shapes (3, 1) and (1, 4) producing (3, 4)).
- Hard -- Build einsum from scratch. Implement a basic einsum(subscripts, *tensors) function that handles at least: dot product (i,i->), matrix multiply (ij,jk->ik), outer product (i,j->ij), and transpose (ij-...
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (hard -- build einsum from scratch. implement a basic einsum(subscripts, *tensors) function that handles at least: dot product (...).
- Operational risk check: define a metric and alert tied to this concept before deployment (hard -- build einsum from scratch. implement a basic einsum(subscripts, *tensors) function that handles at least: dot...).
- Parse the subscript string, identify contracted indices, and loop over all index combinations.
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (parse the subscript string, identify contracted indices, and loop over all index combinations).
- Operational risk check: define a metric and alert tied to this concept before deployment (parse the subscript string, identify contracted indices, and loop over all index combinations).

---
## Reference Absorption: Exercises Deep Continuation
- Compare your results against np.einsum.
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (compare your results against np.einsum).
- Operational risk check: define a metric and alert tied to this concept before deployment (compare your results against np.einsum).
- Hard -- Attention shape tracker. Write a function that takes batch_size, seq_len, embed_dim, and num_heads as inputs and prints the exact shape at every step of multi-head attention: input, Q/K/V projection,...
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (hard -- attention shape tracker. write a function that takes batch_size, seq_len, embed_dim, and num_heads as inputs and prints...).
- Operational risk check: define a metric and alert tied to this concept before deployment (hard -- attention shape tracker. write a function that takes batch_size, seq_len, embed_dim, and num_heads as inputs...).
- Verify against the demo_attention_einsum() output.
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (verify against the demo_attention_einsum() output).
- Operational risk check: define a metric and alert tied to this concept before deployment (verify against the demo_attention_einsum() output).

---
## Reference Absorption: Key Terms
- A matrix has rank 2, not rank equal to its matrix rank |
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (a matrix has rank 2, not rank equal to its matrix rank |).
- Operational risk check: define a metric and alert tied to this concept before deployment (a matrix has rank 2, not rank equal to its matrix rank |).
- (2, 3) means 2 rows, 3 columns |
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production ((2, 3) means 2 rows, 3 columns |).
- Operational risk check: define a metric and alert tied to this concept before deployment ((2, 3) means 2 rows, 3 columns |).
- Fails on non-contiguous data |
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (fails on non-contiguous data |).
- Operational risk check: define a metric and alert tied to this concept before deployment (fails on non-contiguous data |).
- NCHW puts channels before spatial dims, NHWC puts them after |
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (nchw puts channels before spatial dims, nhwc puts them after |).
- Operational risk check: define a metric and alert tied to this concept before deployment (nchw puts channels before spatial dims, nhwc puts them after |).

---
## Reference Absorption: Step 1: Tensor storage and strides
- A tensor stores a flat list of numbers plus shape metadata.
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (a tensor stores a flat list of numbers plus shape metadata).
- Operational risk check: define a metric and alert tied to this concept before deployment (a tensor stores a flat list of numbers plus shape metadata).
- Strides tell the indexing logic how to map multi-dimensional indices to flat positions.
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (strides tell the indexing logic how to map multi-dimensional indices to flat positions).
- Operational risk check: define a metric and alert tied to this concept before deployment (strides tell the indexing logic how to map multi-dimensional indices to flat positions).
- For shape (3, 4), strides are (4, 1) -- skip 4 elements to advance one row, skip 1 element to advance one column.
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (for shape (3, 4), strides are (4, 1) -- skip 4 elements to advance one row, skip 1 element to advance one column).
- Operational risk check: define a metric and alert tied to this concept before deployment (for shape (3, 4), strides are (4, 1) -- skip 4 elements to advance one row, skip 1 element to advance one column).

---
## Reference Absorption: Step 7: Attention mechanism via einsum
- The demo_attention_einsum() function implements multi-head attention end to end.
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (the demo_attention_einsum() function implements multi-head attention end to end).
- Operational risk check: define a metric and alert tied to this concept before deployment (the demo_attention_einsum() function implements multi-head attention end to end).
- Every step is a tensor operation: projection (matmul via einsum), head splitting (reshape + transpose), attention scores (batch matmul via einsum), weighted sum (batch matmul via einsum), head merging (trans...
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (every step is a tensor operation: projection (matmul via einsum), head splitting (reshape + transpose), attention scores (batch...).
- Operational risk check: define a metric and alert tied to this concept before deployment (every step is a tensor operation: projection (matmul via einsum), head splitting (reshape + transpose), attention sco...).

---
## Reference Absorption: Step 6: Einsum operations
- The demo_einsum() and demo_einsum_gallery() functions walk through every common pattern.
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (the demo_einsum() and demo_einsum_gallery() functions walk through every common pattern).
- Operational risk check: define a metric and alert tied to this concept before deployment (the demo_einsum() and demo_einsum_gallery() functions walk through every common pattern).
- The computational cost of a contraction is the product of all index sizes (kept and summed).
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (the computational cost of a contraction is the product of all index sizes (kept and summed)).
- Operational risk check: define a metric and alert tied to this concept before deployment (the computational cost of a contraction is the product of all index sizes (kept and summed)).
- For bij,bjk->bik with B=32, I=128, J=64, K=128: 32 * 128 * 64 * 128 = 33,554,432 multiply-adds.
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (for bij,bjk->bik with b=32, i=128, j=64, k=128: 32 * 128 * 64 * 128 = 33,554,432 multiply-adds).
- Operational risk check: define a metric and alert tied to this concept before deployment (for bij,bjk->bik with b=32, i=128, j=64, k=128: 32 * 128 * 64 * 128 = 33,554,432 multiply-adds).

---
## Reference Absorption: Further Reading
- [NumPy Broadcasting](https://numpy.org/doc/stable/user/basics.broadcasting.html) -- The canonical rules with visual examples
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production ([numpy broadcasting](https://numpy.org/doc/stable/user/basics.broadcasting.html) -- the canonical rules with visual examples).
- Operational risk check: define a metric and alert tied to this concept before deployment ([numpy broadcasting](https://numpy.org/doc/stable/user/basics.broadcasting.html) -- the canonical rules with visual e...).
- [PyTorch Tensor Views](https://pytorch.org/docs/stable/tensor_view.html) -- When views work and when they copy
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production ([pytorch tensor views](https://pytorch.org/docs/stable/tensor_view.html) -- when views work and when they copy).
- Operational risk check: define a metric and alert tied to this concept before deployment ([pytorch tensor views](https://pytorch.org/docs/stable/tensor_view.html) -- when views work and when they copy).
- [einops](https://github.com/arogozhnikov/einops) -- A library that makes tensor reshaping readable and safe
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production ([einops](https://github.com/arogozhnikov/einops) -- a library that makes tensor reshaping readable and safe).
- Operational risk check: define a metric and alert tied to this concept before deployment ([einops](https://github.com/arogozhnikov/einops) -- a library that makes tensor reshaping readable and safe).
- [The Illustrated Transformer](https://jalammar.github.io/illustrated-transformer/) -- Visualizes the tensor shapes flowing through attention
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production ([the illustrated transformer](https://jalammar.github.io/illustrated-transformer/) -- visualizes the tensor shapes flowing thro...).
- Operational risk check: define a metric and alert tied to this concept before deployment ([the illustrated transformer](https://jalammar.github.io/illustrated-transformer/) -- visualizes the tensor shapes fl...).

---
## Reference Absorption: Further Reading (cont.)
- [Einstein Summation in NumPy](https://numpy.org/doc/stable/reference/generated/numpy.einsum.html) -- Full einsum documentation with examples
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production ([einstein summation in numpy](https://numpy.org/doc/stable/reference/generated/numpy.einsum.html) -- full einsum documentation...).
- Operational risk check: define a metric and alert tied to this concept before deployment ([einstein summation in numpy](https://numpy.org/doc/stable/reference/generated/numpy.einsum.html) -- full einsum docu...).

---
## Reference Absorption: What a tensor is
- A tensor is a multi-dimensional array of numbers with a uniform data type.
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (a tensor is a multi-dimensional array of numbers with a uniform data type).
- Operational risk check: define a metric and alert tied to this concept before deployment (a tensor is a multi-dimensional array of numbers with a uniform data type).
- The number of dimensions is the rank (or order).
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (the number of dimensions is the rank (or order)).
- Operational risk check: define a metric and alert tied to this concept before deployment (the number of dimensions is the rank (or order)).
- The shape is a tuple listing the size along each axis.
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (the shape is a tuple listing the size along each axis).
- Operational risk check: define a metric and alert tied to this concept before deployment (the shape is a tuple listing the size along each axis).
- Total elements = product of all sizes.
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (total elements = product of all sizes).
- Operational risk check: define a metric and alert tied to this concept before deployment (total elements = product of all sizes).

---
## Reference Absorption: What a tensor is (cont.)
- A shape (2, 3, 4) holds 2 * 3 * 4 = 24 elements.
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (a shape (2, 3, 4) holds 2 * 3 * 4 = 24 elements).
- Operational risk check: define a metric and alert tied to this concept before deployment (a shape (2, 3, 4) holds 2 * 3 * 4 = 24 elements).

---
## Reference Absorption: Step 5: Broadcasting with NumPy
- The demo_broadcasting_numpy() function in tensors.py shows the core patterns.
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (the demo_broadcasting_numpy() function in tensors.py shows the core patterns).
- Operational risk check: define a metric and alert tied to this concept before deployment (the demo_broadcasting_numpy() function in tensors.py shows the core patterns).
- Pairwise distance via broadcasting: reshape (M, 2) to (M, 1, 2) and (N, 2) to (1, N, 2), subtract, square, sum along last axis, take square root.
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (pairwise distance via broadcasting: reshape (m, 2) to (m, 1, 2) and (n, 2) to (1, n, 2), subtract, square, sum along last axis,...).
- Operational risk check: define a metric and alert tied to this concept before deployment (pairwise distance via broadcasting: reshape (m, 2) to (m, 1, 2) and (n, 2) to (1, n, 2), subtract, square, sum along...).

---
## Reference Absorption: Tensor shapes in deep learning
- Different data types map to specific tensor shapes by convention.
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (different data types map to specific tensor shapes by convention).
- Operational risk check: define a metric and alert tied to this concept before deployment (different data types map to specific tensor shapes by convention).
- PyTorch uses NCHW (channels-first).
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (pytorch uses nchw (channels-first)).
- Operational risk check: define a metric and alert tied to this concept before deployment (pytorch uses nchw (channels-first)).
- TensorFlow defaults to NHWC (channels-last).
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (tensorflow defaults to nhwc (channels-last)).
- Operational risk check: define a metric and alert tied to this concept before deployment (tensorflow defaults to nhwc (channels-last)).
- Mismatched layouts cause silent slowdowns or errors.
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (mismatched layouts cause silent slowdowns or errors).
- Operational risk check: define a metric and alert tied to this concept before deployment (mismatched layouts cause silent slowdowns or errors).

---
## Reference Absorption: Step 2: Reshape, squeeze, unsqueeze
- Reshape changes the shape without changing element order.
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (reshape changes the shape without changing element order).
- Operational risk check: define a metric and alert tied to this concept before deployment (reshape changes the shape without changing element order).
- The total number of elements must stay the same.
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (the total number of elements must stay the same).
- Operational risk check: define a metric and alert tied to this concept before deployment (the total number of elements must stay the same).
- Use -1 for one dimension to infer its size.
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (use -1 for one dimension to infer its size).
- Operational risk check: define a metric and alert tied to this concept before deployment (use -1 for one dimension to infer its size).
- Squeeze removes axes of size 1.
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (squeeze removes axes of size 1).
- Operational risk check: define a metric and alert tied to this concept before deployment (squeeze removes axes of size 1).

---
## Reference Absorption: Step 2: Reshape, squeeze, unsqueeze (cont.)
- Unsqueezing is critical for broadcasting -- a bias vector (D,) added to a batch (B, T, D) needs unsqueezing to (1, 1, D).
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (unsqueezing is critical for broadcasting -- a bias vector (d,) added to a batch (b, t, d) needs unsqueezing to (1, 1, d)).
- Operational risk check: define a metric and alert tied to this concept before deployment (unsqueezing is critical for broadcasting -- a bias vector (d,) added to a batch (b, t, d) needs unsqueezing to (1, 1, d)).

---
## Reference Absorption: Ship It
- This lesson produces two reusable prompts:
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (this lesson produces two reusable prompts:).
- Operational risk check: define a metric and alert tied to this concept before deployment (this lesson produces two reusable prompts:).
- outputs/prompt-tensor-shapes.md -- A systematic prompt for debugging tensor shape mismatches.
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (outputs/prompt-tensor-shapes.md -- a systematic prompt for debugging tensor shape mismatches).
- Operational risk check: define a metric and alert tied to this concept before deployment (outputs/prompt-tensor-shapes.md -- a systematic prompt for debugging tensor shape mismatches).
- Includes decision tables for every common operation (matmul, broadcast, cat, Linear, Conv2d, BatchNorm, softmax) and a fix lookup table.
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (includes decision tables for every common operation (matmul, broadcast, cat, linear, conv2d, batchnorm, softmax) and a fix look...).
- Operational risk check: define a metric and alert tied to this concept before deployment (includes decision tables for every common operation (matmul, broadcast, cat, linear, conv2d, batchnorm, softmax) and...).
- outputs/prompt-tensor-debugger.md -- A step-by-step debugging prompt you paste into any AI assistant when a shape error is blocking you.
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (outputs/prompt-tensor-debugger.md -- a step-by-step debugging prompt you paste into any ai assistant when a shape error is bloc...).
- Operational risk check: define a metric and alert tied to this concept before deployment (outputs/prompt-tensor-debugger.md -- a step-by-step debugging prompt you paste into any ai assistant when a shape err...).

---
## Reference Absorption: Ship It (cont.)
- Feed it the error message and your tensor shapes, get back the exact fix.
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (feed it the error message and your tensor shapes, get back the exact fix).
- Operational risk check: define a metric and alert tied to this concept before deployment (feed it the error message and your tensor shapes, get back the exact fix).

---
## Reference Absorption: How memory layout works
- A 2D array in memory is a 1D sequence of bytes.
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (a 2d array in memory is a 1d sequence of bytes).
- Operational risk check: define a metric and alert tied to this concept before deployment (a 2d array in memory is a 1d sequence of bytes).
- Strides tell you how many elements to skip to move one step along each axis.
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (strides tell you how many elements to skip to move one step along each axis).
- Operational risk check: define a metric and alert tied to this concept before deployment (strides tell you how many elements to skip to move one step along each axis).
- Transpose does not move data.
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (transpose does not move data).
- Operational risk check: define a metric and alert tied to this concept before deployment (transpose does not move data).
- It swaps the strides, making the tensor non-contiguous -- the elements for a row are no longer adjacent in memory.
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (it swaps the strides, making the tensor non-contiguous -- the elements for a row are no longer adjacent in memory).
- Operational risk check: define a metric and alert tied to this concept before deployment (it swaps the strides, making the tensor non-contiguous -- the elements for a row are no longer adjacent in memory).

---
## Reference Absorption: Einsum: the universal tensor operation
- Einstein summation labels each axis with a letter.
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (einstein summation labels each axis with a letter).
- Operational risk check: define a metric and alert tied to this concept before deployment (einstein summation labels each axis with a letter).
- Axes in the input but not the output get summed.
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (axes in the input but not the output get summed).
- Operational risk check: define a metric and alert tied to this concept before deployment (axes in the input but not the output get summed).
- Key patterns: i,i-> (dot product), i,j->ij (outer product), ii-> (trace), ij->ji (transpose), bij,bjk->bik (batch matmul), bhtd,bhsd->bhts (attention scores).
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (key patterns: i,i-> (dot product), i,j->ij (outer product), ii-> (trace), ij->ji (transpose), bij,bjk->bik (batch matmul), bhtd...).
- Operational risk check: define a metric and alert tied to this concept before deployment (key patterns: i,i-> (dot product), i,j->ij (outer product), ii-> (trace), ij->ji (transpose), bij,bjk->bik (batch mat...).

---
## Beyond Reference: Engineering Translation
- Core anchors for this module: shape, tensor, einsum, data, reshape, transpose, strides, attention.
- Convert each theoretical primitive into measurable behaviors in training and inference pipelines.
- Define observability checkpoints so regressions are detected before deployment impact.
- Tie mathematical assumptions to concrete data contracts and monitoring thresholds.

---
## Beyond Reference: Advanced Layer 1
- Plan tensor contraction order to minimize FLOPs and memory peak in attention-style workloads.
- Risk and governance extension: convert this advanced point into explicit acceptance tests and rollback criteria (plan tensor contraction order to minimize flops and memory peak in attention-style workloads.).
- Use Einstein notation to audit dimension safety in complex multi-head architectures.
- Risk and governance extension: convert this advanced point into explicit acceptance tests and rollback criteria (use einstein notation to audit dimension safety in complex multi-head architectures.).
- Compare contiguous versus non-contiguous memory access patterns for throughput-critical kernels.
- Risk and governance extension: convert this advanced point into explicit acceptance tests and rollback criteria (compare contiguous versus non-contiguous memory access patterns for throughput-critical kernels.).

---
## Beyond Reference: Research to Production Loop
- Start from a benchmarked baseline and publish ablations that isolate each mathematical choice.
- Stress-test with adversarial and out-of-distribution inputs aligned to the module's assumptions.
- Maintain a rollback-safe deployment strategy with guardrails for confidence, drift, and latency budgets.
- Document invariant checks that must remain true after every optimization or refactor.

<!-- DEPTH_EXPANSION_END -->
