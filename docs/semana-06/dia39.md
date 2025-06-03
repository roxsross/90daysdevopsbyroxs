---
title: Día 39 - Helm Avanzado: Personalización y Publicación de Charts
description: Aprendé a modificar charts, hacer upgrades y publicar tus propios paquetes Helm
sidebar_position: 9
---

## 🧙‍♀️ Día 39: Helm como una Pro

![](../../static/images/banner/6.png)

> “Un chart sin valores customizados es como un café sin azúcar: no sirve para todos.”

Hoy vas a:

- Customizar tu chart usando `values.yaml`
- Usar flags `--set` y `--values` para ambientes
- Hacer upgrades sin downtime
- Publicar tu chart en GitHub Pages

---

## 🎯 Objetivo

- Gestionar diferentes entornos (`dev`, `prod`)
- Aplicar actualizaciones sin perder el estado
- Versionar tu chart
- Hacerlo accesible para otros/as

---

## 🔧 Paso 1: Variables por entorno

🗂️ Estructura sugerida:

```

roxs-chart/
├── values-dev.yaml
├── values-prod.yaml
├── Chart.yaml
└── templates/

````

📄 `values-dev.yaml`

```yaml
replicaCount: 1
image:
  tag: dev
````

📄 `values-prod.yaml`

```yaml
replicaCount: 3
image:
  tag: stable
```

---

## 🚀 Paso 2: Upgrade con valores

```bash
# Desplegar en dev
helm upgrade --install mi-app ./roxs-chart -f values-dev.yaml

# Desplegar en prod
helm upgrade --install mi-app ./roxs-chart -f values-prod.yaml
```

🎯 También podés usar variables inline:

```bash
helm upgrade --install mi-app ./roxs-chart \
  --set replicaCount=2,image.tag=testing
```

---

## 📌 Paso 3: Versionar tu Chart

📄 `Chart.yaml`

```yaml
apiVersion: v2
name: roxs-chart
description: Mi app increíble
type: application
version: 1.2.0
appVersion: "1.2.0"
```

⚠️ Cada vez que lo actualices, cambiá `version`.

---

## 🌍 Paso 4: Publicar tu chart en GitHub Pages

1. Crear carpeta `charts` y mover tu `.tgz`:

```bash
helm package roxs-chart
mkdir -p charts
mv roxs-chart-1.2.0.tgz charts/
```

2. Generar `index.yaml`

```bash
helm repo index charts --url https://TU-USUARIO.github.io/TU-REPO/charts
```

3. Subí `charts/` a tu rama `gh-pages`.

4. ¡Ya tenés tu propio Helm repo!
   Podés instalarlo con:

```bash
helm repo add roxs https://TU-USUARIO.github.io/TU-REPO/charts
helm install roxs-miapp roxs/roxs-chart
```

---

## 🧪 Tarea del Día

1. Crear valores por entorno (dev/prod)
2. Hacer upgrades con diferentes valores
3. Empaquetar tu chart
4. Publicarlo en GitHub Pages
5. Usarlo como si fuera un repo externo

🎁 Bonus: Crear un README en `charts/` explicando cómo instalar tu app
📸 Mostrá tu `helm upgrade` en acción con **#DevOpsConRoxs - Día 39**

---

## 🧠 Revisión rápida

| Pregunta                                 | ✔️ / ❌ |
| ---------------------------------------- | ------ |
| ¿Qué hace `--set` y `--values`?          |        |
| ¿Dónde se define la versión de tu chart? |        |
| ¿Podés usar tu propio Helm repo?         |        |
| ¿Cómo hacés rollback si algo falla?      |        |

---

## ✨ Cierre del Día

Hoy no solo desplegás... ¡ahora también **publicás**!
Helm te da superpoderes para manejar entornos, control de versiones, y compartir tu trabajo con otros/as DevOps. 🧙‍♂️

Nos vemos en el **Día 40** 🚀
