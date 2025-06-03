---
title: Día 20 - Monitoreo GitHub Actions 
description: Aprender a monitorear aplicaciones con salud y logs básicos
sidebar_position: 6
---

## 📈 Monitoreo y Logs para tu App

![](../../static/images/banner/3.png)

> "Lo que no se mide, no se mejora... y tampoco se arregla si se rompe."

Hoy vas a implementar **health checks**, **logs simples** y una forma de monitorear tu app incluso desde GitHub Actions.

---

## 🩺 ¿Qué es monitorear?

Imaginá que tu app es una tienda física:

| Tienda                         | Aplicación                        |
|-------------------------------|-----------------------------------|
| ¿Está abierta? 🏪             | ¿Está viva la app? (`/health`)    |
| ¿Entra gente? 👥               | ¿Hay tráfico o actividad?         |
| ¿Se vende algo? 💰            | ¿Se completan tareas correctamente? |
| ¿Alarma si hay un problema? 🚨 | ¿Hay logs o alertas de errores?   |

---

## 🔍 Paso 1: Health Check simple

`app/health.js` (versión Node.js)

```js
function checkHealth() {
  return {
    status: "OK",
    timestamp: new Date(),
    message: "¡Mi aplicación está funcionando! 🎉"
  };
}

module.exports = { checkHealth };
````

Agregalo a tu ruta `/health` en `server.js`.

---

## 📓 Paso 2: Logs simples

`app/simple-logger.js`

```js
class SimpleLogger {
  write(level, message) {
    const time = new Date().toISOString();
    const log = `[${time}] [${level.toUpperCase()}] ${message}`;
    console.log(log);
    require('fs').appendFileSync('app.log', log + '\n');
  }

  info(msg) { this.write('info', msg); }
  error(msg) { this.write('error', msg); }
}

module.exports = new SimpleLogger();
```

Y en `server.js`:

```js
const logger = require('./simple-logger');

app.use((req, res, next) => {
  logger.info(`${req.method} ${req.url}`);
  next();
});

app.get('/health', (req, res) => {
  const health = checkHealth();
  logger.info('Health check realizado');
  res.json(health);
});
```

---

## 📦 Paso 3: Logs con Docker

En `docker-compose.yml`:

```yaml
services:
  app:
    ...
    logging:
      driver: "json-file"
      options:
        max-size: "10m"
        max-file: "3"
```

🧪 Comandos útiles:

```bash
docker compose logs
docker compose logs app
docker compose logs -f
docker compose logs --tail=10
```

---

## 🔧 Paso 4: Scripts de monitoreo

`scripts/check-app.sh`

```bash
#!/bin/bash
echo "🔍 Verificando app..."

curl -f http://localhost:3000/ping && echo "✅ Ping OK"
curl -f http://localhost:3000/health && echo "✅ Health OK"
curl -f http://localhost:3000/ && echo "✅ Home OK"
```

---

## ⏱️ Paso 5: GitHub Actions monitoreando

`.github/workflows/monitoreo.yml`

```yaml
name: Monitoreo Simple

on:
  schedule:
    - cron: '0 */2 * * *'  # Cada 2 horas
  workflow_dispatch:

jobs:
  check-app:
    runs-on: ubuntu-latest

    steps:
    - name: Chequear estado
      run: |
        curl -f https://TU-URL.com/health && echo "✅ App OK" || echo "❌ App caída"
```

💡 Tip: Podés agregar envío de alertas a Slack, Discord o email si falla.

---

## ✅ Tarea del Día

1. Implementá `/health` en tu app
2. Agregá logging básico
3. Usá `docker logs` para inspeccionar
4. Agregá un workflow de monitoreo
5. (Opcional) Automatizá alertas

📸 Mostrá tus logs o monitoreo funcionando con **#DevOpsConRoxs - Día 20**

---

## 🧠 Revisión rápida

| Pregunta                                     | ✔️ / ❌ |
| -------------------------------------------- | ------ |
| ¿Qué es un health check?                     |        |
| ¿Cómo se revisan los logs en Docker?         |        |
| ¿Podés hacer monitoreo desde GitHub Actions? |        |

---

## 🔥 Cierre del Día

Hoy aprendiste a **escuchar lo que tu app dice**. Porque una app que habla, es una app que podés cuidar.

Mañana... se viene el gran final de la semana: **CI/CD completo con todo lo aprendido**.
Nos vemos en el **Día 21** 🏁💥


