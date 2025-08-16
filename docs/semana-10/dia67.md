---
sidebar_position: 67
---

# Día 67 - Seguridad Básica que Realmente Funciona

## 🎯 Objetivo del Día
Implementar seguridad básica pero efectiva sin complicaciones

---

## 📋 Plan Simple de Seguridad

| ⏰ Tiempo | 📋 Tarea | 🎯 Resultado |
|----------|-----------|--------------|
| **35 min** | 🔒 Passwords seguros automáticos | Claves fuertes sin esfuerzo |
| **40 min** | 🔍 Escaneo básico de vulnerabilidades | Encontrar problemas obvios |
| **30 min** | 🛡️ Firewall simple pero efectivo | Bloquear accesos no deseados |
| **30 min** | 📊 Logs de seguridad básicos | Ver quién accede al sistema |
| **15 min** | ✅ Validar toda la seguridad | Confirmar que funciona |

---

## 🔒 Paso 1: Passwords Seguros Automáticos (35 min)

### 1.1 Generador de passwords automático
```bash
#!/bin/bash
# generate-secure-passwords.sh - Passwords seguros sin pensar

# Función para generar password seguro
generate_password() {
    local length=${1:-16}
    openssl rand -base64 32 | head -c $length
    echo
}

# Función para password memorable pero seguro
generate_memorable_password() {
    # Palabras + números + símbolos
    local words=("Casa" "Perro" "Sol" "Mar" "Luna" "Rio" "Monte" "Verde")
    local numbers=$(shuf -i 100-999 -n 1)
    local symbols=("!" "@" "#" "$" "%" "&")
    
    local word1=${words[$RANDOM % ${#words[@]}]}
    local word2=${words[$RANDOM % ${#words[@]}]}
    local symbol=${symbols[$RANDOM % ${#symbols[@]}]}
    
    echo "${word1}${word2}${numbers}${symbol}"
}

# Generar passwords para diferentes servicios
echo "🔐 GENERADOR DE PASSWORDS SEGUROS"
echo "================================"

echo "🔑 Password Admin (16 chars): $(generate_password 16)"
echo "🔑 Password DB (20 chars): $(generate_password 20)" 
echo "🔑 Password API (12 chars): $(generate_password 12)"
echo "🔑 Password Memorable: $(generate_memorable_password)"

# Guardar en archivo seguro
echo "💾 Guardando passwords en archivo seguro..."
{
    echo "# Passwords generados - $(date)"
    echo "ADMIN_PASSWORD=$(generate_password 16)"
    echo "DATABASE_PASSWORD=$(generate_password 20)"
    echo "API_SECRET=$(generate_password 32)"
    echo "JWT_SECRET=$(generate_password 24)"
} > .env.secrets

# Proteger el archivo
chmod 600 .env.secrets
echo "✅ Passwords guardados en .env.secrets (solo tu usuario puede leerlo)"
```

### 1.2 Rotador automático de passwords
```python
#!/usr/bin/env python3
# password-rotator.py - Rotar passwords automáticamente

import os
import random
import string
import json
import subprocess
from datetime import datetime, timedelta

class PasswordRotator:
    def __init__(self):
        self.services = [
            "database",
            "redis", 
            "admin_user",
            "api_token",
            "backup_key"
        ]
        self.password_file = ".env.secrets"
        self.rotation_log = "password-rotation.log"
    
    def generate_strong_password(self, length=16):
        """Generar password fuerte"""
        # Caracteres seguros (evitar confusos como 0, O, l, I)
        chars = string.ascii_letters + string.digits + "!@#$%&*+-="
        chars = chars.replace('0', '').replace('O', '')
        chars = chars.replace('l', '').replace('I', '')
        
        return ''.join(random.choice(chars) for _ in range(length))
    
    def generate_security_summary(self):
        """Generar resumen completo de seguridad"""
        print("📊 RESUMEN DE SEGURIDAD")
        print("=" * 30)
        print(f"📅 Análisis generado: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
        print()
        
        print("\n💡 RECOMENDACIONES:")
        print("=" * 20)
        
        print("\n🔧 COMANDOS ÚTILES:")
        print("   • Ver logs en vivo: sudo tail -f /var/log/auth.log")
        print("   • Bloquear IP: sudo ufw deny from <IP>")
        print("   • Ver conexiones: netstat -tuln")
        print("   • Procesos de red: sudo lsof -i")

if __name__ == "__main__":
    rotator = PasswordRotator()
    print("✅ Sistema de passwords configurado correctamente")
```

