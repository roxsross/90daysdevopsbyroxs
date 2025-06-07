---
sidebar_position: 8
title: Linux-CheatSheet
---

# Linux-CheatSheet

## Estructura de directorios:

|    Path    | Contenido                                           |
|:----------:|:--------------------------------------------------- |
|   **/**    | Raíz del sistema.                                   |
|  **/bin**  | Binarios del usuario.                               |
| **/boot**  | Archivos para el arranque del sistema.              |
|  **/dev**  | Dispositivos de almacenamiento conectados.          |
|  **/etc**  | Archivos de configuración de los paquetes.          |
| **/home**  | Directorio personal del usuario.                    |
|  **/lib**  | Librerías esenciales y módulos del kernel.          |
| **/media** | Punto de montaje para almacenamiento externo.       |
|  **/mnt**  | Punto de montaje para almacenamiento interno.       |
| **/proc**  | Archivos y procesos del sistema actuales.           |
| **/root**  | Similar a /home del usuario root.                   |
| **/sbin**  | Binarios del usuario root.                          |
|  **/srv**  | Directorio para servicios del sistema (Por ej: FTP) |
|  **/tmp**  | Almacenamiento de archivos temporales.              |
|  **/usr**  | Archivos de solo lectura de las aplicaciones.       |
|  **/var**  | Archivos de info del sistema (Por ej: Logs)         |

## Comandos básicos de Linux:

| Comando   | Ejemplo                                  | Descripción                                        |
| --------- | ---------------------------------------- | -------------------------------------------------- |
| **ls**    | **`ls /DIRECTORIO`**                     | Listar los archivos y directorios.                 |
|           | **`ls -la`**                             | Listar archivos ocultos.                           |
|           | `-l`                                     | Formato de lista.                                  |
|           | `-r`                                     | Orden inverso.                                     |
|           | `-R`                                     | Recursivo.                                         |
|           | `-S`                                     | Ordenar por tamaño.                                |
| **cd**    | **`cd /DIRECTORIO`**                     | Change directory. Cambiar de directorio.           |
|           | **`cd ..`**                              | Volver un directorio hacía atrás.                  |
|           | **`cd`**                                 | Directorio home del usuario.                       |
| **pwd**   | **`pwd`**                                | Ver directorio actual de trabajo.                  |
| **mkdir** | **`mkdir CARPETA_1`**                    | Crear un directorio.                               |
| **rm**    | **`rm ARCHIVO.txt`**                     | Eliminar archivos o directorios.                   |
|           | **`rm -rf /DIRECTORIO`**                 | Elimina la carpeta con todo el contenido.          |
| **cp**    | **`cp ARCHIVO.txt /DIRECTORIO_DESTINO`** | Permite copiar un archivo.                         |
| **mv**    | **`mv ARCHIVO.txt /home/video.mkv`**     | Mover o cambiar el nombre de un archivo.           |
| **touch** | **`touch DOCUMENTO.txt`**                | Crea un archivo vacío o actualiza fecha de acceso. |
| **cat**   | **`cat DOCUMENTO.txt`**                  | Muestra contenido de un archivo.                   |
| **grep**  | **`grep "patrón" ARCHIVO.txt`**          | Busca patrones de texto en archivos.               |
| **head**  | **`head ARCHIVO`**                       | Muestra las primeras 10 líneas de un archivo.      |
|           | **`head -n 5 ARCHIVO`**                  | Muestras las primeras 5 líneas.                    |
| **tail**  | **`tail ARCHIVO`**                       | Muestra las últimas 10 líneas de un archivo.       |
|           | **`tail -n 5 ARCHIVO`**                  | Muestra las últimas 5 líneas.                      |
| **wc**    | `wc ARCHIVO.txt`                         | Contar palabras, líneas, caracteres y más.         |
|           | `wc -l ARCHIVO.txt`                      | Contar líneas.                                     |
|           | `wc -w ARCHIVO.txt`                      | Contar palabras.                                   |
|           | `wc -c ARCHIVO.txt`                      | Contar caracteres.                                 |
| **sort**  | `sort ARCHIVO`                           | Ordena.                                            |
| **uniq**  | `uniq ARCHIVO`                           | Detectar líneas duplicadas.                        |
|           | `uniq -d ARCHIVO`                        | Muestra solo las líneas duplicadas.                |
| **diff**  | `diff ARCHIVO1 ARCHIVO2`                 | Compara dos archivos.                              |
|           | `diff -q ARCHIVO1 ARCHIVO2`                | Ver solamente si difieren.                         |
|           | `diff -u ARCHIVO1 ARCHIVO2`                | Ver las diferencias.                               |
| **awk**   | **`awk ‘{pint $1}’`**                    | Extraer la primera columna.                        |
| **sed**   | **`sed 's/gato/perro/g'`**               | Cambiar palabras.                                  |
| **tr**    | **`tr ‘.’ ‘-’`**                         | Sustituir el punto por un guión.                   |
| **>**     | **`ls -l /usr/bin 2> /dev/null`**        | Redirigir stderr al /dev/null                      |


