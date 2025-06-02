---
title: Día 27 -  CI/CD para Terraform
description: CI/CD para Infrastructure as Code con Terraform
sidebar_position: 6
---
## 🚀 CI/CD para Terraform con GitHub Actions

![](../../static/images/banner/4.png)

¡Hoy automatizamos nuestros despliegues de Terraform!  
Aprenderemos a crear **pipelines de CI/CD** con **GitHub Actions** para deployar nuestra infraestructura de forma segura y automatizada.

---

## 🤔 ¿Por qué CI/CD para Infrastructure as Code?

### Problemas del Despliegue Manual
❌ **Errores humanos** en comandos  
❌ **Inconsistencias** entre ambientes  
❌ **Falta de trazabilidad** de cambios  
❌ **Despliegues lentos** y propensos a fallos  
❌ **Sin rollback** automático  

### Beneficios del CI/CD
✅ **Validación automática** antes del despliegue  
✅ **Despliegues consistentes** y repetibles  
✅ **Historial completo** de cambios  
✅ **Rollback rápido** en caso de problemas  
✅ **Múltiples ambientes** gestionados igual  

---

## 🏗️ Estructura del Proyecto CI/CD

```
terraform-cicd/
├── .github/
│   └── workflows/
│       ├── terraform-ci.yml      # Pipeline de validación
│       ├── terraform-cd.yml      # Pipeline de despliegue
│       └── terraform-destroy.yml # Pipeline de limpieza
├── environments/
│   ├── dev.tfvars
│   ├── staging.tfvars
│   └── prod.tfvars
├── modules/
│   └── docker-webapp/
├── main.tf
├── variables.tf
├── outputs.tf
└── README.md
```

---

## 🔍 Pipeline de CI (Continuous Integration)

El pipeline de CI valida nuestro código **antes** de que se fusione a la rama principal.

### `.github/workflows/terraform-ci.yml`
```yaml
name: Terraform CI - Validación

# Cuándo ejecutar el pipeline
on:
  pull_request:
    branches: [main]
    paths:
      - '**.tf'
      - '**.tfvars'
      - '.github/workflows/**'

# Variables globales
env:
  TF_VERSION: 1.6.0

jobs:
  # Job 1: Validación básica
  validate:
    name: Validar Terraform
    runs-on: ubuntu-latest
    
    steps:
    # Paso 1: Descargar código
    - name: Checkout código
      uses: actions/checkout@v4
      
    # Paso 2: Instalar Terraform
    - name: Setup Terraform
      uses: hashicorp/setup-terraform@v3
      with:
        terraform_version: ${{ env.TF_VERSION }}
        
    # Paso 3: Verificar formato
    - name: Verificar formato de código
      run: terraform fmt -check -recursive
      
    # Paso 4: Inicializar Terraform
    - name: Terraform Init
      run: terraform init
      
    # Paso 5: Validar sintaxis
    - name: Validar sintaxis
      run: terraform validate

  # Job 2: Generar plan para cada ambiente
  plan:
    name: Plan para Ambientes
    runs-on: ubuntu-latest
    needs: validate
    strategy:
      matrix:
        environment: [dev, staging]
    
    steps:
    - name: Checkout código
      uses: actions/checkout@v4
      
    - name: Setup Terraform
      uses: hashicorp/setup-terraform@v3
      with:
        terraform_version: ${{ env.TF_VERSION }}
        
    - name: Terraform Init
      run: terraform init
      
    - name: Seleccionar workspace
      run: |
        terraform workspace select ${{ matrix.environment }} || \
        terraform workspace new ${{ matrix.environment }}
      
    - name: Generar plan
      run: |
        terraform plan \
          -var-file="environments/${{ matrix.environment }}.tfvars" \
          -out="${{ matrix.environment }}.tfplan"
      env:
        TF_VAR_database_password: "ci-test-password-${{ matrix.environment }}"
      
    # Guardar el plan para usar en CD
    - name: Subir plan
      uses: actions/upload-artifact@v3
      with:
        name: tfplan-${{ matrix.environment }}
        path: ${{ matrix.environment }}.tfplan
        retention-days: 1

  # Job 3: Comentar el plan en el PR
  comment-plan:
    name: Comentar Plan en PR
    runs-on: ubuntu-latest
    needs: plan
    if: github.event_name == 'pull_request'
    
    steps:
    - name: Checkout código
      uses: actions/checkout@v4
      
    - name: Setup Terraform
      uses: hashicorp/setup-terraform@v3
      with:
        terraform_version: ${{ env.TF_VERSION }}
        
    - name: Terraform Init
      run: terraform init
      
    - name: Descargar plan de dev
      uses: actions/download-artifact@v3
      with:
        name: tfplan-dev
        
    - name: Mostrar plan en comentario
      uses: actions/github-script@v6
      with:
        script: |
          const fs = require('fs');
          
          // Generar el plan en formato legible
          const { execSync } = require('child_process');
          const planOutput = execSync('terraform show -no-color dev.tfplan', { encoding: 'utf8' });
          
          // Crear comentario
          const output = `## 📋 Plan de Terraform (Dev)
          
          <details>
          <summary>Ver cambios propuestos</summary>
          
          \`\`\`
          ${planOutput}
          \`\`\`
          
          </details>
          
          **Nota:** Este plan es solo para el ambiente de desarrollo.
          `;
          
          // Publicar comentario
          github.rest.issues.createComment({
            issue_number: context.issue.number,
            owner: context.repo.owner,
            repo: context.repo.repo,
            body: output
          });
