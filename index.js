const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const app = express();
const session = require('express-session');
const flash = require('connect-flash');


//require router
const listings = require("./routes/listing.js");
const reviews = require("./routes/review.js");
//Joi 
const Joi = require('joi');

//Set up EJS
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
// Set up for encodded data
app.use(express.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "public")));


//DataBase Setup
main().then(() => {
    console.log("Connected Success");
}).catch(err => console.log(err));

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/Wanderlust');
}

//Express Session
app.use(session({
    secret: 'mysecretkey',
    resave: false,
    saveUninitialized: false,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 1000,
        maxAge: 86400000,
    }
}));
app.use(flash());

app.use((req,res, next) => {
    res.locals.success = req.flash("success");
    next();
})

app.use("/listings", listings);

app.use("/listings/:id/reviews", reviews);


app.use((req,res, err,) => {
    let {statusCode, message} = err;
    res.render("error.ejs", {message});
    // res.status(statusCode).send(message);
})

app.listen(8080, (req, res) => {
    console.log("Server is listening to port 8080");
});
