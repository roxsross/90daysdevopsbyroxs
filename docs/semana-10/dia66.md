---
sidebar_position: 66
---

# Día 66 - Alertas Simples y Dashboard Básico

## 🎯 Objetivo del Día
Crear alertas simples que realmente funcionen y un dashboard fácil de leer

---

## 📋 Plan Simple del Día

| ⏰ Tiempo | 📋 Tarea | 🎯 Meta |
|----------|-----------|---------|
| **30 min** | 🚨 Alertas básicas con Slack | Notificaciones que lleguen |
| **40 min** | 📊 Dashboard simple en Grafana | Gráficos fáciles de leer |
| **35 min** | 📧 Email automático de reportes | Resumen diario automático |
| **30 min** | 🧪 Probar todo el sistema | Validar que funcione |
| **15 min** | 📝 Documentar configuración | Guía para el equipo |

---

## 🚨 Paso 1: Alertas Básicas con Slack (30 min)

### 1.1 Configurar webhook de Slack
```bash
# 📱 Crear webhook en Slack (ir a api.slack.com/apps)
# Copiar la URL del webhook
SLACK_WEBHOOK="https://hooks.slack.com/services/T00000000/B00000000/XXXXXXXXXXXXXXXXXXXXXXXX"
```

### 1.2 Script de alerta simple
Crear `scripts/simple-alerts.py`:
```python
#!/usr/bin/env python3
# 🚨 Sistema de alertas súper simple que funciona

import requests
import psutil
import time
import json
from datetime import datetime

# Configuración
SLACK_WEBHOOK = "https://hooks.slack.com/services/TU-WEBHOOK-AQUI"

def send_slack_alert(message, emoji="🚨", channel="#devops-alerts"):
    """Enviar mensaje a Slack"""
    payload = {
        "text": f"{emoji} {message}",
        "channel": channel,
        "username": "DevOps Bot",
        "icon_emoji": ":robot_face:"
    }
    
    try:
        response = requests.post(SLACK_WEBHOOK, json=payload)
        if response.status_code == 200:
            print(f"✅ Alerta enviada: {message}")
        else:
            print(f"❌ Error enviando alerta: {response.status_code}")
    except Exception as e:
        print(f"❌ Error: {e}")

def check_system_health():
    """Revisar salud del sistema - súper simple"""
    alerts = []
    
    # 1. CPU muy alta
    cpu_percent = psutil.cpu_percent(interval=1)
    if cpu_percent > 80:
        alerts.append(f"CPU alta: {cpu_percent}%")
    
    # 2. Memoria muy alta
    memory = psutil.virtual_memory()
    if memory.percent > 85:
        alerts.append(f"Memoria alta: {memory.percent}%")
    
    # 3. Disco muy lleno
    disk = psutil.disk_usage('/')
    disk_percent = (disk.used / disk.total) * 100
    if disk_percent > 90:
        alerts.append(f"Disco lleno: {disk_percent:.1f}%")
    
    # 4. Muchos procesos
    if len(psutil.pids()) > 300:
        alerts.append(f"Muchos procesos: {len(psutil.pids())}")
    
    return alerts

def check_application_health():
    """Revisar apps - súper básico"""
    alerts = []
    
    # Verificar si la web responde
    try:
        response = requests.get("http://localhost:80", timeout=5)
        if response.status_code != 200:
            alerts.append(f"Web no responde: HTTP {response.status_code}")
    except requests.exceptions.RequestException:
        alerts.append("Web no disponible - No responde")
    
    # Verificar base de datos (ejemplo con ping a puerto)
    import socket
    try:
        sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        sock.settimeout(3)
        result = sock.connect_ex(('localhost', 5432))  # PostgreSQL
        if result != 0:
            alerts.append("Base de datos no responde")
        sock.close()
    except:
        alerts.append("Error verificando BD")
    
    return alerts

def main():
    print(f"🔍 Verificando sistema - {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    
    # Revisar sistema
    system_alerts = check_system_health()
    app_alerts = check_application_health()
    
    all_alerts = system_alerts + app_alerts
    
    if all_alerts:
        message = f"PROBLEMAS DETECTADOS:\n" + "\n".join([f"• {alert}" for alert in all_alerts])
        send_slack_alert(message, "🚨")
    else:
        print("✅ Todo bien!")
        # Enviar mensaje cada hora si todo está bien
        current_minute = datetime.now().minute
        if current_minute == 0:  # Solo a las horas en punto
            send_slack_alert("Sistema funcionando normal ✅", "💚")

if __name__ == "__main__":
    main()
```

