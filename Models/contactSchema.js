const mongoose = require('mongoose')

// USER SCHEMA
const contactSchema = new mongoose.Schema({
    
    email : {
        type : String,
        require : true,
        unique : true,
    },

    name : {
        type: String,
    },

    title : {
        type : String,
    },

    message : {
        type : String,
    }
})

// Admin MODEL
const Contact = mongoose.model('Contact', contactSchema)

module.exports = Contact;