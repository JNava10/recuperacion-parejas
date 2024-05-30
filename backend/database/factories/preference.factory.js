require('dotenv').config()
const models = require('../models/index');
const Preference = require("../../classes/preference");
const {preferenceTypes} = require("../../constants/seed.const");
const seederConstants = require("../../constants/seed.const");

const make = async (list, types) => {
    const preferences = [];

    const valueTypeId = types.find(type => type.text === preferenceTypes.range.text).id
    const optionTypeId = types.find(type => type.text === preferenceTypes.choice.text).id

    list.forEach(item => {
        if (item.options.length > 0) {
            item.type = seederConstants.preferenceTypes.choice
        } else  {
            item.type = seederConstants.preferenceTypes.range
        }

        let preference;

        if (item.type === preferenceTypes.range) {
            preference = new Preference(item.name, valueTypeId, item.description);
        } else if (item.type === preferenceTypes.choice) {
            preference = new Preference(item.name, optionTypeId, item.description);
        }

        preferences.push(preference);
    });

    return preferences;
}

module.exports = {
    make
}