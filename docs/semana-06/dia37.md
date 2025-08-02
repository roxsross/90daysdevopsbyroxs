---
title: Día 37 - Múltiples Ambientes en Kubernetes
description: Despliega en dev, staging y prod con GitHub Actions
sidebar_position: 2
---

## 🌍 Múltiples Ambientes con Kubernetes

![](../../static/images/banner/6.png)

> "Un ambiente para probar, otro para validar, y uno para vivir tranquilo en producción."

## 🎯 Lo que harás HOY

- ✅ **Tres ambientes** separados: dev, staging, prod
- ✅ **Deploy automático** según la rama de Git
- ✅ **Configuraciones diferentes** para cada ambiente
- ✅ **Aprobación manual** para producción

**Tiempo:** 30 minutos

---

## 🛠️ Prerrequisitos

- ✅ Cluster Kubernetes funcionando (del Día 36)
- ✅ kubectl configurado
- ✅ Repositorio en GitHub

---

## 🏗️ Paso 1: Crear los Ambientes (5 min)

```bash
# Crear los tres namespaces
kubectl create namespace dev
kubectl create namespace staging  
kubectl create namespace prod

# Verificar
kubectl get namespaces
```

---

## 📁 Paso 2: Estructura de Archivos 

Crea esta estructura en tu repo:

```
k8s/
├── dev/
│   ├── deployment.yaml
│   └── service.yaml
├── staging/
│   ├── deployment.yaml
│   └── service.yaml
└── prod/
    ├── deployment.yaml
    └── service.yaml
```
kubectl create namespace prod

# Verificar que se crearon
kubectl get namespaces | grep -E "(dev|staging|prod)"
```

---

## 📁 Paso 2: Crear Archivos YAML por Ambiente 

### 2.1 Crear estructura simple
```bash
mkdir -p k8s/dev k8s/staging k8s/prod
```

### 2.2 Ambiente de DESARROLLO
Crea `k8s/dev/app-dev.yaml`:
```yaml
# Deployment para desarrollo
apiVersion: apps/v1
kind: Deployment
metadata:
  name: mi-app
  namespace: dev
  labels:
    app: mi-app
    environment: development
spec:
  replicas: 1  # Solo 1 réplica en dev
  selector:
    matchLabels:
      app: mi-app
  template:
    metadata:
      labels:
        app: mi-app
        environment: development
    spec:
      containers:
      - name: app
        image: nginx:alpine
        ports:
        - containerPort: 80
        env:
        - name: ENVIRONMENT
          value: "DEVELOPMENT"
        - name: DEBUG
          value: "true"
        - name: VERSION
          value: "dev-build"
        resources:
          requests:
            memory: "32Mi"
            cpu: "25m"
          limits:
            memory: "64Mi"
            cpu: "50m"
---
# Service para desarrollo
apiVersion: v1
kind: Service
metadata:
  name: mi-app-service
  namespace: dev
  labels:
    app: mi-app
spec:
  selector:
    app: mi-app
  ports:
  - port: 80
    targetPort: 80
    nodePort: 30001
  type: NodePort
```

### 2.3 Ambiente de STAGING
Crea `k8s/staging/app-staging.yaml`:
```yaml
# Deployment para staging
apiVersion: apps/v1
kind: Deployment
metadata:
  name: mi-app
  namespace: staging
  labels:
    app: mi-app
    environment: staging
spec:
  replicas: 2  # 2 réplicas en staging
  selector:
    matchLabels:
      app: mi-app
  template:
    metadata:
      labels:
        app: mi-app
        environment: staging
    spec:
      containers:
      - name: app
        image: nginx:alpine
        ports:
        - containerPort: 80
        env:
        - name: ENVIRONMENT
          value: "STAGING"
        - name: DEBUG
          value: "false"
        - name: VERSION
          value: "staging-build"
        resources:
          requests:
            memory: "64Mi"
            cpu: "50m"
          limits:
            memory: "128Mi"
            cpu: "100m"
---
# Service para staging
apiVersion: v1
kind: Service
metadata:
  name: mi-app-service
  namespace: staging
  labels:
    app: mi-app
spec:
  selector:
    app: mi-app
  ports:
  - port: 80
    targetPort: 80
    nodePort: 30002
  type: NodePort
```

### 2.4 Ambiente de PRODUCCIÓN
Crea `k8s/prod/app-prod.yaml`:
```yaml
# Deployment para producción
apiVersion: apps/v1
kind: Deployment
metadata:
  name: mi-app
  namespace: prod
  labels:
    app: mi-app
    environment: production
