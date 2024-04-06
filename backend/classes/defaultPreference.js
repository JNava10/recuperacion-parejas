class DefaultPreference {

    /**
     *
     * @param {string} name
     * @param {string} description
     * @param {string[]} options
     */
    constructor(name, description, options = []) {
        this.name = name;
        this.description = description;
        this.options = options;
    }
}

module.exports = DefaultPreference