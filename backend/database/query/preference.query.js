const models = require('../models/index');
const {findUserByNameOrNick, findUserByFullname} = require("../../constants/sql.const");
const {QueryTypes, Op} = require("sequelize");
const QuerySuccess = require("../../classes/QuerySuccess");
const QueryError = require("../../classes/QueryError");
const PreferenceOption = require("../../classes/preferenceOption");
const {preferenceTypes} = require("../../constants/seed.const");
const {el} = require("@faker-js/faker");
const CustomError = require("../../classes/customError");

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
            console.error(e)
            throw e
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
                    const item = new PreferenceOption(createdPreference.id, option.text, index + 1);

                    preferenceOptions.push(item);
                });

                await models.PreferenceOption.bulkCreate(preferenceOptions);

                const usersId = await models.User.findAll({attributes: ['id'], where: {deletedAt: null}})
                const usersPreference = [];

                usersId.forEach(user => {
                    usersPreference.push({user: user.id, preference: createdPreference.id, value: 1})
                });

                await models.UserPreference.bulkCreate(usersPreference);
            } else throw new CustomError('No se ha podido obtener la preferencia creada.')

            return new QuerySuccess(true, 'Se ha insertado la preferencia correctamente.');
        } catch (e) {
            console.error(e)
            throw e
        }
    };

    static createRangePreference = async (preference) => {
        try {
            const type = await models.PreferenceType.findOne({where: {text: preferenceTypes.range.text}})
            const {name, description, range} = preference;

            const createdPreference = await models.Preference.create({
                name,
                description,
                typeId: type.id
            });

            if (createdPreference.id) {
                await models.PreferenceValue.create({
                    preference: createdPreference.id,
                    min_value: range.min,
                    max_value: range.max,
                });

                const usersId = await models.User.findAll({attributes: ['id'], where: {deletedAt: null}})
                const usersPreference = [];

                usersId.forEach(user => {
                    usersPreference.push({user: user.id, preference: createdPreference.id, value: range.min})
                });

                await models.UserPreference.bulkCreate(usersPreference);
            }

            return new QuerySuccess(true, 'Se ha insertado la preferencia correctamente.');
        } catch (e) {
            console.error(e)
            throw e
        }
    };

    static getAllPreferences = async () => {
        try {
            const query = await models.Preference.findAll({ include: [
                    {
                        model: models.PreferenceType,
                        as: 'type',
                        attributes: ['text']
                    },
                    {
                        model: models.PreferenceValue,
                        as: 'values',
                        attributes: ['preference', 'min_value', 'max_value']
                    },
                    {
                        model: models.PreferenceOption,
                        as: 'options',
                        attributes: ['preference', 'option_name', 'option_value']
                    },
                ], attributes: ['id', 'name', 'description']}
            );

            let preferences = {
                choice: [],
                range: []
            };

            query.forEach(preference => {
                if (preference.type.text === preferenceTypes.choice.text) {
                    preferences.choice.push(preference)
                }
                else {
                    preferences.range.push(preference)
                }
            })

            return new QuerySuccess(true, 'Se han obtenido las preferencias correctamente.', preferences);
        } catch (e) {
            console.error(e)
            throw e
        }
    };

    static createUserPreferences = async (preferences, userId) => {
        try {
            preferences.forEach(preference => preference.user = userId);

            const created = await models.UserPreference.bulkCreate(preferences);

            return new QuerySuccess(created.length > 0, 'Se han creado las preferencias de usuario correctamente.', created.length > 0);
        } catch (e) {
            console.error(e)
            throw e
        }
    };

    static userHasPreferences = async (userId) => {
        try {
            const exists = await models.UserPreference.findOne({where: {user: userId}, attributes: ['user']}) !== null;

            const message = exists ? 'El usuario ya tiene preferencias.' : 'El usuario no tiene preferencias.'

            return new QuerySuccess(true, message, exists);
        } catch (e) {
            console.error(e)
            throw e
        }
    };

    static getUserPreferences = async (user) => {
        try {
            const rangePreferences = await models.Preference.findAll({
                include: [
                    {
                        model: models.PreferenceType,
                        as: 'type',
                        attributes: ['text'],
                        where: {text: preferenceTypes.range.text}
                    },
                    {
                        model: models.PreferenceValue,
                        as: 'values',
                        attributes: ['min_value', 'max_value']
                    },
                    {
                        model: models.UserPreference,
                        as: 'userValues',
                        attributes: ['value'],
                        where: {user}
                    },
                ]
            });

            const choicePreferences = await models.Preference.findAll({
                include: [
                    {
                        model: models.PreferenceType,
                        as: 'type',
                        attributes: ['text'],
                        where: {text: preferenceTypes.choice.text}
                    },
                    {
                        model: models.PreferenceOption,
                        as: 'options',
                        attributes: ['option_name', 'option_value']
                    },
                    {
                        model: models.UserPreference,
                        as: 'userValues',
                        attributes: ['value'],
                        where: {user}
                    },
                ]
            });

            return new QuerySuccess(true, 'Se han creado las preferencias de usuario correctamente.', {choice: choicePreferences, range: rangePreferences});
        } catch (e) {
            console.error(e)
            throw e
        }
    };
}

module.exports = PreferenceQuery