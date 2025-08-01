const User=require("../models/user.js");
module.exports.renderSignUpForm=(req,res)=>{
    res.render("users/signup");
}

module.exports.signUp=async(req,res)=>{
    try{   
    let {username,email,password}=req.body;
    const newUser=new User({username,email});
    const registeredUser=await User.register(newUser,password);
    console.log(registeredUser);
    req.login(registeredUser,(err)=>{
        if(err)
        {
            return next(err);
        }
        req.flash("success","Welcome to WanderLust");
        res.redirect("/listings");
    });
}
    catch(err){
        req.flash("error",err.message);
        res.redirect("/signUp");
    }
}

module.exports.userLoginForm=(req,res)=>{
    res.render("users/login");
}

module.exports.login=async(req,res)=>{
    req.flash("success","welcome Back to WanderLust");
    let redirectUrl=res.locals.redirectUrl || "/listings"
    res.redirect(redirectUrl);
}

module.exports.logout=(req,res,next)=>{
    req.logout((err)=>{
        if(err){
           return next(err);
        }
        req.flash("success","Logged out successfull!");
        res.redirect("/listings");
    });
}