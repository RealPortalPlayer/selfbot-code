function checkArgument(commandArgs, userArgs) {
    let requiredArgs = ""

    if (commandArgs.length === 0) return [true]
    else {
        commandArgs.forEach(arg => {
            if (arg.startsWith("<")) requiredArgs += `${arg} `
        })

        if (requiredArgs.length === 0) return [true]
        else {
            requiredArgs = requiredArgs.trim()

            if (requiredArgs.split(" ").length > userArgs.length) {
                return [false, requiredArgs.split(" ").slice(userArgs.length).join(" ")]
            } else return [true]
        }
        
    }
}

module.exports.checkArgument = checkArgument