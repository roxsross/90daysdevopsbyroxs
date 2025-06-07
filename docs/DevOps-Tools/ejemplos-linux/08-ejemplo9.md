---
sidebar_position: 9
title: Ejemplo 09
---

## ¡Despliega Flask de manera sencilla con Gunicorn y Nginx!

En este tutorial, te guiaremos a través del proceso de desplegar una aplicación web Flask Flask es un marco de aplicación web ligero escrito en Python

## 🔋 Características

- Desplegar una aplicación web Flask.
- Usar Gunicorn como el servidor WSGI.
- Configurar Nginx como proxy inverso.


## **Pasos**

### **1. Instalar el Entorno Virtual de Python**

Primero, accede y actualiza la lista de paquetes:

```bash
sudo apt-get update && sudo apt-get upgrade
```

Luego, instala el paquete del entorno virtual de Python:

```bash
sudo apt-get install python3-venv
```

### **2. Configurar el Entorno Virtual**

Crea un nuevo directorio para tu aplicación Flask y navega a él:

```bash
mkdir helloworld
cd helloworld
```

Crea un entorno virtual llamado 'venv':

```bash
python3 -m venv venv
```

Activa el entorno virtual:

```bash
source venv/bin/activate
```

### **3. Instalar Flask**

Dentro del entorno virtual, instala Flask usando pip:

```bash
pip install Flask
```

### **4. Crear una API Flask Simple**

Crea un archivo llamado **`app.py`** 

```bash
sudo vi app.py
```

Y añade el siguiente código:

```python
from flask import Flask

app = Flask(__name__)

@app.route('/')
def hello_world():
    return 'Hello World!'

if __name__ == "__main__":
    app.run()
```

### **5. Verificar la Aplicación Flask**

Ejecuta la aplicación Flask para verificar que funciona:

```bash
python app.py
```

### **6. Ejecutar el Servidor WSGI Gunicorn**

Ejecuta el servidor WSGI Gunicorn para servir la aplicación Flask. Cuando ejecutas Flask, en realidad estás ejecutando el servidor WSGI de desarrollo de Werkzeug, que reenvía las solicitudes desde un servidor web. Dado que Werkzeug es solo para desarrollo, debemos usar Gunicorn, que es un servidor WSGI listo para producción, para servir nuestra aplicación.

Instala Gunicorn usando pip:

```bash
pip install gunicorn
```

Ejecuta Gunicorn para servir la aplicación Flask:

```bash
gunicorn -b 0.0.0.0:8000 app:app
```

**¡Gunicorn está en ejecución (Ctrl + C para salir de gunicorn)!**

Usa systemd para administrar Gunicorn. Systemd es un gestor de inicio para Linux. Lo usamos para reiniciar gunicorn si el server se reinicia o reinicia por alguna razón. Creamos un archivo .service en el directorio /etc/systemd/system y especificamos qué debería suceder con gunicorn cuando el sistema se reinicie. Agregaremos 3 partes al archivo de unidad de systemd: Unit, Service, Install.

Unit — Esta sección es para la descripción del proyecto y algunas dependencias. Service — Para especificar el usuario/grupo con el que queremos ejecutar este servicio. También incluye información sobre los ejecutables y los comandos. Install — Indica a systemd en qué momento durante el proceso de arranque debe comenzar este servicio. Dicho esto, crea un archivo de unidad en el directorio /etc/systemd/system.

### **7. Administrar Gunicorn con systemd**

Crea un archivo de unidad systemd:

```bash
sudo nano /etc/systemd/system/helloworld.service
```

Añade la siguiente configuración:

```
[Unit]
Description=Instancia de Gunicorn para una aplicación simple de hello world
After=network.target

[Service]
User=ubuntu
Group=www-data
WorkingDirectory=/home/ubuntu/helloworld
ExecStart=/home/ubuntu/helloworld/venv/bin/gunicorn -b localhost:8000 app:app
Restart=always

[Install]
WantedBy=multi-user.target
```

Habilita e inicia el servicio:

```bash
sudo systemctl daemon-reload
sudo systemctl start helloworld
sudo systemctl enable helloworld
```

Verifica si la aplicación está en ejecución con:

```bash
curl localhost:8000
```

Ejecuta el servidor web Nginx para aceptar y dirigir las solicitudes a Gunicorn. Finalmente, configuramos Nginx como un proxy inverso para aceptar las solicitudes del usuario y dirigirlas a Gunicorn.

### **8. Configurar Nginx como Proxy Inverso**

Instala Nginx:

```bash
sudo apt-get install nginx
```

Inicia y habilita el servicio de Nginx:

```bash
sudo systemctl start nginx
sudo systemctl enable nginx
```

Edita el archivo de configuración por defecto de Nginx:

```bash
sudo nano /etc/nginx/sites-available/default
```

Añade el siguiente código al principio del archivo (debajo de los comentarios por defecto):

```
upstream flaskhelloworld {
    server 127.0.0.1:8000;
}
```

Añade un proxy_pass a flaskhelloworld en la ubicación /

```
location / {
    proxy_pass http://flaskhelloworld;
}
```

Reinicia Nginx para que los cambios surtan efecto:

```bash
sudo systemctl restart nginx
```

Ahora, tu aplicación Flask debería ser accesible a través de la dirección IP pública


**Python:**
1. **Documentación Oficial de Python**: La Fundación Python mantiene una documentación completa que cubre todos los aspectos de Python, desde temas básicos hasta avanzados.
   - [Enlace a la Documentación](https://www.python.org/doc/)

2. **Python Crash Course de Eric Matthes**: Este libro es excelente para principiantes que quieren empezar con la programación en Python. Cubre los conceptos básicos de la sintaxis de Python y también temas más avanzados.
   - [Enlace al Libro](https://nostarch.com/pythoncrashcourse2e)

3. **Automatiza Tareas Aburridas con Python de Al Sweigart**: Perfecto para quienes están interesados en automatizar tareas usando Python, este libro cubre la programación práctica en Python para principiantes absolutos.
   - [Enlace al Libro](https://automatetheboringstuff.com/)

**Flask:**
1. **Documentación de Flask**: La documentación oficial de Flask es un excelente recurso para aprender Flask. Cubre todo, desde la instalación hasta temas avanzados como Blueprints y Extensiones.
   - [Enlace a la Documentación](https://flask.palletsprojects.com/en/2.1.x/)



2. **Flask Mega-Tutorial por Miguel Grinberg**: Este tutorial en profundidad cubre los conceptos clave de Flask y cómo construir aplicaciones web completas con él.
   - [Enlace al Tutorial](https://www.miguelgrinberg.com/post/the-flask-mega-tutorial-part-i-hello-world)

3. **Aprende Flask en el Curso de Flask de Corey Schafer en YouTube**: Corey Schafer ofrece un curso gratuito y muy bien explicado sobre Flask.
   - [Enlace al Curso en YouTube](https://www.youtube.com/playlist?list=PL-51peG-W8QajbZ-bcqXtpDC2G6O5cpbT)
