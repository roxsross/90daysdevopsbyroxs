---
title: Día 36 - CI/CD a Kubernetes con GitHub Actions y Runners Escalables
description: Cómo desplegar y escalar GitHub self-hosted runners en Kubernetes usando Actions Runner Controller (ARC)
sidebar_position: 1
---

## ☸️ Despliegue Automático a Kubernetes con CI/CD Escalable usando Dev Containers y Kind

![](../../static/images/banner/6.png)

> "El verdadero poder no es solo crear contenedores… es **orquestarlos automáticamente y escalarlos bajo demanda**."

Hoy vas a aprender a:

- Configurar **Actions Runner Controller (ARC)** para escalar runners automáticamente
- Crear un **entorno completo con Dev Containers** para desarrollo
- Implementar **GitHub Apps** para autenticación segura
- Automatizar el **despliegue de aplicaciones** con escalado inteligente
- Ver cómo GitHub ejecuta workflows y **escala runners según demanda**

---

## 🛠️ Prerrequisitos

### Herramientas necesarias:
- **Docker** y **Docker Compose**
- **kubectl** y **Helm**
- **Kind** o **Minikube**
- **GitHub CLI** (opcional)
- **VS Code** con extensión Dev Containers

### Cuenta de GitHub:
- Acceso a una **organización** o cuenta personal
- Permisos para crear **GitHub Apps**

---

## 🚀 Paso 1: Configurar el Entorno con Dev Containers

### 1. Estructura del proyecto

```
actions-runner-k8s/
├── .devcontainer/
│   ├── devcontainer.json
│   ├── post-create.sh
│   ├── kind-config.yaml
│   ├── .env.example
│   └── private-key.pem (generado después)
├── .github/workflows/
│   └── deploy-k8s.yml
├── k8s/
│   ├── deployment.yaml
│   └── service.yaml
└── README.md
```

### 2. Configurar Dev Container

`.devcontainer/devcontainer.json`:

```json
{
    "name": "Actions Runner Controller Demo",
    "image": "mcr.microsoft.com/devcontainers/base:bullseye",
    "features": {
        "ghcr.io/devcontainers/features/docker-in-docker:2": {
            "moby": true,
            "azureDnsAutoDetection": true,
            "installDockerBuildx": true,
            "version": "latest",
            "dockerDashComposeVersion": "v2"
        },
        "ghcr.io/devcontainers-contrib/features/kind:1": {
            "version": "latest"
        },
        "ghcr.io/devcontainers/features/kubectl-helm-minikube:1": {
            "version": "latest",
            "helm": "latest",
            "minikube": "none"
        }
    },
    "postCreateCommand": "bash .devcontainer/post-create.sh",
    "shutdownAction": "stopContainer"
}
```

### 3. Configurar cluster Kind

`.devcontainer/kind-config.yaml`:

```yaml
kind: Cluster
apiVersion: kind.x-k8s.io/v1alpha4
nodes:
- role: control-plane
- role: worker
- role: worker
```

---

## 🔐 Paso 2: Crear GitHub App para Autenticación

### 1. Crear la GitHub App

Ve a **Settings → Developer settings → GitHub Apps** y crea una nueva app con estos permisos:

**Repository permissions:**
- **Actions**: read-only
- **Metadata**: read-only

**Organization permissions:**
- **Self-hosted runners**: read and write

### 2. Configurar variables de entorno

`.devcontainer/.env`:

```bash
GITHUB_APP_ID=<TU_GITHUB_APP_ID>
GITHUB_APP_INSTALLATION_ID=<TU_INSTALLATION_ID>
```

### 3. Descargar clave privada

- Ve a **General → Private keys**
- Descarga la clave y guárdala como `.devcontainer/private-key.pem`

---

## ⚙️ Paso 3: Script de Configuración Automática

`.devcontainer/post-create.sh`:

