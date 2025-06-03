---
title: Día 56 - Desafío Final Semana 8
description: Integra observabilidad al proyecto voting app
sidebar_position: 7
---

## 🌟 Desafío Final Semana 8: Voting App Observada End-to-End

![](../../static/images/banner/8.png)

¡Llegaste al final de la **Semana de Observabilidad**! Hoy conectas todo: tomas la **Roxs-voting-app** (que ya tiene instrumentación) y la integras con el **stack de observabilidad** que montaste ayer.

Tu misión: **demostrar observabilidad enterprise** en un proyecto completo.

---

## 🎯 **El Desafío: Conectar Todo el Stack**

### **Lo que ya tienes listo:**
- ✅ **Stack observabilidad** funcionando (Día 55)
- ✅ **Voting app instrumentada** con métricas y traces
- ✅ **Conocimiento** de SLOs, alertas y dashboards

### **Lo que vas a lograr hoy:**
- 🔌 **Conectar** app instrumentada con Prometheus
- 📊 **Crear dashboards** ejecutivos y técnicos
- 🚨 **Configurar alertas** basadas en SLOs
- 🔍 **Verificar tracing** end-to-end
- 📝 **Logs estructurados** en Kibana
- 🎮 **Demo completa** de 5 minutos

---

## 🏗️ **Arquitectura Final Integrada**

```
[Vote UI] → [Vote API] → [Redis] → [Worker] → [PostgreSQL] → [Result API]
     ↓          ↓          ↓         ↓           ↓            ↓
  Métricas   Métricas   Métricas  Métricas   Métricas    Métricas
  Browser    Custom     Queue     Process    Database    Business
     ↓          ↓          ↓         ↓           ↓            ↓
              [Prometheus] ← [ServiceMonitors] → [Jaeger]
                     ↓                              ↓
               [Grafana] ←→ [Dashboards] ←→ [ELK Stack]
                     ↓
              [AlertManager] → [Slack Notifications]
```

---

## 📦 **Paso 1: Desplegar Voting App Instrumentada**

### **Usar las imágenes pre-instrumentadas:**

`voting-app-observability.yaml`:
```yaml
# Namespace para la app
apiVersion: v1
kind: Namespace
metadata:
  name: voting-app
  labels:
    monitoring: enabled

---
# Vote Service (Frontend)
apiVersion: apps/v1
kind: Deployment
metadata:
  name: vote
  namespace: voting-app
  labels:
    app: vote
spec:
  replicas: 2
  selector:
    matchLabels:
      app: vote
  template:
    metadata:
      labels:
        app: vote
      annotations:
        prometheus.io/scrape: "true"
        prometheus.io/port: "80"
        prometheus.io/path: "/metrics"
    spec:
      containers:
      - name: vote
        image: roxsross12/vote:instrumented  # 🔄 Imagen ya instrumentada
        ports:
        - containerPort: 80
          name: http
        env:
        - name: REDIS_URL
          value: "redis://redis-master.databases.svc.cluster.local:6379"
        - name: JAEGER_AGENT_HOST
          value: "jaeger-agent.tracing.svc.cluster.local"
        resources:
          requests:
            cpu: "100m"
            memory: "128Mi"
          limits:
            cpu: "500m"
            memory: "256Mi"

---
apiVersion: v1
kind: Service
metadata:
  name: vote
  namespace: voting-app
  labels:
    app: vote
spec:
  type: NodePort
  ports:
  - port: 80
    targetPort: 80
    nodePort: 30080
    name: http
  selector:
    app: vote

---
# Worker Service (Processor)
apiVersion: apps/v1
kind: Deployment
metadata:
  name: worker
  namespace: voting-app
  labels:
    app: worker
spec:
  replicas: 1
  selector:
    matchLabels:
      app: worker
  template:
    metadata:
      labels:
        app: worker
      annotations:
        prometheus.io/scrape: "true"
        prometheus.io/port: "8080"
        prometheus.io/path: "/metrics"
    spec:
      containers:
      - name: worker
        image: roxsross12/worker:instrumented  # 🔄 Imagen ya instrumentada
        ports:
        - containerPort: 8080
          name: metrics
        env:
        - name: REDIS_URL
          value: "redis://redis-master.databases.svc.cluster.local:6379"
        - name: POSTGRES_URL
          value: "postgresql://voting:voting123@postgresql.databases.svc.cluster.local:5432/voting"
        - name: JAEGER_AGENT_HOST
          value: "jaeger-agent.tracing.svc.cluster.local"
        resources:
          requests:
            cpu: "100m"
            memory: "128Mi"
          limits:
            cpu: "300m"
            memory: "256Mi"

---
# Result Service (Backend)
apiVersion: apps/v1
kind: Deployment
metadata:
  name: result
  namespace: voting-app
  labels:
    app: result
spec:
  replicas: 2
  selector:
    matchLabels:
      app: result
  template:
    metadata:
      labels:
        app: result
      annotations:
        prometheus.io/scrape: "true"
        prometheus.io/port: "80"
        prometheus.io/path: "/metrics"
    spec:
      containers:
      - name: result
        image: roxsross12/result:instrumented  # 🔄 Imagen ya instrumentada
        ports:
        - containerPort: 80
          name: http
        env:
        - name: POSTGRES_URL
          value: "postgresql://voting:voting123@postgresql.databases.svc.cluster.local:5432/voting"
        - name: JAEGER_AGENT_HOST
          value: "jaeger-agent.tracing.svc.cluster.local"
        resources:
          requests:
            cpu: "100m"
            memory: "128Mi"
          limits:
            cpu: "500m"
            memory: "256Mi"

---
apiVersion: v1
kind: Service
metadata:
  name: result
  namespace: voting-app
  labels:
    app: result
spec:
  type: NodePort
  ports:
  - port: 80
    targetPort: 80
    nodePort: 30081
    name: http
  selector:
    app: result
```

