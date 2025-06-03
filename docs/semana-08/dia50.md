---
title: Día 50 - ¿Qué es Observabilidad? Los 3 Pilares Fundamentales
description: Entiende los conceptos básicos antes de tocar cualquier herramienta
sidebar_position: 1
---

## 👀 ¿Qué es Observabilidad?

![](../../static/images/banner/8.png)

> "No puedes arreglar lo que no puedes ver. La observabilidad es como tener **rayos X para tu aplicación**."

### 🤔 **El problema que resuelve:**

Imaginate esta situación:
- ✅ Tu app funciona perfecto en tu computadora
- ✅ Los tests pasan todos
- ✅ Haces deploy a producción...
- 🔥 **Los usuarios se quejan que está lenta**
- 🔥 **Algunos reportan errores**
- 🔥 **¿Pero QUÉ está pasando exactamente?**

**Sin observabilidad**: Estás volando a ciegas ✈️🙈
**Con observabilidad**: Tenés el panel de control completo ✈️📊

---

## 📊 Los 3 Pilares de la Observabilidad

### 1. 📈 **MÉTRICAS** - "Los Números que Importan"

**¿Qué son?** Números que mides a lo largo del tiempo.

**Ejemplos de la vida real:**
- Velocímetro de tu auto: 80 km/h
- Termómetro: 36.5°C
- Batería del celular: 23%

**Ejemplos en aplicaciones:**
```
🚀 Requests por segundo: 150 req/s
⏱️ Tiempo de respuesta promedio: 200ms
❌ Errores por minuto: 2 errores/min
💾 Uso de memoria: 1.2GB / 4GB
🔄 CPU usage: 45%
👥 Usuarios conectados: 1,847
```

**¿Para qué sirven?**
- Ver tendencias: "El tráfico está subiendo"
- Detectar problemas: "CPU al 95% por 10 minutos"
- Comparar: "Hoy tuvimos 30% más usuarios que ayer"

---

### 2. 📝 **LOGS** - "La Historia de lo que Pasó"

**¿Qué son?** Mensajes que tu aplicación escribe sobre lo que hace.

**Ejemplos de la vida real:**
- Diario personal: "Hoy me levanté a las 7am"
- Historial médico: "Paciente tomó medicamento X a las 14:00"
- Registro de visitantes: "Juan Pérez entró al edificio a las 09:30"

**Ejemplos en aplicaciones:**
```
[2024-06-03 10:30:15] INFO: Usuario juan@email.com se logueó exitosamente
[2024-06-03 10:32:18] ERROR: No se pudo conectar a la base de datos
[2024-06-03 10:33:01] INFO: Pedido #1234 procesado - Total: $156.50
[2024-06-03 10:35:44] WARN: Cola de emails tiene 500+ mensajes pendientes
[2024-06-03 10:36:12] ERROR: Payment gateway timeout para usuario maria@test.com
```

**¿Para qué sirven?**
- Debugging: "¿Qué pasó exactamente cuando falló?"
- Auditoría: "¿Quién accedió a qué y cuándo?"
- Investigación: "¿Por qué este usuario específico tuvo problemas?"

---

### 3. 🔍 **TRACES** - "El Viaje de una Request"

**¿Qué son?** El camino completo que sigue una request por tu sistema.

**Ejemplo de la vida real:**
Cuando pedís una pizza:
```
1. Llamás al local (2 min)
2. Toman tu pedido (3 min)
3. Hacen la pizza (15 min)
4. La mandan (20 min)
5. Llega a tu casa (Total: 40 min)
```

**Ejemplo en aplicaciones:**
```
Request: "Mostrar perfil de usuario"
├── 1. API Gateway (5ms)
├── 2. Servicio de Auth (50ms)
├── 3. Base de datos usuarios (200ms) ← ¡Aquí está el problema!
├── 4. Cache de fotos (15ms)
└── 5. Response final (270ms total)
```

**¿Para qué sirven?**
- Encontrar cuellos de botella: "El 80% del tiempo se va en la DB"
- Entender dependencias: "Este servicio llama a otros 5"
- Optimizar performance: "Si mejoramos X, ganamos 50ms"

---

## 🎯 **¿Cuál es la diferencia con "Monitoring"?**

### **Monitoring tradicional** 📺
- Te dice **QUE** algo está mal
- "Error 500 detectado"
- "CPU al 90%"
- **Es reactivo**: Ya pasó algo malo

### **Observabilidad** 🔬
- Te dice **POR QUÉ** algo está mal
- "Error 500 porque la DB está lenta"
- "CPU al 90% porque hay un memory leak en el servicio X"
- **Es proactivo**: Entendés el sistema completo

**Analogía:** 
- **Monitoring** = Luz roja en el auto 🚨
- **Observabilidad** = Diagnóstico completo del mecánico 🔧

---

## 🛠️ **Práctica Básica - Tus Primeras Observaciones**

### 1. **Ver logs de Docker** (Si tenés Docker)

```bash
# Correr un contenedor simple
docker run -d --name mi-nginx nginx

# Ver los logs en tiempo real
docker logs -f mi-nginx

# Hacer algunas requests
curl http://localhost:80

# ¡Vas a ver los logs apareciendo!
```

### 2. **Métricas de tu sistema** (Cualquier OS)

**En Linux/Mac:**
```bash
# CPU y memoria en tiempo real
htop

# Info del sistema
top

# Espacio en disco
df -h
```

