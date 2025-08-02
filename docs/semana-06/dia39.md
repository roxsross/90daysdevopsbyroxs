---
sidebar_position: 39
---

# Día 39 - Introducción a Helm


## 🎯 Introducción: Helm - El npm de Kubernetes

Gestor de paquetes para Kubernetes - simplifica tus deployments

---

## 🛠️ Prerrequisitos

- ✅ Ambientes del Día 37 funcionando
- ✅ kubectl configurado
- ✅ Conocimiento básico de YAML y deployments

---

## 🧠 ¿Qué es Helm?

| Comparación | Sin Helm | Con Helm |
|-------------|----------|----------|
| **Deploys** | `kubectl apply -f archivo1.yaml archivo2.yaml...` | `helm install mi-app ./chart` |
| **Updates** | Editar YAML + `kubectl apply` | `helm upgrade mi-app ./chart` |
| **Rollback** | Backup manual + `kubectl apply` | `helm rollback mi-app 1` |
| **Variables** | Archivos separados por ambiente | Un template + values.yaml |

### 🎯 Beneficios de Helm:
- **Empaquetado:** Una aplicación = un chart
- **Templating:** Un YAML funciona para dev/staging/prod
- **Versionado:** Rollback fácil a versiones anteriores
- **Reutilización:** Instalar la misma app múltiples veces

---

## 📦 Paso 1: Instalar Helm (5 min)

### 1.1 Instalación por plataforma
```bash
# macOS
brew install helm

# Linux
curl https://raw.githubusercontent.com/helm/helm/main/scripts/get-helm-3 | bash

# Windows
choco install kubernetes-helm

# Verificar instalación
helm version
```

### 1.2 Comandos básicos de Helm
```bash
# Ver charts instalados
helm list

# Buscar charts públicos
helm search hub nginx

# Agregar repositorio de charts
helm repo add bitnami https://charts.bitnami.com/bitnami
helm repo update

# Ver charts disponibles
helm search repo bitnami/nginx
```

---

## 🎯 Paso 2: Crear tu Primer Chart (10 min)

### 2.1 Crear estructura de chart
```bash
# Crear chart desde cero
helm create mi-primera-app

# Ver estructura creada
tree mi-primera-app/
```

**Estructura del chart:**
```
mi-primera-app/
├── Chart.yaml           # Metadata del chart
├── values.yaml          # Valores por defecto
├── charts/              # Dependencies
└── templates/           # Templates YAML
    ├── deployment.yaml
    ├── service.yaml
    ├── ingress.yaml
    └── _helpers.tpl
```

### 2.2 Entender Chart.yaml
```yaml
# Chart.yaml
apiVersion: v2
name: mi-primera-app
description: Mi primera aplicación con Helm
type: application
version: 0.1.0        # Versión del chart
appVersion: "1.0"     # Versión de la app
```

### 2.3 Configurar values.yaml
```yaml
# values.yaml - Valores por defecto
replicaCount: 1

image:
  repository: nginx
  pullPolicy: IfNotPresent
  tag: "latest"

service:
  type: ClusterIP
  port: 80

resources:
  limits:
    cpu: 100m
    memory: 128Mi
  requests:
    cpu: 100m
    memory: 128Mi
```

---

## 🚀 Paso 3: Templates con Variables (15 min)

### 3.1 Template básico - deployment.yaml
```yaml
# templates/deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: {{ include "mi-primera-app.fullname" . }}
  labels:
    {{- include "mi-primera-app.labels" . | nindent 4 }}
spec:
  replicas: {{ .Values.replicaCount }}
  selector:
    matchLabels:
      {{- include "mi-primera-app.selectorLabels" . | nindent 6 }}
  template:
    metadata:
      labels:
        {{- include "mi-primera-app.selectorLabels" . | nindent 8 }}
    spec:
      containers:
      - name: {{ .Chart.Name }}
        image: "{{ .Values.image.repository }}:{{ .Values.image.tag }}"
        imagePullPolicy: {{ .Values.image.pullPolicy }}
        ports:
        - name: http
          containerPort: 80
          protocol: TCP
        resources:
          {{- toYaml .Values.resources | nindent 12 }}
```

### 3.2 Verificar template
```bash
# Ver YAML que se generará
helm template mi-primera-app ./mi-primera-app

# Verificar sintaxis
helm lint ./mi-primera-app
```

### 3.3 Template para service
```yaml
# templates/service.yaml
apiVersion: v1
kind: Service
metadata:
  name: {{ include "mi-primera-app.fullname" . }}
  labels:
    {{- include "mi-primera-app.labels" . | nindent 4 }}
spec:
  type: {{ .Values.service.type }}
  ports:
    - port: {{ .Values.service.port }}
      targetPort: http
      protocol: TCP
      name: http
  selector:
    {{- include "mi-primera-app.selectorLabels" . | nindent 4 }}
```

---

## 🎨 Paso 4: Personalizar Values (10 min)

### 4.1 Values por ambiente
```yaml
# values-dev.yaml
replicaCount: 1
image:
  repository: nginx
  tag: "alpine"
service:
  type: NodePort
resources:
  limits:
    cpu: 50m
    memory: 64Mi
```