### 1.3 Ejecutar alertas cada 5 minutos
```bash
# Hacer script ejecutable
chmod +x scripts/simple-alerts.py

# Agregar a crontab
echo "*/5 * * * * cd /tu/directorio && python3 scripts/simple-alerts.py" | crontab -

# Ver crontab
crontab -l
```

### 1.4 Probar alerta manual
```python
# Script de prueba rápida
import requests

webhook = "TU-WEBHOOK-AQUI"
mensaje = {
    "text": "🧪 Prueba de alerta desde DevOps Challenge!",
    "channel": "#devops-alerts"
}

response = requests.post(webhook, json=mensaje)
print(f"Estado: {response.status_code}")
```

---

## 📊 Paso 2: Dashboard Simple en Grafana (40 min)

### 2.1 Instalar Grafana con Docker
```bash
# 📈 Grafana súper simple con Docker
mkdir -p grafana-simple
cd grafana-simple

cat > docker-compose.yml << 'EOF'
version: '3.8'
services:
  grafana:
    image: grafana/grafana:latest
    ports:
      - "3000:3000"
    environment:
      - GF_SECURITY_ADMIN_PASSWORD=admin123
    volumes:
      - grafana-data:/var/lib/grafana
      - ./dashboards:/etc/grafana/provisioning/dashboards
      - ./datasources:/etc/grafana/provisioning/datasources
    restart: unless-stopped

  prometheus:
    image: prom/prometheus:latest
    ports:
      - "9090:9090"
    volumes:
      - ./prometheus.yml:/etc/prometheus/prometheus.yml
    command:
      - '--config.file=/etc/prometheus/prometheus.yml'
      - '--storage.tsdb.path=/prometheus'
      - '--web.console.libraries=/etc/prometheus/console_libraries'
      - '--web.console.templates=/etc/prometheus/consoles'
      - '--web.enable-lifecycle'
    restart: unless-stopped

  node-exporter:
    image: prom/node-exporter:latest
    ports:
      - "9100:9100"
    restart: unless-stopped

volumes:
  grafana-data:
EOF

# Iniciar todo
docker-compose up -d
```

### 2.2 Configuración básica de Prometheus
```yaml
# prometheus.yml - Configuración súper simple
global:
  scrape_interval: 15s

scrape_configs:
  - job_name: 'prometheus'
    static_configs:
      - targets: ['localhost:9090']

  - job_name: 'node'
    static_configs:
      - targets: ['node-exporter:9100']
  
  - job_name: 'mi-aplicacion'
    static_configs:
      - targets: ['host.docker.internal:8080']  # Si tienes app en puerto 8080
    scrape_interval: 30s
    metrics_path: '/metrics'
```

### 2.3 Datasource automático para Grafana
```yaml
# datasources/prometheus.yml
apiVersion: 1
datasources:
  - name: Prometheus
    type: prometheus
    access: proxy
    url: http://prometheus:9090
    isDefault: true
```

