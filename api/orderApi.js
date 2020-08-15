var Cart = require("../models/Cart");
var Order = require("../models/Order");
const Customer = require("../models/customer");
const API_URL = require("../config");
var jwt = require("jsonwebtoken");
let request = require("request-promise");
let base64 = require("base-64");
let mongoose = require("mongoose");
let handleAccountJwt = require("../handleAccountJwt");
const fs = require("fs");
const path = require("path");
let api = require("../config");
const PdfPrinter = require("pdfmake");

exports.newOrder = async (req, res) => {
  try {
    //get data when create new order
    let accountId = handleAccountJwt.getAccountId(req);
    let date = new Date();
    let { address, phone, cusName } = req.body;
    let today = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
    if (accountId == null) {
      return res.json({
        status: -1,
        message: "Không tìm thấy người dùng này!",
        data: null,
      });
    } else {
      let userCart = await Cart.findOne({ userId: accountId });
      let customer = await Customer.findOne({ _id: accountId });
      if (userCart !== null) {
        const cartDetail = userCart.cartDetail;
        const newOrder = new Order({
          _id: new mongoose.Types.ObjectId(),
          orderDetail: cartDetail,
          cusID: accountId,
          address: address,
          phone: phone,
          cusName: cusName,
          total: userCart.total,
          status: 0,
          created_at: today,
          last_modified: today,
        });

        await newOrder.save().then(async (data) => {
          if (data !== null) {
            userCart
              .updateOne({ $unset: { [`cartDetail`]: 1 }, total: 0 })
              .then(async (data) => {
                userCart.update({ $pull: { cartDetail: null } });
              });
            return res.json({
              status: 1,
              message: "Tạo hoá đơn thành công!",
              data: {
                orderId: newOrder._id,
              },
            });
          }
          return res.json({
            status: 1,
            message: "Tạo hoá đơn thành công!",
            data: {
              orderId: newOrder._id,
            },
          });
        });
      } else {
        return res.json({
          status: -1,
          message: "Tạo hoá đơn thất bại!",
          data: null,
        });
      }
    }
  } catch (error) {
    console.log(error);
    return res.json({
      status: -1,
      message: "Có sự cố xảy ra. Không tạo được hoá đơn!",
      data: null,
    });
  }
};
exports.listOrder = async (req, res) => {
  try {
    //get data when create new order
    let status = req.body.status;
    let accountId = handleAccountJwt.getAccountId(req);
    if (accountId == null) {
      return res.json({
        status: -1,
        message: "Không tìm thấy người dùng này!",
        data: null,
      });
    } else {
      let userOrder = await Order.find({
        cusID: accountId,
        status: status,
      });
      if (userOrder.length > 0) {
        return res.json({
          status: 1,
          message: "Lấy danh sách đơn hàng thành công!",
          data: userOrder,
        });
      } else {
        return res.json({
          status: -1,
          message: "Bạn không có đơn hàng nào!",
          data: null,
        });
      }
    }
  } catch (error) {
    return res.json({
      status: -1,
      message: "Có sự cố xảy ra. Không lấy được hoá đơn!",
      data: null,
    });
  }
};
exports.orderDetails = async (req, res) => {
  try {
    //get data when create new order
    let { status, orderID } = req.body;
    let accountId = handleAccountJwt.getAccountId(req);
    if (orderID == null) {
      return res.json({
        status: -1,
        message: "Không tìm thấy đơn hàng này!",
        data: null,
      });
    }
    if (accountId == null) {
      return res.json({
        status: -1,
        message: "Không tìm thấy người dùng này!",
        data: null,
      });
    } else {
      let userOrder = await Order.find({
        cusID: accountId,
        _id: orderID,
        status: status,
      });
      if (userOrder.length > 0) {
        return res.json({
          status: 1,
          message: "Lấy đơn hàng thành công!",
          data: userOrder[0],
        });
      } else {
        return res.json({
          status: -1,
          message: "Bạn không có đơn hàng nào!",
          data: null,
        });
      }
    }
  } catch (error) {
    return res.json({
      status: -1,
      message: "Có sự cố xảy ra. Không lấy được đơn hàng!",
      data: null,
    });
  }
};
//Xác nhận đã nhận được hàng
exports.ChangeStatus = async (req, res) => {
  try {
    let accountId = handleAccountJwt.getAccountId(req);
    let orderID = req.body.orderID;
    let status = parseInt(req.body.status);
    let date = new Date();
    let today = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
    let message = "Cập nhật đơn hàng thành công";
    switch (status) {
      case 0:
        message = "Đã đặt lại đơn hàng";
        break;
      case 2:
        message = "Đã xác nhận đơn hàng thành công";
        break;
      case -2:
        message = "Đã huỷ đơn hàng";
        break;
      default:
        message = "Cập nhật đơn hàng thành công";
        break;
    }
    if (orderID == null) {
      return res.json({
        status: -1,
        message: "Không tìm thấy hoá đơn này!",
        data: null,
      });
    }
    if (accountId == null) {
      return res.json({
        status: -1,
        message: "Không tìm thấy người dùng này!",
        data: null,
      });
    }
    await Order.findOneAndUpdate(
      {
        cusID: accountId,
        _id: orderID,
      },
      {
        $set: { status: status },
        last_modified: today,
      }
    ).then(async (data) => {
      if (data !== null) {
        return res.json({
          status: 1,
          message: message,
          data: {
            orderID: orderID,
          },
        });
      }
      return res.json({
        status: -1,
        message: "Xác nhận thất bại",
        data: {
          orderID: orderID,
        },
      });
    });
  } catch (error) {
    return res.json({
      status: -1,
      message: "Có sự cố xảy ra. Không cập nhật được hoá đơn!",
      data: null,
    });
  }
};
exports.downloadOrder = async (req, res) => {
  let orderID = req.body.orderID;
  let date = Date.now();
  try {
    const orderDownload = await Order.findOne({
      _id: orderID,
    });
    let result = [];
    let index = 1;
    let total = 0;
    let numProduct = 0;
    for (const detail of orderDownload.orderDetail) {
      let cost = parseInt(detail.price) * parseInt(detail.quan);
      result.push([index, detail.productName, detail.quan, detail.price, cost]);
      total += cost;
      (numProduct += detail.quan), ++index;
    }
    let name = orderDownload.cusName;
    let fileName = `${date}.pdf`;

    var fonts = {
      Roboto: {
        normal: path.join(__dirname, "..", "public/font/Roboto-Regular.ttf"),
        bold: path.join(__dirname, "..", "public/font/Roboto-Medium.ttf"),
        italics: path.join(
          __dirname,
          "..",
          "public/font/fontRoboto-Italic.ttf"
        ),
        bolditalics: path.join(
          __dirname,
          "..",
          "public/font/fontRoboto-MediumItalic.ttf"
        ),
      },
    };
    var printer = new PdfPrinter(fonts);

    var docDefinition = {
      content: [
        {
          image: "public/img/logo/Donchicken.jpg",
          width: 150,
          style: "logo",
        },
        {
          stack: [
            "Hoá đơn bán hàng",
            { text: `Số hoá đơn: ${orderID}`, style: "subheader" },
          ],
          style: "header",
        },
        "    ",
        "- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - ",
        {
          columns: [
            {
              text: "Khách hàng: ",
            },
            {
              text: orderDownload.cusName,
            },
          ],
          style: "infor",
        },
        {
          columns: [
            {
              text: "Địa chỉ: ",
            },
            {
              text: orderDownload.address,
            },
          ],
          style: "infor",
        },
        {
          columns: [
            {
              text: "SĐT: ",
            },
            {
              text: orderDownload.phone,
            },
          ],
          style: "infor",
        },
        "- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - ",
        {
          layout: "lightHorizontalLines",
          table: {
            headerRows: 1,
            widths: ["10%", "30%", "10%", "25%", "25%"],
            body: [
              [
                { text: "STT", bold: true },
                { text: "Tên SP", bold: true },
                { text: "SL", bold: true },
                { text: "Đơn giá", bold: true },
                { text: "Thành tiền", bold: true },
              ],
            ],
          },
          style: "table",
        },
        "- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - ",
        {
          columns: [
            {
              text: "Tổng số: ",
            },
            {
              text: numProduct,
            },
          ],
          style: "infor",
        },

        {
          columns: [
            {
              text: "Tổng tiền phải trả: ",
            },
            {
              text: `${total} VND`,
            },
          ],
          style: "infor",
        },

        "- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - ",
        {
          stack: [
            "Xin Chân Thành Cảm Ơn",
            " ",
            "Don Chicken",
            "65 Huỳnh Thúc Kháng - P.Bến Nghé - Q.1",
            {
              text: "Tel: +84378314546 Email: project@donchicken.com",
              style: "subheader",
            },
          ],
          style: "Address",
        },
      ],
      styles: {
        logo: {
          alignment: "center",
        },
        Address: {
          fontSize: 18,
          bold: false,
          alignment: "center",
          margin: [0, 20, 0, 0],
        },
        header: {
          fontSize: 18,
          bold: true,
          alignment: "center",
          margin: [0, 20, 0, 0],
        },
        infor: {
          fontSize: 16,
          margin: [0, 5, 0, 0],
        },
        table: {
          fontSize: 15,
          bold: false,
          margin: [0, 20, 0, 0],
        },
        subheader: {
          fontSize: 14,
        },
      },
    };
    for (const product of result) {
      docDefinition.content[8].table.body.push(product);
    }

    var pdfDoc = printer.createPdfKitDocument(docDefinition);

    pdfDoc.pipe(
      fs.createWriteStream(
        __dirname.replace("api", "") + `public/pdfFile/${fileName}`
      )
    );
    pdfDoc.end();

    return res.json({
      status: 1,
      message: "Thành công",
      data: {
        fileUrl: `http://localhost:8080/pdf/${fileName}`,
        fileName: name,
      },
    });
  } catch (error) {
    console.log(error);
    res.json({
      status: -1,
      message: "Có sự cố xảy ra. Không thể tải xuống thông hoá đơn này !",
      data: null,
    });
  }
};
