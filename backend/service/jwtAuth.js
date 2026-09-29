const jwt = require("jsonwebtoken");
require("dotenv").config();

const secret = process.env.JWT_SECRET;

const createToken = (user) => {
  const token = jwt.sign({ ...user }, secret);
  return token;
};

const verifyToken = (token) => {
  const user = jwt.verify(token, secret);
  return user;
};

module.exports = {
  createToken,
  verifyToken,
};
