
const StdResponse = require("../classes/stdResponse");
const PreferenceQuery = require("../database/query/preference.query");

class PreferenceController {
    static getNotDeletedPreferences = async (req, res) => {
        try {
            const {message, query} = await PreferenceQuery.getNotDeletedPreferences();

            return res.status(200).json(
                new StdResponse(message,{executed: true, query})
            )
        } catch (e) {
            return res.status(203).json(
                new StdResponse('Ha ocurrido un problema al obtener las preferencias activadas',{executed: false, error: e.message})
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
            return res.status(203).json(
                new StdResponse('Ha ocurrido un problema al crear la preferencia de elección.',{executed: false, error: e.message})
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
            return res.status(203).json(
                new StdResponse('Ha ocurrido un problema al crear la preferencia de rango.',{executed: false, error: e.message})
            )
        }
    };

    static getAllPreferences = async (req, res) => {
        try {
            const {message, query, executed} = await PreferenceQuery.getAllPreferences();

            return res.status(200).json(
                new StdResponse(message,{executed, query})
            )
        } catch (e) {
            return res.status(203).json(
                new StdResponse('Ha ocurrido un problema al obtener las preferencias.',{executed: false, error: e.message})
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
            return res.status(203).json(
                new StdResponse('Ha ocurrido un problema al crear la preferencias del usuario.',{executed: false, error: e.message})
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
            return res.status(203).json(
                new StdResponse('Ha ocurrido un problema al obtener las preferencias.',{executed: false, error: e.message})
            )
        }
    };

    static deletePreference = async (req, res) => {
        try {
            const {message, executed, query} = await PreferenceQuery.deletePreference(req.params.id);

            return res.status(200).json(
                new StdResponse(message,{executed, query})
            )
        } catch (e) {
            return res.status(203).json(
                new StdResponse('Ha ocurrido un problema al borrar la preferencia.',{executed: false, error: e.message})
            )
        }
    };
}

module.exports = PreferenceController