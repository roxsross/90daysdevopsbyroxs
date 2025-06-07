---
sidebar_position: 3
title: Ejemplo 03
---

## **Instalación del Stack LAMP (Linux, Apache, MySQL, PHP)**

Un stack LAMP es una combinación de software de código abierto que proporciona una plataforma robusta para alojar sitios web dinámicos y aplicaciones web escritas en PHP. LAMP es un acrónimo que representa:

- **L**inux: El sistema operativo.
- **A**pache: El servidor web.
- **M**ySQL: El sistema de gestión de bases de datos.
- **P**HP: El lenguaje de scripting para procesar contenido dinámico.

En este tutorial, te guiaré a través de los pasos necesarios para configurar un stack LAMP en Ubuntu, aunque estos pasos pueden aplicarse con ligeras variaciones en otras distribuciones de Linux.

### **Paso 1: Instalación de Apache**

Apache es uno de los servidores web más populares y confiables. Comienza actualizando la caché del gestor de paquetes:

```bash
sudo apt update
```

Luego, instala Apache:

```bash
sudo apt install apache2 -y
```

> **Nota:** Asegúrate de habilitar e iniciar el servicio Apache:

```bash
sudo systemctl enable apache2
sudo systemctl start apache2
```

Para verificar que Apache esté funcionando correctamente, abre un navegador y accede a la dirección IP pública de tu servidor:

```
http://your_server_ip
```

Deberías ver la página predeterminada de Apache, que indica que el servidor está funcionando correctamente.

### **Cómo Encontrar la Dirección IP Pública de tu Servidor**

Puedes obtener tu dirección IP pública utilizando la utilidad `curl`:

```bash
curl http://icanhazip.com
```

Escribe esta dirección IP en tu navegador web para confirmar que tu servidor está accesible.

### **Paso 2: Instalación de MySQL**

MySQL es el sistema de gestión de bases de datos utilizado para almacenar y gestionar datos. Instala MySQL con el siguiente comando:

```bash
sudo apt install -y mysql-server
```

> **Nota:** Habilita e inicia el servicio MySQL:

```bash
sudo systemctl enable mysql
sudo systemctl start mysql
```

Accede al prompt de MySQL:

```bash
sudo mysql
```

Cambia el método de autenticación del usuario root para usar una contraseña:

```sql
ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'password';
```

Sal del prompt de MySQL:

```sql
exit
```

Ejecuta el script de seguridad de MySQL:

```bash
sudo mysql_secure_installation
```

Sigue las indicaciones para configurar la validación de contraseñas. Se recomienda el nivel **MEDIUM** para asegurar contraseñas robustas.

### **Paso 3: Instalación de PHP**

PHP es el lenguaje de scripting que interactúa con MySQL y genera contenido dinámico. Instala PHP junto con los módulos necesarios:

```bash
sudo apt install -y php libapache2-mod-php php-mysql
```

Reinicia Apache para cargar el módulo PHP:

```bash
sudo systemctl restart apache2
```

### **Paso 4: Verificar la Instalación**

Crea un archivo de prueba para verificar la configuración de PHP. Abre un nuevo archivo en el directorio web predeterminado:

```bash
sudo nano /var/www/html/info.php
```

Agrega el siguiente contenido al archivo:

```php
<?php
phpinfo();
?>
```

Guarda y cierra el archivo. Accede a este archivo desde tu navegador:

```
http://your_server_ip/info.php || http://localhost/info.php
```

Deberías ver una página con la configuración de PHP, confirmando que PHP está funcionando correctamente.

### **Probar la Conexión a la Base de Datos desde PHP**

Para verificar la conexión a la base de datos desde PHP, crea una base de datos y un usuario de prueba en MySQL:

```bash
sudo mysql
```

Crea una base de datos y un usuario:

```sql
CREATE DATABASE example_database;
CREATE USER 'example_user'@'%' IDENTIFIED BY 'password';
GRANT ALL ON example_database.* TO 'example_user'@'%';
```

Sal de la consola de MySQL:

```sql
exit
```

Crea un archivo PHP para conectar con MySQL y consultar datos. Abre un nuevo archivo:

```bash
sudo nano /var/www/html/todo_list.php
```

Agrega el siguiente contenido al archivo, reemplazando `example_user` y `password` con los valores que has configurado:

```php
<?php
$user = "example_user";
$password = "password";
$database = "example_database";
$table = "todo_list";

try {
  $db = new PDO("mysql:host=localhost;dbname=$database", $user, $password);
  echo "<h2>TODO</h2><ol>";
  foreach($db->query("SELECT content FROM $table") as $row) {
    echo "<li>" . $row['content'] . "</li>";
  }
  echo "</ol>";
} catch (PDOException $e) {
    print "Error!: " . $e->getMessage() . "<br/>";
    die();
}
?>
```

Guarda y cierra el archivo. Accede a esta página en tu navegador:

```
http://your_server_ip/todo_list.php || http://localhost/todo_list.php
```
