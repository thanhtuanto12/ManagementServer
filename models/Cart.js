const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const cartDetail = new Schema(
  {
    _id: {
      type: Schema.Types.ObjectId,
      required: true,
      auto: true,
    },
    productId: {
      type: Schema.Types.ObjectId,
      require: true,
    },
    productName: {
      type: String,
      require: true,
    },
    typeProduct: {
      type: String,
      require: true,
    },
    productImg: {
      type: String,
    },
    unit: {
      type: String,
      require: true,
    },
    quan: {
      type: String,
      require: true,
    },
    price: {
      type: String,
      require: true,
    },
    status: {
      type: Number,
      enum: [0, 1],
    },

    delete_at: {
      type: Date,
      timezone: "Asia/Ho_Chi_Minh",
    },
  },
  { Timestamp: true }
);

const cartSchema = new Schema(
  {
    _id: {
      type: Schema.Types.ObjectId,
      required: true,
      // default: new ObjectId()
    },
    cartDetail: [cartDetail],
    total: {
      type: String,
    },
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    delete_at: {
      type: Date,
      default: null,
      timezone: "Asia/Ho_Chi_Minh",
    },
  },
  { Timestamp: true }
);

const Cart = mongoose.model("Cart", cartSchema, "Cart");

module.exports = Cart;