### 2.4 Dashboard simple
```json
# dashboards/simple-dashboard.json
{
  "dashboard": {
    "id": null,
    "title": "🚀 DevOps Challenge - Sistema Simple",
    "description": "Dashboard fácil de leer para monitorear todo",
    "tags": ["devops", "simple"],
    "timezone": "browser",
    "panels": [
      {
        "id": 1,
        "title": "💻 CPU Usage",
        "type": "stat",
        "gridPos": {"h": 8, "w": 6, "x": 0, "y": 0},
        "targets": [
          {
            "expr": "100 - (avg by (instance) (irate(node_cpu_seconds_total{mode=\"idle\"}[5m])) * 100)",
            "legendFormat": "CPU %"
          }
        ],
        "fieldConfig": {
          "defaults": {
            "color": {"mode": "thresholds"},
            "thresholds": {
              "steps": [
                {"color": "green", "value": null},
                {"color": "yellow", "value": 70},
                {"color": "red", "value": 85}
              ]
            },
            "unit": "percent"
          }
        }
      },
      {
        "id": 2,
        "title": "🧠 Memory Usage",
        "type": "stat",
        "gridPos": {"h": 8, "w": 6, "x": 6, "y": 0},
        "targets": [
          {
            "expr": "(1 - (node_memory_MemAvailable_bytes / node_memory_MemTotal_bytes)) * 100",
            "legendFormat": "Memory %"
          }
        ],
        "fieldConfig": {
          "defaults": {
            "color": {"mode": "thresholds"},
            "thresholds": {
              "steps": [
                {"color": "green", "value": null},
                {"color": "yellow", "value": 75},
                {"color": "red", "value": 90}
              ]
            },
            "unit": "percent"
          }
        }
      },
      {
        "id": 3,
        "title": "💾 Disk Usage",
        "type": "stat",
        "gridPos": {"h": 8, "w": 6, "x": 12, "y": 0},
        "targets": [
          {
            "expr": "(1 - (node_filesystem_avail_bytes{fstype!=\"tmpfs\"} / node_filesystem_size_bytes{fstype!=\"tmpfs\"})) * 100",
            "legendFormat": "Disk %"
          }
        ],
        "fieldConfig": {
          "defaults": {
            "color": {"mode": "thresholds"},
            "thresholds": {
              "steps": [
                {"color": "green", "value": null},
                {"color": "yellow", "value": 80},
                {"color": "red", "value": 95}
              ]
            },
            "unit": "percent"
          }
        }
      },
      {
        "id": 4,
        "title": "🌐 Sistema Activo",
        "type": "stat",
        "gridPos": {"h": 8, "w": 6, "x": 18, "y": 0},
        "targets": [
          {
            "expr": "up",
            "legendFormat": "Sistema"
          }
        ],
        "fieldConfig": {
          "defaults": {
            "color": {"mode": "thresholds"},
            "thresholds": {
              "steps": [
                {"color": "red", "value": null},
                {"color": "green", "value": 1}
              ]
            },
            "mappings": [
              {"options": {"0": {"text": "❌ DOWN"}}, "type": "value"},
              {"options": {"1": {"text": "✅ UP"}}, "type": "value"}
            ]
          }
        }
      }
    ],
    "time": {"from": "now-1h", "to": "now"},
    "refresh": "5s"
  }
}
```

### 2.5 Configurar dashboard automático
```yaml
# dashboards/dashboard-provider.yml
apiVersion: 1
providers:
  - name: 'default'
    type: file
    updateIntervalSeconds: 30
    options:
      path: /etc/grafana/provisioning/dashboards
```

---

## 📧 Paso 3: Email Automático de Reportes (35 min)

