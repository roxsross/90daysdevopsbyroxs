---
title: Día 36 - CI/CD a Kubernetes con GitHub Actions y Runner Local
description: Automatizar despliegues a un clúster local usando Minikube o Kind y un runner self-hosted
sidebar_position: 1
---

## ☸️ Despliegue Automático a Kubernetes con CI/CD

![](../../static/images/banner/6.png)

> "El verdadero poder no es solo crear contenedores… es **orquestarlos automáticamente**."

Hoy vas a aprender a:

- Crear un **self-hosted runner dentro de un clúster local de Kubernetes (Minikube o Kind)**
- Automatizar el **despliegue de una aplicación** con GitHub Actions
- Ver cómo GitHub ejecuta el workflow y **hace deploy directo a tu cluster K8s**

---

## 🛠️ Prerrequisitos

- Tener instalado:
  - Docker
  - kubectl
  - Minikube o Kind
  - Helm (opcional)
  - GitHub CLI

- Tener acceso a un repo en GitHub con una app containerizada

---

## 🔁 Paso 1: Iniciar clúster local

### Opción 1: Minikube

```bash
minikube start --driver=docker
kubectl get nodes
````

### Opción 2: Kind

```bash
kind create cluster --name roxs-devops
kubectl cluster-info
```

---

## 🏃 Paso 2: Instalar el runner en un Pod

### 1. Crear namespace

```bash
kubectl create namespace github-runner
```

### 2. Crear un `Deployment` para el runner

```yaml
# github-runner.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: runner-roxs
  namespace: github-runner
spec:
  replicas: 1
  selector:
    matchLabels:
      app: runner-roxs
  template:
    metadata:
      labels:
        app: runner-roxs
    spec:
      containers:
        - name: runner
          image: myoung34/github-runner:latest
          env:
            - name: REPO_URL
              value: "https://github.com/TU-USUARIO/TU-REPO"
            - name: RUNNER_NAME
              value: "rox-k8s-runner"
            - name: RUNNER_TOKEN
              value: "TOKEN_GENERADO"
            - name: LABELS
              value: "self-hosted,k8s"
            - name: RUNNER_WORKDIR
              value: "/tmp/runner"
```

```bash
kubectl apply -f github-runner.yaml
```

📌 Token generado desde GitHub → Settings → Actions → Runners → Add → New self-hosted runner

---

## ⚙️ Paso 3: Crear workflow de despliegue a K8s

`.github/workflows/deploy-k8s.yml`

```yaml
name: Deploy a Kubernetes

on:
  push:
    branches: [main]
  workflow_dispatch:

jobs:
  deploy:
    runs-on: [self-hosted, k8s]
    steps:
    - name: Checkout código
      uses: actions/checkout@v4

    - name: Ver contexto actual
      run: kubectl config current-context

    - name: Aplicar manifiestos
      run: |
        kubectl apply -f k8s/deployment.yaml
        kubectl apply -f k8s/service.yaml

    - name: Ver estado
      run: kubectl get pods -o wide
```

---

## 📂 Estructura mínima del proyecto

```
tu-proyecto/
├── .github/workflows/deploy-k8s.yml
├── k8s/
│   ├── deployment.yaml
│   └── service.yaml
├── app/
│   └── Dockerfile
```

---

## 🎯 Tarea del Día

1. Crear un cluster con Minikube o Kind
2. Instalar el runner dentro del cluster
3. Crear un workflow que aplique manifiestos de K8s
4. Validar que el deploy se ejecuta automáticamente

🎁 Bonus: Agregá rollback con `kubectl rollout undo`
📸 Mostrá el pod corriendo con **#DevOpsConRoxs - Día 36**

---

## 🧠 Revisión rápida

| Pregunta                                      | ✔️ / ❌ |
| --------------------------------------------- | ------ |
| ¿Qué es un self-hosted runner?                |        |
| ¿Podés ejecutar uno dentro de un cluster K8s? |        |
| ¿Qué hace el workflow de deploy?              |        |
| ¿Cómo ves los pods desplegados?               |        |

---

## 🚀 Cierre del Día

Hoy desplegaste usando lo mejor de dos mundos: **GitHub Actions + Kubernetes local**.
Tenés ahora un entorno CI/CD 100% controlado por vos.
Mañana vamos a seguir explorando despliegues y prácticas pro para producción.

Nos vemos en el **Día 37** 🧠☁️

