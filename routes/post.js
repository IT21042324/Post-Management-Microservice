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
  getAllPostIdWithUserID,
} = require("../controller/post");

// Create new post
router.post("/", createPost);

// Get all posts
router.get("/", getAllPosts);

//Extra route
//Get all postIDs with UserIDs
router.get("/users/ids", getAllPostIdWithUserID);

// Get all posts with details
router.get("/details", getAllPostWithDetails);

// Get a single post with details
router.get("/details/:id", getSinglePostWithDetails);

// Fetch all comments for a post
router.get("/comments/:id", fetchAllCommentsForPost);

// Post a comment for a post
router.patch("/comments/:id", postCommmentForPost);

// Remove a comment from a post
router.delete("/comments/:id", removeCommentFromPost);

// Get a post by ID
router.get("/:id", getPostById);

// Update a post by ID
router.patch("/:id", updatePostById);

// Export router
module.exports = router;
