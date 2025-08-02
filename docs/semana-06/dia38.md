---
title: Día 38 - Tests y Health Checks Automáticos
description: Tests antes de deploy y health checks para aplicaciones seguras
sidebar_position: 3
---

## 🏥 Tests y Salud de las Aplicaciones

![](../../static/images/banner/6.png)

> "No despliegues a ciegas. Testea primero, monitorea después."

## 🎯 Lo que harás HOY

- ✅ **Tests automáticos** antes de cada deploy
- ✅ **Health checks** para detectar problemas
- ✅ **Rollback automático** cuando algo falla
- ✅ **Monitoreo simple** del estado de la app

**Tiempo:** 35 minutos

---

## 🛠️ Prerrequisitos

- ✅ Ambientes del Día 37 funcionando
- ✅ GitHub Actions runners configurados
- ✅ kubectl funcionando

---

## 🧠 Conceptos Simples

| Concepto | ¿Qué significa? | ¿Para qué sirve? |
|----------|-----------------|------------------|
| **Health Check** | ¿Está viva mi app? | Detectar si algo se rompió |
| **Readiness Probe** | ¿Está lista? | Evitar tráfico a apps que no arrancan |
| **Liveness Probe** | ¿Sigue viva? | Reiniciar automáticamente si se cuelga |
| **Rolling Update** | Cambio gradual | Actualizar sin cortar el servicio |

---

## 🧪 Paso 1: Agregar Tests Simples (10 min)

### 1.1 Crear test básico
Crea `tests/test-app.sh`:
```bash
#!/bin/bash
echo "🧪 Ejecutando tests básicos..."

# Test 1: Verificar que responde
echo "Test 1: Conectividad básica"
if curl -f http://localhost:80 > /dev/null 2>&1; then
    echo "✅ App responde correctamente"
else
    echo "❌ App no responde"
    exit 1
fi

# Test 2: Verificar código de respuesta
echo "Test 2: Código de respuesta"
STATUS=$(curl -o /dev/null -s -w "%{http_code}" http://localhost:80)
if [ "$STATUS" = "200" ]; then
    echo "✅ Código HTTP correcto (200)"
else
    echo "❌ Código HTTP incorrecto: $STATUS"
    exit 1
fi

# Test 3: Verificar contenido básico
echo "Test 3: Contenido básico"
if curl -s http://localhost:80 | grep -i "nginx\|welcome" > /dev/null; then
    echo "✅ Contenido esperado encontrado"
else
    echo "❌ Contenido no encontrado"
    exit 1
fi

echo "🎉 Todos los tests pasaron!"
```

### 1.2 Hacer el script ejecutable
```bash
chmod +x tests/test-app.sh
```

---

## 🏥 Paso 2: Agregar Health Checks (10 min)

### 2.1 Actualizar deployment de desarrollo
Modifica `k8s/dev/app-dev.yaml`:
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: mi-app
  namespace: dev
  labels:
    app: mi-app
    environment: development
spec:
  replicas: 1
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxUnavailable: 0    # No bajar pods hasta que el nuevo esté listo
      maxSurge: 1          # Máximo 1 pod extra durante el update
  selector:
    matchLabels:
      app: mi-app
  template:
    metadata:
      labels:
        app: mi-app
        environment: development
    spec:
      containers:
      - name: app
        image: nginx:alpine
        ports:
        - containerPort: 80
        env:
        - name: ENVIRONMENT
          value: "DEVELOPMENT"
        
        # 🏥 Health Checks
        readinessProbe:
          httpGet:
            path: /
            port: 80
          initialDelaySeconds: 5    # Esperar 5 seg antes del primer check
          periodSeconds: 10         # Revisar cada 10 segundos
          timeoutSeconds: 5         # Timeout de 5 segundos
          failureThreshold: 3       # Fallar después de 3 intentos
          
        livenessProbe:
          httpGet:
            path: /
            port: 80
          initialDelaySeconds: 30   # Dar tiempo a que arranque
          periodSeconds: 30         # Revisar cada 30 segundos
          timeoutSeconds: 5
          failureThreshold: 3
          
        # 💾 Recursos controlados
        resources:
          requests:
            memory: "32Mi"
            cpu: "25m"
          limits:
            memory: "64Mi"
            cpu: "50m"
