const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

// USER SCHEMA
const userSchema = new mongoose.Schema({
    
    username : {
        type : String,
        require : true,
    },

    password :{
        type : String,
        require : true,
    },

    phone_no : {
        type : Number,
        require : true,
    },

    email : {
        type : String,
        require : true,
        unique : true,
    }
});

userSchema.pre('save', function(next) {        
                                                                                                                                    
    if(this.password) {                                                                                                                                                        
        var salt = bcrypt.genSaltSync(10)                                                                                                                                     
        this.password  = bcrypt.hashSync(this.password, salt)                                                                                                                
    }                                                                                                                                                                          
    next()                                                                                                                                                                     
}) 


// USER MODEL
const User = mongoose.model('User', userSchema);


module.exports = User;
