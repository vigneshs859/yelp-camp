const User=require("../models/user");
module.exports.renderRegister=(req,res)=>
{
    res.render("user/register.ejs");
}
module.exports.addRegister=async (req,res)=>
{
   try{
    const {email,username,password}=req.body;
    const u=new User({email,username});
    const output=await User.register(u,password);
    req.login(output,function(err)
    {
        if(err)
        {
            return next(err);
        }
        req.flash("success","Welcome to Yelp-Camp");
        res.redirect("/campground");
    })
   
   }
   catch(e)
   {
    req.flash("error",e.message);
    res.redirect("/register");
   }
}
module.exports.renderLogin=(req,res)=>
{
    res.render("user/login.ejs");
}
module.exports.newLogin=(req,res)=>
{
    const page=res.locals.returnTo||"/campground";
    req.flash("success","welcome back");
    res.redirect(page);
}
module.exports.logOut=(req,res,next)=>
{
    req.logOut(function(err)
    {
        if(err)
        {
            return next(err)
        }
        req.flash("success","Goodbye!");
        res.redirect("/campground");
    });

}