const express=require("express");
const route=express.Router({mergeParams:true});
const Apperror=require("../utils/Apperror");
const {isLogged,isReviewer}=require("../middleware");
const reviews=require("../controller/reviewcontrol");
const WrapAsync=require("../utils/wrapAsync");
const {validatereview}=require("../middleware")
const Review=require("../models/review");
const Campground=require("../models/campground");

route.post("/review",validatereview,WrapAsync(reviews.addReview))
route.delete("/review/:reviewId",isLogged,isReviewer,WrapAsync(reviews.deleteReview))
module.exports=route;