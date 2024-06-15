const {hash} = require("bcrypt");
const crypto = require("crypto")
require('dotenv').config()

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
 * @param response
 * @param {Object} data
 * @param message
 * @param {Number} status
 * @returns {e.Response<any, Record<string, any>>}
 */
const sendStandardResponse = (response, message, data, status = 200) => {
    return response.status(status).json({
        message: message,
        data: data
    })
}

function generateSecureHex(size) {
    const randomBytes = crypto.randomBytes(size);

    return randomBytes.toString('hex');
}

function generateSecureInt(min, max) {
    return crypto.randomInt(min, max);
}

const getEventCloseDate = (scheduledDate) => {
    const multiplier = (24 * 60 * 60 * 1000);
    const closeOffset = 1; // Numero de dias antes de la fecha del evento hasta que caduque el evento.

    return new Date(scheduledDate - (closeOffset * multiplier));
};

module.exports = {
    hashPassword,
    getRandomItem,
    getRandomFromRange,
    sendStandardResponse,
    generateSecureHex,
    generateSecureInt,
    getEventCloseDate
};