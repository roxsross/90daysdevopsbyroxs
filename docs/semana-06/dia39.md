---
title: Día 39 - Introducción a Helm
description: Primeros pasos con Helm ¿qué es, para qué sirve y cómo empezar a usarlo?
sidebar_position: 9
---

## 🚀 Helm: Tu Primer Chart

![](../../static/images/banner/6.png)

> “Helm es el gestor de paquetes de Kubernetes: te ayuda a instalar, actualizar y compartir aplicaciones fácilmente.”

Hoy vas a:

- Entender qué es Helm y para qué se usa
- Instalar Helm en tu máquina
- Crear tu primer chart
- Desplegar una app en Kubernetes usando Helm

---

## 🎯 Objetivo

- Comprender el rol de Helm en Kubernetes
- Instalar y configurar Helm
- Crear y desplegar un chart básico

---

## 🛠️ Paso 1: ¿Qué es Helm?

Helm es una herramienta que facilita la gestión de aplicaciones en Kubernetes mediante “charts”, que son paquetes preconfigurados listos para instalar.

- Simplifica despliegues complejos
- Permite reutilizar configuraciones
- Facilita upgrades y rollbacks

---

## ⚡ Paso 2: Instalá Helm

**En Mac:**

```bash
brew install helm
```

**En Linux:**

```bash
curl https://raw.githubusercontent.com/helm/helm/main/scripts/get-helm-3 | bash
```

Verificá la instalación:

```bash
helm version
```

---

## 📦 Paso 3: Tu primer chart

Crea un nuevo chart:

```bash
helm create mi-primer-chart
```

Esto genera una estructura con archivos y templates listos para usar.

---

## 🚀 Paso 4: Desplegá con Helm

Instalá tu chart en Kubernetes:

```bash
helm install mi-app ./mi-primer-chart
```

Verificá el release:

```bash
helm list
```

---

## 🧪 Tarea del Día

1. Instalar Helm en tu entorno
2. Crear un chart básico
3. Desplegarlo en tu clúster
4. Probar `helm list` y `helm uninstall`

🎁 Bonus: Explorá los archivos generados por `helm create`

---

## 🧠 Revisión rápida

| Pregunta                                 | ✔️ / ❌ |
| ---------------------------------------- | ------ |
| ¿Qué es un chart en Helm?                |        |
| ¿Cómo instalás Helm?                     |        |
| ¿Qué comando crea un chart nuevo?        |        |
| ¿Cómo eliminás un release?               |        |

---

## ✨ Cierre del Día

¡Listo! Hoy diste tus primeros pasos con Helm y ya podés gestionar aplicaciones en Kubernetes de forma más simple y ordenada. Mañana veremos cómo personalizar y compartir tus charts. 🚀

Nos vemos en el **Día 40** 🧙‍♂️

