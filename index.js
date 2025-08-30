const express = require("express");
const mongoose = require("mongoose");
const Listing = require("./models/listing");
const path = require("path");
const app = express();

//Set up EJS
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
// Set up for encodded data
app.use(express.urlencoded({extended: true}));


//DataBase Setup
main().then(() => {
    console.log("Connected Success");
}).catch(err => console.log(err));

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/wanderlnn');
}

//Index Route
app.get("/", (req, res) => {
    res.send("hello World");
});

//All Listing
app.get("/listings", async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", {allListings});
});

//Show Route
app.get("/listings/:id", async (req, res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/show.ejs",{listing});
});



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

app.listen(8080, (req, res) => {
    console.log("Server is listening to port 8080");
});
