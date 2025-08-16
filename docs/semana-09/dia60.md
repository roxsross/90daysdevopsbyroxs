---
title: Día 60 - Simula Lambda con LocalStack
description: Crea y ejecuta una función Lambda localmente usando LocalStack.
sidebar_position: 4
---

## Simula AWS Lambda con LocalStack

![](../../static/images/banner/9.png)

## ⚡ ¡Bienvenidos al mundo Serverless!

¡Hola Roxs! Ayer jugamos con S3 y hoy vamos a dar el siguiente paso: **AWS Lambda**. Vamos a crear funciones que se ejecuten sin servidores, ¡todo en tu máquina local!

¿Listos para ser magos del código serverless? 🧙‍♂️✨

---

## 🧠 ¿Qué es AWS Lambda?

**AWS Lambda** es un servicio de computación serverless que ejecuta tu código en respuesta a eventos, sin que tengas que gestionar servidores.

### 🎯 **Conceptos clave:**
- **Función**: Tu código empaquetado y listo para ejecutar
- **Runtime**: El entorno de ejecución (Python, Node.js, Java, etc.)
- **Handler**: El punto de entrada de tu función
- **Event**: Los datos que recibe tu función cuando se ejecuta
- **Context**: Información sobre el runtime y la ejecución

### 🚀 **¿Para qué se usa Lambda?**
- 🔄 **Procesamiento de archivos** (cuando subes algo a S3)
- 🌐 **APIs serverless** (con API Gateway)
- ⏰ **Tareas programadas** (cron jobs en la nube)
- 📧 **Procesamiento de mensajes** (SQS, SNS)
- 🔍 **Análisis de logs** en tiempo real
- 🖼️ **Redimensionamiento de imágenes**
- 📊 **ETL de datos** ligero

### 💰 **Ventajas del serverless:**
- ✅ **Sin gestión de servidores**
- ✅ **Escalado automático**
- ✅ **Pago por ejecución** (no por tiempo idle)
- ✅ **Alta disponibilidad** por defecto
- ✅ **Integración nativa** con otros servicios AWS

---

## 🚀 Preparando el entorno

### **Verificar que LocalStack esté corriendo**

```bash
# Iniciar LocalStack si no está corriendo
localstack start

# Verificar que Lambda esté disponible
curl http://localhost:4566/health | jq '.services.lambda'

# Debería mostrar: "available" o "running"
```

### **Verificar herramientas**

```bash
# Verificar awslocal
awslocal lambda list-functions

# Verificar que tenemos Python
python3 --version

# Verificar que tenemos zip
zip --version
```

---

## 🔧 Tu primera función Lambda

### **Paso 1: Crear la función Python**

```python
# lambda_function.py
import json
import datetime

def lambda_handler(event, context):
    """
    Función Lambda básica que recibe un evento y retorna una respuesta
    """
    
    print(f"Evento recibido: {json.dumps(event)}")
    print(f"Context: {context}")
    
    # Procesar el evento
    name = event.get('name', 'Roxs Developer')
    message = event.get('message', 'Hello from LocalStack Lambda!')
    
    # Crear respuesta
    response = {
        'statusCode': 200,
        'headers': {
            'Content-Type': 'application/json'
        },
        'body': json.dumps({
            'message': f"¡Hola {name}!",
            'input_message': message,
            'timestamp': datetime.datetime.now().isoformat(),
            'function_name': context.function_name if hasattr(context, 'function_name') else 'roxs-function',
            'processed_by': 'LocalStack Lambda'
        })
    }
    
    print(f"Respuesta: {json.dumps(response)}")
    return response
```

### **Paso 2: Empaquetar la función**

```bash
# Crear el archivo ZIP
zip lambda-basic.zip lambda_function.py

# Verificar contenido
unzip -l lambda-basic.zip
```

### **Paso 3: Crear la función en LocalStack**

```bash
# Crear la función Lambda
awslocal lambda create-function \
    --function-name roxs-basic-function \
    --runtime python3.9 \
    --role arn:aws:iam::000000000000:role/lambda-role \
    --handler lambda_function.lambda_handler \
    --zip-file fileb://lambda-basic.zip \
    --description "Mi primera función Lambda en LocalStack"
```

> 💡 **Nota**: El `role` es obligatorio pero LocalStack no lo valida. Puedes usar cualquier ARN dummy.

### **Paso 4: Verificar que se creó**

