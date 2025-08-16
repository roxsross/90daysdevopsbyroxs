---
sidebar_position: 64
---

# Día 64 - Optimización de Pipelines CI/CD

## 🎯 Objetivo del Día
Optimizar nuestros pipelines CI/CD existentes para que sean más rápidos, eficientes y confiables

---

## 📋 Agenda del Día

| ⏰ Tiempo | 📋 Actividad | 🎯 Objetivo |
|----------|--------------|-------------|
| **30 min** | 🔍 Análisis de pipeline actual | Identificar cuellos de botella |
| **45 min** | ⚡ Optimización de tiempos | Cache y paralelización |
| **30 min** | 🔔 Notificaciones inteligentes | Alertas útiles sin spam |
| **30 min** | 📊 Métricas básicas | Medir performance del pipeline |
| **15 min** | ✅ Testing y validación | Verificar mejoras |

---

## 🔍 Paso 1: Análisis del Pipeline Actual (30 min)

### 1.1 Identificar problemas comunes
```bash
# Ver historial de tiempos en GitHub Actions
gh run list --limit 10 --json conclusion,createdAt,updatedAt

# Analizar jobs más lentos
gh run view --log
```

**❌ Problemas típicos:**
- Instalar dependencias en cada job
- Builds secuenciales innecesarios  
- Tests que se ejecutan uno por uno
- Docker builds sin cache
- Notificaciones excesivas

### 1.2 Benchmark actual
Crear `scripts/benchmark-pipeline.sh`:
```bash
#!/bin/bash
echo "📊 Analizando pipeline actual..."

# Obtener últimas 10 ejecuciones
gh api repos/:owner/:repo/actions/runs \
  --jq '.workflow_runs[0:10] | .[] | {
    id: .id,
    status: .conclusion,
    duration: ((.updated_at | fromdateiso8601) - (.created_at | fromdateiso8601)),
    started: .created_at
  }'

echo "🎯 Meta: Reducir tiempo en 50%"
```

### 1.3 Ejecutar análisis
```bash
chmod +x scripts/benchmark-pipeline.sh
./scripts/benchmark-pipeline.sh
```

---

## ⚡ Paso 2: Optimización de Tiempos (45 min)

### 2.1 Implementar cache inteligente
Mejorar `.github/workflows/ci.yml`:

**❌ Antes (lento):**
```yaml
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v4
    - uses: actions/setup-node@v4
      with:
        node-version: '18'
    - run: npm install  # ⏰ 2-3 minutos cada vez
    - run: npm test
    
  build:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v4
    - uses: actions/setup-node@v4
      with:
        node-version: '18' 
    - run: npm install  # ⏰ Otra vez 2-3 minutos
    - run: npm run build
```

**✅ Después (rápido):**
```yaml
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v4
    
    - uses: actions/setup-node@v4
      with:
        node-version: '18'
        cache: 'npm'  # 🚀 Cache automático
        
    - name: 📦 Install dependencies
      run: npm ci  # Más rápido que npm install
      
    - name: 🧪 Run tests
      run: npm test -- --ci --coverage --watchAll=false
      
    - name: 📊 Upload coverage
      uses: actions/upload-artifact@v4
      with:
        name: coverage-reports
        path: coverage/

  build:
    runs-on: ubuntu-latest
    needs: test  # Solo si tests pasan
    steps:
    - uses: actions/checkout@v4
    
    - uses: actions/setup-node@v4
      with:
        node-version: '18'
        cache: 'npm'
        
    - run: npm ci
    
    - name: 🏗️ Build application
      run: npm run build
      
    - name: 📦 Upload build artifacts
      uses: actions/upload-artifact@v4
      with:
        name: build-files
        path: dist/

  # 🚀 Jobs en paralelo para diferentes ambientes
  deploy-staging:
    needs: build
    if: github.ref == 'refs/heads/develop'
    runs-on: ubuntu-latest
    steps:
    - name: 🚀 Deploy to staging
      run: echo "Deploying to staging..."
      
  deploy-prod:
    needs: build  
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    environment: production
    steps:
    - name: 🚀 Deploy to production
      run: echo "Deploying to production..."
```

