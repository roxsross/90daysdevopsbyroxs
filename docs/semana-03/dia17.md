---
title: Día 17 - Docker GitHub Actions
description: Docker y Containerización con GitHub Actions
sidebar_position: 3
---

## Docker y Containerización con GitHub Actions

![](../../static/images/banner/3.png)

### Docker en CI/CD
Docker permite:
- **Consistencia entre entornos**: La aplicación se ejecuta igual en desarrollo, testing y producción
- **Aislamiento**: Cada aplicación tiene sus propias dependencias
- **Escalabilidad**: Fácil despliegue en múltiples entornos
- **Versionado**: Cada imagen tiene un tag específico

### GitHub Container Registry (GHCR)
- Registro oficial de GitHub para contenedores
- Integración nativa con GitHub Actions
- Soporte para imágenes públicas y privadas
- Pricing competitivo

### Consideraciones al Usar DockerHub en GitHub Actions

Si usas DockerHub como registro de imágenes en tus workflows de GitHub Actions:

- **Autenticación Segura**: Usa `secrets` para tus credenciales (`DOCKERHUB_USERNAME` y `DOCKERHUB_TOKEN`). Nunca los expongas en el código.
- **Rate Limits**: DockerHub impone límites de pulls para cuentas gratuitas. Considera usar cuentas Pro o GHCR si necesitas más volumen.
- **Login en el Workflow**: Agrega un paso para autenticación antes de hacer push/pull:
    ```yaml
    - name: Login to DockerHub
        uses: docker/login-action@v3
        with:
            username: ${{ secrets.DOCKERHUB_USERNAME }}
            password: ${{ secrets.DOCKERHUB_TOKEN }}
    ```
- **Nombres de Imagen**: Usa el formato `dockerhub-username/repo:tag` para los tags.
- **Evita Exponer Secrets**: No uses los secrets en comandos de shell que puedan ser impresos en logs.
- **Limpieza de Imágenes**: Considera políticas de limpieza en DockerHub para evitar acumulación de imágenes antiguas.
- **Visibilidad**: Decide si tus imágenes serán públicas o privadas según la sensibilidad del proyecto.

---

### Multi-Stage Builds
Técnica para optimizar imágenes Docker:
- **Build stage**: Instala dependencias y compila
- **Production stage**: Solo incluye archivos necesarios para producción
- Resultado: Imágenes más pequeñas y seguras

## 🛠️ Práctica

### Ejercicio 1: Containerizar Aplicación Node.js

1. **Dockerfile optimizado**

   `Dockerfile`:
   ```dockerfile
   # Multi-stage build
   FROM node:18-alpine AS builder

   WORKDIR /app

   # Copy package files
   COPY package*.json ./

   # Install dependencies
   RUN npm ci --only=production && npm cache clean --force

   # Copy source code
   COPY . .

   # Build application (if needed)
   RUN npm run build 2>/dev/null || echo "No build script found"

   # Production stage
   FROM node:18-alpine AS production

   # Create non-root user
   RUN addgroup -g 1001 -S nodejs && \
       adduser -S nextjs -u 1001

   WORKDIR /app

   # Copy only necessary files from builder
   COPY --from=builder --chown=nextjs:nodejs /app/node_modules ./node_modules
   COPY --from=builder --chown=nextjs:nodejs /app/package*.json ./
   COPY --from=builder --chown=nextjs:nodejs /app/index.js ./

   # Switch to non-root user
   USER nextjs

   # Expose port
   EXPOSE 3000

   # Health check
   HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
     CMD node -e "require('http').get('http://localhost:3000/health', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) })" || exit 1

   # Start application
   CMD ["node", "index.js"]
   ```

   `.dockerignore`:
   ```
   node_modules
   npm-debug.log
   .git
   .gitignore
   README.md
   .env
   coverage
   .nyc_output
   .github
   Dockerfile
   .dockerignore
   ```

