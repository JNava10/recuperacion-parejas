const models = require('../models/index');
const {findUserByNameOrNick, findUserByFullname} = require("../../constants/sql.const");
const {QueryTypes, Op} = require("sequelize");
const QuerySuccess = require("../../classes/QuerySuccess");
const QueryError = require("../../classes/QueryError");
const RoleQuery = require("./role.query");
const {roleNames, preferenceTypes} = require("../../constants/seed.const");
const {hashPassword} = require("../../helpers/common.helper");

class NotificationQuery {

    /**
     *
     * @param data
     * @param data.
     * @returns {Promise<QuerySuccess>}
     */
    static pushMatchNotification = async (data) => {
        try {
            const {from, to, title, description} = data;

            const newNotification = await models.NewMatchNotification.create({
                from,
                to,
                title,
                description
            });

            return new QuerySuccess(true, 'Se ha creado la notificación correctamente.', newNotification);
        } catch (e) {
            console.log(e)
            throw e
        }
    }
}

module.exports = NotificationQuery