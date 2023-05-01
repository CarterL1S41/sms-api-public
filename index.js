const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const bcrypt = require('bcrypt')
const Cryptr = require('cryptr');
const fs = require('fs')
const app = express();
const port = 3000;
const saltRounds = 10;
const cookieExpiration = 1000*60*60*24*7 //7 Days
const version = JSON.parse(fs.readFileSync(`${__dirname}/package.json`)).version

//Configures CORS
app.use(cors());

//Configuring cookie parser middleware
app.use(cookieParser());

// Configuring body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());





//Global CSS Provider
app.get('/global.css', (req, res) => {
    res.sendFile(`${__dirname}/pages/global.css`)
})

//Main Page
app.get('/', (req, res) => {
    if(req.cookies.sessionID !== undefined){
        let dir = fs.readdirSync(`${__dirname}/sessions/`)
        if(dir.includes(req.cookies.sessionID+`.json`)){
            let sessionRaw = fs.readFileSync(`${__dirname}/sessions/${req.cookies.sessionID}.json`)
            let sessionData = JSON.parse(sessionRaw)
            if(fs.existsSync(`${__dirname}/accounts/${sessionData.username}.json`)) {
                let rawData = fs.readFileSync(`${__dirname}/accounts/${sessionData.username}.json`)
                let jsonData = JSON.parse(rawData)
                bcrypt.compare(sessionData.password, jsonData.password, function(err, result) {
                    if(result===true){
                        res.cookie('sessionID', req.cookies.sessionID, { maxAge: cookieExpiration, httpOnly: true });
                        res.redirect(`/main`)
                    }
                    if(result===false){
                        res.clearCookie('sessionID')
                        fs.unlinkSync(`${__dirname}/sessions/${req.cookies.sessionID}.json`)
                        res.sendFile(`${__dirname}/pages/index/index.html`)
                    }
                    if(err){
                        res.clearCookie('sessionID')
                        fs.unlinkSync(`${__dirname}/sessions/${req.cookies.sessionID}.json`)
                        res.sendFile(`${__dirname}/pages/index/index.html`)
                    }
                })
            } else {
                res.clearCookie('sessionID')
                fs.unlinkSync(`${__dirname}/sessions/${req.cookies.sessionID}.json`)
                res.sendFile(`${__dirname}/pages/index/index.html`)
            }
        } else {
            res.clearCookie('sessionID')
            res.sendFile(`${__dirname}/pages/index/index.html`)
        }
    } else {
        res.sendFile(`${__dirname}/pages/index/index.html`)
    }
})
app.get('/index.css', (req, res) => {
    res.sendFile(`${__dirname}/pages/index/index.css`)
})

//Login Page
app.get('/login', (req, res) => {
    if(req.cookies.sessionID !== undefined){
        let dir = fs.readdirSync(`${__dirname}/sessions/`)
        if(dir.includes(req.cookies.sessionID+`.json`)){
            let sessionRaw = fs.readFileSync(`${__dirname}/sessions/${req.cookies.sessionID}.json`)
            let sessionData = JSON.parse(sessionRaw)
            if(fs.existsSync(`${__dirname}/accounts/${sessionData.username}.json`)) {
                let rawData = fs.readFileSync(`${__dirname}/accounts/${sessionData.username}.json`)
                let jsonData = JSON.parse(rawData)
                bcrypt.compare(sessionData.password, jsonData.password, function(err, result) {
                    if(result===true){
                        res.cookie('sessionID', sessionID, { maxAge: cookieExpiration, httpOnly: true });
                        res.redirect(`/main`)
                    }
                    if(result===false){
                        res.clearCookie('sessionID')
                        fs.unlinkSync(`${__dirname}/sessions/${req.cookies.sessionID}.json`)
                        res.sendFile(`${__dirname}/pages/login/login.html`)
                    }
                    if(err){
                        res.clearCookie('sessionID')
                        fs.unlinkSync(`${__dirname}/sessions/${req.cookies.sessionID}.json`)
                        res.sendFile(`${__dirname}/pages/login/login.html`)
                    }
                })
            } else {
                res.clearCookie('sessionID')
                fs.unlinkSync(`${__dirname}/sessions/${req.cookies.sessionID}.json`)
                res.sendFile(`${__dirname}/pages/login/login.html`)
            }
        } else {
            res.clearCookie('sessionID')
            res.sendFile(`${__dirname}/pages/login/login.html`)
        }
    } else {
        res.sendFile(`${__dirname}/pages/login/login.html`)
    }
})
app.get('/login.css', (req, res) => {
    res.sendFile(`${__dirname}/pages/login/login.css`)
})

