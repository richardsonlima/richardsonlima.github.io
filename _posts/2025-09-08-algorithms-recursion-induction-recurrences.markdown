---
layout: post
title:  "From Growth Rates to Recursion"
categories: programming
tags: algorithms complexity recursion induction recurrences
image: /assets/article_images/thomas-t-OPpCbAAKWv8-unsplash.jpg
---

> **Reading order matters.** This post is a direct sequel to our [previous article on growth rates and asymptotic notation](https://www.richardsonlima.com.br/programming/2025/09/08/algorithms-efficiency.html). We’ll use those ideas to *prove properties*, *design recursive algorithms*, and *analyze their running time*.

> **Reading order matters.** This post is a direct sequel to our [previous article on growth rates and asymptotic notation](https://www.richardsonlima.com.br/programming/2025/09/08/algorithms-efficiency.html). We’ll use those ideas to *prove properties*, *design recursive algorithms*, and *analyze their running time*.

---
# TESTE 
This theme supports rendering beautiful math in inline and display modes using [MathJax 3](https://www.mathjax.org/) engine. You just need to surround your math expression with `$$`, like `$$ E = mc^2 $$`. If you leave it inside a paragraph, it will produce an inline expression, just like $$ E = mc^2 $$.

To use display mode, again surround your expression with `$$` and place it as a separate paragraph. Here is an example:

$$
\sum_{k=1}^\infty |\langle x, e_k \rangle|^2 \leq \|x\|^2
$$
# FIM TESTE

# 1. Mathematical Induction: The Foundation of Recursion

Mathematical induction is a proof technique that mirrors the logic of recursion. To prove a proposition $P(n)$ for all $n \geq 0$:

1. **Base Case**: Verify that $P(0)$ or $P(1)$ holds.
2. **Inductive Hypothesis**: Assume $P(k)$ holds for some arbitrary $k$.
3. **Inductive Step**: Prove that $P(k) \implies P(k+1)$.

If both base case and inductive step are satisfied, $P(n)$ holds for all $n$.

### Example: Domino Effect
Imagine a row of dominoes:
- **Base**: The first domino falls.
- **Inductive Step**: If the $k$-th domino falls, then the $(k+1)$-th domino will also fall.
- **Conclusion**: Eventually, all dominoes fall.

### Example: Divisibility
Prove that $x^n - 1$ is divisible by $x - 1$ for $x > 1, n > 0$.
- **Base**: $n = 1$ ⇒ $x^1 - 1$ divisible by $x - 1$.
- **Hypothesis**: Assume $x^k - 1$ divisible by $x - 1$.
- **Step**: $x^{k+1} - 1 = x(x^k - 1) + (x - 1)$, both terms divisible by $x - 1$.
- ✔️ Proven.

---

# 2. Recursive Definitions: Objects Defined by Themselves

Recursion in definitions works just like induction:
- **Base Case**: Define initial objects.
- **Inductive Step**: Define new objects in terms of already defined ones.

### Examples
- **Natural Numbers**:
  - Base: $0 \in \mathbb{N}$.
  - Step: If $n \in \mathbb{N}$, then $n+1 \in \mathbb{N}$.
- **Arithmetic Expressions**:
  - Base: Any number or variable is an expression.
  - Step: If $E_1$ and $E_2$ are expressions, then so are $(E_1+E_2), (E_1-E_2), (E_1*E_2), (E_1/E_2)$.

---

# 3. Recursive Algorithms: Induction in Code

A **recursive algorithm** solves a problem by solving smaller subproblems of the same type.

- **Base Case**: Simple input solved directly.
- **Recursive Step**: Break down the problem, call the algorithm on smaller inputs.

### Example: Factorial

Mathematical definition:

$$n! =
\begin{cases}
1 & \text{if } n = 0 \text{ or } n = 1 \\
n \cdot (n-1)! & \text{if } n > 1
\end{cases}$$

Python implementation:

```python
def factorial(n):
    if n == 0 or n == 1:
        return 1
    return n * factorial(n-1)
```

Execution of `factorial(4)`:
- factorial(4) → 4 * factorial(3)
- factorial(3) → 3 * factorial(2)
- factorial(2) → 2 * factorial(1)
- factorial(1) → 1  
Result = 24

---

# 4. How Recursion Works Internally: The Call Stack

Every recursive call stores:
- Parameters
- Local variables
- Return address

These frames are pushed onto a **stack**. The most recent call is always the first to resume — a LIFO mechanism.

➡️ This is why recursion can always be rewritten iteratively, using an **explicit stack**.

---

# 5. Complexity Analysis of Recursive Algorithms

### Example: Factorial (complexity)

Recurrence: $T(n) = T(n-1) + b, \; T(1) = a$.
Solution: $T(n) = a + (n-1)b = \Theta(n)$.

Iterative factorial:

```python
def factorial_iterative(n):
    f = 1
    while n > 0:
        f *= n
        n -= 1
    return f
```

- Same time complexity: $\Theta(n)$.
- Iterative is slightly faster (less stack overhead).
- Recursive is often clearer and closer to mathematical definition.

---

# 6. Fibonacci: Linear vs Exponential Recursion

Recursive definition:

$$F_0 = F_1 = 1, \quad F_n = F_{n-1} + F_{n-2}$$

Naive recursive code:

```python
def fib(n):
    if n == 0 or n == 1:
        return 1
    return fib(n-1) + fib(n-2)
```

Recurrence:
$T(n) = T(n-1) + T(n-2) + b$
Solution: $T(n) = \Omega(2^{n/2})$ — exponential growth.

Iterative version (linear time):

```python
def fib_iterative(n):
    if n == 0 or n == 1:
        return 1
    f1, f2 = 1, 1
    for _ in range(2, n+1):
        f1, f2 = f2, f1 + f2
    return f2
```

Complexity: $\Theta(n)$.

---

# 7. Towers of Hanoi: Exponential Recursion

Rules:
- Move one disk at a time.
- Never place larger disk on smaller one.

Recursive solution:

```python
def hanoi(n, source, target, auxiliary):
    if n == 1:
        print(f"Move disk from {source} to {target}")
    else:
        hanoi(n-1, source, auxiliary, target)
        print(f"Move disk from {source} to {target}")
        hanoi(n-1, auxiliary, target, source)
```

Recurrence:
$$T(n) = 2T(n-1) + a \implies T(n) = \Theta(2^n)$$

---

# 8. Recurrences and Their Solutions

A **recurrence** describes a function in terms of smaller inputs.

### Example 1

$$T(n) = T(n-1) + 3n + 2, \quad T(1) = 1$$
Solution: $T(n) = \tfrac{3}{2}n^2 + \tfrac{7}{2}n - 4$.

### Example 2

$$G(n) = 2G(n/2) + 7n + 2, \quad G(1)=1$$
Solution: $G(n) = \Theta(n \log n)$.

### Example 3

$$T(n) = 2T(\sqrt{n}) + \log n$$
Solution: $T(n) = \Theta(\log n \cdot \log \log n)$.

---

# 9. When to Use Recursion?

**Advantages**:
- Elegance, clarity, closer to math definitions.
- Natural fit for divide-and-conquer problems.

**Disadvantages**:
- Overhead of function calls and stack usage.
- Sometimes less efficient than iterative equivalents.

Rule of thumb: **Prefer recursion when it improves clarity** and the overhead is acceptable. Use iteration for performance-critical inner loops.

# 10. Exercises for Practice

1. Prove by induction: $n^3 + 2n$ is divisible by 3.
2. Write a recursive algorithm to:
   - Print numbers from 1 to $n$ in increasing order.
   - Print them in decreasing order.
3. Simulate the recursive sum algorithm for $n = 5$, showing the call stack.
4. Solve the recurrence: $T(n) = T(n-1) + n$.
5. Implement recursive and iterative solutions for binary search.
6. Solve the Towers of Hanoi problem for $n = 4$, listing all moves.

---

# Wrapping It Up: From Efficiency to Recursion

In our first post, we focused on **how fast algorithms run** and how to **measure their growth** with Big-O. Now, we connected that with **recursion** and **induction**, two pillars of algorithm design.

- Induction justifies recursion mathematically.  
- Recursion enables elegant algorithmic definitions.  
- Recurrences bridge recursion and complexity analysis.  

Together, they form the backbone of algorithm theory. In upcoming posts, we’ll dive into **data structures** and see how recursion naturally appears in trees and graphs.

🚀 If you mastered the first post, this one extends your toolkit. With both **efficiency** and **recursion** in hand, you are ready to explore the full depth of algorithm design.
In our first post, we focused on **how fast algorithms run** and how to **measure their growth** with Big-O. Now, we connected that with **recursion** and **induction**, two pillars of algorithm design.
