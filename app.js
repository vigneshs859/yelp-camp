if(process.env.NODE_ENV!=="production")
{
    require("dotenv").config()
}
// mongodb+srv://vigvv859:<password>@cluster0.7iqokfc.mongodb.net/?retryWrites=true&w=majority
const helmet=require("helmet");
// require("dotenv").config()
const express=require("express");
const app=express();
const mongoose=require("mongoose");
const ejsMate=require("ejs-mate");
const meth=require("method-override");
const Apperror=require("./utils/Apperror");
const session=require("express-session");
const path=require("path");
const camproute=require("./routes/camproute");
const reviewroute=require("./routes/reviewroute");
const userroute=require("./routes/userroute");
const flash=require("connect-flash");
const mongoSanitize = require('express-mongo-sanitize');
const passport = require("passport");
const localstratergy=require("passport-local");
const User=require("./models/user");
const MongoStore = require('connect-mongo')(session);
const db=mongoose.connection;
const dburl=process.env.DB_URL||"mongodb://127.0.0.1:27017/yelp-camp";
//'mongodb://127.0.0.1:27017/yelp-camp'
mongoose.connect(dburl)
.then((data)=>
{
    console.log("Connected to the database")
    
}
)
.catch((err)=>
{
console.log("Error" );
console.log(err);
})


app.set("view engine","ejs");
app.set("views",path.join(__dirname,"/views"))
app.use(express.urlencoded({extended:true}))
app.use(meth("_method"));
app.use(express.static(path.join(__dirname,"/public")));
app.engine("ejs",ejsMate);
const store=new MongoStore(
    {
        url:dburl||'mongodb://127.0.0.1:27017/yelp-camp',
        secret:process.env.SECRET||"MySecretKey",
        touchAfter:24*60*60
    }
)
store.on("error",function(e)
{
    console.log("Store Error",e)
})
app.use(session(
    {
        store,
        name:"session",
        secret:"MySecretKey",
        resave:true,
        saveUninitialized:true,
        cookie: {
            maxAge: Date.now() + (1000 * 60 * 60 * 24 * 7), // Corrected
            expires: new Date(Date.now() + (1000 * 60 * 60 * 24 * 7)), // Correct
            httpOnly: true
        }
        
    }
))
app.use(passport.initialize());
app.use(passport.session());
app.use(helmet());

const scriptSrcUrls = [
    "https://stackpath.bootstrapcdn.com/",
    "https://api.tiles.mapbox.com/",
    "https://api.mapbox.com/",
    "https://kit.fontawesome.com/",
    "https://cdnjs.cloudflare.com/",
    "https://cdn.jsdelivr.net",
];
//This is the array that needs added to
const styleSrcUrls = [
    "https://kit-free.fontawesome.com/",
    "https://api.mapbox.com/",
    "https://api.tiles.mapbox.com/",
    "https://fonts.googleapis.com/",
    "https://use.fontawesome.com/",
    "https://cdn.jsdelivr.net",
    'https://stackpath.bootstrapcdn.com/bootstrap/5.0.0-alpha1/css/bootstrap.min.css'
];
const connectSrcUrls = [
    "https://api.mapbox.com/",
    "https://a.tiles.mapbox.com/",
    "https://b.tiles.mapbox.com/",
    "https://events.mapbox.com/",
];
const fontSrcUrls = [];
app.use(
    helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: [],
            connectSrc: ["'self'", ...connectSrcUrls],
            scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
            styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
            workerSrc: ["'self'", "blob:"],
            objectSrc: [],
            imgSrc: [
                "'self'",
                "blob:",
                "data:",
                "https://res.cloudinary.com/djj4kggcx/", //SHOULD MATCH YOUR CLOUDINARY ACCOUNT! 
                "https://images.unsplash.com/",
                "https://miro.medium.com/v2/resize:fit:1080/1*jLYx2zVqsze0P7MqI0X_fA.png"
            ],
            fontSrc: ["'self'", ...fontSrcUrls],
        },
    })
);



passport.use(new localstratergy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use(flash());
app.use(mongoSanitize({replaceWith: '_',}),
);
app.listen(8000,()=>
{
    console.log("Listening on port 8000")
})
app.use((req,res,next)=>
{
    res.locals.user=req.user;
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error");
    next();
})
app.get("/",(req,res)=>
{   console.log(req.query);
    res.render("campground/home.ejs")
})

app.use("/campground",camproute);
app.use("/campground/:id",reviewroute);
app.use("/",userroute);
app.get("/fake",async(req,res)=>
{
    const u=new User({email:"vigv123@gmail.com",username:"vignesh"});
   const result=await User.register(u,"monkey");
   res.send(result);

})
app.all("*",(req,res,next)=>
{
    next(new Apperror("Page not found",404));
})
app.use((err,req,res,next)=>
{
    const {status=500}=err;
    if(!err.message)
    {
        err.message="Something went Wrong";
    }
    res.status(status).render("error.ejs",{err});
})


