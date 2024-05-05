
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

            const messages = await models.Message.findAll({
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
            });

            return new QuerySuccess(true, {emitterUser, receiverUser, messages});
        } catch (e) {
            console.warn(e)
            return new QueryError(false, e)
        }
    };

    static pushMessage = async (emitter, receiver, text) => {
        try {
            const data = {
                emitter,
                receiver,
                text,
                read: false,
                created_at: new Date(),
                updated_at: new Date(),
            };

            const query = await models.Message.create(data);

            return new QuerySuccess(true, query);
        } catch (e) {
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

            return new QuerySuccess(true, query);
        } catch (e) {
            return new QueryError(false, e)
        }
    };

    static markMessageAsReaded = async (id) => {
        try {
            const query = await models.Message.update({read: true}, {where: {id}});

            return new QuerySuccess(true, query);
        } catch (e) {
            return new QueryError(false, e)
        }
    };


}

module.exports = MessageQuery;