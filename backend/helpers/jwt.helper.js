const jwt = require('jsonwebtoken');
const StdResponse = require("../classes/stdResponse");
const CustomError = require("../classes/customError");
const AuthController = require("../controllers/auth.controller");

const validateAuthToken = (req , res , next) => {
    const token = req.header('x-token');

    if (!token){
        throw new CustomError('No hay token en la peticion.')
    }

    try {
        const tokenIsRevoked = AuthController.tokenIsRevoked(token)

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
const verifyToken = (token) => {
    try {
        return jwt.verify(token, process.env.PRIVATE_KEY)
    } catch (e) {
        console.error(e)
        return false
    }
};

const generateToken = (payloadData, expiresAt) => {
    try {
        const expiresIn = expiresAt || process.env.TOKEN_EXPIRE_TIME;

        return jwt.sign(payloadData, process.env.PRIVATE_KEY, {expiresIn});
    } catch (e) {
        return false
    }
}

module.exports = {
    generateToken,
    validateToken: validateAuthToken,
    verifyToken
}