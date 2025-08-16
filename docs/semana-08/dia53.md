---
title: Día 53 - Observabilidad en Kubernetes con Prometheus Operator
description: Del Docker Compose al cluster K8s con service discovery automático
sidebar_position: 4
---

## ☸️ Observabilidad a Escala Kubernetes

![](../../static/images/banner/8.png)

> "Kubernetes cambia el juego completamente. Los pods nacen y mueren, las IPs cambian... ¿cómo monitoreás algo que **cambia constantemente**? 🔄"

### 🎯 **Meta del día:**
- ✅ Migrar la app del Día 52 a Kubernetes
- ✅ Prometheus Operator funcionando con service discovery
- ✅ Monitorear cluster K8s + tu aplicación juntos
- ✅ Entender: observabilidad dinámica vs estática

---

## 🤔 **¿Por qué K8s es Diferente para Observabilidad?**

### **Docker Compose (ayer):**
```
app:5000  ← IP fija, siempre ahí
prometheus:9090  ← Configuro targets manualmente
grafana:3000  ← Todo estático
```

### **Kubernetes (hoy):**
```
pod-app-abc123 (IP: 10.244.1.15) ← Puede morir
pod-app-def456 (IP: 10.244.2.23) ← IP cambia
pod-app-ghi789 (IP: 10.244.1.31) ← Se autoscalea
```

**El desafío:** ¿Cómo configuro Prometheus para monitorear algo que cambia todo el tiempo?

**La solución:** **Service Discovery** + **Prometheus Operator** 🎯

---

## 🏗️ **Paso 1: Preparar el Cluster Local**

### **Opción A: Kind (Recomendado)**

`kind-config.yaml`:
```yaml
kind: Cluster
apiVersion: kind.x-k8s.io/v1alpha4
name: observability-cluster
nodes:
- role: control-plane
  kubeadmConfigPatches:
  - |
    kind: InitConfiguration
    nodeRegistration:
      kubeletExtraArgs:
        node-labels: "ingress-ready=true"
  extraPortMappings:
  - containerPort: 80
    hostPort: 80
    protocol: TCP
  - containerPort: 443
    hostPort: 443
    protocol: TCP
  - containerPort: 30000
    hostPort: 30000
    protocol: TCP
  - containerPort: 30001
    hostPort: 30001
    protocol: TCP
  - containerPort: 30002
    hostPort: 30002
    protocol: TCP
- role: worker
  labels:
    tier: "monitoring"
- role: worker
  labels:
    tier: "apps"
```

```bash
# Crear cluster
kind create cluster --config kind-config.yaml

# Verificar
kubectl get nodes -o wide
kubectl cluster-info
```

### **Opción B: Minikube**
```bash
minikube start --cpus=4 --memory=8192 --driver=docker
minikube addons enable metrics-server
```

---

## 📦 **Paso 2: Instalar Prometheus Operator Stack**

### **¿Qué es Prometheus Operator?**
- **Operador** que maneja Prometheus como "ciudadano nativo" de K8s
- **Service discovery** automático
- **CRDs** para configurar todo con YAML
- **Stack completo**: Prometheus + Grafana + AlertManager

### **Instalación con Helm:**

```bash
# Agregar repo de Prometheus Community
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
helm repo update

# Crear namespace
kubectl create namespace monitoring

# Instalar stack completo
helm install kube-prometheus prometheus-community/kube-prometheus-stack \
  --namespace monitoring \
  --set prometheus.service.type=NodePort \
  --set prometheus.service.nodePort=30000 \
  --set grafana.service.type=NodePort \
  --set grafana.service.nodePort=30001 \
  --set alertmanager.service.type=NodePort \
  --set alertmanager.service.nodePort=30002 \
  --set grafana.adminPassword=admin123 \
  --wait

# Verificar instalación
kubectl get pods -n monitoring
```

