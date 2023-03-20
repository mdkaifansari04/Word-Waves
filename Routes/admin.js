const express = require('express')
const Post = require('../Models/postSchema')
const User = require('../Models/userSchema')
const Admin = require('../Models/adminSchema')
const Contact = require('../Models/contactSchema')
const Utility = require('../Models/utilitiesSchema')
const bodyParser = require('body-parser')
const flash = require('connect-flash')
const bcrypt = require("bcrypt")
const methodOverride = require('method-override')
const { route } = require('./user')
const adminSession = require('../Middlewares/adminSession-middleware')
const app = express()

const router = express.Router()

app.use(bodyParser.urlencoded({ extended: true }))
app.use(flash())

// ? GET LOGIN PAGE 
router.get('/login', (req, res) => {

    let alert = req.flash("alert")
    res.render('admin/adminLogin', {
        alertMessage : alert,
    })

})

// ? GET SIGNUP PAGE 
router.get('/signup', async(req, res) => {

    let foundAdmin = await Admin.findOne({})

    if (foundAdmin) {
        res.send("Admin already registered")
    } else {
        let alert = req.flash('alert')

        res.render('admin/adminSignUp', {
            alertMessage : alert
        })
    }

})


// ? GET DASHBOARD 
router.get('/dashboard', async (req, res) => {

    try {
        let foundPost = await Post.find({})
        let foundUser = await User.find({})
        let foundContact = await Contact.find({})
        let foundUtilities = await Utility.findOne({})
        let message = req.flash("message")
        let alert = req.flash("alert")

        if (req.session.admin) {
            res.render('dashboard', {
                posts: foundPost,
                users: foundUser,
                contact: foundContact,
                utilities: foundUtilities,
                message: message
            })

        }else{
            res.redirect('/admin/login')
        }

    } catch (error) {
        console.log("Server Error : " + error);
    }
})

// ? UPDATE UTILITY 
router.put('/utility/update/:id', async (req, res) => {
    try {

        let updates = req.body
        let foundUtilities = await Utility.findOne({})

        await Utility.findOneAndUpdate({}, {

            $set: updates

        }, { new: true }).then((result) => {

            req.flash("message", "Updated")
            res.redirect('/admin/dashboard')
        })
            .catch(err => console.log("Updating err" + err))

    } catch (error) {
        console.log("Server err" + error);
    }
})

// ? DELETE POST 
router.delete('/post/deletepost/:id', async (req, res) => {

    try {
        await Post.findOneAndDelete({ _id: req.params.id }).then(() => {
            req.flash("message", "Post Deleted Successfully")
            res.redirect("/admin/dashboard")
        })

    } catch (error) {
        res.send("Something went wrong : " + error)
    }
})


// ? DELETE POST 
router.delete('/user/deleteuser/:id', async (req, res) => {

    try {
        await User.findOneAndDelete({ _id: req.params.id }).then(() => {
            req.flash("message", "User Deleted Successfully")
            res.redirect("/admin/dashboard#user")
        })
    } catch (error) {
        res.send("Something went wrong : " + error)
    }
})


// ? SINGUP ADMIN 

router.post('/signup', async (req, res) => {
    try {

        let foundAdmin = await Admin.findOne({})
        console.log(foundAdmin);

        if (foundAdmin) {
            res.send("Admin already created")
        } else {
            bcrypt.hash(req.body.password, 10, function (err, hash) {

                let newAdmin = new Admin({
                    email: req.body.email,
                    phone_no: req.body.phoneNo,
                    password: hash
                })

                newAdmin.save()
                    .then(() => {
                        adminSession(req, res, () => {
                            console.log("Middleware called");
                        })
                        req.flash("messsage", "Created Admin")
                        res.redirect('/admin/dashboard')
                    })

                    .catch((err) => {
                        req.flash("alert", "Email already exist")
                        res.redirect('/admin/signup')
                    }
                    )
            });
        }
    } catch (error) {
        res.send("Server error : " + error)
    }
})


// ? LOGIN ADMIN 
router.post('/login', async (req, res) => {

    try {

        let userEmail = req.body.email;
        let pass = req.body.password;

        const admin = await Admin.findOne({ email: userEmail })
        console.log(admin)

        if (admin) {

            let result = bcrypt.compare(pass, admin.password)
            console.log(result)

            if (result) {
                adminSession(req, res, () => {
                    console.log('Middleware call');
                });

                req.flash('message', 'Login Successful')
                res.redirect('/admin/dashboard')
            } else {
                req.flash('alert', 'Wrong Password')
                res.redirect('/admin/login')
            }

        } else {
            req.flash('alert', 'Wrong Credentials')
            res.redirect('/admin/login')
        }

    } catch (error) {

        res.send("login err" + error)
    }
})


// ?LOGOUT REQUEST 

router.get('/logout', (req,res) =>{
    req.session.destroy();
    res.redirect('/admin/login')
})

module.exports = router