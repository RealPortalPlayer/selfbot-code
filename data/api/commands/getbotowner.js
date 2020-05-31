const {get} = require("quick.db")

const {settings} = require(`../settings/botsettings`)

function getBotOwner(id) {
    if (settings.protectedOwners.includes(id)) return {
        "botOwner": true,
        "protected": true,
        "reason": "",
        "by": {
            "username": "No One",
            "discriminator": "0000",
            "id": "0"
        }
    }
    else if (get(`ownerIDs.${id}`)) return get(`ownerIDs.${id}`)
    return  {
        "botOwner": false,
        "protected": false,
        "reason": "",
        "by": {
            "username": "",
            "discriminator": "",
            "id": ""
        }
    }
}

module.exports.getBotOwner = getBotOwner