
const EventQuery = require("../database/query/event.query");
const StdResponse = require("../classes/stdResponse");
const QuerySuccess = require("../classes/QuerySuccess");
const {findRecentChatMessages} = require("../database/query/message.query");
const {id_ID} = require("@faker-js/faker");

class EventController {

    static createEvent = async (req, res) => {
        const event = req.body;
        event.author = req.payload.userId;

        console.log(event)

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
}

module.exports = EventController