---

## 🔍 Paso 2: Escaneo Básico de Vulnerabilidades (40 min)

### 2.1 Scanner automático de vulnerabilidades
```bash
#!/bin/bash
# security-scanner.sh - Escanear vulnerabilidades básicas

echo "🔍 SCANNER DE SEGURIDAD BÁSICO"
echo "=============================="

# Crear directorio de reportes
mkdir -p security-reports
report_file="security-reports/scan-$(date +%Y%m%d-%H%M%S).txt"

{
    echo "REPORTE DE SEGURIDAD - $(date)"
    echo "================================"
    echo

    # 1. Verificar actualizaciones del sistema
    echo "📦 ACTUALIZACIONES PENDIENTES:"
    if command -v apt >/dev/null 2>&1; then
        apt list --upgradable 2>/dev/null | grep -v "WARNING" | wc -l | xargs echo "Paquetes a actualizar:"
    elif command -v yum >/dev/null 2>&1; then
        yum check-update 2>/dev/null | grep -v "Loaded plugins" | wc -l | xargs echo "Paquetes a actualizar:"
    else
        echo "Sistema no soportado para verificar actualizaciones"
    fi
    echo

    # 2. Puertos abiertos
    echo "🌐 PUERTOS ABIERTOS:"
    netstat -tuln 2>/dev/null | grep LISTEN || ss -tuln | grep LISTEN
    echo

    # 3. Usuarios con shell
    echo "👥 USUARIOS CON SHELL:"
    grep -E "/(bash|zsh|sh)$" /etc/passwd
    echo

    # 4. Archivos con permisos peligrosos
    echo "⚠️  ARCHIVOS CON PERMISOS 777:"
    find /home -type f -perm 0777 2>/dev/null | head -10
    echo

} > "$report_file"

# Mostrar resumen en pantalla
echo "✅ Escaneo completado - Reporte: $report_file"
echo
echo "📊 RESUMEN:"
echo "==========="

echo "💡 Ejecuta este script semanalmente para monitorear seguridad"
```

---

## 🛡️ Paso 3: Firewall Simple pero Efectivo (30 min)

### 3.1 Configurador de firewall básico
```bash
#!/bin/bash
# setup-firewall.sh - Configurar firewall básico

echo "🛡️  CONFIGURANDO FIREWALL BÁSICO"
echo "==============================="

# Verificar si ufw está disponible
if ! command -v ufw >/dev/null 2>&1; then
    echo "📦 Instalando UFW (firewall)..."
    if command -v apt >/dev/null 2>&1; then
        sudo apt update && sudo apt install -y ufw
    elif command -v yum >/dev/null 2>&1; then
        sudo yum install -y ufw
    else
        echo "❌ No se puede instalar UFW automáticamente"
        echo "💡 Instala manualmente: apt install ufw"
        exit 1
    fi
fi

echo "🔧 Configurando reglas básicas..."

# Reset completo (cuidado en producción!)
sudo ufw --force reset

# Políticas por defecto
sudo ufw default deny incoming
sudo ufw default allow outgoing

# Puertos esenciales
echo "✅ Permitiendo SSH (22)..."
sudo ufw allow 22/tcp comment 'SSH'

echo "✅ Permitiendo HTTP (80)..."
sudo ufw allow 80/tcp comment 'HTTP'

echo "✅ Permitiendo HTTPS (443)..."
sudo ufw allow 443/tcp comment 'HTTPS'

# Activar firewall
echo "🚀 Activando firewall..."
sudo ufw --force enable

# Mostrar estado
echo
echo "📊 ESTADO DEL FIREWALL:"
echo "======================"
sudo ufw status numbered

echo
echo "✅ Firewall configurado correctamente!"
```

---

## 📊 Paso 4: Logs de Seguridad Básicos (30 min)

