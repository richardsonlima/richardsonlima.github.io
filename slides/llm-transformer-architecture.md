class: center, middle, inverse-slide
## Whispers of Focus: The .transformers-text[Transformer] Architecture as a Symphony of Human Attention
### _Decoding the architecture that mirrored the human mind_
<img src="/assets/article_images/transformer-symphony.jpg" width="150px" style="border-radius: 50%;"/>

.footnote[Inspired by the work of Vaswani et al. (2017)]
---
## This Presentation *Might* Be Enhanced If You're Familiar With
- Neural Network basics (Neurons, Layers)
- Sequence models (RNNs/LSTMs)
- Linear Algebra (Matrix Multiplication)

*But like a good symphony, you can still enjoy the melody without reading the sheet music.*
---
class: middle, inverse-slide
## You’ve built an RNN for your sequence data 🎉🎉🎉
### ... _and it works perfectly, right?_
---
class: middle, inverse-slide
## Well, .purple-text[not exactly] 😬
---
class: middle, inverse-slide
## There are still some .blue-text[bottlenecks] we can't ignore
---
.left-column[
## The RNN Struggle
]
.right-column-middle[
- **Sequential Nature**
    - You must process word $A$ before word $B$
    - No parallelization = Slow training
]
---
.left-column[
## The RNN Struggle
]
.right-column-middle[
- **Vanishing Memories**
    - Distant dependencies get lost in the "fog"
    - The model forgets the beginning of the sentence by the time it reaches the end
]
---
.left-column[
## The RNN Struggle
]
.right-column-middle[
- **Fixed-length context**
    - Trying to squeeze a whole book into a single vector
]
---
class: middle, inverse-slide
## We can solve this by <br> .green-text[eliminating recurrence]
---
class: middle
## Attention is All You Need

> [cite_start]"Attention allows modeling dependencies regardless of distance, akin to how our prefrontal cortex integrates distant memories." [cite: 1]

---
class: middle, inverse-slide
## How does the .transformers-text[Transformer] achieve this?
---
class: middle, inverse-slide
## It treats information as a .blue-text[Dynamic Symphony]
---
.left-column[
## The Architecture
]
.right-column-middle[
- **Encoder Stack**: The Listener. [cite_start]It weaves the input into a rich tapestry of meaning. [cite: 1]
]
---
.left-column[
## The Architecture
]
.right-column-middle[
- **Decoder Stack**: The Speaker. [cite_start]It generates the output note-by-note, while "blindfolded" to the future. [cite: 1]
]
---
.left-column[
## The Architecture
]
.right-column-middle[
- **Positional Encoding**: The Metronome. [cite_start]It injects order using sine and cosine functions. [cite: 1]
]
---
class: middle, inverse-slide
## .green-text[Query] / .blue-text[Key] / .purple-text[Value]
---
.left-column[
## The Mechanism
### Scaled Dot-Product
]
.right-column-middle[
- Think of a classroom:
- **Query**: What am I looking for?
- **Key**: How relevant is this student's answer?
- **Value**: The actual information provided.
<br><br>
[cite_start]$$Attention(Q, K, V) = \text{softmax}\left(\frac{QK^T}{\sqrt{d_k}}\right)V$$ [cite: 1]
]
---
.left-column[
## The Mechanism
### Scaled Dot-Product
### Multi-Head Attention
]
.right-column-middle[
- Why have one listener when you can have eight?
- [cite_start]Some heads focus on grammar (The Librarians). [cite: 1]
- [cite_start]Some heads focus on emotion (The Poets). [cite: 1]
<br><br>
]
---
class: middle, inverse-slide
## Multi-Head Attention is a .purple-text[parallel] process
---
class: middle, inverse-slide
## It allows the model to "see" the entire sequence .green-text[at once]
---
class: center, middle, inverse-slide
<img src="/assets/article_images/rnn-chain.png" width="40%"/>
## Sequential (RNN)
## vs
<img src="/assets/article_images/transformer-web.png" width="40%"/>
## Attentive Web (Transformer)
---
class: middle, inverse-slide
## That's a .green-text[massive boost] in training efficiency
---
.left-column[
## Why it Works
### Parallelization
### Constant Path Length
]
.right-column-middle[
- In self-attention, the distance between any two words is exactly **1**.
- [cite_start]No more "forgetting" the start of the sentence. [cite: 1]
]
---
.left-column[
## Why it Works
### Parallelization
### Constant Path Length
### Philosophical Edge
]
.right-column-middle[
- [cite_start]It mirrors human focus: deciding what matters most in a crowded room. [cite: 1]
]
---
class: middle, inverse-slide
## Now let's see the .red-text[results] 👹
---
.left-column[
## Performance
]
.right-column-middle[
- [cite_start]SOTA BLEU scores for English-to-German and English-to-French. [cite: 1]
- [cite_start]Faster training on 8 GPUs compared to traditional RNN ensembles. [cite: 1]
]
---
.left-column[
## Performance
### Scaling Up
]
.right-column-middle[
- [cite_start]As Ilya Sutskever noted: "Intelligence is an emergent property of scale." [cite: 1]
- The Transformer is the engine that made GPT and Gemini possible.
]
---
class: middle, blue-slide
# What Now?
---
.left-column[
## The Path Ahead
]
.right-column-middle[
- [cite_start]**Read the paper**: "Attention Is All You Need" (Vaswani et al.) [cite: 1]
- [cite_start]**Build your own**: Start with a simple Scaled Dot-Product in Python. [cite: 1]
- [cite_start]**Explore the Philosophy**: How does silicon mimic the "soul" of attention? [cite: 1]
]
---
class: middle
## Just A Thought...
> [cite_start]"If machines attend like humans, what philosophical boundaries blur between silicon and soul?" [cite: 1]
---
class: middle
# Questions?
.footnote[Made with [remark](https://github.com/gnab/remark) | Based on the post "Whispers of Focus"]