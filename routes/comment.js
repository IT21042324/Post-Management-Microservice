const router = require("express").Router();

// Importing the relevant functions from the post controller
const { createComment } = require("../controller/comment");

// Create new post
router.post("/", createComment);

// Export router
module.exports = router;
