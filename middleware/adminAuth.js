const Account = require('../models/account')
const handleAccountJwt = require('../handleAccountJwt')

const adminAuth = async (req, res, next) => {
  try {
    const bearerHeader = req.headers['authorization']

    if (typeof bearerHeader !== 'undefined') {
      const bearer = bearerHeader.split(' ')
      const bearerToken = bearer[1]
      req.token = bearerToken;

      if (req.token === 'admin') {
        return next()
      } else {
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
          if (account.accRole !== undefined && account.accRole === 'admin') {
            next()
          } else {
            return res.json({
              status: -1,
              message: 'Bạn không có quyền sử dụng tính năng này !',
              data: null
            })
          }
        }
      }
    }
  } catch (error) {
    console.log(error)
    return res.json({
      status: -1,
      message: 'Có lỗi xảy ra, không tìm thấy người dùng này',
      data: null,
    })
  }
}
module.exports = adminAuth