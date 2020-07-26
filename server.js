// load the things we need
const express = require("express");
const server = express();
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

server.use(formData.parse());
server.use("/css", express.static("public/css"));
server.use("/js", express.static("public/js"));
server.use("/img", express.static("public/img"));
server.use("/fonts", express.static("public/fonts"));
server.use("/data", express.static("public/data"));
server.use("/files", express.static("public/files"));
server.use("/font-awesome", express.static("public/font-awesome"));
server.use("/images", express.static("public/images"));
server.use("/imgFromServer", express.static("public/imgFromServer"));
server.use("/php", express.static("public/php"));
server.use("/skins", express.static("public/skins"));
server.use(cors());

// set the view engine to ejs
server.set("view engine", "ejs");

//Passport
server.use(
  expressSession({
    isLogin: false,
    resave: false,
    saveUninitialized: true,
    secret: "keyboard cat",
  })
);
server.use(express.json()); // for parsing application/json
// server.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded
server.use(bodyParser.urlencoded({ extended: true }));
server.use(flash());
server.use(passport.initialize());
server.use(passport.session());
server.use(cookieParser("secret"));
server.use(expressSession({ cookie: { maxAge: 60000 } }));

// routes(server)
server.use("/", routes);
server.use("/api", routesApi);
server.listen(8080);
console.log("server run in port 8080");

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
