---
title: Día 37 - CI/CD a Kubernetes con GitHub Actions y ARC (Setup Manual)
description: Implementa Actions Runner Controller sin Dev Containers para mayor control y aprendizaje
sidebar_position: 2
---

## ☸️ CI/CD Profesional a Kubernetes - Setup Manual

![](../../static/images/banner/7.png)

> "Dominar la configuración manual te da el **control total** sobre tu infraestructura."

Hoy vas a aprender a:

- Configurar **Actions Runner Controller (ARC)** paso a paso manualmente
- Crear **GitHub Apps** para autenticación enterprise
- Implementar **escalado automático** de runners en K8s
- Configurar **pipelines robustos** con rollback automático
- Entender **cada componente** del sistema a fondo

---

## 🛠️ Prerrequisitos

### Herramientas en tu máquina local:
```bash
# Verificar instalaciones
docker --version
kubectl version --client
helm version
kind --version

# Si falta alguno, instalar:
# Docker: https://docs.docker.com/get-docker/
# kubectl: https://kubernetes.io/docs/tasks/tools/
# Helm: https://helm.sh/docs/intro/install/
# Kind: https://kind.sigs.k8s.io/docs/user/quick-start/
```

### Cuenta de GitHub:
- ✅ Organización o cuenta personal
- ✅ Repositorio con código para desplegar
- ✅ Permisos de administrador

---

## 🚀 Paso 1: Crear Cluster Kubernetes Local

### 1. Configurar cluster Kind con múltiples nodos

`kind-config.yaml`:
```yaml
kind: Cluster
apiVersion: kind.x-k8s.io/v1alpha4
name: arc-cluster
nodes:
- role: control-plane
  kubeadmConfigPatches:
  - |
    kind: InitConfiguration
    nodeRegistration:
      kubeletExtraArgs:
        node-labels: "ingress-ready=true"
  extraPortMappings:
  - containerPort: 80
    hostPort: 80
    protocol: TCP
  - containerPort: 443
    hostPort: 443
    protocol: TCP
- role: worker
  labels:
    tier: "runners"
- role: worker
  labels:
    tier: "apps"
```

### 2. Crear el cluster

```bash
# Eliminar cluster existente si lo hay
kind delete cluster --name arc-cluster 2>/dev/null || true

# Crear nuevo cluster
kind create cluster --config kind-config.yaml

# Verificar que esté funcionando
kubectl cluster-info
kubectl get nodes -o wide
```

### 3. Configurar contexto

```bash
# Asegurar que estamos usando el contexto correcto
kubectl config use-context kind-arc-cluster
kubectl config current-context
```

---

## 🔐 Paso 2: Crear y Configurar GitHub App

### 1. Crear GitHub App

Ve a tu GitHub: **Settings → Developer settings → GitHub Apps → New GitHub App**

**Configuración básica:**
- **Name**: `ARC Runner App - [TU-NOMBRE]`
- **Homepage URL**: `https://github.com/[TU-USUARIO]`
- **Webhook**: Deshabilitado

**Repository permissions:**
- ✅ **Actions**: Read
- ✅ **Contents**: Read  
- ✅ **Metadata**: Read
- ✅ **Pull requests**: Read

**Organization permissions:**
- ✅ **Self-hosted runners**: Write

### 2. Obtener credenciales

Después de crear la app:

```bash
# Anotar estos valores:
echo "GitHub App ID: [APARECE_EN_LA_PÁGINA]"
echo "Installation ID: [VER_PASO_SIGUIENTE]"
```

### 3. Instalar la app en tu organización

- Ir a **Install App** en la sidebar
- Seleccionar tu organización/cuenta
- Elegir repositorios (All o específicos)
- **Anotar la Installation ID** de la URL: `/settings/installations/[INSTALLATION_ID]`

### 4. Generar clave privada

- En **General → Private keys**
- Click **Generate a private key**
- Descargar el archivo `.pem`

---

## ⚙️ Paso 3: Instalar Actions Runner Controller

### 1. Agregar repositorio Helm de ARC

```bash
# Agregar repo oficial de GitHub Actions
helm repo add actions-runner-controller \
  https://actions-runner-controller.github.io/actions-runner-controller

# Actualizar repos
helm repo update
```

