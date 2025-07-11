---
title: Día 27 -  CI/CD para Terraform con LocalStack
description: CI/CD para Infrastructure as Code con Terraform y LocalStack S3
sidebar_position: 6
---
## 🚀 CI/CD para Terraform con GitHub Actions y LocalStack

![](../../static/images/banner/4.png)

¡Hoy automatizamos nuestros despliegues de Terraform con **LocalStack**!  
Aprenderemos a crear **pipelines de CI/CD** con **GitHub Actions** para deployar nuestra infraestructura usando **LocalStack** como simulador de AWS, incluyendo **S3** para el backend de estado remoto de Terraform.

---

## 🤔 ¿Qué es LocalStack y S3?

### 🐳 LocalStack - El Simulador de AWS
**LocalStack** es una plataforma que simula los servicios de AWS en tu máquina local, permitiendo desarrollar y probar aplicaciones cloud sin necesidad de conectarse a AWS real.

#### ¿Por qué usar LocalStack?
- **💰 Sin costos**: No pagas por recursos AWS durante desarrollo
- **🚀 Desarrollo rápido**: Testing instantáneo sin latencia de red
- **🔒 Privacidad**: Datos sensibles nunca salen de tu máquina
- **🧪 Testing seguro**: Experimenta sin riesgo de afectar producción
- **📦 Portabilidad**: Mismo ambiente en cualquier máquina

#### Servicios AWS que simula LocalStack:
```bash
✅ S3          # Almacenamiento de objetos
✅ EC2         # Máquinas virtuales
✅ Lambda      # Funciones serverless
✅ DynamoDB    # Base de datos NoSQL
✅ CloudFormation # Infrastructure as Code
✅ IAM         # Gestión de identidades
✅ SQS/SNS     # Colas y notificaciones
✅ API Gateway # APIs REST
... y muchos más
```

### 🪣 Amazon S3 - Simple Storage Service
**Amazon S3** es el servicio de almacenamiento de objetos de AWS, diseñado para almacenar y recuperar cualquier cantidad de datos desde cualquier lugar.

