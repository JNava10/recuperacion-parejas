
const EventQuery = require("../database/query/event.query");
const StdResponse = require("../classes/stdResponse");
const QuerySuccess = require("../classes/QuerySuccess");
const {findRecentChatMessages} = require("../database/query/message.query");
const {id_ID} = require("@faker-js/faker");
const RoleQuery = require("../database/query/role.query");
const UserQuery = require("../database/query/user.query");

class RoleController {

    static getAllRoles = async (req, res) => {
        const {message, executed, query, error} = await RoleQuery.getAllRoles();

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

    static getRoleUsers = async (req, res) => {
        try {
            const roleExists = await UserQuery.roleExists(req.params.role);

            if (!roleExists.query) return res.status(400).json(
                new StdResponse(roleExists.message,{executed: false})
            );

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

    static addUserRoles = async (req, res) => {

        try {
            const rolesAlreadyInserted = await RoleQuery.checkIfRoleInserted(req.body.roles, req.params.id);



            const {message, executed, query} = await UserQuery.insertUserRoles(req.body.roles, req.params.id);

            return res.status(200).json(
                new StdResponse(message,{executed, query})
            )
        } catch (e) {
            console.log(e);

            return res.status(500).json(
                new StdResponse(e.message,{executed: false})
            );
        }
    }

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
}

module.exports = RoleController