```yaml
# values-prod.yaml
replicaCount: 3
image:
  repository: nginx
  tag: "1.21"
service:
  type: LoadBalancer
resources:
  limits:
    cpu: 200m
    memory: 256Mi
```

### 4.2 Usar values específicos
```bash
# Deploy en desarrollo
helm install mi-app-dev ./mi-primera-app \
  --values ./mi-primera-app/values-dev.yaml \
  --namespace dev

# Deploy en producción
helm install mi-app-prod ./mi-primera-app \
  --values ./mi-primera-app/values-prod.yaml \
  --namespace prod
```

---

## 🚀 Paso 5: Instalar y Gestionar Releases (15 min)

### 5.1 Instalar aplicación
```bash
# Instalar en namespace dev
kubectl create namespace dev

helm install mi-app ./mi-primera-app \
  --namespace dev \
  --set replicaCount=2 \
  --set image.tag=alpine

# Ver release instalado
helm list -n dev
```

### 5.2 Actualizar aplicación
```bash
# Cambiar número de réplicas
helm upgrade mi-app ./mi-primera-app \
  --namespace dev \
  --set replicaCount=3

# Ver historial de releases
helm history mi-app -n dev
```

### 5.3 Rollback si algo sale mal
```bash
# Volver a la versión anterior
helm rollback mi-app 1 -n dev

# Ver status del release
helm status mi-app -n dev
```

### 5.4 Comandos útiles de gestión
```bash
# Ver valores actuales del release
helm get values mi-app -n dev

# Ver manifests generados
helm get manifest mi-app -n dev

# Desinstalar completamente
helm uninstall mi-app -n dev
```

---

## 🧪 Paso 6: Ejercicio Práctico (10 min)

### 6.1 Crear chart personalizado
```bash
# Crear chart para nuestra app
helm create devops-app

# Personalizar values.yaml
cat > devops-app/values.yaml << EOF
replicaCount: 2

image:
  repository: nginxdemos/hello
  pullPolicy: IfNotPresent
  tag: "latest"

service:
  type: NodePort
  port: 80
  nodePort: 30080

ingress:
  enabled: false

resources:
  limits:
    cpu: 100m
    memory: 128Mi
  requests:
    cpu: 50m
    memory: 64Mi

# Variables de ambiente personalizadas
env:
  APP_NAME: "DevOps Challenge App"
  ENVIRONMENT: "development"
EOF
```

### 6.2 Actualizar template con variables
```yaml
# Añadir al final de templates/deployment.yaml en spec.containers[0]:
        env:
        - name: APP_NAME
          value: {{ .Values.env.APP_NAME | quote }}
        - name: ENVIRONMENT
          value: {{ .Values.env.ENVIRONMENT | quote }}
```

### 6.3 Instalar y probar
```bash
# Instalar
helm install devops-app ./devops-app --namespace dev

# Verificar
kubectl get pods -n dev
kubectl port-forward -n dev service/devops-app 8080:80

# Acceder a http://localhost:8080
```

---

## 🎉 ¡Felicitaciones!

Ahora sabés:

✅ **Qué es Helm** y por qué usarlo  
✅ **Crear charts** desde cero  
✅ **Templates** con variables dinámicas  
✅ **Instalar y actualizar** aplicaciones  
✅ **Gestionar releases** y hacer rollbacks  

**¡Sos un Helm ninja nivel básico!** ⛵

---

## 💡 Conceptos clave del día

| Concepto | Definición | Ejemplo |
|----------|------------|---------|
| **Chart** | Paquete de archivos que describe una aplicación | `helm create mi-app` |
| **Release** | Instancia de un chart corriendo | `helm install mi-release ./chart` |
| **Values** | Variables para personalizar charts | `replicaCount: 3` |
| **Template** | YAML con variables | `replicas: {{ .Values.replicaCount }}` |

---

## 🔍 Troubleshooting

### ❌ Template no se renderiza
```bash
# Ver template generado sin instalar
helm template mi-app ./mi-chart --debug
```

### ❌ Values no se aplican
```bash
# Verificar valores que se están usando
helm get values mi-app -n dev --all
```

### ❌ Upgrade falla
```bash
# Ver diferencias
helm diff upgrade mi-app ./mi-chart -n dev
```

---

## 🚀 Próximos pasos

**Día 40**: **Volumes Persistentes** - datos que sobreviven  
**Día 41**: **Charts avanzados** con dependencies  
**Día 42**: **Proyecto final** completo con Helm  

---

## 🤔 Reflexión del día

**Preguntate:**
- ¿Cómo Helm simplifica los deployments?
- ¿Qué ventajas tiene vs kubectl apply?
- ¿Cómo organizarías charts para múltiples ambientes?

---

## 🎯 Tarea para casa

1. **📝 Crear un chart** para tu aplicación favorita
2. **🔄 Practicar upgrades** y rollbacks
3. **📊 Explorar charts** en https://artifacthub.io

**Bonus:** 🚀 Instalar una base de datos con Helm desde el repositorio de Bitnami