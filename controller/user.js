const userModel = require("../model/user");
const jwt = require("jsonwebtoken");

//To generate a token
const createToken = (id) => {
  return jwt.sign({ id }, process.env.SECRET, { expiresIn: "3d" });
  //1st argument->object for payload
  //2nd argument-> secret string only know for our server (.env file)
  //3rd argument-> optional. just to say it expires in 3 days
};
const userLogin = async (req, res) => {
  try {
    // Get userName, password, and role from request body
    const { userName, password } = req.body;

    // Authenticate user using userModel's login method
    const user = await userModel.login(userName, password);

    // Create JWT for authenticated user
    const token = createToken(user._id);

    // Send JWT and user data in response
    res.json({ ...user.toObject(), token });
  } catch (err) {
    console.log(err.message);
    res.json({ err: err.message });
  }
};

const userSignUp = async function (req, res) {
  // Get user details from request body
  const { userName, password } = req.body;

  try {
    // Create new user using userModel's signup method
    const user = await userModel.signup(userName, password);

    // Create JWT for new user
    const token = createToken(user._id);

    // Send JWT and user data in response
    res.json({ ...user.toObject(), token });
  } catch (err) {
    console.log(err.message);
    res.json({ err: err.message });
  }
};

const getAllUsers = async function (req, res) {
  try {
    // Get all users from MongoDB database using Mongoose, excluding the image field
    const users = await userModel.find();

    // Send users and user count in response
    res.json(users);
  } catch (err) {
    res.send(err.message);
  }
};

// Export functions for use in other files
module.exports = {
  userSignUp,
  userLogin,
  getAllUsers,
};