### 3.1 Script de reporte diario
```python
# scripts/daily-report.py - Reporte súper simple por email
import smtplib
import psutil
import requests
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from datetime import datetime, timedelta
import json

# Configuración de email
SMTP_SERVER = "smtp.gmail.com"
SMTP_PORT = 587
EMAIL_USER = "tu-email@gmail.com"
EMAIL_PASS = "tu-app-password"  # App password de Gmail
TO_EMAILS = ["team@empresa.com", "manager@empresa.com"]

def get_system_stats():
    """Obtener estadísticas básicas del sistema"""
    return {
        "cpu_percent": psutil.cpu_percent(interval=1),
        "memory_percent": psutil.virtual_memory().percent,
        "disk_percent": round((psutil.disk_usage('/').used / psutil.disk_usage('/').total) * 100, 1),
        "load_avg": psutil.getloadavg()[0] if hasattr(psutil, 'getloadavg') else 0,
        "uptime": datetime.now() - datetime.fromtimestamp(psutil.boot_time())
    }

def check_services():
    """Verificar servicios básicos"""
    services = {}
    
    # Web server
    try:
        response = requests.get("http://localhost:80", timeout=5)
        services["web"] = "✅ OK" if response.status_code == 200 else f"❌ HTTP {response.status_code}"
    except:
        services["web"] = "❌ DOWN"
    
    # Database (ejemplo)
    try:
        import socket
        sock = socket.create_connection(('localhost', 5432), timeout=3)
        sock.close()
        services["database"] = "✅ OK"
    except:
        services["database"] = "❌ DOWN"
    
    return services

def generate_html_report():
    """Generar reporte HTML bonito"""
    stats = get_system_stats()
    services = check_services()
    now = datetime.now()
    
    html = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <style>
            body {{ font-family: Arial, sans-serif; margin: 20px; background: #f5f5f5; }}
            .container {{ max-width: 600px; margin: 0 auto; background: white; padding: 20px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }}
            .header {{ background: #4CAF50; color: white; padding: 20px; text-align: center; border-radius: 10px; margin: -20px -20px 20px -20px; }}
            .metric {{ display: inline-block; margin: 10px; padding: 15px; border-radius: 8px; min-width: 120px; text-align: center; }}
            .metric.good {{ background: #e8f5e8; border-left: 4px solid #4CAF50; }}
            .metric.warning {{ background: #fff3e0; border-left: 4px solid #ff9800; }}
            .metric.critical {{ background: #ffebee; border-left: 4px solid #f44336; }}
            .services {{ margin-top: 20px; }}
            .service {{ padding: 10px; margin: 5px 0; border-radius: 5px; background: #f9f9f9; }}
            .footer {{ margin-top: 20px; text-align: center; color: #666; font-size: 12px; }}
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h2>🚀 Reporte Diario DevOps</h2>
                <p>{now.strftime('%d de %B, %Y - %H:%M')}</p>
            </div>
            
            <h3>📊 Métricas del Sistema</h3>
            <div class="metric {'good' if stats['cpu_percent'] < 70 else 'warning' if stats['cpu_percent'] < 85 else 'critical'}">
                <strong>💻 CPU</strong><br>
                {stats['cpu_percent']:.1f}%
            </div>
            
            <div class="metric {'good' if stats['memory_percent'] < 75 else 'warning' if stats['memory_percent'] < 90 else 'critical'}">
                <strong>🧠 Memoria</strong><br>
                {stats['memory_percent']:.1f}%
            </div>
            
            <div class="metric {'good' if stats['disk_percent'] < 80 else 'warning' if stats['disk_percent'] < 95 else 'critical'}">
                <strong>💾 Disco</strong><br>
                {stats['disk_percent']}%
            </div>
            
            <div class="services">
                <h3>🔧 Estado de Servicios</h3>
    """
    
    for service, status in services.items():
        html += f'<div class="service">{service.title()}: {status}</div>'
    
    html += f"""
            </div>
            
            <div class="footer">
                <p>⏰ Sistema activo por: {str(stats['uptime']).split('.')[0]}</p>
                <p>Reporte generado automáticamente por DevOps Challenge Bot</p>
            </div>
        </div>
    </body>
    </html>
    """
    
    return html

def send_email_report():
    """Enviar reporte por email"""
    try:
        # Crear mensaje
        msg = MIMEMultipart()
        msg['From'] = EMAIL_USER
        msg['To'] = ", ".join(TO_EMAILS)
        msg['Subject'] = f"📊 Reporte DevOps - {datetime.now().strftime('%d/%m/%Y')}"
        
        # Generar contenido
        html_content = generate_html_report()
        msg.attach(MIMEText(html_content, 'html'))
        
        # Enviar
        server = smtplib.SMTP(SMTP_SERVER, SMTP_PORT)
        server.starttls()
        server.login(EMAIL_USER, EMAIL_PASS)
        server.send_message(msg)
        server.quit()
        
        print("✅ Reporte enviado por email")
        
    except Exception as e:
        print(f"❌ Error enviando email: {e}")

if __name__ == "__main__":
    send_email_report()
```

### 3.2 Automatizar reporte diario
```bash
# Agregar a crontab - reporte cada día a las 8 AM
echo "0 8 * * * cd /tu/directorio && python3 scripts/daily-report.py" | crontab -

# Para testing, ejecutar ahora
python3 scripts/daily-report.py
```

---

## 🧪 Paso 4: Probar Todo el Sistema (30 min)

