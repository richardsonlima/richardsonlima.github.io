---
layout: slides
title: "Autonomous Agents: The Complete Orchestration Guide"
category: "ai-tutoring"
module_number: 6
complexity: "Deep Dive / Masterclass"
use_math: true
---

layout: true
class: basic-layout
---

class: center, middle, inverse-slide
# The Agentic Path: Módulo 06 (Masterclass)
## Autonomous Agents: Theory, Patterns & Ecosystem
### _Orquestração Avançada, Máquinas de Estado e Análise de Frameworks_

<img src="/assets/article_images/transformer-symphony.jpg" width="150px" style="border-radius: 50%; border: 2px solid #FFD700;"/>

**Richardson Lima**
.footnote[Uma imersão profunda em LangGraph, Agno, Swarm e CrewAI]

---

## O Roadmap da Masterclass (Slides 1-68) 🗺️

1.  **Fundamentos (1-10):** O fim das "Chains" e a necessidade de Ciclos.
2.  **Teoria de Grafos (11-20):** Máquinas de Estados Finitos (FSM) e Reducers.
3.  **Padrões Cognitivos (21-35):** ReAct, Reflexion, Plan-and-Execute.
4.  **Deep Dive: LangGraph (36-45):** A arquitetura de baixo nível.
5.  **Deep Dive: Agno (46-52):** A abordagem "Agent-as-Code".
6.  **Deep Dive: Swarm & CrewAI (53-60):** Handoffs e Role-Playing.
7.  **Produção & Estratégia (61-68):** Persistência, HITL e Matriz de Decisão.

---

class: middle, inverse-slide
# Parte 1: O Paradigma Cíclico
### _Por que linhas retas falham no mundo real?_

---

## 1. A Era das "Chains" (2023) ⛓️

No início da revolução dos LLMs, construíamos **DAGs** (Directed Acyclic Graphs).
O fluxo era linear e previsível:
`Prompt` $\to$ `LLM` $\to$ `Parser` $\to$ `Output`.

Isso funcionava bem para **Chatbots RAG simples** (Pergunta $\to$ Busca $\to$ Resposta).

---

## 2. A Fragilidade da Linearidade 💥

O mundo real é estocástico (incerto).
* E se a ferramenta de busca retornar zero resultados?
* E se o JSON gerado estiver malformado?
* E se a resposta do LLM for alucinada?

Em uma linha reta (Chain), qualquer erro quebra o processo ou gera lixo. Não há chance de correção.

---

## 3. O Conceito de Agência 🕵️

**Definição de Agente:** Um sistema que usa um LLM como motor de raciocínio para determinar o fluxo de controle da aplicação.

Diferente de uma Chain (onde o fluxo é hardcoded no código), no Agente, **o modelo decide** se vai para a esquerda, direita ou se repete o passo.

---

## 4. Introduzindo Loops (Ciclos) 🔄

Para ter agência, precisamos de **Loops**.
O sistema deve ser capaz de:
1.  Executar uma ação.
2.  Observar o resultado.
3.  **Decidir:** "Isso foi bom o suficiente?"
    * *Sim:* Terminar.
    * *Não:* Tentar novamente (Loop) ou tentar outra estratégia.

---

## 5. O Loop OODA 🎯

Agentes Autônomos implementam digitalmente o ciclo militar OODA:
* **Observe (Observar):** Ler o estado, inputs e erros.
* **Orient (Orientar):** Contextualizar com memória e objetivos.
* **Decide (Decidir):** Escolher a próxima ferramenta/ação.
* **Act (Agir):** Executar a ferramenta.



---

## 6. System 1 vs. System 2 Thinking 🧠

* **System 1 (LLM Puro):** Resposta rápida, intuitiva, propenso a erro. (ChatGPT padrão).
* **System 2 (Agente):** Pensamento lento, deliberativo, revisado.

Ao forçar o modelo a passar por um loop de verificação ("Critique sua própria resposta"), simulamos o Sistema 2, aumentando drasticamente a precisão.

---

class: middle, inverse-slide
# Parte 2: Teoria de Sistemas e Grafos
### _A Matemática por trás da Mágica_

---

## 7. O Que é um Grafo Computacional? 🕸️

Um grafo $G = (V, E)$ onde:
* **V (Vértices/Nós):** Unidades de processamento (Funções Python, chamadas de LLM).
* **E (Arestas):** Caminhos de controle.

Em agentes, usamos grafos **cíclicos**, permitindo que uma aresta volte para um nó anterior.

