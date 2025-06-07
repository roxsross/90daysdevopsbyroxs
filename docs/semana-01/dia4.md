---
title: Día 4 - Git & GitHub - Basics, Branching, Merging, PRs
description: Dominando Git y GitHub para control de versiones y colaboración
sidebar_position: 4
---

## ⚙️ Git & GitHub - Basics, Branching, Merging, PRs

![](../../static/images/banner/1.png)


**¡Hola! Es el Día 4 de tu jornada DevOps 👋**

El control de versiones es la columna vertebral del desarrollo moderno, y Git se destaca como el favorito de la industria. Dominar Git te permitirá rastrear cambios, colaborar eficientemente y optimizar tus flujos de trabajo DevOps.

## 📚 Puntos de Aprendizaje

### Conceptos Fundamentales
- **¿Qué es el Control de Versiones?** - Por qué Git es el VCS más popular
- **Git vs. Otros VCS** - Diferencias con SVN, Mercurial
- **Repositorios, Commits y Branches** - Cómo Git rastrea los cambios
- **Estados de Git** - Directorio de trabajo, área de staging, e historial de commits

### Comandos Básicos de Git
- `git init`, `git add`, `git commit`
- `git status`, `git log`, `git diff`

### Branching y Merging
- Creación de branches y fusión de cambios
- Estrategias de branching

### Colaboración
- **Pull Requests (PRs)** - Entendiendo los flujos de GitHub
- **Repositorios Remotos** - Conectando Git local con GitHub
- **Clonado, fetching, pulling y pushing** - Sincronización de cambios
- **Resolución de Conflictos** - Cómo manejar y solucionar conflictos

## 🎓 Recursos de Aprendizaje

