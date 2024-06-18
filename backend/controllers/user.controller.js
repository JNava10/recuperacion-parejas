
const {hashPassword} = require("../helpers/common.helper");
const UserQuery = require("../database/query/user.query");
const StdResponse = require("../classes/stdResponse");
const PreferenceQuery = require("../database/query/preference.query");
const RecoverController = require("./recover.controller");
const {sendEmail} = require("../helpers/mail.helper");
const {getRecoverCodeMail} = require("../constants/mail.constants");
const {uploadFiles} = require("../helpers/cloudinary.helper");
const {roleNames} = require("../constants/seed.const");
const CustomError = require("../classes/customError");
const {generateToken} = require("../helpers/jwt.helper");
const {compare} = require("bcrypt");
const {tokenTypes} = require("../constants/common.constants");
const RoleQuery = require("../database/query/role.query");
const NotificationQuery = require("../database/query/notification.query");

class UserController {
    static findUser = async (req, res) => {
       try {
           const inputSearch = req.body.input;
           const inputIsOneWord = inputSearch.split(" ").length > 1;

           let results;

           if (inputIsOneWord) results = await UserQuery.findUserLikeFullname(inputSearch);
           else results = await UserQuery.findUserByNickOrName(inputSearch);

           return res.status(200).json(
               new StdResponse(
                   'Se ha iniciado sesión correctamente.',
                   {founded: results.length > 0, results: results.query}
               )
           )
       } catch (e) {
           return res.status(203).json(
               new StdResponse('Ha ocurrido un problema al actualizar al buscar los usuarios.',{executed: false, error: e.message})
           )
       }
    };

    static findById = async (req, res) => {
        try {
            const withRoles = req.query.withRoles;
            const options = {};

            if (withRoles) options.withRoles = true

            const {message, executed, query} = await UserQuery.findById(req.params.id, options);

            return res.status(200).json(
                new StdResponse(message,{executed, query})
            )
        }  catch (e) {
            return res.status(203).json(
                new StdResponse('Ha ocurrido un problema al buscar los usuarios.',{executed: false, error: e.message})
            )
        }
    };

    static getNotDeletedUsers = async (req, res) => {
        try {
            const {message, executed, query} = await UserQuery.getNotDeletedUsers(req.payload.userId);

            if (executed) {
                return res.status(200).json(
                    new StdResponse(message,{executed, query})
                )
            }
        } catch (e) {
            return res.status(203).json(
                new StdResponse('Ha ocurrido un problema al obtener los usuarios.',{executed: false, error: e.message})
            )
        }
    };

    static getNotDeletedUsersWithRoles = async (req, res) => {
        try {
            const {message, executed, query} = await UserQuery.getNotDeletedWithRoles(req.payload.userId);

            if (executed) {
                return res.status(200).json(
                    new StdResponse(message,{executed, query})
                )
            }
        } catch (e) {
            return res.status(203).json(
                new StdResponse('Ha ocurrido un problema al obtener los usuarios.',{executed: false, error: e.message})
            )
        }
    };

    static createUser = async (req, res) => {
        try {
            const user = req.body;

            const emailExists = (await UserQuery.checkIfEmailExists(user.email)).query; // TODO: Pasar a validator

            if (emailExists) return res.status(200).json(
                new StdResponse("El correo indicado ya existe",{executed: false})
            )

            const nicknameExists = (await UserQuery.checkIfNicknameExists(user.nickname)).query; // TODO: Pasar al validator

            if (nicknameExists) return res.status(200).json(
                new StdResponse(nicknameExists.message,{executed: false})
            )

            const {message, executed, query} = await UserQuery.createUser(user);

            return res.status(200).json(
                new StdResponse(message,{executed, query})
            )
        }  catch (e) {
            return res.status(203).json(
                new StdResponse('Ha ocurrido un problema al crear el usuario.',{executed: false, error: e.message})
            )
        }

    };

