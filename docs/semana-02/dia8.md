---
title: Día 8 - Conceptos básicos de contenedores Docker
description: Aprende qué es Docker, cómo funciona y ejecuta tu primer contenedor
sidebar_position: 1
---

### 🚢 Aprende qué es Docker, cómo funciona y ejecuta tu primer contenedor

![](../../static/images/banner/2.png)

¡Bienvenidos al mundo de los contenedores! Hoy damos el primer paso hacia una de las herramientas más importantes del universo DevOps: **Docker**.

---

## 🎯 ¿Por qué deberías aprender Docker?

En el camino DevOps, trabajamos con múltiples entornos: desarrollo, testing, staging, producción. Lo que funciona en una máquina, puede no funcionar en otra. Docker resuelve eso.

> "Con Docker, empaquetás una aplicación *con TODO lo que necesita* para que corra igual en cualquier lugar."

Ya no tendrás que decir:  
❌ “En mi máquina sí funciona...”  
✅ “¡Con Docker funciona en todas!”

---

## 🧠 ¿Qué es Docker?

**Docker** es una plataforma open-source que permite desarrollar, enviar y ejecutar aplicaciones dentro de **contenedores**. Un contenedor es una unidad ligera y portable que incluye todo lo necesario para ejecutar una aplicación: código, runtime, librerías, variables de entorno y más.


