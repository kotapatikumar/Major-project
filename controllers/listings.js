const axios = require('axios');

const apiKey = 'eHyg5wG9hS4QYXwO2V4n';










const Listing=require("../models/listing.js");
const asyncWrap=require("../extras/asyncWrap.js");
module.exports.homeListing=asyncWrap(async (req,res)=>{
    const value= await Listing.find();
    res.render("home.ejs",{value});
  });

module.exports.createListing=async(req,res)=>{


    res.render("create.ejs");
 }

module.exports.postListing=asyncWrap(async (req,res,next)=>{
  const location = req.body.obj.location; // The location you want to geocode
  let response= await axios.get(`https://api.maptiler.com/geocoding/${encodeURIComponent(location)}.json`, {
    params: {
        key: apiKey
    }
 })
// .then(response => {
//     console.log("Response sended successfully");
//     // You can access the geocoding results here
//  })
// .catch(error => {
//     console.error('Error fetching geocoding data:', error);
//  });
// console.log(response);


    const url=req.file.path;
    const filename=req.file.filename;
    const final= new Listing(req.body.obj);
    final.owner=req.user._id;
    final.image={url,filename};
    final.geometry= await response.data.features[0].geometry
    let result=await final.save();
    req.flash("success","New Listing Created");
    res.redirect("/listings");  
});


module.exports.findListing=async (req,res,next)=>{
    try{
      let {id}=req.params;
      const value=await Listing.findById(id).
      populate({path:"reviews",populate:{path:"author"}}).populate("owner");
      if(!value){
        req.flash("error","No listing available");
        res.redirect("/listings");
      }
      res.render("show.ejs",{value});
    }catch(err){
      next(err);
    }
  
  }

  module.exports.editListing=asyncWrap(async(req,res)=>{
    let {id}=req.params;
    const value=await Listing.findById(id);
    if(!value){
      req.flash("error","No listing available");
      res.redirect("/listings");
    }
    let originalImageUrl=value.image.url;
    originalImageUrl=originalImageUrl.replace("/upload","/upload/h_300,w_250");
    res.render("edit.ejs",{value,originalImageUrl});
  })


  module.exports.updateListing=asyncWrap(async(req,res,next)=>{
    let {id}=req.params;
    const final=await Listing.findByIdAndUpdate(id,{...req.body.obj},{new:true,runValidators:true});

    if(typeof req.file !=="undefined"){
    const url=req.file.path;
    const filename=req.file.filename;
    final.image={url,filename};
    await final.save();
  }
    req.flash("success","Listing Updated");
    res.redirect(`/listings/${id}`);
  })

  module.exports.destroyListing=asyncWrap(async(req,res)=>{
    let {id}=req.params;
    const value=await Listing.findByIdAndDelete(id);
    req.flash("success","Listing Deleted");
    res.redirect("/listings");
  });