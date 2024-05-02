const {events} = require("../constants/socket.const");

class SocketController {
    static onConnect = (socket) => {
        socket.on('disconnect', () => {
            console.log("Cliente desconectado", socket.id);
        });

        console.log(socket.token)

        socket.on('msg', SocketController.onMessage)
    }

    static onMessage = (params) => {
        console.log(params);
    }
}

module.exports = SocketController