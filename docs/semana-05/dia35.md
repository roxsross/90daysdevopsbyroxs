---
title: Día 35 -  Desafío Final Semana 5
description: Despliega tu aplicación Roxs-voting-app
sidebar_position: 7
---

## 🎯 Desafío Final - ¡Roxs-voting-app en Kubernetes!

![](../../static/images/banner/5.png)

¡Llegaste al momento más emocionante de la semana!  
Hoy vas a desplegar la **aplicación completa roxs-voting-app** en tu clúster local de Kubernetes, aplicando **todos los conceptos aprendidos** esta semana.


---

## 🏗️ Arquitectura de la Aplicación

Recuerda que roxs-voting-app tiene **5 componentes**:


![](https://miro.medium.com/v2/resize:fit:1400/1*rVKG8VcjIislc7sUG9VpaQ.png)

---

## 📋 Plan de Trabajo - ¿Cómo vas a abordarlo?

### 🎯 Estrategia Recomendada

1. **📁 Organización primero**
   - Crear namespace dedicado para la aplicación
   - Pensar en la estructura de archivos

2. **💾 Datos permanentes**
   - Configurar almacenamiento persistente para PostgreSQL
   - Asegurar que los votos no se pierdan

3. **🔧 Configuraciones**
   - Externalizar configuraciones con ConfigMaps
   - Gestionar credenciales con Secrets

4. **🚀 Despliegue por capas**
   - Empezar con la base de datos (PostgreSQL)
   - Continuar con cache (Redis)
   - Luego las aplicaciones (vote, worker, result)

5. **🌐 Conectividad**
   - Services para comunicación interna
   - Acceso externo para frontend

---

## 🛠️ Preparación del Entorno

### Antes de empezar, verifica:

```bash
# ¿Minikube está funcionando?
minikube status

# ¿kubectl responde?
kubectl get nodes

# ¿Tienes las imágenes disponibles?
# vote: roxsross12/vote
# worker: roxsross12/worker
# result: roxsross12/result
# redis: redis:alpine
# postgres: postgres:15-alpine
```

### Estructura de archivos sugerida:
```
voting-app-k8s/
├── 01-namespace.yaml
├── 02-storage.yaml
├── 03-configs-secrets.yaml
├── 04-postgres.yaml
├── 05-redis.yaml
├── 06-vote.yaml
├── 07-worker.yaml
├── 08-result.yaml
└── deploy.sh
```

---

## 📝 Checklist de Componentes

### 📁 1. Namespace y Organización
- [ ] Crear namespace dedicado (ej: `voting-app`)
- [ ] Agregar labels apropiados para organización
- [ ] Considerar si necesitas resource quotas

### 💾 2. Almacenamiento para PostgreSQL
- [ ] PersistentVolume para datos de PostgreSQL
- [ ] PersistentVolumeClaim para solicitar almacenamiento
- [ ] Decidir tamaño apropiado (1-2Gi es suficiente)

### ⚙️ 3. Configuraciones y Secretos
- [ ] ConfigMap con variables de entorno comunes
- [ ] Secret con credenciales de base de datos
- [ ] Variables de conexión entre servicios

### 🗃️ 4. PostgreSQL (Base de Datos)
- [ ] Deployment con 1 réplica
- [ ] Usar imagen `postgres:15-alpine`
- [ ] Montar almacenamiento persistente
- [ ] Service interno (ClusterIP)
- [ ] Variables de entorno desde Secret

### 🔄 5. Redis (Cache)
- [ ] Deployment con 1 réplica
- [ ] Usar imagen `redis:alpine`
- [ ] Service interno (ClusterIP)
- [ ] Sin persistencia (cache temporal)

### 🗳️ 6. Vote App (Frontend)
- [ ] Deployment con 2-3 réplicas
- [ ] Usar imagen `roxsross12/vote`
- [ ] Service externo (NodePort)
- [ ] Conectar con Redis

### ⚙️ 7. Worker (Procesador)
- [ ] Deployment con 1 réplica
- [ ] Usar imagen `roxsross12/worker`
- [ ] Sin service (solo procesa)
- [ ] Conectar con Redis y PostgreSQL

### 📊 8. Result App (Resultados)
- [ ] Deployment con 2 réplicas
- [ ] Usar imagen `roxsross12/result`
- [ ] Service externo (NodePort)
- [ ] Conectar con PostgreSQL

---

## 🔧 Variables de Entorno Importantes

### Para las aplicaciones necesitarás configurar:

```yaml
# Conexiones de base de datos
POSTGRES_HOST: "postgres-service"
POSTGRES_PORT: "5432"
POSTGRES_DB: "votes"
POSTGRES_USER: "postgres"
POSTGRES_PASSWORD: "postgres123"

# Conexiones de Redis
REDIS_HOST: "redis-service"
REDIS_PORT: "6379"
```

---

## 🚀 Estrategia de Despliegue

### Orden sugerido de despliegue:

1. **Infraestructura base**
   ```bash
   kubectl apply -f 01-namespace.yaml
   kubectl apply -f 02-storage.yaml
   kubectl apply -f 03-configs-secrets.yaml
   ```

2. **Servicios de datos**
   ```bash
   kubectl apply -f 04-postgres.yaml
   # Esperar que PostgreSQL esté listo
   kubectl apply -f 05-redis.yaml
   ```

3. **Aplicaciones**
   ```bash
   kubectl apply -f 06-vote.yaml
   kubectl apply -f 07-worker.yaml
   kubectl apply -f 08-result.yaml
   ```

### Verificación entre pasos:
```bash
# Verificar que los pods estén corriendo
kubectl get pods -n voting-app

# Verificar que los services estén activos
kubectl get services -n voting-app

# Ver logs si algo falla
kubectl logs deployment/postgres -n voting-app
```

---

## 🧪 Plan de Testing

### ¿Cómo sabrás que funciona?

1. **✅ Todos los pods en Running**
   ```bash
   kubectl get pods -n voting-app
   ```

2. **✅ Services respondiendo**
   ```bash
   kubectl get services -n voting-app
   ```

3. **✅ Aplicación vote accesible**
   - Acceder vía navegador al NodePort
   - Poder votar entre gato y perro

4. **✅ Worker procesando votos**
   ```bash
   kubectl logs deployment/worker -n voting-app
   ```

5. **✅ Result mostrando resultados**
   - Acceder vía navegador al NodePort
   - Ver los votos reflejados en tiempo real

6. **✅ Persistencia funcionando**
   - Eliminar pods y verificar que datos persisten
   ```bash
   kubectl delete pod -l app=postgres -n voting-app
   # Verificar que votos siguen ahí después de recrearse
   ```

---

## 🎯 Preguntas Guía para el Desarrollo

Mientras trabajas, pregúntate:

### 🤔 Sobre Organización:
- ¿Está todo en el namespace correcto?
- ¿Los nombres de recursos son descriptivos?
- ¿Las labels ayudan a identificar componentes?

### 🤔 Sobre Conectividad:
- ¿Los Services tienen los selectores correctos?
- ¿Los nombres de servicios coinciden en las variables de entorno?
- ¿Los puertos están bien configurados?

### 🤔 Sobre Datos:
- ¿PostgreSQL tiene almacenamiento persistente?
- ¿Las credenciales están en Secrets?
- ¿Las configuraciones están en ConfigMaps?

### 🤔 Sobre Funcionalidad:
- ¿Puedo votar en la interfaz?
- ¿El worker procesa los votos?
- ¿Los resultados se actualizan?

---

## 📊 Métricas de Éxito

Al final del día deberías tener:

### ✅ Infraestructura:
- [ ] 5 deployments corriendo
- [ ] 4 services configurados
- [ ] 1 namespace organizado
- [ ] Almacenamiento persistente funcionando

### ✅ Funcionalidad:
- [ ] Flujo completo de votación funcionando
- [ ] Datos persistiendo entre reinicios
- [ ] Aplicaciones accesibles desde el navegador

### ✅ Mejores Prácticas:
- [ ] Configuraciones externalizadas
- [ ] Secretos protegidos
- [ ] Resources organizados por namespace
- [ ] Labels y selectores correctos

---

## 🆘 Recursos de Ayuda

### Si te atascas:

1. **Revisa los conceptos de la semana**
   - Día 29: Pods y Deployments
   - Día 30: Services  
   - Día 31: ConfigMaps y Secrets
   - Día 32: Volúmenes
   - Día 33: Namespaces

2. **Comandos de debug útiles**
   ```bash
   kubectl describe pod <pod-name> -n voting-app
   kubectl logs <pod-name> -n voting-app
   kubectl get events -n voting-app
   ```

3. **Compara con Docker Compose**
   - ¿Qué variables de entorno usaba?
   - ¿Qué puertos exponía?
   - ¿Cómo se conectaban los servicios?

---

## 🏆 Desafío Extra (Opcional)

Si terminas antes y quieres ir más allá:

- 🔍 **Agregar health checks** a todas las aplicaciones
- 📊 **Configurar resource limits** apropiados
- 🏷️ **Mejorar labels y annotations** para mejor organización
- 📱 **Crear script de deploy automatizado**
- 🧪 **Probar eliminando pods y verificar auto-recovery**

---

## 🎉 ¡Al Finalizar!

Cuando tengas todo funcionando:

1. **📸 Toma screenshots** de:
   - La aplicación vote funcionando
   - Los resultados actualizándose
   - El dashboard de pods corriendo

2. **🐙 Documenta tu experiencia**:
   - ¿Qué fue lo más difícil?
   - ¿Qué aprendiste nuevo?
   - ¿Qué harías diferente?

3. **🚀 Comparte con la comunidad**:
   - Usa el hashtag #DevOpsConRoxs
   - Comparte tus aprendizajes

---

🎯 **¡Este es tu momento!** Tienes todas las herramientas y conocimientos necesarios. Confía en lo que has aprendido esta semana y construye algo increíble.

**¡Vamos a por ese despliegue en Kubernetes!** 🚀

---

*Recuerda: El objetivo no es solo que funcione, sino que entiendas cada parte y por qué la necesitas. Tómate tu tiempo y disfruta el proceso.* ✨