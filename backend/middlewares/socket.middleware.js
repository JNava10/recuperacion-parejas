const {verifyToken} = require("../helpers/jwt.helper");

const authMiddleware = (socket, next) => {
    const token = socket.handshake.headers.token;
    const user = verifyToken(token)

    if (!user) throw new Error('Unauthorized')

    socket.user = user // Metemos el token en el objeto de socket.io para poder sacar el ID despues.

    next();
};

module.exports = {
    authMiddleware
}