---
sidebar_position: 5
title: Ejemplo 05
---

## Instalando Jenkins para la magia de CI/CD


Jenkins es una herramienta de automatización de código abierto ampliamente utilizada para gestionar tareas repetitivas en el desarrollo de software, como la compilación y la implementación. Basado en Java, Jenkins se puede instalar mediante paquetes de Ubuntu o ejecutando su archivo WAR (Web Application Archive). 

Documentación [oficial](https://www.jenkins.io/doc/book/installing/linux/)

## Requisitos Previos

Antes de comenzar, asegúrate de tener lo siguiente:

- Instalación de Java. 
> Recomiendo version 17

```bash
sudo apt install default-jre
```

## Paso 1: Instalar Jenkins

La versión de Jenkins disponible en los repositorios predeterminados de Ubuntu puede no estar actualizada. Para obtener la versión más reciente, utiliza el repositorio oficial de Jenkins.

1. **Agregar la clave del repositorio**

   ```bash
   wget -q -O - https://pkg.jenkins.io/debian-stable/jenkins.io.key | sudo apt-key add -
   ```

2. **Agregar el repositorio de Jenkins**

   ```bash
   sudo sh -c 'echo deb http://pkg.jenkins.io/debian-stable binary/ > /etc/apt/sources.list.d/jenkins.list'
   ```

3. **Actualizar los repositorios y instalar Jenkins**

   ```bash
   sudo apt update
   sudo apt install jenkins
   ```

4. **Iniciar Jenkins**

   ```bash
   sudo systemctl start jenkins
   ```

## Paso 2: Iniciar Jenkins

Verifica que Jenkins esté funcionando correctamente con:

```bash
sudo systemctl status jenkins
```

Deberías ver una salida que indique que el servicio está activo y configurado para iniciarse en el arranque.


## Paso 3: Configurar Jenkins

1. **Acceder a la interfaz web de Jenkins**

   Visita `http://your_server_or_domain:8080` en tu navegador. Deberías ver la pantalla "Unlock Jenkins".

2. **Obtener la contraseña inicial**

   Muestra la contraseña con el siguiente comando:

   ```bash
   sudo cat /var/lib/jenkins/secrets/initialAdminPassword
   ```

   Copia esta contraseña y pégala en el campo "Administrator password" para desbloquear Jenkins.

3. **Instalar complementos**

   En la pantalla "Customize Jenkins", selecciona "Install suggested plugins" para instalar los complementos recomendados.

4. **Crear el primer usuario administrativo**

   Después de instalar los complementos, puedes crear un usuario administrativo o continuar como admin usando la contraseña inicial. 

5. **Configurar la instancia de Jenkins**

   Confirma la URL de tu instancia y guarda los cambios. Deberías ver una pantalla de confirmación con el mensaje "Jenkins is Ready!".

6. **Acceder al panel de Jenkins**

   Haz clic en "Start using Jenkins" para acceder al panel principal de Jenkins.



![](https://assets.digitalocean.com/articles/jenkins-install-ubuntu-1804/jenkins_ready_page_two.png)

