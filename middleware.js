const Campground=require("./models/campground");
const Review=require("./models/review")
const {scheme,reviewScheme}=require("./scheme");
const Apperror=require("./utils/Apperror.js");
module.exports.isLogged=(req,res,next)=>
{
    if(!req.isAuthenticated())
    {
        req.session.returnTo=req.originalUrl;

        req.flash("error","Must br Logged In Or Sign Up");
        
        return res.redirect("/login");
    }
    else{
        next();
    }

}
module.exports.storeReturnTo=(req,res,next)=>
{
    if(req.session.returnTo)
    {
    res.locals.returnTo=req.session.returnTo;
    delete req.session.returnTo;
    }
    next();
}
module.exports.isAuthor=async(req,res,next)=>
{
    const {id}=req.params;
    const ground=await Campground.findById(id);
    if(!ground)
    {
        req.flash("error","Campground Not Found");
       return res.redirect("/campground");
    }
    else if(!ground.author.equals(req.user._id))
    {
        req.flash("error","You Don't have the permission for that request");
        return res.redirect(`/campground/${ground._id}`)
    }
    next();
}
module.exports.validateCamp=(req,res,next)=>
{
   
    const {error}=scheme.validate(req.body);
    if(error)
    {
        const op = error.details.map(el => el.message).join(",");
        throw new Apperror(op,400)
    }
    else{
        next();
    }
}
// module.exports.validateCamp = (req, res, next) => {
//     const { error } = scheme.validate(req.body);
   
//     if (error) {
//         const msg = error.details.map(el => el.message).join(',')
//         throw new Apperror(msg, 400)
//     } else {
//         next();
//     }
// }

module.exports.validatereview=(req,res,next)=>
{
    const{error}=reviewScheme.validate(req.body);
    if(error)
    {
        const msg = error.details.map(el => el.message).join(",");
            throw new Apperror(msg,400)
    }
    else{
        next();
    }
}
module.exports.isReviewer=async(req,res,next)=>
{
    const {id,reviewId}=req.params;
    const review=await Review.findById(reviewId);
    if(!review)
    {
        req.flash("error","Review Not Found");
       return res.redirect(`/campground/${id}`);
    }
    else if(!review.author.equals(req.user._id))
    {
        req.flash("error","You Don't have the permission for that request");
        return res.redirect(`/campground/${id}`)
    }
    next();
}