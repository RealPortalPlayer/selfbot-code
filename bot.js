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
const {isBlacklisted} = require("./data/api/blacklist/isblacklisted")

let bot = new Client()

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
		const botlessMemberCount = guild.members.cache.filter(member => !member.user.bot).size - 1
		const userlessMemberCount = guild.members.cache.filter(member => member.user.bot).size - 1
		const memberCount = guild.members.cache.size - 1

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

	if (commandCategories[0]) commandCategories.forEach(category => {
		console.log(` Loading all commands in ${category}`.blue)

		const commandFiles = readdirSync(`${process.cwd()}/data/commands/normal/${category}`)

		bot.normalCategoryList.push(category)
		bot.insideNormalCategoryList[category] = []

		if (commandFiles[0]) commandFiles.forEach(file => {
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

		if (normalCommands.loadedSuccessfully) {
			if (normalCommands.loadedAtLeastOne) console.log(` Successfully loaded all files in ${category}`.green)
			else console.log(" Either there was nothing for me to load, or they all errored.".yellow)
		}
		else console.log(" Some loaded, but some errored.".yellow)
	})

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
					normalCommands.loadedAtLeastOne = true
					bot.insideManageCategoryList[category].push(newCommand)
					console.log(` Successfully loaded ${file}!`.green)
				} catch (e) {
					manageCommands.loadedSuccessfully = false;
					console.log(` Failed to load ${file} due to "${e.toString().split("\n")[0]}".`.red)
				}
			}
		})

		if (manageCommands.loadedSuccessfully) {
			if (manageCommands.loadedAtLeastOne) console.log(` Successfully loaded all files in ${category}`)
			else console.log(" Either there was nothing for me to load, or they all errored.".yellow)
		}
		else console.log(" Some loaded, but some errored.".yellow)
	})

	if (normalCommands.loadedSuccessfully && manageCommands.loadedSuccessfully) {
		if (normalCommands.loadedAtLeastOne && manageCommands.loadedAtLeastOne) console.log(` Successfully loaded all commands.`.green)
		else if (normalCommands.loadedAtLeastOne && !manageCommands.loadedAtLeastOne) console.log(` Successfully loaded all normal commands, but some or all manage commands either didn't load or errored.`.yellow)
		else if (!normalCommands.loadedAtLeastOne && manageCommands.loadedAtLeastOne) console.log(` Successfully loaded all manage commands, but some or all normal commands either didn't load or errored.`.yellow)
		else console.log(" No commands loaded.".red)
	} else if (normalCommands.loadedSuccessfully && !manageCommands.loadedSuccessfully) {
		if (normalCommands.loadedAtLeastOne && manageCommands.loadedAtLeastOne) console.log(` Successfully loaded all normal commands, but some or all manage commands either didn't load or errored.`.yellow)
		else if (normalCommands.loadedAtLeastOne && !manageCommands.loadedAtLeastOne) console.log(` Successfully loaded all normal commands, but some or all manage commands either didn't load or errored.`.yellow)
		else if (!normalCommands.loadedAtLeastOne && manageCommands.loadedAtLeastOne) console.log(` Successfully loaded some manage commands but some or all either didn't load or errored, and some or all normal commands either didn't load or errored.`.yellow)
		else console.log(" No commands loaded".red)
	} else if (!normalCommands.loadedSuccessfully && manageCommands.loadedSuccessfully) {
		if (normalCommands.loadedAtLeastOne && manageCommands.loadedAtLeastOne) console.log(` Successfully loaded all manage commands, but some or all normal commands either didn't load or errored.`.yellow)
		else if (normalCommands.loadedAtLeastOne && !manageCommands.loadedAtLeastOne) console.log(` Successfully loaded all manage commands, but some or all normal commands either didn't load or errored.`.yellow)
		else if (!normalCommands.loadedAtLeastOne && manageCommands.loadedAtLeastOne) console.log(` Successfully loaded some normal commands but some or all either didn't load or errored, and some or all manage commands either didn't load or errored.`.yellow)
		else console.log(" No commands loaded".red)
	} else {
		if (normalCommands.loadedAtLeastOne && manageCommands.loadedAtLeastOne) console.log(` Successfully loaded some normal commands, but some or all errored, and some or all manage commands either didn't load or errored.`.yellow)
		else if (normalCommands.loadedAtLeastOne && !manageCommands.loadedAtLeastOne) console.log(` Successfully loaded all normal commands, but some or all manage commands either didn't load or errored.`.yellow)
		else if (!normalCommands.loadedAtLeastOne && manageCommands.loadedAtLeastOne) console.log(` Successfully loaded some manage commands but some or all either didn't load or errored, and some or all normal commands either didn't load or errored.`.yellow)
		else console.log(" No commands loaded".red)
	}
})

