# 📋 TODO API - Gestión Simple de Tareas

Una API REST sencilla para gestionar tareas, diseñada especialmente para estudiantes que están comenzando en el desarrollo web con Node.js y Express.

## 📖 Descripción

Esta API permite gestionar una lista de tareas (TODO list) usando un archivo JSON como base de datos. Es perfecta para aprender los conceptos básicos de APIs REST, operaciones CRUD (Create, Read, Update, Delete) y manejo de archivos en Node.js.

## 🎯 Funcionalidades

- ✅ **Listar tareas**: Obtener todas las tareas o filtrarlas por estado
- ✅ **Crear tareas**: Agregar nuevas tareas a la lista con timestamp automático
- ✅ **Actualizar tareas**: Modificar la descripción y/o estado de una tarea
- ✅ **Eliminar tareas**: Borrar tareas de la lista
- ✅ **Cambiar estado**: Marcar tareas como pendientes, en progreso o completadas
- ✅ **Filtrar por estado**: Ver solo las tareas de un estado específico
- ✅ **Timestamps automáticos**: Registro automático de fechas de creación y actualización

## 📊 Estructura de Tareas

Cada tarea contiene los siguientes campos:

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id` | number | Identificador único de la tarea |
| `title` | string | Título corto de la tarea |
| `description` | string | Descripción detallada de la tarea |
| `status` | number | Estado de la tarea (0, 1, o 2) |
| `createdAt` | string | Fecha y hora de creación (formato ISO 8601) |
| `updatedAt` | string | Fecha y hora de última actualización (formato ISO 8601) |

## 📊 Estados de Tareas

| Código | Estado | Descripción |
|--------|--------|-------------|
| `0` | Pendiente | Tarea que aún no se ha iniciado |
| `1` | En progreso | Tarea que se está trabajando actualmente |
| `2` | Completada | Tarea finalizada |

## 🚀 Instalación y Configuración

### Prerrequisitos

- Node.js (versión 14 o superior)
- npm (viene incluido con Node.js)

### Pasos de Instalación

1. **Clonar o descargar el proyecto**
   ```bash
   git clone <url-del-repositorio>
   cd to-do-api
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Verificar que existe el archivo de tareas**
   
   Asegúrate de que existe el archivo `tasks.json` en la raíz del proyecto. Si no existe, créalo con el siguiente contenido:
   ```json
   [
     { 
       "id": 1, 
       "title": "Aprender Node.JS",
       "description": "Estudiar los fundamentos de Node.js y sus características principales", 
       "status": 2,
       "createdAt": "2025-08-01T10:00:00.000Z",
       "updatedAt": "2025-08-05T15:30:00.000Z"
     },
     { 
       "id": 2, 
       "title": "Crear una API",
       "description": "Desarrollar una API REST completa con operaciones CRUD", 
       "status": 1,
       "createdAt": "2025-08-02T09:15:00.000Z",
       "updatedAt": "2025-08-03T14:20:00.000Z"
     },
     { 
       "id": 3, 
       "title": "Subir el código a GitHub",
       "description": "Crear repositorio y subir el proyecto completo con documentación", 
       "status": 0,
       "createdAt": "2025-08-03T16:45:00.000Z",
       "updatedAt": "2025-08-03T16:45:00.000Z"
     }
   ]
   ```

4. **Iniciar el servidor**
   
   Para producción:
   ```bash
   npm start
   ```
   
   Para desarrollo (con recarga automática usando nodemon):
   ```bash
   npm run dev
   ```

5. **Verificar que funciona**
   
   Abre tu navegador y ve a: `http://localhost:3000`
   
   Deberías ver un mensaje de bienvenida con información de la API.

## 🛠️ Herramientas de Desarrollo

### Nodemon para Desarrollo
El proyecto incluye **nodemon** para desarrollo, que reinicia automáticamente el servidor cuando detecta cambios en los archivos:

```bash
# Usar para desarrollo - reinicio automático
npm run dev

# Usar para producción - sin reinicio automático  
npm start
```