spec:
  replicas: 3  # 3 réplicas en producción
  selector:
    matchLabels:
      app: mi-app
  template:
    metadata:
      labels:
        app: mi-app
        environment: production
    spec:
      containers:
      - name: app
        image: nginx:alpine
        ports:
        - containerPort: 80
        env:
        - name: ENVIRONMENT
          value: "PRODUCTION"
        - name: DEBUG
          value: "false"
        - name: VERSION
          value: "prod-v1.0.0"
        resources:
          requests:
            memory: "128Mi"
            cpu: "100m"
          limits:
            memory: "256Mi"
            cpu: "200m"
        # Health checks para producción
        livenessProbe:
          httpGet:
            path: /
            port: 80
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /
            port: 80
          initialDelaySeconds: 5
          periodSeconds: 5
---
# Service para producción
apiVersion: v1
kind: Service
metadata:
  name: mi-app-service
  namespace: prod
  labels:
    app: mi-app
spec:
  selector:
    app: mi-app
  ports:
  - port: 80
    targetPort: 80
    nodePort: 30003
  type: NodePort
```

---

## 🔄 Paso 3: Workflows Automáticos por Rama 

### 3.1 Deploy automático a DESARROLLO
Crea `.github/workflows/deploy-dev.yml`:
```yaml
name: 🛠️ Deploy a DEV

on:
  push:
    branches: [develop]
  workflow_dispatch:

jobs:
  deploy-dev:
    name: Desplegar a Desarrollo
    runs-on: mi-runners
    
    steps:
    - name: Checkout código
      uses: actions/checkout@v4
      
    - name: Verificar cluster
      run: |
        echo "🔍 Verificando conexión..."
        kubectl get nodes
        
    - name: Desplegar a desarrollo
      run: |
        echo "🛠️ Desplegando a DESARROLLO..."
        kubectl apply -f k8s/dev/app-dev.yaml
        
    - name: Esperar que esté listo
      run: |
        echo "⏳ Esperando deployment..."
        kubectl rollout status deployment/mi-app -n dev --timeout=300s
        
    - name: Ver resultado
      run: |
        echo "✅ Estado en DEV:"
        kubectl get pods -n dev
        echo "🌐 Accesible en: http://localhost:30001"
```

### 3.2 Deploy automático a STAGING
Crea `.github/workflows/deploy-staging.yml`:
```yaml
name: 🎭 Deploy a STAGING

on:
  push:
    branches: [main]
  workflow_dispatch:

jobs:
  deploy-staging:
    name: Desplegar a Staging
    runs-on: mi-runners
    
    steps:
    - name: Checkout código
      uses: actions/checkout@v4
      
    - name: Desplegar a staging
      run: |
        echo "🎭 Desplegando a STAGING..."
        kubectl apply -f k8s/staging/app-staging.yaml
        
    - name: Esperar que esté listo
      run: |
        kubectl rollout status deployment/mi-app -n staging --timeout=300s
        
    - name: Verificar deployment
      run: |
        echo "✅ Estado en STAGING:"
        kubectl get pods -n staging
        echo "🌐 Accesible en: http://localhost:30002"
        
    - name: Test básico
      run: |
        echo "🧪 Probando conectividad..."
        kubectl run test-staging --image=curlimages/curl --rm -i --restart=Never -- \
          curl -s http://mi-app-service.staging.svc.cluster.local || echo "Test completado"
```

### 3.3 Deploy manual a PRODUCCIÓN
Crea `.github/workflows/deploy-prod.yml`:
```yaml
name: 🏭 Deploy a PRODUCCIÓN

on:
  workflow_dispatch:
    inputs:
      confirm:
        description: '¿Confirmas el deploy a PRODUCCIÓN? (escribe: SI)'
        required: true
        default: 'NO'

jobs:
  deploy-production:
    name: Desplegar a Producción
    runs-on: mi-runners
    if: github.event.inputs.confirm == 'SI'
    
    steps:
    - name: Checkout código
      uses: actions/checkout@v4
      
    - name: Confirmación de producción
      run: |
        echo "🚨 DESPLEGANDO A PRODUCCIÓN 🚨"
        echo "Rama: ${{ github.ref_name }}"
        echo "Commit: ${{ github.sha }}"
        
    - name: Backup actual
      run: |
        echo "💾 Creando backup..."
        kubectl get deployment mi-app -n prod -o yaml > backup-prod.yaml 2>/dev/null || echo "No hay deployment previo"
        
    - name: Desplegar a producción
      run: |
        echo "🏭 Desplegando a PRODUCCIÓN..."
        kubectl apply -f k8s/prod/app-prod.yaml
        
    - name: Esperar deployment
      run: |
        kubectl rollout status deployment/mi-app -n prod --timeout=600s
        
    - name: Verificar resultado
      run: |
        echo "✅ Estado final en PRODUCCIÓN:"
        kubectl get pods -n prod -o wide
        kubectl get service -n prod
        echo "🌐 Accesible en: http://localhost:30003"
        
    - name: Test de producción
      run: |
        echo "🧪 Test final de producción..."
        kubectl run test-prod --image=curlimages/curl --rm -i --restart=Never -- \
          curl -s http://mi-app-service.prod.svc.cluster.local || echo "Test completado"
        
    - name: Rollback si algo falla
      if: failure()
      run: |
        echo "🔙 ¡Algo falló! Haciendo rollback..."
        if [ -f backup-prod.yaml ]; then
          kubectl apply -f backup-prod.yaml
          echo "✅ Rollback desde backup completado"
        else
          kubectl rollout undo deployment/mi-app -n prod
          echo "✅ Rollback automático completado"
        fi
