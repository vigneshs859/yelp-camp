const express=require("express");
const route=express.Router();
const campgrounds=require("../controller/campcontrol");
const WrapAsync=require("../utils/wrapAsync");
const multer=require("multer");
const{storage}=require("../cloudinary/index")
const upload=multer({storage});

const Campground=require("../models/campground");
const {isLogged,isAuthor,validateCamp}=require("../middleware");
route.get("/new",isLogged,campgrounds.renderNewForm);
route.route("/")
.get(WrapAsync(campgrounds.indexForm))
.post(isLogged,upload.array("image"),validateCamp,WrapAsync(campgrounds.createNewForm));

route.route("/:id")
.get(campgrounds.showCampground)
.put(isLogged,isAuthor,upload.array("image"),validateCamp,WrapAsync(campgrounds.EditForm))
route.delete("/:id",isLogged,isAuthor,WrapAsync(campgrounds.deleteForm));


route.get("/:id/edit",isLogged,isAuthor,WrapAsync(campgrounds.renderEditForm))

module.exports=route;