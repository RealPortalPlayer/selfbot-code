require("colors")
require("dotenv").config()

const {Client} = require("discord.js")
const {readdirSync} = require("fs")
const {get} = require("quick.db")
const {Collection} = require("discord.js")

const {getFullDate} = require("./data/api/time/getfulldate")
const {settings} = require("./data/api/settings/botsettings")
const {dashed} = require("./data/api/dash")
const {runCommand, runManageCommand} = require("./data/api/commands/runcommand")
const {getBlacklisted} = require("./data/api/commands/getblacklisted")
const {startSite} = require("./data/website/site")
const {log} = require("./data/api/guild/log")
const {createEmbed} = require("./data/api/embed/createembed")
const {DefaultOptions} = require("discord.js/src/util/Constants")

DefaultOptions.ws.properties.$browser = "Discord iOS"

let bot = new Client({
	disableMentions: "all"
})

bot.on("ready", () => {
	bot.startedOn = getFullDate()

	bot.normalCommandList = new Collection()
	bot.manageCommandList = new Collection()

	bot.normalCategoryList = []
	bot.manageCategoryList = []

	bot.insideNormalCategoryList = {}
	bot.insideManageCategoryList = {}

	console.log(` Starting on ${bot.startedOn}.\n ${dashed(`Starting on ${bot.startedOn}.`)}`.blue)

	let guilds = ""
	
	bot.guilds.cache.forEach(guild => {
		const botlessMemberCount = guild.members.cache.filter(member => !member.user.bot).size
		const userlessMemberCount = guild.members.cache.filter(member => member.user.bot).size
		const memberCount = guild.members.cache.size

		guilds += ` * Name: ${guild.name}\n * ID: ${guild.id}\n * User Count: ${botlessMemberCount}\n * Bot Count: ${userlessMemberCount}\n * User and Bot Count: ${memberCount}\n * Owner: ${guild.owner.user.username}#${guild.owner.user.discriminator}\n * Owner ID: ${guild.ownerID}\n ${dashed(` * Owner ID: ${guild.ownerID}`)}\n`
	})
	
	console.log(guilds.blue)

	const commandCategories = readdirSync(`${process.cwd()}/data/commands/normal/`)
	const manageCategories = readdirSync(`${process.cwd()}/data/commands/manage/`)

	let normalCommands = {
		"loadedSuccessfully": true,
		"loadedAtLeastOne": false
	}

	let manageCommands = {
		"loadedSuccessfully": true,
		"loadedAtLeastOne": false
	}

	if (commandCategories[0]) {
		commandCategories.forEach(category => {
			console.log(` Loading all commands in ${category}`.blue)

			const commandFiles = readdirSync(`${process.cwd()}/data/commands/normal/${category}`)

			bot.normalCategoryList.push(category)
			bot.insideNormalCategoryList[category] = []

			if (commandFiles[0]) {
				commandFiles.forEach(file => {
					if (file.endsWith(settings.fileExtension.commands.normal)) {
						console.log(` Loading ${file}.`.blue)

						try {
							const {Command} = require(`./data/commands/normal/${category}/${file}`)
							const newCommand = new Command()

							bot.normalCommandList.set(file.split(".")[0], newCommand)
							console.log(` Successfully loaded ${file}!`.green)
							bot.insideNormalCategoryList[category].push(newCommand)
							normalCommands.loadedAtLeastOne = true
						} catch (e) {
							normalCommands.loadedSuccessfully = false
							console.log(` Failed to load ${file} due to "${e.toString().split("\n")[0]}".`.red)
						}
					}
				})
			}

			if (normalCommands.loadedSuccessfully) {
				if (normalCommands.loadedAtLeastOne) console.log(` Successfully loaded all files in ${category}`.green)
				else console.log(" Either there was nothing for me to load, or they all errored.".yellow)
			}
			else console.log(" Some loaded, but some errored.".yellow)
		})
	}

	if (normalCommands.loadedSuccessfully) {
		if (normalCommands.loadedAtLeastOne) console.log(" Successfully loaded all normal commands.".green)
		else console.log(" Either there was nothing for me to load, or they all errored.".yellow)
	}
	else console.log(" Some loaded, but some errored.".yellow)

	if (manageCategories[0]) manageCategories.forEach(category => {
		console.log(` Loading all commands in ${category}`.blue)
		const manageFiles = readdirSync(`${process.cwd()}/data/commands/manage/${category}`)

		bot.manageCategoryList.push(category)
		bot.insideManageCategoryList[category] = []

		if (manageFiles[0]) manageFiles.forEach(file => {
			if (file.endsWith(settings.fileExtension.commands.manage)) {
				console.log(` Loading ${file}.`.blue)

				try {
					const {Command} = require(`./data/commands/manage/${category}/${file}`)
					const newCommand = new Command()
					bot.manageCommandList.set(file.split(".")[0], newCommand)
					bot.insideManageCategoryList[category].push(newCommand)
					manageCommands.loadedAtLeastOne = true
					console.log(` Successfully loaded ${file}!`.green)
				} catch (e) {
					manageCommands.loadedSuccessfully = false
					console.log(` Failed to load ${file} due to "${e.toString().split("\n")[0]}".`.red)
				}
			}
		})

		if (manageCommands.loadedSuccessfully) {
			if (manageCommands.loadedAtLeastOne) console.log(` Successfully loaded all files in ${category}`.green)
			else console.log(" Either there was nothing for me to load, or they all errored.".yellow)
		}
		else console.log(" Some loaded, but some errored.".yellow)
	})

	if (normalCommands.loadedSuccessfully && manageCommands.loadedSuccessfully) {
		if (normalCommands.loadedAtLeastOne && manageCommands.loadedAtLeastOne) console.log(` Successfully loaded all commands.`.green)
		else if (normalCommands.loadedAtLeastOne && !manageCommands.loadedAtLeastOne) console.log(` Successfully loaded all normal commands, but some manage commands either didn't load or errored.`.yellow)
		else if (!normalCommands.loadedAtLeastOne && manageCommands.loadedAtLeastOne) console.log(` Successfully loaded all manage commands, but some or all normal commands either didn't load or errored.`.yellow)
		else console.log(" No commands loaded.".red)
	} else if (normalCommands.loadedSuccessfully && !manageCommands.loadedSuccessfully) {
		if (normalCommands.loadedAtLeastOne && manageCommands.loadedAtLeastOne) console.log(` Successfully loaded all normal commands, but some or all manage commands either didn't load or errored.`.yellow)
		else if (normalCommands.loadedAtLeastOne && !manageCommands.loadedAtLeastOne) console.log(` Successfully loaded all normal commands, but some manage commands either didn't load or errored.`.yellow)
		else if (!normalCommands.loadedAtLeastOne && manageCommands.loadedAtLeastOne) console.log(` Successfully loaded some manage commands but some or all either didn't load or errored, and some or all normal commands either didn't load or errored.`.yellow)
		else console.log(" No commands loaded".red)
	} else if (!normalCommands.loadedSuccessfully && manageCommands.loadedSuccessfully) {
		if (normalCommands.loadedAtLeastOne && manageCommands.loadedAtLeastOne) console.log(` Successfully loaded all manage commands, but some or all normal commands either didn't load or errored.`.yellow)
		else if (normalCommands.loadedAtLeastOne && !manageCommands.loadedAtLeastOne) console.log(` Successfully loaded all manage commands, but some normal commands either didn't load or errored.`.yellow)
		else if (!normalCommands.loadedAtLeastOne && manageCommands.loadedAtLeastOne) console.log(` Successfully loaded some normal commands but some or all either didn't load or errored, and some or all manage commands either didn't load or errored.`.yellow)
		else console.log(" No commands loaded".red)
	} else {
		if (normalCommands.loadedAtLeastOne && manageCommands.loadedAtLeastOne) console.log(` Successfully loaded some normal commands, but some or all errored, and some or all manage commands either didn't load or errored.`.yellow)
		else if (normalCommands.loadedAtLeastOne && !manageCommands.loadedAtLeastOne) console.log(` Successfully loaded all normal commands, but some manage commands either didn't load or errored.`.yellow)
		else if (!normalCommands.loadedAtLeastOne && manageCommands.loadedAtLeastOne) console.log(` Successfully loaded some manage commands but some or all either didn't load or errored, and some or all normal commands either didn't load or errored.`.yellow)
		else console.log(" No commands loaded".red)
	}

	console.log(`\n Starting the web server.`.blue)
	startSite(bot)
})