```bash
# Listar funciones
awslocal lambda list-functions

# Ver detalles de la función
awslocal lambda get-function --function-name roxs-basic-function
```

---

## 🔥 Invocar funciones Lambda

### **🎯 Invocación básica**

```bash
# Invocar sin parámetros
awslocal lambda invoke \
    --function-name roxs-basic-function \
    output.json

# Ver el resultado
cat output.json
```

### **📤 Invocación con payload**

```bash
# Crear payload de prueba
cat > payload.json << EOF
{
    "name": "DevOps Roxs",
    "message": "Ejecutando desde LocalStack!"
}
EOF

# Invocar con payload
awslocal lambda invoke \
    --function-name roxs-basic-function \
    --payload fileb://payload.json \
    output-with-payload.json

# Ver resultado
cat output-with-payload.json
```

### **📊 Invocación con logs**

```bash
# Invocar y ver logs
awslocal lambda invoke \
    --function-name roxs-basic-function \
    --payload '{"name": "Tester", "message": "Debug mode!"}' \
    --log-type Tail \
    output-with-logs.json

# Los logs aparecen en la salida del comando
```

---

## 🔧 Funciones Lambda más avanzadas

### **🗄️ Lambda que interactúa con S3**

```python
# lambda_s3_processor.py
import json
import boto3
from datetime import datetime

def lambda_handler(event, context):
    """
    Función que procesa eventos de S3
    """
    print(f"S3 Event: {json.dumps(event)}")
    
    # Configurar cliente S3 para LocalStack
    s3_client = boto3.client(
        's3',
        endpoint_url='http://localhost:4566',
        aws_access_key_id='test',
        aws_secret_access_key='test',
        region_name='us-east-1'
    )
    
    # Procesar información del evento
    bucket_name = event.get('bucket', 'roxs-bucket')
    object_key = event.get('key', 'unknown')
    
    try:
        # Intentar obtener información del archivo
        response = s3_client.head_object(Bucket=bucket_name, Key=object_key)
        file_size = response.get('ContentLength', 0)
        last_modified = response.get('LastModified', datetime.now())
        
        # Crear archivo de procesamiento
        process_info = {
            'processed_file': object_key,
            'file_size_bytes': file_size,
            'last_modified': str(last_modified),
            'processed_at': datetime.now().isoformat(),
            'status': 'processed'
        }
        
        # Guardar información de procesamiento
        process_key = f"processed/{object_key}.json"
        s3_client.put_object(
            Bucket=bucket_name,
            Key=process_key,
            Body=json.dumps(process_info, indent=2),
            ContentType='application/json'
        )
        
        return {
            'statusCode': 200,
            'body': json.dumps({
                'message': f'Archivo {object_key} procesado exitosamente',
                'file_size': file_size,
                'process_info_saved_to': process_key
            })
        }
        
    except Exception as e:
        print(f"Error procesando archivo: {str(e)}")
        return {
            'statusCode': 500,
            'body': json.dumps({
                'error': f'Error procesando {object_key}: {str(e)}'
            })
        }
```

### **📦 Empaquetar con dependencias**

```bash
# Crear directorio para la función
mkdir lambda-s3-processor
cd lambda-s3-processor

# Copiar el código
cp ../lambda_s3_processor.py .

# Instalar boto3 localmente (aunque LocalStack lo incluye)
pip install boto3 -t .

# Empaquetar todo
zip -r ../lambda-s3-processor.zip .

# Volver al directorio anterior
cd ..
```

### **🚀 Crear la función S3**

```bash
# Crear función que procesa S3
awslocal lambda create-function \
    --function-name roxs-s3-processor \
    --runtime python3.9 \
    --role arn:aws:iam::000000000000:role/lambda-role \
    --handler lambda_s3_processor.lambda_handler \
    --zip-file fileb://lambda-s3-processor.zip \
    --description "Función que procesa archivos de S3" \
    --timeout 30
```

---

## 🧪 Testing avanzado

### **🔄 Simular evento de S3**

```bash
# Primero, crear archivo en S3
echo "Archivo para procesar con Lambda" > test-file.txt
awslocal s3 cp test-file.txt s3://roxs-bucket/

# Crear evento simulado de S3
cat > s3-event.json << EOF
{
    "bucket": "roxs-bucket",
    "key": "test-file.txt",
    "eventName": "ObjectCreated:Put"
}
EOF

# Invocar función con evento S3
awslocal lambda invoke \
    --function-name roxs-s3-processor \
    --payload fileb://s3-event.json \
    s3-output.json

# Ver resultado
cat s3-output.json

# Verificar que se creó el archivo de procesamiento
awslocal s3 ls s3://roxs-bucket/processed/
```

