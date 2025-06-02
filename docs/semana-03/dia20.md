---
title: Día 20 - Monitoreo GitHub Actions 
description: Aprender a monitorear
sidebar_position: 6
---

## Monitoreo y Logs Básicos

![](../../static/images/banner/3.png)

### ¿Por qué Monitorear?
Imagina que tienes una tienda física:
- 🏪 **¿Está abierta?** = ¿Mi aplicación funciona?
- 👥 **¿Cuántos clientes entran?** = ¿Cuántas personas usan mi app?
- 💰 **¿Las ventas van bien?** = ¿Mi aplicación está funcionando correctamente?
- 🚨 **¿Algo está mal?** = ¿Hay errores que debo solucionar?

### Tipos de Monitoreo Básico

#### 1. **¿Está viva mi aplicación?** (Health Check)
```
✅ MI APP FUNCIONA
❌ MI APP ESTÁ CAÍDA
```

#### 2. **¿Qué está pasando?** (Logs)
```
[INFO] Usuario Juan se conectó
[ERROR] No se pudo conectar a la base de datos
[INFO] Tarea creada exitosamente
```

#### 3. **¿Alguien me avisa si algo sale mal?** (Alertas)
```
📧 Email: "Tu aplicación está caída"
💬 Slack: "Error en la base de datos"
```

## 🛠️ Práctica

### Ejercicio 1: Health Check Super Simple

1. **Crear endpoint de salud básico**

   `app/health.js`:
   ```javascript
   // Función simple que verifica si todo está bien
   function checkHealth() {
     const health = {
       status: "OK",
       timestamp: new Date(),
       message: "¡Mi aplicación está funcionando! 🎉"
     };

     // Verificar si podemos conectar a la base de datos
     try {
       // Aquí iría la verificación real de DB
       health.database = "conectada ✅";
     } catch (error) {
       health.status = "ERROR";
       health.database = "desconectada ❌";
       health.error = error.message;
     }

     return health;
   }

   module.exports = { checkHealth };
   ```

2. **Agregar ruta de salud a Express**

   `app/server.js`:
   ```javascript
   const express = require('express');
   const { checkHealth } = require('./health');

   const app = express();

   // Ruta simple de salud
   app.get('/health', (req, res) => {
     const health = checkHealth();
     
     // Si hay error, devolver código 500
     if (health.status === "ERROR") {
       return res.status(500).json(health);
     }
     
     // Si todo está bien, devolver código 200
     res.status(200).json(health);
   });

   // Ruta super simple para verificar que el servidor funciona
   app.get('/ping', (req, res) => {
     res.send('pong! 🏓');
   });

   // Ruta principal
   app.get('/', (req, res) => {
     res.json({
       message: '¡Hola! Mi aplicación funciona 🚀',
       time: new Date()
     });
   });

   const PORT = process.env.PORT || 3000;
   app.listen(PORT, () => {
     console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
   });

   module.exports = app;
   ```

3. **Probar el health check**

   ```bash
   # Iniciar la aplicación
   node server.js

   # En otra terminal, probar los endpoints
   curl http://localhost:3000/ping
   # Respuesta: pong! 🏓

   curl http://localhost:3000/health
   # Respuesta: {"status":"OK","timestamp":"...","message":"¡Mi aplicación está funcionando! 🎉"}
   ```

### Ejercicio 2: Logs Súper Simples

1. **Sistema de logs básico**

   `app/simple-logger.js`:
   ```javascript
   // Logger súper simple
   class SimpleLogger {
     constructor() {
       this.logToFile = true; // Cambiar a false si no quieres archivos
     }

     // Función para escribir log
     writeLog(level, message) {
       const timestamp = new Date().toISOString();
       const logMessage = `[${timestamp}] [${level.toUpperCase()}] ${message}`;
       
       // Mostrar en consola (se ve en Docker logs)
       console.log(logMessage);
       
       // Opcionalmente guardar en archivo
       if (this.logToFile) {
         const fs = require('fs');
         fs.appendFileSync('app.log', logMessage + '\n');
       }
     }

     // Métodos simples para diferentes tipos de log
     info(message) {
       this.writeLog('info', message);
     }

     error(message) {
       this.writeLog('error', message);
     }

     warn(message) {
       this.writeLog('warn', message);
     }
   }

   // Crear una instancia global
   const logger = new SimpleLogger();

   module.exports = logger;
   ```

