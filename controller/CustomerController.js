var passport = require("passport");
var Customer = require("../models/customer");
var jwt = require("jsonwebtoken");
let request = require("request-promise");
let base64 = require("base-64");
let mongoose = require("mongoose");
let handleAccountJwt = require("../handleAccountJwt");
let fs = require("fs");
const bcrypt = require("bcrypt");
const path = require("path");
let api = require("../config");
API_URL = api.API_URL;

exports.getListCustomer = async (req, res) => {
  try {
    let page = 0; //req.body.page
    let limit = 1; //req.body.limit

    const listCustomer = await Customer.find({ delete_at: null });
    return res.render("Customers/customer", {
      listCustomer,
      mgs: "",
    });
  } catch (error) {
    return res.send({ mgs: "Có lỗi xảy ra! Lấy danh sách thất bại" });
  }
};
exports.getListPageCustomer = async (req, res) => {
  try {
    let page = req.body.page;
    let limit = 2; //req.body.limit
    const listCustomer = await Customer.find()
      .skip(page * limit)
      .limit(limit);
    const listAll = Customer.find();
    const countPage = (await listAll).length / limit;
    return res.json({
      success: true,
      listCustomer,
      mgs: "",
      countPage: countPage,
    });
  } catch (error) {
    return res.json({
      success: false,
      mgs: "Có lỗi xảy ra! Lấy danh sách thất bại",
    });
  }
};
exports.getListDeletedCustomer = async (req, res) => {
  try {
    let page = 0; //req.body.page
    let limit = 1; //req.body.limit
    const listDeletedCustomer = await Customer.find({
      delete_at: { $ne: null },
    });
    return res.render("customers/deletedCustomer", {
      listDeletedCustomer,
      mgs: "",
    });
  } catch (error) {
    console.log(error);
    return res.send({ mgs: "Có lỗi xảy ra! Lấy danh sách thất bại" });
  }
};
exports.addCustomer = async (req, res) => {
  let name = req.body.name;
  let phone = req.body.phone;
  let password = req.body.password;
  let rePassword = req.body.rePassword;
  let date = new Date();
  let today = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  if (!name) {
    return res.json({ success: false, mgs: "Tên không được để trống" });
  }
  if (!phone) {
    return res.json({
      success: false,
      mgs: "Số điện thoại không được để trống",
    });
  }
  if (!password) {
    return res.json({ success: false, mgs: "Mật khẩu không được để trống" });
  }
  if (password !== rePassword) {
    return res.json({
      success: false,
      mgs: "Nhập lại mật khẩu không chính xác",
    });
  }
  try {
    const check = await Customer.findOne({
      phone: phone,
    });

    if (check == null) {
      const newAccount = new Customer({
        _id: new mongoose.Types.ObjectId(),
        name: name,
        phone: phone,
        password: bcrypt.hashSync(password, 10),
        created_at: today,
        last_modified: today,
      });
      await newAccount.save().then(async () => {
        return res.json({
          success: true,
          mgs: "Thêm khách hàng thành công",
        });
      });
    } else {
      return res.json({
        success: false,
        mgs: "Số điện thoại đã tồn tại!",
      });
    }
  } catch (err) {
    console.log(err);
    return res.json({
      success: false,
      mgs: "Có sự cố xảy ra. Không thể thêm !",
    });
  }
};
exports.editCustomer = async (req, res) => {
  let name = req.body.name;
  let customerId = req.body.id;
  let phone = req.body.phone;
  let date = new Date();
  let today = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  if (!phone) {
    return res.json({
      success: false,
      mgs: "Số điện thoại không được để trống",
    });
  }
  try {
    //Check phone exist
    const check = await Customer.findOne({
      _id: customerId,
    });
    if (check) {
      let currenphone = check.phone;
      if (phone !== currenphone) {
        const checkPhone = await Customer.find({
          phone: phone,
        });
        if (checkPhone.length != 0) {
          return res.json({
            success: false,
            mgs: "Số điện thoại đã tồn tại!",
          });
        }
      }
    }

    //update Account
    await Customer.findOneAndUpdate(
      { _id: customerId },
      {
        name: name,
        phone: phone,
        last_modified: today,
      }
    );
    return res.json({
      success: true,
      mgs: "Cập nhật thành công",
    });
  } catch (err) {
    console.log(err);
    return res.json({
      success: false,
      mgs: "Có sự cố xảy ra. Không thể cập nhật khách hàng!",
    });
  }
};
exports.deleteCustomer = async (req, res) => {
  //Type infor
  try {
    let customerId = req.body.id;
    let date = new Date();
    let today = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
    await Customer.findOneAndUpdate(
      { _id: customerId },
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
exports.restoreCustomer = async (req, res) => {
  try {
    let customerId = req.body.id;
    let date = new Date();
    let today = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
    await Customer.findOneAndUpdate(
      { _id: customerId },
      {
        delete_at: null,
        last_modified: today,
      }
    );
    return res.json({
      success: true,
      mgs: "Khôi phục thành công",
    });
  } catch (error) {
    console.log(error);
    return res.json({
      success: false,
      mgs: "Có lỗi xảy ra! Khôi phục thất bại",
    });
  }
};
