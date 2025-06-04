---
title: Día 59 -  Simula S3 en tu máquina
description: Aprende a usar LocalStack para simular Amazon S3, crear buckets y subir archivos.
sidebar_position: 3
---

## Simula Amazon S3 en tu máquina

![](../../static/images/banner/9.png)

## ☁️ ¡Bienvenidos al mundo de S3 local!

¡Hola Roxs! Ayer configuramos LocalStack y hoy vamos a simular uno de los servicios más populares y útiles de AWS: **Amazon S3**.

¿Listos para crear su propio almacenamiento en la nube sin gastar un centavo? 🚀

---

## 🧠 ¿Qué es Amazon S3?

**Amazon S3 (Simple Storage Service)** es el servicio de almacenamiento de objetos más utilizado del mundo. Te permite:

### 📦 **Conceptos clave:**
- **Buckets**: Contenedores donde guardas tus archivos (como carpetas)
- **Objects**: Los archivos que subís (fotos, videos, documentos, etc.)
- **Keys**: El nombre/ruta única de cada archivo dentro del bucket
- **Metadata**: Información adicional sobre cada archivo

### 🌟 **¿Para qué se usa S3?**
- 🖼️ **Hosting de archivos estáticos** (imágenes, CSS, JS)
- 💾 **Backups y archivos** de aplicaciones
- 📊 **Data Lakes** para análisis de big data
- 🎬 **Streaming de contenido** (videos, música)
- 📱 **Storage para aplicaciones móviles**
- 🗄️ **Archivos de logs** y monitoreo

### 💰 **¿Por qué simularlo localmente?**
En AWS real, S3 cobra por:
- Almacenamiento utilizado
- Requests (GET, PUT, DELETE)
- Transferencia de datos
- Características avanzadas

¡Con LocalStack todo es gratis y instantáneo! 🎉

---

## 🚀 Preparando el entorno

### **Paso 1: Verificar que LocalStack esté corriendo**

```bash
# Si no está corriendo, iniciarlo
localstack start

# Verificar estado
localstack status

# Verificar que S3 esté disponible
curl http://localhost:4566/health | jq '.services.s3'
```

### **Paso 2: Configurar variables de entorno (opcional)**

```bash
# Para facilitar los comandos
export AWS_DEFAULT_REGION=us-east-1
export AWS_ACCESS_KEY_ID=test
export AWS_SECRET_ACCESS_KEY=test
export AWS_DEFAULT_OUTPUT=json
```

---

## 🛠️ Comandos básicos de S3

### 📋 **1. Listar buckets existentes**

```bash
# Ver todos los buckets (inicialmente vacío)
awslocal s3 ls

# Con más detalles
awslocal s3api list-buckets
```

### 🏗️ **2. Crear buckets**

```bash
# Crear un bucket básico
awslocal s3 mb s3://roxs-bucket

# Crear bucket con región específica
awslocal s3 mb s3://roxs-us-west --region us-west-2

# Crear múltiples buckets
awslocal s3 mb s3://roxs-images
awslocal s3 mb s3://roxs-documents
awslocal s3 mb s3://roxs-backups
```

**Resultado esperado:**
```
make_bucket: roxs-bucket
make_bucket: roxs-us-west
make_bucket: roxs-images
make_bucket: roxs-documents
make_bucket: roxs-backups
```

### 📂 **3. Verificar buckets creados**

```bash
# Listar todos los buckets
awslocal s3 ls

# Salida esperada:
# 2024-06-03 12:34:56 roxs-bucket
# 2024-06-03 12:35:02 roxs-us-west
# 2024-06-03 12:35:10 roxs-images
# ...
```

---

## 📤 Subir archivos (Upload)

### **Crear archivos de prueba**

```bash
# Crear archivos de prueba
echo "¡Hola desde LocalStack!" > saludo.txt
echo "Este es mi primer archivo en S3 local" > primer-archivo.txt

# Crear un JSON de ejemplo
cat > usuario.json << EOF
{
  "nombre": "Roxs Developer",
  "email": "dev@roxs.com",
  "skill": "LocalStack Master",
  "fecha": "$(date)"
}
EOF

# Crear una imagen simple (texto)
echo "Esta es una imagen fake" > imagen.jpg

# Crear estructura de carpetas
mkdir -p archivos/{imagenes,documentos,logs}
echo "Foto de perfil" > archivos/imagenes/perfil.jpg
echo "Manual de usuario" > archivos/documentos/manual.pdf
echo "Log de aplicación" > archivos/logs/app.log
```

