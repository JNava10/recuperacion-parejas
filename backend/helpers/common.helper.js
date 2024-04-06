const {hash} = require("bcrypt");
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

module.exports = {
    hashPassword,
    getRandomItem,
    getRandomFromRange
}