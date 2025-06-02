¡Entendido! Vamos a estructurar el programa según el formato **semana a semana**, asegurándonos de que cada tema se enfoque en un **proyecto práctico** y utilice las **herramientas principales**. Este enfoque será muy útil para guiar a los participantes de manera clara y progresiva.

---

## **Programa Completo: 90 Días de DevOps con Roxs**

### **🗓️ Semana a Semana**

| Semana | Tema Clave                           | Proyecto                                                | Herramientas Principales                             |
| ------ | ------------------------------------ | ------------------------------------------------------- | ---------------------------------------------------- |
| **1**  | **Linux + Vagrant + Ansible**        | App sin Docker usando **Vagrant**                       | 🐧 **Linux**, 🔧 **Ansible**, 📦 **Vagrant**         |
| **2**  | **Docker y Docker Compose**          | Dockerizar la app                                       | 🐳 **Docker**, 🧩 **Docker Compose**                 |
| **3**  | **GitHub Actions CI/CD**             | Automatizar builds y despliegues con **GitHub Actions** | 🧪 **GitHub Actions**, ⚙️ **Self-hosted runner**     |
| **4**  | **Terraform + Provider Docker**      | Infraestructura como código local                       | 🌍 **Terraform**, 🐳 **Provider Docker**             |
| **5**  | **Kubernetes local**                 | Despliegue en **Kind** o **Minikube**                   | ☸️ **Kubernetes**, **Kind/Minikube**                 |
| **6**  | **CI/CD a Kubernetes**               | Despliegue automático en **Kubernetes**                 | 🚀 **GitHub Actions**, ☸️ **K8s**                    |
| **7**  | **Seguridad en Contenedores**        | **Trivy** + buenas prácticas de seguridad               | 🔐 **Trivy**, **Best Practices**                     |
| **8**  | **Troubleshooting + Performance**    | **Debug** + mejoras de rendimiento                      | 🛠️ **Logs**, **Metrics**, **Optimización**          |
| **9**  | **Observabilidad y Monitoreo**       | Implementación de **Prometheus** y **Grafana**          | 📊 **Prometheus**, 📈 **Grafana**                    |
| **10** | **Configuración y Secretos en K8s**  | **ConfigMaps** y **Secrets** en **Kubernetes**          | 🔐 **Kubernetes Secrets**                            |
| **11** | **Simulación de AWS con Localstack** | Crear una **nube simulada** con **Localstack**          | 🌩️ **Localstack**, **S3**, **DynamoDB**, **Lambda** |
| **12** | **Automatización avanzada**          | **Pipeline** robusto y documentado                      | ⚙️ **CI/CD**, **Markdown**, **Docs**                 |
| **13** | **Despliegue en AWS (opcional)**     | Desplegar en **EC2** o **EKS**                          | 🌩️ **AWS EC2**, **EKS**                             |

---

### **Descripción Semana a Semana:**

---

#### **Semana 1: Linux + Vagrant + Ansible**

**Objetivo:** Aprender los conceptos fundamentales de **Linux**, **Vagrant** para crear entornos locales y **Ansible** para automatizar la configuración.

**Contenido:**

* **Linux:** Comandos básicos y navegación, introducción a scripting en **Bash**.
* **Vagrant:** Crear máquinas virtuales con **Vagrant** y **VirtualBox**.
* **Ansible:** Automatizar la configuración del entorno con **Ansible** (instalación de dependencias y configuración de red).

**Proyecto:** Levantar una **aplicación local** (sin Docker) en una **máquina virtual con Vagrant**, automatizando la instalación y configuración con **Ansible**.

**Herramientas:** 🐧 **Linux**, 🔧 **Ansible**, 📦 **Vagrant**

---

#### **Semana 2: Docker y Docker Compose**

**Objetivo:** Aprender a dockerizar aplicaciones y gestionar múltiples contenedores con **Docker Compose**.

**Contenido:**

* **Docker:** Instalación, configuración y creación de **Dockerfiles**.
* **Docker Compose:** Gestión de múltiples servicios (base de datos, backend, frontend).

