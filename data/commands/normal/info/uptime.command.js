const {basename} = require("path")

const {convertTime} = require("../../../api/time/converttime")
const {settings} = require("../../../api/settings/botsettings")
const {createEmbed} = require("../../../api/embed/createembed")

class Command {
    constructor() {
        this.name = basename(__filename.split(".")[0])
        this.description = "See how long i've been up."
        this.arguments = [""]
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
        msg.channel.send(createEmbed(`I've stayed up since \`${bot.startedOn}\``, {}, "", ""))
    }
}

module.exports.Command = Command