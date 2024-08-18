const Listing=require("./models/listing.js");
const {listingSchema,reviewSchema}=require("./schema.js");
const ExpressError=require("./extras/expressError.js");
const Review=require("./models/review.js");


module.exports.isAuthenticated=(req,res,next)=>{
    if(!req.isAuthenticated()){
      req.session.pathUrl=req.originalUrl;
      console.log(req.originalUrl);
      req.flash("error","Please login on Lovevisit");
      res.redirect("/login");
    }else{
      next();
    }
  }

  
module.exports.pathUrl=(req,res,next)=>{
    if(req.session.pathUrl){
        res.locals.mainUrl=req.session.pathUrl;
    }
    next()
  }

module.exports.listingValidate=(req,res,next)=>{
  let {error}=listingSchema.validate(req.body);
  if(error){
    let errMsg=error.details.map((ele)=>ele.message).join(",");
    throw new ExpressError(400,errMsg);
  }else{
    next();
  }
}

module.exports.reviewValidate=(req,res,next)=>{
  let {error}=reviewSchema.validate(req.body);
  if(error){
    let errMsg=error.details.map((ele)=>ele.message).join(",");
    throw new ExpressError(400,errMsg);
  }else{
    next();
  }
}






module.exports.check=async(req,res,next)=>{
  
  let {id}=req.params;
  let currLisitng=await Listing.findById(id);
  if(!(res.locals.currUser._id.equals(currLisitng.owner._id))){
    req.flash("error","Yor are not the owner of this listing");
     return res.redirect(`/listings/${id}`);
  }
  next();
}


module.exports.reviewCheck=async(req,res,next)=>{
  
  let {id,reviewid}=req.params;
  let currReview=await Review.findById(reviewid);
  if(!(res.locals.currUser._id.equals( currReview.author._id))){
    req.flash("error","Yor are not the author of this review");
     return res.redirect(`/listings/${id}`);
  }
  next();
}