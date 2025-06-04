---
title: Día 63 -  Desafío Final Semana 9
description: Tu primera infraestructura con Terraform
sidebar_position: 7
---


## Desafío Final: Tu primera infraestructura con Terraform

![](../../static/images/banner/9.png)

## 🏆 ¡El Gran Finale de la Semana 9!

¡Hola Roxs! Llegamos al último día de nuestra semana con LocalStack. Hoy vamos a usar **Terraform** para desplegar automáticamente toda la infraestructura que hemos estado creando manualmente.

¿Listos para automatizar como verdaderos DevOps Engineers? 🚀

---

## 🎯 ¿Qué es Terraform?

**Terraform** es una herramienta que te permite escribir tu infraestructura como código. En lugar de crear buckets, tablas y funciones manualmente, escribes un archivo que describe lo que quieres y Terraform lo crea automáticamente.

### 🌟 **¿Por qué usar Terraform?**
- ✅ **Reproducible**: La misma infraestructura siempre
- ✅ **Versionado**: Cambios en Git como cualquier código
- ✅ **Colaborativo**: Todo el equipo usa la misma definición
- ✅ **Destructible**: Eliminar todo con un comando
- ✅ **Documentado**: El código ES la documentación

---

## 🛠️ Instalación de Terraform

### **📦 Instalar Terraform**

```bash
# Ubuntu/Debian
wget -O- https://apt.releases.hashicorp.com/gpg | sudo gpg --dearmor -o /usr/share/keyrings/hashicorp-archive-keyring.gpg
echo "deb [signed-by=/usr/share/keyrings/hashicorp-archive-keyring.gpg] https://apt.releases.hashicorp.com $(lsb_release -cs) main" | sudo tee /etc/apt/sources.list.d/hashicorp.list
sudo apt update && sudo apt install terraform

# macOS con Homebrew
brew install terraform

# Verificar instalación
terraform --version
```

### **🚀 Verificar LocalStack**

```bash
# Asegurar que LocalStack esté corriendo
localstack start

# Verificar que está funcionando
curl http://localhost:4566/health
```

---

## 📁 Estructura del proyecto

```bash
# Crear carpeta del proyecto final
mkdir mi-infraestructura-terraform
cd mi-infraestructura-terraform

# Crear estructura simple
mkdir terraform
touch terraform/main.tf
touch terraform/outputs.tf

# Estructura final:
# mi-infraestructura-terraform/
# └── terraform/
#     ├── main.tf      (configuración principal)
#     └── outputs.tf   (información de salida)
```

---

## 🏗️ Nuestro primer archivo Terraform

### **⚙️ Configuración principal (main.tf)**