#### Características principales de S3:
- **📁 Buckets**: Contenedores para organizar objetos
- **🔄 Versionado**: Control de versiones de archivos
- **🔐 Seguridad**: Cifrado y control de acceso granular
- **📊 Durabilidad**: 99.999999999% (11 9's) de durabilidad
- **🌍 Escalabilidad**: Almacenamiento prácticamente ilimitado

#### ¿Por qué S3 para Terraform Backend?
```hcl
# Beneficios de usar S3 como backend remoto:
✅ Estado compartido entre el equipo
✅ Versionado automático del estado
✅ Bloqueo de estado (con DynamoDB)
✅ Cifrado del archivo de estado
✅ Backup y recuperación automática
✅ Acceso desde CI/CD pipelines
```

### 🔄 LocalStack + S3 + Terraform = ❤️
La combinación perfecta para desarrollo:

```bash
# Flujo de trabajo:
1️⃣ LocalStack simula S3 localmente
2️⃣ Terraform usa S3 (LocalStack) como backend
3️⃣ Estado remoto compartido sin AWS real
4️⃣ CI/CD testing sin costos
5️⃣ Misma configuración para dev/staging/prod
```

#### Comparación: AWS Real vs LocalStack

| Aspecto | AWS Real | LocalStack |
|---------|----------|------------|
| **Costo** | 💰 Pago por uso | 🆓 Gratis |
| **Velocidad** | 🌐 Latencia de red | ⚡ Local (ms) |
| **Datos** | ☁️ En la nube | 🏠 En tu máquina |
| **Producción** | ✅ Ideal | ❌ Solo desarrollo |
| **Configuración** | 🔑 Credenciales reales | 🔓 Credenciales test |
| **Persistencia** | ♾️ Permanente | 🔄 Configurable |

---

## 🤔 ¿Por qué CI/CD para Infrastructure as Code?

### Problemas del Despliegue Manual
❌ **Errores humanos** en comandos  
❌ **Inconsistencias** entre ambientes  
❌ **Falta de trazabilidad** de cambios  
❌ **Despliegues lentos** y propensos a fallos  
❌ **Sin rollback** automático  

### Beneficios del CI/CD con LocalStack
✅ **Validación automática** antes del despliegue  
✅ **Despliegues consistentes** y repetibles  
✅ **Historial completo** de cambios  
✅ **Rollback rápido** en caso de problemas  
✅ **Múltiples ambientes** gestionados igual  
✅ **Testing local** sin costos de AWS  
✅ **Backend S3 remoto** para estado de Terraform  

---

## 🏗️ Estructura del Proyecto CI/CD con LocalStack

```
terraform-cicd-localstack/
├── .github/
│   └── workflows/
│       ├── terraform-ci.yml      # Pipeline de validación
│       ├── terraform-cd.yml      # Pipeline de despliegue
│       └── terraform-destroy.yml # Pipeline de limpieza
├── docker-compose.localstack.yml # LocalStack setup
├── scripts/
│   ├── setup-localstack.sh       # Script de configuración
│   └── wait-for-localstack.sh    # Script de espera
├── environments/
│   ├── dev.tfvars
│   ├── staging.tfvars
│   └── prod.tfvars
├── modules/
│   ├── docker-webapp/
│   └── s3-backend/               # Módulo para S3 backend
├── backend.tf                   # Configuración de backend S3
├── main.tf
├── variables.tf
├── outputs.tf
└── README.md
```

---

## 🐳 Configuración de LocalStack

### `docker-compose.localstack.yml`
```yaml
version: '3.8'

services:
  localstack:
    image: localstack/localstack:3.0
    container_name: terraform-localstack
    ports:
      - "4566:4566"            # LocalStack endpoint
      - "4510-4559:4510-4559"  # External services port range
    environment:
      # Servicios AWS a emular
      - SERVICES=s3,ec2,iam,lambda,cloudformation,logs,events
      # Configuración
      - DEBUG=1
      - DATA_DIR=/var/lib/localstack/data
      - DOCKER_HOST=unix:///var/run/docker.sock
      - HOST_TMP_FOLDER=${TMPDIR:-/tmp}/localstack
      # Persistencia de datos
      - PERSISTENCE=1
    volumes:
      - "${TMPDIR:-/tmp}/localstack:/var/lib/localstack"
      - "/var/run/docker.sock:/var/run/docker.sock"
    networks:
      - terraform-network

networks:
  terraform-network:
    driver: bridge
```

### Scripts de Configuración

### `scripts/setup-localstack.sh`
```bash
#!/bin/bash
set -e

echo "🚀 Configurando LocalStack para Terraform..."

# Variables
LOCALSTACK_ENDPOINT="http://localhost:4566"
BUCKET_NAME="terraform-state-roxs"
AWS_DEFAULT_REGION="us-east-1"

# Configurar AWS CLI para LocalStack
export AWS_ACCESS_KEY_ID="test"
export AWS_SECRET_ACCESS_KEY="test"
export AWS_DEFAULT_REGION="us-east-1"
export AWS_ENDPOINT_URL="http://localhost:4566"

echo "⏳ Esperando a que LocalStack esté listo..."
./scripts/wait-for-localstack.sh

echo "📦 Creando bucket S3 para estado de Terraform..."
aws --endpoint-url=$LOCALSTACK_ENDPOINT s3 mb s3://$BUCKET_NAME || echo "Bucket ya existe"

echo "🔒 Habilitando versionado en el bucket..."
aws --endpoint-url=$LOCALSTACK_ENDPOINT s3api put-bucket-versioning \
  --bucket $BUCKET_NAME \
  --versioning-configuration Status=Enabled

echo "📋 Listando buckets disponibles..."
aws --endpoint-url=$LOCALSTACK_ENDPOINT s3 ls

echo "✅ LocalStack configurado correctamente!"
```

### `scripts/wait-for-localstack.sh`
```bash
#!/bin/bash
set -e

LOCALSTACK_ENDPOINT="http://localhost:4566"
MAX_ATTEMPTS=30
ATTEMPT=1

echo "⏳ Esperando a que LocalStack esté disponible..."

while [ $ATTEMPT -le $MAX_ATTEMPTS ]; do
  echo "Intento $ATTEMPT/$MAX_ATTEMPTS..."
  
  if curl -s "$LOCALSTACK_ENDPOINT/_localstack/health" > /dev/null; then
    echo "✅ LocalStack está listo!"
    exit 0
  fi
  
  echo "😴 LocalStack no está listo aún, esperando 5 segundos..."
  sleep 5
  ATTEMPT=$((ATTEMPT + 1))
done

echo "❌ LocalStack no está disponible después de $MAX_ATTEMPTS intentos"
exit 1
```

---

## 🔍 Pipeline de CI (Continuous Integration) con LocalStack

El pipeline de CI valida nuestro código **antes** de que se fusione a la rama principal, usando LocalStack para simular AWS.

### `.github/workflows/terraform-ci.yml`
```yaml
name: Terraform CI - Validación con LocalStack

# Cuándo ejecutar el pipeline
on:
  pull_request:
    branches: [main]
    paths:
      - '**.tf'
      - '**.tfvars'
      - '.github/workflows/**'
      - 'docker-compose.localstack.yml'

# Variables globales
env:
  TF_VERSION: 1.6.0
  AWS_ACCESS_KEY_ID: test
  AWS_SECRET_ACCESS_KEY: test
  AWS_DEFAULT_REGION: us-east-1

jobs:
  # Job 1: Validación básica
  validate:
    name: Validar Terraform
    runs-on: ubuntu-latest
    
    services:
      localstack:
        image: localstack/localstack:3.0
        ports:
          - 4566:4566
        env:
          SERVICES: s3,ec2,iam,lambda,cloudformation,logs,events
          DEBUG: 1
          DATA_DIR: /var/lib/localstack/data
          PERSISTENCE: 1
        options: >-
          --health-cmd "curl -f http://localhost:4566/_localstack/health || exit 1"
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
    
    steps:
    # Paso 1: Descargar código
    - name: Checkout código
      uses: actions/checkout@v4
      
    # Paso 2: Configurar permisos para scripts
    - name: Configurar permisos de scripts
      run: |
        chmod +x scripts/setup-localstack.sh
        chmod +x scripts/wait-for-localstack.sh
      
    # Paso 3: Instalar Terraform y AWS CLI
    - name: Setup Terraform
      uses: hashicorp/setup-terraform@v3
      with:
        terraform_version: ${{ env.TF_VERSION }}
        
    - name: Setup AWS CLI
      run: |
        curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
        unzip awscliv2.zip
        sudo ./aws/install
        
    # Paso 4: Configurar LocalStack
    - name: Configurar LocalStack
      run: |
        export AWS_ENDPOINT_URL=http://localhost:4566
        ./scripts/setup-localstack.sh
        
    # Paso 5: Verificar formato
    - name: Verificar formato de código
      run: terraform fmt -check -recursive
      
    # Paso 6: Inicializar Terraform con backend S3
    - name: Terraform Init
      run: |
        terraform init \
          -backend-config="endpoint=http://localhost:4566" \
          -backend-config="access_key=test" \
          -backend-config="secret_key=test"
      env:
        AWS_ENDPOINT_URL: http://localhost:4566
      
    # Paso 7: Validar sintaxis
    - name: Validar sintaxis
      run: terraform validate

  # Job 2: Generar plan para cada ambiente con LocalStack
  plan:
    name: Plan para Ambientes (LocalStack)
    runs-on: ubuntu-latest
    needs: validate
    strategy:
      matrix:
        environment: [dev, staging]
    
    services:
      localstack:
        image: localstack/localstack:3.0
        ports:
          - 4566:4566
        env:
          SERVICES: s3,ec2,iam,lambda,cloudformation,logs,events
          DEBUG: 1
          DATA_DIR: /var/lib/localstack/data
          PERSISTENCE: 1
        options: >-
          --health-cmd "curl -f http://localhost:4566/_localstack/health || exit 1"
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
    
    steps:
    - name: Checkout código
      uses: actions/checkout@v4
      
    - name: Configurar permisos de scripts
      run: |
        chmod +x scripts/setup-localstack.sh
        chmod +x scripts/wait-for-localstack.sh
      
    - name: Setup Terraform y AWS CLI
      uses: hashicorp/setup-terraform@v3
      with:
        terraform_version: ${{ env.TF_VERSION }}
        
    - name: Setup AWS CLI
      run: |
        curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
        unzip awscliv2.zip
        sudo ./aws/install
        
    - name: Configurar LocalStack
      run: |
        export AWS_ENDPOINT_URL=http://localhost:4566
        ./scripts/setup-localstack.sh
        
    - name: Terraform Init
      run: |
        terraform init \
          -backend-config="endpoint=http://localhost:4566" \
          -backend-config="access_key=test" \
          -backend-config="secret_key=test"
      env:
        AWS_ENDPOINT_URL: http://localhost:4566
      
    - name: Seleccionar workspace
      run: |
        terraform workspace select ${{ matrix.environment }} || \
        terraform workspace new ${{ matrix.environment }}
      env:
        AWS_ENDPOINT_URL: http://localhost:4566
      
    - name: Generar plan
      run: |
        terraform plan \
          -var-file="environments/${{ matrix.environment }}.tfvars" \
          -out="${{ matrix.environment }}.tfplan"
      env:
        AWS_ENDPOINT_URL: http://localhost:4566
        TF_VAR_database_password: "ci-test-password-${{ matrix.environment }}"
      
    # Verificar recursos en LocalStack
    - name: Verificar recursos en LocalStack
      run: |
        echo "📊 Verificando recursos creados en LocalStack..."
        aws --endpoint-url=http://localhost:4566 s3 ls
        aws --endpoint-url=http://localhost:4566 s3 ls s3://terraform-state-roxs
      
    # Guardar el plan para usar en CD
    - name: Subir plan
      uses: actions/upload-artifact@v3
      with:
        name: tfplan-${{ matrix.environment }}
        path: ${{ matrix.environment }}.tfplan
        retention-days: 1

  # Job 3: Comentar el plan en el PR
  comment-plan:
    name: Comentar Plan en PR
    runs-on: ubuntu-latest
    needs: plan
    if: github.event_name == 'pull_request'
    
    services:
      localstack:
        image: localstack/localstack:3.0
        ports:
          - 4566:4566
        env:
          SERVICES: s3,ec2,iam,lambda,cloudformation,logs,events
          DEBUG: 1
        options: >-
          --health-cmd "curl -f http://localhost:4566/_localstack/health || exit 1"
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
    
    steps:
    - name: Checkout código
      uses: actions/checkout@v4
      
    - name: Configurar permisos de scripts
      run: |
        chmod +x scripts/setup-localstack.sh
        chmod +x scripts/wait-for-localstack.sh
      
    - name: Setup Terraform y AWS CLI
      uses: hashicorp/setup-terraform@v3
      with:
        terraform_version: ${{ env.TF_VERSION }}
        
    - name: Setup AWS CLI
      run: |
        curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
        unzip awscliv2.zip
        sudo ./aws/install
        
    - name: Configurar LocalStack
      run: |
        export AWS_ENDPOINT_URL=http://localhost:4566
        ./scripts/setup-localstack.sh
        
    - name: Terraform Init
      run: |
        terraform init \
          -backend-config="endpoint=http://localhost:4566" \
          -backend-config="access_key=test" \
          -backend-config="secret_key=test"
      env:
        AWS_ENDPOINT_URL: http://localhost:4566
        
    - name: Descargar plan de dev
      uses: actions/download-artifact@v3
      with:
        name: tfplan-dev
        
    - name: Mostrar plan en comentario
      uses: actions/github-script@v6
      with:
        script: |
          const fs = require('fs');
          
          // Generar el plan en formato legible
          const { execSync } = require('child_process');
          const planOutput = execSync('terraform show -no-color dev.tfplan', { 
            encoding: 'utf8',
            env: { ...process.env, AWS_ENDPOINT_URL: 'http://localhost:4566' }
          });
          
          // Crear comentario
          const output = `## 📋 Plan de Terraform (Dev) con LocalStack
          
          <details>
          <summary>Ver cambios propuestos</summary>
          
          \`\`\`
          ${planOutput}
          \`\`\`
          
          </details>
          
          **✅ Validado con LocalStack**  
          **📦 Backend:** S3 (terraform-state-roxs)  
          **🌍 Ambiente:** Desarrollo  
          `;
          
          // Publicar comentario
          github.rest.issues.createComment({
            issue_number: context.issue.number,
            owner: context.repo.owner,
            repo: context.repo.repo,
            body: output
          });
```

---

## 🚀 Pipeline de CD (Continuous Deployment) con LocalStack

El pipeline de CD despliega automáticamente usando LocalStack cuando hay cambios en la rama principal.

### `.github/workflows/terraform-cd.yml`
```yaml
name: Terraform CD - Despliegue con LocalStack

# Cuándo ejecutar
on:
  push:
    branches: [main]
    paths:
      - '**.tf'
      - '**.tfvars'
      - 'docker-compose.localstack.yml'
  # También permitir ejecución manual
  workflow_dispatch:
    inputs:
      environment:
        description: 'Ambiente a desplegar'
        required: true
        default: 'dev'
        type: choice
        options:
        - dev
        - staging
        - prod
      action:
        description: 'Acción a realizar'
        required: true
        default: 'apply'
        type: choice
        options:
        - plan
        - apply
        - destroy

env:
  TF_VERSION: 1.6.0
  AWS_ACCESS_KEY_ID: test
  AWS_SECRET_ACCESS_KEY: test
  AWS_DEFAULT_REGION: us-east-1

jobs:
  # Despliegue a Desarrollo (automático)
  deploy-dev:
    name: 🔧 Desplegar a Desarrollo (LocalStack)
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    environment: 
      name: development
      url: http://localhost:8080
    
    services:
      localstack:
        image: localstack/localstack:3.0
        ports:
          - 4566:4566
        env:
          SERVICES: s3,ec2,iam,lambda,cloudformation,logs,events
          DEBUG: 1
          DATA_DIR: /var/lib/localstack/data
          PERSISTENCE: 1
        options: >-
          --health-cmd "curl -f http://localhost:4566/_localstack/health || exit 1"
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
    
    steps:
    - name: Checkout código
      uses: actions/checkout@v4
      
    - name: Configurar permisos de scripts
      run: |
        chmod +x scripts/setup-localstack.sh
        chmod +x scripts/wait-for-localstack.sh
      
    - name: Setup Terraform y herramientas
      uses: hashicorp/setup-terraform@v3
      with:
        terraform_version: ${{ env.TF_VERSION }}
        
    - name: Setup Docker
      uses: docker/setup-buildx-action@v3
      
    - name: Setup AWS CLI
      run: |
        curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
        unzip awscliv2.zip
        sudo ./aws/install
        
    - name: Configurar LocalStack y S3 Backend
      run: |
        export AWS_ENDPOINT_URL=http://localhost:4566
        ./scripts/setup-localstack.sh
        
    - name: Terraform Init con S3 Backend
      run: |
        terraform init \
          -backend-config="endpoint=http://localhost:4566" \
          -backend-config="access_key=test" \
          -backend-config="secret_key=test"
      env:
        AWS_ENDPOINT_URL: http://localhost:4566
      
    - name: Seleccionar workspace dev
      run: terraform workspace select dev || terraform workspace new dev
      env:
        AWS_ENDPOINT_URL: http://localhost:4566
      
    - name: Aplicar cambios a dev
      run: |
        terraform apply \
          -var-file="environments/dev.tfvars" \
          -auto-approve
      env:
        AWS_ENDPOINT_URL: http://localhost:4566
        TF_VAR_database_password: ${{ secrets.DEV_DB_PASSWORD || 'dev-default-password' }}
      
    - name: Verificar despliegue en LocalStack
      run: |
        echo "🎉 Despliegue a desarrollo completado!"
        echo "📊 Obteniendo información del despliegue..."
        terraform output
        
        echo "📦 Verificando recursos en LocalStack S3..."
        aws --endpoint-url=http://localhost:4566 s3 ls s3://terraform-state-roxs/workspaces/dev/
        
        echo "🔍 Estado actual de Terraform..."
        aws --endpoint-url=http://localhost:4566 s3 cp s3://terraform-state-roxs/workspaces/dev/terraform.tfstate - | head -20

  # Despliegue a Staging (con aprobación)
  deploy-staging:
    name: 🧪 Desplegar a Staging (LocalStack)
    runs-on: ubuntu-latest
    needs: deploy-dev
    if: github.ref == 'refs/heads/main'
    environment: 
      name: staging
      url: http://localhost:8081
    
    services:
      localstack:
        image: localstack/localstack:3.0
        ports:
          - 4566:4566
        env:
          SERVICES: s3,ec2,iam,lambda,cloudformation,logs,events
          DEBUG: 1
          DATA_DIR: /var/lib/localstack/data
          PERSISTENCE: 1
        options: >-
          --health-cmd "curl -f http://localhost:4566/_localstack/health || exit 1"
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
    
    steps:
    - name: Checkout código
      uses: actions/checkout@v4
      
    - name: Configurar permisos de scripts
      run: |
        chmod +x scripts/setup-localstack.sh
        chmod +x scripts/wait-for-localstack.sh
      
    - name: Setup Terraform y herramientas
      uses: hashicorp/setup-terraform@v3
      with:
        terraform_version: ${{ env.TF_VERSION }}
        
    - name: Setup Docker
      uses: docker/setup-buildx-action@v3
      
    - name: Setup AWS CLI
      run: |
        curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
        unzip awscliv2.zip
        sudo ./aws/install
        
    - name: Configurar LocalStack y S3 Backend
      run: |
        export AWS_ENDPOINT_URL=http://localhost:4566
        ./scripts/setup-localstack.sh
        
    - name: Terraform Init con S3 Backend
      run: |
        terraform init \
          -backend-config="endpoint=http://localhost:4566" \
          -backend-config="access_key=test" \
          -backend-config="secret_key=test"
      env:
        AWS_ENDPOINT_URL: http://localhost:4566
      
    - name: Seleccionar workspace staging
      run: terraform workspace select staging || terraform workspace new staging
      env:
        AWS_ENDPOINT_URL: http://localhost:4566
      
    - name: Aplicar cambios a staging
      run: |
        terraform apply \
          -var-file="environments/staging.tfvars" \
          -auto-approve
      env:
        AWS_ENDPOINT_URL: http://localhost:4566
        TF_VAR_database_password: ${{ secrets.STAGING_DB_PASSWORD || 'staging-default-password' }}
      
    - name: Verificar aplicación en staging
      run: |
        echo "⏳ Esperando a que los servicios estén listos..."
        sleep 30
        
        echo "🧪 Verificando que la aplicación responda..."
        curl -f http://localhost:8081 || echo "⚠️ Aplicación no responde aún"
        
        echo "📦 Estado en LocalStack S3..."
        aws --endpoint-url=http://localhost:4566 s3 ls s3://terraform-state-roxs/workspaces/staging/

  # Despliegue a Producción (solo manual)
  deploy-prod:
    name: 🏭 Desplegar a Producción (LocalStack)
    runs-on: ubuntu-latest
    if: github.event.inputs.environment == 'prod'
    environment: 
      name: production
      url: http://production.roxs-voting.com
    
    services:
      localstack:
        image: localstack/localstack:3.0
        ports:
          - 4566:4566
        env:
          SERVICES: s3,ec2,iam,lambda,cloudformation,logs,events
          DEBUG: 1
          DATA_DIR: /var/lib/localstack/data
          PERSISTENCE: 1
        options: >-
          --health-cmd "curl -f http://localhost:4566/_localstack/health || exit 1"
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
    
    steps:
    - name: Checkout código
      uses: actions/checkout@v4
      
    - name: Configurar permisos de scripts
      run: |
        chmod +x scripts/setup-localstack.sh
        chmod +x scripts/wait-for-localstack.sh
      
    - name: Setup Terraform y herramientas
      uses: hashicorp/setup-terraform@v3
      with:
        terraform_version: ${{ env.TF_VERSION }}
        
    - name: Setup AWS CLI
      run: |
        curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
        unzip awscliv2.zip
        sudo ./aws/install
        
    - name: Configurar LocalStack y S3 Backend
      run: |
        export AWS_ENDPOINT_URL=http://localhost:4566
        ./scripts/setup-localstack.sh
        
    - name: Terraform Init con S3 Backend
      run: |
        terraform init \
          -backend-config="endpoint=http://localhost:4566" \
          -backend-config="access_key=test" \
          -backend-config="secret_key=test"
      env:
        AWS_ENDPOINT_URL: http://localhost:4566
      
    - name: Seleccionar workspace prod
      run: terraform workspace select prod || terraform workspace new prod
      env:
        AWS_ENDPOINT_URL: http://localhost:4566
      
    - name: Plan para producción
      run: |
        terraform plan \
          -var-file="environments/prod.tfvars" \
          -out=prod.tfplan
      env:
        AWS_ENDPOINT_URL: http://localhost:4566
        TF_VAR_database_password: ${{ secrets.PROD_DB_PASSWORD || 'prod-secure-password' }}
      
    - name: Mostrar plan
      run: terraform show -no-color prod.tfplan
      
    - name: Aplicar a producción
      if: github.event.inputs.action == 'apply'
      run: terraform apply -auto-approve prod.tfplan
      env:
        AWS_ENDPOINT_URL: http://localhost:4566
      
    - name: Verificar producción
      if: github.event.inputs.action == 'apply'
      run: |
        echo "🎉 ¡Despliegue a producción completado!"
        terraform output
        
        echo "📦 Verificando estado en LocalStack S3..."
        aws --endpoint-url=http://localhost:4566 s3 ls s3://terraform-state-roxs/workspaces/prod/
        
    - name: Notificar equipo
      if: always()
      run: |
        echo "📢 Notificando al equipo sobre el despliegue..."
        echo "🎯 Ambiente: Producción"
        echo "📊 Acción: ${{ github.event.inputs.action }}"
        echo "🔍 Estado del workflow: ${{ job.status }}"
        # Aquí puedes agregar notificaciones a Slack, Teams, etc.
```

---

## 🧹 Pipeline de Limpieza con LocalStack

Para destruir recursos cuando ya no los necesites.

### `.github/workflows/terraform-destroy.yml`
```yaml
name: Terraform Destroy - Limpieza con LocalStack

# Solo ejecución manual
on:
  workflow_dispatch:
    inputs:
      environment:
        description: 'Ambiente a destruir'
        required: true
        type: choice
        options:
        - dev
        - staging
        - prod
      confirm:
        description: 'Escriba "DESTROY" para confirmar'
        required: true
        type: string

env:
  TF_VERSION: 1.6.0
  AWS_ACCESS_KEY_ID: test
  AWS_SECRET_ACCESS_KEY: test
  AWS_DEFAULT_REGION: us-east-1

jobs:
  destroy:
    name: 🗑️ Destruir Infraestructura (LocalStack)
    runs-on: ubuntu-latest
    environment: ${{ github.event.inputs.environment }}
    
    services:
      localstack:
        image: localstack/localstack:3.0
        ports:
          - 4566:4566
        env:
          SERVICES: s3,ec2,iam,lambda,cloudformation,logs,events
          DEBUG: 1
          DATA_DIR: /var/lib/localstack/data
          PERSISTENCE: 1
        options: >-
          --health-cmd "curl -f http://localhost:4566/_localstack/health || exit 1"
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
    
    steps:
    - name: Validar confirmación
      run: |
        if [ "${{ github.event.inputs.confirm }}" != "DESTROY" ]; then
          echo "❌ Confirmación incorrecta. Debe escribir 'DESTROY'"
          exit 1
        fi
        echo "✅ Confirmación válida para ambiente: ${{ github.event.inputs.environment }}"
    
    - name: Checkout código
      uses: actions/checkout@v4
      
    - name: Configurar permisos de scripts
      run: |
        chmod +x scripts/setup-localstack.sh
        chmod +x scripts/wait-for-localstack.sh
      
    - name: Setup Terraform y AWS CLI
      uses: hashicorp/setup-terraform@v3
      with:
        terraform_version: ${{ env.TF_VERSION }}
        
    - name: Setup AWS CLI
      run: |
        curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
        unzip awscliv2.zip
        sudo ./aws/install
        
    - name: Configurar LocalStack y S3 Backend
      run: |
        export AWS_ENDPOINT_URL=http://localhost:4566
        ./scripts/setup-localstack.sh
        
    - name: Terraform Init con S3 Backend
      run: |
        terraform init \
          -backend-config="endpoint=http://localhost:4566" \
          -backend-config="access_key=test" \
          -backend-config="secret_key=test"
      env:
        AWS_ENDPOINT_URL: http://localhost:4566
        
    - name: Seleccionar workspace
      run: terraform workspace select ${{ github.event.inputs.environment }}
      env:
        AWS_ENDPOINT_URL: http://localhost:4566
      
    - name: Verificar estado actual
      run: |
        echo "📋 Estado actual del ambiente ${{ github.event.inputs.environment }}:"
        terraform show
        
        echo "📦 Archivos en S3 antes de destruir:"
        aws --endpoint-url=http://localhost:4566 s3 ls s3://terraform-state-roxs/workspaces/${{ github.event.inputs.environment }}/ || echo "No hay archivos"
      
    - name: Plan destroy
      run: |
        terraform plan -destroy \
          -var-file="environments/${{ github.event.inputs.environment }}.tfvars" \
          -out=destroy.tfplan
      env:
        AWS_ENDPOINT_URL: http://localhost:4566
        TF_VAR_database_password: "dummy-password-for-destroy"
      
    - name: Mostrar qué se va a destruir
      run: terraform show -no-color destroy.tfplan
      
    - name: Destruir infraestructura
      run: terraform apply -auto-approve destroy.tfplan
      env:
        AWS_ENDPOINT_URL: http://localhost:4566
      
    - name: Confirmar destrucción
      run: |
        echo "🗑️ Infraestructura de ${{ github.event.inputs.environment }} destruida"
        echo "📊 Estado final:"
        terraform show
        
        echo "📦 Verificando limpieza en S3:"
        aws --endpoint-url=http://localhost:4566 s3 ls s3://terraform-state-roxs/workspaces/${{ github.event.inputs.environment }}/ || echo "✅ Workspace limpio"
        
    - name: Limpiar workspace (opcional)
      if: github.event.inputs.environment != 'prod'
      run: |
        echo "🧹 Eliminando workspace de ${{ github.event.inputs.environment }}..."
        terraform workspace select default
        terraform workspace delete ${{ github.event.inputs.environment }} || echo "Workspace ya eliminado"
      env:
        AWS_ENDPOINT_URL: http://localhost:4566
```

---

## 🔐 Configuración de Secrets y Variables

Para que los pipelines funcionen con LocalStack, necesitas configurar secrets en GitHub:

### En tu repositorio GitHub:
1. Ve a **Settings** → **Secrets and variables** → **Actions**
2. Agregar estos secrets:

```bash
# Passwords de base de datos por ambiente
DEV_DB_PASSWORD=dev_password_123
STAGING_DB_PASSWORD=staging_password_456
PROD_DB_PASSWORD=super_secure_prod_password_789

# Credenciales LocalStack (opcionales, ya que usa 'test')
LOCALSTACK_ACCESS_KEY=test
LOCALSTACK_SECRET_KEY=test

# Si usas Docker Registry privado
DOCKER_USERNAME=tu_usuario
DOCKER_PASSWORD=tu_password

# Para notificaciones (opcional)
SLACK_WEBHOOK_URL=https://hooks.slack.com/services/...

# Variables específicas de LocalStack
LOCALSTACK_ENDPOINT=http://localhost:4566
AWS_DEFAULT_REGION=us-east-1
```

### Variables de Ambiente en GitHub Actions
```yaml
# En cada workflow, definir:
env:
  TF_VERSION: 1.6.0
  AWS_ACCESS_KEY_ID: test
  AWS_SECRET_ACCESS_KEY: test
  AWS_DEFAULT_REGION: us-east-1
  AWS_ENDPOINT_URL: http://localhost:4566
```

---

## 🎯 Configuración de Environments

GitHub permite configurar **protection rules** por ambiente:

### 1. Crear Environments
En **Settings** → **Environments**, crear:
- `development` (sin restricciones)
- `staging` (con reviewers opcionales)
- `production` (con reviewers obligatorios)

### 2. Protection Rules para Producción
```yaml
# Configuración recomendada para production
Required reviewers: 2
Deployment branches: main only
Wait timer: 0 minutes
```

---

## 📁 Archivos de Variables por Ambiente con LocalStack

### `environments/dev.tfvars`
```hcl
# Desarrollo - Recursos mínimos con LocalStack
app_name = "roxs-voting-dev"
replica_count = 1
memory_limit = 256

external_ports = {
  vote   = 8080
  result = 3000
}

enable_monitoring = false
backup_enabled = false

# Configuración específica de LocalStack
aws_region = "us-east-1"
localstack_endpoint = "http://localhost:4566"
s3_bucket_suffix = "dev"
```

### `environments/staging.tfvars`
```hcl
# Staging - Configuración intermedia con LocalStack
app_name = "roxs-voting-staging"
replica_count = 2
memory_limit = 512

external_ports = {
  vote   = 8081
  result = 3001
}

enable_monitoring = true
backup_enabled = true

# Configuración específica de LocalStack
aws_region = "us-east-1"
localstack_endpoint = "http://localhost:4566"
s3_bucket_suffix = "staging"
```

### `environments/prod.tfvars`
```hcl
# Producción - Máximos recursos con LocalStack
app_name = "roxs-voting-prod"
replica_count = 3
memory_limit = 1024

external_ports = {
  vote   = 80
  result = 3000
}

enable_monitoring = true
backup_enabled = true

# Configuración específica de LocalStack
aws_region = "us-east-1"
localstack_endpoint = "http://localhost:4566"
s3_bucket_suffix = "prod"
```

---

## 🔄 Flujo de Trabajo Completo con LocalStack

### 1. Desarrollo Local
```bash
# Iniciar LocalStack
docker-compose -f docker-compose.localstack.yml up -d

# Configurar LocalStack
./scripts/setup-localstack.sh

# Crear feature branch
git checkout -b feature/nueva-funcionalidad

# Hacer cambios en Terraform
# ... editar archivos ...

# Validar localmente con LocalStack
export AWS_ENDPOINT_URL=http://localhost:4566
terraform fmt
terraform validate
terraform init -backend-config="endpoint=http://localhost:4566"
terraform plan

# Commit y push
git add .
git commit -m "feat: agregar nueva funcionalidad"
git push origin feature/nueva-funcionalidad
```

### 2. Pull Request con Validación LocalStack
```bash
# Crear PR en GitHub
# ↓
# Se ejecuta automáticamente el pipeline CI con LocalStack
# ↓
# Revisar el plan de Terraform en los comentarios
# ↓
# Verificar que todos los recursos se crean en LocalStack
# ↓
# Aprobar y mergear el PR
```

### 3. Despliegue Automático
```bash
# Al hacer merge a main:
# ↓
# Se ejecuta pipeline CD automáticamente con LocalStack
# ↓
# Despliega a DEV → luego a STAGING (usando LocalStack)
# ↓
# Para PROD: ejecutar manualmente el workflow
```

### 4. Verificación con LocalStack
```bash
# Verificar que todo funciona en LocalStack
curl http://localhost:8080  # dev
curl http://localhost:8081  # staging

# Verificar estado en S3 LocalStack
aws --endpoint-url=http://localhost:4566 s3 ls s3://terraform-state-roxs/

# Ver logs en GitHub Actions
# Verificar outputs de Terraform
```

---

## 🛠️ Comandos Útiles para CI/CD con LocalStack

### LocalStack Commands
```bash
# Iniciar LocalStack localmente
docker-compose -f docker-compose.localstack.yml up -d

# Verificar estado de LocalStack
curl http://localhost:4566/_localstack/health

# Listar servicios disponibles
curl http://localhost:4566/_localstack/info

# Ver buckets S3 en LocalStack
aws --endpoint-url=http://localhost:4566 s3 ls

# Verificar contenido del bucket de estado
aws --endpoint-url=http://localhost:4566 s3 ls s3://terraform-state-roxs/ --recursive
```

### Ver estado de workflows
```bash
# Usando GitHub CLI
gh workflow list
gh workflow view terraform-ci.yml
gh run list --workflow=terraform-cd.yml

# Ver logs de un run específico
gh run view 1234567890 --log
```

### Ejecutar workflows manualmente
```bash
# Desplegar a staging con LocalStack
gh workflow run terraform-cd.yml -f environment=staging -f action=apply

# Destruir ambiente de dev en LocalStack
gh workflow run terraform-destroy.yml -f environment=dev -f confirm=DESTROY
```

### Debugging de problemas con LocalStack
```bash
# Ver último run fallido
gh run list --limit 1 --status failure

# Verificar LocalStack logs
docker logs terraform-localstack

# Verificar conectividad a LocalStack
curl -f http://localhost:4566/_localstack/health

# Verificar secrets configurados
gh secret list
```

---

## 🧪 Testing del Pipeline con LocalStack

### Crear un PR de Prueba
```bash
# 1. Iniciar LocalStack localmente
docker-compose -f docker-compose.localstack.yml up -d

# 2. Crear cambio pequeño
echo "# Test change for LocalStack" >> README.md
git add README.md
git commit -m "test: pipeline CI/CD con LocalStack"
git push origin feature/test-pipeline-localstack

# 3. Crear PR y verificar que:
#    ✅ Se ejecuta el pipeline CI con LocalStack
#    ✅ LocalStack services están healthy
#    ✅ Se crea bucket S3 para estado
#    ✅ Aparece comentario con el plan
#    ✅ Todos los checks pasan

# 4. Mergear y verificar que:
#    ✅ Se ejecuta pipeline CD con LocalStack
#    ✅ Se despliega a dev y staging usando LocalStack
#    ✅ Estado se almacena en S3 LocalStack
#    ✅ La aplicación funciona
```

### Verificar Recursos en LocalStack
```bash
# Verificar que los recursos están siendo creados
aws --endpoint-url=http://localhost:4566 s3 ls
aws --endpoint-url=http://localhost:4566 ec2 describe-instances
aws --endpoint-url=http://localhost:4566 iam list-roles

# Verificar el estado de Terraform en S3
aws --endpoint-url=http://localhost:4566 s3 cp s3://terraform-state-roxs/workspaces/dev/terraform.tfstate - | jq '.'
```

---

## 💡 Mejores Prácticas con LocalStack

### 1. **Protección de Ramas**
```yaml
# En Settings → Branches → main
✅ Require pull request reviews
✅ Require status checks to pass
✅ Require branches to be up to date
✅ Include administrators
```

### 2. **LocalStack Configuration**
```bash
# ✅ Usar persistencia para mantener datos entre reinicios
# ✅ Configurar servicios específicos que necesitas
# ✅ Usar health checks en los pipelines
# ✅ Verificar connectivity antes de usar
# ❌ No usar LocalStack para producción real
```

### 3. **Secrets Management**
```bash
# ✅ Usar secrets de GitHub para passwords reales
# ✅ Usar credenciales 'test' para LocalStack
# ✅ Separar configuración por ambiente
# ❌ Nunca hardcodear secrets en código
```

### 4. **Environments Strategy**
```bash
# ✅ dev → automático con LocalStack, sin restricciones
# ✅ staging → automático con LocalStack, con reviewers opcionales  
# ✅ prod → manual, considerar AWS real para producción
```

### 5. **Monitoring y Debugging**
```yaml
# Configurar verificaciones para:
- LocalStack health status
- S3 bucket accessibility
- Terraform state integrity
- Pipeline performance
```

---

## 🚨 Troubleshooting Común con LocalStack

### 1. **Error: "LocalStack not ready"**
```bash
# Solución: Verificar health check
curl http://localhost:4566/_localstack/health

# Incrementar tiempo de espera
./scripts/wait-for-localstack.sh
```

### 2. **Error: "S3 bucket not found"**
```bash
# Verificar que el bucket existe
aws --endpoint-url=http://localhost:4566 s3 ls

# Recrear bucket si es necesario
aws --endpoint-url=http://localhost:4566 s3 mb s3://terraform-state-roxs
```

### 3. **Error: "Backend initialization failed"**
```bash
# Verificar configuración de backend
terraform init -backend-config="endpoint=http://localhost:4566" \
               -backend-config="access_key=test" \
               -backend-config="secret_key=test"
```

### 4. **Error: "Workspace doesn't exist"**
```bash
# Solución: Crear workspace automáticamente
terraform workspace select $ENV || terraform workspace new $ENV
```

### 5. **Pipeline muy lento con LocalStack**
```yaml
# Optimización: Cache de Terraform y LocalStack data
- name: Cache LocalStack data
  uses: actions/cache@v3
  with:
    path: /tmp/localstack
    key: ${{ runner.os }}-localstack-${{ hashFiles('docker-compose.localstack.yml') }}

- name: Cache Terraform
  uses: actions/cache@v3
  with:
    path: ~/.terraform.d/plugin-cache
    key: ${{ runner.os }}-terraform-${{ hashFiles('**/.terraform.lock.hcl') }}
```

### 6. **Error: "Port already in use"**
```bash
# Verificar puertos en uso
lsof -i :4566

# Parar contenedores conflictivos
docker stop $(docker ps -q --filter "publish=4566")
```

---

## ✅ ¿Qué Aprendiste Hoy?

✅ **CI/CD fundamentals** para Infrastructure as Code con LocalStack  
✅ **LocalStack integration** para simular AWS en pipelines  
✅ **S3 backend configuration** para estado remoto de Terraform  
✅ **GitHub Actions** con servicios de LocalStack  
✅ **Pipelines de validación** (CI) usando LocalStack  
✅ **Pipelines de despliegue** (CD) automáticos con LocalStack  
✅ **Backend S3 remoto** para múltiples workspaces  
✅ **Protection rules** y environments en GitHub  
✅ **Secrets management** con LocalStack  
✅ **Troubleshooting** de problemas específicos de LocalStack  
✅ **Testing y debugging** de infraestructura local  

---

## 🔮 ¿Qué Sigue Mañana?

Mañana en el **Día 28** - el gran final - tendremos:
- Estrategia para abordar el proyecto final con LocalStack
- Metodología de implementación híbrida (LocalStack + AWS)
- Planificación del desafío roxs-voting-app con CI/CD completo
- Consolidación de todos los conceptos DevOps + LocalStack

---

## 📚 Recursos Adicionales

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [LocalStack Documentation](https://docs.localstack.cloud/)
- [Terraform with GitHub Actions](https://learn.hashicorp.com/tutorials/terraform/github-actions)
- [LocalStack with Terraform](https://docs.localstack.cloud/user-guide/integrations/terraform/)
- [GitHub Environments](https://docs.github.com/en/actions/deployment/targeting-different-environments)
- [LocalStack S3 Backend](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/guides/custom-service-endpoints)

---

**💬 Comparte tu progreso en la comunidad con el hashtag #DevOpsConRoxs**

¡Excelente trabajo automatizando tus despliegues con CI/CD y LocalStack! 🚀🎉