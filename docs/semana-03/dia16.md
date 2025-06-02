---
title: Día 16 - Build y Testing con GitHub Actions
description: Build y Testing con GitHub Actions
sidebar_position: 2
---

## Build y Testing con GitHub Actions

![](../../static/images/banner/3.png)

### Build Pipeline
Un pipeline de construcción automatiza el proceso de:
1. **Checkout del código**
2. **Configuración del entorno**
3. **Instalación de dependencias**
4. **Compilación/Build**
5. **Ejecución de tests**
6. **Generación de artifacts**

### Testing Automatizado
- **Unit Tests**: Pruebas de componentes individuales
- **Integration Tests**: Pruebas de integración entre componentes
- **E2E Tests**: Pruebas de extremo a extremo
- **Code Coverage**: Medición de cobertura de código

### Artifacts
Los artifacts son archivos o carpetas que se generan durante un workflow y pueden ser:
- Binarios compilados
- Reportes de tests
- Logs de construcción
- Documentación generada

## 🛠️ Práctica

### Ejercicio 1: Pipeline Node.js

1. **Crear una aplicación Node.js simple**

   `package.json`:
   ```json
   {
     "name": "devops-node-app",
     "version": "1.0.0",
     "description": "App de ejemplo para DevOps",
     "main": "index.js",
     "scripts": {
       "start": "node index.js",
       "test": "jest",
       "lint": "eslint .",
       "build": "npm run lint && npm test"
     },
     "dependencies": {
       "express": "^4.18.2"
     },
     "devDependencies": {
       "jest": "^29.7.0",
       "eslint": "^8.57.0"
     }
   }
   ```

   `index.js`:
   ```javascript
   const express = require('express');
   const app = express();
   const port = process.env.PORT || 3000;

   app.get('/', (req, res) => {
     res.json({ message: 'Hello DevOps with Rox!', timestamp: new Date() });
   });

   app.get('/health', (req, res) => {
     res.json({ status: 'OK', uptime: process.uptime() });
   });

   if (require.main === module) {
     app.listen(port, () => {
       console.log(`Server running on port ${port}`);
     });
   }

   module.exports = app;
   ```

   `index.test.js`:
   ```javascript
   const request = require('supertest');
   const app = require('./index');

   describe('App Tests', () => {
     test('GET / should return welcome message', async () => {
       const response = await request(app).get('/');
       expect(response.status).toBe(200);
       expect(response.body.message).toBe('Hello DevOps with Rox!');
     });

     test('GET /health should return status OK', async () => {
       const response = await request(app).get('/health');
       expect(response.status).toBe(200);
       expect(response.body.status).toBe('OK');
     });
   });
   ```

2. **Workflow para Node.js**

   `.github/workflows/node-ci.yml`:
   ```yaml
   name: Node.js CI

   on:
     push:
       branches: [ main, develop ]
     pull_request:
       branches: [ main ]

   jobs:
     test:
       runs-on: ubuntu-latest

       strategy:
         matrix:
           node-version: [16.x, 18.x, 20.x]

       steps:
       - name: Checkout code
         uses: actions/checkout@v4

       - name: Setup Node.js ${{ matrix.node-version }}
         uses: actions/setup-node@v4
         with:
           node-version: ${{ matrix.node-version }}
           cache: 'npm'

       - name: Install dependencies
         run: npm ci

       - name: Run linter
         run: npm run lint

       - name: Run tests
         run: npm test

       - name: Build application
         run: npm run build

       - name: Upload test results
         uses: actions/upload-artifact@v4
         if: always()
         with:
           name: test-results-${{ matrix.node-version }}
           path: |
             coverage/
             test-results.xml
   ```

### Ejercicio 2: Pipeline Python

1. **Crear aplicación Python**

   `app.py`:
   ```python
   from flask import Flask, jsonify
   import datetime

   app = Flask(__name__)

   @app.route('/')
   def hello():
       return jsonify({
           'message': 'Hello DevOps with Rox!',
           'timestamp': datetime.datetime.now().isoformat()
       })

   @app.route('/health')
   def health():
       return jsonify({'status': 'OK'})

   def add_numbers(a, b):
       return a + b

   if __name__ == '__main__':
       app.run(debug=True)
   ```

   `test_app.py`:
   ```python
   import unittest
   from app import app, add_numbers

   class TestApp(unittest.TestCase):
       def setUp(self):
           self.app = app.test_client()
           self.app.testing = True

       def test_hello_endpoint(self):
           response = self.app.get('/')
           self.assertEqual(response.status_code, 200)
           data = response.get_json()
           self.assertEqual(data['message'], 'Hello DevOps with Rox!')

       def test_health_endpoint(self):
           response = self.app.get('/health')
           self.assertEqual(response.status_code, 200)
           data = response.get_json()
           self.assertEqual(data['status'], 'OK')

       def test_add_numbers(self):
           result = add_numbers(2, 3)
           self.assertEqual(result, 5)

   if __name__ == '__main__':
       unittest.main()
   ```

   `requirements.txt`:
   ```
   Flask==2.3.3
   pytest==7.4.3
   pytest-cov==4.1.0
   flake8==6.1.0
   ```

