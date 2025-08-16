---
title: Día 51 - Tu Primer Dashboard con Grafana
description: Ve métricas reales de tu sistema en gráficos hermosos
sidebar_position: 2
---

## 📊 Tu Primer Dashboard en 30 Minutos

![](../../static/images/banner/8.png)

> "Hoy vas a ver **números de tu computadora convertirse en gráficos hermosos** en tiempo real. ¡Es súper satisfactorio! 📈✨"

### 🎯 **Meta del día:**
- ✅ Grafana funcionando en tu browser
- ✅ Ver al menos 1 gráfico de tu sistema
- ✅ Entender cómo fluyen los datos: Sistema → Prometheus → Grafana

---

## 🤔 **Recordatorio Rápido: ¿Qué vamos a hacer?**

Ayer aprendiste los 3 pilares. Hoy vamos a ver **métricas** en acción:

```
Tu computadora → Node Exporter → Prometheus → Grafana → TU BROWSER
    (genera)      (recolecta)     (almacena)    (grafica)    (ves gráficos)
```

**En español simple:**
1. **Tu computadora** genera números (CPU, RAM, disco)
2. **Node Exporter** los expone en formato que Prometheus entiende
3. **Prometheus** los recolecta cada pocos segundos
4. **Grafana** los convierte en gráficos bonitos
5. **Tú** los ves en el browser y dices "¡WOW!" 🤩

---

## 🐳 **Paso 1: Setup Súper Simple con Docker**

### **Crear la estructura de archivos:**

```bash
mkdir mi-observabilidad
cd mi-observabilidad
```

### **docker-compose.yml** (el más simple del mundo):

```yaml

services:
  # 1. Recolecta métricas de tu sistema
  node-exporter:
    image: prom/node-exporter:latest
    container_name: node-exporter
    ports:
      - "9100:9100"
    command:
      - '--path.rootfs=/host'
    volumes:
      - '/:/host:ro,rslave'
    restart: unless-stopped

  # 2. Almacena las métricas
  prometheus:
    image: prom/prometheus:latest
    container_name: prometheus
    ports:
      - "9090:9090"
    volumes:
      - ./prometheus.yml:/etc/prometheus/prometheus.yml
    restart: unless-stopped

  # 3. Muestra gráficos bonitos
  grafana:
    image: grafana/grafana:latest
    container_name: grafana
    ports:
      - "3000:3000"
    environment:
      - GF_SECURITY_ADMIN_PASSWORD=admin123
    volumes:
      - grafana-storage:/var/lib/grafana
    restart: unless-stopped

volumes:
  grafana-storage:
```

### **prometheus.yml** (configuración mínima):

```yaml
global:
  scrape_interval: 15s  # Cada 15 segundos recolecta datos

scrape_configs:
  # Le dice a Prometheus dónde encontrar métricas
  - job_name: 'node-exporter'
    static_configs:
      - targets: ['node-exporter:9100']
  
  - job_name: 'prometheus'
    static_configs:
      - targets: ['localhost:9090']
```

---

## 🚀 **Paso 2: ¡Arrancar Todo!**

```bash
# Levantar todo el stack
docker compose up -d

# Verificar que todo esté corriendo
docker ps

# Deberías ver 3 contenedores corriendo:
# - grafana (puerto 3000)
# - prometheus (puerto 9090)  
# - node-exporter (puerto 9100)
```

### **Verificar que funciona:**

```bash
# 1. Node Exporter (métricas crudas)
curl http://localhost:9100/metrics | head -20

# Deberías ver algo como:
# node_cpu_seconds_total{cpu="0",mode="idle"} 12345.67
# node_memory_MemTotal_bytes 8.394604e+09

# 2. Prometheus (interface web)
# Abrir en browser: http://localhost:9090

# 3. Grafana (dashboard web)
# Abrir en browser: http://localhost:3000
# Usuario: admin
# Password: admin123
```

---

## 📊 **Paso 3: Configurar Grafana (Paso a Paso)**

### **1. Entrar a Grafana:**
- Ve a: `http://localhost:3000`
- Usuario: `admin`
- Password: `admin123`
- Te va a pedir cambiar la password (podés usar `admin123` de nuevo)

### **2. Agregar Prometheus como Data Source:**

1. **Click en el menú hamburguesa** (☰) → **Connections** → **Data sources**
2. **Click "Add data source"**
3. **Seleccionar "Prometheus"**
4. **URL**: `http://prometheus:9090`
5. **Click "Save & Test"** → Deberías ver ✅ "Data source is working"

### **3. Crear tu primer dashboard:**

1. **Click en "+"** → **Dashboard**
2. **Click "Add visualization"**
3. **Seleccionar "Prometheus"** como data source

