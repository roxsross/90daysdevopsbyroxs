---
title: Día 19 - Deploy con GitHub Actions
description: Aprender desplegar con Docker Compose y Self-hosted Runners
sidebar_position: 5
---

# Deployment con Docker Compose y Self-hosted Runners

![](../../static/images/banner/3.png)

### Docker Compose para Deployment
Docker Compose es perfecto para:
- **Aplicaciones multi-contenedor**: App + Base de datos + Cache
- **Entornos de desarrollo y staging**: Fácil de replicar
- **Deployment simple**: Un solo comando para todo
- **Gestión de redes**: Contenedores se comunican automáticamente

### Componentes Básicos de una App Web

1. **Aplicación Web** (Node.js, Python, etc.)
2. **Base de Datos** (PostgreSQL, MySQL, MongoDB)
3. **Cache** (Redis)
4. **Reverse Proxy** (Nginx)
5. **Volúmenes** para persistencia de datos

### Ambientes de Deployment
- **Development**: En tu máquina local
- **Staging**: En el self-hosted runner para pruebas
- **Production**: En el servidor de producción

## 🛠️ Práctica

### Ejercicio 1: Aplicación Full-Stack con Docker Compose

1. **Estructura del proyecto**
   ```
   mi-app/
   ├── app/
   │   ├── package.json
   │   ├── index.js
   │   └── Dockerfile
   ├── nginx/
   │   └── nginx.conf
   ├── docker-compose.yml
   ├── docker-compose.staging.yml
   ├── docker-compose.prod.yml
   └── .env.example
   ```

2. **Aplicación Node.js simple**

   `app/package.json`:
   ```json
   {
     "name": "mi-app-devops",
     "version": "1.0.0",
     "description": "App de ejemplo con Docker Compose",
     "main": "index.js",
     "scripts": {
       "start": "node index.js",
       "dev": "nodemon index.js"
     },
     "dependencies": {
       "express": "^4.18.2",
       "pg": "^8.11.3",
       "redis": "^4.6.8"
     }
   }
   ```

   `app/index.js`:
   ```javascript
   const express = require('express');
   const { Client } = require('pg');
   const redis = require('redis');

   const app = express();
   const PORT = process.env.PORT || 3000;

   // Configuración de PostgreSQL
   const pgClient = new Client({
     host: process.env.DB_HOST || 'postgres',
     port: process.env.DB_PORT || 5432,
     database: process.env.DB_NAME || 'miapp',
     user: process.env.DB_USER || 'postgres',
     password: process.env.DB_PASSWORD || 'password123'
   });

   // Configuración de Redis
   const redisClient = redis.createClient({
     host: process.env.REDIS_HOST || 'redis',
     port: process.env.REDIS_PORT || 6379
   });

   app.use(express.json());

   // Endpoint de salud
   app.get('/health', async (req, res) => {
     try {
       // Verificar conexión a PostgreSQL
       await pgClient.query('SELECT 1');
       
       // Verificar conexión a Redis
       await redisClient.ping();
       
       res.json({ 
         status: 'OK', 
         timestamp: new Date(),
         services: {
           database: 'connected',
           cache: 'connected'
         }
       });
     } catch (error) {
       res.status(500).json({ 
         status: 'ERROR', 
         error: error.message 
       });
     }
   });

   // Endpoint principal
   app.get('/', (req, res) => {
     res.json({
       message: '¡Hola DevOps con Rox! 🚀',
       environment: process.env.NODE_ENV || 'development',
       version: '1.0.0'
     });
   });

   // Endpoint para contador (usando Redis)
   app.get('/contador', async (req, res) => {
     try {
       const count = await redisClient.incr('visitas');
       res.json({ visitas: count });
     } catch (error) {
       res.status(500).json({ error: error.message });
     }
   });

   // Endpoint para usuarios (usando PostgreSQL)
   app.get('/usuarios', async (req, res) => {
     try {
       const result = await pgClient.query('SELECT * FROM usuarios LIMIT 10');
       res.json(result.rows);
     } catch (error) {
       res.status(500).json({ error: error.message });
     }
   });

   // Inicializar conexiones y servidor
   async function start() {
     try {
       await pgClient.connect();
       await redisClient.connect();
       
       // Crear tabla de usuarios si no existe
       await pgClient.query(`
         CREATE TABLE IF NOT EXISTS usuarios (
           id SERIAL PRIMARY KEY,
           nombre VARCHAR(100),
           email VARCHAR(100),
           created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
         )
       `);

       // Insertar datos de ejemplo
       await pgClient.query(`
         INSERT INTO usuarios (nombre, email) 
         VALUES ('DevOps Rox', 'devops@rox.com')
         ON CONFLICT DO NOTHING
       `);

       app.listen(PORT, () => {
         console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
       });
     } catch (error) {
       console.error('Error al iniciar:', error);
       process.exit(1);
     }
   }

   start();
   ```

   `app/Dockerfile`:
   ```dockerfile
   FROM node:18-alpine

   WORKDIR /app

   # Copiar archivos de dependencias
   COPY package*.json ./

   # Instalar dependencias
   RUN npm ci --only=production

   # Copiar código fuente
   COPY . .

   # Crear usuario no-root
   RUN addgroup -g 1001 -S nodejs && \
       adduser -S nodejs -u 1001

   # Cambiar ownership
   RUN chown -R nodejs:nodejs /app
   USER nodejs

   # Exponer puerto
   EXPOSE 3000

   # Health check
   HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
     CMD node -e "require('http').get('http://localhost:3000/health', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) })" || exit 1

   # Comando de inicio
   CMD ["npm", "start"]
   ```

