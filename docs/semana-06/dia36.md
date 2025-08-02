---
title: Día 36 - CI/CD a Kubernetes con GitHub Actions y Runners Escalables
description: Cómo desplegar y escalar GitHub self-hosted runners en Kubernetes usando Actions Runner Controller (ARC)
sidebar_position: 1
---

## ☸️ Despliegue Automático a Kubernetes con CI/CD Escalable usando Dev Containers y Kind

![](../../static/images/banner/6.png)

> "El verdadero poder no es solo crear contenedores… es **orquestarlos automáticamente y escalarlos bajo demanda**."

> **¿Nuevo en CI/CD y Kubernetes?** Hoy verás el flujo más simple para tener runners auto-escalables y un pipeline básico funcionando. ¡No te preocupes por los detalles avanzados!


---

## 🎯 Lo que vas a lograr HOY

- ✅ Cluster de Kubernetes funcionando (con Kind)
- ✅ Actions Runner Controller (ARC) instalado
- ✅ Runners que se crean automáticamente
- ✅ Un despliegue básico funcionando

**Tiempo estimado:** 60 minutos

---

## 🛠️ Prerrequisitos

Necesitás tener instalado:
```bash
# En Ubuntu/Debian
sudo apt update
sudo apt install -y docker.io kubectl

# Instalar Kind
curl -Lo ./kind https://kind.sigs.k8s.io/dl/v0.29.0/kind-linux-amd64
chmod +x ./kind
sudo mv ./kind /usr/local/bin/kind

# Instalar Helm
curl https://raw.githubusercontent.com/helm/helm/main/scripts/get-helm-3 | bash
```
### ¿Qué es Kind?

