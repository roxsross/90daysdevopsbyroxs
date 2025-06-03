---
title: Día 48 - Performance Básica en Contenedores
description: Medí, analizá y mejorá el rendimiento de tus contenedores
sidebar_position: 6
---

## Performance Básica en Contenedores

![](../../static/images/banner/7.png)

Una app lenta o que consume demasiada memoria puede volverse un problema…  
y un contenedor mal configurado puede **hacer colapsar tu infraestructura**.  
Hoy aprendés a **detectar cuellos de botella** y aplicar optimizaciones simples pero efectivas.

---

## 🎯 ¿Qué vas a aprender?

- Monitorear uso de CPU, memoria y red en contenedores
- Usar herramientas como `docker stats`, `kubectl top`, y `cAdvisor`
- Detectar imágenes pesadas o poco eficientes
- Medir diferencias entre imágenes como `slim`, `alpine` y `full`

---

## 🐳 Medir rendimiento con Docker

```bash
docker stats
````

Te muestra en tiempo real:

* **CPU %** consumido por contenedor
* **Memoria usada / límite**
* **I/O de red**
* **Lectura/escritura en disco**

> Tip: Probalo mientras accedés al `voting-app` desde el navegador.

---

## ☸️ En Kubernetes

```bash
kubectl top pods
kubectl top nodes
```

> Requiere que esté habilitado el metrics-server en tu clúster.

---

## 📦 Peso de imágenes

```bash
docker images
```

Esto te ayuda a:

* Comparar tamaños de imágenes
* Ver qué imágenes usan `latest`
* Decidir si vale la pena cambiar a `alpine` o `slim`

---

## ⚖️ Comparativa de imágenes base

| Imagen base          | Tamaño aprox. | Ideal para                                      |
| -------------------- | ------------- | ----------------------------------------------- |
| `python:3.12`        | \~950MB       | Entornos completos                              |
| `python:3.12-slim`   | \~45MB        | Apps livianas con menos dependencias            |
| `python:3.12-alpine` | \~5MB         | Contenedores ultra livianos (requieren ajustes) |

> ⚠️ Cuidado con `alpine`: algunos paquetes como `glibc` no vienen preinstalados y pueden romper tu app si no lo manejás bien.

---

## 🧪 Medición práctica: `voting-app`

1. Ejecutá tu imagen `python:3.12`

   ```bash
   docker run -p 5000:5000 roxsross/voting-app:base
   docker stats
   ```

2. Repetí el mismo test con tu versión `slim` o `secure`

   ```bash
   docker run -p 5000:5000 roxsross/voting-app:secure
   docker stats
   ```

> ¿Notas diferencias en uso de CPU o memoria?

---

## 📝 Tarea del Día

1. ✅ Ejecutá tu `voting-app` con dos imágenes diferentes (`full` vs `slim`)
2. ✅ Usá `docker stats` o `kubectl top` para medir recursos
3. ✅ Compará tamaño de imagen, uso de RAM y consumo de CPU
4. 🧠 Anotá tus conclusiones en `performance-notes.md`
5. 📸 Subí una captura del análisis con el hashtag
   `#PerformanceConRoxs` + `#DockerOnFire`

---

## 📚 Recursos Extra

* 📖 [Docker Stats Docs](https://docs.docker.com/engine/reference/commandline/stats/)
* 📊 [cAdvisor](https://github.com/google/cadvisor)
* 🧪 [DockerSlim](https://github.com/docker-slim/docker-slim) (herramienta para reducir imágenes)
* 📘 [Kubernetes Metrics Server](https://github.com/kubernetes-sigs/metrics-server)

---

## 🎉 ¡Gran trabajo!

Hoy no solo aseguraste tu contenedor…
También aprendiste a **optimizarlo como un Pro** 🔥
Y mañana… **cerramos la semana** asegurando todo lo aprendido en el `voting-app`.

💪 ¡Nos vemos en el Día 49!

