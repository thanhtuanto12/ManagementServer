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
const { query } = require("express");
const passport = require("passport");

API_URL = api.API_URL;

const getProductByID = async (productId) => {
  const productTypes = await ProductType.find();
  if (productTypes !== null) {
    for (let type of productTypes) {
      if (type.product !== undefined || type.product !== null) {
        for (let product of type.product) {
          if (product._id == productId) {
            return product;
          }
        }
      }
    }
  }
  return null;
};
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
      console.log("ssssssssssssssssssssss", userCart.total);
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
    let productId = req.body.productId;
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
    if (quan == null || quan == undefined) {
      return res.json({
        status: -1,
        message: "Vui lòng nhập số lượng!",
        data: null,
      });
    }
    quan = parseInt(quan);
    //check product is exit
    if (productId == null) {
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
      (data) => data.productId.toString() === productId.toString()
    );
    let cartDetailIndex = userCart.cartDetail.findIndex(
      (data) => data.productId.toString() === productId.toString()
    );
    if (cartDetail.length == 0) {
      //get productHave product

      // const productTypes = await ProductType.find()
      const productTypes = await ProductType.findOne({
        "product._id": productId,
      });
      const Products = productTypes.product.filter(
        (data) => data._id.toString() === productId.toString()
      );
      const Product = Products[0];
      let ProductPrice = Product.price;
      //add product to cart
      let newDetails = {
        _id: new mongoose.Types.ObjectId(),
        productName: Product.productName,
        productId: productId,
        quan: quan,
        price: Product.price,
        typeProduct: Product.typeProduct,
        productImg: Product.productImg,
        created_at: today,
        last_modified: today,
      };
      let oldTotal = 0;
      if (userCart.total !== null) {
        oldTotal = userCart.total;
      }
      let total = parseInt(oldTotal) + parseInt(quan) * parseInt(ProductPrice);
      //add to cart
      userCart = await Cart.findOneAndUpdate(
        { userId: accountId },
        {
          last_modified: today,
          total: total,
          $push: { cartDetail: newDetails },
        }
      ).then(async (data) => {
        if (data == null) {
          return res.json({
            status: -1,
            message: "Thêm vào giỏ hàng thất bại!",
            data: {
              productId: productId,
            },
          });
        }
        return res.json({
          status: 1,
          message: "Thêm vào giỏ hàng thành công!",
          data: {
            productId: productId,
          },
        });
      });
    } else {
      //edit quanti
      let oldTotal = 0;
      if (userCart.total !== null) {
        oldTotal = userCart.total;
      }
      let total = parseInt(oldTotal) + parseInt(quan) * parseInt(ProductPrice);
      let oldQuan = cartDetail[0].quan;
      let newQuan = parseInt(oldQuan) + quan;

      await Cart.findOneAndUpdate(
        {
          userId: accountId,
        },
        {
          $set: { [`cartDetail.${cartDetailIndex}.quan`]: newQuan },
          total: total,
        }
      ).then(async (data) => {
        if (data == null) {
          return res.json({
            status: -1,
            message: "Thêm vào giỏ hàng thất bại!",
            data: {
              productId: productId,
            },
          });
        }
        return res.json({
          status: 1,
          message: "Thêm vào giỏ hàng thành công!",
          data: {
            productId: productId,
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
    let productId = req.body.productId;
    let quan = parseInt(req.body.quan);
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
    if (productId == null) {
      return res.json({
        status: -1,
        message: "Không tìm thấy sản phẩm này!",
        data: null,
      });
    }
    //get cart by user
    let userCart = await Cart.findOne({ userId: accountId });
    let oldTotal = 0;
    if (userCart.total !== null) {
      oldTotal = userCart.total;
    }
    //check if product is exit in cart
    const cartDetail = userCart.cartDetail.filter(
      (data) => data.productId.toString() === productId.toString()
    );
    let cartDetailIndex = userCart.cartDetail.findIndex(
      (data) => data.productId.toString() === productId.toString()
    );

    if (cartDetail.length === 0) {
      return res.json({
        status: -1,
        message: "Sản phẩm không tồn tại trong giỏ hàng",
        data: {
          productId: productId,
        },
      });
    } else {
      //edit quanti
      let oldQuan = cartDetail[0].quan;
      let priceProduct = cartDetail[0].price;
      if (quan < 0) {
        if (oldQuan > 1) {
          let newQuan = parseInt(oldQuan) + parseInt(quan);
          let newTotal = parseInt(oldTotal) - parseInt(priceProduct);
          await Cart.findOneAndUpdate(
            {
              userId: accountId,
            },
            {
              $set: { [`cartDetail.${cartDetailIndex}.quan`]: newQuan },
              total: newTotal,
            }
          ).then(async (data) => {
            if (data == null) {
              return res.json({
                status: -1,
                message: "Cập nhật số lượng thất bại!",
                data: {
                  productId: productId,
                },
              });
            }
            return res.json({
              status: 1,
              message: "Cập nhật số lượng thành công!",
              data: {
                productId: productId,
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
      } else {
        let newQuan = parseInt(oldQuan) + parseInt(quan);
        let newTotal = parseInt(oldTotal) + parseInt(priceProduct);
        await Cart.findOneAndUpdate(
          {
            userId: accountId,
          },
          {
            $set: { [`cartDetail.${cartDetailIndex}.quan`]: newQuan },
            total: newTotal,
          }
        ).then(async (data) => {
          if (data == null) {
            return res.json({
              status: -1,
              message: "Cập nhật số lượng thất bại!",
              data: {
                productId: productId,
              },
            });
          }
          return res.json({
            status: 1,
            message: "Cập nhật số lượng thành công!",
            data: {
              productId: productId,
            },
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
exports.changeQuanti2 = async (req, res) => {
  try {
    //get data when addproduct to cart
    let productId = req.body.productId;
    let quan = parseInt(req.body.quan);
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
    if (productId == null) {
      return res.json({
        status: -1,
        message: "Không tìm thấy sản phẩm này!",
        data: null,
      });
    }
    //get cart by user
    let userCart = await Cart.findOne({ userId: accountId });
    let oldTotal = 0;
    if (userCart.total !== null) {
      oldTotal = userCart.total;
    }
    //check if product is exit in cart
    const cartDetail = userCart.cartDetail.filter(
      (data) => data.productId.toString() === productId.toString()
    );
    let cartDetailIndex = userCart.cartDetail.findIndex(
      (data) => data.productId.toString() === productId.toString()
    );

    if (cartDetail.length === 0) {
      return res.json({
        status: -1,
        message: "Sản phẩm không tồn tại trong giỏ hàng",
        data: {
          productId: productId,
        },
      });
    } else {
      //edit quanti
      let oldQuan = cartDetail[0].quan;
      let priceProduct = cartDetail[0].price;
      let newTotal = parseInt(quan) * parseInt(priceProduct);
      await Cart.findOneAndUpdate(
        {
          userId: accountId,
        },
        {
          $set: { [`cartDetail.${cartDetailIndex}.quan`]: quan },
          total: newTotal,
        }
      ).then(async (data) => {
        if (data == null) {
          return res.json({
            status: -1,
            message: "Cập nhật số lượng thất bại!",
            data: {
              productId: productId,
            },
          });
        }
        return res.json({
          status: 1,
          message: "Cập nhật số lượng thành công!",
          data: {
            productId: productId,
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
exports.removeFromCart = async (req, res) => {
  try {
    //get data when addproduct to cart
    let productId = req.body.productId;
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
    if (productId == null) {
      return res.json({
        status: -1,
        message: "Không tìm thấy sản phẩm này!",
        data: null,
      });
    }
    //get cart by user
    let userCart = await Cart.findOne({ userId: accountId });
    let oldTotal = 0;
    if (userCart.total !== null) {
      oldTotal = userCart.total;
    }
    //check if product is exit in cart
    const cartDetail = userCart.cartDetail.filter(
      (data) => data.productId.toString() === productId.toString()
    );
    let cartDetailIndex = userCart.cartDetail.findIndex(
      (data) => data.productId.toString() === productId.toString()
    );
    let oldQuan = cartDetail[0].quan;
    let priceProduct = cartDetail[0].price;
    let newTotal =
      parseInt(oldTotal) - parseInt(oldQuan) * parseInt(priceProduct);
    if (cartDetail.length === 0) {
      return res.json({
        status: -1,
        message: "Sản phẩm không tồn tại trong giỏ hàng",
        data: {
          productId: productId,
        },
      });
    } else {
      let userCart = await Cart.findOne({ userId: accountId });
      userCart
        .updateOne({
          $unset: { [`cartDetail.${cartDetailIndex}`]: 1 },
          total: newTotal,
        })
        .then(async (data) => {
          userCart
            .update({ $pull: { cartDetail: null } })
            .then(async (data) => {
              return res.json({
                status: 1,
                message: "Đã xoá sản phẩm khỏi giỏ hàng",
                data: {
                  productId: productId,
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
        productId: productId,
      },
    });
  }
};
