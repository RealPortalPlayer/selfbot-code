function parseBool(bool) {
    if (typeof bool === "boolean") return bool
    else if (typeof bool === "string") {
        if (bool.trim().toLowerCase() === "true") return true
        else if (bool.trim().toLowerCase() === "false") return false
        else return undefined
    }
    else if (typeof bool === "number") {
        if (bool === 1) return true
        else if (!bool) return false
        else return undefined
    }
}

module.exports.parseBool = parseBool