### 2. Instalar el controlador principal

```bash
# Crear namespace para el sistema ARC
kubectl create namespace arc-systems

# Instalar ARC usando el nuevo chart
helm install arc \
    --namespace arc-systems \
    --create-namespace \
    oci://ghcr.io/actions/actions-runner-controller-charts/gha-runner-scale-set-controller

# Verificar instalación
kubectl get pods -n arc-systems
kubectl logs -n arc-systems deployment/arc-gha-rs-controller
```

---

## 🏃 Paso 4: Configurar Runner Scale Set

### 1. Crear archivo de configuración

`runner-values.yaml`:
```yaml
githubConfigUrl: "https://github.com/[TU-USUARIO-ORG]"  # 🔄 CAMBIAR
githubConfigSecret: "github-app-secret"

# Configuración de escalado
minRunners: 0
maxRunners: 5

# Configuración del runner
runnerGroup: "default"
runnerScaleSetName: "roxs-k8s-runners"

# Etiquetas para el runner
template:
  spec:
    containers:
    - name: runner
      env:
      - name: RUNNER_FEATURE_FLAG_ONCE
        value: "true"
      resources:
        requests:
          cpu: "100m"
          memory: "128Mi"
        limits:
          cpu: "500m"
          memory: "512Mi"

# Node selector para runners
nodeSelector:
  tier: "runners"
```

### 2. Crear secreto con credenciales

```bash
# Crear namespace para runners
kubectl create namespace arc-runners

# Crear secreto con credenciales de GitHub App
kubectl create secret generic github-app-secret \
  --namespace=arc-runners \
  --from-literal=github_app_id="[TU_APP_ID]" \
  --from-literal=github_app_installation_id="[TU_INSTALLATION_ID]" \
  --from-file=github_app_private_key="[RUTA_A_TU_ARCHIVO].pem"

# Verificar secreto
kubectl get secret github-app-secret -n arc-runners -o yaml
```

### 3. Instalar Runner Scale Set

```bash
# Instalar usando el chart oficial
helm install roxs-k8s-runners \
    --namespace arc-runners \
    --values runner-values.yaml \
    oci://ghcr.io/actions/actions-runner-controller-charts/gha-runner-scale-set

# Verificar instalación
kubectl get pods -n arc-runners
kubectl get runners -n arc-runners
```

### 4. Verificar en GitHub

Ve a tu repo: **Settings → Actions → Runners**
Deberías ver: `roxs-k8s-runners` con estado **Idle**

---

## 📦 Paso 5: Preparar Aplicación de Ejemplo

### 1. Crear manifiestos Kubernetes

`k8s/namespace.yaml`:
```yaml
apiVersion: v1
kind: Namespace
metadata:
  name: mi-app
  labels:
    name: mi-app
```

`k8s/deployment.yaml`:
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: mi-app
  namespace: mi-app
  labels:
    app: mi-app
spec:
  replicas: 3
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxUnavailable: 1
      maxSurge: 1
  selector:
    matchLabels:
      app: mi-app
  template:
    metadata:
      labels:
        app: mi-app
      annotations:
        deployment.kubernetes.io/revision: "1"
    spec:
      nodeSelector:
        tier: "apps"
      containers:
      - name: app
        image: nginx:1.21-alpine
        ports:
        - containerPort: 80
          name: http
        resources:
          requests:
            memory: "64Mi"
            cpu: "50m"
          limits:
            memory: "128Mi"
            cpu: "200m"
        livenessProbe:
          httpGet:
            path: /
            port: 80
          initialDelaySeconds: 10
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /
            port: 80
          initialDelaySeconds: 5
          periodSeconds: 5
        env:
        - name: BUILD_VERSION
          value: "v1.0.0"
```

`k8s/service.yaml`:
```yaml
apiVersion: v1
kind: Service
metadata:
  name: mi-app-service
  namespace: mi-app
  labels:
    app: mi-app
spec:
  type: NodePort
  selector:
    app: mi-app
  ports:
  - port: 80
    targetPort: 80
    nodePort: 30080
    protocol: TCP
    name: http
```

`k8s/ingress.yaml`:
```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: mi-app-ingress
  namespace: mi-app
  annotations:
    nginx.ingress.kubernetes.io/rewrite-target: /
