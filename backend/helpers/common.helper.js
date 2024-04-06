const {hash} = require("bcrypt");
require('dotenv').config()
const {response} = require('express');

const hashPassword = async (plainText) => {
    return await hash(plainText, Number(process.env.PASSWORD_HASH_SALT));
}

const getRandomItem = (array) => {
    const index = Math.floor(Math.random() * array.length);

    return array[index];
}

const getRandomFromRange = (min, max) => {
    // Sacado de la pagina oficial de Mozilla.
    const minCeiled = Math.ceil(min);
    const maxFloored = Math.floor(max);

    return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled);
}

/**
 *
 * @param {Object} data
 * @param message
 * @param {Number} status
 * @returns {e.Response<any, Record<string, any>>}
 */
const sendStandardResponse = (message, data, status = 200) => {
    return response.status(status).json({
        message: message,
        data: data
    })
}

module.exports = {
    hashPassword,
    getRandomItem,
    getRandomFromRange,
    sendStandardResponse
}