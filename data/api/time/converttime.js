function convertTime(num, type) {
    if (type === "second" || type === "seconds") {
        return num * 1000
    } else if (type === "minute" || type === "minutes") {
        return num * 60000
    } else if (type === "hour" || type === "hours") {
        return num * 3600000
    } else if (type === "day" || type === "days") {
        return num * 86400000
    }
}

module.exports.convertTime = convertTime