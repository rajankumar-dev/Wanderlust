const express = require('express');
const router = express.Router({mergeParams: true});
const wrapAsync = require("../utils/wrapAsync");
const ExpressError = require("../utils/ExpressError");
const Review = require("../models/review");
const { reviewSchema } = require("../schema.js")
const Listing = require("../models/listing");

const validateReview = (req, res, next) => {
    let {error} = reviewSchema.validate(req.body);
    if (error) {
        throw new ExpressError(400, error);
    }   else{
        next();
    }
}

//Reviews post rout
router.post("/", validateReview, wrapAsync(async(req, res) => {
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);

    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();

    res.redirect(`/listings/${listing._id}`);
})
);

//review delete route
router.delete("/:reviewId", wrapAsync (async (req, res) => {
    let { id, reviewId } = req.params;
    await Listing.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/listings/${id}`);
}))

module.exports = router;