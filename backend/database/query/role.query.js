
const models = require('../models/index');
const {QueryTypes, Op} = require("sequelize");
const QuerySuccess = require("../../classes/QuerySuccess");
const QueryError = require("../../classes/QueryError");

class RoleQuery {
    static getAllRoles = async () => {
        try {
            const query = await models.Role.findAll();

            return new QuerySuccess(true, 'Se han obtenido los role correctamente.', query);
        } catch (e) {
            console.error(e)
            throw e
        }
    };

    static getRole = async (name) => {
        try {
            const query = await models.Role.findOne({where: {name}});

            return new QuerySuccess(true, 'Se ha obtenido el rol correctamente.', query);
        } catch (e) {
            console.error(e)
            throw e
        }
    };

    static checkIfRoleInserted = (roles, userId) => {

    };
}

module.exports = RoleQuery