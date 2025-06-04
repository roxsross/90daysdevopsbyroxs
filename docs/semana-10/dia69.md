---
title: Día 69 - Testing y Validación Final
description: Validar todo el ecosistema DevOps con tests exhaustivos
sidebar_position: 6
---

### semana10
![](../../static/images/banner/10.png)

## Objetivo
Validar todo el ecosistema DevOps mediante testing exhaustivo y pruebas de resiliencia

## Actividades Principales

### 1. Tests de Stress y Carga
- **Load testing**: Comportamiento bajo carga normal
- **Stress testing**: Límites del sistema
- **Spike testing**: Picos súbitos de tráfico
- **Volume testing**: Grandes volúmenes de datos

### 2. Disaster Recovery Testing
- **Backup/Restore**: Validar procedimientos
- **Failover**: Pruebas de conmutación
- **Data integrity**: Verificar integridad post-recuperación

### 3. Chaos Engineering
- **Pod killing**: Resilencia de servicios
- **Network partitioning**: Tolerancia a fallos de red
- **Resource exhaustion**: Comportamiento bajo stress

## Entregables del Día

- [ ] Reporte completo de performance testing
- [ ] Plan de disaster recovery validado
- [ ] Experimentos de chaos engineering ejecutados

## Checklist de Testing

### Performance Testing
- [ ] Load tests ejecutados en todos los servicios
- [ ] Stress tests con 2x tráfico normal
- [ ] Spike tests con 10x tráfico durante 5min
- [ ] Volume tests con datasets grandes

### Disaster Recovery
- [ ] Backup completo realizado y verificado
- [ ] Restore test ejecutado exitosamente
- [ ] Failover automático probado
- [ ] RTO/RPO objetivos validados

### Chaos Engineering
- [ ] Pod failures simulados
- [ ] Network latency inyectada
- [ ] Disk space exhaustion probada
- [ ] CPU/Memory stress aplicado

## Performance Testing con K6

### Load Test Script
```javascript
// load-test.js
import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate } from 'k6/metrics';

const errorRate = new Rate('errors');

export let options = {
  stages: [
    { duration: '2m', target: 10 },   // Ramp up
    { duration: '5m', target: 50 },   // Normal load
    { duration: '2m', target: 100 },  // Peak load
    { duration: '5m', target: 100 },  // Sustained peak
    { duration: '2m', target: 0 },    // Ramp down
  ],
  thresholds: {
    http_req_duration: ['p(95)<500'],  // 95% under 500ms
    http_req_failed: ['rate<0.1'],     // Error rate under 10%
    errors: ['rate<0.05'],             // Custom error rate
  },
};

export default function() {
  const baseUrl = 'https://api.company.com';
  
  // Test login endpoint
  let loginRes = http.post(`${baseUrl}/auth/login`, {
    email: 'test@example.com',
    password: 'password123'
  });
  
  check(loginRes, {
    'login status is 200': (r) => r.status === 200,
    'login has token': (r) => JSON.parse(r.body).token !== undefined,
  }) || errorRate.add(1);
  
  const token = JSON.parse(loginRes.body).token;
  const headers = { Authorization: `Bearer ${token}` };
  
  // Test API endpoints
  let userRes = http.get(`${baseUrl}/users`, { headers });
  check(userRes, {
    'users status is 200': (r) => r.status === 200,
    'users response time < 200ms': (r) => r.timings.duration < 200,
  }) || errorRate.add(1);
  
  let voteRes = http.post(`${baseUrl}/votes`, {
    option_id: Math.floor(Math.random() * 4) + 1
  }, { headers });
  
  check(voteRes, {
    'vote status is 201': (r) => r.status === 201,
  }) || errorRate.add(1);
  
  sleep(1);
}
```

