---
sidebar_position: 41
---

# Día 41 - Proyecto Final: E-commerce en Kubernetes

## 🎯 Objetivo del Día
Crear un e-commerce completo integrando todos los conceptos aprendidos en la semana 6

---

## 📋 Agenda del Día

| ⏰ Tiempo | 📋 Actividad | 🎯 Objetivo |
|----------|--------------|-------------|
| **30 min** | 🏗️ Arquitectura del proyecto | Diseñar la solución completa |
| **30 min** | 🗄️ Base de datos con volumes | PostgreSQL persistente |
| **30 min** | 🔧 API Backend con health checks | Node.js con monitoreo |
| **30 min** | 🎨 Frontend y networking | React + servicios |
| **30 min** | 📦 Helm charts | Templating y despliegue |
| **30 min** | 🔄 CI/CD pipeline | Automatización completa |

---

## 🏗️ Arquitectura del E-commerce

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   Frontend  │────│    Nginx    │────│   Backend   │
│   (React)   │    │ (LoadBalancer)│    │  (Node.js)  │
└─────────────┘    └─────────────┘    └─────────────┘
                                              │
                                       ┌──────┴──────┐
                                       │             │
                               ┌─────────────┐ ┌─────────────┐
                               │ PostgreSQL  │ │    Redis    │
                               │ (Database)  │ │   (Cache)   │
                               └─────────────┘ └─────────────┘
```

**Componentes principales:**
- **Frontend**: React con Nginx
- **Backend**: API Node.js con Express
- **Base de datos**: PostgreSQL con volúmenes persistentes
- **Cache**: Redis para sesiones
- **Networking**: Services y communication
- **Health checks**: Probes en todos los servicios
- **Multi-ambiente**: Dev, staging, prod

---

## 🚀 Paso 1: Preparación del Proyecto

### 1.1 Estructura del proyecto
```bash
# Crear estructura
mkdir ecommerce-k8s && cd ecommerce-k8s
mkdir -p {apps/{frontend,backend},k8s/{database,redis,backend,frontend},helm-charts,scripts}

# Ver estructura
tree -L 3
```

### 1.2 Crear namespaces
```bash
# Crear ambientes
kubectl create namespace ecommerce-dev
kubectl create namespace ecommerce-staging
kubectl create namespace ecommerce-prod

# Verificar
kubectl get namespaces | grep ecommerce
```

---

## 🗄️ Paso 2: Base de Datos con Volumes

### 2.1 Secret para PostgreSQL
```bash
kubectl create secret generic postgres-secret \
  --from-literal=POSTGRES_PASSWORD=devops2024 \
  --from-literal=POSTGRES_USER=ecommerce_user \
  --from-literal=POSTGRES_DB=ecommerce_db \
  -n ecommerce-dev
```

### 2.2 PostgreSQL con PVC
Crear `k8s/database/postgres.yaml`:
```yaml
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: postgres-pvc
  namespace: ecommerce-dev
spec:
  accessModes:
    - ReadWriteOnce
  resources:
    requests:
      storage: 1Gi
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: postgres
  namespace: ecommerce-dev
spec:
  replicas: 1
  selector:
    matchLabels:
      app: postgres
  template:
    metadata:
      labels:
        app: postgres
    spec:
      containers:
      - name: postgres
        image: postgres:15
        env:
        - name: POSTGRES_DB
          valueFrom:
            secretKeyRef:
              name: postgres-secret
              key: POSTGRES_DB
        - name: POSTGRES_USER
          valueFrom:
            secretKeyRef:
              name: postgres-secret
              key: POSTGRES_USER
        - name: POSTGRES_PASSWORD
          valueFrom:
            secretKeyRef:
              name: postgres-secret
              key: POSTGRES_PASSWORD
        ports:
        - containerPort: 5432
        volumeMounts:
        - name: postgres-storage
          mountPath: /var/lib/postgresql/data
        livenessProbe:
          exec:
            command:
            - /bin/sh
            - -c
            - pg_isready -U $POSTGRES_USER -d $POSTGRES_DB
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          exec:
            command:
            - /bin/sh
            - -c
            - pg_isready -U $POSTGRES_USER -d $POSTGRES_DB
          initialDelaySeconds: 5
          periodSeconds: 5
      volumes:
      - name: postgres-storage
        persistentVolumeClaim:
          claimName: postgres-pvc
