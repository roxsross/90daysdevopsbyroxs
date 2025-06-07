---
sidebar_position: 2
title: Ejemplo 02
---

## Desplegando el Juego de Mario Bros

Aprenderás a clonar un repositorio que contiene un juego de Mario Bros estático y desplegarlo en un servidor web Apache en Ubuntu (o la distro de tu elección). 

**Paso 1: Actualizar el Sistema**

Asegúrate de que tu sistema esté actualizado. Abre una terminal y ejecuta:

```bash
sudo apt update
```

**Paso 2: Instalar Apache**

Instala Apache con el siguiente comando:

```bash
sudo apt install apache2 -y
```

**Paso 3: Verificar la Instalación de Apache**

Verifica que Apache esté funcionando correctamente con:

```bash
sudo systemctl status apache2
```

si no está funcionando recuerda habilitarlo e iniciarlo

```bash
sudo systemctl enable apache2
sudo systemctl start apache2
```

Verificar la Instalación de Apache

```bash
sudo systemctl status apache2
```


**Paso 4: Clonar el Repositorio**

Instala Git si aún no lo tienes:

```bash
sudo apt install git -y
```

Clona el repositorio que contiene el juego de Mario Bros:

```bash
cd /var/www/html
sudo git clone -b devops-mariobros https://github.com/roxsross/devops-static-web.git
```

**Paso 5: Configurar Apache**

Asegúrate de que Apache sirva el contenido del repositorio clonado. Puedes configurar un nuevo archivo de configuración de Apache o usar el archivo predeterminado.

Para simplificar, vamos a usar el archivo de configuración predeterminado. Crea un enlace simbólico al directorio clonado en el directorio web de Apache:

```bash
sudo ln -s /var/www/html/devops-static-web /var/www/html/mariobros
```

**Paso 6: Ajustar Permisos**

Asegúrate de que los permisos sean correctos para el contenido del juego:

```bash
sudo chown -R www-data:www-data /var/www/html/devops-static-web
```

**Paso 7: Reiniciar Apache**

Reinicia Apache para aplicar los cambios:

```bash
sudo systemctl restart apache2
```

**Paso 8: Verificar la Página Web**

Abre tu navegador y dirígete a `http://localhost/mariobros`. Deberías ver el juego de Mario Bros en tu navegador.

![](../../../static/images/web-02.png)

