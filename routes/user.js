const express=require("express");
const router=express.Router();
const asyncWrap=require("../extras/asyncWrap.js");
const User=require("../models/user.js");
const passport=require("passport");
const {pathUrl}=require("../middleware.js");
const userControllers=require("../controllers/users.js");


router.route("/signup")
.get(userControllers.getSignup)
.post(asyncWrap(userControllers.postSignup));

router.route("/login")
.get(userControllers.getLogin)
.post(pathUrl,passport.authenticate('local', { failureRedirect: '/login',failureFlash:true }),asyncWrap(userControllers.postLogin));

router.get("/logout",userControllers.logout);



module.exports=router;
