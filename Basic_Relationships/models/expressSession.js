const session = require('express-session');
const express = require("express");
const app = express();


//Express Session
app.use(session({
    secret: 'mysecretkey',
    resave: false,
    saveUninitialized: false,
    cookie: {maxAge: 86400000}
}))


app.get("/setUsername", (req, res) => {
    req.session.username = "rajanKumar";
    res.send("Username saved to the session");
})

//home route
app.get("/", (req, res) => {
    if(req.session.username){
        res.send(`Name of the User is : ${req.session.username }`);
    }
    else{
        res.send("User not found");
    }
})

app.get("/getUsername", (req, res) => {
    if(req.session.username){
        res.send(`Name of the User is : ${req.session.username }`);
    }
    else{
        res.send("User not found");
    }
})


app.listen(8080, (req, res) => {
    console.log("Server is listening to port 8080");
});