---
title: Día 54 - Alerting Avanzado y SRE Practices
description: SLIs, SLOs, Error Budgets y alertas inteligentes que no molestan
sidebar_position: 5
---

## 🚨 Alerting Como un SRE de Google

![](../../static/images/banner/8.png)

> "Las alertas malas despiertan a los engineers a las 3 AM por nada. Las alertas **inteligentes** solo te despiertan cuando realmente **algo crítico está pasando**. 🎯"

### 🎯 **Meta del día:**
- ✅ Entender SLIs, SLOs y Error Budgets
- ✅ Configurar AlertManager con escalation inteligente
- ✅ Crear alertas que NO generen fatigue
- ✅ Integrar con Slack/Discord para incident response
- ✅ Practicar incident response real

---

## 🤔 **El Problema: Alert Fatigue**

### **Alertas malas (que todos odian):**
```
🔥 CRITICAL: CPU > 50% (se dispara 100x/día)
🔥 WARNING: Response time > 200ms (ruido constante)
🔥 ERROR: 1 request falló (no es crítico)
```

**Resultado:** Engineers ignoran ALL las alertas 😴

### **Alertas buenas (SRE style):**
```
🚨 CRITICAL: SLO breach - 99.9% availability violated
⚠️ WARNING: Error budget will exhaust in 2 hours at current rate
📊 INFO: Performance degraded but within SLO bounds
```

**Resultado:** Engineers responden inmediatamente 🚀

---

## 📊 **Paso 1: Definir SLIs y SLOs**

### **¿Qué son SLIs, SLOs y SLAs?**

**SLI (Service Level Indicator)** = Métrica que mides
```
Availability = (successful requests / total requests)
Latency = P99 response time
Throughput = requests per second
```

**SLO (Service Level Objective)** = Target que quieres alcanzar
```
Availability SLO: 99.9% (8.77 hours downtime/year)
Latency SLO: P99 < 500ms
Throughput SLO: Handle 1000 RPS
```

**SLA (Service Level Agreement)** = Contractual commitment
```
"Si no cumplimos 99.9% availability, te devolvemos dinero"
```

### **Defining SLOs para tu app:**

`slos-config.yaml`:
```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: slo-definitions
  namespace: mi-app
data:
  slos.yaml: |
    # SLOs para mi-app
    services:
      mi-app:
        availability:
          slo: 99.9%  # 43 seconds downtime per month
          sli: |
            rate(app_requests_total{status=~"2.."}[30d]) /
            rate(app_requests_total[30d])
        
        latency:
          slo: 95%  # 95% of requests < 500ms
          threshold: 0.5  # 500ms
          sli: |
            histogram_quantile(0.95, 
              rate(app_request_duration_seconds_bucket[5m])
            )
        
        error_budget:
          period: 30d  # Monthly error budget
          burn_rate_fast: 6    # 6x normal rate = critical
          burn_rate_slow: 3    # 3x normal rate = warning
```

```bash
kubectl apply -f slos-config.yaml
```

---

## 🔥 **Paso 2: Error Budget y Burn Rate**

### **¿Qué es Error Budget?**

Si tu SLO es **99.9% availability**, tienes **0.1% error budget**:
- En 30 días = 43 minutos de downtime permitido
- Error budget = "cuánto puedes fallar antes de quebrar SLO"

### **Burn Rate Alerting:**

