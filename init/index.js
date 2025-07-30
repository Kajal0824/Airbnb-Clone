const mongoose=require("mongoose");
const initData=require("./data.js");
const Listing=require("../models/listing.js");

const MONGO_URL="mongodb://127.0.0.1:27017/wanderLust";

main().then(()=>
{
    console.log("connection builded");
})
.catch((err)=>
{
    console.log("err during connection",err);
});

async function main()
{
    await mongoose.connect(MONGO_URL);
}

const initDb = async ()=>
{
    await Listing.deleteMany({});
    initData.data=initData.data.map((obj)=>({
        ...obj,
        owner:"67e93cd251d92a9a08b7b99c",
    }));
    await Listing.insertMany(initData.data);
    console.log("data is inserted in database");
}

initDb();