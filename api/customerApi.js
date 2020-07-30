var passport = require("passport");
var Customer = require("../models/customer");
var jwt = require("jsonwebtoken");
let request = require("request-promise");
let base64 = require("base-64");
let mongoose = require("mongoose");
let handleAccountJwt = require("../handleAccountJwt");
let fs = require("fs");
const path = require("path");
const bcrypt = require("bcrypt");
let api = require("../config");
const { getSalt } = require("bcryptjs");
const { findOneAndUpdate } = require("../models/customer");
API_URL = api.API_URL;

exports.login = async (req, res) => {
  let phone = req.body.phone;
  let password = req.body.password;
  if (
    phone === null ||
    phone === undefined ||
    password === null ||
    password === undefined
  ) {
    return res.json({
      status: -1,
      message: "Vui lòng nhập đầy đủ số điện thoại và mật khẩu",
      data: null,
    });
  }

  phone = phone;
  const check = await Customer.findOne({ phone: phone });
  if (check !== null) {
    const token1 = jwt.sign({ id: check.id }, "jwt-secret");
    return res.json({
      status: 1,
      message: "Thành công",
      data: {
        token: token1,
        userId: check.userId,
        username: check.username,
        fullName: check.fullName,
        email: check.email,
        phone: check.phone,
        avatarUrl: check.avatarUrl,
        address: check.address,
      },
    });
  } else {
    return res.json({
      status: -1,
      message: "Số điện thoại hoặc mật khẩu không chính xác",
      data: null,
    });
  }
};

exports.logout = async (req, res) => {
  let accountId = handleAccountJwt.getAccountId(req);
  try {
    await Customer.findOneAndUpdate(
      { _id: accountId },
      {
        notificationToken: {
          token: null,
          platform: null,
        },
      }
    );
    res.json({
      status: 1,
      message: "Đăng xuất thành công",
      data: null,
    });
  } catch (error) {
    res.json({
      status: -1,
      message: "Thất bại",
      data: null,
      error: error,
    });
  }
};
exports.register = async (req, res) => {
  try {
    const { name, phone, password } = req.body;
    if (!phone) {
      return res.json({
        status: -1,
        message: " Số điện thoại không được bỏ trống!",
        data: null,
      });
    }
    if (!password) {
      return res.json({
        status: -1,
        message: "Mật khẩu không được bỏ trống!",
        data: null,
      });
    }
    if (!name) {
      return res.json({
        status: -1,
        message: "Tên không được bỏ trống",
        data: null,
      });
    }
    const checkAccount = await Customer.findOne({ phone });
    // const checkUsername = await Customer.findOne({ username: username });
    if (checkAccount) {
      return res.json({
        status: -1,
        message: "Số điện thoại đã được đăng ký!",
        data: null,
      });
    }
    await new Customer({
      name,
      password: bcrypt.hashSync(password, 10),
      phone,
    }).save();

    return res.json({
      status: 1,
      message: "Đăng ký thành công!",
      data: null,
    });
  } catch (error) {
    console.log(error);
    return res.json({
      status: -1,
      message: "Failed !",
      data: null,
    });
  }
};

