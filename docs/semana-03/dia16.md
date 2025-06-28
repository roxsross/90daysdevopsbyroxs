---
title: Día 16 - Build y Testing Básico
description: Automatizando construcción y pruebas de aplicaciones
sidebar_position: 2
---

## 🧪 Build y Tests Automáticos con GitHub Actions

![](../../static/images/banner/3.png)

> "La mejor forma de saber si algo funciona… ¡es testearlo automáticamente!"

Hoy vas a ver cómo **construir y testear tu aplicación automáticamente** cada vez que hacés un cambio. Vas a preparar una app en Python con Flask, escribirle tests, y crear un workflow que la pruebe solo.

---

## 🐍 Paso 1: Crear tu app Python simple

```bash
mkdir mi-app-python
cd mi-app-python
mkdir tests
touch app.py requirements.txt tests/test_app.py
````

### Código base de `app.py`:

```python
from flask import Flask, jsonify
import datetime

app = Flask(__name__)

@app.route('/')
def home():
    return jsonify({
        'message': '¡Hola DevOps con Roxs!',
        'timestamp': datetime.datetime.now().isoformat(),
        'status': 'success'
    })

@app.route('/health')
def health():
    return jsonify({'status': 'healthy', 'uptime': 'running'})

@app.route('/suma/<int:a>/<int:b>')
def suma(a, b):
    return jsonify({
        'operacion': 'suma',
        'numeros': [a, b],
        'resultado': a + b
    })

@app.route('/saludo/<nombre>')
def saludo(nombre):
    return jsonify({
        'saludo': f'¡Hola {nombre}!',
        'mensaje': 'Bienvenido a mi aplicación'
    })

# Funciones para test
def multiplicar(a, b): return a * b
def es_par(n): return n % 2 == 0

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
```

---

## 📦 Paso 2: Agregar dependencias

`requirements.txt`

```
Flask==2.3.3
pytest==7.4.3
pytest-cov==4.1.0
pytest-flask==1.2.0
```

---

## 🧪 Paso 3: Escribir tests

`tests/test_app.py`

```python
import pytest, json
from app import app, multiplicar, es_par

@pytest.fixture
def client():
    app.config['TESTING'] = True
    with app.test_client() as client:
        yield client

def test_home(client):
    r = client.get('/')
    data = json.loads(r.data)
    assert r.status_code == 200
    assert data['status'] == 'success'

def test_health(client):
    r = client.get('/health')
    assert json.loads(r.data)['status'] == 'healthy'

def test_suma(client):
    r = client.get('/suma/3/4')
    assert json.loads(r.data)['resultado'] == 7

def test_saludo(client):
    r = client.get('/saludo/Rox')
    assert '¡Hola Rox!' in r.get_data(as_text=True)

def test_multiplicar(): assert multiplicar(2, 3) == 6
def test_es_par(): assert es_par(4)
```

---

## ⚙️ Paso 4: Tu workflow de CI

`.github/workflows/ci-python.yml`

```yaml
name: CI Básico Python

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest

    steps:
    - name: Checkout
      uses: actions/checkout@v4

    - name: Configurar Python
      uses: actions/setup-python@v4
      with:
        python-version: '3.11'

    - name: Instalar dependencias
      run: |
        pip install -r requirements.txt

    - name: Ejecutar tests
      run: |
        pytest tests/ -v

    - name: Ejecutar con cobertura
      run: |
        pytest --cov=app --cov-report=term --cov-report=html

    - name: Guardar reporte
      uses: actions/upload-artifact@v3
      with:
        name: coverage-report
        path: htmlcov/
```

---

## 🧪 Extra: Múltiples versiones de Python

`.github/workflows/ci-matrix.yml`

```yaml
name: CI Python Matrix

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test-matrix:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        python-version: ['3.9', '3.10', '3.11']

    steps:
    - uses: actions/checkout@v4

    - uses: actions/setup-python@v4
      with:
        python-version: ${{ matrix.python-version }}

    - run: pip install -r requirements.txt
    - run: pytest tests/ -v
```

---

## 🧹 Verificar que la app corre

Agregá este paso para asegurarte de que inicia sin errores:

```yaml
    - name: Verificar app corriendo
      run: |
        timeout 10 python app.py &
        sleep 5
        curl -f http://localhost:5000/health
```

---

## ✅ Tarea del Día

1. Crear tu app en Flask.
2. Escribir al menos 5 tests.
3. Crear el workflow `ci-python.yml`.
4. Ejecutarlo en GitHub.
5. (Opcional) Probar el matrix CI.

📸 Subí una captura a Discord o redes con el resultado usando el hashtag
**#DevOpsConRoxs - Día 16**

---

## 🧠 Revisión rápida

| Pregunta                                      | ✔️ / ❌ |
| --------------------------------------------- | ------ |
| ¿Qué es un test automatizado?                 |        |
| ¿Qué herramientas usamos para testear?        |        |
| ¿Qué hace pytest?                             |        |
| ¿Cómo ves si la app funciona automáticamente? |        |

---

## 🔥 Cierre del Día

¡BOOM!
Hoy no solo escribiste código, sino que lo hiciste **verificable, confiable y profesional**.

Mañana vamos a **empaquetarlo en un contenedor Docker**. Prepárate para que tu app viaje por el mundo.

Nos vemos en el **Día 17** 🌍🐳

