class Preference {
    constructor(name, description = "") {
        this.name = name;
        this.description = description;
        this.created_at = new Date();
        this.updated_at = new Date();
        this.deleted_at = new Date();
    }
}

module.exports = Preference