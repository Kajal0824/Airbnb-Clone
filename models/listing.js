const mongoose=require("mongoose");
const Schema=mongoose.Schema;
const Review=require("./review.js");
const { reviewSchema } = require("../schema");
const listingSchema=new Schema({
    title:{
        type:String,
        required:true
    },
    description:
    {
        type:String
    },
    image:
    {
        type:String,
        default: "https://images.unsplash.com/photo-1505843513577-22bb7d21e455?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8bWFuc2lvbnxlbnwwfHwwfHx8MA%3D%3D",
        set: (v) => v==="" ? "https://images.unsplash.com/photo-1505843513577-22bb7d21e455?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8bWFuc2lvbnxlbnwwfHwwfHx8MA%3D%3D":v,      
    },
    price : {
        type:Number
    },
    location:
    {
        type:String
    },
    country:
    {
        type:String
    },
    reviews:
    [
    {
        type:Schema.Types.ObjectId,
        ref:"Review",
    },
],
    owner:{
       type:Schema.Types.ObjectId,
       ref:"User"
    },
});

listingSchema.post("findOneAndDelete", async(listing)=>{
    if(listing){
        await Review.deleteMany({_id:{$in:listing.reviews}});
    }
})

const Listing=mongoose.model("Listing",listingSchema);
module.exports=Listing;