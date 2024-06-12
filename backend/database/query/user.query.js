const models = require('../models/index');
const {findUserByNameOrNick, findUserByFullname} = require("../../constants/sql.const");
const {QueryTypes, Op} = require("sequelize");
const QuerySuccess = require("../../classes/QuerySuccess");
const QueryError = require("../../classes/QueryError");
const RoleQuery = require("./role.query");
const {roleNames, preferenceTypes} = require("../../constants/seed.const");
const {hashPassword} = require("../../helpers/common.helper");
const {tr, fa} = require("@faker-js/faker");

class UserQuery {
    /**
     *
     * @returns {Promise<Model|null>}
     * @param input
     */
    static findUserByNickOrName = async (input) => {
        return await models.sequelize.query(findUserByNameOrNick, {type: QueryTypes.SELECT, model: models.User, replacements: { input: input }});
    }

    /**
     *
     * @param {string} email
     * @returns {Promise<Model|null>}
     */
    static findUserByEmail = async (email) => {
        return await models.User.findOne({where: {email: email}});
    }

    /**
     *
     * @param {string} email
     * @param {string} roleName
     * @returns {Promise<boolean>}
     */
    static userHasRoleByEmail = async (email, roleName) => {
        return await models.User.findOne({
            where: {email: email},
            include: {model: models.Role, where: {name: roleName}, as: 'roles'}
        });
    }

    static userHasRoleByIds = async (id, roleId) => {
        return await models.User.findOne({
            where: {id},
            include: {model: models.Role, where: {id: roleId}, as: 'roles'}
        });
    }

    static findUserLikeFullname = async (input) => {
        return await models.sequelize.query(findUserByFullname, {type: QueryTypes.SELECT, model: models.User, replacements: { input: input }});
    };

    static getNotDeletedUsers = async () => {
        try {
            const query = await models.User.findAll();

            return new QuerySuccess(true, 'Se han obtenido los usuarios correctamente.', query);
        } catch (e) {
            return new QueryError(false, e)
        }
    };

    static checkIfEmailExists = async (email) => {
        try {
            const query = await models.User.findOne({where: {email}}) !== null;

            console.log(query)

            if (!query) return new QuerySuccess(true, 'No existe el correo introducido.', query);

            return new QuerySuccess(true, 'El correo introducido ha sido encontrado.', query);
        } catch (e) {
            console.log(e)
            return new QueryError(false, e)
        }
    };

    static checkIfIdExists = async (id) => {
        try {
            const query = await models.User.findOne({where: {id}}) !== null;

            if (!query) return new QuerySuccess(true, 'No existe el ID introducido.', query);

            return new QuerySuccess(true, 'El ID introducido ha sido encontrado.', query);
        } catch (e) {
            console.log(e)
            return new QueryError(false, e)
        }
    };


    static checkIfNicknameExists = async (nickname) => {
        try {
            const query = await models.User.findOne({where: {nickname}}) !== null;

            return new QuerySuccess(true, 'Se han obtenido los usuarios correctamente.', query);
        } catch (e) {
            return new QueryError(false, e)
        }
    };

    static getNotDeletedWithRoles = async () => {
        try {
            const query = await models.User.findAll({
                include: {
                    model: models.Role,
                    through: models.AssignedRole,
                    attributes: ['id', 'name', 'display_name'],
                    as: 'roles'
                }
            });

            return new QuerySuccess(true, 'Se han obtenido los usuarios correctamente.', query);
        } catch (e) {
            return new QueryError(false, e)
        }
    };

    static createUser = async (user) => {
        try {
            const roleIds = [...user.roleIds];
            let userCreated;

            user.roles = undefined;

            const created = await models.User.create(user);

            if (created) {
                userCreated = await models.User.findOne({where: {email: user.email}, attributes: ['id']});

                for (const roleId of roleIds) {
                    await models.AssignedRole.create({user: userCreated.id, role: roleId})
                }
            }

            return new QuerySuccess(true, 'Se han obtenido los usuarios correctamente.', true);
        } catch (e) {
            console.warn(e)
            return new QueryError(false, e.message)
        }
    };

    static updateUserData = async (data, id) => {
        try {
            const edited = await models.User.update(data, {where: {id}});

            return new QuerySuccess(true, 'Se han obtenido los usuarios correctamente.', edited);
        } catch (e) {
            console.warn(e)
            return new QueryError(false, e)
        }
    };

    static updateUserPassword = async (data, id) => {
        try {
            const edited = await models.User.update(data, {where: {id}});

            return new QuerySuccess(true, 'Se ha actualizado la contraseña correctamente.', edited);
        } catch (e) {
            console.warn(e)
            return new QueryError(false, e)
        }
    };

