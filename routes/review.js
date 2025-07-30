const express=require("express");
const router=express.Router({mergeParams:true});
const wrapAsync=require("../utils/wrapAsync.js");
const{reviewSchema}=require("../schema.js");
const ExpressError=require("../utils/ExpressError.js");
const Review=require("../models/review.js");
const Listing=require("../models/listing.js");
const {isLoggedIn, isReviewAuthor}=require("../middleware.js");
const reviewController=require("../controllers/review");
const review=require("../models/review.js")

const validateReview=(req,res,next)=>{
    let{error}=reviewSchema.validate(req.body);
    if(error)
    {
       let errMsg=error.details.map((el)=>el.message).join(",")
       throw new ExpressError(404,errMsg);
    }
    else
    {
       next();
    }
}

//post route review 
router.post("/",isLoggedIn,validateReview,wrapAsync(reviewController.postReview));
    
    // Delete review route
router.delete("/:reviewId",isLoggedIn,isReviewAuthor,wrapAsync(reviewController.deleteReview));

module.exports=router;