2. **Workflow para Docker**

   `.github/workflows/docker-build.yml`:
   ```yaml
   name: Docker Build and Push

   on:
     push:
       branches: [ main, develop ]
       tags: [ 'v*' ]
     pull_request:
       branches: [ main ]

   env:
     REGISTRY: ghcr.io
     IMAGE_NAME: ${{ github.repository }}

   jobs:
     build-and-push:
       runs-on: ubuntu-latest
       permissions:
         contents: read
         packages: write

       steps:
       - name: Checkout code
         uses: actions/checkout@v4

       - name: Set up Docker Buildx
         uses: docker/setup-buildx-action@v3

       - name: Log in to Container Registry
         if: github.event_name != 'pull_request'
         uses: docker/login-action@v3
         with:
           registry: ${{ env.REGISTRY }}
           username: ${{ github.actor }}
           password: ${{ secrets.GITHUB_TOKEN }}

       - name: Extract metadata
         id: meta
         uses: docker/metadata-action@v5
         with:
           images: ${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}
           tags: |
             type=ref,event=branch
             type=ref,event=pr
             type=semver,pattern={{version}}
             type=semver,pattern={{major}}.{{minor}}

       - name: Build and push Docker image
         uses: docker/build-push-action@v5
         with:
           context: .
           platforms: linux/amd64,linux/arm64
           push: ${{ github.event_name != 'pull_request' }}
           tags: ${{ steps.meta.outputs.tags }}
           labels: ${{ steps.meta.outputs.labels }}
           cache-from: type=gha
           cache-to: type=gha,mode=max

       - name: Run Trivy vulnerability scanner
         uses: aquasecurity/trivy-action@master
         with:
           image-ref: ${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}:${{ steps.meta.outputs.version }}
           format: 'sarif'
           output: 'trivy-results.sarif'

       - name: Upload Trivy scan results
         uses: github/codeql-action/upload-sarif@v2
         if: always()
         with:
           sarif_file: 'trivy-results.sarif'
   ```

### Ejercicio 2: Docker Compose en CI

1. **docker-compose.yml para testing**

   `docker-compose.test.yml`:
   ```yaml
   version: '3.8'

   services:
     app:
       build: 
         context: .
         target: builder
       environment:
         - NODE_ENV=test
         - DATABASE_URL=postgresql://testuser:testpass@db:5432/testdb
       depends_on:
         - db
         - redis
       command: npm test
       volumes:
         - ./coverage:/app/coverage

     db:
       image: postgres:15-alpine
       environment:
         POSTGRES_USER: testuser
         POSTGRES_PASSWORD: testpass
         POSTGRES_DB: testdb
       tmpfs:
         - /var/lib/postgresql/data

     redis:
       image: redis:7-alpine
       command: redis-server --save ""
   ```

2. **Workflow con Docker Compose**

   `.github/workflows/docker-compose-test.yml`:
   ```yaml
   name: Docker Compose Tests

   on:
     push:
       branches: [ main, develop ]
     pull_request:
       branches: [ main ]

   jobs:
     integration-tests:
       runs-on: ubuntu-latest

       steps:
       - name: Checkout code
         uses: actions/checkout@v4

       - name: Create test environment file
         run: |
           cat << EOF > .env.test
           NODE_ENV=test
           DATABASE_URL=postgresql://testuser:testpass@db:5432/testdb
           REDIS_URL=redis://redis:6379
           EOF

       - name: Build and run tests
         run: |
           docker-compose -f docker-compose.test.yml up --build --abort-on-container-exit
           docker-compose -f docker-compose.test.yml down

       - name: Copy coverage from container
         run: |
           docker-compose -f docker-compose.test.yml run --rm app cp -r /app/coverage ./coverage || true

       - name: Upload coverage reports
         uses: actions/upload-artifact@v4
         if: always()
         with:
           name: coverage-reports
           path: coverage/
   ```

### Ejercicio 3: Multi-Registry Push