---

## 8. Máquinas de Estados Finitos (FSM) 📐

O conceito central de orquestração é a **Máquina de Estados**.
O sistema está sempre em um estado discreto (ex: `Idle`, `Thinking`, `Executing`, `Critiquing`).

A transição depende do input e do estado atual.



---

## 9. O Estado Global (State Schema) 💾

Diferente de variáveis locais, o Agente possui um **Estado Persistente**.
No LangGraph, definimos isso como um Schema (TypedDict).

```python
class AgentState(TypedDict):
    messages: Annotated[list[AnyMessage], operator.add]
    user_query: str
    retry_count: int
    errors: list[str]
```

---

---

## 10. A Função de Transição $\delta$ 🧮

A lógica do agente é definida pela função de transição:

$$S\_{t+1} = \delta(S\_t, A\_t)$$

* **$S\_t$:** Estado atual (ex: lista de mensagens).
* **$A\_t$:** Ação tomada (ex: chamada de ferramenta).
* **$S\_{t+1}$:** Novo estado (ex: lista com o resultado da ferramenta adicionado).



---

## 11. Reducers (Como atualizar o estado?) 📥

Não queremos sobrescrever o histórico a cada passo. Queremos **anexar** (append).
Usamos funções "Reducer".

* `messages`: Usa um reducer `add` (soma de listas).
* `retry_count`: Usa um reducer de substituição (sobrescreve o inteiro).

Isso garante que o Agente lembre do que fez 5 passos atrás.

---

## 12. Nodes (Os Trabalhadores) 👷

Um **Nó** é apenas uma função que recebe o estado e retorna uma atualização de estado.

```python
def call_model(state: AgentState):
    response = model.invoke(state['messages'])
    return {"messages": [response]}
```

Note que o nó não retorna o estado inteiro, apenas o "delta" (a mudança).
---

---

## 13. CrewAI: A Metáfora Corporativa 👔

**Filosofia:** O CrewAI aposta que a melhor maneira de orquestrar IA é imitar organogramas humanos.
Tudo gira em torno de **Papéis (Roles)**, **Metas (Goals)** e **Histórico (Backstory)**.

* **Hierarchical Process:** Um "Gerente" (Manager LLM) delega tarefas.
* **Sequential Process:** Uma linha de montagem (Agente A $\to$ Agente B).


---

## 14. Código: A Estrutura do CrewAI 💻

```python
from crewai import Agent, Task, Crew

# 1. Definir o Agente
researcher = Agent(
  role='Pesquisador Sênior',
  goal='Descobrir tendências em IA',
  backstory="Você é um analista veterano...",
  verbose=True
)

# 2. Definir a Tarefa
task1 = Task(
  description='Pesquise sobre Frameworks de Agentes em 2025',
  agent=researcher
)

# 3. Formar a Equipe
crew = Crew(agents=[researcher], tasks=[task1])
result = crew.kickoff()
```
---

## 15. CrewAI: O Trade-off da "Mágica" 🎩

* **Prós:**
    * Curva de aprendizado quase zero.
    * Ótimo para **RPA (Robotic Process Automation)** e tarefas criativas.
    * Integração nativa com LangChain Tools.
* **Contras:**
    * **Caixa Preta:** O prompt de orquestração é oculto. Se o agente entra em loop, é difícil debugar.
    * **Verborragia:** Tende a usar muitos tokens para "roleplay", encarecendo a operação.

---

## 16. Microsoft AutoGen: Conversação Pura 🗣️

**Filosofia:** "Todo processamento é uma troca de mensagens."
Mesmo a execução de código é modelada como um turno de conversa.

* **UserProxyAgent:** Um "agente" que representa o humano (ou um executor de código Docker).
* **AssistantAgent:** O LLM que gera planos e código Python.

O fluxo é um "bate-papo" até que o `UserProxy` responda "TERMINATE".

[Image of Microsoft AutoGen conversation flow diagram]

---

## 17. Código: AutoGen Loop 🔄

```python
from autogen import UserProxyAgent, AssistantAgent

# O executor de código
user_proxy = UserProxyAgent(
    name="user_proxy",
    code_execution_config={"work_dir": "coding"}
)

# O cérebro
assistant = AssistantAgent(
    name="assistant",
    llm_config=llm_config
)

# Iniciar o chat (O loop acontece aqui dentro automaticamente)
user_proxy.initiate_chat(
    assistant,
    message="Plote um gráfico das ações da NVDA YTD."
)
```
---