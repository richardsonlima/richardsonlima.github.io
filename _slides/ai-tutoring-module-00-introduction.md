---
layout: slides
title: "The Big Picture: Da Lógica aos Agentes Generativos"
category: "ai-tutoring"
module_number: 0
complexity: "Strategic Overview"
use_math: true
---

layout: true
class: basic-layout
---

class: center, middle, inverse-slide
# The Agentic Path: Visão Estratégica
## Do Paradigma Lógico aos Agentes Generativos
### _A evolução da Engenharia de Software 1.0 para 2.0_

<img src="/assets/article_images/transformer-symphony.jpg" width="150px" style="border-radius: 50%; border: 2px solid #FFD700;"/>

**Richardson Lima**
.footnote[Uma análise técnica da transição Simbólica para Conexionista]

---

## O Contexto Tecnológico 🎯

Antes de aprofundarmos na arquitetura de Transformers, é crucial alinhar o entendimento sobre a **mudança de paradigma** atual.

**Visão Técnica:** Compreender a transição de sistemas baseados em regras explícitas para sistemas probabilísticos aprendidos.
**Visão Estratégica:** Analisar por que a "Software 2.0" (Karpathy) altera fundamentalmente a abordagem para resolver problemas NP-difíceis e automação complexa.

**Agenda da Sessão:**
1.  Limitações da Lógica Simbólica (Software 1.0).
2.  O Paradoxo de Polanyi e a Complexidade.
3.  A Era do Aprendizado Profundo (Software 2.0).
4.  O Salto Generativo: De Classificadores a Criadores.
5.  Fronteira Tecnológica: Agentes Autônomos.

---

class: middle, inverse-slide
# Parte 1: A Era da Lógica
### _Limitações do Determinismo no Software 1.0_

---

## 1. O Legado: Lógica Aristotélica e Booleana 🏛️

Historicamente (1950-2010), a computação operou sob **regras explícitas**.
O engenheiro atua como o legislador do sistema, definindo axiomas.

* **Se** (temperatura > 30) **Então** (ligar\_ar\_condicionado).
* **Se** (usuario == "admin") **Então** (liberar\_acesso).

Este modelo é a **Lógica Simbólica**. É determinístico, auditável e ideal para sistemas transacionais e física básica.



[Image of boolean logic gates diagram AND OR NOT]


---

## 2. A Barreira da Regra Explícita 🧱

O modelo quebra quando tentamos codificar a percepção não-estruturada, como diferenciar um **Gato** de um **Cachorro**.

* `if (tem_orelhas_pontudas)`? (Falso positivo com Huskys).
* `if (tem_bigode)`? (Falso positivo genérico).
* `if (faz_miau)`? (Dados visuais não possuem áudio).

A explosão combinatória de regras torna a manutenção inviável em cenários do mundo real.

---

## 3. O Paradoxo de Polanyi 😶

O filósofo Michael Polanyi definiu o gargalo fundamental:
> *"Nós sabemos mais do que conseguimos explicar."*

Reconhecemos rostos instantaneamente, mas não conseguimos formalizar o algoritmo cognitivo passo-a-passo.

Se não conseguimos explicar a regra, não conseguimos programá-la no paradigma do Software 1.0. Isso levou ao "Inverno da IA" nos anos 80.

---

class: middle, inverse-slide
# Parte 2: A Era do Aprendizado
### _Software 2.0 e a Inferência de Regras_

---

## 4. Inversão de Controle: Machine Learning 🧠

A mudança fundamental: Em vez de programar as **regras**, fornecemos os **dados** e os **resultados esperados**.
O sistema infere as regras.

* **Tradicional:** Input + Regras $\to$ Output.
* **Machine Learning:** Input + Output $\to$ **Regras**.

Andrej Karpathy define isso como **Software 2.0**. O código fonte deixa de ser C++ e passa a ser o Dataset. O compilador é o otimizador (SGD).

---

## 5. Inspiração Arquitetural: O Neurônio Artificial 🕸️

Mimetismo biológico para processamento paralelo.
* Substituição de `if/else` por ativações contínuas.
* O **Perceptron**: uma função que agrega sinais ponderados.

