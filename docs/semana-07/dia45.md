---
title: Día 45 - Integración de Trivy en CI/CD
description: Automatizá el escaneo de vulnerabilidades en tus pipelines
sidebar_position: 3
---

## ⚙️ Integración de Trivy en CI/CD

![](../../static/images/banner/7.png)

¿Te imaginás que tu pipeline no solo construya imágenes, sino que **bloquee vulnerabilidades críticas automáticamente**?  
Eso es lo que vamos a lograr hoy con Trivy integrado en tu CI/CD 🚀

---

## 🤔 ¿Por qué integrarlo en CI/CD?

- Detectás vulnerabilidades **antes** de que la imagen llegue a producción
- Podés **fallar el build** si aparecen CVEs críticos
- Automatizás controles de seguridad, sin depender de procesos manuales
- Asegurás un estándar para todo tu equipo

---

## 🧪 Escenario: GitLab CI

### 🗂️ Estructura mínima del proyecto

```

.
├── .gitlab-ci.yml
├── app/
│   └── Dockerfile

````

### 📄 `.gitlab-ci.yml` básico con Trivy

```yaml
stages:
  - security

trivy_scan:
  stage: security
  image:
    name: aquasec/trivy:latest
    entrypoint: [""]
  script:
    - trivy image --exit-code 1 --severity CRITICAL,HIGH roxsross/voting-app:latest
  allow_failure: false
````

> 🔥 Este job:
>
> * Escanea la imagen `roxsross/voting-app:latest`
> * Falla el pipeline si hay **vulnerabilidades HIGH o CRITICAL**
> * Puede modificarse para adaptarlo a tu naming/tagging

---

## 🧠 Otras configuraciones útiles

### ✅ Ignorar severidades menores

```yaml
trivy image --exit-code 1 --severity CRITICAL,HIGH nombre-imagen
```

### 📂 Salida en formato JSON (para reportes)

```yaml
trivy image -f json -o trivy-report.json nombre-imagen
```

### 🔐 Escanear el sistema de archivos (proyecto local)

```yaml
trivy fs --exit-code 1 --severity CRITICAL,HIGH .
```

---

## 🔐 ¿Y en GitHub Actions?

```yaml
name: Security Scan

on: [push]

jobs:
  scan:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Install Trivy
        run: |
          curl -sfL https://raw.githubusercontent.com/aquasecurity/trivy/main/contrib/install.sh | sh -s -- -b /usr/local/bin
      - name: Run Trivy
        run: |
          trivy image --exit-code 1 --severity CRITICAL,HIGH roxsross/voting-app:latest
```

---

## 📝 Tarea del Día

1. ✅ Agregá un stage `security` en tu `.gitlab-ci.yml` o workflow de GitHub Actions
2. ✅ Escaneá tu imagen automáticamente en cada push o merge request
3. ✅ Subí un print del pipeline pasando o fallando por seguridad
4. 🧠 Escribí en tu archivo `mi-cluster.md`:

   * ¿Qué aprendiste de este tipo de validación?
   * ¿Cambiarías algo en tu flujo de CI/CD actual?
5. 📣 Compartí tu progreso con el hashtag
   `#DevSecOpsConRoxs` + `#CISecure`

---

## 💬 Tips Roxs

> 🔁 Recordá que Trivy puede integrarse con más herramientas como Tekton, ArgoCD, Jenkins o CircleCI.
> Lo importante es **detener los riesgos antes de que lleguen al deploy.**

---

## 📚 Recursos Extra

* 🧪 [Trivy CI Integration Docs](https://aquasecurity.github.io/trivy/v0.18.3/integrations/ci/)
* 🔐 [GitLab Security Scanning](https://docs.gitlab.com/ee/user/application_security/container_scanning/)
* 📖 [DevSecOps Roadmap](https://github.com/guardrailsio/devsecops-roadmap)

---

## 🎉 ¡On fire, DevSecOps Hero!

Tu pipeline ahora detecta vulnerabilidades **automáticamente** 🔥
Mañana reforzamos el Dockerfile con prácticas de hardening.

💪 ¡Seguimos construyendo contenedores seguros!
