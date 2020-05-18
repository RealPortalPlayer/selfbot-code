function randomColor(type) {
    if (type.toLowerCase() === "rgb") return [Math.floor(Math.random() * 255), Math.floor(Math.random() * 255), Math.floor(Math.random() * 255)]
    else if (type.toLowerCase() === "hex") {
        let color = "#"
        let validChars = "ABCDEF1234567890"

        for (let i = 0; i < 6; i ++) {
            color += validChars.split("")[Math.floor(Math.random() * 16)]
        }
        
        return color
    }
}

module.exports.randomColor = randomColor