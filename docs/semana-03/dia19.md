---
title: Día 19 - Deploy con GitHub Actions
description: Aprender a desplegar con Docker Compose y Self-hosted Runners
sidebar_position: 5
---

## 🚀 Deploy con Docker Compose y Runners Propios

![](../../static/images/banner/3.png)

> "Construir es importante, pero **desplegar bien** es lo que hace que tu código cobre vida."

Hoy vas a **desplegar una aplicación full-stack** usando Docker Compose desde tu **self-hosted runner**. Vas a conectar todo lo que aprendiste en los días anteriores.

---

## 🧱 ¿Por qué usar Docker Compose?

- 🔁 Para levantar varios servicios juntos (app, DB, cache)
- 🧪 Ideal para entornos de desarrollo y testing
- ⚡ Despliegues rápidos con un solo comando
- 🔌 Los contenedores se conectan fácilmente entre sí

---

## 🛠️ Arquitectura de ejemplo

Imaginá una app con:

- 🐍 App Web (Flask o Node.js)
- 🐘 PostgreSQL
- 🔴 Redis
- 🌐 Nginx como reverse proxy

---

## 📦 Paso 1: Estructura de proyecto

```

mi-app/
├── app/
│   ├── Dockerfile
│   ├── index.js ó app.py
│   └── package.json ó requirements.txt
├── nginx/
│   └── nginx.conf
├── docker-compose.yml
├── docker-compose.staging.yml
├── docker-compose.prod.yml
└── .env.example

````

---

## ⚙️ Paso 2: Docker Compose base (desarrollo)

`docker-compose.yml`

```yaml
version: '3.8'

services:
  app:
    build: ./app
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=development
      - DB_HOST=postgres
      - REDIS_HOST=redis
    depends_on:
      - postgres
      - redis
    volumes:
      - ./app:/app

  postgres:
    image: postgres:15-alpine
    environment:
      - POSTGRES_DB=miapp
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=password123
    volumes:
      - postgres_data:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine
    volumes:
      - redis_data:/data

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
    volumes:
      - ./nginx/nginx.conf:/etc/nginx/nginx.conf
    depends_on:
      - app

volumes:
  postgres_data:
  redis_data:
````

---

## 🚀 Paso 3: Workflow de Deployment

`.github/workflows/deploy-compose.yml`

```yaml
name: Deploy con Docker Compose

on:
  push:
    branches: [main, develop]
  workflow_dispatch:

jobs:
  deploy:
    runs-on: [self-hosted, linux, rox]

    steps:
    - name: Checkout código
      uses: actions/checkout@v4

    - name: Parar servicios anteriores
      run: docker compose down -v || true

    - name: Construir servicios
      run: docker compose -f docker-compose.yml build

    - name: Levantar servicios
      run: docker compose -f docker-compose.yml up -d

    - name: Verificar app
      run: curl -f http://localhost:3000/health
```

---

## 🧪 Paso 4: Probar staging y producción

Cambiá el archivo `docker-compose.yml` por:

```bash
docker compose -f docker-compose.staging.yml up -d
docker compose -f docker-compose.prod.yml up -d
```

📌 Podés tener un workflow para cada uno.

---

## ✅ Tarea del Día

1. Crear una app full-stack o usar una del reto anterior
2. Agregar `docker-compose.yml` para levantarla
3. Crear un workflow de deploy usando tu runner
4. Verificar que se levanta bien

🎁 Bonus: Agregar `nginx` como reverse proxy
📸 Compartí el deploy corriendo con **#DevOpsConRoxs - Día 19**

---

## 🧠 Revisión rápida

| Pregunta                            | ✔️ / ❌ |
| ----------------------------------- | ------ |
| ¿Qué es Docker Compose?             |        |
| ¿Qué hace el workflow?              |        |
| ¿Cómo se levanta la app en staging? |        |

---

## 🏁 Cierre del Día

Hoy desplegaste con herramientas reales, como en los entornos productivos.
Mañana vas a aprender cómo **monitorear** tu aplicación y detectar si algo falla.

Nos vemos en el **Día 20** 📈🩺


