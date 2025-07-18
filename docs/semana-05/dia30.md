---
title: Día 30 -  Pods y Deployments
description: Trabajando con las unidades básicas de Kubernetes
sidebar_position: 2
---


## 🎯 Pods y Deployments - Los Bloques Fundamentales

![](../../static/images/banner/5.png)

Hoy damos un salto clave en Kubernetes: aprenderás a dominar los **Pods** y **Deployments**, la base de toda aplicación moderna en la nube.

> 🚀 **Motivación:** Entender estos recursos te permitirá desplegar, escalar y actualizar aplicaciones como lo hacen los equipos DevOps de clase mundial.

---

## 🧩 ¿Qué es un Pod? (La cápsula de tu app)

Un **Pod** es la unidad más pequeña y básica en Kubernetes. Imagina un Pod como una "cápsula" que contiene uno o más contenedores que siempre viajan juntos, compartiendo red y almacenamiento.

- 🐳 **Contenedores**: Generalmente uno, pero pueden ser varios (sidecars, init, etc).
- 💾 **Volúmenes**: Espacio compartido entre los contenedores del Pod.
- 🌐 **IP única**: Cada Pod tiene su propia IP dentro del clúster.
- ⚙️ **Spec**: Define cómo y con qué variables se ejecutan los contenedores.

> 💡 **Analogía:** Un Pod es como una "nave espacial" con uno o más astronautas (contenedores) que comparten oxígeno (red) y recursos (almacenamiento).

### Características importantes
- Los Pods son **efímeros**: pueden morir y ser reemplazados.
- Los contenedores en un Pod **comparten red y almacenamiento**.
- **No se recomienda** crear Pods manualmente en producción: usa Deployments.

---

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


## 🚀 ¿Qué es un Deployment? (El director de orquesta)

Un **Deployment** es un recurso que gestiona y automatiza la creación, actualización y escalado de Pods. Es el "director de orquesta" que asegura que siempre haya el número correcto de Pods funcionando.

- 📊 **Mantiene** el número deseado de réplicas (ReplicaSet)
- 🔄 **Actualiza** tus apps sin downtime (rolling updates)
- ⏮️ Permite hacer **rollback** a versiones anteriores
- 🛡️ **Reemplaza** Pods que fallan automáticamente

> 🔗 **Relación:**
> - **Deployment** crea y gestiona **ReplicaSets**.
> - **ReplicaSet** mantiene la cantidad de **Pods**.
> - **Pod** ejecuta los contenedores.

---

---


## 🛠️ Creando Pods: Imperativo vs Declarativo

### 🖥️ Método Imperativo (rápido, para pruebas)

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

### 📄 Método Declarativo (profesional, reproducible)

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
      resources:
        requests:
          memory: "32Mi"
          cpu: "100m"
        limits:
          memory: "64Mi"
          cpu: "200m"
      livenessProbe:
        httpGet:
          path: /
          port: 80
        initialDelaySeconds: 5
        periodSeconds: 10
      readinessProbe:
        httpGet:
          path: /
          port: 80
        initialDelaySeconds: 5
        periodSeconds: 10
```

```bash
# Aplicar el archivo YAML
kubectl apply -f mi-pod.yaml

# Ver el pod
kubectl get pods -o wide
```

> 🛡️ **Tip:** Usa probes para mejorar la resiliencia de tus Pods.

---

---


## 📦 Trabajando con Deployments

### 🖥️ Imperativo (rápido)

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

### 📄 Declarativo (profesional)

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
          livenessProbe:
            httpGet:
              path: /
              port: 80
            initialDelaySeconds: 5
            periodSeconds: 10
          readinessProbe:
            httpGet:
              path: /
              port: 80
            initialDelaySeconds: 5
            periodSeconds: 10
```

```bash
# Aplicar el deployment
kubectl apply -f mi-deployment.yaml

# Ver el estado
kubectl get deployments
kubectl get pods
```

---

---


## 🔄 Actualizaciones, Rollbacks y Estrategias

### Rolling Update (actualización progresiva)

```bash
# Actualizar la imagen
kubectl set image deployment/nginx-deployment nginx=nginx:1.21

# Ver el progreso
kubectl rollout status deployment/nginx-deployment

# Ver historial
kubectl rollout history deployment/nginx-deployment
```

### Rollback

```bash
# Volver a la versión anterior
kubectl rollout undo deployment/nginx-deployment

# Volver a una versión específica
kubectl rollout undo deployment/nginx-deployment --to-revision=1
```

### Blue/Green y Canary (avanzado)

