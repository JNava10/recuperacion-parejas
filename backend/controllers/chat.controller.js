const StdResponse = require("../classes/stdResponse");
const {findRecentChatMessages} = require("../database/query/message.query");
const {uploadFiles} = require("../helpers/cloudinary.helper");
const UserQuery = require("../database/query/user.query");
const MessageQuery = require("../database/query/message.query");

class ChatController {
    static getMessages = async (req, res) => {
        try {
            const receiverId = req.params.receiver;
            const emitterId = req.payload.userId;

            const result = await findRecentChatMessages(emitterId, receiverId)

            return res.status(200).json(
                new StdResponse(
                    result.message,
                    {
                        query: result.query
                    }
                )
            )
        } catch (e) {
            console.error(e)

            return res.status(203).json(
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