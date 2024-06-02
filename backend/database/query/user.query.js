const models = require('../models/index');
const {findUserByNameOrNick, findUserByFullname} = require("../../constants/sql.const");
const {QueryTypes, Op} = require("sequelize");
const QuerySuccess = require("../../classes/QuerySuccess");
const QueryError = require("../../classes/QueryError");
const {jpegminiMedium} = require("@cloudinary/url-gen/qualifiers/quality");
const RoleQuery = require("./role.query");
const {roleNames} = require("../../constants/seed.const");

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

            if (!query) return new QuerySuccess(true, 'No existe el correo introducido.', query);

            return new QuerySuccess(true, 'El correo introducido ha sido encontrado.', query);
        } catch (e) {
            console.log(e)
            return new QueryError(false, e)
        }
    };

    static checkIfNicknameExists = async (nickname) => {
        try {
            const query = await models.User.findOne({where: {nickname}});

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
            return new QueryError(false, e)
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

            console.log(memberRole)

            const created = await models.User.create(user);

            if (created) {
                await models.AssignedRole.create({user: created.id, role: memberRole.query.id})
            }

            return new QuerySuccess(true, 'Se ha registrado el usuario correctamente.', true);
        } catch (e) {
            console.warn(e)
            return new QueryError(false, e)
        }
    };
}

module.exports = UserQuery