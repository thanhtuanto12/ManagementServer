const routeDeletedAccount = require("express").Router();
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

routeDeletedAccount.get("/", AccountController.getListDeletedAccount);

routeDeletedAccount
  .route("/restoreAccount")
  .post(AccountController.restoreAccount);

module.exports = routeDeletedAccount;
