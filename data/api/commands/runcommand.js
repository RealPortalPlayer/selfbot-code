const humanizeDuration = require("humanize-duration")

const {settings} = require("../settings/botsettings")
const {getBotOwner} = require("./getbotowner")
const {checkArgument} = require("../arguments/checkargument")
const {hasAndGetCooldown, setCooldown, deleteCooldown} = require("./cooldown")
const {createEmbed} = require("../embed/createembed")
const {log} = require("../guild/log")
const {parseArgument} = require("../arguments/parseargument")

function runCommand(bot, msg, command = "", bypassCoolDown) {
	if (command) msg.content = command

	if (getBotOwner(msg.author.id).botOwner || bypassCoolDown) {
		const normalCommand = bot.normalCommandList.get(msg.content.slice(settings.normalPrefix.length).split(" ")[0])

		const args = parseArgument(msg.content.split(" ").slice(1).join(" ")).filter(str => {
			return /\S/.test(str)
		})

		if (normalCommand) {
			if (normalCommand.botOwnerOnly && !getBotOwner(msg.author.id).botOwner) {
				if (msg.channel.type === "text") {
					log(bot, createEmbed(msg, bot, true, "New command ran.", {
						"Success": [false, true],
						"Reason": ["Bot owner only", true],
						"Command": [msg.content.slice(settings.normalPrefix.length).split(" ")[0], true],
						"Arguments": [msg.content.split(" ").slice(1).join(" ") ? msg.content.split(" ").slice(1).join(" ") : "None", true],
						"Message": [msg.content, true],
						"Username": [msg.author.username, true],
						"Discriminator": [msg.author.discriminator, true],
						"ID": [msg.author.id, true],
						"Owner": [getBotOwner(msg.author.id).botOwner, true],
						"Protected Owner": [getBotOwner(msg.author.id).protected, true],
						"Guild Name": [msg.guild.name, true],
						"Guild ID": [msg.guild.id, true],
						"Guild Owner Username": [msg.guild.owner.user.username, true],
						"Guild Owner Discriminator": [msg.guild.owner.user.discriminator, true],
						"Guild Owner ID": [msg.guild.ownerID, true]
					}, "", "", ["Command abuse = Blacklist"]))
				} else {
					log(bot, createEmbed(msg, bot, true, "New command ran.", {
						"Success": [false, true],
						"Reason": ["Bot owner only", true],
						"Command": [msg.content.slice(settings.normalPrefix.length).split(" ")[0], true],
						"Arguments": [msg.content.split(" ").slice(1).join(" ") ? msg.content.split(" ").slice(1).join(" ") : "None", true],
						"Message": [msg.content, true],
						"Username": [msg.author.username, true],
						"Discriminator": [msg.author.discriminator, true],
						"ID": [msg.author.id, true],
						"Owner": [getBotOwner(msg.author.id).botOwner, true],
						"Protected Owner": [getBotOwner(msg.author.id).protected, true]
					}, "", "", ["Command abuse = Blacklist"]))
				}

				msg.channel.send(createEmbed(msg, bot, false, "This command can only be ran by bot owners.", {}, "", "Command Handler"))
				return
			}
			if (normalCommand.supportGuildOnly && msg.guild.id !== settings.supportGuild) {
				if (msg.channel.type === "text") {
					log(bot, createEmbed(msg, bot, true, "New command ran.", {
						"Success": [false, true],
						"Reason": ["Support guild only", true],
						"Command": [msg.content.slice(settings.normalPrefix.length).split(" ")[0], true],
						"Arguments": [msg.content.split(" ").slice(1).join(" ") ? msg.content.split(" ").slice(1).join(" ") : "None", true],
						"Message": [msg.content, true],
						"Username": [msg.author.username, true],
						"Discriminator": [msg.author.discriminator, true],
						"ID": [msg.author.id, true],
						"Owner": [getBotOwner(msg.author.id).botOwner, true],
						"Protected Owner": [getBotOwner(msg.author.id).protected, true],
						"Guild Name": [msg.guild.name, true],
						"Guild ID": [msg.guild.id, true],
						"Guild Owner Username": [msg.guild.owner.user.username, true],
						"Guild Owner Discriminator": [msg.guild.owner.user.discriminator, true],
						"Guild Owner ID": [msg.guild.ownerID, true]
					}, "", "", ["Command abuse = Blacklist"]))
				} else {
					log(bot, createEmbed(msg, bot, true, "New command ran.", {
						"Success": [false, true],
						"Reason": ["Support guild only", true],
						"Command": [msg.content.slice(settings.normalPrefix.length).split(" ")[0], true],
						"Arguments": [msg.content.split(" ").slice(1).join(" ") ? msg.content.split(" ").slice(1).join(" ") : "None", true],
						"Message": [msg.content, true],
						"Username": [msg.author.username, true],
						"Discriminator": [msg.author.discriminator, true],
						"ID": [msg.author.id, true],
						"Owner": [getBotOwner(msg.author.id).botOwner, true],
						"Protected Owner": [getBotOwner(msg.author.id).protected, true]
					}, "", "", ["Command abuse = Blacklist"]))
				}

				msg.channel.send(createEmbed(msg, bot, false, "This command only works in the support guild.", {}, "", "Command Handler"))
				return
			}
			if (!normalCommand.dms && msg.channel.type === "dm") {
				log(bot, createEmbed(msg, bot, true, "New command ran.", {
					"Success": [false, true],
					"Reason": ["Guild only command in DMs", true],
					"Command": [msg.content.slice(settings.normalPrefix.length).split(" ")[0], true],
					"Arguments": [msg.content.split(" ").slice(1).join(" ") ? msg.content.split(" ").slice(1).join(" ") : "None", true],
					"Message": [msg.content, true],
					"Username": [msg.author.username, true],
					"Discriminator": [msg.author.discriminator, true],
					"ID": [msg.author.id, true],
					"Owner": [getBotOwner(msg.author.id).botOwner, true],
					"Protected Owner": [getBotOwner(msg.author.id).protected, true]
				}, "", "", ["Command abuse = Blacklist"]))

				msg.channel.send(createEmbed(msg, bot, false, "This command doesn't work in DMs.", {}, "", "Command Handler"))
				return
			}
			if (msg.channel.type === "text") {
				if (!msg.channel.permissionsFor(msg.author).has(normalCommand.userPermission)) {
					log(bot, createEmbed(msg, bot, true, "New command ran.", {
						"Success": [false, true],
						"Reason": ["User had no permissions", true],
						"Command": [msg.content.slice(settings.normalPrefix.length).split(" ")[0], true],
						"Arguments": [msg.content.split(" ").slice(1).join(" ") ? msg.content.split(" ").slice(1).join(" ") : "None", true],
						"Message": [msg.content, true],
						"Username": [msg.author.username, true],
						"Discriminator": [msg.author.discriminator, true],
						"ID": [msg.author.id, true],
						"Owner": [getBotOwner(msg.author.id).botOwner, true],
						"Protected Owner": [getBotOwner(msg.author.id).protected, true],
						"Guild Name": [msg.guild.name, true],
						"Guild ID": [msg.guild.id, true],
						"Guild Owner Username": [msg.guild.owner.user.username, true],
						"Guild Owner Discriminator": [msg.guild.owner.user.discriminator, true],
						"Guild Owner ID": [msg.guild.ownerID, true]
					}, "", "", ["Command abuse = Blacklist"]))

					try {
						msg.channel.send(createEmbed(msg, bot, false, `You require the \`${normalCommand.userPermission}\` permission to run this command.`, {}, "", "Command Handler"))
					} catch {}

					return
				} 
				if (!msg.channel.permissionsFor(bot.user).has(normalCommand.userPermission)) {
					log(bot, createEmbed(msg, bot, true, "New command ran.", {
						"Success": [false, true],
						"Reason": ["Bot had no permissions", true],
						"Command": [msg.content.slice(settings.normalPrefix.length).split(" ")[0], true],
						"Arguments": [msg.content.split(" ").slice(1).join(" ") ? msg.content.split(" ").slice(1).join(" ") : "None", true],
						"Message": [msg.content, true],
						"Username": [msg.author.username, true],
						"Discriminator": [msg.author.discriminator, true],
						"ID": [msg.author.id, true],
						"Owner": [getBotOwner(msg.author.id).botOwner, true],
						"Protected Owner": [getBotOwner(msg.author.id).protected, true],
						"Guild Name": [msg.guild.name, true],
						"Guild ID": [msg.guild.id, true],
						"Guild Owner Username": [msg.guild.owner.user.username, true],
						"Guild Owner Discriminator": [msg.guild.owner.user.discriminator, true],
						"Guild Owner ID": [msg.guild.ownerID, true]
					}, "", "", ["Command abuse = Blacklist"]))

					try {
						msg.channel.send(createEmbed(msg, bot, false, `I require the \`${normalCommand.botPermission}\` permission to run this command.`, {}, "", "Command Handler"))
					} catch {}
					
					return
				}
			}
			if (!checkArgument(normalCommand.arguments, args)[0]) {
				const missingArgs = checkArgument(normalCommand.arguments, args)[1]

				if (msg.channel.type === "text") {
					log(bot, createEmbed(msg, bot, true, "New command ran.", {
						"Success": [false, true],
						"Reason": ["Missing arguments", true],
						"Command": [msg.content.slice(settings.normalPrefix.length).split(" ")[0], true],
						"Arguments": [msg.content.split(" ").slice(1).join(" ") ? msg.content.split(" ").slice(1).join(" ") : "None", true],
						"Message": [msg.content, true],
						"Username": [msg.author.username, true],
						"Discriminator": [msg.author.discriminator, true],
						"ID": [msg.author.id, true],
						"Owner": [getBotOwner(msg.author.id).botOwner, true],
						"Protected Owner": [getBotOwner(msg.author.id).protected, true],
						"Guild Name": [msg.guild.name, true],
						"Guild ID": [msg.guild.id, true],
						"Guild Owner Username": [msg.guild.owner.user.username, true],
						"Guild Owner Discriminator": [msg.guild.owner.user.discriminator, true],
						"Guild Owner ID": [msg.guild.ownerID, true]
					}, "", "", ["Command abuse = Blacklist"]))
				} else {
					log(bot, createEmbed(msg, bot, true, "New command ran.", {
						"Success": [false, true],
						"Reason": ["Missing arguments", true],
						"Command": [msg.content.slice(settings.normalPrefix.length).split(" ")[0], true],
						"Arguments": [msg.content.split(" ").slice(1).join(" ") ? msg.content.split(" ").slice(1).join(" ") : "None", true],
						"Message": [msg.content, true],
						"Username": [msg.author.username, true],
						"Discriminator": [msg.author.discriminator, true],
						"ID": [msg.author.id, true],
						"Owner": [getBotOwner(msg.author.id).botOwner, true],
						"Protected Owner": [getBotOwner(msg.author.id).protected, true]
					}, "", "", ["Command abuse = Blacklist"]))
				}

				msg.channel.send(createEmbed(msg, bot, false, `You're missing the \`${missingArgs}\` ${missingArgs.split(" ").length === 1 ? "argument" : "arguments"}.`, {}, "", "Command Handler"))
				return
			}
			normalCommand.run(bot, msg, args).then(() => {
				if (msg.channel.type === "text") {
					log(bot, createEmbed(msg, bot, true, "New command ran.", {
						"Success": [true, true],
						"Command": [msg.content.slice(settings.normalPrefix.length).split(" ")[0], true],
						"Arguments": [msg.content.split(" ").slice(1).join(" ") ? msg.content.split(" ").slice(1).join(" ") : "None", true],
						"Message": [msg.content, true],
						"Username": [msg.author.username, true],
						"Discriminator": [msg.author.discriminator, true],
						"ID": [msg.author.id, true],
						"Owner": [getBotOwner(msg.author.id).botOwner, true],
						"Protected Owner": [getBotOwner(msg.author.id).protected, true],
						"Guild Name": [msg.guild.name, true],
						"Guild ID": [msg.guild.id, true],
						"Guild Owner Username": [msg.guild.owner.user.username, true],
						"Guild Owner Discriminator": [msg.guild.owner.user.discriminator, true],
						"Guild Owner ID": [msg.guild.ownerID, true]
					}, "", "", ["Command abuse = Blacklist"]))
				} else {
					log(bot, createEmbed(msg, bot, true, "New command ran.", {
						"Success": [true, true],
						"Command": [msg.content.slice(settings.normalPrefix.length).split(" ")[0], true],
						"Arguments": [msg.content.split(" ").slice(1).join(" ") ? msg.content.split(" ").slice(1).join(" ") : "None", true],
						"Message": [msg.content, true],
						"Username": [msg.author.username, true],
						"Discriminator": [msg.author.discriminator, true],
						"ID": [msg.author.id, true],
						"Owner": [getBotOwner(msg.author.id).botOwner, true],
						"Protected Owner": [getBotOwner(msg.author.id).protected, true]
					}, "", "", ["Command abuse = Blacklist"]))
				}
			}).catch(reason => {
				console.log(reason)
				if (msg.channel.type === "text") {
					log(bot, createEmbed(msg, bot, true, "New command ran.", {
						"Success": [false, true],
						"Reason": [reason, true],
						"Command": [msg.content.slice(settings.normalPrefix.length).split(" ")[0], true],
						"Arguments": [msg.content.split(" ").slice(1).join(" ") ? msg.content.split(" ").slice(1).join(" ") : "None", true],
						"Message": [msg.content, true],
						"Username": [msg.author.username, true],
						"Discriminator": [msg.author.discriminator, true],
						"ID": [msg.author.id, true],
						"Owner": [getBotOwner(msg.author.id).botOwner, true],
						"Protected Owner": [getBotOwner(msg.author.id).protected, true],
						"Guild Name": [msg.guild.name, true],
						"Guild ID": [msg.guild.id, true],
						"Guild Owner Username": [msg.guild.owner.user.username, true],
						"Guild Owner Discriminator": [msg.guild.owner.user.discriminator, true],
						"Guild Owner ID": [msg.guild.ownerID, true]
					}, "", "", ["Command abuse = Blacklist"]))
				} else {
					log(bot, createEmbed(msg, bot, true, "New command ran.", {
						"Success": [false, true],
						"Reason": [reason, true],
						"Command": [msg.content.slice(settings.normalPrefix.length).split(" ")[0], true],
						"Arguments": [msg.content.split(" ").slice(1).join(" ") ? msg.content.split(" ").slice(1).join(" ") : "None", true],
						"Message": [msg.content, true],
						"Username": [msg.author.username, true],
						"Discriminator": [msg.author.discriminator, true],
						"ID": [msg.author.id, true],
						"Owner": [getBotOwner(msg.author.id).botOwner, true],
						"Protected Owner": [getBotOwner(msg.author.id).protected, true]
					}, "", "", ["Command abuse = Blacklist"]))
				}
			})
		} else {
			let found = false

			bot.normalCommandList.forEach(fileInfo => {
				if (fileInfo.altNames.includes(msg.content.slice(settings.normalPrefix.length).split(" ")[0])) {
					runCommand(bot, msg, `${settings.normalPrefix}${fileInfo.name} ${msg.content.split(" ").slice(1).join(" ")}`, true)
				
					found = true
				}
			})

			if (!found) {
				if (msg.channel.type === "text") {
					log(bot, createEmbed(msg, bot, true, "New command ran.", {
						"Success": [false, true],
						"Reason": ["Command not found", true],
						"Command": [msg.content.slice(settings.normalPrefix.length).split(" ")[0], true],
						"Arguments": [msg.content.split(" ").slice(1).join(" ") ? msg.content.split(" ").slice(1).join(" ") : "None", true],
						"Message": [msg.content, true],
						"Username": [msg.author.username, true],
						"Discriminator": [msg.author.discriminator, true],
						"ID": [msg.author.id, true],
						"Owner": [getBotOwner(msg.author.id).botOwner, true],
						"Protected Owner": [getBotOwner(msg.author.id).protected, true],
						"Guild Name": [msg.guild.name, true],
						"Guild ID": [msg.guild.id, true],
						"Guild Owner Username": [msg.guild.owner.user.username, true],
						"Guild Owner Discriminator": [msg.guild.owner.user.discriminator, true],
						"Guild Owner ID": [msg.guild.ownerID, true]
					}, "", "", ["Command abuse = Blacklist"]))
				} else {
					log(bot, createEmbed(msg, bot, true, "New command ran.", {
						"Success": [false, true],
						"Reason": ["Command not found", true],
						"Command": [msg.content.slice(settings.normalPrefix.length).split(" ")[0], true],
						"Arguments": [msg.content.split(" ").slice(1).join(" ") ? msg.content.split(" ").slice(1).join(" ") : "None", true],
						"Message": [msg.content, true],
						"Username": [msg.author.username, true],
						"Discriminator": [msg.author.discriminator, true],
						"ID": [msg.author.id, true],
						"Owner": [getBotOwner(msg.author.id).botOwner, true],
						"Protected Owner": [getBotOwner(msg.author.id).protected, true]
					}, "", "", ["Command abuse = Blacklist"]))
				}
		
				let selected = ""
		
				bot.normalCommandList.forEach(fileInfo => {
					if (fileInfo.name.includes(msg.content.slice(settings.managePrefix.length).split(" ")[0])) {
						if (!fileInfo.enabled) return
		
						selected = fileInfo.name
					}
				})
		
				if (selected[0]) {
					msg.channel.send(createEmbed(msg, bot, false, `That command doesn't exist, I think you meant \`${selected}\`.`, {}, "", "Command Handler"))
				} else msg.channel.send(createEmbed(msg, bot, false, "That command doesn't exist.", {}, "", "Command Handler"))
			}
		}
	} else {
		msg.channel.startTyping()

		setTimeout(() => {
			const normalCommand = bot.normalCommandList.get(msg.content.slice(settings.normalPrefix.length).split(" ")[0])
	
			const args = parseArgument(msg.content.split(" ").slice(1).join(" ")).filter(str => {
				return /\S/.test(str)
			})
			
			if (normalCommand) {
				if (hasAndGetCooldown(normalCommand.name, msg.author.id)[0] && !humanizeDuration(hasAndGetCooldown(normalCommand.name, msg.author.id)[1] - Date.now()).startsWith("0")) {
					msg.channel.stopTyping()
	
					if (msg.channel.type === "text") {
						log(bot, createEmbed(msg, bot, true, "New command ran.", {
							"Success": [false, true],
							"Reason": ["Cooldown", true],
							"Command": [msg.content.slice(settings.normalPrefix.length).split(" ")[0], true],
							"Arguments": [msg.content.split(" ").slice(1).join(" ") ? msg.content.split(" ").slice(1).join(" ") : "None", true],
							"Message": [msg.content, true],
							"Username": [msg.author.username, true],
							"Discriminator": [msg.author.discriminator, true],
							"ID": [msg.author.id, true],
							"Owner": [false, true],
							"Protected Owner": [false, true],
							"Guild Name": [msg.guild.name, true],
							"Guild ID": [msg.guild.id, true],
							"Guild Owner Username": [msg.guild.owner.user.username, true],
							"Guild Owner Discriminator": [msg.guild.owner.user.discriminator, true],
							"Guild Owner ID": [msg.guild.ownerID, true]
						}, "", "", ["Command abuse = Blacklist"]))
					} else {
						log(bot, createEmbed(msg, bot, true, "New command ran.", {
							"Success": [false, true],
							"Reason": ["Cooldown", true],
							"Command": [msg.content.slice(settings.normalPrefix.length).split(" ")[0], true],
							"Arguments": [msg.content.split(" ").slice(1).join(" ") ? msg.content.split(" ").slice(1).join(" ") : "None", true],
							"Message": [msg.content, true],
							"Username": [msg.author.username, true],
							"Discriminator": [msg.author.discriminator, true],
							"ID": [msg.author.id, true],
							"Owner": [getBotOwner(msg.author.id).botOwner, true],
							"Protected Owner": [getBotOwner(msg.author.id).protected, true]
						}, "", "", ["Command abuse = Blacklist"]))
					}
	
					msg.channel.send(createEmbed(msg, bot, false, `Please wait \`${humanizeDuration(hasAndGetCooldown(normalCommand.name, msg.author.id)[1] - Date.now(), {round: true})}\`, then try again.`, {}, "", "Command Handler"))
					return
				}
				if (!normalCommand.enabled) {
					msg.channel.stopTyping()
	
					if (msg.channel.type === "text") {
						log(bot, createEmbed(msg, bot, true, "New command ran.", {
							"Success": [false, true],
							"Reason": ["Disabled command", true],
							"Command": [msg.content.slice(settings.normalPrefix.length).split(" ")[0], true],
							"Arguments": [msg.content.split(" ").slice(1).join(" ") ? msg.content.split(" ").slice(1).join(" ") : "None", true],
							"Message": [msg.content, true],
							"Username": [msg.author.username, true],
							"Discriminator": [msg.author.discriminator, true],
							"ID": [msg.author.id, true],
							"Owner": [getBotOwner(msg.author.id).botOwner, true],
							"Protected Owner": [getBotOwner(msg.author.id).protected, true],
							"Guild Name": [msg.guild.name, true],
							"Guild ID": [msg.guild.id, true],
							"Guild Owner Username": [msg.guild.owner.user.username, true],
							"Guild Owner Discriminator": [msg.guild.owner.user.discriminator, true],
							"Guild Owner ID": [msg.guild.ownerID, true]
						}, "", "", ["Command abuse = Blacklist"]))
					} else {
						log(bot, createEmbed(msg, bot, true, "New command ran.", {
							"Success": [false, true],
							"Reason": ["Disabled command", true],
							"Command": [msg.content.slice(settings.normalPrefix.length).split(" ")[0], true],
							"Arguments": [msg.content.split(" ").slice(1).join(" ") ? msg.content.split(" ").slice(1).join(" ") : "None", true],
							"Message": [msg.content, true],
							"Username": [msg.author.username, true],
							"Discriminator": [msg.author.discriminator, true],
							"ID": [msg.author.id, true],
							"Owner": [getBotOwner(msg.author.id).botOwner, true],
							"Protected Owner": [getBotOwner(msg.author.id).protected, true]
						}, "", "", ["Command abuse = Blacklist"]))
					}
	
					msg.channel.send(createEmbed(msg, bot, false, "This command is currently disabled.", {}, "", "Command Handler"))
					return
				}
				if (normalCommand.botOwnerOnly && !getBotOwner(msg.author.id).botOwner) {
					msg.channel.stopTyping()
	
					if (msg.channel.type === "text") {
						log(bot, createEmbed(msg, bot, true, "New command ran.", {
							"Success": [false, true],
							"Reason": ["Bot owner only", true],
							"Command": [msg.content.slice(settings.normalPrefix.length).split(" ")[0], true],
							"Arguments": [msg.content.split(" ").slice(1).join(" ") ? msg.content.split(" ").slice(1).join(" ") : "None", true],
							"Message": [msg.content, true],
							"Username": [msg.author.username, true],
							"Discriminator": [msg.author.discriminator, true],
							"ID": [msg.author.id, true],
							"Owner": [getBotOwner(msg.author.id).botOwner, true],
							"Protected Owner": [getBotOwner(msg.author.id).protected, true],
							"Guild Name": [msg.guild.name, true],
							"Guild ID": [msg.guild.id, true],
							"Guild Owner Username": [msg.guild.owner.user.username, true],
							"Guild Owner Discriminator": [msg.guild.owner.user.discriminator, true],
							"Guild Owner ID": [msg.guild.ownerID, true]
						}, "", "", ["Command abuse = Blacklist"]))
					} else {
						log(bot, createEmbed(msg, bot, true, "New command ran.", {
							"Success": [false, true],
							"Reason": ["Bot owner only", true],
							"Command": [msg.content.slice(settings.normalPrefix.length).split(" ")[0], true],
							"Arguments": [msg.content.split(" ").slice(1).join(" ") ? msg.content.split(" ").slice(1).join(" ") : "None", true],
							"Message": [msg.content, true],
							"Username": [msg.author.username, true],
							"Discriminator": [msg.author.discriminator, true],
							"ID": [msg.author.id, true],
							"Owner": [getBotOwner(msg.author.id).botOwner, true],
							"Protected Owner": [getBotOwner(msg.author.id).protected, true]
						}, "", "", ["Command abuse = Blacklist"]))
					}
	
					msg.channel.send(createEmbed(msg, bot, false, "This command can only be ran by bot owners.", {}, "", "Command Handler"))
					return
				}
				if (normalCommand.supportGuildOnly && msg.guild.id !== settings.supportGuild) {
					msg.channel.stopTyping()
	
					if (msg.channel.type === "text") {
						log(bot, createEmbed(msg, bot, true, "New command ran.", {
							"Success": [false, true],
							"Reason": ["Support guild only", true],
							"Command": [msg.content.slice(settings.normalPrefix.length).split(" ")[0], true],
							"Arguments": [msg.content.split(" ").slice(1).join(" ") ? msg.content.split(" ").slice(1).join(" ") : "None", true],
							"Message": [msg.content, true],
							"Username": [msg.author.username, true],
							"Discriminator": [msg.author.discriminator, true],
							"ID": [msg.author.id, true],
							"Owner": [getBotOwner(msg.author.id).botOwner, true],
							"Protected Owner": [getBotOwner(msg.author.id).protected, true],
							"Guild Name": [msg.guild.name, true],
							"Guild ID": [msg.guild.id, true],
							"Guild Owner Username": [msg.guild.owner.user.username, true],
							"Guild Owner Discriminator": [msg.guild.owner.user.discriminator, true],
							"Guild Owner ID": [msg.guild.ownerID, true]
						}, "", "", ["Command abuse = Blacklist"]))
					} else {
						log(bot, createEmbed(msg, bot, true, "New command ran.", {
							"Success": [false, true],
							"Reason": ["Support guild only", true],
							"Command": [msg.content.slice(settings.normalPrefix.length).split(" ")[0], true],
							"Arguments": [msg.content.split(" ").slice(1).join(" ") ? msg.content.split(" ").slice(1).join(" ") : "None", true],
							"Message": [msg.content, true],
							"Username": [msg.author.username, true],
							"Discriminator": [msg.author.discriminator, true],
							"ID": [msg.author.id, true],
							"Owner": [getBotOwner(msg.author.id).botOwner, true],
							"Protected Owner": [getBotOwner(msg.author.id).protected, true]
						}, "", "", ["Command abuse = Blacklist"]))
					}
	
					msg.channel.send(createEmbed(msg, bot, false, "This command only works in the support guild.", {}, "", "Command Handler"))
					return
				}
				if (!normalCommand.dms && msg.channel.type === "dm") {
					msg.channel.stopTyping()
	
					log(bot, createEmbed(msg, bot, true, "New command ran.", {
						"Success": [false, true],
						"Reason": ["Guild only command in DMs", true],
						"Command": [msg.content.slice(settings.normalPrefix.length).split(" ")[0], true],
						"Arguments": [msg.content.split(" ").slice(1).join(" ") ? msg.content.split(" ").slice(1).join(" ") : "None", true],
						"Message": [msg.content, true],
						"Username": [msg.author.username, true],
						"Discriminator": [msg.author.discriminator, true],
						"ID": [msg.author.id, true],
						"Owner": [getBotOwner(msg.author.id).botOwner, true],
						"Protected Owner": [getBotOwner(msg.author.id).protected, true]
					}, "", "", ["Command abuse = Blacklist"]))
	
					msg.channel.send(createEmbed(msg, bot, false, "This command doesn't work in DMs.", {}, "", "Command Handler"))
					return
				}
				if (msg.channel.type === "text") {
					if (!msg.channel.permissionsFor(msg.author).has(normalCommand.userPermission)) {
						msg.channel.stopTyping()
	
						log(bot, createEmbed(msg, bot, true, "New command ran.", {
							"Success": [false, true],
							"Reason": ["User had no permissions", true],
							"Command": [msg.content.slice(settings.normalPrefix.length).split(" ")[0], true],
							"Arguments": [msg.content.split(" ").slice(1).join(" ") ? msg.content.split(" ").slice(1).join(" ") : "None", true],
							"Message": [msg.content, true],
							"Username": [msg.author.username, true],
							"Discriminator": [msg.author.discriminator, true],
							"ID": [msg.author.id, true],
							"Owner": [getBotOwner(msg.author.id).botOwner, true],
							"Protected Owner": [getBotOwner(msg.author.id).protected, true],
							"Guild Name": [msg.guild.name, true],
							"Guild ID": [msg.guild.id, true],
							"Guild Owner Username": [msg.guild.owner.user.username, true],
							"Guild Owner Discriminator": [msg.guild.owner.user.discriminator, true],
							"Guild Owner ID": [msg.guild.ownerID, true]
						}, "", "", ["Command abuse = Blacklist"]))
	
						try {
							msg.channel.send(createEmbed(msg, bot, false, `You require the \`${normalCommand.userPermission}\` permission to run this command.`, {}, "", "Command Handler"))
						} catch {}
	
						return
					} 
					if (!msg.channel.permissionsFor(bot.user).has(normalCommand.userPermission)) {
						msg.channel.stopTyping()
	
						log(bot, createEmbed(msg, bot, true, "New command ran.", {
							"Success": [false, true],
							"Reason": ["Bot had no permissions", true],
							"Command": [msg.content.slice(settings.normalPrefix.length).split(" ")[0], true],
							"Arguments": [msg.content.split(" ").slice(1).join(" ") ? msg.content.split(" ").slice(1).join(" ") : "None", true],
							"Message": [msg.content, true],
							"Username": [msg.author.username, true],
							"Discriminator": [msg.author.discriminator, true],
							"ID": [msg.author.id, true],
							"Owner": [getBotOwner(msg.author.id).botOwner, true],
							"Protected Owner": [getBotOwner(msg.author.id).protected, true],
							"Guild Name": [msg.guild.name, true],
							"Guild ID": [msg.guild.id, true],
							"Guild Owner Username": [msg.guild.owner.user.username, true],
							"Guild Owner Discriminator": [msg.guild.owner.user.discriminator, true],
							"Guild Owner ID": [msg.guild.ownerID, true]
						}, "", "", ["Command abuse = Blacklist"]))
	
						try {
							msg.channel.send(createEmbed(msg, bot, false, `I require the \`${normalCommand.botPermission}\` permission to run this command.`, {}, "", "Command Handler"))
						} catch {}
	
						return
					}
				}
				if (!checkArgument(normalCommand.arguments, args)[0]) {
					const missingArgs = checkArgument(normalCommand.arguments, args)[1]
	
					msg.channel.stopTyping()
	
					if (msg.channel.type === "text") {
						log(bot, createEmbed(msg, bot, true, "New command ran.", {
							"Success": [false, true],
							"Reason": ["Missing arguments", true],
							"Command": [msg.content.slice(settings.normalPrefix.length).split(" ")[0], true],
							"Arguments": [msg.content.split(" ").slice(1).join(" ") ? msg.content.split(" ").slice(1).join(" ") : "None", true],
							"Message": [msg.content, true],
							"Username": [msg.author.username, true],
							"Discriminator": [msg.author.discriminator, true],
							"ID": [msg.author.id, true],
							"Owner": [getBotOwner(msg.author.id).botOwner, true],
							"Protected Owner": [getBotOwner(msg.author.id).protected, true],
							"Guild Name": [msg.guild.name, true],
							"Guild ID": [msg.guild.id, true],
							"Guild Owner Username": [msg.guild.owner.user.username, true],
							"Guild Owner Discriminator": [msg.guild.owner.user.discriminator, true],
							"Guild Owner ID": [msg.guild.ownerID, true]
						}, "", "", ["Command abuse = Blacklist"]))
					} else {
						log(bot, createEmbed(msg, bot, true, "New command ran.", {
							"Success": [false, true],
							"Reason": ["Missing arguments", true],
							"Command": [msg.content.slice(settings.normalPrefix.length).split(" ")[0], true],
							"Arguments": [msg.content.split(" ").slice(1).join(" ") ? msg.content.split(" ").slice(1).join(" ") : "None", true],
							"Message": [msg.content, true],
							"Username": [msg.author.username, true],
							"Discriminator": [msg.author.discriminator, true],
							"ID": [msg.author.id, true],
							"Owner": [getBotOwner(msg.author.id).botOwner, true],
							"Protected Owner": [getBotOwner(msg.author.id).protected, true]
						}, "", "", ["Command abuse = Blacklist"]))
					}
	
					msg.channel.send(createEmbed(msg, bot, false, `You're missing the \`${missingArgs}\` ${missingArgs.split(" ").length === 1 ? "argument" : "arguments"}.`, {}, "", "Command Handler"))
					return
				}
				
				setCooldown(normalCommand.name, msg.author.id, Date.now() + normalCommand.time)
				
				setTimeout(() => {
					deleteCooldown(normalCommand.name, msg.author.id)
				}, normalCommand.time)

				normalCommand.run(bot, msg, args).then(() => {
					if (msg.channel.type === "text") {
						log(bot, createEmbed(msg, bot, true, "New command ran.", {
							"Success": [true, true],
							"Command": [msg.content.slice(settings.normalPrefix.length).split(" ")[0], true],
							"Arguments": [msg.content.split(" ").slice(1).join(" ") ? msg.content.split(" ").slice(1).join(" ") : "None", true],
							"Message": [msg.content, true],
							"Username": [msg.author.username, true],
							"Discriminator": [msg.author.discriminator, true],
							"ID": [msg.author.id, true],
							"Owner": [getBotOwner(msg.author.id).botOwner, true],
							"Protected Owner": [getBotOwner(msg.author.id).protected, true],
							"Guild Name": [msg.guild.name, true],
							"Guild ID": [msg.guild.id, true],
							"Guild Owner Username": [msg.guild.owner.user.username, true],
							"Guild Owner Discriminator": [msg.guild.owner.user.discriminator, true],
							"Guild Owner ID": [msg.guild.ownerID, true]
						}, "", "", ["Command abuse = Blacklist"]))
					} else {
						log(bot, createEmbed(msg, bot, true, "New command ran.", {
							"Success": [true, true],
							"Command": [msg.content.slice(settings.normalPrefix.length).split(" ")[0], true],
							"Arguments": [msg.content.split(" ").slice(1).join(" ") ? msg.content.split(" ").slice(1).join(" ") : "None", true],
							"Message": [msg.content, true],
							"Username": [msg.author.username, true],
							"Discriminator": [msg.author.discriminator, true],
							"ID": [msg.author.id, true],
							"Owner": [getBotOwner(msg.author.id).botOwner, true],
							"Protected Owner": [getBotOwner(msg.author.id).protected, true]
						}, "", "", ["Command abuse = Blacklist"]))
					}
				}).catch(reason => {
					if (msg.channel.type === "text") {
						log(bot, createEmbed(msg, bot, true, "New command ran.", {
							"Success": [false, true],
							"Reason": [reason, true],
							"Command": [msg.content.slice(settings.normalPrefix.length).split(" ")[0], true],
							"Arguments": [msg.content.split(" ").slice(1).join(" ") ? msg.content.split(" ").slice(1).join(" ") : "None", true],
							"Message": [msg.content, true],
							"Username": [msg.author.username, true],
							"Discriminator": [msg.author.discriminator, true],
							"ID": [msg.author.id, true],
							"Owner": [getBotOwner(msg.author.id).botOwner, true],
							"Protected Owner": [getBotOwner(msg.author.id).protected, true],
							"Guild Name": [msg.guild.name, true],
							"Guild ID": [msg.guild.id, true],
							"Guild Owner Username": [msg.guild.owner.user.username, true],
							"Guild Owner Discriminator": [msg.guild.owner.user.discriminator, true],
							"Guild Owner ID": [msg.guild.ownerID, true]
						}, "", "", ["Command abuse = Blacklist"]))
					} else {
						log(bot, createEmbed(msg, bot, true, "New command ran.", {
							"Success": [false, true],
							"Reason": [reason, true],
							"Command": [msg.content.slice(settings.normalPrefix.length).split(" ")[0], true],
							"Arguments": [msg.content.split(" ").slice(1).join(" ") ? msg.content.split(" ").slice(1).join(" ") : "None", true],
							"Message": [msg.content, true],
							"Username": [msg.author.username, true],
							"Discriminator": [msg.author.discriminator, true],
							"ID": [msg.author.id, true],
							"Owner": [getBotOwner(msg.author.id).botOwner, true],
							"Protected Owner": [getBotOwner(msg.author.id).protected, true]
						}, "", "", ["Command abuse = Blacklist"]))
					}
				})
				
				msg.channel.stopTyping()
			} else {
				msg.channel.stopTyping()
				let found = false

				bot.normalCommandList.forEach(fileInfo => {
					if (fileInfo.altNames.includes(msg.content.slice(settings.normalPrefix.length).split(" ")[0])) {
						runCommand(bot, msg, `${settings.normalPrefix}${fileInfo.name} ${msg.content.split(" ").slice(1).join(" ")}`, true)
					
						found = true
					}
				})

				if (!found) {
					if (msg.channel.type === "text") {
						log(bot, createEmbed(msg, bot, true, "New command ran.", {
							"Success": [false, true],
							"Reason": ["Command not found", true],
							"Command": [msg.content.slice(settings.normalPrefix.length).split(" ")[0], true],
							"Arguments": [msg.content.split(" ").slice(1).join(" ") ? msg.content.split(" ").slice(1).join(" ") : "None", true],
							"Message": [msg.content, true],
							"Username": [msg.author.username, true],
							"Discriminator": [msg.author.discriminator, true],
							"ID": [msg.author.id, true],
							"Owner": [getBotOwner(msg.author.id).botOwner, true],
							"Protected Owner": [getBotOwner(msg.author.id).protected, true],
							"Guild Name": [msg.guild.name, true],
							"Guild ID": [msg.guild.id, true],
							"Guild Owner Username": [msg.guild.owner.user.username, true],
							"Guild Owner Discriminator": [msg.guild.owner.user.discriminator, true],
							"Guild Owner ID": [msg.guild.ownerID, true]
						}, "", "", ["Command abuse = Blacklist"]))
					} else {
						log(bot, createEmbed(msg, bot, true, "New command ran.", {
							"Success": [false, true],
							"Reason": ["Command not found", true],
							"Command": [msg.content.slice(settings.normalPrefix.length).split(" ")[0], true],
							"Arguments": [msg.content.split(" ").slice(1).join(" ") ? msg.content.split(" ").slice(1).join(" ") : "None", true],
							"Message": [msg.content, true],
							"Username": [msg.author.username, true],
							"Discriminator": [msg.author.discriminator, true],
							"ID": [msg.author.id, true],
							"Owner": [getBotOwner(msg.author.id).botOwner, true],
							"Protected Owner": [getBotOwner(msg.author.id).protected, true]
						}, "", "", ["Command abuse = Blacklist"]))
					}
			
					let selected = ""
			
					bot.normalCommandList.forEach(fileinfo => {
						if (fileinfo.name.includes(msg.content.slice(settings.managePrefix.length).split(" ")[0])) {
							if (!fileinfo.enabled) return
			
							selected = fileinfo.name
						}
					})
			
					if (selected[0]) {
						msg.channel.send(createEmbed(msg, bot, false, `That command doesn't exist, I think you meant \`${selected}\`.`, {}, "", "Command Handler"))
					} else msg.channel.send(createEmbed(msg, bot, false, "That command doesn't exist.", {}, "", "Command Handler"))	
				}
			}
		}, 1000)
	}
}