`error-budget-alerts.yaml`:
```yaml
apiVersion: monitoring.coreos.com/v1
kind: PrometheusRule
metadata:
  name: error-budget-alerts
  namespace: mi-app
  labels:
    prometheus: kube-prometheus
    role: alert-rules
spec:
  groups:
  - name: slo.rules
    interval: 30s
    rules:
    # Calculate availability SLI
    - record: sli:availability:rate5m
      expr: |
        rate(app_requests_total{status=~"2.."}[5m]) /
        rate(app_requests_total[5m])
    
    - record: sli:availability:rate30m
      expr: |
        rate(app_requests_total{status=~"2.."}[30m]) /
        rate(app_requests_total[30m])
    
    - record: sli:availability:rate6h
      expr: |
        rate(app_requests_total{status=~"2.."}[6h]) /
        rate(app_requests_total[6h])
    
    # Calculate latency SLI
    - record: sli:latency:p99:rate5m
      expr: |
        histogram_quantile(0.99, 
          rate(app_request_duration_seconds_bucket[5m])
        )
    
    # Error budget burn rate
    - record: slo:error_budget_burn_rate:5m
      expr: |
        (1 - sli:availability:rate5m) / (1 - 0.999)
    
    - record: slo:error_budget_burn_rate:30m
      expr: |
        (1 - sli:availability:rate30m) / (1 - 0.999)

  - name: slo.alerts
    rules:
    # CRITICAL: Fast burn rate (budget exhausted in 2 hours)
    - alert: SLOErrorBudgetBurnRateCritical
      expr: |
        slo:error_budget_burn_rate:5m > 6 and
        slo:error_budget_burn_rate:30m > 6
      for: 2m
      labels:
        severity: critical
        team: platform
        runbook: "https://runbooks.company.com/slo-burn-rate"
      annotations:
        summary: "🚨 CRITICAL: Error budget burning too fast"
        description: |
          Service {{ $labels.service }} is burning error budget at {{ $value | humanize }}x 
          the normal rate. At this rate, monthly error budget will be exhausted in 2 hours.
          
          Current availability: {{ with query "sli:availability:rate5m" }}{{ . | first | value | humanizePercentage }}{{ end }}
          SLO: 99.9%
        
    # WARNING: Medium burn rate (budget exhausted in 1 day)
    - alert: SLOErrorBudgetBurnRateHigh
      expr: |
        slo:error_budget_burn_rate:5m > 3 and
        slo:error_budget_burn_rate:6h > 3
      for: 15m
      labels:
        severity: warning
        team: platform
      annotations:
        summary: "⚠️ WARNING: Error budget burning faster than usual"
        description: |
          Service {{ $labels.service }} is burning error budget at {{ $value | humanize }}x 
          the normal rate. At this rate, monthly error budget will be exhausted in 1 day.

    # Latency SLO breach
    - alert: SLOLatencyBreach
      expr: sli:latency:p99:rate5m > 0.5
      for: 2m
      labels:
        severity: warning
        team: platform
      annotations:
        summary: "Latency SLO breach detected"
        description: |
          P99 latency is {{ $value }}s, exceeding SLO of 500ms.
          This affects user experience quality.

    # Error budget exhaustion prediction
    - alert: SLOErrorBudgetExhaustionRisk
      expr: |
        predict_linear(slo:error_budget_burn_rate:30m[6h], 7*24*3600) > 1
      for: 5m
      labels:
        severity: warning
        team: platform
      annotations:
        summary: "Error budget at risk of exhaustion"
        description: |
          Based on current trends, error budget will be exhausted in less than 7 days.
          Consider reducing deployment frequency or improving reliability.
```

```bash
kubectl apply -f error-budget-alerts.yaml
```

---

## 🔔 **Paso 3: AlertManager Configuración Inteligente**

### **Configurar AlertManager para routing inteligente:**