Con nodemon activado, cualquier cambio que hagas en el código se reflejará automáticamente sin necesidad de reiniciar manualmente el servidor.

## 📚 Documentación de la API

### Base URL
```
http://localhost:3000
```

### 🏠 Endpoint de Información

#### `GET /`
Obtiene información general de la API.

**Respuesta:**
```json
{
  "message": "¡Bienvenido a la TODO API!",
  "version": "1.0.0",
  "endpoints": { ... },
  "status_codes": { ... }
}
```

---

### 📝 Endpoints de Tareas

#### `GET /api/tasks`
Obtiene todas las tareas o las filtra por estado.

**Parámetros opcionales:**
- `status` (query): Filtrar por estado (0, 1, o 2)

**Ejemplos:**
```bash
# Obtener todas las tareas
GET http://localhost:3000/api/tasks

# Obtener solo tareas pendientes
GET http://localhost:3000/api/tasks?status=0

# Obtener solo tareas en progreso
GET http://localhost:3000/api/tasks?status=1

# Obtener solo tareas completadas
GET http://localhost:3000/api/tasks?status=2
```

**Respuesta exitosa:**
```json
{
  "success": true,
  "message": "Tareas obtenidas exitosamente",
  "data": [
    {
      "id": 1,
      "title": "Aprender Node.JS",
      "description": "Estudiar los fundamentos de Node.js y sus características principales",
      "status": 2,
      "createdAt": "2025-08-01T10:00:00.000Z",
      "updatedAt": "2025-08-05T15:30:00.000Z"
    },
    {
      "id": 2,
      "title": "Crear una API",
      "description": "Desarrollar una API REST completa con operaciones CRUD",
      "status": 1,
      "createdAt": "2025-08-02T09:15:00.000Z",
      "updatedAt": "2025-08-03T14:20:00.000Z"
    }
  ],
  "total": 2
}
```

---

#### `GET /api/tasks/:id`
Obtiene una tarea específica por su ID.

**Parámetros:**
- `id` (path): ID de la tarea

**Ejemplo:**
```bash
GET http://localhost:3000/api/tasks/1
```

**Respuesta exitosa:**
```json
{
  "success": true,
  "message": "Tarea encontrada",
  "data": {
    "id": 1,
    "title": "Aprender Node.JS",
    "description": "Estudiar los fundamentos de Node.js y sus características principales",
    "status": 2,
    "createdAt": "2025-08-01T10:00:00.000Z",
    "updatedAt": "2025-08-05T15:30:00.000Z"
  }
}
```

**Respuesta si no se encuentra:**
```json
{
  "success": false,
  "message": "Tarea no encontrada"
}
```

---

#### `POST /api/tasks`
Crea una nueva tarea.

**Cuerpo de la petición:**
```json
{
  "title": "Nueva tarea",
  "description": "Descripción detallada de la nueva tarea",
  "status": 0
}
```

**Campos:**
- `title` (obligatorio): Título corto de la tarea
- `description` (obligatorio): Descripción detallada de la tarea
- `status` (opcional): Estado inicial (por defecto: 0)

**Ejemplo:**
```bash
POST http://localhost:3000/api/tasks
Content-Type: application/json

{
  "title": "Estudiar JavaScript",
  "description": "Repasar conceptos avanzados de JavaScript como closures y async/await",
  "status": 0
}
```

**Respuesta exitosa:**
```json
{
  "success": true,
  "message": "Tarea creada exitosamente",
  "data": {
    "id": 4,
    "title": "Estudiar JavaScript",
    "description": "Repasar conceptos avanzados de JavaScript como closures y async/await",
    "status": 0,
    "createdAt": "2025-08-07T10:30:00.000Z",
    "updatedAt": "2025-08-07T10:30:00.000Z"
  }
}
```

---

#### `PUT /api/tasks/:id`
Actualiza una tarea existente (título y/o estado).

**Parámetros:**
- `id` (path): ID de la tarea

