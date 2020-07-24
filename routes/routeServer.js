const router = require('express').Router()
const accAuth = require('../middleware/accountAuth')
var bodyParser = require('body-parser');
var AccountController = require('../controller/AccountController');
var urlencodedParser = bodyParser.urlencoded({ extended: false });
var passport = require('passport');
var localStrategy = require('passport-local').Strategy;
let multer = require('multer')
var proType = require('./routeProductType');
var routeAccount = require('./routeAccount');
var routeProduct = require('./routeProduct');
var FormData = require('form-data');
var fs = require('fs');

//Navigation
router.get('', function (req, res, next) {
  req.session.isLogin = false
  return res.render('login/login', { mgs: "" });
});

router.get('/home', function (req, res) {
  if (req.session.isLogin) {
    return res.render('pages/index');
  }
  else {
    return res.render('login/login');
  }
});
router.route('/login')
  .post(AccountController.login)
//Product
router.use('/productType', proType);
router.use('/account', routeAccount);
router.use('/product', routeProduct);

module.exports = router;