bot.on("guildCreate", guild => {
	if (get(`blacklistedGuild.${guild.id}`)) {
		guild.leave()
	} else {
		const botlessMemberCount = guild.members.cache.filter(member => !member.user.bot).size - 1
		const userlessMemberCount = guild.members.cache.filter(member => member.user.bot).size
		const memberCount = guild.members.cache.size - 1
	
		log(bot, createEmbed(msg, bot, true, "Joined a Discord Guild", {
			"Name": guild.name,
			"ID": guild.id,
			"User Count": botlessMemberCount,
			"Bot Count": userlessMemberCount,
			"User and Bot Count": memberCount,
			"Owner Username": guild.owner.user.username,
			"Owner Discriminator": guild.owner.user.discriminator,
			"Owner ID": guild.ownerID,
		}))
	}
})

bot.on("guilDelete", guild => {
	if (!get(`blacklistedGuild.${guild.id}`)) {
		const botlessMemberCount = guild.members.cache.filter(member => !member.user.bot).size - 1
		const userlessMemberCount = guild.members.cache.filter(member => member.user.bot).size - 1
		const memberCount = guild.members.cache.size - 1

		log(bot, createEmbed(msg, bot, true, "Left a Discord Guild", {
			"Name": guild.name,
			"ID": guild.id,
			"User Count": botlessMemberCount,
			"Bot Count": userlessMemberCount,
			"User and Bot Count": memberCount,
			"Owner Username": guild.owner.user.username,
			"Owner Discriminator": guild.owner.user.discriminator,
			"Owner ID": guild.ownerID,
		}))
	}
})

bot.on("message", msg => {
	if (!getBlacklisted(msg.author.id).blacklisted && !msg.author.bot && msg.content.toLowerCase().startsWith(settings.normalPrefix.toLowerCase()) && msg.content !== settings.normalPrefix) {
		runCommand(bot, msg)
	} else if (!getBlacklisted(msg.author.id).blacklisted && !msg.author.bot && msg.content.toLowerCase().startsWith(settings.managePrefix.toLowerCase()) && msg.content !== settings.managePrefix) {
		runManageCommand(bot, msg)
	}
})

bot.on("messageUpdate", (_, msg) => {
	if (!getBlacklisted(msg.author.id).blacklisted && !msg.author.bot && msg.content.toLowerCase().startsWith(settings.normalPrefix.toLowerCase()) && msg.content !== settings.normalPrefix) {
		runCommand(bot, msg)
	} else if (!getBlacklisted(msg.author.id).blacklisted && !msg.author.bot && msg.content.toLowerCase().startsWith(settings.managePrefix.toLowerCase()) && msg.content !== settings.managePrefix) {
		runManageCommand(bot, msg)
	}
})

bot.on("rateLimit", data => {
	console.log(`!!! WARNING !!!\nRATE LIMIT DETECTED.\n${dashed("RATE LIMIT DETECTED.")}s`)
})

bot.login(process.env.TOKEN)