const express = require("express");
const mongoose = require("mongoose");
const Listing = require("./models/listing");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync");
const ExpressError = require("./utils/ExpressError");
const app = express();

//Joi 
const Joi = require('joi');

// Listing Schema from Joi
const { listingSchema } = require("./schema.js")

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

//
const validateListing = (req, res, next) => {
    let {error} = listingSchema.validate(req.body);
    if (error) {
        throw new ExpressError(400, error);
    }   else{
        next();
    }
}

//Index Route
app.get("/",wrapAsync( async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", {allListings});
}));

//All Listing
app.get("/listings",wrapAsync( async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", {allListings});
}));

//New Route
app.get("/listings/new", (req, res) => {
    res.render("listings/new.ejs");
});

//Show Route
app.get("/listings/:id",wrapAsync( async (req, res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/show.ejs",{listing});
}));

//Create Route
app.post("/listings",validateListing, wrapAsync( async (req, res, next) => {
    // let {title, description,image,price,country,location} = req.body;
    // let listing = req.body.listing;
        let result = listingSchema.validate(req.body);
        console.log(result);
        if (result.error) {
            throw new ExpressError(400, result.error);
        }
        const newListing = new Listing(req.body.listing);
        await newListing.save();
        res.redirect("/listings");
})
);

//Edit Route
app.get("/listings/:id/edit",wrapAsync( async (req, res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs",{listing});
}));

//Update Route
app.put("/listings/:id", validateListing, wrapAsync( async (req, res) => {
    let {id} = req.params;
    await Listing.findByIdAndUpdate(id,{...req.body.listing});
    res.redirect(`/listings/${id}`);
}));

//Delete Route
app.delete("/listings/:id",wrapAsync( async (req, res) => {
    let {id} = req.params;
    const deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    res.redirect("/listings");
}));

//Test Listing
// app.get("/testListing",async (req, res) => {
//     let sampleListing = new Listing({
//         title: "new villa",
//         description: "in the beach",
//         price: 1222,
//         location: "sre",
//         country:"india"
//     });
//     await sampleListing.save()
//     .then(()=>{console.log("Listing save Successfull")})
//     .catch((err)=>console.log(err));
//     console.log("Sample was save");
//     res.send("SuccessFul testing");
// });

app.use((req,res, err,) => {
    let {statusCode, message} = err;
    res.render("error.ejs", {message});
    // res.status(statusCode).send(message);
})

app.listen(8080, (req, res) => {
    console.log("Server is listening to port 8080");
});
