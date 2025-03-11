# Habits Tracker Backend

Este es el backend para una aplicación de seguimiento de hábitos construida con Node.js, Express y MongoDB.

## Requisitos

- Node.js (v14 o superior)
- MongoDB

## Instalación

1. Clona el repositorio:
    ```sh
    git clone https://github.com/alejandroggrajeda/habits-tracker.git
    cd habits-tracker-backend
    ```

2. Instala las dependencias:
    ```sh
    npm install
    ```

3. Configura las variables de entorno:
    Crea un archivo [.env] en la raíz del proyecto con el siguiente contenido:
    
    ```env
    MONGO_URI=mongodb+srv://<USUARIO>:<CONTRASEÑA>@cluster0.sm8pq.mongodb.net/habitsApp?retryWrites=true&w=majority&appName=Cluster0
    PORT=3000
    ```

## Ejecución

Para iniciar el servidor, ejecuta el siguiente comando:
```sh
npm start
```

El servidor estará disponible en http://localhost:3000

## Endpoints

### Habits
- GET /habits: Obtiene todos los hábitos.
- POST /habits: Crea un nuevo hábito.
- PUT /habits/:id: Actualiza un hábito existente.
- DELETE /habits/:id: Elimina un hábito.

## Estructura del Proyecto
- app.js: Configuración principal de la aplicación.
- www: Punto de entrada para iniciar el servidor.
- database.js: Configuración de la base de datos.
- Habit.js: Modelo de datos para los hábitos.
- index.js: Rutas principales de la aplicación.
- users.js: Rutas para los usuarios.
- views: Vistas de la aplicación.


