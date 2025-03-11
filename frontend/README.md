# Habits Tracker Frontend

Este es el frontend de la aplicación Habits Tracker, creada con Next.js.

## Requisitos previos

- Node.js (versión 14 o superior)
- npm (versión 6 o superior) o yarn

## Instalación

1. Clona el repositorio:

    ```sh
    git clone <URL_DEL_REPOSITORIO>
    ```

2. Navega al directorio del proyecto:

    ```sh
    cd habits-tracker-frontend
    ```

3. Instala las dependencias:

    ```sh
    npm install
    ```

    o si prefieres usar yarn:

    ```sh
    yarn install
    ```

## Ejecución en desarrollo

Para iniciar el servidor de desarrollo, ejecuta:

```sh
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```
Abre [http://localhost:3000] en tu navegador para ver el resultado.

Puedes comenzar a editar la página modificando page.tsx. La página se actualiza automáticamente a medida que editas el archivo.

Este proyecto utiliza [next/font](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) para optimizar y cargar automáticamente [Geist](https://vercel.com/font), una nueva familia de fuentes para Vercel.

## Construcción para producción
Para construir el proyecto para producción, ejecuta:
```sh
    npm run build
```

o con yarn 

```sh
    yarn build
```

## Despliegue
Después de construir el proyecto, puedes iniciar el servidor de producción con:

```sh
    npm start
```
o con yarn 
```sh
    yarn start
```

## Estructura del proyecto
- app: Contiene los componentes principales de la aplicación.
- features: Contiene las funcionalidades específicas de la aplicación.
- public: Contiene los archivos estáticos.
- Redux: Contiene la configuración de Redux para el manejo del estado.
