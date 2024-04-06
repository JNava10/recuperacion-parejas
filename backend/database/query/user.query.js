const models = require('../models/index');

class UserQuery {
    findUserByEmail = async (email) => {
        const user = await models.User.findOne({where: {email: email}});

        return user | false;
    }
}

module.exports = UserQuery