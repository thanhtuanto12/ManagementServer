const routeOrder = require("express").Router();
const accAuth = require("../middleware/accountAuth");
var bodyParser = require("body-parser");
var path = require("path");
var OrderController = require("../controller/OrderController");
var urlencodedParser = bodyParser.urlencoded({ extended: false });
var passport = require("passport");
var localStrategy = require("passport-local").Strategy;
let multer = require("multer");
// Set The Storage Engine
routeOrder.get("/", OrderController.getListOrder1);
routeOrder.route("/getList").post(OrderController.getListOrder);
routeOrder.route("/changeStatus").post(OrderController.changeStatus);
routeOrder.route("/getDetails").post(OrderController.orderDetails);
routeOrder.route("/downloadOrder").post(OrderController.downloadOrder);
module.exports = routeOrder;