`.github/workflows/multi-registry.yml`:
```yaml
name: Multi-Registry Push

on:
  push:
    tags: [ 'v*' ]

jobs:
  multi-registry-push:
    runs-on: ubuntu-latest
    
    steps:
    - name: Checkout
      uses: actions/checkout@v4

    - name: Set up Docker Buildx
      uses: docker/setup-buildx-action@v3

    - name: Login to DockerHub
      uses: docker/login-action@v3
      with:
        username: ${{ secrets.DOCKERHUB_USERNAME }}
        password: ${{ secrets.DOCKERHUB_TOKEN }}

    - name: Login to GitHub Container Registry
      uses: docker/login-action@v3
      with:
        registry: ghcr.io
        username: ${{ github.actor }}
        password: ${{ secrets.GITHUB_TOKEN }}

    - name: Login to Amazon ECR
      uses: aws-actions/amazon-ecr-login@v2

    - name: Extract version
      id: version
      run: echo "VERSION=${GITHUB_REF#refs/tags/}" >> $GITHUB_OUTPUT

    - name: Build and push to multiple registries
      uses: docker/build-push-action@v5
      with:
        context: .
        platforms: linux/amd64,linux/arm64
        push: true
        tags: |
          ${{ secrets.DOCKERHUB_USERNAME }}/devops-app:${{ steps.version.outputs.VERSION }}
          ${{ secrets.DOCKERHUB_USERNAME }}/devops-app:latest
          ghcr.io/${{ github.repository }}:${{ steps.version.outputs.VERSION }}
          ghcr.io/${{ github.repository }}:latest
          ${{ secrets.AWS_ACCOUNT_ID }}.dkr.ecr.${{ secrets.AWS_REGION }}.amazonaws.com/devops-app:${{ steps.version.outputs.VERSION }}
```

### Ejercicio 4: Docker con Cache Avanzado

`.github/workflows/docker-cache.yml`:
```yaml
name: Docker Build with Advanced Caching

on:
  push:
    branches: [ main ]

jobs:
  build:
    runs-on: ubuntu-latest
    
    steps:
    - name: Checkout
      uses: actions/checkout@v4

    - name: Set up Docker Buildx
      uses: docker/setup-buildx-action@v3

    - name: Login to GitHub Container Registry
      uses: docker/login-action@v3
      with:
        registry: ghcr.io
        username: ${{ github.actor }}
        password: ${{ secrets.GITHUB_TOKEN }}

    - name: Build and push with cache
      uses: docker/build-push-action@v5
      with:
        context: .
        push: true
        tags: ghcr.io/${{ github.repository }}:latest
        cache-from: |
          type=gha
          type=registry,ref=ghcr.io/${{ github.repository }}:cache
        cache-to: |
          type=gha,mode=max
          type=registry,ref=ghcr.io/${{ github.repository }}:cache,mode=max
        build-args: |
          BUILDKIT_INLINE_CACHE=1
```

### Ejercicio 5: Dockerfile para Python con Poetry

`Dockerfile.python`:
```dockerfile
FROM python:3.11-slim as builder

# Install system dependencies
RUN apt-get update && apt-get install -y \
    build-essential \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Install Poetry
RUN pip install poetry

WORKDIR /app

# Copy poetry files
COPY pyproject.toml poetry.lock* ./

# Configure poetry
RUN poetry config virtualenvs.create false

# Install dependencies
RUN poetry install --no-dev --no-interaction --no-ansi

# Production stage
FROM python:3.11-slim as production

# Create non-root user
RUN useradd --create-home --shell /bin/bash app

WORKDIR /app

# Copy Python packages from builder
COPY --from=builder /usr/local/lib/python3.11/site-packages /usr/local/lib/python3.11/site-packages
COPY --from=builder /usr/local/bin /usr/local/bin

# Copy application code
COPY --chown=app:app . .

# Switch to non-root user
USER app

# Expose port
EXPOSE 8000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:8000/health || exit 1

# Run application
CMD ["python", "-m", "gunicorn", "app:app", "--bind", "0.0.0.0:8000"]
```