`alertmanager-config.yaml`:
```yaml
apiVersion: v1
kind: Secret
metadata:
  name: alertmanager-kube-prometheus-alertmanager
  namespace: monitoring
type: Opaque
stringData:
  alertmanager.yml: |
    global:
      slack_api_url: 'YOUR_SLACK_WEBHOOK_URL'  # 🔄 Cambiar por tu webhook
      resolve_timeout: 5m

    # Template para mensajes más informativos
    templates:
    - '/etc/alertmanager/templates/*.tmpl'

    route:
      group_by: ['alertname', 'team']
      group_wait: 10s
      group_interval: 10s
      repeat_interval: 12h
      receiver: 'default-receiver'
      
      routes:
      # Critical alerts -> Inmediato + escalation
      - match:
          severity: critical
        receiver: 'critical-alerts'
        group_wait: 0s
        repeat_interval: 5m
        
      # Warning alerts -> Slack normal
      - match:
          severity: warning
        receiver: 'warning-alerts'
        group_wait: 2m
        repeat_interval: 1h
        
      # Info alerts -> Solo durante horario laboral
      - match:
          severity: info
        receiver: 'info-alerts'
        active_time_intervals:
        - business-hours

    # Time intervals
    time_intervals:
    - name: business-hours
      time_intervals:
      - times:
        - start_time: '09:00'
          end_time: '18:00'
        weekdays: ['monday:friday']

    receivers:
    - name: 'default-receiver'
      slack_configs:
      - channel: '#devops-alerts'
        title: '🔔 {{ .GroupLabels.alertname }}'
        text: |
          {{ range .Alerts }}
          *Alert:* {{ .Annotations.summary }}
          *Details:* {{ .Annotations.description }}
          *Severity:* {{ .Labels.severity }}
          {{ end }}

    - name: 'critical-alerts'
      slack_configs:
      - channel: '#incidents'
        title: '🚨 CRITICAL ALERT 🚨'
        text: |
          @channel IMMEDIATE ATTENTION REQUIRED
          
          {{ range .Alerts }}
          *Alert:* {{ .Annotations.summary }}
          *Description:* {{ .Annotations.description }}
          *Runbook:* {{ .Labels.runbook }}
          *Team:* {{ .Labels.team }}
          {{ end }}
        color: 'danger'
        
      # También enviar por email para critical
      email_configs:
      - to: 'oncall@company.com'
        subject: '🚨 CRITICAL: {{ .GroupLabels.alertname }}'
        body: |
          CRITICAL alert fired:
          {{ range .Alerts }}
          {{ .Annotations.description }}
          {{ end }}

    - name: 'warning-alerts'
      slack_configs:
      - channel: '#monitoring'
        title: '⚠️ Warning Alert'
        text: |
          {{ range .Alerts }}
          *Alert:* {{ .Annotations.summary }}
          *Details:* {{ .Annotations.description }}
          {{ end }}
        color: 'warning'

    - name: 'info-alerts'
      slack_configs:
      - channel: '#monitoring-info'
        title: '📊 Info Alert'
        text: |
          {{ range .Alerts }}
          {{ .Annotations.summary }}
          {{ end }}
        color: 'good'

    # Inhibition rules - No alertar cosas redundantes
    inhibit_rules:
    - source_match:
        severity: 'critical'
      target_match:
        severity: 'warning'
      equal: ['alertname', 'namespace', 'pod']
      
    - source_match:
        alertname: 'SLOErrorBudgetBurnRateCritical'
      target_match:
        alertname: 'SLOErrorBudgetBurnRateHigh'
      equal: ['service']
```

```bash
kubectl apply -f alertmanager-config.yaml

# Reiniciar AlertManager para cargar nueva config
kubectl rollout restart statefulset/alertmanager-kube-prometheus-alertmanager -n monitoring
```

---

## 📱 **Paso 4: Integración con Slack/Discord**

### **Crear Slack Webhook:**

1. Ve a tu Slack → **Apps** → **Incoming Webhooks**
2. **Add to Slack** → Seleccionar canal → **Add Incoming WebHooks Integration**
3. Copiar **Webhook URL**: `https://hooks.slack.com/services/...`

### **Configurar webhook en AlertManager:**
```bash
# Editar el secret con tu webhook real
kubectl edit secret alertmanager-kube-prometheus-alertmanager -n monitoring

# Cambiar YOUR_SLACK_WEBHOOK_URL por tu URL real
```

### **Discord alternative:**
```yaml
# En lugar de slack_configs, usar webhook_configs para Discord
webhook_configs:
- url: 'YOUR_DISCORD_WEBHOOK_URL'
  title: '🚨 Alert from Kubernetes'
  send_resolved: true
```

---

## 🎮 **Paso 5: Runbooks y Incident Response**

### **Crear Runbooks estructura:**

