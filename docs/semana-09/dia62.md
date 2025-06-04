---
title: Día 62 - Integra servicios simulados con LocalStack
description: Aprende a integrar varios servicios simulados de AWS como S3, Lambda y DynamoDB usando LocalStack.
sidebar_position: 6
---

## Integra servicios simulados con LocalStack

![](../../static/images/banner/9.png)

## 🔗 ¡El día de la integración total!

¡Hola Roxs! Los últimos 3 días aprendimos S3, Lambda y DynamoDB por separado. **Hoy los conectamos todos** para crear arquitecturas serverless completas.

¿Listos para ser arquitectos de la nube? 🏗️✨

---

## 🧩 Arquitecturas serverless reales

### 🎯 **¿Qué vamos a construir hoy?**

Vamos a crear **4 arquitecturas completas** que usan múltiples servicios integrados:

1. **📸 Procesador de imágenes**: S3 → Lambda → DynamoDB
2. **📊 Sistema de logs**: Lambda → DynamoDB → S3
3. **🔔 Sistema de notificaciones**: SQS → Lambda → SNS → DynamoDB
4. **🌐 API completa**: API Gateway → Lambda → DynamoDB → S3

### 🌟 **¿Por qué esto es importante?**

En el mundo real, los servicios AWS **nunca trabajan solos**. Las aplicaciones modernas integran múltiples servicios para crear soluciones robustas y escalables.

---

## 🏗️ Arquitectura 1: Procesador de imágenes

### **🗺️ Flujo de la arquitectura:**

```
Usuario sube imagen → S3 → Trigger → Lambda → Procesa → DynamoDB (metadata) → S3 (thumbnail)
```

### **🚀 Paso 1: Configurar buckets S3**

```bash
# Crear buckets especializados
awslocal s3 mb s3://roxs-images-original
awslocal s3 mb s3://roxs-images-processed
awslocal s3 mb s3://roxs-images-thumbnails

# Verificar creación
awslocal s3 ls
```

### **🗃️ Paso 2: Crear tabla DynamoDB para metadata**

```bash
# Tabla para guardar información de procesamiento de imágenes
awslocal dynamodb create-table \
    --table-name RoxsImageMetadata \
    --attribute-definitions \
        AttributeName=ImageId,AttributeType=S \
        AttributeName=UploadTimestamp,AttributeType=N \
    --key-schema \
        AttributeName=ImageId,KeyType=HASH \
        AttributeName=UploadTimestamp,KeyType=RANGE \
    --provisioned-throughput \
        ReadCapacityUnits=5,WriteCapacityUnits=5

# Verificar tabla
awslocal dynamodb describe-table --table-name RoxsImageMetadata
```

### **⚡ Paso 3: Crear función Lambda procesadora**

```python
# image_processor.py
import json
import boto3
import uuid
from datetime import datetime
import base64

def lambda_handler(event, context):
    """
    Procesador de imágenes: S3 → Lambda → DynamoDB
    """
    print(f"Event recibido: {json.dumps(event)}")
    
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
    
    try:
        # Extraer información del evento
        source_bucket = event.get('bucket', 'roxs-images-original')
        image_key = event.get('key', 'unknown.jpg')
        
        # Generar ID único para la imagen
        image_id = str(uuid.uuid4())
        timestamp = int(datetime.now().timestamp())
        
        print(f"Procesando imagen: {source_bucket}/{image_key}")
        
        # 1. Obtener información del archivo original
        head_response = s3_client.head_object(Bucket=source_bucket, Key=image_key)
        file_size = head_response['ContentLength']
        content_type = head_response.get('ContentType', 'unknown')
        last_modified = head_response['LastModified'].isoformat()
        
        # 2. Descargar imagen original
        get_response = s3_client.get_object(Bucket=source_bucket, Key=image_key)
        image_content = get_response['Body'].read()
        
        # 3. "Procesar" imagen (simulado - en real usarías PIL/Pillow)
        # Para este demo, creamos una versión "procesada" y un "thumbnail"
        processed_content = image_content  # En real: resize, filters, etc.
        thumbnail_content = image_content[:len(image_content)//2]  # Simular thumbnail más pequeño
        
        # 4. Subir imagen procesada
        processed_key = f"processed/{image_id}-{image_key}"
        s3_client.put_object(
            Bucket='roxs-images-processed',
            Key=processed_key,
            Body=processed_content,
            ContentType=content_type,
            Metadata={
                'original-bucket': source_bucket,
                'original-key': image_key,
                'processed-by': 'roxs-image-processor',
                'processed-at': datetime.now().isoformat()
            }
        )
        
        # 5. Subir thumbnail
        thumbnail_key = f"thumbnails/{image_id}-thumb-{image_key}"
        s3_client.put_object(
            Bucket='roxs-images-thumbnails',
            Key=thumbnail_key,
            Body=thumbnail_content,
            ContentType=content_type,
            Metadata={
                'original-bucket': source_bucket,
                'original-key': image_key,
                'thumbnail-for': image_id
            }
        )
        
        # 6. Guardar metadata en DynamoDB
        dynamodb.put_item(
            TableName='RoxsImageMetadata',
            Item={
                'ImageId': {'S': image_id},
                'UploadTimestamp': {'N': str(timestamp)},
                'OriginalBucket': {'S': source_bucket},
                'OriginalKey': {'S': image_key},
                'OriginalSize': {'N': str(file_size)},
                'ContentType': {'S': content_type},
                'ProcessedKey': {'S': processed_key},
                'ThumbnailKey': {'S': thumbnail_key},
                'ProcessedAt': {'S': datetime.now().isoformat()},
                'Status': {'S': 'completed'},
                'ProcessedBy': {'S': 'lambda'},
                'LastModified': {'S': last_modified}
            }
        )
        
        # 7. Respuesta de éxito
        response = {
            'statusCode': 200,
            'body': json.dumps({
                'message': 'Imagen procesada exitosamente',
                'image_id': image_id,
                'original': f"{source_bucket}/{image_key}",
                'processed': f"roxs-images-processed/{processed_key}",
                'thumbnail': f"roxs-images-thumbnails/{thumbnail_key}",
                'size_bytes': file_size,
                'processing_time': 'instant'
            })
        }
        
        print(f"Procesamiento exitoso: {image_id}")
        return response
        
    except Exception as e:
        error_msg = f"Error procesando imagen: {str(e)}"
        print(error_msg)
        
        # Guardar error en DynamoDB
        try:
            dynamodb.put_item(
                TableName='RoxsImageMetadata',
                Item={
                    'ImageId': {'S': str(uuid.uuid4())},
                    'UploadTimestamp': {'N': str(int(datetime.now().timestamp()))},
                    'OriginalBucket': {'S': source_bucket},
                    'OriginalKey': {'S': image_key},
                    'Status': {'S': 'error'},
                    'ErrorMessage': {'S': str(e)},
                    'ProcessedAt': {'S': datetime.now().isoformat()}
                }
            )
        except:
            pass  # Si no podemos guardar el error, continuamos
            
        return {
            'statusCode': 500,
            'body': json.dumps({'error': error_msg})
        }
```