    static updateUserLogin = async (id) => {
        try {
            const logged = await models.User.update({lastLogin: new Date(Date.now())}, {where: {id}});

            return new QuerySuccess(true, 'Se han obtenido los usuarios correctamente.', logged);
        } catch (e) {
            console.warn(e)
            return new QueryError(false, e)
        }
    };

    static isFirstUserLogin = async (id) => {
        try {
            const firstLogin = await models.User.findOne({where: {id}, attributes: ['lastLogin']});

            return new QuerySuccess(true, 'Se han obtenido los usuarios correctamente.', firstLogin === true);
        } catch (e) {
            console.warn(e)
            return new QueryError(false, e)
        }
    };

    static updateUserPasswordByEmail = async (password, email) => {
        try {
            const edited = await models.User.update({password}, {where: {email}});

            return new QuerySuccess(true, 'Se ha actualizado la contraseña correctamente.', edited);
        } catch (e) {
            console.warn(e)
            return new QueryError(false, e)
        }
    };

    static insertUserRoles = async (roles, user) => {
        try {
            const entries = [];

            console.log(roles)

            roles.forEach(role => entries.push({user, role}))
            const created = await models.AssignedRole.bulkCreate(entries);

            const userRoles = await models.AssignedRole.findAll({where: {user}, attributes: ['role']});

            return new QuerySuccess(created !== null, 'Se han insertado los usuarios correctamente.', {rolesAssigned: userRoles.map(assignedRole => assignedRole.role)});
        } catch (e) {
            console.warn(e)
            return new QueryError(false, e)
        }
    };

    static deleteUserRoles = async (roles, user) => {
        try {
            const deleted = await models.AssignedRole.destroy({where: {
                [Op.and]: [
                    {user},
                    {role: {[Op.in]: roles}}
                ]}
            });

            return new QuerySuccess(true, 'Se han insertado los usuarios correctamente.', deleted);
        } catch (e) {
            console.warn(e)
            return new QueryError(false, e)
        }
    };


    /**
     *
     * @param id
     * @param {Object?} options
     * @param {boolean} options.withRoles
     * @returns {Promise<QueryError|QuerySuccess>}
     */
    static findById = async (id, options) => {
        try {
            let query;

            if (options.withRoles) {
                query = await models.User.findOne({where: {id},
                    include: {
                        model: models.Role,
                        through: models.AssignedRole,
                        as: 'roles'
                    }});
            } else {
                query = await models.User.findOne({id});
            }

            return new QuerySuccess(true, 'Se ha obtenido el usuario correctamente.', query);
        } catch (e) {
            console.log(e)
            return new QueryError(false, e)
        }
    };

    static getUserRoles = async (user) => {
        try {
            let items = await models.AssignedRole.findAll({where: {user}, attributes: ['role']});
            const roles = items.map(item => item.role);

            return new QuerySuccess(true, 'Se ha obtenido el usuario correctamente.', roles);
        } catch (e) {
            console.log(e)
            return new QueryError(false, e)
        }
    };

    static registerUser = async (user) => {
        try {
            const memberRole = await RoleQuery.getRole(roleNames.member.name)

            user.password = await hashPassword(user.password)

            const created = await models.User.create(user);

            if (created) {
                await models.AssignedRole.create({user: created.id, role: memberRole.query.id})
            }

            return new QuerySuccess(true, 'Se ha registrado el usuario correctamente.', {id:  created.id});
        } catch (e) {
            console.warn(e)
            return new QueryError(false, e)
        }
    };

    static getUserPreferences = async (user) => {
        try {
            const results = await models.sequelize.query(`SELECT up.user, up.preference, pt.text AS text, up.value FROM ${models.UserPreference.tableName} AS up 
                JOIN ${models.Preference.tableName} AS p ON up.preference = p.id 
                JOIN ${models.PreferenceType.tableName} AS pt ON p.type_id = pt.id
                WHERE up.user = :user`,
                {
                type: QueryTypes.SELECT,
                replacements: {
                    user
                }
            });

            console.log('Results', results)

            if (results.length === 0) throw new Error('El usuario no tiene preferencias.')

            const query = {
                values: [],
                choices: []
            };

            results.forEach(result => {
                if (result.text === preferenceTypes.choice.text) {
                    const {text, ...item} = result // Con esto podemos quitar la propiedad 'text' del objeto.
                    query.choices.push(item)
                } else {
                    const {text, ...item} = result
                    query.values.push(item)
                }
            })

            return new QuerySuccess(true, 'Se han obtenido las preferencias correctamente.', query);
        } catch (e) {

            console.warn(e)
            return new QueryError(false, e.message)
        }
    };

