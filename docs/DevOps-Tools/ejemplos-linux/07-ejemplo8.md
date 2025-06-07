---
sidebar_position: 8
title: Ejemplo 08
---

## Instalando Nginx 

Nginx es uno de los servidores web más populares del mundo y es responsable de alojar algunos de los sitios más grandes y con mayor tráfico en internet. Es una opción ligera que se puede usar tanto como servidor web como proxy inverso.

En esta guía, discutiremos cómo instalar Nginx en tu servidor Ubuntu 22.04, ajustar el firewall, gestionar el proceso de Nginx y configurar bloques de servidor para alojar más de un dominio desde un solo servidor.

Despliega tus aplicaciones desde GitHub usando DigitalOcean App Platform. Deja que DigitalOcean se encargue de escalar tu aplicación.

### Requisitos Previos

Antes de comenzar esta guía, debes tener un usuario regular (no root) con privilegios sudo configurado en tu servidor. Puedes aprender a configurar una cuenta de usuario regular siguiendo nuestra guía de configuración inicial del servidor para Ubuntu 22.04.

También es opcional registrar un nombre de dominio antes de completar los últimos pasos de este tutorial. Para aprender más sobre cómo configurar un nombre de dominio con DigitalOcean, consulta nuestra Introducción a DigitalOcean DNS.

Cuando tengas una cuenta disponible, inicia sesión como tu usuario no root para comenzar.

### Paso 1 – Instalación de Nginx

Dado que Nginx está disponible en los repositorios predeterminados de Ubuntu, es posible instalarlo desde estos repositorios usando el sistema de empaquetado `apt`.

Como esta es nuestra primera interacción con el sistema de empaquetado `apt` en esta sesión, actualizaremos nuestro índice de paquetes local para tener acceso a las listas de paquetes más recientes. Luego, podremos instalar Nginx:

```bash
sudo apt update
sudo apt install nginx
```

Presiona `Y` cuando se te pida confirmar la instalación. Si se te solicita reiniciar algún servicio, presiona `ENTER` para aceptar los valores predeterminados y continuar. `apt` instalará Nginx y cualquier dependencia requerida en tu servidor.


### Paso 2 – Verificar tu Servidor Web

Al final del proceso de instalación, Ubuntu 22.04 inicia Nginx. El servidor web debería estar ya en funcionamiento.

Podemos verificar con el sistema de inicialización `systemd` para asegurarnos de que el servicio está en funcionamiento escribiendo:

```bash
systemctl status nginx
```

La salida confirmará que el servicio ha iniciado con éxito. Sin embargo, la mejor manera de probar esto es solicitar una página de Nginx.

Puedes acceder a la página de inicio predeterminada de Nginx para confirmar que el software está funcionando correctamente navegando a la dirección IP de tu servidor. Si no conoces la dirección IP de tu servidor, puedes encontrarla usando la herramienta `icanhazip.com`, que te dará tu dirección IP pública:

```bash
curl -4 icanhazip.com
```

Cuando tengas la dirección IP de tu servidor, ingrésala en la barra de direcciones de tu navegador:

```
http://your_server_ip
```

Deberías recibir la página de inicio predeterminada de Nginx:

**Página predeterminada de Nginx**

Si estás en esta página, tu servidor está funcionando correctamente y está listo para ser gestionado.

### Paso 4 – Gestionar el Proceso de Nginx

Ahora que tienes tu servidor web en funcionamiento, repasemos algunos comandos básicos de gestión.

Para detener tu servidor web, escribe:

```bash
sudo systemctl stop nginx
```

Para iniciar el servidor web cuando está detenido, escribe:

```bash
sudo systemctl start nginx
```

Para detener y luego iniciar el servicio nuevamente, escribe:

```bash
sudo systemctl restart nginx
```

Si solo estás realizando cambios de configuración, Nginx a menudo puede recargar sin cerrar las conexiones. Para hacer esto, escribe:

```bash
sudo systemctl reload nginx
```

De forma predeterminada, Nginx está configurado para iniciarse automáticamente cuando arranca el servidor. Si no es esto lo que deseas, puedes desactivar este comportamiento escribiendo:

