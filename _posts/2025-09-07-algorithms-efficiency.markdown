---
layout: post
title:  "A Journey Through Asymptotic Notation"
date:   2025-09-08 21:00:00
categories: programming
tags: featured
image: /assets/article_images/liana-s-CbCifdZDr0U-unsplash.jpg
---

> The efficiency of an algorithm is one of the most important aspects in computer science.  
It is not enough for an algorithm to be **correct** , it also needs to be **feasible** for large inputs.  

This post is structured like a **mini-book**, where each chapter builds upon the previous one.  
If you skip ahead, you may miss the logical thread , so follow the journey step by step.  

---

# Why Efficiency Matters

- Real programs can run correctly but still take years to finish on large inputs.  
- Measuring execution time directly (with a stopwatch) depends on **hardware, compiler, OS**.  
- To reason in a universal way, we need **theoretical analysis**, independent of environment.  

This is where **primitive operations** come into play.  

---

# From Reality to the Theoretical Model

A **primitive operation** is any basic step: assignment, comparison, arithmetic, array access, function call. We assume each takes **constant time**.  

## Example: Counting Operations

Let’s analyze a simple algorithm that finds the maximum element in an array:

**Python:**
```python
def array_max(A):
    current_max = A[0]          # 1 assignment
    for i in range(1, len(A)):  # n-1 iterations
        if A[i] > current_max:  # 1 comparison per iteration
            current_max = A[i]  # up to 1 assignment per iteration
    return current_max          # 1 return
```

**C pseudo-code:**

```c
int arrayMax (int A[], int n) {
    currentMax = A[0];
    for (i=1; i<n; i++) {
        if (A[i] > currentMax)
            currentMax = A[i];
    }
    return currentMax;
}
```

### What does it mean to find the *maximum element* in an array?

When we talk about the **maximum element in an array**, we simply mean the **largest value stored in that array**, according to the defined order relation (usually the natural order of numbers).

For example, consider the array:
```python
A = [4, 7, -1, 9, 3, 9]
```


- The **maximum element** is `9`, because no other value in the array is greater.  
- Notice that multiple occurrences of the maximum value may exist (here `9` appears twice). Still, the maximum element is unique: `9`.

#### Key distinction
- **Maximum element** → the actual value itself (e.g., `9`).  
- **Index of the maximum** → the position(s) where this maximum value occurs (e.g., index `3` or index `5`).

---

### The `arrayMax` algorithm

In the `arrayMax` algorithm (introduced in class), the idea is straightforward:  

1. Start by assuming the first element is the maximum (`currentMax = A[0]`).  
2. Traverse the array from left to right.  
3. Each time a larger element is found, update `currentMax`.  
4. By the end, `currentMax` holds the maximum element of the array.

In the **worst case**, this algorithm performs approximately `6n` primitive operations.  
Therefore, the execution time grows **linearly** with the input size.


---

### What does `6n` mean?

- The **`6`** is just the constant that comes from counting operations in this specific algorithm.  
- The **`n`** comes from the fact that the loop runs proportional to the input size.  

**So:**
Initialization: a handful of constant operations (≈5)

Loop: (n-1) * 6 operations

Total: 6n - 1, which we approximate as ≈ 6n.

In other words:

> For an array of size `n`, the algorithm does about six primitive steps per element.  

---

### Tip: Big-O perspective

From the **asymptotic point of view**, constants like `6` do not matter.  
What matters is that the growth is **linear**:  


So, the running time increases proportionally with the size of the input array.

---

📌 **Takeaway**: `6n` is a precise teaching-level count of operations, but in algorithm analysis we focus on the *growth rate*, which is linear.

### Why does the formula become `(n - 1) * 6` and then `6n - 1`?

Let’s break this down step by step.

#### 1. Initialization before the loop
Before the loop starts, we perform a handful of **constant operations**:

- Assigning `currentMax = A[0]`  
- Preparing the loop variables  
- The final `return`

This adds up to about **5 operations**.  
Since this number does not depend on `n`, it is considered a **constant term**.

---

#### 2. Operations inside the loop
Now, let’s look at what happens in **each iteration** of the loop:

```c
for (i = 1; i < n; i++) {
    if (A[i] > currentMax)
        currentMax = A[i];
}
```

Per iteration, in the **worst case**, we count:

