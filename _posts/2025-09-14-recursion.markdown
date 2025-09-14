---
layout: post
title: "Recursive Algorithms: From Intuition to Induction"
date: 2025-09-14
categories: [algorithms, recursion, induction, cs-theory]
tags: featured
mathjax: true
---

> Recursion is one of those ideas that feels magical at first sight. A function that calls itself?  It sounds paradoxical, like a poem writing its own verses. Yet recursion is one of the most natural ways to express problems in computer science, and its foundation lies deeply connected with **mathematical induction**.

This post will take you from zero understanding to the point where you can grab the back of an envelope and sketch a recursive algorithm.  

---

## 1. What is recursion?

In natural language, recursion is simply **defining something in terms of itself**.  

Think of the classic factorial function, $n!$:

- Base: $0! = 1$  
- Recursive step: $n! = n \times (n-1)!$  

If you were to describe this in plain pseudocode:

```
factorial(n):
    if n == 0:
        return 1
    else:
        return n * factorial(n-1)
```

The function calls itself with a smaller input, until it reaches the base case.

---

## 2. First steps: examples in code

### Factorial in Python
```python
def factorial(n):
    if n == 0:
        return 1
    return n * factorial(n-1)

print(factorial(5))  # 120
```

### Factorial in C
```c
int factorial(int n) {
    if (n == 0) return 1;
    return n * factorial(n - 1);
}
```

### Sum of natural numbers
```
sum(n):
    if n == 1:
        return 1
    else:
        return n + sum(n-1)
```

### Fibonacci sequence
```python
def fib(n):
    if n == 0 or n == 1:
        return 1
    return fib(n-1) + fib(n-2)
```

Recursion lets us express problems in a way that mirrors their mathematical definition.

---

## 3. The hidden mechanism: the call stack

When a recursive function calls itself, the current state is suspended and stored in memory (the **call stack**).  

For `factorial(4)`, the calls expand like stacked dishes:

```
factorial(4)
 -> 4 * factorial(3)
        -> 3 * factorial(2)
                -> 2 * factorial(1)
                        -> 1
```

The stack unwinds back upwards, multiplying the results.

This mechanism is universal: all recursive functions rely on the system stack (or a manually implemented stack in iterative equivalents).

---

## 4. Recursion and mathematical induction

At first glance, induction is a proof technique and recursion is programming.  
But they are the **same pattern**:

- **Induction**:  
  - Base case: prove $P(0)$ or $P(1)$ is true.  
  - Inductive step: if $P(k)$ is true, then $P(k+1)$ is true.  

- **Recursion**:  
  - Base case: directly solve the simplest input.  
  - Recursive step: solve the larger input using the smaller one.  

Both rely on the domino effect: if the first falls, all the others will follow.  

For example, proving that  

$$1 + 2 + \dots + n = \frac{n(n+1)}{2}$$  

by induction is structurally identical to writing:

```python
def sum_to_n(n):
    if n == 1:
        return 1
    return n + sum_to_n(n-1)
```

Induction proves correctness; recursion implements it.

---

## 5. Why use recursion?

- **Clarity of expression**: recursive definitions often mirror the natural structure of a problem.  
- **Divide and conquer**: break a big problem into smaller, similar subproblems.  
- **Implicit stack management**: recursion delegates control flow to the language runtime.  

Not all recursive solutions are efficient (the naïve Fibonacci is exponential), but many algorithms are beautifully simple and correct thanks to recursion.

---

## 6. Where recursion lives today

Recursion is everywhere, sometimes hidden beneath abstraction layers:

- **Binary search**: divide a sorted array in half, recursively search one half.  
- **MergeSort and QuickSort**: recursive sorting algorithms.  
- **Graph algorithms**: depth-first search (DFS), Tarjan’s strongly connected components.  
- **Compilers**: recursive descent parsers interpret programming languages.  
- **Operating systems and AI**: recursive tree traversal, backtracking, minimax in games.  

Even when you use a modern library call, chances are there’s recursion hidden under the hood.

---

## 7. Challenge: recursion on the back of a napkin

Now it’s your turn. Without looking back, try to write **any recursive algorithm** in natural code:

- In words:  
  “If $n = 0$, return 1. Otherwise, return $n$ times the factorial of $n-1$.”  

- In Python:
  ```python
  def f(n):
      if n == 0: return 1
      return n * f(n-1)
  ```

- In C:
  ```c
  int f(int n) {
      if (n == 0) return 1;
      return n * f(n-1);
  }
  ```

If you can do this, recursion is yours forever.

---

## Beyond the Algorithm

Recursion is not just a programming trick; it is a reflection of how patterns repeat in mathematics, music, and nature.  
A fractal coastline, a Bach fugue, the self-similarity of galaxies: all are recursive structures.  

Mathematical induction gives us certainty, recursion gives us expression, and together they let us model infinite processes with finite rules.  

Once you see recursion, you start noticing it everywhere  in algorithms, in proofs, and even in life’s repeating cycles.

---

## Exercises

1. Write a recursive function that computes the product of two numbers using only addition.  
2. Implement binary search both recursively and iteratively. Compare their complexity.  
3. Prove by induction that the recursive Fibonacci algorithm makes $2^n$ calls in the worst case.  
4. Explore tail recursion: rewrite factorial so that it does not grow the stack.  

---

## References

- T.H. Cormen, C.E. Leiserson, R.L. Rivest, C. Stein. *Introduction to Algorithms*.  
- Knuth, D.E. *The Art of Computer Programming*.  
- [USP Algorithm Course](https://www.ime.usp.br/~pf/analise_de_algoritmos/)  
- [ITA Teaching Material](http://www.comp.ita.br/~alonso/ensino.html)  
- [MIT OpenCourseWare – Algorithms](https://ocw.mit.edu/courses/)