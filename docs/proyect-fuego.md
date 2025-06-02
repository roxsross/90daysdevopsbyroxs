---
sidebar_position: 3
label: fuego
title: El fuego by Roxs
description: El proyecto
---


### **Estructura del Proyecto:**

![](../static/images/banner/15.png)

El proyecto en el que trabajarás se basa en el repositorio **[roxs-devops-project90](https://github.com/roxsross/roxs-devops-project90)**, un desafío educativo de **DevOps** creado para aprender **contenedorización**, **orquestación**, **automatización**, y **monitoreo**. Este repositorio es una versión mejorada del famoso **Docker Example Voting App** y está adaptado específicamente para el desafío de **90 Días de DevOps**.

![](../static/images/2.png)
![](../static/images/1.png)

### **Arquitectura de la Aplicación:**

Este repositorio incluye una aplicación distribuida compuesta por tres servicios:

1. **Vote**: Un servicio en **Flask** que permite votar (🐱 o 🐶) y publica los votos en **Redis**.
2. **Worker**: Un servicio **Node.js** que consume los votos desde **Redis** y los guarda en **PostgreSQL**.
3. **Result**: Una app en **Node.js** que muestra los resultados en tiempo real usando **WebSockets**.

Esta aplicación será tu base para practicar y aplicar los conceptos que irás aprendiendo. Trabajarás en todos los aspectos de esta app, desde su **dockerización**, **orquestación con Kubernetes**, hasta su **monitoreo con Prometheus y Grafana**.

---

### **¿Por qué sumarte?**

Porque **aprender DevOps no tiene por qué ser aburrido ni costoso**.
En este desafío vas a construir, romper y mejorar una app real... **¡con tus propias manos!**
Con cada semana vas a aprender algo nuevo, y lo más importante: **vas a aplicarlo al instante**.

---

## 🧩 **Arquitectura de la Aplicación**

La aplicación incluye tres servicios clave:

* **Vote**: Flask app para votar.
* **Worker**: Node.js que consume votos y los guarda en **PostgreSQL**.
* **Result**: Node.js que muestra los resultados en tiempo real con WebSockets.

---

## 🛠️ **¿Qué vas a construir?**

A lo largo del programa, vas a encargarte de:

* **Dockerizar los servicios** con tus propios archivos `docker-compose.yml`.
* **Automatizar la configuración** usando **Ansible**.
* **Desplegar todo en local** utilizando el **Terraform Provider Local**.
* **Crear pipelines CI/CD** con **GitHub Actions**.
* **Orquestar la app en Kubernetes**.
* **Monitorear con Prometheus y Grafana**.
* **(Opcional)** Llevarlo a **AWS** (EC2 o EKS).

---

## 🤘 ¿Cómo empiezo?

Cloná el repo y seguí el material semanal en el sitio del programa.

```bash
git clone https://github.com/roxsross/roxs-devops-project90.git
cd roxs-devops-project90
```

El código está listo para que lo personalices, dockerices y automatices.

---

## ⭐ Dale una estrella al repo

Si este proyecto te resulta útil o interesante, ¡no olvides dejarle una estrella en GitHub!  
[⭐ Dale una estrella a roxs-devops-project90](https://github.com/roxsross/roxs-devops-project90)

---

## 🔗 Links Prácticos

- [Repositorio principal](https://github.com/roxsross/roxs-devops-project90)
- [Material semanal del programa](https://90diasdedevops.com/)
- [Comunidad en Discord](https://discord.gg/roxsross)
- [Guía rápida de Docker Compose](https://docs.docker.com/compose/gettingstarted/)
- [Documentación de Ansible](https://docs.ansible.com/)
- [Terraform Provider Local](https://registry.terraform.io/providers/hashicorp/local/latest/docs)
- [Prometheus Getting Started](https://prometheus.io/docs/prometheus/latest/getting_started/)
- [Grafana Getting Started](https://grafana.com/docs/grafana/latest/getting-started/)



## 🔗 Recursos Recomendados

### 🐳 Docker
- [Documentación oficial Docker](https://docs.docker.com/get-started/)
- [Play with Docker](https://labs.play-with-docker.com/)

### ☸️ Kubernetes
- [Aprendé Kubernetes](https://kubernetes.io/learn/)


### ☁️ Terraform
- [Terraform Learn](https://learn.hashicorp.com/collections/terraform/aws-get-started)
- [Terraform Docs](https://developer.hashicorp.com/terraform/docs)

### 📈 Observabilidad
- [Prometheus Docs](https://prometheus.io/docs/introduction/overview/)
- [Grafana Play](https://play.grafana.org/)

### 🤖 CI/CD
- [GitHub Actions](https://docs.github.com/en/actions/quickstart)
- [Guía de GitLab CI/CD](https://docs.gitlab.com/)


**¡Súbete a la zona de peligro 🔥 y empieza a vivir la experiencia de DevOps desde el día uno!**


