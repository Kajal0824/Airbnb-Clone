const Listing=require("../models/listing");
module.exports.index=async(req,res)=>
{
    let allListing= await Listing.find({});
    //console.log(allListing);
    res.render("listings/index", { allListing });
}

module.exports.renderNewForm=(req,res)=>
{
    res.render("listings/new.ejs");
}

module.exports.showListings=async (req,res)=>
    {
        let{ id }=req.params;
        let listing=await Listing.findById(id).populate({path:"reviews",populate:{path:"author"},}).populate("owner");
        if(!listing){
            req.flash("error","Listing you are requested for does not exist! ");
            res.redirect("/listings")
        }
        res.render("listings/show.ejs",{listing});
    }

module.exports.postListings=async (req,res,next)=>
    {
        const newListing=new Listing(req.body.listing);
        newListing.owner=req.user._id;
        await newListing.save();
        req.flash("success","New listing is created successfully! ");
        res.redirect("/listings");
       
    }

module.exports.editForm=async (req,res)=>
    {
        let{ id }=req.params;
        let listing=await Listing.findById(id);
        if(!listing){
            req.flash("error","Listing you are requested for does not exist! ");
           return res.redirect("/listings")
        }
        res.render("listings/edit.ejs",{listing});
    }

module.exports.updateForm=async (req,res)=>
{
    let{ id }=req.params;
    await Listing.findByIdAndUpdate(id, {...req.body.listing});
    req.flash("success","Updation successfully! ");
    res.redirect("/listings");
}

module.exports.deleteForm=async (req,res)=>
{
    let { id }=req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success","Listing Deleted! ");
    res.redirect("/listings");
}