const Account = require('../models/account')
const handleAccountJwt = require('../handleAccountJwt')

const checkJwt = async (req, res, next) => {
  try {
    const bearerHeader = req.headers['authorization']

    if (typeof bearerHeader !== 'undefined') {
      const bearer = bearerHeader.split(' ')
      const bearerToken = bearer[1]
      req.token = bearerToken;

      let accountId = handleAccountJwt.getAccountId(req)
      const account = await Account.findOne(
        { _id: accountId }
      )
      if (account === null || account === undefined) {
        return res.json({
          status: -1,
          message: 'Không tìm thấy người dùng này !',
          data: null,
        })
      } else {
        next()
      }
    } else {
      return res.json({
        status: -1,
        message: 'Vui lòng đăng nhập để sử dụng tính năng này!',
        data: null,
      })
    }
  } catch (error) {
    return res.json({
      status: -1,
      message: 'Có lỗi xảy ra, không lấy được thông tin người dùng!',
      data: null,
    })
  }
}

module.exports = checkJwt