spec:
  rules:
  - host: localhost
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: mi-app-service
            port:
              number: 80
```

---

## 🔄 Paso 6: Workflows de CI/CD Avanzados

### 1. Workflow principal de despliegue

`.github/workflows/deploy-k8s.yml`:
```yaml
name: 🚀 Deploy a Kubernetes

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]
  workflow_dispatch:
    inputs:
      environment:
        description: 'Environment to deploy'
        required: true
        default: 'staging'
        type: choice
        options:
        - staging
        - production

env:
  APP_NAME: mi-app
  NAMESPACE: mi-app

jobs:
  test:
    name: 🧪 Tests
    runs-on: roxs-k8s-runners
    steps:
    - name: Checkout código
      uses: actions/checkout@v4
      
    - name: Verificar conexión a K8s
      run: |
        echo "🔍 Verificando acceso al cluster..."
        kubectl version --short
        kubectl get nodes
        
    - name: Ejecutar tests de lint
      run: |
        echo "🔍 Ejecutando linting..."
        # Aquí van tus tests reales
        echo "✅ Tests passed!"
        
  build:
    name: 🏗️ Build
    needs: test
    runs-on: roxs-k8s-runners
    outputs:
      image-tag: ${{ steps.build.outputs.tag }}
    steps:
    - name: Checkout código
      uses: actions/checkout@v4
      
    - name: Generar tag único
      id: build
      run: |
        TAG="v1.0.0-${GITHUB_SHA::8}"
        echo "tag=$TAG" >> $GITHUB_OUTPUT
        echo "🏷️ Image tag: $TAG"
        
    - name: Simular build de imagen
      run: |
        echo "🏗️ Building Docker image: ${{ env.APP_NAME }}:${{ steps.build.outputs.tag }}"
        # docker build -t ${{ env.APP_NAME }}:${{ steps.build.outputs.tag }} .
        # docker push ${{ env.APP_NAME }}:${{ steps.build.outputs.tag }}
        
  deploy:
    name: 🚀 Deploy
    needs: [test, build]
    runs-on: roxs-k8s-runners
    environment: ${{ github.event.inputs.environment || 'staging' }}
    steps:
    - name: Checkout código
      uses: actions/checkout@v4

    - name: Verificar cluster y contexto
      run: |
        echo "🔍 Información del cluster:"
        kubectl config current-context
        kubectl get nodes -o wide
        kubectl get namespaces

    - name: Crear namespace si no existe
      run: |
        echo "📦 Preparando namespace..."
        kubectl apply -f k8s/namespace.yaml
        
    - name: Backup de configuración actual
      run: |
        echo "💾 Creando backup..."
        kubectl get deployment ${{ env.APP_NAME }} -n ${{ env.NAMESPACE }} -o yaml > backup-deployment.yaml 2>/dev/null || echo "No previous deployment found"
        
    - name: Aplicar manifiestos
      run: |
        echo "🚀 Desplegando aplicación..."
        kubectl apply -f k8s/deployment.yaml
        kubectl apply -f k8s/service.yaml
        kubectl apply -f k8s/ingress.yaml
        
        echo "⏳ Esperando que el despliegue esté listo..."
        kubectl rollout status deployment/${{ env.APP_NAME }} -n ${{ env.NAMESPACE }} --timeout=300s

    - name: Verificar despliegue
      run: |
        echo "✅ Verificando estado final:"
        kubectl get pods -n ${{ env.NAMESPACE }} -o wide
        kubectl get services -n ${{ env.NAMESPACE }}
        kubectl get ingress -n ${{ env.NAMESPACE }}
        
        echo "🌐 Endpoints disponibles:"
        kubectl get endpoints -n ${{ env.NAMESPACE }}
        
    - name: Test de conectividad
      run: |
        echo "🔗 Testeando conectividad..."
        kubectl run curl-test --image=curlimages/curl --rm -i --restart=Never -- \
          curl -s -o /dev/null -w "%{http_code}" http://mi-app-service.${{ env.NAMESPACE }}.svc.cluster.local || true
        
    - name: Rollback en caso de fallo
      if: failure()
      run: |
        echo "🔙 Ejecutando rollback..."
        if [ -f backup-deployment.yaml ]; then
          kubectl apply -f backup-deployment.yaml
          kubectl rollout status deployment/${{ env.APP_NAME }} -n ${{ env.NAMESPACE }}
        else
          kubectl rollout undo deployment/${{ env.APP_NAME }} -n ${{ env.NAMESPACE }}
        fi
        echo "✅ Rollback completado"
