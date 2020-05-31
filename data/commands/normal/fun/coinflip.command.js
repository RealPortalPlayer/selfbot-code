const {basename} = require("path")

const {convertTime} = require("../../../api/time/converttime")
const {settings} = require("../../../api/settings/botsettings")
const {createEmbed} = require("../../../api/embed/createembed")

class Command {
    constructor() {
        this.name = basename(__filename.split(".")[0])
        this.altNames = []
        this.description = "Test Your Luck"
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
            if (Math.floor(Math.random() * 1000) % Math.floor(Math.random() * 10) == 0) {
                if (msg.channel.permissionsFor(bot.user).has("EMBED_LINKS")) {
                    msg.channel.send(createEmbed(msg, bot, false, "", {}, "https://cdn.discord.com/attachments/644983363685580822/667285514658775069/coinflip_heads.png", "", ["You got heads.", "A head ful of information.", "The heads."]))
                } else {
                    msg.channel.send("You got heads.")
                }
            } else {
                if (msg.channel.permissionsFor(bot.user).has("EMBED_LINKS")) {
                    msg.channel.send(createEmbed(msg, bot, false, "", {}, "https://cdn.discord.com/attachments/644983363685580822/667285516483559424/coinflip_tails.png", "", ["You got tails.", "Better luck next time. (unless you wanted tails)", "No, not Tails from sonic..."]))
                } else {
                    msg.channel.send("You got tails.")
                }
            }

            resolve()
        })
    }
}

module.exports.Command = Command