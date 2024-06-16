// Lista de tokens prohibidos

const StdResponse = require("../classes/stdResponse");

class BlacklistController {
    static blacklistedTokens = [];

    static addToBlacklist = (token) => {
        BlacklistController.blacklistedTokens.push(token);
    }

    static tokenIsRevoked = (token) => {
        console.log(BlacklistController.blacklistedTokens)
        return BlacklistController.blacklistedTokens.includes(token)
    }

    static logout = (req, res) => {
        const token = req.header('x-token');

        if (!token) return res.status(400).json(
            new StdResponse('No hay token en la petición',{executed: false})
        )

        BlacklistController.addToBlacklist(token);

        return res.status(200).json(
            new StdResponse('Se ha cerrado sesión exitosamente.',{executed: true})
        )
    }
}

module.exports = BlacklistController