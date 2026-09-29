const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const userShema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    lastSeen: {
      type: Date,
      default: Date.now(),
    },
    isOnline: {
      type: Boolean,
      default: false,
    },
    profileImg: {
      type: String,
      default:
        "https://tse3.mm.bing.net/th/id/OIP.7rmrXPmCj0PYE-kSH9swIgHaHa?r=0&pid=Api&P=0&h=180",
    },

    friends: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  { timestamps: true },
);

//create hash of user password

userShema.pre("save", async function () {
  if (!this.isModified("password")) return next();
  try {
    const saltRound = 10;
    this.password = await bcrypt.hash(this.password, saltRound);
  } catch (err) {
    console.log(err);
  }
});

// matching the user password

userShema.methods.matchUserPassword = async function (givenPassword) {
  const isMatch = await bcrypt.compare(givenPassword, this.password);

  return isMatch;
};

const User = mongoose.model("User", userShema);

module.exports = User;
