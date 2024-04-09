const router = require("express").Router();

// Import controller functions
const {
  userLogin,
  userSignUp,
  getAllUsers,
  logout,
  addPostToUser,
  getAllPostsMadeByUser,
  updateAboutSection,
  addSkills,
  getAllSkillsOfUser,
} = require("../controller/user");

// User login route
router.post("/login", userLogin);

// User sign up route
router.post("/signup", userSignUp);

// Get all users route
router.get("/", getAllUsers);

//Logout a specific user
router.patch("/logout/:id", logout);

//Add post to a specific user
router.patch("/addPost/:id", addPostToUser);

//Get all posts made by a specific user
router.get("/posts/:id", getAllPostsMadeByUser);

//Update about section of a specific user
router.patch("/updateAbout/:id", updateAboutSection);

//Add skills to a specific user
router.patch("/addSkills/:id", addSkills);

//Get all skills of a specific user
router.get("/skills/:id", getAllSkillsOfUser);

// Export router
module.exports = router;
