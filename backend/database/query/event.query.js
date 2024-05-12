
const models = require('../models/index');
const {QueryTypes, Op} = require("sequelize");
const QuerySuccess = require("../../classes/QuerySuccess");
const QueryError = require("../../classes/QueryError");

class CreateEvent {
    static createEvent = async (event) => {
        try {
            // const {name, description, scheduledDate, author, picUrl} = event;

            const data = {
                ...event,
                createdAt: new Date(),
                updatedAt: new Date(),
            };

            const query = await models.Event.create(data);

            return new QuerySuccess(true, 'Se ha creado el evento correctamente.', query);
        } catch (e) {
            return new QueryError(false, e)
        }
    };

    static getAllEvents = async () => {
        try {
            const query = await models.Event.findAll();

            return new QuerySuccess(true, 'Se han obtenido los eventos correctamente.', query);
        } catch (e) {
            return new QueryError(false, e)
        }
    };
}

module.exports = CreateEvent;