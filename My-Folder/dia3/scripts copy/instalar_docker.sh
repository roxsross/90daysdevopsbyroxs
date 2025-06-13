#!/bin/bash

set -e

echo "🔄 Actualizando paquetes..."
apt update

echo "🐳 Instalando Docker..."
apt install -y docker.io

echo "🔧 Habilitando y arrancando Docker..."
systemctl enable --now docker

echo "📦 Instalando dependencias para snap..."
apt install -y snapd

echo "🧹 Limpiando posible kubectl viejo..."
if [ -f /usr/local/bin/kubectl ]; then
    echo "Eliminando /usr/local/bin/kubectl..."
    rm -f /usr/local/bin/kubectl
fi

echo "🔄 Actualizando hash del shell para evitar cache de comandos..."
hash -r || true

echo "⚙️ Instalando kubectl con snap..."
snap install kubectl --classic

# Asegurar que snap esté en el PATH (por si acaso)
if ! command -v kubectl &> /dev/null; then
    export PATH=$PATH:/snap/bin
fi

echo "✅ Instalaciones completadas."
echo "Versión Docker:"
docker --version

echo "Versión kubectl:"
kubectl version --client

