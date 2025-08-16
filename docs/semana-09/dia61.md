---
title: Día 61 - Simula DynamoDB con LocalStack
description: Aprende a crear y consultar una tabla DynamoDB simulada localmente usando LocalStack.
sidebar_position: 5
---
## Simula DynamoDB con LocalStack

![](../../static/images/banner/9.png)

## 🗃️ ¡Bienvenidos al mundo NoSQL!

¡Hola Roxs! Ya tenemos S3 para almacenamiento y Lambda para cómputo. Hoy agregamos la pieza que falta: **DynamoDB** - la base de datos NoSQL de AWS.

¿Listos para crear bases de datos súper rápidas sin esquemas fijos? 🚀

---

## 🧠 ¿Qué es Amazon DynamoDB?

**Amazon DynamoDB** es una base de datos NoSQL completamente administrada, diseñada para aplicaciones que necesitan latencia consistente de un solo dígito de milisegundo a cualquier escala.

### 🎯 **Conceptos clave:**
- **Table**: Una colección de datos (como una tabla en SQL)
- **Item**: Un registro individual (como una fila)
- **Attribute**: Un campo de datos (como una columna)
- **Primary Key**: Identifica únicamente cada item
- **Partition Key**: Distribuye los datos entre particiones
- **Sort Key**: Ordena items dentro de una partición

### 🔑 **Tipos de Primary Keys:**
1. **Simple**: Solo Partition Key
2. **Composite**: Partition Key + Sort Key

### 🌟 **¿Por qué DynamoDB?**
- ⚡ **Súper rápido**: Latencia en milisegundos
- 🔄 **Auto-scaling**: Maneja cualquier carga
- 🛡️ **Serverless**: Sin administración de servidores
- 💰 **Pay-per-use**: Solo pagas lo que usas
- 🔒 **Seguro**: Encripción automática
- 🌐 **Global**: Replicación multi-región

### 📊 **Casos de uso típicos:**
- 🎮 **Gaming leaderboards**
- 🛒 **E-commerce carts**
- 📱 **Mobile app backends**
- 📊 **Real-time analytics**
- 💬 **Chat applications**
- 🔐 **Session storage**
- 📈 **IoT data collection**

---

## 🚀 Preparando el entorno

### **Verificar que LocalStack esté corriendo**

```bash
# Iniciar LocalStack si no está corriendo
localstack start

# Verificar que DynamoDB esté disponible
curl http://localhost:4566/health | jq '.services.dynamodb'

# Debería mostrar: "available" o "running"
```

### **Verificar herramientas**

```bash
# Verificar awslocal
awslocal dynamodb list-tables

# Debería retornar: {"TableNames": []}
```

---

## 🏗️ Crear tu primera tabla

### **📋 Tabla básica con Primary Key simple**

```bash
# Crear tabla de usuarios con solo Partition Key
awslocal dynamodb create-table \
    --table-name RoxsUsers \
    --attribute-definitions \
        AttributeName=UserId,AttributeType=S \
    --key-schema \
        AttributeName=UserId,KeyType=HASH \
    --provisioned-throughput \
        ReadCapacityUnits=5,WriteCapacityUnits=5
```

### **📊 Tabla avanzada con Composite Key**

```bash
# Crear tabla de posts con Partition Key + Sort Key
awslocal dynamodb create-table \
    --table-name RoxsPosts \
    --attribute-definitions \
        AttributeName=UserId,AttributeType=S \
        AttributeName=PostId,AttributeType=S \
    --key-schema \
        AttributeName=UserId,KeyType=HASH \
        AttributeName=PostId,KeyType=RANGE \
    --provisioned-throughput \
        ReadCapacityUnits=5,WriteCapacityUnits=5
```

### **⏰ Tabla con timestamps**

```bash
# Crear tabla de eventos con timestamp como Sort Key
awslocal dynamodb create-table \
    --table-name RoxsEvents \
    --attribute-definitions \
        AttributeName=EventType,AttributeType=S \
        AttributeName=Timestamp,AttributeType=N \
    --key-schema \
        AttributeName=EventType,KeyType=HASH \
        AttributeName=Timestamp,KeyType=RANGE \
    --provisioned-throughput \
        ReadCapacityUnits=5,WriteCapacityUnits=5
```

### **🔍 Verificar tablas creadas**

```bash
# Listar todas las tablas
awslocal dynamodb list-tables

# Ver detalles de una tabla específica
awslocal dynamodb describe-table --table-name RoxsUsers

# Ver schema de la tabla
awslocal dynamodb describe-table --table-name RoxsUsers \
    --query 'Table.[TableName,KeySchema,AttributeDefinitions]'
```

---

## 📤 Insertar datos (PUT)

### **👤 Insertar usuarios**

