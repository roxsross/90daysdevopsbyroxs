---
title: Día 55 - Observabilidad en Kubernetes Local con Helm y Kind
description: Instala un stack de observabilidad en un cluster local Kind usando Helm.
sidebar_position: 6
---

## 🎯 Objetivo

Configura un stack de observabilidad (Prometheus, Grafana, Jaeger, ELK) en un cluster local Kubernetes usando Kind y Helm.

---

## ☸️ Paso 1: Prepara tu Cluster Local con Kind

Crea un cluster Kind con puertos expuestos para las herramientas de observabilidad:

`kind-config-observability.yaml`:
```yaml
kind: Cluster
apiVersion: kind.x-k8s.io/v1alpha4
name: observability-demo
nodes:
- role: control-plane
    kubeadmConfigPatches:
    - |
        kind: InitConfiguration
        nodeRegistration:
            kubeletExtraArgs:
                node-labels: "ingress-ready=true"
    extraPortMappings:
    - containerPort: 30090
        hostPort: 30090
        protocol: TCP    # Prometheus
    - containerPort: 30091
        hostPort: 30091
        protocol: TCP    # Grafana
    - containerPort: 30092
        hostPort: 30092
        protocol: TCP    # Jaeger
    - containerPort: 30093
        hostPort: 30093
        protocol: TCP    # Kibana
    - containerPort: 30094
        hostPort: 30094
        protocol: TCP    # AlertManager
- role: worker
    labels:
        tier: "monitoring"
- role: worker
    labels:
        tier: "logging"
```

```bash
kind create cluster --config kind-config-observability.yaml
kubectl get nodes -o wide --show-labels
```

---

## 📦 Paso 2: Instala Helm y Agrega Repositorios

```bash
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
helm repo add grafana https://grafana.github.io/helm-charts
helm repo add jaegertracing https://jaegertracing.github.io/helm-charts
helm repo add elastic https://helm.elastic.co
helm repo update
```

---

## 🗂️ Paso 3: Crea Namespaces

```bash
kubectl create namespace monitoring     # Prometheus, Grafana, AlertManager
kubectl create namespace tracing       # Jaeger
kubectl create namespace logging       # ELK Stack
```

---

## 📊 Paso 4: Instala Prometheus Stack

`values/prometheus-stack.yaml` (ejemplo básico):
```yaml
prometheus:
    service:
        type: NodePort
        nodePort: 30090
grafana:
    adminPassword: admin123
    service:
        type: NodePort
        nodePort: 30091
alertmanager:
    service:
        type: NodePort
        nodePort: 30094
```

```bash
helm install prometheus-stack prometheus-community/kube-prometheus-stack \
    --namespace monitoring \
    --values values/prometheus-stack.yaml \
    --wait
```

---

## 🔍 Paso 5: Instala Jaeger

`values/jaeger.yaml`:
```yaml
allInOne:
    enabled: true
    service:
        type: NodePort
        nodePort: 30092
```

```bash
helm install jaeger jaegertracing/jaeger \
    --namespace tracing \
    --values values/jaeger.yaml \
    --wait
```

---

## 📝 Paso 6: Instala ELK Stack

### Elasticsearch

`values/elasticsearch.yaml`:
```yaml
replicas: 1
resources:
    requests:
        cpu: "500m"
        memory: "1Gi"
    limits:
        cpu: "1000m"
        memory: "2Gi"
```

```bash
helm install elasticsearch elastic/elasticsearch \
    --namespace logging \
    --values values/elasticsearch.yaml \
    --wait
```

### Kibana

`values/kibana.yaml`:
```yaml
service:
    type: NodePort
    nodePort: 30093
elasticsearchHosts: "http://elasticsearch-master:9200"
```

```bash
helm install kibana elastic/kibana \
    --namespace logging \
    --values values/kibana.yaml \
    --wait
```

---

## 🌐 Acceso a las Herramientas

- **Prometheus:** http://localhost:30090
- **Grafana:** http://localhost:30091 (admin/admin123)
- **Jaeger:** http://localhost:30092
- **Kibana:** http://localhost:30093
- **AlertManager:** http://localhost:30094

---

## 🛠️ Troubleshooting

- Verifica pods: `kubectl get pods --all-namespaces`
- Verifica servicios: `kubectl get svc --all-namespaces | grep NodePort`
- Si algún pod está en Pending, revisa recursos del cluster.

---

## ✅ Resumen

- Stack de observabilidad instalado en Kubernetes local con Kind y Helm.
- Acceso a métricas, logs y traces desde tu máquina.
- Ideal para pruebas, demos y aprendizaje de observabilidad en Kubernetes.