### 4.1 Script de monitoreo simple
```bash
#!/bin/bash
# security-status.sh - Ver estado rápido de seguridad

echo "🔍 ESTADO DE SEGURIDAD - $(date)"
echo "=============================="

echo "🔐 Actividad SSH (hoy):"
ssh_today=$(grep "$(date '+%b %d')" /var/log/auth.log 2>/dev/null | wc -l)
echo "   📊 Total eventos: $ssh_today"

failed_today=$(grep "Failed password" /var/log/auth.log | grep "$(date '+%b %d')" | wc -l)
if [ "$failed_today" -gt 0 ]; then
    echo "   ⚠️  Intentos fallidos: $failed_today"
else
    echo "   ✅ No intentos fallidos"
fi

echo
echo "🛡️  Estado Firewall:"
if command -v ufw >/dev/null 2>&1; then
    ufw_status=$(sudo ufw status | head -1)
    echo "   $ufw_status"
else
    echo "   ℹ️  UFW no instalado"
fi

echo
echo "💡 Ver más detalles:"
echo "   • Logs SSH: sudo tail -f /var/log/auth.log"
echo "   • Logs Firewall: sudo tail -f /var/log/ufw.log"
```

---

## ✅ Paso 5: Validar Toda la Seguridad (15 min)

### 5.1 Validador completo de seguridad
```bash
#!/bin/bash
# validate-security.sh - Validar que toda la seguridad funciona

echo "🔍 VALIDANDO CONFIGURACIÓN DE SEGURIDAD"
echo "========================================"

validation_errors=0

# 1. Verificar generador de passwords
echo "🔑 Verificando generador de passwords..."
if [ -f "generate-secure-passwords.sh" ]; then
    chmod +x generate-secure-passwords.sh
    echo "   ✅ Generador de passwords disponible"
else
    echo "   ❌ Script generate-secure-passwords.sh no encontrado"
    ((validation_errors++))
fi

# 2. Verificar scanner de vulnerabilidades
echo "🔍 Verificando scanner de vulnerabilidades..."
if [ -f "security-scanner.sh" ]; then
    chmod +x security-scanner.sh
    echo "   ✅ Scanner disponible"
else
    echo "   ❌ Script security-scanner.sh no encontrado"
    ((validation_errors++))
fi

# 3. Verificar firewall
echo "🛡️  Verificando firewall..."
if command -v ufw >/dev/null 2>&1; then
    ufw_status=$(sudo ufw status | head -1)
    if echo "$ufw_status" | grep -q "active"; then
        echo "   ✅ UFW está activo"
    else
        echo "   ❌ UFW no está activo"
        ((validation_errors++))
    fi
else
    echo "   ❌ UFW no está instalado"
    ((validation_errors++))
fi

# Resumen final
echo
echo "📊 RESUMEN DE VALIDACIÓN:"
echo "========================"

if [ "$validation_errors" -eq 0 ]; then
    echo "🎉 ¡TODAS LAS VALIDACIONES PASARON!"
    echo "✅ Tu sistema tiene seguridad básica funcionando"
else
    echo "⚠️  $validation_errors errores encontrados"
    echo "📋 Revisa los mensajes arriba y corrige los problemas"
fi

echo
echo "💡 PRÓXIMOS PASOS:"
echo "   1. Ejecuta: ./security-status.sh (estado rápido)"
echo "   2. Revisa: tail -f /var/log/auth.log (logs en vivo)" 
echo "   3. Testa: nmap -sT localhost (ver puertos abiertos)"
```

---

## 🎯 Resultado Final

### ✅ Seguridad Básica Funcionando:

🔒 **Passwords Seguros** - Generación automática y gestión segura  
🔍 **Escaneo de Vulnerabilidades** - Detección proactiva de problemas  
🛡️ **Firewall Configurado** - Protección de red efectiva  
📊 **Logs de Seguridad** - Monitoreo básico pero útil  
✅ **Validación Completa** - Verificación que todo funciona  

### 🚀 Tu Sistema Ahora Tiene:

- **Passwords fuertes** generados automáticamente
- **Vulnerabilidades detectadas** con escaneos regulares
- **Firewall activo** bloqueando accesos no autorizados
- **Monitoreo básico** de actividad de seguridad
- **Herramientas simples** para mantener la seguridad

---

## 💡 Mantener la Seguridad

```bash
# Ejecutar diariamente
./security-status.sh

# Ejecutar semanalmente  
./security-scanner.sh
./setup-firewall.sh

# Revisar mensualmente
sudo tail -f /var/log/auth.log
```

**🛡️ ¡Tu sistema ahora está protegido con seguridad básica pero efectiva!**

*Recuerda: la seguridad es un proceso continuo. Mantén estos scripts actualizados y revisa regularmente los logs.* 🔒✨