### **🚀 Paso 4: Desplegar la función**

```bash
# Empaquetar función
zip image-processor.zip image_processor.py

# Crear función Lambda
awslocal lambda create-function \
    --function-name roxs-image-processor \
    --runtime python3.9 \
    --role arn:aws:iam::000000000000:role/lambda-role \
    --handler image_processor.lambda_handler \
    --zip-file fileb://image-processor.zip \
    --timeout 60 \
    --description "Procesador de imágenes: S3 → Lambda → DynamoDB"

# Verificar función
awslocal lambda list-functions --query 'Functions[?FunctionName==`roxs-image-processor`]'
```

### **🧪 Paso 5: Probar la arquitectura**

```bash
# 1. Crear imagen de prueba
echo "Esta es una imagen de prueba en formato texto" > test-image.jpg
echo "Otra imagen para procesar" > vacation-photo.png

# 2. Subir imágenes a S3
awslocal s3 cp test-image.jpg s3://roxs-images-original/
awslocal s3 cp vacation-photo.png s3://roxs-images-original/photos/

# 3. Procesar primera imagen
awslocal lambda invoke \
    --function-name roxs-image-processor \
    --payload '{
        "bucket": "roxs-images-original",
        "key": "test-image.jpg"
    }' \
    image-result1.json

cat image-result1.json

# 4. Procesar segunda imagen
awslocal lambda invoke \
    --function-name roxs-image-processor \
    --payload '{
        "bucket": "roxs-images-original", 
        "key": "photos/vacation-photo.png"
    }' \
    image-result2.json

cat image-result2.json

# 5. Verificar que se crearon los archivos procesados
awslocal s3 ls s3://roxs-images-processed/ --recursive
awslocal s3 ls s3://roxs-images-thumbnails/ --recursive

# 6. Verificar metadata en DynamoDB
awslocal dynamodb scan --table-name RoxsImageMetadata \
    --projection-expression "ImageId,OriginalKey,Status,ProcessedAt"
```

---

## 📊 Arquitectura 2: Sistema de logs distribuido

### **🗺️ Flujo de la arquitectura:**

```
Aplicación → Lambda (log processor) → DynamoDB (índices) → S3 (archivos raw)
```

### **🗃️ Paso 1: Crear tabla de índices de logs**

```bash
# Tabla para indexar logs por timestamp y nivel
awslocal dynamodb create-table \
    --table-name RoxsLogIndex \
    --attribute-definitions \
        AttributeName=LogLevel,AttributeType=S \
        AttributeName=Timestamp,AttributeType=N \
    --key-schema \
        AttributeName=LogLevel,KeyType=HASH \
        AttributeName=Timestamp,KeyType=RANGE \
    --provisioned-throughput \
        ReadCapacityUnits=5,WriteCapacityUnits=5

# Bucket para logs raw
awslocal s3 mb s3://roxs-logs-storage
```

### **⚡ Paso 2: Función de procesamiento de logs**

