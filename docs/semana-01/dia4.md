---
title: Día 4 - Automatizando Tareas con Bash Scripting I
description: Automatizando
sidebar_position: 4
---

# ⚙️ Automatizando Tareas con Bash Scripting I

![](../../static/images/banner/1.png)

Hoy vas a descubrir cómo usar **Bash scripting** para automatizar tareas en Linux. Desde chequeos básicos hasta reiniciar servicios automáticamente, ¡vas a empezar a pensar como un verdadero DevOps!

---

## 💻 ¿Dónde practicar?

Podés seguir esta clase usando:

- Tu propia terminal si tenés **Linux o macOS**
- **WSL** o **Git Bash** en **Windows**
- Un entorno virtual con **Vagrant** (como viste en el Día 3)
- O incluso 100% online con:
  - [Killercoda](https://killercoda.com/)


---

## 🧠 Fundamentos de Bash: Scripts y Condicionales

Antes de empezar con los scripts más útiles, veamos cómo funciona un script básico en Bash.

### 📄 ¿Qué es un script Bash?

Es un archivo de texto con instrucciones que ejecutás en una terminal Linux, como si las escribieras vos misma.

Ejemplo mínimo:
```bash
#!/bin/bash
echo "Hola Roxs DevOps!"
````

📌 Guardalo como `hola.sh`, dale permisos y ejecutalo:

```bash
chmod +x hola.sh
./hola.sh
```

---

### 🔁 Estructura básica de un script

```bash
#!/bin/bash

# Comentario
echo "Hola Mundo"

# Variables
NOMBRE="Roxs"
echo "Hola $NOMBRE"

# Condicionales
if [ "$NOMBRE" == "Roxs" ]; then
    echo "¡Sos vos!"
else
    echo "¿Y vos quién sos?"
fi

# Bucle
for i in {1..3}; do
    echo "Iteración $i"
done
```

---

### ✅ Condicionales comunes en Bash

| Estructura         | Explicación                       |
| ------------------ | --------------------------------- |
| `if ...; then ...` | Ejecuta si se cumple la condición |
| `else`             | Ejecuta si **no** se cumple       |
| `elif`             | Evalúa una condición alternativa  |
| `[ "$a" == "$b" ]` | Compara cadenas                   |
| `[ $a -gt 5 ]`     | Mayor que (números)               |
| `[ -f archivo ]`   | ¿Existe el archivo?               |
| `[ -d carpeta ]`   | ¿Existe el directorio?            |

---

### 🔃 Bucles útiles

**Bucle `for`**

```bash
for i in {1..5}; do
  echo "Número: $i"
done
```

**Bucle `while`**

```bash
contador=1
while [ $contador -le 3 ]; do
  echo "Contador: $contador"
  ((contador++))
done
```

---

### 🧪 Buenas prácticas

* Usá `#!/bin/bash` siempre en la primera línea
* Usá `set -e` para salir si ocurre un error
* Comentá tu código con `#`
* Probá scripts en entornos controlados (como Vagrant o online)

---

## Calentenemos motores


## 🐣 Primeros Pasos con Bash

Estos scripts te ayudarán a practicar los fundamentos de Bash antes de automatizar tareas más complejas.

---

### ✅ Script 1: ¡Hola Roxs!

```bash
#!/bin/bash
echo "Hola Roxs DevOps!"
```

💡 Este es tu primer script. Guardalo como `hola.sh`, hacelo ejecutable con `chmod +x hola.sh` y corrélo con `./hola.sh`.

---

### 📦 Script 2: Variables y Saludos

```bash
#!/bin/bash
NOMBRE="Roxs"
echo "Hola $NOMBRE, bienvenida al mundo DevOps"
```

📌 Las variables en Bash no usan `let`, ni `var`. Solo asignás con `=` y sin espacios.

---

### ❓ Script 3: Preguntar al usuario

```bash
#!/bin/bash
echo "¿Cómo te llamás?"
read NOMBRE
echo "¡Hola $NOMBRE!"
```

📌 Usamos `read` para capturar input del usuario. Guardalo como `pregunta.sh`.

---

### 🔁 Script 4: Condicional simple

```bash
#!/bin/bash
read -p "¿Tenés sed? (sí/no): " RESPUESTA

if [ "$RESPUESTA" == "sí" ]; then
  echo "Andá por un cafecito ☕"
else
  echo "Seguimos con DevOps 🚀"
fi
```

💡 Usamos `if`, `then`, `else` y `fi` para crear condiciones.

---

### 🔂 Script 5: Bucle `for` para repetir tareas

```bash
#!/bin/bash
for i in {1..5}; do
  echo "DevOps es 🔥 - iteración $i"
done
```

---

### 🕵️ Script 6: Detectar si un archivo existe

```bash
#!/bin/bash
ARCHIVO="config.txt"

if [ -f "$ARCHIVO" ]; then
  echo "El archivo $ARCHIVO existe"
else
  echo "No encontré el archivo $ARCHIVO"
fi
```

💡 Muy útil para evitar errores al trabajar con archivos o scripts dependientes.

---

## 🧪 Sugerencia extra para practicar

Creá un script llamado `mi_status.sh` que muestre:

* El nombre del usuario actual
* El directorio en el que estás
* La fecha y hora actual

```bash
#!/bin/bash
echo "Usuario: $(whoami)"
echo "Directorio actual: $(pwd)"
echo "Fecha: $(date)"
```

---

> Si trabajas en DevOps o como administrador de sistemas, automatizar tareas rutinarias es esencial.
---


## 📁 Script 1: Monitoreo de Uso de Disco y Alertas 🚨

Problema: ¿Alguna vez se te llenó la partición raíz (/) sin aviso? Este script verifica:
Si la partición `/` está al 90% o si `/home` supera los 2GB.

```bash
#!/bin/bash
ADMIN="admin@ejemplo.com"
USO_RAIZ=$(df / | grep / | awk '{print $5}' | sed 's/%//g')
TAMANO_HOME=$(du -sh /home | awk '{print $1}' | sed 's/G//g')

if [ "$USO_RAIZ" -ge 90 ]; then
    echo "¡Alerta: Partición / al ${USO_RAIZ}%!" | mail -s "Alerta Partición /" $ADMIN
fi

if (( $(echo "$TAMANO_HOME > 2" | bc -l) )); then
    echo "¡Alerta: /home ocupa ${TAMANO_HOME}GB!" | mail -s "Alerta Directorio /home" $ADMIN
fi
```

📌 Programalo con cron para que corra cada hora:

```bash
0 * * * * /ruta/monitor_disco.sh
```

---

## 🔄 Script 2: Verificación y Reinicio de Servicios

Problema: ¿Tu servidor web (apache/nginx) se cae y no te das cuenta? Este script lo verifica y reinicia automáticamente.

Verifica si un servicio está caído y lo reinicia automáticamente.

```bash
#!/bin/bash
SERVICIO="apache2"

if ! systemctl is-active --quiet $SERVICIO; then
    systemctl start $SERVICIO
    echo "El servicio $SERVICIO fue reiniciado." | mail -s "Reinicio de $SERVICIO" admin@ejemplo.com
fi
```

📌 Cron sugerido:

```bash
* * * * * /ruta/monitor_servicio.sh
```

---

## 📊 Script 3: Monitoreo de Salud del Sistema

Reporte en tiempo real de uso de memoria, disco y CPU:

```bash
#!/bin/bash
TIEMPO=$(date "+%Y-%m-%d %H:%M:%S")
echo -e "Hora\t\t\tMemoria\t\tDisco (root)\tCPU"
segundos="3600"
fin=$((SECONDS+segundos))

while [ $SECONDS -lt $fin ]; do
    MEMORIA=$(free -m | awk 'NR==2{printf "%.f%%\t\t", $3*100/$2 }')
    DISCO=$(df -h | awk '$NF=="/"{printf "%s\t\t", $5}')
    CPU=$(top -bn1 | grep "Cpu(s)" | sed "s/.*, *\([0-9.]*\)%* id.*/\1/" | awk '{printf("%.f\n", 100 - $1)}')
    echo -e "$TIEMPO\t$MEMORIA$DISCO$CPU"
    sleep 3
done
```

📌 Podés guardar la salida en un archivo:

```bash
./monitor.sh >> /var/log/salud_sistema.log
```

---


## 📚 Tareas Opcionales del Día 4

> *Hoy diste tus primeros pasos con Bash. Ahora es momento de practicar de verdad.*
> Elegí los desafíos que más te interesen... ¡o hacelos todos! 😉

---

### 🧪 Nivel 1: Calentando motores

1. ✅ **Crear un script llamado `presentacion.sh`** que pida tu nombre y edad, y devuelva:

   ```bash
   Hola Roxs, tenés 30 años. ¡Bienvenida al mundo Bash!
   ```

2. ✅ **Creá un script `multiplicar.sh`** que reciba dos números por argumento y muestre el resultado de la multiplicación.

3. ✅ **Armá un bucle `for`** que muestre la tabla del 5.

---

### 🧩 Nivel 2: Automatización útil

4. 🛠 **Creá un script `backup_logs.sh`** que:

   * Comprima el contenido de `/var/log`
   * Lo guarde con timestamp en `/home/tu_usuario/backups/`
   * Elimine backups de más de 7 días

5. 🔍 **Creá `buscar_palabra.sh`** que:

   * Reciba un nombre de archivo y una palabra como argumentos
   * Busque si la palabra aparece en el archivo (con `grep`)
   * Devuelva "¡Encontrado!" o "No encontrado."

---

### 🔥 Nivel 3: Reto DevOps Pro

6. 🚀 **Modificá `monitor_disco.sh`** para que guarde un historial en un archivo log, incluyendo la fecha.

7. 🔁 **Creá un `servicio_status.sh`** que:

   * Revise varios servicios (`nginx`, `mysql`, `docker`)
   * Informe cuáles están activos y cuáles no
   * Envíe un mail si alguno está caído (tip: usá un array y bucle)

8. 📈 **Extendé el script de salud del sistema** para que:

   * Corte el monitoreo si la CPU supera el 85% tres veces seguidas
   * O guarde un log separado llamado `alertas_cpu.log`

---

### 💬 Bonus creativo

9. 🎤 **Hacé un script que sea un cuestionario loco**:

   * Preguntá el nombre, edad y color favorito
   * Mostrá un mensaje personalizado según lo que responda
   * Usá `if`, `read`, y emojis en `echo` 💥

10. 📸 **Subí tu favorito a redes**

    * Captura de pantalla, gif o video corto
    * Hashtag: **#BashConRoxs** o **#DevOpsConRoxs**

### Material Extra

Accede al Repositorio [Awesome Bash](https://github.com/awesome-lists/awesome-bash)

Libro Recomendado [introduction-to-bash-scripting](https://github.com/bobbyiliev/introduction-to-bash-scripting)


Accede al Repositorio github

Usá el hashtag **#DevOpsConRoxs** o compartilo en el canal de la comunidad. 🎯