```

### 2. Workflow para testing de escalado

`.github/workflows/test-scaling.yml`:
```yaml
name: 🧪 Test Escalado de Runners

on:
  workflow_dispatch:
    inputs:
      jobs_count:
        description: 'Número de jobs paralelos'
        required: true
        default: '3'
        type: string

jobs:
  generate-matrix:
    runs-on: ubuntu-latest
    outputs:
      matrix: ${{ steps.generate.outputs.matrix }}
    steps:
    - id: generate
      run: |
        count=${{ github.event.inputs.jobs_count }}
        matrix=$(seq 1 $count | jq -R . | jq -s .)
        echo "matrix=$matrix" >> $GITHUB_OUTPUT

  parallel-jobs:
    needs: generate-matrix
    runs-on: roxs-k8s-runners
    strategy:
      matrix:
        job: ${{ fromJson(needs.generate-matrix.outputs.matrix) }}
    steps:
    - name: Job ${{ matrix.job }}
      run: |
        echo "🎉 Job ${{ matrix.job }} ejecutándose en runner escalable!"
        echo "🖥️ Hostname: $(hostname)"
        echo "📊 Recursos disponibles:"
        echo "CPU: $(nproc) cores"
        echo "RAM: $(free -h | grep Mem | awk '{print $2}')"
        echo "⏰ Simulando trabajo..."
        sleep 30
        echo "✅ Job ${{ matrix.job }} completado!"

  monitor-scaling:
    runs-on: roxs-k8s-runners
    steps:
    - name: Monitorear runners
      run: |
        echo "📊 Monitoreando escalado de runners..."
        for i in {1..10}; do
          echo "--- Iteración $i ---"
          kubectl get pods -n arc-runners
          kubectl get runners -n arc-runners 2>/dev/null || echo "No runners CRD found"
          sleep 15
        done
```

---

## 📊 Paso 7: Monitoreo y Verificación

### 1. Scripts de monitoreo

`scripts/monitor-cluster.sh`:
```bash
#!/bin/bash

echo "🔍 Estado del Cluster Kubernetes"
echo "================================"

echo -e "\n📊 Nodos:"
kubectl get nodes -o wide

echo -e "\n🏃 Runners (ARC):"
kubectl get pods -n arc-systems
kubectl get pods -n arc-runners

echo -e "\n📦 Aplicaciones:"
kubectl get pods -n mi-app -o wide

echo -e "\n🌐 Servicios:"
kubectl get services --all-namespaces

echo -e "\n📈 Uso de recursos:"
kubectl top nodes 2>/dev/null || echo "Metrics server no disponible"
kubectl top pods --all-namespaces 2>/dev/null || echo "Metrics server no disponible"

echo -e "\n📋 Eventos recientes:"
kubectl get events --sort-by=.metadata.creationTimestamp --all-namespaces | tail -10
```

### 2. Script de diagnóstico

`scripts/debug-arc.sh`:
```bash
#!/bin/bash

echo "🔧 Diagnóstico de Actions Runner Controller"
echo "==========================================="

echo -e "\n📊 Estado de ARC Controller:"
kubectl get pods -n arc-systems -o wide
kubectl describe deployment arc-gha-rs-controller -n arc-systems

echo -e "\n🏃 Estado de Runner Scale Set:"
kubectl get pods -n arc-runners -o wide
kubectl get runners -n arc-runners 2>/dev/null || echo "No runners CRD found"

echo -e "\n📋 Logs del Controller:"
kubectl logs -n arc-systems deployment/arc-gha-rs-controller --tail=20

echo -e "\n📋 Logs del Listener:"
kubectl logs -n arc-runners -l app.kubernetes.io/name=gha-runner-scale-set --tail=20

echo -e "\n🔐 Secretos:"
kubectl get secrets -n arc-runners
kubectl describe secret github-app-secret -n arc-runners

