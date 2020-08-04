const routeCustomer = require("express").Router();
const accAuth = require("../middleware/accountAuth");
var bodyParser = require("body-parser");
var path = require("path");
var CustomerController = require("../controller/CustomerController");
var ProductController = require("../controller/ProductController");
var urlencodedParser = bodyParser.urlencoded({ extended: false });
var passport = require("passport");
const formidable = require("formidable");
var localStrategy = require("passport-local").Strategy;
let multer = require("multer");

//Navigation
routeCustomer.get("/", CustomerController.getListCustomer);

routeCustomer.route("/addCustomer").post(CustomerController.addCustomer);

routeCustomer.route("/editCustomer").post(CustomerController.editCustomer);

routeCustomer.route("/deleteCustomer").post(CustomerController.deleteCustomer);

module.exports = routeCustomer;
