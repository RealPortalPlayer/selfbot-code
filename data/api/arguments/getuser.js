const {MessageCollector} = require("discord.js")

const {createEmbed} = require("../embed/createembed")

function getUser(user, msg, bot) {
    return new Promise((resolve, reject) => {
        if (typeof user === "string" && user.trim() !== "") {
            let users = {}
            let id = "0"

            msg.guild.members.cache.forEach(member => {
                if (member.user.username.toLowerCase().includes(user.toLowerCase()) || member.user.id === user || member.nickname && member.nickname.toLowerCase().includes(user)) {
                    id = (parseInt(id) + 1).toString()

                    users[id] = member
                }
            })

            if (Object.keys(users).length === 1) {
                resolve(users[Object.keys(users)[0]])
            } else if (Object.keys(users).length > 1) {
                let userString = "We found more than one user, please specifiy the number next to what user you meant.\n\n"

                Object.keys(users).forEach(member => {
                    userString += `**${member}** - ${users[member].user.username}#${users[member].user.discriminator}${users[member].nickname ? ` (${users[member].nickname})` : ""}\n`
                })

                if (userString.length >= 2000) {
                    reject(413)
                } else {
                    msg.channel.send(createEmbed(msg, bot, false, userString, {}, "", "", ["Select a user.", "Grab any number!", "The user you'll select will feel special!"]))

                    const collector = new MessageCollector(msg.channel, m => m.author.id === msg.author.id, {time: 10000})
    
                    collector.on("collect", message => {
                        if (!isNaN(parseInt(message.content.trim())) && Object.keys(users).includes(message.content.trim())) {
                            resolve(users[message.content])
                        } else {
                            reject(400)
                        }
                    })
    
                    collector.on('end', (collected, reason) => {
                        reject(408)
                    })
                }
            } else {
                reject(404)
            }
        }
    })
}

module.exports.getUser = getUser