const {sendStandardResponse} = require("../helpers/common.helper");
const UserQuery = require("../database/query/user.query");
const {compare} = require("bcrypt");
const {generateToken} = require("../helpers/jwt.helper");
const StdResponse = require("../classes/stdResponse");

class AuthController {
    static login = async (req, res) => {
        const email = req.body.email;
        const password = req.body.password;

        const user = await UserQuery.findUserByEmail(email);

        console.log('User:', user);

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

        const token = generateToken(user.id, user.email);

        return res.status(200).json(
            new StdResponse(
                'Se ha iniciado sesión correctamente.',
                {logged: true, token: token}
            )
        )
    };
}

module.exports = AuthController