---
apiVersion: v1
kind: Service
metadata:
  name: postgres-service
  namespace: ecommerce-dev
spec:
  selector:
    app: postgres
  ports:
  - port: 5432
    targetPort: 5432
```

### 2.3 Redis para cache
Crear `k8s/redis/redis.yaml`:
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: redis
  namespace: ecommerce-dev
spec:
  replicas: 1
  selector:
    matchLabels:
      app: redis
  template:
    metadata:
      labels:
        app: redis
    spec:
      containers:
      - name: redis
        image: redis:7-alpine
        ports:
        - containerPort: 6379
        livenessProbe:
          tcpSocket:
            port: 6379
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          exec:
            command:
            - redis-cli
            - ping
          initialDelaySeconds: 5
          periodSeconds: 5
---
apiVersion: v1
kind: Service
metadata:
  name: redis-service
  namespace: ecommerce-dev
spec:
  selector:
    app: redis
  ports:
  - port: 6379
    targetPort: 6379
```

### 2.4 Aplicar manifests de BD
```bash
kubectl apply -f k8s/database/postgres.yaml
kubectl apply -f k8s/redis/redis.yaml

# Verificar
kubectl get pods -n ecommerce-dev
kubectl get pvc -n ecommerce-dev
kubectl get svc -n ecommerce-dev
```

---

## 🔧 Paso 3: Backend API con Health Checks

### 3.1 Aplicación Node.js
Crear `apps/backend/package.json`:
```json
{
  "name": "ecommerce-backend",
  "version": "1.0.0",
  "main": "app.js",
  "scripts": {
    "start": "node app.js"
  },
  "dependencies": {
    "express": "^4.18.2",
    "pg": "^8.8.0",
    "redis": "^4.6.5",
    "cors": "^2.8.5"
  }
}
```

### 3.2 API completa
Crear `apps/backend/app.js`:
```javascript
const express = require('express');
const { Pool } = require('pg');
const redis = require('redis');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Configuración de base de datos
const pool = new Pool({
  host: process.env.DB_HOST || 'postgres-service',
  database: process.env.DB_NAME || 'ecommerce_db',
  user: process.env.DB_USER || 'ecommerce_user',
  password: process.env.DB_PASSWORD || 'devops2024',
  port: 5432,
});

// Configuración de Redis
const redisClient = redis.createClient({
  socket: {
    host: process.env.REDIS_HOST || 'redis-service',
    port: 6379
  }
});
redisClient.connect().catch(console.error);

// Health checks
app.get('/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

app.get('/health/ready', async (req, res) => {
  try {
    await pool.query('SELECT NOW()');
    await redisClient.ping();
    res.json({ status: 'ready', services: { database: 'ok', cache: 'ok' } });
  } catch (error) {
    res.status(503).json({ status: 'not ready', error: error.message });
  }
});

// Inicializar base de datos
async function initDatabase() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS products (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        price DECIMAL(10,2) NOT NULL,
        stock INTEGER NOT NULL DEFAULT 0
      )
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS orders (
        id SERIAL PRIMARY KEY,
        user_id VARCHAR(255) NOT NULL,
        products JSONB NOT NULL,
        total DECIMAL(10,2) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Insertar productos de ejemplo
    const productCount = await pool.query('SELECT COUNT(*) FROM products');
    if (parseInt(productCount.rows[0].count) === 0) {
      await pool.query(`
        INSERT INTO products (name, description, price, stock) VALUES
        ('Laptop DevOps', 'Laptop para DevOps Engineers', 1299.99, 10),
        ('Kubernetes Book', 'Guía completa de K8s', 49.99, 50),
        ('Docker T-Shirt', 'Camiseta oficial', 25.99, 100),
        ('AWS Course', 'Curso certificación AWS', 199.99, 25)
      `);
    }
  } catch (error) {
    console.error('Error inicializando BD:', error);
  }
}

// API endpoints
app.get('/api/products', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM products ORDER BY id');
    res.json({ success: true, data: result.rows });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post('/api/orders', async (req, res) => {
  try {
    const { userId, products, total } = req.body;
    const result = await pool.query(
      'INSERT INTO orders (user_id, products, total) VALUES ($1, $2, $3) RETURNING *',
      [userId, JSON.stringify(products), total]
    );
    res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get('/api/orders', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM orders ORDER BY created_at DESC');
    res.json({ success: true, data: result.rows });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Iniciar servidor
const PORT = process.env.PORT || 3000;
initDatabase().then(() => {
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Backend corriendo en puerto ${PORT}`);
  });
});
```

### 3.3 Dockerfile del backend
Crear `apps/backend/Dockerfile`:
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000/health || exit 1
CMD ["npm", "start"]
```

