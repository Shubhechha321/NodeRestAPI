require("dotenv").config();
const jwt = require("jsonwebtoken");

module.exports = {
  checkToken: (req, res, next) => {
    let token = req.get("authorization");
    if (token) {
      // remove the bearer
      token = token.slice(7); // or token.split(' ')[1];
      jwt.verify(token, process.env.JSON_KEY, (err, decoded) => {
        if (err) {
          return res.json({
            success: 0,
            message: "Invalid Token...",
          });
        } else {
          const id = req.url.slice(1);
          console.log("decoded", req);
          if (id == decoded.result._id) {
            req.decoded = decoded;
            next();
          } else {
            return res.json({
              success: 0,
              message: "You don't have permission",
            });
          }
        }
      });
    } else {
      return res.json({
        success: 0,
        message: "Access Denied! Unauthorized User",
      });
    }
  },
};