//Creation Page
app.get('/create', (req, res) => {
    if(req.cookies.sessionID !== undefined){
        let dir = fs.readdirSync(`${__dirname}/sessions/`)
        if(dir.includes(req.cookies.sessionID+`.json`)){
            let sessionRaw = fs.readFileSync(`${__dirname}/sessions/${req.cookies.sessionID}.json`)
            let sessionData = JSON.parse(sessionRaw)
            if(fs.existsSync(`${__dirname}/accounts/${sessionData.username}.json`)) {
                let rawData = fs.readFileSync(`${__dirname}/accounts/${sessionData.username}.json`)
                let jsonData = JSON.parse(rawData)
                bcrypt.compare(sessionData.password, jsonData.password, function(err, result) {
                    if(result===true){
                        res.cookie('sessionID', sessionID, { maxAge: cookieExpiration, httpOnly: true });
                        res.redirect(`/main`)
                    }
                    if(result===false){
                        res.clearCookie('sessionID')
                        fs.unlinkSync(`${__dirname}/sessions/${req.cookies.sessionID}.json`)
                        res.sendFile(`${__dirname}/pages/create/create.html`)
                    }
                    if(err){
                        res.clearCookie('sessionID')
                        fs.unlinkSync(`${__dirname}/sessions/${req.cookies.sessionID}.json`)
                        res.sendFile(`${__dirname}/pages/create/create.html`)
                    }
                })
            } else {
                res.clearCookie('sessionID')
                fs.unlinkSync(`${__dirname}/sessions/${req.cookies.sessionID}.json`)
                res.sendFile(`${__dirname}/pages/create/create.html`)
            }
        } else {
            res.clearCookie('sessionID')
            res.sendFile(`${__dirname}/pages/create/create.html`)
        }
    } else {
        res.sendFile(`${__dirname}/pages/create/create.html`)
    }
})
app.get('/create.css', (req, res) => {
    res.sendFile(`${__dirname}/pages/create/create.css`)
})

//Error Page
app.get('/accounterror', (req, res) => {
    res.sendFile(`${__dirname}/pages/accounterror/accounterror.html`)
//    if(sessionCheck(req)===false){
//        res.clearCookie(`sessionID`)
//        res.redirect(`/`)
//    }
})
app.get('/accounterror.css', (req, res) => {
    res.sendFile(`${__dirname}/pages/accounterror/accounterror.css`)
})

//Main Page
app.get('/main', (req, res) => {
    res.sendFile(`${__dirname}/pages/main/main.html`)
})
app.get('/main.css', (req, res) => {
    res.sendFile(`${__dirname}/pages/main/main.css`)
})

//Main Page
app.get('/settings', (req, res) => {
    res.sendFile(`${__dirname}/pages/settings/settings.html`)
})
app.get('/settings.css', (req, res) => {
    res.sendFile(`${__dirname}/pages/settings/settings.css`)
})

//Profile Picture Grabber
app.get('/pfpgrab', (req, res) => {
    if(req.cookies.sessionID !== undefined){
        if(fs.existsSync(`${__dirname}/sessions/${req.cookies.sessionID}.json`)){
            let rawData = fs.readFileSync(`${__dirname}/sessions/${req.cookies.sessionID}.json`)
            let jsonData = JSON.parse(rawData)
            if(fs.existsSync(`${__dirname}/pfps/${jsonData.username}.json`)){
                let rawPFP = fs.readFileSync(`${__dirname}/pfps/${jsonData.username}.json`)
                let jsonPFP = JSON.parse(rawPFP)
                res.sendFile(`${__dirname}/pfps/${jsonPFP.pfp}`)
            } else {
                res.sendFile(`${__dirname}/icons/default.png`)
            }
        } else {
            res.sendFile(`${__dirname}/icons/default.png`)
        }
    } else {
        res.sendFile(`${__dirname}/icons/default.png`)
    }
})

//Home Logo
app.get('/homelogo', (req, res) => {
    res.sendFile(`${__dirname}/icons/home.png`)
})

//Logout Logo
app.get('/logoutlogo', (req, res) => {
    res.sendFile(`${__dirname}/icons/logout.png`)
})

