const User = require("../models/user.model");
const { extractPublicId, cloudinary } = require("../service/cloudinary");
const { createToken, verifyToken } = require("../service/jwtAuth");
const fs = require("fs");
async function handleUserLogin(req, res) {
  const body = req.body;
  if (!body) return res.json({ msg: " request body undefined" });

  const user = await User.findOneAndUpdate(
    { email: body.email },
    { isOnline: true },
    { returnDocument: "after" },
  ).populate("friends");

  if (!user) return res.status(404).json({ msg: "user not found" });
  // console.log(
  //   "_id",
  //   user._id,
  //   "email",
  //   user.email,
  //   "name",
  //   user.name,
  //   "profileImg",
  //   user.profileImg,
  //   "lastSeen",
  //   user.lastSeen,
  //   "isOnline",
  //   user.isOnline,
  // );
  const isPasswordMatch = await user.matchUserPassword(body.password);

  if (!isPasswordMatch) {
    return res.json({ msg: "Incorrect password.." });
  }

  const token = createToken({
    _id: user._id,
    email: user.email,
    name: user.name,
    profileImg: user.profileImg,
    lastSeen: user.lastSeen,
    isOnline: user.isOnline,
  });

  if (!token) return res.json({ msg: "user not found" });

  res.cookie("token", token, {
    httpOnly: true, // prevents JS access in browser
    secure: true, // only over HTTPS
    sameSite: "none", // allow cross-site requests
  });
  return res.json(user);
}

async function handleUserSignUp(req, res) {
  try {
    const { email, name, password } = req.body;
    const user = await User.create({ email, name, password });
    return res.json({ msg: "user created", user: user });
  } catch (err) {
    return res.json({ msg: "error in user SignUp", err });
  }
}

// NO need to continue we will remove this later..

async function handleLogedInUser(req, res) {
  const token = req.cookies.token;
  if (!token)
    return res
      .status(401)
      .json({ msg: "user not Loged In || token not found" });
  // console.log(token, " token from logedINUser");
  const user = verifyToken(token);
  if (!user) return res.status(404).json({ msg: " user not logged in" });
  // console.log(user, "from logedinuser");

  // user update to online :-
  const latestUser = await User.findOne({ email: user.email }).populate(
    "friends",
  );
  return res.json(latestUser);
}

const handelUserSearch = async (req, res) => {
  try {
    const search = req.params.name;
    const result = await User.find({
      $or: [{ name: search }, { email: search }],
    });
    if (!result) return res.status(404).json({ msg: "user not found" });
    res.json(result);
  } catch (err) {
    console.log(err);
    return res.json(err);
  }
};

const handleAddFriend = async (req, res) => {
  const friendId = req.params.id;
  const user = req.user;
  try {
    const userResult = await User.findByIdAndUpdate(
      user._id,
      {
        $addToSet: { friends: friendId },
      },
      { returnDocument: "after" },
    ).populate("friends");
    // adding user to friends
    await User.findByIdAndUpdate(friendId, {
      $addToSet: { friends: user._id },
    });
    // console.log(friendId, " friendsID");
    // console.log(req.user, "sender user");
    res.json(userResult);
  } catch (err) {
    res.json({ err });
    console.log(err);
  }
};

const handleUpdateProfileImg = async (req, res) => {
  const userId = req.user._id;
  const { oldUrl } = req.body;
  const image = req.files?.image;
  const oldPublicID = extractPublicId(oldUrl);
  console.log(userId, oldUrl, image, oldPublicID);
  try {
    if (image) {
      if (oldPublicID) {
        await cloudinary.uploader.destroy(oldPublicID);
      }
      const result = await cloudinary.uploader.upload(image.tempFilePath, {
        folder: "chitchat_app",
      });

      const profileImg = result.secure_url;

      // ✅ Remove temp file after upload
      fs.unlink(image.tempFilePath, (err) => {
        if (err) {
          console.error("Error deleting temp file:", err);
        } else {
          console.log("Temp file deleted successfully");
        }
      });

      const updatedUser = await User.findByIdAndUpdate(
        userId,
        { profileImg },
        { returnDocument: "after" },
      ).populate("friends");
      res.json(updatedUser);
    }
  } catch (err) {
    console.log(err);
    res.json(err);
  }
};

const handleUserLogOut = async (req, res) => {
  const user = req.user;
  await User.findByIdAndUpdate(user._id, {
    isOnline: false,
    lastSeen: Date.now(),
  });
  res.cookie("token", "", {
    httpOnly: true, // prevents JS access in browser
    secure: true, // only over HTTPS
    sameSite: "none", // allow cross-site requests
  });
  res.json({ msg: `${user.name} is logged out..` });
};

module.exports = {
  handleUserLogin,
  handleUserSignUp,
  handleLogedInUser,
  handelUserSearch,
  handleAddFriend,
  handleUserLogOut,
  handleUpdateProfileImg,
};