```bash
# Usuario 1 - Estructura básica
awslocal dynamodb put-item \
    --table-name RoxsUsers \
    --item '{
        "UserId": {"S": "user001"},
        "Name": {"S": "Ana García"},
        "Email": {"S": "ana@roxs.com"},
        "Age": {"N": "28"},
        "Skills": {"SS": ["Python", "AWS", "DevOps"]},
        "IsActive": {"BOOL": true},
        "JoinDate": {"S": "2024-06-01"}
    }'

# Usuario 2 - Con más atributos
awslocal dynamodb put-item \
    --table-name RoxsUsers \
    --item '{
        "UserId": {"S": "user002"},
        "Name": {"S": "Carlos López"},
        "Email": {"S": "carlos@roxs.com"},
        "Age": {"N": "32"},
        "Skills": {"SS": ["JavaScript", "Docker", "Kubernetes"]},
        "IsActive": {"BOOL": true},
        "JoinDate": {"S": "2024-05-15"},
        "Department": {"S": "Engineering"},
        "Salary": {"N": "75000"}
    }'

# Usuario 3 - Estructura diferente (NoSQL flexibility!)
awslocal dynamodb put-item \
    --table-name RoxsUsers \
    --item '{
        "UserId": {"S": "user003"},
        "Name": {"S": "María Rodríguez"},
        "Email": {"S": "maria@roxs.com"},
        "Age": {"N": "25"},
        "Skills": {"SS": ["Java", "Spring", "Microservices"]},
        "IsActive": {"BOOL": false},
        "JoinDate": {"S": "2024-04-20"},
        "Projects": {"L": [
            {"S": "Project Alpha"},
            {"S": "Project Beta"}
        ]},
        "Preferences": {"M": {
            "Theme": {"S": "dark"},
            "Language": {"S": "es"},
            "Notifications": {"BOOL": true}
        }}
    }'
```

### **📝 Insertar posts**

```bash
# Post 1
awslocal dynamodb put-item \
    --table-name RoxsPosts \
    --item '{
        "UserId": {"S": "user001"},
        "PostId": {"S": "post001"},
        "Title": {"S": "Mi experiencia con LocalStack"},
        "Content": {"S": "LocalStack es increíble para desarrollo local..."},
        "CreatedAt": {"S": "2024-06-03T10:00:00Z"},
        "Tags": {"SS": ["localstack", "aws", "development"]},
        "Likes": {"N": "15"},
        "Views": {"N": "120"}
    }'

# Post 2
awslocal dynamodb put-item \
    --table-name RoxsPosts \
    --item '{
        "UserId": {"S": "user001"},
        "PostId": {"S": "post002"},
        "Title": {"S": "DynamoDB vs SQL: ¿Cuándo usar cada uno?"},
        "Content": {"S": "La elección entre NoSQL y SQL depende de varios factores..."},
        "CreatedAt": {"S": "2024-06-02T14:30:00Z"},
        "Tags": {"SS": ["database", "nosql", "sql"]},
        "Likes": {"N": "8"},
        "Views": {"N": "95"}
    }'

# Post de otro usuario
awslocal dynamodb put-item \
    --table-name RoxsPosts \
    --item '{
        "UserId": {"S": "user002"},
        "PostId": {"S": "post001"},
        "Title": {"S": "Kubernetes en producción"},
        "Content": {"S": "Lecciones aprendidas después de 2 años con K8s..."},
        "CreatedAt": {"S": "2024-06-01T09:15:00Z"},
        "Tags": {"SS": ["kubernetes", "devops", "production"]},
        "Likes": {"N": "23"},
        "Views": {"N": "189"}
    }'
```

### **📊 Insertar eventos**

```bash
# Eventos de login
awslocal dynamodb put-item \
    --table-name RoxsEvents \
    --item '{
        "EventType": {"S": "login"},
        "Timestamp": {"N": "1717401600"},
        "UserId": {"S": "user001"},
        "IP": {"S": "192.168.1.100"},
        "UserAgent": {"S": "Chrome/124.0"},
        "Success": {"BOOL": true}
    }'

# Evento de error
awslocal dynamodb put-item \
    --table-name RoxsEvents \
    --item '{
        "EventType": {"S": "error"},
        "Timestamp": {"N": "1717401700"},
        "ErrorCode": {"S": "500"},
        "Message": {"S": "Database connection timeout"},
        "Service": {"S": "api-gateway"},
        "Severity": {"S": "high"}
    }'
```

---

## 📥 Consultar datos (GET)

### **🔍 Consultas por Primary Key**

```bash
# Obtener usuario específico
awslocal dynamodb get-item \
    --table-name RoxsUsers \
    --key '{"UserId": {"S": "user001"}}'

# Obtener post específico (requiere Partition + Sort Key)
awslocal dynamodb get-item \
    --table-name RoxsPosts \
    --key '{
        "UserId": {"S": "user001"},
        "PostId": {"S": "post001"}
    }'

# Obtener solo ciertos atributos
awslocal dynamodb get-item \
    --table-name RoxsUsers \
    --key '{"UserId": {"S": "user002"}}' \
    --projection-expression "Name,Email,Skills"
```

### **📋 Escanear toda la tabla**

