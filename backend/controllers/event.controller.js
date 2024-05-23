
const EventQuery = require("../database/query/event.query");
const StdResponse = require("../classes/stdResponse");
const QuerySuccess = require("../classes/QuerySuccess");
const {findRecentChatMessages} = require("../database/query/message.query");
const {id_ID} = require("@faker-js/faker");

class EventController {

    static createEvent = async (req, res) => {
        const event = req.body;
        event.author = req.payload.userId;

        const {message, executed, query, error} = await EventQuery.createEvent(event);

        if (executed) {
            return res.status(200).json(
                new StdResponse(message,{executed, query})
            )
        } else if (!executed && query) {
            return res.status(200).json(
                new StdResponse(message,{executed, query})
            )
        } else if (!query) {
            return res.status(500).json(
                new StdResponse(message,{executed, error})
            )
        }
    };

    static editEventDetails = async (req, res) => {
        const event = req.body;
        event.author = req.payload.userId;

        const {message, executed, query, error} = await EventQuery.editEventDetails(event);

        if (executed) {
            return res.status(200).json(
                new StdResponse(message,{executed, query})
            )
        } else if (!executed && query) {
            return res.status(200).json(
                new StdResponse(message,{executed, query})
            )
        } else if (!query) {
            console.log(error)
            return res.status(500).json(
                new StdResponse(message,{executed, error})
            )
        }
    };

    static editEventPlace = async (req, res) => {
        const event = req.body;
        event.author = req.payload.userId;

        const {message, executed, query, error} = await EventQuery.editEventPlace(event);

        if (executed) {
            return res.status(200).json(
                new StdResponse(message,{executed, query})
            )
        } else if (!executed && query) {
            return res.status(200).json(
                new StdResponse(message,{executed, query})
            )
        } else if (!query) {
            console.log(error)
            return res.status(500).json(
                new StdResponse(message,{executed, error})
            )
        }
    };

    static deleteEventById = async (req, res) => {
        const {id} = req.params;

        const {message, executed, query, error} = await EventQuery.deleteEvent(id);

        if (executed) {
            return res.status(200).json(
                new StdResponse(message,{executed, query})
            )
        } else if (!executed && query) {
            return res.status(200).json(
                new StdResponse(message,{executed, query})
            )
        } else if (!query) {
            console.log(error)
            return res.status(500).json(
                new StdResponse(message,{executed, error})
            )
        }
    };

    static getAllEvent = async (req, res) => {
        const {message, executed, query, error} = await EventQuery.getAllEvents();

        if (executed) {
            return res.status(200).json(
                new StdResponse(message,{executed, query})
            )
        } else if (!executed && query) {
            return res.status(200).json(
                new StdResponse(message,{executed, query})
            )
        } else if (!query) {
            return res.status(500).json(
                new StdResponse(message,{executed, error})
            )
        }
    };

    static getEvent = async (req, res) => {
        console.log('a')
        const {message, executed, query, error} = await EventQuery.getEvent(req.params.id);

        if (executed) {
            return res.status(200).json(
                new StdResponse(message,{executed, query})
            )
        } else if (!executed && query) {
            return res.status(200).json(
                new StdResponse(message,{executed, query})
            )
        } else if (!query) {
            return res.status(500).json(
                new StdResponse(message,{executed, error})
            )
        }
    };

    static getIfRegisteredToEvent = async (req, res) => {
        const {message, executed, query, error} = await EventQuery.getIfSubscribedToEvent(req.params.id, req.payload.userId);

        if (executed) {
            return res.status(200).json(
                new StdResponse(message,{executed, query})
            )
        } else if (!executed && query) {
            return res.status(200).json(
                new StdResponse(message,{executed, query})
            )
        } else if (!query) {
            return res.status(500).json(
                new StdResponse(message,{executed, error})
            )
        }
    };

    static getEventsRegistered = async (req, res) => {
        const {message, executed, query, error} = await EventQuery.getEventsRegistered(req.payload.userId);

        if (executed) {
            return res.status(200).json(
                new StdResponse(message,{executed, query})
            )
        } else if (!executed && query) {
            return res.status(200).json(
                new StdResponse(message,{executed, query})
            )
        } else if (!query) {
            return res.status(500).json(
                new StdResponse(message,{executed, error})
            )
        }
    };


    static getAvailableEvents = async (req, res) => {
        const {message, executed, query, error} = await EventQuery.getAvailableEvents();

        if (executed) {
            return res.status(200).json(
                new StdResponse(message,{executed, query})
            )
        } else if (!executed && query) {
            return res.status(200).json(
                new StdResponse(message,{executed, query})
            )
        } else if (!query) {
            console.log(error)
            return res.status(500).json(
                new StdResponse(message,{executed, error})
            )
        }
    };

    static registerToEvent = async (req, res) => {
        const {message, executed, query, error} = await EventQuery.subscribeEvent(req.params.id, req.payload.userId);

        if (executed) {
            return res.status(200).json(
                new StdResponse(message,{executed, query})
            )
        } else if (!executed && query) {
            return res.status(200).json(
                new StdResponse(message,{executed, query})
            )
        } else if (!query) {
            console.log(error)
            return res.status(500).json(
                new StdResponse(message,{executed, error})
            )
        }
    };

    static withdrawEvent = async (req, res) => {
        const {message, executed, query, error} = await EventQuery.withdrawEvent(req.params.id, req.payload.userId);

        if (executed) {
            return res.status(200).json(
                new StdResponse(message,{executed, query})
            )
        } else if (!executed && query) {
            return res.status(200).json(
                new StdResponse(message,{executed, query})
            )
        } else if (!query) {
            console.log(error)
            return res.status(500).json(
                new StdResponse(message,{executed, error})
            )
        }
    };
}

module.exports = EventController