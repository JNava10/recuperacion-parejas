const {sendStandardResponse} = require("../helpers/common.helper");
const {UserQuery} = require("../database/query/user.query");
const userQuery = new UserQuery();
const {compare} = require("bcrypt");


class AuthController {
    login = async (req) => {
        const email = req.body.email;
        const password = req.body.password;

        const user = await userQuery.findUserByEmail(email);

        if (!user) return sendStandardResponse(
            'Credenciales invalidas. Vuelve a intentarlo.',
            {
            logged: false,
        });

        const passwordsMatch = compare(password, user.password);

        if (!passwordsMatch) return sendStandardResponse(
            'Credenciales invalidas. Vuelve a intentarlo.',
            {
                logged: false,
            });


    };
}

module.exports = AuthController