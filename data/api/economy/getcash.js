const {get, set} = require("quick.db")

function getCash(id) {
    if (get(`economy.${id}`)) return get(`economy.${id}`)
    else return {
        "hand": 0,
        "bank": 1000,
        "bought": [],
        "daily": {
            "last": 0,
            "streak": 0
        }
    }
}

function setCash(id, hand, bank, itemsBought, last, streak) {
    set(`economy.${id}`, {
        "hand": hand,
        "bank": bank,
        "bought": itemsBought,
        "daily": {
            "last": last,
            "streak": streak
        }
    })
}

module.exports.getCash = getCash
module.exports.setCash = setCash