```bash
# Desplegar voting app instrumentada
kubectl apply -f voting-app-observability.yaml

# Verificar pods
kubectl get pods -n voting-app
```

---

## 🔌 **Paso 2: Conectar con Prometheus (ServiceMonitors)**

### **ServiceMonitors para service discovery:**

`voting-app-servicemonitors.yaml`:
```yaml
# ServiceMonitor para Vote service
apiVersion: monitoring.coreos.com/v1
kind: ServiceMonitor
metadata:
  name: vote-metrics
  namespace: voting-app
  labels:
    app: vote
    release: prometheus-stack  # 🔄 Label importante para discovery
spec:
  selector:
    matchLabels:
      app: vote
  endpoints:
  - port: http
    path: /metrics
    interval: 15s
    scrapeTimeout: 10s
  namespaceSelector:
    matchNames:
    - voting-app

---
# ServiceMonitor para Worker
apiVersion: monitoring.coreos.com/v1
kind: ServiceMonitor
metadata:
  name: worker-metrics
  namespace: voting-app
  labels:
    app: worker
    release: prometheus-stack
spec:
  selector:
    matchLabels:
      app: worker
  endpoints:
  - port: metrics
    path: /metrics
    interval: 15s
    scrapeTimeout: 10s
  namespaceSelector:
    matchNames:
    - voting-app

---
# ServiceMonitor para Result service
apiVersion: monitoring.coreos.com/v1
kind: ServiceMonitor
metadata:
  name: result-metrics
  namespace: voting-app
  labels:
    app: result
    release: prometheus-stack
spec:
  selector:
    matchLabels:
      app: result
  endpoints:
  - port: http
    path: /metrics
    interval: 15s
    scrapeTimeout: 10s
  namespaceSelector:
    matchNames:
    - voting-app
```

```bash
# Aplicar ServiceMonitors
kubectl apply -f voting-app-servicemonitors.yaml

# Verificar en Prometheus
echo "Verificar targets en: http://localhost:30090/targets"
```

---

## 📊 **Paso 3: Dashboards de Negocio y Técnicos**

### **Dashboard Ejecutivo (Business KPIs):**