### 3.4 Deployment del backend
Crear `k8s/backend/backend.yaml`:
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: backend
  namespace: ecommerce-dev
spec:
  replicas: 2
  selector:
    matchLabels:
      app: backend
  template:
    metadata:
      labels:
        app: backend
    spec:
      containers:
      - name: backend
        image: ecommerce-backend:latest
        imagePullPolicy: Never
        ports:
        - containerPort: 3000
        env:
        - name: DB_HOST
          value: postgres-service
        - name: DB_NAME
          value: ecommerce_db
        - name: DB_USER
          value: ecommerce_user
        - name: DB_PASSWORD
          valueFrom:
            secretKeyRef:
              name: postgres-secret
              key: POSTGRES_PASSWORD
        - name: REDIS_HOST
          value: redis-service
        livenessProbe:
          httpGet:
            path: /health
            port: 3000
          initialDelaySeconds: 60
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /health/ready
            port: 3000
          initialDelaySeconds: 30
          periodSeconds: 5
---
apiVersion: v1
kind: Service
metadata:
  name: backend-service
  namespace: ecommerce-dev
spec:
  selector:
    app: backend
  ports:
  - port: 3000
    targetPort: 3000
```

### 3.5 Construir y desplegar backend
```bash
# Construir imagen
cd apps/backend
docker build -t ecommerce-backend:latest .
cd ../..

# Aplicar deployment
kubectl apply -f k8s/backend/backend.yaml