3. **Configuración de Nginx**

   `nginx/nginx.conf`:
   ```nginx
   events {
       worker_connections 1024;
   }

   http {
       upstream app {
           server app:3000;
       }

       server {
           listen 80;
           server_name localhost;

           # Logs
           access_log /var/log/nginx/access.log;
           error_log /var/log/nginx/error.log;

           # Proxy para la aplicación
           location / {
               proxy_pass http://app;
               proxy_set_header Host $host;
               proxy_set_header X-Real-IP $remote_addr;
               proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
               proxy_set_header X-Forwarded-Proto $scheme;
           }

           # Endpoint de salud para Nginx
           location /nginx-health {
               access_log off;
               return 200 "healthy\n";
               add_header Content-Type text/plain;
           }
       }
   }
   ```

4. **Docker Compose para desarrollo**

   `docker-compose.yml`:
   ```yaml
   version: '3.8'

   services:
     app:
       build: ./app
       ports:
         - "3000:3000"
       environment:
         - NODE_ENV=development
         - DB_HOST=postgres
         - DB_NAME=miapp
         - DB_USER=postgres
         - DB_PASSWORD=password123
         - REDIS_HOST=redis
       depends_on:
         - postgres
         - redis
       volumes:
         - ./app:/app
         - /app/node_modules
       command: npm run dev

     postgres:
       image: postgres:15-alpine
       environment:
         - POSTGRES_DB=miapp
         - POSTGRES_USER=postgres
         - POSTGRES_PASSWORD=password123
       volumes:
         - postgres_data:/var/lib/postgresql/data
         - ./init.sql:/docker-entrypoint-initdb.d/init.sql
       ports:
         - "5432:5432"

     redis:
       image: redis:7-alpine
       ports:
         - "6379:6379"
       volumes:
         - redis_data:/data

     nginx:
       image: nginx:alpine
       ports:
         - "80:80"
       volumes:
         - ./nginx/nginx.conf:/etc/nginx/nginx.conf
       depends_on:
         - app

   volumes:
     postgres_data:
     redis_data:
   ```

5. **Docker Compose para staging**

   `docker-compose.staging.yml`:
   ```yaml
   version: '3.8'

   services:
     app:
       build: ./app
       environment:
         - NODE_ENV=staging
         - DB_HOST=postgres
         - DB_NAME=miapp_staging
         - DB_USER=postgres
         - DB_PASSWORD=${DB_PASSWORD}
         - REDIS_HOST=redis
       depends_on:
         - postgres
         - redis
       restart: unless-stopped

     postgres:
       image: postgres:15-alpine
       environment:
         - POSTGRES_DB=miapp_staging
         - POSTGRES_USER=postgres
         - POSTGRES_PASSWORD=${DB_PASSWORD}
       volumes:
         - postgres_staging_data:/var/lib/postgresql/data
       restart: unless-stopped

     redis:
       image: redis:7-alpine
       volumes:
         - redis_staging_data:/data
       restart: unless-stopped

     nginx:
       image: nginx:alpine
       ports:
         - "8080:80"
       volumes:
         - ./nginx/nginx.conf:/etc/nginx/nginx.conf
       depends_on:
         - app
       restart: unless-stopped

   volumes:
     postgres_staging_data:
     redis_staging_data:
   ```

