
const models = require('../models/index');
const {QueryTypes, Op} = require("sequelize");
const QuerySuccess = require("../../classes/QuerySuccess");
const QueryError = require("../../classes/QueryError");
const {logger} = require("sequelize/lib/utils/logger");
const {mode} = require("@cloudinary/url-gen/actions/rotate");
const {fi} = require("@faker-js/faker");
const {getEventCloseDate} = require("../../helpers/common.helper");

class CreateEvent {
    static createEvent = async (event) => {
        try {
            const closeDateTime = event.closeDateTime ?? getEventCloseDate(new Date(event.scheduledDateTime));

            const data = {
                ...event,
                closeDateTime,
                createdAt: new Date(),
                updatedAt: new Date(),
            };

            const query = await models.Event.create(data);

            console.log('Creado:', query)

            return new QuerySuccess(true, 'Se ha creado el evento correctamente.', query);
        } catch (e) {
            console.log(e)
            return new QueryError(false, e)
        }
    };

    static editEventDetails = async (eventDetails) => {
        try {
            const {name, description, scheduledDateTime} = eventDetails;

            const date = new Date(scheduledDateTime);

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
            const query = await models.Event.findAll({
                // include: {
                //     model: models.User,
                //     attributes: [
                //         [models.sequelize.fn('COUNT', models.Sequelize.col(`user`)), 'count'],
                //     ],
                //     group: 'event',
                //     as: 'assistants'
                // },
            });

            console.log(query)

            return new QuerySuccess(true, 'Se han obtenido los eventos correctamente.', query);
        } catch (e) {
            console.log(e)
            return new QueryError(false, e)
        }
    };

    static getEvent = async (id) => {
        try {
            const query = await models.Event.findOne({where: {id}});

            console.log(query)

            return new QuerySuccess(true, 'Se ha obtenido el evento correctamente.', query);
        } catch (e) {
            throw e
        }
    };

    static getIfSubscribedToEvent = async (event, user) => {
        try {
            const query = await models.EventAssistant.findOne({where: {user, event}}) !== null;

            return new QuerySuccess(true, 'Se ha realizado la consulta correctamente.', query);
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

    static getEventsRegistered = async (user) => {
        try {
            const query = await models.sequelize.query(
                `SELECT * FROM ${models.Event.tableName} WHERE id IN (SELECT event FROM ${models.EventAssistant.tableName} WHERE user = :user)`,
                {
                    replacements: {user},
                    type: QueryTypes.SELECT
                }
            );

            return new QuerySuccess(true, 'Se han obtenido los eventos disponibles correctamente.', query);
        } catch (e) {
            console.log(e)
            return new QueryError(false, e)
        }
    };

    static subscribeToEvent = async (event, user) => {
        try {
            const eventAssistant = {
                event,
                user,
                createdAt: new Date(),
                updatedAt: new Date(),
            };

            const query = await models.EventAssistant.create(eventAssistant) !== null;

            return new QuerySuccess(true, 'Se ha inscrito al evento correctamente.', query);
        } catch (e) {
            return new QueryError(false, e)
        }
    };

    static withdrawEvent = async (event, user) => {
        try {
            const query = await models.EventAssistant.destroy(
                {
                    where: {[Op.and]: [{event}, {user}]}
                }
            ) !== null;

            return new QuerySuccess(true, 'Se ha retirado del evento correctamente.', query);
        } catch (e) {
            return new QueryError(false, e)
        }
    };

    static updateEventSummary = async (eventId, fileLink) => {
        try {
            const query = await models.Event.update({summaryUrl: fileLink},
                {
                    where: {id: eventId}
                }
            ) !== null;

            return new QuerySuccess(true, 'Se ha actualizado el evento correctamente.', query);
        } catch (e) {
            return new QueryError(false, e)
        }
    };

    static updateEventPic = async (eventId, fileLink) => {
        try {
            const query = await models.Event.update({picUrl: fileLink},
                {
                    where: {id: eventId}
                }
            ) !== null;

            return new QuerySuccess(true, 'Se ha actualizado el evento correctamente.', query);
        } catch (e) {
            return new QueryError(false, e)
        }
    };

    static eventIsClosed = async (eventId) => {
        try {
            // const query = await models.sequelize.query(
            //     `SELECT * FROM ${models.Event.tableName} WHERE close_date_time < NOW() AND id = :id`,
            //     {replacements: {id: eventId}}
            // ) !== null;

            const query = await models.Event.findOne({
                where: {
                    [Op.and]: [
                        {id: eventId},
                        {closeDateTime: {[Op.lt]: new Date(Date.now())}}
                    ]
                }
            }) !== null


            const message = query ? 'El evento está cerrado.' : 'El evento aun está abierto a inscripciones.'

            return new QuerySuccess(true, message, query);
        } catch (e) {
            throw e
        }
    };

    static getEventMembers = async (eventId) => {
        const query = (await models.Event.findOne({
            include: {
                model: models.User,
                as: 'assistants'
            },
            where: {
                id: eventId
            }
        })).assistants;

        console.log(query)

        return new QuerySuccess(true, "Se han obtenido los miembros del evento correctamente", query);
    };

    static getEventNonAssistants = async (eventId) => {
        const assistants = ((await models.Event.findOne({
            include: {
                model: models.User,
                as: 'assistants'
            },
            where: {
                id: eventId
            }
        })).assistants).map(user => user.id);

        const nonAssistants = await models.User.findAll({
            where: {id: {[Op.notIn]: assistants}}
        })

        return new QuerySuccess(true, "Se han obtenido los usuarios no miembros del evento correctamente", nonAssistants);
    };
}

module.exports = CreateEvent;