require('dotenv').config()

class PreferenceValue {
    constructor(preference, defValue = 0) {
        this.preference = preference;
        this.min_value = process.env.DEFAULT_PREFERENCE_MIN;
        this.max_value = process.env.DEFAULT_PREFERENCE_MAX;
        this.default_value = defValue;
    }
}

module.exports = PreferenceValue