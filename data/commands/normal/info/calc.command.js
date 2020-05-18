const {basename} = require("path")

const {convertTime} = require("../../../api/time/converttime")
const {settings} = require("../../../api/settings/botsettings")
const {createEmbed} = require("../../../api/embed/createembed")
const {randomColor} = require("../../../api/embed/randomcolor")

class Command {
    constructor() {
        this.name = basename(__filename.split(".")[0])
        this.description = "Do some calculations"
        this.arguments = "<add/subtract/multiply/divide> <equation> <equation> [equations]"
        this.userPermission = "SEND_MESSAGES"
        this.botPermission = "SEND_MESSAGES"
        this.dms = true
        this.enabled = true
        this.botOwnerOnly = false
        this.supportGuildOnly = false
        this.time = convertTime(settings.cooldown.time, settings.cooldown.type)
    }

    run(bot, msg, args) {
        const equations = args.slice(2)
        let final = parseInt(args.slice(1)[0])

        if (args[0] === "add") {
            equations.forEach(equation => {
                final += parseInt(equation)
            })

            msg.channel.send(createEmbed(`${args.splice(1).join(" + ")} = ${final}`))
        } else if (args[0] === "subtract") {
            let final = 0

            equations.forEach(equation => {
                final -= parseInt(equation)
            })

            msg.channel.send(createEmbed(`${args.splice(1).join(" - ")} = ${final}`))
        } else if (args[0] === "multiply") {
            let final = 0

            equations.forEach(equation => {
                final *= parseInt(equation)
            })

            msg.channel.send(createEmbed(`${args.splice(1).join(" * ")} = ${final}`))
        } else if (args[0] === "divide") {
            equations.forEach(equation => {
                final /= parseInt(equation)
            })

            msg.channel.send(createEmbed(`${args.splice(1).join(" / ")} = ${final}`))
        } else {
            msg.channel.send(createEmbed("Invalid argument was supplied."))
        }
    }
}

module.exports.Command = Command