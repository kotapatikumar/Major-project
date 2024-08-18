const Listing=require("../models/listing.js");
const Review=require("../models/review.js");





module.exports.postReview=async(req,res)=>{
    let {id}=req.params;
    const list=await Listing.findById(id);
    const review1=new Review(req.body.review);
    review1.author=req.user._id;
    list.reviews.push(review1);
    await review1.save();
    await list.save();
    req.flash("success","New Review Created");
    res.redirect(`/listings/${id}`);
  }

module.exports.deleteReview=async(req,res)=>{
    let {id,reviewid}=req.params;
    const update= await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewid}});
    const del=await Review.findByIdAndDelete(reviewid);
    req.flash("success","Review Deleted");
    res.redirect(`/listings/${id}`);
  }