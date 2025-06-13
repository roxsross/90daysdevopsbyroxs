#!/bin/bash

set -e

echo "🔄 Actualizando paquetes..."
apt update

echo "📦 Instalando nginx y git..."
apt install -y nginx git

# Página personalizada con contenido DevOps y una imagen sobre Git
cat <<EOF > /var/www/html/index.html
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <title>Felipe Taborda - DevOps en Acción</title>
  <style>
    body { font-family: Arial, sans-serif; background: #f4f6f8; color: #333; margin: 2rem; }
    header { background: #2c3e50; color: #ecf0f1; padding: 1rem 2rem; border-radius: 8px; }
    h1 { margin: 0; }
    section { background: #ffffff; margin-top: 2rem; padding: 1.5rem; border-radius: 8px; box-shadow: 0 0 10px #ccc; }
    footer { margin-top: 3rem; font-size: 0.9rem; color: #666; }
    a { color: #2980b9; text-decoration: none; }
    a:hover { text-decoration: underline; }
    img.git-logo { display: block; margin: 1rem auto; max-width: 200px; }
  </style>
</head>
<body>
  <header>
    <h1>Hola, soy Felipe Taborda</h1>
    <p><em>En camino a ser un crack del DevOps 🚀</em></p>
  </header>

  <section>
    <h2>Gracias ROXS y Bootcamp DevOps</h2>
    <p>Gracias al equipo de <strong>ROXS</strong> y al <strong>Bootcamp DevOps Reto 90 días</strong>, he aprendido muchísimo sobre herramientas, buenas prácticas, automatización, infraestructura como código y mucho más. 🙌</p>
    <p>Este es solo el comienzo. ¡Todavía queda mucho por explorar y dominar durante el bootcamp, y estoy listo para seguir aprendiendo cada día! 💡🔥</p>
  </section>

  <section>
    <h2>Git, la herramienta esencial</h2>
    <p>Git es el sistema de control de versiones más usado en el mundo. Gracias a él, podemos trabajar en equipo, colaborar en proyectos y mantener el control del código en todo momento.</p>
    <img src="https://git-scm.com/images/logos/downloads/Git-Logo-2Color.png" alt="Logo Git" class="git-logo" />
  </section>

  <section>
    <h2>Un dato divertido 🤓</h2>
    <p>¿Sabías que Linus Torvalds creó Git en solo 10 días? Lo hizo en 2005 porque no le gustaban las opciones existentes. ¡Y ahora es la base de todo desarrollo moderno!</p>
  </section>

  <footer>
    <p>Creado por <strong>Felipe Taborda</strong> — Fecha: $(date +"%Y-%m-%d")</p>
    <p>Sigue aprendiendo y versionando tu progreso 💻🚀</p>
  </footer>
</body>
</html>
EOF

echo "🔧 Habilitando y arrancando nginx..."
systemctl enable --now nginx

echo "✅ Página personalizada creada con agradecimiento a ROXS y DevOps Bootcamp."