```hcl
# terraform/main.tf

# Configuración de Terraform y el provider de AWS
terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

# Configuración para conectar con LocalStack
provider "aws" {
  region                      = "us-east-1"
  access_key                 = "test"
  secret_key                 = "test"
  skip_credentials_validation = true
  skip_metadata_api_check     = true
  skip_requesting_account_id  = true

  # Endpoints para LocalStack
  endpoints {
    s3         = "http://localhost:4566"
    lambda     = "http://localhost:4566"
    dynamodb   = "http://localhost:4566"
    apigateway = "http://localhost:4566"
    iam        = "http://localhost:4566"
  }
}

# Variable para personalizar nombres
variable "student_name" {
  description = "Tu nombre para personalizar los recursos"
  type        = string
  default     = "estudiante-roxs"
}

# ==========================================
# 1. BUCKETS S3
# ==========================================

# Bucket para archivos
resource "aws_s3_bucket" "mi_bucket_archivos" {
  bucket = "mi-bucket-archivos-${var.student_name}"

  tags = {
    Name        = "Bucket de Archivos"
    Environment = "LocalStack"
    CreatedBy   = "Terraform"
    Student     = var.student_name
  }
}

# Bucket para logs
resource "aws_s3_bucket" "mi_bucket_logs" {
  bucket = "mi-bucket-logs-${var.student_name}"

  tags = {
    Name        = "Bucket de Logs"
    Environment = "LocalStack"
    CreatedBy   = "Terraform"
    Student     = var.student_name
  }
}

# ==========================================
# 2. TABLAS DYNAMODB
# ==========================================

# Tabla de usuarios
resource "aws_dynamodb_table" "mi_tabla_usuarios" {
  name           = "mi-tabla-usuarios-${var.student_name}"
  billing_mode   = "PROVISIONED"
  read_capacity  = 5
  write_capacity = 5
  hash_key       = "user_id"

  attribute {
    name = "user_id"
    type = "S"
  }

  tags = {
    Name        = "Tabla de Usuarios"
    Environment = "LocalStack"
    CreatedBy   = "Terraform"
    Student     = var.student_name
  }
}

# Tabla de posts
resource "aws_dynamodb_table" "mi_tabla_posts" {
  name           = "mi-tabla-posts-${var.student_name}"
  billing_mode   = "PROVISIONED"
  read_capacity  = 5
  write_capacity = 5
  hash_key       = "post_id"

  attribute {
    name = "post_id"
    type = "S"
  }

  tags = {
    Name        = "Tabla de Posts"
    Environment = "LocalStack"
    CreatedBy   = "Terraform"
    Student     = var.student_name
  }
}

# ==========================================
# 3. ROL IAM PARA LAMBDA
# ==========================================

# Rol para las funciones Lambda
resource "aws_iam_role" "mi_lambda_role" {
  name = "mi-lambda-role-${var.student_name}"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "lambda.amazonaws.com"
        }
      }
    ]
  })

  tags = {
    Name        = "Lambda Role"
    Environment = "LocalStack"
    CreatedBy   = "Terraform"
    Student     = var.student_name
  }
}

# Política para el rol Lambda
resource "aws_iam_role_policy" "mi_lambda_policy" {
  name = "mi-lambda-policy-${var.student_name}"
  role = aws_iam_role.mi_lambda_role.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "dynamodb:GetItem",
          "dynamodb:PutItem",
          "dynamodb:UpdateItem",
          "dynamodb:DeleteItem",
          "dynamodb:Query",
          "dynamodb:Scan"
        ]
        Resource = [
          aws_dynamodb_table.mi_tabla_usuarios.arn,
          aws_dynamodb_table.mi_tabla_posts.arn
        ]
      },
      {
        Effect = "Allow"
        Action = [
          "s3:GetObject",
          "s3:PutObject",
          "s3:DeleteObject"
        ]
        Resource = [
          "${aws_s3_bucket.mi_bucket_archivos.arn}/*",
          "${aws_s3_bucket.mi_bucket_logs.arn}/*"
        ]
      },
      {
        Effect = "Allow"
        Action = [
          "logs:CreateLogGroup",
          "logs:CreateLogStream",
          "logs:PutLogEvents"
        ]
        Resource = "arn:aws:logs:*:*:*"
      }
    ]
  })
}

# ==========================================
# 4. FUNCIÓN LAMBDA SIMPLE
# ==========================================

# Crear el archivo ZIP para Lambda
data "archive_file" "mi_lambda_zip" {
  type        = "zip"
  output_path = "mi_lambda.zip"
  source {
    content = <<EOF
import json
import boto3
from datetime import datetime

def lambda_handler(event, context):
    """
    Función Lambda simple creada con Terraform
    """
    print(f"Evento recibido: {json.dumps(event)}")
    
    # Información de la infraestructura
    response = {
        'statusCode': 200,
        'body': json.dumps({
            'message': '¡Hola desde Lambda creada con Terraform!',
            'student': '${var.student_name}',
            'timestamp': datetime.now().isoformat(),
            'event_received': event,
            'infrastructure': {
                'created_with': 'Terraform',
                'environment': 'LocalStack',
                'tables': ['mi-tabla-usuarios', 'mi-tabla-posts'],
                'buckets': ['mi-bucket-archivos', 'mi-bucket-logs']
            }
        })
    }
    
    print(f"Respuesta: {json.dumps(response)}")
    return response
EOF
    filename = "lambda_function.py"
  }
}

# Función Lambda
resource "aws_lambda_function" "mi_lambda" {
  filename         = data.archive_file.mi_lambda_zip.output_path
  function_name    = "mi-lambda-${var.student_name}"
  role            = aws_iam_role.mi_lambda_role.arn
  handler         = "lambda_function.lambda_handler"
  runtime         = "python3.9"
  timeout         = 30

  environment {
    variables = {
      TABLA_USUARIOS = aws_dynamodb_table.mi_tabla_usuarios.name
      TABLA_POSTS    = aws_dynamodb_table.mi_tabla_posts.name
      BUCKET_ARCHIVOS = aws_s3_bucket.mi_bucket_archivos.bucket
      BUCKET_LOGS     = aws_s3_bucket.mi_bucket_logs.bucket
      STUDENT_NAME    = var.student_name
    }
  }

  depends_on = [data.archive_file.mi_lambda_zip]

  tags = {
    Name        = "Mi Lambda Function"
    Environment = "LocalStack"
    CreatedBy   = "Terraform"
    Student     = var.student_name
  }
}
```

