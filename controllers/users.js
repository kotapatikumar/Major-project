
const User=require("../models/user.js");
const {pathUrl}=require("../middleware.js");

module.exports.getSignup=(req,res)=>{
    res.render("userSign.ejs");
}
module.exports.postSignup=async(req,res)=>{
    try{
    let {username,email,password}=req.body;
    const newUser=new User({
        username:username,
        email:email
    })
    let result=await User.register(newUser,password);
    req.login(result,(err)=>{
            if(err){
               return next(err);
            }else{
                req.flash("success","Welcome to Lovevisit");
                res.redirect("/listings");
            }
    })
   }catch(err){
    req.flash("error",err.message);
    res.redirect("/signup");
   }   
}

module.exports.getLogin=(req,res)=>{
    res.render("userLogin.ejs");
}
module.exports.postLogin=async(req,res)=>{
    console.log(pathUrl);
    req.flash("success","Welcome back to Lovevisit");
    res.locals.mainUrl=res.locals.mainUrl || "/listings";
    res.redirect(res.locals.mainUrl);
}
module.exports.logout=(req,res,next)=>{
    req.logout((err)=>{
        if(err){
            next(err);
        }else{
            req.flash("success","You are successfully logged out");
            res.redirect("/listings");
        }
    })
}