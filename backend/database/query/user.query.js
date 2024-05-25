const models = require('../models/index');
const {findUserByNameOrNick, findUserByFullname} = require("../../constants/sql.const");
const {QueryTypes, Op} = require("sequelize");
const QuerySuccess = require("../../classes/QuerySuccess");
const QueryError = require("../../classes/QueryError");
const {jpegminiMedium} = require("@cloudinary/url-gen/qualifiers/quality");

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
    static userHasRole = async (email, roleName) => {
        return await models.User.findOne({
            where: {email: email},
            include: {model: models.Role, where: {name: roleName}, as: 'roles'}
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
            const query = await models.User.findOne({where: {email}});

            return new QuerySuccess(true, 'Se han obtenido los usuarios correctamente.', query);
        } catch (e) {
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
}

module.exports = UserQuery