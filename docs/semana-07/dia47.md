---
title: Día 47 - Troubleshooting de Contenedores
description: Diagnosticá errores y comportamientos inesperados en tus contenedores
sidebar_position: 5
---

## 🐛 Día 47 - Troubleshooting de Contenedores

![](../../static/images/banner/7.png)

Hoy aprendemos a **detectar, diagnosticar y resolver** problemas dentro de contenedores.  
Porque en DevOps, cuando algo falla, no se trata de “borrar el contenedor y rezar” 🙏, se trata de **entender qué está pasando y actuar con precisión**.

---

## 🛠️ Herramientas de Diagnóstico

### 🔍 Docker CLI

```bash
docker ps -a                # Ver contenedores (incluidos los que fallaron)
docker logs <nombre>        # Logs del contenedor
docker inspect <nombre>     # Configuración y metadata
docker exec -it <nombre> sh # Acceder al contenedor
````

### 🧪 Diagnóstico rápido

```bash
# Simular un contenedor que falla
docker run --name crash-app alpine sh -c "exit 1"

# Ver estado del contenedor
docker inspect crash-app --format='{{.State.ExitCode}}'
```

---

## 🔥 Caso práctico: `voting-app` no arranca

```bash
docker run -p 5000:5000 roxsross/voting-app:secure
```

### 🧯 Si algo falla...

1. **Ver los logs**

   ```bash
   docker logs nombre-contenedor
   ```

2. **Inspeccionar**

   ```bash
   docker inspect nombre-contenedor
   ```

3. **Entrar y testear**

   ```bash
   docker exec -it nombre-contenedor sh
   curl http://localhost:5000
   ```

> 🧠 Tip: Si la app no arranca, fijate si falta una dependencia, si hay un puerto mal definido, o si el CMD no es correcto.

---

## ☸️ Troubleshooting en Kubernetes (básico)

```bash
kubectl get pods
kubectl describe pod <nombre>
kubectl logs <nombre>
kubectl exec -it <nombre> -- sh
```

> 💡 Si el pod está en `CrashLoopBackOff`, mirá los eventos y logs.

---

## 📝 Tarea del Día

1. ✅ Simulá un contenedor que falla (como `crash-app`)
2. ✅ Investigá por qué falló usando los comandos de `logs`, `inspect` y `exec`
3. ✅ Verificá el comportamiento de tu `voting-app` si se rompe alguna dependencia
4. ✅ Documentá lo que hiciste en tu archivo `debug-notes.md`
5. 📸 Compartí en redes una captura de un contenedor fallando y cómo lo solucionaste
   con el hashtag `#DebuggingConRoxs`

---

## 📚 Recursos Extra

* 🐳 [Docker Troubleshooting Guide](https://docs.docker.com/config/containers/logging/troubleshoot/)
* ☸️ [Kubernetes Debug Pods](https://kubernetes.io/docs/tasks/debug/debug-application/debug-running-pod/)
* 🧰 [Play with Docker](https://labs.play-with-docker.com/) (ambiente gratuito para practicar)

---

## 🎉 ¡Lo hiciste excelente!

Hoy no solo aprendiste a levantar servicios...
**Aprendiste a salvarlos cuando se caen.**
Y eso, Roxs, es 🔥 nivel DevOps real 🔥

**Mañana nos metemos con performance: cómo medir y optimizar tus contenedores.**

🚀 ¡Nos vemos en el Día 48!