//send Logo
app.get('/sendbutton', (req, res) => {
    res.sendFile(`${__dirname}/icons/sendlogo.png`)
})

//Logout
app.get('/logout', (req, res) => {
    if(req.cookies.sessionID !== undefined){
        res.clearCookie('sessionID')
        if(fs.existsSync(`${__dirname}/sessions/${req.cookies.sessionID}.json`)){
            fs.unlinkSync(`${__dirname}/sessions/${req.cookies.sessionID}.json`)
        }
    }
    res.redirect(`/`)
})

//Username Grabber
app.get('/usernamefetch', (req, res) => {
    let cookie = req.cookies.sessionID
    if(cookie !== undefined){
        if(fs.existsSync(`${__dirname}/sessions/${cookie}.json`)){
            let rawData = fs.readFileSync(`${__dirname}/sessions/${cookie}.json`)
            let jsonData = JSON.parse(rawData)
            res.send(`{ "username": "${jsonData.username}" }`)
        }
    }
})

//Edit Username Logo
app.get('/editusername', (req, res) => {
    res.sendFile(`${__dirname}/icons/editusername.png`)
})

//Chat Creation Logo
app.get('/chatcreatelogo', (req, res) => {
    res.sendFile(`${__dirname}/icons/createchat.png`)
})

//Chat Processor
app.get('/chatfetch', (req, res) => {
    let cookie = req.cookies.sessionID
    if(cookie !== undefined){
        if(fs.existsSync(`${__dirname}/sessions/${cookie}.json`)){
            let rawData = fs.readFileSync(`${__dirname}/sessions/${cookie}.json`)
            let jsonData = JSON.parse(rawData)
            let username = jsonData.username
            var chatArray = []
            let chatDir = fs.readdirSync(`${__dirname}/chats/`)
            chatDir.forEach(async (element) => {
                let rawEle = fs.readFileSync(`${__dirname}/chats/${element}`)
                let jsonEle = JSON.parse(rawEle)
                let names = jsonEle.users.split('-')
                if(names[0]===username){
                    chatArray.push(`{ "name": "${names[1]}", "id": "${jsonEle.id}" }`)
                }
                if(names[1]===username){
                    chatArray.push(`{ "name": "${names[0]}", "id": "${jsonEle.id}" }`)
                }
            })
            res.send(`${JSON.stringify(chatArray)}`)
        }
    }
})

//Message Fetcher
app.post('/msgfetch', (req, res) => {
    let body = req.body
    let cookie = req.cookies.sessionID
    if(cookie !== undefined){
        if(fs.existsSync(`${__dirname}/sessions/${cookie}.json`)){
            let rawData = fs.readFileSync(`${__dirname}/sessions/${cookie}.json`)
            let jsonData = JSON.parse(rawData)
            let username = jsonData.username
            let rawEle = fs.readFileSync(`${__dirname}/chats/${body.id}.json`)
            let jsonEle = JSON.parse(rawEle)
            let array = []
            jsonEle.messages.forEach(async (element) => {
                array.push(`{ "author": "${element.author}", "timestamp": "${element.timestamp}", "content": "${element.content}" }`)
            })
            res.send(`{ "username": "${username}", "id": "${body.id}", "messages": [${array.reverse()}] }`)
        }
    }
})

//Message Receiver
app.post('/msgsubmit', (req, res) => {
    let body = req.body
    let cookie = req.cookies.sessionID
    if(cookie !== undefined){
        if(fs.existsSync(`${__dirname}/sessions/${cookie}.json`)){
            let rawData = fs.readFileSync(`${__dirname}/sessions/${cookie}.json`)
            let jsonData = JSON.parse(rawData)
            let username = jsonData.username
            let rawEle = fs.readFileSync(`${__dirname}/chats/${body.id}.json`)
            let jsonEle = JSON.parse(rawEle)
            let array = jsonEle.messages
            const currentDate = new Date();
            const timestampInMs = currentDate.getTime();
            const unixTimestamp = Math.floor(currentDate.getTime() / 1000);
            let stringify = { "author": `${username}`, "timestamp": unixTimestamp, "content": `${body.message}` }
            array.push(stringify)
            let output = JSON.stringify(array)
            let data = `{ "users": "${jsonEle.users}", "id": "${jsonEle.id}", "messages": ${output} }`
            fs.writeFileSync(`${__dirname}/chats/${body.id}.json`, data)
            res.send(`{ "response": "ok", "id": "${body.id}" }`)
        }
    }
})

