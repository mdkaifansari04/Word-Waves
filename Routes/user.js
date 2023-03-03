const express = require('express');
const mongoose = require('mongoose');
const User = require('../Models/userSchema');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const sessions = require('express-session')
const userSession = require('../Middlewares/userSession-middleware')
const flash = require('connect-flash');
const ejs = require('ejs');
const Post = require('../Models/postSchema');
const threeMonths = 1000 * 60 * 60 * 24 * 3;
const app = express();

app.use(bodyParser.urlencoded({ extended: true }))
app.use(flash());

app.set('view engine', 'ejs')

//? When user will hit profile button
app.get('/', async (req, res) => {

    try {

        let foundUser = await User.findOne({ email: req.session.email })

        if (foundUser) {
            let message = req.flash('message')
            let foundPost = await Post.find({ userId: foundUser._id })

            if (foundPost.length <= 0) {
                res.render('user/profile.ejs', {
                    loginProp: 'hidden',
                    profileProp: '',
                    userAvatar : req.session.email,
                    userName: foundUser.username,
                    posts: undefined,
                    message: message
                })
            } else {
                res.render('user/profile.ejs', {
                    loginProp: 'hidden',
                    profileProp: '',
                    userAvatar : req.session.email,
                    userName: foundUser.username,
                    posts: foundPost,
                    message: message
                })
            }

        } else {
            res.send("Error : Please login")
        }



    } catch (error) {
        res.send('server error:' + error)
    }
})

//? GET USER BY ID
app.get('/:id', async(req,res) =>{
    try {
        const foundUser = await User.findById(req.params.id)
        const foundPost = await Post.find({userId : foundUser._id})

        if(req.session.email) {
            if (foundPost.length < 0) {
                res.render('user/userProfile', {
                    loginProp : 'hidden',
                    profileProp : '',
                    userAvatar : req.session.email,
                    userName : foundUser.username,
                    posts : undefined,
                    
                })
            } else {
                res.render('user/userProfile', {
                    loginProp : 'hidden',
                    profileProp : '',
                    userAvatar : req.session.email,
                    userName : foundUser.username,
                    posts : foundPost
                })
            }
        } else{
            if (foundPost.length <= 0) {
                res.render('user/userProfile', {
                    loginProp : '',
                    profileProp : 'hidden',
                    userAvatar : '',
                    userName : foundUser.username,
                    posts : undefined
                })
            } else {
                res.render('user/userProfile', {
                    loginProp : '',
                    profileProp : 'hidden',
                    userAvatar : '',
                    userName : foundUser.username,
                    posts : foundPost
                })
            }
        }

    } catch (err) {
        res.send("Error" + err)
    }

})


//? when user will hit the signup button
app.post('/register', async (req, res) => {

    try {
        const newUser = new User({

            username: req.body.username,
            password: req.body.password,
            phone_no: req.body.phone_no,
            email: req.body.email
        })

        await newUser.save().then(function () {
            userSession(req, res, () => {
                console.log('Middleware call');
            })
            req.flash('message', 'Registred your account')
            res.redirect(`/`)
        })
            .catch((error) => {
                req.flash('alertMessage', 'User already exist !')
                res.redirect('/signup')
            })

    } catch (error) {
        res.send("err : " + error)
    }
})


//? When user will hit login button
app.post('/login', async (req, res) => {

    try {

        let userEmail = req.body.email;
        let pass = req.body.password;

        const user = await User.findOne({ email: userEmail })
        if (user) {

            let result = await bcrypt.compare(req.body.password, user.password);

            if (result) {
                userSession(req, res, () => {
                    console.log('Middleware call');
                });

                req.flash('message', 'Login Successful')
                res.redirect('/')
            } else {
                req.flash('alertMessage', 'Wrong Password')
                res.redirect('/login')
            }

        } else {
            req.flash('alertMessage', 'Wrong Credentials')
            res.redirect('/login')
        }

    } catch (error) {

        res.send("login err" + error)
    }
})







module.exports = app;