### **📊 Información de salida (outputs.tf)**

```hcl
# terraform/outputs.tf

# Mostrar información importante después del despliegue

output "resumen_infraestructura" {
  description = "Resumen de la infraestructura creada"
  value = {
    student_name = var.student_name
    region       = "us-east-1"
    environment  = "LocalStack"
  }
}

output "buckets_s3" {
  description = "Buckets S3 creados"
  value = {
    archivos = aws_s3_bucket.mi_bucket_archivos.bucket
    logs     = aws_s3_bucket.mi_bucket_logs.bucket
  }
}

output "tablas_dynamodb" {
  description = "Tablas DynamoDB creadas"
  value = {
    usuarios = aws_dynamodb_table.mi_tabla_usuarios.name
    posts    = aws_dynamodb_table.mi_tabla_posts.name
  }
}

output "lambda_function" {
  description = "Función Lambda creada"
  value = {
    name = aws_lambda_function.mi_lambda.function_name
    arn  = aws_lambda_function.mi_lambda.arn
  }
}

output "comandos_para_probar" {
  description = "Comandos para probar tu infraestructura"
  value = {
    listar_buckets = "awslocal s3 ls"
    listar_tablas  = "awslocal dynamodb list-tables"
    invocar_lambda = "awslocal lambda invoke --function-name ${aws_lambda_function.mi_lambda.function_name} output.json"
    ver_resultado  = "cat output.json"
  }
}
```

---

## 🚀 ¡Desplegar tu infraestructura!

### **📝 Paso 1: Inicializar Terraform**

```bash
# Ir a la carpeta de terraform
cd terraform

# Inicializar Terraform (solo la primera vez)
terraform init
```

**¿Qué hace `terraform init`?**
- Descarga el provider de AWS
- Configura el directorio de trabajo
- Prepara Terraform para funcionar

### **🔍 Paso 2: Validar la configuración**

```bash
# Verificar que no hay errores de sintaxis
terraform validate
```

Si hay errores, Terraform te dirá exactamente qué está mal y en qué línea.

### **📋 Paso 3: Ver qué se va a crear**

```bash
# Ver el plan de ejecución
terraform plan -var="student_name=TU_NOMBRE_AQUI"
```

**¿Qué hace `terraform plan`?**
- Muestra exactamente qué recursos se van a crear
- No crea nada, solo te muestra el plan
- Es como un "preview" antes de aplicar cambios

### **🎯 Paso 4: ¡Crear la infraestructura!**

```bash
# Aplicar la configuración
terraform apply -var="student_name=TU_NOMBRE_AQUI"
```

Terraform te preguntará si estás seguro. Escribe `yes` para continuar.

### **📊 Paso 5: Ver la información de salida**

```bash
# Ver todos los outputs
terraform output
```

---

## 🧪 Probar tu infraestructura

### **✅ Verificar que todo se creó correctamente**

```bash
# 1. Verificar buckets S3
awslocal s3 ls

# 2. Verificar tablas DynamoDB
awslocal dynamodb list-tables

# 3. Verificar función Lambda
awslocal lambda list-functions --query 'Functions[].FunctionName'

# 4. Probar la función Lambda
awslocal lambda invoke \
    --function-name mi-lambda-TU_NOMBRE \
    --payload '{"test": "Hola desde Terraform!"}' \
    output.json

# 5. Ver el resultado
cat output.json | jq
```

### **📝 Agregar datos de prueba**

```bash
# Agregar un usuario a DynamoDB
awslocal dynamodb put-item \
    --table-name mi-tabla-usuarios-TU_NOMBRE \
    --item '{
        "user_id": {"S": "user001"},
        "name": {"S": "Usuario Terraform"},
        "email": {"S": "usuario@terraform.local"},
        "created_by": {"S": "Terraform"}
    }'

# Verificar que se guardó
awslocal dynamodb get-item \
    --table-name mi-tabla-usuarios-TU_NOMBRE \
    --key '{"user_id": {"S": "user001"}}'

# Subir un archivo a S3
echo "Archivo creado con Terraform" > test-terraform.txt
awslocal s3 cp test-terraform.txt s3://mi-bucket-archivos-TU_NOMBRE/

# Verificar que se subió
awslocal s3 ls s3://mi-bucket-archivos-TU_NOMBRE/
```

---

## 🧹 Limpiar recursos

### **🗑️ Eliminar toda la infraestructura**

```bash
# Eliminar TODO lo que creamos
terraform destroy -var="student_name=TU_NOMBRE_AQUI"
```

Terraform te preguntará si estás seguro. Escribe `yes` para eliminar todo.

