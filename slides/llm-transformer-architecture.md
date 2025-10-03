---
layout: slide
title: "Attention Is All You Need: The Transformer Architecture Revolution"
author: Richardson Lima 
date: 2025-10-03
---

class: center, middle, inverse-slide

# Attention Is All You Need
## The LLM Revolution That Changed AI Forever

.footnote[Based on the seminal paper by Vaswani et al. (2017)]

---

## The Pre-Transformer Era

- **RNNs/LSTMs** dominated sequence processing
- **Sequential processing** limited parallelization
- **Long-range dependency** problems
- Inefficient computation for long sequences

> "The fundamental constraint of sequential computation remains."

---

class: middle, inverse-slide

## What If We Told You...
### .blue-text[Attention Is All You Need]? 🤔

---

## The Core Idea

**Architecture based solely on attention mechanisms:**
- No recurrence
- No convolutions  
- Only self-attention and feed-forward networks

**Results:**
- Better parallelization
- Faster training
- State-of-the-art translation quality

---

## Transformer Architecture

.left-column[
### Core Components
- Encoder Stack
- Decoder Stack
- Multi-Head Attention
- Positional Encoding  
- Feed-Forward Networks
]

.right-column[
![Transformer Architecture](https://raw.githubusercontent.com/tensorflow/docs/master/site/en/tutorials/text/images/transformer.png)
*The Transformer model architecture*
]

---

## Self-Attention: The Heart of Transformer

**Scaled Dot-Product Attention:**
```python
Attention(Q, K, V) = softmax(QKᵀ/√dₖ)V
```

Advantages:

Connects all positions with constant operations
Captures global dependencies immediately
Highly parallelizable
Multi-Head Attention

Why multiple heads?

```python
MultiHead(Q, K, V) = Concat(head₁, ..., headₕ)Wᵒ
where headᵢ = Attention(QWᵢᵒ, KWᵢᴷ, VWᵢⱽ)
```

Benefits:

Attends to different representation subspaces
Captures various syntactic/semantic relationships
h = 8 heads in original paper
Positional Encoding

Problem: No recurrence → no order information

Solution: Sinusoidal positional encodings:

```python
PE(pos, 2i) = sin(pos/10000^(2i/d_model))
PE(pos, 2i+1) = cos(pos/10000^(2i/d_model))
```
Why it works:

Allows extrapolation to longer sequences
Linear representation for relative positions
Why Self-Attention?

.center[

Layer Type	Complexity per Layer	Sequential Operations	Maximum Path Length
Self-Attention	O(n²·d)	O(1)	O(1)
Recurrent	O(n·d²)	O(n)	O(n)
Convolutional	O(k·n·d²)	O(1)	O(logₖ(n))
]			
.footnote[Table from Vaswani et al. (2017)]

.left-column[
## Groundbreaking Results
### WMT 2014 English-German:
]
- 28.4 BLEU - new state-of-the-art
- 2.0 BLEU improvement over previous best
### WMT 2014 English-French:
- 41.8 BLEU - best single model
- Training: 3.5 days on 8 GPUs
### Efficiency:
- 12 hours for base model vs. weeks for previous models


.left-column[
## Generalization to Other Tasks
### English Constituency Parsing:
- WSJ only: 91.3 F1
- Semi-supervised: 92.7 F1
- Outperforms most previous parsers
### Proof of concept:
- General architecture for sequence transduction
- Applicable beyond machine translation

.left-column[
## Why This Matters
### NLP Revolution:
]

- Foundation for BERT, GPT, T5, and other LLMs
- Paradigm shift in deep learning architectures
- Enables unprecedented model scaling

### Practical Impact:
- Faster, more efficient training
- Better quality across multiple tasks
- More interpretable architecture

.left-column[
## Attention Visualizations
.center[
https://i.imgur.com/KndVxe1.png
Example of attention heads capturing long-range dependencies
  ]
]

### Interpretability:
- Attention heads learn specific tasks
- Visible syntactic and semantic patterns
- Anaphora resolution, sentence structure


.left-column[
## Key Innovations
### Technical Breakthroughs:
]
- Scaled dot-product attention
- Multi-head attention mechanism
- Positional encoding without recurrence
- Residual connections and layer normalization

### Engineering Impact:
- Highly parallelizable training
- Efficient inference
- Scalable to large datasets

.left-column[
## Legacy and Evolution
### Foundation Models:
]
- BERT (Bidirectional Encoder)
- GPT series (Generative Pre-training)
- T5 (Text-to-Text Transfer)
- Vision Transformers

## Beyond NLP:
- Computer vision
- Audio processing
- Multimodal learning
- Scientific discovery
- class: middle, inverse-slide

.left-column[
## The Legacy Continues...
]
- Transformers are not just an architecture
- They represent a new paradigm for AI

.left-column[
## Next Steps
### Explore Further:
]
- Modern implementations (Hugging Face, TensorFlow, PyTorch)
- Derived models (BERT, GPT, T5, Vision Transformer)
- Applications beyond text (audio, video, multimodal)
Resources:
[Attention Is All You Need](https://arxiv.org/abs/1706.03762)
[Tensor2Tensor Implementation](https://github.com/tensorflow/tensor2tensor)
[The Annotated Transformer](http://nlp.seas.harvard.edu/2018/04/03/attention.html)

---
class: middle
# Questions?
.footnote[Made with [remark](https://github.com/gnab/remark)]
