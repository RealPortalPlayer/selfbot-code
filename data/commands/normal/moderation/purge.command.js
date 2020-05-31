const {basename} = require("path")

const {convertTime} = require("../../../api/time/converttime")
const {settings} = require("../../../api/settings/botsettings")
const {createEmbed} = require("../../../api/embed/createembed")

class Command {
    constructor() {
        this.name = basename(__filename.split(".")[0])
        this.altNames = []
        this.description = "Small test command (will be disabled soon)"
        this.arguments = ["<channel/user/none> <id/ping/name> <amount>"]
        this.userPermission = "MANAGE_MESSAGES"
        this.botPermission = "MANAGE_MESSAGES"
        this.dms = true
        this.enabled = false
        this.botOwnerOnly = true
        this.supportGuildOnly = false
        this.time = convertTime(settings.cooldown.time, settings.cooldown.type)
        this.example = ""
    }

    run(bot, msg, args) {
        return new Promise(resolve => {
            resolve()
        })
    }
}

module.exports.Command = Command