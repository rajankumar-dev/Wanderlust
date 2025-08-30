const express = require("express");
const mongoose = require("mongoose");
const Listing = require("./models/listing");
const app = express();

//DataBase Setup
main().then(() => {
    console.log("Connected Success");
    
}).catch(err => console.log(err));

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/wanderlnn');

}

app.get("/", (req, res) => {
    res.send("hello World");
});

app.get("/testListing",async (req, res) => {
    let sampleListing = new Listing({
        title: "new villa",
        description: "in the beach",
        price: 1222,
        location: "sre",
        country:"india"
    });
    await sampleListing.save()
    .then(()=>{console.log("Listing save Successfull")})
    .catch((err)=>console.log(err));
    console.log("Sample was save");
    res.send("SuccessFul testing");
    
});

app.listen(8080, (req, res) => {
    console.log("Server is listening to port 8080");
});
