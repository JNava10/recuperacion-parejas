require('dotenv').config()
const models = require('../models/index');
const PreferenceValue = require("../../classes/preferenceValue");
const {QueryTypes} = require("sequelize");
const PreferenceOption = require("../../classes/preferenceOption");

const make = async (preferences) => {
    const options = [];

    for (const i in preferences) {
        const preference = preferences[i];

        if (preference.options.length > 0) {
            // Usando findOne no funciona, por algún motivo.
            const result = await models.sequelize.query(`SELECT id FROM preferences WHERE name = :name`,
                {
                    type: QueryTypes.SELECT,
                    replacements: {name: preference.name}
                });

            const preferenceOptions = [];

            for (const j in preference.options) {
                const option = new PreferenceOption(result[0].id, preference.options[j], `${Number(j) + 1}`);
                preferenceOptions.push(option);
            }

            options.push(...preferenceOptions)
        }
    }

    return options;
}

module.exports = {
    make
}