const router = require("express").Router();

// Importing the relevant functions from the post controller
const {
  createComment,
  deleteComment,
  createMultipleComments,
} = require("../controller/comment");

// Create new post
router.post("/", createComment);
router.delete("/:id", deleteComment);
router.post("/multiple", createMultipleComments);

// Export router
module.exports = router;
