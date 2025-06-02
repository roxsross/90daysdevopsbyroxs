---
title: Día 25 - Módulos en Terraform
description: Creación y uso de módulos reutilizables en Terraform
sidebar_position: 4
---

## 📦 Módulos en Terraform

![](../../static/images/banner/4.png)

¡Hoy aprenderemos a crear código reutilizable y modular!  
Los **módulos** son la clave para escribir Terraform mantenible, escalable y DRY (Don't Repeat Yourself).

---

## 🧩 ¿Qué son los Módulos?

Los **módulos** en Terraform son:

- 📦 **Contenedores** de múltiples recursos que se usan juntos
- 🔄 **Componentes reutilizables** de infraestructura
- 🏗️ **Abstracciones** que simplifican configuraciones complejas
- 📚 **Bibliotecas** de mejores prácticas

### Tipos de Módulos

1. **Root Module**: El directorio principal donde ejecutas Terraform
2. **Child Modules**: Módulos llamados por otros módulos
3. **Published Modules**: Módulos compartidos en registros públicos

---

## 🏗️ Estructura de un Módulo

Un módulo típico tiene esta estructura:

```
modules/
└── webapp/
    ├── main.tf          # Recursos principales
    ├── variables.tf     # Variables de entrada
    ├── outputs.tf       # Valores de salida
    ├── versions.tf      # Requisitos de versión
    ├── README.md        # Documentación
    └── examples/        # Ejemplos de uso
        └── basic/
            ├── main.tf
            └── variables.tf
```

---

## 🛠️ Creando tu Primer Módulo

Vamos a crear un módulo para desplegar una aplicación web con Docker:

### Estructura del Proyecto
```
terraform-modules/
├── modules/
│   └── docker-webapp/
│       ├── main.tf
│       ├── variables.tf
│       ├── outputs.tf
│       └── README.md
├── examples/
│   ├── simple-webapp/
│   └── full-stack/
└── main.tf
```

### `modules/docker-webapp/variables.tf`
```hcl
# ... (contenido igual que antes)
```

### `modules/docker-webapp/main.tf`
```hcl
# ... (contenido igual que antes)
```

### `modules/docker-webapp/outputs.tf`
```hcl
# ... (contenido igual que antes)
```

---

## 🔧 Usando el Módulo

### Uso Básico
```hcl
# ... (contenido igual que antes)
```

### Uso Avanzado
```hcl
# ... (contenido igual que antes)
```

---

## 📚 Módulos desde el Registry

Terraform tiene un registro público de módulos:

### Usando Módulos Públicos
```hcl
# ... (contenido igual que antes)
```

---

## 🔄 Versionado de Módulos

### Usando Versiones Específicas
```hcl
# ... (contenido igual que antes)
```

### Constraints de Versión
```hcl
# ... (contenido igual que antes)
```

---

## 🏢 Módulos para Equipos

### Estructura Organizacional
```
terraform-modules/
├── modules/
│   ├── networking/
│   │   ├── vpc/
│   │   ├── security-groups/
│   │   └── load-balancer/
│   ├── compute/
│   │   ├── webapp/
│   │   ├── database/
│   │   └── cache/
│   └── shared/
│       ├── monitoring/
│       └── logging/
├── examples/
│   ├── dev-environment/
│   └── prod-environment/
└── README.md
```

Esta estructura permite a los equipos compartir y reutilizar módulos para diferentes propósitos (red, cómputo, almacenamiento, seguridad, etc.), facilitando la colaboración y el mantenimiento.

---

## ✅ Buenas Prácticas con Módulos

- **Documenta** cada módulo con un `README.md` claro.
- Usa **nombres descriptivos** para variables y outputs.
- **Versiona** tus módulos y usa tags en Git.
- Mantén los módulos **pequeños y enfocados** en una sola responsabilidad.
- Usa **validaciones** en variables para evitar errores comunes.
- Proporciona **ejemplos** de uso en la carpeta `examples/`.
- Publica módulos útiles en el [Terraform Registry](https://registry.terraform.io/) si pueden servir a otros.

---

## 📝 Recursos Adicionales

- [Documentación oficial de módulos en Terraform](https://developer.hashicorp.com/terraform/language/modules)
- [Terraform Registry](https://registry.terraform.io/)
- [Ejemplo de módulos en GitHub](https://github.com/terraform-aws-modules)

---

¡Ahora puedes crear, compartir y reutilizar módulos en Terraform para construir infraestructuras más limpias y escalables! 🚀