### **📤 Upload de archivos individuales**

```bash
# Subir archivo simple
awslocal s3 cp saludo.txt s3://roxs-bucket/

# Subir con nombre diferente
awslocal s3 cp primer-archivo.txt s3://roxs-bucket/mi-archivo.txt

# Subir JSON
awslocal s3 cp usuario.json s3://roxs-bucket/data/usuario.json

# Subir a diferentes buckets
awslocal s3 cp imagen.jpg s3://roxs-images/
awslocal s3 cp usuario.json s3://roxs-documents/backup.json
```

### **📁 Upload de carpetas completas**

```bash
# Subir carpeta completa (recursivo)
awslocal s3 cp archivos/ s3://roxs-bucket/archivos/ --recursive

# Subir solo ciertos tipos de archivo
awslocal s3 cp archivos/ s3://roxs-bucket/solo-logs/ --recursive --exclude "*" --include "*.log"
```

---

## 📥 Listar y descargar archivos

### **📋 Listar contenido de buckets**

```bash
# Listar archivos en bucket
awslocal s3 ls s3://roxs-bucket/

# Listar recursivamente
awslocal s3 ls s3://roxs-bucket/ --recursive

# Listar con detalles (tamaño, fecha)
awslocal s3 ls s3://roxs-bucket/ --recursive --human-readable --summarize
```

### **📥 Descargar archivos**

```bash
# Crear carpeta para descargas
mkdir descargas

# Descargar archivo individual
awslocal s3 cp s3://roxs-bucket/saludo.txt descargas/

# Descargar con nombre diferente
awslocal s3 cp s3://roxs-bucket/mi-archivo.txt descargas/descargado.txt

# Descargar carpeta completa
awslocal s3 cp s3://roxs-bucket/archivos/ descargas/archivos/ --recursive
```

---

## 🔧 Operaciones avanzadas

### **🔄 Sincronización**

```bash
# Crear más archivos locales
mkdir sync-test
echo "Archivo nuevo 1" > sync-test/nuevo1.txt
echo "Archivo nuevo 2" > sync-test/nuevo2.txt

# Sincronizar carpeta local con S3
awslocal s3 sync sync-test/ s3://roxs-bucket/sync/

# Sincronizar S3 con carpeta local
mkdir sync-download
awslocal s3 sync s3://roxs-bucket/sync/ sync-download/
```

### **🗑️ Eliminar archivos y buckets**

```bash
# Eliminar archivo específico
awslocal s3 rm s3://roxs-bucket/saludo.txt

# Eliminar múltiples archivos
awslocal s3 rm s3://roxs-bucket/archivos/ --recursive

# Eliminar bucket completo (debe estar vacío)
awslocal s3 rb s3://roxs-us-west

# Forzar eliminación de bucket con contenido
awslocal s3 rb s3://roxs-backups --force
```

### **📊 Información detallada**

```bash
# Ver propiedades de objeto
awslocal s3api head-object --bucket roxs-bucket --key usuario.json

# Ver metadata completa
awslocal s3api get-object-attributes \
  --bucket roxs-bucket \
  --key usuario.json \
  --object-attributes "ETag,Checksum,ObjectParts,StorageClass,ObjectSize"
```

---

## 🌐 Acceso web y URLs

### **🔗 URLs de acceso**

En LocalStack, los archivos son accesibles vía HTTP:

```bash
# Formato de URL para LocalStack
# http://localhost:4566/bucket-name/object-key

# Ejemplos:
curl http://localhost:4566/roxs-bucket/saludo.txt
curl http://localhost:4566/roxs-bucket/data/usuario.json
curl http://localhost:4566/roxs-images/imagen.jpg
```

### **🌍 Configurar bucket para web hosting**

```bash
# Habilitar hosting estático
awslocal s3 website s3://roxs-bucket --index-document index.html --error-document error.html

# Crear archivos web de prueba
cat > index.html << EOF
<!DOCTYPE html>
<html>
<head>
    <title>Mi sitio en S3 Local</title>
</head>
<body>
    <h1>¡Hola desde S3 LocalStack!</h1>
    <p>Este sitio está hosteado en S3 simulado</p>
</body>
</html>
EOF

# Subir archivo web
awslocal s3 cp index.html s3://roxs-bucket/

# Acceder vía web
curl http://localhost:4566/roxs-bucket/index.html
```

---

## 📋 API avanzada con s3api

### **🔍 Información de buckets**

