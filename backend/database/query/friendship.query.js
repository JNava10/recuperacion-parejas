const models = require('../models/index');
const {findUserByNameOrNick, findUserByFullname} = require("../../constants/sql.const");
const {QueryTypes, Op} = require("sequelize");
const QuerySuccess = require("../../classes/QuerySuccess");
const QueryError = require("../../classes/QueryError");

class FriendshipQuery {
    static checkIfIsLiked = async (userHasLike, userToLike) => {
        try {
            const liked = await models.Friendship.findOne({
                where: {
                    [Op.or]: [
                        {requesting_user: userHasLike, requested_user: userToLike},
                        {requesting_user: userToLike, requested_user: userHasLike},
                    ]
                },
                attributes: ['requesting_user', 'requested_user']
            });

            console.log(liked)

            if (liked) return new QuerySuccess(true, "Ya se habia dado `me gusta' anteriormente.", {isMatch: true});
            else return new QuerySuccess(true, "No se ha encontrado ningun 'me gusta' con los usuarios indicados.", {isMatch: false});
        } catch (e) {
            console.warn(e)
            return new QueryError(false, e)
        }
    };

    static likeUser = async (userHasLike, userToLike) => {
        try {
            const liked = await models.Friendship.create({requesting_user: userHasLike, requested_user: userToLike}) !== null;

            return new QuerySuccess(liked, 'Se ha insertado el like correctamente.', {isMatch: false});
        } catch (e) {
            console.warn(e)
            return new QueryError(false, e)
        }
    };

    static setMatch = async (userWhoMatched, userToMatch) => {
        try {
            const liked = await models.Match.create({userWhoMatched, userToMatch}) !== null;

            return new QuerySuccess(liked, 'Se ha insertado el like correctamente.', {isMatch: false});
        } catch (e) {
            console.warn(e)
            return new QueryError(false, e)
        }
    };
}

module.exports = FriendshipQuery