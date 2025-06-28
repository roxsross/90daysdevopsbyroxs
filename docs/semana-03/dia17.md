---
title: Día 17 - Docker Build Básico
description: Automatizando construcción de imágenes Docker
sidebar_position: 3
---

## 🐳 Docker + GitHub Actions = Magia

![](../../static/images/banner/3.png)

> "Si el código no funciona en todos lados, ponelo en un contenedor."

Hoy vas a aprender cómo crear tu propia **imagen Docker**, contenerizar tu app de Python y automatizar todo ese proceso con GitHub Actions.  
Esto te abre las puertas a la **portabilidad**, el **despliegue** y mucho más.

---

## 🧱 Paso 1: Crear un Dockerfile básico

Dentro del proyecto `mi-app-python`:

`Dockerfile`

```dockerfile
FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY app.py .

# Usuario no root
RUN adduser --disabled-password --gecos '' appuser && \
    chown -R appuser:appuser /app
USER appuser

EXPOSE 5000

HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:5000/health || exit 1

CMD ["python", "app.py"]
````

---

## 🔒 Paso 2: Optimizar con `.dockerignore`

`.dockerignore`

```
.git
__pycache__/
*.pyc
tests/
venv/
.dockerignore
Dockerfile
```

---

## 🧪 Paso 3: Testear localmente

```bash
docker build -t mi-app:test .
docker run -d --name app-test -p 5000:5000 mi-app:test
curl http://localhost:5000/health
docker stop app-test && docker rm app-test
```

---

## ⚙️ Paso 4: Workflow de Build Docker

`.github/workflows/docker-build.yml`

```yaml
name: Build Docker

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

env:
  REGISTRY: ghcr.io
  IMAGE_NAME: ${{ github.repository }}

jobs:
  build-and-test:
    runs-on: ubuntu-latest
    permissions:
      contents: read
      packages: write

    steps:
    - name: Checkout
      uses: actions/checkout@v4

    - name: Setup Docker Buildx
      uses: docker/setup-buildx-action@v3

    - name: Login al GitHub Container Registry
      if: github.event_name != 'pull_request'
      uses: docker/login-action@v3
      with:
        registry: ${{ env.REGISTRY }}
        username: ${{ github.actor }}
        password: ${{ secrets.GITHUB_TOKEN }}

    - name: Extraer metadata
      id: meta
      uses: docker/metadata-action@v5
      with:
        images: ${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}
        tags: |
          type=sha
          type=raw,value=latest,enable={{is_default_branch}}

    - name: Build Docker
      uses: docker/build-push-action@v5
      with:
        context: .
        load: true
        tags: ${{ steps.meta.outputs.tags }}
        labels: ${{ steps.meta.outputs.labels }}

    - name: Testear contenedor
      run: |
        IMAGE_TAG=$(echo "${{ steps.meta.outputs.tags }}" | head -n1)
        docker run -d --name test-container -p 5000:5000 $IMAGE_TAG
        sleep 10
        curl -f http://localhost:5000/health
        curl -f http://localhost:5000/
        docker stop test-container && docker rm test-container

    - name: Push Docker image
      if: github.event_name != 'pull_request'
      uses: docker/build-push-action@v5
      with:
        context: .
        push: true
        tags: ${{ steps.meta.outputs.tags }}
        labels: ${{ steps.meta.outputs.labels }}
```

---

## 🧪 Extra: Script para test local

`scripts/docker-test.sh`

```bash
#!/bin/bash

docker build -t mi-app:test .
docker run -d --name mi-app-test -p 5000:5000 mi-app:test
sleep 5
curl -f http://localhost:5000/health && echo "✅ Health OK"
curl -f http://localhost:5000/ && echo "✅ App OK"
docker stop mi-app-test && docker rm mi-app-test
```

---

## ✅ Tarea del Día

1. Crear un Dockerfile funcional
2. Agregar un `.dockerignore`
3. Probar tu imagen localmente
4. Subir el workflow `docker-build.yml`
5. Ver en GitHub Actions que se construya automáticamente

🎁 Extra: Publicá tu imagen en GHCR
📸 Mostrá tu workflow en marcha con el hashtag **#DevOpsConRoxs - Día 17**

---

## 🧠 Revisión rápida

| Pregunta                                       | ✔️ / ❌ |
| ---------------------------------------------- | ------ |
| ¿Qué hace el Dockerfile?                       |        |
| ¿Qué es `buildx`?                              |        |
| ¿Dónde se sube la imagen?                      |        |
| ¿Cómo testear un contenedor en GitHub Actions? |        |

---

## 🌊 Cierre del Día

Hoy convertiste tu app en algo **portable y listo para desplegarse en cualquier lado**.
Mañana te muestro cómo ejecutar estas imágenes en tus propias máquinas con **self-hosted runners**.
Nos vemos en el **Día 18** 🏃‍♀️⚙️


