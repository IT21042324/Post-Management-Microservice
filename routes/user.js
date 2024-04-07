const router = require("express").Router();

// Import controller functions
const { userLogin, userSignUp, getAllUsers } = require("../controller/user");

// User login route
router.post("/login", userLogin);

// User sign up route
router.post("/signup", userSignUp);

// Get all users route
router.get("/", getAllUsers);

module.exports = router;
