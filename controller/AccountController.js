var passport = require("passport");
var Account = require("../models/account");
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

exports.login = async (req, res) => {
  let username = req.body.username;
  let password = req.body.password;
  if (
    username == "" ||
    username === undefined ||
    password == "" ||
    password === undefined
  ) {
    return res.json({
      success: false,
      mgs: "Tài khoản mật khẩu không được để trống",
    });
  }
  try {
    username = username.toLowerCase();
    const check = await Account.findOne({
      username: username,
      delete_at: null,
    });
    if (check && bcrypt.compareSync(password, check.password)) {
      req.session.isLogin = true;
      req.session.user = username;
      return res.json({ success: true, mgs: "" });
    } else {
      return res.json({
        success: false,
        mgs: "Tên đăng nhập hoặc mật khẩu không đúng",
      });
    }
  } catch {
    return res.json({
      success: false,
      mgs: "Có sự cố xảy ra, vui lòng thử lại sau",
    });
  }
};
// exports.logout = async (req, res) => {
//   try {
//     req.session.isLogin = false;
//     return res.render("login/login");
//     res.json({
//       status: 1,
//       message: "Đăng xuất thành công",
//       data: null,
//     });
//   } catch (error) {
//     res.json({
//       status: -1,
//       message: "Thất bại",
//       data: null,
//       error: error,
//     });
//   }
// };
exports.getListAccount = async (req, res) => {
  try {
    let page = 0; //req.body.page
    let limit = 1; //req.body.limit
    // const listProductType = await ProductType.find().skip(page*limit).limit(limit)

    const listAccount = await Account.find({ delete_at: null });
    if (req.session.isLogin) {
      return res.render("account/ListAccount", {
        listAccount,
        mgs: "",
      });
    } else {
      return res.render("login/login");
    }
  } catch (error) {
    return res.send({ mgs: "Có lỗi xảy ra! Lấy danh sách thất bại" });
  }
};
exports.getListPageAccount = async (req, res) => {
  try {
    let page = req.body.page;
    let limit = 2; //req.body.limit
    const listAccount = await Account.find()
      .skip(page * limit)
      .limit(limit);
    const listAll = Account.find();
    const countPage = (await listAll).length / limit;
    return res.json({
      success: true,
      listAccount,
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
exports.getListDeletedAccount = async (req, res) => {
  try {
    let page = 0; //req.body.page
    let limit = 1; //req.body.limit
    const listDeletedAccount = await Account.find({
      delete_at: { $ne: null },
    });
    if (req.session.isLogin) {
      return res.render("account/deletedAccount", {
        listDeletedAccount,
        mgs: "",
      });
    } else {
      return res.render("login/login");
    }
  } catch (error) {
    console.log(error);
    return res.send({ mgs: "Có lỗi xảy ra! Lấy danh sách thất bại" });
  }
};

exports.addAccount = async (req, res) => {
  let fullName = req.body.fullname;
  let username = req.body.username;
  let password = req.body.password;
  let email = req.body.email;
  let date = new Date();
  let today = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  if (!username) {
    return res.json({ success: false, mgs: "Tên không được để trống" });
  }
  try {
    const check = await Account.findOne({
      username: username,
    });

    if (check == null) {
      const newAccount = new Account({
        _id: new mongoose.Types.ObjectId(),
        fullName: fullName,
        username: username,
        password: bcrypt.hashSync(password, 10),
        email: email,
        created_at: today,
        last_modified: today,
      });
      console.log(username);
      await newAccount.save().then(async () => {
        return res.json({
          success: true,
          mgs: "Thêm thành công",
        });
      });
    } else {
      return res.json({
        success: false,
        mgs: "Tên đã tồn tại!",
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
exports.editAccount = async (req, res) => {
  let fullName = req.body.fullname;
  let username = req.body.username;
  let password = req.body.password;
  let email = req.body.email;
  let date = new Date();
  let today = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  if (!username) {
    return res.json({
      success: false,
      mgs: "Tên người dùng không được để trống",
    });
  }
  try {
    //Check username exist
    const check = await Account.findOne({
      username: username,
    });

    let currenName = check.username;
    if (username !== currenName) {
      const checkName = await Account.find({
        username: username,
      });
      if (checkName.length != 0) {
        return res.json({
          success: false,
          mgs: "Tên đã tồn tại!",
        });
      }
    }

    //update Account
    await Account.findOneAndUpdate(
      { username: username },
      {
        fullName: fullName,
        email: email,
        last_modified: today,
      }
    );
    return res.json({
      success: true,
      mgs: "Cập nhật loại sản phẩm thành công",
    });
  } catch (err) {
    console.log(err);
    return res.json({
      success: false,
      mgs: "Có sự cố xảy ra. Không thể cập nhật loại sản phẩm!",
    });
  }
};
exports.deleteAccount = async (req, res) => {
  //Type infor
  try {
    let accountId = req.body.accountId;
    let date = new Date();
    let today = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
    await Account.findOneAndUpdate(
      { _id: accountId },
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

exports.restoreAccount = async (req, res) => {
  //Type infor
  try {
    let accountId = req.body.accountId;
    let date = new Date();
    let today = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
    await Account.findOneAndUpdate(
      { _id: accountId },
      {
        delete_at: null,
        last_modified: today,
      }
    );
    return res.json({
      success: true,
      mgs: "khôi phục thành công",
    });
  } catch (error) {
    console.log(error);
    return res.json({
      success: false,
      mgs: "Có lỗi xảy ra! Khôi phục thất bại",
    });
  }
};
