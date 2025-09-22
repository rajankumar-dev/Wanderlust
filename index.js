const express = require("express");
const mongoose = require("mongoose");
const Listing = require("./models/listing");
const Review = require("./models/review");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync");
const ExpressError = require("./utils/ExpressError");
const app = express();

//require router
const listings = require("./routes/listing.js");
//Joi 
const Joi = require('joi');

// Listing Schema from Joi
const { listingSchema } = require("./schema.js")
const { reviewSchema } = require("./schema.js")

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


const validateReview = (req, res, next) => {
    let {error} = reviewSchema.validate(req.body);
    if (error) {
        throw new ExpressError(400, error);
    }   else{
        next();
    }
}

app.use("/listings", listings);

//Reviews post rout
app.post("/listings/:id/reviews", validateReview, wrapAsync(async(req, res) => {
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);

    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();

    res.redirect(`/listings/${listing._id}`);
})
);

//review delete route
app.delete("/listings/:id/reviews/:reviewId", wrapAsync (async (req, res) => {
    let { id, reviewId } = req.params;
    await Listing.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/listings/${id}`);
}))


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