### Ejercicio 6: Docker Security Scanning

`.github/workflows/security-scan.yml`:
```yaml
name: Docker Security Scan

on:
  push:
    branches: [ main ]
  schedule:
    - cron: '0 6 * * 1'  # Weekly on Monday

jobs:
  security-scan:
    runs-on: ubuntu-latest
    
    steps:
    - name: Checkout
      uses: actions/checkout@v4

    - name: Build Docker image
      run: |
        docker build -t security-test:latest .

    - name: Run Trivy vulnerability scanner
      uses: aquasecurity/trivy-action@master
      with:
        image-ref: 'security-test:latest'
        format: 'json'
        output: 'trivy-report.json'

    - name: Run Snyk to check Docker image for vulnerabilities
      uses: snyk/actions/docker@master
      env:
        SNYK_TOKEN: ${{ secrets.SNYK_TOKEN }}
      with:
        image: security-test:latest
        args: --severity-threshold=high

    - name: Run Hadolint
      uses: hadolint/hadolint-action@v3.1.0
      with:
        dockerfile: Dockerfile
        format: sarif
        output-file: hadolint-results.sarif

    - name: Upload Hadolint results
      uses: github/codeql-action/upload-sarif@v2
      if: always()
      with:
        sarif_file: hadolint-results.sarif

    - name: Upload security reports
      uses: actions/upload-artifact@v4
      if: always()
      with:
        name: security-reports
        path: |
          trivy-report.json
          hadolint-results.sarif
```

## 🔧 Herramientas y Mejores Prácticas

### 1. Optimización de Imágenes
```dockerfile
# ✅ Buenas prácticas
FROM node:18-alpine  # Usar imágenes alpine
RUN npm ci --only=production  # Solo dependencias de producción
USER node  # Usuario no-root
COPY --chown=node:node . .  # Cambiar ownership
```

### 2. Secrets y Variables de Entorno
```yaml
# En el workflow
env:
  REGISTRY_PASSWORD: ${{ secrets.REGISTRY_PASSWORD }}
  DATABASE_URL: ${{ secrets.DATABASE_URL }}

# En el Dockerfile
ARG BUILD_DATE
ARG VCS_REF
ENV NODE_ENV=production
```

### 3. Etiquetas Semánticas
```yaml
tags: |
  type=ref,event=branch
  type=ref,event=pr
  type=semver,pattern={{version}}
  type=semver,pattern={{major}}.{{minor}}
  type=sha,prefix={{branch}}-
```

## ✅ Tareas del Día

### Tarea Principal
1. **Crear Dockerfiles para diferentes tipos de aplicaciones**
2. **Configurar workflow para build y push a GHCR**
3. **Implementar Docker Compose para testing**
4. **Agregar security scanning con Trivy**

### Tareas Adicionales
1. **Optimizar imágenes usando multi-stage builds**
2. **Configurar push a múltiples registries**
3. **Implementar cache avanzado**
4. **Crear health checks efectivos**

## 🛡️ Seguridad en Docker

### Checklist de Seguridad
- ✅ Usar imágenes base oficiales y actualizadas
- ✅ Ejecutar como usuario no-root
- ✅ Minimizar superficie de ataque (multi-stage)
- ✅ Escanear vulnerabilidades regularmente
- ✅ No incluir secrets en la imagen
- ✅ Usar .dockerignore apropiado

### Herramientas de Seguridad
- **Trivy**: Scanner de vulnerabilidades
- **Snyk**: Análisis de dependencias
- **Hadolint**: Linter para Dockerfiles
- **Clair**: Scanner de vulnerabilidades
- **Anchore**: Análisis de políticas


**¡Mañana configuraremos self-hosted runners para mayor control!** 🏃‍♂️