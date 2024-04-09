const router = require("express").Router();

// Importing the relevant functions from the post controller
const {
  createPost,
  getAllPosts,
  getPostById,
  updatePostById,
  fetchAllCommentsForPost,
  postCommmentForPost,
  removeCommentFromPost,
  getAllPostWithDetails,
  getSinglePostWithDetails,
} = require("../controller/post");

// Create new post
router.post("/", createPost);

// Get all posts
router.get("/", getAllPosts);

// Get a post by ID
router.get("/:id", getPostById);

// Update a post by ID
router.patch("/:id", updatePostById);

// Fetch all comments for a post
router.get("/:id/comments", fetchAllCommentsForPost);

// Post a comment for a post
router.patch("/:id/comments", postCommmentForPost);

// Remove a comment from a post
router.delete("/:id/comments", removeCommentFromPost);

// Get all posts with details
router.get("/details", getAllPostWithDetails);

// Get a single post with details
router.get("/:id/details", getSinglePostWithDetails);

// Export router
module.exports = router;
