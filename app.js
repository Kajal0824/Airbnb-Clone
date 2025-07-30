const express=require("express");
const app=express();
const mongoose=require("mongoose");
const path=require("path");
const ExpressError=require("./utils/ExpressError.js");
const ejsMate=require("ejs-mate");
const methodOverride=require("method-override");
app.set("view engine","ejs");
app.set("views",path.join(__dirname , "views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname,"/public/css")));
app.use(express.static(path.join(__dirname,"/public/js")));
const session=require("express-session");
const flash=require("connect-flash");
const passport=require("passport");
const LocalStrategy=require("passport-local");
const User=require("./models/user.js");
const listingsRouter=require("./routes/listing.js");
const reviewsRouter=require("./routes/review.js");
const userRouter=require("./routes/user.js");
main()
.then((res)=>
{
    console.log("connection succesfull");
})
.catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/wanderLust');
}

const port=8080;

app.listen(port,()=>
{
    console.log("app is listening at port 8080");
});

const sessionOption={
    secret:"mysupersecretcode",
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly:true,
    },
}

app.get("/",(req,res)=>
{
    res.send("<h2> Root is working properly </h2>");
});

app.use(session(sessionOption));
app.use(flash());
//passport api middleware
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
    res.locals.successMsg=req.flash("success");
    res.locals.errorMsg=req.flash("error");
    res.locals.currUser=req.user;
    next();
});


app.use("/listings",listingsRouter);
app.use("/listing",listingsRouter);
app.use("/listing/:id/review",reviewsRouter);
app.use("/",userRouter);

app.all("*",(req,res,next)=>
{
    next(new ExpressError(404,"Page not Found! Please enter a valid route."));
});

app.use((err,req,res,next)=>
{
   let {statusCode=500,message="Something Went Wrong!"}=err;
   res.status(statusCode).render("listings/error.ejs",{message});
});