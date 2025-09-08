---
layout: post
title:  "Algorithm Analysis: Asymptotic notations explained"
date:   2025-09-06 23:00:00
categories: programming
tags: algorithms complexity 
image: /assets/article_images/big-O.jpg
---

The efficiency of an algorithm is one of the most important aspects in computer science. It is not enough for an algorithm to be **correct** — it also needs to be **feasible** for large inputs.  
In this article, we will review the fundamental concepts of **growth rates** and **asymptotic notations**: **O (Big-Oh)**, **Ω (Omega)** and **Θ (Theta)**.  

---

## Execution Time: Real vs. Theoretical

In practice, we can measure the real execution time of a program by running it on different inputs.  
But the **absolute time depends on the hardware, compiler, and operating system**.  

To abstract away these details, we use **theoretical complexity analysis**, based on counting **primitive operations** (assignments, comparisons, array accesses, etc.).

---

## Example: Counting Operations

Let’s analyze a simple algorithm that finds the maximum element in an array:

```python
def array_max(A):
    current_max = A[0]          # 1 assignment
    for i in range(1, len(A)):  # n-1 iterations
        if A[i] > current_max:  # 1 comparison per iteration
            current_max = A[i]  # up to 1 assignment per iteration
    return current_max          # 1 return
```

In the **worst case**, this algorithm performs approximately `6n` primitive operations.  
Therefore, the execution time grows **linearly** with the input size.

## Detailed Primitive Operation Count for `array_max`

Let’s carefully analyze the number of **primitive operations** (assignments, comparisons, array accesses, increments, etc.) performed by the algorithm.

---

### Step 1 – Initial assignment
```python
current_max = A[0]
```
- **1 assignment** (`current_max`)  
- **1 array access** (`A[0]`)  

✔️ **2 operations**

---

### Step 2 – For loop setup
```python
for i in range(1, len(A)):
```
- **1 call** to `len(A)`  
- **1 initialization** of `i`  
- Each iteration (total: `n-1` times):  
  - **1 comparison** (`i < len(A)`)  
  - **1 increment** (`i = i + 1`)  

✔️ **≈ 2(n-1) + 2 operations**

---

### Step 3 – Inside the loop
```python
if A[i] > current_max:
    current_max = A[i]
```

For each of the `n-1` iterations:  
- **1 array access** (`A[i]`)  
- **1 comparison** (`A[i] > current_max`)  

If condition is **true**:  
- **1 assignment** to `current_max`  
- **1 array access** (`A[i]`)  

✔️ **2 operations per iteration (best case)**  
✔️ **4 operations per iteration (worst case)**

---

### Step 4 – Return
```python
return current_max
```
- **1 return**

✔️ **1 operation**

---

### Total Count

Let `n = len(A)`:

- Step 1: `2`  
- Step 2: `2(n-1) + 2`  
- Step 3: between `2(n-1)` and `4(n-1)`  
- Step 4: `1`

**Best case (no updates to `current_max`):**
\[
T(n) = 2 + (2n - 2) + (2n - 2) + 1 = 4n - 1
\]

**Worst case (update every iteration):**
\[
T(n) = 2 + (2n - 2) + (4n - 4) + 1 = 6n - 3
\]

---

### Final Result

- **Best case**: `4n - 1` operations  
- **Worst case**: `6n - 3` operations  
- **Asymptotic complexity**:  
\[
T(n) = Θ(n)
\]

### ⚠️ Step-by-step breakdown (another point of view)

According to some points of view, the algorithm could in the worst case execute:

\[ T(n) = 6n - 1 \]

primitive operations.

---

### Two hypothetical analysts

- **Alice (the meticulous analyst):** counts every array access, assignment, and the final failed loop comparison. She concludes the algorithm performs about **6n - 3** operations in the worst case.  

- **Bob (the pragmatic analyst):** uses a slightly different counting convention, not including certain constant terms. He concludes the algorithm performs about **6n - 1** operations in the worst case.  

---

### Why both are correct

- The difference lies in the **counting conventions**:  
  - Whether the final failed comparison in the `for` loop is included.  
  - How the initialization and return are treated.  

- Both Alice and Bob agree that the number of operations is **linear in n**.  
- The divergence (`6n - 3` vs. `6n - 1`) affects only the **constant term**, not the growth rate.  

---

### ✔️ The common conclusion

No matter which convention you use, the **asymptotic complexity** is the same:

\[
T(n) = Θ(n)
\]

This means that the **intrinsic growth rate** of `array_max` is linear.  
Hardware or software differences will change only the absolute constant factors, never the growth rate.  

---

## Growth Functions

Every algorithm has an **intrinsic growth rate**. Typical examples include:

- **O(1)** → constant (accessing an element of a list).
- **O(log n)** → logarithmic (binary search).
- **O(n)** → linear (scanning all elements).
- **O(n log n)** → near-linear (optimal sorting algorithms).
- **O(n²)** → quadratic (nested loops over a matrix).
- **O(2ⁿ)** → exponential (brute force enumeration).

A log-log graph clearly shows the differences: the slope of the line indicates the order of growth.

---

## Asymptotic Notations

### 1. Big-O (O)
Provides an **upper bound** for the growth of a function.  
Example: if `T(n) = 10n² + 137n + 15`, then `T(n) = O(n²)`.

Formally:
> f(n) ∈ O(g(n)) if there exist constants `c > 0` and `n₀ > 0` such that  
> f(n) ≤ c·g(n), ∀ n ≥ n₀.

### 2. Omega (Ω)
Provides a **lower bound**.  
In the example above, we also have `T(n) = Ω(n²)`.

### 3. Theta (Θ)
When both Big-O and Omega coincide, we say the function has an **exact growth rate**:  
`T(n) = Θ(n²)`.

---

## Practical Example in Python

Consider two algorithms for summing the elements of a list:

```python
# Algorithm 1: iterative
def sum_iterative(A):
    total = 0
    for x in A:
        total += x
    return total  # T(n) = Θ(n)

# Algorithm 2: using a mathematical formula
def sum_formula(n):
    return n * (n + 1) // 2  # T(n) = Θ(1)
```

- `sum_iterative` traverses all elements → linear time O(n).  
- `sum_formula` solves it in a single step → constant time O(1).  

---

## Unlocking the Big Picture

- Asymptotic analysis ignores **constants** and **lower-order terms**, focusing only on what really matters for large inputs.  
- Big-O, Ω and Θ are fundamental tools to **compare algorithms independently of hardware**.  
- Mastering these concepts is the first step to understanding more complex algorithms such as sorting, graph search, and dynamic programming.

---

📚 References:  
- [Cormen, Leiserson, Rivest, Stein. *Introduction to Algorithms*](https://a.co/d/5kl59AV)  
- [Knuth, Donald. *The Art of Computer Programming*](https://www.amazon.com.br/Computer-Programming-Volumes-1-4a-Boxed/dp/0321751043)  
