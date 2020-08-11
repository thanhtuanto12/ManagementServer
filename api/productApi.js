var passport = require("passport");
var Account = require("../models/account");
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

exports.searchProduct = async (req, res) => {
  try {
    let searchKey = req.body.productName;

    const findProducts = await ProductType.find({
      delete_at: null,
      "product.productName": { $regex: `${searchKey}` },
    });
    let products = [];
    for (let ProType of findProducts) {
      if (ProType.product !== []) {
        for (let product of ProType.product) {
          if (product.productName.search(`${searchKey}`) !== -1) {
            products.push(product);
          }
        }
      }
    }
    return res.json({
      status: 1,
      message: "Lấy danh sách sản phẩm thành công",
      data: products,
    });
  } catch (error) {
    console.log(error);
    return res.json({
      status: -1,
      message: "Có lỗi xảy ra. Không lấy được sản phẩm",
      data: null,
    });
  }
};
exports.getAllProduct = async (req, res) => {
  try {
    const listProductType = await ProductType.find({ delete_at: null });
    var listProduct = [];
    if (
      listProductType !== null ||
      listProductType !== undefined ||
      listProductType !== []
    ) {
      for (let ProType of listProductType) {
        if (ProType.product !== []) {
          for (let product of ProType.product) {
            listProduct.push(product);
          }
        }
      }

      return res.json({
        status: 1,
        message: "Lấy danh sách sản phẩm thành công",
        data: listProduct,
      });
    } else {
      return res.json({
        status: -1,
        message: "Không có sản phẩm nào",
        data: null,
      });
    }
  } catch (error) {
    console.log(error);
    return res.json({
      status: -1,
      message: "Có lỗi xảy ra. Không lấy được sản phẩm",
      data: null,
    });
  }
};
exports.getProductByProType = async (req, res) => {
  let typeName = req.body.proType;
  try {
    let typeName = req.body.typeName;
    if (typeName === null || typeName === undefined) {
      return res.json({
        status: -1,
        message: "Vui lòng nhập tên loại",
        data: null,
      });
    }
    const productTypes = await ProductType.findOne({
      typeName: typeName,
      delete_at: null,
    });
    if (productTypes !== null) {
      return res.json({
        status: 1,
        message: "Lấy danh sách sản phẩm thành công",
        data: {
          typeId: productTypes._id,
          typeName: productTypes.typeName,
          typeImg: productTypes.typeImg,
          product: productTypes.product,
          description: productTypes.description,
        },
      });
    } else {
      return res.json({
        status: -1,
        message: "Không có loại sản phẩm này",
        data: null,
      });
    }
  } catch (error) {
    console.log(error);
    return res.json({
      status: -1,
      message: "Có lỗi xảy ra. Không lấy được loại sản phẩm",
      data: null,
    });
  }
};
exports.getProductByName = async (req, res) => {
  try {
    const productName = req.body.productName;
    if (productName === null || productName === undefined) {
      return res.json({
        status: -1,
        message: "Vui lòng nhập tên sản phẩm",
        data: null,
      });
    }
    const listProductType = await ProductType.find();
    var listProduct = [];
    if (
      listProductType !== null ||
      listProductType !== undefined ||
      listProductType !== []
    ) {
      for (let ProType of listProductType) {
        if (ProType.product !== []) {
          for (let product of ProType.product) {
            if (product !== null || product !== []) {
              console.log(product.productName);
              if (product.productName.includes(productName)) {
                listProduct.push(product);
              }
            }
          }
        }
      }
      return res.json({
        status: 1,
        message: "Lấy danh sách sản phẩm thành công",
        data: listProduct,
      });
    } else {
      return res.json({
        status: -1,
        message: "Không có sản phẩm nào",
        data: null,
      });
    }
  } catch (error) {
    console.log(error);
    return res.json({
      status: -1,
      message: "Có lỗi xảy ra. Không lấy được sản phẩm",
      data: null,
    });
  }
};
exports.getProductById = async (req, res) => {
  try {
    let productID = req.body.productID;
    if (productID === null || productID === undefined) {
      return res.json({
        status: -1,
        message: "Vui lòng nhập productID",
        data: null,
      });
    }
    const productTypes = await ProductType.find();
    if (productTypes !== null) {
      for (let type of productTypes) {
        if (type.product !== undefined || type.product !== null) {
          for (let product of type.product) {
            if (product._id == productID) {
              return res.json({
                status: 1,
                message: "Lấy sản phẩm thành công",
                data: product,
              });
            }
          }
        }
      }
      return res.json({
        status: -1,
        message: "Không tìm thấy sản phẩm này",
        data: null,
      });
    } else {
      return res.json({
        status: -1,
        message: "Không có sản phẩm nào trong hệ thống",
        data: null,
      });
    }
  } catch (error) {
    console.log(error);
    return res.json({
      status: -1,
      message: "Có lỗi xảy ra. Không lấy được loại sản phẩm",
      data: null,
    });
  }
};
exports.updateProduct = async (req, res) => {};
