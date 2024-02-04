const mongoose=require("mongoose");
const passportlocalmongoose=require("passport-local-mongoose");
const scheme=new mongoose.Schema(
    {
    email:{
        type:String,
        required:true,
        unique:true
    }
    }
)
scheme.plugin(passportlocalmongoose);
module.exports=mongoose.model("User",scheme);
