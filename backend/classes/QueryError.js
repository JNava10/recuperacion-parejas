class QueryError {
    constructor(executed, error) {
        this.executed = executed;
        this.error = error;
    }
}

module.exports = QueryError