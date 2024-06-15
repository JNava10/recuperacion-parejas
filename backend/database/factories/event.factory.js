require('dotenv').config()
const {fakerES, faker, fa} = require('@faker-js/faker');
const models = require('../models/index');
const {hashPassword, getRandomItem} = require("../../helpers/common.helper");

const get = async (number) => {
    const events = [];
    const userFields = await models.User.findAll({attributes: ['id']});

    const multiplier = (24 * 60 * 60 * 1000); // Un dia
    const scheduledOffset = 4; // Numero de dias a partir de la fecha actual hasta la fecha del evento.
    const closeOffset = 1; // Numero de dias antes de la fecha del evento hasta que caduque el evento.
    const scheduledDate = new Date(Date.now() + (scheduledOffset * multiplier));
    const closeDate = new Date(scheduledDate - (closeOffset * multiplier));

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
            close_date_time: closeDate,
        }

        events.push(event);
    }

    return events
}

module.exports = {
    get
}