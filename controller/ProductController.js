var passport = require("passport");
var ProductType = require("../models/ProductTypes");
var jwt = require("jsonwebtoken");
let request = require("request-promise");
let base64 = require("base-64");
let mongoose = require("mongoose");
let handleAccountJwt = require("../handleAccountJwt");
let fs = require("fs");
const path = require("path");
let api = require("../config");
API_URL = api.API_URL;
const formidable = require("formidable");

function objectIsEmpty(object) {
  if (Object.keys(object).length == 0) {
    return true;
  }
  return false;
}
exports.getListProductType = async (req, res) => {
  try {
    let page = 0; //req.body.page
    let limit = 10; //req.body.limit:
    const listProductType = await ProductType.find({ delete_at: null })
      .skip(page * limit)
      .limit(limit);
    const count = ProductType.find().length;
    return res.render("product/ProductType", {
      listProductType,
      mgs: "",
      countPage: count,
    });
  } catch (error) {
    return res.send({ mgs: "Có lỗi xảy ra! Lấy danh sách thất bại" });
  }
};
exports.addProductType1 = async (req, res) => {
  let typeName = req.body.typeName;
  let description = req.body.description;
  let date = new Date();
  let today = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  if (typeName == null || typeName == undefined || typeName == "") {
    return res.json({ success: false, mgs: "Tên loại không được để trống" });
  }
  try {
    const check = await ProductType.findOne({
      typeName: typeName,
    });
    if (check == null) {
      let files = req.files;
      if (!objectIsEmpty(files)) {
        let file = req.files.imgType;
        let imageName = file.fieldName + "-" + Date.now() + ".png";
        let tmp_path = file.path;
        let target_path =
          __dirname.replace("controller", "") +
          "public/imgFromServer/proType/" +
          imageName;
        let src = fs.createReadStream(tmp_path);
        let dest = fs.createWriteStream(target_path);
        src.pipe(dest);
        src.on("end", async () => {
          try {
            let typeImg = "imgFromServer/proType/" + imageName;
            const newProductType = new ProductType({
              _id: new mongoose.Types.ObjectId(),
              typeName: typeName,
              typeImg: typeImg,
              description: description,
              created_at: today,
              last_modified: today,
            });
            await newProductType.save().then(async () => {
              return res.json({
                success: true,
                mgs: "Thêm loại sản phẩm thành công",
              });
            });
          } catch (error) {
            return res.json({
              success: false,
              mgs: "Có sự cố xảy ra. Không thể thêm loại sản phẩm!",
            });
          }
        });
        src.on("error", (err) => {
          fs.unlink(tmp_path, (err) => {
            console.log(err);
          });
          return res.json({
            status: -1,
            message: "Thất bại",
          });
        });
      } else {
        let typeImg = "imgFromServer/proType/default.png";
        //create new ProductType
        const newProductType = new ProductType({
          _id: new mongoose.Types.ObjectId(),
          typeName: typeName,
          typeImg: typeImg,
          description: description,
          created_at: today,
          last_modified: today,
        });
        await newProductType.save().then(async () => {
          return res.json({
            success: true,
            // mgs: "Thêm loại sản phẩm thành công",
          });
        });
      }
    } else {
      return res.json({
        success: false,
        mgs: "Tên loại sản phẩm đã tồn tại!",
      });
    }
  } catch {
    return res.json({
      success: false,
      mgs: "Có sự cố xảy ra. Không thể thêm loại sản phẩm!",
    });
  }
};
exports.editProductType = async (req, res) => {
  let typeId = req.body.typeId;
  let typeName = req.body.typeName;
  let description = req.body.description;
  let date = new Date();
  let today = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  if (typeName == null || typeName == undefined || typeName == "") {
    return res.json({ success: false, mgs: "Tên loại không được để trống" });
  }

  try {
    //Check ProductType Name exist

    const check = await ProductType.findOne({
      _id: typeId,
    });
    let currenImg = check.typeImg;
    let currenName = check.typeName;
    if (typeName !== currenName) {
      const checkName = await ProductType.find({
        typeName: typeName,
      });
      if (checkName.length != 0) {
        return res.json({
          success: false,
          mgs: "Tên loại sản phẩm đã tồn tại!",
        });
      }
    }

    //update ProductType
    let files = req.files;
    if (!objectIsEmpty(files)) {
      let file = req.files.imgType;
      let imageName = file.fieldName + "-" + Date.now() + ".png";
      let tmp_path = file.path;
      let target_path =
        __dirname.replace("controller", "") +
        "public/imgFromServer/proType/" +
        imageName;
      let src = fs.createReadStream(tmp_path);
      let dest = fs.createWriteStream(target_path);
      src.pipe(dest);
      src.on("end", async () => {
        try {
          let typeImg = "imgFromServer/proType/" + imageName;
          await ProductType.findOneAndUpdate(
            { _id: typeId },

            {
              typeName: typeName,
              typeImg: typeImg,
              description: description,
              last_modified: today,
            }
          ).then(async () => {
            console.log(file);
            if (typeImg != "imgFromServer/proType/default.png") {
              fs.unlink(
                __dirname.replace("controller", "") + "public/" + currenImg,
                (err) => {
                  console.log(err);
                }
              );
              return res.json({
                success: true,
                mgs: "Cập nhật loại sản phẩm thành công",
              });
            }
          });
        } catch (error) {
          return res.json({
            success: false,
            mgs: "Có sự cố xảy ra. Không thể thêm loại sản phẩm!",
          });
        }
      });
      src.on("error", (err) => {
        fs.unlink(tmp_path, (err) => {
          console.log(err);
        });
        return res.json({
          status: -1,
          message: "Thất bại",
        });
      });
    } else {
      //create new ProductType
      await ProductType.findOneAndUpdate(
        { _id: typeId },
        {
          typeName: typeName,
          description: description,
          last_modified: today,
        }
      ).then(async () => {
        return res.json({
          success: true,
          mgs: "Cập nhật loại sản phẩm thành công",
        });
      });
    }
  } catch {
    return res.json({
      success: false,
      mgs: "Có sự cố xảy ra. Không thể cập nhật loại sản phẩm!",
    });
  }
};
exports.deleteProductType = async (req, res) => {
  //Type infor
  try {
    let typeId = req.body.typeId;
    let date = new Date();
    let today = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
    await ProductType.findOneAndUpdate(
      { _id: typeId },
      {
        delete_at: today,
        last_modified: today,
      }
    );
    return res.json({
      success: true,
      mgs: "Xoá thành công",
    });
  } catch (error) {
    console.log(error);
    return res.json({
      success: false,
      mgs: "Có lỗi xảy ra! Xoá thất bại",
    });
  }
};
//product
// exports.getListProduct = async (req, res) => {
//   try {
//     let page = 0; //req.body.page
//     let limit = 10; //req.body.limit:
//     const listProduct = await ProductType.find({ delete_at: null })
//       .skip(page * limit)
//       .limit(limit);
//     const count = ProductType.find().length;
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
// exports.editProductType = async (req, res) => {
//   let typeId = req.body.typeId;
//   let typeName = req.body.typeName;
//   let description = req.body.description;
//   let date = new Date();
//   let today = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
//   if (typeName == null || typeName == undefined || typeName == "") {
//     return res.json({ success: false, mgs: "Tên loại không được để trống" });
//   }

