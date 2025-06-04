---
title: Día 58 -  Instalación de LocalStack
description: Aprende a instalar LocalStack en tu entorno local y verifica su funcionamiento.
sidebar_position: 2
---

## Instalación de LocalStack

![](../../static/images/banner/9.png)

## ⚙️ ¡Manos a la obra! Instalación de LocalStack

¡Hola Roxs! Ayer conocimos qué es LocalStack y hoy vamos a instalarlo y configurarlo para que tengas tu propio AWS local funcionando en minutos.

**¿Listos para simular la nube en su máquina?** 🚀

---

## 🧰 Requisitos Previos

Antes de empezar, asegurate de tener estos componentes instalados:

### ✅ **Docker (Obligatorio)**
LocalStack funciona sobre Docker, así que es indispensable:

```bash
# Verificar si Docker está instalado
docker --version
docker compose --version
```

**Si no tienes Docker:**
- 🪟 **Windows**: [Docker Desktop for Windows](https://docs.docker.com/desktop/install/windows-install/)
- 🍎 **macOS**: [Docker Desktop for Mac](https://docs.docker.com/desktop/install/mac-install/)
- 🐧 **Linux**: [Docker Engine](https://docs.docker.com/engine/install/)

> 💡 **Tip**: Asegurate de que Docker Desktop esté **corriendo** antes de continuar.

### ✅ **Python 3.7+ (Recomendado)**
Para instalar el CLI de LocalStack:

```bash
# Verificar versión de Python
python3 --version
# o
python --version

# Verificar pip
pip --version
# o  
pip3 --version
```

---

## 💻 Métodos de Instalación

Te voy a mostrar **3 formas** de instalar LocalStack. Elegí la que más te convenga:

### 🐍 **Método 1: Python + pip (Recomendado)**

Esta es la forma más sencilla y la que usaremos en el curso:

```bash
# Instalar LocalStack CLI
pip install localstack

# Verificar instalación
localstack --version
```

Si usas Python 3 específicamente:
```bash
pip3 install localstack
```

### 🐳 **Método 2: Solo Docker (Sin instalación)**

Si no querés instalar nada globalmente:

```bash
# Ejecutar directamente con Docker
docker run --rm -it -p 4566:4566 -p 4510-4559:4510-4559 localstack/localstack
```

### 📦 **Método 3: Docker Compose (Para proyectos)**

Crear archivo `docker-compose.yml`:

```yaml

services:
  localstack:
    container_name: "${LOCALSTACK_DOCKER_NAME:-localstack-main}"
    image: localstack/localstack:latest
    ports:
      - "127.0.0.1:4566:4566"            # LocalStack Gateway
      - "127.0.0.1:4510-4559:4510-4559"  # External services port range
    environment:
      # LocalStack configuration: https://docs.localstack.cloud/references/configuration/
      - DEBUG=${DEBUG:-0}
      - PERSISTENCE=${PERSISTENCE:-0}
      - LAMBDA_EXECUTOR=${LAMBDA_EXECUTOR:-}
      - LOCALSTACK_API_KEY=${LOCALSTACK_API_KEY:-}  # Para la versión Pro
    volumes:
      - "${LOCALSTACK_VOLUME_DIR:-./volume}:/var/lib/localstack"
      - "/var/run/docker.sock:/var/run/docker.sock"
    networks:
      - localstack-network

networks:
  localstack-network:
    name: localstack-network
```

```bash
# Ejecutar con Docker Compose
docker compose up -d

# Ver logs
docker compose logs -f

# Detener
docker compose down
```

---

## 🔧 Instalar AWS CLI Local

Para interactuar fácilmente con LocalStack, necesitamos `awslocal`:

```bash
# Instalar awslocal (wrapper de AWS CLI)
pip install awscli-local

# Verificar instalación
awslocal --version
```

`awslocal` es un wrapper que automáticamente configura AWS CLI para apuntar a LocalStack (localhost:4566) en lugar de AWS real.

### 🆚 **awslocal vs aws**

```bash
# AWS CLI normal (apunta a AWS real)
aws s3 ls

# AWS CLI local (apunta a LocalStack)
awslocal s3 ls
```

---

## 🚀 ¡Primer arranque!

### **Paso 1: Iniciar LocalStack**

```bash
# Método recomendado
localstack start
```

**¿Qué verás?**
```
     __                     _______ __             __  
    / /   ____  _________ _/ / ___// /_____ ______/ /__
   / /   / __ \/ ___/ __ `/ /\__ \/ __/ __ `/ ___/ //_/
  / /___/ /_/ / /__/ /_/ / /___/ / /_/ /_/ / /__/ ,<   
 /_____/\____/\___/\__,_/_//____/\__/\__,_/\___/_/|_|  
                                                        
 💻 LocalStack CLI 3.0.2
 👑 LocalStack Platform 3.0.2

[12:34:56] starting LocalStack in Docker mode 🐳
[12:34:57] detaching
LocalStack started 🚀
```

### **Paso 2: Verificar que está corriendo**

```bash
# Verificar estado
localstack status

# Ver logs en tiempo real
localstack logs

# Verificar salud de servicios
curl http://localhost:4566/health
```

### **Paso 3: Primer comando**

```bash
# Listar buckets de S3 (debería estar vacío)
awslocal s3 ls
```

Si no hay errores, ¡felicitaciones! LocalStack está funcionando 🎉

---

## 🔍 Verificación Completa

Ejecutemos algunos comandos para asegurarnos de que todo funciona:

```bash
# 1. Verificar servicios disponibles
curl http://localhost:4566/health | jq

# 2. Crear un bucket de prueba
awslocal s3 mb s3://test-bucket

# 3. Listar buckets
awslocal s3 ls

# 4. Verificar DynamoDB
awslocal dynamodb list-tables

# 5. Verificar Lambda
awslocal lambda list-functions
```

**Resultado esperado:**
- S3: Bucket `test-bucket` creado
- DynamoDB: Lista vacía `{"TableNames":[]}`
- Lambda: Lista vacía `{"Functions":[]}`

---

## 🛠️ Configuración Avanzada

### **Variables de Entorno Útiles**

```bash
# Configuración básica para AWS CLI
export AWS_DEFAULT_REGION=us-east-1
export AWS_ACCESS_KEY_ID=test
export AWS_SECRET_ACCESS_KEY=test
export AWS_DEFAULT_OUTPUT=json

# Configuración específica de LocalStack
export LOCALSTACK_HOST=localhost:4566
export LOCALSTACK_HOSTNAME=localhost
```

### **Configuración de LocalStack**

Crear archivo `~/.localstack/config` (opcional):

```ini
[default]
SERVICES=s3,lambda,dynamodb,apigateway,sqs,sns
DEBUG=1
PERSISTENCE=1
LAMBDA_EXECUTOR=docker
DATA_DIR=/tmp/localstack/data
```

### **Docker Compose Avanzado**

```yaml

services:
  localstack:
    container_name: localstack-roxs
    image: localstack/localstack:latest
    ports:
      - "4566:4566"
      - "4510-4559:4510-4559"
    environment:
      # Servicios específicos (más rápido)
      - SERVICES=s3,lambda,dynamodb,apigateway,sqs,sns,logs,events
      # Debug habilitado
      - DEBUG=1
      # Persistencia de datos
      - PERSISTENCE=1
      # Executor para Lambda
      - LAMBDA_EXECUTOR=docker
      # Configurar hostname
      - LOCALSTACK_HOSTNAME=localhost
    volumes:
      # Persistir datos
      - "./localstack-data:/var/lib/localstack"
      # Acceso a Docker socket
      - "/var/run/docker.sock:/var/run/docker.sock"
      # Scripts de inicialización
      - "./init-scripts:/etc/localstack/init/ready.d"
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:4566/health"]
      interval: 30s
      timeout: 10s
      retries: 5
    networks:
      - localstack-net

networks:
  localstack-net:
    driver: bridge
```

---

## 🐛 Troubleshooting Común

### ❌ **Error: Puerto 4566 ocupado**
```bash
# Verificar qué usa el puerto
lsof -i :4566
# o en Windows
netstat -ano | findstr :4566

# Matar proceso si es necesario
kill -9 <PID>
```

### ❌ **Error: Docker no está corriendo**
```bash
# Verificar estado de Docker
docker info

# En Linux, iniciar Docker
sudo systemctl start docker

# En macOS/Windows, abrir Docker Desktop
```

### ❌ **Error: Permisos de Docker (Linux)**
```bash
# Agregar usuario al grupo docker
sudo usermod -aG docker $USER

# Reiniciar sesión o usar:
newgrp docker
```

### ❌ **Error: awslocal comando no encontrado**
```bash
# Reinstalar awscli-local
pip install --upgrade awscli-local

# Verificar PATH
echo $PATH
which awslocal
```

### ❌ **Error: Python/pip no encontrado**
```bash
# Ubuntu/Debian
sudo apt update && sudo apt install python3 python3-pip

# CentOS/RHEL
sudo yum install python3 python3-pip

# macOS con Homebrew
brew install python3
```

---

## 🎯 Comandos de Gestión

### **Controlar LocalStack**

```bash
# Iniciar
localstack start

# Iniciar en background
localstack start -d

# Detener
localstack stop

# Reiniciar
localstack restart

# Ver logs
localstack logs

# Ver estado
localstack status

# Ver configuración
localstack config show
```

### **Limpiar datos**

```bash
# Limpiar todos los datos
localstack stop
docker volume prune -f

# O manualmente
rm -rf ./localstack-data/*
```

---

## 📊 Verificación Final

Ejecuta este script de verificación completa:

```bash
#!/bin/bash
echo "🔍 Verificando instalación de LocalStack..."

echo "1. Verificando Docker..."
docker --version || echo "❌ Docker no encontrado"

echo "2. Verificando LocalStack CLI..."
localstack --version || echo "❌ LocalStack CLI no encontrado"

echo "3. Verificando awslocal..."
awslocal --version || echo "❌ awslocal no encontrado"

echo "4. Iniciando LocalStack..."
localstack start -d

echo "5. Esperando que LocalStack esté listo..."
sleep 10

echo "6. Verificando health check..."
curl -s http://localhost:4566/health | jq || echo "❌ LocalStack no responde"

echo "7. Probando S3..."
awslocal s3 mb s3://verification-bucket
awslocal s3 ls | grep verification-bucket || echo "❌ S3 no funciona"

echo "8. Probando DynamoDB..."
awslocal dynamodb list-tables || echo "❌ DynamoDB no funciona"

echo "✅ ¡Verificación completa!"
```

---

## 💡 Tarea del Día

### 📝 **Parte 1: Instalación** (20 minutos)

1. **Instalar LocalStack CLI**:
   ```bash
   pip install localstack
   ```

2. **Instalar awscli-local**:
   ```bash
   pip install awscli-local
   ```

3. **Verificar versiones**:
   ```bash
   localstack --version
   awslocal --version
   ```

### 🚀 **Parte 2: Primer arranque** (10 minutos)

1. **Iniciar LocalStack**:
   ```bash
   localstack start
   ```

2. **En otra terminal, verificar funcionamiento**:
   ```bash
   awslocal s3 ls
   curl http://localhost:4566/health
   ```

3. **Crear bucket de prueba**:
   ```bash
   awslocal s3 mb s3://roxs-test-bucket
   awslocal s3 ls
   ```

### 📸 **Parte 3: Evidencia** (5 minutos)

1. **Capturar salida del comando**:
   ```bash
   awslocal s3 ls
   ```

2. **Capturar health check**:
   ```bash
   curl http://localhost:4566/health | jq
   ```

### 📤 **Parte 4: Compartir**

1. **Subir capturas a Discord** en #semana9-localstack
2. **Incluir en tu mensaje**:
   - Sistema operativo que usas
   - Método de instalación elegido (pip/docker/compose)
   - Cualquier problema que hayas encontrado y cómo lo resolviste
   
3. **Ayudar a compañeros** que tengan problemas de instalación

### 🏆 **Bonus Challenge**

**Crear tu primer Docker Compose para LocalStack:**

1. Crear archivo `localstack-setup/docker-compose.yml`
2. Incluir configuración con persistencia
3. Agregar script de inicialización
4. Probar que funciona correctamente

---

## 🔮 Lo que viene mañana...

**Día 59**: ¡Simular Amazon S3 en tu máquina!
- Crear buckets locales
- Subir y descargar archivos
- Comandos avanzados de S3
- Diferencias con S3 real

---

## 📈 **Tips Pro**

### 🚀 **Rendimiento**
- Usa `SERVICES=s3,lambda,dynamodb` para cargar solo servicios necesarios
- `LAMBDA_EXECUTOR=docker` es más lento pero más compatible
- `LAMBDA_EXECUTOR=local` es más rápido para desarrollo

### 💾 **Persistencia**
- `PERSISTENCE=1` mantiene datos entre reinicios
- Útil para desarrollo continuo
- Los datos se guardan en `/var/lib/localstack`

### 🔒 **Seguridad**
- LocalStack no valida credenciales AWS
- Usa credenciales dummy: `test/test`
- Nunca expongas LocalStack en producción

¡Nos vemos mañana para empezar a jugar con S3 local! 🗄️🚀
