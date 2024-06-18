const PreferenceQuery = require("../../database/query/preference.query");
const CustomError = require("../../classes/customError");

const preferenceMustExist = async (preferenceId) => {
    try {
        const preferenceExists = await PreferenceQuery.preferenceExists(preferenceId);

        if (!preferenceExists.query) throw new CustomError('La preferencia no existe.')
    } catch (e) {
        throw new Error('Ha habido un problema al comprobar si la preferencia existe.')
    }
}

module.exports = {
    preferenceMustExist
}