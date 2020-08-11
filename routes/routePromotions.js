const routePromotions = require("express").Router();
const accAuth = require("../middleware/accountAuth");
var bodyParser = require("body-parser");
var path = require("path");
var AccountController = require("../controller/AccountController");
var ProductController = require("../controller/ProductController");
var PromotionController = require("../controller/promotionsController");
var urlencodedParser = bodyParser.urlencoded({ extended: false });
var passport = require("passport");
const formidable = require("formidable");
var localStrategy = require("passport-local").Strategy;
let multer = require("multer");

//Navigation

routePromotions.get("/", PromotionController.getListPromotions);

routePromotions.route("/addPromotions").post(PromotionController.addPromotions);

// proType.route("/editType").post(ProductController.editProductType);

// proType.route("/deleteType").post(ProductController.deleteProductType);

module.exports = routePromotions;
