const cloudinary = require('cloudinary').v2;

cloudinary.config({
    cloud_name: "alumimage" ,
    api_key: "496819453467494" ,
    api_secret: "nFRR3ZC5SdBKIWmm4snS3OLh234"
})

module.exports = cloudinary