---
title: Día 28 -  Desafío Final Semana 4
description: Desafío Final - Desplegar roxs-voting-app usando Terraform y Docker Provider
sidebar_position: 7
---

## 🎯 Desafío Final - Roxs Voting App con Terraform

![](../../static/images/banner/4.png)

¡Llegamos al gran final de la **Semana 4**!  
Hoy aplicaremos **todo lo aprendido** para desplegar la aplicación **roxs-voting-app** usando **Terraform** con el **Provider Docker**.


![Arquitectura Roxs-Voting-App](../../static/images/2.png)

---

## 🏗️ Análisis del Desafío

### Recordando la Aplicación Original
teníamos:
- 🐍 `vote`: app Flask (puerto 80)
- 🧠 `worker`: servicio Node.js (puerto 3000 interno)
- 📊 `result`: app Node.js (puerto 3000)
- 🗃️ `redis`: almacén temporal (puerto 6379)
- 🐘 `postgres`: base de datos (puerto 5432)

### El Desafío Terraform
**Transformar** el docker-compose.yml en **módulos Terraform reutilizables** que permitan:
- Gestión declarativa de la infraestructura
- Múltiples entornos (dev/staging/prod)
- Escalabilidad y mantenibilidad
- Testing automatizado

---

## 📋 Metodología de Abordaje

### Fase 1: Análisis y Diseño (30 min)
```
🔍 ANÁLISIS
├── Identificar componentes del docker-compose
├── Mapear dependencias entre servicios
├── Definir variables por entorno
└── Planificar estructura de módulos

📐 DISEÑO
├── Arquitectura de módulos
├── Flujo de datos entre servicios
├── Estrategia de red y storage
└── Plan de testing
```

### Fase 2: Estructura Base 
```
📁 ESTRUCTURA
roxs-voting-terraform/
├── modules/
│   ├── network/          # Red compartida
│   ├── database/         # PostgreSQL
│   ├── cache/            # Redis
│   ├── vote-service/     # Aplicación de votación
│   ├── result-service/   # Aplicación de resultados
│   └── worker-service/   # Procesador de votos
├── environments/
│   ├── dev.tfvars
│   ├── staging.tfvars
│   └── prod.tfvars
├── main.tf
├── variables.tf
├── outputs.tf
└── versions.tf
```

### Fase 3: Implementación Incremental 
```
🏗️ IMPLEMENTACIÓN PASO A PASO
1. Red base y configuración provider
2. Módulo de base de datos (PostgreSQL)
3. Módulo de cache (Redis)
4. Módulo de aplicación vote
5. Módulo de aplicación result
6. Módulo worker
7. Integración y testing
```

---

## 🎯 Estrategia de Implementación

### 1. Enfoque Bottom-Up

#### Paso 1: Configuración Base
```hcl
# versions.tf - Empezar aquí
terraform {
  required_version = ">= 1.0"
  required_providers {
    docker = {
      source  = "kreuzwerker/docker"
      version = "~> 3.0"
    }
  }
}

provider "docker" {}
```

#### Paso 2: Red Compartida
```hcl
# modules/network/main.tf - Segundo paso
resource "docker_network" "voting_network" {
  name = var.network_name
  # ... configuración
}
```

#### Paso 3: Servicios de Datos (PostgreSQL + Redis)
```hcl
# modules/database/main.tf - Tercer paso
# Implementar PostgreSQL con volúmenes persistentes

# modules/cache/main.tf - Cuarto paso  
# Implementar Redis con configuración optimizada
```

#### Paso 4: Servicios de Aplicación
```hcl
# modules/vote-service/main.tf - Quinto paso
# modules/result-service/main.tf - Sexto paso
# modules/worker-service/main.tf - Séptimo paso
```

---

## 🧩 Plantillas y Patrones

### Patrón para Módulos de Servicio

