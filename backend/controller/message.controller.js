const Message = require("../models/message.model");
const { cloudinary } = require("../service/cloudinary");
const { getIO, getSocketId } = require("../service/webSocket");
const fs = require("fs");
const handleMessageCreate = async (req, res) => {
  try {
    const io = getIO();
    const user = req.user;
    const friendsId = req.params.id;
    const image = req.files?.messageImage;
    const { messageText } = req.body;

    //   uploading image to cloudinary
    let imageUrl = "";
    if (image) {
      const result = await cloudinary.uploader.upload(image.tempFilePath, {
        folder: "chitchat_app",
      });
      imageUrl = result.secure_url;

      // ✅ Remove temp file after upload
      fs.unlink(image.tempFilePath, (err) => {
        if (err) {
          console.error("Error deleting temp file:", err);
        } else {
          console.log("Temp file deleted successfully");
        }
      });
    }
    if (imageUrl || messageText) {
      await Message.create({
        text: messageText,
        sender: user._id,
        receiver: friendsId,
        imageUrl: imageUrl,
      });
    }
    const message = await Message.find({
      $or: [
        { sender: user._id, receiver: friendsId },
        { sender: friendsId, receiver: user._id },
      ],
    })
      .sort({ createdAt: 1 })
      .populate("sender")
      .populate("receiver");

    //socket ->
    const friendSocketId = getSocketId(friendsId);
    io.to(friendSocketId).emit("newMessage", {
      sender: user._id,
      message: JSON.stringify(message),
    });

    res.status(200).json(message);
  } catch (err) {
    res.status(500).json({ msg: "server error" });
    console.log(err);
  }
};

const handleFetchAllMessage = async (req, res) => {
  const friendId = req.params.id;
  const userId = req.user?._id;
  try {
    const message = await Message.find({
      $or: [
        { sender: userId, receiver: friendId },
        { sender: friendId, receiver: userId },
      ],
    })
      .sort({ createdAt: 1 })
      .populate("sender")
      .populate("receiver");
    return res.json(message);
  } catch (err) {
    console.log(err);
    res.json(err);
  }
};

module.exports = {
  handleMessageCreate,
  handleFetchAllMessage,
};