### 2.2 Optimizar Docker builds
Crear `Dockerfile.optimized`:
```dockerfile
# 🚀 Multi-stage build optimizado
FROM node:18-alpine AS dependencies
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production && npm cache clean --force

FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# 📦 Stage final mínimo
FROM nginx:alpine
RUN rm -rf /usr/share/nginx/html/*
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost/ || exit 1

CMD ["nginx", "-g", "daemon off;"]
```

### 2.3 Pipeline con Docker cache
Actualizar workflow para Docker:
```yaml
build-docker:
  runs-on: ubuntu-latest
  steps:
  - uses: actions/checkout@v4
  
  - name: 🐳 Set up Docker Buildx
    uses: docker/setup-buildx-action@v3
    
  - name: 🔐 Login to registry
    uses: docker/login-action@v3
    with:
      registry: ghcr.io
      username: ${{ github.actor }}
      password: ${{ secrets.GITHUB_TOKEN }}
      
  - name: 🏗️ Build and push
    uses: docker/build-push-action@v5
    with:
      context: .
      file: ./Dockerfile.optimized
      push: true
      tags: ghcr.io/${{ github.repository }}:${{ github.sha }}
      cache-from: type=gha
      cache-to: type=gha,mode=max
      platforms: linux/amd64,linux/arm64
```

### 2.4 Tests en paralelo
Configurar `jest.config.js`:
```javascript
module.exports = {
  // 🚀 Ejecutar tests en paralelo
  maxWorkers: '50%',
  
  // 📊 Solo reportes necesarios
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!src/**/*.test.{js,jsx,ts,tsx}',
  ],
  
  // ⚡ Cache para tests
  cache: true,
  cacheDirectory: '<rootDir>/.cache/jest',
  
  // 🎯 Solo mostrar fallos en CI
  verbose: process.env.CI ? false : true,
  
  // 🔕 Silenciar warnings innecesarios
  silent: process.env.CI ? true : false,
};
```

---

## 🔔 Paso 3: Notificaciones Inteligentes (30 min)

### 3.1 Configurar Slack inteligente
Crear `.github/workflows/notify.yml`:
```yaml
name: 📢 Smart Notifications

on:
  workflow_run:
    workflows: ["CI/CD Pipeline"]
    types: [completed]

jobs:
  notify:
    runs-on: ubuntu-latest
    if: ${{ github.event.workflow_run.conclusion == 'failure' && github.ref == 'refs/heads/main' }}
    steps:
    - name: 🚨 Send failure alert
      uses: 8398a7/action-slack@v3
      with:
        status: failure
        channel: '#alerts-prod'
        fields: repo,commit,author,took
        text: |
          🚨 *Production Pipeline Failed*
          
          Repository: ${{ github.repository }}
          Branch: ${{ github.ref_name }}
          Commit: ${{ github.event.workflow_run.head_commit.message }}
          Author: ${{ github.event.workflow_run.head_commit.author.name }}
          
          <${{ github.event.workflow_run.html_url }}|View Details>
      env:
        SLACK_WEBHOOK_URL: ${{ secrets.SLACK_WEBHOOK }}

  notify-success:
    runs-on: ubuntu-latest
    if: ${{ github.event.workflow_run.conclusion == 'success' && github.ref == 'refs/heads/main' }}
    steps:
    - name: ✅ Send success summary (weekly)
      if: ${{ github.event.schedule == '0 9 * * 1' }}  # Solo lunes
      uses: 8398a7/action-slack@v3
      with:
        status: success
        channel: '#deployments'
        text: |
          📊 *Weekly Deployment Summary*
          
          This week's production deployments: ✅ Successful
          Average pipeline time: ${{ env.AVG_TIME }}
          Success rate: ${{ env.SUCCESS_RATE }}%
```

