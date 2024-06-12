class UserSeed {
    constructor(name, firstSurname, secondSurname, nickname, password, picUrl, email, roles = null) {
        this.name = name;
        this.first_surname = firstSurname;
        this.second_surname = secondSurname;
        this.nickname = nickname;
        this.password = password;
        this.pic_url = picUrl;
        this.enabled = true
        this.email = email.toLowerCase();
        this.created_at = new Date();
        this.updated_at = new Date();
    }
}

module.exports = UserSeed;