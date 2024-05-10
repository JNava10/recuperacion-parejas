class QuerySuccess {
    constructor(executed, message, query = null) {
        this.executed = executed;
        this.message = message;
        this.query = query;
    }
}

module.exports = QuerySuccess