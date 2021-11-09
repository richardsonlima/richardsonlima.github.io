class: center, middle, inverse-slide
## Uma Introdução ao Kubernetes[K8S]
### _Vamos discutir alguns conceitos básicos do Kubernetes_
<img src="/images/slides/load-testing-and-kubernetes/kubernetes.svg" width="100px"/>

.footnote[([@RichDevSecOps](https://twitter.com/RichDevSecOps))]
---
class: middle, inverse-slide
## Kubernetes, em seu nível mais [básico]
- É um sistema para executar e coordenar aplicações em container através de um cluster de máquinas
- É uma plataforma desenhada para gerenciar completamente o ciclo de aplicações e serviços em container
- Utilizando métodos que fornecem previsibilidade, escalabilidade, e alta disponibilidade
- How do you recover from a failure?

*Já ouviu falar do borg*
- [Large-scale cluster management at Google with Borg](https://research.google/pubs/pub43438/)
---
class: middle, inverse-slide
## O K8s permite definir e gerenciar suas aplicações com alto grau de flexibilidade, potência, e confiabilidade 🎉🎉🎉
### ... _Vamos então explorar mais?_
---
class: middle, inverse-slide
## Arquitetura do Kubernetes 😬
---
class: middle, inverse-slide
## Para entender como o Kubernetes é capaz de fornecer esses recursos, é útil ter uma noção de como ele é projetado e organizado em alto nível
---
class: middle, inverse-slide
## Em sua base, o Kubernetes reúne máquinas físicas ou virtuais individuais em um cluster usando uma rede compartilhada para comunicar entre cada servidor. 
---
class: middle, inverse-slide
## Esse cluster é a plataforma física onde todos os componentes, recursos, e cargas de trabalho do Kubernetes são configurados.
---
class: middle, inverse-slide
## Cada uma das máquinas do cluster recebe um papel dentro do ecossistema do Kubernetes
---
class: middle, inverse-slide
## Um servidor (ou um pequeno grupo nos deployments de alta disponibilidade) funciona como o servidor [mestre].
---
class: middle, inverse-slide
## Esse servidor age como um gateway e um cérebro para o cluster, expondo uma API para usuários e clientes, verificando a saúde de outros servidores.
---
class: middle, inverse-slide
## decidindo a melhor forma de dividir e atribuir trabalho [onhecido como “scheduling”], e orquestrando a comunicação entre outros componentes.
---
.left-column[
## Componentes do Servidor Mestre
]
.right-column-middle[
- Quais componentes são esses?
    - etcd
    - kube-apiserver
    - kube-controller-manager
    - kube-scheduler
    - cloud-controller-manager
]
---
.left-column[
## Componentes do Servidor de Nodes
]
.right-column-middle[
- Quais componentes são esses?
    - Um Runtime de Container
    - kubelet
    - kube-proxy
]
---
.left-column[
## Objetos e Cargas de Trabalho do Kubernetes
]
.right-column-middle[
- Quais componentes são esses?
    - Pods
]
---
.left-column[
## Controladores de Replicação e Conjuntos de Replicação
]
.right-column-middle[
- Quais componentes são esses?
    - Replication Controller ou controlador de replicação
    - Replication Sets ou Conjuntos de Replicação
]
---
.left-column[
## Deployments
]
.right-column-middle[
- Deployments são uma das cargas de trabalho mais comuns para se criar e gerenciar diretamente
    - Os deployments usam os replication sets como blocos construtivos 
    - Adicionam a funcionalidade de gerenciamento flexível do ciclo de vida.
]
---
.left-column[
## Deployments
]
.right-column-middle[
- Deployments são uma das cargas de trabalho mais comuns para se criar e gerenciar diretamente
    - Os deployments usam os replication sets como blocos construtivos 
    - Adicionam a funcionalidade de gerenciamento flexível do ciclo de vida.
]
---
.left-column[
## Stateful Sets
]
.right-column-middle[
- Stateful Sets ou Conjuntos com preservação de estado
    - São pods controladores especializados que oferecem pedidos e garantias de exclusividade
    - Primeiramente, eles são usados para ter um controle mais refinado quando você tem requisitos especiais relacionados ao pedido de implantação
    - Dados persistentes ou redes estáveis.
]
*Por exemplo, stateful sets são geralmente associados a aplicações orientadas a dados, como bancos de dados*
---

.left-column[
## What We Don’t Know
]
.right-column-middle[
- What does a failure look like?
    - Qualitative
      - 500s
      - Segmentation fault
]
---
.left-column[
## What We Don’t Know
]
.right-column-middle[
- What does it look like when the system approaches failure?
]
---
.left-column[
## What We Don’t Know
]
.right-column-middle[
- How do you recover from a failure?
]
---
class: middle, inverse-slide
## That’s a pretty .red-text[risky] list of unknowns
- What’s the failure point of the system?
- What does a failure look like?
- What does it look like when the system approaches failure?
- How do you recover from a failure?
---
class: middle, inverse-slide
## We can reduce risk by <br> .green-text[increasing predictability]
---
class: middle
## Predictability

> Given a load, the system achieves the **same results** from test to test

---
class: middle, inverse-slide
## How can we increase predictability with .kubernetes-text[Kubernetes]?
---
class: middle, inverse-slide
## We can start by setting .blue-text[resource limits]
---
.left-column[
## Setting Limits
]
.right-column-middle[
- Kubernetes can run the maximum number of simultaneous tasks
]
---
.left-column[
## Setting Limits
]
.right-column-middle[
- Each container has enough resources to complete a task
]
---
.left-column[
## Setting Limits
]
.right-column-middle[
- Kubernetes can manage resources efficiently
]
---
class: middle, inverse-slide
## .green-text[over]/.blue-text[under]/.purple-text[even] resource allocation
---
.left-column[
## Setting Limits
### Underallocation
]
.right-column-middle[
- Containers are exceeding resource limits
- Kubernetes constantly kills containers
<br><br>
<img src="/images/slides/load-testing-and-kubernetes/under-allocation.png" width="60%"/>
]
---
.left-column[
## Setting Limits
### Underallocation
### Overallocation
]
.right-column-middle[
- Containers can never fully utilize resources
- Kubernetes lets containers run, but each container is allocated extra resources
<br><br>
<img src="/images/slides/load-testing-and-kubernetes/over-allocation.png" width="60%"/>
]
---
class: middle, inverse-slide
## Overallocation is a .purple-text[tricky] problem to detect
---
class: middle, inverse-slide
## But it becomes a problem when you _scale up your replicas_
---
class: center, middle, inverse-slide
<img src="/images/slides/load-testing-and-kubernetes/over-allocation.png" width="40%"/>
## vs
<img src="/images/slides/load-testing-and-kubernetes/just-right.png" width="40%"/>
---
class: middle, inverse-slide
## That's an .green-text[extra container] you could be running
---
.left-column[
## Setting Limits
### Underallocation
### Overallocation
### Even
]
.right-column-middle[
- Containers have enough resources to complete the task
- Kubernetes resources are allocated efficiently
<br><br>
<img src="/images/slides/load-testing-and-kubernetes/even-steven.jpg" width="60%"/>
]
---
class: middle, inverse-slide
## How much a container needs depends on the type of load <br> .purple-text[Bursty] vs. .blue-text[Constant]
---
.left-column[
## .purple-text[Bursty] vs. .blue-text[Constant]
]
.right-column-middle[
- If migrating from another service
    - Take a look at the traffic data (if you've got it)
      - Periodic Peaks
      - Random Peaks
      - Constant
]
---
.left-column[
## .purple-text[Bursty] vs. .blue-text[Constant]
]
.right-column-middle[
- Constant
<br><br>
<img src="/images/slides/load-testing-and-kubernetes/constant.png" width="80%"/>
]
---
.left-column[
## .purple-text[Bursty] vs. .blue-text[Constant]
]
.right-column-middle[
- Bursty
<br><br>
<img src="/images/slides/load-testing-and-kubernetes/bursty.png" width="80%"/>
]
---
class: middle, inverse-slide
## Lets set some .purple-text[limits]!
---
.left-column[
## Setting Limits
### Testing Setup
]
.right-column-middle[
- Goal: figure out what **one container** can handle
  - Set the number replicas to 1
  - Start with a conservative level of resources
  ```yaml
  # for node might be something like
  cpu: 100m
  memory: 100Mi
  ```
]
---
class: middle, inverse-slide
## Now lets find the .red-text[breaking point] 👹
---
.left-column[
## Setting Limits
### Find The Breaking Point
]
.right-column-middle[
- Run a test where we slowly increase the load over time until we hit the breaking point
<br><br>
<img src="/images/slides/load-testing-and-kubernetes/breakingpoint.png" width="80%"/>
]
---
.left-column[
## Setting Limits
### Find The Breaking Point
]
.right-column-middle[
- If container performed poorly, identify the bottleneck
  - While running a test you can `exec` into a container
      - Check memory consumption with something like
      ```bash
      ps -eo rss,pid,euser,args:100 --sort %mem
      ```
      - Check cpu and system load with
      ```bash
      top
      ```
  - Once you identify a bottleneck try raising the limit and repeat
  - Worst case you have to optimize some code paths
]
---
.left-column[
## Setting Limits
### Find The Breaking Point
]
.right-column-middle[
- When the test is too easy or the resources are overallocated, you’ll likely see no change in the system performance over time
<br><br>
<img src="/images/slides/load-testing-and-kubernetes/overallocated.png" width="80%"/>
]
---
.left-column[
## Setting Limits
### Find The Breaking Point
]
.right-column-middle[
- When resource limits are at a good level you’ll likely see the performance degrade slowly over time
<br><br>
<img src="/images/slides/load-testing-and-kubernetes/goodtest.png" width="80%"/>
]
---
.left-column[
## Setting Limits
### Find The Breaking Point
]
.right-column-middle[
- When a test fails observe and take note
    - Did it recover on it’s own? (probably did with Kubernetes 😎)
    - How did it behave right before it broke
        - Useful for monitoring
]
---
class: middle, inverse-slide
## Does It Handle Load .blue-text[Over Time]?
---
.left-column[
## Setting Limits
### Consistent Load Over Time
]
.right-column-middle[
- Set the load to something just under the breaking point
- The test duration depends on your use case
    - At least 10 minutes as a general guide
    - Longer tests are better!
]
---
.left-column[
## Setting Limits
### Consistent Load Over Time
]
.right-column-middle[
- Problem signs (not an exhaustive list)
  - Memory is slowly increasing
  - CPU is pegged at 100%
  - 500s in response codes
  - High response times
  - Large variance in response times
<br><br>
<img src="/images/slides/load-testing-and-kubernetes/bad-duration-load-test.png" width="80%"/>
]
---
.left-column[
## Setting Limits
### Consistent Load Over Time
]
.right-column-middle[
- When things are looking good you *should* see consistent performance over time
<br><br>
<img src="/images/slides/load-testing-and-kubernetes/good-duration-load-test.png" width="80%"/>
]
---
class: middle, inverse-slide
## At this point we should have an .green-text[answer] to our previous questions
- What’s the failure point of the system?
- What does a failure look like?
- What does it look like when the system approaches failure?
- How do you recover from a failure?
---
class: middle, blue-slide
# What Now?
---
.left-column[
## What Now?
]
.right-column-middle[
- **Setup monitoring**
- Slow rollout (from existing system)
  - 1% -> 10% -> 50% -> 100%
- Build an autoscaling service 😎
]
---
.left-column[
## What Now?
### Autoscaling <br> Service 😎
]
.right-column-middle[
- Monitor all containers in an app
- Scale up replicas when load exceeds a certain threshold
- Could even automate the load testing process and *auto set* thresholds
<br><br>
<img src="/images/slides/load-testing-and-kubernetes/metrics.png" width="100%"/>
]
---
class: middle
## Just A Thought...
<img src="http://imgs.xkcd.com/comics/barrel_part_5.jpg" width="50%" />
---
class: middle
# Questions?
.footnote[Made with [remark](https://github.com/gnab/remark)]
