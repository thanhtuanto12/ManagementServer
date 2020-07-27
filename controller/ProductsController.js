// var passport = require("passport");
// var Product = require("../models/ProductTypes");
// var jwt = require("jsonwebtoken");
// let request = require("request-promise");
// let base64 = require("base-64");
// let mongoose = require("mongoose");
// let handleAccountJwt = require("../handleAccountJwt");
// let fs = require("fs");
// const path = require("path");
// let api = require("../config");
// API_URL = api.API_URL;
// const formidable = require("formidable");

// function objectIsEmpty(object) {
//   if (Object.keys(object).length == 0) {
//     return true;
//   }
//   return false;
// }
// exports.getListProduct = async (req, res) => {
//   try {
//     let page = 0; //req.body.page
//     let limit = 10; //req.body.limit:
//     const listProduct = await Product.find({ delete_at: null })
//       .skip(page * limit)
//       .limit(limit);
//     const count = Product.find().length;
//     return res.render("product/Product", {
//       listProduct,
//       mgs: "",
//       countPage: count,
//     });
//   } catch (error) {
//     return res.send({ mgs: "Có lỗi xảy ra! Lấy danh sách thất bại" });
//   }
// };
// exports.addProduct = async (req, res) => {
//   let productName = req.body.productName;
//   let productType = req.body.productType;
//   let description = req.body.description;
//   let quan = req.body.quan;
//   let price = req.body.price;
//   let unit = req.body.unit;
//   let date = new Date();
//   let today = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
//   if (productName == null || productName == undefined || productName == "") {
//     return res.json({
//       success: false,
//       mgs: "Tên sản phẩm không được để trống",
//     });
//   }
//   try {
//     const check = await Product.findOne({
//       productName: productName,
//     });
//     if (check == null) {
//       let files = req.files;
//       if (!objectIsEmpty(files)) {
//         let file = req.files.imgType;
//         let imageName = file.fieldName + "-" + Date.now() + ".png";
//         let tmp_path = file.path;
//         let target_path =
//           __dirname.replace("controller", "") +
//           "public/imgFromServer/product/" +
//           imageName;
//         let src = fs.createReadStream(tmp_path);
//         let dest = fs.createWriteStream(target_path);
//         src.pipe(dest);
//         src.on("end", async () => {
//           try {
//             let productImg = "imgFromServer/product/" + imageName;
//             const newProductType = new ProductType({
//               _id: new mongoose.Types.ObjectId(),
//               productName: productName,
//               productImg: productImg,
//               quanti: quan,
//               description: description,
//               unit: unit,
//               created_at: today,
//               last_modified: today,
//             });
//             await newProduct.save().then(async () => {
//               return res.json({
//                 success: true,
//                 mgs: "Thêm sản phẩm thành công",
//               });
//             });
//           } catch (error) {
//             return res.json({
//               success: false,
//               mgs: "Có sự cố xảy ra. Không thể thêm loại sản phẩm!",
//             });
//           }
//         });
//         src.on("error", (err) => {
//           fs.unlink(tmp_path, (err) => {
//             console.log(err);
//           });
//           return res.json({
//             status: -1,
//             message: "Thất bại",
//           });
//         });
//       } else {
//         let productImg = "imgFromServer/product/default.png";
//         //create new ProductType
//         const newProduct = new newProduct({
//           _id: new mongoose.Types.ObjectId(),
//           productName: productName,
//           productImg: productImg,
//           quanti: quan,
//           description: description,
//           unit: unit,
//           created_at: today,
//           last_modified: today,
//         });
//         await newProduct.save().then(async () => {
//           return res.json({
//             success: true,
//             mgs: "Thêm sản phẩm thành công",
//           });
//         });
//       }
//     } else {
//       return res.json({
//         success: false,
//         mgs: "Tên sản phẩm đã tồn tại!",
//       });
//     }
//   } catch {
//     return res.json({
//       success: false,
//       mgs: "Có sự cố xảy ra. Không thể thêm sản phẩm!",
//     });
//   }
// };