    static updateUserData = async (req, res) => {
        try {
            const newUserData = req.body;

            const emailExists = await UserQuery.checkIfNewEmailIsValid(req.body.email, req.params.id);
            const nicknameExists = await UserQuery.checkIfNewNicknameIsValid(req.body.nickname, req.params.id)
            const errors = []

            if (emailExists.query) {
                errors.push(emailExists.message)
            }

            if (nicknameExists.query) {
                errors.push(nicknameExists.message)
            }

            if (errors.length > 0)  return res.status(400).json(
                new StdResponse("Algunos campos introducidos ya existen",{executed: false, errors})
            )

            const {message, executed, query} = await UserQuery.updateUserData(newUserData, req.params.id);

            return res.status(200).json(
                new StdResponse(message,{executed, query})
            )
        } catch (e) {
            return res.status(203).json(
                new StdResponse('Ha ocurrido un problema al actualizar el usuario.',{executed: false, error: e.message})
            )
        }
    };

    static updateUserPassword = async (req, res) => {
        try {
            const password = await hashPassword(req.body.password);

            const userExists = (await UserQuery.checkIfIdExists(req.params.id)).query // TODO: Validator

            if (userExists.query) return res.status(200).json(
                new StdResponse(userExists.message, {
                    executed: false
                })
            );

            const {message, executed, query} = await UserQuery.updateUserPassword(password, req.params.id);

            return res.status(200).json(
                new StdResponse(message,{executed, query})
            )
        } catch (e) {
            return res.status(203).json(
                new StdResponse(e.message,{executed: false})
            )
        }
    };

    static registerUser = async (req, res) => {
        try {
            const emailExists = (await UserQuery.checkIfEmailExists(req.body.email)).query; // TODO: Validator
            const nicknameExists = (await UserQuery.checkIfNicknameExists(req.body.nickname)).query; // TODO: Validator

            if (emailExists && nicknameExists) return res.status(200).json(
                new StdResponse("El email y nombre de usuario introducidos ya existen",{executed: false})
            )
            else if (emailExists) return res.status(200).json(
                new StdResponse("El email ya existe",{executed: false})
            )
            else if (nicknameExists) return res.status(200).json(
                new StdResponse("El nombre de usuario ya existe",{executed: false})
            )

            const {message, query, executed} = await UserQuery.registerUser(req.body);

            return res.status(200).json(
                new StdResponse(message,{executed, query})
            )
        } catch (e) {
            return res.status(203).json(
                new StdResponse('Ha ocurrido un problema al insertar el like.',{executed: false, error: e.toString()})
            )
        }
    };

