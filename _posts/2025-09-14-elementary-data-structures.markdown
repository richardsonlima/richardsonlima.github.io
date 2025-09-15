---
layout: post
title: "Elementary Data Structures: Stacks, Queues, and Trees"
date: 2025-09-14
categories: [algorithms, data-structures, computer-science, computer-engineering]
tags: featured
image: /assets/article_images/liana-s-CbCifdZDr0U-unsplash.jpg
mathjax: true
---

> In our previous explorations, we studied algorithmic growth rates, induction, and recursion. Now we open the next chapter: **elementary data structures**, the building blocks of computation.

---

## 1. Static vs Dynamic Allocation

Variables can be allocated either **statically** (address determined at compile time) or **dynamically** (address assigned during execution, usually from the heap).

- **Static allocation**: efficient, fixed during the entire program run.  
- **Dynamic allocation**: flexible, requires memory management, typically accessed through pointers.

Indexing in arrays has constant-time access:  

$$ @A[i] = @A + (i - low) \cdot sizeof(A[1]) $$

---

## 2. Abstract Data Types (ADTs)

An ADT is defined by its **operations**, independent of its implementation.

Examples of operations:
- Insert
- Remove
- Find min or max
- Search

The choice of data structure directly influences performance.

---

## 3. Stacks (LIFO)

A **stack** is a structure where the last inserted element is the first removed (Last-In, First-Out).

Operations:
- `push(x)` – insert element at the top
- `pop()` – remove the top element
- `top()` – read the top without removing
- `isEmpty()` – check if empty

### Example in Python

```python
class Stack:
    def __init__(self):
        self.data = []

    def push(self, x):
        self.data.append(x)

    def pop(self):
        return self.data.pop() if not self.is_empty() else None

    def top(self):
        return self.data[-1] if not self.is_empty() else None

    def is_empty(self):
        return len(self.data) == 0
```

**Applications**: expression parsing, undo functionality, function call stacks.

---

## 4. Queues (FIFO)

A **queue** is a structure where the first inserted element is the first removed (First-In, First-Out).

Operations:
- `enqueue(x)` – insert element at the rear
- `dequeue()` – remove element from the front
- `first()` – read the front without removing

### Example in Python

```python
class Queue:
    def __init__(self):
        self.data = []

    def enqueue(self, x):
        self.data.append(x)

    def dequeue(self):
        return self.data.pop(0) if not self.is_empty() else None

    def first(self):
        return self.data[0] if not self.is_empty() else None

    def is_empty(self):
        return len(self.data) == 0
```

**Applications**: job scheduling, network packet handling, printer queues.

---

## 5. Double-Ended Queues (Deque)

A **deque** allows insertion and removal at both ends.  
In Python, it is efficiently implemented in the `collections` library:

```python
from collections import deque

dq = deque()
dq.append(10)      # insert at right
dq.appendleft(5)   # insert at left
dq.pop()           # remove from right
dq.popleft()       # remove from left
```

Deques simulate both stacks and queues.

---

## 6. Trees: The First Encounter

A **tree** is a hierarchical data structure consisting of nodes.  
- Each node may have children.  
- The **root** is the unique node without a parent.  
- **Leaves** are nodes without children.  

Special cases:
- **Binary tree**: each node has at most 2 children.  
- **Complete binary tree**: all levels filled except possibly the last, filled left to right.

Applications: parsing expressions, file systems, decision trees.

---

## 7. Efficiency of Operations

- Stack operations: $$ \Theta(1) $$  
- Queue operations with array (circular): $$ \Theta(1) $$  
- Search in stack or queue: $$ \Theta(n) $$  
- Tree search: typically $$ \Theta(\log n) $$ if balanced.

This efficiency landscape prepares us for **AVL trees, heaps, and priority queues**.

---

## 8. Philosophical Interlude

Think of these structures as **musical forms**:

- The **stack** is like jazz improvisation: the last note played is the first to return in the solo.  
- The **queue** is a classical symphony: every instrument enters in the correct order.  
- The **deque** is baroque polyphony: themes enter from both sides, weaving symmetry.

Data structures are more than code: they are metaphors for organizing thought.

---

## 9. Exercises and Challenges

1. Implement a stack in C using dynamic memory (pointers).  
2. Implement a queue using a circular buffer.  
3. Use a stack to check if parentheses in an expression are balanced.  
4. Write a program that simulates a bank queue with arrival and service times.  
5. Compare the time complexity of queue implementations: linked list vs circular array.  
6. Extend the deque to support efficient search.  
7. Prove by induction that a complete binary tree with $$ n = 2^k $$ leaves has height $$ k = \log_2 n $$

---

## Beyond the Algorithm

Stacks, queues, and trees appear simple, yet they are **hidden engines** behind compilers, operating systems, and databases.  
Understanding them is to understand the heartbeat of computation.

The next step will be **balanced trees (AVL, Red-Black, B-Trees)**, where structure and symmetry ensure efficiency.  

---

## Bibliography

- [Aulas de P. Feofiloff (IME/USP): Análise de Algoritmos](http://www.ime.usp.br/~pf/analise_de_algoritmos/lectures.html)  
- [ITA – Estruturas de Dados e Algoritmos](http://www.comp.ita.br/~alonso/ensino.html)  
- Cormen, T.H., Leiserson, C.E., Rivest, R.L., Stein, C. *Introduction to Algorithms*. MIT Press.  
- Knuth, D.E. *The Art of Computer Programming, Vol. 1–3*. Addison-Wesley.  

