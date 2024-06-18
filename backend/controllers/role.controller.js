
const StdResponse = require("../classes/stdResponse");
const RoleQuery = require("../database/query/role.query");
const UserQuery = require("../database/query/user.query");
const {objectFlip} = require("@cloudinary/url-gen/internal/utils/objectFlip");

class RoleController {

    static getAllRoles = async (req, res) => {
        try {
            const {message, executed, query, error} = await RoleQuery.getAllRoles();

            return res.status(200).json(
                new StdResponse(message,{executed, query})
            )
        } catch (e) {
            return res.status(203).json(
                new StdResponse('Ha ocurrido un problema al obtener el evento.',{executed: false, error: e.message})
            )
        }
    };

    static getRoleUsers = async (req, res) => {
        try {
            const {message, executed, query} = await UserQuery.getRoleUsers(req.params.role);

            return res.status(200).json(
                new StdResponse(message,{executed, query})
            );
        } catch (e) {
            return res.status(203).json(
                new StdResponse('Ha ocurrido un problema al obtener el evento.',{executed: false, error: e.message})
            )
        }
    };

    static addUserRoles = async (req, res) => {
        try {
            let roles = req.body.roles;

            const rolesAlreadyInserted = await RoleQuery.checkIfRoleInserted(roles, req.params.id);

            const {message, executed, query} = await UserQuery.insertUserRoles(roles, req.params.id);

            return res.status(200).json(
                new StdResponse(message,{executed, query})
            )
        } catch (e) {
            return res.status(203).json(
                new StdResponse('Ha ocurrido un problema al obtener el evento.',{executed: false, error: e.message})
            )
        }
    }

    static getSelfRoles = async (req, res) => {
        try {
            const userId = req.payload.userId;

            const {query, message, executed} = await RoleQuery.getUserRolesWithItems(userId);

            return res.status(200).json(
                new StdResponse(message, {
                    executed,
                    query
                })
            );
        } catch (e) {
            return res.status(203).json(
                new StdResponse('Ha ocurrido un problema al obtener el evento.',{executed: false, error: e.message})
            )
        }
    };

    static deleteUserRoles = async (req, res) => {
        try {
            const {message, executed, query} = await UserQuery.deleteUserRoles(req.body.roles, req.params.id);

            return res.status(200).json(
                new StdResponse(message,{executed, query})
            )
        } catch (e) {
            console.log(e)
            return res.status(203).json(
                new StdResponse('Ha ocurrido un problema al obtener el evento.',{executed: false, error: e.message})
            )
        }
    };
}

module.exports = RoleController