`grafana-dashboards/voting-business-dashboard.json`:
```json
{
  "dashboard": {
    "title": "🗳️ Voting App - Business Dashboard",
    "tags": ["voting", "business"],
    "panels": [
      {
        "title": "Total Votes Today",
        "type": "stat",
        "targets": [
          {
            "expr": "sum(increase(vote_votes_total[24h]))",
            "legendFormat": "Total Votes"
          }
        ]
      },
      {
        "title": "Votes per Option",
        "type": "piechart",
        "targets": [
          {
            "expr": "sum by (option) (increase(vote_votes_total[1h]))",
            "legendFormat": "{{option}}"
          }
        ]
      },
      {
        "title": "Voting Rate (votes/min)",
        "type": "timeseries",
        "targets": [
          {
            "expr": "rate(vote_votes_total[1m]) * 60",
            "legendFormat": "Votes per minute"
          }
        ]
      },
      {
        "title": "Active Voters",
        "type": "stat",
        "targets": [
          {
            "expr": "vote_active_voters",
            "legendFormat": "Active Users"
          }
        ]
      }
    ]
  }
}
```

### **Dashboard Técnico (SRE):**

`grafana-dashboards/voting-technical-dashboard.json`:
```json
{
  "dashboard": {
    "title": "🔧 Voting App - Technical Dashboard",
    "tags": ["voting", "technical", "sre"],
    "panels": [
      {
        "title": "Request Rate (RPS)",
        "type": "timeseries",
        "targets": [
          {
            "expr": "sum(rate(vote_http_requests_total[1m])) by (service)",
            "legendFormat": "{{service}}"
          }
        ]
      },
      {
        "title": "Response Time P95",
        "type": "timeseries",
        "targets": [
          {
            "expr": "histogram_quantile(0.95, rate(vote_http_duration_seconds_bucket[5m]))",
            "legendFormat": "P95 Response Time"
          }
        ]
      },
      {
        "title": "Error Rate",
        "type": "timeseries",
        "targets": [
          {
            "expr": "rate(vote_http_requests_total{status=~'5..'}[1m]) / rate(vote_http_requests_total[1m]) * 100",
            "legendFormat": "Error Rate %"
          }
        ]
      },
      {
        "title": "Queue Length",
        "type": "timeseries",
        "targets": [
          {
            "expr": "redis_list_length{list='votes'}",
            "legendFormat": "Vote Queue Length"
          }
        ]
      }
    ]
  }
}
```

### **Importar dashboards a Grafana:**

```bash
# Crear ConfigMap con dashboards
kubectl create configmap voting-dashboards \
  --from-file=grafana-dashboards/ \
  -n monitoring

# Agregar label para que Grafana los auto-importe
kubectl label configmap voting-dashboards grafana_dashboard=1 -n monitoring
```

---

## 🚨 **Paso 4: Configurar Alertas Basadas en SLOs**

### **Alerting Rules para Voting App:**

`voting-app-alerts.yaml`:
```yaml
apiVersion: monitoring.coreos.com/v1
kind: PrometheusRule
metadata:
  name: voting-app-alerts
  namespace: voting-app
  labels:
    prometheus: kube-prometheus
    role: alert-rules
spec:
  groups:
  - name: voting-app.slo
    interval: 30s
    rules:
    # SLI: Availability (success rate)
    - record: sli:voting:availability:rate5m
      expr: |
        rate(vote_http_requests_total{status=~"2.."}[5m]) /
        rate(vote_http_requests_total[5m])
    
    # SLI: Latency (P95 response time)
    - record: sli:voting:latency:p95:rate5m
      expr: |
        histogram_quantile(0.95, 
          rate(vote_http_duration_seconds_bucket[5m])
        )
    
    # Error Budget Burn Rate (SLO: 99.5% availability)
    - record: slo:voting:error_budget_burn_rate
      expr: |
        (1 - sli:voting:availability:rate5m) / (1 - 0.995)
    
  - name: voting-app.alerts
    rules:
    # CRITICAL: High error budget burn rate
    - alert: VotingAppErrorBudgetBurnRateCritical
      expr: slo:voting:error_budget_burn_rate > 10
      for: 2m
      labels:
        severity: critical
        team: platform
      annotations:
        summary: "🚨 Voting App: Critical error budget burn rate"
        description: |
          Error budget burning at {{ $value | humanize }}x normal rate.
          Current availability: {{ with query "sli:voting:availability:rate5m" }}{{ . | first | value | humanizePercentage }}{{ end }}
          SLO: 99.5%

    # WARNING: High latency
    - alert: VotingAppHighLatency
      expr: sli:voting:latency:p95:rate5m > 1
      for: 5m
      labels:
        severity: warning
        team: platform
      annotations:
        summary: "⚠️ Voting App: High response time"
        description: "P95 latency is {{ $value }}s, exceeding 1s threshold"

    # WARNING: Queue backup
    - alert: VotingAppQueueBackup
      expr: redis_list_length{list="votes"} > 100
      for: 2m
      labels:
        severity: warning
        team: platform
      annotations:
        summary: "📬 Voting App: Vote queue backing up"
        description: "{{ $value }} votes pending processing"

    # INFO: High voting activity
    - alert: VotingAppHighActivity
      expr: rate(vote_votes_total[1m]) * 60 > 50
      for: 1m
      labels:
        severity: info
        team: business
      annotations:
        summary: "📈 Voting App: High voting activity detected"
        description: "{{ $value }} votes per minute - consider scaling"
```

