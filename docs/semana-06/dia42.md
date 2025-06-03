---
title: Día 42 - Desafío Final Semana 6
description: Despliega tu aplicación Roxs-voting-app
sidebar_position: 7
---


## 🌟 Desafío Final Semana 6: Despliega Roxs-voting-app en Kubernetes con CI/CD

![](../../static/images/banner/6.png)

¡Llegaste al final de un camino impresionante! Hoy no hay nuevos conceptos: vas a demostrar TODO lo que sabes.

Tu misión: desplegar **Roxs-voting-app** en Kubernetes, usando CI/CD y buenas prácticas.

---

## 🏠 Arquitectura General

```
vote (Flask) ----> Redis <---- worker (Node.js) ----> PostgreSQL <---- result (Node.js)
```

Componentes:

* `vote`: frontend de votación
* `worker`: procesa los votos desde Redis a PostgreSQL
* `result`: muestra resultados
* `redis`: cache de votos
* `postgresql`: almacenamiento persistente

---

## ✅ Requisitos

* Tener Docker Hub configurado con tus 3 imágenes:

  * `roxsross12/vote`
  * `roxsross12/worker`
  * `roxsross12/result`
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
