function getFullDate(addMinute = 0, addHour = 0) {
    const month = new Date().getMonth() + 1
    const day = new Date().getDate()
    const year = new Date().getFullYear()
    
    let hours = new Date().getHours()
    let minutes = new Date().getMinutes()

    minutes = minutes + addMinute
    hours = hours + addHour
        
    const ampm = hours >= 12 ? "PM" : "AM"
    
    hours = hours % 12
    hours = hours ? hours : 12
    minutes = minutes < 10 ? `0${minutes}` : minutes
    
    return `${month}/${day}/${year} - ${hours}:${minutes} ${ampm}`
}

module.exports.getFullDate = getFullDate