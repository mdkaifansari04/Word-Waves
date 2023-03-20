const mongoose = require('mongoose')


// USER SCHEMA
const utilitiesSchema = new mongoose.Schema({
    
    brandFirstName : {
        type : String,
        require : true,
    },

    brandSecondName : {
        type : String,
        require : true,
    },

    crouselContent1 : {
        type : String,
        require : true,
    },

    crouselContent2 : {
        type : String,
        require : true,
    },

    crouselContent3 : {
        type : String,
        require : true,
    },

    adminProfile : {
        type : String,
        require : true,
    },

    instaLink : String,
    youtubeLink : String,
    gitLink : String,
    linkedInLink : String

})

// Admin MODEL
const Utility = mongoose.model('Utility', utilitiesSchema)

module.exports = Utility;



// {
//     "_id": {
//       "$oid": "6416fc25a00b4487be30a290"
//     },
    // "brandFirstName":"Word"
    // "brandSecondName": "Waves" ,
    // "crouselContent1": "Welcome to Word Waves" ,
    // "crouselContent2": "Create Posts" ,
    // "crouselContent3": "Enjoy your Journey" ,
    // "adminProfile": "https://res.cloudinary.com/dngfmzv2g/image/upload/v1679228497/samples/BlogPost/Profile_cffggu.jpg",
    // "instaLink" : "https://www.instagram.com/thekaifansari/",
    // "youtubeLink" : "https://www.youtube.com/@codeway8693",
    // "gitLink"  : "https://github.com/Mdkaif-123" ,
    // "linkedInLink" : "https://www.linkedin.com/in/md-kaif-ansari-b74543243/" , 
    
//   }