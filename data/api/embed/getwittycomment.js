let lastComment = ""

function getWittyComment(comments, attempts = 0) {
    let selected = comments[Math.floor(Math.random() * comments.length - 1)]
    if (lastComment === selected && attempts < 3) getWittyComment(comments, attempts++)
    else return lastComent = selected
}

module.exports.getWittyComment = getWittyComment