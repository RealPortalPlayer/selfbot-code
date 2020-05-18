const {get} = require("quick.db")

function isBlacklisted(id) {
    if (get(`blacklisted.${id}`) && get(`blacklisted.${id}`)[0]) return true
    return false
}

module.exports.isBlacklisted = isBlacklisted