**Deberías ver pods como:**
```
prometheus-kube-prometheus-prometheus-0
kube-prometheus-grafana-xxx
alertmanager-kube-prometheus-alertmanager-0
kube-prometheus-kube-state-metrics-xxx
kube-prometheus-prometheus-node-exporter-xxx
```

---

## 🚀 **Paso 3: Acceder a las Interfaces**

### **URLs de acceso:**
```bash
# Grafana
echo "Grafana: http://localhost:30001"
echo "Usuario: admin, Password: admin123"

# Prometheus
echo "Prometheus: http://localhost:30000"

# AlertManager  
echo "AlertManager: http://localhost:30002"
```

### **Port forwarding alternativo:**
```bash
# Si NodePort no funciona, usar port-forward
kubectl port-forward -n monitoring svc/kube-prometheus-grafana 3000:80 &
kubectl port-forward -n monitoring svc/kube-prometheus-prometheus 9090:9090 &
```

---

## 🏗️ **Paso 4: Desplegar Tu App en Kubernetes**

### **Preparar archivos de la app:**

`app-namespace.yaml`:
```yaml
apiVersion: v1
kind: Namespace
metadata:
  name: mi-app
  labels:
    monitoring: "enabled"
```

`app-deployment.yaml`:
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: mi-app
  namespace: mi-app
  labels:
    app: mi-app
spec:
  replicas: 3  # Múltiples instancias para ver service discovery
  selector:
    matchLabels:
      app: mi-app
  template:
    metadata:
      labels:
        app: mi-app
      annotations:
        prometheus.io/scrape: "true"
        prometheus.io/port: "5000"
        prometheus.io/path: "/metrics"
    spec:
      containers:
      - name: app
        image: python:3.11-slim
        ports:
        - containerPort: 5000
          name: http-metrics
        command: ["/bin/bash"]
        args:
          - -c
          - |
            pip install flask prometheus-client requests
            cat > app.py << 'EOF'
            from flask import Flask, jsonify, request
            from prometheus_client import Counter, Histogram, Gauge, generate_latest
            import time
            import random
            import threading
            import os

            app = Flask(__name__)

            # Métricas con labels de pod/namespace
            requests_total = Counter('app_requests_total', 'Total requests', 
                                   ['method', 'endpoint', 'status', 'pod', 'namespace'])
            request_duration = Histogram('app_request_duration_seconds', 'Request duration', 
                                       ['endpoint', 'pod'])
            active_users = Gauge('app_active_users', 'Currently active users', ['pod'])
            errors_total = Counter('app_errors_total', 'Total errors', 
                                 ['endpoint', 'error_type', 'pod'])

            # Info del pod
            POD_NAME = os.environ.get('HOSTNAME', 'unknown')
            NAMESPACE = os.environ.get('NAMESPACE', 'default')

            def simulate_users():
                while True:
                    active_users.labels(pod=POD_NAME).set(random.randint(5, 50))
                    time.sleep(10)

            threading.Thread(target=simulate_users, daemon=True).start()

            @app.route('/metrics')
            def metrics():
                return generate_latest()

            @app.route('/')
            def home():
                start_time = time.time()
                requests_total.labels(method='GET', endpoint='/', status='200', 
                                     pod=POD_NAME, namespace=NAMESPACE).inc()
                time.sleep(random.uniform(0.1, 0.5))
                request_duration.labels(endpoint='/', pod=POD_NAME).observe(time.time() - start_time)
                
                return jsonify({
                    "message": f"¡Hola desde pod {POD_NAME}!",
                    "pod": POD_NAME,
                    "namespace": NAMESPACE,
                    "timestamp": time.time()
                })

            @app.route('/api/users')
            def get_users():
                start_time = time.time()
                
                if random.random() < 0.1:
                    errors_total.labels(endpoint='/api/users', error_type='database_timeout', 
                                      pod=POD_NAME).inc()
                    requests_total.labels(method='GET', endpoint='/api/users', status='500',
                                        pod=POD_NAME, namespace=NAMESPACE).inc()
                    request_duration.labels(endpoint='/api/users', pod=POD_NAME).observe(time.time() - start_time)
                    return jsonify({"error": "Database timeout"}), 500
                
                time.sleep(random.uniform(0.2, 1.0))
                requests_total.labels(method='GET', endpoint='/api/users', status='200',
                                    pod=POD_NAME, namespace=NAMESPACE).inc()
                request_duration.labels(endpoint='/api/users', pod=POD_NAME).observe(time.time() - start_time)
                
                return jsonify({
                    "users": [{"id": 1, "name": "Juan", "pod": POD_NAME}],
                    "served_by": POD_NAME
                })

            @app.route('/health')
            def health():
                return jsonify({"status": "UP", "pod": POD_NAME})

            if __name__ == '__main__':
                app.run(host='0.0.0.0', port=5000)
            EOF
            python app.py
        env:
        - name: NAMESPACE
          valueFrom:
            fieldRef:
              fieldPath: metadata.namespace
        resources:
          requests:
            memory: "128Mi"
            cpu: "100m"
          limits:
            memory: "256Mi"
            cpu: "200m"
        livenessProbe:
          httpGet:
            path: /health
            port: 5000
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /health
            port: 5000
          initialDelaySeconds: 5
          periodSeconds: 5