```

---

## 🚀 Pipeline de CD (Continuous Deployment)

El pipeline de CD despliega automáticamente cuando hay cambios en la rama principal.

### `.github/workflows/terraform-cd.yml`
```yaml
name: Terraform CD - Despliegue

# Cuándo ejecutar
on:
  push:
    branches: [main]
    paths:
      - '**.tf'
      - '**.tfvars'
  # También permitir ejecución manual
  workflow_dispatch:
    inputs:
      environment:
        description: 'Ambiente a desplegar'
        required: true
        default: 'dev'
        type: choice
        options:
        - dev
        - staging
        - prod
      action:
        description: 'Acción a realizar'
        required: true
        default: 'apply'
        type: choice
        options:
        - plan
        - apply
        - destroy

env:
  TF_VERSION: 1.6.0

jobs:
  # Despliegue a Desarrollo (automático)
  deploy-dev:
    name: 🔧 Desplegar a Desarrollo
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    environment: 
      name: development
      url: http://localhost:8080
    
    steps:
    - name: Checkout código
      uses: actions/checkout@v4
      
    - name: Setup Terraform
      uses: hashicorp/setup-terraform@v3
      with:
        terraform_version: ${{ env.TF_VERSION }}
        
    - name: Setup Docker
      uses: docker/setup-buildx-action@v3
      
    - name: Terraform Init
      run: terraform init
      
    - name: Seleccionar workspace dev
      run: terraform workspace select dev || terraform workspace new dev
      
    - name: Aplicar cambios a dev
      run: |
        terraform apply \
          -var-file="environments/dev.tfvars" \
          -auto-approve
      env:
        TF_VAR_database_password: ${{ secrets.DEV_DB_PASSWORD }}
      
    - name: Verificar despliegue
      run: |
        echo "🎉 Despliegue a desarrollo completado!"
        echo "📊 Obteniendo información del despliegue..."
        terraform output

  # Despliegue a Staging (con aprobación)
  deploy-staging:
    name: 🧪 Desplegar a Staging
    runs-on: ubuntu-latest
    needs: deploy-dev
    if: github.ref == 'refs/heads/main'
    environment: 
      name: staging
      url: http://localhost:8081
    
    steps:
    - name: Checkout código
      uses: actions/checkout@v4
      
    - name: Setup Terraform
      uses: hashicorp/setup-terraform@v3
      with:
        terraform_version: ${{ env.TF_VERSION }}
        
    - name: Setup Docker
      uses: docker/setup-buildx-action@v3
      
    - name: Terraform Init
      run: terraform init
      
    - name: Seleccionar workspace staging
      run: terraform workspace select staging || terraform workspace new staging
      
    - name: Aplicar cambios a staging
      run: |
        terraform apply \
          -var-file="environments/staging.tfvars" \
          -auto-approve
      env:
        TF_VAR_database_password: ${{ secrets.STAGING_DB_PASSWORD }}
      
    - name: Verificar aplicación en staging
      run: |
        echo "⏳ Esperando a que los servicios estén listos..."
        sleep 30
        
        echo "🧪 Verificando que la aplicación responda..."
        curl -f http://localhost:8081 || echo "⚠️ Aplicación no responde aún"

  # Despliegue a Producción (solo manual)
  deploy-prod:
    name: 🏭 Desplegar a Producción
    runs-on: ubuntu-latest
    if: github.event.inputs.environment == 'prod'
    environment: 
      name: production
      url: http://production.roxs-voting.com
    
    steps:
    - name: Checkout código
      uses: actions/checkout@v4
      
    - name: Setup Terraform
      uses: hashicorp/setup-terraform@v3
      with:
        terraform_version: ${{ env.TF_VERSION }}
        
    - name: Terraform Init
      run: terraform init
      
    - name: Seleccionar workspace prod
      run: terraform workspace select prod || terraform workspace new prod
      
    - name: Plan para producción
      run: |
        terraform plan \
          -var-file="environments/prod.tfvars" \
          -out=prod.tfplan
      env:
        TF_VAR_database_password: ${{ secrets.PROD_DB_PASSWORD }}
      
    - name: Mostrar plan
      run: terraform show -no-color prod.tfplan
      
    - name: Aplicar a producción
      if: github.event.inputs.action == 'apply'
      run: terraform apply -auto-approve prod.tfplan
      
    - name: Verificar producción
      if: github.event.inputs.action == 'apply'
      run: |
        echo "🎉 ¡Despliegue a producción completado!"
        terraform output
        
    - name: Notificar equipo
      if: always()
      run: |
        echo "📢 Notificando al equipo sobre el despliegue..."
        # Aquí puedes agregar notificaciones a Slack, Teams, etc.
