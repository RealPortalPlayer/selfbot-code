const {MessageCollector} = require("discord.js")

const {createEmbed} = require("../embed/createembed")

function getUser(user, msg) {
    return new Promise((resolve, reject) => {
        if (typeof user === "string" && user.trim() !== "") {
            let users = {}
            let id = "0"

            msg.guild.members.cache.forEach((member) => {
                console.log(member)
                if (member.user.username.toLowerCase().includes(user) || member.user.id === user || member.nickname && member.nickname.toLowerCase().includes(user)) {
                    id = (parseInt(id) + 1).toString()
                    users[id] = {
                        "userID": member.user.id,
                        "username": member.user.username,
                        "nickname": member.nickname,
                        "discriminator": member.user.discriminator,
                        "avatarURL": member.user.avatarURL,
                        "joinDate": member.user.joinedAt
                    }
                }
            })

            if (Object.keys(users).length === 1) {
                resolve(users[Object.keys(users)[0]])
            } else if (Object.keys(users).length > 1) {
                let userString = "We found more than one user, please specifiy the number next to what user you meant.\n\n"

                Object.keys(users).forEach(user => {
                    userString += `**${user}** - ${users[user].username}#${users[user].discriminator}${users[user].nickname ? ` (${users[user].nickname})` : ""}\n`
                })

                if (userString.length >= 2000) {
                    reject(413)
                } else {
                    msg.channel.send(createEmbed(userString, {}, "", "", ["Select a user.", "Grab any number!", `I bet you're going to chose ${users[Math.floor(Math.random() * Object.keys(users).length)].username}.`, "The user you'll select will feel special!"]))

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