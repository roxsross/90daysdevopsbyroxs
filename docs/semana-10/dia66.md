---
title: Día 66 - Monitoreo y Alertas Avanzadas
description: Perfeccionar el sistema de observabilidad con alertas inteligentes
sidebar_position: 3
---

### semana10
![](../../static/images/banner/10.png)

## Objetivo
Perfeccionar el sistema de observabilidad con alertas predictivas y dashboards ejecutivos

## Actividades Principales

### 1. Configurar Alertas Inteligentes
- **Umbrales dinámicos**: Basados en patrones históricos
- **Alertas predictivas**: Detectar problemas antes que ocurran
- **Escalamiento**: Notificaciones por niveles de severidad

### 2. Implementar Distributed Tracing
- Seguimiento de requests entre servicios
- Identificación de cuellos de botella
- Análisis de latencia end-to-end

### 3. Crear Dashboards Ejecutivos
- KPIs de negocio en tiempo real
- Métricas de SLA/SLO
- Resumen de health del sistema

## Entregables del Día

- [ ] Alertas predictivas configuradas
- [ ] Distributed tracing funcionando
- [ ] Dashboard ejecutivo completo

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