**Proyecto:** Dockerizar una **aplicación web** y configurar una **red Docker personalizada** usando **Docker Compose**.

**Herramientas:** 🐳 **Docker**, 🧩 **Docker Compose**

---

#### **Semana 3: GitHub Actions CI/CD**

**Objetivo:** Aprender a automatizar el ciclo de vida de desarrollo (CI/CD) con **GitHub Actions** y usar un **self-hosted runner**.

**Contenido:**

* **GitHub Actions:** Introducción a los pipelines de CI/CD con **GitHub Actions**.
* **Self-hosted runner:** Cómo configurar un **self-hosted runner** en tu máquina local para ejecutar los workflows de CI/CD.

**Proyecto:** Crear un **pipeline CI/CD** en **GitHub Actions** que automatice la construcción y el despliegue de la aplicación usando un **self-hosted runner**.

**Herramientas:** 🧪 **GitHub Actions**, ⚙️ **Self-hosted runner**

---

#### **Semana 4: Terraform + Provider Docker**

**Objetivo:** Aprender **Terraform** para gestionar infraestructura como código (IaC), comenzando con la infraestructura local.

**Contenido:**

* **Terraform:** Instalación y fundamentos de **Terraform**.
* **Provider Docker:** Uso del **provider Docker** para crear y gestionar contenedores e infraestructura local como código.

**Proyecto:** Usar **Terraform** para crear infraestructura local (archivos, directorios, servicios Docker) utilizando el **provider Docker**.

**Herramientas:** 🌍 **Terraform**, 🐳 **Provider Docker**

---

#### **Semana 5: Kubernetes Local**

**Objetivo:** Configurar y gestionar un clúster de **Kubernetes** localmente con **Kind** o **Minikube**.

**Contenido:**

* Instalación de **Kubernetes** en local con **Kind** o **Minikube**.
* Conceptos fundamentales de **Kubernetes**: Pods, Deployments, Services.

**Proyecto:** Desplegar una **aplicación** en un clúster local de **Kubernetes** usando **Kind** o **Minikube**.

**Herramientas:** ☸️ **Kubernetes**, **Kind/Minikube**

---

#### **Semana 6: CI/CD a Kubernetes**

**Objetivo:** Integrar un pipeline CI/CD para automatizar despliegues en **Kubernetes**.

**Contenido:**

* **CI/CD a Kubernetes:** Configuración de **GitHub Actions** para despliegues automáticos en un clúster de **Kubernetes**.
* Uso de **Helm** para gestionar despliegues en **Kubernetes**.

**Proyecto:** Automatizar el despliegue de una aplicación en **Kubernetes** usando **GitHub Actions**.

**Herramientas:** 🚀 **GitHub Actions**, ☸️ **K8s**

---

#### **Semana 7: Seguridad en Contenedores**

**Objetivo:** Aprender a aplicar prácticas de seguridad en contenedores con **Trivy**.

**Contenido:**

* **Trivy:** Escaneo de imágenes Docker para vulnerabilidades.
* **Buenas prácticas de seguridad** en contenedores: configuración de redes, control de acceso, etc.

**Proyecto:** Usar **Trivy** para escanear imágenes Docker y aplicar prácticas de seguridad en contenedores.

**Herramientas:** 🔐 **Trivy**, **Best Practices**

---

#### **Semana 8: Troubleshooting + Performance**

**Objetivo:** Diagnosticar y mejorar el rendimiento en aplicaciones **Kubernetes** y **Docker**.

**Contenido:**

* **Logs y métricas:** Diagnóstico de fallos en contenedores y clústeres Kubernetes.
* **Optimización de recursos** en **Kubernetes**.

**Proyecto:** Depurar y optimizar la aplicación y los recursos en el clúster de **Kubernetes**.

**Herramientas:** 🛠️ **Logs**, **Metrics**, **Optimización**

---

#### **Semana 9: Observabilidad y Monitoreo**

**Objetivo:** Implementar monitoreo y observabilidad con **Prometheus** y **Grafana**.

