const mongoose = require('mongoose')
const Schema = mongoose.Schema

const notification = new Schema({
  _id: {
    type: Schema.Types.ObjectId,
    required: true,
    auto: true
  },
  title: {
    type: String
  },
  message: {
    type: String
  },
  status: {
    type: Number,
    enum: [0, 1]
  },
  type: {
    type: Number
  },
  created_at: {
    type: Date,
    timezone: "Asia/Ho_Chi_Minh"
  },
  created_at: {
    type: Date,
    timezone: "Asia/Ho_Chi_Minh"
  },
  last_modified: {
    type: Date,
    timezone: "Asia/Ho_Chi_Minh",
    default: Date.now
  },
})

const accountSchema = new Schema({
  _id: {
    type: Schema.Types.ObjectId,
    required: true,
    // default: new ObjectId()
  },
  username: {
    type: String,
    require: true
  },
  password: {
    type: String,
    require: true
  },
  fullName: {
    type: String,
  },
  email: {
    type: String,
    require: true
  },
  phone: {
    type: String,
    default: null
  },
  address: {
    type: String,
    default: null
  },
  avatarUrl: {
    type: String,
    default: null
  },
  status: {
    type: Number,
    enum: [0, 1]
  },
  accRole: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  notificationToken: {
    token: {
      type: String,
      default: null
    },
    platform: {
      type: String,
      default: null
    }
  },
  notifications: [notification],
  lasted_login: {
    type: Date,
    default: null
  },
  created_at: {
    type: Date,
    timezone: "Asia/Ho_Chi_Minh"
  },
  delete_at: {
    type: Date,
    default: null,
    timezone: "Asia/Ho_Chi_Minh"
  },
  last_modified: {
    type: Date,
    default: Date.now,
    timezone: "Asia/Ho_Chi_Minh"
  }
})

const Account = mongoose.model('Account', accountSchema, 'Account')

module.exports = Account