```bash
# Escanear todos los usuarios
awslocal dynamodb scan --table-name RoxsUsers

# Escanear con filtro
awslocal dynamodb scan \
    --table-name RoxsUsers \
    --filter-expression "Age > :age" \
    --expression-attribute-values '{":age": {"N": "30"}}'

# Escanear solo campos específicos
awslocal dynamodb scan \
    --table-name RoxsUsers \
    --projection-expression "UserId,Name,Email"
```

### **🎯 Consultas (Query) - Más eficientes**

```bash
# Obtener todos los posts de un usuario
awslocal dynamodb query \
    --table-name RoxsPosts \
    --key-condition-expression "UserId = :userId" \
    --expression-attribute-values '{":userId": {"S": "user001"}}'

# Consultar eventos por tipo en un rango de tiempo
awslocal dynamodb query \
    --table-name RoxsEvents \
    --key-condition-expression "EventType = :type AND #ts BETWEEN :start AND :end" \
    --expression-attribute-names '{"#ts": "Timestamp"}' \
    --expression-attribute-values '{
        ":type": {"S": "login"},
        ":start": {"N": "1717401000"},
        ":end": {"N": "1717401800"}
    }'
```

---

## 🔄 Actualizar datos (UPDATE)

### **✏️ Actualizar atributos específicos**

```bash
# Actualizar edad y agregar nuevo skill
awslocal dynamodb update-item \
    --table-name RoxsUsers \
    --key '{"UserId": {"S": "user001"}}' \
    --update-expression "SET Age = :newAge, Skills = list_append(Skills, :newSkill)" \
    --expression-attribute-values '{
        ":newAge": {"N": "29"},
        ":newSkill": {"SS": ["LocalStack"]}
    }'

# Incrementar contador de likes
awslocal dynamodb update-item \
    --table-name RoxsPosts \
    --key '{
        "UserId": {"S": "user001"},
        "PostId": {"S": "post001"}
    }' \
    --update-expression "ADD Likes :inc" \
    --expression-attribute-values '{":inc": {"N": "1"}}'

# Agregar nuevo atributo
awslocal dynamodb update-item \
    --table-name RoxsUsers \
    --key '{"UserId": {"S": "user003"}}' \
    --update-expression "SET LastLogin = :login" \
    --expression-attribute-values '{":login": {"S": "2024-06-03T15:30:00Z"}}'
```

### **🔄 Operaciones condicionales**

```bash
# Actualizar solo si el usuario está activo
awslocal dynamodb update-item \
    --table-name RoxsUsers \
    --key '{"UserId": {"S": "user002"}}' \
    --update-expression "SET LastSeen = :now" \
    --condition-expression "IsActive = :active" \
    --expression-attribute-values '{
        ":now": {"S": "2024-06-03T16:00:00Z"},
        ":active": {"BOOL": true}
    }'
```

---

## 🗑️ Eliminar datos (DELETE)

### **❌ Eliminar items específicos**

```bash
# Eliminar usuario
awslocal dynamodb delete-item \
    --table-name RoxsUsers \
    --key '{"UserId": {"S": "user003"}}'

# Eliminar post específico
awslocal dynamodb delete-item \
    --table-name RoxsPosts \
    --key '{
        "UserId": {"S": "user002"},
        "PostId": {"S": "post001"}
    }'

# Eliminar solo si existe
awslocal dynamodb delete-item \
    --table-name RoxsUsers \
    --key '{"UserId": {"S": "user999"}}' \
    --condition-expression "attribute_exists(UserId)"
```

---

## 🔧 Operaciones batch

### **📤 Batch Write (múltiples operaciones)**

```bash
# Crear archivo JSON para batch operations
cat > batch-operations.json << 'EOF'
{
    "RoxsUsers": [
        {
            "PutRequest": {
                "Item": {
                    "UserId": {"S": "batch001"},
                    "Name": {"S": "Usuario Batch 1"},
                    "Email": {"S": "batch1@roxs.com"},
                    "Age": {"N": "30"}
                }
            }
        },
        {
            "PutRequest": {
                "Item": {
                    "UserId": {"S": "batch002"},
                    "Name": {"S": "Usuario Batch 2"},
                    "Email": {"S": "batch2@roxs.com"},
                    "Age": {"N": "25"}
                }
            }
        }
    ]
}
EOF

# Ejecutar batch write
awslocal dynamodb batch-write-item --request-items file://batch-operations.json
```

### **📥 Batch Get (múltiples consultas)**

```bash
# Crear archivo para batch get
cat > batch-get.json << 'EOF'
{
    "RoxsUsers": {
        "Keys": [
            {"UserId": {"S": "user001"}},
            {"UserId": {"S": "batch001"}},
            {"UserId": {"S": "batch002"}}
        ],
        "ProjectionExpression": "UserId,Name,Email"
    }
}
EOF

# Ejecutar batch get
awslocal dynamodb batch-get-item --request-items file://batch-get.json
```

