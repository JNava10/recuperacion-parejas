const models = require('../models/index');
const {findUserByNameOrNick, findUserByFullname} = require("../../constants/sql.const");
const {QueryTypes} = require("sequelize");

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
        return await models.sequelize.query(findUserByFullname,  {type: QueryTypes.SELECT, model: models.User, replacements: { input: input }});
    };
}

module.exports = UserQuery