```bash
# Listar buckets con detalles
awslocal s3api list-buckets

# Información de un bucket específico
awslocal s3api head-bucket --bucket roxs-bucket

# Obtener ubicación del bucket
awslocal s3api get-bucket-location --bucket roxs-bucket
```

### **📤 Upload con metadata personalizada**

```bash
# Subir archivo con metadata
awslocal s3api put-object \
  --bucket roxs-bucket \
  --key archivo-con-metadata.txt \
  --body saludo.txt \
  --metadata "author=RoxsDev,version=1.0,environment=local"

# Verificar metadata
awslocal s3api head-object --bucket roxs-bucket --key archivo-con-metadata.txt
```

### **🏷️ Tagging de objetos**

```bash
# Agregar tags a un objeto
awslocal s3api put-object-tagging \
  --bucket roxs-bucket \
  --key usuario.json \
  --tagging 'TagSet=[{Key=Environment,Value=Development},{Key=Owner,Value=RoxsTeam}]'

# Ver tags
awslocal s3api get-object-tagging --bucket roxs-bucket --key usuario.json
```

---

## 🔄 Comparación: LocalStack vs AWS Real

| Característica | LocalStack S3 | AWS S3 Real |
|---------------|---------------|-------------|
| **Costo** | Gratis | Pay-per-use |
| **Velocidad** | Instantáneo | Latencia de red |
| **URLs** | `localhost:4566` | `s3.amazonaws.com` |
| **Regiones** | Simuladas | Reales |
| **Persistencia** | Opcional | Por defecto |
| **Límites** | RAM/Disco local | Ilimitado |
| **SSL/TLS** | HTTP local | HTTPS |
| **IAM** | Básico/simulado | Completo |

---

## 🧪 Scripts útiles

### **📊 Script de estadísticas**

```bash
#!/bin/bash
# s3-stats.sh

echo "📊 Estadísticas de S3 LocalStack"
echo "================================"

echo "🗂️  Buckets totales:"
awslocal s3 ls | wc -l

echo ""
echo "📦 Lista de buckets:"
awslocal s3 ls

echo ""
echo "📄 Archivos por bucket:"
for bucket in $(awslocal s3 ls | awk '{print $3}'); do
    count=$(awslocal s3 ls s3://$bucket --recursive | wc -l)
    echo "  $bucket: $count archivos"
done

echo ""
echo "🔗 URLs de ejemplo:"
awslocal s3 ls s3://roxs-bucket --recursive | head -3 | while read line; do
    key=$(echo $line | awk '{print $4}')
    echo "  http://localhost:4566/roxs-bucket/$key"
done
```

### **🧹 Script de limpieza**

```bash
#!/bin/bash
# cleanup-s3.sh

echo "🧹 Limpiando S3 LocalStack..."

# Eliminar todos los archivos de todos los buckets
for bucket in $(awslocal s3 ls | awk '{print $3}'); do
    echo "Limpiando bucket: $bucket"
    awslocal s3 rm s3://$bucket --recursive
    awslocal s3 rb s3://$bucket
done

echo "✅ Limpieza completa!"
```

### **🚀 Script de setup inicial**

```bash
#!/bin/bash
# setup-s3-demo.sh

echo "🚀 Configurando demo de S3..."

# Crear buckets
awslocal s3 mb s3://roxs-demo
awslocal s3 mb s3://roxs-web

# Crear archivos de prueba
echo "Demo de LocalStack S3" > demo.txt
echo '{"message": "Hello from LocalStack!"}' > data.json

# Crear sitio web simple
cat > index.html << EOF
<!DOCTYPE html>
<html>
<head><title>LocalStack S3 Demo</title></head>
<body>
    <h1>🚀 LocalStack S3 Demo</h1>
    <p>Este sitio está en S3 simulado!</p>
    <a href="data.json">Ver datos JSON</a>
</body>
</html>
EOF

# Subir archivos
awslocal s3 cp demo.txt s3://roxs-demo/
awslocal s3 cp data.json s3://roxs-demo/
awslocal s3 cp index.html s3://roxs-web/

# Configurar hosting web
awslocal s3 website s3://roxs-web --index-document index.html

echo "✅ Demo configurado!"
echo "🌐 Sitio web: http://localhost:4566/roxs-web/index.html"
echo "📄 Datos: http://localhost:4566/roxs-demo/data.json"
```

---

## 💡 Tarea del Día

### 📝 **Parte 1: Buckets básicos** (15 minutos)

