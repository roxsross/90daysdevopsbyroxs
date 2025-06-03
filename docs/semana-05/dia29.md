---
title: Día 29 - Introducción a Kubernetes
description: Fundamentos de Kubernetes y configuración del entorno local
sidebar_position: 1
---

## 🧭 ¡Bienvenido al mundo de Kubernetes!

![](../../static/images/banner/5.png)

Si **Docker** nos ayuda a empaquetar aplicaciones, **Kubernetes** nos ayuda a **orquestarlas y gestionarlas** a gran escala.  
Esta semana vamos a conocer uno de los pilares del DevOps moderno: **K8s**.

---

## 🤔 ¿Qué es Kubernetes?

**Kubernetes** (K8s) es un **orquestador de contenedores** que permite:

- 🏗️ **Desplegar** aplicaciones automáticamente  
- ⚖️ **Escalar** según la demanda  
- 🔄 **Actualizar sin downtime**  
- 🛡️ **Recuperarse ante fallos**  
- 🌐 **Balancear carga**

### 🧱 Conceptos Clave

| Concepto       | Descripción                                                                 |
|----------------|-----------------------------------------------------------------------------|
| Clúster        | Conjunto de máquinas que ejecutan Kubernetes                                |
| Pod            | Unidad más pequeña, contiene uno o más contenedores                         |
| Node           | Máquina física o virtual que forma parte del clúster                        |
| Master Node    | Controla y administra el clúster                                            |
| Worker Node    | Ejecuta las aplicaciones                                                    |

---

## 🛠️ Instalación de Herramientas

### 1. `kubectl` (CLI de Kubernetes)

<details>
<summary>▶️ Ver instrucciones según sistema operativo</summary>

**Windows**
```bash
choco install kubernetes-cli
curl -LO "https://dl.k8s.io/release/v1.28.0/bin/windows/amd64/kubectl.exe"
````

**macOS**

```bash
brew install kubectl
sudo port install kubectl
```

**Linux**

```bash
curl -LO "https://dl.k8s.io/release/$(curl -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl"
sudo install -o root -g root -m 0755 kubectl /usr/local/bin/kubectl
```

</details>

### 2. `Minikube` (Entorno local de Kubernetes)

<details>
<summary>▶️ Ver instrucciones según sistema operativo</summary>

**Windows**

```bash
choco install minikube
# o descargar desde: https://minikube.sigs.k8s.io/docs/start/
```

**macOS**

```bash
brew install minikube
```

**Linux**

```bash
curl -LO https://storage.googleapis.com/minikube/releases/latest/minikube-linux-amd64
sudo install minikube-linux-amd64 /usr/local/bin/minikube
```

</details>

---

## 🚀 Crear tu Primer Clúster Local

```bash
minikube start
minikube status
```

### Verificar que todo funcione

```bash
kubectl version --client
kubectl cluster-info
kubectl get nodes
```

---

## 📦 Desplegar tu Primera App

```bash
kubectl create deployment hello-minikube --image=k8s.gcr.io/echoserver:1.4
kubectl expose deployment hello-minikube --type=NodePort --port=8080
kubectl get services hello-minikube
minikube service hello-minikube
```

---

## 📋 Comandos Básicos

```bash
kubectl get all
kubectl describe pod <nombre-pod>
kubectl logs <nombre-pod>
kubectl delete deployment <nombre-deployment>
kubectl <comando> --help
```

---

## 🧪 BONUS: Explorar el Dashboard

```bash
minikube dashboard
```

> 🎯 Tip: Explorá visualmente tus Pods, Deployments, Services y mucho más.

---

## 📝 Tareas del Día

1. ✅ Instalar `kubectl` y `minikube`
2. ✅ Iniciar tu primer clúster con `minikube start`
3. ✅ Verificar que `kubectl` se conecta correctamente
4. ✅ Desplegar y acceder a `hello-minikube`
5. ✅ Abrir y explorar el `minikube dashboard`
6. ✅ Tomar un screenshot de tu clúster funcionando
7. 🆕 **\[Nueva]** Crear un archivo llamado `mi-cluster.md` y anotar:

   * Qué es un Pod, Node y Deployment (en tus palabras)
   * Qué comandos usaste hoy
   * Qué fue lo que más te sorprendió de Kubernetes

---

## 🛠️ Solución de Problemas

<details>
<summary>🧯 Minikube no inicia</summary>

```bash
minikube start --help | grep driver
minikube start --driver=docker  # o virtualbox
```

</details>

<details>
<summary>❌ kubectl no encuentra el clúster</summary>

```bash
kubectl config current-context
kubectl config use-context minikube
```

</details>

---

## 🐳 Alternativa: KIND (Kubernetes IN Docker)

Ideal si ya usás Docker y querés evitar VMs.
Para instalar y probar:

```bash
curl -Lo ./kind https://kind.sigs.k8s.io/dl/v0.20.0/kind-$(uname)-amd64
chmod +x ./kind
sudo mv ./kind /usr/local/bin/kind

kind create cluster
```

> 📌 Ver documentación: [KIND Docs](https://kind.sigs.k8s.io/)

---

## 📚 Recursos Útiles

* 🌐 [Documentación oficial de Kubernetes](https://kubernetes.io/docs/)
* 🧪 [Minikube Docs](https://minikube.sigs.k8s.io/docs/)
* 📜 [Kubectl Cheat Sheet](https://kubernetes.io/docs/reference/kubectl/cheatsheet/)

---

## 🎉 ¡Lo lograste!

Tenés tu primer clúster funcionando.
Mañana exploramos Pods y Deployments a fondo 🚀

📸 ¡Compartí tu progreso en la comunidad con `#DevOpsConRoxs`!


