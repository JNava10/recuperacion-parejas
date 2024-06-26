
const models = require('../models/index');
const {QueryTypes, Op} = require("sequelize");
const QuerySuccess = require("../../classes/QuerySuccess");
const {getEventCloseDate} = require("../../helpers/common.helper");

class EventQuery {
    static createEvent = async (event) => {
        try {
            const closeDateTime = event.closeDateTime || getEventCloseDate(new Date(event.scheduledDateTime));

            const data = {
                ...event,
                closeDateTime,
                createdAt: new Date(),
                updatedAt: new Date(),
            };

            const query = await models.Event.create(data);

            return new QuerySuccess(true, 'Se ha creado el evento correctamente.', query);
        } catch (e) {
            console.error(e)
            throw e
        }
    };

    static editEventDetails = async (eventDetails) => {
        try {
            const {name, description, scheduledDateTime, closeDateTime} = eventDetails;

            const scheduleDate = new Date(scheduledDateTime);
            const closeDate = new Date(closeDateTime);

            const query = await models.Event.update({name, description, scheduledDateTime: scheduleDate,  closeDateTime: closeDate}, {where: {id: eventDetails.id}});

            return new QuerySuccess(true, 'Se ha editado el evento correctamente.', query);
        } catch (e) {
            console.error(e)
            throw e
        }
    };

    static editEventPlace = async (eventPlace) => {
        try {
            const {longitude, latitude} = eventPlace;

            const query = await models.Event.update({longitude, latitude}, {where: {id: eventPlace.id}});

            return new QuerySuccess(true, 'Se ha editado el evento correctamente.', query);
        } catch (e) {
            console.error(e)
            throw e
        }
    };

    static deleteEvent = async (id) => {
        try {
            const query = await models.Event.destroy({where: {id: id}});

            return new QuerySuccess(true, 'Se ha borrado el evento correctamente.', query);
        } catch (e) {
            console.error(e)
            throw e
        }
    };

    static getAllEvents = async () => {
        try {
            const query = await models.Event.findAll();

            return new QuerySuccess(true, 'Se han obtenido los eventos correctamente.', query);
        } catch (e) {
            console.error(e)
            throw e
        }
    };

    static getEvent = async (id) => {
        try {
            const query = await models.Event.findOne({where: {id}});

            return new QuerySuccess(true, 'Se ha obtenido el evento correctamente.', query);
        } catch (e) {
            console.error(e)
            throw e
        }
    };

    static eventExists = async (id) => {
        try {
            const query = (await models.Event.findOne({where: {id}}) !== null);

            const message = query ? 'El evento indicado existe.' : 'El evento indicado no existe.'

            return new QuerySuccess(true, message, query);
        } catch (e) {
            console.error(e)
            throw e
        }
    };

    static getIfSubscribedToEvent = async (event, user) => {
        try {
            const query = await models.EventAssistant.findOne({where: {user, event}}) !== null;

            return new QuerySuccess(true, 'Se ha realizado la consulta correctamente.', query);
        } catch (e) {
            console.error(e)
            throw e
        }
    };

    static getAvailableEvents = async () => {
        try {
            const query = await models.Event.findAll({where: {scheduledDateTime: {[Op.gt]: new Date(Date.now())}}});

            return new QuerySuccess(true, 'Se han obtenido los eventos disponibles correctamente.', query);
        } catch (e) {
            console.error(e)
            throw e
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
            console.error(e)
            throw e
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
            console.error(e)
            throw e
        }
    };

    static withdrawFromEvent = async (event, user) => {
        try {
            const query = await models.EventAssistant.destroy(
                {
                    where: {[Op.and]: [{event}, {user}]}
                }
            ) !== null;

            return new QuerySuccess(true, 'Se ha retirado del evento correctamente.', query);
        } catch (e) {
            console.log('error aqui')

            console.error(e)
            throw e
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
            console.error(e)
            throw e
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
            console.error(e)
            throw e
        }
    };

    static eventIsClosed = async (eventId) => {
        try {
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
            console.error(e)
            throw e
        }
    };

    static getEventMembers = async (eventId) => {
      try {
          const query = (await models.Event.findOne({
              include: {
                  model: models.User,
                  as: 'assistants'
              },
              where: {
                  id: eventId
              }
          })).assistants;

          return new QuerySuccess(true, "Se han obtenido los miembros del evento correctamente", query);
      } catch (e) {
          console.error(e)
          throw e
      }
    };

    static getEventNonAssistants = async (eventId) => {
        try {
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
        } catch (e) {
            console.error(e)
            throw e
        }
    }
}

module.exports = EventQuery;