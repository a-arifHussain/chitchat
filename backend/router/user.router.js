const express = require("express");
const {
  handleUserLogin,
  handleUserSignUp,
  handleLogedInUser,
  handelUserSearch,
  handleAddFriend,
  handleUserLogOut,
  handleUpdateProfileImg,
} = require("../controller/user.controller");
const { restrictUserAuth } = require("../middleware/authUser");

const router = express.Router();

router.post("/login", handleUserLogin);

router.post("/signUp", handleUserSignUp);

router.get("/search/:name", restrictUserAuth, handelUserSearch);

router.patch("/addfriend/:id", restrictUserAuth, handleAddFriend);

router.get("/logedInUser", handleLogedInUser);

router.post("/logout", restrictUserAuth, handleUserLogOut);

router.post("/updateprofileimg", restrictUserAuth, handleUpdateProfileImg);

module.exports = router;
