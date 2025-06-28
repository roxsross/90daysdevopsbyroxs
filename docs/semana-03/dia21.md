---
title: Día 21 -  Desafío Final Semana 3
description: Despliega tu aplicación Roxs-voting-app
sidebar_position: 7
---

### CI/CD para Roxs-Voting-App

![](../../static/images/banner/3.png)

## 🎯 Objetivo del Proyecto Final
Crear un **pipeline CI/CD completo** para el proyecto `roxs-voting-app` de la Semana 2, integrando todos los conceptos aprendidos en la Semana 3:
- GitHub Actions workflows
- Self-hosted runners
- Build y push de imágenes Docker
- Deployment automático con Docker Compose
- Health checks y monitoreo básico

## 📋 Recordatorio: ¿Qué es Roxs-Voting-App?

La aplicación de votación que dockerizaste en el Día 14 incluye:
- 🐍 **vote**: App Flask para votar (gato vs perro)
- 🧠 **worker**: Servicio Node.js que procesa votos
- 📊 **result**: App Node.js que muestra resultados
- 🗃️ **redis**: Almacén temporal de votos
- 🐘 **postgres**: Base de datos persistente

![Arquitectura Roxs-Voting-App](../../static/images/2.png)

## 🏗️ Estructura del Proyecto Final

```
roxs-voting-app/
├── vote/                     # App Flask de votación
│   ├── app.py
│   ├── requirements.txt
│   └── Dockerfile
├── result/                   # App Node.js de resultados
│   ├── server.js
│   ├── package.json
│   └── Dockerfile
├── worker/                   # Worker Node.js
│   ├── index.js
│   ├── package.json
│   └── Dockerfile
├── .github/
│   └── workflows/
│       ├── ci.yml           # Integración continua
│       ├── deploy-staging.yml    # Deploy a staging
│       ├── deploy-production.yml # Deploy a producción
│       └── health-check.yml      # Monitoreo
├── docker-compose.yml       # Desarrollo local
├── docker-compose.staging.yml    # Staging
├── docker-compose.prod.yml       # Producción
├── scripts/
│   ├── deploy.sh           # Script de deployment
│   ├── health-check.sh     # Verificación de salud
│   └── backup.sh           # Backup de datos
└── docs/
    └── README.md           # Documentación
```


## ✅ Tareas del Proyecto Final

### Tarea Principal (Obligatoria)
1. **Tomar tu proyecto roxs-voting-app**
2. **Crear los workflows de CI/CD completos**
3. **Configurar self-hosted runner** para deployment
4. **Probar el pipeline completo** desde commit hasta producción

### Tareas Paso a Paso

#### Paso 1: Preparar el Repositorio
```bash
# 1. Tomar tu proyecto del Día 14
cd roxs-voting-app

# 2. Crear las carpetas necesarias
mkdir -p .github/workflows
mkdir -p scripts
mkdir -p docs

# 3. Verificar que tienes la estructura correcta
ls -la
# Deberías ver: vote/ result/ worker/ docker-compose.yml
```

#### Paso 2: Configurar Docker Compose para diferentes entornos
```bash
# 1. Crear docker-compose.staging.yml
# 2. Crear docker-compose.prod.yml
# 3. Probar que funcionan:
docker compose -f docker-compose.staging.yml up -d
```

#### Paso 3: Crear Workflows de GitHub Actions
```bash
# 1. Crear .github/workflows/ci.yml
# 2. Crear .github/workflows/deploy-staging.yml
# 3. Crear .github/workflows/deploy-production.yml
# 4. Crear .github/workflows/health-check.yml
```

#### Paso 4: Configurar Self-hosted Runner
```bash
# 1. Configurar un runner para staging
# 2. Configurar un runner para production
# 3. Probar que los runners funcionan
```

### Tareas Adicionales (Opcionales)
1. **Crear scripts de utilidad** para deployment local
2. **Implementar sistema de backup** para PostgreSQL
3. **Configurar alertas** por email o Slack
4. **Crear documentación** completa del proyecto


## 📊 Flujo Completo del Pipeline

```
1. 👨‍💻 Developer hace push a 'develop'
   ↓
2. 🔄 GitHub Actions ejecuta CI
   - Tests de vote (Python)
   - Tests de result (Node.js) 
   - Tests de worker (Node.js)
   - Integration tests con Docker Compose
   ↓
3. 🏗️ Build de imágenes Docker
   - vote:latest
   - result:latest
   - worker:latest
   ↓
4. 🚀 Auto-deploy a Staging
   - Self-hosted runner ejecuta deployment
   - Health checks verifican que funciona
   - Smoke tests confirman funcionalidad
   ↓
5. 👨‍💻 Developer hace PR a 'main'
   ↓
6. 👀 Code review y merge
   ↓
7. 🎯 Deploy a Production (con approval manual)
   - Backup de base de datos
   - Self-hosted runner ejecuta deployment
   - Health checks verifican que funciona
   - Notificación de deployment exitoso
   ↓
8. 📊 Monitoreo continuo
   - Health checks cada 30 minutos
   - Alertas automáticas si algo falla
```

## 🛠️ Comandos Útiles para Testing

### Testing Local
```bash
# Iniciar todo el stack
./scripts/deploy.sh development

# Ver logs
docker compose logs -f

# Parar todo
docker compose down -v
```

### Testing de Staging
```bash
# Deploy a staging
./scripts/deploy.sh staging

# Verificar staging
./scripts/health-check.sh staging

# Ver logs de staging
docker compose -f docker-compose.staging.yml logs -f
```

### Testing del Pipeline
```bash
# Hacer un commit a develop para disparar CI/CD
git checkout develop
git add .
git commit -m "feat: add health checks and CI/CD pipeline"
git push origin develop

# Verificar que el workflow se ejecuta en GitHub Actions
# Verificar que se despliega automáticamente a staging
```

## 🎯 Vamos a lograrlo:

### ✅ **Continuidad Perfecta**
- Parte del proyecto `roxs-voting-app` que ya dockerizaron en el Día 14
- Agrega CI/CD manteniendo la misma aplicación familiar
- Progresión natural: Docker → Docker Compose → CI/CD

### ✅ **Pipeline Realista y Práctico**
- **CI**: Tests para Python (vote) y Node.js (result/worker)
- **Build**: Construcción de 3 imágenes diferentes
- **Deploy**: Staging automático, Production con approval

### ✅ **Complejidad Apropiada**
- Usa conceptos aprendidos en toda la semana
- Mantiene un nivel desafiante pero alcanzable
- Enfoque práctico con scripts útiles

### ✅ **Aplicación Real**
- Los estudiantes ya conocen la app (gato vs perro voting)
- Servicios reales que se comunican entre sí
- Casos de uso del mundo real

## 🏆 **Flujo Completo del Programa**

1. **Semana 2**: Dockerizar `roxs-voting-app` 
2. **Días 15-20**: Aprender GitHub Actions, Self-hosted runners, Monitoring
3. **Día 21**: Integrar todo en un pipeline CI/CD para la misma `roxs-voting-app`


¡La progresión es perfecta y el proyecto final es totalmente alcanzable! 🚀