```

`app-service.yaml`:
```yaml
apiVersion: v1
kind: Service
metadata:
  name: mi-app-service
  namespace: mi-app
  labels:
    app: mi-app
  annotations:
    prometheus.io/scrape: "true"
    prometheus.io/port: "5000"
    prometheus.io/path: "/metrics"
spec:
  type: NodePort
  ports:
  - port: 80
    targetPort: 5000
    nodePort: 30080
    name: http
  selector:
    app: mi-app
```

### **Desplegar la app:**
```bash
kubectl apply -f app-namespace.yaml
kubectl apply -f app-deployment.yaml
kubectl apply -f app-service.yaml

# Verificar
kubectl get pods -n mi-app -o wide
kubectl get svc -n mi-app

# Probar la app
curl http://localhost:30080/
curl http://localhost:30080/api/users
```

---

## 🔍 **Paso 5: Configurar Service Discovery**

### **ServiceMonitor para tu app:**

`app-servicemonitor.yaml`:
```yaml
apiVersion: monitoring.coreos.com/v1
kind: ServiceMonitor
metadata:
  name: mi-app-metrics
  namespace: mi-app
  labels:
    app: mi-app
    release: kube-prometheus  # Label importante para que Prometheus lo encuentre
spec:
  selector:
    matchLabels:
      app: mi-app
  endpoints:
  - port: http
    path: /metrics
    interval: 5s
    scrapeTimeout: 3s
  namespaceSelector:
    matchNames:
    - mi-app
```

```bash
kubectl apply -f app-servicemonitor.yaml

# Verificar que se creó
kubectl get servicemonitor -n mi-app
```

### **Verificar en Prometheus:**
- Ve a: `http://localhost:30000`
- **Status → Targets**
- Buscar `serviceMonitor/mi-app/mi-app-metrics/0`
- Debe estar **UP** (verde) ✅

---

## 📊 **Paso 6: Dashboards K8s + App en Grafana**

Ve a Grafana: `http://localhost:30001` (admin/admin123)

### **Dashboards Pre-instalados:**
1. **Kubernetes / Compute Resources / Cluster**
2. **Kubernetes / Compute Resources / Namespace (Pods)**
3. **Node Exporter / Nodes**

### **Crear Dashboard Custom para tu App:**

**Panel 1: Requests por Pod**
```promql
rate(app_requests_total[1m]) by (pod, endpoint, status)
```

**Panel 2: Response Time por Pod**
```promql
histogram_quantile(0.95, rate(app_request_duration_seconds_bucket[1m]) by (le, pod, endpoint))
```

