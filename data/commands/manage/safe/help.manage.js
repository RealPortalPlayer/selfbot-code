const {basename} = require("path")

const {createEmbed} = require("../../../api/embed/createembed")
const {settings} = require("../../../api/settings/botsettings")

class Command {
    constructor() {
        this.name = basename(__filename.split(".")[0])
        this.description = "Research About a Command"
        this.arguments = [""]
        this.enabled = true
        this.example = `${settings.managePrefix}${this.name} ${this.name}`
    }

    run(bot, msg, args) {
        return new Promise((resolve, reject) => {
            let categoryCommands = {}

            if (!args[0]) {
                bot.manageCategoryList.forEach(category => {
                    const categoryInfoFile = require(`../${category}/categoryinfo`)
                    const categoryInfo = new categoryInfoFile.Category()

                    categoryCommands[categoryInfo.name] = [categoryInfo.description, true]
                })

                if (Object.keys(categoryCommands)[0]) {
                    msg.channel.send(createEmbed(msg, bot, false, "", categoryCommands))

                    resolve()
                } else {
                    msg.channel.send(createEmbed(msg, bot, false, "I've found nothing, please contact support for more info."))

                    reject("Found nothing")
                }
            } else {
                bot.manageCategoryList.forEach(category => {
                    if (category.toLowerCase() === args[0].toLowerCase()) {
                        bot.insideManageCategoryList[category].forEach(file => {
                            if (!file.enabled) return

                            categoryCommands[file.name] = [`${file.description}${file.arguments[0] ? `\nArgument${file.arguments.length > 1 ? "s" : ""}: ${file.arguments.join(" ")}` : ""}${file.example ? `\nExample: ${file.example}` : ""}`, true]
                        })
                    } else {
                        bot.manageCategoryList.forEach(category => {
                            bot.insideManageCategoryList[category].forEach(file => {
                                if (file.name === args[0]) {
                                    if (!file.enabled) return
                                    
                                    categoryCommands[file.name] = [`${file.description}${file.arguments[0] ? `\nArgument${file.arguments.length > 1 ? "s" : ""}: ${file.arguments.join(" ")}` : ""}${file.example ? `\nExample: ${file.example}` : ""}`, true]
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