const routeDeletedPromotions = require("express").Router();
const accAuth = require("../middleware/accountAuth");
var bodyParser = require("body-parser");
var path = require("path");
var AccountController = require("../controller/AccountController");
var Promotinonsontroller = require("../controller/promotionsController");
var urlencodedParser = bodyParser.urlencoded({ extended: false });
var passport = require("passport");
const formidable = require("formidable");
var localStrategy = require("passport-local").Strategy;
let multer = require("multer");

//Navigation

routeDeletedPromotions.get("/", Promotinonsontroller.getListDeletedPromotions);

routeDeletedPromotions
  .route("/restorePromotions")
  .post(Promotinonsontroller.restorePromotion);

module.exports = routeDeletedPromotions;
