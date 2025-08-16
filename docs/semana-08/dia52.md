---
title: Día 52 - Monitorear Tu Primera Aplicación con Métricas Custom
description: De monitorear tu sistema a monitorear TU código en tiempo real
sidebar_position: 3
---

## 🎯 Monitorear TU Aplicación, No Solo el Sistema

![](../../static/images/banner/8.png)

> "Ayer viste métricas de tu computadora. Hoy vas a ver métricas de **TU código ejecutándose** en tiempo real. ¡Es otra cosa completamente! 🚀"

### 🎯 **Meta del día:**
- ✅ App simple funcionando con métricas custom
- ✅ Ver requests, errores y tiempo de respuesta en Grafana
- ✅ "Romper" la app y ver cómo las métricas lo detectan
- ✅ Entender: instrumentación de aplicaciones

---

## 🤔 **Recordatorio: ¿Por qué esto es importante?**

**Ayer:** "Mi servidor está usando 50% CPU"
**Hoy:** "Mi endpoint `/login` tuvo 20 errores en los últimos 5 minutos"

**La diferencia es ENORME:**
- ✅ Métricas del sistema = Infraestructura
- 🎯 Métricas de aplicación = **Tu código, tu lógica de negocio**

---

## 🏗️ **Paso 1: Crear Tu Primera App Instrumentada**

Vamos a crear una API súper simple pero con observabilidad profesional.

### **Estructura del proyecto:**
```
mi-app-observada/
├── docker-compose.yml          # Stack completo
├── prometheus.yml              # Config de Prometheus  
├── app/
│   ├── Dockerfile
│   ├── requirements.txt        # (Python)
│   ├── package.json           # (Node.js - opcional)
│   └── app.py                 # Nuestra app
└── grafana/
    └── dashboards/
        └── app-dashboard.json
```

### **Opción 1: Python Flask** 🐍

`app/requirements.txt`:
```txt
flask==2.3.3
prometheus-client==0.17.1
requests==2.31.0
```

`app/app.py`:
```python
from flask import Flask, jsonify, request
from prometheus_client import Counter, Histogram, Gauge, generate_latest
import time
import random
import threading

app = Flask(__name__)

# 📊 MÉTRICAS CUSTOM
# Counter: Solo sube (requests totales)
requests_total = Counter('app_requests_total', 'Total requests', ['method', 'endpoint', 'status'])

# Histogram: Distribución de tiempos
request_duration = Histogram('app_request_duration_seconds', 'Request duration', ['endpoint'])

# Gauge: Valor que sube y baja (usuarios activos)
active_users = Gauge('app_active_users', 'Currently active users')

# Counter para errores
errors_total = Counter('app_errors_total', 'Total errors', ['endpoint', 'error_type'])

# Simulamos usuarios activos que cambian
def simulate_users():
    while True:
        active_users.set(random.randint(10, 100))
        time.sleep(10)

# Iniciamos simulación en background
threading.Thread(target=simulate_users, daemon=True).start()

@app.route('/metrics')
def metrics():
    """Endpoint que Prometheus va a consultar"""
    return generate_latest()

@app.route('/')
def home():
    start_time = time.time()
    
    # Incrementar counter
    requests_total.labels(method='GET', endpoint='/', status='200').inc()
    
    # Simular tiempo de procesamiento
    time.sleep(random.uniform(0.1, 0.5))
    
    # Registrar duración
    request_duration.labels(endpoint='/').observe(time.time() - start_time)
    
    return jsonify({
        "message": "¡Hola! Tu app está siendo observada 👀",
        "timestamp": time.time(),
        "status": "healthy"
    })

@app.route('/api/users')
def get_users():
    start_time = time.time()
    
    # Simular que a veces este endpoint falla
    if random.random() < 0.1:  # 10% de probabilidad de error
        errors_total.labels(endpoint='/api/users', error_type='database_timeout').inc()
        requests_total.labels(method='GET', endpoint='/api/users', status='500').inc()
        request_duration.labels(endpoint='/api/users').observe(time.time() - start_time)
        return jsonify({"error": "Database timeout"}), 500
    
    # Simular procesamiento
    time.sleep(random.uniform(0.2, 1.0))
    
    requests_total.labels(method='GET', endpoint='/api/users', status='200').inc()
    request_duration.labels(endpoint='/api/users').observe(time.time() - start_time)
    
    return jsonify({
        "users": [
            {"id": 1, "name": "Juan", "active": True},
            {"id": 2, "name": "María", "active": False},
            {"id": 3, "name": "Carlos", "active": True}
        ],
        "total": 3
    })

@app.route('/api/login', methods=['POST'])
def login():
    start_time = time.time()
    
    # Simular validación que a veces falla
    if random.random() < 0.15:  # 15% de logins fallan
        errors_total.labels(endpoint='/api/login', error_type='invalid_credentials').inc()
        requests_total.labels(method='POST', endpoint='/api/login', status='401').inc()
        request_duration.labels(endpoint='/api/login').observe(time.time() - start_time)
        return jsonify({"error": "Invalid credentials"}), 401
    
    time.sleep(random.uniform(0.1, 0.3))
    
    requests_total.labels(method='POST', endpoint='/api/login', status='200').inc()
    request_duration.labels(endpoint='/api/login').observe(time.time() - start_time)
    
    return jsonify({"token": "abc123", "user": "demo_user"})

@app.route('/health')
def health():
    """Health check simple"""
    requests_total.labels(method='GET', endpoint='/health', status='200').inc()
    return jsonify({"status": "UP", "timestamp": time.time()})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
```

