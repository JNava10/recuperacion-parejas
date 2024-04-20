require('dotenv').config()
const models = require('../models/index');
const {settingTypes} = require("../../constants/seed.const");

const makeMany = async (settings) => {
    const typeIds = await models.SettingType.findAll();
    const makedSettings = [];

    settings.forEach(setting => {
        const typeIsCorrect = Object.values(settingTypes).includes(setting.type);

        if (typeIsCorrect) {
            const type = typeIds.find(type => type.name === setting.type);

            makedSettings.push({
                name: settings.name,
                value: settings.value,
                description: settings.description,
                type: type.id
            });
        }
    });

    return makedSettings;
}

module.exports = {
    makeMany
}