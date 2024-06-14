const EventQuery = require("../database/query/event.query");
const StdResponse = require("../classes/stdResponse");
const convertHTMLToPDF = require("pdf-puppeteer");
const {uploadFiles, uploadBuffer} = require("../helpers/cloudinary.helper");
const EventUtils = require("../utils/event.utils");
const CustomError = require("../classes/customError");
const {fa} = require("@faker-js/faker");

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
        try {
            const event = req.body;
            event.author = req.payload.userId;

            const isClosed = await EventQuery.eventIsClosed(req.body.id);

            if (isClosed.query) return res.status(200).json(
                new StdResponse(isClosed.message,{executed: false})
            )

            const {message, executed, query} = await EventQuery.editEventDetails(event);

            return res.status(200).json(
                new StdResponse(message,{executed, query})
            )
        } catch (e) {
            console.log(e)

            return res.status(500).json(
                new StdResponse(e.message,{executed: false})
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
        try {
            const {id} = req.params;

            const isClosed = await EventQuery.eventIsClosed(req.body.id);

            if (isClosed.query) return res.status(200).json(
                new StdResponse(isClosed.message,{executed: false})
            )

            const {message, executed, query, error} = await EventQuery.deleteEvent(id);

            if (executed) {
                return res.status(200).json(
                    new StdResponse(message,{executed, query})
                )
            }
        }  catch (e) {
            console.log(e)

            return res.status(500).json(
                new StdResponse(e.message,{executed: false})
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

    static subscribeToEvent = async (req, res) => {
      try {
          const isClosed = (await EventQuery.eventIsClosed(req.params.id));

          if (isClosed.query) return res.status(200).json(
              new StdResponse(isClosed.message, {
                  executed: true,
                  closed: true
              })
          );

          const {message, executed} = await EventQuery.subscribeEvent(req.params.id, req.payload.userId);

          return res.status(200).json(
              new StdResponse(message, {
                  executed,
                  closed: false
              })
          );
      } catch (e) {
          console.log(e)

          return res.status(500).json(
              new StdResponse(e.message,{executed: false})
          )
      }

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
                new StdResponse('No se ha encontrado ningun evento con el ID indicado.', {executed: false})
            )

            return res.status(200).json(
                new StdResponse('Se ha creado correctamente el archivo', {file: {url: uploadedFile.secure_url}})
            )
        } catch (e) {
            return res.status(500).json(
                new StdResponse('Ha ocurrido un problema al crear el archivo.', {executed: false, error: e.toString()})
            )
        }
    };

    static updateEventPic = async (req, res) => {
        try {
            const key = 'pic';

            if (!req.files || !req.files[key]) return res.status(400).json(
                new StdResponse(
                    "No se ha subido ningun archivo.",
                    {
                        executed: false,
                    }
                )
            );

            const uploadedNames = await uploadFiles(req.files, {dir: '/event/pics', fileExtension: ['jpg', 'png', 'jpeg']});

            const picUrl = uploadedNames.get(key).secure_url;

            const {id} = req.params;

            const {message, query, executed} = await EventQuery.updateEventPic(id, picUrl)

            return res.status(200).json(
                new StdResponse(message, {
                    executed,
                    query
                })
            );
        } catch (e) {
            console.log(e)

            if (e instanceof CustomError) {
                return res.status(400).json(
                    new StdResponse(e.message,{executed: false})
                )
            }

            return res.status(500).json(
                new StdResponse(e.message,{executed: false})
            )
        }
    };

    static getEventMembers = async (req, res) => {
        try {
            const eventExists = await EventQuery.getEvent(req.params.id);

            if (!eventExists.query) return res.status(200).json(
                new StdResponse(eventExists.message, {
                    executed: false
                })
            );
            
            const {message, query, executed} = await EventQuery.getEventMembers(req.params.id);

            return res.status(200).json(
                new StdResponse(message, {
                    executed,
                    query
                })
            );
        } catch (e) {
            console.log(e);

            return res.status(500).json(
                new StdResponse('Ha ocurrido un problema al crear el archivo.', {executed: false, error: e.toString()})
            );
        }
    };
}

module.exports = EventController;