### 4.1 Script de pruebas completas
```bash
#!/bin/bash
# test-monitoring.sh - Probar todo el monitoreo

echo "🧪 Probando sistema completo de monitoreo"
echo "========================================="

# 1. Verificar Grafana
echo "📊 1. Probando Grafana..."
if curl -s http://localhost:3000 > /dev/null; then
    echo "✅ Grafana funcionando en http://localhost:3000"
else
    echo "❌ Grafana no responde"
fi

# 2. Verificar Prometheus
echo ""
echo "📈 2. Probando Prometheus..."
if curl -s http://localhost:9090/api/v1/query?query=up > /dev/null; then
    echo "✅ Prometheus funcionando en http://localhost:9090"
    
    # Ver métricas disponibles
    METRICS=$(curl -s http://localhost:9090/api/v1/label/__name__/values | jq -r '.data[]' | wc -l)
    echo "   📊 Métricas disponibles: $METRICS"
else
    echo "❌ Prometheus no responde"
fi

# 3. Probar alertas
echo ""
echo "🚨 3. Probando alertas..."
python3 scripts/simple-alerts.py

# 4. Generar reporte
echo ""
echo "📧 4. Generando reporte de prueba..."
python3 scripts/daily-report.py

# 5. Verificar crontab
echo ""
echo "⏰ 5. Verificando tareas programadas..."
crontab -l | grep -E "(alerts|report)" && echo "✅ Crontab configurado" || echo "⚠️ Revisar crontab"

echo ""
echo "🎉 Pruebas completadas!"
echo "💡 Accede a:"
echo "   🔗 Grafana: http://localhost:3000 (admin/admin123)"
echo "   🔗 Prometheus: http://localhost:9090"
```

---

## 📝 Paso 5: Documentación Simple (15 min)

### 5.1 Crear guía rápida
```markdown
# 📊 Guía Rápida - Sistema de Monitoreo

## 🚀 Accesos Rápidos
- **Grafana**: http://localhost:3000 (admin/admin123)
- **Prometheus**: http://localhost:9090
- **Alertas**: Se envían a Slack cada 5 minutos
- **Reportes**: Email diario a las 8 AM

## 🚨 Si Algo Falla

### Grafana no carga
```bash
docker-compose restart grafana
```

### Alertas no llegan
```bash
# Verificar webhook de Slack
python3 scripts/simple-alerts.py

# Ver logs de cron
tail -f /var/log/cron
```

### Email no llega
```bash
# Verificar configuración
python3 scripts/daily-report.py
```

## 📋 Mantenimiento Semanal
1. Revisar dashboard en Grafana
2. Verificar que lleguen alertas
3. Confirmar reporte por email
4. Limpiar logs antiguos

## 🆘 Contactos de Emergencia
- DevOps Team: #devops-alerts en Slack
- Manager: manager@empresa.com
```

---

## 🎉 Resultado Final

### ✅ Lo que funciona ahora:

🚨 **Alertas por Slack** - Notificaciones cada 5 minutos cuando hay problemas  
📊 **Dashboard en Grafana** - CPU, memoria, disco y servicios  
📧 **Reportes automáticos** - Email diario con resumen  
🧪 **Testing automático** - Scripts para verificar todo  
📝 **Documentación clara** - Guía fácil para el equipo  

### 🚀 Todo automatizado:

- **Monitoreo cada 5 minutos** - Sin intervención manual
- **Dashboard actualizado** - Métricas en tiempo real
- **Reportes diarios** - Resumen automático por email
- **Alertas inteligentes** - Solo cuando realmente hay problemas

---

## 🏆 ¡ÉXITO!

Tu sistema de monitoreo es **súper simple pero efectivo**:

- **📱 Slack**: Alertas inmediatas al equipo
- **📊 Grafana**: Visualización clara y simple  
- **📧 Email**: Reportes diarios automáticos
- **🧪 Testing**: Validación continua
- **📝 Docs**: Guía clara para todos

**🚀 ¡Ya tienes observabilidad completa con herramientas que realmente funcionan!**

## Checklist de Observabilidad

### Alertas Avanzadas
- [ ] Umbrales basados en percentiles
- [ ] Alertas de anomalías configuradas
- [ ] Escalamiento por severidad
- [ ] Supresión de alertas duplicadas

### Distributed Tracing
- [ ] Jaeger/Zipkin configurado
- [ ] Instrumentación en servicios
- [ ] Correlación de traces con logs
- [ ] Performance baseline establecido

### Dashboards
- [ ] Dashboard de SLA/SLO
- [ ] Vista ejecutiva de métricas
- [ ] Dashboard de incidentes
- [ ] Mobile-friendly views

## Configuraciones de Ejemplo

