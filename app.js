// load the things we need
const express = require("express");
const app = express();
const expressSession = require("express-session");
const bodyParser = require("body-parser");
const passport = require("passport");
const routes = require("./routes/routeServer");
const routesApi = require("./routes/routes");
const cors = require("cors");
const mongoose = require("mongoose");
const multer = require("multer");
const upload = multer({ dest: "public/img" });
const flash = require("connect-flash");
const cookieParser = require("cookie-parser");
const fs = require("fs");
const formData = require("express-form-data");

app.use(formData.parse());
app.use("/css", express.static("public/css"));
app.use("/js", express.static("public/js"));
app.use("/img", express.static("public/img"));
app.use("/fonts", express.static("public/fonts"));
app.use("/images", express.static("public/images"));
app.use("/data", express.static("public/data"));
app.use("/files", express.static("public/files"));
app.use("/fonts-awesome", express.static("public/fonts-awesome"));
app.use("/imgFromServer", express.static("public/imgFromServer"));
app.use("/php", express.static("public/php"));
app.use("/skins", express.static("public/skins"));
app.use(cors());

// set the view engine to ejs
app.set("view engine", "ejs");

//Passport
app.use(
  expressSession({
    isLogin: false,
    resave: false,
    saveUninitialized: true,
    secret: "keyboard cat",
  })
);
app.use(express.json()); // for parsing application/json
// app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use(cookieParser("secret"));
app.use(expressSession({ cookie: { maxAge: 60000 } }));

// routes(app)
app.use("/", routes);
app.use("/api", routesApi);
module.exports = app;

mongoose.connect(
  "mongodb://thanhtuanto12:Tuan2905@cluster0-shard-00-00.cipbb.gcp.mongodb.net:27017,cluster0-shard-00-01.cipbb.gcp.mongodb.net:27017,cluster0-shard-00-02.cipbb.gcp.mongodb.net:27017/Foodshopdb?replicaSet=atlas-oymy52-shard-0&ssl=true&authSource=admin",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  },
  (err) => {
    if (err) {
      console.log(err);
    } else {
      console.log("Connect database successfully!");
    }
  }
);
