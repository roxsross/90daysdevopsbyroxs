---
title: Día 11 - Redes y Volúmenes en Docker
description: Aprende a conectar contenedores entre sí y gestionar datos persistentes
sidebar_position: 4
---

### 🕸️ Aprende a conectar contenedores entre sí y gestionar datos persistentes

![](../../static/images/banner/2.png)

Hoy exploramos cómo **conectar contenedores** entre sí con redes personalizadas y cómo **persistir datos** usando volúmenes, una parte esencial para aplicaciones reales que requieren bases de datos, almacenamiento de logs o configuración compartida.

---

## 🌐 Tipos de redes en Docker

Docker soporta distintos tipos de redes. Cada una se usa para distintos casos de uso:

| Tipo         | Descripción                                                                 |
|--------------|------------------------------------------------------------------------------|
| **bridge**   | Red por defecto para contenedores en una misma máquina                      |
| **host**     | El contenedor comparte la red del host (sin aislamiento de red)             |
| **none**     | Sin red. El contenedor no se conecta a ninguna red                          |
| **overlay**  | Usado con Docker Swarm para comunicar contenedores entre múltiples hosts    |
| **macvlan**  | Asigna una IP directamente desde la red del host. Útil para apps legacy     |

### 🔍 Ver todas las redes disponibles:

```bash
docker network ls
```

---

## 🔌 Crear y usar una red personalizada

```bash
docker network create mi-red
docker run -d --name backend --network mi-red alpine sleep 3600
docker run -it --rm --network mi-red alpine ping backend
```

✅ Los contenedores se comunican por nombre gracias al DNS interno de Docker.

---

### 🔧 Inspeccionar y eliminar redes

```bash
docker network inspect mi-red
docker network rm mi-red
```

> ⚠️ No se puede eliminar una red si hay contenedores activos conectados.

---

## 💾 Tipos de volúmenes

Docker permite dos formas principales de persistencia:

| Tipo                                        | ¿Dónde se guarda?                             | Uso recomendado                              |
| ------------------------------------------- | --------------------------------------------- | -------------------------------------------- |
| **volúmenes gestionados** (`docker volume`) | En la ruta `/var/lib/docker/volumes` del host | Compartir datos entre contenedores           |
| **bind mounts**                             | En cualquier ruta del host (ej: `./datos`)    | Desarrollo local, sincronización en vivo     |
| **tmpfs**                                   | En memoria RAM (temporal)                     | Apps sensibles que no necesitan persistencia |

---

## 📦 Crear y usar un volumen

```bash
docker volume create datos-app
docker run -d --name contenedor-volumen -v datos-app:/datos alpine sh -c "while true; do date >> /datos/fechas.log; sleep 5; done"
docker exec contenedor-volumen cat /datos/fechas.log
```

### 📋 Ver volúmenes disponibles:

```bash
docker volume ls
```

### 🧽 Eliminar un volumen (si no está en uso):

```bash
docker volume rm datos-app
```

---

## 🗂️ Bind Mounts (montar directorios del host)

```bash
mkdir datos-local
docker run -it --name con-mount -v $(pwd)/datos-local:/datos alpine sh
```

✅ Todo lo que guardes en `/datos` del contenedor aparece en tu carpeta local `datos-local`.

---

## 🔁 Comandos útiles de redes y volúmenes

### Redes

```bash
docker network create <nombre>
docker network ls
docker network inspect <nombre>
docker network rm <nombre>
docker network connect <red> <contenedor>
docker network disconnect <red> <contenedor>
```

### Volúmenes

```bash
docker volume create <nombre>
docker volume ls
docker volume inspect <nombre>
docker volume rm <nombre>
```
## 🧪 Ejemplo: MySQL con Docker

Este ejemplo muestra cómo configurar y gestionar un contenedor de MySQL y persistir sus datos.

### 1. Crear el contenedor con volumen persistente:

```bash
docker run -d --name mysql-container \
  -e MYSQL_ROOT_PASSWORD=my-data-pass \
  -v /data/mysql-data:/var/lib/mysql \
  mysql
```

### 2. Acceder al contenedor:

```bash
docker exec -it mysql-container bash
mysql -u root -p
```

(Contraseña: `my-data-pass`)

### 3. Ejecutar un script SQL (dentro del contenedor):

```sql
USE base_de_datos;
SOURCE /ruta/al/archivo/data.sql;
```

### 4. Detener y eliminar el contenedor:

```bash
docker stop mysql-container
docker rm mysql-container
```

### 5. Reiniciarlo y verificar que los datos persisten:

```bash
docker run -d --name mysql-container \
  -e MYSQL_ROOT_PASSWORD=my-data-pass \
  -v /data/mysql-data:/var/lib/mysql \
  mysql
```

```bash
docker exec -it mysql-container bash
mysql -u root -p
USE base_de_datos;
SELECT * FROM usuarios;
```


---

## 🧠 Reto del Día

🧪 **Conecta y persiste**

1. Crear una red personalizada `miapp-net`.
2. Ejecutar dos contenedores `api` y `db` en esa red.
3. Desde `api`, hacé ping a `db` para verificar conectividad.
4. Crear un volumen `vol-db` y montarlo en `/datos` dentro del contenedor `db`.
5. Desde `db`, escribí un archivo en `/datos/info.txt`.
6. Eliminá el contenedor `db`, volvé a crearlo, y comprobá si el archivo sigue existiendo.

---

## 🧪 Reto Adicional: MongoDB + Mongo Express

🎯 **Objetivo**: Crear un entorno con dos contenedores — MongoDB y Mongo Express — y conectarlos con Docker.

### Instrucciones:

1. Crear contenedor de MongoDB:

```bash
docker run -d --name mongo \
  -e MONGO_INITDB_ROOT_USERNAME=admin \
  -e MONGO_INITDB_ROOT_PASSWORD=secret \
  --network miapp-net \
  mongo
```

2. Crear contenedor de Mongo Express:

```bash
docker run -d --name mongo-express \
  -e ME_CONFIG_MONGODB_ADMINUSERNAME=admin \
  -e ME_CONFIG_MONGODB_ADMINPASSWORD=secret \
  -e ME_CONFIG_MONGODB_SERVER=mongo \
  -p 8081:8081 \
  --network miapp-net \
  mongo-express
```

3. Acceder a la interfaz web en:
   👉 [http://localhost:8081](http://localhost:8081)

4. Crear la base de datos `Library` y la colección `Books`.

5. Importar datos (`books.json`):

```json
[
  { "title": "Docker in Action, Second Edition", "author": "Jeff Nickoloff and Stephen Kuenzli" },
  { "title": "Kubernetes in Action, Second Edition", "author": "Marko Lukša" }
]
```

📂 Colocá este archivo en tu máquina y usá la interfaz de Mongo Express para cargarlo.

> 🔗 Documentación Mongo Express: [https://hub.docker.com/\_/mongo-express](https://hub.docker.com/_/mongo-express)


---

## 📚 Recursos complementarios

* 📘 [Documentación oficial sobre redes Docker](https://docs.docker.com/network/)
* 📘 [Documentación sobre volúmenes Docker](https://docs.docker.com/storage/volumes/)
* 🛠️ [Play with Docker para practicar online](https://labs.play-with-docker.com/)

---

### ✨ Tip de Roxs

> "Si tus contenedores no pueden hablarse o guardar datos... ¡estás jugando a las escondidas! 🔍 Conectalos y hacelos persistentes para armar apps reales."

Compartí tu arquitectura o captura con el hashtag **#DevOpsConRoxs** 🚀

Usá el hashtag **#DevOpsConRoxs** o compartilo en el canal de la comunidad. 🎯