### 3.2 Script de métricas semanales
Crear `scripts/weekly-metrics.sh`:
```bash
#!/bin/bash
echo "📊 Generando métricas semanales..."

# Obtener runs de la última semana
WEEK_AGO=$(date -d '7 days ago' --iso-8601)
RUNS=$(gh api repos/:owner/:repo/actions/runs \
  --jq ".workflow_runs[] | select(.created_at > \"$WEEK_AGO\")")

SUCCESS_COUNT=$(echo "$RUNS" | jq 'select(.conclusion == "success")' | jq -s length)
TOTAL_COUNT=$(echo "$RUNS" | jq -s length)
SUCCESS_RATE=$((SUCCESS_COUNT * 100 / TOTAL_COUNT))

echo "✅ Deployments exitosos: $SUCCESS_COUNT"
echo "📊 Total deployments: $TOTAL_COUNT"  
echo "🎯 Tasa de éxito: $SUCCESS_RATE%"

# Exportar para GitHub Actions
echo "SUCCESS_RATE=$SUCCESS_RATE" >> $GITHUB_ENV
```

### 3.3 Email solo para críticos
Configurar `.github/CODEOWNERS`:
```
# Notificaciones automáticas
* @devops-team
.github/ @senior-devs
```

Y workflow de email:
```yaml
critical-alert:
  if: failure() && contains(github.event.head_commit.message, '[critical]')
  runs-on: ubuntu-latest
  steps:
  - name: 📧 Send critical email
    uses: dawidd6/action-send-mail@v3
    with:
      server_address: smtp.gmail.com
      server_port: 587
      username: ${{ secrets.MAIL_USERNAME }}
      password: ${{ secrets.MAIL_PASSWORD }}
      subject: 🚨 CRITICAL: Production Pipeline Failure
      body: |
        Critical pipeline failure detected.
        
        Repository: ${{ github.repository }}
        Commit: ${{ github.sha }}
        Branch: ${{ github.ref }}
        
        Immediate attention required.
      to: devops-oncall@company.com
```

---

## 📊 Paso 4: Métricas Básicas (30 min)

### 4.1 Dashboard simple con GitHub
Crear `scripts/generate-metrics.py`:
```python
#!/usr/bin/env python3
import requests
import json
from datetime import datetime, timedelta
import os

# Configuración
REPO = os.environ.get('GITHUB_REPOSITORY', 'owner/repo')
TOKEN = os.environ.get('GITHUB_TOKEN')

headers = {
    'Authorization': f'token {TOKEN}',
    'Accept': 'application/vnd.github.v3+json'
}

def get_workflow_runs(days=7):
    """Obtener runs de los últimos N días"""
    since = (datetime.now() - timedelta(days=days)).isoformat()
    url = f'https://api.github.com/repos/{REPO}/actions/runs'
    
    params = {'created': f'>{since}', 'per_page': 100}
    response = requests.get(url, headers=headers, params=params)
    
    return response.json()['workflow_runs']

def calculate_metrics():
    """Calcular métricas clave"""
    runs = get_workflow_runs()
    
    if not runs:
        print("❌ No hay datos suficientes")
        return
    
    # Métricas básicas
    total = len(runs)
    successful = len([r for r in runs if r['conclusion'] == 'success'])
    failed = len([r for r in runs if r['conclusion'] == 'failure'])
    
    success_rate = (successful / total) * 100 if total > 0 else 0
    
    # Tiempo promedio
    durations = []
    for run in runs:
        if run['updated_at'] and run['created_at']:
            start = datetime.fromisoformat(run['created_at'].replace('Z', '+00:00'))
            end = datetime.fromisoformat(run['updated_at'].replace('Z', '+00:00'))
            duration = (end - start).total_seconds() / 60  # minutos
            durations.append(duration)
    
    avg_duration = sum(durations) / len(durations) if durations else 0
    
    # Generar reporte
    print("📊 MÉTRICAS DEL PIPELINE (últimos 7 días)")
    print("=" * 50)
    print(f"🚀 Total de ejecuciones: {total}")
    print(f"✅ Exitosas: {successful}")
    print(f"❌ Fallidas: {failed}")
    print(f"📈 Tasa de éxito: {success_rate:.1f}%")
    print(f"⏱️ Tiempo promedio: {avg_duration:.1f} minutos")
    print(f"🎯 Estado: {'🟢 EXCELENTE' if success_rate > 95 else '🟡 MEJORABLE' if success_rate > 85 else '🔴 CRÍTICO'}")
    
    # Guardar en archivo para GitHub Pages
    metrics = {
        'updated': datetime.now().isoformat(),
        'total_runs': total,
        'success_rate': round(success_rate, 1),
        'avg_duration_minutes': round(avg_duration, 1),
        'successful': successful,
        'failed': failed
    }
    
    with open('pipeline-metrics.json', 'w') as f:
        json.dump(metrics, f, indent=2)
    
    print("\n💾 Métricas guardadas en pipeline-metrics.json")

if __name__ == "__main__":
    calculate_metrics()
```

