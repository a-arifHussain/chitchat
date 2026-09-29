const { verifyToken } = require("../service/jwtAuth");

const restrictUserAuth = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) return res.status(401).json({ msg: "token not found" });

  const user = verifyToken(token);
  if (!user) return res.status(402).json({ msg: "user not logedin" });
  req.user = user;
  next();
};

module.exports = {
  restrictUserAuth,
};
