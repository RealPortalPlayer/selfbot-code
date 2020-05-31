const {MessageEmbed} = require("discord.js")

const {randomColor} = require("./randomcolor")
const {getWittyComment} = require("./getwittycomment")
const {dashed} = require("../dash")

function createEmbed(msg, bot, log, description, fields = {}, imageURL = "", title = "", wittyComments = [""]) {
    let embed
    let count = 0

    if (msg.channel.type === "text") {
        if (msg.channel.permissionsFor(bot.user).has("EMBED_LINKS") || log) {
            embed = new MessageEmbed().setTitle(title).setDescription(description).setColor(randomColor("hex")).setTimestamp()

            if (Object.keys(fields)[0]) {
                Object.keys(fields).forEach(field => {
                    count++
                    embed.addField(`**${field}**`, fields[field][0], fields[field][1])
                })
            }

            if (count % 3 === 2) {
                embed.addField("​", "​", true) // you may not believe it, but that actually contains a invisible character *gasp*
            }

            if (wittyComments.length === 1) embed.setFooter(wittyComments[0])
            else embed.setFooter(getWittyComment(wittyComments))

            if (imageURL) embed.setImage(imageURL)
        } else {
            embed = `\`\`\`${description}`

            if (Object.keys(fields)[0]) {
                Object.keys(fields).forEach(field => {
                    embed += `\n\n${field}\n${dashed(fields[field][0].toString().split("\n")[fields[field][0].toString().split("\n").length - 1])}\n${fields[field][0].toString().replace(/```/g, "")}`
                })
            }

            if (imageURL) embed += `\n${imageURL}`
            
            embed += `\`\`\``
        }
    } else {
        embed = new MessageEmbed().setTitle(title).setDescription(description).setColor(randomColor("hex")).setTimestamp()

        if (Object.keys(fields)[0]) {
            Object.keys(fields).forEach(field => {
                count++
                embed.addField(`**${field}**`, fields[field][0], fields[field][1])
            })
        }

        if (count % 3 === 2) {
            embed.addField("​", "​", true) // you may not believe it, but that actually contains a invisible character *gasp*
        }

        if (wittyComments.length === 1) embed.setFooter(wittyComments[0])
        else embed.setFooter(getWittyComment(wittyComments))

        if (imageURL) embed.setImage(imageURL)
    }

    return embed
}

module.exports.createEmbed = createEmbed