**En Windows:**
```bash
# Abrir Task Manager (Ctrl + Shift + Esc)
# O usar PowerShell
Get-Process | Sort-Object CPU -Descending | Select-Object -First 10
```

### 3. **Tu primer "trace" manual**

Creá un script simple que simule una request:

`mi_trace.sh`:
```bash
#!/bin/bash
echo "[$(date)] 🚀 Request iniciada"
echo "[$(date)] 🔐 Verificando usuario... (simulando 100ms)"
sleep 0.1
echo "[$(date)] 💾 Consultando base de datos... (simulando 200ms)"
sleep 0.2
echo "[$(date)] 🎨 Renderizando página... (simulando 50ms)"
sleep 0.05
echo "[$(date)] ✅ Request completada - Total: ~350ms"
```

```bash
chmod +x mi_trace.sh
./mi_trace.sh
```

---

## 📊 **Las Herramientas Famosas (Solo para que sepas)**

Hoy NO vamos a instalar nada, solo conocerlas:

### **Para Métricas:**
- **Prometheus** 📈 - El más usado para recolectar métricas
- **Grafana** 📊 - Para hacer gráficos bonitos
- **DataDog** 💰 - Solución comercial todo-en-uno

### **Para Logs:**
- **ELK Stack** (Elasticsearch, Logstash, Kibana) 📝
- **Loki** + Grafana 🪵
- **Splunk** 💰 - Muy potente pero caro

### **Para Traces:**
- **Jaeger** 🔍 - Open source, muy popular
- **Zipkin** 🔎 - Otro open source
- **New Relic** 💰 - Comercial con muchas features

**Tranquilo:** Mañana vamos a usar solo Prometheus + Grafana para empezar simple.

---

## 🎮 **Mini Ejercicios para Afianzar Conceptos**

### **Ejercicio 1: Clasificar**
Para cada uno, decí si es Métrica, Log o Trace:

1. "Tiempo promedio de carga de página: 1.2 segundos" → ?
2. "[ERROR] Usuario no encontrado en la base de datos" → ?
3. "Request → Auth Service (50ms) → User DB (150ms) → Response" → ?
4. "Memoria RAM utilizada: 8.2GB / 16GB" → ?
5. "[INFO] Backup completado exitosamente a las 02:00 AM" → ?

<details>
<summary>👁️ Ver respuestas</summary>

1. **Métrica** - Es un número medido a lo largo del tiempo
2. **Log** - Es un mensaje sobre algo que pasó
3. **Trace** - Muestra el camino de una request
4. **Métrica** - Número que cambia con el tiempo
5. **Log** - Mensaje sobre un evento específico

</details>

### **Ejercicio 2: Situaciones**
Para cada problema, ¿qué tipo de observabilidad necesitarías?

1. "Mi app está lenta pero no sé dónde" → ?
2. "Hubo un error ayer a las 3 PM, ¿qué pasó exactamente?" → ?
3. "¿Mi servidor está usando mucha CPU últimamente?" → ?

<details>
<summary>👁️ Ver respuestas</summary>

1. **Traces** - Para ver dónde se demora la request
2. **Logs** - Para investigar qué pasó en un momento específico
3. **Métricas** - Para ver tendencias de uso de CPU

</details>

---

## 🧠 **Revisión Rápida del Día**

| Concepto | ¿Lo entendés? | ¿Para qué sirve? |
|----------|---------------|------------------|
| **Métricas** | ✔️ / ❌ | Números que cambian con el tiempo |
| **Logs** | ✔️ / ❌ | Historia de lo que pasó |
| **Traces** | ✔️ / ❌ | Camino de una request |
| **Observabilidad vs Monitoring** | ✔️ / ❌ | Por qué vs qué |

---

## 💡 **Key Takeaways del Día**

1. **Observabilidad ≠ Monitoring**
   - Monitoring: "Algo está mal"
   - Observabilidad: "Por qué está mal"

2. **Los 3 Pilares trabajan juntos:**
   - Métricas: Detectar problemas
   - Logs: Investigar problemas  
   - Traces: Entender flujos complejos

3. **No es solo para apps grandes:**
   - Hasta una app simple se beneficia
   - Mejor implementar desde el día 1

4. **Es una habilidad súper valorada:**
   - Las empresas pagan muy bien por esto
   - Diferencia entre developers junior y senior

---

## 🚀 **¿Qué sigue mañana?**

**Día 51: Tu primer dashboard con Grafana**
- Instalar Prometheus + Grafana con Docker
- Ver métricas de tu computadora en gráficos bonitos
- Crear tu primer dashboard
- **¡En 30 minutos vas a tener algo visual funcionando!**

### **Preparación opcional para mañana:**
- Asegurate de tener Docker instalado
- Pensá qué métricas de tu sistema te gustaría ver graficadas

---

## 🎉 **¡Felicitaciones!**

Hoy no tocaste código ni instalaste nada complejo, pero lograste algo **súper importante**:

✅ **Entendés los conceptos fundamentales**
✅ **Sabés por qué es importante la observabilidad**  
✅ **Conocés los 3 pilares y para qué sirve cada uno**
✅ **Experimentaste con comandos básicos**

Esto te pone en el **20% superior** de developers que realmente entienden observabilidad conceptualmente antes de tocar herramientas.

📸 **Compartí tu experiencia con #DevOpsConRoxs - Día 50**

¡Mañana vamos a ver todo esto en acción con herramientas reales! 🚀📊