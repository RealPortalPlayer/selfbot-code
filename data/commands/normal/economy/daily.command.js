const {basename} = require("path")

const {convertTime} = require("../../../api/time/converttime")
const {createEmbed} = require("../../../api/embed/createembed")
const {getCash, setCash} = require("../../../api/economy/getcash")
const {getBotOwner} = require("../../../api/commands/getbotowner")

class Command {
    constructor() {
        this.name = basename(__filename.split(".")[0])
        this.altNames = []
        this.description = "Make Money Daily"
        this.arguments = [""]
        this.userPermission = "SEND_MESSAGES"
        this.botPermission = "SEND_MESSAGES"
        this.dms = true
        this.enabled = true
        this.botOwnerOnly = false
        this.supportGuildOnly = false
        this.time = convertTime(24, "hours")
        this.example = ""
    }

    run(bot, msg, args) {
        return new Promise(resolve => {
            if (getBotOwner(msg.author.id).botOwner || getCash(msg.author.id).daily.last && getCash(msg.author.id).daily.last + convertTime(24, "hours") === Date.now()) {    
                msg.channel.send(createEmbed(msg, bot, false, `You would have got 1000 dollars, but since you ran this command yesterday, I multiplied it by ${getCash(msg.author.id).daily.streak}, so you now have ${getCash(msg.author.id).hand + 1000 * getCash(msg.author.id).daily.streak}.`))

                setCash(msg.author.id, getCash(msg.author.id).hand + 1000 * getCash(msg.author.id).daily.streak + 1, getCash(msg.author.id).bank, getCash(msg.author.id).bought, Date.now(), getCash(msg.author.id).daily.streak + 1)
            } else if (getCash(msg.author.id).daily.last !== 0) {    
                msg.channel.send(createEmbed(msg, bot, false, `You got 1000 dollars, so you now have ${ getCash(msg.author.id).hand + 1000}, sadly you lost your ${getCash(msg.author.id).daily.streak} streak.`))

                setCash(msg.author.id, getCash(msg.author.id).hand + 1000, getCash(msg.author.id).bank, getCash(msg.author.id).bought, Date.now(), 1)
            } else {    
                msg.channel.send(createEmbed(msg, bot, false, `You got 1000 dollars, so you now have ${getCash(msg.author.id).hand + 1000}.`))

                setCash(msg.author.id, getCash(msg.author.id).hand + 1000, getCash(msg.author.id).bank, getCash(msg.author.id).bought, Date.now(), 1)
            }

            resolve()
        })
    }
}

module.exports.Command = Command