---
title: Día 9 - Docker — ¡Configura tu primer contenedor!
description: Construye, ejecuta y entiende tu primer contenedor
sidebar_position: 2
---

# 🐳 Construye, ejecuta y entiende tu primer contenedor

![](../../static/images/banner/2.png)

### **Comenzá con Docker: Una guía paso a paso para tu primer contenedor**

Hoy exploramos una de las herramientas más poderosas del mundo DevOps: **Docker**.  
Si alguna vez te preguntaste cómo empezar con contenedores, esta guía te llevará paso a paso para correr tu primer contenedor de manera simple y efectiva.

---

## 🧠 ¿Qué es Docker y por qué usar contenedores?

**Docker** es una plataforma que utiliza **contenedores** para desarrollar, enviar y ejecutar aplicaciones de forma consistente, sin importar dónde se ejecuten.

Un contenedor empaqueta **todo lo que una aplicación necesita**: código, dependencias, librerías, configuraciones. Es liviano, portátil y se puede mover entre entornos con total facilidad.

### ✅ Ventajas de los contenedores Docker:

- **Portabilidad**: Ejecutá tu app donde quieras, sin "funciona en mi máquina".
- **Aislamiento**: Cada app corre de forma independiente.
- **Eficiencia**: Usa menos recursos que las máquinas virtuales tradicionales.

---

## 🛠️ Primeros pasos: Verificá tu instalación de Docker

1. Asegurate de tener Docker instalado.  
   🔗 [Guía para instalar Docker sin gastar un peso](https://blog.295devops.com/crea-tu-laboratorio-devops-local-sin-gastar-un-peso)

2. Verificá la instalación con este comando:

```bash
docker --version
```

---

## 🚀 Configurá tu primer contenedor Docker

### Paso 1: Descargar una imagen

Las **imágenes** son las plantillas base que usamos para crear contenedores.

Descargá la imagen oficial `hello-world`:

```bash
docker pull hello-world
```

### Paso 2: Ejecutar tu primer contenedor

```bash
docker run hello-world
```

✅ ¿Qué pasa aquí?

* **Docker** descarga la imagen (si no la tenés localmente).
* Crea un nuevo contenedor basado en esa imagen.
* Ejecuta el contenido y te da un mensaje de confirmación si todo funciona.

---

## 🌐 Probá algo más real: Servidor web con NGINX

### 1. Descargá la imagen:

```bash
docker pull nginx
```

### 2. Ejecutá el contenedor en background:

```bash
docker run -d -p 8080:80 --name web-nginx nginx
```

* `-d`: Modo desatendido (en segundo plano).
* `-p 8080:80`: Expone el puerto 80 del contenedor como 8080 en tu máquina.
* `--name`: Le da un nombre personalizado al contenedor.

### 3. Verificá que funcione

Abrí tu navegador y entrá en [http://localhost:8080](http://localhost:8080)
🚀 ¡Deberías ver la página por defecto de NGINX!

---

## 🔄 Ciclo de vida del contenedor

| Estado      | Qué significa                 |
| ----------- | ----------------------------- |
| **created** | El contenedor fue creado      |
| **running** | Está ejecutándose activamente |
| **paused**  | Está suspendido               |
| **exited**  | Finalizó su ejecución         |

---

## 🧰 Comandos esenciales para gestión de contenedores

### 📋 Ver contenedores en ejecución:

```bash
docker ps
```

### 📋 Ver todos (activos e inactivos):

```bash
docker ps -a
```

### ⛔ Detener un contenedor:

```bash
docker stop web-nginx
```

### 🗑️ Eliminar un contenedor:

```bash
docker rm web-nginx
```

### 🧽 Eliminar todos los contenedores detenidos:

```bash
docker container prune
```

---

## 🧪 Contenedores interactivos

Podés correr un contenedor tipo Ubuntu y explorar desde dentro:

```bash
docker run -it --name contenedor1 ubuntu bash
```

* `-it`: Te permite interactuar como si fuera una terminal.
* `--name`: Le asignás un nombre.
* `ubuntu`: Imagen base.
* `bash`: Ejecutás la shell bash.

Para salir, escribí `exit`.

🔁 Para volver a entrar después de salir:

```bash
docker start contenedor1
docker attach contenedor1
```

O ejecutar un comando directo:

```bash
docker exec contenedor1 ls -al
```

---

## 🔍 Inspeccionar un contenedor

```bash
docker inspect contenedor1
```

Te devuelve información detallada en formato JSON:

* ID
* Red y puertos
* Entrypoint
* Variables de entorno
* Configuración de volúmenes


---

## ✅ Tarea del Día

1. Ejecutá tu primer contenedor con `hello-world`.
2. Probá NGINX en `localhost:8080`.
3. Usá `docker ps`, `stop`, `rm`, `exec`, `inspect`.
4. Explorá un contenedor interactivo con `ubuntu`.
5. Compartí una captura de tu navegador con NGINX corriendo o terminal con `hello-world` OK en el grupo 💬.

🔁 **Tarea extra: Explorá el historial de imágenes**

```bash
docker history nginx
```

📌 Esto te va a mostrar cómo se construyó esa imagen capa por capa.

---

## 🚀 Tarea del Día extra: ¡Tu Primer Sitio Web en un Contenedor!

### 🧪 Objetivo

Crear un contenedor Docker con **NGINX** que sirva una web estática personalizada desde una carpeta externa, accesible en:
📍 `http://localhost:9999`

---

### 📋 Instrucciones paso a paso

1. **Correr un contenedor llamado `bootcamp-web`**:

```bash
docker run -d --name bootcamp-web -p 9999:80 nginx
```

2. **Clonar el repositorio con la web**:

```bash
git clone -b devops-simple-web https://github.com/roxsross/devops-static-web.git
```

3. **Copiar el contenido al contenedor**:

```bash
docker cp devops-static-web/bootcamp-web/. bootcamp-web:/usr/share/nginx/html/
```

4. **Verificar que los archivos estén copiados**:

```bash
docker exec bootcamp-web ls /usr/share/nginx/html
```

5. **Acceder al sitio en tu navegador**:

Abrí: [http://localhost:9999](http://localhost:9999)

---

### ✅ Resultado Esperado

Deberías ver en pantalla una web estática servida por tu contenedor `bootcamp-web` usando NGINX.

![](https://bootcamp.295devops.com/assets/images/ses1-ejer2-fca816fd2465864500194c00360a1fb1.png)

🎉 ¡Felicitaciones! Estás dominando los contenedores.

---

## 💡 Tip de Roxs

> “Un contenedor no es solo para testear, ¡también puede ser tu primer servidor web real! Practicar con cosas que podés ver y tocar motiva el doble 🚀”

---

## 📚 Recursos recomendados

* 🧪 [Play with Docker](https://labs.play-with-docker.com/)
* 📘 [Cheatsheet de Docker](https://dockerlabs.collabnix.com/docker/cheatsheet/)
* 📘 [Documentación oficial](https://docs.docker.com/get-started/)

---

Usá el hashtag **#DevOpsConRoxs** o compartilo en el canal de la comunidad. 🎯