[Kind](https://kind.sigs.k8s.io/) (Kubernetes IN Docker) es una herramienta para correr clusters de Kubernetes localmente usando contenedores Docker como nodos. Es ideal para pruebas, desarrollo y CI/CD porque permite crear y destruir clusters de forma rápida y sencilla, sin necesidad de máquinas virtuales.

**Ventajas de Kind:**
- Fácil de instalar y usar.
- No requiere recursos elevados.
- Permite simular clusters multi-nodo.
- Perfecto para pipelines de integración continua y pruebas locales.


**Documentación oficial:** [https://kind.sigs.k8s.io/](https://kind.sigs.k8s.io/)
---

## 🚀 Paso 1: Crear Cluster de Kubernetes 

### 1.1 Configurar Kind
Crea `kind-config.yaml`:
```yaml
kind: Cluster
apiVersion: kind.x-k8s.io/v1alpha4
name: arc-cluster
nodes:
- role: control-plane
- role: worker
```

### 1.2 Crear el cluster
```bash
# Crear cluster
kind create cluster --config kind-config.yaml

# Verificar que funciona
kubectl get nodes
```

Deberías ver algo así:
```
NAME                        STATUS   ROLES           AGE   VERSION
arc-cluster-control-plane   Ready    control-plane   1m    v1.27.3
arc-cluster-worker          Ready    <none>          1m    v1.27.3
```

---

## 🔐 Paso 2: Crear GitHub App 

### 2.1 Crear la App
1. Ve a **GitHub → Settings → Developer settings → GitHub Apps**
2. Click **"New GitHub App"**
3. Llena estos campos:
   - **GitHub App name**: `mi-arc-app-RANDOM` (usa números random)
   - **Homepage URL**: `https://github.com`
   - **Webhook URL**: `https://example.com` (no importa)

### 2.2 Configurar permisos
**Repository permissions:**
- **Actions**: Read
- **Metadata**: Read

**Organization permissions:**
- **Self-hosted runners**: Write

### 2.3 Descargar datos importantes
1. **App ID**: Lo ves en la página principal de tu app
2. **Private Key**: Ve a la sección "Private keys" y genera una
3. **Installation ID**: Instala la app en tu repo y saca el ID de la URL

### 2.4 Guardar credenciales
```bash
# Crear archivo con tus datos
cat > arc-secrets.env << EOF
GITHUB_APP_ID=123456  # Tu App ID
GITHUB_APP_INSTALLATION_ID=987654  # Tu Installation ID
EOF

# Guardar private key
# Pega el contenido de tu private key en este archivo:
nano private-key.pem
```

---

## ⚙️ Paso 3: Instalar ARC 

### 3.1 Instalar el Controller
```bash
# Añadir repo de Helm
helm repo add actions-runner-controller https://actions-runner-controller.github.io/actions-runner-controller

# Instalar ARC Controller
helm install arc \
    --namespace arc-systems \
    --create-namespace \
    oci://ghcr.io/actions/actions-runner-controller-charts/gha-runner-scale-set-controller

# Verificar instalación
kubectl get pods -n arc-systems
```

### 3.2 Crear secretos
```bash
# Cargar variables
source arc-secrets.env

# Crear namespace para runners
kubectl create namespace arc-runners

# Crear secreto con credenciales
kubectl create secret generic github-auth \
  --namespace=arc-runners \
  --from-literal=github_app_id="$GITHUB_APP_ID" \
  --from-literal=github_app_installation_id="$GITHUB_APP_INSTALLATION_ID" \
  --from-file=github_app_private_key=private-key.pem
```

### 3.3 Instalar Runner Scale Set
```bash

GITHUB_CONFIG_URL="https://github.com/TU-USUARIO/TU-REPO"

# Instalar runners
helm install mi-runners \
    --namespace arc-runners \
    --set githubConfigUrl="$GITHUB_CONFIG_URL" \
    --set githubConfigSecret=github-auth \
    --set maxRunners=3 \
    --set minRunners=0 \
    oci://ghcr.io/actions/actions-runner-controller-charts/gha-runner-scale-set

# Verificar
kubectl get pods -n arc-runners
```

---

## 📁 Paso 4: Crear Proyecto para Desplegar 

### 4.1 Estructura del proyecto
```bash
mkdir k8s-arc-demo && cd k8s-arc-demo

# Crear estructura
mkdir -p .github/workflows k8s

# Crear Dockerfile simple
cat > Dockerfile << EOF
FROM nginx:alpine
COPY index.html /usr/share/nginx/html/
EXPOSE 80
EOF

# Crear página web
cat > index.html << EOF
<!DOCTYPE html>
<html>
<head>
    <title>ARC Demo</title>
    <style>
        body { font-family: Arial; text-align: center; padding: 50px; }
        h1 { color: #326CE5; }
        .container { max-width: 600px; margin: 0 auto; }
    </style>
</head>
<body>
    <div class="container">
        <h1>🚀 Desplegado con ARC</h1>
        <p>Esta aplicación se desplegó usando GitHub Actions Runners en Kubernetes!</p>
        <p><strong>Timestamp:</strong> $(date)</p>
    </div>
</body>
</html>
EOF
```

### 4.2 Manifiestos de Kubernetes
```bash
# Deployment
cat > k8s/deployment.yaml << EOF
apiVersion: apps/v1
kind: Deployment
metadata:
  name: arc-demo-app
  labels:
    app: arc-demo
spec:
  replicas: 2
  selector:
    matchLabels:
      app: arc-demo
  template:
    metadata:
      labels:
        app: arc-demo
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
EOF

# Service
cat > k8s/service.yaml << EOF
apiVersion: v1
kind: Service
metadata:
  name: arc-demo-service
spec:
  selector:
    app: arc-demo
  ports:
  - port: 80
    targetPort: 80
    nodePort: 30080
  type: NodePort
EOF
```

---

## 🔄 Paso 5: Workflow de CI/CD (10 min)

### 5.1 Crear workflow
```bash
cat > .github/workflows/deploy.yml << 'EOF'
name: Deploy con ARC

on:
  push:
    branches: [main]
  workflow_dispatch:

jobs:
  deploy:
    runs-on: mi-runners  # Usa tus runners de ARC
    
    steps:
    - name: Checkout código
      uses: actions/checkout@v4
      
    - name: Ver info del runner
      run: |
        echo "🏃‍♂️ Ejecutándose en runner ARC"
        echo "Hostname: $(hostname)"
        echo "Usuario: $(whoami)"
        kubectl version --client
        
    - name: Verificar cluster
      run: |
        echo "🔍 Verificando conexión a Kubernetes..."
        kubectl get nodes
        kubectl get namespaces
        
    - name: Aplicar manifiestos
      run: |
        echo "🚀 Desplegando aplicación..."
        kubectl apply -f k8s/deployment.yaml
        kubectl apply -f k8s/service.yaml
        
    - name: Esperar despliegue
      run: |
        echo "⏳ Esperando que el despliegue esté listo..."
        kubectl rollout status deployment/arc-demo-app --timeout=300s
        
    - name: Verificar resultado
      run: |
        echo "✅ Estado final:"
        kubectl get pods -l app=arc-demo
        kubectl get service arc-demo-service
        echo ""
        echo "🌐 Aplicación disponible en:"
        echo "http://localhost:30080 (si tienes port-forward)"
EOF
```

### 5.2 Subir a GitHub
```bash
# Inicializar repo
git init
git add .
git commit -m "Proyecto inicial con ARC"

# Conectar con GitHub (cambia la URL)
git remote add origin https://github.com/TU-USUARIO/TU-REPO.git
git branch -M main
git push -u origin main
```

---

## 🎯 Paso 6: Probar el Despliegue 

### 6.1 Monitorear runners
```bash
# En una terminal aparte, monitorea los runners
watch kubectl get pods -n arc-runners
```

### 6.2 Ejecutar workflow
1. Ve a tu repo en GitHub
2. Pestaña **Actions**
3. Click en **"Deploy con ARC"**
4. Click **"Run workflow"**

### 6.3 Ver logs en tiempo real
- En GitHub Actions verás los logs del workflow
- En tu terminal verás cómo se crean los runners automáticamente

### 6.4 Verificar la aplicación
```bash
# Ver que se desplegó
kubectl get pods -l app=arc-demo
kubectl get svc arc-demo-service

# Acceder a la aplicación
kubectl port-forward service/arc-demo-service 8080:80

# En otra terminal:
curl http://localhost:8080
```

---

## 🔧 Comandos Útiles para Debug

```bash
# Ver todos los pods
kubectl get pods --all-namespaces

# Logs del controller ARC
kubectl logs -n arc-systems -l app.kubernetes.io/name=gha-runner-scale-set-controller

# Logs de un runner específico
kubectl logs -n arc-runners -l app.kubernetes.io/name=gha-runner-scale-set

# Describir un runner
kubectl describe runners -n arc-runners

# Ver eventos
kubectl get events --sort-by=.metadata.creationTimestamp

# Estado del despliegue
kubectl rollout status deployment/arc-demo-app
```

---

## 🚨 Solución de Problemas

### ❌ "No se crean runners"
```bash
# Verificar secretos
kubectl get secrets -n arc-runners

# Ver logs del controller
kubectl logs -n arc-systems deployment/arc-gha-rs-controller
```

### ❌ "El workflow no encuentra kubectl"
El runner necesita acceso al cluster. Esto es avanzado, por ahora usa:
```yaml
# Añade esto a tu workflow si falla:
- name: Setup kubectl
  run: |
    curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl"
    chmod +x kubectl
    sudo mv kubectl /usr/local/bin/
```

### ❌ "No puedo acceder a la aplicación"
```bash
# Verificar service
kubectl get svc arc-demo-service

# Port forward
kubectl port-forward service/arc-demo-service 8080:80
```

---

## 🎉 ¡Felicitaciones!

Acabás de crear:

- ✅ **Cluster de Kubernetes** funcionando
- ✅ **Actions Runner Controller** escalando automáticamente
- ✅ **Pipeline CI/CD** que despliega en K8s
- ✅ **Aplicación web** accesible

**Esto es exactamente lo que usan las empresas grandes.**

---

## 📊 ¿Qué aprendiste?

### Conceptos clave:
- **ARC**: Runners que se crean y destruyen automáticamente
- **Kubernetes**: Orquestación de contenedores
- **CI/CD**: Pipeline automático de despliegue
- **Helm**: Gestor de paquetes para Kubernetes

### Flujo completo:
1. **Push** → GitHub detecta cambios
2. **ARC** → Crea runner en Kubernetes
3. **Runner** → Ejecuta workflow
4. **Kubectl** → Despliega en el cluster
5. **App** → Disponible para usuarios
