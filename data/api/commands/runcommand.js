const humanizeDuration = require("humanize-duration")

const {settings} = require("../settings/botsettings")
const {isBotOwner} = require("./isbotowner")
const {checkArgument} = require("../arguments/checkargument")
const {hasAndGetCooldown, setCooldown, deleteCooldown} = require("./cooldown")
const {createEmbed} = require("../embed/createembed")
const {log} = require("../guild/log")

function runCommand(bot, msg, command = "") {
	if (command) msg.content = command
	msg.channel.startTyping()
	setTimeout(() => {
		const normalCommand = bot.normalCommandList.get(msg.content.slice(settings.normalPrefix.length).split(" ")[0])

		const args = msg.content.split(" ").filter(str => {
			return /\S/.test(str)
		}).slice(1)
		
		if (normalCommand) {
			if (hasAndGetCooldown(normalCommand.name, msg.author.id)[0] && !isBotOwner(msg.author.id)[0]) {
				msg.channel.stopTyping()
				log(bot, createEmbed("New command ran.", {
					"Success": [false, true],
					"Reason": ["Cooldown", true],
					"Command": [msg.content.slice(settings.normalPrefix.length).split(" ")[0], true],
					"Arguments": [args.join(" ") ? args.join(" ") : "None", true],
					"Message": [msg.content, true],
					"Username": [msg.author.username, true],
					"Discriminator": [msg.author.discriminator, true],
					"ID": [msg.author.id, true],
					"Owner": [isBotOwner(msg.author.id)[0], true],
					"Protected Owner": [isBotOwner(msg.author.id)[1], true],
					"Guild Name": [msg.guild.name, true],
					"Guild ID": [msg.guild.id, true],
					"Guild Owner Username": [msg.guild.owner.user.username, true],
					"Guild Owner Discriminator": [msg.guild.owner.user.discriminator, true],
					"Guild Owner ID": [msg.guild.ownerID, true]
				}, "", "", ["Command abuse = Blacklist"]))
				msg.channel.send(createEmbed(`Please wait \`${humanizeDuration(hasAndGetCooldown(normalCommand.name, msg.author.id)[1] - Date.now(), { round: true })}\`, then try again.`, {}, "", "Command Handler"))
				return
			}
			if (!normalCommand.enabled) {
				msg.channel.stopTyping()
				log(bot, createEmbed("New command ran.", {
					"Success": [false, true],
					"Reason": ["Disabled command", true],
					"Command": [msg.content.slice(settings.normalPrefix.length).split(" ")[0], true],
					"Arguments": [args.join(" ") ? args.join(" ") : "None", true],
					"Message": [msg.content, true],
					"Username": [msg.author.username, true],
					"Discriminator": [msg.author.discriminator, true],
					"ID": [msg.author.id, true],
					"Owner": [isBotOwner(msg.author.id)[0], true],
					"Protected Owner": [isBotOwner(msg.author.id)[1], true],
					"Guild Name": [msg.guild.name, true],
					"Guild ID": [msg.guild.id, true],
					"Guild Owner Username": [msg.guild.owner.user.username, true],
					"Guild Owner Discriminator": [msg.guild.owner.user.discriminator, true],
					"Guild Owner ID": [msg.guild.ownerID, true]
				}, "", "", ["Command abuse = Blacklist"]))
				msg.channel.send(createEmbed("This command is currently disabled.", {}, "", "Command Handler"))
				return
			}
			if (normalCommand.botOwnerOnly && !isBotOwner(msg.author.id)[0]) {
				msg.channel.stopTyping()
				log(bot, createEmbed("New command ran.", {
					"Success": [false, true],
					"Reason": ["Bot owner only", true],
					"Command": [msg.content.slice(settings.normalPrefix.length).split(" ")[0], true],
					"Arguments": [args.join(" ") ? args.join(" ") : "None", true],
					"Message": [msg.content, true],
					"Username": [msg.author.username, true],
					"Discriminator": [msg.author.discriminator, true],
					"ID": [msg.author.id, true],
					"Owner": [isBotOwner(msg.author.id)[0], true],
					"Protected Owner": [isBotOwner(msg.author.id)[1], true],
					"Guild Name": [msg.guild.name, true],
					"Guild ID": [msg.guild.id, true],
					"Guild Owner Username": [msg.guild.owner.user.username, true],
					"Guild Owner Discriminator": [msg.guild.owner.user.discriminator, true],
					"Guild Owner ID": [msg.guild.ownerID, true]
				}, "", "", ["Command abuse = Blacklist"]))
				msg.channel.send(createEmbed("This command can only be ran by bot owners.", {}, "", "Command Handler"))
				return
			}
			if (normalCommand.supportGuildOnly && msg.guild.id !== settings.supportGuild) {
				msg.channel.stopTyping()
				log(bot, createEmbed("New command ran.", {
					"Success": [false, true],
					"Reason": ["Support guild only", true],
					"Command": [msg.content.slice(settings.normalPrefix.length).split(" ")[0], true],
					"Arguments": [args.join(" ") ? args.join(" ") : "None", true],
					"Message": [msg.content, true],
					"Username": [msg.author.username, true],
					"Discriminator": [msg.author.discriminator, true],
					"ID": [msg.author.id, true],
					"Owner": [isBotOwner(msg.author.id)[0], true],
					"Protected Owner": [isBotOwner(msg.author.id)[1], true],
					"Guild Name": [msg.guild.name, true],
					"Guild ID": [msg.guild.id, true],
					"Guild Owner Username": [msg.guild.owner.user.username, true],
					"Guild Owner Discriminator": [msg.guild.owner.user.discriminator, true],
					"Guild Owner ID": [msg.guild.ownerID, true]
				}, "", "", ["Command abuse = Blacklist"]))
				msg.channel.send(createEmbed("This command only works in the support guild.", {}, "", "Command Handler"))
				return
			}
			if (!normalCommand.dms && msg.channel.type === "dm") {
				msg.channel.stopTyping()
				log(bot, createEmbed("New command ran.", {
					"Success": [false, true],
					"Reason": ["Guild only command in DMs", true],
					"Command": [msg.content.slice(settings.normalPrefix.length).split(" ")[0], true],
					"Arguments": [args.join(" ") ? args.join(" ") : "None", true],
					"Message": [msg.content, true],
					"Username": [msg.author.username, true],
					"Discriminator": [msg.author.discriminator, true],
					"ID": [msg.author.id, true],
					"Owner": [isBotOwner(msg.author.id)[0], true],
					"Protected Owner": [isBotOwner(msg.author.id)[1], true],
					"Guild Name": [msg.guild.name, true],
					"Guild ID": [msg.guild.id, true],
					"Guild Owner Username": [msg.guild.owner.user.username, true],
					"Guild Owner Discriminator": [msg.guild.owner.user.discriminator, true],
					"Guild Owner ID": [msg.guild.ownerID, true]
				}, "", "", ["Command abuse = Blacklist"]))
				msg.channel.send(createEmbed("This command doesn't work in DMs.", {}, "", "Command Handler"))
				return
			}
			if (msg.channel.type !== "dm") {
				if (msg.author.id !== msg.guild.ownerID && !msg.member.hasPermission("ADMINISTRATOR") && !msg.member.hasPermission(normalCommand.userPermission)) {
					msg.channel.stopTyping()
					log(bot, createEmbed("New command ran.", {
						"Success": [false, true],
						"Reason": ["User had no permissions", true],
						"Command": [msg.content.slice(settings.normalPrefix.length).split(" ")[0], true],
						"Arguments": [args.join(" ") ? args.join(" ") : "None", true],
						"Message": [msg.content, true],
						"Username": [msg.author.username, true],
						"Discriminator": [msg.author.discriminator, true],
						"ID": [msg.author.id, true],
						"Owner": [isBotOwner(msg.author.id)[0], true],
						"Protected Owner": [isBotOwner(msg.author.id)[1], true],
						"Guild Name": [msg.guild.name, true],
						"Guild ID": [msg.guild.id, true],
						"Guild Owner Username": [msg.guild.owner.user.username, true],
						"Guild Owner Discriminator": [msg.guild.owner.user.discriminator, true],
						"Guild Owner ID": [msg.guild.ownerID, true]
					}, "", "", ["Command abuse = Blacklist"]))
					msg.channel.send(createEmbed(`You require the \`${normalCommand.userPermission}\` permission to run this command.`, {}, "", "Command Handler"))
					return
				}
				if (!msg.guild.me.hasPermission("ADMINISTRATOR") && !msg.guild.me.hasPermission(normalCommand.botPermission)) {
					msg.channel.stopTyping()
					log(bot, createEmbed("New command ran.", {
						"Success": [false, true],
						"Reason": ["Bot had no permissions", true],
						"Command": [msg.content.slice(settings.normalPrefix.length).split(" ")[0], true],
						"Arguments": [args.join(" ") ? args.join(" ") : "None", true],
						"Message": [msg.content, true],
						"Username": [msg.author.username, true],
						"Discriminator": [msg.author.discriminator, true],
						"ID": [msg.author.id, true],
						"Owner": [isBotOwner(msg.author.id)[0], true],
						"Protected Owner": [isBotOwner(msg.author.id)[1], true],
						"Guild Name": [msg.guild.name, true],
						"Guild ID": [msg.guild.id, true],
						"Guild Owner Username": [msg.guild.owner.user.username, true],
						"Guild Owner Discriminator": [msg.guild.owner.user.discriminator, true],
						"Guild Owner ID": [msg.guild.ownerID, true]
					}, "", "", ["Command abuse = Blacklist"]))
					msg.channel.send(createEmbed(`I require the \`${normalCommand.botPermission}\` permission to run this command.`, {}, "", "Command Handler"))
					return
				}
			}
			if (!checkArgument(normalCommand.arguments, args)[0]) {
				const missingArgs = checkArgument(normalCommand.arguments, args)[1]
				msg.channel.stopTyping()
				log(bot, createEmbed("New command ran.", {
					"Success": [false, true],
					"Reason": ["Missing arguments", true],
					"Command": [msg.content.slice(settings.normalPrefix.length).split(" ")[0], true],
					"Arguments": [args.join(" ") ? args.join(" ") : "None", true],
					"Message": [msg.content, true],
					"Username": [msg.author.username, true],
					"Discriminator": [msg.author.discriminator, true],
					"ID": [msg.author.id, true],
					"Owner": [isBotOwner(msg.author.id)[0], true],
					"Protected Owner": [isBotOwner(msg.author.id)[1], true],
					"Guild Name": [msg.guild.name, true],
					"Guild ID": [msg.guild.id, true],
					"Guild Owner Username": [msg.guild.owner.user.username, true],
					"Guild Owner Discriminator": [msg.guild.owner.user.discriminator, true],
					"Guild Owner ID": [msg.guild.ownerID, true]
				}, "", "", ["Command abuse = Blacklist"]))
				msg.channel.send(createEmbed(`You're missing the \`${missingArgs}\` ${missingArgs.split(" ").length === 1 ? "argument" : "arguments"}.`, {}, "", "Command Handler"))
				return
			}
			
			setCooldown(normalCommand.name, msg.author.id, Date.now() + normalCommand.time)
			
			setTimeout(() => {
				deleteCooldown(normalCommand.name, msg.author.id)
			}, normalCommand.time)

			log(bot, createEmbed("New command ran.", {
				"Success": [true, true],
				"Command": [msg.content.slice(settings.normalPrefix.length).split(" ")[0], true],
				"Arguments": [args.join(" ") ? args.join(" ") : "None", true],
				"Message": [msg.content, true],
				"Username": [msg.author.username, true],
				"Discriminator": [msg.author.discriminator, true],
				"ID": [msg.author.id, true],
				"Owner": [isBotOwner(msg.author.id)[0], true],
				"Protected Owner": [isBotOwner(msg.author.id)[1], true],
				"Guild Name": [msg.guild.name, true],
				"Guild ID": [msg.guild.id, true],
				"Guild Owner Username": [msg.guild.owner.user.username, true],
				"Guild Owner Discriminator": [msg.guild.owner.user.discriminator, true],
				"Guild Owner ID": [msg.guild.ownerID, true]
			}, "", "", ["Command abuse = Blacklist"]))
			
			bot.normalCommandList.get(normalCommand.name).run(bot, msg, args)
			msg.channel.stopTyping()
		} else {
			msg.channel.stopTyping()
			msg.channel.send(createEmbed("That command doesn't exist.", {}, "", "Command Handler"))
		}
	}, 1000)
}

