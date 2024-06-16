
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

    static getAllPreferences = async (req, res) => {
        try {
            const {message, query, executed} = await PreferenceQuery.getAllPreferences(req.body);

            return res.status(200).json(
                new StdResponse(message,{executed, query})
            )
        } catch (e) {
            return res.status(500).json(
                new StdResponse('Ha ocurrido un problema al insertar el like.',{executed: false, error: e.toString()})
            )
        }
    };

    static createUserPreferences = async (req, res) => {
        try {
            const userHasPreferences = await PreferenceQuery.userHasPreferences(req.payload.userId)

            if (userHasPreferences.query) return res.status(400).json(
                new StdResponse(userHasPreferences.message,{executed: false})
            )

            const {message, query, executed} = await PreferenceQuery.createUserPreferences(req.body, req.payload.userId);

            return res.status(200).json(
                new StdResponse(message,{executed, query})
            )
        } catch (e) {
            console.log(e)
            return res.status(500).json(
                new StdResponse('Ha ocurrido un problema al insertar el like.',{executed: false, error: e.toString()})
            )
        }
    };

    static getOwnPreferences = async (req, res) => {
        try {
            const {message, query, executed} = await PreferenceQuery.getUserPreferences(req.payload.userId);

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