**Panel 3: Active Users por Pod**
```promql
app_active_users by (pod)
```

**Panel 4: Pods Running**
```promql
up{job="mi-app-metrics"} by (pod)
```

**Panel 5: Memory Usage por Pod (K8s metrics)**
```promql
container_memory_working_set_bytes{namespace="mi-app", container="app"} / 1024 / 1024
```

**Panel 6: CPU Usage por Pod (K8s metrics)**
```promql
rate(container_cpu_usage_seconds_total{namespace="mi-app", container="app"}[1m]) * 100
```

---

## 🧪 **Paso 7: Load Testing en K8s**

### **Deployment de Load Tester:**

`load-tester.yaml`:
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: load-tester
  namespace: mi-app
spec:
  replicas: 1
  selector:
    matchLabels:
      app: load-tester
  template:
    metadata:
      labels:
        app: load-tester
    spec:
      containers:
      - name: load-tester
        image: curlimages/curl
        command: ["/bin/sh"]
        args:
          - -c
          - |
            while true; do
              echo "🚀 Generando load test..."
              for i in $(seq 1 20); do
                curl -s http://mi-app-service.mi-app.svc.cluster.local/ > /dev/null &
                curl -s http://mi-app-service.mi-app.svc.cluster.local/api/users > /dev/null &
              done
              wait
              echo "💤 Esperando 10s..."
              sleep 10
            done
        resources:
          requests:
            memory: "64Mi"
            cpu: "50m"
          limits:
            memory: "128Mi"
            cpu: "100m"
```

```bash
kubectl apply -f load-tester.yaml

# Ver logs del load tester
kubectl logs -f deployment/load-tester -n mi-app
```

### **Manual Load Testing:**
```bash
# Desde tu máquina
for i in {1..100}; do
  curl -s http://localhost:30080/ > /dev/null &
  curl -s http://localhost:30080/api/users > /dev/null &
done

# Ver en tiempo real qué pod responde
for i in {1..10}; do
  curl http://localhost:30080/ | jq .pod
done
```

---

## ⚡ **Paso 8: Scaling y Service Discovery en Acción**

### **Escalar la app y ver service discovery:**

```bash
# Escalar a 5 replicas
kubectl scale deployment mi-app --replicas=5 -n mi-app

# Ver pods nuevos apareciendo
kubectl get pods -n mi-app -w

# En Prometheus, ver nuevos targets apareciendo automáticamente
# http://localhost:30000/targets
```

### **Probar failover:**
```bash
# Eliminar un pod específico
kubectl delete pod $(kubectl get pods -n mi-app -l app=mi-app -o jsonpath='{.items[0].metadata.name}') -n mi-app

# Ver en Grafana cómo el pod desaparece de las métricas
# Y cómo K8s crea uno nuevo automáticamente
```

### **HorizontalPodAutoscaler (HPA):**
```yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: mi-app-hpa
  namespace: mi-app
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: mi-app
  minReplicas: 2
  maxReplicas: 10
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 70
```

```bash
kubectl apply -f - <<EOF
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: mi-app-hpa
  namespace: mi-app
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: mi-app
  minReplicas: 2
  maxReplicas: 10
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 70
EOF

# Ver HPA en acción
kubectl get hpa -n mi-app -w
```

---

## 🔍 **Paso 9: Queries PromQL Específicas de K8s**

### **Métricas de tu App + K8s Context:**

```promql
# Request rate con info de namespace y pod
rate(app_requests_total[1m]) by (namespace, pod, endpoint)

# Memory usage de tu app
container_memory_working_set_bytes{namespace="mi-app", container="app"} / 1024 / 1024

# CPU throttling (importante en K8s)
rate(container_cpu_cfs_throttled_seconds_total{namespace="mi-app"}[1m])

# Network I/O por pod
rate(container_network_receive_bytes_total{namespace="mi-app"}[1m])

