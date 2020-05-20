const {basename} = require("path")
const {set} = require("quick.db")

const {getUser} = require("../../../api/arguments/getuser")
const {createEmbed} = require("../../../api/embed/createembed")
const {settings} = require("../../../api/settings/botsettings")
const {isBotOwner} = require("../../../api/commands/isbotowner")
const {log} = require("../../../api/guild/log")

class Command {
    constructor() {
        this.name = basename(__filename.split(".")[0])
        this.description = "Used for debuging commands."
        this.arguments = ["<add/status/remove>", "<id/ping/name>"]
        this.enabled = true
        this.example = `${settings.managePrefix}${this.name} add `
    }

    run(bot, msg, args) {
        const user = msg.mentions.members.first()
        
        if (user) {
            const member = msg.guild.member(user)

            if (member) {
                if (args[0] === "add") {
                    if (isBotOwner(member.user.id)[0]) msg.channel.send(createEmbed("This user is already a owner."))
                    else if (member.user.bot) msg.channel.send(createEmbed("This user is a bot."))
                    else {
                        set(`ownerIDs.${msg.author.id}`, true)
                        log(bot, createEmbed("Added new bot owner.", {
                            "Username": [member.user.username, true],
                            "Discriminator": [member.user.discriminator, true],
                            "ID": [member.user.id, true],
                            "Who added them": [msg.author.username, true],
                            "Their Discriminator": [msg.author.discriminator, true],
                            "Their ID": [msg.author.id, true]
                        }))
                        msg.channel.send(createEmbed("This user is now a bot owner."))
                    }
                } else if (args[0] === "status") {
                    if (isBotOwner(member.user.id)[0]) msg.channel.send(createEmbed("This user is a bot owner."))
                    else if (member.user.bot) msg.channel.send(createEmbed("This user is a bot."))
                    else msg.channel.send(createEmbed("This user is not a bot owner."))
                } else if (args[0] === "remove") {
                    if (isBotOwner(member.user.id)[0]) {
                        if (isBotOwner(member.user.id)[1]) msg.channel.send(createEmbed("This user is protected."))
                        else if (member.user.bot) msg.channel.send(createEmbed("This user is a bot."))
                        else {
                            set(`ownerIDs.${msg.author.id}`, false)
                            log(bot, createEmbed("Removed a bot owner.", {
                                "Username": [member.user.username, true],
                                "Discriminator": [member.user.discriminator, true],
                                "ID": [member.user.id, true],
                                "Who removed them": [msg.author.username, true],
                                "Their Discriminator": [msg.author.discriminator, true],
                                "Their ID": [msg.author.id, true]
                            }))
                            msg.channel.send(createEmbed("This user is no longer a bot owner."))
                        }
                    }
                } else msg.channel.send("Invalid argument detected.")
            } else msg.channel.send(createEmbed("I was unable to find the user you specified."))
        } else {
            getUser(args[1], msg).then(user => {
                if (args[0] === "add") {
                    if (isBotOwner(user.userID)[0]) msg.channel.send(createEmbed("This user is already a owner."))
                    else if (user.bot) msg.channel.send(createEmbed("This user is a bot."))
                    else {
                        set(`ownerIDs.${user.userID}`, true)
                        log(bot, createEmbed("Added new bot owner.", {
                            "Username": [user.username, true],
                            "Discriminator": [user.discriminator, true],
                            "ID": [user.userID, true],
                            "Who added them": [msg.author.username, true],
                            "Their Discriminator": [msg.author.discriminator, true],
                            "Their ID": [msg.author.id, true]
                        }))
                        msg.channel.send(createEmbed("This user is now a bot owner."))
                    }
                } else if (args[0] === "status") {
                    if (isBotOwner(user.userID)[0]) msg.channel.send(createEmbed("This user is a bot owner."))
                    else if (user.bot) msg.channel.send(createEmbed("This user is a bot."))
                    else msg.channel.send(createEmbed("This user is not a bot owner."))
                } else if (args[0] === "remove") {
                    if (isBotOwner(user.userID)[0]) {
                        if (isBotOwner(user.userID)[1]) msg.channel.send(createEmbed("This user is protected."))
                        else if (user.bot) msg.channel.send(createEmbed("This user is a bot."))
                        else {
                            set(`ownerIDs.${user.userID}`, false)
                            log(bot, createEmbed("Removed a bot owner.", {
                                "Username": [user.username, true],
                                "Discriminator": [user.discriminator, true],
                                "ID": [user.userID, true],
                                "Who removed them": [msg.author.username, true],
                                "Their Discriminator": [msg.author.discriminator, true],
                                "Their ID": [msg.author.id, true]
                            }))
                            msg.channel.send(createEmbed("This user is no longer a bot owner."))
                        }
                    }
                } else msg.channel.send("Invalid argument detected.")
            }).catch(code => {
                if (code === 404) {
                    msg.channel.send(createEmbed("I was unable to find the user you specified."))
                } else if (code === 400) {
                    msg.channel.send(createEmbed("You either specified something that wasn't a number, or you specified a number outside the list."))
                } else if (code === 408) {
                    msg.channel.send(createEmbed("You waited too long, please try again."))
                } else if (code === 413) {
                    msg.channel.send(createEmbed("We found more than one user, however, there was too many to list. Please be more specific."))
                } else {
                    console.log(code)
                    msg.channel.send(createEmbed("Unknown error detected, please try again."))
                }
            })
        }
    }
}

module.exports.Command = Command