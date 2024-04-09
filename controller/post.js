const postModel = require("../model/post");

const createPost = async (req, res) => {
  const post = req.body;

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
  const commentID = req.body.commendID;
  const userID = req.body.userID;

  try {
    const updatedPost = await postModel.findByIdAndUpdate(
      postID,
      { $push: { comments: { commentID } } },
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

//Extra Endpoint
//Get all postID with UserIds

const getAllPostIdWithUserID = async (req, res) => {
  try {
    const posts = await postModel.find({}, { postedBy: 1, _id: 1 });
    res.json(posts);
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
  postCommmentForPost,
  removeCommentFromPost,
  getAllPostWithDetails,
  getSinglePostWithDetails,
  getAllPostIdWithUserID,
};