```python
# log_processor.py
import json
import boto3
from datetime import datetime
import gzip
import uuid

def lambda_handler(event, context):
    """
    Procesador de logs: recibe logs → DynamoDB (índice) → S3 (storage)
    """
    print(f"Procesando logs: {json.dumps(event)}")
    
    # Clientes AWS
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
    
    try:
        # Procesar cada entrada de log
        logs = event.get('logs', [])
        if not logs:
            logs = [event]  # Si se envía un log individual
        
        processed_logs = []
        log_batch_id = str(uuid.uuid4())
        
        for log_entry in logs:
            timestamp = int(datetime.now().timestamp() * 1000)  # milliseconds
            log_id = str(uuid.uuid4())
            
            # Extraer información del log
            level = log_entry.get('level', 'INFO').upper()
            message = log_entry.get('message', '')
            service = log_entry.get('service', 'unknown')
            user_id = log_entry.get('user_id', 'anonymous')
            
            # Preparar entrada procesada
            processed_log = {
                'log_id': log_id,
                'timestamp': timestamp,
                'level': level,
                'message': message,
                'service': service,
                'user_id': user_id,
                'batch_id': log_batch_id,
                'processed_at': datetime.now().isoformat()
            }
            
            processed_logs.append(processed_log)
            
            # Indexar en DynamoDB (para búsquedas rápidas)
            dynamodb.put_item(
                TableName='RoxsLogIndex',
                Item={
                    'LogLevel': {'S': level},
                    'Timestamp': {'N': str(timestamp)},
                    'LogId': {'S': log_id},
                    'Message': {'S': message[:100]},  # Truncar mensaje para índice
                    'Service': {'S': service},
                    'UserId': {'S': user_id},
                    'BatchId': {'S': log_batch_id}
                }
            )
        
        # Guardar logs completos en S3 (comprimidos)
        log_date = datetime.now().strftime('%Y/%m/%d')
        log_hour = datetime.now().strftime('%H')
        s3_key = f"logs/{log_date}/{log_hour}/{log_batch_id}.json.gz"
        
        # Comprimir logs
        logs_json = json.dumps(processed_logs, indent=2)
        compressed_logs = gzip.compress(logs_json.encode('utf-8'))
        
        # Subir a S3
        s3_client.put_object(
            Bucket='roxs-logs-storage',
            Key=s3_key,
            Body=compressed_logs,
            ContentType='application/json',
            ContentEncoding='gzip',
            Metadata={
                'log-count': str(len(processed_logs)),
                'batch-id': log_batch_id,
                'processed-at': datetime.now().isoformat()
            }
        )
        
        return {
            'statusCode': 200,
            'body': json.dumps({
                'message': f'Procesados {len(processed_logs)} logs exitosamente',
                'batch_id': log_batch_id,
                'storage_location': f"s3://roxs-logs-storage/{s3_key}",
                'logs_indexed': len(processed_logs)
            })
        }
        
    except Exception as e:
        print(f"Error procesando logs: {str(e)}")
        return {
            'statusCode': 500,
            'body': json.dumps({'error': str(e)})
        }
```

### **🚀 Paso 3: Desplegar sistema de logs**

```bash
# Empaquetar función
zip log-processor.zip log_processor.py

# Crear función
awslocal lambda create-function \
    --function-name roxs-log-processor \
    --runtime python3.9 \
    --role arn:aws:iam::000000000000:role/lambda-role \
    --handler log_processor.lambda_handler \
    --zip-file fileb://log-processor.zip \
    --timeout 30 \
    --description "Sistema de logs: Lambda → DynamoDB → S3"
```

### **🧪 Paso 4: Probar sistema de logs**

```bash
# Simular logs de aplicación
awslocal lambda invoke \
    --function-name roxs-log-processor \
    --payload '{
        "logs": [
            {
                "level": "ERROR",
                "message": "Database connection failed",
                "service": "user-api",
                "user_id": "user123"
            },
            {
                "level": "INFO", 
                "message": "User login successful",
                "service": "auth-service",
                "user_id": "user123"
            },
            {
                "level": "WARNING",
                "message": "High memory usage detected",
                "service": "monitoring",
                "user_id": "system"
            }
        ]
    }' \
    logs-result.json

cat logs-result.json

# Verificar índice en DynamoDB
awslocal dynamodb scan --table-name RoxsLogIndex \
    --projection-expression "LogLevel,#ts,LogId,Message,Service" \
    --expression-attribute-names '{"#ts": "Timestamp"}'

# Verificar archivo en S3
awslocal s3 ls s3://roxs-logs-storage/ --recursive
```

---

## 🔔 Arquitectura 3: Sistema de notificaciones

### **🗺️ Flujo de la arquitectura:**

```
Evento → SQS (cola) → Lambda (processor) → SNS (notificación) → DynamoDB (historial)
```

### **📬 Paso 1: Crear cola SQS y topic SNS**

```bash
# Crear cola SQS para eventos
awslocal sqs create-queue --queue-name roxs-notifications-queue

# Crear topic SNS para notificaciones
awslocal sns create-topic --name roxs-notifications

# Obtener URLs/ARNs
queue_url=$(awslocal sqs get-queue-url --queue-name roxs-notifications-queue --query 'QueueUrl' --output text)
topic_arn=$(awslocal sns list-topics --query 'Topics[0].TopicArn' --output text)

echo "Queue URL: $queue_url"
echo "Topic ARN: $topic_arn"
```

### **🗃️ Paso 2: Crear tabla de historial de notificaciones**

```bash
# Tabla para historial de notificaciones
awslocal dynamodb create-table \
    --table-name RoxsNotificationHistory \
    --attribute-definitions \
        AttributeName=NotificationId,AttributeType=S \
        AttributeName=CreatedAt,AttributeType=N \
    --key-schema \
        AttributeName=NotificationId,KeyType=HASH \
        AttributeName=CreatedAt,KeyType=RANGE \
    --provisioned-throughput \
        ReadCapacityUnits=5,WriteCapacityUnits=5
```

### **⚡ Paso 3: Función procesadora de notificaciones**

