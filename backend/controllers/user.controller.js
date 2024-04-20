const {sendStandardResponse} = require("../helpers/common.helper");
const UserQuery = require("../database/query/user.query");
const {compare} = require("bcrypt");
const {generateToken} = require("../helpers/jwt.helper");
const StdResponse = require("../classes/stdResponse");

class UserController {
    static findUser = async (req, res) => {
        const inputSearch = req.body.input;
        const inputIsOneWord = inputSearch.split(" ").length > 1;

        let results;

        if (inputIsOneWord) results = await UserQuery.findUserLikeFullname(inputSearch);
        else results = await UserQuery.findUserByNickOrName(inputSearch);

        return res.status(200).json(
            new StdResponse(
                'Se ha iniciado sesión correctamente.',
                {founded: results.length > 0, results}
            )
        )
    };
}

module.exports = UserController