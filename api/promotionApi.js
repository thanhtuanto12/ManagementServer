var Account = require("../models/account");
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

exports.getAllPromotion = async (req, res) => {
  try {
    const listPromotions = await Promotion.find({ delete_at: null });
    if (listPromotions !== null) {
      return res.json({
        status: 1,
        message: "Thành công",
        data: listPromotions,
      });
    } else {
      return res.json({
        status: -1,
        message: "Không có chương trình khuyến mãi nào",
        data: null,
      });
    }
  } catch (error) {
    console.log(error);
    return res.json({
      status: -1,
      message: "Có lỗi xảy ra. Không lấy được chương trình khuyến mãi",
      data: null,
    });
  }
};
