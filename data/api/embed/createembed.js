const {MessageEmbed} = require("discord.js")

const {randomColor} = require("./randomcolor")
const {getWittyComment} = require("./getwittycomment")

function createEmbed(description, fields = {}, imageURL = "", title = "", wittyComments = [""]) {
    let embed = new MessageEmbed().setTitle(title).setDescription(description).setColor(randomColor("hex")).setTimestamp()
    let count = 0

    if (Object.keys(fields)[0]) {
        Object.keys(fields).forEach(field => {
            if (fields[field][0]) {
                count++
                embed.addField(`**${field}**`, fields[field][0], fields[field][1])
            }
        })
    }

    if (count % 3 === 2) {
        embed.addField("​", "​", true) // you may not believe it, but that actually contains a invisible character *gasp*
    }

    if (wittyComments.length === 1) embed.setFooter(wittyComments[0])
    else getWittyComment(wittyComments)

    if (imageURL) embed.setImage(imageURL)

    return embed
}

module.exports.createEmbed = createEmbed