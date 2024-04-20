const StdResponse = require("../classes/stdResponse");
const UserQuery = require("../database/query/user.query");
const {roleNames} = require("../constants/seed.const");

const isAdmin = async (req, res, next) => {
    if (!req.payload) return res.status(400).json(
        new StdResponse(
            'No se han podido obtener los datos del token.',
            {auth: false}
        )
    );

    const {userEmail} = req.payload;

    const hasRole = await UserQuery.userHasRole(userEmail, roleNames.admin.name)

    if (!hasRole) return res.status(401).json(
        new StdResponse(
            'No tienes permiso para acceder a esta ruta.',
            {auth: false}
        )
    )

    next()
}

const isMember = async (req, res, next) => {
    if (!req.payload) return res.status(400).json(
        new StdResponse(
            'No se han podido obtener los datos del token.',
            {auth: false}
        )
    );

    const {userEmail} = req.payload;

    const hasRole = await UserQuery.userHasRole(userEmail, roleNames.member.name)

    if (!hasRole) return res.status(401).json(
        new StdResponse(
            'No tienes permiso para acceder a esta ruta.',
            {auth: false}
        )
    )

    next()
}

module.exports = {isAdmin, isMember}