### **⏰ Lambda con diferentes runtimes**

```javascript
// lambda_function.js (Node.js)
exports.handler = async (event, context) => {
    console.log('Event:', JSON.stringify(event, null, 2));
    
    const response = {
        statusCode: 200,
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            message: '¡Hola desde Node.js Lambda!',
            input: event,
            timestamp: new Date().toISOString(),
            nodeVersion: process.version
        }),
    };
    
    console.log('Response:', JSON.stringify(response, null, 2));
    return response;
};
```

```bash
# Empaquetar función Node.js
zip lambda-nodejs.zip lambda_function.js

# Crear función Node.js
awslocal lambda create-function \
    --function-name roxs-nodejs-function \
    --runtime nodejs18.x \
    --role arn:aws:iam::000000000000:role/lambda-role \
    --handler lambda_function.handler \
    --zip-file fileb://lambda-nodejs.zip

# Invocar función Node.js
awslocal lambda invoke \
    --function-name roxs-nodejs-function \
    --payload '{"message": "Testing Node.js Lambda"}' \
    nodejs-output.json
```

---

## 📊 Gestión de funciones Lambda

### **📋 Información y configuración**

```bash
# Listar todas las funciones
awslocal lambda list-functions --query 'Functions[].FunctionName'

# Ver configuración detallada
awslocal lambda get-function-configuration --function-name roxs-basic-function

# Ver código de la función
awslocal lambda get-function --function-name roxs-basic-function
```

### **🔄 Actualizar funciones**

```bash
# Modificar código y reempaquetar
echo "# Versión actualizada" >> lambda_function.py
zip lambda-basic-v2.zip lambda_function.py

# Actualizar código de función
awslocal lambda update-function-code \
    --function-name roxs-basic-function \
    --zip-file fileb://lambda-basic-v2.zip

# Actualizar configuración
awslocal lambda update-function-configuration \
    --function-name roxs-basic-function \
    --timeout 60 \
    --description "Función actualizada con mayor timeout"
```

### **🗑️ Eliminar funciones**

```bash
# Eliminar función específica
awslocal lambda delete-function --function-name roxs-nodejs-function

# Verificar eliminación
awslocal lambda list-functions
```

---

## 🔧 Variables de entorno y configuración

### **🌍 Función con variables de entorno**

```python
# lambda_with_env.py
import json
import os

def lambda_handler(event, context):
    # Leer variables de entorno
    app_name = os.environ.get('APP_NAME', 'DefaultApp')
    debug_mode = os.environ.get('DEBUG', 'false').lower() == 'true'
    api_url = os.environ.get('API_URL', 'http://localhost:3000')
    
    if debug_mode:
        print(f"Debug mode habilitado para {app_name}")
        print(f"API URL: {api_url}")
    
    return {
        'statusCode': 200,
        'body': json.dumps({
            'app_name': app_name,
            'debug_enabled': debug_mode,
            'api_url': api_url,
            'environment_vars': dict(os.environ)
        })
    }
```

```bash
# Empaquetar función con env vars
zip lambda-env.zip lambda_with_env.py

# Crear función con variables de entorno
awslocal lambda create-function \
    --function-name roxs-env-function \
    --runtime python3.9 \
    --role arn:aws:iam::000000000000:role/lambda-role \
    --handler lambda_with_env.lambda_handler \
    --zip-file fileb://lambda-env.zip \
    --environment Variables='{APP_NAME=RoxsApp,DEBUG=true,API_URL=http://localhost:4566}'

# Invocar y ver variables
awslocal lambda invoke \
    --function-name roxs-env-function \
    env-output.json

cat env-output.json
```

---

## 🔗 Integración Lambda + S3

### **🎯 Flujo completo de procesamiento**

