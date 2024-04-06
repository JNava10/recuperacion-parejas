require('dotenv').config()
const {fakerES, faker, fa} = require('@faker-js/faker');
const models = require('../models/index');
const {hashPassword, getRandomItem} = require("../../helpers/common.helper");

const get = async (number) => {
    const events = [];
    const userFields = await models.User.findAll({attributes: ['id']});

    for (let i = 0; i < number; i++) {
        const randomUser = getRandomItem(userFields);
        const role = {
            name: fakerES.lorem.sentences(1),
            description: faker.lorem.lines({min: 1, max: 3}),
            author: randomUser.id,
            pic_url: faker.image.url(),
            summary_url: faker.image.url(),
            latitude: faker.location.latitude(),
            longitude: faker.location.longitude(),
            updated_at: new Date(),
        }

        events.push(role);
    }

    return events
}

module.exports = {
    get
}