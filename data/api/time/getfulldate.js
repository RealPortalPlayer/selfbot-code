function getFullDate() {    
    return `${new Date().getMonth() + 1}/${new Date().getDate()}/${new Date().getFullYear()} @ ${(new Date().getHours() % 12) ? new Date().getHours() : 12}:${new Date().getMinutes() < 10 ? `0${new Date().getMinutes()}` : new Date().getMinutes()} ${new Date().getHours() >= 12 ? "PM" : "AM"}`
}

module.exports.getFullDate = getFullDate