echo -e "\n⚙️ ConfigMaps:"
kubectl get configmaps -n arc-runners
```

### 3. Hacer scripts ejecutables

```bash
chmod +x scripts/*.sh
```

---

## 🎯 Tareas del Día

### ✅ **Básico - Configuración:**
1. Crear cluster Kind con múltiples nodos
2. Configurar GitHub App con permisos correctos  
3. Instalar ARC manualmente con Helm
4. Desplegar Runner Scale Set funcionando

### ✅ **Intermedio - CI/CD:**
5. Crear workflow completo con test/build/deploy
6. Implementar rollback automático
7. Probar despliegue de aplicación real
8. Verificar escalado con jobs paralelos

### 🎁 **Avanzado - Optimización:**
9. Configurar límites de recursos en runners
10. Implementar health checks en aplicación
11. Agregar monitoreo de métricas
12. Configurar alertas por Slack/Discord

---

## 🔧 Comandos Esenciales de Troubleshooting

```bash
# 🔍 Estado general del cluster
kubectl get all --all-namespaces

# 🏃 Verificar runners específicamente  
kubectl get pods -n arc-runners -w
kubectl logs -n arc-runners -l app.kubernetes.io/name=gha-runner-scale-set -f

# 📊 Monitorear eventos en tiempo real
kubectl get events --watch --all-namespaces

# 🔧 Reiniciar componentes si es necesario
kubectl rollout restart deployment/arc-gha-rs-controller -n arc-systems
helm upgrade roxs-k8s-runners -n arc-runners --reuse-values \
  oci://ghcr.io/actions/actions-runner-controller-charts/gha-runner-scale-set

# 🧹 Limpiar recursos (si necesario)
kubectl delete namespace arc-runners
kubectl delete namespace arc-systems
kind delete cluster --name arc-cluster
```

---

## 🧠 Revisión del Día

| Concepto | ¿Lo dominas? | Notas |
|----------|--------------|-------|
| Configuración manual de ARC | ✔️ / ❌ | |
| GitHub Apps vs PAT tokens | ✔️ / ❌ | |
| Escalado automático de runners | ✔️ / ❌ | |
| Rollback automático en K8s | ✔️ / ❌ | |
| Debugging de pods y deployments | ✔️ / ❌ | |
| Monitoreo de recursos del cluster | ✔️ / ❌ | |

---

## 💡 Pro Tips del Día

### 🚀 **Performance:**
- Usa `nodeSelector` para colocar runners y apps en nodos específicos
- Configura `resources.requests` y `resources.limits` apropiados
- El escalado automático puede tardar 30-60 segundos

### 🔒 **Seguridad:**
- GitHub Apps son más seguras que PAT tokens
- Nunca hardcodees credenciales en workflows
- Usa `secrets` de Kubernetes para datos sensibles

### 🔧 **Debugging:**
- `kubectl describe` te da más info que `kubectl get`
- Los logs del controller ARC son clave para troubleshooting
- `kubectl get events` muestra qué está pasando en tiempo real

### 📊 **Monitoreo:**
- Instala metrics-server para ver uso de CPU/RAM: `kubectl apply -f https://github.com/kubernetes-sigs/metrics-server/releases/latest/download/components.yaml`
- Usa `watch kubectl get pods` para monitoreo continuo
- Los runners idle consumen recursos mínimos

---

## 🚀 Próximos Pasos

**Día 38 - Monitoreo y Observabilidad:**
- Prometheus + Grafana en el cluster
- Alerting inteligente con AlertManager  
- Métricas custom de aplicaciones
- Dashboards profesionales

**Día 39 - Security Hardening:**
- Network Policies para aislamiento
- Pod Security Standards
- Secrets management con External Secrets
- RBAC granular

---

## 🎉 Cierre del Día

¡Excelente trabajo! 🎊 Hoy configuraste manualmente un sistema de CI/CD **enterprise-grade** sin depender de herramientas automáticas. Esto te da:

- 🎯 **Control total** sobre cada componente
- 🔧 **Conocimiento profundo** para troubleshooting  
- 💪 **Habilidades transferibles** a cualquier cluster K8s
- 🚀 **Base sólida** para entornos de producción

El setup manual te convierte en un **DevOps Engineer más completo** porque entendés cada pieza del puzzle.

📸 **Comparte tu cluster funcionando con #DevOpsConRoxs - Día 37**
