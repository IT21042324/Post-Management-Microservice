const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const validator = require("validator");

const bcrypt = require("bcryptjs");

const userSchema = new Schema(
  {
    userName: {
      type: String,
      required: true,
    },

    password: {
      type: String,
      required: true,
    },

    about: String,

    jobRole: String,

    skills: {
      type: Array,
      default: [],
    },

    token: { type: String, default: "None" },

    followers: {
      type: Array,
      default: [],
    },

    following: {
      type: Array,
      default: [],
    },

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

    posts: {
      type: Array,
      default: [],
    },

    likedPosts: {
      type: Array,
      default: [],
    },
  },
  { timestamps: true }
);

//Creating User schema functions
userSchema.statics.signup = async function (details) {
  const { userName, password } = details;

  if (!userName || !password) throw Error("Username or password missing");

  if (!validator.isEmail(userName)) throw Error("Email is invalid");

  const exist = await this.findOne({ userName });

  console.log(exist);

  if (exist) throw Error("Email is already in use");

  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);

  const singedUser = await this.create({
    userName,
    password: hash,
    ...details,
  });

  return singedUser; //To return a signedup new user object
};

userSchema.statics.login = async function (userName, password) {
  if (!userName || !password) throw Error("Username or password missing");

  const user = await this.findOne({ userName });
  if (!user) throw Error("User Name doesn't exist");

  // const match = await bcrypt.compare(password, user.password); //returns true or false

  // if (!match) throw Error("Incorrect Password");

  const updatedUser = await this.findOneAndUpdate(
    { userName: user.userName },
    { loginStatus: 1 },
    { new: true }
  );

  return updatedUser;
};

module.exports = mongoose.model("User", userSchema);