#### Template de `variables.tf`
```hcl
variable "app_name" {
  description = "Application name prefix"
  type        = string
}

variable "network_name" {
  description = "Docker network name"
  type        = string
}

variable "image_name" {
  description = "Docker image name"
  type        = string
}

variable "replica_count" {
  description = "Number of replicas"
  type        = number
  default     = 1
}

variable "environment_vars" {
  description = "Environment variables"
  type        = map(string)
  default     = {}
}

variable "external_port" {
  description = "External port (null for internal only)"
  type        = number
  default     = null
}

variable "memory_limit" {
  description = "Memory limit in MB"
  type        = number
  default     = 256
}

variable "environment" {
  description = "Environment name"
  type        = string
}
```

#### Template de `outputs.tf`
```hcl
output "container_ids" {
  description = "Container IDs"
  value       = docker_container.service[*].id
}

output "container_names" {
  description = "Container names"
  value       = docker_container.service[*].name
}

output "service_url" {
  description = "Service URL"
  value       = var.external_port != null ? "http://localhost:${var.external_port}" : "internal"
}

output "internal_host" {
  description = "Internal hostname"
  value       = "${var.app_name}-${replace(var.service_name, "_", "-")}"
}
```

### Patrón para main.tf Principal
```hcl
# main.tf estructura recomendada
terraform {
  # provider configuration
}

locals {
  # configuración dinámica por workspace
  env_config = {
    dev = { /* config */ }
    staging = { /* config */ }
    prod = { /* config */ }
  }
  current_config = local.env_config[terraform.workspace]
}

# Network
module "network" {
  source = "./modules/network"
  # ...
}

# Database
module "database" {
  source = "./modules/database"
  # ...
  depends_on = [module.network]
}

# Cache
module "cache" {
  source = "./modules/cache"
  # ...
  depends_on = [module.network]
}

# Applications
module "vote_service" {
  source = "./modules/vote-service"
  # ...
  depends_on = [module.cache]
}

# Worker
module "worker" {
  source = "./modules/worker-service"
  # ...
  depends_on = [module.database, module.cache]
}

# Result
module "result_service" {
  source = "./modules/result-service"  
  # ...
  depends_on = [module.database]
}
```

---

## 🔧 Configuración por Entornos

### Estrategia de Variables

#### `environments/dev.tfvars`
```hcl
# Desarrollo - Recursos mínimos
database_password = "dev_password_123"
replica_count     = 1
memory_limit      = 256
external_ports = {
  vote   = 8080
  result = 3000
  postgres = 5432  # Expuesto para debugging
  redis    = 6379  # Expuesto para debugging
}
```

#### `environments/prod.tfvars`
```hcl
# Producción - Recursos optimizados
database_password = "super_secure_prod_password"
replica_count     = 3
memory_limit      = 1024
external_ports = {
  vote   = 80
  result = 3000
  postgres = null  # No expuesto
  redis    = null  # No expuesto
}
```

---

## 🧪 Estrategia de Testing

### Testing Progresivo

#### 1. Validación Sintáctica
```bash
# En cada paso
terraform fmt -check
terraform validate
terraform plan
```

#### 2. Testing de Módulos Individuales
```bash
# Crear ejemplos simples en modules/*/examples/
cd modules/database/examples/basic
terraform init && terraform apply
# Verificar funcionalidad
terraform destroy
```

#### 3. Testing de Integración
```bash
# Stack completo en ambiente dev
terraform workspace select dev
terraform apply -var-file="environments/dev.tfvars"
# Ejecutar tests E2E
```

#### 4. Script de Verificación
```bash
#!/bin/bash
# verify-deployment.sh

echo "🔍 Verificando despliegue..."

# Verificar contenedores
echo "Contenedores activos:"
docker ps --filter "label=project=roxs-voting-app"

# Verificar conectividad
echo "Probando conectividad:"
curl -f http://localhost:8080 && echo "✅ Vote app OK"
curl -f http://localhost:3000 && echo "✅ Result app OK"

# Verificar logs
echo "Logs recientes:"
docker logs roxs-voting-vote-1 --tail 5
docker logs roxs-voting-result-1 --tail 5
```

---

## 🚨 Problemas Comunes y Soluciones

### 1. Error de Conectividad entre Servicios
```bash
# Problema: Servicios no se pueden comunicar
# Solución: Verificar aliases de red
networks_advanced {
  name = var.network_name
  aliases = ["postgres", "database", "db"]  # Múltiples aliases
}
```