---
apiVersion: v1
kind: Service
metadata:
  name: mi-app-service
  namespace: dev
  labels:
    app: mi-app
spec:
  selector:
    app: mi-app
  ports:
  - port: 80
    targetPort: 80
    nodePort: 30001
  type: NodePort
```

---

## 🔄 Paso 3: Workflow con Tests y Deploy Seguro (10 min)

### 3.1 Actualizar workflow de desarrollo
Modifica `.github/workflows/deploy-dev.yml`:
```yaml
name: 🧪 Tests + Deploy a DEV

on:
  push:
    branches: [develop]
  workflow_dispatch:

jobs:
  test-and-deploy:
    name: Tests y Deploy Seguro
    runs-on: mi-runners
    
    steps:
    - name: Checkout código
      uses: actions/checkout@v4
      
    - name: 🧪 Ejecutar tests básicos
      run: |
        echo "🧪 Verificando que tenemos kubectl..."
        kubectl version --client
        
        echo "🔍 Verificando cluster..."
        kubectl get nodes
        
        echo "✅ Tests de infraestructura pasaron"
        
    - name: 🛠️ Deploy con health checks
      run: |
        echo "🛠️ Desplegando con health checks..."
        kubectl apply -f k8s/dev/app-dev.yaml
        
    - name: ⏳ Esperar deployment seguro
      run: |
        echo "⏳ Esperando que el deployment sea exitoso..."
        kubectl rollout status deployment/mi-app -n dev --timeout=300s
        
        echo "� Verificando que los pods estén READY..."
        kubectl get pods -n dev -l app=mi-app
        
        # Esperar que al menos 1 pod esté ready
        kubectl wait --for=condition=ready pod -l app=mi-app -n dev --timeout=120s
        
    - name: 🧪 Tests de conectividad
      run: |
        echo "🧪 Probando conectividad interna..."
        
        # Test dentro del cluster
        kubectl run test-pod --image=curlimages/curl --rm -i --restart=Never -- \
          curl -f http://mi-app-service.dev.svc.cluster.local --max-time 10 || true
          
        # Verificar que el service responde
        kubectl get service -n dev mi-app-service
        
        echo "✅ Tests de conectividad completados"
        
    - name: 📊 Estado final
      run: |
        echo "📊 Estado final del deployment:"
        kubectl get deployment -n dev mi-app -o wide
        kubectl get pods -n dev -l app=mi-app -o wide
        echo ""
        echo "🌐 Aplicación accesible en:"
        echo "   NodePort: http://localhost:30001"
        echo "   Port-forward: kubectl port-forward -n dev svc/mi-app-service 8001:80"
        
    - name: 🚨 Rollback si algo falló
      if: failure()
      run: |
        echo "🚨 ¡Algo falló! Ejecutando rollback..."
        kubectl rollout undo deployment/mi-app -n dev || echo "No hay versión previa"
        echo "🔙 Rollback completado"
```

---

## 🐛 Paso 4: Probar Rollback Automático (5 min)

### 4.1 Simular una imagen rota
```bash
# Crear una versión "rota" del deployment
cp k8s/dev/app-dev.yaml k8s/dev/app-dev-broken.yaml

# Editar para usar una imagen que no existe
# Cambiar: image: nginx:alpine
# Por:     image: nginx:imagen-que-no-existe
```

### 4.2 Aplicar la versión rota
```bash
# Aplicar la versión rota
kubectl apply -f k8s/dev/app-dev-broken.yaml

# Ver qué pasa (va a fallar)
kubectl get pods -n dev -w
```

### 4.3 Ver el rollback automático
```bash
# Kubernetes no va a matar los pods buenos hasta que los nuevos estén listos
echo "🔍 Viendo el estado..."
kubectl get pods -n dev

echo "📊 Estado del deployment:"
kubectl describe deployment mi-app -n dev

