---
layout: slides
title: "Graph Theory for ML"
category: "ai-engineering-course-step-01"
module_number: 21
complexity: "Build"
lesson_type: "Build"
lang_stack: "🐍"
use_math: true
---

layout: true
class: basic-layout

---

class: center, middle, inverse-slide
# Step 01 - Math Foundations
## Module 21: Graph Theory for Machine Learning
### _Type: Build · Lang: Python · Time: ~90 minutes_

**Richardson Lima**

---

## O Mapa da Jornada 🗺️

1. Fundamentos e contexto do problema.
2. Intuição operacional do conceito.
3. Tradução matemática para engenharia.
4. Padrões de uso em sistemas de IA.
5. Construção prática com código.
6. Checkpoints para domínio técnico.

---

## Por que isso importa? 🎯

Social networks, molecules, knowledge bases, citation networks, road maps -- all are graphs. Traditional ML treats data as flat tables. Each row is independent. Each feature is a column. But when the structure of connections matters, tables fail.

Consider a social network. You want to predict what product a user will buy. Their purchase history matters. But their friends' purchase history matters more. The connections carry signal.

---

## Objetivos de Aprendizagem ✅

- Build a graph class with adjacency matrix/list representations and implement BFS and DFS traversals
- Compute the graph Laplacian and use its eigenvalues to detect connected components and cluster nodes
- Implement one round of GNN-style message passing as a normalized adjacency matrix multiplication
- Apply spectral clustering to partition a graph using the Fiedler vector

---

## 🧠 Graphs: Nodes and Edges

A graph G = (V, E) consists of vertices (nodes) V and edges E. Each edge connects two nodes.

**Directed vs undirected.** In an undirected graph, edge (u, v) means u connects to v AND v connects to u. In a directed graph (digraph), edge (u, v) means u points to v, but not necessarily the reverse.

---

## 📐 The Adjacency Matrix

The adjacency matrix A is the core representation. For a graph with n nodes:

For undirected graphs, A is symmetric: A[i][j] = A[j][i]. For weighted graphs, A[i][j] = weight of edge (i, j).

---

## 🔬 Degree

The degree of a node is the number of edges connected to it. For directed graphs, you have in-degree (edges coming in) and out-degree (edges going out).

The degree matrix D is diagonal:

---

## ⚙️ BFS and DFS

The two fundamental graph traversal algorithms. You need both.

**Breadth-First Search (BFS):** Explore all neighbors first, then neighbors' neighbors. Uses a queue (FIFO).

---

## 🧩 The Graph Laplacian

L = D - A. The most important matrix in spectral graph theory.

For the triangle:

---

## 🚀 Spectral Properties

The eigenvalues of the adjacency matrix and Laplacian reveal structural properties without any traversal.

**Spectral clustering** works like this:
1. Compute the Laplacian L
2. Find the k smallest eigenvectors of L (skip the first, which is all-ones for connected graphs)
3. Use those eigenvectors as new coordinates for each node
4. Run k-means on those coordinates

---

## Hands-on Build Path 🛠️

1. Step 1: Graph class from scratch
2. Step 2: BFS and DFS
3. Step 3: Connected components and Laplacian eigenvalues
4. Step 4: Spectral clustering
5. Step 5: Message passing

Prerequisites: Phase 1, Lessons 01-03 (linear algebra, matrices)

---

## Checklist de Domínio 📌

- Eu consigo explicar o conceito sem decorar fórmulas.
- Eu consigo implementar a versão mínima no código.
- Eu consigo conectar o tema com treino/inferência de modelos.
- Eu consigo depurar erros comuns desse tópico.

---

## Fechamento

Este módulo conecta intuição matemática com execução prática.

Próximo passo: avançar para o próximo módulo da trilha e consolidar com exercícios do quiz.

---
