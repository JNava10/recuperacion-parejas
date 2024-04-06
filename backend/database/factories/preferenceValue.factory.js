require('dotenv').config()
const models = require('../models/index');
const PreferenceValue = require("../../classes/preferenceValue");
const {QueryTypes} = require("sequelize");


const make = async (preferences) => {
    const preferenceValues = [];

    for (const i in preferences) {
        const preference = preferences[i];

        if (preference.options.length < 1) {
            // Usando findOne no funciona, por algún motivo.
            const result = await models.sequelize.query(`SELECT id FROM preferences WHERE name = :name`,
                {
                    type: QueryTypes.SELECT,
                    replacements: {name: preference.name}
                });

            const preferenceValue = new PreferenceValue(result[0].id, preference.default_value);

            preferenceValues.push(preferenceValue);
        }
    }

    return preferenceValues;
}

module.exports = {
    make
}