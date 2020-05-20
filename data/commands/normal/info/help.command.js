const {basename} = require("path")

const {convertTime} = require("../../../api/time/converttime")
const {settings} = require("../../../api/settings/botsettings")
const {isBotOwner} = require("../../../api/commands/isbotowner")
const {createEmbed} = require("../../../api/embed/createembed")

class Command {
    constructor() {
        this.name = basename(__filename.split(".")[0])
        this.description = "Gives you info about other commands."
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
        let categoryCommands = {}

        if (!args[0]) {
            bot.normalCategoryList.forEach(category => {
                const categoryInfoFile = require(`../${category}/categoryinfo`)
                const categoryInfo = new categoryInfoFile.Category()

                if (categoryInfo.supportGuildOnly && settings.supportGuild !== msg.guild.id) return
                if (categoryInfo.botOwnerOnly && !isBotOwner(msg.author.id)[0]) return

                categoryCommands[categoryInfo.name] = [categoryInfo.description, true]
            })

            if (Object.keys(categoryCommands)[0]) {
                msg.channel.send(createEmbed("", categoryCommands))
                return
            } else {
                msg.channel.send(createEmbed("I've found nothing, please contact support for more info."))
                return
            }
        } else {
            bot.normalCategoryList.forEach(category => {
                if (category.toLowerCase() === args[0].toLowerCase()) {
                    bot.insideNormalCategoryList[category].forEach(file => {
                        if (!file.enabled) return
                        if (file.botOwnerOnly && !isBotOwner(msg.author.id)[0]) return
                        if (file.supportGuildOnly && msg.guild.id !== settings.supportGuild) return
                        if (!file.dms && msg.channel.type === "dm") return
                        if (msg.channel.type !== "dm") {
                            if (msg.author.id !== msg.guild.ownerID && !msg.member.hasPermission("ADMINISTRATOR") && !msg.member.hasPermission(file.userPermission)) return
                            if (!msg.guild.me.hasPermission("ADMINISTRATOR") && !msg.guild.me.hasPermission(file.botPermission)) return
                        }

                        categoryCommands[file.name] = [`${file.description}${file.arguments[0].trim() ? `\nArgument${file.arguments.length > 1 ? "s" : ""}: ${file.arguments.join(" ")}` : ""}${file.example.trim() ? `\nExample: ${file.example}` : ""}`, true]
                    })
                } else {
                    bot.normalCategoryList.forEach(category => {
                        bot.insideNormalCategoryList[category].forEach(file => {
                            if (file.name === args[0]) {
                                if (!file.enabled) return
                                if (file.botOwnerOnly && !isBotOwner(msg.author.id)[0]) return
                                if (file.supportGuildOnly && msg.guild.id !== settings.supportGuild) return
                                if (!file.dms && msg.channel.type === "dm") return
                                if (msg.channel.type !== "dm") {
                                    if (msg.author.id !== msg.guild.ownerID && !msg.member.hasPermission("ADMINISTRATOR") && !msg.member.hasPermission(file.userPermission)) return
                                    if (!msg.guild.me.hasPermission("ADMINISTRATOR") && !msg.guild.me.hasPermission(file.botPermission)) return
                                }

                                categoryCommands[file.name] = [`${file.description}${file.arguments[0].trim() ? `\nArgument${file.arguments.length > 1 ? "s" : ""}: ${file.arguments.join(" ")}${file.example.trim() ? `\nExample: ${file.example}` : ""}` : ""}`, true]
                            }
                        })
                    })
                }
            })

            if (Object.keys(categoryCommands)[0]) {
                msg.channel.send(createEmbed("", categoryCommands))
                return
            } else {
                msg.channel.send(createEmbed("That's not a valid command/category."))
                return
            }
        }
    }
}

module.exports.Command = Command