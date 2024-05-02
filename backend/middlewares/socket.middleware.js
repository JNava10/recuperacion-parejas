const {verifyToken} = require("../helpers/jwt.helper");

const authMiddleware = (socket, next) => {
    const token = socket.handshake.headers.token;
    const tokenValid = verifyToken(token)

    if (!tokenValid) throw new Error('Unauthorized')

    socket.token = token // Metemos el token en el objeto de socket.io para poder sacar el ID despues.

    next();
};

module.exports = {
    authMiddleware
}