```

---

## 🧹 Pipeline de Limpieza

Para destruir recursos cuando ya no los necesites.

### `.github/workflows/terraform-destroy.yml`
```yaml
name: Terraform Destroy - Limpieza

# Solo ejecución manual
on:
  workflow_dispatch:
    inputs:
      environment:
        description: 'Ambiente a destruir'
        required: true
        type: choice
        options:
        - dev
        - staging
        - prod
      confirm:
        description: 'Escriba "DESTROY" para confirmar'
        required: true
        type: string

env:
  TF_VERSION: 1.6.0

jobs:
  destroy:
    name: 🗑️ Destruir Infraestructura
    runs-on: ubuntu-latest
    environment: ${{ github.event.inputs.environment }}
    
    steps:
    - name: Validar confirmación
      run: |
        if [ "${{ github.event.inputs.confirm }}" != "DESTROY" ]; then
          echo "❌ Confirmación incorrecta. Debe escribir 'DESTROY'"
          exit 1
        fi
        echo "✅ Confirmación válida"
    
    - name: Checkout código
      uses: actions/checkout@v4
      
    - name: Setup Terraform
      uses: hashicorp/setup-terraform@v3
      with:
        terraform_version: ${{ env.TF_VERSION }}
        
    - name: Terraform Init
      run: terraform init
      
    - name: Seleccionar workspace
      run: terraform workspace select ${{ github.event.inputs.environment }}
      
    - name: Plan destroy
      run: |
        terraform plan -destroy \
          -var-file="environments/${{ github.event.inputs.environment }}.tfvars" \
          -out=destroy.tfplan
      env:
        TF_VAR_database_password: "dummy-password-for-destroy"
      
    - name: Mostrar qué se va a destruir
      run: terraform show -no-color destroy.tfplan
      
    - name: Destruir infraestructura
      run: terraform apply -auto-approve destroy.tfplan
      
    - name: Confirmar destrucción
      run: |
        echo "🗑️ Infraestructura de ${{ github.event.inputs.environment }} destruida"
        echo "📊 Estado final:"
        terraform show
