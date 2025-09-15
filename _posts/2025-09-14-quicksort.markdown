---
layout: post
title: "Quicksort, Partition Invariants, and the Music of Randomness"
date: 2025-09-14
categories: [Algorithms, Sorting]
tags: featured
image: /assets/article_images/liana-s-CbCifdZDr0U-unsplash.jpg
mathjax: true
---

> Quicksort is the study of how a single decision, the pivot, sculpts an entire computation. Choose well and you glide with logarithmic grace. Choose poorly and you fight a quadratic headwind. In practice, with a bit of randomness, it sings near the theoretical best.

This post continues our series:
- Post #1: growth rates and Big-O.
- Post #2: induction, recursion, and recurrences.
- Post #3: sorting and data structures. Today we focus on Quicksort.

Along the way we will prove correctness from invariants, solve recurrences for best and worst cases, and compute the expected comparisons for the randomized version. We will also compare two classic partition schemes.

## Problem statement

Given an array $A[p..r]$, rearrange it into nondecreasing order. Quicksort follows divide and conquer:

1. Partition $A[p..r]$ around a pivot $x$.
2. Recursively sort the left part and the right part.
3. Do nothing to combine. The partition ensures every element on the left is $\le x$ and every element on the right is $> x$.

Formally, after partition returns an index $q$, we want

$$
A[p..q-1] \le A[q] < A[q+1..r].
$$

Empty subarrays are allowed.

## Two partition schemes, one idea

### Lomuto partition (simple, easy to teach)

```python
def partition_lomuto(A, p, r):
    x = A[r]                  # pivot
    i = p - 1
    for j in range(p, r):     # j scans [p..r-1]
        if A[j] <= x:
            i += 1
            A[i], A[j] = A[j], A[i]
    A[i+1], A[r] = A[r], A[i+1]
    return i + 1
```

**Invariant at the start of each loop iteration**:

- $A[p..i] \le x$
- $A[i+1..j-1] > x$
- $A[r] = x$

At exit the swap places the pivot at $i+1$, which yields $A[p..i] \le A[i+1] < A[i+2..r]$. The loop runs $n-1$ comparisons where $n = r - p + 1$, so the partition cost is $\Theta(n)$.

### Hoare partition (original, faster in practice for many inputs)

```python
def partition_hoare(A, p, r):
    x = A[(p + r) // 2]       # choose a middle element as pivot reference
    i, j = p - 1, r + 1
    while True:
        j -= 1
        while A[j] > x:
            j -= 1
        i += 1
        while A[i] < x:
            i += 1
        if i < j:
            A[i], A[j] = A[j], A[i]
        else:
            return j
```

This scheme returns an index $j$ such that $A[p..j] \le x \le A[j+1..r]$. Recursive calls become $	ext{quicksort}(p, j)$ and $	ext{quicksort}(j+1, r)$. It performs fewer swaps and handles equal keys gracefully.

> Practical tip: pick a pivot carefully. Common choices are last element, middle element, median of three, or a random element. For robust performance, random is the default of choice.

## Quicksort in full

```python
def quicksort(A, p=0, r=None, *, partition=partition_lomuto):
    if r is None:
        r = len(A) - 1
    if p < r:                     # allow empty intervals
        q = partition(A, p, r)
        if partition is partition_hoare:
            # Hoare returns a split index j where left is [p..q] and right is [q+1..r]
            quicksort(A, p, q, partition=partition)
            quicksort(A, q + 1, r, partition=partition)
        else:
            # Lomuto returns pivot position q, left is [p..q-1], right is [q+1..r]
            quicksort(A, p, q - 1, partition=partition)
            quicksort(A, q + 1, r, partition=partition)
```

## Correctness by invariant and induction

Partition gives us an index that separates small from large elements. Assume recursively that the left and right calls sort their subarrays. Since every element on the left is $\le A[q]$ and every element on the right is $> A[q]$, and the pivot is in its final place, the entire array becomes sorted. The induction is on subarray length.

## Cost models and recurrences

Let $C(n)$ be the number of comparisons for an input of size $n$. Each partition performs $(n-1)$ comparisons. The split sizes determine the recurrence.

### Worst case

Unbalanced split with sizes $0$ and $n-1$ at every step:

$$
C_{	ext{worst}}(n) = C_{	ext{worst}}(n-1) + (n-1).
$$

Unrolling yields

$$
C_{	ext{worst}}(n) = \sum_{k=1}^{n-1} k = \frac{n(n-1)}{2} = \Theta(n^2).
$$

This happens if the pivot is always the minimum or maximum, or if the input is already sorted and we always pick the last element as pivot.

### Best case

Balanced split around the pivot, sizes about $\lfloor 	\frac{n-1}{2} 
floor$ and $\lceil 	\frac{n-1}{2} 
ceil$:

$$
C_{\text{best}}(n) = C_{\text{best}}(\lceil \tfrac{n-1}{2} \rceil) 
+ C_{\text{best}}(\lfloor \tfrac{n-1}{2} \rfloor) + (n-1).
$$

This solves to $\Theta(n \log n)$.  
A standard way is to compare against the master-style recurrence

$$
S(n) = 2S\!\left(	\frac{n}{2}\right) + n,
$$

which gives $S(n) = \Theta(n \log n)$.

### Randomized Quicksort, expected cost

Pick the pivot uniformly at random at each partition. For distinct keys, the expected number of comparisons satisfies

$$
E[n] = \sum_{1 \le i < j \le n} \Pr\{	ext{elements } i 	ext{ and } j 	ext{ are compared}\}.
$$

A key fact is that a pair $(i,j)$ is compared if and only if one of them is chosen as the first pivot among the elements with ranks in $[i..j]$. That happens with probability

$$
\Pr\{i 	ext{ compared with } j\} = \frac{2}{j - i + 1}.
$$

Therefore,

$$
E[n] = \sum_{1 \le i < j \le n} \frac{2}{j - i + 1} = \Theta(n \log n).
$$

This matches the best case in order, with a slightly larger constant.

---

**Mini recap:** Partition is linear. Worst case is quadratic. Balanced or randomized splits give linearithmic behavior.

## References and further reading

- Paulo Feofiloff, *Ordenação: Quicksort* (IME USP). Accessed for partition invariants and case analyses. <span class="cite">[Portuguese]</span>  
  Source: https://www.ime.usp.br/~pf/analise_de_algoritmos/aulas/quick.html
- C. A. R. Hoare, *Quicksort*, The Computer Journal 5(1):10–16, 1962. Classic paper proposing quicksort and its partition idea.  
  Open copy: University of Miami mirror (PDF).
- MIT OpenCourseWare, *Design and Analysis of Algorithms* 6.046J, lectures on Quicksort and randomized algorithms, with notes and videos.
- Avrim Blum, *Probabilistic Analysis and Randomized Quicksort*. CMU lecture notes with a clean derivation of expected comparisons.
- Wikipedia, *Quicksort*. Useful for quick checks on variants and properties.
