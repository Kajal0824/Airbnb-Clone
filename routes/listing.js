const express=require("express");
const router=express.Router();
const wrapAsync=require("../utils/wrapAsync.js");
const{listingSchema}=require("../schema.js");
const ExpressError=require("../utils/ExpressError.js");
const Listing=require("../models/listing.js");
const {isLoggedIn, isOwner}=require("../middleware.js");

const listingController=require("../controllers/listing");
const validateListing=(req,res,next)=>{
     let{error}=listingSchema.validate(req.body);
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
//all listing 
router.get("/",wrapAsync(listingController.index));

//posting new List

router.get("/new",isLoggedIn,listingController.renderNewForm);

//See your list detail
router.get("/:id",wrapAsync(listingController.showListings));

//post route
router.post("/",isLoggedIn,validateListing,wrapAsync(listingController.postListings));

//edit your list
router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync(listingController.editForm));

//update route
router.put("/:id",isLoggedIn,isOwner,validateListing,wrapAsync(listingController.updateForm));

//Delete your list

router.delete("/:id",isLoggedIn,isOwner,wrapAsync(listingController.deleteForm));

module.exports=router;