### Prometheus - Alertas Predictivas
```yaml
groups:
- name: predictive-alerts
  rules:
  - alert: HighMemoryPredicted
    expr: predict_linear(node_memory_usage[1h], 4*3600) > 0.9
    for: 10m
    labels:
      severity: warning
    annotations:
      summary: "Memory usage will be high in 4 hours"
      description: "Memory on {{ $labels.instance }} predicted to reach 90% in 4h"

  - alert: DiskSpaceRunningOut
    expr: predict_linear(node_filesystem_free_bytes[6h], 24*3600) < 0
    for: 5m
    labels:
      severity: critical
    annotations:
      summary: "Disk space will run out in 24 hours"
```

### Grafana - Dashboard de SLA
```json
{
  "dashboard": {
    "title": "SLA Dashboard",
    "panels": [
      {
        "title": "Uptime SLA",
        "type": "stat",
        "targets": [
          {
            "expr": "avg_over_time(up[30d]) * 100"
          }
        ],
        "thresholds": [
          {"color": "red", "value": 99.0},
          {"color": "yellow", "value": 99.5},
          {"color": "green", "value": 99.9}
        ]
      }
    ]
  }
}
```

### Jaeger - Instrumentación
```javascript
// Node.js con OpenTelemetry
const { NodeSDK } = require('@opentelemetry/sdk-node');
const { JaegerExporter } = require('@opentelemetry/exporter-jaeger');

const jaegerExporter = new JaegerExporter({
  endpoint: 'http://jaeger:14268/api/traces',
});

const sdk = new NodeSDK({
  traceExporter: jaegerExporter,
  instrumentations: [
    getNodeAutoInstrumentations()
  ]
});

sdk.start();
```

## Métricas de SLA/SLO

### Service Level Indicators (SLIs)
```yaml
availability_sli:
  description: "Percentage of successful requests"
  query: "sum(rate(http_requests_total{status!~'5..'}[5m])) / sum(rate(http_requests_total[5m]))"

latency_sli:
  description: "95th percentile response time"
  query: "histogram_quantile(0.95, sum(rate(http_request_duration_seconds_bucket[5m])) by (le))"

error_rate_sli:
  description: "Percentage of failed requests"
  query: "sum(rate(http_requests_total{status=~'5..'}[5m])) / sum(rate(http_requests_total[5m]))"
```

### Service Level Objectives (SLOs)
- **Availability**: 99.9% uptime mensual
- **Latency**: 95% de requests < 200ms
- **Error Rate**: < 0.1% de requests con error 5xx

## Comandos Útiles

### Prometheus - Testing Queries
```bash
# Verificar métricas disponibles
curl http://prometheus:9090/api/v1/label/__name__/values

# Probar query
curl -G 'http://prometheus:9090/api/v1/query' \
  --data-urlencode 'query=up'

# Query con rango de tiempo
curl -G 'http://prometheus:9090/api/v1/query_range' \
  --data-urlencode 'query=rate(http_requests_total[5m])' \
  --data-urlencode 'start=2024-01-01T00:00:00Z' \
  --data-urlencode 'end=2024-01-01T01:00:00Z' \
  --data-urlencode 'step=15s'
```

### Jaeger - Health Check
```bash
# Verificar Jaeger UI
curl http://jaeger:16686/api/services

# Buscar traces
curl "http://jaeger:16686/api/traces?service=my-service&limit=10"
```

## Runbooks Automáticos

### Ejemplo de Runbook
```yaml
# runbook-high-cpu.yml
name: "High CPU Usage Response"
trigger: "CPUUsage > 80%"
actions:
  - type: "scale_up"
    params:
      instances: 2
  - type: "notify"
    params:
      channel: "#alerts"
      message: "Auto-scaling triggered due to high CPU"
  - type: "investigation"
    params:
      collect_logs: true
      duration: "10m"
```

## Métricas de Éxito
- **MTTD (Mean Time To Detection)**: < 2 minutos
- **MTTR (Mean Time To Recovery)**: < 15 minutos
- **Alert Noise Ratio**: < 5% falsos positivos
- **Dashboard Load Time**: < 3 segundos

## Notas Importantes
- Evitar alert fatigue con umbrales bien calibrados
- Correlacionar métricas, logs y traces
- Documentar todos los runbooks
- Revisar alertas semanalmente para optimizar