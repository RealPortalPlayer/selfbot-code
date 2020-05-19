const {basename} = require("path")

const {convertTime} = require("../../../api/time/converttime")
const {settings} = require("../../../api/settings/botsettings")
const {createEmbed} = require("../../../api/embed/createembed")
const {bug} = require("../../../api/guild/log")

class Command {
    constructor() {
        this.name = basename(__filename.split(".")[0])
        this.description = "Small test command (will be disabled soon)"
        this.arguments = ["<description>"]
        this.userPermission = "SEND_MESSAGES"
        this.botPermission = "SEND_MESSAGES"
        this.dms = true
        this.enabled = true
        this.botOwnerOnly = false
        this.supportGuildOnly = false
        this.time = convertTime(settings.cooldown.time, settings.cooldown.type)
        this.example = `${settings.normalPrefix}${this.name} the ${this.name} command doesn't work.`
    }

    run(bot, msg, args) {
        bug(bot, createEmbed("New bug report!", {
            "Message": [args.join(" "), true],
            "Username": [msg.author.username, true],
			"Discriminator": [msg.author.discriminator, true],
			"ID": [msg.author.id, true]
        }))
        msg.channel.send(createEmbed("Your bug report has been sent!", {}, "", "", ["Bug command has a bug.", "Buggy?", "Bugged out!", "Crashed while sending. :("]))
    }
}

module.exports.Command = Command