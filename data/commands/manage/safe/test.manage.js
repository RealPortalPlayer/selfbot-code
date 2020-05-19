const {basename} = require("path")

const {getUser} = require("../../../api/arguments/getuser")
const {createEmbed} = require("../../../api/embed/createembed")
const {settings} = require("../../../api/settings/usersettings")

class Command {
    constructor() {
        this.name = basename(__filename.split(".")[0])
        this.description = "Used for debuging commands."
        this.arguments = ["<arg with space>"]
        this.enabled = true
        this.example = ""
    }

    run(bot, msg, args) {
        const user = msg.mentions.members.first()
        
        if (user) {
            const member = msg.guild.member(user)

            if (member) {
                msg.channel.send(`you selected: ${member.id} - ${member.username}#${member.discriminator}`)
            } else {
                msg.channel.send(createEmbed("I was unable to find the user you specified."))
            }
        } else {
            getUser(args[0], msg).then(user => {
                msg.channel.send(`you selected: ${user.userID} - ${user.username}#${user.discriminator}`)
            }).catch(code => {
                if (code === 404) {
                    msg.channel.send(createEmbed("I was unable to find the user you specified."))
                } else if (code === 400) {
                    msg.channel.send(createEmbed("You either specified something that wasn't a number, or you specified a number outside the list."))
                } else if (code === 408) {
                    msg.channel.send(createEmbed("You waited too long, please try again."))
                } else if (code === 413) {
                    msg.channel.send(createEmbed("We found more than one user, however, there was too many to list. Please be more specific."))
                } else {
                    console.log(code)
                    msg.channel.send(createEmbed("Unknown error detected, please try again."))
                }
            })
        }
    }
}

module.exports.Command = Command