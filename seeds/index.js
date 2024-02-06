if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}
const mongoose=require("mongoose");
const db=mongoose.connection;
const cities=require("./cities.js")
const {descriptors,places}=require("./seedHelpers")
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({accessToken: mapBoxToken});
const dbUrl = process.env.DB_URL ||'mongodb://127.0.0.1:27017/yelp-camp' ;
mongoose.connect(dbUrl)
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
const Campground=require("../models/campground");
const randy=function(array)
{
    return array[Math.floor(Math.random() * array.length)];
}
const seed=async()=>
{
    await Campground.deleteMany({});
    for(let i=0;i<300;i++)
    {
        const rand = Math.floor(Math.random() * cities.length) + 1;
        const title=`${randy(descriptors)} ${randy(places)}`;
        const  location=`${cities[rand].city},${cities[rand].state}`;
        const geoData=await geocoder.forwardGeocode(
            {
                query:location,
                limit:1
            }
        ).send()
        const c=new Campground({
            title:title,
            location:location,
           
            description:"Lorem ipsum dolor sit amet consectetur adipisicing elit. Sint facilis consectetur laudantium cupiditate sed illum, repellat, voluptatem debitis incidunt placeat culpa natus, nisi enim saepe est! Consequuntur sunt ipsum laborum.",
            price:Math.floor(Math.random()*20)+10,
            author:"65bf9a3971b5ac625dc7825f",
            image:[
                {
                    url:'https://res.cloudinary.com/djj4kggcx/image/upload/v1706886353/yelpcamp/hbdlw2t0cfaol6gq8cje.jpg',
                    filename: 'yelpcamp/hbdlw2t0cfaol6gq8cje'
                },{
                    url: 'https://res.cloudinary.com/djj4kggcx/image/upload/v1706886353/yelpcamp/om9jl8zysct379kgzhv4.jpg',
                    
                    filename: 'yelpcamp/om9jl8zysct379kgzhv4'
                }
            ],
            geometry:geoData.body.features[0].geometry
        })
        await c.save();
    }
}


seed().then(()=>
{
    db.close();
})