# Filesystem usage por pod  
container_fs_usage_bytes{namespace="mi-app"} / container_fs_limit_bytes{namespace="mi-app"}
```

### **Métricas del Cluster:**

```promql
# Pods por estado
kube_pod_status_phase by (phase)

# Nodes ready
kube_node_status_condition{condition="Ready", status="true"}

# Deployments con réplicas deseadas vs disponibles
kube_deployment_status_replicas_available / kube_deployment_status_replicas

# Top namespaces por CPU
topk(5, sum(rate(container_cpu_usage_seconds_total[1m])) by (namespace))

# Top pods por memoria
topk(10, container_memory_working_set_bytes{container!=""})
```

---

## 🚨 **Paso 10: Alertas para K8s**

### **AlertingRule para tu app:**

`app-alerts.yaml`:
```yaml
apiVersion: monitoring.coreos.com/v1
kind: PrometheusRule
metadata:
  name: mi-app-alerts
  namespace: mi-app
  labels:
    prometheus: kube-prometheus
    role: alert-rules
spec:
  groups:
  - name: mi-app.rules
    rules:
    - alert: AppHighErrorRate
      expr: rate(app_requests_total{status!="200"}[5m]) / rate(app_requests_total[5m]) > 0.1
      for: 2m
      labels:
        severity: warning
      annotations:
        summary: "Alta tasa de errores en {{ $labels.namespace }}/{{ $labels.pod }}"
        description: "La app tiene {{ $value | humanizePercentage }} de errores en los últimos 5 minutos."

    - alert: AppHighLatency
      expr: histogram_quantile(0.95, rate(app_request_duration_seconds_bucket[5m])) > 1
      for: 2m
      labels:
        severity: warning
      annotations:
        summary: "Alta latencia en {{ $labels.namespace }}/{{ $labels.pod }}"
        description: "P95 latency es {{ $value }}s, superior al umbral de 1s."

    - alert: AppDown
      expr: up{job="mi-app-metrics"} == 0
      for: 1m
      labels:
        severity: critical
      annotations:
        summary: "App caída en {{ $labels.namespace }}"
        description: "El pod {{ $labels.instance }} no está respondiendo a health checks."

    - alert: PodCrashLooping
      expr: rate(kube_pod_container_status_restarts_total{namespace="mi-app"}[5m]) > 0
      for: 2m
      labels:
        severity: critical
      annotations:
        summary: "Pod reiniciándose constantemente"
        description: "El pod {{ $labels.pod }} se está reiniciando frecuentemente."
```

```bash
kubectl apply -f app-alerts.yaml

# Verificar alertas en Prometheus
# http://localhost:30000/alerts
```

---

## 🛠️ **Troubleshooting Específico de K8s**

### **❌ "ServiceMonitor no aparece en targets"**
```bash
# 1. Verificar labels del ServiceMonitor
kubectl get servicemonitor -n mi-app -o yaml

# 2. Verificar que Prometheus pueda acceder al namespace
kubectl get prometheus -n monitoring -o yaml | grep -A 5 serviceMonitorNamespaceSelector

# 3. Verificar logs de Prometheus
kubectl logs -n monitoring prometheus-kube-prometheus-prometheus-0
```

### **❌ "No veo métricas de mi app"**
```bash
# 1. Verificar que el pod expone métricas
kubectl port-forward -n mi-app deployment/mi-app 5000:5000 &
curl http://localhost:5000/metrics

# 2. Verificar annotations del Service
kubectl get svc mi-app-service -n mi-app -o yaml

