---
title: Día 32 -  ConfigMaps y Secrets - Configuraciones Seguras
description: Gestionando configuraciones y datos sensibles en Kubernetes
sidebar_position: 4
---
## 🔐 ConfigMaps y Secrets - Configuraciones Seguras


- [Kubernetes Encryption at Rest](https://kubernetes.io/docs/tasks/administer-cluster/encrypt-data/)
- [Sealed Secrets (Bitnami)](https://github.com/bitnami-labs/sealed-secrets)
- [External Secrets Operator](https://external-secrets.io/)
En aplicaciones reales, necesitamos separar la **configuración** del **código**, y mantener las **credenciales seguras**.


## 🧩 Diferencias Técnicas y de Seguridad

| Característica         | ConfigMap                | Secret                        |
|-----------------------|--------------------------|-------------------------------|
| Propósito             | Configuración no sensible| Datos sensibles (credenciales)|
| Almacenamiento        | etcd en texto plano      | etcd codificado en base64*    |
| Acceso                | Pods, Volúmenes, CLI     | Pods, Volúmenes, CLI          |
| Visibilidad           | Cualquier usuario con acceso al cluster | Restringido por RBAC         |
| Tamaño máximo         | 1 MiB                    | 1 MiB                         |
| Codificación          | Ninguna                  | base64                        |
| Uso recomendado       | Parámetros, config files | Contraseñas, tokens, llaves   |

> *Nota: Secrets pueden ser cifrados en reposo si se habilita [Encryption at Rest](https://kubernetes.io/docs/tasks/administer-cluster/encrypt-data/).

---

## 🖼️ Diagrama: Flujo de Configuración en Kubernetes

```mermaid
flowchart TD
    A[ConfigMap / Secret] -->|referencia| B(Pod)
    B -->|env / volumen| C[Aplicación]
    A -.->|kubectl| D[Usuario/Admin]
    C -->|lectura| E[Variables de entorno / Archivos]
```

---

## 🤔 ¿Por qué separar configuraciones?

Imagina una aplicación que necesita:
- 🌐 URL de base de datos
- 🔑 Credenciales de acceso
- ⚙️ Variables de entorno específicas por ambiente

**❌ Malo: Hardcodear en la imagen**
```dockerfile
ENV DB_HOST=mysql.prod.com
ENV DB_PASSWORD=supersecreta123
```

**✅ Bueno: Externalizar configuraciones**
- ConfigMaps para datos no sensibles
- Secrets para credenciales y datos sensibles

---

## 📋 ConfigMaps - Configuraciones No Sensibles

### ¿Qué son los ConfigMaps?
Los **ConfigMaps** almacenan datos de configuración en formato clave-valor:

**Errores comunes:**
- Incluir datos sensibles por error (¡usa Secret para eso!).
- Nombres poco descriptivos.
- No documentar el propósito de cada clave.

### Crear ConfigMaps

**Método Imperativo:**
```bash
# Desde valores literales
kubectl create configmap app-config \
  --from-literal=database_url=mysql://db:3306/myapp \
  --from-literal=debug_mode=true \
  --from-literal=max_connections=100

# Desde archivo
echo "log_level=info
cache_size=512MB
timeout=30s" > app.properties

kubectl create configmap app-config-file --from-file=app.properties
```

**Validación rápida:**
```bash
kubectl get configmap app-config -o yaml
```

**Método Declarativo:**

`configmap.yaml`:
```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: app-config
data:
  # Configuraciones simples
  database_url: "mysql://db:3306/myapp"
  debug_mode: "true"
  max_connections: "100"
  log_level: "info"
  
  # Archivo de configuración completo
  app.properties: |
    server.port=8080
    server.name=mi-app
    cache.enabled=true
    cache.ttl=3600
    
  nginx.conf: |
    server {
        listen 80;
        server_name localhost;
        location / {
            proxy_pass http://backend-service:8080;
        }
    }
```

```bash
# Aplicar el ConfigMap
kubectl apply -f configmap.yaml

# Ver ConfigMaps
kubectl get configmaps
kubectl describe configmap app-config
```

---

## 🔐 Secrets - Datos Sensibles

### ¿Qué son los Secrets?
Los **Secrets** almacenan datos sensibles codificados en base64:

**Errores comunes:**
- Subir archivos Secret a repositorios públicos.
- Compartir Secrets entre ambientes (dev/prod).
- No rotar credenciales periódicamente.

### Tipos de Secrets

1. **Opaque** - Datos arbitrarios definidos por el usuario
2. **kubernetes.io/tls** - Certificados TLS
3. **kubernetes.io/dockerconfigjson** - Credenciales de Docker Registry

### Crear Secrets

**Método Imperativo:**
```bash
# Secret básico
kubectl create secret generic db-credentials \
  --from-literal=username=admin \
  --from-literal=password=supersecreta123

# Desde archivo
echo -n 'admin' > username.txt
echo -n 'mi-password-secreto' > password.txt
kubectl create secret generic app-secrets --from-file=username.txt --from-file=password.txt

# Secret para Docker Registry
kubectl create secret docker-registry regcred \
  --docker-server=https://index.docker.io/v1/ \
  --docker-username=miusuario \
  --docker-password=mipassword \
  --docker-email=mi@email.com
```

**Método Declarativo:**

`secret.yaml`:
```yaml
apiVersion: v1
kind: Secret
metadata:
  name: app-secrets
type: Opaque
data:
  # Valores en base64
  username: YWRtaW4=     # admin
  password: c3VwZXJzZWNyZXRhMTIz  # supersecreta123
  api-key: bXktYXBpLWtleS0xMjM=   # mi-api-key-123
---
apiVersion: v1
kind: Secret
metadata:
  name: tls-secret
type: kubernetes.io/tls
data:
  tls.crt: LS0tLS1CRUdJTi... # certificado en base64
  tls.key: LS0tLS1CRUdJTi... # clave privada en base64
```

**💡 Tip:** Para codificar en base64:
```bash
echo -n 'mi-password' | base64
# Para decodificar:
echo 'bWktcGFzc3dvcmQ=' | base64 -d
```

---

## 🔧 Usando ConfigMaps y Secrets en Pods

### 1. Como Variables de Entorno

`deployment-with-config.yaml`:
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: web-app
spec:
  replicas: 2
  selector:
    matchLabels:
      app: web-app
  template:
    metadata:
      labels:
        app: web-app
    spec:
      containers:
      - name: app
        image: nginx:latest
        env:
        # Desde ConfigMap
        - name: DATABASE_URL
          valueFrom:
            configMapKeyRef:
              name: app-config
              key: database_url
        - name: DEBUG_MODE
          valueFrom:
            configMapKeyRef:
              name: app-config
              key: debug_mode
        
        # Desde Secret
        - name: DB_USERNAME
          valueFrom:
            secretKeyRef:
              name: app-secrets
              key: username
        - name: DB_PASSWORD
          valueFrom:
            secretKeyRef:
              name: app-secrets
              key: password
        
        # Cargar todo el ConfigMap como variables
        envFrom:
        - configMapRef:
            name: app-config
        - secretRef:
            name: app-secrets
```

**Validación avanzada:**
```bash
kubectl exec -it <pod-name> -- printenv | grep -E 'DATABASE_URL|DB_PASSWORD'
```

### 2. Como Volúmenes (Archivos)

`deployment-with-volumes.yaml`:
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: web-app-files
spec:
  replicas: 1
  selector:
    matchLabels:
      app: web-app-files
  template:
    metadata:
      labels:
        app: web-app-files
    spec:
      containers:
      - name: app
        image: nginx:latest
        volumeMounts:
        # Montar ConfigMap como archivos
        - name: config-volume
          mountPath: /etc/config
        - name: nginx-config
          mountPath: /etc/nginx/conf.d
        
        # Montar Secret como archivos
        - name: secret-volume
          mountPath: /etc/secrets
          readOnly: true
      
      volumes:
      # Volumen desde ConfigMap
      - name: config-volume
        configMap:
          name: app-config
      - name: nginx-config
        configMap:
          name: app-config
          items:
          - key: nginx.conf
            path: default.conf
      
      # Volumen desde Secret
      - name: secret-volume
        secret:
          secretName: app-secrets
          defaultMode: 0400  # Solo lectura para el propietario
```

**Validación avanzada:**
```bash
kubectl exec -it <pod-name> -- ls -l /etc/secrets
kubectl exec -it <pod-name> -- cat /etc/nginx/conf.d/default.conf
```

---

## 🧪 Ejercicio Práctico: Aplicación Completa

Vamos a crear una aplicación web con configuración completa:

### 1. Crear las configuraciones

`complete-config.yaml`:
```yaml
# ConfigMap para configuración de la app
apiVersion: v1
kind: ConfigMap
metadata:
  name: webapp-config
data:
  environment: "development"
  log_level: "debug"
  cache_enabled: "true"
  app_port: "3000"
  
  # Configuración de nginx
  nginx.conf: |
    server {
        listen 80;
        server_name localhost;
        
        location / {
            proxy_pass http://localhost:3000;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
        }
        
        location /health {
            access_log off;
            return 200 "healthy\n";
        }
    }

---
# Secret para credenciales
apiVersion: v1
kind: Secret
metadata:
  name: webapp-secrets
type: Opaque
data:
  db_password: bXlzZWNyZXRwYXNzd29yZA==  # mysecretpassword
  api_key: YWJjZGVmZ2hpams=              # abcdefghijk
  jwt_secret: bXktand0LXNlY3JldC1rZXk=   # my-jwt-secret-key

---
# Deployment que usa ambos
apiVersion: apps/v1
kind: Deployment
metadata:
  name: webapp
spec:
  replicas: 2
  selector:
    matchLabels:
      app: webapp
  template:
    metadata:
      labels:
        app: webapp
    spec:
      containers:
      - name: webapp
        image: httpd:2.4
        ports:
        - containerPort: 80
        
        # Variables de entorno desde ConfigMap
        env:
        - name: ENVIRONMENT
          valueFrom:
            configMapKeyRef:
              name: webapp-config
              key: environment
        - name: LOG_LEVEL
          valueFrom:
            configMapKeyRef:
              name: webapp-config
              key: log_level
        
        # Variables desde Secret
        - name: DB_PASSWORD
          valueFrom:
            secretKeyRef:
              name: webapp-secrets
              key: db_password
        - name: API_KEY
          valueFrom:
            secretKeyRef:
              name: webapp-secrets
              key: api_key
        
        # Montar configuración de nginx
        volumeMounts:
        - name: nginx-config
          mountPath: /usr/local/apache2/conf/extra/
        - name: secrets-volume
          mountPath: /etc/app-secrets
          readOnly: true
      
      volumes:
      - name: nginx-config
        configMap:
          name: webapp-config
          items:
          - key: nginx.conf
            path: httpd-vhosts.conf
      - name: secrets-volume
        secret:
          secretName: webapp-secrets

---
# Service para exponer la aplicación
apiVersion: v1
kind: Service
metadata:
  name: webapp-service
spec:
  selector:
    app: webapp
  ports:
  - port: 80
    nodePort: 30200
  type: NodePort
```

```bash
# Desplegar todo
kubectl apply -f complete-config.yaml

# Verificar que todo esté funcionando
kubectl get configmaps
kubectl get secrets
kubectl get pods
kubectl get services
```

### 2. Verificar las configuraciones

```bash
# Ver el contenido del ConfigMap
kubectl describe configmap webapp-config

# Ver las claves del Secret (no los valores)
kubectl describe secret webapp-secrets

# Entrar en un pod para verificar las variables
kubectl exec -it <pod-name> -- env | grep -E "(ENVIRONMENT|LOG_LEVEL|DB_PASSWORD)"

# Ver archivos montados
kubectl exec -it <pod-name> -- ls -la /etc/app-secrets/
kubectl exec -it <pod-name> -- cat /usr/local/apache2/conf/extra/httpd-vhosts.conf
```

**Solución a errores comunes:**
- Si no ves los valores actualizados, ejecuta:
  ```bash
  kubectl rollout restart deployment webapp
  ```
- Si el Secret no se monta, revisa los permisos RBAC y el nombre del Secret.

---

## 🔄 Actualizando Configuraciones

```bash
# Editar ConfigMap
kubectl edit configmap webapp-config

# O actualizar desde archivo
kubectl apply -f complete-config.yaml

# Los pods necesitan reiniciarse para aplicar cambios
kubectl rollout restart deployment webapp
```

> **Tip:** Usa `kubectl diff -f archivo.yaml` para ver los cambios antes de aplicar.

---

## 📝 Comandos Útiles

```bash
# ConfigMaps
kubectl get configmaps
kubectl describe configmap <name>
kubectl edit configmap <name>
kubectl delete configmap <name>

# Secrets
kubectl get secrets
kubectl describe secret <name>
kubectl get secret <name> -o yaml
kubectl delete secret <name>

# Ver contenido de Secret (decodificado)
kubectl get secret <name> -o jsonpath='{.data.password}' | base64 -d
```

---

## 🛡️ Mejores Prácticas de Seguridad

### Para ConfigMaps:

### Checklist de Seguridad para Secrets
- 🔒 Habilitar cifrado en reposo en etcd
- 🔒 Limitar acceso con RBAC
- 🔄 Rotar y auditar credenciales periódicamente
- 🚫 Nunca exponer Secrets en logs ni en imágenes
- 📦 Usar herramientas como [Sealed Secrets](https://github.com/bitnami-labs/sealed-secrets) o [External Secrets](https://external-secrets.io/)

### Para Secrets:
- 🔐 Nunca commitear Secrets en Git
- 🔒 Usar RBAC para controlar acceso
- 🔄 Rotar credenciales regularmente
- 📦 Considerar usar herramientas como Sealed Secrets o External Secrets

### Ejemplo de Secret más seguro:

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: secure-secret
  annotations:
    description: "Database credentials for production"
type: Opaque
data:
  username: <base64-encoded>
  password: <base64-encoded>
stringData:  # Más fácil de escribir (se codifica automáticamente)
  config.yaml: |
    database:
      host: db.example.com
      port: 5432
      ssl: true
```

---

## 🛠️ Troubleshooting y Preguntas Frecuentes (FAQ)

**¿Por qué mi Secret aparece en texto plano?**
- Los Secrets están codificados en base64, no cifrados. Habilita cifrado en reposo para mayor seguridad.

**¿Por qué los pods no ven los cambios en ConfigMap/Secret?**
- Los pods deben reiniciarse (`kubectl rollout restart ...`) para cargar nuevos valores.

**¿Puedo montar solo una clave específica de un Secret?**
- Sí, usa la sección `items` en el volumen para seleccionar claves.

**¿Cómo evitar exponer Secrets en el repositorio?**
- Usa herramientas como Sealed Secrets o External Secrets para cifrar y gestionar secretos externos.

**¿Cómo auditar el acceso a Secrets?**
- Habilita audit logs en el API server y revisa los accesos a recursos Secret.

**¿Puedo usar variables de entorno y archivos al mismo tiempo?**
- Sí, puedes consumir ConfigMaps y Secrets como env y como archivos simultáneamente.

---

---

## 📝 Tareas del Día

1. ✅ Crear un ConfigMap con configuraciones de aplicación
2. ✅ Crear un Secret con credenciales de base de datos
3. ✅ Usar ConfigMap como variables de entorno
4. ✅ Usar Secret como variables de entorno
5. ✅ Montar ConfigMap como archivo de configuración
6. ✅ Montar Secret como archivos con permisos restringidos
7. ✅ Desplegar la aplicación completa del ejercicio
8. ✅ Verificar que las configuraciones se aplican correctamente
9. ✅ Actualizar una configuración y reiniciar el deployment

---

## 🎨 Ejemplo Real: Aplicación Node.js

`nodejs-app.yaml`:
```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: nodejs-config
data:
  NODE_ENV: "production"
  PORT: "3000"
  LOG_LEVEL: "info"
  package.json: |
    {
      "name": "mi-app",
      "version": "1.0.0",
      "scripts": {
        "start": "node server.js"
      }
    }

---
apiVersion: v1
kind: Secret
metadata:
  name: nodejs-secrets
type: Opaque
stringData:
  MONGODB_URI: "mongodb://user:password@mongo:27017/myapp"
  JWT_SECRET: "mi-super-secreto-jwt-key"
  API_KEY: "abcd-1234-efgh-5678"

---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: nodejs-app
spec:
  replicas: 3
  selector:
    matchLabels:
      app: nodejs-app
  template:
    metadata:
      labels:
        app: nodejs-app
    spec:
      containers:
      - name: nodejs
        image: node:16-alpine
        ports:
        - containerPort: 3000
        
        envFrom:
        - configMapRef:
            name: nodejs-config
        - secretRef:
            name: nodejs-secrets
        
        volumeMounts:
        - name: app-config
          mountPath: /app/config
        
        readinessProbe:
          httpGet:
            path: /health
            port: 3000
          initialDelaySeconds: 10
          periodSeconds: 5
      
      volumes:
      - name: app-config
        configMap:
          name: nodejs-config
```

---

## 🔗 Recursos Adicionales

- [ConfigMap Documentation](https://kubernetes.io/docs/concepts/configuration/configmap/)
- [Secrets Documentation](https://kubernetes.io/docs/concepts/configuration/secret/)
- [Managing Secret using kubectl](https://kubernetes.io/docs/tasks/configmap-secret/managing-secret-using-kubectl/)

---

🔐 **¡Excelente!** Ya sabes cómo gestionar configuraciones y secretos de forma segura. Mañana trabajaremos con volúmenes persistentes para almacenar datos.

**¡Comparte tu aplicación configurada con #DevOpsConRoxs!** 🚀