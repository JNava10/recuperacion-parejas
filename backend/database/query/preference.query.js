const models = require('../models/index');
const {findUserByNameOrNick, findUserByFullname} = require("../../constants/sql.const");
const {QueryTypes, Op} = require("sequelize");
const QuerySuccess = require("../../classes/QuerySuccess");
const QueryError = require("../../classes/QueryError");
const PreferenceOption = require("../../classes/preferenceOption");
const {preferenceTypes} = require("../../constants/seed.const");

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

    static createChoicePreference = async (preference) => {
        try {
            const type = await models.PreferenceType.findOne({where: {text: preferenceTypes.choice.text}})
            const {name, description, options} = preference;

            const createdPreference = await models.Preference.create({
                name,
                description,
                typeId: type.id
            });

            if (createdPreference.id) {
                const preferenceOptions = [];
                console.log(options)

                options.forEach((option, index) => {
                    const item = new PreferenceOption(createdPreference.id, option.text, index);

                    preferenceOptions.push(item);
                });

                await models.PreferenceOption.bulkCreate(preferenceOptions);
            }

            return new QuerySuccess(true, 'Se ha insertado la preferencia correctamente.');
        } catch (e) {
            console.warn(e)
            return new QueryError(false, e)
        }
    };
}

module.exports = PreferenceQuery