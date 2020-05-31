const {basename} = require("path")

const {convertTime} = require("../../../api/time/converttime")
const {settings} = require("../../../api/settings/botsettings")
const {createEmbed} = require("../../../api/embed/createembed")
const {getCash} = require("../../../api/economy/getcash")
const {getUser} = require("../../../api/arguments/getuser")

class Command {
    constructor() {
        this.name = basename(__filename.split(".")[0])
        this.altNames = ["balance"]
        this.description = "Check how Much Cash you Have"
        this.arguments = ["[id/ping/name]"]
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
        return new Promise((resolve, reject) => {
            if (!args[0]) {
                msg.channel.send(createEmbed(msg, bot, false, "", {
                    "On Hand": [getCash(msg.author.id).hand, true],
                    "On Bank": [getCash(msg.author.id).bank, true]
                }))

                resolve()
            } else {
                const user = msg.mentions.members.first()

                if (user) {
                    const member = msg.guild.member(user)

                    if (member) {
                        msg.channel.send(createEmbed(msg, bot, false, "", {
                            "On Hand": [getCash(member.user.id).hand, true],
                            "On Bank": [getCash(member.user.id).bank, true]
                        }))

                        resolve()
                    } else {
                        msg.channel.send(createEmbed(msg, bot, false, "I was unable to find the user you specified."))

                        reject("User not found")
                    }
                } else {
                    getUser(args[0], msg, bot).then(member => {
                        msg.channel.send(createEmbed(msg, bot, false, "", {
                            "On Hand": [getCash(member.user.id).hand, true],
                            "On Bank": [getCash(member.user.id).bank, true]
                        }))

                        resolve()
                    }).catch(code => {
                        if (code === 404) {
                            msg.channel.send(createEmbed(msg, bot, false, "I was unable to find the user you specified."))

                            reject("User was not found")
                        } else if (code === 400) {
                            msg.channel.send(createEmbed(msg, bot, false, "You either specified something that wasn't a number, or you specified a number outside the list."))
                        
                            reject("Invalid argument")
                        } else if (code === 408) {
                            msg.channel.send(createEmbed(msg, bot, false, "You waited too long, please try again."))
                        
                            reject("Timed out")
                        } else if (code === 413) {
                            msg.channel.send(createEmbed(msg, bot, false, "We found more than one user, however, there was too many to list. Please be more specific."))
                        
                            reject("Too many users")
                        } else {
                            console.log(code)
                            msg.channel.send(createEmbed(msg, bot, false, "Unknown error detected, please try again."))

                            reject("Unknown error")
                        }
                    })
                }
            }
        })
    }
}

module.exports.Command = Command