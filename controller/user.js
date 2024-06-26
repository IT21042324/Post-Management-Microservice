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

    const tokenUpdatedUser = await userModel.findOneAndUpdate(
      { userName },
      { token, loginStatus: 1 },
      { new: true }
    );

    //send JWT and user data in response
    res.json({ ...tokenUpdatedUser.toObject() });
  } catch (err) {
    console.log(err.message);
    res.json({ err: err.message });
  }
};

const userSignUp = async function (req, res) {
  // Get user details from request body
  const { userName } = req.body;

  try {
    // Create new user using userModel's signup method
    const user = await userModel.signup(req.body);

    // Create JWT for new user
    const token = createToken(user._id);

    const tokenUpdatedUser = await userModel.findOneAndUpdate(
      { userName },
      { token, loginStatus: 1 },
      { new: true }
    );

    //send JWT and user data in response
    res.json({ ...tokenUpdatedUser.toObject() });
  } catch (err) {
    console.log(err.message);
    res.json({ err: err.message });
  }
};

const fetchUserByID = async function (req, res) {
  const userId = req.params.id;

  try {
    const user = await userModel.findById(userId);
    res.json(user);
  } catch (err) {
    res.send(err.message);
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

const logout = (req, res) => {
  const userId = req.params.id;

  const objToUpdate = {
    token: "None",
    loginStatus: 0,
  };

  try {
    const loggedOutUser = userModel.findByIdAndUpdate(userId, objToUpdate, {
      new: true,
    });

    res.json(loggedOutUser);
  } catch (err) {}
};

const addPostToUser = async (req, res) => {
  const userId = req.params.id;
  const post = req.body;

  try {
    const updatedUser = await userModel.findByIdAndUpdate(
      userId,
      { $push: { posts: post } },
      { new: true }
    );

    res.json(updatedUser);
  } catch (err) {
    res.send(err.message);
  }
};

const getAllPostsMadeByUser = async (req, res) => {
  const userId = req.params.id;

  try {
    const posts = await userModel.findById(userId, "posts");
    res.json(posts);
  } catch (err) {
    res.send(err.message);
  }
};

const updateAboutSection = async (req, res) => {
  const userId = req.params.id;
  const about = req.body.about;

  try {
    const updatedUser = await userModel.findByIdAndUpdate(
      userId,
      { about },
      { new: true }
    );

    res.json(updatedUser);
  } catch (err) {
    res.send(err.message);
  }
};

const addSkills = async (req, res) => {
  const userId = req.params.id;
  const skills = req.body.skills;

  try {
    const updatedUser = await userModel.findByIdAndUpdate(
      userId,
      { $push: { skills } },
      { new: true }
    );

    res.json(updatedUser);
  } catch (err) {
    res.send(err.message);
  }
};

const getAllSkillsOfUser = async (req, res) => {
  const userId = req.params.id;

  try {
    const skills = await userModel.findById(userId, "skills");
    res.json(skills);
  } catch (err) {
    res.send(err.message);
  }
};

const getAllUserIds = async (req, res) => {
  try {
    const users = await userModel.find({}, "_id"); // Only fetch the _id field
    res.json(users.map((usr) => usr._id));
  } catch (err) {
    res.send(err.message);
  }
};

// Export functions for use in other files
module.exports = {
  userSignUp,
  userLogin,
  getAllUsers,
  fetchUserByID,
  logout,
  addPostToUser,
  getAllPostsMadeByUser,
  updateAboutSection,
  addSkills,
  getAllSkillsOfUser,
  getAllUserIds,
};
