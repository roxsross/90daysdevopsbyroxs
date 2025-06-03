---
title: Día 38 - Introducción a Helm
description: Aprende qué es Helm, cómo instalarlo y crear tu primer chart
sidebar_position: 8
---

## 🎩 Día 38: Introducción a Helm

![](../../static/images/banner/6.png)

> “Helm es como el `apt` o `yum` de Kubernetes, pero con superpoderes para DevOps.”

Hoy vas a:

- Entender qué es **Helm** y por qué es tan poderoso
- Instalarlo y usar tu primer **chart**
- Crear tu **propio Helm Chart** para tu aplicación

---

## 🧠 ¿Qué es Helm?

Helm es el **gestor de paquetes de Kubernetes**. Te permite:

✅ Instalar aplicaciones como NGINX, Prometheus o Grafana con un solo comando  
✅ Empaquetar tu propia app como un "chart"  
✅ Reusar configuraciones con valores  
✅ Tener versionado y rollback de despliegues

---

## 🛠️ Paso 1: Instalar Helm

```bash
# Linux / Mac
curl https://raw.githubusercontent.com/helm/helm/main/scripts/get-helm-3 | bash

# Verificá que esté OK
helm version
````

---

## 📦 Paso 2: Usar tu primer Chart

```bash
helm repo add bitnami https://charts.bitnami.com/bitnami
helm repo update

# Instalar Redis en tu clúster:
helm install mi-redis bitnami/redis

# Ver qué se instaló
helm list
kubectl get pods
```

---

## 📂 Paso 3: Crear tu propio Helm Chart

```bash
helm create roxs-chart
```

Esto genera:

```
roxs-chart/
├── charts/
├── templates/
│   ├── deployment.yaml
│   ├── service.yaml
│   └── ...
├── values.yaml
└── Chart.yaml
```

🎯 Este chart podés adaptarlo a tu aplicación.

---

## ✍️ Paso 4: Personalizar `values.yaml`

```yaml
replicaCount: 2

image:
  repository: ghcr.io/tu-usuario/mi-app
  tag: latest
  pullPolicy: IfNotPresent

service:
  type: ClusterIP
  port: 3000
```

📌 Luego, usás esos valores en los `templates/*.yaml` con la sintaxis `{{ .Values.image.repository }}`.

---

## 🚀 Paso 5: Desplegar tu chart

```bash
helm install mi-app ./roxs-chart
kubectl get all
```

¿Hiciste cambios? Actualizá con:

```bash
helm upgrade mi-app ./roxs-chart
```

---

## 🧪 Tarea del Día

1. Instalar Helm en tu máquina
2. Probar instalar un chart público (ej: Redis)
3. Crear tu propio chart con `helm create`
4. Adaptarlo a tu aplicación y desplegarlo

🎁 Bonus: Aplicar variables y flags en `values.yaml`
📸 Compartí tu primer chart con **#DevOpsConRoxs - Día 38**

---

## 🧠 Revisión rápida

| Pregunta                                                    | ✔️ / ❌ |
| ----------------------------------------------------------- | ------ |
| ¿Qué es un Helm Chart?                                      |        |
| ¿Dónde se definen los valores?                              |        |
| ¿Cómo actualizás una app con Helm?                          |        |
| ¿Qué ventaja tiene respecto a usar `kubectl apply` directo? |        |

---

## 🎩 Cierre del Día

Hoy sumaste una herramienta mágica a tu toolbox: **Helm**.
A partir de ahora, tus despliegues son más limpios, reusables y versionables.

Mañana vas a llevar esto un paso más allá: ¡**templatear tus valores y publicar tu chart como pro!** 🧙‍♂️

Nos vemos en el **Día 39** 🔮


