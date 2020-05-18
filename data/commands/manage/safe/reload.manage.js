const {basename} = require("path")
const {Collection} = require("discord.js")

let {normalCommandList, manageCommandList} = require("../../../api/commands/commands")

class Command {
    constructor() {
        this.name = basename(__filename.split(".")[0])
        this.description = "Used to reload commands easily."
        this.arguments = "<command>"
        this.enabled = true
    }

    run(bot, msg, args) {
        if (!normalCommandList.has(args[0]) && !manageCommandList.has(args[0])) msg.channel.send("Command not found.")
        else {
            if (normalCommandList.has(args[0])) {
            } 
        }
    }
}

module.exports.Command = Command