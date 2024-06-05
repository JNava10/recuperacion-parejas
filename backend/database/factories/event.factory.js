require('dotenv').config()
const {fakerES, faker, fa} = require('@faker-js/faker');
const models = require('../models/index');
const {hashPassword, getRandomItem} = require("../../helpers/common.helper");

const get = async (number) => {
    const events = [];
    const userFields = await models.User.findAll({attributes: ['id']});
    const scheduledOffset = 4; // Numero de dias hasta que caduque el evento.
    const date = new Date(Date.now());
    const scheduledDate = new Date(date.setDate(date.getDate() + scheduledOffset));

    for (let i = 0; i < number; i++) {
        const randomUser = getRandomItem(userFields);
        const event = {
            name: fakerES.lorem.sentences(1),
            description: faker.lorem.lines({min: 1, max: 3}),
            author: randomUser.id,
            pic_url: faker.image.url(),
            summary_url: faker.image.url(),
            latitude: faker.location.latitude(),
            longitude: faker.location.longitude(),
            scheduled_date_time: scheduledDate,
        }

        events.push(event);
    }

    return events
}

module.exports = {
    get
}