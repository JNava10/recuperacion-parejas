require('dotenv').config()
const models = require('../models/index');
const Preference = require("../../classes/preference");
const {preferenceTypes} = require("../../constants/seed.const");

const make = (typeNames) => {
    const types = [];

    typeNames.forEach(item => {
       types.push({text: item.text})
    });

    return types;
}

module.exports = {
    make
}