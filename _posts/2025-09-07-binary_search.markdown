---
layout: post
title: "Binary Search: Dividing Knowledge in Half"
date: 2025-09-14
categories: [algorithms, recursion, divide-and-conquer, complexity]
tags: featured
image: /assets/article_images/liana-s-CbCifdZDr0U-unsplash.jpg
mathjax: true
---

> Imagine a long ordered list of **user IDs**. How can we quickly find whether a given ID is in the system? If the list were unordered, the only choice would be to scan all elements a **linear search** with time complexity $O(n)$. But if the list is ordered, a far more elegant tool emerges: **binary search**.

Binary search is not just an algorithm; it is a manifestation of the *divide and conquer* philosophy. Instead of moving step by step, it slices the search space in half at each iteration, as if knowledge itself could be split into smaller, more manageable portions.

---

## The Problem: Search in an Ordered Array

Formally:

> **Problem:** Given an integer $x$ and an ordered array $A[1..n]$ with strictly increasing elements, find the index $j$ such that  
> $$ A[j-1] < x \leq A[j] $$
>  
> with the convention that $A[0] = -\infty$ and $A[n+1] = +\infty$.

This definition covers all cases. For instance, if $x > A[n]$, then the correct answer is $n+1$.

---

## Iterative Binary Search

The iterative version keeps two bounds $p$ and $r$ and narrows the search interval until only one candidate remains.

**Pseudocode:**

```
BinarySearchIterative(A, n, x):
1. p := 0
2. r := n + 1
3. while p < r - 1:
4.     q := ⌊(p + r)/2⌋
5.     if A[q] < x:
6.         p := q
7.     else:
8.         r := q
9. return r
```

**Invariant:**  
At the start of each loop, the condition
$$ A[p] < x \leq A[r] $$
always holds. This guarantees correctness once $p = r-1$.

**Termination:**  
Since $r - p$ strictly decreases in each iteration (because $p < q < r$), the algorithm must terminate.

---

## Example in Python

```python
def binary_search_iterative(A, x):
    p = 0
    r = len(A)
    while p < r - 1:
        q = (p + r) // 2
        if A[q] < x:
            p = q
        else:
            r = q
    return r
```

Test:

```python
A = [101, 205, 307, 412, 503, 610]
print(binary_search_iterative(A, 412))  # 3
print(binary_search_iterative(A, 450))  # 4 (position of insertion)
```

---

## Complexity Analysis (Iterative)

At each step, the interval size $r - p$ is halved. Initially $n$, then $n/2$, then $n/4$, and so on.  
After $k$ iterations, the interval size is at most $n / 2^k$.  
The process ends when this value becomes $1$, i.e.:

$$
\frac{n}{2^k} \leq 1 \quad \Rightarrow \quad k \geq \log_2 n
$$

Thus, the number of iterations is $\Theta(\log n)$.

This logarithmic growth is the reason why binary search remains one of the most efficient algorithms in computer science.

---

## Recursive Binary Search

We can also define binary search recursively, which reveals its natural connection with **mathematical induction**.

**Pseudocode:**

```
BinarySearchRecursive(A, p, r, x):
1. if p == r - 1: 
2.     return r
3. q := ⌊(p + r)/2⌋
4. if A[q] < x:
5.     return BinarySearchRecursive(A, q, r, x)
6. else:
7.     return BinarySearchRecursive(A, p, q, x)
```

**Wrapper:**

```
BinarySearch(A, n, x):
    return BinarySearchRecursive(A, 0, n+1, x)
```

---

## Proof by Induction

Let $P(n)$ denote: *the recursive binary search correctly finds $j$ for an array segment of length $n$.*

- **Base case:** If $r - p = 1$, then the function immediately returns $r$, which is correct since $A[p] < x \leq A[r]$.  
- **Inductive step:** Suppose correctness holds for all segments of length smaller than $r - p$. The algorithm then splits the problem in two:
  - If $A[q] < x$, recurse on $(q, r)$.  
  - Else, recurse on $(p, q)$.  
  In both cases, the new interval is shorter, so the induction hypothesis guarantees correctness.

Thus, by induction, the algorithm is correct for all $n$.

---

## Complexity via Recurrence

Let $T(n)$ be the time for an input of size $n$. Then:

$$
T(n) = T(\lfloor n/2 \rfloor) + c
$$

where $c$ accounts for comparison and arithmetic. Solving:

$$
T(n) = T(n/2) + c \\
= T(n/4) + 2c \\
= \dots = T(1) + c \log_2 n
$$

Hence, $T(n) = \Theta(\log n)$.

---

## Binary Search as Divide and Conquer

Binary search is a pure example of the **Divide and Conquer paradigm**:

- **Divide:** Split the array into two halves.  
- **Conquer:** Recurse into the half that may contain the solution.  
- **Combine:** Trivial — just return the index.

This same idea fuels algorithms like MergeSort, QuickSort, Strassen’s matrix multiplication, and even modern algorithms in number theory and computational geometry.

---

## Exercises for the Reader

1. Prove formally the loop invariant of the iterative binary search.  
2. Show that in the iterative version, the number of comparisons is at least $\lfloor \log n \rfloor$ and at most $\lfloor \log n \rfloor + 1$.  
3. Write an algorithm that uses binary search to insert a new user ID into a sorted array while maintaining order. Analyze its time complexity.  
4. Extend binary search to work on a **semi-compact array** (where differences between consecutive elements are at most 1). Can you still achieve $O(\log n)$ time?  
5. Discuss why **ternary search** (dividing the array into three parts instead of two) does not improve complexity over binary search.

---

## Beyond the Algorithm

Binary search is more than a method: it is a philosophy of exploration.  
Every iteration is a choice not unlike philosophy or science, where we repeatedly split uncertainty until truth emerges.  
From library catalogs to database indexes, from network routing to machine learning models, binary search is the invisible hand that guides systems to clarity in logarithmic time.

Mastering it is like learning to see the invisible symmetry of knowledge: to conquer by dividing.

---

## References

- Paulo Feofiloff, [Análise de Algoritmos – Busca Binária](https://www.ime.usp.br/~pf/analise_de_algoritmos/aulas/binarysearch.html), IME-USP.  
- Cormen, Leiserson, Rivest, Stein. *Introduction to Algorithms*, MIT Press.  
- [ITA – Estruturas de Dados e Análise de Algoritmos (CT234)](http://www.comp.ita.br/~alonso/ensino.html).  
- [Princeton COS226 Algorithms Lectures](https://www.cs.princeton.edu/courses/archive/spr10/cos226/lectures.html).  
- Knuth, Donald E. *The Art of Computer Programming*, Vol. 3: Sorting and Searching.  
