const StdResponse = require("../classes/stdResponse");
const FriendshipQuery = require("../database/query/friendship.query");
const UserQuery = require("../database/query/user.query");
const models = require("../database/models");

class FriendshipController {
    static likeUser = async (req, res) => {
        try {
            const alreadyLiked = await FriendshipQuery.checkIfIsLiked(req.payload.userId, req.params.id);

            if (alreadyLiked.query.isMatch) {
                await FriendshipQuery.likeUser(req.payload.userId, req.params.id);
                await FriendshipQuery.setMatch(req.payload.userId, req.params.id)

                return res.status(200).json(
                    new StdResponse(alreadyLiked.message,{executed: false, isMatch: true})
                )
            }

            const {message, executed, query} = await FriendshipQuery.likeUser(req.payload.userId, req.params.id);

            if (executed) {
                return res.status(200).json(
                    new StdResponse(message,{executed})
                )
            } else if (!executed && query) {
                return res.status(200).json(
                    new StdResponse(message,{executed, query})
                )
            }
        } catch (e) {
            return res.status(500).json(
                new StdResponse('Ha ocurrido un problema al insertar el like.',{executed: false, error: e.toString()})
            )
        }
    };

    static getOwnMatches = async (req, res) => {
        try {
            const userId = req.payload.userId;

            let {message, query} = await FriendshipQuery.getMatchedUsers(userId);

            const friends = [];

            query.forEach(model => {
                if (model.userMatch.id === userId) friends.push(model.userMatched)
                else if (model.userMatched.id === userId) friends.push(model.userMatch)
            });

            return res.status(200).json(
                new StdResponse(
                    message,
                    {query: friends}
                )
            )
        } catch (e) {
            return res.status(500).json(
                new StdResponse('Ha ocurrido un problema al obtener los usuarios.',{executed: false, error: e.toString()})
            )
        }
    };

    static getPossibleMatches = async (req, res) => {
        try {
            const userId = req.payload.userId;

            // 1. Obtener preferencias del usuario
            const userPreferences = await UserQuery.getUserPreferences(userId);

            if (!userPreferences.executed) return res.status(400).json(
                new StdResponse(userPreferences.error,{executed: false})
            )

            // 2. Obtener usuarios con algunos de mismos valores de preferencias de eleccion que el usuario
            let choiceAffineUsers = await UserQuery.getUsersByChoicePrefs(userPreferences.query.choices, userId);

            choiceAffineUsers = choiceAffineUsers.query.map(item => item.user);
            choiceAffineUsers = [...new Set(choiceAffineUsers)] // Haciendo un Set a partir de los valores, podemos quitar elementos repetidos.

            // 3. Obtener valores de las preferencias de valor de los usuarios obtenidos en el paso anterior

            let rangeAffineUsers = (await UserQuery.getValuesOfUserRangePrefs(choiceAffineUsers)).query;

            // 4. Obtener las preferencias cuyos valores se acerquen los valores minimo y maximo de preferencias de rango del usuario.

            // Al utilizar reduce, podemos iterar sobre el array y descartar los valores que no sean el que queremos de forma sencilla.
            const userMaxPreferenceValue = userPreferences.query.values.reduce((previous, current) =>
                previous && previous.value > current.value ? previous : current
            ).value;

            const userMinPreferenceValue = userPreferences.query.values.reduce((previous, current) =>
                previous && previous.value < current.value ? previous : current
            ).value;

            // Estas serán las preferencias que se tendrán en cuenta a la hora de buscar usuarios (los usuarios dentro de rangeAffineUsers).
            // Se tendrán en cuenta las preferencias que estén en un rango de afinidad del 30% con el usuario.
            const userMaxPreferences = userPreferences.query.values.filter(item => item.value > userMaxPreferenceValue * 0.85);
            const userMinPreferences = userPreferences.query.values.filter(item => item.value < userMinPreferenceValue * 1.15);

            // 5. Obtener los IDs de los usuarios cuyos valores de preferencia se acerquen a las de userMaxPreferences y userMinPreferences.

            let matchableUserIds = [];
            // Borramos las preferencias repetidas, introduciendolas en un map.
            const preferencesForFind = new Map([...userMaxPreferences, ...userMinPreferences].map(item => [item.preference, item.value]));

            // Filtramos según los usuarios tengan los mismos valores de preferencias, con un rango del 35%
            preferencesForFind.forEach((value, preference) => {
                rangeAffineUsers.forEach(user => {
                    const matchedPreference = user.preferences.find(prefItem => prefItem.preference === preference && (prefItem.value > value * 0.65 && prefItem.value < value * 1.35))

                    if (matchedPreference) matchableUserIds.push(user.user)
                });
            });

            // Si no hay resultados, filtramos con un rango del 65%

            if (matchableUserIds.length === 0) {
                preferencesForFind.forEach((value, preference) => {
                    rangeAffineUsers.forEach(user => {
                        const matchedPreference = user.preferences.find(prefItem => prefItem.preference === preference && (prefItem.value > value * 0.45 && prefItem.value < value * 1.65))

                        if (matchedPreference) matchableUserIds.push(user.user)
                    });
                });
            }

            // Filtramos para quitar a los que ya se han dado like
            const alreadyLikedUsers = await models.Friendship.findAll({
                where: {requesting_user: userId},
                attributes: ['requested_user']
            })

            const alreadyLikedIds = alreadyLikedUsers.map(user => user.requested_user)

            matchableUserIds = matchableUserIds.filter(user => !alreadyLikedIds.includes(user))

            const {message, query} = await UserQuery.getUsersById(matchableUserIds)

            return res.status(200).json(
                new StdResponse(message,{executed: query !== null, query})
            )
        } catch (e) {
            return res.status(203).json(
                new StdResponse('Ha ocurrido un problema al obtener los matches',{executed: false, error: e.message})
            )
        }
    };
}

module.exports = FriendshipController