```

---

## 🔐 Configuración de Secrets

Para que los pipelines funcionen, necesitas configurar secrets en GitHub:

### En tu repositorio GitHub:
1. Ve a **Settings** → **Secrets and variables** → **Actions**
2. Agregar estos secrets:

```bash
# Passwords de base de datos por ambiente
DEV_DB_PASSWORD=dev_password_123
STAGING_DB_PASSWORD=staging_password_456
PROD_DB_PASSWORD=super_secure_prod_password_789

# Si usas Docker Registry privado
DOCKER_USERNAME=tu_usuario
DOCKER_PASSWORD=tu_password

# Para notificaciones (opcional)
SLACK_WEBHOOK_URL=https://hooks.slack.com/services/...
```

---

## 🎯 Configuración de Environments

GitHub permite configurar **protection rules** por ambiente:

### 1. Crear Environments
En **Settings** → **Environments**, crear:
- `development` (sin restricciones)
- `staging` (con reviewers opcionales)
- `production` (con reviewers obligatorios)

### 2. Protection Rules para Producción
```yaml
# Configuración recomendada para production
Required reviewers: 2
Deployment branches: main only
Wait timer: 0 minutes
```

---

## 📁 Archivos de Variables por Ambiente

### `environments/dev.tfvars`
```hcl
# Desarrollo - Recursos mínimos
app_name = "roxs-voting-dev"
replica_count = 1
memory_limit = 256

external_ports = {
  vote   = 8080
  result = 3000
}

enable_monitoring = false
backup_enabled = false
```

### `environments/staging.tfvars`
```hcl
# Staging - Configuración intermedia
app_name = "roxs-voting-staging"
replica_count = 2
memory_limit = 512

external_ports = {
  vote   = 8081
  result = 3001
}

enable_monitoring = true
backup_enabled = true
```

### `environments/prod.tfvars`
```hcl
# Producción - Máximos recursos
app_name = "roxs-voting-prod"
replica_count = 3
memory_limit = 1024

external_ports = {
  vote   = 80
  result = 3000
}

enable_monitoring = true
backup_enabled = true
```

---

## 🔄 Flujo de Trabajo Completo

### 1. Desarrollo Local
```bash
# Crear feature branch
git checkout -b feature/nueva-funcionalidad

# Hacer cambios en Terraform
# ... editar archivos ...

# Validar localmente
terraform fmt
terraform validate
terraform plan

# Commit y push
git add .
git commit -m "feat: agregar nueva funcionalidad"
git push origin feature/nueva-funcionalidad
```

### 2. Pull Request
```bash
# Crear PR en GitHub
# ↓
# Se ejecuta automatically el pipeline CI
# ↓
# Revisar el plan de Terraform en los comentarios
# ↓
# Aprobar y mergear el PR
```

### 3. Despliegue Automático
```bash
# Al hacer merge a main:
# ↓
# Se ejecuta pipeline CD automáticamente
# ↓
# Despliega a DEV → luego a STAGING
# ↓
# Para PROD: ejecutar manualmente el workflow
```

### 4. Verificación
```bash
# Verificar que todo funciona
curl http://localhost:8080  # dev
curl http://localhost:8081  # staging

# Ver logs en GitHub Actions
# Verificar outputs de Terraform
```

---

## 🛠️ Comandos Útiles para CI/CD

### Ver estado de workflows
```bash
# Usando GitHub CLI
gh workflow list
gh workflow view terraform-ci.yml
gh run list --workflow=terraform-cd.yml

# Ver logs de un run específico
gh run view 1234567890 --log
```

### Ejecutar workflows manualmente
```bash
# Desplegar a staging
gh workflow run terraform-cd.yml -f environment=staging -f action=apply

