const {get} = require("quick.db")

const {settings} = require(`../settings/botsettings`)

function isBotOwner(id) {
    if (settings.protectedOwners.includes(id)) return [true, true]
    else if (get(`ownerIDs.${id}`)) return [true, false]
    return [false, false]
}

module.exports.isBotOwner = isBotOwner