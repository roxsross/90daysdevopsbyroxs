
# Creación de servidor

## Vagrant

**Vagrant** es una herramienta para la creación de entornos virtualizados a través de comandos y archivos de configuración.

- En la carpeta **docs/semana-03/vagrant-ansible**, se encuentran dos archivos utilizados para crear un servidor con Ansible instalado:

1. **Vagrantfile:** Define las características de la máquina virtual a crear.
2. **install-ansible.sh:** Script para instalar Ansible automáticamente.

---

### Vagrantfile

En este archivo se definen los parámetros necesarios para crear una máquina virtual en VirtualBox, optimizada para trabajar con Ansible y aprovisionada automáticamente mediante un script de Bash.

#### Configuración general de la máquina virtual
```ruby
Vagrant.configure("2") do |config|
...
end
```
- Inicia el bloque de configuración de Vagrant.
- `"2"` indica la versión del archivo de configuración.

#### Imagen base
```ruby
config.vm.box = "ubuntu/jammy64"
```

#### Nombre del host interno
```ruby
config.vm.hostname = "Ansible.com.co"
```
- Se utiliza para la resolución DNS dentro del entorno virtual.

#### Configuración del proveedor (VirtualBox)
```ruby
config.vm.provider "virtualbox" do |vb|
  vb.name = "Ansible"
end
```
- `vb.name`: Nombre que tendrá la máquina virtual en VirtualBox.

#### Red privada
```ruby
config.vm.network "private_network", ip: "172.16.0.11"
```

#### Tiempo de espera para el arranque de la máquina virtual
```ruby
config.vm.boot_timeout = 600
```

#### Sincronización de carpetas entre el host y la VM
```ruby
config.vm.synced_folder ".", "/vagrant", disabled: true
config.vm.synced_folder "data-web", "/home/vagrant/data-web", type: "rsync", rsync__auto: true
```
- `disabled: true`: Desactiva la sincronización por defecto entre el proyecto local y `/vagrant`.
- `type: "rsync"`: Usa `rsync` para sincronizar la carpeta local `data-web` con `/home/vagrant/data-web` en la VM.
- `rsync__auto: true`: Habilita la sincronización automática al detectar cambios locales.

> Para que la sincronización automática funcione, debes ejecutar en la terminal el comando:
> ```bash
> vagrant rsync-auto
> ```
> Así, cualquier archivo nuevo en `data-web` local se reflejará automáticamente dentro de la máquina virtual.

#### Provisionamiento con Shell
```ruby
config.vm.provision "shell", path: "install-ansible.sh", privileged: false, run: "always"
```
- `path`: Ruta del script `install-ansible.sh` en el entorno local.
- `privileged: false`: El script se ejecuta sin privilegios de superusuario (como el usuario `vagrant`).
- `run: "always"`: El script se ejecuta cada vez que se ejecuta `vagrant up` o `vagrant reload --provision`. Esto permite mantener siempre actualizado el servidor.

---

### install-ansible.sh

Este script automatiza la instalación de Ansible dentro del servidor virtual utilizando un entorno virtual de Python.

Se ejecuta en el paso de [Provisionamiento con Shell](#provisionamiento-con-shell) mencionado anteriormente.

#### PATH inicial
```bash
export PATH=$HOME/.local/bin:$PATH
```
- Asegura que los binarios instalados con `--user` estén disponibles en el entorno. Requerido para `virtualenv`.

#### Ubicación en el directorio del usuario
```bash
cd $HOME
```

#### Instalación de pip
```bash
if ! command -v pip3 &> /dev/null; then
  echo "pip3 no encontrado. Instalando..."
  sudo apt-get update
  sudo apt-get install -y python3-pip
fi
```

#### Instalación de virtualenv
```bash
if ! command -v virtualenv &> /dev/null; then
  echo "virtualenv no encontrado. Instalando con pip..."
  pip3 install --user virtualenv
fi
```

#### Creación del entorno virtual
```bash
if [ ! -d "$HOME/venv" ]; then
  echo "Creando entorno virtual..."
  virtualenv $HOME/venv
fi
```

#### Activación del entorno virtual
```bash
source $HOME/venv/bin/activate
```

#### Instalación de Ansible y verificación
```bash
pip install --upgrade pip
pip install ansible
ansible --version
```
