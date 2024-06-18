const EventQuery = require("../../database/query/event.query");
const CustomError = require("../../classes/customError");

const eventMustExist = async (eventId) => {
    try {
        const eventExists = await EventQuery.eventExists(eventId);

        if (!eventExists.query) throw new CustomError('El usuario no existe.')
    } catch (e) {
        throw new Error('Ha habido un problema al comprobar si el usuario existe.')
    }
}

const eventMustNotClosed = async (eventId) => {
    try {
        const isClosed = await EventQuery.eventIsClosed(eventId);

        if (isClosed.query) throw new CustomError('El usuario no existe.')
    } catch (e) {
        throw new Error('Ha habido un problema al comprobar si el usuario existe.')
    }
}

module.exports = {
    eventMustExist,
    eventMustNotClosed
}