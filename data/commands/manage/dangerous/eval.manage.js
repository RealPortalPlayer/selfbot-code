const {basename} = require("path")

const {protectToken} = require("../../../api/token/protecttoken")
const {createEmbed} = require("../../../api/embed/createembed")

class Command {
    constructor() {
        this.name = basename(__filename.split(".")[0])
        this.description = "Executes JS userCode"
        this.arguments = "<code>"
        this.enabled = true
    }

    run(bot, msg, args) {
        let userCode = args.join(" ")
        let result = ""

        if (userCode.startsWith("```js") && userCode.slice(6).startsWith("\n")) {
            userCode = userCode.slice(7)
            userCode = userCode.slice(0, userCode.length - 3)
        } else if (userCode.startsWith("```js") && userCode.slice(5).startsWith("\n")) {
            userCode = userCode.slice(6)
            userCode = userCode.slice(0, userCode.length - 3)
        } else if (userCode.startsWith("```javascript") && userCode.slice(14).startsWith("\n")) {
            userCode = userCode.slice(15)
            userCode = userCode.slice(0, args.length - 3)
        } else if (userCode.startsWith("```javascript") && userCode.slice(13).startsWith("\n")) {
            userCode = userCode.slice(14)
            userCode = userCode.slice(0, userCode.length - 3)
        } else if (userCode.startsWith("```ts") && userCode.slice(6).startsWith("\n")) {
            userCode = userCode.slice(7)
            userCode = userCode.slice(0, userCode.length - 3)
        } else if (userCode.startsWith("```ts") && userCode.slice(5).startsWith("\n")) {
            userCode = userCode.slice(6)
            userCode = userCode.slice(0, userCode.length - 3)
        } else if (userCode.startsWith("```typescript") && userCode.slice(14).startsWith("\n")) {
            userCode = userCode.slice(15)
            userCode = userCode.slice(0, userCode.length - 3)
        } else if (userCode.startsWith("```typescript") && userCode.slice(13).startsWith("\n")) {
            userCode = userCode.slice(14)
            userCode = userCode.slice(0, userCode.length - 3)
        }

        if (userCode.startsWith("```") && userCode.slice(4).startsWith("\n") || userCode.startsWith("```") && userCode.slice(3).startsWith("\n")) {
            userCode = userCode.slice(5)
            userCode = userCode.slice(0, userCode.length - 3) 
        } else if (userCode.startsWith("``` ")) {
            userCode = userCode.slice(4)
            userCode = userCode.slice(0, userCode.length - 3) 
        } else if (userCode.startsWith("```")) {
            userCode = userCode.slice(3)
            userCode = userCode.slice(0, userCode.length - 3) 
        }
        
        try {
            result = eval(userCode)
        } catch (e) {
            result = e
        }

        if (typeof result !== "string") result = require("util").inspect(result)
        else result = protectToken(result)

        if (userCode.length > 2000) {
            msg.channel.send(createEmbed(`Input:\n\`\`\`js\n${userCode}\`\`\`\nOutput:\n\`\`\`Output file was too long, so I pasted it in console.\`\`\``))
            console.log(result)
        } else {
            msg.channel.send(createEmbed(`Input:\n\`\`\`js\n${userCode}\`\`\`\nOutput:\n\`\`\`js\n${result}\`\`\``))
        }
    }
}

module.exports.Command = Command