**Contenido:**

* Instalación y configuración de **Prometheus** y **Grafana**.
* Recolección de métricas y creación de dashboards de monitoreo.

**Proyecto:** Implementar **Prometheus** y **Grafana** para monitorear el rendimiento de la aplicación y el clúster **Kubernetes**.

**Herramientas:** 📊 **Prometheus**, 📈 **Grafana**

---

#### **Semana 10: Configuración y Secretos en Kubernetes**

**Objetivo:** Gestionar configuraciones y secretos en **Kubernetes**.

**Contenido:**

* **ConfigMaps** y **Secrets**: cómo gestionar configuraciones y secretos dentro de **Kubernetes**.
* **Buenas prácticas** para gestionar información sensible y configuraciones de la aplicación.

**Proyecto:** Usar **ConfigMaps** y **Secrets** para gestionar configuraciones de la aplicación en **Kubernetes**.

**Herramientas:** 🔐 **Kubernetes Secrets**

---

#### **Semana 11: Simulación de AWS con Localstack**

**Objetivo:** Crear una **nube simulada** con **Localstack** para probar servicios de **AWS** sin usar la nube real.

**Contenido:**

* Instalación y uso de **Localstack** para simular servicios de **AWS** como **S3**, **DynamoDB** y **Lambda**.
* Desarrollar una infraestructura de pruebas en **AWS local**.

**Proyecto:** Simular la infraestructura de **AWS** localmente usando **Localstack**.

**Herramientas:** 🌩️ **Localstack**, **S3**, **DynamoDB**, **Lambda**

---

#### **Semana 12: Automatización Avanzada**

**Objetivo:** Crear un pipeline de **CI/CD** robusto, optimizado y documentado.

**Contenido:**

* Mejores prácticas para **CI/CD**.
* Creación de un pipeline de **CI/CD** completo para integrar todo lo aprendido.

**Proyecto:** Crear un pipeline robusto para automatizar el ciclo de vida completo de la aplicación.

**Herramientas:** ⚙️ **CI/CD**, **Markdown**, **Docs**

---

#### **Semana 13: Despliegue en AWS (Opcional)**

**Objetivo:** Desplegar la aplicación en **AWS EC2** o **EKS**.

**Contenido:**

* Introducción a **AWS EC2** y **EKS** para gestionar la infraestructura en la nube.
* Despliegue de la aplicación en **AWS**.

**Proyecto:** Desplegar la aplicación en **AWS EC2** o **EKS**.

**Herramientas:** 🌩️ **AWS EC2**, **EKS**

---

### **Recursos y Herramientas:**

* **Docker**, **Kubernetes** (Minikube/EKS), **Helm**.
* **Vagrant** y **Ansible** para automatización de infraestructura local.
* **Terraform** (local, AWS provider).
* **GitHub Actions** con **self-hosted runner** para CI/CD.
* **Prometheus**, **Grafana** para monitoreo.
* **AWS** para servicios en la nube (opcional).
* **Trivy** para escaneos de seguridad.

---

### **Resultados Esperados:**

* Los participantes aprenderán a gestionar **infraestructuras locales** con **Ansible** y **Vagrant**.
* Desarrollarán habilidades en **Kubernetes**, **CI/CD**, **Terraform**, y **AWS** (opcional).
* Configurarán y optimizarán **monitoreo** con **Prometheus** y **Grafana**.
* Implementarán **CI/CD** y **infraestructura como código (IaC)** para automatizar despliegues y mejorar la eficiencia operativa.

---

### **Conclusión:**

Este programa de **90 Días de DevOps con Roxs** ofrece una experiencia completa y práctica para aprender **DevOps** de manera progresiva, con enfoque en herramientas modernas y relevantes para el entorno laboral actual. A través de un único **proyecto real**, los participantes aplicarán lo aprendido en un ciclo continuo de integración, despliegue y monitoreo, con la posibilidad de integrar **AWS** al final.

---

¿Este formato te parece adecuado? ¿Algo más que te gustaría modificar o agregar?
