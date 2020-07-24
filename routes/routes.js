const router = require('express').Router()
const accAuth = require('../middleware/accountAuth')
const adminAuth = require('../middleware/adminAuth')
const accountApi = require('../api/accountApi')
const productTypeApi = require('../api/productTypeApi')
const productApi = require('../api/productApi')
const accountAuth = require('../middleware/accountAuth')

let multer = require('multer')
let upload = multer({ dest: 'uploads' })

//Account route
router.route('/register')
  .post(accountApi.register)
router.route('/updateUserData')
  .post(accountApi.updateUserData)
router.route('/getUserByName')
  .post(accountApi.getUserByName)
router.route('/getUserLogin')
  .post(accountApi.getUserByToken)
router.route('/changeAvatar')
  .post(accountApi.changeAvatar)

router.route('/login')
  .post(accountApi.login)
router.route('/logout')
  .post(accountApi.logout)

router.route('/pushNotificationToken')
  .post(accountApi.pushNotificationToken)
router.route('/getListNotification')
  .post(accountApi.getListNotification)
router.route('/getNumOfNotification')
  .post(accountApi.getNumOfNotification)
router.route('/clearNotification')
  .post(accountApi.clearNotification)


//Product Type
router.route('/ProductType/AddProductType')
  .post(adminAuth, productTypeApi.addProductType)
router.route('/ProductType/GetAll')
  .post(productTypeApi.getAllProductType)
router.route('/ProductType/GetByName')
  .post(productTypeApi.getProductTypeByName)
router.route('/ProductType/GetByID')
  .post(productTypeApi.getProductTypeById)

//Product
router.route('/Product/GetAll')
  .post(productApi.getAllProduct)
router.route('/Product/GetByProType')
  .post(productApi.getProductByProType)
router.route('/Product/GetByName')
  .post(productApi.getProductByName)
router.route('/Product/GetByID')
  .post(productApi.getProductById)

module.exports = router;