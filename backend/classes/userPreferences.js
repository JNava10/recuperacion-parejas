class UserPreference {

    /**
     *
     * @param {Number} userId
     * @param {Number} preferenceId
     * @param {Number} value
     */
    constructor(userId, preferenceId, value) {
        this.user = userId;
        this.preference = preferenceId;
        this.value = value
    }
}

module.exports = UserPreference