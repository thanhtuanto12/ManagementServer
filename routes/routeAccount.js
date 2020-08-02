const routeAccount = require("express").Router();
const accAuth = require("../middleware/accountAuth");
var bodyParser = require("body-parser");
var path = require("path");
var AccountController = require("../controller/AccountController");
var ProductController = require("../controller/ProductController");
var urlencodedParser = bodyParser.urlencoded({ extended: false });
var passport = require("passport");
const formidable = require("formidable");
var localStrategy = require("passport-local").Strategy;
let multer = require("multer");

//Navigation
routeAccount.get("/", AccountController.getListAccount);

routeAccount.route("/addAccount").post(AccountController.addAccount);

routeAccount.route("/editAccount").post(AccountController.editAccount);

routeAccount.route("/deleteAccount").post(AccountController.deleteAccount);

module.exports = routeAccount;
