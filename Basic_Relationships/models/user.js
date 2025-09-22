
const mongoose = require('mongoose');
const { Schema } = require('mongoose');
main()
.then(() => console.log("Connection Successful"))
.catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/relationDemo');
}

//One To many(few)
const userSchema = new Schema({
  username: String,
  addresses: [
    {
      location: String,
      city: String,
    },
  ],
});

const User1 = mongoose.model("User1", userSchema);

const addUsers = async () => {

  let user1 = new User({
    username: "rahul Kumar",
    addresses: [
      {
        location:"Baker",
        city: "Landon"
      },
    ],
  });
  user1.addresses.push({
    location:"WallStreet", city:"delhi"
  });
  let result = await user1.save();
  console.log(result);
  
}

addUsers();