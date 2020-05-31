function parseArgument(args) {
    let finalArgs = []
    let inQuote = false
    
    let tempArg = ""

    args.split("").forEach(key => {
        if (key === "\"" || key === "'" || key === "`") {
            if (inQuote) {
                finalArgs.push(tempArg)

                tempArg = ""

                inQuote = false
            } else inQuote = true
            return
        } else if (key === " ") {
            if (inQuote) tempArg += key
            else {
                finalArgs.push(tempArg)

                tempArg = ""
                return
            }
        } else tempArg += key
    })

    finalArgs.push(tempArg)

    return finalArgs
}

module.exports.parseArgument = parseArgument