```bash
#!/bin/bash
set -e

echo "🔍 Verificando requisitos..."

# Verificar archivo .env
if [ ! -f .devcontainer/.env ]; then
    echo "❌ Por favor crea un archivo .env en la carpeta .devcontainer"
    exit 1
fi

# Verificar clave privada
if [ ! -f .devcontainer/private-key.pem ]; then
    echo "❌ Por favor descarga tu private-key.pem en la carpeta .devcontainer"
    exit 1
fi

echo "✅ Cargando variables de entorno..."
source .devcontainer/.env

# Configurar cluster Kind
CLUSTER_NAME="arc-demo"
echo "🏗️ Configurando cluster Kubernetes..."

kubectl config unset contexts.${CLUSTER_NAME} 2>/dev/null || true

if kind get clusters 2>/dev/null | grep -q "^${CLUSTER_NAME}$"; then
    echo "🗑️ Eliminando cluster existente..."
    kind delete cluster --name ${CLUSTER_NAME}
fi

echo "🚀 Creando cluster Kind..."
kind create cluster --name ${CLUSTER_NAME} --config .devcontainer/kind-config.yaml

# Instalar Actions Runner Controller
echo "🐈‍⬛ Instalando Actions Runner Controller..."
NAMESPACE="arc-systems"
helm install arc \
    --namespace "${NAMESPACE}" \
    --create-namespace \
    oci://ghcr.io/actions/actions-runner-controller-charts/gha-runner-scale-set-controller

# Configurar Runner Scale Set
INSTALLATION_NAME="roxs-arc-runner-set"
NAMESPACE="arc-runners"
GITHUB_CONFIG_URL="https://github.com/TU-USUARIO"  # 🔄 Cambiar por tu URL

echo "🔑 Creando secretos de configuración..."
GITHUB_PRIVATE_KEY=$(cat .devcontainer/private-key.pem)

kubectl create ns "${NAMESPACE}" || true
kubectl delete secret pre-defined-secret -n "${NAMESPACE}" 2>/dev/null || true
kubectl create secret generic pre-defined-secret \
  --namespace=$NAMESPACE \
  --from-literal=github_app_id="${GITHUB_APP_ID}" \
  --from-literal=github_app_installation_id="${GITHUB_APP_INSTALLATION_ID}" \
  --from-literal=github_app_private_key="${GITHUB_PRIVATE_KEY}"

echo "📦 Instalando Runner Scale Set..."
helm install "${INSTALLATION_NAME}" \
    --namespace "${NAMESPACE}" \
    --create-namespace \
    --set githubConfigUrl="${GITHUB_CONFIG_URL}" \
    --set githubConfigSecret=pre-defined-secret \
    oci://ghcr.io/actions/actions-runner-controller-charts/gha-runner-scale-set

echo "✅ ¡Configuración completada!"
echo "🔍 Verificando pods en arc-systems:"
kubectl get pods -n arc-systems
```

---

## 🔄 Paso 4: Workflow de CI/CD Escalable

`.github/workflows/deploy-k8s.yml`:

```yaml
name: Deploy Escalable a Kubernetes

on:
  push:
    branches: [main]
  workflow_dispatch:

jobs:
  test:
    runs-on: roxs-arc-runner-set  # 🎯 Usa el runner escalable
    steps:
    - name: Checkout código
      uses: actions/checkout@v4
      
    - name: Ejecutar tests
      run: |
        echo "🧪 Ejecutando tests..."
        # Aquí van tus tests reales
        
  build:
    needs: test
    runs-on: roxs-arc-runner-set
    steps:
    - name: Checkout código
      uses: actions/checkout@v4
      
    - name: Build imagen Docker
      run: |
        echo "🏗️ Construyendo imagen..."
        docker build -t mi-app:${{ github.sha }} .
        
  deploy:
    needs: build
    runs-on: roxs-arc-runner-set
    steps:
    - name: Checkout código
      uses: actions/checkout@v4

    - name: Ver contexto actual
      run: |
        echo "🔍 Contexto actual de K8s:"
        kubectl config current-context
        kubectl get nodes

    - name: Aplicar manifiestos
      run: |
        echo "🚀 Desplegando aplicación..."
        kubectl apply -f k8s/deployment.yaml
        kubectl apply -f k8s/service.yaml
        
        echo "⏳ Esperando que el despliegue esté listo..."
        kubectl rollout status deployment/mi-app

    - name: Verificar despliegue
      run: |
        echo "✅ Estado del despliegue:"
        kubectl get pods -o wide
        kubectl get services
        
    - name: Rollback en caso de fallo
      if: failure()
      run: |
        echo "🔙 Ejecutando rollback..."
        kubectl rollout undo deployment/mi-app
```

---

## 📊 Paso 5: Verificar el Escalado Automático

### 1. Ejecutar workflow de prueba

`.github/workflows/test-scaling.yml`:

```yaml
name: Test Escalado de Runners

on:
  workflow_dispatch:

jobs:
  job1:
    runs-on: roxs-arc-runner-set
    steps:
    - run: echo "🎉 Job 1 - Runner escalable!"
    
  job2:
    runs-on: roxs-arc-runner-set
    steps:
    - run: echo "🎉 Job 2 - Runner escalable!"
    
  job3:
    runs-on: roxs-arc-runner-set
    steps:
    - run: echo "🎉 Job 3 - Runner escalable!"
```

