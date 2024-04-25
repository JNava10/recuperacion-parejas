const {events} = require("../constants/socket.const");

class SocketController {
    static onConnect = (socket) => {
        console.log('connected:', socket.id)

        socket.on('disconnect', () => {
            console.log("Cliente desconectado", socket.id);
        });

        socket.on('msg', () => console.log('a'))
    }

    static onMessage = (socket) => {
        console.log('Mensaje', socket.id);
    }
}

module.exports = SocketController