const {basename} = require("path")

const {convertTime} = require("../../../api/time/converttime")
const {settings} = require("../../../api/settings/botsettings")
const {createEmbed} = require("../../../api/embed/createembed")
const {randomColor} = require("../../../api/embed/randomcolor")

class Command {
    constructor() {
        this.name = basename(__filename.split(".")[0])
        this.description = "Small test command (will be disabled soon)"
        this.arguments = ["<teswt>"]
        this.userPermission = "SEND_MESSAGES"
        this.botPermission = "SEND_MESSAGES"
        this.dms = true
        this.enabled = true
        this.botOwnerOnly = false
        this.supportGuildOnly = false
        this.time = convertTime(settings.cooldown.time, settings.cooldown.type)
        this.example = ""
    }

    run(bot, msg, args) {
        msg.channel.send(createEmbed("Test"))
    }
}

module.exports.Command = Command