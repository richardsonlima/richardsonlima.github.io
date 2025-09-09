---
layout: post
title:  "A Gentle Journey Through Asymptotic Notation"
date:   2025-09-08 21:00:00
categories: programming
tags: algorithms complexity big-o omega theta
image: /assets/article_images/thomas-t-OPpCbAAKWv8-unsplash.jpg
---

The efficiency of an algorithm is one of the most important aspects in computer science.  
It is not enough for an algorithm to be **correct** — it also needs to be **feasible** for large inputs.  

This post is structured like a **mini-book**, where each chapter builds upon the previous one.  
If you skip ahead, you may miss the logical thread — so follow the journey step by step.  

---

# Why Efficiency Matters

- Real programs can run correctly but still take years to finish on large inputs.  
- Measuring execution time directly (with a stopwatch) depends on **hardware, compiler, OS**.  
- To reason in a universal way, we need **theoretical analysis**, independent of environment.  

This is where **primitive operations** come into play.  

---

# From Reality to the Theoretical Model

A **primitive operation** is any basic step: assignment, comparison, arithmetic, array access, function call.  
We assume each takes constant time.  

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

# Digging Deeper into Counting

Let’s carefully analyze the primitive operations in `array_max`:  

- **Initialization:** 2 ops  
- **Loop control:** ≈ 2(n-1) ops  
- **Loop body:** 2 (best case) to 4 (worst case) per iteration  
- **Return:** 1 op  

**Best case:**  
\[ T(n) = 4n - 1 \]  

**Worst case:**  
\[ T(n) = 6n - 3 \]  

### Another viewpoint
Some analyses conclude the worst case is `6n - 1`.  
The difference comes from conventions: whether we count the final failed loop test, etc.  

### Two hypothetical analysts
- **Alice (meticulous):** counts everything → `6n - 3`.  
- **Bob (pragmatic):** ignores some constants → `6n - 1`.  

➡️ Both agree: **linear growth, Θ(n)**. Constants don’t matter in the big picture.  

---

# Growth Rates

Algorithms have **intrinsic growth rates**. Typical examples:  

- Constant → O(1)  
- Logarithmic → O(log n)  
- Linear → O(n)  
- Quasi-linear → O(n log n)  
- Quadratic → O(n²)  
- Cubic → O(n³)  
- Exponential → O(2ⁿ)  

On a **log-log plot**, the slope corresponds to growth rate.  
This is why exponential algorithms quickly become impractical.  

---

# Big-O as the Upper Bound

Formal definition:  

![Big-O formal definition](/assets/images/math-01.png)

- Example: `2n + 10 ∈ O(n)` (choose `c=3, n₀=10`).  

### Reminders
- “f(n) = O(g(n))” means **membership**, not equality.  
- Constants and small terms are ignored.  
- Ex: `10n² + 10 log n = O(n²)`.  

---

# Beyond Big-O: Ω and Θ

- **Ω (Omega):** lower bound. Ex: `12n² - 10 ∈ Ω(n²)` but not Ω(n³).  
- **Θ (Theta):** both upper and lower bounds. Ex: `6n⁴ + 12n³ + 12 ∈ Θ(n⁴)`.  

### Limit-based view
- If f(n)/g(n) → constant > 0 → f ∈ Θ(g).  
- If f(n)/g(n) → 0 → f ∈ o(g).  
- If f(n)/g(n) → ∞ → f ∈ ω(g).  

This trio (O, Ω, Θ) allows us to bound functions precisely.  

---

# Polynomial Functions and Hierarchy

For polynomials: degree dominates.  
\[ p(n) = a_k n^k + … ⇒ p(n) ∈ O(n^k) \]  

Natural hierarchy:  
\[ O(1) < O(log n) < O(n) < O(n log n) < O(n²) < O(n³) < … < O(2ⁿ) \]  

This ordering is the backbone of algorithm classification.  

---

# Applying Big-O in Real Algorithms

Rules of thumb:  
- Conditionals → test + slower branch.  
- Consecutive commands → sum (dominated by larger).  
- Nested loops → multiplication.  
- Function calls → cost of function body.  

### Example in Python
```python
# Iterative sum
def sum_iterative(A):
    total = 0
    for x in A:
        total += x
    return total   # Θ(n)

# Formula sum
def sum_formula(n):
    return n * (n + 1) // 2  # Θ(1)
```

One traverses the array → O(n). The other uses math → O(1).  

---

# Problem Bounds (UB and LB)

- **Upper bound (UB):** complexity of best known algorithm.  
- **Lower bound (LB):** theoretical minimum for any algorithm.  
- A problem is *solved* when:  
\[ UB(P) ∈ Θ(LB(P)) \]  

This shifts focus from “an algorithm” to “the problem itself”.  

---

# The Synthesis: Asymptotic Analysis

Now the puzzle is complete:  

1. Count primitive operations.  
2. Abstract constants away.  
3. Express growth with O/Ω/Θ.  
4. Place function in the hierarchy.  
5. Apply rules to analyze code.  
6. Relate algorithms to problem bounds.  

➡️ Asymptotic analysis = **the essence of performance**, beyond machines and languages.  

---

# 🚀 The Big Takeaway

- Constants vanish, small terms fade.  
- Growth rate remains the **signature of an algorithm**.  
- Big-O, Ω, Θ let us compare algorithms objectively.  
- Mastery here opens the door to sorting, graph algorithms, dynamic programming, and beyond.  

> **In short:** asymptotic notation strips away noise to reveal the algorithm’s true nature.  

---

## 📝 Exercises

- Design a **parallel algorithm** to find the maximum of an array of size `n`.  
- Hint: with `n` processors, time can drop drastically.  
- Bonus: can you design one that uses fewer processors efficiently?  

---

📚 References:  
- [Cormen, Leiserson, Rivest, Stein. *Introduction to Algorithms*](https://a.co/d/5kl59AV)  
- [Knuth, Donald. *The Art of Computer Programming*](https://a.co/d/ipVU0sr)