---

## 🔗 Integración Lambda + DynamoDB

### **🐍 Función Lambda que usa DynamoDB**

```python
# lambda_dynamodb.py
import json
import boto3
from datetime import datetime
import uuid

def lambda_handler(event, context):
    """
    Función Lambda que interactúa con DynamoDB
    """
    print(f"Event: {json.dumps(event)}")
    
    # Cliente DynamoDB para LocalStack
    dynamodb = boto3.client(
        'dynamodb',
        endpoint_url='http://localhost:4566',
        aws_access_key_id='test',
        aws_secret_access_key='test',
        region_name='us-east-1'
    )
    
    # También podemos usar resource (más pythónico)
    dynamodb_resource = boto3.resource(
        'dynamodb',
        endpoint_url='http://localhost:4566',
        aws_access_key_id='test',
        aws_secret_access_key='test',
        region_name='us-east-1'
    )
    
    action = event.get('action', 'list')
    table_name = event.get('table', 'RoxsUsers')
    
    try:
        if action == 'create_user':
            # Crear nuevo usuario
            user_data = event['user_data']
            user_id = str(uuid.uuid4())
            
            response = dynamodb.put_item(
                TableName=table_name,
                Item={
                    'UserId': {'S': user_id},
                    'Name': {'S': user_data['name']},
                    'Email': {'S': user_data['email']},
                    'CreatedAt': {'S': datetime.now().isoformat()},
                    'IsActive': {'BOOL': True}
                }
            )
            
            return {
                'statusCode': 200,
                'body': json.dumps({
                    'message': 'Usuario creado exitosamente',
                    'user_id': user_id
                })
            }
            
        elif action == 'get_user':
            # Obtener usuario específico
            user_id = event['user_id']
            
            response = dynamodb.get_item(
                TableName=table_name,
                Key={'UserId': {'S': user_id}}
            )
            
            if 'Item' in response:
                # Simplificar el formato DynamoDB
                user = {}
                for key, value in response['Item'].items():
                    if 'S' in value:
                        user[key] = value['S']
                    elif 'N' in value:
                        user[key] = int(value['N'])
                    elif 'BOOL' in value:
                        user[key] = value['BOOL']
                
                return {
                    'statusCode': 200,
                    'body': json.dumps({
                        'user': user
                    })
                }
            else:
                return {
                    'statusCode': 404,
                    'body': json.dumps({'error': 'Usuario no encontrado'})
                }
                
        elif action == 'list_users':
            # Listar todos los usuarios
            response = dynamodb.scan(TableName=table_name)
            
            users = []
            for item in response.get('Items', []):
                user = {}
                for key, value in item.items():
                    if 'S' in value:
                        user[key] = value['S']
                    elif 'N' in value:
                        user[key] = int(value['N'])
                    elif 'BOOL' in value:
                        user[key] = value['BOOL']
                users.append(user)
            
            return {
                'statusCode': 200,
                'body': json.dumps({
                    'users': users,
                    'count': len(users)
                })
            }
            
        elif action == 'update_user':
            # Actualizar usuario
            user_id = event['user_id']
            updates = event['updates']
            
            # Construir expression dinámicamente
            update_expression = "SET "
            expression_values = {}
            
            for key, value in updates.items():
                update_expression += f"{key} = :{key}, "
                if isinstance(value, str):
                    expression_values[f":{key}"] = {'S': value}
                elif isinstance(value, int):
                    expression_values[f":{key}"] = {'N': str(value)}
                elif isinstance(value, bool):
                    expression_values[f":{key}"] = {'BOOL': value}
            
            update_expression = update_expression.rstrip(', ')
            
            response = dynamodb.update_item(
                TableName=table_name,
                Key={'UserId': {'S': user_id}},
                UpdateExpression=update_expression,
                ExpressionAttributeValues=expression_values,
                ReturnValues='ALL_NEW'
            )
            
            return {
                'statusCode': 200,
                'body': json.dumps({
                    'message': 'Usuario actualizado exitosamente'
                })
            }
            
        else:
            return {
                'statusCode': 400,
                'body': json.dumps({'error': f'Acción no válida: {action}'})
            }
            
    except Exception as e:
        print(f"Error: {str(e)}")
        return {
            'statusCode': 500,
            'body': json.dumps({'error': str(e)})
        }
```

### **🚀 Desplegar función Lambda**

```bash
# Empaquetar función
zip lambda-dynamodb.zip lambda_dynamodb.py

# Crear función
awslocal lambda create-function \
    --function-name roxs-dynamodb-function \
    --runtime python3.9 \
    --role arn:aws:iam::000000000000:role/lambda-role \
    --handler lambda_dynamodb.lambda_handler \
    --zip-file fileb://lambda-dynamodb.zip \
    --timeout 30 \
    --description "Función Lambda que interactúa con DynamoDB"
```

### **🧪 Probar integración**

