const {basename} = require("path")
const {exec} = require("child_process")

const {protectToken} = require("../../../api/token/protecttoken")
const {createEmbed} = require("../../../api/embed/createembed")

class Command {
    constructor() {
        this.name = basename(__filename.split(".")[0])
        this.description = "Executes bash code"
        this.arguments = "<code>"
        this.enabled = true
    }

    run(bot, msg, args) {
        try {
            exec(args[0], (err, stdout, stderr) => {
                if (err) msg.channel.send(createEmbed(err))
                if (stdout) {
                    stdout = protectToken(stdout)
            
                    if (stdout.length > 2000) {
                        msg.channel.send(createEmbed(`Input:\n\`\`\`js\n${args.join(" ")}\`\`\`\nOutput:\nOutput file was too long, so I pasted it in console.`))
                        console.log(stdout)
                    } else {
                        msg.channel.send(createEmbed(`Input:\n\`\`\`js\n${args.join(" ")}\`\`\`\nOutput:\n\`\`\`js\n${protectToken(stdout)}\`\`\``))
                    }
                }
            })
        } catch (e) {
            code = e
        }

        
    }
}

module.exports.Command = Command