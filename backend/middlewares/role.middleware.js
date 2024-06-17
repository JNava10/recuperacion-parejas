const UserQuery = require("../database/query/user.query");
const StdResponse = require("../classes/stdResponse");

const moreOneAdminRemaining = async (req, res, next) => {
    const adminsRemaining = (await UserQuery.getRoleUsersRemaining('admin')).query;

    if (adminsRemaining >= 1) return res.status(200).json(
        new StdResponse('No se pueden borrar mas administradores.',{executed: false})
    )

    next()
}

module.exports = {
    moreOneAdminRemaining
}