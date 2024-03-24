require('dotenv').config()
const {fakerES} = require('@faker-js/faker');
const models = require('../models/index');
const {hashPassword} = require("../../helpers/common.helper");

const get = (names) => {
    const roles = [];

    names.forEach(nameData => {
        const role = {
            name: nameData.name,
            display_name: nameData.displayName,
            created_at: new Date(),
            updated_at: new Date()
        }

        roles.push(role);
    })

    return roles
}

module.exports = {
    get
}