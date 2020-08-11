var passport = require("passport");
var Promotion = require("../models/Promotion");
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
const { isDate, isNull } = require("util");
const Promotions = require("../models/Promotion");

function objectIsEmpty(object) {
  if (Object.keys(object).length == 0) {
    return true;
  }
  return false;
}
exports.getListPromotions = async (req, res) => {
  try {
    let page = 0; //req.body.page
    let limit = 1; //req.body.limit
    // const listProductType = await ProductType.find().skip(page*limit).limit(limit)

    const listPromotions = await Promotion.find({ delete_at: null });
    return res.render("promotions/Promotion", {
      listPromotions,
      mgs: "",
    });
  } catch (error) {
    return res.send({ mgs: "Có lỗi xảy ra! Lấy danh sách thất bại" });
  }
};
exports.getListPagePromotions = async (req, res) => {
  try {
    let page = req.body.page;
    let limit = 2; //req.body.limit
    const listPromotions = await Promotion.find()
      .skip(page * limit)
      .limit(limit);
    const listAll = listPromotions.find();
    const countPage = (await listAll).length / limit;
    return res.json({
      success: true,
      listPromotions,
      mgs: " ",
      countPage: countPage,
    });
  } catch (error) {
    return res.json({
      success: false,
      mgs: "Có lỗi xảy ra! Lấy danh sách thất bại",
    });
  }
};
exports.addPromotions = async (req, res) => {
  let promotionsName = req.body.promotionsName;
  let description = req.body.promotionsDescription;
  let date = new Date();
  let today = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  if (
    promotionsName == null ||
    promotionsName == undefined ||
    promotionsName == ""
  ) {
    return res.json({ success: false, mgs: "Tên không được để trống" });
  }
  try {
    const check = await Promotion.findOne({
      promotionsName: promotionsName,
    });
    if (check == null) {
      let files = req.files;
      if (!objectIsEmpty(files)) {
        let file = req.files.promotionsImg;
        let imageName = file.fieldName + "-" + Date.now() + ".png";
        let tmp_path = file.path;
        let target_path =
          __dirname.replace("controller", "") +
          "public/imgFromServer/promotions/" +
          imageName;
        let src = fs.createReadStream(tmp_path);
        let dest = fs.createWriteStream(target_path);
        src.pipe(dest);
        src.on("end", async () => {
          try {
            let promotionsImg = "imgFromServer/promotions/" + imageName;
            const newPromotions = new Promotion({
              _id: new mongoose.Types.ObjectId(),
              promotionsName: promotionsName,
              promotionsImg: promotionsImg,
              description: description,
              created_at: today,
              last_modified: today,
            });
            await newPromotions.save().then(async () => {
              return res.json({
                success: true,
                mgs: "Thêm thành công",
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
        let PromotionsImg = "imgFromServer/promotions/default.png";
        //create new ProductType
        const newPromotion = new Promotion({
          _id: new mongoose.Types.ObjectId(),
          promotionsName: promotionsName,
          promotionsImg: PromotionsImg,
          description: description,
          created_at: today,
          last_modified: today,
        });
        await newPromotion.save().then(async () => {
          return res.json({
            success: true,
            mgs: "Thêm  thành công",
          });
        });
      }
    } else {
      return res.json({
        success: false,
        mgs: "Tên đã tồn tại!",
      });
    }
  } catch {
    return res.json({
      success: false,
      mgs: "Có sự cố xảy ra. Không thể thêm loại sản phẩm!",
    });
  }
};