### 2. Monitorear pods

```bash
# Ver runners escalándose
watch kubectl get pods -n arc-runners

# Ver logs del controlador
kubectl logs -n arc-systems -l app.kubernetes.io/name=gha-runner-scale-set-controller
```

---

## 📂 Manifiestos de Kubernetes de Ejemplo

`k8s/deployment.yaml`:

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: mi-app
spec:
  replicas: 3
  selector:
    matchLabels:
      app: mi-app
  template:
    metadata:
      labels:
        app: mi-app
    spec:
      containers:
      - name: app
        image: nginx:alpine
        ports:
        - containerPort: 80
        resources:
          requests:
            memory: "64Mi"
            cpu: "50m"
          limits:
            memory: "128Mi"
            cpu: "100m"
```

`k8s/service.yaml`:

```yaml
apiVersion: v1
kind: Service
metadata:
  name: mi-app-service
spec:
  selector:
    app: mi-app
  ports:
  - port: 80
    targetPort: 80
  type: LoadBalancer
```

---

## 🎯 Tarea del Día

### Básico:
1. ✅ Configurar el entorno con Dev Containers
2. ✅ Crear GitHub App con permisos correctos
3. ✅ Desplegar Actions Runner Controller
4. ✅ Ejecutar workflow y ver escalado automático

### Avanzado:
1. 🎁 Configurar límites de escalado
2. 🎁 Implementar monitoreo con Prometheus
3. 🎁 Agregar notificaciones de Slack/Discord
4. 🎁 Configurar múltiples runner pools

### Validación:
- Ver runners apareciendo en GitHub Settings
- Monitorear pods escalándose en tiempo real
- Verificar despliegue exitoso de la aplicación

📸 **Mostrá tu setup funcionando con #DevOpsConRoxs - Día 36**

---

## 🔧 Comandos Útiles para Debugging

```bash
# Ver estado de todos los pods
kubectl get pods --all-namespaces

# Logs del controlador ARC
kubectl logs -n arc-systems deployment/arc-gha-rs-controller

# Logs de un runner específico
kubectl logs -n arc-runners -l app.kubernetes.io/name=gha-runner-scale-set

# Describir runner scale set
kubectl describe runners -n arc-runners

# Ver eventos del cluster
kubectl get events --sort-by=.metadata.creationTimestamp

# Reiniciar el runner scale set
helm upgrade roxs-arc-runner-set \
  --namespace arc-runners \
  --reuse-values \
  oci://ghcr.io/actions/actions-runner-controller-charts/gha-runner-scale-set
```

---

## 🧠 Revisión Rápida

| Pregunta | ✔️ / ❌ |
|----------|---------|
| ¿Qué ventajas tiene ARC sobre runners estáticos? | |
| ¿Cómo se autentica ARC con GitHub? | |
| ¿Cuándo se crean y destruyen los runners? | |
| ¿Cómo monitoreas el estado del escalado? | |
| ¿Qué pasa si falla un despliegue? | |

---

## 🚀 Próximos Pasos

**Día 37 - Monitoreo y Observabilidad:**
- Prometheus + Grafana en K8s
- Alertas inteligentes
- Métricas custom de tus aplicaciones

**Día 38 - Security y Secrets:**
- Vault integration
- Pod Security Standards
- Network Policies

---

## 💡 Tips Pro

### Escalado Inteligente:
- Los runners se crean **solo cuando hay jobs pendientes**
- Se destruyen **automáticamente** cuando terminan
- Puedes configurar **mínimos y máximos**

### Seguridad:
- GitHub Apps son más seguras que tokens PAT
- Los secretos se manejan via Kubernetes Secrets
- Runners aislados por namespace

### Performance:
- Kind es perfecto para desarrollo local
- Para producción considera EKS/GKE/AKS
- Usa node affinity para workloads específicos

---

## 🚀 Cierre del Día

¡Felicitaciones! 🎉 Acabás de implementar un sistema de CI/CD **enterprise-grade** que:

- ⚡ **Escala automáticamente** según demanda
- 🔒 **Usa autenticación segura** con GitHub Apps  
- 🏗️ **Se configura automáticamente** con Dev Containers
- 📊 **Monitorea en tiempo real** el estado de runners
- 🔄 **Maneja rollbacks** automáticamente

Esto es exactamente lo que usan las empresas más grandes del mundo. Tenés ahora un **superpoder** en tu toolkit de DevOps.

Nos vemos en el **Día 37** 