const express = require("express");
const {
  handleMessageCreate,
  handleFetchAllMessage,
} = require("../controller/message.controller");

const router = express.Router();

router.post("/create/:id", handleMessageCreate);

router.get("/allmessage/:id", handleFetchAllMessage);

module.exports = router;
