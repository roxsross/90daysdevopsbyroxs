---
title: Día 37 - Buenas Prácticas de Despliegue en Kubernetes
description: Estrategias de rollout, readiness, liveness y rollback automático
sidebar_position: 7
---

## 🔁 Despliegues en Kubernetes

![](../../static/images/banner/6.png)

> "Desplegar no es solo aplicar un `kubectl apply`. Es cuidar la salud, el tiempo de vida y la experiencia del usuario."

Hoy vas a aprender a:

- Aplicar **estrategias de rollout** (RollingUpdate, Recreate)
- Usar **probes** (`liveness`, `readiness`)
- Hacer **rollback automático**
- Ver eventos y estado del despliegue en tiempo real

---

## 🧠 Conceptos clave

| Concepto        | ¿Para qué sirve?                                         |
|-----------------|----------------------------------------------------------|
| **RollingUpdate** | Reemplaza versiones de a poco, sin downtime             |
| **Recreate**     | Borra lo anterior antes de levantar lo nuevo (riesgoso) |
| **Readiness Probe** | Dice si el pod está listo para recibir tráfico         |
| **Liveness Probe**  | Dice si el pod sigue vivo, reinicia si no responde    |

---

## 📦 Paso 1: Agregar Probes en `deployment.yaml`

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: mi-app
spec:
  replicas: 2
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxSurge: 1
      maxUnavailable: 1
  selector:
    matchLabels:
      app: mi-app
  template:
    metadata:
      labels:
        app: mi-app
    spec:
      containers:
        - name: web
          image: ghcr.io/tu-usuario/mi-app:latest
          ports:
            - containerPort: 3000
          readinessProbe:
            httpGet:
              path: /health
              port: 3000
            initialDelaySeconds: 5
            periodSeconds: 10
          livenessProbe:
            httpGet:
              path: /health
              port: 3000
            initialDelaySeconds: 15
            periodSeconds: 20
````

---

## 🔁 Paso 2: Aplicar y monitorear el rollout

```bash
kubectl apply -f k8s/deployment.yaml
kubectl rollout status deployment/mi-app
```

---

## 🔙 Paso 3: Simular error + rollback

1. Cambiá la imagen en el YAML a una versión rota (`imagen: algoinexistente`)
2. Aplicá el cambio:

```bash
kubectl apply -f k8s/deployment.yaml
```

3. Kubernetes detecta el fallo → el pod nunca queda listo → rollback automático

```bash
kubectl rollout undo deployment/mi-app
```

---

## 👀 Paso 4: Ver logs, eventos y estado

```bash
kubectl get pods
kubectl describe deployment mi-app
kubectl logs deployment/mi-app
```

---

## 🧪 Tarea del Día

1. Aplicar un deployment con `RollingUpdate`
2. Agregar `readiness` y `liveness` probes
3. Simular un fallo para probar rollback
4. Observar eventos y salida de logs

🎁 Bonus: Automatizar rollback en un script
📸 Mostrá tu probe funcionando con **#DevOpsConRoxs - Día 37**

---

## 🧠 Revisión rápida

| Pregunta                                        | ✔️ / ❌ |
| ----------------------------------------------- | ------ |
| ¿Qué diferencia hay entre readiness y liveness? |        |
| ¿Qué estrategia de despliegue usaste?           |        |
| ¿Cómo sabés si un deployment está fallando?     |        |
| ¿Podés volver atrás a una versión anterior?     |        |

---

## 🔥 Cierre del Día

Hoy aprendiste a hacer despliegues profesionales, cuidando la estabilidad de tu aplicación.
¡Tu cluster ahora detecta errores y se cura solo! 💊☸️

Mañana seguimos con herramientas que facilitan el despliegue en Kubernetes: **Helm** entra en escena. 🎩

Nos vemos en el **Día 38** 🚀
