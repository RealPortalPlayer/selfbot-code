const {basename} = require("path")
const fetch = require("node-fetch")
const {stringify} = require("querystring")

const {convertTime} = require("../../../api/time/converttime")
const {settings} = require("../../../api/settings/botsettings")
const {createEmbed} = require("../../../api/embed/createembed")

class Command {
    constructor() {
        this.name = basename(__filename.split(".")[0])
        this.description = "Small test command (will be disabled soon)"
        this.arguments = ""
        this.userPermission = "SEND_MESSAGES"
        this.botPermission = "EMBED_LINKS"
        this.dms = true
        this.enabled = true
        this.botOwnerOnly = false
        this.supportGuildOnly = false
        this.time = convertTime(settings.cooldown.time, settings.cooldown.type)
    }

    run(bot, msg, args) {
        fetch(`https://api.thecatapi.com/v1/images/search?${stringify({
            "has_breeds": true,
            "mime_types": "jpg, png",
            "size": "small",
            "limit": 1
        })}`).then(res => res.json()).then(json => {
            const url = json[0].url

            const name = json[0].breeds[0].name
            const description = json[0].breeds[0].description
            const temperament = json[0].breeds[0].temperament

            msg.channel.send(createEmbed(`**Breed:** ${name}\n\n**Description:** ${description}\n\n**Temperament:** ${temperament}`, {}, url))
        })
    }
}

module.exports.Command = Command

module.exports.Command = Command