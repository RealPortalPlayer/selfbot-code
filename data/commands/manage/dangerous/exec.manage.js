const {basename} = require("path")
const {exec} = require("child_process")

const {protectToken} = require("../../../api/token/protecttoken")
const {createEmbed} = require("../../../api/embed/createembed")
const {settings} = require("../../../api/settings/usersettings")

class Command {
    constructor() {
        this.name = basename(__filename.split(".")[0])
        this.description = "Executes bash code"
        this.arguments = ["<code>"]
        this.enabled = true
        this.example = `${settings.managePrefix}${this.name} echo Hello, World!`
    }

    run(bot, msg, args) {
        let userCode = args.join(" ")

        if (userCode.startsWith("```bash")) {
            userCode = userCode.slice(7)
            userCode = userCode.slice(0, userCode.length - 3)
        } else if (userCode.startsWith("```bat")) {
            userCode = userCode.slice(6)
            userCode = userCode.slice(0, userCode.length - 3)
        }

        if (userCode.startsWith("```")) {
            userCode = userCode.slice(5)
            userCode = userCode.slice(0, userCode.length - 3) 
        }

        try {
            exec(userCode, (err, stdout, stderr) => {
                if (err) msg.channel.send(createEmbed(err))
                if (stdout) {
                    stdout = protectToken(stdout)
            
                    if (stdout.length > 2048) {
                        msg.channel.send(createEmbed(`Input:\n\`\`\`js\n${userCode}\`\`\`\nOutput:\nOutput file was too long, so I pasted it in console.`))
                        console.log(stdout)
                    } else {
                        msg.channel.send(createEmbed(`Input:\n\`\`\`js\n${userCode}\`\`\`\nOutput:\n\`\`\`js\n${stdout}\`\`\``))
                    }
                }
            })
        } catch (e) {
            code = e
        }

        
    }
}

module.exports.Command = Command