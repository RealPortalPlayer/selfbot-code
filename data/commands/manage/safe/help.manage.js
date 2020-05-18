const {basename} = require("path")

const {manageCategoryList, insideManageCategoryList} = require("../../../api/commands/commands")
const {createEmbed} = require("../../../api/embed/createembed")

class Command {
    constructor() {
        this.name = basename(__filename.split(".")[0])
        this.description = "Used for debuging commands."
        this.arguments = ""
        this.enabled = true
    }

    run(bot, msg, args) {
        let categoryCommands = {}

        let count = 0

        if (!args[0]) {
            manageCategoryList.forEach(category => {
                const categoryInfoFile = require(`../${category}/categoryinfo`)
                const categoryInfo = new categoryInfoFile.Category()

                count++

                categoryCommands[categoryInfo.name] = [categoryInfo.description, true]
            })

            if (count % 3 === 2) {
                categoryCommands["​"] = ["​", true] // you may not believe it, but that actually contains a invisible character *gasp*
            }

            if (Object.keys(categoryCommands)[0]) {
                msg.channel.send(createEmbed("", categoryCommands))
                return
            } else {
                msg.channel.send(createEmbed("I've found nothing, please contact support for more info."))
                return
            }
        } else {
            manageCategoryList.forEach(category => {
                if (category.toLowerCase() === args[0].toLowerCase()) {
                    insideManageCategoryList[category].forEach(file => {
                        if (!file.enabled) return

                        count++
                        categoryCommands[file.name] = [`${file.description}${file.arguments.split(" ")[0] ? `\nArgument${file.arguments.split(" ").length > 1 ? "s" : ""}: ${file.arguments}` : ""}`, true]
                    })
                } else {
                    manageCategoryList.forEach(category => {
                        insideManageCategoryList[category].forEach(file => {
                            if (file.name === args[0]) {
                                if (!file.enabled) return
                                
                                count++
                                categoryCommands[file.name] = [`${file.description}${file.arguments.split(" ")[0] ? `\nArgument${file.arguments.split(" ").length > 1 ? "s" : ""}: ${file.arguments}` : ""}`, true]
                            }
                        })
                    })
                }
            })

            if (count % 3 === 2) {
                categoryCommands["​"] = ["​", true] // you may not believe it, but that actually contains a invisible character *gasp*
            }

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