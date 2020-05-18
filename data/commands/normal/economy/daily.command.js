const {basename} = require("path")

const {convertTime} = require(`../../../api/time/converttime`)
const {settings} = require(`../../../api/settings/botsettings`)

class Command {
    constructor() {
        this.name = basename(__filename.split(".")[0])
        this.description = "Gives you money."
        this.arguments = ""
        this.userPermission = "SEND_MESSAGES"
        this.botPermission = "SEND_MESSAGES"
        this.dms = true
        this.enabled = true
        this.botOwnerOnly = false
        this.supportGuildOnly = false
        this.time = convertTime(24, "hours")
    }

    run(bot, msg, args) {
        msg.channel.send("Act like you just got so much money (didnt implement the economy system yet oof).")
    }
}

module.exports.Command = Command