const {Collection} = require("discord.js")

let normalCommandList = new Collection()
let manageCommandList = new Collection()

let normalCategoryList = []
let manageCategoryList = []

let insideNormalCategoryList = {}
let insideManageCategoryList = {}

module.exports.normalCommandList = normalCommandList
module.exports.manageCommandList = manageCommandList
module.exports.normalCategoryList = normalCategoryList
module.exports.manageCategoryList = manageCategoryList
module.exports.insideNormalCategoryList = insideNormalCategoryList
module.exports.insideManageCategoryList = insideManageCategoryList