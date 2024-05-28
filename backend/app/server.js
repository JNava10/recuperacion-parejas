const express = require('express');
// const body_parser = require('body-parser');
const cors = require('cors');
const {events} = require("../constants/socket.const");
const SocketController = require("../controllers/socket.controller");
const {verifyToken} = require("../helpers/jwt.helper");
const {authMiddleware} = require("../middlewares/socket.middleware");

class Server {

    constructor() {
        this.app = express();
        this.authPath = `/${process.env.API_ROOT_ENDPOINT}/auth`;
        this.userPath = `/${process.env.API_ROOT_ENDPOINT}/user`;
        this.eventPath = `/${process.env.API_ROOT_ENDPOINT}/event`;
        this.rolesPath = `/${process.env.API_ROOT_ENDPOINT}/roles`;
        this.friendshipPath = `/${process.env.API_ROOT_ENDPOINT}/friendship`;

        this.server = require('http').createServer(this.app);
        this.io = require('socket.io')(this.server, {
            cors: {
                origin: "http://localhost:4200",
                methods: '*'
            }
        });

        this.middlewares();
        this.routes();
        this.sockets();
    }

    middlewares() {
        this.app.use(cors());
        this.app.use(express.json());
        this.app.use(express.static('public'));
    }

    routes(){
        this.app.use(this.authPath, require('../routes/auth.routes'));
        this.app.use(this.userPath, require('../routes/user.routes'));
        this.app.use(this.rolesPath, require('../routes/role.routes'));
        this.app.use(this.eventPath, require('../routes/event.routes'));
        this.app.use(this.friendshipPath, require('../routes/friendship.routes'));
    }

    listen() {
        this.server.listen(process.env.HOST_PORT, () => {
            console.log(`Endpoint de la API y Socket.io: ${process.env.HOST_URL}:${process.env.HOST_PORT}/${process.env.API_ROOT_ENDPOINT}`);
        })
    }

    sockets(){
        this.io.use(authMiddleware);
        this.io.on('connection', (socket) => SocketController.onConnect(socket, this.io));
    }

}

module.exports = Server;