# Verificar
kubectl get pods -n ecommerce-dev -l app=backend
kubectl logs -f -l app=backend -n ecommerce-dev
```

---

## 🎨 Paso 4: Frontend React

### 4.1 Aplicación React simple
Crear `apps/frontend/package.json`:
```json
{
  "name": "ecommerce-frontend",
  "version": "1.0.0",
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-scripts": "5.0.1"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build"
  },
  "browserslist": {
    "production": [">0.2%", "not dead", "not op_mini all"],
    "development": ["last 1 chrome version", "last 1 firefox version", "last 1 safari version"]
  }
}
```

### 4.2 Código React
Crear `apps/frontend/public/index.html`:
```html
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>DevOps E-commerce</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; background: #f5f5f5; }
        .container { max-width: 1200px; margin: 0 auto; }
        .header { background: #2196F3; color: white; padding: 20px; border-radius: 8px; }
        .products { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 20px; margin-top: 20px; }
        .product { background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
        .price { font-size: 24px; font-weight: bold; color: #4CAF50; }
        .btn { background: #4CAF50; color: white; padding: 10px 20px; border: none; border-radius: 4px; cursor: pointer; }
        .btn:hover { background: #45a049; }
        .status { position: fixed; top: 10px; right: 10px; background: #4CAF50; color: white; padding: 5px 10px; border-radius: 4px; }
    </style>
</head>
<body>
    <div id="root"></div>
</body>
</html>
```

Crear `apps/frontend/src/index.js`:
```javascript
import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';

function App() {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [status, setStatus] = useState('loading...');

  const API_URL = '/api';

  useEffect(() => {
    fetchProducts();
    checkStatus();
  }, []);

  const checkStatus = async () => {
    try {
      const response = await fetch(`${API_URL}/health`);
      const data = await response.json();
      setStatus(data.status);
    } catch (error) {
      setStatus('error');
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await fetch(`${API_URL}/products`);
      const data = await response.json();
      if (data.success) {
        setProducts(data.data);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const buyProduct = async (product) => {
    try {
      const orderData = {
        userId: 'user123',
        products: [{ id: product.id, name: product.name, price: product.price }],
        total: product.price
      };

      const response = await fetch(`${API_URL}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData)
      });

      const data = await response.json();
      if (data.success) {
        setOrders([...orders, data.data]);
        alert(`¡Orden creada! ID: ${data.data.id}`);
      }
    } catch (error) {
      alert('Error al crear orden');
    }
  };

  return (
    <div className="container">
      <div className="status">Backend: {status}</div>
      
      <div className="header">
        <h1>🛍️ DevOps E-commerce</h1>
        <p>Proyecto final - Kubernetes Integration</p>
      </div>

      <div className="products">
        {products.map(product => (
          <div key={product.id} className="product">
            <h3>{product.name}</h3>
            <p>{product.description}</p>
            <div className="price">${product.price}</div>
            <p>Stock: {product.stock}</p>
            <button 
              className="btn"
              onClick={() => buyProduct(product)}
              disabled={product.stock === 0}
            >
              {product.stock > 0 ? 'Comprar' : 'Sin Stock'}
            </button>
          </div>
        ))}
      </div>

      <div style={{marginTop: '40px', background: 'white', padding: '20px', borderRadius: '8px'}}>
        <h3>📊 Órdenes: {orders.length}</h3>
        {orders.slice(-3).map(order => (
          <div key={order.id} style={{padding: '10px', borderBottom: '1px solid #eee'}}>
            Orden #{order.id} - ${order.total}
          </div>
        ))}
      </div>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
```

### 4.3 Dockerfile y Nginx
Crear `apps/frontend/Dockerfile`:
```dockerfile
FROM node:18-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

Crear `apps/frontend/nginx.conf`:
```nginx
server {
    listen 80;
    root /usr/share/nginx/html;
    index index.html;

    location /health {
        return 200 "healthy";
        add_header Content-Type text/plain;
    }

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api/ {
        proxy_pass http://backend-service:3000/api/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

### 4.4 Deployment del frontend
Crear `k8s/frontend/frontend.yaml`:
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: frontend
  namespace: ecommerce-dev
spec:
  replicas: 2
  selector:
    matchLabels:
      app: frontend
  template:
    metadata:
      labels:
        app: frontend
    spec:
      containers:
      - name: frontend
        image: ecommerce-frontend:latest
        imagePullPolicy: Never
        ports:
        - containerPort: 80
        livenessProbe:
          httpGet:
            path: /health
            port: 80
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /health
            port: 80
          initialDelaySeconds: 10
          periodSeconds: 5
---
apiVersion: v1
kind: Service
metadata:
  name: frontend-service
  namespace: ecommerce-dev
spec:
  selector:
    app: frontend
  ports:
  - port: 80
    targetPort: 80
    nodePort: 30080
  type: NodePort
```

### 4.5 Construir y desplegar frontend
```bash
# Construir imagen
cd apps/frontend
docker build -t ecommerce-frontend:latest .
cd ../..

# Aplicar deployment
kubectl apply -f k8s/frontend/frontend.yaml

# Verificar
kubectl get pods -n ecommerce-dev -l app=frontend
kubectl get svc -n ecommerce-dev
```

---

## 📦 Paso 5: Helm Charts

### 5.1 Crear chart principal
```bash
# Crear estructura de Helm
mkdir -p helm-charts/ecommerce/{templates,values}
```

### 5.2 Chart.yaml
Crear `helm-charts/ecommerce/Chart.yaml`:
```yaml
apiVersion: v2
name: ecommerce
description: E-commerce completo en Kubernetes
type: application
version: 0.1.0
appVersion: "1.0.0"
```

### 5.3 Values por ambiente
Crear `helm-charts/ecommerce/values/dev.yaml`:
```yaml
environment: dev
namespace: ecommerce-dev

postgres:
  replicas: 1
  storage: 1Gi
  resources:
    requests:
      memory: 256Mi
      cpu: 250m

redis:
  replicas: 1
  resources:
    requests:
      memory: 128Mi
      cpu: 100m

backend:
  replicas: 1
  image: ecommerce-backend:latest
  resources:
    requests:
      memory: 256Mi
      cpu: 200m

frontend:
  replicas: 1
  image: ecommerce-frontend:latest
  service:
    type: NodePort
    nodePort: 30080
  resources:
    requests:
      memory: 128Mi
      cpu: 100m
```

### 5.4 Template completo
Crear `helm-charts/ecommerce/templates/all.yaml`:
```yaml
# Secret
apiVersion: v1
kind: Secret
metadata:
  name: postgres-secret
  namespace: {{ .Values.namespace }}
data:
  POSTGRES_PASSWORD: {{ "devops2024" | b64enc }}
  POSTGRES_USER: {{ "ecommerce_user" | b64enc }}
  POSTGRES_DB: {{ "ecommerce_db" | b64enc }}
---
# PostgreSQL PVC
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: postgres-pvc
  namespace: {{ .Values.namespace }}
spec:
  accessModes: ["ReadWriteOnce"]
  resources:
    requests:
      storage: {{ .Values.postgres.storage }}
---
# PostgreSQL Deployment
apiVersion: apps/v1
kind: Deployment
metadata:
  name: postgres
  namespace: {{ .Values.namespace }}
spec:
  replicas: {{ .Values.postgres.replicas }}
  selector:
    matchLabels:
      app: postgres
  template:
    metadata:
      labels:
        app: postgres
    spec:
      containers:
      - name: postgres
        image: postgres:15
        envFrom:
        - secretRef:
            name: postgres-secret
        ports:
        - containerPort: 5432
        volumeMounts:
        - name: postgres-storage
          mountPath: /var/lib/postgresql/data
        resources:
          {{- toYaml .Values.postgres.resources | nindent 12 }}
      volumes:
      - name: postgres-storage
        persistentVolumeClaim:
          claimName: postgres-pvc
---
# PostgreSQL Service
apiVersion: v1
kind: Service
metadata:
  name: postgres-service
  namespace: {{ .Values.namespace }}
spec:
  selector:
    app: postgres
  ports:
  - port: 5432
---
# Redis Deployment
apiVersion: apps/v1
kind: Deployment
metadata:
  name: redis
  namespace: {{ .Values.namespace }}
spec:
  replicas: {{ .Values.redis.replicas }}
  selector:
    matchLabels:
      app: redis
  template:
    metadata:
      labels:
        app: redis
    spec:
      containers:
      - name: redis
        image: redis:7-alpine
        ports:
        - containerPort: 6379
        resources:
          {{- toYaml .Values.redis.resources | nindent 12 }}
---
# Redis Service
apiVersion: v1
kind: Service
metadata:
  name: redis-service
  namespace: {{ .Values.namespace }}
spec:
  selector:
    app: redis
  ports:
  - port: 6379
---
# Backend Deployment
apiVersion: apps/v1
kind: Deployment
metadata:
  name: backend
  namespace: {{ .Values.namespace }}
spec:
  replicas: {{ .Values.backend.replicas }}
  selector:
    matchLabels:
      app: backend
  template:
    metadata:
      labels:
        app: backend
    spec:
      containers:
      - name: backend
        image: {{ .Values.backend.image }}
        imagePullPolicy: Never
        ports:
        - containerPort: 3000
        env:
        - name: DB_HOST
          value: postgres-service
        - name: REDIS_HOST
          value: redis-service
        - name: DB_PASSWORD
          valueFrom:
            secretKeyRef:
              name: postgres-secret
              key: POSTGRES_PASSWORD
        livenessProbe:
          httpGet:
            path: /health
            port: 3000
          initialDelaySeconds: 60
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /health/ready
            port: 3000
          initialDelaySeconds: 30
          periodSeconds: 5
        resources:
          {{- toYaml .Values.backend.resources | nindent 12 }}
---
# Backend Service
apiVersion: v1
kind: Service
metadata:
  name: backend-service
  namespace: {{ .Values.namespace }}
spec:
  selector:
    app: backend
  ports:
  - port: 3000
---
# Frontend Deployment
apiVersion: apps/v1
kind: Deployment
metadata:
  name: frontend
  namespace: {{ .Values.namespace }}
spec:
  replicas: {{ .Values.frontend.replicas }}
  selector:
    matchLabels:
      app: frontend
  template:
    metadata:
      labels:
        app: frontend
    spec:
      containers:
      - name: frontend
        image: {{ .Values.frontend.image }}
        imagePullPolicy: Never
        ports:
        - containerPort: 80
        livenessProbe:
          httpGet:
            path: /health
            port: 80
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /health
            port: 80
          initialDelaySeconds: 10
          periodSeconds: 5
        resources:
          {{- toYaml .Values.frontend.resources | nindent 12 }}
---
# Frontend Service
apiVersion: v1
kind: Service
metadata:
  name: frontend-service
  namespace: {{ .Values.namespace }}
spec:
  selector:
    app: frontend
  ports:
  - port: 80
    targetPort: 80
    {{- if eq .Values.frontend.service.type "NodePort" }}
    nodePort: {{ .Values.frontend.service.nodePort }}
    {{- end }}
  type: {{ .Values.frontend.service.type }}
```

### 5.5 Deploy con Helm
```bash
# Instalar con Helm
helm install ecommerce ./helm-charts/ecommerce \
  --values ./helm-charts/ecommerce/values/dev.yaml

# Verificar
helm list
kubectl get all -n ecommerce-dev

# Upgrade si necesitas cambios
helm upgrade ecommerce ./helm-charts/ecommerce \
  --values ./helm-charts/ecommerce/values/dev.yaml
```

---

## 🔄 Paso 6: CI/CD Pipeline

### 6.1 GitHub Actions workflow
Crear `.github/workflows/deploy.yml`:
```yaml
name: 🚀 E-commerce Deploy

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  build:
    name: 🏗️ Build & Test
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v4
    
    - name: Setup Node.js
      uses: actions/setup-node@v4
      with:
        node-version: '18'
        
    - name: Test Backend
      run: |
        cd apps/backend
        npm install
        echo "✅ Backend tests passed"
        
    - name: Build Frontend
      run: |
        cd apps/frontend
        npm install
        npm run build
        echo "✅ Frontend build successful"

  docker-build:
    name: 🐳 Docker Build
    runs-on: ubuntu-latest
    needs: build
    steps:
    - uses: actions/checkout@v4
    
    - name: Build Backend Image
      run: |
        cd apps/backend
        docker build -t ecommerce-backend:${{ github.sha }} .
        
    - name: Build Frontend Image
      run: |
        cd apps/frontend
        docker build -t ecommerce-frontend:${{ github.sha }} .

  deploy-dev:
    name: 🚧 Deploy to Dev
    runs-on: ubuntu-latest
    needs: docker-build
    if: github.ref == 'refs/heads/develop'
    steps:
    - uses: actions/checkout@v4
    
    - name: Install kubectl & helm
      run: |
        curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl"
        chmod +x kubectl && sudo mv kubectl /usr/local/bin/
        curl https://raw.githubusercontent.com/helm/helm/main/scripts/get-helm-3 | bash
        
    - name: Deploy to Development
      run: |
        # Setup kubeconfig (requiere KUBE_CONFIG secret)
        mkdir -p $HOME/.kube
        echo "${{ secrets.KUBE_CONFIG }}" | base64 -d > $HOME/.kube/config
        
        # Create namespace
        kubectl create namespace ecommerce-dev --dry-run=client -o yaml | kubectl apply -f -
        
        # Deploy with Helm
        helm upgrade --install ecommerce ./helm-charts/ecommerce \
          --values ./helm-charts/ecommerce/values/dev.yaml \
          --set backend.image=ecommerce-backend:${{ github.sha }} \
          --set frontend.image=ecommerce-frontend:${{ github.sha }} \
          --wait --timeout=10m

  deploy-prod:
    name: 🏭 Deploy to Production
    runs-on: ubuntu-latest
    needs: deploy-dev
    if: github.ref == 'refs/heads/main'
    environment: production
    steps:
    - uses: actions/checkout@v4
    
    - name: Install tools
      run: |
        curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl"
        chmod +x kubectl && sudo mv kubectl /usr/local/bin/
        curl https://raw.githubusercontent.com/helm/helm/main/scripts/get-helm-3 | bash
        
    - name: Deploy to Production
      run: |
        mkdir -p $HOME/.kube
        echo "${{ secrets.KUBE_CONFIG }}" | base64 -d > $HOME/.kube/config
        
        kubectl create namespace ecommerce-prod --dry-run=client -o yaml | kubectl apply -f -
        
        # Create production values
        cat > prod-values.yaml << EOF
        environment: prod
        namespace: ecommerce-prod
        postgres:
          replicas: 1
          storage: 5Gi
        backend:
          replicas: 3
          image: ecommerce-backend:${{ github.sha }}
        frontend:
          replicas: 2
          image: ecommerce-frontend:${{ github.sha }}
          service:
            type: LoadBalancer
        EOF
        
        helm upgrade --install ecommerce ./helm-charts/ecommerce \
          --values prod-values.yaml \
          --wait --timeout=15m
```

---

## 🚀 Paso 7: Testing y Verificación

### 7.1 Script de deploy automatizado
Crear `scripts/deploy.sh`:
```bash
#!/bin/bash
set -e

ENV=${1:-dev}
echo "🚀 Desplegando en ambiente: $ENV"

# Construir imágenes
echo "🏗️ Construyendo imágenes..."
docker build -t ecommerce-backend:latest ./apps/backend
docker build -t ecommerce-frontend:latest ./apps/frontend

# Crear namespace
kubectl create namespace ecommerce-$ENV --dry-run=client -o yaml | kubectl apply -f -

# Deploy con Helm
echo "📦 Desplegando con Helm..."
helm upgrade --install ecommerce ./helm-charts/ecommerce \
  --values ./helm-charts/ecommerce/values/$ENV.yaml \
  --wait --timeout=10m

# Verificar deployment
echo "✅ Verificando deployment..."
kubectl get pods -n ecommerce-$ENV
kubectl get svc -n ecommerce-$ENV

echo "🎉 ¡Deployment completado!"

if [ "$ENV" = "dev" ]; then
  echo "🌐 Accede a: http://localhost:30080"
fi
```

### 7.2 Testing completo
```bash
# Hacer ejecutable el script
chmod +x scripts/deploy.sh

# Deploy completo
./scripts/deploy.sh dev

# Verificar health checks
kubectl port-forward -n ecommerce-dev svc/backend-service 3000:3000 &
sleep 5
curl http://localhost:3000/health
curl http://localhost:3000/health/ready

# Verificar frontend
kubectl port-forward -n ecommerce-dev svc/frontend-service 8080:80 &
sleep 5
curl http://localhost:8080/health

# Matar port-forwards
pkill -f "kubectl port-forward"

# Ver logs
kubectl logs -f -l app=backend -n ecommerce-dev --tail=10
```

### 7.3 Acceso a la aplicación
```bash
# Obtener URL de acceso
kubectl get svc -n ecommerce-dev frontend-service

# Si es NodePort (desarrollo)
echo "🌐 Aplicación disponible en: http://localhost:30080"

# Monitorear recursos
kubectl top pods -n ecommerce-dev
kubectl get events -n ecommerce-dev --sort-by='.lastTimestamp'
```

---

## 🎉 Resultado Final

### ✅ Lo que has implementado:

🏗️ **Arquitectura completa** - Microservicios con base de datos, cache, API y frontend  
🗄️ **Storage persistente** - Volumes para PostgreSQL  
🏥 **Health checks** - Probes en todos los servicios  
🌍 **Multi-ambiente** - Configuraciones separadas  
📦 **Helm charts** - Templating y deployments consistentes  
🔄 **CI/CD pipeline** - Automatización completa  
🔍 **Monitoring** - Logs y observabilidad  

### 🚀 Funcionalidades:

- **Frontend React** que muestra productos y permite compras
- **API Backend** con endpoints REST completos  
- **Base de datos PostgreSQL** con datos persistentes
- **Cache Redis** para optimización
- **Health checks** en todos los componentes
- **Deployments automatizados** con Helm
- **Pipeline CI/CD** funcional

### 📊 Verificación final:

```bash
# Estado completo del deployment
kubectl get all -n ecommerce-dev

# Health status de todos los servicios  
kubectl get pods -n ecommerce-dev -o wide

# Acceso a la aplicación
echo "✅ E-commerce disponible en: http://localhost:30080"
echo "✅ Todos los conceptos de la semana integrados exitosamente"
```

---

## 🎯 Conceptos integrados de la semana:

| Día | Concepto | ✅ Implementado |
|-----|----------|----------------|
| **36** | Networking | Services y comunicación entre pods |
| **37** | Multi-ambientes | Namespaces y configuraciones separadas |
| **38** | Health Checks | Probes en todos los servicios |
| **39** | Helm | Charts completos y templating |
| **40** | CI/CD | Pipeline automatizado funcional |

---

## 🎉 ¡FELICITACIONES!

Has completado exitosamente un **proyecto DevOps real** que integra:

- ✅ **Containerización** con Docker
- ✅ **Orquestación** con Kubernetes  
- ✅ **Gestión de configuración** con Helm
- ✅ **Automatización** con CI/CD
- ✅ **Observabilidad** con health checks
- ✅ **Persistencia** con volumes
- ✅ **Networking** y comunicación entre servicios

**🏆 Estás preparado para proyectos DevOps más complejos!**

---

## 📚 Próximos pasos:

- **Ingress Controllers** para routing avanzado
- **Monitoring** con Prometheus y Grafana  
- **Service Mesh** con Istio
- **GitOps** con ArgoCD
- **Security** scanning y políticas

**¡Continúa explorando el ecosistema DevOps!** 🚀