```python
# notification_processor.py
import json
import boto3
from datetime import datetime
import uuid

def lambda_handler(event, context):
    """
    Procesador de notificaciones: SQS → Lambda → SNS → DynamoDB
    """
    print(f"Event: {json.dumps(event)}")
    
    # Clientes AWS
    sqs_client = boto3.client(
        'sqs',
        endpoint_url='http://localhost:4566',
        aws_access_key_id='test',
        aws_secret_access_key='test'
    )
    
    sns_client = boto3.client(
        'sns',
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
    
    try:
        notification_id = str(uuid.uuid4())
        timestamp = int(datetime.now().timestamp() * 1000)
        
        # Extraer datos del evento
        notification_type = event.get('type', 'general')
        recipient = event.get('recipient', 'admin@roxs.com')
        title = event.get('title', 'Notificación de Sistema')
        message = event.get('message', 'Mensaje de notificación')
        priority = event.get('priority', 'normal')
        
        # Crear mensaje para SNS
        sns_message = {
            'notification_id': notification_id,
            'type': notification_type,
            'title': title,
            'message': message,
            'recipient': recipient,
            'priority': priority,
            'created_at': datetime.now().isoformat()
        }
        
        # Publicar en SNS
        sns_response = sns_client.publish(
            TopicArn='arn:aws:sns:us-east-1:000000000000:roxs-notifications',
            Message=json.dumps(sns_message),
            Subject=f"[{priority.upper()}] {title}",
            MessageAttributes={
                'notification_type': {
                    'DataType': 'String',
                    'StringValue': notification_type
                },
                'priority': {
                    'DataType': 'String',
                    'StringValue': priority
                }
            }
        )
        
        # Guardar en historial (DynamoDB)
        dynamodb.put_item(
            TableName='RoxsNotificationHistory',
            Item={
                'NotificationId': {'S': notification_id},
                'CreatedAt': {'N': str(timestamp)},
                'Type': {'S': notification_type},
                'Recipient': {'S': recipient},
                'Title': {'S': title},
                'Message': {'S': message},
                'Priority': {'S': priority},
                'SNSMessageId': {'S': sns_response.get('MessageId', 'unknown')},
                'Status': {'S': 'sent'},
                'ProcessedAt': {'S': datetime.now().isoformat()}
            }
        )
        
        return {
            'statusCode': 200,
            'body': json.dumps({
                'message': 'Notificación procesada exitosamente',
                'notification_id': notification_id,
                'sns_message_id': sns_response.get('MessageId'),
                'recipient': recipient,
                'type': notification_type
            })
        }
        
    except Exception as e:
        print(f"Error procesando notificación: {str(e)}")
        
        # Guardar error en historial
        try:
            dynamodb.put_item(
                TableName='RoxsNotificationHistory',
                Item={
                    'NotificationId': {'S': str(uuid.uuid4())},
                    'CreatedAt': {'N': str(int(datetime.now().timestamp() * 1000))},
                    'Status': {'S': 'error'},
                    'ErrorMessage': {'S': str(e)},
                    'ProcessedAt': {'S': datetime.now().isoformat()}
                }
            )
        except:
            pass
            
        return {
            'statusCode': 500,
            'body': json.dumps({'error': str(e)})
        }
```

### **🚀 Paso 4: Desplegar sistema de notificaciones**

```bash
# Empaquetar función
zip notification-processor.zip notification_processor.py

# Crear función
awslocal lambda create-function \
    --function-name roxs-notification-processor \
    --runtime python3.9 \
    --role arn:aws:iam::000000000000:role/lambda-role \
    --handler notification_processor.lambda_handler \
    --zip-file fileb://notification-processor.zip \
    --timeout 30 \
    --description "Sistema de notificaciones: SQS → Lambda → SNS → DynamoDB"
```

### **🧪 Paso 5: Probar sistema de notificaciones**

```bash
# Suscribirse al topic SNS (para ver las notificaciones)
awslocal sns subscribe \
    --topic-arn arn:aws:sns:us-east-1:000000000000:roxs-notifications \
    --protocol email \
    --notification-endpoint admin@roxs.com

# Enviar notificación de prueba
awslocal lambda invoke \
    --function-name roxs-notification-processor \
    --payload '{
        "type": "alert",
        "recipient": "admin@roxs.com",
        "title": "Sistema de monitoreo",
        "message": "CPU usage above 90% on server-01",
        "priority": "high"
    }' \
    notification-result.json

cat notification-result.json

# Enviar notificación informativa
awslocal lambda invoke \
    --function-name roxs-notification-processor \
    --payload '{
        "type": "info",
        "recipient": "team@roxs.com", 
        "title": "Deploy completado",
        "message": "La versión 2.1.0 se desplegó exitosamente",
        "priority": "normal"
    }' \
    notification-result2.json

# Verificar historial en DynamoDB
awslocal dynamodb scan --table-name RoxsNotificationHistory \
    --projection-expression "NotificationId,Title,#status,Priority,ProcessedAt" \
    --expression-attribute-names '{"#status": "Status"}'

# Ver mensajes en SNS (si hay subscriptores)
awslocal sns list-subscriptions
```

---

## 🌐 Arquitectura 4: API Gateway completa

### **🗺️ Flujo de la arquitectura:**

```
Cliente HTTP → API Gateway → Lambda (router) → DynamoDB/S3 → Respuesta JSON
```

### **⚡ Función Lambda para API**

