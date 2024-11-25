const mongoose = require ("mongoose");
const {Schema} = mongoose;

main ()
   .then(() => console.log("connection success"))
   .catch((err) => console.log(err));

async function main() {
    await mongoose.connect("mongodb://127.0.0.1:27017/relationDemo");
}

const orderSchema = new Schema({
    item: String,
    price: Number,
});

const customerSchema = new Schema({
    name : String,
    order : [
        {
            type: Schema.Types.ObjectId,
            ref: "Order",
        },
    ],
});

/*customerSchema.pre("findOneAndDelete" , async () => { 
    console.log("Pre");
});*/

customerSchema.post("findOneAndDelete" , async (customer) => { 
    if(customer.order.length) {
        let resuu = await Order.deleteMany({ _id : { $in : customer.order}});
        console.log(resuu);
    }
});

const Order = mongoose.model("Order" , orderSchema);
const Customer = mongoose.model("Customer" , customerSchema);

/*const findCustomer = async () => {
    
    let result = await Customer.find({}).populate("order");
    console.log(result[0]);
};*/


const addCust = async () => {
    let newCust = new Customer({
        name: "Karan",
    });

    let newOrder = new Order({
        item: "pizza",
        price : 250,
    });

    newCust.order.push(newOrder);

    await newOrder.save();
    await newCust.save();

    console.log("added a new Customer");
};

const delCust = async() => {
    let data = await Customer.findByIdAndDelete("67346ddb8af673b2df465d2c");
    console.log(data);
};

//addCust();
delCust();