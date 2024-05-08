# Proyecto de recuperación de la segunda evaluación

## Instalación
1. Extraer el archivo .zip de la release.
2. Es recomendable copiar el .env de la entrega y pegarlo en el directorio `backend/`.
3. Introducir los siguientes comandos:
```
cd server
npm i
npm run migrate
npm run seed
cd ../../client
npm i
```
Como alternativa, instalar el archivo .sql de la entrega/release en cualquier servidor MySQL.

## Ejecución del proyecto
1. En el directorio `client/`: `ng s`
2. En el directorio `server/`: `npm run serve`
3. En cualquier navegador, abrir la ruta `http://localhost:8000/login`.
