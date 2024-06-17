const EventQuery = require("../database/query/event.query");
const StdResponse = require("../classes/stdResponse");
const {uploadFiles} = require("../helpers/cloudinary.helper");
const EventUtils = require("../utils/event.utils");
const CustomError = require("../classes/customError");
const UserQuery = require("../database/query/user.query");

class EventController {

    static createEvent = async (req, res) => {
        try {
            const eventBody = req.body;
            eventBody.author = req.payload.userId;

            const {message, executed, query} = await EventQuery.createEvent(eventBody);

            const event = query;

            const summaryFile = await EventUtils.generateSummaryFile(event)

            await EventQuery.updateEventSummary(event.id, summaryFile.secure_url);

            return res.status(200).json(
                new StdResponse(message,{executed, query})
            )
        } catch (e) {
            return res.status(203).json(
                new StdResponse('Ha ocurrido un problema al crear el evento.',{executed: false, error: e.message})
            )
        }
    };

    static editEventDetails = async (req, res) => {
        try {
            const event = req.body;
            event.author = req.payload.userId;

            const eventExists = await EventQuery.eventExists(req.body.id);// TODO: Validator

            if (!eventExists.query) return res.status(200).json(
                new StdResponse(eventExists.message, {
                    executed: false
                })
            );

            const isClosed = await EventQuery.eventIsClosed(req.body.id);// TODO: Middleware

            if (isClosed.query) return res.status(200).json(
                new StdResponse(isClosed.message,{executed: false})
            )

            const {message, executed, query} = await EventQuery.editEventDetails(event);

            return res.status(200).json(
                new StdResponse(message,{executed, query})
            )
        } catch (e) {
            return res.status(203).json(
                new StdResponse('Ha ocurrido un problema al comprobar el codigo de recuperación.',{executed: false, error: e.message})
            )
        }
    };

    static editEventPlace = async (req, res) => {
        try {
            const event = req.body;
            event.author = req.payload.userId;

            const eventExists = await EventQuery.eventExists(req.body.id);// TODO: Validator

            if (!eventExists.query) return res.status(200).json(
                new StdResponse(eventExists.message, {
                    executed: false
                })
            );

            const isClosed = await EventQuery.eventIsClosed(req.body.id);// TODO: Validator

            if (isClosed.query) return res.status(200).json(
                new StdResponse(isClosed.message,{executed: false})
            )

            const {message, executed, query} = await EventQuery.editEventPlace(event);

            return res.status(200).json(
                new StdResponse(message,{executed, query})
            )
        } catch (e) {
            return res.status(203).json(
                new StdResponse('Ha ocurrido un problema al comprobar el codigo de recuperación.',{executed: false, error: e.message})
            )
        }
    };

    static deleteEventById = async (req, res) => {
        try {

            const eventExists = await EventQuery.eventExists(req.params.eventId); // TODO: Validator

            if (!eventExists.query) return res.status(200).json(
                new StdResponse(eventExists.message, {
                    executed: false
                })
            );

            const isClosed = await EventQuery.eventIsClosed(req.params.eventId);// TODO: Middleware

            if (isClosed.query) return res.status(200).json(
                new StdResponse(isClosed.message,{executed: false})
            )

            const {message, executed, query} = await EventQuery.deleteEvent(req.params.eventId);

            return res.status(200).json(
                new StdResponse(message,{executed, query})
            )
        } catch (e) {
            return res.status(203).json(
                new StdResponse('Ha ocurrido un problema al borrar el evento.',{executed: false, error: e.message})
            )
        }
    };

    static getAllEvent = async (req, res) => {
        try {
            const {message, executed, query} = await EventQuery.getAllEvents();

            if (query.length === 0) return res.status(404).json(
                new StdResponse("No se ha encontrado ningun evento",{executed, query})
            )

            return res.status(200).json(
                new StdResponse(message,{executed, query})
            )
        } catch (e) {
            return res.status(203).json(
                new StdResponse('Ha ocurrido un problema al obtener los eventos.',{executed: false, error: e.message})
            )
        }
    };

    static getEvent = async (req, res) => {
        try {
            const {message, executed, query} = await EventQuery.getEvent(req.params.eventId);

            return res.status(200).json(
                new StdResponse(message,{executed, query})
            )
        } catch (e) {
            return res.status(203).json(
                new StdResponse('Ha ocurrido un problema al obtener el evento.',{executed: false, error: e.message})
            )
        }
    };