    /**
     *
     * @param {Object<preference: number, value: number>[]} preferenceValues
     * @param userToIgnore
     * @returns {Promise<QueryError|QuerySuccess>}
     */
    static getUsersByChoicePrefs = async (preferenceValues, userToIgnore) => {
        try {
            // Al usar 'map', tambien se puede desestructurar el objeto.
            // Mapeamos así las preferencias para que tengan la estructura adecuada para el where posterior.
            const whereClauses = preferenceValues.map(
                ({value, preference}) => {
                    return {[Op.and]: [{value}, {preference}]}
                }
            );

            whereClauses.forEach(item => console.log(item));

            const results = await models.UserPreference.findAll({
                where: {
                    [Op.and]: [
                        {
                            [Op.or]: whereClauses
                        },
                        {
                            [Op.not]: {user: userToIgnore}
                        }
                    ]
                },
                attributes: ['user']
            });

            return new QuerySuccess(true, 'Se han obtenido los usuarios coincidentes correctamente.', results);
        } catch (e) {
            console.warn(e)
            return new QueryError(false, e)
        }
    };

    /**
     *
     * @returns {Promise<QueryError|QuerySuccess>}
     * @param {number[]} userIds
     */
    static getValuesOfUserRangePrefs = async (userIds) => {
        try {
            let results = await models.sequelize.query(`SELECT up.user, up.preference, pt.text AS text, up.value FROM ${models.UserPreference.tableName} AS up 
                JOIN ${models.Preference.tableName} AS p ON up.preference = p.id 
                JOIN ${models.PreferenceType.tableName} AS pt ON p.type_id = pt.id
                WHERE up.user IN (:users) AND text = :preferenceText`,
                {
                    type: QueryTypes.SELECT,
                    replacements: {
                        preferenceText: preferenceTypes.range.text,
                        users: userIds
                    }
                });

            let query = new Map();

            results.forEach(({user, preference, value}) => {
                const item = query.get(user);

                if (item) item.push({preference, value})
                else query.set(user, [{preference, value}]);
            });

            query = Array.from(query).map(temp => {
                const item = {};
                item.user = temp[0]; // El ID del usuario (clave de cada item del map)
                item.preferences = temp[1]; // Array de preferencias (valor de cada item del map)

                return item
            })

            return new QuerySuccess(true, 'Se han obtenido los usuarios coincidentes correctamente.', Array.from(query));
        } catch (e) {
            console.warn(e)
            return new QueryError(false, e)
        }
    };

    static getUsersById = async (userIds) => {
        try {
            const results = await models.User.findAll({where: {id: {[Op.in]: userIds}}});
            return new QuerySuccess(true, 'Se han obtenido los usuarios afínes correctamente.', results);
        } catch (e) {
            console.warn(e)
            return new QueryError(false, e)
        }
    };

    static enableOrDisableUser = async (userId, enabled) => {
        try {
            const query = await models.User.update({enabled}, {where: {id: userId}});

            return new QuerySuccess(true, 'Se ha actualizado el usuario correctamente.', query);
        } catch (e) {
            console.warn(e)
            throw e
        }
    };

    static deleteUser = async (id) => {
        try {
            const query = await models.User.destroy({where: {id}});

            return new QuerySuccess(true, 'Se han obtenido los usuarios correctamente.', query);
        } catch (e) {
            return new QueryError(false, e)
        }
    };

    static editProfileData = async (id, user) => {
        const userExists = models.User.findOne({where: {id}}) // TODO: Middleware

        if (!userExists) return new QuerySuccess(false, 'El usuario indicado no existe.');

        const {name, firstSurname, secondSurname, nickname} = user

        try {
            const query = await models.User.update({name, firstSurname, secondSurname, nickname}, {where: {id}});

            return new QuerySuccess(true, 'Se ha editado el usuario correctamente.', query);
        } catch (e) {
            return new QueryError(false, e)
        }
    };

    static editProfileAvatar = async (id, picUrl) => {
        const userExists = models.User.findOne({where: {id}}) // TODO: Middleware

        if (!userExists) return new QuerySuccess(false, 'El usuario indicado no existe.');

        try {
            const query = await models.User.update({picUrl}, {where: {id}});

            return new QuerySuccess(true, 'Se ha editado el usuario correctamente.', query);
        } catch (e) {
            return new QueryError(false, e)
        }
    };

