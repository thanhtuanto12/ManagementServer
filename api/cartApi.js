var Account = require('../models/Account')
var Cart = require('../models/Cart')
var jwt = require('jsonwebtoken')
let request = require('request-promise')
let base64 = require('base-64')
let mongoose = require('mongoose')
let handleAccountJwt = require('../handleAccountJwt')
let fs = require('fs')
const path = require('path')
let api = require('../config')

API_URL = api.API_URL

exports.findCartByUser = async (req, res) => {
  try {
    let accountId = handleAccountJwt.getAccountId(req)
    const userCart = await Cart.findOne(
      { userId: accountId }
    ).then(() => {
      if (userCart !== null) {
        // const cartDetail = 
        if(userCart.cartDetail !== null){
          return res.json({
            status: 1,
            message: 'Lấy thông tin giỏ hàng thành công!',
            data: {
              CartId: userCart._id,
              Total: userCart.total,
              UserId: userCart.userId,
              created_at: userCart.created_at,
              delete_at: userCart.delete_at,
              last_modified: userCart.last_modified,
              cartDetail: userCart.cartDetail,
            }
          })
        } else{
          return res.json({
            status: 1,
            message: 'Không có sản phẩm nào trong giỏ hàng!',
            data: {
              CartId: userCart._id,
              Total: userCart.total,
              UserId: userCart.userId,
              created_at: userCart.created_at,
              delete_at: userCart.delete_at,
              last_modified: userCart.last_modified,
              cartDetail: null,
            }
          })
        }
      } else {
        return res.json({
          status: -1,
          message: 'Lấy thông tin giỏ hàng thất bại!',
          data: {
            typeName: newProductType.typeName,
          }
        })
      }
    })

  } catch (error) {
    return res.json({
      status: -1,
      message: 'Có sự cố xảy ra. Tạo loại sản phẩm không thành công !',
      data: null,
      error: error
    })
  }
}
exports.createCart = async (req, res) => {
  try {
    let accountId = handleAccountJwt.getAccountId(req)
    const userCart = await Cart.findOne(
      { userId: accountId }
    ).then(() => {
      if (userCart !== null) {
        // const cartDetail = 
        if(userCart.cartDetail !== null){
          return res.json({
            status: 1,
            message: 'Lấy thông tin giỏ hàng thành công!',
            data: {
              CartId: userCart._id,
              Total: userCart.total,
              UserId: userCart.userId,
              created_at: userCart.created_at,
              delete_at: userCart.delete_at,
              last_modified: userCart.last_modified,
              cartDetail: userCart.cartDetail,
            }
          })
        } else{
          return res.json({
            status: 1,
            message: 'Không có sản phẩm nào trong giỏ hàng!',
            data: {
              CartId: userCart._id,
              Total: userCart.total,
              UserId: userCart.userId,
              created_at: userCart.created_at,
              delete_at: userCart.delete_at,
              last_modified: userCart.last_modified,
              cartDetail: null,
            }
          })
        }
      } else {
        return res.json({
          status: -1,
          message: 'Lấy thông tin giỏ hàng thất bại!',
          data: {
            typeName: newProductType.typeName,
          }
        })
      }
    })

  } catch (error) {
    return res.json({
      status: -1,
      message: 'Có sự cố xảy ra. Tạo loại sản phẩm không thành công !',
      data: null,
      error: error
    })
  }
}
exports.addToCart = async (req, res) => {
  try {
    let accountId = handleAccountJwt.getAccountId(req)

    let date = new Date()
    let today = new Date(date.getTime() - (date.getTimezoneOffset() * 60000))
    const newProductType = new ProductType({
      _id: new mongoose.Types.ObjectId(),
      typeName: typeName,
      description: description,
      created_at: today,
      last_modified: today
    })
    await newProductType.save()
    return res.json({
      status: 1,
      message: 'Tạo loại sản phẩm mới thành công !',
      data: {
        typeName: newProductType.typeName,
      }
    })
  } catch (error) {
    return res.json({
      status: -1,
      message: 'Có sự cố xảy ra. Tạo loại sản phẩm không thành công !',
      data: null,
      error: error
    })
  }
}