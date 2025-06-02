---
title: Día 15 - GitHub Actions
description: Aprender a automatizar el ciclo de vida de desarrollo (CI/CD)
sidebar_position: 1
---

### Introducción a GitHub Actions

![](../../static/images/banner/3.png)

### ¿Qué es GitHub Actions?
GitHub Actions es una plataforma de integración continua y entrega continua (CI/CD) que permite automatizar, personalizar y ejecutar flujos de trabajo de desarrollo de software directamente en tu repositorio de GitHub.

![](https://miro.medium.com/v2/resize:fit:2000/1*TQn3443bwk8Th99o3RdC3w.png)

### Conceptos Clave

#### 1. **Workflow (Flujo de Trabajo)**
- Proceso automatizado configurable que ejecuta uno o más jobs
- Se define en archivos YAML en el directorio `.github/workflows/`
- Se activa por eventos específicos (push, pull request, schedule, etc.)

#### 2. **Event (Evento)**
- Actividad específica en el repositorio que desencadena un workflow
- Ejemplos: `push`, `pull_request`, `release`, `schedule`

#### 3. **Job (Trabajo)**
- Conjunto de pasos que se ejecutan en el mismo runner
- Los jobs pueden ejecutarse en paralelo o secuencialmente

#### 4. **Step (Paso)**
- Tarea individual dentro de un job
- Puede ser una acción o un comando shell

#### 5. **Action (Acción)**
- Aplicación personalizada reutilizable que realiza una tarea compleja
- Puede ser creada por la comunidad o por ti mismo

#### 6. **Runner**
- Servidor que ejecuta los workflows
- GitHub proporciona runners hospedados (Ubuntu, Windows, macOS)
- También puedes usar self-hosted runners

### Ventajas de GitHub Actions

1. **Integración Nativa**: Completamente integrado con GitHub
2. **Gratuito para Repositorios Públicos**: Incluye minutos gratuitos
3. **Matriz de Sistemas Operativos**: Soporte para Linux, Windows, macOS
4. **Marketplace de Acciones**: Miles de acciones pre-construidas
5. **Sintaxis Sencilla**: Archivos YAML fáciles de entender

## 🛠️ Práctica

### Ejercicio 1: Tu Primer Workflow

1. **Crear un nuevo repositorio en GitHub**
   ```bash
   mkdir mi-primer-workflow
   cd mi-primer-workflow
   git init
   echo "# Mi Primer Workflow" > README.md
   git add README.md
   git commit -m "Initial commit"
   ```

2. **Crear la estructura de directorios**
   ```bash
   mkdir -p .github/workflows
   ```

3. **Crear tu primer workflow**
   
   Archivo: `.github/workflows/hello-world.yml`
   ```yaml
   name: Hello World Workflow
   
   # Eventos que activan el workflow
   on:
     push:
       branches: [ main ]
     pull_request:
       branches: [ main ]
   
   # Jobs a ejecutar
   jobs:
     hello:
       runs-on: ubuntu-latest
       
       steps:
       - name: Checkout code
         uses: actions/checkout@v4
         
       - name: Say Hello
         run: echo "¡Hola DevOps con Rox! 👋"
         
       - name: Show date
         run: date
         
       - name: List files
         run: ls -la
   ```

### Ejercicio 2: Workflow con Variables de Entorno

Archivo: `.github/workflows/variables.yml`
```yaml
name: Variables Example

on:
  push:
    branches: [ main ]

env:
  GLOBAL_VAR: "Variable global"

jobs:
  variables-demo:
    runs-on: ubuntu-latest
    
    env:
      JOB_VAR: "Variable del job"
    
    steps:
    - name: Checkout
      uses: actions/checkout@v4
      
    - name: Show variables
      env:
        STEP_VAR: "Variable del step"
      run: |
        echo "Variable global: $GLOBAL_VAR"
        echo "Variable del job: $JOB_VAR"
        echo "Variable del step: $STEP_VAR"
        echo "Runner OS: $RUNNER_OS"
        echo "GitHub Actor: $GITHUB_ACTOR"
```

### Ejercicio 3: Workflow Condicional

Archivo: `.github/workflows/conditional.yml`
```yaml
name: Conditional Workflow

on:
  push:
    branches: [ main, develop ]

jobs:
  conditional-job:
    runs-on: ubuntu-latest
    
    steps:
    - name: Checkout
      uses: actions/checkout@v4
      
    - name: Run only on main branch
      if: github.ref == 'refs/heads/main'
      run: echo "Este paso solo se ejecuta en la rama main"
      
    - name: Run only on develop branch
      if: github.ref == 'refs/heads/develop'
      run: echo "Este paso solo se ejecuta en la rama develop"
      
    - name: Always run
      run: echo "Este paso siempre se ejecuta"
```

## 📋 Sintaxis YAML Esencial

### Estructura Básica
```yaml
name: Nombre del Workflow
on: [eventos]
jobs:
  job-id:
    runs-on: runner-type
    steps:
    - name: Step name
      uses: action@version
    - name: Another step
      run: comando
```

### Eventos Comunes
```yaml
on:
  push:
    branches: [ main, develop ]
    paths: [ 'src/**' ]
  pull_request:
    branches: [ main ]
  schedule:
    - cron: '0 0 * * 0'  # Cada domingo a medianoche
  workflow_dispatch:  # Manual trigger
```

### Runners Disponibles
```yaml
runs-on: ubuntu-latest     # Ubuntu (más común)
runs-on: ubuntu-20.04      # Ubuntu específico
runs-on: windows-latest    # Windows
runs-on: macos-latest      # macOS
```

## ✅ Tareas del Día

### Tarea Principal
1. **Crear un repositorio llamado "devops-practice"**
2. **Implementar los 3 workflows de ejemplo**
3. **Hacer commits y observar cómo se ejecutan los workflows**
4. **Experimentar con diferentes eventos (crear una rama, hacer PR)**

### Tareas Adicionales
1. **Explorar el Marketplace de GitHub Actions**
   - Visita: https://github.com/marketplace?type=actions
   - Busca acciones populares como `actions/setup-node`, `docker/build-push-action`

2. **Modificar el workflow para que se ejecute solo los lunes**
   ```yaml
   on:
     schedule:
       - cron: '0 9 * * 1'  # Lunes a las 9 AM UTC
   ```

3. **Crear un workflow que falle intencionalmente y observar los logs**

## 🔍 Troubleshooting Común

### Problemas Frecuentes

1. **Error de indentación en YAML**
   - **Síntoma**: Workflow no se reconoce
   - **Solución**: Verificar espacios vs tabs, usar 2 espacios

2. **Workflow no se activa**
   - **Síntoma**: No aparece en la pestaña Actions
   - **Solución**: Verificar que el archivo esté en `.github/workflows/`

3. **Step falla silenciosamente**
   - **Síntoma**: Step aparece como exitoso pero no hace nada
   - **Solución**: Verificar la sintaxis del comando

## 📖 Recursos Adicionales

- [Documentación oficial de GitHub Actions](https://docs.github.com/en/actions)
- [GitHub Actions Marketplace](https://github.com/marketplace?type=actions)
- [Awesome GitHub Actions](https://github.com/sdras/awesome-actions)

---

Usá el hashtag **#DevOpsConRoxs** o compartilo en el canal de la comunidad. 🎯


**¡Mañana profundizaremos en acciones más complejas y la construcción de aplicaciones!** 🚀