`runbooks-configmap.yaml`:
```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: runbooks
  namespace: mi-app
data:
  slo-burn-rate.md: |
    # SLO Error Budget Burn Rate - Incident Response

    ## Immediate Actions (< 5 minutes)
    1. **Assess Impact**: Check current error rate and affected users
       ```bash
       # Current error rate
       kubectl exec -n monitoring prometheus-kube-prometheus-prometheus-0 -- \
         promtool query instant 'rate(app_requests_total{status!~"2.."}[5m])'
       
       # Affected pods
       kubectl get pods -n mi-app --field-selector=status.phase!=Running
       ```

    2. **Check Recent Changes**: 
       - Recent deployments: `kubectl rollout history deployment/mi-app -n mi-app`
       - Recent configs: `kubectl get events -n mi-app --sort-by=.metadata.creationTimestamp`

    3. **Quick Mitigation**:
       ```bash
       # If recent deployment caused it, rollback immediately
       kubectl rollout undo deployment/mi-app -n mi-app
       
       # If traffic spike, scale up
       kubectl scale deployment mi-app --replicas=10 -n mi-app
       ```

    ## Investigation (< 15 minutes)
    1. **Check Dependencies**: Database, external APIs, network
    2. **Resource Analysis**: CPU, Memory, Network saturation
    3. **Log Analysis**: 
       ```bash
       kubectl logs -n mi-app -l app=mi-app --tail=100 | grep ERROR
       ```

    ## Long-term Fix
    1. **Root Cause Analysis**: Complete RCA document
    2. **Preventive Measures**: Add missing alerts, improve tests
    3. **Post-mortem**: Schedule blameless post-mortem

  high-latency.md: |
    # High Latency Incident Response

    ## Immediate Checks
    1. **Database Performance**: Check slow queries, connections
    2. **External Dependencies**: API response times, timeouts
    3. **Resource Saturation**: CPU throttling, memory pressure

    ## Quick Fixes
    ```bash
    # Scale application
    kubectl scale deployment mi-app --replicas=5 -n mi-app
    
    # Check resource limits
    kubectl describe pod -n mi-app -l app=mi-app | grep -A 5 Limits
    
    # Restart if memory leak suspected
    kubectl rollout restart deployment/mi-app -n mi-app
    ```

  app-down.md: |
    # Application Down - Critical Incident

    ## Emergency Response (< 2 minutes)
    1. **Check Pod Status**:
       ```bash
       kubectl get pods -n mi-app -o wide
       kubectl describe pod -n mi-app -l app=mi-app
       ```

    2. **Check Service/Ingress**:
       ```bash
       kubectl get svc,ingress -n mi-app
       curl -I http://localhost:30080/health
       ```

    3. **Immediate Recovery**:
       ```bash
       # Force restart all pods
       kubectl rollout restart deployment/mi-app -n mi-app
       
       # If persistent, rollback to last known good
       kubectl rollout undo deployment/mi-app -n mi-app
       ```

    ## Escalation Path
    - **< 5 min**: Platform team lead
    - **< 15 min**: Engineering manager
    - **< 30 min**: VP Engineering
```

```bash
kubectl apply -f runbooks-configmap.yaml
```

---

## 🧪 **Paso 6: Chaos Testing - Simular Incidentes**

### **Test 1: Error Budget Burn**

```bash
# Script para generar errores masivos
cat > chaos-errors.sh << 'EOF'
#!/bin/bash
echo "🔥 Generando errores para testing SLO alerts..."

# Generar tráfico que causa muchos 500s
for i in {1..200}; do
  # El endpoint /api/users tiene 10% de probabilidad de error
  # Con 200 requests, deberíamos tener ~20 errores
  curl -s http://localhost:30080/api/users > /dev/null &
done

wait
echo "✅ Chaos test completado. Revisar alertas en 2-3 minutos."
EOF

chmod +x chaos-errors.sh
./chaos-errors.sh
```

**Observar:**
- Error rate spike en Grafana
- SLO burn rate alert disparándose
- Slack notification llegando

### **Test 2: Latency SLO Breach**

