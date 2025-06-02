---

title: Día 5 - Automatizando Tareas con Bash Scripting II
description: Automatización avanzada en Bash
sidebar_position: 5
---

## ⚙️ Automatizando Tareas con Bash Scripting II

![](../../static/images/banner/1.png)

En este día vamos a a tener mas habilidades con Bash. Vamos a trabajar con funciones, arrays, validación, depuración y cron. Vas a modularizar tus scripts, mejorar la legibilidad y crear automatizaciones más profesionales.

---

## 🧩 Parte 2: Técnicas Avanzadas con Bash

### 🔁 Funciones: Modularizando tus Scripts

Las funciones te permiten organizar y reutilizar lógica:

```bash
#!/bin/bash
saludar_usuario() {
    echo "¡Hola, $1!"
}
saludar_usuario "Ana"
saludar_usuario "Carlos"
```

📌 Las funciones pueden ir al principio del script y luego las llamás donde las necesites.

---

### 📚 Manejo de Arrays

Los arrays sirven para manejar listas de elementos:

```bash
#!/bin/bash
archivos=("documento1.txt" "documento2.txt" "informe.pdf")
for archivo in "${archivos[@]}"; do
    echo "Procesando $archivo"
done
```

---

### ❗ Manejo de Errores

Evitá que tu script falle silenciosamente:

```bash
#!/bin/bash
archivo="datos.csv"
if [[ -f $archivo ]]; then
    echo "Leyendo $archivo"
    cat "$archivo"
else
    echo "Error: ¡$archivo no existe!"
    exit 1
fi
```

---

### 🕒 Programación con Cron

Automatizá tus scripts en horarios definidos:

```bash
crontab -e
# Ejecutar cada día a las 2 AM
0 2 * * * /ruta/tu_script.sh
```

Usá `crontab -l` para listar tus cron jobs activos.

---

### 🐞 Depuración de Scripts

Activá el modo debug para ver qué hace tu script paso a paso:

```bash
#!/bin/bash
set -x  # Muestra cada comando antes de ejecutarlo
# Tu lógica aquí
```

Sumale `set -e` para que el script se detenga ante errores:

```bash
set -e
```

---

## 🧠 Técnicas Bash Avanzadas

### 1. 🧪 Validación de Entradas

```bash
#!/bin/bash
if [[ $# -ne 1 ]]; then
    echo "Uso: $0 <archivo>"
    exit 1
fi
```

### 2. ⚙️ Manejo de Procesos en Segundo Plano

```bash
#!/bin/bash
proceso_largo() {
    sleep 5
    echo "Proceso completado"
}
proceso_largo &
pid=$!
wait $pid
```

### 3. 🔍 Expresiones Regulares con Bash

```bash
#!/bin/bash
texto="Usuario: María, Email: maria@ejemplo.com"
if [[ $texto =~ Usuario:\ ([^,]+),\ Email:\ ([^ ]+) ]]; then
    usuario=${BASH_REMATCH[1]}
    email=${BASH_REMATCH[2]}
    echo "Usuario: $usuario, Email: $email"
fi
```

### 4. 🧵 Arrays Asociativos (Bash 4+)

```bash
#!/bin/bash
declare -A colores
colores[rojo]="#FF0000"
colores[verde]="#00FF00"
for color in "${!colores[@]}"; do
    echo "$color: ${colores[$color]}"
done
```

### 5. 🔗 Integración con Herramientas Externas (ej. `jq`)

```bash
#!/bin/bash
json='{"nombre": "Pedro", "edad": 28}'
nombre=$(echo "$json" | jq -r '.nombre')
edad=$(echo "$json" | jq -r '.edad')
echo "Nombre: $nombre, Edad: $edad"
```

📌 Asegurate de tener `jq` instalado (`sudo apt install jq` en Debian/Ubuntu).

### 6. 🧩 Scripts Modulares

Dividí tu lógica en archivos reutilizables:

```bash
# helpers.sh
function mostrar_ayuda() {
    echo "Este script realiza..."
}

# principal.sh
#!/bin/bash
source ./helpers.sh
mostrar_ayuda
```

---

## 📝 Consejos Finales

1. Usá `set -e` y `set -x` para seguridad y debug
2. Validá argumentos y rutas antes de operar
3. Comentá tus scripts para entenderlos después
4. Usá [ShellCheck](https://www.shellcheck.net/) para verificar errores
5. Guardá tus scripts en un repo Git

---

## 🎯 Reto del Día 5
---

> Automatización + modularidad + validación = nivel DevOps pro

📌 **Objetivo**: Crear un script llamado `gestion_usuarios.sh` que permita:

1. Crear un nuevo usuario pasando el nombre como argumento
2. Validar si el usuario ya existe
3. Registrar la acción en un log (`usuarios.log`)
4. Usar una función llamada `crear_usuario` definida en un archivo `funciones.sh`

### Estructura sugerida:

**funciones.sh**

```bash
crear_usuario() {
  if id "$1" &>/dev/null; then
    echo "El usuario $1 ya existe."
  else
    sudo useradd "$1"
    echo "Usuario $1 creado el $(date)" >> usuarios.log
    echo "Usuario $1 creado."
  fi
}
```

**gestion\_usuarios.sh**

```bash
#!/bin/bash
source ./funciones.sh

if [[ $# -ne 1 ]]; then
  echo "Uso: $0 <nombre_usuario>"
  exit 1
fi

crear_usuario "$1"
```

🙌 Cuando termines, compartí tu captura con el log o el resultado del script con el hashtag **#BashProConRoxs**


--
### 💥 Bonus: Automatizá el Despliegue de la Aplicación Flask 📚"Book Library"📚 con Nginx y Gunicorn

¡En este desafío vas a crear un **script de automatización completo** que despliegue una aplicación Flask usando Gunicorn como servidor WSGI y Nginx como proxy inverso!

> Este reto es clave para afianzar tus habilidades en scripting, automatización y despliegue.

### 🎯 Objetivo:

Crear un script llamado `desplegar_app.sh` que realice automáticamente los siguientes pasos:

1. ✅ Instale dependencias necesarias: Python, pip, virtualenv, Nginx y Git.
2. 🧱 Cree un entorno virtual, instale dependencias y clone la app:

   ```bash
   git clone -b booklibrary https://github.com/roxsross/devops-static-web.git
   cd devops-static-web
   python3 -m venv venv && source venv/bin/activate
   pip install -r requirements.txt
   ```
3. 🚀 Configure Gunicorn para correr la app:

   ```bash
   gunicorn -w 4 -b 127.0.0.1:8000 app:app
   ```
4. 🌐 Configure Nginx para redirigir al puerto 8000 de Gunicorn.
5. 🔄 Reinicie servicios y verifique que todo esté online.
6. 📜 Guarde logs del proceso en `logs_despliegue.txt`

### 🧩 Tip extra:

Podés separar la lógica en funciones como:

* `instalar_dependencias()`
* `clonar_app()`
* `configurar_gunicorn()`
* `configurar_nginx()`

### 📦 Bonus extra:

Convertí este script en una **tarea programada semanal con cron** para que revise si la app está online y la reinicie si no lo está.

Cuando lo termines, ¡compartilo con la comunidad usando el hashtag **#DevOpsConRoxs**! 🎯

Para evitar la configuración manual, podés crear un script Bash que automatice el despliegue de la aplicación.

---

### 🖼️ Resultados esperados

![](https://bootcamp.295devops.com/assets/images/web-07-dc46d419d0e64314c6bbf9aea7214b81.png)

📢 Usá el hashtag **#DevOpsConRoxs** o compartilo en el canal de la comunidad. 🎯
