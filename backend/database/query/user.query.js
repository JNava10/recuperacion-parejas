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


    static findUserByNickOrName = async (input) => {
        try {
            const query = await models.sequelize.query(findUserByNameOrNick, {
                type: QueryTypes.SELECT,
                model: models.User,
                replacements: {input: input}
            });

            return new QuerySuccess(true, 'Se ha obtenido el usuario correctamente.', query);
        } catch (e) {

        }
    }

    static findUserByEmail = async (email) => {
        try {
            const query = await models.User.findOne({where: {email}});

            return new QuerySuccess(true, 'Se ha obtenido el usuario correctamente.', query);
        } catch (e) {
            console.error(e)
            throw e
        }
    }

    static userHasRoleByEmail = async (email, roleName) => {
       try {
           let query = await models.User.findOne({
               where: {email: email},
               include: {model: models.Role, where: {name: roleName}, as: 'roles'}
           }) !== null;

           const message = query ? 'El usuario tiene el rol' : 'El usuario no tiene el rol';

           return new QuerySuccess(true, message, query);
       } catch (e) {
           console.error(e)
           throw e
       }
    }

    // Por si hay algun metodo externo que dependa de el:
    // static userHasRoleByIds = async (id, roleId) => {
    //     try {
    //         const query = await models.User.findOne({
    //             where: {id},
    //             include: {model: models.Role, where: {id: roleId}, as: 'roles'}
    //         });
    //
    //         return new QuerySuccess(true, "T", query);
    //     } catch (e) {
    //         console.error(e)
    //         throw e
    //     }
    // }

    static findUserLikeFullname = async (input) => {
        try {
            const query = await models.sequelize.query(findUserByFullname, {
                type: QueryTypes.SELECT,
                model: models.User,
                replacements: {input: input}
            });

            return new QuerySuccess(true, 'Se ha obtenido el usuario correctamente.', query);
        } catch (e) {
            console.error(e)
            throw e
        }
    };

    static getNotDeletedUsers = async (selfId) => {
        try {
            const query = await models.User.findAll({where: {[Op.not]: {id: selfId}}});

            return new QuerySuccess(true, 'Se han obtenido los usuarios correctamente.', query);
        } catch (e) {
            console.error(e)
            throw e
        }
    };

    static checkIfEmailExists = async (email) => {
        try {
            const query = await models.User.findOne({where: {email}}) !== null;

            if (!query) return new QuerySuccess(true, 'No existe el correo introducido.', query);

            return new QuerySuccess(true, 'El correo introducido ha sido encontrado.', query);
        } catch (e) {
            console.error(e)
            throw e
        }
    };

    static checkIfIdExists = async (id) => {
        try {
            const query = await models.User.findOne({where: {id}}) !== null;

            if (!query) return new QuerySuccess(true, 'No existe el ID introducido.', query);

            return new QuerySuccess(true, 'El ID introducido ha sido encontrado.', query);
        } catch (e) {
            console.error(e)
            throw e
        }
    };


    static checkIfNicknameExists = async (nickname) => {
        try {
            const exists = await models.User.findOne({where: {nickname}}) !== null;

            const message = exists ? 'El nombre de usuario indicado ya existe' : 'El nombre de usuario indicado no se ha encontrado.'

            return new QuerySuccess(true, message, exists);
        } catch (e) {
            console.error(e)
            throw e
        }
    };

    static getNotDeletedWithRoles = async (selfId) => {
        try {
            const query = await models.User.findAll({
                include: {
                    model: models.Role,
                    through: models.AssignedRole,
                    attributes: ['id', 'name', 'display_name'],
                    as: 'roles'
                },  where: {[Op.not]: {id: selfId}}
            });

            return new QuerySuccess(true, 'Se han obtenido los usuarios correctamente.', query);
        } catch (e) {
            console.error(e)
            throw e
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

            return new QuerySuccess(true, 'Se ha creado el usuario correctamente.', {id: created.id});
        } catch (e) {
            console.error(e)
            throw e
        }
    };

    static updateUserData = async (data, id) => {
        try {
            const edited = await models.User.update(data, {where: {id}});

            return new QuerySuccess(true, 'Se ha actualizado el usuario correctamente.', edited);
        } catch (e) {
            console.error(e)
            throw e
        }
    };

    static updateUserPassword = async (data, id) => {
        try {
            const edited = await models.User.update(data, {where: {id}});

            return new QuerySuccess(true, 'Se ha actualizado la contraseña correctamente.', edited);
        } catch (e) {
            console.error(e)
            throw e
        }
    };

    static updateUserLogin = async (id) => {
        try {
            const logged = await models.User.update({lastLogin: new Date(Date.now())}, {where: {id}});

            return new QuerySuccess(true, 'Se ha actualizado el login del usuario correctamente.', logged);
        } catch (e) {
            console.error(e)
            throw e
        }
    };

    static isFirstUserLogin = async (id) => {
        try {
            const firstLogin = await models.User.findOne({where: {id}, attributes: ['lastLogin']});

            return new QuerySuccess(true, 'Se ha ejecutado la consulta correctamente.', firstLogin === true);
        } catch (e) {
            console.error(e)
            throw e
        }
    };

    static updateUserPasswordByEmail = async (password, email) => {
        try {
            const edited = await models.User.update({password}, {where: {email}});

            return new QuerySuccess(true, 'Se ha actualizado la contraseña correctamente.', edited);
        } catch (e) {
            console.error(e)
            throw e
        }
    };

    // TODO: mover a RoleQuery
    static insertUserRoles = async (roles, user) => {
        try {
            const entries = [];

            console.log(roles)

            roles.forEach(role => entries.push({user, role}))
            const created = await models.AssignedRole.bulkCreate(entries);

            const userRoles = await models.AssignedRole.findAll({where: {user}, attributes: ['role']});

            return new QuerySuccess(created !== null, 'Se ha asignado el rol correctamente.', {rolesAssigned: userRoles.map(assignedRole => assignedRole.role)});
        } catch (e) {
            console.error(e)
            throw e
        }
    };

    // TODO: mover a RoleQuery
    static deleteUserRoles = async (roles, user) => {
        try {
            const deleted = await models.AssignedRole.destroy({where: {
                [Op.and]: [
                    {user},
                    {role: {[Op.in]: roles}}
                ]}
            });

            return new QuerySuccess(true, 'Se ha quitado el rol correctamente.', deleted);
        } catch (e) {
            console.error(e)
            throw e
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
            console.error(e)
            throw e
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
            console.error(e)
            throw e
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
            console.error(e)
            throw e
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
                        },
                    ]
                },
                attributes: ['user']
            });

            return new QuerySuccess(true, 'Se han obtenido los usuarios coincidentes correctamente.', results);
        } catch (e) {
            console.error(e)
            throw e
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
            console.error(e)
            throw e
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

            return new QuerySuccess(true, 'Se ha borrado el usuario correctamente.', query);
        } catch (e) {
            console.error(e)
            throw e
        }
    };

    static editProfileData = async (id, user) => {
        try {
            const userExists = models.User.findOne({where: {id}}) // TODO: Validator

            if (!userExists) return new QuerySuccess(false, 'El usuario indicado no existe.');

            const {name, firstSurname, secondSurname, nickname} = user

            const query = await models.User.update({name, firstSurname, secondSurname, nickname}, {where: {id}});

            return new QuerySuccess(true, 'Se ha editado el usuario correctamente.', query);
        } catch (e) {
            console.error(e)
            throw e
        }
    };

    static editProfileAvatar = async (id, picUrl) => {
        try {
            const userExists = models.User.findOne({where: {id}}) // TODO: Validator

            if (!userExists) return new QuerySuccess(false, 'El usuario indicado no existe.')

            const query = await models.User.update({picUrl}, {where: {id}});

            return new QuerySuccess(true, 'Se ha editado el usuario correctamente.', query);
        } catch (e) {
            console.error(e)
            throw e
        }
    };

    // TODO: Mover a RoleQuery
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
            console.error(e)
            throw e
        }
    };

    // TODO: Mover a RoleQuery
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

    static getRoleUsers = async (roleName) => {
        try {
            const users = await models.User.findAll(
                {
                    include: {model: models.Role, attributes: [], where: {name: roleName}, as: 'roles'},
                    where: {enabled: true},
                    raw: true
                },
            );

            return new QuerySuccess(true, 'Se ha obtenido la cantidad de usuarios correctamente.', users);
        } catch (e) {
            console.error(e)
            throw e
        }
    };

    static setUserPreferences = async (userId, preferences) => {
        try {
            for (const {value, preference} of preferences) {
                await models.UserPreference.update(
                    {value},
                    {
                        where: {
                            [Op.and]: [
                                {user: userId},
                                {preference}
                            ]
                        }
                    });
            }

            return new QuerySuccess(true, 'Se han modificado las preferencias correctamente.');
        } catch (e) {
            console.error(e)
            throw e
        }
    };
}

module.exports = UserQuery