    static getIfRegisteredToEvent = async (req, res) => {
        try {
            const eventExists = await EventQuery.eventExists(req.params.eventId);// TODO: Validator

            if (!eventExists.query) return res.status(200).json(
                new StdResponse(eventExists.message, {
                    executed: false
                })
            );

            const {message, executed, query} = await EventQuery.getIfSubscribedToEvent(req.params.eventId, req.payload.userId);

            return res.status(200).json(
                new StdResponse(message,{executed, query})
            )
        } catch (e) {
            return res.status(203).json(
                new StdResponse('Ha ocurrido un problema al obtener el evento.',{executed: false, error: e.message})
            )
        }
    };

    static getEventsRegistered = async (req, res) => {
        try {
            const {message, executed, query} = await EventQuery.getEventsRegistered(req.payload.userId);

            return res.status(200).json(
                new StdResponse(message,{executed, query})
            )
        } catch (e) {
            return res.status(203).json(
                new StdResponse('Ha ocurrido un problema al obtener los eventos.',{executed: false, error: e.message})
            )
        }
    };

    static getAvailableEvents = async (req, res) => {
       try {
           const {message, executed, query} = await EventQuery.getAvailableEvents();

           if (query.length === 0) return res.status(404).json(
               new StdResponse('No hay ningun evento disponible.',{executed, query})
           )

           return res.status(200).json(
               new StdResponse(message,{executed, query})
           )
       } catch (e) {
           return res.status(203).json(
               new StdResponse("Ha ocurrido un problema al obtener los eventos",{executed: false, error: e.message})
           )
       }

    };

    static subscribeToEvent = async (req, res) => {
      try {
          const eventExists = await EventQuery.eventExists(req.params.eventId);// TODO: Validator

          if (!eventExists.query) return res.status(200).json(
              new StdResponse(eventExists.message, {
                  executed: false
              })
          );

          const isClosed = (await EventQuery.eventIsClosed(req.params.eventId));// TODO: Validator

          if (isClosed.query) return res.status(200).json(
              new StdResponse(isClosed.message, {
                  executed: true,
                  closed: true
              })
          );

          const userId = req.params.userId || req.payload.userId;

          if (req.params.userId) {
              const userExists = (await UserQuery.checkIfIdExists(id)).query // TODO: Validator

              if (userExists.query) return res.status(404).json(
                  new StdResponse(userExists.message, {
                      executed: false
                  })
              );
          }

          // TODO: Comprobar si el usuario está suscrito

          const {message, executed} = await EventQuery.subscribeToEvent(req.params.eventId, userId);

          return res.status(200).json(
              new StdResponse(message, {
                  executed,
                  closed: false
              })
          );
      } catch (e) {
          return res.status(203).json(
              new StdResponse('Ha ocurrido un problema al suscribirse al evento.',{executed: false, error: e.message})
          )
      }
    };

    static withdrawEvent = async (req, res) => {
         try {
             const eventId = req.params.eventId

             const eventExists = await EventQuery.eventExists(eventId);// TODO: Validator

             if (!eventExists.query) return res.status(200).json(
                 new StdResponse(eventExists.message, {
                     executed: false
                 })
             );

             const isClosed = (await EventQuery.eventIsClosed(eventId));// TODO: Middleware
             if (isClosed.query) return res.status(200).json(
                 new StdResponse(isClosed.message, {
                     executed: true,
                     closed: true
                 })
             );

             const userId = req.params.userId || req.payload.userId;

             if (req.params.userId) {
                 const userExists = (await UserQuery.checkIfIdExists(eventId)).query // TODO: Validator

                 if (userExists.query) return res.status(404).json(
                     new StdResponse(userExists.message, {
                         executed: false
                     })
                 );
             }

             // TODO: Comprobar si el usuario está suscrito


             const {message, executed, query} = await EventQuery.withdrawFromEvent(eventId, userId);

             return res.status(200).json(
                 new StdResponse(message,{executed, query})
             )
         }  catch (e) {
             return res.status(203).json(
                 new StdResponse('Ha ocurrido un problema al desapuntar al usuario.',{executed: false, error: e.message})
             )
         }
    };

    static getSummaryFile = async (req, res) => {
        try {
            const eventExists = await EventQuery.eventExists(req.params.eventId); // TODO: Validator

            if (!eventExists.query) return res.status(200).json(
                new StdResponse(eventExists.message, {
                    executed: false
                })
            );

            return res.status(200).json(
                new StdResponse('Se ha creado correctamente el archivo', {file: {url: uploadedFile.secure_url}})
            )
        } catch (e) {
            return res.status(203).json(
                new StdResponse('Ha ocurrido un problema al obtener el archivo de resumen.', {executed: false, error: e.message})
            )
        }
    };

