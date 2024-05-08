require('dotenv').config()
const models = require('../models/index');
const Preference = require("../../classes/preference");

const make = async (list) => {
    const preferences = [];

    list.forEach(item => {
        const preference = new Preference(item.name, item.description);

        preferences.push(preference);
    });

    return preferences;
}

module.exports = {
    make
}