const {basename} = require("path")

const {convertTime} = require("../../../api/time/converttime")
const {settings} = require("../../../api/settings/botsettings")
const {createEmbed} = require("../../../api/embed/createembed")

class Command {
    constructor() {
        this.name = basename(__filename.split(".")[0])
        this.altNames = []
        this.description = "Embed Anything"
        this.arguments = ["[description]", "[footer]", "[title]"]
        this.userPermission = "SEND_MESSAGES"
        this.botPermission = "SEND_MESSAGES"
        this.dms = true
        this.enabled = true
        this.botOwnerOnly = false
        this.supportGuildOnly = false
        this.time = convertTime(settings.cooldown.time, settings.cooldown.type)
        this.example = `${settings.normalPrefix}${this.name} "Warning, testing ahead." "Testing?" "A Test Embed"`
    }

    run(bot, msg, args) {
        return new Promise(resolve => {
            msg.delete()
            msg.channel.send(createEmbed(msg, bot, false, args[0] ? args[0] : "​", {}, "", args[2] ? args[2] : "", [args[1] ? args[1] : ""]))

            resolve()
        })
    }
}

module.exports.Command = Command