## Gestión de Usuarios, Permisos y Propietarios:

| Comando     | Ejemplo                           | Descripción                                                |
| :---------- | :-------------------------------- | ---------------------------------------------------------- |
| **useradd** | `useradd -m -s /bin/bash USUARIO` | Añadir un usuario, crear el home y asignarle un terminal.  |
| **passwd**  | `passwd USUARIO`                  | Cambiar contraseña del usuario.                            |
| **usermod** | `usermod -aG GRUPO USUARIO`       | Añadir al usuario Y al grupo X.                            |
| **userdel** | `userdel -r USUARIO`              | Eliminar un usuario y su carpeta personal.                 |
| **gpasswd** | `gpasswd -d USUARIO GRUPO`        | Eliminar a un usuario de un grupo                          |
| **chmod**   | `chmod 755 ARCHIVO`               | Cambia los permisos de archivos o directorios.             |
|             | `chmod -x ARCHIVO`                | Asigna permiso de ejecución al archivo.                    |

| **chown**   | `chown USUARIO:GRUPO ARCHIVO`     | Cambia el propietario de archivos o directorios.           |


## Monitoreo y Gestión de Procesos:

| Comando | Ejemplo  | Descripción                                                  |
| ------- | -------- | ------------------------------------------------------------ |
| **ps**      | `ps aux` | Muestra información sobre los procesos en ejecución.         |
| **top**     | `top`    | Muestra información en tiempo real sobre el uso de recursos. |
| **jobs**    |          |                                                              |
| **bg**      |          |                                                              |
| **fg**      |          |                                                              |
| **kill**    |          |                                                              |
| **killall** |          |                                                              |


## Gestión de Espacio en Disco:

| Comando   | Ejemplo             | Descripción                                                        |
| --------- | ------------------- | ------------------------------------------------------------------ |
| **fdisk** | `fdisk -l`          | Listar los discos físicos.                                         |
| **df**    | `df -h`             | Muestra el espacio en disco utilizado y disponible en particiones. |
| **du**    | `du -sh DIRECTORIO` | Muestra el uso del espacio en disco de directorios y archivos.     |


## Compresión y Archivos:

| Comando    | Ejemplo                                  | Descripción                                                                 |
| ---------- | ---------------------------------------- | --------------------------------------------------------------------------- |
| **tar**    | `tar -czvf archivo.tar.gz DIRECTORIO`    | Crea o extrae archivos comprimidos en formato tar.                          |
| **find**   | `find /ruta -name "archivo.txt"`         | Busca archivos o directorios en el sistema de archivos.                     |
|            | `find /var/www -name '*.css'`            | Buscar todos los archivos que tienen extensión .css de la carpeta /var/www/ |
|            |                                          |                                                                             |
| **mount**  | `mount -t tipo ruta_unidad ruta_destino` | Montar sistema de archivos.                                                 |
|            | `mount -t ntfs /dev/sdb2 /media/win/`    |                                                                             |
|            | `sudo mount -t iso9660 /Ruta_ISO`        | Montar un ISO.                                                              |
|            | `sudo mount /Ruta_USB /Ruta_destino`     | Montar USB.                                                                 |
| **umount** | `umount ruta_unidad`                     | Desmontar sistema de archivos.                                              |
|            | `umount /dev/sdb2`                       |                                                                             |


## Red y Conexiones Remotas:

