const jwt = require('jsonwebtoken');
const StdResponse = require("../classes/stdResponse");

const validateAuthToken = (req , res , next) => {
    const token = req.header('x-token');

    if (!token){
        return res.status(401).json({'msg':'No hay token en la petición.'});
    }

    try {
        const {userId, userEmail} = jwt.verify(token, process.env.PRIVATE_KEY);

        req.payload = {userId, userEmail};

        next();
    } catch(error){
        console.error(error);
        res.status(401).json(
            new StdResponse(
                'No se ha podido verificar el token correctamente.',
                {auth: false}
            )
        );
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