---
layout: slides
title: "Encoder vs. Decoder: Choosing the Right Engine"
category: "ai-tutoring"
module_number: 3
complexity: "Technical / Architectural"
use_math: true
---

layout: true
class: basic-layout
---

class: center, middle, inverse-slide
# The Agentic Path: Módulo 03
## Encoder vs. Decoder
### _Escolhendo o Motor Correto: A Geometria da Visibilidade_

<img src="/assets/article_images/transformer-symphony.jpg" width="150px" style="border-radius: 50%; border: 2px solid #FFD700;"/>

**Richardson Lima**
.footnote[Uma análise comparativa de BERT, GPT e T5]

---

## O Roadmap do Módulo 🗺️

O paper original propôs o Encoder-Decoder. Mas a evolução dividiu a família.

1.  **A Cisma:** Por que os modelos se separaram?
2.  **O Mecanismo Central:** A Máscara de Atenção (Attention Mask).
3.  **Encoders (BERT):** Compreensão Bidirecional.
4.  **Decoders (GPT):** Geração Auto-regressiva.
5.  **Híbridos (T5/BART):** O melhor dos dois mundos?
6.  **Guia de Engenharia:** Qual arquitetura usar para o seu Agente?

---

class: middle, inverse-slide
# Parte 1: A Cisma Arquitetural
### _Tudo se resume a "Quem pode ver Quem"_

---

## 1. O Transformer Original (2017) 🏛️

O modelo de Vaswani et al. foi feito para **Tradução** (Inglês $\to$ Alemão).
Ele tinha duas metades:
1.  **Encoder:** Lia a frase em Inglês (Entendia o contexto).
2.  **Decoder:** Gerava a frase em Alemão (Produzia o futuro).



---

## 2. A Evolução Divergente 🌳

Logo após 2017, pesquisadores perceberam que poderiam usar apenas metades do modelo para tarefas diferentes.

* **2018 (Google):** Criou o **BERT** usando apenas o Encoder. "Vamos focar em *entender* texto."
* **2018 (OpenAI):** Criou o **GPT** usando apenas o Decoder. "Vamos focar em *gerar* texto."

---

## 3. O Segredo Técnico: Visibilidade 👀

A única diferença real entre Encoder e Decoder (além da Cross-Attention) é a **Máscara de Atenção**.

Ela define quais tokens um determinado token pode "olhar" durante o cálculo do Self-Attention.

---

class: middle, inverse-slide
# Parte 2: Encoder-Only (A Família BERT)
### _Os Especialistas em Compreensão_

---

## 4. Arquitetura Bidirecional ↔️

Encoders têm **Visibilidade Total**.
O token no início da frase pode ver o token do final e vice-versa.
$$A\_{ij} \neq -\infty \quad \forall i,j$$

* **Analogia:** Caça-palavras ou Palavras Cruzadas. Você olha a grade inteira para descobrir o significado.

---

## 5. Masked Language Modeling (MLM) 🎭

Como treinamos um Encoder se ele vê tudo? Não podemos pedir para ele "prever a próxima palavra" (ele já estaria vendo).

Usamos **MLM**:
1.  Frase: "O gato subiu no telhado."
2.  Input: "O [MASK] subiu no telhado."
3.  Objetivo: Descobrir quem é [MASK] usando o contexto da esquerda ("O") e da direita ("subiu").

---

## 6. A Matriz de Atenção do Encoder 🟩

A matriz de máscara é cheia de zeros (ou seja, sem bloqueios).

$$
\text{Mask} = 
\begin{bmatrix} 
0 & 0 & 0 \\ 
0 & 0 & 0 \\ 
0 & 0 & 0 
\end{bmatrix}
$$

Todo mundo atende a todo mundo. $N^2$ conexões ativas.

---

## 7. Para que servem? (Use Cases) 🛠️

Encoders não geram texto (não falam). Eles geram **Embeddings Ricos**.
São ideais para tarefas discriminativas:

* **Classificação:** "Este email é Spam?"
* **NER:** "Onde estão os nomes de empresas neste contrato?"
* **Search/RAG:** "Este documento fala sobre o mesmo assunto da pergunta?"
* **Sentiment Analysis:** "O cliente está bravo?"

---

class: middle, inverse-slide
# Parte 3: Decoder-Only (A Família GPT)
### _Os Especialistas em Geração_

---

## 8. Arquitetura Auto-Regressiva ➡️

Decoders têm **Visibilidade Causal**.
O token 5 só pode ver os tokens 1, 2, 3 e 4. Ele é "cego" para o futuro (6, 7...).

* **Analogia:** Escrever um discurso ao vivo. Você só lembra do que já falou, não do que ainda vai falar.

---

## 9. Causal Language Modeling (CLM) 🔮

