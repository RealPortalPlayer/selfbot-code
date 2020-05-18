let cooldown = {}

function hasAndGetCooldown(command, id) {
    if (cooldown[id] && cooldown[id][command]) {
        return [true, cooldown[id][command].time]
    } else {
        return [false]
    }
}

function setCooldown(command, id, time) {
    if (!hasAndGetCooldown(command, id)[0]) {
        if (cooldown[id]) {
            cooldown[id][command] = {}
            cooldown[id][command].time = time
        } else {
            cooldown[id] = {}
            cooldown[id][command] = {}
            cooldown[id][command].time = time
        }
    }
}

function deleteCooldown(command, id) {
    for (const k in cooldown[id]) {
        if (~k.indexOf(command)) {
            delete cooldown[id][command]
        }
    }
}

module.exports.hasAndGetCooldown = hasAndGetCooldown
module.exports.setCooldown = setCooldown
module.exports.deleteCooldown = deleteCooldown