# 🤝 Guía de Contribución - 90daysdevopsbyroxs

¡Gracias por tu interés en contribuir a **90daysdevopsbyroxs**! Tu colaboración ayuda a mejorar este proyecto y a fortalecer la comunidad DevOps de habla hispana.

## 📋 Tabla de Contenidos

- [Formas de Contribuir](#-formas-de-contribuir)
- [Configuración del Entorno](#-configuración-del-entorno)
- [Proceso de Contribución](#-proceso-de-contribución)
- [Estándares de Código](#-estándares-de-código)
- [Documentación](#-documentación)
- [Testing](#-testing)
- [Comunicación](#-comunicación)
- [Reconocimientos](#-reconocimientos)

---

## 🌟 Formas de Contribuir

### 📝 **Contenido Educativo**

#### Nuevo Material
- **✨ Ejercicios prácticos** para cualquier módulo o semana
- **🎯 Proyectos hands-on** adicionales
- **📚 Tutoriales paso a paso** de herramientas DevOps
- **🎥 Videos y demos** de procesos o herramientas
- **📖 Casos de estudio** reales

#### Mejoras Existentes
- **🔧 Optimización** de ejercicios actuales
- **📝 Clarificación** de instrucciones
- **🆕 Actualización** de versiones y herramientas
- **🌍 Traducción** a otros idiomas
- **♿ Mejoras de accesibilidad**

### 💻 **Código y Scripts**

#### Automatización
- **🚀 Scripts de setup** para distintos sistemas operativos
- **🔄 Mejoras en pipelines CI/CD**
- **🧪 Testing automatizado** para ejercicios y scripts
- **📊 Herramientas de validación** de progreso
- **🐳 Containerización** de entornos

#### Herramientas
- **⚡ CLI tools** para el bootcamp
- **📱 Web apps** complementarias
- **🔧 Utilidades de desarrollo**
- **📈 Dashboards** de progreso
- **🤖 Bots** para la comunidad

### 🐛 **Corrección de Bugs y Optimización**

- **🔍 Reportar bugs** en issues detallados
- **🛠️ Corregir errores** en código o configuraciones
- **🚀 Optimizar performance** de scripts
- **🔒 Mejorar seguridad** en ejemplos
- **📱 Mejorar diseño responsive** de la documentación

### 🎨 **Diseño y UX**

- **🎨 Diagramas** técnicos y arquitecturas
- **📊 Infografías** educativas
- **🖼️ Assets visuales** (iconos, banners)
- **🧭 Mejorar navegación**
- **📱 Optimizar experiencia móvil**

### 🌍 **Comunidad y Outreach**

- **👥 Mentorship** de nuevos miembros
- **📢 Promoción** en redes sociales
- **🎪 Organización de eventos y workshops**
- **📝 Blog posts** y artículos
- **🎤 Charlas** y presentaciones

---

## ⚙️ Configuración del Entorno

### 🛠️ **Prerequisitos**

```bash
# Herramientas básicas
git --version          # >= 2.30
node --version         # >= 16
python --version       # >= 3.8
docker --version       # >= 20.10

# Herramientas de desarrollo
code --version         # VSCode (recomendado)
yarn --version         # >= 1.22 (para docs)
```

### 📦 **Setup Inicial**

#### 1. Fork y Clone
```bash
# Haz fork del repositorio en GitHub
# Luego clona tu fork
git clone https://github.com/TU-USERNAME/90daysdevopsbyroxs.git
cd 90daysdevopsbyroxs

# Agrega el remote upstream
git remote add upstream https://github.com/roxsross/90daysdevopsbyroxs.git
git remote -v
```


#### 2. **Pull Request**

##### **Template de PR**
```markdown
## 📝 Descripción
Breve descripción de los cambios realizados.

## 🎯 Tipo de Cambio
- [ ] 🐛 Bug fix
- [ ] ✨ Nueva feature
- [ ] 📝 Documentación
- [ ] 🎨 Mejora de diseño
- [ ] ♻️ Refactoring
- [ ] 🚀 Performance
- [ ] 🧪 Testing

## 📋 Checklist
- [ ] Mi código sigue los estándares del proyecto
- [ ] He realizado auto-review de mi código
- [ ] He agregado tests donde es necesario
- [ ] He actualizado la documentación
- [ ] Mis cambios no generan nuevos warnings
- [ ] He probado mis cambios localmente

## 🧪 Testing
Describe cómo probaste tus cambios:
- [ ] Tests unitarios
- [ ] Tests de integración
- [ ] Testing manual
- [ ] Testing en diferentes browsers/OS

## 📸 Screenshots (si aplica)
Agregar screenshots antes/después para cambios visuales.

## 📚 Documentación Relacionada
Links a issues, discussions, o documentación relacionada.

## ⚠️ Breaking Changes
Describir cualquier breaking change y pasos de migración.
```

### 🏷️ **Convenciones de Naming**

#### Branches
```bash
# Formato: tipo/descripcion-kebab-case
feat/nuevo-ejercicio-docker
fix/corregir-enlace-roto
docs/actualizar-readme
style/mejorar-formato-codigo
refactor/reorganizar-semana-3
test/agregar-tests-unitarios
chore/actualizar-dependencias
```

#### Commits
```bash
# Formato: tipo(scope): descripción
feat(semana-4): agregar ejercicio avanzado de Docker Compose
fix(semana-7): corregir configuración de Kubernetes
docs(readme): actualizar instrucciones de instalación
style(markdown): corregir formato en documentación
refactor(scripts): reorganizar scripts de setup
test(integration): agregar tests para ejercicios
chore(deps): actualizar versiones de herramientas
```