1. Checking the loop condition (`i < n`) → 1 op  
2. Accessing the element `A[i]` → 1 op  
3. Comparing `A[i] > currentMax` → 1 op  
4. Possibly assigning `currentMax = A[i]` → 1 op  
5. Incrementing `i++` → 1 op  
6. The loop "jump" or bookkeeping → 1 op  

➡️ Total = **6 operations per iteration**

---

#### 3. Why `(n - 1)` iterations?
The loop starts at `i = 1` and goes until `i = n - 1`.  
That means it executes **exactly `n - 1` times**.

This is a **fundamental rule of counting**:  
If a loop runs from `1` up to but not including `n`, then the number of iterations is:

```
(n - 1) - 1 + 1 = n - 1
```

*(This is the standard formula for counting integers in an inclusive range: `last - first + 1`.)*

---

#### 4. Total cost
So, the total number of primitive operations is:

```
Total = initialization + loop cost
       = 5 + (n - 1) * 6
       = 5 + 6n - 6
       = 6n - 1
```

---

#### 5. Approximation to `6n`
In asymptotic analysis, we **ignore constants** because they do not affect the growth rate.  

So:

```
6n - 1 ≈ 6n
```

And since **constant factors** are also ignored in Big-O notation:

```
T(n) = O(n)
```

---

📌 **Mathematical recap for readers**
- **Counting rule**: Number of iterations in a loop = `last - first + 1`  
- **Distributive property**: `(n - 1) * 6 = 6n - 6`  
- **Simplification**: `6n - 6 + 5 = 6n - 1`  
- **Asymptotics**: Ignore `-1` (constant) → growth is linear in `n`.

---

📌 **Final takeaway:**
The exact count is `6n - 1`, but for large `n` the `-1` is negligible, so the algorithm runs in about `6n` steps — which is why its time complexity is **linear**.

#### To be more clear, let's use operations inside the loop:

(with A = [4, 7, -1, 9, 3, 9]) array

**We start with:**

```
currentMax = A[0] = 4  
n = 6
```

In fact, when we write `n = 6` in the example of vector `A = [4, 7, -1, 9, 3, 9]`, this value is not directly related to the index count, but rather to the total size of the vector.

**👉 Let's break it down:**
Vector A has 6 elements: `[4, 7, -1, 9, 3, 9]`.
Therefore, `n = 6` means the number of elements in the vector.

**Regarding the indices:**
If we use zero-based indexing (as in C, Java, Python), the indices range from 0 to n-1.

**In our case:** indices from 0 to 5.
The for loop `(i = 1; i < n; i++) runs from i = 1 to i = 5`.
Therefore, we have exactly `n-1 = 5` iterations.

**🔑 Didactic summary:**
`n` = size of the vector (how many elements it has).
`n-1` = number of times the loop executes, because the first element `(A[0])` was already considered during initialization `(currentMax = A[0])`.
The indices range from 0 to n-1.

**Now we run the loop:**

```c
for (i = 1; i < 6; i++) {
    if (A[i] > currentMax)
        currentMax = A[i];
}
```

**Iteration details:**

- **i = 1** → compare `A[1] = 7` with `currentMax = 4`  
  → condition true → `currentMax = 7`  

- **i = 2** → compare `A[2] = -1` with `currentMax = 7`  
  → condition false → `currentMax = 7` (unchanged)  

- **i = 3** → compare `A[3] = 9` with `currentMax = 7`  
  → condition true → `currentMax = 9`  

- **i = 4** → compare `A[4] = 3` with `currentMax = 9`  
  → condition false → `currentMax = 9` (unchanged)  

- **i = 5** → compare `A[5] = 9` with `currentMax = 9`  
  → condition false (equal, not greater) → `currentMax = 9`  

✔️ **Final result:**  
The maximum element in `[4, 7, -1, 9, 3, 9]` is **9**.
#####

## Recap: Detailed Primitive Operation Count for `array_max`

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

### Understanding the Expressions for T(n)

We wrote two expressions for the number of primitive operations:

**Best case (no updates to `current_max`):**
\[
T(n) = 2 + (2n - 2) + (2n - 2) + 1 = 4n - 1
\]

**Worst case (update every iteration):**
\[
T(n) = 2 + (2n - 2) + (4n - 4) + 1 = 6n - 3
\]