### 2. Volúmenes No Persisten
```bash
# Problema: Datos se pierden al reiniciar
# Solución: Verificar montaje de volúmenes
volumes {
  volume_name    = docker_volume.postgres_data.name
  container_path = "/var/lib/postgresql/data"
}
```

### 3. Puertos en Conflicto
```bash
# Problema: Puerto ya en uso
# Solución: Configuración dinámica por workspace
external_port = terraform.workspace == "dev" ? 8080 : 80
```

### 4. Variables de Entorno Incorrectas
```bash
# Problema: Aplicación no puede conectar a servicios
# Solución: Usar nombres consistentes
env = [
  "DATABASE_HOST=${var.app_name}-postgres",  # Usar variable
  "REDIS_HOST=${var.app_name}-redis"
]
```

---

## 🎁 Recursos y Herramientas

### Scripts Útiles

#### `quick-start.sh`
```bash
#!/bin/bash
echo "🚀 Roxs Voting App - Quick Start"
echo "1. Crear workspace dev"
terraform workspace new dev 2>/dev/null || terraform workspace select dev

echo "2. Aplicar configuración"
terraform init
terraform apply -var-file="environments/dev.tfvars"

echo "3. Verificar despliegue"
sleep 10
./verify-deployment.sh
```

#### `scale-app.sh`
```bash
#!/bin/bash
REPLICAS=${1:-2}
echo "🔄 Escalando aplicación a $REPLICAS réplicas"
terraform apply -var="replica_count=$REPLICAS" -auto-approve
```

### Herramientas de Desarrollo

#### VS Code Extensions Recomendadas
- HashiCorp Terraform
- Docker
- YAML
- GitLens

#### Comandos Docker Útiles
```bash
# Ver logs en tiempo real
docker logs -f roxs-voting-vote-1

# Ejecutar comando en contenedor
docker exec -it roxs-voting-postgres psql -U postgres

# Ver estadísticas de recursos
docker stats --format "table {{.Container}}\t{{.CPUPerc}}\t{{.MemUsage}}"
```

---

## 🔮 Próximos Pasos

Una vez completado el proyecto:

1. **Documenta tu experiencia** - ¿Qué aprendiste? ¿Qué fue más desafiante?
2. **Mejoras futuras** - CI/CD, monitoring, security scanning
3. **Comparte tu trabajo** - GitHub, LinkedIn, comunidad DevOps
4. **Prepárate para Kubernetes** - Semana 5 del desafío

---

## 💡 Consejos Finales

### Para el Éxito
- **Empieza simple** - Un módulo a la vez
- **Testa frecuentemente** - Valida cada paso
- **Documenta mientras trabajas** - No al final
- **Usa la comunidad** - Pregunta cuando tengas dudas

### Para el Aprendizaje
- **Experimenta** - Prueba diferentes configuraciones
- **Compara** - Docker Compose vs Terraform
- **Reflexiona** - ¿Cuándo usar cada herramienta?
- **Aplica** - Piensa en proyectos reales

---

## ✅ ¿Qué Aprendiste Hoy?

✅ **Metodología** para abordar proyectos complejos de Infrastructure as Code  
✅ **Estrategia incremental** de implementación  
✅ **Patrones y templates** reutilizables  
✅ **Planificación de tiempo** y checkpoints  
✅ **Solución de problemas** comunes  
✅ **Criterios de éxito** claros  

---

## 🏆 ¡Semana 4 Completada!

**¡FELICITACIONES!** Has completado la semana de **Terraform + Provider Docker**. 

### 🎓 Lo que Dominaste:
- **Infrastructure as Code** con Terraform
- **Módulos reutilizables** y composición
- **Estado remoto** y colaboración
- **Testing automatizado** de infraestructura
- **CI/CD para IaC**
- **Metodología** de proyectos DevOps

### 🚀 Estás Listo Para:
- Gestionar infraestructura a escala
- Colaborar en equipos DevOps
- Implementar mejores prácticas de IaC
- ¡Conquistar Kubernetes en la Semana 5!

---

**💬 Comparte tu progreso en la comunidad con el hashtag #DevOpsConRoxs**

**¡A por la Semana 5! 🚀**