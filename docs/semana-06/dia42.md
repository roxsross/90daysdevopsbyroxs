---
title: Día 42 - Desafío Final Semana 6
description: Despliega Roxs-voting-app con CI/CD completo
sidebar_position: 7
---

## 🌟 Desafío Final: Roxs-voting-app con CI/CD

![](../../static/images/banner/6.png)

> ¡Llegaste al final! Hoy no hay nuevos conceptos: vas a demostrar TODO lo que sabes.

## 🎯 Tu Misión

Desplegar **Roxs-voting-app** en Kubernetes usando:
- ✅ **CI/CD** con GitHub Actions
- ✅ **Múltiples ambientes** (dev, staging, prod)
- ✅ **Health checks** y rollback automático
- ✅ **Helm** o **kubectl** (tú eliges)

**Tiempo:** 60-90 minutos

---

## �️ Arquitectura de la App

```
vote (Flask) → Redis ← worker (Node.js) → PostgreSQL ← result (Node.js)
```

**5 Componentes:**
- `vote`: Frontend de votación (Flask)
- `worker`: Procesa votos de Redis a PostgreSQL
- `result`: Muestra resultados (Node.js)
- `redis`: Cache de votos
- `postgresql`: Base de datos persistente

---

## ✅ Checklist del Desafío

### 📋 Paso 1: Preparación
- [ ] Cluster Kubernetes funcionando
- [ ] Imágenes Docker de los 5 componentes
- [ ] Repositorio en GitHub configurado

### 🔧 Paso 2: Configuración K8s
- [ ] Namespaces para cada ambiente
- [ ] Manifiestos YAML o Charts de Helm
- [ ] ConfigMaps y Secrets
- [ ] PersistentVolume para PostgreSQL

### 🚀 Paso 3: CI/CD
- [ ] Workflow de GitHub Actions
- [ ] Deploy automático por rama
- [ ] Health checks configurados
- [ ] Rollback en caso de error

### ✅ Paso 4: Validación
- [ ] App funciona en dev
- [ ] Deploy a staging automático
- [ ] Aprobación manual para prod
- [ ] Votos se persisten correctamente

---

## 🎓 Resumen de la Semana 6

**Has aprendido:**
- ✅ **Día 36**: Runners escalables con ARC
- ✅ **Día 37**: Múltiples ambientes en K8s
- ✅ **Día 38**: Health checks y rollbacks
- ✅ **Día 39**: Gestión con Helm
- ✅ **Día 40**: Pipeline con Helm
- ✅ **Día 41**: Pipeline completo con kubectl
- ✅ **Día 42**: Desafío final integrado

**¡Felicitaciones!** Ahora tienes las herramientas para implementar CI/CD profesional en cualquier empresa.

---

## 📸 ¡Comparte tu Éxito!

Cuando termines, comparte tu logro con **#DevOpsConRoxs** y muestra:
- Screenshots de tu pipeline funcionando
- La voting app desplegada en los 3 ambientes
- Lo que más te costó y cómo lo resolviste

**¡Nos vemos en la Semana 7!** 🚀
* Tener un clúster funcionando (Minikube o KIND)
* Haber practicado CI/CD en días anteriores

---

## 💼 Estructura sugerida de archivos Kubernetes

```
voting-app-k8s/
├── 01-namespace.yaml
├── 02-storage.yaml
├── 03-configs-secrets.yaml
├── 04-postgres.yaml
├── 05-redis.yaml
├── 06-vote.yaml
├── 07-worker.yaml
├── 08-result.yaml
└── deploy.sh
```

---

## 🤝 Tips para el despliegue

1. **Crea un namespace**: `voting-app`
2. **Persistencia**: PostgreSQL debe tener volumen persistente
3. **ConfigMaps y Secrets**: variables como `REDIS_HOST`, `POSTGRES_USER`, etc.
4. **Despliegue ordenado**:

   * Namespace + Configs + Storage
   * PostgreSQL + Redis
   * Vote, Worker, Result

---

## 🦜 Flujo CI/CD sugerido con GitHub Actions

1. `test`: opcional si agregaste tests
2. `build & push`: Docker Hub (vote, worker, result)
3. `deploy`: aplicar manifiestos YAML con `kubectl`

### Secretos requeridos:

* `DOCKER_USER`, `DOCKER_TOKEN`
* `KUBE_CONFIG` (kubeconfig base64)

---

## ✨ Validación final

Para considerar este día como completado:

* [ ] Todos los pods en `Running`
* [ ] Aplicaciones accesibles desde navegador
* [ ] Votos funcionando (y persistiendo)
* [ ] Logs mostrando actividad del `worker`
* [ ] Resultados reflejando cambios

---

## 🧰 Cierre del Día

🚀 ¡Lo lograste! Desplegar una app distribuida en Kubernetes con CI/CD no es menor.

🧵 Compartí en Discord con **#DevOpsConRoxs - Día 42** tus capturas y aprendizajes.

La semana que viene cerramos este viaje de 90 días como se debe: con monitoreo, seguridad y mucho fuego DevOps. 🔥
