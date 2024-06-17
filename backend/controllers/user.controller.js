
const {hashPassword} = require("../helpers/common.helper");
const UserQuery = require("../database/query/user.query");
const StdResponse = require("../classes/stdResponse");
const QuerySuccess = require("../classes/QuerySuccess");
const {findRecentChatMessages} = require("../database/query/message.query");
const PreferenceQuery = require("../database/query/preference.query");
const RecoverController = require("./recover.controller");
const {sendEmail} = require("../helpers/mail.helper");
const {getRecoverCodeMail} = require("../constants/mail.constants");
const {uploadFiles} = require("../helpers/cloudinary.helper");
const {roleNames} = require("../constants/seed.const");
const CustomError = require("../classes/customError");
const models = require("../database/models");
const RoleQuery = require("../database/query/role.query");

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
                   {founded: results.length > 0, results}
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

            const emailExists = await UserQuery.checkIfEmailExists(newUserData.email).query; // TODO: Pasar a validator

            if (emailExists) return res.status(409).json(
                new StdResponse("El correo del usuario indicado ya existe",{executed: false})
            )

            const nicknameExists = await UserQuery.checkIfEmailExists(newUserData.nickname).query; // TODO: Pasar a validator

            if (nicknameExists) return res.status(409).json(
                new StdResponse("El nick del usuario indicado ya existe",{executed: false})
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

    static deleteUserRoles = async (req, res) => {
        try {
            const adminsRemaining = (await UserQuery.getRoleUsersRemaining('admin')).query; // TODO: Validator

            if (adminsRemaining >= 1) return res.status(200).json(
                new StdResponse('No se pueden borrar mas administradores.',{executed: false})
            )

            const {message, executed, query} = await UserQuery.deleteUserRoles(req.body.roles, req.params.id);

            return res.status(200).json(
                new StdResponse(message,{executed, query})
            )
        } catch (e) {
            return res.status(203).json(
                new StdResponse(e.message,{executed: false})
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

    static getPossibleMatches = async (req, res) => {
        try {
            const userId = req.payload.userId;

            // 1. Obtener preferencias del usuario
            const userPreferences = await UserQuery.getUserPreferences(userId);

            if (!userPreferences.executed) return res.status(400).json(
                new StdResponse(userPreferences.error,{executed: false})
            )

            // 2. Obtener usuarios con algunos de mismos valores de preferencias de eleccion que el usuario
            let choiceAffineUsers = await UserQuery.getUsersByChoicePrefs(userPreferences.query.choices, userId);

            choiceAffineUsers = choiceAffineUsers.query.map(item => item.user);
            choiceAffineUsers = [...new Set(choiceAffineUsers)] // Haciendo un Set a partir de los valores, podemos quitar elementos repetidos.

            // 3. Obtener valores de las preferencias de valor de los usuarios obtenidos en el paso anterior

            let rangeAffineUsers = (await UserQuery.getValuesOfUserRangePrefs(choiceAffineUsers)).query;

            // 4. Obtener las preferencias cuyos valores se acerquen los valores minimo y maximo de preferencias de rango del usuario.

            // Al utilizar reduce, podemos iterar sobre el array y descartar los valores que no sean el que queremos de forma sencilla.
            const userMaxPreferenceValue = userPreferences.query.values.reduce((previous, current) =>
                previous && previous.value > current.value ? previous : current
            ).value;

            const userMinPreferenceValue = userPreferences.query.values.reduce((previous, current) =>
                previous && previous.value < current.value ? previous : current
            ).value;

            // Estas serán las preferencias que se tendrán en cuenta a la hora de buscar usuarios (los usuarios dentro de rangeAffineUsers).
            // Se tendrán en cuenta las preferencias que estén en un rango de afinidad del 30% con el usuario.
            const userMaxPreferences = userPreferences.query.values.filter(item => item.value > userMaxPreferenceValue * 0.85);
            const userMinPreferences = userPreferences.query.values.filter(item => item.value < userMinPreferenceValue * 1.15);

            // 5. Obtener los IDs de los usuarios cuyos valores de preferencia se acerquen a las de userMaxPreferences y userMinPreferences.

            let matchableUserIds = [];
            // Borramos las preferencias repetidas, introduciendolas en un map.
            const preferencesForFind = new Map([...userMaxPreferences, ...userMinPreferences].map(item => [item.preference, item.value]));

            // Filtramos según los usuarios tengan los mismos valores de preferencias, con un rango del 35%
            preferencesForFind.forEach((value, preference) => {
                rangeAffineUsers.forEach(user => {
                    const matchedPreference = user.preferences.find(prefItem => prefItem.preference === preference && (prefItem.value > value * 0.65 && prefItem.value < value * 1.35))

                    if (matchedPreference) matchableUserIds.push(user.user)
                });
            });

            // Si no hay resultados, filtramos con un rango del 65%

            if (matchableUserIds.length === 0) {
                preferencesForFind.forEach((value, preference) => {
                    rangeAffineUsers.forEach(user => {
                        const matchedPreference = user.preferences.find(prefItem => prefItem.preference === preference && (prefItem.value > value * 0.45 && prefItem.value < value * 1.65))

                        if (matchedPreference) matchableUserIds.push(user.user)
                    });
                });
            }

            // Filtramos para quitar a los que ya se han dado like
            const alreadyLikedUsers = await models.Friendship.findAll({
                where: {requesting_user: userId},
                attributes: ['requested_user']
            })

            const alreadyLikedIds = alreadyLikedUsers.map(user => user.requested_user)

            matchableUserIds = matchableUserIds.filter(user => !alreadyLikedIds.includes(user))

            const {message, query} = await UserQuery.getUsersById(matchableUserIds)

            return res.status(200).json(
                new StdResponse(message,{executed: query !== null, query})
            )
        } catch (e) {
            return res.status(203).json(
                new StdResponse('Ha ocurrido un problema al obtener los matches',{executed: false, error: e.message})
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
            const isAdmin = await UserQuery.userHasRole(req.params.id, roleNames.admin.name); // TODO: Validator
            const adminUsersRemaining = await UserQuery.getRoleUsersRemaining(roleNames.admin.name);

            if (isAdmin.query && adminUsersRemaining.query === 1) return res.status(200).json(
                new StdResponse("Solo existe un unico administrador en el sistema, por lo que no es posible borrar mas.",{executed: false})
            )

            if (req.params.id === req.payload.userId) return res.status(200).json(
                new StdResponse("No puedes borrarte a tí mismo.",{executed: false})
            )

            const {message, executed, query} = await UserQuery.deleteUser(req.params.id);

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
            const {id} = req.params;

            const userExists = (await UserQuery.checkIfIdExists(id)).query // TODO: Validator

            if (userExists.query) return res.status(200).json(
                new StdResponse(userExists.message, {
                    executed: false
                })
            );

            if (!req.files || !req.files[key]) return res.status(400).json(
                new StdResponse(
                    "No se ha subido ningun archivo.",
                    {
                        executed: false,
                    })
            );

            const uploadedNames = await uploadFiles(req.files, {dir: '/avatar', fileExtension: ['jpg', 'png', 'jpeg']});

            const avatarUrl = uploadedNames.get(key).secure_url;

            const {message, query, executed} = await UserQuery.editProfileAvatar(id, avatarUrl)

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

    static getChats = async (req, res) => {
        try {
            const {userId} = req.payload;

            const pending = (await UserQuery.getPendingChats(userId)).query
            const notPending = (await UserQuery.getNotPendingChats(userId)).query

            return res.status(200).json(
                new StdResponse("Se han obtenido la lista de chats correctamente", {
                    executed: true,
                    chats: {pending, notPending}
                })
            );
        } catch (e) {
            return res.status(203).json(
                new StdResponse('Ha ocurrido un problema al obtener los chats.',{executed: false, error: e.message})
            )
        }
    };

    static getRoleUsersRemaining = async (req, res) => {
        try {
            const roleName = req.params.role;

            const roleExists = (await UserQuery.roleExists(roleName)).query; // TODO: Validator

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

            const notifications = await UserQuery.getUserNotifications(userId);

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

            const notifications = await UserQuery.readUserNotifications(userId);

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
            const userId = req.params.id || req.payload.userId;

            if (req.params.id) {
                const userExists = (await UserQuery.checkIfIdExists(id)).query // TODO: Validator

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
}

module.exports = UserController