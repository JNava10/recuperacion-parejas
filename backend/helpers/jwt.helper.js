const jwt = require('jsonwebtoken');
const StdResponse = require("../classes/stdResponse");
const BlacklistController = require("../controllers/blacklist.controller");
const CustomError = require("../classes/customError");

const validateAuthToken = (req , res , next) => {
    const token = req.header('x-token');

    if (!token){
        throw new CustomError('No hay token en la peticion.')
    }

    try {
        const tokenIsRevoked = BlacklistController.tokenIsRevoked(token)

        console.log(tokenIsRevoked)

        if (tokenIsRevoked) throw new CustomError('El token ya fue revocado.')

        const {userId, userEmail} = jwt.verify(token, process.env.PRIVATE_KEY);

        req.payload = {userId, userEmail};

        next();
    } catch(error){
        console.error(error);

        if (error instanceof CustomError) {
            return res.status(401).json(
                new StdResponse(
                    error.message,
                    {auth: false}
                )
            );
        } else {
            return res.status(401).json(
                new StdResponse(
                    'No se ha podido verificar el token correctamente.',
                    {auth: false}
                )
            );
        }
    }
}

// Funcion usada para validar el token unicamente, y no como middleware.
const verifyToken = (token) => jwt.verify(token, process.env.PRIVATE_KEY);

const generateToken = (payloadData, expiresAt) => {
    const expiresIn = expiresAt || process.env.TOKEN_EXPIRE_TIME;

    return jwt.sign(payloadData, process.env.PRIVATE_KEY, {expiresIn});
}

module.exports = {
    generateToken,
    validateToken: validateAuthToken,
    verifyToken
}