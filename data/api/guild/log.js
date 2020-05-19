const {settings} = require("../settings/botsettings")

function log(bot, message) {
	bot.channels.cache.get(settings.logGuild.logChannel).send(message)
}

function suggest(bot, message) {
	bot.channels.cache.get(settings.logGuild.suggestionChannel).send(message)
}

function bug(bot, message) {
	bot.channels.cache.get(settings.logGuild.bugChannel).send(message)
}

module.exports.log = log
module.exports.suggest = suggest
module.exports.bug = bug