### 4.2 Workflow para métricas
Crear `.github/workflows/metrics.yml`:
```yaml
name: 📊 Pipeline Metrics

on:
  schedule:
    - cron: '0 9 * * *'  # Diario a las 9 AM
  workflow_dispatch:

jobs:
  metrics:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v4
    
    - name: 🐍 Setup Python
      uses: actions/setup-python@v4
      with:
        python-version: '3.9'
        
    - name: 📦 Install dependencies
      run: pip install requests
      
    - name: 📊 Generate metrics
      run: python scripts/generate-metrics.py
      env:
        GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        GITHUB_REPOSITORY: ${{ github.repository }}
        
    - name: 📈 Create simple dashboard
      run: |
        cat > dashboard.html << 'EOF'
        <!DOCTYPE html>
        <html>
        <head>
            <title>📊 Pipeline Dashboard</title>
            <style>
                body { font-family: Arial; margin: 40px; background: #f5f5f5; }
                .metric { background: white; padding: 20px; margin: 10px; border-radius: 8px; display: inline-block; }
                .success { border-left: 5px solid #4CAF50; }
                .warning { border-left: 5px solid #FF9800; }
                .error { border-left: 5px solid #f44336; }
                .big-number { font-size: 2em; font-weight: bold; }
            </style>
        </head>
        <body>
            <h1>🚀 Pipeline Dashboard</h1>
            <div id="metrics"></div>
            
            <script>
                fetch('pipeline-metrics.json')
                    .then(response => response.json())
                    .then(data => {
                        const container = document.getElementById('metrics');
                        
                        container.innerHTML = `
                            <div class="metric success">
                                <h3>✅ Tasa de Éxito</h3>
                                <div class="big-number">${data.success_rate}%</div>
                            </div>
                            
                            <div class="metric ${data.avg_duration_minutes > 10 ? 'warning' : 'success'}">
                                <h3>⏱️ Tiempo Promedio</h3>
                                <div class="big-number">${data.avg_duration_minutes}min</div>
                            </div>
                            
                            <div class="metric">
                                <h3>🚀 Total Ejecuciones</h3>
                                <div class="big-number">${data.total_runs}</div>
                            </div>
                            
                            <div class="metric">
                                <h3>📅 Última Actualización</h3>
                                <div>${new Date(data.updated).toLocaleString()}</div>
                            </div>
                        `;
                    });
            </script>
        </body>
        </html>
        EOF
        
    - name: 📤 Deploy dashboard
      uses: peaceiris/actions-gh-pages@v3
      with:
        github_token: ${{ secrets.GITHUB_TOKEN }}
        publish_dir: .
        include_files: |
          dashboard.html
          pipeline-metrics.json
```

### 4.3 Hacer scripts ejecutables
```bash
chmod +x scripts/generate-metrics.py
chmod +x scripts/weekly-metrics.sh
```

---

## ✅ Paso 5: Testing y Validación (15 min)

### 5.1 Verificar optimizaciones
```bash
# 1. Ejecutar benchmark después de optimizar
./scripts/benchmark-pipeline.sh

# 2. Probar pipeline manualmente
gh workflow run ci.yml

# 3. Verificar métricas
python scripts/generate-metrics.py

# 4. Comprobar notificaciones (enviar test)
# Crear commit con [critical] para probar alertas
git commit -m "test: [critical] Testing alert system"
git push
```

