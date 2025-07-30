const express=require("express");
const app=express();

const flash=require("connect-flash");
const path=require("path");
app.set("view engine","ejs");
app.set("views",path.join(__dirname , "views"));
const session=require("express-session");
const sessionOption={secret:"mySuperSecretKey",resave:false,saveUninitialized:true};
app.use(session(sessionOption));
app.use(flash());
// app.get("/countSession",(req,res)=>
// {
//     if(req.session.count){
//         req.session.count++;
//     }
//     else{
//         req.session.count=1;
//     }
//     res.send(`Number of time session was Called is ${req.session.count}`);
// });

app.get("/register",(req,res)=>{
    let{name="anonymous"}=req.query;
    req.session.name=name;
    if(name==="anonymous"){
        req.flash("error","error occurs during calling route");
    }
    else{
        req.flash("success","Your message is deliverd successfull");

    }
    res.redirect("/listen")
});
app.get("/listen",(req,res)=>
{
    res.locals.successMsg=req.flash("success");
    res.locals.errorMsg=req.flash("error");
   res.render("page.ejs",{name:req.session.name});
});
const port=3000;

app.listen(port,()=>{
    console.log(`listening in ${port} Port.`)
})