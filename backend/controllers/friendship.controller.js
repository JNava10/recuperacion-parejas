
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

class FriendshipController {
    static findLikableUsers = async (req, res) => {
        // TODO: Seleccionar usuarios más afínes

        // let results = await FriendshipController.getAffineUsers();
        let users = await UserController.getNotDeletedUsers();

        return res.status(200).json(
            new StdResponse(
                'Se ha iniciado sesión correctamente.',
                users
            )
        )
    };

    static likeUser = async (req, res) => {
        let users = await FriendshipQuery.likeUser();

        return res.status(200).json(
            new StdResponse(
                'Se ha iniciado sesión correctamente.',
                users
            )
        )
    };
}

module.exports = FriendshipController