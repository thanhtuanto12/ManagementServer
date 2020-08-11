const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const promotionsSchema = new Schema({
  _id: {
    type: Schema.Types.ObjectId,
    required: true,
    auto: true,
  },
  promotionsName: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    default: "Sản phẩm này chưa có mô tả",
  },
  promotionsImg: {
    type: String,
  },
  created_at: {
    type: Date,
  },
  delete_at: {
    type: Date,
    default: null,
  },
  last_modified: {
    type: Date,
    default: Date.now,
  },
});
const Promotions = mongoose.model("Promotions", promotionsSchema, "Promotions");

module.exports = Promotions;
