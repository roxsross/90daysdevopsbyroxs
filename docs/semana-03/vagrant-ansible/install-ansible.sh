#!/bin/bash

# Asegura que ~/.local/bin esté en el PATH (importante para virtualenv)
export PATH=$HOME/.local/bin:$PATH

# Crear carpeta de trabajo si no existe
cd $HOME

# Instalar pip si no está
if ! command -v pip3 &> /dev/null; then
  echo "pip3 no encontrado. Instalando..."
  sudo apt-get update
  sudo apt-get install -y python3-pip
fi

# Instalar virtualenv si no está
if ! command -v virtualenv &> /dev/null; then
  echo "virtualenv no encontrado. Instalando con pip..."
  pip3 install --user virtualenv
fi

# Crear entorno virtual si no existe
if [ ! -d "$HOME/venv" ]; then
  echo "Creando entorno virtual..."
  virtualenv $HOME/venv
fi

# Activar entorno virtual
source $HOME/venv/bin/activate

# Instalar Ansible en el entorno virtual
pip install --upgrade pip
pip install ansible

# Confirmar instalación
ansible --version