//Chat Create
app.post('/chatcreate', (req, res) => {
    let body = req.body
    let cookie = req.cookies.sessionID
    if(cookie !== undefined){
        if(fs.existsSync(`${__dirname}/sessions/${cookie}.json`)){
            let rawData = fs.readFileSync(`${__dirname}/sessions/${cookie}.json`)
            let jsonData = JSON.parse(rawData)
            let username = jsonData.username
            let seconduser = body.seconduser
            let rawKeyID = fs.readFileSync(`${__dirname}/chatcount.json`)
            let jsonKeyID = JSON.parse(rawKeyID)
            let keyID = Number(jsonKeyID.keyNum)+1
            var chars = "0"
            var keyIDlength = 23-keyID.toString.length;
            var keyIDF = "";
            for (var i = 0; i <= keyIDlength; i++) {
                var randomNumber = Math.floor(Math.random() * chars.length);
                keyIDF += chars.substring(randomNumber, randomNumber +1);
            }
            let keyIDFull = `${keyIDF}`+`${keyID}`
            if(fs.existsSync(`${__dirname}/accounts/${seconduser}.json`)){
                fs.writeFileSync(`${__dirname}/chatcount.json`, `{ "keyNum": "${keyIDFull}" }`)
                fs.writeFileSync(`${__dirname}/chats/${keyIDFull}.json`, `{ "users": "${username}-${seconduser}", "id": "${keyIDFull}", "messages": [] }`)
                res.send(`{ "response": "200" }`)
            } else {
                res.send(`{ "response": "300" }`)
            }

        }
    }
})





//Chat Profile Picture Grabber
app.post('/chatpfpfetch', (req, res) => {
    const body = req.body






    
    res.send('{}')
})

//Login
app.post('/accountlogin', (req, res, next) => {
    const body = req.body;
    if(fs.existsSync(`${__dirname}/accounts/${body.username}.json`)){
        let rawData = fs.readFileSync(`${__dirname}/accounts/${body.username}.json`)
        let jsonData = JSON.parse(rawData)
        bcrypt.compare(body.password, jsonData.password, function(err, result) {
            if(result===true){
                var chars = "0123456789"
                var sessionLength = 23
                var sessionID = ""
                for (var i = 0; i <= sessionLength; i++) {
                    var randomNumber = Math.floor(Math.random() * chars.length)
                    sessionID += chars.substring(randomNumber, randomNumber +1)
                }
                res.cookie('sessionID', sessionID, { maxAge: cookieExpiration, httpOnly: true });
                fs.writeFileSync(`${__dirname}/sessions/${sessionID}.json`, `{ "username": "${body.username}", "password": "${body.password}" }`)
                res.redirect(`/main`)
            }
            if(result===false){
                res.redirect(`/accounterror`)
            }
            if(err){
                res.redirect(`/accounterror`)
            }
        })
    } else {
        res.redirect(`/accounterror`)
    }
})

//Create
app.post('/accountcreate', (req, res) => {
    const body = req.body;
    if(!fs.existsSync(`${__dirname}/accounts/${body.username}.json`)){
        bcrypt.hash(body.password, saltRounds, function(err, hash) {
            if(hash){
                var chars = "0123456789"
                var sessionLength = 23
                var sessionID = ""
                for (var i = 0; i <= sessionLength; i++) {
                    var randomNumber = Math.floor(Math.random() * chars.length)
                    sessionID += chars.substring(randomNumber, randomNumber +1)
                }
                res.cookie('sessionID', sessionID, { maxAge: cookieExpiration, httpOnly: true });
                fs.writeFileSync(`${__dirname}/sessions/${sessionID}.json`, `{ "username": "${body.username}", "password": "${body.password}" }`)
                fs.writeFileSync(`${__dirname}/accounts/${body.username}.json`, `{ "password": "${hash}" }`)
                res.redirect(`/main`)
            }
            if(err){
                res.redirect(`/accounterror`)
            }
        })
    } else {
        res.redirect(`/accounterror`)
    }



})

//Update Username
app.post('/accountusernameupdate', (req, res) => {
    const body = req.body
    console.log(body)
    res.send('{ "response": "300" }')
})

app.listen(port, () => console.log(`SMS-API V-${version} listening on port ${port}!`))