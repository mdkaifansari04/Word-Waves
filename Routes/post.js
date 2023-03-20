const express = require('express');
const mongoose = require('mongoose');
const Post = require('../Models/postSchema');
const User = require('../Models/userSchema');
const Utils = require('../Models/utilitiesSchema')
const bodyParser = require('body-parser');
const sessions = require('express-session')
const flash = require('connect-flash');
const ejs = require('ejs');
const cloudinary = require('cloudinary').v2;
const upload = require('express-fileupload');
const fileUpload = require('express-fileupload');

const app = express();


app.use(bodyParser.urlencoded({ extended: true }));

app.set('view engine', 'ejs')
cloudinary.config({
    cloud_name: 'dngfmzv2g',
    api_key: '856543985699471',
    api_secret: 'SkYkiTXYOLxptbXJxpYwC8Ss4cE',
    secure: true
});


//?Route for rendering the Create Post page
app.get('/createPost', async(req, res) => {

    let message = req.flash('message')
    const utilities = await Utils.findOne({})

    res.render('user/createPost.ejs', {
        loginProp: 'hidden',
        profileProp: '',
        message: message,
        userAvatar : req.session.email,
        utilities : utilities,
    })
})


//? ROUTE FOR CREATING A POST
app.post('/createpost', async (req, res) => {
    try {

        let foundUser = await User.findOne({ email: req.session.email })
        if (foundUser) {
            const file = req.files.photo;
            cloudinary.uploader.upload(file.tempFilePath, (err, result) => {

                if (result) {
                    let newPost = new Post({
                        userId: foundUser._id,
                        title: req.body.title,
                        desc: req.body.desc,
                        img: result.url,
                        author: foundUser.username
                    })
                    newPost.save().then(() => {
                        req.flash('message', "Post Created")
                        res.redirect('/post/createpost')
                    })
                } else {
                    res.send(err)
                }
            })
        } else {
            res.send('Something went wrong, Please try after sometime !');
        }
    } catch (error) {
        res.send('server error:' + error)
    }
})


//? ROUTE FOR DELETING A POST

app.delete('/deletepost/:id', async(req,res) =>{

    try {
        await Post.findOneAndDelete({_id : req.params.id}).then(() =>{
            req.flash("message", "Post Deleted Successfully")
            res.redirect("/user")
        })

    } catch (error) {
        res.send("Something went wrong : " +error)
    }
})

//?Route for Individual post

app.get("/:id", async(req,res) =>{
    
    try {
        const utilities = await Utils.findOne({})
        let requestPost = await Post.findById(req.params.id)
        
        if (requestPost) {
            
            if (req.session.email) {
    
                const loginProp = 'hidden';
                let message = req.flash('message')
        
                res.render('user/card', {
                    loginProp: loginProp,
                    profileProp: '',
                    userAvatar : req.session.email,
                    post : requestPost,
                    utilities : utilities,
                })
        
            } else {
        
                const profileProp = 'hidden'
                let message = req.flash('message')
                res.render('user/card', {
                    loginProp: '',
                    profileProp: profileProp,
                    post : requestPost,
                    userAvatar : ''
                })
            }
    
        } else {
            res.send("Error : No such post")
        }
    } catch (error) {
        res.send('server error' + error)
    }
})





module.exports = app;