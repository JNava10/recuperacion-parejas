
const EventQuery = require("../database/query/event.query");
const StdResponse = require("../classes/stdResponse");
const QuerySuccess = require("../classes/QuerySuccess");
const {findRecentChatMessages} = require("../database/query/message.query");
const {id_ID} = require("@faker-js/faker");
const RoleQuery = require("../database/query/role.query");
const {uploadFiles} = require("../helpers/cloudinary.helper");
const UserQuery = require("../database/query/user.query");
const MessageQuery = require("../database/query/message.query");

class ChatController {
    static getMessages = async (req, res) => {
        try {
            const receiverId = req.params.receiver;
            const emitterId = req.payload.userId;

            const receiverExists = await UserQuery.checkIfIdExists(receiverId)

            if (receiverExists) return res.status(400).json(
                new StdResponse(
                    'El usuario indicado para recibir el mensaje no existe.',
                    {executed: false}
                )
            )

            const result = await findRecentChatMessages(emitterId, receiverId)

            return res.status(200).json(
                new StdResponse(
                    'Se ha insertado el mensaje correctamente.',
                    result
                )
            )
        } catch (e) {
            return res.status(500).json(
                new StdResponse('Ha ocurrido un problema al obtener los mensajes',{executed: false, error: e.message})
            )
        }
    }

    static getChats = async (req, res) => {
        try {
            const {userId} = req.payload;

            const pending = (await MessageQuery.getPendingChats(userId)).query
            const notPending = (await MessageQuery.getNotPendingChats(userId)).query

            return res.status(200).json(
                new StdResponse("Se han obtenido la lista de chats correctamente", {
                    executed: true,
                    chats: {pending, notPending}
                })
            );
        } catch (e) {
            return res.status(203).json(
                new StdResponse('Ha ocurrido un problema al obtener los chats.',{executed: false, error: e.message})
            )
        }
    };

    static uploadMessageImages = async (req, res) => {
        try {
            const filesUploaded = await uploadFiles(req.files, {fileExtension: ['jpg', 'png', 'jpeg'], dir: 'chat_images', numberLimit: 4});
            const filesToSend = []

            filesUploaded.forEach((file) => {
                filesToSend.push(file.secure_url)
            });

            return res.status(200).json(
                new StdResponse("Se han subido los archivos correctamente", {
                    executed: true,
                    files: filesToSend
                })
            );
        } catch (e) {
            return res.status(203).json(
                new StdResponse('Ha ocurrido un problema al obtener los chats.',{executed: false, error: e.message})
            )
        }
    }
}

module.exports = ChatController