const {events} = require("../constants/socket.const");
const MessageQuery = require("../database/query/message.query");
const { v4: getUniqueId } = require('uuid');
const {fa} = require("@faker-js/faker");

// Las Rooms son 'salas' que incluye Socket.io para poder enviar peticiones a usuarios especificos. Esto es genial para hacer un chat.
// La idea que se ha planteado es que sea el backend el que se encargue de manejar estas rooms.
//
// La informacion que se guarda es:
// - El ID de la room, generada automaticamente.
// - Un array con los IDs de los usuarios que estén dentro.

// Se utilizan instancias de socket.io para que sea mas sencillo identificar al usuario que llame al controlador.

class RoomController {
    constructor(socket) {
        this.socket = socket; // Aqui está la instancia de socket.io perteneciente a cada usuario que realiza una conexión.
        this.userId = this.socket.user.userId
    }

    /** Esto es una lista clave-valor, cuya claves son los uuid de las rooms, y los valores los usuarios de los mismos.
     *
     * @type {Map<string, Set<number>>}
     */
    static rooms = new Map();

    static getAllRooms = () => {
        return RoomController.rooms;
    }

    createRoom = () => {
        const uuid = getUniqueId();
        const users = new Set();

        RoomController.rooms.set(uuid, users);

        return uuid;
    }

    leaveRoom = (uuid) => {
        const userId = this.socket.user.userId;

        this.socket.leave(uuid);

        const roomUsers = RoomController.getRoom(uuid);

        roomUsers.delete(userId);
        RoomController.rooms.set(uuid, roomUsers);

        console.log(`Usuario ${this.socket.user.userId} ha salido de la room ${uuid}`);

        if (roomUsers.size === 0) {
            RoomController.deleteRoom(uuid)
        }
    }

    leaveAllRooms = () => {
        const rooms = [...RoomController.rooms.entries()];
        const userRooms = rooms.filter(([uuid, users]) => users.has(this.socket.user.userId))

        userRooms.forEach(([roomUuid, roomUsers]) => {
            this.leaveRoom(roomUuid)
        });
    }

    static getRoom(uuid) {
        return RoomController.rooms.get(uuid);
    }

    joinRoom = (uuid) => {
        console.log(`Metiendo al usuario ${this.socket.user.userId} en ${uuid}`)
        this.socket.join(uuid);

        const roomUsers = RoomController.rooms.get(uuid);

        roomUsers.add(this.socket.user.userId);

        RoomController.rooms.set(uuid, roomUsers);
    }

    joinUserFreeRoom = (userFindingId) => {
        if (userFindingId === this.socket.user.userId) {
            console.warn('No puedes incluirte a ti mismo.');
            return false;
        }

        const rooms = [...RoomController.rooms.entries()];
        const firstRoomFree = rooms.find(([uuid, users]) => users.has(userFindingId));

        if (!firstRoomFree) return false;

        const roomUuid = firstRoomFree[0];

        this.joinRoom(roomUuid);

        return roomUuid;
    }

    getUserFreeRoom = (userFindingId) => {
        const rooms = [...RoomController.rooms.entries()];
        const firstRoomFree = rooms.find(([uuid, users]) => users.has(userFindingId));

        if (!firstRoomFree) return false;

        return firstRoomFree[0];
    }

    findChatRoom = (receiverId) => {
        const rooms = [...RoomController.rooms.entries()];

        const chatRoom = rooms.find(([uuid, users]) => users.has(this.socket.user.userId) && users.has(receiverId));

        if (chatRoom) {
            return chatRoom[0] // La primera posicion es el ID de la room.
        } else {
            return false;
        }
    }

    static deleteRoom = (uuid) => {
        RoomController.rooms.delete(uuid);
    }
}

module.exports = RoomController;