**¡Esto es la magia de Terraform!** 
- Con un comando creates toda tu infraestructura
- Con otro comando la eliminas completamente
- Todo está documentado en código

---

## 📚 Script de automatización

### **🤖 Script para facilitar el proceso**

```bash
#!/bin/bash
# deploy.sh - Script simple para desplegar con Terraform

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 Script de despliegue con Terraform${NC}"
echo "======================================"

# Verificar que se proporcionó el nombre
if [ -z "$1" ]; then
    echo -e "${RED}❌ Error: Debes proporcionar tu nombre${NC}"
    echo -e "${YELLOW}Uso: $0 TU_NOMBRE${NC}"
    echo -e "${YELLOW}Ejemplo: $0 maria-rodriguez${NC}"
    exit 1
fi

STUDENT_NAME=$1
echo -e "${BLUE}👤 Estudiante: $STUDENT_NAME${NC}"

# Verificar LocalStack
echo -e "${BLUE}🔍 Verificando LocalStack...${NC}"
if ! curl -s http://localhost:4566/health > /dev/null; then
    echo -e "${RED}❌ LocalStack no está corriendo${NC}"
    echo -e "${YELLOW}Inicia LocalStack con: localstack start${NC}"
    exit 1
fi
echo -e "${GREEN}✅ LocalStack está funcionando${NC}"

# Verificar Terraform
echo -e "${BLUE}🔍 Verificando Terraform...${NC}"
if ! command -v terraform &> /dev/null; then
    echo -e "${RED}❌ Terraform no está instalado${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Terraform está instalado${NC}"

# Ir al directorio de terraform
cd terraform

# Inicializar si es necesario
if [ ! -f ".terraform.lock.hcl" ]; then
    echo -e "${BLUE}🏗️ Inicializando Terraform...${NC}"
    terraform init
fi

# Validar configuración
echo -e "${BLUE}🔍 Validando configuración...${NC}"
if ! terraform validate; then
    echo -e "${RED}❌ Error en la configuración de Terraform${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Configuración válida${NC}"

# Mostrar plan
echo -e "${BLUE}📋 Mostrando plan de ejecución...${NC}"
terraform plan -var="student_name=$STUDENT_NAME"

# Preguntar si continuar
echo -e "${YELLOW}¿Quieres aplicar estos cambios? (y/N)${NC}"
read -r response
if [[ ! "$response" =~ ^[Yy]$ ]]; then
    echo -e "${YELLOW}ℹ️ Operación cancelada${NC}"
    exit 0
fi

# Aplicar configuración
echo -e "${BLUE}🚀 Desplegando infraestructura...${NC}"
if terraform apply -var="student_name=$STUDENT_NAME" -auto-approve; then
    echo -e "${GREEN}✅ ¡Despliegue exitoso!${NC}"
    
    # Mostrar outputs
    echo -e "${BLUE}📊 Información de la infraestructura:${NC}"
    terraform output
    
    echo ""
    echo -e "${GREEN}🎉 ¡Tu infraestructura está lista!${NC}"
    echo -e "${YELLOW}🧪 Prueba los comandos que aparecen en 'comandos_para_probar'${NC}"
    echo -e "${YELLOW}🧹 Para eliminar todo: terraform destroy -var=\"student_name=$STUDENT_NAME\"${NC}"
else
    echo -e "${RED}❌ Error en el despliegue${NC}"
    exit 1
fi
```

### **🎯 Usar el script**

```bash
# Hacer el script ejecutable
chmod +x deploy.sh

# Ejecutar con tu nombre
./deploy.sh tu-nombre-aqui
```

---

## 💡 Tarea del Día

### 📝 **Parte 1: Setup inicial** (20 minutos)

1. **Crear estructura del proyecto**:
   ```bash
   mkdir mi-primer-terraform
   cd mi-primer-terraform
   mkdir terraform
   ```

2. **Crear archivos Terraform**:
   - Copia el contenido de `main.tf`
   - Copia el contenido de `outputs.tf`

3. **Verificar LocalStack**:
   ```bash
   localstack start
   curl http://localhost:4566/health
   ```

### 🚀 **Parte 2: Primer despliegue** (25 minutos)

1. **Inicializar Terraform**:
   ```bash
   cd terraform
   terraform init
   ```

2. **Validar configuración**:
   ```bash
   terraform validate
   ```

3. **Ver el plan**:
   ```bash
   terraform plan -var="student_name=tu-nombre"
   ```

4. **Desplegar infraestructura**:
   ```bash
   terraform apply -var="student_name=tu-nombre"
   ```

