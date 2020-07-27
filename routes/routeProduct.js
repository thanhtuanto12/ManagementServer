// const routeProduct = require("express").Router();
// const accAuth = require("../middleware/accountAuth");
// var bodyParser = require("body-parser");
// var path = require("path");
// var AccountController = require("../controller/AccountController");
// var ProductController = require("../controller/ProductsController");
// var urlencodedParser = bodyParser.urlencoded({ extended: false });
// var passport = require("passport");
// var localStrategy = require("passport-local").Strategy;
// let multer = require("multer");
// // Set The Storage Engine
// const storage = multer.diskStorage({
//   destination: "./public/imgFromServer/product",
//   filename: function (req, file, cb) {
//     cb(
//       null,
//       file.fieldname + "-" + Date.now() + path.extname(file.originalname)
//     );
//   },
// });

// // Init Upload
// const upload = multer({
//   storage: storage,
//   limits: { fileSize: 1000000 },
//   fileFilter: function (req, file, cb) {
//     checkFileType(file, cb);
//   },
// });

// // Check File Type
// function checkFileType(file, cb) {
//   // Allowed ext
//   const filetypes = /jpeg|jpg|png|gif/;
//   // Check ext
//   const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
//   // Check mime
//   const mimetype = filetypes.test(file.mimetype);

//   if (mimetype && extname) {
//     return cb(null, true);
//   } else {
//     cb("Error: Images Only!");
//   }
// }

// //Navigation
// // routeProduct.get('/', function (req, res) {
// //   res.render('login/login');
// // });
// routeProduct.get("/", ProductController.getListProduct);

// // routeProduct
// //   .route("/addProduct")
// //   .post(upload.single("inputImg"))
// //   .post(ProductController.addProduct);
// routeProduct.route("/addProduct").post(ProductController.addProduct);
// // routeProduct.route("/editType").post(ProductController.editProduct);

// // routeProduct.route("/deleteType").post(ProductController.deleteProduct);

// module.exports = routeProduct;