    static sendRecoverEmail = async (req, res) => {
        try {
            const {email} = req.body

            const {recoverCode, expiresAt} = RecoverController.set(email);

            sendEmail(
                email,
                'hola',
                'que tal',
                getRecoverCodeMail(recoverCode, expiresAt)
            );

            return res.status(200).json(
                new StdResponse('Se ha enviado el correo correctamente',{executed: true})
            )
        }  catch (e) {
            return res.status(203).json(
                new StdResponse('Ha ocurrido un problema al enviar el email de recuperación.',{executed: false, error: e.message})
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
            return res.status(203).json(
                new StdResponse('Ha ocurrido un problema al comprobar el codigo de recuperación.',{executed: false, error: e.message})
            )
        }
    };

    static changePasswordRecovering = async (req, res) => {
        try {
            const {password} = req.body
            const {recovertoken} = req.headers

            const validatingData = await RecoverController.validateToken(recovertoken);

            if (!validatingData.email) return res.status(200).json(
                new StdResponse(validatingData.message,{executed: false})
            )

            const {message, executed} = await UserQuery.updateUserPasswordByEmail(password, validatingData.email);

            return res.status(200).json(
                new StdResponse(message,{executed})
            )
        } catch (e) {
            return res.status(203).json(
                new StdResponse('Ha ocurrido un problema al cambiar la contraseña.',{executed: false, error: e.message})
            )
        }
    };

    static enableOrDisableUser = async (req, res) => {
        try {
            const {userId} = req.params;
            const {enabled} = req.body;

            const userExists = (await UserQuery.checkIfIdExists(userId)).query // TODO: Validator

            if (userExists.query) return res.status(200).json(
                new StdResponse(userExists.message, {
                    executed: false
                })
            );

            const {query, message, executed} = await UserQuery.enableOrDisableUser(userId, enabled);

            return res.status(200).json(
                new StdResponse(message,{executed, query})
            )
        } catch (e) {
            return res.status(203).json(
                new StdResponse('Ha ocurrido un problema al actualizar el estado del usuario.',{executed: false, error: e.message})
            )
        }
    };

    static deleteUser = async (req, res) => {
        try {
            let userId = req.params.userId;
            const isAdmin = await UserQuery.userHasRole(userId, roleNames.admin.name);
            const adminUsersRemaining = await UserQuery.getRoleUsersRemaining(roleNames.admin.name);

            if (isAdmin.query && adminUsersRemaining.query === 1) return res.status(200).json(
                new StdResponse("Solo existe un unico administrador en el sistema, por lo que no es posible borrar mas.",{executed: false})
            )

            if (userId === req.payload.userId) return res.status(200).json(
                new StdResponse("No puedes borrarte a tí mismo.",{executed: false})
            )

            const {message, executed, query} = await UserQuery.deleteUser(userId);

            return res.status(200).json(
                new StdResponse(message,{executed, query})
            )
        } catch (e) {
            return res.status(203).json(
                new StdResponse('Ha ocurrido un problema al borrar el usuario.',{executed: false, error: e.message})
            )
        }
    };

    static editProfileData = async (req, res) => {
        try {
            const emailExists = await UserQuery.checkIfNewEmailIsValid(req.body.email, req.payload.userId);
            const nicknameExists = await UserQuery.checkIfNewNicknameIsValid(req.body.nickname, req.payload.userId)
            const errors = []

            if (emailExists.query) {
                errors.push(emailExists.message)
            }

            if (nicknameExists.query) {
                errors.push(nicknameExists.message)
            }

            if (errors.length > 0)  return res.status(400).json(
                new StdResponse("Algunos campos introducidos ya existen",{executed: false, errors})
            )

            const {message, executed, query} = await UserQuery.editProfileData(req.payload.userId, req.body);

            return res.status(200).json(
                new StdResponse(message,{executed, query})
            )
        } catch (e) {
            return res.status(203).json(
                new StdResponse('Ha ocurrido un problema al actualizar el perfil del usuario.',{executed: false, error: e.message})
            )
        }
    };

    static getEditableProfileData = async (req, res) => {
        try {
            const {userId} = req.payload;

            const userData = (await UserQuery.getUsersById([userId])).query[0];
            const userPreferences = (await PreferenceQuery.getUserPreferences(userId)).query;

            return res.status(200).json(
                new StdResponse(
                    "Se han obtenido los datos editables correctamente",
                    {
                        executed: true,
                        query: {
                            user: userData,
                            preferences: userPreferences
                        }
                    })
            );
        } catch (e) {
            return res.status(203).json(
                new StdResponse('Ha ocurrido un problema al actualizar el perfil del usuario.',{executed: false, error: e.message})
            )
        }
    };

    static updateUserAvatar = async (req, res) => {
        try {
            const key = 'avatar'
            const {userId} = req.params;

            const userExists = (await UserQuery.checkIfIdExists(userId)).query // TODO: Validator

            if (userExists.query) return res.status(200).json(
                new StdResponse(userExists.message, {
                    executed: false
                })
            );

            if (!req.files || !req.files[key]) return res.status(400).json( // TODO: Middleware
                new StdResponse(
                    "No se ha subido ningun archivo.",
                    {
                        executed: false,
                    })
            );

            const uploadedNames = await uploadFiles(req.files, {dir: '/avatar', fileExtension: ['jpg', 'png', 'jpeg']});

            const avatarUrl = uploadedNames.get(key).secure_url;

            const {message, query, executed} = await UserQuery.editProfileAvatar(userId, avatarUrl)

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
                new StdResponse('Ha ocurrido un problema al actualizar el avatar del usuario.',{executed: false, error: e.message})
            )
        }
    };