5. **Ver los outputs**:
   ```bash
   terraform output
   ```

### 🧪 **Parte 3: Probar la infraestructura** (15 minutos)

1. **Verificar recursos creados**:
   ```bash
   awslocal s3 ls
   awslocal dynamodb list-tables
   awslocal lambda list-functions
   ```

2. **Probar la función Lambda**:
   ```bash
   awslocal lambda invoke \
       --function-name mi-lambda-tu-nombre \
       --payload '{"mensaje": "Hola Terraform!"}' \
       resultado.json
   
   cat resultado.json
   ```

3. **Agregar datos de prueba**:
   ```bash
   # Usuario en DynamoDB
   awslocal dynamodb put-item \
       --table-name mi-tabla-usuarios-tu-nombre \
       --item '{"user_id": {"S": "test001"}, "name": {"S": "Usuario Test"}}'
   
   # Archivo en S3
   echo "Mi primer archivo con Terraform" > test.txt
   awslocal s3 cp test.txt s3://mi-bucket-archivos-tu-nombre/
   ```

### 📸 **Parte 4: Evidencia y análisis**

**Screenshots a tomar**:
1. **Terraform init exitoso**
2. **Terraform plan output**
3. **Terraform apply exitoso** 
4. **Terraform output con todos los recursos**
5. **awslocal s3 ls** mostrando tus buckets
6. **awslocal dynamodb list-tables** mostrando tus tablas
7. **Resultado de invocar tu función Lambda**

### 🧹 **Parte 5: Limpieza**

1. **Eliminar toda la infraestructura**:
   ```bash
   terraform destroy -var="student_name=tu-nombre"
   ```

2. **Verificar que todo se eliminó**:
   ```bash
   awslocal s3 ls
   awslocal dynamodb list-tables
   awslocal lambda list-functions
   ```

---

## 📤 **Compartir en Discord**

**Mensaje para el canal #semana9-localstack:**

```
🎉 ¡COMPLETÉ MI PRIMERA INFRAESTRUCTURA CON TERRAFORM! 🎉

👤 **Estudiante**: [TU_NOMBRE]
🏗️ **Herramientas**: Terraform + LocalStack

📊 **Mi infraestructura incluye**:
✅ 2 buckets S3 (archivos y logs)
✅ 2 tablas DynamoDB (usuarios y posts)  
✅ 1 función Lambda funcional
✅ Rol IAM con permisos correctos

🔥 **Lo más emocionante**:
[Comparte qué te gustó más del proceso]

💡 **Lección clave**:
[Qué aprendiste sobre Infrastructure as Code]

🚀 **Próximo paso**:
¡Usar esto en un proyecto real!

#Terraform #LocalStack #InfrastructureAsCode #DevOps #Semana9
```

**Incluir**:
- Screenshot del `terraform apply` exitoso
- Screenshot de `terraform output`
- Screenshot mostrando recursos creados en LocalStack

---

## 🎓 Reflexión de la semana

### **🌟 Lo que lograste esta semana**:
- ✅ **Día 59**: Dominaste S3 localmente
- ✅ **Día 60**: Creaste funciones Lambda  
- ✅ **Día 61**: Trabajaste con DynamoDB
- ✅ **Día 62**: Integraste múltiples servicios
- ✅ **Día 63**: Automatizaste todo con Terraform

### **💪 Habilidades nuevas**:
- **Infrastructure as Code**: Definir infraestructura en archivos
- **Terraform**: Herramienta líder en IaC
- **LocalStack**: Desarrollo cloud local
- **AWS Services**: S3, Lambda, DynamoDB
- **Automation**: Scripts y procesos automatizados

### **🚀 De cara al futuro**:
Ahora puedes:
- Crear infraestructura AWS real con Terraform
- Trabajar en equipos con infraestructura versionada
- Implementar CI/CD para infraestructura
- Crear entornos reproducibles
- Escalar aplicaciones en la nube

---

## 🎉 **¡Felicitaciones!**

**Has completado exitosamente la Semana 9 de "90 días de DevOps con Roxs".**

Pasaste de crear recursos manualmente a automatizar infraestructura completa con código. Esta es una habilidad súper valiosa en el mundo DevOps actual.

---

## 🔮 **Próximos pasos sugeridos**:

1. **Practica más Terraform** con otros providers (Azure, GCP)
2. **Aprende Terraform Cloud** para colaboración en equipo
3. **Implementa CI/CD** para tu infraestructura
4. **Explora módulos de Terraform** para reutilización
5. **Combina con Ansible** para configuración de servidores

¡Sigue así! 🚀✨