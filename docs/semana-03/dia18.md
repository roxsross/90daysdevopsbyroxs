---
title: Día 18 - Self-hosted Runners GitHub Actions
description: Aprender configurar un Self-hosted Runners
sidebar_position: 4
---

### Self-hosted Runners

![](../../static/images/banner/3.png)

### ¿Qué son los Self-hosted Runners?
Los self-hosted runners son máquinas que **tú hospeadas y mantienes** para ejecutar workflows de GitHub Actions, en lugar de usar los runners hospedados por GitHub.

### Cuándo Usar Self-hosted Runners

#### ✅ Casos de Uso Recomendados
- **Hardware específico**: GPUs, arquitecturas ARM, hardware especializado
- **Acceso a recursos internos**: Bases de datos privadas, sistemas internos
- **Compliance y seguridad**: Requisitos estrictos de datos
- **Volumen alto**: Reducir costos con uso intensivo
- **Software específico**: Herramientas que no están en runners de GitHub

#### ❌ Casos Donde NO Usarlos
- **Repositorios públicos**: Riesgo de seguridad
- **Proyectos simples**: Overhead innecesario
- **Mantenimiento limitado**: Requieren gestión activa

### Ventajas vs Desventajas

| Ventajas | Desventajas |
|----------|-------------|
| Control total del entorno | Mantenimiento y actualizaciones |
| Acceso a recursos privados | Costos de infraestructura |
| Hardware personalizado | Configuración de seguridad |
| Sin límites de tiempo | Disponibilidad y escalado |

## 🛠️ Práctica

### Ejercicio 1: Configurar Self-hosted Runner Básico

1. **Preparar el servidor (Ubuntu 22.04)**

   ```bash
   # Actualizar sistema
   sudo apt update && sudo apt upgrade -y

   # Instalar dependencias básicas
   sudo apt install -y curl wget git jq build-essential

   # Crear usuario específico para el runner
   sudo adduser github-runner
   sudo usermod -aG docker github-runner

   # Cambiar al usuario del runner
   sudo su - github-runner
   ```

2. **Descargar y configurar el runner**

   ```bash
   # Crear directorio para el runner
   mkdir actions-runner && cd actions-runner

   # Descargar la última versión
   curl -o actions-runner-linux-x64-2.311.0.tar.gz -L \
     https://github.com/actions/runner/releases/download/v2.311.0/actions-runner-linux-x64-2.311.0.tar.gz

   # Verificar hash (opcional pero recomendado)
   echo "29fc8cf2dab4c195bb147384e7e2c94cfd4d4022c793b346a6175435265aa278  actions-runner-linux-x64-2.311.0.tar.gz" | shasum -a 256 -c

   # Extraer archivos
   tar xzf ./actions-runner-linux-x64-2.311.0.tar.gz
   ```

3. **Script de configuración automática**

   `setup-runner.sh`:
   ```bash
   #!/bin/bash

   # Configuración
   GITHUB_OWNER="tu-usuario-o-org"
   GITHUB_REPO="tu-repo"
   RUNNER_NAME="self-hosted-runner-$(hostname)"
   RUNNER_LABELS="self-hosted,linux,x64,docker"

   # URL de configuración (obtener desde GitHub Settings > Actions > Runners)
   CONFIG_URL="https://github.com/${GITHUB_OWNER}/${GITHUB_REPO}"

   # Token (obtener desde GitHub Settings > Actions > Runners > New runner)
   REGISTRATION_TOKEN="tu-token-aqui"

   # Configurar el runner
   ./config.sh \
     --url $CONFIG_URL \
     --token $REGISTRATION_TOKEN \
     --name $RUNNER_NAME \
     --labels $RUNNER_LABELS \
     --work _work \
     --replace \
     --unattended

   echo "Runner configurado exitosamente!"
   ```

4. **Configurar como servicio systemd**

   `install-service.sh`:
   ```bash
   #!/bin/bash

   # Instalar el servicio
   sudo ./svc.sh install github-runner

   # Iniciar el servicio
   sudo ./svc.sh start

   # Habilitar inicio automático
   sudo systemctl enable actions.runner.${GITHUB_OWNER}-${GITHUB_REPO}.${RUNNER_NAME}.service

   # Verificar estado
   sudo ./svc.sh status
   ```

### Ejercicio 2: Runner con Docker

