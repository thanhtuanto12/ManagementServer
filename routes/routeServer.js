const router = require("express").Router();
const accAuth = require("../middleware/accountAuth");
var bodyParser = require("body-parser");
var AccountController = require("../controller/AccountController");
var urlencodedParser = bodyParser.urlencoded({ extended: false });
var passport = require("passport");
var localStrategy = require("passport-local").Strategy;
let multer = require("multer");
var proType = require("./routeProductType");
var routeAccount = require("./routeAccount");
var routeProduct = require("./routeProduct");
var routeCustomer = require("./routeCustomer");
var routeDeletedType = require("./routeDeletedType");
var FormData = require("form-data");
var fs = require("fs");

//Navigation
router.get("", function (req, res, next) {
  req.session.isLogin = false;
  return res.render("login/login", { mgs: "" });
});

router.get("/home", function (req, res) {
  if (req.session.isLogin) {
    return res.render("pages/index");
  } else {
    return res.render("login/login");
  }
});

router.route("/login").post(AccountController.login);

//Product Type
router.use("/productType", proType);
//Account
router.use("/account", routeAccount);
//Product
router.use("/product", routeProduct);
//Customer
router.use("/customer", routeCustomer);

router.use("/deletedType", routeDeletedType);

module.exports = router;
