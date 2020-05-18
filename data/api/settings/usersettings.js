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

const definitions = {
    "prefix": "The character that calls the bot.",
    "roles": "Roles that the bot can use.",
    "bannedWords": "Any words users can't say.",
    "warnsUntilMute": "How many warns a user can get before getting muted (-1 means disabled.)",
    "preventInvites": "Prevent users from posting discord invites."
}

module.exports.userSettings = userSettings
module.exports.definitions = definitions