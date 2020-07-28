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
    let limit = 1; //req.body.limit
    // const listProductType = await ProductType.find().skip(page*limit).limit(limit)
    console.log(__dirname);
    const listProductType = await ProductType.find();
    const listAll = ProductType.find();
    const countPage = (await listAll).length / limit;
    return res.render("product/ProductType", {
      listProductType,
      mgs: "",
      countPage: countPage,
    });
  } catch (error) {
    return res.send({ mgs: "Có lỗi xảy ra! Lấy danh sách thất bại" });
  }
};
exports.getListPageType = async (req, res) => {
  try {
    let page = req.body.page;
    let limit = 2; //req.body.limit
    const listProductType = await ProductType.find()
      .skip(page * limit)
      .limit(limit);
    const listAll = ProductType.find();
    const countPage = (await listAll).length / limit;
    return res.json({
      success: true,
      listProductType,
      mgs: "shihi ",
      countPage: countPage,
    });
  } catch (error) {
    return res.json({
      success: false,
      mgs: "Có lỗi xảy ra! Lấy danh sách thất bại",
    });
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
            mgs: "Thêm loại sản phẩm thành công",
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

exports.getListProduct = async (req, res) => {
  try {
    const listProductType = await ProductType.find();
    var listProduct = [];
    for (let ProType of listProductType) {
      if (ProType.product !== []) {
        for (let Product of ProType.product) {
          listProduct.push(Product);
        }
      }
    }
    return res.render("product/Product", {
      listProduct,
      listProductType,
      mgs: "",
    });
  } catch (error) {
    return res.send("Có lỗi xảy ra! Lấy danh sách sản phẩm thất bại");
  }
};
exports.addProduct1 = async (req, res) => {
  let productType = req.body.productType;
  let description = req.body.description;
  let productName = req.body.productName;
  let unit = req.body.unit;
  let quan = req.body.quan;
  let price = req.body.price;
  let date = new Date();
  let today = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  if (productName == null || productName == undefined || productName == "") {
    return res.json({
      success: false,
      mgs: "Tên sản phẩm không được để trống",
    });
  }
  try {
    const listProductType = await ProductType.find();
    for (let ProType of listProductType) {
      if (ProType.product !== "") {
        for (let Product of ProType.product) {
          if (Product.productName == productName) {
            return res.json({
              success: false,
              mgs: "Sản phẩm đã tồn tại",
            });
          }
        }
      }
    }

    let files = req.files;

    if (!objectIsEmpty(files)) {
      console.log("22222", quan);
      let file = files.imgProduct;
      let imageName = file.fieldName + "-" + Date.now() + ".png";
      let tmp_path = file.path;
      let target_path =
        __dirname.replace("controller", "") +
        "public/imgFromServer/product/" +
        imageName;

      let src = fs.createReadStream(tmp_path);
      let dest = fs.createWriteStream(target_path);
      src.pipe(dest);

      src.on("end", async () => {
        let productImg = "imgFromServer/product/" + imageName;
        const newProduct = {
          _id: new mongoose.Types.ObjectId(),
          productName: productName,
          unit: unit,
          quan: quan,
          price: price,
          productType: productType,
          productImg: productImg,
          description: description,
          created_at: today,
          last_modified: today,
        };
        const type = await ProductType.findOneAndUpdate(
          {
            typeName: productType,
          },
          {
            $push: { product: newProduct },
          }
        ).then(() => {
          return res.json({
            success: true,
            mgs: "Thêm loại sản phẩm thành công",
          });
        });
        // await newProduct.save().then(async () => {
        //   return res.json({
        //     success: true,
        //     // mgs: "Thêm loại sản phẩm thành công",
        //   });
        // });
        // }
        //   await newProduct.save().then(async () => {
        //     return res.json({
        //       success: true,
        //       mgs: "Thêm sản phẩm thành công",
        //     });
        //   });
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
      let productImg = "imgFromServer/product/default.png";
      console.log("11111111");
      //create new ProductType
      const newProduct = {
        _id: new mongoose.Types.ObjectId(),
        productName: productName,
        unit: unit,
        quan: quan,
        price: price,
        productType: productType,
        productImg: productImg,
        description: description,
        created_at: today,
        last_modified: today,
      };
      const type = await ProductType.findOneAndUpdate(
        {
          typeName: productType,
        },
        {
          $push: { product: newProduct },
        }
      ).then(() => {
        return res.json({
          success: true,
          mgs: "Thêm sản phẩm thành công",
        });
      });
    }
  } catch (er) {
    console.log(er);
    return res.json({
      success: false,
      mgs: "Có sự cố xảy ra. Không thể thêm loại sản phẩm!",
    });
  }
};
// exports.addProduct = async (req, res) => {
//   //Type infor
//   try {
//     let typeProduct = req.body.typeProduct;
//     let description = req.body.description;
//     let productName = req.body.productName;
//     let unit = req.body.unit;
//     let quan = req.body.quan;
//     let price = req.body.price;
//     let productImg = "imgFromServer/product/" + req.file.filename;
//     let date = new Date();
//     let today = new Date(date.getTime() - date.getTimezoneOffset() * 60000);

//     if (productName == null || productName == undefined || productName == "") {
//       return res.send("Tên sản phẩm không được để trống");
//     }
//     let proType = await ProductType.findOne({
//       typeName: typeProduct,
//     });
//     if (proType == null) {
//       return res.send("Không tìm thấy loại sản phẩm này");
//     }
//     //create new Products
//     const newProducts = {
//       _id: new mongoose.Types.ObjectId(),
//       productName: productName,
//       unit: unit,
//       quan: quan,
//       price: price,
//       typeProduct: typeProduct,
//       productImg: productImg,
//       description: description,
//       created_at: today,
//       last_modified: today,
//     };
//     proType = await ProductType.findOneAndUpdate(
//       { typeName: typeProduct },
//       { $push: { product: newProducts } }
//     ).then(async (data) => {
//       if (data == null) {
//         return res.send("Thêm sản phẩm thất bại");
//       }
//       return res.redirect(req.get("referer"));
//     });
//   } catch (error) {
//     console.log(error);
//     console.log(filename);
//     return res.send("Có lỗi xảy ra! Thêm sản phẩm thất bại");
//   }
// };
exports.editProduct = async (req, res) => {
  let productName = req.body.productName;
  let typeName = req.body.productType;
  let description = req.body.description;
  let quan = req.body.quan;
  let price = req.body.price;
  let unit = req.body.unit;
  let date = new Date();
  let today = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  if (productName == null || productName == undefined || productName == "") {
    return res.json({ success: false, mgs: "Tên không được để trống" });
  }

  try {
    //Check ProductType Name exist

    const check = await ProductType.findOne({
      productName: productName,
    });
    let currenImg = check.typeImg;
    let currenName = check.productName;
    if (productName !== currenName) {
      const checkName = await ProductType.find({
        productName: productName,
      });
      if (checkName.length != 0) {
        return res.json({
          success: false,
          mgs: "Tên sản phẩm đã tồn tại!",
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
        "public/imgFromServer/product/" +
        imageName;
      let src = fs.createReadStream(tmp_path);
      let dest = fs.createWriteStream(target_path);
      src.pipe(dest);
      src.on("end", async () => {
        try {
          let productImg = "imgFromServer/product/" + imageName;
          await ProductType.findOneAndUpdate(
            { productName: productName },

            {
              productName: productName,
              unit: unit,
              quan: quan,
              price: price,
              productType: productType,
              productImg: productImg,
              description: description,
              created_at: today,
              last_modified: today,
            }
          ).then(async () => {
            if (typeImg != "imgFromServer/product/default.png") {
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
        { productName: productName },
        {
          productName: productName,
          unit: unit,
          quan: quan,
          price: price,
          productType: productType,
          productImg: productImg,
          description: description,
          created_at: today,
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