```python
# api_handler.py
import json
import boto3
from datetime import datetime
import uuid

def lambda_handler(event, context):
    """
    API Handler: maneja todas las rutas de la API
    """
    print(f"API Event: {json.dumps(event)}")
    
    # Clientes AWS
    dynamodb = boto3.client(
        'dynamodb',
        endpoint_url='http://localhost:4566',
        aws_access_key_id='test',
        aws_secret_access_key='test'
    )
    
    s3_client = boto3.client(
        's3',
        endpoint_url='http://localhost:4566',
        aws_access_key_id='test',
        aws_secret_access_key='test'
    )
    
    try:
        # Extraer información de la request
        http_method = event.get('httpMethod', 'GET')
        path = event.get('path', '/')
        body = event.get('body', '{}')
        
        if body:
            try:
                body_data = json.loads(body)
            except:
                body_data = {}
        else:
            body_data = {}
        
        # Router básico
        if path == '/health':
            return api_response(200, {'status': 'healthy', 'timestamp': datetime.now().isoformat()})
            
        elif path == '/images' and http_method == 'GET':
            # Listar imágenes procesadas
            response = dynamodb.scan(
                TableName='RoxsImageMetadata',
                ProjectionExpression='ImageId,OriginalKey,ProcessedAt,#status',
                ExpressionAttributeNames={'#status': 'Status'}
            )
            
            images = []
            for item in response.get('Items', []):
                images.append({
                    'id': item.get('ImageId', {}).get('S'),
                    'filename': item.get('OriginalKey', {}).get('S'),
                    'processed_at': item.get('ProcessedAt', {}).get('S'),
                    'status': item.get('Status', {}).get('S', 'unknown')
                })
            
            return api_response(200, {
                'images': images,
                'count': len(images)
            })
            
        elif path == '/logs' and http_method == 'GET':
            # Obtener logs recientes
            response = dynamodb.scan(
                TableName='RoxsLogIndex',
                Limit=20
            )
            
            logs = []
            for item in response.get('Items', []):
                logs.append({
                    'level': item.get('LogLevel', {}).get('S'),
                    'timestamp': int(item.get('Timestamp', {}).get('N', '0')),
                    'message': item.get('Message', {}).get('S'),
                    'service': item.get('Service', {}).get('S')
                })
            
            # Ordenar por timestamp descendente
            logs.sort(key=lambda x: x['timestamp'], reverse=True)
            
            return api_response(200, {
                'logs': logs[:10],  # Top 10 más recientes
                'total_scanned': len(logs)
            })
            
        elif path == '/notifications' and http_method == 'POST':
            # Crear nueva notificación (integrar con sistema anterior)
            title = body_data.get('title', 'Nueva notificación')
            message = body_data.get('message', 'Mensaje desde API')
            priority = body_data.get('priority', 'normal')
            
            # Llamar al procesador de notificaciones
            lambda_client = boto3.client(
                'lambda',
                endpoint_url='http://localhost:4566',
                aws_access_key_id='test',
                aws_secret_access_key='test'
            )
            
            notification_payload = {
                'type': 'api',
                'title': title,
                'message': message,
                'priority': priority,
                'recipient': 'api-user@roxs.com'
            }
            
            lambda_response = lambda_client.invoke(
                FunctionName='roxs-notification-processor',
                Payload=json.dumps(notification_payload)
            )
            
            result = json.loads(lambda_response['Payload'].read())
            
            return api_response(200, {
                'message': 'Notificación enviada exitosamente',
                'notification_result': result
            })
            
        elif path.startswith('/files') and http_method == 'GET':
            # Listar archivos en S3
            bucket = 'roxs-images-original'
            try:
                response = s3_client.list_objects_v2(Bucket=bucket)
                files = []
                
                for obj in response.get('Contents', []):
                    files.append({
                        'key': obj['Key'],
                        'size': obj['Size'],
                        'last_modified': obj['LastModified'].isoformat(),
                        'url': f"http://localhost:4566/{bucket}/{obj['Key']}"
                    })
                
                return api_response(200, {
                    'bucket': bucket,
                    'files': files,
                    'count': len(files)
                })
                
            except Exception as e:
                return api_response(500, {'error': f'Error accessing S3: {str(e)}'})
                
        elif path == '/stats' and http_method == 'GET':
            # Estadísticas generales del sistema
            stats = {}
            
            # Contar imágenes
            try:
                img_response = dynamodb.scan(
                    TableName='RoxsImageMetadata',
                    Select='COUNT'
                )
                stats['total_images'] = img_response['Count']
            except:
                stats['total_images'] = 0
            
            # Contar logs
            try:
                log_response = dynamodb.scan(
                    TableName='RoxsLogIndex',
                    Select='COUNT'
                )
                stats['total_logs'] = log_response['Count']
            except:
                stats['total_logs'] = 0
            
            # Contar notificaciones
            try:
                notif_response = dynamodb.scan(
                    TableName='RoxsNotificationHistory',
                    Select='COUNT'
                )
                stats['total_notifications'] = notif_response['Count']
            except:
                stats['total_notifications'] = 0
            
            # Contar archivos en S3
            try:
                s3_response = s3_client.list_objects_v2(Bucket='roxs-images-original')
                stats['total_files'] = len(s3_response.get('Contents', []))
            except:
                stats['total_files'] = 0
            
            stats['system_uptime'] = 'LocalStack simulation'
            stats['generated_at'] = datetime.now().isoformat()
            
            return api_response(200, stats)
            
        else:
            # Ruta no encontrada
            return api_response(404, {
                'error': 'Endpoint not found',
                'path': path,
                'method': http_method,
                'available_endpoints': [
                    'GET /health',
                    'GET /images',
                    'GET /logs', 
                    'POST /notifications',
                    'GET /files',
                    'GET /stats'
                ]
            })
            
    except Exception as e:
        print(f"Error in API handler: {str(e)}")
        return api_response(500, {'error': str(e)})

def api_response(status_code, body):
    """Helper para formatear respuestas de API"""
    return {
        'statusCode': status_code,
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': 'Content-Type',
            'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS'
        },
### **🚀 Paso 2: Desplegar API Lambda**

```bash
# Empaquetar función API
zip api-handler.zip api_handler.py