6. **Docker Compose para producción**

   `docker-compose.prod.yml`:
   ```yaml
   version: '3.8'

   services:
     app:
       image: ghcr.io/${GITHUB_REPOSITORY}/mi-app:${IMAGE_TAG}
       environment:
         - NODE_ENV=production
         - DB_HOST=postgres
         - DB_NAME=${DB_NAME}
         - DB_USER=${DB_USER}
         - DB_PASSWORD=${DB_PASSWORD}
         - REDIS_HOST=redis
       depends_on:
         - postgres
         - redis
       restart: unless-stopped
       deploy:
         replicas: 2
         resources:
           limits:
             cpus: '1'
             memory: 512M

     postgres:
       image: postgres:15-alpine
       environment:
         - POSTGRES_DB=${DB_NAME}
         - POSTGRES_USER=${DB_USER}
         - POSTGRES_PASSWORD=${DB_PASSWORD}
       volumes:
         - postgres_prod_data:/var/lib/postgresql/data
         - ./backups:/backups
       restart: unless-stopped

     redis:
       image: redis:7-alpine
       volumes:
         - redis_prod_data:/data
       restart: unless-stopped
       command: redis-server --appendonly yes

     nginx:
       image: nginx:alpine
       ports:
         - "80:80"
         - "443:443"
       volumes:
         - ./nginx/nginx.conf:/etc/nginx/nginx.conf
         - ./ssl:/etc/ssl/certs
       depends_on:
         - app
       restart: unless-stopped

   volumes:
     postgres_prod_data:
     redis_prod_data:
   ```

### Ejercicio 2: Workflow de Deployment