1. **Dockerfile para Runner**

   `Dockerfile.runner`:
   ```dockerfile
   FROM ubuntu:22.04

   # Evitar prompts interactivos
   ENV DEBIAN_FRONTEND=noninteractive

   # Instalar dependencias
   RUN apt-get update && apt-get install -y \
       curl \
       wget \
       git \
       jq \
       build-essential \
       sudo \
       && rm -rf /var/lib/apt/lists/*

   # Instalar Docker
   RUN curl -fsSL https://get.docker.com -o get-docker.sh \
       && sh get-docker.sh \
       && rm get-docker.sh

   # Crear usuario runner
   RUN useradd -m -s /bin/bash runner \
       && usermod -aG sudo runner \
       && usermod -aG docker runner \
       && echo "runner ALL=(ALL) NOPASSWD:ALL" >> /etc/sudoers

   # Cambiar al usuario runner
   USER runner
   WORKDIR /home/runner

   # Descargar GitHub Actions Runner
   RUN curl -o actions-runner-linux-x64-2.311.0.tar.gz -L \
       https://github.com/actions/runner/releases/download/v2.311.0/actions-runner-linux-x64-2.311.0.tar.gz \
       && tar xzf ./actions-runner-linux-x64-2.311.0.tar.gz \
       && rm actions-runner-linux-x64-2.311.0.tar.gz

   # Script de entrada
   COPY --chown=runner:runner entrypoint.sh .
   RUN chmod +x entrypoint.sh

   ENTRYPOINT ["./entrypoint.sh"]
   ```

2. **Script de entrada**

   `entrypoint.sh`:
   ```bash
   #!/bin/bash

   # Variables de entorno requeridas
   if [[ -z "$GITHUB_OWNER" || -z "$GITHUB_REPO" || -z "$REGISTRATION_TOKEN" ]]; then
       echo "Error: Variables de entorno faltantes"
       echo "Requeridas: GITHUB_OWNER, GITHUB_REPO, REGISTRATION_TOKEN"
       exit 1
   fi

   # Configuración del runner
   RUNNER_NAME="${RUNNER_NAME:-docker-runner-$(hostname)}"
   RUNNER_LABELS="${RUNNER_LABELS:-self-hosted,linux,x64,docker}"
   CONFIG_URL="https://github.com/${GITHUB_OWNER}/${GITHUB_REPO}"

   # Función de limpieza
   cleanup() {
       echo "Removiendo runner..."
       ./config.sh remove --token $REGISTRATION_TOKEN
   }

   # Configurar trap para limpieza
   trap cleanup EXIT

   # Configurar runner
   ./config.sh \
     --url $CONFIG_URL \
     --token $REGISTRATION_TOKEN \
     --name $RUNNER_NAME \
     --labels $RUNNER_LABELS \
     --work _work \
     --replace \
     --unattended

   # Ejecutar runner
   exec ./run.sh
   ```

3. **Docker Compose para Runners**

   `docker-compose.runners.yml`:
   ```yaml
   version: '3.8'

   services:
     runner-1:
       build:
         context: .
         dockerfile: Dockerfile.runner
       container_name: github-runner-1
       environment:
         - GITHUB_OWNER=${GITHUB_OWNER}
         - GITHUB_REPO=${GITHUB_REPO}
         - REGISTRATION_TOKEN=${REGISTRATION_TOKEN}
         - RUNNER_NAME=docker-runner-1
         - RUNNER_LABELS=self-hosted,linux,x64,docker,runner-1
       volumes:
         - /var/run/docker.sock:/var/run/docker.sock
         - runner-1-work:/home/runner/_work
       restart: unless-stopped

     runner-2:
       build:
         context: .
         dockerfile: Dockerfile.runner
       container_name: github-runner-2
       environment:
         - GITHUB_OWNER=${GITHUB_OWNER}
         - GITHUB_REPO=${GITHUB_REPO}
         - REGISTRATION_TOKEN=${REGISTRATION_TOKEN}
         - RUNNER_NAME=docker-runner-2
         - RUNNER_LABELS=self-hosted,linux,x64,docker,runner-2
       volumes:
         - /var/run/docker.sock:/var/run/docker.sock
         - runner-2-work:/home/runner/_work
       restart: unless-stopped

   volumes:
     runner-1-work:
     runner-2-work:
   ```

### Ejercicio 3: Auto-scaling con Docker Swarm

