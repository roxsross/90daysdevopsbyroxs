---
title: Día 49 - Hardening del Voting-App
description: Aplicá todo lo aprendido para asegurar tu aplicación como una pro
sidebar_position: 7
---

## ✅ Día 49 - Hardening del Voting-App

![](../../static/images/banner/7.png)

¡Llegamos al cierre de esta semana intensa y poderosa!  
Ahora sí, llegó la hora de aplicar **todo lo aprendido** y asegurar el voting-app desde todos los frentes:

- Seguridad en el Dockerfile
- Escaneo automático de vulnerabilidades
- Monitoreo y troubleshooting
- Optimización de recursos

---

## 🔐 Checklist de Hardening

Revisá que tu app cumpla con estas prácticas 👇

### 🔧 Dockerfile Seguro

- Usa imagen base slim o distroless
- Elimina paquetes de build o cache
- Define `USER` no root
- Incluye un `HEALTHCHECK`
- Expone solo los puertos necesarios

### 🔍 Trivy Integrado

- Escanea en CI/CD
- Falla el pipeline si hay vulnerabilidades CRITICAL/HIGH
- Se ignoran solo CVEs justificados (si aplica)

### ⚙️ Troubleshooting & Observabilidad

- Revisión con docker logs y inspect
- Comprobación de respuesta con curl o navegadores
- Usa docker stats o kubectl top para medir recursos

### ⚡ Performance

- Imagen menor a 100MB
- Consumo controlado de RAM (menor 150MB ideal)
- Comportamiento estable bajo carga baja/media

---

## 🧪 Desafío Final del Voting-App

🎯 **Objetivo**: Crear una versión segura y optimizada de tu voting-app.

### ✅ ¿Qué tenés que hacer?

- Refactorizá tu Dockerfile con todas las buenas prácticas de la semana
- Generá una imagen con tag `secure`

   ```bash
   docker build -t roxsross/voting-app:secure .
    ```

- Escaneá la imagen con Trivy

   ```bash
   trivy image roxsross/voting-app:secure
   ```
- Publicá la imagen en Docker Hub

   ```bash
   docker push roxsross/voting-app:secure
   ```

- Ejecutala, medí recursos y verificá comportamiento
- Documentá el proceso y resultados en hardening-report.md

---

## 📸 Compartí tu logro

Publicá una captura del antes y después, los resultados de Trivy o tu pipeline pasando con:

**Hashtag oficial:**
#SecureVotingAppConRoxs
#90DiasDeDevOps

> Bonus 🔥: Subí un short o video explicando cómo hiciste tu hardening (¡etiquetame en redes!)

---

## 🏅 Desbloqueaste una nueva habilidad: DevSecOps Builder

Al completar este día, ya sabés:

✅ Construir contenedores seguros
✅ Automatizar validaciones en CI/CD
✅ Detectar fallos y cuellos de botella
✅ Optimizar contenedores como una profesional

---

## 📚 Recursos Finales

* [Docker Security Best Practices](https://docs.docker.com/develop/security-best-practices/)
* [Distroless Images - Google](https://github.com/GoogleContainerTools/distroless)
* [Trivy](https://github.com/aquasecurity/trivy)
* [Kubernetes Hardening Guide (NSA)](https://media.defense.gov/2021/Aug/03/2002821307/-1/-1/0/CSA_KUBERNETES_HARDENING_GUIDANCE.PDF)

---

## 🥳 ¡Lo lograste!

Ahora tenés una app que no solo funciona, sino que está lista para resistir ataques y ser escalada sin comprometer seguridad.

Nos vemos la próxima semana con nuevos desafíos.

🔥 ¡Sos una máquina de DevOps seguro, Roxs style!