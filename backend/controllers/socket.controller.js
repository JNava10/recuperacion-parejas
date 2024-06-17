const MessageQuery = require("../database/query/message.query");
const RoomController = require("./room.controller");
const NotificationQuery = require("../database/query/notification.query");
const UserQuery = require("../database/query/user.query");
const FriendshipQuery = require("../database/query/friendship.query");

class SocketController {
    static io;

    /** Lista con las conexiones actuales. Como clave está el ID del usuario y como valor la instancia Socket de su conexion.
     *
     * @type {Map<number, Socket>}
     */
    static usersConnected = new Map();

    /**
     *
     * @param {number[]} ids
     */
    static findUsersById = (ids) => {
        const userList = [...SocketController.usersConnected.entries()];

        return userList.filter(entry => ids.includes(entry[0]))
    }

    /**
     *
     * @param {Socket} socket
     * @param io
     */
    static onConnect = async (socket, io) => {
        SocketController.io = io;

        let ownId = socket.user.userId;
        SocketController.usersConnected.set(ownId, socket)

        io.emit('user-connected', {count: SocketController.usersConnected.size});

        const query = (await FriendshipQuery.getMatchedUsersIds(ownId)).query


        // Sacamos los amigos de la BD para decirles que el usuario se ha conectado.
        let friends = [];

        query.forEach(model => {
            if (model.userMatch.id === ownId) friends.push(model.userMatched)
            else if (model.userMatched.id === ownId) friends.push(model.userMatch)
        });

        friends = friends.map(user => user.id)

        const connectedFriends = SocketController.findUsersById(friends)

        connectedFriends.forEach(([friendId, friendSocket]) => {
            console.log('friend connected')
            friendSocket.emit('friend-connected', {id: ownId})
        })

        // Listeners
        socket.on('disconnect', () => SocketController.onDisconnect(socket))
        socket.on('msg', async (params) => await SocketController.onMessage(socket, params))
        socket.on('join-chat', async (params) => await SocketController.onJoinChat(socket, params, io))
        socket.on('leave-chat', async (params) => await SocketController.onLeaveChat(socket, params))
        socket.on('message-read', async (params) => await SocketController.onMessageRead(socket, params))
        socket.on('new-match', async (params) => await SocketController.onNewMatch(socket, params))
    }

    static onDisconnect = (socket) => {
        SocketController.usersConnected.delete(socket.user.userId)
        SocketController.io.emit('user-disconnected', {count: SocketController.usersConnected.size});

        console.log(`Se ha cerrado la conexion ${socket.id} (Usuario con ID ${socket.user.userId})`);

        console.log('Intentando desconectarse de las rooms...')
        const roomController = new RoomController(socket);

        roomController.leaveAllRooms();
    }

    static onMessage = async (socket, params) => {
        const roomController = new RoomController(socket);
        const {content, idToSend} = params;

        if (content.text) {
            const inserted = await MessageQuery.pushMessage(socket.user.userId, idToSend, content.text);

            let roomUuid;
            roomUuid = roomController.findChatRoom(idToSend);

            if (inserted && !roomUuid) {
                roomUuid = roomController.getUserFreeRoom(socket.user.userId);
            } else if (!inserted) {
                return false
            }

            console.log(`Enviando mensaje a la room ${roomUuid}`);
            SocketController.io.to(roomUuid).emit('msg', inserted.query)
        } else if (content.urls) {
            const message = (await MessageQuery.pushMessage(socket.user.userId, idToSend, "")).query;

            const files = (await MessageQuery.pushMessageFiles(message.id, content.urls)).query;

            let roomUuid;

            if (files) {
                roomUuid = roomController.findChatRoom(idToSend);
            }

            // Reasignamos el uuid de la room si no está conectado el usuario que recibe los mensajes.
            if (files && !roomUuid) {
                roomUuid = roomController.getUserFreeRoom(socket.user.userId);
            } else if (!files) {
                return false
            }

            // Pusheamos los archivos al objeto del mensaje, para que coincida con la estructura
            // que admite el listener de archivos de los mensajes en el front.

            message.files = [];

            files.forEach(file => {
                message.files.push(file)
            })

            console.log(`Enviando mensaje con archivos a la room ${roomUuid}`);

            // Enviamos el mensaje con sus archivos al front.
            SocketController.io.to(roomUuid).emit('msg-file', {
                message,
            })
        }

        const socketToSend = SocketController.usersConnected.get(idToSend);

        if (socketToSend) {
            socketToSend.emit('new-message', {from: socket.user.userId});
        }
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

    static onNewMatch = async (socket, params) => {
        const targetId =  params.targetId;

        const userExists = await  UserQuery.checkIfIdExists(targetId)

        if (!userExists) return;

        const targetSocket = SocketController.usersConnected.get(targetId);

        const notificationData = {
            from: socket.user.userId, to: targetId
        };

        await NotificationQuery.pushMatchNotification(notificationData);

        if (targetSocket) {
            targetSocket.emit('new-match', {from: socket.user.userId});
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

    static onLeaveChat = async (socket, params) => {
        const roomController = new RoomController(socket);

        let uuid = roomController.findChatRoom(params.receiverId)

        if (!uuid) uuid = roomController.getUserFreeRoom(socket.user.userId);

        console.log('Saliendo del chat con room', uuid)
    }
}

module.exports = SocketController