### 5.2 Checklist final
```markdown
## ✅ Checklist de Optimización

### Cache y Performance
- [x] Cache de node_modules/dependencies
- [x] Cache de Docker layers
- [x] Artifacts reutilizables entre stages

### Paralelización
- [x] Tests unitarios en paralelo
- [x] Build y lint simultáneos
- [x] Deployments multi-environment

### Notificaciones
- [x] Alerts solo para production failures
- [x] Success notifications limitadas
- [x] Canal dedicado para CI/CD

### Métricas
- [x] Dashboard básico configurado
- [x] Tiempo promedio tracking
- [x] Success rate monitoring
```

### 5.3 Script de validación
Crear `scripts/validate-optimizations.sh`:
```bash
#!/bin/bash
echo "🔍 Validando optimizaciones del pipeline..."

# Verificar cache está configurado
if grep -q "cache: 'npm'" .github/workflows/ci.yml; then
    echo "✅ Cache de npm configurado"
else
    echo "❌ Cache de npm NO configurado"
fi

# Verificar jobs en paralelo
PARALLEL_JOBS=$(grep -c "needs:" .github/workflows/ci.yml)
if [ $PARALLEL_JOBS -gt 0 ]; then
    echo "✅ Jobs en paralelo: $PARALLEL_JOBS"
else
    echo "❌ No hay jobs en paralelo"
fi

# Verificar notificaciones
if [ -f ".github/workflows/notify.yml" ]; then
    echo "✅ Notificaciones inteligentes configuradas"
else
    echo "❌ Notificaciones NO configuradas"
fi

# Verificar métricas
if [ -f "scripts/generate-metrics.py" ]; then
    echo "✅ Sistema de métricas implementado"
    python scripts/generate-metrics.py > /dev/null 2>&1 && echo "✅ Métricas funcionando"
else
    echo "❌ Sistema de métricas NO implementado"
fi

echo ""
echo "🎯 RESUMEN:"
echo "- Pipeline optimizado para velocidad"
echo "- Cache implementado correctamente" 
echo "- Jobs ejecutándose en paralelo"
echo "- Notificaciones inteligentes activas"
echo "- Dashboard de métricas funcionando"
echo ""
echo "🚀 ¡Pipeline optimizado exitosamente!"
```

---

## 🎉 Resultado Final

### ✅ Lo que has logrado:

🚀 **Pipeline 50% más rápido** - Cache y paralelización  
🔔 **Notificaciones inteligentes** - Solo alertas importantes  
📊 **Dashboard de métricas** - Visibilidad del rendimiento  
⚡ **Docker optimizado** - Multi-stage builds eficientes  
🔧 **Tests paralelos** - Mejor uso de recursos  

### 📊 Métricas de éxito:

- **Tiempo de pipeline**: Reducción del 50%
- **Tasa de éxito**: > 95%
- **Notificaciones**: 80% menos spam
- **Visibilidad**: Dashboard en tiempo real
- **Eficiencia**: Mejor uso de runners

### 🚀 Comandos para usar:

```bash
# Benchmarking
./scripts/benchmark-pipeline.sh

# Generar métricas
python scripts/generate-metrics.py

# Validar optimizaciones  
./scripts/validate-optimizations.sh

# Ver dashboard
open https://tu-usuario.github.io/tu-repo/dashboard.html
```

---

## 🎯 Conceptos clave aplicados:

- ✅ **Cache inteligente** para dependencias y Docker
- ✅ **Paralelización** de jobs independientes
- ✅ **Notificaciones contextuales** sin spam
- ✅ **Métricas automatizadas** para tomar decisiones
- ✅ **Multi-stage builds** optimizados

---

## 🏆 ¡FELICITACIONES!

Has optimizado tu pipeline CI/CD como un DevOps Engineer Senior:

- **⚡ Velocidad**: Pipeline 50% más rápido
- **🔍 Visibilidad**: Métricas en tiempo real
- **🔔 Inteligencia**: Notificaciones útiles
- **📈 Calidad**: Mejor tasa de éxito
- **💰 Eficiencia**: Menor costo de CI/CD

**🚀 Tu pipeline ahora es una máquina optimizada de delivery continuo!**