```bash
# Crear usuario
awslocal lambda invoke \
    --function-name roxs-dynamodb-function \
    --payload '{
        "action": "create_user",
        "user_data": {
            "name": "Lambda User",
            "email": "lambda@roxs.com"
        }
    }' \
    lambda-create-output.json

cat lambda-create-output.json

# Listar usuarios
awslocal lambda invoke \
    --function-name roxs-dynamodb-function \
    --payload '{"action": "list_users"}' \
    lambda-list-output.json

cat lambda-list-output.json

# Obtener usuario específico
awslocal lambda invoke \
    --function-name roxs-dynamodb-function \
    --payload '{
        "action": "get_user",
        "user_id": "user001"
    }' \
    lambda-get-output.json
```

---

## 📊 Análisis y estadísticas

### **📈 Script de estadísticas**

```bash
#!/bin/bash
# dynamodb-stats.sh

echo "📊 Estadísticas de DynamoDB LocalStack"
echo "======================================"

echo "🗂️  Total de tablas:"
awslocal dynamodb list-tables --query 'length(TableNames)'

echo ""
echo "📋 Lista de tablas:"
awslocal dynamodb list-tables --query 'TableNames' --output table

echo ""
echo "📄 Items por tabla:"
for table in $(awslocal dynamodb list-tables --query 'TableNames[]' --output text); do
    count=$(awslocal dynamodb scan --table-name $table --select COUNT --query 'Count')
    echo "  $table: $count items"
done

echo ""
echo "🔧 Configuración de tablas:"
for table in $(awslocal dynamodb list-tables --query 'TableNames[]' --output text); do
    echo "  === $table ==="
    awslocal dynamodb describe-table --table-name $table \
        --query 'Table.[KeySchema,ProvisionedThroughput]' --output table
done
```

### **🧹 Script de limpieza**

```bash
#!/bin/bash
# cleanup-dynamodb.sh

echo "🧹 Limpiando DynamoDB LocalStack..."

# Eliminar todos los items de todas las tablas
for table in $(awslocal dynamodb list-tables --query 'TableNames[]' --output text); do
    echo "Limpiando tabla: $table"
    
    # Obtener schema de la tabla para identificar keys
    keys=$(awslocal dynamodb describe-table --table-name $table \
        --query 'Table.KeySchema[].AttributeName' --output text)
    
    # Scan para obtener todas las keys
    awslocal dynamodb scan --table-name $table \
        --projection-expression "$keys" \
        --query 'Items[]' --output json > /tmp/${table}_keys.json
    
    # Eliminar items uno por uno (en un script real usarías batch-write)
    # Este es solo para demo
    echo "  Items encontrados para eliminar..."
done

echo "✅ Limpieza completa! (Nota: implementación simplificada)"
```

---

## 💡 Tarea del Día

### 📝 **Parte 1: Crear tu esquema de datos** (20 minutos)

1. **Crear tabla de perfiles de estudiantes**:
   ```bash
   awslocal dynamodb create-table \
       --table-name RoxsStudents \
       --attribute-definitions \
           AttributeName=StudentId,AttributeType=S \
       --key-schema \
           AttributeName=StudentId,KeyType=HASH \
       --provisioned-throughput \
           ReadCapacityUnits=5,WriteCapacityUnits=5
   ```

2. **Crear tabla de progreso diario**:
   ```bash
   awslocal dynamodb create-table \
       --table-name RoxsProgress \
       --attribute-definitions \
           AttributeName=StudentId,AttributeType=S \
           AttributeName=Day,AttributeType=N \
       --key-schema \
           AttributeName=StudentId,KeyType=HASH \
           AttributeName=Day,KeyType=RANGE \
       --provisioned-throughput \
           ReadCapacityUnits=5,WriteCapacityUnits=5
   ```

### 📤 **Parte 2: Poblar con datos** (15 minutos)

1. **Agregar tu perfil**:
   ```bash
   awslocal dynamodb put-item \
       --table-name RoxsStudents \
       --item '{
           "StudentId": {"S": "TU_NOMBRE_AQUI"},
           "Name": {"S": "Tu Nombre Real"},
           "Email": {"S": "tu-email@ejemplo.com"},
           "StartDate": {"S": "2024-05-01"},
           "Country": {"S": "Tu País"},
           "TechSkills": {"SS": ["Skill1", "Skill2", "Skill3"]},
           "CurrentDay": {"N": "61"},
           "IsActive": {"BOOL": true}
       }'
   ```