| Comando                                    | Ejemplo                                                         | Descripción                                                      |
| ------------------------------------------ | --------------------------------------------------------------- | ---------------------------------------------------------------- |
| **ssh**                                    | `ssh usuario@hostname`                                          | Inicia una sesión segura de shell remoto.                        |
|                                            | `ssh -p 20 usuario@IP`                                          | Conectar por otro puerto.                                        |
|                                            | `ssh -L puerto_local:Host_remoto:puerto_remoto usuario@IP`      | Crear un túnel SSH local.                                        |
| **ssh-keygen**                             | `ssh-keygen -t rsa -b bits`                                     | Crear claves.                                                    |
| **ssh-copy-id**                            |                                                                 | Copiar claves en el servidor SSH para modo desatendido.          |
| **scp**                                    | `scp user@remotehost.com:/remote/path/to/foobar.md /local/dest` | Copy local file to remote dir                                    |
|                                            | `scp foobar.md user@remotehost.com:/remote/dest`                | Key files can be used (just like ssh)                            |
|                                            | `scp -i my_key.pem foobar.md user@remotehost.com:/remote/dest`  | Transferir archivos con SSH.                                     |
| **openssh-server**                         | `sudo apt-get install openssh-server`                           | Instalar servidor SSH.                                           |
| **Editar el archivo /etc/ssh/sshd_config** |                                                                 |                                                                  |
| **wget**                                   | `wget URL`                                                      | Descarga archivos desde la web a través de la línea de comandos. |
| **netstat**                                | `netstat -ntlp # open TCP sockets`                              | Ver las diferentes conexiones de red.                            |
|                                            | `netstat -nulp # open UDP sockets`                              | Ver conexiones UDP.                                              |
|                                            | `netstat -nxlp # open Unix sockets`                             |                                                                  |
## Comandos de Sistema:

| Comando     | Ejemplo                                   | Descripción                                                                                  |
| ----------- | ----------------------------------------- | -------------------------------------------------------------------------------------------- |
| **uname**       | `uname -a`                                | Muestra información sobre el sistema operativo.                                              |
| **date**        | `date`                                    | Muestra la fecha y hora actual.                                                              |
| **uptime**      | `uptime`                                  | Muestra el tiempo de actividad del sistema.                                                  |
| **who**         | `who`                                     | Muestra quién está conectado al sistema.                                                     |
| **dmesg**       | `dmesg`                                   | Muestra registros del kernel.                                                                |
| **hostname**    | `hostname`                                | Nombre del equipo.                                                                           |
|             | `hostname -I`                             | IP del equipo.                                                                               |
| **lsb_release** | `lsb_release -a`                          | Detectar versión y distribución de Linux.                                                    |
|             | `cat /etc/issue`                          | Igual que el anterior.                                                                       |
| **alias**       | `alias install='sudo apt-get -y install’` | Permite crear un alias para los comandos. Poder ejecutar un comando largo con uno mas corto. |
| **locate**      | `locate archivo`                          | Localizar un archivo en el sistema.                                                          |
| **lshw**        | `grep cpu`                                | Ver configuración de hardware del sistema.                                                   |


## Servicios del sistema:

| Comando       | Ejemplo                      | Descripción                                 |
| ------------- | ---------------------------- | ------------------------------------------- |
| **systemctl** | `systemctl start SERVICIO`   | Gestionar servicios del sistema.            |
|               | `systemctl enable SERVICIO`  | Activar el servicio al arrancar el sistema. |
|               | `systemctl disable SERVICIO` | Desactivar servicio al arrancar el sistema. |


## Gestores de paquetes: 

| Comando  | Ejemplo                          | Descripción                            |
| -------- | -------------------------------- | -------------------------------------- |
| **apt**  | `apt-get update`                 | Actualizar lista de repositorios.      |
|          | `apt-get upgrade`                | Actualizar dependencias.               |
|          | `apt-get dist-upgrade`           | Actualizar distribución.               |
|          | `apt-get --purge remove paquete` | Desinstalar paquete y sus archivos.    |
|          | `apt-get autoremove`             | Eliminar dependencias innecesarias.    |
|          | `apt show cron`                  | Mostrar info de un paquete.            |
|          | `apt list --installed`           | Mostrar paquetes instalados.           |
| **dpkg** | `sudo dpgk -i paquete.deb`       | Instalar paquete .DEB                  |
| **yum**  | `yum install PAQUETE [-y]`       | Instalar paquete.                      |
|          | `yum check-update`               | Verificar actualizaciones disponibles. |
|          | `yum update`                     | Actualizar todos los paquetes.         |
|          | `yum upgrade PAQUETE`            | Actualizar un paquete específico.      |
|          | `yum remove PAQUETE`             | Desinstalar un paquete.                |
|          | `yum autoremove`                 | Eliminar paquetes huérfanos.           |

## Redes y Conectividad:

| **Comando**    | **Ejemplo**              | **Descripción**                                       |
| -------------- | ------------------------ | ----------------------------------------------------- |
| **ifconfig**   | `ifconfig`               | Muestra información de las interfaces de red.         |
| **ping**       | `ping ejemplo.com`       | Prueba la conectividad con un host remoto.            |
| **netstat**    | `netstat -tuln`          | Muestra información sobre puertos de red abiertos.    |
| **traceroute** | `traceroute ejemplo.com` | Rastrea la ruta de paquetes hacia un host remoto.     |
| **ssh-keygen** | `ssh-keygen -t rsa`      | Genera pares de claves SSH para autenticación segura. |
| **ip**         | `ip a`                   | Ver parámetros de red.                                |
|                |                          |                                                       |

