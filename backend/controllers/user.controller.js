
const {sendStandardResponse} = require("../helpers/common.helper");
const UserQuery = require("../database/query/user.query");
const bcrypt = require("bcrypt");
const {generateToken} = require("../helpers/jwt.helper");
const StdResponse = require("../classes/stdResponse");
const QuerySuccess = require("../classes/QuerySuccess");
const {findRecentChatMessages} = require("../database/query/message.query");
const EventQuery = require("../database/query/event.query");
const {el} = require("@faker-js/faker");
const PreferenceQuery = require("../database/query/preference.query");
const RecoverController = require("./recover.controller");
const {sendEmail} = require("../helpers/mail.helper");
const {getRecoverCodeMail} = require("../constants/mail.constants");
const jwt = require("jsonwebtoken");

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
        const withRoles = req.query.withRoles;
        let options = {};

        if (withRoles) options.withRoles = true

        const {message, executed, query, error} = await UserQuery.findById(req.params.id, options);

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

    static createUser = async (req, res) => {
        const user = req.body;

        const emailExists = await UserQuery.checkIfEmailExists(user.email).query; // TODO: Pasar al middleware

        if (emailExists) return res.status(409).json(
            new StdResponse("El correo indicado ya existe",{executed: false})
        )

        const nicknameExists = await UserQuery.checkIfEmailExists(user.nickname).query; // TODO: Pasar al middleware

        if (nicknameExists) return res.status(409).json(
            new StdResponse("El nick del usuario indicado ya existe",{executed: false})
        )

        const {message, executed, query, error} = await UserQuery.createUser(user);

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

    static updateUserData = async (req, res) => {
        const newUserData = req.body;

        const nicknameExists = await UserQuery.checkIfEmailExists(newUserData.nickname).query; // TODO: Pasar al middleware

        if (nicknameExists) return res.status(409).json(
            new StdResponse("El nick del usuario indicado ya existe",{executed: false})
        )

        const {message, executed, query, error} = await UserQuery.updateUserData(newUserData, req.params.id);

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

    static addUserRoles = async (req, res) => {
        const {message, executed, query, error} = await UserQuery.insertUserRoles(req.body.roles, req.params.id);

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

    static deleteUserRoles = async (req, res) => {
        const {message, executed, query, error} = await UserQuery.deleteUserRoles(req.body.roles, req.params.id);

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

    static updateUserPassword = async (req, res) => {
        const password = await bcrypt.hash(req.body.password, process.env.PASSWORD_HASH_SALT);

        const {message, executed, query} = await UserQuery.updateUserPassword(password, req.params.id);

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

    static registerUser = async (req, res) => {
        try {
            if (!req.body.picUrl) req.body.picUrl = process.env.DEFAULT_PROFILE_PIC_URL;

            const {message, query, executed} = await UserQuery.registerUser(req.body);

            return res.status(200).json(
                new StdResponse(message,{executed, query})
            )
        } catch (e) {
            return res.status(500).json(
                new StdResponse('Ha ocurrido un problema al insertar el like.',{executed: false, error: e.toString()})
            )
        }
    };

    static sendRecoverEmail = async (req, res) => {
        try {
            const {email} = req.body

            const emailExists = await UserQuery.checkIfEmailExists(email);

            if (!emailExists.query)  return res.status(200).json(
                new StdResponse(emailExists.message,{executed: emailExists.executed, query: emailExists.query})
            )

            const {recoverCode, expiresAt} = RecoverController.set(email);

            console.log(recoverCode)

            sendEmail(
                email,
                'hola',
                'que tal',
                getRecoverCodeMail(recoverCode, expiresAt)
            );

            return res.status(200).json(
                new StdResponse('Se ha enviado el correo correctamente',{executed: true})
            )
        } catch (e) {
            console.log(e)

            return res.status(500).json(
                new StdResponse(e.message,{executed: false})
            )
        }
    };

    static checkRecoverCode = async (req, res) => {
        try {
            const {code, email} = req.body

            const {isValid, message, token} = RecoverController.validateCode(email, code.toString());

            return res.status(200).json(
                new StdResponse(message,{isValid, token})
            )
        } catch (e) {
            console.log(e)

            return res.status(500).json(
                new StdResponse(e.message,{executed: false})
            )
        }
    };

    static changePasswordRecovering = async (req, res) => {
        try {
            const {password} = req.body
            const {recovertoken} = req.headers

            const validatingData = await RecoverController.validateToken(recovertoken); // TODO: Middleware

            if (!validatingData.email) return res.status(200).json(
                new StdResponse(validatingData.message,{executed: false})
            )

            const {message, executed} = await UserQuery.updateUserPasswordByEmail(password, validatingData.email);

            return res.status(200).json(
                new StdResponse(message,{executed})
            )
        } catch (e) {
            console.log(e)

            return res.status(500).json(
                new StdResponse(e.message,{executed: false})
            )
        }
    };

    static getPossibleMatches = async (req, res) => {
        try {
            const userId = req.payload.userId;

            // 1. Obtener preferencias del usuario
            const userPreferences = await UserQuery.getUserPreferences(userId);

            // 2. Obtener usuarios con algunos de mismos valores de preferencias de eleccion que el usuario
            let choiceAffineUsers = await UserQuery.getUsersByChoicePrefs(userPreferences.query.choices);

            choiceAffineUsers = choiceAffineUsers.query.map(item => item.user);
            choiceAffineUsers = [...new Set(choiceAffineUsers)] // Haciendo un Set a partir de los valores, podemos quitar elementos repetidos.

            // 3. Obtener valores de las preferencias de valor de los usuarios obtenidos en el paso anterior

            let valueAffineUsers = await UserQuery.getValuesOfUserRangePrefs(choiceAffineUsers);

            console.log(valueAffineUsers);

            return res.status(200).json(
                new StdResponse('Se han obtenido los usuarios afínes correctamente',{executed: true, query: valueAffineUsers})
            )
        } catch (e) {
            console.log(e)

            return res.status(500).json(
                new StdResponse(e.message,{executed: false})
            )
        }
    };
}

module.exports = UserController