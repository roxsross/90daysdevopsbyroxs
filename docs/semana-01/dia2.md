---
title: Día 2 - Introducción a Linux y la Terminal
description: Comandos, estructura, usuarios y permisos
sidebar_position: 2
---

# 🐧 Comandos, estructura, usuarios y permisos

![](../../static/images/banner/1.png)

> 📣 Hoy arrancamos con uno de los superpoderes más importantes de DevOps: **la terminal**.

Ya sea que estés en **Linux**, **macOS** o **Windows**, vas a poder seguir sin problema. Si no tenés Linux instalado, acá van algunas opciones para que puedas practicar sin instalar nada:

### 💻 Opciones para usar una terminal:
- **Linux/macOS**: ya tenés terminal incorporada, solo abrila y empezá.
- **Windows**: podés usar:
  - [WSL](https://learn.microsoft.com/es-es/windows/wsl/install) (Subsistema de Linux para Windows)
  - [Git Bash](https://gitforwindows.org/)
  - PowerShell o CMD para lo más básico
- **100% online**:
  - [Killercoda (escenarios interactivos)](https://killercoda.com/)
  - [JS Linux (simulador)](https://bellard.org/jslinux/)

> ⚠️ **Recomendación Roxs**: si vas en serio con DevOps, instalá una terminal real en tu máquina. ¡Te vas a sentir más poderoso y libre! 💪🐧

---

## 📦 Parte 1: Comandos Básicos de Linux que TODO DevOps debe dominar  

---

## 🔥 **Comandos TOP para DevOps**  

### 1. `alias` – Atajos para comandos  
Crea **alias** para ahorrar tiempo:  
```bash
alias ll='ls -lah --color=auto'  # Lista archivos con detalles  
alias ..='cd ..'                 # Sube un directorio  
alias gs='git status'            # Ver estado de Git  
```  
📌 **Tip**: Guárdalos en `~/.bashrc` o `~/.zshrc` para que sean permanentes.  

### 2. `whoami` – ¿Quién soy?  
```bash
whoami  # Muestra el usuario actual  
```  
Útil en scripts para verificar permisos:  
```bash
if [ "$(whoami)" != "root" ]; then  
    echo "¡Error! Necesitas ser root."  
    exit 1  
fi  
```  

### 3. `ssh` – Conexión remota segura  
```bash
ssh usuario@servidor          # Conexión básica  
ssh -p 2222 usuario@servidor  # Puerto personalizado  
ssh -i ~/.ssh/mi_llave usuario@servidor  # Usar clave privada  
```  

### 4. `scp` – Copiar archivos de forma segura  
```bash
scp archivo.txt usuario@servidor:/ruta/  # Copiar un archivo  
scp -r carpeta/ usuario@servidor:/ruta/  # Copiar una carpeta (recursivo)  
```  

### 5. `nc` (Netcat) – El "navaja suiza" de redes  
```bash
nc -zv servidor.com 80-100    # Escanear puertos  
nc -l 1234 > archivo_recibido  # Recibir un archivo  
```  

### 6. `ss` – Estadísticas de sockets (reemplaza a `netstat`)  
```bash
ss -tuln    # Ver puertos abiertos (TCP/UDP)  
ss -tunlp | grep nginx  # Ver si Nginx está escuchando  
```  

### 7. `systemctl` – Gestión de servicios (systemd)  
```bash
systemctl restart nginx    # Reiniciar Nginx  
systemctl status nginx    # Ver estado  
systemctl enable nginx    # Activar en el arranque  
```  

### 8. `service` – Alternativa antigua (para sistemas init.d)  
```bash
service apache2 restart   # Reiniciar Apache (en sistemas viejos)  
```  

### 9. `uptime` – Tiempo de actividad del sistema  
```bash
uptime  # Muestra: "16:12 up 20 days, load: 0.20, 0.18, 0.08"  
```  

### 10. `top` / `htop` – Monitor en tiempo real  
```bash
top     # Monitoreo básico (CPU, RAM, procesos)  
htop    # Versión mejorada (colorida y más intuitiva)  
```  
📌 **Tip**: En `top`, presiona:  
- `1` → Ver todos los núcleos CPU.  
- `m` → Ordenar por uso de memoria.  

---

## 🛠️ **Comandos Avanzados (pero útiles)**  

### 11. `ps` – Listar procesos  
```bash
ps aux | grep nginx  # Buscar procesos de Nginx  
```  

### 12. `journalctl` – Ver logs de systemd  
```bash
journalctl -u nginx  # Logs de Nginx  
journalctl -xe       # Últimos logs críticos  
```  

### 13. `ping` – Probar conectividad  
```bash
ping -c 5 google.com  # Hacer 5 pings a Google  
```  

### 14. `telnet` – Probar puertos (¡pero usa `nc` mejor!)  
```bash
telnet servidor.com 80  # Ver si el puerto 80 responde  
```  

### 15. `sed` – Editar texto en stream  
```bash
sed -i 's/old/new/g' archivo.conf  # Reemplazar "old" por "new"  
```  

### 16. `awk` – Procesamiento de texto avanzado  
```bash
awk '{print $1, $3}' access.log  # Extraer columnas 1 y 3  
```  

### 17. `grep` – Buscar patrones en archivos  
```bash
grep -r "ERROR" /var/log/  # Buscar "ERROR" en logs  
```  

---

## 📂 **Comandos por Categoría**  

### **Sistema de Archivos**  
```bash
df -hT       # Espacio en discos  
du -sh *     # Tamaño de archivos/carpetas  
tree -a      # Estructura de directorios  
```  

### **Procesos**  
```bash
lsof -i :80       # Ver qué usa el puerto 80  
kill -9 PID       # Matar proceso (¡cuidado!)  
```  

### **Paquetes (Ubuntu/Debian)**  
```bash
apt update && apt upgrade  # Actualizar todo  
apt install docker.io      # Instalar Docker  
```  

### **Trucos de Terminal**  
```bash
comando1 && comando2   # Ejecuta comando2 SOLO si comando1 funciona  
comando1 || comando2   # Ejecuta comando2 SOLO si comando1 falla  
```  
---

## 🐧 Parte 2: El Sistema de Archivos de Linux 

---

### 🌳 **¿Qué es el Filesystem Hierarchy Standard (FHS)?**  
Es el "mapa" que sigue Linux para organizar archivos. ¡Todos los distros lo usan!  


![](../../static/images/semana1/1.png)

> 📌 **Key Point**: *En Linux, todo parte del directorio raíz `/` (no hay "C:\" como en Windows).*  

---

### 🗂️ **Estructura Básica: Directorios Clave**  

| Directorio  | ¿Qué contiene? | Ejemplo Importante |  
|-------------|----------------|---------------------|  
| **`/`**       | Raíz del sistema | ¡El punto de partida de todo! |  
| **`/bin`**    | Comandos básicos | `ls`, `cp`, `bash` |  
| **`/sbin`**   | Comandos de admin (root) | `iptables`, `fdisk` |  
| **`/etc`**    | Archivos de configuración | `/etc/passwd`, `/etc/nginx/` |  
| **`/dev`**    | Dispositivos (discos, USB) | `/dev/sda1` (tu disco duro) |  
| **`/home`**   | Directorios de usuarios | `/home/tu_usuario` |  
| **`/var`**    | Datos variables (logs, cachés) | `/var/log/nginx/` |  
| **`/tmp`**    | Archivos temporales | *(Se borra al reiniciar)* |  
| **`/boot`**   | Archivos de arranque | `vmlinuz` (el kernel) |  
| **`/opt`**    | Software de terceros | `/opt/google/chrome/` |  
| **`/proc`**   | Info de procesos (virtual) | `/proc/cpuinfo` |  
| **`/usr`**    | Aplicaciones y librerías | `/usr/bin/python3` |  

---

### 🔍 **Profundizando en Directorios Clave**  

### 1. **`/etc` – El "panel de control" de Linux**  
📌 *Aquí viven TODAS las configuraciones:*  
- `/etc/passwd`: Usuarios del sistema.  
- `/etc/fstab`: Discos montados al iniciar.  
- `/etc/ssh/sshd_config`: Configuración de SSH.  

### 2. **`/var` – Donde Linux guarda lo que cambia**  
- `/var/log`: **Logs** (¡tu mejor amigo para debuggear!).  
- `/var/lib`: Bases de datos (Ej: `/var/lib/mysql/`).  
- `/var/www`: Sitios web (en algunas distros).  

### 3. **`/proc` y `/sys` – El "cerebro" de Linux**  
- **Virtuales**: No ocupan espacio en disco.  
- `/proc/cpuinfo`: Info del CPU.  
- `/proc/meminfo`: Uso de RAM.  
- `/sys/class/net/`: Config de red.  

### 4. **`/home` vs `/root`**  
- `/home/tu_usuario`: **Tus archivos** (documentos, descargas).  
- `/root`: **El "home" del admin** (no confundir con `/`).  

---

## 💽 **Tipos de Filesystems en Linux**  

| Tipo      | ¿Para qué sirve? |  
|-----------|------------------|  
| **ext4**  | El estándar (equilibrado). |  
| **XFS**   | Alto rendimiento (servidores). |  
| **Btrfs** | Snapshots y RAID moderno. |  
| **Swap**  | "Memoria virtual" en disco. |  

📌 **Comando útil**: Ver discos y espacio  
```bash
df -hT  # Espacio libre en human-readable  
```

---

## 🛠️ **Herramientas para DevOps**  

### 1. **Ver uso de disco**  
```bash
du -sh /var/log  # ¿Cuánto ocupan los logs?  
du -sh * | sort -h  # Ordenar por tamaño  
```  

### 2. **Buscar archivos grandes**  
```bash
find / -type f -size +100M  # Archivos >100MB  
```  

### 3. **Monitorear logs en tiempo real**  
```bash
tail -f /var/log/syslog  # ¡Como Netflix para logs!  
```  


## 🚀 **Conclusión**  
- **`/etc`**: Configuraciones.  
- **`/var/log`**: Logs (¡aprende a leerlos!).  
- **`/proc` y `/sys`**: Diagnóstico del sistema.  
- **`df -h` y `du -sh`**: Tus aliados para espacio en disco.  

---
## 🐧 Parte 3: Gestión de Usuarios y Permisos en Linux

---

### ¿Por qué debería importarte los usuarios y permisos?  
Imagina tu sistema Linux como un gran castillo. Los usuarios son tus nobles invitados, cada uno con sus roles y responsabilidades. Los permisos son las llaves que dan acceso a diferentes áreas del castillo, protegiendo el tesoro (tus datos valiosos) de invasores (software malicioso o miradas indiscretas).  

Sin una gestión adecuada, tu castillo podría caer en el caos. 

![](https://i.imgur.com/yxNrpKJ.png)

---

### El reparto: Usuarios, Grupos y Roles  

### **Usuarios: Los habitantes de tu sistema**  
En Linux, cada persona (o script) que interactúa con el sistema es un usuario. Hay tres tipos principales:  

- **Root (superusuario)**: El mago todopoderoso con acceso ilimitado. Úsalo con precaución: un hechizo mal lanzado (comando) puede convertir tu castillo en una calabaza.  
- **Usuarios normales**: Caballeros, damas y bufones con roles específicos y acceso limitado.  
- **Usuarios del sistema**: Los sirvientes invisibles que gestionan servicios y demonios. Normalmente no necesitan permisos de inicio de sesión.  

### **Grupos: Formando tu comunidad**  
Los grupos son como gremios que agrupan usuarios según roles o proyectos. Por ejemplo, un grupo *admin* podría incluir a todos los usuarios que pueden realizar tareas administrativas.  

### **Roles: Las responsabilidades asignadas**  
Asignar roles es como repartir tareas en una corte medieval. Puedes tener roles como *desarrollador*, *tester* o *invitado*, cada uno con permisos específicos.  

---

### Niveles de permisos: ¿Quién puede hacer qué?  
Los permisos en Linux se dividen en tres tipos:  

- **Lectura (r)**: Puede ver el contenido.  
- **Escritura (w)**: Puede modificar o borrar el contenido.  
- **Ejecución (x)**: Puede ejecutar el archivo como programa.  

Estos permisos se asignan a tres categorías:  

1. **Dueño (Owner)**: El usuario propietario del archivo.  
2. **Grupo (Group)**: Miembros del grupo asignado al archivo.  
3. **Otros (Others)**: Todos los demás.  

---

### El poderoso comando `chmod`  
Para controlar los permisos, usamos `chmod` (*change mode*). ¡Es como tu varita mágica para configurar accesos!  

**Sintaxis:**  
```bash
chmod [opciones] modo archivo
```

**Ejemplo:**  
```bash
chmod 755 mi_script.sh
```

**Desglose de `755`:**  
- **7 (Dueño)**: Lectura + Escritura + Ejecución (`rwx`)  
- **5 (Grupo)**: Lectura + Ejecución (`r-x`)  
- **5 (Otros)**: Lectura + Ejecución (`r-x`)  

**Regla mnemotécnica:**  
- `7 = 4 (r) + 2 (w) + 1 (x) = rwx`  
- `5 = 4 (r) + 1 (x) = r-x`  


--- 

### Cambiando la propiedad con `chown`  
Si necesitas transferir la propiedad de un archivo o directorio, usa `chown` (*change owner*).  

**Sintaxis:**  
```bash
chown [opciones] nuevo_dueño:nuevo_grupo archivo
```

**Ejemplo:**  
```bash
chown alice:desarrolladores codigo_proyecto.py
```
Este comando asigna la propiedad de `codigo_proyecto.py` al usuario *alice* y al grupo *desarrolladores*.  

---

## Creando y gestionando usuarios: ¡Hagamos nuevos personajes!  

### **Añadir un nuevo usuario**  
```bash
sudo adduser juan_perez
```

### **Eliminar un usuario**  
```bash
sudo deluser juan_perez
```

**Pro-tip:** Si *juan_perez* dejó archivos regados por el castillo, bórralos también:  
```bash
sudo deluser --remove-home juan_perez
# O también:
userdel -r juan_perez
```

### **Modificar un usuario**  
Para añadir *juan_perez* al grupo `sudo` (dándole poderes administrativos):  
```bash
sudo usermod -aG sudo juan_perez
```

**Otros ejemplos útiles:**  
```bash
# Cambiar directorio home
usermod -d /nuevo/home -m usuario

# Cambiar shell de inicio
usermod -s /bin/zsh usuario

# Renombrar usuario
usermod -l nuevo_nombre antiguo_nombre

# Bloquear/desbloquear cuenta
usermod -L usuario  # Bloquea
usermod -U usuario  # Desbloquea
```

---

## Gestión de grupos: Reuniendo al equipo adecuado  

### **Crear un nuevo grupo**  
```bash
sudo groupadd desarrolladores
```

### **Añadir usuarios a un grupo**  
```bash
sudo usermod -aG desarrolladores juan_perez
```

### **Ver miembros de un grupo**  
```bash
getent group desarrolladores
```

---

## `sudo`: El poder de gobernar con responsabilidad  
El comando `sudo` permite ejecutar comandos con privilegios de superusuario. ¡Es como darle a alguien la llave de la bóveda real!  

**Ejemplo:**  
```bash
sudo apt update
```

**Configurar `sudoers` (editar con `visudo`):**  
```bash
sudo visudo
```

**Ejemplo de entrada:**  
```bash
alice ALL=(ALL:ALL) ALL
```
(Esto le da a *alice* todos los permisos de `sudo`).  

---

## Errores comunes con permisos: Evitando las artes oscuras  

### **El temido permiso `777`**  
Dar permiso `777` a un archivo es como dejar las puertas del castillo abiertas durante un ataque de dragones. ¡Evítalo!  

```bash
chmod 755 script_importante.sh  # Mejor opción
```

### **Confusión de propiedad**  
Revisa siempre los permisos con:  
```bash
ls -l archivo.txt
```

**Salida ejemplo:**  
```bash
-rw-r--r-- 1 alice desarrolladores 4096 oct 4 10:00 archivo.txt
```
(Aquí, *alice* es el dueño y *desarrolladores* el grupo).  

---

## Tips divertidos para dominar usuarios y permisos  

### **Usa alias para ser más eficiente**  
Añade esto a tu `.bashrc` o `.zshrc`:  
```bash
alias ll='ls -la'
alias gs='git status'
```

### **Aprovecha el poder de los grupos**  
Asigna permisos a grupos en lugar de a usuarios individuales. ¡Es más fácil de gestionar!  

### **Audita permisos regularmente**  
Busca archivos con permisos peligrosos:  
```bash
find / -type f -perm 0777
```

### **Principio de mínimo privilegio**  
Solo da los permisos necesarios. ¡Menos es más!  


---
**¡Sigue aprendiendo y no pierdas el humor!**  
¿Tienes preguntas, anécdotas divertidas de Linux o fails épicos en la terminal? ¡Déjalos en los comentarios!  

*Disclaimer: Ningún castillo real fue dañado en la creación de este material. Pero si intentas construir uno en Linux, ¡ve con cuidado!*  


---

## 🐧 Parte 4: 📦 Gestión de Paquetes en Linux  

---

En Linux, el software se distribuye principalmente a través de **paquetes**, que contienen el programa, sus dependencias y metadatos (versión, mantenedor, etc.). Cada distribución usa su propio sistema de paquetes y gestores.

---

## 🔍 Formatos de Paquetes  

| Formato  | Distribuciones          | Ejemplo de Gestor |  
|----------|-------------------------|-------------------|  
| `.deb`   | Debian, Ubuntu, Mint    | `apt`, `dpkg`     |  
| `.rpm`   | RHEL, Fedora, CentOS    | `dnf`, `yum`      |  
| `.pkg.tar.zst` | Arch Linux, Manjaro | `pacman`         |  
| `.txz`   | Slackware               | `slackpkg`        |  

> 💡 **Nota**: Los paquetes universales como `.tar.gz` requieren compilación manual.

---

## 🛠️ Gestores de Paquetes por Distribución  

### 1. **Debian/Ubuntu (APT)**  
```bash
# Actualizar lista de paquetes  
sudo apt update  

# Instalar un programa  
sudo apt install nginx  

# Buscar paquetes  
apt search python3  

# Eliminar un paquete  
sudo apt remove firefox  

# Limpiar paquetes no usados  
sudo apt autoremove  
```
--

## 🔄 Comandos Esenciales  

| Acción               | Debian/Ubuntu       | RHEL/Fedora        | Arch Linux         |  
|----------------------|---------------------|--------------------|--------------------|  
| **Actualizar repos** | `apt update`        | `dnf check-update` | `pacman -Sy`       |  
| **Instalar**         | `apt install`       | `dnf install`      | `pacman -S`        |  
| **Eliminar**         | `apt remove`        | `dnf remove`       | `pacman -R`        |  
| **Buscar**           | `apt search`        | `dnf search`       | `pacman -Ss`       |  
| **Ver detalles**     | `apt show`          | `dnf info`         | `pacman -Qi`       |  

---

## 🏗️ Instalación desde Código Fuente  

Si no hay paquete disponible:  
```bash
# 1. Descargar y extraer  
wget https://ejemplo.com/app.tar.gz  
tar -xzvf app.tar.gz  

# 2. Instalar dependencias  
sudo apt build-dep .  

# 3. Compilar e instalar  
./configure  
make  
sudo make install  
```

---

## 💡 Buenas Prácticas  

1. **Usa repositorios oficiales** para mayor seguridad.  
2. **Evita `sudo` innecesario** (solo para instalaciones globales).  
3. **Mantén tu sistema actualizado**:  
   ```bash
   sudo apt update && sudo apt upgrade -y  
   ```
4. **Revisa dependencias** antes de eliminar paquetes.  

---

## 🚀 Caso Práctico: Instalar y Configurar Nginx  

```bash
# Instalar  
sudo apt install nginx  

# Iniciar servicio  
sudo systemctl start nginx  

# Verificar  
curl localhost  
```

> ✅ **Resultado esperado**: Verás la página de bienvenida de Nginx.

---

## 🌍 Desplegando un "Hola Mundo" en Apache  

Aprenderemos a configurar un servidor web Apache en Ubuntu/Debian y publicar una página HTML básica.  

---

### 🛠️ Requisitos Previos  
- Máquina con Ubuntu/Debian (física o virtual)  
- Acceso a terminal con permisos de `sudo`  

---

### 🔄 Paso 1: Actualizar el Sistema  
```bash
sudo apt update && sudo apt upgrade -y
```
**¿Por qué?**  
Asegura que todos los paquetes estén actualizados antes de instalar nuevos servicios.

---

### 🚀 Paso 2: Instalar Apache  
```bash
sudo apt install apache2 -y
```
**Verificación:**  
```bash
sudo systemctl status apache2
```
✅ Debes ver `active (running)` en verde.  

---

### 📂 Paso 3: Crear la Página Web  
1. Navega al directorio raíz de Apache:  
```bash
cd /var/www/html
```  
2. Crea un archivo `index.html`:  
```bash
sudo nano index.html
```  
3. Inserta este código HTML:  
```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>¡DevOps en Acción!</title>
    <style>
        body { font-family: Arial, sans-serif; text-align: center; margin-top: 50px; }
        h1 { color: #2c3e50; }
        .logo { width: 150px; }
    </style>
</head>
<body>
    <img src="https://git-scm.com/images/logos/downloads/Git-Logo-1788C.png" alt="Git Logo" class="logo">
    <h1>¡Hola Mundo DevOps!</h1>
    <p>Servidor Apache funcionando correctamente</p>
    <p>🛠️ Próximos pasos: Configurar HTTPS y un reverse proxy</p>
</body>
</html>
```
---

### 🔒 Paso 4: Configurar Permisos  
```bash
sudo chown www-data:www-data /var/www/html/index.html
sudo chmod 644 /var/www/html/index.html
```
**Explicación:**  
- `www-data`: Usuario por defecto de Apache  
- `644`: Permisos de lectura para todos y escritura solo para el dueño  

---

### 🌐 Paso 5: Acceder al Sitio  
1. Localmente:  
   Abre tu navegador en `http://localhost`  

2. Remotamente:  
   Usa la IP pública de tu servidor:  
```bash
curl ifconfig.me  # Para obtener tu IP pública
```
   Luego visita `http://<TU_IP>`  

![](https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTR2KelFvX--Mz8eMm3dfgFQ1zUBLrGG9R_ZQ&s)

---

### 🚨 Solución de Problemas Comunes  
### ❌ Error 403 Forbidden  
```bash
sudo chmod 755 /var/www/html/
```  
### ❌ Apache no inicia  
Revisa logs con:  
```bash
sudo journalctl -u apache2 --no-pager -n 20
```

---

### 📌 Buenas Prácticas  
1. **Eliminar la página por defecto**:  
```bash
sudo rm /var/www/html/index.html  # Si existe una versión por defecto
```  
2. **Habilitar firewall**:  
```bash
sudo ufw allow 80/tcp
```  
3. **Próximos pasos**:  
   - Configurar dominio con DNS  
   - Añadir certificado SSL (Let's Encrypt)  

---

## 🎓 Reto Adicional  
Modifica la página para mostrar:  
- La hora del servidor (usa JavaScript)  
- El resultado del comando `uptime` (requiere CGI)  
```html
<script>
document.write("Hora del servidor: " + new Date().toLocaleString());
</script>
```

---

## 📚 Tarea Opcional del Día 2

> *Hoy activamos modo terminal: vas a explorar, crear, modificar y proteger archivos como toda persona DevOps debe saber hacer.* 🐧💻

---

### 🛠️ 1. Exploración básica

* Abrí la terminal y ejecutá estos comandos. Luego anotá qué hace cada uno:

  ```bash
  whoami
  pwd
  ls -lah
  df -hT
  uptime
  ```

* Navegá por los directorios clave del sistema:

  ```bash
  cd /
  ls
  cd /etc && ls
  cd /home && ls
  ```

---

### 📂 2. Crea y manipulá archivos

* Creá una carpeta llamada `dia2-devops`

  ```bash
  mkdir ~/dia2-devops && cd ~/dia2-devops
  ```

* Creá un archivo de prueba y escribile contenido:

  ```bash
  echo "Hola Roxs DevOps!" > saludos.txt
  ```

* Copialo, renombralo y eliminá uno:

  ```bash
  cp saludos.txt copia.txt
  mv copia.txt hola.txt
  rm saludos.txt
  ```

---

### 👥 3. Usuarios y permisos

* Creá un nuevo usuario en el sistema (si estás en Linux real o WSL):

  ```bash
  sudo adduser invitado
  ```

* Creá un grupo y asigná ese usuario:

  ```bash
  sudo groupadd roxsdevs
  sudo usermod -aG roxsdevs invitado
  ```

* Cambiá los permisos de un archivo para que:

  * El dueño pueda leer/escribir/ejecutar
  * El grupo solo leer
  * Otros, nada

  ```bash
  chmod 740 hola.txt
  ls -l hola.txt
  ```

---

### 🔐 4. Buscá archivos con permisos peligrosos

* Esto es oro puro en producción:

  ```bash
  find / -type f -perm 0777 2>/dev/null
  ```

---

### 🧠 5. Reto de comprensión

* ¿Qué hace este comando?:

  ```bash
  chmod u=rwx,g=rx,o= hola.txt
  ```

  Explicalo con tus palabras.

---


### 📸 6. Bonus: Compartí tu terminal

Subí una captura con el resultado de estos comandos o mostrá tu carpeta `dia2-devops` armada con:

```bash
tree ~/dia2-devops
```

Usá el hashtag **#DevOpsConRoxs** o compartilo en el canal de la comunidad. 🎯
