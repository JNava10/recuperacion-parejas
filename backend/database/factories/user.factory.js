require('dotenv').config()
const {fakerES} = require('@faker-js/faker');
const {hashPassword} = require("../../helpers/common.helper");
const models = require("../models");
const {roleNames} = require("../../constants/seed.const");
const UserSeed = require("../../classes/UserSeed");

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

        const user = new UserSeed(
            name,
            firstSurname,
            lastSurname,
            nickname,
            password,
            picUrl,
            email,
        );

        const isLogged = Boolean(Math.random());

        user.last_login = isLogged ? new Date(Date.now()) : null;


        users.push(user);
    }

    return Promise.all(users)
}

/**
 *
 * @returns {Promise<UserSeed>}
 * @param name
 * @param firstSurname
 * @param lastSurname
 * @param nickname
 * @param email
 */
const createCustom = async (name, firstSurname, lastSurname, nickname, email) => {
    const picUrl = process.env.DEFAULT_PROFILE_PIC_URL;
    const password = await hashPassword(process.env.DEFAULT_PASSWORD);

    return new UserSeed(
        name,
        firstSurname,
        lastSurname,
        nickname,
        password,
        picUrl,
        email,
    );
}

module.exports = {
    get,
    createCustom
}