```bash
# Aplicar alertas
kubectl apply -f voting-app-alerts.yaml

# Verificar en Prometheus
echo "Ver alertas en: http://localhost:30090/alerts"
```

---

## 🔍 **Paso 5: Verificar Distributed Tracing**

### **Configurar Jaeger Agent (si no está):**

```bash
# Verificar que Jaeger puede recibir traces
kubectl get pods -n tracing

# Port-forward para acceder a Jaeger UI
kubectl port-forward -n tracing svc/jaeger-query 16686:16686 &

echo "Jaeger UI: http://localhost:16686"
```

### **Test de tracing end-to-end:**

```bash
# Script para generar traces
cat > test-tracing.sh << 'EOF'
#!/bin/bash
echo "🔍 Testing distributed tracing..."

# Generar votos para crear traces
for i in {1..10}; do
  echo "Casting vote $i..."
  curl -s http://localhost:30080/vote/cats > /dev/null
  sleep 1
  curl -s http://localhost:30080/vote/dogs > /dev/null
  sleep 1
done

echo "✅ Votes cast! Check Jaeger for traces:"
echo "   http://localhost:16686"
echo "   Service: vote-service"
echo "   Operation: HTTP GET /vote/*"
EOF

chmod +x test-tracing.sh
./test-tracing.sh
```

---

## 📝 **Paso 6: Logs Estructurados en Kibana**

### **Verificar logs en Kibana:**

```bash
# Acceder a Kibana
echo "Kibana: http://localhost:30093"

# Crear index pattern para logs de voting app
echo "1. Go to Kibana > Stack Management > Index Patterns"
echo "2. Create pattern: 'filebeat-*'"
echo "3. Time field: '@timestamp'"
echo "4. Go to Discover and filter by: kubernetes.namespace:voting-app"
```

### **Queries útiles en Kibana:**

```bash
# Logs de errores
kubernetes.namespace:"voting-app" AND level:"ERROR"

# Logs de votos procesados
kubernetes.namespace:"voting-app" AND message:"Vote processed"

# Logs por servicio
kubernetes.namespace:"voting-app" AND kubernetes.container.name:"vote"
```

---

## 🧪 **Paso 7: Load Testing para Demo**

### **Script de carga completo:**

