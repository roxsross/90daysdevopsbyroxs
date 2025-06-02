---
title: Día 1 - DevOps y la Importancia de Linux
description: Comenzamos el camino DevOps
sidebar_position: 1
---

# Bienvenido al Día 1 de la serie "DevOps en 90 Días con Roxs"  

![](../../static/images/banner/1.png)

Este artículo hablará sobre la importancia de **DevOps** y **Linux** en el mundo del desarrollo y operaciones.  

## 🔥 ¿Qué es DevOps?  

¡Imagínate esto! Tienes un equipo grande trabajando en un videojuego:  
- Algunos se encargan de que el juego se vea genial y funcione bien (los *desarrolladores*).  
- Otros aseguran que el juego corra sin problemas en todas las computadoras (los *operadores*).  

En el pasado, estos equipos trabajaban separados, casi sin comunicarse. Pero **DevOps** es como decir:  

> *"Oigan, ¿por qué no trabajamos juntos desde el principio?"*  

Con DevOps, los equipos colaboran, comparten ideas y usan herramientas para que todo sea **más rápido, estable y divertido**. 🚀  

---

## 🌟 Beneficios de la Cultura DevOps  

✅ **Entrega más rápida**: Automatización = menos errores y actualizaciones en minutos.  
✅ **Mejor calidad**: Pruebas continuas = menos bugs en producción.  
✅ **Sistemas más estables**: Monitoreo automático = menos caídas.  
✅ **Más innovación**: Ciclos cortos = experimentar sin miedo.  
✅ **Mejor colaboración**: Todos comparten responsabilidades.  

---

## 🐧 ¿Por qué Linux es CLAVE en DevOps?  

**Respuesta corta**: *"¿Cómo sobrevivirías sin aire y agua?"* 💡  

Linux es el **corazón de DevOps** y del mundo IT. Casi el **90% de los servidores en producción usan Linux**.  

### 🔥 Razones por las que Linux DOMINA en DevOps:  

1. **El rey de los servidores**:  
   - AWS, Google Cloud, Azure… todos usan Linux por defecto.  
   - Si no sabes Linux, estás en problemas.  

2. **Open-Source = Libertad**:  
   - Docker, Kubernetes, Jenkins, Ansible… ¡funcionan mejor en Linux!  

3. **Terminal = Poder**:  
   - Automatiza TODO con Bash (`grep`, `awk`, `cron`, etc.).  

4. **Contenedores = Linux**:  
   - Docker usa el kernel de Linux para crear contenedores.  
   - Kubernetes prefiere Linux.  

5. **Seguridad de alto nivel**:  
   - Permisos, SELinux, iptables… Linux es un *fuerte digital*.  

6. **La nube ama Linux**:  
   - Terraform, Ansible y otros tools de IaC funcionan mejor aquí.  

---

## 🛠️ Herramientas DevOps que AMAN Linux  

| Herramienta       | ¿Por qué necesita Linux?                          |  
|-------------------|--------------------------------------------------|  
| **Docker**        | Usa el kernel de Linux para contenedores.         |  
| **Kubernetes**    | Corre nativamente en Linux.                      |  
| **Terraform**     | Gestiona infraestructura en la nube (Linux-based).|  
| **Ansible**       | Automatiza servidores (SSH + Python = Linux).     |  
| **Jenkins**       | CI/CD más eficiente en Linux.                    |  

---

## 📌 ¿Por qué todo DevOps Engineer DEBE aprender Linux?  

- **Domina la terminal**: El 80% del trabajo DevOps es en CLI.  
- **Automatiza con Bash**: Scripts = menos trabajo manual.  
- **Entiende contenedores**: Sin Linux, no hay Docker/Kubernetes.  
- **Control total**: Personaliza servidores como quieras.  

---

## 📚 Tarea Opcional del Día 1

> 💬 *“La mejor forma de aprender DevOps… es haciéndolo.”*

Te propongo algunos ejercicios prácticos para que pongas en acción lo aprendido hoy:

### 1. 🧠 Reflexión Personal

* Escribí en un archivo `.md`:
  👉 ¿Qué significa DevOps para vos después de esta lección?
  👉 ¿Qué herramientas ya conocías y cuáles son nuevas?

### 2. 🖥️ Primeros Pasos en Linux

* Si estás en Windows, instalá [WSL2 (Windows Subsystem for Linux)](https://learn.microsoft.com/es-es/windows/wsl/install).
* Si estás en Mac, abrí la terminal y ejecutá:

  ```bash
  uname -a
  ```
* Probá estos comandos básicos:

  ```bash
  whoami
  pwd
  ls -lah
  mkdir devops-d1
  cd devops-d1
  echo "Hola DevOps" > hola.txt
  cat hola.txt
  ```
* Tambien puedes probar las opciones de terminal online en DevOps-Tools

### 3. 🎯 Desafío: ¡Linux Detectives!

Usando solo comandos en la terminal, respondé estas preguntas:

* ¿Cuánto tiempo lleva encendido tu sistema?

  ```bash
  uptime
  ```
* ¿Qué procesos están consumiendo más recursos?

  ```bash
  top
  ```
* ¿Cuánta memoria disponible tenés?

  ```bash
  free -h
  ```

### 4. 📺 Recurso recomendado

* Mirá este video explicativo de DevOps (elige uno corto y dinámico):
  👉 [¿Qué es DevOps?](https://www.youtube.com/watch?v=_I94-tJlovg)

### 5. 💬 Compartí tus avances

* Subí una captura de tu terminal al canal de la comunidad o en redes usando el hashtag:
  **#DevOpsConRoxs**
  *(¡siempre se aprende más compartiendo!)*

---
