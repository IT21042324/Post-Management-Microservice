const postModel = require("../model/post");

const createPost = async (req, res) => {
  const post = req.body;
  post.postType =
    post.postType.charAt(0).toUpperCase() +
    post.postType.slice(1).toLowerCase()?.trim();

  // Check if postType is valid
  const validPostTypes = [
    "Text",
    "Image",
    "Video",
    "Document",
    "Event",
    "Article",
    "Poll",
    "Posting",
    "Job",
  ];

  if (!validPostTypes.includes(post.postType)) {
    return res.status(400).send("Invalid post type.");
  }

  try {
    const newPost = await postModel.create(post);
    res.json(newPost);
  } catch (err) {
    res.send(err.message);
  }
};

const getAllPosts = async (req, res) => {
  try {
    const posts = await postModel.find();
    res.json(posts);
  } catch (err) {
    res.send(err.message);
  }
};

const getPostById = async (req, res) => {
  try {
    const post = await postModel.findById(req.params.id);
    res.json(post);
  } catch (err) {
    res.send(err.message);
  }
};

const updatePostById = async (req, res) => {
  fieldsToUpdate = req.body;

  if (fieldsToUpdate?.postType) {
    const validPostTypes = [
      "Text",
      "Image",
      "Video",
      "Document",
      "Event",
      "Article",
      "Poll",
      "Posting",
      "Job",
    ];

    fieldsToUpdate.postType =
      fieldsToUpdate.postType.charAt(0).toUpperCase() +
      fieldsToUpdate.postType.slice(1).toLowerCase()?.trim();

    if (!validPostTypes.includes(post.postType)) {
      return res.status(400).send("Invalid post type.");
    }
  }

  try {
    const updatedPost = await postModel.findByIdAndUpdate(
      req.params.id,
      fieldsToUpdate,
      { new: true }
    );
    res.json(updatedPost);
  } catch (err) {
    res.send(err.message);
  }
};

const deletePostById = async (req, res) => {
  const postID = req.params.id;

  try {
    const deletedPost = await postModel.findByIdAndDelete(postID);
    res.json(deletedPost);
  } catch (err) {
    res.send(err.message);
  }
};

const fetchAllCommentsForPost = async (req, res) => {
  try {
    const postComments = await postModel
      .findById(req.params.id, "comments")
      .populate("comments.commentID");
    res.json({
      postID: req.params.id,
      postComments,
      totalComments: postComments.length,
    });
  } catch (err) {
    res.send(err.message);
  }
};

const postCommmentForPost = async (req, res) => {
  const postID = req.params.id;
  const commentID = req.body.commentID;

  try {
    const updatedPost = await postModel.findByIdAndUpdate(
      postID,
      { $push: { comments: commentID } },
      { new: true }
    );

    res.json(updatedPost);
  } catch (err) {
    res.send(err.message);
  }
};

const removeCommentFromPost = async (req, res) => {
  const postID = req.params.id;
  const commentID = req.body.commentID;

  try {
    const updatedPost = await postModel.findByIdAndUpdate(
      postID,
      { $pull: { comments: commentID } },
      { new: true }
    );
    res.json(updatedPost);
  } catch (err) {
    res.send(err.message);
  }
};

const getAllPostWithDetails = async (req, res) => {
  try {
    const posts = await postModel.find().populate("comments");
    res.json(posts);
  } catch (err) {
    res.send(err.message);
  }
};

const getSinglePostWithDetails = async (req, res) => {
  try {
    const post = await postModel.findById(req.params.id).populate("comments");

    res.json(post);
  } catch (err) {
    res.send(err.message);
  }
};

