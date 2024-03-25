const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const errorHandler = require("./errorHandler");

const validateToken = asyncHandler(async (req, res, next) => {
  let token;
  let authHeader = req.headers.Authorization || req.headers.authorization;
  if (authHeader && authHeader.startsWith("Bearer")) {
    token = authHeader.split(" ")[1];
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        res
          .status(401)
          .json({ error: "Validation failed", message: err.message });
      } else {
        req.user = decoded;
        next();
      }
    });
  } else {
    res
      .status(401)
      .json({ error: "Validation failed", message: "User is not authorized" });
  }
});

module.exports = validateToken;
