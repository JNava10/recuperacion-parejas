
const UserQuery = require("../database/query/user.query");
const StdResponse = require("../classes/stdResponse");
const {el} = require("@faker-js/faker");
const FriendshipQuery = require("../database/query/friendship.query");
const PreferenceQuery = require("../database/query/preference.query");

class PreferenceController {
    static getActivatedPreferences = async (req, res) => {
        try {
            const {message, query} = await PreferenceQuery.getActivatedPreferences();

            console.log(query)

            return res.status(200).json(
                new StdResponse(message,{executed: true, query})
            )
        } catch (e) {
            return res.status(500).json(
                new StdResponse('Ha ocurrido un problema al insertar el like.',{executed: false, error: e.toString()})
            )
        }
    };

    static createChoicePreference = async (req, res) => {
        try {
            const {message, query, executed} = await PreferenceQuery.createChoicePreference(req.body);

            return res.status(200).json(
                new StdResponse(message,{executed, query})
            )
        } catch (e) {
            return res.status(500).json(
                new StdResponse('Ha ocurrido un problema al insertar el like.',{executed: false, error: e.toString()})
            )
        }
    };

    static createRangePreference = async (req, res) => {
        try {
            const {message, query, executed} = await PreferenceQuery.createRangePreference(req.body);

            return res.status(200).json(
                new StdResponse(message,{executed, query})
            )
        } catch (e) {
            return res.status(500).json(
                new StdResponse('Ha ocurrido un problema al insertar el like.',{executed: false, error: e.toString()})
            )
        }
    };
}

module.exports = PreferenceController