```bash
# 1. Crear bucket para el demo
awslocal s3 mb s3://roxs-lambda-demo

# 2. Subir archivo para procesar
echo "Contenido para procesar con Lambda" > demo-file.txt
awslocal s3 cp demo-file.txt s3://roxs-lambda-demo/

# 3. Invocar función procesadora
awslocal lambda invoke \
    --function-name roxs-s3-processor \
    --payload '{"bucket": "roxs-lambda-demo", "key": "demo-file.txt"}' \
    demo-output.json

# 4. Ver resultado
cat demo-output.json

# 5. Verificar archivo procesado
awslocal s3 ls s3://roxs-lambda-demo/processed/
awslocal s3 cp s3://roxs-lambda-demo/processed/demo-file.txt.json processed-info.json
cat processed-info.json
```

---

## 📋 Scripts de automatización

### **🚀 Script de despliegue rápido**

```bash
#!/bin/bash
# deploy-lambda.sh

FUNCTION_NAME=$1
PYTHON_FILE=$2

if [ -z "$FUNCTION_NAME" ] || [ -z "$PYTHON_FILE" ]; then
    echo "Uso: $0 <function-name> <python-file>"
    echo "Ejemplo: $0 my-function lambda_function.py"
    exit 1
fi

echo "🚀 Desplegando función Lambda: $FUNCTION_NAME"

# Empaquetar
echo "📦 Empaquetando..."
zip ${FUNCTION_NAME}.zip $PYTHON_FILE

# Verificar si la función existe
if awslocal lambda get-function --function-name $FUNCTION_NAME >/dev/null 2>&1; then
    echo "🔄 Actualizando función existente..."
    awslocal lambda update-function-code \
        --function-name $FUNCTION_NAME \
        --zip-file fileb://${FUNCTION_NAME}.zip
else
    echo "✨ Creando nueva función..."
    awslocal lambda create-function \
        --function-name $FUNCTION_NAME \
        --runtime python3.9 \
        --role arn:aws:iam::000000000000:role/lambda-role \
        --handler ${PYTHON_FILE%.*}.lambda_handler \
        --zip-file fileb://${FUNCTION_NAME}.zip
fi

echo "✅ Función $FUNCTION_NAME desplegada!"

# Test básico
echo "🧪 Probando función..."
awslocal lambda invoke \
    --function-name $FUNCTION_NAME \
    --payload '{"test": true}' \
    test-output.json

echo "📄 Resultado del test:"
cat test-output.json
echo ""
```

### **📊 Script de monitoring**

```bash
#!/bin/bash
# lambda-monitor.sh

echo "📊 Estado de funciones Lambda"
echo "================================"

echo "🔢 Total de funciones:"
awslocal lambda list-functions --query 'length(Functions)'

echo ""
echo "📋 Lista de funciones:"
awslocal lambda list-functions --query 'Functions[].[FunctionName,Runtime,LastModified]' --output table

echo ""
echo "💾 Tamaño de funciones:"
awslocal lambda list-functions --query 'Functions[].[FunctionName,CodeSize]' --output table

echo ""
echo "⏱️ Configuración de timeout:"
awslocal lambda list-functions --query 'Functions[].[FunctionName,Timeout]' --output table
```

---

## 💡 Tarea del Día

### 📝 **Parte 1: Lambda básico** (20 minutos)

1. **Crear tu primera función**:
   ```python
   # mi_primera_lambda.py
   import json
   
   def lambda_handler(event, context):
       nombre = event.get('nombre', 'Estudiante Roxs')
       return {
           'statusCode': 200,
           'body': json.dumps({
               'mensaje': f'¡Hola {nombre}! Bienvenido a Lambda local',
               'evento_recibido': event
           })
       }
   ```

2. **Empaquetar y desplegar**:
   ```bash
   zip mi-lambda.zip mi_primera_lambda.py
   awslocal lambda create-function \
       --function-name mi-primera-funcion \
       --runtime python3.9 \
       --role arn:aws:iam::000000000000:role/lambda-role \
       --handler mi_primera_lambda.lambda_handler \
       --zip-file fileb://mi-lambda.zip
   ```

3. **Invocar con tu nombre**:
   ```bash
   awslocal lambda invoke \
       --function-name mi-primera-funcion \
       --payload '{"nombre": "TU_NOMBRE_AQUI"}' \
       mi-output.json
   
   cat mi-output.json
   ```

### ⚡ **Parte 2: Lambda + S3** (25 minutos)