---

## 🎯 **Paso 4: Tus Primeros Gráficos**

### **Gráfico 1: CPU Usage** 🔥

**Query para pegar:**
```promql
100 - (avg(rate(node_cpu_seconds_total{mode="idle"}[5m])) * 100)
```

**Configuración:**
- **Panel title**: "CPU Usage %"
- **Unit**: "Percent (0-100)"
- **Min**: 0, **Max**: 100

### **Gráfico 2: Memoria RAM** 💾

**Query para pegar:**
```promql
(1 - (node_memory_MemAvailable_bytes / node_memory_MemTotal_bytes)) * 100
```

**Configuración:**
- **Panel title**: "Memory Usage %"
- **Unit**: "Percent (0-100)"
- **Min**: 0, **Max**: 100

### **Gráfico 3: Espacio en Disco** 💿

**Query para pegar:**
```promql
100 - ((node_filesystem_avail_bytes{mountpoint="/"} / node_filesystem_size_bytes{mountpoint="/"}) * 100)
```

**Configuración:**
- **Panel title**: "Disk Usage %"
- **Unit**: "Percent (0-100)"
- **Min**: 0, **Max**: 100

### **Gráfico 4: Network Traffic** 🌐

**Query para pegar (recibido):**
```promql
rate(node_network_receive_bytes_total{device!="lo"}[5m]) * 8
```

**Query para pegar (enviado):**
```promql
rate(node_network_transmit_bytes_total{device!="lo"}[5m]) * 8
```

**Configuración:**
- **Panel title**: "Network Traffic"
- **Unit**: "bits/sec"

---

## 🧪 **Paso 5: ¡Hacer que los Gráficos Se Muevan!**

### **Test 1: Subir CPU**
```bash
# En una terminal nueva
# Linux/Mac:
stress --cpu 1 --timeout 60s

# Si no tenés stress, usar:
yes > /dev/null &
sleep 10
kill %1

# Windows (PowerShell):
for ($i=0; $i -lt 100000000; $i++) { $x = $i * $i }
```

**¡Mirá el gráfico de CPU subir en tiempo real!** 📈

### **Test 2: Usar Memoria**
```bash
# Crear archivo grande temporal
dd if=/dev/zero of=archivo_grande bs=1M count=500

# Ver gráfico de memoria subir
# Después borrar:
rm archivo_grande
```

### **Test 3: Network Activity**
```bash
# Generar tráfico de red
curl -o archivo_test.zip http://speedtest.ftp.otenet.gr/files/test1Mb.db
rm archivo_test.zip
```

**¡Ver los gráficos reaccionar en tiempo real es SÚPER satisfactorio!** 🎉

---

## 🎨 **Paso 6: Hacer que se Vea Profesional**

### **Personalizar tu dashboard:**

1. **Click en el ícono de configuración** (⚙️) del dashboard
2. **General**:
   - **Title**: "Mi Sistema - Dashboard Personal"
   - **Description**: "Métricas en tiempo real de mi computadora"
   - **Tags**: "sistema", "personal", "monitoring"

3. **Time options**:
   - **Refresh**: "5s" (se actualiza cada 5 segundos)
   - **Time range**: "Last 15 minutes"

4. **Guardar**: Click en 💾 → **Save dashboard**

### **Organizar paneles:**
- **Drag & drop** para mover gráficos
- **Resize** arrastrando las esquinas
- **Duplicate** un panel para experimentar

### **Colores que se ven profesionales:**
- **CPU**: Rojo/Naranja (indica "calor")
- **Memory**: Azul (indica "data")
- **Disk**: Verde/Amarillo (indica "storage")
- **Network**: Púrpura (indica "comunicación")

---

## 🔍 **Paso 7: Explorar Prometheus (Bonus)**

Ve a `http://localhost:9090` y explorá:

### **Queries útiles para probar:**
```promql
# Ver todas las métricas disponibles
{__name__=~"node_.*"}

# CPU por core
node_cpu_seconds_total

# Memoria total en GB
node_memory_MemTotal_bytes / 1024 / 1024 / 1024

# Uptime del sistema
node_time_seconds - node_boot_time_seconds
```

### **Interfaz de Prometheus:**
- **Graph**: Ver métricas en gráfico simple
- **Table**: Ver datos en tabla
- **Status → Targets**: Ver qué está monitoreando

---

## 🛠️ **Troubleshooting Común**

### **❌ "Grafana no carga"**
```bash
# Verificar logs
docker logs grafana

# Reiniciar si es necesario
docker restart grafana
```

### **❌ "No data en los gráficos"**
1. Verificar Prometheus: `http://localhost:9090/targets`
2. Todos los targets deben estar **UP** (verde)
3. Si están DOWN, revisar `prometheus.yml`

