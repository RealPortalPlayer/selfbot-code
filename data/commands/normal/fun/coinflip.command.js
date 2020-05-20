const {basename} = require("path")

const {convertTime} = require("../../../api/time/converttime")
const {settings} = require("../../../api/settings/botsettings")
const {createEmbed} = require("../../../api/embed/createembed")

class Command {
    constructor() {
        this.name = basename(__filename.split(".")[0])
        this.description = "Test your luck."
        this.arguments = [""]
        this.userPermission = "SEND_MESSAGES"
        this.botPermission = "EMBED_LINKS"
        this.dms = true
        this.enabled = true
        this.botOwnerOnly = false
        this.supportGuildOnly = false
        this.time = convertTime(settings.cooldown.time, settings.cooldown.type)
        this.example = ""
    }

    run(bot, msg, args) {
        if (Math.floor(Math.random() * 1000) % Math.floor(Math.random() * 10) == 0) {
            if (msg.guild.me.hasPermission("EMBED_LINKS") && msg.guild.me.permissionsIn(msg.channel.id).has("EMBED_LINKS")) {
                msg.channel.send(createEmbed("", {}, "https://cdn.discordapp.com/attachments/644983363685580822/667285514658775069/coinflip_heads.png", "", ["You got heads.", "A head ful of information.", "The heads."]))
            } else {
                msg.channel.send(createEmbed("You got heads.", {}, "", ["A head ful of information.", "The heads."]))
            }
        } else {
            if (msg.guild.me.hasPermission("EMBED_LINKS") && msg.guild.me.permissionsIn(msg.channel.id).has("EMBED_LINKS")) {
                console.log()
                msg.channel.send(createEmbed("", {}, "https://cdn.discordapp.com/attachments/644983363685580822/667285516483559424/coinflip_tails.png", "", ["You got tails.", "Better luck next time. (unless you wanted tails)", "No, not Tails from sonic..."]))
            } else {
                msg.channel.send(createEmbed("You got tails.", {}, "", "", ["Better luck next time. (unless you wanted tails)", "No, not Tails from sonic..."]))
            }
        }
    }
}

module.exports.Command = Command