const Listing=require("../models/listing")
const Review=require("../models/review");
module.exports.postReview=async (req,res)=>
{
    let listing=await Listing.findById(req.params.id);
    let newReview=new Review(req.body.review);
    newReview.author=req.user._id;
    console.log(newReview);
    listing.reviews.push(newReview);
    
    await newReview.save();
    await listing.save();
    
    req.flash("success","Review Created! ");
    res.redirect(`/listing/${listing._id}`);
}


module.exports.deleteReview=async (req,res)=>{
    let {id,reviewId}=req.params;
    
    await Listing.findByIdAndUpdate(id,{$pull : {reviews : reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash("success","Review Deleted! ");
    res.redirect(`/listing/${id}`);
}