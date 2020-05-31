const {basename} = require("path")

const {convertTime} = require("../../../api/time/converttime")
const {settings} = require("../../../api/settings/botsettings")
const {createEmbed} = require("../../../api/embed/createembed")
const {getUser} = require("../../../api/arguments/getuser")

class Command {
    constructor() {
        this.name = basename(__filename.split(".")[0])
        this.altNames = []
        this.description = "Get Info About Anyone"
        this.arguments = ["[id/ping/name]"]
        this.userPermission = "SEND_MESSAGES"
        this.botPermission = "SEND_MESSAGES"
        this.dms = true
        this.enabled = true
        this.botOwnerOnly = false
        this.supportGuildOnly = false
        this.time = convertTime(settings.cooldown.time, settings.cooldown.type)
        this.example = `${settings.normalPrefix}${this.name} Discord`
    }

    run(bot, msg, args) {
        return new Promise((resolve, reject) => {
            let payload

            if (args[0]) {
                const user = msg.mentions.users.first()

                if (user) {
                    let member

                    if (msg.channel.type === "text") member = msg.guild.member(user)
                    else member = user

                    if (member) {
                        if (msg.channel.type === "text") {
                            payload = {
                                "Username": [member.user.username, true],
                                "Discriminator": [member.user.discriminator, true],
                                "ID": [member.user.id, true],
                                "Nickname": [member.nickname ? member.nickname : "None", true],
                                "Join Date": [member.user.joinedAt, true],
                                "Avatar Link": [`[Avatar URL](${member.user.avatarURL()})`, true],
                                "Roles": ["", true],
                                "Created On": [member.user.createdAt, true]
                            }

                            if (member._roles.length >= 25) {
                                payload["Roles"][0] = "Too much to list."
                            } else {
                                member._roles.forEach(role => {
                                    payload["Roles"][0] += `<@&${role}>\n`
                                })
                            }
                        } else {
                            payload = {
                                "Username": [member.username, true],
                                "Discriminator": [member.discriminator, true],
                                "ID": [member.id, true],
                                "Avatar Link": [`[Avatar URL](${member.avatarURL()})`, true],
                                "Created On": [member.createdAt, true]
                            }
                        }
                        
                        msg.channel.send(createEmbed(msg, bot, false, "", payload))

                        resolve()
                    } else {
                        msg.channel.send(createEmbed(msg, bot, false, "I was unable to find the user you specified."))

                        reject("User not found")
                    }
                } else {
                    getUser(args[0], msg, bot).then(member => {
                        if (msg.channel.type === "text") {
                            payload = {
                                "Username": [member.user.username, true],
                                "Discriminator": [member.user.discriminator, true],
                                "ID": [member.user.id, true],
                                "Nickname": [user.nickname ? user.nickname : "None", true],
                                "Join Date": [member.user.joinedAt, true],
                                "Avatar Link": [`[Avatar URL](${member.user.avatarURL()})`, true],
                                "Roles": ["", true],
                                "Created On": [member.user.createdAt(), true]
                            }

                            if (user._roles.length >= 25) {
                                payload["Roles"][0] = "Too much to list."
                            } else {
                                user._roles.forEach(role => {
                                    payload["Roles"][0] += `<@&${role}>\n`
                                })
                            }
                        } else {
                            payload = {
                                "Username": [member.user.username, true],
                                "Discriminator": [member.user.discriminator, true],
                                "ID": [member.user.id, true],
                                "Avatar Link": [`[Avatar URL](${member.user.avatarURL()})`, true],
                                "Created On": [member.user.createdAt, true]
                            }
                        }

                        msg.channel.send(createEmbed(msg, bot, false, "", payload))

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
            } else {
                if (msg.channel.type === "text") {
                    payload = {
                        "Username": [msg.author.username, true],
                        "Discriminator": [msg.author.discriminator, true],
                        "ID": [msg.author.id, true],
                        "Nickname": [msg.member.nickname ? msg.member.nickname : "None", true],
                        "Join Date": [msg.member.joinedAt, true],
                        "Avatar Link": [`[Avatar URL](${msg.author.avatarURL()})`, true],
                        "Roles": ["", true],
                        "Created On": [msg.author.createdAt, true]
                    }

                    if (msg.member._roles.length >= 25) {
                        payload["Roles"][0] = "Too much to list."
                    } else {
                        msg.member._roles.forEach(role => {
                            payload["Roles"][0] += `<@&${role}>\n`
                        })
                    }
                } else {
                    payload = {
                        "Username": [msg.author.username, true],
                        "Discriminator": [msg.author.discriminator, true],
                        "ID": [msg.author.id, true],
                        "Avatar Link": [`[Avatar URL](${msg.author.avatarURL()})`, true],
                        "Created On": [msg.author.createdAt, true]
                    }
                }

                msg.channel.send(createEmbed(msg, bot, false, "", payload))

                resolve()
            }
        })
    }
}

module.exports.Command = Command