const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

// USER SCHEMA
const adminSchema = new mongoose.Schema({
    
    email : {
        type : String,
        require : true,
        unique : true,
    },

    password :{
        type : String,
        require : true,
    },

    phone_no : {
        type : Number,
        require : true,
    }

})

adminSchema.pre('save', function(next) {        
                                                                                                                                    
    if(this.password) {                                                                                                                                                        
        var salt = bcrypt.genSaltSync(10)                                                                                                                                     
        this.password  = bcrypt.hashSync(this.password, salt)                                                                                                                
    }                                                                                                                                                                          
    next()                                                                                                                                                                     
}) 


// Admin MODEL
const Admin = mongoose.model('Admin', adminSchema)

module.exports = Admin;
