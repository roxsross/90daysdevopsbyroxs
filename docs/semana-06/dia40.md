---
sidebar_position: 40
---

# Día 40 - CI/CD con GitHub Actions y Helm

## 🎯 Pipeline CI/CD con GitHub Actions y Helm

Automatiza el despliegue de tu aplicación en Kubernetes usando GitHub Actions y Helm

---

## 🛠️ Prerrequisitos

- ✅ Cluster Kubernetes funcionando (día 29)
- ✅ Helm instalado y chart creado (día 39)
- ✅ Repositorio en GitHub
- ✅ Aplicación Dockerizada

---

## 🚀 ¿Qué vamos a construir?

| Paso | Acción | Resultado |
|------|--------|-----------|
| **Push** | Código a GitHub | Trigger automático |
| **Build** | Construir Docker image | Imagen lista |
| **Deploy** | Helm upgrade en K8s | App actualizada |
| **Verify** | Health checks | Deploy exitoso |

### 🎯 Flujo del pipeline:
- **Automatizado:** Push → Build → Deploy
- **Seguro:** Secrets protegidos, namespaces separados
- **Rollback:** Fácil vuelta atrás con Helm
- **Multi-ambiente:** Staging y producción

---

## 🔐 Paso 1: Configurar Secrets en GitHub

### 1.1 Obtener tu kubeconfig
```bash
# Copiar contenido de tu kubeconfig
cat ~/.kube/config
```

### 1.2 Crear secrets en GitHub
Ve a tu repositorio → **Settings** → **Secrets and variables** → **Actions**

**Crear estos secrets:**
- `KUBE_CONFIG`: Pega el contenido completo de tu kubeconfig
- `DOCKER_USERNAME`: Tu usuario de Docker Hub  
- `DOCKER_PASSWORD`: Tu token de Docker Hub

> 💡 **Tip:** Crear token en https://hub.docker.com/settings/security

---

## 🤖 Paso 2: Crear Workflow Simple

### 2.1 Estructura básica
```
mi-proyecto/
├── .github/workflows/
│   └── deploy.yml
├── charts/
│   └── mi-app/
└── Dockerfile
```

### 2.2 Workflow simple y efectivo
Crea `.github/workflows/deploy.yml`:
```yaml
name: Deploy to Kubernetes

on:
  push:
    branches: [ main ]
  workflow_dispatch:

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
    - name: Checkout código
      uses: actions/checkout@v4

    - name: Configurar kubectl
      run: |
        echo "${{ secrets.KUBE_CONFIG }}" | base64 -d > kubeconfig
        export KUBECONFIG=$PWD/kubeconfig
        kubectl cluster-info

    - name: Instalar Helm
      run: |
        curl https://raw.githubusercontent.com/helm/helm/main/scripts/get-helm-3 | bash

    - name: Deploy con Helm
      run: |
        export KUBECONFIG=$PWD/kubeconfig
        helm upgrade --install mi-app ./charts/mi-app \
          --namespace default \
          --create-namespace \
          --wait

    - name: Verificar deploy
      run: |
        export KUBECONFIG=$PWD/kubeconfig
        kubectl get pods
        kubectl get services
---

## 🎨 Paso 3: Personalizar por Ambiente

### 3.1 Values para desarrollo
Crea `charts/mi-app/values-dev.yaml`:
```yaml
replicaCount: 1
service:
  type: NodePort
  nodePort: 30080
env:
  NODE_ENV: development
```

### 3.2 Values para producción  
Crea `charts/mi-app/values-prod.yaml`:
```yaml
replicaCount: 3
service:
  type: LoadBalancer
env:
  NODE_ENV: production
resources:
  limits:
    cpu: 200m
    memory: 256Mi
```

### 3.3 Workflow con múltiples ambientes
```yaml
# En deploy.yml, agregar pasos para diferentes ambientes:
- name: Deploy a Dev
  if: github.ref == 'refs/heads/develop'
  run: |
    helm upgrade --install mi-app-dev ./charts/mi-app \
      --values ./charts/mi-app/values-dev.yaml \
      --namespace dev \
      --create-namespace

- name: Deploy a Prod  
  if: github.ref == 'refs/heads/main'
  run: |
    helm upgrade --install mi-app-prod ./charts/mi-app \
      --values ./charts/mi-app/values-prod.yaml \
      --namespace prod \
      --create-namespace
```

---

## 🧪 Paso 4: Probar el Pipeline

### 4.1 Primer deploy
```bash
# Commit y push para activar el workflow
git add .
git commit -m "feat: setup CI/CD pipeline"
git push origin main
```

### 4.2 Verificar en GitHub
1. Ve a **Actions** en tu repositorio
2. Observa el workflow ejecutándose
3. Verifica que termine exitosamente

### 4.3 Verificar en Kubernetes
```bash
# Ver pods desplegados
kubectl get pods

# Ver servicios
kubectl get services

# Ver releases de Helm
helm list
```

---

## 🔧 Comandos Útiles

### Debugging del workflow
```bash
# Probar Helm localmente
helm template mi-app ./charts/mi-app --debug

# Dry-run del deploy
helm upgrade --install mi-app ./charts/mi-app --dry-run

# Ver logs del pod
kubectl logs -l app=mi-app
```

### Rollback si algo falla
```bash
# Ver historial de releases
helm history mi-app

# Rollback a versión anterior
helm rollback mi-app 1
```

---

## � ¡Felicitaciones!

Ahora tenés:

✅ **Pipeline CI/CD** automatizado con GitHub Actions  
✅ **Deploy automático** con Helm a Kubernetes  
✅ **Multi-ambiente** (dev y producción)  
✅ **Configuración segura** con secrets  

**¡Tu pipeline DevOps está funcionando!** 🚀

---

## � Conceptos clave del día

| Concepto | Definición | Ejemplo |
|----------|------------|---------|
| **Workflow** | Pipeline automatizado | Trigger en push |
| **Secrets** | Variables seguras | KUBE_CONFIG |
| **Helm upgrade** | Deploy/actualización | `helm upgrade --install` |
| **Namespaces** | Separación de ambientes | dev, prod |

---

## 🔍 Troubleshooting

### ❌ Workflow falla
```bash
# Verificar secrets en GitHub
# Settings > Secrets > Actions
```

### ❌ Kubeconfig inválido
```bash
# Verificar formato
echo "$KUBE_CONFIG" | base64 -d > test-config
kubectl --kubeconfig=test-config cluster-info
```

### ❌ Helm deploy falla
```bash
# Verificar chart localmente
helm template mi-app ./charts/mi-app --debug
```

---

## 🚀 Próximos pasos

**Día 41**: **Monitoreo** con Prometheus y Grafana  
**Día 42**: **Proyecto final** completo  

---

## 🤔 Reflexión del día

**Preguntate:**
- ¿Qué otros pasos agregarías al pipeline?
- ¿Cómo mejorarías la seguridad?
- ¿Qué métricas te gustaría monitorear?

---

## 🎯 Tarea para casa

1. **🔄 Probar el pipeline** con diferentes cambios
2. **🔐 Agregar más secrets** para variables sensibles  
3. **� Explorar GitHub Actions** marketplace

**Bonus:** 🚀 Agregar notificaciones a Slack/Discord cuando el deploy sea exitoso
- ¿Cómo implementarías canary deployments?

---

## 🎯 Tarea para casa

1. **🔒 Agregar tests** antes del deploy
2. **📊 Implementar notificaciones** a Slack/Discord
3. **🏗️ Crear environment** de desarrollo adicional

**Bonus:** 🚀 Implementar approval manual para producción

