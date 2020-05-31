const {basename} = require("path")
const {set} = require("quick.db")

const {getUser} = require("../../../api/arguments/getuser")
const {createEmbed} = require("../../../api/embed/createembed")
const {settings} = require("../../../api/settings/botsettings")
const {getBotOwner} = require("../../../api/commands/getbotowner")
const {log} = require("../../../api/guild/log")
const {getBlacklisted} = require("../../../api/commands/getblacklisted")

class Command {
    constructor() {
        this.name = basename(__filename.split(".")[0])
        this.description = "Make People Owners"
        this.arguments = ["<add/status/remove>", "<id/ping/name>", "[reason]"]
        this.enabled = true
        this.example = `${settings.managePrefix}${this.name} add Discord`
    }

    run(bot, msg, args) {
        return new Promise((resolve, reject) => {
            const user = msg.mentions.members.first()
        
            if (user) {
                const member = msg.guild.member(user)

                if (member) {
                    if (args[0] === "add") {
                        if (getBotOwner(member.user.id).botOwner) {
                            msg.channel.send(createEmbed(msg, bot, false, "This user is already a owner."))

                            reject("User already a bot owner")
                        } else if (member.user.bot) {
                            msg.channel.send(createEmbed(msg, bot, false, "This user is a bot."))
                        
                            reject("User is a bot")
                        } else {
                            set(`ownerIDs.${member.user.id}`, {
                                "botOwner": true,
                                "protected": false,
                                "reason": "",
                                "by": {
                                    "username": msg.author.username,
                                    "discriminator": msg.author.discriminator,
                                    "id": msg.author.id
                                }
                            })

                            bot.users.cache.get(member.user.id).send(createEmbed(msg, bot, false, `\`${msg.author.username}#${msg.author.discriminator} (${msg.author.id})\` promoted you to bot owner.`)).catch(() => {})

                            log(bot, createEmbed(msg, bot, true, "Added a bot owner.", {
                                "Username": [member.user.username, true],
                                "Discriminator": [member.user.discriminator],
                                "ID": [member.user.id, true],
                                "Who Added Them": [msg.author.username, true],
                                "Their Discriminator": [msg.author.discriminator, true],
                                "Their ID": [msg.author.id, true]
                            }))

                            if (getBlacklisted(member.user.id).blacklisted) {
                                set(`blacklisted.${member.user.id}`, {
                                    "blacklisted": false,
                                    "reason": getBlacklisted(member.user.id).reason,
                                    "by": {
                                        "username": getBlacklisted(member.user.id).by.username,
                                        "discriminator": getBlacklisted(member.user.id).by.discriminator,
                                        "id": getBlacklisted(member.user.id).by.id
                                    }
                                })

                                log(bot, createEmbed(msg, bot, true, "Removed a blacklist.", {
                                    "Username": [member.user.username, true],
                                    "Discriminator": [member.user.discriminator, true],
                                    "ID": [member.user.id, true],
                                    "Who Removed Them": [msg.author.username, true],
                                    "Their Discriminator": [msg.author.discriminator, true],
                                    "Their ID": [msg.author.id, true]
                                }))

                                msg.channel.send(createEmbed(msg, bot, false, "This user is no longer blacklisted, and is now an bot owner."))
                            } else msg.channel.send(createEmbed(msg, bot, false, "This user is now an bot owner."))

                            resolve()
                        }
                    } else if (args[0] === "status") {
                        if (getBotOwner(member.user.id).botOwner) {
                            msg.channel.send(createEmbed(msg, bot, false, "Heres your information.", {
                                "Bot Owner": [true, true],
                                "Protected": [getBotOwner(member.user.id).protected, true],
                                "Who Added Them": [getBotOwner(member.user.id).by.username, true],
                                "Their Discriminator": [getBotOwner(member.user.id).by.discriminator, true],
                                "Their ID": [getBotOwner(member.user.id).by.id, true]
                            }))
                        } else {
                            if (getBotOwner(member.user.id).reason) {
                                msg.channel.send(createEmbed(msg, bot, false, "Heres your information.", {
                                    "Bot Owner": [false, true],
                                    "Protected": [false, true],
                                    "Reason": [getBotOwner(member.user.id).reason, true],
                                    "Who Added Them": [getBotOwner(member.user.id).by.username, true],
                                    "Their Discriminator": [getBotOwner(member.user.id).by.discriminator, true],
                                    "Their ID": [getBotOwner(member.user.id).by.id, true]
                                }))
                            } else {
                                msg.channel.send(createEmbed(msg, bot, false, "Heres your information.", {
                                    "Bot Owner": [false, true],
                                    "Protected": [false, true]
                                }))
                            }
                        }

                        resolve()
                    } else if (args[0] === "remove") {
                        if (getBotOwner(member.user.id).botOwner) {
                            if (getBotOwner(member.user.id).protected) {
                                msg.channel.send(createEmbed(msg, bot, false, "This user is protected."))
                            
                                reject("User is protected")
                            } else if (member.user.bot) {
                                msg.channel.send(createEmbed(msg, bot, false, "This user is a bot."))
                            
                                reject("User is a bot")
                            } else {
                                const reason = args.slice(1).join(" ").trim() ? args.slice(1).join(" ").trim() : "Not specifed."

                                set(`ownerIDs.${member.user.id}`, {
                                    "blacklisted": false,
                                    "reason": getBlacklisted(member.user.id).reason,
                                    "by": {
                                        "username": getBlacklisted(member.user.id).by.username,
                                        "discriminator": getBlacklisted(member.user.id).by.discriminator,
                                        "id": getBlacklisted(member.user.id).by.id
                                    }
                                })

                                bot.users.cache.get(member.user.id).send(createEmbed(msg, bot, false, `\`${msg.author.username}#${msg.author.discriminator} (${msg.author.id})\` demoted you from bot owner for \`${reason}${!reason.endsWith(".") ? "." : ""}\``)).catch(() => {})

                                log(bot, createEmbed(msg, bot, true, "Removed a bot owner.", {
                                    "Username": [member.user.username, true],
                                    "Discriminator": [member.user.discriminator, true],
                                    "ID": [member.user.id, true],
                                    "Who Removed Them": [msg.author.username, true],
                                    "Their Discriminator": [msg.author.discriminator, true],
                                    "Their ID": [msg.author.id, true]
                                }))

                                msg.channel.send(createEmbed(msg, bot, false, "This user is no longer a bot owner."))

                                resolve()
                            }
                        } else {
                            msg.channel.send(createEmbed(msg, bot, false, "This user is not a bot owner."))
                        
                            reject("User is not a bot owner")
                        }
                    } else {
                        msg.channel.send("Invalid argument detected.")
                    
                        reject("Invalid argument")
                    }
                } else {
                    msg.channel.send(createEmbed(msg, bot, false, "I was unable to find the user you specified."))
                
                    reject("User not found")
                }
            } else {
                getUser(args[1], msg, bot).then(member => {
                    if (args[0] === "add") {
                        if (getBotOwner(member.user.id).botOwner) {
                            msg.channel.send(createEmbed(msg, bot, false, "This user is already a owner."))

                            reject("User already a bot owner")
                        } else if (member.user.bot) {
                            msg.channel.send(createEmbed(msg, bot, false, "This user is a bot."))
                        
                            reject("User is a bot")
                        } else {
                            set(`ownerIDs.${member.user.id}`, {
                                "botOwner": true,
                                "protected": false,
                                "reason": "",
                                "by": {
                                    "username": msg.author.username,
                                    "discriminator": msg.author.discriminator,
                                    "id": msg.author.id
                                }
                            })

                            bot.users.cache.get(member.user.id).send(createEmbed(msg, bot, false, `\`${msg.author.username}#${msg.author.discriminator} (${msg.author.id})\` promoted you to bot owner.`)).catch(() => {})

                            log(bot, createEmbed(msg, bot, true, "Added a bot owner.", {
                                "Username": [member.user.username, true],
                                "Discriminator": [member.user.discriminator],
                                "ID": [member.user.id, true],
                                "Who Added Them": [msg.author.username, true],
                                "Their Discriminator": [msg.author.discriminator, true],
                                "Their ID": [msg.author.id, true]
                            }))

                            if (getBlacklisted(member.user.id).blacklisted) {
                                set(`blacklisted.${member.user.id}`, {
                                    "blacklisted": false,
                                    "reason": getBlacklisted(member.user.id).reason,
                                    "by": {
                                        "username": getBlacklisted(member.user.id).by.username,
                                        "discriminator": getBlacklisted(member.user.id).by.discriminator,
                                        "id": getBlacklisted(member.user.id).by.id
                                    }
                                })

                                log(bot, createEmbed(msg, bot, true, "Removed a blacklist.", {
                                    "Username": [member.user.username, true],
                                    "Discriminator": [member.user.discriminator, true],
                                    "ID": [member.user.id, true],
                                    "Who Removed Them": [msg.author.username, true],
                                    "Their Discriminator": [msg.author.discriminator, true],
                                    "Their ID": [msg.author.id, true]
                                }))

                                msg.channel.send(createEmbed(msg, bot, false, "This user is no longer blacklisted, and is now an bot owner."))
                            } else msg.channel.send(createEmbed(msg, bot, false, "This user is now an bot owner."))

                            resolve()
                        }
                    } else if (args[0] === "status") {
                        if (getBotOwner(member.user.id).botOwner) {
                            msg.channel.send(createEmbed(msg, bot, false, "Heres your information.", {
                                "Bot Owner": [true, true],
                                "Protected": [getBotOwner(member.user.id).protected, true],
                                "Who Added Them": [getBotOwner(member.user.id).by.username, true],
                                "Their Discriminator": [getBotOwner(member.user.id).by.discriminator, true],
                                "Their ID": [getBotOwner(member.user.id).by.id, true]
                            }))
                        } else {
                            if (getBotOwner(member.user.id).reason) {
                                msg.channel.send(createEmbed(msg, bot, false, "Heres your information.", {
                                    "Bot Owner": [false, true],
                                    "Protected": [false, true],
                                    "Reason": [getBotOwner(member.user.id).reason, true],
                                    "Who Added Them": [getBotOwner(member.user.id).by.username, true],
                                    "Their Discriminator": [getBotOwner(member.user.id).by.discriminator, true],
                                    "Their ID": [getBotOwner(member.user.id).by.id, true]
                                }))
                            } else {
                                msg.channel.send(createEmbed(msg, bot, false, "Heres your information.", {
                                    "Bot Owner": [false, true],
                                    "Protected": [false, true]
                                }))
                            }
                        }

                        resolve()
                    } else if (args[0] === "remove") {
                        if (getBotOwner(member.user.id).botOwner) {
                            if (getBotOwner(member.user.id).protected) {
                                msg.channel.send(createEmbed(msg, bot, false, "This user is protected."))
                            
                                reject("User is protected")
                            } else if (member.user.bot) {
                                msg.channel.send(createEmbed(msg, bot, false, "This user is a bot."))
                            
                                reject("User is a bot")
                            } else {
                                const reason = args.slice(1).join(" ").trim() ? args.slice(1).join(" ").trim() : "Not specifed."

                                set(`ownerIDs.${member.user.id}`, {
                                    "blacklisted": false,
                                    "reason": getBlacklisted(member.user.id).reason,
                                    "by": {
                                        "username": getBlacklisted(member.user.id).by.username,
                                        "discriminator": getBlacklisted(member.user.id).by.discriminator,
                                        "id": getBlacklisted(member.user.id).by.id
                                    }
                                })

                                bot.users.cache.get(member.user.id).send(createEmbed(msg, bot, false, `\`${msg.author.username}#${msg.author.discriminator} (${msg.author.id})\` demoted you from bot owner for \`${reason}${!reason.endsWith(".") ? "." : ""}\``)).catch(() => {})

                                log(bot, createEmbed(msg, bot, true, "Removed a bot owner.", {
                                    "Username": [member.user.username, true],
                                    "Discriminator": [member.user.discriminator, true],
                                    "ID": [member.user.id, true],
                                    "Who Removed Them": [msg.author.username, true],
                                    "Their Discriminator": [msg.author.discriminator, true],
                                    "Their ID": [msg.author.id, true]
                                }))

                                msg.channel.send(createEmbed(msg, bot, false, "This user is no longer a bot owner."))

                                resolve()
                            }
                        } else {
                            msg.channel.send(createEmbed(msg, bot, false, "This user is not a bot owner."))
                        
                            reject("User is not a bot owner")
                        }
                    } else {
                        msg.channel.send("Invalid argument detected.")
                    
                        reject("Invalid argument")
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