function runManageCommand(bot, msg, command) {
	const args = parseArgument(msg.content.split(" ").slice(1).join(" ")).filter(str => {
		return /\S/.test(str)
	})

	if (command) msg.content = command

	if (!getBotOwner(msg.author.id).botOwner) {
		if (msg.channel.type === "text") {
			log(bot, createEmbed(msg, bot, true, "New manage command ran.", {
				"Success": [false, true],
				"Reason": ["Bot owner only", true],
				"Command": [msg.content.slice(settings.managePrefix.length).split(" ")[0], true],
				"Arguments": [msg.content.split(" ").slice(1).join(" ") ? msg.content.split(" ").slice(1).join(" ") : "None", true],
				"Message": [msg.content, true],
				"Username": [msg.author.username, true],
				"Discriminator": [msg.author.discriminator, true],
				"ID": [msg.author.id, true],
				"Owner": [false, true],
				"Protected Owner": [false, true],
				"Guild Name": [msg.guild.name, true],
				"Guild ID": [msg.guild.id, true],
				"Guild Owner Username": [msg.guild.owner.user.username, true],
				"Guild Owner Discriminator": [msg.guild.owner.user.discriminator, true],
				"Guild Owner ID": [msg.guild.ownerID, true]
			}, "", "", ["Command abuse = Blacklist"]))
		} else {
			log(bot, createEmbed(msg, bot, true, "New manage command ran.", {
				"Success": [false, true],
				"Reason": ["Bot owner only", true],
				"Command": [msg.content.slice(settings.managePrefix.length).split(" ")[0], true],
				"Arguments": [msg.content.split(" ").slice(1).join(" ") ? msg.content.split(" ").slice(1).join(" ") : "None", true],
				"Message": [msg.content, true],
				"Username": [msg.author.username, true],
				"Discriminator": [msg.author.discriminator, true],
				"ID": [msg.author.id, true],
				"Owner": [false, true],
				"Protected Owner": [false, true]
			}, "", "", ["Command abuse = Blacklist"]))
		}

		msg.channel.send(createEmbed(msg, bot, false, "This command can only be ran by bot owners.", {}, "", "Command Handler"))
		return
	}
	
	if (msg.channel.type === "dm") {
		log(bot, createEmbed(msg, bot, true, "New manage command ran.", {
			"Success": [false, true],
			"Reason": ["Guild only command in DMs", true],
			"Command": [msg.content.slice(settings.managePrefix.length).split(" ")[0], true],
			"Arguments": [msg.content.split(" ").slice(1).join(" ") ? msg.content.split(" ").slice(1).join(" ") : "None", true],
			"Message": [msg.content, true],
			"Username": [msg.author.username, true],
			"Discriminator": [msg.author.discriminator, true],
			"ID": [msg.author.id, true],
			"Owner": [getBotOwner(msg.author.id).botOwner, true],
			"Protected Owner": [getBotOwner(msg.author.id).protected, true]
		}, "", "", ["Command abuse = Blacklist"]))

		msg.channel.send(createEmbed(msg, bot, false, "This command doesn't work in DMs.", {}, "", "Command Handler"))
		return
	}

    const manageCommand = bot.manageCommandList.get(msg.content.slice(settings.managePrefix.length).split(" ")[0])

    if (manageCommand) {
        if (!manageCommand.enabled) {
			log(bot, createEmbed(msg, bot, true, "New manage command ran.", {
				"Success": [false, true],
				"Reason": ["Disabled command", true],
				"Command": [msg.content.slice(settings.managePrefix.length).split(" ")[0], true],
				"Arguments": [msg.content.split(" ").slice(1).join(" ") ? msg.content.split(" ").slice(1).join(" ") : "None", true],
				"Message": [msg.content, true],
				"Username": [msg.author.username, true],
				"Discriminator": [msg.author.discriminator, true],
				"ID": [msg.author.id, true],
				"Owner": [getBotOwner(msg.author.id).botOwner, true],
				"Protected Owner": [getBotOwner(msg.author.id).protected, true],
				"Guild Name": [msg.guild.name, true],
				"Guild ID": [msg.guild.id, true],
				"Guild Owner Username": [msg.guild.owner.user.username, true],
				"Guild Owner Discriminator": [msg.guild.owner.user.discriminator, true],
				"Guild Owner ID": [msg.guild.ownerID, true]
			}, "", "", ["Command abuse = Blacklist"]))

            msg.channel.send(createEmbed(msg, bot, false, "This command is currently disabled.", {}, "", "Command Handler"))
            return
        }
        if (!checkArgument(manageCommand.arguments, args)[0]) {
			const missingArgs = checkArgument(manageCommand.arguments, args)[1]

			log(bot, createEmbed(msg, bot, true, "New manage command ran.", {
				"Success": [false, true],
				"Reason": ["Missing arguments", true],
				"Command": [msg.content.slice(settings.managePrefix.length).split(" ")[0], true],
				"Arguments": [msg.content.split(" ").slice(1).join(" ") ? msg.content.split(" ").slice(1).join(" ") : "None", true],
				"Message": [msg.content, true],
				"Username": [msg.author.username, true],
				"Discriminator": [msg.author.discriminator, true],
				"ID": [msg.author.id, true],
				"Owner": [getBotOwner(msg.author.id).botOwner, true],
				"Protected Owner": [getBotOwner(msg.author.id).protected, true],
				"Guild Name": [msg.guild.name, true],
				"Guild ID": [msg.guild.id, true],
				"Guild Owner Username": [msg.guild.owner.user.username, true],
				"Guild Owner Discriminator": [msg.guild.owner.user.discriminator, true],
				"Guild Owner ID": [msg.guild.ownerID, true]
			}, "", "", ["Command abuse = Blacklist"]))

            msg.channel.send(createEmbed(msg, bot, false, `You're missing the \`${missingArgs}\` ${missingArgs.split(" ").length === 1 ? "argument" : "arguments"}.`, {}, "",  "Command Handler"))
            return
		}

		manageCommand.run(bot, msg, args).then(() => {
			log(bot, createEmbed(msg, bot, true, "New manage command ran.", {
				"Success": [true, true],
				"Command": [msg.content.slice(settings.managePrefix.length).split(" ")[0], true],
				"Arguments": [msg.content.split(" ").slice(1).join(" ") ? msg.content.split(" ").slice(1).join(" ") : "None", true],
				"Message": [msg.content, true],
				"Username": [msg.author.username, true],
				"Discriminator": [msg.author.discriminator, true],
				"ID": [msg.author.id, true],
				"Owner": [getBotOwner(msg.author.id).botOwner, true],
				"Protected Owner": [getBotOwner(msg.author.id).protected, true],
				"Guild Name": [msg.guild.name, true],
				"Guild ID": [msg.guild.id, true],
				"Guild Owner Username": [msg.guild.owner.user.username, true],
				"Guild Owner Discriminator": [msg.guild.owner.user.discriminator, true],
				"Guild Owner ID": [msg.guild.ownerID, true]
			}, "", "", ["Command abuse = Blacklist"]))
		}).catch(reason => {
			log(bot, createEmbed(msg, bot, true, "New manage command ran.", {
				"Success": [false, true],
				"Reason": [reason, true],
				"Command": [msg.content.slice(settings.managePrefix.length).split(" ")[0], true],
				"Arguments": [msg.content.split(" ").slice(1).join(" ") ? msg.content.split(" ").slice(1).join(" ") : "None", true],
				"Message": [msg.content, true],
				"Username": [msg.author.username, true],
				"Discriminator": [msg.author.discriminator, true],
				"ID": [msg.author.id, true],
				"Owner": [getBotOwner(msg.author.id).botOwner, true],
				"Protected Owner": [getBotOwner(msg.author.id).protected, true],
				"Guild Name": [msg.guild.name, true],
				"Guild ID": [msg.guild.id, true],
				"Guild Owner Username": [msg.guild.owner.user.username, true],
				"Guild Owner Discriminator": [msg.guild.owner.user.discriminator, true],
				"Guild Owner ID": [msg.guild.ownerID, true]
			}, "", "", ["Command abuse = Blacklist"]))
		})
	} else {
		log(bot, createEmbed(msg, bot, true, "New manage command ran.", {
			"Success": [false, true],
			"Reason": ["Command not found", true],
			"Command": [msg.content.slice(settings.managePrefix.length).split(" ")[0], true],
			"Arguments": [msg.content.split(" ").slice(1).join(" ") ? msg.content.split(" ").slice(1).join(" ") : "None", true],
			"Message": [msg.content, true],
			"Username": [msg.author.username, true],
			"Discriminator": [msg.author.discriminator, true],
			"ID": [msg.author.id, true],
			"Owner": [getBotOwner(msg.author.id).botOwner, true],
			"Protected Owner": [getBotOwner(msg.author.id).protected, true],
			"Guild Name": [msg.guild.name, true],
			"Guild ID": [msg.guild.id, true],
			"Guild Owner Username": [msg.guild.owner.user.username, true],
			"Guild Owner Discriminator": [msg.guild.owner.user.discriminator, true],
			"Guild Owner ID": [msg.guild.ownerID, true]
		}, "", "", ["Command abuse = Blacklist"]))

		let selected = ""

		bot.manageCommandList.forEach(fileinfo => {
			if (fileinfo.name.includes(msg.content.slice(settings.managePrefix.length).split(" ")[0])) {
				if (!fileinfo.enabled) return

				selected = fileinfo.name
			}
		})

		if (selected[0]) {
			msg.channel.send(createEmbed(msg, bot, false, `That command doesn't exist, I think you meant \`${selected}\`.`, {}, "", "Command Handler"))
		} else msg.channel.send(createEmbed(msg, bot, false, "That command doesn't exist.", {}, "", "Command Handler"))
	}
}

module.exports.runCommand = runCommand
module.exports.runManageCommand = runManageCommand