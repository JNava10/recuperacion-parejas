const RoleQuery = require("../../database/query/role.query");
const CustomError = require("../../classes/customError");

const roleMustExist = async (roleId) => {
    try {
        const roleExists = await RoleQuery.roleNameExists(roleId);

        if (!roleExists.query) throw new CustomError('El usuario no existe.')
    } catch (e) {
        throw new Error('Ha habido un problema al comprobar si el rol existe.')
    }
}

const roleNamesMustExist = async (roles) => {
    const rolesExists = [];

    for (const role of roles) {
        const exists = (await RoleQuery.roleNameExists(role)).query;

        console.log(exists)

        if (exists) rolesExists.push(role);

        console.log(rolesExists, roles)
    }

    if (rolesExists.length !== roles.length) throw new CustomError('Alguno de los roles indicados no existe.')
}

const roleIdsMustExist = async (roles) => {
    const rolesExists = [];

    for (const role of roles) {
        const exists = (await RoleQuery.roleIdExists(role)).query;

        if (exists) rolesExists.push(role);
    }

    if (rolesExists.length !== roles.length) throw new CustomError('Alguno de los roles indicados no existe.')
}

const hasAdminId = async (roles) => {
    const adminId = (await RoleQuery.getRole('admin')).query.id

    if (!roles.includes(adminId))  throw new CustomError('No se ha encontrado el rol indicado.')
}

const hasMemberId = async (roles) => {
    const adminId = (await RoleQuery.getRole('member')).query.id

    if (!roles.includes(adminId))  throw new CustomError('No se ha encontrado el rol indicado')
}

module.exports = {
    roleMustExist,
    roleNamesMustExist,
    roleIdsMustExist,
    hasAdminId,
    hasMemberId
}