Para profundizar en Docker y resolver dudas, consulta siempre la [documentación oficial de Docker](https://docs.docker.com/). Allí encontrarás guías, referencias de comandos, ejemplos y buenas prácticas para todos los niveles.


---

## 🏗️ Arquitectura de Docker

Docker tiene tres componentes clave:

![](https://docs.docker.com/get-started/images/docker-architecture.webp)

| Componente     | Descripción |
|----------------|-------------|
| **Docker Engine** | Motor principal que permite crear y ejecutar contenedores |
| **Docker Daemon (`dockerd`)** | Servicio que corre en segundo plano, administra contenedores e imágenes |
| **CLI (`docker`)** | Herramienta de línea de comandos para interactuar con Docker |
| **Docker Hub** | Registro público donde se almacenan y comparten imágenes de contenedores |

### 🧱 ¿Cómo funciona internamente?

1. **Imágenes**: Plantillas inmutables. Contienen el sistema de archivos, dependencias y comandos.
2. **Contenedores**: Instancias en ejecución de una imagen.
3. **Volúmenes**: Permiten persistir datos incluso si el contenedor se elimina.
4. **Redes**: Docker crea redes virtuales para comunicar contenedores entre sí.

---

## 🆚 Docker vs Máquinas Virtuales

| Característica      | Contenedor (Docker) | Máquina Virtual |
|---------------------|---------------------|------------------|
| Arranque            | Rápido (segundos)   | Lento (minutos)  |
| Peso                | Ligero (MBs)        | Pesado (GBs)     |
| Aislamiento         | Parcial (comparten kernel) | Total (kernel propio) |
| Uso de recursos     | Eficiente           | Alto             |
| Portabilidad        | Alta                | Limitada         |
| Velocidad de despliegue | Muy rápida     | Más lenta        |

---

## 🛠️ Instalación de Docker

### Opción recomendada: Instalación desde repositorios oficiales

```bash
sudo apt-get update
sudo apt-get install ca-certificates curl gnupg
````

Agregar la clave GPG:

```bash
sudo install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/debian/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
sudo chmod a+r /etc/apt/keyrings/docker.gpg
```

Agregar el repositorio:

```bash
echo \
"deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/debian \
$(. /etc/os-release && echo "$VERSION_CODENAME") stable" | \
sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
```

Instalar Docker Engine:

```bash
sudo apt-get update
sudo apt-get install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
```

Agregar tu usuario al grupo `docker` (opcional pero recomendado):

```bash
sudo usermod -aG docker $USER
su - $USER
```

Verificar:

```bash
docker --version
```

### Comunidad: Moby

Además de Docker, existe la comunidad **Moby**, un proyecto open-source que sirve como base tecnológica para Docker y otras herramientas de contenedores. Moby permite a desarrolladores y empresas construir sus propias soluciones de contenedores personalizadas utilizando componentes modulares.

- [Sitio oficial de Moby](https://mobyproject.org/)
- [Repositorio en GitHub](https://github.com/moby/moby)

Si usamos debian o ubuntu podemos realizar la instalación de la versión de la comunidad:

```bash
apt install docker.io
```

### Instalación con Docker Desktop

Si usas **Windows** o **macOS**, la forma más sencilla de instalar Docker es mediante **Docker Desktop**:

![](https://www.docker.com/app/uploads/2023/07/docker-desktop-421_f2-1110x653.png)

1. Descarga Docker Desktop desde la [página oficial](https://www.docker.com/products/docker-desktop/).
2. Ejecuta el instalador y sigue los pasos indicados.
3. Una vez instalado, abre Docker Desktop y espera a que el servicio inicie.
4. Abre una terminal (CMD, PowerShell o Terminal en macOS) y verifica la instalación con:

```bash
docker --version
```

Docker Desktop incluye una interfaz gráfica para gestionar contenedores, imágenes, volúmenes y redes, facilitando el trabajo tanto a principiantes como a usuarios avanzados.

---

## 👋 ¡Hola mundo desde un contenedor!

Vamos a ejecutar tu primer contenedor:

```bash
docker run hello-world
```

Esto hace lo siguiente:

* Descarga una imagen mínima desde Docker Hub.
* Crea un contenedor basado en esa imagen.
* Muestra un mensaje de éxito.

Si ves el mensaje: **“Hello from Docker!”**, todo está funcionando.

---

## 🔍 Comandos básicos de Docker

| Acción                     | Comando                |
| -------------------------- | ---------------------- |
| Ver contenedores activos   | `docker ps`            |
| Ver todos los contenedores | `docker ps -a`         |
| Descargar una imagen       | `docker pull <nombre>` |
| Ejecutar una imagen        | `docker run <nombre>`  |
| Detener un contenedor      | `docker stop <id>`     |
| Eliminar un contenedor     | `docker rm <id>`       |
| Eliminar una imagen        | `docker rmi <id>`      |

---

## 🧩 Recursos recomendados

* 📘 [Guía oficial de instalación de Docker](https://docs.docker.com/engine/install/)
* 🐳 [Play with Docker (laboratorio online)](https://labs.play-with-docker.com/)
* 📎 [Cheat Sheet de Docker](https://dockerlabs.collabnix.com/docker/cheatsheet/)


---

## 💪 Tarea del Día

1. Instala Docker siguiendo la guía.
2. Ejecutá `docker run hello-world`.
3. Usá los comandos `ps`, `images`, `pull`, `run` con alguna imagen como `nginx` o `alpine`.
4. Compartí en el grupo una captura de tu primer contenedor funcionando. 📸

---

## 📝 Tarea extra: Docker Workshop

Te recomendamos realizar el [Docker Workshop oficial](https://docs.docker.com/get-started/workshop/), un taller guiado de 45 minutos con instrucciones paso a paso para comenzar con Docker. Aprenderás a:

- Construir y ejecutar una imagen como contenedor.
- Compartir imágenes usando Docker Hub.
- Desplegar aplicaciones Docker con múltiples contenedores y una base de datos.
- Ejecutar aplicaciones usando Docker Compose.

¡Ideal para afianzar los conceptos y practicar con ejemplos reales!
---

## 🔥 Consejo DevOps by Roxs

> “Aprender Docker es como aprender a andar en bici para los desarrolladores de infraestructura moderna. ¡Una vez que arrancás, no hay vuelta atrás!”

Usá el hashtag **#DevOpsConRoxs** o compartilo en el canal de la comunidad. 🎯