2. **Workflow para Python**

   `.github/workflows/python-ci.yml`:
   ```yaml
   name: Python CI

   on:
     push:
       branches: [ main, develop ]
     pull_request:
       branches: [ main ]

   jobs:
     test:
       runs-on: ubuntu-latest

       strategy:
         matrix:
           python-version: ["3.9", "3.10", "3.11"]

       steps:
       - name: Checkout code
         uses: actions/checkout@v4

       - name: Set up Python ${{ matrix.python-version }}
         uses: actions/setup-python@v4
         with:
           python-version: ${{ matrix.python-version }}

       - name: Install dependencies
         run: |
           python -m pip install --upgrade pip
           pip install -r requirements.txt

       - name: Lint with flake8
         run: |
           flake8 . --count --select=E9,F63,F7,F82 --show-source --statistics
           flake8 . --count --exit-zero --max-complexity=10 --max-line-length=127 --statistics

       - name: Test with pytest
         run: |
           pytest --cov=app --cov-report=xml

       - name: Upload coverage to artifact
         uses: actions/upload-artifact@v4
         with:
           name: coverage-report-${{ matrix.python-version }}
           path: coverage.xml
   ```

### Ejercicio 3: Pipeline Java con Maven

1. **Crear proyecto Java**

   `pom.xml`:
   ```xml
   <?xml version="1.0" encoding="UTF-8"?>
   <project xmlns="http://maven.apache.org/POM/4.0.0"
            xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
            xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 
            http://maven.apache.org/xsd/maven-4.0.0.xsd">
       <modelVersion>4.0.0</modelVersion>
       
       <groupId>com.devops</groupId>
       <artifactId>devops-java-app</artifactId>
       <version>1.0.0</version>
       <packaging>jar</packaging>
       
       <properties>
           <maven.compiler.source>11</maven.compiler.source>
           <maven.compiler.target>11</maven.compiler.target>
           <junit.version>5.9.2</junit.version>
       </properties>
       
       <dependencies>
           <dependency>
               <groupId>org.junit.jupiter</groupId>
               <artifactId>junit-jupiter</artifactId>
               <version>${junit.version}</version>
               <scope>test</scope>
           </dependency>
       </dependencies>
       
       <build>
           <plugins>
               <plugin>
                   <groupId>org.apache.maven.plugins</groupId>
                   <artifactId>maven-surefire-plugin</artifactId>
                   <version>3.0.0-M9</version>
               </plugin>
           </plugins>
       </build>
   </project>
   ```

   `src/main/java/com/devops/Calculator.java`:
   ```java
   package com.devops;

   public class Calculator {
       public int add(int a, int b) {
           return a + b;
       }
       
       public int subtract(int a, int b) {
           return a - b;
       }
       
       public int multiply(int a, int b) {
           return a * b;
       }
       
       public double divide(int a, int b) {
           if (b == 0) {
               throw new IllegalArgumentException("Division by zero");
           }
           return (double) a / b;
       }
   }
   ```

   `src/test/java/com/devops/CalculatorTest.java`:
   ```java
   package com.devops;

   import org.junit.jupiter.api.Test;
   import static org.junit.jupiter.api.Assertions.*;

   public class CalculatorTest {
       private Calculator calculator = new Calculator();

       @Test
       public void testAdd() {
           assertEquals(5, calculator.add(2, 3));
       }

       @Test
       public void testSubtract() {
           assertEquals(1, calculator.subtract(3, 2));
       }

       @Test
       public void testMultiply() {
           assertEquals(6, calculator.multiply(2, 3));
       }

       @Test
       public void testDivide() {
           assertEquals(2.0, calculator.divide(6, 3));
       }

       @Test
       public void testDivideByZero() {
           assertThrows(IllegalArgumentException.class, () -> calculator.divide(5, 0));
       }
   }
   ```