1. **Workflow completo de CI/CD**

   `.github/workflows/deploy-docker-compose.yml`:
   ```yaml
   name: Deploy with Docker Compose

   on:
     push:
       branches: [ main, develop ]
     pull_request:
       branches: [ main ]

   env:
     IMAGE_NAME: mi-app
     REGISTRY: ghcr.io

   jobs:
     test:
       runs-on: ubuntu-latest
       
       services:
         postgres:
           image: postgres:15-alpine
           env:
             POSTGRES_PASSWORD: postgres
           options: >-
             --health-cmd pg_isready
             --health-interval 10s
             --health-timeout 5s
             --health-retries 5

         redis:
           image: redis:7-alpine
           options: >-
             --health-cmd "redis-cli ping"
             --health-interval 10s
             --health-timeout 5s
             --health-retries 5

       steps:
       - name: Checkout code
         uses: actions/checkout@v4

       - name: Setup Node.js
         uses: actions/setup-node@v4
         with:
           node-version: '18'

       - name: Install dependencies
         run: |
           cd app
           npm ci

       - name: Run tests
         run: |
           cd app
           npm test
         env:
           DB_HOST: localhost
           DB_NAME: postgres
           DB_USER: postgres
           DB_PASSWORD: postgres
           REDIS_HOST: localhost

     build:
       needs: test
       runs-on: ubuntu-latest
       if: github.event_name == 'push'
       
       steps:
       - name: Checkout code
         uses: actions/checkout@v4

       - name: Set up Docker Buildx
         uses: docker/setup-buildx-action@v3

       - name: Login to Container Registry
         uses: docker/login-action@v3
         with:
           registry: ${{ env.REGISTRY }}
           username: ${{ github.actor }}
           password: ${{ secrets.GITHUB_TOKEN }}

       - name: Extract metadata
         id: meta
         uses: docker/metadata-action@v5
         with:
           images: ${{ env.REGISTRY }}/${{ github.repository }}/${{ env.IMAGE_NAME }}
           tags: |
             type=ref,event=branch
             type=sha,prefix={{branch}}-

       - name: Build and push image
         uses: docker/build-push-action@v5
         with:
           context: ./app
           push: true
           tags: ${{ steps.meta.outputs.tags }}
           labels: ${{ steps.meta.outputs.labels }}

     deploy-staging:
       needs: build
       runs-on: [self-hosted, staging]
       if: github.ref == 'refs/heads/develop'
       environment: staging
       
       steps:
       - name: Checkout code
         uses: actions/checkout@v4

       - name: Create environment file
         run: |
           cat > .env << EOF
           DB_PASSWORD=${{ secrets.STAGING_DB_PASSWORD }}
           IMAGE_TAG=${{ github.sha }}
           EOF

       - name: Deploy to staging
         run: |
           echo "🚀 Desplegando a Staging..."
           
           # Parar servicios existentes
           docker-compose -f docker-compose.staging.yml down || true
           
           # Limpiar contenedores e imágenes antiguas
           docker system prune -f
           
           # Iniciar servicios
           docker-compose -f docker-compose.staging.yml up -d
           
           echo "✅ Deployment a staging completado"

       - name: Wait for services to be ready
         run: |
           echo "⏳ Esperando que los servicios estén listos..."
           
           # Esperar hasta 5 minutos
           for i in {1..30}; do
             if curl -f http://localhost:8080/health; then
               echo "✅ Staging está listo!"
               break
             fi
             echo "Intento $i/30 - Esperando 10 segundos..."
             sleep 10
           done

       - name: Run health checks
         run: |
           echo "🏥 Ejecutando health checks..."
           
           # Verificar aplicación
           curl -f http://localhost:8080/health || exit 1
           
           # Verificar base de datos
           docker-compose -f docker-compose.staging.yml exec -T postgres pg_isready || exit 1
           
           # Verificar Redis
           docker-compose -f docker-compose.staging.yml exec -T redis redis-cli ping || exit 1
           
           echo "✅ Todos los health checks pasaron"

     deploy-production:
       needs: build
       runs-on: [self-hosted, production]
       if: github.ref == 'refs/heads/main'
       environment: production
       
       steps:
       - name: Checkout code
         uses: actions/checkout@v4

       - name: Create environment file
         run: |
           cat > .env << EOF
           DB_NAME=${{ secrets.PROD_DB_NAME }}
           DB_USER=${{ secrets.PROD_DB_USER }}
           DB_PASSWORD=${{ secrets.PROD_DB_PASSWORD }}
           IMAGE_TAG=${{ github.sha }}
           GITHUB_REPOSITORY=${{ github.repository }}
           EOF

       - name: Backup database
         run: |
           echo "📦 Creando backup de base de datos..."
           
           # Crear backup si la base de datos existe
           if docker-compose -f docker-compose.prod.yml ps postgres | grep -q "Up"; then
             docker-compose -f docker-compose.prod.yml exec -T postgres \
               pg_dump -U ${{ secrets.PROD_DB_USER }} ${{ secrets.PROD_DB_NAME }} > \
               backup-$(date +%Y%m%d-%H%M%S).sql
             echo "✅ Backup creado"
           else
             echo "ℹ️ No hay base de datos existente para hacer backup"
           fi

       - name: Deploy to production
         run: |
           echo "🚀 Desplegando a Producción..."
           
           # Actualizar servicios sin downtime
           docker-compose -f docker-compose.prod.yml pull
           docker-compose -f docker-compose.prod.yml up -d --remove-orphans
           
           echo "✅ Deployment a producción completado"

       - name: Wait for services to be ready
         run: |
           echo "⏳ Esperando que los servicios estén listos..."
           
           for i in {1..30}; do
             if curl -f http://localhost/health; then
               echo "✅ Producción está lista!"
               break
             fi
             echo "Intento $i/30 - Esperando 10 segundos..."
             sleep 10
           done

       - name: Run production health checks
         run: |
           echo "🏥 Ejecutando health checks de producción..."
           
           # Verificar aplicación
           curl -f http://localhost/health || exit 1
           
           # Verificar Nginx
           curl -f http://localhost/nginx-health || exit 1
           
           # Verificar servicios internos
           docker-compose -f docker-compose.prod.yml ps
           
           echo "✅ Todos los health checks de producción pasaron"

       - name: Cleanup old images
         run: |
           echo "🧹 Limpiando imágenes antiguas..."
           docker image prune -f
           echo "✅ Cleanup completado"

     notify:
       needs: [deploy-staging, deploy-production]
       runs-on: ubuntu-latest
       if: always()
       
       steps:
       - name: Notify deployment result
         uses: actions/github-script@v7
         with:
           script: |
             const stagingStatus = '${{ needs.deploy-staging.result }}';
             const productionStatus = '${{ needs.deploy-production.result }}';
             
             let message = '🚀 **Deployment Summary**\n\n';
             
             if (stagingStatus && stagingStatus !== 'skipped') {
               message += `- Staging: ${stagingStatus === 'success' ? '✅' : '❌'} ${stagingStatus}\n`;
             }
             
             if (productionStatus && productionStatus !== 'skipped') {
               message += `- Production: ${productionStatus === 'success' ? '✅' : '❌'} ${productionStatus}\n`;
             }
             
             message += `\n**Commit:** ${context.sha.substring(0, 7)}\n`;
             message += `**Branch:** ${context.ref.replace('refs/heads/', '')}\n`;
             message += `**Author:** ${context.actor}`;
             
             github.rest.repos.createCommitComment({
               owner: context.repo.owner,
               repo: context.repo.repo,
               commit_sha: context.sha,
               body: message
             });
   ```