## GPG:

| **Ejemplo**                                          | **Descripción**                    |
| ------------------------------------------------ | ------------------------------ |
| `gpg --gen-key`                                    | Generar claves.                |
| `gpg --keyserver pgp.mit.edu --send-keys NNNNNNNN` | Exportar claves al servidor.   |
| `gpg --keyserver pgp.mit.edu --recv-keys NNNNNN`   | Descargar claves del servidor. |
| `gpg --list-keys`                                  | Listar anillo de claves.       |

## Bash:

| Comando Bash             | Ejemplo                                                                                            | Descripción                                            |
| ------------------------ | -------------------------------------------------------------------------------------------------- | ------------------------------------------------------ |
| **echo**                 | `echo "Hola, mundo"`                                                                               | Imprime texto en la pantalla.                          |
| **$(ls)**                | `$(ls)`                                                                                            | Ejecutar comandos a nivel de sistema.                  |
| **variables**            | `nombre="Juan"; edad=30`                                                                           | Declaración y asignación de variables.                 |
| **if…else**              | `bash if [ condición ]; then comando; else otro_comando; fi`                                       | Estructura condicional.                                |
| **for loop**             | `bash for i in {1..5}; do echo $i; done`                                                           | Bucle que itera a través de elementos.                 |
| **while loop**           | `bash while [ condición ]; do comando; done`                                                       | Bucle que se ejecuta mientras se cumple una condición. |
| **funciones**            | `bash function saludo() { echo "Hola, $1"; }; saludo "Juan"`                                       | Declaración y uso de funciones.                        |
| **read**                 | `bash read -p "Ingresa un valor: " valor; echo "Ingresaste: $valor"`                               | Lee la entrada del usuario.                            |
| **case**                 | `bash case $opcion in 1) echo "Opción 1";; 2) echo "Opción 2";; *) echo "Opción no válida";; esac` | Estructura de selección múltiple.                      |
| **arreglos (arrays)**    | `bash colores=("rojo" "verde" "azul"); echo ${colores[0]}`                                         | Declaración y uso de arreglos.                         |
| **grep**                 | `grep "patrón" archivo`                                                                            | Busca patrones de texto en archivos.                   |
| **sed**                  | `sed 's/antiguo/nuevo/g' archivo`                                                                  | Edita y transforma texto en archivos.                  |
| **awk**                  | `awk '{print $1}' archivo`                                                                         | Procesa y formatea texto en archivos.                  |
| **pipes**                |                                                                                                    | comando1 \| comando2                                   |
| **redirección**          | `comando > archivo.txt`                                                                            | Redirige la salida estándar a un archivo.              |
| **condicional ternario** | `bash edad=20; resultado=$((edad >= 18 ? "Mayor de edad" : "Menor de edad"))`                      | Operador ternario para condicionales.                  |

## SSH
El archivo de configuración se encuentra en `/etc/ssh/sshd_config`.

Recargar el servicio después de configurar con `systemctl reload sshd` para aplicar los cambios.

| Parámetro         | Opción             | Descripción                                                 |
| ----------------- | ------------------ | ----------------------------------------------------------- |
| `PermitRootLogin` | `no`               | No permite conexiones root.                                 |
|                   | `yes`              | Permite conexiones root.                                    |
|                   | `without-password` |                                                             |
| `AllowUsers`      | `user1 user2`      | Permite al usuario1 y usuario2.                             |
| `DenyUsers`       | `user1 user2`      | Deniega solo a los usuario1 y usuario2.                     |
| `AllowGroups`     | `group1 group2`    | Permite a los usuarios de los grupos 1 y 2.                 |
| `DenyGroups`      | `group1 group2`    | Deniega todos los usuarios salvo a los de los grupos 1 y 2. |

## Crontab

Usamos `crontab -e` para configurar las tareas de Cron. The locations are as follows:
- `/var/spool/cron/username` user specific
- `/etc/crontab` system wide crontab

Formato de las tareas:
```
.---------------- minutos (0 - 59 | */5 [cada 5 minutos])
|  .------------- horas (0 - 23)
|  |  .---------- día del mes (1 - 31)
|  |  |  .------- mes (1 - 12) OR jan,feb,mar,apr ...
|  |  |  |  .---- día de la semana (0 - 6) (Sunday=0 or 7) OR sun,mon,tue,wed,thu,etc
|  |  |  |  |
*  *  *  *  * user-name  comando a ejecutar
```

