const models = require('../models/index');
const {findUserByNameOrNick, findUserByFullname} = require("../../constants/sql.const");
const {QueryTypes, Op} = require("sequelize");
const QuerySuccess = require("../../classes/QuerySuccess");
const QueryError = require("../../classes/QueryError");

class PreferenceQuery {
    static getActivatedPreferences = async () => {
        try {
            const activatedPreferences = await models.Preference.findAll({
                attributes: ['name', 'description', 'typeId', 'createdAt', 'updatedAt'],
                include: {
                    model: models.PreferenceType,
                    as: 'type'
                }
            });

            return new QuerySuccess(activatedPreferences !== null, 'Se han obtenido los amigos correctamente.', activatedPreferences);
        } catch (e) {
            console.warn(e)
            return new QueryError(false, e)
        }
    };
}

module.exports = PreferenceQuery