### Ejercicio 3: Scripts de Utilidad

1. **Script para desarrollo local**

   `scripts/dev.sh`:
   ```bash
   #!/bin/bash

   echo "🚀 Iniciando entorno de desarrollo..."

   # Verificar si Docker está corriendo
   if ! docker info > /dev/null 2>&1; then
       echo "❌ Docker no está corriendo"
       exit 1
   fi

   # Crear archivo .env si no existe
   if [ ! -f .env ]; then
       cp .env.example .env
       echo "📝 Archivo .env creado desde .env.example"
   fi

   # Construir e iniciar servicios
   docker-compose up --build -d

   echo "⏳ Esperando que los servicios estén listos..."
   sleep 10

   # Verificar que todo esté funcionando
   if curl -f http://localhost/health; then
       echo "✅ Entorno de desarrollo listo!"
       echo "🌐 Aplicación: http://localhost"
       echo "🗄️ PostgreSQL: localhost:5432"
       echo "🔴 Redis: localhost:6379"
   else
       echo "❌ Error al iniciar el entorno"
       docker-compose logs
   fi
   ```

2. **Script para monitoreo**

   `scripts/monitor.sh`:
   ```bash
   #!/bin/bash

   echo "📊 Estado de los servicios:"
   echo "=========================="

   # Verificar Docker Compose
   docker-compose ps

   echo -e "\n🏥 Health Checks:"
   echo "=================="

   # Verificar aplicación
   if curl -f http://localhost/health > /dev/null 2>&1; then
       echo "✅ Aplicación: OK"
   else
       echo "❌ Aplicación: FAIL"
   fi

   # Verificar Nginx
   if curl -f http://localhost/nginx-health > /dev/null 2>&1; then
       echo "✅ Nginx: OK"
   else
       echo "❌ Nginx: FAIL"
   fi

   # Verificar PostgreSQL
   if docker-compose exec -T postgres pg_isready > /dev/null 2>&1; then
       echo "✅ PostgreSQL: OK"
   else
       echo "❌ PostgreSQL: FAIL"
   fi

   # Verificar Redis
   if docker-compose exec -T redis redis-cli ping > /dev/null 2>&1; then
       echo "✅ Redis: OK"
   else
       echo "❌ Redis: FAIL"
   fi

   echo -e "\n📈 Recursos:"
   echo "============"
   docker stats --no-stream --format "table {{.Name}}\t{{.CPUPerc}}\t{{.MemUsage}}"
   ```

3. **Script de backup**

   `scripts/backup.sh`:
   ```bash
   #!/bin/bash

   BACKUP_DIR="./backups"
   DATE=$(date +%Y%m%d-%H%M%S)

   echo "📦 Creando backup..."

   # Crear directorio de backups
   mkdir -p $BACKUP_DIR

   # Backup de PostgreSQL
   docker-compose exec -T postgres pg_dump -U postgres miapp > $BACKUP_DIR/postgres-$DATE.sql

   # Backup de Redis
   docker-compose exec -T redis redis-cli BGSAVE
   docker cp $(docker-compose ps -q redis):/data/dump.rdb $BACKUP_DIR/redis-$DATE.rdb

   # Crear archivo comprimido
   tar -czf $BACKUP_DIR/backup-$DATE.tar.gz $BACKUP_DIR/*-$DATE.*

   # Limpiar archivos individuales
   rm $BACKUP_DIR/*-$DATE.sql $BACKUP_DIR/*-$DATE.rdb

   echo "✅ Backup creado: $BACKUP_DIR/backup-$DATE.tar.gz"

   # Mantener solo los últimos 5 backups
   ls -t $BACKUP_DIR/backup-*.tar.gz | tail -n +6 | xargs -r rm

   echo "🧹 Backups antiguos limpiados"
   ```

## ✅ Tareas del Día

### Tarea Principal
1. **Crear una aplicación full-stack con Docker Compose**
2. **Configurar self-hosted runner para deployment**
3. **Implementar workflow de CI/CD básico**
4. **Probar deployment en staging y producción**

### Tareas Adicionales
1. **Crear scripts de utilidad para desarrollo**
2. **Implementar sistema de backups**
3. **Configurar monitoreo básico**
4. **Documentar el proceso de deployment**

