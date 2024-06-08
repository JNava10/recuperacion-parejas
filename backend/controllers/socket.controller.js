const MessageQuery = require("../database/query/message.query");
const RoomController = require("./room.controller");

class SocketController {
    static io;

    static onConnect = (socket, io) => {
        SocketController.io = io;

        socket.on('disconnect', () => SocketController.onDisconnect(socket))
        socket.on('msg', async (params) => await SocketController.onMessage(socket, params))
        socket.on('join-chat', async (params) => await SocketController.onJoinChat(socket, params, io))
        socket.on('leave-chat', async (params) => await SocketController.onLeaveChat(socket, params))
        socket.on('message-read', async (params) => await SocketController.onMessageRead(socket, params))
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
        let roomUuid;
        roomUuid = roomController.findChatRoom(params.idToSend);

        if (inserted && !roomUuid) {
            roomUuid = roomController.getUserFreeRoom(socket.user.userId);
        } else if (!inserted) {
            return false
        }

        console.log(`Enviando mensaje a la room ${roomUuid}`);
        SocketController.io.to(roomUuid).emit('msg', inserted.query)
    }

    static onMessageRead = async (socket, params) => {
        const roomController = new RoomController(socket);
        const receiverId =  params.receiverId;

        const unreadMessages = await MessageQuery.getUnreadedMessages(params.receiverId, socket.user.userId);

        const readedMessages = [];
        const roomUuid = roomController.findChatRoom(receiverId);

        if (unreadMessages.query.length > 0) {
            unreadMessages.query.forEach(message => {
                MessageQuery.markMessageAsReaded(message.id);
                readedMessages.push(message.id);
            });

            this.io.to(roomUuid).emit('message-read', {messages: readedMessages});
        }
    }

    static onJoinChat = async (socket, params) => {
        const roomController = new RoomController(socket);
        let uuid;

        uuid = roomController.joinUserFreeRoom(params.receiverId);

        if (!uuid) {
            uuid = roomController.createRoom();
            roomController.joinRoom(uuid);
        }

        console.log('rooms socket', SocketController.io.sockets.adapter.rooms);

        const unreadedMessages = await MessageQuery.getUnreadedMessages(params.receiverId, socket.user.userId);
        const readedMessages = [];

        if (unreadedMessages.query.length > 0) {
            unreadedMessages.query.forEach(message => {
                MessageQuery.markMessageAsReaded(message.id);
                readedMessages.push(message.id);
            });

            this.io.to(uuid).emit('message-read', {messages: readedMessages});
        }

        socket.emit('join-chat', {joined: true});
    }

    static onLeaveChat = async (socket, params) => {}
}

module.exports = SocketController