# Crear función Lambda para API
awslocal lambda create-function \
    --function-name roxs-api-handler \
    --runtime python3.9 \
    --role arn:aws:iam::000000000000:role/lambda-role \
    --handler api_handler.lambda_handler \
    --zip-file fileb://api-handler.zip \
    --timeout 30 \
    --description "API Gateway handler: rutas completas de la aplicación"
```

### **🌐 Paso 3: Crear API Gateway**

```bash
# Crear API REST
api_id=$(awslocal apigateway create-rest-api \
    --name 'roxs-complete-api' \
    --description 'API completa con múltiples servicios integrados' \
    --query 'id' --output text)

echo "API ID: $api_id"

# Obtener resource root
root_id=$(awslocal apigateway get-resources \
    --rest-api-id $api_id \
    --query 'items[0].id' --output text)

echo "Root Resource ID: $root_id"

# Crear resource para capturar todas las rutas
resource_id=$(awslocal apigateway create-resource \
    --rest-api-id $api_id \
    --parent-id $root_id \
    --path-part '{proxy+}' \
    --query 'id' --output text)

echo "Proxy Resource ID: $resource_id"

# Crear método ANY para manejar todos los HTTP methods
awslocal apigateway put-method \
    --rest-api-id $api_id \
    --resource-id $resource_id \
    --http-method ANY \
    --authorization-type NONE

# Integrar con Lambda
awslocal apigateway put-integration \
    --rest-api-id $api_id \
    --resource-id $resource_id \
    --http-method ANY \
    --type AWS_PROXY \
    --integration-http-method POST \
    --uri arn:aws:apigateway:us-east-1:lambda:path/2015-03-31/functions/arn:aws:lambda:us-east-1:000000000000:function:roxs-api-handler/invocations

# También agregar método root
awslocal apigateway put-method \
    --rest-api-id $api_id \
    --resource-id $root_id \
    --http-method ANY \
    --authorization-type NONE

awslocal apigateway put-integration \
    --rest-api-id $api_id \
    --resource-id $root_id \
    --http-method ANY \
    --type AWS_PROXY \
    --integration-http-method POST \
    --uri arn:aws:apigateway:us-east-1:lambda:path/2015-03-31/functions/arn:aws:lambda:us-east-1:000000000000:function:roxs-api-handler/invocations

# Desplegar API
awslocal apigateway create-deployment \
    --rest-api-id $api_id \
    --stage-name prod

echo "API URL: http://localhost:4566/restapis/$api_id/prod/_user_request_"
```

### **🧪 Paso 4: Probar API completa**

```bash
# Guardar API URL para facilidad
API_URL="http://localhost:4566/restapis/$api_id/prod/_user_request_"

# 1. Health check
curl "$API_URL/health"

# 2. Ver estadísticas del sistema
curl "$API_URL/stats" | jq

# 3. Listar imágenes procesadas
curl "$API_URL/images" | jq

# 4. Ver logs recientes
curl "$API_URL/logs" | jq

# 5. Listar archivos en S3
curl "$API_URL/files" | jq

# 6. Crear notificación via API
curl -X POST "$API_URL/notifications" \
    -H "Content-Type: application/json" \
    -d '{
        "title": "Notificación desde API",
        "message": "Esta notificación fue creada via REST API",
        "priority": "high"
    }' | jq

# 7. Verificar endpoint no existente
curl "$API_URL/nonexistent" | jq
```

---

## 🔄 Flujo de integración completo

### **🎯 Demostración de arquitectura end-to-end**

```bash
#!/bin/bash
# complete-demo.sh

echo "🚀 Demo de arquitectura completa LocalStack"
echo "=========================================="

API_URL="http://localhost:4566/restapis/$api_id/prod/_user_request_"

echo "1. 📊 Estado inicial del sistema"
curl -s "$API_URL/stats" | jq

echo -e "\n2. 📸 Subiendo nueva imagen..."
echo "Nueva imagen para procesar: $(date)" > new-demo-image.jpg
awslocal s3 cp new-demo-image.jpg s3://roxs-images-original/

echo -e "\n3. ⚡ Procesando imagen con Lambda..."
awslocal lambda invoke \
    --function-name roxs-image-processor \
    --payload '{
        "bucket": "roxs-images-original",
        "key": "new-demo-image.jpg"
    }' \
    demo-process-result.json > /dev/null

echo "Resultado del procesamiento:"
cat demo-process-result.json | jq

echo -e "\n4. 📝 Generando logs de aplicación..."
awslocal lambda invoke \
    --function-name roxs-log-processor \
    --payload '{
        "logs": [
            {
                "level": "INFO",
                "message": "Image processing completed successfully",
                "service": "image-processor",
                "user_id": "demo-user"
            },
            {
                "level": "DEBUG",
                "message": "Thumbnail generated and stored",
                "service": "image-processor", 
                "user_id": "demo-user"
            }
        ]
    }' \
    demo-logs-result.json > /dev/null

echo "Logs procesados exitosamente"

echo -e "\n5. 🔔 Enviando notificación de completitud..."
curl -s -X POST "$API_URL/notifications" \
    -H "Content-Type: application/json" \
    -d '{
        "title": "Procesamiento completado",
        "message": "La imagen new-demo-image.jpg fue procesada exitosamente",
        "priority": "normal"
    }' | jq

echo -e "\n6. 📊 Estado final del sistema"
curl -s "$API_URL/stats" | jq

echo -e "\n7. 🔍 Verificando resultados..."
echo "Imágenes procesadas:"
curl -s "$API_URL/images" | jq '.count'

echo "Logs en el sistema:"
curl -s "$API_URL/logs" | jq '.total_scanned'

