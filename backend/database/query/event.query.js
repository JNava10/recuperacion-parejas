
const models = require('../models/index');
const {QueryTypes, Op} = require("sequelize");
const QuerySuccess = require("../../classes/QuerySuccess");
const QueryError = require("../../classes/QueryError");
const {logger} = require("sequelize/lib/utils/logger");

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

    static editEventDetails = async (eventDetails) => {
        try {
            const {name, description, scheduledDateTime} = eventDetails;

            const date = new Date(scheduledDateTime);

            console.log(date)

            const query = await models.Event.update({name, description, scheduledDateTime: date}, {where: {id: eventDetails.id}});

            return new QuerySuccess(true, 'Se ha editado el evento correctamente.', query);
        } catch (e) {
            return new QueryError(false, e)
        }
    };

    static editEventPlace = async (eventPlace) => {
        try {
            const {longitude, latitude} = eventPlace;

            const query = await models.Event.update({longitude, latitude}, {where: {id: eventPlace.id}});

            return new QuerySuccess(true, 'Se ha editado el evento correctamente.', query);
        } catch (e) {
            return new QueryError(false, e)
        }
    };

    static deleteEvent = async (id) => {
        try {
            console.log(id)
            const query = await models.Event.destroy({where: {id: id}});

            return new QuerySuccess(true, 'Se ha borrado el evento correctamente.', query);
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

    static getAvailableEvents = async () => {
        try {
            const query = await models.Event.findAll({where: {scheduledDateTime: {[Op.gt]: new Date(Date.now())}}});

            return new QuerySuccess(true, 'Se han obtenido los eventos disponibles correctamente.', query);
        } catch (e) {
            return new QueryError(false, e)
        }
    };
}

module.exports = CreateEvent;