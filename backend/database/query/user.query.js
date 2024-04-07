const models = require('../models/index');

class UserQuery {
    static findUserByEmail = async (email) => {
        const user = await models.User.findOne({where: {email: email}});

        console.log(user)

        return user;
    }
}

module.exports = UserQuery