    static getRoleUsersRemaining = async (req, res) => {
        try {
            const roleName = req.params.role;

            const roleExists = (await RoleQuery.roleNameExists(roleName)).query; // TODO: Validator

            if (!roleExists) return res.status(404).json(
                new StdResponse("El rol buscado no existe", {
                    executed: false,
                })
            );

            const remaining = (await UserQuery.getRoleUsersRemaining(roleName)).query

            return res.status(200).json(
                new StdResponse("Se ha obtenido la cantidad de usuarios correctamente.", {
                    executed: true,
                    count: remaining
                })
            );
        } catch (e) {
            return res.status(203).json(
                new StdResponse('Ha ocurrido un problema al obtener los usuarios.',{executed: false, error: e.message})
            )
        }
    };

    static getSelfNotifications = async (req, res) => {
        try {
            const userId = req.payload.userId;

            const notifications = await NotificationQuery.getUserNotifications(userId);

            return res.status(200).json(
                new StdResponse(notifications.message, {
                    executed: notifications.executed,
                    query: notifications.query
                })
            );
        } catch (e) {
            return res.status(203).json(
                new StdResponse('Ha ocurrido un problema al obtener las notificaciones.',{executed: false, error: e.message})
            )
        }
    };

    static readUserNotifications = async (req, res) => {
        try {
            const userId = req.payload.userId;

            const notifications = await NotificationQuery.readUserNotifications(userId);

            return res.status(200).json(
                new StdResponse(notifications.message, {
                    executed: notifications.executed,
                    query: notifications.query
                })
            );
        } catch (e) {
            return res.status(203).json(
                new StdResponse('Ha ocurrido un problema al leer las notificaciones del usuario.',{executed: false, error: e.message})
            )
        }
    };

    static updateUserPreferences = async (req, res) => {
        try {
            const userId = req.params.userId || req.payload.userId;

            if (req.params.id) {
                const userExists = (await UserQuery.checkIfIdExists(req.params.id)).query // TODO: Validator

                if (userExists.query) return res.status(200).json(
                    new StdResponse(userExists.message, {
                        executed: false
                    })
                );
            }

            const {message, executed} = await UserQuery.setUserPreferences(userId, req.body.preferences);

            return res.status(200).json(
                new StdResponse(message, {
                    executed,
                })
            );
        } catch (e) {
            return res.status(203).json(
                new StdResponse("Ha ocurrido un problema al actualizar las preferencias",{executed: false, error: e.message})
            )
        }
    };

    static login = async (req, res) => {
        try {
            const email = req.body.email;
            const password = req.body.password;

            const user = (await UserQuery.findUserByEmail(email)).query;

            if (!user) {
                return res.status(203).json(
                    new StdResponse(
                        'Credenciales invalidas. Vuelve a intentarlo.',
                        {logged: false}
                    )
                )
            }
            const passwordsMatch = await compare(password, user.password);

            if (!passwordsMatch) {
                return res.status(203).json(
                    new StdResponse(
                        'Credenciales invalidas. Vuelve a intentarlo.',
                        {logged: false}
                    )
                )
            }

            const apiToken = generateToken({userId: user.id, userEmail: email, type: tokenTypes.api});
            const socketToken = generateToken({userId: user.id, type: tokenTypes.socket});

            const isFirstUserLogin = await UserQuery.isFirstUserLogin(user.id);

            await UserQuery.updateUserLogin(user.id)

            console.info(`Se ha logueado un usuario ${user.email} correctamente.`)

            return res.status(200).json(
                new StdResponse(
                    'Se ha iniciado sesión correctamente.',
                    {logged: true, token: apiToken, socketToken, firstLogin: isFirstUserLogin}
                )
            )
        } catch (e) {
            console.error(e)
            return res.status(203).json(
                new StdResponse('Ha ocurrido un problema al iniciar sesión.',{logged: false, error: e.message})
            )
        }
    };
}

module.exports = UserController