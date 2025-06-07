---
sidebar_position: 1
title: Ejemplo 01
---

## Desplegando un hola mundo en servidor

Desplegar una página HTML es simple en un servidor web usando Apache en Ubuntu (o la distro de tu elección). Sigue estos pasos para tener tu página web en línea en poco tiempo.


**Paso 1: Actualizar el Sistema**

Primero, asegúrate de que tu sistema esté actualizado. Abre una terminal y ejecuta:

```bash
sudo apt update
```

**Paso 2: Instalar Apache**

Instala el servidor web Apache con el siguiente comando:

```bash
sudo apt install apache2 -y
```

**Paso 3: Verificar la Instalación de Apache**

Después de la instalación, verifica que Apache esté corriendo. Puedes usar `systemctl` para comprobar el estado del servicio:

```bash
sudo systemctl status apache2
```

Deberías ver algo como `active (running)` en la salida. Si Apache no está en ejecución, puedes iniciarlo con:

```bash
sudo systemctl start apache2
```

**Paso 4: Crear una Página HTML Simple**

Ahora, crea una página HTML simple para desplegar. Primero, navega al directorio de documentos de Apache:

```bash
cd /var/www/html
```

Luego, crea un archivo HTML llamado `index.html`:

```bash
sudo nano index.html
```

Agrega el siguiente contenido a `index.html`:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Mi Primera Página Web</title>
</head>
<body>
    <h1>¡Hola, Mundo!</h1>
    <p>Esta es mi primera página web desplegada en Apache.</p>
</body>
</html>
```

Guarda el archivo y cierra el editor (`Ctrl + X`, luego `Y`, y presiona `Enter`).

**Paso 5: Ajustar Permisos**

Asegúrate de que el archivo tenga los permisos correctos para que Apache pueda acceder a él:

```bash
sudo chmod 644 index.html
```

**Paso 6: Verificar la Página Web**

Abre tu navegador web y dirígete a la dirección IP de tu servidor (por ejemplo, `http://localhost` si estás trabajando localmente, o la IP de tu servidor si es remoto). Deberías ver tu página HTML con el mensaje "¡Hola, Mundo!".

![](../../../static/images/web-01.png)