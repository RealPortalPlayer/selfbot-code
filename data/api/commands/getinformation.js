const {get} = require("quick.db")

const {getBotOwner} = require("./getbotowner")
const {getBlacklisted} = require("./getblacklisted")

function getInformation(id) {
    if (get(`information.${id}`)) return get(`information.${id}`)
    else return {
        "owner": getBotOwner(id).botOwner,
        "protected": getBotOwner(id).protected,
        "blacklisted": getBlacklisted(id).blacklisted,
        "everDemoted": getBotOwner(id).reason ? true : false,
        "everBlacklisted": getBlacklisted(id).reason ? true : false,
        "commandsRanCount": 0,
        "commandsRan": ["None - N/A"],
        "latestCommand": "None",
        "latestCommandOn": "N/A"
    }
}

module.exports.getInformation = getInformation