const {settings} = require("./botsettings")

const userSettings = {
    "prefix": settings.prefix,
    "roles": {
        "muted": {
            "add": [],
            "remove": []
        }
    },
    "bannedWords": [],
    "warnsUntilMute": -1,
    "preventInvites": false
}

module.exports.userSettings = userSettings