const routeProduct = require("express").Router();
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
routeProduct.get("/", ProductController.getListProduct);

routeProduct.route("/addProduct").post(ProductController.addProduct1);

routeProduct.route("/editProduct").post(ProductController.editProduct);

// routeProduct.route("/deleteType").post(ProductController.deleteProductType);

module.exports = routeProduct;