1. **Crear función que liste archivos S3**:
   ```python
   # s3_lister.py
   import json
   import boto3
   
   def lambda_handler(event, context):
       s3_client = boto3.client(
           's3',
           endpoint_url='http://localhost:4566',
           aws_access_key_id='test',
           aws_secret_access_key='test'
       )
       
       bucket = event.get('bucket', 'roxs-bucket')
       
       try:
           response = s3_client.list_objects_v2(Bucket=bucket)
           files = []
           
           if 'Contents' in response:
               files = [obj['Key'] for obj in response['Contents']]
           
           return {
               'statusCode': 200,
               'body': json.dumps({
                   'bucket': bucket,
                   'total_files': len(files),
                   'files': files
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
   zip s3-lister.zip s3_lister.py
   awslocal lambda create-function \
       --function-name s3-file-lister \
       --runtime python3.9 \
       --role arn:aws:iam::000000000000:role/lambda-role \
       --handler s3_lister.lambda_handler \
       --zip-file fileb://s3-lister.zip
   
   # Probar con tu bucket del día anterior
   awslocal lambda invoke \
       --function-name s3-file-lister \
       --payload '{"bucket": "roxs-documents"}' \
       s3-list-output.json
   ```

### 📸 **Parte 3: Evidencia**

**Capturar y compartir**:
1. Screenshot de `awslocal lambda list-functions`
2. Screenshot del contenido de `mi-output.json`
3. Screenshot del contenido de `s3-list-output.json`

### 🏆 **Desafío Bonus**: ¡Procesador de archivos completo!

**Crear una función que:**
1. Reciba información de un archivo en S3
2. Descargue el archivo
3. Cuente las líneas/palabras
4. Guarde un reporte en otro bucket

```python
# file_processor.py
import json
import boto3

def lambda_handler(event, context):
    s3_client = boto3.client(
        's3',
        endpoint_url='http://localhost:4566',
        aws_access_key_id='test',
        aws_secret_access_key='test'
    )
    
    source_bucket = event['source_bucket']
    source_key = event['source_key']
    report_bucket = event.get('report_bucket', 'roxs-reports')
    
    try:
        # Descargar archivo
        response = s3_client.get_object(Bucket=source_bucket, Key=source_key)
        content = response['Body'].read().decode('utf-8')
        
        # Procesar contenido
        lines = content.split('\n')
        words = content.split()
        
        # Crear reporte
        report = {
            'file': f"{source_bucket}/{source_key}",
            'processed_at': context.aws_request_id,
            'stats': {
                'total_lines': len(lines),
                'total_words': len(words),
                'total_characters': len(content)
            }
        }
        
        # Guardar reporte
        report_key = f"reports/{source_key}-report.json"
        s3_client.put_object(
            Bucket=report_bucket,
            Key=report_key,
            Body=json.dumps(report, indent=2)
        )
        
        return {
            'statusCode': 200,
            'body': json.dumps({
                'message': 'Archivo procesado exitosamente',
                'report_location': f"{report_bucket}/{report_key}",
                'stats': report['stats']
            })
        }
        
    except Exception as e:
        return {
            'statusCode': 500,
            'body': json.dumps({'error': str(e)})
        }
```

### 📤 **Compartir en Discord**

En tu mensaje incluye:
- ¿Qué funciones Lambda creaste?
- ¿Te sorprendió la velocidad de ejecución local?
- ¿Qué casos de uso reales se te ocurren para Lambda?
- ¿Lograste hacer el bonus challenge?

---

## 🔮 Lo que viene mañana...

**Día 61**: ¡Simular DynamoDB con LocalStack!
- Bases de datos NoSQL locales
- Crear tablas y índices
- CRUD operations
- Integrar Lambda + DynamoDB

---

## 💎 Tips Pro

### ⚡ **Performance**
```bash
# Lambda con más memoria ejecuta más rápido
awslocal lambda update-function-configuration \
    --function-name mi-funcion \
    --memory-size 512
```

### 🔍 **Debugging**
```bash
# Ver logs detallados
awslocal lambda invoke \
    --function-name mi-funcion \
    --log-type Tail \
    output.json
```

### 🚀 **Hot reloading**
```bash
# Script para actualizar rápido durante desarrollo
while inotifywait -e modify lambda_function.py; do
    zip lambda.zip lambda_function.py
    awslocal lambda update-function-code \
        --function-name mi-funcion \
        --zip-file fileb://lambda.zip
done
```

¡Mañana vamos a crear bases de datos NoSQL que nuestras Lambda functions puedan usar! 🗃️⚡
