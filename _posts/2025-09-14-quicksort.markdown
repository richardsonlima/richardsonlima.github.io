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

Given an array \(A[p..r]\), rearrange it into nondecreasing order. Quicksort follows divide and conquer:

1. Partition \(A[p..r]\) around a pivot \(x\).
2. Recursively sort the left part and the right part.
3. Do nothing to combine. The partition ensures every element on the left is \(\le x\) and every element on the right is \(> x\).

Formally, after partition returns an index \(q\), we want

\[A[p..q-1] \le A[q] < A[q+1..r].\]

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

- \(A[p..i] \le x\)
- \(A[i+1..j-1] > x\)
- \(A[r] = x\)

At exit the swap places the pivot at \(i+1\), which yields \(A[p..i] \le A[i+1] < A[i+2..r]\). The loop runs \(n-1\) comparisons where \(n = r - p + 1\), so the partition cost is \(\Theta(n)\).

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

This scheme returns an index \(j\) such that \(A[p..j] \le x \le A[j+1..r]\). Recursive calls become \(\text{quicksort}(p, j)\) and \(\text{quicksort}(j+1, r)\). It performs fewer swaps and handles equal keys gracefully.

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

Partition gives us an index that separates small from large elements. Assume recursively that the left and right calls sort their subarrays. Since every element on the left is \(\le A[q]\) and every element on the right is \(> A[q]\), and the pivot is in its final place, the entire array becomes sorted. The induction is on subarray length.

## Cost models and recurrences

Let \(C(n)\) be the number of comparisons for an input of size \(n\). Each partition performs \(n-1\) comparisons. The split sizes determine the recurrence.

### Worst case

Unbalanced split with sizes \(0\) and \(n-1\) at every step:

\[C_{\text{worst}}(n) = C_{\text{worst}}(n-1) + (n-1).\]

Unrolling yields

\[C_{\text{worst}}(n) = \sum_{k=1}^{n-1} k = \frac{n(n-1)}{2} = \Theta(n^2).\]

This happens if the pivot is always the minimum or maximum, or if the input is already sorted and we always pick the last element as pivot.

### Best case

Balanced split around the pivot, sizes about \(\lfloor \tfrac{n-1}{2} \rfloor\) and \(\lceil \tfrac{n-1}{2} \rceil\):

\[C_{\text{best}}(n) = C_{\text{best}}\!\left(\left\lceil\tfrac{n-1}{2}\right\rceil\right) + C_{\text{best}}\!\left(\left\lfloor\tfrac{n-1}{2}\right\rfloor\right) + (n-1).\]

This solves to \(\Theta(n \log n)\). A standard way is to compare against the master-style recurrence \(S(n) = 2S(n/2) + n\), which gives \(S(n) = \Theta(n\log n)\).

### Randomized Quicksort, expected cost

Pick the pivot uniformly at random at each partition. For distinct keys, the expected number of comparisons satisfies

\[E[n] = \sum_{1 \le i < j \le n} \Pr\{\text{elements } i \text{ and } j \text{ are compared}\}.\]

A key fact is that a pair \((i,j)\) is compared if and only if one of them is chosen as the first pivot among the elements with ranks in \([i..j]\). That happens with probability

\[\Pr\{i \text{ compared with } j\} = \frac{2}{j - i + 1}.\]

Therefore

\[E[n] = \sum_{1 \le i < j \le n} \frac{2}{j - i + 1} = \Theta(n \log n).\]

This matches the best case in order, with a slightly larger constant.

**Mini recap.** Partition is linear. Worst case is quadratic. Balanced or randomized splits give linearithmic behavior.

## Engineering details that matter

- Use insertion sort for tiny subarrays, for example when the recursion depth makes \(n \le 16\). This reduces constant factors.
- Tail recursion elimination keeps stack depth at \(\mathcal{O}(\log n)\) even in adversarial patterns: always recurse on the smaller side and loop on the larger.
- Three-way partition helps with many equal keys, reducing the comparisons that sit on the boundary.

### Tail recursion elimination pattern

```python
def quicksort_tail(A, p=0, r=None):
    if r is None:
        r = len(A) - 1
    while p < r:
        q = partition_lomuto(A, p, r)
        # Recurse on the smaller side to bound stack depth
        if q - 1 - p < r - (q + 1):
            quicksort_tail(A, p, q - 1)
            p = q + 1
        else:
            quicksort_tail(A, q + 1, r)
            r = q - 1
```

Stack depth becomes \(\mathcal{O}(\log n)\) in the common case and remains bounded by \(\mathcal{O}(n)\) in the pathological one. With randomized pivots the expected depth is \(\Theta(\log n)\).

## Worked example

Let \(A = [1,3,6,2,8,5,7,4]\). A first partition with pivot \(4\) produces

\[[1,3,2] \; 4 \; [8,5,7,6]].\]

After recursive calls and tiny partitions, we reach the sorted array. Counting only the partition comparisons, this trace totals 13 comparisons.

## From algorithms to metaphor

Think of the pivot as a musical tempo. Too slow or too fast and the ensemble struggles. When each section balances the others, the piece unfolds naturally. Randomness plays the role of a jazz improviser that avoids getting stuck in a rigid groove, yet keeps the harmony intact.

## Exercises and challenges

1. **Partition invariants.** Prove the Lomuto invariant listed above by induction on the loop iterations.
2. **Plug the worst case.** For inputs that are strictly increasing and pivot = last element, show that the recurrence above indeed unfolds into \(\Theta(n^2)\).
3. **Expected comparisons.** Derive the probability \(2/(j-i+1)\) that two ranks \(i<j\) are compared in randomized quicksort.
4. **Tail recursion discipline.** Modify `quicksort_tail` so that it works with Hoare partition. Be careful with the returned split index.
5. **Equal keys.** Implement a three way partition that groups `< pivot`, `== pivot`, `> pivot` in one pass. Argue why this helps when many keys are equal.
6. **1024 elements.** Using the best case bound, estimate the number of comparisons for \(n = 1024\). Now estimate the expected number for the randomized version. Compare constants in your implementation with a quick experiment.
7. **Stability.** Is quicksort stable? If not, outline a stable variant and analyze its extra memory and time cost.

## References and further reading

- Paulo Feofiloff, *Ordenação: Quicksort* (IME USP). Accessed for partition invariants and case analyses. <span class="cite">[Portuguese]</span>  
  Source: https://www.ime.usp.br/~pf/analise_de_algoritmos/aulas/quick.html
- C. A. R. Hoare, *Quicksort*, The Computer Journal 5(1):10–16, 1962. Classic paper proposing quicksort and its partition idea.  
  Open copy: University of Miami mirror (PDF).
- MIT OpenCourseWare, *Design and Analysis of Algorithms* 6.046J, lectures on Quicksort and randomized algorithms, with notes and videos.
- Avrim Blum, *Probabilistic Analysis and Randomized Quicksort*. CMU lecture notes with a clean derivation of expected comparisons.
- Wikipedia, *Quicksort*. Useful for quick checks on variants and properties.