//   try {
//     //Check ProductType Name exist

//     const check = await ProductType.findOne({
//       _id: typeId,
//     });
//     let currenImg = check.typeImg;
//     let currenName = check.typeName;
//     if (typeName !== currenName) {
//       const checkName = await ProductType.find({
//         typeName: typeName,
//       });
//       if (checkName.length != 0) {
//         return res.json({
//           success: false,
//           mgs: "Tên loại sản phẩm đã tồn tại!",
//         });
//       }
//     }

//     //update ProductType
//     let files = req.files;
//     if (!objectIsEmpty(files)) {
//       let file = req.files.imgType;
//       let imageName = file.fieldName + "-" + Date.now() + ".png";
//       let tmp_path = file.path;
//       let target_path =
//         __dirname.replace("controller", "") +
//         "public/imgFromServer/proType/" +
//         imageName;
//       let src = fs.createReadStream(tmp_path);
//       let dest = fs.createWriteStream(target_path);
//       src.pipe(dest);
//       src.on("end", async () => {
//         try {
//           let typeImg = "imgFromServer/proType/" + imageName;
//           await ProductType.findOneAndUpdate(
//             { _id: typeId },

//             {
//               typeName: typeName,
//               typeImg: typeImg,
//               description: description,
//               last_modified: today,
//             }
//           ).then(async () => {
//             console.log(file);
//             if (typeImg != "imgFromServer/proType/default.png") {
//               fs.unlink(
//                 __dirname.replace("controller", "") + "public/" + currenImg,
//                 (err) => {
//                   console.log(err);
//                 }
//               );
//               return res.json({
//                 success: true,
//                 mgs: "Cập nhật loại sản phẩm thành công",
//               });
//             }
//           });
//         } catch (error) {
//           return res.json({
//             success: false,
//             mgs: "Có sự cố xảy ra. Không thể thêm loại sản phẩm!",
//           });
//         }
//       });
//       src.on("error", (err) => {
//         fs.unlink(tmp_path, (err) => {
//           console.log(err);
//         });
//         return res.json({
//           status: -1,
//           message: "Thất bại",
//         });
//       });
//     } else {
//       //create new ProductType
//       await ProductType.findOneAndUpdate(
//         { _id: typeId },
//         {
//           typeName: typeName,
//           description: description,
//           last_modified: today,
//         }
//       ).then(async () => {
//         return res.json({
//           success: true,
//           mgs: "Cập nhật loại sản phẩm thành công",
//         });
//       });
//     }
//   } catch {
//     return res.json({
//       success: false,
//       mgs: "Có sự cố xảy ra. Không thể cập nhật loại sản phẩm!",
//     });
//   }
// };
// exports.deleteProductType = async (req, res) => {
//   //Type infor
//   try {
//     let typeId = req.body.typeId;
//     let date = new Date();
//     let today = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
//     await ProductType.findOneAndUpdate(
//       { _id: typeId },
//       {
//         delete_at: today,
//         last_modified: today,
//       }
//     );
//     return res.json({
//       success: true,
//       mgs: "Xoá thành công",
//     });
//   } catch (error) {
//     console.log(error);
//     return res.json({
//       success: false,
//       mgs: "Có lỗi xảy ra! Xoá thất bại",
//     });
//   }
// };
