---
title: Día 43 - Introducción a la Seguridad en Contenedores
description: Conocé los fundamentos de la seguridad en contenedores y empezá a proteger tus imágenes
sidebar_position: 1
---

## 🔐 Introducción a la Seguridad en Contenedores

![](../../static/images/banner/7.png)

¡Bienvenid@ a la Semana 7 del reto!  
Hoy comenzamos una etapa fundamental: **la seguridad en los contenedores**.  
Porque no alcanza con que “funcione en tu máquina”, también tiene que ser **seguro en producción**.

---

## 🧠 ¿Por qué es importante asegurar nuestros contenedores?

Los contenedores **no aíslan por completo**. Si no tenemos cuidado, podemos introducir vulnerabilidades que afecten todo el sistema o permitan ataques.

### Riesgos comunes:

- 🧬 Imágenes con CVEs (vulnerabilidades conocidas)
- 🧨 Dockerfiles mal configurados
- 🔓 Contenedores con permisos elevados (`root`)
- 🌍 Puertos expuestos innecesariamente
- 🦠 Software desactualizado

> ⚠️ El 90% de los problemas de seguridad en contenedores proviene de imágenes mal construidas o poco auditadas.

---

## 🧰 Herramientas clave

### 🔎 Docker Bench for Security

Una herramienta oficial de Docker que realiza un análisis de configuración y compara contra buenas prácticas del [CIS Docker Benchmark](https://www.cisecurity.org/benchmark/docker).

#### 📥 Instalación

```bash
git clone https://github.com/docker/docker-bench-security.git
cd docker-bench-security
sudo bash docker-bench-security.sh
````

> ⚠️ Este script puede tardar varios minutos y requiere permisos elevados.

#### 📝 Qué revisa:

* Si usás el usuario `root`
* Configuración del daemon Docker
* Permisos en los volúmenes
* Uso de capacidades privilegiadas

---

## 🧠 Buenas prácticas básicas

| Práctica                       | ✅ Correcto                                      | ❌ Incorrecto                |
| ------------------------------ | ----------------------------------------------- | --------------------------- |
| No usar `latest`               | `nginx:1.25.3`                                  | `nginx:latest`              |
| Evitar el usuario root         | `USER appuser`                                  | `USER root` o ninguno       |
| Minimizar capas                | `RUN apt-get update && apt-get install -y curl` | Varias líneas `RUN`         |
| Eliminar herramientas de build | `rm -rf /var/lib/apt/lists/*`                   | Dejar paquetes innecesarios |
| Usar imágenes base seguras     | `python:3.12-slim` o `distroless`               | `ubuntu:20.04` o genéricas  |

---

## 🛠️ Comprobación de tu contenedor

Si ya tenés tu imagen construida del `voting-app`, podés ver información básica con:

```bash
docker inspect nombre-de-la-imagen
docker history nombre-de-la-imagen
```

Esto te permite ver:

* Si está basada en `latest`
* Qué comandos se ejecutaron en cada capa
* Tamaño y cantidad de capas (impacta en seguridad y performance)

---

## 🎯 Tarea del Día

1. **Cloná y ejecutá Docker Bench for Security** en tu sistema local o en una VM:

   ```bash
   git clone https://github.com/docker/docker-bench-security.git
   cd docker-bench-security
   sudo bash docker-bench-security.sh
   ```

2. **Analizá los resultados** y anotá:

   * ¿Qué advertencias te salieron?
   * ¿Usás imágenes con `root`?
   * ¿Tenés configuraciones por defecto que deberías ajustar?

3. **Extra:** Compartí en Discord o en redes una imagen o fragmento del output que más te llamó la atención con el hashtag
   `#DevOpsConRoxs`

---

## 📚 Recursos Extra

* 📘 [CIS Docker Benchmark (PDF)](https://www.cisecurity.org/benchmark/docker)
* 🐳 [Docker Security Cheatsheet - OWASP](https://cheatsheetseries.owasp.org/cheatsheets/Docker_Security_Cheat_Sheet.html)
* 📼 [Video introductorio de Docker Security](https://www.youtube.com/watch?v=Kyx2PsuwomE)

---

## 🗣️ ¿Sabías que…?

> La imagen oficial de `nginx:latest` ha tenido vulnerabilidades críticas en varias ocasiones.
> Por eso, **nunca uses `:latest`** en producción. ¡Siempre especificá una versión!

---

## 🎉 ¡Gran comienzo!

Ya diste el primer paso para convertirte en un DevOps 🔥seguro🔥.
Mañana vamos a escanear vulnerabilidades reales con **Trivy**.

📸 No te olvides de subir tus avances a Discord o redes para motivar a otr\@s.

**¡Nos vemos en el Día 44!**

