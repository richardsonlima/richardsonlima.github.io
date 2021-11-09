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
## Para entender como o Kubernetes é capaz de fornecer esses recursos, 
### é útil ter uma noção de como ele é projetado e organizado em alto nível
---
class: middle, inverse-slide
## Em sua base, o Kubernetes reúne máquinas físicas ou virtuais individuais em um cluster 
### usando uma rede compartilhada para comunicar entre cada servidor. 
---
class: middle, inverse-slide
## Esse cluster é a plataforma física onde todos os componentes
### recursos, e cargas de trabalho do Kubernetes são configurados.
---
class: middle, inverse-slide
## Cada uma das máquinas do cluster recebe um papel dentro do ecossistema do Kubernetes
---
class: middle, inverse-slide
## Um servidor (ou um pequeno grupo nos deployments de alta disponibilidade) funciona como o servidor [mestre].
---
class: middle, inverse-slide
## Esse servidor age como um gateway e um cérebro para o cluster, expondo uma API para usuários e clientes, 
### verificando a saúde de outros servidores.
---
class: middle, inverse-slide
## decidindo a melhor forma de dividir e atribuir trabalho [onhecido como “scheduling”], 
### e orquestrando a comunicação entre outros componentes.
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
## Daemon Sets
]
.right-column-middle[
- Daemon Sets são outra forma especializada de controlador de pods 
    - Executa uma cópia de um pod em cada node no cluster (ou um subconjunto, se especificado)
]
---
.left-column[
## Jobs e Cron Jobs
]
.right-column-middle[
- O Kubernetes usa uma carga de trabalho chamada jobs para fornecer um fluxo de trabalho baseado em tarefas
    - Os cron jobs são construídos sobre os jobs. Como os daemons convencionais do cron nos sistemas Linux e Unix-like que executam scripts em uma agenda
]
---
class: middle, inverse-slide
## Outros Componentes do Kubernetes
 😬
---
.left-column[
## Componentes do Servidor Mestre
]
.right-column-middle[
- Quais componentes são esses?
    - Serviços
    - Ingress
    - Volumes
    - Secrets
    - Configmaps
]
---
class: middle
## Just A Thought...
<img src="http://imgs.xkcd.com/comics/barrel_part_5.jpg" width="50%" />
---
class: middle
# Questions?
.footnote[Made with [remark](https://github.com/gnab/remark)]
