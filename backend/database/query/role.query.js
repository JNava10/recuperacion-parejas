
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


    static roleExists = async (name) => {
        try {
            const role = (await models.Role.findOne(
                {
                    where: {name},
                    raw: true
                }
            )) !== null;

            const message = role ? 'El rol indicado existe' : 'El rol indicado no existe.';

            return new QuerySuccess(true, message, role);
        } catch (e) {
            console.error(e)
            throw e
        }
    };

    static checkIfRoleInserted = (roles, userId) => {

    };

    static getUserRoles = async (user) => {
        try {
            const items = await models.AssignedRole.findAll({where: {user}, attributes: ['role']});
            const roles = items.map(item => item.role);

            return new QuerySuccess(true, 'Se han obtenido los roles del usuario correctamente.', roles);
        } catch (e) {
            console.log(e)
            return new QueryError(false, e)
        }
    };

    static getUserRolesWithItems = async (user) => {
        try {
            const items = await models.AssignedRole.findAll({
                where: {user}, attributes: ['role'],
                include: {
                    model: models.Role,
                    attributes: ['name'],
                    as: 'roleData'
                }
            });
            const roles = items.map(item => item.role);

            return new QuerySuccess(true, 'Se han obtenido los roles del usuario correctamente.', roles);
        } catch (e) {
            console.error(e)
            throw e
        }
    };
}

module.exports = RoleQuery