`app/Dockerfile`:
```dockerfile
FROM python:3.11-slim

WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt

COPY app.py .

EXPOSE 5000
CMD ["python", "app.py"]
```

---

## 🐳 **Paso 2: Stack Completo con Docker Compose**

`docker-compose.yml`:
```yaml
version: '3.8'

services:
  # Tu aplicación con métricas
  app:
    build: ./app
    container_name: mi-app
    ports:
      - "5000:5000"
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:5000/health"]
      interval: 30s
      timeout: 10s
      retries: 3

  # Métricas del sistema (del día anterior)
  node-exporter:
    image: prom/node-exporter:latest
    container_name: node-exporter
    ports:
      - "9100:9100"
    volumes:
      - '/:/host:ro,rslave'
    command:
      - '--path.rootfs=/host'
    restart: unless-stopped

  # Prometheus actualizado para monitorear la app
  prometheus:
    image: prom/prometheus:latest
    container_name: prometheus
    ports:
      - "9090:9090"
    volumes:
      - ./prometheus.yml:/etc/prometheus/prometheus.yml
    restart: unless-stopped

  # Grafana con dashboards pre-configurados
  grafana:
    image: grafana/grafana:latest
    container_name: grafana
    ports:
      - "3000:3000"
    environment:
      - GF_SECURITY_ADMIN_PASSWORD=admin123
    volumes:
      - grafana-storage:/var/lib/grafana
      - ./grafana/dashboards:/var/lib/grafana/dashboards
    restart: unless-stopped

volumes:
  grafana-storage:
```

`prometheus.yml`:
```yaml
global:
  scrape_interval: 5s  # Más frecuente para ver cambios rápido
  evaluation_interval: 5s

scrape_configs:
  # Sistema (como ayer)
  - job_name: 'node-exporter'
    static_configs:
      - targets: ['node-exporter:9100']

  # Prometheus se monitorea a sí mismo
  - job_name: 'prometheus'
    static_configs:
      - targets: ['localhost:9090']

  # ¡TU APP! 🎯
  - job_name: 'mi-app'
    static_configs:
      - targets: ['app:5000']
    metrics_path: '/metrics'
    scrape_interval: 2s  # Muy frecuente para demos
```

---

## 🚀 **Paso 3: ¡Arrancar y Probar!**

```bash
# Construir y levantar todo
docker-compose up --build -d

# Verificar que todo esté corriendo
docker ps

# Verificar que la app responde
curl http://localhost:5000/
curl http://localhost:5000/api/users
curl -X POST http://localhost:5000/api/login

# Ver métricas crudas de tu app
curl http://localhost:5000/metrics
```

**Deberías ver algo como:**
```
# HELP app_requests_total Total requests
# TYPE app_requests_total counter
app_requests_total{endpoint="/",method="GET",status="200"} 5.0
app_requests_total{endpoint="/api/users",method="GET",status="200"} 3.0
app_requests_total{endpoint="/api/users",method="GET",status="500"} 1.0

# HELP app_request_duration_seconds Request duration
# TYPE app_request_duration_seconds histogram
app_request_duration_seconds_bucket{endpoint="/",le="0.1"} 2.0
app_request_duration_seconds_bucket{endpoint="/",le="0.25"} 4.0
...
```

---

## 📊 **Paso 4: Dashboard de Aplicación en Grafana**

### **1. Verificar Data Source:**
- Ve a Grafana: `http://localhost:3000`
- **Configuration → Data Sources**
- Verificar que Prometheus esté conectado

### **2. Crear Dashboard de Aplicación:**

**Panel 1: Request Rate (RPS - Requests Per Second)**
```promql
rate(app_requests_total[1m])
```
- **Title**: "Request Rate (req/sec)"
- **Type**: Time series
- **Legend**: `{{endpoint}} - {{status}}`