# Destruir ambiente de dev
gh workflow run terraform-destroy.yml -f environment=dev -f confirm=DESTROY
```

### Debugging de problemas
```bash
# Ver último run fallido
gh run list --limit 1 --status failure

# Descargar logs
gh run download 1234567890

# Verificar secrets configurados
gh secret list
```

---

## 🧪 Testing del Pipeline

### Crear un PR de Prueba
```bash
# 1. Crear cambio pequeño
echo "# Test change" >> README.md
git add README.md
git commit -m "test: pipeline CI/CD"
git push origin feature/test-pipeline

# 2. Crear PR y verificar que:
#    ✅ Se ejecuta el pipeline CI
#    ✅ Aparece comentario con el plan
#    ✅ Todos los checks pasan

# 3. Mergear y verificar que:
#    ✅ Se ejecuta pipeline CD
#    ✅ Se despliega a dev y staging
#    ✅ La aplicación funciona
```

---

## 💡 Mejores Prácticas

### 1. **Protección de Ramas**
```yaml
# En Settings → Branches → main
✅ Require pull request reviews
✅ Require status checks to pass
✅ Require branches to be up to date
✅ Include administrators
```

### 2. **Secrets Management**
```bash
# ✅ Usar secrets de GitHub para passwords
# ✅ Rotar secrets regularmente
# ✅ Principio de menor privilegio
# ❌ Nunca hardcodear secrets en código
```

### 3. **Environments Strategy**
```bash
# ✅ dev → automático, sin restricciones
# ✅ staging → automático, con reviewers opcionales  
# ✅ prod → manual, con reviewers obligatorios
```

### 4. **Monitoring y Alerts**
```yaml
# Configurar notificaciones para:
- Fallos en pipeline
- Despliegues exitosos a producción
- Destrucción de recursos
```

---

## 🚨 Troubleshooting Común

### 1. **Error: "Workspace doesn't exist"**
```bash
# Solución: Crear workspace automáticamente
terraform workspace select $ENV || terraform workspace new $ENV
```

### 2. **Error: "State lock"**
```bash
# Problema: Estado bloqueado
# Solución: Forzar unlock (¡cuidado!)
terraform force-unlock LOCK_ID
```

### 3. **Error: "Secret not found"**
```bash
# Verificar que el secret existe
gh secret list

# Agregarlo si falta
gh secret set SECRET_NAME --body "value"
```

### 4. **Pipeline muy lento**
```yaml
# Optimización: Cache de Terraform
- name: Cache Terraform
  uses: actions/cache@v3
  with:
    path: ~/.terraform.d/plugin-cache
    key: ${{ runner.os }}-terraform-${{ hashFiles('**/.terraform.lock.hcl') }}
```

---

## ✅ ¿Qué Aprendiste Hoy?

✅ **CI/CD fundamentals** para Infrastructure as Code  
✅ **GitHub Actions** para automatizar Terraform  
✅ **Pipelines de validación** (CI) antes del merge  
✅ **Pipelines de despliegue** (CD) automáticos por ambiente  
✅ **Protection rules** y environments en GitHub  
✅ **Secrets management** seguro  
✅ **Flujo completo** de desarrollo → testing → despliegue  
✅ **Troubleshooting** de problemas comunes  

---

## 🔮 ¿Qué Sigue Mañana?

Mañana en el **Día 28** - el gran final - tendremos:
- Estrategia para abordar el proyecto final
- Metodología de implementación
- Planificación del desafío roxs-voting-app
- Consolidación de todos los conceptos

---

## 📚 Recursos Adicionales

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Terraform with GitHub Actions](https://learn.hashicorp.com/tutorials/terraform/github-actions)
- [GitHub Environments](https://docs.github.com/en/actions/deployment/targeting-different-environments)

---

**💬 Comparte tu progreso en la comunidad con el hashtag #DevOpsConRoxs**

¡Excelente trabajo automatizando tus despliegues con CI/CD! 🚀🎉