- [Atlassian Git Tutorial](https://www.atlassian.com/git/tutorials)
- [Pro Git (Capítulo 2 - Uso Básico)](https://git-scm.com/book)
- [GitHub's Hello World Guide](https://guides.github.com/activities/hello-world/)

## ✅ Tareas Iniciales

### 1. Instalación y Configuración
```bash
# Instalar Git en tu sistema
# Visita: https://git-scm.com/downloads

# Configurar tu nombre de usuario y email
git config --global user.name "Tu Nombre"
git config --global user.email "tu@email.com"
```

### 2. Crear tu Primer Repositorio
```bash
# Crear nueva carpeta e inicializar repositorio Git
mkdir git-proyecto && cd git-proyecto
git init

# Crear archivos iniciales
touch index.html style.css
git add .
git commit -m "Commit inicial"
```

### 3. Realizar Cambios y Commit
```bash
# Modificar index.html y verificar cambios
git status
git diff
git add index.html
git commit -m "Actualizado index.html"
```

### 4. Verificar Historial
```bash
# Verificar historial de commits
git log --oneline
```

### 5. Conectar con GitHub
```bash
# Crear repositorio en GitHub, agregar remoto y push
git remote add origin https://github.com/tuusuario/git-proyecto.git
git branch -M main
git push -u origin main
```

## 🔥 Desafíos Prácticos

### 🔹 Desafío 1: Fork y Clone
**Objetivo:** Fork y clona un proyecto open-source

**Pasos:**
1. Dirígete al repositorio: [git exercises](https://github.com/roxsross/git-exercises)
2. Haz Fork del repositorio (botón "Fork" en la esquina superior derecha)
3. Clona tu fork:
```bash
git clone https://github.com/TU_USUARIO/git-exercises.git
cd git-exercises
```

**Bonus:** Configurar upstream para sincronizar actualizaciones:
```bash
git remote add upstream https://github.com/sd031/git-exercises.git
git remote -v
```

### 🔹 Desafío 2: Branching
**Objetivo:** Crear una nueva branch, cambiar y hacer commit

```bash
# Crear y cambiar a nueva branch
git checkout -b feature-branch

# Verificar branch activa
git branch

# Hacer cambios
echo "Nueva funcionalidad agregada!" > feature.txt
git add feature.txt
git commit -m "Agregado feature.txt con nueva funcionalidad"

# Push de la nueva branch
git push origin feature-branch
```

### 🔹 Desafío 3: Merging
**Objetivo:** Fusionar feature-branch en main

```bash
# Cambiar a main
git checkout main

# Asegurar que main esté actualizado
git pull origin main

# Fusionar feature-branch
git merge feature-branch

# Push de los cambios fusionados
git push origin main

# Eliminar branch (opcional)
git branch -d feature-branch
git push origin --delete feature-branch
```

### 🔹 Desafío 4: Deshacer Commits
**Objetivo:** Usar git reset o git revert para deshacer un commit

**Opción A - git reset (elimina completamente):**
```bash
# Eliminar último commit pero mantener cambios
git reset --soft HEAD~1

# Eliminar último commit y descartar cambios
git reset --hard HEAD~1
```

**Opción B - git revert (mantiene historial):**
```bash
# Ver historial y obtener hash del commit
git log --oneline

# Revertir commit específico
git revert <commit-hash>
```

### 🔹 Desafío 5: Rebase
**Objetivo:** Rebase feature-branch sobre main

```bash
# Cambiar a feature-branch
git checkout feature-branch

# Rebase sobre main
git rebase main

# Resolver conflictos si aparecen:
# 1. Editar archivos conflictivos
# 2. git add <archivo-resuelto>
# 3. git rebase --continue
```

**Diferencia Rebase vs Merge:**
- **Rebase:** Crea historial lineal y limpio
- **Merge:** Mantiene historial de ramificación

### 🔹 Desafío 6: Pull Request
**Objetivo:** Crear un PR en GitHub desde feature branch

**Pasos:**
1. Push de tu feature branch: `git push origin feature-branch`
2. Ve a GitHub y haz clic en "Compare & pull request"
3. Completa título y descripción
4. Crear Pull Request
5. Una vez aprobado, hacer merge

**Bonus con GitHub CLI:**
```bash
gh pr create --base main --head feature-branch --title "Nueva Funcionalidad" --body "Descripción de la funcionalidad"
```

### 🔹 Desafío 7: Resolución de Conflictos
**Objetivo:** Crear cambios conflictivos y resolverlos

```bash
# Crear repositorio de prueba
git init conflict-demo
cd conflict-demo
echo "¡Hola, DevOps!" > archivo.txt
git add archivo.txt
git commit -m "Commit inicial"

# Crear y modificar feature-branch
git checkout -b feature-branch
echo "Cambio en feature branch" > archivo.txt
git add archivo.txt
git commit -m "Modificado archivo.txt en feature-branch"

# Volver a main y hacer cambio conflictivo
git checkout main
echo "Cambio en main branch" > archivo.txt
git add archivo.txt
git commit -m "Modificado archivo.txt en main"

# Intentar merge (generará conflicto)
git merge feature-branch

# Resolver conflicto manualmente en archivo.txt
# Eliminar marcadores de conflicto y elegir contenido
git add archivo.txt
git commit -m "Resuelto conflicto de merge en archivo.txt"
```

### 🔹 Desafío 8: Git Stash
**Objetivo:** Guardar y restaurar cambios no commiteados

```bash
# Hacer cambios sin commit
echo "Cambios no commiteados" >> archivo.txt

# Verificar estado
git status

# Guardar cambios temporalmente
git stash

# Verificar que working directory está limpio
git status

# Restaurar cambios
git stash pop

# Listar todos los stashes
git stash list

# Aplicar stash específico
git stash apply stash@{0}
```

### 🔹 Desafío 9: Tags de Versión
**Objetivo:** Agregar tags de versión a commits

```bash
# Ver historial reciente
git log --oneline --graph --decorate -n 5

# Crear tag ligero
git tag v1.0.0

# Crear tag anotado (recomendado)
git tag -a v1.0.0 -m "Release versión 1.0.0"

# Listar tags
git tag

# Push del tag
git push origin v1.0.0

# Push de todos los tags
git push --tags

# Ver detalles del tag
git show v1.0.0
```

### 🔹 Desafío 10: Editar Commits Pasados
**Objetivo:** Usar git commit --amend y git rebase -i

**Modificar último commit:**
```bash
# Hacer cambios adicionales
echo "Cambio adicional" >> archivo.txt
git add archivo.txt

# Modificar último commit
git commit --amend -m "Commit actualizado con nuevos cambios"

# Force push si ya fue pusheado
git push origin main --force
```

**Editar commits anteriores:**
```bash
# Ver historial
git log --oneline -n 5

# Iniciar rebase interactivo (últimos 3 commits)
git rebase -i HEAD~3

# En el editor, cambiar 'pick' por:
# - reword: cambiar mensaje del commit
# - edit: pausar para modificar commit
# - squash: combinar commits
# - drop: eliminar commit
```

## 💡 Bonus: Estructura del .git

```
📂 .git/
├── 📁 hooks/          # Scripts de automatización
├── 📁 objects/        # Almacena todos los objetos Git
├── 📁 refs/           # Referencias a commits
│   ├── 📁 heads/      # Branches locales
│   └── 📁 remotes/    # Branches remotas
├── 📄 config          # Configuración del repositorio
├── 📄 HEAD            # Apunta a la branch actual
└── 📄 index           # Área de staging
```


--- 

# 🚀 Git Avanzado - Rebase, Cherry-pick, Resolución de Conflictos


Cuando trabajas en un entorno de equipo con otros ingenieros, los conflictos están destinados a ocurrir. Hoy aprenderemos técnicas avanzadas de Git: rebase, cherry-pick y resolución profesional de conflictos.

## 📚 Puntos de Aprendizaje

### Técnicas Avanzadas
- **🔹 Git Rebase** - Deep Dive y reescritura de historial
- **🔹 Git Cherry-pick** - Aplicar commits específicos entre branches
- **🔹 Resolución de Conflictos** - Identificar y resolver conflictos eficientemente
- **🔹 Reescritura de Historial** - Casos de uso avanzados
- **🔹 Amending Commits** - Modificar commits sin cambiar historial
- **🔹 Git Hooks** - Automatización con pre-commit y post-commit hooks

## 🎓 Recursos de Aprendizaje

- [Git Rebase Guide - Atlassian](https://www.atlassian.com/git/tutorials/rewriting-history/git-rebase)
- [Git Cherry-pick - Documentación Oficial](https://git-scm.com/docs/git-cherry-pick)
- [Understanding Merge Conflicts - Atlassian](https://www.atlassian.com/git/tutorials/using-branches/merge-conflicts)
- [Git Hooks Guide](https://git-scm.com/book/en/v2/Customizing-Git-Git-Hooks)

## ✅ Tareas Iniciales

### 1. Configurar Repositorio de Práctica
```bash
# Usar repositorio existente o crear uno nuevo
git init git-avanzado-practica
cd git-avanzado-practica
```

### 2. Crear Branch de Práctica
```bash
# Crear nueva branch para practicar comandos avanzados
git checkout -b advanced-git-practice

# Hacer múltiples commits
echo "Contenido inicial" > archivo.txt
git add archivo.txt
git commit -m "Commit inicial"

echo "Segunda línea" >> archivo.txt
git commit -am "Segundo commit"

echo "Tercera línea" >> archivo.txt
git commit -am "Tercer commit"
```

### 3. Push al Repositorio Remoto
```bash
git push origin advanced-git-practice
```

### 4. Simular Flujo Colaborativo
```bash
# Crear segunda branch
git checkout -b feature-x
echo "Funcionalidad X" >> feature-x.txt
git add feature-x.txt
git commit -m "Agregada funcionalidad X"

# Merge a main
git checkout main
git merge feature-x
```

### 5. Crear Conflicto Intencional
```bash
# Crear dos branches con cambios conflictivos
git checkout -b branch-a
echo "Cambio desde branch A" > conflicto.txt
git add conflicto.txt
git commit -m "Cambio en branch A"

git checkout main
git checkout -b branch-b
echo "Cambio desde branch B" > conflicto.txt
git add conflicto.txt
git commit -m "Cambio en branch B"

# Intentar merge (generará conflicto)
git checkout main
git merge branch-a
git merge branch-b  # Esto generará conflicto
```

### 6. Visualizar Historial
```bash
# Visualizar estructura de commits y branches
git log --oneline --graph --all
```

## 🔥 Desafíos Avanzados

### 🔹 Desafío 1: Rebase Interactivo
**Objetivo:** Modificar historial de commits (renombrar, squash, reordenar)

**Paso 1: Ver Commits Recientes**
```bash
git log --oneline -n 5
```

**Ejemplo de output:**
```
a1b2c3d (HEAD -> feature-branch) Agregada nueva funcionalidad
e4f5g6h Corregido issue de API
i7j8k9l Actualizada documentación
m0n1o2p Commit inicial
```

**Paso 2: Iniciar Rebase Interactivo**
```bash
git rebase -i HEAD~3
```

**Paso 3: Modificar Commits en el Editor**

**1️⃣ Renombrar Mensaje de Commit:**
```
reword a1b2c3d Agregada nueva funcionalidad
pick e4f5g6h Corregido issue de API
pick i7j8k9l Actualizada documentación
```

**2️⃣ Squash Commits:**
```
pick a1b2c3d Agregada nueva funcionalidad
pick e4f5g6h Corregido issue de API
squash i7j8k9l Actualizada documentación
```

**3️⃣ Reordenar Commits:**
```
pick e4f5g6h Corregido issue de API
pick i7j8k9l Actualizada documentación
pick a1b2c3d Agregada nueva funcionalidad
```

**Paso 4: Finalizar y Push**
```bash
git rebase --continue
git push origin feature-branch --force
```

### 🔹 Desafío 2: Cherry-pick
**Objetivo:** Aplicar commit específico de otra branch

**Paso 1: Ver Commits Disponibles**
```bash
git checkout feature-branch
git log --oneline --graph -n 5
```

**Paso 2: Cambiar a Branch Objetivo**
```bash
git checkout main
```

**Paso 3: Aplicar Commit Específico**
```bash
git cherry-pick e4f5g6h
```

**Paso 4: Resolver Conflictos (si aparecen)**
```bash
# Editar archivos conflictivos manualmente
git add <archivo-resuelto>
git cherry-pick --continue

# Para abortar:
git cherry-pick --abort
```

**Paso 5: Push de Cambios**
```bash
git push origin main
```

### 🔹 Desafío 3: Escenario de Conflicto de Merge
**Objetivo:** Crear y resolver conflictos usando merge y rebase

**Paso 1: Setup del Repositorio**
```bash
git init merge-conflict-demo
cd merge-conflict-demo
echo "Línea 1" > conflicto.txt
git add conflicto.txt
git commit -m "Commit inicial"
```

**Paso 2: Branch de Funcionalidad**
```bash
git checkout -b feature-branch
echo "Cambio desde feature branch" > conflicto.txt
git commit -am "Modificado conflicto.txt en feature-branch"
```

**Paso 3: Cambio en Main**
```bash
git checkout main
echo "Cambio desde main branch" > conflicto.txt
git commit -am "Modificado conflicto.txt en main"
```

**Paso 4: Merge y Resolución**
```bash
# Intentar merge
git merge feature-branch

# Resolver conflicto manualmente en conflicto.txt
# Eliminar marcadores: <<<<<<< ======= >>>>>>>
# Elegir o combinar contenido deseado

git add conflicto.txt
git commit -m "Resuelto conflicto de merge"
```

**Paso 5: Método Alternativo con Rebase**
```bash
git checkout main
git reset --hard HEAD~1  # Deshacer merge
git checkout feature-branch
git rebase main

# Resolver conflicto:
git add conflicto.txt
git rebase --continue
```

### 🔹 Desafío 4: Deshacer Commits
**Objetivo:** Usar git reset y git revert - entender diferencias

**Setup Inicial:**
```bash
git init undo-demo
cd undo-demo

echo "Primer commit" > archivo.txt
git add archivo.txt
git commit -m "Primer commit"

echo "Segundo commit" >> archivo.txt
git commit -am "Segundo commit"

echo "Tercer commit" >> archivo.txt
git commit -am "Tercer commit"

git log --oneline -n 3
```

**Opción 1: Usando reset**
```bash
# 1️⃣ Soft Reset (mantiene cambios en staging)
git reset --soft HEAD~1

# 2️⃣ Mixed Reset (mantiene cambios en working directory)
git reset --mixed HEAD~1

# 3️⃣ Hard Reset (elimina todos los cambios)
git reset --hard HEAD~1
```

**Opción 2: Usando revert**
```bash
# Crea nuevo commit que deshace cambios
git revert HEAD
```

**Diferencias Clave:**
- **reset:** Reescribe historial (peligroso si ya se pusheó)
- **revert:** Mantiene historial, crea commit inverso (seguro)

### 🔹 Desafío 5: Amend de Commits
**Objetivo:** Modificar último commit sin cambiar historial

**Paso 1: Verificar Último Commit**
```bash
git log --oneline -n 1
```

**Paso 2: Corregir Mensaje de Commit**
```bash
git commit --amend -m "Mensaje de commit actualizado"
```

**Paso 3: Agregar Archivo Olvidado**
```bash
echo "Contenido nuevo" > olvidado.txt
git add olvidado.txt
git commit --amend --no-edit
```

**Paso 4: Push de Cambios**
```bash
git push origin main --force
```

### 🔹 Desafío 6: Git Hooks
**Objetivo:** Configurar hooks para automatizar verificaciones

**Paso 1: Navegar a Hooks**
```bash
cd .git/hooks
```

**Paso 2: Crear Pre-Commit Hook**
```bash
nano pre-commit
```

**Contenido del hook:**
```bash
#!/bin/bash
# Verificar espacios en blanco al final
if git diff --cached --check | grep -q "trailing whitespace"; then
  echo "❌ Commit rechazado: ¡Espacios en blanco detectados!"
  exit 1
fi

# Verificar sintaxis de archivos Python (si existen)
for file in $(git diff --cached --name-only --diff-filter=ACM | grep '\.py$'); do
  python -m py_compile "$file"
  if [ $? -ne 0 ]; then
    echo "❌ Error de sintaxis en $file"
    exit 1
  fi
done

echo "✅ Verificaciones pre-commit pasadas!"
exit 0
```

**Paso 3: Hacer Ejecutable**
```bash
chmod +x pre-commit
```

**Paso 4: Probar el Hook**
```bash
echo "Hola mundo!   " >> archivo.txt  # Espacios al final
git add archivo.txt
git commit -m "Commit de prueba"  # Debería fallar
```

**Paso 5: Post-Commit Hook (Opcional)**
```bash
nano post-commit
```

**Contenido:**
```bash
#!/bin/bash
echo "✅ Commit exitoso! Hash: $(git rev-parse HEAD)"
echo "📊 Estadísticas del repositorio:"
echo "   - Total commits: $(git rev-list --count HEAD)"
echo "   - Archivos modificados: $(git diff --name-only HEAD~1)"
```

**Hacer ejecutable:**
```bash
chmod +x post-commit
```

**Bonus: Compartir Hooks**
```bash
# Crear directorio de hooks compartidos
mkdir -p .githooks
mv .git/hooks/pre-commit .githooks/
git config core.hooksPath .githooks
git add .githooks/
git commit -m "Agregados hooks compartidos"
```

### 🔹 Desafío 7: Rebase de Feature Branch
**Objetivo:** Rebase feature branch sobre main sin merge commits

**Paso 1: Checkout a Feature Branch**
```bash
git checkout feature-branch
```

**Paso 2: Actualizar Main**
```bash
git fetch origin
git checkout main
git pull origin main
```

**Paso 3: Rebase Feature Branch**
```bash
git checkout feature-branch
git rebase main
```

**Paso 4: Resolver Conflictos**
```bash
# Si aparecen conflictos:
git add <archivo-resuelto>
git rebase --continue

# Para abortar:
git rebase --abort
```

**Paso 5: Push de Cambios**
```bash
git push origin feature-branch --force
```

### 🔹 Desafío 8: Squash de Commits
**Objetivo:** Combinar múltiples commits en uno solo

**Paso 1: Crear Branch con Múltiples Commits**
```bash
git checkout -b feature-squash

echo "Primer cambio" > archivo.txt
git add archivo.txt
git commit -m "Primer commit"

echo "Segundo cambio" >> archivo.txt
git commit -am "Segundo commit"

echo "Tercer cambio" >> archivo.txt
git commit -am "Tercer commit"
```

**Paso 2: Iniciar Rebase Interactivo**
```bash
git rebase -i HEAD~3
```

**Paso 3: Configurar Squash**
```
pick abc1234 Primer commit
squash def5678 Segundo commit
squash ghi9012 Tercer commit
```

**Paso 4: Editar Mensaje Final**
```
Combinados todos los cambios de funcionalidad en un commit

- Agregado primer cambio
- Agregado segundo cambio  
- Agregado tercer cambio
```

**Paso 5: Push y Verificar**
```bash
git push origin feature-squash --force
git log --oneline -n 3
```

## 💡 Comandos de Rescate Git

### Recuperar Commits Perdidos
```bash
# Ver historial completo de referencias
git reflog

# Recuperar commit específico
git checkout <commit-hash>
git checkout -b recovery-branch

# Recuperar branch eliminada
git checkout -b <branch-name> <commit-hash>
```

### Debugging Avanzado
```bash
# Encontrar cuándo se introdujo un bug
git bisect start
git bisect bad HEAD
git bisect good <commit-hash>

# Git automáticamente encuentra el commit problemático
```

### Análisis de Repositorio
```bash
# Ver quién modificó cada línea
git blame <archivo>

# Buscar en todo el historial
git log -S "búsqueda" --oneline

# Estadísticas de contribuciones
git shortlog -sn
```

## 🎯 Best Practices para Equipos

### 1. **Estrategias de Branching**
- **Feature branches:** Una feature por branch
- **Git Flow:** main, develop, feature/, release/, hotfix/
- **GitHub Flow:** main + feature branches con PR

### 2. **Convenciones de Commits**
```bash
feat: agregar nueva funcionalidad
fix: corregir bug
docs: actualizar documentación
style: cambios de formato
refactor: refactorización de código
test: agregar o modificar tests
chore: tareas de mantenimiento
```

### 3. **Flujo de Trabajo Recomendado**
```bash
# 1. Actualizar main
git checkout main
git pull origin main

# 2. Crear feature branch
git checkout -b feature/nueva-funcionalidad

# 3. Desarrollar y commitear
git add .
git commit -m "feat: implementar nueva funcionalidad"

# 4. Rebase antes de PR
git rebase main

# 5. Push y crear PR
git push origin feature/nueva-funcionalidad
```

## 🔧 Troubleshooting Común

### Problemas y Soluciones
```bash
# Error: "Your branch is ahead of origin/main by X commits"
git rebase origin/main

# Error: "Merge conflict in file.txt"
# 1. Abrir archivo, resolver marcadores
# 2. git add archivo.txt
# 3. git rebase --continue

# Error: "Detached HEAD state"
git checkout main
git checkout -b new-branch <commit-hash>

# Revertir todo a estado anterior
git reflog
git reset --hard HEAD@{n}
```


Estas técnicas avanzadas de Git te convertirán en un colaborador más eficiente y te prepararán para manejar repositorios complejos en entornos de producción.

---

**Próximo:** Día 5 - Automatizando Tareas con Bash Scripting 