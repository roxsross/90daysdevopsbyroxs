---
title: Día 3 - Provisionamiento con Vagrant
description: Automatizando con shell
sidebar_position: 3
---


# 🚀 Vagrant: Automatización con Shell  

![](../../static/images/banner/1.png)

<details>
<summary>📌 <strong>¿Por qué Vagrant?</strong> (¡Click para expandir!)</summary>

Vagrant es tu **"bot mágico"** para:
- Crear máquinas virtuales (VMs) **en segundos** 🏗️  
- **Automatizar entornos** de desarrollo/producción 🔄  
- Usar Shell/Bash para configuraciones iniciales 🐚  

> 💡 **Key Point**: *"Si lo haces más de 2 veces... ¡automatízalo con Vagrant!"*  
</details>

![](https://miro.medium.com/v2/resize:fit:1358/1*oYnuOWQTgN82TizKobZpfw.png)

---

> ⚙️ ¡Vagrant + VirtualBox o VMWare = laboratorio DevOps portátil!

---

## 🎯 ¿Por qué usar Vagrant?

✅ Automatizás el entorno desde cero  
✅ Probás sin miedo (podés destruir y volver a levantar en segundos)  
✅ Es ideal para testear scripts, Ansible, Docker o configuraciones  
✅ ¡Funciona igual en todos los sistemas operativos!

---

## 🔧 **Instalación Rápida**  

### 1. Instalar VirtualBox (Hipervisor)  
```bash
sudo apt update && sudo apt install virtualbox -y  # Debian/Ubuntu
brew install --cask virtualbox  # macOS
```

### 2. Instalar Vagrant  
```bash
sudo apt install vagrant -y  # Linux
brew install vagrant  # macOS
```

### 3. Verificar instalación  
```bash
vagrant --version
# Debe mostrar: Vagrant 2.3.x o superior
```

## 🛠️ **Instalación en Windows**

### 1. Instalar prerequisitos (elige una opción)
#### Opción A: Hyper-V (Recomendado para Windows Pro/Enterprise)
```powershell
# En PowerShell como Administrador
Enable-WindowsOptionalFeature -Online -FeatureName Microsoft-Hyper-V -All
```
#### Opción B: VirtualBox
Descargar instalador desde [virtualbox.org](https://www.virtualbox.org/)

### 2. Instalar Vagrant
Descargar desde [vagrantup.com](https://www.virtualbox.org/) y ejecutar el .msi

### 3. Verificar instalación
```cmd
vagrant --version
:: Debe mostrar: Vagrant 2.3.x+
```
---

## 🚀 **Comandos Esenciales**

| Comando | Descripción |
|---------|-------------|
| `vagrant up` | Inicia la máquina virtual |
| `vagrant ssh` | Conectarse via SSH (necesita cliente como Git Bash) |
| `vagrant halt` | Apagar la VM |
| `vagrant destroy` | Eliminar la VM completamente |
| `vagrant reload --provision` | Reiniciar y re-ejecutar provisionamiento |

---

## 📦 Vagrant Boxes: Arquitectura y Fuentes Oficiales

## 🌐 **Página Oficial de Boxes**
La fuente principal para boxes preconstruidos es el **Vagrant Cloud**:
🔗 [https://app.vagrantup.com/boxes/search](https://app.vagrantup.com/boxes/search)

<details>
<summary>🔍 <strong>¿Qué es un Box?</strong></summary>

Un box es un **paquete portable** que contiene:
- Sistema operativo base (Ubuntu, CentOS, Windows, etc.)
- Configuración mínima para funcionar con Vagrant
- Metadatos de versión y proveedor (VirtualBox, Hyper-V, etc.)
</details>

![](https://codingpackets.com/img/blog/vagrant-from-the-start-to-the-beginning/architecture.svg)

---

## 🏗️ **Arquitectura Técnica de los Boxes**

### 1. **Formatos de Boxes**
| Formato | Descripción | Uso típico |
|---------|-------------|------------|
| `.box` | Paquete comprimido (tar + gzip) | Distribución pública |
| OVA/OVF | Estándar abierto para VMs | Importación/Exportación |
| VHD/VMDK | Discos virtuales nativos | Hyper-V/VMware |

### 2. **Estructura Interna**
```bash
ubuntu-jammy64/
├── Vagrantfile          # Config base
├── metadata.json        # Versión, proveedor
└── virtualbox/          # Directorio específico
    ├── box.ovf          # Descriptor de VM
    ├── *.vmdk           | Discos virtuales
    └── Vagrantfile      | Config extra
```

### 3. **Componentes Clave**
- **metadata.json**: Define nombre, versión y proveedor:
  ```json
  {
    "name": "ubuntu/jammy64",
    "versions": [{
      "version": "20240415.0.0",
      "providers": [{
        "name": "virtualbox",
        "url": "https://example.com/box.virtualbox.box"
      }]
    }]
  }
  ```

---

## 🔧 **Tipos de Boxes por Arquitectura**

### 1. **Por Sistema Operativo**
| Box | Arquitectura | Enlace Oficial |
|------|-------------|----------------|
| `ubuntu/jammy64` | x86_64 | [Ubuntu](https://app.vagrantup.com/ubuntu/boxes/jammy64) |
| `centos/stream8` | x86_64 | [CentOS](https://app.vagrantup.com/centos/boxes/stream8) |
| `generic/alpine38` | ARM64 | [Alpine](https://app.vagrantup.com/generic/boxes/alpine38) |

### 2. **Por Hipervisor**
```ruby
config.vm.box = "debian/bullseye64"
config.vm.box_version = "11.20240325"
config.vm.box_url = "https://app.vagrantup.com/debian/boxes/bullseye64"
```

### 3. **Boxes Multi-Provider**
Ejemplo con soporte para VirtualBox y Parallels:
```json
"providers": [
  {
    "name": "virtualbox",
    "url": "https://example.com/box.vbox.box"
  },
  {
    "name": "parallels",
    "url": "https://example.com/box.parallels.box"
  }
]
```

---

## 🚨 **Mejores Prácticas con Boxes**

1. **Verificar checksums**:
   ```bash
   vagrant box add --checksum-type sha256 --checksum 1234... ubuntu/jammy64
   ```

2. **Usar versionado semántico**:
   ```ruby
   config.vm.box_version = "~> 2024.04"
   ```

3. **Actualizar boxes periódicamente**:
   ```bash
   vagrant box update
   ```

4. **Eliminar boxes antiguos**:
   ```bash
   vagrant box prune
   ```

---

## 🌟 **Boxes Recomendados para DevOps**

1. **Generales**:
   - `ubuntu/focal64` (LTS)
   - `debian/bullseye64`

2. **Contenedores**:
   - `generic/alpine314` (5MB!)
   - `rancher/k3os`

3. **Enterprise**:
   - `centos/stream9`
   - `oraclelinux/9`

🔗 **Lista completa**: [Vagrant Cloud - Official Boxes](https://app.vagrantup.com/boxes/search?utf8=✓&sort=downloads&q=official)


---

## 🏗️ **Tu Primer Vagrantfile**  

Crea un archivo `Vagrantfile` con este contenido:  

```ruby
Vagrant.configure("2") do |config|
  # Usa una imagen ligera de Ubuntu 22.04
  config.vm.box = "ubuntu/jammy64"
  
  # Configuración de red (accesible via IP)
  config.vm.network "private_network", ip: "192.168.33.10"
  
  # Provisionamiento con Shell
  config.vm.provision "shell", inline: <<-SHELL
    echo "¡Hola desde el provisionamiento!" > /tmp/hola.txt
    apt update && apt install -y nginx
    systemctl start nginx
  SHELL
end
```

### 📝 Explicación:  
- **`config.vm.box`**: Imagen base (Ubuntu en este caso).  
- **`config.vm.network`**: Asigna IP privada.  
- **`config.vm.provision`**: Ejecuta comandos Shell al iniciar.  

---

## 🚀 **Comandos Clave de Vagrant**  

| Comando | Descripción |  
|---------|-------------|  
| `vagrant init` | Crea un Vagrantfile básico |  
| `vagrant up` | Inicia la VM (+ provisionamiento) |  
| `vagrant ssh` | Conéctate a la VM por SSH |  
| `vagrant halt` | Apaga la VM |  
| `vagrant destroy` | Elimina la VM (¡cuidado!) |  
| `vagrant provision` | Re-ejecuta el provisionamiento |  

### Ejemplo práctico:  
```bash
vagrant up  # Inicia la VM y ejecuta el Shell provisioner
vagrant ssh  # Accede a la VM
cat /tmp/hola.txt  # Verifica el archivo creado
```

---

## 🛠️ **Provisionamiento Avanzado con Shell**  

### Caso real: Instalar Docker + Kubernetes  
Modifica tu `Vagrantfile`:  

```ruby
config.vm.provision "shell", inline: <<-SHELL
  # Instalar Docker
  apt update
  apt install -y docker.io
  systemctl enable --now docker
  
  # Instalar kubectl
  curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl"
  install -o root -g root -m 0755 kubectl /usr/local/bin/kubectl
  
  # Verificar
  docker --version && kubectl version --client
SHELL
```

### 💡 Pro Tip:  
Usa **scripts externos** para organizar mejor tu código:  
```ruby
config.vm.provision "shell", path: "scripts/instalar_docker.sh"
```

---

## 🔍 **Debugging y Logs**  

- **Ver output del provisionamiento**:  
  ```bash
  vagrant up --provision | tee vagrant.log
  ```

- **Si falla el Shell**:  
  1. Conéctate a la VM: `vagrant ssh`  
  2. Revisa logs en `/var/log/cloud-init-output.log`  

---

## 📂 **Estructura Recomendada de Proyecto**  

```
mi_proyecto/
├── Vagrantfile          # Config principal
├── scripts/            # Scripts de provisionamiento
│   ├── instalar_nginx.sh
│   └── configurar_db.sh
└── README.md           # Documentación
```

---

 ## 📚 **Tarea Opcional del Día 3**  

#### Crea una VM con:  
1. **Nginx** instalado.  
2. Un archivo en `/var/www/html/index.html` con tu nombre.  ó puedes vistar esta web con un monton de [template web](https://startbootstrap.com/themes)
3. Accesible via browser en `http://192.168.33.10`.  

```ruby
# Solución (¡inténtalo antes de ver esto!)
config.vm.provision "shell", inline: <<-SHELL
  apt update && apt install -y nginx
  echo "<h1>Hola, soy [TuNombre]</h1>" > /var/www/html/index.html
SHELL
```

#### Armá tu propio entorno con:

1. Una IP privada distinta
2.  Otro paquete instalado (por ejemplo: `git`, `curl` o `docker.io`)
3. Personalizá el mensaje del `index.html` con tu nombre y fecha

Mostrá tu resultado

* Subí una captura de tu navegador mostrando el `index.html`
* O compartí el contenido de tu `bootstrap.sh` con el hashtag **#DevOpsConRoxs**

---

## 🌟 **Beneficios para DevOps**  
- **Reproducibilidad**: Mismo entorno en todos lados.  
- **Velocidad**: `vagrant destroy && vagrant up` = Entorno nuevo en 1 minuto.  
- **Integración con CI/CD**: Usa Vagrant en pipelines.  

Usá el hashtag **#DevOpsConRoxs** o compartilo en el canal de la comunidad. 🎯

🔜 **Día 4: Automatizando Tareas con Bash Scripting (¡aún más potente!)**  