exports.getUserByPhone = async (req, res) => {
  try {
    let phone = req.body.phone;
    if (phone === null || phone === undefined) {
      return res.json({
        status: -1,
        message: "Vui lòng nhập số điện thoại",
        data: null,
      });
    }
    const Customer = await Customer.findOne({ phone: phone });
    if (user !== null) {
      return res.json({
        status: 1,
        message: "Lấy thông tin thành công",
        data: {
          userID: Customer._id,
          username: Customer.username,
          fullName: Customer.fullName,
          email: Customer.email,
          phone: Customer.phone,
          address: Customer.address,
          avatarUrl: Customer.avatarUrl,
        },
      });
    } else {
      return res.json({
        status: -1,
        message: "Không tìm thấy người dùng này",
        data: null,
      });
    }
  } catch {
    return res.json({
      status: -1,
      message: "Có lỗi xảy ra! Không lấy được thông tin",
      data: null,
    });
  }
};
exports.getUserByName = async (req, res) => {
  try {
    let username = req.body.username;
    if (username === null || username === undefined) {
      return res.json({
        status: -1,
        message: "Vui lòng nhập username",
        data: null,
      });
    }
    const Customer = await Customer.findOne({ username: username });
    if (user !== null) {
      return res.json({
        status: 1,
        message: "Lấy thông tin thành công",
        data: {
          userID: Customer._id,
          username: Customer.username,
          fullName: Customer.fullName,
          email: Customer.email,
          phone: Customer.phone,
          address: Customer.address,
          avatarUrl: Customer.avatarUrl,
        },
      });
    } else {
      return res.json({
        status: -1,
        message: "Không tìm thấy người dùng này",
        data: null,
      });
    }
  } catch {
    return res.json({
      status: -1,
      message: "Có lỗi xảy ra! Không lấy được thông tin",
      data: null,
    });
  }
};
exports.getUserByToken = async (req, res) => {
  try {
    const bearerHeader = req.headers["authorization"];
    if (typeof bearerHeader !== "undefined") {
      const bearer = bearerHeader.split(" ");
      const bearerToken = bearer[1];
      req.token = bearerToken;
      let accountId = handleAccountJwt.getAccountId(req);
      if (accountId !== null || accountId !== undefined) {
        const Customer = await Customer.findOne({ _id: accountId });
        if (Customer === null || Customer === undefined) {
          return res.json({
            status: -1,
            message: "Không tìm thấy người dùng này !",
            data: null,
          });
        } else {
          return res.json({
            status: 1,
            message: "Lấy thông tin thành công",
            data: {
              userID: Customer._id,
              username: Customer.username,
              fullName: Customer.fullName,
              email: Customer.email,
              phone: Customer.phone,
              address: Customer.address,
              avatarUrl: Customer.avatarUrl,
            },
          });
        }
      } else {
        return res.json({
          status: -1,
          message: "Không tìm thấy người dùng này !",
          data: null,
        });
      }
    } else {
      return res.json({
        status: -1,
        message: "Không tìm thấy người dùng này !",
        data: null,
      });
    }
  } catch {
    return res.json({
      status: -1,
      message: "Có lỗi xảy ra! Không lấy được thông tin",
      data: null,
    });
  }
};
exports.pushNotificationToken = async (req, res) => {
  let notificationToken = req.body.notificationToken;
  let platform = req.body.platform;
  let accountId = handleAccountJwt.getAccountId(req);

  try {
    await Customer.findOneAndUpdate(
      {
        _id: accountId,
      },
      {
        notificationToken: {
          token: notificationToken,
          platform: platform,
        },
      }
    );

    let checkAccount = await Customer.findOne({
      _id: accountId,
    });

    if (checkAccount.notificationToken.token === notificationToken) {
      res.json({
        status: 1,
        message: "Thành công",
        data: {
          notificationToken: checkAccount.notificationToken,
        },
      });
    } else {
      res.json({
        status: -1,
        message: "Thất bại",
        data: null,
      });
    }
  } catch (error) {
    res.json({
      status: -1,
      message: "Thất bại",
      data: null,
      error: error,
    });
  }
};

exports.getNumOfNotification = async (req, res) => {
  let accountId = handleAccountJwt.getAccountId(req);

  try {
    let checkAccount = await Customer.findOne({
      _id: accountId,
    });

    if (checkAccount !== null && checkAccount !== undefined) {
      let length = 0;
      for (const notification of checkAccount.notifications) {
        if (notification.status === 0) {
          length = length + 1;
        }
      }

      res.json({
        status: 1,
        message: "Thành công",
        data: {
          numOfNotification: length,
        },
      });
    } else {
      res.json({
        status: -1,
        message: "Thất bại",
        data: null,
      });
    }
  } catch (error) {
    res.json({
      status: -1,
      message: "Thất bại",
      data: null,
      error: error,
    });
  }
};

