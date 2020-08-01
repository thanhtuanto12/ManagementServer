var Cart = require("../models/Cart");
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

exports.findCartByUser = async (req, res) => {
  try {
    let accountId = handleAccountJwt.getAccountId(req);
    if (accountId == null) {
      return res.json({
        status: -1,
        message: "Không tìm thấy người dùng này!",
        data: null,
      });
    } else {
      let userCart = await Cart.findOne({ userId: accountId });
      if (userCart !== null) {
        return res.json({
          status: 1,
          message: "Lấy thông tin giỏ hàng thành công!",
          data: {
            CartId: userCart._id,
            Total: userCart.total,
            UserId: userCart.userId,
            created_at: userCart.created_at,
            delete_at: userCart.delete_at,
            last_modified: userCart.last_modified,
            cartDetail: userCart.cartDetail,
          },
        });
      } else {
        return res.json({
          status: -1,
          message: "Lấy thông tin giỏ hàng thất bại!",
          data: null,
        });
      }
    }
  } catch (error) {
    return res.json({
      status: -1,
      message: "Có sự cố xảy ra. Lấy thông tin giỏ hàng thất bại!",
      data: null,
    });
  }
};
exports.addToCart = async (req, res) => {
  try {
    //get data when addproduct to cart
    let productID = req.body.productID;
    let quan = req.body.quan;
    let accountId = handleAccountJwt.getAccountId(req);
    let date = new Date();
    let today = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
    //check account
    if (accountId == null) {
      return res.json({
        status: -1,
        message: "Không tìm thấy người dùng này!",
        data: null,
      });
    }
    //check product is exit
    if (productID == null) {
      return res.json({
        status: -1,
        message: "Không tìm thấy sản phẩm này!",
        data: null,
      });
    }
    //get cart by user
    let userCart = await Cart.findOne({ userId: accountId });
    //check if product is exit in cart
    const cartDetail = userCart.cartDetail.filter(
      (data) => data.productId.toString() === productID.toString()
    );
    let cartDetailIndex = userCart.cartDetail.findIndex(
      (data) => data.productId.toString() === productID.toString()
    );

    if (cartDetail.length === 0) {
      //get productHave product

      // const productTypes = await ProductType.find()
      const productTypes = await ProductType.findOne({
        "product._id": productID,
      });
      const Products = productTypes.product.filter(
        (data) => data._id.toString() === productID.toString()
      );
      const Product = Products[0];
      //add product to cart
      let newDetails = {
        _id: new mongoose.Types.ObjectId(),
        productName: Product.productName,
        productId: productID,
        quan: quan,
        price: Product.price,
        typeProduct: Product.typeProduct,
        productImg: Product.productImg,
        created_at: today,
        last_modified: today,
      };
      //add to cart
      userCart = await Cart.findOneAndUpdate(
        { userId: accountId },
        {
          last_modified: today,
          $push: { cartDetail: newDetails },
        }
      ).then(async (data) => {
        if (data == null) {
          return res.json({
            status: -1,
            message: "Thêm vào giỏ hàng thất bại!",
            data: {
              productID: productID,
            },
          });
        }
        return res.json({
          status: 1,
          message: "Thêm vào giỏ hàng thành công!",
          data: {
            productID: productID,
          },
        });
      });
    } else {
      //edit quanti
      let oldQuan = cartDetail[0].quan;
      let newQuan = parseInt(oldQuan) + parseInt(quan);
      await Cart.findOneAndUpdate(
        {
          userId: accountId,
        },
        { $set: { [`cartDetail.${cartDetailIndex}.quan`]: newQuan } }
      ).then(async (data) => {
        if (data == null) {
          return res.json({
            status: -1,
            message: "Thêm vào giỏ hàng thất bại!",
            data: {
              productID: productID,
            },
          });
        }
        return res.json({
          status: 1,
          message: "Thêm vào giỏ hàng thành công!",
          data: {
            productID: productID,
          },
        });
      });
    }
  } catch (error) {
    return res.json({
      status: -1,
      message: "Có sự cố xảy ra. Không thêm được vào giỏ hàng!",
      data: null,
    });
  }
};
exports.changeQuanti = async (req, res) => {
  try {
    //get data when addproduct to cart
    let productID = req.body.productID;
    let accountId = handleAccountJwt.getAccountId(req);
    let date = new Date();
    let today = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
    //check account
    if (accountId == null) {
      return res.json({
        status: -1,
        message: "Không tìm thấy người dùng này!",
        data: null,
      });
    }
    //check product is exit
    if (productID == null) {
      return res.json({
        status: -1,
        message: "Không tìm thấy sản phẩm này!",
        data: null,
      });
    }
    //get cart by user
    let userCart = await Cart.findOne({ userId: accountId });
    //check if product is exit in cart
    const cartDetail = userCart.cartDetail.filter(
      (data) => data.productId.toString() === productID.toString()
    );
    let cartDetailIndex = userCart.cartDetail.findIndex(
      (data) => data.productId.toString() === productID.toString()
    );

    if (cartDetail.length === 0) {
      return res.json({
        status: -1,
        message: "Sản phẩm không tồn tại trong giỏ hàng",
        data: {
          productID: productID,
        },
      });
    } else {
      //edit quanti
      let oldQuan = cartDetail[0].quan;
      if (oldQuan > 1) {
        let newQuan = parseInt(oldQuan) - 1;
        await Cart.findOneAndUpdate(
          {
            userId: accountId,
          },
          { $set: { [`cartDetail.${cartDetailIndex}.quan`]: newQuan } }
        ).then(async (data) => {
          if (data == null) {
            return res.json({
              status: -1,
              message: "Cập nhật số lượng thất bại!",
              data: {
                productID: productID,
              },
            });
          }
          return res.json({
            status: 1,
            message: "Cập nhật số lượng thành công!",
            data: {
              productID: productID,
            },
          });
        });
      } else {
        let userCart = await Cart.findOne({ userId: accountId });
        userCart
          .updateOne({ $unset: { [`cartDetail.${cartDetailIndex}`]: 1 } })
          .then(async (data) => {
            userCart
              .update({ $pull: { cartDetail: null } })
              .then(async (data) => {
                return res.json({
                  status: 1,
                  message: "Đã xoá sản phẩm khỏi giỏ hàng",
                  data: null,
                });
              });
          });
      }
    }
  } catch (error) {
    return res.json({
      status: -1,
      message: "Có sự cố xảy ra. Không thêm được vào giỏ hàng!",
      data: null,
    });
  }
};
exports.removeFromCart = async (req, res) => {
  try {
    //get data when addproduct to cart
    let productID = req.body.productID;
    let accountId = handleAccountJwt.getAccountId(req);
    let date = new Date();
    let today = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
    //check account
    if (accountId == null) {
      return res.json({
        status: -1,
        message: "Không tìm thấy người dùng này!",
        data: null,
      });
    }
    //check product is exit
    if (productID == null) {
      return res.json({
        status: -1,
        message: "Không tìm thấy sản phẩm này!",
        data: null,
      });
    }
    //get cart by user
    let userCart = await Cart.findOne({ userId: accountId });
    //check if product is exit in cart
    const cartDetail = userCart.cartDetail.filter(
      (data) => data.productId.toString() === productID.toString()
    );
    let cartDetailIndex = userCart.cartDetail.findIndex(
      (data) => data.productId.toString() === productID.toString()
    );

    if (cartDetail.length === 0) {
      return res.json({
        status: -1,
        message: "Sản phẩm không tồn tại trong giỏ hàng",
        data: {
          productID: productID,
        },
      });
    } else {
      let userCart = await Cart.findOne({ userId: accountId });
      userCart
        .updateOne({ $unset: { [`cartDetail.${cartDetailIndex}`]: 1 } })
        .then(async (data) => {
          userCart
            .update({ $pull: { cartDetail: null } })
            .then(async (data) => {
              return res.json({
                status: 1,
                message: "Đã xoá sản phẩm khỏi giỏ hàng",
                data: {
                  productID: productID,
                },
              });
            });
        });
    }
  } catch (error) {
    return res.json({
      status: -1,
      message: "Có sự cố xảy ra. Không xoá được sản phẩm!",
      data: {
        productID: productID,
      },
    });
  }
};