```bash
# Stress test que causa alta latencia
cat > chaos-latency.sh << 'EOF'
#!/bin/bash
echo "⏰ Generando latencia alta..."

# Bombardear con requests para causar latencia
for round in {1..5}; do
  echo "Round $round/5"
  for i in {1..50}; do
    curl -s http://localhost:30080/api/users > /dev/null &
  done
  sleep 2
done

wait
echo "✅ Latency chaos test completado."
EOF

chmod +x chaos-latency.sh
./chaos-latency.sh
```

### **Test 3: Complete App Down**

```bash
# Simular app completamente caída
kubectl scale deployment mi-app --replicas=0 -n mi-app

# Esperar 2 minutos para que las alertas se disparen
sleep 120

# Restaurar
kubectl scale deployment mi-app --replicas=3 -n mi-app
```

---

## 📊 **Paso 7: Dashboard Ejecutivo de SLOs**

### **SLO Dashboard para management:**

Crear dashboard en Grafana con estos panels:

**Panel 1: SLO Compliance (Current Month)**
```promql
sli:availability:rate30m * 100
```
- **Type**: Stat
- **Title**: "Current Availability"
- **Thresholds**: Red < 99.9%, Yellow < 99.95%, Green >= 99.95%

**Panel 2: Error Budget Remaining**
```promql
(1 - (1 - sli:availability:rate30m) / (1 - 0.999)) * 100
```
- **Type**: Gauge
- **Title**: "Error Budget Remaining %"
- **Max**: 100

**Panel 3: Error Budget Burn Rate**
```promql
slo:error_budget_burn_rate:5m
```
- **Type**: Time series
- **Title**: "Error Budget Burn Rate (1.0 = normal)"

**Panel 4: SLO History (Last 7 days)**
```promql
avg_over_time(sli:availability:rate30m[7d]) * 100
```

**Panel 5: MTTR (Mean Time To Recovery)**
```promql
avg(time() - on() (up == 0))
```

---

## 🚨 **Paso 8: Escalation y On-Call Rotation**

### **PagerDuty Integration (opcional):**

```yaml
# En alertmanager config
pagerduty_configs:
- severity: '{{ .CommonLabels.severity }}'
  service_key: 'YOUR_PAGERDUTY_SERVICE_KEY'
  description: '{{ .CommonAnnotations.summary }}'
  details:
    firing: '{{ .Alerts.Firing | len }}'
    resolved: '{{ .Alerts.Resolved | len }}'
```

### **On-Call Schedule:**

`oncall-schedule.yaml`:
```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: oncall-schedule
  namespace: monitoring
data:
  schedule.json: |
    {
      "rotation": "weekly",
      "timezone": "America/Argentina/Buenos_Aires",
      "schedule": [
        {
          "week": 1,
          "primary": "juan@company.com",
          "secondary": "maria@company.com"
        },
        {
          "week": 2,
          "primary": "carlos@company.com", 
          "secondary": "ana@company.com"
        }
      ],
      "escalation": [
        {"level": 1, "delay": "5m", "target": "primary"},
        {"level": 2, "delay": "15m", "target": "secondary"},
        {"level": 3, "delay": "30m", "target": "manager@company.com"}
      ]
    }
```

---

## 📚 **Best Practices para Alerting**

### **🎯 Alert Design Principles:**

1. **Actionable**: Cada alerta debe tener acción clara
2. **Meaningful**: Solo alertar lo que realmente importa  
3. **Contextual**: Incluir información para resolver
4. **Escalated**: Critical → Warning → Info
5. **Time-bound**: Resolver automáticamente cuando corresponde

### **❌ Anti-patterns a evitar:**

```yaml
# MAL: Alert por cada error individual
- alert: SingleRequestFailed
  expr: app_requests_total{status="500"} > 0

# BIEN: Alert por rate de errores sostenido
- alert: HighErrorRate  
  expr: rate(app_requests_total{status="500"}[5m]) > 0.1
  for: 2m
```

### **📝 Alert Annotation Template:**

