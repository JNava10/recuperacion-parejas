require('dotenv').config()

const Server = require('./server');

//Lanzamos el servidor.
const server = new Server();
server.listen();

