---
title: Día 46 - Seguridad con Dockerfile y Dependencias
description: Aplicá buenas prácticas de seguridad en tus contenedores y mejorá tu Dockerfile
sidebar_position: 4
---

## 🛡️ Seguridad con Dockerfile y Dependencias

![](../../static/images/banner/7.png)

Es momento de revisar cómo construimos nuestras imágenes.  
Porque un `Dockerfile` mal hecho puede ser la puerta de entrada a muchos problemas:

- Imágenes enormes
- Software vulnerable
- Permisos excesivos
- Dependencias innecesarias

Hoy vas a aprender a mejorar tu Dockerfile y a reducir los riesgos. 🚀

---

## 🔎 Problemas comunes en Dockerfiles

| ❌ Malas prácticas                          | ✅ Buenas prácticas                                 |
|--------------------------------------------|----------------------------------------------------|
| Usar `latest`                              | Fijar versiones específicas (`python:3.12-slim`)   |
| Ejecutar como `root`                       | Usar `USER appuser`                                |
| Muchas capas innecesarias                  | Unificar comandos con `&&`                         |
| No eliminar caché o dependencias de build  | Borrar archivos temporales                         |
| Copiar todo indiscriminadamente            | Copiar solo lo necesario (`COPY requirements.txt`) |
| No definir `HEALTHCHECK`                   | Agregar chequeos de salud                          |

---

## 🧪 Caso real: Mejorando el Dockerfile del voting-app

### 🧼 Dockerfile inseguro (ejemplo inicial)

```Dockerfile
FROM python:3.12

WORKDIR /app

COPY . .

RUN pip install -r requirements.txt

CMD ["python", "app.py"]
````

### 🔐 Dockerfile mejorado

```Dockerfile
FROM python:3.12-slim

WORKDIR /app

# Copiar solo lo necesario primero para aprovechar cacheo
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copiar solo después el resto del código
COPY . .

# Crear y usar usuario no root
RUN useradd -m appuser
USER appuser

EXPOSE 5000

CMD ["python", "app.py"]
```

---

## 📌 Extra: Agregá un `HEALTHCHECK`

```Dockerfile
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s \
  CMD curl -f http://localhost:5000/ || exit 1
```

---

## 🐍 Revisión de dependencias

Si usás Python:

```bash
# Ver vulnerabilidades conocidas en requirements.txt
trivy fs --scanners vuln,secret --severity HIGH,CRITICAL .
```

Si usás Node.js:

```bash
npm audit fix
```

---

## 📝 Tarea del Día

1. ✅ Analizá el Dockerfile de tu `voting-app`
2. ✅ Aplicá al menos 4 mejoras de seguridad (basado en la tabla de arriba)
3. ✅ Agregá un `HEALTHCHECK` al contenedor
4. ✅ Subí el nuevo Dockerfile a tu repo y generá una nueva imagen
5. ✅ Escaneá nuevamente con Trivy para verificar mejoras
6. 📸 Compartí un "ANTES y DESPUÉS" de tu Dockerfile usando el hashtag
   `#DockerHardeningConRoxs`

---

## 🧠 ¿Qué logramos hoy?

* Reducimos la superficie de ataque
* Mejoramos la performance al achicar la imagen
* Prevenimos problemas antes de que aparezcan

---

## 📚 Recursos Útiles

* 🐳 [Best Practices for Writing Dockerfiles](https://docs.docker.com/develop/develop-images/dockerfile_best-practices/)
* 🔒 [OWASP Docker Top 10](https://owasp.org/www-project-docker-top-10/)
* 📦 [Distroless Images - Google](https://github.com/GoogleContainerTools/distroless)

---

## 🏆 ¡Lo hiciste genial!

Hoy hiciste algo que **muchos Devs olvidan**: revisar y reforzar la base de tus contenedores.
Y eso... 🔥 ¡te convierte en alguien que construye con conciencia!

**Mañana nos metemos de lleno en troubleshooting de contenedores.**

💥 ¡Nos vemos en el Día 47!

