const express=require("express");
const router=express.Router();
const Listing=require("../models/listing.js");
const {isAuthenticated,check,listingValidate}=require("../middleware.js");
const controllers=require("../controllers/listings.js")
const asyncWrap=require("../extras/asyncWrap.js");
const multer  = require('multer')
const {storage}=require("../cloudConfig.js");
const upload = multer({ storage });


module.exports=router;

router.route("/")
.get( controllers.homeListing)
.post(isAuthenticated,upload.single('obj[image]'),listingValidate,controllers.postListing);


  
router.get("/create",isAuthenticated,controllers.createListing)
  
  
router.route("/:id")  
.get(controllers.findListing)
.put(isAuthenticated,check,upload.single('obj[image]'),listingValidate,controllers.updateListing)
.delete(isAuthenticated,check,controllers.destroyListing);
  
router.get("/:id/edit",isAuthenticated,check,controllers.editListing)
  
  
  