```yaml
annotations:
  summary: "Brief, clear description of the problem"
  description: |
    Detailed explanation including:
    - What is happening
    - Why it matters  
    - What to do about it
    - Links to runbooks/dashboards
  runbook_url: "https://runbooks.company.com/{{ $labels.alertname }}"
  dashboard_url: "http://grafana.company.com/d/app-dashboard"
```

---

## 🛠️ **Troubleshooting Alerting**

### **❌ "Alertas no llegan a Slack"**
```bash
# 1. Verificar config de AlertManager
kubectl logs -n monitoring alertmanager-kube-prometheus-alertmanager-0

# 2. Test webhook manualmente
curl -X POST -H 'Content-type: application/json' \
  --data '{"text":"Test from AlertManager"}' \
  YOUR_SLACK_WEBHOOK_URL

# 3. Verificar routing en AlertManager UI
# http://localhost:30002
```

### **❌ "Alertas se disparan constantemente"**
```bash
# Revisar thresholds y duración
kubectl get prometheusrule -n mi-app -o yaml

# Check for flapping metrics
kubectl exec -n monitoring prometheus-kube-prometheus-prometheus-0 -- \
  promtool query instant 'YOUR_ALERT_EXPRESSION'
```

---

## 🧠 **Revisión del Día**

| Concepto | ¿Lo lograste? | Notas |
|----------|---------------|-------|
| SLIs y SLOs definidos | ✔️ / ❌ | |
| Error budget alerting funcionando | ✔️ / ❌ | |
| AlertManager con routing inteligente | ✔️ / ❌ | |
| Integración Slack/Discord | ✔️ / ❌ | |
| Runbooks documentados | ✔️ / ❌ | |
| Chaos testing ejecutado | ✔️ / ❌ | |

---

## 🎯 **Pro Challenges**

### **Challenge 1: Multi-Service SLOs**
Definir SLOs para un stack completo (frontend + backend + database).

### **Challenge 2: Business KPI Alerts**
Crear alertas basadas en métricas de negocio (revenue, signups, etc).

### **Challenge 3: Predictive Alerting**
Usar `predict_linear()` para alertar ANTES de que ocurran problemas.

---

## 💡 **Pro Tips SRE**

### **🎯 SLO Strategy:**
- **Start conservative**: 99.9% es mejor que 99.99% inalcanzable
- **Measure what users experience**: User-facing metrics
- **Error budget is a feature**: Permite deployments y riesgos

### **🚨 Alert Fatigue Prevention:**
- **Alert on symptoms, not causes**: Error rate, not disk space
- **Use inhibition rules**: No duplicar alertas
- **Time-based routing**: Info alerts solo en horario laboral

### **📊 Dashboard for Audiences:**
- **Executive**: SLO compliance, business impact
- **Engineering**: Technical metrics, troubleshooting
- **On-call**: Current incidents, recent changes

---

## 🚀 **¿Qué Sigue Mañana?**

**Días 55-56: Proyecto Voting App con Observabilidad Completa**
- Aplicación multi-componente real
- SLOs end-to-end
- Observabilidad distributed tracing
- Demo completa de incident response

### **Mantener el setup:**
```bash
# Todo este stack será la base para el proyecto final
kubectl get all -A | grep -E "(prometheus|grafana|alertmanager)"
```

---

## 🎉 **¡SRE Level Unlocked!**

Hoy completaste el círculo de **observabilidad profesional**:

✅ **SLIs/SLOs/SLAs** - Como Google/Netflix/Uber
✅ **Error budget methodology** - Data-driven reliability  
✅ **Intelligent alerting** - Sin alert fatigue
✅ **Incident response** - Runbooks y escalation
✅ **Chaos engineering** - Proactive reliability testing
✅ **Multi-audience dashboards** - Executive + Engineering

**Skill Level:** De "monitoring básico" a **"Site Reliability Engineer"** 📈

Esto te pone en el **top 1%** de engineers que dominan observabilidad enterprise.


📸 **Compartí tus SLO dashboards y alertas inteligentes #DevOpsConRoxs - Día 54**

¡Mañana construimos el proyecto final que va a ser tu portfolio showcase! 🎮🚀