bot.on("guildCreate", guild => {
	if (get(`blacklistedGuild.${guild.id}`)) {
		console.log(` B+ Name: ${guild.name}\n B+ ID: ${guild.id}\n B+ User Count: ${botlessMemberCount}\n B+ Bot Count: ${userlessMemberCount}\n B+ User and Bot Count: ${memberCount}\n B+ Owner: ${guild.owner.user.username}#${guild.owner.user.discriminator}\n B+ Owner ID: ${guild.ownerID}\n ${dashed(` B+ Owner ID: ${guild.ownerID}`)}\n`.blue)
		guild.leave()
		return
	}

	const botlessMemberCount = guild.members.cache.filter(member => !member.user.bot).size - 1
	const userlessMemberCount = guild.members.cache.filter(member => member.user.bot).size
	const memberCount = guild.members.cache.size - 1

	console.log(` + Name: ${guild.name}\n + ID: ${guild.id}\n + User Count: ${botlessMemberCount}\n + Bot Count: ${userlessMemberCount}\n + User and Bot Count: ${memberCount}\n + Owner: ${guild.owner.user.username}#${guild.owner.user.discriminator}\n + Owner ID: ${guild.ownerID}\n ${dashed(` + Owner ID: ${guild.ownerID}`)}\n`.blue)
})

bot.on("guilDelete", guild => {
	if (get(`blacklistedGuild.${guild.id}`)) {
		console.log(` B- Name: ${guild.name}\n B- ID: ${guild.id}\n B- User Count: ${botlessMemberCount}\n B- Bot Count: ${userlessMemberCount}\n B- User and Bot Count: ${memberCount}\n B- Owner: ${guild.owner.user.username}#${guild.owner.user.discriminator}\n B- Owner ID: ${guild.ownerID}\n ${dashed(` B- Owner ID: ${guild.ownerID}`)}\n`.blue)
	}

	const guilds = ""

	const botlessMemberCount = guild.members.cache.filter(member => !member.user.bot).size - 1
	const userlessMemberCount = guild.members.cache.filter(member => member.user.bot).size - 1
	const memberCount = guild.members.cache.size - 1

	guilds += ` - Name: ${guild.name}\n - ID: ${guild.id}\n - User Count: ${botlessMemberCount}\n - Bot Count: ${userlessMemberCount}\n - User and Bot Count: ${memberCount}\n - Owner: ${guild.owner.user.username}#${guild.owner.user.discriminator}\n - Owner ID: ${guild.ownerID}\n ${dashed(` - Owner ID: ${guild.ownerID}`)}\n`

	console.log(guilds.blue)
})

bot.on("message", msg => {
	if (!isBlacklisted(msg.author.id) && !msg.author.bot && msg.content.toLowerCase().startsWith(settings.normalPrefix.toLowerCase()) && msg.content !== settings.normalPrefix) {
		runCommand(bot, msg)
	} else if (!isBlacklisted(msg.author.id) && !msg.author.bot && msg.content.toLowerCase().startsWith(settings.managePrefix.toLowerCase()) && msg.content !== settings.managePrefix) {
		runManageCommand(bot, msg)
	}
})

bot.login(process.env.TOKEN)