$$y = f(\sum (w\_i \cdot x\_i) + b)$$

A "decisão" emerge da soma de milhares de micro-decisões ponderadas, não de uma bifurcação lógica única.



---

## 6. Deep Learning: Hierarquia de Abstração 🌊

A capacidade de generalização surge da profundidade (**Deep** Learning).

* **Camada 1:** Detecção de arestas/frequências.
* **Camada 2:** Formas geométricas primitivas.
* **Camada 3:** Componentes de objetos.
* **Camada Final:** Classificação Semântica.

O sistema constrói representações internas do mundo sem intervenção humana explícita.

---

class: middle, inverse-slide
# Parte 3: O Salto Generativo
### _Modelagem de Distribuição e Criação_

---

## 7. IA Discriminativa vs. IA Generativa 🎨

Até ~2020, o estado da arte era **Discriminativo** (Análise).
* Detecção de Fraude (Sim/Não).
* Diagnóstico por Imagem.
* Previsão de Churn.

O limite: O sistema não conseguia **sintetizar** novos dados.

---

## 8. A Revolução Generativa ✨

A GenAI foca em aprender a **Distribuição de Probabilidade** subjacente aos dados ($P(x)$).

* Ao processar milhões de imagens, o modelo aprende a variedade matemática do que constitui um "objeto".
* A inferência passa a ser uma amostragem (sampling) dessa distribuição para gerar instâncias inéditas.

---

## 9. Large Language Models (LLMs) 📚

O conceito aplicado à linguagem.
O objetivo de treino é simples: **Next Token Prediction**.

Para prever a próxima palavra com alta acurácia em qualquer contexto, o modelo é forçado a internalizar:
* Sintaxe e Semântica.
* Lógica Formal.
* Fatos de Mundo.
* Padrões de Raciocínio.

**Tese:** Compressão eficiente de dados equivale a inteligência geral.

---

class: middle, inverse-slide
# Parte 4: Arquitetura Agêntica
### _O Caminho para a Autonomia_

---

## 10. A Limitação do Modelo Passivo 💬

Modelos como o ChatGPT (base) operam em modo passivo.
Input $\to$ Processamento $\to$ Output.
Não há persistência, não há interação com o ambiente externo e não há ciclo de feedback autônomo.

---

## 11. Definição de Agente Autônomo 🕵️

Um Agente é uma arquitetura composta onde o LLM é o núcleo de processamento.

1.  **Percepção:** Entrada multimodal (Logs, Docs, Web).
2.  **Cérebro (LLM):** Planejamento e Decomposição de tarefas.
3.  **Tools:** Execução de código, APIs, SQL.
4.  **Ação:** Efetivação da mudança no ambiente.

**Loop de Controle:** Perceber $\to$ Raciocinar $\to$ Agir $\to$ Avaliar.



---

## 12. O Framework "The Agentic Path" 🚀

Esta trilha técnica visa a construção de sistemas robustos, dividida em camadas de competência:

* **Camada 1 (Core):** Arquitetura Transformer e Mecanismos de Atenção.
* **Camada 2 (Memória):** Embeddings e Vector Databases.
* **Camada 3 (Razão):** Chain of Thought e Planejamento.
* **Camada 4 (Interface):** Function Calling e Tool Use.

---

## 13. Conclusão: Prompt como Linguagem de Alto Nível ⌨️

Estamos observando uma elevação no nível de abstração.
No Software 1.0, a sintaxe era rígida (Python/Java).
No Software 2.0, a sintaxe é natural (Linguagem Humana), mas a lógica de engenharia permanece.

O prompt é o código. O Transformer é a CPU.
O desafio de engenharia migra da sintaxe para a semântica e arquitetura de contexto.

---

## 14. Próximos Passos: Deep Dive na Arquitetura ⏭️

Estabelecido o conceito de Agentes, precisamos entender o motor que viabiliza essa tecnologia.

Na sequência: **"Attention Is All You Need"**.
Vamos realizar a engenharia reversa do Transformer e analisar a matemática da atenção.

---
class: center, middle
# The Geometry is Open
### _Discussão e Perguntas_
---