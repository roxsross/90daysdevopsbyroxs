---
title: Día 22 -  Introducción a Terraform
description: Introducción a Terraform - Infrastructure as Code
sidebar_position: 1
---

## 🚀 Introducción a Terraform

![](../../static/images/banner/4.png)

¡Bienvenido a la **Semana 4** del desafío **90 Días de DevOps con Roxs**!  
Esta semana nos adentramos en el mundo de **Infrastructure as Code (IaC)** con **Terraform**, y aprenderemos a gestionar contenedores Docker de forma declarativa.


---

## 🤔 ¿Qué es Terraform?

**Terraform** es una herramienta de **Infrastructure as Code (IaC)** desarrollada por **HashiCorp** que permite:

- 📝 **Definir infraestructura** usando código declarativo
- 🔄 **Versionar** tu infraestructura como código
- 🌍 **Gestionar recursos** en múltiples proveedores de nube
- 🔀 **Planificar cambios** antes de aplicarlos
- 🧹 **Destruir recursos** de forma controlada

---

## 🏗️ Conceptos Fundamentales

### Infrastructure as Code (IaC)
- **Problema**: Configuración manual, inconsistente y propensa a errores
- **Solución**: Infraestructura definida como código
- **Beneficios**: Reproducible, versionable, auditable

### Terraform vs. Otras Herramientas

| Herramienta | Tipo | Enfoque | Proveedores |
|-------------|------|---------|-------------|
| **Terraform** | Declarativo | Multi-proveedor | +3000 providers |
| **CloudFormation** | Declarativo | Solo AWS | AWS únicamente |
| **Ansible** | Imperativo | Configuración | Múltiples |
| **Pulumi** | Declarativo | Lenguajes de programación | Múltiples |

---

## 🛠️ Instalación de Terraform

### Windows (PowerShell)
```powershell
# Usando Chocolatey
choco install terraform

# Usando Scoop
scoop install terraform

# Verificar instalación
terraform version
```

### macOS
```bash
# Usando Homebrew
brew install terraform

# Verificar instalación
terraform version
```

### Linux (Ubuntu/Debian)
```bash
# Descargar y instalar
wget -O- https://apt.releases.hashicorp.com/gpg | sudo gpg --dearmor -o /usr/share/keyrings/hashicorp-archive-keyring.gpg
echo "deb [signed-by=/usr/share/keyrings/hashicorp-archive-keyring.gpg] https://apt.releases.hashicorp.com $(lsb_release -cs) main" | sudo tee /etc/apt/sources.list.d/hashicorp.list
sudo apt update && sudo apt install terraform

# Verificar instalación
terraform version
```

---

## 📁 Estructura de un Proyecto Terraform

Un proyecto típico de Terraform tiene esta estructura:

```
mi-proyecto-terraform/
├── main.tf              # Configuración principal
├── variables.tf         # Definición de variables
├── outputs.tf           # Valores de salida
├── terraform.tfvars     # Valores de variables
├── versions.tf          # Versiones de providers
└── .terraform/          # Archivos internos (no versionar)
```

---

## 🧪 Tu Primer Archivo Terraform

Vamos a crear un ejemplo básico para entender la sintaxis:

### `main.tf`
```hcl
# Configuración del provider
terraform {
  required_version = ">= 1.0"
  required_providers {
    local = {
      source  = "hashicorp/local"
      version = "~> 2.0"
    }
  }
}

# Recurso para crear un archivo
resource "local_file" "hello_terraform" {
  filename = "hello.txt"
  content  = "¡Hola desde Terraform!"
}

# Output para mostrar el nombre del archivo
output "filename" {
  value = local_file.hello_terraform.filename
}
```

---

## 🔧 Comandos Básicos de Terraform

### Inicialización
```bash
# Inicializar el directorio de trabajo
terraform init
```

### Planificación
```bash
# Ver qué cambios se aplicarán
terraform plan
```

### Aplicación
```bash
# Aplicar los cambios
terraform apply
```

### Destrucción
```bash
# Destruir todos los recursos
terraform destroy
```

---

## 💡 Conceptos Clave

### 1. **Providers**
Los providers son plugins que permiten a Terraform interactuar con APIs de servicios:
- `aws` - Amazon Web Services
- `docker` - Docker
- `kubernetes` - Kubernetes
- `local` - Sistema local

### 2. **Resources**
Los resources son los componentes de infraestructura que gestionas:
```hcl
resource "tipo_recurso" "nombre_local" {
  # configuración del recurso
}
```

### 3. **State**
Terraform mantiene un estado (`terraform.tfstate`) que:
- 📋 Mapea configuración con recursos reales
- 🔄 Permite detectar cambios (drift)
- 🏗️ Optimiza operaciones

---

## 🧩 Ejercicio Práctico

### 1. Crear tu primer proyecto
```bash
mkdir mi-primer-terraform
cd mi-primer-terraform
```

### 2. Crear `main.tf`
```hcl
terraform {
  required_providers {
    local = {
      source  = "hashicorp/local"
      version = "~> 2.0"
    }
  }
}

resource "local_file" "devops_file" {
  filename = "devops-day22.txt"
  content  = "Día 22: Aprendiendo Terraform con Roxs\nFecha: ${timestamp()}"
}

output "mensaje" {
  value = "Archivo creado: ${local_file.devops_file.filename}"
}
```

### 3. Ejecutar comandos
```bash
# Inicializar
terraform init

# Planificar
terraform plan

# Aplicar
terraform apply

# Verificar el archivo creado
cat devops-day22.txt
```

---

## 🔍 ¿Qué Aprendiste Hoy?

✅ **Qué es Terraform** y por qué es importante en DevOps  
✅ **Conceptos fundamentales** de Infrastructure as Code  
✅ **Instalación** de Terraform en tu sistema  
✅ **Estructura básica** de un proyecto Terraform  
✅ **Comandos básicos**: init, plan, apply, destroy  
✅ **Tu primer recurso** con el provider local  

---

## 📚 Recursos Adicionales

- [Documentación Oficial de Terraform](https://developer.hashicorp.com/terraform)
- [Terraform Registry](https://registry.terraform.io/)
- [HashiCorp Learn](https://learn.hashicorp.com/terraform)

---

## 🔮 ¿Qué Sigue Mañana?

Mañana en el **Día 23** profundizaremos en:
- Variables y tipos de datos en Terraform
- Locals y expresiones
- Funciones built-in
- Gestión de configuración

---

**💬 Comparte tu progreso en la comunidad con el hashtag #DevOpsConRoxs**

¡Felicitaciones por dar el primer paso en el mundo de Terraform! 🎉