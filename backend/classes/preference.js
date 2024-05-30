class Preference {
    constructor(name, type, description = "") {
        this.name = name;
        this.type_id = type;
        this.description = description;
        this.created_at = new Date();
        this.updated_at = new Date();
    }
}

module.exports = Preference