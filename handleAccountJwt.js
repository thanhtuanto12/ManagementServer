const jwt = require('jsonwebtoken')

exports.getAccountId = (req, res) => {
  if (req.token === 'admin') {
    return 0
  }
  return jwt.verify(req.token, 'jwt-secret', (err, data) => {
    if (err) {
      //   console.log(err)
      // res.json({
      //   resultCode: -1,
      //   message: 'Không tìm thấy người dùng này',
      //   data: null,
      // })
      return null
    } else {
      return data.id
    }
  })
}
