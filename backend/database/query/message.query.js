
const models = require('../models/index');
const {findUserByNameOrNick, findUserByFullname} = require("../../constants/sql.const");
const {QueryTypes, Op} = require("sequelize");
const QuerySuccess = require("../../classes/QuerySuccess");
const QueryError = require("../../classes/QueryError");
const {jpegminiMedium} = require("@cloudinary/url-gen/qualifiers/quality");

class MessageQuery {
    static findRecentChatMessages = async (emitter, receiver) => {
        try {

            const emitterUser = await models.User.findOne({where: {id: emitter}, attributes: ['id', 'email', 'nickname', 'pic_url', 'connected']});
            const receiverUser = await models.User.findOne({where: {id: receiver}, attributes: ['id', 'email', 'nickname', 'pic_url', 'connected']});

            const query = await models.Message.findAll({
                where: {
                    [Op.and]: [
                        // Deben obtenerse los mensajes de ambos, por ello se obtienen los mensajes de uno u otros, independientemente de si son emisores o receptores.
                        {
                            [Op.or]: [
                                {emitter: emitter, receiver: receiver},
                                {emitter: receiver, receiver: emitter},
                            ]
                        },
                    ]
                },
                include: {
                    model: models.MessageFile,
                    as: 'files',
                    attributes: ['file_link']
                },
                order: [
                    ['created_at', 'ASC'],
                ]
            });

            return new QuerySuccess(true, 'Se han obtenido los mensajes correctamente.', {emitterUser, receiverUser, messages: query});
        } catch (e) {
            console.warn(e)
            return new QueryError(false, e)
        }
    };

    /**
     *
     * @param {number} messageId
     * @param {string[]} urls
     * @returns {Promise<QueryError|QuerySuccess>}
     */
    static pushMessageFiles = async (messageId, urls) => {
        try {
            const messageFiles = []

            urls.forEach(url => {
                messageFiles.push({message: messageId, file_link: url})
            })

            const query = await models.MessageFile.bulkCreate(messageFiles);

            return new QuerySuccess(true, 'Se han añadido los archivos correctamente.', query);
        } catch (e) {
            console.warn(e)
            return new QueryError(false, e)
        }
    };

    static getUnreadedMessages = async (emitter, receiver) => {
        try {
            const query = await models.Message.findAll({
                where: {
                    [Op.and]: [
                        {emitter: emitter},
                        {receiver: receiver},
                        {read: false}
                    ]
                }, attributes: ['id']
            });

            return new QuerySuccess(true, 'Se han obtenido los mensajes correctamente.', query);
        } catch (e) {
            return new QueryError(false, e)
        }
    };

    static markMessageAsReaded = async (id) => {
        try {
            const query = await models.Message.update({read: true}, {where: {id}});

            return new QuerySuccess(true, 'Se han leido los mensajes correctamente.', query);
        } catch (e) {
            return new QueryError(false, e)
        }
    };


}

module.exports = MessageQuery;