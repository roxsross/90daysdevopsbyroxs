---
title: Día 44 - Escaneo de Vulnerabilidades con Trivy
description: Detectá vulnerabilidades en tus contenedores e imágenes Docker con Trivy
sidebar_position: 2
---

## 🔍 Escaneo de Vulnerabilidades con Trivy

![](../../static/images/banner/7.png)

Ayer entendimos los riesgos más comunes en contenedores.  
Hoy vamos a hacer **un escaneo real de seguridad sobre tus imágenes** usando **Trivy**, una herramienta simple, rápida y poderosa para encontrar vulnerabilidades, secretos, configuraciones inseguras y más.

---

## 🧠 ¿Qué es Trivy?

**Trivy** (de *Tri* + *Vuln*) es una herramienta de **escaneo todo en uno** desarrollada por [Aqua Security](https://aquasecurity.github.io/trivy/).  
Puede detectar:

- CVEs (vulnerabilidades conocidas) en:
  - Imágenes Docker
  - Archivos del sistema
  - Dependencias de apps
  - Configuraciones Kubernetes (YAML, Helm)
  - Repositorios de Git

---

## ⚙️ Instalación de Trivy

### Linux / macOS

```bash
brew install aquasecurity/trivy/trivy
# o directamente
curl -sfL https://raw.githubusercontent.com/aquasecurity/trivy/main/contrib/install.sh | sh -s -- -b /usr/local/bin
````

### Windows (con Chocolatey o binario)

```bash
choco install trivy
```

---

## 🚀 Primer escaneo

Vamos a escanear la imagen Docker de tu aplicación, por ejemplo, el `voting-app`.

```bash
# Escaneo completo de vulnerabilidades en una imagen
trivy image nombre-de-la-imagen

# Ejemplo:
trivy image roxsross/voting-app:latest
```

Esto te mostrará un resumen como este:

```
Total: 12 (UNKNOWN: 0, LOW: 3, MEDIUM: 4, HIGH: 4, CRITICAL: 1)
```

---

## 📊 Salida en formatos distintos

Podés obtener los resultados como archivo JSON o tabla Markdown para integrarlo en reportes:

```bash
# Salida como JSON
trivy image -f json -o resultado.json nombre-de-la-imagen

# Salida como tabla Markdown
trivy image -f table nombre-de-la-imagen
```

---

## 📦 Escanear dependencias de una app local

Si tu `voting-app` tiene un `requirements.txt` (Python), `package-lock.json` (Node.js), etc., también podés escanear:

```bash
trivy fs .
```

Este comando analiza el **sistema de archivos actual**, ideal para proyectos locales que todavía no están empaquetados como contenedor.

---

## 🛡️ Buenas prácticas con Trivy

* Escanear tus imágenes **antes de subirlas al registry**
* Integrar Trivy en el pipeline CI/CD (lo haremos mañana)
* Usar tags de versiones fijas para controlar mejor el análisis
* Ignorar vulnerabilidades **conscientemente**, si son falsos positivos documentados

---

## 📝 Tarea del Día

1. ✅ Instalá Trivy en tu entorno local
2. ✅ Escaneá la imagen de tu `voting-app` o cualquier otra que hayas creado
3. ✅ Guardá los resultados en un archivo `.json` o `.md`
4. ✅ Abrí un issue en tu repo (simulado o real) con el resumen de vulnerabilidades
5. 📸 Compartí una captura del resultado en Discord o redes con el hashtag
   `#DevOpsConRoxs` + `#SecureContainers`

---

## 📚 Recursos Extra

* 🔗 [Trivy Docs](https://aquasecurity.github.io/trivy/)
* 📘 [Cómo funciona Trivy por dentro](https://github.com/aquasecurity/trivy/blob/main/docs/scanner/how-it-works.md)
* 🛡️ [Lista de vulnerabilidades CVE](https://cve.mitre.org/)

---

## 🎉 ¡Excelente trabajo!

Ya diste un paso ENORME: ahora no solo construís contenedores… **también los protegés**.
Mañana vamos a aprender cómo automatizar estos análisis en tu pipeline de CI/CD.

🔥 ¡Vamos por más, DevSecOps Hero!