### **❌ "Node Exporter no funciona"**
```bash
# En Windows, el volumen no funciona igual
# Usar esta versión simplificada:
```

**docker-compose-windows.yml**:
```yaml
services:
  prometheus:
    image: prom/prometheus:latest
    ports:
      - "9090:9090"
    volumes:
      - ./prometheus-simple.yml:/etc/prometheus/prometheus.yml

  grafana:
    image: grafana/grafana:latest
    ports:
      - "3000:3000"
    environment:
      - GF_SECURITY_ADMIN_PASSWORD=admin123
```

**prometheus-simple.yml**:
```yaml
global:
  scrape_interval: 15s

scrape_configs:
  - job_name: 'prometheus'
    static_configs:
      - targets: ['localhost:9090']
```

---

## 📚 **Conceptos Importantes que Aprendiste Hoy**

### **1. Data Source:**
- Prometheus es el "data source" de Grafana
- Un dashboard puede tener múltiples data sources

### **2. PromQL (Prometheus Query Language):**
- `node_cpu_seconds_total` = métrica cruda
- `rate()` = velocidad de cambio
- `avg()` = promedio
- `* 100` = convertir a porcentaje

### **3. Time Series:**
- Todas las métricas tienen timestamps
- Prometheus almacena historial
- Podés ver "qué pasó hace 1 hora"

### **4. Refresh Rate:**
- Dashboard se actualiza automáticamente
- Configurable: 5s, 30s, 1m, etc.

---

## 🧠 **Revisión del Día**

| Concepto | ¿Lo lograste? | Notas |
|----------|---------------|-------|
| Grafana funcionando en localhost:3000 | ✔️ / ❌ | |
| Ver al menos 1 gráfico con datos | ✔️ / ❌ | |
| Entender flujo: Sistema → Prometheus → Grafana | ✔️ / ❌ | |
| Hacer que un gráfico cambie con activity | ✔️ / ❌ | |
| Personalizar dashboard básicamente | ✔️ / ❌ | |

---

## 🎯 **Mini Challenges (Opcional)**

### **Challenge 1: Metric Explorer**
- Abrí Prometheus: `http://localhost:9090`
- Explorá diferentes métricas que empiecen con `node_`
- Encontrá al menos 3 métricas que no usamos hoy

### **Challenge 2: Dashboard Personal**
- Agregá un panel que muestre la hora actual
- Query: `time()`
- Configuralo como "Stat" en lugar de "Time series"

### **Challenge 3: Stress Test**
- Corré `stress --cpu 2 --memory 1G --timeout 60s`
- Tomá screenshot de tus gráficos durante el stress
- Ver cómo CPU y memoria suben

---

## 💡 **Pro Tips del Día**

### **🎨 Visualization:**
- **Time series**: Para datos que cambian con el tiempo
- **Stat**: Para un número grande actual
- **Gauge**: Para porcentajes (0-100%)
- **Bar gauge**: Para comparar múltiples valores

### **📊 Dashboard Organization:**
- Métricas críticas arriba (CPU, Memory)
- Métricas secundarias abajo (Network, Disk)
- Usar colores consistentes

### **⚡ Performance:**
- No hacer refresh cada 1 segundo (consume recursos)
- 5-30 segundos es perfecto para la mayoría de casos
- Usar time ranges apropiados (15min para debugging, 24h para tendencias)

---

## 🚀 **¿Qué Sigue Mañana?**

**Día 52: Monitorear Aplicaciones Reales**
- Crear una app simple (Flask/Express)
- Agregarle métricas custom
- Ver métricas de TU aplicación en Grafana
- **No solo sistema, sino TU código!**

### **Preparación para mañana:**
- Mantené el stack corriendo: `docker-compose up -d`
- Pensá qué tipo de app te gustaría monitorear
- Guardá tu dashboard de hoy (lo vamos a expandir)

---

## 🎉 **¡Felicitaciones!**

Hoy lograste algo **súper importante**:

✅ **Viste datos reales en gráficos hermosos**
✅ **Entendiste el flujo completo de observabilidad**
✅ **Configuraste un stack profesional**
✅ **Experimentaste con métricas en tiempo real**
✅ **Creaste tu primer dashboard personalizado**

**Esto es exactamente lo que usan las empresas grandes.** Netflix, Google, Facebook - todos usan Prometheus + Grafana (o algo similar).

### **Lo que acabás de aprender vale fácil $10,000+ extra por año en salary.** 💰

📸 **Compartí tu dashboard funcionando con #DevOpsConRoxs - Día 51**

¡Mañana vamos a monitorear aplicaciones reales que VOS escribas! 🚀📊