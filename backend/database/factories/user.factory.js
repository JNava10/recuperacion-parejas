require('dotenv').config()
const {fakerES} = require('@faker-js/faker');
const models = require('../models/index');
const {hashPassword} = require("../../helpers/common.helper");

const get = async (number) => {
    const users = [];

    for (let i = 0; i < number; i++) {
        const name =  fakerES.person.firstName();
        const firstSurname =  fakerES.person.lastName();
        const lastSurname =  fakerES.person.lastName();
        const nickname =  `${name[0]}${firstSurname[0]}${lastSurname[0]}${i}`; // Coge las iniciales del usuario y su indice. (Ej. jnr1)
        const picUrl = process.env.DEFAULT_PROFILE_PIC_URL;
        const email = `${nickname}@gmail.com`;
        const password = await hashPassword(process.env.DEFAULT_PASSWORD);

        const user = {
            name: name,
            first_surname: firstSurname,
            second_surname: lastSurname,
            nickname: nickname,
            password: password,
            pic_url: picUrl,
            email: email.toLowerCase()
        }

        users.push(user);
    }

    return Promise.all(users)
}

module.exports = {
    get
}