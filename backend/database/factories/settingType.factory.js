require('dotenv').config()
const models = require('../models/index');

const make = (names) => {
    const types = [];

    names.forEach(name => types.push({name: name}));

    return types;
}

module.exports = {
    make
}