---
title: Día 40 - Pipeline CI/CD para Kubernetes con GitHub Actions y Helm
description: Automatizá el despliegue a Kubernetes con workflows y Helm
sidebar_position: 10
---

## ⚙️ Día 40: Despliegue a Kubernetes desde GitHub Actions

![](../../static/images/banner/6.png)

> “Lo que no se automatiza… se repite. Y lo que se repite... ¡va al pipeline!”

Hoy vas a:

- Crear un workflow CI/CD con GitHub Actions
- Usar Helm para desplegar en Kubernetes
- Separar entornos: `staging` y `prod`
- Aprender cómo se ve un deploy profesional

---

## 🧱 Requisitos previos

- Clúster Kubernetes (Minikube, Kind o remoto)
- Chart Helm funcional (`roxs-chart`)
- Secrets configurados en GitHub (ej. `KUBE_CONFIG`, `HELM_VALUES`)
- Aplicación lista para ser desplegada

---

## 📂 Estructura esperada

```

tu-proyecto/
├── .github/workflows/
│   └── deploy.yml
├── charts/roxs-chart/
├── values/
│   ├── values-dev.yaml
│   └── values-prod.yaml
├── Dockerfile
├── k8s/
└── ...

````

---

## 🔐 Paso 1: Agregar tu `kubeconfig` como secreto

1. Generá el archivo:

```bash
cat ~/.kube/config
````

2. Copiá el contenido y creá el secret `KUBE_CONFIG` en GitHub:

   * `Settings > Secrets > Actions > New repository secret`

---

## 🤖 Paso 2: Crear `deploy.yml`

```yaml
name: Deploy to Kubernetes

on:
  push:
    branches: [main]
  workflow_dispatch:

jobs:
  deploy:
    runs-on: ubuntu-latest

    steps:
    - name: Checkout código
      uses: actions/checkout@v4

    - name: Instalar kubectl y helm
      run: |
        curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl"
        chmod +x kubectl && sudo mv kubectl /usr/local/bin/
        curl https://raw.githubusercontent.com/helm/helm/main/scripts/get-helm-3 | bash

    - name: Configurar acceso a Kubernetes
      run: |
        echo "${{ secrets.KUBE_CONFIG }}" > kubeconfig
        export KUBECONFIG=$PWD/kubeconfig
        kubectl get nodes

    - name: Deploy con Helm
      run: |
        helm upgrade --install mi-app ./charts/roxs-chart \
          --values values/values-prod.yaml \
          --namespace default \
          --create-namespace
```

---

## 🎯 Tarea del Día

1. Crear tu archivo `deploy.yml` como workflow
2. Subir el `kubeconfig` como secreto
3. Testear el deploy en staging o prod
4. Verificar que el pod y servicio estén activos

🎁 Bonus:

* Usar `slack-notify` al final del deploy
* Agregar paso para `rollback` en caso de fallo

📸 Mostrá el workflow corriendo en GitHub con **#DevOpsConRoxs - Día 40**

---

## 🧠 Revisión rápida

| ¿Sabés hacer esto?                            | ✔️ / ❌ |
| --------------------------------------------- | ------ |
| ¿Cómo conectás GitHub con tu clúster?         |        |
| ¿Cómo usás Helm en un workflow?               |        |
| ¿Cómo hacés deploy a diferentes entornos?     |        |
| ¿Dónde se definen los valores personalizados? |        |

---

## 🚀 Cierre del Día

¡Hoy diste un salto gigante! 🚀
Ya sabés cómo automatizar despliegues reales a Kubernetes usando Helm y GitHub Actions.
**Ahora sí tenés un pipeline DevOps digno de producción.**

Nos vemos en el **Día 41** ☁️

