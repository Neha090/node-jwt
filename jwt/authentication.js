let config = require('dotenv').config()
const jwt = require('jsonwebtoken')
const body =require('./helper')

let users = {
    neha: { password: "neha" },
    mary: { password: "passwordmary" }
}

exports.login = function (req, res) {
        body.dataReqPromise(req,res).then((data)=>{
        
        var username = data.user
        var password = data.pass
        
        // var username = req.body.user
        // var password = req.body.pass

        // Neither do this!
        if (!username || !password || users[username].password !== password) {
            return res.status(401).send("wrong password")
        }

        else if (users[username].password === password) {

            let payload = { username: username }

            // create the access token with the shorter lifespan
            let accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
                algorithm: "HS256",
                expiresIn: process.env.ACCESS_TOKEN_LIFE
            })

            // create the refresh token with the longer lifespan
            let refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {
                algorithm: "HS256",
                expiresIn: process.env.REFRESH_TOKEN_LIFE
            })

            //store the refresh token in the user array
            users[username].refreshToken = refreshToken

            //send the access token to the client inside a cookie
            res.cookie("jwt", accessToken, { secure: false, httpOnly: true })
            res.send("<html><form name='login' action='http://localhost:8080/refresh' method='POST'><input type='submit' value='Refresh'></form></html>");

        }
        })
        

        //use the payload to store information about the user such as username, user role, etc
}


exports.refresh = function (req, res) {

    let accessToken = req.cookies.jwt

    if (!accessToken) {
        return res.status(403).send("you don't have accessToken")
    }

    let payload
    try {
        payload = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET)
    }
    catch (e) {
        console.log(e);
        return res.status(401).send()
    }

    //retrieve the refresh token from the users array
    let refreshToken = users[payload.username].refreshToken

    //verify the refresh token
    try {
        jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET)
    }
    catch (e) {
        return res.status(401).send()
    }
    payload = {username : payload.username};
    let newToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET,
        {
            algorithm: "HS256",
            expiresIn: process.env.ACCESS_TOKEN_LIFE
        })

    res.cookie("jwt", newToken, { secure: false, httpOnly: true })
    res.send("Token Reissued !!!!!")
}