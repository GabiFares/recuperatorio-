````markdown
# FoodCart

## Descripción

FoodCart es una aplicación web que permite a los usuarios pedir alimentos y bebidas en línea. La aplicación está construida utilizando Angular en el frontend y Node.js en el backend, con PostgreSQL como base de datos.

## Tabla de Contenidos

- [Instalación](#instalación)
- [Uso](#uso)
- [Scripts](#scripts)
- [Configuración de Entorno](#configuración-de-entorno)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Dependencias](#dependencias)
- [Contribución](#contribución)
- [Licencia](#licencia)

## Instalación

1. Clona el repositorio:
   ```bash
   git clone https://github.com/tuusuario/foodcart.git
   ```
````

2. Navega al directorio del proyecto:

   ```bash
   cd foodcart
   ```

3. Instala las dependencias del backend:

   ```bash
   cd backend
   npm install
   ```

4. Instala las dependencias del frontend:
   ```bash
   cd ../frontend
   npm install
   ```

## Uso

### Ejecutar la Aplicación en Desarrollo

1. Inicia la base de datos:

   ```bash
   docker-compose up database
   ```

2. Inicia el backend:

   ```bash
   cd backend
   npm run dev
   ```

3. Inicia el frontend:
   ```bash
   cd frontend
   npm start
   ```

La aplicación estará disponible en `http://localhost:4200`.

### Ejecutar la Aplicación con Docker

1. Construye y levanta los contenedores:

   ```bash
   docker-compose up --build
   ```

2. La aplicación estará disponible en `http://localhost`.

## Scripts

### Frontend

- `ng`: Ejecuta Angular CLI.
- `start`: Inicia el servidor de desarrollo de Angular.
- `build`: Construye la aplicación para producción.
- `watch`: Construye la aplicación en modo de observación para desarrollo.
- `test`: Ejecuta las pruebas unitarias.

### Backend

- `dev`: Inicia el servidor de desarrollo de Node.js.

## Configuración de Entorno

Crea un archivo `.env` en los directorios `backend` y `database` con las siguientes variables de entorno:

```plaintext
# Variables de entorno para backend
PGDATABASE=tu_basedatos
PGUSER=tu_usuario
PGPASSWORD=tu_contraseña
PGPORT=5432
PGHOST=tu_host
JWTSECRET=tu_secreto_jwt

GOOGLE_ID=tu_google_id
GOOGLE_SECRET=tu_google_secreto

FACEBOOK_ID=tu_facebook_id
FACEBOOK_SECRET=tu_facebook_secreto

user=tu_usuario_genérico
pass=tu_contraseña_genérica

# Variables de entorno para database
POSTGRES_DB=tu_basedatos
POSTGRES_USER=tu_usuario
POSTGRES_PASSWORD=tu_contraseña
```

## Estructura del Proyecto

```
foodcart/
├── backend/
│   ├── src/
│   ├── package.json
│   └── ...
├── frontend/
│   ├── src/
│   ├── package.json
│   └── ...
├── database/
│   ├── Dockerfile
│   └── ...
├── proxy/
│   ├── certs/
│   ├── myconf.template
│   └── ...
├── docker-compose.yml
└── README.md
```

## Dependencias

### Frontend

- `@angular/core`: ^18.2.0
- `@ionic/angular`: ^8.3.3
- `ngx-image-cropper`: ^8.1.0
- `ol`: ^10.2.1
- `rxjs`: ~7.8.0
- `tslib`: ^2.3.0
- `zone.js`: ~0.14.10

### Backend

- Lista de dependencias específicas del backend.

### DevDependencies

- `@angular-devkit/build-angular`: ^18.2.7
- `@angular/cli`: ^18.2.7
- `@ionic/angular-toolkit`: latest
- `typescript`: ~5.5.2
- Otras dependencias necesarias para el desarrollo y pruebas.

## Contribución

1. Haz un fork del proyecto.
2. Crea una nueva rama (`git checkout -b feature/nueva-funcionalidad`).
3. Realiza los cambios necesarios y haz commit (`git commit -am 'Agrega nueva funcionalidad'`).
4. Envía los cambios a la rama (`git push origin feature/nueva-funcionalidad`).
5. Abre un Pull Request.

## Licencia

Este proyecto está licenciado bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para más detalles.

```

```
