const {basename} = require("path")
const {exec} = require("child_process")

const {protectToken} = require("../../../api/token/protecttoken")
const {createEmbed} = require("../../../api/embed/createembed")
const {settings} = require("../../../api/settings/botsettings")

class Command {
    constructor() {
        this.name = basename(__filename.split(".")[0])
        this.description = "Executes Bash Code"
        this.arguments = ["<code>"]
        this.enabled = true
        this.example = `${settings.managePrefix}${this.name} echo Hello, World!`
    }

    run(bot, msg, args) {
        return new Promise(resolve => {
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

            exec(userCode, (err, stdout, stderr) => {
                if (err) msg.channel.send(createEmbed(msg, bot, false, `Input:\n\`\`\`bash\n${userCode}\`\`\`\nOutput:\n\`\`\`${err}\`\`\``))
                if (stdout) {
                    stdout = protectToken(stdout)
            
                    if (stdout.length > 2048) {
                        msg.channel.send(createEmbed(msg, bot, false, `Input:\n\`\`\`bash\n${userCode}\`\`\`\nOutput:\nOutput file was too long, so I pasted it in console.`))
                        console.log(stdout)
                    } else msg.channel.send(createEmbed(msg, bot, false, `Input:\n\`\`\`bash\n${userCode}\`\`\`\nOutput:\n\`\`\`bash\n${stdout}\`\`\``))

                    resolve()
                }
            })
        })
    }
}

module.exports.Command = Command