---
title: Día 13 - Docker Compose
description: MultiAplicaciones con docker-compose 
sidebar_position: 6

---

## 🧩 El futuro de las multiaplicaciones

![](../../static/images/banner/2.png)

Hoy vamos a dominar **Docker Compose**, que viene **integrado con Docker Desktop** y representa el estándar actual para gestionar aplicaciones multicontenedor. ¡Olvídate de los comandos complejos y las configuraciones tediosas!

---

## 🆕 ¿Qué hay de nuevo en Docker Compose?

**Docker Compose V2** está escrito en Go (vs Python en v1) y trae:
- ⚡ **Performance mejorada** - Hasta 3x más rápido
- 🔧 **Integración nativa** con Docker Desktop
- 🎯 **Nuevo comando:** `docker compose` (sin guión)
- 📦 **Sin instalación separada** - Ya viene con Docker Desktop
- 🚀 **Mejor manejo de dependencias** y redes

> 💡 **Nota importante:** El comando cambió de `docker-compose` a `docker compose` (sin guión)

---

## 📋 Verificando tu instalación

```bash
# Verificar Docker Desktop y Compose V2
docker --version
docker compose version

# Deberías ver algo como:
# Docker Compose version v2.24.x
```

---

## 🏗️ Anatomía moderna del docker-compose.yml

```yaml
# ✅ SIN version: - Docker Compose V2 detecta automáticamente la mejor versión
services:
  frontend:
    build: 
      context: ./frontend
      dockerfile: Dockerfile
    ports:
      - "3000:3000"
    environment:
      - REACT_APP_API_URL=http://localhost:8000
    depends_on:
      - backend
    networks:
      - app-network
    restart: unless-stopped

  db:
    image: mongo:7-jammy
    ports:
      - "27017:27017"
    environment:
      - MONGO_INITDB_ROOT_USERNAME=admin
      - MONGO_INITDB_ROOT_PASSWORD=password123
    volumes:
      - mongo_data:/data/db
    networks:
      - app-network
    healthcheck:
      test: ["CMD", "mongosh", "--eval", "db.adminCommand('ping')"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s
    restart: unless-stopped

networks:
  app-network:
    driver: bridge
    name: mi-app-network

volumes:
  mongo_data:
    driver: local
    name: mi-app-mongo-data
```

Este archivo `docker-compose.yml` define y configura servicios de contenedores Docker para facilitar el despliegue y la orquestación de aplicaciones. Permite levantar múltiples servicios, especificar redes, volúmenes y variables de entorno, simplificando el desarrollo y la administración de entornos multi-contenedor.

### Propiedades principales del docker-compose.yml

- **services:**  
  Define los servicios (contenedores) que forman tu aplicación. Cada clave bajo `services` es un servicio independiente.

  - **frontend:**  
    Servicio para la aplicación frontend (por ejemplo, React).
    - `build`:  
      - `context`: Carpeta donde está el código fuente a construir.
      - `dockerfile`: Archivo Dockerfile a usar para construir la imagen.
    - `ports`:  
      - `"3000:3000"`: Expone el puerto 3000 del contenedor al 3000 de tu máquina.
    - `environment`:  
      - Variables de entorno para el contenedor (ejemplo: URL de la API).
    - `depends_on`:  
      - Indica que este servicio depende de que otro (ej: backend) esté listo antes de iniciar.
    - `networks`:  
      - Redes a las que se conecta el servicio.
    - `restart`:  
      - Política de reinicio automático si el contenedor se detiene.

  - **db:**  
    Servicio para la base de datos MongoDB.
    - `image`:  
      - Imagen de Docker a usar (ej: mongo:7-jammy).
    - `ports`:  
      - `"27017:27017"`: Expone el puerto estándar de MongoDB.
    - `environment`:  
      - Variables de entorno para inicializar MongoDB (usuario y contraseña).
    - `volumes`:  
      - Monta un volumen persistente para los datos de la base.
    - `networks`:  
      - Redes a las que se conecta el servicio.
    - `healthcheck`:  
      - Prueba periódica para verificar que MongoDB está listo y responde.
    - `restart`:  
      - Política de reinicio automático.

- **networks:**  
  Define redes personalizadas para aislar y conectar servicios entre sí.

- **volumes:**  
  Define volúmenes persistentes para que los datos no se pierdan si el contenedor se elimina.

---

> 💡 **Tip:**  
> Estas propiedades permiten definir, conectar y administrar fácilmente múltiples servicios y recursos en un solo archivo, facilitando el despliegue y la gestión de aplicaciones complejas.


Para profundizar más y consultar todas las opciones disponibles, revisa la documentación oficial:

- [Guía de Docker Compose](https://docs.docker.com/compose/)
- [Referencia de docker-compose.yml](https://docs.docker.com/compose/compose-file/)
- [Comandos de Docker Compose](https://docs.docker.com/engine/reference/commandline/compose/)


---

## 🚀 Comandos esenciales de Docker Compose V2

### Comandos básicos
```bash
# Levantar todos los servicios
docker compose up

# Modo detached (en segundo plano)
docker compose up -d

# Reconstruir imágenes antes de levantar
docker compose up --build

# Levantar servicios específicos
docker compose up frontend backend

# Ver estado de servicios
docker compose ps

# Ver logs en tiempo real
docker compose logs -f

# Ver logs de un servicio específico
docker compose logs -f backend

# Parar servicios sin eliminar contenedores
docker compose stop

# Parar y eliminar contenedores, redes y volúmenes anónimos
docker compose down

# Eliminar también volúmenes nombrados
docker compose down --volumes

# Eliminar todo incluyendo imágenes
docker compose down --rmi all --volumes
```

### Comandos avanzados
```bash
# Ejecutar comandos en servicios corriendo
docker compose exec backend npm run test
docker compose exec db mongosh

# Ejecutar comandos sin servicio corriendo
docker compose run --rm backend npm install

# Escalar servicios (crear múltiples instancias)
docker compose up --scale backend=3

# Ver configuración parseada
docker compose config

# Validar archivo compose
docker compose config --quiet

# Reiniciar servicios específicos
docker compose restart nginx

# Ver uso de recursos
docker compose top
```

---

### Probemos un WordPress con Docker Compose

```yaml
# docker-compose.yml - WordPress Moderno con Docker Compose V2+
services:
  wordpress:
    image: wordpress:php8.2-apache
    container_name: wp-web
    restart: unless-stopped
    ports:
      - "8080:80"
    environment:
      WORDPRESS_DB_HOST: db
      WORDPRESS_DB_USER: wpuser
      WORDPRESS_DB_PASSWORD: wppass123
      WORDPRESS_DB_NAME: wpdb
    volumes:
      - wp_data:/var/www/html
      - ./wp-content:/var/www/html/wp-content  # Para desarrollo personalizado
    depends_on:
      db:
        condition: service_healthy
    networks:
      - wp_network

  db:
    image: mariadb:11.3
    container_name: wp-db
    restart: unless-stopped
    environment:
      MYSQL_ROOT_PASSWORD: rootpass123
      MYSQL_DATABASE: wpdb
      MYSQL_USER: wpuser
      MYSQL_PASSWORD: wppass123
    volumes:
      - db_data:/var/lib/mysql
    healthcheck:
      test: ["CMD", "mysqladmin", "ping", "-h", "localhost"]
      interval: 5s
      timeout: 5s
      retries: 5
    networks:
      - wp_network

  phpmyadmin:
    image: phpmyadmin:latest
    container_name: wp-admin
    restart: unless-stopped
    ports:
      - "8081:80"
    environment:
      PMA_HOST: db
      PMA_USER: wpuser
      PMA_PASSWORD: wppass123
    depends_on:
      - db
    networks:
      - wp_network

volumes:
  wp_data:
  db_data:

networks:
  wp_network:
    driver: bridge
```

### 🔥 Características clave:
1. **Stack Completo**:
   - WordPress (última versión PHP 8.2)
   - MariaDB 11.3 (alternativa óptima a MySQL)
   - phpMyAdmin para gestión de bases de datos

2. **Buenas Prácticas**:
   - ✅ Volúmenes persistentes para datos y DB
   - ✅ Healthcheck en MariaDB
   - ✅ Variables de entorno separadas
   - ✅ Red aislada para seguridad

3. **Configuración para Desarrollo**:
   - Mapeo directo de `wp-content` para temas/plugins
   - Puertos accesibles:
     - WordPress: `http://localhost:8080`
     - phpMyAdmin: `http://localhost:8081`

### 🚀 Cómo usarlo:
1. Crea un directorio y guarda el archivo como `docker-compose.yml`
2. Ejecuta:
   ```bash
   docker compose up -d
   ```
3. Accede a WordPress en tu navegador y completa la instalación.

### 📌 Notas importantes:
- **Seguridad en Producción**:
  - Cambia todas las contraseñas
  - Usa secrets para las credenciales:
    ```yaml
    secrets:
      db_password:
        file: ./secrets/db_password.txt
    ```
- **Performance**:
  - Para alta demanda, añade:
    ```yaml
    wordpress:
      deploy:
        resources:
          limits:
            cpus: '1'
            memory: 512M
    ```

### 🛠️ Comandos útiles:
| Comando | Descripción |
|---------|-------------|
| `docker compose logs -f wordpress` | Ver logs en tiempo real |
| `docker compose exec db mysql -u wpuser -p` | Acceder a MySQL CLI |
| `docker compose down --volumes` | Borrar TODO (incluyendo datos) |


---

## 🔧 Trucos y mejores prácticas

### 1. Healthchecks inteligentes
```yaml
services:
  api:
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000/health"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 60s
```

### 2. Depends_on con condiciones
```yaml
services:
  app:
    depends_on:
      db:
        condition: service_healthy
      redis:
        condition: service_started
```

### 3. Variables de entorno avanzadas
```yaml
services:
  app:
    environment:
      - NODE_ENV=${NODE_ENV:-development}
      - PORT=${APP_PORT:-3000}
      - DATABASE_URL=${DATABASE_URL:?error}  # Obligatoria
```

### 4. Extensión de configuraciones
```yaml
# docker-compose.yml
services:
  app: &app
    build: .
    environment:
      - NODE_ENV=production

# docker-compose.override.yml (para desarrollo)
services:
  app:
    <<: *app
    environment:
      - NODE_ENV=development
    volumes:
      - .:/app
```

---

## 🚨 Debugging y troubleshooting

### Comandos útiles para debugging
```bash
# Ver configuración final parseada
docker compose config

# Inspeccionar redes
docker network ls
docker network inspect mern-app-network

# Ver volúmenes
docker volume ls
docker volume inspect mern-mongo-data

# Logs detallados con timestamps
docker compose logs -f --timestamps

# Ver procesos dentro de contenedores
docker compose top

# Estadísticas de uso
docker stats $(docker compose ps -q)

# Acceder a shell de contenedor
docker compose exec backend bash
docker compose exec db mongosh
```

### Problemas comunes y soluciones

**1. Puerto ya en uso:**
```bash
# Ver qué proceso usa el puerto
lsof -i :3000
# Cambiar puerto en .env o docker-compose.yml
```

**2. Problemas de red:**
```bash
# Recrear redes
docker compose down
docker network prune
docker compose up
```

**3. Volúmenes corruptos:**
```bash
# Limpiar volúmenes
docker compose down --volumes
docker volume prune
```

---

## ✅ Tarea Práctica: Aplicación Node.js + MongoDB con Docker Compose**  

Implementar una aplicación Node.js con MongoDB usando Docker Compose, asegurando persistencia de datos y conexión entre servicios.  

---

### **📌 Parte 1: Configuración Básica**  
1. **Estructura del proyecto**:  
   ```bash
   mkdir node-mongo-app && cd node-mongo-app
   mkdir backend
   touch backend/{server.js,package.json,Dockerfile} docker-compose.yml
   ```

2. **Archivos base**:  
   - `backend/server.js` (API simple):  
     ```javascript
     const express = require('express');
     const mongoose = require('mongoose');
     const app = express();
     
     mongoose.connect('mongodb://db:27017/mydb');
     
     app.get('/', (req, res) => {
       res.send('¡API conectada a MongoDB con Docker!');
     });
     
     app.listen(3000, () => console.log('Server running on port 3000'));
     ```
   - `backend/Dockerfile`:  
     ```dockerfile
     FROM node:18-alpine
     WORKDIR /app
     COPY package.json .
     RUN npm install
     COPY . .
     CMD ["node", "server.js"]
     ```

3. **docker-compose.yml**:  
   ```yaml
   services:
     backend:
       build: ./backend
       ports:
         - "3000:3000"
       depends_on:
         db:
           condition: service_healthy
     
     db:
       image: mongo:6
       volumes:
         - db_data:/data/db
       healthcheck:
         test: ["CMD", "mongosh", "--eval", "db.adminCommand('ping')"]
         interval: 5s
         timeout: 3s
         retries: 5
   
   volumes:
     db_data:
   ```

---

### **🛠️ Parte 2: Ejecución y Verificación**  
1. **Inicia los servicios**:  
   ```bash
   docker compose up -d
   ```
2. **Prueba la API**:  
   ```bash
   curl http://localhost:3000
   # Deberías ver: "¡API conectada a MongoDB con Docker!"
   ```
3. **Verifica la base de datos**:  
   ```bash
   docker compose exec db mongosh --eval "show dbs"
   ```

---

### **🔐 Parte 3: Persistencia y Debugging**  
1. **Detén y reinicia los contenedores**:  
   ```bash
   docker compose down && docker compose up -d
   ```
2. **Verifica que los datos de MongoDB persistan**:  
   - Crea una colección:  
     ```bash
     docker compose exec db mongosh --eval "db.test.insertOne({name: 'Ejemplo'})"
     ```
   - Reinicia y comprueba que sigue existiendo.  

---

### **💡 Bonus (Avanzado)**  
**Añade un frontend con React**:  
1. Agrega este servicio al `docker-compose.yml`:  
   ```yaml
   frontend:
     image: node:18-alpine
     working_dir: /app
     volumes:
       - ./frontend:/app
     ports:
       - "5173:5173"
     command: ["npm", "run", "dev"]
     depends_on:
       - backend
   ```


---

## 💡 Tips de Roxs 

> **"Docker Compose es como tener un director de orquesta para tus contenedores. Un solo comando y toda tu aplicación cobra vida."**

### Pro Tips:
1. **Usa `.env`** para todo lo configurable
2. **Healthchecks** en servicios críticos
3. **Perfiles** para separar entornos
4. **Nombres explícitos** para redes y volúmenes
5. **El nuevo comando** `docker compose` (sin guión)

---

Usá el hashtag **#DevOpsConRoxs** o compartilo en el canal de la comunidad. 🎯
