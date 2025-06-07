---
sidebar_position: 3
title: DevOps-Project-01
---

# Containers Retail Sample

Este es un ejemplo de aplicación diseñado para ilustrar varios conceptos relacionados con contenedores. Presenta una aplicación e-commerce que incluye un catálogo de productos, un carrito de compras y un proceso de pago.

![Screenshot](https://github.com/aws-containers/retail-store-sample-app/raw/main/docs/images/screenshot.png)

Ofrece:

- Una arquitectura de componentes distribuidos en varios lenguajes y frameworks.
- Utilización de diversos backends de persistencia para diferentes componentes, como MySQL, DynamoDB y Redis.
- La capacidad de ejecutarse en varias tecnologías de orquestación de contenedores como Docker Compose, Kubernetes, etc.
- Imágenes preconstruidas de contenedores para arquitecturas de CPU x86-64 y ARM64.
- Todos los componentes instrumentados para métricas de Prometheus y trazado OpenTelemetry OTLP.
- Soporte para Istio en Kubernetes.
- Generador de carga que ejercita toda la infraestructura.

> Este proyecto está destinado únicamente con fines educativos y no para uso en producción.

## Arquitectura de la Aplicación

La aplicación ha sido deliberadamente sobreingenierizada para generar múltiples componentes desacoplados. Estos componentes generalmente tienen diferentes dependencias de infraestructura y pueden admitir varios "backends" (por ejemplo: el servicio de Carritos admite MongoDB o DynamoDB).

```
.
├── README.md
└── src
    ├── assets
    ├── cart
    ├── catalog
    ├── checkout
    ├── orders
    └── ui
```

![Screenshot](https://github.com/aws-containers/retail-store-sample-app/raw/main/docs/images/architecture.png)

# ¡Dale una Estrella! ⭐
Si estás planeando usar este repositorio para aprender, por favor dale una estrella. ¡Gracias!

> Recuerda documentar los pasos y decisiones tomadas durante la configuraciónde este proyecto ¡Buena suerte!

## Repositorio


Repositorio Oficial [Enlace](https://github.com/aws-containers/retail-store-sample-app)


