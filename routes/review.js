
const express=require("express");
const router=express.Router({mergeParams:true});
const Listing=require("../models/listing.js");
const asyncWrap=require("../extras/asyncWrap.js");
const ExpressError=require("../extras/expressError.js");
const {listingSchema,reviewSchema}=require("../schema.js");
const Review=require("../models/review.js");
const {reviewValidate,isAuthenticated,reviewCheck}=require("../middleware.js");
const reviewcontrollers=require("../controllers/reviews.js");


  router.post("/",isAuthenticated,reviewValidate,asyncWrap(reviewcontrollers.postReview));
  
  
  router.delete("/:reviewid",isAuthenticated,reviewCheck,asyncWrap(reviewcontrollers.deleteReview))
  
  module.exports=router;