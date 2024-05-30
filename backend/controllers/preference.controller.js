
const UserQuery = require("../database/query/user.query");
const StdResponse = require("../classes/stdResponse");
const {el} = require("@faker-js/faker");
const FriendshipQuery = require("../database/query/friendship.query");
const PreferenceQuery = require("../database/query/preference.query");

class FriendshipController {
    static getActivatedPreferences = async (req, res) => {
        try {
            const {message, query} = await PreferenceQuery.getActivatedPreferences();

            return res.status(200).json(
                new StdResponse(message,{executed: true, query})
            )
        } catch (e) {
            return res.status(500).json(
                new StdResponse('Ha ocurrido un problema al insertar el like.',{executed: false, error: e.toString()})
            )
        }
    };
}

module.exports = FriendshipController