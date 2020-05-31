const {basename} = require("path")

const {convertTime} = require("../../../api/time/converttime")
const {settings} = require("../../../api/settings/botsettings")
const {createEmbed} = require("../../../api/embed/createembed")
const {getUser} = require("../../../api/arguments/getuser")

class Command {
    constructor() {
        this.name = basename(__filename.split(".")[0])
        this.altNames = []
        this.description = "Remove Disruptive People"
        this.arguments = ["<id/ping/name>", "[reason]"]
        this.userPermission = "KICK_MEMBERS"
        this.botPermission = "KICK_MEMBERS"
        this.dms = false
        this.enabled = true
        this.botOwnerOnly = false
        this.supportGuildOnly = false
        this.time = convertTime(settings.cooldown.time, settings.cooldown.type)
        this.example = `${settings.normalPrefix}${this.name} Discord being a meany :(`
    }

    run(bot, msg, args) {
        return new Promise((resolve, reject) => {
            const user = msg.mentions.members.first()

            if (user) {
                const member = msg.guild.member(user)

                if (member) {
                    if (member.kickable) {
                        const reason = args.slice(1).join(" ").trim() ? args.slice(1).join(" ").trim() : "Not specifed."

                        if (member.user.bot) msg.channel.send(createEmbed(msg, bot, false, `Successfully kicked \`${member.user.username}#${member.user.discriminator} (${member.user.id})\` for \`${reason}${!reason.endsWith(".") ? "." : ""}\`, however, they're a bot, so I can't DM them.`))
                        else {
                            member.send(createEmbed(msg, bot, false, `You were kicked from \`${msg.guild.name}\` by \`${msg.author.username}#${msg.author.discriminator} (${msg.author.id})\` for \`${reason}${!reason.endsWith(".") ? "." : ""}\``)).then(() => {
                                msg.channel.send(createEmbed(msg, bot, false, `Successfully kicked \`${member.user.username}#${member.user.discriminator} (${member.user.id})\` for \`${reason}${!reason.endsWith(".") ? "." : ""}\``))
                            }).catch(() => {
                                msg.channel.send(createEmbed(msg, bot, false, `Successfully kicked \`${member.user.username}#${member.user.discriminator} (${member.user.id})\` for \`${reason}${!reason.endsWith(".") ? "." : ""}\`, however, I failed to DM them.`))
                            })
                        }

                        member.kick(`${msg.author.name}#${msg.author.discriminator} (${msg.author.id}) - ${reason}`)

                        resolve()
                    } else {
                        msg.channel.send(createEmbed(msg, bot, false, "I'm not allowed to kick that user."))

                        reject("User not kickable")
                    }
                } else {
                    msg.channel.send(createEmbed(msg, bot, false, "I was unable to find the user you specified."))

                    reject("User not found")
                }
            } else {
                getUser(args[0], msg, bot).then(member => {
                    if (member.kickable) {
                        const reason = args.slice(1).join(" ").trim() ? args.slice(1).join(" ").trim() : "Not specifed."

                        if (member.user.bot) msg.channel.send(createEmbed(msg, bot, false, `Successfully kicked \`${member.user.username}#${member.user.discriminator} (${member.user.id})\` for \`${reason}${!reason.endsWith(".") ? "." : ""}\`, however, they're a bot, so I can't DM them.`))
                        else {
                            member.send(createEmbed(msg, bot, false, `You were kicked from \`${msg.guild.name}\` by \`${msg.author.username}#${msg.author.discriminator} (${msg.author.id})\` for \`${reason}${!reason.endsWith(".") ? "." : ""}\``)).then(() => {
                                msg.channel.send(createEmbed(msg, bot, false, `Successfully kicked \`${member.user.username}#${member.user.discriminator} (${member.user.id})\` for \`${reason}${!reason.endsWith(".") ? "." : ""}\``))
                            }).catch(() => {
                                msg.channel.send(createEmbed(msg, bot, false, `Successfully kicked \`${member.user.username}#${member.user.discriminator} (${member.user.id})\` for \`${reason}${!reason.endsWith(".") ? "." : ""}\`, however, I failed to DM them.`))
                            })
                        }

                        member.kick(`${msg.author.name}#${msg.author.discriminator} (${msg.author.id}) - ${reason}`)

                        resolve()
                    } else {
                        msg.channel.send(createEmbed(msg, bot, false, "I'm not allowed to kick that user."))

                        reject("User not kickable")
                    }
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
        })
    }
}

module.exports.Command = Command