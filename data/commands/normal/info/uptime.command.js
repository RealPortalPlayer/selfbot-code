const {basename} = require("path")

const {convertTime} = require("../../../api/time/converttime")
const {settings} = require("../../../api/settings/botsettings")
const {createEmbed} = require("../../../api/embed/createembed")

class Command {
    constructor() {
        this.name = basename(__filename.split(".")[0])
        this.altNames = []
        this.description = "Tell how Long I Have Been Awake"
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
        return new Promise(resolve => {
            msg.channel.send(createEmbed(msg, bot, false, `I have stayed awake since \`${bot.startedOn}\``, {}, "", ""))
            
            resolve()
        })
    }
}

module.exports.Command = Command