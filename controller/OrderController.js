var Order = require("../models/order");
const Account = require("../models/account");
let handleAccountJwt = require("../handleAccountJwt");
let api = require("../config");
API_URL = api.API_URL;
const fs = require("fs");
const path = require("path");
const PdfPrinter = require("pdfmake");

exports.getListOrder = async (req, res) => {
  try {
    let page = req.body.page;
    let status = parseInt(req.body.status);
    let limit = parseInt(req.body.limit);
    const listAll = Order.find({
      status: status,
    });
    let listOrder = await Order.find({
      status: status,
    })
      .skip(page * limit)
      .limit(limit);
    let countPage = parseInt((await listAll).length / limit);
    if ((await listAll).length % limit != 0) {
      countPage += 1;
    }
    return res.json({
      success: true,
      listOrder: listOrder,
      mgs: "Thành công ",
      countPage: countPage,
    });
  } catch (error) {
    console.log(error);
    return res.json({
      success: false,
      mgs: "Có lỗi xảy ra! Lấy danh sách thất bại",
    });
  }
};
exports.getListOrder1 = async (req, res) => {
  try {
    let page = 0;
    let status = 0;
    let limit = 5;
    const listAll = Order.find({
      status: status,
    });
    let listOrder = await Order.find({
      status: status,
    })
      .skip(page * limit)
      .limit(limit);
    let countPage = parseInt((await listAll).length / limit);
    if ((await listAll).length % limit != 0) {
      countPage += 1;
    }
    if (req.session.isLogin) {
      return res.render("ordered/ordered", {
        listOrder,
        mgs: "",
        countPage: countPage,
      });
    } else {
      return res.render("login/login");
    }
  } catch (error) {
    console.log(error);
    return res.send({ mgs: "Có lỗi xảy ra! Lấy danh sách thất bại" });
  }
};
exports.orderDetails = async (req, res) => {
  try {
    //get data when create new order
    let orderID = req.body.orderID;
    if (orderID == null) {
      return res.json({
        status: -1,
        message: "Không tìm thấy đơn hàng này!",
        data: null,
      });
    }
    let userOrder = await Order.find({
      _id: orderID,
    });
    if (userOrder.length > 0) {
      // console.log("xxx",userOrder[0].orderDetail)
      // console.log("xxx",userOrder[0])
      return res.json({
        success: true,
        mgs: "Lấy đơn hàng thành công!",
        userOrder: userOrder[0],
      });
    } else {
      return res.json({
        success: false,
        mgs: "Bạn không có đơn hàng nào!",
      });
    }
  } catch (error) {
    console.log(error);
    return res.json({
      success: false,
      mgs: "Có sự cố xảy ra. Không lấy được đơn hàng",
      data: null,
    });
  }
};
exports.changeStatus = async (req, res) => {
  try {
    // let accountId = handleAccountJwt.getAccountId(req)
    let orderID = req.body.orderId;
    let reasonCancel = req.body.reasonCancel;
    let status = parseInt(req.body.status);
    let date = new Date();
    let today = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
    if (orderID == null) {
      return res.json({
        status: -1,
        message: "Không tìm thấy hoá đơn này!",
        data: null,
      });
    }
    await Order.findOneAndUpdate(
      {
        _id: orderID,
      },
      {
        $set: { status: status },
        reasonCancel: reasonCancel,
        last_modified: today,
      }
    ).then(async (data) => {
      if (data !== null) {
        //send mail
        let order = await Order.findOne({
          _id: orderID,
        });
        let cusMail = order.email;

        return res.json({
          success: true,
          mgs: "Huỷ đơn hàng thành công!",
        });
      }
      return res.json({
        success: false,
        mgs: "Có sự cố xảy ra. Không thể huỷ đơn hàng!",
      });
    });
  } catch (error) {
    return res.json({
      success: false,
      mgs: "Có sự cố xảy ra. Không thể huỷ đơn hàng!",
    });
  }
};
exports.downloadOrder = async (req, res) => {
  try {
    let orderID = req.body.orderID;
    console.log(orderID);
    let date = Date.now();
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
      (numProduct += parseInt(detail.quan)), ++index;
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
        // {
        //   columns: [
        //     {
        //       text: 'Tổng cộng: '
        //     },
        //     {
        //       text: '9999999'
        //     }
        //   ],
        //   style: 'infor'
        // },
        // {
        //   columns: [
        //     {
        //       text: 'Chiết khấu: '
        //     },
        //     {
        //       text: '10'
        //     }
        //   ],
        //   style: 'infor'
        // },
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
              text: "Tel: +84352467247 Email: donchicken@gmail.com",
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
        __dirname.replace("controller", "") + `public/pdfFile/${fileName}`
      )
    );
    pdfDoc.end();
    return res.json({
      success: true,
      mgs: "Xuất hoá đơn thành công!",
      data: `http://localhost:8080/pdf/${fileName}`,
    });
  } catch (error) {
    console.log(error);
    return res.json({
      success: false,
      mgs: "Xuất hoá đơn thất bại!",
    });
  }
};
