const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const validator = require("validator");

const bcrypt = require("bcryptjs");
const { type } = require("os");

const userSchema = new Schema({
  userName: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  token: { type: String, default: "None" },
  followers: Array,
  following: Array,
  accStatus: {
    type: Boolean,
    default: 1,
  },
  loginStatus: {
    type: Boolean,
    default: 0,
  },
  twoFactorAuthenticationStatus: {
    type: Boolean,
    default: 0,
  },
});

//Creating User schema functions
userSchema.statics.signup = async function (userName, password) {
  if (!userName || !password) throw Error("Username or password missing");

  if (!validator.isEmail(userName)) throw Error("Email is invalid");

  const exist = await this.find({ userName });

  if (exist) throw Error("Email is already in use");

  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);

  const singedUser = await this.create({
    userName,
    password: hash,
  });

  return singedUser; //To return a signedup new user object
};

userSchema.statics.login = async function (userName, password) {
  if (!userName || !password) throw Error("Username or password missing");

  const user = await this.findOne({ userName });
  if (!user) throw Error("User Name doesn't exist");

  const match = await bcrypt.compare(password, user.password); //returns true or false

  if (!match) throw Error("Incorrect Password");

  const updatedUser = await this.findOneAndUpdate(
    { userName: user.userName },
    { loginStatus: 1 },
    { new: true }
  );

  return updatedUser;
};

module.exports = mongoose.model("User", userSchema);
