const {basename} = require("path")

const {createEmbed} = require("../../../api/embed/createembed")
const {settings} = require("../../../api/settings/botsettings")

class Command {
    constructor() {
        this.name = basename(__filename.split(".")[0])
        this.description = "Used for debuging commands."
        this.arguments = [""]
        this.enabled = true
        this.example = `${settings.managePrefix}${this.name} ${this.name}`
    }

    run(bot, msg, args) {
        let categoryCommands = {}

        if (!args[0]) {
            bot.manageCategoryList.forEach(category => {
                const categoryInfoFile = require(`../${category}/categoryinfo`)
                const categoryInfo = new categoryInfoFile.Category()

                count++

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
            bot.manageCategoryList.forEach(category => {
                if (category.toLowerCase() === args[0].toLowerCase()) {
                    bot.insideManageCategoryList[category].forEach(file => {
                        if (!file.enabled) return

                        categoryCommands[file.name] = [`${file.description}${file.arguments.split(" ")[0] ? `\nArgument${file.arguments.split(" ").length > 1 ? "s" : ""}: ${file.arguments}` : ""}${file.example ? `\nExample: ${file.example}` : ""}`, true]
                    })
                } else {
                    bot.manageCategoryList.forEach(category => {
                        bot.insideManageCategoryList[category].forEach(file => {
                            if (file.name === args[0]) {
                                if (!file.enabled) return
                                
                                categoryCommands[file.name] = [`${file.description}${file.arguments.split(" ")[0] ? `\nArgument${file.arguments.split(" ").length > 1 ? "s" : ""}: ${file.arguments}` : ""}${file.example ? `\nExample: ${file.example}` : ""}`, true]
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