2. **Workflow para Java**

   `.github/workflows/java-ci.yml`:
   ```yaml
   name: Java CI with Maven

   on:
     push:
       branches: [ main, develop ]
     pull_request:
       branches: [ main ]

   jobs:
     test:
       runs-on: ubuntu-latest

       strategy:
         matrix:
           java-version: ['11', '17', '21']

       steps:
       - name: Checkout code
         uses: actions/checkout@v4

       - name: Set up JDK ${{ matrix.java-version }}
         uses: actions/setup-java@v4
         with:
           java-version: ${{ matrix.java-version }}
           distribution: 'temurin'

       - name: Cache Maven dependencies
         uses: actions/cache@v3
         with:
           path: ~/.m2
           key: ${{ runner.os }}-m2-${{ hashFiles('**/pom.xml') }}
           restore-keys: ${{ runner.os }}-m2

       - name: Run tests
         run: mvn clean test

       - name: Build JAR
         run: mvn clean package

       - name: Upload JAR artifact
         uses: actions/upload-artifact@v4
         with:
           name: jar-artifact-${{ matrix.java-version }}
           path: target/*.jar
   ```

### Ejercicio 4: Pipeline Multi-Lenguaje

`.github/workflows/multi-language.yml`:
```yaml
name: Multi-Language CI

on:
  push:
    branches: [ main ]

jobs:
  detect-changes:
    runs-on: ubuntu-latest
    outputs:
      node: ${{ steps.changes.outputs.node }}
      python: ${{ steps.changes.outputs.python }}
      java: ${{ steps.changes.outputs.java }}
    steps:
    - name: Checkout
      uses: actions/checkout@v4
    - name: Detect changes
      uses: dorny/paths-filter@v2
      id: changes
      with:
        filters: |
          node:
            - 'node/**'
          python:
            - 'python/**'
          java:
            - 'java/**'

  node-ci:
    needs: detect-changes
    if: needs.detect-changes.outputs.node == 'true'
    runs-on: ubuntu-latest
    steps:
    - name: Checkout
      uses: actions/checkout@v4
    - name: Setup Node.js
      uses: actions/setup-node@v4
      with:
        node-version: '18'
    - name: Install and test
      run: |
        cd node
        npm ci
        npm test

  python-ci:
    needs: detect-changes
    if: needs.detect-changes.outputs.python == 'true'
    runs-on: ubuntu-latest
    steps:
    - name: Checkout
      uses: actions/checkout@v4
    - name: Setup Python
      uses: actions/setup-python@v4
      with:
        python-version: '3.11'
    - name: Install and test
      run: |
        cd python
        pip install -r requirements.txt
        pytest

  java-ci:
    needs: detect-changes
    if: needs.detect-changes.outputs.java == 'true'
    runs-on: ubuntu-latest
    steps:
    - name: Checkout
      uses: actions/checkout@v4
    - name: Setup Java
      uses: actions/setup-java@v4
      with:
        java-version: '11'
        distribution: 'temurin'
    - name: Test with Maven
      run: |
        cd java
        mvn clean test
```

## ✅ Tareas del Día

### Tarea Principal
1. **Crear un repositorio con estructura multi-lenguaje**
2. **Implementar los workflows para cada lenguaje**
3. **Probar la matriz de construcción**
4. **Verificar que los artifacts se generen correctamente**

### Tareas Adicionales
1. **Agregar code coverage reporting**
2. **Implementar cache para dependencias**
3. **Crear un workflow que falle si los tests no pasan**
4. **Experimentar con diferentes versiones de lenguajes**

## 🔍 Conceptos Avanzados

### Strategy Matrix
```yaml
strategy:
  matrix:
    os: [ubuntu-latest, windows-latest, macos-latest]
    node-version: [16, 18, 20]
  fail-fast: false
  max-parallel: 6
```

### Conditional Steps
```yaml
- name: Deploy to staging
  if: github.ref == 'refs/heads/develop'
  run: echo "Deploying to staging"

- name: Deploy to production
  if: github.ref == 'refs/heads/main'
  run: echo "Deploying to production"
```

### Caching Dependencies
```yaml
- name: Cache Node modules
  uses: actions/cache@v3
  with:
    path: ~/.npm
    key: ${{ runner.os }}-node-${{ hashFiles('**/package-lock.json') }}
    restore-keys: |
      ${{ runner.os }}-node-
```
Usá el hashtag **#DevOpsConRoxs** o compartilo en el canal de la comunidad. 🎯

**¡Mañana aprenderemos sobre Docker y containerización en GitHub Actions!** 🐳