exports.clearNotification = async (req, res) => {
  let accountId = handleAccountJwt.getAccountId(req);
  let date = new Date();
  isoDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  try {
    let checkAccount = await Customer.updateMany(
      { _id: accountId },
      {
        $set: {
          "notifications.$[].status": 1,
          "notifications.$[].last_modified": isoDate,
        },
      }
    );

    res.json({
      status: 1,
      message: "Thành công",
      data: null,
    });
  } catch (error) {
    res.json({
      status: -1,
      message: "Thất bại",
      data: null,
      error: error,
    });
  }
};

exports.getListNotification = async (req, res) => {
  let queryParams = req.query;
  let accountId = handleAccountJwt.getAccountId(req);
  let pageSize = Number.parseInt(queryParams.pageSize);
  let page = Number.parseInt(queryParams.page);
  let result = [];
  try {
    let notifications = await Customer.aggregate([
      { $unwind: "$notifications" },
      { $match: { _id: mongoose.Types.ObjectId(accountId) } },
    ])
      .sort({ "notifications.created_at": -1 })
      .limit(pageSize * page)
      .skip(pageSize * (page - 1));

    for (const noti of notifications) {
      result.push(noti.notifications);
    }

    return res.json({
      status: 1,
      message: "Lấy danh sách thông báo thành công !",
      data: result,
    });
  } catch (error) {
    res.json({
      status: -1,
      message: "Có sự cố xảy ra. Không thể lấy danh sách thông báo !",
      data: null,
      error: error,
    });
  }
};

exports.updateUserData = async (req, res) => {
  const newAccount = new Customer({
    _id: new mongoose.Types.ObjectId(),
    userId: id,
    username: username,
    fullName:
      userData1.data === undefined || userData1.data === null
        ? null
        : userData1.data.fullName,
    email:
      userData1.data === undefined || userData1.data === null
        ? null
        : userData1.data.email,
    phone:
      userData1.data === undefined || userData1.data === null
        ? null
        : userData1.data.phone,
    status: 1,
    created_at: new Date(),
  });
  result = await newAccount.save();
};

exports.changeAvatar = async (req, res) => {
  let file = req.file;
  let accountId = handleAccountJwt.getAccountId(req);
  let randomNumber = Math.floor(Math.random() * 1000000000) + 1;
  let imageName = `${file.originalname}_${randomNumber}.png`;
  let tmp_path = file.path;
  let target_path = __dirname.replace("/api", "") + "/uploads/" + imageName;
  let src = fs.createReadStream(tmp_path);
  let dest = fs.createWriteStream(target_path);
  src.pipe(dest);
  src.on("end", async () => {
    fs.unlink(tmp_path, (err) => {
      console.log(err);
    });
    try {
      const account = await Customer.findOne({
        _id: accountId,
      });
      if (account.avatarUrl !== null || account.avatarUrl === undefined) {
        let currentAvatar = account.avatarUrl.replace(`${API_URL}/image/`, "");
        try {
          fs.unlink(
            __dirname.replace("/api", "") + `/uploads/${currentAvatar}`,
            (err) => {
              console.log(err);
            }
          );
        } catch (error) {
          console.log(error);
        }
      }

      await Customer.findOneAndUpdate(
        {
          _id: accountId,
        },
        {
          avatarUrl: `${API_URL}/image/${imageName}`,
        }
      );

      res.json({
        status: 1,
        message: "Thay đổi ảnh đại diện thành công",
        data: {
          imageUrl: `${API_URL}/image/${imageName}`,
        },
      });
    } catch (error) {
      return res.json({
        status: -1,
        message: "Có sự cố xảy ra. Không thể thay đổi ảnh đại diện !",
        data: null,
        error: error,
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
      data: null,
      error: error,
    });
  });
};
