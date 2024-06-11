const models = require('../models/index');
const QuerySuccess = require("../../classes/QuerySuccess");

class NotificationQuery {

    /**
     *
     * @param data
     * @param {string} data.from
     * @param {string} data.to
     * @returns {Promise<QuerySuccess>}
     */
    static pushMatchNotification = async (data) => {
        try {
            const newNotification = await models.NewMatchNotification.create(data);

            return new QuerySuccess(true, 'Se ha creado la notificación correctamente.', newNotification);
        } catch (e) {
            console.log(e)
            throw e
        }
    }
}

module.exports = NotificationQuery