const express=require("express");
const User=require("../models/user");
const passport=require("passport");
const wrapasync=require("../utils/wrapAsync")
const route=express.Router();
const {storeReturnTo}=require("../middleware");
const users=require("../controller/usercontrol")
route.route("/register")
.get(users.renderRegister)
.post(wrapasync(users.addRegister))

route.route("/login")
.get(users.renderLogin)
.post(storeReturnTo,passport.authenticate("local",{failureFlash:true,failureRedirect:"/login"}),users.newLogin);
route.get("/logout",users.logOut);
module.exports=route