**Cuerpo de la petición:**
```json
{
  "title": "Título actualizado",
  "description": "Descripción actualizada",
  "status": 1
}
```

**Campos opcionales:**
- `title`: Nuevo título
- `description`: Nueva descripción
- `status`: Nuevo estado

**Ejemplo:**
```bash
PUT http://localhost:3000/api/tasks/1
Content-Type: application/json

{
  "title": "Dominar Node.JS",
  "description": "Convertirse en experto en Node.js y sus ecosistemas",
  "status": 1
}
```

**Respuesta exitosa:**
```json
{
  "success": true,
  "message": "Tarea actualizada exitosamente",
  "data": {
    "id": 1,
    "title": "Dominar Node.JS",
    "description": "Convertirse en experto en Node.js y sus ecosistemas",
    "status": 1,
    "createdAt": "2025-08-01T10:00:00.000Z",
    "updatedAt": "2025-08-07T10:35:00.000Z"
  }
}
```

---

#### `PATCH /api/tasks/:id/status`
Cambia únicamente el estado de una tarea.

**Parámetros:**
- `id` (path): ID de la tarea

**Cuerpo de la petición:**
```json
{
  "status": 2
}
```

**Ejemplo:**
```bash
PATCH http://localhost:3000/api/tasks/1/status
Content-Type: application/json

{
  "status": 2
}
```

**Respuesta exitosa:**
```json
{
  "success": true,
  "message": "Estado cambiado a \"completada\" exitosamente",
  "data": {
    "id": 1,
    "title": "Dominar Node.JS",
    "description": "Convertirse en experto en Node.js y sus ecosistemas",
    "status": 2,
    "createdAt": "2025-08-01T10:00:00.000Z",
    "updatedAt": "2025-08-07T10:40:00.000Z"
  }
}
```

---

#### `DELETE /api/tasks/:id`
Elimina una tarea.

**Parámetros:**
- `id` (path): ID de la tarea

**Ejemplo:**
```bash
DELETE http://localhost:3000/api/tasks/1
```

**Respuesta exitosa:**
```json
{
  "success": true,
  "message": "Tarea eliminada exitosamente",
  "data": {
    "id": 1,
    "title": "Dominar Node.JS",
    "description": "Convertirse en experto en Node.js y sus ecosistemas",
    "status": 2,
    "createdAt": "2025-08-01T10:00:00.000Z",
    "updatedAt": "2025-08-07T10:40:00.000Z"
  }
}
```

---

## 🧪 Ejemplos de Uso Completos

### 1. Crear una nueva tarea
```bash
curl -X POST http://localhost:3000/api/tasks \
  -H "Content-Type: application/json" \
  -d '{"title": "Hacer ejercicio", "description": "Rutina de ejercicios de 30 minutos", "status": 0}'
```

### 2. Listar todas las tareas
```bash
curl http://localhost:3000/api/tasks
```

### 3. Listar solo tareas pendientes
```bash
curl http://localhost:3000/api/tasks?status=0
```

### 4. Marcar tarea como completada
```bash
curl -X PATCH http://localhost:3000/api/tasks/1/status \
  -H "Content-Type: application/json" \
  -d '{"status": 2}'
```

### 5. Actualizar título, descripción y estado de una tarea
```bash
curl -X PUT http://localhost:3000/api/tasks/1 \
  -H "Content-Type: application/json" \
  -d '{"title": "Hacer ejercicio diario", "description": "Rutina de ejercicios matutinos de 45 minutos", "status": 1}'
```

### 6. Eliminar una tarea
```bash
curl -X DELETE http://localhost:3000/api/tasks/1
```

## 🛠️ Herramientas para Probar la API

### 1. **Navegador Web**
Para peticiones GET, simplemente abre las URLs en tu navegador:
- `http://localhost:3000/`
- `http://localhost:3000/api/tasks`
- `http://localhost:3000/api/tasks/1`