2. **Usar el logger en la aplicación**

   `app/server.js` (actualizado):
   ```javascript
   const express = require('express');
   const { checkHealth } = require('./health');
   const logger = require('./simple-logger');

   const app = express();

   // Middleware simple para logear todas las requests
   app.use((req, res, next) => {
     logger.info(`${req.method} ${req.url} - IP: ${req.ip}`);
     next();
   });

   app.get('/health', (req, res) => {
     logger.info('Health check solicitado');
     const health = checkHealth();
     
     if (health.status === "ERROR") {
       logger.error(`Health check falló: ${health.error}`);
       return res.status(500).json(health);
     }
     
     logger.info('Health check exitoso');
     res.status(200).json(health);
   });

   app.get('/ping', (req, res) => {
     logger.info('Ping recibido');
     res.send('pong! 🏓');
   });

   app.get('/', (req, res) => {
     logger.info('Página principal visitada');
     res.json({
       message: '¡Hola! Mi aplicación funciona 🚀',
       time: new Date()
     });
   });

   // Capturar errores
   app.use((error, req, res, next) => {
     logger.error(`Error en la aplicación: ${error.message}`);
     res.status(500).json({ error: 'Algo salió mal' });
   });

   const PORT = process.env.PORT || 3000;

   app.listen(PORT, () => {
     logger.info(`Servidor iniciado en puerto ${PORT}`);
   });

   // Capturar cuando se cierra la aplicación
   process.on('SIGTERM', () => {
     logger.info('Aplicación cerrándose...');
     process.exit(0);
   });

   module.exports = app;
   ```

### Ejercicio 3: Docker con Logs Simples

1. **Docker Compose con logs**

   `docker-compose.yml`:
   ```yaml

   services:
     app:
       build: .
       ports:
         - "3000:3000"
       environment:
         - NODE_ENV=development
       volumes:
         - ./logs:/app/logs  # Carpeta para guardar logs
       depends_on:
         - postgres
       # Configuración simple de logs
       logging:
         driver: "json-file"
         options:
           max-size: "10m"      # Máximo 10MB por archivo
           max-file: "3"        # Mantener solo 3 archivos

     postgres:
       image: postgres:15-alpine
       environment:
         - POSTGRES_DB=miapp
         - POSTGRES_USER=postgres
         - POSTGRES_PASSWORD=password123
       volumes:
         - postgres_data:/var/lib/postgresql/data
       # También configurar logs para PostgreSQL
       logging:
         driver: "json-file"
         options:
           max-size: "10m"
           max-file: "3"

   volumes:
     postgres_data:
   ```

2. **Comandos útiles para ver logs**

   ```bash
   # Ver todos los logs
   docker compose logs

   # Ver logs de un servicio específico
   docker compose logs app

   # Ver logs en tiempo real
   docker compose logs -f

   # Ver solo los últimos 10 logs
   docker compose logs --tail=10

   # Ver logs con timestamp
   docker compose logs -t
   ```

### Ejercicio 4: Scripts de Monitoreo Simples

1. **Script para verificar si la app funciona**

   `scripts/check-app.sh`:
   ```bash
   #!/bin/bash

   echo "🔍 Verificando si la aplicación funciona..."

   # URL de la aplicación
   APP_URL="http://localhost:3000"

   # Verificar ping
   echo "📡 Probando ping..."
   if curl -f "$APP_URL/ping" > /dev/null 2>&1; then
       echo "✅ Ping: OK"
   else
       echo "❌ Ping: FAIL"
       exit 1
   fi

   # Verificar health check
   echo "🏥 Probando health check..."
   if curl -f "$APP_URL/health" > /dev/null 2>&1; then
       echo "✅ Health: OK"
   else
       echo "❌ Health: FAIL"
       exit 1
   fi

   # Verificar página principal
   echo "🏠 Probando página principal..."
   if curl -f "$APP_URL/" > /dev/null 2>&1; then
       echo "✅ Página principal: OK"
   else
       echo "❌ Página principal: FAIL"
       exit 1
   fi

   echo "🎉 ¡Todo funciona correctamente!"
   ```