O treino é simples: **Next Token Prediction**.
Dado `[A, B, C]`, preveja `D`.

Isso força o modelo a aprender probabilidade estatística e raciocínio de causa e efeito.

---

## 10. A Matriz de Atenção do Decoder 📐

Usamos uma **Máscara Triangular Superior** (Causal Mask).
As posições futuras são preenchidas com $-\infty$ (que vira 0 no Softmax).

$$
\text{Mask} = 
\begin{bmatrix} 
0 & -\infty & -\infty \\ 
0 & 0 & -\infty \\ 
0 & 0 & 0 
\end{bmatrix}
$$



---

## 11. Para que servem? (Use Cases) 💬

Decoders são criadores.
* **Text Generation:** Escrever e-mails, histórias.
* **Chatbots:** Conversação fluida.
* **Code Completion:** GitHub Copilot.
* **Reasoning:** Cadeia de pensamento (Chain of Thought).

*Nota: Hoje, LLMs gigantes (GPT-4) são tão bons que fazem o trabalho de Encoders também, mas são mais caros.*

---

class: middle, inverse-slide
# Parte 4: Encoder-Decoder (Híbridos)
### _T5, BART e o Legado Original_

---

## 12. O Melhor dos Dois Mundos? 🤝

Modelos como **T5 (Text-to-Text Transfer Transformer)** e **BART** mantêm as duas partes.

1.  **Encoder:** Processa o input (Bidirecional) $\to$ Gera uma memória.
2.  **Decoder:** Gera o output (Auto-regressivo) $\to$ Olhando para a memória do Encoder.

---

## 13. Cross-Attention ❌

Aqui brilha a **Cross-Attention**.
O Decoder tem cabeças de atenção que:
* $Q$ (Query): Vem do Decoder ("O que eu preciso escrever agora?").
* $K, V$ (Key, Value): Vêm do Encoder ("O que dizia no texto original?").

---

## 14. Use Cases Ideais ✨

São perfeitos para transformação de sequência para sequência (Seq2Seq):
* **Tradução:** Inglês $\to$ Francês.
* **Resumo:** Texto Longo $\to$ Texto Curto.

Eles "leem" o texto inteiro primeiro (Encoder) para depois "escrever" o resumo (Decoder). O GPT, por ser puramente Decoder, às vezes começa a resumir antes de entender o fim do texto.

---

class: middle, inverse-slide
# Parte 5: Guia de Engenharia
### _Qual motor escolher para seu Agente?_

---

## 15. A Grande Convergência 🌀

Atualmente, a indústria está convergindo para **Decoder-Only** (Llama 3, GPT-4).
Por que?
* Scaling Laws favorecem Decoders.
* É mais simples treinar uma arquitetura só em dados massivos.
* Com *Instruction Tuning*, Decoders aprenderam a fazer tarefas de classificação.

---

## 16. Quando usar Encoder (BERT/RoBERTa) hoje? 📉

Não descarte o BERT. Ele ainda é rei em:
1.  **Embeddings para Vector DB:** Modelos de embedding modernos (OpenAI text-embedding-3) internamente funcionam como Encoders.
2.  **Classificação Rápida:** Se você precisa classificar 1 milhão de tweets por minuto, um DistilBERT é 100x mais barato e rápido que chamar o GPT-4.
3.  **Entidades (NER):** Extrair nomes de contratos jurídicos.

---

## 17. Quando usar Decoder (GPT/Llama)? 📈

Para o núcleo cognitivo do Agente:
1.  **Orquestração:** Decidir qual ferramenta usar.
2.  **Geração de Resposta:** Falar com o usuário.
3.  **Raciocínio Complexo:** Resolver problemas de lógica.

---

## 18. Resumo Técnico 📝

| Característica | Encoder (BERT) | Decoder (GPT) | Enc-Dec (T5) |
| :--- | :--- | :--- | :--- |
| **Visibilidade** | Bidirecional ($N^2$) | Causal (Triangular) | Híbrida |
| **Treino** | Adivinhar lacuna | Prever próximo | Seq2Seq |
| **Forte em** | Entender, Classificar | Criar, Raciocinar | Traduzir, Resumir |
| **Custo Inf.** | Baixo (Paralelo) | Alto (Serial) | Médio |

---

## 19. The Agentic Path: Decisão 🏁

Para nossos Agentes, usaremos:
* **Decoder (LLM):** Para o cérebro (Raciocínio).
* **Encoder (Embedding Model):** Para a memória (RAG).

Essa combinação é a arquitetura padrão de 2024/2025.

**Próximo Módulo:** Como o modelo "age"? **Function Calling & Tool Use**.

---
class: center, middle
# The Geometry is Open
### _Perguntas sobre Arquiteturas?_
---