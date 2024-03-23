const {hash} = require("bcrypt");
require('dotenv').config()
const hashPassword = async (plainText) => {
    return await hash(plainText, Number(process.env.PASSWORD_HASH_SALT));
}

module.exports = {
    hashPassword
}