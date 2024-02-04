const mongoose=require("mongoose");
const Review=require("./review");
const User = require("./user");
const { number } = require("joi");
const Schema=mongoose.Schema;
const ImageSchema=new mongoose.Schema(
    {
        
            url:String,
            filename:String  
        
    }
)
ImageSchema.virtual("thumbnail").get(function()
{
    return this.url.replace("/upload","/upload/w_200");
})
const opts={toJSON:{virtuals:true}}
const scheme=new Schema({
    title:String,
    price:Number,
    description:String,
    geometry:
    {
        type:
        {
            type:String,
            enum:["Point"],
            required:true
        },
        coordinates:
        {
            type:[Number],
            required:true
        }
    },
    location:String,
    image:[ImageSchema],
    author:
    {
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    reviews:
    [
    {
        type:mongoose.Schema.Types.ObjectId,
        ref:"Review"
    }
]
},opts)
scheme.virtual("properties.popupText").get(function()
{
    return `<strong><a href="/campground/${this._id}">${this.title}</a></strong>`
})
scheme.post("findOneAndDelete",async(camp)=>
{
    if(camp)
    {
        await Review.deleteMany(
            {
                _id:{
                    $in:camp.reviews
                }
            }
        )
    }

})
module.exports=mongoose.model("Campground",scheme);