**Panel 2: Error Rate**
```promql
rate(app_requests_total{status!="200"}[1m]) / rate(app_requests_total[1m]) * 100
```
- **Title**: "Error Rate (%)"
- **Type**: Time series
- **Unit**: Percent (0-100)

**Panel 3: Response Time (P95)**
```promql
histogram_quantile(0.95, rate(app_request_duration_seconds_bucket[1m]))
```
- **Title**: "Response Time P95"
- **Type**: Time series
- **Unit**: Seconds

**Panel 4: Active Users**
```promql
app_active_users
```
- **Title**: "Active Users"
- **Type**: Stat
- **Color**: Green

**Panel 5: Total Requests (por endpoint)**
```promql
increase(app_requests_total[5m])
```
- **Title**: "Requests Last 5min"
- **Type**: Bar gauge
- **Legend**: `{{endpoint}}`

**Panel 6: Errors by Type**
```promql
rate(app_errors_total[1m])
```
- **Title**: "Errors by Type"
- **Type**: Time series
- **Legend**: `{{endpoint}} - {{error_type}}`

---

## 🧪 **Paso 5: Load Testing - ¡Hacer que los Gráficos Exploten!**

### **Script de Load Testing Simple:**

`load_test.sh`:
```bash
#!/bin/bash
echo "🚀 Iniciando load test..."

# Función para hacer requests en paralelo
make_requests() {
    for i in {1..50}; do
        curl -s http://localhost:5000/ > /dev/null &
        curl -s http://localhost:5000/api/users > /dev/null &
        curl -s -X POST http://localhost:5000/api/login > /dev/null &
    done
    wait
}

# Ejecutar por 2 minutos
echo "📈 Generando tráfico por 2 minutos..."
for round in {1..24}; do  # 24 rounds * 5 seconds = 2 minutos
    echo "Round $round/24"
    make_requests
    sleep 5
done

echo "✅ Load test completado!"
```

```bash
chmod +x load_test.sh
./load_test.sh
```

### **O usar herramientas más pro:**

```bash
# Con Apache Bench (si lo tenés instalado)
ab -n 1000 -c 10 http://localhost:5000/

# Con curl en loop simple
for i in {1..100}; do
  curl -s http://localhost:5000/api/users > /dev/null &
done
```

**¡Mirá los dashboards mientras corren los tests!** 📊⚡

---

## 🔥 **Paso 6: Simular Problemas (Chaos Testing)**

### **Problema 1: App Sobrecargada**
```bash
# Stress test que genera muchos errores
for i in {1..200}; do
  curl -s http://localhost:5000/api/users > /dev/null &
  curl -s -X POST http://localhost:5000/api/login > /dev/null &
done
```

**Observar en Grafana:**
- Error rate sube
- Response time aumenta
- Request rate explota

### **Problema 2: App Caída**
```bash
# "Romper" la app
docker stop mi-app

# Esperar 1 minuto, ver métricas en Grafana
# Después "arreglar":
docker start mi-app
```

**Observar en Grafana:**
- Todas las métricas van a 0
- Gaps en los gráficos
- Recovery cuando vuelve

### **Problema 3: Base de Datos Lenta**
```bash
# Hacer muchos requests al endpoint que simula timeouts
for i in {1..50}; do
  curl -s http://localhost:5000/api/users > /dev/null &
done
```

**Observar:**
- Error rate del endpoint `/api/users` sube
- Response time aumenta para ese endpoint específico

---

## 🎯 **Las Métricas Que Realmente Importan (SRE Level)**

### **The Golden Signals:**

1. **Latency** (Response Time)
   ```promql
   histogram_quantile(0.95, rate(app_request_duration_seconds_bucket[5m]))
   ```

2. **Traffic** (Request Rate)
   ```promql
   rate(app_requests_total[1m])
   ```

3. **Errors** (Error Rate)
   ```promql
   rate(app_requests_total{status!="200"}[1m]) / rate(app_requests_total[1m])
   ```

4. **Saturation** (Resource Usage)
   ```promql
   app_active_users / 1000  # o el límite que tengas
   ```

### **RED Method:**
- **Rate**: Requests per second
- **Errors**: Error rate
- **Duration**: Response time

---

## 🔍 **Paso 7: Explorar Prometheus Queries**

Ve a `http://localhost:9090` y probá estas queries:

### **Queries Útiles:**
```promql
# Ver todas las métricas de tu app
{__name__=~"app_.*"}

# Top endpoints por tráfico
topk(5, rate(app_requests_total[5m]))

# Requests que tardan más de 500ms
app_request_duration_seconds_bucket{le="0.5"}

# Error rate por endpoint
rate(app_requests_total{status!="200"}[5m]) by (endpoint)

# P99 response time
histogram_quantile(0.99, rate(app_request_duration_seconds_bucket[5m]) by (le, endpoint))
```

