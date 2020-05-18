class Category {
    constructor() {
        this.name = "Moderation"
        this.description = "Every command that requires you to have some sort of moderator role."
        this.supportGuildOnly = false
        this.botOwnerOnly = false
    }
}

module.exports.Category = Category