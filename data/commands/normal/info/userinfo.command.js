const {basename} = require("path")

const {convertTime} = require("../../../api/time/converttime")
const {settings} = require("../../../api/settings/botsettings")
const {createEmbed} = require("../../../api/embed/createembed")
const {getUser} = require("../../../api/arguments/getuser")

class Command {
    constructor() {
        this.name = basename(__filename.split(".")[0])
        this.description = "Get info of a user."
        this.arguments = "<id/ping/name>"
        this.userPermission = "SEND_MESSAGES"
        this.botPermission = "SEND_MESSAGES"
        this.dms = true
        this.enabled = true
        this.botOwnerOnly = false
        this.supportGuildOnly = false
        this.time = convertTime(settings.cooldown.time, settings.cooldown.type)
    }

    run(bot, msg, args) {
        const user = msg.mentions.members.first()

        if (user) {
            const member = msg.guild.member(user)

            if (member) {
                let payload = {
                    "Username": [member.user.username, true],
                    "Discriminator": [member.user.discriminator, true],
                    "ID": [member.user.id, true],
                    "Nickname": [member.nickname ? member.nickname : "None", true],
                    "Join Date": [member.user.joinedAt, true],
                    "Avatar Link": [`[Avatar URL](${member.user.avatarURL})`, true]
                }

                msg.channel.send(createEmbed("", payload))
            } else {
                msg.channel.send(createEmbed("I was unable to find the user you specified."))
            }
        } else {
            getUser(args[0], msg).then(user => {
                let payload = {
                    "Username": [user.username, true],
                    "Discriminator": [user.discriminator, true],
                    "ID": [user.userID, true],
                    "Nickname": [user.nickname ? user.nickname : "None", true],
                    "Join Date": [humanizeDuration(user.joinDate), true],
                    "Avatar Link": [`[Avatar URL](${user.avatarURL})`, true]
                }

                msg.channel.send(createEmbed("", payload))
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