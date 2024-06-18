const UserQuery = require("../database/query/user.query");
const StdResponse = require("../classes/stdResponse");
const RoleQuery = require("../database/query/role.query");

const moreOneAdminRemaining = async (req, res, next) => {
    const roles = req.body.roles;
    const adminsRemaining = (await UserQuery.getRoleUsersRemaining('admin')).query;
    const adminId = (await RoleQuery.getRole('admin')).query.id

    if (roles.includes(adminId) && adminsRemaining <= 1) {
        return res.status(200).json(
            new StdResponse('No se pueden borrar mas administradores.',{executed: false})
        )
    }

    next()
}

module.exports = {
    moreOneAdminRemaining
}