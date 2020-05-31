const {get} = require("quick.db")

function getBlacklisted(id) {
    if (get(`blacklisted.${id}`)) return get(`blacklisted.${id}`)
    else return {
        "blacklisted": false,
        "reason": "",
        "by": {
            "username": "",
            "discriminator": "",
            "id": ""
        }
    }
}

module.exports.getBlacklisted = getBlacklisted