1. **Crear buckets temáticos**:
   ```bash
   awslocal s3 mb s3://roxs-images
   awslocal s3 mb s3://roxs-documents  
   awslocal s3 mb s3://roxs-backups
   ```

2. **Verificar creación**:
   ```bash
   awslocal s3 ls
   ```

### 📤 **Parte 2: Upload de archivos** (20 minutos)

1. **Crear archivos de prueba**:
   ```bash
   echo "Mi nombre es [TU_NOMBRE]" > presentacion.txt
   echo '{"curso": "90 días DevOps", "dia": 59}' > progreso.json
   date > timestamp.txt
   ```

2. **Subir archivos a diferentes buckets**:
   ```bash
   awslocal s3 cp presentacion.txt s3://roxs-documents/
   awslocal s3 cp progreso.json s3://roxs-backups/
   awslocal s3 cp timestamp.txt s3://roxs-images/metadata/
   ```

3. **Verificar uploads**:
   ```bash
   awslocal s3 ls s3://roxs-documents/
   awslocal s3 ls s3://roxs-backups/
   awslocal s3 ls s3://roxs-images/ --recursive
   ```

### 🌐 **Parte 3: Acceso web** (10 minutos)

1. **Verificar acceso por URL**:
   ```bash
   curl http://localhost:4566/roxs-documents/presentacion.txt
   curl http://localhost:4566/roxs-backups/progreso.json
   ```

2. **Crear sitio web simple** (Bonus):
   ```bash
   echo "<h1>Mi página en S3 Local</h1>" > mi-web.html
   awslocal s3 cp mi-web.html s3://roxs-images/
   curl http://localhost:4566/roxs-images/mi-web.html
   ```

### 📸 **Parte 4: Evidencia y sharing**

1. **Capturar resultados**:
   - Screenshot de `awslocal s3 ls` mostrando tus buckets
   - Screenshot de `awslocal s3 ls s3://roxs-documents/ --recursive`
   - Screenshot del output de `curl` mostrando el contenido

2. **Compartir en Discord**:
   - Subir capturas al canal #semana9-localstack
   - Incluir en tu mensaje:
     - ¿Qué archivos subiste?
     - ¿Te sorprendió la velocidad vs AWS real?
     - ¿Qué uso le darías a esto en un proyecto real?

### 🏆 **Desafío Bonus**

**Crear un mini sitio web con múltiples páginas:**

1. Crear estructura de archivos:
   ```bash
   mkdir website
   cat > website/index.html << EOF
   <!DOCTYPE html>
   <html>
   <head><title>Mi Portfolio</title></head>
   <body>
       <h1>Mi Portfolio DevOps</h1>
       <a href="about.html">Sobre mí</a> |
       <a href="projects.html">Proyectos</a>
   </body>
   </html>
   EOF
   
   echo "<h1>Sobre mí</h1><p>Estudiante de 90 días DevOps</p>" > website/about.html
   echo "<h1>Proyectos</h1><p>LocalStack S3 Demo</p>" > website/projects.html
   ```

2. Subir sitio completo:
   ```bash
   awslocal s3 cp website/ s3://roxs-web/ --recursive
   ```

3. Probar navegación:
   ```bash
   curl http://localhost:4566/roxs-web/index.html
   curl http://localhost:4566/roxs-web/about.html
   ```

---

## 🔮 Lo que viene mañana...

**Día 60**: ¡Simular AWS Lambda con LocalStack!
- Crear funciones serverless locales
- Invocar funciones Lambda
- Integrar Lambda con S3
- Debug de funciones localmente

---

## 💎 Tips Pro del día

### ⚡ **Performance**
- LocalStack S3 usa el filesystem local - ¡es súper rápido!
- Para archivos grandes, considera usar `--multipart-threshold`
- Los archivos persisten solo si usas `PERSISTENCE=1`

### 🔄 **Workflows útiles**
```bash
# Upload masivo con filtros
awslocal s3 sync ./logs/ s3://roxs-backups/logs/ --exclude "*.tmp"

# Backup con timestamp
awslocal s3 sync ./app/ s3://roxs-backups/$(date +%Y%m%d)/ --delete
```

### 🚀 **Comandos que usarás mucho**
```bash
# Ver todo tu S3 de un vistazo
awslocal s3 ls --recursive

# URL rápida para testing
echo "http://localhost:4566/[BUCKET]/[KEY]"

# Cleanup rápido
awslocal s3 rm s3://[BUCKET] --recursive
```

¡Mañana vamos a crear funciones Lambda que procesen estos archivos de S3! 🔥⚡