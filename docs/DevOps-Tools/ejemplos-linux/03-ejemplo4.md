---
sidebar_position: 4
title: Ejemplo 04
---

## Despliegue de una Aplicación e-Commerce

Aprenderás a desplegar una aplicación e-commerce utilizando MariaDB y Apache con PHP. Sigue estos pasos para configurar tu entorno y poner en marcha tu aplicación.

## Requisitos Previos

Antes de comenzar con el despliegue, asegúrate de tener tu sistema actualizado:

```bash
sudo apt-get update
```

## Despliegue y Configuración de la Base de Datos

1. **Instalar MariaDB**

   Ejecuta los siguientes comandos para instalar MariaDB y asegurarte de que se inicie automáticamente al arrancar el sistema:

   ```bash
   sudo apt install -y mariadb-server
   sudo systemctl start mariadb
   sudo systemctl enable mariadb
   sudo systemctl status mariadb
   ```

2. **Configurar la Base de Datos**

   Accede a la consola de MariaDB y configura la base de datos y el usuario:

   ```bash
   sudo mysql
   ```

   Luego, en la consola de MariaDB:

   ```sql
   CREATE DATABASE ecomdb;
   CREATE USER 'ecomuser'@'localhost' IDENTIFIED BY 'ecompassword';
   GRANT ALL PRIVILEGES ON ecomdb.* TO 'ecomuser'@'localhost';
   FLUSH PRIVILEGES;
   ```

3. **Agregar Datos a la Base de Datos**

   Crea un archivo de script para cargar los datos iniciales en la base de datos:

   ```bash
   cat > db-load-script.sql <<-EOF
   USE ecomdb;
   CREATE TABLE products (
     id MEDIUMINT(8) UNSIGNED NOT NULL AUTO_INCREMENT,
     Name VARCHAR(255) DEFAULT NULL,
     Price VARCHAR(255) DEFAULT NULL,
     ImageUrl VARCHAR(255) DEFAULT NULL,
     PRIMARY KEY (id)
   ) AUTO_INCREMENT=1;

   INSERT INTO products (Name, Price, ImageUrl) VALUES
     ("Laptop", "100", "c-1.png"),
     ("Drone", "200", "c-2.png"),
     ("VR", "300", "c-3.png"),
     ("Tablet", "50", "c-5.png"),
     ("Watch", "90", "c-6.png"),
     ("Phone Covers", "20", "c-7.png"),
     ("Phone", "80", "c-8.png"),
     ("Laptop", "150", "c-4.png");
   EOF
   ```

   Ejecuta el script SQL para cargar los datos en la base de datos:

   ```bash
   mysql < db-load-script.sql
   ```

## Despliegue y Configuración del Servidor Web

1. **Instalar los Paquetes Necesarios**

   Instala Apache, PHP y el módulo PHP para MariaDB:

   ```bash
   sudo apt install -y apache2 php libapache2-mod-php php-mysql
   ```

2. **Iniciar el Servidor Web Apache**

   Asegúrate de que Apache esté en funcionamiento y habilitado para iniciarse automáticamente:

   ```bash
   sudo systemctl start apache2
   sudo systemctl enable apache2
   sudo systemctl status apache2
   ```

3. **Configurar el Código de la Aplicación**

   Clona el repositorio de la aplicación e-commerce y copia los archivos a la raíz del servidor web:

   ```bash
        sudo apt install git -y
        git clone -b ecommerce https://github.com/roxsross/devops-static-web.git
        cp -r devops-static-web/app-ecommerce/* /var/www/html/
        mv /var/www/html/index.html /var/www/html/index.html.bkp
   ```

4. **Actualizar el Archivo `index.php`**

   Modifica `index.php` para que apunte al nuevo host de base de datos:

   ```bash
   sudo sed -i 's/172.20.1.101/localhost/g' /var/www/html/index.php
   ```

   Asegúrate de que el archivo `index.php` contenga lo siguiente:

   ```php
   <?php
   $link = mysqli_connect('localhost', 'ecomuser', 'ecompassword', 'ecomdb');
   if ($link) {
     $res = mysqli_query($link, "SELECT * FROM products;");
     echo "<h2>Products</h2><ul>";
     while ($row = mysqli_fetch_assoc($res)) {
       echo "<li>" . $row['Name'] . " - $" . $row['Price'] . "</li>";
     }
     echo "</ul>";
   } else {
     echo "Error connecting to the database.";
   }
   ?>
   ```

5. **Verificar el Despliegue**

   Asegúrate de que la aplicación esté funcionando correctamente accediendo a la siguiente URL en tu navegador:

   ```bash
   curl http://localhost
   ```


![](../../../static/images/web-04.png)
---

**Documentación Complementaria:**

- [Cómo instalar la pila Linux, Apache, MySQL y PHP (LAMP) en Ubuntu 20.04](https://www.digitalocean.com/community/tutorials/how-to-install-linux-apache-mysql-php-lamp-stack-on-ubuntu-20-04-es)
- [Cómo instalar MariaDB en Ubuntu 20.04](https://www.digitalocean.com/community/tutorials/how-to-install-mariadb-on-ubuntu-20-04)

© KodeKloud 2019 | Mejorado por RoxsRoss 2023 | Todos los derechos reservados