# 3. Verificar que ServiceMonitor matchea el Service
kubectl get svc,servicemonitor -n mi-app --show-labels
```

### **❌ "Pods no se están auto-descubriendo"**
```bash
# Prometheus debe tener permisos para leer ServiceMonitors
kubectl get clusterrole prometheus-kube-prometheus-prometheus -o yaml
```

---

## 📚 **Conceptos K8s + Observabilidad que Aprendiste**

### **1. Service Discovery Dinámico:**
- ServiceMonitor CRD
- Labels y selectors
- Auto-discovery de pods

### **2. Prometheus Operator:**
- CRDs: Prometheus, ServiceMonitor, PrometheusRule
- Operador maneja la config automáticamente
- Declarativo vs imperativo

### **3. Multi-dimensionalidad:**
- Métricas por pod, namespace, container
- Correlación entre app y infraestructura
- Scaling horizontal visible en métricas

### **4. Cloud Native Monitoring:**
- Ephemeral infrastructure
- Immutable deployments
- Auto-scaling observado

---

## 🧠 **Revisión del Día**

| Concepto | ¿Lo lograste? | Notas |
|----------|---------------|-------|
| Prometheus Operator instalado | ✔️ / ❌ | |
| App desplegada en K8s con métricas | ✔️ / ❌ | |
| ServiceMonitor funcionando | ✔️ / ❌ | |
| Dashboards combinando app + K8s | ✔️ / ❌ | |
| Service discovery en acción | ✔️ / ❌ | |
| Scaling observado en tiempo real | ✔️ / ❌ | |

---

## 🎯 **Challenges Avanzados**

### **Challenge 1: Multi-Environment**
Desplegá la misma app en 2 namespaces (`staging` y `production`) y diferenciá métricas.

### **Challenge 2: Custom Resource Monitoring**
Monitoreá el HPA y crea alertas cuando escale automáticamente.

### **Challenge 3: Cross-Service Dependencies**
Agregá una segunda app que haga requests a la primera y trackeá dependencies.

---

## 💡 **Pro Tips K8s + Observabilidad**

### **🏷️ Labels Strategy:**
- Usar labels consistentes (`app`, `version`, `environment`)
- No usar labels de alta cardinalidad (`user_id`, `request_id`)
- Labels permiten filtros poderosos en PromQL

### **📊 Dashboard Organization:**
- **Cluster level**: Nodes, namespaces, overall health
- **Namespace level**: Deployments, services, resources
- **Application level**: Business metrics, custom KPIs

### **⚡ Performance en K8s:**
- ServiceMonitor interval balanceado (5-30s)
- Usar `relabelings` para optimizar labels
- Monitoring puede ser resource-intensive

### **🔒 Security:**
- RBAC para ServiceMonitors
- Network policies para Prometheus
- Secrets para configuración sensible

---

## 🚀 **¿Qué Sigue Mañana?**

**Día 54: Alerting Avanzado y SRE Practices**
- AlertManager configuración avanzada
- SLIs, SLOs y Error Budgets
- Incident Response y Runbooks
- Integration con Slack/PagerDuty

### **Mantener el cluster corriendo:**
```bash
# Este cluster lo vamos a usar mañana
# Dejá todo funcionando para continuar
kubectl get all -A
```

---

## 🎉 **¡Enorme Salto Profesional!**

Hoy cruzaste la línea de **hobby** a **enterprise-grade**:

✅ **Service Discovery automático** - Como usan Netflix/Spotify
✅ **Kubernetes-native monitoring** - Prometheus Operator
✅ **Observabilidad dinámica** - Pods que nacen/mueren automáticamente
✅ **Multi-dimensional metrics** - App + Infrastructure juntos
✅ **Auto-scaling observado** - HPA con métricas en tiempo real
✅ **Production-ready setup** - Lo mismo que clusters de millones de usuarios

**Skill Level:** De "sé Docker" a **"sé observabilidad a escala K8s"** 📈

Esto te pone en el **top 5%** de engineers que dominan observabilidad cloud-native.

📸 **Compartí tu cluster K8s con observabilidad #DevOpsConRoxs - Día 53**

¡Mañana agregamos alerting inteligente y prácticas SRE! 🚨📊