### Stress Test Configuration
```javascript
// stress-test.js
export let options = {
  stages: [
    { duration: '2m', target: 100 },   // Ramp to normal
    { duration: '5m', target: 200 },   // Double normal load
    { duration: '2m', target: 300 },   // Triple load
    { duration: '5m', target: 400 },   // Quad load (breaking point)
    { duration: '10m', target: 0 },    // Recovery
  ],
  thresholds: {
    http_req_duration: ['p(95)<1000'], // More relaxed thresholds
    http_req_failed: ['rate<0.2'],
  },
};
```

## Disaster Recovery Testing

### Backup Validation Script
```bash
#!/bin/bash
# backup-test.sh

set -e

echo "🔄 Starting Backup Validation Test"

# 1. Create test data
echo "📝 Creating test data..."
kubectl exec -it postgres-0 -n production -- psql -c "
  INSERT INTO test_backup (data, created_at) 
  VALUES ('backup-test-$(date +%s)', NOW());
"

# 2. Perform backup
echo "💾 Performing backup..."
kubectl exec -it postgres-0 -n production -- pg_dump myapp > backup-$(date +%Y%m%d).sql

# 3. Simulate disaster (careful!)
echo "💥 Simulating disaster (dropping test table)..."
kubectl exec -it postgres-0 -n production -- psql -c "DROP TABLE IF EXISTS test_backup;"

# 4. Restore from backup
echo "🔧 Restoring from backup..."
kubectl exec -i postgres-0 -n production -- psql < backup-$(date +%Y%m%d).sql

# 5. Verify data integrity
echo "✅ Verifying data integrity..."
RESULT=$(kubectl exec -it postgres-0 -n production -- psql -t -c "SELECT COUNT(*) FROM test_backup;")

if [ "$RESULT" -gt "0" ]; then
    echo "✅ Backup/Restore test PASSED"
else
    echo "❌ Backup/Restore test FAILED"
    exit 1
fi

echo "🎉 Backup validation completed successfully"
```

### Failover Test
```bash
#!/bin/bash
# failover-test.sh

echo "🔄 Testing High Availability Failover"

# 1. Check current primary
CURRENT_PRIMARY=$(kubectl get pods -n production -l role=primary -o name)
echo "📍 Current primary: $CURRENT_PRIMARY"

# 2. Simulate primary failure
echo "💥 Simulating primary failure..."
kubectl delete pod $CURRENT_PRIMARY -n production

# 3. Wait for failover
echo "⏳ Waiting for failover..."
sleep 30

# 4. Verify new primary
NEW_PRIMARY=$(kubectl get pods -n production -l role=primary -o name)
echo "📍 New primary: $NEW_PRIMARY"

# 5. Test connectivity
echo "🔍 Testing connectivity to new primary..."
kubectl exec -it $NEW_PRIMARY -n production -- psql -c "SELECT NOW();"

if [ $? -eq 0 ]; then
    echo "✅ Failover test PASSED"
else
    echo "❌ Failover test FAILED"
    exit 1
fi
```

## Chaos Engineering con Chaos Mesh

### Pod Failure Experiment
```yaml
# pod-chaos.yaml
apiVersion: chaos-mesh.org/v1alpha1
kind: PodChaos
metadata:
  name: api-pod-failure
  namespace: chaos-testing
spec:
  action: pod-failure
  mode: fixed-percent
  value: "30"
  duration: "5m"
  selector:
    namespaces:
      - production
    labelSelectors:
      app: api-service
  scheduler:
    cron: "@every 1h"
```

### Network Chaos
```yaml
# network-chaos.yaml
apiVersion: chaos-mesh.org/v1alpha1
kind: NetworkChaos
metadata:
  name: network-delay
  namespace: chaos-testing
spec:
  action: delay
  mode: all
  selector:
    namespaces:
      - production
    labelSelectors:
      app: api-service
  delay:
    latency: "100ms"
    correlation: "100"
    jitter: "0ms"
  duration: "10m"
```

### Resource Stress
```yaml
# stress-chaos.yaml
apiVersion: chaos-mesh.org/v1alpha1
kind: StressChaos
metadata:
  name: memory-stress
  namespace: chaos-testing
spec:
  mode: fixed-percent
  value: "50"
  selector:
    namespaces:
      - production
    labelSelectors:
      app: api-service
  stressors:
    memory:
      workers: 4
      size: "512MB"
  duration: "5m"
```

