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
1. En el directorio `client/`: `ng s --open`
2. En el directorio `server/`: `npm run serve`
3. En cualquier navegador, abrir la ruta `http://localhost:8000/login`.

### Credenciales
- Todas las cuentas creadas tienen como contraseña `daw`.
- Las cuentas ya predefinidas son:
  - `admin@gmail.com`
  - `member@gmail.com`
 
### Comandos disponibles (front)
- `ng s`: Ejecutar el front-end del proyecto

   
### Comandos disponibles (back)
- `npm run serve`: Ejecutar el back del proyecto.
- `npm run refresh`: Ejecutar migrations y seeders del back-end. En caso de ya existir, se reescriben.
- `npm run refresh-debug`: Igual que `refresh`, pero muestra los errores.
- `npm run migrate`: Ejecutar las migrations del back-end
- `npm run seed`: Ejecutar los seeders del back-end
- `npm run rollback`: Borra las migrations y seeders de la base de datos existente.
