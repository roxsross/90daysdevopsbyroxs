---
title: Día 15 - Introducción a CI/CD y GitHub Actions
description: Fundamentos de integración y despliegue continuo para principiantes
sidebar_position: 1
---

## 🚀 ¡Tu código empieza a moverse solo!

![](../../static/images/banner/3.png)

¡Bienvenido a la **Semana 3 del reto 90 Días de DevOps con Roxs**!  
Hoy comenzamos con uno de los superpoderes de todo DevOps: la **automatización del flujo de trabajo con CI/CD** usando **GitHub Actions**.

> 🧠 CI/CD no es solo para "grandes empresas". ¡También es para vos! Te ahorra tiempo, mejora tu código y lo convierte en un proceso fluido.

---

## 🤔 ¿Qué es CI/CD explicado con comida?

### Analogía del chef y el restaurante 🍝

#### 🔧 Sin CI/CD (todo a mano)
```

👨‍🍳 Cocinas un plato
👀 Lo probás vos solo
📦 Lo servís
😰 Si sale mal, el cliente se queja
🔄 Tenés que rehacer todo desde cero

```

#### 🤖 Con CI/CD (automatización al máximo)
```

📦 Preparás los ingredientes
🤖 Un robot sigue tu receta
🧪 Pruebas automáticas
✅ Solo si pasa todo, se sirve
📊 Se registra todo
⚡ Es más rápido y confiable

````

### En modo DevOps:
- **CI (Continuous Integration)** = Verifica tu código al instante
- **CD (Continuous Deployment)** = Lo publica automáticamente si todo está bien
- **Pipeline** = Secuencia de pasos automáticos

---

## 🛠️ ¿Qué es GitHub Actions?

**GitHub Actions** es tu asistente personal dentro de GitHub que te permite:

- 🔄 Ejecutar tareas cuando hacés un `push` o `pull request`
- 🧪 Probar automáticamente tu app
- 📦 Construirla, empaquetarla o desplegarla
- 🛎️ Avisarte si algo falla

### Conceptos Clave:

| Concepto   | ¿Qué significa?                      |
|------------|---------------------------------------|
| **Workflow** | Un flujo de tareas automatizadas     |
| **Job**     | Un grupo de pasos que se ejecutan juntos |
| **Step**    | Una acción específica (comando o tarea) |
| **Runner**  | Máquina que ejecuta los jobs         |

---

## ✨ ¡Tu primer workflow de CI/CD!

### Paso 1: Crear tu proyecto

```bash
mkdir mi-primer-ci-cd
cd mi-primer-ci-cd
git init
echo "# Mi Primer CI/CD" > README.md
git add .
git commit -m "Inicio de proyecto"
````

### Paso 2: Crear la estructura

```bash
mkdir -p .github/workflows
```

### Paso 3: Crear el workflow `.github/workflows/hola-mundo.yml`

```yaml
name: Mi Primer CI/CD

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]
  workflow_dispatch:

jobs:
  saludar:
    runs-on: ubuntu-latest
    steps:
    - name: 📥 Descargar código
      uses: actions/checkout@v4

    - name: 👋 ¡Hola mundo DevOps!
      run: |
        echo "¡Hola DevOps con Roxs! 🚀"
        date
        uname -a

    - name: 🧪 Test Matemático
      run: |
        if [ $((2+2)) -eq 4 ]; then
          echo "✅ Todo OK"
        else
          echo "❌ Algo falló"
          exit 1
        fi
```

### Paso 4: Subir tu repositorio

```bash
git remote add origin https://github.com/TU-USUARIO/mi-primer-ci-cd.git
git branch -M main
git push -u origin main
```

📌 **En GitHub → pestaña “Actions” vas a ver tu workflow ejecutándose automáticamente.**

---

## 🎯 Ejercicios prácticos

### Ejercicio 1: Workflow con variables

`.github/workflows/variables.yml`

```yaml
name: Variables DevOps

on: [push, workflow_dispatch]

env:
  PROYECTO: "Mi App DevOps"
  AMBIENTE: "Desarrollo"

jobs:
  mostrar:
    runs-on: ubuntu-latest
    env:
      RESPONSABLE: "Estudiante DevOps"
    steps:
    - name: Mostrar info
      run: |
        echo "Proyecto: $PROYECTO"
        echo "Ambiente: $AMBIENTE"
        echo "Responsable: $RESPONSABLE"
```

### Ejercicio 2: Workflow condicional

`.github/workflows/condicional.yml`

```yaml
name: Rama Detectada

on:
  push:
    branches: [main, develop, feature/*]
  workflow_dispatch:

jobs:
  detectar:
    runs-on: ubuntu-latest
    steps:
    - name: Detectar rama
      run: |
        echo "Rama actual: ${{ github.ref_name }}"
```

---

## 🧠 Revisión rápida

| Concepto                     | ¿Entendiste? |
| ---------------------------- | ------------ |
| ¿Qué es CI/CD?               | ✅ / ❌        |
| ¿Qué hace un workflow?       | ✅ / ❌        |
| ¿Cómo se ejecuta una acción? | ✅ / ❌        |

---

## 📝 Tarea del Día

✅ Crear tu primer workflow básico
✅ Crear uno con variables
✅ Crear uno condicional según la rama
🎁 Opcional: Compartí tu workflow con la comunidad usando el hashtag **#DevOpsConRoxs**
📸 ¡Tomá captura del resultado y postealo!

---

## 🧡 Cierre del Día

Hoy diste un **paso gigante**.
Pasaste de ejecutar comandos manuales a **tener tu propio robot trabajando para vos**.

Mañana vamos a ver cómo hacer que tu aplicación real se **construya y se testee automáticamente**.

Nos vemos en el **Día 16**. ¡Y que el DevOps te acompañe! 🧙‍♀️🔥