```

---

## 🎯 Paso 4: Probar Todo el Flujo (5 min)

### 4.1 Crear rama de desarrollo
```bash
# Crear y cambiar a rama develop
git checkout -b develop

# Hacer un cambio pequeño
echo "# Cambio para desarrollo" >> README.md
git add .
git commit -m "Test: deploy a desarrollo"
git push origin develop
```

### 4.2 Ver el flujo completo
1. **Push a `develop`** → Deploy automático a DEV
2. **Merge a `main`** → Deploy automático a STAGING  
3. **Trigger manual** → Deploy a PRODUCCIÓN (con confirmación)

### 4.3 Acceder a cada ambiente
```bash
# Ver todos los ambientes
kubectl get pods -A | grep mi-app

# Acceder a desarrollo
kubectl port-forward -n dev svc/mi-app-service 8001:80
# http://localhost:8001

# Acceder a staging  
kubectl port-forward -n staging svc/mi-app-service 8002:80
# http://localhost:8002

# Acceder a producción
kubectl port-forward -n prod svc/mi-app-service 8003:80
# http://localhost:8003
```

---

## 🛠️ Comandos Útiles para el Día a Día

### Ver estado de todos los ambientes:
```bash
echo "=== DESARROLLO ==="
kubectl get pods -n dev

echo "=== STAGING ==="
kubectl get pods -n staging

echo "=== PRODUCCIÓN ==="
kubectl get pods -n prod
```

### Hacer rollback rápido:
```bash
# Rollback en cualquier ambiente
kubectl rollout undo deployment/mi-app -n dev
kubectl rollout undo deployment/mi-app -n staging
kubectl rollout undo deployment/mi-app -n prod
```

### Ver logs de cada ambiente:
```bash
# Logs de desarrollo
kubectl logs -n dev -l app=mi-app --tail=20

# Logs de staging
kubectl logs -n staging -l app=mi-app --tail=20

# Logs de producción
kubectl logs -n prod -l app=mi-app --tail=20
```

### Eliminar todo si necesitás empezar de nuevo:
```bash
kubectl delete namespace dev staging prod
```

---

## 🎉 ¡Felicitaciones!

Acabás de crear un **pipeline de múltiples ambientes** súper simple:

✅ **Sin herramientas complejas** - Solo YAML y workflows  
✅ **Tres ambientes** completamente separados  
✅ **Deploy automático** por rama de Git  
✅ **Diferentes configuraciones** por ambiente  
✅ **Confirmación manual** para producción  

## 🚀 Flujo que creaste:

1. **Desarrollás** → Push a `develop` → DEV se actualiza automáticamente
2. **Probás** → Merge a `main` → STAGING se actualiza automáticamente  
3. **Validás** → Trigger manual → PRODUCCIÓN se actualiza con confirmación

---

## 💡 ¿Qué aprendiste?

- **Separación de ambientes** con namespaces
- **Configuraciones diferentes** sin herramientas complejas
- **Workflows condicionales** con GitHub Actions
- **Rollback automático** cuando algo falla
- **Buenas prácticas** de deploy a producción

---

## 🚀 Próximos pasos

**Día 38**: Agregar **tests automatizados** antes de cada deploy  
**Día 39**: Implementar **secrets por ambiente**  
**Día 40**: Configurar **monitoreo básico** con comandos simples

---

## 🤔 Reflexión del día

**Preguntate:**
- ¿Cómo te ayuda tener ambientes separados?
- ¿Por qué es importante la confirmación manual en producción?
- ¿Qué diferencias notás entre cada ambiente?

¡**Has creado tu primer pipeline de múltiples ambientes!** 🎊

Esto es exactamente como trabajan las empresas profesionales, pero de forma simple y entendible.