---

#### What is T(n)?
- **T(n)** represents the total number of primitive operations executed by the algorithm as a function of the input size `n`.

---

#### Where each term comes from:
1. **`2`** → Step 1 (initial assignment `currentMax = A[0]`):  
   - 1 assignment + 1 array access.

2. **`(2n - 2)`** → Step 2 (for loop overhead):  
   - For each of the `n-1` iterations:  
     - 1 comparison (`i < n`)  
     - 1 increment (`i = i+1`)  
   - Total = `2(n-1) = 2n - 2`.

3. **`(2n - 2)` or `(4n - 4)`** → Step 3 (inside the loop):  
   - Every iteration always does:  
     - 1 array access + 1 comparison → `2(n-1) = 2n - 2`.  
   - In the **worst case**, every condition is true, so we also have:  
     - 1 assignment + 1 more array access per iteration → `2(n-1)` extra.  
   - Hence:  
     - Best case = `2n - 2`  
     - Worst case = `4n - 4`.

4. **`+1`** → Step 4 (return statement).

---

#### Putting it together:
- **Best case:**  
  `2 (init) + (2n-2) (loop control) + (2n-2) (comparisons only) + 1 (return)`  
  → `4n - 1`.

- **Worst case:**  
  `2 (init) + (2n-2) (loop control) + (4n-4) (comparisons + updates) + 1 (return)`  
  → `6n - 3`.
 
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


## 📘 Remember: What is the distributive property?

In basic algebra, there is a rule that says:

$ a \cdot (b + c) = a \cdot b + a \cdot c $

and in the case of subtraction:

$ a \cdot (b - c) = a \cdot b - a \cdot c $

This rule is called the **distributive property of multiplication over addition or subtraction**.  
The name comes from the fact that the number outside the parentheses is *distributed* to each term inside.

---

## ✔ Applying it to our case

We have:

$ 2(n-1) $

This means **“2 times everything inside the parentheses”**.  
By distributive property:

$ 2(n-1) = 2 \cdot n - 2 \cdot 1 $

$ 2(n-1) = 2n - 2 $

---

## 💡 Concrete example

If $ n = 5 $:  

$ 2(n-1) = 2(5-1) = 2 \cdot 4 = 8 $

And by the expanded form:

$ 2n - 2 = 2 \cdot 5 - 2 = 10 - 2 = 8 $

Both results match. ✔️

---

## 🔗 Connection with the algorithm

In the `array_max` algorithm, whenever we count something that happens **twice per loop iteration**, we multiply 2 by the number of iterations $(n-1)$.  

That’s why we naturally get the term:

$ 2(n-1) = 2n - 2 $

---

## 📚 Suggested reading

If you’d like to refresh this basic algebra topic, check out:

