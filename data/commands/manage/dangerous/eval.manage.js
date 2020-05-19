const {basename} = require("path")

const {protectToken} = require("../../../api/token/protecttoken")
const {createEmbed} = require("../../../api/embed/createembed")
const {settings} = require("../../../api/settings/botsettings")

class Command {
    constructor() {
        this.name = basename(__filename.split(".")[0])
        this.description = "Executes JS userCode"
        this.arguments = ["<code>"]
        this.enabled = true
        this.example = `${settings.managePrefix}${this.name} console.log("Hello, World!")`
    }

    run(bot, msg, args) {
        let userCode = args.join(" ")
        let result = ""

        if (userCode.startsWith("```js")) {
            userCode = userCode.slice(6)
            userCode = userCode.slice(0, userCode.length - 3)
        } else if (userCode.startsWith("```javascript")) {
            userCode = userCode.slice(14)
            userCode = userCode.slice(0, args.length - 3)
        } else if (userCode.startsWith("```ts") ) {
            userCode = userCode.slice(6)
            userCode = userCode.slice(0, userCode.length - 3)
        } else if (userCode.startsWith("```typescript") && userCode.slice(13).startsWith("\n")) {
            userCode = userCode.slice(14)
            userCode = userCode.slice(0, userCode.length - 3)
        }

        if (userCode.startsWith("```")) {
            userCode = userCode.slice(5)
            userCode = userCode.slice(0, userCode.length - 3) 
        }

        try {
            result = eval(userCode)
        } catch (e) {
            result = e
        }

        if (typeof result !== "string") result = require("util").inspect(result)
        else result = protectToken(result)

        if (result.length > 2048) {
            msg.channel.send(createEmbed(`Input:\n\`\`\`js\n${userCode}\`\`\`\nOutput:\n\`\`\`Output file was too long, so I pasted it in console.\`\`\``))
            console.log(result)
        } else {
            msg.channel.send(createEmbed(`Input:\n\`\`\`js\n${userCode}\`\`\`\nOutput:\n\`\`\`js\n${result}\`\`\``))
        }
    }
}

module.exports.Command = Command