### 2. **Postman**
1. Descarga e instala [Postman](https://www.postman.com/)
2. Crea una nueva colección
3. Agrega peticiones para cada endpoint
4. Configura los headers necesarios (Content-Type: application/json)

### 3. **Thunder Client (Extensión de VS Code)**
1. Instala la extensión "Thunder Client" en VS Code
2. Crea nuevas peticiones desde el panel lateral
3. Configura URLs, métodos HTTP y cuerpos de petición

### 4. **curl (Línea de comandos)**
Usa los ejemplos proporcionados en la sección anterior.

## 📁 Estructura del Proyecto

```
to-do-api/
├── index.js          # Archivo principal de la API
├── package.json      # Configuración del proyecto y dependencias
├── tasks.json        # Base de datos en JSON
├── .gitignore        # Archivos a ignorar en Git
└── README.md         # Este archivo
```

## 🔧 Configuración Avanzada

### Cambiar el Puerto
Para cambiar el puerto donde corre el servidor, modifica la línea en `index.js`:
```javascript
const PORT = 3000; // Cambia 3000 por el puerto que prefieras
```

### Cambiar la Ubicación del Archivo de Tareas
Para usar un archivo diferente, modifica esta línea en `index.js`:
```javascript
const TASKS_FILE = path.join(__dirname, 'tasks.json'); // Cambia 'tasks.json' por tu archivo
```

## ❌ Códigos de Error Comunes

| Código | Significado | Causa Común |
|--------|-------------|-------------|
| 400 | Bad Request | Datos inválidos en la petición |
| 404 | Not Found | Tarea o endpoint no existe |
| 500 | Internal Server Error | Error en el servidor |

### Ejemplos de Respuestas de Error

**Tarea no encontrada:**
```json
{
  "success": false,
  "message": "Tarea no encontrada"
}
```

**Datos inválidos:**
```json
{
  "success": false,
  "message": "El título de la tarea es obligatorio"
}
```

**O si falta la descripción:**
```json
{
  "success": false,
  "message": "La descripción de la tarea es obligatoria"
}
```

**Estado inválido:**
```json
{
  "success": false,
  "message": "Estado inválido. Use 0 (pendiente), 1 (en progreso), o 2 (completada)"
}
```

## 🎓 Conceptos que Aprenderás

Al estudiar este proyecto, aprenderás:

1. **Servidor Web con Express.js**
   - Configuración básica de Express
   - Middleware y su funcionamiento
   - Manejo de rutas y parámetros

2. **API REST**
   - Métodos HTTP (GET, POST, PUT, PATCH, DELETE)
   - Códigos de estado HTTP
   - Estructura de respuestas JSON

3. **Manejo de Archivos**
   - Lectura y escritura de archivos JSON
   - Manejo de errores de archivos

4. **Programación Asíncrona**
   - Callbacks y manejo de errores
   - Operaciones de I/O (Input/Output)

5. **Validación de Datos**
   - Validación de parámetros
   - Manejo de errores de validación

6. **Buenas Prácticas**
   - Estructura de código
   - Comentarios descriptivos
   - Manejo consistente de errores

## 🚀 Próximos Pasos

Una vez que domines esta API básica, puedes expandirla con:

1. **Base de Datos Real**
   - Conectar a MongoDB con Mongoose
   - Usar PostgreSQL con Sequelize

2. **Autenticación**
   - Implementar login/registro
   - Usar JWT (JSON Web Tokens)

3. **Validación Avanzada**
   - Usar librerías como Joi o express-validator

4. **Testing**
   - Escribir tests con Jest
   - Tests de integración

5. **Documentación Automática**
   - Usar Swagger/OpenAPI

## 🤝 Contribuir

Este es un proyecto educativo. Si encuentras errores o tienes sugerencias:

1. Reporta el problema
2. Sugiere mejoras
3. Contribuye con código

## 📄 Licencia

Este proyecto está bajo la Licencia ISC - ver el archivo LICENSE para detalles.

---

**¡Feliz programación! 🎉**

*Este proyecto fue diseñado para estudiantes que están comenzando su viaje en el desarrollo web. Cada línea de código está comentada para facilitar el aprendizaje.*