| Comando                          | Descripción                      |
| -------------------------------- | -------------------------------- |
| `systemctl status crond.service` | Comprobar el estado del servicio |
| `crontab -l`                     |                                  |
| `crontab -e`                     |                                  |
| `crontab -e -u username`         |                                  |
| `crontab -r`                     |                                  |

**Carpetas de scripts**

Los scripts que se encuentren en uno de los siguientes directorios se ejecutarán en el intervalo especificado por el nombre del directorio:
- `/etc/cron.hourly`
- `/etc/cron.daily`
- `/etc/cron.weekly`
- `/etc/cron.monthly`

**Permitir / Denegar uso**

Añadir nombres de usuario, uno por línea a los siguientes archivos:
- `/etc/cron.allow` Whitelist
- `/etc/cron.deny` Blacklist

**Logs**

La ejecución de cronjobs se registra en `/var/log/cron`.
Los resultados se envían al correo de los usuarios `/var/spool/mail/username`.

## Samba
**Server**

Archivo de configuración situado en `/etc/samba/smb.conf`.

Las cuentas locales deben registrarse en Samba mediante `smbpasswd`.

```bash
yum install samba samba-client samba-common # Samba installation
systemctl start smb                         # Start service
systemctl enable smb                        # Start service on system start
vi /etc/samba/smb.conf                      # Change config
testparm                                    # Check if config is ok
systemctl restart smb                       # Reload config
smbpasswd -a username                       # Register user with samba
```

Ejemplo de `/etc/samba/smb.conf`:
```ini
[global]
  workgroup = WORKGROUP             # workgroup of smb server
  netbios name = centos             # name of smb server
  security = user                   # security mode (user / ads / domain)
  unix password sync = yes          # sync unix password with smb password
  invalid user = root bin daemon    # deny access globally (config in share section overrides this)

[Transfer]                        # name of share
  path = /transfer                  # path of directory to be shared
  comment = File transfer           # description
  read only = no                    # access permissions
  guest ok = no                     # allow guest access (no password)
  browsable = yes                   # visible or hidden?
  valid users = username @groupname # allow user/group to access the share
```

La sección especial `[homes]` comparte automáticamente el directorio personal del usuario bajo las siguientes condiciones:
- Un usuario intenta acceder a un recurso compartido con el nombre de su cuenta de usuario
- No existe una sección explícita para este recurso compartido en `smb.conf`.
- La cuenta de usuario existe en `/etc/passwd`.

La opción `browsable` tiene un significado diferente en esta sección y especifica si la parte personal debe ser listada. La opción habitual `browsable` se hereda de la sección `[global]`.
Se pueden utilizar variables para cambiar la ruta, por ejemplo:
- `%U` nombre de usuario actual
- `%H` directorio personal del usuario actual

Ejemplo:
```ini
[homes]
  browsable = no
  writable = yes
  path = %H/smb
```


**Client**

```bash
yum install samba-client cifs-utils                       # Install client and tools
smbclient -L //server                                     # Show SMB shares
mkdir /targetdir                                          # Create mountpoint
mount.cifs -o username=jenkins //server/james /mountpoint # Mount manually
umount.cifs /mountpoint                                   # Unmount manually
vi /etc/fstab                                             # Mount on system start
vi /root/cifs/.username                                   # Create credential file
mount -a                                                  # Test fstab
init 0                                                    # Auto mount
```

## FTP
El archivo de configuración se encuentra en `/etc/vsftpd/vsftpd.conf`

Ejemplo:
```ini
anonymous_enable=NO
local_enable=YES
write_enable=YES
local_umask=022
dirmessage_enable=YES
xferlog_enable=YES
connect_from_port_20=YES
xferlog_std_format=YES
listen=NO
listen_ipv6=YES
pam_service_name=vsftpd
tcp_wrappers=YES
use_localtime=YES
dirlist_enable=YES
pasv_enable=YES
pasv_min_port=41361
pasv_max_port=65534
pasv_address=192.168.1.10
```

```bash
apt install vsftpd          # Instalación
systemctl start vsftpd      # Iniciar servicio
systemctl enable vsftpd     # Iniciar servicio al arrancar
nano /etc/vsftp/vsftpd.conf # Cambiar configuración
systemctl restart vsftpd    # Reiniciar servicio
```

## MySQL Server
```bash
yum install mariadb-server  # Instalar servidor
systemctl start mariadb     # Iniciar servicio
systemctl enable mariadb    # Iniciar servicio al arrancar
mysql_secure_installation   # Run security wizard
mysql -u root -p            # Conectar con MySQL
```