## Automatización de Tests

### CI/CD Pipeline con Tests
```yaml
# .gitlab-ci.yml
stages:
  - test
  - performance
  - chaos
  - deploy

unit_tests:
  stage: test
  script:
    - npm test
    - npm run test:coverage
  coverage: '/Coverage: \d+\.\d+%/'

integration_tests:
  stage: test
  services:
    - postgres:13
    - redis:6
  script:
    - npm run test:integration

load_tests:
  stage: performance
  image: loadimpact/k6:latest
  script:
    - k6 run --out influxdb=http://influxdb:8086/k6 load-test.js
  artifacts:
    reports:
      performance: k6-report.json
  only:
    - main

chaos_tests:
  stage: chaos
  image: chaos-mesh/chaos-mesh:latest
  script:
    - kubectl apply -f chaos-experiments/
    - sleep 300  # Let chaos run for 5 minutes
    - kubectl delete -f chaos-experiments/
  when: manual
  only:
    - main
```

## Métricas de Validación

### Performance Benchmarks
```yaml
# performance-thresholds.yaml
sla_requirements:
  response_time:
    p50: 100ms
    p95: 300ms
    p99: 500ms
  
  throughput:
    minimum_rps: 1000
    target_rps: 2000
  
  availability:
    uptime: 99.9%
    max_downtime_per_month: 43.2m
  
  error_rates:
    4xx_rate: <5%
    5xx_rate: <1%
```

### Disaster Recovery Metrics
```yaml
# dr-objectives.yaml
recovery_objectives:
  rto: # Recovery Time Objective
    database: 5m
    application: 2m
    full_system: 10m
  
  rpo: # Recovery Point Objective
    database: 1m  # Max data loss
    configs: 0m   # No config loss
  
  backup_validation:
    frequency: daily
    retention: 30d
    test_restore: weekly
```

## Scripts de Validación

### Health Check Comprehensive
```bash
#!/bin/bash
# comprehensive-health-check.sh

echo "🏥 Comprehensive System Health Check"

# 1. Infrastructure Health
echo "🔍 Checking infrastructure..."
kubectl get nodes --no-headers | while read node status; do
    if [[ $status != *"Ready"* ]]; then
        echo "❌ Node $node is not ready"
        exit 1
    fi
done

# 2. Application Health
echo "🔍 Checking applications..."
kubectl get pods -n production --field-selector=status.phase!=Running
if [ $? -eq 0 ]; then
    echo "❌ Some pods are not running"
fi

# 3. Database Connectivity
echo "🔍 Checking database..."
kubectl exec -it postgres-0 -n production -- pg_isready
if [ $? -ne 0 ]; then
    echo "❌ Database is not ready"
    exit 1
fi

# 4. API Endpoints
echo "🔍 Checking API endpoints..."
for endpoint in /health /metrics /ready; do
    status=$(curl -s -o /dev/null -w "%{http_code}" https://api.company.com$endpoint)
    if [ $status -ne 200 ]; then
        echo "❌ Endpoint $endpoint returned $status"
        exit 1
    fi
done

# 5. Monitoring Stack
echo "🔍 Checking monitoring..."
prometheus_status=$(curl -s http://prometheus:9090/-/healthy)
if [[ $prometheus_status != "Prometheus is Healthy." ]]; then
    echo "❌ Prometheus is not healthy"
    exit 1
fi

echo "✅ All health checks passed!"
```

## Métricas de Éxito Final
- **Performance**: Todos los SLOs cumplidos
- **Resilience**: 99.9% uptime durante chaos tests
- **Recovery**: RTO < 10min, RPO < 1min
- **Automation**: 100% de tests automatizados

## Notas Importantes
- Ejecutar tests en horarios de bajo tráfico
- Tener plan de rollback preparado
- Monitorear métricas durante todos los tests
- Documentar todos los hallazgos
- Usar entornos de staging para chaos engineering inicial