---
layout: post
title:  "Bootstrapping Clusters with kubeadm on Ubuntu Server mininal 16.04 LTS"
date:   2017-10-29 14:34:25
categories: Kubernetes
tags: featured
image: /assets/article_images/2017-10-29-bootstrapping-clusters-with-kubeadm/whale-by-thomas-kelly.JPG
image2: /assets/article_images/2017-10-29-bootstrapping-clusters-with-kubeadm/whale-by-thomas-kelly-mobile.JPG 
---

 Before start the how to we need to know what’s Kubernetes in fact. So, Kubernetes is an FOSS platform or framework created by Google to automate deployments, staling and operating using containers (like a docker swarm), but with kubernetes one of the major advantage is that we can perform actions that can be respond to customer demand quickly and then it’s really amazing.


Bootstrapping Clusters with kubeadm on Ubuntu Server mininal 16.04 LTS
===================================

1. Swap disabled. You must disable swap in order for the kubelet to work properly.
```bash
swapoff -a    
```

2. Verify the MAC address and product_uuid are unique for every node
The product_uuid can be checked by using the command 
```bash
sudo cat /sys/class/dmi/id/product_uuid
```

3. Check required ports

| Header  | Another header |
|---------|----------------|
| field 1 | something      |
| field 2 | something else |


Master node(s) - kube-master: 192.168.1.111

| Port Range | Purpose |
| -------- |:--------:|
| 6443*     | Kubernetes API server     |
| 2379-2380     | Kubernetes API server     |
| 10250     | Kubelet API     |
| 10251     | kube-scheduler     |
| 10252     | kube-controller-manager     |
| 10255     | Read-only Kubelet API (Heapster)| 


Worker node(s) - kube-node01: 192.168.1.112,kube-node02: 192.168.1.113

| Port Range | Purpose |
| -------- | -------- |
| 10250     | Kubelet API     |
| 30000-32767 | Default port range for NodePort Services. Typically, these ports would need to be exposed to external load-balancers, or other external consumers of the application itself.     |
| 10255     | Read-only Kubelet API (Heapster)| 

4. Configuring bridge netfilter call 
Set /proc/sys/net/bridge/bridge-nf-call-iptables to 1 by running sysctl net.bridge.bridge-nf-call-iptables=1 to pass bridged IPv4 traffic to iptables’ chains. 
```bash
sysctl net.bridge.bridge-nf-call-iptables=1
```
This is a requirement for CNI plugins to work, for more information please see here.

5. Installing ebtables ethtool
```bash
apt install ebtables ethtool -y 
```
6 . Installing Docker
```bash
apt update
apt install -y docker.io
```

7. Installing kubeadm, kubelet and kubectl
- kubeadm: the command to bootstrap the cluster.
- kubelet: the component that runs on all of the machines in your cluster and does things like starting pods and containers.
- kubectl: the command line util to talk to your cluster.

- Install on master AND nodes:
```bash
apt-get update && apt-get install -y apt-transport-https
```
```bash
curl -s https://packages.cloud.google.com/apt/doc/apt-key.gpg | apt-key add -
```
```bash    
cat <<EOF >/etc/apt/sources.list.d/kubernetes.list
deb http://apt.kubernetes.io/ kubernetes-xenial main
EOF
```
```bash
apt-get update
apt-get install -y kubelet kubeadm kubectl
systemctl enable kubelet && systemctl start kubelet
```
8. Avoiding swap errors on master node
```bash
echo 'Environment="KUBELET_EXTRA_ARGS=--fail-swap-on=false"' >> /etc/systemd/system/kubelet.service.d/10-kubeadm.conf
```
```bash
systemctl daemon-reload
kubeadm reset
```
Using kubeadm to Create a Cluster
=====================================
9. Initializing your master
```bash
kubeadm init
```
To start using your cluster, you need to run (as a regular user):

```bash
mkdir -p $HOME/.kube
sudo echo "127.0.0.1 kube-master" >> /etc/hosts
sudo cp -i /etc/kubernetes/admin.conf $HOME/.kube/config
sudo chown $(id -u):$(id -g) $HOME/.kube/config
```

You should now deploy a pod network to the cluster.

```bash
kubectl apply -f https://raw.githubusercontent.com/coreos/flannel/v0.9.0/Documentation/kube-flannel.yml
```
```bash
kubectl describe node kube-master
```

10. Initializing your nodes
```bash
sudo echo "127.0.0.1 kube-nodeX" >> /etc/hosts
echo 'Environment="KUBELET_EXTRA_ARGS=--fail-swap-on=false"' >> /etc/systemd/system/kubelet.service.d/10-kubeadm.conf
```
```bash
systemctl daemon-reload
kubeadm reset
```
```bash
kubeadm join --token <token> <master-ip>:<master-port> --discovery-token-ca-cert-hash sha256:<hash>
```

11. Checking all nodes on your master
```bash
kubectl get nodes
```
