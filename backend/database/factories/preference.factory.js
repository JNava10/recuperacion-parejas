require('dotenv').config()
const models = require('../models/index');
const Preference = require("../../classes/preference");
const {preferenceTypes} = require("../../constants/seed.const");
const seederConstants = require("../../constants/seed.const");

const make = async (list, types) => {
    const preferences = [];

    const valueTypeId = types.find(type => type.name === preferenceTypes.value).id
    const optionTypeId = types.find(type => type.name === preferenceTypes.value).id

    list.forEach(item => {
        if (item.options.length > 0) {
            item.type = seederConstants.preferenceTypes.option
        } else  {
            item.type = seederConstants.preferenceTypes.value
        }

        let preference;

        if (item.type === preferenceTypes.value) {
            preference = new Preference(item.name, valueTypeId, item.description);
        } else if (item.type === preferenceTypes.option) {
            preference = new Preference(item.name, optionTypeId, item.description);
        }

        preferences.push(preference);
    });

    return preferences;
}

module.exports = {
    make
}