2. **Script para ver estadísticas simples**

   `scripts/simple-stats.sh`:
   ```bash
   #!/bin/bash

   echo "📊 Estadísticas simples de la aplicación"
   echo "========================================"

   # Ver cuántos contenedores están corriendo
   echo "🐳 Contenedores activos:"
   docker ps --format "table {{.Names}}\t{{.Status}}"

   echo ""

   # Ver uso de memoria de los contenedores
   echo "💾 Uso de memoria:"
   docker stats --no-stream --format "table {{.Name}}\t{{.MemUsage}}"

   echo ""

   # Contar logs de errores del día de hoy
   if [ -f "app.log" ]; then
       today=$(date +%Y-%m-%d)
       error_count=$(grep "$today" app.log | grep -c "ERROR" || echo "0")
       echo "🚨 Errores hoy: $error_count"
   else
       echo "📝 No hay archivo de logs"
   fi

   echo ""

   # Verificar espacio en disco
   echo "💽 Espacio en disco:"
   df -h / | tail -1 | awk '{print "Usado: " $3 "/" $2 " (" $5 ")"}'
   ```

### Ejercicio 5: Monitoreo con GitHub Actions

1. **Workflow simple de monitoreo**

   `.github/workflows/simple-monitoring.yml`:
   ```yaml
   name: Monitoreo Simple

   on:
     schedule:
       - cron: '0 */2 * * *'  # Cada 2 horas
     workflow_dispatch:  # También se puede ejecutar manualmente

   jobs:
     check-website:
       runs-on: ubuntu-latest
       
       steps:
       - name: Verificar si el sitio está funcionando
         run: |
           echo "🔍 Verificando sitio web..."
           
           # Cambiar por la URL real de tu aplicación
           WEBSITE_URL="https://mi-aplicacion.com"
           
           # Verificar si responde
           if curl -f --max-time 30 "$WEBSITE_URL/health" > /dev/null 2>&1; then
             echo "✅ Sitio web funciona correctamente"
           else
             echo "❌ Sitio web no responde"
             echo "::error::El sitio web no está funcionando"
             exit 1
           fi

       - name: Notificar si hay problema
         if: failure()
         run: |
           echo "🚨 Se detectó un problema con el sitio web"
           echo "Timestamp: $(date)"
           # Aquí puedes agregar notificaciones a Slack, email, etc.

     check-github-actions:
       runs-on: ubuntu-latest
       
       steps:
       - name: Verificar workflows recientes
         uses: actions/github-script@v7
         with:
           script: |
             // Obtener los últimos 5 workflow runs
             const { data: runs } = await github.rest.actions.listWorkflowRuns({
               owner: context.repo.owner,
               repo: context.repo.repo,
               per_page: 5
             });
             
             console.log('📋 Últimos 5 workflows:');
             
             let failures = 0;
             runs.workflow_runs.forEach((run, index) => {
               const status = run.conclusion === 'success' ? '✅' : '❌';
               console.log(`${index + 1}. ${status} ${run.name} - ${run.conclusion}`);
               
               if (run.conclusion === 'failure') {
                 failures++;
               }
             });
             
             if (failures > 2) {
               core.setFailed(`Demasiados workflows fallando: ${failures}/5`);
             }

   notify-daily:
     runs-on: ubuntu-latest
     if: github.event_name == 'schedule'
     
     steps:
     - name: Reporte diario simple
       run: |
         echo "📊 Reporte diario - $(date)"
         echo "==========================="
         echo "✅ GitHub Actions está funcionando"
         echo "✅ El monitoreo automático está activo"
         echo "📅 Próxima verificación en 2 horas"
   ```

### Ejercicio 6: Herramientas Gratuitas de Monitoreo

1. **UptimeRobot (Gratis)**
   - Ve a https://uptimerobot.com
   - Crea cuenta gratuita
   - Agrega tu sitio web
   - Configura alertas por email

2. **Setup básico:**
   ```
   1. 📝 Registrarse en UptimeRobot
   2. ➕ Agregar nuevo monitor
   3. 🌐 URL: https://tu-aplicacion.com/health
   4. ⏰ Frecuencia: Cada 5 minutos
   5. 📧 Email de alerta: tu-email@gmail.com
   ```

3. **Configuración en la aplicación**

   `app/uptime-check.js`:
   ```javascript
   // Endpoint específico para servicios de uptime
   app.get('/uptime', (req, res) => {
     // Verificación súper simple
     const isHealthy = true; // Aquí puedes agregar lógica real
     
     if (isHealthy) {
       res.status(200).send('UP');
     } else {
       res.status(500).send('DOWN');
     }
   });
   ```

