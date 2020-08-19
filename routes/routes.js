const router = require("express").Router();
const accAuth = require("../middleware/accountAuth");
const adminAuth = require("../middleware/adminAuth");
const accountApi = require("../api/accountApi");
const customerApi = require("../api/customerApi");
const productTypeApi = require("../api/productTypeApi");
const productApi = require("../api/productApi");
const accountAuth = require("../middleware/accountAuth");
const cartApi = require("../api/cartApi");
const orderApi = require("../api/orderApi");
const promotionApi = require("../api/promotionApi");
var bcrypt = require("bcrypt");

let multer = require("multer");
let upload = multer({ dest: "uploads" });

//Customers route
router.route("/register").post(customerApi.register);
router.route("/updateUserData").post(customerApi.updateUserData);
// router.route("/getUserByName").post(customerApi.getUserByName);
router.route("/getUserLogin").get(customerApi.getUserByToken);
// router.route("/changeAvatar").post(customerApi.changeAvatar);

router.route("/login").post(customerApi.login);
router.route("/logout").post(customerApi.logout);

router.route("/pushNotificationToken").post(customerApi.pushNotificationToken);
router.route("/getListNotification").post(customerApi.getListNotification);
router.route("/getNumOfNotification").post(customerApi.getNumOfNotification);
router.route("/clearNotification").post(customerApi.clearNotification);

//Account route
// router.route("/register").post(accountApi.register);
// router.route("/updateUserData").post(accountApi.updateUserData);
// router.route("/getUserByName").post(accountApi.getUserByName);
// router.route("/getUserLogin").post(accountApi.getUserByToken);
// router.route("/changeAvatar").post(accountApi.changeAvatar);

// router.route("/login").post(accountApi.login);
// router.route("/logout").post(accountApi.logout);

// router.route("/pushNotificationToken").post(accountApi.pushNotificationToken);
// router.route("/getListNotification").post(accountApi.getListNotification);
// router.route("/getNumOfNotification").post(accountApi.getNumOfNotification);
// router.route("/clearNotification").post(accountApi.clearNotification);

//Product Type
router
  .route("/ProductType/AddProductType")
  .post(adminAuth, productTypeApi.addProductType);
// router.route("/ProductType/GetAll").post(productTypeApi.getAllProductType);
router.route("/ProductType/GetAll").get(productTypeApi.getAllProductType);
router
  .route("/ProductType/GetByName")
  .post(productTypeApi.getProductTypeByName);
router.route("/ProductType/GetByID").post(productTypeApi.getProductTypeById);

//Product
router.route("/Product/GetAll").post(productApi.getAllProduct);
router.route("/Product/GetByProType").post(productApi.getProductByProType);
router.route("/Product/GetByName").post(productApi.getProductByName);
router.route("/Product/GetByID").post(productApi.getProductById);
router.route("/Product/SeachProduct").post(productApi.searchProduct);
router.route("/Product/getTopProduct").get(productApi.getTopProduct);
//Cart
router.route("/Cart/GetCart").post(cartApi.findCartByUser);
router.route("/Cart/AddToCart").post(cartApi.addToCart);
router.route("/Cart/EditQuanTi").post(cartApi.changeQuanti2);
// router.route("/Cart/PlusOneToCart").post(cartApi.PlusOneToCart);
router.route("/Cart/RemoveFromCart").post(cartApi.removeFromCart);
//Order
router.route("/Order/NewOrder").post(orderApi.newOrder);
router.route("/Order/Ordered").post(orderApi.ChangeStatus);
router.route("/Order/ListOrder").post(orderApi.listOrder);
router.route("/Order/DowloadOrder").post(orderApi.downloadOrder);
router.route("/Order/OrderDetail").post(orderApi.orderDetails);
//promotions
router.route("/getAllPromotions").get(promotionApi.getAllPromotion);

module.exports = router;
