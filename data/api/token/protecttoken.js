function protectToken(string) {
    const reg = new RegExp(process.env.TOKEN, 'g')
    return string.replace(reg, "insert a token")
}

module.exports.protectToken = protectToken