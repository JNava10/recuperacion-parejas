
const models = require('../models/index');
const {findUserByNameOrNick, findUserByFullname} = require("../../constants/sql.const");
const {QueryTypes, Op} = require("sequelize");
const QuerySuccess = require("../../classes/QuerySuccess");
const QueryError = require("../../classes/QueryError");

class MessageQuery {
    static findRecentChatMessages = async (emitter, receiver) => {
        try {
            console.log(emitter, receiver)

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

            console.log(query)

            return new QuerySuccess(true, 'Se han obtenido los mensajes correctamente.', {emitterUser, receiverUser, messages: query});
        } catch (e) {
            console.error(e)
            throw e
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

            const message = query.get({plain: true})

            return new QuerySuccess(true, 'Se ha pusheado el mensaje correctamente.', message);
        } catch (e) {
            console.error(e)
            throw e
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
            console.error(e)
            throw e
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
            console.error(e)
            throw e
        }
    };

    static markMessageAsReaded = async (id) => {
        try {
            const query = await models.Message.update({read: true}, {where: {id}});

            return new QuerySuccess(true, 'Se han leido los mensajes correctamente.', query);
        } catch (e) {
            console.error(e)
            throw e
        }
    };

    static getPendingChats = async (userId) => {
        try {
            const usersWithPendingMessages = await models.Message.findAll({
                    where: {
                        receiver: userId,
                        read: false,
                    },
                    attributes: [
                        [models.sequelize.fn('COUNT', models.Sequelize.col('id')), 'count'],
                        'emitter',
                    ],
                    group: ['emitter'],
                    raw: true
                }
            );

            const users = await models.User.findAll({
                where: {
                    id: {
                        [Op.in]: (usersWithPendingMessages.map(message => message.emitter))
                    }
                },
                raw: true
            });

            users.forEach(user => {
                const userPending = usersWithPendingMessages.find(message => message.emitter === user.id);
                user.pendingCount = userPending.count;
            })

            if (!users) return new QuerySuccess(false, 'El usuario indicado no existe.');

            return new QuerySuccess(true, 'Se han obtenido los chats correctamente.', users);
        } catch (e) {
            console.log(e)
            throw e
        }
    };

    static getNotPendingChats = async (userId) => {
        try {
            const usersWithPendingMessages = await models.Message.findAll({
                    where: {
                        receiver: userId,
                        read: false,
                    },
                    attributes: [
                        [models.sequelize.fn('COUNT', models.Sequelize.col('id')), 'count'],
                        'emitter',
                    ],
                    group: ['emitter'],
                    order: [['created_at', 'DESC']],
                    raw: true
                }
            );

            const usersWithReadMessages = await models.Message.findAll({
                    where: {
                        receiver: userId,
                        emitter: {
                            [Op.and]: [
                                {[Op.not]: userId},
                                {[Op.notIn]: usersWithPendingMessages.map(message => message.emitter)}
                            ]
                        },
                        read: true,
                    },
                    attributes: [
                        [models.sequelize.fn('COUNT', models.Sequelize.col('id')), 'count'],
                        'emitter',
                    ],
                    group: ['emitter'],
                    order: [['created_at', 'ASC']],
                    raw: true
                }
            );

            const usersWhoSendMessages = await models.Message.findAll({
                    where: {
                        emitter: userId,
                        receiver: {[Op.and]: [
                                {[Op.not]: userId},
                                {[Op.notIn]: usersWithPendingMessages.map(message => message.emitter)}
                            ]
                        },
                    },
                    attributes: [
                        [models.sequelize.fn('COUNT', models.Sequelize.col('id')), 'count'],
                        'receiver',
                    ],
                    group: ['receiver'],
                    order: [['created_at', 'ASC']],
                    raw: true
                }
            );

            const users = await models.User.findAll({
                where: {
                    id: {
                        [Op.or]: [
                            {
                                [Op.in]: (usersWhoSendMessages.map(message => message.receiver))
                            },
                            {
                                [Op.in]: (usersWithReadMessages.map(message => message.emitter))
                            },
                        ]
                    }
                },
                raw: true
            });

            if (!users) return new QuerySuccess(false, 'El usuario indicado no existe.');

            return new QuerySuccess(true, 'Se han obtenido los usuario correctamente.', users);
        } catch (e) {
            console.log(e)
            throw e
        }
    }
}

module.exports = MessageQuery;