const mongoose = require("mongoose");

const listingSchema = new mongoose.Schema({
    title: {
        type : String,
        required : true
    },
    description: {
        type : String,
        required : true
    },
    image: {
        default: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fGhvbWV8ZW58MHx8MHx8fDA%3D",
        type : String,
        set: (v) => v === " " ? "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fGhvbWV8ZW58MHx8MHx8fDA%3D" : v,
    },
    price: {
        type : String,
        required : true
    },
    location: {
        type : String,
        required : true
    },
    country: {
        type : String,
    },
    reviews: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Review"
        }
    ]
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;