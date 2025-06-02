# bootcamp-devops
by Roxs

# 🚀 90 Días de DevOps con Roxs

![DevOps Banner](./static/images/banner/13.png)

> **Transformá tu carrera tech en 90 días** 🔥  
> El programa más completo e intensivo de DevOps en español, diseñado para llevarte desde cero hasta profesional.

[![GitHub stars](https://img.shields.io/github/stars/roxsross/90daysdevopsbyroxs)](https://github.com/roxsross/90daysdevopsbyroxs/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/roxsross/90daysdevopsbyroxs)](https://github.com/roxsross/90daysdevopsbyroxs/network)
[![GitHub issues](https://img.shields.io/github/issues/roxsross/90daysdevopsbyroxs)](https://github.com/roxsross/90daysdevopsbyroxs/issues)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Discord](https://img.shields.io/discord/123456789?label=Discord&logo=discord)](https://discord.gg/devops-bootcamp)

---

## 📋 Tabla de Contenidos

- [Sobre el Proyecto](#-sobre-el-proyecto)
- [¿Qué Vas a Aprender?](#-qué-vas-a-aprender)
- [Estructura del Programa](#-estructura-del-programa)
- [Prerequisitos](#-prerequisitos)
- [Instalación y Setup](#️-instalación-y-setup)
- [Cómo Usar Este Repositorio](#-cómo-usar-este-repositorio)
- [Cronograma de 13 Semanas](#-cronograma-de-13-semanas)
- [Proyecto Principal](#-proyecto-principal-roxs-voting-app)
- [Tecnologías y Herramientas](#-tecnologías-y-herramientas)
- [Comunidad](#-comunidad)
- [Contribuir](#-contribuir)
- [Reconocimientos](#-reconocimientos)
- [Licencia](#-licencia)
- [Contacto](#-contacto)

---

## 🎯 Sobre el Proyecto

**90 Días de DevOps con Roxs** es un programa intensivo y **100% práctico** que te lleva desde los fundamentos hasta implementaciones avanzadas de DevOps. No es solo teoría - construirás proyectos reales, automatizarás procesos completos y desarrollarás las habilidades que demandan las empresas tech.

### 🔥 ¿Por qué este programa es diferente?

- **📚 Aprende Haciendo**: Cada día incluye ejercicios prácticos y proyectos reales
- **🌍 Código Abierto**: Todo el contenido es gratuito y colaborativo
- **🎖️ Metodología Probada**: Basado en experiencias reales de la industria
- **🤝 Comunidad Activa**: Soporte continuo de instructores y peers
- **💼 Portfolio Ready**: Termina con proyectos listos para mostrar a empleadores

---

## 🎓 ¿Qué Vas a Aprender?

### 🛠️ Habilidades Técnicas

- **Containerización** con Docker y orquestación con Kubernetes
- **Infrastructure as Code** con Terraform y Ansible
- **CI/CD Pipelines** con GitHub Actions, Jenkins y GitLab
- **Cloud Computing** en AWS, Azure y Google Cloud
- **Monitoring y Observabilidad** con Prometheus, Grafana y ELK Stack
- **Security** integrada en el ciclo DevOps (DevSecOps)

### 💡 Habilidades Blandas

- **Mentalidad DevOps**: Colaboración entre Dev y Ops
- **Problem Solving**: Debugging y troubleshooting avanzado
- **Automatización**: Identificar y automatizar procesos manuales
- **Mejora Continua**: Optimización constante de workflows


---

## 📖 Cómo Usar Este Repositorio

### 🗓️ Progresión Semanal

1. **📚 Lee la documentación** de la semana en `/semana-XX/README.md`
2. **🎯 Completa los ejercicios** paso a paso
3. **💾 Documenta tu progreso** en tu branch personal
4. **🔄 Comparte en la comunidad** tus resultados y dudas
5. **🎉 Celebra** cada milestone completado

### 📁 Estructura de Cada Semana

```
semana-XX/
├── README.md              # Objetivos y teoría
├── ejercicios/            # Prácticas hands-on
│   ├── ejercicio-01/
│   ├── ejercicio-02/
│   └── proyecto-semanal/
├── recursos/              # Scripts, configs, ejemplos
├── solucion/              # Soluciones de referencia
└── extra/                 # Material adicional
```

### 🏷️ Convenciones de Commits

```bash
# Formato recomendado
git commit -m "feat(semana-04): completar ejercicio Docker Compose"
git commit -m "docs(semana-07): agregar notas sobre Kubernetes"
git commit -m "fix(semana-10): corregir configuración Prometheus"
```

## 🗳️ Proyecto Principal: Roxs Voting App

A lo largo del programa, construirás y evolucionarás una **aplicación de votación completa** que incluye:

### 🏗️ Arquitectura

```mermaid
graph TB
    subgraph "Frontend"
        A[Vote App - Python/Flask]
        B[Results App - Node.js]
    end
    
    subgraph "Backend Services"
        C[Worker - .NET/Java]
        D[Redis - Queue]
        E[PostgreSQL - Database]
    end
    
    subgraph "Infrastructure"
        F[Docker Containers]
        G[Kubernetes Cluster]
        H[AWS/Cloud]
    end
    
    A --> D
    C --> D
    C --> E
    B --> E
    F --> G
    G --> H
```

---

## 🛠️ Tecnologías y Herramientas

### 🏗️ Infrastructure & Containers
![Docker](https://img.shields.io/badge/docker-%230db7ed.svg?style=for-the-badge&logo=docker&logoColor=white)
![Kubernetes](https://img.shields.io/badge/kubernetes-%23326ce5.svg?style=for-the-badge&logo=kubernetes&logoColor=white)
![Terraform](https://img.shields.io/badge/terraform-%235835CC.svg?style=for-the-badge&logo=terraform&logoColor=white)
![Ansible](https://img.shields.io/badge/ansible-%231A1918.svg?style=for-the-badge&logo=ansible&logoColor=white)

### ☁️ Cloud Providers
![AWS](https://img.shields.io/badge/AWS-%23FF9900.svg?style=for-the-badge&logo=amazon-aws&logoColor=white)
![Azure](https://img.shields.io/badge/azure-%230072C6.svg?style=for-the-badge&logo=microsoftazure&logoColor=white)
![Google Cloud](https://img.shields.io/badge/GoogleCloud-%234285F4.svg?style=for-the-badge&logo=google-cloud&logoColor=white)

### 🔄 CI/CD & GitOps
![GitHub Actions](https://img.shields.io/badge/github%20actions-%232671E5.svg?style=for-the-badge&logo=githubactions&logoColor=white)
![GitLab CI](https://img.shields.io/badge/gitlab%20ci-%23181717.svg?style=for-the-badge&logo=gitlab&logoColor=white)
![Jenkins](https://img.shields.io/badge/jenkins-%232C5263.svg?style=for-the-badge&logo=jenkins&logoColor=white)
![ArgoCD](https://img.shields.io/badge/argo-EF7B4D.svg?style=for-the-badge&logo=argo&logoColor=white)

### 📊 Monitoring & Observability
![Prometheus](https://img.shields.io/badge/Prometheus-E6522C?style=for-the-badge&logo=Prometheus&logoColor=white)
![Grafana](https://img.shields.io/badge/grafana-%23F46800.svg?style=for-the-badge&logo=grafana&logoColor=white)
![Elastic](https://img.shields.io/badge/-ElasticSearch-005571?style=for-the-badge&logo=elasticsearch)

### 💻 Programming & Scripting
![Python](https://img.shields.io/badge/python-3670A0?style=for-the-badge&logo=python&logoColor=ffdd54)
![Go](https://img.shields.io/badge/go-%2300ADD8.svg?style=for-the-badge&logo=go&logoColor=white)
![Shell Script](https://img.shields.io/badge/shell_script-%23121011.svg?style=for-the-badge&logo=gnu-bash&logoColor=white)
![YAML](https://img.shields.io/badge/yaml-%23ffffff.svg?style=for-the-badge&logo=yaml&logoColor=151515)

---

## 🌟 Comunidad

### 💬 Únete a Nuestra Comunidad

- **🐦 Twitter**: [@roxsross](https://twitter.com/roxsrosss) - Updates y tips
- **📺 YouTube**: [295 DevOps Channel](https://youtube.com/c/295devops) - Tutoriales y lives

---

## 🤝 Contribuir

¡Tu contribución hace que este programa sea mejor para todos! 

### 🚀 Formas de Contribuir

#### 📝 **Contenido**
- Nuevos ejercicios y proyectos
- Mejoras en documentación
- Casos de estudio reales
- Traducciones

#### 🐛 **Código**
- Corrección de bugs
- Scripts de automatización
- Mejoras en templates
- Testing y validación

#### 🎨 **Diseño y UX**
- Diagramas y visualizaciones
- Mejoras en la navegación
- Templates y layouts
- Iconografía

### 📋 Proceso de Contribución

1. **🍴 Fork** este repositorio
2. **🌿 Crear branch** para tu feature (`git checkout -b feature/AmazingFeature`)
3. **💾 Commit** tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. **⬆️ Push** a la branch (`git push origin feature/AmazingFeature`)
5. **🔄 Abrir Pull Request**

### 📜 Guidelines para Contributors

- **📖 Lee nuestro [Contributing Guide](CONTRIBUTING.md)**
- **🎯 Sigue nuestro [Code of Conduct](CODE_OF_CONDUCT.md)**
- **✅ Ejecuta tests** antes de enviar PR
- **📝 Documenta** nuevas features

---

## 🏆 Reconocimientos

### 👥 Top Contributors

<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tr>
    <td align="center"><a href="https://github.com/roxsross"><img src="https://avatars.githubusercontent.com/u/roxsross?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Rossana Suarez</b></sub></a><br />🎯 Project Lead</td>
    <td align="center"><a href="https://github.com/contributor1"><img src="https://via.placeholder.com/100" width="100px;" alt=""/><br /><sub><b>Contributor 1</b></sub></a><br />💻 Code</td>
    <td align="center"><a href="https://github.com/contributor2"><img src="https://via.placeholder.com/100" width="100px;" alt=""/><br /><sub><b>Contributor 2</b></sub></a><br />📖 Docs</td>
  </tr>
</table>
<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

---

## 📊 Estadísticas del Proyecto

![GitHub commit activity](https://img.shields.io/github/commit-activity/m/roxsross/90daysdevopsbyroxs)
![GitHub last commit](https://img.shields.io/github/last-commit/roxsross/90daysdevopsbyroxs)
![GitHub contributors](https://img.shields.io/github/contributors/roxsross/90daysdevopsbyroxs)
![GitHub language count](https://img.shields.io/github/languages/count/roxsross/90daysdevopsbyroxs)

---

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para detalles.

### 🤝 ¿Qué significa esto?

- ✅ **Uso comercial** permitido
- ✅ **Modificación** permitida  
- ✅ **Distribución** permitida
- ✅ **Uso privado** permitido
- ❗ **Incluir licencia** en distribuciones

---

## 📞 Contacto

### 👩‍💻 Rossana Suarez (Roxs)

- **💼 LinkedIn**: [/in/roxsross](https://linkedin.com/in/roxsross)
- **🐦 Twitter**: [@roxsross](https://twitter.com/roxsross)


---

## 🎯 ¿Listo para Comenzar?

### 🚀 Next Steps

1. **⭐ Star** este repositorio para mantenerte actualizado
2. **🍴 Fork** para empezar tu journey personal
3. **💬 Únete** a nuestra comunidad en Discord
4. **📖 Lee** la documentación de la Semana 1
5. **🔥 ¡Comienza a construir!**

---

<div align="center">

## 💪 ¡Tu Futuro DevOps Comienza AQUÍ!

**"La mejor manera de predecir el futuro es construirlo"**

[🚀 Comenzar Ahora](./semana-01-fundamentos/README.md) | [💬 Unirse a la Comunidad](https://discord.gg/devops-bootcamp) | [📺 Ver Videos](https://youtube.com/c/roxsdevops)

---

### ⭐ Si este proyecto te ayuda, ¡dale una estrella!

[![Stargazers repo roster for @roxsross/90daysdevopsbyroxs](https://reporoster.com/stars/roxsross/90daysdevopsbyroxs)](https://github.com/roxsross/90daysdevopsbyroxs/stargazers)

---

**Hecho con ❤️ por la comunidad DevOps hispana**

</div>