¡Me alegra que te guste! Aquí te dejo **el programa completo de 90 días** de **DevOps con Roxs**, con todos los detalles de cada semana, incluyendo los cambios y la integración de **Vagrant** sin Docker en la primera semana. Este programa está diseñado para cubrir todos los aspectos fundamentales de **DevOps** con un enfoque práctico en un **proyecto real** que los estudiantes desarrollarán a lo largo del curso.

---

# **90 Días de DevOps con Roxs: El Camino Completo para Principiantes**

### **Objetivo del Programa:**

El programa **“90 Días de DevOps con Roxs”** está diseñado para enseñar a los principiantes los principios fundamentales de **DevOps** a través de un enfoque práctico. Durante los 90 días, los participantes trabajarán en un **proyecto real** que les permitirá implementar un ciclo completo de **desarrollo, integración, entrega continua (CI/CD)** y **monitoreo** en sus aplicaciones, utilizando herramientas clave como **Docker**, **Kubernetes**, **Terraform**, **Ansible**, **Prometheus**, **Grafana**, y **AWS** (opcional).

---

## **Semana 1-3: Fundamentos de DevOps, Linux y Automización con Vagrant y Ansible**

#### **Semana 1: Introducción a DevOps, Fundamentos de Linux y Levantamiento de Aplicaciones con Vagrant (sin Docker)**

**Objetivo:** Introducir los principios de **DevOps**, aprender a configurar entornos locales con **Vagrant** sin depender de **Docker**, y establecer una base sólida con **Linux** y scripting básico.

##### **Contenido:**

* **Fundamentos de DevOps:**

  * **¿Qué es DevOps?** Principios, beneficios y cultura.
  * **DevOps en el ciclo de vida del software**: planificación, desarrollo, integración, pruebas, despliegue, monitoreo y retroalimentación.
  * **Integración continua (CI)** y **entrega continua (CD)** en el ciclo de vida del software.

* **Fundamentos de Linux:**

  * **Comandos básicos en Linux**: `ls`, `cd`, `chmod`, `top`, `ps`, etc.
  * **Scripting en Bash** para automatización de tareas en Linux.

* **Levantar Aplicaciones con Vagrant (sin Docker):**

  * **Vagrant**: Instalación de **Vagrant** y **VirtualBox** para crear y gestionar entornos virtualizados.
  * **Automatización con Vagrant**: Usar **Vagrant** para levantar un entorno de desarrollo básico sin **Docker**.
  * **Automatización con Ansible**: Instalación de **Ansible** y creación de **Playbooks** para automatizar la configuración (instalar dependencias, configurar red, etc.).

##### **Proyecto de la Semana:**

* **Levantamiento de la Aplicación Localmente con Vagrant**:

  * Crear una máquina virtual con **Vagrant** y configurarla para levantar una aplicación básica (por ejemplo, **Flask** o **Node.js**).
  * Usar **Ansible** para automatizar la instalación de las dependencias necesarias y la configuración de la máquina virtual.

---

#### **Semana 2: Dockerización de la Aplicación y Orquestación con Docker Compose**

**Objetivo:** Dockerizar la aplicación y aprender a usar **Docker Compose** para gestionar múltiples contenedores.

##### **Contenido:**

* **Docker:**

  * Instalación y configuración de **Docker Desktop**.
  * Creación de un **Dockerfile** para dockerizar una aplicación web (ej. **Flask** o **Node.js**).
* **Docker Compose:**

  * Uso de **Docker Compose** para gestionar múltiples contenedores (por ejemplo, backend + base de datos).
  * Conexión de servicios mediante redes Docker personalizadas.

##### **Proyecto de la Semana:**

* Dockerizar una aplicación web y sus dependencias (base de datos, backend) y configurarlas mediante **Docker Compose**.

---

#### **Semana 3: CI/CD con GitHub Actions y Self-Hosted Runner**

**Objetivo:** Integrar **GitHub Actions** en un **self-hosted runner** para automatizar la construcción y despliegue de la aplicación.

##### **Contenido:**

* **GitHub Actions:**

  * Configuración básica de **GitHub Actions** en un repositorio de GitHub.
  * Creación de un **self-hosted runner** para ejecutar los workflows de CI/CD en tu propia máquina local.
* **CI/CD con GitHub Actions:**

  * Creación de pipelines de **CI/CD** con **GitHub Actions** para construir, probar y desplegar automáticamente la aplicación.

##### **Proyecto de la Semana:**

* Configurar un **self-hosted runner** en tu máquina local y crear un pipeline de **GitHub Actions** para automatizar la construcción y el despliegue de la aplicación.

---

## **Semana 4-6: Terraform, Kubernetes y CI/CD**

#### **Semana 4: Introducción a Terraform con Provider Local**

**Objetivo:** Introducir a los participantes en **Terraform** y enseñarles a gestionar infraestructura local.

##### **Contenido:**

* **Terraform:**

  * Fundamentos de **Terraform**: ¿Qué es y cómo usarlo?
  * Uso del **provider local** de Terraform para crear infraestructura local (archivos, directorios, recursos locales).
* **Automatización local** de recursos como archivos de configuración o scripts utilizando Terraform.

##### **Proyecto de la Semana:**

* Crear un archivo **main.tf** para definir infraestructura local (por ejemplo, directorios o archivos de configuración) usando el **provider local** de **Terraform**.

