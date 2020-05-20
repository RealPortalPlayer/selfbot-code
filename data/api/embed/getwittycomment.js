let lastComment = ""

function getWittyComment(comments, attempts = 0) {
    let selected = comments[Math.floor(Math.random() * comments.length)]
    if (lastComment === selected && attempts < 3) getWittyComment(comments, attempts++)
    else {
        lastComment = selected
        return selected
    }
}

module.exports.getWittyComment = getWittyComment