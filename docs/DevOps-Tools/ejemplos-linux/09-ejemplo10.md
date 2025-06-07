---
sidebar_position: 10
title: Ejemplo 10
---

## MongoDB en una Aplicación Flask

En este tutorial, construirás una pequeña aplicación web que demuestra cómo usar la biblioteca PyMongo para interactuar con una base de datos MongoDB en Python.

**Paso 1 — Configuración de PyMongo y Flask**  
Instala Flask y la biblioteca PyMongo en tu entorno virtual.

1. **Instalar el paquete `python3-venv`**

   ```bash
   sudo apt install -y python3-venv
   ```

2. **Crear y activar el entorno virtual**

   ```bash
   mkdir ~/myproject
   cd ~/myproject
   python3 -m venv myprojectenv
   source myprojectenv/bin/activate
   ```

3. **Instalar Flask y PyMongo**

   ```bash
   pip install Flask flask_pymongo
   ```

**Paso 2 — Instalar MongoDB y Configurar la Aplicación**

**Instalación de MongoDB**

```bash
sudo apt update
curl -fsSL https://www.mongodb.org/static/pgp/server-6.0.asc | sudo gpg --dearmor -o /etc/apt/trusted.gpg.d/mongodb-6.gpg
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list
sudo apt update
sudo apt install -y mongodb-org
sudo systemctl enable --now mongod
```

**Código de la Aplicación**

Crea un archivo llamado `app.py` y agrega el siguiente código:

```python
from flask import Flask, request, jsonify
from flask_pymongo import PyMongo
from bson import ObjectId, json_util

app = Flask(__name__)
app.config['MONGO_URI'] = "mongodb://localhost:27017/crud_db"
connect_db = PyMongo(app)

def convert_id(data):
    if isinstance(data, ObjectId):
        return str(data)
    if isinstance(data, dict):
        for key in data:
            if isinstance(data[key], ObjectId):
                data[key] = str(data[key])
            elif isinstance(data[key], dict):
                data[key] = convert_id(data[key])
    return data

@app.route('/items', methods=['POST'])
def create_item():
    data = request.json
    result = connect_db.db.product.insert_one(data)
    return jsonify({"status": "created successfully", "id": str(result.inserted_id)})

@app.route('/items', methods=['GET'])
def get_items():
    data = connect_db.db.product.find()
    return jsonify([convert_id(item) for item in data])

@app.route('/items/<id>', methods=['GET'])
def get_item(id):
    item = connect_db.db.product.find_one({"_id": ObjectId(id)})
    if item:
        return jsonify(convert_id(item))
    return jsonify({"error": "Item not found"}), 404

@app.route('/items/<id>', methods=['PUT'])
def update_item(id):
    data = request.json
    result = connect_db.db.product.update_one({"_id": ObjectId(id)}, {"$set": data})
    if result.matched_count:
        return jsonify({"status": "updated successfully"})
    return jsonify({"error": "Item not found"}), 404

@app.route('/items/<id>', methods=['DELETE'])
def delete_item(id):
    result = connect_db.db.product.delete_one({"_id": ObjectId(id)})
    if result.deleted_count:
        return jsonify({"status": "deleted successfully"})
    return jsonify({"error": "Item not found"}), 404

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5000)
```

**Paso 3 — Interactuar con la API**

**Crear un ítem:**

```bash
curl -X POST http://localhost:5000/items \
-H "Content-Type: application/json" \
-d '{"name": "John Doe", "age": 30, "place": "New York"}'
```

**Obtener todos los ítems:**

```bash
curl -X GET http://localhost:5000/items
```

**Obtener un ítem específico:**

```bash
curl -X GET http://localhost:5000/items/<id>
```

**Actualizar un ítem específico:**

```bash
curl -X PUT http://localhost:5000/items/<id> \
-H "Content-Type: application/json" \
-d '{"name": "Jane Doe", "age": 31, "place": "Los Angeles"}'
```

**Eliminar un ítem específico:**

```bash
curl -X DELETE http://localhost:5000/items/<id>
```

