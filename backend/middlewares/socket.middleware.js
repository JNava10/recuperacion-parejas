const {verifyToken} = require("../helpers/jwt.helper");
const {tokenTypes} = require("../constants/common.constants");

const authMiddleware = (socket, next) => {
    const token = socket.handshake.headers.token;

    console.log('token', token, token === null)

    if (token === null) throw new Error('Unauthorized')

    const {userId, type} = verifyToken(token);

    if (!type || type !== tokenTypes.socket) throw new Error('Invalid token.')
    if (!userId) throw new Error('Unauthorized')

    socket.user = {userId} // Metemos el token en el objeto de socket.io para poder sacar el ID despues.

    next();
};

module.exports = {
    authMiddleware
}