const {events} = require("../constants/socket.const");
const MessageQuery = require("../database/query/message.query");
const RoomController = require("./room.controller");

class SocketController {
    static onConnect = (socket) => {
        socket.on('disconnect', () => SocketController.onDisconnect(socket))
        socket.on('msg', async (params) => await SocketController.onMessage(socket, params))
        socket.on('join-chat', async (params) => await SocketController.onJoinChat(socket, params))
        socket.on('leave-chat', async (params) => await SocketController.onLeaveChat(socket, params))
    }

    static onDisconnect = (socket) => {
        console.log(`Se ha cerrado la conexion ${socket.id} (Usuario con ID ${socket.user.userId})`);

        console.log('Intentando desconectarse de las rooms...')
        const roomController = new RoomController(socket);

        roomController.leaveAllRooms();
    }

    static onMessage = async (socket, params) => {
        const roomController = new RoomController(socket);

        const inserted = await MessageQuery.pushMessage(socket.user.userId, params.idToSend, params.text);
        const room = roomController.findChatRoom(params.idToSend);

        if (inserted) socket.to(room.uuid).emit('msg', inserted.query);
    }

    static onJoinChat = async (socket, params) => {
        const roomController = new RoomController(socket);
        let uuid;

        const room = roomController.joinUserFreeRoom(params.receiverId);

        if (!room) uuid = roomController.createRoom()

        socket.emit('join-chat', {joined: true, uuid});

        console.log(RoomController.rooms)
    }

    static onLeaveChat = async (socket, params) => {
    }
}

module.exports = SocketController