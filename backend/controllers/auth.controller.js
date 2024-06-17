const StdResponse = require("../classes/stdResponse");


const {generateToken} = require("../helpers/jwt.helper");

class AuthController {
    static blacklistedTokens = [];

    static addToBlacklist = (token) => {
        AuthController.blacklistedTokens.push(token);
    }

    static tokenIsRevoked = (token) => {
        return AuthController.blacklistedTokens.includes(token)
    }

    static logout = (req, res) => {
        const token = req.header('x-token');

        if (!token) return res.status(400).json(
            new StdResponse('No hay token en la petición',{executed: false})
        )

        AuthController.addToBlacklist(token);

        return res.status(200).json(
            new StdResponse('Se ha cerrado sesión exitosamente.',{executed: true})
        )
    }

    // La funcion de Login deberia estar aqui.
    // Pero por algún motivo, la misma funcion
    // aquí no detecta el metodo generateToken(),
    // mientras que si copio la funcion y la pego
    // en cualquier otro controlador, funciona perfectamente...
}

module.exports = AuthController