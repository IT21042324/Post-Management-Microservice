const post = require("../model/post");
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

const postCommmentForPost = async (req, res) => {
  const postId = req.params.id;
  const comment = req.body.comment;
  const userID = req.body.userID;

  try {
    const updatedPost = await postModel.findByIdAndDelete(
      postId,
      { $push: { comments: { userID, comment } } },
      { new: true }
    );

    res.json(updatedPost);
  } catch (err) {
    res.send(err.message);
  }
};

const fetchAllCommentsForPost = async (req, res) => {
  try {
    const postComments = await postModel.findById(req.params.id, "comments");
    res.json({
      postID: req.params.id,
      postComments,
      totalComments: postComments.length,
    });
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
  postCommmentForPost,
};
