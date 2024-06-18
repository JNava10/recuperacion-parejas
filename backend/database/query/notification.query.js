const models = require('../models/index');
const QuerySuccess = require("../../classes/QuerySuccess");

class NotificationQuery {

    static pushMatchNotification = async (data) => {
        try {
            const newNotification = await models.NewMatchNotification.create(data);

            return new QuerySuccess(true, 'Se ha creado la notificación correctamente.', newNotification);
        } catch (e) {
            console.log(e)
            throw e
        }
    }

    static getUserNotifications = async (userId) => {
        try {
            const notifications = await models.NewMatchNotification.findAll(
                {
                    where: {to: userId},
                    include: [
                        {
                            model: models.User,
                            as: 'userFrom'
                        },
                        {
                            model: models.User,
                            as: 'userTo'
                        }
                    ]
                }
            );

            return new QuerySuccess(true, 'Se han obtenido las notificaciones correctamente.', notifications);
        } catch (e) {
            console.error(e)
            throw e
        }
    };

    static readUserNotifications = async (user) => {
        try {
            const updated = await models.NewMatchNotification.update({seen: true}, {where: {to: user}})

            return new QuerySuccess(updated !== null, 'Se ha quitado el rol correctamente.');
        } catch (e) {
            console.error(e)
            throw e
        }
    };
}

module.exports = NotificationQuery