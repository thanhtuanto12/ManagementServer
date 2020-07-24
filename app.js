// load the things we need
const express = require('express');
const app = express();
const expressSession = require('express-session');
const bodyParser = require('body-parser');
const passport = require('passport');
const routes = require('./routes/routeServer')
const routesApi = require('./routes/routes')
const cors = require('cors')
const mongoose = require('mongoose')
const multer = require('multer')
const upload = multer({ dest: 'public/img' })
const flash = require('connect-flash');
const cookieParser = require('cookie-parser');
const fs = require('fs');
const formData = require('express-form-data');

app.use(formData.parse());
app.use('/css', express.static('public/css'));
app.use('/js', express.static('public/js'));
app.use('/img', express.static('public/img'));
app.use('/fonts', express.static('public/fonts'));
app.use(cors())

// set the view engine to ejs
app.set('view engine', 'ejs');

//Passport
app.use(expressSession({
    isLogin: false,
    resave: false,
    saveUninitialized: true,
    secret: 'keyboard cat',
}))
app.use(express.json()) // for parsing application/json
// app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use(cookieParser('secret'));
app.use(expressSession({ cookie: { maxAge: 60000 } }));

// routes(app)
app.use('/', routes)
app.use('/api', routesApi)
module.exports = app;

mongoose.connect('mongodb+srv://TungTrana3:Mobile%4012345@cluster0.ti2bm.mongodb.net/AhihiShopDB?authSource=admin&replicaSet=atlas-djj53t-shard-0&readPreference=primary&appname=MongoDB%20Compass&ssl=true',
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false
    },
    (err) => {
        if (err) {
            console.log(err)
        } else {
            console.log('Connect database successfully!')
        }
    })