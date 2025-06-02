---
title: Día 10 - Gestión de contenedores Docker
description: Aprende a controlar y administrar contenedores de forma efectiva
sidebar_position: 3
---

### 🐳 Aprende a controlar y administrar contenedores de forma efectiva

![](../../static/images/banner/2.png)

En este día vas a dominar el **ciclo de vida de los contenedores**, ejecutar comandos dentro de ellos, copiar archivos, configurar variables de entorno y obtener información avanzada. Todo esto es esencial para tener control total de tus entornos en desarrollo, testing y producción.

---

## 🚀 Ejecutando un contenedor en segundo plano

Podés ejecutar un contenedor que corra en segundo plano con `-d`:

```bash
docker run -d --name contenedor2 ubuntu bash -c "while true; do echo hello world; sleep 1; done"
````

### Verificar que está corriendo:

```bash
docker ps
```

### Ver qué está haciendo:

```bash
docker logs contenedor2
```

### Detener y eliminar el contenedor:

```bash
docker stop contenedor2
docker rm contenedor2
```

> Si querés borrarlo sin detenerlo primero:

```bash
docker rm -f contenedor2
```

---

## 🔁 Ciclo de vida de contenedores

Ejemplo con un contenedor que imprime la hora cada segundo:

```bash
docker run -d --name hora-container ubuntu bash -c 'while true; do echo $(date +"%T"); sleep 1; done'
docker logs -f hora-container
```

### En otra terminal, podés probar:

| Comando                         | Acción   |
| ------------------------------- | -------- |
| `docker stop hora-container`    | Detiene  |
| `docker start hora-container`   | Inicia   |
| `docker restart hora-container` | Reinicia |
| `docker pause hora-container`   | Pausa    |
| `docker unpause hora-container` | Reanuda  |

---

## 💬 Ejecutar comandos dentro del contenedor

```bash
docker exec hora-container date
```

Crear un nuevo contenedor que guarde la hora en un archivo:

```bash
docker run -d --name hora-container2 ubuntu bash -c 'while true; do date +"%T" >> hora.txt; sleep 1; done'
docker exec hora-container2 ls
docker exec hora-container2 cat hora.txt
```

---

## 📂 Copiar archivos entre host y contenedor

### Desde host hacia contenedor:

```bash
echo "Curso Docker" > docker.txt
docker cp docker.txt hora-container2:/tmp
docker exec hora-container2 cat /tmp/docker.txt
```

### Desde contenedor hacia el host:

```bash
docker cp hora-container2:hora.txt .
```

---

## 🔎 Procesos y detalles del contenedor

### Ver procesos en ejecución:

```bash
docker top hora-container2
```

### Inspeccionar contenedor (JSON detallado):

```bash
docker inspect hora-container2
```

### Filtros útiles con `--format`:

* ID del contenedor:

  ```bash
  docker inspect --format='{{.Id}}' hora-container2
  ```

* Imagen usada:

  ```bash
  docker inspect --format='{{.Config.Image}}' hora-container2
  ```

* Variables de entorno:

  ```bash
  docker container inspect -f '{{range .Config.Env}}{{println .}}{{end}}' hora-container2
  ```

* Comando ejecutado:

  ```bash
  docker inspect --format='{{range .Config.Cmd}}{{println .}}{{end}}' hora-container2
  ```

* IP asignada:

  ```bash
  docker inspect --format='{{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}' hora-container2
  ```

---

## 🌍 Configuración de contenedores con variables de entorno

Para configurar valores dentro del contenedor, usamos el flag `-e`:

```bash
docker run -it --name prueba -e USUARIO=prueba ubuntu bash
```

Comprobamos el valor dentro del contenedor:

```bash
echo $USUARIO
```

---

## 🛢️ Configuración de un contenedor con la imagen mariadb

Algunas imágenes, como `mariadb`, requieren variables para inicializarse. Según su [documentación](https://hub.docker.com/_/mariadb), una variable obligatoria es:

```bash
docker run -d --name some-mariadb -e MARIADB_ROOT_PASSWORD=my-secret-pw mariadb
```

Verificamos la variable dentro del contenedor:

```bash
docker exec -it some-mariadb env
```

Accedemos a MariaDB desde el contenedor:

```bash
docker exec -it some-mariadb mariadb -u root -p
```

---

### 🌐 Accediendo a MariaDB desde el exterior

1. Eliminamos el contenedor anterior:

```bash
docker rm -f some-mariadb
```

2. Creamos uno nuevo exponiendo el puerto:

```bash
docker run -d -p 3306:3306 --name some-mariadb -e MARIADB_ROOT_PASSWORD=my-secret-pw mariadb
```

3. Accedemos desde el host (requiere tener instalado el cliente de mariadb):

```bash
mysql -u root -p -h 127.0.0.1
```

---

## 🧠 Reto del Día

1. **Crea un contenedor personalizado** que cada 5 segundos escriba un mensaje diferente (puede ser la hora, un contador o un texto aleatorio) en un archivo llamado `mensajes.txt`.
2. **Copia el archivo `mensajes.txt`** desde el contenedor al host y verifica su contenido.
3. **Utiliza `docker inspect`** para obtener la IP del contenedor y el nombre de la imagen utilizada.
4. **Comprueba los procesos activos** dentro del contenedor usando `docker top` y verifica que el proceso principal sigue ejecutándose.
5. **Detén y elimina el contenedor de forma forzada** usando un solo comando.
6. *(Opcional)* Automatiza los pasos anteriores con un pequeño script bash.

---

### 🔥 Reto Extra: Variables de Entorno

1. **Ejecuta un contenedor de Alpine** pasándole dos variables de entorno: `APP_ENV=development` y `APP_VERSION=1.0.0`. Haz que el contenedor imprima ambas variables.
  ```bash
  docker run --rm -e APP_ENV=development -e APP_VERSION=1.0.0 alpine sh -c 'echo Entorno: $APP_ENV, Versión: $APP_VERSION'
  ```
2. **Crea un contenedor de MariaDB** que utilice variables de entorno para definir el usuario, contraseña y base de datos inicial. Verifica que las variables estén correctamente configuradas dentro del contenedor.

---

### ✨ Tip de Roxs

> ¡Dominar Docker no es solo saber correr un contenedor, sino **administrarlo como una pro**! Hoy diste un gran paso para controlar tu entorno DevOps desde la línea de comandos. 🚀

Usá el hashtag **#DevOpsConRoxs** o compartilo en el canal de la comunidad. 🎯