    static getPendingChats = async (userId) => {
        try {
            // Si bien es cierto que podria hacerse con una consulta normal, es mejor utilizar
            // Sequelize para evitar resultados duplicados.

            const usersWithPendingMessages = await models.Message.findAll({
                    where: {
                        receiver: userId,
                        read: false,
                    },
                    attributes: [
                        [models.sequelize.fn('COUNT', models.Sequelize.col('id')), 'count'],
                        'emitter',
                    ],
                    group: ['emitter'],
                    raw: true
                }
            );

            const users = await models.User.findAll({
                where: {
                    id: {
                        [Op.in]: (usersWithPendingMessages.map(message => message.emitter))
                    }
                },
                raw: true
            });

            users.forEach(user => {
                const userPending = usersWithPendingMessages.find(message => message.emitter === user.id);
                user.pendingCount = userPending.count;
            })

            if (!users) return new QuerySuccess(false, 'El usuario indicado no existe.');

            return new QuerySuccess(true, 'Se han obtenido los usuario correctamente.', users);
        } catch (e) {
            console.log(e)
            throw e
        }
    };

    static getNotPendingChats = async (userId) => {
        try {
            const usersWithPendingMessages = await models.Message.findAll({
                    where: {
                        receiver: userId,
                        read: false,
                    },
                    attributes: [
                        [models.sequelize.fn('COUNT', models.Sequelize.col('id')), 'count'],
                        'emitter',
                    ],
                    group: ['emitter'],
                    order: [['created_at', 'DESC']],
                    raw: true
                }
            );

            const usersWithReadMessages = await models.Message.findAll({
                    where: {
                        receiver: userId,
                        emitter: {
                            [Op.and]: [
                                {[Op.not]: userId},
                                {[Op.notIn]: usersWithPendingMessages.map(message => message.emitter)}
                            ]
                        },
                        read: true,
                    },
                    attributes: [
                        [models.sequelize.fn('COUNT', models.Sequelize.col('id')), 'count'],
                        'emitter',
                    ],
                    group: ['emitter'],
                    order: [['created_at', 'ASC']],
                    raw: true
                }
            );

            const usersWhoSendMessages = await models.Message.findAll({
                    where: {
                        emitter: userId,
                        receiver: {[Op.and]: [
                                {[Op.not]: userId},
                                {[Op.notIn]: usersWithPendingMessages.map(message => message.emitter)}
                            ]
                        },
                    },
                    attributes: [
                        [models.sequelize.fn('COUNT', models.Sequelize.col('id')), 'count'],
                        'receiver',
                    ],
                    group: ['receiver'],
                    order: [['created_at', 'ASC']],
                    raw: true
                }
            );

            console.log(usersWithPendingMessages.map(message => message.emitter))
            console.log((usersWhoSendMessages.map(message => message.receiver)))
            console.log((usersWithReadMessages.map(message => message.emitter)))
            const users = await models.User.findAll({
                where: {
                    id: {
                        [Op.or]: [
                            {
                                [Op.in]: (usersWhoSendMessages.map(message => message.receiver))
                            },
                            {
                                [Op.in]: (usersWithReadMessages.map(message => message.emitter))
                            },
                        ]
                    }
                },
                raw: true
            });

            if (!users) return new QuerySuccess(false, 'El usuario indicado no existe.');

            return new QuerySuccess(true, 'Se han obtenido los usuario correctamente.', users);
        } catch (e) {
            console.log(e)
            throw e
        }
    }

    static userHasRole = async (id, roleName) => {
        try {
            const hasRole = await models.User.findOne(
                {
                    where: {id},
                    include: {model: models.Role, where: {name: roleName}, as: 'roles'}
                }
            ) !== null;

            return new QuerySuccess(true, 'Se ha obtenido el rol correctamente.', hasRole);
        } catch (e) {
            console.warn(e)
            return new QueryError(false, e)
        }
    };

    static getRoleUsersRemaining = async (roleName) => {
        try {
            const remainingCount = (await models.User.findOne(
                {
                    include: {model: models.Role, attributes: [], where: {name: roleName}, as: 'roles'},
                    where: {enabled: true},
                    attributes: [
                       [models.sequelize.fn('COUNT', models.Sequelize.col('user.id')), 'remaining']
                    ],
                    raw: true
                },
            ));

            return new QuerySuccess(true, 'Se ha obtenido la cantidad de usuarios correctamente.', remainingCount.remaining);
        } catch (e) {
            console.warn(e)
            return new QueryError(false, e)
        }
    };
}

module.exports = UserQuery