- Any **Middle School / High School Algebra textbook**, chapter on **properties of multiplication**.  
- A quick online reference: [Khan Academy — Distributive property](https://www.khanacademy.org/math/algebra/x2f8bb11595b61c86:expanding/x2f8bb11595b61c86:distributive-property/v/distributive-property-over-multiplication) 

---

# Now let's take a look at Growth Rates

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

![](/assets/images/math-01.png)

- Example: `2n + 10 ∈ O(n)` (choose `c=3, n₀=10`).  

### Reminders
- “f(n) = O(g(n))” means **membership**, not equality.  
- Constants and small terms are ignored.  
- Ex: `10n² + 10 log n = O(n²)`.  

## Why do we use **Big-O as an Upper Bound**?

### 1. Big-O notation definition
Big-O describes a **function’s growth rate up to a constant factor**.  
By definition:  

$f(n) = O(g(n))$ means there exist constants $c > 0$ and $n_0 \geq 1$ such that:  

$ f(n) \leq c \cdot g(n), \quad \forall n \geq n_0 $

→ So, mathematically, **Big-O is an upper bound** on the function’s growth.  

---

### 2. Worst-case performance in algorithms
In algorithm analysis, we usually care about the **maximum cost** the algorithm could take for input size $n$, because:  
- It guarantees performance under *any* input.  
- It avoids surprises in real systems (e.g., when input is adversarial).  
- It gives a safe, universal limit.  

**Example:**  
- In linear search, the number of comparisons is at most $n$.  
- We write this as $T(n) = O(n)$, an **upper bound** that covers every possible case.  

---

### 3. Why not use exact formulas instead?
- Exact formulas like $T(n) = 6n - 1$ are too detailed.  
- Constants ($6$ and $-1$) depend on implementation and hardware.  
- But growth rate (linear, quadratic, logarithmic) is **intrinsic** to the algorithm.  

Big-O strips away noise and keeps only the **asymptotic ceiling**.  

---

### 4. Analogy (for intuition)
Think of Big-O like a **speed limit** sign:  
- If the limit is 100 km/h, it doesn’t matter whether you drive 60, 80, or 95 km/h.  
- What matters is: you’ll *never* exceed 100 km/h.  
- Similarly, saying $T(n) = O(n)$ means the algorithm’s cost will *never grow faster than linear*.  


We use **Big-O as an upper bound** because it:
- Guarantees safety (worst-case performance).  
- Ignores machine-specific constants.  
- Captures the essential growth rate of algorithms.  




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

A **polynomial function** is any function that can be written as:

$ f(n) = a_k n^k + a_{k-1} n^{k-1} + \dots + a_1 n + a_0 $

where:
- $a_k, a_{k-1}, \dots, a_0$ are constants (coefficients),
- $k$ is a non-negative integer (the **degree** of the polynomial),
- $n$ is the variable (typically the input size).

### Examples
- Linear: $f(n) = 3n + 2$  
- Quadratic: $f(n) = 5n^2 + 7n + 1$  
- Cubic: $f(n) = n^3 + 4n^2$  
- General: $O(n^k)$  

---

## Polynomial Hierarchy

When we study algorithm complexity, we compare **growth rates** of functions.  
For polynomials, the **highest-degree term dominates** as $n$ grows large.

### Example
- $f(n) = n^3 + 100n^2 + 50n + 7$  
  → For large $n$, the $n^3$ term dominates.  
  → So we say $f(n) = O(n^3)$.  

---

### Hierarchy (in order of growth)

For large $n$:

$1 \;<\; \log n \;<\; n \;<\; n \log n \;<\; n^2 \;<\; n^3 \;<\; \dots \;<\; n^k \;<\; 2^n \;<\; n!$

Within the **polynomial family**:
- Degree 1 (linear) grows slower than degree 2 (quadratic).  
- Quadratic grows slower than cubic.  
- In general: $n^a = o(n^b)$ whenever $a < b$.  

This ordering is called the **polynomial hierarchy**.  

---

## Why polynomial functions are important in algorithms?

- Many efficient algorithms run in **polynomial time** (e.g., $O(n)$, $O(n^2)$, $O(n^3)$).  
- If an algorithm runs in **exponential time** ($O(2^n)$, $O(n!)$), it quickly becomes infeasible.  
- That’s why complexity theory often distinguishes:  
  - **Polynomial-time algorithms** → considered efficient.  
  - **Super-polynomial / exponential-time algorithms** → considered intractable. 
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

## Why Bounds (UB and LB) Are Relevant

When analyzing problems and algorithms, we care about both **what is achievable** and **what is unavoidable**.  
That’s where **upper bounds (UB)** and **lower bounds (LB)** come in.

---

### Upper Bound (UB)
- **Definition:** The complexity of the *best known algorithm* that solves the problem.  
- **Interpretation:** It shows what we *can currently achieve* with our knowledge.  
- **Example:**  
  - For sorting, MergeSort runs in $O(n \log n)$ → this is an **upper bound**.  
  - It means: *we have an algorithm that guarantees this performance*.  

---

### Lower Bound (LB)
- **Definition:** A theoretical minimum complexity that *any algorithm* must respect.  
- **Interpretation:** It shows what is *impossible to beat*, no matter how clever the algorithm.  
- **Example:**  
  - Comparison-based sorting has a **lower bound** of $\Omega(n \log n)$.  
  - This means: *no algorithm can sort faster than $n \log n$ using only comparisons*.  

---

### Why both matter (UB and LB)
- **If UB = LB** → we know the exact complexity of the problem.  
  - Example: Sorting with comparisons → $\Theta(n \log n)$.  
- **If UB > LB** → there is a **gap**.  
  - Maybe better algorithms exist, or maybe we don’t know the true limits yet.  
- **Research frontier:** Closing this gap is one of the main goals in theoretical computer science.  

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
