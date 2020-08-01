const jwt = require("jsonwebtoken");

exports.getAccountId = (req, res) => {
  const bearerHeader = req.headers["authorization"];
  if (typeof bearerHeader !== "undefined") {
    const bearer = bearerHeader.split(" ");
    const bearerToken = bearer[1];
    let token = bearerToken;
    return jwt.verify(token, "jwt-secret", (err, data) => {
      if (err) {
        return null;
      } else {
        return data.id;
      }
    });
  }
  return null;
};