---

## 🛠️ **Troubleshooting Común**

### **❌ "No veo métricas de mi app"**
```bash
# 1. Verificar que la app esté expone métricas
curl http://localhost:5000/metrics

# 2. Verificar Prometheus targets
# http://localhost:9090/targets
# Mi-app debe estar UP (verde)

# 3. Ver logs de Prometheus
docker logs prometheus
```

### **❌ "Los gráficos no cambian"**
- Refresh rate muy alto (poné 5s)
- Time range muy grande (poné Last 5 minutes)
- No hay tráfico en la app (hacer requests)

### **❌ "Errors 500 en la app"**
Es normal! La app simula errores para que veas cómo se ven en las métricas.

---

## 📚 **Conceptos Clave que Aprendiste**

### **1. Instrumentación:**
- Agregar métricas a TU código
- Counter, Gauge, Histogram
- Endpoint `/metrics` para Prometheus

### **2. Application Metrics vs System Metrics:**
- System: CPU, RAM, Disk
- Application: Requests, Errors, Business Logic

### **3. Labels y Dimensiones:**
- `endpoint`, `status`, `method`
- Permiten filtrar y agrupar
- Base de queries poderosas

### **4. Golden Signals:**
- Latency, Traffic, Errors, Saturation
- Métricas que todo SRE monitorea

---

## 🧠 **Revisión del Día**

| Concepto | ¿Lo lograste? | Notas |
|----------|---------------|-------|
| App con métricas custom funcionando | ✔️ / ❌ | |
| Ver requests en tiempo real en Grafana | ✔️ / ❌ | |
| Generar load test y ver gráficos cambiar | ✔️ / ❌ | |
| Simular errores y verlos en métricas | ✔️ / ❌ | |
| Entender diferencia app vs system metrics | ✔️ / ❌ | |

---

## 🎯 **Mini Challenges**

### **Challenge 1: Custom Business Metric**
Agregá una métrica que cuente cuántas veces se accede a cada usuario:
```python
user_access_counter = Counter('app_user_access_total', 'User access count', ['user_id'])
```

### **Challenge 2: Performance Alert**
Creá una query que detecte cuando el P95 response time > 1 segundo:
```promql
histogram_quantile(0.95, rate(app_request_duration_seconds_bucket[5m])) > 1
```

### **Challenge 3: Business Dashboard**
Creá un panel que muestre métricas de negocio:
- Logins exitosos vs fallidos
- Usuarios más activos
- Endpoints más usados

---

## 💡 **Pro Tips del Día**

### **🎯 Instrumentación:**
- **No instrumentar todo** - solo lo que importa
- **Usar labels inteligentemente** - no crear demasiadas combinaciones
- **Pensar en tu audiencia** - ¿desarrolladores o business?

### **📊 Dashboards:**
- **Un dashboard por audiencia** (technical vs executive)
- **Colores consistentes** (rojo = malo, verde = bueno)
- **Time ranges apropiados** (5min para debugging, 24h para trends)

### **⚡ Performance:**
- **No hacer scraping muy frecuente** en producción (30s es normal)
- **Cuidado con labels de alta cardinalidad** (ej: user_id)
- **Usar histogramas para latency** (no averages simples)

---

## 🚀 **¿Qué Sigue Mañana?**

**Día 53: Observabilidad en Kubernetes**
- Mismo concepto pero en K8s
- Prometheus Operator
- Service discovery automático
- Dashboards de cluster + aplicaciones

### **Para mañana mantené corriendo:**
```bash
# Este stack lo vamos a migrar a Kubernetes
docker-compose down
# Pero guardá los archivos - los vamos a adaptar
```

---

## 🎉 **¡Increíble Progreso!**

Hoy diste un salto **ENORME**:

✅ **De monitorear sistema a monitorear TU código**
✅ **Instrumentaste una aplicación real**  
✅ **Viste métricas de negocio en tiempo real**
✅ **Simulaste problemas y su detección**
✅ **Aprendiste las Golden Signals (SRE nivel)**

**Lo que hiciste hoy es exactamente lo que hacen Netflix, Uber, Spotify.** 

### **Skill Level Up:** De "sé usar Grafana" a **"sé instrumentar aplicaciones"** 📈

Eso te pone en el **top 10%** de developers que realmente entienden observabilidad.

📸 **Compartí tus dashboards con métricas custom #DevOpsConRoxs - Día 52**

¡Mañana lo llevamos a Kubernetes! ☸️🚀