`load-test-demo.sh`:
```bash
#!/bin/bash

echo "🚀 Starting Voting App Load Test Demo..."
echo "📊 Open these URLs to watch metrics:"
echo "   Grafana: http://localhost:30091 (admin/admin123)"
echo "   Prometheus: http://localhost:30090"
echo "   Jaeger: http://localhost:16686"
echo "   Kibana: http://localhost:30093"
echo ""

# Función para votar
vote_round() {
    local round=$1
    local votes=$2
    echo "📈 Round $round: Generating $votes votes..."
    
    for i in $(seq 1 $votes); do
        # Random vote
        if [ $((RANDOM % 2)) -eq 0 ]; then
            curl -s http://localhost:30080/vote/cats > /dev/null &
        else
            curl -s http://localhost:30080/vote/dogs > /dev/null &
        fi
        
        # Check results occasionally
        if [ $((i % 10)) -eq 0 ]; then
            curl -s http://localhost:30081/ > /dev/null &
        fi
    done
    wait
}

# Demo scenario
echo "🎭 Demo Scenario:"
echo "1. Normal load (30 votes)"
vote_round 1 30
sleep 10

echo "2. High load (100 votes)"
vote_round 2 100
sleep 15

echo "3. Spike load (200 votes)"
vote_round 3 200
sleep 10

echo "4. Cool down (20 votes)"
vote_round 4 20

echo "✅ Load test completed!"
echo ""
echo "📊 Check your dashboards for:"
echo "   • Vote rate spikes"
echo "   • Response time changes"
echo "   • Queue length variations"
echo "   • Traces in Jaeger"
echo "   • Logs in Kibana"
```

```bash
chmod +x load-test-demo.sh
./load-test-demo.sh
```

---

## 📋 **Checklist de Validación Final**

### **✅ Aplicación Funcionando:**
- [ ] Vote UI accesible en http://localhost:30080
- [ ] Result UI accesible en http://localhost:30081
- [ ] Votos se procesan y reflejan en resultados
- [ ] Todos los pods en estado Running

### **✅ Métricas y Monitoreo:**
- [ ] ServiceMonitors aparecen en Prometheus targets
- [ ] Métricas custom visibles en Prometheus
- [ ] Dashboards importados en Grafana
- [ ] Alertas configuradas y evaluándose

### **✅ Observabilidad Completa:**
- [ ] Traces visibles en Jaeger UI
- [ ] Logs estructurados en Kibana
- [ ] Load test genera datos observables
- [ ] SLOs definidos y medidos

### **✅ Demo Lista:**
- [ ] Puedes explicar la arquitectura
- [ ] Mostrar métricas en tiempo real
- [ ] Demostrar alertas funcionando
- [ ] Traces end-to-end visibles

---

## 🎯 **Tu Demo de 5 Minutos**

### **Script de presentación:**

```
🎬 "Demo: Voting App con Observabilidad Enterprise"

1. INTRO (30s):
   "Esta es una aplicación distribuida con observabilidad completa"
   
2. ARQUITECTURA (1min):
   "Vote → Redis → Worker → PostgreSQL → Result"
   "Cada componente instrumentado con métricas, logs y traces"
   
3. MÉTRICAS EN VIVO (2min):
   "Grafana business dashboard: votos por opción, rate, usuarios"
   "Technical dashboard: latency, errors, throughput"
   "Ejecutar load test y mostrar métricas cambiando"
   
4. DISTRIBUTED TRACING (1min):
   "Jaeger: request flow completo de vote a result"
   "Ver latencia por componente"
   
5. ALERTAS Y SLOs (30s):
   "SLO de 99.5% availability"
   "Alertas basadas en error budget burn rate"
   "Logs estructurados en Kibana"
   
🎯 "Esto es observabilidad enterprise-grade en acción"
```

---

## 🏆 **¡Proyecto Portfolio Completado!**

### **Lo que lograste:**

✅ **Observabilidad End-to-End** - Métricas + Logs + Traces
✅ **Business + Technical KPIs** - Dashboards para diferentes audiencias  
✅ **SLO-based Alerting** - Error budget methodology
✅ **Distributed Tracing** - Request flow completo
✅ **Structured Logging** - Logs agregados y searchables
✅ **Load Testing** - Performance bajo carga
✅ **Production Patterns** - Service discovery, health checks



## 📸 **Comparte tu Achievement!**

**Capturas para compartir:**
- Grafana dashboards con métricas en vivo
- Jaeger traces del request flow
- Load test impactando métricas
- Prometheus alerts evaluándose
- Kibana logs estructurados

**#DevOpsConRoxs - Día 56: Portfolio Project Completed!** 🎉