1. **Docker Stack para Runners**

   `docker-stack.yml`:
   ```yaml
   version: '3.8'

   services:
     runner:
       image: github-runner:latest
       environment:
         - GITHUB_OWNER=${GITHUB_OWNER}
         - GITHUB_REPO=${GITHUB_REPO}
         - REGISTRATION_TOKEN=${REGISTRATION_TOKEN}
         - RUNNER_LABELS=self-hosted,linux,x64,docker,swarm
       volumes:
         - /var/run/docker.sock:/var/run/docker.sock
       deploy:
         replicas: 3
         restart_policy:
           condition: any
           delay: 10s
         resources:
           limits:
             cpus: '2'
             memory: 4G
           reservations:
             cpus: '1'
             memory: 2G
         placement:
           constraints:
             - node.role == worker
   ```

2. **Script de escalado automático**

   `autoscale-runners.sh`:
   ```bash
   #!/bin/bash

   # Configuración
   MIN_RUNNERS=2
   MAX_RUNNERS=10
   SCALE_UP_THRESHOLD=80
   SCALE_DOWN_THRESHOLD=20

   get_runner_count() {
       docker service ls --filter name=runners_runner --format "{{.Replicas}}" | cut -d'/' -f1
   }

   get_queue_length() {
       # Usar GitHub API para obtener trabajos en cola
       curl -s -H "Authorization: token $GITHUB_TOKEN" \
         "https://api.github.com/repos/$GITHUB_OWNER/$GITHUB_REPO/actions/runs?status=queued" \
         | jq '.total_count'
   }

   current_runners=$(get_runner_count)
   queue_length=$(get_queue_length)

   echo "Runners actuales: $current_runners, Cola: $queue_length"

   # Lógica de escalado
   if [ $queue_length -gt $SCALE_UP_THRESHOLD ] && [ $current_runners -lt $MAX_RUNNERS ]; then
       new_count=$((current_runners + 2))
       echo "Escalando a $new_count runners"
       docker service update --replicas $new_count runners_runner
   elif [ $queue_length -lt $SCALE_DOWN_THRESHOLD ] && [ $current_runners -gt $MIN_RUNNERS ]; then
       new_count=$((current_runners - 1))
       echo "Reduciendo a $new_count runners"
       docker service update --replicas $new_count runners_runner
   fi
   ```

### Ejercicio 4: Workflows Específicos para Self-hosted

1. **Workflow que usa self-hosted runner**

   `.github/workflows/self-hosted-example.yml`:
   ```yaml
   name: Self-hosted Runner Example

   on:
     push:
       branches: [ main ]

   jobs:
     build-on-self-hosted:
       runs-on: [self-hosted, linux, x64]
       
       steps:
       - name: Checkout code
         uses: actions/checkout@v4

       - name: Show runner info
         run: |
           echo "Runner hostname: $(hostname)"
           echo "Runner IP: $(hostname -I)"
           echo "Available CPUs: $(nproc)"
           echo "Memory: $(free -h)"
           echo "Disk space: $(df -h /)"

       - name: Check Docker
         run: |
           docker --version
           docker ps

       - name: Run custom build
         run: |
           echo "Running on self-hosted runner!"
           # Aquí puedes usar recursos específicos de tu runner
           
     specific-hardware-job:
       runs-on: [self-hosted, gpu, cuda]
       if: contains(github.event.head_commit.message, '[gpu]')
       
       steps:
       - name: Checkout code
         uses: actions/checkout@v4

       - name: Check GPU
         run: |
           nvidia-smi
           
       - name: Run GPU workload
         run: |
           # Ejecutar trabajos que requieren GPU
           echo "Running GPU-intensive tasks"
   ```

2. **Workflow con matriz de runners**

   `.github/workflows/matrix-runners.yml`:
   ```yaml
   name: Matrix with Self-hosted Runners

   on:
     push:
       branches: [ main ]

   jobs:
     test-matrix:
       strategy:
         matrix:
           runner: 
             - [self-hosted, linux, x64, docker]
             - [self-hosted, linux, arm64, docker]
             - ubuntu-latest
           node-version: [16, 18, 20]
       
       runs-on: ${{ matrix.runner }}
       
       steps:
       - name: Checkout
         uses: actions/checkout@v4

       - name: Setup Node.js
         uses: actions/setup-node@v4
         with:
           node-version: ${{ matrix.node-version }}

       - name: Show environment
         run: |
           echo "Runner: ${{ matrix.runner }}"
           echo "Node: ${{ matrix.node-version }}"
           echo "Architecture: $(uname -m)"
           node --version
           npm --version
   ```

