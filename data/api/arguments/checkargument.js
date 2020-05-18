function checkArgument(commandArgs, userArgs) {
    let requiredArgs = ""
    if (commandArgs.length === 0) return [true]
    commandArgs.split(" ").forEach(arg => {
        if (arg.startsWith("<")) requiredArgs += `${arg} `
    })
    if (requiredArgs.length === 0) return [true]
    requiredArgs = requiredArgs.trim()
    if (requiredArgs.split(" ").length > userArgs.length) {
        return [false, requiredArgs.split(" ").slice(userArgs.length).join(" ")]
    }
    return [true]
}

module.exports.checkArgument = checkArgument