> 💡 Investiga sobre estrategias de despliegue como **blue/green** y **canary** para minimizar riesgos en producción.

---

---


## 🧪 Ejercicio Práctico y Desafío

Vamos a crear un deployment más completo, con variables de entorno, recursos y probes.

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
          livenessProbe:
            httpGet:
              path: /
              port: 80
            initialDelaySeconds: 5
            periodSeconds: 10
          readinessProbe:
            httpGet:
              path: /
              port: 80
            initialDelaySeconds: 5
            periodSeconds: 10
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

### 🏆 Desafío extra
- Modifica el número de réplicas y observa el comportamiento.
- Cambia la imagen a una versión diferente y observa el rolling update.
- Agrega un segundo contenedor (sidecar) al pod.

---

---


## 🔍 Comandos Útiles para Debug y Observabilidad

```bash
# Ver logs de un pod específico
kubectl logs <nombre-pod>

# Ver logs en tiempo real
kubectl logs -f <nombre-pod>

# Ejecutar comandos dentro de un pod
kubectl exec -it <nombre-pod> -- /bin/bash

# Ver eventos del clúster
kubectl get events --sort-by=.metadata.creationTimestamp

# Ver recursos utilizados (requiere metrics-server)
kubectl top pods

# Ver estado de los deployments
kubectl rollout status deployment/<nombre-deployment>

# Ver ReplicaSets
kubectl get replicasets
```

> 📈 **Tip:** Instala metrics-server para monitorear recursos en tiempo real.

---

---


## 📝 Tareas del Día

1. ✅ Crear un Pod usando comando imperativo
2. ✅ Crear un Pod usando archivo YAML (con probes y recursos)
3. ✅ Crear un Deployment con 3 réplicas
4. ✅ Escalar el Deployment a 5 réplicas
5. ✅ Actualizar la imagen del Deployment y observar el rolling update
6. ✅ Hacer rollback a la versión anterior
7. ✅ Crear el deployment del ejercicio práctico
8. ✅ Experimentar con los comandos de debug y monitoreo
9. 🏅 **Extra:** Agregar un sidecar o probar probes personalizados

---

---


## 🎨 Estructura de un archivo YAML (comentado)

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
          # Puedes agregar puertos, recursos, probes, env, etc.
```

---

---


## 🆘 Troubleshooting y Preguntas Frecuentes

**Pod en estado Pending:**
```bash
kubectl describe pod <nombre-pod>
# Buscar en "Events" la causa del problema (falta de recursos, imagen no encontrada, etc)
```

**Pod crasheando:**
```bash
kubectl logs <nombre-pod>
kubectl logs <nombre-pod> --previous  # Logs del contenedor anterior
kubectl describe pod <nombre-pod>
```

**Deployment no actualiza:**
```bash
kubectl get replicasets
kubectl describe deployment <nombre-deployment>
kubectl rollout status deployment/<nombre-deployment>
```

**No puedes acceder al contenedor:**
```bash
kubectl exec -it <nombre-pod> -- /bin/sh
# O prueba /bin/bash según la imagen
```

**¿Cómo saber si un pod está listo?**
```bash
kubectl get pods
# Columna STATUS debe ser Running y READY 1/1
```

**¿Cómo ver los recursos consumidos?**
```bash
kubectl top pods
```

---

---


## 🔗 Recursos y Checklist de Dominio

- [Pod Specification](https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.28/#pod-v1-core)
- [Deployment Specification](https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.28/#deployment-v1-apps)
- [YAML Best Practices](https://kubernetes.io/docs/concepts/configuration/overview/)
- [Probes en Kubernetes](https://kubernetes.io/docs/tasks/configure-pod-container/configure-liveness-readiness-startup-probes/)
- [Multi-container Pods](https://kubernetes.io/docs/concepts/workloads/pods/#multi-container-pods)
- [Kubernetes Patterns](https://kubernetes.io/docs/concepts/cluster-administration/networking/)

> ✅ **Checklist de dominio:**
- [ ] Crear y entender Pods y Deployments (imperativo y declarativo)
- [ ] Usar probes y recursos
- [ ] Escalar, actualizar y hacer rollback
- [ ] Debuggear y monitorear pods
- [ ] Leer y escribir YAML correctamente

---

🎉 **¡Perfecto!** Ya dominas los conceptos fundamentales de Pods y Deployments. Mañana aprenderemos sobre Services para exponer nuestras aplicaciones.

**¡Comparte tu progreso con #DevOpsConRoxs!** 🚀