function dashed(text) {
    let dash = ""
    let i = 0
    do {
        dash += "-"
        i++
    } while (i !== text.length)
    return dash
}

module.exports.dashed = dashed