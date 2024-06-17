const models = require('../models/index');
const {findUserByNameOrNick, findUserByFullname} = require("../../constants/sql.const");
const {QueryTypes, Op} = require("sequelize");
const QuerySuccess = require("../../classes/QuerySuccess");
const QueryError = require("../../classes/QueryError");

class FriendshipQuery {
    static checkIfIsLiked = async (userHasLike, userToLike) => {
        try {
            console.log(userHasLike, userToLike)
            const liked = await models.Friendship.findOne({
                where: {
                    [Op.or]: [
                        {requesting_user: userHasLike, requested_user: userToLike},
                        {requesting_user: userToLike, requested_user: userHasLike},
                    ]
                },
                attributes: ['requesting_user', 'requested_user']
            });

            console.log('liked', liked, liked !== null)

            if (liked !== null) return new QuerySuccess(true, "Ya se habia dado `me gusta' anteriormente.", {isMatch: true});
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

    static getMatchedUsers = async (userWhoMatched) => {
        try {
            const matchedUsers = await models.Match.findAll({
                where: {[Op.or]: [
                        {userWhoMatched: userWhoMatched},
                        {userToMatch: userWhoMatched},
                    ]
                },
                attributes: ['userWhoMatched', 'userToMatch'],
                include: [
                    {
                        model: models.User,
                        attributes: ['id', 'nickname', 'firstSurname', 'secondSurname', 'picUrl'],
                        as: 'userMatch'
                    },
                    {
                        model: models.User,
                        attributes: ['id', 'nickname', 'firstSurname', 'secondSurname', 'picUrl'],
                        as: 'userMatched'
                    }
                ]
            });

            return new QuerySuccess(matchedUsers, 'Se han obtenido los amigos correctamente.', matchedUsers);
        } catch (e) {
            console.warn(e)
            return new QueryError(false, e)
        }
    };

    static getMatchedUsersIds = async (userWhoMatched) => {
        try {
            const matchedUsers = await models.Match.findAll({
                where: {[Op.or]: [
                        {userWhoMatched: userWhoMatched},
                        {userToMatch: userWhoMatched},
                    ]
                },
                attributes: ['userWhoMatched', 'userToMatch'],
                include: [
                    {
                        model: models.User,
                        attributes: ['id'],
                        as: 'userMatch'
                    },
                    {
                        model: models.User,
                        attributes: ['id'],
                        as: 'userMatched'
                    }
                ]
            });

            console.log('Matched', matchedUsers)

            return new QuerySuccess(matchedUsers, 'Se han obtenido los amigos correctamente.', matchedUsers);
        } catch (e) {
            console.warn(e)
            return new QueryError(false, e)
        }
    };
}

module.exports = FriendshipQuery