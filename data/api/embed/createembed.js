const {MessageEmbed} = require("discord.js")

const {randomColor} = require("./randomcolor")
const {getWittyComment} = require("./getwittycomment")

function createEmbed(description, fields = {}, imageURL = "", title = "", wittyComments = [""]) {
    let embed = new MessageEmbed().setTitle(title).setDescription(description).setColor(randomColor("hex")).setTimestamp().setFooter(getWittyComment(wittyComments))

    if (Object.keys(fields)[0]) {
        Object.keys(fields).forEach(field => {
            embed.addField(`**${field}**`, fields[field][0], fields[field][1])
        })
    }

    if (imageURL) embed.setImage(imageURL)

    return embed
}

module.exports.createEmbed = createEmbed