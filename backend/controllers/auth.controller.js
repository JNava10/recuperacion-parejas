const {sendStandardResponse} = require("../helpers/common.helper");
const UserQuery = require("../database/query/user.query");
const {compare} = require("bcrypt");
const {generateToken} = require("../helpers/jwt.helper");
const StdResponse = require("../classes/stdResponse");

class AuthController {
    static login = async (req, res) => {
        const email = req.body.email;
        const password = req.body.password;

        console.log('Body:', req.body)

        const user = await UserQuery.findUserByEmail(email);

        if (!user) {
            return res.status(200).json(
                new StdResponse(
                    'Credenciales invalidas. Vuelve a intentarlo.',
                    {logged: false}
                )
            )
        }
        
        const passwordsMatch = await compare(password, user.password);

        if (!passwordsMatch) {
            return res.status(200).json(
                new StdResponse(
                    'Credenciales invalidas. Vuelve a intentarlo.',
                    {logged: false}
                )
            )
        }

        const token = generateToken({userId: user.id, userEmail: user.email});
        console.info(`Se ha logueado un usuario ${user.email} correctamente.`)

        return res.status(200).json(
            new StdResponse(
                'Se ha iniciado sesión correctamente.',
                {logged: true, token: token}
            )
        )
    };
}

module.exports = AuthController