const {basename} = require("path")
const {set} = require("quick.db")

const {getUser} = require("../../../api/arguments/getuser")
const {createEmbed} = require("../../../api/embed/createembed")
const {settings} = require("../../../api/settings/botsettings")
const {getBlacklisted} = require("../../../api/commands/getblacklisted")
const {getBotOwner} = require("../../../api/commands/getbotowner")
const {log} = require("../../../api/guild/log")

class Command {
    constructor() {
        this.name = basename(__filename.split(".")[0])
        this.description = "Blacklist Abusers"
        this.arguments = ["<add/status/remove>", "<id/ping/name>", "[reason]"]
        this.enabled = true
        this.example = `${settings.managePrefix}${this.name} add Discord spamming commands >:(`
    }

    run(bot, msg, args) {
        return new Promise((resolve, reject) => {
            const user = msg.mentions.members.first()
        
            if (user) {
                const member = msg.guild.member(user)

                if (member) {
                    if (args[0] === "add") {
                        if (getBlacklisted(member.user.id).blacklisted) {
                            msg.channel.send(createEmbed(msg, bot, false, "This user is already blacklisted."))

                            reject("User is already blacklisted")
                        } else if (member.user.bot) {
                            msg.channel.send(createEmbed(msg, bot, false, "This user is a bot."))

                            reject("User is a bot")
                        } else if (getBotOwner(member.user.id).protected) {
                            msg.channel.send(createEmbed(msg, bot, false, "This user is protected."))

                            reject("User is protected")
                        } else {
                            const reason = args.slice(2).join(" ").trim() ? args.slice(2).join(" ").trim() : "Not specifed."

                            set(`blacklisted.${member.user.id}`, {
                                "blacklisted": true,
                                "reason": reason,
                                "by": {
                                    "username": msg.author.username,
                                    "discriminator": msg.author.discriminator,
                                    "id": msg.author.id
                                }
                            })

                            bot.users.cache.get(member.user.id).send(createEmbed(msg, bot, false, `You were blacklisted by \`${msg.author.username}#${msg.author.discriminator} (${msg.author.id})\` for \`${reason}${!reason.endsWith(".") ? "." : ""}\``)).catch(() => {})

                            if (getBotOwner(member.user.id).botOwner) {
                                set(`ownerIDs.${member.user.id}`,  {
                                    "botOwner": false,
                                    "protected": false,
                                    "reason": reason,
                                    "by": {
                                        "username": msg.author.username,
                                        "discriminator": msg.author.discriminator,
                                        "id": msg.author.id
                                    }
                                })

                                log(bot, createEmbed(msg, bot, true, "Added a blacklist.", {
                                    "Username": [member.user.username, true],
                                    "Discriminator": [member.user.discriminator, true],
                                    "Reason": [reason, true],
                                    "ID": [member.user.id, true],
                                    "Who Added Them": [msg.author.username, true],
                                    "Their Discriminator": [msg.author.discriminator, true],
                                    "Their ID": [msg.author.id, true]
                                }))

                                log(bot, createEmbed(msg, bot, true, "Removed a bot owner.", {
                                    "Username": [member.user.username, true],
                                    "Discriminator": [member.user.discriminator, true],
                                    "Reason": [reason, true],
                                    "ID": [member.user.id, true],
                                    "Who Removed Them": [msg.author.username, true],
                                    "Their Discriminator": [msg.author.discriminator, true],
                                    "Their ID": [msg.author.id, true]
                                }))

                                msg.channel.send(createEmbed(msg, bot, false, "This user is no longer an bot owner, and is now blacklisted."))
                            } else {
                                log(bot, createEmbed(msg, bot, true, "Added a blacklist.", {
                                    "Username": [member.user.username, true],
                                    "Discriminator": [member.user.discriminator, true],
                                    "ID": [member.user.id, true],
                                    "Who Added Them": [msg.author.username, true],
                                    "Their Discriminator": [msg.author.discriminator, true],
                                    "Their ID": [msg.author.id, true]
                                }))

                                msg.channel.send(createEmbed(msg, bot, false, "This user is now blacklisted."))
                            }

                            resolve()
                        }
                    } else if (args[0] === "status") {
                        if (getBlacklisted(member.user.id).blacklisted) {
                            msg.channel.send(createEmbed(msg, bot, false, "Heres your information.", {
                                "Blacklisted": [true, true],
                                "Reason": [getBlacklisted(member.user.id).reason, true],
                                "Who Added Them": [getBlacklisted(member.user.id).by.username, true],
                                "Their Discriminator": [getBlacklisted(member.user.id).by.discriminator, true],
                                "Their ID": [getBlacklisted(member.user.id).by.id, true]
                            }))
                        } else {
                            if (getBlacklisted(member.user.id).reason) {
                                msg.channel.send(createEmbed(msg, bot, false, "Heres your information.", {
                                    "Blacklisted": [false, true],
                                    "Reason": [getBlacklisted(member.user.id).reason, true],
                                    "Who Added Them": [getBlacklisted(member.user.id).by.username, true],
                                    "Their Discriminator": [getBlacklisted(member.user.id).by.discriminator, true],
                                    "Their ID": [getBlacklisted(member.user.id).by.id, true]
                                }))
                            } else {
                                msg.channel.send(createEmbed(msg, bot, false, "Heres your information.", {
                                    "Blacklisted": [false, true]
                                }))
                            }
                        }

                        resolve()
                    } else if (args[0] === "remove") {
                        if (!getBlacklisted(member.user.id).blacklisted) {
                            msg.channel.send(createEmbed(msg, bot, false, "This user is not blacklisted."))
                        
                            reject("User is not blacklisted")
                        } else if (member.user.bot) {
                            msg.channel.send(createEmbed(msg, bot, false, "This user is a bot."))

                            reject("User is a bot")
                        } else if (getBotOwner(member.user.id).protected) {
                            msg.channel.send(createEmbed(msg, bot, false, "This user is protected."))
                        
                            reject("User is protected")
                        } else {
                            set(`blacklisted.${member.user.id}`, {
                                "blacklisted": false,
                                "reason": getBlacklisted(member.user.id).reason,
                                "by": {
                                    "username": getBlacklisted(member.user.id).by.username,
                                    "discriminator": getBlacklisted(member.user.id).by.discriminator,
                                    "id": getBlacklisted(member.user.id).by.id
                                }
                            })

                            bot.users.cache.get(member.user.id).send(createEmbed(msg, bot, false, `You were unblacklisted by \`${msg.author.username}#${msg.author.discriminator} (${msg.author.id}).\``)).catch(() => {})

                            log(bot, createEmbed(msg, bot, true, "Removed a blacklist.", {
                                "Username": [member.user.username, true],
                                "Discriminator": [member.user.discriminator, true],
                                "ID": [member.user.id, true],
                                "Who Removed Them": [msg.author.username, true],
                                "Their Discriminator": [msg.author.discriminator, true],
                                "Their ID": [msg.author.id, true]
                            }))

                            msg.channel.send(createEmbed(msg, bot, false, "This user is no longer blacklisted."))

                            resolve()
                        }
                    }
                } else {
                    msg.channel.send(createEmbed(msg, bot, false, "I was unable to find the user you specified."))

                    reject("User not found")
                }
            } else {
                getUser(args[1], msg, bot).then(member => {
                    if (args[0] === "add") {
                        if (getBlacklisted(member.user.id).blacklisted) {
                            msg.channel.send(createEmbed(msg, bot, false, "This user is already blacklisted."))

                            reject("User is already blacklisted")
                        } else if (member.user.bot) {
                            msg.channel.send(createEmbed(msg, bot, false, "This user is a bot."))

                            reject("User is a bot")
                        } else if (getBotOwner(member.user.id).protected) {
                            msg.channel.send(createEmbed(msg, bot, false, "This user is protected."))

                            reject("User is protected")
                        } else {
                            const reason = args.slice(2).join(" ").trim() ? args.slice(2).join(" ").trim() : "Not specifed."

                            set(`blacklisted.${member.user.id}`, {
                                "blacklisted": true,
                                "reason": reason,
                                "by": {
                                    "username": msg.author.username,
                                    "discriminator": msg.author.discriminator,
                                    "id": msg.author.id
                                }
                            })

                            bot.users.cache.get(member.user.id).send(createEmbed(msg, bot, false, `You were blacklisted by \`${msg.author.username}#${msg.author.discriminator} (${msg.author.id})\` for \`${reason}${!reason.endsWith(".") ? "." : ""}\``)).catch(() => {})

                            if (getBotOwner(member.user.id).botOwner) {
                                set(`ownerIDs.${member.user.id}`,  {
                                    "botOwner": false,
                                    "protected": false,
                                    "reason": reason,
                                    "by": {
                                        "username": msg.author.username,
                                        "discriminator": msg.author.discriminator,
                                        "id": msg.author.id
                                    }
                                })

                                log(bot, createEmbed(msg, bot, true, "Added a blacklist.", {
                                    "Username": [member.user.username, true],
                                    "Discriminator": [member.user.discriminator, true],
                                    "Reason": [reason, true],
                                    "ID": [member.user.id, true],
                                    "Who Added Them": [msg.author.username, true],
                                    "Their Discriminator": [msg.author.discriminator, true],
                                    "Their ID": [msg.author.id, true]
                                }))

                                log(bot, createEmbed(msg, bot, true, "Removed a bot owner.", {
                                    "Username": [member.user.username, true],
                                    "Discriminator": [member.user.discriminator, true],
                                    "Reason": [reason, true],
                                    "ID": [member.user.id, true],
                                    "Who Removed Them": [msg.author.username, true],
                                    "Their Discriminator": [msg.author.discriminator, true],
                                    "Their ID": [msg.author.id, true]
                                }))

                                msg.channel.send(createEmbed(msg, bot, false, "This user is no longer an bot owner, and is now blacklisted."))
                            } else {
                                log(bot, createEmbed(msg, bot, true, "Added a blacklist.", {
                                    "Username": [member.user.username, true],
                                    "Discriminator": [member.user.discriminator, true],
                                    "ID": [member.user.id, true],
                                    "Who Added Them": [msg.author.username, true],
                                    "Their Discriminator": [msg.author.discriminator, true],
                                    "Their ID": [msg.author.id, true]
                                }))

                                msg.channel.send(createEmbed(msg, bot, false, "This user is now blacklisted."))
                            }

                            resolve()
                        }
                    } else if (args[0] === "status") {
                        if (getBlacklisted(member.user.id).blacklisted) {
                            msg.channel.send(createEmbed(msg, bot, false, "Heres your information.", {
                                "Blacklisted": [true, true],
                                "Reason": [getBlacklisted(member.user.id).reason, true],
                                "Who Added Them": [getBlacklisted(member.user.id).by.username, true],
                                "Their Discriminator": [getBlacklisted(member.user.id).by.discriminator, true],
                                "Their ID": [getBlacklisted(member.user.id).by.id, true]
                            }))
                        } else {
                            if (getBlacklisted(member.user.id).reason) {
                                msg.channel.send(createEmbed(msg, bot, false, "Heres your information.", {
                                    "Blacklisted": [false, true],
                                    "Reason": [getBlacklisted(member.user.id).reason, true],
                                    "Who Added Them": [getBlacklisted(member.user.id).by.username, true],
                                    "Their Discriminator": [getBlacklisted(member.user.id).by.discriminator, true],
                                    "Their ID": [getBlacklisted(member.user.id).by.id, true]
                                }))
                            } else {
                                msg.channel.send(createEmbed(msg, bot, false, "Heres your information.", {
                                    "Blacklisted": [false, true]
                                }))
                            }
                        }

                        resolve()
                    } else if (args[0] === "remove") {
                        if (!getBlacklisted(member.user.id).blacklisted) {
                            msg.channel.send(createEmbed(msg, bot, false, "This user is not blacklisted."))
                        
                            reject("User is not blacklisted")
                        } else if (member.user.bot) {
                            msg.channel.send(createEmbed(msg, bot, false, "This user is a bot."))

                            reject("User is a bot")
                        } else if (getBotOwner(member.user.id).protected) {
                            msg.channel.send(createEmbed(msg, bot, false, "This user is protected."))
                        
                            reject("User is protected")
                        } else {
                            set(`blacklisted.${member.user.id}`, {
                                "blacklisted": false,
                                "reason": getBlacklisted(member.user.id).reason,
                                "by": {
                                    "username": getBlacklisted(member.user.id).by.username,
                                    "discriminator": getBlacklisted(member.user.id).by.discriminator,
                                    "id": getBlacklisted(member.user.id).by.id
                                }
                            })

                            bot.users.cache.get(member.user.id).send(createEmbed(msg, bot, false, `You were unblacklisted by \`${msg.author.username}#${msg.author.discriminator} (${msg.author.id}).\``)).catch(() => {})

                            log(bot, createEmbed(msg, bot, true, "Removed a blacklist.", {
                                "Username": [member.user.username, true],
                                "Discriminator": [member.user.discriminator, true],
                                "ID": [member.user.id, true],
                                "Who Removed Them": [msg.author.username, true],
                                "Their Discriminator": [msg.author.discriminator, true],
                                "Their ID": [msg.author.id, true]
                            }))

                            msg.channel.send(createEmbed(msg, bot, false, "This user is no longer blacklisted."))

                            resolve()
                        }
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