2. **Agregar tu progreso hasta hoy**:
   ```bash
   # Día 59 - S3
   awslocal dynamodb put-item \
       --table-name RoxsProgress \
       --item '{
           "StudentId": {"S": "TU_NOMBRE_AQUI"},
           "Day": {"N": "59"},
           "Topic": {"S": "S3 con LocalStack"},
           "Completed": {"BOOL": true},
           "Notes": {"S": "Aprendí a simular S3 localmente"},
           "Difficulty": {"N": "3"},
           "CompletedAt": {"S": "2024-06-01T18:00:00Z"}
       }'
   
   # Día 60 - Lambda
   awslocal dynamodb put-item \
       --table-name RoxsProgress \
       --item '{
           "StudentId": {"S": "TU_NOMBRE_AQUI"},
           "Day": {"N": "60"},
           "Topic": {"S": "Lambda con LocalStack"},
           "Completed": {"BOOL": true},
           "Notes": {"S": "Creé funciones serverless locales"},
           "Difficulty": {"N": "4"},
           "CompletedAt": {"S": "2024-06-02T19:30:00Z"}
       }'
   
   # Día 61 - DynamoDB (hoy)
   awslocal dynamodb put-item \
       --table-name RoxsProgress \
       --item '{
           "StudentId": {"S": "TU_NOMBRE_AQUI"},
           "Day": {"N": "61"},
           "Topic": {"S": "DynamoDB con LocalStack"},
           "Completed": {"BOOL": true},
           "Notes": {"S": "Bases de datos NoSQL son increíbles"},
           "Difficulty": {"N": "4"},
           "CompletedAt": {"S": "2024-06-03T20:00:00Z"}
       }'
   ```

### 🔍 **Parte 3: Consultas y análisis** (10 minutos)

1. **Consultar tu perfil**:
   ```bash
   awslocal dynamodb get-item \
       --table-name RoxsStudents \
       --key '{"StudentId": {"S": "TU_NOMBRE_AQUI"}}'
   ```

2. **Ver todo tu progreso**:
   ```bash
   awslocal dynamodb query \
       --table-name RoxsProgress \
       --key-condition-expression "StudentId = :sid" \
       --expression-attribute-values '{":sid": {"S": "TU_NOMBRE_AQUI"}}'
   ```

3. **Estadísticas de dificultad**:
   ```bash
   awslocal dynamodb scan \
       --table-name RoxsProgress \
       --filter-expression "StudentId = :sid" \
       --expression-attribute-values '{":sid": {"S": "TU_NOMBRE_AQUI"}}' \
       --projection-expression "Day,Topic,Difficulty"
   ```

### ⚡ **Parte 4: Lambda + DynamoDB** (15 minutos)

1. **Crear función que consulte tu progreso**:
   ```python
   # my_progress_function.py
   import json
   import boto3
   
   def lambda_handler(event, context):
       dynamodb = boto3.client(
           'dynamodb',
           endpoint_url='http://localhost:4566',
           aws_access_key_id='test',
           aws_secret_access_key='test',
           region_name='us-east-1'
       )
       
       student_id = event.get('student_id', 'TU_NOMBRE_AQUI')
       
       try:
           # Obtener perfil del estudiante
           profile_response = dynamodb.get_item(
               TableName='RoxsStudents',
               Key={'StudentId': {'S': student_id}}
           )
           
           # Obtener progreso del estudiante
           progress_response = dynamodb.query(
               TableName='RoxsProgress',
               KeyConditionExpression='StudentId = :sid',
               ExpressionAttributeValues={':sid': {'S': student_id}}
           )
           
           # Procesar datos
           profile = profile_response.get('Item', {})
           progress_items = progress_response.get('Items', [])
           
           # Calcular estadísticas
           total_days = len(progress_items)
           completed_days = sum(1 for item in progress_items if item.get('Completed', {}).get('BOOL', False))
           avg_difficulty = sum(float(item.get('Difficulty', {}).get('N', '0')) for item in progress_items) / max(total_days, 1)
           
           return {
               'statusCode': 200,
               'body': json.dumps({
                   'student_id': student_id,
                   'name': profile.get('Name', {}).get('S', 'Unknown'),
                   'total_days_logged': total_days,
                   'completed_days': completed_days,
                   'completion_rate': f"{(completed_days/max(total_days,1)*100):.1f}%",
                   'average_difficulty': f"{avg_difficulty:.1f}/5",
                   'current_day': profile.get('CurrentDay', {}).get('N', '0')
               })
           }
           
       except Exception as e:
           return {
               'statusCode': 500,
               'body': json.dumps({'error': str(e)})
           }
   ```

2. **Desplegar y probar**:
   ```bash
   zip my-progress.zip my_progress_function.py
   
   awslocal lambda create-function \
       --function-name my-progress-tracker \
       --runtime python3.9 \
       --role arn:aws:iam::000000000000:role/lambda-role \
       --handler my_progress_function.lambda_handler \
       --zip-file fileb://my-progress.zip
   
   # Probar función
   awslocal lambda invoke \
       --function-name my-progress-tracker \
       --payload '{"student_id": "TU_NOMBRE_AQUI"}' \
       my-progress-output.json
   
   cat my-progress-output.json
   ```

### 📸 **Parte 5: Evidencia y sharing**

**Capturar y compartir**:
1. Screenshot de `awslocal dynamodb list-tables`
2. Screenshot de tu consulta de perfil personal
3. Screenshot del output de tu función Lambda de progreso
4. Screenshot de una consulta de tu progreso completo