const searchPost = async (req, res) => {
  const { searchQuery, userID } = req.body;

  try {
    // Search in postTitle
    const titlePosts = await postModel.find({
      postTitle: { $regex: searchQuery?.trim(), $options: "i" },
      $or: [
        { visibility: "public" },
        { visibility: "private", visibilityMembersList: userID },
      ],
    });

    // Search in description
    const descriptionPosts = await postModel.find({
      description: { $regex: searchQuery?.trim(), $options: "i" },
      $or: [
        { visibility: "public" },
        { visibility: "private", visibilityMembersList: userID },
      ],
    });

    // Search in tags
    const tagsPosts = await postModel.find({
      tags: { $regex: searchQuery?.trim(), $options: "i" },
      $or: [
        { visibility: "public" },
        { visibility: "private", visibilityMembersList: userID },
      ],
    });

    // Search in postType
    const typePosts = await postModel.find({
      postType: { $regex: searchQuery?.trim(), $options: "i" },
      $or: [
        { visibility: "public" },
        { visibility: "private", visibilityMembersList: userID },
      ],
    });

    // Combine the results
    let posts = [
      ...titlePosts,
      ...descriptionPosts,
      ...tagsPosts,
      ...typePosts,
    ];

    // Remove duplicates
    const seen = new Set();

    posts = posts.filter((post) => {
      const duplicate = seen.has(post._id);
      seen.add(post._id);
      return !duplicate;
    });

    res.json(posts);
  } catch (err) {
    res.send(err.message);
  }
};

//visibility of the post
const updateVisibility = async (req, res) => {
  const { visibility } = req.body;
  const postId = req.params.id;

  try {
    // Validate visibility value
    if (visibility !== "public" && visibility !== "private") {
      return res
        .status(400)
        .json({ error: "Visibility must be either 'public' or 'private'." });
    }

    let updatedPost;
    if (visibility === "private") {
      // If visibility is set to private, update the post's visibility and set visibilityMembersList
      const { visibilityMembersList } = req.body;
      updatedPost = await postModel.findByIdAndUpdate(
        postId,
        { visibility, visibilityMembersList },
        { new: true }
      );
    } else {
      // If visibility is set to public, update the post's visibility and clear visibilityMembersList
      updatedPost = await postModel.findByIdAndUpdate(
        postId,
        { visibility, visibilityMembersList: [] }, // Clear visibilityMembersList
        { new: true }
      );
    }
    res.json(updatedPost);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const updateVisibilityMembersList = async (req, res) => {
  const { visibilityMembersList } = req.body;
  const postId = req.params.id;

  try {
    // Check if visibilityMembersList is provided
    if (!visibilityMembersList || visibilityMembersList.length === 0) {
      return res
        .status(400)
        .json({ error: "Visibility members list cannot be empty." });
    }

    // Update post's visibility to private and set visibilityMembersList
    const updatedPost = await postModel.findByIdAndUpdate(
      postId,
      { visibility: "private", visibilityMembersList },
      { new: true }
    );

    res.json(updatedPost);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const clearVisibilityMembersList = async (req, res) => {
  const postId = req.params.id;

  try {
    const updatedPost = await postModel.findByIdAndUpdate(
      postId,
      { visibilityMembersList: [] },
      { new: true }
    );
    res.json(updatedPost);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

//Extra Endpoint
//1. Get all postID with UserIds

const getAllPostIdWithUserID = async (req, res) => {
  try {
    const posts = await postModel.find({}, { postedBy: 1, _id: 1 });
    res.json(posts);
  } catch (err) {
    res.send(err.message);
  }
};

//2. Create Multiple Posts

const createMultiplePosts = async (req, res) => {
  const posts = req.body;

  try {
    const newPosts = await postModel.create(posts);
    res.json(newPosts);
  } catch (err) {
    res.send(err.message);
  }
};

//3. Get All Post IDS
const getAllPostIDs = async (req, res) => {
  try {
    const posts = await postModel.find({}, { _id: 1 });
    res.json(posts.map((post) => post._id));
  } catch (err) {
    res.send(err.message);
  }
};

module.exports = {
  createPost,
  getAllPosts,
  getPostById,
  updatePostById,
  fetchAllCommentsForPost,
  deletePostById,
  searchPost,
  postCommmentForPost,
  removeCommentFromPost,
  getAllPostWithDetails,
  getSinglePostWithDetails,
  getAllPostIdWithUserID,
  createMultiplePosts,
  getAllPostIDs,
  updateVisibility,
  updateVisibilityMembersList,
  clearVisibilityMembersList,
};