---

#### **Semana 5: Introducción a Kubernetes y Despliegue Local**

**Objetivo:** Configurar un clúster de **Kubernetes** local y aprender a desplegar aplicaciones.

##### **Contenido:**

* Instalación de **Minikube** o **Docker Desktop** para crear un clúster **Kubernetes** local.
* Fundamentos de **Kubernetes**: Pods, Deployments, Services.

##### **Proyecto de la Semana:**

* Crear y desplegar una aplicación en un clúster **Kubernetes** local usando **Minikube** o **Docker Desktop**.

---

#### **Semana 6: CI/CD con GitHub Actions y Despliegue en Kubernetes**

**Objetivo:** Configurar **CI/CD** para despliegue automático en **Kubernetes**.

##### **Contenido:**

* Crear un pipeline CI/CD que se integre con **Kubernetes** para despliegue automático.
* Uso de **Helm** para gestionar los despliegues en Kubernetes.

##### **Proyecto de la Semana:**

* Mejorar el pipeline CI/CD para que automatice el despliegue en **Kubernetes** y configure el monitoreo en el clúster con **Prometheus** y **Grafana**.

---

## **Semana 7-9: Seguridad, Troubleshooting y Despliegue en AWS (Opcional)**

#### **Semana 7: Seguridad en Kubernetes**

**Objetivo:** Implementar buenas prácticas de seguridad en **Kubernetes**.

##### **Contenido:**

* Configuración de **autoscaling** con **Horizontal Pod Autoscaler (HPA)**.
* Configuración de seguridad con **RBAC** y **Secrets** en **Kubernetes**.

##### **Proyecto de la Semana:**

* Configurar **autoscaling** y **RBAC** en el clúster de **Kubernetes** para mejorar la seguridad y escalabilidad.

---

#### **Semana 8: Troubleshooting y Optimización de Kubernetes**

**Objetivo:** Diagnosticar y solucionar problemas en el clúster **Kubernetes**.

##### **Contenido:**

* Uso de **kubectl** para depurar aplicaciones y contenedores en **Kubernetes**.
* Optimización del uso de recursos en **Kubernetes** (memoria, CPU, etc.).

##### **Proyecto de la Semana:**

* Solucionar problemas comunes en el despliegue de la aplicación en **Kubernetes** (problemas de recursos, fallos en pods).
* Optimizar la infraestructura de **Kubernetes**.

---

#### **Semana 9: Despliegue en la Nube con AWS (Opcional)**

**Objetivo:** Desplegar la aplicación en **AWS** utilizando **EC2** o **EKS**.

##### **Contenido:**

* Introducción a **AWS**: Creación de cuenta, uso de **EC2** y **EKS**.
* Despliegue de la aplicación en **AWS EC2** o en **Amazon EKS**.

##### **Proyecto Opcional:**

* Desplegar la aplicación en **AWS EC2** o usar **Amazon EKS** para gestionar el clúster de **Kubernetes** en la nube.

---

## **Semana 10-12: Terraform, Optimización y Bonus AWS (Opcional)**

#### **Semana 10: Terraform para Infraestructura como Código**

**Objetivo:** Gestionar infraestructura en **AWS** utilizando **Terraform**.

##### **Contenido:**

* Introducción al **provider AWS** de **Terraform**.
* Creación de infraestructura en **AWS**: **EC2**, **RDS**, **EKS** usando **Terraform**.

##### **Proyecto de la Semana:**

* Crear y gestionar la infraestructura en **AWS** (EC2, RDS) utilizando **Terraform**.

---

#### **Semana 11: Despliegue Completo con CI/CD en AWS**

**Objetivo:** Automatizar el despliegue en **AWS** utilizando **Terraform** y **CI/CD**.

##### **Contenido:**

* Crear un pipeline **CI/CD** para desplegar la aplicación en **AWS EC2** o **EKS**.
* Integración de **Terraform** con **AWS CodePipeline** o **GitHub Actions**.

##### **Proyecto de la Semana:**

* Automatizar el despliegue de la aplicación en **AWS** utilizando **Terraform** y un pipeline CI/CD.

---

#### **Semana 12: Seguridad Final y Optimización**

**Objetivo:** Revisión final de seguridad y optimización.

##### **Contenido:**

* Revisión de **seguridad** en **AWS** y **Kubernetes**.
* Optimización de los costos y rendimiento en **AWS** utilizando **Auto Scaling**, **RDS**, **EKS**.

##### **Proyecto Final:**

* Implementar seguridad avanzada en **AWS** y **Kubernetes**.
* Realizar una revisión final del proyecto y entrega del informe.

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

Este programa de **90 Días de DevOps con Roxs** proporciona una experiencia intensiva y práctica en DevOps, cubriendo desde el desarrollo local hasta el despliegue en la nube con **Kubernetes** y **AWS**. Los participantes aprenderán herramientas fundamentales como **Docker**, **Kubernetes**, **Terraform**, **Ansible**, y **GitHub Actions**, mientras trabajan en un **proyecto real** que integra todos los conceptos que van aprendiendo semana a semana.

---

**¡Este es el momento perfecto para comenzar a aprender DevOps de la mano de Roxs!** ¿Te gustaría ajustar algo más en el programa o agregar más detalles?
