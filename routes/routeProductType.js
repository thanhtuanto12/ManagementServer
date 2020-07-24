const proType = require('express').Router()
const accAuth = require('../middleware/accountAuth')
var bodyParser = require('body-parser');
var path = require('path');
var AccountController = require('../controller/AccountController');
var ProductController = require('../controller/ProductController');
var urlencodedParser = bodyParser.urlencoded({ extended: false });
var passport = require('passport');
const formidable = require('formidable');
var localStrategy = require('passport-local').Strategy;
let multer = require('multer')

//Navigation
proType.get('/', ProductController.getListProductType)

proType.route('/addType')
  .post(ProductController.addProductType1)

proType.route('/editType')
  .post(ProductController.editProductType)

proType.route('/deleteType')
  .post(ProductController.deleteProductType)

module.exports = proType;