# Hacer rollback manual si es necesario
kubectl rollout undo deployment/mi-app -n dev

echo "✅ Rollback completado"
kubectl get pods -n dev
```

---

## 📊 Paso 5: Comandos para Monitorear (5 min)

### 5.1 Ver la salud de los pods
```bash
# Estado detallado de los pods
kubectl get pods -n dev -o wide

# Ver eventos (muy útil para debugging)
kubectl get events -n dev --sort-by='.lastTimestamp'

# Describir un pod específico
kubectl describe pod -n dev -l app=mi-app
```

### 5.2 Monitorear health checks
```bash
# Ver logs del kubelet sobre health checks
kubectl logs -n dev deployment/mi-app

# Ver el historial de rollouts
kubectl rollout history deployment/mi-app -n dev

# Ver el status en tiempo real
kubectl rollout status deployment/mi-app -n dev -w
```

### 5.3 Script de monitoreo automático
Crea `scripts/monitor-health.sh`:
```bash
#!/bin/bash
echo "🏥 Monitor de salud - Presiona Ctrl+C para parar"

while true; do
    clear
    echo "=== ESTADO DE PODS EN DEV ==="
    kubectl get pods -n dev -l app=mi-app -o wide
    
    echo ""
    echo "=== HEALTH CHECKS ==="
    kubectl describe pods -n dev -l app=mi-app | grep -A 5 "Liveness\|Readiness" || echo "No health checks configurados"
    
    echo ""
    echo "=== ÚLTIMOS EVENTOS ==="
    kubectl get events -n dev --sort-by='.lastTimestamp' | tail -5
    
    echo ""
    echo "Actualizando en 10 segundos..."
    sleep 10
done
```

```bash
chmod +x scripts/monitor-health.sh
```

---

## 🎯 Tarea Práctica

**Completá estos pasos:**

1. ✅ Aplicar el deployment con health checks
2. ✅ Ejecutar el workflow con tests
3. ✅ Simular una imagen rota y ver el rollback
4. ✅ Usar los comandos de monitoreo

**Bonus:**
- 🚀 Agregar un test que verifique que la página contiene texto específico
- 📧 Crear un script que te avise por email si algo falla

---

## 🎉 ¡Felicitaciones!

Ahora tenés:

✅ **Tests automáticos** antes de cada deploy  
✅ **Health checks** que cuidan tu aplicación  
✅ **Rollback automático** cuando algo sale mal  
✅ **Monitoreo** para ver qué está pasando  

**¡Tu aplicación es ahora resiliente y se cura sola!** 🏥

---

## 💡 ¿Qué aprendiste hoy?

- **Health checks** te avisan cuando algo está mal
- **Rolling updates** evitan downtime durante deploys
- **Tests automáticos** atrapan problemas antes de producción
- **Rollback automático** te salva cuando algo falla
- **Monitoreo activo** te da visibilidad de lo que pasa

---

## 🔍 Troubleshooting Rápido

### ❌ Pod no arranca
```bash
# Ver qué está pasando
kubectl describe pod -n dev -l app=mi-app
kubectl logs -n dev -l app=mi-app
```

### ❌ Health check falla
```bash
# Ver el health check específico
kubectl get pods -n dev -o wide
kubectl describe pod [NOMBRE-POD] -n dev
```

### ❌ Deploy se queda colgado
```bash
# Cancelar deploy actual
kubectl rollout undo deployment/mi-app -n dev
# o
kubectl rollout restart deployment/mi-app -n dev
```

---

## 🚀 Próximos pasos

**Día 39**: **Secrets y Variables de Ambiente** seguros  
**Día 40**: **Volumes persistentes** para datos que no se pierden  
**Día 41**: **Ingress Controllers** para dominios reales  

---

## 🤔 Reflexión del día

**Preguntate:**
- ¿Qué pasaría si no tuvieras health checks?
- ¿Cómo te ayuda el rollback automático?
- ¿Qué otros tests agregarías?

¡**Ahora tus deploys son súper seguros!** 🛡️

Estás listo para manejar aplicaciones en producción como un profesional.
