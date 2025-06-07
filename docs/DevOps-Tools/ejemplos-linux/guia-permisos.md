---
sidebar_position: 12
title: Guía de Permisos Linux 
---

# 🔐 Guía de Permisos Linux - Notación Octal y Simbólica

## 📊 Tabla de Referencia de Permisos

| Octal | Simbólico | Descripción |
|-------|-----------|-------------|
| `000` | `----------` | Sin permisos (sin lectura, escritura o ejecución) |
| `100` | `--x------` | Solo ejecución para el propietario |
| `200` | `-w-------` | Solo escritura para el propietario |
| `300` | `-wx------` | Escritura y ejecución para el propietario |
| `400` | `r--------` | Solo lectura para el propietario |
| `500` | `r-x------` | Lectura y ejecución para el propietario |
| `600` | `rw-------` | Lectura y escritura para el propietario (común para archivos privados) |
| `700` | `rwx------` | Acceso completo para el propietario |

## 🔧 Permisos Comúnmente Utilizados

### Archivos de Texto y Documentos
| Octal | Simbólico | Descripción |
|-------|-----------|-------------|
| `644` | `rw-r--r--` | Lectura/escritura para propietario, solo lectura para grupo y otros |
| `655` | `rw-r-xr-x` | Lectura/escritura para propietario, lectura/ejecución para grupo y otros |
| `664` | `rw-rw-r--` | Lectura/escritura para propietario y grupo, solo lectura para otros |

### Permisos de Grupo
| Octal | Simbólico | Descripción |
|-------|-----------|-------------|
| `660` | `rw-rw----` | Lectura/escritura para propietario y grupo, sin acceso para otros |
| `666` | `rw-rw-rw-` | Lectura/escritura para todos (⚠️ no recomendado por seguridad) |

### Archivos Ejecutables
| Octal | Simbólico | Descripción |
|-------|-----------|-------------|
| `700` | `rwx------` | Acceso completo para propietario (ejecutables privados) |
| `744` | `rwxr--r--` | Acceso completo para propietario, solo lectura para grupo y otros |
| `755` | `rwxr-xr-x` | Acceso completo para propietario, lectura/ejecución para grupo y otros |
| `770` | `rwxrwx---` | Acceso completo para propietario y grupo, sin acceso para otros |
| `775` | `rwxrwxr-x` | Acceso completo para propietario y grupo, lectura/ejecución para otros |
| `777` | `rwxrwxrwx` | Acceso completo para todos (⚠️ muy inseguro, no recomendado) |

## 🎯 Puntos Clave

### Estructura de los Permisos
- **Primer dígito:** Permisos del propietario (owner)
- **Segundo dígito:** Permisos del grupo (group)
- **Tercer dígito:** Permisos de otros usuarios (others)

### Valores de Permisos
| Permiso | Valor | Símbolo |
|---------|-------|---------|
| **Lectura (Read)** | `4` | `r` |
| **Escritura (Write)** | `2` | `w` |
| **Ejecución (Execute)** | `1` | `x` |

### Cálculo de Permisos
**Suma de valores:** `rwx = 4+2+1 = 7` (todos los permisos permitidos)

## 💡 Ejemplos Prácticos

### Comandos Básicos
```bash
# Ver permisos actuales
ls -l archivo.txt

# Cambiar permisos usando notación octal
chmod 644 archivo.txt

# Cambiar permisos usando notación simbólica
chmod u+rwx,g+r,o+r archivo.txt

# Cambiar permisos recursivamente
chmod -R 755 directorio/
```

### Casos de Uso Comunes
```bash
# Archivo de configuración privado
chmod 600 ~/.ssh/id_rsa

# Script ejecutable para todos
chmod 755 script.sh

# Directorio compartido de grupo
chmod 770 /shared/project/

# Archivo público de solo lectura
chmod 644 documento.txt
```

## ⚠️ Consideraciones de Seguridad

### ✅ Buenas Prácticas
- **Usar permisos mínimos necesarios**
- **Evitar 777 en archivos públicos**
- **Proteger archivos sensibles con 600**
- **Usar 755 para directorios públicos**

### ❌ Prácticas a Evitar
- **777**: Acceso total para todos (muy inseguro)
- **666**: Escritura para todos los usuarios
- **Permisos excesivos** en archivos del sistema