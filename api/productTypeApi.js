var Account = require('../models/account')
var ProductType = require('../models/ProductTypes')
var jwt = require('jsonwebtoken')
let request = require('request-promise')
let base64 = require('base-64')
let mongoose = require('mongoose')
let handleAccountJwt = require('../handleAccountJwt')
let fs = require('fs')
const path = require('path')
let api = require('../config')

API_URL = api.API_URL

exports.addProductType = async (req, res) => {
  // let accountId = handleAccountJwt.getAccountId(req)
  //Type infor
  try {
    let typeName = req.body.typeName
    let description = req.body.description
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
exports.deleteProductType = async (req, res) => {
  //let accountId = handleAccountJwt.getAccountId(req)
  //Type infor
  try {
    let typeName = req.body.typeName
    let description = req.body.description
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
exports.updateProductType = async (req, res) => {
  //Type infor
  try {
    let typeId = req.body.typeId
    let typeName = req.body.typeName
    let description = req.body.description
    // let typeImg
    let date = new Date()
    let today = new Date(date.getTime() - (date.getTimezoneOffset() * 60000))

    await ProductType.findOneAndUpdate(
      { _id: typeId },
      {
        typeName: typeName,
        description: description,
        last_modified: today
      }
    ).then(() => {
      return res.json({
        status: 1,
        message: 'Cập nhật loại sản phẩm thành công !',
        data: {
          typeName: typeName,
        }
      })
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
exports.getAllProductType = async (req, res) => {
  try {
    const listProductType = await ProductType.find()
    if (listProductType !== null) {
      return res.json({
        status: 1,
        message: 'Thành công',
        data: listProductType
      })
    } else {
      return res.json({
        status: -1,
        message: 'Không có loại sản phẩm nào',
        data: null
      })
    }
  } catch (error) {
    console.log(error)
    return res.json({
      status: -1,
      message: 'Có lỗi xảy ra. Không lấy được loại sản phẩm',
      data: null
    })
  }
}
exports.getProductTypeByName = async (req, res) => {
  try {
    let typeName = req.body.typeName
    if (typeName === null || typeName === undefined) {
      return res.json({
        status: -1,
        message: 'Vui lòng nhập tên loại',
        data: null
      })
    }
    const productTypes = await ProductType.findOne(
      { typeName: typeName }
    )
    if (productTypes !== null) {
      return res.json({
        status: 1,
        message: 'Lấy loại sản phẩm thành công',
        data: {
          typeId: productTypes._id,
          typeName: productTypes.typeName,
          typeImg: productTypes.typeImg,
          product: productTypes.product,
          description: productTypes.description,
        }
      })
    } else {
      return res.json({
        status: -1,
        message: 'Không có loại sản phẩm này',
        data: null
      })
    }
  } catch{
    return res.json({
      status: -1,
      message: 'Có lỗi xảy ra! Không lấy được loại sản phẩm',
      data: null
    })
  }

}
exports.getProductTypeById = async (req, res) => {
  try {
    let typeId = req.body.typeId
    if (typeId === null || typeId === undefined) {
      return res.json({
        status: -1,
        message: 'Vui lòng nhập ID loại cần tìm',
        data: null
      })
    }
    const productTypes = await ProductType.findOne(
      { _id: typeId }
    )
    if (productTypes !== null) {
      return res.json({
        status: 1,
        message: 'Lấy loại sản phẩm thành công',
        data: {
          typeId: productTypes._id,
          typeName: productTypes.typeName,
          typeImg: productTypes.typeImg,
          product: productTypes.product,
          description: productTypes.description,
        }
      })
    } else {
      return res.json({
        status: -1,
        message: 'Không có loại sản phẩm này',
        data: null
      })
    }
  } catch{
    return res.json({
      status: -1,
      message: 'Có lỗi xảy ra! Không lấy được loại sản phẩm',
      data: null
    })
  }
}
