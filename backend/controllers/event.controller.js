
const EventQuery = require("../database/query/event.query");
const StdResponse = require("../classes/stdResponse");
const convertHTMLToPDF = require("pdf-puppeteer");
const {uploadFiles, uploadBuffer} = require("../helpers/cloudinary.helper");
const EventUtils = require("../utils/event.utils");

class EventController {

    static createEvent = async (req, res) => {
        const eventBody = req.body;
        eventBody.author = req.payload.userId;

        const {message, executed, query, error} = await EventQuery.createEvent(eventBody);

        const event = query;

        const summaryFile = await EventUtils.generateSummaryFile(event)

        await EventQuery.updateEventSummary(event.id, summaryFile.secure_url);

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

    static getSummaryFile = async (req, res) => {
        try {
            const event = (await EventQuery.getEvent(req.params.id)).query;

            if (!event) return res.status(200).json(
                new StdResponse('No se ha encontrado ningun evento con el ID indicado.',{executed: false})
            )

            return res.status(200).json(
                new StdResponse('Se ha creado correctamente el archivo',{file: {url: uploadedFile.secure_url}})
            )
        } catch (e) {
            return res.status(500).json(
                new StdResponse('Ha ocurrido un problema al crear el archivo.',{executed: false, error: e.toString()})
            )
        }
    };
}

module.exports = EventController