require('dotenv').config()
const models = require('../models/index');
const PreferenceValue = require("../../classes/preferenceValue");
const {QueryTypes} = require("sequelize");
const UserPreference = require("../../classes/userPreferences");
const {getRandomItem, getRandomFromRange} = require("../../helpers/common.helper");

/**
 *
 * @param {Number[]} preferenceIds
 * @param {PreferenceValue[]} values
 * @param {Number[]} userIds
 * @param options
 * @returns {[]}
 */
const make = (preferenceIds, values, userIds, options) => {
    const userPreferences = [];

    for (const i in preferenceIds) {
        const preferenceId = preferenceIds[i];
        const userId = getRandomItem(userIds);
        const valueItem = values.find(value => value.preference === preferenceIds[i]);

        if (valueItem) {
            const value = getRandomFromRange(valueItem.min_value, valueItem.max_value);
            const userPreference = new UserPreference(userId, preferenceId, value)

            userPreferences.push(userPreference)
        } else {
            const preferenceOptions = options.filter(value => value.preference === preferenceIds[i]);
            const option = getRandomItem(preferenceOptions);
            const value = Number(option.option_value);
            const userPreference = new UserPreference(userId, preferenceId, value)

            userPreferences.push(userPreference)
        }
    }

    console.log(userPreferences)

    return userPreferences;
}

module.exports = {
    make
}