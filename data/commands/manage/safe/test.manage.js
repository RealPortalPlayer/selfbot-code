const {basename} = require("path")

const {getUser} = require("../../../api/arguments/getuser")
const {createEmbed} = require("../../../api/embed/createembed")
const {settings} = require("../../../api/settings/usersettings")

class Command {
    constructor() {
        this.name = basename(__filename.split(".")[0])
        this.description = "Testing 123"
        this.arguments = ["<arg with space>"]
        this.enabled = true
        this.example = ""
    }

    run(bot, msg, args) {
        return new Promise((resolve, reject) => {
            let arg = ""
            let count = 0

            args.forEach(argu => {
                count++

                arg += `${count} ${argu}\n`
            })

            msg.channel.send(createEmbed(msg, bot, false, arg))

            resolve()
        })
    }
}

module.exports.Command = Command