require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const { login, refresh } = require('./jwt/authentication')
const { addUser, verifyLogin } = require('./hashpassword/DBfunctions')
//const { addUser,read,verifyLogin } = require('./DBstorage/DBfunctions')

const app = express()
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, DELETE, OPTIONS"
  );
  next();
});

app.use(bodyParser.json())
app.use(cookieParser())

app.post('/login', login)
app.post('/refresh', refresh)
app.post('/addUser', addUser)
app.post('/loginn', verifyLogin)

app.listen(8080,function(){
  console.log("server start at 8080");
})


