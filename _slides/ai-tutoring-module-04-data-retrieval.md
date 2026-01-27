---
layout: slides
title: "Data Retrieval Systems: Building External Memory for AI"
category: "ai-tutoring"
module_number: 4
complexity: "Intermediate / Systems"
use_math: true
---

layout: true
class: basic-layout
---

class: center, middle, inverse-slide
# The Agentic Path: Módulo 04
## Data Retrieval Systems
### _Construindo Memória Externa para IA (RAG & Vector DBs)_

<img src="/assets/article_images/transformer-symphony.jpg" width="150px" style="border-radius: 50%; border: 2px solid #FFD700;"/>

**Richardson Lima**
.footnote[A arquitetura de sistemas por trás do RAG e da Busca Semântica]

---

## O Roadmap do Módulo 🗺️

O Transformer é um gênio, mas ele tem amnésia (não lembra da conversa passada) e está congelado no tempo (Knowledge Cutoff).
Precisamos dar a ele acesso a dados frescos.

1.  **O Problema do Contexto:** Memória Paramétrica vs. Não-Paramétrica.
2.  **RAG (Retrieval-Augmented Generation):** O padrão arquitetural.
3.  **Engenharia de Ingestão:** Chunking e Overlap.
4.  **Vector Databases:** O motor de busca semântica.
5.  **Algoritmos de Indexação:** KNN vs. ANN (HNSW).
6.  **Advanced Retrieval:** Hybrid Search e Re-ranking.

---

class: middle, inverse-slide
# Parte 1: O Paradoxo da Memória
### _Por que o GPT não sabe quem você é?_

---

## 1. Memória Paramétrica (O Peso) 🏋️

O conhecimento do LLM está "assado" nos pesos ($W$).
* **Vantagem:** Acesso imediato, raciocínio integrado.
* **Desvantagem:** Imutável. Para ensinar algo novo, é preciso treinar (caro) ou fazer *Fine-Tuning* (lento).
* **Analogia:** Um livro impresso. Não muda depois de publicado.

---

## 2. Memória Não-Paramétrica (O Contexto) 📄

Podemos injetar conhecimento no momento da inferência, via **Prompt**.
* **Vantagem:** Atualizável em tempo real.
* **Desvantagem:** Limitada pela Janela de Contexto (Context Window).

O desafio da engenharia moderna é: **Como selecionar os 10kb de texto mais relevantes de uma base de 1TB para colocar no prompt?**

---

class: middle, inverse-slide
# Parte 2: Arquitetura RAG
### _Retrieval-Augmented Generation_

---

## 3. O Fluxo do RAG 🌊

Lewis et al. (2020) definiram este padrão. Em vez de perguntar direto ao modelo:

1.  **Query:** Usuário faz uma pergunta.
2.  **Retrieve:** O sistema busca documentos relevantes no DB.
3.  **Augment:** O sistema cola esses documentos no prompt.
4.  **Generate:** O LLM responde baseando-se *apenas* no contexto fornecido.



---

## 4. O Pipeline de Ingestão (ETL) 🏭

Antes de buscar, precisamos indexar.
Dados não estruturados (PDFs, HTML, Markdown) precisam ser limpos e quebrados.

**Garbage In, Garbage Out:** Se você indexar rodapés, menus de site ou caracteres estranhos, a busca falhará.

---

## 5. A Arte do Chunking 🧩

Como dividimos o texto?
* **Fixed Size:** A cada 512 tokens. (Bruto, corta frases no meio).
* **Recursive:** Respeita parágrafos e pontuação. (Melhor).
* **Semantic Chunking:** Quebra quando o assunto muda (usando embeddings para detectar transição de tópico).

**Overlap:** Sempre mantemos uma sobreposição (ex: 50 tokens) entre chunks para não perder o contexto nas bordas.

---

class: middle, inverse-slide
# Parte 3: O Motor de Busca
### _Vector Databases e Algoritmos_

---

## 6. O Banco Vetorial (Vector DB) 🗄️

Diferente do SQL (linhas/colunas) ou NoSQL (JSON), o Vector DB armazena **Arrays de Float**.
* Pinecone, Weaviate, Milvus, Qdrant, pgvector.

A operação principal não é `WHERE id = 1`, mas sim `ORDER BY similarity LIMIT k`.

---

## 7. O Problema da Escala: KNN 🐢

Para achar o vizinho mais próximo (**K-Nearest Neighbors**), precisamos comparar a Query com **todos** os vetores do banco.
Complexidade: $O(N \cdot d\_{model})$.

Se $N = 1.000.000$ e $d = 1536$, isso é lento demais para tempo real (milissegundos).

---

## 8. A Solução: ANN (HNSW) 🐰

Usamos **Approximate Nearest Neighbors**. Aceitamos 99% de precisão por 100x mais velocidade.

O algoritmo padrão é o **HNSW (Hierarchical Navigable Small World)**.
* Cria um grafo de várias camadas (como rodovias expressas e ruas locais).
* Complexidade de busca: $O(\log N)$.
* Permite buscar em bilhões de vetores em milissegundos.



---

class: middle, inverse-slide
# Parte 4: Advanced Retrieval Strategies
### _Além da busca por similaridade_

---

## 9. O Limite da Busca Semântica 🚧

Embeddings capturam *conceitos*, mas falham em *palavras-chave exatas*.
* Query: "Erro no módulo SKU-992".
* Semantic Search: Retorna documentos sobre "Erros em módulos de inventário" (Conceito), mas pode perder o ID específico "SKU-992".

---

## 10. Hybrid Search (A Melhor de Dois Mundos) 🧬

Combinamos dois algoritmos:
1.  **Dense Retrieval:** Embeddings (Cosseno) $\to$ Entende a intenção.
2.  **Sparse Retrieval:** BM25 (TF-IDF moderno) $\to$ Entende palavras-chave exatas.

Combinamos os resultados usando um algoritmo de fusão (Reciprocal Rank Fusion - RRF).

---

## 11. O Processo de Re-Ranking 🥇

A busca vetorial é rápida (Bi-Encoder), mas pouco precisa para nuances finas.
O **Re-Ranking** adiciona uma etapa de refinamento:

1.  **Retrieve:** Vector DB busca 100 documentos candidatos (Rápido).
2.  **Re-Rank:** Um modelo Cross-Encoder lê a Query + Documento e dá um score de relevância (Lento, mas preciso).
3.  **Select:** Pegamos os Top 5 para o LLM.

---

## 12. Lost in the Middle Phenomenon 🥪

Pesquisas mostram que LLMs prestam mais atenção no início e no fim do contexto.
Informação no meio é frequentemente esquecida.

**Estratégia:** Ordenar os chunks recuperados de forma que os mais relevantes fiquem nas pontas do prompt, não no meio.

---

## 13. Agentes e Ferramentas 🛠️

Em uma arquitetura agêntica, o "Retrieval" é apenas mais uma **Ferramenta**.
O Agente decide:
* "Preciso buscar no manual técnico?" (Retrieval Tool).
* "Ou já sei a resposta?" (Memória Paramétrica).

Isso desacopla o conhecimento da lógica.

---

## 14. Conclusão: Engenharia de Contexto 🏗️

Construir um chat com o seu PDF é fácil (Hello World).
Construir um sistema de busca corporativo requer:
* Chunking inteligente.
* Busca Híbrida.
* Re-ranking.
* Avaliação (RAGAS framework).

**Próximo Módulo:** Dando braços ao cérebro - **Function Calling & Tool Use**.

---
class: center, middle
# The Geometry is Open
### _Perguntas sobre RAG e Vector DBs?_
---