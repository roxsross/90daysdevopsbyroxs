---
title: Día 30 -  Pods y Deployments
description: Trabajando con las unidades básicas de Kubernetes
sidebar_position: 2
---

## 🎯 Pods y Deployments - Los Bloques Fundamentales

![](../../static/images/banner/5.png)

¡Hoy vamos a profundizar en los componentes más importantes de Kubernetes!  
Entenderemos cómo funcionan los **Pods** y **Deployments**, y cómo crearlos tanto de forma imperativa como declarativa.

---

## 🧩 ¿Qué es un Pod?

Un **Pod** es la unidad más pequeña y básica en Kubernetes. Piensa en él como una "cápsula" que contiene:

- 🐳 Uno o más contenedores (generalmente uno)
- 💾 Almacenamiento compartido (volúmenes)
- 🌐 Una dirección IP única
- ⚙️ Información sobre cómo ejecutar los contenedores

### Características importantes:
- Los Pods son **efímeros** (pueden morir y renacer)
- Los contenedores en un Pod **comparten red y almacenamiento**
- Generalmente NO creamos Pods directamente, sino a través de Deployments

---

## 🚀 ¿Qué es un Deployment?

Un **Deployment** es un controlador que gestiona Pods de forma inteligente:

- 📊 **Mantiene** el número deseado de réplicas
- 🔄 **Actualiza** aplicaciones de forma controlada
- ⏮️ Permite hacer **rollback** a versiones anteriores
- 🛡️ **Reemplaza** Pods que fallan automáticamente

---

## 🛠️ Creando tu Primer Pod

### Método Imperativo (línea de comandos)

```bash
# Crear un pod simple
kubectl run mi-nginx --image=nginx:latest

# Ver el pod creado
kubectl get pods

# Describir el pod (información detallada)
kubectl describe pod mi-nginx

# Ver logs del pod
kubectl logs mi-nginx

# Eliminar el pod
kubectl delete pod mi-nginx
```

### Método Declarativo (archivo YAML)

Crea un archivo `mi-pod.yaml`:

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: mi-nginx-pod
  labels:
    app: nginx
spec:
  containers:
  - name: nginx-container
    image: nginx:latest
    ports:
    - containerPort: 80
```

```bash
# Aplicar el archivo YAML
kubectl apply -f mi-pod.yaml

# Ver el pod
kubectl get pods -o wide
```

---

## 📦 Trabajando con Deployments

### Crear un Deployment Imperativo

```bash
# Crear deployment con 3 réplicas
kubectl create deployment mi-app --image=nginx:latest --replicas=3

# Ver deployments
kubectl get deployments

# Ver pods creados por el deployment
kubectl get pods -l app=mi-app

# Escalar el deployment
kubectl scale deployment mi-app --replicas=5
```

### Crear un Deployment Declarativo

Crea un archivo `mi-deployment.yaml`:

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: nginx-deployment
  labels:
    app: nginx
spec:
  replicas: 3
  selector:
    matchLabels:
      app: nginx
  template:
    metadata:
      labels:
        app: nginx
    spec:
      containers:
      - name: nginx
        image: nginx:1.20
        ports:
        - containerPort: 80
        resources:
          requests:
            memory: "64Mi"
            cpu: "250m"
          limits:
            memory: "128Mi"
            cpu: "500m"
```

```bash
# Aplicar el deployment
kubectl apply -f mi-deployment.yaml

# Ver el estado
kubectl get deployments
kubectl get pods
```

---

## 🔄 Actualizaciones y Rollbacks

### Actualizar un Deployment

```bash
# Actualizar la imagen (rolling update)
kubectl set image deployment/nginx-deployment nginx=nginx:1.21

# Ver el progreso de la actualización
kubectl rollout status deployment/nginx-deployment

# Ver el historial de actualizaciones
kubectl rollout history deployment/nginx-deployment
```

### Hacer Rollback

```bash
# Volver a la versión anterior
kubectl rollout undo deployment/nginx-deployment

# Volver a una versión específica
kubectl rollout undo deployment/nginx-deployment --to-revision=1
```

---

## 🧪 Ejercicio Práctico

Vamos a crear un deployment más complejo:

Crea `web-app-deployment.yaml`:

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: web-app
  labels:
    app: web-app
spec:
  replicas: 2
  selector:
    matchLabels:
      app: web-app
  template:
    metadata:
      labels:
        app: web-app
    spec:
      containers:
      - name: web-container
        image: httpd:2.4
        ports:
        - containerPort: 80
        env:
        - name: ENVIRONMENT
          value: "development"
        resources:
          requests:
            memory: "32Mi"
            cpu: "100m"
          limits:
            memory: "64Mi"
            cpu: "200m"
```

```bash
# Desplegar la aplicación
kubectl apply -f web-app-deployment.yaml

# Verificar que todo esté funcionando
kubectl get deployments
kubectl get pods -l app=web-app

# Ver detalles de un pod
kubectl describe pod <nombre-del-pod>
```

---

## 🔍 Comandos Útiles para Debug

```bash
# Ver logs de un pod específico
kubectl logs <nombre-pod>

# Ver logs en tiempo real
kubectl logs -f <nombre-pod>

# Ejecutar comandos dentro de un pod
kubectl exec -it <nombre-pod> -- /bin/bash

# Ver eventos del clúster
kubectl get events --sort-by=.metadata.creationTimestamp

# Ver recursos utilizados
kubectl top pods
```

---

## 📝 Tareas del Día

1. ✅ Crear un Pod usando comando imperativo
2. ✅ Crear un Pod usando archivo YAML
3. ✅ Crear un Deployment con 3 réplicas
4. ✅ Escalar el Deployment a 5 réplicas
5. ✅ Actualizar la imagen del Deployment
6. ✅ Hacer rollback a la versión anterior
7. ✅ Crear el deployment del ejercicio práctico
8. ✅ Experimentar con los comandos de debug

---

## 🎨 Estructura de un archivo YAML

```yaml
# Versión de la API de Kubernetes
apiVersion: apps/v1

# Tipo de recurso que estamos creando
kind: Deployment

# Metadatos del recurso
metadata:
  name: mi-app
  labels:
    app: mi-app

# Especificación del recurso (lo que queremos)
spec:
  replicas: 3
  selector:
    matchLabels:
      app: mi-app
  template:  # Plantilla para los Pods
    metadata:
      labels:
        app: mi-app
    spec:  # Especificación del Pod
      containers:
      - name: mi-contenedor
        image: nginx:latest
```

---

## 🆘 Solución de Problemas

**Pod en estado Pending:**
```bash
kubectl describe pod <nombre-pod>
# Buscar en "Events" la causa del problema
```

**Pod crasheando:**
```bash
kubectl logs <nombre-pod>
kubectl logs <nombre-pod> --previous  # Logs del contenedor anterior
```

**Deployment no actualiza:**
```bash
kubectl get replicasets
kubectl describe deployment <nombre-deployment>
```

---

## 🔗 Recursos para Profundizar

- [Pod Specification](https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.28/#pod-v1-core)
- [Deployment Specification](https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.28/#deployment-v1-apps)
- [YAML Best Practices](https://kubernetes.io/docs/concepts/configuration/overview/)

---

🎉 **¡Perfecto!** Ya dominas los conceptos fundamentales de Pods y Deployments. Mañana aprenderemos sobre Services para exponer nuestras aplicaciones.

**¡Comparte tu progreso con #DevOpsConRoxs!** 🚀