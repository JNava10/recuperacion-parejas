const express = require('express');
// const body_parser = require('body-parser');
const cors = require('cors');

class Server {

    constructor() {
        this.app = express();
        this.authPath = `/${process.env.API_ROOT_ENDPOINT}/auth`;
        this.userPath = `/${process.env.API_ROOT_ENDPOINT}/user`;

        this.middlewares();
        this.routes();
    }

    middlewares() {
        this.app.use(cors());
        this.app.use(express.json());
    }

    routes(){
        this.app.use(this.authPath, require('../routes/auth.routes'));
        this.app.use(this.userPath, require('../routes/user.routes'));
    }

    listen() {
        this.app.listen(process.env.HOST_PORT, () => {
            console.log(`Endpoint de la API: ${process.env.HOST_URL}:${process.env.HOST_PORT}/${process.env.API_ROOT_ENDPOINT}`);
        })
    }
}

module.exports = Server;