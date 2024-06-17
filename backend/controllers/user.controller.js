
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

    // TODO: Mover a chat.controller.js
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

    // TODO: Mover a chat.controller.js
    static uploadMessageImages = async (req, res) => {
      try {
          const filesUploaded = await uploadFiles(req.files, {fileExtension: ['jpg', 'png', 'jpeg'], dir: 'chat_images', numberLimit: 4});
          const filesToSend = []

          filesUploaded.forEach((file) => {
              filesToSend.push(file.secure_url)
          });

          return res.status(200).json(
              new StdResponse("Se han subido los archivos correctamente", {
                  executed: true,
                  files: filesToSend
              })
          );
      } catch (e) {
          console.log(e)

          return res.status(500).json(
              new StdResponse(e.message,{executed: false})
          )
      }
    }

    static pushMessage = async (req, res) => {
        // TODO: Añadir try-catch
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

    static getRoleUsers = async (req, res) => {
        try {
            // TODO: Comprobar que el rol indicado existe
            const {message, executed, query} = await UserQuery.getRoleUsers(req.params.role);

            return res.status(200).json(
                new StdResponse(message,{executed, query})
            );
        } catch (e) {
            console.log(e);

            return res.status(500).json(
                new StdResponse(e.message,{executed: false})
            );
        }
    };

    static getNotDeletedUsers = async (req, res) => {
        // TODO: Añadir try-catch
        const {message, executed, query, error} = await UserQuery.getNotDeletedUsers(req.payload.userId);

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
        // TODO: Añadir try-catch
        const {message, executed, query, error} = await UserQuery.getNotDeletedWithRoles(req.payload.userId);

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

            if (executed) {
                return res.status(200).json(
                    new StdResponse(message,{executed, query})
                )
            }
        } catch (e) {
            console.log(e)

            return res.status(500).json(
                new StdResponse(e.message,{executed: false})
            )
        }

    };

    static updateUserData = async (req, res) => {
        // TODO: Añadir try-catch
        const newUserData = req.body;

        const nicknameExists = await UserQuery.checkIfEmailExists(newUserData.nickname).query; // TODO: Pasar a validator

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
        // TODO: Comprobar que el rol está ya insertado
        // TODO: Añadir try-catch
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
        try {
            const adminsRemaining = (await UserQuery.getRoleUsersRemaining('admin')).query; // TODO: Validator

            if (adminsRemaining >= 1)  return res.status(200).json(
                new StdResponse('No se pueden borrar mas administradores.',{executed: false})
            )

            const {message, executed, query, error} = await UserQuery.deleteUserRoles(req.body.roles, req.params.id);
        }  catch (e) {
            console.log(e)

            return res.status(500).json(
                new StdResponse(e.message,{executed: false})
            )
        }
    };

    static updateUserPassword = async (req, res) => {
        const password = hashPassword(req.body.password);

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
            return res.status(500).json(
                new StdResponse('Ha ocurrido un problema al insertar el like.',{executed: false, error: e.toString()})
            )
        }
    };

    static sendRecoverEmail = async (req, res) => {
        try {
            const {email} = req.body

            const emailExists = await UserQuery.checkIfEmailExists(email); // TODO: Validator

            if (!emailExists.query)  return res.status(200).json(
                new StdResponse(emailExists.message,{executed: emailExists.executed, query: emailExists.query})
            )

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

            const validatingData = await RecoverController.validateToken(recovertoken);

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
            console.log(alreadyLikedIds)

            matchableUserIds = matchableUserIds.filter(user => !alreadyLikedIds.includes(user))

            const {message, query} = await UserQuery.getUsersById(matchableUserIds)

            return res.status(200).json(
                new StdResponse(message,{executed: query !== null, query})
            )
        } catch (e) {
            console.log(e)

            return res.status(500).json(
                new StdResponse(e.message,{executed: false})
            )
        }
    };

    // TODO: Comprobar que el usuario existe y si está o no habilitado
    static enableOrDisableUser = async (req, res) => {
        try {
            const {userId} = req.params;
            const {enabled} = req.body;

            const {query, message, executed} = await UserQuery.enableOrDisableUser(userId, enabled);

            return res.status(200).json(
                new StdResponse(message,{executed, query})
            )
        } catch (e) {
            console.log(e)

            return res.status(500).json(
                new StdResponse(e.message,{executed: false})
            )
        }
    };

    // TODO: Añadir try-catch
    static deleteUser = async (req, res) => {
        const isAdmin = await UserQuery.userHasRole(req.params.id, roleNames.admin.name);
        const adminUsersRemaining = await UserQuery.getRoleUsersRemaining(roleNames.admin.name);

        if (isAdmin.query && adminUsersRemaining.query === 1) return res.status(200).json(
            new StdResponse("Solo existe un unico administrador en el sistema, por lo que no es posible borrar mas.",{executed: false})
        )

        if (req.params.id === req.payload.userId) return res.status(200).json(
            new StdResponse("No puedes borrarte a tí mismo.",{executed: false})
        )

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
            console.log(error);
            return res.status(500).json(
                new StdResponse(message,{executed, error})
            )
        }
    };

    // TODO: Pulir try-catch
    static editProfileData = async (req, res) => {
        try {
            const {message, executed, query, error} = await UserQuery.editProfileData(req.payload.userId, req.body);

            if (executed) {
                return res.status(200).json(
                    new StdResponse(message,{executed, query})
                )
            } else if (!executed && query) {
                return res.status(200).json(
                    new StdResponse(message,{executed, query})
                )
            } else if (!query) {
                console.log(error);
                return res.status(500).json(
                    new StdResponse(message,{executed, error})
                )
            }
        } catch (e) {
            console.log(e)

            return res.status(500).json(
                new StdResponse(e.message,{executed: false})
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
            console.log(e)

            return res.status(500).json(
                new StdResponse(e.message,{executed: false})
            )
        }
    };

    static updateUserAvatar = async (req, res) => {
        try {
            const key = 'avatar'

            if (!req.files || !req.files[key]) return res.status(400).json(
                new StdResponse(
                    "No se ha subido ningun archivo.",
                    {
                        executed: false,
                    })
            );

            const uploadedNames = await uploadFiles(req.files, {dir: '/avatar', fileExtension: ['jpg', 'png', 'jpeg']});

            const avatarUrl = uploadedNames.get(key).secure_url;

            const {id} = req.params;

            // TODO: Comprobar que el usuario existe

            const {message, query, executed} = await UserQuery.editProfileAvatar(id, avatarUrl)

            return res.status(200).json(
                new StdResponse(message, {
                    executed,
                    query
                })
            );
        } catch (e) {
            console.log(e)

            if (e instanceof CustomError) {
                console.log('a')
                return res.status(400).json(
                    new StdResponse(e.message,{executed: false})
                )
            }

            return res.status(500).json(
                new StdResponse(e.message,{executed: false})
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
            console.log(e)

            return res.status(500).json(
                new StdResponse(e.message,{executed: false})
            )
        }
    };

    static getRoleUsersRemaining = async (req, res) => {
        try {
            const roleName = req.params.role;

            const roleExists = (await UserQuery.findRoleByName(roleName)).query;

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
            console.log(e)

            return res.status(500).json(
                new StdResponse(e.message,{executed: false})
            )
        }
    };

    // TODO: Mover a NotificationController
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
            console.log(e)

            return res.status(500).json(
                new StdResponse(e.message,{executed: false})
            )
        }
    };

    // TODO: Mover a NotificationController
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
            console.log(e)

            return res.status(500).json(
                new StdResponse(e.message,{executed: false})
            )
        }
    };

    // TODO: Mover a RoleController
    static getSelfRoles = async (req, res) => {
        try {
            const userId = req.payload.userId;

            const {query, message, executed} = await UserQuery.getUserRolesWithItems(userId);

            return res.status(200).json(
                new StdResponse(message, {
                    executed,
                    query
                })
            );
        } catch (e) {
            console.log(e)

            return res.status(500).json(
                new StdResponse(e.message,{executed: false})
            )
        }
    };

    static updateUserPreferences = async (req, res) => {
        try {
            const userId = req.params.userId ?? req.payload.userId;

            const {message, executed} = await UserQuery.setUserPreferences(userId, req.body.preferences);

            return res.status(200).json(
                new StdResponse(message, {
                    executed,
                })
            );
        } catch (e) {
            console.log(e)

            return res.status(500).json(
                new StdResponse(e.message,{executed: false})
            )
        }
    };
}

module.exports = UserController