### Ejercicio 7: Alertas Simples

1. **Script de alerta por email (usando curl)**

   `scripts/send-alert.sh`:
   ```bash
   #!/bin/bash

   # Función simple para enviar alerta
   send_alert() {
       local message="$1"
       echo "🚨 ALERTA: $message"
       echo "Timestamp: $(date)"
       
       # Opción 1: Guardar en archivo para revisar después
       echo "[$(date)] ALERT: $message" >> alerts.log
       
       # Opción 2: Enviar a un webhook de Slack (si tienes uno)
       if [ -n "$SLACK_WEBHOOK" ]; then
           curl -X POST -H 'Content-type: application/json' \
             --data "{\"text\":\"🚨 $message\"}" \
             "$SLACK_WEBHOOK"
       fi
   }

   # Usar la función
   if ! curl -f http://localhost:3000/health > /dev/null 2>&1; then
       send_alert "La aplicación no está funcionando"
   fi
   ```

2. **Configurar webhook de Slack (opcional)**
   ```bash
   # En tu .env
   SLACK_WEBHOOK=https://hooks.slack.com/services/YOUR/WEBHOOK/URL
   ```

## ✅ Tareas del Día

### Tarea Principal (Obligatoria)
1. **Agregar health check simple** a tu aplicación
2. **Configurar logs básicos** con el logger simple
3. **Crear script de verificación** que compruebe si funciona
4. **Configurar Docker** con logs limitados

### Tareas Opcionales (Si tienes tiempo)
1. **Registrarse en UptimeRobot** y monitorear tu app
2. **Crear workflow** de monitoreo en GitHub Actions
3. **Configurar alertas** simples
4. **Hacer un dashboard** HTML simple que muestre el estado

## 🎯 Ejemplo Completo Simple

```bash
# 1. Clonar o crear tu aplicación
mkdir mi-app-monitoreada
cd mi-app-monitoreada

# 2. Crear server.js con health check
# (usar el código de arriba)

# 3. Probar localmente
node server.js

# 4. En otra terminal, verificar
curl http://localhost:3000/health

# 5. Ver los logs
cat app.log

# 6. Crear Docker Compose
# (usar el código de arriba)

# 7. Ejecutar con Docker
docker compose up -d

# 8. Verificar logs de Docker
docker compose logs -f
```

## 📊 Dashboard HTML Simple (Bonus)

`public/status.html`:
```html
<!DOCTYPE html>
<html>
<head>
    <title>Estado de Mi App</title>
    <style>
        body { font-family: Arial; margin: 40px; }
        .status { padding: 20px; margin: 10px; border-radius: 5px; }
        .ok { background-color: #d4edda; color: #155724; }
        .error { background-color: #f8d7da; color: #721c24; }
    </style>
</head>
<body>
    <h1>🚀 Estado de Mi Aplicación</h1>
    
    <div id="status" class="status">
        Verificando...
    </div>
    
    <div id="timestamp"></div>
    
    <script>
        function checkStatus() {
            fetch('/health')
                .then(response => response.json())
                .then(data => {
                    const statusDiv = document.getElementById('status');
                    const timestampDiv = document.getElementById('timestamp');
                    
                    if (data.status === 'OK') {
                        statusDiv.className = 'status ok';
                        statusDiv.innerHTML = '✅ Aplicación funcionando correctamente';
                    } else {
                        statusDiv.className = 'status error';
                        statusDiv.innerHTML = '❌ Aplicación con problemas';
                    }
                    
                    timestampDiv.innerHTML = `Última verificación: ${new Date()}`;
                })
                .catch(error => {
                    const statusDiv = document.getElementById('status');
                    statusDiv.className = 'status error';
                    statusDiv.innerHTML = '❌ No se puede conectar a la aplicación';
                });
        }
        
        // Verificar cada 30 segundos
        checkStatus();
        setInterval(checkStatus, 30000);
    </script>
</body>
</html>
```


**¡Mañana integraremos todo en el proyecto final!** 🎯

### Lo Más Importante
1. **Tu aplicación debe tener `/health`** - endpoint que dice si funciona
2. **Logs básicos** - saber qué está pasando
3. **Verificación automática** - script que compruebe el estado
4. **Notificaciones** - ser avisado si algo falla

¡Con esto ya tienes monitoreo básico pero efectivo! 🚀