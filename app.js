const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const path = require('path')
const ejs = require('ejs')
const sessions = require('express-session')
const flash = require('connect-flash')
const fileupload = require('express-fileupload')
const methodOverride = require('method-override')
const oneMonth = 1000 *60 *60 *60 *24 *30;
//? Local Dependency
const User = require('./Routes/user')
const Post = require('./Routes/post')
const PostData = require('./Models/postSchema')
const UserData = require('./Models/userSchema')
const Utils = require('./Models/utilitiesSchema') 
const userSession = require('./Middlewares/userSession-middleware') // !user session middleware route
const Admin = require('./Routes/admin')
const PORT = 3000
const app = express();


app.use(bodyParser.urlencoded({ extended: true }))
app.use('/static', express.static(path.join(__dirname, '/Public')))
app.use(flash())
app.use(methodOverride('_method'))

app.use(sessions({
    name: `userSession`,
    secret: 'some-secret-example',
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: oneMonth // 100 min
    }
}));
    
app.use(fileupload({
    useTempFiles : true,
}))

app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

mongoose.set("strictQuery", false)
// mongoose.connect('mongodb+srv://admin-kaif:Kaifkaif1234@cluster0.k8uohd0.mongodb.net/blogDB', {
//     useNewUrlParser: true,
// })
mongoose.connect('mongodb://127.0.0.1:27017/blogDB', {
    useNewUrlParser: true,
})


    .then(() => {
        console.log('Connected to blogDB');
    })
    .catch((err) => {
        console.log(`Connection error : ${err}`);
    })


//* USER API ROUTES
app.use('/user', User)

//* POST API ROUTES
app.use('/post', Post)

//* ADMIN API ROUTES
app.use('/admin', Admin)



//? ROUTES OF LANDING PAGE
app.get('/', async(req, res) => {

    const foundPost = await PostData.find({})
    const foundUser = await UserData.find({})
    const utilities = await Utils.findOne({})

    if (req.session.email) {

        const loginProp = 'hidden';
        let message = req.flash('message')

        res.render('index', {
            loginProp: loginProp,
            profileProp: '',
            message: message,
            posts : foundPost,
            users : foundUser,
            userAvatar : req.session.email,
            utilities : utilities,
        })

    } else {

        const profileProp = 'hidden'
        let message = req.flash('message')
        res.render('index', {
            loginProp: '',
            profileProp: profileProp,
            message: '',
            posts : foundPost,
            users : foundUser,
            userAvatar : '',
            utilities : utilities,
        })
    }
})

app.get('/login', async (req, res) => {

    const utilities = await Utils.findOne({})

    if (req.session.email) {
        const loginProp = 'hidden';
        res.render('login', {
            loginProp: loginProp,
            profileProp: '',
            alertMessage: '',
            userAvatar : req.session.email,
            utilities : utilities,
        })
    } else {
        let message = req.flash('alertMessage');
        const profileProp = 'hidden'
        res.render('login', {
            loginProp: '',
            profileProp: profileProp,
            alertMessage: message,
            userAvatar : '',
            utilities : utilities,
        })
    }
})

app.get('/signup', async(req, res) => {

    const utilities = await Utils.findOne({})

    if (req.session.email) {
        const loginProp = 'hidden';
        res.render('register', {
            loginProp: loginProp,
            profileProp: '',
            userAvatar : req.session.email,
            utilities : utilities,
        })
    } else {
        let message = req.flash('alertMessage');

        const profileProp = 'hidden'
        res.render('register', {
            loginProp: '',
            profileProp: profileProp,
            alertMessage: message,
            userAvatar : '',
            utilities : utilities,
        })
    }
})

app.get('/blogs', async(req, res) => {

    const allPosts = await PostData.find({})
    const utilities = await Utils.findOne({})

    if (req.session.email) {
        const loginProp = 'hidden';
        res.render('blog', {
            loginProp: loginProp,
            profileProp: '',
            posts : allPosts,
            userAvatar : req.session.email,
            utilities : utilities,
        })
    } else {
        let message = req.flash('alertMessage');

        const profileProp = 'hidden'
        res.render('blog', {
            loginProp: '',
            profileProp: profileProp,
            alertMessage: message,
            posts : allPosts,
            userAvatar : req.session.email,
            utilities : utilities,
        })
    }
})


app.get("/contact", async(req,res) =>{

    const utilities = await Utils.findOne({})
    const receivedMessage = req.flash("message")
    const alertMessage = req.flash("alertMessage")

    console.log(receivedMessage);

    if (req.session.email) {
        const loginProp = 'hidden';
        res.render('contact', {
            loginProp: loginProp,
            profileProp: '',
            userAvatar : req.session.email,
            utilities : utilities,
            message : receivedMessage,
            alertMessage : alertMessage
        })
    } else {
        let message = req.flash('alertMessage');
        const profileProp = 'hidden'
        res.render('contact', {
            loginProp: '',
            profileProp: profileProp,
            userAvatar : req.session.email,
            utilities : utilities,
            message : receivedMessage,
            alertMessage : alertMessage
        })
    }
})


app.get("/about", async(req,res) =>{

    const utilities = await Utils.findOne({})


    if (req.session.email) {
        const loginProp = 'hidden';
        res.render('about', {
            loginProp: loginProp,
            profileProp: '',
            userAvatar : req.session.email,
            utilities : utilities,
        })
    } else {
        let message = req.flash('alertMessage');
        const profileProp = 'hidden'
        res.render('about', {
            loginProp: '',
            profileProp: profileProp,
            userAvatar : req.session.email,
            utilities : utilities,
        })
    }
})


app.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/')
})

app.get('*', (req,res) =>{
    res.render('error')
})



app.listen('3000', () => {
    console.log(`Port is listening on http://localhost:${PORT}`);
})