function runManageCommand(bot, msg, command) {
    if (command) msg.content = command

    const manageCommand = bot.manageCommandList.get(msg.content.slice(settings.normalPrefix.length).split(" ").filter(str => {
        return /\S/.test(str)
    })[0])
    
    const args = msg.content.split(" ").filter(str => {
        return /\S/.test(str)
    }).slice(1)

    if (manageCommand) {
        if (!manageCommand.enabled) {
            msg.channel.send(createEmbed("This command is currently disabled.", {}, "", "Command Handler"))
            return
        }
        if (!isBotOwner(msg.author.id)[0]) {
            msg.channel.send(createEmbed("This command can only be ran by bot owners.", {}, "", "Command Handler"))
            return
        }
        if (msg.channel.type === "dm") {
            msg.channel.send(createEmbed("This command doesn't work in DMs.", {}, "", "Command Handler"))
            return
        }
        if (!checkArgument(manageCommand.arguments, args)[0]) {
			const missingArgs = checkArgument(manageCommand.arguments, args)[1]

            msg.channel.send(createEmbed(`You're missing the \`${missingArgs}\` ${missingArgs.split(" ").length === 1 ? "argument" : "arguments"}.`, {}, "",  "Command Handler"))
            return
        }

        bot.manageCommandList.get(manageCommand.name).run(bot, msg, args)
    }
}

module.exports.runCommand = runCommand
module.exports.runManageCommand = runManageCommand