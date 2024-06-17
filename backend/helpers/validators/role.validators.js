const RoleQuery = require("../../database/query/role.query");
const CustomError = require("../../classes/customError");

const roleMustExist = async (roleId) => {
    try {
        const roleExists = await RoleQuery.roleExists(roleId);

        if (!roleExists.query) throw new CustomError('El usuario no existe.')
    } catch (e) {
        throw new Error('Ha habido un problema al comprobar si el rol existe.')
    }
}

const rolesMustExist = async (roles) => {
    const rolesExists = [];

    for (const role of roles) {
        const exists = (await RoleQuery.roleExists(role)).query;

        if (exists) rolesExists.push(role);
    }

    if (rolesExists.length !== roles.length) throw new CustomError('El usuario no existe.')
}

module.exports = {
    roleMustExist,
    rolesMustExist
}