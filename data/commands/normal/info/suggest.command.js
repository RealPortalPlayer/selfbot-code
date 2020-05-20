const {basename} = require("path")

const {convertTime} = require("../../../api/time/converttime")
const {settings} = require("../../../api/settings/botsettings")
const {createEmbed} = require("../../../api/embed/createembed")
const {suggest} = require("../../../api/guild/log")

class Command {
    constructor() {
        this.name = basename(__filename.split(".")[0])
        this.description = "Tell us to add something."
        this.arguments = ["<description>"]
        this.userPermission = "SEND_MESSAGES"
        this.botPermission = "SEND_MESSAGES"
        this.dms = true
        this.enabled = true
        this.botOwnerOnly = false
        this.supportGuildOnly = false
        this.time = convertTime(settings.cooldown.time, settings.cooldown.type)
        this.example = `${settings.normalPrefix}${this.name} Add the ${this.name} command.`
    }

    run(bot, msg, args) {
        suggest(bot, createEmbed("New suggestion!", {
            "Message": [args.join(" "), true],
            "Username": [msg.author.username, true],
			"Discriminator": [msg.author.discriminator, true],
			"ID": [msg.author.id, true]
        }))
        msg.channel.send(createEmbed("Your suggestion has been sent!", {}, "", "", ["New features incoming.", "Feature creep.", "Not a bad suggestion.", "Why didn't I think of that?"]))
    }
}

module.exports.Command = Command