```bash
sudo systemctl disable nginx
```

Para volver a habilitar el servicio para que se inicie al arrancar, puedes escribir:

```bash
sudo systemctl enable nginx
```

Ahora has aprendido los comandos básicos de gestión y deberías estar listo para configurar el sitio para alojar más de un dominio.

### Paso 5 – Configurar Bloques de Servidor (Recomendado)

Al usar el servidor web Nginx, los bloques de servidor (similares a los hosts virtuales en Apache) pueden usarse para encapsular detalles de configuración y alojar más de un dominio desde un solo servidor. Configuraremos un dominio llamado `your_domain`, pero deberías reemplazar esto con tu propio nombre de dominio.

Nginx en Ubuntu 22.04 tiene un bloque de servidor habilitado por defecto que está configurado para servir documentos desde un directorio en `/var/www/html`. Aunque esto funciona bien para un solo sitio, puede volverse engorroso si estás alojando múltiples sitios. En lugar de modificar `/var/www/html`, crearemos una estructura de directorios dentro de `/var/www` para nuestro sitio `your_domain`, dejando `/var/www/html` en su lugar como el directorio predeterminado que se servirá si una solicitud de cliente no coincide con otros sitios.

Crea el directorio para `your_domain` de la siguiente manera, usando el flag `-p` para crear los directorios padres necesarios:

```bash
sudo mkdir -p /var/www/your_domain/html
```

Luego, asigna la propiedad del directorio con la variable de entorno `$USER`:

```bash
sudo chown -R $USER:$USER /var/www/your_domain/html
```

Los permisos de tus raíces web deberían ser correctos si no has modificado tu valor `umask`, que establece los permisos predeterminados de archivos. Para asegurarte de que tus permisos son correctos y permiten al propietario leer, escribir y ejecutar los archivos mientras que otorgan solo permisos de lectura y ejecución a los grupos y otros, puedes ingresar el siguiente comando:

```bash
sudo chmod -R 755 /var/www/your_domain
```

A continuación, crea una página `index.html` de muestra usando `nano` o tu editor favorito:

```bash
nano /var/www/your_domain/html/index.html
```

Dentro, agrega el siguiente HTML de muestra:

```html
<html>
    <head>
        <title>¡Bienvenido a your_domain!</title>
    </head>
    <body>
        <h1>¡Éxito! El bloque de servidor your_domain está funcionando.</h1>
    </body>
</html>
```

Guarda y cierra el archivo presionando Ctrl+X para salir, luego cuando se te pida guardar, presiona `Y` y luego `Enter`.

Para que Nginx sirva este contenido, es necesario crear un bloque de servidor con las directivas correctas. En lugar de modificar el archivo de configuración predeterminado directamente, hagamos uno nuevo en `/etc/nginx/sites-available/your_domain`:

```bash
sudo nano /etc/nginx/sites-available/your_domain
```

Pega el siguiente bloque de configuración, que es similar al predeterminado, pero actualizado para nuestro nuevo directorio y nombre de dominio:

```nginx
server {
        listen 80;
        listen [::]:80;

        root /var/www/your_domain/html;
        index index.html index.htm index.ng

inx-debian.html;

        server_name your_domain;

        location / {
                try_files $uri $uri/ =404;
        }
}
```

Guarda y cierra el archivo de configuración. Luego, crea un enlace simbólico para habilitar el nuevo bloque de servidor en el directorio `sites-enabled` usando el comando `ln`:

```bash
sudo ln -s /etc/nginx/sites-available/your_domain /etc/nginx/sites-enabled/
```

Finalmente, verifica la configuración de Nginx para asegurarte de que no hay errores de sintaxis y recarga el servicio para aplicar los cambios:

```bash
sudo nginx -t
sudo systemctl reload nginx
```

Puedes verificar el contenido del sitio navegando a tu dirección IP, o configurando el nombre de dominio para apuntar a esta dirección IP y luego navegando a él.


**Temas Relacionados**

- [Introducción a Nginx](https://www.nginx.com/resources/wiki/)
- [Documentación Oficial de Nginx](https://nginx.org/en/docs/)