echo "Archivos en S3:"
awslocal s3 ls s3://roxs-images-original/ | wc -l

echo -e "\n✅ Demo completo - Todos los servicios integrados funcionando!"
```

---

## 📊 Monitoreo y observabilidad

### **📈 Dashboard de métricas**

```python
# dashboard.py
import json
import boto3
from datetime import datetime, timedelta

def lambda_handler(event, context):
    """
    Dashboard de métricas del sistema completo
    """
    # Clientes AWS
    dynamodb = boto3.client(
        'dynamodb',
        endpoint_url='http://localhost:4566',
        aws_access_key_id='test',
        aws_secret_access_key='test'
    )
    
    s3_client = boto3.client(
        's3',
        endpoint_url='http://localhost:4566',
        aws_access_key_id='test',
        aws_secret_access_key='test'
    )
    
    lambda_client = boto3.client(
        'lambda',
        endpoint_url='http://localhost:4566',
        aws_access_key_id='test',
        aws_secret_access_key='test'
    )
    
    try:
        dashboard_data = {}
        
        # Métricas de imágenes
        try:
            img_response = dynamodb.scan(TableName='RoxsImageMetadata')
            images = img_response.get('Items', [])
            
            dashboard_data['images'] = {
                'total': len(images),
                'successful': len([img for img in images if img.get('Status', {}).get('S') == 'completed']),
                'failed': len([img for img in images if img.get('Status', {}).get('S') == 'error']),
                'avg_size': sum(int(img.get('OriginalSize', {}).get('N', '0')) for img in images) / max(len(images), 1)
            }
        except:
            dashboard_data['images'] = {'total': 0, 'successful': 0, 'failed': 0, 'avg_size': 0}
        
        # Métricas de logs
        try:
            log_response = dynamodb.scan(TableName='RoxsLogIndex')
            logs = log_response.get('Items', [])
            
            log_levels = {}
            for log in logs:
                level = log.get('LogLevel', {}).get('S', 'UNKNOWN')
                log_levels[level] = log_levels.get(level, 0) + 1
            
            dashboard_data['logs'] = {
                'total': len(logs),
                'by_level': log_levels,
                'recent_errors': len([log for log in logs if log.get('LogLevel', {}).get('S') == 'ERROR'])
            }
        except:
            dashboard_data['logs'] = {'total': 0, 'by_level': {}, 'recent_errors': 0}
        
        # Métricas de notificaciones
        try:
            notif_response = dynamodb.scan(TableName='RoxsNotificationHistory')
            notifications = notif_response.get('Items', [])
            
            priority_count = {}
            for notif in notifications:
                priority = notif.get('Priority', {}).get('S', 'normal')
                priority_count[priority] = priority_count.get(priority, 0) + 1
            
            dashboard_data['notifications'] = {
                'total': len(notifications),
                'by_priority': priority_count,
                'successful': len([n for n in notifications if n.get('Status', {}).get('S') == 'sent'])
            }
        except:
            dashboard_data['notifications'] = {'total': 0, 'by_priority': {}, 'successful': 0}
        
        # Métricas de S3
        try:
            buckets = ['roxs-images-original', 'roxs-images-processed', 'roxs-images-thumbnails', 'roxs-logs-storage']
            s3_metrics = {}
            
            for bucket in buckets:
                try:
                    response = s3_client.list_objects_v2(Bucket=bucket)
                    objects = response.get('Contents', [])
                    total_size = sum(obj['Size'] for obj in objects)
                    s3_metrics[bucket] = {
                        'objects': len(objects),
                        'total_size_bytes': total_size
                    }
                except:
                    s3_metrics[bucket] = {'objects': 0, 'total_size_bytes': 0}
            
            dashboard_data['storage'] = s3_metrics
        except:
            dashboard_data['storage'] = {}
        
        # Métricas de Lambda
        try:
            functions_response = lambda_client.list_functions()
            functions = functions_response.get('Functions', [])
            
            dashboard_data['functions'] = {
                'total': len(functions),
                'names': [f['FunctionName'] for f in functions]
            }
        except:
            dashboard_data['functions'] = {'total': 0, 'names': []}
        
        # Metadata del dashboard
        dashboard_data['metadata'] = {
            'generated_at': datetime.now().isoformat(),
            'system': 'LocalStack',
            'version': '1.0.0'
        }
        
        return {
            'statusCode': 200,
            'body': json.dumps(dashboard_data, indent=2)
        }
        
    except Exception as e:
        return {
            'statusCode': 500,
            'body': json.dumps({'error': str(e)})
        }
```

### **🚀 Desplegar dashboard**

```bash
# Empaquetar dashboard
zip dashboard.zip dashboard.py

# Crear función
awslocal lambda create-function \
    --function-name roxs-dashboard \
    --runtime python3.9 \
    --role arn:aws:iam::000000000000:role/lambda-role \
    --handler dashboard.lambda_handler \
    --zip-file fileb://dashboard.zip \
    --timeout 30 \
    --description "Dashboard de métricas del sistema completo"

# Probar dashboard
awslocal lambda invoke \
    --function-name roxs-dashboard \
    dashboard-output.json

