const {hash} = require("bcrypt");
require('dotenv').config()
const hashPassword = async (plainText) => {
    return await hash(plainText, Number(process.env.PASSWORD_HASH_SALT));
}

const getRandomItem = (array) => {
    const index = Math.floor(Math.random() * array.length);

    return array[index];
}

module.exports = {
    hashPassword,
    getRandomItem
}