
const {sendStandardResponse} = require("../helpers/common.helper");
const UserQuery = require("../database/query/user.query");
const bcrypt = require("bcrypt");
const {generateToken} = require("../helpers/jwt.helper");
const StdResponse = require("../classes/stdResponse");
const QuerySuccess = require("../classes/QuerySuccess");
const {findRecentChatMessages} = require("../database/query/message.query");
const EventQuery = require("../database/query/event.query");
const {el} = require("@faker-js/faker");
const UserController = require("./user.controller");
const FriendshipQuery = require("../database/query/friendship.query");

class FriendshipController {
    static findLikableUsers = async (req, res) => {
        // TODO: Seleccionar usuarios más afínes

        // let results = await FriendshipController.getAffineUsers();
        let {message, executed, query, error} = await UserQuery.getNotDeletedUsers();

        return res.status(200).json(
            new StdResponse(
                message,
                query
            )
        )
    };

    static likeUser = async (req, res) => {
        try {
            const alreadyLiked = await FriendshipQuery.checkIfIsLiked(req.payload.userId, req.params.id);

            if (alreadyLiked.query) {
                await FriendshipQuery.likeUser(req.payload.userId, req.params.id);
                await FriendshipQuery.setMatch(req.payload.userId, req.params.id)

                return res.status(200).json(
                    new StdResponse(alreadyLiked.message,{executed: false, isMatch: true})
                )
            }

            const {message, executed, query} = await FriendshipQuery.likeUser(req.payload.userId, req.params.id);

            if (executed) {
                return res.status(200).json(
                    new StdResponse(message,{executed})
                )
            } else if (!executed && query) {
                return res.status(200).json(
                    new StdResponse(message,{executed, query})
                )
            }
        } catch (e) {
            return res.status(500).json(
                new StdResponse('Ha ocurrido un problema al insertar el like.',{executed: false, error: e.toString()})
            )
        }
    };

    static getOwnMatches = async (req, res) => {
        try {
            const userId = req.payload.userId;

            let {message, query} = await FriendshipQuery.getMatchedUsers(userId);

            const friends = [];

            query.forEach(model => {
                if (model.userMatch.id === userId) friends.push(model.userMatched)
                else if (model.userMatched.id === userId) friends.push(model.userMatch)
            });

            return res.status(200).json(
                new StdResponse(
                    message,
                    {query: friends}
                )
            )
        } catch (e) {
            return res.status(500).json(
                new StdResponse('Ha ocurrido un problema al obtener los usuarios.',{executed: false, error: e.toString()})
            )
        }
    };
}

module.exports = FriendshipController