class StdResponse {
    /**
     *
     * @param {String} message
     * @param {Object} data
     */
    constructor(message, data) {
        this.message = message;
        this.data = data;
    }
}

module.exports = StdResponse