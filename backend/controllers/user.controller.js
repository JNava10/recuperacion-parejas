
const {sendStandardResponse} = require("../helpers/common.helper");
const UserQuery = require("../database/query/user.query");
const {compare} = require("bcrypt");
const {generateToken} = require("../helpers/jwt.helper");
const StdResponse = require("../classes/stdResponse");
const QuerySuccess = require("../classes/QuerySuccess");
const {findRecentChatMessages} = require("../database/query/message.query");
const EventQuery = require("../database/query/event.query");

class UserController {
    static findUser = async (req, res) => {
        const inputSearch = req.body.input;
        const inputIsOneWord = inputSearch.split(" ").length > 1;

        let results;

        if (inputIsOneWord) results = await UserQuery.findUserLikeFullname(inputSearch);
        else results = await UserQuery.findUserByNickOrName(inputSearch);

        return res.status(200).json(
            new StdResponse(
                'Se ha iniciado sesión correctamente.',
                {founded: results.length > 0, results}
            )
        )
    };

    static findById = async (req, res) => {
        const userId = req.params.id;

        const user = await UserQuery.findUserById
    }

    static getMessages = async (req, res) => {
        const receiverId = req.params.receiver;
        const emitterId = req.payload.userId;

        const result = await findRecentChatMessages(emitterId, receiverId)

        if (result instanceof QuerySuccess) return res.status(200).json(
            new StdResponse(
                'Se ha insertado el mensaje correctamente.',
                result
            )
        )
        else {
            return res.status(500).json(
                new StdResponse(
                    'Error al ejecutar la consulta.',
                    result
                )
            )
        }
    }

    static pushMessage = async (req, res) => {
        const receiverId = req.body.receiver;
        const message = req.body.message;
        const emitterId = req.payload.userId;

        const result = await UserQuery.pushMessage(emitterId, receiverId, message)

        if (result instanceof QuerySuccess) return res.status(200).json(
            new StdResponse(
                'Se ha insertado el mensaje correctamente.',
                result
            )
        )
        else {
            return res.status(200).json(
                new StdResponse(
                    'Error al ejecutar la consulta.',
                    result
                )
            )
        }
    }

    static getNotDeletedUsers = async (req, res) => {
        const {message, executed, query, error} = await UserQuery.getNotDeletedUsers();

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

    static getNotDeletedUsersWithRoles = async (req, res) => {
        const {message, executed, query, error} = await UserQuery.getNotDeletedWithRoles();

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

    static deleteUser = async (req, res) => {
        const {message, executed, query, error} = await UserQuery.deleteUser(req.params.id);

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

module.exports = UserController