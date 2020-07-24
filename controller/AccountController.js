var passport = require('passport')
var Account = require('../models/account')
var jwt = require('jsonwebtoken')
let request = require('request-promise')
let base64 = require('base-64')
let mongoose = require('mongoose')
let handleAccountJwt = require('../handleAccountJwt')
let fs = require('fs')
const path = require('path')
let api = require('../config')
API_URL = api.API_URL

exports.login = async (req, res) => {
  let username = req.body.username
  let password = req.body.password
  if (username == "" || username === undefined || password == "" || password === undefined) {
    return res.json({ success: false, mgs: 'Tài khoản mật khẩu không được để trống' });
  }
  try {
    username = username.toLowerCase()
    const check = await Account.findOne(
      {
        username: username,
        password: password
      }
    )
    if (check !== null) {
      req.session.isLogin = true;
      req.session.user = username;
      return res.json({ success: true, mgs: "" });
    } else {
      return res.json({ success: false, mgs: 'Tên đăng nhập hoặc mật khẩu không đúng' });
    }
  }
  catch{
    return res.json({ success: false, mgs: 'Có sự cố xảy ra, vui lòng thử lại sau' });
  }

}
exports.getListAccount = async (req, res) => {
  try {
    const listAccount = await Account.find()
    return res.render('account/ListAccount', { listAccount });
  } catch (error) {
    return res.send('Có lỗi xảy ra! Lấy danh sách thất bại');;
  }
}
// exports.logout = async (req, res) => {

// }