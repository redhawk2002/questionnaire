const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "please enter a name"],
  },

  email: {
    type: String,
    requied: [true, "Please enter a email"],
    unique: [true, "Email already exists"],
  },
  password: {
    type: String,

    minlength: [6, "password must be at least 6 characters"],
    select: false,
  },
  phone_number: {
    type: String,
    minlength: [
      13,
      "please add proper phone number with proper country code for eg: +91XXXXXXXXXX",
    ],
    maxlength: [
      13,
      "please add proper phone number with proper country code for eg: +91XXXXXXXXXX",
    ],
    default: "0000000000000",
  },
  testID: {
    type: String,
    default: -1,
  },

  answer: [],
});

userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});
userSchema.methods.generateToken = function () {
  return jwt.sign({ _id: this._id }, process.env.JWT_SECRET);
};
module.exports = mongoose.model("User", userSchema);