    static updateEventPic = async (req, res) => {
        try {
            const eventId = req.params.eventId

            const eventExists = await EventQuery.eventExists(eventId); // TODO: Validator

            if (!eventExists.query) return res.status(200).json(
                new StdResponse(eventExists.message, {
                    executed: false
                })
            );

            const isClosed = (await EventQuery.eventIsClosed(eventId)); // TODO: Middleware

            if (isClosed.query) return res.status(200).json(
                new StdResponse(isClosed.message, {
                    executed: true,
                    closed: true
                })
            );

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

            const {message, query, executed} = await EventQuery.updateEventPic(eventId, picUrl)

            return res.status(200).json(
                new StdResponse(message, {
                    executed,
                    query
                })
            );
        } catch (e) {
            if (e instanceof CustomError) {
                return res.status(400).json(
                    new StdResponse(e.message,{executed: false})
                )
            }

            return res.status(203).json(
                new StdResponse('Ha ocurrido un problema al actualizar el evento.', {executed: false, error: e.message})
            )
        }
    };

    static getEventMembers = async (req, res) => {
        try {
            const eventExists = await EventQuery.eventExists(req.params.eventId);// TODO: Validator

            if (!eventExists.query) return res.status(200).json(
                new StdResponse(eventExists.message, {
                    executed: false
                })
            );
            
            const {message, query, executed} = await EventQuery.getEventMembers(req.params.eventId);

            return res.status(200).json(
                new StdResponse(message, {
                    executed,
                    query
                })
            );
        } catch (e) {
            return res.status(500).json(
                new StdResponse('Ha ocurrido un problema al buscar los usuarios', {executed: false, error: e.toString()})
            );
        }
    };

    static getEventNotMembers = async (req, res) => {
        try {
            const eventExists = await EventQuery.eventExists(req.params.eventId);// TODO: Validator

            if (!eventExists.query) return res.status(200).json(
                new StdResponse(eventExists.message, {
                    executed: false
                })
            );

            const {message, query, executed} = await EventQuery.getEventNonAssistants(req.params.eventId);

            return res.status(200).json(
                new StdResponse(message, {
                    executed,
                    query
                })
            );
        } catch (e) {
            return res.status(203).json(
                new StdResponse('Ha ocurrido un problema al obtener los usuarios no miembros.', {executed: false, error: e.message})
            )
        }
    };

    static addMemberToEvent = async (req, res) => {
        try {
            const event = req.params.eventId;
            const user = req.params.userId;

            const eventExists = await EventQuery.eventExists(event); // TODO: Validator
            const userExists = await UserQuery.checkIfIdExists(user); // TODO: Validator

            if (!eventExists.query && !userExists.query) return res.status(200).json(
                new StdResponse("No existen ni el usuario ni el evento indicados.", {
                    executed: false
                })
            );
            else if (!eventExists.query) return res.status(200).json(
                new StdResponse(eventExists.message, {
                    executed: false
                })
            );
            else if (!userExists.query) return res.status(200).json(
                new StdResponse(userExists.message, {
                    executed: false
                })
            );

            const isClosed = (await EventQuery.eventIsClosed(req.params.eventId));

            if (isClosed.query) return res.status(200).json(
                new StdResponse(isClosed.message, {
                    executed: false,
                    closed: true
                })
            );

            const {message, query, executed} = await EventQuery.subscribeToEvent(event, user);

            return res.status(200).json(
                new StdResponse(message, {
                    executed,
                    query
                })
            );
        } catch (e) {
            return res.status(203).json(
                new StdResponse('Ha ocurrido un problema al añadir el miembro al evento.', {executed: false, error: e.message})
            )
        }
    };

    static removeFromEvent = async (req, res) => {
        try {
            const event = req.params.eventId;
            const user = req.params.userId;

            const eventExists = await EventQuery.eventExists(event);// TODO: Validator
            const userExists = await UserQuery.checkIfIdExists(user);// TODO: Validator

            if (!eventExists.query && !userExists.query) return res.status(404).json(
                new StdResponse("No existen ni el usuario ni el evento indicados.", {
                    executed: false
                })
            );
            else if (!eventExists.query) return res.status(404).json(
                new StdResponse(eventExists.message, {
                    executed: false
                })
            );
            else if (!userExists.query) return res.status(404).json(
                new StdResponse(userExists.message, {
                    executed: false
                })
            );

            const {message, query, executed} = await EventQuery.withdrawFromEvent(event, user);

            return res.status(200).json(
                new StdResponse(message, {
                    executed,
                    query
                })
            );
        } catch (e) {
            return res.status(203).json(
                new StdResponse('Ha ocurrido un problema al desapuntar al usuario.', {executed: false, error: e.message})
            )
        }
    };
}

module.exports = EventController;