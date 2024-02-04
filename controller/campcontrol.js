const Campground=require("../models/campground");
const {cloudinary}=require("../cloudinary")
const mbxGeoCoding = require('@mapbox/mapbox-sdk/services/geocoding');
const { query } = require("express");
const mboxToken=process.env.MAPBOX_TOKEN;
const geocoder=mbxGeoCoding({accessToken:mboxToken})
module.exports.renderNewForm=(req,res)=>
{
    res.render("campground/new.ejs")
}
module.exports.showCampground=async (req,res)=>
{
    const {id}=req.params;
    const camp=await Campground.findById(id).populate({
         path:"reviews",
    populate:
        {
            path:"author"
        }
    }).populate("author");
    if(!camp)
    {
        req.flash("error","Campground Not Found");
        return res.redirect("/campground");
    }
    res.render("campground/show.ejs",{camp})
}
module.exports.createNewForm=async (req,res,next)=>
{
   const geoData=await geocoder.forwardGeocode(
        {
            query:req.body.campground.location,
            limit:1
        }
    ).send()
   
        const camp=req.body.campground;
    const p1=new Campground(camp);
    p1.image=req.files.map(f=>
        {
            return {
                url:f.path,
                filename:f.filename
            }
        })
    p1.author=req.user._id;
    p1.geometry=geoData.body.features[0].geometry;
    await p1.save();
  console.log(p1);
    req.flash("success","New Camp Added Successfully");
    res.redirect(`/campground/${p1._id}`);
   
    
}
module.exports.renderEditForm=async (req,res)=>
{
    
    const {id}=req.params;
    const camp=await Campground.findById(id);
    
    res.render("./campground/edit.ejs",{camp});
}
module.exports.EditForm=async(req,res)=>
{
    const {id}=req.params;
    const camp=await Campground.findByIdAndUpdate(id,req.body.campground);

    const img=req.files.map(f=>
        {
            return{
                url:f.path,
                filename:f.filename
            }
        })
        
    camp.image.push(...img);
        await camp.save();
    if(req.body.deleteImages)
    {
        for(let filename of req.body.deleteImages)
        {
            await cloudinary.uploader.destroy(filename);
        }
   await camp.updateOne({$pull:{image:{filename:{$in:req.body.deleteImages}}}})
   
    }
    
    req.flash("success","campground sucessfully edited")
    res.redirect(`/campground/${camp._id}`)
}
module.exports.deleteForm=async (req,res)=>
{
    const {id}=req.params;
    const campground=await Campground.findById(id);
    for(let img of campground.image)
    {
        await cloudinary.uploader.destroy(img.filename);
    }
    await Campground.findByIdAndDelete(id);
    req.flash("success","campground sucessfully deleted");
    res.redirect("/campground");
}
module.exports.indexForm=async(req,res)=>
{

    const camp=await Campground.find({});
    res.render("campground/index.ejs",{camp})
}