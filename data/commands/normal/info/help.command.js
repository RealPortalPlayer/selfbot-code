const {basename} = require("path")

const {convertTime} = require("../../../api/time/converttime")
const {settings} = require("../../../api/settings/botsettings")
const {getBotOwner} = require("../../../api/commands/getbotowner")
const {createEmbed} = require("../../../api/embed/createembed")

class Command {
    constructor() {
        this.name = basename(__filename.split(".")[0])
        this.altNames = ["cmds", "commands"]
        this.description = "Research About a Command"
        this.arguments = ["[category/command]"]
        this.userPermission = "SEND_MESSAGES"
        this.botPermission = "SEND_MESSAGES"
        this.dms = true
        this.enabled = true
        this.botOwnerOnly = false
        this.supportGuildOnly = false
        this.time = convertTime(settings.cooldown.time, settings.cooldown.type)
        this.example = `${settings.normalPrefix}${this.name} ${this.name}`
    }

    run(bot, msg, args) {
        return new Promise((resolve, reject) => {
            let categoryCommands = {}

            if (!args[0]) {
                bot.normalCategoryList.forEach(category => {
                    const categoryInfoFile = require(`../${category}/categoryinfo`)
                    const categoryInfo = new categoryInfoFile.Category()

                    let commandCount = 0

                    bot.insideNormalCategoryList[category].forEach(file => {
                        if (!file.enabled && !getBotOwner(msg.author.id).botOwner) return
                        if (file.botOwnerOnly && !getBotOwner(msg.author.id).botOwner) return
                        if (file.supportGuildOnly && msg.guild.id !== settings.supportGuild) return
                        if (!file.dms && msg.channel.type === "dm") return
                        if (msg.channel.type === "text") {
                            if (msg.author.id !== msg.guild.ownerID && !msg.member.hasPermission("ADMINISTRATOR") && !msg.member.hasPermission(file.userPermission)) return
                            if (!msg.guild.me.hasPermission("ADMINISTRATOR") && !msg.guild.me.hasPermission(file.botPermission)) return
                        }

                        commandCount++
                    })

                    if (commandCount) categoryCommands[categoryInfo.name] = [categoryInfo.description, true]
                })

                if (Object.keys(categoryCommands)[0]) {
                    msg.channel.send(createEmbed(msg, bot, false, "", categoryCommands))

                    resolve()
                } else {
                    msg.channel.send(createEmbed(msg, bot, false, "I've found nothing, please contact support for more info."))

                    reject("Found nothing")
                }
            } else {
                bot.normalCategoryList.forEach(category => {
                    if (category.toLowerCase() === args[0].toLowerCase()) {
                        bot.insideNormalCategoryList[category].forEach(file => {
                            if (!file.enabled && !getBotOwner(msg.author.id).botOwner) return
                            if (file.botOwnerOnly && !getBotOwner(msg.author.id).botOwner) return
                            if (file.supportGuildOnly && msg.guild.id !== settings.supportGuild) return
                            if (!file.dms && msg.channel.type === "dm") return
                            if (msg.channel.type === "text") {
                                if (msg.author.id !== msg.guild.ownerID && !msg.member.hasPermission("ADMINISTRATOR") && !msg.member.hasPermission(file.userPermission)) return
                                if (!msg.guild.me.hasPermission("ADMINISTRATOR") && !msg.guild.me.hasPermission(file.botPermission)) return
                            }

                            categoryCommands[file.name] = [`${file.description}${file.arguments[0] ? `\nArgument${file.arguments.length > 1 ? "s" : ""}: ${file.arguments.join(" ")}` : ""}${file.example ? `\nExample: ${file.example}` : ""}`, true]
                        })
                    } else {
                        bot.normalCategoryList.forEach(category => {
                            bot.insideNormalCategoryList[category].forEach(file => {
                                if (file.name === args[0]) {
                                    if (!file.enabled && !getBotOwner(msg.author.id).botOwner) return
                                    if (file.botOwnerOnly && !getBotOwner(msg.author.id).botOwner) return
                                    if (file.supportGuildOnly && msg.guild.id !== settings.supportGuild) return
                                    if (!file.dms && msg.channel.type === "dm") return
                                    if (msg.channel.type === "text") {
                                        if (msg.author.id !== msg.guild.ownerID && !msg.member.hasPermission("ADMINISTRATOR") && !msg.member.hasPermission(file.userPermission)) return
                                        if (!msg.guild.me.hasPermission("ADMINISTRATOR") && !msg.guild.me.hasPermission(file.botPermission)) return
                                    }

                                    categoryCommands[file.name] = [`${file.description}${file.arguments[0] ? `\nArgument${file.arguments.length > 1 ? "s" : ""}: ${file.arguments.join(" ")}${file.example ? `\nExample: ${file.example}` : ""}` : ""}`, true]
                                }
                            })
                        })
                    }
                })

                if (Object.keys(categoryCommands)[0]) {
                    msg.channel.send(createEmbed(msg, bot, false, "", categoryCommands))

                    resolve()
                } else {
                    msg.channel.send(createEmbed(msg, bot, false, "That's not a valid command/category."))

                    reject("Invalid argument")
                }
            }
        })
    }
}

module.exports.Command = Command