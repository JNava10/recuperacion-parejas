const UserQuery = require("../../database/query/user.query");
const CustomError = require("../../classes/customError");


const userMustExist = async (userId) => {
    try {
        if (userId) {
            const userExists = (await UserQuery.checkIfIdExists(userId)).query

            if (!userExists) throw new CustomError('El usuario no existe.')
        }
    } catch (e) {
        console.log(e)
        throw new Error('Ha habido un problema al comprobar si el usuario existe.')
    }
}

const emailMustNotExist = async (email) => {
    try {
        const emailExists = (await UserQuery.checkIfEmailExists(email)).query

        if (emailExists) throw new CustomError('El email ya existe.')
    } catch (e) {
        if (!(e instanceof CustomError)) {
            console.error(e)

            throw new Error('Ha habido un problema al comprobar si el usuario existe.')
        } else {
            console.log(e)
            throw e
        }
    }
}

const nicknameMustNotExist = async (nickname) => {
    try {
        const nicknameExists = (await UserQuery.checkIfNicknameExists(nickname)).query

        if (nicknameExists) throw new CustomError('El nombre de usuario ya existe.')
    } catch (e) {
        if (!(e instanceof CustomError)) {
            console.error(e)

            throw new Error('Ha habido un problema al comprobar si el usuario existe.')
        } else {
            console.log(e)
            throw e
        }
    }
}

module.exports = {
    emailMustNotExist,
    nicknameMustNotExist,
    userMustExist
}