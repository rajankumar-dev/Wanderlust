
const mongoose = require('mongoose');
const { Schema } = require('mongoose');
main()
.then(() => console.log("Connection Successful"))
.catch(err => console.log(err));

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/relationDemo');
}

//One To many(few)
const orderSchema = new Schema({
    item: String,
    price:Number,
});

//customer Schema
const customerSchema =  new Schema({
    name: String,
    orders: [
        {
            type: Schema.Types.ObjectId,

            ref: "Order",
        },
    ],
});

customerSchema.pre("findOneAndDelete", async() => {
    console.log("Pre Middleware");
    
})
customerSchema.post("findOneAndDelete", async() => {
    console.log("post Middleware");
    
})
const Customer1 = mongoose.model("Customer1", customerSchema);
const Order = mongoose.model("Order", orderSchema);

const addCustomer = async () => {
    let cust1 = new Customer({
        name: "Rahul Kumar",
    });

    let order1 = await Order.findOne({item:"Chips"});
    let order2 = await Order.findOne({item: "Chocolate"});

    cust1.orders.push(order1);
    cust1.orders.push(order2);

    let result = await cust1.save();
    console.log(result);
}

addCustomer();



// const addOrders = async () => {
//     let res = await Order.insertMany([
//         { item: "Samosa", price: 12 },
//         { item: "Chips", price: 10},
//         { item: "Chocolate", price: 40},
//     ]);
//     console.log(res);
    
// }
// addOrders();