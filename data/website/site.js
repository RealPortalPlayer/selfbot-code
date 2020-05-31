const Express = require("express")
const {address} = require("ip")
const {readFileSync} = require("fs")
const fetch = require("node-fetch")
const FormData = require("form-data")
const {set, get} = require("quick.db")
const db = require("quick.db")
const cors = require('cors')
const {getBlacklisted} = require("../api/commands/getblacklisted")
const {getBotOwner} = require("../api/commands/getbotowner")
const app = new Express()

const allowedOrigins = [
    `http://${address()}:8080`,
    "https://wwww.discord.com"
]

function startSite(bot) {
    app.listen(8080, address, () => {
        console.log(` Web server running at http://${address()}:8080/`.green)

        app.use(cors({
            origin: (origin, callback) => {
                if (!origin) return callback(null, true)
                else {
                    if (allowedOrigins.indexOf(origin) === -1) return callback(new Error("The CORS policy for this site does not allow access from the specified Origin."), false)
                    else return callback(null, true)
                }
            }
        }))

        // PAGE: /
        app.get("/", (req, res) => {
            if (req.headers.cookie && req.headers.cookie.split("=")[0] === "session_id" && req.headers.cookie.split("=")[1]) {
                if (get(`dashboard.${req.headers.cookie.split("=")[1]}`) && get(`dashboard.${req.headers.cookie.split("=")[1]}`).refresh_token) {
                    const oldKey = req.headers.cookie.split("=")[1]

                    let data = new FormData()
                    
                    data.append("client_id", process.env.CLIENTID)
                    data.append("client_secret", process.env.CLIENTSECRET)
                    data.append("grant_type", "refresh_token")
                    data.append("refresh_token", get(`dashboard.${req.headers.cookie.split("=")[1]}`).refresh_token)
                    data.append("redirect_uri", `http://${address()}:8080/api/login`)
                    data.append("scope", "identify guilds")

                    fetch("https://discord.com/api/oauth2/token", {
                        method: "POST",
                        body: data
                    }).then(res => res.json()).then(response => {
                        db.delete(`dashboard.${oldKey}`)
                        
                        const key = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)

                        set(`dashboard.${key}`, response)

                        res.cookie("session_id", key, {
                            expires: new Date(99999999999 + Date.now())
                        })

                        fetch("https://discord.com/api/users/@me", {
                            headers: {
                                authorization: `${response.token_type} ${response.access_token}`
                            }
                        }).then(discordResponse => discordResponse.json()).then(discordJSON => {
                            if (getBlacklisted(discordJSON.id).blacklisted) res.write(readFileSync(`${process.cwd()}/data/website/dashboard/blacklisted/index.html`))
                            else if (getBotOwner(discordJSON.id).botOwner) res.write(readFileSync(`${process.cwd()}/data/website/dashboard/owner/index.html`))
                            else res.write(readFileSync(`${process.cwd()}/data/website/dashboard/normal/index.html`))

                            res.end()
                        })
                    })
                } else {
                    res.write(readFileSync(`${process.cwd()}/data/website/dashboard/guest/index.html`))
                    res.end()
                }
            } else {
                res.write(readFileSync(`${process.cwd()}/data/website/dashboard/guest/index.html`))
                res.end()
            }
        })

        app.get("/index.html", (req, res) => {
            if (req.headers.cookie && req.headers.cookie.split("=")[0] === "session_id" && req.headers.cookie.split("=")[1]) {
                if (get(`dashboard.${req.headers.cookie.split("=")[1]}`) && get(`dashboard.${req.headers.cookie.split("=")[1]}`).refresh_token) {
                    const oldKey = req.headers.cookie.split("=")[1]

                    let data = new FormData()
                    
                    data.append("client_id", process.env.CLIENTID)
                    data.append("client_secret", process.env.CLIENTSECRET)
                    data.append("grant_type", "refresh_token")
                    data.append("refresh_token", get(`dashboard.${req.headers.cookie.split("=")[1]}`).refresh_token)
                    data.append("redirect_uri", `http://${address()}:8080/api/login`)
                    data.append("scope", "identify guilds")

                    fetch("https://discord.com/api/oauth2/token", {
                        method: "POST",
                        body: data
                    }).then(res => res.json()).then(response => {
                        db.delete(`dashboard.${oldKey}`)
                        
                        const key = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)

                        set(`dashboard.${key}`, response)

                        res.cookie("session_id", key, {
                            expires: new Date(99999999999 + Date.now())
                        })

                        fetch("https://discord.com/api/users/@me", {
                            headers: {
                                authorization: `${response.token_type} ${response.access_token}`
                            }
                        }).then(discordResponse => discordResponse.json()).then(discordJSON => {
                            if (getBlacklisted(discordJSON.id).blacklisted) res.write(readFileSync(`${process.cwd()}/data/website/dashboard/blacklisted/index.html`))
                            else if (getBotOwner(discordJSON.id).botOwner) res.write(readFileSync(`${process.cwd()}/data/website/dashboard/owner/index.html`))
                            else res.write(readFileSync(`${process.cwd()}/data/website/dashboard/normal/index.html`))

                            res.end()
                        })
                    })
                } else {
                    res.write(readFileSync(`${process.cwd()}/data/website/dashboard/guest/index.html`))
                    res.end()
                }
            } else {
                res.write(readFileSync(`${process.cwd()}/data/website/dashboard/guest/index.html`))
                res.end()
            }
        })

        // PAGE: /commands.html
        app.get("/commands.html", (req, res) => {
            if (req.headers.cookie && req.headers.cookie.split("=")[0] === "session_id" && req.headers.cookie.split("=")[1]) {
                if (get(`dashboard.${req.headers.cookie.split("=")[1]}`) && get(`dashboard.${req.headers.cookie.split("=")[1]}`).refresh_token) {
                    const oldKey = req.headers.cookie.split("=")[1]

                    let data = new FormData()
                    
                    data.append("client_id", process.env.CLIENTID)
                    data.append("client_secret", process.env.CLIENTSECRET)
                    data.append("grant_type", "refresh_token")
                    data.append("refresh_token", get(`dashboard.${req.headers.cookie.split("=")[1]}`).refresh_token)
                    data.append("redirect_uri", `http://${address()}:8080/api/login`)
                    data.append("scope", "identify guilds")

                    fetch("https://discord.com/api/oauth2/token", {
                        method: "POST",
                        body: data
                    }).then(res => res.json()).then(response => {
                        db.delete(`dashboard.${oldKey}`)
                        
                        const key = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)

                        set(`dashboard.${key}`, response)

                        res.cookie("session_id", key, {
                            expires: new Date(99999999999 + Date.now())
                        })

                        fetch("https://discord.com/api/users/@me", {
                            headers: {
                                authorization: `${response.token_type} ${response.access_token}`
                            }
                        }).then(discordResponse => discordResponse.json()).then(discordJSON => {
                            if (getBlacklisted(discordJSON.id).blacklisted) {
                                res.write(readFileSync(`${process.cwd()}/data/website/dashboard/blacklisted/index.html`))
                            } else if (getBotOwner(discordJSON.id).botOwner) {
                                res.write(readFileSync(`${process.cwd()}/data/website/dashboard/owner/commands.html`))
                            } else {
                                res.write(readFileSync(`${process.cwd()}/data/website/dashboard/normal/commands.html`))
                            }

                            res.end()
                        })
                    })
                } else {
                    res.write(readFileSync(`${process.cwd()}/data/website/dashboard/guest/commands.html`))
                    res.end()
                }
            } else {
                res.write(readFileSync(`${process.cwd()}/data/website/dashboard/guest/commands.html`))
                res.end()
            }
        })

        // API GET: /api/login
        app.get("/api/login", (req, res) => {
            if (req.query.code) {
                let data = new FormData()

                data.append("client_id", process.env.CLIENTID)
                data.append("client_secret", process.env.CLIENTSECRET)
                data.append("grant_type", "authorization_code")
                data.append("redirect_uri", `http://${address()}:8080/api/login`)
                data.append("scope", "identify guilds")
                data.append("code", req.query.code)

                fetch("https://discord.com/api/oauth2/token", {
                    method: "POST",
                    body: data
                }).then(res => res.json()).then(response => {
                    const key = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)

                    set(`dashboard.${key}`, response)

                    res.cookie("session_id", key, {
                        expires: new Date(99999999999 + Date.now())
                    })

                    res.redirect("/")
                    res.end()
                })     
            }
        })

        // API GET: /api/get
        app.get("/api/get", (req, res) => {
            res.status(405)
            
            res.send({
                "error": "Method not supported",
                "code": 405
            })

            res.end()
        })

        // API GET: /api/blacklist
        app.get("/api/blacklist", (req, res) => {
            res.status(405)

            res.send({
                "error": "Method not supported",
                "code": 405
            })

            res.end()
        })

        // API GET: /api/owner
        app.get("/api/owner", (req, res) => {
            res.status(405)

            res.send({
                "error": "Method not supported",
                "code": 405
            })

            res.end()
        })

        // API POST: /api/get
        app.post("/api/get", (req, res) => {
            if (req.headers.cookie && get(`dashboard.${req.headers.cookie.split("=")[1]}`) && get(`dashboard.${req.headers.cookie.split("=")[1]}`).refresh_token) {
                const oldKey = req.headers.cookie.split("=")[1]

                let data = new FormData()
                
                data.append("client_id", process.env.CLIENTID)
                data.append("client_secret", process.env.CLIENTSECRET)
                data.append("grant_type", "refresh_token")
                data.append("refresh_token", get(`dashboard.${req.headers.cookie.split("=")[1]}`).refresh_token)
                data.append("redirect_uri", `http://${address()}:8080/api/login`)
                data.append("scope", "identify guilds")

                fetch("https://discord.com/api/oauth2/token", {
                    method: "POST",
                    body: data
                }).then(res => res.json()).then(response => {
                    db.delete(`dashboard.${oldKey}`)
                    
                    const key = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)

                    set(`dashboard.${key}`, response)

                    res.cookie("session_id", key, {
                        expires: new Date(99999999999 + Date.now())
                    })

                    res.send(response)
                    res.end()
                })
            } else {
                res.end()
            }
        })

        // API POST: /api/blacklist
        app.post("/api/blacklist", (req, res) => {
            if (req.headers.cookie && get(`dashboard.${req.headers.cookie.split("=")[1]}`) && get(`dashboard.${req.headers.cookie.split("=")[1]}`).refresh_token) {
                const oldKey = req.headers.cookie.split("=")[1]

                let data = new FormData()
                
                data.append("client_id", process.env.CLIENTID)
                data.append("client_secret", process.env.CLIENTSECRET)
                data.append("grant_type", "refresh_token")
                data.append("refresh_token", get(`dashboard.${req.headers.cookie.split("=")[1]}`).refresh_token)
                data.append("redirect_uri", `http://${address()}:8080/api/login`)
                data.append("scope", "identify guilds")

                fetch("https://discord.com/api/oauth2/token", {
                    method: "POST",
                    body: data
                }).then(res => res.json()).then(response => {
                    db.delete(`dashboard.${oldKey}`)
                    
                    const key = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)

                    set(`dashboard.${key}`, response)

                    res.cookie("session_id", key, {
                        expires: new Date(99999999999 + Date.now())
                    })

                    fetch("https://discord.com/api/users/@me", {
                        headers: {
                            authorization: `${response.token_type} ${response.access_token}`
                        }
                    }).then(discordResponse => discordResponse.json()).then(discordJSON => {
                        res.send(getBlacklisted(discordJSON.id))
                        res.end()
                    })
                })
            }
        })

        // API POST: /api/owner
        app.post("/api/owner", (req, res) => {
            if (req.headers.cookie && get(`dashboard.${req.headers.cookie.split("=")[1]}`) && get(`dashboard.${req.headers.cookie.split("=")[1]}`).refresh_token) {
                const oldKey = req.headers.cookie.split("=")[1]

                let data = new FormData()
                
                data.append("client_id", process.env.CLIENTID)
                data.append("client_secret", process.env.CLIENTSECRET)
                data.append("grant_type", "refresh_token")
                data.append("refresh_token", get(`dashboard.${req.headers.cookie.split("=")[1]}`).refresh_token)
                data.append("redirect_uri", `http://${address()}:8080/api/login`)
                data.append("scope", "identify guilds")

                fetch("https://discord.com/api/oauth2/token", {
                    method: "POST",
                    body: data
                }).then(res => res.json()).then(response => {
                    db.delete(`dashboard.${oldKey}`)
                    
                    const key = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)

                    set(`dashboard.${key}`, response)

                    res.cookie("session_id", key, {
                        expires: new Date(99999999999 + Date.now())
                    })

                    fetch("https://discord.com/api/users/@me", {
                        headers: {
                            authorization: `${response.token_type} ${response.access_token}`
                        }
                    }).then(discordResponse => discordResponse.json()).then(discordJSON => {
                        res.send(getBotOwner(discordJSON.id))
                        res.end()
                    })
                })
            }
        })

        // API GET: /api/logout
        app.get("/api/logout", (req, res) => {
            if (req.headers.cookie) {
                db.delete(`dashboard.${req.headers.cookie.split("=")[1]}`)
                
                res.clearCookie("session_id")

                res.redirect("/")
                res.end()
            } else {
                res.redirect("/")
                res.end()
            }
        })

        // API GET: /api/commands
        app.get("/api/commands", (req, res) => {
            let found = {}
        })

        // API GET: /api/categories
        app.get("/api/categories", (req, res) => {
            let found = {}

            if (req.headers.cookie && get(`dashboard.${req.headers.cookie.split("=")[1]}`) && get(`dashboard.${req.headers.cookie.split("=")[1]}`).refresh_token) {
                const oldKey = req.headers.cookie.split("=")[1]

                let data = new FormData()
                
                data.append("client_id", process.env.CLIENTID)
                data.append("client_secret", process.env.CLIENTSECRET)
                data.append("grant_type", "refresh_token")
                data.append("refresh_token", get(`dashboard.${req.headers.cookie.split("=")[1]}`).refresh_token)
                data.append("redirect_uri", `http://${address()}:8080/api/login`)
                data.append("scope", "identify guilds")

                fetch("https://discord.com/api/oauth2/token", {
                    method: "POST",
                    body: data
                }).then(res => res.json()).then(response => {
                    db.delete(`dashboard.${oldKey}`)
                    
                    const key = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)

                    set(`dashboard.${key}`, response)

                    res.cookie("session_id", key, {
                        expires: new Date(99999999999 + Date.now())
                    })

                    fetch("https://discord.com/api/users/@me", {
                        headers: {
                            authorization: `${response.token_type} ${response.access_token}`
                        }
                    }).then(discordResponse => discordResponse.json()).then(discordJSON => {
                        if (getBotOwner(discordJSON.id).botOwner) {
                            found.normal = {}
                            found.manage = {}

                            bot.normalCategoryList.forEach(category => {
                                const categoryInfoFile = require(`../commands/normal/${category}/categoryinfo`)
                                const categoryInfo = new categoryInfoFile.Category()

                                let commandCount = 0

                                bot.insideNormalCategoryList[category].forEach(file => {
                                    if (!file.enabled) return

                                    commandCount++
                                })

                                if (commandCount) found.normal[categoryInfo.name] = categoryInfo.description
                            })
                                
                            bot.manageCategoryList.forEach(category => {
                                const categoryInfoFile = require(`../commands/manage/${category}/categoryinfo`)
                                const categoryInfo = new categoryInfoFile.Category()

                                let commandCount = 0

                                bot.insideManageCategoryList[category].forEach(file => {
                                    if (!file.enabled) return

                                    commandCount++
                                })

                                if (commandCount) found.manage[categoryInfo.name] = categoryInfo.description
                            })

                            res.send(found)
                            res.end()
                        } else {
                            bot.normalCategoryList.forEach(category => {
                                const categoryInfoFile = require(`../commands/normal/${category}/categoryinfo`)
                                const categoryInfo = new categoryInfoFile.Category()

                                let commandCount = 0

                                bot.insideNormalCategoryList[category].forEach(file => {
                                    if (!file.enabled) return
                                    if (file.botOwnerOnly) return
    
                                    commandCount++
                                })

                                if (commandCount) found[categoryInfo.name] = categoryInfo.description
                            })

                            res.send(found)
                            res.end()
                        }
                    })
                })
            } else {
                bot.normalCategoryList.forEach(category => {
                    const categoryInfoFile = require(`../commands/normal/${category}/categoryinfo`)
                    const categoryInfo = new categoryInfoFile.Category()

                    let commandCount = 0

                    bot.insideNormalCategoryList[category].forEach(file => {
                        if (!file.enabled) return
                        if (file.botOwnerOnly) return

                        commandCount++
                    })

                    if (commandCount) found[categoryInfo.name] = categoryInfo.description
                })

                res.send(found)
                res.end()
            }
        })

        app.get("/api/commands/:command", (req, res) => {
            let found = []

        })

        app.get("/api/categories/:category", (req, res) => {
            let found = {}

            if (req.headers.cookie && get(`dashboard.${req.headers.cookie.split("=")[1]}`) && get(`dashboard.${req.headers.cookie.split("=")[1]}`).refresh_token) {
                const oldKey = req.headers.cookie.split("=")[1]

                let data = new FormData()
                
                data.append("client_id", process.env.CLIENTID)
                data.append("client_secret", process.env.CLIENTSECRET)
                data.append("grant_type", "refresh_token")
                data.append("refresh_token", get(`dashboard.${req.headers.cookie.split("=")[1]}`).refresh_token)
                data.append("redirect_uri", `http://${address()}:8080/api/login`)
                data.append("scope", "identify guilds")

                fetch("https://discord.com/api/oauth2/token", {
                    method: "POST",
                    body: data
                }).then(res => res.json()).then(response => {
                    db.delete(`dashboard.${oldKey}`)
                    
                    const key = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)

                    set(`dashboard.${key}`, response)

                    res.cookie("session_id", key, {
                        expires: new Date(99999999999 + Date.now())
                    })

                    fetch("https://discord.com/api/users/@me", {
                        headers: {
                            authorization: `${response.token_type} ${response.access_token}`
                        }
                    }).then(discordResponse => discordResponse.json()).then(discordJSON => {
                        if (getBotOwner(discordJSON.id).botOwner) {
                            bot.normalCategoryList.forEach(category => {
                                if (category.toLowerCase() === req.params.category.toLowerCase()) {
                                    bot.insideNormalCategoryList[category].forEach(file => {
                                        const fileStats = {
                                            "supportGuildOnly": file.supportGuildOnly,
                                            "noDMs": !file.dms,
                                            "description": file.description,
                                            "arguments": file.arguments.join(" ") ? file.arguments.join(" ") : "None"
                                        }
    
                                        if (!file.enabled) return
                                        if (file.example) fileStats.example = file.example
    
                                        found[file.name] = fileStats
                                    })
                                }
                            })

                            if (Object.keys(found)[0]) {
                                res.send(found)
                                res.end()
                            } else {
                                bot.manageCategoryList.forEach(category => {
                                    if (category.toLowerCase() === req.params.category.toLowerCase()) {
                                        bot.insideManageCategoryList[category].forEach(file => {
                                            const fileStats = {
                                                "description": file.description,
                                                "arguments": file.arguments.join(" ") ? file.arguments.join(" ") : "None",
                                            }
    
                                            if (!file.enabled) return
                                            if (file.example) fileStats.example = file.example
    
                                            found[file.name] = fileStats
                                        })
                                    }
                                })

                                res.send(found)
                                res.end()
                            }
                        } else {
                            bot.normalCategoryList.forEach(category => {
                                if (category.toLowerCase() === req.params.category.toLowerCase()) {
                                    bot.insideNormalCategoryList[category].forEach(file => {
                                        const fileStats = {
                                            "supportGuildOnly": file.supportGuildOnly,
                                            "noDMs": !file.dms,
                                            "description": file.description,
                                            "arguments": file.arguments.join(" ") ? file.arguments.join(" ") : "None"
                                        }
    
                                        if (!file.enabled) return
                                        if (file.botOwnerOnly) return
                                        if (file.example) fileStats.example = file.example
    
                                        found[file.name] = fileStats
                                    })
                                }
                            })

                            res.send(found)
                            res.end()
                        }
                    })
                })
            } else {
                bot.normalCategoryList.forEach(category => {
                    if (category.toLowerCase() === req.params.category.toLowerCase()) {
                        bot.insideNormalCategoryList[category].forEach(file => {
                            const fileStats = {
                                "supportGuildOnly": file.supportGuildOnly,
                                "noDMs": !file.dms,
                                "description": file.description,
                                "arguments": file.arguments.join(" ") ? file.arguments.join(" ") : "None"
                            }

                            if (!file.enabled) return
                            if (file.botOwnerOnly) return
                            if (file.example) fileStats.example = file.example

                            found[file.name] = fileStats
                        })
                    }
                })

                res.send(found)
                res.end()
            }
        })
    })
}

module.exports.startSite = startSite