### 🏆 **Desafío Bonus**: ¡Sistema completo de gestión!

**Crear un sistema que integre S3 + Lambda + DynamoDB:**

```python
# complete_system.py
import json
import boto3
from datetime import datetime
import uuid

def lambda_handler(event, context):
    """
    Sistema completo: Procesa archivos de S3 y guarda metadata en DynamoDB
    """
    
    # Clientes AWS para LocalStack
    s3_client = boto3.client(
        's3',
        endpoint_url='http://localhost:4566',
        aws_access_key_id='test',
        aws_secret_access_key='test'
    )
    
    dynamodb = boto3.client(
        'dynamodb',
        endpoint_url='http://localhost:4566',
        aws_access_key_id='test',
        aws_secret_access_key='test'
    )
    
    action = event.get('action', 'process_file')
    
    try:
        if action == 'process_file':
            bucket = event['bucket']
            key = event['key']
            
            # 1. Obtener información del archivo S3
            file_info = s3_client.head_object(Bucket=bucket, Key=key)
            file_size = file_info['ContentLength']
            last_modified = file_info['LastModified'].isoformat()
            
            # 2. Descargar y procesar contenido
            response = s3_client.get_object(Bucket=bucket, Key=key)
            content = response['Body'].read().decode('utf-8')
            
            # Análisis básico del contenido
            lines = content.split('\n')
            words = content.split()
            chars = len(content)
            
            # 3. Guardar metadata en DynamoDB
            file_id = str(uuid.uuid4())
            
            dynamodb.put_item(
                TableName='RoxsFileMetadata',
                Item={
                    'FileId': {'S': file_id},
                    'Bucket': {'S': bucket},
                    'Key': {'S': key},
                    'SizeBytes': {'N': str(file_size)},
                    'LastModified': {'S': last_modified},
                    'ProcessedAt': {'S': datetime.now().isoformat()},
                    'LineCount': {'N': str(len(lines))},
                    'WordCount': {'N': str(len(words))},
                    'CharCount': {'N': str(chars)},
                    'FileType': {'S': key.split('.')[-1] if '.' in key else 'unknown'}
                }
            )
            
            # 4. Crear archivo de reporte en S3
            report = {
                'file_id': file_id,
                'original_file': f"{bucket}/{key}",
                'analysis': {
                    'lines': len(lines),
                    'words': len(words),
                    'characters': chars,
                    'size_bytes': file_size
                },
                'processed_at': datetime.now().isoformat()
            }
            
            report_key = f"reports/{key}-analysis.json"
            s3_client.put_object(
                Bucket=bucket,
                Key=report_key,
                Body=json.dumps(report, indent=2),
                ContentType='application/json'
            )
            
            return {
                'statusCode': 200,
                'body': json.dumps({
                    'message': 'Archivo procesado exitosamente',
                    'file_id': file_id,
                    'report_location': f"{bucket}/{report_key}",
                    'analysis': report['analysis']
                })
            }
            
        elif action == 'get_file_stats':
            # Obtener estadísticas de todos los archivos procesados
            response = dynamodb.scan(TableName='RoxsFileMetadata')
            
            items = response.get('Items', [])
            total_files = len(items)
            total_size = sum(int(item.get('SizeBytes', {}).get('N', '0')) for item in items)
            
            file_types = {}
            for item in items:
                file_type = item.get('FileType', {}).get('S', 'unknown')
                file_types[file_type] = file_types.get(file_type, 0) + 1
            
            return {
                'statusCode': 200,
                'body': json.dumps({
                    'total_files_processed': total_files,
                    'total_size_bytes': total_size,
                    'file_types': file_types,
                    'files': [
                        {
                            'file_id': item.get('FileId', {}).get('S'),
                            'path': f"{item.get('Bucket', {}).get('S')}/{item.get('Key', {}).get('S')}",
                            'size': int(item.get('SizeBytes', {}).get('N', '0')),
                            'processed_at': item.get('ProcessedAt', {}).get('S')
                        }
                        for item in items
                    ]
                })
            }
            
    except Exception as e:
        return {
            'statusCode': 500,
            'body': json.dumps({'error': str(e)})
        }
```

**Setup del sistema completo**:

```bash
# 1. Crear tabla para metadata de archivos
awslocal dynamodb create-table \
    --table-name RoxsFileMetadata \
    --attribute-definitions \
        AttributeName=FileId,AttributeType=S \
    --key-schema \
        AttributeName=FileId,KeyType=HASH \
    --provisioned-throughput \
        ReadCapacityUnits=5,WriteCapacityUnits=5

# 2. Desplegar función completa
zip complete-system.zip complete_system.py
awslocal lambda create-function \
    --function-name roxs-complete-system \
    --runtime python3.9 \
    --role arn:aws:iam::000000000000:role/lambda-role \
    --handler complete_system.lambda_handler \
    --zip-file fileb://complete-system.zip \
    --timeout 60

# 3. Crear archivo de prueba en S3
echo -e "Este es un archivo de prueba\nCon múltiples líneas\nPara probar el sistema completo\nLocalStack + Lambda + DynamoDB + S3" > test-complete.txt
awslocal s3 cp test-complete.txt s3://roxs-bucket/

# 4. Procesar archivo con el sistema
awslocal lambda invoke \
    --function-name roxs-complete-system \
    --payload '{
        "action": "process_file",
        "bucket": "roxs-bucket",
        "key": "test-complete.txt"
    }' \
    complete-output.json

cat complete-output.json

# 5. Ver estadísticas del sistema
awslocal lambda invoke \
    --function-name roxs-complete-system \
    --payload '{"action": "get_file_stats"}' \
    stats-output.json

cat stats-output.json

# 6. Verificar que se creó el reporte
awslocal s3 ls s3://roxs-bucket/reports/
awslocal s3 cp s3://roxs-bucket/reports/test-complete.txt-analysis.json report.json
cat report.json
```

---

## 📤 **Compartir en Discord**

En tu mensaje del canal #semana9-localstack incluye:

1. **¿Qué tablas creaste y por qué?**
2. **¿Te sorprendió la flexibilidad de NoSQL?**
3. **¿Cuál fue la parte más desafiante: el schema, las consultas, o la integración con Lambda?**
4. **¿Lograste completar el bonus challenge del sistema completo?**
5. **¿Qué casos de uso reales se te ocurren para DynamoDB?**

**Screenshots a incluir:**
- Tu lista de tablas DynamoDB
- Una consulta de tu progreso personal
- El output de tu función Lambda de estadísticas
- (Bonus) El reporte generado por el sistema completo

---

## 🔮 Lo que viene mañana...

**Día 62**: ¡Integración completa de servicios!
- Conectar S3 + Lambda + DynamoDB en flujos reales
- Simular eventos automáticos
- Arquitecturas serverless completas
- Casos de uso del mundo real

---

## 💎 Tips Pro del día

### ⚡ **Performance en DynamoDB**
```bash
# Usar Query en lugar de Scan siempre que sea posible
# Query es O(log n), Scan es O(n)

# ✅ Bueno: Query con Partition Key
awslocal dynamodb query --table-name RoxsPosts \
    --key-condition-expression "UserId = :uid"

# ❌ Malo: Scan con filtro
awslocal dynamodb scan --table-name RoxsPosts \
    --filter-expression "UserId = :uid"
```

### 🔑 **Diseño de Primary Keys**
```bash
# Para datos jerárquicos, usa Composite Keys:
# PK: EntityType (USER, POST, COMMENT)
# SK: EntityID o Timestamp

# Ejemplo:
# USER#user123 | PROFILE
# USER#user123 | POST#post456
# USER#user123 | POST#post789
```

### 📊 **Agregaciones simples**
```bash
# Contar items
awslocal dynamodb scan --table-name RoxsUsers --select COUNT

# Obtener solo atributos específicos
awslocal dynamodb scan --table-name RoxsUsers \
    --projection-expression "UserId,Name,Email"
```

### 🔄 **Backup y restore**
```bash
# "Backup" usando scan
awslocal dynamodb scan --table-name RoxsUsers > backup-users.json

# Nota: En LocalStack real necesitarías scripts más sofisticados
# para restore, pero este enfoque funciona para development
```

### 🚀 **Comandos útiles para desarrollo**
```bash
# Ver schema rápido
awslocal dynamodb describe-table --table-name TABLE_NAME \
    --query 'Table.[KeySchema,AttributeDefinitions]'

# Limpiar tabla (eliminar todos los items)
# Nota: No hay comando directo, necesitas scan + batch-delete

# Eliminar tabla completa
awslocal dynamodb delete-table --table-name TABLE_NAME
```

### 🎯 **Patrones de acceso comunes**
- **1:1**: get-item con Primary Key
- **1:N**: query con Partition Key
- **N:M**: GSI (Global Secondary Index) - disponible en LocalStack Pro
- **Búsqueda de texto**: Scan con FilterExpression (no recomendado para prod)

¡Mañana vamos a conectar todo en flujos de arquitectura serverless real! 🔗⚡

---

## 📚 **Recursos adicionales**

### 🔗 **Enlaces útiles**
- [DynamoDB Data Types](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/HowItWorks.NamingRulesDataTypes.html#HowItWorks.DataTypes)
- [DynamoDB Best Practices](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/best-practices.html)
- [LocalStack DynamoDB](https://docs.localstack.cloud/user-guide/aws/dynamodb/)

### 🎓 **Para profundizar**
- **Single Table Design**: Un patrón avanzado de DynamoDB
- **DynamoDB Streams**: Para reaccionar a cambios en tiempo real
- **Global Secondary Indexes**: Para consultas alternativas
- **Conditional Writes**: Para consistencia de datos

¡Felicitaciones por completar el Día 61! Ya tienes las 3 piezas fundamentales del serverless: S3, Lambda y DynamoDB 🎉