cat dashboard-output.json | jq
```

---

## 💡 Tarea del Día

### 📝 **Parte 1: Arquitectura básica** (30 minutos)

**Implementar el procesador de imágenes completo:**

1. **Crear toda la infraestructura**:
   ```bash
   # Buckets
   awslocal s3 mb s3://mi-images-original
   awslocal s3 mb s3://mi-images-processed
   
   # Tabla DynamoDB
   awslocal dynamodb create-table \
       --table-name MiImageMetadata \
       --attribute-definitions AttributeName=ImageId,AttributeType=S \
       --key-schema AttributeName=ImageId,KeyType=HASH \
       --provisioned-throughput ReadCapacityUnits=5,WriteCapacityUnits=5
   ```

2. **Desplegar función procesadora** (usar código del ejemplo)

3. **Probar con tus propias imágenes**:
   ```bash
   echo "Mi primera imagen" > mi-foto.jpg
   awslocal s3 cp mi-foto.jpg s3://mi-images-original/
   
   # Procesar
   awslocal lambda invoke \
       --function-name roxs-image-processor \
       --payload '{"bucket": "mi-images-original", "key": "mi-foto.jpg"}' \
       mi-resultado.json
   ```

### ⚡ **Parte 2: Sistema de logs** (20 minutos)

**Implementar tu propio sistema de logs:**

1. **Desplegar sistema de logs** (usar código del ejemplo)

2. **Generar logs de tu aplicación imaginaria**:
   ```bash
   awslocal lambda invoke \
       --function-name roxs-log-processor \
       --payload '{
           "logs": [
               {
                   "level": "INFO",
                   "message": "Usuario TU_NOMBRE inició sesión",
                   "service": "mi-auth-service",
                   "user_id": "TU_NOMBRE"
               },
               {
                   "level": "ERROR",
                   "message": "Falló conexión a base de datos",
                   "service": "mi-api",
                   "user_id": "system"
               }
           ]
       }' \
       mis-logs.json
   ```

### 🌐 **Parte 3: API básica** (25 minutos)

**Crear una versión simplificada de la API:**

1. **Crear función API simple**:
   ```python
   # mi_api.py
   import json
   import boto3
   
   def lambda_handler(event, context):
       path = event.get('path', '/')
       
       if path == '/health':
           return {
               'statusCode': 200,
               'body': json.dumps({'status': 'ok', 'student': 'TU_NOMBRE'})
           }
       elif path == '/stats':
           return {
               'statusCode': 200, 
               'body': json.dumps({
                   'images_processed': 'check_dynamodb',
                   'logs_generated': 'check_dynamodb',
                   'student': 'TU_NOMBRE'
               })
           }
       else:
           return {
               'statusCode': 404,
               'body': json.dumps({'error': 'Not found'})
           }
   ```

2. **Desplegar y probar**

### 📸 **Parte 4: Evidencia y análisis**

**Capturas a tomar:**
1. Lista de todas las funciones Lambda que creaste
2. Lista de todas las tablas DynamoDB
3. Lista de todos los buckets S3 con contenido
4. Respuesta de tu API personal

**Análisis a incluir:**
- ¿Qué fue lo más desafiante de integrar múltiples servicios?
- ¿Cómo cambió tu comprensión de las arquitecturas serverless?
- ¿Qué patrones de integración descubriste?

### 🏆 **Desafío Master**: ¡Sistema completo personalizado!

**Crear tu propia arquitectura end-to-end:**

1. **Tema libre**: Elige un dominio (e-commerce, blog, IoT, etc.)
2. **Mínimo 3 servicios**: S3 + Lambda + DynamoDB
3. **API funcional**: Al menos 3 endpoints
4. **Flujo completo**: Desde input hasta output
5. **Monitoreo**: Dashboard básico de métricas

**Ejemplos de sistemas:**
- **Blog**: Subir posts → Lambda procesa → DynamoDB guarda → API lee
- **E-commerce**: Subir productos → Lambda valida → DynamoDB catalogo → API busca
- **IoT**: Sensores → Lambda analiza → DynamoDB histórico → API dashboard

---

## 📤 **Compartir en Discord**

**Mensaje a incluir:**

1. **¿Qué arquitectura implementaste completamente?**
2. **¿Cuál fue la integración más compleja?**
3. **¿Qué aprendiste sobre el diseño de sistemas distribuidos?**
4. **¿Lograste el desafío master? ¿Qué sistema creaste?**
5. **¿Cómo aplicarías esto en un proyecto real?**

**Screenshots esenciales:**
- Dashboard de métricas (output del dashboard.py)
- Lista completa de recursos (Lambda, S3, DynamoDB)
- Respuesta de tu API personalizada
- (Bonus) Flujo completo de tu sistema personalizado

---

## 🔮 Lo que viene mañana...

**Día 63**: ¡Desafío final de la semana!
- Proyecto integrador completo
- Caso de uso empresarial real
- Documentación de arquitectura
- Deploy de aplicación roxs-voting-app

---

## 💎 Tips Pro de integración

### 🔗 **Patrones de integración**
```bash
# Event-driven: S3 → Lambda (trigger automático)
# Request-response: API Gateway → Lambda → DynamoDB
# Async processing: SQS → Lambda → SNS
# Data pipeline: S3 → Lambda → DynamoDB → S3
```

### ⚡ **Optimización de rendimiento**
```python
# Reutilizar clientes AWS
# Crear clientes fuera del handler cuando sea posible
s3_client = boto3.client('s3', endpoint_url='http://localhost:4566')

def lambda_handler(event, context):
    # Usar cliente reutilizado
    pass
```

### 🔄 **Manejo de errores**
```python
# Siempre implementar retry logic y error handling
try:
    result = process_data()
except Exception as e:
    # Log error
    # Send to DLQ (Dead Letter Queue)
    # Return appropriate error response
    pass
```

### 📊 **Monitoring**
```bash
# Siempre incluir métricas en tus funciones
# CloudWatch metrics (en AWS real)
# Logs estructurados
# Health checks
```

¡Mañana el gran finale de la semana ! 🎯🚀