### Ejercicio 5: Monitoring y Logging

1. **Script de monitoreo**

   `monitor-runners.sh`:
   ```bash
   #!/bin/bash

   # Configuración
   LOG_FILE="/var/log/github-runners.log"
   METRICS_FILE="/tmp/runner-metrics.json"

   log_message() {
       echo "$(date '+%Y-%m-%d %H:%M:%S') - $1" | tee -a $LOG_FILE
   }

   collect_metrics() {
       local runner_count=$(docker ps --filter "name=github-runner" --format "{{.Names}}" | wc -l)
       local cpu_usage=$(top -bn1 | grep "Cpu(s)" | awk '{print $2}' | cut -d'%' -f1)
       local memory_usage=$(free | grep Mem | awk '{printf "%.2f", $3/$2 * 100.0}')
       local disk_usage=$(df / | tail -1 | awk '{print $5}' | cut -d'%' -f1)

       cat > $METRICS_FILE << EOF
   {
     "timestamp": "$(date -Iseconds)",
     "active_runners": $runner_count,
     "cpu_usage_percent": $cpu_usage,
     "memory_usage_percent": $memory_usage,
     "disk_usage_percent": $disk_usage
   }
   EOF

       log_message "Metrics collected: Runners=$runner_count, CPU=${cpu_usage}%, Memory=${memory_usage}%, Disk=${disk_usage}%"
   }

   check_runner_health() {
       local unhealthy_runners=$(docker ps --filter "name=github-runner" --filter "health=unhealthy" --format "{{.Names}}")
       
       if [ ! -z "$unhealthy_runners" ]; then
           log_message "WARNING: Unhealthy runners detected: $unhealthy_runners"
           # Reiniciar runners problemáticos
           echo "$unhealthy_runners" | xargs -I {} docker restart {}
       fi
   }

   # Ejecutar monitoreo
   collect_metrics
   check_runner_health
   ```

2. **Configuración de Prometheus/Grafana**

   `prometheus.yml`:
   ```yaml
   global:
     scrape_interval: 15s

   scrape_configs:
     - job_name: 'github-runners'
       static_configs:
         - targets: ['localhost:9090']
       metrics_path: /metrics
       scrape_interval: 30s
   ```

## 🔒 Security Hardening

### 1. Aislamiento de Red
```bash
# Crear red dedicada para runners
docker network create --driver bridge github-runners

# Configurar firewall
sudo ufw deny in on docker0
sudo ufw allow in on github-runners
```

### 2. Limitar Privilegios
```yaml
# En docker-compose
security_opt:
  - no-new-privileges:true
cap_drop:
  - ALL
cap_add:
  - CHOWN
  - SETUID
  - SETGID
```

### 3. Secrets Management
```bash
# Usar Docker secrets
echo "$REGISTRATION_TOKEN" | docker secret create github_token -

# En el compose
secrets:
  - github_token
```

## ✅ Tareas del Día

### Tarea Principal
1. **Configurar un self-hosted runner básico**
2. **Crear un runner containerizado con Docker**
3. **Implementar un workflow que use el runner**
4. **Configurar monitoreo básico**

### Tareas Adicionales
1. **Configurar auto-scaling básico**
2. **Implementar health checks**
3. **Configurar log rotation**
4. **Probar diferentes labels y grupos**

## 📚 Recursos Recomendados

- [GitHub Docs: About self-hosted runners](https://docs.github.com/en/actions/hosting-your-own-runners/about-self-hosted-runners)
- [GitHub Docs: Adding self-hosted runners](https://docs.github.com/en/actions/hosting-your-own-runners/adding-self-hosted-runners)
- [GitHub Actions Runner Releases](https://github.com/actions/runner/releases)
- [GitHub Actions Runner (Repositorio oficial)](https://github.com/actions/runner)
- [Self-hosted runners: Seguridad y mejores prácticas](https://docs.github.com/en/actions/hosting-your-own-runners/security-hardening-your-self-hosted-runners)
- [Ejemplo de auto-scaling de runners](https://github.com/philips-labs/terraform-aws-github-runner)
- [Monitorización de runners con Prometheus](https://github.com/evryfs/github-actions-runner-monitor)
- [Blog: Self-hosted runners en profundidad (GitHub Blog)](https://github.blog/2019-11-05-self-hosted-runners-for-github-actions-is-now-in-beta/)


**¡Mañana exploraremos estrategias avanzadas de deployment!** 🚀