const {basename} = require("path")

const {convertTime} = require("../../../api/time/converttime")
const {settings} = require("../../../api/settings/botsettings")

class Command {
    constructor() {
        this.name = basename(__filename.split(".")[0])
        this.description = "Make me say anything!"
        this.arguments = ["<message>"]
        this.userPermission = "SEND_MESSAGES"
        this.botPermission = "SEND_MESSAGES"
        this.dms = true
        this.enabled = true
        this.botOwnerOnly = false
        this.supportGuildOnly = false
        this.time = convertTime(settings.cooldown.time, settings.cooldown.type)
        this.example = `${settings.normalPrefix}${this.name} Hello, World!`
    }

    run(bot, msg, args) {
        let message = ""

        args.join(" ").split("").forEach(arg => {
            if (arg == "@") {
                arg = arg + "​" // surprise! another invisible character
            }

            message += arg
        })

        msg.channel.send(message)
    }
}

module.exports.Command = Command